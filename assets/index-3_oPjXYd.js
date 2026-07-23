(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();async function vt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function xn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function wn(t){const e=t.facing==="user"?"environment":"user";return xn(t),vt(e)}const Rn=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class Pt{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=Rn.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",i=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:i}}}const Rt=60;class yn{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,i=Math.floor(e)%60,r=Math.floor(e*Rt)%Rt,l=a=>String(a).padStart(2,"0");return`${l(n)}:${l(o)}:${l(i)}:${l(r)}`}}function m(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function bn(t,e){const n=m("header","titlebar"),o=m("div","traffic");for(const g of["r","y","g"])o.appendChild(m("span",g));const i=m("div","path","/project1/null8 (128,128)");n.append(o,i,m("div","spacer"));const r=m("div","viewport"),l=m("canvas");r.appendChild(l),r.addEventListener("click",()=>e.onCanvasTap());const a=m("div","start-overlay"),c=m("div","pulse"),s=m("div","big","TAP TO START"),u=m("div","sub",`webcam access required
HTTPS or localhost only`);a.append(c,s,u),a.addEventListener("click",g=>{g.stopPropagation(),e.onStart()}),r.appendChild(a);const d=m("footer","transport"),f=m("div","group"),h=m("span","lcd small","0");f.append(m("span","label","F"),h);const E=m("button","on","PAUSE");E.title="play / pause",E.addEventListener("click",()=>e.onPlayToggle());const x=m("button",void 0,"PHOTO CAPTURE");x.title="photo capture",x.addEventListener("click",()=>e.onSnapshot());const R=m("button","rec-btn","RECORD START");R.title="record video",R.addEventListener("click",()=>e.onRecordToggle());const T=m("div","group"),_=m("span","lcd small","00:00");T.append(m("span","label","REC"),_),T.style.display="none";const U=m("div","group"),K=m("span","lcd small","—");U.append(m("span","label","FX"),K);const M=m("div","group"),D=m("span","lcd small","60.0");M.append(m("span","label","FPS"),D);const xt=m("div","group"),Ce=m("span","lcd small","120");Ce.style.cursor="pointer",Ce.addEventListener("click",()=>e.onTempoTap()),xt.append(m("span","label","Tempo"),Ce,m("span","label","BPM"));const ne=m("button","hands-btn","✋︎");ne.title="hand tracking",ne.addEventListener("click",()=>e.onHandsToggle());const je=m("button",void 0,"⇄");je.title="switch camera",je.addEventListener("click",()=>e.onCameraFlip()),d.append(U,E,x,R,T,m("div","push"),f,M,xt,ne,je);const ze=m("div","device");return ze.append(n,r,d),t.append(ze),{canvas:l,chromeHeight(){return n.offsetHeight+d.offsetHeight},setDeviceWidth(g){ze.style.width=`${g+4}px`},hideStartOverlay(){a.classList.add("hidden")},showStartError(g){s.textContent="CAMERA ERROR",u.textContent=g,c.style.animationDuration="0.4s"},setFxLabel(g){K.textContent=g},setTransport(g,fe,Ke,wt){h.textContent=String(g).padStart(6,"0"),D.textContent=fe.toFixed(1),Ce.textContent=String(Ke),E.textContent=wt?"PAUSE":"PLAY",E.classList.toggle("on",wt)},setRecording(g){R.textContent=g?"RECORD STOP":"RECORD START",R.classList.toggle("recording",g),_.classList.toggle("rec",g),T.style.display=g?"flex":"none",g||(_.textContent="00:00")},setRecordTime(g){const fe=Math.floor(g/60),Ke=Math.floor(g)%60;_.textContent=`${String(fe).padStart(2,"0")}:${String(Ke).padStart(2,"0")}`},setHands(g,fe){ne.classList.toggle("loading",g==="loading"),ne.classList.toggle("on",g==="on"),ne.classList.toggle("detect",g==="on"&&fe)}}}const Ln=6,yt=2;let O,Xe=0,lt=0,Ae=new Float64Array(0),Ue=new Float64Array(0),Pe=new Float64Array(0),Me=new Float64Array(0),De=new Float64Array(0);function Cn(t){const{width:e,height:n,data:o}=t;if(e!==Xe||n!==lt){Xe=e,lt=n;const r=(e+1)*(n+1);Ae=new Float64Array(r),Ue=new Float64Array(r),Pe=new Float64Array(r),Me=new Float64Array(r),De=new Float64Array(r)}const i=e+1;for(let r=0;r<n;r++){let l=0,a=0,c=0,s=0,u=0;for(let d=0;d<e;d++){const f=(r*e+d)*4,h=o[f],E=o[f+1],x=o[f+2],R=ue(h,E,x);l+=R,a+=R*R,c+=h,s+=E,u+=x;const T=(r+1)*i+(d+1),_=r*i+(d+1);Ae[T]=Ae[_]+l,Ue[T]=Ue[_]+a,Pe[T]=Pe[_]+c,Me[T]=Me[_]+s,De[T]=De[_]+u}}}function de(t,e,n,o,i){const r=Xe+1;return t[(n+i)*r+(e+o)]-t[n*r+(e+o)]-t[(n+i)*r+e]+t[n*r+e]}function Sn(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function he(t,e,n,o,i,r,l,a,c){const s=n*o,u=de(Ae,t,e,n,o)/s,d=de(Ue,t,e,n,o)/s-u*u;if(i<Ln&&n>yt&&o>yt&&d>r){const M=n>>1,D=o>>1;he(t,e,M,D,i+1,r,l,a,c),he(t+M,e,n-M,D,i+1,r,l,a,c),he(t,e+D,M,o-D,i+1,r,l,a,c),he(t+M,e+D,n-M,o-D,i+1,r,l,a,c);return}const h=de(Pe,t,e,n,o)/s,E=de(Me,t,e,n,o)/s,x=de(De,t,e,n,o)/s,R=Sn(t,e,Math.floor(c*2))<.025;O.fillStyle=R?"#2ea44f":`rgb(${Math.round(h)},${Math.round(E)},${Math.round(x)})`;const T=t*l,_=e*a,U=n*l,K=o*a;O.fillRect(T,_,U,K),O.strokeRect(T+.5,_+.5,U-1,K-1)}const An={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){O=e},render(t){const{width:e,height:n}=O.canvas,{width:o,height:i}=t.sample;Cn(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);O.fillStyle="#000",O.fillRect(0,0,e,n),O.strokeStyle="#000",O.lineWidth=1,he(0,0,o,i,0,r,e/o,n/i,t.beat)},dispose(){Xe=0,lt=0}},Un=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function bt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${i}`)}return o}function G(t,e,n=Un){const o=bt(t,t.VERTEX_SHADER,n),i=bt(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,i),t.linkProgram(r),t.deleteShader(o),t.deleteShader(i),!t.getProgramParameter(r,t.LINK_STATUS)){const l=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${l}`)}return r}function z(t){t.drawArrays(t.TRIANGLES,0,3)}function Pn(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const i=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:i,texture:o,width:e,height:n}}function Mt(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const Mn=`#version 300 es
// RELIEF — 흰 종이 위 양각 릴리프, 엣지에 미묘한 황록 색수차 (레퍼런스 IMG_6360)
precision highp float;

uniform sampler2D u_video;
uniform vec2 u_texel;   // 1.0 / 비디오 해상도
uniform float u_time;
uniform bool u_mirror;

in vec2 v_uv;
out vec4 outColor;

float lum(vec2 uv) {
  vec3 c = texture(u_video, uv).rgb;
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  if (u_mirror) uv.x = 1.0 - uv.x;

  // 좌상 광원 대각 릴리프 (부호 있는 그래디언트)
  vec2 d = u_texel * 2.0;
  float g = lum(uv - d) - lum(uv + d);
  float g2 = lum(uv - d * 1.5) - lum(uv + d * 1.5); // 살짝 넓은 반경

  // 채널별 강도 차이 → 엣지가 은은한 황록으로 물든다 (B를 가장 많이 깎는다)
  vec3 edge = vec3(g * 2.3, g2 * 1.6, g * 2.9);

  // 미색 종이 + 옅은 그레인
  vec3 paper = vec3(0.972, 0.968, 0.950);
  float grain = (hash(uv * vec2(1280.0, 720.0) + floor(u_time * 8.0)) - 0.5) * 0.02;

  outColor = vec4(clamp(paper - edge + grain, 0.0, 1.0), 1.0);
}
`;let F=null,Q=null,Dt=null,Ft=null,It=null,$t=null;function Dn(t){const e=F;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(Q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Dt,0),e.uniform2f(Ft,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(It,t.time),e.uniform1i($t,t.mirror?1:0),z(e)}let Fe,H=null,Ze,ve=new Float32Array(0),Ie=null;function Fn(t){const{width:e,height:n,data:o}=t.sample;H||(H=document.createElement("canvas"),Ze=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,ve=new Float32Array(e*n),Ie=Ze.createImageData(e,n));for(let a=0,c=0;a<e*n;a++,c+=4)ve[a]=ue(o[c],o[c+1],o[c+2])/255;const i=Ie.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){let s=0;c>0&&c<e-1&&a>0&&a<n-1&&(s=ve[(a-1)*e+(c-1)]-ve[(a+1)*e+(c+1)]);const u=(a*e+c)*4;i[u]=Math.min(255,Math.max(0,248-s*2.3*255)),i[u+1]=Math.min(255,Math.max(0,247-s*1.6*255)),i[u+2]=Math.min(255,Math.max(0,242-s*2.9*255)),i[u+3]=255}Ze.putImageData(Ie,0,0);const{width:r,height:l}=Fe.canvas;Fe.imageSmoothingEnabled=!0,Fe.drawImage(H,0,0,r,l)}const In={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){F=t,Fe=e,F&&!Q&&(Q=G(F,Mn),Dt=F.getUniformLocation(Q,"u_video"),Ft=F.getUniformLocation(Q,"u_texel"),It=F.getUniformLocation(Q,"u_time"),$t=F.getUniformLocation(Q,"u_mirror"))},render(t){F&&t.videoTex?Dn(t):Fn(t)},dispose(){ve=new Float32Array(0),Ie=null}},$n=`#version 300 es
// WAVE — 행 단위 sin 변위 + 에코 등고선 + 블루 도트 디더 (레퍼런스 IMG_6365)
precision highp float;

uniform sampler2D u_video;
uniform vec2 u_res;    // 캔버스 해상도 (물리 픽셀)
uniform float u_cell;  // 디더 셀 크기 (물리 픽셀)
uniform float u_time;
uniform bool u_mirror;

in vec2 v_uv;
out vec4 outColor;

const vec3 GLOW = vec3(0.85, 0.97, 1.00);  // 하이라이트 (거의 흰 시안)
const vec3 BLUE = vec3(0.33, 0.62, 1.00);  // 중간톤 블루
const vec3 DEEP = vec3(0.08, 0.22, 0.50);  // 어두운 블루
const vec3 INK = vec3(0.00, 0.01, 0.03);   // 배경

float lum(vec2 uv) {
  vec3 c = texture(u_video, uv).rgb;
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float bayer4(ivec2 p) {
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[p.y * 4 + p.x]) + 0.5) / 16.0;
}

