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
  'Pigeon Hunter':{c:3,n:2,p:[2,4,6],t:'Reveal: Silence enemy Reveal and Charge abilities that happen at the same time.'},
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
