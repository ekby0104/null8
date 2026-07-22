(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();async function vt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function yn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function bn(t){const e=t.facing==="user"?"environment":"user";return yn(t),vt(e)}const Ln=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class Mt{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=Ln.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",i=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:i}}}const yt=60;class Cn{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,i=Math.floor(e)%60,r=Math.floor(e*yt)%yt,l=a=>String(a).padStart(2,"0");return`${l(n)}:${l(o)}:${l(i)}:${l(r)}`}}function d(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function Sn(t,e){const n=d("header","titlebar"),o=d("div","traffic");for(const p of["r","y","g"])o.appendChild(d("span",p));const i=d("div","path","/project1/null8 (128,128)");n.append(o,i,d("div","spacer"));const r=d("div","viewport"),l=d("canvas");r.appendChild(l),r.addEventListener("click",()=>e.onCanvasTap());const a=d("div","start-overlay"),c=d("div","pulse"),s=d("div","big","TAP TO START"),u=d("div","sub",`webcam access required
HTTPS or localhost only`);a.append(c,s,u),a.addEventListener("click",p=>{p.stopPropagation(),e.onStart()}),r.appendChild(a);const m=d("footer","transport"),f=d("div","group"),h=d("span","lcd","00:00:00:00");f.append(d("span","label","Timecode"),h,d("span","label","(60fps)"));const T=d("div","group"),R=d("span","lcd small","0");T.append(d("span","label","F"),R);const w=d("button","on","PAUSE");w.title="play / pause",w.addEventListener("click",()=>e.onPlayToggle());const _=d("button",void 0,"PHOTO CAPTURE");_.title="photo capture",_.addEventListener("click",()=>e.onSnapshot());const E=d("button","rec-btn","RECORD START");E.title="record video",E.addEventListener("click",()=>e.onRecordToggle());const L=d("div","group"),H=d("span","lcd small","00:00");L.append(d("span","label","REC"),H),L.style.display="none";const M=d("div","group"),D=d("span","lcd small","—");M.append(d("span","label","FX"),D);const _t=d("div","group"),xt=d("span","lcd small","60.0");_t.append(d("span","label","FPS"),xt);const Rt=d("div","group"),Ce=d("span","lcd small","120");Ce.style.cursor="pointer",Ce.addEventListener("click",()=>e.onTempoTap()),Rt.append(d("span","label","Tempo"),Ce,d("span","label","BPM"));const oe=d("button","hands-btn","✋︎");oe.title="hand tracking",oe.addEventListener("click",()=>e.onHandsToggle());const je=d("button",void 0,"⇄");je.title="switch camera",je.addEventListener("click",()=>e.onCameraFlip()),m.append(f,T,w,_,E,L,M,d("div","push"),_t,Rt,oe,je);const ze=d("div","device");return ze.append(n,r,m),t.append(ze),{canvas:l,chromeHeight(){return n.offsetHeight+m.offsetHeight},setDeviceWidth(p){ze.style.width=`${p+4}px`},hideStartOverlay(){a.classList.add("hidden")},showStartError(p){s.textContent="CAMERA ERROR",u.textContent=p,c.style.animationDuration="0.4s"},setFxLabel(p){D.textContent=p},setTransport(p,de,Ke,wn,wt){h.textContent=p,R.textContent=String(de).padStart(6,"0"),xt.textContent=Ke.toFixed(1),Ce.textContent=String(wn),w.textContent=wt?"PAUSE":"PLAY",w.classList.toggle("on",wt)},setRecording(p){E.textContent=p?"RECORD STOP":"RECORD START",E.classList.toggle("recording",p),h.classList.toggle("rec",p),L.style.display=p?"flex":"none",p||(H.textContent="00:00")},setRecordTime(p){const de=Math.floor(p/60),Ke=Math.floor(p)%60;H.textContent=`${String(de).padStart(2,"0")}:${String(Ke).padStart(2,"0")}`},setHands(p,de){oe.classList.toggle("loading",p==="loading"),oe.classList.toggle("on",p==="on"),oe.classList.toggle("detect",p==="on"&&de)}}}const An=6,bt=2;let O,Xe=0,lt=0,Ae=new Float64Array(0),Ue=new Float64Array(0),Pe=new Float64Array(0),Me=new Float64Array(0),De=new Float64Array(0);function Un(t){const{width:e,height:n,data:o}=t;if(e!==Xe||n!==lt){Xe=e,lt=n;const r=(e+1)*(n+1);Ae=new Float64Array(r),Ue=new Float64Array(r),Pe=new Float64Array(r),Me=new Float64Array(r),De=new Float64Array(r)}const i=e+1;for(let r=0;r<n;r++){let l=0,a=0,c=0,s=0,u=0;for(let m=0;m<e;m++){const f=(r*e+m)*4,h=o[f],T=o[f+1],R=o[f+2],w=ue(h,T,R);l+=w,a+=w*w,c+=h,s+=T,u+=R;const _=(r+1)*i+(m+1),E=r*i+(m+1);Ae[_]=Ae[E]+l,Ue[_]=Ue[E]+a,Pe[_]=Pe[E]+c,Me[_]=Me[E]+s,De[_]=De[E]+u}}}function fe(t,e,n,o,i){const r=Xe+1;return t[(n+i)*r+(e+o)]-t[n*r+(e+o)]-t[(n+i)*r+e]+t[n*r+e]}function Pn(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function he(t,e,n,o,i,r,l,a,c){const s=n*o,u=fe(Ae,t,e,n,o)/s,m=fe(Ue,t,e,n,o)/s-u*u;if(i<An&&n>bt&&o>bt&&m>r){const M=n>>1,D=o>>1;he(t,e,M,D,i+1,r,l,a,c),he(t+M,e,n-M,D,i+1,r,l,a,c),he(t,e+D,M,o-D,i+1,r,l,a,c),he(t+M,e+D,n-M,o-D,i+1,r,l,a,c);return}const h=fe(Pe,t,e,n,o)/s,T=fe(Me,t,e,n,o)/s,R=fe(De,t,e,n,o)/s,w=Pn(t,e,Math.floor(c*2))<.025;O.fillStyle=w?"#2ea44f":`rgb(${Math.round(h)},${Math.round(T)},${Math.round(R)})`;const _=t*l,E=e*a,L=n*l,H=o*a;O.fillRect(_,E,L,H),O.strokeRect(_+.5,E+.5,L-1,H-1)}const Mn={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){O=e},render(t){const{width:e,height:n}=O.canvas,{width:o,height:i}=t.sample;Un(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);O.fillStyle="#000",O.fillRect(0,0,e,n),O.strokeStyle="#000",O.lineWidth=1,he(0,0,o,i,0,r,e/o,n/i,t.beat)},dispose(){Xe=0,lt=0}},Dn=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Lt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${i}`)}return o}function G(t,e,n=Dn){const o=Lt(t,t.VERTEX_SHADER,n),i=Lt(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,i),t.linkProgram(r),t.deleteShader(o),t.deleteShader(i),!t.getProgramParameter(r,t.LINK_STATUS)){const l=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${l}`)}return r}function K(t){t.drawArrays(t.TRIANGLES,0,3)}function Fn(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const i=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:i,texture:o,width:e,height:n}}function Dt(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const In=`#version 300 es
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
`;let F=null,Q=null,Ft=null,It=null,$t=null,Bt=null;function $n(t){const e=F;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(Q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Ft,0),e.uniform2f(It,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f($t,t.time),e.uniform1i(Bt,t.mirror?1:0),K(e)}let Fe,N=null,Ze,ve=new Float32Array(0),Ie=null;function Bn(t){const{width:e,height:n,data:o}=t.sample;N||(N=document.createElement("canvas"),Ze=N.getContext("2d")),(N.width!==e||N.height!==n)&&(N.width=e,N.height=n,ve=new Float32Array(e*n),Ie=Ze.createImageData(e,n));for(let a=0,c=0;a<e*n;a++,c+=4)ve[a]=ue(o[c],o[c+1],o[c+2])/255;const i=Ie.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){let s=0;c>0&&c<e-1&&a>0&&a<n-1&&(s=ve[(a-1)*e+(c-1)]-ve[(a+1)*e+(c+1)]);const u=(a*e+c)*4;i[u]=Math.min(255,Math.max(0,248-s*2.3*255)),i[u+1]=Math.min(255,Math.max(0,247-s*1.6*255)),i[u+2]=Math.min(255,Math.max(0,242-s*2.9*255)),i[u+3]=255}Ze.putImageData(Ie,0,0);const{width:r,height:l}=Fe.canvas;Fe.imageSmoothingEnabled=!0,Fe.drawImage(N,0,0,r,l)}const On={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){F=t,Fe=e,F&&!Q&&(Q=G(F,In),Ft=F.getUniformLocation(Q,"u_video"),It=F.getUniformLocation(Q,"u_texel"),$t=F.getUniformLocation(Q,"u_time"),Bt=F.getUniformLocation(Q,"u_mirror"))},render(t){F&&t.videoTex?$n(t):Bn(t)},dispose(){ve=new Float32Array(0),Ie=null}},Gn=`#version 300 es
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
`;let P=null,Y=null,Ot=null,Gt=null,Ht=null,Nt=null,Xt=null;function Hn(t){const e=P,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(Y),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Ot,0),e.uniform2f(Gt,n,o),e.uniform1f(Ht,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(Nt,t.time),e.uniform1i(Xt,t.mirror?1:0),K(e)}const Nn=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Xn=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let pe,X=null,Qe,ge=new Float32Array(0),$e=null;function kn(t){const{width:e,height:n,data:o}=t.sample;X||(X=document.createElement("canvas"),Qe=X.getContext("2d")),(X.width!==e||X.height!==n)&&(X.width=e,X.height=n,ge=new Float32Array(e*n),$e=Qe.createImageData(e,n));for(let c=0,s=0;c<e*n;c++,s+=4)ge[c]=ue(o[s],o[s+1],o[s+2])/255;const i=t.time,r=$e.data;for(let c=0;c<n;c++){const s=c/n,u=Math.sin(s*58+i*2.4)*.55+Math.sin(s*21-i*1.6)*.45,m=Nn[c&3];for(let f=0;f<e;f++){const h=ge[c*e+f];let T=0;for(let E=0;E<4;E++){const L=Math.round(u*(.006+E*.014)*(.35+h)*e),H=Math.min(e-1,Math.max(0,f+L));T=Math.max(T,ge[c*e+H]*Math.pow(.7,E))}const R=T+(m[f&3]-.5)*.28,w=Xn[R>.72?0:R>.45?1:R>.24?2:3],_=(c*e+f)*4;r[_]=w[0],r[_+1]=w[1],r[_+2]=w[2],r[_+3]=255}}Qe.putImageData($e,0,0);const{width:l,height:a}=pe.canvas;pe.imageSmoothingEnabled=!1,pe.drawImage(X,0,0,l,a),pe.imageSmoothingEnabled=!0}const Wn={id:"wave",name:"WAVE",usesGl:!0,init(t,e){P=t,pe=e,P&&!Y&&(Y=G(P,Gn),Ot=P.getUniformLocation(Y,"u_video"),Gt=P.getUniformLocation(Y,"u_res"),Ht=P.getUniformLocation(Y,"u_cell"),Nt=P.getUniformLocation(Y,"u_time"),Xt=P.getUniformLocation(Y,"u_mirror"))},render(t){P&&t.videoTex?Hn(t):kn(t)},dispose(){ge=new Float32Array(0),$e=null}},Vn=`#version 300 es
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
`;let q=null,ie=null,kt=null,Wt=null,Vt=null;function Yn(t){const e=q;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ie),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(kt,0),e.uniform1f(Wt,t.time),e.uniform1i(Vt,t.mirror?1:0),K(e)}const qn=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Ee,k=null,Je,Be=null;function jn(t){const{width:e,height:n,data:o}=t.sample;k||(k=document.createElement("canvas"),Je=k.getContext("2d")),(k.width!==e||k.height!==n)&&(k.width=e,k.height=n,Be=Je.createImageData(e,n));const i=Be.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){const s=(a*e+c)*4,u=(Math.random()-.5)*.16,m=ue(o[s],o[s+1],o[s+2])/255+u,f=qn[m<.3?0:m<.52?1:m<.72?2:3];i[s]=f[0],i[s+1]=f[1],i[s+2]=f[2],i[s+3]=255}Je.putImageData(Be,0,0);const{width:r,height:l}=Ee.canvas;Ee.imageSmoothingEnabled=!1,Ee.drawImage(k,0,0,r,l),Ee.imageSmoothingEnabled=!0}const zn={id:"riso",name:"RISO",usesGl:!0,init(t,e){q=t,Ee=e,q&&!ie&&(ie=G(q,Vn),kt=q.getUniformLocation(ie,"u_video"),Wt=q.getUniformLocation(ie,"u_time"),Vt=q.getUniformLocation(ie,"u_mirror"))},render(t){q&&t.videoTex?Yn(t):jn(t)},dispose(){Be=null}},Kn=`#version 300 es
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
`,Zn=`#version 300 es
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
`,et=200,le={wave:1,trail:.14},tt=[1,2,3.5,.4],Qn=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Jn=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let y=null,I=null,ct=null,Yt=null,qt=null,jt=null,zt=null,Kt=null,Zt=null,Qt=null,st=null,Jt=null,A=null,_e=!0;function eo(t){const e=y,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!A||A.width!==n||A.height!==o)&&(A&&Dt(e,A),A=Fn(e,n,o),_e=!0),e.bindFramebuffer(e.FRAMEBUFFER,A.framebuffer),e.viewport(0,0,n,o),_e&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),_e=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(ct),e.uniform1f(Qt,le.trail),K(e);const i=Math.max(2,Math.round(et*t.video.videoHeight/t.video.videoWidth));e.useProgram(I),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Yt,0),e.uniform2f(qt,et,i),e.uniform2f(jt,n,o),e.uniform1f(zt,t.time),e.uniform1f(Kt,le.wave),e.uniform1i(Zt,t.mirror?1:0),e.drawArrays(e.POINTS,0,et*i),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(st),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,A.texture),e.uniform1i(Jt,0),K(e)}const Ct=2;let ut,$=null,Z,xe=!0;function to(t){const{width:e,height:n}=ut.canvas,{width:o,height:i,data:r}=t.sample;$||($=document.createElement("canvas"),Z=$.getContext("2d")),($.width!==e||$.height!==n)&&($.width=e,$.height=n,xe=!0),xe?(Z.fillStyle="#000",Z.fillRect(0,0,e,n),xe=!1):(Z.fillStyle=`rgba(0,0,0,${le.trail})`,Z.fillRect(0,0,e,n));const l=e/o,a=n/i,c=t.time,s=le.wave;for(let u=0;u<i;u+=Ct)for(let m=0;m<o;m+=Ct){const f=(u*o+m)*4,h=ue(r[f],r[f+1],r[f+2])/255;if(h<.04)continue;const T=Math.sin(c*2+m*.35+u*.18)*(1+h*5)*l*.6*s,R=Math.cos(c*1.6+u*.28+m*.11)*(1+h*3)*a*.4*s,w=Math.round(24+h*60),_=Math.round(90+h*150),E=Math.round(200+h*55),L=(.6+h*2.6)*l*.5;Z.fillStyle=`rgba(${w},${_},${E},${.2+h*.8})`,Z.fillRect(m*l+T,u*a+R,L,L)}ut.drawImage($,0,0)}const no={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){y=t,ut=e,xe=!0,_e=!0,y&&!I&&(I=G(y,Zn,Kn),Yt=y.getUniformLocation(I,"u_video"),qt=y.getUniformLocation(I,"u_grid"),jt=y.getUniformLocation(I,"u_res"),zt=y.getUniformLocation(I,"u_time"),Kt=y.getUniformLocation(I,"u_wave"),Zt=y.getUniformLocation(I,"u_mirror"),ct=G(y,Qn),Qt=y.getUniformLocation(ct,"u_alpha"),st=G(y,Jn),Jt=y.getUniformLocation(st,"u_tex"))},render(t){y&&t.videoTex?eo(t):to(t)},dispose(){y&&A&&Dt(y,A),A=null,$=null,xe=!0,_e=!0},onReselect(){const t=tt.indexOf(le.wave);le.wave=tt[(t+1)%tt.length]}},oo=`#version 300 es
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
`;let ke=!1,S=null,B=null,en=null,tn=null,nn=null,on=null,rn=null,an=null;function ro(t){const e=S,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(en,0),e.uniform2f(tn,n,o),e.uniform1f(nn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(on,t.time),e.uniform1i(rn,t.mirror?1:0),e.uniform1i(an,ke?1:0),K(e)}const io=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),ao={r:238,g:244,b:250},lo={r:22,g:72,b:158},co=.12;let Te,W=null,nt,Oe=null;function so(t){const{width:e,height:n,data:o}=t.sample;W||(W=document.createElement("canvas"),nt=W.getContext("2d")),(W.width!==e||W.height!==n)&&(W.width=e,W.height=n,Oe=nt.createImageData(e,n));const i=Oe.data;for(let a=0;a<n;a++){const c=io[a&3];for(let s=0;s<e;s++){const u=(a*e+s)*4;let f=ue(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*co>c[s&3];ke&&(f=!f);const h=f?ao:lo;i[u]=h.r,i[u+1]=h.g,i[u+2]=h.b,i[u+3]=255}}nt.putImageData(Oe,0,0);const{width:r,height:l}=Te.canvas;Te.imageSmoothingEnabled=!1,Te.drawImage(W,0,0,r,l),Te.imageSmoothingEnabled=!0}const uo={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){S=t,Te=e,S&&!B&&(B=G(S,oo),en=S.getUniformLocation(B,"u_video"),tn=S.getUniformLocation(B,"u_res"),nn=S.getUniformLocation(B,"u_cell"),on=S.getUniformLocation(B,"u_time"),rn=S.getUniformLocation(B,"u_mirror"),an=S.getUniformLocation(B,"u_invert"))},render(t){S&&t.videoTex?ro(t):so(t)},dispose(){Oe=null},onReselect(){ke=!ke}},fo=`#version 300 es
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
`,Re=60,ln=480,cn=270,mo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let b=null,Ge=null,j=null,sn=null,un=null,dn=null,fn=null,mn=null,hn=null,vn=null,z=null,we=null,ae=-1,ye=0;function ho(t){z=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,z),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,ln,cn,Re),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),we=t.createFramebuffer(),ae=-1,ye=0}function vo(){b&&(z&&b.deleteTexture(z),we&&b.deleteFramebuffer(we),z=null,we=null,ae=-1,ye=0)}function po(t){const e=b;ae=(ae+1)%Re,ye=Math.min(ye+1,Re),e.bindFramebuffer(e.FRAMEBUFFER,we),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,z,0,ae),e.viewport(0,0,ln,cn),e.useProgram(Ge),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(sn,0),K(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(j),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,z),e.uniform1i(un,0),e.uniform1f(dn,ae),e.uniform1f(fn,Re),e.uniform1f(mn,ye),e.uniform1f(hn,t.beat),e.uniform1i(vn,t.mirror?1:0),K(e)}let He,V=null,ot,Ne=null,J=[];function go(t){const{width:e,height:n,data:o}=t.sample;V||(V=document.createElement("canvas"),ot=V.getContext("2d")),(V.width!==e||V.height!==n)&&(V.width=e,V.height=n,Ne=ot.createImageData(e,n),J=[]),J.push(new Uint8ClampedArray(o)),J.length>Re&&J.shift();const i=J.length-1,r=Ne.data;for(let c=0;c<n;c++){let s=c/Math.max(1,n-1)*i;s+=Math.sin((1-c/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(i,Math.max(0,s))),m=J[i-u],f=c*e*4;r.set(m.subarray(f,f+e*4),f)}ot.putImageData(Ne,0,0);const{width:l,height:a}=He.canvas;He.imageSmoothingEnabled=!0,He.drawImage(V,0,0,l,a)}const Eo={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){b=t,He=e,b&&(Ge||(Ge=G(b,mo),sn=b.getUniformLocation(Ge,"u_video"),j=G(b,fo),un=b.getUniformLocation(j,"u_history"),dn=b.getUniformLocation(j,"u_head"),fn=b.getUniformLocation(j,"u_layers"),mn=b.getUniformLocation(j,"u_filled"),hn=b.getUniformLocation(j,"u_beat"),vn=b.getUniformLocation(j,"u_mirror")),ho(b))},render(t){b&&t.videoTex&&z?po(t):go(t)},dispose(){vo(),J=[],Ne=null}},dt=[Mn,On,Wn,zn,no,uo,Eo];function ue(t,e,n){return .2126*t+.7152*e+.0722*n}function To(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,i=0;return{gl:e,videoTex:n,uploadVideo(r){const l=r.videoWidth,a=r.videoHeight;l===0||a===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),l!==o||a!==i?(o=l,i=a,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const _o="modulepreload",xo=function(t,e){return new URL(t,e).href},St={},Ro=function(e,n,o){let i=Promise.resolve();if(n&&n.length>0){let s=function(u){return Promise.all(u.map(m=>Promise.resolve(m).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const l=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");i=s(n.map(u=>{if(u=xo(u,o),u in St)return;St[u]=!0;const m=u.endsWith(".css"),f=m?'[rel="stylesheet"]':"";if(o)for(let T=l.length-1;T>=0;T--){const R=l[T];if(R.href===u&&(!m||R.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const h=document.createElement("link");if(h.rel=m?"stylesheet":_o,m||(h.as="script"),h.crossOrigin="",h.href=u,c&&h.setAttribute("nonce",c),document.head.appendChild(h),m)return new Promise((T,R)=>{h.addEventListener("load",T),h.addEventListener("error",()=>R(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return i.then(l=>{for(const a of l||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};let te="off",ce=null,ft=-1,mt=0,pt={hands:0,pinching:0,corners:null};function ht(){return te}function pn(){return pt}async function gn(){if(te==="off"){te="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await Ro(async()=>{const{FilesetResolver:r,HandLandmarker:l}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:l}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),i=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2});try{ce=await e.createFromOptions(o,i("GPU"))}catch{ce=await e.createFromOptions(o,i("CPU"))}te="on"}catch(t){throw te="off",t}}}function wo(){ce?.close(),ce=null,te="off",ft=-1,mt=0,pt={hands:0,pinching:0,corners:null}}function yo(t,e){if(te!=="on"||!ce||t.currentTime===ft||e-mt<66)return;ft=t.currentTime,mt=e;const n=ce.detectForVideo(t,e),o=[],i=n.landmarks?.length??0;for(const r of n.landmarks??[]){const l=r[4],a=r[8],c=Math.hypot(r[0].x-r[9].x,r[0].y-r[9].y);Math.hypot(l.x-a.x,l.y-a.y)<Math.max(.02,c*.32)&&o.push({x:(l.x+a.x)/2,y:(l.y+a.y)/2})}pt={hands:i,pinching:o.length,corners:o.length>=2?[o[0],o[1]]:null}}const At=128,bo=2,rt=[90,100,110,120,128,140],Se=.08,Lo=400,Co=250;let v,g=null,C,We,En,Ve,ee=null,it=!1,at=!1;const Ye=document.createElement("canvas"),re=Ye.getContext("2d",{willReadFrequently:!0}),ne=new Cn,be=new Mt;let Tn=0;const So=new ImageData(2,2),U=[];let x=null,Le=0,Ut=0,me=null;const qe=new Set;function se(){return dt[Le%dt.length]}function gt(t){qe.has(t.id)||(t.init(ee?.gl??null,En),qe.add(t.id))}function Et(){const t=new Set;for(const e of U)t.add(e.effect.id);x&&t.add(x.effect.id);for(const e of[...qe])t.has(e)||(dt.find(n=>n.id===e)?.dispose(),qe.delete(e))}function Ao(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}function Uo(t){const e=t.map(l=>({x:g.mirror?1-l.x:l.x,y:l.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),i=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return o-n<Se&&(o=n+Se),r-i<Se&&(r=i+Se),{x0:n,y0:i,x1:o,y1:r}}function Po(t){const e=pn();if(e.corners&&g){Ut=t;const n=Uo(e.corners);if(x)x.rect.x0+=(n.x0-x.rect.x0)*.3,x.rect.y0+=(n.y0-x.rect.y0)*.3,x.rect.x1+=(n.x1-x.rect.x1)*.3,x.rect.y1+=(n.y1-x.rect.y1)*.3;else{if(me===null&&(me=t),t-me<Co)return;me=null,x={rect:n,effect:se()},Le++,gt(x.effect),v.setFxLabel(x.effect.name)}return}me=null,x&&t-Ut>Lo&&(_n(x),x=null)}function _n(t){for(let e=U.length-1;e>=0;e--)Ao(t.rect,U[e].rect)&&U.splice(e,1);U.push(t),Et(),v.setFxLabel(`NEXT ${se().name}`)}function Tt(){if(!g)return;const t=g.video.videoWidth||4,e=g.video.videoHeight||3,n=16,o=4,i=Math.max(64,window.innerWidth-n*2-o),r=Math.max(64,window.innerHeight-n*2-o-v.chromeHeight()),l=Math.min(i/t,r/e),a=Math.round(t*l),c=Math.round(e*l),s=Math.min(bo,window.devicePixelRatio||1);v.canvas.style.width=`${a}px`,v.canvas.style.height=`${c}px`,v.setDeviceWidth(a);for(const u of[v.canvas,We,Ve])u.width=Math.round(a*s),u.height=Math.round(c*s);Ye.width=At,Ye.height=Math.max(2,Math.round(At*e/t))}function Mo(){const{width:t,height:e}=Ye;return re.save(),g.mirror&&(re.translate(t,0),re.scale(-1,1)),re.drawImage(g.video,0,0,t,e),re.restore(),re.getImageData(0,0,t,e)}function Do(){const{width:t,height:e}=v.canvas;C.save(),g.mirror&&(C.translate(t,0),C.scale(-1,1)),C.drawImage(g.video,0,0,t,e),C.restore()}function Pt(t,e,n){const{width:o,height:i}=v.canvas,r=t.rect.x0*o,l=t.rect.y0*i,a=(t.rect.x1-t.rect.x0)*o,c=(t.rect.y1-t.rect.y0)*i;C.drawImage(e,r,l,a,c,r,l,a,c),C.strokeStyle="#ffffff",C.lineWidth=Math.max(2,o/640),n&&C.setLineDash([10,8]),C.strokeRect(r,l,a,c),C.setLineDash([])}function Fo(t){Do();const e=U.map(a=>({f:a,isDrawing:!1}));if(x&&e.push({f:x,isDrawing:!0}),e.length===0)return;const n=e.some(({f:a})=>a.effect.usesGl&&ee),o=e.some(({f:a})=>!(a.effect.usesGl&&ee));n&&ee.uploadVideo(g.video);const i={videoTex:n?ee.videoTex:null,sample:o?Mo():So,video:g.video,mirror:g.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,l=null;for(const{f:a,isDrawing:c}of e)!!a.effect.usesGl&&!!ee?(l!==a.effect&&(a.effect.render(i),l=a.effect),Pt(a,Ve,c)):(r!==a.effect&&(a.effect.render(i),r=a.effect),Pt(a,We,c))}function xn(t){requestAnimationFrame(xn);const e=ne.tick(t),n=g!==null&&g.video.readyState>=2;n&&(yo(g.video,t),Po(t)),e.playing&&n&&Fo(e),be.captureFrame(v.canvas),be.recording&&v.setRecordTime((t-Tn)/1e3),v.setHands(ht(),pn().hands>0),v.setTransport(ne.timecode(),e.frame,e.fps,e.bpm,e.playing)}function Rn(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Io(){if(!g||!Mt.supported())return;if(!be.recording){be.start(v.canvas),Tn=performance.now(),v.setRecording(!0);return}v.setRecording(!1);const t=await be.stop();t&&Rn(t.blob,`null8_${ne.timecode().replaceAll(":","")}.${t.ext}`)}async function $o(){if(ht()!=="loading"){if(ht()==="on"){wo();return}v.setHands("loading",!1);try{await gn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Bo(){if(!g||at)return;at=!0;const t=g.facing;try{g=await bn(g)}catch{g=await vt(t)}finally{at=!1}Tt()}function Oo(){v.canvas.toBlob(t=>{t&&Rn(t,`null8_${ne.timecode().replaceAll(":","")}.png`)},"image/png")}function Go(){U.length>0?(U.pop(),Et()):Le++,v.setFxLabel(`NEXT ${se().name}`)}async function Ho(){if(!(g||it)){it=!0;try{g=await vt("user"),v.hideStartOverlay(),Tt(),requestAnimationFrame(xn),gn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=se();Le++,gt(e),U.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),v.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);v.showStartError(e),it=!1}}}function No(){const t=document.getElementById("app");v=Sn(t,{onStart:()=>{Ho()},onCanvasTap:Go,onPlayToggle:()=>ne.toggle(),onSnapshot:Oo,onTempoTap:()=>{const e=rt.indexOf(ne.bpm);ne.bpm=rt[(e+1)%rt.length]},onRecordToggle:()=>{Io()},onCameraFlip:()=>{Bo()},onHandsToggle:()=>{$o()}}),C=v.canvas.getContext("2d"),We=document.createElement("canvas"),En=We.getContext("2d"),Ve=document.createElement("canvas"),ee=To(Ve),v.setFxLabel(`NEXT ${se().name}`),window.addEventListener("resize",Tt),window.__null8={addFrame(e){const n=se();Le++,gt(n),_n({rect:e,effect:n})},clearFrames(){U.length=0,Et()},get frames(){return U.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}No();
