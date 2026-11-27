/* The desktop shop's scenery. Card movements use the market's own flights and geometry. */
const BAZAAR_RUG = 'art/rug/bazaar-rug.webp';
const BAZAAR_DEFAULTS = Object.freeze({
  rugOpen:1845, rugCloseDelay:275, rugClose:2092,
  deckEnterDelay:0, deckEnter:710, discardEnterDelay:762, discardEnter:732,
  dealStart:0, dealSpread:1001, dealGap:166, dealSlide:193, dealTravel:951, dealBackTravel:270,
  dealFlipStart:490, dealFlipDuration:407,
  sweepTravel:605, sweepGap:186, sweepSpread:541,
  exitTravel:1076, leftExitDelay:0, discardExitDelay:0,
  dragPickup:217, dragLean:16, dragSettle:239, dragGrow:8,
  shadowRestOpacity:100, shadowRestBlur:7, shadowRestOffset:4,
  shadowLiftOpacity:50, shadowLiftBlur:10, shadowLiftOffset:22,
  inspectOpen:533, inspectClose:521, inspectWidth:322, inspectDim:520, inspectPanelDelay:145, inspectPanelFade:140,
  pileOpen:553, pileClose:618, pileGap:50,
  pileShift:500, pileRoomOpen:400, pileRoomClose:400,
  pileCardSize:135, pileCardSpacing:79, pileFanAngle:6
});
const BAZAAR_SLIDE = 'cubic-bezier(.25,.65,.35,1)';
const BAZAAR_PILE_LIMITS = {pileCardSize:[65,135], pileCardSpacing:[25,100], pileFanAngle:[0,12]};
let bazaarRugImage, bazaarOpening;
let bazaarTiming = {...BAZAAR_DEFAULTS};

function bazaarShadow(lift){
  const t = bazaarTiming;
  const blend = (rest, raised) => rest + (raised-rest) * lift;
  return {
    opacity:blend(t.shadowRestOpacity, t.shadowLiftOpacity) / 100,
    blur:blend(t.shadowRestBlur, t.shadowLiftBlur),
    offset:blend(t.shadowRestOffset, t.shadowLiftOffset)
  };
}

function bazaarApplyRestShadow(){
  const {opacity, blur, offset} = bazaarShadow(0);
  const style = document.documentElement.style;
  style.setProperty('--bazaar-contact-shadow', `1px ${offset}px ${blur}px rgb(33 18 7 / ${opacity})`);
  style.setProperty('--bazaar-contact-edge', `0 1px 2px rgb(33 18 7 / ${opacity * .6})`);
  style.setProperty('--bazaar-stack-shadow-y', offset+'px');
  style.setProperty('--bazaar-stack-shadow-blur', blur/2+'px');
  style.setProperty('--bazaar-stack-shadow-color', `rgb(33 18 7 / ${opacity})`);
}
bazaarApplyRestShadow();

// The pile supplies a center and angle. The card keeps its printed dimensions.
function bazaarCardPose(pose, card){
  const r = pose.r;
  return {...pose, r:{width:card.width, height:card.height,
    left:r.left+(r.width-card.width)/2, top:r.top+((r.height ?? card.height)-card.height)/2}};
}

function bazaarFlightCard(card){
  card.classList.add('osbazaar-flight');
  card.classList.remove('canbuy');
}

function bazaarDiscardFace(name){
  const kind = DEFS[name] ? 'u' : BDEFS[name] ? 'b' : '';
  return kind ? `<span class="mcard ${kind} osdiscardface">${cardFace(name, kind, 0, true)}</span>` : '';
}

function bazaarPreload(){
  if (bazaarRugImage) return;
  bazaarRugImage = new Image();
  bazaarRugImage.src = BAZAAR_RUG;
}
if (!compact()) bazaarPreload();

function bazaarFitRug(shop){
  const rug = shop.querySelector('.osbazaar');
  if (!rug) return;
  const mat = matTiltOf(), market = matFlatRect(rug.parentElement);
  if (!mat || !market?.width) return;
  // The far corner projects toward the middle of the screen more than the near corner.
  const depth = Math.max(0, mat.oy - market.top - rug.offsetTop) * Math.sin(mat.t * Math.PI / 180);
  // Leave room for the entire curled edge and its shadow to disappear beyond the viewport.
  const clearance = Math.max(112, shop.clientWidth * .06);
  const overhang = market.left + clearance + (mat.ox + clearance) * depth / mat.d;
  rug.style.setProperty('--rug-overhang', Math.ceil(Math.max(clearance, overhang)) + 'px');
}

