/* Desktop Shop coins. A single transient layer draws all active transactions. */
const SHOP_COIN_ART = 'art/medallion.png';
const SHOP_COIN_FACE_SHARE = .18; // The printed medallion spans 134 px of the 750 px card art.
let shopCoinLayer = null, shopCoinArt = null, shopCoinRound = null;
let shopCoinWarmPending = false, shopCoinWarmDone = false;

function shopCoinImage(){
  if (!shopCoinArt){ shopCoinArt = new Image(); shopCoinArt.src = SHOP_COIN_ART; }
  return shopCoinArt;
}

function shopCoinWarmEnabled(){
  return !document.hidden && !compact() && rugOn() && matDeskOn() && !reduceMotion();
}

function shopCoinViewport(){
  const w = innerWidth, h = innerHeight, scale = Math.min(1.5, devicePixelRatio || 1);
  return {w,h,cw:Math.round(w*scale),ch:Math.round(h*scale)};
}

function shopCoinFitCanvas(canvas, {cw,ch}){
  if (canvas.width !== cw) canvas.width = cw;
  if (canvas.height !== ch) canvas.height = ch;
}

function shopCoinNeedsWarm({cw,ch}){
  return !shopCoinWarmDone || (shopCoinLayer?.renderer.mode === 'webgl'
    && (shopCoinLayer.canvas.width !== cw || shopCoinLayer.canvas.height !== ch));
}

function shopCoinRequestWarm(){
  if (shopCoinWarmPending || shopCoinLayer?.batches.length || !shopCoinWarmEnabled()
    || !shopCoinNeedsWarm(shopCoinViewport())) return;
  shopCoinWarmPending = true;
  const queue = () => {
    if (window.requestIdleCallback) requestIdleCallback(shopCoinWarm);
    else setTimeout(shopCoinWarm, 300);
  };
  // Decode before the first draw so the animation can reuse the uploaded texture.
  if (shopCoinWarmDone) queue();
  else shopCoinImage().decode().catch(() => {}).then(queue);
}

function shopCoinWarm(){
  shopCoinWarmPending = false;
  if (!shopCoinWarmEnabled() || shopCoinLayer?.batches.length) return;
  const viewport = shopCoinViewport();
  if (!shopCoinNeedsWarm(viewport)) return;
  const layer = shopCoinWarmDone ? shopCoinLayer : shopCoinCanvas(true);
  shopCoinWarmDone = true;
  if (layer?.renderer.mode !== 'webgl'){
    shopCoinLayer ||= layer;
    return;
  }
  // Draw while detached at the same size as an animation to warm WebGL's backing buffer.
  const {w,h} = viewport;
  shopCoinFitCanvas(layer.canvas, viewport);
  try{
    layer.renderer.draw([{x:w/2,y:h/2,r:10,spin:1,tilt:.3,opacity:1}],w,h);
    layer.renderer.draw([],w,h);
    shopCoinLayer = layer;
  }catch(e){
    if (shopCoinLayer === layer && !shopCoinUseFallback(layer)) shopCoinLayer = null;
  }
}

function shopCoinWatchResolution(){
  window.matchMedia?.(`(resolution: ${devicePixelRatio || 1}dppx)`)
    .addEventListener?.('change', shopCoinWatchResolution, {once:true});
  shopCoinRequestWarm();
}

function shopCoinStart(g){
  const before = g.players.map(p => p.money);
  startShop(g);
  shopCoinRecordIncome(g, before);
}

function shopCoinRecordIncome(g, before){
  shopCoinRound = {game:g, round:g.round, amounts:g.players.map((p, i) => p.money - before[i])};
}

function shopCoinEnabled(){
  return matShopOn() && matDesk() && !reduceMotion() && !!$('view-play').querySelector('.osdesk .osbazaar');
}

function shopCoinBank(i){
  const purse = $('view-play').querySelector(`.osdesk .osseat.${i === seat() ? 'me' : 'opp'} .ospurse`);
  const heap = purse?.querySelector('.osheap');
  const r = heap?.getBoundingClientRect();
  return r?.width ? {x:r.left + r.width / 2, y:r.top + r.height * .58} : null;
}

