
/* Oasis display names. The rules code keeps its internal card names; everything a player reads (cards, logs, rules,
   tooltips) shows the names from the Oasis card sheets. One pass, longest names first, so a new name is never renamed
   again (Field Medic stays Field Medic). */
const OASIS_NAMES = {
  'Conscripted Farmhand':'Dew Collector','Cowardly Squire':'Spineless Recruit','Dutiful Squire':'Dowser Initiate',
  'Hired Blade':'Sellsword','Pikeman':'Sump Underdog','Royal Watchman':'Sump Guardsman','Strong Villager':'Pipewalker',
  'Dark Knight':'Namaki Fishmonger','Grave-Robber':'Corpse Looter','Jester':'Foolish Wanderer','Knight':'Ambusher',
  'Musketeer':'Arsonist','Sleepy Guard':'Night Watchman','Studious Squire':'Novice Soldier','Aging Master':'Veteran Soldier',
  'Pigeon Hunter':'Interceptor','Barber-Surgeon':'Field Medic','Cannon':'Scrap Cannon','Armored Knight':'Namaki Warrior','Monk':'Namaki Warleader',
  'Halberd Knight':'Sand Sailor','Lancer':'Mounted Lancer','Veteran Knight':'Veteran Knight','White Knight':'White Knight',
  'Recruits':'Drifters','Recruit':'Drifter','Fields':'Moisture Harvesters','Field':'Moisture Harvester',
  'Barracks':'Drifter Camp',"Carpenter's Guild":'Mobile Workshop','Muster Hall':'Ration Line','Reserve Encampment':'Pack Beasts',
  'War College':'Scrapyard','Armory':"Dowser's Bathhouse",'Black Market':'The Fence',"Mason's Guild":"Dowser's Blessing",
  'Study':'Training Yard','Training Yard':'Study','Trebuchet':'Ballistae Wagon','Windmill':'Wind Farm','Infirmary':'Infirmary Tent',
  'Altar of Blood':'Altar of Sublimation','an Armament':'a Might token','Armaments':'Might','Armament':'Might',
  'Shield-break':'Shieldbreak','City':'Caravan','city':'Caravan','cities':'Caravans','Buildings':'Supports','buildings':'supports',
  'Building':'Support','building':'support','SOW':'Oasis'
};
const OASIS_RE = new RegExp('\\b(' + Object.keys(OASIS_NAMES).sort((a, b) => b.length - a.length)
  .map(k => k.replace(/[.*+?^${}()|[\]\\']/g, m => '\\' + m)).join('|') + ')\\b', 'g');
const oasisText = t => t && OASIS_RE.test(t) ? (OASIS_RE.lastIndex = 0, t.replace(OASIS_RE, m => OASIS_NAMES[m])) : (OASIS_RE.lastIndex = 0, t);
const dispName = n => OASIS_NAMES[n] && /^[A-Z]/.test(n) ? OASIS_NAMES[n] : n;
(function(){
  const done = new WeakMap();   // node -> the text we wrote, so our own edits are never renamed twice
  const skip = el => el && (el.closest && el.closest('script,style,textarea,input,[data-raw]'));
  function fixText(n){ if (done.get(n) === n.data || skip(n.parentElement)) return; const t = oasisText(n.data); if (t !== n.data) n.data = t; done.set(n, n.data); }
  const doneT = new WeakMap();   // element -> the tooltip we wrote (never rename our own output again)
  function fixEl(el){ if (skip(el)) return; const t = el.getAttribute && el.getAttribute('title'); if (!t || doneT.get(el) === t) return; const k = oasisText(t); doneT.set(el, k); if (k !== t) el.setAttribute('title', k); }
  function walk(root){
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1) return;
    fixEl(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let n = w.nextNode(); n; n = w.nextNode()) n.nodeType === 3 ? fixText(n) : fixEl(n);
  }
  walk(document.body);
  new MutationObserver(ms => { for (const m of ms){
    if (m.type === 'characterData') fixText(m.target);
    else if (m.type === 'attributes') fixEl(m.target);
    else m.addedNodes.forEach(walk);
  } }).observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['title']});
})();
