(()=>{var sh=0,ll=1,rh=2;var Ii=1,oh=2,ds=3,_i=0,Oe=1,wn=2,Pi=0,fs=1,cl=2,hl=3,ul=4,ah=5;var Ni=100,lh=101,ch=102,hh=103,uh=104,dh=200,fh=201,ph=202,mh=203,dl=204,fl=205,gh=206,xh=207,_h=208,vh=209,yh=210,Mh=211,Sh=212,bh=213,wh=214,qr=0,Xr=1,Yr=2,es=3,Zr=4,$r=5,Jr=6,Kr=7,pl=0,Ah=1,Eh=2,An=0,ml=1,gl=2,xl=3,_l=4,vl=5,yl=6,Ml=7;var Sl=300,Li=301,ps=302,bo=303,wo=304,jr=1e3,yn=1001,Qr=1002,we=1003,Th=1004;var js=1005;var Be=1006,Ao=1007;var qn=1008;var Ge=1009,bl=1010,wl=1011,ms=1012,Eo=1013,un=1014,dn=1015,fn=1016,To=1017,Co=1018,Di=1020,Al=35902,El=35899,Tl=1021,Cl=1022,pn=1023,kn=1026,Xn=1027,Rl=1028,Ro=1029,vi=1030,Io=1031;var Po=1033,Qs=33776,tr=33777,er=33778,nr=33779,No=35840,Lo=35841,Do=35842,Fo=35843,Uo=36196,Bo=37492,Oo=37496,zo=37488,Vo=37489,ir=37490,ko=37491,Go=37808,Ho=37809,Wo=37810,qo=37811,Xo=37812,Yo=37813,Zo=37814,$o=37815,Jo=37816,Ko=37817,jo=37818,Qo=37819,ta=37820,ea=37821,na=36492,ia=36494,sa=36495,ra=36283,oa=36284,sr=36285,aa=36286;var Ps=2300,to=2301,Gr=2302,el=2303,nl=2400,il=2401,sl=2402;var Ch=3200;var la=0,Rh=1,Yn="",Pe="srgb",Ns="srgb-linear",Ls="linear",Jt="srgb";var Hr=7680;var Ih=519,Ph=512,Nh=513,Lh=514,Il=515,Dh=516,Fh=517,Pl=518,Nl=519,Uh=35044;var Ll="300 es",tn=2e3,ns=2001;function hd(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ud(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function is(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Bh(){let s=is("canvas");return s.style.display="block",s}var Lc={},ss=null;function Dl(...s){let t="THREE."+s.shift();ss?ss("log",t,...s):console.log(t,...s)}function Oh(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function It(...s){s=Oh(s);let t="THREE."+s.shift();if(ss)ss("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Nt(...s){s=Oh(s);let t="THREE."+s.shift();if(ss)ss("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Cs(...s){let t=s.join(" ");t in Lc||(Lc[t]=!0,It(...s))}function zh(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Vh={[qr]:qr,[Yr]:Jr,[Zr]:Zr,[es]:$r,[Xr]:Xr,[Jr]:Yr,[Kr]:Kr,[$r]:es},Sn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Re=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dc=1234567,Rs=Math.PI/180,rs=180/Math.PI;function gs(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Re[s&255]+Re[s>>8&255]+Re[s>>16&255]+Re[s>>24&255]+"-"+Re[t&255]+Re[t>>8&255]+"-"+Re[t>>16&15|64]+Re[t>>24&255]+"-"+Re[e&63|128]+Re[e>>8&255]+"-"+Re[e>>16&255]+Re[e>>24&255]+Re[n&255]+Re[n>>8&255]+Re[n>>16&255]+Re[n>>24&255]).toLowerCase()}function Xt(s,t,e){return Math.max(t,Math.min(e,s))}function Fl(s,t){return(s%t+t)%t}function dd(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function fd(s,t,e){return s!==t?(e-s)/(t-s):0}function Is(s,t,e){return(1-e)*s+e*t}function pd(s,t,e,n){return Is(s,t,1-Math.exp(-e*n))}function md(s,t=1){return t-Math.abs(Fl(s,t*2)-t)}function gd(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function xd(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function _d(s,t){return s+Math.floor(Math.random()*(t-s+1))}function vd(s,t){return s+Math.random()*(t-s)}function yd(s){return s*(.5-Math.random())}function Md(s){s!==void 0&&(Dc=s);let t=Dc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Sd(s){return s*Rs}function bd(s){return s*rs}function wd(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Ad(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Ul(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Ed(s,t,e,n,i){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),u=o((t+n)/2),d=r((t-n)/2),h=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":s.set(a*u,c*d,c*h,a*l);break;case"YZY":s.set(c*h,a*u,c*d,a*l);break;case"ZXZ":s.set(c*d,c*h,a*u,a*l);break;case"XZX":s.set(a*u,c*g,c*f,a*l);break;case"YXY":s.set(c*f,a*u,c*g,a*l);break;case"ZYZ":s.set(c*g,c*f,a*u,a*l);break;default:It("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bl(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function kh(s,t){if(t.constructor===Float32Array)return s;let e=Bl(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/e,-1)}function Gh(s,t){if(t.constructor===Float32Array)return s;let e=Bl(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*e)}var Ol={DEG2RAD:Rs,RAD2DEG:rs,generateUUID:gs,clamp:Xt,euclideanModulo:Fl,mapLinear:dd,inverseLerp:fd,lerp:Is,damp:pd,pingpong:md,smoothstep:gd,smootherstep:xd,randInt:_d,randFloat:vd,randFloatSpread:yd,seededRandom:Md,degToRad:Sd,radToDeg:bd,isPowerOfTwo:wd,ceilPowerOfTwo:Ad,floorPowerOfTwo:Ul,setQuaternionFromProperEuler:Ed,normalize:Gh,denormalize:kh},Yt=class{static{this.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ge=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],u=n[i+2],d=n[i+3],h=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(d!==v||c!==h||l!==f||u!==g){let p=c*h+l*f+u*g+d*v;p<0&&(h=-h,f=-f,g=-g,v=-v,p=-p);let m=1-a;if(p<.9995){let x=Math.acos(p),E=Math.sin(x);m=Math.sin(m*x)/E,a=Math.sin(a*x)/E,c=c*m+h*a,l=l*m+f*a,u=u*m+g*a,d=d*m+v*a}else{c=c*m+h*a,l=l*m+f*a,u=u*m+g*a,d=d*m+v*a;let x=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=x,l*=x,u*=x,d*=x}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],c=n[i+1],l=n[i+2],u=n[i+3],d=r[o],h=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+u*d+c*f-l*h,t[e+1]=c*g+u*h+l*d-a*f,t[e+2]=l*g+u*f+a*h-c*d,t[e+3]=u*g-a*d-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(i/2),d=a(r/2),h=c(n/2),f=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"YZX":this._x=h*u*d+l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d-h*f*g;break;case"XZY":this._x=h*u*d-l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d+h*f*g;break;default:It("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],d=e[10],h=n+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(o-i)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(u-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+l)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+u)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+o*a+i*l-r*c,this._y=i*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-i*a,this._w=o*u-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let c=1-e;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,e=Math.sin(e*l)/u,this._x=this._x*c+n*e,this._y=this._y*c+i*e,this._z=this._z*c+r*e,this._w=this._w*c+o*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+i*e,this._z=this._z*c+r*e,this._w=this._w*c+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},q=class{static{this.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Fc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Fc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),u=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*u,this.y=n+c*u+a*l-r*d,this.z=i+c*d+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Fa.copy(this).projectOnVector(t),this.sub(Fa)}reflect(t){return this.sub(Fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Fa=new q,Fc=new ge,Lt=class{static{this.prototype.isMatrix3=!0}constructor(t,e,n,i,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){let u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],v=i[0],p=i[3],m=i[6],x=i[1],E=i[4],M=i[7],T=i[2],A=i[5],_=i[8];return r[0]=o*v+a*x+c*T,r[3]=o*p+a*E+c*A,r[6]=o*m+a*M+c*_,r[1]=l*v+u*x+d*T,r[4]=l*p+u*E+d*A,r[7]=l*m+u*M+d*_,r[2]=h*v+f*x+g*T,r[5]=h*p+f*E+g*A,r[8]=h*m+f*M+g*_,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-n*r*u+n*a*c+i*r*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],d=u*o-a*l,h=a*c-u*r,f=l*r-o*c,g=e*d+n*h+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return t[0]=d*v,t[1]=(i*l-u*n)*v,t[2]=(a*n-i*o)*v,t[3]=h*v,t[4]=(u*e-i*c)*v,t[5]=(i*r-a*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return Cs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ua.makeScale(t,e)),this}rotate(t){return Cs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ua.makeRotation(-t)),this}translate(t,e){return Cs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ua.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ua=new Lt,Uc=new Lt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bc=new Lt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Td(){let s={enabled:!0,workingColorSpace:Ns,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Jt&&(i.r=Vn(i.r),i.g=Vn(i.g),i.b=Vn(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Jt&&(i.r=ts(i.r),i.g=ts(i.g),i.b=ts(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Yn?Ls:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Ns]:{primaries:t,whitePoint:n,transfer:Ls,toXYZ:Uc,fromXYZ:Bc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Pe},outputColorSpaceConfig:{drawingBufferColorSpace:Pe}},[Pe]:{primaries:t,whitePoint:n,transfer:Jt,toXYZ:Uc,fromXYZ:Bc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Pe}}}),s}var qt=Td();function Vn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ts(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Vi,eo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Vi===void 0&&(Vi=is("canvas")),Vi.width=t.width,Vi.height=t.height;let i=Vi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Vi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=is("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Vn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Vn(e[n]/255)*255):e[n]=Vn(e[n]);return{data:e,width:t.width,height:t.height}}else return It("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Cd=0,os=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Cd++}),this.uuid=gs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Ba(i[o].image)):r.push(Ba(i[o]))}else r=Ba(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ba(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?eo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(It("Texture: Unable to serialize Texture."),{})}var Rd=0,Oa=new q,Ne=class s extends Sn{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=yn,i=yn,r=Be,o=qn,a=pn,c=Ge,l=s.DEFAULT_ANISOTROPY,u=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=gs(),this.name="",this.source=new os(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Lt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Oa).x}get height(){return this.source.getSize(Oa).y}get depth(){return this.source.getSize(Oa).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){It(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){It(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Sl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case jr:t.x=t.x-Math.floor(t.x);break;case yn:t.x=t.x<0?0:1;break;case Qr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case jr:t.y=t.y-Math.floor(t.y);break;case yn:t.y=t.y<0?0:1;break;case Qr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Ne.DEFAULT_IMAGE=null;Ne.DEFAULT_MAPPING=Sl;Ne.DEFAULT_ANISOTROPY=1;var le=class{static{this.prototype.isVector4=!0}constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],u=c[4],d=c[8],h=c[1],f=c[5],g=c[9],v=c[2],p=c[6],m=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+v)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let E=(l+1)/2,M=(f+1)/2,T=(m+1)/2,A=(u+h)/4,_=(d+v)/4,w=(g+p)/4;return E>M&&E>T?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=A/n,r=_/n):M>T?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=A/i,r=w/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=_/r,i=w/r),this.set(n,i,r,e),this}let x=Math.sqrt((p-g)*(p-g)+(d-v)*(d-v)+(h-u)*(h-u));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(d-v)/x,this.z=(h-u)/x,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},no=class extends Sn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Be,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e),this.textures=[];let i=n.count;for(let r=0;r<i;r++)this.textures[r]=new Ne({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Be,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new os(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xe=class extends no{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ds=class extends Ne{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=we,this.minFilter=we,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var io=class extends Ne{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=we,this.minFilter=we,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var ae=class s{static{this.prototype.isMatrix4=!0}constructor(t,e,n,i,r,o,a,c,l,u,d,h,f,g,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,u,d,h,f,g,v,p)}set(t,e,n,i,r,o,a,c,l,u,d,h,f,g,v,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=u,m[10]=d,m[14]=h,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/ki.setFromMatrixColumn(t,0).length(),r=1/ki.setFromMatrixColumn(t,1).length(),o=1/ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let h=o*u,f=o*d,g=a*u,v=a*d;e[0]=c*u,e[4]=-c*d,e[8]=l,e[1]=f+g*l,e[5]=h-v*l,e[9]=-a*c,e[2]=v-h*l,e[6]=g+f*l,e[10]=o*c}else if(t.order==="YXZ"){let h=c*u,f=c*d,g=l*u,v=l*d;e[0]=h+v*a,e[4]=g*a-f,e[8]=o*l,e[1]=o*d,e[5]=o*u,e[9]=-a,e[2]=f*a-g,e[6]=v+h*a,e[10]=o*c}else if(t.order==="ZXY"){let h=c*u,f=c*d,g=l*u,v=l*d;e[0]=h-v*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*u,e[9]=v-h*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let h=o*u,f=o*d,g=a*u,v=a*d;e[0]=c*u,e[4]=g*l-f,e[8]=h*l+v,e[1]=c*d,e[5]=v*l+h,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let h=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*u,e[4]=v-h*d,e[8]=g*d+f,e[1]=d,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=f*d+g,e[10]=h-v*d}else if(t.order==="XZY"){let h=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*u,e[4]=-d,e[8]=l*u,e[1]=h*d+v,e[5]=o*u,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*u,e[10]=v*d+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Id,t,Pd)}lookAt(t,e,n){let i=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),si.crossVectors(n,We),si.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),si.crossVectors(n,We)),si.normalize(),Sr.crossVectors(We,si),i[0]=si.x,i[4]=Sr.x,i[8]=We.x,i[1]=si.y,i[5]=Sr.y,i[9]=We.y,i[2]=si.z,i[6]=Sr.z,i[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],x=n[3],E=n[7],M=n[11],T=n[15],A=i[0],_=i[4],w=i[8],B=i[12],I=i[1],D=i[5],z=i[9],N=i[13],R=i[2],L=i[6],F=i[10],k=i[14],Y=i[3],V=i[7],K=i[11],et=i[15];return r[0]=o*A+a*I+c*R+l*Y,r[4]=o*_+a*D+c*L+l*V,r[8]=o*w+a*z+c*F+l*K,r[12]=o*B+a*N+c*k+l*et,r[1]=u*A+d*I+h*R+f*Y,r[5]=u*_+d*D+h*L+f*V,r[9]=u*w+d*z+h*F+f*K,r[13]=u*B+d*N+h*k+f*et,r[2]=g*A+v*I+p*R+m*Y,r[6]=g*_+v*D+p*L+m*V,r[10]=g*w+v*z+p*F+m*K,r[14]=g*B+v*N+p*k+m*et,r[3]=x*A+E*I+M*R+T*Y,r[7]=x*_+E*D+M*L+T*V,r[11]=x*w+E*z+M*F+T*K,r[15]=x*B+E*N+M*k+T*et,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],d=t[6],h=t[10],f=t[14],g=t[3],v=t[7],p=t[11],m=t[15],x=c*f-l*h,E=a*f-l*d,M=a*h-c*d,T=o*f-l*u,A=o*h-c*u,_=o*d-a*u;return e*(v*x-p*E+m*M)-n*(g*x-p*T+m*A)+i*(g*E-v*T+m*_)-r*(g*M-v*A+p*_)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],c=t[2],l=t[6],u=t[10];return e*(o*u-a*l)-n*(r*u-a*c)+i*(r*l-o*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],d=t[9],h=t[10],f=t[11],g=t[12],v=t[13],p=t[14],m=t[15],x=e*a-n*o,E=e*c-i*o,M=e*l-r*o,T=n*c-i*a,A=n*l-r*a,_=i*l-r*c,w=u*v-d*g,B=u*p-h*g,I=u*m-f*g,D=d*p-h*v,z=d*m-f*v,N=h*m-f*p,R=x*N-E*z+M*D+T*I-A*B+_*w;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/R;return t[0]=(a*N-c*z+l*D)*L,t[1]=(i*z-n*N-r*D)*L,t[2]=(v*_-p*A+m*T)*L,t[3]=(h*A-d*_-f*T)*L,t[4]=(c*I-o*N-l*B)*L,t[5]=(e*N-i*I+r*B)*L,t[6]=(p*M-g*_-m*E)*L,t[7]=(u*_-h*M+f*E)*L,t[8]=(o*z-a*I+l*w)*L,t[9]=(n*I-e*z-r*w)*L,t[10]=(g*A-v*M+m*x)*L,t[11]=(d*M-u*A-f*x)*L,t[12]=(a*B-o*D-c*w)*L,t[13]=(e*D-n*B+i*w)*L,t[14]=(v*E-g*T-p*x)*L,t[15]=(u*T-d*E+h*x)*L,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,u*a+n,u*c-i*o,0,l*c-i*a,u*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,d=a+a,h=r*l,f=r*u,g=r*d,v=o*u,p=o*d,m=a*d,x=c*l,E=c*u,M=c*d,T=n.x,A=n.y,_=n.z;return i[0]=(1-(v+m))*T,i[1]=(f+M)*T,i[2]=(g-E)*T,i[3]=0,i[4]=(f-M)*A,i[5]=(1-(h+m))*A,i[6]=(p+x)*A,i[7]=0,i[8]=(g+E)*_,i[9]=(p-x)*_,i[10]=(1-(h+v))*_,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=ki.set(i[0],i[1],i[2]).length(),a=ki.set(i[4],i[5],i[6]).length(),c=ki.set(i[8],i[9],i[10]).length();r<0&&(o=-o),an.copy(this);let l=1/o,u=1/a,d=1/c;return an.elements[0]*=l,an.elements[1]*=l,an.elements[2]*=l,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=d,an.elements[9]*=d,an.elements[10]*=d,e.setFromRotationMatrix(an),n.x=o,n.y=a,n.z=c,this}makePerspective(t,e,n,i,r,o,a=tn,c=!1){let l=this.elements,u=2*r/(e-t),d=2*r/(n-i),h=(e+t)/(e-t),f=(n+i)/(n-i),g,v;if(c)g=r/(o-r),v=o*r/(o-r);else if(a===tn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===ns)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=tn,c=!1){let l=this.elements,u=2/(e-t),d=2/(n-i),h=-(e+t)/(e-t),f=-(n+i)/(n-i),g,v;if(c)g=1/(o-r),v=o/(o-r);else if(a===tn)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===ns)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ki=new q,an=new ae,Id=new q(0,0,0),Pd=new q(1,1,1),si=new q,Sr=new q,We=new q,Oc=new ae,zc=new ge,Gn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],u=i[9],d=i[2],h=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Xt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Xt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:It("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Oc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Oc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return zc.setFromEuler(this),this.setFromQuaternion(zc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Gn.DEFAULT_ORDER="XYZ";var Fs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Nd=0,Vc=new q,Gi=new ge,Fn=new ae,br=new q,ws=new q,Ld=new q,Dd=new ge,kc=new q(1,0,0),Gc=new q(0,1,0),Hc=new q(0,0,1),Wc={type:"added"},Fd={type:"removed"},Hi={type:"childadded",child:null},za={type:"childremoved",child:null},Le=class s extends Sn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=gs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new q,e=new Gn,n=new ge,i=new q(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ae},normalMatrix:{value:new Lt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gi.setFromAxisAngle(t,e),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(t,e){return Gi.setFromAxisAngle(t,e),this.quaternion.premultiply(Gi),this}rotateX(t){return this.rotateOnAxis(kc,t)}rotateY(t){return this.rotateOnAxis(Gc,t)}rotateZ(t){return this.rotateOnAxis(Hc,t)}translateOnAxis(t,e){return Vc.copy(t).applyQuaternion(this.quaternion),this.position.add(Vc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(kc,t)}translateY(t){return this.translateOnAxis(Gc,t)}translateZ(t){return this.translateOnAxis(Hc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?br.copy(t):br.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),ws.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(ws,br,this.up):Fn.lookAt(br,ws,this.up),this.quaternion.setFromRotationMatrix(Fn),i&&(Fn.extractRotation(i.matrixWorld),Gi.setFromRotationMatrix(Fn),this.quaternion.premultiply(Gi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Nt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Wc),Hi.child=t,this.dispatchEvent(Hi),Hi.child=null):Nt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Fd),za.child=t,this.dispatchEvent(za),za.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Wc),Hi.child=t,this.dispatchEvent(Hi),Hi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,t,Ld),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,Dd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),d=o(t.shapes),h=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Le.DEFAULT_UP=new q(0,1,0);Le.DEFAULT_MATRIX_AUTO_UPDATE=!0;Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ri=class extends Le{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ud={type:"move"},as=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ri,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ri,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ri,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),m=this._getHandJoint(l,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&h>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ud)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ri;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Hh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ri={h:0,s:0,l:0},wr={h:0,s:0,l:0};function Va(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var kt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,qt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=qt.workingColorSpace){if(t=Fl(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Va(o,r,t+1/3),this.g=Va(o,r,t),this.b=Va(o,r,t-1/3)}return qt.colorSpaceToWorking(this,i),this}setStyle(t,e=Pe){function n(r){r!==void 0&&parseFloat(r)<1&&It("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:It("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);It("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){let n=Hh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):It("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Vn(t.r),this.g=Vn(t.g),this.b=Vn(t.b),this}copyLinearToSRGB(t){return this.r=ts(t.r),this.g=ts(t.g),this.b=ts(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return qt.workingToColorSpace(Ie.copy(this),t),Math.round(Xt(Ie.r*255,0,255))*65536+Math.round(Xt(Ie.g*255,0,255))*256+Math.round(Xt(Ie.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qt.workingColorSpace){qt.workingToColorSpace(Ie.copy(this),e);let n=Ie.r,i=Ie.g,r=Ie.b,o=Math.max(n,i,r),a=Math.min(n,i,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case n:c=(i-r)/d+(i<r?6:0);break;case i:c=(r-n)/d+2;break;case r:c=(n-i)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=qt.workingColorSpace){return qt.workingToColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=Pe){qt.workingToColorSpace(Ie.copy(this),t);let e=Ie.r,n=Ie.g,i=Ie.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ri),this.setHSL(ri.h+t,ri.s+e,ri.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ri),t.getHSL(wr);let n=Is(ri.h,wr.h,e),i=Is(ri.s,wr.s,e),r=Is(ri.l,wr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ie=new kt;kt.NAMES=Hh;var Us=class extends Le{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gn,this.environmentIntensity=1,this.environmentRotation=new Gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},ln=new q,Un=new q,ka=new q,Bn=new q,Wi=new q,qi=new q,qc=new q,Ga=new q,Ha=new q,Wa=new q,qa=new le,Xa=new le,Ya=new le,ci=class s{constructor(t=new q,e=new q,n=new q){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),ln.subVectors(t,e),i.cross(ln);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){ln.subVectors(i,e),Un.subVectors(n,e),ka.subVectors(t,e);let o=ln.dot(ln),a=ln.dot(Un),c=ln.dot(ka),l=Un.dot(Un),u=Un.dot(ka),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(l*c-a*u)*h,g=(o*u-a*c)*h;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,Bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Bn.x),c.addScaledVector(o,Bn.y),c.addScaledVector(a,Bn.z),c)}static getInterpolatedAttribute(t,e,n,i,r,o){return qa.setScalar(0),Xa.setScalar(0),Ya.setScalar(0),qa.fromBufferAttribute(t,e),Xa.fromBufferAttribute(t,n),Ya.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(qa,r.x),o.addScaledVector(Xa,r.y),o.addScaledVector(Ya,r.z),o}static isFrontFacing(t,e,n,i){return ln.subVectors(n,e),Un.subVectors(t,e),ln.cross(Un).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ln.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),ln.cross(Un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;Wi.subVectors(i,n),qi.subVectors(r,n),Ga.subVectors(t,n);let c=Wi.dot(Ga),l=qi.dot(Ga);if(c<=0&&l<=0)return e.copy(n);Ha.subVectors(t,i);let u=Wi.dot(Ha),d=qi.dot(Ha);if(u>=0&&d<=u)return e.copy(i);let h=c*d-u*l;if(h<=0&&c>=0&&u<=0&&c-u>0)return o=c/(c-u),e.copy(n).addScaledVector(Wi,o);Wa.subVectors(t,r);let f=Wi.dot(Wa),g=qi.dot(Wa);if(g>=0&&f<=g)return e.copy(r);let v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(qi,a);let p=u*g-f*d;if(p<=0&&d-u>=0&&f-g>=0)return qc.subVectors(r,i),a=(d-u)/(d-u+(f-g)),e.copy(i).addScaledVector(qc,a);let m=1/(p+v+h);return o=v*m,a=h*m,e.copy(n).addScaledVector(Wi,o).addScaledVector(qi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},hi=class{constructor(t=new q(1/0,1/0,1/0),e=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,cn):cn.fromBufferAttribute(r,o),cn.applyMatrix4(t.matrixWorld),this.expandByPoint(cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ar.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ar.copy(n.boundingBox)),Ar.applyMatrix4(t.matrixWorld),this.union(Ar)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,cn),cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(As),Er.subVectors(this.max,As),Xi.subVectors(t.a,As),Yi.subVectors(t.b,As),Zi.subVectors(t.c,As),oi.subVectors(Yi,Xi),ai.subVectors(Zi,Yi),Ai.subVectors(Xi,Zi);let e=[0,-oi.z,oi.y,0,-ai.z,ai.y,0,-Ai.z,Ai.y,oi.z,0,-oi.x,ai.z,0,-ai.x,Ai.z,0,-Ai.x,-oi.y,oi.x,0,-ai.y,ai.x,0,-Ai.y,Ai.x,0];return!Za(e,Xi,Yi,Zi,Er)||(e=[1,0,0,0,1,0,0,0,1],!Za(e,Xi,Yi,Zi,Er))?!1:(Tr.crossVectors(oi,ai),e=[Tr.x,Tr.y,Tr.z],Za(e,Xi,Yi,Zi,Er))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},On=[new q,new q,new q,new q,new q,new q,new q,new q],cn=new q,Ar=new hi,Xi=new q,Yi=new q,Zi=new q,oi=new q,ai=new q,Ai=new q,As=new q,Er=new q,Tr=new q,Ei=new q;function Za(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Ei.fromArray(s,r);let a=i.x*Math.abs(Ei.x)+i.y*Math.abs(Ei.y)+i.z*Math.abs(Ei.z),c=t.dot(Ei),l=e.dot(Ei),u=n.dot(Ei);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var fe=new q,Cr=new Yt,Bd=0,Mn=class extends Sn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Bd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Uh,this.updateRanges=[],this.gpuType=dn,this.version=0,this._normalizationScale=t!==void 0?Bl(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Cr.fromBufferAttribute(this,e),Cr.applyMatrix3(t),this.setXY(e,Cr.x,Cr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):kh(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Gh(t,this.array)}};var Bs=class extends Mn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Os=class extends Mn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var en=class extends Mn{constructor(t,e,n){super(new Float32Array(t),e,n)}},Od=new hi,Es=new q,$a=new q,ls=class{constructor(t=new q,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Od.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Es.subVectors(t,this.center);let e=Es.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Es,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):($a.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Es.copy(t.center).add($a)),this.expandByPoint(Es.copy(t.center).sub($a))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},zd=0,Qe=new ae,Ja=new Le,$i=new q,qe=new hi,Ts=new hi,be=new q,ui=class s extends Sn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=gs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(hd(t)?Os:Bs)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Lt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Qe.makeRotationFromQuaternion(t),this.applyMatrix4(Qe),this}rotateX(t){return Qe.makeRotationX(t),this.applyMatrix4(Qe),this}rotateY(t){return Qe.makeRotationY(t),this.applyMatrix4(Qe),this}rotateZ(t){return Qe.makeRotationZ(t),this.applyMatrix4(Qe),this}translate(t,e,n){return Qe.makeTranslation(t,e,n),this.applyMatrix4(Qe),this}scale(t,e,n){return Qe.makeScale(t,e,n),this.applyMatrix4(Qe),this}lookAt(t){return Ja.lookAt(t),Ja.updateMatrix(),this.applyMatrix4(Ja.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new en(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&It("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(be.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(be),be.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(be)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ls);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(t){let n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Ts.setFromBufferAttribute(a),this.morphTargetsRelative?(be.addVectors(qe.min,Ts.min),qe.expandByPoint(be),be.addVectors(qe.max,Ts.max),qe.expandByPoint(be)):(qe.expandByPoint(Ts.min),qe.expandByPoint(Ts.max))}qe.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)be.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(be));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)be.fromBufferAttribute(a,l),c&&($i.fromBufferAttribute(t,l),be.add($i)),i=Math.max(i,n.distanceToSquared(be))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Mn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],c=[],l=new Uint8Array(n.count);for(let B=0;B<n.count;B++)a[B]=new q,c[B]=new q;let u=new q,d=new q,h=new q,f=new Yt,g=new Yt,v=new Yt,p=new q,m=new q;function x(B,I,D){l[B]=l[I]=l[D]=1,u.fromBufferAttribute(n,B),d.fromBufferAttribute(n,I),h.fromBufferAttribute(n,D),f.fromBufferAttribute(r,B),g.fromBufferAttribute(r,I),v.fromBufferAttribute(r,D),d.sub(u),h.sub(u),g.sub(f),v.sub(f);let z=1/(g.x*v.y-v.x*g.y);isFinite(z)&&(p.copy(d).multiplyScalar(v.y).addScaledVector(h,-g.y).multiplyScalar(z),m.copy(h).multiplyScalar(g.x).addScaledVector(d,-v.x).multiplyScalar(z),a[B].add(p),a[I].add(p),a[D].add(p),c[B].add(m),c[I].add(m),c[D].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let B=0,I=E.length;B<I;++B){let D=E[B],z=D.start,N=D.count;for(let R=z,L=z+N;R<L;R+=3)x(t.getX(R+0),t.getX(R+1),t.getX(R+2))}let M=new q,T=new q,A=new q,_=new q;function w(B){A.fromBufferAttribute(i,B),_.copy(A);let I=a[B];M.copy(I),M.sub(A.multiplyScalar(A.dot(I))).normalize(),T.crossVectors(_,I);let z=T.dot(c[B])<0?-1:1;o.setXYZW(B,M.x,M.y,M.z,z)}for(let B=0,I=n.count;B<I;++B)l[B]&&w(B);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Mn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let i=new q,r=new q,o=new q,a=new q,c=new q,l=new q,u=new q,d=new q;if(t)for(let h=0,f=t.count;h<f;h+=3){let g=t.getX(h+0),v=t.getX(h+1),p=t.getX(h+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,p),u.subVectors(o,r),d.subVectors(i,r),u.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)i.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),u.subVectors(o,r),d.subVectors(i,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)be.fromBufferAttribute(t,e),be.normalize(),t.setXYZ(e,be.x,be.y,be.z)}toNonIndexed(){function t(a,c){let l=a.array,u=a.itemSize,d=a.normalized,h=new l.constructor(c.length*u),f=0,g=0;for(let v=0,p=c.length;v<p;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*u;for(let m=0;m<u;m++)h[g++]=l[f++]}return new Mn(h,u,d)}if(this.index===null)return It("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,d=l.length;u<d;u++){let h=l[u],f=t(h,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){let f=l[d];u.push(f.toJSON(t.data))}u.length>0&&(i[c]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let l in i){let u=i[l];this.setAttribute(l,u.clone(e))}let r=t.morphAttributes;for(let l in r){let u=[],d=r[l];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,u=o.length;l<u;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Ka=new q,Vd=new q,kd=new Lt,hn=class{constructor(t=new q(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Ka.subVectors(n,e).cross(Vd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(Ka),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||kd.getNormalMatrix(t),i=this.coplanarPoint(Ka).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Gd=0,Hn=class extends Sn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=gs(),this.name="",this.type="Material",this.blending=fs,this.side=_i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dl,this.blendDst=fl,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ih,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hr,this.stencilZFail=Hr,this.stencilZPass=Hr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){It(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){It(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new kt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new hn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Yt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Yt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var zn=new q,ja=new q,Rr=new q,Ir=new q,so=class{constructor(t=new q,e=new q(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zn.copy(this.origin).addScaledVector(this.direction,e),zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ja.copy(t).add(e).multiplyScalar(.5),Rr.copy(e).sub(t).normalize(),Ir.copy(this.origin).sub(ja);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Rr),a=Ir.dot(this.direction),c=-Ir.dot(Rr),l=Ir.lengthSq(),u=Math.abs(1-o*o),d,h,f,g;if(u>0)if(d=o*c-a,h=o*a-c,g=r*u,d>=0)if(h>=-g)if(h<=g){let v=1/u;d*=v,h*=v,f=d*(d+o*h+2*a)+h*(o*d+h+2*c)+l}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(ja).addScaledVector(Rr,h),f}intersectSphere(t,e){if(t.radius<0)return null;zn.subVectors(t.center,this.origin);let n=zn.dot(this.direction),i=zn.dot(zn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,i=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,i=(t.min.x-h.x)*l),u>=0?(r=(t.min.y-h.y)*u,o=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,o=(t.min.y-h.y)*u),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-h.z)*d,c=(t.max.z-h.z)*d):(a=(t.max.z-h.z)*d,c=(t.min.z-h.z)*d),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,zn)!==null}intersectTriangle(t,e,n,i,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,d=t.x-o.x,h=t.y-o.y,f=t.z-o.z,g=e.x-o.x,v=e.y-o.y,p=e.z-o.z,m=n.x-o.x,x=n.y-o.y,E=n.z-o.z,M=Math.abs(c),T=Math.abs(l),A=Math.abs(u),_,w,B,I,D,z,N,R,L,F,k,Y;if(M>=T&&M>=A?(B=c,z=d,L=g,Y=m,c>=0?(_=l,w=u,I=h,D=f,N=v,R=p,F=x,k=E):(_=u,w=l,I=f,D=h,N=p,R=v,F=E,k=x)):T>=A?(B=l,z=h,L=v,Y=x,l>=0?(_=u,w=c,I=f,D=d,N=p,R=g,F=E,k=m):(_=c,w=u,I=d,D=f,N=g,R=p,F=m,k=E)):(B=u,z=f,L=p,Y=E,u>=0?(_=c,w=l,I=d,D=h,N=g,R=v,F=m,k=x):(_=l,w=c,I=h,D=d,N=v,R=g,F=x,k=m)),B===0)return null;let V=_/B,K=w/B,et=1/B,nt=I-V*z,Ct=D-K*z,$=N-V*L,ft=R-K*L,vt=F-V*Y,Et=k-K*Y,xt=vt*ft-Et*$,Ut=nt*Et-Ct*vt,ue=$*Ct-ft*nt;if(i){if(xt<0||Ut<0||ue<0)return null}else if((xt<0||Ut<0||ue<0)&&(xt>0||Ut>0||ue>0))return null;let Pt=xt+Ut+ue;if(Pt===0)return null;let jt=et*(xt*z+Ut*L+ue*Y);return(Pt>0?jt<0:jt>0)?null:this.at(jt/Pt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},cs=class extends Hn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Xc=new ae,Ti=new so,Pr=new ls,Yc=new q,Nr=new q,Lr=new q,Dr=new q,Qa=new q,Fr=new q,Zc=new q,Ur=new q,ke=class extends Le{constructor(t=new ui,e=new cs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){Fr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],d=r[c];u!==0&&(Qa.fromBufferAttribute(d,t),o?Fr.addScaledVector(Qa,u):Fr.addScaledVector(Qa.sub(e),u))}e.add(Fr)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(r),Ti.copy(t.ray).recast(t.near),!(Pr.containsPoint(Ti.origin)===!1&&(Ti.intersectSphere(Pr,Yc)===null||Ti.origin.distanceToSquared(Yc)>(t.far-t.near)**2))&&(Xc.copy(r).invert(),Ti.copy(t.ray).applyMatrix4(Xc),!(n.boundingBox!==null&&Ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ti)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){let p=h[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),E=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let M=x,T=E;M<T;M+=3){let A=a.getX(M),_=a.getX(M+1),w=a.getX(M+2);i=Br(this,m,t,n,l,u,d,A,_,w),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){let x=a.getX(p),E=a.getX(p+1),M=a.getX(p+2);i=Br(this,o,t,n,l,u,d,x,E,M),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){let p=h[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),E=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let M=x,T=E;M<T;M+=3){let A=M,_=M+1,w=M+2;i=Br(this,m,t,n,l,u,d,A,_,w),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){let x=p,E=p+1,M=p+2;i=Br(this,o,t,n,l,u,d,x,E,M),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}};function Hd(s,t,e,n,i,r,o,a){let c;if(t.side===Oe?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===_i,a),c===null)return null;Ur.copy(a),Ur.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(Ur);return l<e.near||l>e.far?null:{distance:l,point:Ur.clone(),object:s}}function Br(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,Nr),s.getVertexPosition(c,Lr),s.getVertexPosition(l,Dr);let u=Hd(s,t,e,n,Nr,Lr,Dr,Zc);if(u){let d=new q;ci.getBarycoord(Zc,Nr,Lr,Dr,d),i&&(u.uv=ci.getInterpolatedAttribute(i,a,c,l,d,new Yt)),r&&(u.uv1=ci.getInterpolatedAttribute(r,a,c,l,d,new Yt)),o&&(u.normal=ci.getInterpolatedAttribute(o,a,c,l,d,new q),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:c,c:l,normal:new q,materialIndex:0};ci.getNormal(Nr,Lr,Dr,h.normal),u.face=h,u.barycoord=d}return u}var ro=class extends Ne{constructor(t=null,e=1,n=1,i,r,o,a,c,l=we,u=we,d,h){super(null,o,a,c,l,u,i,r,d,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ci=new ls,Wd=new Yt(.5,.5),Or=new q,di=class{constructor(t=new hn,e=new hn,n=new hn,i=new hn,r=new hn,o=new hn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=tn,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],f=r[7],g=r[8],v=r[9],p=r[10],m=r[11],x=r[12],E=r[13],M=r[14],T=r[15];if(i[0].setComponents(l-o,f-u,m-g,T-x).normalize(),i[1].setComponents(l+o,f+u,m+g,T+x).normalize(),i[2].setComponents(l+a,f+d,m+v,T+E).normalize(),i[3].setComponents(l-a,f-d,m-v,T-E).normalize(),n)i[4].setComponents(c,h,p,M).normalize(),i[5].setComponents(l-c,f-h,m-p,T-M).normalize();else if(i[4].setComponents(l-c,f-h,m-p,T-M).normalize(),e===tn)i[5].setComponents(l+c,f+h,m+p,T+M).normalize();else if(e===ns)i[5].setComponents(c,h,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(t){Ci.center.set(0,0,0);let e=Wd.distanceTo(t.center);return Ci.radius=.7071067811865476+e,Ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Or.x=i.normal.x>0?t.max.x:t.min.x,Or.y=i.normal.y>0?t.max.y:t.min.y,Or.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Or)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},$c=new ae,oo=class s{constructor(){this.coordinateSystem=tn,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,n=this._frustums;for(let i=0;i<e.length;i++){let r=e[i];$c.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new di),n[i].setFromProjectionMatrix($c,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,n=t._frustums;for(let i=0;i<t._count;i++)e[i]===void 0&&(e[i]=new di),e[i].copy(n[i]);return this._count=t._count,this}clone(){return new s().copy(this)}};var zs=class extends Ne{constructor(t=[],e=Li,n,i,r,o,a,c,l,u){super(t,e,n,i,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Vs=class extends Ne{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Wn=class extends Ne{constructor(t,e,n=un,i,r,o,a=we,c=we,l,u=kn,d=1){if(u!==kn&&u!==Xn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:d};super(h,i,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new os(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},ks=class extends Wn{constructor(t,e=un,n=Li,i,r,o=we,a=we,c,l=kn){let u={width:t,height:t,depth:1},d=[u,u,u,u,u,u];super(t,t,e,n,i,r,o,a,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Gs=class extends Ne{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},fi=class s extends ui{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],d=[],h=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new en(l,3)),this.setAttribute("normal",new en(u,3)),this.setAttribute("uv",new en(d,2));function g(v,p,m,x,E,M,T,A,_,w,B){let I=M/_,D=T/w,z=M/2,N=T/2,R=A/2,L=_+1,F=w+1,k=0,Y=0,V=new q;for(let K=0;K<F;K++){let et=K*D-N;for(let nt=0;nt<L;nt++){let Ct=nt*I-z;V[v]=Ct*x,V[p]=et*E,V[m]=R,l.push(V.x,V.y,V.z),V[v]=0,V[p]=0,V[m]=A>0?1:-1,u.push(V.x,V.y,V.z),d.push(nt/_),d.push(1-K/w),k+=1}}for(let K=0;K<w;K++)for(let et=0;et<_;et++){let nt=h+et+L*K,Ct=h+et+L*(K+1),$=h+(et+1)+L*(K+1),ft=h+(et+1)+L*K;c.push(nt,Ct,ft),c.push(Ct,$,ft),Y+=6}a.addGroup(f,Y,B),f+=Y,h+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var pi=class s extends ui{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,u=c+1,d=t/a,h=e/c,f=[],g=[],v=[],p=[];for(let m=0;m<u;m++){let x=m*h-o;for(let E=0;E<l;E++){let M=E*d-r;g.push(M,-x,0),v.push(0,0,1),p.push(E/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<a;x++){let E=x+l*m,M=x+l*(m+1),T=x+1+l*(m+1),A=x+1+l*m;f.push(E,M,A),f.push(M,T,A)}this.setIndex(f),this.setAttribute("position",new en(g,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}};var Hs=class extends Hn{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new kt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}};function Fi(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(Jc(i))i.isRenderTargetTexture?(It("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Jc(i[0])){let r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function De(s){let t={};for(let e=0;e<s.length;e++){let n=Fi(s[e]);for(let i in n)t[i]=n[i]}return t}function Jc(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function qd(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function zl(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}var Wh={clone:Fi,merge:De},Xd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bn=class extends Hn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xd,this.fragmentShader=Yd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fi(t.uniforms),this.uniformsGroups=qd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new kt().setHex(i.value);break;case"v2":this.uniforms[n].value=new Yt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new q().fromArray(i.value);break;case"v4":this.uniforms[n].value=new le().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Lt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ae().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},ao=class extends bn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ws=class extends Hn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=la,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var lo=class extends Hn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ch,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},co=class extends Hn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ji(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function zr(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var mi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ho=class extends mi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:nl,endingEnd:nl}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case il:r=t,a=2*e-n;break;case sl:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case il:o=t,c=2*n-e;break;case sl:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,u=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-e)/(i-e),v=g*g,p=v*g,m=-h*p+2*h*v-h*g,x=(1+h)*p+(-1.5-2*h)*v+(-.5+h)*g+1,E=(-1-f)*p+(1.5+f)*v+.5*g,M=f*p-f*v;for(let T=0;T!==a;++T)r[T]=m*o[u+T]+x*o[l+T]+E*o[c+T]+M*o[d+T];return r}},uo=class extends mi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=(n-e)/(i-e),d=1-u;for(let h=0;h!==a;++h)r[h]=o[l+h]*d+o[c+h]*u;return r}},fo=class extends mi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},po=class extends mi{interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let g=(n-e)/(i-e),v=1-g;for(let p=0;p!==a;++p)r[p]=o[l+p]*v+o[c+p]*g;return r}let h=a*2,f=t-1;for(let g=0;g!==a;++g){let v=o[l+g],p=o[c+g],m=f*h+g*2,x=d[m],E=d[m+1],M=t*h+g*2,T=u[M],A=u[M+1],_=$d(n,e,x,T,i);r[g]=qh(_,v,E,A,p)}return r}};function qh(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function Zd(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function $d(s,t,e,n,i){let r=(s-t)/(i-t);for(let o=0;o<8;o++){let a=qh(r,t,e,n,i)-s;if(Math.abs(a)<1e-10)break;let c=Zd(r,t,e,n,i);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}var Ye=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ji(e,this.TimeBufferType),this.values=Ji(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ji(t.times,Array),values:Ji(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),zr(t.settings)&&(n.settings={inTangents:Ji(t.settings.inTangents,Array),outTangents:Ji(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new fo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new uo(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ho(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new po(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Ps:e=this.InterpolantFactoryMethodDiscrete;break;case to:e=this.InterpolantFactoryMethodLinear;break;case Gr:e=this.InterpolantFactoryMethodSmooth;break;case el:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return It("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ps;case this.InterpolantFactoryMethodLinear:return to;case this.InterpolantFactoryMethodSmooth:return Gr;case this.InterpolantFactoryMethodBezier:return el}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t;zr(this.settings)&&(Kc(this.settings.inTangents,t),Kc(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;zr(this.settings)&&(jc(this.settings.inTangents,t),jc(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Nt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Nt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){Nt("KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){Nt("KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&ud(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){Nt("KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Gr,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],u=t[a+1];if(l!==u&&(a!==1||l!==t[0]))if(i)c=!0;else{let d=a*n,h=d-n,f=d+n;for(let g=0;g!==n;++g){let v=e[d+g];if(v!==e[h+g]||v!==e[f+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let d=a*n,h=o*n;for(let f=0;f!==n;++f)e[h+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,zr(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Kc(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]+=t}function jc(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}Ye.prototype.ValueTypeName="";Ye.prototype.TimeBufferType=Float32Array;Ye.prototype.ValueBufferType=Float32Array;Ye.prototype.DefaultInterpolation=to;var gi=class extends Ye{constructor(t,e,n){super(t,e,n)}};gi.prototype.ValueTypeName="bool";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=Ps;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var mo=class extends Ye{constructor(t,e,n,i){super(t,e,n,i)}};mo.prototype.ValueTypeName="color";var go=class extends Ye{constructor(t,e,n,i){super(t,e,n,i)}};go.prototype.ValueTypeName="number";var xo=class extends mi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let u=l+a;l!==u;l+=4)ge.slerpFlat(r,0,o,l-a,o,l,c);return r}},qs=class extends Ye{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new xo(this.times,this.values,this.getValueSize(),t)}};qs.prototype.ValueTypeName="quaternion";qs.prototype.InterpolantFactoryMethodSmooth=void 0;var xi=class extends Ye{constructor(t,e,n){super(t,e,n)}};xi.prototype.ValueTypeName="string";xi.prototype.ValueBufferType=Array;xi.prototype.DefaultInterpolation=Ps;xi.prototype.InterpolantFactoryMethodLinear=void 0;xi.prototype.InterpolantFactoryMethodSmooth=void 0;var _o=class extends Ye{constructor(t,e,n,i){super(t,e,n,i)}};_o.prototype.ValueTypeName="vector";var Wr={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(Qc(s)||(this.files[s]=t))},get:function(s){if(this.enabled!==!1&&!Qc(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Qc(s){try{let t=s.slice(s.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var vo=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&i.onStart!==void 0&&i.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,i.onProgress!==void 0&&i.onProgress(u,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){let f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Xh=new vo,hs=class{constructor(t){this.manager=t!==void 0?t:Xh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};hs.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ki=new WeakMap,yo=class extends hs{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Wr.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let d=Ki.get(o);d===void 0&&(d=[],Ki.set(o,d)),d.push({onLoad:e,onError:i})}return o}let a=is("img");function c(){u(),e&&e(this);let d=Ki.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}Ki.delete(this),r.manager.itemEnd(t)}function l(d){u(),i&&i(d),Wr.remove(`image:${t}`);let h=Ki.get(this)||[];for(let f=0;f<h.length;f++){let g=h[f];g.onError&&g.onError(d)}Ki.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Wr.add(`image:${t}`,a),r.manager.itemStart(t),a.fetchPriority=this.priority,a.src=t,a}};var Xs=class extends hs{constructor(t){super(t)}load(t,e,n,i){let r=new Ne,o=new yo(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}},Ys=class extends Le{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Zs=class extends Ys{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.groundColor=new kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},tl=new ae,th=new q,eh=new q,Mo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.mapType=Ge,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new di,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;th.setFromMatrixPosition(t.matrixWorld),e.position.copy(th),eh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(eh),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){tl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(tl,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=i?i.z/r.x:1,a=i?i.w/r.y:1,c=i?i.x/r.x:0,l=i?i.y/r.y:0;t.coordinateSystem===ns||t.reversedDepth?e.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),e.multiply(tl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Vr=new q,kr=new ge,vn=new q,$s=class extends Le{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=tn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Vr,kr,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vr,kr,vn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Vr,kr,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vr,kr,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},li=new q,nh=new Yt,ih=new Yt,Ue=class extends $s{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=rs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Rs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return rs*2*Math.atan(Math.tan(Rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){li.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(li.x,li.y).multiplyScalar(-t/li.z),li.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(li.x,li.y).multiplyScalar(-t/li.z)}getViewSize(t,e){return this.getViewBounds(t,nh,ih),e.subVectors(ih,nh)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Rs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Js=class extends $s{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},rl=class extends Mo{constructor(){super(new Js(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ks=class extends Ys{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.target=new Le,this.shadow=new rl}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var ji=-90,Qi=1,us=class extends Le{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ue(ji,Qi,t,e);i.layers=this.layers,this.add(i);let r=new Ue(ji,Qi,t,e);r.layers=this.layers,this.add(r);let o=new Ue(ji,Qi,t,e);o.layers=this.layers,this.add(o);let a=new Ue(ji,Qi,t,e);a.layers=this.layers,this.add(a);let c=new Ue(ji,Qi,t,e);c.layers=this.layers,this.add(c);let l=new Ue(ji,Qi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===tn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ns)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.mipmapsAutoUpdate=v,t.setRenderTarget(n,5,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(d,h,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},So=class extends Ue{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}};var Vl="\\[\\]\\.:\\/",Jd=new RegExp("["+Vl+"]","g"),kl="[^"+Vl+"]",Kd="[^"+Vl.replace("\\.","")+"]",jd=/((?:WC+[\/:])*)/.source.replace("WC",kl),Qd=/(WCOD+)?/.source.replace("WCOD",Kd),tf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",kl),ef=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",kl),nf=new RegExp("^"+jd+Qd+tf+ef+"$"),sf=["material","materials","bones","map"],ol=class{constructor(t,e,n){let i=n||ie.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ie=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Jd,"")}static parseTrackName(t){let e=nf.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);sf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){It("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){Nt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Nt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Nt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Nt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Nt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Nt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){Nt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;Nt("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Nt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Nt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ie.Composite=ol;ie.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ie.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ie.prototype.GetterByBindingType=[ie.prototype._getValue_direct,ie.prototype._getValue_array,ie.prototype._getValue_arrayElement,ie.prototype._getValue_toArray];ie.prototype.SetterByBindingTypeAndVersioning=[[ie.prototype._setValue_direct,ie.prototype._setValue_direct_setNeedsUpdate,ie.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ie.prototype._setValue_array,ie.prototype._setValue_array_setNeedsUpdate,ie.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ie.prototype._setValue_arrayElement,ie.prototype._setValue_arrayElement_setNeedsUpdate,ie.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ie.prototype._setValue_fromArray,ie.prototype._setValue_fromArray_setNeedsUpdate,ie.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Tv=new Float32Array(1);var al=class{static{this.prototype.isMatrix2=!0}constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};function Gl(s,t,e,n){let i=rf(n);switch(e){case Tl:return s*t;case Rl:return s*t/i.components*i.byteLength;case Ro:return s*t/i.components*i.byteLength;case vi:return s*t*2/i.components*i.byteLength;case Io:return s*t*2/i.components*i.byteLength;case Cl:return s*t*3/i.components*i.byteLength;case pn:return s*t*4/i.components*i.byteLength;case Po:return s*t*4/i.components*i.byteLength;case Qs:case tr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case er:case nr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Lo:case Fo:return Math.max(s,16)*Math.max(t,8)/4;case No:case Do:return Math.max(s,8)*Math.max(t,8)/2;case Uo:case Bo:case zo:case Vo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Oo:case ir:case ko:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Go:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Wo:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case qo:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Xo:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Yo:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case $o:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Jo:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ko:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case jo:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Qo:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case ta:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case ea:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case na:case ia:case sa:return Math.ceil(s/4)*Math.ceil(t/4)*16;case ra:case oa:return Math.ceil(s/4)*Math.ceil(t/4)*8;case sr:case aa:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function rf(s){switch(s){case Ge:case bl:return{byteLength:1,components:1};case ms:case wl:case fn:return{byteLength:2,components:1};case To:case Co:return{byteLength:2,components:4};case un:case Eo:case dn:return{byteLength:4,components:1};case Al:case El:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?It("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function pu(){let s=null,t=!1,e=null,n=null;function i(r,o){n=s.requestAnimationFrame(i),e(r,o)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function af(s){let t=new WeakMap;function e(a,c){let l=a.array,u=a.usage,d=l.byteLength,h=s.createBuffer();s.bindBuffer(c,h),s.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){let u=c.array,d=c.updateRanges;if(s.bindBuffer(l,a),d.length===0)s.bufferSubData(l,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){let g=d[h],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++h,d[h]=v)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){let v=d[f];s.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(s.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}var lf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,df=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,xf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_f=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Mf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Sf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Tf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Cf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Rf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,If=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Pf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Lf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Df=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ff=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Uf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Of=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Vf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,kf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Gf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Wf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$f=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Kf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Qf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,tp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ep=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,np=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ip=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,op=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ap=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cp=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,xp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_p=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mp=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ap=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ep=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Tp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Ip=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Pp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Np=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Up=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Bp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Wp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,$p=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Kp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,em=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,nm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,om=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,am=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hm=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,mm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_m=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ym=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Am=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Em=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Rm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Im=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Nm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Um=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Om=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:lf,alphahash_pars_fragment:cf,alphamap_fragment:hf,alphamap_pars_fragment:uf,alphatest_fragment:df,alphatest_pars_fragment:ff,aomap_fragment:pf,aomap_pars_fragment:mf,batching_pars_vertex:gf,batching_vertex:xf,begin_vertex:_f,beginnormal_vertex:vf,bsdfs:yf,iridescence_fragment:Mf,bumpmap_pars_fragment:Sf,clipping_planes_fragment:bf,clipping_planes_pars_fragment:wf,clipping_planes_pars_vertex:Af,clipping_planes_vertex:Ef,color_fragment:Tf,color_pars_fragment:Cf,color_pars_vertex:Rf,color_vertex:If,common:Pf,defaultnormal_vertex:Nf,displacementmap_pars_vertex:Lf,displacementmap_vertex:Df,emissivemap_fragment:Ff,emissivemap_pars_fragment:Uf,colorspace_fragment:Bf,colorspace_pars_fragment:Of,envmap_fragment:zf,envmap_common_pars_fragment:Vf,envmap_pars_fragment:kf,envmap_pars_vertex:Gf,envmap_physical_pars_fragment:Qf,envmap_vertex:Hf,fog_vertex:Wf,fog_pars_vertex:qf,fog_fragment:Xf,fog_pars_fragment:Yf,gradientmap_pars_fragment:Zf,lightmap_pars_fragment:$f,lights_lambert_fragment:Jf,lights_lambert_pars_fragment:Kf,lights_pars_begin:jf,lights_toon_fragment:tp,lights_toon_pars_fragment:ep,lights_phong_fragment:np,lights_phong_pars_fragment:ip,lights_physical_fragment:sp,lights_physical_pars_fragment:rp,lights_fragment_begin:op,lights_fragment_maps:ap,lights_fragment_end:lp,lightprobes_pars_fragment:cp,logdepthbuf_fragment:hp,logdepthbuf_pars_fragment:up,logdepthbuf_pars_vertex:dp,logdepthbuf_vertex:fp,map_fragment:pp,map_pars_fragment:mp,map_particle_fragment:gp,map_particle_pars_fragment:xp,metalnessmap_fragment:_p,metalnessmap_pars_fragment:vp,morphinstance_vertex:yp,morphcolor_vertex:Mp,morphnormal_vertex:Sp,morphtarget_pars_vertex:bp,morphtarget_vertex:wp,normal_fragment_begin:Ap,normal_fragment_maps:Ep,normal_pars_fragment:Tp,normal_pars_vertex:Cp,normal_vertex:Rp,normalmap_pars_fragment:Ip,clearcoat_normal_fragment_begin:Pp,clearcoat_normal_fragment_maps:Np,clearcoat_pars_fragment:Lp,iridescence_pars_fragment:Dp,opaque_fragment:Fp,packing:Up,premultiplied_alpha_fragment:Bp,project_vertex:Op,dithering_fragment:zp,dithering_pars_fragment:Vp,roughnessmap_fragment:kp,roughnessmap_pars_fragment:Gp,shadowmap_pars_fragment:Hp,shadowmap_pars_vertex:Wp,shadowmap_vertex:qp,shadowmask_pars_fragment:Xp,skinbase_vertex:Yp,skinning_pars_vertex:Zp,skinning_vertex:$p,skinnormal_vertex:Jp,specularmap_fragment:Kp,specularmap_pars_fragment:jp,tonemapping_fragment:Qp,tonemapping_pars_fragment:tm,transmission_fragment:em,transmission_pars_fragment:nm,uv_pars_fragment:im,uv_pars_vertex:sm,uv_vertex:rm,worldpos_vertex:om,background_vert:am,background_frag:lm,backgroundCube_vert:cm,backgroundCube_frag:hm,cube_vert:um,cube_frag:dm,depth_vert:fm,depth_frag:pm,distance_vert:mm,distance_frag:gm,equirect_vert:xm,equirect_frag:_m,linedashed_vert:vm,linedashed_frag:ym,meshbasic_vert:Mm,meshbasic_frag:Sm,meshlambert_vert:bm,meshlambert_frag:wm,meshmatcap_vert:Am,meshmatcap_frag:Em,meshnormal_vert:Tm,meshnormal_frag:Cm,meshphong_vert:Rm,meshphong_frag:Im,meshphysical_vert:Pm,meshphysical_frag:Nm,meshtoon_vert:Lm,meshtoon_frag:Dm,points_vert:Fm,points_frag:Um,shadow_vert:Bm,shadow_frag:Om,sprite_vert:zm,sprite_frag:Vm},gt={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Lt},alphaMap:{value:null},alphaMapTransform:{value:new Lt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Lt}},envmap:{envMap:{value:null},envMapRotation:{value:new Lt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Lt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Lt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Lt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Lt},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Lt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Lt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Lt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Lt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Lt},alphaTest:{value:0},uvTransform:{value:new Lt}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Lt},alphaMap:{value:null},alphaMapTransform:{value:new Lt},alphaTest:{value:0}}},Tn={basic:{uniforms:De([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:De([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new kt(0)},envMapIntensity:{value:1}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:De([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:De([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:De([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:De([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:De([gt.points,gt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:De([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:De([gt.common,gt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:De([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:De([gt.sprite,gt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Lt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Lt}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distance:{uniforms:De([gt.common,gt.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distance_vert,fragmentShader:Vt.distance_frag},shadow:{uniforms:De([gt.lights,gt.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};Tn.physical={uniforms:De([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Lt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Lt},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Lt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Lt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Lt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Lt},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Lt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Lt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Lt},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Lt},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Lt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Lt},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Lt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};var ca={r:0,b:0,g:0},km=new ae,mu=new Lt;mu.set(-1,0,0,0,1,0,0,0,1);function Gm(s,t,e,n,i,r){let o=new kt(0),a=i===!0?0:1,c,l,u=null,d=0,h=null;function f(x){let E=x.isScene===!0?x.background:null;if(E&&E.isTexture){let M=x.backgroundBlurriness>0;E=t.get(E,M)}return E}function g(x){let E=!1,M=f(x);M===null?p(o,a):M&&M.isColor&&(p(M,1),E=!0);let T=s.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(x,E){let M=f(E);M&&M.isCubeTexture?(l===void 0&&(l=new ke(new fi(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Fi(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:Oe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,A,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(km.makeRotationFromEuler(E.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(mu),l.material.toneMapped=qt.getTransfer(M.colorSpace)!==Jt,(u!==M||d!==M.version||h!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,h=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new ke(new pi(2,2),new bn({name:"BackgroundMaterial",uniforms:Fi(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=qt.getTransfer(M.colorSpace)!==Jt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||h!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,d=M.version,h=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,E){x.getRGB(ca,zl(s)),e.buffers.color.setClear(ca.r,ca.g,ca.b,E,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,E=1){o.set(x),a=E,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,p(o,a)},render:g,addToRenderList:v,dispose:m}}function Hm(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null),r=i,o=!1;function a(D,z,N,R,L){let F=!1,k=d(D,R,N,z);r!==k&&(r=k,l(r.object)),F=f(D,R,N,L),F&&g(D,R,N,L),L!==null&&t.update(L,s.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,M(D,z,N,R),L!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(L).buffer))}function c(){return s.createVertexArray()}function l(D){return s.bindVertexArray(D)}function u(D){return s.deleteVertexArray(D)}function d(D,z,N,R){let L=R.wireframe===!0,F=n[z.id];F===void 0&&(F={},n[z.id]=F);let k=D.isInstancedMesh===!0?D.id:0,Y=F[k];Y===void 0&&(Y={},F[k]=Y);let V=Y[N.id];V===void 0&&(V={},Y[N.id]=V);let K=V[L];return K===void 0&&(K=h(c()),V[L]=K),K}function h(D){let z=[],N=[],R=[];for(let L=0;L<e;L++)z[L]=0,N[L]=0,R[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:N,attributeDivisors:R,object:D,attributes:{},index:null}}function f(D,z,N,R){let L=r.attributes,F=z.attributes,k=0,Y=N.getAttributes();for(let V in Y)if(Y[V].location>=0){let et=L[V],nt=F[V];if(nt===void 0&&(V==="instanceMatrix"&&D.instanceMatrix&&(nt=D.instanceMatrix),V==="instanceColor"&&D.instanceColor&&(nt=D.instanceColor)),et===void 0||et.attribute!==nt||nt&&et.data!==nt.data)return!0;k++}return r.attributesNum!==k||r.index!==R}function g(D,z,N,R){let L={},F=z.attributes,k=0,Y=N.getAttributes();for(let V in Y)if(Y[V].location>=0){let et=F[V];et===void 0&&(V==="instanceMatrix"&&D.instanceMatrix&&(et=D.instanceMatrix),V==="instanceColor"&&D.instanceColor&&(et=D.instanceColor));let nt={};nt.attribute=et,et&&et.data&&(nt.data=et.data),L[V]=nt,k++}r.attributes=L,r.attributesNum=k,r.index=R}function v(){let D=r.newAttributes;for(let z=0,N=D.length;z<N;z++)D[z]=0}function p(D){m(D,0)}function m(D,z){let N=r.newAttributes,R=r.enabledAttributes,L=r.attributeDivisors;N[D]=1,R[D]===0&&(s.enableVertexAttribArray(D),R[D]=1),L[D]!==z&&(s.vertexAttribDivisor(D,z),L[D]=z)}function x(){let D=r.newAttributes,z=r.enabledAttributes;for(let N=0,R=z.length;N<R;N++)z[N]!==D[N]&&(s.disableVertexAttribArray(N),z[N]=0)}function E(D,z,N,R,L,F,k){k===!0?s.vertexAttribIPointer(D,z,N,L,F):s.vertexAttribPointer(D,z,N,R,L,F)}function M(D,z,N,R){v();let L=R.attributes,F=N.getAttributes(),k=z.defaultAttributeValues;for(let Y in F){let V=F[Y];if(V.location>=0){let K=L[Y];if(K===void 0&&(Y==="instanceMatrix"&&D.instanceMatrix&&(K=D.instanceMatrix),Y==="instanceColor"&&D.instanceColor&&(K=D.instanceColor)),K!==void 0){let et=K.normalized,nt=K.itemSize,Ct=t.get(K);if(Ct===void 0)continue;let $=Ct.buffer,ft=Ct.type,vt=Ct.bytesPerElement,Et=ft===s.INT||ft===s.UNSIGNED_INT||K.gpuType===Eo;if(K.isInterleavedBufferAttribute){let xt=K.data,Ut=xt.isInterleavedBuffer===!0?xt.stride:xt.itemSize,ue=K.offset;if(xt.isInstancedInterleavedBuffer||xt.isInstancedBufferAttribute){for(let Pt=0;Pt<V.locationSize;Pt++)m(V.location+Pt,xt.meshPerAttribute);D.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=xt.meshPerAttribute*xt.count)}else for(let Pt=0;Pt<V.locationSize;Pt++)p(V.location+Pt);s.bindBuffer(s.ARRAY_BUFFER,$);for(let Pt=0;Pt<V.locationSize;Pt++)E(V.location+Pt,nt/V.locationSize,ft,et,Ut*vt,(ue+nt/V.locationSize*Pt)*vt,Et)}else{if(K.isInstancedBufferAttribute){for(let xt=0;xt<V.locationSize;xt++)m(V.location+xt,K.meshPerAttribute);D.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let xt=0;xt<V.locationSize;xt++)p(V.location+xt);s.bindBuffer(s.ARRAY_BUFFER,$);for(let xt=0;xt<V.locationSize;xt++)E(V.location+xt,nt/V.locationSize,ft,et,nt*vt,nt/V.locationSize*xt*vt,Et)}}else if(k!==void 0){let et=k[Y];if(et!==void 0)switch(et.length){case 2:s.vertexAttrib2fv(V.location,et);break;case 3:s.vertexAttrib3fv(V.location,et);break;case 4:s.vertexAttrib4fv(V.location,et);break;default:s.vertexAttrib1fv(V.location,et)}}}}x()}function T(){B();for(let D in n){let z=n[D];for(let N in z){let R=z[N];for(let L in R){let F=R[L];for(let k in F)u(F[k].object),delete F[k];delete R[L]}}delete n[D]}}function A(D){if(n[D.id]===void 0)return;let z=n[D.id];for(let N in z){let R=z[N];for(let L in R){let F=R[L];for(let k in F)u(F[k].object),delete F[k];delete R[L]}}delete n[D.id]}function _(D){for(let z in n){let N=n[z];for(let R in N){let L=N[R];if(L[D.id]===void 0)continue;let F=L[D.id];for(let k in F)u(F[k].object),delete F[k];delete L[D.id]}}}function w(D){for(let z in n){let N=n[z],R=D.isInstancedMesh===!0?D.id:0,L=N[R];if(L!==void 0){for(let F in L){let k=L[F];for(let Y in k)u(k[Y].object),delete k[Y];delete L[F]}delete N[R],Object.keys(N).length===0&&delete n[z]}}}function B(){I(),o=!0,r!==i&&(r=i,l(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:B,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfObject:w,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:p,disableUnusedAttributes:x}}function Wm(s,t,e){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),e.update(l,n,1)}function o(c,l,u){u!==0&&(s.drawArraysInstanced(n,c,l,u),e.update(l,n,u))}function a(c,l,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let f=0;f<u;f++)h+=l[f];e.update(h,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function qm(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let _=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(_){return!(_!==pn&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){let w=_===fn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==Ge&&_!==dn&&!w&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function c(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",u=c(l);u!==l&&(It("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=e.logarithmicDepthBuffer===!0&&d===!1;e.reversedDepthBuffer===!0&&d===!1&&It("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&d===!0&&It("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),A=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:E,maxFragmentUniforms:M,maxSamples:T,samples:A}}function Xm(s){let t=this,e=null,n=0,i=!1,r=!1,o=new hn,a=new Lt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||i;return i=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){e=u(d,h,0)},this.setState=function(d,h,f){let g=d.clippingPlanes,v=d.clipIntersection,p=d.clipShadows,m=s.get(d);if(!i||g===null||g.length===0||r&&!p)r?u(null):l();else{let x=r?0:n,E=x*4,M=m.clippingState||null;c.value=M,M=u(g,h,E,f);for(let T=0;T!==E;++T)M[T]=e[T];m.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(d,h,f,g){let v=d!==null?d.length:0,p=null;if(v!==0){if(p=c.value,g!==!0||p===null){let m=f+v*4,x=h.matrixWorldInverse;a.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let E=0,M=f;E!==v;++E,M+=4)o.copy(d[E]).applyMatrix4(x,a),o.normal.toArray(p,M),p[M+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}var ar=class extends Xe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new zs(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new fi(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Oe,blending:Pi});r.uniforms.tEquirect.value=e;let o=new ke(i,r),a=e.minFilter;return e.minFilter===qn&&(e.minFilter=Be),new us(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},Yh=256,Ym=3,Zm=20,gu=256,xu=16,$m=3,Jm=new q,Km=new kt,ua=class s{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new us(1,10,null),this._boxMesh=new ke(new fi(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=Jm}=r,c=this._renderer;this._setSize(o);let l=this._allocateTarget(),u=this._getSourceTarget(!0);e>0&&(u.texture.mipmapsAutoUpdate=!1);let d=c.autoClear,h=c.autoClearColor,f=c.autoClearDepth,g=c.autoClearStencil,v=t.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,v===null&&(t.background=c.getClearColor(Km));let p=new us(n,i,u);return p.position.copy(a),p.update(c,t),c.autoClear=d,c.autoClearColor=h,c.autoClearDepth=f,c.autoClearStencil=g,t.background=v,e>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(l,e)),this._applyPMREM(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$h(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Yh,Ul(t))}_fromTexture(t,e){t.mapping===Li||t.mapping===ps?this._setSize(t.image.length===0?Yh:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){let t=this._cubeSize,e=Zh(t,!1,!1),n=Math.log2(t)-Ym;for(let i=0;i<=n;i++)e.texture.mipmaps.push({width:t>>i,height:t>>i});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Zh(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){let i=this._boxMesh,r=this._cubeCamera;i.material=n,r.renderTarget=t,r.activeMipmapLevel=e;let o=t.width>>e;t.viewport.set(0,0,o,o),r.update(this._renderer,i),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===Li||t.mapping===ps?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jh()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=$h()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=jm(),this._integrationMaterial=Qm());let e=this._cubeSize,n=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/xu);for(let o=0;o<=n;o++){let a=s.lodToRoughness(o,n);if(o>n-$m)r.roughness.value=a,this._renderCube(t,o,this._integrationMaterial);else{let c=a>0?Math.log2(e)+.5*Math.log2(6/(gu*Math.pow(a,4)))+.5:0;i.roughness.value=a,i.lodBias.value=c,this._renderCube(t,o,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=tg());let n=this._blurMaterial,i=n.uniforms,r=this._sourceTarget;i.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,i.envMap.value=r.texture,this._renderCube(t,0,n),i.envMap.value=t.texture,this._renderCube(r,0,n)}};function Zh(s,t,e){return new ar(s,{minFilter:qn,generateMipmaps:t,type:fn,colorSpace:Ns,depthBuffer:e})}function lr(s,t,e){return new bn({name:s,uniforms:t,vertexShader:Vt.cube_vert,fragmentShader:e,side:Oe,blending:Pi,depthTest:!1,depthWrite:!1})}function jm(){return lr("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${gu}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Qm(){return lr("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:xu}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function tg(){return lr("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Zm}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function $h(){return lr("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Jh(){return lr("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function eg(s){let t=new WeakMap,e=new WeakMap,n=null;function i(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===bo||f===wo)if(t.has(h)){let g=t.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let v=new ar(g.height);return v.fromEquirectangularTexture(s,h),t.set(h,v),h.addEventListener("dispose",l),a(v.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){let f=h.mapping,g=f===bo||f===wo,v=f===Li||f===ps;if(g||v){let p=e.get(h),m=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return n===null&&(n=new ua(s)),p=g?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),p.texture;if(p!==void 0)return p.texture;{let x=h.image;return g&&x&&x.height>0||v&&x&&c(x)?(n===null&&(n=new ua(s)),p=g?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function a(h,f){return f===bo?h.mapping=Li:f===wo&&(h.mapping=ps),h}function c(h){let f=0,g=6;for(let v=0;v<g;v++)h[v]!==void 0&&f++;return f===g}function l(h){let f=h.target;f.removeEventListener("dispose",l);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function ng(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Cs("WebGLRenderer: "+n+" extension not supported."),i}}}function ig(s,t,e,n){let i={},r=new WeakMap,o=new FinalizationRegistry(g=>delete i[g]);function a(g){c(g.target)}function c(g){g.index!==null&&t.remove(g.index);for(let p in g.attributes)t.remove(g.attributes[p]);g.removeEventListener("dispose",a),delete i[g.id],o.unregister(g);let v=r.get(g);v&&(t.remove(v),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function l(g,v){return i[v.id]!==void 0||(v.addEventListener("dispose",a),i[v.id]=new WeakRef(v),o.register(v,v.id,v),e.memory.geometries++),v}function u(g){let v=g.attributes;for(let p in v)t.update(v[p],s.ARRAY_BUFFER)}function d(g){let v=g.index,p=g.attributes.position,m=0;if(p===void 0)return;let x=v!==null?v.array.length:p.array.length/3-1,E=p.count>=65535?Os:Bs,M=new E(Math.ceil(x/3)*6,1),T=M.array;if(v!==null){let _=v.array;m=v.version;for(let w=0,B=0;w<x;w+=3){let I=_[w+0],D=_[w+1],z=_[w+2];T[B++]=I,T[B++]=D,T[B++]=D,T[B++]=z,T[B++]=z,T[B++]=I}}else{m=p.version;for(let _=0,w=0;_<x;_+=3){let B=_+0,I=_+1,D=_+2;T[w++]=B,T[w++]=I,T[w++]=I,T[w++]=D,T[w++]=D,T[w++]=B}}M.version=m;let A=r.get(g);A&&t.remove(A),r.set(g,M)}function h(g){let v=r.get(g);if(v){let p=g.index;p!==null&&v.version<p.version&&d(g)}else d(g);return r.get(g)}function f(){for(let g in i){let v=i[g].deref();v!==void 0&&c(v)}}return{get:l,update:u,getWireframeAttribute:h,dispose:f}}function sg(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,h){s.drawElements(n,h,r,d*o),e.update(h,n,1)}function l(d,h,f){f!==0&&(s.drawElementsInstanced(n,h,r,d*o,f),e.update(h,n,f))}function u(d,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let v=0;for(let p=0;p<f;p++)v+=h[p];e.update(v,n,1)}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function rg(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:Nt("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function og(s,t,e){let n=new WeakMap,i=new le;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let B=function(){_.dispose(),n.delete(a),a.removeEventListener("dispose",B)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],E=0;f===!0&&(E=1),g===!0&&(E=2),v===!0&&(E=3);let M=a.attributes.position.count*E,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let A=new Float32Array(M*T*4*d),_=new Ds(A,M,T,d);_.type=dn,_.needsUpdate=!0;let w=E*4;for(let I=0;I<d;I++){let D=p[I],z=m[I],N=x[I],R=M*T*4*I;for(let L=0;L<D.count;L++){let F=L*w;f===!0&&(i.fromBufferAttribute(D,L),A[R+F+0]=i.x,A[R+F+1]=i.y,A[R+F+2]=i.z,A[R+F+3]=0),g===!0&&(i.fromBufferAttribute(z,L),A[R+F+4]=i.x,A[R+F+5]=i.y,A[R+F+6]=i.z,A[R+F+7]=0),v===!0&&(i.fromBufferAttribute(N,L),A[R+F+8]=i.x,A[R+F+9]=i.y,A[R+F+10]=i.z,A[R+F+11]=N.itemSize===4?i.w:1)}}h={count:d,texture:_,size:new Yt(M,T)},n.set(a,h),a.addEventListener("dispose",B)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];let g=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",g),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:r}}function ag(s,t,e,n,i){let r=new WeakMap;function o(l){let u=i.render.frame,d=l.geometry,h=t.get(l,d);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}var lg={[ml]:"LINEAR_TONE_MAPPING",[gl]:"REINHARD_TONE_MAPPING",[xl]:"CINEON_TONE_MAPPING",[_l]:"ACES_FILMIC_TONE_MAPPING",[yl]:"AGX_TONE_MAPPING",[Ml]:"NEUTRAL_TONE_MAPPING",[vl]:"CUSTOM_TONE_MAPPING"};function cg(s,t,e,n,i,r){let o=new Xe(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=null,u=new ui;u.setAttribute("position",new en([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new en([0,2,0,0,2,0],2));let d=new ao({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new ke(u,d),f=new Js(-1,1,1,-1,0,1),g=null,v=null,p=!1,m,x=null,E=[],M=!1;this.setSize=function(T,A){o.setSize(T,A),a!==null&&a.setSize(T,A),c!==null&&c.setSize(T,A);for(let _=0;_<E.length;_++){let w=E[_];w.setSize&&w.setSize(T,A)}},this.setEffects=function(T){E=T,M=E.length>0&&E[0].isRenderPass===!0;let A=o.width,_=o.height;E.length>0&&a===null&&(a=new Xe(A,_,{type:fn,depthBuffer:!1,stencilBuffer:!1}),c=new Xe(A,_,{type:fn,depthBuffer:!1,stencilBuffer:!1}));let w=i===!0&&E.some(B=>B.needsDepthTexture===!0);w!==(o.depthTexture!==null)&&(w===!0&&l===null&&(l=new Wn(A,_),r===!0&&(l.format=Xn,l.type=Di)),o.dispose(),o.depthTexture=w?l:null,o.resolveDepthBuffer=w,o.storeMultisampledDepthBuffer=w);for(let B=0;B<E.length;B++){let I=E[B];I.setSize&&I.setSize(A,_),w&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(l)}},this.begin=function(T,A){if(p||T.toneMapping===An&&E.length===0)return!1;if(x=A,A!==null){let _=A.width,w=A.height;(o.width!==_||o.height!==w)&&this.setSize(_,w)}return M===!1&&T.setRenderTarget(o),m=T.toneMapping,T.toneMapping=An,!0},this.hasRenderPass=function(){return M},this.end=function(T,A){T.toneMapping=m,p=!0;let _=o,w=a;for(let B=0;B<E.length;B++){let I=E[B];I.enabled!==!1&&(I.render(T,w,_,A),I.needsSwap!==!1&&(_=w,w=w===a?c:a))}if(g!==T.outputColorSpace||v!==T.toneMapping){g=T.outputColorSpace,v=T.toneMapping,d.defines={},qt.getTransfer(g)===Jt&&(d.defines.SRGB_TRANSFER="");let B=lg[v];B&&(d.defines[B]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=_.texture,T.setRenderTarget(x),T.render(h,f),x=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var _u=new Ne,vu=new Wn(1,1),yu=new ks(1),Mu=new Ds,Su=new io,bu=new zs,Kh=[],jh=[],Qh=new Float32Array(16),tu=new Float32Array(9),eu=new Float32Array(4);function _s(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=Kh[i];if(r===void 0&&(r=new Float32Array(i),Kh[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function xe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function _e(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function fa(s,t){let e=jh[t];e===void 0&&(e=new Int32Array(t),jh[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function hg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function ug(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;s.uniform2fv(this.addr,t),_e(e,t)}}function dg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(xe(e,t))return;s.uniform3fv(this.addr,t),_e(e,t)}}function fg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;s.uniform4fv(this.addr,t),_e(e,t)}}function pg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),_e(e,t)}else{if(xe(e,n))return;eu.set(n),s.uniformMatrix2fv(this.addr,!1,eu),_e(e,n)}}function mg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),_e(e,t)}else{if(xe(e,n))return;tu.set(n),s.uniformMatrix3fv(this.addr,!1,tu),_e(e,n)}}function gg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),_e(e,t)}else{if(xe(e,n))return;Qh.set(n),s.uniformMatrix4fv(this.addr,!1,Qh),_e(e,n)}}function xg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function _g(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;s.uniform2iv(this.addr,t),_e(e,t)}}function vg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;s.uniform3iv(this.addr,t),_e(e,t)}}function yg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;s.uniform4iv(this.addr,t),_e(e,t)}}function Mg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Sg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;s.uniform2uiv(this.addr,t),_e(e,t)}}function bg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;s.uniform3uiv(this.addr,t),_e(e,t)}}function wg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;s.uniform4uiv(this.addr,t),_e(e,t)}}function pa(s){return s.version===0&&(s.compareFunction=Nl,s.needsUpdate=!0),s}function Ag(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?r=pa(vu):r=_u,e.setTexture2D(t||r,i)}function Eg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Su,i)}function Tg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=pa(yu):r=bu,e.setTextureCube(t||r,i)}function Cg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Mu,i)}function Rg(s){switch(s){case 5126:return hg;case 35664:return ug;case 35665:return dg;case 35666:return fg;case 35674:return pg;case 35675:return mg;case 35676:return gg;case 5124:case 35670:return xg;case 35667:case 35671:return _g;case 35668:case 35672:return vg;case 35669:case 35673:return yg;case 5125:return Mg;case 36294:return Sg;case 36295:return bg;case 36296:return wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ag;case 35679:case 36299:case 36307:return Eg;case 35680:case 36300:case 36308:case 36293:return Tg;case 36289:case 36303:case 36311:case 36292:return Cg}}function Ig(s,t){s.uniform1fv(this.addr,t)}function Pg(s,t){let e=_s(t,this.size,2);s.uniform2fv(this.addr,e)}function Ng(s,t){let e=_s(t,this.size,3);s.uniform3fv(this.addr,e)}function Lg(s,t){let e=_s(t,this.size,4);s.uniform4fv(this.addr,e)}function Dg(s,t){let e=_s(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Fg(s,t){let e=_s(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Ug(s,t){let e=_s(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Bg(s,t){s.uniform1iv(this.addr,t)}function Og(s,t){s.uniform2iv(this.addr,t)}function zg(s,t){s.uniform3iv(this.addr,t)}function Vg(s,t){s.uniform4iv(this.addr,t)}function kg(s,t){s.uniform1uiv(this.addr,t)}function Gg(s,t){s.uniform2uiv(this.addr,t)}function Hg(s,t){s.uniform3uiv(this.addr,t)}function Wg(s,t){s.uniform4uiv(this.addr,t)}function qg(s,t,e){let n=this.cache,i=t.length,r=fa(e,i);xe(n,r)||(s.uniform1iv(this.addr,r),_e(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=pa(vu):o=_u;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function Xg(s,t,e){let n=this.cache,i=t.length,r=fa(e,i);xe(n,r)||(s.uniform1iv(this.addr,r),_e(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Su,r[o])}function Yg(s,t,e){let n=this.cache,i=t.length,r=fa(e,i);xe(n,r)||(s.uniform1iv(this.addr,r),_e(n,r));let o;this.type===s.SAMPLER_CUBE_SHADOW?o=pa(yu):o=bu;for(let a=0;a!==i;++a)e.setTextureCube(t[a]||o,r[a])}function Zg(s,t,e){let n=this.cache,i=t.length,r=fa(e,i);xe(n,r)||(s.uniform1iv(this.addr,r),_e(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Mu,r[o])}function $g(s){switch(s){case 5126:return Ig;case 35664:return Pg;case 35665:return Ng;case 35666:return Lg;case 35674:return Dg;case 35675:return Fg;case 35676:return Ug;case 5124:case 35670:return Bg;case 35667:case 35671:return Og;case 35668:case 35672:return zg;case 35669:case 35673:return Vg;case 5125:return kg;case 36294:return Gg;case 36295:return Hg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return qg;case 35679:case 36299:case 36307:return Xg;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return Zg}}var ql=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Rg(e.type)}},Xl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=$g(e.type)}},Yl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},Hl=/(\w+)(\])?(\[|\.)?/g;function nu(s,t){s.seq.push(t),s.map[t.id]=t}function Jg(s,t,e){let n=s.name,i=n.length;for(Hl.lastIndex=0;;){let r=Hl.exec(n),o=Hl.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){nu(e,l===void 0?new ql(a,s,t):new Xl(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new Yl(a),nu(e,d)),e=d}}}var xs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),c=t.getUniformLocation(e,a.name);Jg(a,c,this)}let i=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function iu(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var Kg=37297,jg=0;function Qg(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var su=new Lt;function t0(s){qt._getMatrix(su,qt.workingColorSpace,s);let t=`mat3( ${su.elements.map(e=>e.toFixed(4))} )`;switch(qt.getTransfer(s)){case Ls:return[t,"LinearTransferOETF"];case Jt:return[t,"sRGBTransferOETF"];default:return It("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function ru(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Qg(s.getShaderSource(t),a)}else return r}function e0(s,t){let e=t0(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var n0={[ml]:"Linear",[gl]:"Reinhard",[xl]:"Cineon",[_l]:"ACESFilmic",[yl]:"AgX",[Ml]:"Neutral",[vl]:"Custom"};function i0(s,t){let e=n0[t];return e===void 0?(It("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var ha=new q;function s0(){qt.getLuminanceCoefficients(ha);let s=ha.x.toFixed(4),t=ha.y.toFixed(4),e=ha.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function r0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(or).join(`
`)}function o0(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function a0(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function or(s){return s!==""}function ou(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function au(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var l0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zl(s){return s.replace(l0,c0)}function c0(s,t){let e=Vt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Zl(e)}var h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lu(s){return s.replace(h0,u0)}function u0(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function cu(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var d0={[Ii]:"SHADOWMAP_TYPE_PCF",[ds]:"SHADOWMAP_TYPE_VSM"};function f0(s){return d0[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var p0={[ps]:"ENVMAP_MODE_REFRACTION"};function m0(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":p0[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var g0={[pl]:"ENVMAP_BLENDING_MULTIPLY",[Ah]:"ENVMAP_BLENDING_MIX",[Eh]:"ENVMAP_BLENDING_ADD"};function x0(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":g0[s.combine]||"ENVMAP_BLENDING_NONE"}function _0(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=f0(e),l=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=m0(e),d=x0(e),h=r0(e),f=o0(r),g=i.createProgram(),v,p,m=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(or).join(`
`),v.length>0&&(v+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(or).join(`
`),p.length>0&&(p+=`
`)):(v=[cu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(or).join(`
`),p=[cu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==An?"#define TONE_MAPPING":"",e.toneMapping!==An?Vt.tonemapping_pars_fragment:"",e.toneMapping!==An?i0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,e0("linearToOutputTexel",e.outputColorSpace),s0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(or).join(`
`)),o=Zl(o),o=ou(o,e),o=au(o,e),a=Zl(a),a=ou(a,e),a=au(a,e),o=lu(o),a=lu(a),e.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,v=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,p=["#define varying in",e.glslVersion===Ll?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ll?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=m+v+o,E=m+p+a,M=iu(i,i.VERTEX_SHADER,x),T=iu(i,i.FRAGMENT_SHADER,E);i.attachShader(g,M),i.attachShader(g,T),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function A(I){if(s.debug.checkShaderErrors){let D=i.getProgramInfoLog(g)||"",z=i.getShaderInfoLog(M)||"",N=i.getShaderInfoLog(T)||"",R=D.trim(),L=z.trim(),F=N.trim(),k=!0,Y=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(k=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,M,T);else{let V=ru(i,M,"vertex"),K=ru(i,T,"fragment");Nt("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+R+`
`+V+`
`+K)}else R!==""?It("WebGLProgram: Program Info Log:",R):(L===""||F==="")&&(Y=!1);Y&&(I.diagnostics={runnable:k,programLog:R,vertexShader:{log:L,prefix:v},fragmentShader:{log:F,prefix:p}})}i.deleteShader(M),i.deleteShader(T),_=new xs(i,g),w=a0(i,g)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let B=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=i.getProgramParameter(g,Kg)),B},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jg++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=M,this.fragmentShader=T,this}var v0=0,$l=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Jl(t),e.set(t,n)),n}},Jl=class{constructor(t){this.id=v0++,this.code=t,this.usedTimes=0}};function y0(s){return s===vi||s===ir||s===sr}function M0(s,t,e,n,i,r){let o=new Fs,a=new $l,c=new Set,l=[],u=new Map,d=n.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return c.add(_),_===0?"uv":`uv${_}`}function g(_,w,B,I,D,z){let N=I.fog,R=D.geometry,L=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,F=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,k=t.get(_.envMap||L,F),Y=h[_.type],V=n.precision;_.precision!==null&&(V=n.getMaxPrecision(_.precision),V!==_.precision&&It("WebGLProgram.getParameters:",_.precision,"not supported, using",V,"instead."));let K=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,et=K!==void 0?K.length:0,nt=0;R.morphAttributes.position!==void 0&&(nt=1),R.morphAttributes.normal!==void 0&&(nt=2),R.morphAttributes.color!==void 0&&(nt=3);let Ct,$,ft,vt;if(Y){let mt=Tn[Y];Ct=mt.vertexShader,$=mt.fragmentShader}else{Ct=_.vertexShader,$=_.fragmentShader;let mt=a.getVertexShaderStage(_),Qt=a.getFragmentShaderStage(_);a.update(_,mt,Qt),ft=mt.id,vt=Qt.id}let Et=s.getRenderTarget(),xt=s.state.buffers.depth.getReversed(),Ut=D.isInstancedMesh===!0,ue=D.isBatchedMesh===!0,Pt=!!_.map,jt=!!_.matcap,te=!!k,Gt=te&&k.isPMREMTexture===!0,Ae=!!_.aoMap,pe=!!_.lightMap,Ve=!!_.bumpMap&&_.wireframe===!1,ce=!!_.normalMap,_n=!!_.displacementMap,ye=!!_.emissiveMap,$e=!!_.metalnessMap,Je=!!_.roughnessMap,Ke=_.anisotropy>0,O=_.clearcoat>0,je=_.diffuseRoughness>0,re=_.dispersion>0,oe=_.retroreflectivity>0,pt=_.iridescence>0,me=_.sheen>0,Rt=_.transmission>0,Dt=Ke&&!!_.anisotropyMap,C=O&&!!_.clearcoatMap,y=O&&!!_.clearcoatNormalMap,H=O&&!!_.clearcoatRoughnessMap,it=je&&!!_.diffuseRoughnessMap,tt=pt&&!!_.iridescenceMap,ot=pt&&!!_.iridescenceThicknessMap,ut=me&&!!_.sheenColorMap,J=me&&!!_.sheenRoughnessMap,j=!!_.specularMap,lt=!!_.specularColorMap,P=!!_.specularIntensityMap,Q=Rt&&!!_.transmissionMap,Z=Rt&&!!_.thicknessMap,ct=!!_.gradientMap,rt=!!_.alphaMap,at=_.alphaTest>0,At=!!_.alphaHash,zt=!!_.extensions,st=An;_.toneMapped&&(Et===null||Et.isXRRenderTarget===!0)&&(st=s.toneMapping);let Tt=Gt?k.isCompressedCubeTexture?k.image[0].mipmaps:k.mipmaps:null,Bt={shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:Ct,fragmentShader:$,defines:_.defines,customVertexShaderID:ft,customFragmentShaderID:vt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:V,batching:ue,batchingColor:ue&&D._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&D.instanceColor!==null,instancingMorph:Ut&&D.morphTexture!==null,outputColorSpace:Et===null?s.outputColorSpace:Et.isXRRenderTarget===!0?Et.texture.colorSpace:qt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Pt,matcap:jt,envMap:te,envMapMode:te&&k.mapping,envMapPMREM:Gt,envMapMaxLod:Gt?Tt.length-1:null,envMapSize:Gt?Tt[0].width:null,aoMap:Ae,lightMap:pe,bumpMap:Ve,normalMap:ce,displacementMap:_n,emissiveMap:ye,normalMapObjectSpace:ce&&_.normalMapType===Rh,normalMapTangentSpace:ce&&_.normalMapType===la,packedNormalMap:ce&&_.normalMapType===la&&y0(_.normalMap.format),metalnessMap:$e,roughnessMap:Je,anisotropy:Ke,anisotropyMap:Dt,clearcoat:O,clearcoatMap:C,clearcoatNormalMap:y,clearcoatRoughnessMap:H,diffuseRoughness:je,diffuseRoughnessMap:it,dispersion:re,retroreflection:oe,iridescence:pt,iridescenceMap:tt,iridescenceThicknessMap:ot,sheen:me,sheenColorMap:ut,sheenRoughnessMap:J,specularMap:j,specularColorMap:lt,specularIntensityMap:P,transmission:Rt,transmissionMap:Q,thicknessMap:Z,gradientMap:ct,opaque:_.transparent===!1&&_.blending===fs&&_.alphaToCoverage===!1,alphaMap:rt,alphaTest:at,alphaHash:At,combine:_.combine,mapUv:Pt&&f(_.map.channel),aoMapUv:Ae&&f(_.aoMap.channel),lightMapUv:pe&&f(_.lightMap.channel),bumpMapUv:Ve&&f(_.bumpMap.channel),normalMapUv:ce&&f(_.normalMap.channel),displacementMapUv:_n&&f(_.displacementMap.channel),emissiveMapUv:ye&&f(_.emissiveMap.channel),metalnessMapUv:$e&&f(_.metalnessMap.channel),roughnessMapUv:Je&&f(_.roughnessMap.channel),anisotropyMapUv:Dt&&f(_.anisotropyMap.channel),clearcoatMapUv:C&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:y&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:it&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:tt&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:ut&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:J&&f(_.sheenRoughnessMap.channel),specularMapUv:j&&f(_.specularMap.channel),specularColorMapUv:lt&&f(_.specularColorMap.channel),specularIntensityMapUv:P&&f(_.specularIntensityMap.channel),transmissionMapUv:Q&&f(_.transmissionMap.channel),thicknessMapUv:Z&&f(_.thicknessMap.channel),alphaMapUv:rt&&f(_.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(ce||Ke),vertexNormals:!!R.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!R.attributes.uv&&(Pt||rt),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||R.attributes.normal===void 0&&ce===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:xt,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:R.attributes.position!==void 0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:nt,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.filter(mt=>mt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:st,decodeVideoTexture:Pt&&_.map.isVideoTexture===!0&&qt.getTransfer(_.map.colorSpace)===Jt,decodeVideoTextureEmissive:ye&&_.emissiveMap.isVideoTexture===!0&&qt.getTransfer(_.emissiveMap.colorSpace)===Jt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===wn,flipSided:_.side===Oe,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:zt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&_.extensions.multiDraw===!0||ue)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Bt.vertexUv1s=c.has(1),Bt.vertexUv2s=c.has(2),Bt.vertexUv3s=c.has(3),c.clear(),Bt}function v(_){let w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(let B in _.defines)w.push(B),w.push(_.defines[B]);return _.isRawShaderMaterial===!1&&(p(w,_),m(w,_),w.push(s.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function p(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapPMREM),_.push(w.envMapMaxLod),_.push(w.envMapSize),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.diffuseRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.numSunLights),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numSunLightShadows),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.numLightProbeGrids),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function m(_,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.diffuseRoughness&&o.enable(25),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function x(_){let w=h[_.type],B;if(w){let I=Tn[w];B=Wh.clone(I.uniforms)}else B=_.uniforms;return B}function E(_,w){let B=u.get(w);return B!==void 0?++B.usedTimes:(B=new _0(s,w,_,i),l.push(B),u.set(w,B)),B}function M(_){if(--_.usedTimes===0){let w=l.indexOf(_);l[w]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){a.remove(_)}function A(){a.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:E,releaseProgram:M,releaseShaderCache:T,programs:l,dispose:A}}function S0(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function b0(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function hu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function uu(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,v,p,m){let x=s[t];return x===void 0?(x={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:v,renderOrder:h.renderOrder,z:p,group:m},s[t]=x):(x.id=h.id,x.object=h,x.geometry=f,x.material=g,x.materialVariant=o(h),x.groupOrder=v,x.renderOrder=h.renderOrder,x.z=p,x.group=m),t++,x}function c(h,f,g,v,p,m,x){x.reversedDepth===!0&&(p=-p);let E=a(h,f,g,v,p,m);g.transmission>0?n.push(E):g.transparent===!0?i.push(E):e.push(E)}function l(h,f,g,v,p,m){let x=a(h,f,g,v,p,m);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):e.unshift(x)}function u(h,f){e.length>1&&e.sort(h||b0),n.length>1&&n.sort(f||hu),i.length>1&&i.sort(f||hu)}function d(){for(let h=t,f=s.length;h<f;h++){let g=s[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:d,sort:u}}function w0(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new uu,s.set(n,[o])):i>=r.length?(o=new uu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function A0(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new q,color:new kt};break;case"SpotLight":e={position:new q,direction:new q,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new q,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new q,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new q,halfWidth:new q,halfHeight:new q};break}return s[t.id]=e,e}}}function E0(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var T0=0;function C0(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function R0(s){let t=new A0,e=E0(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new q);let i=new q,r=new ae,o=new ae;function a(l){let u=0,d=0,h=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,x=0,E=0,M=0,T=0,A=0,_=0,w=0,B=0,I=0;l.sort(C0);for(let z=0,N=l.length;z<N;z++){let R=l[z],L=R.color,F=R.intensity,k=R.distance,Y=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===vi?Y=R.shadow.map.texture:Y=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)u+=L.r*F,d+=L.g*F,h+=L.b*F;else if(R.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(R.sh.coefficients[V],F);I++}else if(R.isSunLight){let V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let K=R.shadow,et=e.get(R);et.shadowIntensity=K.intensity,et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),n.sunShadow[g]=et,n.sunShadowMap[g]=Y;let nt=K.getViewportCount();for(let Ct=0;Ct<nt;Ct++)n.sunShadowMatrix[v+Ct]=K.getMatrix(Ct),n.sunShadowCascade[v+Ct]=K._cascadeData[Ct];v+=nt,g++}n.sun[f]=V,f++}else if(R.isDirectionalLight){let V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let K=R.shadow,et=e.get(R);et.shadowIntensity=K.intensity,et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize=K.mapSize,n.directionalShadow[p]=et,n.directionalShadowMap[p]=Y,n.directionalShadowMatrix[p]=R.shadow.matrix,T++}n.directional[p]=V,p++}else if(R.isSpotLight){let V=t.get(R);V.position.setFromMatrixPosition(R.matrixWorld),V.color.copy(L).multiplyScalar(F),V.distance=k,V.coneCos=Math.cos(R.angle),V.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),V.decay=R.decay,n.spot[x]=V;let K=R.shadow;if(R.map&&(n.spotLightMap[w]=R.map,w++,K.updateMatrices(R),R.castShadow&&B++),n.spotLightMatrix[x]=K.matrix,R.castShadow){let et=e.get(R);et.shadowIntensity=K.intensity,et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize=K.mapSize,n.spotShadow[x]=et,n.spotShadowMap[x]=Y,_++}x++}else if(R.isRectAreaLight){let V=t.get(R);V.color.copy(L).multiplyScalar(F),V.halfWidth.set(R.width*.5,0,0),V.halfHeight.set(0,R.height*.5,0),n.rectArea[E]=V,E++}else if(R.isPointLight){let V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),V.distance=R.distance,V.decay=R.decay,R.castShadow){let K=R.shadow,et=e.get(R);et.shadowIntensity=K.intensity,et.shadowBias=K.bias,et.shadowNormalBias=K.normalBias,et.shadowRadius=K.radius,et.shadowMapSize=K.mapSize,et.shadowCameraNear=K.camera.near,et.shadowCameraFar=K.camera.far,n.pointShadow[m]=et,n.pointShadowMap[m]=Y,n.pointShadowMatrix[m]=R.shadow.matrix,A++}n.point[m]=V,m++}else if(R.isHemisphereLight){let V=t.get(R);V.skyColor.copy(R.color).multiplyScalar(F),V.groundColor.copy(R.groundColor).multiplyScalar(F),n.hemi[M]=V,M++}}E>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let D=n.hash;(D.sunLength!==f||D.directionalLength!==p||D.pointLength!==m||D.spotLength!==x||D.rectAreaLength!==E||D.hemiLength!==M||D.numSunShadows!==g||D.numDirectionalShadows!==T||D.numPointShadows!==A||D.numSpotShadows!==_||D.numSpotMaps!==w||D.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=p,n.spot.length=x,n.rectArea.length=E,n.point.length=m,n.hemi.length=M,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=A,n.pointShadowMap.length=A,n.pointShadowMatrix.length=A,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+w-B,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=B,n.numLightProbes=I,D.sunLength=f,D.directionalLength=p,D.pointLength=m,D.spotLength=x,D.rectAreaLength=E,D.hemiLength=M,D.numSunShadows=g,D.numDirectionalShadows=T,D.numPointShadows=A,D.numSpotShadows=_,D.numSpotMaps=w,D.numLightProbes=I,n.version=T0++)}function c(l,u){let d=0,h=0,f=0,g=0,v=0,p=0,m=u.matrixWorldInverse;for(let x=0,E=l.length;x<E;x++){let M=l[x];if(M.isSunLight){let T=n.sun[d];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(m),d++}else if(M.isDirectionalLight){let T=n.directional[h];T.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(m),h++}else if(M.isSpotLight){let T=n.spot[g];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(m),T.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(m),g++}else if(M.isRectAreaLight){let T=n.rectArea[v];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),v++}else if(M.isPointLight){let T=n.point[f];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let T=n.hemi[p];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(m),p++}}}return{setup:a,setupView:c,state:n}}function du(s){let t=new R0(s),e=[],n=[],i=[];function r(d){u.camera=d,e.length=0,n.length=0,i.length=0}function o(d){d.isLightProbeGrid?i.push(d):e.push(d)}function a(d){n.push(d)}function c(){t.setup(e),i.sort((d,h)=>d.priority-h.priority||d.id-h.id)}function l(d){t.setupView(e,d)}let u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function I0(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new du(s),t.set(i,[a])):r>=o.length?(a=new du(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var P0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,L0=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],D0=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],fu=new ae,rr=new q,Wl=new q;function F0(s,t,e){let n=new di,i=new Yt,r=new Yt,o=new le,a=new lo,c=new co,l={},u=e.maxTextureSize,d={[_i]:Oe,[Oe]:_i,[wn]:wn},h=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:P0,fragmentShader:N0}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new ui;g.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new ke(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ii;let m=this.type;this.render=function(A,_,w){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;this.type===oh&&(It("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ii);let B=s.getRenderTarget(),I=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),z=s.state;z.setBlending(Pi),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let N=m!==this.type;N&&_.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(L=>L.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,L=A.length;R<L;R++){let F=A[R],k=F.shadow;if(k===void 0){It("WebGLShadowMap:",F,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);let Y=k.getFrameExtents();i.multiply(Y),r.copy(k.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/Y.x),i.x=r.x*Y.x,k.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/Y.y),i.y=r.y*Y.y,k.mapSize.y=r.y));let V=s.state.buffers.depth.getReversed();if(k.camera._reversedDepth=V,k.map===null||N===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===ds){if(F.isPointLight){It("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Xe(i.x,i.y,{format:vi,type:fn,minFilter:Be,magFilter:Be,generateMipmaps:!1}),k.map.texture.name=F.name+".shadowMap",k.map.depthTexture=new Wn(i.x,i.y,dn),k.map.depthTexture.name=F.name+".shadowMapDepth",k.map.depthTexture.format=kn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=we,k.map.depthTexture.magFilter=we}else F.isPointLight?(k.map=new ar(i.x),k.map.depthTexture=new ks(i.x,un)):(k.map=new Xe(i.x,i.y),k.map.depthTexture=new Wn(i.x,i.y,un)),k.map.depthTexture.name=F.name+".shadowMap",k.map.depthTexture.format=kn,this.type===Ii?(k.map.depthTexture.compareFunction=V?Pl:Il,k.map.depthTexture.minFilter=Be,k.map.depthTexture.magFilter=Be):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=we,k.map.depthTexture.magFilter=we);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==i.x||k.map.height!==i.y)&&k.map.setSize(i.x,i.y);let K=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();F.isPointLight!==!0&&k.updateMatrices(F,w);let et=(k.camera.layers.mask&4294967294)!==0?k.camera.layers:w.layers;for(let nt=0;nt<K;nt++){let Ct=k.getCamera(nt);if(F.isPointLight){let $=k.camera,ft=k.matrix,vt=F.distance||$.far;vt!==$.far&&($.far=vt,$.updateProjectionMatrix()),rr.setFromMatrixPosition(F.matrixWorld),$.position.copy(rr),Wl.copy($.position),Wl.add(L0[nt]),$.up.copy(D0[nt]),$.lookAt(Wl),$.updateMatrixWorld(),ft.makeTranslation(-rr.x,-rr.y,-rr.z),fu.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),k._frustum.setFromProjectionMatrix(fu,$.coordinateSystem,$.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)s.setRenderTarget(k.map,nt),s.clear();else{nt===0&&(s.setRenderTarget(k.map),s.clear());let $=k.getViewport(nt);o.set(r.x*$.x,r.y*$.y,r.x*$.z,r.y*$.w),z.viewport(o)}n=k.getFrustum(nt),M(_,w,Ct,F,et,this.type)}k.isPointLightShadow!==!0&&this.type===ds&&x(k,w),k.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(B,I,D)};function x(A,_){let w=t.update(v);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null?A.mapPass=new Xe(i.x,i.y,{format:vi,type:fn}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),h.uniforms.shadow_pass.value=A.map.depthTexture,h.uniforms.resolution.value.set(A.map.width,A.map.height),h.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(_,null,w,h,v,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value.set(A.map.width,A.map.height),f.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(_,null,w,f,v,null)}function E(A,_,w,B){let I=null,D=w.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)I=D;else if(I=w.isPointLight===!0?c:a,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let z=I.uuid,N=_.uuid,R=l[z];R===void 0&&(R={},l[z]=R);let L=R[N];L===void 0&&(L=I.clone(),R[N]=L,_.addEventListener("dispose",T)),I=L}if(I.visible=_.visible,I.wireframe=_.wireframe,B===ds?I.side=_.shadowSide!==null?_.shadowSide:_.side:I.side=_.shadowSide!==null?_.shadowSide:d[_.side],I.alphaMap=_.alphaMap,I.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,I.map=_.map,I.clipShadows=_.clipShadows,I.clippingPlanes=_.clippingPlanes,I.clipIntersection=_.clipIntersection,I.displacementMap=_.displacementMap,I.displacementScale=_.displacementScale,I.displacementBias=_.displacementBias,I.wireframeLinewidth=_.wireframeLinewidth,I.linewidth=_.linewidth,w.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let z=s.properties.get(I);z.light=w}return I}function M(A,_,w,B,I,D){if(A.visible===!1)return;if(A.layers.test(I)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&D===ds)&&(!A.frustumCulled||A.intersectsFrustum(n))){A.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,A.matrixWorld);let R=t.update(A),L=A.material;if(Array.isArray(L)){let F=R.groups;for(let k=0,Y=F.length;k<Y;k++){let V=F[k],K=L[V.materialIndex];if(K&&K.visible){let et=E(A,K,B,D);A.onBeforeShadow(s,A,_,w,R,et,V),s.renderBufferDirect(w,null,R,et,A,V),A.onAfterShadow(s,A,_,w,R,et,V)}}}else if(L.visible){let F=E(A,L,B,D);A.onBeforeShadow(s,A,_,w,R,F,null),s.renderBufferDirect(w,null,R,F,A,null),A.onAfterShadow(s,A,_,w,R,F,null)}}let N=A.children;for(let R=0,L=N.length;R<L;R++)M(N[R],_,w,B,I,D)}function T(A){A.target.removeEventListener("dispose",T);for(let w in l){let B=l[w],I=A.target.uuid;I in B&&(B[I].dispose(),delete B[I])}}}function U0(s,t){function e(){let P=!1,Q=new le,Z=null,ct=new le(0,0,0,0);return{setMask:function(rt){Z!==rt&&!P&&(s.colorMask(rt,rt,rt,rt),Z=rt)},setLocked:function(rt){P=rt},setClear:function(rt,at,At,zt,st){st===!0&&(rt*=zt,at*=zt,At*=zt),Q.set(rt,at,At,zt),ct.equals(Q)===!1&&(s.clearColor(rt,at,At,zt),ct.copy(Q))},reset:function(){P=!1,Z=null,ct.set(-1,0,0,0)}}}function n(){let P=!1,Q=!1,Z=null,ct=null,rt=null;return{setReversed:function(at){if(Q!==at){let At=t.get("EXT_clip_control");at?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),Q=at;let zt=rt;rt=null,this.setClear(zt)}},getReversed:function(){return Q},setTest:function(at){at?xt(s.DEPTH_TEST):Ut(s.DEPTH_TEST)},setMask:function(at){Z!==at&&!P&&(s.depthMask(at),Z=at)},setFunc:function(at){if(Q&&(at=Vh[at]),ct!==at){switch(at){case qr:s.depthFunc(s.NEVER);break;case Xr:s.depthFunc(s.ALWAYS);break;case Yr:s.depthFunc(s.LESS);break;case es:s.depthFunc(s.LEQUAL);break;case Zr:s.depthFunc(s.EQUAL);break;case $r:s.depthFunc(s.GEQUAL);break;case Jr:s.depthFunc(s.GREATER);break;case Kr:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ct=at}},setLocked:function(at){P=at},setClear:function(at){rt!==at&&(rt=at,Q&&(at=1-at),s.clearDepth(at))},reset:function(){P=!1,Z=null,ct=null,rt=null,Q=!1}}}function i(){let P=!1,Q=null,Z=null,ct=null,rt=null,at=null,At=null,zt=null,st=null;return{setTest:function(Tt){P||(Tt?xt(s.STENCIL_TEST):Ut(s.STENCIL_TEST))},setMask:function(Tt){Q!==Tt&&!P&&(s.stencilMask(Tt),Q=Tt)},setFunc:function(Tt,Bt,mt){(Z!==Tt||ct!==Bt||rt!==mt)&&(s.stencilFunc(Tt,Bt,mt),Z=Tt,ct=Bt,rt=mt)},setOp:function(Tt,Bt,mt){(at!==Tt||At!==Bt||zt!==mt)&&(s.stencilOp(Tt,Bt,mt),at=Tt,At=Bt,zt=mt)},setLocked:function(Tt){P=Tt},setClear:function(Tt){st!==Tt&&(s.clearStencil(Tt),st=Tt)},reset:function(){P=!1,Q=null,Z=null,ct=null,rt=null,at=null,At=null,zt=null,st=null}}}let r=new e,o=new n,a=new i,c={},l=new WeakMap,u={},d={},h={},f=new WeakMap,g=[],v=null,p=!1,m=null,x=null,E=null,M=null,T=null,A=null,_=null,w=new kt(0,0,0),B=0,I=!1,D=null,z=null,N=null,R=null,L=null,F=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,Y=0,V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(V)[1]),k=Y>=1):V.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),k=Y>=2);let K=null,et={},nt=s.getParameter(s.SCISSOR_BOX),Ct=s.getParameter(s.VIEWPORT),$=new le().fromArray(nt),ft=new le().fromArray(Ct);function vt(P,Q,Z,ct){let rt=new Uint8Array(4),at=s.createTexture();s.bindTexture(P,at),s.texParameteri(P,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(P,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<Z;At++)P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY?s.texImage3D(Q,0,s.RGBA,1,1,ct,0,s.RGBA,s.UNSIGNED_BYTE,rt):s.texImage2D(Q+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,rt);return at}let Et={};Et[s.TEXTURE_2D]=vt(s.TEXTURE_2D,s.TEXTURE_2D,1),Et[s.TEXTURE_CUBE_MAP]=vt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Et[s.TEXTURE_2D_ARRAY]=vt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Et[s.TEXTURE_3D]=vt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),xt(s.DEPTH_TEST),o.setFunc(es),Ve(!1),ce(ll),xt(s.CULL_FACE),Ae(Pi);function xt(P){u[P]!==!0&&(s.enable(P),u[P]=!0)}function Ut(P){u[P]!==!1&&(s.disable(P),u[P]=!1)}function ue(P,Q){return h[P]!==Q?(s.bindFramebuffer(P,Q),h[P]=Q,P===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=Q),P===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=Q),!0):!1}function Pt(P,Q){let Z=g,ct=!1;if(P){Z=f.get(Q),Z===void 0&&(Z=[],f.set(Q,Z));let rt=P.textures;if(Z.length!==rt.length||Z[0]!==s.COLOR_ATTACHMENT0){for(let at=0,At=rt.length;at<At;at++)Z[at]=s.COLOR_ATTACHMENT0+at;Z.length=rt.length,ct=!0}}else Z[0]!==s.BACK&&(Z[0]=s.BACK,ct=!0);ct&&s.drawBuffers(Z)}function jt(P){return v!==P?(s.useProgram(P),v=P,!0):!1}let te={[Ni]:s.FUNC_ADD,[lh]:s.FUNC_SUBTRACT,[ch]:s.FUNC_REVERSE_SUBTRACT};te[hh]=s.MIN,te[uh]=s.MAX;let Gt={[dh]:s.ZERO,[fh]:s.ONE,[ph]:s.SRC_COLOR,[dl]:s.SRC_ALPHA,[yh]:s.SRC_ALPHA_SATURATE,[_h]:s.DST_COLOR,[gh]:s.DST_ALPHA,[mh]:s.ONE_MINUS_SRC_COLOR,[fl]:s.ONE_MINUS_SRC_ALPHA,[vh]:s.ONE_MINUS_DST_COLOR,[xh]:s.ONE_MINUS_DST_ALPHA,[Mh]:s.CONSTANT_COLOR,[Sh]:s.ONE_MINUS_CONSTANT_COLOR,[bh]:s.CONSTANT_ALPHA,[wh]:s.ONE_MINUS_CONSTANT_ALPHA};function Ae(P,Q,Z,ct,rt,at,At,zt,st,Tt){if(P===Pi){p===!0&&(Ut(s.BLEND),p=!1);return}if(p===!1&&(xt(s.BLEND),p=!0),P!==ah){if(P!==m||Tt!==I){if((x!==Ni||T!==Ni)&&(s.blendEquation(s.FUNC_ADD),x=Ni,T=Ni),Tt)switch(P){case fs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case cl:s.blendFunc(s.ONE,s.ONE);break;case hl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ul:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Nt("WebGLState: Invalid blending: ",P);break}else switch(P){case fs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case cl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case hl:Nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ul:Nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Nt("WebGLState: Invalid blending: ",P);break}E=null,M=null,A=null,_=null,w.set(0,0,0),B=0,m=P,I=Tt}return}rt=rt||Q,at=at||Z,At=At||ct,(Q!==x||rt!==T)&&(s.blendEquationSeparate(te[Q],te[rt]),x=Q,T=rt),(Z!==E||ct!==M||at!==A||At!==_)&&(s.blendFuncSeparate(Gt[Z],Gt[ct],Gt[at],Gt[At]),E=Z,M=ct,A=at,_=At),(zt.equals(w)===!1||st!==B)&&(s.blendColor(zt.r,zt.g,zt.b,st),w.copy(zt),B=st),m=P,I=!1}function pe(P,Q){P.side===wn?Ut(s.CULL_FACE):xt(s.CULL_FACE);let Z=P.side===Oe;Q&&(Z=!Z),Ve(Z),P.blending===fs&&P.transparent===!1?Ae(Pi):Ae(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),r.setMask(P.colorWrite);let ct=P.stencilWrite;a.setTest(ct),ct&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),ye(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?xt(s.SAMPLE_ALPHA_TO_COVERAGE):Ut(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(P){D!==P&&(P?s.frontFace(s.CW):s.frontFace(s.CCW),D=P)}function ce(P){P!==sh?(xt(s.CULL_FACE),P!==z&&(P===ll?s.cullFace(s.BACK):P===rh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ut(s.CULL_FACE),z=P}function _n(P){P!==N&&(k&&s.lineWidth(P),N=P)}function ye(P,Q,Z){P?(xt(s.POLYGON_OFFSET_FILL),(R!==Q||L!==Z)&&(R=Q,L=Z,o.getReversed()&&(Q=-Q,Z=-Z),s.polygonOffset(Q,Z))):Ut(s.POLYGON_OFFSET_FILL)}function $e(P){P?xt(s.SCISSOR_TEST):Ut(s.SCISSOR_TEST)}function Je(P){P===void 0&&(P=s.TEXTURE0+F-1),K!==P&&(s.activeTexture(P),K=P)}function Ke(P,Q,Z){Z===void 0&&(K===null?Z=s.TEXTURE0+F-1:Z=K);let ct=et[Z];ct===void 0&&(ct={type:void 0,texture:void 0},et[Z]=ct),(ct.type!==P||ct.texture!==Q)&&(K!==Z&&(s.activeTexture(Z),K=Z),s.bindTexture(P,Q||Et[P]),ct.type=P,ct.texture=Q)}function O(){let P=et[K];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function je(){try{s.compressedTexImage2D(...arguments)}catch(P){Nt("WebGLState:",P)}}function re(){try{s.compressedTexImage3D(...arguments)}catch(P){Nt("WebGLState:",P)}}function oe(){try{s.texSubImage2D(...arguments)}catch(P){Nt("WebGLState:",P)}}function pt(){try{s.texSubImage3D(...arguments)}catch(P){Nt("WebGLState:",P)}}function me(){try{s.compressedTexSubImage2D(...arguments)}catch(P){Nt("WebGLState:",P)}}function Rt(){try{s.compressedTexSubImage3D(...arguments)}catch(P){Nt("WebGLState:",P)}}function Dt(){try{s.texStorage2D(...arguments)}catch(P){Nt("WebGLState:",P)}}function C(){try{s.texStorage3D(...arguments)}catch(P){Nt("WebGLState:",P)}}function y(){try{s.texImage2D(...arguments)}catch(P){Nt("WebGLState:",P)}}function H(){try{s.texImage3D(...arguments)}catch(P){Nt("WebGLState:",P)}}function it(P){return d[P]!==void 0?d[P]:s.getParameter(P)}function tt(P,Q){d[P]!==Q&&(s.pixelStorei(P,Q),d[P]=Q)}function ot(P){$.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),$.copy(P))}function ut(P){ft.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),ft.copy(P))}function J(P,Q){let Z=l.get(Q);Z===void 0&&(Z=new WeakMap,l.set(Q,Z));let ct=Z.get(P);ct===void 0&&(ct=s.getUniformBlockIndex(Q,P.name),s.uniformBlockBinding(Q,ct,ct),Z.set(P,ct))}function j(P,Q,Z){let rt=l.get(Q).get(P);c[rt]!==Z&&(s.bindBufferBase(s.UNIFORM_BUFFER,rt,Z),c[rt]=Z)}function lt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},d={},K=null,et={},h={},c={},f=new WeakMap,g=[],v=null,p=!1,m=null,x=null,E=null,M=null,T=null,A=null,_=null,w=new kt(0,0,0),B=0,I=!1,D=null,z=null,N=null,R=null,L=null,$.set(0,0,s.canvas.width,s.canvas.height),ft.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:xt,disable:Ut,bindFramebuffer:ue,drawBuffers:Pt,useProgram:jt,setBlending:Ae,setMaterial:pe,setFlipSided:Ve,setCullFace:ce,setLineWidth:_n,setPolygonOffset:ye,setScissorTest:$e,activeTexture:Je,bindTexture:Ke,unbindTexture:O,compressedTexImage2D:je,compressedTexImage3D:re,texImage2D:y,texImage3D:H,pixelStorei:tt,getParameter:it,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:Dt,texStorage3D:C,texSubImage2D:oe,texSubImage3D:pt,compressedTexSubImage2D:me,compressedTexSubImage3D:Rt,scissor:ot,viewport:ut,reset:lt}}function B0(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Yt,u=new WeakMap,d=new Set,h,f=new WeakMap,g=new Set,v=new FinalizationRegistry(C=>g.delete(C)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,y){return p?new OffscreenCanvas(C,y):is("canvas")}function x(C,y,H){let it=1,tt=Dt(C);if((tt.width>H||tt.height>H)&&(it=H/Math.max(tt.width,tt.height)),it<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ot=Math.floor(it*tt.width),ut=Math.floor(it*tt.height);h===void 0&&(h=m(ot,ut));let J=y?m(ot,ut):h;return J.width=ot,J.height=ut,J.getContext("2d").drawImage(C,0,0,ot,ut),It("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+ot+"x"+ut+")."),J}else return"data"in C&&It("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),C;return C}function E(C){return C.generateMipmaps}function M(C){s.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function A(C,y,H,it,tt,ot=!1){if(C!==null){if(s[C]!==void 0)return s[C];It("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ut;it&&(ut=t.get("EXT_texture_norm16"),ut||It("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=y;if(y===s.RED&&(H===s.FLOAT&&(J=s.R32F),H===s.HALF_FLOAT&&(J=s.R16F),H===s.UNSIGNED_BYTE&&(J=s.R8),H===s.UNSIGNED_SHORT&&ut&&(J=ut.R16_EXT),H===s.SHORT&&ut&&(J=ut.R16_SNORM_EXT)),y===s.RED_INTEGER&&(H===s.UNSIGNED_BYTE&&(J=s.R8UI),H===s.UNSIGNED_SHORT&&(J=s.R16UI),H===s.UNSIGNED_INT&&(J=s.R32UI),H===s.BYTE&&(J=s.R8I),H===s.SHORT&&(J=s.R16I),H===s.INT&&(J=s.R32I)),y===s.RG&&(H===s.FLOAT&&(J=s.RG32F),H===s.HALF_FLOAT&&(J=s.RG16F),H===s.UNSIGNED_BYTE&&(J=s.RG8),H===s.UNSIGNED_SHORT&&ut&&(J=ut.RG16_EXT),H===s.SHORT&&ut&&(J=ut.RG16_SNORM_EXT)),y===s.RG_INTEGER&&(H===s.UNSIGNED_BYTE&&(J=s.RG8UI),H===s.UNSIGNED_SHORT&&(J=s.RG16UI),H===s.UNSIGNED_INT&&(J=s.RG32UI),H===s.BYTE&&(J=s.RG8I),H===s.SHORT&&(J=s.RG16I),H===s.INT&&(J=s.RG32I)),y===s.RGB_INTEGER&&(H===s.UNSIGNED_BYTE&&(J=s.RGB8UI),H===s.UNSIGNED_SHORT&&(J=s.RGB16UI),H===s.UNSIGNED_INT&&(J=s.RGB32UI),H===s.BYTE&&(J=s.RGB8I),H===s.SHORT&&(J=s.RGB16I),H===s.INT&&(J=s.RGB32I)),y===s.RGBA_INTEGER&&(H===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),H===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),H===s.UNSIGNED_INT&&(J=s.RGBA32UI),H===s.BYTE&&(J=s.RGBA8I),H===s.SHORT&&(J=s.RGBA16I),H===s.INT&&(J=s.RGBA32I)),y===s.RGB&&(H===s.UNSIGNED_SHORT&&ut&&(J=ut.RGB16_EXT),H===s.SHORT&&ut&&(J=ut.RGB16_SNORM_EXT),H===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),H===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),y===s.RGBA){let j=ot?Ls:qt.getTransfer(tt);H===s.FLOAT&&(J=s.RGBA32F),H===s.HALF_FLOAT&&(J=s.RGBA16F),H===s.UNSIGNED_BYTE&&(J=j===Jt?s.SRGB8_ALPHA8:s.RGBA8),H===s.UNSIGNED_SHORT&&ut&&(J=ut.RGBA16_EXT),H===s.SHORT&&ut&&(J=ut.RGBA16_SNORM_EXT),H===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),H===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function _(C,y){let H;return C?y===null||y===un||y===Di?H=s.DEPTH24_STENCIL8:y===dn?H=s.DEPTH32F_STENCIL8:y===ms&&(H=s.DEPTH24_STENCIL8,It("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===un||y===Di?H=s.DEPTH_COMPONENT24:y===dn?H=s.DEPTH_COMPONENT32F:y===ms&&(H=s.DEPTH_COMPONENT16),H}function w(C,y){return E(C)===!0||C.isFramebufferTexture&&C.minFilter!==we&&C.minFilter!==Be?Math.log2(Math.max(y.width,y.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?y.mipmaps.length:1}function B(C){let y=new WeakRef(C);n.get(C).__ref=y,g.add(y),v.register(C,y,y)}function I(C){let y=n.get(C).__ref;y!==void 0&&(g.delete(y),v.unregister(y))}function D(C){N(C.target)}function z(C){R(C.target)}function N(C){C.removeEventListener("dispose",D),I(C),F(C),C.isVideoTexture&&u.delete(C),C.isHTMLTexture&&d.delete(C)}function R(C){C.removeEventListener("dispose",z),I(C),Y(C)}function L(){for(let C of g){let y=C.deref();y!==void 0&&(y.isRenderTarget===!0?R(y):N(y))}g.clear(),d.clear()}function F(C){let y=n.get(C);if(y.__webglInit===void 0)return;let H=C.source,it=f.get(H);if(it){let tt=it[y.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&k(C),Object.keys(it).length===0&&f.delete(H)}n.remove(C)}function k(C){let y=n.get(C);s.deleteTexture(y.__webglTexture);let H=C.source,it=f.get(H);delete it[y.__cacheKey],o.memory.textures--}function Y(C){let y=n.get(C);y.__depthDisposeCallback&&y.__depthDisposeCallback();let H=C.depthTexture;if(H&&H.renderTarget===C&&N(H),C.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(y.__webglFramebuffer[tt]))for(let ot=0;ot<y.__webglFramebuffer[tt].length;ot++)s.deleteFramebuffer(y.__webglFramebuffer[tt][ot]);else s.deleteFramebuffer(y.__webglFramebuffer[tt]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[tt])}else{if(Array.isArray(y.__webglFramebuffer))for(let tt=0;tt<y.__webglFramebuffer.length;tt++)s.deleteFramebuffer(y.__webglFramebuffer[tt]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let tt=0;tt<y.__webglColorRenderbuffer.length;tt++)y.__webglColorRenderbuffer[tt]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[tt]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let it=C.textures;for(let tt=0,ot=it.length;tt<ot;tt++){let ut=n.get(it[tt]);ut.__webglTexture&&(s.deleteTexture(ut.__webglTexture),o.memory.textures--),n.remove(it[tt])}n.remove(C)}let V=0;function K(){V=0}function et(){return V}function nt(C){V=C}function Ct(){let C=V;return C>=i.maxTextures&&It("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+i.maxTextures),V+=1,C}function $(C){let y=[];return y.push(C.wrapS),y.push(C.wrapT),y.push(C.wrapR||0),y.push(C.magFilter),y.push(C.minFilter),y.push(C.anisotropy),y.push(C.internalFormat),y.push(C.format),y.push(C.type),y.push(C.generateMipmaps),y.push(C.mipmapsAutoUpdate),y.push(C.premultiplyAlpha),y.push(C.flipY),y.push(C.unpackAlignment),y.push(C.colorSpace),y.join()}function ft(C,y){let H=n.get(C);if(C.isVideoTexture&&me(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let it=C.image;if(it===null)It("WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)It("WebGLRenderer: Texture marked for update but image is incomplete");else{pe(H,C,y);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,H.__webglTexture,s.TEXTURE0+y)}function vt(C,y){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){pe(H,C,y);return}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,H.__webglTexture,s.TEXTURE0+y)}function Et(C,y){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){pe(H,C,y);return}e.bindTexture(s.TEXTURE_3D,H.__webglTexture,s.TEXTURE0+y)}function xt(C,y){let H=n.get(C);if(C.version>0&&H.__version!==C.version){Ve(H,C,y);return}e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture,s.TEXTURE0+y)}let Ut={[jr]:s.REPEAT,[yn]:s.CLAMP_TO_EDGE,[Qr]:s.MIRRORED_REPEAT},ue={[we]:s.NEAREST,[Th]:s.NEAREST_MIPMAP_NEAREST,[js]:s.NEAREST_MIPMAP_LINEAR,[Be]:s.LINEAR,[Ao]:s.LINEAR_MIPMAP_NEAREST,[qn]:s.LINEAR_MIPMAP_LINEAR},Pt={[Ph]:s.NEVER,[Nl]:s.ALWAYS,[Nh]:s.LESS,[Il]:s.LEQUAL,[Lh]:s.EQUAL,[Pl]:s.GEQUAL,[Dh]:s.GREATER,[Fh]:s.NOTEQUAL};function jt(C,y){if(y.type===dn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Be||y.magFilter===Ao||y.magFilter===js||y.magFilter===qn||y.minFilter===Be||y.minFilter===Ao||y.minFilter===js||y.minFilter===qn)&&It("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,Ut[y.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,Ut[y.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,Ut[y.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,ue[y.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,ue[y.minFilter]),y.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,Pt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===we||y.minFilter!==js&&y.minFilter!==qn||y.type===dn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function te(C,y){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,y.addEventListener("dispose",D),B(y));let it=y.source,tt=f.get(it);tt===void 0&&(tt={},f.set(it,tt));let ot=$(y);if(ot!==C.__cacheKey){tt[ot]===void 0&&(tt[ot]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,H=!0),tt[ot].usedTimes++;let ut=tt[C.__cacheKey];ut!==void 0&&(tt[C.__cacheKey].usedTimes--,ut.usedTimes===0&&k(y)),C.__cacheKey=ot,C.__webglTexture=tt[ot].texture}return H}function Gt(C,y,H){return Math.floor(Math.floor(C/H)/y)}function Ae(C,y,H,it){let ot=C.updateRanges;if(ot.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,y.width,y.height,H,it,y.data);else{ot.sort((P,Q)=>P.start-Q.start);let ut=0;for(let P=1;P<ot.length;P++){let Q=ot[ut],Z=ot[P],ct=Q.start+Q.count,rt=Gt(Z.start,y.width,4),at=Gt(Q.start,y.width,4);Z.start<=ct+1&&rt===at&&Gt(Z.start+Z.count-1,y.width,4)===rt?Q.count=Math.max(Q.count,Z.start+Z.count-Q.start):(++ut,ot[ut]=Z)}ot.length=ut+1;let J=e.getParameter(s.UNPACK_ROW_LENGTH),j=e.getParameter(s.UNPACK_SKIP_PIXELS),lt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,y.width);for(let P=0,Q=ot.length;P<Q;P++){let Z=ot[P],ct=Math.floor(Z.start/4),rt=Math.ceil(Z.count/4),at=ct%y.width,At=Math.floor(ct/y.width),zt=rt,st=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,at),e.pixelStorei(s.UNPACK_SKIP_ROWS,At),e.texSubImage2D(s.TEXTURE_2D,0,at,At,zt,st,H,it,y.data)}C.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,J),e.pixelStorei(s.UNPACK_SKIP_PIXELS,j),e.pixelStorei(s.UNPACK_SKIP_ROWS,lt)}}function pe(C,y,H){let it=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(it=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&(it=s.TEXTURE_3D);let tt=te(C,y),ot=y.source;e.bindTexture(it,C.__webglTexture,s.TEXTURE0+H);let ut=n.get(ot);if(ot.version!==ut.__version||tt===!0){if(e.activeTexture(s.TEXTURE0+H),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){let st=qt.getPrimaries(qt.workingColorSpace),Tt=y.colorSpace===Yn?null:qt.getPrimaries(y.colorSpace),Bt=y.colorSpace===Yn||st===Tt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment);let j=x(y.image,!1,i.maxTextureSize);j=Rt(y,j);let lt=r.convert(y.format,y.colorSpace),P=r.convert(y.type),Q=A(y.internalFormat,lt,P,y.normalized,y.colorSpace,y.isVideoTexture);jt(it,y);let Z,ct=y.mipmaps,rt=y.isVideoTexture!==!0,at=ut.__version===void 0||tt===!0,At=ot.dataReady,zt=w(y,j);if(y.isDepthTexture)Q=_(y.format===Xn,y.type),at&&(rt?e.texStorage2D(s.TEXTURE_2D,1,Q,j.width,j.height):e.texImage2D(s.TEXTURE_2D,0,Q,j.width,j.height,0,lt,P,null));else if(y.isDataTexture)if(ct.length>0){rt&&at&&e.texStorage2D(s.TEXTURE_2D,zt,Q,ct[0].width,ct[0].height);for(let st=0,Tt=ct.length;st<Tt;st++)Z=ct[st],rt?At&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,Z.width,Z.height,lt,P,Z.data):e.texImage2D(s.TEXTURE_2D,st,Q,Z.width,Z.height,0,lt,P,Z.data);y.generateMipmaps=!1}else rt?(at&&e.texStorage2D(s.TEXTURE_2D,zt,Q,j.width,j.height),At&&Ae(y,j,lt,P)):e.texImage2D(s.TEXTURE_2D,0,Q,j.width,j.height,0,lt,P,j.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){rt&&at&&e.texStorage3D(s.TEXTURE_2D_ARRAY,zt,Q,ct[0].width,ct[0].height,j.depth);for(let st=0,Tt=ct.length;st<Tt;st++)if(Z=ct[st],y.format!==pn)if(lt!==null)if(rt){if(At)if(y.layerUpdates.size>0){let Bt=Gl(Z.width,Z.height,y.format,y.type);for(let mt of y.layerUpdates){let Qt=Z.data.subarray(mt*Bt/Z.data.BYTES_PER_ELEMENT,(mt+1)*Bt/Z.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,mt,Z.width,Z.height,1,lt,Qt)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,0,Z.width,Z.height,j.depth,lt,Z.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,st,Q,Z.width,Z.height,j.depth,0,Z.data,0,0);else It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else rt?At&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,0,Z.width,Z.height,j.depth,lt,P,Z.data):e.texImage3D(s.TEXTURE_2D_ARRAY,st,Q,Z.width,Z.height,j.depth,0,lt,P,Z.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{rt&&at&&e.texStorage2D(s.TEXTURE_2D,zt,Q,ct[0].width,ct[0].height);for(let st=0,Tt=ct.length;st<Tt;st++)Z=ct[st],y.format!==pn?lt!==null?rt?At&&e.compressedTexSubImage2D(s.TEXTURE_2D,st,0,0,Z.width,Z.height,lt,Z.data):e.compressedTexImage2D(s.TEXTURE_2D,st,Q,Z.width,Z.height,0,Z.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):rt?At&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,Z.width,Z.height,lt,P,Z.data):e.texImage2D(s.TEXTURE_2D,st,Q,Z.width,Z.height,0,lt,P,Z.data)}else if(y.isDataArrayTexture)if(rt){if(at&&e.texStorage3D(s.TEXTURE_2D_ARRAY,zt,Q,j.width,j.height,j.depth),At)if(y.layerUpdates.size>0){let st=Gl(j.width,j.height,y.format,y.type);for(let Tt of y.layerUpdates){let Bt=j.data.subarray(Tt*st/j.data.BYTES_PER_ELEMENT,(Tt+1)*st/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Tt,j.width,j.height,1,lt,P,Bt)}y.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,lt,P,j.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,lt,P,j.data);else if(y.isData3DTexture)rt?(at&&e.texStorage3D(s.TEXTURE_3D,zt,Q,j.width,j.height,j.depth),At&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,lt,P,j.data)):e.texImage3D(s.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,lt,P,j.data);else if(y.isFramebufferTexture){if(at)if(rt)e.texStorage2D(s.TEXTURE_2D,zt,Q,j.width,j.height);else{let st=j.width,Tt=j.height;for(let Bt=0;Bt<zt;Bt++)e.texImage2D(s.TEXTURE_2D,Bt,Q,st,Tt,0,lt,P,null),st>>=1,Tt>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in s){let st=s.canvas;if(st.hasAttribute("layoutsubtree")||st.setAttribute("layoutsubtree","true"),j.parentNode!==st){st.appendChild(j),d.add(y),st.onpaint=Tt=>{let Bt=Tt.changedElements;for(let mt of d)Bt.includes(mt.image)&&(mt.needsUpdate=!0)},st.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,j);else{let Bt=s.RGBA,mt=s.RGBA,Qt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Bt,mt,Qt,j)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ct.length>0){if(rt&&at){let st=Dt(ct[0]);e.texStorage2D(s.TEXTURE_2D,zt,Q,st.width,st.height)}for(let st=0,Tt=ct.length;st<Tt;st++)Z=ct[st],rt?At&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,lt,P,Z):e.texImage2D(s.TEXTURE_2D,st,Q,lt,P,Z);y.generateMipmaps=!1}else if(rt){if(at){let st=Dt(j);e.texStorage2D(s.TEXTURE_2D,zt,Q,st.width,st.height)}At&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,lt,P,j)}else e.texImage2D(s.TEXTURE_2D,0,Q,lt,P,j);E(y)&&y.mipmapsAutoUpdate===!0&&M(it),ut.__version=ot.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function Ve(C,y,H){if(y.image.length!==6)return;let it=te(C,y),tt=y.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+H);let ot=n.get(tt);if(tt.version!==ot.__version||it===!0){e.activeTexture(s.TEXTURE0+H);let ut=qt.getPrimaries(qt.workingColorSpace),J=y.colorSpace===Yn?null:qt.getPrimaries(y.colorSpace),j=y.colorSpace===Yn||ut===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let lt=y.isCompressedTexture||y.image[0].isCompressedTexture,P=y.image[0]&&y.image[0].isDataTexture,Q=[];for(let mt=0;mt<6;mt++)!lt&&!P?Q[mt]=x(y.image[mt],!0,i.maxCubemapSize):Q[mt]=P?y.image[mt].image:y.image[mt],Q[mt]=Rt(y,Q[mt]);let Z=Q[0],ct=r.convert(y.format,y.colorSpace),rt=r.convert(y.type),at=A(y.internalFormat,ct,rt,y.normalized,y.colorSpace),At=y.isVideoTexture!==!0,zt=ot.__version===void 0||it===!0,st=tt.dataReady,Tt=w(y,Z);jt(s.TEXTURE_CUBE_MAP,y);let Bt;if(y.isDepthTexture){if(at=_(y.format===Xn,y.type),zt)if(At)e.texStorage2D(s.TEXTURE_CUBE_MAP,1,at,Z.width,Z.height);else for(let mt=0;mt<6;mt++)e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,at,Z.width,Z.height,0,ct,rt,null)}else if(lt){At&&zt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Tt,at,Z.width,Z.height);for(let mt=0;mt<6;mt++){Bt=Q[mt].mipmaps;for(let Qt=0;Qt<Bt.length;Qt++){let Me=Bt[Qt];y.format!==pn?ct!==null?At?st&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt,0,0,Me.width,Me.height,ct,Me.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt,at,Me.width,Me.height,0,Me.data):It("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):At?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt,0,0,Me.width,Me.height,ct,rt,Me.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt,at,Me.width,Me.height,0,ct,rt,Me.data)}}}else{if(Bt=y.mipmaps,At&&zt){Bt.length>0&&Tt++;let mt=Dt(Q[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Tt,at,mt.width,mt.height)}for(let mt=0;mt<6;mt++)if(P){At?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,Q[mt].width,Q[mt].height,ct,rt,Q[mt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,at,Q[mt].width,Q[mt].height,0,ct,rt,Q[mt].data);for(let Qt=0;Qt<Bt.length;Qt++){let ni=Bt[Qt].image[mt].image;At?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt+1,0,0,ni.width,ni.height,ct,rt,ni.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt+1,at,ni.width,ni.height,0,ct,rt,ni.data)}}else{At?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,ct,rt,Q[mt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,at,ct,rt,Q[mt]);for(let Qt=0;Qt<Bt.length;Qt++){let Me=Bt[Qt];At?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt+1,0,0,ct,rt,Me.image[mt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Qt+1,at,ct,rt,Me.image[mt])}}}E(y)&&y.mipmapsAutoUpdate===!0&&M(s.TEXTURE_CUBE_MAP),ot.__version=tt.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function ce(C,y,H,it,tt,ot){let ut=r.convert(H.format,H.colorSpace),J=r.convert(H.type),j=A(H.internalFormat,ut,J,H.normalized,H.colorSpace),lt=n.get(y),P=n.get(H);if(P.__renderTarget=y,!lt.__hasExternalTextures){let Q=Math.max(1,y.width>>ot),Z=Math.max(1,y.height>>ot);tt===s.TEXTURE_3D||tt===s.TEXTURE_2D_ARRAY?e.texImage3D(tt,ot,j,Q,Z,y.depth,0,ut,J,null):e.texImage2D(tt,ot,j,Q,Z,0,ut,J,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),pt(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,it,tt,P.__webglTexture,0,oe(y)):(tt===s.TEXTURE_2D||tt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,it,tt,P.__webglTexture,ot),e.bindFramebuffer(s.FRAMEBUFFER,null)}function _n(C,y,H){if(s.bindRenderbuffer(s.RENDERBUFFER,C),y.depthBuffer){let it=y.depthTexture,tt=it&&it.isDepthTexture?it.type:null,ot=_(y.stencilBuffer,tt),ut=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;pt(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,oe(y),ot,y.width,y.height):H?s.renderbufferStorageMultisample(s.RENDERBUFFER,oe(y),ot,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,ot,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ut,s.RENDERBUFFER,C)}else{let it=y.textures;for(let tt=0;tt<it.length;tt++){let ot=it[tt],ut=r.convert(ot.format,ot.colorSpace),J=r.convert(ot.type),j=A(ot.internalFormat,ut,J,ot.normalized,ot.colorSpace);pt(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,oe(y),j,y.width,y.height):H?s.renderbufferStorageMultisample(s.RENDERBUFFER,oe(y),j,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,j,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ye(C,y,H){let it=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let tt=n.get(y.depthTexture);tt.__renderTarget=y;let ot=it?y.depthTexture.image[0]:y.depthTexture.image;(!tt.__webglTexture||ot.width!==y.width||ot.height!==y.height)&&(ot.width=y.width,ot.height=y.height,y.depthTexture.needsUpdate=!0),it?xt(y.depthTexture,0):ft(y.depthTexture,0);let ut=tt.__webglTexture,J=oe(y),j=it?s.TEXTURE_CUBE_MAP_POSITIVE_X+H:s.TEXTURE_2D,lt=y.depthTexture.format===Xn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(y.depthTexture.format===kn)pt(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,lt,j,ut,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,lt,j,ut,0);else if(y.depthTexture.format===Xn)pt(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,lt,j,ut,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,lt,j,ut,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function $e(C){let y=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==C.depthTexture){let it=C.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),it){let tt=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,it.removeEventListener("dispose",tt)};it.addEventListener("dispose",tt),y.__depthDisposeCallback=tt}y.__boundDepthTexture=it}if(C.depthTexture&&!y.__autoAllocateDepthBuffer)if(H)for(let it=0;it<6;it++)ye(y.__webglFramebuffer[it],C,it);else C.texture.mipmaps.length>0?ye(y.__webglFramebuffer[0],C,0):ye(y.__webglFramebuffer,C,0);else if(H){y.__webglDepthbuffer=[];for(let it=0;it<6;it++)if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[it]),y.__webglDepthbuffer[it]===void 0)y.__webglDepthbuffer[it]=s.createRenderbuffer(),_n(y.__webglDepthbuffer[it],C,!1);else{let tt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=y.__webglDepthbuffer[it];s.bindRenderbuffer(s.RENDERBUFFER,ot),s.framebufferRenderbuffer(s.FRAMEBUFFER,tt,s.RENDERBUFFER,ot)}}else if(C.texture.mipmaps.length>0?e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),_n(y.__webglDepthbuffer,C,!1);else{let tt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ot),s.framebufferRenderbuffer(s.FRAMEBUFFER,tt,s.RENDERBUFFER,ot)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Je(C,y,H){let it=n.get(C);y!==void 0&&ce(it.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),H!==void 0&&$e(C)}function Ke(C){let y=C.texture,H=n.get(C),it=n.get(y);C.addEventListener("dispose",z),B(C);let tt=C.textures,ot=C.isWebGLCubeRenderTarget===!0,ut=tt.length>1;if(ut||(it.__webglTexture===void 0&&(it.__webglTexture=s.createTexture()),it.__version=y.version,o.memory.textures++),ot){H.__webglFramebuffer=[];for(let J=0;J<6;J++)if(y.mipmaps.length>0){H.__webglFramebuffer[J]=[];for(let j=0;j<y.mipmaps.length;j++)H.__webglFramebuffer[J][j]=s.createFramebuffer()}else H.__webglFramebuffer[J]=s.createFramebuffer()}else{if(y.mipmaps.length>0){H.__webglFramebuffer=[];for(let J=0;J<y.mipmaps.length;J++)H.__webglFramebuffer[J]=s.createFramebuffer()}else H.__webglFramebuffer=s.createFramebuffer();if(ut)for(let J=0,j=tt.length;J<j;J++){let lt=n.get(tt[J]);lt.__webglTexture===void 0&&(lt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&pt(C)===!1){H.__webglMultisampledFramebuffer=s.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let J=0;J<tt.length;J++){let j=tt[J];H.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,H.__webglColorRenderbuffer[J]);let lt=r.convert(j.format,j.colorSpace),P=r.convert(j.type),Q=A(j.internalFormat,lt,P,j.normalized,j.colorSpace,C.isXRRenderTarget===!0),Z=oe(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Z,Q,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,H.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=s.createRenderbuffer(),_n(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ot){e.bindTexture(s.TEXTURE_CUBE_MAP,it.__webglTexture),jt(s.TEXTURE_CUBE_MAP,y);for(let J=0;J<6;J++)if(y.mipmaps.length>0)for(let j=0;j<y.mipmaps.length;j++)ce(H.__webglFramebuffer[J][j],C,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else ce(H.__webglFramebuffer[J],C,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);E(y)?M(s.TEXTURE_CUBE_MAP):y.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,y.mipmaps.length-1),e.unbindTexture()}else if(ut){for(let J=0,j=tt.length;J<j;J++){let lt=tt[J],P=n.get(lt),Q=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Q=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Q,P.__webglTexture),jt(Q,lt),ce(H.__webglFramebuffer,C,lt,s.COLOR_ATTACHMENT0+J,Q,0),E(lt)&&M(Q)}e.unbindTexture()}else{let J=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(J,it.__webglTexture),jt(J,y),y.mipmaps.length>0)for(let j=0;j<y.mipmaps.length;j++)ce(H.__webglFramebuffer[j],C,y,s.COLOR_ATTACHMENT0,J,j);else ce(H.__webglFramebuffer,C,y,s.COLOR_ATTACHMENT0,J,0);E(y)?M(J):y.mipmaps.length>0&&s.texParameteri(J,s.TEXTURE_MAX_LEVEL,y.mipmaps.length-1),e.unbindTexture()}C.depthBuffer&&$e(C)}function O(C){let y=C.textures;for(let H=0,it=y.length;H<it;H++){let tt=y[H];if(E(tt)&&tt.mipmapsAutoUpdate===!0){let ot=T(C),ut=n.get(tt).__webglTexture;e.bindTexture(ot,ut),M(ot),e.unbindTexture()}}}let je=[];function re(C){if(C.samples>0){if(pt(C)===!1){let y=C.textures,H=C.width,it=C.height,tt=s.COLOR_BUFFER_BIT,ot=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ut=n.get(C),J=y.length>1;if(J)for(let lt=0;lt<y.length;lt++)e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ut.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ut.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ut.__webglFramebuffer);for(let lt=0;lt<y.length;lt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(tt|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(tt|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ut.__webglColorRenderbuffer[lt]);let P=n.get(y[lt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,P,0)}s.blitFramebuffer(0,0,H,it,0,0,H,it,tt,s.NEAREST),c===!0&&(je.length=0,je.push(s.COLOR_ATTACHMENT0+lt),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&je.push(ot),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,je))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let lt=0;lt<y.length;lt++){e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,ut.__webglColorRenderbuffer[lt]);let P=n.get(y[lt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,P,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ut.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&c){let y=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function oe(C){return Math.min(i.maxSamples,C.samples)}function pt(C){let y=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function me(C){let y=o.render.frame;u.get(C)!==y&&(u.set(C,y),C.update())}function Rt(C,y){let H=C.colorSpace,it=C.format,tt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==Ns&&H!==Yn&&(qt.getTransfer(H)===Jt?(it!==pn||tt!==Ge)&&It("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Nt("WebGLTextures: Unsupported texture color space:",H)),y}function Dt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=Ct,this.resetTextureUnits=K,this.getTextureUnits=et,this.setTextureUnits=nt,this.setTexture2D=ft,this.setTexture2DArray=vt,this.setTexture3D=Et,this.setTextureCube=xt,this.rebindTextures=Je,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=re,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=pt,this.dispose=L}function O0(s,t){function e(n,i=Yn){let r,o=qt.getTransfer(i);if(n===Ge)return s.UNSIGNED_BYTE;if(n===To)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Co)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Al)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===El)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===bl)return s.BYTE;if(n===wl)return s.SHORT;if(n===ms)return s.UNSIGNED_SHORT;if(n===Eo)return s.INT;if(n===un)return s.UNSIGNED_INT;if(n===dn)return s.FLOAT;if(n===fn)return s.HALF_FLOAT;if(n===Tl)return s.ALPHA;if(n===Cl)return s.RGB;if(n===pn)return s.RGBA;if(n===kn)return s.DEPTH_COMPONENT;if(n===Xn)return s.DEPTH_STENCIL;if(n===Rl)return s.RED;if(n===Ro)return s.RED_INTEGER;if(n===vi)return s.RG;if(n===Io)return s.RG_INTEGER;if(n===Po)return s.RGBA_INTEGER;if(n===Qs||n===tr||n===er||n===nr)if(o===Jt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===er)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===nr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===No||n===Lo||n===Do||n===Fo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===No)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Do)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Uo||n===Bo||n===Oo||n===zo||n===Vo||n===ir||n===ko)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Uo||n===Bo)return o===Jt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Oo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===zo)return r.COMPRESSED_R11_EAC;if(n===Vo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ir)return r.COMPRESSED_RG11_EAC;if(n===ko)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Go||n===Ho||n===Wo||n===qo||n===Xo||n===Yo||n===Zo||n===$o||n===Jo||n===Ko||n===jo||n===Qo||n===ta||n===ea)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Go)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ho)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===qo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Yo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$o)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Jo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ko)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===jo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qo)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ta)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ea)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===na||n===ia||n===sa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===na)return o===Jt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ia)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===sa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ra||n===oa||n===sr||n===aa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ra)return r.COMPRESSED_RED_RGTC1_EXT;if(n===oa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===aa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Di?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var z0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,V0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Kl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Gs(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new bn({vertexShader:z0,fragmentShader:V0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ke(new pi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},jl=class extends Sn{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,h=null,f=null,g=null,v=typeof XRWebGLBinding<"u",p=new Kl,m={},x=e.getContextAttributes(),E=null,M=null,T=[],A=[],_=new Yt,w=null,B=null,I=new Ue;I.viewport=new le;let D=new Ue;D.viewport=new le;let z=[I,D],N=new So,R=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ft=T[$];return ft===void 0&&(ft=new as,T[$]=ft),ft.getTargetRaySpace()},this.getControllerGrip=function($){let ft=T[$];return ft===void 0&&(ft=new as,T[$]=ft),ft.getGripSpace()},this.getHand=function($){let ft=T[$];return ft===void 0&&(ft=new as,T[$]=ft),ft.getHandSpace()};function F($){let ft=A.indexOf($.inputSource);if(ft===-1)return;let vt=T[ft];vt!==void 0&&(vt.update($.inputSource,$.frame,l||o),vt.dispatchEvent({type:$.type,data:$.inputSource}))}function k(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",k),i.removeEventListener("inputsourceschange",Y);for(let $=0;$<T.length;$++){let ft=A[$];ft!==null&&(A[$]=null,T[$].disconnect(ft))}R=null,L=null,p.reset();for(let $ in m)delete m[$];if(t.setRenderTarget(E),f=null,h=null,d=null,i=null,M=null,Ct.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(_.width,_.height,!1),B!==null){let $=B.camera;$.fov=B.fov,$.zoom=B.zoom,$.updateProjectionMatrix(),B=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&It("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&It("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(E=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",k),i.addEventListener("inputsourceschange",Y),x.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,Et=null,xt=null;x.depth&&(xt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=x.stencil?Xn:kn,Et=x.stencil?Di:un);let Ut={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Ut),i.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),M=new Xe(h.textureWidth,h.textureHeight,{format:pn,type:Ge,depthTexture:new Wn(h.textureWidth,h.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let vt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,vt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Xe(f.framebufferWidth,f.framebufferHeight,{format:pn,type:Ge,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),Ct.setContext(i),Ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Y($){for(let ft=0;ft<$.removed.length;ft++){let vt=$.removed[ft],Et=A.indexOf(vt);Et>=0&&(A[Et]=null,T[Et].disconnect(vt))}for(let ft=0;ft<$.added.length;ft++){let vt=$.added[ft],Et=A.indexOf(vt);if(Et===-1){for(let Ut=0;Ut<T.length;Ut++)if(Ut>=A.length){A.push(vt),Et=Ut;break}else if(A[Ut]===null){A[Ut]=vt,Et=Ut;break}if(Et===-1)break}let xt=T[Et];xt&&xt.connect(vt)}}function V($,ft){ft===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ft.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let ft=$.near,vt=$.far;p.texture!==null&&(p.depthNear>0&&(ft=p.depthNear),p.depthFar>0&&(vt=p.depthFar)),N.near=D.near=I.near=ft,N.far=D.far=I.far=vt,(R!==N.near||L!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),R=N.near,L=N.far),N.layers.mask=$.layers.mask|6,I.layers.mask=N.layers.mask&-5,D.layers.mask=N.layers.mask&-3;let Et=$.parent,xt=N.cameras;V(N,Et);for(let Ut=0;Ut<xt.length;Ut++)V(xt[Ut],Et);N.projectionMatrix.copy(I.projectionMatrix),N.projectionMatrixInverse.copy(I.projectionMatrixInverse),B===null&&$.isPerspectiveCamera&&(B={camera:$,fov:$.fov,zoom:$.zoom}),K($,N,Et)};function K($,ft,vt){vt===null?$.matrix.copy(ft.matrixWorld):($.matrix.copy(vt.matrixWorld),$.matrix.invert(),$.matrix.multiply(ft.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ft.projectionMatrix),$.projectionMatrixInverse.copy(ft.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=rs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(N)},this.getCameraTexture=function($){return m[$]};let et=null;function nt($,ft){if(u=ft.getViewerPose(l||o),g=ft,u!==null){let vt=u.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Et=!1;vt.length!==N.cameras.length&&(N.cameras.length=0,Et=!0);for(let Pt=0;Pt<vt.length;Pt++){let jt=vt[Pt],te=null;if(f!==null)te=f.getViewport(jt);else{let Ae=d.getViewSubImage(h,jt);te=Ae.viewport,Pt===0&&(t.setRenderTargetTextures(M,Ae.colorTexture,Ae.depthStencilTexture),t.setRenderTarget(M))}let Gt=z[Pt];Gt===void 0&&(Gt=new Ue,Gt.layers.enable(Pt),Gt.viewport=new le,z[Pt]=Gt),Gt.matrix.fromArray(jt.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(jt.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(te.x,te.y,te.width,te.height),Pt===0&&(N.matrix.copy(Gt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Et===!0&&N.cameras.push(Gt)}let xt=i.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let Pt=d.getDepthInformation(vt[0]);Pt&&Pt.isValid&&Pt.texture&&p.init(Pt,i.renderState)}if(xt&&xt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let Pt=0;Pt<vt.length;Pt++){let jt=vt[Pt].camera;if(jt){let te=m[jt];te||(te=new Gs,m[jt]=te);let Gt=d.getCameraImage(jt);te.sourceTexture=Gt}}}}for(let vt=0;vt<T.length;vt++){let Et=A[vt],xt=T[vt];Et!==null&&xt!==void 0&&xt.update(Et,ft,l||o)}et&&et($,ft),ft.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ft}),g=null}let Ct=new pu;Ct.setAnimationLoop(nt),this.setAnimationLoop=function($){et=$},this.dispose=function(){}}},k0=new ae,wu=new Lt;wu.set(-1,0,0,0,1,0,0,0,1);function G0(s,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,zl(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,E,M){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),h(p,m),m.isMeshPhysicalMaterial&&f(p,m,M)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,x,E):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Oe&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Oe&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let x=t.get(m),E=x.envMap,M=x.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(k0.makeRotationFromEuler(M)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(wu),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,x,E){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=E*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,e(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Oe&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){let x=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function H0(s,t,e,n){let i={},r={};function o(x,E){let M=E.program;n.uniformBlockBinding(x,M,i[x.id])}function a(x,E){let M=i[x.id];M===void 0&&(g(x),M=c(x),i[x.id]=M,x.addEventListener("dispose",p));let T=E.program;n.updateUBOMapping(x,T);let A=t.render.frame;r[x.id]!==A&&(l(x),r[x.id]=A)}function c(x){let E=s.createBuffer(),M=x.__size,T=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,M,T),s.bindBuffer(s.UNIFORM_BUFFER,null),E}function l(x){let E=i[x.id],M=x.uniforms,T=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let A=0,_=M.length;A<_;A++){let w=M[A];if(Array.isArray(w))for(let B=0,I=w.length;B<I;B++)u(w[B],A,B,T);else u(w,A,0,T)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function u(x,E,M,T){if(h(x,E,M,T)===!0){let A=x.__offset,_=x.value;if(Array.isArray(_)){let w=0;for(let B=0;B<_.length;B++){let I=_[B],D=v(I,!0);d(I,x.__data,w),w+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else d(_,x.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,A,x.__data)}}function d(x,E,M){typeof x=="number"||typeof x=="boolean"?E[M]=x:x.isMatrix3?(E[M]=x.elements[0],E[M+1]=x.elements[1],E[M+2]=x.elements[2],E[M+3]=0,E[M+4]=x.elements[3],E[M+5]=x.elements[4],E[M+6]=x.elements[5],E[M+7]=0,E[M+8]=x.elements[6],E[M+9]=x.elements[7],E[M+10]=x.elements[8],E[M+11]=0):ArrayBuffer.isView(x)?E.set(x.subarray(0,E.length-M),M):x.toArray(E,M)}function h(x,E,M,T){let A=x.value,_=E+"_"+M;if(Array.isArray(A)){T[_]===void 0&&(T[_]=[]);let w=T[_],B=!1;for(let I=0;I<A.length;I++)f(A[I],w,I)===!0&&(B=!0);return B}return f(A,T,_)}function f(x,E,M){if(E[M]===void 0)return typeof x=="number"||typeof x=="boolean"?E[M]=x:ArrayBuffer.isView(x)?E[M]=x.slice():E[M]=x.clone(),!0;{let T=E[M];if(typeof x=="number"||typeof x=="boolean"){if(T!==x)return E[M]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(T.equals(x)===!1)return T.copy(x),!0}}return!1}function g(x){let E=x.uniforms,M=0,T=16;for(let _=0,w=E.length;_<w;_++){let B=Array.isArray(E[_])?E[_]:[E[_]];for(let I=0,D=B.length;I<D;I++){let z=B[I],N=Array.isArray(z.value)?z.value:[z.value],R=Array.isArray(E[_])||Array.isArray(z.value),L=M;for(let k=0,Y=N.length;k<Y;k++){let V=N[k],K=v(V,R),et=M%T,nt=et%K.boundary,Ct=et+nt;M+=nt,Ct!==0&&T-Ct<K.storage&&(M+=T-Ct),k===0&&(L=M),M+=K.storage}let F=z.type==="int"?Int32Array:z.type==="uint"?Uint32Array:Float32Array;z.__data=new F((M-L)/Float32Array.BYTES_PER_ELEMENT),z.__offset=L}}let A=M%T;return A>0&&(M+=T-A),x.__size=M,x.__cache={},this}function v(x,E){let M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=16,M.storage=48):x.isMatrix4?(M.boundary=16,M.storage=64):x.isTexture?It("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(M.boundary=16,M.storage=x.byteLength):It("WebGLRenderer: Unsupported uniform value type.",x),E===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function p(x){let E=x.target;E.removeEventListener("dispose",p),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function m(){for(let x in i)s.deleteBuffer(i[x]);i={},r={}}return{bind:o,update:a,dispose:m}}var W0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),En=null;function q0(){return En===null&&(En=new ro(W0,16,16,vi,fn),En.name="DFG_LUT",En.minFilter=Be,En.magFilter=Be,En.wrapS=yn,En.wrapT=yn,En.generateMipmaps=!1,En.needsUpdate=!0),En}var da=class{constructor(t={}){let{canvas:e=Bh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=Ge}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let v=f,p=new Set([Po,Io,Ro]),m=new Set([Ge,un,ms,Di,To,Co]),x=new Uint32Array(4),E=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]},T=null,A=null,_=[],w=[],B=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,D=!1,z=null,N=null,R=null,L=null;this._outputColorSpace=Pe;let F=0,k=0,Y=null,V=-1,K=null,et=new le,nt=new le,Ct=null,$=new kt(0),ft=0,vt=e.width,Et=e.height,xt=1,Ut=null,ue=null,Pt=new le(0,0,vt,Et),jt=new le(0,0,vt,Et),te=!1,Gt=new di,Ae=new oo,pe=!1,Ve=!1,ce=new ae,_n=new q,ye=new le,$e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Je=!1;function Ke(){return Y===null?xt:1}let O=n;function je(S,U){return e.getContext(S,U)}let re,oe,pt,me,Rt,Dt,C,y,H,it,tt,ot,ut,J,j,lt,P,Q,Z,ct,rt,at,At;try{let S={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",Tt,!1),e.addEventListener("webglcontextrestored",Bt,!1),e.addEventListener("webglcontextcreationerror",mt,!1),O===null){let U="webgl2";if(O=je(U,S),O===null)throw je(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}zt()}catch(S){throw e.removeEventListener("webglcontextlost",Tt,!1),e.removeEventListener("webglcontextrestored",Bt,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),Nt("WebGLRenderer: "+S.message),S}function zt(){re=new ng(O),re.init(),rt=new O0(O,re),oe=new qm(O,re,t,rt),pt=new U0(O,re),oe.reversedDepthBuffer&&h&&pt.buffers.depth.setReversed(!0),N=O.createFramebuffer(),R=O.createFramebuffer(),L=O.createFramebuffer(),me=new rg(O),Rt=new S0,Dt=new B0(O,re,pt,Rt,oe,rt,me),C=new eg(I),y=new af(O),at=new Hm(O,y),H=new ig(O,y,me,at),it=new ag(O,H,y,at,me),Q=new og(O,oe,Dt),j=new Xm(Rt),tt=new M0(I,C,re,oe,at,j),ot=new G0(I,Rt),ut=new w0,J=new I0(re),P=new Gm(I,C,pt,it,g,c),lt=new F0(I,it,oe),At=new H0(O,me,oe,pt),Z=new Wm(O,re,me),ct=new sg(O,re,me),me.programs=tt.programs,I.capabilities=oe,I.extensions=re,I.properties=Rt,I.renderLists=ut,I.shadowMap=lt,I.state=pt,I.info=me}v!==Ge&&(B=new cg(v,e.width,e.height,a,i,r));let st=new jl(I,O);this.xr=st,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let S=re.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=re.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return xt},this.setPixelRatio=function(S){S!==void 0&&(xt=S,this.setSize(vt,Et,!1))},this.getSize=function(S){return S.set(vt,Et)},this.setSize=function(S,U,X=!0){if(st.isPresenting){It("WebGLRenderer: Can't change size while VR device is presenting.");return}vt=S,Et=U,e.width=Math.floor(S*xt),e.height=Math.floor(U*xt),X===!0&&(e.style.width=S+"px",e.style.height=U+"px"),B!==null&&B.setSize(e.width,e.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(vt*xt,Et*xt).floor()},this.setDrawingBufferSize=function(S,U,X){vt=S,Et=U,xt=X,e.width=Math.floor(S*X),e.height=Math.floor(U*X),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(v===Ge){Nt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){It("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}B.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(et)},this.getViewport=function(S){return S.copy(Pt)},this.setViewport=function(S,U,X,G){S.isVector4?Pt.set(S.x,S.y,S.z,S.w):Pt.set(S,U,X,G),pt.viewport(et.copy(Pt).multiplyScalar(Ke()).round())},this.getScissor=function(S){return S.copy(jt)},this.setScissor=function(S,U,X,G){S.isVector4?jt.set(S.x,S.y,S.z,S.w):jt.set(S,U,X,G),pt.scissor(nt.copy(jt).multiplyScalar(Ke()).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(S){pt.setScissorTest(te=S)},this.setOpaqueSort=function(S){Ut=S},this.setTransparentSort=function(S){ue=S},this.getClearColor=function(S){return S.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,X=!0){let G=0;if(S){let W=!1;if(Y!==null){let dt=Y.texture.format;W=p.has(dt)}if(W){let dt=Y.texture.type,yt=m.has(dt),ht=P.getClearColor(),_t=P.getClearAlpha(),wt=ht.r,Ft=ht.g,Ht=ht.b;yt?(x[0]=wt,x[1]=Ft,x[2]=Ht,x[3]=_t,O.clearBufferuiv(O.COLOR,0,x)):(E[0]=wt,E[1]=Ft,E[2]=Ht,E[3]=_t,O.clearBufferiv(O.COLOR,0,E))}else G|=O.COLOR_BUFFER_BIT}U&&(G|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),z=S},this.dispose=function(){e.removeEventListener("webglcontextlost",Tt,!1),e.removeEventListener("webglcontextrestored",Bt,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),P.dispose(),ut.dispose(),J.dispose(),Dt.dispose(),Rt.dispose(),C.dispose(),it.dispose(),H.dispose(),at.dispose(),At.dispose(),tt.dispose(),st.dispose(),st.removeEventListener("sessionstart",bc),st.removeEventListener("sessionend",wc),Si.stop()};function Tt(S){S.preventDefault(),Dl("WebGLRenderer: Context Lost."),D=!0}function Bt(){Dl("WebGLRenderer: Context Restored."),D=!1;let S=me.autoReset,U=lt.enabled,X=lt.autoUpdate,G=lt.needsUpdate,W=lt.type;zt(),me.autoReset=S,lt.enabled=U,lt.autoUpdate=X,lt.needsUpdate=G,lt.type=W}function mt(S){Nt("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Qt(S){let U=S.target;U.removeEventListener("dispose",Qt),Me(U)}function Me(S){ni(S),Rt.remove(S)}function ni(S){let U=Rt.get(S).programs;U!==void 0&&(U.forEach(function(X){tt.releaseProgram(X)}),S.isShaderMaterial&&tt.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,X,G,W,dt){U===null&&(U=$e);let yt=W.isMesh&&W.matrixWorld.determinantAffine()<0,ht=ad(S,U,X,G,W);pt.setMaterial(G,yt);let _t=X.index,wt=1;if(G.wireframe===!0){if(_t=H.getWireframeAttribute(X),_t===void 0)return;wt=2}let Ft=X.drawRange,Ht=X.attributes.position,St=Ft.start*wt,Wt=(Ft.start+Ft.count)*wt;dt!==null&&(St=Math.max(St,dt.start*wt),Wt=Math.min(Wt,(dt.start+dt.count)*wt)),_t!==null?(St=Math.max(St,0),Wt=Math.min(Wt,_t.count)):Ht!=null&&(St=Math.max(St,0),Wt=Math.min(Wt,Ht.count));let de=Wt-St;if(de<0||de===1/0)return;at.setup(W,G,ht,X,_t);let ne,ee=Z;if(_t!==null&&(ne=y.get(_t),ee=ct,ee.setIndex(ne)),W.isMesh)G.wireframe===!0?(pt.setLineWidth(G.wireframeLinewidth*Ke()),ee.setMode(O.LINES)):ee.setMode(O.TRIANGLES);else if(W.isLine){let Te=G.linewidth;Te===void 0&&(Te=1),pt.setLineWidth(Te*Ke()),W.isLineSegments?ee.setMode(O.LINES):W.isLineLoop?ee.setMode(O.LINE_LOOP):ee.setMode(O.LINE_STRIP)}else W.isPoints?ee.setMode(O.POINTS):W.isSprite&&ee.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(re.get("WEBGL_multi_draw"))ee.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Te=W._multiDrawStarts,bt=W._multiDrawCounts,Fe=W._multiDrawCount,$t=_t?y.get(_t).bytesPerElement:1,bi=Rt.get(G).currentProgram.getUniforms();for(let Ce=0;Ce<Fe;Ce++)bi.setValue(O,"_gl_DrawID",Ce),ee.render(Te[Ce]/$t,bt[Ce])}else if(W.isInstancedMesh)ee.renderInstances(St,de,W.count);else if(X.isInstancedBufferGeometry){let Te=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,bt=Math.min(X.instanceCount,Te);ee.renderInstances(St,de,bt)}else ee.render(St,de)};function Sc(S,U,X,G){z!==null&&S.isNodeMaterial&&z.setObject(G,S),pe===!0&&j.setState(S,X,!1),S.transparent===!0&&S.side===wn&&S.forceSinglePass===!1?(S.side=Oe,S.needsUpdate=!0,bs(S,U,G),S.side=_i,S.needsUpdate=!0,bs(S,U,G),S.side=wn):bs(S,U,G)}this.compile=function(S,U,X=null){X===null&&(X=S),z!==null&&z.renderStart(S,U,X),A=J.get(X),A.init(U),w.push(A),X.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(A.pushLight(W),W.castShadow&&A.pushShadow(W))}),S!==X&&S.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(A.pushLight(W),W.castShadow&&A.pushShadow(W))}),A.setupLights(),z!==null&&z.updateLights(A.state.lightsArray),Ve=this.localClippingEnabled,pe=j.init(this.clippingPlanes,Ve),pe===!0&&j.setGlobalState(this.clippingPlanes,U),z!==null&&lt.render(A.state.shadowsArray,X,U);let G=new Set;return S.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let dt=W.material;if(dt)if(Array.isArray(dt))for(let yt=0;yt<dt.length;yt++){let ht=dt[yt];Sc(ht,X,U,W),G.add(ht)}else Sc(dt,X,U,W),G.add(dt)}),A=w.pop(),z!==null&&z.renderEnd(),G},this.compileAsync=function(S,U,X=null){let G=this.compile(S,U,X);return new Promise(W=>{function dt(){if(G.forEach(function(yt){let _t=Rt.get(yt).currentProgram;(_t===void 0||_t.isReady())&&G.delete(yt)}),G.size===0){W(S);return}setTimeout(dt,10)}re.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let La=null;function rd(S){La&&La(S)}function bc(){Si.stop()}function wc(){Si.start()}let Si=new pu;Si.setAnimationLoop(rd),typeof self<"u"&&Si.setContext(self),this.setAnimationLoop=function(S){La=S,st.setAnimationLoop(S),S===null?Si.stop():Si.start()},st.addEventListener("sessionstart",bc),st.addEventListener("sessionend",wc),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){Nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;z!==null&&z.renderStart(S,U);let X=st.enabled===!0&&st.isPresenting===!0,G=B!==null&&(Y===null||X)&&B.begin(I,Y);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(B===null||B.isCompositing()===!1)&&(st.cameraAutoUpdate===!0&&st.updateCamera(U),U=st.getCamera()),S.isScene===!0&&S.onBeforeRender(I,S,U,Y),A=J.get(S,w.length),A.init(U),A.state.textureUnits=Dt.getTextureUnits(),w.push(A),ce.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?Ae.setFromArrayCamera(U):Gt.setFromProjectionMatrix(ce,tn,U.reversedDepth),Ve=this.localClippingEnabled,pe=j.init(this.clippingPlanes,Ve),T=ut.get(S,_.length),T.init(),_.push(T),this.info.render.frame++,st.enabled===!0&&st.isPresenting===!0){let yt=I.xr.getDepthSensingMesh();yt!==null&&Da(yt,U,-1/0,I.sortObjects)}Da(S,U,0,I.sortObjects),T.finish(),z!==null&&z.updateLights(A.state.lightsArray),I.sortObjects===!0&&T.sort(Ut,ue),Je=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,Je&&P.addToRenderList(T,S),this.info.autoReset===!0&&this.info.reset(),pe===!0&&j.beginShadows();let W=A.state.shadowsArray;if(lt.render(W,S,U),pe===!0&&j.endShadows(),(G&&B.hasRenderPass())===!1){let yt=T.opaque,ht=T.transmissive;if(A.setupLights(),U.isArrayCamera){let _t=U.cameras;if(ht.length>0)for(let wt=0,Ft=_t.length;wt<Ft;wt++){let Ht=_t[wt];Ec(yt,ht,S,Ht)}Je&&P.render(S);for(let wt=0,Ft=_t.length;wt<Ft;wt++){let Ht=_t[wt];Ac(T,S,Ht,Ht.viewport)}}else ht.length>0&&Ec(yt,ht,S,U),Je&&P.render(S),Ac(T,S,U)}Y!==null&&k===0&&(Dt.updateMultisampleRenderTarget(Y),Dt.updateRenderTargetMipmap(Y)),G&&B.end(I),S.isScene===!0&&S.onAfterRender(I,S,U),at.resetDefaultState(),V=-1,K=null,w.pop(),w.length>0?(A=w[w.length-1],Dt.setTextureUnits(A.state.textureUnits),pe===!0&&j.setGlobalState(I.clippingPlanes,A.state.camera)):A=null,_.pop(),_.length>0?T=_[_.length-1]:T=null,z!==null&&z.renderEnd()};function Da(S,U,X,G){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)A.pushLight(S),S.castShadow&&A.pushShadow(S);else if(S.isSprite){let yt=U.isArrayCamera?Ae:Gt;if(!S.frustumCulled||S.intersectsFrustum(yt)){G&&ye.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ce);let ht=it.update(S),_t=S.material;_t.visible&&T.push(S,ht,_t,X,ye.z,null,U)}}else if(S.isMesh||S.isLine||S.isPoints){let yt=U.isArrayCamera?Ae:Gt;if(!S.frustumCulled||S.intersectsFrustum(yt)){let ht=it.update(S),_t=S.material;if(G&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ye.copy(S.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),ye.copy(ht.boundingSphere.center)),ye.applyMatrix4(S.matrixWorld).applyMatrix4(ce)),Array.isArray(_t)){let wt=ht.groups;for(let Ft=0,Ht=wt.length;Ft<Ht;Ft++){let St=wt[Ft],Wt=_t[St.materialIndex];Wt&&Wt.visible&&T.push(S,ht,Wt,X,ye.z,St,U)}}else _t.visible&&T.push(S,ht,_t,X,ye.z,null,U)}}}let dt=S.children;for(let yt=0,ht=dt.length;yt<ht;yt++)Da(dt[yt],U,X,G)}function Ac(S,U,X,G){let{opaque:W,transmissive:dt,transparent:yt}=S;A.setupLightsView(X),pe===!0&&j.setGlobalState(I.clippingPlanes,X),G&&pt.viewport(et.copy(G)),W.length>0&&yr(W,U,X),dt.length>0&&yr(dt,U,X),yt.length>0&&yr(yt,U,X),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function Ec(S,U,X,G){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[G.id]===void 0){let St=re.has("EXT_color_buffer_half_float")||re.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[G.id]=new Xe(1,1,{generateMipmaps:!0,type:St?fn:Ge,minFilter:qn,samples:Math.max(4,oe.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:qt.workingColorSpace})}let dt=A.state.transmissionRenderTarget[G.id],yt=G.viewport||et;dt.setSize(yt.z*I.transmissionResolutionScale,yt.w*I.transmissionResolutionScale);let ht=I.getRenderTarget(),_t=I.getActiveCubeFace(),wt=I.getActiveMipmapLevel();I.setRenderTarget(dt),I.getClearColor($),ft=I.getClearAlpha(),ft<1&&I.setClearColor(16777215,.5),I.clear(),Je&&P.render(X);let Ft=I.toneMapping;I.toneMapping=An;let Ht=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),A.setupLightsView(G),pe===!0&&j.setGlobalState(I.clippingPlanes,G),yr(S,X,G),Dt.updateMultisampleRenderTarget(dt),Dt.updateRenderTargetMipmap(dt),re.has("WEBGL_multisampled_render_to_texture")===!1){let St=!1;for(let Wt=0,de=U.length;Wt<de;Wt++){let ne=U[Wt],{object:ee,geometry:Te,material:bt,group:Fe}=ne;if(bt.side===wn&&ee.layers.test(G.layers)){let $t=bt.side;bt.side=Oe,bt.needsUpdate=!0,Tc(ee,X,G,Te,bt,Fe),bt.side=$t,bt.needsUpdate=!0,St=!0}}St===!0&&(Dt.updateMultisampleRenderTarget(dt),Dt.updateRenderTargetMipmap(dt))}I.setRenderTarget(ht,_t,wt),I.setClearColor($,ft),Ht!==void 0&&(G.viewport=Ht),I.toneMapping=Ft}function yr(S,U,X){let G=U.isScene===!0?U.overrideMaterial:null;for(let W=0,dt=S.length;W<dt;W++){let yt=S[W],{object:ht,geometry:_t,group:wt}=yt,Ft=yt.material;Ft.allowOverride===!0&&G!==null&&(Ft=G),ht.layers.test(X.layers)&&Tc(ht,U,X,_t,Ft,wt)}}function Tc(S,U,X,G,W,dt){z!==null&&W.isNodeMaterial&&z.setObject(S,W),S.onBeforeRender(I,U,X,G,W,dt),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),W.onBeforeRender(I,U,X,G,S,dt),W.transparent===!0&&W.side===wn&&W.forceSinglePass===!1?(W.side=Oe,W.needsUpdate=!0,I.renderBufferDirect(X,U,G,W,S,dt),W.side=_i,W.needsUpdate=!0,I.renderBufferDirect(X,U,G,W,S,dt),W.side=wn):I.renderBufferDirect(X,U,G,W,S,dt),S.onAfterRender(I,U,X,G,W,dt)}function Cc(S){let U=0;for(let X of S)X.texture!==null&&U++;return U}function bs(S,U,X){U.isScene!==!0&&(U=$e);let G=Rt.get(S),W=A.state.lights,dt=A.state.shadowsArray,yt=W.state.version,ht=tt.getParameters(S,W.state,dt,U,X,A.state.lightProbeGridArray),_t=tt.getProgramCacheKey(ht),wt=G.programs;G.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let Ft=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;G.envMap=C.get(S.envMap||G.environment,Ft),G.envMapRotation=G.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,wt===void 0&&(S.addEventListener("dispose",Qt),wt=new Map,G.programs=wt,G.programVariants=new Map);let Ht=wt.get(_t);if(Ht!==void 0){if(G.currentProgram===Ht&&G.lightsStateVersion===yt)return Ic(S,ht),Ht}else ht.uniforms=tt.getUniforms(S),z!==null&&S.isNodeMaterial&&z.build(S,X,ht),S.onBeforeCompile(ht,I),Ht=tt.acquireProgram(ht,_t),wt.set(_t,Ht),G.uniforms=ht.uniforms;let St=G.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(St.clippingPlanes=j.uniform),Ic(S,ht),G.needsLights=cd(S),G.lightsStateVersion=yt,G.needsLights&&(St.ambientLightColor.value=W.state.ambient,St.lightProbe.value=W.state.probe,St.sunLights.value=W.state.sun,St.sunLightShadows.value=W.state.sunShadow,St.directionalLights.value=W.state.directional,St.directionalLightShadows.value=W.state.directionalShadow,St.spotLights.value=W.state.spot,St.spotLightShadows.value=W.state.spotShadow,St.rectAreaLights.value=W.state.rectArea,St.ltc_1.value=W.state.rectAreaLTC1,St.ltc_2.value=W.state.rectAreaLTC2,St.pointLights.value=W.state.point,St.pointLightShadows.value=W.state.pointShadow,St.hemisphereLights.value=W.state.hemi,St.sunShadowMatrix.value=W.state.sunShadowMatrix,St.sunShadowCascade.value=W.state.sunShadowCascade,St.directionalShadowMatrix.value=W.state.directionalShadowMatrix,St.spotLightMatrix.value=W.state.spotLightMatrix,St.spotLightMap.value=W.state.spotLightMap,St.pointShadowMatrix.value=W.state.pointShadowMatrix),G.numLightProbeGrids=Cc(A.state.lightProbeGridArray),G.currentProgram=Ht,G.uniformsList=null,Ht}function od(S,U,X,G,W){let dt=Rt.get(S),yt=dt.currentProgram.id+","+G+","+W,ht=dt.programVariants.get(yt);return ht===void 0?(ht=bs(S,U,X),dt.programVariants.set(yt,ht)):(dt.currentProgram=ht,dt.uniformsList=null,dt.outputColorSpace=G,dt.toneMapping=W),ht}function Rc(S){if(S.uniformsList===null){let U=S.currentProgram.getUniforms();S.uniformsList=xs.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function Ic(S,U){let X=Rt.get(S);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function ad(S,U,X,G,W){U.isScene!==!0&&(U=$e),Dt.resetTextureUnits();let dt=U.fog,yt=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,ht=Y===null?I.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:qt.workingColorSpace,_t=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,wt=C.get(G.envMap||yt,_t),Ft=G.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ht=!!X.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),St=!!X.morphAttributes.position,Wt=!!X.morphAttributes.normal,de=!!X.morphAttributes.color,ne=An;G.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(ne=I.toneMapping);let ee=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Te=ee!==void 0?ee.length:0,bt=Rt.get(G),Fe=A.state.lights;if(pe===!0&&(Ve===!0||S!==K)){let he=S===K&&G.id===V;j.setState(G,S,he)}let $t=!1,bi=!1;G.version===bt.__version?bt.needsLights&&bt.lightsStateVersion!==Fe.state.version||W.isBatchedMesh&&bt.batching===!1||!W.isBatchedMesh&&bt.batching===!0||W.isBatchedMesh&&bt.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&bt.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&bt.instancing===!1||!W.isInstancedMesh&&bt.instancing===!0||W.isSkinnedMesh&&bt.skinning===!1||!W.isSkinnedMesh&&bt.skinning===!0||W.isInstancedMesh&&bt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&bt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&bt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&bt.instancingMorph===!1&&W.morphTexture!==null||bt.envMap!==wt||G.fog===!0&&bt.fog!==dt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==j.numPlanes||bt.numIntersection!==j.numIntersection)||bt.vertexAlphas!==Ft||bt.vertexTangents!==Ht||bt.morphTargets!==St||bt.morphNormals!==Wt||bt.morphColors!==de||bt.morphTargetsCount!==Te||bt.numLightProbeGrids!==Cc(A.state.lightProbeGridArray)?$t=!0:(bt.outputColorSpace!==ht||bt.toneMapping!==ne)&&(bi=!0):($t=!0,bt.__version=G.version);let Ce=bt.currentProgram;($t===!0||bi===!0)&&(Ce=bi===!0?od(G,U,W,ht,ne):bs(G,U,W),z&&G.isNodeMaterial&&z.onUpdateProgram(G,Ce,bt));let Mr=!1,ii=!1,wi=!1,Zt=Ce.getUniforms(),Ee=bt.uniforms;if(pt.useProgram(Ce.program)&&(Mr=!0,ii=!0,wi=!0),G.id!==V&&(V=G.id,ii=!0),Mr||K!==S){pt.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Zt.setValue(O,"projectionMatrix",S.projectionMatrix),Zt.setValue(O,"viewMatrix",S.matrixWorldInverse);let Se=Zt.map.cameraPosition;Se!==void 0&&Se.setValue(O,_n.setFromMatrixPosition(S.matrixWorld)),oe.logarithmicDepthBuffer&&Zt.setValue(O,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Zt.setValue(O,"isOrthographic",S.isOrthographicCamera===!0),K!==S&&(K=S,ii=!0,wi=!0)}if(bt.needsLights&&(Fe.state.sunShadowMap.length>0&&Zt.setValue(O,"sunShadowMap",Fe.state.sunShadowMap,Dt),Fe.state.directionalShadowMap.length>0&&Zt.setValue(O,"directionalShadowMap",Fe.state.directionalShadowMap,Dt),Fe.state.spotShadowMap.length>0&&Zt.setValue(O,"spotShadowMap",Fe.state.spotShadowMap,Dt),Fe.state.pointShadowMap.length>0&&Zt.setValue(O,"pointShadowMap",Fe.state.pointShadowMap,Dt)),W.isSkinnedMesh){Zt.setOptional(O,W,"bindMatrix"),Zt.setOptional(O,W,"bindMatrixInverse");let he=W.skeleton;he&&(he.boneTexture===null&&he.computeBoneTexture(),Zt.setValue(O,"boneTexture",he.boneTexture,Dt))}W.isBatchedMesh&&(Zt.setOptional(O,W,"batchingTexture"),Zt.setValue(O,"batchingTexture",W._matricesTexture,Dt),Zt.setOptional(O,W,"batchingIdTexture"),Zt.setValue(O,"batchingIdTexture",W._indirectTexture,Dt),Zt.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&Zt.setValue(O,"batchingColorTexture",W._colorsTexture,Dt));let on=X.morphAttributes;if((on.position!==void 0||on.normal!==void 0||on.color!==void 0)&&Q.update(W,X,Ce),(ii||bt.receiveShadow!==W.receiveShadow)&&(bt.receiveShadow=W.receiveShadow,Zt.setValue(O,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(Ee.envMapIntensity.value=U.environmentIntensity),Ee.dfgLUT!==void 0&&(Ee.dfgLUT.value=q0()),ii){if(Zt.setValue(O,"toneMappingExposure",I.toneMappingExposure),bt.needsLights&&ld(Ee,wi),dt&&G.fog===!0&&ot.refreshFogUniforms(Ee,dt),ot.refreshMaterialUniforms(Ee,G,xt,Et,A.state.transmissionRenderTarget[S.id]),bt.needsLights&&bt.numLightProbeGrids>0){let he=M,Se=0;for(let Dn of A.state.lightProbeGridArray)Dn.texture!==null&&(he.textures[Se]=Dn.texture,he.min[Se]=Dn.boundingBox.min,he.max[Se]=Dn.boundingBox.max,he.resolution[Se]=Dn.resolution,Se++);for(let Dn in he)he[Dn].length=Se;Ee.probesSH.value=he.textures,Ee.probesMin.value=he.min,Ee.probesMax.value=he.max,Ee.probesResolution.value=he.resolution}xs.upload(O,Rc(bt),Ee,Dt)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(xs.upload(O,Rc(bt),Ee,Dt),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Zt.setValue(O,"center",W.center),Zt.setValue(O,"modelViewMatrix",W.modelViewMatrix),Zt.setValue(O,"normalMatrix",W.normalMatrix),Zt.setValue(O,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){let he=G.uniformsGroups;for(let Se=0,Dn=he.length;Se<Dn;Se++){let Nc=he[Se];At.update(Nc,Ce),At.bind(Nc,Ce)}}return Ce}function ld(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.sunLights.needsUpdate=U,S.sunLightShadows.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function cd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return Y},this.setRenderTargetTextures=function(S,U,X){let G=Rt.get(S);G.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Rt.get(S.texture).__webglTexture=U,Rt.get(S.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:X,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){let X=Rt.get(S);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,X=0){Y=S,F=U,k=X;let G=null,W=!1,dt=!1;if(S){let ht=Rt.get(S);if(ht.__useDefaultFramebuffer!==void 0){pt.bindFramebuffer(O.FRAMEBUFFER,ht.__webglFramebuffer),et.copy(S.viewport),nt.copy(S.scissor),Ct=S.scissorTest,pt.viewport(et),pt.scissor(nt),pt.setScissorTest(Ct),V=-1;return}else if(ht.__webglFramebuffer===void 0)Dt.setupRenderTarget(S);else if(ht.__hasExternalTextures)Dt.rebindTextures(S,Rt.get(S.texture).__webglTexture,Rt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Ft=S.depthTexture;if(ht.__boundDepthTexture!==Ft){if(Ft!==null&&Rt.has(Ft)&&(S.width!==Ft.image.width||S.height!==Ft.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Dt.setupDepthRenderbuffer(S)}}let _t=S.texture;(_t.isData3DTexture||_t.isDataArrayTexture||_t.isCompressedArrayTexture)&&(dt=!0);let wt=Rt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(wt[U])?G=wt[U][X]:G=wt[U],W=!0):S.samples>0&&Dt.useMultisampledRTT(S)===!1?G=Rt.get(S).__webglMultisampledFramebuffer:Array.isArray(wt)?G=wt[X]:G=wt,et.copy(S.viewport),nt.copy(S.scissor),Ct=S.scissorTest}else et.copy(Pt).multiplyScalar(xt).floor(),nt.copy(jt).multiplyScalar(xt).floor(),Ct=te;if(X!==0&&(G=N),pt.bindFramebuffer(O.FRAMEBUFFER,G)&&pt.drawBuffers(S,G),pt.viewport(et),pt.scissor(nt),pt.setScissorTest(Ct),W){let ht=Rt.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,ht.__webglTexture,X)}else if(dt){let ht=U;for(let _t=0;_t<S.textures.length;_t++){let wt=Rt.get(S.textures[_t]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+_t,wt.__webglTexture,X,ht)}}else if(S!==null&&X!==0){let ht=Rt.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ht.__webglTexture,X)}V=-1};function Pc(S){let U=Rt.get(S);return(U.__readFormat!==S.format||U.__readType!==S.type)&&(U.__readFormat=S.format,U.__readType=S.type,U.__formatReadable=oe.textureFormatReadable(S.format),U.__typeReadable=oe.textureTypeReadable(S.type)),U}this.readRenderTargetPixels=function(S,U,X,G,W,dt,yt,ht=0){if(!(S&&S.isWebGLRenderTarget)){Nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=Rt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&yt!==void 0&&(_t=_t[yt],Array.isArray(_t)&&(_t=_t[0])),_t){pt.bindFramebuffer(O.FRAMEBUFFER,_t);try{let wt=S.textures[ht],Ft=wt.format,Ht=wt.type;S.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ht);let St=Pc(wt);if(St.__formatReadable===!1){Nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(St.__typeReadable===!1){Nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-G&&X>=0&&X<=S.height-W&&O.readPixels(U,X,G,W,rt.convert(Ft),rt.convert(Ht),dt)}finally{let wt=Y!==null?Rt.get(Y).__webglFramebuffer:null;pt.bindFramebuffer(O.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(S,U,X,G,W,dt,yt,ht=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=Rt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&yt!==void 0&&(_t=_t[yt],Array.isArray(_t)&&(_t=_t[0])),_t)if(U>=0&&U<=S.width-G&&X>=0&&X<=S.height-W){pt.bindFramebuffer(O.FRAMEBUFFER,_t);let wt=S.textures[ht],Ft=wt.format,Ht=wt.type;S.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ht);let St=Pc(wt);if(St.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(St.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Wt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Wt),O.bufferData(O.PIXEL_PACK_BUFFER,dt.byteLength,O.STREAM_READ),O.readPixels(U,X,G,W,rt.convert(Ft),rt.convert(Ht),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let de=Y!==null?Rt.get(Y).__webglFramebuffer:null;pt.bindFramebuffer(O.FRAMEBUFFER,de);let ne=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await zh(O,ne,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Wt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,dt),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(Wt),O.deleteSync(ne),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,X=0){let G=Math.pow(2,-X),W=Math.floor(S.image.width*G),dt=Math.floor(S.image.height*G),yt=U!==null?U.x:0,ht=U!==null?U.y:0;Dt.setTexture2D(S,0),O.copyTexSubImage2D(O.TEXTURE_2D,X,0,0,yt,ht,W,dt),pt.unbindTexture()},this.copyTextureToTexture=function(S,U,X=null,G=null,W=0,dt=0){let yt,ht,_t,wt,Ft,Ht,St,Wt,de,ne=S.isCompressedTexture?S.mipmaps[dt]:S.image;if(X!==null)yt=X.max.x-X.min.x,ht=X.max.y-X.min.y,_t=X.isBox3?X.max.z-X.min.z:1,wt=X.min.x,Ft=X.min.y,Ht=X.isBox3?X.min.z:0;else{let Zt=Math.pow(2,-W);yt=Math.floor(ne.width*Zt),ht=Math.floor(ne.height*Zt),S.isDataArrayTexture?_t=ne.depth:S.isData3DTexture?_t=Math.floor(ne.depth*Zt):_t=1,wt=0,Ft=0,Ht=0}G!==null?(St=G.x,Wt=G.y,de=G.z):(St=0,Wt=0,de=0);let ee=rt.convert(U.format),Te=rt.convert(U.type),bt;U.isData3DTexture?(Dt.setTexture3D(U,0),bt=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Dt.setTexture2DArray(U,0),bt=O.TEXTURE_2D_ARRAY):(Dt.setTexture2D(U,0),bt=O.TEXTURE_2D),pt.activeTexture(O.TEXTURE0),pt.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),pt.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),pt.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);let Fe=pt.getParameter(O.UNPACK_ROW_LENGTH),$t=pt.getParameter(O.UNPACK_IMAGE_HEIGHT),bi=pt.getParameter(O.UNPACK_SKIP_PIXELS),Ce=pt.getParameter(O.UNPACK_SKIP_ROWS),Mr=pt.getParameter(O.UNPACK_SKIP_IMAGES);pt.pixelStorei(O.UNPACK_ROW_LENGTH,ne.width),pt.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ne.height),pt.pixelStorei(O.UNPACK_SKIP_PIXELS,wt),pt.pixelStorei(O.UNPACK_SKIP_ROWS,Ft),pt.pixelStorei(O.UNPACK_SKIP_IMAGES,Ht);let ii=S.isDataArrayTexture||S.isData3DTexture,wi=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){let Zt=Rt.get(S),Ee=Rt.get(U),on=Rt.get(Zt.__renderTarget),he=Rt.get(Ee.__renderTarget);pt.bindFramebuffer(O.READ_FRAMEBUFFER,on.__webglFramebuffer),pt.bindFramebuffer(O.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let Se=0;Se<_t;Se++)ii&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rt.get(S).__webglTexture,W,Ht+Se),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rt.get(U).__webglTexture,dt,de+Se)),O.blitFramebuffer(wt,Ft,wt+yt,Ft+ht,St,Wt,St+yt,Wt+ht,O.DEPTH_BUFFER_BIT,O.NEAREST);pt.bindFramebuffer(O.READ_FRAMEBUFFER,null),pt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||S.isRenderTargetTexture||Rt.has(S)){let Zt=Rt.get(S),Ee=Rt.get(U);pt.bindFramebuffer(O.READ_FRAMEBUFFER,R),pt.bindFramebuffer(O.DRAW_FRAMEBUFFER,L);for(let on=0;on<_t;on++)ii?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Zt.__webglTexture,W,Ht+on):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Zt.__webglTexture,W),wi?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ee.__webglTexture,dt,de+on):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ee.__webglTexture,dt),W!==0?O.blitFramebuffer(wt,Ft,wt+yt,Ft+ht,St,Wt,St+yt,Wt+ht,O.COLOR_BUFFER_BIT,O.NEAREST):wi?O.copyTexSubImage3D(bt,dt,St,Wt,de+on,wt,Ft,yt,ht):O.copyTexSubImage2D(bt,dt,St,Wt,wt,Ft,yt,ht);pt.bindFramebuffer(O.READ_FRAMEBUFFER,null),pt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else wi?S.isDataTexture||S.isData3DTexture?O.texSubImage3D(bt,dt,St,Wt,de,yt,ht,_t,ee,Te,ne.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(bt,dt,St,Wt,de,yt,ht,_t,ee,ne.data):O.texSubImage3D(bt,dt,St,Wt,de,yt,ht,_t,ee,Te,ne):S.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,dt,St,Wt,yt,ht,ee,Te,ne.data):S.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,dt,St,Wt,ne.width,ne.height,ee,ne.data):O.texSubImage2D(O.TEXTURE_2D,dt,St,Wt,yt,ht,ee,Te,ne);pt.pixelStorei(O.UNPACK_ROW_LENGTH,Fe),pt.pixelStorei(O.UNPACK_IMAGE_HEIGHT,$t),pt.pixelStorei(O.UNPACK_SKIP_PIXELS,bi),pt.pixelStorei(O.UNPACK_SKIP_ROWS,Ce),pt.pixelStorei(O.UNPACK_SKIP_IMAGES,Mr),dt===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&O.generateMipmap(bt),pt.unbindTexture()},this.initRenderTarget=function(S){Rt.get(S).__webglFramebuffer===void 0&&Dt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Dt.setTextureCube(S,0):S.isData3DTexture?Dt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Dt.setTexture2DArray(S,0):Dt.setTexture2D(S,0),pt.unbindTexture()},this.resetState=function(){F=0,k=0,Y=null,pt.reset(),at.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=qt._getUnpackColorSpace()}};var cr=new q;function nn(s,t,e,n,i,r){let o=2*Math.PI*i/4,a=Math.max(r-2*i,0),c=Math.PI/4;cr.copy(t),cr[n]=0,cr.normalize();let l=.5*o/(o+a),u=1-cr.angleTo(s)/c;return Math.sign(cr[e])===1?u*l:a/(o+a)+l+l*(1-u)}var ma=class s extends fi{constructor(t=1,e=1,n=1,i=2,r=.1){let o=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let c=new q,l=new q,u=new q(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,h=this.attributes.normal.array,f=this.attributes.uv.array,g=d.length/6,v=new q,p=.5/o;for(let m=0,x=0;m<d.length;m+=3,x+=2)switch(c.fromArray(d,m),l.copy(c),l.x-=Math.sign(l.x)*p,l.y-=Math.sign(l.y)*p,l.z-=Math.sign(l.z)*p,l.normalize(),d[m+0]=u.x*Math.sign(c.x)+l.x*r,d[m+1]=u.y*Math.sign(c.y)+l.y*r,d[m+2]=u.z*Math.sign(c.z)+l.z*r,h[m+0]=l.x,h[m+1]=l.y,h[m+2]=l.z,Math.floor(m/g)){case 0:v.set(1,0,0),f[x+0]=nn(v,l,"z","y",r,n),f[x+1]=1-nn(v,l,"y","z",r,e);break;case 1:v.set(-1,0,0),f[x+0]=1-nn(v,l,"z","y",r,n),f[x+1]=1-nn(v,l,"y","z",r,e);break;case 2:v.set(0,1,0),f[x+0]=1-nn(v,l,"x","z",r,t),f[x+1]=nn(v,l,"z","x",r,n);break;case 3:v.set(0,-1,0),f[x+0]=1-nn(v,l,"x","z",r,t),f[x+1]=1-nn(v,l,"z","x",r,n);break;case 4:v.set(0,0,1),f[x+0]=1-nn(v,l,"x","y",r,t),f[x+1]=1-nn(v,l,"y","x",r,e);break;case 5:v.set(0,0,-1),f[x+0]=nn(v,l,"x","y",r,t),f[x+1]=1-nn(v,l,"y","x",r,e);break}}static fromJSON(t){return new s(t.width,t.height,t.depth,t.segments,t.radius)}};var Mi=class s{constructor(t){t===void 0&&(t=[0,0,0,0,0,0,0,0,0]),this.elements=t}identity(){let t=this.elements;t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1}setZero(){let t=this.elements;t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t[8]=0}setTrace(t){let e=this.elements;e[0]=t.x,e[4]=t.y,e[8]=t.z}getTrace(t){t===void 0&&(t=new b);let e=this.elements;return t.x=e[0],t.y=e[4],t.z=e[8],t}vmult(t,e){e===void 0&&(e=new b);let n=this.elements,i=t.x,r=t.y,o=t.z;return e.x=n[0]*i+n[1]*r+n[2]*o,e.y=n[3]*i+n[4]*r+n[5]*o,e.z=n[6]*i+n[7]*r+n[8]*o,e}smult(t){for(let e=0;e<this.elements.length;e++)this.elements[e]*=t}mmult(t,e){e===void 0&&(e=new s);let n=this.elements,i=t.elements,r=e.elements,o=n[0],a=n[1],c=n[2],l=n[3],u=n[4],d=n[5],h=n[6],f=n[7],g=n[8],v=i[0],p=i[1],m=i[2],x=i[3],E=i[4],M=i[5],T=i[6],A=i[7],_=i[8];return r[0]=o*v+a*x+c*T,r[1]=o*p+a*E+c*A,r[2]=o*m+a*M+c*_,r[3]=l*v+u*x+d*T,r[4]=l*p+u*E+d*A,r[5]=l*m+u*M+d*_,r[6]=h*v+f*x+g*T,r[7]=h*p+f*E+g*A,r[8]=h*m+f*M+g*_,e}scale(t,e){e===void 0&&(e=new s);let n=this.elements,i=e.elements;for(let r=0;r!==3;r++)i[3*r+0]=t.x*n[3*r+0],i[3*r+1]=t.y*n[3*r+1],i[3*r+2]=t.z*n[3*r+2];return e}solve(t,e){e===void 0&&(e=new b);let n=3,i=4,r=[],o,a;for(o=0;o<n*i;o++)r.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)r[o+i*a]=this.elements[o+3*a];r[3]=t.x,r[7]=t.y,r[11]=t.z;let c=3,l=c,u,d=4,h;do{if(o=l-c,r[o+i*o]===0){for(a=o+1;a<l;a++)if(r[o+i*a]!==0){u=d;do h=d-u,r[h+i*o]+=r[h+i*a];while(--u);break}}if(r[o+i*o]!==0)for(a=o+1;a<l;a++){let f=r[o+i*a]/r[o+i*o];u=d;do h=d-u,r[h+i*a]=h<=o?0:r[h+i*a]-r[h+i*o]*f;while(--u)}}while(--c);if(e.z=r[2*i+3]/r[2*i+2],e.y=(r[1*i+3]-r[1*i+2]*e.z)/r[1*i+1],e.x=(r[0*i+3]-r[0*i+2]*e.z-r[0*i+1]*e.y)/r[0*i+0],isNaN(e.x)||isNaN(e.y)||isNaN(e.z)||e.x===1/0||e.y===1/0||e.z===1/0)throw`Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;return e}e(t,e,n){if(n===void 0)return this.elements[e+3*t];this.elements[e+3*t]=n}copy(t){for(let e=0;e<t.elements.length;e++)this.elements[e]=t.elements[e];return this}toString(){let t="";for(let n=0;n<9;n++)t+=this.elements[n]+",";return t}reverse(t){t===void 0&&(t=new s);let e=3,n=6,i=Y0,r,o;for(r=0;r<3;r++)for(o=0;o<3;o++)i[r+n*o]=this.elements[r+3*o];i[3]=1,i[9]=0,i[15]=0,i[4]=0,i[10]=1,i[16]=0,i[5]=0,i[11]=0,i[17]=1;let a=3,c=a,l,u=n,d;do{if(r=c-a,i[r+n*r]===0){for(o=r+1;o<c;o++)if(i[r+n*o]!==0){l=u;do d=u-l,i[d+n*r]+=i[d+n*o];while(--l);break}}if(i[r+n*r]!==0)for(o=r+1;o<c;o++){let h=i[r+n*o]/i[r+n*r];l=u;do d=u-l,i[d+n*o]=d<=r?0:i[d+n*o]-i[d+n*r]*h;while(--l)}}while(--a);r=2;do{o=r-1;do{let h=i[r+n*o]/i[r+n*r];l=n;do d=n-l,i[d+n*o]=i[d+n*o]-i[d+n*r]*h;while(--l)}while(o--)}while(--r);r=2;do{let h=1/i[r+n*r];l=n;do d=n-l,i[d+n*r]=i[d+n*r]*h;while(--l)}while(r--);r=2;do{o=2;do{if(d=i[e+o+n*r],isNaN(d)||d===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(r,o,d)}while(o--)}while(r--);return t}setRotationFromQuaternion(t){let e=t.x,n=t.y,i=t.z,r=t.w,o=e+e,a=n+n,c=i+i,l=e*o,u=e*a,d=e*c,h=n*a,f=n*c,g=i*c,v=r*o,p=r*a,m=r*c,x=this.elements;return x[0]=1-(h+g),x[1]=u-m,x[2]=d+p,x[3]=u+m,x[4]=1-(l+g),x[5]=f-v,x[6]=d-p,x[7]=f+v,x[8]=1-(l+h),this}transpose(t){t===void 0&&(t=new s);let e=this.elements,n=t.elements,i;return n[0]=e[0],n[4]=e[4],n[8]=e[8],i=e[1],n[1]=e[3],n[3]=i,i=e[2],n[2]=e[6],n[6]=i,i=e[5],n[5]=e[7],n[7]=i,t}},Y0=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],b=class s{constructor(t,e,n){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),this.x=t,this.y=e,this.z=n}cross(t,e){e===void 0&&(e=new s);let n=t.x,i=t.y,r=t.z,o=this.x,a=this.y,c=this.z;return e.x=a*r-c*i,e.y=c*n-o*r,e.z=o*i-a*n,e}set(t,e,n){return this.x=t,this.y=e,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,e){if(e)e.x=t.x+this.x,e.y=t.y+this.y,e.z=t.z+this.z;else return new s(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,e){if(e)e.x=this.x-t.x,e.y=this.y-t.y,e.z=this.z-t.z;else return new s(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new Mi([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){let t=this.x,e=this.y,n=this.z,i=Math.sqrt(t*t+e*e+n*n);if(i>0){let r=1/i;this.x*=r,this.y*=r,this.z*=r}else this.x=0,this.y=0,this.z=0;return i}unit(t){t===void 0&&(t=new s);let e=this.x,n=this.y,i=this.z,r=Math.sqrt(e*e+n*n+i*i);return r>0?(r=1/r,t.x=e*r,t.y=n*r,t.z=i*r):(t.x=1,t.y=0,t.z=0),t}length(){let t=this.x,e=this.y,n=this.z;return Math.sqrt(t*t+e*e+n*n)}lengthSquared(){return this.dot(this)}distanceTo(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z;return Math.sqrt((r-e)*(r-e)+(o-n)*(o-n)+(a-i)*(a-i))}distanceSquared(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z;return(r-e)*(r-e)+(o-n)*(o-n)+(a-i)*(a-i)}scale(t,e){e===void 0&&(e=new s);let n=this.x,i=this.y,r=this.z;return e.x=t*n,e.y=t*i,e.z=t*r,e}vmul(t,e){return e===void 0&&(e=new s),e.x=t.x*this.x,e.y=t.y*this.y,e.z=t.z*this.z,e}addScaledVector(t,e,n){return n===void 0&&(n=new s),n.x=this.x+t*e.x,n.y=this.y+t*e.y,n.z=this.z+t*e.z,n}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new s),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(t,e){let n=this.length();if(n>0){let i=Z0,r=1/n;i.set(this.x*r,this.y*r,this.z*r);let o=$0;Math.abs(i.x)<.9?(o.set(1,0,0),i.cross(o,t)):(o.set(0,1,0),i.cross(o,t)),i.cross(t,e)}else t.set(1,0,0),e.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}lerp(t,e,n){let i=this.x,r=this.y,o=this.z;n.x=i+(t.x-i)*e,n.y=r+(t.y-r)*e,n.z=o+(t.z-o)*e}almostEquals(t,e){return e===void 0&&(e=1e-6),!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e||Math.abs(this.z-t.z)>e)}almostZero(t){return t===void 0&&(t=1e-6),!(Math.abs(this.x)>t||Math.abs(this.y)>t||Math.abs(this.z)>t)}isAntiparallelTo(t,e){return this.negate(Au),Au.almostEquals(t,e)}clone(){return new s(this.x,this.y,this.z)}};b.ZERO=new b(0,0,0);b.UNIT_X=new b(1,0,0);b.UNIT_Y=new b(0,1,0);b.UNIT_Z=new b(0,0,1);var Z0=new b,$0=new b,Au=new b,Ze=class s{constructor(t){t===void 0&&(t={}),this.lowerBound=new b,this.upperBound=new b,t.lowerBound&&this.lowerBound.copy(t.lowerBound),t.upperBound&&this.upperBound.copy(t.upperBound)}setFromPoints(t,e,n,i){let r=this.lowerBound,o=this.upperBound,a=n;r.copy(t[0]),a&&a.vmult(r,r),o.copy(r);for(let c=1;c<t.length;c++){let l=t[c];a&&(a.vmult(l,Eu),l=Eu),l.x>o.x&&(o.x=l.x),l.x<r.x&&(r.x=l.x),l.y>o.y&&(o.y=l.y),l.y<r.y&&(r.y=l.y),l.z>o.z&&(o.z=l.z),l.z<r.z&&(r.z=l.z)}return e&&(e.vadd(r,r),e.vadd(o,o)),i&&(r.x-=i,r.y-=i,r.z-=i,o.x+=i,o.y+=i,o.z+=i),this}copy(t){return this.lowerBound.copy(t.lowerBound),this.upperBound.copy(t.upperBound),this}clone(){return new s().copy(this)}extend(t){this.lowerBound.x=Math.min(this.lowerBound.x,t.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,t.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,t.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,t.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,t.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,t.upperBound.z)}overlaps(t){let e=this.lowerBound,n=this.upperBound,i=t.lowerBound,r=t.upperBound,o=i.x<=n.x&&n.x<=r.x||e.x<=r.x&&r.x<=n.x,a=i.y<=n.y&&n.y<=r.y||e.y<=r.y&&r.y<=n.y,c=i.z<=n.z&&n.z<=r.z||e.z<=r.z&&r.z<=n.z;return o&&a&&c}volume(){let t=this.lowerBound,e=this.upperBound;return(e.x-t.x)*(e.y-t.y)*(e.z-t.z)}contains(t){let e=this.lowerBound,n=this.upperBound,i=t.lowerBound,r=t.upperBound;return e.x<=i.x&&n.x>=r.x&&e.y<=i.y&&n.y>=r.y&&e.z<=i.z&&n.z>=r.z}getCorners(t,e,n,i,r,o,a,c){let l=this.lowerBound,u=this.upperBound;t.copy(l),e.set(u.x,l.y,l.z),n.set(u.x,u.y,l.z),i.set(l.x,u.y,u.z),r.set(u.x,l.y,u.z),o.set(l.x,u.y,l.z),a.set(l.x,l.y,u.z),c.copy(u)}toLocalFrame(t,e){let n=Tu,i=n[0],r=n[1],o=n[2],a=n[3],c=n[4],l=n[5],u=n[6],d=n[7];this.getCorners(i,r,o,a,c,l,u,d);for(let h=0;h!==8;h++){let f=n[h];t.pointToLocal(f,f)}return e.setFromPoints(n)}toWorldFrame(t,e){let n=Tu,i=n[0],r=n[1],o=n[2],a=n[3],c=n[4],l=n[5],u=n[6],d=n[7];this.getCorners(i,r,o,a,c,l,u,d);for(let h=0;h!==8;h++){let f=n[h];t.pointToWorld(f,f)}return e.setFromPoints(n)}overlapsRay(t){let{direction:e,from:n}=t,i=1/e.x,r=1/e.y,o=1/e.z,a=(this.lowerBound.x-n.x)*i,c=(this.upperBound.x-n.x)*i,l=(this.lowerBound.y-n.y)*r,u=(this.upperBound.y-n.y)*r,d=(this.lowerBound.z-n.z)*o,h=(this.upperBound.z-n.z)*o,f=Math.max(Math.max(Math.min(a,c),Math.min(l,u)),Math.min(d,h)),g=Math.min(Math.min(Math.max(a,c),Math.max(l,u)),Math.max(d,h));return!(g<0||f>g)}},Eu=new b,Tu=[new b,new b,new b,new b,new b,new b,new b,new b],Ma=class{constructor(){this.matrix=[]}get(t,e){let{index:n}=t,{index:i}=e;if(i>n){let r=i;i=n,n=r}return this.matrix[(n*(n+1)>>1)+i-1]}set(t,e,n){let{index:i}=t,{index:r}=e;if(r>i){let o=r;r=i,i=o}this.matrix[(i*(i+1)>>1)+r-1]=n?1:0}reset(){for(let t=0,e=this.matrix.length;t!==e;t++)this.matrix[t]=0}setNumObjects(t){this.matrix.length=t*(t-1)>>1}},Sa=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;return n[t]===void 0&&(n[t]=[]),n[t].includes(e)||n[t].push(e),this}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return!!(n[t]!==void 0&&n[t].includes(e))}hasAnyEventListener(t){return this._listeners===void 0?!1:this._listeners[t]!==void 0}removeEventListener(t,e){if(this._listeners===void 0)return this;let n=this._listeners;if(n[t]===void 0)return this;let i=n[t].indexOf(e);return i!==-1&&n[t].splice(i,1),this}dispatchEvent(t){if(this._listeners===void 0)return this;let n=this._listeners[t.type];if(n!==void 0){t.target=this;for(let i=0,r=n.length;i<r;i++)n[i].call(this,t)}return this}},ze=class s{constructor(t,e,n,i){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),i===void 0&&(i=1),this.x=t,this.y=e,this.z=n,this.w=i}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(t,e){let n=Math.sin(e*.5);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e*.5),this}toAxisAngle(t){t===void 0&&(t=new b),this.normalize();let e=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(t.x=this.x,t.y=this.y,t.z=this.z):(t.x=this.x/n,t.y=this.y/n,t.z=this.z/n),[t,e]}setFromVectors(t,e){if(t.isAntiparallelTo(e)){let n=J0,i=K0;t.tangents(n,i),this.setFromAxisAngle(n,Math.PI)}else{let n=t.cross(e);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(t.length()**2*e.length()**2)+t.dot(e),this.normalize()}return this}mult(t,e){e===void 0&&(e=new s);let n=this.x,i=this.y,r=this.z,o=this.w,a=t.x,c=t.y,l=t.z,u=t.w;return e.x=n*u+o*a+i*l-r*c,e.y=i*u+o*c+r*a-n*l,e.z=r*u+o*l+n*c-i*a,e.w=o*u-n*a-i*c-r*l,e}inverse(t){t===void 0&&(t=new s);let e=this.x,n=this.y,i=this.z,r=this.w;this.conjugate(t);let o=1/(e*e+n*n+i*i+r*r);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new s),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(t=1/t,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}normalizeFast(){let t=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}vmult(t,e){e===void 0&&(e=new b);let n=t.x,i=t.y,r=t.z,o=this.x,a=this.y,c=this.z,l=this.w,u=l*n+a*r-c*i,d=l*i+c*n-o*r,h=l*r+o*i-a*n,f=-o*n-a*i-c*r;return e.x=u*l+f*-o+d*-c-h*-a,e.y=d*l+f*-a+h*-o-u*-c,e.z=h*l+f*-c+u*-a-d*-o,e}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}toEuler(t,e){e===void 0&&(e="YZX");let n,i,r,o=this.x,a=this.y,c=this.z,l=this.w;switch(e){case"YZX":let u=o*a+c*l;if(u>.499&&(n=2*Math.atan2(o,l),i=Math.PI/2,r=0),u<-.499&&(n=-2*Math.atan2(o,l),i=-Math.PI/2,r=0),n===void 0){let d=o*o,h=a*a,f=c*c;n=Math.atan2(2*a*l-2*o*c,1-2*h-2*f),i=Math.asin(2*u),r=Math.atan2(2*o*l-2*a*c,1-2*d-2*f)}break;default:throw new Error(`Euler order ${e} not supported yet.`)}t.y=n,t.z=i,t.x=r}setFromEuler(t,e,n,i){i===void 0&&(i="XYZ");let r=Math.cos(t/2),o=Math.cos(e/2),a=Math.cos(n/2),c=Math.sin(t/2),l=Math.sin(e/2),u=Math.sin(n/2);return i==="XYZ"?(this.x=c*o*a+r*l*u,this.y=r*l*a-c*o*u,this.z=r*o*u+c*l*a,this.w=r*o*a-c*l*u):i==="YXZ"?(this.x=c*o*a+r*l*u,this.y=r*l*a-c*o*u,this.z=r*o*u-c*l*a,this.w=r*o*a+c*l*u):i==="ZXY"?(this.x=c*o*a-r*l*u,this.y=r*l*a+c*o*u,this.z=r*o*u+c*l*a,this.w=r*o*a-c*l*u):i==="ZYX"?(this.x=c*o*a-r*l*u,this.y=r*l*a+c*o*u,this.z=r*o*u-c*l*a,this.w=r*o*a+c*l*u):i==="YZX"?(this.x=c*o*a+r*l*u,this.y=r*l*a+c*o*u,this.z=r*o*u-c*l*a,this.w=r*o*a-c*l*u):i==="XZY"&&(this.x=c*o*a-r*l*u,this.y=r*l*a-c*o*u,this.z=r*o*u+c*l*a,this.w=r*o*a+c*l*u),this}clone(){return new s(this.x,this.y,this.z,this.w)}slerp(t,e,n){n===void 0&&(n=new s);let i=this.x,r=this.y,o=this.z,a=this.w,c=t.x,l=t.y,u=t.z,d=t.w,h,f,g,v,p;return f=i*c+r*l+o*u+a*d,f<0&&(f=-f,c=-c,l=-l,u=-u,d=-d),1-f>1e-6?(h=Math.acos(f),g=Math.sin(h),v=Math.sin((1-e)*h)/g,p=Math.sin(e*h)/g):(v=1-e,p=e),n.x=v*i+p*c,n.y=v*r+p*l,n.z=v*o+p*u,n.w=v*a+p*d,n}integrate(t,e,n,i){i===void 0&&(i=new s);let r=t.x*n.x,o=t.y*n.y,a=t.z*n.z,c=this.x,l=this.y,u=this.z,d=this.w,h=e*.5;return i.x+=h*(r*d+o*u-a*l),i.y+=h*(o*d+a*c-r*u),i.z+=h*(a*d+r*l-o*c),i.w+=h*(-r*c-o*l-a*u),i}},J0=new b,K0=new b,j0={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256},Mt=class s{constructor(t){t===void 0&&(t={}),this.id=s.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=t.collisionResponse?t.collisionResponse:!0,this.collisionFilterGroup=t.collisionFilterGroup!==void 0?t.collisionFilterGroup:1,this.collisionFilterMask=t.collisionFilterMask!==void 0?t.collisionFilterMask:-1,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(t,e){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(t,e,n,i){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}};Mt.idCounter=0;Mt.types=j0;var Kt=class s{constructor(t){t===void 0&&(t={}),this.position=new b,this.quaternion=new ze,t.position&&this.position.copy(t.position),t.quaternion&&this.quaternion.copy(t.quaternion)}pointToLocal(t,e){return s.pointToLocalFrame(this.position,this.quaternion,t,e)}pointToWorld(t,e){return s.pointToWorldFrame(this.position,this.quaternion,t,e)}vectorToWorldFrame(t,e){return e===void 0&&(e=new b),this.quaternion.vmult(t,e),e}static pointToLocalFrame(t,e,n,i){return i===void 0&&(i=new b),n.vsub(t,i),e.conjugate(Cu),Cu.vmult(i,i),i}static pointToWorldFrame(t,e,n,i){return i===void 0&&(i=new b),e.vmult(n,i),i.vadd(t,i),i}static vectorToWorldFrame(t,e,n){return n===void 0&&(n=new b),t.vmult(e,n),n}static vectorToLocalFrame(t,e,n,i){return i===void 0&&(i=new b),e.w*=-1,e.vmult(n,i),e.w*=-1,i}},Cu=new ze,rc=class s extends Mt{constructor(t){t===void 0&&(t={});let{vertices:e=[],faces:n=[],normals:i=[],axes:r,boundingSphereRadius:o}=t;super({type:Mt.types.CONVEXPOLYHEDRON}),this.vertices=e,this.faces=n,this.faceNormals=i,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=r?r.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){let t=this.faces,e=this.vertices,n=this.uniqueEdges;n.length=0;let i=new b;for(let r=0;r!==t.length;r++){let o=t[r],a=o.length;for(let c=0;c!==a;c++){let l=(c+1)%a;e[o[c]].vsub(e[o[l]],i),i.normalize();let u=!1;for(let d=0;d!==n.length;d++)if(n[d].almostEquals(i)||n[d].almostEquals(i)){u=!0;break}u||n.push(i.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let t=0;t<this.faces.length;t++){for(let i=0;i<this.faces[t].length;i++)if(!this.vertices[this.faces[t][i]])throw new Error(`Vertex ${this.faces[t][i]} not found!`);let e=this.faceNormals[t]||new b;this.getFaceNormal(t,e),e.negate(e),this.faceNormals[t]=e;let n=this.vertices[this.faces[t][0]];if(e.dot(n)<0){console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let i=0;i<this.faces[t].length;i++)console.warn(`.vertices[${this.faces[t][i]}] = Vec3(${this.vertices[this.faces[t][i]].toString()})`)}}}getFaceNormal(t,e){let n=this.faces[t],i=this.vertices[n[0]],r=this.vertices[n[1]],o=this.vertices[n[2]];s.computeNormal(i,r,o,e)}static computeNormal(t,e,n,i){let r=new b,o=new b;e.vsub(t,o),n.vsub(e,r),r.cross(o,i),i.isZero()||i.normalize()}clipAgainstHull(t,e,n,i,r,o,a,c,l){let u=new b,d=-1,h=-Number.MAX_VALUE;for(let g=0;g<n.faces.length;g++){u.copy(n.faceNormals[g]),r.vmult(u,u);let v=u.dot(o);v>h&&(h=v,d=g)}let f=[];for(let g=0;g<n.faces[d].length;g++){let v=n.vertices[n.faces[d][g]],p=new b;p.copy(v),r.vmult(p,p),i.vadd(p,p),f.push(p)}d>=0&&this.clipFaceAgainstHull(o,t,e,f,a,c,l)}findSeparatingAxis(t,e,n,i,r,o,a,c){let l=new b,u=new b,d=new b,h=new b,f=new b,g=new b,v=Number.MAX_VALUE,p=this;if(p.uniqueAxes)for(let m=0;m!==p.uniqueAxes.length;m++){n.vmult(p.uniqueAxes[m],l);let x=p.testSepAxis(l,t,e,n,i,r);if(x===!1)return!1;x<v&&(v=x,o.copy(l))}else{let m=a?a.length:p.faces.length;for(let x=0;x<m;x++){let E=a?a[x]:x;l.copy(p.faceNormals[E]),n.vmult(l,l);let M=p.testSepAxis(l,t,e,n,i,r);if(M===!1)return!1;M<v&&(v=M,o.copy(l))}}if(t.uniqueAxes)for(let m=0;m!==t.uniqueAxes.length;m++){r.vmult(t.uniqueAxes[m],u);let x=p.testSepAxis(u,t,e,n,i,r);if(x===!1)return!1;x<v&&(v=x,o.copy(u))}else{let m=c?c.length:t.faces.length;for(let x=0;x<m;x++){let E=c?c[x]:x;u.copy(t.faceNormals[E]),r.vmult(u,u);let M=p.testSepAxis(u,t,e,n,i,r);if(M===!1)return!1;M<v&&(v=M,o.copy(u))}}for(let m=0;m!==p.uniqueEdges.length;m++){n.vmult(p.uniqueEdges[m],h);for(let x=0;x!==t.uniqueEdges.length;x++)if(r.vmult(t.uniqueEdges[x],f),h.cross(f,g),!g.almostZero()){g.normalize();let E=p.testSepAxis(g,t,e,n,i,r);if(E===!1)return!1;E<v&&(v=E,o.copy(g))}}return i.vsub(e,d),d.dot(o)>0&&o.negate(o),!0}testSepAxis(t,e,n,i,r,o){let a=this;s.project(a,t,n,i,Ql),s.project(e,t,r,o,tc);let c=Ql[0],l=Ql[1],u=tc[0],d=tc[1];if(c<d||u<l)return!1;let h=c-d,f=u-l;return h<f?h:f}calculateLocalInertia(t,e){let n=new b,i=new b;this.computeLocalAABB(i,n);let r=n.x-i.x,o=n.y-i.y,a=n.z-i.z;e.x=1/12*t*(2*o*2*o+2*a*2*a),e.y=1/12*t*(2*r*2*r+2*a*2*a),e.z=1/12*t*(2*o*2*o+2*r*2*r)}getPlaneConstantOfFace(t){let e=this.faces[t],n=this.faceNormals[t],i=this.vertices[e[0]];return-n.dot(i)}clipFaceAgainstHull(t,e,n,i,r,o,a){let c=new b,l=new b,u=new b,d=new b,h=new b,f=new b,g=new b,v=new b,p=this,m=[],x=i,E=m,M=-1,T=Number.MAX_VALUE;for(let I=0;I<p.faces.length;I++){c.copy(p.faceNormals[I]),n.vmult(c,c);let D=c.dot(t);D<T&&(T=D,M=I)}if(M<0)return;let A=p.faces[M];A.connectedFaces=[];for(let I=0;I<p.faces.length;I++)for(let D=0;D<p.faces[I].length;D++)A.indexOf(p.faces[I][D])!==-1&&I!==M&&A.connectedFaces.indexOf(I)===-1&&A.connectedFaces.push(I);let _=A.length;for(let I=0;I<_;I++){let D=p.vertices[A[I]],z=p.vertices[A[(I+1)%_]];D.vsub(z,l),u.copy(l),n.vmult(u,u),e.vadd(u,u),d.copy(this.faceNormals[M]),n.vmult(d,d),e.vadd(d,d),u.cross(d,h),h.negate(h),f.copy(D),n.vmult(f,f),e.vadd(f,f);let N=A.connectedFaces[I];g.copy(this.faceNormals[N]);let R=this.getPlaneConstantOfFace(N);v.copy(g),n.vmult(v,v);let L=R-v.dot(e);for(this.clipFaceAgainstPlane(x,E,v,L);x.length;)x.shift();for(;E.length;)x.push(E.shift())}g.copy(this.faceNormals[M]);let w=this.getPlaneConstantOfFace(M);v.copy(g),n.vmult(v,v);let B=w-v.dot(e);for(let I=0;I<x.length;I++){let D=v.dot(x[I])+B;if(D<=r&&(console.log(`clamped: depth=${D} to minDist=${r}`),D=r),D<=o){let z=x[I];if(D<=1e-6){let N={point:z,normal:v,depth:D};a.push(N)}}}}clipFaceAgainstPlane(t,e,n,i){let r,o,a=t.length;if(a<2)return e;let c=t[t.length-1],l=t[0];r=n.dot(c)+i;for(let u=0;u<a;u++){if(l=t[u],o=n.dot(l)+i,r<0)if(o<0){let d=new b;d.copy(l),e.push(d)}else{let d=new b;c.lerp(l,r/(r-o),d),e.push(d)}else if(o<0){let d=new b;c.lerp(l,r/(r-o),d),e.push(d),e.push(l)}c=l,r=o}return e}computeWorldVertices(t,e){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new b);let n=this.vertices,i=this.worldVertices;for(let r=0;r!==this.vertices.length;r++)e.vmult(n[r],i[r]),t.vadd(i[r],i[r]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(t,e){let n=this.vertices;t.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),e.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let i=0;i<this.vertices.length;i++){let r=n[i];r.x<t.x?t.x=r.x:r.x>e.x&&(e.x=r.x),r.y<t.y?t.y=r.y:r.y>e.y&&(e.y=r.y),r.z<t.z?t.z=r.z:r.z>e.z&&(e.z=r.z)}}computeWorldFaceNormals(t){let e=this.faceNormals.length;for(;this.worldFaceNormals.length<e;)this.worldFaceNormals.push(new b);let n=this.faceNormals,i=this.worldFaceNormals;for(let r=0;r!==e;r++)t.vmult(n[r],i[r]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let t=0,e=this.vertices;for(let n=0;n!==e.length;n++){let i=e[n].lengthSquared();i>t&&(t=i)}this.boundingSphereRadius=Math.sqrt(t)}calculateWorldAABB(t,e,n,i){let r=this.vertices,o,a,c,l,u,d,h=new b;for(let f=0;f<r.length;f++){h.copy(r[f]),e.vmult(h,h),t.vadd(h,h);let g=h;(o===void 0||g.x<o)&&(o=g.x),(l===void 0||g.x>l)&&(l=g.x),(a===void 0||g.y<a)&&(a=g.y),(u===void 0||g.y>u)&&(u=g.y),(c===void 0||g.z<c)&&(c=g.z),(d===void 0||g.z>d)&&(d=g.z)}n.set(o,a,c),i.set(l,u,d)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(t){t===void 0&&(t=new b);let e=this.vertices;for(let n=0;n<e.length;n++)t.vadd(e[n],t);return t.scale(1/e.length,t),t}transformAllPoints(t,e){let n=this.vertices.length,i=this.vertices;if(e){for(let r=0;r<n;r++){let o=i[r];e.vmult(o,o)}for(let r=0;r<this.faceNormals.length;r++){let o=this.faceNormals[r];e.vmult(o,o)}}if(t)for(let r=0;r<n;r++){let o=i[r];o.vadd(t,o)}}pointIsInside(t){let e=this.vertices,n=this.faces,i=this.faceNormals,r=null,o=new b;this.getAveragePointLocal(o);for(let a=0;a<this.faces.length;a++){let c=i[a],l=e[n[a][0]],u=new b;t.vsub(l,u);let d=c.dot(u),h=new b;o.vsub(l,h);let f=c.dot(h);if(d<0&&f>0||d>0&&f<0)return!1}return r?1:-1}static project(t,e,n,i,r){let o=t.vertices.length,a=tx,c=0,l=0,u=ex,d=t.vertices;u.setZero(),Kt.vectorToLocalFrame(n,i,e,a),Kt.pointToLocalFrame(n,i,u,u);let h=u.dot(a);l=c=d[0].dot(a);for(let f=1;f<o;f++){let g=d[f].dot(a);g>c&&(c=g),g<l&&(l=g)}if(l-=h,c-=h,l>c){let f=l;l=c,c=f}r[0]=c,r[1]=l}},Ql=[],tc=[],Q0=new b,tx=new b,ex=new b,Ms=class s extends Mt{constructor(t){super({type:Mt.types.BOX}),this.halfExtents=t,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){let t=this.halfExtents.x,e=this.halfExtents.y,n=this.halfExtents.z,i=b,r=[new i(-t,-e,-n),new i(t,-e,-n),new i(t,e,-n),new i(-t,e,-n),new i(-t,-e,n),new i(t,-e,n),new i(t,e,n),new i(-t,e,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new i(0,0,1),new i(0,1,0),new i(1,0,0)],c=new rc({vertices:r,faces:o,axes:a});this.convexPolyhedronRepresentation=c,c.material=this.material}calculateLocalInertia(t,e){return e===void 0&&(e=new b),s.calculateInertia(this.halfExtents,t,e),e}static calculateInertia(t,e,n){let i=t;n.x=1/12*e*(2*i.y*2*i.y+2*i.z*2*i.z),n.y=1/12*e*(2*i.x*2*i.x+2*i.z*2*i.z),n.z=1/12*e*(2*i.y*2*i.y+2*i.x*2*i.x)}getSideNormals(t,e){let n=t,i=this.halfExtents;if(n[0].set(i.x,0,0),n[1].set(0,i.y,0),n[2].set(0,0,i.z),n[3].set(-i.x,0,0),n[4].set(0,-i.y,0),n[5].set(0,0,-i.z),e!==void 0)for(let r=0;r!==n.length;r++)e.vmult(n[r],n[r]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(t,e,n){let i=this.halfExtents,r=[[i.x,i.y,i.z],[-i.x,i.y,i.z],[-i.x,-i.y,i.z],[-i.x,-i.y,-i.z],[i.x,-i.y,-i.z],[i.x,i.y,-i.z],[-i.x,i.y,-i.z],[i.x,-i.y,i.z]];for(let o=0;o<r.length;o++)yi.set(r[o][0],r[o][1],r[o][2]),e.vmult(yi,yi),t.vadd(yi,yi),n(yi.x,yi.y,yi.z)}calculateWorldAABB(t,e,n,i){let r=this.halfExtents;Cn[0].set(r.x,r.y,r.z),Cn[1].set(-r.x,r.y,r.z),Cn[2].set(-r.x,-r.y,r.z),Cn[3].set(-r.x,-r.y,-r.z),Cn[4].set(r.x,-r.y,-r.z),Cn[5].set(r.x,r.y,-r.z),Cn[6].set(-r.x,r.y,-r.z),Cn[7].set(r.x,-r.y,r.z);let o=Cn[0];e.vmult(o,o),t.vadd(o,o),i.copy(o),n.copy(o);for(let a=1;a<8;a++){let c=Cn[a];e.vmult(c,c),t.vadd(c,c);let l=c.x,u=c.y,d=c.z;l>i.x&&(i.x=l),u>i.y&&(i.y=u),d>i.z&&(i.z=d),l<n.x&&(n.x=l),u<n.y&&(n.y=u),d<n.z&&(n.z=d)}}},yi=new b,Cn=[new b,new b,new b,new b,new b,new b,new b,new b],gc={DYNAMIC:1,STATIC:2,KINEMATIC:4},xc={AWAKE:0,SLEEPY:1,SLEEPING:2},Ot=class s extends Sa{constructor(t){t===void 0&&(t={}),super(),this.id=s.idCounter++,this.index=-1,this.world=null,this.vlambda=new b,this.collisionFilterGroup=typeof t.collisionFilterGroup=="number"?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask=="number"?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse=="boolean"?t.collisionResponse:!0,this.position=new b,this.previousPosition=new b,this.interpolatedPosition=new b,this.initPosition=new b,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new b,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new b,this.force=new b;let e=typeof t.mass=="number"?t.mass:0;this.mass=e,this.invMass=e>0?1/e:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping=="number"?t.linearDamping:.01,this.type=e<=0?s.STATIC:s.DYNAMIC,typeof t.type==typeof s.STATIC&&(this.type=t.type),this.allowSleep=typeof t.allowSleep<"u"?t.allowSleep:!0,this.sleepState=s.AWAKE,this.sleepSpeedLimit=typeof t.sleepSpeedLimit<"u"?t.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof t.sleepTimeLimit<"u"?t.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new b,this.quaternion=new ze,this.initQuaternion=new ze,this.previousQuaternion=new ze,this.interpolatedQuaternion=new ze,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new b,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new b,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new b,this.invInertia=new b,this.invInertiaWorld=new Mi,this.invMassSolve=0,this.invInertiaSolve=new b,this.invInertiaWorldSolve=new Mi,this.fixedRotation=typeof t.fixedRotation<"u"?t.fixedRotation:!1,this.angularDamping=typeof t.angularDamping<"u"?t.angularDamping:.01,this.linearFactor=new b(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new b(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new Ze,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new b,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){let t=this.sleepState;this.sleepState=s.AWAKE,this.wakeUpAfterNarrowphase=!1,t===s.SLEEPING&&this.dispatchEvent(s.wakeupEvent)}sleep(){this.sleepState=s.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){let e=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),i=this.sleepSpeedLimit**2;e===s.AWAKE&&n<i?(this.sleepState=s.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(s.sleepyEvent)):e===s.SLEEPY&&n>i?this.wakeUp():e===s.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(s.sleepEvent))}}updateSolveMassProperties(){this.sleepState===s.SLEEPING||this.type===s.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(t,e){return e===void 0&&(e=new b),t.vsub(this.position,e),this.quaternion.conjugate().vmult(e,e),e}vectorToLocalFrame(t,e){return e===void 0&&(e=new b),this.quaternion.conjugate().vmult(t,e),e}pointToWorldFrame(t,e){return e===void 0&&(e=new b),this.quaternion.vmult(t,e),e.vadd(this.position,e),e}vectorToWorldFrame(t,e){return e===void 0&&(e=new b),this.quaternion.vmult(t,e),e}addShape(t,e,n){let i=new b,r=new ze;return e&&i.copy(e),n&&r.copy(n),this.shapes.push(t),this.shapeOffsets.push(i),this.shapeOrientations.push(r),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=this,this}removeShape(t){let e=this.shapes.indexOf(t);return e===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(e,1),this.shapeOffsets.splice(e,1),this.shapeOrientations.splice(e,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=null,this)}updateBoundingRadius(){let t=this.shapes,e=this.shapeOffsets,n=t.length,i=0;for(let r=0;r!==n;r++){let o=t[r];o.updateBoundingSphereRadius();let a=e[r].length(),c=o.boundingSphereRadius;a+c>i&&(i=a+c)}this.boundingRadius=i}updateAABB(){let t=this.shapes,e=this.shapeOffsets,n=this.shapeOrientations,i=t.length,r=nx,o=ix,a=this.quaternion,c=this.aabb,l=sx;for(let u=0;u!==i;u++){let d=t[u];a.vmult(e[u],r),r.vadd(this.position,r),a.mult(n[u],o),d.calculateWorldAABB(r,o,l.lowerBound,l.upperBound),u===0?c.copy(l):c.extend(l)}this.aabbNeedsUpdate=!1}updateInertiaWorld(t){let e=this.invInertia;if(!(e.x===e.y&&e.y===e.z&&!t)){let n=rx,i=ox;n.setRotationFromQuaternion(this.quaternion),n.transpose(i),n.scale(e,n),n.mmult(i,this.invInertiaWorld)}}applyForce(t,e){if(e===void 0&&(e=new b),this.type!==s.DYNAMIC)return;this.sleepState===s.SLEEPING&&this.wakeUp();let n=lx;e.cross(t,n),this.force.vadd(t,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(t,e){if(e===void 0&&(e=new b),this.type!==s.DYNAMIC)return;let n=cx,i=hx;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,i),this.applyForce(n,i)}applyTorque(t){this.type===s.DYNAMIC&&(this.sleepState===s.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,e){if(e===void 0&&(e=new b),this.type!==s.DYNAMIC)return;this.sleepState===s.SLEEPING&&this.wakeUp();let n=e,i=ux;i.copy(t),i.scale(this.invMass,i),this.velocity.vadd(i,this.velocity);let r=dx;n.cross(t,r),this.invInertiaWorld.vmult(r,r),this.angularVelocity.vadd(r,this.angularVelocity)}applyLocalImpulse(t,e){if(e===void 0&&(e=new b),this.type!==s.DYNAMIC)return;let n=fx,i=px;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,i),this.applyImpulse(n,i)}updateMassProperties(){let t=mx;this.invMass=this.mass>0?1/this.mass:0;let e=this.inertia,n=this.fixedRotation;this.updateAABB(),t.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),Ms.calculateInertia(t,this.mass,e),this.invInertia.set(e.x>0&&!n?1/e.x:0,e.y>0&&!n?1/e.y:0,e.z>0&&!n?1/e.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(t,e){let n=new b;return t.vsub(this.position,n),this.angularVelocity.cross(n,e),this.velocity.vadd(e,e),e}integrate(t,e,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===s.DYNAMIC||this.type===s.KINEMATIC)||this.sleepState===s.SLEEPING)return;let i=this.velocity,r=this.angularVelocity,o=this.position,a=this.force,c=this.torque,l=this.quaternion,u=this.invMass,d=this.invInertiaWorld,h=this.linearFactor,f=u*t;i.x+=a.x*f*h.x,i.y+=a.y*f*h.y,i.z+=a.z*f*h.z;let g=d.elements,v=this.angularFactor,p=c.x*v.x,m=c.y*v.y,x=c.z*v.z;r.x+=t*(g[0]*p+g[1]*m+g[2]*x),r.y+=t*(g[3]*p+g[4]*m+g[5]*x),r.z+=t*(g[6]*p+g[7]*m+g[8]*x),o.x+=i.x*t,o.y+=i.y*t,o.z+=i.z*t,l.integrate(this.angularVelocity,t,this.angularFactor,l),e&&(n?l.normalizeFast():l.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}};Ot.idCounter=0;Ot.COLLIDE_EVENT_NAME="collide";Ot.DYNAMIC=gc.DYNAMIC;Ot.STATIC=gc.STATIC;Ot.KINEMATIC=gc.KINEMATIC;Ot.AWAKE=xc.AWAKE;Ot.SLEEPY=xc.SLEEPY;Ot.SLEEPING=xc.SLEEPING;Ot.wakeupEvent={type:"wakeup"};Ot.sleepyEvent={type:"sleepy"};Ot.sleepEvent={type:"sleep"};var nx=new b,ix=new ze,sx=new Ze,rx=new Mi,ox=new Mi,ax=new Mi,lx=new b,cx=new b,hx=new b,ux=new b,dx=new b,fx=new b,px=new b,mx=new b,oc=class{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(t,e,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(t,e){return!((t.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&t.collisionFilterMask)===0||((t.type&Ot.STATIC)!==0||t.sleepState===Ot.SLEEPING)&&((e.type&Ot.STATIC)!==0||e.sleepState===Ot.SLEEPING))}intersectionTest(t,e,n,i){this.useBoundingBoxes?this.doBoundingBoxBroadphase(t,e,n,i):this.doBoundingSphereBroadphase(t,e,n,i)}doBoundingSphereBroadphase(t,e,n,i){let r=gx;e.position.vsub(t.position,r);let o=(t.boundingRadius+e.boundingRadius)**2;r.lengthSquared()<o&&(n.push(t),i.push(e))}doBoundingBoxBroadphase(t,e,n,i){t.aabbNeedsUpdate&&t.updateAABB(),e.aabbNeedsUpdate&&e.updateAABB(),t.aabb.overlaps(e.aabb)&&(n.push(t),i.push(e))}makePairsUnique(t,e){let n=xx,i=_x,r=vx,o=t.length;for(let a=0;a!==o;a++)i[a]=t[a],r[a]=e[a];t.length=0,e.length=0;for(let a=0;a!==o;a++){let c=i[a].id,l=r[a].id,u=c<l?`${c},${l}`:`${l},${c}`;n[u]=a,n.keys.push(u)}for(let a=0;a!==n.keys.length;a++){let c=n.keys.pop(),l=n[c];t.push(i[l]),e.push(r[l]),delete n[c]}}setWorld(t){}static boundingSphereCheck(t,e){let n=new b;t.position.vsub(e.position,n);let i=t.shapes[0],r=e.shapes[0];return Math.pow(i.boundingSphereRadius+r.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(t,e,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}},gx=new b;new b;new ze;new b;var xx={keys:[]},_x=[],vx=[];new b;var lb=new b;new b;var ac=class extends oc{constructor(){super()}collisionPairs(t,e,n){let i=t.bodies,r=i.length,o,a;for(let c=0;c!==r;c++)for(let l=0;l!==c;l++)o=i[c],a=i[l],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,e,n)}aabbQuery(t,e,n){n===void 0&&(n=[]);for(let i=0;i<t.bodies.length;i++){let r=t.bodies[i];r.aabbNeedsUpdate&&r.updateAABB(),r.aabb.overlaps(e)&&n.push(r)}return n}},Ss=class{constructor(){this.rayFromWorld=new b,this.rayToWorld=new b,this.hitNormalWorld=new b,this.hitPointWorld=new b,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(t,e,n,i,r,o,a){this.rayFromWorld.copy(t),this.rayToWorld.copy(e),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(i),this.shape=r,this.body=o,this.distance=a}},Vu,ku,Gu,Hu,Wu,qu,Xu,_c={CLOSEST:1,ANY:2,ALL:4};Vu=Mt.types.SPHERE;ku=Mt.types.PLANE;Gu=Mt.types.BOX;Hu=Mt.types.CYLINDER;Wu=Mt.types.CONVEXPOLYHEDRON;qu=Mt.types.HEIGHTFIELD;Xu=Mt.types.TRIMESH;var sn=class s{get[Vu](){return this._intersectSphere}get[ku](){return this._intersectPlane}get[Gu](){return this._intersectBox}get[Hu](){return this._intersectConvex}get[Wu](){return this._intersectConvex}get[qu](){return this._intersectHeightfield}get[Xu](){return this._intersectTrimesh}constructor(t,e){t===void 0&&(t=new b),e===void 0&&(e=new b),this.from=t.clone(),this.to=e.clone(),this.direction=new b,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=s.ANY,this.result=new Ss,this.hasHit=!1,this.callback=n=>{}}intersectWorld(t,e){return this.mode=e.mode||s.ANY,this.result=e.result||new Ss,this.skipBackfaces=!!e.skipBackfaces,this.collisionFilterMask=typeof e.collisionFilterMask<"u"?e.collisionFilterMask:-1,this.collisionFilterGroup=typeof e.collisionFilterGroup<"u"?e.collisionFilterGroup:-1,this.checkCollisionResponse=typeof e.checkCollisionResponse<"u"?e.checkCollisionResponse:!0,e.from&&this.from.copy(e.from),e.to&&this.to.copy(e.to),this.callback=e.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(Ru),ec.length=0,t.broadphase.aabbQuery(t,Ru,ec),this.intersectBodies(ec),this.hasHit}intersectBody(t,e){e&&(this.result=e,this.updateDirection());let n=this.checkCollisionResponse;if(n&&!t.collisionResponse||(this.collisionFilterGroup&t.collisionFilterMask)===0||(t.collisionFilterGroup&this.collisionFilterMask)===0)return;let i=yx,r=Mx;for(let o=0,a=t.shapes.length;o<a;o++){let c=t.shapes[o];if(!(n&&!c.collisionResponse)&&(t.quaternion.mult(t.shapeOrientations[o],r),t.quaternion.vmult(t.shapeOffsets[o],i),i.vadd(t.position,i),this.intersectShape(c,r,i,t),this.result.shouldStop))break}}intersectBodies(t,e){e&&(this.result=e,this.updateDirection());for(let n=0,i=t.length;!this.result.shouldStop&&n<i;n++)this.intersectBody(t[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(t,e,n,i){let r=this.from;if(Bx(r,this.direction,n)>t.boundingSphereRadius)return;let a=this[t.type];a&&a.call(this,t,e,n,i,t)}_intersectBox(t,e,n,i,r){return this._intersectConvex(t.convexPolyhedronRepresentation,e,n,i,r)}_intersectPlane(t,e,n,i,r){let o=this.from,a=this.to,c=this.direction,l=new b(0,0,1);e.vmult(l,l);let u=new b;o.vsub(n,u);let d=u.dot(l);a.vsub(n,u);let h=u.dot(l);if(d*h>0||o.distanceTo(a)<d)return;let f=l.dot(c);if(Math.abs(f)<this.precision)return;let g=new b,v=new b,p=new b;o.vsub(n,g);let m=-l.dot(g)/f;c.scale(m,v),o.vadd(v,p),this.reportIntersection(l,p,r,i,-1)}getAABB(t){let{lowerBound:e,upperBound:n}=t,i=this.to,r=this.from;e.x=Math.min(i.x,r.x),e.y=Math.min(i.y,r.y),e.z=Math.min(i.z,r.z),n.x=Math.max(i.x,r.x),n.y=Math.max(i.y,r.y),n.z=Math.max(i.z,r.z)}_intersectHeightfield(t,e,n,i,r){t.data,t.elementSize;let o=Sx;o.from.copy(this.from),o.to.copy(this.to),Kt.pointToLocalFrame(n,e,o.from,o.from),Kt.pointToLocalFrame(n,e,o.to,o.to),o.updateDirection();let a=bx,c,l,u,d;c=l=0,u=d=t.data.length-1;let h=new Ze;o.getAABB(h),t.getIndexOfPosition(h.lowerBound.x,h.lowerBound.y,a,!0),c=Math.max(c,a[0]),l=Math.max(l,a[1]),t.getIndexOfPosition(h.upperBound.x,h.upperBound.y,a,!0),u=Math.min(u,a[0]+1),d=Math.min(d,a[1]+1);for(let f=c;f<u;f++)for(let g=l;g<d;g++){if(this.result.shouldStop)return;if(t.getAabbAtIndex(f,g,h),!!h.overlapsRay(o)){if(t.getConvexTrianglePillar(f,g,!1),Kt.pointToWorldFrame(n,e,t.pillarOffset,ga),this._intersectConvex(t.pillarConvex,e,ga,i,r,Iu),this.result.shouldStop)return;t.getConvexTrianglePillar(f,g,!0),Kt.pointToWorldFrame(n,e,t.pillarOffset,ga),this._intersectConvex(t.pillarConvex,e,ga,i,r,Iu)}}}_intersectSphere(t,e,n,i,r){let o=this.from,a=this.to,c=t.radius,l=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,u=2*((a.x-o.x)*(o.x-n.x)+(a.y-o.y)*(o.y-n.y)+(a.z-o.z)*(o.z-n.z)),d=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-c**2,h=u**2-4*l*d,f=wx,g=Ax;if(!(h<0))if(h===0)o.lerp(a,h,f),f.vsub(n,g),g.normalize(),this.reportIntersection(g,f,r,i,-1);else{let v=(-u-Math.sqrt(h))/(2*l),p=(-u+Math.sqrt(h))/(2*l);if(v>=0&&v<=1&&(o.lerp(a,v,f),f.vsub(n,g),g.normalize(),this.reportIntersection(g,f,r,i,-1)),this.result.shouldStop)return;p>=0&&p<=1&&(o.lerp(a,p,f),f.vsub(n,g),g.normalize(),this.reportIntersection(g,f,r,i,-1))}}_intersectConvex(t,e,n,i,r,o){let a=Ex,c=Pu,l=o&&o.faceList||null,u=t.faces,d=t.vertices,h=t.faceNormals,f=this.direction,g=this.from,v=this.to,p=g.distanceTo(v),m=l?l.length:u.length,x=this.result;for(let E=0;!x.shouldStop&&E<m;E++){let M=l?l[E]:E,T=u[M],A=h[M],_=e,w=n;c.copy(d[T[0]]),_.vmult(c,c),c.vadd(w,c),c.vsub(g,c),_.vmult(A,a);let B=f.dot(a);if(Math.abs(B)<this.precision)continue;let I=a.dot(c)/B;if(!(I<0)){f.scale(I,He),He.vadd(g,He),mn.copy(d[T[0]]),_.vmult(mn,mn),w.vadd(mn,mn);for(let D=1;!x.shouldStop&&D<T.length-1;D++){Rn.copy(d[T[D]]),In.copy(d[T[D+1]]),_.vmult(Rn,Rn),_.vmult(In,In),w.vadd(Rn,Rn),w.vadd(In,In);let z=He.distanceTo(g);!(s.pointInTriangle(He,mn,Rn,In)||s.pointInTriangle(He,Rn,mn,In))||z>p||this.reportIntersection(a,He,r,i,M)}}}}_intersectTrimesh(t,e,n,i,r,o){let a=Rx,c=Fx,l=Ux,u=Pu,d=Ix,h=Px,f=Nx,g=Dx,v=Lx,p=t.indices;t.vertices;let m=this.from,x=this.to,E=this.direction;l.position.copy(n),l.quaternion.copy(e),Kt.vectorToLocalFrame(n,e,E,d),Kt.pointToLocalFrame(n,e,m,h),Kt.pointToLocalFrame(n,e,x,f),f.x*=t.scale.x,f.y*=t.scale.y,f.z*=t.scale.z,h.x*=t.scale.x,h.y*=t.scale.y,h.z*=t.scale.z,f.vsub(h,d),d.normalize();let M=h.distanceSquared(f);t.tree.rayQuery(this,l,c);for(let T=0,A=c.length;!this.result.shouldStop&&T!==A;T++){let _=c[T];t.getNormal(_,a),t.getVertex(p[_*3],mn),mn.vsub(h,u);let w=d.dot(a),B=a.dot(u)/w;if(B<0)continue;d.scale(B,He),He.vadd(h,He),t.getVertex(p[_*3+1],Rn),t.getVertex(p[_*3+2],In);let I=He.distanceSquared(h);!(s.pointInTriangle(He,Rn,mn,In)||s.pointInTriangle(He,mn,Rn,In))||I>M||(Kt.vectorToWorldFrame(e,a,v),Kt.pointToWorldFrame(n,e,He,g),this.reportIntersection(v,g,r,i,_))}c.length=0}reportIntersection(t,e,n,i,r){let o=this.from,a=this.to,c=o.distanceTo(e),l=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(l.hitFaceIndex=typeof r<"u"?r:-1,this.mode){case s.ALL:this.hasHit=!0,l.set(o,a,t,e,n,i,c),l.hasHit=!0,this.callback(l);break;case s.CLOSEST:(c<l.distance||!l.hasHit)&&(this.hasHit=!0,l.hasHit=!0,l.set(o,a,t,e,n,i,c));break;case s.ANY:this.hasHit=!0,l.hasHit=!0,l.set(o,a,t,e,n,i,c),l.shouldStop=!0;break}}static pointInTriangle(t,e,n,i){i.vsub(e,Bi),n.vsub(e,hr),t.vsub(e,nc);let r=Bi.dot(Bi),o=Bi.dot(hr),a=Bi.dot(nc),c=hr.dot(hr),l=hr.dot(nc),u,d;return(u=c*a-o*l)>=0&&(d=r*l-o*a)>=0&&u+d<r*c-o*o}};sn.CLOSEST=_c.CLOSEST;sn.ANY=_c.ANY;sn.ALL=_c.ALL;var Ru=new Ze,ec=[],hr=new b,nc=new b,yx=new b,Mx=new ze,He=new b,mn=new b,Rn=new b,In=new b;new b;new Ss;var Iu={faceList:[0]},ga=new b,Sx=new sn,bx=[],wx=new b,Ax=new b,Ex=new b,Tx=new b,Cx=new b,Pu=new b,Rx=new b,Ix=new b,Px=new b,Nx=new b,Lx=new b,Dx=new b;new Ze;var Fx=[],Ux=new Kt,Bi=new b,xa=new b;function Bx(s,t,e){e.vsub(s,Bi);let n=Bi.dot(t);return t.scale(n,xa),xa.vadd(s,xa),e.distanceTo(xa)}var ba=class{static defaults(t,e){t===void 0&&(t={});for(let n in e)n in t||(t[n]=e[n]);return t}},lc=class s{constructor(t,e,n){n===void 0&&(n={}),n=ba.defaults(n,{collideConnected:!0,wakeUpBodies:!0}),this.equations=[],this.bodyA=t,this.bodyB=e,this.id=s.idCounter++,this.collideConnected=n.collideConnected,n.wakeUpBodies&&(t&&t.wakeUp(),e&&e.wakeUp())}update(){throw new Error("method update() not implmemented in this Constraint subclass!")}enable(){let t=this.equations;for(let e=0;e<t.length;e++)t[e].enabled=!0}disable(){let t=this.equations;for(let e=0;e<t.length;e++)t[e].enabled=!1}};lc.idCounter=0;var wa=class{constructor(){this.spatial=new b,this.rotational=new b}multiplyElement(t){return t.spatial.dot(this.spatial)+t.rotational.dot(this.rotational)}multiplyVectors(t,e){return t.dot(this.spatial)+e.dot(this.rotational)}},pr=class s{constructor(t,e,n,i){n===void 0&&(n=-1e6),i===void 0&&(i=1e6),this.id=s.idCounter++,this.minForce=n,this.maxForce=i,this.bi=t,this.bj=e,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new wa,this.jacobianElementB=new wa,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(t,e,n){let i=e,r=t,o=n;this.a=4/(o*(1+4*i)),this.b=4*i/(1+4*i),this.eps=4/(o*o*r*(1+4*i))}computeB(t,e,n){let i=this.computeGW(),r=this.computeGq(),o=this.computeGiMf();return-r*t-i*e-o*n}computeGq(){let t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.position,o=i.position;return t.spatial.dot(r)+e.spatial.dot(o)}computeGW(){let t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.velocity,o=i.velocity,a=n.angularVelocity,c=i.angularVelocity;return t.multiplyVectors(r,a)+e.multiplyVectors(o,c)}computeGWlambda(){let t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.vlambda,o=i.vlambda,a=n.wlambda,c=i.wlambda;return t.multiplyVectors(r,a)+e.multiplyVectors(o,c)}computeGiMf(){let t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.force,o=n.torque,a=i.force,c=i.torque,l=n.invMassSolve,u=i.invMassSolve;return r.scale(l,Nu),a.scale(u,Lu),n.invInertiaWorldSolve.vmult(o,Du),i.invInertiaWorldSolve.vmult(c,Fu),t.multiplyVectors(Nu,Du)+e.multiplyVectors(Lu,Fu)}computeGiMGt(){let t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.invMassSolve,o=i.invMassSolve,a=n.invInertiaWorldSolve,c=i.invInertiaWorldSolve,l=r+o;return a.vmult(t.rotational,_a),l+=_a.dot(t.rotational),c.vmult(e.rotational,_a),l+=_a.dot(e.rotational),l}addToWlambda(t){let e=this.jacobianElementA,n=this.jacobianElementB,i=this.bi,r=this.bj,o=Ox;i.vlambda.addScaledVector(i.invMassSolve*t,e.spatial,i.vlambda),r.vlambda.addScaledVector(r.invMassSolve*t,n.spatial,r.vlambda),i.invInertiaWorldSolve.vmult(e.rotational,o),i.wlambda.addScaledVector(t,o,i.wlambda),r.invInertiaWorldSolve.vmult(n.rotational,o),r.wlambda.addScaledVector(t,o,r.wlambda)}computeC(){return this.computeGiMGt()+this.eps}};pr.idCounter=0;var Nu=new b,Lu=new b,Du=new b,Fu=new b,_a=new b,Ox=new b,cc=class extends pr{constructor(t,e,n){n===void 0&&(n=1e6),super(t,e,0,n),this.restitution=0,this.ri=new b,this.rj=new b,this.ni=new b}computeB(t){let e=this.a,n=this.b,i=this.bi,r=this.bj,o=this.ri,a=this.rj,c=zx,l=Vx,u=i.velocity,d=i.angularVelocity;i.force,i.torque;let h=r.velocity,f=r.angularVelocity;r.force,r.torque;let g=kx,v=this.jacobianElementA,p=this.jacobianElementB,m=this.ni;o.cross(m,c),a.cross(m,l),m.negate(v.spatial),c.negate(v.rotational),p.spatial.copy(m),p.rotational.copy(l),g.copy(r.position),g.vadd(a,g),g.vsub(i.position,g),g.vsub(o,g);let x=m.dot(g),E=this.restitution+1,M=E*h.dot(m)-E*u.dot(m)+f.dot(l)-d.dot(c),T=this.computeGiMf();return-x*e-M*n-t*T}getImpactVelocityAlongNormal(){let t=Gx,e=Hx,n=Wx,i=qx,r=Xx;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,i),this.bi.getVelocityAtWorldPoint(n,t),this.bj.getVelocityAtWorldPoint(i,e),t.vsub(e,r),this.ni.dot(r)}},zx=new b,Vx=new b,kx=new b,Gx=new b,Hx=new b,Wx=new b,qx=new b,Xx=new b;var cb=new b,hb=new b;var ub=new b,db=new b;new b;new b;var fb=new b,pb=new b;var mb=new b,gb=new b,Aa=class extends pr{constructor(t,e,n){super(t,e,-n,n),this.ri=new b,this.rj=new b,this.t=new b}computeB(t){this.a;let e=this.b;this.bi,this.bj;let n=this.ri,i=this.rj,r=Yx,o=Zx,a=this.t;n.cross(a,r),i.cross(a,o);let c=this.jacobianElementA,l=this.jacobianElementB;a.negate(c.spatial),r.negate(c.rotational),l.spatial.copy(a),l.rotational.copy(o);let u=this.computeGW(),d=this.computeGiMf();return-u*e-t*d}},Yx=new b,Zx=new b,Oi=class s{constructor(t,e,n){n=ba.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=s.idCounter++,this.materials=[t,e],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}};Oi.idCounter=0;var zi=class s{constructor(t){t===void 0&&(t={});let e="";typeof t=="string"&&(e=t,t={}),this.name=e,this.id=s.idCounter++,this.friction=typeof t.friction<"u"?t.friction:-1,this.restitution=typeof t.restitution<"u"?t.restitution:-1}};zi.idCounter=0;var xb=new b,_b=new b,vb=new b,yb=new b,Mb=new b,Sb=new b,bb=new b,wb=new b,Ab=new b,Eb=new b,Tb=new b;var Cb=new b,Rb=new b;new b;new b;new b;var Ib=new b,Pb=new b,Nb=new b;new sn;new b;var Lb=new b,Db=new b,Fb=[new b(1,0,0),new b(0,1,0),new b(0,0,1)],Ub=new b;var Bb=new b,Ob=new b,zb=new b;var Vb=new b,kb=new b,Gb=new b,Hb=new b;var Wb=new b,qb=new b,Xb=new b;var Yb=new b,Zb=new b;var $b=new b,Jb=new b,Kb=new b,jb=new b,Qb=new b,tw=new b,ew=new b;var Ea=class extends Mt{constructor(){super({type:Mt.types.PLANE}),this.worldNormal=new b,this.worldNormalNeedsUpdate=!0,this.boundingSphereRadius=Number.MAX_VALUE}computeWorldNormal(t){let e=this.worldNormal;e.set(0,0,1),t.vmult(e,e),this.worldNormalNeedsUpdate=!1}calculateLocalInertia(t,e){return e===void 0&&(e=new b),e}volume(){return Number.MAX_VALUE}calculateWorldAABB(t,e,n,i){Zn.set(0,0,1),e.vmult(Zn,Zn);let r=Number.MAX_VALUE;n.set(-r,-r,-r),i.set(r,r,r),Zn.x===1?i.x=t.x:Zn.x===-1&&(n.x=t.x),Zn.y===1?i.y=t.y:Zn.y===-1&&(n.y=t.y),Zn.z===1?i.z=t.z:Zn.z===-1&&(n.z=t.z)}updateBoundingSphereRadius(){this.boundingSphereRadius=Number.MAX_VALUE}},Zn=new b;var nw=new b,iw=new b,sw=new b,rw=new b,ow=new b,aw=new b,lw=new b,cw=new b,hw=new b;var uw=new b,dw=new Ze;var fw=new b,pw=new Ze,mw=new b,gw=new b,xw=new b,_w=new b,vw=new b,yw=new b,Mw=new b,Sw=new Ze,bw=new b,ww=new Kt,Aw=new Ze,hc=class{constructor(){this.equations=[]}solve(t,e){return 0}addEquation(t){t.enabled&&!t.bi.isTrigger&&!t.bj.isTrigger&&this.equations.push(t)}removeEquation(t){let e=this.equations,n=e.indexOf(t);n!==-1&&e.splice(n,1)}removeAllEquations(){this.equations.length=0}},uc=class extends hc{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(t,e){let n=0,i=this.iterations,r=this.tolerance*this.tolerance,o=this.equations,a=o.length,c=e.bodies,l=c.length,u=t,d,h,f,g,v,p;if(a!==0)for(let M=0;M!==l;M++)c[M].updateSolveMassProperties();let m=Jx,x=Kx,E=$x;m.length=a,x.length=a,E.length=a;for(let M=0;M!==a;M++){let T=o[M];E[M]=0,x[M]=T.computeB(u),m[M]=1/T.computeC()}if(a!==0){for(let A=0;A!==l;A++){let _=c[A],w=_.vlambda,B=_.wlambda;w.set(0,0,0),B.set(0,0,0)}for(n=0;n!==i;n++){g=0;for(let A=0;A!==a;A++){let _=o[A];d=x[A],h=m[A],p=E[A],v=_.computeGWlambda(),f=h*(d-v-_.eps*p),p+f<_.minForce?f=_.minForce-p:p+f>_.maxForce&&(f=_.maxForce-p),E[A]+=f,g+=f>0?f:-f,_.addToWlambda(f)}if(g*g<r)break}for(let A=0;A!==l;A++){let _=c[A],w=_.velocity,B=_.angularVelocity;_.vlambda.vmul(_.linearFactor,_.vlambda),w.vadd(_.vlambda,w),_.wlambda.vmul(_.angularFactor,_.wlambda),B.vadd(_.wlambda,B)}let M=o.length,T=1/u;for(;M--;)o[M].multiplier=E[M]*T}return n}},$x=[],Jx=[],Kx=[];var Ew=Ot.STATIC;var dc=class{constructor(){this.objects=[],this.type=Object}release(){let t=arguments.length;for(let e=0;e!==t;e++)this.objects.push(e<0||arguments.length<=e?void 0:arguments[e]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(t){let e=this.objects;for(;e.length>t;)e.pop();for(;e.length<t;)e.push(this.constructObject());return this}},fc=class extends dc{constructor(){super(...arguments),this.type=b}constructObject(){return new b}},se={sphereSphere:Mt.types.SPHERE,spherePlane:Mt.types.SPHERE|Mt.types.PLANE,boxBox:Mt.types.BOX|Mt.types.BOX,sphereBox:Mt.types.SPHERE|Mt.types.BOX,planeBox:Mt.types.PLANE|Mt.types.BOX,convexConvex:Mt.types.CONVEXPOLYHEDRON,sphereConvex:Mt.types.SPHERE|Mt.types.CONVEXPOLYHEDRON,planeConvex:Mt.types.PLANE|Mt.types.CONVEXPOLYHEDRON,boxConvex:Mt.types.BOX|Mt.types.CONVEXPOLYHEDRON,sphereHeightfield:Mt.types.SPHERE|Mt.types.HEIGHTFIELD,boxHeightfield:Mt.types.BOX|Mt.types.HEIGHTFIELD,convexHeightfield:Mt.types.CONVEXPOLYHEDRON|Mt.types.HEIGHTFIELD,sphereParticle:Mt.types.PARTICLE|Mt.types.SPHERE,planeParticle:Mt.types.PLANE|Mt.types.PARTICLE,boxParticle:Mt.types.BOX|Mt.types.PARTICLE,convexParticle:Mt.types.PARTICLE|Mt.types.CONVEXPOLYHEDRON,cylinderCylinder:Mt.types.CYLINDER,sphereCylinder:Mt.types.SPHERE|Mt.types.CYLINDER,planeCylinder:Mt.types.PLANE|Mt.types.CYLINDER,boxCylinder:Mt.types.BOX|Mt.types.CYLINDER,convexCylinder:Mt.types.CONVEXPOLYHEDRON|Mt.types.CYLINDER,heightfieldCylinder:Mt.types.HEIGHTFIELD|Mt.types.CYLINDER,particleCylinder:Mt.types.PARTICLE|Mt.types.CYLINDER,sphereTrimesh:Mt.types.SPHERE|Mt.types.TRIMESH,planeTrimesh:Mt.types.PLANE|Mt.types.TRIMESH},pc=class{get[se.sphereSphere](){return this.sphereSphere}get[se.spherePlane](){return this.spherePlane}get[se.boxBox](){return this.boxBox}get[se.sphereBox](){return this.sphereBox}get[se.planeBox](){return this.planeBox}get[se.convexConvex](){return this.convexConvex}get[se.sphereConvex](){return this.sphereConvex}get[se.planeConvex](){return this.planeConvex}get[se.boxConvex](){return this.boxConvex}get[se.sphereHeightfield](){return this.sphereHeightfield}get[se.boxHeightfield](){return this.boxHeightfield}get[se.convexHeightfield](){return this.convexHeightfield}get[se.sphereParticle](){return this.sphereParticle}get[se.planeParticle](){return this.planeParticle}get[se.boxParticle](){return this.boxParticle}get[se.convexParticle](){return this.convexParticle}get[se.cylinderCylinder](){return this.convexConvex}get[se.sphereCylinder](){return this.sphereConvex}get[se.planeCylinder](){return this.planeConvex}get[se.boxCylinder](){return this.boxConvex}get[se.convexCylinder](){return this.convexConvex}get[se.heightfieldCylinder](){return this.heightfieldCylinder}get[se.particleCylinder](){return this.particleCylinder}get[se.sphereTrimesh](){return this.sphereTrimesh}get[se.planeTrimesh](){return this.planeTrimesh}constructor(t){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new fc,this.world=t,this.currentContactMaterial=t.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(t,e,n,i,r,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=t,a.bj=e):a=new cc(t,e),a.enabled=t.collisionResponse&&e.collisionResponse&&n.collisionResponse&&i.collisionResponse;let c=this.currentContactMaterial;a.restitution=c.restitution,a.setSpookParams(c.contactEquationStiffness,c.contactEquationRelaxation,this.world.dt);let l=n.material||t.material,u=i.material||e.material;return l&&u&&l.restitution>=0&&u.restitution>=0&&(a.restitution=l.restitution*u.restitution),a.si=r||n,a.sj=o||i,a}createFrictionEquationsFromContact(t,e){let n=t.bi,i=t.bj,r=t.si,o=t.sj,a=this.world,c=this.currentContactMaterial,l=c.friction,u=r.material||n.material,d=o.material||i.material;if(u&&d&&u.friction>=0&&d.friction>=0&&(l=u.friction*d.friction),l>0){let h=l*(a.frictionGravity||a.gravity).length(),f=n.invMass+i.invMass;f>0&&(f=1/f);let g=this.frictionEquationPool,v=g.length?g.pop():new Aa(n,i,h*f),p=g.length?g.pop():new Aa(n,i,h*f);return v.bi=p.bi=n,v.bj=p.bj=i,v.minForce=p.minForce=-h*f,v.maxForce=p.maxForce=h*f,v.ri.copy(t.ri),v.rj.copy(t.rj),p.ri.copy(t.ri),p.rj.copy(t.rj),t.ni.tangents(v.t,p.t),v.setSpookParams(c.frictionEquationStiffness,c.frictionEquationRelaxation,a.dt),p.setSpookParams(c.frictionEquationStiffness,c.frictionEquationRelaxation,a.dt),v.enabled=p.enabled=t.enabled,e.push(v,p),!0}return!1}createFrictionFromAverage(t){let e=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(e,this.frictionResult)||t===1)return;let n=this.frictionResult[this.frictionResult.length-2],i=this.frictionResult[this.frictionResult.length-1];Ui.setZero(),vs.setZero(),ys.setZero();let r=e.bi;e.bj;for(let a=0;a!==t;a++)e=this.result[this.result.length-1-a],e.bi!==r?(Ui.vadd(e.ni,Ui),vs.vadd(e.ri,vs),ys.vadd(e.rj,ys)):(Ui.vsub(e.ni,Ui),vs.vadd(e.rj,vs),ys.vadd(e.ri,ys));let o=1/t;vs.scale(o,n.ri),ys.scale(o,n.rj),i.ri.copy(n.ri),i.rj.copy(n.rj),Ui.normalize(),Ui.tangents(n.t,i.t)}getContacts(t,e,n,i,r,o,a){this.contactPointPool=r,this.frictionEquationPool=a,this.result=i,this.frictionResult=o;let c=t_,l=e_,u=jx,d=Qx;for(let h=0,f=t.length;h!==f;h++){let g=t[h],v=e[h],p=null;g.material&&v.material&&(p=n.getContactMaterial(g.material,v.material)||null);let m=g.type&Ot.KINEMATIC&&v.type&Ot.STATIC||g.type&Ot.STATIC&&v.type&Ot.KINEMATIC||g.type&Ot.KINEMATIC&&v.type&Ot.KINEMATIC;for(let x=0;x<g.shapes.length;x++){g.quaternion.mult(g.shapeOrientations[x],c),g.quaternion.vmult(g.shapeOffsets[x],u),u.vadd(g.position,u);let E=g.shapes[x];for(let M=0;M<v.shapes.length;M++){v.quaternion.mult(v.shapeOrientations[M],l),v.quaternion.vmult(v.shapeOffsets[M],d),d.vadd(v.position,d);let T=v.shapes[M];if(!(E.collisionFilterMask&T.collisionFilterGroup&&T.collisionFilterMask&E.collisionFilterGroup)||u.distanceTo(d)>E.boundingSphereRadius+T.boundingSphereRadius)continue;let A=null;E.material&&T.material&&(A=n.getContactMaterial(E.material,T.material)||null),this.currentContactMaterial=A||p||n.defaultContactMaterial;let _=E.type|T.type,w=this[_];if(w){let B=!1;E.type<T.type?B=w.call(this,E,T,u,d,c,l,g,v,E,T,m):B=w.call(this,T,E,d,u,l,c,v,g,E,T,m),B&&m&&(n.shapeOverlapKeeper.set(E.id,T.id),n.bodyOverlapKeeper.set(g.id,v.id))}}}}}sphereSphere(t,e,n,i,r,o,a,c,l,u,d){if(d)return n.distanceSquared(i)<(t.radius+e.radius)**2;let h=this.createContactEquation(a,c,t,e,l,u);i.vsub(n,h.ni),h.ni.normalize(),h.ri.copy(h.ni),h.rj.copy(h.ni),h.ri.scale(t.radius,h.ri),h.rj.scale(-e.radius,h.rj),h.ri.vadd(n,h.ri),h.ri.vsub(a.position,h.ri),h.rj.vadd(i,h.rj),h.rj.vsub(c.position,h.rj),this.result.push(h),this.createFrictionEquationsFromContact(h,this.frictionResult)}spherePlane(t,e,n,i,r,o,a,c,l,u,d){let h=this.createContactEquation(a,c,t,e,l,u);if(h.ni.set(0,0,1),o.vmult(h.ni,h.ni),h.ni.negate(h.ni),h.ni.normalize(),h.ni.scale(t.radius,h.ri),n.vsub(i,va),h.ni.scale(h.ni.dot(va),Uu),va.vsub(Uu,h.rj),-va.dot(h.ni)<=t.radius){if(d)return!0;let f=h.ri,g=h.rj;f.vadd(n,f),f.vsub(a.position,f),g.vadd(i,g),g.vsub(c.position,g),this.result.push(h),this.createFrictionEquationsFromContact(h,this.frictionResult)}}boxBox(t,e,n,i,r,o,a,c,l,u,d){return t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e.convexPolyhedronRepresentation,n,i,r,o,a,c,t,e,d)}sphereBox(t,e,n,i,r,o,a,c,l,u,d){let h=this.v3pool,f=T_;n.vsub(i,ya),e.getSideNormals(f,o);let g=t.radius,v=!1,p=R_,m=I_,x=P_,E=null,M=0,T=0,A=0,_=null;for(let F=0,k=f.length;F!==k&&v===!1;F++){let Y=w_;Y.copy(f[F]);let V=Y.length();Y.normalize();let K=ya.dot(Y);if(K<V+g&&K>0){let et=A_,nt=E_;et.copy(f[(F+1)%3]),nt.copy(f[(F+2)%3]);let Ct=et.length(),$=nt.length();et.normalize(),nt.normalize();let ft=ya.dot(et),vt=ya.dot(nt);if(ft<Ct&&ft>-Ct&&vt<$&&vt>-$){let Et=Math.abs(K-V-g);if((_===null||Et<_)&&(_=Et,T=ft,A=vt,E=V,p.copy(Y),m.copy(et),x.copy(nt),M++,d))return!0}}}if(M){v=!0;let F=this.createContactEquation(a,c,t,e,l,u);p.scale(-g,F.ri),F.ni.copy(p),F.ni.negate(F.ni),p.scale(E,p),m.scale(T,m),p.vadd(m,p),x.scale(A,x),p.vadd(x,F.rj),F.ri.vadd(n,F.ri),F.ri.vsub(a.position,F.ri),F.rj.vadd(i,F.rj),F.rj.vsub(c.position,F.rj),this.result.push(F),this.createFrictionEquationsFromContact(F,this.frictionResult)}let w=h.get(),B=C_;for(let F=0;F!==2&&!v;F++)for(let k=0;k!==2&&!v;k++)for(let Y=0;Y!==2&&!v;Y++)if(w.set(0,0,0),F?w.vadd(f[0],w):w.vsub(f[0],w),k?w.vadd(f[1],w):w.vsub(f[1],w),Y?w.vadd(f[2],w):w.vsub(f[2],w),i.vadd(w,B),B.vsub(n,B),B.lengthSquared()<g*g){if(d)return!0;v=!0;let V=this.createContactEquation(a,c,t,e,l,u);V.ri.copy(B),V.ri.normalize(),V.ni.copy(V.ri),V.ri.scale(g,V.ri),V.rj.copy(w),V.ri.vadd(n,V.ri),V.ri.vsub(a.position,V.ri),V.rj.vadd(i,V.rj),V.rj.vsub(c.position,V.rj),this.result.push(V),this.createFrictionEquationsFromContact(V,this.frictionResult)}h.release(w),w=null;let I=h.get(),D=h.get(),z=h.get(),N=h.get(),R=h.get(),L=f.length;for(let F=0;F!==L&&!v;F++)for(let k=0;k!==L&&!v;k++)if(F%3!==k%3){f[k].cross(f[F],I),I.normalize(),f[F].vadd(f[k],D),z.copy(n),z.vsub(D,z),z.vsub(i,z);let Y=z.dot(I);I.scale(Y,N);let V=0;for(;V===F%3||V===k%3;)V++;R.copy(n),R.vsub(N,R),R.vsub(D,R),R.vsub(i,R);let K=Math.abs(Y),et=R.length();if(K<f[V].length()&&et<g){if(d)return!0;v=!0;let nt=this.createContactEquation(a,c,t,e,l,u);D.vadd(N,nt.rj),nt.rj.copy(nt.rj),R.negate(nt.ni),nt.ni.normalize(),nt.ri.copy(nt.rj),nt.ri.vadd(i,nt.ri),nt.ri.vsub(n,nt.ri),nt.ri.normalize(),nt.ri.scale(g,nt.ri),nt.ri.vadd(n,nt.ri),nt.ri.vsub(a.position,nt.ri),nt.rj.vadd(i,nt.rj),nt.rj.vsub(c.position,nt.rj),this.result.push(nt),this.createFrictionEquationsFromContact(nt,this.frictionResult)}}h.release(I,D,z,N,R)}planeBox(t,e,n,i,r,o,a,c,l,u,d){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,e.convexPolyhedronRepresentation.id=e.id,this.planeConvex(t,e.convexPolyhedronRepresentation,n,i,r,o,a,c,t,e,d)}convexConvex(t,e,n,i,r,o,a,c,l,u,d,h,f){let g=X_;if(!(n.distanceTo(i)>t.boundingSphereRadius+e.boundingSphereRadius)&&t.findSeparatingAxis(e,n,r,i,o,g,h,f)){let v=[],p=Y_;t.clipAgainstHull(n,r,e,i,o,g,-100,100,v);let m=0;for(let x=0;x!==v.length;x++){if(d)return!0;let E=this.createContactEquation(a,c,t,e,l,u),M=E.ri,T=E.rj;g.negate(E.ni),v[x].normal.negate(p),p.scale(v[x].depth,p),v[x].point.vadd(p,M),T.copy(v[x].point),M.vsub(n,M),T.vsub(i,T),M.vadd(n,M),M.vsub(a.position,M),T.vadd(i,T),T.vsub(c.position,T),this.result.push(E),m++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(E,this.frictionResult)}this.enableFrictionReduction&&m&&this.createFrictionFromAverage(m)}}sphereConvex(t,e,n,i,r,o,a,c,l,u,d){let h=this.v3pool;n.vsub(i,N_);let f=e.faceNormals,g=e.faces,v=e.vertices,p=t.radius,m=!1;for(let x=0;x!==v.length;x++){let E=v[x],M=U_;o.vmult(E,M),i.vadd(M,M);let T=F_;if(M.vsub(n,T),T.lengthSquared()<p*p){if(d)return!0;m=!0;let A=this.createContactEquation(a,c,t,e,l,u);A.ri.copy(T),A.ri.normalize(),A.ni.copy(A.ri),A.ri.scale(p,A.ri),M.vsub(i,A.rj),A.ri.vadd(n,A.ri),A.ri.vsub(a.position,A.ri),A.rj.vadd(i,A.rj),A.rj.vsub(c.position,A.rj),this.result.push(A),this.createFrictionEquationsFromContact(A,this.frictionResult);return}}for(let x=0,E=g.length;x!==E&&m===!1;x++){let M=f[x],T=g[x],A=B_;o.vmult(M,A);let _=O_;o.vmult(v[T[0]],_),_.vadd(i,_);let w=z_;A.scale(-p,w),n.vadd(w,w);let B=V_;w.vsub(_,B);let I=B.dot(A),D=k_;if(n.vsub(_,D),I<0&&D.dot(A)>0){let z=[];for(let N=0,R=T.length;N!==R;N++){let L=h.get();o.vmult(v[T[N]],L),i.vadd(L,L),z.push(L)}if(b_(z,A,n)){if(d)return!0;m=!0;let N=this.createContactEquation(a,c,t,e,l,u);A.scale(-p,N.ri),A.negate(N.ni);let R=h.get();A.scale(-I,R);let L=h.get();A.scale(-p,L),n.vsub(i,N.rj),N.rj.vadd(L,N.rj),N.rj.vadd(R,N.rj),N.rj.vadd(i,N.rj),N.rj.vsub(c.position,N.rj),N.ri.vadd(n,N.ri),N.ri.vsub(a.position,N.ri),h.release(R),h.release(L),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult);for(let F=0,k=z.length;F!==k;F++)h.release(z[F]);return}else for(let N=0;N!==T.length;N++){let R=h.get(),L=h.get();o.vmult(v[T[(N+1)%T.length]],R),o.vmult(v[T[(N+2)%T.length]],L),i.vadd(R,R),i.vadd(L,L);let F=L_;L.vsub(R,F);let k=D_;F.unit(k);let Y=h.get(),V=h.get();n.vsub(R,V);let K=V.dot(k);k.scale(K,Y),Y.vadd(R,Y);let et=h.get();if(Y.vsub(n,et),K>0&&K*K<F.lengthSquared()&&et.lengthSquared()<p*p){if(d)return!0;let nt=this.createContactEquation(a,c,t,e,l,u);Y.vsub(i,nt.rj),Y.vsub(n,nt.ni),nt.ni.normalize(),nt.ni.scale(p,nt.ri),nt.rj.vadd(i,nt.rj),nt.rj.vsub(c.position,nt.rj),nt.ri.vadd(n,nt.ri),nt.ri.vsub(a.position,nt.ri),this.result.push(nt),this.createFrictionEquationsFromContact(nt,this.frictionResult);for(let Ct=0,$=z.length;Ct!==$;Ct++)h.release(z[Ct]);h.release(R),h.release(L),h.release(Y),h.release(et),h.release(V);return}h.release(R),h.release(L),h.release(Y),h.release(et),h.release(V)}for(let N=0,R=z.length;N!==R;N++)h.release(z[N])}}}planeConvex(t,e,n,i,r,o,a,c,l,u,d){let h=G_,f=H_;f.set(0,0,1),r.vmult(f,f);let g=0,v=W_;for(let p=0;p!==e.vertices.length;p++)if(h.copy(e.vertices[p]),o.vmult(h,h),i.vadd(h,h),h.vsub(n,v),f.dot(v)<=0){if(d)return!0;let x=this.createContactEquation(a,c,t,e,l,u),E=q_;f.scale(f.dot(v),E),h.vsub(E,E),E.vsub(n,x.ri),x.ni.copy(f),h.vsub(i,x.rj),x.ri.vadd(n,x.ri),x.ri.vsub(a.position,x.ri),x.rj.vadd(i,x.rj),x.rj.vsub(c.position,x.rj),this.result.push(x),g++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(x,this.frictionResult)}this.enableFrictionReduction&&g&&this.createFrictionFromAverage(g)}boxConvex(t,e,n,i,r,o,a,c,l,u,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e,n,i,r,o,a,c,t,e,d)}sphereHeightfield(t,e,n,i,r,o,a,c,l,u,d){let h=e.data,f=t.radius,g=e.elementSize,v=rv,p=sv;Kt.pointToLocalFrame(i,o,n,p);let m=Math.floor((p.x-f)/g)-1,x=Math.ceil((p.x+f)/g)+1,E=Math.floor((p.y-f)/g)-1,M=Math.ceil((p.y+f)/g)+1;if(x<0||M<0||m>h.length||E>h[0].length)return;m<0&&(m=0),x<0&&(x=0),E<0&&(E=0),M<0&&(M=0),m>=h.length&&(m=h.length-1),x>=h.length&&(x=h.length-1),M>=h[0].length&&(M=h[0].length-1),E>=h[0].length&&(E=h[0].length-1);let T=[];e.getRectMinMax(m,E,x,M,T);let A=T[0],_=T[1];if(p.z-f>_||p.z+f<A)return;let w=this.result;for(let B=m;B<x;B++)for(let I=E;I<M;I++){let D=w.length,z=!1;if(e.getConvexTrianglePillar(B,I,!1),Kt.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(z=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,c,t,e,d)),d&&z||(e.getConvexTrianglePillar(B,I,!0),Kt.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(z=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,c,t,e,d)),d&&z))return!0;if(w.length-D>2)return}}boxHeightfield(t,e,n,i,r,o,a,c,l,u,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexHeightfield(t.convexPolyhedronRepresentation,e,n,i,r,o,a,c,t,e,d)}convexHeightfield(t,e,n,i,r,o,a,c,l,u,d){let h=e.data,f=e.elementSize,g=t.boundingSphereRadius,v=nv,p=iv,m=ev;Kt.pointToLocalFrame(i,o,n,m);let x=Math.floor((m.x-g)/f)-1,E=Math.ceil((m.x+g)/f)+1,M=Math.floor((m.y-g)/f)-1,T=Math.ceil((m.y+g)/f)+1;if(E<0||T<0||x>h.length||M>h[0].length)return;x<0&&(x=0),E<0&&(E=0),M<0&&(M=0),T<0&&(T=0),x>=h.length&&(x=h.length-1),E>=h.length&&(E=h.length-1),T>=h[0].length&&(T=h[0].length-1),M>=h[0].length&&(M=h[0].length-1);let A=[];e.getRectMinMax(x,M,E,T,A);let _=A[0],w=A[1];if(!(m.z-g>w||m.z+g<_))for(let B=x;B<E;B++)for(let I=M;I<T;I++){let D=!1;if(e.getConvexTrianglePillar(B,I,!1),Kt.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(D=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,c,null,null,d,p,null)),d&&D||(e.getConvexTrianglePillar(B,I,!0),Kt.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(D=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,c,null,null,d,p,null)),d&&D))return!0}}sphereParticle(t,e,n,i,r,o,a,c,l,u,d){let h=K_;if(h.set(0,0,1),i.vsub(n,h),h.lengthSquared()<=t.radius*t.radius){if(d)return!0;let g=this.createContactEquation(c,a,e,t,l,u);h.normalize(),g.rj.copy(h),g.rj.scale(t.radius,g.rj),g.ni.copy(h),g.ni.negate(g.ni),g.ri.set(0,0,0),this.result.push(g),this.createFrictionEquationsFromContact(g,this.frictionResult)}}planeParticle(t,e,n,i,r,o,a,c,l,u,d){let h=Z_;h.set(0,0,1),a.quaternion.vmult(h,h);let f=$_;if(i.vsub(a.position,f),h.dot(f)<=0){if(d)return!0;let v=this.createContactEquation(c,a,e,t,l,u);v.ni.copy(h),v.ni.negate(v.ni),v.ri.set(0,0,0);let p=J_;h.scale(h.dot(i),p),i.vsub(p,p),v.rj.copy(p),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}boxParticle(t,e,n,i,r,o,a,c,l,u,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexParticle(t.convexPolyhedronRepresentation,e,n,i,r,o,a,c,t,e,d)}convexParticle(t,e,n,i,r,o,a,c,l,u,d){let h=-1,f=Q_,g=tv,v=null,p=j_;if(p.copy(i),p.vsub(n,p),r.conjugate(Bu),Bu.vmult(p,p),t.pointIsInside(p)){t.worldVerticesNeedsUpdate&&t.computeWorldVertices(n,r),t.worldFaceNormalsNeedsUpdate&&t.computeWorldFaceNormals(r);for(let m=0,x=t.faces.length;m!==x;m++){let E=[t.worldVertices[t.faces[m][0]]],M=t.worldFaceNormals[m];i.vsub(E[0],Ou);let T=-M.dot(Ou);if(v===null||Math.abs(T)<Math.abs(v)){if(d)return!0;v=T,h=m,f.copy(M)}}if(h!==-1){let m=this.createContactEquation(c,a,e,t,l,u);f.scale(v,g),g.vadd(i,g),g.vsub(n,g),m.rj.copy(g),f.negate(m.ni),m.ri.set(0,0,0);let x=m.ri,E=m.rj;x.vadd(i,x),x.vsub(c.position,x),E.vadd(n,E),E.vsub(a.position,E),this.result.push(m),this.createFrictionEquationsFromContact(m,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(t,e,n,i,r,o,a,c,l,u,d){return this.convexHeightfield(e,t,i,n,o,r,c,a,l,u,d)}particleCylinder(t,e,n,i,r,o,a,c,l,u,d){return this.convexParticle(e,t,i,n,o,r,c,a,l,u,d)}sphereTrimesh(t,e,n,i,r,o,a,c,l,u,d){let h=c_,f=h_,g=u_,v=d_,p=f_,m=p_,x=__,E=l_,M=o_,T=v_;Kt.pointToLocalFrame(i,o,n,p);let A=t.radius;x.lowerBound.set(p.x-A,p.y-A,p.z-A),x.upperBound.set(p.x+A,p.y+A,p.z+A),e.getTrianglesInAABB(x,T);let _=a_,w=t.radius*t.radius;for(let N=0;N<T.length;N++)for(let R=0;R<3;R++)if(e.getVertex(e.indices[T[N]*3+R],_),_.vsub(p,M),M.lengthSquared()<=w){if(E.copy(_),Kt.pointToWorldFrame(i,o,E,_),_.vsub(n,M),d)return!0;let L=this.createContactEquation(a,c,t,e,l,u);L.ni.copy(M),L.ni.normalize(),L.ri.copy(L.ni),L.ri.scale(t.radius,L.ri),L.ri.vadd(n,L.ri),L.ri.vsub(a.position,L.ri),L.rj.copy(_),L.rj.vsub(c.position,L.rj),this.result.push(L),this.createFrictionEquationsFromContact(L,this.frictionResult)}for(let N=0;N<T.length;N++)for(let R=0;R<3;R++){e.getVertex(e.indices[T[N]*3+R],h),e.getVertex(e.indices[T[N]*3+(R+1)%3],f),f.vsub(h,g),p.vsub(f,m);let L=m.dot(g);p.vsub(h,m);let F=m.dot(g);if(F>0&&L<0&&(p.vsub(h,m),v.copy(g),v.normalize(),F=m.dot(v),v.scale(F,m),m.vadd(h,m),m.distanceTo(p)<t.radius)){if(d)return!0;let Y=this.createContactEquation(a,c,t,e,l,u);m.vsub(p,Y.ni),Y.ni.normalize(),Y.ni.scale(t.radius,Y.ri),Y.ri.vadd(n,Y.ri),Y.ri.vsub(a.position,Y.ri),Kt.pointToWorldFrame(i,o,m,m),m.vsub(c.position,Y.rj),Kt.vectorToWorldFrame(o,Y.ni,Y.ni),Kt.vectorToWorldFrame(o,Y.ri,Y.ri),this.result.push(Y),this.createFrictionEquationsFromContact(Y,this.frictionResult)}}let B=m_,I=g_,D=x_,z=r_;for(let N=0,R=T.length;N!==R;N++){e.getTriangleVertices(T[N],B,I,D),e.getNormal(T[N],z),p.vsub(B,m);let L=m.dot(z);if(z.scale(L,m),p.vsub(m,m),L=m.distanceTo(p),sn.pointInTriangle(m,B,I,D)&&L<t.radius){if(d)return!0;let F=this.createContactEquation(a,c,t,e,l,u);m.vsub(p,F.ni),F.ni.normalize(),F.ni.scale(t.radius,F.ri),F.ri.vadd(n,F.ri),F.ri.vsub(a.position,F.ri),Kt.pointToWorldFrame(i,o,m,m),m.vsub(c.position,F.rj),Kt.vectorToWorldFrame(o,F.ni,F.ni),Kt.vectorToWorldFrame(o,F.ri,F.ri),this.result.push(F),this.createFrictionEquationsFromContact(F,this.frictionResult)}}T.length=0}planeTrimesh(t,e,n,i,r,o,a,c,l,u,d){let h=new b,f=n_;f.set(0,0,1),r.vmult(f,f);for(let g=0;g<e.vertices.length/3;g++){e.getVertex(g,h);let v=new b;v.copy(h),Kt.pointToWorldFrame(i,o,v,h);let p=i_;if(h.vsub(n,p),f.dot(p)<=0){if(d)return!0;let x=this.createContactEquation(a,c,t,e,l,u);x.ni.copy(f);let E=s_;f.scale(p.dot(f),E),h.vsub(E,E),x.ri.copy(E),x.ri.vsub(a.position,x.ri),x.rj.copy(h),x.rj.vsub(c.position,x.rj),this.result.push(x),this.createFrictionEquationsFromContact(x,this.frictionResult)}}}},Ui=new b,vs=new b,ys=new b,jx=new b,Qx=new b,t_=new ze,e_=new ze,n_=new b,i_=new b,s_=new b,r_=new b,o_=new b;new b;var a_=new b,l_=new b,c_=new b,h_=new b,u_=new b,d_=new b,f_=new b,p_=new b,m_=new b,g_=new b,x_=new b,__=new Ze,v_=[],va=new b,Uu=new b,y_=new b,M_=new b,S_=new b;function b_(s,t,e){let n=null,i=s.length;for(let r=0;r!==i;r++){let o=s[r],a=y_;s[(r+1)%i].vsub(o,a);let c=M_;a.cross(t,c);let l=S_;e.vsub(o,l);let u=c.dot(l);if(n===null||u>0&&n===!0||u<=0&&n===!1){n===null&&(n=u>0);continue}else return!1}return!0}var ya=new b,w_=new b,A_=new b,E_=new b,T_=[new b,new b,new b,new b,new b,new b],C_=new b,R_=new b,I_=new b,P_=new b,N_=new b,L_=new b,D_=new b,F_=new b,U_=new b,B_=new b,O_=new b,z_=new b,V_=new b,k_=new b;new b;new b;var G_=new b,H_=new b,W_=new b,q_=new b,X_=new b,Y_=new b,Z_=new b,$_=new b,J_=new b,K_=new b,Bu=new ze,j_=new b;new b;var Q_=new b,Ou=new b,tv=new b,ev=new b,nv=new b,iv=[0],sv=new b,rv=new b,Ta=class{constructor(){this.current=[],this.previous=[]}getKey(t,e){if(e<t){let n=e;e=t,t=n}return t<<16|e}set(t,e){let n=this.getKey(t,e),i=this.current,r=0;for(;n>i[r];)r++;if(n!==i[r]){for(let o=i.length-1;o>=r;o--)i[o+1]=i[o];i[r]=n}}tick(){let t=this.current;this.current=this.previous,this.previous=t,this.current.length=0}getDiff(t,e){let n=this.current,i=this.previous,r=n.length,o=i.length,a=0;for(let c=0;c<r;c++){let l=!1,u=n[c];for(;u>i[a];)a++;l=u===i[a],l||zu(t,u)}a=0;for(let c=0;c<o;c++){let l=!1,u=i[c];for(;u>n[a];)a++;l=n[a]===u,l||zu(e,u)}}};function zu(s,t){s.push((t&4294901760)>>16,t&65535)}var ic=(s,t)=>s<t?`${s}-${t}`:`${t}-${s}`,mc=class{constructor(){this.data={keys:[]}}get(t,e){let n=ic(t,e);return this.data[n]}set(t,e,n){let i=ic(t,e);this.get(t,e)||this.data.keys.push(i),this.data[i]=n}delete(t,e){let n=ic(t,e),i=this.data.keys.indexOf(n);i!==-1&&this.data.keys.splice(i,1),delete this.data[n]}reset(){let t=this.data,e=t.keys;for(;e.length>0;){let n=e.pop();delete t[n]}}},Ca=class extends Sa{constructor(t){t===void 0&&(t={}),super(),this.dt=-1,this.allowSleep=!!t.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=t.quatNormalizeSkip!==void 0?t.quatNormalizeSkip:0,this.quatNormalizeFast=t.quatNormalizeFast!==void 0?t.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new b,t.gravity&&this.gravity.copy(t.gravity),t.frictionGravity&&(this.frictionGravity=new b,this.frictionGravity.copy(t.frictionGravity)),this.broadphase=t.broadphase!==void 0?t.broadphase:new ac,this.bodies=[],this.hasActiveBodies=!1,this.solver=t.solver!==void 0?t.solver:new uc,this.constraints=[],this.narrowphase=new pc(this),this.collisionMatrix=new Ma,this.collisionMatrixPrevious=new Ma,this.bodyOverlapKeeper=new Ta,this.shapeOverlapKeeper=new Ta,this.contactmaterials=[],this.contactMaterialTable=new mc,this.defaultMaterial=new zi("default"),this.defaultContactMaterial=new Oi(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(t,e){return this.contactMaterialTable.get(t.id,e.id)}collisionMatrixTick(){let t=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=t,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(t){this.constraints.push(t)}removeConstraint(t){let e=this.constraints.indexOf(t);e!==-1&&this.constraints.splice(e,1)}rayTest(t,e,n){n instanceof Ss?this.raycastClosest(t,e,{skipBackfaces:!0},n):this.raycastAll(t,e,{skipBackfaces:!0},n)}raycastAll(t,e,n,i){return n===void 0&&(n={}),n.mode=sn.ALL,n.from=t,n.to=e,n.callback=i,sc.intersectWorld(this,n)}raycastAny(t,e,n,i){return n===void 0&&(n={}),n.mode=sn.ANY,n.from=t,n.to=e,n.result=i,sc.intersectWorld(this,n)}raycastClosest(t,e,n,i){return n===void 0&&(n={}),n.mode=sn.CLOSEST,n.from=t,n.to=e,n.result=i,sc.intersectWorld(this,n)}addBody(t){this.bodies.includes(t)||(t.index=this.bodies.length,this.bodies.push(t),t.world=this,t.initPosition.copy(t.position),t.initVelocity.copy(t.velocity),t.timeLastSleepy=this.time,t instanceof Ot&&(t.initAngularVelocity.copy(t.angularVelocity),t.initQuaternion.copy(t.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=t,this.idToBodyMap[t.id]=t,this.dispatchEvent(this.addBodyEvent))}removeBody(t){t.world=null;let e=this.bodies.length-1,n=this.bodies,i=n.indexOf(t);if(i!==-1){n.splice(i,1);for(let r=0;r!==n.length;r++)n[r].index=r;this.collisionMatrix.setNumObjects(e),this.removeBodyEvent.body=t,delete this.idToBodyMap[t.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(t){return this.idToBodyMap[t]}getShapeById(t){let e=this.bodies;for(let n=0;n<e.length;n++){let i=e[n].shapes;for(let r=0;r<i.length;r++){let o=i[r];if(o.id===t)return o}}return null}addContactMaterial(t){this.contactmaterials.push(t),this.contactMaterialTable.set(t.materials[0].id,t.materials[1].id,t)}removeContactMaterial(t){let e=this.contactmaterials.indexOf(t);e!==-1&&(this.contactmaterials.splice(e,1),this.contactMaterialTable.delete(t.materials[0].id,t.materials[1].id))}fixedStep(t,e){t===void 0&&(t=1/60),e===void 0&&(e=10);let n=ve.now()/1e3;if(!this.lastCallTime)this.step(t,void 0,e);else{let i=n-this.lastCallTime;this.step(t,i,e)}this.lastCallTime=n}step(t,e,n){if(n===void 0&&(n=10),e===void 0)this.internalStep(t),this.time+=t;else{this.accumulator+=e;let i=ve.now(),r=0;for(;this.accumulator>=t&&r<n&&(this.internalStep(t),this.accumulator-=t,r++,!(ve.now()-i>t*1e3)););this.accumulator=this.accumulator%t;let o=this.accumulator/t;for(let a=0;a!==this.bodies.length;a++){let c=this.bodies[a];c.previousPosition.lerp(c.position,o,c.interpolatedPosition),c.previousQuaternion.slerp(c.quaternion,o,c.interpolatedQuaternion),c.previousQuaternion.normalize()}this.time+=e}}internalStep(t){this.dt=t;let e=this.contacts,n=hv,i=uv,r=this.bodies.length,o=this.bodies,a=this.solver,c=this.gravity,l=this.doProfiling,u=this.profile,d=Ot.DYNAMIC,h=-1/0,f=this.constraints,g=cv;c.length();let v=c.x,p=c.y,m=c.z,x=0;for(l&&(h=ve.now()),x=0;x!==r;x++){let N=o[x];if(N.type===d){let R=N.force,L=N.mass;R.x+=L*v,R.y+=L*p,R.z+=L*m}}for(let N=0,R=this.subsystems.length;N!==R;N++)this.subsystems[N].update();l&&(h=ve.now()),n.length=0,i.length=0,this.broadphase.collisionPairs(this,n,i),l&&(u.broadphase=ve.now()-h);let E=f.length;for(x=0;x!==E;x++){let N=f[x];if(!N.collideConnected)for(let R=n.length-1;R>=0;R-=1)(N.bodyA===n[R]&&N.bodyB===i[R]||N.bodyB===n[R]&&N.bodyA===i[R])&&(n.splice(R,1),i.splice(R,1))}this.collisionMatrixTick(),l&&(h=ve.now());let M=lv,T=e.length;for(x=0;x!==T;x++)M.push(e[x]);e.length=0;let A=this.frictionEquations.length;for(x=0;x!==A;x++)g.push(this.frictionEquations[x]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,i,this,e,M,this.frictionEquations,g),l&&(u.narrowphase=ve.now()-h),l&&(h=ve.now()),x=0;x<this.frictionEquations.length;x++)a.addEquation(this.frictionEquations[x]);let _=e.length;for(let N=0;N!==_;N++){let R=e[N],L=R.bi,F=R.bj,k=R.si,Y=R.sj,V;if(L.material&&F.material?V=this.getContactMaterial(L.material,F.material)||this.defaultContactMaterial:V=this.defaultContactMaterial,V.friction,L.material&&F.material&&(L.material.friction>=0&&F.material.friction>=0&&L.material.friction*F.material.friction,L.material.restitution>=0&&F.material.restitution>=0&&(R.restitution=L.material.restitution*F.material.restitution)),a.addEquation(R),L.allowSleep&&L.type===Ot.DYNAMIC&&L.sleepState===Ot.SLEEPING&&F.sleepState===Ot.AWAKE&&F.type!==Ot.STATIC){let K=F.velocity.lengthSquared()+F.angularVelocity.lengthSquared(),et=F.sleepSpeedLimit**2;K>=et*2&&(L.wakeUpAfterNarrowphase=!0)}if(F.allowSleep&&F.type===Ot.DYNAMIC&&F.sleepState===Ot.SLEEPING&&L.sleepState===Ot.AWAKE&&L.type!==Ot.STATIC){let K=L.velocity.lengthSquared()+L.angularVelocity.lengthSquared(),et=L.sleepSpeedLimit**2;K>=et*2&&(F.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(L,F,!0),this.collisionMatrixPrevious.get(L,F)||(ur.body=F,ur.contact=R,L.dispatchEvent(ur),ur.body=L,F.dispatchEvent(ur)),this.bodyOverlapKeeper.set(L.id,F.id),this.shapeOverlapKeeper.set(k.id,Y.id)}for(this.emitContactEvents(),l&&(u.makeContactConstraints=ve.now()-h,h=ve.now()),x=0;x!==r;x++){let N=o[x];N.wakeUpAfterNarrowphase&&(N.wakeUp(),N.wakeUpAfterNarrowphase=!1)}for(E=f.length,x=0;x!==E;x++){let N=f[x];N.update();for(let R=0,L=N.equations.length;R!==L;R++){let F=N.equations[R];a.addEquation(F)}}a.solve(t,this),l&&(u.solve=ve.now()-h),a.removeAllEquations();let w=Math.pow;for(x=0;x!==r;x++){let N=o[x];if(N.type&d){let R=w(1-N.linearDamping,t),L=N.velocity;L.scale(R,L);let F=N.angularVelocity;if(F){let k=w(1-N.angularDamping,t);F.scale(k,F)}}}this.dispatchEvent(av),l&&(h=ve.now());let I=this.stepnumber%(this.quatNormalizeSkip+1)===0,D=this.quatNormalizeFast;for(x=0;x!==r;x++)o[x].integrate(t,I,D);this.clearForces(),this.broadphase.dirty=!0,l&&(u.integrate=ve.now()-h),this.stepnumber+=1,this.dispatchEvent(ov);let z=!0;if(this.allowSleep)for(z=!1,x=0;x!==r;x++){let N=o[x];N.sleepTick(this.time),N.sleepState!==Ot.SLEEPING&&(z=!0)}this.hasActiveBodies=z}emitContactEvents(){let t=this.hasAnyEventListener("beginContact"),e=this.hasAnyEventListener("endContact");if((t||e)&&this.bodyOverlapKeeper.getDiff($n,Jn),t){for(let r=0,o=$n.length;r<o;r+=2)dr.bodyA=this.getBodyById($n[r]),dr.bodyB=this.getBodyById($n[r+1]),this.dispatchEvent(dr);dr.bodyA=dr.bodyB=null}if(e){for(let r=0,o=Jn.length;r<o;r+=2)fr.bodyA=this.getBodyById(Jn[r]),fr.bodyB=this.getBodyById(Jn[r+1]),this.dispatchEvent(fr);fr.bodyA=fr.bodyB=null}$n.length=Jn.length=0;let n=this.hasAnyEventListener("beginShapeContact"),i=this.hasAnyEventListener("endShapeContact");if((n||i)&&this.shapeOverlapKeeper.getDiff($n,Jn),n){for(let r=0,o=$n.length;r<o;r+=2){let a=this.getShapeById($n[r]),c=this.getShapeById($n[r+1]);Kn.shapeA=a,Kn.shapeB=c,a&&(Kn.bodyA=a.body),c&&(Kn.bodyB=c.body),this.dispatchEvent(Kn)}Kn.bodyA=Kn.bodyB=Kn.shapeA=Kn.shapeB=null}if(i){for(let r=0,o=Jn.length;r<o;r+=2){let a=this.getShapeById(Jn[r]),c=this.getShapeById(Jn[r+1]);jn.shapeA=a,jn.shapeB=c,a&&(jn.bodyA=a.body),c&&(jn.bodyB=c.body),this.dispatchEvent(jn)}jn.bodyA=jn.bodyB=jn.shapeA=jn.shapeB=null}}clearForces(){let t=this.bodies,e=t.length;for(let n=0;n!==e;n++){let i=t[n];i.force,i.torque,i.force.set(0,0,0),i.torque.set(0,0,0)}}};new Ze;var sc=new sn,ve=globalThis.performance||{};if(!ve.now){let s=Date.now();ve.timing&&ve.timing.navigationStart&&(s=ve.timing.navigationStart),ve.now=()=>Date.now()-s}new b;var ov={type:"postStep"},av={type:"preStep"},ur={type:Ot.COLLIDE_EVENT_NAME,body:null,contact:null},lv=[],cv=[],hv=[],uv=[],$n=[],Jn=[],dr={type:"beginContact",bodyA:null,bodyB:null},fr={type:"endContact",bodyA:null,bodyB:null},Kn={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},jn={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null};var fv=()=>matchMedia("(prefers-reduced-motion: reduce)").matches,_r=.7,Pn=_r/2,pv=12,vc=1/200,mv=3,gv=5,xv=80,rn=Pn*Math.SQRT2+.05,Ra=.15,_v=6.3,vr=document.createElement("canvas");vr.className="cubegl";vr.setAttribute("aria-hidden","true");var ti=null,Ln,Nn,gn,xr,yc,td,ed,ei=!0;try{ti=new da({canvas:vr,alpha:!0,antialias:!0}),ti.setPixelRatio(Math.min(devicePixelRatio||1,2)),ti.shadowMap.enabled=!0,ti.shadowMap.type=Ii,ti.outputColorSpace=Pe}catch{ei=!1}if(ei){Ln=new Us,Nn=new Ue(22,1,1,1e5),Ln.add(new Zs(16773596,9071184,1.5)),gn=new Ks(16774890,3),gn.castShadow=!0,gn.shadow.mapSize.set(2048,2048),gn.shadow.bias=-2e-4,gn.shadow.normalBias=.6,gn.shadow.radius=3,Ln.add(gn,gn.target),xr=new ke(new pi(1,1),new Hs({opacity:.5})),xr.receiveShadow=!0,Ln.add(xr);let s=new Xs,t=(o,a)=>{let c=s.load(o,()=>Qn());return a&&(c.colorSpace=Pe),c.anisotropy=4,c},e=[12070943,12530978,11545628,12728870];yc=[0,1,2,3,4,5].map(o=>new Ws({color:e[o%e.length],map:t(`art/wood${o}.jpg`,!0),roughnessMap:t(`art/wood${o}_r.jpg`),roughness:1,bumpMap:t(`art/wood${o}_b.jpg`),bumpScale:.35,metalness:0}));let n=document.createElement("canvas");n.width=n.height=64;let i=n.getContext("2d"),r=i.createRadialGradient(32,32,4,32,32,31);r.addColorStop(0,"rgba(0,0,0,.75)"),r.addColorStop(.5,"rgba(0,0,0,.35)"),r.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=r,i.fillRect(0,0,64,64),td=new cs({map:new Vs(n),transparent:!0,depthWrite:!1}),ed=new pi(1,1)}var Yu=0,Zu=0;function vv(){let s=document.documentElement.clientWidth||innerWidth,t=document.documentElement.clientHeight||innerHeight;if(s===Yu&&t===Zu)return;Yu=s,Zu=t,ti.setSize(s,t,!1);let e=t/2/Math.tan(Ol.degToRad(Nn.fov/2));Nn.aspect=s/t,Nn.position.set(s/2,-t/2,e),Nn.near=e*.2,Nn.far=e*3,Nn.lookAt(s/2,-t/2,0),Nn.updateProjectionMatrix(),xr.scale.set(s,t,1),xr.position.set(s/2,-t/2,.05),gn.position.set(s/2-e*.35,-t/2+e*.55,e),gn.target.position.set(s/2,-t/2,0);let n=gn.shadow.camera,i=Math.max(s,t)*.75;n.left=-i,n.right=i,n.top=i,n.bottom=-i,n.near=1,n.far=e*3,n.updateProjectionMatrix()}var $u=new Map;function nd(s){let t=Math.round(s*4),e=$u.get(t);return e||(e=new ma(s,s,s,3,s*.07),$u.set(t,e)),e}function yv(){let s=new Ca({gravity:new b(0,0,-981)});s.allowSleep=!1;let t=new zi("g"),e=new zi("c");s.addContactMaterial(new Oi(t,e,{friction:.45,restitution:.14})),s.addContactMaterial(new Oi(e,e,{friction:.4,restitution:.1}));let n=new Ot({mass:0,material:t});return n.addShape(new Ea),s.addBody(n),s.mC=e,s.ground=n,s}function Mv(s){let t=0;for(let e of[new b(1,0,0),new b(0,1,0),new b(0,0,1)])t=Math.max(t,Math.abs(s.vmult(e).z));return t}var Ju=(s,t)=>[s,t.position.x,t.position.y,t.position.z,t.quaternion.x,t.quaternion.y,t.quaternion.z,t.quaternion.w];function Sv(s,t,e,n){let i=yv();for(let d of t){let h=new Ot({mass:0,material:i.mC});h.addShape(new Ms(new b(Pn,Pn,Pn))),h.position.set(d.pos.x,d.pos.y,d.pos.z),h.quaternion.set(d.quat.x,d.quat.y,d.quat.z,d.quat.w),i.addBody(h)}let r=[],o=t.map(d=>[d.pos.x,d.pos.y]);for(let d of e){let h=d>1?_r*(.9+.45*Math.sqrt(d))*n:0,f=Math.min(h*.6,Math.min(s.w,s.h)/2-rn),g=rn+f,v=s.w-rn-f,p=s.h-rn-f,m=s.w/2,x=-s.h/2,E=-1;for(let T=0;T<12;T++){let A=g+Math.random()*Math.max(0,v-g),_=-g-Math.random()*Math.max(0,p-g),w=o.reduce((B,I)=>Math.min(B,Math.hypot(I[0]-A,I[1]-_)),99);w>E&&(E=w,m=A,x=_)}let M=[];for(let T=0;T<d;T++){let A=m,_=x;for(let I=0;I<20;I++){let D=Math.random()*Math.PI*2,z=h*Math.sqrt(Math.random());if(A=Math.min(s.w-rn,Math.max(rn,m+Math.cos(D)*z)),_=Math.max(-s.h+rn,Math.min(-rn,x+Math.sin(D)*z)),M.every(N=>Math.hypot(N[0]-A,N[1]-_)>_r*1.5))break}M.push([A,_]),o.push([A,_]);let w=new Ot({mass:1,material:i.mC,linearDamping:.01,angularDamping:.03});w.addShape(new Ms(new b(Pn,Pn,Pn))),w.position.set(A,_,pv+Math.random()*.4);let B=new ge().random();w.quaternion.set(B.x,B.y,B.z,B.w),w.angularVelocity.set((Math.random()-.5)*16,(Math.random()-.5)*16,(Math.random()-.5)*10),w.track=[],w.still=0,w.done=!1,i.addBody(w),r.push(w)}}let a=0,c=0,l=-1;i.ground.addEventListener("collide",()=>{l<0&&(l=a)});let u=d=>d.x>=-Ra&&d.x<=s.w+Ra&&d.y<=Ra&&d.y>=-s.h-Ra;for(;a<gv;){i.step(vc),a+=vc,c++;let d=!0;for(let h of r){if(h.done)continue;if(c%mv===0&&h.track.push(Ju(a,h)),h.position.z<2&&(h.position.x<-1||h.position.x>s.w+1||h.position.y>1||h.position.y<-s.h-1))return null;let f=h.velocity.length()<.4&&h.angularVelocity.length()<.2;if(h.still=f?h.still+vc:0,h.still>.35){if(Mv(h.quaternion)<.995||h.position.z>Pn+.05||!u(h.position))return null;h.done=!0,h.type=Ot.STATIC,h.mass=0,h.updateMassProperties(),h.velocity.setZero(),h.angularVelocity.setZero(),h.track.push(Ju(a,h))}else d=!1}if(d)return{tracks:r.map(h=>h.track),hitAt:Math.max(0,l)}}return null}function id(s,t,e){let n=[],i=t.map(r=>[r.pos.x,r.pos.y]);for(let r=0;r<e;r++){let o=s.w/2,a=-s.h/2,c=-1;for(let u=0;u<30;u++){let d=rn+Math.random()*Math.max(0,s.w-2*rn),h=-rn-Math.random()*Math.max(0,s.h-2*rn),f=i.reduce((g,v)=>Math.min(g,Math.hypot(v[0]-d,v[1]-h)),99);f>c&&(c=f,o=d,a=h)}i.push([o,a]);let l=new ge().setFromAxisAngle(new q(0,0,1),Math.random()*Math.PI);n.push([[0,o,a,Pn,l.x,l.y,l.z,l.w]])}return{tracks:n,hitAt:0}}function Ku(s,t,e){let n=e.reduce((i,r)=>i+r,0);if(!fv())for(let i=0;i<xv;i++){let r=Sv(s,t,e,1+i*.03*Math.max(1,n/3));if(r)return r}return id(s,t,n)}var bv=.55,wv=.05;function Av(s){return s.map((t,e)=>{let n=e*wv,i=[],r=new ge(t.quat.x,t.quat.y,t.quat.z,t.quat.w),o=new q(Math.random()-.5,Math.random()-.5,(Math.random()-.5)*.4).normalize(),a=(Math.random()-.5)*1.6,c=(Math.random()-.5)*.6,l=(Math.random()-.5)*.6;for(let u=0;u<=24;u++){let d=u/24,h=n+d*bv,f=d*d*(3-2*d)*.35+d*d*.65,g=new ge().setFromAxisAngle(o,a*f).multiply(r);i.push([h,t.pos.x+c*f,t.pos.y+l*f,t.pos.z+22*f,g.x,g.y,g.z,g.w,1-Math.max(0,(d-.55)/.45)])}return[[0,t.pos.x,t.pos.y,t.pos.z,t.quat.x,t.quat.y,t.quat.z,t.quat.w,1],...i]})}var xn=new Map,mr=s=>document.querySelector(`#view-play .card[data-uid="${s}"]:not(.mini)`);function gr(s){let t=s.getBoundingClientRect();if(!t.width||!t.height)return null;let e=t.width/_v,n=s.classList.contains("hasart"),i=n?t.width*.19:t.height*.32,r=n?Math.min(t.height,t.width*.8):t.height*.86;return{r:t,k:e,ox:t.left+t.width*.05,oy:t.top+i,art:{w:t.width*.9/e,h:Math.max(_r*2,(r-i)/e)}}}function ju(s){let t=xn.get(s);return t||(t={cubes:[],busy:0,timers:[]},xn.set(s,t)),t}function Qu(s,t){let e=new ke(nd(10),yc[Math.floor(Math.random()*yc.length)]);e.castShadow=!0,Ln.add(e);let n=new ke(ed,td.clone());n.renderOrder=-1,Ln.add(n);let i=s[0];return{mesh:e,blob:n,track:s,t0:t,done:s.length===1,pos:{x:i[1],y:i[2],z:i[3]},quat:{x:i[4],y:i[5],z:i[6],w:i[7]}}}function Ia(s){Ln.remove(s.mesh),Ln.remove(s.blob),s.blob.material.dispose()}function Ev(s,t){let e=s.track,n=(t-s.t0)/1e3;if(n<=e[0][0])return e[0];if(n>=e[e.length-1][0])return s.done=!0,e[e.length-1];let i=s.i||0;for(;i<e.length-2&&e[i+1][0]<n;)i++;s.i=i;let r=e[i],o=e[i+1],a=(n-r[0])/(o[0]-r[0]),c=new ge(r[4],r[5],r[6],r[7]).slerp(new ge(o[4],o[5],o[6],o[7]),a);return[n,r[1]+(o[1]-r[1])*a,r[2]+(o[2]-r[2])*a,r[3]+(o[3]-r[3])*a,c.x,c.y,c.z,c.w,r[8]==null?1:r[8]+((o[8]??1)-r[8])*a]}var Mc=!1,Pa=0;function Qn(){ei&&(Pa=0,Mc||(Mc=!0,requestAnimationFrame(sd)))}function sd(s){if(!ei)return;vv();let t=!1;for(let[n,i]of xn){let r=mr(n),o=r&&gr(r),a=o||(i.cubes.some(l=>l.leaving)?i.anchor:null),c=!!a&&!(r&&r.closest("[hidden]"));for(let l of i.cubes){if(!l.done){let m=Ev(l,s);l.pos={x:m[1],y:m[2],z:m[3]},l.quat={x:m[4],y:m[5],z:m[6],w:m[7]},l.op=m[8]??1,t=!0}if(l.leaving&&l.done){l.gone=!0,Ia(l);continue}if(l.mesh.visible=l.blob.visible=c,!c)continue;let u=a.k,d=_r*u;l.mesh.geometry.userData.px!==d&&(l.mesh.geometry=nd(d),l.mesh.geometry.userData.px=d);let h=a.ox+l.pos.x*u,f=-(a.oy-l.pos.y*u),g=l.pos.z*u;l.mesh.position.set(h,f,g),l.mesh.quaternion.set(l.quat.x,l.quat.y,l.quat.z,l.quat.w);let v=Math.max(0,l.pos.z-Pn),p=d*(1.55+v*.25);l.blob.position.set(h+.12*d,f-.18*d,.2),l.blob.scale.set(p,p,1),l.blob.material.opacity=Math.max(0,.85-v*.12)*(l.op??1),l.leaving&&(l.mesh.material.opacity=l.op??1)}i.cubes=i.cubes.filter(l=>!l.gone),i.busy&&(t=!0)}ti.render(Ln,Nn);let e=[...xn.values()].some(n=>n.cubes.length);Pa=t?0:Pa+1,e&&Pa<90?requestAnimationFrame(sd):Mc=!1}var Na={ok:ei,afterRender(){if(!ei)return;let s=document.getElementById("view-play");if(s){if(vr.parentNode!==s&&s.appendChild(vr),!s.querySelector(".stage")){Na.clear();return}Qn()}},sync(s){if(!ei)return;let t=new Map(s.filter(e=>e.dmg>0).map(e=>[e.id,e.dmg]));for(let[e,n]of xn)if(!n.busy&&!t.has(e)){let i=n.cubes.filter(r=>r.leaving);n.cubes.filter(r=>!r.leaving).forEach(Ia),n.cubes=i,i.length||xn.delete(e)}for(let[e,n]of t){let i=ju(e);if(i.busy)continue;let r=i.cubes.filter(o=>!o.leaving);if(r.length>n)r.slice(n).forEach(o=>{Ia(o),o.gone=!0}),i.cubes=i.cubes.filter(o=>!o.gone);else if(r.length<n){let o=mr(e),a=o&&gr(o);if(!a)continue;for(let l of r)if(!l.done){let u=l.track[l.track.length-1];l.track=[u],l.done=!0,l.pos={x:u[1],y:u[2],z:u[3]},l.quat={x:u[4],y:u[5],z:u[6],w:u[7]}}let c=id(a.art,r,n-r.length);for(let l of c.tracks)i.cubes.push(Qu(l,performance.now()))}}Qn()},step(s){if(!ei)return 0;let t=0;for(let e of s){let n=mr(e.id),i=n&&gr(n);if(!i)continue;let r=ju(e.id),o=e.speed||1,a=r.cubes.filter(u=>!u.leaving).map(u=>u.done?u:(()=>{let d=u.track[u.track.length-1];return{pos:{x:d[1],y:d[2],z:d[3]},quat:{x:d[4],y:d[5],z:d[6],w:d[7]}}})()),c=(e.drops||[]).filter(u=>u>0),l=0;for(let u of e.moves||[]){let d=xn.get(u.from),h=mr(u.from),f=h&&gr(h),g=d&&f?d.cubes.filter(x=>!x.leaving).slice(-u.n):[];if(g.length<u.n&&c.push(u.n-g.length),!g.length)continue;let v=Ku(i.art,a,[g.length]),p=performance.now(),m=.45/o;g.forEach((x,E)=>{if(!x.done){let L=x.track[x.track.length-1];x.pos={x:L[1],y:L[2],z:L[3]},x.quat={x:L[4],y:L[5],z:L[6],w:L[7]}}let M=f.ox+x.pos.x*f.k,T=f.oy-x.pos.y*f.k,A=(M-i.ox)/i.k,_=-(T-i.oy)/i.k,w=x.pos.z*f.k/i.k,B=v.tracks[E],I=B[0],D=new ge(x.quat.x,x.quat.y,x.quat.z,x.quat.w),z=new ge(I[4],I[5],I[6],I[7]),N=[],R=E*.04;for(let L=0;L<=16;L++){let F=L/16,k=F*F*(3-2*F),Y=Math.sin(Math.PI*F)*3,V=D.clone().slerp(z,k);N.push([R+F*m,A+(I[1]-A)*k,_+(I[2]-_)*k,w+(I[3]-w)*k+Y,V.x,V.y,V.z,V.w])}x.track=[[0,A,_,w,x.quat.x,x.quat.y,x.quat.z,x.quat.w],...N,...B.map(L=>[L[0]/o+R+m,...L.slice(1)])],x.t0=p,x.i=0,x.done=!1,d.cubes=d.cubes.filter(L=>L!==x),r.cubes.push(x)}),l=Math.max(l,(m+v.hitAt/o)*1e3),r.busy++,r.timers.push(setTimeout(()=>{r.busy--,Qn()},(m+1.6)*1e3))}if(c.length){let u=Ku(i.art,a,c),d=performance.now();for(let f of u.tracks){let g=Qu(f,d);r.cubes.push(g)}l=Math.max(l,u.hitAt*1e3),r.busy++;let h=Math.max(...u.tracks.map(f=>f[f.length-1][0]))*1e3;r.timers.push(setTimeout(()=>{r.busy--,Qn()},h))}if(e.ko)r.ko=!0,t=Math.max(t,l+150/o);else if(e.heal>0){let u=l+300/o;r.busy++,r.timers.push(setTimeout(()=>{Na.sweep(e.id,e.heal),r.busy--},u)),t=Math.max(t,u+200)}else t=Math.max(t,l+200)}return Qn(),t},koNow(){for(let[s,t]of xn)t.ko&&(t.ko=!1,Na.sweep(s,1/0))},sweep(s,t){let e=xn.get(s),n=mr(s),i=n&&gr(n);if(!e||!i)return;e.anchor=i;let r=i.r.left+i.r.width/2<innerWidth/2?-1:1,o=e.cubes.filter(l=>!l.leaving);for(let l of o)if(!l.done){let u=l.track[l.track.length-1];l.track=[u],l.done=!0,l.pos={x:u[1],y:u[2],z:u[3]},l.quat={x:u[4],y:u[5],z:u[6],w:u[7]}}if(t!==1/0&&(o=o.slice(-t)),!o.length)return;let a=Av(o),c=performance.now();o.forEach((l,u)=>{l.track=a[u],l.t0=c,l.i=0,l.done=!1,l.leaving=!0,l.mesh.material=l.mesh.material.clone(),l.mesh.material.transparent=!0,l.mesh.castShadow=!1}),Qn()},clear(){for(let[,s]of xn)s.timers.forEach(clearTimeout),s.cubes.forEach(Ia);xn.clear(),ei&&ti&&ti.render(Ln,Nn)}};addEventListener("scroll",()=>Qn(),{passive:!0,capture:!0});addEventListener("resize",()=>Qn());window.OasisCubes=Na;window.__cubesReady&&window.__cubesReady();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