function shopCoinDiameter(){
  const card = $('view-play').querySelector('.osdesk .market .mcard:not(.ghost,.leaving) > .cface')
    || $('view-play').querySelector('.osdesk .ostray .alwaysw .cface');
  return card ? card.getBoundingClientRect().width * SHOP_COIN_FACE_SHARE : 22;
}

function shopCoinIncome(){
  const income = shopCoinRound;
  if (!income || income.game !== G || income.round !== G.round) return;
  shopCoinRound = null;
  if (!shopCoinEnabled()) return;
  income.amounts.forEach((amount, i) => {
    const bank = shopCoinBank(i);
    if (bank) playShopCoins('income', amount, bank, bank, 150);
  });
}

function shopCoinPrepareIncome(){
  if (!shopCoinLayer && shopCoinRound?.game === G && shopCoinRound.round === G.round
      && shopCoinRound.amounts.some(amount => amount > 0) && shopCoinEnabled()){
    shopCoinLayer = shopCoinCanvas();
  }
}

function shopCoinCardEdge(card){
  const el = card?.querySelector?.('.cface') || card;
  const r = el?.getBoundingClientRect?.();
  return r?.width ? {x:r.left + r.width / 2, y:r.bottom} : null;
}

function shopCoinPay(i, ev, card){
  if (!shopCoinEnabled() || !(ev.price > 0)) return Promise.resolve();
  const bank = shopCoinBank(i), edge = shopCoinCardEdge(card);
  if (bank && edge) return playShopCoins('pay', ev.price, bank, edge);
  try{ sfx.coin(i === seat() ? .75 : .4); }catch(e){}
  return Promise.resolve();
}

function shopCoinSale(i, ev, card, source){
  if (!shopCoinEnabled() || !(ev.gain > 0)) return Promise.resolve();
  const bank = shopCoinBank(i);
  let edge = shopCoinCardEdge(card);
  if (!edge && source?.fr){
    const r = source.fr, x = r.left + r.width/2, y = r.bottom;
    const tilt = !source.flat && matTiltMatrix();
    const p = tilt ? new DOMPoint(x,y).matrixTransform(tilt) : null;
    edge = p?.w ? {x:p.x/p.w,y:p.y/p.w} : {x,y};
  }
  if (bank && edge) return playShopCoins('sale', ev.gain, edge, bank);
  try{ sfx.sell(); }catch(e){}
  return Promise.resolve();
}

function shopCoinMesh(){
  const data = [], steps = 28;
  function point(j, radius, z, radial, normalZ, face){
    const t = 2 * Math.PI * j / steps, x = Math.cos(t), y = Math.sin(t);
    data.push(radius*x, radius*y, z, radial*x, radial*y, normalZ, .5 + x*radius/2, .5 - y*radius/2, face);
  }
  for (const s of [-1, 1]) for (let j = 0; j < steps; j++){
    point(j, 0, .16*s, 0, s, 1);
    point(j, .94, .16*s, 0, s, 1);
    point(j+1, .94, .16*s, 0, s, 1);
  }
  const rings = [[.94,-.16,.50,-.87], [1,-.08,1,0], [1,.08,1,0], [.94,.16,.50,.87]];
  for (let k = 1; k < rings.length; k++) for (let j = 0; j < steps; j++){
    const low = rings[k-1], hi = rings[k];
    point(j, ...low, 0); point(j+1, ...low, 0); point(j, ...hi, 0);
    point(j+1, ...low, 0); point(j+1, ...hi, 0); point(j, ...hi, 0);
  }
  return new Float32Array(data);
}

function shopCoinShader(gl, type, source){
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    gl.deleteShader(shader);
    throw new Error('Coin shader could not compile');
  }
  return shader;
}