// The camera is low enough to see the near end of the roll. The cross-section is
// foreshortened vertically by the same amount as the lifted surface.
const BAZAAR_ROLL_DEPTH = .46;
const BAZAAR_ROLL_ARC = Array.from({length:25}, (_, i) => {
  const angle = (i / 24 - .5) * Math.PI;
  return {x:Math.sin(angle), top:-(1 + Math.cos(angle)) * BAZAAR_ROLL_DEPTH, angle};
});

function bazaarRollCylinder(ctx, img, x, h, w, edge, radius){
  const left = x - radius, width = radius * 2, centerY = h - radius * BAZAAR_ROLL_DEPTH;
  const contact = ctx.createLinearGradient(left - 5, 0, x + radius + 16, 0);
  contact.addColorStop(0, '#37211600');
  contact.addColorStop(.38, '#37211695');
  contact.addColorStop(.66, '#37211660');
  contact.addColorStop(1, '#37211600');
  ctx.fillStyle = contact;
  ctx.beginPath();
  ctx.roundRect(left - 5, 0, width + 21, h + Math.min(10, radius * .24), Math.min(10, radius * .45));
  ctx.fill();

  // The exposed end is a coil of dark backing separated by worn woven edges.
  const capHeight = radius * BAZAAR_ROLL_DEPTH;
  ctx.fillStyle = '#42261b';
  ctx.beginPath();
  ctx.ellipse(x, centerY, radius, capHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  if (radius >= 3){
    const rolled = w - edge;
    const turns = Math.min(6, Math.max(1.4, rolled / (radius * 6)));
    const sweep = turns * Math.PI * 2;
    const phase = rolled / (radius * 1.9);
    const steps = Math.ceil(turns * 18);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++){
      const t = i / steps, angle = phase + t * sweep, layer = .10 + .86 * t;
      const px = x + Math.cos(angle) * radius * layer, py = centerY + Math.sin(angle) * capHeight * layer;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(.8, radius / (turns * 2.8));
    ctx.strokeStyle = '#231710';
    ctx.stroke();
    ctx.lineWidth *= .48;
    ctx.strokeStyle = '#c18556';
    ctx.stroke();
  }

  // Sample the actual fabric by arc length, then project each strip above the sand.
  const points = BAZAAR_ROLL_ARC.map(p => ({x:x + p.x * radius, y:p.top * radius, u:edge + radius * (Math.PI + p.angle)}));
  ctx.save();
  ctx.beginPath();
  for (const [i, p] of points.entries()){
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  for (let i = points.length - 1; i >= 0; i--) ctx.lineTo(points[i].x, points[i].y + h);
  ctx.closePath();
  ctx.clip();
  const textureScale = img.naturalWidth / w;
  for (let i = 1; i < points.length; i++){
    const a = points[i-1], b = points[i], band = b.x - a.x;
    ctx.save();
    ctx.transform(1, (b.y - a.y) / band, 0, 1, a.x, a.y);
    ctx.drawImage(img, a.u * textureScale, 0, (b.u - a.u) * textureScale, img.naturalHeight, 0, 0, band + .65, h);
    ctx.restore();
  }
  const light = ctx.createLinearGradient(left, 0, x + radius, 0);
  light.addColorStop(0, '#311c1675');
  light.addColorStop(.22, '#71391d18');
  light.addColorStop(.38, '#ffda9c55');
  light.addColorStop(.55, '#f8cca91a');
  light.addColorStop(.82, '#4a281e60');
  light.addColorStop(1, '#251716a8');
  ctx.fillStyle = light;
  ctx.fillRect(left, -radius, width, h + radius);
  ctx.restore();
}

// Reveal the flat fabric with a moving clip. Only the curled edge and the ripple need a fresh canvas frame.
function bazaarRoll(rug, opening, duration){
  const img = artReady(BAZAAR_RUG) || bazaarRugImage;
  if (!rug || !img?.naturalWidth) {
    if (rug && !opening) rug.classList.add('osbazaar-closed');
    return Promise.resolve();
  }
  const size = getComputedStyle(rug);
  const w = parseFloat(size.width), h = parseFloat(size.height);
  if (!w || !h) return Promise.resolve();

  const clip = document.createElement('div'), art = document.createElement('div');
  clip.className = 'osbazaar-flat-clip';
  art.className = 'osbazaar-flat-art';
  clip.append(art);
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve();
  const maxRadius = Math.min(38, h * .105), maxWave = Math.min(70, h * .2);
  const edgeWidth = Math.ceil(Math.max(maxWave, maxRadius + 5) + maxRadius + 18);
  const pad = Math.ceil(maxRadius * 2 * BAZAAR_ROLL_DEPTH + 6), height = h + pad * 2;
  const ratio = Math.min(1.5, devicePixelRatio || 1);
  canvas.width = Math.round(edgeWidth * ratio);
  canvas.height = Math.round(height * ratio);
  Object.assign(canvas.style, {width:edgeWidth+'px', height:height+'px', top:-pad+'px'});
  ctx.scale(canvas.width / edgeWidth, canvas.height / height);
  ctx.translate(0, pad);
  rug.classList.add('osbazaar-roll');
  rug.append(clip, canvas);

  const iw = img.naturalWidth, ih = img.naturalHeight;
  const waveShape = Array.from({length:12}, (_, i) => Math.sin(Math.PI * i / 12) ** 2);
  let began;
  const move = x => `translate3d(${x}px, 0, 0)`;
  return new Promise(resolve => {
    function frame(now){
      began ??= now;
      const t = duration > 0 ? Math.min(1, (now - began) / duration) : 1;
      if (!rug.isConnected || t === 1){
        clip.remove();
        canvas.remove();
        rug.classList.remove('osbazaar-roll');
        rug.classList.toggle('osbazaar-closed', !opening);
        resolve();
        return;
      }
      const progress = opening ? 1 - (1 - t) ** 2 : 1 - t * t;
      const edge = w * progress;
      const rolled = w - edge;
      // The roll gains cross-sectional area as fabric wraps onto it. Until its first turn
      // there is only enough cloth to form a smaller curl.
      const radius = Math.min(maxRadius, Math.sqrt(rolled * .95), rolled / 5.1);
      const wave = Math.min(maxWave, edge);
      if (opening && w - edge < .5 && radius < .5){
        // Switch to the resting art once the roll is smaller than a screen pixel.
        rug.classList.remove('osbazaar-roll');
        clip.hidden = canvas.hidden = true;
        requestAnimationFrame(frame);
        return;
      }
      const flat = edge - wave;
      // The ripple overlaps a pixel of the stationary art, covering the subpixel edge of its clip.
      const revealed = flat > 0 ? Math.min(w, flat + 1) : 0;
      clip.style.transform = move(revealed - w);
      art.style.transform = move(w - revealed);
      const start = Math.min(flat, edge - radius - 5), inset = flat - start;
      canvas.style.transform = move(start);
      ctx.clearRect(0, -pad, edgeWidth, height);
      // Continue the flat rug's shadow under the edge without outlining the vertical join.
      if (wave > 0){
        const ground = ctx.createLinearGradient(0, h - 1, 0, h + 9);
        ground.addColorStop(0, '#30201572');
        ground.addColorStop(1, '#30201500');
        ctx.fillStyle = ground;
        ctx.fillRect(inset, h - 1, wave, 10);
      }
      const band = (x, y, strip, height) =>
        ctx.drawImage(img, iw * (flat + x) / w, 0, iw * strip / w, ih, inset + x, y, strip, height);
      if (wave > 0){
        const bendMax = Math.min(12, radius * .55);
        for (const [i, amplitude] of waveShape.entries()){
          const x = wave * i / waveShape.length, bend = amplitude * bendMax;
          const strip = Math.min(w - flat - x, wave / waveShape.length + .4);
          band(x, -bend * .72, strip, h - bend * .14);
          if (!bend) continue;
          ctx.fillStyle = 'rgba(42,22,12,' + bend * .012 + ')';
          ctx.fillRect(inset + x, -bend * .72, strip, h - bend * .14);
        }
      }
      if (radius > .1) bazaarRollCylinder(ctx, img, edge - start, h, w, edge, radius);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

// Sample the positions before starting the slide. A held frame keeps the old Shop in place until Mobilize is drawn.
function bazaarSlide(el, opening, x, delay, duration){
  const off = {translate:x + 'px'};
  const on = {translate:'0px'};
  return el.animate(opening ? [off, on] : [on, off],
    {delay, duration, easing:BAZAAR_SLIDE, fill:opening ? 'backwards' : 'both'});
}

function bazaarExitGeometry(shop){
  const left = [...shop.querySelectorAll('.ostray > .sdeck, .ostray .alwaysw')];
  const discard = shop.querySelector('.osdisc');
  const leftDistance = -Math.max(0, ...left.map(el => el.getBoundingClientRect().right)) - 56;
  const rightDistance = discard ? innerWidth - discard.getBoundingClientRect().left + 56 : 0;
  return {left, discard, leftDistance, rightDistance};
}

function bazaarShopGate(){
  if (!bazaarOpening || !bazaarOpening.shop.isConnected || bazaarOpening.game !== G || ui.start || ui.roll) return false;
  bazaarOpening.redraw = true;
  return true;
}

function bazaarOpen(shop){
  const t = bazaarTiming;
  const row = k => shop.querySelector('.ostray[data-k="' + k + '"]');
  const market = k => [...row(k).querySelectorAll('.market > :is(.mcard,.mirwrap)')]
    .map(el => el.matches('.mirwrap') ? el.querySelector(':scope > .mcard') : el)
    .filter(el => el && !el.matches('.ghost,.always'));
  const carry = {u:[], b:[]}, fresh = {u:[], b:[]};
  const moves = [];
  for (const k of ['u','b']){
    for (const card of market(k)) (card.classList.contains('leaving') ? carry : fresh)[k].push(card);
  }
  const dealOrder = ({u, b}) => u.flatMap((card, i) => [card, b[i]].filter(Boolean)).concat(b.slice(u.length));
  const order = dealOrder(fresh), returning = dealOrder(carry);
  const deals = order.flatMap(card => [card, ...backsOf(card)]);
  const decks = {u:deckEl('u'), b:deckEl('b')};
  const projection = matTiltOf(), tilt = matTiltMatrix(1, projection);
  const flat = matFlatRects(shop.querySelector('.osplane'), [...deals, ...returning, decks.u, decks.b]);
  const geometry = new Map(), view = deals.length ? dealView(deals[0]) : null;
  for (const el of deals){
    const k = el.closest('.msec')?.dataset.k === 'b' ? 'b' : 'u';
    const r = flat.get(el), source = flat.get(decks[k] || decks.u || decks.b);
    const mat = matFlightGeometry(r, source, tilt);
    if (!mat) continue;
    const face = el.querySelector('.cface.art');
    const point = [r.width / 2, r.height / 2];
    geometry.set(el, {screen:el.getBoundingClientRect(), source, mat, view, shadow:face && getComputedStyle(face).boxShadow,
      origin:{css:'50% 50%', point}});
  }
  const {left, discard, leftDistance, rightDistance} = bazaarExitGeometry(shop);
  const freshFlights = deals.length;
  const gap = spreadGap(freshFlights + returning.length, t.dealSpread, t.dealGap);
  const deckReady = t.deckEnterDelay + t.deckEnter;
  const base = Math.max(t.dealStart, deckReady);
  const flipAt = Math.max(.2, Math.min(.8, t.dealFlipStart / t.dealTravel));
  const flipEnd = Math.max(flipAt + .03, Math.min(.97, (t.dealFlipStart + t.dealFlipDuration) / t.dealTravel));
  const land = Math.max(.12, Math.min(flipAt - .055, t.dealSlide / t.dealTravel));
  const fx = {...DESK_DEAL_FX, land, leaveAt:Math.min(DESK_DEAL_FX.leaveAt, land * .44),
    flipAt, flipMid:flipAt + (flipEnd - flipAt) * .45, flipEnd};
  const end = dealIn(order, base, {desktop:true, fx, launchGap:gap,
    dur:t.dealTravel, backDur:t.dealBackTravel, backLead:0, geometry});
  // Follow the last fresh launch on the same beat, even while its face is still turning.
  const carryStart = base + freshFlights * gap;
  let carryEnd = 0;
  for (const k of ['u','b']){
    const origin = matPoseOf(decks[k], flat);
    if (!origin) continue;
    // All covers share a layer. Add the first card to leave last so it sits on top.
    for (let i = carry[k].length - 1; i >= 0; i--){
      const card = carry[k][i], delay = carryStart + returning.indexOf(card) * gap;
      const landing = matReturnFly(card, {...origin, rot:90}, delay, land * t.dealTravel, leftDistance, {flat, projection});
      carryEnd = Math.max(carryEnd, landing);
    }
  }
  const finish = Math.max(end, carryEnd, t.rugOpen, deckReady, t.discardEnterDelay + t.discardEnter);
  const state = bazaarOpening = {shop, game:G, redraw:false};
  const mid = shop.querySelector('.osmid');
  mid.inert = true;
  moves.push(bazaarRoll(shop.querySelector('.osbazaar'), true, t.rugOpen));
  for (const el of left){
    moves.push(bazaarSlide(el, true, leftDistance, t.deckEnterDelay, t.deckEnter).finished);
  }
  if (discard) moves.push(bazaarSlide(discard, true, rightDistance, t.discardEnterDelay, t.discardEnter).finished);
  if (typeof shopCoinIncome === 'function') shopCoinIncome();
  moves.push(new Promise(resolve => setTimeout(resolve, finish)));
  for (const deal of MATDEALS.values()) if (shop.contains(deal.el)) moves.push(deal.flight.finished);
  ui.dealUntil = performance.now() + finish;
  return Promise.allSettled(moves).then(() => {
    mid.inert = false;
    if (bazaarOpening !== state) return;
    bazaarOpening = null;
    if (state.redraw) renderPlay();
  });
}

function bazaarExit(shop, piles){
  const t = bazaarTiming;
  const {left, discard, leftDistance, rightDistance} = bazaarExitGeometry(shop);
  const projection = matTiltOf();
  for (const {g, from, to} of piles){
    const shift = to.discard ? rightDistance : leftDistance;
    const frames = matArc(from, to, {...to, r:{...to.r, left:to.r.left + shift}}, {arc:0, projection});
    if (frames) g.animate(frames, {duration:t.exitTravel, delay:to.discard ? t.discardExitDelay : t.leftExitDelay,
      easing:BAZAAR_SLIDE, fill:'none'}).finished.then(() => { g.style.visibility = 'hidden'; }, () => {});
  }
  const slides = left.map(el => bazaarSlide(el, false, leftDistance, t.leftExitDelay, t.exitTravel).finished);
  if (discard) slides.push(bazaarSlide(discard, false, rightDistance, t.discardExitDelay, t.exitTravel).finished);
  return Promise.allSettled(slides);
}

function bazaarClose(shop, piles, packed){
  const rug = shop.querySelector('.osbazaar');
  const {rugCloseDelay, rugClose} = bazaarTiming;
  const roll = new Promise(resolve => setTimeout(resolve, rugCloseDelay))
    .then(() => rug?.isConnected && bazaarRoll(rug, false, rugClose));
  const exits = packed.then(() => bazaarExit(shop, piles));
  return Promise.allSettled([exits, roll]);
}

// A legal mid-match draft with upgraded units and both equipped and loose attachments.
function bazaarMobilizeScenario(){
  const me = G.players[0], enemy = G.players[1];
  me.su.city = 6;
  Object.assign(me, {
    hand:{Brawler:3, Fencer:2, Marksman:2, Slinger:1, Scholar:2, Assassin:1, Recruiter:2,
      'Man-at-arms':2, Executioner:1, 'Dowser Oracle':2, Lancer:1, Arsonist:2, Recruit:1},
    city:{Field:1, 'Reserve Encampment':3, Barracks:1, Smithy:3, Study:2, Armory:2},
    gear:{Lance:2, 'Battle Axe':1, 'Heirloom Blade':1, 'Poison Oil':1, 'War Banner':1, 'War Horn':1, Zweihander:1}
  });
  enemy.hand = {Slinger:2, Fencer:1, Scholar:1};
  return [
    {name:'Brawler', gear:'Lance', arm:1, sh:1}, {name:'Fencer', tr:1}, {name:'Marksman'},
    {name:'Slinger'}, {name:'Scholar'}, {name:'Assassin'}, {name:'Recruiter'}, {name:'Recruit'}
  ];
}

function bazaarLabRequested(){ return new URLSearchParams(location.search).get('bazaarLab') === '1'; }
if (bazaarLabRequested()) window.OasisBazaarLab = {
  defaults:BAZAAR_DEFAULTS,
  setPileLayout(settings){
    for (const [key, [min, max]] of Object.entries(BAZAAR_PILE_LIMITS)){
      if (Number.isFinite(settings[key])) bazaarTiming[key] = Math.max(min, Math.min(max, settings[key]));
    }
    matRefreshShopFan(true);
    if (ui.bazaarMobilize && G?.phase === 'mobilize'){
      if (peekEl || mzP || MATMOB.busy) MATMOB.layoutPending = true;
      else matDeskMobLayout();
    }
  },
  async play(mode, settings = {}){
    if (!['open','close','both','drag','inspect','mobilize'].includes(mode)) throw new Error('Unknown preview sequence.');
    bazaarTiming = Object.fromEntries(Object.entries(BAZAAR_DEFAULTS).map(([key, value]) => {
      const next = settings[key];
      const max = {dragLean:16, dragGrow:25, inspectWidth:460, shadowRestOpacity:100,
        shadowRestBlur:24, shadowRestOffset:24, shadowLiftOpacity:100, shadowLiftBlur:32, shadowLiftOffset:36,
        pileShift:500, pileRoomOpen:400, pileRoomClose:400}[key] ?? 6000;
      const [lower, upper] = BAZAAR_PILE_LIMITS[key] || [{dealTravel:1, inspectWidth:160}[key] ?? 0, max];
      return [key, Number.isFinite(next) ? Math.max(lower, Math.min(upper, next)) : value];
    }));
    await prepareMatchArt();
    bazaarApplyRestShadow();
    if (MATDRAG.p) matDragDrop(MATDRAG.p, false, {reset:true});
    stopTimers();
    dismissTurnFlash();
    G = newGame({rnd:mulberry32(7108), labels:['You', 'Rival'], pp:true, miracles:false});
    const interactive = mode === 'drag' || mode === 'inspect';
    G.pp = !interactive;
    ui = freshUI({dealt:G.round, bazaarMobilize:mode === 'mobilize'});
    startShop(G);
    ui.dealt = G.round;
    G.order = [0,1];
    if (mode === 'mobilize'){
      ui.draft = bazaarMobilizeScenario();
      pass(G, cur(G)); pass(G, cur(G));
      ui.handoff = null;
      MATMOB.lift = true;
      renderPlay();
      dismissTurnFlash();
      await MATMOB.entrance;
      return;
    }
    for (const k of ['u','b']) G.disp[k][0].side = true;
    if (interactive){
      const player = G.players[0], card = G.disp.u[0].name;
      G.passed[1] = true;
      player.money += 24;
      player.hand[card] = 1;
      player.bought.push(card);
      if (mode === 'inspect'){
        const previews = [...new Set(G.disp.u.map(c => c.name))].filter(n => n !== card);
        for (const name of previews){ player.hand[name] = 1; player.bought.push(name); }
        G.shopBought[0] = previews.slice(-2);
      }
    }
    renderPlay();
    dismissTurnFlash();
    const shop = document.querySelector('.osdesk:not(.osmobmat)');
    if (!shop) throw new Error('The preview needs a desktop-size game view.');
    if (interactive) return;
    if (mode !== 'close') await bazaarOpen(shop);
    if (mode === 'open') return;
    if (mode === 'both') await new Promise(resolve => setTimeout(resolve, 350));
    pass(G, cur(G)); pass(G, cur(G));
    ui.handoff = null;
    ui.draft = [];
    await matSweep(shop);
    for (const el of MATMOB.flyers.splice(0)) el.remove();
    shop.remove();
    renderPlay();
    await matMobDimIn(document.querySelector('#view-play .osdeskmob'))?.finished.catch(() => {});
  }
};
