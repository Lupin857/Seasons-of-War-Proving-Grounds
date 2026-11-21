
/* ===================== CARD DATA ===================== */
const DEFS = {
  'Hired Blade':{c:1,n:4,p:[4,6,8],v:[1],tt:'Shop: your income is {$v} lower.'},
  'Pikeman':{c:1,n:4,p:[1,2,3],v:[3,4,5],t:'If the enemy charging unit has more power, my attacks deal +3/4/5 damage.'},
  'Royal Watchman':{c:1,n:4,p:[1,2,3],v:[1,2,3],t:'Charge: if the enemy charging unit has more power than me, I gain 1/2/3 Shield tokens.'},
  'Desperate Infantry':{c:1,n:0,p:[1,2,3],v:[1,2,3],t:'On My Death: deal 1/2/3 damage to the enemy unit ahead of me.'},
  'Slinger':{c:1,n:4,p:[1,2,3],v:[1,2,3],t:'Reveal: deal 1/2/3 damage to the enemy revealed unit (or their charging unit if they have none).'},
  'Strong Villager':{c:1,n:4,p:[2,4,6],t:'No ability.'},
  'Dutiful Squire':{c:1,n:4,p:[1,2,3],v:[1,2,3],t:'Reveal: your charging unit gains 1/2/3 Armaments.'},
  'Conscripted Farmhand':{c:1,n:4,p:[1,2,3],v:[1,2,3],tt:'Shop: if you own a Field, gain {$v} income.'},
  'Veteran Knight':{c:1,n:0,p:[1,2,3],v:[1,2,3],t:'On My Death: the unit behind me gains 1/2/3 Armaments.'},
  'Cowardly Squire':{c:1,n:4,p:[1,2,3],v:[1],tt:'On My Death: {v|a Recruit takes my place and keeps|# Recruits take my place; the first keeps} my tokens and gear.'},
  'Arsonist':{c:2,n:0,p:[2,3,5],m:[1,1,2],t:'Mobilize: if I am in your deck, gain $1/$1/$2 per Field in the enemy city.'},
  'Assassin':{c:2,n:3,p:[3,4,5],t:'If the enemy has a revealed unit, I attack it instead of their charging unit. (The enemy charging unit still attacks normally.)'},
  'Marksman':{c:2,n:3,p:[2,4,6],t:'While Revealed: when your charging unit attacks, I also attack the enemy revealed unit (or their charging unit if they have none). It doesn\'t hit me back.'},
  'Studious Squire':{c:2,n:3,p:[2,3,6],v:[1,2,2],t:'While I\'m Revealed: when the ally ahead of me attacks, I gain 1/2/2 Might tokens.'},
  'Aging Master':{c:2,n:3,p:[2,3,6],x:[1,2,2],t:'When I Attack: your revealed unit gains 1/2/2 Might tokens.'},
  'Barber-Surgeon':{c:3,n:2,p:[2,3,5],v:[1],tt:'While Revealed: {v|once|# times} per battle, if your charging unit would die, instead remove all damage from it and move it with its attachments to the back of your deck.'},
  'Pigeon Hunter':{c:3,n:2,p:[2,4,6],t:'Your opponent’s units’ abilities are Silenced.'},
  'Brawler':{c:3,n:2,p:[3,5,7],t:'When I survive an attack, remove all damage from me.'},
  'Fencer':{c:2,n:2,p:[3,5,7],t:'Before I Attack: discard all Might tokens from the enemy charging unit.'},
  'Sleepy Guard':{c:2,n:3,p:[2,3,5],v:[2,3,3],t:'While I\'m Revealed: when the ally ahead of me is defeated, gain 2/3/3 Might tokens.'},
  'Musketeer':{c:2,n:3,p:[2,3,4],v:[1,2,4],t:'Reveal: deal 1/2/4 damage to the enemy charging and revealed units.'},
  'Dark Knight':{c:2,n:3,p:[4,6,8],v:[1],tt:'Reveal and Charge: deal {v} damage to your other unit, if any.'},
  'Knight':{c:2,n:3,p:[1,3,5],v:[3,3,3],t:'Charge: gain 3 Might tokens.'},
  'Jester':{c:2,n:3,p:[1,1,1],tt:'Reveal: copy the unit ahead of me at my level, then trigger its Reveal. Jester or nothing: power {p}.'},
  'Cannon':{c:3,n:2,p:[1,2,3],v:[3,5,7],t:'Reveal: deal 3/5/7 damage with Overrun to the enemy unit ahead of me.'},
  'Grave-Robber':{c:2,n:3,p:[2,4,6],t:'While Revealed: when a unit is defeated, I gain a Might token for each that it had.'},
  'Mercenary':{c:2,n:0,p:[5,6,7],t:"Doesn't count toward your unit limit. Discarded after the battle phase."},
  'Lancer':{c:4,n:2,p:[4,6,8],t:'My attacks have Overrun.'},
  'White Knight':{c:4,n:0,p:[3,5,5],v:[1,1,2],tt:'Reveal: the allied unit ahead of me gains {v|a Shield|# Shields}.'},
  'Recruiter':{c:2,n:3,p:[1,2,3],v:[1,2,3],t:'Charge: place 1/2/3 Recruits on top of your deck.'},
  'Executioner':{c:2,n:3,p:[1,2,3],t:'My damage is Lethal.'},
  'Scholar':{c:3,n:2,p:[1,2,4],v:[1,2,2],tt:'Reveal and Charge: your other charging or revealed unit gains {v|a Training token|# Training tokens}.'},
  'Man-at-arms':{c:4,n:2,p:[4,6,6],v:[1,1,2],tt:'Charge: gain {v|a Shield|# Shields}.'},
  'Halberd Knight':{c:4,n:2,p:[1,2,3],v:[3,4,5],t:'Reveal: deal 3/4/5 damage with Shieldbreak to the enemy unit ahead of me. Move me to the back of your deck.'},
  'Dowser Oracle':{c:3,n:2,p:[1,2,3],v:[1,2,3],t:'Reveal: your charging unit gains 1/2/3 Shields.'},
  'Armored Knight':{c:4,n:2,p:[4,6,6],v:[1,1,2],tt:'I take {v} less damage from all sources.'},
  'Monk':{c:3,n:2,p:[3,5,7],t:'Charge: if your revealed unit has less power than me, it gains Might tokens equal to the difference.'},
  'Recruit':{c:1,n:0,p:[1,2,3],token:true,t:'Token. 1/2/3 power: it levels up with Training like any unit. Discarded after the battle phase.'},
};
// Gear lives in the building deck and is bought like a building, but goes to your hand. During Mobilize you equip
// it to units in your deck (one gear per unit); it only counts as equipped in battle, and comes back to your hand after.
const BDEFS = {
  'Field':{c:1,n:0,lv:[1],always:true,t:'+$1 income. Each Field takes its own city slot.'},
  'Cathedral':{c:2,n:0,lv:[1],t:'+1 point while you own it. You must win a battle to reach the winning score.'},
  'Trebuchet':{c:2,n:0,lv:[3,5],t:'Battle start: deal 3/5 damage with Overrun and Shield-break to the enemy Vanguard.'},
  'Black Market':{c:2,n:3,lv:[3,4,5],tt:'Shop: once per shop, set aside the top {lv} cards of one shop deck. You may buy one for $1 less per level. Discard the rest at the end of the shop.'},
  "Mason's Guild":{c:2,n:2,lv:[1],attach:true,t:'When you buy this, attach it to another building to level that building up.'},
  'The Bazaar':{c:2,n:2,lv:[1],tt:'Shop: when you sell a card, gain an additional {$lv}.'},
  'Bazaar':{c:2,n:0,lv:[1,2,3],t:'Retired: no longer in the game.'},
  "Carpenter's Guild":{c:1,n:2,lv:[1,2,3],t:'Shop: you may make 1/2/3 extra buys of any kind each shop. Buildings cost $1 less (minimum $1).'},
  'Smithy':{c:1,n:3,lv:[1,2,3],t:'Mobilize: attach 1/2/3 Armaments to your units.'},
  'Barracks':{c:1,n:3,lv:[1,2,3],t:'Mobilize: add 1/2/3 Recruits to your deck.'},
  'Reserve Encampment':{c:1,n:3,lv:[1,2,3],t:'Mobilize: your deck holds 1/2/3 more unique units.'},
  'Study':{c:2,n:3,lv:[1,2],t:'Mobilize: add 1/2 Training tokens to your army.'},
  'Armory':{c:2,n:2,lv:[1,2],t:'Mobilize: attach 1/2 Shields to your units.'},
  'Training Yard':{c:2,n:0,lv:[1,2],t:'Battle start: train your Vanguard 1/2 times, then it gains an Armament.'},
  'Windmill':{c:2,n:3,lv:[2,4],t:'Shop: +$2/$4 income.'},
  'Infirmary':{c:3,n:2,lv:[1],t:'The first time one of your units would be defeated, put it on the bottom of your deck with no damage instead.'},
  'Muster Hall':{c:1,n:2,lv:[1,2],t:'Shop: Recruits cost $0. Battle: your Recruits are trained 1/2 times.'},
  'Chapel':{c:2,n:0,lv:[1,2],t:'Shop: cards with miracles under them cost $1/$2 less (minimum $0).'},
  'War College':{c:1,n:2,lv:[1],t:'Shop: you may buy duplicate cards from the discard pile for free.'},
  'Altar of Blood':{c:1,n:1,lv:[4],tt:'Shop: gain {$lv} income. At the start of each shop, discard your most expensive unit. You cannot sell Altar of Blood.'},
  // gear
  'War Banner':{c:1,n:2,lv:[2],gear:true,tt:'Gear: the friendly unit ahead of this unit gains +{lv} power.'},
  'Healing Balm':{c:1,n:2,lv:[1],gear:true,t:'Gear: when this unit survives an attack, remove 2 of the damage it dealt.'},
  'War Horn':{c:1,n:2,lv:[1],gear:true,t:'Gear: the equipped unit gains “Charge: trigger your revealed unit’s Reveal ability.”'},
  'Zweihander':{c:1,n:2,lv:[2],gear:true,tt:'Gear: this unit gains +{lv} power. It cannot have Armament or Shield tokens.'},
  'Battle Axe':{c:1,n:2,lv:[1],gear:true,tt:'Gear: this unit gains +{lv} power and its attacks have Shield-break.'},
  'Poison Oil':{c:2,n:2,lv:[1],gear:true,t:'Gear: this unit’s damage is Lethal.'},
  'Lance':{c:2,n:2,lv:[1],gear:true,tt:'Gear: this unit gains +{lv} power and its attacks have Overrun.'},
  'Heirloom Blade':{c:2,n:1,lv:[2],gear:true,tt:'Gear: this unit gains +{lv} power. When it is defeated, attach Heirloom Blade to the next unit in your deck that does not have another gear.'},
  'War Drums':{c:1,n:2,lv:[1],gear:true,t:'Gear: the equipped unit gains “Reveal: trigger your charging unit’s Charge ability.”'},
};
const isGear = n => !!(BDEFS[n] && BDEFS[n].gear);
// The card sheet this page was built from. Balance patches, card stats and the AI's card opinions saved for an older
// sheet are set aside when it changes (they described cards that no longer play the same way).
const SHEET_VER = '2026-11-19b-oasis';
// Traditional Chinese names, shown on each card as a xiangqi-style chip
const ZH = {
  'Hired Blade':'傭劍','Pikeman':'槍兵','Royal Watchman':'御衛','Desperate Infantry':'死士','Slinger':'投石兵',
  'Strong Villager':'壯丁','Dutiful Squire':'忠侍','Conscripted Farmhand':'徵農','Veteran Knight':'老騎','Cowardly Squire':'怯侍',
  'Executioner':'劊子手','Arsonist':'火賊','Assassin':'刺客','Marksman':'神射','Studious Squire':'學侍','Aging Master':'老宗師','Barber-Surgeon':'軍醫',
  'Pigeon Hunter':'獵鴿人','Brawler':'鬥士','Fencer':'劍客','Sleepy Guard':'瞌睡衛','Musketeer':'火槍手','Dark Knight':'黑騎',
  'Knight':'騎士','Jester':'弄臣','Cannon':'炮','Grave-Robber':'盜墓賊','Mercenary':'傭兵','Lancer':'槍騎','White Knight':'白騎','Dowser Oracle':'占水師',
  'Recruiter':'募兵官','Scholar':'學士','Man-at-arms':'甲士','Halberd Knight':'戟騎','Armored Knight':'鐵騎','Monk':'統領','Recruit':'新兵',
  'Field':'田','Cathedral':'聖殿','Trebuchet':'投石機','Black Market':'黑市',"Mason's Guild":'石匠會',"Carpenter's Guild":'木匠會',
  'Smithy':'鐵匠鋪','Barracks':'兵營','Reserve Encampment':'預備營','Study':'書房','Armory':'軍械庫','Training Yard':'校場',
  'Windmill':'風車','Infirmary':'醫館','Muster Hall':'點兵堂','Chapel':'禮拜堂','War College':'武學',
  'The Bazaar':'市集','Altar of Blood':'血壇','War Banner':'戰旗','Healing Balm':'藥膏','War Horn':'號角','Zweihander':'雙手劍',
  'Battle Axe':'戰斧','Poison Oil':'毒油','Lance':'騎槍','Heirloom Blade':'傳家劍','War Drums':'戰鼓',
};
// the faint chip watermark behind a card's text (market, bought/taken, forces, mobilize)
function zhMark(name){
  const z = ZH[name]; if (!z) return '';
  return `<span class="zhw" data-n="${Math.min(3, [...z].length)}" aria-hidden="true"><span lang="zh-Hant">${z}</span></span>`;
}
// One face for every card that should look the same: name and cost, power curve, the chip, then the rules text.
// Each place adds its own wrapper classes, stamps (shown under the card) and buttons.
function cardFace(name, kind, own, noNext){
  const d = kind === 'u' ? DEFS[name] : BDEFS[name];
  const art = typeof artURL === 'function' ? artURL(name, kind) : null;
  if (art) return `<div class="cface art">${artImg(art, dispName(name))}<div class="cface-txt">${cardFace0(name, kind, own, noNext, d)}</div></div>${d.c ? `<span class="ccost" aria-hidden="true"><svg viewBox="0 0 12 16"><path d="M6 1C6 1 1 7.5 1 10.5a5 5 0 0 0 10 0C11 7.5 6 1 6 1z"/></svg>${d.c}</span>` : ''}`;
  return cardFace0(name, kind, own, noNext, d);
}
function cardFace0(name, kind, own, noNext, d){
  return `${zhMark(name)}<div class="top"><span class="nm">${esc(name)}</span><span class="cost">${'$'.repeat(d.c)}</span></div>
    <span class="curve">${curveText(name, kind, own, noNext)}</span>
    <span class="tx">${cardTx(name, kind, own, noNext)}</span>${shortHTML(name, kind, own, noNext)}<i class="cfm" hidden data-n="${esc(name)}" data-k="${kind}" data-o="${own ?? ''}" data-x="${noNext ? 1 : ''}"></i>`;
}
// status stamps sit just under the card, outside it
const stampsHTML = list => { list = list.filter(Boolean); return list.length ? `<span class="stamps">${list.map(([c, t]) => `<span class="stamp ${c}">${t}</span>`).join('')}</span>` : ''; };
function ownStamp(name, kind, own){
  if (!own) return null;
  const n = kind === 'u' ? 0 : BDEFS[name].lv.length;
  if (kind === 'b' && name !== 'Field' && n <= 1) return ['st-own', 'You own it'];
  const have = kind === 'u' || name === 'Field' ? `×${own}` : `Lv ${Math.min(own, n)}`;
  let next = '';
  if (kind === 'u' && !exemptUnit(name)){ const L = uLvl(name, own); if (L < uMax(name)) next = ` → Lv ${L + 1}`; }
  else if (kind === 'b' && name !== 'Field' && own < n) next = ` → Lv ${own + 1}`;
  return ['st-own', `You own ${have}${next}`];
}
function zhChip(name){
  const z = ZH[name]; if (!z) return '';
  return `<span class="zh" data-n="${Math.min(3, [...z].length)}" aria-hidden="true"><span lang="zh-Hant">${z}</span></span>`;
}

/* ===================== BATTLE ENGINE ===================== */
function runBattle(cfgs, record){
  if (record === undefined) record = true;
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
  const mvs = list => record ? {mv:list.map(([u, from, to, k]) => ({u:`${u.owner}-${u.uid}`, from, to, k}))} : undefined;
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
  // Pigeon Hunter: while it is charging or revealed, the other side's units are Silenced (no ability text)
  const phActive = p => { const pl = P[p]; for (const x of [pl.charge, pl.deck[0]]) if (x && key(x) === 'Pigeon Hunter' && !x.jFail) return x; return null; };
  const silencedBy = u => phActive(1 - u.owner);
  const ab = u => !!u && !u.jFail && !silencedBy(u);
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
  const hitMeta = (u, src, side, amt) => { const f = srcUnit(src); return {from: f ? `${f.owner}-${f.uid}` : null, to:`${u.owner}-${u.uid}`, by:side, amt}; };
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
  // Pigeon Hunter (while charging or revealed): the opponent's units are Silenced, so their abilities do nothing
  const hush = p => phActive(1 - p);
  function hushed(u, p, what){ const h = hush(p); if (!h) return false; withAb(abU(h, 1-p), () => log(`${nameOf(u)}'s ${what} doesn't trigger: ${nameOf(h)} silences it.`, 1-p)); return true; }
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
        if (hs[p]){ if (!u.jFail && REVEALS.has(key(u))) withAb(abU(hs[p], 1-p), () => log(`${nameOf(u)}'s Reveal doesn't trigger: ${nameOf(hs[p])} silences it.`, 1-p)); continue; }
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
    if (pe[0] || pe[1]){ revealRound(pe); return true; }
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
      // Barber-Surgeon (While Revealed): a charging unit that would die goes to the bottom of the deck, undamaged
      for (const p of [0,1]){
        const c = P[p].charge, t = top(p);
        if (c && isDead(c) && t && key(t) === 'Barber-Surgeon' && ab(t) && !isDead(t) && (t.saves || 0) < val(t)){
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
      frameIf('Saves');
      const dying = [];
      for (const p of [0,1]){
        const c = P[p].charge; if (c && isDead(c)) dying.push({p, u:c, zone:'c'});
        P[p].deck.forEach((u, i) => { if (isDead(u)) dying.push({p, u, zone:'d', i}); });
      }
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
        withAb(abU(u, p), () => log(`${nameOf(u)} is replaced by ${many(k, 'a Recruit', 'Recruits')}${r.gear || r.arm || r.sh ? ' that keeps its tokens and gear' : ''}.`, p, record ? {...tokMeta(u, rs[0], p, 'rec', k), ...mvs(rs.map((x, i) => [x, 'new', atC && i === 0 ? 'charge' : 'deck', 'arrive']))} : undefined)); return rs; } return []; };
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
        withAb(abU(c[p], p), () => log(`${nameOf(c[p])} removes ${many(k, 'an Armament', 'Armaments')} from ${nameOf(e)} (${power(e)} power).`, p));
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
    if (!sp) mark();
    frameIf('Charge');
    if (sp){ surface(charges); frameIf('Charge abilities & battle miracles'); mark(); }
    else round(charges);
    revealRound(pe);
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
  for (const p of [0,1]){ const t = top(p); if (P[p].armory && t && addSh(t, P[p].armory, p)){ withAb(abB('Armory', p), () => log(`Armory gives ${nameOf(t)} ${P[p].armory} ${plural(P[p].armory, 'Shield')}.`, p, tokMeta(null, t, p, 'sh', P[p].armory))); } }
  for (const p of [0,1]){ if (!P[p].drill) continue; const rs = P[p].deck.filter(u => u.name === 'Recruit'); if (!rs.length) continue;
    withAb(abB('Muster Hall', p), () => { for (const u of rs){ u.train = Math.max(u.train, P[p].drill); log(`${P[p].nm} Muster Hall trains ${nameOf(u)} to level ${lvl(u)} (${power(u)} power).`, p, tokMeta(null, u, p, 'tr', P[p].drill)); } }); }
  for (const p of [0,1]){ const t = top(p); if (P[p].yard && t) withAb(abB('Training Yard', p), () => { for (let k = 0; k < P[p].yard; k++) train(t, `${P[p].nm} Training Yard`, p); if (addArm(t, 1, 'Training Yard', p)) log(`Training Yard gives ${nameOf(t)} an Armament.`, p, tokMeta(null, t, p, 'arm', 1)); }); }
  for (const p of [0,1]){
    if (P[p].treb){ const t = top(1-p); if (t) withAb(abB('Trebuchet', p), () => round(() => overrunHit(t, BDEFS.Trebuchet.lv[P[p].treb-1], `${P[p].nm} Trebuchet`, p, P[1-p].deck[1], null, true))); }
  }
  revealRound([top(0), top(1)]);
  frame('Battle start');
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
  return {frames, result, left:[left(0), left(1)]};
}

/* ===================== FULL GAME ===================== */
const unitPool = () => Object.entries(DEFS).filter(([k,d]) => !d.token).flatMap(([k,d]) => Array(Math.max(0, d.n|0)).fill(k));
const bldPool = () => Object.entries(BDEFS).filter(([k,d]) => !d.always && d.n > 0).flatMap(([k,d]) => Array(Math.max(0, d.n|0)).fill(k));
/* ===================== MIRACLES =====================
   Miracles are shuffled into the shop decks. One never sits in the display alone: when it's drawn, the next card of
   that deck is laid on top of it (another miracle drawn this way stacks too). The top card costs its price plus every
   miracle's surcharge (discounts apply to the total); its buyer gets every miracle under it. Money miracles pay out at
   once; the rest go to the buyer's hand, which both players can see. Unbought, the stack goes sideways and is
   discarded together. Black Market and Vision put any miracle they turn up on the bottom and look at one more card. */
const MIRS = {
  'Tithe':         {u:1, b:0, s:0, cash:1, sh:'$1 back now', t:'Get $1 back right away.'},
  'Windfall':      {u:1, b:1, s:1, cash:2, sh:'$2 back now', t:'Get $2 back right away.'},
  'Militia Vow':   {u:2, b:0, s:0, rec:1, sh:'hand: +1 Recruit at a Mobilize', t:'Goes to your hand. At a Mobilize, add 1 Recruit to your deck. Single use.'},
  'Call to Arms':  {u:1, b:0, s:1, rec:2, sh:'hand: +2 Recruits at a Mobilize', t:'Goes to your hand. At a Mobilize, add 2 Recruits to your deck. Single use.'},
  'Blessed Steel': {u:1, b:0, s:1, arm:2, sh:'hand: +2 Armaments at a Mobilize', t:"Goes to your hand. At a Mobilize, place 2 Armaments (on top of your Smithy's). Single use."},
  'Divine Favor':  {u:0, b:1, s:1, fav:1, sh:'hand: 1 extra buy on a shop turn', t:'Goes to your hand. On any shop turn, use it for one extra buy at normal price. Single use.'},
  'Vision':        {u:0, b:1, s:0, vis:3, sh:'hand: look at 3, buy 1', t:'Goes to your hand. On any shop turn, look at the top 3 cards of either deck and buy one at normal price (uses a normal buy). Single use.'},
  'Discard Writ':   {u:1, b:0, s:1, writ:1, sh:'now: up to 2 display cards to the discard pile', t:'Use it right away: move up to 2 other cards from the display to the discard pile (any miracles under them are discarded).'},
  'Patronage':     {u:1, b:1, s:1, disc:2, sh:'', t:''},
  'Sacred Lesson': {u:1, b:0, s:1, tr:1, sh:'hand: +1 Training token at a Mobilize', t:"Goes to your hand. At a Mobilize, place 1 Training token (on top of your Study's). Single use."},
  'Freeze':        {u:1, b:1, s:0, frz:1, sh:'', t:''},
  'Covenant':      {u:1, b:1, s:0, cov:1, sh:'', t:''},
  'Mill':          {u:1, b:0, s:0, mill:3, sh:'', t:''},
  'Restock':       {u:1, b:1, s:0, rst:1, sh:'', t:''},
  'Upheaval':      {u:1, b:1, s:0, rdl:1, sh:'', t:''},
  // battle miracles (a separate set, switched on at game start): placed in your deck at Mobilize, they resolve when they
  // become the top card. bat: what it does; bn: its number (damage, Shields, reveals silenced, extra Reveals);
  // bv: a rough worth for the AI's shopping, in Armaments
  'Ambush':        {u:1, b:0, s:1, bat:'ambush', bn:2, bv:1.6, sh:'', t:''},
  'Divine Shield': {u:0, b:1, s:1, bat:'shield', bn:1, bv:1.2, sh:'', t:''},
  'Second Wind':   {u:1, b:0, s:1, bat:'wind', bn:1, bv:1.4, sh:'', t:''},
  'Silence':       {u:1, b:0, s:0, bat:'silence', bn:1, bv:0.6, sh:'', t:''},
  'Sabotage':      {u:0, b:1, s:0, bat:'sabotage', bn:1, bv:0.8, sh:'', t:''},
};
// what each miracle does is one number (its effect key); its text is written from that number
const MIR_FX = {};
for (const n in MIRS) MIR_FX[n] = ['cash','disc','rec','arm','tr','writ','vis','fav','frz','cov','mill','rst','rdl','bn'].find(k => MIRS[n][k]);
// battle miracles: what each does when it surfaces ("unit ahead": the charging unit, or the Vanguard at battle start)
const isBat = n => !!(MIRS[n] && MIRS[n].bat);
function batFx(n){
  const m = MIRS[n], v = m.bn || 1;
  switch (m.bat){
    case 'ambush': return `Deal ${v} damage to the enemy unit ahead.`;
    case 'shield': return `Your unit ahead gains ${v === 1 ? 'a Shield' : v + ' Shields'}.`;
    case 'sabotage': return 'Remove all Armaments and Shields from the enemy unit ahead.';
    case 'wind': return 'Attach this to your unit ahead. The next time it would die, put it on the bottom of your deck with no damage instead.';
    case 'silence': return `Your opponent's next ${v === 1 ? 'reveal doesn\'t' : v + ' reveals don\'t'} trigger, battle miracles included.`;
    case 'drums': return `Your next revealed unit triggers its Reveal ${v === 1 ? 'twice' : v + 1 + ' times'}.`;
  }
  return '';
}
const BAT_SHORT = {ambush:v => `${v} damage to the enemy unit ahead`, shield:v => `your unit ahead gains ${v === 1 ? 'a Shield' : v + ' Shields'}`,
  sabotage:() => 'strip the enemy unit ahead of Armaments and Shields', wind:() => 'your unit ahead returns once instead of dying',
  silence:v => `the enemy's next ${v === 1 ? 'reveal is' : v + ' reveals are'} blanked`, drums:v => `your next Reveal triggers ${v === 1 ? 'twice' : v + 1 + ' times'}`};
const MIR_TEXT = {
  cash:v => [`$${v} back now`, `When you buy the card on top of this, get $${v} back.`],
  rec: v => [`hand: +${v} Recruit${v === 1 ? '' : 's'} at a Mobilize`, `When you buy the card on top of this, put this card in your hand. You may discard this card at a Mobilize to add ${v} Recruit${v === 1 ? '' : 's'} to your deck.`],
  arm: v => [`hand: +${v} Armament${v === 1 ? '' : 's'} at a Mobilize`, `When you buy the card on top of this, put this card in your hand. You may discard this card at a Mobilize to place ${v} Armament${v === 1 ? '' : 's'} (on top of your Smithy's).`],
  tr:  v => [`hand: +${v} Training token${v === 1 ? '' : 's'} at a Mobilize`, `When you buy the card on top of this, put this card in your hand. You may discard this card at a Mobilize to place ${v} Training token${v === 1 ? '' : 's'} (on top of your Study's).`],
  writ:v => [`now: ${v === 1 ? 'a display card' : `up to ${v} display cards`} to the discard pile, then shop again`, `When you buy the card on top of this, move ${v === 1 ? 'up to 1 other card' : `up to ${v} other cards`} from the display to the discard pile (any miracles under ${v === 1 ? 'it are' : 'them are'} discarded) and deal ${v === 1 ? 'a new card' : 'new cards'} from the same deck to replace ${v === 1 ? 'it' : 'them'}. Then take another shop turn before your opponent.`],
  vis: v => [`hand: look at ${v}, buy 1`, `When you buy the card on top of this, put this card in your hand. You may discard this card on any shop turn to look at the top ${v} cards of either deck and buy one at normal price (uses a normal buy).`],
  disc:v => [`hand: play it so your next buy costs $${v} less`, `When you buy the card on top of this, put this card in your hand. On your shop turn you may play it: the next card you buy, of any kind, costs $${v} less (minimum $0). Then discard this card.`],
  fav: v => [`hand: ${v === 1 ? '1 extra buy' : v + ' extra buys'} on a shop turn`, `When you buy the card on top of this, put this card in your hand. You may discard this card on any shop turn for ${v === 1 ? 'one Extra buy' : v + ' Extra buys'} at normal price.`],
  frz: v => ['hand: set aside a display card for later', 'When you buy the card on top of this, put this card in your hand. On your shop turn you may discard this card as your turn to set aside a display card and any miracles under it; its spot stays empty. You may buy it at normal price on any later shop turn, even in a later round.'],
  cov: v => [`dealt with ${v === 1 ? 'one more card' : v + ' more cards'} on top`, `When this is dealt, ${v === 1 ? 'one more card' : v + ' more cards'} from the same deck ${v === 1 ? 'is' : 'are'} dealt on top of it. The cards on top are bought together for their combined price.`],
  mill:v => [`now: the top ${v} units go to the discard pile`, `When you buy the card on top of this, send the top ${v} units of the unit deck to the discard pile.`],
  rst: v => [`now: ${v === 1 ? 'a new card' : v + ' new cards'} in the display`, `When you buy the card on top of this, deal ${v === 1 ? 'a card' : v + ' cards'} from the same deck into the shop display.`],
  rdl: v => ['hand: clear the display and deal a new one', 'When you buy the card on top of this, put this card in your hand. On your shop turn you may discard this card to send every card in the shop display to the discard pile (any miracles under them are discarded), then deal new cards until the display is full. It does not use your turn.'],
};
function mirRetext(n){
  const m = MIRS[n];
  if (m.bat){ m.sh = `battle: ${BAT_SHORT[m.bat](m.bn || 1)}`; m.t = `When you buy the card on top of this, put this card in your hand. At a Mobilize you may place it anywhere in your deck (it doesn't count as a unit). It resolves when it becomes the top card of your deck: ${batFx(n)} ("Unit ahead": the charging unit, or the Vanguard at battle start.) After the battle it goes to the discard pile.`; return; }
  const k = MIR_FX[n]; if (!k) return; const [sh, t] = MIR_TEXT[k](m[k]); m.sh = sh; m.t = t; }
