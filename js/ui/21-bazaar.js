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
let bazaarRugImage, bazaarOpening, bazaarBattleReturn;
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
  return bazaarPrepareRoll(rug, opening, duration)();
}

function bazaarPrepareRoll(rug, opening, duration){
  const img = artReady(BAZAAR_RUG) || bazaarRugImage;
  if (!rug || !img?.naturalWidth) {
    return () => {
      if (rug && !opening) rug.classList.add('osbazaar-closed');
      return Promise.resolve();
    };
  }
  const size = getComputedStyle(rug);
  const w = parseFloat(size.width), h = parseFloat(size.height);
  if (!w || !h) return () => Promise.resolve();

  const clip = document.createElement('div'), art = document.createElement('div');
  clip.className = 'osbazaar-flat-clip';
  art.className = 'osbazaar-flat-art';
  clip.append(art);
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  if (!ctx) return () => Promise.resolve();
  const maxRadius = Math.min(38, h * .105), maxWave = Math.min(70, h * .2);
  const edgeWidth = Math.ceil(Math.max(maxWave, maxRadius + 5) + maxRadius + 18);
  const pad = Math.ceil(maxRadius * 2 * BAZAAR_ROLL_DEPTH + 6), height = h + pad * 2;
  const ratio = Math.min(1.5, devicePixelRatio || 1);
  canvas.width = Math.round(edgeWidth * ratio);
  canvas.height = Math.round(height * ratio);
  Object.assign(canvas.style, {width:edgeWidth+'px', height:height+'px', top:-pad+'px'});
  ctx.scale(canvas.width / edgeWidth, canvas.height / height);
  ctx.translate(0, pad);
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const waveShape = Array.from({length:12}, (_, i) => Math.sin(Math.PI * i / 12) ** 2);
  const move = x => `translate3d(${x}px, 0, 0)`;
  function draw(t){
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
  }
  draw(0);
  return () => new Promise(resolve => {
    let began;
    rug.classList.add('osbazaar-roll');
    rug.append(clip, canvas);
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
      if (t > 0) draw(t);
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
  const state = bazaarBattleReturn?.shop ? bazaarBattleReturn : bazaarOpening;
  if (!state?.shop.isConnected || state.game !== G || ui.start || ui.roll) return false;
  state.redraw = true;
  return true;
}

function bazaarReturnsToShop(){
  const state = bazaarBattleReturn;
  return state?.game === G && G?.phase === 'shop' && !ui.battle && G.round === state.round + 1;
}

// Capture the last battlefield in the same flat camera coordinates used by the Shop.
function bazaarCaptureBattle(){
  const view = $('view-play'), line = view.querySelector('.stage .line.matz');
  if (!matDesk() || reduceMotion() || !line || !ui.battle || G.over || ui.frame !== ui.battle.frames.length - 1) return;
  const camera = matDesktopBattleCamera();
  const scene = ui.battle.matSeats, final = ui.battle.frames[ui.frame].snap, mine = seat();
  const style = line.style.cssText;
  line.style.setProperty('transform', 'none', 'important');
  const sideData = ['me', 'opp'].map((side, index) => {
    const strip = view.querySelector(`.osstrip.${side}`), row = strip?.querySelector('.oscarrow');
    if (!row) return null;
    const stripTransform = strip.style.transform;
    strip.style.transform = 'none';
    const rowRect = row.getBoundingClientRect(), anchor = strip.matches('.osstrip-anchored') && scene?.[side];
    const dx = anchor ? anchor.left - rowRect.left : 0, dy = anchor ? anchor.top - rowRect.top : 0;
    const anchored = el => { const r = el.getBoundingClientRect(); return {left:r.left + dx, top:r.top + dy, width:r.width, height:r.height}; };
    const caravan = [...row.querySelectorAll('.oscar')].map(card => ({card, name:card.dataset.b, r:anchored(card)}));
    const purse = strip.querySelector('.ospurse'), bank = purse && {purse, r:anchored(purse)};
    const bench = strip.querySelector('.osbench-face');
    const benchPile = bench && {r:anchored(bench), name:bench.querySelector('.cfm')?.dataset.n, layers:bench.parentElement.querySelectorAll('.oback').length};
    strip.style.transform = stripTransform;
    const playerIndex = index ? 1 - mine : mine;
    const player = final[playerIndex], zones = line.querySelector(`.trow.s${index}`);
    const pile = (selector, name, layers = 0) => {
      const card = zones?.querySelector(selector);
      return card && {r:card.getBoundingClientRect(), name:name?.replace(/^Jester → .*/, 'Jester'), layers};
    };
    const piles = [
      pile('.deckz .tzc > .card:not(.mini)', player.deck[0]?.name, player.deck.length - 1),
      pile('.chz .charge > .card:not(.mini)', player.charge?.name),
      pile('.grz .gcard:not(.gunder)', null, player.grave.length - 1),
      benchPile
    ].filter(p => p?.r.width);
    return {side, playerIndex, caravan, bank, piles};
  });
  line.style.cssText = style;
  if (!sideData.every(Boolean)) return;
  bazaarBattleReturn = {game:G, round:G.round, camera, sideData, shop:null, redraw:false};
}

function bazaarReturnPile(host, card, source, projection, duration){
  const {left, top, width, height} = source.r;
  const r = {left, top, width, height:width * 1037 / 750};
  const el = document.createElement('div');
  el.className = 'osbattle-return-pile';
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px'});
  const layers = Math.min(3, Math.max(0, source.layers || 0));
  el.innerHTML = Array.from({length:layers}, (_, i) => `<i class="oback" style="--k:${layers - i}"></i>`).join('');
  const face = document.createElement('div');
  face.className = 'osbattle-return-face';
  if (card) face.append(card);
  else if (source.name && (DEFS[source.name] || BDEFS[source.name])) face.innerHTML = cardFace(source.name, DEFS[source.name] ? 'u' : 'b', 0, true);
  else face.innerHTML = '<i class="oback"></i>';
  el.append(face);
  host.append(el);
  if (!card) solidArt(el, width);
  const start = {r, tilt:1};
  el.style.transform = matArc(r, start, start, {projection, arc:0})[0].transform;
  const crop = height < r.height * .9 ? matCrop(face, [[0,'crop'], [1,'open']], {duration, easing:MAT_EASE, fill:'both'}, 'up') : null;
  if (crop?.anims.length) Promise.allSettled(crop.anims.map(a => a.finished)).then(crop.done);
  return {el, start};
}

function bazaarOpenAfterBattle(shop){
  const state = bazaarBattleReturn;
  if (!bazaarReturnsToShop()){ bazaarBattleReturn = null; return bazaarOpen(shop); }
  state.shop = shop;
  shop.classList.add('osbattle-return');
  shop.inert = true;
  const restores = [];
  let prepared;
  const returning = bazaarAnimateReturn(shop, state, restores);
  const preparation = bazaarPrepareOpening(shop, state).then(plan => { prepared = plan; });
  return Promise.allSettled([returning, preparation]).then(results => {
    for (const result of results) if (result.status === 'rejected') console.error('Battle to Shop', result.reason);
    for (const restore of restores) restore();
    shop.inert = false;
    shop.classList.remove('osbattle-return');
    if (bazaarBattleReturn !== state || !shop.isConnected || G !== state.game){
      prepared?.cancel();
      if (bazaarBattleReturn === state) bazaarBattleReturn = null;
      return;
    }
    bazaarBattleReturn = null;
    if (G.phase !== 'shop' || ui.battle || G.round !== state.round + 1){
      prepared?.cancel();
      renderPlay();
      return;
    }
    if (prepared?.width !== innerWidth || prepared?.height !== innerHeight){
      prepared?.cancel();
      prepared = null;
    }
    turnWatch();
    if (prepared) bazaarStartOpening(shop, prepared);
    else bazaarOpen(shop);
    if (state.redraw && bazaarOpening) bazaarOpening.redraw = true;
    if (!G.net) scheduleAI();
  });
}

// Carry the Battle nodes into the new row while adopting the Shop card's controls and attributes.
function bazaarAdoptSurface(source, target){
  if (!source || source === target) return target;
  for (const {name} of [...source.attributes]) if (!target.hasAttribute(name)) source.removeAttribute(name);
  for (const {name, value} of target.attributes) if (source.getAttribute(name) !== value) source.setAttribute(name, value);
  target.replaceWith(source);
  return source;
}

// The lead moves home from the first frame. Each following pile loses its initial offset as it tucks behind it.
function bazaarReturnPath(from, anchor, home, camera, projection){
  const mix = (a, b, u) => a + (b - a) * u;
  const settle = t => t * t * (3 - 2 * t);
  const offset = {x:from.left - anchor.left, y:from.top - anchor.top, w:from.width - anchor.width};
  return Array.from({length:33}, (_, i) => {
    const u = i / 32, slide = settle(u), spread = 1 - settle(Math.min(1, u / .66));
    const q = {d:mix(camera.d, projection.d, slide), t:mix(camera.t, projection.t, slide),
      ox:mix(camera.ox, projection.ox, slide), oy:mix(camera.oy, projection.oy, slide)};
    const x = mix(anchor.left, home.left, slide) + offset.x * spread;
    const y = mix(anchor.top, home.top, slide) + offset.y * spread - 14 * Math.sin(Math.PI * slide);
    const w = mix(anchor.width, home.width, slide) + offset.w * spread;
    const pose = new DOMMatrix().translate(-from.left, -from.top).multiply(matTiltMatrix(1, q)).translate(x, y).scale(w / from.width);
    return {offset:u, transform:pose.toString()};
  });
}

async function bazaarAnimateReturn(shop, state, restores){
  const projection = matTiltOf(), gather = 385, travel = 850;
  const moves = [];
  const host = document.createElement('div');
  host.className = 'osbattle-return-stacks';
  host.setAttribute('aria-hidden', 'true');
  document.body.append(host);
  restores.push(() => host.remove());
  const animate = (el, keys, duration, easing = MAT_EASE) => {
    const animation = el.animate(keys, {duration, easing, fill:'both'});
    moves.push(animation.finished);
    restores.push(() => animation.cancel());
    return animation;
  };
  const rows = state.sideData.map(data => {
    const seat = shop.querySelector(`.osseat.s${VS(data.playerIndex)}`);
    const caravan = data.caravan.slice();
    const cards = [...seat.querySelectorAll('.oscar')].map(target => {
      const index = caravan.findIndex(c => c.name === target.dataset.b);
      if (index < 0) return {card:target};
      const [{card, r}] = caravan.splice(index, 1);
      const before = card.querySelector(':scope > .cface'), after = target.querySelector(':scope > .cface');
      const children = [...target.childNodes].map(node => node === after && before ? before : node);
      card.replaceChildren(...children);
      return {card:bazaarAdoptSurface(card, target), r};
    });
    const target = seat.querySelector('.ospurse'), top = seat.querySelector('.osdeck .ostop');
    let purse = target;
    if (data.bank && target){
      const next = target.innerHTML;
      purse = bazaarAdoptSurface(data.bank.purse, target);
      restores.push(() => morphInto(purse, next));
    }
    return {...data, cards, purse, top};
  });
  const flat = matFlatRects(shop.querySelector('.osplane'), rows.flatMap(({cards, purse, top}) => [...cards.map(({card}) => card), purse, top]));
  for (const {side, bank, piles, cards, purse, top} of rows){
    const align = (el, from, to, crop = 0) => {
      if (!from?.width || !to?.width) return;
      const scale = from.width / to.width;
      const x = from.left - to.left, y = from.top - to.top - crop * scale;
      if (Math.abs(x) + Math.abs(y) + Math.abs(1 - scale) < .1) return;
      animate(el, [{transform:`translate(${x}px, ${y}px) scale(${scale})`}, {transform:'none'}], gather);
    };
    for (const {card, r} of cards){
      if (!r) continue;
      const down = side === 'me';
      const crop = matCrop(card, [[0,'crop'], [1,'open']], {duration:gather, easing:MAT_EASE, fill:'both'}, down ? 'down' : 'up');
      align(card.parentElement, r, flat.get(card), down ? matCropMetrics(card).drop : 0);
      restores.push(crop.done);
      moves.push(...crop.anims.map(a => a.finished));
    }
    if (purse && bank) align(purse, bank.r, flat.get(purse));
    const home = flat.get(top);
    if (!home?.width || !piles.length) continue;
    const group = document.createElement('div');
    group.className = 'osbattle-return-side';
    host.append(group);
    const art = top.querySelector(':scope > .cface'), name = top.querySelector('.cfm')?.dataset.n;
    const match = art ? piles.find(p => p.name === name) : null;
    const anchor = (match || piles[0]).r;
    for (const p of piles){
      if (p === match) continue;
      const stack = bazaarReturnPile(group, null, p, state.camera, gather);
      animate(stack.el, bazaarReturnPath(stack.start.r, anchor, home, state.camera, projection), travel, 'linear');
      for (const edge of stack.el.querySelectorAll(':scope > .oback')){
        const depth = Number(edge.style.getPropertyValue('--k'));
        animate(edge, [{offset:0, translate:`${depth * 4}px ${depth * 3}px`},
          {offset:.46, translate:`${depth * 4}px ${depth * 3}px`}, {offset:.88, translate:'0 0'}], travel, 'linear');
      }
      // Once a source is under the assembled stack, only the returning stock casts an outline.
      animate(stack.el, [{visibility:'visible', offset:0, easing:'steps(1, end)'},
        {visibility:'hidden', offset:.88}, {visibility:'hidden'}], travel, 'linear');
    }
    const layers = top.parentElement.querySelectorAll(':scope > .osedge').length;
    const capSource = match || {name, r:{left:anchor.left, top:anchor.top, width:anchor.width, height:anchor.width * 1037 / 750}};
    const cap = bazaarReturnPile(group, art, {...capSource, layers}, state.camera, gather);
    if (art) restores.push(() => top.prepend(art));
    animate(cap.el, bazaarReturnPath(cap.start.r, anchor, home, state.camera, projection), travel, 'linear');
    if (!match){
      const cover = cap.el.lastElementChild;
      cover.classList.add('osbattle-return-tuck');
      animate(cover.firstElementChild, [
        {offset:0, translate:'-100% 0'},
        {offset:.24, translate:'-100% 0', easing:MAT_EASE},
        {offset:.68, translate:'0 0'},
        {offset:1, translate:'0 0'}
      ], travel, 'linear');
      for (const edge of cap.el.querySelectorAll(':scope > .oback')){
        const depth = Number(edge.style.getPropertyValue('--k'));
        animate(edge, [{offset:0, translate:'0 0', visibility:'hidden'},
          {offset:.68, translate:'0 0', visibility:'hidden'}, {offset:.88, translate:`${depth * 4}px ${depth * 3}px`, visibility:'visible'},
          {offset:1, translate:`${depth * 4}px ${depth * 3}px`, visibility:'visible'}], travel, 'linear');
      }
    }
  }
  await Promise.allSettled(moves);
}

function bazaarOpeningLayout(shop){
  const t = bazaarTiming;
  const row = k => shop.querySelector('.ostray[data-k="' + k + '"]');
  const market = k => [...row(k).querySelectorAll('.market > :is(.mcard,.mirwrap)')]
    .map(el => el.matches('.mirwrap') ? el.querySelector(':scope > .mcard') : el)
    .filter(el => el && !el.matches('.ghost,.always'));
  const carry = {u:[], b:[]}, fresh = {u:[], b:[]};
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
  const options = {desktop:true, fx, launchGap:gap, dur:t.dealTravel, backDur:t.dealBackTravel, backLead:0, geometry};
  const returns = [];
  for (const k of ['u','b']){
    const origin = matPoseOf(decks[k], flat);
    if (!origin) continue;
    // All covers share a layer. Add the first card to leave last so it sits on top.
    for (let i = carry[k].length - 1; i >= 0; i--){
      // Follow the last fresh launch on the same beat, even while its face is still turning.
      const card = carry[k][i], delay = base + (freshFlights + returning.indexOf(card)) * gap;
      returns.push({card, origin:{...origin, rot:90}, delay});
    }
  }
  const flyReturn = ({card, origin, delay}, stage) => matReturnFly(card, origin, delay, land * t.dealTravel, leftDistance, {flat, projection, stage});
  return {t, order, gap, base, options, returns, flyReturn, left, discard, leftDistance, rightDistance,
    finish:Math.max(t.rugOpen, deckReady, t.discardEnterDelay + t.discardEnter)};
}

function bazaarOpen(shop){
  const plan = bazaarOpeningLayout(shop);
  plan.finish = Math.max(plan.finish, dealIn(plan.order, plan.base, plan.options),
    ...plan.returns.map(move => plan.flyReturn(move)));
  return bazaarStartOpening(shop, plan);
}

async function bazaarPrepareOpening(shop, state){
  // Ahead of the handoff, build the hidden rug and flights on separate frames.
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  const sameShop = () => shop.isConnected && bazaarBattleReturn === state && G === state.game;
  const stage = {animations:[], cues:[], hold(animation){
    animation.pause();
    animation.currentTime = 0;
    stage.animations.push(animation);
  }};
  const cancel = () => stage.animations.forEach(animation => animation.cancel());
  try{
    await nextFrame();
    if (!sameShop()) return null;
    const width = innerWidth, height = innerHeight, plan = bazaarOpeningLayout(shop);
    await nextFrame();
    if (!sameShop()) return null;
    const roll = bazaarPrepareRoll(shop.querySelector('.osbazaar'), true, plan.t.rugOpen);
    let n = 0;
    for (const card of plan.order){
      await nextFrame();
      if (!sameShop()) { cancel(); return null; }
      const end = dealIn([card], plan.base + n * plan.gap, {...plan.options, stage});
      n += 1 + backsOf(card).length;
      plan.finish = Math.max(plan.finish, end);
    }
    for (const move of plan.returns){
      await nextFrame();
      if (!sameShop()) { cancel(); return null; }
      plan.finish = Math.max(plan.finish, plan.flyReturn(move, stage));
    }
    await nextFrame();
    if (!sameShop()) { cancel(); return null; }
    if (typeof shopCoinPrepareIncome === 'function') shopCoinPrepareIncome();
    return {...plan, roll, stage, width, height, cancel};
  } catch(error){
    cancel();
    throw error;
  }
}

function bazaarStartOpening(shop, plan){
  const {t, left, discard, leftDistance, rightDistance, finish, stage} = plan;
  const moves = [];
  const state = bazaarOpening = {shop, game:G, redraw:false};
  const mid = shop.querySelector('.osmid');
  mid.inert = true;
  if (stage){
    for (const animation of stage.animations) animation.play();
    for (const cue of stage.cues) cue();
  }
  moves.push(plan.roll ? plan.roll() : bazaarRoll(shop.querySelector('.osbazaar'), true, t.rugOpen));
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
  Object.assign(me, {
    hand:{Brawler:3, Fencer:2, Marksman:2, Slinger:1, Scholar:2, Assassin:1, Recruiter:2,
      'Man-at-arms':2, Executioner:1, 'Dowser Oracle':2, Lancer:1, Arsonist:2, Recruit:1},
    city:{Field:1, 'Reserve Encampment':3, Smithy:3, Study:2, Armory:2},
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
    if (!['open','close','both','drag','inspect','mobilize','battle-end'].includes(mode)) throw new Error('Unknown preview sequence.');
    if (MATBAT.entrance) await MATBAT.entrance;
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
    stopAuto();
    dismissTurnFlash();
    G = newGame({rnd:mulberry32(7108), labels:['You', 'Rival'], miracles:false});
    const interactive = mode === 'drag' || mode === 'inspect';
    const battleEnd = mode === 'battle-end', crowded = mode === 'mobilize' || battleEnd;
    G.pp = !interactive && !crowded;
    ui = freshUI({dealt:G.round, bazaarMobilize:crowded});
    startShop(G);
    ui.dealt = G.round;
    G.order = [0,1];
    if (crowded){
      ui.draft = bazaarMobilizeScenario();
      pass(G, cur(G)); pass(G, cur(G));
      G.noRemind = {lock:true};
      const rival = {deck:[{name:'Slinger'}, {name:'Fencer'}, {name:'Scholar'}]};
      AIMOB = {g:G, round:G.round, r:rival, p:Promise.resolve(rival)};
      MATMOB.lift = !battleEnd;
      if (battleEnd) document.querySelector('#view-play .osshop:not(.osmobmat)')?.remove();
      renderPlay();
      dismissTurnFlash();
      if (battleEnd){
        const mat = document.querySelector('.osmobmat.osdesk'), mob = document.querySelector('.osdeskmob');
        if (!mat || !mob) throw new Error('The preview needs a desktop-size game view.');
        const {seats} = matBatScene(mat, mob);
        showBattle(playBattle(draftFromDeck(ui.draft), rival.deck));
        ui.battle.matSeats = seats;
        goFrame(ui.battle.frames.length - 1, false);
        return;
      }
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