void main() {
  vec2 uv = v_uv;
  if (u_mirror) uv.x = 1.0 - uv.x;

  // 다중 주파수 행 변위 파형
  float w = sin(uv.y * 58.0 + u_time * 2.4) * 0.55 +
            sin(uv.y * 21.0 - u_time * 1.6) * 0.45;

  float base = lum(uv);

  // 변위를 키워가며 max 누적 → 윤곽이 옆으로 반복되는 등고선 잔상
  float acc = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 o = vec2(w * (0.006 + fi * 0.014) * (0.35 + base), 0.0);
    acc = max(acc, lum(uv + o) * pow(0.70, fi));
  }

  // 셀 단위 Bayer 디더로 4단계 블루 팔레트 양자화
  vec2 cell = floor(gl_FragCoord.xy / u_cell);
  float th = bayer4(ivec2(mod(cell, 4.0)));
  float q = acc + (th - 0.5) * 0.28;

  vec3 col = q > 0.72 ? GLOW : q > 0.45 ? BLUE : q > 0.24 ? DEEP : INK;
  outColor = vec4(col, 1.0);
}
`;let P=null,V=null,Bt=null,Ot=null,Gt=null,Ht=null,Nt=null;function Bn(t){const e=P,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(V),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Bt,0),e.uniform2f(Ot,n,o),e.uniform1f(Gt,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(Ht,t.time),e.uniform1i(Nt,t.mirror?1:0),z(e)}const On=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Gn=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let pe,N=null,Qe,ge=new Float32Array(0),$e=null;function Hn(t){const{width:e,height:n,data:o}=t.sample;N||(N=document.createElement("canvas"),Qe=N.getContext("2d")),(N.width!==e||N.height!==n)&&(N.width=e,N.height=n,ge=new Float32Array(e*n),$e=Qe.createImageData(e,n));for(let c=0,s=0;c<e*n;c++,s+=4)ge[c]=ue(o[s],o[s+1],o[s+2])/255;const i=t.time,r=$e.data;for(let c=0;c<n;c++){const s=c/n,u=Math.sin(s*58+i*2.4)*.55+Math.sin(s*21-i*1.6)*.45,d=On[c&3];for(let f=0;f<e;f++){const h=ge[c*e+f];let E=0;for(let _=0;_<4;_++){const U=Math.round(u*(.006+_*.014)*(.35+h)*e),K=Math.min(e-1,Math.max(0,f+U));E=Math.max(E,ge[c*e+K]*Math.pow(.7,_))}const x=E+(d[f&3]-.5)*.28,R=Gn[x>.72?0:x>.45?1:x>.24?2:3],T=(c*e+f)*4;r[T]=R[0],r[T+1]=R[1],r[T+2]=R[2],r[T+3]=255}}Qe.putImageData($e,0,0);const{width:l,height:a}=pe.canvas;pe.imageSmoothingEnabled=!1,pe.drawImage(N,0,0,l,a),pe.imageSmoothingEnabled=!0}const Nn={id:"wave",name:"WAVE",usesGl:!0,init(t,e){P=t,pe=e,P&&!V&&(V=G(P,$n),Bt=P.getUniformLocation(V,"u_video"),Ot=P.getUniformLocation(V,"u_res"),Gt=P.getUniformLocation(V,"u_cell"),Ht=P.getUniformLocation(V,"u_time"),Nt=P.getUniformLocation(V,"u_mirror"))},render(t){P&&t.videoTex?Bn(t):Hn(t)},dispose(){ge=new Float32Array(0),$e=null}},Xn=`#version 300 es
// RISO — 초록/노랑/흰 4단계 포스터라이즈 + 강한 그레인 + 엣지 프린지 (레퍼런스 IMG_6369)
precision highp float;