for (const n in MIRS) mirRetext(n);
const isMir = n => !!MIRS[n];
// bat: with the battle miracles in, Mill and Restock make room for them; without, the battle miracles stay out
const BAT_OUT = new Set(['Mill', 'Restock']);
const mirPool = (k, bat) => Object.entries(MIRS).filter(([n, m]) => bat ? !BAT_OUT.has(n) : !m.bat).flatMap(([n, m]) => Array(m[k] | 0).fill(n));
// every miracle that's used up or discarded lands face up in the discard pile (just to see: miracles there can't be bought)
function toSal(g, names){ if (names && names.length) (g.salvMir || (g.salvMir = [])).push(...names); }
const mirSur = list => (list || []).reduce((s, n) => s + MIRS[n].s, 0);
const mirHeld = (p, key) => (p.mir || []).reduce((s, n) => s + (MIRS[n][key] || 0), 0);
// Recruits, Armaments and Training a player can place at Mobilize: their own (bought Recruits, Barracks, Smithy, Study) plus any
// miracles in hand. Placing more than their own uses up miracles (see mirSpend).
function recBase(p){ return ((p.hand && p.hand.Recruit) || 0) + bVal(p, 'Barracks'); }
function recAllow(p){ return recBase(p) + (p._noMir ? 0 : mirHeld(p, 'rec')); }
function armAllow(p){ return bVal(p, 'Smithy') + (p._noMir ? 0 : mirHeld(p, 'arm')); }
function trAllow(p){ return bVal(p, 'Study') + (p._noMir ? 0 : mirHeld(p, 'tr')); }
function shAllow(p){ return bVal(p, 'Armory'); }
// which miracles in hand (indexes) cover `over` extra tokens of one kind: the smallest total that covers it, then the fewest cards
function mirSpend(p, key, over){
  if (over <= 0) return [];
  const idx = []; (p.mir || []).forEach((n, j) => { if (MIRS[n][key]) idx.push(j); });
  const m = Math.min(idx.length, 12); let best = null;
  for (let mask = 1; mask < (1 << m); mask++){
    let s = 0, c = 0; for (let b = 0; b < m; b++) if (mask >> b & 1){ s += MIRS[p.mir[idx[b]]][key]; c++; }
    if (s >= over && (!best || s < best.s || (s === best.s && c < best.c))) best = {s, c, mask};
  }
  return best ? idx.slice(0, m).filter((_, b) => best.mask >> b & 1) : [];
}
// the display card (or frozen card) an option points at, or null
function slotOf(g, o){
  if (o.src === 'du') return g.disp.u[o.idx] || null;
  if (o.src === 'db') return g.disp.b[o.idx] || null;
  if (o.src === 'fz') return (g.frozen && g.frozen[o.who ?? cur(g)] || [])[o.idx] || null;
  return null;
}
// the miracles under a display card (or none)
function mirOf(g, o){ const c = slotOf(g, o); return (c && c.mir) || []; }
// Covenant: the extra cards bought together with a display card (or none)
function pairOf(g, o){ const c = slotOf(g, o); return (c && c.pair) || []; }
const pairCost = (pair, kind) => (pair || []).reduce((s, n) => s + ((kind === 'u' ? DEFS : BDEFS)[n] || {c:0}).c, 0);
// draw the next display card: miracles drawn on the way stack under it
function dealCard(g, k){
  const deck = k === 'u' ? g.uDeck : g.bDeck, mir = [];
  while (deck.length){ const n = deck.pop(); if (isMir(n)) mir.push(n); else {
    if (mir.length && g.mirShown) for (const m of mir) g.mirShown[m] = (g.mirShown[m] || 0) + 1;
    const c = {name:n, side:false, mir, id:g.cid = (g.cid || 0) + 1};   // id: which physical card this is, so the screen can follow it
    // Covenant: one more card from the same deck is dealt on top; the two are bought together
    const nCov = mir.reduce((s, m) => s + (MIRS[m].cov || 0), 0);
    if (nCov){ const extra = peekCards(deck, nCov); if (extra.length) c.pair = extra; }
    return c; } }
  for (const m of mir) deck.unshift(m);   // nothing left to cover them: they wait at the bottom
  return null;
}
// Automatic shop refills (optional, set at the start of a game): a bought display card is replaced right away from its
// own deck, into the spot it was bought from (only that spot: a gap left by Freeze stays empty)
function refillRow(g, k, at){
  if (!g.refill || at == null) return;
  const size = dispSize(g, k), row = g.disp[k];
  if (row.length >= size || row.some(c => c.at === at)) return;   // full, or Restock already filled the spot
  const c = dealCard(g, k); if (!c) return;
  c.at = at;
  const j = row.findIndex(x => x.at != null && x.at > at); if (j < 0) row.push(c); else row.splice(j, 0, c);
}
// take n cards off the top of a deck to look at; a miracle goes to the bottom and one more card is looked at
function peekCards(deck, n){
  const cards = [], skip = [];
  while (cards.length < n && deck.length){ const c = deck.pop(); if (isMir(c)) skip.push(c); else cards.push(c); }
  for (const c of skip) deck.unshift(c);
  return cards;
}
/* Black Market and Vision are one thing in the rules: a peek. The top cards of one deck are set aside for one player,
   tagged by what took them ('bm' or 'vis'); a player can have one of each at a time (even on the same deck: the second
   sees the cards under the first). Buying one of them puts the rest under the deck it came from; so does the end of the
   shop. They differ only in price (Black Market takes $1/$2/$3 off) and in what they use up. */
const PEEK_BY = ['bm', 'vis'];
function peekOf(g, i, by){ const L = g.peek && g.peek[i]; return (L && L.find(p => p.by === by)) || null; }
function startPeek(g, i, by, k, n){
  const cards = peekCards(k === 'u' ? g.uDeck : g.bDeck, n);
  (g.peek || (g.peek = [[], []]))[i].push({by, k, cards});
  return cards;
}
function endPeek(g, i, by){
  const L = g.peek && g.peek[i], j = L ? L.findIndex(p => p.by === by) : -1; if (j < 0) return;
  const pk = L[j], deck = pk.k === 'u' ? g.uDeck : g.bDeck;
  // The Fence: the cards you didn't buy are discarded (face up in the discard pile). Vision still puts them under the deck.
  if (by === 'bm'){ g.muster = g.muster || []; g.muster.push(...pk.cards); }
  else for (const c of pk.cards) deck.unshift(c);
  L.splice(j, 1);
}
const RULES = {target:3, buysPerShop:3, fieldsPerShop:1, citySlots:5, deckCap:5, baseIncome:3, unitDisplay:5, bldgDisplay:5, maxRounds:20, startFields:1};
/* Game setup: the starting conditions and limits of one game, chosen on the setup screen. A missing value means the
   rule above. Shared: deckCap, city (Caravan slots), uDisp/bDisp (shop display sizes), catchup (the player behind on
   points gets +$catchup at the start of each shop). Per player (pl[0], pl[1]): water (extra water at the start),
   fields (Moisture Harvesters owned at the start), drift (Drifters in hand for the first battle), inc (base income),
   buys (buys per shop), fps (Harvester buys per shop). */
function suDefault(){
  return {deckCap:RULES.deckCap, city:RULES.citySlots, uDisp:RULES.unitDisplay, bDisp:RULES.bldgDisplay, catchup:0,
    pl:[0,1].map(() => ({water:0, fields:RULES.startFields, drift:0, inc:RULES.baseIncome, buys:RULES.buysPerShop, fps:RULES.fieldsPerShop}))};
}
// a player's own copy of the rules that can differ per game (or per player)
const ruleOf = (p, k, d) => p && p.su && p.su[k] != null ? p.su[k] : d;
const buyCap = p => ruleOf(p, 'buys', RULES.buysPerShop);
const buysOf = b => b && b.cap != null ? b.cap : RULES.buysPerShop;
const citySlots = p => ruleOf(p, 'city', RULES.citySlots);
const dispSize = (g, k) => k === 'u' ? (g && g.su && g.su.uDisp) || RULES.unitDisplay : (g && g.su && g.su.bDisp) || RULES.bldgDisplay;

/* ===================== BALANCE OVERRIDES ===================== */
// The sheet's numbers are kept in ORIG; overrides are applied on top so every change can be undone.
// Card text templates: {v} {x} {p} print a value ("2", or "1/2/3" if it changes by level); {$v} adds $ signs;
// {v|one|many} picks wording: "one" when the value is 1 at every level, otherwise "many" with # replaced by the value
// (a third part is used when the value is 0 at every level).
function fillText(tt, d){
  const fmt = (a, $) => { a = a || [0]; const s = $ ? '$' : ''; return a.every(x => x === a[0]) ? s + a[0] : a.map(x => s + x).join('/'); };
  return tt.replace(/\{(\$?)(lv|[vxp])(?:\|([^|}]*)\|([^|}]*)(?:\|([^|}]*))?)?\}/g, (m, $, k, one, few, zero) => {
    const a = d[k] || [0];
    if (one === undefined) return fmt(a, $);
    if (zero !== undefined && a.every(x => x === 0)) return zero;
    return (a.every(x => x === 1) ? one : few).replace('#', fmt(a, $));
  });
}
for (const n in DEFS) if (DEFS[n].tt) DEFS[n].t = fillText(DEFS[n].tt, DEFS[n]);
for (const n in BDEFS) if (BDEFS[n].tt) BDEFS[n].t = fillText(BDEFS[n].tt, BDEFS[n]);
const ORIG = JSON.parse(JSON.stringify({DEFS, BDEFS, RULES, MIRS}));
// SHEET never changes. ORIG is the baseline the lab edits against: the sheet plus the finalized balance.
const SHEET = JSON.parse(JSON.stringify(ORIG));
let OV_KEY = '';
// a stored balance change only applies to numbers the card still has (Farmhand's old Mobilize money is dropped)
function ovKeep(o, sheet){ if (!o) return {}; const r = {}; for (const k in o) if (!sheet || k in sheet) r[k] = o[k]; return r; }
function applyOverrides(ov){
  ov = ov || {};
  const key = JSON.stringify(ov); if (key === OV_KEY) return; OV_KEY = key;
  for (const n in ORIG.DEFS){ for (const k of Object.keys(DEFS[n])) delete DEFS[n][k]; Object.assign(DEFS[n], JSON.parse(JSON.stringify(ORIG.DEFS[n])), ovKeep((ov.units || {})[n], SHEET.DEFS[n])); }
  for (const n in ORIG.BDEFS){ for (const k of Object.keys(BDEFS[n])) delete BDEFS[n][k]; Object.assign(BDEFS[n], JSON.parse(JSON.stringify(ORIG.BDEFS[n])), (ov.bldgs || {})[n] || {}); }
  Object.assign(RULES, ORIG.RULES, ov.rules || {});
  for (const n in ORIG.MIRS){ for (const k of Object.keys(MIRS[n])) delete MIRS[n][k]; Object.assign(MIRS[n], JSON.parse(JSON.stringify(ORIG.MIRS[n])), (ov.mirs || {})[n] || {}); mirRetext(n); }
  // rewrite card text so it shows the current numbers
  const swap = (t, from, to) => {
    if (!from || !to || JSON.stringify(from) === JSON.stringify(to)) return t;
    const a = from.join('/'), b = to.join('/'), a$ = '$' + from.join('/$'), b$ = '$' + to.join('/$');
    if (t.includes(a$)) return t.replace(a$, b$);
    return t.replace(a, b);
  };
  for (const n in ORIG.DEFS){ if (ORIG.DEFS[n].tt){ DEFS[n].t = fillText(ORIG.DEFS[n].tt, DEFS[n]); continue; } let t = ORIG.DEFS[n].t; t = swap(t, ORIG.DEFS[n].v, DEFS[n].v); t = swap(t, ORIG.DEFS[n].m, DEFS[n].m); DEFS[n].t = t; }
  for (const n in ORIG.BDEFS) BDEFS[n].t = ORIG.BDEFS[n].tt ? fillText(ORIG.BDEFS[n].tt, BDEFS[n]) : swap(ORIG.BDEFS[n].t, ORIG.BDEFS[n].lv, BDEFS[n].lv);
}
function describeOverrides(ov, base){
  base = base || ORIG;
  const out = [], f = a => Array.isArray(a) ? a.join('/') : a;
  const lbl = {c:'cost', n:'copies', p:'power', v:'ability', x:'ability 2', m:'money', lv:'levels'};
  for (const [grp, src] of [['units', base.DEFS], ['bldgs', base.BDEFS]]) for (const n in (ov[grp] || {})){
    if (!src[n]) continue;
    const ch = Object.entries(ov[grp][n]).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(src[n][k])).map(([k, v]) => `${lbl[k] || k} ${k === 'c' ? '$' + v : f(v)}`);
    if (ch.length) out.push(`${n}: ${ch.join(', ')}`);
  }
  for (const n in (ov.mirs || {})){
    const src = (base.MIRS || ORIG.MIRS)[n]; if (!src) continue;
    const ch = Object.entries(ov.mirs[n]).filter(([k, v]) => v !== src[k]).map(([k, v]) => k === 's' ? `surcharge +$${v}` : k === 'u' ? `unit-deck copies ${v}` : k === 'b' ? `building-deck copies ${v}` : `effect ${v}`);
    if (ch.length) out.push(`${n} (miracle): ${ch.join(', ')}`);
  }
  const rl = {target:'winning score', buysPerShop:'buys per shop', fieldsPerShop:'Fields per shop', citySlots:'city slots', deckCap:'deck size', baseIncome:'base income', unitDisplay:'unit display', bldgDisplay:'building display', maxRounds:'round limit', startFields:'starting Harvesters'};
  for (const k in (ov.rules || {})) if (ov.rules[k] !== base.RULES[k]) out.push(`${rl[k] || k}: ${ov.rules[k]}`);
  return out;
}
// Balance patches ---------------------------------------------------------
// One line per card (or rule) that differs between two override sets, both measured from the sheet:
// "Infirmary: cost $4 → $3". Values a set doesn't mention are the sheet's.
function patchDiff(a, b, base){
  base = base || SHEET; a = a || {}; b = b || {};
  const out = [], f = v => v === undefined || v === null ? '—' : Array.isArray(v) ? v.join('/') : String(v);
  const lbl = {c:'cost', n:'copies', p:'power', v:'ability', x:'ability 2', m:'money', lv:'levels'};
  const mlbl = {s:'surcharge', u:'unit-deck copies', b:'building-deck copies'};
  const keysOf = (g, n) => [...new Set(Object.keys(((a[g] || {})[n]) || {}).concat(Object.keys(((b[g] || {})[n]) || {})))];
  const namesOf = g => [...new Set(Object.keys(a[g] || {}).concat(Object.keys(b[g] || {})))].sort();
  for (const [g, src, kind] of [['units', base.DEFS, ''], ['bldgs', base.BDEFS, ''], ['mirs', base.MIRS, ' (miracle)']]){
    for (const n of namesOf(g)){
      if (!src[n]) continue;
      const ch = [];
      for (const k of keysOf(g, n)){
        const va = ((a[g] || {})[n] || {})[k] ?? src[n][k], vb = ((b[g] || {})[n] || {})[k] ?? src[n][k];
        if (JSON.stringify(va) === JSON.stringify(vb)) continue;
        const money = k === 'c' || (g === 'mirs' && k === 's');
        const fm = v => money && v !== undefined ? (g === 'mirs' ? '+$' : '$') + f(v) : f(v);
        ch.push(`${g === 'mirs' ? (mlbl[k] || 'effect') : (lbl[k] || k)} ${fm(va)} → ${fm(vb)}`);
      }
      if (ch.length) out.push(`${n}${kind}: ${ch.join(', ')}`);
    }
  }
  const rl = {target:'winning score', buysPerShop:'buys per shop', fieldsPerShop:'Fields per shop', citySlots:'city slots', deckCap:'deck size', baseIncome:'base income', unitDisplay:'unit display', bldgDisplay:'building display', maxRounds:'round limit', startFields:'starting Harvesters'};
  for (const k of [...new Set(Object.keys(a.rules || {}).concat(Object.keys(b.rules || {})))]){
    if (!(k in base.RULES)) continue;
    const va = (a.rules || {})[k] ?? base.RULES[k], vb = (b.rules || {})[k] ?? base.RULES[k];
    if (va !== vb) out.push(`Rules: ${rl[k] || k} ${va} → ${vb}`);
  }
  return out;
}
// A balance document saved before patches existed: rebuild its patches from the saved versions, oldest first,
// each measured against the one before it (the first against the sheet). Newest first, like doc.patches.
function seedPatches(d){
  if (!d) return [];
  if (Array.isArray(d.patches)) return d.patches;
  const vers = (Array.isArray(d.history) ? d.history.slice().reverse() : []).concat(d.json ? [{at:d.at, json:d.json}] : []);
  const out = []; let prev = {};
  for (const v of vers){
    let ov = {}; try{ ov = JSON.parse(v.json || '{}') || {}; }catch(e){ ov = {}; }
    const items = patchDiff(prev, ov);
    if (items.length) out.unshift({at:v.at, items, json:v.json});
    prev = ov;
  }
  return out;
}
// Lab tests --------------------------------------------------------------
// One side starts with a building already in its city; identical AIs otherwise.
function freeBuildingGames(b, lvl, n, depth){
  let w = 0;
  for (let k = 0; k < n; k++){
    const me = k % 2, g = newGame({genomes:[baseGenome(), baseGenome()]});
    if (isGear(b)) g.players[me].gear[b] = lvl;   // gear starts in hand (lvl copies)
    else g.players[me].city[b] = lvl;
    while (!g.over) autoRound(g, 8, depth);
    w += scoreFor(g.winner, me);
  }
  return w;
}
// One AI must buy the card every time it is offered and affordable (paying full price and using its buys);
// the other AI shops normally. Returns wins plus how often and how early the committed AI got the card.
function forcedCardGames(card, n, depth, once){
  let w = 0, got = 0, gw = 0, rsum = 0;
  for (let k = 0; k < n; k++){
    const me = k % 2, g = newGame({genomes:[baseGenome(), baseGenome()], miracles:MIRS[card] ? true : undefined, battleMir:isBat(card) ? true : undefined});
    g.players[me].force = card; g.players[me].forceOnce = !!once;
    let first = 0;
    while (!g.over){ autoRound(g, 8, depth); if (!first && (g.players[me].bought.includes(card) || (g.mirGot && g.mirGot[me].includes(card)))) first = g.round; }
    const r = scoreFor(g.winner, me);
    w += r; if (first){ got++; gw += r; rsum += first; }
  }
  return {w, got, gw, rsum};
}
// Same random deck and enemy, with unit A vs unit B in one random slot. Returns [winsA, winsB].
function slotBattles(a, b, lvl, n){
  const pool = Object.keys(DEFS).filter(x => !DEFS[x].token && x !== 'Jester' && DEFS[x].n > 0);
  const rnd = Math.random, deck = s => shuffle(pool.slice(), rnd).slice(0, s).map(x => ({name:x, copies:1 + (rnd() < 0.3 ? 1 : 0)}));
  let wa = 0, wb = 0;
  for (let k = 0; k < n; k++){
    const mine = deck(4), enemy = deck(5), at = Math.floor(rnd() * 5);
    const A = mine.slice(), B = mine.slice();
    A.splice(at, 0, {name:a, copies:lvl}); B.splice(at, 0, {name:b, copies:lvl});
    const ra = runBattle([{units:A}, {units:enemy}], false).result.w, rb = runBattle([{units:B}, {units:enemy}], false).result.w;
    wa += scoreFor(ra, 0); wb += scoreFor(rb, 0);
  }
  return [wa, wb];
}

