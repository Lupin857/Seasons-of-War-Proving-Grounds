/* ===================== THE RUG WORLD (one-screen dev) =====================
   Every game screen on a phone sits on Brian's rug (art/rug/rug_albedo.webp), drawn once by one fixed full-screen
   WebGL canvas behind the page. The shader casts a ray from a camera through each pixel onto the rug, so the rug is a
   real tilted floor; moving the camera (closer for battle, pulled back for Mobilize) is the "camera move" between
   phases. A normal map (art/rug/rug_normal.webp, made from the rug image) and a warm campfire light that breathes
   gently give it depth. Numbers from the "Oasis rug lighting test" (Nov 23): rug 7 card widths across, bumpiness 1,
   light height 1.3, flicker 0.25, tilt 14 deg. The battle table's own CSS tilt matches the camera's.
   Switch: localStorage.oasisRug = '0' turns it off. Sand (Nov 23, Brian: "light brown sand colored" for now): unless
   localStorage.oasisRug is '1', the page shows plain sand instead (body.os-sand, css/11-rug.css) and the rug is never
   drawn, so nothing repaints behind the game while cards move. '1' brings the rug back. */
const RUG = {cards:7, bump:1.0, flicker:.25, rugFrac:.913, texAspect:2, tilt:14,
  light:{x:-1.1, y:-1.3, z:3.6},                     // world units (1 = a card width); y is toward the far (rival) end
  cams:{shop:{d:11.5, y:0}, mobilize:{d:13.5, y:-.6}, battle:{d:9.6, y:.2}}};