function shopCoinWebGL(canvas, art){
  const gl = canvas.getContext('webgl', {alpha:true, antialias:true, premultipliedAlpha:false,
    failIfMajorPerformanceCaveat:true});
  if (!gl) return null;
  // Explicitly enabled software GL can still pass the browser's caveat check.
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  if (debug && /swiftshader|llvmpipe|softpipe|microsoft basic render driver/i.test(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))){
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return null;
  }
  const vertex = shopCoinShader(gl, gl.VERTEX_SHADER, `
    attribute vec3 position, normal;
    attribute vec2 texcoord;
    attribute float face;
    uniform vec2 viewport, at, angle;
    uniform float radius;
    varying vec3 litNormal;
    varying vec2 uv;
    varying float painted;
    vec3 turn(vec3 p) {
      float a=cos(angle.x), b=sin(angle.x), c=cos(angle.y), d=sin(angle.y);
      vec3 q=vec3(a*p.x+b*p.z,p.y,-b*p.x+a*p.z);
      return vec3(q.x,c*q.y-d*q.z,d*q.y+c*q.z);
    }
    void main() {
      vec3 p=turn(position);
      vec2 pixel=at+radius*vec2(p.x,-p.y);
      gl_Position=vec4(pixel.x*2.0/viewport.x-1.0,1.0-pixel.y*2.0/viewport.y,-p.z*0.2,1.0);
      litNormal=turn(normal); uv=texcoord; painted=face;
    }
  `);
  const fragment = shopCoinShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform sampler2D medallion;
    uniform float opacity;
    varying vec3 litNormal;
    varying vec2 uv;
    varying float painted;
    void main(){
      const vec3 light=vec3(-0.42,0.45,0.79);
      vec3 n=normalize(litNormal);
      vec4 artColor=texture2D(medallion,uv);
      vec3 faceColor=mix(vec3(.31,.40,.47),artColor.rgb,artColor.a);
      vec3 base=mix(vec3(.36,.26,.19),faceColor,painted);
      float shine=pow(max(0.0,dot(n,light)),7.0);
      float shade=0.57+0.43*max(0.0,dot(n,light));
      gl_FragColor=vec4(base*shade+vec3(.29,.25,.18)*shine,opacity);
    }
  `);
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const mesh = shopCoinMesh(), buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
  for (const [name, size, offset] of [['position',3,0], ['normal',3,3], ['texcoord',2,6], ['face',1,8]]){
    const at = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(at); gl.vertexAttribPointer(at, size, gl.FLOAT, false, 36, offset*4);
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));
  let mapped = false;
  const uniforms = Object.fromEntries(['viewport','at','angle','radius','opacity'].map(n => [n, gl.getUniformLocation(program,n)]));
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  return {
    mode:'webgl',
    draw(coins,w,h){
      if (!mapped && art.naturalWidth){
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,art);
        mapped = true;
      }
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform2f(uniforms.viewport,w,h);
      for (const c of coins){
        gl.uniform2f(uniforms.at,c.x,c.y); gl.uniform2f(uniforms.angle,c.spin,c.tilt);
        gl.uniform1f(uniforms.radius,c.r); gl.uniform1f(uniforms.opacity,c.opacity);
        gl.drawArrays(gl.TRIANGLES,0,mesh.length/9);
      }
    }
  };
}

function shopCoinFlat(canvas, art){
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return {
    mode:'canvas',
    draw(coins,w,h){
      ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);
      ctx.clearRect(0,0,w,h);
      for (const c of coins){
        ctx.save(); ctx.globalAlpha = c.opacity;
        ctx.translate(c.x,c.y); ctx.rotate(c.tilt * .28);
        ctx.scale(Math.max(.15,Math.abs(Math.cos(c.spin))),1);
        if (art.naturalWidth) ctx.drawImage(art,-c.r,-c.r,2*c.r,2*c.r);
        else { ctx.fillStyle = '#637e8e'; ctx.beginPath(); ctx.arc(0,0,c.r,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      }
    }
  };
}

function shopCoinCanvas(tryWebGL=false){
  const art = shopCoinImage();
  let canvas = document.createElement('canvas'), renderer;
  if (tryWebGL){
    try{ renderer = shopCoinWebGL(canvas,art); }catch(e){}
    if (!renderer) canvas = document.createElement('canvas');
  }
  if (!renderer) renderer = shopCoinFlat(canvas,art);
  if (!renderer) return null;
  canvas.className = 'shop-coins-layer';
  canvas.dataset.renderer = renderer.mode;
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',
    pointerEvents:'none',zIndex:LAYER.cardPop+2});
  return {canvas,renderer,batches:[],frame:0};
}

function shopCoinUseFallback(layer){
  const old = layer.canvas, canvas = old.cloneNode(false), renderer = shopCoinFlat(canvas,shopCoinArt);
  if (!renderer) return false;
  canvas.dataset.renderer = renderer.mode;
  old.replaceWith(canvas);
  layer.canvas = canvas;
  layer.renderer = renderer;
  return true;
}

function shopCoinPose(batch, i, elapsed){
  const fall = batch.mode !== 'pay', r = batch.radius, endOffset = (i - (batch.count-1)/2)*r*(fall ? .44 : 1.3);
  const time = elapsed - i * 27;
  if (time < 0) return null;
  const t = Math.min(1,time/batch.travel), fade = Math.max(0,Math.min(1,(batch.end-elapsed)/55));
  const drop = batch.mode === 'income' ? 3.8*r*2 : Math.max(44,r*3.6,(batch.from.y-batch.to.y)/Math.PI+2*r);
  const x0 = batch.mode === 'income' ? batch.from.x-endOffset*.65 : batch.from.x;
  const y0 = batch.mode === 'income' ? batch.from.y-drop : batch.from.y;
  const x = x0+(batch.to.x+endOffset-x0)*t;
  const bounce = time > batch.travel ? Math.sin(Math.PI*Math.min(1,(time-batch.travel)/60))*r*.22 : 0;
  const y = batch.mode === 'income' ? y0+(batch.to.y-y0)*t*t
    : y0+(batch.to.y-y0)*t-Math.sin(Math.PI*t)*drop;
  const spin = (1-t)*(5.3+i*.66), tilt = (1-t)*(-.5+i*.22);
  return {x,y:y-bounce,r,spin,tilt,opacity:fade};
}

function shopCoinSound(mode){
  try{
    if (mode === 'sale') sfx.sell();
    else sfx.coin(mode === 'income' ? .48 : .75);
  }catch(e){}
}

function playShopCoins(mode, amount, from, to, delay=0){
  if (!(amount > 0)) return Promise.resolve();
  const layer = shopCoinLayer || (shopCoinLayer = shopCoinCanvas());
  if (!layer){ shopCoinSound(mode); return Promise.resolve(); }
  const count = Math.min(6, amount), travel = mode === 'pay' ? 255 : 335;
  const end = travel + (count-1)*27 + 64;
  return new Promise(resolve => {
    layer.batches.push({mode,count,travel,end,from,to,game:G,round:G.round,
      radius:shopCoinDiameter()/2,began:performance.now()+delay,resolve,sounded:false});
    layer.canvas.dataset.mode = mode;
    if (!layer.canvas.isConnected) document.body.appendChild(layer.canvas);
    if (!layer.frame) layer.frame = requestAnimationFrame(shopCoinFrame);
  });
}

function shopCoinFrame(now){
  const layer = shopCoinLayer;
  if (!layer) return;
  layer.frame = 0;
  const coins = [];
  layer.batches = layer.batches.filter(batch => {
    const elapsed = now-batch.began;
    if (batch.game !== G || batch.round !== G.round || !shopCoinEnabled()){
      batch.resolve(); return false;
    }
    if (!batch.sounded && elapsed >= batch.travel+(batch.count-1)*27){
      batch.sounded = true; shopCoinSound(batch.mode);
    }
    if (elapsed >= batch.end){ batch.resolve(); return false; }
    for (let i=0; i<batch.count; i++){
      const pose = shopCoinPose(batch,i,elapsed);
      if (pose) coins.push(pose);
    }
    return true;
  });
  if (!layer.batches.length){
    layer.canvas.remove();
    shopCoinRequestWarm();
    return;
  }
  const viewport = shopCoinViewport();
  shopCoinFitCanvas(layer.canvas, viewport);
  const {w,h} = viewport;
  try{ layer.renderer.draw(coins,w,h); }
  catch(e){
    if (layer.renderer.mode !== 'webgl' || !shopCoinUseFallback(layer)){
      layer.canvas.remove();
      for (const batch of layer.batches) batch.resolve();
      shopCoinLayer = null;
      shopCoinRequestWarm();
      return;
    }
  }
  layer.frame = requestAnimationFrame(shopCoinFrame);
}

document.addEventListener('visibilitychange', shopCoinRequestWarm);
addEventListener('resize', shopCoinRequestWarm);
shopCoinWatchResolution();