uniform sampler2D u_video;
uniform float u_time;
uniform bool u_mirror;

in vec2 v_uv;
out vec4 outColor;

const vec3 DEEP = vec3(0.04, 0.42, 0.12);   // 짙은 초록
const vec3 GREEN = vec3(0.20, 0.66, 0.24);  // 초록
const vec3 YELLOW = vec3(0.93, 0.90, 0.52); // 옅은 노랑
const vec3 WHITE = vec3(0.98, 0.98, 0.94);  // 흰색

float lum(vec2 uv) {
  vec3 c = texture(u_video, uv).rgb;
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 palette(float l) {
  return l < 0.30 ? DEEP : l < 0.52 ? GREEN : l < 0.72 ? YELLOW : WHITE;
}

void main() {
  vec2 uv = v_uv;
  if (u_mirror) uv.x = 1.0 - uv.x;

  // 리소 인쇄 특유의 거친 그레인 (프레임마다 갱신)
  float grain = (hash(uv * vec2(640.0, 360.0) + floor(u_time * 24.0)) - 0.5) * 0.16;
  float l = lum(uv) + grain;

  vec3 col = palette(l);

  // 채널 오프셋 차이로 엣지에 핑크/시안 판 어긋남 프린지
  float lr = lum(uv + vec2(0.004, 0.0));
  float lb = lum(uv - vec2(0.004, 0.0));
  col += (lr - lb) * vec3(0.85, -0.25, 0.65);

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;let Y=null,re=null,Xt=null,kt=null,Wt=null;function kn(t){const e=Y;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(re),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Xt,0),e.uniform1f(kt,t.time),e.uniform1i(Wt,t.mirror?1:0),z(e)}const Wn=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Ee,X=null,Je,Be=null;function Vn(t){const{width:e,height:n,data:o}=t.sample;X||(X=document.createElement("canvas"),Je=X.getContext("2d")),(X.width!==e||X.height!==n)&&(X.width=e,X.height=n,Be=Je.createImageData(e,n));const i=Be.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){const s=(a*e+c)*4,u=(Math.random()-.5)*.16,d=ue(o[s],o[s+1],o[s+2])/255+u,f=Wn[d<.3?0:d<.52?1:d<.72?2:3];i[s]=f[0],i[s+1]=f[1],i[s+2]=f[2],i[s+3]=255}Je.putImageData(Be,0,0);const{width:r,height:l}=Ee.canvas;Ee.imageSmoothingEnabled=!1,Ee.drawImage(X,0,0,r,l),Ee.imageSmoothingEnabled=!0}const Yn={id:"riso",name:"RISO",usesGl:!0,init(t,e){Y=t,Ee=e,Y&&!re&&(re=G(Y,Xn),Xt=Y.getUniformLocation(re,"u_video"),kt=Y.getUniformLocation(re,"u_time"),Wt=Y.getUniformLocation(re,"u_mirror"))},render(t){Y&&t.videoTex?kn(t):Vn(t)},dispose(){Be=null}},qn=`#version 300 es
// POINT CLOUD — 정점 버퍼 없이 gl_VertexID로 그리드 점 생성 (SPEC §5.4)
// 정점 셰이더에서 웹캠 텍스처를 직접 샘플링해 luma 기반 크기/변위를 계산한다.
precision highp float;

uniform sampler2D u_video;
uniform vec2 u_grid;   // 그리드 크기 (예: 200×112 → 22,400점)
uniform vec2 u_res;    // 캔버스 해상도 (물리 픽셀)
uniform float u_time;
uniform float u_wave;  // 파동 강도 (기본 1.0)
uniform bool u_mirror;

out float v_luma;

void main() {
  int ix = gl_VertexID % int(u_grid.x);
  int iy = gl_VertexID / int(u_grid.x);
  vec2 cell = (vec2(float(ix), float(iy)) + 0.5) / u_grid; // 0..1, y=0이 화면 위

  vec2 uv = vec2(u_mirror ? 1.0 - cell.x : cell.x, 1.0 - cell.y);
  vec3 c = textureLod(u_video, uv, 0.0).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  v_luma = l;

  // 어두운 점은 클립 밖으로 보내서 버린다
  if (l < 0.04) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  // sin 파동 변위 — 밝은 픽셀일수록 크게 출렁인다 (픽셀 단위 → NDC 변환)
  float spacing = u_res.x / u_grid.x;
  float dx = sin(u_time * 2.0 + cell.x * 45.0 + cell.y * 13.0) * (1.0 + l * 5.0) * spacing * 0.6;
  float dy = cos(u_time * 1.6 + cell.y * 20.0 + cell.x * 8.0) * (1.0 + l * 3.0) * spacing * 0.4;
  vec2 offset = vec2(dx, dy) * u_wave / u_res * 2.0;

  vec2 ndc = vec2(cell.x * 2.0 - 1.0, 1.0 - cell.y * 2.0);
  gl_Position = vec4(ndc + offset, 0.0, 1.0);
  gl_PointSize = (0.3 + l * 1.8) * spacing;
}
`,jn=`#version 300 es
// POINT CLOUD — 시안(밝음) ↔ 블루(어두움) 팔레트, 원형 점 (SPEC §5.4)
precision highp float;

in float v_luma;
out vec4 outColor;

void main() {
  vec2 d = gl_PointCoord - 0.5;
  if (dot(d, d) > 0.25) discard; // 원형 점

  float l = v_luma;
  vec3 col = vec3(24.0 + l * 60.0, 90.0 + l * 150.0, 200.0 + l * 55.0) / 255.0;
  float alpha = 0.2 + l * 0.8;
  outColor = vec4(col, alpha);
}
`,et=200,le={wave:1,trail:.14},tt=[1,2,3.5,.4],zn=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Kn=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let y=null,I=null,ct=null,Vt=null,Yt=null,qt=null,jt=null,zt=null,Kt=null,Zt=null,st=null,Qt=null,S=null,_e=!0;function Zn(t){const e=y,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!S||S.width!==n||S.height!==o)&&(S&&Mt(e,S),S=Pn(e,n,o),_e=!0),e.bindFramebuffer(e.FRAMEBUFFER,S.framebuffer),e.viewport(0,0,n,o),_e&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),_e=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(ct),e.uniform1f(Zt,le.trail),z(e);const i=Math.max(2,Math.round(et*t.video.videoHeight/t.video.videoWidth));e.useProgram(I),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Vt,0),e.uniform2f(Yt,et,i),e.uniform2f(qt,n,o),e.uniform1f(jt,t.time),e.uniform1f(zt,le.wave),e.uniform1i(Kt,t.mirror?1:0),e.drawArrays(e.POINTS,0,et*i),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(st),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,S.texture),e.uniform1i(Qt,0),z(e)}const Lt=2;let ut,$=null,Z,xe=!0;function Qn(t){const{width:e,height:n}=ut.canvas,{width:o,height:i,data:r}=t.sample;$||($=document.createElement("canvas"),Z=$.getContext("2d")),($.width!==e||$.height!==n)&&($.width=e,$.height=n,xe=!0),xe?(Z.fillStyle="#000",Z.fillRect(0,0,e,n),xe=!1):(Z.fillStyle=`rgba(0,0,0,${le.trail})`,Z.fillRect(0,0,e,n));const l=e/o,a=n/i,c=t.time,s=le.wave;for(let u=0;u<i;u+=Lt)for(let d=0;d<o;d+=Lt){const f=(u*o+d)*4,h=ue(r[f],r[f+1],r[f+2])/255;if(h<.04)continue;const E=Math.sin(c*2+d*.35+u*.18)*(1+h*5)*l*.6*s,x=Math.cos(c*1.6+u*.28+d*.11)*(1+h*3)*a*.4*s,R=Math.round(24+h*60),T=Math.round(90+h*150),_=Math.round(200+h*55),U=(.6+h*2.6)*l*.5;Z.fillStyle=`rgba(${R},${T},${_},${.2+h*.8})`,Z.fillRect(d*l+E,u*a+x,U,U)}ut.drawImage($,0,0)}const Jn={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){y=t,ut=e,xe=!0,_e=!0,y&&!I&&(I=G(y,jn,qn),Vt=y.getUniformLocation(I,"u_video"),Yt=y.getUniformLocation(I,"u_grid"),qt=y.getUniformLocation(I,"u_res"),jt=y.getUniformLocation(I,"u_time"),zt=y.getUniformLocation(I,"u_wave"),Kt=y.getUniformLocation(I,"u_mirror"),ct=G(y,zn),Zt=y.getUniformLocation(ct,"u_alpha"),st=G(y,Kn),Qt=y.getUniformLocation(st,"u_tex"))},render(t){y&&t.videoTex?Zn(t):Qn(t)},dispose(){y&&S&&Mt(y,S),S=null,$=null,xe=!0,_e=!0},onReselect(){const t=tt.indexOf(le.wave);le.wave=tt[(t+1)%tt.length]}},eo=`#version 300 es
// BLUEPRINT — 4×4 Bayer ordered dithering + 랜덤 노이즈, 듀오톤 (SPEC §5.5)
// u_invert: 파랑↔흰 반전 토글 (원본 1번째 컷은 파란 배경에 흰 얼굴)
precision highp float;

uniform sampler2D u_video;
uniform vec2 u_res;     // 캔버스 해상도 (물리 픽셀)
uniform float u_cell;   // 디더 셀 크기 (물리 픽셀, 보통 devicePixelRatio)
uniform float u_time;
uniform bool u_mirror;
uniform bool u_invert;

in vec2 v_uv;
out vec4 outColor;

const vec3 WHITE = vec3(0.933, 0.957, 0.980); // #eef4fa
const vec3 BLUE = vec3(0.086, 0.282, 0.620);  // #16489e

float bayer4(ivec2 p) {
  // 4×4 Bayer 행렬 (0..15)
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[p.y * 4 + p.x]) + 0.5) / 16.0;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // 셀 단위로 양자화해서 디더 픽셀을 또렷하게 유지
  vec2 cell = floor(gl_FragCoord.xy / u_cell);
  vec2 uv = (cell + 0.5) * u_cell / u_res;
  if (u_mirror) uv.x = 1.0 - uv.x;

  vec3 c = texture(u_video, uv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));

  float threshold = bayer4(ivec2(mod(cell, 4.0)));
  float noise = (hash(cell + floor(u_time * 60.0)) - 0.5) * 0.12;
  bool on = l + noise > threshold;
  if (u_invert) on = !on;

  outColor = vec4(on ? WHITE : BLUE, 1.0);
}
`;let ke=!1,C=null,B=null,Jt=null,en=null,tn=null,nn=null,on=null,rn=null;function to(t){const e=C,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Jt,0),e.uniform2f(en,n,o),e.uniform1f(tn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(nn,t.time),e.uniform1i(on,t.mirror?1:0),e.uniform1i(rn,ke?1:0),z(e)}const no=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),oo={r:238,g:244,b:250},ro={r:22,g:72,b:158},io=.12;let Te,k=null,nt,Oe=null;function ao(t){const{width:e,height:n,data:o}=t.sample;k||(k=document.createElement("canvas"),nt=k.getContext("2d")),(k.width!==e||k.height!==n)&&(k.width=e,k.height=n,Oe=nt.createImageData(e,n));const i=Oe.data;for(let a=0;a<n;a++){const c=no[a&3];for(let s=0;s<e;s++){const u=(a*e+s)*4;let f=ue(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*io>c[s&3];ke&&(f=!f);const h=f?oo:ro;i[u]=h.r,i[u+1]=h.g,i[u+2]=h.b,i[u+3]=255}}nt.putImageData(Oe,0,0);const{width:r,height:l}=Te.canvas;Te.imageSmoothingEnabled=!1,Te.drawImage(k,0,0,r,l),Te.imageSmoothingEnabled=!0}const lo={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){C=t,Te=e,C&&!B&&(B=G(C,eo),Jt=C.getUniformLocation(B,"u_video"),en=C.getUniformLocation(B,"u_res"),tn=C.getUniformLocation(B,"u_cell"),nn=C.getUniformLocation(B,"u_time"),on=C.getUniformLocation(B,"u_mirror"),rn=C.getUniformLocation(B,"u_invert"))},render(t){C&&t.videoTex?to(t):ao(t)},dispose(){Oe=null},onReselect(){ke=!ke}},co=`#version 300 es
// SLIT-SCAN — 행마다 다른 과거 프레임 샘플링, 시간 왜곡 (SPEC §5.8)
// TouchDesigner cache TOP 워크플로우의 웹 재현. beat 동기 물결로 지연량이 출렁인다.
precision highp float;
precision highp sampler2DArray;

uniform sampler2DArray u_history; // 최근 프레임 링 버퍼 (레이어 = 프레임)
uniform float u_head;    // 최신 프레임 레이어 인덱스
uniform float u_layers;  // 전체 레이어 수 (60)
uniform float u_filled;  // 현재 채워진 프레임 수
uniform float u_beat;
uniform bool u_mirror;

in vec2 v_uv;
out vec4 outColor;

void main() {
  vec2 uv = v_uv;
  if (u_mirror) uv.x = 1.0 - uv.x;

  float maxDelay = max(u_filled - 1.0, 0.0);

  // 위(현재) → 아래(과거) 지연 그라디언트 + beat 동기 물결
  float d = (1.0 - v_uv.y) * maxDelay;
  d += sin(v_uv.y * 36.0 + u_beat * 3.14159) * 3.0;
  d = clamp(d, 0.0, maxDelay);

  // 링 버퍼 좌표로 변환, 인접 레이어를 보간해 시간축을 부드럽게
  float layerF = mod(u_head - d + u_layers * 4.0, u_layers);
  float l0 = floor(layerF);
  float l1 = mod(l0 + 1.0, u_layers);
  float fr = layerF - l0;

  vec3 c0 = texture(u_history, vec3(uv, l0)).rgb;
  vec3 c1 = texture(u_history, vec3(uv, l1)).rgb;
  outColor = vec4(mix(c0, c1, fr), 1.0);
}
`,we=60,an=480,ln=270,so=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let b=null,Ge=null,q=null,cn=null,sn=null,un=null,fn=null,dn=null,mn=null,hn=null,j=null,Re=null,ie=-1,ye=0;function uo(t){j=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,j),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,an,ln,we),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Re=t.createFramebuffer(),ie=-1,ye=0}function fo(){b&&(j&&b.deleteTexture(j),Re&&b.deleteFramebuffer(Re),j=null,Re=null,ie=-1,ye=0)}function mo(t){const e=b;ie=(ie+1)%we,ye=Math.min(ye+1,we),e.bindFramebuffer(e.FRAMEBUFFER,Re),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,j,0,ie),e.viewport(0,0,an,ln),e.useProgram(Ge),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(cn,0),z(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,j),e.uniform1i(sn,0),e.uniform1f(un,ie),e.uniform1f(fn,we),e.uniform1f(dn,ye),e.uniform1f(mn,t.beat),e.uniform1i(hn,t.mirror?1:0),z(e)}let He,W=null,ot,Ne=null,J=[];function ho(t){const{width:e,height:n,data:o}=t.sample;W||(W=document.createElement("canvas"),ot=W.getContext("2d")),(W.width!==e||W.height!==n)&&(W.width=e,W.height=n,Ne=ot.createImageData(e,n),J=[]),J.push(new Uint8ClampedArray(o)),J.length>we&&J.shift();const i=J.length-1,r=Ne.data;for(let c=0;c<n;c++){let s=c/Math.max(1,n-1)*i;s+=Math.sin((1-c/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(i,Math.max(0,s))),d=J[i-u],f=c*e*4;r.set(d.subarray(f,f+e*4),f)}ot.putImageData(Ne,0,0);const{width:l,height:a}=He.canvas;He.imageSmoothingEnabled=!0,He.drawImage(W,0,0,l,a)}const vo={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){b=t,He=e,b&&(Ge||(Ge=G(b,so),cn=b.getUniformLocation(Ge,"u_video"),q=G(b,co),sn=b.getUniformLocation(q,"u_history"),un=b.getUniformLocation(q,"u_head"),fn=b.getUniformLocation(q,"u_layers"),dn=b.getUniformLocation(q,"u_filled"),mn=b.getUniformLocation(q,"u_beat"),hn=b.getUniformLocation(q,"u_mirror")),uo(b))},render(t){b&&t.videoTex&&j?mo(t):ho(t)},dispose(){fo(),J=[],Ne=null}},ft=[An,In,Nn,Yn,Jn,lo,vo];function ue(t,e,n){return .2126*t+.7152*e+.0722*n}function po(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,i=0;return{gl:e,videoTex:n,uploadVideo(r){const l=r.videoWidth,a=r.videoHeight;l===0||a===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),l!==o||a!==i?(o=l,i=a,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const go="modulepreload",Eo=function(t,e){return new URL(t,e).href},Ct={},To=function(e,n,o){let i=Promise.resolve();if(n&&n.length>0){let s=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const l=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");i=s(n.map(u=>{if(u=Eo(u,o),u in Ct)return;Ct[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(o)for(let E=l.length-1;E>=0;E--){const x=l[E];if(x.href===u&&(!d||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":go,d||(h.as="script"),h.crossOrigin="",h.href=u,c&&h.setAttribute("nonce",c),document.head.appendChild(h),d)return new Promise((E,x)=>{h.addEventListener("load",E),h.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return i.then(l=>{for(const a of l||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};let te="off",ce=null,dt=-1,mt=0,pt={hands:0,pinching:0,points:[],corners:null};function ht(){return te}function gt(){return pt}async function vn(){if(te==="off"){te="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await To(async()=>{const{FilesetResolver:r,HandLandmarker:l}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:l}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),i=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2});try{ce=await e.createFromOptions(o,i("GPU"))}catch{ce=await e.createFromOptions(o,i("CPU"))}te="on"}catch(t){throw te="off",t}}}function _o(){ce?.close(),ce=null,te="off",dt=-1,mt=0,pt={hands:0,pinching:0,points:[],corners:null}}function xo(t,e){if(te!=="on"||!ce||t.currentTime===dt||e-mt<66)return;dt=t.currentTime,mt=e;const n=ce.detectForVideo(t,e),o=[],i=n.landmarks?.length??0;for(const l of n.landmarks??[]){const a=l[4],c=l[8],s=Math.hypot(l[0].x-l[9].x,l[0].y-l[9].y),u=Math.hypot(a.x-c.x,a.y-c.y);o.push({x:(a.x+c.x)/2,y:(a.y+c.y)/2,pinching:u<Math.max(.025,s*.38)})}const r=o.filter(l=>l.pinching);pt={hands:i,pinching:r.length,points:o,corners:r.length>=2?[r[0],r[1]]:null}}const St=128,wo=2,rt=[90,100,110,120,128,140],Se=.08,Ro=400,yo=150;let v,p=null,L,We,pn,Ve,ee=null,it=!1,at=!1;const Ye=document.createElement("canvas"),oe=Ye.getContext("2d",{willReadFrequently:!0}),ae=new yn,be=new Pt;let gn=0;const bo=new ImageData(2,2),A=[];let w=null,Le=0,At=0,me=null;const qe=new Set;function se(){return ft[Le%ft.length]}function Et(t){qe.has(t.id)||(t.init(ee?.gl??null,pn),qe.add(t.id))}function Tt(){const t=new Set;for(const e of A)t.add(e.effect.id);w&&t.add(w.effect.id);for(const e of[...qe])t.has(e)||(ft.find(n=>n.id===e)?.dispose(),qe.delete(e))}function Lo(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}function Co(t){const e=t.map(l=>({x:p.mirror?1-l.x:l.x,y:l.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),i=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return o-n<Se&&(o=n+Se),r-i<Se&&(r=i+Se),{x0:n,y0:i,x1:o,y1:r}}function So(t){const e=gt();if(e.corners&&p){At=t;const n=Co(e.corners);if(w)w.rect.x0+=(n.x0-w.rect.x0)*.3,w.rect.y0+=(n.y0-w.rect.y0)*.3,w.rect.x1+=(n.x1-w.rect.x1)*.3,w.rect.y1+=(n.y1-w.rect.y1)*.3;else{if(me===null&&(me=t),t-me<yo)return;me=null,w={rect:n,effect:se()},Le++,Et(w.effect),v.setFxLabel(w.effect.name)}return}me=null,w&&t-At>Ro&&(En(w),w=null)}function En(t){for(let e=A.length-1;e>=0;e--)Lo(t.rect,A[e].rect)&&A.splice(e,1);A.push(t),Tt(),v.setFxLabel(`NEXT ${se().name}`)}function _t(){if(!p)return;const t=p.video.videoWidth||4,e=p.video.videoHeight||3,n=16,o=4,i=Math.max(64,window.innerWidth-n*2-o),r=Math.max(64,window.innerHeight-n*2-o-v.chromeHeight()),l=Math.min(i/t,r/e),a=Math.round(t*l),c=Math.round(e*l),s=Math.min(wo,window.devicePixelRatio||1);v.canvas.style.width=`${a}px`,v.canvas.style.height=`${c}px`,v.setDeviceWidth(a);for(const u of[v.canvas,We,Ve])u.width=Math.round(a*s),u.height=Math.round(c*s);Ye.width=St,Ye.height=Math.max(2,Math.round(St*e/t))}function Ao(){const{width:t,height:e}=Ye;return oe.save(),p.mirror&&(oe.translate(t,0),oe.scale(-1,1)),oe.drawImage(p.video,0,0,t,e),oe.restore(),oe.getImageData(0,0,t,e)}function Uo(){const{width:t,height:e}=v.canvas;L.save(),p.mirror&&(L.translate(t,0),L.scale(-1,1)),L.drawImage(p.video,0,0,t,e),L.restore()}function Ut(t,e,n){const{width:o,height:i}=v.canvas,r=t.rect.x0*o,l=t.rect.y0*i,a=(t.rect.x1-t.rect.x0)*o,c=(t.rect.y1-t.rect.y0)*i;L.drawImage(e,r,l,a,c,r,l,a,c),L.strokeStyle="#ffffff",L.lineWidth=Math.max(2,o/640),n&&L.setLineDash([10,8]),L.strokeRect(r,l,a,c),L.setLineDash([])}function Po(t){Uo();const e=A.map(a=>({f:a,isDrawing:!1}));if(w&&e.push({f:w,isDrawing:!0}),e.length===0)return;const n=e.some(({f:a})=>a.effect.usesGl&&ee),o=e.some(({f:a})=>!(a.effect.usesGl&&ee));n&&ee.uploadVideo(p.video);const i={videoTex:n?ee.videoTex:null,sample:o?Ao():bo,video:p.video,mirror:p.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,l=null;for(const{f:a,isDrawing:c}of e)!!a.effect.usesGl&&!!ee?(l!==a.effect&&(a.effect.render(i),l=a.effect),Ut(a,Ve,c)):(r!==a.effect&&(a.effect.render(i),r=a.effect),Ut(a,We,c))}function Mo(){const t=gt();if(t.points.length===0||!p)return;const{width:e,height:n}=v.canvas,o=Math.max(10,e*.018);L.lineWidth=Math.max(2,e/500);for(const i of t.points){const r=(p.mirror?1-i.x:i.x)*e,l=i.y*n;L.beginPath(),L.arc(r,l,o,0,Math.PI*2),L.strokeStyle=i.pinching?"#1f6bff":"#ffffff",L.stroke()}}function Tn(t){requestAnimationFrame(Tn);const e=ae.tick(t),n=p!==null&&p.video.readyState>=2;n&&(xo(p.video,t),So(t)),e.playing&&n&&(Po(e),Mo()),be.captureFrame(v.canvas),be.recording&&v.setRecordTime((t-gn)/1e3),v.setHands(ht(),gt().hands>0),v.setTransport(e.frame,e.fps,e.bpm,e.playing)}function _n(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Do(){if(!p||!Pt.supported())return;if(!be.recording){be.start(v.canvas),gn=performance.now(),v.setRecording(!0);return}v.setRecording(!1);const t=await be.stop();t&&_n(t.blob,`null8_${ae.timecode().replaceAll(":","")}.${t.ext}`)}async function Fo(){if(ht()!=="loading"){if(ht()==="on"){_o();return}v.setHands("loading",!1);try{await vn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Io(){if(!p||at)return;at=!0;const t=p.facing;try{p=await wn(p)}catch{p=await vt(t)}finally{at=!1}_t()}function $o(){v.canvas.toBlob(t=>{t&&_n(t,`null8_${ae.timecode().replaceAll(":","")}.png`)},"image/png")}function Bo(){A.length>0?(A.pop(),Tt()):Le++,v.setFxLabel(`NEXT ${se().name}`)}async function Oo(){if(!(p||it)){it=!0;try{p=await vt("user"),v.hideStartOverlay(),_t(),requestAnimationFrame(Tn),vn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=se();Le++,Et(e),A.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),v.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);v.showStartError(e),it=!1}}}function Go(){const t=document.getElementById("app");v=bn(t,{onStart:()=>{Oo()},onCanvasTap:Bo,onPlayToggle:()=>ae.toggle(),onSnapshot:$o,onTempoTap:()=>{const e=rt.indexOf(ae.bpm);ae.bpm=rt[(e+1)%rt.length]},onRecordToggle:()=>{Do()},onCameraFlip:()=>{Io()},onHandsToggle:()=>{Fo()}}),L=v.canvas.getContext("2d"),We=document.createElement("canvas"),pn=We.getContext("2d"),Ve=document.createElement("canvas"),ee=po(Ve),v.setFxLabel(`NEXT ${se().name}`),window.addEventListener("resize",_t),window.__null8={addFrame(e){const n=se();Le++,Et(n),En({rect:e,effect:n})},clearFrames(){A.length=0,Tt()},get frames(){return A.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Go();
