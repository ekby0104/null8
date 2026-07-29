(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();async function Ft(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function jn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function zn(t){const e=t.facing==="user"?"environment":"user";return jn(t),Ft(e)}const Kn=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class Jt{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=Kn.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",a=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:a}}}const Nt=60;class Jn{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,a=Math.floor(e)%60,r=Math.floor(e*Nt)%Nt,s=i=>String(i).padStart(2,"0");return`${s(n)}:${s(o)}:${s(a)}:${s(r)}`}}function h(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function Zn(t,e){const n=h("header","titlebar"),o=h("div","traffic");for(const y of["r","y","g"])o.appendChild(h("span",y));const a=h("div","path","/project1/null8 (128,128)");n.append(o,a,h("div","spacer"));const r=h("div","viewport"),s=h("canvas");r.appendChild(s),r.addEventListener("click",()=>e.onCanvasTap());const i=h("div","start-overlay"),l=h("div","pulse"),c=h("div","big","TAP TO START"),u=h("div","sub",`webcam access required
HTTPS or localhost only`);i.append(l,c,u),i.addEventListener("click",y=>{y.stopPropagation(),e.onStart()}),r.appendChild(i);const f=h("footer","transport"),d=h("div","group"),m=h("span","lcd small","0");d.append(h("span","label","F"),m);const x=h("button","on","PAUSE");x.title="play / pause",x.addEventListener("click",()=>e.onPlayToggle());const T=h("button",void 0,"PHOTO CAPTURE");T.title="photo capture",T.addEventListener("click",()=>e.onSnapshot());const S=h("button","rec-btn","RECORD START");S.title="record video",S.addEventListener("click",()=>e.onRecordToggle());const R=h("div","group"),w=h("span","lcd small","00:00");R.append(h("span","label","REC"),w),R.style.display="none";const _=h("div","group"),$=h("span","lcd small","—");_.append(h("span","label","FX"),$);const M=h("div","group"),E=h("span","lcd small","60.0");M.append(h("span","label","FPS"),E);const O=h("div","group"),U=h("span","lcd small","120");U.style.cursor="pointer",U.addEventListener("click",()=>e.onTempoTap()),O.append(h("span","label","Tempo"),U,h("span","label","BPM"));const V=h("button","hands-btn","✋︎");V.title="hand tracking",V.addEventListener("click",()=>e.onHandsToggle());const ut=h("button",void 0,"⇄");ut.title="switch camera",ut.addEventListener("click",()=>e.onCameraFlip()),f.append(_,x,T,S,R,h("div","push"),d,M,O,V,ut);const ft=h("div","device");return ft.append(n,r,f),t.append(ft),{canvas:s,chromeHeight(){return n.offsetHeight+f.offsetHeight},setDeviceWidth(y){ft.style.width=`${y+4}px`},hideStartOverlay(){i.classList.add("hidden")},showStartError(y){c.textContent="CAMERA ERROR",u.textContent=y,l.style.animationDuration="0.4s"},setFxLabel(y){$.textContent=y},setTransport(y,xe,dt,Ot){m.textContent=String(y).padStart(6,"0"),E.textContent=xe.toFixed(1),U.textContent=String(dt),x.textContent=Ot?"PAUSE":"PLAY",x.classList.toggle("on",Ot)},setRecording(y){S.textContent=y?"RECORD STOP":"RECORD START",S.classList.toggle("recording",y),w.classList.toggle("rec",y),R.style.display=y?"flex":"none",y||(w.textContent="00:00")},setRecordTime(y){const xe=Math.floor(y/60),dt=Math.floor(y)%60;w.textContent=`${String(xe).padStart(2,"0")}:${String(dt).padStart(2,"0")}`},setHands(y,xe){V.classList.toggle("loading",y==="loading"),V.classList.toggle("on",y==="on"),V.classList.toggle("detect",y==="on"&&xe)}}}const Qn=6,Bt=2;let G,et=0,Rt=0,Be=new Float64Array(0),He=new Float64Array(0),We=new Float64Array(0),Ge=new Float64Array(0),Xe=new Float64Array(0);function eo(t){const{width:e,height:n,data:o}=t;if(e!==et||n!==Rt){et=e,Rt=n;const r=(e+1)*(n+1);Be=new Float64Array(r),He=new Float64Array(r),We=new Float64Array(r),Ge=new Float64Array(r),Xe=new Float64Array(r)}const a=e+1;for(let r=0;r<n;r++){let s=0,i=0,l=0,c=0,u=0;for(let f=0;f<e;f++){const d=(r*e+f)*4,m=o[d],x=o[d+1],T=o[d+2],S=ge(m,x,T);s+=S,i+=S*S,l+=m,c+=x,u+=T;const R=(r+1)*a+(f+1),w=r*a+(f+1);Be[R]=Be[w]+s,He[R]=He[w]+i,We[R]=We[w]+l,Ge[R]=Ge[w]+c,Xe[R]=Xe[w]+u}}}function _e(t,e,n,o,a){const r=et+1;return t[(n+a)*r+(e+o)]-t[n*r+(e+o)]-t[(n+a)*r+e]+t[n*r+e]}function to(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function we(t,e,n,o,a,r,s,i,l){const c=n*o,u=_e(Be,t,e,n,o)/c,f=_e(He,t,e,n,o)/c-u*u;if(a<Qn&&n>Bt&&o>Bt&&f>r){const M=n>>1,E=o>>1;we(t,e,M,E,a+1,r,s,i,l),we(t+M,e,n-M,E,a+1,r,s,i,l),we(t,e+E,M,o-E,a+1,r,s,i,l),we(t+M,e+E,n-M,o-E,a+1,r,s,i,l);return}const m=_e(We,t,e,n,o)/c,x=_e(Ge,t,e,n,o)/c,T=_e(Xe,t,e,n,o)/c,S=to(t,e,Math.floor(l*2))<.025;G.fillStyle=S?"#2ea44f":`rgb(${Math.round(m)},${Math.round(x)},${Math.round(T)})`;const R=t*s,w=e*i,_=n*s,$=o*i;G.fillRect(R,w,_,$),G.strokeRect(R+.5,w+.5,_-1,$-1)}const no={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){G=e},render(t){const{width:e,height:n}=G.canvas,{width:o,height:a}=t.sample;eo(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);G.fillStyle="#000",G.fillRect(0,0,e,n),G.strokeStyle="#000",G.lineWidth=1,we(0,0,o,a,0,r,e/o,n/a,t.beat)},dispose(){et=0,Rt=0}},oo=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Ht(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const a=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${a}`)}return o}function X(t,e,n=oo){const o=Ht(t,t.VERTEX_SHADER,n),a=Ht(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,a),t.linkProgram(r),t.deleteShader(o),t.deleteShader(a),!t.getProgramParameter(r,t.LINK_STATUS)){const s=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${s}`)}return r}function te(t){t.drawArrays(t.TRIANGLES,0,3)}function ro(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const a=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,a),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:a,texture:o,width:e,height:n}}function Zt(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const io=`#version 300 es
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
`;let N=null,re=null,Qt=null,en=null,tn=null,nn=null;function ao(t){const e=N;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(re),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Qt,0),e.uniform2f(en,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(tn,t.time),e.uniform1i(nn,t.mirror?1:0),te(e)}let Ve,q=null,mt,ye=new Float32Array(0),qe=null;function so(t){const{width:e,height:n,data:o}=t.sample;q||(q=document.createElement("canvas"),mt=q.getContext("2d")),(q.width!==e||q.height!==n)&&(q.width=e,q.height=n,ye=new Float32Array(e*n),qe=mt.createImageData(e,n));for(let i=0,l=0;i<e*n;i++,l+=4)ye[i]=ge(o[l],o[l+1],o[l+2])/255;const a=qe.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){let c=0;l>0&&l<e-1&&i>0&&i<n-1&&(c=ye[(i-1)*e+(l-1)]-ye[(i+1)*e+(l+1)]);const u=(i*e+l)*4;a[u]=Math.min(255,Math.max(0,248-c*2.3*255)),a[u+1]=Math.min(255,Math.max(0,247-c*1.6*255)),a[u+2]=Math.min(255,Math.max(0,242-c*2.9*255)),a[u+3]=255}mt.putImageData(qe,0,0);const{width:r,height:s}=Ve.canvas;Ve.imageSmoothingEnabled=!0,Ve.drawImage(q,0,0,r,s)}const lo={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){N=t,Ve=e,N&&!re&&(re=X(N,io),Qt=N.getUniformLocation(re,"u_video"),en=N.getUniformLocation(re,"u_texel"),tn=N.getUniformLocation(re,"u_time"),nn=N.getUniformLocation(re,"u_mirror"))},render(t){N&&t.videoTex?ao(t):so(t)},dispose(){ye=new Float32Array(0),qe=null}},co=`#version 300 es
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
`;let k=null,J=null,on=null,rn=null,an=null,sn=null,ln=null;function uo(t){const e=k,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(J),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(on,0),e.uniform2f(rn,n,o),e.uniform1f(an,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(sn,t.time),e.uniform1i(ln,t.mirror?1:0),te(e)}const fo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),mo=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Re,Y=null,ht,be=new Float32Array(0),Ye=null;function ho(t){const{width:e,height:n,data:o}=t.sample;Y||(Y=document.createElement("canvas"),ht=Y.getContext("2d")),(Y.width!==e||Y.height!==n)&&(Y.width=e,Y.height=n,be=new Float32Array(e*n),Ye=ht.createImageData(e,n));for(let l=0,c=0;l<e*n;l++,c+=4)be[l]=ge(o[c],o[c+1],o[c+2])/255;const a=t.time,r=Ye.data;for(let l=0;l<n;l++){const c=l/n,u=Math.sin(c*58+a*2.4)*.55+Math.sin(c*21-a*1.6)*.45,f=fo[l&3];for(let d=0;d<e;d++){const m=be[l*e+d];let x=0;for(let w=0;w<4;w++){const _=Math.round(u*(.006+w*.014)*(.35+m)*e),$=Math.min(e-1,Math.max(0,d+_));x=Math.max(x,be[l*e+$]*Math.pow(.7,w))}const T=x+(f[d&3]-.5)*.28,S=mo[T>.72?0:T>.45?1:T>.24?2:3],R=(l*e+d)*4;r[R]=S[0],r[R+1]=S[1],r[R+2]=S[2],r[R+3]=255}}ht.putImageData(Ye,0,0);const{width:s,height:i}=Re.canvas;Re.imageSmoothingEnabled=!1,Re.drawImage(Y,0,0,s,i),Re.imageSmoothingEnabled=!0}const vo={id:"wave",name:"WAVE",usesGl:!0,init(t,e){k=t,Re=e,k&&!J&&(J=X(k,co),on=k.getUniformLocation(J,"u_video"),rn=k.getUniformLocation(J,"u_res"),an=k.getUniformLocation(J,"u_cell"),sn=k.getUniformLocation(J,"u_time"),ln=k.getUniformLocation(J,"u_mirror"))},render(t){k&&t.videoTex?uo(t):ho(t)},dispose(){be=new Float32Array(0),Ye=null}},po=`#version 300 es
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
`;let Z=null,fe=null,cn=null,un=null,fn=null;function go(t){const e=Z;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(fe),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(cn,0),e.uniform1f(un,t.time),e.uniform1i(fn,t.mirror?1:0),te(e)}const Eo=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Se,j=null,vt,je=null;function xo(t){const{width:e,height:n,data:o}=t.sample;j||(j=document.createElement("canvas"),vt=j.getContext("2d")),(j.width!==e||j.height!==n)&&(j.width=e,j.height=n,je=vt.createImageData(e,n));const a=je.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){const c=(i*e+l)*4,u=(Math.random()-.5)*.16,f=ge(o[c],o[c+1],o[c+2])/255+u,d=Eo[f<.3?0:f<.52?1:f<.72?2:3];a[c]=d[0],a[c+1]=d[1],a[c+2]=d[2],a[c+3]=255}vt.putImageData(je,0,0);const{width:r,height:s}=Se.canvas;Se.imageSmoothingEnabled=!1,Se.drawImage(j,0,0,r,s),Se.imageSmoothingEnabled=!0}const _o={id:"riso",name:"RISO",usesGl:!0,init(t,e){Z=t,Se=e,Z&&!fe&&(fe=X(Z,po),cn=Z.getUniformLocation(fe,"u_video"),un=Z.getUniformLocation(fe,"u_time"),fn=Z.getUniformLocation(fe,"u_mirror"))},render(t){Z&&t.videoTex?go(t):xo(t)},dispose(){je=null}},To=`#version 300 es
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
`,wo=`#version 300 es
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
`,pt=200,he={wave:1,trail:.14},gt=[1,2,3.5,.4],yo=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Ro=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let L=null,B=null,bt=null,dn=null,mn=null,hn=null,vn=null,pn=null,gn=null,En=null,St=null,xn=null,D=null,Ae=!0;function bo(t){const e=L,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!D||D.width!==n||D.height!==o)&&(D&&Zt(e,D),D=ro(e,n,o),Ae=!0),e.bindFramebuffer(e.FRAMEBUFFER,D.framebuffer),e.viewport(0,0,n,o),Ae&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),Ae=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(bt),e.uniform1f(En,he.trail),te(e);const a=Math.max(2,Math.round(pt*t.video.videoHeight/t.video.videoWidth));e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(dn,0),e.uniform2f(mn,pt,a),e.uniform2f(hn,n,o),e.uniform1f(vn,t.time),e.uniform1f(pn,he.wave),e.uniform1i(gn,t.mirror?1:0),e.drawArrays(e.POINTS,0,pt*a),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(St),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,D.texture),e.uniform1i(xn,0),te(e)}const Wt=2;let Lt,H=null,oe,Me=!0;function So(t){const{width:e,height:n}=Lt.canvas,{width:o,height:a,data:r}=t.sample;H||(H=document.createElement("canvas"),oe=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,Me=!0),Me?(oe.fillStyle="#000",oe.fillRect(0,0,e,n),Me=!1):(oe.fillStyle=`rgba(0,0,0,${he.trail})`,oe.fillRect(0,0,e,n));const s=e/o,i=n/a,l=t.time,c=he.wave;for(let u=0;u<a;u+=Wt)for(let f=0;f<o;f+=Wt){const d=(u*o+f)*4,m=ge(r[d],r[d+1],r[d+2])/255;if(m<.04)continue;const x=Math.sin(l*2+f*.35+u*.18)*(1+m*5)*s*.6*c,T=Math.cos(l*1.6+u*.28+f*.11)*(1+m*3)*i*.4*c,S=Math.round(24+m*60),R=Math.round(90+m*150),w=Math.round(200+m*55),_=(.6+m*2.6)*s*.5;oe.fillStyle=`rgba(${S},${R},${w},${.2+m*.8})`,oe.fillRect(f*s+x,u*i+T,_,_)}Lt.drawImage(H,0,0)}const Lo={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){L=t,Lt=e,Me=!0,Ae=!0,L&&!B&&(B=X(L,wo,To),dn=L.getUniformLocation(B,"u_video"),mn=L.getUniformLocation(B,"u_grid"),hn=L.getUniformLocation(B,"u_res"),vn=L.getUniformLocation(B,"u_time"),pn=L.getUniformLocation(B,"u_wave"),gn=L.getUniformLocation(B,"u_mirror"),bt=X(L,yo),En=L.getUniformLocation(bt,"u_alpha"),St=X(L,Ro),xn=L.getUniformLocation(St,"u_tex"))},render(t){L&&t.videoTex?bo(t):So(t)},dispose(){L&&D&&Zt(L,D),D=null,H=null,Me=!0,Ae=!0},onReselect(){const t=gt.indexOf(he.wave);he.wave=gt[(t+1)%gt.length]}},Po=`#version 300 es
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
`;let tt=!1,I=null,W=null,_n=null,Tn=null,wn=null,yn=null,Rn=null,bn=null;function Co(t){const e=I,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(W),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(_n,0),e.uniform2f(Tn,n,o),e.uniform1f(wn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(yn,t.time),e.uniform1i(Rn,t.mirror?1:0),e.uniform1i(bn,tt?1:0),te(e)}const Ao=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Mo={r:238,g:244,b:250},Uo={r:22,g:72,b:158},Fo=.12;let Le,z=null,Et,ze=null;function Io(t){const{width:e,height:n,data:o}=t.sample;z||(z=document.createElement("canvas"),Et=z.getContext("2d")),(z.width!==e||z.height!==n)&&(z.width=e,z.height=n,ze=Et.createImageData(e,n));const a=ze.data;for(let i=0;i<n;i++){const l=Ao[i&3];for(let c=0;c<e;c++){const u=(i*e+c)*4;let d=ge(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*Fo>l[c&3];tt&&(d=!d);const m=d?Mo:Uo;a[u]=m.r,a[u+1]=m.g,a[u+2]=m.b,a[u+3]=255}}Et.putImageData(ze,0,0);const{width:r,height:s}=Le.canvas;Le.imageSmoothingEnabled=!1,Le.drawImage(z,0,0,r,s),Le.imageSmoothingEnabled=!0}const Do={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){I=t,Le=e,I&&!W&&(W=X(I,Po),_n=I.getUniformLocation(W,"u_video"),Tn=I.getUniformLocation(W,"u_res"),wn=I.getUniformLocation(W,"u_cell"),yn=I.getUniformLocation(W,"u_time"),Rn=I.getUniformLocation(W,"u_mirror"),bn=I.getUniformLocation(W,"u_invert"))},render(t){I&&t.videoTex?Co(t):Io(t)},dispose(){ze=null},onReselect(){tt=!tt}},$o=`#version 300 es
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
`,Ue=60,Sn=480,Ln=270,ko=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let P=null,Ke=null,Q=null,Pn=null,Cn=null,An=null,Mn=null,Un=null,Fn=null,In=null,ee=null,Fe=null,de=-1,Ie=0;function Oo(t){ee=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,ee),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,Sn,Ln,Ue),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Fe=t.createFramebuffer(),de=-1,Ie=0}function No(){P&&(ee&&P.deleteTexture(ee),Fe&&P.deleteFramebuffer(Fe),ee=null,Fe=null,de=-1,Ie=0)}function Bo(t){const e=P;de=(de+1)%Ue,Ie=Math.min(Ie+1,Ue),e.bindFramebuffer(e.FRAMEBUFFER,Fe),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,ee,0,de),e.viewport(0,0,Sn,Ln),e.useProgram(Ke),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Pn,0),te(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(Q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,ee),e.uniform1i(Cn,0),e.uniform1f(An,de),e.uniform1f(Mn,Ue),e.uniform1f(Un,Ie),e.uniform1f(Fn,t.beat),e.uniform1i(In,t.mirror?1:0),te(e)}let Je,K=null,xt,Ze=null,ie=[];function Ho(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),xt=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,Ze=xt.createImageData(e,n),ie=[]),ie.push(new Uint8ClampedArray(o)),ie.length>Ue&&ie.shift();const a=ie.length-1,r=Ze.data;for(let l=0;l<n;l++){let c=l/Math.max(1,n-1)*a;c+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(a,Math.max(0,c))),f=ie[a-u],d=l*e*4;r.set(f.subarray(d,d+e*4),d)}xt.putImageData(Ze,0,0);const{width:s,height:i}=Je.canvas;Je.imageSmoothingEnabled=!0,Je.drawImage(K,0,0,s,i)}const Wo={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){P=t,Je=e,P&&(Ke||(Ke=X(P,ko),Pn=P.getUniformLocation(Ke,"u_video"),Q=X(P,$o),Cn=P.getUniformLocation(Q,"u_history"),An=P.getUniformLocation(Q,"u_head"),Mn=P.getUniformLocation(Q,"u_layers"),Un=P.getUniformLocation(Q,"u_filled"),Fn=P.getUniformLocation(Q,"u_beat"),In=P.getUniformLocation(Q,"u_mirror")),Oo(P))},render(t){P&&t.videoTex&&ee?Bo(t):Ho(t)},dispose(){No(),ie=[],Ze=null}},Pt=[no,lo,vo,_o,Lo,Do,Wo];function ge(t,e,n){return .2126*t+.7152*e+.0722*n}function Go(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,a=0;return{gl:e,videoTex:n,uploadVideo(r){const s=r.videoWidth,i=r.videoHeight;s===0||i===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||i!==a?(o=s,a=i,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const Xo="modulepreload",Vo=function(t,e){return new URL(t,e).href},Gt={},qo=function(e,n,o){let a=Promise.resolve();if(n&&n.length>0){let c=function(u){return Promise.all(u.map(f=>Promise.resolve(f).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");a=c(n.map(u=>{if(u=Vo(u,o),u in Gt)return;Gt[u]=!0;const f=u.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(o)for(let x=s.length-1;x>=0;x--){const T=s[x];if(T.href===u&&(!f||T.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${d}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":Xo,f||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),f)return new Promise((x,T)=>{m.addEventListener("load",x),m.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return a.then(s=>{for(const i of s||[])i.status==="rejected"&&r(i.reason);return e().catch(r)})};let se="off",ve=null,Ct=-1,At=0,nt={hands:0,pinching:0,points:[],corners:null};const Xt=.4,Yo=.6,Vt=2,Pe=new Map,jo=1100,zo=3,qt=.05,Ko=1500,Ce=new Map;let ot=!1,Yt=0;function Jo(){const t=ot;return ot=!1,t}function Mt(){return se}function ke(){return nt}async function Dn(){if(se==="off"){se="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await qo(async()=>{const{FilesetResolver:r,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),a=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{ve=await e.createFromOptions(o,a("GPU"))}catch{ve=await e.createFromOptions(o,a("CPU"))}se="on"}catch(t){throw se="off",t}}}function Zo(){ve?.close(),ve=null,se="off",Ct=-1,At=0,Pe.clear(),Ce.clear(),ot=!1,nt={hands:0,pinching:0,points:[],corners:null}}function Qo(t,e){if(se!=="on"||!ve||t.currentTime===Ct)return;const n=nt.hands>0?33:100;if(e-At<n)return;Ct=t.currentTime,At=e;const o=ve.detectForVideo(t,e),a=[],r=o.landmarks?.length??0,s=t.videoWidth||1280,i=t.videoHeight||720,l=(f,d)=>Math.hypot((f.x-d.x)*s,(f.y-d.y)*i),c=new Set;for(let f=0;f<r;f++){const d=o.landmarks[f];let m=o.handednesses?.[f]?.[0]?.categoryName??`hand${f}`;c.has(m)&&(m=`${m}${f}`),c.add(m);const x=d[4],T=d[8],S=l(d[5],d[17]),w=l(x,T)/Math.max(S,1e-6);let _=Pe.get(m);_||(_={down:!1,onFrames:0,offFrames:0},Pe.set(m,_)),w<Xt?(_.onFrames++,_.offFrames=0,_.onFrames>=Vt&&(_.down=!0)):w>Yo?(_.offFrames++,_.onFrames=0,_.offFrames>=Vt&&(_.down=!1)):(_.onFrames=0,_.offFrames=0);let $=0;for(const[O,U]of[[8,6],[12,10],[16,14],[20,18]])l(d[0],d[O])>l(d[0],d[U])*1.15&&$++;const M=$>=3;let E=Ce.get(m);if(E||(E={dir:0,extreme:d[9].x*s,reversals:[]},Ce.set(m,E)),M&&!_.down){const O=d[9].x*s,U=O-E.extreme;E.dir===0?Math.abs(U)>qt*s&&(E.dir=Math.sign(U),E.extreme=O):Math.sign(U)===E.dir?E.extreme=O:Math.abs(U)>qt*s&&(E.dir=Math.sign(U),E.extreme=O,E.reversals.push(e),E.reversals=E.reversals.filter(V=>e-V<jo),E.reversals.length>=zo&&e>Yt&&(ot=!0,Yt=e+Ko,E.reversals=[]))}else E.dir=0,E.extreme=d[9].x*s,E.reversals=[];a.push({handedness:m,thumb:{x:x.x,y:x.y},index:{x:T.x,y:T.y},threshold:Xt*S/s,ratio:w,pinching:_.down,open:M,x:(x.x+T.x)/2,y:(x.y+T.y)/2})}for(const f of[...Pe.keys()])c.has(f)||Pe.delete(f);for(const f of[...Ce.keys()])c.has(f)||Ce.delete(f);const u=a.filter(f=>f.pinching);nt={hands:r,pinching:u.length,points:a,corners:u.length>=2?[u[0],u[1]]:null}}function $n(t,e,n,o){const a=Math.max(n/t,o/e),r=t*a,s=e*a;return{x:(n-r)/2,y:(o-s)/2,w:r,h:s}}function rt(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function kn(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const Qe={minDist:1.5,baseWidth:6,maxPoints:2e4,bufferMs:250},er=["#ffffff","#141414","#8a8a8a","#1f6bff","#9cc3ff"];let tr=er[0];const le=new Map,ne=[];let pe=0,C=null,A=null;function nr(){A&&(A.lineCap="round",A.lineJoin="round")}function or(t,e){if(C||(C=document.createElement("canvas"),A=C.getContext("2d")),C.width===t&&C.height===e)return;const n=C.width,o=C.height;if(n>0&&o>0){const a=t/n,r=e/o,s=(a+r)/2;for(const i of ne)for(const l of i.pts)l.x*=a,l.y*=r,l.w*=s}C.width=t,C.height=e,nr(),Dt()}function On(t,e,n){const o=e.pts;if(t.strokeStyle=e.color,t.lineCap="round",t.lineJoin="round",n===1){t.lineWidth=o[1].w,t.beginPath(),t.moveTo(o[0].x,o[0].y),t.lineTo((o[0].x+o[1].x)/2,(o[0].y+o[1].y)/2),t.stroke();return}const a=o[n-2],r=o[n-1],s=o[n],i={x:(a.x+r.x)/2,y:(a.y+r.y)/2},l={x:(r.x+s.x)/2,y:(r.y+s.y)/2};t.lineWidth=r.w,t.beginPath(),t.moveTo(i.x,i.y),t.quadraticCurveTo(r.x,r.y,l.x,l.y),t.stroke()}function Nn(t,e){const n=e.pts[0];t.fillStyle=e.color,t.beginPath(),t.arc(n.x,n.y,n.w/2,0,Math.PI*2),t.fill()}function It(t,e){if(e.pts.length!==0){if(e.pts.length===1){Nn(t,e);return}for(let n=1;n<e.pts.length;n++)On(t,e,n)}}function Dt(){if(!(!C||!A)){A.clearRect(0,0,C.width,C.height);for(const t of ne)It(A,t)}}function Bn(t){!t.stroke||!A||(t.pendingSince=-1,It(A,t.stroke),t.inked=t.stroke.pts.length,ne.push(t.stroke))}function _t(t){t.stroke&&t.pendingSince>=0&&Bn(t),t.stroke&&t.stroke.pts.length===1&&A&&Nn(A,t.stroke),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Hn(t){pe-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function rr(){let t=!1;for(;pe>Qe.maxPoints&&ne.length>0;)pe-=ne.shift().pts.length,t=!0;t&&Dt()}function ir(t,e,n,o,a){const r=new Set;for(const s of t){r.add(s.handedness);let i=le.get(s.handedness);if(i||(i={drawing:!1,stroke:null,pendingSince:-1,inked:0},le.set(s.handedness,i)),o&&i.drawing){i.pendingSince>=0?Hn(i):_t(i);continue}if(i.drawing&&!s.pinching){_t(i);continue}if(!i.drawing&&s.pinching&&!o&&(i.drawing=!0,i.stroke={color:tr,pts:[]},i.pendingSince=a,i.inked=0),!i.drawing||!i.stroke)continue;const l=kn(rt(s.thumb,e,n),rt(s.index,e,n)),c=i.stroke.pts[i.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=Qe.minDist)&&(i.stroke.pts.push({x:l.x,y:l.y,w:Qe.baseWidth}),pe++),i.pendingSince>=0)a-i.pendingSince>Qe.bufferMs&&Bn(i);else if(A)for(;i.inked<i.stroke.pts.length;)i.inked++,i.inked>=2&&On(A,i.stroke,i.inked-1)}for(const[s,i]of le)!r.has(s)&&i.drawing&&_t(i);rr()}function ar(t){C&&(ne.length>0||sr())&&t.drawImage(C,0,0);for(const e of le.values())e.drawing&&e.pendingSince>=0&&e.stroke&&It(t,e.stroke)}function sr(){for(const t of le.values())if(t.drawing)return!0;return!1}function Wn(t){return le.get(t)?.drawing??!1}function lr(){for(const t of le.values())Hn(t);ne.length=0,pe=0,Dt()}function cr(){return{strokes:ne.length,points:pe}}const jt=128,ur=2,Tt=[90,100,110,120,128,140],Oe=.08,fr=400,dr=150;let v,g=null,p,it,Gn,at,ae=null,wt=!1,yt=!1,De=null,Ut=0;const st=document.createElement("canvas"),ue=st.getContext("2d",{willReadFrequently:!0}),me=new Jn,$e=new Jt;let Xn=0;const mr=new ImageData(2,2),F=[];let b=null,Ee=0,zt=0,Te=null;const lt=new Set;function ce(){return Pt[Ee%Pt.length]}function $t(t){lt.has(t.id)||(t.init(ae?.gl??null,Gn),lt.add(t.id))}function ct(){const t=new Set;for(const e of F)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...lt])t.has(e)||(Pt.find(n=>n.id===e)?.dispose(),lt.delete(e))}function hr(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const Ne=.06;function vr(t){const e=t.map(s=>({x:g.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),a=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return n<Ne&&(n=0),a<Ne&&(a=0),o>1-Ne&&(o=1),r>1-Ne&&(r=1),o-n<Oe&&(o=n+Oe),r-a<Oe&&(r=a+Oe),{x0:n,y0:a,x1:o,y1:r}}function pr(t){const e=ke();if(e.corners&&g){zt=t;const n=vr(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(Te===null&&(Te=t),t-Te<dr)return;Te=null,b={rect:n,effect:ce()},Ee++,$t(b.effect),v.setFxLabel(b.effect.name)}return}Te=null,b&&t-zt>fr&&(Vn(b),b=null)}function Vn(t){for(let e=F.length-1;e>=0;e--)hr(t.rect,F[e].rect)&&F.splice(e,1);F.push(t),ct(),v.setFxLabel(`NEXT ${ce().name}`)}function kt(){if(!g)return;const t=g.video.videoWidth||4,e=g.video.videoHeight||3,n=16,o=4,a=Math.max(64,window.innerWidth-n*2-o),r=Math.max(64,window.innerHeight-n*2-o-v.chromeHeight()),s=Math.min(a/t,r/e),i=Math.round(t*s),l=Math.round(e*s),c=Math.min(ur,window.devicePixelRatio||1);v.canvas.style.width=`${i}px`,v.canvas.style.height=`${l}px`,v.setDeviceWidth(i);for(const u of[v.canvas,it,at])u.width=Math.round(i*c),u.height=Math.round(l*c);or(v.canvas.width,v.canvas.height),st.width=jt,st.height=Math.max(2,Math.round(jt*e/t))}function gr(){const{width:t,height:e}=st;return ue.save(),g.mirror&&(ue.translate(t,0),ue.scale(-1,1)),ue.drawImage(g.video,0,0,t,e),ue.restore(),ue.getImageData(0,0,t,e)}function Er(){const{width:t,height:e}=v.canvas;p.save(),g.mirror&&(p.translate(t,0),p.scale(-1,1)),p.drawImage(g.video,0,0,t,e),p.restore()}function Kt(t,e,n){const{width:o,height:a}=v.canvas,r=t.rect.x0*o,s=t.rect.y0*a,i=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*a;p.drawImage(e,r,s,i,l,r,s,i,l),p.strokeStyle="#ffffff",p.lineWidth=Math.max(2,o/640),n&&p.setLineDash([10,8]),p.strokeRect(r,s,i,l),p.setLineDash([])}function xr(t){Er();const e=F.map(i=>({f:i,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:i})=>i.effect.usesGl&&ae),o=e.some(({f:i})=>!(i.effect.usesGl&&ae));n&&ae.uploadVideo(g.video);const a={videoTex:n?ae.videoTex:null,sample:o?gr():mr,video:g.video,mirror:g.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,s=null;for(const{f:i,isDrawing:l}of e)!!i.effect.usesGl&&!!ae?(s!==i.effect&&(i.effect.render(a),s=i.effect),Kt(i,at,l)):(r!==i.effect&&(i.effect.render(a),r=i.effect),Kt(i,it,l))}function _r(){const t=ke();if(t.points.length===0||!g)return;const{width:e,height:n}=v.canvas,o=$n(g.video.videoWidth||4,g.video.videoHeight||3,e,n);p.lineWidth=Math.max(2,e/500);for(const a of t.points){const r=rt(a.thumb,o,g.mirror),s=rt(a.index,o,g.mirror),l=Wn(a.handedness)?"#28c840":a.pinching?"#1f6bff":"#ffffff";p.strokeStyle=l,p.save(),p.lineWidth=Math.max(1,e/900),p.beginPath(),p.moveTo(r.x,r.y),p.lineTo(s.x,s.y),p.stroke(),p.restore();const c=Math.max(8,a.threshold*o.w/2);for(const f of[r,s])p.beginPath(),p.arc(f.x,f.y,c,0,Math.PI*2),p.stroke();const u=kn(r,s);p.beginPath(),p.arc(u.x,u.y,Math.max(3,e/240),0,Math.PI*2),p.fillStyle=l,p.fill()}}function Tr(){if(!De)return;const t=ke(),e=cr(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.open?"OPEN ":"  -  "} ${Wn(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),De.textContent=n.join(`
`)}function qn(t){requestAnimationFrame(qn);const e=me.tick(t),n=g!==null&&g.video.readyState>=2;if(n&&(Qo(g.video,t),Jo()&&Sr(t),pr(t)),e.playing&&n){const o=ke(),a=b!==null||o.pinching>=2,r=$n(g.video.videoWidth||4,g.video.videoHeight||3,v.canvas.width,v.canvas.height);ir(o.points,r,g.mirror,a,t),xr(e),ar(p),_r(),t<Ut&&(p.fillStyle=`rgba(255,255,255,${.8*(Ut-t)/280})`,p.fillRect(0,0,v.canvas.width,v.canvas.height)),Tr()}$e.captureFrame(v.canvas),$e.recording&&v.setRecordTime((t-Xn)/1e3),v.setHands(Mt(),ke().hands>0),v.setTransport(e.frame,e.fps,e.bpm,e.playing)}function Yn(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function wr(){if(!g||!Jt.supported())return;if(!$e.recording){$e.start(v.canvas),Xn=performance.now(),v.setRecording(!0);return}v.setRecording(!1);const t=await $e.stop();t&&Yn(t.blob,`null8_${me.timecode().replaceAll(":","")}.${t.ext}`)}async function yr(){if(Mt()!=="loading"){if(Mt()==="on"){Zo();return}v.setHands("loading",!1);try{await Dn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Rr(){if(!g||yt)return;yt=!0;const t=g.facing;try{g=await zn(g)}catch{g=await Ft(t)}finally{yt=!1}kt()}function br(){v.canvas.toBlob(t=>{t&&Yn(t,`null8_${me.timecode().replaceAll(":","")}.png`)},"image/png")}function Sr(t){F.length=0,b=null,lr(),ct(),Ee=0,v.setFxLabel(`NEXT ${ce().name}`),Ut=t+280}function Lr(){F.length>0?(F.pop(),ct()):Ee++,v.setFxLabel(`NEXT ${ce().name}`)}async function Pr(){if(!(g||wt)){wt=!0;try{g=await Ft("user"),v.hideStartOverlay(),kt(),requestAnimationFrame(qn),Dn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=ce();Ee++,$t(e),F.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),v.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);v.showStartError(e),wt=!1}}}function Cr(){const t=document.getElementById("app");v=Zn(t,{onStart:()=>{Pr()},onCanvasTap:Lr,onPlayToggle:()=>me.toggle(),onSnapshot:br,onTempoTap:()=>{const e=Tt.indexOf(me.bpm);me.bpm=Tt[(e+1)%Tt.length]},onRecordToggle:()=>{wr()},onCameraFlip:()=>{Rr()},onHandsToggle:()=>{yr()}}),p=v.canvas.getContext("2d"),it=document.createElement("canvas"),Gn=it.getContext("2d"),at=document.createElement("canvas"),ae=Go(at),v.setFxLabel(`NEXT ${ce().name}`),window.addEventListener("resize",kt),new URLSearchParams(location.search).has("debug")&&(De=document.createElement("pre"),De.className="debug-hud",document.body.appendChild(De)),window.__null8={addFrame(e){const n=ce();Ee++,$t(n),Vn({rect:e,effect:n})},clearFrames(){F.length=0,ct()},get frames(){return F.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Cr();