function shuffle(a, rnd){ for (let i = a.length-1; i > 0; i--){ const j = Math.floor(rnd()*(i+1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
const uMax = n => DEFS[n].p.length;
const uLvl = (n, c) => Math.min(c, uMax(n));
// a fielded unit's level: its copies plus any Training, capped at the card's highest level
const armyLvl = u => uLvl(u.name, u.copies + (u.tr || 0));
// a result as points for player i: 1 for a win, 0.5 for a draw (w === -1), 0 for a loss
const scoreFor = (w, i) => w === i ? 1 : w === -1 ? 0.5 : 0;
// "Armament" / "Armaments": plural only above 1, as the log has always worded it
const plural = (n, word) => n > 1 ? word + 's' : word;
function bLvl(p, n){ const c = p.city[n] || 0; return Math.min(c, BDEFS[n].lv.length); }
function bVal(p, n){ const l = bLvl(p, n); return l ? BDEFS[n].lv[l-1] : 0; }
function slotsUsed(p){ let s = 0; for (const k in p.city){ if (!p.city[k]) continue; s += k === 'Field' ? p.city[k] : 1; } return s; }
function deckCap(p){ return ruleOf(p, 'deckCap', RULES.deckCap) + bVal(p, 'Reserve Encampment'); }
const exemptUnit = n => n === 'Mercenary' || n === 'Recruit';
function uniqueUnits(p){ return Object.keys(p.hand).filter(n => p.hand[n] > 0 && !exemptUnit(n)).length; }
function hiredBladeCost(c){ if (!c) return 0; const v = DEFS['Hired Blade'].v || [1]; return v[Math.min(c, DEFS['Hired Blade'].p.length, v.length) - 1]; }
function income(p){ return ruleOf(p, 'inc', RULES.baseIncome) + (p.city.Field || 0) + bVal(p, 'Windmill') + farmhandIncome(p) - hiredBladeCost(p.hand['Hired Blade'] || 0) + bVal(p, 'Altar of Blood'); }
// Conscripted Farmhand: more income while you own it and at least one Field
function farmhandIncome(p){ const c = (p.hand && p.hand['Conscripted Farmhand']) || 0, v = DEFS['Conscripted Farmhand'].v; return c && (p.city.Field || 0) > 0 ? v[Math.min(uLvl('Conscripted Farmhand', c), v.length) - 1] : 0; }
function total(p){ return p.score + (p.city.Cathedral ? 1 : 0); }
function masonTargets(p){ return Object.keys(p.city).filter(n => n !== 'Field' && p.city[n] > 0 && p.city[n] < BDEFS[n].lv.length); }

let MIRACLES_ON = false, BATTLE_MIR_ON = true, REFILL_ON = true;
function newGame(o){
  o = o || {};
  const g = newGame0(o);
  return applySetup(g, o.su);
}
function newGame0(o){
  const rnd = o.rnd || Math.random, mo = o.miracles ?? MIRACLES_ON, bmo = !!(mo && (o.battleMir ?? BATTLE_MIR_ON)), rf = !!(o.refill ?? REFILL_ON);
  return {rnd, miracles:mo, battleMir:bmo, refill:rf, spells:[[], []], salvMir:[], target:o.target || RULES.target, round:0, phase:'shop', winner:null, over:false,
    uDeck:shuffle(unitPool().concat(mo ? mirPool('u', bmo) : []), rnd), bDeck:shuffle(bldPool().concat(mo ? mirPool('b', bmo) : []), rnd), mirShown:{},
    disp:{u:[], b:[]}, muster:[], log:[], labels:o.labels || ['Azure','Gules'],
    players:[0,1].map(i => ({id:i, money:0, score:0, hand:{}, city:{}, gear:{}, equip:{}, mir:[], prevDeck:null, genome:(o.genomes||[])[i] || null, bought:[], wonLast:false})),
    su:null,
    order:[0,1], turnIdx:0, passed:[false,false], buys:null, frozen:[[], []], peek:[[], []], bmUsed:[false,false], mirGot:[[], []], decks:[null,null], lastBattle:null,
    om:o.om || [null,null], omPending:[null,null]};
}
// put a setup's starting conditions and limits on a new game (newGame without a setup plays by RULES)
function applySetup(g, su){
  const d = suDefault(); su = su || d;
  const num = (v, dv) => Number.isFinite(+v) && v !== null && v !== '' ? +v : dv;
  g.su = {uDisp:num(su.uDisp, d.uDisp), bDisp:num(su.bDisp, d.bDisp), catchup:num(su.catchup, 0)};
  g.players.forEach((p, i) => {
    const q = (su.pl && su.pl[i]) || {}, dq = d.pl[i];
    p.su = {inc:num(q.inc, dq.inc), buys:num(q.buys, dq.buys), fps:num(q.fps, dq.fps), deckCap:num(su.deckCap, d.deckCap), city:num(su.city, d.city)};
    const w = num(q.water, 0), f = num(q.fields, dq.fields), r = num(q.drift, 0);
    p.money = w;
    if (f > 0) p.city.Field = f;
    if (r > 0) p.hand.Recruit = r;
  });
  return g;
}
const cur = g => g.order[g.turnIdx];

function startShop(g){
  g.round++; g.phase = 'shop';
  for (const p of g.players) p.money += Math.max(0, income(p));
  // catch-up (a setup option): the player behind on points gets extra water
  let catchMsg = null;
  const cu = (g.su && g.su.catchup) || 0;
  if (cu > 0 && g.round > 1){
    const t0 = total(g.players[0]), t1 = total(g.players[1]);
    if (t0 !== t1){ const j = t0 < t1 ? 0 : 1; g.players[j].money += cu; catchMsg = {t:`Catch-up: ${g.labels[j]} ${g.labels[j] === 'You' ? 'are' : 'is'} behind and ${g.labels[j] === 'You' ? 'get' : 'gets'} +$${cu}.`, side:j}; }
  }
  for (const k of ['u','b']){
    const size = dispSize(g, k), deck = k === 'u' ? g.uDeck : g.bDeck;
    // each display card has a fixed slot (at); cards that stay keep theirs and new cards fill the empty ones in order
    const used = new Set(g.disp[k].filter(c => c.at != null).map(c => c.at));
    const free = () => { let a = 0; while (used.has(a)) a++; used.add(a); return a; };
    for (const c of g.disp[k]) if (c.at == null) c.at = free();
    while (g.disp[k].length < size){ const c = dealCard(g, k); if (!c) break; c.at = free(); g.disp[k].push(c); }
  }
  let first;
  if (g.round === 1){ first = g.firstOverride != null ? g.firstOverride : g.rnd() < 0.5 ? 0 : 1; g.first1 = first; }
  else if (g.lastBattle && g.lastBattle.w >= 0) first = 1 - g.lastBattle.w;
  else first = g.order[1];
  g.order = [first, 1 - first]; g.turnIdx = 0; g.passed = [false,false];
  g.buys = [0,1].map(i => ({u:0, b:0, carp:0, extra:false, fav:0, favN:0, fld:0, wc:0, cap:buyCap(g.players[i])}));
  g.peek = [[], []]; g.bmUsed = [false,false];
  g.seen = [new Set(), new Set()]; g.shopBought = [[], []]; g.buyTags = [{}, {}];
  g.mirSeen = [new Set(), new Set()]; g.mirShop = [[], []];
  // Altar of Blood: each owner discards one copy of their most expensive unit (a person picks among ties on their first turn)
  g.altarPend = [null, null];
  for (const i of [0,1]){ const opts = altarOpts(g.players[i]); if (!opts.length) continue;
    if (opts.length === 1 || g.players[i].genome || g._po) altarDiscard(g, i, opts.length === 1 ? opts[0] : aiAltarPick(g.players[i], opts)); else g.altarPend[i] = opts; }
  // position at the start of the shop (before anyone buys a Cathedral), used by the card stats
  g.shopLead = [0,1].map(i => total(g.players[i]) - total(g.players[1-i]));
  g.log.push({t:`Round ${g.round}. ${g.labels[first]} ${g.labels[first] === 'You' ? 'shop' : 'shops'} first.`});
  if (catchMsg) g.log.push(catchMsg);
}
// Altar of Blood: the units tied for most expensive (by cost), or [] if the player has no Altar or no units
function altarOpts(p){
  if (!p.city || !p.city['Altar of Blood']) return [];
  const own = Object.keys(p.hand).filter(n => p.hand[n] > 0 && DEFS[n] && !DEFS[n].token);
  if (!own.length) return [];
  const top = Math.max(...own.map(n => DEFS[n].c));
  return own.filter(n => DEFS[n].c === top).sort();
}
// the AI loses the copy that costs it the least strength (a lone copy costs the whole unit)
function aiAltarPick(p, opts){
  let best = opts[0], bl = Infinity;
  for (const n of opts){ const c = p.hand[n], l = strengthU(n, uLvl(n, c)) - strengthU(n, uLvl(n, c - 1)); if (l < bl){ bl = l; best = n; } }
  return best;
}
function altarDiscard(g, i, name){
  const p = g.players[i]; if (!p.hand[name]) return false;
  if (!--p.hand[name]) delete p.hand[name];
  (g.muster || (g.muster = [])).push(name);
  if (g.altarPend) g.altarPend[i] = null;
  g.log.push({t:`Altar of Blood: ${g.labels[i]} ${g.labels[i]==='You'?'discard':'discards'} ${name}.`, side:i, ev:{a:'altar', n:name}});
  return true;
}
// a person's pick among tied units (a shop move: ['a', name])
function altarPick(g, i, name){
  if (g.phase !== 'shop' || cur(g) !== i || !g.altarPend || !g.altarPend[i] || !g.altarPend[i].includes(name)) return false;
  return altarDiscard(g, i, name);
}
const altarWaiting = (g, i) => !!(g.altarPend && g.altarPend[i]);
// cards a player could have taken on one of its turns (always-available Fields and Recruits are left out)
function noteSeen(g, i){
  if (!g.seen) return;
  for (const c of g.disp.u) g.seen[i].add(c.name);
  for (const c of g.disp.b) g.seen[i].add(c.name);
  if (g.mirSeen) for (const c of g.disp.u.concat(g.disp.b)) for (const m of c.mir || []) g.mirSeen[i].add(m);
  for (const by of PEEK_BY){ const pk = peekOf(g, i, by); if (pk) for (const n of pk.cards) g.seen[i].add(n); }
}
// Discard pile holds units and buildings by name; a card's kind and whether a player owns it
const cardKind = n => DEFS[n] ? 'u' : 'b';
const ownsCard = (st, n) => (cardKind(n) === 'u' ? st.hand[n] : isGear(n) ? (st.gear || {})[n] : st.city[n]) || 0;
// Could this player hold one more of the card? Ignores money and buys. st is anything with {hand, city}:
// a real player or a hypothetical one. Returns why not, or null if it can.
function cantAcquire(st, name, kind){
  if (kind === 'u') return !exemptUnit(name) && (st.hand[name] || 0) >= uMax(name) ? 'Already at highest level' : null;
  if (isGear(name)) return null;   // gear goes to your hand: no limit
  if (name === "Mason's Guild") return masonTargets(st).length ? null : 'No building to level up';
  if (name !== 'Field' && (st.city[name] || 0) >= BDEFS[name].lv.length) return 'Already at highest level';
  if ((name === 'Field' || !st.city[name]) && slotsUsed(st) >= citySlots(st)) return 'City is full';
  return null;
}
// The buy button's wording when a card can't be bought: how much more money, or which buys are used up this shop.
function whyNot(info, p){
  if (info.price != null && p.money < info.price) return `Need $${info.price - p.money} more`;
  if (info.why === 'Buys used up') return 'No buys left this round';
  if (info.why === 'One Field per shop') return 'Only one Field per shop';
  return info.why;
}
function buyInfo(g, i, name, kind, src, idx){ const o = {src, idx, who:i}; return buyQuote(g.players[i], g.buys[i], name, kind, src, mirSur(mirOf(g, o)), pairOf(g, o), mirOf(g, o).length); }
// The price and buy slot for one card, or why it can't be bought. p is anything with {hand, city, money}
// and b the buys used this shop ({u, b, carp, extra}), so the AI can price hypothetical purchases the same way.
// nm: how many miracles are under the card (Chapel)
function buyQuote(p, b, name, kind, src, sur, pair, nm){
  const Dd = kind === 'u' ? DEFS[name] : BDEFS[name];
  let price = (name === 'Recruit' && kind === 'u' && p.city && p.city['Muster Hall'] ? 0 : Dd.c) + (sur || 0);   // Muster Hall: Recruits cost $0. miracle surcharge: discounts below apply to the total
  const no = cantAcquire(p, name, kind); if (no) return {ok:false, why:no};
  // the discard pile: only War College buys from it (duplicates of units you own, for free)
  if (src === 'mu' && !(p.city && p.city['War College'])) return {ok:false, why:'Needs War College'};
  // Scrapyard: any card you already own a copy of, for free, using a normal buy
  if (src === 'mu' && !(ownsCard(p, name) > 0)) return {ok:false, why:'Only duplicates of your cards'};
  pair = pair || [];
  const nFld = (name === 'Field' ? 1 : 0) + pair.filter(n => n === 'Field').length;
  const fcap = fieldCap(p);
  if (nFld && (b.fld || 0) + nFld > fcap) return {ok:false, why:fcap === 1 ? 'One Field per shop' : `${fcap} Fields per shop`};
  if (pair.length){
    // Covenant: every card on top must fit too, counted one after another (two buildings need two City slots)
    const st = {hand:{...p.hand}, city:{...p.city}, gear:{...(p.gear || {})}}, add = n => { if (kind === 'u') st.hand[n] = (st.hand[n] || 0) + 1; else if (isGear(n)) st.gear[n] = (st.gear[n] || 0) + 1; else if (n !== "Mason's Guild") st.city[n] = (st.city[n] || 0) + 1; else { const t = masonTargets(st)[0]; if (t) st.city[t]++; } };
    add(name);
    for (const n of pair){ const why = cantAcquire(st, n, kind); if (why) return {ok:false, why:`${n}: ${why}`}; add(n); }
    price += pairCost(pair, kind);
  }
  let slot;
  const baseOk = baseLeft(b) > 0;   // buys of any kind, units or buildings
  if (baseOk) slot = 'base';
  else if (b.carp < bVal(p, "Carpenter's Guild")) slot = 'carp';   // Carpenter's Guild: extra buys of any kind
  else if (b.fav > 0) slot = 'fav';   // Divine Favor: an extra buy at normal price
  else if (!b.extra){ slot = 'extra'; price += 1; }
  else return {ok:false, why:'Buys used up'};
  if (kind === 'b' && !isGear(name) && bVal(p, "Carpenter's Guild")){ const nb = 1 + pair.filter(n => !isGear(n)).length; price = Math.max(nb, price - nb); }   // Carpenter's Guild discount, each building (not gear)
  let chap = 0, wc = 0;
  if (nm && (src === 'du' || src === 'db' || src === 'fz') && bVal(p, 'Chapel')){ chap = Math.min(price, bVal(p, 'Chapel')); price -= chap; }   // Chapel: cards with miracles under them
  if (src === 'mu'){ wc = price; price = 0; }   // War College: duplicates from the discard pile are free
  if (src === 'bm') price = Math.max(0, price - bmOff(p));   // Black Market discount: $1/$2/$3 by level
  const disc = p.discArm ? mirDisc(p) : null; if (disc) price = Math.max(0, price - MIRS[disc].disc);   // Patronage (once played): next card costs less
  if (p.money < price) return {ok:false, price, slot, disc, why:`Needs $${price}`};
  return {ok:true, price, slot, disc, chap, wc};
}
// the discount miracle in hand the next buy would use (the biggest), or null
function mirDisc(p){ let best = null; for (const n of (p && p.mir) || []) if (MIRS[n] && MIRS[n].disc && (!best || MIRS[n].disc > MIRS[best].disc)) best = n; return best; }
const bmOff = p => Math.max(1, bLvl(p, 'Black Market'));
// shared buys left this shop (units and buildings draw from the same pool)
// Fields you may buy this shop
function fieldCap(p){ return ruleOf(p, 'fps', RULES.fieldsPerShop); }
function baseLeft(b){ return buysOf(b) - (b.u + b.b); }
function useSlot(b, kind, slot, name){ if (name === 'Field') b.fld = (b.fld || 0) + 1; if (slot === 'wc'){ b.wc = (b.wc || 0) + 1; return; } if (slot === 'base'){ if (kind === 'u') b.u++; else b.b++; } else if (slot === 'carp') b.carp++; else if (slot === 'fav') b.fav--; else b.extra = true; }
function sourceCard(g, i, src, idx){
  if (src === 'du') return g.disp.u[idx] && {name:g.disp.u[idx].name, kind:'u'};
  if (src === 'db') return g.disp.b[idx] && {name:g.disp.b[idx].name, kind:'b'};
  if (src === 'field') return {name:'Field', kind:'b'};
  if (src === 'recruit') return {name:'Recruit', kind:'u'};
  if (src === 'bm' || src === 'vis'){ const pk = peekOf(g, i, src); return pk && pk.cards[idx] && {name:pk.cards[idx], kind:pk.k}; }
  if (src === 'mu') return g.muster && g.muster[idx] && {name:g.muster[idx], kind:cardKind(g.muster[idx])};
  if (src === 'fz') return g.frozen && g.frozen[i] && g.frozen[i][idx] && {name:g.frozen[i][idx].name, kind:g.frozen[i][idx].kind};
  return null;
}
function buy(g, i, src, idx, attach, writ){
  if (g.phase !== 'shop' || cur(g) !== i || altarWaiting(g, i)) return false;
  noteSeen(g, i);
  const sc = sourceCard(g, i, src, idx); if (!sc) return false;
  const info = buyInfo(g, i, sc.name, sc.kind, src, idx); if (!info.ok) return false;
  const p = g.players[i], b = g.buys[i], mir = mirOf(g, {src, idx, who:i}).slice(), pair = pairOf(g, {src, idx, who:i}).slice();
  const scObj = slotOf(g, {src, idx, who:i}), cid = scObj && scObj.id != null ? scObj.id : null;
  const spot = src === 'du' || src === 'db' ? {k:src === 'du' ? 'u' : 'b', at:(scObj || {}).at} : src === 'fz' ? {k:sc.kind, at:null} : null;
  // the situation at the moment of buying (before paying), for situational card opinions
  if (sc.name === "Mason's Guild"){ const ts = masonTargets(p); if (!ts.includes(attach)) attach = ts[0]; }
  p.money -= info.price;
  if (info.disc){ const j = p.mir.indexOf(info.disc); if (j >= 0){ p.mir.splice(j, 1); toSal(g, [info.disc]); } p.discArm = false; }   // the discount miracle is used up
  useSlot(b, sc.kind, info.slot, sc.name);
  if (src === 'du') g.disp.u.splice(idx, 1);
  if (src === 'db') g.disp.b.splice(idx, 1);
  if (src === 'mu') g.muster.splice(idx, 1);
  if (src === 'fz') g.frozen[i].splice(idx, 1);
  if (src === 'bm' || src === 'vis'){
    // a peek (Black Market or Vision): one card only; the others go back under the deck
    peekOf(g, i, src).cards.splice(idx, 1);
    endPeek(g, i, src);
  }
  if (sc.kind === 'u') p.hand[sc.name] = (p.hand[sc.name] || 0) + 1;
  else if (isGear(sc.name)){ p.gear = p.gear || {}; p.gear[sc.name] = (p.gear[sc.name] || 0) + 1; }
  else if (sc.name === "Mason's Guild"){ p.city[attach] = (p.city[attach] || 0) + 1; p.mason = p.mason || {}; p.mason[attach] = (p.mason[attach] || 0) + 1; }
  else p.city[sc.name] = (p.city[sc.name] || 0) + 1;
  p.bought.push(sc.name);
  if (g.shopBought) g.shopBought[i].push(sc.name);
  // Covenant: the cards on top come along (a Mason's Guild among them goes on the building it would level best)
  const pairGot = [];
  for (const n of pair){
    if (sc.kind === 'u') p.hand[n] = (p.hand[n] || 0) + 1;
    else if (isGear(n)){ p.gear = p.gear || {}; p.gear[n] = (p.gear[n] || 0) + 1; }
    else if (n === "Mason's Guild"){ const t = aiMasonTarget(g, i); if (!t) continue; p.city[t] = (p.city[t] || 0) + 1; p.mason = p.mason || {}; p.mason[t] = (p.mason[t] || 0) + 1; }
    else p.city[n] = (p.city[n] || 0) + 1;
    p.bought.push(n); if (g.shopBought) g.shopBought[i].push(n); pairGot.push(n);
  }
  const extra = (info.slot === 'extra' ? ' (extra buy, +$1)' : info.slot === 'carp' ? " (Carpenter's Guild)" : '') + (src === 'bm' ? ` (Black Market, $${bmOff(p)} off)` : '') + (src === 'mu' ? ' from the discard pile (War College)' : '');
  const extraFull = extra + (info.slot === 'fav' ? ' (Divine Favor)' : '') + (src === 'vis' ? ' (Vision)' : '') + (info.disc ? ` (${info.disc}, $${MIRS[info.disc].disc} off)` : '') + (info.chap ? ` (Chapel, $${info.chap} off)` : '') + '';
  g.log.push({t:`${g.labels[i]} ${src === 'mu' ? (g.labels[i]==='You'?'take':'takes') : g.labels[i]==='You'?'buy':'buys'} ${sc.name}${sc.name === "Mason's Guild" ? ` for ${attach}` : ''}${pairGot.length ? ` and ${pairGot.join(' and ')} (Covenant)` : ''} for $${info.price}${extraFull}${src === 'fz' ? ' (frozen)' : ''}.`, side:i, ev:{a:'buy', n:sc.name, k:sc.kind, price:info.price, on:sc.name === "Mason's Guild" ? attach : null, pair:pairGot.length ? pairGot : undefined, src, idx, id:cid, at:spot ? spot.at : null}});
  const again = mir.length ? gainMiracles(g, i, mir, writ, spot) : false;
  if (spot && (src === 'du' || src === 'db')) refillRow(g, spot.k, spot.at);
  if (again) g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'take':'takes'} another shop turn (Discard Writ).`, side:i});
  else nextTurn(g);
  return true;
}
// Discard Writ: right away, up to 2 other display units go face-up to the discard pile (miracles under them are discarded)
// and new cards are dealt from the unit deck to replace them.
// names: the units the buyer chose (a person always passes a list, maybe empty); without one, the AI picks.
function useWrit(g, i, n, names){
  const pick = Array.isArray(names) ? names.slice(0, n) : asSeenBy(g, i, () => writPick(g, i, n).map(x => x.name));
  const moved = [];
  for (const nm of pick){
    const kd = g.disp.u.some(c => c.name === nm) ? 'u' : 'b', row = g.disp[kd];
    const k = row.findIndex(c => c.name === nm); if (k < 0) continue;
    const was = row.splice(k, 1)[0]; (g.muster || (g.muster = [])).push(nm, ...(was.pair || [])); moved.push(nm); toSal(g, was.mir);
    const c = dealCard(g, kd); if (c){ c.at = was.at; row.splice(k, 0, c); }   // a new card from its own deck takes its place
  }
  g.log.push({t:moved.length ? `${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Discard Writ: ${moved.join(' and ')} ${moved.length > 1 ? 'go' : 'goes'} to the discard pile.`
                             : `${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Discard Writ and ${g.labels[i]==='You'?'move':'moves'} nothing.`, side:i});
}
// AI choice for Discard Writ. Denying a unit the opponent doesn't own is worth half its value to them (they may not want
// it). A unit the AI owns is also saved for its own later level-up, so it adds what buying it is worth to the AI. A unit
// neither owns is lost to the AI too, so its own interest in it is subtracted. Units the opponent owns are left alone:
// in the discard pile they could still buy them. n null: rank them all.
function writPick(g, i, n){
  const me = g.players[i], op = g.players[1 - i], oh = pubHand(op), out = [];
  for (const c of g.disp.u.map(x => ({...x, kd:'u'})).concat(g.disp.b.map(x => ({...x, kd:'b'})))){
    if (out.some(x => x.name === c.name)) continue;
    const mine = ownsCard(me, c.name) > 0, theirs = (c.kd === 'u' ? oh[c.name] : op.city[c.name]) > 0;
    if (theirs) continue;
    const myV = aiValue(g, i, c.name, c.kd), deny = 0.5 * Math.max(0, aiValue(g, 1 - i, c.name, c.kd));
    // owned: saved for my level-up AND kept from them; not owned: kept from them, but I can't buy it either
    const v = mine ? myV + deny : deny - Math.max(0, myV);
    if (v > 0) out.push({name:c.name, v});
  }
  out.sort((a, b) => b.v - a.v);
  return n == null ? out.slice(0, MIRS['Discard Writ'].writ) : out.slice(0, n);
}
// The miracles under a bought card: money ones pay out now, the rest go to the buyer's hand
function gainMiracles(g, i, mir, writ, spot){
  const p = g.players[i], you = g.labels[i] === 'You', parts = [], writs = [];
  let mill = 0, rst = 0;
  for (const n of mir){
    const m = MIRS[n];
    if (m.cash){ p.money += m.cash; parts.push(`${n} (+$${m.cash})`); toSal(g, [n]); }
    else if (m.writ){ writs.push(m.writ); parts.push(`${n} (used now)`); toSal(g, [n]); }
    else if (m.cov){ toSal(g, [n]); }   // Covenant did its work when it was dealt (the log line for the buy names its cards)
    else if (m.mill){ mill += m.mill; parts.push(`${n} (used now)`); toSal(g, [n]); }
    else if (m.rst){ rst += m.rst; parts.push(`${n} (used now)`); toSal(g, [n]); }
    else { (p.mir || (p.mir = [])).push(n); parts.push(`${n} (to hand)`); }
    if (g.mirGot) g.mirGot[i].push(n);
    if (g.mirShop) g.mirShop[i].push(n);
  }
  if (parts.length) g.log.push({t:`${g.labels[i]} ${you ? 'receive' : 'receives'} ${parts.join(' and ')}.`, side:i});
  // Mill: the top units of the unit deck go face-up to the discard pile (a miracle turned up goes to the bottom)
  if (mill){
    const out = peekCards(g.uDeck, mill); (g.muster || (g.muster = [])).push(...out);
    g.log.push({t:out.length ? `Mill: ${out.join(', ')} ${out.length > 1 ? 'go' : 'goes'} to the discard pile.` : 'Mill: the unit deck is empty.', side:i});
  }
  // Restock: new cards from the bought card's deck go into the display (the first into its empty spot)
  if (rst && spot){
    const row = g.disp[spot.k], got = [];
    for (let r = 0; r < rst; r++){
      const c = dealCard(g, spot.k); if (!c) break;
      const used = new Set(row.filter(x => x.at != null).map(x => x.at));
      let at = r === 0 && spot.at != null && !used.has(spot.at) ? spot.at : 0; while (used.has(at)) at++;
      c.at = at; row.push(c); got.push(c.name);
    }
    g.log.push({t:got.length ? `Restock: ${got.join(' and ')} ${got.length > 1 ? 'are' : 'is'} dealt into the display.` : 'Restock: that deck is empty.', side:i});
  }
  // two Writs under one card move up to 4; a person's list covers them all
  if (writs.length){ const tot = writs.reduce((a, b) => a + b, 0); useWrit(g, i, tot, writ); }
  return writs.length > 0;   // Discard Writ: the buyer shops again before the opponent
}
// Divine Favor: from hand on your shop turn, adds one extra buy at normal price this shop
function useFavor(g, i){
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return false;
  const j = (p.mir || []).indexOf('Divine Favor'); if (j < 0) return false;
  const k = Math.max(1, MIRS['Divine Favor'].fav | 0);
  p.mir.splice(j, 1); toSal(g, ['Divine Favor']); g.buys[i].fav += k; g.buys[i].favN += k;
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Divine Favor: one extra buy this shop.`, side:i});
  return true;
}
// Patronage: played from hand on your shop turn; the next card you buy costs less, then it's discarded.
// on false takes it back into hand unplayed (before buying anything with it).
function useDisc(g, i, on){
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return false;
  const n = mirDisc(p); if (!n) return false;
  on = on !== false && on !== 0;
  if (!!p.discArm === on) return false;
  p.discArm = on;
  g.log.push({t:on ? `${g.labels[i]} ${g.labels[i]==='You'?'play':'plays'} ${n}: the next card costs $${MIRS[n].disc} less.` : `${g.labels[i]} ${g.labels[i]==='You'?'take':'takes'} ${n} back into hand.`, side:i});
  return true;
}
// Freeze: from hand, as your shop turn, set aside a display card with its miracles (and Covenant cards); its spot stays
// empty this shop. Only you may buy it, at its normal price, on any later shop turn.
function canFreeze(g, i){ const p = g.players[i]; return g.phase === 'shop' && cur(g) === i && !g.passed[i] && (p.mir || []).some(n => MIRS[n] && MIRS[n].frz); }
function useFreeze(g, i, src, idx){
  if (!canFreeze(g, i) || (src !== 'du' && src !== 'db')) return false;
  const row = g.disp[src === 'du' ? 'u' : 'b'], c = row[idx]; if (!c) return false;
  noteSeen(g, i);
  const p = g.players[i], j = p.mir.findIndex(n => MIRS[n] && MIRS[n].frz), fn = p.mir[j];
  p.mir.splice(j, 1); toSal(g, [fn]); row.splice(idx, 1);
  g.frozen = g.frozen || [[], []];
  g.frozen[i].push({name:c.name, kind:src === 'du' ? 'u' : 'b', mir:c.mir || [], pair:c.pair, id:c.id});
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} ${fn}: ${c.name}${c.pair && c.pair.length ? ` (with ${c.pair.join(' and ')})` : ''} is set aside for ${g.labels[i]==='You'?'you':g.labels[i]}.`, side:i, ev:{a:'freeze', n:c.name, k:src === 'du' ? 'u' : 'b', id:c.id, at:c.at}});
  nextTurn(g);
  return true;
}
// Upheaval: from hand on your shop turn (it doesn't use your turn), every display card goes face up to the discard pile
// (its miracles are discarded; Covenant cards on top go with it), then each row is dealt full again from its own deck.
// Frozen cards are not in the display, so they stay set aside.
function canRedeal(g, i){ const p = g.players[i]; return g.phase === 'shop' && cur(g) === i && !g.passed[i] && (p.mir || []).some(n => MIRS[n] && MIRS[n].rdl); }
function useRedeal(g, i){
  if (!canRedeal(g, i)) return false;
  noteSeen(g, i);
  const p = g.players[i], j = p.mir.findIndex(n => MIRS[n] && MIRS[n].rdl), fn = p.mir[j];
  p.mir.splice(j, 1); toSal(g, [fn]);
  g.muster = g.muster || []; g.leaving = {u:[], b:[]};
  const out = [];
  for (const k of ['u','b']){
    g.disp[k].forEach((c, jj) => { g.leaving[k].push({name:c.name, j:jj, at:c.at}); g.muster.push(c.name, ...(c.pair || [])); toSal(g, c.mir); out.push(c.name); });
    g.disp[k] = [];
    const size = dispSize(g, k);
    for (let a = 0; g.disp[k].length < size; a++){ const c = dealCard(g, k); if (!c) break; c.at = a; g.disp[k].push(c); }
  }
  const you = g.labels[i] === 'You';
  g.log.push({t:`${g.labels[i]} ${you ? 'use' : 'uses'} ${fn}: ${out.length ? `${out.join(', ')} ${out.length > 1 ? 'go' : 'goes'} to the discard pile and` : ''} a new display is dealt.`, side:i, ev:{a:'redeal'}});
  return true;
}
// AI: what a fresh display is worth to me over this one: the best few buys I could make from it, less this display's,
// averaged over a few deals drawn at random from what's left in the decks (it doesn't know their order)
function aiRedealGain(g, i, G, mE){
  const p = g.players[i], b = g.buys[i], left = Math.max(1, baseLeft(b)), memo = new Map();
  const val = (n, k) => { const key = k + '|' + n; if (!memo.has(key)) memo.set(key, aiValue(g, i, n, k)); return memo.get(key); };
  const best = cards => {
    const vs = [];
    for (const c of cards){
      const q = buyQuote(p, b, c.name, c.kind, c.kind === 'u' ? 'du' : 'db', mirSur(c.mir), c.pair, (c.mir || []).length); if (!q.ok) continue;
      const v = val(c.name, c.kind) - q.price * G.m * mE; if (v > 0) vs.push(v);
    }
    vs.sort((x, y) => y - x); return vs.slice(0, left).reduce((s, v) => s + v, 0);
  };
  const now = best(g.disp.u.map(c => ({...c, kind:'u'})).concat(g.disp.b.map(c => ({...c, kind:'b'}))));
  const pools = {u:g.uDeck.filter(n => !isMir(n)), b:g.bDeck.filter(n => !isMir(n))};
  const rnd = g.rnd || Math.random, N = 8;
  let tot = 0;
  for (let t = 0; t < N; t++){
    const cards = [];
    for (const k of ['u','b']){
      const pool = pools[k].slice(), size = dispSize(g, k);
      for (let a = 0; a < size && pool.length; a++){ const r = Math.floor(rnd() * pool.length); cards.push({name:pool[r], kind:k, mir:[]}); pool.splice(r, 1); }
    }
    tot += best(cards);
  }
  return tot / N - now;
}
// Vision: from hand on your shop turn, look at the top 3 of either deck and buy one (with a normal buy, normal price)
function useVision(g, i, k){
  k = k === 'b' ? 'b' : 'u';
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i] || peekOf(g, i, 'vis')) return false;
  const j = (p.mir || []).indexOf('Vision'); if (j < 0) return false;
  p.mir.splice(j, 1); toSal(g, ['Vision']);
  const cards = startPeek(g, i, 'vis', k, MIRS.Vision.vis);
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Vision: top ${cards.length} ${k === 'b' ? 'buildings' : 'units'}.`, side:i});
  return true;
}
// Selling: on your shop turn, as a free action (no buy used, turn doesn't end), sell one copy of a unit or building
// for a flat $1. It drops a level (or leaves if it was the last copy). The card goes to the bottom of its deck;
// Fields and Recruits go back to the supply, and a level that came from Mason's Guild sends the Guild back instead.
// Cards bought this shop can be sold back the same shop too.
const SELL_PRICE = 1;
function canSell(g, i, kind, name){
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return false;
  if (name === 'Recruit' || name === 'Altar of Blood' || altarWaiting(g, i) || !(kind === 'u' ? p.hand[name] : isGear(name) ? (p.gear || {})[name] : p.city[name])) return false;
  return true;
}
// The AI never sells a card it bought earlier in this same shop: that only undoes the purchase, at a loss, and
// wastes a buy (the look-ahead can talk itself into it when a shallower look at the first decision disagrees).
function aiCanSell(g, i, kind, name){
  if (!canSell(g, i, kind, name)) return false;
  const got = (g.shopBought && g.shopBought[i]) || [], p = g.players[i];
  if (got.includes(name)) return false;
  // selling a building that has a Mason's Guild level on it sells that level: no, if the Guild was bought this shop
  if (kind === 'b' && p.mason && p.mason[name] > 0 && got.includes("Mason's Guild")) return false;
  return true;
}
function sell(g, i, kind, name){
  if (!canSell(g, i, kind, name)) return false;
  const p = g.players[i];
  let back = name;
  if (kind === 'u'){ if (!--p.hand[name]) delete p.hand[name]; }
  else if (isGear(name)){ if (!--p.gear[name]) delete p.gear[name]; }
  else {
    if (p.mason && p.mason[name] > 0){ p.mason[name]--; back = "Mason's Guild"; }
    if (!--p.city[name]) delete p.city[name];
  }
  // a sold card goes face-up to the discard pile (a sold Field returns to the supply)
  if (back !== 'Field'){ g.muster = g.muster || []; g.muster.push(back); }
  const bz = bVal(p, 'The Bazaar');   // The Bazaar: more for each card sold
  p.money += SELL_PRICE + bz;
  g.sold = g.sold || [[], []]; g.sold[i].push(name);
  const you = g.labels[i] === 'You';
  g.log.push({t:`${g.labels[i]} ${you ? 'sell' : 'sells'} ${name} for $${SELL_PRICE + bz}${bz ? ' (The Bazaar)' : ''}${back !== 'Field' ? ` (${back !== name ? back + ' ' : ''}to the discard pile)` : ''}.`, side:i, ev:{a:'sell', n:name, k:kind}});
  return true;
}
// The hand an opponent believes a player has: real units plus the ones sold in secret (capped at max level)
function pubHand(p){
  if (!p.hidSold) return p.hand;
  const h = {...p.hand};
  for (const n in p.hidSold) h[n] = exemptUnit(n) ? (h[n] || 0) + p.hidSold[n] : Math.min(uMax(n), (h[n] || 0) + p.hidSold[n]);
  return h;
}
// unit names in a hand that count for learned pairings (Recruits and Mercenaries are left out)
function ctxUnits(h){ return Object.keys(h || {}).filter(n => h[n] > 0 && DEFS[n] && !DEFS[n].token && !exemptUnit(n)); }
// Run an AI decision for player i while its opponent's hand shows only what i can know
function asSeenBy(g, i, fn){
  const o = g.players[1 - i];
  if (!o.hidSold || o._realHand) return fn();
  o._realHand = o.hand; o.hand = pubHand(o);
  try{ return fn(); } finally { o.hand = o._realHand; delete o._realHand; }
}
// AI: peek at whichever deck it expects to find more in (ties and empty decks fall back to units)
function aiBMKind(g, i){
  if (g._po) return g.uDeck.length ? 'u' : 'b';
  const n = bVal(g.players[i], 'Black Market');
  if (!g.bDeck.length) return 'u';
  if (!g.uDeck.length) return 'b';
  const gu = bmPeekGain(g, i, n, 'u'), gb = bmPeekGain(g, i, n, 'b');
  return gb > gu ? 'b' : 'u';
}
function useBM(g, i, k){
  k = k === 'b' ? 'b' : 'u';   // Black Market looks at one deck per shop: units or buildings, not both
  const p = g.players[i];
  if (g.phase !== 'shop' || g.bmUsed[i] || !bVal(p, 'Black Market')) return false;
  const cards = startPeek(g, i, 'bm', k, bVal(p, 'Black Market')); g.bmUsed[i] = true;
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'look':'looks'} at the Black Market: top ${cards.length} ${k === 'b' ? 'buildings' : 'units'}.`, side:i});
  return true;
}
function pass(g, i){
  if (g.phase !== 'shop' || cur(g) !== i) return false;
  if (altarWaiting(g, i)) altarDiscard(g, i, g.altarPend[i][0]);
  noteSeen(g, i);
  g.passed[i] = true; g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'pass':'passes'}.`, side:i});
  nextTurn(g); return true;
}
function nextTurn(g){
  if (g.passed[0] && g.passed[1]){ endShop(g); return; }
  g.turnIdx = 1 - g.turnIdx;
  if (g.passed[g.order[g.turnIdx]]) g.turnIdx = 1 - g.turnIdx;
}
function endShop(g){
  if (g.seen){
    const offers = g.offers || (g.offers = []), states = g.states || (g.states = []);
    for (const i of [0,1]){
      const lead = g.shopLead ? g.shopLead[i] : total(g.players[i]) - total(g.players[1-i]);
      states.push({i, lead});
      const always = n => n === 'Recruit' || (BDEFS[n] && BDEFS[n].always);
      const got = new Set(g.shopBought[i].filter(n => !always(n)));
      // context for learned pairings: the units this player owns, and the enemy units it can know about
      const mine = ctxUnits(g.players[i].hand), theirs = ctxUnits(pubHand(g.players[1-i]));
      for (const n of got) offers.push({i, name:n, bought:true, lead, mine, theirs, tags:(g.buyTags && g.buyTags[i][n]) || []});
      for (const n of g.seen[i]) if (!got.has(n)) offers.push({i, name:n, bought:false, lead});
      // miracles: taken (bought the card on top) or passed over; no pairing context, so they only shape miracle opinions
      if (g.mirShop && g.mirSeen){
        const mg = new Set(g.mirShop[i]);
        for (const n of mg) offers.push({i, name:n, bought:true, lead});
        for (const n of g.mirSeen[i]) if (!mg.has(n)) offers.push({i, name:n, bought:false, lead});
      }
    }
    g.seen = null; g.mirSeen = null; g.mirShop = null;
  }
  for (const by of PEEK_BY) for (const i of [0,1]) endPeek(g, i, by);   // unbought peeked cards go back under their decks
  // Discard pile: a returning card that goes unbought again is laid face-up there (its miracles are discarded)
  g.muster = g.muster || [];
  for (const c of g.disp.u.concat(g.disp.b)) if (c.side){ g.muster.push(c.name, ...(c.pair || [])); toSal(g, c.mir); }
  g.leaving = {u:[], b:[]};
  for (const k of ['u','b']) g.disp[k].forEach((c, j) => { if (c.side) g.leaving[k].push({name:c.name, j, at:c.at}); });
  // unbought cards go sideways with their miracles; ones already sideways leave with theirs
  for (const k of ['u','b']) g.disp[k] = g.disp[k].filter(c => !c.side).map(c => ({name:c.name, side:true, mir:c.mir || [], at:c.at, id:c.id, ...(c.pair ? {pair:c.pair} : {})}));
  g.phase = 'mobilize'; g.decks = [null,null];
}
function validateDeck(g, i, spec){
  const p = g.players[i];
  // battle miracles: each placed one must be in hand (they never count as units)
  const sp = spec.filter(u => isBat(u.name));
  if (sp.length){
    if (!g.battleMir) return 'Battle miracles are not in this game.';
    const have = {}; for (const n of p.mir || []) have[n] = (have[n] || 0) + 1;
    for (const u of sp) if (!((have[u.name] = (have[u.name] || 0) - 1) >= 0)) return `You don't have another ${u.name} in hand.`;
    spec = spec.filter(u => !isBat(u.name));
  }
  const names = spec.filter(u => u.name !== 'Recruit').map(u => u.name);
  if (new Set(names).size !== names.length) return 'Each unit can only appear once (duplicates stack).';
  for (const n of names) if (!p.hand[n]) return `You don't own ${n}.`;
  const uniq = names.filter(n => !exemptUnit(n)).length;
  if (uniq > deckCap(p)) return `Your deck holds ${deckCap(p)} unique units.`;
  const rec = spec.filter(u => u.name === 'Recruit').length;
  if (rec > recAllow(p)) return 'Too many Recruits.';
  // gear: each piece must be in hand; one per unit; a Zweihander's wearer holds no Armaments or Shields
  const gh = {}; for (const u of spec) if (u.gear){
    if (!isGear(u.gear)) return `${u.gear} is not gear.`;
    if ((gh[u.gear] = (gh[u.gear] || 0) + 1) > ((p.gear || {})[u.gear] || 0)) return `You don't have another ${u.gear} in hand.`;
    if (u.gear === 'Zweihander' && (u.arm || u.sh)) return `${u.name} wields a Zweihander and can't hold Armaments or Shields.`;
  }
  const arm = spec.reduce((s,u) => s + (u.arm||0), 0), tr = spec.reduce((s,u) => s + (u.tr||0), 0);
  if (arm > armAllow(p)) return bVal(p, 'Smithy') ? 'Too many Armaments for your Smithy and miracles.' : 'Too many Armaments.';
  if (tr > trAllow(p)) return bVal(p, 'Study') ? 'Too many Training tokens for your Study and miracles.' : 'Too many Training tokens.';
  if (spec.reduce((s,u) => s + (u.sh||0), 0) > shAllow(p)) return 'Too many Shields for your Armory.';
  return null;
}
function setDeck(g, i, spec){
  const p = g.players[i], spells = [];
  // battle miracles keep their spot as the number of units ahead of them
  let k = 0; for (const u of spec){ if (isBat(u.name)) spells.push({name:u.name, at:k}); else k++; }
  (g.spells || (g.spells = [[], []]))[i] = spells;
  spec = spec.filter(u => !isBat(u.name));
  const gw = gearOk(p, spec);   // gear in hand only (anything beyond it is dropped)
  const deck = spec.map((u, k) => {
    const o = u.name === 'Recruit' ? {name:'Recruit', copies:1, arm:u.arm||0, sh:u.sh||0, tr:u.tr||0}
                                   : {name:u.name, copies:p.hand[u.name], arm:u.arm||0, sh:u.sh||0, tr:u.tr||0};
    if (gw[k]){ o.gear = gw[k]; if (gw[k] === 'Zweihander'){ o.arm = 0; o.sh = 0; } }
    return o;
  });
  g.decks[i] = deck;
  // remember who wore what, so next Mobilize starts from it (gear really goes back to the hand after the battle)
  p.equip = {}; for (const u of deck) if (u.gear && u.name !== 'Recruit') p.equip[u.name] = u.gear;
}
// the gear each deck entry actually gets: at most one each, and only as many of a kind as the hand holds
function gearOk(p, spec){
  const left = {...(p.gear || {})};
  return spec.map(u => { const n = u.gear; if (!n || !isGear(n) || !(left[n] > 0)) return null; left[n]--; return n; });
}
function finishMobilize(g){
  // battle miracles placed in a deck leave the hand now (after the battle they go to the discard pile)
  for (const i of [0,1]){
    const p = g.players[i], sp = (g.spells && g.spells[i]) || [];
    for (const x of sp){ const j = (p.mir || []).indexOf(x.name); if (j >= 0) p.mir.splice(j, 1); }
    if (sp.length) g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'place':'places'} ${sp.length === 1 ? 'a battle miracle' : sp.length + ' battle miracles'} in ${g.labels[i]==='You'?'your':'their'} deck.`, side:i});
  }
  // Recruits, Armaments and Training placed beyond a player's own use up miracles from their hand
  for (const i of [0,1]){
    const p = g.players[i], d = g.decks[i] || [];
    if (!p.mir || !p.mir.length) continue;
    // a person's played miracles are spent first when they cover what was placed
    const pref = p.mirPlay; delete p.mirPlay;
    const spendP = (key, over) => {
      if (over <= 0) return [];
      if (pref && pref.length){
        const left = pref.slice(), idx = [];
        p.mir.forEach((n, j) => { const k = left.indexOf(n); if (k >= 0 && MIRS[n][key]){ left.splice(k, 1); idx.push(j); } });
        if (idx.reduce((s, j) => s + MIRS[p.mir[j]][key], 0) >= over){
          const sub = {mir:idx.map(j => p.mir[j])};
          return mirSpend(sub, key, over).map(k => idx[k]);
        }
      }
      return mirSpend(p, key, over);
    };
    const rec = spendP('rec', d.filter(u => u.name === 'Recruit').length - recBase(p));
    const arm = spendP('arm', d.reduce((s, u) => s + (u.arm || 0), 0) - bVal(p, 'Smithy'));
    const trn = spendP('tr', d.reduce((s, u) => s + (u.tr || 0), 0) - bVal(p, 'Study'));
    const used = rec.concat(arm, trn).sort((a, b) => b - a), names = used.map(j => p.mir[j]);
    for (const j of used) p.mir.splice(j, 1);
    toSal(g, names);
    if (names.length) g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'call':'calls'} on ${names.join(' and ')}.`, side:i});
  }
  for (const i of [0,1]){
    const p = g.players[i], opp = g.players[1-i];
    for (const u of g.decks[i]){
      const d = DEFS[u.name]; if (!d.m) continue;
      const l = armyLvl(u);
      let gain = d.m[l-1];
      if (u.name === 'Arsonist') gain *= (opp.city.Field || 0);
      if (gain){ p.money += gain; g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'gain':'gains'} $${gain} from ${u.name}.`, side:i}); }
    }
  }
  g.phase = 'battle';
}
function battleCfg(g, i){
  const p = g.players[i];
  return {units:g.decks[i], spells:(g.spells && g.spells[i]) || [], treb:bLvl(p,'Trebuchet'), yard:bVal(p,'Training Yard'), drill:bVal(p,'Muster Hall'), infirmary:!!p.city.Infirmary, label:g.labels[i]};
}
function doBattle(g, record){
  const res = runBattle([battleCfg(g,0), battleCfg(g,1)], record);
  const w = res.result.w;
  g.lastBattle = {w, res};
  (g.battles || (g.battles = [])).push({w, d:[0,1].map(i => g.decks[i].filter(u => u.name !== 'Recruit').map(u => u.name)),
    c:[0,1].map(i => Object.keys(g.players[i].city || {}).filter(n => n !== 'Field' && g.players[i].city[n] > 0))});   // buildings in each city, for building pairs and counters
  g.players.forEach((p, i) => { p.wonLast = w === i; });
  if (w >= 0) g.players[w].score++;
  omObserve(g);
  for (const i of [0,1]){ g.players[i].prevDeck = g.decks[i].map(u => ({...u})); }
  for (const i of [0,1]){ toSal(g, ((g.spells && g.spells[i]) || []).map(x => x.name)); }   // used or not, placed battle miracles are discarded
  g.log.push({t: w < 0 ? `Round ${g.round} battle is a draw.` : `${g.labels[w]} ${g.labels[w]==='You'?'win':'wins'} the round ${g.round} battle.`, side: w < 0 ? undefined : w});
  for (const p of g.players){ delete p.hand.Recruit; delete p.hand.Mercenary; }
  // win check
  const t = g.players.map(total), mx = Math.max(t[0], t[1]);
  if (mx >= g.target && t[0] !== t[1]){
    const L = t[0] > t[1] ? 0 : 1;
    if (!g.players[L].city.Cathedral || g.players[L].wonLast){ g.winner = L; g.over = true; }
  }
  if (!g.over && g.round >= RULES.maxRounds){ g.over = true; g.winner = t[0] === t[1] ? -1 : (t[0] > t[1] ? 0 : 1); }
  g.phase = g.over ? 'over' : 'shop';
  return res;
}

/* ===================== AI ===================== */
const ABIL = {
  'Pikeman':[1.5,2,2.5], 'Royal Watchman':[0.8,1.5,2.2], 'Monk':[1.8,2.6,3.2], 'Desperate Infantry':[1,2,3], 'Slinger':[0.9,1.8,2.7],
  'Dutiful Squire':[1,2,3], 'Veteran Knight':[0.8,1.6,2.4], 'Cowardly Squire':[1.2,1.5,1.8], 'Assassin':[0.8,0.8,0.8],
  'Marksman':[1.6,2.4,3.2], 'Studious Squire':[1.5,3,3], 'Aging Master':[1,2,2], 'Barber-Surgeon':[2,2.5,3],
  'Pigeon Hunter':[2.5,2.5,2.5], 'Brawler':[1.5,2,2.5], 'Fencer':[1.5,1.5,1.5], 'Sleepy Guard':[1.2,1.8,1.8], 'Musketeer':[1.6,3.2,6.4],
  'Dark Knight':[-0.6,-0.6,-0.6], 'Knight':[2.1,2.1,2.1], 'Jester':[2,2.5,3], 'Cannon':[2.7,4.5,6.3],
  'Grave-Robber':[1,1.5,2], 'Lancer':[1.5,2,2.5], 'White Knight':[2.5,2.5,4], 'Dowser Oracle':[1.5,3,4.5], 'Recruiter':[2,3,4],
  'Scholar':[3,5,5], 'Executioner':[3,3,3], 'Man-at-arms':[2.5,2.5,4], 'Halberd Knight':[3,4,5], 'Armored Knight':[2,2,3],
};
const ALL_CARDS = Object.keys(DEFS).concat(Object.keys(BDEFS));
const OPINION_KEYS = ALL_CARDS.concat(Object.keys(MIRS));   // cards and miracles the AI forms opinions about
function baseGenome(){ return {kp:0.15, shr:0.6, tie:0.12, rob:0.25, s:1, e:1, m:1, thresh:0, slot:0.7, pair:0.5, cath:0.5, read:0.4, deny:0.3, combo:1, save:0.3, hb:1, bmk:1, lu2:0.35, omk:1.5, mir:1, mu:0.06, mpat:0.5, bias:{}}; }
// How hard the AI thinks. 'play' is used against you; 'train' is a lighter version of the same reasoning for self-play.
const DEPTH = {
  fast:  {search:{evals:20, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:4, K:2, settle:0.03, drop:0.1, po:2}, guesses:3, top:1, stageA:3, perms:12, shopPerms:4, shopCands:2, shopGuesses:3, predictK:4},
  train: {search:{evals:40, ms:0, minDepth:2, maxDepth:2, width:5, inner:2, P:6, K:3, settle:0.02, drop:0.08, po:3}, guesses:5, top:2, stageA:5, perms:24, shopPerms:8, shopCands:3, shopGuesses:4, predictK:6, predictDeep:{guesses:3, top:1, stageA:3, perms:12, predictK:4}},
  play:  {search:{evals:700, ms:2500, minDepth:3, maxDepth:5, width:7, inner:3, P:10, K:4, settle:0.015, drop:0.08, po:8}, mix:6, guesses:12, top:3, stageA:12, perms:'all', shopPerms:16, shopCands:6, shopGuesses:8, predictK:16, predictDeep:{guesses:6, top:1, stageA:6, perms:24, predictK:8}},
  master:{search:{evals:4000, ms:8000, minDepth:4, maxDepth:7, width:9, inner:3, P:12, K:5, settle:0.01, drop:0.06, po:16}, mix:8, guesses:18, top:4, stageA:16, perms:'all', shopPerms:24, shopCands:8, shopGuesses:12, predictK:24, predictDeep:{guesses:8, top:2, stageA:8, perms:48, predictK:12}},
  // Ladder-only levels (weaker than 'fast'): short-sighted ones judge only this battle's stakes (no playouts) and blur
  // their estimates a little; the 'glimpse' level plays out once. t2 sits between training and 'play'.
  s1:    {search:{evals:12, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:2, K:1, settle:0.03, drop:0.12, po:0, myopic:true, blur:0.10}, guesses:2, top:1, stageA:2, perms:6, shopPerms:2, shopCands:1, shopGuesses:2, predictK:2},
  s2:    {search:{evals:16, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:3, K:2, settle:0.03, drop:0.1, po:0, myopic:true, blur:0.05}, guesses:3, top:1, stageA:3, perms:10, shopPerms:3, shopCands:2, shopGuesses:3, predictK:3},
  g1:    {search:{evals:16, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:3, K:2, settle:0.03, drop:0.1, po:1, blur:0.02}, guesses:3, top:1, stageA:3, perms:12, shopPerms:4, shopCands:2, shopGuesses:3, predictK:4},
  t2:    {search:{evals:200, ms:1500, minDepth:2, maxDepth:3, width:7, inner:2, P:8, K:3, settle:0.015, drop:0.08, po:5}, mix:4, guesses:8, top:2, stageA:8, perms:48, shopPerms:12, shopCands:4, shopGuesses:6, predictK:10, predictDeep:{guesses:4, top:1, stageA:4, perms:16, predictK:6}},
};
/* ---------- Rated strength ladder ----------
   Each rung is a thinking budget (a DEPTH key): how far ahead it looks (this battle only, or the rest of the game
   played out), how many playouts and test battles it runs, and how far it looks ahead in the shop. Weaker rungs see
   less, so their mistakes are misjudged close calls and short-sightedness, never deliberately thrown choices. The two
   short-sighted rungs also blur their estimates a little. Rung 0 buys at random: it only anchors the ratings at 400
   and isn't offered as an opponent. A rating between two rungs plays with a budget part-way between them. */
const RUNGS = [
  {id:'random', label:'Random buyer', random:true},
  {id:'s1',   label:'Short-sighted, hasty', depth:'s1'},
  {id:'s2',   label:'Short-sighted',        depth:'s2'},
  {id:'g1',   label:'Glimpses ahead',       depth:'g1'},
  {id:'f100', label:'Quick',                depth:'fast'},
  {id:'t100', label:'Thinks',               depth:'train'},
  {id:'t2',   label:'Thinks harder',        depth:'t2'},
  {id:'p100', label:'Thinks deeply',        depth:'play'},
  {id:'m100', label:'Thinks deepest',       depth:'master'},
];
// a budget part-way between two levels: counts are interpolated and rounded, blur and time limits are interpolated
function blendDepth(A, B, t){
  if (!A || !B) return A || B;
  if (t <= 0) return A; if (t >= 1) return B;
  const lerp = (x, y) => x + (y - x) * t;
  const mix = (x, y) => {
    const o = {};
    for (const k of new Set(Object.keys(x).concat(Object.keys(y)))){
      const u = x[k], v = y[k];
      if (k === 'ms' && (!u || !v)) o[k] = u || v;   // 0 means no time limit: keep the other level's limit
      else if (typeof u === 'number' && typeof v === 'number') o[k] = Number.isInteger(u) && Number.isInteger(v) ? Math.round(lerp(u, v)) : lerp(u, v);
      else if (u && v && typeof u === 'object') o[k] = mix(u, v);
      else o[k] = t < 0.5 ? (u ?? v) : (v ?? u);
    }
    return o;
  };
  const S = mix({blur:0, po:0, ...A.search}, {blur:0, po:0, ...B.search});
  S.myopic = !(S.po > 0); if (!S.myopic) delete S.myopic;
  if (!(S.blur > 0.001)) delete S.blur;
  return {...mix(A, B), search:S};
}
function rungFor(g, i){
  const s = g.players[i].skill; if (!s) return null;
  if (!s.hi || !(s.t > 0)) return s.lo;
  if (s.lo.random || s.hi.random) return g.rnd() < s.t ? s.hi : s.lo;   // never offered, but keep it well defined
  return {id:s.lo.id + '>' + s.hi.id, label:`between ${s.lo.label} and ${s.hi.label}`, cfg:blendDepth(DEPTH[s.lo.depth], DEPTH[s.hi.depth], s.t)};
}
const rungDepth = r => r.cfg || DEPTH[r.depth] || null;
// pick among options ranked best-first: k-th best with weight (1 - sharp)^k
function sharpPick(list, sharp, rnd){
  if (!list.length || sharp >= 1) return list[0];
  const q = 1 - sharp, w = list.map((_, k) => Math.pow(q, k)), tot = w.reduce((a, b) => a + b, 0);
  let r = rnd() * tot; for (let k = 0; k < list.length; k++){ r -= w[k]; if (r <= 0) return list[k]; }
  return list[list.length - 1];
}
function abilScale(n, L){ const v = DEFS[n].v, o = ORIG.DEFS[n] && ORIG.DEFS[n].v; if (!v || !o) return 1; const a = v[Math.min(L, v.length)-1], b = o[Math.min(L, o.length)-1]; return b ? a / b : 1; }
function strengthU(n, L){ if (L <= 0) return 0; const d = DEFS[n]; const a = ABIL[n]; return d.p[Math.min(L, d.p.length)-1] + (a ? a[Math.min(L, a.length)-1] * abilScale(n, L) : 0); }
// How many more shops this game is likely to have after the current one, from my side's view.
// Each future battle I win with chance q (my army vs theirs); the game ends as soon as someone reaches the target while ahead.
// At 0-0 in a first-to-3 game that's at least 2 more shops (if one side sweeps), more if it's close;
// it shrinks as either side nears the target, and shrinks faster when one army is clearly stronger.
function expShops(g, i){
  if (g._po){ const m = g._esPo || (g._esPo = {}); if (m[i] == null){ g._po = false; try{ m[i] = expShops(g, i); } finally { g._po = true; } } return m[i]; }
  const T = g.target, a0 = total(g.players[i]), b0 = total(g.players[1-i]), cap = Math.max(0, RULES.maxRounds - g.round);
  const q0 = Math.round(battleOdds(g, i) * 50) / 50, G = g.players[i].genome || {};
  // this round's battle is fought with today's armies; after that the other side rebuilds, so later battles lean back toward even
  const qf = 0.5 + 0.35 * (q0 - 0.5);
  const key = `${i}|${g.round}|${a0}|${b0}|${q0}|${qf}|${T}`;
  if (g._es && g._es.key === key) return g._es.v;
  const memo = new Map();
  const over = (a, b) => Math.max(a, b) >= T && a !== b;
  const f = (a, b, d) => {
    if (d >= cap) return 0;
    const k = a * 1000 + b * 10 + d; if (memo.has(k)) return memo.get(k);
    const q = d === 0 ? q0 : qf;
    const v = q * (over(a + 1, b) ? 0 : 1 + f(a + 1, b, d + 1)) + (1 - q) * (over(a, b + 1) ? 0 : 1 + f(a, b + 1, d + 1));
    memo.set(k, v); return v;
  };
  const v = f(a0, b0, 0);
  g._es = {key, v}; return v;
}
// Black Market: what a peek at k unit cards is worth in one shop, measured against the best unit I could
// otherwise buy (the display, a Recruit, or nothing). A card in the peek counts at the discount for that level
// ($1/$2/$3 off, so cheap cards can be free);
// second and third copies of units I own score high because they level them up. Averaged over random peeks
// from the cards still in the unit deck.
// kind 'b' does the same for a peek at the building deck, against the building display and a Field.
function bmPeekGain(g, i, k, kind){
  if (!k) return 0;
  const U = kind !== 'b';
  const p = g.players[i], G = p.genome || baseGenome(), deck = (U ? g.uDeck : g.bDeck).filter(n => !isMir(n));
  if (!deck.length) return 0;
  const key = g._po ? `${U ? 'u' : 'b'}|${i}|${g.round}|${k}`
    : `${U ? 'u' : 'b'}|${i}|${g.round}|${g.turnIdx}|${k}|${deck.length}|${p.money}|${JSON.stringify(U ? p.hand : p.city)}`;
  g._bmg = g._bmg || {}; if (g._bmg[key] != null) return g._bmg[key];
  // valuing a building peek values Black Market itself, which would peek again: count nested peeks as nothing
  if (g._bmIn) return 0;
  g._bmIn = true;
  try{ return (g._bmg[key] = bmPeekCalc(g, i, k, U, p, G, deck)); } finally { g._bmIn = false; }
}
function bmPeekCalc(g, i, k, U, p, G, deck){
  // a typical shop's spending money and buys of this kind
  const budget = Math.max(p.money, Math.max(0, income(p))), buys = buyCap(p);
  const Dk = U ? DEFS : BDEFS, free = U ? 'Recruit' : 'Field';
  const blocked = n => !!cantAcquire(p, n, U ? 'u' : 'b');
  const opt = (n, price) => blocked(n) || price > budget ? null
    : {n, price, v:aiValue(g, i, n, U ? 'u' : 'b') - price * G.m};
  const disp = [opt(free, Dk[free].c), ...(U ? g.disp.u : g.disp.b).map(c => opt(c.name, Dk[c.name].c))].filter(o => o && o.v > 0);
  const off = Math.max(1, BDEFS['Black Market'].lv.indexOf(k) + 1);
  const peekOpt = new Map(); for (const n of new Set(deck)) peekOpt.set(n, opt(n, Math.max(0, Dk[n].c - off)));
  // best total value of up to `buys` different cards within the budget (at most one from the peek)
  const bestSet = (list, extra) => {
    let best = 0;
    const all = extra ? list.concat(extra) : list;
    for (let a = 0; a < all.length; a++){
      if (all[a].price <= budget) best = Math.max(best, all[a].v);
      if (buys < 2) continue;
      for (let b = a + 1; b < all.length; b++){
        const A = all[a], B = all[b];
        if (A.n === B.n && A.n !== free) continue;
        if (A.price + B.price <= budget) best = Math.max(best, A.v + B.v);
      }
    }
    return best;
  };
  const base = bestSet(disp);
  const S = g._po ? 12 : 120, take = Math.min(k, deck.length), idx = deck.map((_, j) => j); let tot = 0;
  for (let t = 0; t < S; t++){
    const peek = [];
    for (let j = 0; j < take; j++){   // a random k-card peek
      const r = j + Math.floor((g.rnd || Math.random)() * (idx.length - j)); const x = idx[j]; idx[j] = idx[r]; idx[r] = x;
      const o = peekOpt.get(deck[idx[j]]); if (o && o.v > 0) peek.push(o);
    }
    let best = base;
    for (const o of peek) best = Math.max(best, bestSet(disp, [o]));
    tot += best - base;
  }
  return tot / S;
}
// Mercenary in the quick formula: chance of winning the game it adds through this round's battle alone.
// Battle odds come from army power (as battleOdds), the stakes from the game-win math the search uses.
const MERC_K = 20;
function mercSwing(g, i, G, held, gain){
  const a = armyPower(g.players[i]) + held, b = armyPower(g.players[1 - i]);
  const od = x => x + b <= 0 ? 0.5 : Math.max(0.1, Math.min(0.9, x * x / (x * x + b * b)));
  const q0 = od(a), dq = od(a + gain) - q0;
  if (dq <= 0) return 0;
  const V = roundValues(g, i, G, logit(q0), logit(battleOdds(g, i)));
  return dq * Math.max(0, V.w - V.l);
}
function roundsLeft(g){ const lead = Math.max(total(g.players[0]), total(g.players[1])); return Math.max(1, Math.min(6, (g.target - lead) * 1.6 + 0.5)); }

function aiValue(g, i, name, kind){
  const p = g.players[i], G = p.genome || baseGenome(), rL = roundsLeft(g), rf = Math.min(rL, 4)/2 + 0.5, bias = (G.bias[name] || 0) ;
  // rE: how many future shops an income or discount card is likely to pay out in 
  // (older saved AIs kept a separate income-horizon weight hk; it only ever multiplied e and hb, so it now lives inside them)
  const rE = expShops(g, i) * (G.hk ?? 1);
  if (kind === 'u'){
    if (name === 'Recruit') return G.s * 0.6 * (1 + 0.8 * bVal(p, 'Muster Hall')) + bias;   // a trained Recruit hits harder
    const c = p.hand[name] || 0, L = Math.min(c + 1, uMax(name));
    let gain = strengthU(name, L) - strengthU(name, c);
    // Mercenary fights one battle and is discarded: it's worth what it adds to this battle's chances, times what
    // this battle's point is worth at the current score (little at 0-0, everything at match point)
    if (name === 'Mercenary') return G.s * MERC_K * mercSwing(g, i, G, strengthU(name, c), gain) + bias;
    if (c === 0){
      const cap = deckCap(p);
      if (uniqueUnits(p) >= cap){
        let weak = Infinity; for (const n in p.hand) if (!exemptUnit(n)) weak = Math.min(weak, strengthU(n, uLvl(n, p.hand[n])));
        gain -= G.slot * weak;
      }
    } else gain += G.pair;
    let v = G.s * gain * rf;
    // combos: a new unit is worth more when it pairs well with something already owned
    if (c === 0) v += G.s * (G.combo ?? 1) * 8 * comboBonus(p, name) * rf;
    // level-ups: the pairing already counted when the first copy came in; a stronger copy makes it pay off more,
    // in proportion to how much stronger the unit gets
    else if (G.lu2 !== 0){ const s0 = strengthU(name, c), up = strengthU(name, L) - s0; if (s0 > 0 && up > 0) v += G.s * (G.combo ?? 1) * 8 * comboBonus(p, name) * rf * Math.min(1, up / s0) * (G.lu2 ?? 0.35); }
    // Hired Blade's drawback has its own weight, so learning to ignore it can't drag down how much the AI values income
    if (name === 'Hired Blade') v -= (G.hb ?? 0.5) * rE * (hiredBladeCost(c + 1) - hiredBladeCost(c));
    const d = DEFS[name];
    // Conscripted Farmhand: income like a Windmill, but only once I own a Field (likely soon if I don't yet)
    if (name === 'Conscripted Farmhand' && d.v){ const inc = d.v[Math.min(L, d.v.length)-1] - (c ? d.v[Math.min(c, d.v.length)-1] : 0); v += G.e * rE * inc * ((p.city.Field || 0) > 0 ? 1 : 0.6); }
    if (d.m){
      const inc = d.m[L-1] - (c ? d.m[Math.min(c, 3)-1] : 0);
      v += G.e * 0.8 * rE * inc * (name === 'Arsonist' ? (g.players[1-i].city.Field || 0) : 1);
    }
    return v + bias;
  }
  if (name === "Mason's Guild"){ const t = aiMasonTarget(g, i); return t ? aiValue(g, i, t, 'b') + bias : -99; }
  // gear: worth about this much power on one unit, and little once every unit already has a piece
  if (isGear(name)){
    const units = Object.keys(p.hand).filter(n => p.hand[n] > 0 && !exemptUnit(n)).length, held = gearList(p).length;
    const room = Math.min(units, deckCap(p)) - held;
    return G.s * rf * (GEAR_VAL[name] || 1) * (room > 0 ? 1 : 0.15) + bias;
  }
  const c = p.city[name] || 0, lv = BDEFS[name].lv;
  if (name !== 'Field' && c >= lv.length) return -99;
  const nl = Math.min(c + 1, lv.length);
  const inc = lv[nl-1] - (c ? lv[Math.min(c, lv.length)-1] : 0);
  let v = 0;
  switch (name){
    case 'Field': v = G.e * rE; break;
    case 'Windmill': v = G.e * rE * inc; break;
    case 'Smithy': v = G.s * rf * 1.0 * inc; break;
    case 'Barracks': v = G.s * rf * 0.7 * inc; break;
    case 'Study': v = G.s * rf * 1.6 * inc; break;
    case 'Armory': v = G.s * rf * 2.5 * inc; break;
    case 'Training Yard': v = G.s * rf * (2.5 * inc + (c ? 0 : 1.0)); break;   // the Armament comes with the first level only
    case 'Trebuchet': v = G.s * rf * 0.8 * inc; break;
    case 'Reserve Encampment': v = G.s * rf * (uniqueUnits(p) > deckCap(p) ? 3 : 0.4) * inc; break;
    case 'Infirmary': v = G.s * rf * 2.5; break;
    case 'Muster Hall': { const n = (p.hand.Recruit || 0) + bVal(p, 'Barracks') + (p.hand.Recruiter ? 2 : 0) + (p.hand['Cowardly Squire'] ? 1 : 0) + 1; v = G.s * rf * 0.5 * inc * Math.max(0.5, n) + (c ? 0 : G.e * rE * 0.5); break; }   // trained Recruits, plus $1 saved on each Recruit from the first level
    case 'Black Market': {
      // what the bigger peek finds (at whichever deck is better to look at), over this shop (if I still have a buy) and the shops likely left
      if (!(G.bmk ?? 1)){ v = 0; break; }   // training set this weight to 0: skip the simulated peeks it would multiply
      const lv = BDEFS['Black Market'].lv, b = g.buys && g.buys[i];
      const shops = (b && baseLeft(b) > 0 ? 1 : 0) + expShops(g, i);
      const peek = n => n ? Math.max(bmPeekGain(g, i, n, 'u'), bmPeekGain(g, i, n, 'b')) : 0;
      v = (G.bmk ?? 1) * shops * (peek(lv[nl-1]) - (c ? peek(lv[Math.min(c, lv.length)-1]) : 0));
      break;
    }
    case "Carpenter's Guild": { const spare = Math.max(0, (Math.max(0, income(p)) - 3) / 2); v = G.e * rE * (0.8 * Math.min(inc, spare) + (c === 0 ? 0.8 : 0)); break; }   // extra building buys need spare money; $1 off buildings from the first level   // extra building buys, plus $1 off buildings from the first level
    case 'Cathedral': v = G.cath * 20 * cathedralGain(g, i); break;
    // Chapel: money saved a shop: about how many cards with miracles under them I buy a shop (the share of shop cards that carry them)
    case 'Chapel': { const all = g.uDeck.concat(g.bDeck), m = g.miracles ? all.filter(isMir).length : 0, n = all.length - m; v = G.e * rE * inc * (n ? Math.min(1.5, buyCap(p) * 0.5 * m / n) : 0); break; }
    // War College: money saved a shop on discard-pile copies of my cards (more likely the more of them are already there)
    // War College: free duplicates of my units from the discard pile (more likely the more of them are already there)
    case 'War College': { const sal = (g.muster || []).filter(x => ownsCard(p, x) > 0 && !cantAcquire(p, x, cardKind(x))).length; v = G.s * rf * Math.min(3, 0.6 + 1.2 * sal); break; }
    // The Bazaar: $1 more per card sold (the AI sells now and then)
    case 'The Bazaar': v = G.e * rE * 0.3 * (BDEFS['The Bazaar'].lv[0] || 0); break;
    // Altar of Blood: $4 a shop, less a copy of my priciest unit every shop
    case 'Altar of Blood': { const o = altarOpts({...p, city:{...p.city, 'Altar of Blood':1}}); const loss = o.length ? strengthU(o[0], uLvl(o[0], p.hand[o[0]])) - strengthU(o[0], uLvl(o[0], p.hand[o[0]] - 1)) : 0; v = G.e * rE * (BDEFS['Altar of Blood'].lv[0] || 0) - G.s * rf * Math.max(0.5, loss) * Math.min(rE, 3); break; }
  }
  return v + bias;
}
// Cathedral: how much owning it would raise my chance of winning the game, given the score and how my army
// compares with theirs. Its point only counts once I win a battle, so it's worth most when I'm close and favored.
function armyPower(p){
  const s = Object.keys(p.hand).filter(n => n !== 'Recruit' && !exemptUnit(n)).map(n => strengthU(n, uLvl(n, p.hand[n]))).sort((a, b) => b - a);
  return s.slice(0, deckCap(p)).reduce((a, b) => a + b, 0) + recAllow(p) + mirHeld(p, 'arm');
}
function battleOdds(g, i){
  const a = armyPower(g.players[i]), b = armyPower(g.players[1-i]);
  if (a + b <= 0) return 0.5;
  return Math.max(0.1, Math.min(0.9, a * a / (a * a + b * b)));
}
function gameWinChance(a, b, cath, q, T){
  // a = my battle points, b = their total; I win each battle with chance q; a Cathedral adds 1 but I must win a battle to finish
  const memo = new Map();
  const f = (a, b, wonLast, depth) => {
    const ta = a + (cath ? 1 : 0), tb = b;
    if (Math.max(ta, tb) >= T && ta !== tb){
      if (ta > tb){ if (!cath || wonLast) return 1; }
      else return 0;
    }
    if (depth >= 12) return 0.5;
    const k = a + ',' + b + ',' + wonLast + ',' + depth;
    if (memo.has(k)) return memo.get(k);
    const r = q * f(a + 1, b, true, depth + 1) + (1 - q) * f(a, b + 1, false, depth + 1);
    memo.set(k, r); return r;
  };
  return f(a, b, false, 0);
}
function cathedralGain(g, i){
  const p = g.players[i], o = g.players[1-i];
  if (o.city.Cathedral) return 0;
  const q = battleOdds(g, i), T = g.target, b = total(o);
  return Math.max(0, gameWinChance(p.score, b, true, q, T) - gameWinChance(p.score, b, false, q, T));
}
// What the miracles under a card are worth to player i, on the same scale as aiValue minus price.
// Money back cancels price; Recruits and Armaments are valued like a bought Recruit each, a Training token like two;
// Discard Writ by the display units it would move plus the extra turn; Divine Favor like a
// spare extra buy; Vision like a 3-card Black Market peek. G.mir scales the lot (learned in training; 1 = neutral).
function mirValue(g, i, list, G, mE, pair, kind){
  let v = 0;
  // Covenant: each card on top is worth what it's worth to me, less its price (the price is already in the quote)
  for (const n of pair || []) v += aiValue(g, i, n, kind || cardKind(n)) - ((kind === 'u' ? DEFS : BDEFS)[n] || {c:0}).c * G.m * (mE ?? 1);
  if (!list || !list.length) return v;
  for (const n of list){
    const m = MIRS[n];
    if (m.cash) v += m.cash * G.m * mE;
    if (m.disc) v += m.disc * G.m * mE * 0.9;   // like money back, a little less: it needs a next buy that costs that much
    if (m.rec) v += m.rec * G.s * 0.6;
    if (m.arm) v += m.arm * G.s * 0.6;
    if (m.tr) v += m.tr * G.s * 1.0;   // a level is worth about two Armaments
    if (m.writ) v += writPick(g, i, null).reduce((s, x) => s + x.v, 0) * 0.5 + 0.8 * G.m * Math.max(0.5, mE);   // + shopping again before the opponent
    if (m.fav) v += m.fav * 1.2 * G.m * Math.max(0.5, mE);
    if (m.vis && !g._po) v += Math.max(bmPeekGain(g, i, m.vis, 'u'), bmPeekGain(g, i, m.vis, 'b'));
    // Restock: one more card to choose from, measured like a one-card Black Market peek (the opponent sees it too)
    if (m.rst && !g._po) v += 0.5 * m.rst * Math.max(0, bmPeekGain(g, i, 1, kind || 'u'));
    // Freeze: a held card to set aside later, worth a little like a spare buy; Mill only shapes what's left (learned opinion)
    if (m.frz) v += 0.4 * G.m * Math.max(0.5, mE);
    // Upheaval: a fresh display when this one has nothing for me, worth a little like a spare buy
    if (m.rdl) v += 0.5 * G.m * Math.max(0.5, mE);
    // battle miracles: a rough worth in Armaments, until the learned opinion of each one takes over
    if (m.bat && g.battleMir) v += (m.bv || 1) * G.s * 0.6;
  }
  let op = 0; for (const n of list) op += (G.bias && G.bias[n]) || 0;   // learned opinion of each miracle
  return v * (G.mir ?? 1) + op;
}
const GEAR_VAL = {'Poison Oil':3, 'Lance':2.5, 'Heirloom Blade':2.4, 'Zweihander':1.8, 'War Banner':1.8, 'Battle Axe':1.4, 'Healing Balm':1.2, 'War Horn':1.5, 'War Drums':1.4};
function aiMasonTarget(g, i){
  const ts = masonTargets(g.players[i]); let best = null, bv = -Infinity;
  for (const t of ts){ const v = aiValue(g, i, t, 'b'); if (v > bv){ bv = v; best = t; } }
  return best;
}
function aiShopOptions(g, i){
  const opts = [];
  g.disp.u.forEach((c, idx) => opts.push({src:'du', idx, name:c.name, kind:'u'}));
  g.disp.b.forEach((c, idx) => opts.push({src:'db', idx, name:c.name, kind:'b'}));
  opts.push({src:'field', name:'Field', kind:'b'}, {src:'recruit', name:'Recruit', kind:'u'});
  const pbm = peekOf(g, i, 'bm'); if (pbm) pbm.cards.forEach((n, idx) => opts.push({src:'bm', idx, name:n, kind:pbm.k}));
  const me = g.players[i];
  (g.muster || []).forEach((n, idx) => { if (ownsCard(me, n) > 0 && !opts.some(o => o.src === 'mu' && o.name === n)) opts.push({src:'mu', idx, name:n, kind:cardKind(n)}); });
  const pvis = peekOf(g, i, 'vis'); if (pvis) pvis.cards.forEach((n, idx) => opts.push({src:'vis', idx, name:n, kind:pvis.k}));
  if (g.frozen && g.frozen[i]) g.frozen[i].forEach((c, idx) => opts.push({src:'fz', idx, who:i, name:c.name, kind:c.kind}));
  return opts;
}
const BATTLE_BLDGS = new Set(['Smithy','Barracks','Study','Armory','Training Yard','Trebuchet','Infirmary','Reserve Encampment','Muster Hall']);
for (const n in BDEFS) if (BDEFS[n].gear) BATTLE_BLDGS.add(n);   // gear is judged by test battles, like the battle buildings
/* ---------- Gear for the AI ----------
   gearList: the gear in a player's hand, best first. placeGear: a quick, sensible spot for each piece in a lined-up
   deck (used by every order the search tries, and by the imagined players). tuneGear then improves the real choice
   with test battles against the AI's guesses at the enemy deck. */
const GEAR_RANK = ['Poison Oil','Lance','Heirloom Blade','Zweihander','War Banner','Battle Axe','Healing Balm','War Horn','War Drums'];
const DRUM_FIT = new Set(['Slinger','Dutiful Squire','Musketeer','Cannon','Dowser Oracle','Scholar','Jester','Halberd Knight','Dark Knight']);   // units with a Reveal ability
const DRUM_CHARGE = new Set(['Knight','Dark Knight','Scholar','Man-at-arms','Recruiter']);   // units with a Charge ability
function gearList(p){ const out = []; const gh = (p && p.gear) || {}; for (const n of GEAR_RANK) for (let k = 0; k < (gh[n] || 0); k++) out.push(n); for (const n in gh) if (!GEAR_RANK.includes(n)) for (let k = 0; k < gh[n]; k++) out.push(n); return out; }
const unitStr = u => u.name === 'Recruit' ? Math.min(1 + (u.tr || 0), 3) + (u.arm || 0) : strengthU(u.name, armyLvl(u)) + (u.arm || 0);
function placeGear(full, gear){
  if (!gear || !gear.length || !full.length) return full;
  const free = () => full.filter(u => !u.gear);
  const strongest = list => list.reduce((b, u) => !b || unitStr(u) > unitStr(b) ? u : b, null);
  for (const n of gear){
    let t = null;
    if (n === 'War Banner'){ let bv = -1; full.forEach((u, k) => { if (k > 0 && !u.gear && unitStr(full[k-1]) > bv){ bv = unitStr(full[k-1]); t = u; } }); }
    else if (n === 'Zweihander') t = strongest(free().filter(u => !u.arm && !u.sh));
    // War Drums: right behind a unit with a Charge ability. War Horn: right in front of a unit with a Reveal ability.
    else if (n === 'War Drums'){ full.forEach((u, k) => { if (!t && k > 0 && !u.gear && DRUM_CHARGE.has(full[k-1].name)) t = u; }); if (!t) t = strongest(free()); }
    else if (n === 'War Horn'){ full.forEach((u, k) => { if (!t && k + 1 < full.length && !u.gear && DRUM_FIT.has(full[k+1].name)) t = u; }); if (!t) t = strongest(free()); }
    else t = strongest(free().filter(u => u.name !== 'Recruit')) || strongest(free());
    if (t) t.gear = n;
  }
  return full;
}
// Improve where the gear goes with test battles: move one piece at a time to the spot (or off) that scores best
function tuneGear(g, i, deck){
  const p = g.players[i], have = gearList(p);
  if (!deck || !deck.length || !have.length) return deck;
  const guesses = oppGuessSet(g, i, 6).filter(d => d.length); if (!guesses.length) return deck;
  const myCfg = battleCfgOf(p), oppCfg = battleCfgOf(g.players[1-i]);
  const units = deck.filter(u => !isBat(u.name)).map(u => ({...u}));
  const sc = d => scoreDeck(d, i, myCfg, oppCfg, guesses);
  // pieces: what's equipped plus what's left in hand
  const used = {}; for (const u of units) if (u.gear) used[u.gear] = (used[u.gear] || 0) + 1;
  const spare = []; for (const n of have){ if (used[n] > 0) used[n]--; else spare.push(n); }
  let best = sc(units);
  for (let pass = 0; pass < 2; pass++){
    let moved = false;
    const pieces = units.map((u, k) => u.gear ? {n:u.gear, at:k} : null).filter(Boolean).concat(spare.map(n => ({n, at:-1})));
    for (const pc of pieces){
      for (let k = -1; k < units.length; k++){
        if (k === pc.at || (k >= 0 && units[k].gear) || (k >= 0 && pc.n === 'Zweihander' && (units[k].arm || units[k].sh))) continue;
        if (pc.at >= 0) units[pc.at].gear = null; if (k >= 0) units[k].gear = pc.n;
        const s = sc(units);
        if (s > best + 1e-9){ best = s; if (pc.at < 0) spare.splice(spare.indexOf(pc.n), 1); else if (k < 0) spare.push(pc.n); pc.at = k; moved = true; }
        else { if (k >= 0) units[k].gear = null; if (pc.at >= 0) units[pc.at].gear = pc.n; }
      }
    }
    if (!moved) break;
  }
  // put the battle miracles back where they were
  let k = 0; return deck.map(u => isBat(u.name) ? u : units[k++]);
}
function permutations(a){
  if (a.length <= 1) return [a.slice()];
  const out = [];
  a.forEach((x, k) => { for (const r of permutations(a.slice(0,k).concat(a.slice(k+1)))) out.push([x].concat(r)); });
  return out;
}
function buildArmy(p, extraTrain, must){
  // choose units + tokens for a player, independent of order
  // must: a unit that has to make the army even if it's weak on its own (a combo piece being tested in the shop)
  const cap = deckCap(p);
  const units = Object.keys(p.hand).filter(n => n !== 'Recruit').map(n => ({name:n, copies:p.hand[n], arm:0, sh:0, tr:0}));
  const lv = armyLvl;
  units.sort((a, b) => strengthU(b.name, lv(b)) - strengthU(a.name, lv(a)));
  const plain = units.filter(u => !exemptUnit(u.name)), top = plain.slice(0, cap);
  if (must && cap > 0 && !top.some(u => u.name === must)){ const m = plain.find(u => u.name === must); if (m) top[top.length - 1] = m; }
  const core = top.concat(units.filter(u => exemptUnit(u.name)));
  let tr = trAllow(p) + (extraTrain || 0);
  while (tr-- > 0 && core.length){
    let best = null, bg = 0;
    for (const u of core){ if (lv(u) >= uMax(u.name)) continue; const gn = strengthU(u.name, lv(u) + 1) - strengthU(u.name, lv(u)); if (gn > bg){ bg = gn; best = u; } }
    if (best) best.tr++;
  }
  const recs = recAllow(p);
  return {core, recs, arm:armAllow(p), sh:shAllow(p), gear:gearList(p)};
}
function assemble(order, recs, arm, recFront, armFirst, sh, gear){
  const deck = order.map(u => ({...u}));
  const r = Array.from({length:recs}, () => ({name:'Recruit', copies:1, arm:0, sh:0, tr:0}));
  const full = recFront ? r.concat(deck) : deck.concat(r);
  if (arm && deck.length){
    let t;
    if (armFirst) t = deck[0];
    else { t = deck[0]; for (const u of deck) if (strengthU(u.name, armyLvl(u)) > strengthU(t.name, armyLvl(t))) t = u; }
    t.arm += arm;
  }
  if (sh && full.length) full[0].sh = (full[0].sh || 0) + sh;   // Armory's Shields: on the Vanguard
  return placeGear(full, gear);
}
function battleCfgOf(p){ return {treb:bLvl(p,'Trebuchet'), yard:bVal(p,'Training Yard'), drill:bVal(p,'Muster Hall'), infirmary:!!p.city.Infirmary}; }
// Two "reads" of the enemy deck: strongest-first, and the order they used last battle (or weakest-first in round 1)
function oppGuesses(g, i){
  const opp = g.players[1-i], a = buildArmy(opp), guesses = [];
  if (!a.core.length && !a.recs) return guesses;
  guesses.push(assemble(a.core, a.recs, a.arm, true, false, a.sh, a.gear));
  if (opp.prevDeck){
    const seen = opp.prevDeck.filter(u => u.name !== 'Recruit').map(u => a.core.find(c => c.name === u.name)).filter(Boolean);
    const rest = a.core.filter(c => !seen.includes(c));
    guesses.push(assemble(seen.concat(rest), a.recs, a.arm, opp.prevDeck.length > 0 && opp.prevDeck[0].name === 'Recruit', false, a.sh, a.gear));
  } else guesses.push(assemble(a.core.slice().reverse(), a.recs, a.arm, false, false, a.sh, a.gear));
  return guesses;
}
// Reads plus random shuffles, so a plan also holds up against surprises
function oppGuessSet(g, i, n){
  const out = oppGuesses(g, i), a = buildArmy(g.players[1-i]);
  if (!a.core.length && !a.recs){
    // no army yet: they field nothing, or (if they can still shop) the one unit they could still afford
    const opp = g.players[1-i];
    out.push([]);
    if (g.phase === 'shop' && !g.passed[1-i] && g.buys && baseLeft(g.buys[1-i]) > 0){
      const names = new Set(['Recruit', ...g.disp.u.map(c => c.name)]);
      for (const nm of names) if (DEFS[nm].c <= opp.money) out.push([{name:nm, copies:1, arm:0, sh:0, tr:0}]);
    }
    return out;
  }
  while (out.length < n) out.push(assemble(shuffle(a.core.slice(), g.rnd), a.recs, a.arm, g.rnd() < 0.5, g.rnd() < 0.5, a.sh, a.gear));
  return out;
}
function battleScore(deck, gd, i, myCfg, oppCfg){
  const cfgs = [{...myCfg, units:deck}, {...oppCfg, units:gd}];
  if (i === 1) cfgs.reverse();
  const r = runBattle(cfgs, false), vm = BATTLE_VM && BATTLE_VM[i];
  if (vm){ const w = r.result.w; return (w === i ? vm.w : w < 0 ? vm.t : vm.l) + 0.002 * (r.left[i] - r.left[1-i]); }
  return (scoreFor(r.result.w, i)) + 0.02 * (r.left[i] - r.left[1-i]);
}
// Robust score (70% average, 30% worst case) across guesses, blended with the result against the predicted deck
function scoreDeck(deck, i, myCfg, oppCfg, guesses, pred, read){
  let sum = 0, mn = Infinity;
  for (const gd of guesses){ const s = battleScore(deck, gd, i, myCfg, oppCfg); sum += s; if (s < mn) mn = s; }
  const robust = guesses.length ? 0.7 * sum / guesses.length + 0.3 * mn : 0;
  if (!pred || !pred.length) return robust;
  return read * battleScore(deck, pred, i, myCfg, oppCfg) + (1 - read) * robust;
}
// Run fn with the opponent's units and buildings temporarily replaced by a predicted version (then put back).
function withOpp(g, i, fake, fn){
  if (!fake) return fn();
  const o = g.players[1 - i], h0 = o.hand, c0 = o.city;
  o.hand = fake.hand; o.city = fake.city;
  try{ return fn(); } finally { o.hand = h0; o.city = c0; }
}
// What will the opponent still buy this shop? They take turns with me, so when I'm choosing they usually have buys
// left. Predict them greedily with my own judgment as the model of theirs (I can't see their weights): the card they'd
// value most that they can afford, then the next, within their remaining unit and building buys and money.
// excl {src, idx}: a display card I'm about to take, so it isn't there for them. Returns {picks, fake} or null.
function predictOppBuys(g, i, G, excl){
  const o = 1 - i, opp = g.players[o];
  if (g.phase !== 'shop' || !g.buys || g.passed[o]) return null;
  // their buys and money as they'd stand after each predicted purchase, priced by the real rules
  // (Carpenter's Guild slots and discount, the +$1 extra buy)
  const b = {...g.buys[o]};
  const opts = [];
  g.disp.u.forEach((c, idx) => { if (!(excl && excl.src === 'du' && excl.idx === idx)) opts.push({name:c.name, kind:'u', src:'du', idx}); });
  g.disp.b.forEach((c, idx) => { if (!(excl && excl.src === 'db' && excl.idx === idx) && c.name !== "Mason's Guild") opts.push({name:c.name, kind:'b', src:'db', idx}); });
  opts.push({name:'Recruit', kind:'u', src:'recruit'}, {name:'Field', kind:'b', src:'field'});
  const fake = {hand:{...opp.hand}, city:{...opp.city}, gear:{...(opp.gear || {})}, money:opp.money}, picks = [];
  const g0 = opp.genome, h0 = opp.hand, c0 = opp.city;
  opp.genome = G; opp.hand = fake.hand; opp.city = fake.city;
  try{
    for (let k = 0; k < 6; k++){
      let best = null;
      for (const c of opts){
        if (c.taken) continue;
        const q = buyQuote(fake, b, c.name, c.kind, c.src, mirSur(mirOf(g, c)), pairOf(g, c), mirOf(g, c).length); if (!q.ok) continue;
        const v = aiValue(g, o, c.name, c.kind) - q.price * G.m + mirValue(g, o, mirOf(g, c), G, 1, pairOf(g, c), c.kind);
        if (v > G.thresh && (!best || v > best.v)) best = {...c, v, price:q.price, slot:q.slot};
      }
      if (!best) break;
      picks.push(best); fake.money -= best.price; useSlot(b, best.kind, best.slot, best.name);
      if (best.kind === 'u') fake.hand[best.name] = (fake.hand[best.name] || 0) + 1;
      else if (isGear(best.name)) fake.gear[best.name] = (fake.gear[best.name] || 0) + 1;
      else fake.city[best.name] = (fake.city[best.name] || 0) + 1;
      if (best.src === 'du' || best.src === 'db'){ const x = opts.find(c => c.src === best.src && c.idx === best.idx); if (x) x.taken = true; }
    }
  } finally { opp.genome = g0; opp.hand = h0; opp.city = c0; }
  return picks.length ? {picks, fake} : null;
}
// The opponent's army as I should expect to face it this battle: guesses at their order, their battle buildings, and
// my prediction of the deck they'd field, all for a given (possibly predicted) set of their cards.
function oppView(g, i, D, fake){
  return withOpp(g, i, fake, () => ({guesses:oppGuessSet(g, i, D.shopGuesses), oppCfg:battleCfgOf(g.players[1 - i]), pred:predictOpp(g, i, D.predictK)}));
}
/* ---------- Opponent model: learning how this opponent orders their army ----------
   At Mobilize the AI makes several guesses at the opponent's order: its search prediction ("pred"), strongest unit
   first ("strong"), the order they used last battle ("last"; weakest first, "weak", before there is one). After the
   battle it checks each guess against the order they really fielded (front positions count most) and keeps a running
   accuracy per guess. Next time it leans on whichever guess has been most accurate, and trusts it more (or less) than
   usual by how accurate it has been: a predictable opponent gets countered harder, an unpredictable one hedged against.
   The trust shift is G.omk per point of accuracy above the 30% starting assumption. */
const OM_PRIOR = 0.3, OM_W = 1.5, OM_POS = [3, 2, 1.5];
const omAcc = (m, k) => ((m.s[k] || 0) + OM_PRIOR * OM_W) / ((m.c[k] || 0) + OM_W);
const omSeq = d => d && d.length ? d.filter(u => u.name !== 'Recruit').map(u => u.name) : null;
function omScore(pred, actual){ let s = 0, t = 0; actual.forEach((n, k) => { const w = OM_POS[k] ?? 1; t += w; if (pred[k] === n) s += w; }); return t ? s / t : 0; }
function omObserve(g){
  if (!g.omPending) return;
  for (const i of [0,1]){
    const P = g.omPending[i]; if (!P) continue;
    const actual = omSeq(g.decks[1 - i]);
    if (!actual || actual.length < 2) continue;   // one unit: nothing to learn about order
    const m = g.om[i] || (g.om[i] = {n:0, s:{}, c:{}});
    m.n++;
    for (const k in P){ if (!P[k]) continue; m.s[k] = (m.s[k] || 0) + omScore(P[k], actual); m.c[k] = (m.c[k] || 0) + 1; }
  }
  g.omPending = [null, null];
}
// The guess to lean on and how far to trust it, from what this opponent has done so far (only for the thinking AI's
// own decisions, not inside its prediction of the opponent).
function omPick(g, i, G, D, guesses, pred){
  const read0 = G.read ?? 0.4, m = g.om && g.om[i];
  if (!D || !D.predictDeep || !m || !m.n) return {pred, read:read0};
  const opp = g.players[1 - i];
  let best = null;
  for (const [k, d] of [['pred', pred], ['strong', guesses[0]], [opp.prevDeck ? 'last' : 'weak', guesses[1]]]){
    if (!d || !d.length) continue;
    const a = omAcc(m, k); if (!best || a > best.a) best = {k, d, a};
  }
  if (!best) return {pred, read:read0};
  return {pred:best.d, read:Math.max(0.05, Math.min(0.95, read0 + (G.omk ?? 1.5) * (best.a - OM_PRIOR))), k:best.k, a:best.a};
}
// Think ahead: what would the opponent field if they planned against my visible army?
function predictOpp(g, i, K){ return aiMobilizeAt(g, 1 - i, K) || null; }   // a quick guess, never the opponent's own rung

// How well a (possibly hypothetical) army does against the enemy
// How well a (possibly hypothetical) army does: try several orderings (strength order, one built from the combo
// table, and random ones), screen them against one guess of the enemy, then fully score the best few.
// must: the card being tested, kept in the army even if it's weak on its own.
function quickStrength(g, i, fake, guesses, oppCfg, pred, read, must){
  const a = buildArmy(fake, 0, must);
  if (!a.core.length && !a.recs) return 0;
  const myCfg = battleCfgOf(fake), nP = (g._qsD && g._qsD.shopPerms) || 8;
  const perms = [a.core.slice(), synOrder(a.core)];
  while (perms.length < nP) perms.push(shuffle(a.core.slice(), g.rnd));
  const decks = [];
  for (const perm of perms) for (const rf of (a.recs ? [true,false] : [true])) for (const af of (a.arm ? [true,false] : [false]))
    decks.push(assemble(perm, a.recs, a.arm, rf, af, a.sh, a.gear));
  const screen = guesses.length ? guesses[0] : null;
  if (screen && decks.length > 3){
    for (const d of decks) d._s = battleScore(d, screen, i, myCfg, oppCfg);
    decks.sort((x, y) => y._s - x._s); decks.length = 3;
  }
  let best = -Infinity;
  for (const d of decks){ const s = scoreDeck(d, i, myCfg, oppCfg, guesses, pred, read); if (s > best) best = s; }
  return best;
}
// a line-up built from the combo table: start from the strongest unit and keep adding whichever unit pairs best
// with the ends of the line (in front of the first or behind the last)
function synOrder(core){
  if (core.length < 3) return core.slice();
  const rest = core.slice(1), line = [core[0]];
  while (rest.length){
    let bi = 0, bv = -Infinity, back = true;
    rest.forEach((u, k) => {
      const v1 = SYN[line[line.length - 1].name + '>' + u.name] || 0, v2 = SYN[u.name + '>' + line[0].name] || 0;
      if (v1 > bv){ bv = v1; bi = k; back = true; }
      if (v2 > bv){ bv = v2; bi = k; back = false; }
    });
    const u = rest.splice(bi, 1)[0]; if (back) line.push(u); else line.unshift(u);
  }
  return line;
}
function withCard(pl, c, masonT){
  const f = {hand:{...pl.hand}, city:{...pl.city}, gear:{...(pl.gear || {})}};
  if (c.kind === 'u') f.hand[c.name] = (f.hand[c.name] || 0) + 1;
  else if (isGear(c.name)) f.gear[c.name] = (f.gear[c.name] || 0) + 1;
  else if (c.name === "Mason's Guild"){ if (!masonT) return null; f.city[masonT] = (f.city[masonT] || 0) + 1; }
  else f.city[c.name] = (f.city[c.name] || 0) + 1;
  return f;
}
/* ===================== SEARCH: planning ahead by chance of winning the game =====================
   Every option is judged by one number: the chance of winning the whole game afterward.
   - This round's battle: both armies' good orders (each side's best few, found by test battles) are fought against
     each other, and each result counts as win, tie or loss. Ties are not half a win: what a tie is worth depends
     on the score, which the game-win math below works out.
   - Later rounds: the edge from this battle carries forward, fading (G.shr per round), plus the money each side
     will have to spend by then (leftover money plus income every shop, G.kp per $ of difference). That is how a
     Field or Windmill, or saving money, is weighed against a unit that helps right now.
   - The game-win math follows the real rules: first to the target, ties score nothing, a Cathedral's point needs a
     battle win to finish the game.
   The shop search looks ahead like a chess engine: my option, then the opponent's best replies (they are assumed to
   play well), then my next buy, and so on, finishing the shop with quick greedy buys once deep enough. It deepens
   one step at a time (iterative deepening) and stops as soon as more thinking won't change its choice: the best
   option stayed best and leads clearly, or every option left is about equal, or the next step won't fit in its
   time or work budget. Options that clearly can't catch up are dropped between steps, so deeper steps only
   separate the real contenders. */
const SEARCH_SKIP = new Set(['log', 'rec', '_why', '_mobWhy', '_mobLevel', '_es', '_qsD', 'battles', 'lastBattle']);
function dcopy(v){
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(dcopy);
  if (v instanceof Set) return new Set(v);
  if (v instanceof Map) return new Map(v);
  const o = {}; for (const k in v) o[k] = k === 'genome' || k === 'skill' ? v[k] : dcopy(v[k]); return o;
}
function simClone(g){
  const o = {};
  for (const k in g){ if (SEARCH_SKIP.has(k)) continue; const v = g[k]; o[k] = typeof v === 'function' ? v : dcopy(v); }
  o.log = []; return o;
}
const sig = x => 1 / (1 + Math.exp(-x));
const logit = q => { q = Math.max(0.1, Math.min(0.9, q)); return Math.log(q / (1 - q)); };   // one battle never makes the game a certainty
// money a player will have per later shop: income, plus about $0.8 a shop from Carpenter's Guild's discount
const projIncome = p => Math.max(0, income(p)) + (p.city["Carpenter's Guild"] ? 0.8 : 0);
// Chance that player i wins the game after this round's battle ends in a win, a tie or a loss for i.
// s0: i's edge in this battle (log-odds); later battles use the faded edge plus the money gap.
// sF: the edge that carries into later battles, measured without this round's Mercenaries and bought Recruits
// (they are discarded after the battle, so they must not count as lasting strength). Defaults to s0.
function roundValues(g, i, G, s0, sF){
  if (sF == null) sF = s0;
  const me = g.players[i], op = g.players[1 - i], T = g.target;
  const ca = me.city.Cathedral ? 1 : 0, cb = op.city.Cathedral ? 1 : 0;
  const kp = G.kp ?? 0.15, shr = G.shr ?? 0.6, tie = G.tie ?? 0.12;
  const m0 = me.money - op.money, dI = projIncome(me) - projIncome(op), maxK = Math.min(8, Math.max(1, RULES.maxRounds - g.round));
  const pk = k => { const q = sig(sF * Math.pow(shr, k) + kp * (m0 + k * dI)); return [(1 - tie) * q, tie, (1 - tie) * (1 - q)]; };
  const P = []; for (let k = 1; k <= maxK; k++) P.push(pk(k));
  const memo = new Map();
  // after a battle with result o (0 win, 1 tie, 2 loss for i) the score is (a, b): is the game over?
  const done = (a, b, o) => {
    const ta = a + ca, tb = b + cb;
    if (Math.max(ta, tb) >= T && ta !== tb){
      if (ta > tb){ if (!ca || o === 0) return 1; }
      else if (!cb || o === 2) return 0;
    }
    return null;
  };
  const f = (a, b, k) => {   // value before later battle k (1-based)
    if (k > maxK) { const d = (a + ca) - (b + cb); return d > 0 ? 0.75 : d < 0 ? 0.25 : 0.5; }
    const key = a * 1e4 + b * 100 + k; if (memo.has(key)) return memo.get(key);
    const p = P[k - 1]; let v = 0;
    for (let o = 0; o < 3; o++){ if (!p[o]) continue; const a2 = a + (o === 0), b2 = b + (o === 2), e = done(a2, b2, o); v += p[o] * (e != null ? e : f(a2, b2, k + 1)); }
    memo.set(key, v); return v;
  };
  const after = o => { const a2 = me.score + (o === 0), b2 = op.score + (o === 2), e = done(a2, b2, o); return e != null ? e : f(a2, b2, 1); };
  return {w:after(0), t:after(1), l:after(2)};
}
// The few best orders player j could field, found by test battles against `vs` (the other side's plain order)
function goodDecks(g, j, P, K, vs, cfgJ, cfgO){
  const pl = g.players[j], a = buildArmy(pl);
  if (!a.core.length && !a.recs) return [[]];
  const perms = [a.core.slice(), synOrder(a.core), a.core.slice().reverse()];
  while (perms.length < P) perms.push(shuffle(a.core.slice(), g.rnd));
  const out = [], seen = new Set();
  for (const perm of perms) for (const rf of (a.recs ? [true, false] : [true])) for (const af of (a.arm ? [true, false] : [false])){
    const d = assemble(perm, a.recs, a.arm, rf, af, a.sh, a.gear), key = deckKey(d); if (seen.has(key)) continue; seen.add(key);
    out.push({d, s:battleScore(d, vs, j, cfgJ, cfgO)});
  }
  out.sort((x, y) => y.s - x.s);
  return out.slice(0, K).map(x => x.d);
}
const plainDeck = p => { const a = buildArmy(p); return (!a.core.length && !a.recs) ? [] : assemble(a.core, a.recs, a.arm, true, false, a.sh, a.gear); };
/* ---------- Playouts: the rest of the game ----------
   After this round's battle, what is my chance of winning the game? Play the rest of it out many times and count.
   Each playout starts from this position after a win, a tie or a loss, shuffles the cards nobody has seen yet (the
   AI doesn't know the deck order), and plays every later round to the end with a fast imagined player on both sides
   (the quick shop formula and a light Mobilize). That imagined player is only the AI's picture of how the game might
   go; every real decision is a comparison of these game-win chances. The same random seeds are used for every option
   in one decision, so options are compared on the same imagined futures and the differences aren't luck. */
const PO_SKIP = new Set(['offers', 'states', 'mirDecide', 'mixInfo', 'omPending']);
function poClone(g){
  const o = {};
  for (const k in g){ if (SEARCH_SKIP.has(k) || PO_SKIP.has(k)) continue; const v = g[k]; o[k] = typeof v === 'function' ? v : dcopy(v); }
  o.log = []; o._po = true; return o;
}
// battle bookkeeping without fighting it (the same steps doBattle takes after a result)
function applyOutcome(c, w){
  c.lastBattle = {w};
  c.players.forEach((p, k) => { p.wonLast = w === k; });
  if (w >= 0) c.players[w].score++;
  for (const k of [0,1]) if (c.decks && c.decks[k]) c.players[k].prevDeck = c.decks[k].map(u => ({...u}));
  for (const p of c.players){ delete p.hand.Recruit; delete p.hand.Mercenary; }
  const t = c.players.map(total), mx = Math.max(t[0], t[1]);
  if (mx >= c.target && t[0] !== t[1]){ const L = t[0] > t[1] ? 0 : 1; if (!c.players[L].city.Cathedral || c.players[L].wonLast){ c.winner = L; c.over = true; } }
  if (!c.over && c.round >= RULES.maxRounds){ c.over = true; c.winner = t[0] === t[1] ? -1 : (t[0] > t[1] ? 0 : 1); }
  c.phase = c.over ? 'over' : 'shop';
}
function poRound(c){
  startShop(c);
  for (let guard = 0; c.phase === 'shop' && guard < 40; guard++){ c._esPo = null; aiShopTurn(c, cur(c), null); }
  if (c.phase === 'shop'){ c.passed = [true, true]; endShop(c); }
  for (const i of [0,1]) setDeck(c, i, plainDeck(c.players[i]));
  finishMobilize(c);
  doBattle(c, false);
}
// [win, tie, loss] for player i: chance of winning the game after this round's battle goes each way.
// g: the shop is over. decks (optional): the orders expected in this battle, so Farmhand/Arsonist money is counted.
// need (optional): which of win/tie/loss can actually happen; the others aren't played out (their value is never used)
function outcomeValues(g, i, n, decks, need){
  const base = poClone(g);
  if (decks){ base.decks = decks.map(d => (d || []).map(u => ({...u}))); finishMobilize(base); }
  else if (!base.decks || !base.decks[0]) base.decks = [[], []];
  const seed = g._poSeed != null ? g._poSeed : 0x5eed, out = [0, 0, 0];
  for (let o = 0; o < 3; o++){
    if (need && !need[o]){ out[o] = NaN; continue; }
    const w = o === 0 ? i : o === 1 ? -1 : 1 - i;
    for (let k = 0; k < n; k++){
      const c = poClone(base); c.rnd = mulberry32(seed + 7919 * k);
      c.uDeck = shuffle(c.uDeck, c.rnd); c.bDeck = shuffle(c.bDeck, c.rnd);
      applyOutcome(c, w);
      for (let r = 0; !c.over && r < 40; r++) poRound(c);
      out[o] += c.over ? scoreFor(c.winner, i) : 0.5;
    }
  }
  // A handful of playouts is a noisy count (one playout is a 0 or a 1), so each estimate starts from the short-sighted
  // view (later battles even, money ignored) worth PO_PRIOR playouts, and the playouts pull it toward what they found.
  const M = myopicValues(g, i, g.players[i].genome), sh = x => (x + PO_PRIOR * x0) / (n + PO_PRIOR);
  let x0;
  x0 = M.w; const w = sh(out[0]); x0 = M.t; const t = sh(out[1]); x0 = M.l; const l = sh(out[2]);
  return {w, t, l};
}
const PO_PRIOR = 2;
// Short-sighted levels in the shop: this battle counts in full, but later battles are seen only dimly. Money and the
// army you keep still matter a little, as they would to any new player (cards carry over, money buys things later),
// so a card that does nothing now is never 'free' and selling a unit you need is never a coin flip. They just don't
// project how far that edge carries, which is where their mistakes come from.
function shortSightValues(g, i, G, s0, sF){
  G = G || {};
  return roundValues(g, i, {kp:(G.kp ?? 0.15) * 0.5, shr:(G.shr ?? 0.6) * 0.5, tie:G.tie ?? 0.12}, s0, sF);
}
// Short-sighted levels: what a win, tie or loss here is worth if every later battle were a coin flip and money
// didn't matter (only the score math: first to the target, ties score nothing, a Cathedral needs a win)
function myopicValues(g, i, G){ return roundValues(g, i, {kp:0, shr:0, tie:(G && G.tie) ?? 0.12}, 0, 0); }
// Mercenaries and bought Recruits last one battle (Barracks Recruits come back every round, so they stay)
const hasTemps = p => !!(p.hand.Mercenary || p.hand.Recruit);
function withoutTemps(g, fn){
  const h0 = g.players.map(p => p.hand);
  for (const p of g.players){ if (!hasTemps(p)) continue; const h = {...p.hand}; delete h.Mercenary; delete h.Recruit; p.hand = h; }
  try{ return fn(); } finally { g.players.forEach((p, k) => { p.hand = h0[k]; }); }
}
// Both sides' good orders fought against each other; q is my best order's average result (a tie counts half)
function edgeRes(g, i, S, cI, cO){
  const me = g.players[i], op = g.players[1 - i];
  const mine = goodDecks(g, i, S.P, S.K, plainDeck(op), cI, cO), theirs = goodDecks(g, 1 - i, S.P, S.K, plainDeck(me), cO, cI);
  const res = mine.map(d => theirs.map(od => {
    const cfgs = [{...cI, units:d}, {...cO, units:od}]; if (i === 1) cfgs.reverse();
    const r = runBattle(cfgs, false), w = r.result.w;
    return {o:w === i ? 0 : w < 0 ? 1 : 2, m:r.left[i] - r.left[1 - i]};
  }));
  let q = 0; for (const row of res){ const s = row.reduce((a, c) => a + (c.o === 0 ? 1 : c.o === 1 ? 0.5 : 0), 0) / row.length; if (s > q) q = s; }
  return {res, q, mine, theirs};
}
// Chance player i wins the game from this position (the shop is over, or treated as over)
function evalState(g, i, G, S, cache, stats){
  const me = g.players[i], op = g.players[1 - i];
  // everything the result depends on: both sides' cards, money, score and miracles, what's left on display and in
  // Discard (the next shop starts from them), the playout budget and seed, and whose judgment imagines the future
  const key = JSON.stringify([i, S.po || 0, g._poSeed, genomeKey(G), g.round, me.hand, me.city, me.money, me.score, me.mir, op.hand, op.city, op.money, op.score, op.mir,
    g.disp.u.map(c => c.name + (c.side ? '*' : '')), g.disp.b.map(c => c.name + (c.side ? '*' : '')), g.muster]);
  if (cache.has(key)) return cache.get(key);
  stats.evals++;
  const cI = battleCfgOf(me), cO = battleCfgOf(op);
  const {res, q, mine, theirs} = edgeRes(g, i, S, cI, cO);
  // the edge that lasts: the same test without either side's Mercenaries and bought Recruits, which are discarded
  // after this battle. Only worth the extra battles when someone is holding one.
  const qF = S.po ? q : (hasTemps(me) || hasTemps(op)) ? withoutTemps(g, () => edgeRes(g, i, S, cI, cO).q) : q;
  // what a win, tie or loss in this battle is worth for the whole game: played out (or the quick projection without a budget)
  const need = [0, 1, 2].map(o => res.some(row => row.some(c => c.o === o)));   // only the results these battles can produce
  const V = S.myopic ? shortSightValues(g, i, G, logit(q), logit(qF)) : S.po ? outcomeValues(g, i, S.po, i === 0 ? [mine[0], theirs[0]] : [theirs[0], mine[0]], need) : roundValues(g, i, G, logit(q), logit(qF));
  const rob = G.rob ?? 0.25, vv = [V.w, V.t, V.l];
  let best = -1, bestRow = null;
  for (const row of res){
    let sum = 0, mn = 1, mg = 0; for (const c of row){ const x = vv[c.o]; sum += x; if (x < mn) mn = x; mg += c.m; }
    const v = (1 - rob) * sum / row.length + rob * mn + 0.0005 * mg / row.length;
    if (v > best){ best = v; bestRow = row; }
  }
  const n = bestRow.length, out = {v:best, w:bestRow.filter(c => c.o === 0).length / n, t:bestRow.filter(c => c.o === 1).length / n};
  cache.set(key, out); return out;
}
// Options for player j in the shop, best first by the quick formula, at most `width` of them, plus passing
const ECON_CARDS = new Set(['Field', 'Windmill', "Carpenter's Guild", 'Chapel', 'War College']);
function shopMoves(g, j, G, width, econ){
  const p = g.players[j], mE = Math.min(1, expShops(g, j)), out = [];
  // the deciding player's own options (econ = root): every legal buy and sale is judged by game-win chance, so none is cut here
  if (econ){
    const list = [], seen = new Set();
    // a sale only makes sense to pay for something: a card I'm a little short for, or one my full city has no room for
    let blocked = false;
    const soldNow = (g.sold && g.sold[j]) || [];
    for (const o of aiShopOptions(g, j)){
      const info = buyInfo(g, j, o.name, o.kind, o.src, o.idx);
      if (!info.ok){
        if (o.name !== "Mason's Guild" && !soldNow.includes(o.name) && (info.why === 'City is full' || (info.price != null && info.price - p.money <= SELL_PRICE * (2 - soldNow.length)))) blocked = true;
        continue;
      }
      if (o.name === "Mason's Guild" && !aiMasonTarget(g, j)) continue;
      if (soldNow.includes(o.name)) continue;   // buying back what I just sold only loses money
      const k = o.name + '|' + (o.src === 'du' || o.src === 'db' ? 'd' : o.src); if (seen.has(k)) continue; seen.add(k);
      list.push({act:'buy', src:o.src, idx:o.idx, name:o.name, kind:o.kind, price:info.price});
    }
    // A sale is only weighed together with the buy it pays for (a card I'm $1 short for, or one my full city has no
    // room for): the cheapest few cards to part with, times the best few cards they'd unlock. Selling on its own,
    // with nothing to spend the dollar on, is never a sensible move.
    if (blocked && soldNow.length < 2){
      const sellables = [];
      for (const n in p.hand) if (aiCanSell(g, j, 'u', n)) sellables.push({kind:'u', name:n});
      for (const n in p.city) if (aiCanSell(g, j, 'b', n)) sellables.push({kind:'b', name:n});
      for (const x of sellables) x.r = aiValue(g, j, x.name, x.kind);
      sellables.sort((a, b) => a.r - b.r);
      const pairs = [];
      for (const x of sellables.slice(0, 3)){
        const c = simClone(g); c.rnd = g.rnd; if (!sell(c, j, x.kind, x.name)) continue;
        for (const o of aiShopOptions(c, j)){
          if (o.name === x.name || soldNow.includes(o.name)) continue;
          if (buyInfo(g, j, o.name, o.kind, o.src, o.idx).ok) continue;   // affordable anyway: no sale needed for it
          const info = buyInfo(c, j, o.name, o.kind, o.src, o.idx); if (!info.ok) continue;
          if (o.name === "Mason's Guild" && !aiMasonTarget(c, j)) continue;
          pairs.push({act:'sellbuy', sk:x.kind, sn:x.name, src:o.src, idx:o.idx, name:o.name, kind:o.kind, price:info.price - SELL_PRICE, r:aiValue(c, j, o.name, o.kind) - x.r});
        }
      }
      pairs.sort((a, b) => b.r - a.r);
      const seenP = new Set();
      for (const m of pairs){ const k = m.sn + '>' + m.name; if (seenP.has(k)) continue; seenP.add(k); list.push(m); if (seenP.size >= 6) break; }
    }
    // Freeze: setting aside each display card (as this turn) is weighed against buying and passing
    if (canFreeze(g, j)){
      const fseen = new Set();
      for (const [src, row] of [['du', g.disp.u], ['db', g.disp.b]]) row.forEach((c, idx) => { if (fseen.has(c.name)) return; fseen.add(c.name); list.push({act:'freeze', src, idx, name:c.name}); });
    }
    list.push({act:'pass', name:'pass'});
    return list;
  }
  for (const o of aiShopOptions(g, j)){
    const info = buyInfo(g, j, o.name, o.kind, o.src, o.idx); if (!info.ok) continue;
    if (o.name === "Mason's Guild" && !aiMasonTarget(g, j)) continue;
    const f = aiValue(g, j, o.name, o.kind) - info.price * G.m * mE + mirValue(g, j, mirOf(g, o), G, mE, pairOf(g, o), o.kind);
    out.push({act:'buy', src:o.src, idx:o.idx, name:o.name, kind:o.kind, price:info.price, f});
  }
  out.sort((a, b) => b.f - a.f);
  const seen = new Set(), list = [];
  for (const m of out){
    const k = m.name + '|' + (m.src === 'du' || m.src === 'db' ? 'd' : m.src); if (seen.has(k)) continue;
    if (list.length >= width && !(econ && ECON_CARDS.has(m.name))) continue;   // at the root, economy is always weighed
    seen.add(k); list.push(m);
  }
  list.push({act:'pass', name:'pass', f:G.thresh * mE});
  return list;
}
function doMove(g, j, m){
  if (m.act === 'sell'){ sell(g, j, m.kind, m.name); return; }
  if (m.act === 'freeze'){ if (useFreeze(g, j, m.src, m.idx)) return; if (g.phase === 'shop' && cur(g) === j) pass(g, j); return; }
  if (m.act === 'sellbuy'){
    if (sell(g, j, m.sk, m.sn) && buy(g, j, m.src, m.idx, m.name === "Mason's Guild" ? aiMasonTarget(g, j) : undefined)) return;
    if (g.phase === 'shop' && cur(g) === j) pass(g, j); return;
  }
  if (m.act === 'buy' && buy(g, j, m.src, m.idx, m.name === "Mason's Guild" ? aiMasonTarget(g, j) : undefined)) return;
  if (g.phase === 'shop' && cur(g) === j) pass(g, j);
}
// finish the shop quickly: each side takes its best formula pick while it beats passing
function rollout(g, G){
  for (let n = 0; n < 30 && g.phase === 'shop'; n++){
    const j = cur(g), m = shopMoves(g, j, G, 1)[0];
    doMove(g, j, m.act === 'buy' && m.f > G.thresh * Math.min(1, expShops(g, j)) ? m : {act:'pass'});
  }
}
function searchVal(g, i, G, S, depth, cache, stats){
  if (g.phase !== 'shop') return evalState(g, i, G, S, cache, stats).v;
  if (depth <= 0){ rollout(g, G); return evalState(g, i, G, S, cache, stats).v; }
  const j = cur(g), moves = shopMoves(g, j, G, S.inner);
  let best = j === i ? -1 : 2;
  for (const m of moves){
    const c = simClone(g); doMove(c, j, m);
    const v = searchVal(c, i, G, S, depth - 1, cache, stats);
    if (j === i ? v > best : v < best) best = v;
  }
  return best;
}
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
// Results kept across shop turns: on my next turn many of the positions I'd judge are ones I already played out
// (their actual reply was in my look-ahead). Cleared when it grows large.
const EVC = new Map();
const _gk = new WeakMap();
function genomeKey(G){ if (!G || typeof G !== 'object') return ''; let k = _gk.get(G); if (k == null){ k = JSON.stringify(G); _gk.set(G, k); } return k; }
// One seed per player per shop, from public facts only, so every turn of a shop uses the same imagined futures
function shopSeed(g, i){
  const s = `${g.round}|${g.first1}|${g.target}|${g.players[0].score}|${g.players[1].score}|${g.uDeck.length}|${g.bDeck.length}|${i}`;
  let x = 2166136261; for (let k = 0; k < s.length; k++){ x ^= s.charCodeAt(k); x = Math.imul(x, 16777619); }
  return x >>> 0;
}
// a player's lasting opinion of a card: a standard normal draw fixed by (player seed, card name)
function misjudge(seed, name){
  let h = (seed ^ 2166136261) >>> 0;
  for (let k = 0; k < name.length; k++){ h ^= name.charCodeAt(k); h = Math.imul(h, 16777619); }
  const r = mulberry32(h >>> 0); return gauss(r);
}
function planShop(g, i, G, S){
  if (EVC.size > 4000) EVC.clear();
  const t0 = nowMs(), cache = EVC, stats = {evals:0, iters:0};
  const root = simClone(g); root.players[1 - i].genome = G;   // I model the opponent with my own judgment
  root._poSeed = shopSeed(g, i);   // every option (and every turn of this shop) is played out on the same imagined futures
  let opts = shopMoves(root, i, G, S.width, true), why = 'deepest search allowed', lastIter = 0, prevBest = null, stable = 0;
  for (let d = 1; d <= S.maxDepth; d++){
    const ti = nowMs();
    // a deeper step that runs past the time budget stops part-way: options it didn't reach keep their last value
    let cut = false;
    // early, wide steps play out each option a few times to drop the clear losers; from minDepth on, the full budget
    const Sd = S.po && d < S.minDepth ? {...S, po:Math.max(1, Math.ceil(S.po / 2))} : S;
    for (const o of opts){
      if (d > 1 && S.ms && nowMs() - t0 > S.ms){ cut = true; break; }
      const c = simClone(root); doMove(c, i, o); o.v = searchVal(c, i, G, Sd, d - 1, cache, stats);
    }
    opts.sort((a, b) => b.v - a.v); stats.iters = d; lastIter = nowMs() - ti;
    if (cut){ why = 'time budget'; break; }
    const top = opts[0], gap = opts.length > 1 ? top.v - opts[1].v : 1;
    if (prevBest === top) stable++; else stable = 0; prevBest = top;
    if (opts.length === 1){ why = 'only one sensible option'; break; }
    if (d >= S.minDepth && stable >= 1 && gap > S.settle){ why = 'best option stayed best and leads clearly'; break; }
    if (d >= S.minDepth && opts[opts.length - 1].v > top.v - 0.004){ why = 'remaining options are about equal'; break; }
    // racing: drop options that can't catch up (generous early, when the look-ahead is still shallow), keeping a few
    const keep = d === 1 ? 3 : 2, margin = S.drop * (d === 1 ? 3 : d === 2 ? 1.5 : 1);
    opts = opts.filter((x, k) => k < keep || x.v >= top.v - margin);
    // will the next, deeper step fit? each step costs roughly (inner) times the last
    if (stats.evals * (S.inner + 0.5) > S.evals){ why = 'work budget'; break; }
    if (S.ms && nowMs() - t0 + lastIter * (S.inner + 0.5) > S.ms){ why = 'time budget'; break; }
  }
  // Gut sense of each card: the search compares where each move leads, but a short look often can't tell moves
  // apart (a unit and a building can lead to the same position once the rest of the shop is played out). Then a
  // person goes by what the card itself is worth to them right now, so every level adds a small nudge for that.
  // Weaker levels lean on it more, and misjudge it: each player rates each card a bit too high or too low and keeps
  // that opinion all game. It's a matter of degree only, so a card that does nothing for them never looks good,
  // and a card they just bought doesn't suddenly look worth selling.
  {
    const me = g.players[i], mE = Math.min(1, expShops(g, i)), lam = 0.0005 + (S.blur || 0) * 0.08;
    if (S.blur && me._mj == null) me._mj = Math.floor(g.rnd() * 2147483647);
    const rate = o => { const raw = aiValue(g, i, o.name, o.kind); return S.blur ? raw * Math.exp(S.blur * 5 * misjudge(me._mj, o.name)) : raw; };
    for (const o of opts){
      if (!Number.isFinite(o.v)) continue;
      if (o.act === 'buy') o.v += lam * (rate(o) - o.price * G.m * mE);
      else if (o.act === 'sell') o.v -= lam * (rate(o) - SELL_PRICE * G.m * mE);
      else if (o.act === 'sellbuy') o.v += lam * (rate(o) - (o.price + SELL_PRICE) * G.m * mE) - lam * (rate({name:o.sn, kind:o.sk}) - SELL_PRICE * G.m * mE);
    }
    opts.sort((a, b) => b.v - a.v);
  }
  if (opts.length > 1 && opts[0].v < opts[1].v) opts.sort((a, b) => b.v - a.v);
  return {opts, stats:{...stats, ms:Math.round(nowMs() - t0)}, why};
}
// battle results as game values while choosing a Mobilize order: [player 0's {w,t,l}, player 1's]
let BATTLE_VM = null;
function mobilizeValues(g, G, D){
  if (D && D.search && D.search.myopic){ const v = [0, 1].map(j => myopicValues(g, j, g.players[j].genome || G)); v.myopic = true; return v; }
  if (D && D.search && D.search.po){
    if (g._poSeed == null) g._poSeed = Math.floor(g.rnd() * 2147483647);
    try{ const v = [0, 1].map(j => outcomeValues(g, j, D.search.po, null)); v.po = D.search.po; return v; } finally { delete g._poSeed; }
  }
  return [0, 1].map(j => { const Gj = g.players[j].genome || G; return roundValues(g, j, Gj, logit(battleOdds(g, j))); });
}
function aiShopTurn(g, i, depth){ return asSeenBy(g, i, () => aiShopTurnSeen(g, i, depth)); }
function aiShopTurnSeen(g, i, depth){
  const rung = g._po ? null : rungFor(g, i);
  if (rung && rung.random){
    // random buyer: any affordable card, or pass, with equal chance
    const opts = aiShopOptions(g, i).filter(o => buyInfo(g, i, o.name, o.kind, o.src, o.idx).ok);
    const k = Math.floor(g.rnd() * (opts.length + 1));
    if (k < opts.length){ const o = opts[k]; buy(g, i, o.src, o.idx, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); if (o.src === 'mu' && cur(g) === i && g.phase === 'shop') return aiShopTurnSeen(g, i, depth); return o.name; }
    pass(g, i); return null;
  }
  if (rung) depth = rungDepth(rung);
  const p = g.players[i], G = p.genome || baseGenome(), D = typeof depth === 'object' ? depth : (depth ? DEPTH.play : null);
  if (bVal(p, 'Black Market') && !g.bmUsed[i]) useBM(g, i, aiBMKind(g, i));
  // commitment test: this AI always takes the chosen card when it can, then shops normally
  if (p.force && !(p.forceOnce && (p.bought.includes(p.force) || (g.mirGot && g.mirGot[i].includes(p.force))))){
    const o = aiShopOptions(g, i).find(x => (x.name === p.force || (MIRS[p.force] && mirOf(g, x).includes(p.force))) && buyInfo(g, i, x.name, x.kind, x.src, x.idx).ok);
    if (o){ buy(g, i, o.src, o.idx, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return o.name; }
  }
  // Money only matters if there's a later shop to spend it in: near the end (2-2, say) a purchase is nearly free
  // and passing to save is pointless, so the price weight and the buy-or-pass bar fade with the shops likely left.
  const mE = Math.min(1, expShops(g, i));
  const TH = G.thresh * mE;
  aiUseMiracles(g, i, G, mE, TH);
  const cands = [];
  for (const o of aiShopOptions(g, i)){
    const info = buyInfo(g, i, o.name, o.kind, o.src, o.idx); if (!info.ok) continue;
    const c0 = {...o, price:info.price, v:aiValue(g, i, o.name, o.kind) - info.price * G.m * mE + mirValue(g, i, mirOf(g, o), G, mE, pairOf(g, o), o.kind)};
    // Discard patience: a discard-pile copy the opponent can't take (they own none) will still be there next shop, so it's
    // worth a little less than a display card that may be gone; fades out when few shops are left
    if (o.src === 'mu' && !(ownsCard(g.players[1-i], o.name) > 0)) c0.v -= (G.mpat ?? 0.5) * mE;
    cands.push(c0);
  }
  if (D && D.search){
    const R = planShop(g, i, G, D.search);
    let pick = R.opts[0];
    if (rung && rung.sharp < 1) pick = softPick(R.opts.map(o => ({o, s:o.v ?? 0})), rung.sharp, 0.08, g.rnd).o;
    if (g.rec) g._why = {level:rung ? rung.label : 'full search', search:{steps:R.stats.iters, positionsJudged:R.stats.evals, ms:R.stats.ms, stopped:R.why},
      options:R.opts.slice(0, 8).map(o => ({move:o.act === 'pass' ? 'pass' : o.act === 'sell' ? 'sell ' + o.name : o.act === 'sellbuy' ? `sell ${o.sn} to buy ${o.name}` : o.name + (o.src === 'mu' ? ' (Discard)' : o.src === 'bm' ? ' (Black Market)' : o.src === 'vis' ? ' (Vision)' : ''), price:o.price, winChance:+(o.v ?? 0).toFixed(3)})),
      chose:pick.act === 'pass' ? 'pass' : pick.act === 'sell' ? 'sell ' + pick.name : pick.act === 'sellbuy' ? `sell ${pick.sn} to buy ${pick.name}` : pick.name};
    if (pick.act === 'sell' && sell(g, i, pick.kind, pick.name)) return aiShopTurnSeen(g, i, depth);   // a sale is free: then shop on
    if (pick.act === 'sellbuy' && sell(g, i, pick.sk, pick.sn)){
      if (buy(g, i, pick.src, pick.idx, pick.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined)) return pick.name;
      return aiShopTurnSeen(g, i, depth);   // shouldn't happen; shop on with the money
    }
    if (pick.act === 'buy' && buy(g, i, pick.src, pick.idx, pick.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined)) return pick.name;
    if (pick.act === 'freeze' && useFreeze(g, i, pick.src, pick.idx)) return 'freeze ' + pick.name;
    pass(g, i); return null;
  }
  let target = aiSaveTarget(g, i, G, mE);
  let deepCtx = null;
  if (D && (cands.length || target)){
    const opp = g.players[1-i], deny = G.deny ?? 0.3;
    let read = G.read ?? 0.4;
    g._qsD = D;
    // My side: does this card help me beat the army they'll have at the battle? That's the army they have now plus
    // what I expect them to buy with the rest of this shop.
    const fut = predictOppBuys(g, i, G, null);
    const view0 = oppView(g, i, D, fut && fut.fake), {guesses, oppCfg} = view0;
    let pred = view0.pred;
    ({pred, read} = omPick(g, i, G, D, guesses, pred));
    const base = quickStrength(g, i, {hand:{...p.hand}, city:{...p.city}, gear:{...(p.gear || {})}}, guesses, oppCfg, pred, read);
    deepCtx = {guesses, oppCfg, pred, read, base, fut};
    // a card I'd take that they were going to buy changes what they end up with: re-predict their buys without it
    const inFut = c => !!fut && (c.src === 'du' || c.src === 'db') && fut.picks.some(k => k.src === c.src && k.idx === c.idx);
    // This round's battle already won against every army they could field? Then buying more strength only helps
    // in later battles: count that share of a unit's value, and let economy compete for the rest.
    if (base >= 0.95){
      const E = expShops(g, i), later = E / (1 + E);
      for (const c of cands) if (c.kind === 'u' || BATTLE_BLDGS.has(c.name)){ const raw = c.v + c.price * G.m * mE; c.v = raw * later - c.price * G.m * mE; }
    }
    // Their side: how much would this card help them against me? (denial)
    const myGuesses = oppGuessSet(g, 1 - i, D.shopGuesses), myCfgPub = battleCfgOf(p);
    const theirBase = deny > 0 ? quickStrength(g, 1 - i, {hand:{...opp.hand}, city:{...opp.city}, gear:{...(opp.gear || {})}}, myGuesses, myCfgPub, null, 0) : 0;
    let relevant = cands.filter(c => c.kind === 'u' || BATTLE_BLDGS.has(c.name) || c.name === "Mason's Guild")
                          .sort((a, b) => b.v - a.v).slice(0, D.shopCands);
    // battle buildings always get the battle test: their flat score says nothing about my army, so it shouldn't filter them out
    for (const c of cands) if (c.kind === 'b' && BATTLE_BLDGS.has(c.name) && !relevant.includes(c)) relevant.push(c);
    for (const c of relevant){
      const mine = withCard(p, c, c.name === "Mason's Guild" ? aiMasonTarget(g, i) : null);
      if (mine){
        if (inFut(c)){
          const f2 = predictOppBuys(g, i, G, {src:c.src, idx:c.idx}), v2 = oppView(g, i, D, f2 ? f2.fake : null), o2 = omPick(g, i, G, D, v2.guesses, v2.pred);
          c.delta = quickStrength(g, i, mine, v2.guesses, v2.oppCfg, o2.pred, o2.read, c.kind === 'u' ? c.name : null) - base;
          c.denied = true;   // taking it from them is already in this number
        } else c.delta = quickStrength(g, i, mine, guesses, oppCfg, pred, read, c.kind === 'u' ? c.name : null) - base;
        // Study lasts all game: also test it on the army I'm likely to have soon (today's army plus the two units I'd most
        // likely buy from this display), weighted by how many shops are likely left to grow into it
        if (c.name === 'Study'){
          const soon = cands.filter(x => x.kind === 'u' && x.name !== 'Recruit').sort((a, b) => b.v - a.v).slice(0, 2);
          if (soon.length){
            const later = {hand:{...p.hand}, city:{...p.city}, gear:{...(p.gear || {})}}; for (const x of soon) later.hand[x.name] = (later.hand[x.name] || 0) + 1;
            const laterS = {hand:later.hand, gear:later.gear, city:{...later.city, Study:(later.city.Study || 0) + 1}};
            const d2 = quickStrength(g, i, laterS, guesses, oppCfg, pred, read) - quickStrength(g, i, later, guesses, oppCfg, pred, read);
            c.delta = Math.max(c.delta, d2 * Math.min(1, expShops(g, i) / 2));
          }
        }
        c.v += 8 * G.s * c.delta;
      }
      // denial: any display card, and a discard-pile card the opponent owns a copy of (only they could muster it)
      if (deny > 0 && !c.denied && (c.src === 'du' || c.src === 'db' || (c.src === 'mu' && ownsCard(opp, c.name) > 0))){
        const ok = c.name !== "Mason's Guild" && !cantAcquire(opp, c.name, c.kind);
        const theirs = ok ? withCard(opp, c, null) : null;
        if (theirs){ c.denial = quickStrength(g, 1 - i, theirs, myGuesses, myCfgPub, null, 0, c.kind === 'u' ? c.name : null) - theirBase; c.v += 8 * G.s * deny * Math.max(0, c.denial); }
      }
    }
  }
  // match recorder: what this decision looked like to the AI (only when a game is being recorded)
  if (g.rec) g._why = {level:rung ? rung.label : (D ? 'full search' : 'quick'), bar:+TH.toFixed(2),
    winOddsNow:deepCtx ? +deepCtx.base.toFixed(3) : undefined,
    expectsOppToBuy:deepCtx && deepCtx.fut ? deepCtx.fut.picks.map(k => k.name) : undefined,
    savingFor:target ? target.name : undefined,
    top:cands.slice().sort((a, b) => b.v - a.v).slice(0, 8).map(c => ({card:c.name, price:c.price, score:+c.v.toFixed(2),
      battleGain:c.delta != null ? +c.delta.toFixed(3) : undefined, helpsOpp:c.denial != null ? +c.denial.toFixed(3) : undefined, takesFromOpp:c.denied || undefined}))};
  let best = null;
  for (const c of cands) if (!best || c.v > best.v) best = c;
  if (rung && rung.sharp < 1 && best && best.v > TH)
    best = softPick(cands.filter(c => c.v > TH).sort((a, b) => b.v - a.v).slice(0, 4).map(c => ({c, s:c.v})), rung.sharp, 4, g.rnd).c;
  // Selling: would selling one card (for $1, or to free a city slot) let me buy something worth more than my best plain buy?
  const sp = g._po ? null : aiSellPlan(g, i, G, mE, deepCtx, best && best.v > TH ? best.v : TH);
  if (sp && g._why) g._why.plan = `sell ${sp.s.name} to buy ${sp.o.name}`;
  if (sp){
    sell(g, i, sp.s.kind, sp.s.name);
    if (buyInfo(g, i, sp.o.name, sp.o.kind, sp.o.src, sp.o.idx).ok){ buy(g, i, sp.o.src, sp.o.idx, sp.o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return sp.o.name; }
    return aiShopTurn(g, i, depth);   // shouldn't happen; shop again with the new money
  }
  // Saving up: a card in the display that I can't afford yet will still be there next round (unless the opponent takes it).
  // Compare "buy the best card now" with "buy only what still leaves enough for it next round, then buy it".
  // If I expect the opponent to buy it this shop, there's nothing to save for.
  const fut0 = deepCtx && deepCtx.fut;
  if (target && fut0 && fut0.picks.some(k => k.name === target.name)) target = null;
  if (target && best && best.v > TH){
    if (deepCtx && (target.kind === 'u' || BATTLE_BLDGS.has(target.name))){
      const mine = withCard(p, target, null);
      if (mine) target.v += 8 * G.s * (quickStrength(g, i, mine, deepCtx.guesses, deepCtx.oppCfg, deepCtx.pred, deepCtx.read, target.kind === 'u' ? target.name : null) - deepCtx.base);
    }
    const later = (G.save ?? 0.3) * target.v, inc = Math.max(0, income(p));
    const keeps = c => p.money - c.price + inc >= target.cost;
    if (!keeps(best)){
      let nb = null; for (const c of cands) if (keeps(c) && (!nb || c.v > nb.v)) nb = c;
      const nbv = nb && nb.v > TH ? nb.v : 0;
      if (later + nbv > best.v){
        if (g._why) g._why.plan = `save for ${target.name} instead of buying ${best.name}`;
        if (nb && nb.v > TH){ buy(g, i, nb.src, nb.idx, nb.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return nb.name; }
        pass(g, i); return null;
      }
    }
  }
  if (best && best.v > TH){ buy(g, i, best.src, best.idx, best.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return best.name; }
  pass(g, i); return null;
}
// Hand miracles on a shop turn. Vision: when it still has a buy and money to use it, at whichever deck it expects
// more from. Divine Favor: once its normal buys are gone, if the favour would buy something clearly worth it.
function aiUseMiracles(g, i, G, mE, TH){
  const p = g.players[i], b = g.buys[i], mir = p.mir || [];
  if (!mir.length || g.passed[i]) return;
  if (!p.discArm && mirDisc(p)) useDisc(g, i, true);
  if (!g._po && mir.includes('Vision') && !peekOf(g, i, 'vis') && p.money >= 1 && baseLeft(b) > 0){
    const gu = g.uDeck.some(n => !isMir(n)) ? bmPeekGain(g, i, MIRS.Vision.vis, 'u') : -1;
    const gb = g.bDeck.some(n => !isMir(n)) ? bmPeekGain(g, i, MIRS.Vision.vis, 'b') : -1;
    if (Math.max(gu, gb) > 0.3) useVision(g, i, gb > gu ? 'b' : 'u');
  }
  // Upheaval: when a fresh display is expected to beat this one by more than holding the miracle is worth
  if (!g._po && p.mir.some(n => MIRS[n] && MIRS[n].rdl) && baseLeft(b) > 0 && p.money >= 1 && aiRedealGain(g, i, G, mE) > 0.5 * G.m * Math.max(0.5, mE)) useRedeal(g, i);
  if (p.mir.includes('Divine Favor') && !b.fav && baseLeft(b) <= 0 && p.money >= 1){
    b.fav = 1; let worth = false;
    for (const o of aiShopOptions(g, i)){
      const inf = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
      if (inf.ok && inf.slot === 'fav' && aiValue(g, i, o.name, o.kind) - inf.price * G.m * mE + mirValue(g, i, mirOf(g, o), G, mE, pairOf(g, o), o.kind) > TH + 1){ worth = true; break; }
    }
    b.fav = 0;
    if (worth) useFavor(g, i);
  }
}
// Sell-to-buy: for the best few cards I can't buy right now only because I'm $1 short or my city is full, try
// selling each of my weakest cards. A plan counts the card I'd get (plus how it changes my battles), the $1 back,
// and what I lose by selling (its value to me, plus how much weaker my army gets). Up to 2 sales per shop.
function aiSellPlan(g, i, G, mE, deepCtx, bar){
  const p = g.players[i];
  if (g.sold && g.sold[i] && g.sold[i].length >= 2) return null;
  const blocked = [];
  for (const o of aiShopOptions(g, i)){
    const info = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
    if (info.ok) continue;
    if (info.why === 'City is full' || (info.price != null && info.price - p.money <= SELL_PRICE)) blocked.push(o);
  }
  if (!blocked.length) return null;
  const sellables = [];
  for (const n in p.hand) if (aiCanSell(g, i, 'u', n)) sellables.push({kind:'u', name:n});
  for (const n in p.city) if (aiCanSell(g, i, 'b', n)) sellables.push({kind:'b', name:n});
  for (const n in (p.gear || {})) if (aiCanSell(g, i, 'b', n)) sellables.push({kind:'b', name:n});
  if (!sellables.length) return null;
  // apply / undo a sale on the player only (no deck, log or money bookkeeping beyond the sale price)
  const sp = SELL_PRICE + bVal(p, 'The Bazaar');
  const tbl = s => s.kind === 'u' ? p.hand : isGear(s.name) ? p.gear : p.city;
  const strip = s => { const t = tbl(s); if (!--t[s.name]) delete t[s.name]; p.money += sp; };
  const unstrip = s => { const t = tbl(s); t[s.name] = (t[s.name] || 0) + 1; p.money -= sp; };
  const clean = o => { const h = {}, c = {}, gr = {}; for (const k in o.hand) if (o.hand[k]) h[k] = o.hand[k]; for (const k in o.city) if (o.city[k]) c[k] = o.city[k]; for (const k in (o.gear || {})) if (o.gear[k]) gr[k] = o.gear[k]; return {hand:h, city:c, gear:gr}; };
  const battle = c => c.kind === 'u' || BATTLE_BLDGS.has(c.name);
  const str = (st, must) => deepCtx ? quickStrength(g, i, st, deepCtx.guesses, deepCtx.oppCfg, deepCtx.pred, deepCtx.read, must) : 0;
  // what each sale costs me, cheapest first
  for (const s of sellables){
    strip(s);
    s.loss = aiValue(g, i, s.name, s.kind) - SELL_PRICE * G.m * mE;
    if (deepCtx && battle(s)) s.loss += 8 * G.s * Math.max(0, deepCtx.base - str(clean(p)));
    unstrip(s);
  }
  sellables.sort((a, b) => a.loss - b.loss);
  const tryS = sellables.slice(0, 4);
  const opts = blocked.map(o => ({...o, raw:aiValue(g, i, o.name, o.kind)})).sort((a, b) => b.raw - a.raw).slice(0, 3);
  let plan = null, top = bar + 0.5 * G.m;   // a sale has to beat the plain choice by a little, so it isn't done on a whim
  for (const o of opts) for (const s of tryS){
    if (o.kind === s.kind && o.name === s.name) continue;
    strip(s);
    const info = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
    if (info.ok){
      let v = aiValue(g, i, o.name, o.kind) - info.price * G.m * mE - s.loss;
      if (deepCtx && battle(o)){
        const now = clean(p), withO = withCard(now, o, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : null);
        if (withO) v += 8 * G.s * (str(withO, o.kind === 'u' ? o.name : null) - str(now));
      }
      if (v > top){ top = v; plan = {s, o}; }
    }
    unstrip(s);
  }
  return plan;
}
// The best card in the display I can't afford now but could next round (cards bought this round stay one more round).
function aiSaveTarget(g, i, G, mE){
  if ((mE != null ? mE < 0.8 : roundsLeft(g) <= 1.2) || (G.save ?? 0.3) <= 0) return null;
  const p = g.players[i], next = p.money + Math.max(0, income(p));
  let t = null;
  for (const [src, arr, kind] of [['du', g.disp.u, 'u'], ['db', g.disp.b, 'b']]) arr.forEach((c, idx) => {
    if (c.side || c.name === "Mason's Guild") return;            // leaving the shop after this round
    const info = buyInfo(g, i, c.name, kind, src, idx);
    if (info.ok || !/^Needs/.test(info.why || '')) return;     // affordable now, or blocked for another reason
    const cost = (kind === 'u' ? DEFS : BDEFS)[c.name].c + mirSur(c.mir);
    if (cost > next) return;
    const v = aiValue(g, i, c.name, kind) - (cost + pairCost(c.pair, kind)) * G.m + mirValue(g, i, c.mir, G, 1, c.pair, kind);
    if (v > 0 && (!t || v > t.v)) t = {name:c.name, kind, cost, v, src, idx};
  });
  return t;
}
// Different choices of which units to field and where Study's Training goes
function armyVariants(p){
  const cap = deckCap(p);
  const all = Object.keys(p.hand).filter(n => n !== 'Recruit').map(n => ({name:n, copies:p.hand[n], arm:0, sh:0, tr:0}));
  const ex = all.filter(u => exemptUnit(u.name)), reg = all.filter(u => !exemptUnit(u.name));
  const st = u => strengthU(u.name, Math.min(u.copies, uMax(u.name)));
  reg.sort((a, b) => st(b) - st(a));
  const subsets = [reg.slice(0, cap)];
  if (reg.length > cap){
    const inn = reg.slice(0, cap), outs = reg.slice(cap);
    for (const o of outs) for (let j = inn.length - 1; j >= 0; j--){ const s2 = inn.slice(); s2[j] = o; subsets.push(s2); }
  }
  const recs = recAllow(p), arm = armAllow(p), study = trAllow(p), sh = shAllow(p), gear = gearList(p);
  const variants = [];
  for (const sub of subsets.slice(0, 12)){
    const core = sub.concat(ex).map(u => ({...u}));
    const targets = study ? core.filter(u => u.copies < uMax(u.name)) : [];
    if (!targets.length){ variants.push({core, recs, arm, sh, gear}); continue; }
    for (const t of targets.slice(0, 5)){
      const c2 = core.map(u => ({...u})), tt = c2.find(u => u.name === t.name);
      let left = study;
      while (left > 0 && tt.copies + tt.tr < uMax(tt.name)){ tt.tr++; left--; }
      while (left-- > 0){ const o = c2.find(u => u.copies + u.tr < uMax(u.name)); if (o) o.tr++; }
      variants.push({core:c2, recs, arm, sh, gear});
    }
  }
  return variants;
}
/* ---------- Mixed mobilize ----------
   Mobilize is a secret, simultaneous choice, so always fielding the single "best" order lets an opponent who learns
   the AI's habits counter it every time. Instead the AI keeps its top few orders, takes the opponent's top few
   orders (from the same search it runs to predict them) plus its other guesses, scores every pairing with the battle
   sim, and solves that small zero-sum grid by regret matching for an unexploitable mix. It then trusts its read of
   the opponent as before: with probability `read` it plays its single best counter, otherwise it draws from the mix.
   D.mix = how many orders per side go in the grid; G.mix = 0 turns it off for that AI. */
function mobilizeMix(A, iters){
  const R = A.length, C = A[0].length, rr = new Array(R).fill(0), rc = new Array(C).fill(0);
  const sx = new Array(R).fill(0), sy = new Array(C).fill(0);
  const norm = r => { const pos = r.map(v => Math.max(0, v)), t = pos.reduce((a, b) => a + b, 0); return t > 0 ? pos.map(v => v / t) : r.map(() => 1 / r.length); };
  for (let t = 1; t <= iters; t++){
    const x = norm(rr), y = norm(rc);
    const ur = A.map(row => row.reduce((a, v, c) => a + v * y[c], 0));            // my payoff for each row against their mix
    const uc = Array.from({length:C}, (_, c) => A.reduce((a, row, r) => a + row[c] * x[r], 0));   // my payoff for each column against my mix
    const v = ur.reduce((a, u, r) => a + u * x[r], 0);
    // regret matching+ (regrets floored at 0), later iterations weighted more
    for (let r = 0; r < R; r++){ rr[r] = Math.max(0, rr[r] + ur[r] - v); sx[r] += t * x[r]; }
    for (let c = 0; c < C; c++){ rc[c] = Math.max(0, rc[c] + v - uc[c]); sy[c] += t * y[c]; }
  }
  const tx = sx.reduce((a, b) => a + b, 0), ty = sy.reduce((a, b) => a + b, 0);
  return {x:sx.map(v => v / tx), y:sy.map(v => v / ty)};
}
const deckKey = d => d.map(u => u.name + (u.copies > 1 ? '*' + u.copies : '') + (u.arm ? 'a' : '') + (u.sh ? 's' : '') + (u.tr ? 't' + u.tr : '')).join('|');
// Mobilize scores each battle result by the chance of winning the game after it (a tie can be worth a lot when
// ahead, or little when a win is needed), instead of counting a tie as half a win.
function deepMobilize(g, i, D){
  if (BATTLE_VM || !D.search) return deepMobilize0(g, i, D);
  BATTLE_VM = mobilizeValues(g, g.players[i].genome || baseGenome(), D);
  try{ return deepMobilize0(g, i, D); } finally { BATTLE_VM = null; }
}
function deepMobilize0(g, i, D){
  const r = mobilizeSearch(g, i, D, D.mix && (g.players[i].genome || {}).mix !== 0 ? D.mix : 1);
  if (!r) return [];
  const {cands, ctx} = r;
  const note = (pick, how, x) => {
    if (!g.rec) return pick;
    const dk = d => d.map(u => u.name + (u.copies > 1 ? ' x' + u.copies : '') + (u.arm ? ' +arm' + u.arm : '') + (u.tr ? ' +train' + u.tr : '')).join(', ');
    g._mobWhy = g._mobWhy || [null, null];
    g._mobWhy[i] = {how, trustInRead:+ctx.read.toFixed(2), predictedOpp:ctx.oppCands.length ? dk(ctx.oppCands[0]) : null,
      oppAlternatives:ctx.oppCands.slice(1).map(dk), guessesAtOpp:ctx.guesses.length,
      top:cands.map((c, k) => ({order:dk(c.d), score:+c.s.toFixed(3), mixWeight:x ? +x[k].toFixed(2) : undefined}))};
    return pick;
  };
  if (cands.length > 1 && D.search && D.search.blur){   // a weaker level misjudges close orders
    let best = null, bs = -Infinity;
    for (const c of cands){ const s = c.s + D.search.blur * gauss(g.rnd); if (s > bs){ bs = s; best = c; } }
    return note(best.d, 'best order as it judged it (blurred)');
  }
  if (cands.length < 2 || !ctx.oppCands.length) return note(cands[0].d, 'best order (no mix)');
  const cols = [], seen = new Set();
  for (const d of ctx.oppCands.concat(ctx.guesses)){ const k = deckKey(d); if (!seen.has(k)){ seen.add(k); cols.push(d); } }
  const A = cands.map(c => cols.map(od => battleScore(c.d, od, i, ctx.myCfg, ctx.oppCfg)));
  const {x} = mobilizeMix(A, 400);
  const keep = x.map(v => v >= 0.04 ? v : 0), tot = keep.reduce((a, b) => a + b, 0);
  g.mixInfo = g.mixInfo || [null, null];
  g.mixInfo[i] = {n:keep.filter(v => v > 0).length, top:+(keep[0] / tot).toFixed(2), read:+ctx.read.toFixed(2)};
  if (g.rnd() < ctx.read) return note(cands[0].d, 'trusted its read: best counter to the predicted order', x);
  let u = g.rnd() * tot;
  for (let k = 0; k < cands.length; k++){ u -= keep[k]; if (u <= 0 && keep[k] > 0) return note(cands[k].d, `drew order #${k + 1} from its mix`, x); }
  return note(cands[0].d, 'drew order #1 from its mix', x);
}
// The mobilize search: returns the K best distinct decks found ({d, s}, best first) and what it decided with.
function mobilizeSearch(g, i, D, K){
  const p = g.players[i], opp = g.players[1-i], G = p.genome || baseGenome(), read = G.read ?? 0.4;
  const vars = armyVariants(p);
  if (!vars.length || (!vars[0].core.length && !vars[0].recs)) return null;
  const guesses = oppGuessSet(g, i, D.guesses), myCfg = battleCfgOf(p), oppCfg = battleCfgOf(opp);
  // Predict their order with a lighter copy of the same search they'll run (thinking through units, Training and
  // order against my likely orders), rather than a handful of random shuffles.
  // When mixing, keep their top K orders too: they are the columns of the grid.
  let pred = null, oppCands = [];
  if (!D.predictDeep) pred = predictOpp(g, i, D.predictK);
  else { const o = mobilizeSearch(g, 1 - i, D.predictDeep, K); oppCands = o ? o.cands.map(c => c.d) : []; pred = o ? o.cands[0].d : []; }
  if (!oppCands.length && pred && pred.length) oppCands = [pred];
  if (D.predictDeep){   // remember these guesses to check against what they actually field
    g.omPending = g.omPending || [null, null];
    g.omPending[i] = {pred:omSeq(pred), strong:omSeq(guesses[0]), [opp.prevDeck ? 'last' : 'weak']:omSeq(guesses[1])};
  }
  const om = omPick(g, i, G, D, guesses, pred);
  const sc = d => scoreDeck(d, i, myCfg, oppCfg, guesses, om.pred, om.read);
  // Stage A: rough test of each unit selection / Training choice
  const top = vars.map(v => {
    let best = -Infinity;
    for (let k = 0; k < D.stageA; k++){
      const perm = k === 0 ? v.core.slice() : shuffle(v.core.slice(), g.rnd);
      const s2 = sc(assemble(perm, v.recs, v.arm, g.rnd() < 0.5, g.rnd() < 0.5, v.sh, v.gear));
      if (s2 > best) best = s2;
    }
    return {v, s:best};
  }).sort((a, b) => b.s - a.s).slice(0, D.top);
  // Stage B: every order (or a large sample) of the best selections; keep the K best distinct decks
  // (ties keep the one found first, so K = 1 picks exactly what a plain best-so-far search would)
  const cands = [], keys = new Set();
  for (const {v} of top){
    const perms = (D.perms === 'all' && v.core.length <= 5) ? permutations(v.core)
      : [v.core.slice()].concat(Array.from({length: D.perms === 'all' ? 120 : D.perms}, () => shuffle(v.core.slice(), g.rnd)));
    for (const perm of perms) for (const rf of (v.recs ? [true,false] : [true])) for (const af of (v.arm ? [true,false] : [false])){
      const d = assemble(perm, v.recs, v.arm, rf, af, v.sh, v.gear);
      const s2 = sc(d);
      if (cands.length >= K && s2 <= cands[cands.length - 1].s) continue;
      const key = K > 1 ? deckKey(d) : '';
      if (K > 1 && keys.has(key)) continue;
      let at = cands.length; while (at > 0 && s2 > cands[at - 1].s) at--;
      cands.splice(at, 0, {d, s:s2, key}); keys.add(key);
      if (cands.length > K) keys.delete(cands.pop().key);
    }
  }
  if (!cands.length) return null;
  return {cands, ctx:{guesses, oppCands, myCfg, oppCfg, read:om.read}};
}
// depth: undefined/false = fast, true = play, or a DEPTH preset object
function aiMobilize(g, i, K, depth){ return asSeenBy(g, i, () => { const d = aiMobilizeSeen(g, i, K, depth); const r = g._po ? null : rungFor(g, i); return aiPlaceSpells(g, i, r && r.random ? d : tuneGear(g, i, d)); }); }
/* Battle miracles: once the AI has its units' order, it tries each spell in hand at every spot in that order (best
   spells first) and keeps a spot only when the gain in this battle's win chance, times how much this battle decides the
   game, beats G.mu, the same bar as for the Mobilize miracles, since a spell is used up either way. The opponent's
   battle miracles in hand are assumed to wait right behind their Vanguard. The random level places them at random. */
function aiPlaceSpells(g, i, deck){
  const p = g.players[i], hand = (p.mir || []).filter(isBat);
  if (!deck || !g.battleMir || !hand.length) return deck;
  const units = deck.filter(u => !isBat(u.name)); if (!units.length) return units;
  const rung = g._po ? null : rungFor(g, i);
  if (rung && rung.random) return withSpells(units, hand.filter(() => g.rnd() < 0.5).map(n => ({name:n, at:Math.floor(g.rnd() * (units.length + 1))})));
  const opp = g.players[1-i], guesses = oppGuessSet(g, i, 6).filter(d => d.length);   // its reads plus a few shuffles
  if (!guesses.length) return units;
  const oppSp = (opp.mir || []).filter(isBat).map(n => ({name:n, at:1}));
  const myCfg = battleCfgOf(p), oppCfg = battleCfgOf(opp);
  const ev = sp => { let s = 0;
    for (const gd of guesses){ const cfgs = [{...myCfg, units, spells:sp}, {...oppCfg, units:gd, spells:oppSp}]; if (i === 1) cfgs.reverse();
      const r = runBattle(cfgs, false); s += scoreFor(r.result.w, i) + 0.02 * (r.left[i] - r.left[1-i]); }
    return s / guesses.length; };
  const G = p.genome || baseGenome(), stakes = battleStakes(g, i), bar = G.mu ?? 0.06;
  const sp = []; let now = ev(sp);
  for (const n of hand.slice().sort((a, b) => (MIRS[b].bv || 0) - (MIRS[a].bv || 0))){
    let best = null;
    for (let at = 0; at <= units.length; at++){ const v = ev(sp.concat([{name:n, at}])); if (!best || v > best.v) best = {at, v}; }
    if (best && (best.v - now) * stakes > bar){ sp.push({name:n, at:best.at}); now = best.v; }
  }
  if (sp.length && g.rec) (g.mirDecide = g.mirDecide || []).push({i, round:g.round, spells:sp.map(x => `${x.name}@${x.at}`)});
  return withSpells(units, sp);
}
// a deck list with spells put back between the units ({name, at}: at = units ahead of it)
function withSpells(units, sp){
  const out = [];
  units.forEach((u, k) => { for (const x of sp) if (x.at === k) out.push({name:x.name}); out.push(u); });
  for (const x of sp) if (x.at >= units.length) out.push({name:x.name});
  return out;
}
// the AI's best few distinct orders, best first (the same searches as aiMobilizeAt)
// A looser level's choice: usually its best, sometimes a worse option, with mistakes that cost little far more likely
// than ones that cost a lot (chance shrinks with the gap to the best: exp(-gap / T), T = (1 - sharp) * scale).
function softPick(list, sharp, scale, rnd){
  if (!list.length || sharp >= 1) return list[0];
  const T = Math.max(1e-6, (1 - sharp) * scale), b = list[0].s;
  const w = list.map(x => Math.exp(-(b - x.s) / T)), tot = w.reduce((a, c) => a + c, 0);
  let u = rnd() * tot; for (let k = 0; k < list.length; k++){ u -= w[k]; if (u <= 0) return list[k]; }
  return list[0];
}
function rankedMobilize(g, i, K, D){
  if (D){
    const own = !BATTLE_VM && D.search;
    if (own) BATTLE_VM = mobilizeValues(g, g.players[i].genome || baseGenome(), D);
    try{ const r = mobilizeSearch(g, i, D, 4); return r ? r.cands.map(c => ({deck:c.d, s:c.s})) : []; } finally { if (own) BATTLE_VM = null; }
  }
  const p = g.players[i], a = buildArmy(p);
  if (!a.core.length && !a.recs) return [];
  const perms = [a.core.slice(), a.core.slice().reverse()];
  for (let k = 0; k < K; k++) perms.push(shuffle(a.core.slice(), g.rnd));
  const guesses = oppGuesses(g, i), oppCfg = battleCfgOf(g.players[1-i]), myCfg = battleCfgOf(p), seen = new Map();
  for (const perm of perms) for (const recFront of (a.recs ? [true,false] : [true])) for (const armFirst of (a.arm ? [true,false] : [false])){
    const deck = assemble(perm, a.recs, a.arm, recFront, armFirst, a.sh, a.gear), key = deckKey(deck);
    if (!seen.has(key)) seen.set(key, {deck, s:scoreDeck(deck, i, myCfg, oppCfg, guesses)});
  }
  return [...seen.values()].sort((x, y) => y.s - x.s).slice(0, 4);
}
function aiMobilizeSeen(g, i, K, depth){
  const rung = g._po ? null : rungFor(g, i);
  if (rung){
    if (rung.random){
      const a = buildArmy(g.players[i]); if (!a.core.length && !a.recs) return [];
      return assemble(shuffle(a.core.slice(), g.rnd), a.recs, a.arm, g.rnd() < 0.5, g.rnd() < 0.5, a.sh, a.gear);
    }
    if (g.rec) g._mobLevel = rung.label;
    // a looser level sometimes fields its 2nd or 3rd best order (a misjudgment, not a random blunder)
    if (rung.sharp < 1){ const list = rankedMobilize(g, i, K, rungDepth(rung)); if (list.length) return softPick(list, rung.sharp, 0.25, g.rnd).deck; }
    return aiMobilizeAt(g, i, K, rungDepth(rung));
  }
  return aiMobilizeAt(g, i, K, depth);
}
// Recruit and Armament miracles are single use, so the AI holds them unless spending them now is worth it: it plans
// its best army with and without them, test-battles both against its guesses at the opponent, and spends them only
// when the gain in this battle's win chance, times how much this battle decides the game, beats G.mu (learned in
// training). So it saves them for battles it would otherwise lose and that matter: a match point, a must-win.
function battleStakes(g, i){
  if (BATTLE_VM && BATTLE_VM[i]) return Math.max(0, BATTLE_VM[i].w - BATTLE_VM[i].l);   // played out
  const p = g.players[i], o = g.players[1-i], q = battleOdds(g, i), cath = !!p.city.Cathedral;
  return Math.max(0, gameWinChance(p.score + 1, total(o), cath, q, g.target) - gameWinChance(p.score, total(o) + 1, cath, q, g.target));
}
function mobilizeWithMiracles(g, i, plan){
  const p = g.players[i];
  if (!mirHeld(p, 'rec') && !mirHeld(p, 'arm') && !mirHeld(p, 'tr')) return plan();
  p._noMir = true; let without; try{ without = plan(); } finally { delete p._noMir; }
  const withM = plan();
  if (!withM || !withM.length) return without;
  if (!without || !without.length) return withM;
  const G = p.genome || baseGenome(), opp = g.players[1-i];
  const guesses = oppGuesses(g, i), myCfg = battleCfgOf(p), oppCfg = battleCfgOf(opp);
  if (!guesses.length) return without;
  // played out: spending and keeping are each judged by the game-win chance that follows, with the miracles used up
  // in the first case and still in hand in the second, so a miracle is saved exactly when keeping it is worth more
  if (BATTLE_VM && (BATTLE_VM.po || BATTLE_VM.myopic)){
    const seed0 = g._poSeed; g._poSeed = Math.floor(g.rnd() * 2147483647);
    try{
      const evp = d => {
        const V = BATTLE_VM.myopic ? BATTLE_VM[i] : outcomeValues(g, i, BATTLE_VM.po, i === 0 ? [d, guesses[0]] : [guesses[0], d]);
        let s = 0;
        for (const gd of guesses){
          const cfgs = [{...myCfg, units:d}, {...oppCfg, units:gd}]; if (i === 1) cfgs.reverse();
          const w = runBattle(cfgs, false).result.w; s += w === i ? V.w : w < 0 ? V.t : V.l;
        }
        return s / guesses.length;
      };
      const a = evp(withM), b = evp(without);
      g.mirDecide = g.mirDecide || [];
      g.mirDecide.push({i, round:g.round, withMiracles:+a.toFixed(3), keepingThem:+b.toFixed(3), spend:a > b});
      return a > b ? withM : without;
    } finally { if (seed0 == null) delete g._poSeed; else g._poSeed = seed0; }
  }
  const ev = d => { let sum = 0; for (const gd of guesses) for (let k = 0; k < 3; k++) sum += battleScore(d, gd, i, myCfg, oppCfg); return sum / (guesses.length * 3); };
  const gain = ev(withM) - ev(without), stakes = battleStakes(g, i);
  // with played-out values, ev() is already game-win chance (and keeping a miracle has worth in later rounds, which
  // the playouts don't see yet), so the bar G.mu stays as the price of using it up
  const spend = (BATTLE_VM ? gain : gain * stakes) > (G.mu ?? 0.06);
  g.mirDecide = g.mirDecide || [];
  g.mirDecide.push({i, round:g.round, gain:+gain.toFixed(3), stakes:+stakes.toFixed(3), spend});
  return spend ? withM : without;
}
function aiMobilizeAt(g, i, K, depth){
  const D = typeof depth === 'object' && depth ? depth : (depth ? DEPTH.play : null);
  if (D && D.search && (D.search.po || D.search.myopic) && !BATTLE_VM){
    BATTLE_VM = mobilizeValues(g, g.players[i].genome || baseGenome(), D);
    try{ return mobilizeWithMiracles(g, i, () => aiMobilizePlan(g, i, K, depth)); } finally { BATTLE_VM = null; }
  }
  return mobilizeWithMiracles(g, i, () => aiMobilizePlan(g, i, K, depth));
}
function aiMobilizePlan(g, i, K, depth){
  const D = typeof depth === 'object' && depth ? depth : (depth ? DEPTH.play : null);
  if (D) return deepMobilize(g, i, D);
  const p = g.players[i], a = buildArmy(p);
  if (!a.core.length && !a.recs) return [];
  const perms = [a.core.slice(), a.core.slice().reverse()];
  for (let k = 0; k < K; k++) perms.push(shuffle(a.core.slice(), g.rnd));
  const guesses = oppGuesses(g, i), opp = g.players[1-i];
  const oppCfg = battleCfgOf(opp), myCfg = battleCfgOf(p);
  let best = null, bs = -Infinity;
  for (const perm of perms){
    for (const recFront of (a.recs ? [true,false] : [true])){
      for (const armFirst of (a.arm ? [true,false] : [false])){
        const deck = assemble(perm, a.recs, a.arm, recFront, armFirst, a.sh, a.gear);
        const s2 = scoreDeck(deck, i, myCfg, oppCfg, guesses);
        if (s2 > bs){ bs = s2; best = deck; }
      }
    }
  }
  return best;
}
// one full round with both players automated (used for training / sims)
function autoRound(g, K, depth){
  startShop(g);
  for (let guard = 0; g.phase === 'shop' && guard < 60; guard++) aiShopTurn(g, cur(g), depth);
  if (g.phase === 'shop'){ g.passed = [true,true]; endShop(g); }
  const decks = [0,1].map(i => aiMobilize(g, i, K, depth) || []);
  for (const i of [0,1]) setDeck(g, i, decks[i]);
  finishMobilize(g);
  return doBattle(g, false);
}
// Ratings from head-to-head results: logistic (Elo) model fit by gradient ascent, one virtual draw per pair
// so lopsided pairs stay finite. results: [{a, b, wa, wb, d}]; rung 0 is pinned at 400.
function fitElo(results, n){
  const r = new Array(n).fill(0), LN = Math.LN10 / 400;
  for (let it = 0; it < 4000; it++){
    const grad = new Array(n).fill(0), hess = new Array(n).fill(1e-9);
    for (const x of results){
      const games = x.wa + x.wb + x.d + 1, sa = x.wa + 0.5 * x.d + 0.5;
      const e = 1 / (1 + Math.pow(10, (r[x.b] - r[x.a]) / 400));
      grad[x.a] += sa - games * e; grad[x.b] -= sa - games * e;
      const h = games * e * (1 - e) * LN; hess[x.a] += h; hess[x.b] += h;
    }
    let move = 0;
    for (let k = 1; k < n; k++){ const st = Math.max(-60, Math.min(60, grad[k] / hess[k])); r[k] += st; move = Math.max(move, Math.abs(st)); }
    if (move < 0.01) break;
  }
  return r.map(v => Math.round(400 + v - r[0]));
}
const stableKey = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).sort().reduce((o, kk) => (o[kk] = x[kk], o), {}) : x);
// one game between two rungs (indices into RUNGS), both using the same genome; returns the winner (0, 1, or -1 for a draw)
function ladderGame(a, b, genome, seed){
  const g = newGame({genomes:[genome, genome], rnd: seed != null ? mulberry32(seed) : undefined});
  g.players[0].skill = {lo:RUNGS[a]}; g.players[1].skill = {lo:RUNGS[b]};
  while (!g.over) autoRound(g, 24, null);
  return g.winner;
}
function playAIGame(Ga, Gb, K, depth){
  const g = newGame({genomes:[Ga, Gb]});
  while (!g.over) autoRound(g, K, depth);
  return g;
}

