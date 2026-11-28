/* ===================== ONLINE PLAY =====================
   Two people on their own devices. Both pages run the same game in lockstep: the host picks a random seed,
   both start the identical game from it, and each page shares only its own moves (in its room presence).
   Each page applies both players' moves in turn order, so both arrive at the same game without ever sending it.
   Moves are kept on this device too, so a reload can rejoin the room and replay them. */
let NET = null, ROOM_NS;
const NET_V = 6;
const netCards = () => [...new Set([...Object.keys(DEFS), ...Object.keys(BDEFS)])].sort();
const netIx = n => { const k = netCards().indexOf(n); return k < 0 ? n : k; };
const netName = x => typeof x === 'number' ? netCards()[x] : x;
function netHash(){
  const src = JSON.stringify([RULES, netCards().map(n => DEFS[n] ? [n, DEFS[n].c, DEFS[n].n, DEFS[n].p] : [n, BDEFS[n].c, BDEFS[n].n, BDEFS[n].lv, !!BDEFS[n].always])]);
  let h = 2166136261; for (let k = 0; k < src.length; k++){ h ^= src.charCodeAt(k); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
const netCode = () => Array.from({length:6}, () => 'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 31)]).join('');
const actsOf = i => i === NET.seat ? NET.acts : NET.peerActs;
// UI helpers that use the game's random numbers (deck suggestions, reminders) run on a copy, so both pages stay in step
function netClone(fn){
  if (!G || !G.net) return fn();
  const real = G, c = JSON.parse(JSON.stringify(G, (k, v) => k === 'rnd' ? undefined : v)); c.rnd = Math.random;
  G = c; try{ return fn(); } finally { G = real; }
}
async function roomNS(){
  if (ROOM_NS !== undefined) return ROOM_NS;
  ROOM_NS = window.Peer ? {join: (name, o) => peerJoin(name, o || {})} : null;
  return ROOM_NS;
}
/* Relay servers (TURN, from Metered's free Open Relay) for when two networks can't connect directly.
   Fetched once per page; if the fetch fails, PeerJS's built-in servers are used instead. */
const NET_RELAY = 'https://stateofwar.metered.live/api/v1/turn/credentials?apiKey=d64e55ce7966c2732dce4fb36c5bbc9e074b';
let NET_ICE = null;
function netIce(){
  if (!NET_ICE) NET_ICE = Promise.race([
    fetch(NET_RELAY).then(r => r.ok ? r.json() : null).then(a => Array.isArray(a) && a.length ? [{urls:'stun:stun.l.google.com:19302'}, ...a] : null),
    new Promise(res => setTimeout(() => res(null), 5000))
  ]).catch(() => null).then(a => { if (!a) NET_ICE = null; return a; });
  return NET_ICE;
}
/* Direct browser-to-browser link (WebRTC through the free PeerJS service, with a relay if needed). The host
   registers the room code; the guest connects to it. Each side sends its presence (name + moves) whenever it changes.
   link: '' (fine or still trying), 'nohost' (the service has no room with this code), 'nolink' (the room is there
   but the two devices couldn't connect). */
function peerJoin(name, o){
  const id = 'sowpg-' + name, host = !!o.host, conns = new Map(), handlers = [], errs = [];
  let me = {}, peer = null, left = false, retryT = null, tries = 0, link = '', ice = null, starting = false;
  const fail = msg => errs.forEach(f => { try{ f({code:'upstream_error', message:msg}); }catch(e){} });
  const emitPeers = () => {
    const peers = [{peer:'me', isMe:true, sameTab:true, presence:me}];
    for (const r of conns.values()) if (r.open && r.pres) peers.push({peer:r.conn.peer, isMe:false, sameTab:false, presence:r.pres});
    handlers.forEach(h => h({peers, joined:[], left:[], updated:[]}));
  };
  const wire = conn => {
    const r = {conn, pres:null, open:false};
    if (!host) setTimeout(() => { if (!r.open && !left){ link = 'nolink'; try{ conn.close(); }catch(e){} emitPeers(); retry(); } }, 15000);
    conn.on('open', () => {
      r.open = true; tries = 0; link = '';
      if (host) for (const [k, o2] of conns) if (k !== conn.peer){ try{ o2.conn.close(); }catch(e){} conns.delete(k); }   // newest guest connection wins (a reload rejoins)
      conns.set(conn.peer, r); try{ conn.send({t:'p', p:me}); }catch(e){} emitPeers();
    });
    conn.on('data', d => { if (d && d.t === 'p' && d.p && typeof d.p === 'object'){ r.pres = d.p; emitPeers(); } });
    conn.on('close', () => { if (!r.open && !host && link !== 'nohost') link = 'nolink'; if (conns.get(conn.peer) === r) conns.delete(conn.peer); emitPeers(); if (!host) retry(); });
    conn.on('error', () => { if (!r.open && !host && link !== 'nohost'){ link = 'nolink'; emitPeers(); } });
  };
  const connect = () => { if (left || !peer || peer.destroyed) return; if ([...conns.values()].some(r => r.open)) return; wire(peer.connect(id, {reliable:true})); };
  const retry = () => { if (left) return; clearTimeout(retryT); retryT = setTimeout(() => { if (peer && peer.disconnected && !peer.destroyed) peer.reconnect(); else connect(); }, Math.min(8000, 1500 + 1000 * tries++)); };
  const start = async () => {
    if (left || starting || (peer && !peer.destroyed)) return;
    starting = true;
    if (!ice) ice = await netIce();
    starting = false;
    if (left) return;
    const opts = ice ? {config:{iceServers:ice, sdpSemantics:'unified-plan'}} : {};
    peer = host ? new Peer(id, opts) : new Peer(opts);
    peer.on('open', () => { tries = 0; emitPeers(); if (!host) connect(); });
    if (host) peer.on('connection', wire);
    peer.on('disconnected', () => { emitPeers(); if (!left) setTimeout(() => { if (!left && peer && peer.disconnected && !peer.destroyed) peer.reconnect(); }, 1500); });
    peer.on('error', e => {
      const t = e && e.type;
      if (t === 'peer-unavailable'){ link = 'nohost'; emitPeers(); retry(); return; }   // nobody hosting yet: keep trying
      if (t === 'unavailable-id'){   // our old registration is still closing (after a reload), or the code is taken: try again shortly
        try{ peer.destroy(); }catch(e2){} if (tries++ > 8){ fail('That room code is already in use. Leave and create a new room.'); return; }
        setTimeout(start, 2500); return;
      }
      if (t === 'browser-incompatible'){ fail("This browser can't make direct connections. Try an up-to-date Chrome, Edge, Firefox or Safari."); return; }
      if (t === 'network' || t === 'server-error' || t === 'socket-error' || t === 'socket-closed'){
        if (tries++ > 6){ fail("Couldn't reach the connection service. Check your internet connection, then reload and rejoin."); return; }
        try{ peer.destroy(); }catch(e2){} setTimeout(start, 3000); return;
      }
      retry();
    });
  };
  const wake = () => {
    if (left || document.visibilityState === 'hidden') return;
    if (!peer || peer.destroyed){ start(); return; }
    if (peer.disconnected){ try{ peer.reconnect(); }catch(e){} return; }
    if (!host && ![...conns.values()].some(r => r.open)){ tries = 0; clearTimeout(retryT); connect(); }
  };
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('online', wake);
  window.addEventListener('pageshow', wake);
  start();
  return Promise.resolve({
    name,
    presence: async patch => { me = {...me, ...patch}; for (const r of conns.values()) if (r.open){ try{ r.conn.send({t:'p', p:me}); }catch(e){} } emitPeers(); },
    onPeers: (h, onErr) => { handlers.push(h); if (onErr) errs.push(onErr); setTimeout(emitPeers, 0); return () => {}; },
    peers: () => [],
    leave: async () => { left = true; clearTimeout(retryT); document.removeEventListener('visibilitychange', wake); window.removeEventListener('online', wake); window.removeEventListener('pageshow', wake); try{ peer && peer.destroy(); }catch(e){} },
    connected: () => !!(peer && peer.open && !peer.disconnected),
    link: () => link
  });
}
function netSave(){ if (NET && NET.seat != null) LS.set('sow-net', {v:NET_V, code:NET.code, seat:NET.seat, name:NET.name, acts:NET.acts, seed:NET.seed, target:NET.target, mir:NET.mir, bmir:NET.bmir, rf:NET.rf, su:NET.su, ready:NET.ready, at:Date.now()}); }
function netPresence(){
  if (!NET || !NET.room || NET.seat == null) return;
  const pr = {app:'sow', v:NET_V, code:NET.code, seat:NET.seat, name:NET.name, hash:NET.hash, acts:NET.acts};
  if (NET.seat === 0) Object.assign(pr, {seed:NET.seed, target:NET.target, mir:NET.mir !== false, bmir:NET.bmir === true, rf:NET.rf === true, su:NET.su});
  else pr.ready = !!NET.ready;
  if (JSON.stringify(pr).length > 4000){ NET.err = 'This game has grown too long to keep in sync online.'; renderPlay(); return; }
  NET.room.presence(pr).catch(() => {});
}
async function netOpen(opts){
  const room = await roomNS();
  if (!room){ ui.netErr = "Online play couldn't load its connection library. Reload the page and try again."; renderPlay(); return; }
  let r;
  try{ r = await room.join('sow-' + opts.code, {host:opts.seat === 0}); }
  catch(e){ ui.netErr = e && e.code === 'not_permitted' ? "Your access to this page doesn't include live rooms. Ask the page's owner to invite you by email from the Share menu." : "Couldn't open the room. Try again in a moment."; renderPlay(); return; }
  NET = {code:opts.code, seat:opts.seat, name:opts.name, seed:opts.seed, target:opts.target, mir:opts.mir !== false, bmir:opts.bmir === true, rf:opts.rf === true, su:opts.su || null, ready:opts.seat === 0 || !!opts.ready || !!(opts.acts && opts.acts.length), acts:opts.acts || [], peerActs:[], peer:null,
    hash:netHash(), room:r, applied:[0, 0], started:false, here:false, err:'', since:Date.now(), needShop:false, live:false};
  ui.netErr = ''; ui.start = false;
  r.onPeers(netPeers, e => { if (NET && NET.room === r){ NET.err = (e && e.message) || 'Lost the connection to the room. Reload the page and rejoin it from Play online.'; renderPlay(); } });
  if (NET.seat != null){ netSave(); netPresence(); }
  renderPlay();
  setTimeout(() => { if (NET && NET.room === r && !NET.started) renderPlay(); }, 7000);   // update the "nobody here yet" hint
}
function netLeave(){
  if (!NET) return;
  const r = NET.room; NET = null; LS.set('sow-net', null);
  if (r) r.leave().catch(() => {});
  if (G && G.net){ G = null; ui = {}; }
}
function netPeers(ch){
  if (!NET) return;
  const mine = p => p.presence && p.presence.app === 'sow' && p.presence.code === NET.code && !p.sameTab;
  const others = ch.peers.filter(mine);
  if (NET.seat == null){   // joining: take seat 1 if the host is here and nobody else has it
    const host = others.find(p => p.presence.seat === 0), taken = others.find(p => p.presence.seat === 1);
    if (taken){ NET.err = 'That room already has two players.'; renderPlay(); return; }
    if (!host){ renderPlay(); return; }
    NET.seat = 1; netSave(); netPresence();
  }
  const opp = others.find(p => p.presence.seat === 1 - NET.seat);
  const wasHere = NET.here; NET.here = !!opp;
  if (opp){
    const pr = opp.presence;
    if (pr.v !== NET_V){ NET.err = 'Your friend has a different version of this page open. Both of you reload it and try again.'; renderPlay(); return; }
    if (pr.hash !== NET.hash){ NET.err = "Your card numbers don't match your friend's (custom balance or a different version). Both of you reload the page."; renderPlay(); return; }
    NET.peer = {name:String(pr.name || 'Friend').slice(0, 16), seed:pr.seed, target:pr.target};
    if (NET.seat === 1){ NET.seed = pr.seed; NET.target = pr.target; NET.mir = pr.mir !== false; NET.bmir = pr.bmir === true; NET.rf = pr.rf === true; NET.su = pr.su || null; }
    NET.peerReady = NET.seat === 1 || pr.ready === true || (Array.isArray(pr.acts) && pr.acts.length > 0);
    NET.peerActs = Array.isArray(pr.acts) ? pr.acts : [];
    if (!NET.started){ if (NET.ready && NET.peerReady) netStart(); else renderPlay(); } else { netPump(); netAfter(); }
    if (!wasHere && NET.started && G && !G.over && NET.since + 3000 < Date.now()) showToast(`${NET.peer.name} is here.`);
  } else if (wasHere && NET.started){ renderPlay(); }
  else if (!NET.started) renderPlay();
}
async function netStart(){
  const room = NET;
  if (!room || room.started || room.loadingArt) return;
  room.loadingArt = true;
  try{ await prepareMatchPresentation(); } finally { room.loadingArt = false; }
  if (NET !== room || room.started || !room.peer || !room.here) return;
  let names = NET.seat === 0 ? [NET.name, NET.peer.name] : [NET.peer.name, NET.name];
  if (names[0] === names[1]) names = [names[0] + ' 1', names[1] + ' 2'];
  stopTimers();
  G = newGame({genomes:[null, null], labels:names, target:NET.target || 3, miracles:NET.mir !== false, battleMir:NET.bmir === true, refill:NET.rf === true, rnd:mulberry32(NET.seed), su:NET.su || undefined});
  G.pp = true; G.net = true; G.opp = null;
  { const L = netRulesLines(names); G.suLines = L.length ? L : null; }
  ui = freshUI({roll:null, mktTab:'u'});
  NET.started = true; NET.applied = [0, 0]; NET.needShop = false;
  shopCoinStart(G);
  NET.live = false; netPump(); NET.live = true;   // replay moves made before a reload, quietly
  if (G.phase === 'shop' && NET.acts.length + NET.peerActs.length === 0) showToast(`${nm(cur(G))} shops first.`);
  netAfter();
}
