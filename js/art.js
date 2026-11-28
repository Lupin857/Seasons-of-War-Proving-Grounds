
/* Card art from the Dextrous exports (art/<Oasis name>.webp). A card shows its art only while its numbers still match
   the card sheet; once the Balance Lab changes them, the game draws the card itself so it never shows a wrong number. */
const OASIS_ART = new Set(["Altar of Sublimation", "Ambusher", "Arsonist", "Assassin", "Battle Axe", "Brawler", "Corpse Looter", "Dew Collector", "Dowser Initiate", "Dowser Oracle", "Dowser's Bathhouse", "Dowser's Blessing", "Drifter Camp", "Drifter", "Executioner", "Fencer", "Field Medic", "Foolish Wanderer", "Healing Balm", "Heirloom Blade", "Infirmary Tent", "Interceptor", "Lance", "Man-at-arms", "Marksman", "Might", "Mobile Workshop", "Moisture Harvester", "Mounted Lancer", "Namaki Fishmonger", "Namaki Warleader", "Namaki Warrior", "Night Watchman", "Novice Soldier", "Pack Beasts", "Pipewalker", "Poison Oil", "Ration Line", "Recruiter", "Sand Sailor", "Scholar", "Scrap Cannon", "Scrapyard", "Sellsword", "Shield", "Slinger", "Smithy", "Spineless Recruit", "Sump Guardsman", "Sump Underdog", "The Bazaar", "The Fence", "Training Yard", "Training", "Veteran Soldier", "War Banner", "War Drums", "War Horn", "Wind Farm", "Zweihander"]);
const TOK_ART = {arm:'Might', tr:'Training', sh:'Shield'};
// cards whose rules changed after the Dextrous export: drawn by the game until new art is exported
const OASIS_STALE = new Set();
function artChanged(name, kind){
  const o = kind === 'u' ? ORIG.DEFS[name] : ORIG.BDEFS[name], d = kind === 'u' ? DEFS[name] : BDEFS[name];
  if (!o || !d) return true;
  const keys = kind === 'u' ? ['c', 'p', 'v', 'x', 'm'] : ['c', 'lv'];
  return keys.some(k => JSON.stringify(o[k]) !== JSON.stringify(d[k]));
}
function artURL(name, kind){
  if (!name) return null;
  kind = kind || (DEFS[name] ? 'u' : 'b');
  const n = dispName(name);
  if (!OASIS_ART.has(n) || OASIS_STALE.has(n) || artChanged(name, kind)) return null;
  return 'art/' + encodeURIComponent(n) + '.webp';
}
const tokArtURL = k => TOK_ART[k] ? 'art/' + TOK_ART[k] + '.webp' : null;
const artImg = (url, alt) => `<img class="cart" src="${url}" alt="${esc(alt || '')}" draggable="false">`;
/* Reusing loaded art. A copied <img> (a flying card, the pop-up) is a new picture the browser must decode again, and
   until it has (Safari can take a while) the card shows blank. Instead, a copy gets a canvas painted from a picture
   that is already loaded: painting is immediate, so a copy is never blank. A picture not loaded yet stays an <img>. */
const ART_READY = new Map();
let matchArtPromise;
function prepareMatchArt(){
  if (matchArtPromise) return matchArtPromise;
  const paths = [...OASIS_ART].map(name => 'art/' + encodeURIComponent(name) + '.webp');
  paths.push('art/banner.png', 'art/medallion.png');
  if (!compact()) paths.push('art/rug/bazaar-rug.webp', 'art/rug/bazaar-sand.webp');
  if (compact() && typeof rugSand === 'function' && !rugSand())
    paths.push('art/rug/rug_albedo.webp', 'art/rug/rug_normal.webp');
  matchArtPromise = Promise.all(paths.map(async src => {
    if (artReady(src)) return null;
    const img = new Image();
    img.src = src;
    try{ await img.decode(); ART_READY.set(src, img); return null; }
    catch(e){ return src; }
  })).then(failed => failed.filter(Boolean));
  return matchArtPromise;
}
document.addEventListener('DOMContentLoaded', prepareMatchArt, {once:true});

async function prepareMatchPresentation(){
  const [missing] = await Promise.all([prepareMatchArt(), prepareBattleCubes()]);
  return missing;
}

let matchArtButtonBusy = false;
async function waitForMatchArt(button){
  if (matchArtButtonBusy) return false;
  matchArtButtonBusy = true;
  const label = button.textContent;
  button.disabled = true;
  button.textContent = 'Loading artwork…';
  try{
    const missing = await prepareMatchPresentation();
    if (missing.length) showToast('Some artwork could not load.');
    return true;
  } finally {
    button.disabled = false;
    button.textContent = label;
    matchArtButtonBusy = false;
  }
}
document.addEventListener('load', e => { const t = e.target; if (t && t.tagName === 'IMG' && t.naturalWidth){ const k = t.getAttribute('src'); if (k && k.startsWith('art/')) ART_READY.set(k, t); } }, true);
function artReady(src){
  const im = ART_READY.get(src);
  if (im && im.complete && im.naturalWidth) return im;
  for (const i of document.images) if (i.getAttribute('src') === src && i.complete && i.naturalWidth){ ART_READY.set(src, i); return i; }
  return null;
}
// a canvas copy of a card picture, maxW pixels wide at most (the art's own size when not given); null when not loaded
function artCanvas(img, maxW){
  const src = img.getAttribute('src'), im = src && src.startsWith('art/') ? artReady(src) : null;
  if (!im) return null;
  const w = Math.max(1, Math.round(Math.min(im.naturalWidth, maxW || im.naturalWidth))), h = Math.max(1, Math.round(w * im.naturalHeight / im.naturalWidth));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  try{ const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, w, h); }catch(e){ return null; }
  c.className = img.className; c.dataset.src = src; c.setAttribute('aria-hidden', 'true');
  if (img.getAttribute('style')) c.setAttribute('style', img.getAttribute('style'));
  return c;
}
// swap every card picture inside a copy for its canvas (cssW: about how wide the copy shows, in CSS pixels)
function solidArt(g, cssW){
  if (!g || !g.querySelectorAll) return g;
  const maxW = cssW ? cssW * Math.min(3, window.devicePixelRatio || 1) * 1.3 : 0;
  for (const i of g.querySelectorAll('img')){
    i.loading = 'eager';
    const c = artCanvas(i, maxW); if (c) i.replaceWith(c);
  }
  return g;
}