/* ===================== COMBO (SYNERGY) TABLE ===================== */
// syn['A>B'] = how much better a deck does with A directly in front of B than you'd expect from A and B separately
// (interaction contrast against a Strong Villager reference, measured on the same random battles for every pair).
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function synPool(){ return Object.keys(DEFS).filter(x => !DEFS[x].token && x !== 'Jester' && DEFS[x].n > 0); }
function synContexts(N, seed){
  const r = mulberry32(seed), pool = synPool();
  const deck = s => shuffle(pool.slice(), r).slice(0, s).map(x => ({name:x, copies:1 + (r() < 0.3 ? 1 : 0)}));
  return Array.from({length:N}, () => ({mine:deck(3), en:deck(5), at:Math.floor(r() * 4)}));
}
function pairWin(a, b, ctx){
  let w = 0;
  for (const c of ctx){
    const d = c.mine.filter(u => u.name !== a && u.name !== b);
    d.splice(Math.min(c.at, d.length), 0, {name:a, copies:1}, {name:b, copies:1});
    const r = runBattle([{units:d}, {units:c.en}], false).result.w;
    w += scoreFor(r, 0);
  }
  return w / ctx.length;
}
function synRows(as, N, seed){
  const ctx = synContexts(N, seed), names = synPool(), V = 'Strong Villager';
  const vv = pairWin(V, V, ctx), vb = {};
  for (const b of names) vb[b] = pairWin(V, b, ctx);
  const out = {};
  for (const a of as){
    const av = pairWin(a, V, ctx);
    for (const b of names){
      if (a === b) continue;
      const s = pairWin(a, b, ctx) - av - vb[b] + vv;
      if (Math.abs(s) >= 0.03) out[a + '>' + b] = +s.toFixed(3);
    }
  }
  return out;
}
const SYN_DEFAULT = {"Hired Blade>Slinger":0.032,"Hired Blade>Marksman":0.086,"Hired Blade>Studious Squire":0.051,"Hired Blade>Barber-Surgeon":0.074,"Hired Blade>Musketeer":0.032,"Hired Blade>White Knight":0.099,"Hired Blade>Scholar":0.052,"Pikeman>Dark Knight":-0.055,"Pikeman>White Knight":0.066,"Pikeman>Scholar":-0.041,"Slinger>Pigeon Hunter":0.076,"Slinger>Musketeer":0.035,"Slinger>Scholar":-0.043,"Slinger>Halberd Knight":0.031,"Dutiful Squire>Pigeon Hunter":0.078,"Dutiful Squire>Scholar":-0.048,"Conscripted Farmhand>Scholar":-0.038,"Cowardly Squire>Dutiful Squire":0.033,"Cowardly Squire>Marksman":0.087,"Cowardly Squire>Studious Squire":0.057,"Cowardly Squire>Musketeer":0.041,"Cowardly Squire>Scholar":-0.055,"Assassin>Studious Squire":0.034,"Assassin>Barber-Surgeon":0.057,"Assassin>White Knight":0.099,"Assassin>Halberd Knight":0.054,"Marksman>Barber-Surgeon":0.112,"Marksman>Pigeon Hunter":0.179,"Marksman>White Knight":0.033,"Marksman>Man-at-arms":0.031,"Marksman>Halberd Knight":0.034,"Studious Squire>Marksman":0.037,"Studious Squire>Barber-Surgeon":0.068,"Studious Squire>Pigeon Hunter":0.103,"Studious Squire>Cannon":0.04,"Studious Squire>Grave-Robber":0.039,"Studious Squire>White Knight":0.05,"Studious Squire>Scholar":-0.037,"Aging Master>Hired Blade":0.047,"Aging Master>Pikeman":-0.052,"Aging Master>Conscripted Farmhand":-0.053,"Aging Master>Studious Squire":0.052,"Aging Master>Barber-Surgeon":-0.042,"Aging Master>Pigeon Hunter":0.133,"Aging Master>Brawler":0.255,"Aging Master>Fencer":0.062,"Aging Master>Dark Knight":0.043,"Aging Master>Knight":-0.049,"Aging Master>Cannon":0.038,"Aging Master>Lancer":0.165,"Aging Master>White Knight":0.117,"Aging Master>Executioner":-0.067,"Aging Master>Scholar":0.163,"Aging Master>Man-at-arms":0.114,"Aging Master>Halberd Knight":0.088,"Aging Master>Armored Knight":0.047,"Barber-Surgeon>Aging Master":0.035,"Barber-Surgeon>Pigeon Hunter":0.107,"Barber-Surgeon>Scholar":-0.035,"Pigeon Hunter>Marksman":0.048,"Pigeon Hunter>Studious Squire":0.039,"Pigeon Hunter>Barber-Surgeon":0.076,"Pigeon Hunter>Musketeer":0.031,"Pigeon Hunter>White Knight":0.068,"Brawler>Dutiful Squire":0.059,"Brawler>Marksman":0.05,"Brawler>Studious Squire":0.03,"Brawler>Barber-Surgeon":0.061,"Brawler>Musketeer":0.034,"Brawler>White Knight":0.057,"Brawler>Scholar":0.161,"Fencer>Slinger":0.033,"Fencer>Assassin":0.037,"Fencer>Marksman":0.059,"Fencer>Studious Squire":0.038,"Fencer>Barber-Surgeon":0.071,"Fencer>Brawler":0.034,"Fencer>Musketeer":0.047,"Fencer>White Knight":0.091,"Fencer>Scholar":0.04,"Fencer>Man-at-arms":0.031,"Fencer>Halberd Knight":0.047,"Sleepy Guard>Scholar":-0.031,"Musketeer>Barber-Surgeon":0.079,"Musketeer>Pigeon Hunter":0.138,"Musketeer>Cannon":0.047,"Musketeer>White Knight":0.033,"Musketeer>Scholar":-0.078,"Musketeer>Man-at-arms":0.03,"Musketeer>Halberd Knight":0.047,"Dark Knight>Pikeman":-0.063,"Dark Knight>Marksman":0.087,"Dark Knight>Studious Squire":0.045,"Dark Knight>Barber-Surgeon":0.046,"Dark Knight>Pigeon Hunter":-0.083,"Dark Knight>Brawler":0.038,"Dark Knight>Musketeer":0.051,"Dark Knight>White Knight":0.087,"Dark Knight>Recruiter":-0.072,"Dark Knight>Executioner":-0.075,"Dark Knight>Scholar":-0.068,"Knight>Marksman":0.039,"Knight>Studious Squire":0.033,"Knight>Barber-Surgeon":0.036,"Knight>Pigeon Hunter":0.038,"Knight>Grave-Robber":0.033,"Knight>White Knight":0.035,"Knight>Scholar":-0.032,"Cannon>Barber-Surgeon":0.106,"Cannon>Pigeon Hunter":0.171,"Cannon>Musketeer":0.043,"Cannon>Scholar":-0.034,"Cannon>Halberd Knight":0.036,"Lancer>Dutiful Squire":0.068,"Lancer>Marksman":0.051,"Lancer>Studious Squire":0.031,"Lancer>Barber-Surgeon":0.122,"Lancer>Musketeer":0.035,"Lancer>White Knight":0.137,"Lancer>Scholar":0.117,"Lancer>Halberd Knight":0.033,"White Knight>Marksman":0.048,"White Knight>Studious Squire":0.03,"White Knight>Barber-Surgeon":0.135,"White Knight>Pigeon Hunter":0.118,"White Knight>Musketeer":0.065,"White Knight>Scholar":0.03,"White Knight>Man-at-arms":0.033,"White Knight>Halberd Knight":0.048,"Recruiter>Slinger":0.062,"Recruiter>Dutiful Squire":0.035,"Recruiter>Sleepy Guard":0.038,"Recruiter>Musketeer":0.117,"Recruiter>Cannon":0.149,"Recruiter>Scholar":-0.044,"Executioner>Dark Knight":-0.068,"Executioner>White Knight":0.063,"Executioner>Scholar":-0.052,"Scholar>Hired Blade":0.058,"Scholar>Pikeman":-0.031,"Scholar>Conscripted Farmhand":-0.032,"Scholar>Cowardly Squire":-0.032,"Scholar>Aging Master":0.044,"Scholar>Pigeon Hunter":0.267,"Scholar>Brawler":0.16,"Scholar>Fencer":0.039,"Scholar>Musketeer":0.047,"Scholar>Dark Knight":0.056,"Scholar>Knight":-0.033,"Scholar>Cannon":0.065,"Scholar>Lancer":0.138,"Scholar>White Knight":0.031,"Scholar>Executioner":-0.043,"Scholar>Man-at-arms":0.093,"Scholar>Halberd Knight":0.078,"Man-at-arms>Marksman":0.146,"Man-at-arms>Studious Squire":0.09,"Man-at-arms>Barber-Surgeon":0.121,"Man-at-arms>Pigeon Hunter":0.154,"Man-at-arms>Fencer":0.042,"Man-at-arms>Musketeer":0.063,"Man-at-arms>Dark Knight":-0.073,"Man-at-arms>Cannon":0.041,"Man-at-arms>White Knight":0.087,"Man-at-arms>Scholar":0.062,"Man-at-arms>Halberd Knight":0.057,"Halberd Knight>Slinger":0.045,"Halberd Knight>Marksman":0.076,"Halberd Knight>Studious Squire":0.047,"Halberd Knight>Barber-Surgeon":0.117,"Halberd Knight>Pigeon Hunter":0.101,"Halberd Knight>Musketeer":0.053,"Halberd Knight>Cannon":0.038,"Halberd Knight>White Knight":0.115,"Halberd Knight>Scholar":-0.035,"Armored Knight>Slinger":0.038,"Armored Knight>Dutiful Squire":0.058,"Armored Knight>Marksman":0.094,"Armored Knight>Studious Squire":0.073,"Armored Knight>Barber-Surgeon":0.126,"Armored Knight>Dark Knight":0.037,"Armored Knight>White Knight":0.076};
let SYN = SYN_DEFAULT;   // replaced by a recomputed table when card numbers change
function comboBonus(p, name){
  // In a line a unit has one neighbour in front and one behind, so it can use at most two pairings, with different
  // partners: the best "partner in front of me" plus the best "me in front of partner". Bad pairings are left out,
  // since Mobilize can keep those units apart.
  let i1 = 0, i1n = null, i2 = 0, o1 = 0, o1n = null, o2 = 0;   // top two partners on each side
  for (const y in p.hand){
    if (y === name || exemptUnit(y)) continue;
    const a = Math.max(0, SYN[y + '>' + name] || 0), b = Math.max(0, SYN[name + '>' + y] || 0);
    if (a > i1){ i2 = i1; i1 = a; i1n = y; } else if (a > i2) i2 = a;
    if (b > o1){ o2 = o1; o1 = b; o1n = y; } else if (b > o2) o2 = b;
  }
  return i1n !== null && i1n === o1n ? Math.max(i1 + o2, i2 + o1) : i1 + o1;
}

