/* ===================== BATTLE ENGINE ===================== */
function runBattle(cfgs, record){
  if (record === undefined) record = true;
  // a recorded battle keeps a copy of both armies as they were sent in: a battle code rebuilds the fight from them
  const cfgCopy = record ? JSON.parse(JSON.stringify(cfgs)) : undefined;
  let uidc = 0;
  const logs = [], frames = [], hitsLog = [];
  let OVQ = [], OVFROM = null;   // Overrun excess waiting for the casualty step, and the unit it spills from (for the cubes)
  let logMark = 0;
  const mkUnit = (o, owner) => { const z = o.gear === 'Zweihander';
    return {uid:++uidc, name:o.name, copies:o.copies||1, train:o.tr||0, arm:z ? 0 : o.arm||0, sh:z ? 0 : o.sh||0,
            dmg:0, copyOf:null, jFail:false, owner, sp:[], sw:0, gear:o.gear && isGear(o.gear) ? o.gear : null}; };
  const P = cfgs.map((cfg, i) => {
    const deck = cfg.units.map(u => mkUnit(u, i)), tail = [];
    // battle miracles sit between units: each waits in front of the unit it was placed ahead of (at = units ahead of
    // it), or behind the last unit (the tail). They never count as units: positions, Vanguard and Rearguard skip them.
    for (const s of cfg.spells || []){ if (!MIRS[s.name] || !MIRS[s.name].bat) continue; const u = deck[s.at]; if (u) u.sp.push(s.name); else tail.push(s.name); }
    return {nm:cfg.label || ['Azure','Gules'][i], deck, charge:null, grave:[], van:deck.length ? deck[0].uid : null,
            rear:deck.length ? deck[deck.length-1].uid : null,
            revealed:null, inf:!!cfg.infirmary, infUsed:false, treb:+cfg.treb||0, armory:cfg.armory ? BDEFS.Armory.lv[cfg.armory-1] : 0, yard:+cfg.yard||0, drill:+cfg.drill||0,
            tail, silence:0, drums:0};
  });
  // AB: the ability being resolved right now; every line it writes carries it (for the battle view's ability windows)
  let AB = null;
  const log = record ? (t, side, meta) => logs.push(AB ? {t, side, ...(meta || {}), ab:AB} : meta ? {t, side, ...meta} : {t, side}) : () => {};
  // Card moves, recorded on the Chronicle line that reports them (the screen animates from these, never from the
  // sentence or by comparing board pictures). Each move: {u:'side-uid', from, to, k}. Zones: 'new' (a card that wasn't
  // in play), 'deck', 'deck-top', 'deck-bottom', 'charge', 'grave'. k: 'charge', 'defeat', 'save', 'back', 'arrive'.
  // place (optional): the defeated unit whose spot an arriving card takes, keeping its tokens and gear (Cowardly Squire).
  const mvs = list => record ? {mv:list.map(([u, from, to, k, pl]) => ({u:`${u.owner}-${u.uid}`, from, to, k, ...(pl ? {place:`${pl.owner}-${pl.uid}`} : {})}))} : undefined;
  const withAb = (ab, fn) => { if (!record) return fn(); const o = AB; AB = ab; try{ return fn(); } finally { AB = o; } };
  const abU = (u, p) => ({n:u.name, as:u.copyOf || null, u:`${u.owner}-${u.uid}`, s:p});
  const abB = (n, p) => ({n, b:true, s:p});
  // a gear card's own trigger: its note is titled with the gear and joined to the gear on the unit wearing it
  const abG = (u, p, g) => ({n:g || u.gear, g:true, u:`${u.owner}-${u.uid}`, s:p});
  const abM = (n, p) => ({n, b:true, m:true, s:p});   // a battle miracle
  const key = u => u.copyOf || u.name;
  const D = u => DEFS[key(u)];
  // every unit (Drifters too) levels up to its last Might value: Training tokens and Ration Line training add levels
  const maxLv = u => DEFS[u.name].p.length;
  const lvl = u => Math.min(u.copies + u.train, maxLv(u));
  const idx = (u, arr) => Math.min(lvl(u), arr.length) - 1;
  // gear: +power while equipped; War Banner on the unit right behind gives +2
  const GEAR_POW = new Set(['Zweihander', 'Battle Axe', 'Heirloom Blade', 'Lance']);
  const gv = n => (BDEFS[n] && BDEFS[n].lv[0]) || 0;   // a gear card's number (its single level value in the lab)
  const behind = u => { const pl = P[u.owner]; if (pl.charge === u) return pl.deck[0] || null; const k = pl.deck.indexOf(u); return k >= 0 ? pl.deck[k+1] || null : null; };
  const extraPow = u => (GEAR_POW.has(u.gear) ? gv(u.gear) : 0) + (() => { const b = behind(u); return b && b.gear === 'War Banner' ? gv('War Banner') : 0; })();
  const basePow = u => {
    if (u.name === 'Jester' && (!u.copyOf || u.jFail)){ const jp = DEFS.Jester.p; return jp[idx(u, jp)]; }
    const d = D(u); return d.p[idx(u, d.p)];
  };
  const power = u => basePow(u) + u.arm + extraPow(u);
  const val = u => { const v = D(u).v; return v ? v[idx(u, v)] : 0; };
  const xval = u => { const x = D(u).x; return x ? x[idx(u, x)] : 0; };
  const many = (n, one, few) => n === 1 ? one : `${n} ${few}`;
  const nameOf = u => `${P[u.owner].nm} ${u.name === 'Jester' && u.copyOf ? `Jester (as ${u.copyOf})` : u.name}`;
  const top = p => P[p].deck[0] || null;
  const enemyAhead = p => P[1-p].charge || top(1-p);
  const isDead = u => u.dmg >= power(u);
  const recruit = p => ({uid:++uidc, name:'Recruit', copies:1, train:P[p].drill, arm:0, sh:0, dmg:0, copyOf:null, jFail:false, owner:p, sp:[], sw:0, gear:null});
  // the back one of a side's two units in play: its revealed unit, or its charging unit when nothing is revealed
  const rearmost = p => top(p) || P[p].charge;
  // Pigeon Hunter (Interceptor, Brian Nov 25): "Reveal: Silence enemy Reveal and Charge abilities that happen at the
  // same time." Not a lasting effect any more: HUSH[p] is the Pigeon Hunter silencing side p's Reveal and Charge
  // abilities in the step it is revealed (set by hushStart, cleared when that step's abilities are done). It goes first.
  let HUSH = [null, null];
  const ab = u => !!u && !u.jFail;
  // tokens: Zweihander can't hold Armaments or Shields
  const addArm = (u, v, src, side, from) => { if (!u || v <= 0) return 0; if (u.gear === 'Zweihander'){ if (record) withAb(abG(u, u.owner), () => log(`${nameOf(u)} wields a Zweihander and can't hold Armaments.`, side)); return 0; } u.arm += v; return v; };
  const addSh = (u, v, side) => { if (!u || v <= 0) return 0; if (u.gear === 'Zweihander'){ if (record) withAb(abG(u, u.owner), () => log(`${nameOf(u)} wields a Zweihander and can't hold Shields.`, side)); return 0; } u.sh += v; return v; };
  // SRC: the unit whose damage is being dealt right now (Lethal, Lance), or null for buildings and miracles
  let SRC = null;
  const asSrc = (u, fn) => { const o = SRC; SRC = u; try{ return fn(); } finally { SRC = o; } };
  const lethalFrom = f => !!f && ((key(f) === 'Executioner' && ab(f)) || f.gear === 'Poison Oil');

  // for the replay's arrows: the unit whose name starts the source text (longest match), or none for buildings
  function srcUnit(src){
    let best = null, bl = 0;
    for (const pl of P) for (const x of [pl.charge, ...pl.deck, ...pl.grave]){
      if (!x) continue; const n = nameOf(x);
      if (src.startsWith(n) && n.length > bl){ best = x; bl = n.length; }
    }
    return best;
  }
  // token arrows: who gave what to whom (from a unit, a graveyard entry, or null for a building)
  const tokMeta = (from, to, side, tok, amt) => record && to ? {from: from ? `${from.owner}-${from.uid}` : null, to:`${to.owner}-${to.uid}`, by:side, amt, tok} : undefined;
  // atk: the hit comes from an attack (a fight hit, a Marksman shot or its overrun), even with an ability's tag on it
  // via: an Overrun spill's line names the unit it spilled through (the screen draws it carrying on from that unit)
  const hitMeta = (u, src, side, amt) => { const f = srcUnit(src); return {from: f ? `${f.owner}-${f.uid}` : null, to:`${u.owner}-${u.uid}`, by:side, amt, ...(ATK ? {atk:true} : {}), ...(OVFROM ? {via:`${OVFROM.owner}-${OVFROM.uid}`} : {})}; };
  /* A round of abilities resolves at the same time for both players. Tokens (Shields, Armaments, Training) land as
     each ability resolves; damage waits until the round's end. Then each unit takes its biggest hit first (so a Shield
     blocks the biggest one, whoever's ability it was), and overrun spills land after every first hit. Neither seat
     ever goes first. */
  let Q = null;
  // ATK: the damage being dealt now comes from an attack (a fight hit, a Marksman shot, or its overrun), not an ability
  let ATK = false;
  const asAtk = f => { const o = ATK; ATK = true; try{ return f(); } finally { ATK = o; } };
  function round(fn){
    if (Q) return fn();
    Q = []; let q;
    try{ fn(); } finally { q = Q; Q = null; }
    flushHits(q);
  }
  function flushHits(q){
    if (!q.length) return;
    const byU = new Map(), spills = [];
    q.forEach((h, k) => { h.k = k; const L = byU.get(h.u); if (L) L.push(h); else byU.set(h.u, [h]); });
    for (const L of byU.values()){
      L.sort((a, b) => b.amt - a.amt || (b.brk ? 1 : 0) - (a.brk ? 1 : 0) || a.k - b.k);
      for (const h of L) withAb(h.ab, () => asSrc(h.from, () => {
        const o = ATK; ATK = !!h.atk;
        try{
          const rem = power(h.u) - h.u.dmg, dealt = hit0(h.u, h.amt, h.src, h.side, h.brk);
          if (h.spill && dealt > rem && rem >= 0 && h.spill !== h.u) spills.push({u:h.spill, amt:dealt - rem, src:`${h.src} (overrun)`, side:h.side, brk:h.brk, ab:h.spillAb || h.ab, from:h.from, atk:h.atk, over:h.u});
        } finally { ATK = o; }
      }));
    }
    OVQ.push(...spills);   // Overrun resolves in the casualty step (see casualties())
  }
  // a new hit: inside a round it waits for the round's end
  function hit(u, amt, src, side, brk){
    if (!u || amt <= 0) return 0;
    if (Q){ Q.push({u, amt, src, side, brk, ab:AB, from:SRC, atk:ATK}); return amt; }
    return hit0(u, amt, src, side, brk);
  }
  function hit0(u, amt, src, side, brk){
    if (!u || amt <= 0) return 0;
    // Shield-break: the hit ignores Shields and discards all of them
    if (brk && u.sh > 0){ const k = u.sh; u.sh = 0; if (record){ const t = `${src} breaks ${nameOf(u)}'s ${k > 1 ? `${k} Shields` : 'Shield'}.`; if (SRC && SRC.gear === 'Battle Axe') withAb({...abG(SRC, side), tg:[u.name]}, () => log(t, side)); else log(t, side); } }
    if (u.sh > 0){ u.sh--; if (record) log(`${nameOf(u)}'s Shield blocks ${amt} from ${src}.`, side, hitMeta(u, src, side, 0)); return 0; }
    let a = amt;
    if (key(u) === 'Armored Knight' && ab(u)) a = Math.max(0, a - val(u));
    u.dmg += a; const hb = u.dmg;
    if (record) log(`${src} deals ${a} to ${nameOf(u)} (${u.dmg} damage, ${power(u)} power).`, side, hitMeta(u, src, side, a));
    // Lethal (Executioner, Poison Oil): any damage it deals kills (a Shield-blocked or fully reduced hit deals none)
    // Lethal is marked now and resolves in the casualty step (see casualties())
    if (a > 0 && !isDead(u) && lethalFrom(SRC) && !u.lethal){ u.lethal = {ab: key(SRC) === 'Executioner' && ab(SRC) ? abU(SRC, SRC.owner) : {...abG(SRC, side, 'Poison Oil'), tg:[u.name]}, side}; }
    // Brawler: when it survives an attack, remove all damage from it. Damage from abilities alone doesn't trigger it.
    // (it checks in the casualty step, after the whole round's damage: see casualties())
    if (ATK && a > 0 && key(u) === 'Brawler' && ab(u) && !isDead(u)){ u.brawl = 1; }
    // Healing Balm: when the wearer survives an attack, remove up to 2 of that attack's damage
    if (ATK && a > 0 && u.gear === 'Healing Balm' && !isDead(u)) u.balm = (u.balm || 0) + Math.min(2, a);   // Healing Balm: checked in the casualty step, like Brawler
    if (record && a > 0) hitsLog.push({uid:u.uid, a, heal:Math.max(0, hb - u.dmg), from:OVFROM ? OVFROM.uid : undefined});   // for the damage cubes: the hit, then any heal
    return a;
  }
  function train(u, src, side){
    if (!u) return;
    if (lvl(u) >= maxLv(u)){ if (record) log(`${src} trains ${nameOf(u)}, but it is already at its highest level.`, side); return; }
    u.train++; if (record) log(`${src} trains ${nameOf(u)} to level ${lvl(u)} (${power(u)} power).`, side, tokMeta(srcUnit(src), u, side, 'tr', 1));
  }
  function overrunHit(target, amt, src, side, spill, spillAb, brk){
    if (!target || amt <= 0) return;
    if (Q){ Q.push({u:target, amt, src, side, brk, spill, spillAb, ab:AB, from:SRC, atk:ATK}); return; }
    const rem = power(target) - target.dmg;
    const dealt = hit0(target, amt, src, side, brk);
    if (dealt > rem && rem >= 0 && spill && spill !== target) OVQ.push({u:spill, amt:dealt - rem, src:`${src} (overrun)`, side, brk, ab:spillAb || AB, from:SRC, atk:ATK, over:target});   // resolves in the casualty step
  }
  // side p's Reveal and Charge abilities are Silenced this step by a just-revealed enemy Pigeon Hunter
  const hush = p => HUSH[p];
  // the units about to be revealed (pe: given, or the new top cards); an enemy Pigeon Hunter among them silences the
  // other side for this step. Its Reveal shows as its own ability, before anything else happens.
  function hushStart(pe){
    pe = pe || [0,1].map(p => { const t = top(p); return t && t.uid !== P[p].revealed ? t : null; });
    const ph = pe.map(u => u && key(u) === 'Pigeon Hunter' && !u.jFail ? u : null);
    HUSH = [ph[1], ph[0]];
    // one line per enemy unit it reaches (their charging unit and the one being revealed), whether or not it has a Reveal
    // or Charge ability: the screen draws an ink stroke to each (sil)
    for (const p of [0,1]) if (ph[p]){
      const o = 1 - p, hit = [...new Set([P[o].charge, pe[o] || top(o)].filter(Boolean))];
      withAb(abU(ph[p], p), () => { if (!hit.length) log(`${nameOf(ph[p])} silences ${P[o].nm === 'You' ? 'your' : `${P[o].nm}'s`} Reveal and Charge abilities this step.`, p);
        for (const t of hit) log(`${nameOf(ph[p])} silences ${nameOf(t)}'s Reveal and Charge abilities this step.`, p, record ? {...tokMeta(ph[p], t, p, undefined, 0), sil:true} : undefined); });
    }
  }
  // aimOf: the unit a Reveal or Charge ability would have reached had it not been silenced (the same choice its own
  // code makes, nothing applied); a unit buffing itself aims at itself
  function aimOf(u, p, what){
    const own = P[p], ch = own.charge, k = key(u);
    if (what === 'Charge') switch (k){
      case 'Knight': case 'Man-at-arms': case 'Royal Watchman': return u;
      case 'Dark Knight': case 'Scholar': case 'Monk': case 'Recruiter': { const t = top(p); return t && t !== u ? t : null; }
      default: return null;
    }
    switch (k){
      case 'Slinger': return rearmost(1-p);
      case 'Musketeer': return P[1-p].charge || top(1-p);
      case 'Cannon': case 'Halberd Knight': return enemyAhead(p);
      case 'White Knight': { const i = own.deck.indexOf(u); return (i > 0 ? own.deck[i-1] : ch) || null; }
      case 'Dutiful Squire': case 'Dark Knight': case 'Dowser Oracle': case 'Scholar': return ch && ch !== u ? ch : null;
      default: return null;
    }
  }
  // (cut: the screen starts the silenced ability's stroke toward the unit it would have reached and inks it out partway)
  const cutMeta = (u, h, p, what) => { if (!record) return undefined; const t = aimOf(u, p, what); return t ? {...tokMeta(u, t, p, undefined, 0), cut:true} : undefined; };
  function hushed(u, p, what){ const h = hush(p); if (!h) return false; withAb(abU(h, 1-p), () => log(`${nameOf(u)}'s ${what} doesn't trigger: ${nameOf(h)} silences it.`, 1-p, cutMeta(u, h, p, what))); return true; }
  const REVEALS = new Set(['Halberd Knight','Dowser Oracle','Slinger','Dutiful Squire','Musketeer','Dark Knight','Cannon','White Knight','Scholar','Jester']);
  function doReveal(u, p){ if (hush(p)){ if (!u.jFail && REVEALS.has(key(u))) hushed(u, p, 'Reveal'); return; } return withAb(abU(u, p), () => asSrc(u, () => doReveal0(u, p))); }
  function doReveal0(u, p){
    const s = p;
    if (hush(p)) return;
    if (u.name === 'Jester' && !u.copyOf && !u.jFail){
      const k0 = P[p].deck.indexOf(u);
      const tgt = (k0 > 0 ? P[p].deck[k0-1] : null) || P[p].charge || P[1-p].charge || top(1-p);
      if (!tgt || (tgt.name === 'Jester' && !tgt.copyOf)){ u.jFail = true; log(`${nameOf(u)} has nothing to copy; its power is 1.`, s); return; }
      u.copyOf = tgt.copyOf || tgt.name;
      log(`${P[p].nm} Jester becomes a copy of ${u.copyOf} at level ${lvl(u)}.`, s);
    }
    if (u.jFail) return;
    const N = record ? nameOf(u) : '', v = val(u);
    switch (key(u)){
      case 'Slinger': { const t = rearmost(1-p); if (t) hit(t, v, N, s); break; }   // the enemy revealed unit, or their charging unit if they have none
      case 'Dutiful Squire': { const c = P[p].charge; if (c && addArm(c, v, N, s)) log(`${N} gives ${nameOf(c)} ${v} ${plural(v, 'Armament')}.`, s, tokMeta(u, c, s, 'arm', v)); break; }
      case 'Musketeer': { const c = P[1-p].charge, t = top(1-p); if (c) hit(c, v, N, s); if (t) hit(t, v, N, s); break; }
      case 'Dark Knight': { const c = P[p].charge; if (c && c !== u) hit(c, v, N, s); break; }
      case 'Cannon': { const e = P[1-p], t = enemyAhead(p); if (t) overrunHit(t, v, N, s, t === e.charge ? e.deck[0] : e.deck[1]); break; }   // excess hits the enemy unit behind the target
      case 'White Knight': { const k1 = P[p].deck.indexOf(u), c = k1 > 0 ? P[p].deck[k1-1] : P[p].charge; if (c && addSh(c, v, s)){ log(`${N} gives ${nameOf(c)} ${many(v, 'a Shield', 'Shields')}.`, s, tokMeta(u, c, s, 'sh', v)); } break; }
      case 'Dowser Oracle': { const c = P[p].charge; if (c && c !== u && addSh(c, v, s)){ log(`${N} gives ${nameOf(c)} ${many(v, 'a Shield', 'Shields')}.`, s, tokMeta(u, c, s, 'sh', v)); } break; }
      case 'Halberd Knight': {
        // Sand Sailor: Shieldbreak damage to the enemy unit ahead of me (their charging unit, or their revealed unit if
        // none is charging), then I go to the back of the deck. If only Sand Sailors are behind me I stay put, so two
        // of them can't cycle forever.
        const t = enemyAhead(p); if (t) hit(t, v, N, s, true);
        const pl = P[p], k = pl.deck.indexOf(u);
        if (k >= 0 && pl.deck.slice(k + 1).some(x => key(x) !== 'Halberd Knight')){ pl.deck.splice(k, 1); pl.deck.push(u); log(`${N} moves to the back of the deck.`, s, mvs([[u, 'deck', 'deck-bottom', 'back']])); }
        break; }
      case 'Scholar': { const c = P[p].charge; if (c && c !== u) for (let i = 0; i < v; i++) train(c, N, s); break; }
    }
  }
  function doCharge(u, p){ if (hush(p)){ if (!u.jFail && CHARGES.has(key(u))) hushed(u, p, 'Charge'); return; }
    withAb(abU(u, p), () => asSrc(u, () => doCharge0(u, p)));
    // War Horn (gear): the wearer gains "Charge: trigger your revealed unit's Reveal ability"
    if (u.gear === 'War Horn' && !u.jFail){ const t = top(p);
      if (t && t !== u && (REVEALS.has(key(t)) || t.name === 'Jester')){ withAb({...abG(u, p), tg:[t.name]}, () => log(`War Horn: ${nameOf(t)}'s Reveal triggers.`, p));
        for (let k = 0; k < gv('War Horn'); k++) withAb(abU(t, p), () => asSrc(t, () => doReveal0(t, p))); } } }
  const CHARGES = new Set(['Knight','Dark Knight','Scholar','Man-at-arms','Recruiter','Royal Watchman','Monk']);
  function doCharge0(u, p){
    if (u.jFail || hush(p)) return;
    const s = p, N = record ? nameOf(u) : '', v = val(u);
    switch (key(u)){
      case 'Knight': if (addArm(u, v, N, s)){ log(`${N} gains ${v} ${plural(v, 'Armament')}.`, s, tokMeta(u, u, s, 'arm', v)); } break;
      case 'Dark Knight': { const t = top(p); if (t) hit(t, v, N, s); break; }
      case 'Scholar': { const t = top(p); if (t) for (let i = 0; i < v; i++) train(t, N, s); break; }
      case 'Man-at-arms': if (addSh(u, v, s)){ log(`${N} gains ${many(v, 'a Shield', 'Shields')}.`, s, tokMeta(u, u, s, 'sh', v)); } break;
      // Sump Guardsman: if the enemy charging unit has more power than me, I gain Shields
      case 'Royal Watchman': { const e = P[1-p].charge; if (e && power(e) > power(u) && addSh(u, v, s)){ log(`${N} faces a stronger charger and gains ${many(v, 'a Shield', 'Shields')}.`, s, tokMeta(u, u, s, 'sh', v)); } break; }
      // Namaki Warleader: if your revealed unit is weaker than me, it gains Might equal to the difference
      case 'Monk': { const t = top(p); if (!t || t === u) break; const k = power(u) - power(t); if (k > 0 && addArm(t, k, N, s)){ log(`${N} gives ${nameOf(t)} ${k} ${plural(k, 'Armament')}.`, s, tokMeta(u, t, s, 'arm', k)); } break; }
      case 'Recruiter': {
        const t = top(p);
        if (t && t.dmg > 0){ t.dmg = 0; log(`${nameOf(t)} is covered and its damage clears.`, s); }
        const rs = []; for (let i = 0; i < v; i++){ const r = recruit(p); rs.push(r); P[p].deck.unshift(r); }
        P[p].revealed = top(p).uid;
        log(`${N} places ${v} ${plural(v, 'Recruit')} on top of the deck.`, s, v > 0 ? {...tokMeta(u, top(p), s, 'rec', v), ...mvs(rs.map(r => [r, 'new', 'deck-top', 'arrive']))} : undefined);
        break;
      }
    }
  }
  /* ---- battle miracles ----
     A battle miracle resolves the moment it becomes the top card of its deck: when the card ahead of it leaves the top,
     or, behind the last unit, when that unit charges. Every reveal waits until the spells surfacing with it have
     resolved. Spells surface one layer at a time: each player's next spell together, then the next ones. */
  const ownAhead = p => P[p].charge || top(p);
  const waiting = p => { const pl = P[p]; return pl.deck.length ? pl.deck[0].sp : pl.tail; };
  // a unit sent to the bottom of the deck goes behind any spells waiting after the last unit
  const toBottom = (pl, u) => { pl.deck.push(u); if (pl.tail.length){ u.sp = pl.tail.concat(u.sp || []); pl.tail = []; } };
  // take a unit out of the deck; spells waiting in front of it now wait in front of the next card
  const pull = (pl, u) => {
    const k = pl.deck.indexOf(u); if (k < 0) return;
    pl.deck.splice(k, 1);
    if (u.sp && u.sp.length){ const nx = pl.deck[k]; if (nx) nx.sp = u.sp.concat(nx.sp || []); else pl.tail = u.sp.concat(pl.tail); u.sp = []; }
  };
  const anyWaiting = () => [0,1].some(p => { const w = waiting(p); return !!(w && w.length); });
  function spellFx(n, p, N){
    const m = MIRS[n], v = m.bn || 1, none = () => log(`${N} finds no target.`, p);
    switch (m.bat){
      case 'ambush': { const t = enemyAhead(p); if (t) hit(t, v, N, p); else none(); break; }
      case 'shield': { const t = ownAhead(p); if (!t){ none(); break; } if (!addSh(t, v, p)) break; log(`${N} gives ${nameOf(t)} ${many(v, 'a Shield', 'Shields')}.`, p, tokMeta(null, t, p, 'sh', v)); break; }
      case 'sabotage': {
        const t = enemyAhead(p); if (!t){ none(); break; }
        const a = t.arm, s = t.sh; t.arm = 0; t.sh = 0;
        const what = [a ? `${a} ${plural(a, 'Armament')}` : '', s ? `${s} ${plural(s, 'Shield')}` : ''].filter(Boolean).join(' and ');
        log(what ? `${N} strips ${what} from ${nameOf(t)} (${power(t)} power).` : `${N} finds nothing to strip from ${nameOf(t)}.`, p);
        break; }
      case 'wind': { const t = ownAhead(p); if (!t){ none(); break; } t.sw = (t.sw || 0) + 1; log(`${N} attaches to ${nameOf(t)}: the next time it would die, it goes to the bottom of the deck with no damage instead.`, p); break; }
      case 'drums': P[p].drums += v; log(`${N}: ${P[p].nm}'s next revealed unit triggers its Reveal ${P[p].drums === 1 ? 'twice' : `${P[p].drums + 1} times`}.`, p); break;
    }
  }
  function spellLayer(layer){
    const act = layer.slice(), NM = p => `${P[p].nm} ${layer[p]}`;
    for (const p of [0,1]) if (layer[p]) withAb(abM(layer[p], p), () => log(`${NM(p)} surfaces.`, p));
    // a Silence from an earlier round catches the next spell too
    for (const p of [0,1]) if (act[p] && P[p].silence > 0){ P[p].silence--; withAb(abM(act[p], p), () => log(`${NM(p)} is silenced and doesn't trigger.`, 1-p)); act[p] = null; }
    // Silence catches the opponent's spell in this same round (two Silences catch each other), or else their next reveal
    const sil = act.map(n => !!n && MIRS[n].bat === 'silence'), caught = [false, false];
    for (const p of [0,1]) if (sil[p]){
      if (act[1-p]) caught[1-p] = true;
      else { P[1-p].silence += MIRS[act[p]].bn || 1; withAb(abM(act[p], p), () => log(`${NM(p)}: ${P[1-p].nm}'s next reveal won't trigger.`, p)); }
    }
    for (const p of [0,1]) if (caught[p]){ withAb(abM(layer[1-p], 1-p), () => log(`${NM(1-p)} silences ${NM(p)}.`, 1-p)); act[p] = null; }
    // the rest resolve by kind, not by seat: tokens gained, then tokens removed (Sabotage strips a Shield gained this
    // round), then damage (which lands at the round's end anyway)
    for (const kinds of [['shield', 'wind', 'drums'], ['sabotage'], ['ambush']])
      for (const p of [0,1]) if (act[p] && !sil[p] && kinds.includes(MIRS[act[p]].bat)) withAb(abM(act[p], p), () => spellFx(act[p], p, NM(p)));
  }
  // first: abilities that share the first layer's round (this step's Charge abilities)
  function surface(first){
    let did = false;
    for (let guard = 0; guard < 60; guard++){
      const layer = [0,1].map(p => { const w = waiting(p); return w && w.length ? w.shift() : null; });
      if (!layer[0] && !layer[1]) break;
      const f = first; first = null;
      round(() => { if (f) f(); spellLayer(layer); });
      did = true;
    }
    if (first) round(first);
    return did;
  }
  // Both players' newly revealed units trigger together. Who is hushed by a revealed Pigeon Hunter is settled before
  // anything moves. A Silence waiting on a side blanks its next reveal;
  // War Drums makes the next revealed unit trigger its Reveal once more (wasted on a unit without one).
  function revealRound(pe){
    round(() => {
      const hs = pe.map((u, p) => u ? hush(p) : null);
      const order = [0,1].filter(p => pe[p]);
      for (const p of order){
        const u = pe[p], pl = P[p], dr = pl.drums; pl.drums = 0;
        if (!pl.deck.includes(u)) continue;
        if (pl.silence > 0){ pl.silence--; log(`${nameOf(u)}'s Reveal is silenced and doesn't trigger${dr ? ' (War Drums is wasted)' : ''}.`, 1-p); continue; }
        if (hs[p]){ if (!u.jFail && REVEALS.has(key(u))) withAb(abU(hs[p], 1-p), () => log(`${nameOf(u)}'s Reveal doesn't trigger: ${nameOf(hs[p])} silences it.`, 1-p, cutMeta(u, hs[p], p, 'Reveal'))); continue; }
        const has = REVEALS.has(key(u)) || u.name === 'Jester';
        for (let k = 0; k < (has ? 1 + dr : 1); k++){ if (k) log(`War Drums: ${nameOf(u)}'s Reveal triggers again.`, p); withAb(abU(u, p), () => asSrc(u, () => doReveal0(u, p))); }
        // War Drums (gear): the wearer gains "Reveal: trigger your charging unit's Charge ability"
        const ch = pl.charge;
        if (u.gear === 'War Drums' && !u.jFail && ch && ch !== u && !ch.jFail && CHARGES.has(key(ch))){ withAb({...abG(u, p), tg:[ch.name]}, () => log(`War Drums: ${nameOf(ch)}'s Charge triggers.`, p));
          for (let k = 0; k < gv('War Drums'); k++) withAb(abU(ch, p), () => asSrc(ch, () => doCharge0(ch, p))); }
      }
    });
  }
  function newReveals(){
    const sp = surface(null);
    if (sp) frameIf('Battle miracles');
    const pe = [0,1].map(p => { const t = top(p); if (t && t.uid !== P[p].revealed){ P[p].revealed = t.uid; log(`${nameOf(t)} is revealed.`, p); return t; } return null; });
    if (pe[0] || pe[1]){ round(() => hushStart(pe)); revealRound(pe); HUSH = [null, null]; return true; }
    return sp;
  }
  // display only: cubes a unit's pile shouldn't show even though its damage counts them (Overrun cubes that moved on,
  // a Lethal fill); valid while its damage stays at that number
  const cubeOff = (u, n, was = u && u.dmg) => { if (!u || n <= 0) return; const o = u.cubeOff && u.cubeOff.dmg === was ? u.cubeOff.n : 0; u.cubeOff = {n:o + n, dmg:u.dmg}; };
  function casualties(){
    let any = false;
    // Overrun: the excess from this round's overkills carries on to the unit behind, if it's still in play
    if (OVQ.length) for (const x of OVQ.splice(0)){
      const pl = P[x.u.owner]; if (!pl || !(pl.charge === x.u || pl.deck.includes(x.u))) continue;
      OVFROM = x.over;
      let got = 0;
      withAb(x.ab, () => asSrc(x.from, () => { const o = ATK; ATK = !!x.atk; try{ got = hit0(x.u, x.amt, x.src, x.side, x.brk); } finally { ATK = o; } }));
      OVFROM = null;
      if (record && got > 0) cubeOff(x.over, got);   // those cubes moved on to the next unit
    }
    frameIf('Overrun');
    // Lethal (Executioner, Poison Oil): a unit it damaged this round is defeated now
    for (const p of [0,1]) for (const u of [P[p].charge, ...P[p].deck]){
      if (!u || !u.lethal) continue; const L = u.lethal; u.lethal = null;
      if (isDead(u)) continue;
      const was = u.dmg; u.dmg = power(u);
      if (record) cubeOff(u, u.dmg - was, was);   // Lethal adds no cubes: the bar drains, the pile stays
      if (record) withAb(L.ab, () => log(`The damage is Lethal: ${nameOf(u)} dies.`, L.side));
    }
    frameIf('Lethal');
    // Survival heals, after all the round's damage: if the unit is still standing now, the heal happens.
    // Brawler removes all its damage; Healing Balm removes up to 2 of each attack's damage.
    const survive = (flag, amount, abOf, text) => {
      for (const p of [0,1]) for (const u of [P[p].charge, ...P[p].deck]){
        if (!u || !u[flag]) continue; const want = u[flag]; u[flag] = 0;
        if (isDead(u) || !u.dmg) continue;
        const k = Math.min(u.dmg, amount(u, want)); if (k <= 0) continue;
        u.dmg -= k;
        if (record) hitsLog.push({uid:u.uid, a:0, heal:k});
        withAb(abOf(u), () => log(text(u, k), u.owner));
      }
    };
    survive('brawl', u => ab(u) ? u.dmg : 0, u => abU(u, u.owner), u => `${nameOf(u)} survives the attack and shakes off all damage.`);
    survive('balm', (u, w) => u.gear === 'Healing Balm' ? w : 0, u => abG(u, u.owner), (u, k) => `Healing Balm removes ${k} damage from ${nameOf(u)}.`);
    frameIf('Survival heals');
    for (let guard = 0; guard < 200; guard++){
      // Barber-Surgeon (While Revealed): a charging unit that would die goes to the bottom of the deck, undamaged.
      // Units defeated in the same step fall together, so a Field Medic defeated alongside its charging unit still saves it.
      for (const p of [0,1]){
        const c = P[p].charge, t = top(p);
        if (c && isDead(c) && t && key(t) === 'Barber-Surgeon' && ab(t) && (t.saves || 0) < val(t)){
          t.saves = (t.saves || 0) + 1; c.dmg = 0; P[p].charge = null; toBottom(P[p], c);
          withAb(abU(t, p), () => log(`${nameOf(t)} saves ${nameOf(c)} and sends it to the bottom of the deck${c.sw ? ' (its Second Wind is wasted)' : ''}.`, p, record ? {from:`${t.owner}-${t.uid}`, to:null, by:p, amt:0, ...mvs([[c, 'charge', 'deck-bottom', 'save']])} : undefined));
          c.sw = 0;
        }
      }
      // Infirmary Tent: the first time one of your units would be defeated, it goes to the bottom of the deck, undamaged
      for (const p of [0,1]){
        const pl = P[p]; if (!pl.inf || pl.infUsed) continue;
        const v = [pl.charge, ...pl.deck].find(u => u && isDead(u));
        if (!v) continue;
        pl.infUsed = true; v.dmg = 0;
        const z = pl.charge === v ? 'charge' : 'deck';
        if (pl.charge === v) pl.charge = null; else pull(pl, v);
        toBottom(pl, v);
        withAb(abB('Infirmary', p), () => log(`Infirmary saves ${nameOf(v)} and sends it to the bottom of the deck${v.sw ? ' (its Second Wind is wasted)' : ''}.`, p, record ? {from:null, to:`${v.owner}-${v.uid}`, by:p, amt:0, tok:'ret', ...mvs([[v, z, 'deck-bottom', 'save']])} : undefined));
        v.sw = 0;
      }
      // Second Wind: a unit it is attached to that would die goes to the bottom of the deck with no damage instead
      for (const p of [0,1]){
        const pl = P[p];
        for (const u of [pl.charge, ...pl.deck]){
          if (!u || !u.sw || !isDead(u)) continue;
          const extra = u.sw - 1; u.sw = 0; u.dmg = 0;
          const z = pl.charge === u ? 'charge' : 'deck';
          if (pl.charge === u) pl.charge = null; else pull(pl, u);
          toBottom(pl, u);
          withAb(abM('Second Wind', p), () => log(`Second Wind saves ${nameOf(u)} and sends it to the bottom of the deck${extra ? ` (${extra === 1 ? 'the other Second Wind is' : `${extra} more are`} wasted)` : ''}.`, p, record ? {from:null, to:`${u.owner}-${u.uid}`, by:p, amt:0, tok:'ret', ...mvs([[u, z, 'deck-bottom', 'save']])} : undefined));
        }
      }
      const dying = [];
      for (const p of [0,1]){
        const c = P[p].charge; if (c && isDead(c)) dying.push({p, u:c, zone:'c'});
        P[p].deck.forEach((u, i) => { if (isDead(u)) dying.push({p, u, zone:'d', i}); });
      }
      // a save shares the step with the defeats that follow it, so the saved unit goes back to its deck as the others go
      // to the graveyard (the screen points at the unit to be saved in the step before); with no defeats it has its own
      if (!dying.length) frameIf('Saves');
      if (!dying.length){
        frameIf('Casualties');   // (the saves already had their own step)
        if (newReveals()){ any = true; frameIf('Reveal abilities'); continue; }
        break;
      }
      any = true;
      const dead = new Set(dying.map(d => d.u));
      // "when a unit is defeated" abilities trigger now, as the units fall (who is revealed, who is silenced), but
      // resolve in their own step after the deaths, so you see the units go first
      const onDef = [];
      // Corpse Looter (While Revealed): when a unit is defeated, I gain a Might token for each that it had
      for (const p of [0,1]){
        const t = top(p); if (!t || dead.has(t) || key(t) !== 'Grave-Robber' || !ab(t)) continue;
        const k = dying.reduce((sum, d) => sum + (d.u !== t ? d.u.arm : 0), 0);
        if (k > 0) onDef.push(() => { if (addArm(t, k, nameOf(t), p)) withAb(abU(t, p), () => log(`${nameOf(t)} takes ${k} ${plural(k, 'Armament')} from the fallen.`, p, tokMeta(t, t, p, 'arm', k))); });
      }
      // Night Watchman (While Revealed): when the ally ahead of me is defeated, I gain Might
      for (const p of [0,1]){
        const t = top(p), c = P[p].charge; if (!t || dead.has(t) || key(t) !== 'Sleepy Guard' || !ab(t) || !c || !dead.has(c)) continue;
        const k = val(t); onDef.push(() => { if (addArm(t, k, nameOf(t), p)) withAb(abU(t, p), () => log(`${nameOf(t)} sees ${nameOf(c)} fall and gains ${k} ${plural(k, 'Armament')}.`, p, tokMeta(t, t, p, 'arm', k))); });
      }
      for (const d of dying){
        const deck = P[d.p].deck;
        d.after = (d.zone === 'c' ? deck : deck.slice(d.i + 1)).slice();
        d.behind = d.after.find(x => !dead.has(x)) || null;
      }
      // Cowardly Squire: a Recruit takes its place and keeps its tokens and gear
      const replace = (u, p) => { if (key(u) === 'Cowardly Squire' && ab(u)){ const k = val(u); if (k <= 0) return []; const rs = Array.from({length:k}, () => recruit(p));
        const r = rs[0]; r.arm = u.arm; r.sh = u.sh; r.train = Math.max(r.train, u.train); r.gear = u.gear; u.gear = null; r.sw = u.sw || 0;
        const atC = P[p].charge === u;
        withAb(abU(u, p), () => log(`${nameOf(u)} is replaced by ${many(k, 'a Recruit', 'Recruits')}${r.gear || r.arm || r.sh ? ' that keeps its tokens and gear' : ''}.`, p, record ? {...tokMeta(u, rs[0], p, 'rec', k), ...mvs(rs.map((x, i) => [x, 'new', atC && i === 0 ? 'charge' : 'deck', 'arrive', i === 0 ? u : null]))} : undefined)); return rs; } return []; };
      if (record) for (const d of dying) log(`${nameOf(d.u)} dies.`, d.p, mvs([[d.u, d.zone === 'c' ? 'charge' : 'deck', 'grave', 'defeat']]));
      for (const p of [0,1]){
        const pl = P[p];
        let extra = [];
        if (pl.charge && dead.has(pl.charge)){ const r = replace(pl.charge, p); pl.charge = r[0] || null; extra = r.slice(1); }
        let carry = [];
        pl.deck = extra.concat(pl.deck.flatMap(u => {
          if (!dead.has(u)){ if (carry.length){ u.sp = carry.concat(u.sp || []); carry = []; } return [u]; }
          if (u.sp && u.sp.length){ carry.push(...u.sp); u.sp = []; }
          const r = replace(u, p); if (r.length && carry.length){ r[0].sp = carry; carry = []; } return r;
        }));
        if (carry.length) pl.tail = carry.concat(pl.tail);
      }
      for (const d of dying){ d.u.dmg = 0; d.u.cubeOff = null; P[d.p].grave.push(d.u); }
      frameIf('Casualties');
      for (const f of onDef) f();
      // Heirloom Blade: leaves its defeated wearer for the next unit in the deck that has no gear
      for (const d of dying){
        if (d.u.gear !== 'Heirloom Blade') continue;
        const pl = P[d.p], r = d.after.find(x => !dead.has(x) && !x.gear && pl.deck.includes(x));
        if (r){ const g = {...abG(d.u, d.p, 'Heirloom Blade'), tg:[r.name]}; r.gear = 'Heirloom Blade'; d.u.gear = null; withAb(g, () => log(`Heirloom Blade passes to ${nameOf(r)}, the next unit in the deck.`, d.p)); }
      }
      frameIf('When-defeated abilities');
      round(() => { for (const d of dying){
        const u = d.u, p = d.p, N = record ? nameOf(u) : '';
        if (!ab(u)) continue;
        const alive = b => b && (P[p].charge === b || P[p].deck.includes(b));
        // the unit is in the graveyard now: its On My Death text works (that's what it says), its gear doesn't
        withAb(abU(u, p), () => asSrc(null, () => { switch (key(u)){
          case 'Desperate Infantry': { const t = enemyAhead(p); if (t) hit(t, val(u), `${N} (On My Death)`, p); break; }
          case 'Veteran Knight': { const b = d.behind; if (alive(b) && addArm(b, val(u), N, p)){ log(`${N} passes ${val(u)} ${plural(val(u), 'Armament')} to ${nameOf(b)}.`, p, tokMeta(u, b, p, 'arm', val(u))); } break; }
        } }));
      } });
      frameIf('On My Death abilities');
    }
    for (const p of [0,1]) for (const u of [P[p].charge, ...P[p].deck]) if (u) u.cubeOff = null;
    return any;
  }
  function fight(){
    const c = [P[0].charge, P[1].charge];
    if (!c[0] || !c[1]) return false;
    for (const p of [0,1]){
      // Fencer: before attacking, the enemy charging unit loses all its Armaments (Training stays)
      const e = c[1-p];
      if (key(c[p]) === 'Fencer' && ab(c[p]) && e.arm > 0){
        const k = e.arm; e.arm = 0;
        withAb(abU(c[p], p), () => log(`${nameOf(c[p])} removes ${many(k, 'an Armament', 'Armaments')} from ${nameOf(e)} (${power(e)} power).`, p, record ? {from:`${c[p].owner}-${c[p].uid}`, to:`${e.owner}-${e.uid}`, by:p, drop:{tok:'arm', n:k}} : undefined));   // drop: the tokens it discards (the screen breaks them)
      }
    }
    const atk = [0,1].map(p => {
      let a = power(c[p]);
      if (key(c[p]) === 'Pikeman' && ab(c[p]) && power(c[1-p]) > power(c[p])) a += val(c[p]);
      return a;
    });
    const tgt = [0,1].map(p => (key(c[p]) === 'Assassin' && ab(c[p]) && top(1-p)) ? top(1-p) : c[1-p]);
    frameIf('Before the fight');
    if (record) log(`${nameOf(c[0])} and ${nameOf(c[1])} fight.`);
    // the fight's attacks and the "when your charging unit attacks" shots all land together, as one round of hits
    // (two hits on the same unit resolve the usual way: the bigger one first, so it's the one a Shield blocks)
    round(() => {
    for (const p of [0,1]){
      const N = record ? nameOf(c[p]) : '';
      // a fight hit is the plain fight, unless an ability shaped it (Pikeman's bonus, Assassin's Stealth)
      const shaped = (key(c[p]) === 'Pikeman' && ab(c[p]) && atk[p] > power(c[p])) || tgt[p] !== c[1-p] || (key(c[p]) === 'Executioner' && ab(c[p]));
      // Shield-break: Fencer, Battle Axe. Overrun: Lancer, Lance.
      const brk = c[p].gear === 'Battle Axe';
      const over = (key(c[p]) === 'Lancer' && ab(c[p])) || c[p].gear === 'Lance';
      withAb(shaped ? abU(c[p], p) : null, () => asSrc(c[p], () => asAtk(() => {
        if (over) overrunHit(tgt[p], atk[p], N, p, tgt[p] === c[1-p] ? top(1-p) : P[1-p].deck[1], key(c[p]) === 'Lancer' && ab(c[p]) ? abU(c[p], p) : abG(c[p], p, 'Lance'), brk);
        else hit(tgt[p], atk[p], N, p, brk);
      })));
    }
    // Marksman (While Revealed): when your charging unit attacks, I also attack the enemy revealed unit (or their
    // charging unit); it doesn't hit back
    for (const p of [0,1]){
      const t = top(p), r = rearmost(1-p);
      if (t && key(t) === 'Marksman' && ab(t) && r) withAb(abU(t, p), () => asSrc(t, () => asAtk(() => hit(r, power(t), record ? `${nameOf(t)} (shot)` : '', p))));
    }
    });
    for (const p of [0,1]){
      const t = top(p);
      if (t && key(t) === 'Studious Squire' && ab(t)){ const v = val(t); if (addArm(t, v, nameOf(t), p)) withAb(abU(t, p), () => log(`${nameOf(t)} watches and gains ${v} ${plural(v, 'Armament')}.`, p, tokMeta(t, t, p, 'arm', v))); }
      // Aging Master: when I attack, your revealed unit gains an Armament
      const ax = key(c[p]) === 'Aging Master' && ab(c[p]) ? xval(c[p]) : 0;
      if (ax > 0 && t && addArm(t, ax, nameOf(c[p]), p)) withAb(abU(c[p], p), () => log(`${nameOf(c[p])} gives ${nameOf(t)} ${ax} ${plural(ax, 'Armament')}.`, p, tokMeta(c[p], t, p, 'arm', ax)));
    }
    return true;
  }
  function advance(){
    const ch = [null,null], pe = [null,null];
    for (const p of [0,1]){
      const pl = P[p];
      if (!pl.charge && pl.deck.length){ pl.charge = pl.deck.shift(); ch[p] = pl.charge; log(`${nameOf(pl.charge)} charges.`, p, mvs([[pl.charge, 'deck', 'charge', 'charge']])); }
    }
    const mark = () => { for (const p of [0,1]){ const pl = P[p], t = top(p); if (t && t.uid !== pl.revealed){ pl.revealed = t.uid; pe[p] = t; log(`${nameOf(t)} is revealed.`, p); } } };
    const charges = () => { for (const p of [0,1]) if (ch[p] && P[p].charge === ch[p]) doCharge(ch[p], p); };
    // battle miracles surfacing this step resolve with the Charge abilities; every reveal waits for them
    const sp = anyWaiting();
    const nextUp = [0,1].map(p => { const t = top(p); return t && t.uid !== P[p].revealed ? t : null; });   // who this step reveals
    if (!sp) mark();
    frameIf('Charge');
    if (sp){ surface(() => { hushStart(nextUp); charges(); }); frameIf('Charge abilities & battle miracles'); mark(); }
    else round(() => { hushStart(nextUp); charges(); });
    revealRound(pe);
    HUSH = [null, null];
    frameIf(sp ? 'Reveal abilities' : 'Charge & Reveal abilities');
    return ch[0] || ch[1] || pe[0] || pe[1] || sp;
  }
  const snapU = (u, p) => u && ({uid:u.uid, name:u.name === 'Jester' && u.copyOf ? `Jester → ${u.copyOf}` : u.name,
    lvl:lvl(u), pow:power(u), dmg:u.dmg, gear:u.gear || undefined, cp:maxLv(u) > 1 ? Math.max(0, (u.copies || 1) - 1) : 0, arm:u.arm, sh:u.sh, tr:u.train, token:!!DEFS[u.name].token,
    van:u.uid === P[p].van, rear:u.uid === P[p].rear, sp:u.sp && u.sp.length ? u.sp.slice() : undefined, sw:u.sw || 0,
    cubes:u.cubeOff && u.cubeOff.dmg === u.dmg && u.dmg > 0 ? Math.max(0, u.dmg - u.cubeOff.n) : undefined});
  let stepTag = '';
  const frameIf = label => { if (record && logs.length > logMark) frame(stepTag + label); };
  function frame(label){
    if (!record) return;
    frames.push({label, lines:logs.slice(logMark), hits:hitsLog.splice(0),
      snap:P.map((pl,p) => ({charge:snapU(pl.charge,p), deck:pl.deck.map(u=>snapU(u,p)), grave:pl.grave.map(u=>snapU(u,p)),
        tail:pl.tail.slice(), sil:pl.silence, drums:pl.drums}))});
    logMark = logs.length;
  }
  const out = p => !P[p].charge && P[p].deck.length === 0;

  // battle miracles placed ahead of the Vanguard resolve first, before the Vanguard is revealed and before any building
  if (surface(null)) frameIf('Battle miracles');
  for (const p of [0,1]){ const t = top(p); if (t){ P[p].revealed = t.uid; log(`${nameOf(t)} is revealed as the Vanguard.`, p); } }
  // the board as the battle opens, before anything acts on it: the effects below get a step of their own, so the screen
  // plays them (glow, ink, cubes) instead of showing them already done
  frame('Battle start');
  for (const p of [0,1]){ const t = top(p); if (P[p].armory && t && addSh(t, P[p].armory, p)){ withAb(abB('Armory', p), () => log(`Armory gives ${nameOf(t)} ${P[p].armory} ${plural(P[p].armory, 'Shield')}.`, p, tokMeta(null, t, p, 'sh', P[p].armory))); } }
  for (const p of [0,1]){ if (!P[p].drill) continue; const rs = P[p].deck.filter(u => u.name === 'Recruit'); if (!rs.length) continue;
    withAb(abB('Muster Hall', p), () => { for (const u of rs){ u.train = Math.max(u.train, P[p].drill); log(`${P[p].nm} Muster Hall trains ${nameOf(u)} to level ${lvl(u)} (${power(u)} power).`, p, tokMeta(null, u, p, 'tr', P[p].drill)); } }); }
  for (const p of [0,1]){ const t = top(p); if (P[p].yard && t) withAb(abB('Training Yard', p), () => { for (let k = 0; k < P[p].yard; k++) train(t, `${P[p].nm} Training Yard`, p); if (addArm(t, 1, 'Training Yard', p)) log(`Training Yard gives ${nameOf(t)} an Armament.`, p, tokMeta(null, t, p, 'arm', 1)); }); }
  for (const p of [0,1]){
    if (P[p].treb){ const t = top(1-p); if (t) withAb(abB('Trebuchet', p), () => round(() => overrunHit(t, BDEFS.Trebuchet.lv[P[p].treb-1], `${P[p].nm} Trebuchet`, p, P[1-p].deck[1], null, true))); }
  }
  revealRound([top(0), top(1)]);
  frameIf('Battle start abilities');
  stepTag = 'Start · ';
  casualties(); frameIf('Casualties');

  let result = null;
  const check = () => {
    if (out(0) && out(1)) return {w:-1, why:'Both armies ran out at the same time. No one scores.'};
    if (out(0)) return {w:1, why:`${P[0].nm} ran out of units.`};
    if (out(1)) return {w:0, why:`${P[1].nm} ran out of units.`};
    return null;
  };
  result = check();
  for (let r = 1; !result && r <= 300; r++){
    stepTag = `Step ${r} · `;
    advance(); frameIf('Charge & Reveal abilities');
    casualties(); frameIf('Casualties');
    if ((result = check())) break;
    if (fight()){
      frameIf('Fight');
      casualties(); frameIf('Casualties');
    }
    result = check();
    if (r === 300 && !result) result = {w:-1, why:'Stalemate after 300 steps.'};
  }
  const left = p => (P[p].charge ? 1 : 0) + P[p].deck.length;
  if (result.w >= 0) result.why += ` ${P[result.w].nm} ${P[result.w].nm === 'You' ? 'have' : 'has'} ${left(result.w)} unit${left(result.w)===1?'':'s'} left.`;
  log(result.w < 0 ? 'Draw.' : `${P[result.w].nm} ${P[result.w].nm === 'You' ? 'win' : 'wins'} the battle and ${P[result.w].nm === 'You' ? 'score' : 'scores'} 1 point.`, result.w < 0 ? undefined : result.w);
  frame('Result');
  return {frames, result, left:[left(0), left(1)], cfgs:cfgCopy};
}
