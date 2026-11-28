/* Oasis offline support.
   Code and pages: network first, so an online player always gets the newest
   version; the cached copy is only used when the network is missing or slow.
   Card art and fonts: cache first (they rarely change).
   Bump VERSION whenever files are added, removed or renamed. */
const VERSION = 'oasis-v11-bazaar-midstroke-blot';
const CORE = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "cubes.js",
 "js/vendor/peerjs.min.js",
 "art/banner.png",
 "art/tabmask.svg",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "icons/favicon-32.png",
 "css/01-battle-card.css",
 "css/02-board-settings.css",
 "css/03-main.css",
 "css/04-desktop-art.css",
 "css/05-fixes.css",
 "css/06-mobile-crop.css",
 "css/07-no-anchor.css",
 "css/08-cards-tab.css",
 "css/09-mobilize.css",
 "css/10-game-menu.css",
 "css/11-rug.css",
 "css/12-mat-shop.css",
 "css/13-bazaar.css",
 "js/art.js",
 "js/board-settings.js",
 "js/cards-tab.js",
 "js/desktop.js",
 "js/engine.js",
 "js/engine/00-runtime-state.js",
 "js/engine/01-card-data.js",
 "js/engine/02-battle.js",
 "js/engine/03-miracles.js",
 "js/engine/04-game.js",
 "js/engine/05-balance.js",
 "js/engine/06-shop.js",
 "js/engine/07-ai.js",
 "js/engine/08-search.js",
 "js/engine/09-learning.js",
 "js/mobile-crop.js",
 "js/names.js",
 "js/rug.js",
 "js/ui/00-core.js",
 "js/ui/01-battle-view.js",
 "js/ui/02-match-recorder-ai-worker.js",
 "js/ui/03-card-motion.js",
 "js/ui/04-online.js",
 "js/ui/05-shop-moves.js",
 "js/ui/06-market-popups-tokens.js",
 "js/ui/07-battle-steps.js",
 "js/ui/08-flips-reminders-banners.js",
 "js/ui/09-play-screen.js",
 "js/ui/10-mobilize.js",
 "js/ui/11-self-play.js",
 "js/ui/12-train-view.js",
 "js/ui/13-stats-view.js",
 "js/ui/14-balance-lab.js",
 "js/ui/15-sync-roles-ratings.js",
 "js/ui/16-new-game.js",
 "js/ui/17-card-peek-tooltips.js",
 "js/ui/18-game-menu.js",
 "js/ui/19-battle-ink.js",
 "js/ui/20-mat-shop.js",
 "js/ui/21-bazaar.js",
 "js/ui/22-shop-coins.js",
 "bazaar-lab.html",
 "css/bazaar-lab.css",
 "js/bazaar-lab.js",
 "art/medallion.png",
 "art/wood0.jpg",
 "art/wood0_b.jpg",
 "art/wood0_r.jpg",
 "art/wood1.jpg",
 "art/wood1_b.jpg",
 "art/wood1_r.jpg",
 "art/wood2.jpg",
 "art/wood2_b.jpg",
 "art/wood2_r.jpg",
 "art/wood3.jpg",
 "art/wood3_b.jpg",
 "art/wood3_r.jpg",
 "art/wood4.jpg",
 "art/wood4_b.jpg",
 "art/wood4_r.jpg",
 "art/wood5.jpg",
 "art/wood5_b.jpg",
 "art/wood5_r.jpg"
];
const ART = [
 "art/rug/bazaar-rug.webp",
 "art/rug/bazaar-sand.webp",
 "art/Altar of Sublimation.webp",
 "art/Ambusher.webp",
 "art/Arsonist.webp",
 "art/Assassin.webp",
 "art/Battle Axe.webp",
 "art/Brawler.webp",
 "art/Corpse Looter.webp",
 "art/Dew Collector.webp",
 "art/Dowser Initiate.webp",
 "art/Dowser Oracle.webp",
 "art/Dowser's Bathhouse.webp",
 "art/Dowser's Blessing.webp",
 "art/Drifter Camp.webp",
 "art/Drifter.webp",
 "art/Executioner.webp",
 "art/Fencer.webp",
 "art/Field Medic.webp",
 "art/Foolish Wanderer.webp",
 "art/Healing Balm.webp",
 "art/Heirloom Blade.webp",
 "art/Infirmary Tent.webp",
 "art/Interceptor.webp",
 "art/Lance.webp",
 "art/Man-at-arms.webp",
 "art/Marksman.webp",
 "art/Might.webp",
 "art/Mobile Workshop.webp",
 "art/Moisture Harvester.webp",
 "art/Mounted Lancer.webp",
 "art/Namaki Fishmonger.webp",
 "art/Namaki Warleader.webp",
 "art/Namaki Warrior.webp",
 "art/Night Watchman.webp",
 "art/Novice Soldier.webp",
 "art/Pack Beasts.webp",
 "art/Pipewalker.webp",
 "art/Poison Oil.webp",
 "art/Ration Line.webp",
 "art/Recruiter.webp",
 "art/Sand Sailor.webp",
 "art/Scholar.webp",
 "art/Scrap Cannon.webp",
 "art/Scrapyard.webp",
 "art/Sellsword.webp",
 "art/Shield.webp",
 "art/Slinger.webp",
 "art/Smithy.webp",
 "art/Spineless Recruit.webp",
 "art/Sump Guardsman.webp",
 "art/Sump Underdog.webp",
 "art/The Bazaar.webp",
 "art/The Fence.webp",
 "art/Training Yard.webp",
 "art/Training.webp",
 "art/Veteran Soldier.webp",
 "art/War Banner.webp",
 "art/War Drums.webp",
 "art/War Horn.webp",
 "art/Wind Farm.webp",
 "art/Zweihander.webp"
];
const NET_TIMEOUT_MS = 4000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

// The page asks for this once it has loaded, so the ~13 MB of card art
// downloads in the background instead of slowing the first visit.
self.addEventListener('message', e => {
  if (e.data === 'warm-art') e.waitUntil(warmArt());
});
async function warmArt() {
  const c = await caches.open(VERSION);
  for (const p of ART) {
    try { if (!(await c.match(p))) { const r = await fetch(p); if (r.ok) await c.put(p, r); } } catch (err) {}
  }
}

function isFont(u) { return u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com'; }

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin === location.origin) {
    if (/\.(webp|png|jpe?g|svg)$/i.test(u.pathname)) e.respondWith(cacheFirst(req));
    else e.respondWith(networkFirst(req));
  } else if (isFont(u)) {
    e.respondWith(cacheFirst(req));
  }
  // Everything else (PeerJS signalling, TURN, etc.) goes straight to the network.
});

async function cacheFirst(req) {
  const c = await caches.open(VERSION);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const r = await fetch(req);
  if (r.ok || r.type === 'opaque') c.put(req, r.clone());
  return r;
}

async function networkFirst(req) {
  const c = await caches.open(VERSION);
  const net = fetch(req, {cache:'no-cache'}).then(r => { if (r.ok) c.put(req, r.clone()); return r; });
  net.catch(() => {});
  try {
    return await Promise.race([
      net,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), NET_TIMEOUT_MS))
    ]);
  } catch (err) {
    const hit = await c.match(req, { ignoreSearch: true }) ||
      (req.mode === 'navigate' ? await c.match('index.html') : null);
    if (hit) return hit;
    return net; // nothing cached yet: keep waiting on the slow network
  }
}