/* ===================== LEARNING ===================== */
function gauss(rnd){ let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v); }
const GKEYS = {kp:[0,0.6,0.03], shr:[0,1,0.05], tie:[0,0.3,0.02], rob:[0,0.6,0.04], s:[0.2,3,0.15], e:[0,8,0.4], m:[0.3,2,0.1], thresh:[-3,4,0.4], slot:[0,2,0.15], pair:[-1,3,0.3], cath:[0,3,0.3], read:[0,1,0.1], deny:[0,1.5,0.12], combo:[0,3,0.2], save:[0,1.5,0.1], hb:[0,7,0.35], bmk:[0,3,0.15], lu2:[0,1.5,0.1], omk:[0,3,0.2], mir:[0,3,0.15], mu:[0,0.4,0.03], mpat:[0,2,0.12]};
// Fold a legacy income-horizon weight (hk) into e and hb: same AI, one fewer knob
function foldHK(G){ if (!G || G.hk == null) return G; const {hk, ...r} = G; return {...r, e:(G.e ?? 0.5) * hk, hb:(G.hb ?? 0.5) * hk}; }
function mutate(G, rnd, strength){
  G = foldHK(G);
  strength = strength || 1;
  const n = {...G, bias:{...G.bias}};
  for (const k in GKEYS){ const [lo, hi, sd] = GKEYS[k]; if (n[k] === undefined) n[k] = baseGenome()[k]; if (rnd() < 0.5) n[k] = Math.max(lo, Math.min(hi, n[k] + gauss(rnd) * sd * strength)); }
  for (const c of OPINION_KEYS) if (rnd() < 0.12) n.bias[c] = Math.max(-6, Math.min(6, (n.bias[c] || 0) + gauss(rnd) * 0.8 * strength));
  return n;
}
/* ===================== TRAINING: evolution strategies ===================== */
// The trainer tunes the AI's weights as one vector, each weight scaled to 0..1 by its range in GKEYS, so a single
// step size fits them all. Card opinions (bias) are learned separately, from the games' card stats (biasStep).
// Weights trained. With thinking AIs every real decision is a game-win comparison, and only three weights take part:
// rob (average vs worst case over their orders), read and omk (trust in, and learning of, the read of their order).
// The rest only shape the imagined players in playouts, where a game result says little about them, and several
// share one scale (strength, economy, money, the pass bar and card opinions can all double without changing a choice).
const TKEYS_ALL = Object.keys(GKEYS).filter(k => !['deny', 'save', 'mpat'].includes(k));   // the formula levels
const TKEYS_SEARCH = ['rob', 'read', 'omk'];
let TKEYS = TKEYS_ALL;
function toVec(G){ G = foldHK(G); return TKEYS.map(k => { const [lo, hi] = GKEYS[k]; const v = G[k] ?? baseGenome()[k]; return Math.max(0, Math.min(1, (v - lo) / (hi - lo))); }); }
function fromVec(x, like){
  like = foldHK(like);
  const G = {...(like || baseGenome()), bias:{...((like && like.bias) || {})}};
  TKEYS.forEach((k, j) => { const [lo, hi] = GKEYS[k]; G[k] = lo + Math.max(0, Math.min(1, x[j])) * (hi - lo); });
  return G;
}
// One seed, played twice with the seats swapped: both AIs get the same deck order and the same first-turn roll,
// so that luck cancels out of the comparison. Returns A's score (0..1). st, if given, collects card stats.
function pairGames(A, B, seed, K, depth, st){
  let s = 0;
  for (const sw of [0,1]){
    const g = newGame({genomes: sw ? [B, A] : [A, B], rnd: mulberry32(seed)});
    while (!g.over) autoRound(g, K, depth);
    if (st) recordStats(st, g);
    s += scoreFor(g.winner, sw);
  }
  return s / 2;
}
// Antithetic evolution strategies. Each direction eps was tested as (x + sigma*eps) against (x - sigma*eps) on the
// same seeds; f is the plus side's score. (f - 0.5) says which way along eps is better, and averaging over all the
// directions estimates the uphill direction while using every game played.
function esGrad(dirs, sigma){
  const g = dirs[0].eps.map(() => 0);
  for (const d of dirs) d.eps.forEach((e, j) => { g[j] += (d.f - 0.5) * e / (dirs.length * sigma); });
  return g;
}
// Move along the (momentum-averaged) estimate, capped so one unlucky batch can't throw the weights far.
function esApply(x, g, lr, maxStep){
  const len = Math.sqrt(g.reduce((a, v) => a + v * v, 0)) * lr, k = len > maxStep ? maxStep / len : 1;
  return x.map((v, j) => Math.max(0, Math.min(1, v + lr * k * g[j])));
}
// Settings for one training step: directions tested, seed pairs per direction, probe size, step size, momentum,
// and how often card opinions update and the checkpoint test runs (in steps).
const ES = {dirs:6, pairs:3, sigma:0.1, lr:0.03, maxStep:0.04, mom:0.8, every:10, gatePairs:200, progPairs:24, progEvery:20, revertBelow:0.46};   // progress check: chart only, so small and every 20 steps
/* ---------- Safety check by SPRT (sequential probability ratio test, as Stockfish's Fishtest uses) ----------
   Instead of a fixed number of game pairs, the check plays pairs in batches and stops as soon as the evidence is
   clear. It weighs two hypotheses about the AI's true score against the opponent: mu0 ("clearly worse", roll back)
   and mu1 ("no worse", keep). After each batch it adds up the log-likelihood ratio (normal approximation, with the
   pair-to-pair variance measured from the games themselves) and stops when it crosses either bound. alpha is the
   chance of keeping an AI that is really at mu0; beta, the chance of rolling back one that is really at mu1. If it
   reaches maxPairs undecided, it keeps the AI when the score is above the midpoint. Clear results stop in a few
   dozen pairs; a close call runs about as long as the old fixed check, with known error rates. */