let rugCv = null, rugGL = null, rugRaf = 0, rugReady = 0, rugT0 = 0;
let rugCam = {d:11.5, y:0}, rugFrom = null, rugTo = null, rugMove = null, rugPhase = '';
function rugOn(){ try{ return localStorage.getItem('oasisRug') !== '0'; }catch(e){ return true; } }
function rugSand(){ try{ return localStorage.getItem('oasisRug') !== '1'; }catch(e){ return true; } }
// the mat (the one-screen table) and its switches. Phones (640 px wide or less) always get it; wider screens get it
// by default, with localStorage.oasisMatDesk = '0' as the designer's opt-out.
// compact() (js/ui/07-battle-steps.js) still means "phone layout"; these mean "the mat", at any width.
function matDeskOn(){ try{ return localStorage.getItem('oasisMatDesk') !== '0'; }catch(e){ return true; } }
function matWidthOn(){ return innerWidth <= 640 || matDeskOn(); }   // this width shows the mat (rug switch or not)
function matOn(){ return rugOn() && typeof G !== 'undefined' && !!G && !G.raid && !ui.start && !ui.roll && matWidthOn(); }   // the mat is on
function matDesk(){ return matOn() && !compact(); }   // the mat in its desktop layout (stage 1 on: the shop)
function rugInit(){
  rugCv = document.createElement('canvas'); rugCv.id = 'rugworld'; rugCv.setAttribute('aria-hidden', 'true');
  const gl = rugCv.getContext('webgl', {antialias:false});
  if (!gl){ rugCv = null; return false; }
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 a;varying vec2 s;void main(){s=a;gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, `precision highp float;varying vec2 s;uniform sampler2D alb,nrm;
    uniform vec3 cam,fw,rt,up,L;uniform vec2 fov,rug;uniform float k,bump;
    vec3 lin(vec3 c){return pow(c,vec3(2.2));}
    void main(){
      vec3 dir=normalize(fw+s.x*fov.x*rt+s.y*fov.y*up);
      float t=-cam.z/dir.z; vec3 P=cam+dir*t;                         // where this pixel's ray meets the rug (z = 0)
      vec2 uv=vec2(P.x/rug.x+.5,.5-P.y/rug.y);
      vec3 c=vec3(.035,.025,.02);
      if(dir.z<0.&&uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.){
        vec3 a=lin(texture2D(alb,uv).rgb);
        vec3 n=texture2D(nrm,uv).rgb*2.-1.; n=normalize(vec3(n.x*bump,-n.y*bump,n.z)); // the map's y runs down the image
        vec3 d=L-P; float r=length(d); vec3 l=d/r;
        float dif=max(dot(n,l),0.)*k/(1.+.035*r*r);
        vec3 amb=vec3(.16,.14,.15)+.06*n.y;
        c=a*(amb+vec3(1.,.63,.35)*dif*2.3);
      }
      gl_FragColor=vec4(pow(c,vec3(1./2.2)),1.);
    }`));
  gl.linkProgram(p); gl.useProgram(p);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const al = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
  const tex = (unit, url, name) => {
    const t = gl.createTexture(), img = new Image();
    img.onload = () => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.useProgram(p); gl.uniform1i(gl.getUniformLocation(p, name), unit); rugReady++; rugKick(); };
    img.src = url;
  };
  tex(0, 'art/rug/rug_albedo.webp', 'alb'); tex(1, 'art/rug/rug_normal.webp', 'nrm');
  const U = n => gl.getUniformLocation(p, n);
  rugGL = {gl, p, cam:U('cam'), fw:U('fw'), rt:U('rt'), up:U('up'), L:U('L'), fov:U('fov'), rug:U('rug'), k:U('k'), bump:U('bump')};
  document.body.insertBefore(rugCv, document.body.firstChild);
  addEventListener('resize', rugSize); rugSize();
  return true;
}
function rugSize(){
  if (!rugCv) return;
  const dpr = Math.min(1.5, devicePixelRatio || 1), w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
  if (rugCv.width !== w || rugCv.height !== h){ rugCv.width = w; rugCv.height = h; }
  rugKick();
}
const rugEase = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function rugDraw(now){
  if (!rugGL || rugReady < 2) return;
  now = now || performance.now();
  if (rugMove){ const t = Math.min(1, (now - rugMove.t0) / rugMove.dur), e = rugEase(t);
    rugCam = {d:rugMove.a.d + (rugMove.b.d - rugMove.a.d) * e, y:rugMove.a.y + (rugMove.b.y - rugMove.a.y) * e}; if (t >= 1) rugMove = null; }
  const {gl} = rugGL, g = rugGL, t = (now - rugT0) / 1000, A = RUG.flicker, th = RUG.tilt * Math.PI / 180;
  // camera: looks at (0, cam.y) on the rug from distance d, tipped back by the tilt
  const cx = 0, cy = rugCam.y - rugCam.d * Math.sin(th), cz = rugCam.d * Math.cos(th);
  const fw = [0, Math.sin(th), -Math.cos(th)], up = [0, Math.cos(th), Math.sin(th)], rt = [1, 0, 0];
  const asp = rugCv.width / rugCv.height, fy = Math.tan(20 * Math.PI / 180);
  const rw = RUG.cards / RUG.rugFrac, rh = rw * RUG.texAspect;
  const w = .6 * Math.sin(t * 2.1) + .3 * Math.sin(t * 3.7 + 1.7) + .1 * Math.sin(t * 9.3 + .4);
  gl.viewport(0, 0, rugCv.width, rugCv.height);
  gl.uniform3f(g.cam, cx, cy, cz); gl.uniform3fv(g.fw, fw); gl.uniform3fv(g.rt, rt); gl.uniform3fv(g.up, up);
  gl.uniform2f(g.fov, fy * asp, fy); gl.uniform2f(g.rug, rw, rh);
  gl.uniform3f(g.L, RUG.light.x + .04 * A * Math.sin(t * 1.9), RUG.light.y + .04 * A * Math.sin(t * 2.6 + 2), RUG.light.z);
  gl.uniform1f(g.k, 1 + .2 * A * w); gl.uniform1f(g.bump, RUG.bump);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
function rugLoop(now){
  rugRaf = 0; if (!rugCv || !rugCv.isConnected || document.hidden || !document.body.classList.contains('os-mat')) return;
  rugDraw(now);
  if (rugMove) rugRaf = requestAnimationFrame(rugLoop);                       // camera moves run at full speed
  else if (RUG.flicker > 0) rugRaf = setTimeout(() => requestAnimationFrame(rugLoop), 33);   // the gentle flicker at ~30 fps
}
function rugKick(){ if (!rugRaf){ rugRaf = requestAnimationFrame(rugLoop); } }
function rugPhaseKey(){ return ui.battle ? 'battle' : G.phase === 'mobilize' ? 'mobilize' : 'shop'; }
// renderPlay step: the rug world under every game screen; a phase change moves the camera (2.2 s)
function rugAfterDraw(){
  const want = matOn(), html = document.documentElement;
  if (want !== document.body.classList.contains('os-mat')){
    document.body.classList.toggle('os-mat', want);
    if (want){ html.dataset.rugTheme = html.getAttribute('data-theme') || ''; html.setAttribute('data-theme', 'dark'); }
    else if ('rugTheme' in html.dataset){ html.dataset.rugTheme ? html.setAttribute('data-theme', html.dataset.rugTheme) : html.removeAttribute('data-theme'); delete html.dataset.rugTheme; }
  }
  const sand = want && (!compact() || rugSand());
  document.body.classList.toggle('os-sand', sand);
  document.body.classList.toggle('os-rug', want && !sand && !!ui.battle && document.body.classList.contains('lab-v-table'));
  document.body.classList.toggle('os-deskbat', want && !!ui.battle && matDesk() && document.body.classList.contains('lab-v-table'));   // the desktop battle on the mat (css/12-mat-shop.css)
  if (!want || sand) return;   // sand: a plain page colour, no canvas
  if (!rugCv && !rugInit()){ document.body.classList.remove('os-mat', 'os-rug'); return; }
  if (!rugT0) rugT0 = performance.now();
  const ph = rugPhaseKey();
  if (ph !== rugPhase){
    const to = RUG.cams[ph];
    if (!rugPhase || reduceMotion()) rugCam = {...to}; else rugMove = {a:{...rugCam}, b:to, t0:performance.now(), dur:2200};
    rugPhase = ph;
    if (rugRaf){ cancelAnimationFrame(rugRaf); clearTimeout(rugRaf); rugRaf = 0; }
  }
  rugKick();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) rugKick(); });
