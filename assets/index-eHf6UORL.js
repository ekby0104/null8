(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();async function Dt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function Zn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function Qn(t){const e=t.facing==="user"?"environment":"user";return Zn(t),Dt(e)}const eo=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class en{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=eo.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",i=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:i}}}const Wt=60;class to{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,i=Math.floor(e)%60,r=Math.floor(e*Wt)%Wt,s=a=>String(a).padStart(2,"0");return`${s(n)}:${s(o)}:${s(i)}:${s(r)}`}}function v(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function no(t,e){const n=v("header","titlebar"),o=v("div","traffic");for(const y of["r","y","g"])o.appendChild(v("span",y));const i=v("div","path","/project1/null8 (128,128)");n.append(o,i,v("div","spacer"));const r=v("div","viewport"),s=v("canvas");r.appendChild(s),r.addEventListener("click",()=>e.onCanvasTap());const a=v("div","start-overlay"),l=v("div","pulse"),u=v("div","big","TAP TO START"),f=v("div","sub",`webcam access required
HTTPS or localhost only`);a.append(l,u,f),a.addEventListener("click",y=>{y.stopPropagation(),e.onStart()}),r.appendChild(a);const c=v("footer","transport"),d=v("div","group"),m=v("span","lcd small","0");d.append(v("span","label","F"),m);const E=v("button","on","PAUSE");E.title="play / pause",E.addEventListener("click",()=>e.onPlayToggle());const _=v("button",void 0,"PHOTO CAPTURE");_.title="photo capture",_.addEventListener("click",()=>e.onSnapshot());const S=v("button","rec-btn","RECORD START");S.title="record video",S.addEventListener("click",()=>e.onRecordToggle());const R=v("div","group"),T=v("span","lcd small","00:00");R.append(v("span","label","REC"),T),R.style.display="none";const C=v("div","group"),O=v("span","lcd small","—");C.append(v("span","label","FX"),O);const A=v("div","group"),x=v("span","lcd small","60.0");A.append(v("span","label","FPS"),x);const w=v("div","group"),H=v("span","lcd small","120");H.style.cursor="pointer",H.addEventListener("click",()=>e.onTempoTap()),w.append(v("span","label","Tempo"),H,v("span","label","BPM"));const I=v("button","hands-btn","✋︎");I.title="hand tracking",I.addEventListener("click",()=>e.onHandsToggle());const D=v("button",void 0,"⇄");D.title="switch camera",D.addEventListener("click",()=>e.onCameraFlip()),c.append(C,E,_,S,R,v("div","push"),d,A,w,I,D);const Te=v("div","device");return Te.append(n,r,c),t.append(Te),{canvas:s,chromeHeight(){return n.offsetHeight+c.offsetHeight},setDeviceWidth(y){Te.style.width=`${y+4}px`},hideStartOverlay(){a.classList.add("hidden")},showStartError(y){u.textContent="CAMERA ERROR",f.textContent=y,l.style.animationDuration="0.4s"},setFxLabel(y){O.textContent=y},setTransport(y,ye,vt,Ht){m.textContent=String(y).padStart(6,"0"),x.textContent=ye.toFixed(1),H.textContent=String(vt),E.textContent=Ht?"PAUSE":"PLAY",E.classList.toggle("on",Ht)},setRecording(y){S.textContent=y?"RECORD STOP":"RECORD START",S.classList.toggle("recording",y),T.classList.toggle("rec",y),R.style.display=y?"flex":"none",y||(T.textContent="00:00")},setRecordTime(y){const ye=Math.floor(y/60),vt=Math.floor(y)%60;T.textContent=`${String(ye).padStart(2,"0")}:${String(vt).padStart(2,"0")}`},setHands(y,ye){I.classList.toggle("loading",y==="loading"),I.classList.toggle("on",y==="on"),I.classList.toggle("detect",y==="on"&&ye)}}}const oo=6,Bt=2;let V,it=0,Pt=0,Xe=new Float64Array(0),Ve=new Float64Array(0),qe=new Float64Array(0),Ye=new Float64Array(0),je=new Float64Array(0);function ro(t){const{width:e,height:n,data:o}=t;if(e!==it||n!==Pt){it=e,Pt=n;const r=(e+1)*(n+1);Xe=new Float64Array(r),Ve=new Float64Array(r),qe=new Float64Array(r),Ye=new Float64Array(r),je=new Float64Array(r)}const i=e+1;for(let r=0;r<n;r++){let s=0,a=0,l=0,u=0,f=0;for(let c=0;c<e;c++){const d=(r*e+c)*4,m=o[d],E=o[d+1],_=o[d+2],S=xe(m,E,_);s+=S,a+=S*S,l+=m,u+=E,f+=_;const R=(r+1)*i+(c+1),T=r*i+(c+1);Xe[R]=Xe[T]+s,Ve[R]=Ve[T]+a,qe[R]=qe[T]+l,Ye[R]=Ye[T]+u,je[R]=je[T]+f}}}function we(t,e,n,o,i){const r=it+1;return t[(n+i)*r+(e+o)]-t[n*r+(e+o)]-t[(n+i)*r+e]+t[n*r+e]}function io(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function be(t,e,n,o,i,r,s,a,l){const u=n*o,f=we(Xe,t,e,n,o)/u,c=we(Ve,t,e,n,o)/u-f*f;if(i<oo&&n>Bt&&o>Bt&&c>r){const A=n>>1,x=o>>1;be(t,e,A,x,i+1,r,s,a,l),be(t+A,e,n-A,x,i+1,r,s,a,l),be(t,e+x,A,o-x,i+1,r,s,a,l),be(t+A,e+x,n-A,o-x,i+1,r,s,a,l);return}const m=we(qe,t,e,n,o)/u,E=we(Ye,t,e,n,o)/u,_=we(je,t,e,n,o)/u,S=io(t,e,Math.floor(l*2))<.025;V.fillStyle=S?"#2ea44f":`rgb(${Math.round(m)},${Math.round(E)},${Math.round(_)})`;const R=t*s,T=e*a,C=n*s,O=o*a;V.fillRect(R,T,C,O),V.strokeRect(R+.5,T+.5,C-1,O-1)}const ao={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){V=e},render(t){const{width:e,height:n}=V.canvas,{width:o,height:i}=t.sample;ro(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);V.fillStyle="#000",V.fillRect(0,0,e,n),V.strokeStyle="#000",V.lineWidth=1,be(0,0,o,i,0,r,e/o,n/i,t.beat)},dispose(){it=0,Pt=0}},so=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Gt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${i}`)}return o}function q(t,e,n=so){const o=Gt(t,t.VERTEX_SHADER,n),i=Gt(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,i),t.linkProgram(r),t.deleteShader(o),t.deleteShader(i),!t.getProgramParameter(r,t.LINK_STATUS)){const s=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${s}`)}return r}function oe(t){t.drawArrays(t.TRIANGLES,0,3)}function lo(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const i=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:i,texture:o,width:e,height:n}}function tn(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const co=`#version 300 es
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
`;let W=null,ae=null,nn=null,on=null,rn=null,an=null;function uo(t){const e=W;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ae),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(nn,0),e.uniform2f(on,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(rn,t.time),e.uniform1i(an,t.mirror?1:0),oe(e)}let ze,Y=null,pt,Se=new Float32Array(0),Ke=null;function fo(t){const{width:e,height:n,data:o}=t.sample;Y||(Y=document.createElement("canvas"),pt=Y.getContext("2d")),(Y.width!==e||Y.height!==n)&&(Y.width=e,Y.height=n,Se=new Float32Array(e*n),Ke=pt.createImageData(e,n));for(let a=0,l=0;a<e*n;a++,l+=4)Se[a]=xe(o[l],o[l+1],o[l+2])/255;const i=Ke.data;for(let a=0;a<n;a++)for(let l=0;l<e;l++){let u=0;l>0&&l<e-1&&a>0&&a<n-1&&(u=Se[(a-1)*e+(l-1)]-Se[(a+1)*e+(l+1)]);const f=(a*e+l)*4;i[f]=Math.min(255,Math.max(0,248-u*2.3*255)),i[f+1]=Math.min(255,Math.max(0,247-u*1.6*255)),i[f+2]=Math.min(255,Math.max(0,242-u*2.9*255)),i[f+3]=255}pt.putImageData(Ke,0,0);const{width:r,height:s}=ze.canvas;ze.imageSmoothingEnabled=!0,ze.drawImage(Y,0,0,r,s)}const mo={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){W=t,ze=e,W&&!ae&&(ae=q(W,co),nn=W.getUniformLocation(ae,"u_video"),on=W.getUniformLocation(ae,"u_texel"),rn=W.getUniformLocation(ae,"u_time"),an=W.getUniformLocation(ae,"u_mirror"))},render(t){W&&t.videoTex?uo(t):fo(t)},dispose(){Se=new Float32Array(0),Ke=null}},ho=`#version 300 es
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
`;let N=null,Z=null,sn=null,ln=null,cn=null,un=null,fn=null;function vo(t){const e=N,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(Z),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(sn,0),e.uniform2f(ln,n,o),e.uniform1f(cn,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(un,t.time),e.uniform1i(fn,t.mirror?1:0),oe(e)}const po=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),go=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Pe,j=null,gt,Le=new Float32Array(0),Je=null;function Eo(t){const{width:e,height:n,data:o}=t.sample;j||(j=document.createElement("canvas"),gt=j.getContext("2d")),(j.width!==e||j.height!==n)&&(j.width=e,j.height=n,Le=new Float32Array(e*n),Je=gt.createImageData(e,n));for(let l=0,u=0;l<e*n;l++,u+=4)Le[l]=xe(o[u],o[u+1],o[u+2])/255;const i=t.time,r=Je.data;for(let l=0;l<n;l++){const u=l/n,f=Math.sin(u*58+i*2.4)*.55+Math.sin(u*21-i*1.6)*.45,c=po[l&3];for(let d=0;d<e;d++){const m=Le[l*e+d];let E=0;for(let T=0;T<4;T++){const C=Math.round(f*(.006+T*.014)*(.35+m)*e),O=Math.min(e-1,Math.max(0,d+C));E=Math.max(E,Le[l*e+O]*Math.pow(.7,T))}const _=E+(c[d&3]-.5)*.28,S=go[_>.72?0:_>.45?1:_>.24?2:3],R=(l*e+d)*4;r[R]=S[0],r[R+1]=S[1],r[R+2]=S[2],r[R+3]=255}}gt.putImageData(Je,0,0);const{width:s,height:a}=Pe.canvas;Pe.imageSmoothingEnabled=!1,Pe.drawImage(j,0,0,s,a),Pe.imageSmoothingEnabled=!0}const xo={id:"wave",name:"WAVE",usesGl:!0,init(t,e){N=t,Pe=e,N&&!Z&&(Z=q(N,ho),sn=N.getUniformLocation(Z,"u_video"),ln=N.getUniformLocation(Z,"u_res"),cn=N.getUniformLocation(Z,"u_cell"),un=N.getUniformLocation(Z,"u_time"),fn=N.getUniformLocation(Z,"u_mirror"))},render(t){N&&t.videoTex?vo(t):Eo(t)},dispose(){Le=new Float32Array(0),Je=null}},_o=`#version 300 es
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
`;let Q=null,me=null,dn=null,mn=null,hn=null;function To(t){const e=Q;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(me),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(dn,0),e.uniform1f(mn,t.time),e.uniform1i(hn,t.mirror?1:0),oe(e)}const yo=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Ce,z=null,Et,Ze=null;function wo(t){const{width:e,height:n,data:o}=t.sample;z||(z=document.createElement("canvas"),Et=z.getContext("2d")),(z.width!==e||z.height!==n)&&(z.width=e,z.height=n,Ze=Et.createImageData(e,n));const i=Ze.data;for(let a=0;a<n;a++)for(let l=0;l<e;l++){const u=(a*e+l)*4,f=(Math.random()-.5)*.16,c=xe(o[u],o[u+1],o[u+2])/255+f,d=yo[c<.3?0:c<.52?1:c<.72?2:3];i[u]=d[0],i[u+1]=d[1],i[u+2]=d[2],i[u+3]=255}Et.putImageData(Ze,0,0);const{width:r,height:s}=Ce.canvas;Ce.imageSmoothingEnabled=!1,Ce.drawImage(z,0,0,r,s),Ce.imageSmoothingEnabled=!0}const Ro={id:"riso",name:"RISO",usesGl:!0,init(t,e){Q=t,Ce=e,Q&&!me&&(me=q(Q,_o),dn=Q.getUniformLocation(me,"u_video"),mn=Q.getUniformLocation(me,"u_time"),hn=Q.getUniformLocation(me,"u_mirror"))},render(t){Q&&t.videoTex?To(t):wo(t)},dispose(){Ze=null}},bo=`#version 300 es
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
`,So=`#version 300 es
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
`,xt=200,pe={wave:1,trail:.14},_t=[1,2,3.5,.4],Po=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Lo=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let P=null,B=null,Lt=null,vn=null,pn=null,gn=null,En=null,xn=null,_n=null,Tn=null,Ct=null,yn=null,k=null,Fe=!0;function Co(t){const e=P,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!k||k.width!==n||k.height!==o)&&(k&&tn(e,k),k=lo(e,n,o),Fe=!0),e.bindFramebuffer(e.FRAMEBUFFER,k.framebuffer),e.viewport(0,0,n,o),Fe&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),Fe=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(Lt),e.uniform1f(Tn,pe.trail),oe(e);const i=Math.max(2,Math.round(xt*t.video.videoHeight/t.video.videoWidth));e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(vn,0),e.uniform2f(pn,xt,i),e.uniform2f(gn,n,o),e.uniform1f(En,t.time),e.uniform1f(xn,pe.wave),e.uniform1i(_n,t.mirror?1:0),e.drawArrays(e.POINTS,0,xt*i),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(Ct),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,k.texture),e.uniform1i(yn,0),oe(e)}const Xt=2;let Mt,G=null,ie,Ue=!0;function Mo(t){const{width:e,height:n}=Mt.canvas,{width:o,height:i,data:r}=t.sample;G||(G=document.createElement("canvas"),ie=G.getContext("2d")),(G.width!==e||G.height!==n)&&(G.width=e,G.height=n,Ue=!0),Ue?(ie.fillStyle="#000",ie.fillRect(0,0,e,n),Ue=!1):(ie.fillStyle=`rgba(0,0,0,${pe.trail})`,ie.fillRect(0,0,e,n));const s=e/o,a=n/i,l=t.time,u=pe.wave;for(let f=0;f<i;f+=Xt)for(let c=0;c<o;c+=Xt){const d=(f*o+c)*4,m=xe(r[d],r[d+1],r[d+2])/255;if(m<.04)continue;const E=Math.sin(l*2+c*.35+f*.18)*(1+m*5)*s*.6*u,_=Math.cos(l*1.6+f*.28+c*.11)*(1+m*3)*a*.4*u,S=Math.round(24+m*60),R=Math.round(90+m*150),T=Math.round(200+m*55),C=(.6+m*2.6)*s*.5;ie.fillStyle=`rgba(${S},${R},${T},${.2+m*.8})`,ie.fillRect(c*s+E,f*a+_,C,C)}Mt.drawImage(G,0,0)}const Ao={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){P=t,Mt=e,Ue=!0,Fe=!0,P&&!B&&(B=q(P,So,bo),vn=P.getUniformLocation(B,"u_video"),pn=P.getUniformLocation(B,"u_grid"),gn=P.getUniformLocation(B,"u_res"),En=P.getUniformLocation(B,"u_time"),xn=P.getUniformLocation(B,"u_wave"),_n=P.getUniformLocation(B,"u_mirror"),Lt=q(P,Po),Tn=P.getUniformLocation(Lt,"u_alpha"),Ct=q(P,Lo),yn=P.getUniformLocation(Ct,"u_tex"))},render(t){P&&t.videoTex?Co(t):Mo(t)},dispose(){P&&k&&tn(P,k),k=null,G=null,Ue=!0,Fe=!0},onReselect(){const t=_t.indexOf(pe.wave);pe.wave=_t[(t+1)%_t.length]}},Io=`#version 300 es
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
`;let at=!1,$=null,X=null,wn=null,Rn=null,bn=null,Sn=null,Pn=null,Ln=null;function Fo(t){const e=$,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(X),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(wn,0),e.uniform2f(Rn,n,o),e.uniform1f(bn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(Sn,t.time),e.uniform1i(Pn,t.mirror?1:0),e.uniform1i(Ln,at?1:0),oe(e)}const Uo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Do={r:238,g:244,b:250},$o={r:22,g:72,b:158},ko=.12;let Me,K=null,Tt,Qe=null;function Oo(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),Tt=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,Qe=Tt.createImageData(e,n));const i=Qe.data;for(let a=0;a<n;a++){const l=Uo[a&3];for(let u=0;u<e;u++){const f=(a*e+u)*4;let d=xe(o[f],o[f+1],o[f+2])/255+(Math.random()-.5)*ko>l[u&3];at&&(d=!d);const m=d?Do:$o;i[f]=m.r,i[f+1]=m.g,i[f+2]=m.b,i[f+3]=255}}Tt.putImageData(Qe,0,0);const{width:r,height:s}=Me.canvas;Me.imageSmoothingEnabled=!1,Me.drawImage(K,0,0,r,s),Me.imageSmoothingEnabled=!0}const No={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){$=t,Me=e,$&&!X&&(X=q($,Io),wn=$.getUniformLocation(X,"u_video"),Rn=$.getUniformLocation(X,"u_res"),bn=$.getUniformLocation(X,"u_cell"),Sn=$.getUniformLocation(X,"u_time"),Pn=$.getUniformLocation(X,"u_mirror"),Ln=$.getUniformLocation(X,"u_invert"))},render(t){$&&t.videoTex?Fo(t):Oo(t)},dispose(){Qe=null},onReselect(){at=!at}},Ho=`#version 300 es
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
`,De=60,Cn=480,Mn=270,Wo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let L=null,et=null,ee=null,An=null,In=null,Fn=null,Un=null,Dn=null,$n=null,kn=null,ne=null,$e=null,he=-1,ke=0;function Bo(t){ne=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,ne),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,Cn,Mn,De),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),$e=t.createFramebuffer(),he=-1,ke=0}function Go(){L&&(ne&&L.deleteTexture(ne),$e&&L.deleteFramebuffer($e),ne=null,$e=null,he=-1,ke=0)}function Xo(t){const e=L;he=(he+1)%De,ke=Math.min(ke+1,De),e.bindFramebuffer(e.FRAMEBUFFER,$e),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,ne,0,he),e.viewport(0,0,Cn,Mn),e.useProgram(et),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(An,0),oe(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ee),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,ne),e.uniform1i(In,0),e.uniform1f(Fn,he),e.uniform1f(Un,De),e.uniform1f(Dn,ke),e.uniform1f($n,t.beat),e.uniform1i(kn,t.mirror?1:0),oe(e)}let tt,J=null,yt,nt=null,se=[];function Vo(t){const{width:e,height:n,data:o}=t.sample;J||(J=document.createElement("canvas"),yt=J.getContext("2d")),(J.width!==e||J.height!==n)&&(J.width=e,J.height=n,nt=yt.createImageData(e,n),se=[]),se.push(new Uint8ClampedArray(o)),se.length>De&&se.shift();const i=se.length-1,r=nt.data;for(let l=0;l<n;l++){let u=l/Math.max(1,n-1)*i;u+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const f=Math.round(Math.min(i,Math.max(0,u))),c=se[i-f],d=l*e*4;r.set(c.subarray(d,d+e*4),d)}yt.putImageData(nt,0,0);const{width:s,height:a}=tt.canvas;tt.imageSmoothingEnabled=!0,tt.drawImage(J,0,0,s,a)}const qo={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){L=t,tt=e,L&&(et||(et=q(L,Wo),An=L.getUniformLocation(et,"u_video"),ee=q(L,Ho),In=L.getUniformLocation(ee,"u_history"),Fn=L.getUniformLocation(ee,"u_head"),Un=L.getUniformLocation(ee,"u_layers"),Dn=L.getUniformLocation(ee,"u_filled"),$n=L.getUniformLocation(ee,"u_beat"),kn=L.getUniformLocation(ee,"u_mirror")),Bo(L))},render(t){L&&t.videoTex&&ne?Xo(t):Vo(t)},dispose(){Go(),se=[],nt=null}},At=[ao,mo,xo,Ro,Ao,No,qo];function xe(t,e,n){return .2126*t+.7152*e+.0722*n}function Yo(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,i=0;return{gl:e,videoTex:n,uploadVideo(r){const s=r.videoWidth,a=r.videoHeight;s===0||a===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||a!==i?(o=s,i=a,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const jo="modulepreload",zo=function(t,e){return new URL(t,e).href},Vt={},Ko=function(e,n,o){let i=Promise.resolve();if(n&&n.length>0){let u=function(f){return Promise.all(f.map(c=>Promise.resolve(c).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");i=u(n.map(f=>{if(f=zo(f,o),f in Vt)return;Vt[f]=!0;const c=f.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(o)for(let E=s.length-1;E>=0;E--){const _=s[E];if(_.href===f&&(!c||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${f}"]${d}`))return;const m=document.createElement("link");if(m.rel=c?"stylesheet":jo,c||(m.as="script"),m.crossOrigin="",m.href=f,l&&m.setAttribute("nonce",l),document.head.appendChild(m),c)return new Promise((E,_)=>{m.addEventListener("load",E),m.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${f}`)))})}))}function r(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};let ce="off",ge=null,It=-1,Ft=0,st={hands:0,pinching:0,points:[],corners:null};const qt=.4,Jo=.6,Yt=2,Ae=new Map,Zo=1100,Qo=3,jt=.05,er=1500,Ie=new Map;let lt=!1,zt=0;function tr(){const t=lt;return lt=!1,t}const nr=1e3,or=2e3,te=new Map;let ct=!1,Kt=0;function rr(){const t=ct;return ct=!1,t}function Ut(){return ce}function We(){return st}async function On(){if(ce==="off"){ce="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await Ko(async()=>{const{FilesetResolver:r,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),i=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{ge=await e.createFromOptions(o,i("GPU"))}catch{ge=await e.createFromOptions(o,i("CPU"))}ce="on"}catch(t){throw ce="off",t}}}function ir(){ge?.close(),ge=null,ce="off",It=-1,Ft=0,Ae.clear(),Ie.clear(),te.clear(),lt=!1,ct=!1,st={hands:0,pinching:0,points:[],corners:null}}function ar(t,e){if(ce!=="on"||!ge||t.currentTime===It)return;const n=st.hands>0?33:100;if(e-Ft<n)return;It=t.currentTime,Ft=e;const o=ge.detectForVideo(t,e),i=[],r=o.landmarks?.length??0,s=t.videoWidth||1280,a=t.videoHeight||720,l=(c,d)=>Math.hypot((c.x-d.x)*s,(c.y-d.y)*a),u=new Set;for(let c=0;c<r;c++){const d=o.landmarks[c];let m=o.handednesses?.[c]?.[0]?.categoryName??`hand${c}`;u.has(m)&&(m=`${m}${c}`),u.add(m);const E=d[4],_=d[8],S=l(d[5],d[17]),T=l(E,_)/Math.max(S,1e-6);let C=0;for(const[I,D]of[[8,6],[12,10],[16,14],[20,18]])l(d[0],d[I])>l(d[0],d[D])*1.15&&C++;const O=C>=3,A=C<=1;let x=Ae.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Ae.set(m,x)),A?(x.down=!1,x.onFrames=0,x.offFrames=0):T<qt?(x.onFrames++,x.offFrames=0,x.onFrames>=Yt&&(x.down=!0)):T>Jo?(x.offFrames++,x.onFrames=0,x.offFrames>=Yt&&(x.down=!1)):(x.onFrames=0,x.offFrames=0);let w=Ie.get(m);if(w||(w={dir:0,extreme:d[9].x*s,reversals:[]},Ie.set(m,w)),O&&!x.down){const I=d[9].x*s,D=I-w.extreme;w.dir===0?Math.abs(D)>jt*s&&(w.dir=Math.sign(D),w.extreme=I):Math.sign(D)===w.dir?w.extreme=I:Math.abs(D)>jt*s&&(w.dir=Math.sign(D),w.extreme=I,w.reversals.push(e),w.reversals=w.reversals.filter(Te=>e-Te<Zo),w.reversals.length>=Qo&&e>zt&&(lt=!0,zt=e+er,w.reversals=[]))}else w.dir=0,w.extreme=d[9].x*s,w.reversals=[];let H=0;A&&e>Kt?(te.has(m)||te.set(m,e),H=Math.min(1,(e-te.get(m))/nr),H>=1&&(ct=!0,Kt=e+or,te.delete(m),H=0)):te.delete(m),i.push({handedness:m,thumb:{x:E.x,y:E.y},index:{x:_.x,y:_.y},threshold:qt*S/s,ratio:T,pinching:x.down,open:O,fist:A,fistProgress:H,palm:{x:d[9].x,y:d[9].y},x:(E.x+_.x)/2,y:(E.y+_.y)/2})}for(const c of[...Ae.keys()])u.has(c)||Ae.delete(c);for(const c of[...Ie.keys()])u.has(c)||Ie.delete(c);for(const c of[...te.keys()])u.has(c)||te.delete(c);const f=i.filter(c=>c.pinching);st={hands:r,pinching:f.length,points:i,corners:f.length>=2?[f[0],f[1]]:null}}function Nn(t,e,n,o){const i=Math.max(n/t,o/e),r=t*i,s=e*i;return{x:(n-r)/2,y:(o-s)/2,w:r,h:s}}function Oe(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function Hn(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const ot={minDist:1.5,baseWidth:6,maxPoints:2e4,bufferMs:250},sr=["#ffffff","#141414","#8a8a8a","#1f6bff","#9cc3ff"];let lr=sr[0];const ue=new Map,re=[];let Ee=0,M=null,F=null;function cr(){F&&(F.lineCap="round",F.lineJoin="round")}function ur(t,e){if(M||(M=document.createElement("canvas"),F=M.getContext("2d")),M.width===t&&M.height===e)return;const n=M.width,o=M.height;if(n>0&&o>0){const i=t/n,r=e/o,s=(i+r)/2;for(const a of re)for(const l of a.pts)l.x*=i,l.y*=r,l.w*=s}M.width=t,M.height=e,cr(),kt()}function Wn(t,e,n){const o=e.pts;if(t.strokeStyle=e.color,t.lineCap="round",t.lineJoin="round",n===1){t.lineWidth=o[1].w,t.beginPath(),t.moveTo(o[0].x,o[0].y),t.lineTo((o[0].x+o[1].x)/2,(o[0].y+o[1].y)/2),t.stroke();return}const i=o[n-2],r=o[n-1],s=o[n],a={x:(i.x+r.x)/2,y:(i.y+r.y)/2},l={x:(r.x+s.x)/2,y:(r.y+s.y)/2};t.lineWidth=r.w,t.beginPath(),t.moveTo(a.x,a.y),t.quadraticCurveTo(r.x,r.y,l.x,l.y),t.stroke()}function Bn(t,e){const n=e.pts[0];t.fillStyle=e.color,t.beginPath(),t.arc(n.x,n.y,n.w/2,0,Math.PI*2),t.fill()}function $t(t,e){if(e.pts.length!==0){if(e.pts.length===1){Bn(t,e);return}for(let n=1;n<e.pts.length;n++)Wn(t,e,n)}}function kt(){if(!(!M||!F)){F.clearRect(0,0,M.width,M.height);for(const t of re)$t(F,t)}}function Gn(t){!t.stroke||!F||(t.pendingSince=-1,$t(F,t.stroke),t.inked=t.stroke.pts.length,re.push(t.stroke))}function wt(t){t.stroke&&t.pendingSince>=0&&Gn(t),t.stroke&&t.stroke.pts.length===1&&F&&Bn(F,t.stroke),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Xn(t){Ee-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function fr(){let t=!1;for(;Ee>ot.maxPoints&&re.length>0;)Ee-=re.shift().pts.length,t=!0;t&&kt()}function dr(t,e,n,o,i){const r=new Set;for(const s of t){r.add(s.handedness);let a=ue.get(s.handedness);if(a||(a={drawing:!1,stroke:null,pendingSince:-1,inked:0},ue.set(s.handedness,a)),o&&a.drawing){a.pendingSince>=0?Xn(a):wt(a);continue}if(a.drawing&&!s.pinching){wt(a);continue}if(!a.drawing&&s.pinching&&!o&&(a.drawing=!0,a.stroke={color:lr,pts:[]},a.pendingSince=i,a.inked=0),!a.drawing||!a.stroke)continue;const l=Hn(Oe(s.thumb,e,n),Oe(s.index,e,n)),u=a.stroke.pts[a.stroke.pts.length-1];if((!u||Math.hypot(l.x-u.x,l.y-u.y)>=ot.minDist)&&(a.stroke.pts.push({x:l.x,y:l.y,w:ot.baseWidth}),Ee++),a.pendingSince>=0)i-a.pendingSince>ot.bufferMs&&Gn(a);else if(F)for(;a.inked<a.stroke.pts.length;)a.inked++,a.inked>=2&&Wn(F,a.stroke,a.inked-1)}for(const[s,a]of ue)!r.has(s)&&a.drawing&&wt(a);fr()}function mr(t){M&&(re.length>0||hr())&&t.drawImage(M,0,0);for(const e of ue.values())e.drawing&&e.pendingSince>=0&&e.stroke&&$t(t,e.stroke)}function hr(){for(const t of ue.values())if(t.drawing)return!0;return!1}function Vn(t){return ue.get(t)?.drawing??!1}function qn(){for(const t of ue.values())Xn(t);re.length=0,Ee=0,kt()}function vr(){return{strokes:re.length,points:Ee}}const Jt=128,pr=2,Rt=[90,100,110,120,128,140],Be=.08,gr=400,Er=150;let p,g=null,h,ut,Yn,ft,le=null,bt=!1,St=!1,Ne=null,rt=0;const dt=document.createElement("canvas"),de=dt.getContext("2d",{willReadFrequently:!0}),ve=new to,He=new en;let jn=0;const xr=new ImageData(2,2),U=[];let b=null,_e=0,Zt=0,Re=null;const mt=new Set;function fe(){return At[_e%At.length]}function Ot(t){mt.has(t.id)||(t.init(le?.gl??null,Yn),mt.add(t.id))}function ht(){const t=new Set;for(const e of U)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...mt])t.has(e)||(At.find(n=>n.id===e)?.dispose(),mt.delete(e))}function _r(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const Ge=.06;function Tr(t){const e=t.map(s=>({x:g.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),i=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return n<Ge&&(n=0),i<Ge&&(i=0),o>1-Ge&&(o=1),r>1-Ge&&(r=1),o-n<Be&&(o=n+Be),r-i<Be&&(r=i+Be),{x0:n,y0:i,x1:o,y1:r}}function yr(t){const e=We();if(e.corners&&g){Zt=t;const n=Tr(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(Re===null&&(Re=t),t-Re<Er)return;Re=null,b={rect:n,effect:fe()},_e++,Ot(b.effect),p.setFxLabel(b.effect.name)}return}Re=null,b&&t-Zt>gr&&(zn(b),b=null)}function zn(t){for(let e=U.length-1;e>=0;e--)_r(t.rect,U[e].rect)&&U.splice(e,1);U.push(t),ht(),p.setFxLabel(`NEXT ${fe().name}`)}function Nt(){if(!g)return;const t=g.video.videoWidth||4,e=g.video.videoHeight||3,n=16,o=4,i=Math.max(64,window.innerWidth-n*2-o),r=Math.max(64,window.innerHeight-n*2-o-p.chromeHeight()),s=Math.min(i/t,r/e),a=Math.round(t*s),l=Math.round(e*s),u=Math.min(pr,window.devicePixelRatio||1);p.canvas.style.width=`${a}px`,p.canvas.style.height=`${l}px`,p.setDeviceWidth(a);for(const f of[p.canvas,ut,ft])f.width=Math.round(a*u),f.height=Math.round(l*u);ur(p.canvas.width,p.canvas.height),dt.width=Jt,dt.height=Math.max(2,Math.round(Jt*e/t))}function wr(){const{width:t,height:e}=dt;return de.save(),g.mirror&&(de.translate(t,0),de.scale(-1,1)),de.drawImage(g.video,0,0,t,e),de.restore(),de.getImageData(0,0,t,e)}function Rr(){const{width:t,height:e}=p.canvas;h.save(),g.mirror&&(h.translate(t,0),h.scale(-1,1)),h.drawImage(g.video,0,0,t,e),h.restore()}function Qt(t,e,n){const{width:o,height:i}=p.canvas,r=t.rect.x0*o,s=t.rect.y0*i,a=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*i;h.drawImage(e,r,s,a,l,r,s,a,l),h.strokeStyle="#ffffff",h.lineWidth=Math.max(2,o/640),n&&h.setLineDash([10,8]),h.strokeRect(r,s,a,l),h.setLineDash([])}function br(t){Rr();const e=U.map(a=>({f:a,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:a})=>a.effect.usesGl&&le),o=e.some(({f:a})=>!(a.effect.usesGl&&le));n&&le.uploadVideo(g.video);const i={videoTex:n?le.videoTex:null,sample:o?wr():xr,video:g.video,mirror:g.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,s=null;for(const{f:a,isDrawing:l}of e)!!a.effect.usesGl&&!!le?(s!==a.effect&&(a.effect.render(i),s=a.effect),Qt(a,ft,l)):(r!==a.effect&&(a.effect.render(i),r=a.effect),Qt(a,ut,l))}function Sr(){const t=We();if(t.points.length===0||!g)return;const{width:e,height:n}=p.canvas,o=Nn(g.video.videoWidth||4,g.video.videoHeight||3,e,n);h.lineWidth=Math.max(2,e/500);for(const i of t.points){if(i.fist){if(i.fistProgress>0){const c=Oe(i.palm,o,g.mirror),d=Math.max(14,e*.03);h.save(),h.lineWidth=Math.max(3,e/400),h.strokeStyle="rgba(255,255,255,0.35)",h.beginPath(),h.arc(c.x,c.y,d,0,Math.PI*2),h.stroke(),h.strokeStyle="#ffffff",h.beginPath(),h.arc(c.x,c.y,d,-Math.PI/2,-Math.PI/2+Math.PI*2*i.fistProgress),h.stroke(),h.restore()}continue}const r=Oe(i.thumb,o,g.mirror),s=Oe(i.index,o,g.mirror),l=Vn(i.handedness)?"#28c840":i.pinching?"#1f6bff":"#ffffff";h.strokeStyle=l,h.save(),h.lineWidth=Math.max(1,e/900),h.beginPath(),h.moveTo(r.x,r.y),h.lineTo(s.x,s.y),h.stroke(),h.restore();const u=Math.max(8,i.threshold*o.w/2);for(const c of[r,s])h.beginPath(),h.arc(c.x,c.y,u,0,Math.PI*2),h.stroke();const f=Hn(r,s);h.beginPath(),h.arc(f.x,f.y,Math.max(3,e/240),0,Math.PI*2),h.fillStyle=l,h.fill()}}function Pr(){if(!Ne)return;const t=We(),e=vr(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.fist?"FIST ":o.open?"OPEN ":"  -  "} ${Vn(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),Ne.textContent=n.join(`
`)}function Kn(t){requestAnimationFrame(Kn);const e=ve.tick(t),n=g!==null&&g.video.readyState>=2;if(n&&(ar(g.video,t),rr()&&Ir(t),tr()&&(qn(),rt=t+200),yr(t)),e.playing&&n){const o=We(),i=b!==null||o.pinching>=2,r=Nn(g.video.videoWidth||4,g.video.videoHeight||3,p.canvas.width,p.canvas.height);dr(o.points,r,g.mirror,i,t),br(e),mr(h),Sr(),t<rt&&(h.fillStyle=`rgba(255,255,255,${.8*(rt-t)/280})`,h.fillRect(0,0,p.canvas.width,p.canvas.height)),Pr()}He.captureFrame(p.canvas),He.recording&&p.setRecordTime((t-jn)/1e3),p.setHands(Ut(),We().hands>0),p.setTransport(e.frame,e.fps,e.bpm,e.playing)}function Jn(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Lr(){if(!g||!en.supported())return;if(!He.recording){He.start(p.canvas),jn=performance.now(),p.setRecording(!0);return}p.setRecording(!1);const t=await He.stop();t&&Jn(t.blob,`null8_${ve.timecode().replaceAll(":","")}.${t.ext}`)}async function Cr(){if(Ut()!=="loading"){if(Ut()==="on"){ir();return}p.setHands("loading",!1);try{await On()}catch(t){console.error("hand tracking init failed:",t)}}}async function Mr(){if(!g||St)return;St=!0;const t=g.facing;try{g=await Qn(g)}catch{g=await Dt(t)}finally{St=!1}Nt()}function Ar(){p.canvas.toBlob(t=>{t&&Jn(t,`null8_${ve.timecode().replaceAll(":","")}.png`)},"image/png")}function Ir(t){U.length=0,b=null,qn(),ht(),_e=0,p.setFxLabel(`NEXT ${fe().name}`),rt=t+280}function Fr(){U.length>0?(U.pop(),ht()):_e++,p.setFxLabel(`NEXT ${fe().name}`)}async function Ur(){if(!(g||bt)){bt=!0;try{g=await Dt("user"),p.hideStartOverlay(),Nt(),requestAnimationFrame(Kn),On().catch(t=>{console.warn("hand tracking unavailable:",t);const e=fe();_e++,Ot(e),U.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),p.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);p.showStartError(e),bt=!1}}}function Dr(){const t=document.getElementById("app");p=no(t,{onStart:()=>{Ur()},onCanvasTap:Fr,onPlayToggle:()=>ve.toggle(),onSnapshot:Ar,onTempoTap:()=>{const e=Rt.indexOf(ve.bpm);ve.bpm=Rt[(e+1)%Rt.length]},onRecordToggle:()=>{Lr()},onCameraFlip:()=>{Mr()},onHandsToggle:()=>{Cr()}}),h=p.canvas.getContext("2d"),ut=document.createElement("canvas"),Yn=ut.getContext("2d"),ft=document.createElement("canvas"),le=Yo(ft),p.setFxLabel(`NEXT ${fe().name}`),window.addEventListener("resize",Nt),new URLSearchParams(location.search).has("debug")&&(Ne=document.createElement("pre"),Ne.className="debug-hud",document.body.appendChild(Ne)),window.__null8={addFrame(e){const n=fe();_e++,Ot(n),zn({rect:e,effect:n})},clearFrames(){U.length=0,ht()},get frames(){return U.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Dr();