const SPRT = {mu0:0.45, mu1:0.5, alpha:0.05, beta:0.05, minPairs:24, maxPairs:400, varFloor:0.04};
function sprtLLR(xs, R){
  const n = xs.length; if (n < 2) return 0;
  const sum = xs.reduce((a, b) => a + b, 0), m = sum / n;
  const v = Math.max(R.varFloor, xs.reduce((a, x) => a + (x - m) * (x - m), 0) / (n - 1));
  return (R.mu1 - R.mu0) / v * (sum - n * (R.mu0 + R.mu1) / 2);
}
function sprtBounds(R){ return {lo:Math.log(R.beta / (1 - R.alpha)), hi:Math.log((1 - R.beta) / R.alpha)}; }
// Decide from pair scores so far: 'keep', 'revert', or null (keep playing)
function sprtDecide(xs, R){
  const {lo, hi} = sprtBounds(R), llr = sprtLLR(xs, R);
  if (xs.length >= R.minPairs && llr >= hi) return 'keep';
  if (xs.length >= R.minPairs && llr <= lo) return 'revert';
  if (xs.length >= R.maxPairs) return xs.reduce((a, b) => a + b, 0) / xs.length >= (R.mu0 + R.mu1) / 2 ? 'keep' : 'revert';
  return null;
}
/* ---------- Hall of fame ----------
   Every HOF.every steps a passing champion is saved; the last HOF.keep are kept. Each safety check also plays one
   past champion (taking turns through the list), so the AI can't drift into beating only its latest self while
   forgetting how to beat styles it used to handle (rock-paper-scissors cycling). Clearly losing to a past champion
   rolls back like failing the checkpoint test; if the same past champion wins HOF.strikes checks in a row, it was
   simply better, so it becomes the champion again. */
const HOF = {every:50, keep:6, strikes:3};
// Past champions are usually weaker, so this check stops quickly; it only flags a clear loss (scoring around 43%).
const HOF_SPRT = {...SPRT, mu0:0.43};
// how far one check can swing from luck alone (about two standard deviations), in percentage points
const swingPts = pairs => Math.round(100 / Math.sqrt(2 * pairs));
function randDir(n, rnd){ return Array.from({length:n}, () => gauss(rnd)); }
// Card opinions from evidence: for every card bought often enough in the recent games, compare its buyers with
// players who were in the same position (behind, tied, ahead) and nudge the opinion toward that edge, a capped amount
// per update. Every opinion also fades a little toward 0, so a card the AI stopped buying gets tried again and its
// opinion is re-earned rather than stuck. Returns the new bias table.
const BIAS_RULE = {minN:120, rate:4, cap:0.4, lim:4, decay:0.05};
function biasStep(bias, st, R){
  R = {...BIAS_RULE, ...(R || {})};
  const base = st.__base || {}, L = st.__lead || {}, edge = {};
  let tn = 0, ts = 0;
  for (const c of OPINION_KEYS){
    let n = 0, s = 0;
    const lead = L[c] || {};
    for (const z of ['b','t','a']){ const q = lead[z], bq = base[z]; if (!q || !bq || !bq.n) continue; n += q.n; s += q.w - q.n * bq.w / bq.n; }
    if (n >= R.minN){ edge[c] = s / n; tn += n; ts += s; }
  }
  // Players who buy anything tend to beat players who pass (they have more money), so every card looks a little
  // good. Measure each card against the average purchase instead, so opinions rank cards against each other and
  // don't just make the AI spend more.
  const mean = tn ? ts / tn : 0, out = {};
  for (const c of OPINION_KEYS){
    let v = (bias[c] || 0) * (1 - R.decay);
    if (c in edge) v += Math.max(-R.cap, Math.min(R.cap, R.rate * (edge[c] - mean)));
    v = Math.max(-R.lim, Math.min(R.lim, v));
    if (Math.abs(v) >= 0.01) out[c] = v;
  }
  return out;
}
/* ---------- Learned pairings (contextual card opinions) ----------
   A pairing is an opinion about buying a card given one unit already in play: one the buyer owns ('Cannon+Recruiter',
   synergy) or one the opponent is known to own ('Cannon~Man-at-arms', counter). Evidence is every purchase in the
   AI's games. For each pairing it compares how those buyers finished with what you'd expect from the card alone and
   the unit alone (in the same score position), so a strong unit doesn't make every card bought next to it look good.
   An opinion only forms once the evidence is substantial: at least minN purchases AND a gap of at least z standard
   errors (z = 3 keeps chance findings rare across the ~2,000 pairings tested). Evidence fades slowly (decay per
   update) so it tracks the AI as it changes. */
const CTX_RULE = {minN:400, z:3, rate:4, cap:1, fade:0.05, decay:0.03, total:2.5};
function ctxEdges(ev){
  const out = {}, rt = (k, z) => { const q = ev[k] && ev[k][z]; return q && q.n >= 1 ? q.w / q.n : null; };
  for (const k in ev){
    const m = /^(.+?)([+~@])(.+)$/.exec(k); if (!m || !m[1]) continue;
    const [, c, sep, y] = m;
    let n = 0, s = 0, v = 0;
    for (const z of ['b','t','a']){
      const q = ev[k][z]; if (!q || !q.n) continue;
      const rc = rt(c, z), ry = rt(sep + y, z), ra = rt('*', z);
      if (rc == null || ry == null || ra == null) continue;
      const e = Math.max(0.02, Math.min(0.98, rc + ry - ra));
      n += q.n; s += q.w - q.n * e; v += q.n * e * (1 - e);
    }
    if (n > 0) out[k] = {c, y, vs:sep === '~', sit:sep === '@', n, edge:s / n, z:v > 0 ? s / Math.sqrt(v) : 0};
  }
  return out;
}
function ctxStep(prev, ev, R){
  const R0 = {...CTX_RULE, ...(R || {})};
  const E = ctxEdges(ev || {}), out = {};
  for (const k of new Set([...Object.keys(E), ...Object.keys(prev || {})])){
    const e = E[k], old = (prev || {})[k] || 0, R = k.includes('@') ? {...R0, ...SIT_RULE} : R0;
    let v;
    if (e && e.n >= R.minN && Math.abs(e.z) >= R.z) v = Math.max(-R.cap, Math.min(R.cap, R.rate * e.edge));   // substantial: set from the evidence
    else if (e && e.n >= R.minN) v = old * 0.5;            // plenty of games, but the gap isn't clear any more: back off
    else v = old * (1 - R.fade);                           // not enough recent games: keep it, fading slowly
    if (Math.abs(v) >= 0.02) out[k] = +v.toFixed(3);
  }
  return out;
}
// let old evidence count a little less each update; drop what has faded away
function ctxDecay(ev, d){
  const out = {};
  for (const k in ev){ const e = {}; for (const z in ev[k]){ const q = ev[k][z], n = q.n * (1 - d); if (n >= 0.5) e[z] = {n:+n.toFixed(2), w:+(q.w * (1 - d)).toFixed(2)}; } if (Object.keys(e).length) out[k] = e; }
  return out;
}
/* ---------- Situational opinions ----------
   A card's worth depends on the moment, so its opinion is adjusted for each fact about the situation it's bought in:
   how far into the game it is (shops likely left), the score, the money on hand, and whose income is higher.
   Learned the same way as pairings: buyers in that situation are compared with what the card's usual result and the
   situation's usual result predict, and a correction only forms on clear evidence. The card's final opinion is its
   starting value plus the corrections for every fact that holds right now, so it changes as the game does. */
const SIT_RULE = {minN:300, z:2.5};
const SIT_LABEL = {'st:early':'early in the game', 'st:mid':'mid-game', 'st:late':'late in the game',
  'sc:b':'when behind on points', 'sc:t':'when tied on points', 'sc:a':'when ahead on points',
  '$:lo':'with $0–1 on hand', '$:mid':'with $2–3 on hand', '$:hi':'with $4 or more on hand',
  'in:b':'when your income is lower', 'in:e':'with equal income', 'in:a':'when your income is higher'};
function sitTags(g, i){
  const p = g.players[i], o = g.players[1-i];
  const sl = expShops(g, i), lead = total(p) - total(o), di = income(p) - income(o), m = p.money;
  return ['st:' + (sl >= 2.5 ? 'early' : sl >= 1.5 ? 'mid' : 'late'), 'sc:' + (lead < 0 ? 'b' : lead > 0 ? 'a' : 't'),
          '$:' + (m <= 1 ? 'lo' : m <= 3 ? 'mid' : 'hi'), 'in:' + (di < 0 ? 'b' : di > 0 ? 'a' : 'e')];
}
function sitBonus(G, g, i, name){
  const T = G.ctx; if (!T) return 0;
  let s = 0;
  for (const t of sitTags(g, i)) s += T[name + '@' + t] || 0;
  return Math.max(-CTX_RULE.total, Math.min(CTX_RULE.total, s));
}
// the learned pairings that apply to buying `name` for player p, given the enemy hand p can see
function ctxBonus(G, p, opp, name){
  const T = G.ctx; if (!T) return 0;
  let s = 0;
  for (const y of ctxUnits(p.hand)) if (y !== name) s += T[name + '+' + y] || 0;
  for (const y of ctxUnits(opp.hand)) s += T[name + '~' + y] || 0;
  return Math.max(-CTX_RULE.total, Math.min(CTX_RULE.total, s));
}
function crossover(A, B, rnd){
  A = foldHK(A); B = foldHK(B);
  const n = {bias:{}, ctx:A.ctx || B.ctx || {}};
  for (const k in GKEYS) n[k] = (rnd() < 0.5 ? A[k] : B[k]) ?? baseGenome()[k];
  for (const c of OPINION_KEYS){ const v = rnd() < 0.5 ? A.bias[c] : B.bias[c]; if (v) n.bias[c] = v; }
  return n;
}
function recordStats(stats, g){
  for (const i of [0,1]){
    const won = scoreFor(g.winner, i);
    for (const c of new Set(g.players[i].bought)){
      const s = stats[c] || (stats[c] = {n:0, w:0}); s.n++; s.w += won;
    }
  }
  stats.__games = (stats.__games || 0) + 1;
  // miracles count as bought by whoever bought the card covering them (once per game, like cards)
  for (const i of [0,1]) for (const n of new Set((g.mirGot || [[], []])[i])){ const s = stats[n] || (stats[n] = {n:0, w:0}); s.n++; s.w += scoreFor(g.winner, i); }
  // miracles: how often each one was shown, bought, and how its buyer did
  if (g.miracles){
    const M = stats.__mir || (stats.__mir = {});
    M.__games = (M.__games || 0) + 1;
    for (const n in g.mirShown || {}){ const q = M[n] || (M[n] = {sh:0, n:0, w:0}); q.sh += g.mirShown[n]; }
    for (const i of [0,1]) for (const n of (g.mirGot || [[], []])[i]){ const q = M[n] || (M[n] = {sh:0, n:0, w:0}); q.n++; q.w += scoreFor(g.winner, i); }
  }
  // first-turn advantage: result for whoever shopped first in round 1 (draws count half)
  if (g.first1 === 0 || g.first1 === 1){
    const F = stats.__first || (stats.__first = {n:0, w:0, d:0, rounds:0});
    F.n++; F.rounds += g.round;
    if (g.winner === -1){ F.d++; F.w += 0.5; } else if (g.winner === g.first1) F.w++;
  }
  // sales: how many copies of each card were sold, and whether the seller went on to win
  if (g.sold){ const S = stats.__sold || (stats.__sold = {});
    for (const i of [0,1]) for (const c of g.sold[i] || []){ const s = S[c] || (S[c] = {n:0, w:0}); s.n++; s.w += scoreFor(g.winner, i); } }
  // offers: each time a card was available to a player in a shop phase, did they take it, and did they win?
  const won = i => scoreFor(g.winner, i);
  const bucket = lead => lead < 0 ? 'b' : lead > 0 ? 'a' : 't';
  const O = stats.__offer || (stats.__offer = {}), L = stats.__lead || (stats.__lead = {}), B = stats.__base || (stats.__base = {});
  for (const s of (g.states || [])){ const q = B[bucket(s.lead)] || (B[bucket(s.lead)] = {n:0, w:0}); q.n++; q.w += won(s.i); }
  for (const o of (g.offers || [])){
    const r = won(o.i), q = O[o.name] || (O[o.name] = {bn:0, bw:0, pn:0, pw:0});
    if (o.bought){ q.bn++; q.bw += r;
      const l = L[o.name] || (L[o.name] = {}), z = l[bucket(o.lead)] || (l[bucket(o.lead)] = {n:0, w:0}); z.n++; z.w += r; }
    else { q.pn++; q.pw += r; }
  }
  // buy context, for learned pairings: every purchase is counted under the card ('Cannon'), under each unit its
  // buyer owned ('Cannon+Recruiter') and each enemy unit it could see ('Cannon~Man-at-arms'), plus the matching
  // baselines for any purchase ('*', '+Recruiter', '~Man-at-arms'), split by score position. ctxStep compares them.
  // (learned pairings are retired, so their buy-context evidence is no longer collected)
  // battle-level pair stats: units fielded in the same deck, and units directly in front of another
  const bump = (tbl, k, r) => { const s = tbl[k] || (tbl[k] = {n:0, w:0}); s.n++; s.w += r; };
  const P = stats.__pairs || (stats.__pairs = {}), A = stats.__adj || (stats.__adj = {}), U = stats.__units || (stats.__units = {});
  const V = stats.__vs || (stats.__vs = {});
  for (const b of (g.battles || [])){
    for (const i of [0,1]){
      const r = scoreFor(b.w, i), d = b.d[i];
      // buildings in the city count as part of that side's deck for pairs and counters (not for front → behind)
      const cit = (b.c && b.c[i]) || [], citO = (b.c && b.c[1-i]) || [];
      for (const n of new Set(d.concat(cit))) bump(U, n, r);
      const names = [...new Set(d.concat(cit))].sort();
      for (let x = 0; x < names.length; x++) for (let y = x + 1; y < names.length; y++) bump(P, names[x] + '|' + names[y], r);
      for (let x = 0; x + 1 < d.length; x++) bump(A, d[x] + '>' + d[x+1], r);
      // counters: every card on this side against every card on the enemy side
      const mine = [...new Set(d.concat(cit))], theirs = [...new Set(b.d[1-i].concat(citO))];
      for (const m of mine) for (const t of theirs) bump(V, m + '~' + t, r);
    }
  }
}

