(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();async function Ct(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function Wn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function Xn(t){const e=t.facing==="user"?"environment":"user";return Wn(t),Ct(e)}const Vn=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class Vt{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=Vn.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",a=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:a}}}const It=60;class qn{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,a=Math.floor(e)%60,r=Math.floor(e*It)%It,s=i=>String(i).padStart(2,"0");return`${s(n)}:${s(o)}:${s(a)}:${s(r)}`}}function h(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function Yn(t,e){const n=h("header","titlebar"),o=h("div","traffic");for(const w of["r","y","g"])o.appendChild(h("span",w));const a=h("div","path","/project1/null8 (128,128)");n.append(o,a,h("div","spacer"));const r=h("div","viewport"),s=h("canvas");r.appendChild(s),r.addEventListener("click",()=>e.onCanvasTap());const i=h("div","start-overlay"),l=h("div","pulse"),c=h("div","big","TAP TO START"),u=h("div","sub",`webcam access required
HTTPS or localhost only`);i.append(l,c,u),i.addEventListener("click",w=>{w.stopPropagation(),e.onStart()}),r.appendChild(i);const d=h("footer","transport"),f=h("div","group"),m=h("span","lcd small","0");f.append(h("span","label","F"),m);const E=h("button","on","PAUSE");E.title="play / pause",E.addEventListener("click",()=>e.onPlayToggle());const T=h("button",void 0,"PHOTO CAPTURE");T.title="photo capture",T.addEventListener("click",()=>e.onSnapshot());const R=h("button","rec-btn","RECORD START");R.title="record video",R.addEventListener("click",()=>e.onRecordToggle());const y=h("div","group"),_=h("span","lcd small","00:00");y.append(h("span","label","REC"),_),y.style.display="none";const x=h("div","group"),Z=h("span","lcd small","—");x.append(h("span","label","FX"),Z);const D=h("div","group"),I=h("span","lcd small","60.0");D.append(h("span","label","FPS"),I);const Ft=h("div","group"),Ie=h("span","lcd small","120");Ie.style.cursor="pointer",Ie.addEventListener("click",()=>e.onTempoTap()),Ft.append(h("span","label","Tempo"),Ie,h("span","label","BPM"));const ie=h("button","hands-btn","✋︎");ie.title="hand tracking",ie.addEventListener("click",()=>e.onHandsToggle());const at=h("button",void 0,"⇄");at.title="switch camera",at.addEventListener("click",()=>e.onCameraFlip()),d.append(x,E,T,R,y,h("div","push"),f,D,Ft,ie,at);const st=h("div","device");return st.append(n,r,d),t.append(st),{canvas:s,chromeHeight(){return n.offsetHeight+d.offsetHeight},setDeviceWidth(w){st.style.width=`${w+4}px`},hideStartOverlay(){i.classList.add("hidden")},showStartError(w){c.textContent="CAMERA ERROR",u.textContent=w,l.style.animationDuration="0.4s"},setFxLabel(w){Z.textContent=w},setTransport(w,ve,lt,Dt){m.textContent=String(w).padStart(6,"0"),I.textContent=ve.toFixed(1),Ie.textContent=String(lt),E.textContent=Dt?"PAUSE":"PLAY",E.classList.toggle("on",Dt)},setRecording(w){R.textContent=w?"RECORD STOP":"RECORD START",R.classList.toggle("recording",w),_.classList.toggle("rec",w),y.style.display=w?"flex":"none",w||(_.textContent="00:00")},setRecordTime(w){const ve=Math.floor(w/60),lt=Math.floor(w)%60;_.textContent=`${String(ve).padStart(2,"0")}:${String(lt).padStart(2,"0")}`},setHands(w,ve){ie.classList.toggle("loading",w==="loading"),ie.classList.toggle("on",w==="on"),ie.classList.toggle("detect",w==="on"&&ve)}}}const jn=6,$t=2;let H,Ze=0,xt=0,Oe=new Float64Array(0),Be=new Float64Array(0),He=new Float64Array(0),Ne=new Float64Array(0),Ge=new Float64Array(0);function zn(t){const{width:e,height:n,data:o}=t;if(e!==Ze||n!==xt){Ze=e,xt=n;const r=(e+1)*(n+1);Oe=new Float64Array(r),Be=new Float64Array(r),He=new Float64Array(r),Ne=new Float64Array(r),Ge=new Float64Array(r)}const a=e+1;for(let r=0;r<n;r++){let s=0,i=0,l=0,c=0,u=0;for(let d=0;d<e;d++){const f=(r*e+d)*4,m=o[f],E=o[f+1],T=o[f+2],R=he(m,E,T);s+=R,i+=R*R,l+=m,c+=E,u+=T;const y=(r+1)*a+(d+1),_=r*a+(d+1);Oe[y]=Oe[_]+s,Be[y]=Be[_]+i,He[y]=He[_]+l,Ne[y]=Ne[_]+c,Ge[y]=Ge[_]+u}}}function pe(t,e,n,o,a){const r=Ze+1;return t[(n+a)*r+(e+o)]-t[n*r+(e+o)]-t[(n+a)*r+e]+t[n*r+e]}function Kn(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function Ee(t,e,n,o,a,r,s,i,l){const c=n*o,u=pe(Oe,t,e,n,o)/c,d=pe(Be,t,e,n,o)/c-u*u;if(a<jn&&n>$t&&o>$t&&d>r){const D=n>>1,I=o>>1;Ee(t,e,D,I,a+1,r,s,i,l),Ee(t+D,e,n-D,I,a+1,r,s,i,l),Ee(t,e+I,D,o-I,a+1,r,s,i,l),Ee(t+D,e+I,n-D,o-I,a+1,r,s,i,l);return}const m=pe(He,t,e,n,o)/c,E=pe(Ne,t,e,n,o)/c,T=pe(Ge,t,e,n,o)/c,R=Kn(t,e,Math.floor(l*2))<.025;H.fillStyle=R?"#2ea44f":`rgb(${Math.round(m)},${Math.round(E)},${Math.round(T)})`;const y=t*s,_=e*i,x=n*s,Z=o*i;H.fillRect(y,_,x,Z),H.strokeRect(y+.5,_+.5,x-1,Z-1)}const Jn={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){H=e},render(t){const{width:e,height:n}=H.canvas,{width:o,height:a}=t.sample;zn(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);H.fillStyle="#000",H.fillRect(0,0,e,n),H.strokeStyle="#000",H.lineWidth=1,Ee(0,0,o,a,0,r,e/o,n/a,t.beat)},dispose(){Ze=0,xt=0}},Zn=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function kt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const a=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${a}`)}return o}function N(t,e,n=Zn){const o=kt(t,t.VERTEX_SHADER,n),a=kt(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,a),t.linkProgram(r),t.deleteShader(o),t.deleteShader(a),!t.getProgramParameter(r,t.LINK_STATUS)){const s=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${s}`)}return r}function J(t){t.drawArrays(t.TRIANGLES,0,3)}function Qn(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const a=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,a),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:a,texture:o,width:e,height:n}}function qt(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const eo=`#version 300 es
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
`;let $=null,ee=null,Yt=null,jt=null,zt=null,Kt=null;function to(t){const e=$;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ee),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Yt,0),e.uniform2f(jt,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(zt,t.time),e.uniform1i(Kt,t.mirror?1:0),J(e)}let We,G=null,ct,Te=new Float32Array(0),Xe=null;function no(t){const{width:e,height:n,data:o}=t.sample;G||(G=document.createElement("canvas"),ct=G.getContext("2d")),(G.width!==e||G.height!==n)&&(G.width=e,G.height=n,Te=new Float32Array(e*n),Xe=ct.createImageData(e,n));for(let i=0,l=0;i<e*n;i++,l+=4)Te[i]=he(o[l],o[l+1],o[l+2])/255;const a=Xe.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){let c=0;l>0&&l<e-1&&i>0&&i<n-1&&(c=Te[(i-1)*e+(l-1)]-Te[(i+1)*e+(l+1)]);const u=(i*e+l)*4;a[u]=Math.min(255,Math.max(0,248-c*2.3*255)),a[u+1]=Math.min(255,Math.max(0,247-c*1.6*255)),a[u+2]=Math.min(255,Math.max(0,242-c*2.9*255)),a[u+3]=255}ct.putImageData(Xe,0,0);const{width:r,height:s}=We.canvas;We.imageSmoothingEnabled=!0,We.drawImage(G,0,0,r,s)}const oo={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){$=t,We=e,$&&!ee&&(ee=N($,eo),Yt=$.getUniformLocation(ee,"u_video"),jt=$.getUniformLocation(ee,"u_texel"),zt=$.getUniformLocation(ee,"u_time"),Kt=$.getUniformLocation(ee,"u_mirror"))},render(t){$&&t.videoTex?to(t):no(t)},dispose(){Te=new Float32Array(0),Xe=null}},ro=`#version 300 es
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
`;let F=null,Y=null,Jt=null,Zt=null,Qt=null,en=null,tn=null;function io(t){const e=F,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(Y),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Jt,0),e.uniform2f(Zt,n,o),e.uniform1f(Qt,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(en,t.time),e.uniform1i(tn,t.mirror?1:0),J(e)}const ao=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),so=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let xe,W=null,ut,_e=new Float32Array(0),Ve=null;function lo(t){const{width:e,height:n,data:o}=t.sample;W||(W=document.createElement("canvas"),ut=W.getContext("2d")),(W.width!==e||W.height!==n)&&(W.width=e,W.height=n,_e=new Float32Array(e*n),Ve=ut.createImageData(e,n));for(let l=0,c=0;l<e*n;l++,c+=4)_e[l]=he(o[c],o[c+1],o[c+2])/255;const a=t.time,r=Ve.data;for(let l=0;l<n;l++){const c=l/n,u=Math.sin(c*58+a*2.4)*.55+Math.sin(c*21-a*1.6)*.45,d=ao[l&3];for(let f=0;f<e;f++){const m=_e[l*e+f];let E=0;for(let _=0;_<4;_++){const x=Math.round(u*(.006+_*.014)*(.35+m)*e),Z=Math.min(e-1,Math.max(0,f+x));E=Math.max(E,_e[l*e+Z]*Math.pow(.7,_))}const T=E+(d[f&3]-.5)*.28,R=so[T>.72?0:T>.45?1:T>.24?2:3],y=(l*e+f)*4;r[y]=R[0],r[y+1]=R[1],r[y+2]=R[2],r[y+3]=255}}ut.putImageData(Ve,0,0);const{width:s,height:i}=xe.canvas;xe.imageSmoothingEnabled=!1,xe.drawImage(W,0,0,s,i),xe.imageSmoothingEnabled=!0}const co={id:"wave",name:"WAVE",usesGl:!0,init(t,e){F=t,xe=e,F&&!Y&&(Y=N(F,ro),Jt=F.getUniformLocation(Y,"u_video"),Zt=F.getUniformLocation(Y,"u_res"),Qt=F.getUniformLocation(Y,"u_cell"),en=F.getUniformLocation(Y,"u_time"),tn=F.getUniformLocation(Y,"u_mirror"))},render(t){F&&t.videoTex?io(t):lo(t)},dispose(){_e=new Float32Array(0),Ve=null}},uo=`#version 300 es
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
`;let j=null,se=null,nn=null,on=null,rn=null;function fo(t){const e=j;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(se),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(nn,0),e.uniform1f(on,t.time),e.uniform1i(rn,t.mirror?1:0),J(e)}const mo=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let we,X=null,dt,qe=null;function ho(t){const{width:e,height:n,data:o}=t.sample;X||(X=document.createElement("canvas"),dt=X.getContext("2d")),(X.width!==e||X.height!==n)&&(X.width=e,X.height=n,qe=dt.createImageData(e,n));const a=qe.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){const c=(i*e+l)*4,u=(Math.random()-.5)*.16,d=he(o[c],o[c+1],o[c+2])/255+u,f=mo[d<.3?0:d<.52?1:d<.72?2:3];a[c]=f[0],a[c+1]=f[1],a[c+2]=f[2],a[c+3]=255}dt.putImageData(qe,0,0);const{width:r,height:s}=we.canvas;we.imageSmoothingEnabled=!1,we.drawImage(X,0,0,r,s),we.imageSmoothingEnabled=!0}const vo={id:"riso",name:"RISO",usesGl:!0,init(t,e){j=t,we=e,j&&!se&&(se=N(j,uo),nn=j.getUniformLocation(se,"u_video"),on=j.getUniformLocation(se,"u_time"),rn=j.getUniformLocation(se,"u_mirror"))},render(t){j&&t.videoTex?fo(t):ho(t)},dispose(){qe=null}},po=`#version 300 es
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
`,go=`#version 300 es
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
`,ft=200,de={wave:1,trail:.14},mt=[1,2,3.5,.4],Eo=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,To=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let S=null,k=null,_t=null,an=null,sn=null,ln=null,cn=null,un=null,dn=null,fn=null,wt=null,mn=null,M=null,be=!0;function xo(t){const e=S,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!M||M.width!==n||M.height!==o)&&(M&&qt(e,M),M=Qn(e,n,o),be=!0),e.bindFramebuffer(e.FRAMEBUFFER,M.framebuffer),e.viewport(0,0,n,o),be&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),be=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(_t),e.uniform1f(fn,de.trail),J(e);const a=Math.max(2,Math.round(ft*t.video.videoHeight/t.video.videoWidth));e.useProgram(k),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(an,0),e.uniform2f(sn,ft,a),e.uniform2f(ln,n,o),e.uniform1f(cn,t.time),e.uniform1f(un,de.wave),e.uniform1i(dn,t.mirror?1:0),e.drawArrays(e.POINTS,0,ft*a),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(wt),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,M.texture),e.uniform1i(mn,0),J(e)}const Ot=2;let yt,O=null,Q,Se=!0;function _o(t){const{width:e,height:n}=yt.canvas,{width:o,height:a,data:r}=t.sample;O||(O=document.createElement("canvas"),Q=O.getContext("2d")),(O.width!==e||O.height!==n)&&(O.width=e,O.height=n,Se=!0),Se?(Q.fillStyle="#000",Q.fillRect(0,0,e,n),Se=!1):(Q.fillStyle=`rgba(0,0,0,${de.trail})`,Q.fillRect(0,0,e,n));const s=e/o,i=n/a,l=t.time,c=de.wave;for(let u=0;u<a;u+=Ot)for(let d=0;d<o;d+=Ot){const f=(u*o+d)*4,m=he(r[f],r[f+1],r[f+2])/255;if(m<.04)continue;const E=Math.sin(l*2+d*.35+u*.18)*(1+m*5)*s*.6*c,T=Math.cos(l*1.6+u*.28+d*.11)*(1+m*3)*i*.4*c,R=Math.round(24+m*60),y=Math.round(90+m*150),_=Math.round(200+m*55),x=(.6+m*2.6)*s*.5;Q.fillStyle=`rgba(${R},${y},${_},${.2+m*.8})`,Q.fillRect(d*s+E,u*i+T,x,x)}yt.drawImage(O,0,0)}const wo={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){S=t,yt=e,Se=!0,be=!0,S&&!k&&(k=N(S,go,po),an=S.getUniformLocation(k,"u_video"),sn=S.getUniformLocation(k,"u_grid"),ln=S.getUniformLocation(k,"u_res"),cn=S.getUniformLocation(k,"u_time"),un=S.getUniformLocation(k,"u_wave"),dn=S.getUniformLocation(k,"u_mirror"),_t=N(S,Eo),fn=S.getUniformLocation(_t,"u_alpha"),wt=N(S,To),mn=S.getUniformLocation(wt,"u_tex"))},render(t){S&&t.videoTex?xo(t):_o(t)},dispose(){S&&M&&qt(S,M),M=null,O=null,Se=!0,be=!0},onReselect(){const t=mt.indexOf(de.wave);de.wave=mt[(t+1)%mt.length]}},yo=`#version 300 es
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
`;let Qe=!1,A=null,B=null,hn=null,vn=null,pn=null,gn=null,En=null,Tn=null;function Ro(t){const e=A,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(hn,0),e.uniform2f(vn,n,o),e.uniform1f(pn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(gn,t.time),e.uniform1i(En,t.mirror?1:0),e.uniform1i(Tn,Qe?1:0),J(e)}const bo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),So={r:238,g:244,b:250},Lo={r:22,g:72,b:158},Co=.12;let ye,V=null,ht,Ye=null;function Po(t){const{width:e,height:n,data:o}=t.sample;V||(V=document.createElement("canvas"),ht=V.getContext("2d")),(V.width!==e||V.height!==n)&&(V.width=e,V.height=n,Ye=ht.createImageData(e,n));const a=Ye.data;for(let i=0;i<n;i++){const l=bo[i&3];for(let c=0;c<e;c++){const u=(i*e+c)*4;let f=he(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*Co>l[c&3];Qe&&(f=!f);const m=f?So:Lo;a[u]=m.r,a[u+1]=m.g,a[u+2]=m.b,a[u+3]=255}}ht.putImageData(Ye,0,0);const{width:r,height:s}=ye.canvas;ye.imageSmoothingEnabled=!1,ye.drawImage(V,0,0,r,s),ye.imageSmoothingEnabled=!0}const Ao={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){A=t,ye=e,A&&!B&&(B=N(A,yo),hn=A.getUniformLocation(B,"u_video"),vn=A.getUniformLocation(B,"u_res"),pn=A.getUniformLocation(B,"u_cell"),gn=A.getUniformLocation(B,"u_time"),En=A.getUniformLocation(B,"u_mirror"),Tn=A.getUniformLocation(B,"u_invert"))},render(t){A&&t.videoTex?Ro(t):Po(t)},dispose(){Ye=null},onReselect(){Qe=!Qe}},Mo=`#version 300 es
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
`,Le=60,xn=480,_n=270,Uo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let L=null,je=null,z=null,wn=null,yn=null,Rn=null,bn=null,Sn=null,Ln=null,Cn=null,K=null,Ce=null,le=-1,Pe=0;function Fo(t){K=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,K),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,xn,_n,Le),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Ce=t.createFramebuffer(),le=-1,Pe=0}function Do(){L&&(K&&L.deleteTexture(K),Ce&&L.deleteFramebuffer(Ce),K=null,Ce=null,le=-1,Pe=0)}function Io(t){const e=L;le=(le+1)%Le,Pe=Math.min(Pe+1,Le),e.bindFramebuffer(e.FRAMEBUFFER,Ce),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,K,0,le),e.viewport(0,0,xn,_n),e.useProgram(je),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(wn,0),J(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(z),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,K),e.uniform1i(yn,0),e.uniform1f(Rn,le),e.uniform1f(bn,Le),e.uniform1f(Sn,Pe),e.uniform1f(Ln,t.beat),e.uniform1i(Cn,t.mirror?1:0),J(e)}let ze,q=null,vt,Ke=null,te=[];function $o(t){const{width:e,height:n,data:o}=t.sample;q||(q=document.createElement("canvas"),vt=q.getContext("2d")),(q.width!==e||q.height!==n)&&(q.width=e,q.height=n,Ke=vt.createImageData(e,n),te=[]),te.push(new Uint8ClampedArray(o)),te.length>Le&&te.shift();const a=te.length-1,r=Ke.data;for(let l=0;l<n;l++){let c=l/Math.max(1,n-1)*a;c+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(a,Math.max(0,c))),d=te[a-u],f=l*e*4;r.set(d.subarray(f,f+e*4),f)}vt.putImageData(Ke,0,0);const{width:s,height:i}=ze.canvas;ze.imageSmoothingEnabled=!0,ze.drawImage(q,0,0,s,i)}const ko={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){L=t,ze=e,L&&(je||(je=N(L,Uo),wn=L.getUniformLocation(je,"u_video"),z=N(L,Mo),yn=L.getUniformLocation(z,"u_history"),Rn=L.getUniformLocation(z,"u_head"),bn=L.getUniformLocation(z,"u_layers"),Sn=L.getUniformLocation(z,"u_filled"),Ln=L.getUniformLocation(z,"u_beat"),Cn=L.getUniformLocation(z,"u_mirror")),Fo(L))},render(t){L&&t.videoTex&&K?Io(t):$o(t)},dispose(){Do(),te=[],Ke=null}},Rt=[Jn,oo,co,vo,wo,Ao,ko];function he(t,e,n){return .2126*t+.7152*e+.0722*n}function Oo(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,a=0;return{gl:e,videoTex:n,uploadVideo(r){const s=r.videoWidth,i=r.videoHeight;s===0||i===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||i!==a?(o=s,a=i,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const Bo="modulepreload",Ho=function(t,e){return new URL(t,e).href},Bt={},No=function(e,n,o){let a=Promise.resolve();if(n&&n.length>0){let c=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const s=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");a=c(n.map(u=>{if(u=Ho(u,o),u in Bt)return;Bt[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(o)for(let E=s.length-1;E>=0;E--){const T=s[E];if(T.href===u&&(!d||T.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":Bo,d||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),d)return new Promise((E,T)=>{m.addEventListener("load",E),m.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return a.then(s=>{for(const i of s||[])i.status==="rejected"&&r(i.reason);return e().catch(r)})};let oe="off",fe=null,bt=-1,St=0,et={hands:0,pinching:0,points:[],corners:null};const Ht=.4,Go=.6,Nt=2,Re=new Map;function Lt(){return oe}function Ue(){return et}async function Pn(){if(oe==="off"){oe="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await No(async()=>{const{FilesetResolver:r,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),a=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{fe=await e.createFromOptions(o,a("GPU"))}catch{fe=await e.createFromOptions(o,a("CPU"))}oe="on"}catch(t){throw oe="off",t}}}function Wo(){fe?.close(),fe=null,oe="off",bt=-1,St=0,Re.clear(),et={hands:0,pinching:0,points:[],corners:null}}function Xo(t,e){if(oe!=="on"||!fe||t.currentTime===bt)return;const n=et.hands>0?33:100;if(e-St<n)return;bt=t.currentTime,St=e;const o=fe.detectForVideo(t,e),a=[],r=o.landmarks?.length??0,s=t.videoWidth||1280,i=t.videoHeight||720,l=(d,f)=>Math.hypot((d.x-f.x)*s,(d.y-f.y)*i),c=new Set;for(let d=0;d<r;d++){const f=o.landmarks[d];let m=o.handednesses?.[d]?.[0]?.categoryName??`hand${d}`;c.has(m)&&(m=`${m}${d}`),c.add(m);const E=f[4],T=f[8],R=l(f[5],f[17]),_=l(E,T)/Math.max(R,1e-6);let x=Re.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Re.set(m,x)),_<Ht?(x.onFrames++,x.offFrames=0,x.onFrames>=Nt&&(x.down=!0)):_>Go?(x.offFrames++,x.onFrames=0,x.offFrames>=Nt&&(x.down=!1)):(x.onFrames=0,x.offFrames=0),a.push({handedness:m,thumb:{x:E.x,y:E.y},index:{x:T.x,y:T.y},threshold:Ht*R/s,ratio:_,pinching:x.down,x:(E.x+T.x)/2,y:(E.y+T.y)/2})}for(const d of[...Re.keys()])c.has(d)||Re.delete(d);const u=a.filter(d=>d.pinching);et={hands:r,pinching:u.length,points:a,corners:u.length>=2?[u[0],u[1]]:null}}function An(t,e,n,o){const a=Math.max(n/t,o/e),r=t*a,s=e*a;return{x:(n-r)/2,y:(o-s)/2,w:r,h:s}}function tt(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function Mn(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const Je={minDist:1.5,baseWidth:6,maxPoints:2e4,bufferMs:250},Vo=["#ffffff","#141414","#8a8a8a","#1f6bff","#9cc3ff"];let Un=Vo[0];function qo(){return Un}const ce=new Map,re=[];let Fe=0,C=null,P=null;function Yo(){P&&(P.lineCap="round",P.lineJoin="round")}function jo(t,e){if(C||(C=document.createElement("canvas"),P=C.getContext("2d")),C.width===t&&C.height===e)return;const n=C.width,o=C.height;if(n>0&&o>0){const a=t/n,r=e/o,s=(a+r)/2;for(const i of re)for(const l of i.pts)l.x*=a,l.y*=r,l.w*=s}C.width=t,C.height=e,Yo(),In()}function Fn(t,e,n){const o=e.pts;if(t.strokeStyle=e.color,t.lineCap="round",t.lineJoin="round",n===1){t.lineWidth=o[1].w,t.beginPath(),t.moveTo(o[0].x,o[0].y),t.lineTo((o[0].x+o[1].x)/2,(o[0].y+o[1].y)/2),t.stroke();return}const a=o[n-2],r=o[n-1],s=o[n],i={x:(a.x+r.x)/2,y:(a.y+r.y)/2},l={x:(r.x+s.x)/2,y:(r.y+s.y)/2};t.lineWidth=r.w,t.beginPath(),t.moveTo(i.x,i.y),t.quadraticCurveTo(r.x,r.y,l.x,l.y),t.stroke()}function Dn(t,e){const n=e.pts[0];t.fillStyle=e.color,t.beginPath(),t.arc(n.x,n.y,n.w/2,0,Math.PI*2),t.fill()}function Pt(t,e){if(e.pts.length!==0){if(e.pts.length===1){Dn(t,e);return}for(let n=1;n<e.pts.length;n++)Fn(t,e,n)}}function In(){if(!(!C||!P)){P.clearRect(0,0,C.width,C.height);for(const t of re)Pt(P,t)}}function $n(t){!t.stroke||!P||(t.pendingSince=-1,Pt(P,t.stroke),t.inked=t.stroke.pts.length,re.push(t.stroke))}function pt(t){t.stroke&&t.pendingSince>=0&&$n(t),t.stroke&&t.stroke.pts.length===1&&P&&Dn(P,t.stroke),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function zo(t){Fe-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Ko(){let t=!1;for(;Fe>Je.maxPoints&&re.length>0;)Fe-=re.shift().pts.length,t=!0;t&&In()}function Jo(t,e,n,o,a){const r=new Set;for(const s of t){r.add(s.handedness);let i=ce.get(s.handedness);if(i||(i={drawing:!1,stroke:null,pendingSince:-1,inked:0},ce.set(s.handedness,i)),o&&i.drawing){i.pendingSince>=0?zo(i):pt(i);continue}if(i.drawing&&!s.pinching){pt(i);continue}if(!i.drawing&&s.pinching&&!o&&(i.drawing=!0,i.stroke={color:Un,pts:[]},i.pendingSince=a,i.inked=0),!i.drawing||!i.stroke)continue;const l=Mn(tt(s.thumb,e,n),tt(s.index,e,n)),c=i.stroke.pts[i.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=Je.minDist)&&(i.stroke.pts.push({x:l.x,y:l.y,w:Je.baseWidth}),Fe++),i.pendingSince>=0)a-i.pendingSince>Je.bufferMs&&$n(i);else if(P)for(;i.inked<i.stroke.pts.length;)i.inked++,i.inked>=2&&Fn(P,i.stroke,i.inked-1)}for(const[s,i]of ce)!r.has(s)&&i.drawing&&pt(i);Ko()}function Zo(t){C&&(re.length>0||Qo())&&t.drawImage(C,0,0);for(const e of ce.values())e.drawing&&e.pendingSince>=0&&e.stroke&&Pt(t,e.stroke)}function Qo(){for(const t of ce.values())if(t.drawing)return!0;return!1}function kn(t){return ce.get(t)?.drawing??!1}function er(){return{strokes:re.length,points:Fe}}const Gt=128,tr=2,gt=[90,100,110,120,128,140],$e=.08,nr=400,or=150;let p,v=null,g,nt,On,ot,ne=null,Et=!1,Tt=!1,Ae=null;const rt=document.createElement("canvas"),ae=rt.getContext("2d",{willReadFrequently:!0}),ue=new qn,Me=new Vt;let Bn=0;const rr=new ImageData(2,2),U=[];let b=null,De=0,Wt=0,ge=null;const it=new Set;function me(){return Rt[De%Rt.length]}function At(t){it.has(t.id)||(t.init(ne?.gl??null,On),it.add(t.id))}function Mt(){const t=new Set;for(const e of U)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...it])t.has(e)||(Rt.find(n=>n.id===e)?.dispose(),it.delete(e))}function ir(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const ke=.06;function ar(t){const e=t.map(s=>({x:v.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),a=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return n<ke&&(n=0),a<ke&&(a=0),o>1-ke&&(o=1),r>1-ke&&(r=1),o-n<$e&&(o=n+$e),r-a<$e&&(r=a+$e),{x0:n,y0:a,x1:o,y1:r}}function sr(t){const e=Ue();if(e.corners&&v){Wt=t;const n=ar(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(ge===null&&(ge=t),t-ge<or)return;ge=null,b={rect:n,effect:me()},De++,At(b.effect),p.setFxLabel(b.effect.name)}return}ge=null,b&&t-Wt>nr&&(Hn(b),b=null)}function Hn(t){for(let e=U.length-1;e>=0;e--)ir(t.rect,U[e].rect)&&U.splice(e,1);U.push(t),Mt(),p.setFxLabel(`NEXT ${me().name}`)}function Ut(){if(!v)return;const t=v.video.videoWidth||4,e=v.video.videoHeight||3,n=16,o=4,a=Math.max(64,window.innerWidth-n*2-o),r=Math.max(64,window.innerHeight-n*2-o-p.chromeHeight()),s=Math.min(a/t,r/e),i=Math.round(t*s),l=Math.round(e*s),c=Math.min(tr,window.devicePixelRatio||1);p.canvas.style.width=`${i}px`,p.canvas.style.height=`${l}px`,p.setDeviceWidth(i);for(const u of[p.canvas,nt,ot])u.width=Math.round(i*c),u.height=Math.round(l*c);jo(p.canvas.width,p.canvas.height),rt.width=Gt,rt.height=Math.max(2,Math.round(Gt*e/t))}function lr(){const{width:t,height:e}=rt;return ae.save(),v.mirror&&(ae.translate(t,0),ae.scale(-1,1)),ae.drawImage(v.video,0,0,t,e),ae.restore(),ae.getImageData(0,0,t,e)}function cr(){const{width:t,height:e}=p.canvas;g.save(),v.mirror&&(g.translate(t,0),g.scale(-1,1)),g.drawImage(v.video,0,0,t,e),g.restore()}function Xt(t,e,n){const{width:o,height:a}=p.canvas,r=t.rect.x0*o,s=t.rect.y0*a,i=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*a;g.drawImage(e,r,s,i,l,r,s,i,l),g.strokeStyle="#ffffff",g.lineWidth=Math.max(2,o/640),n&&g.setLineDash([10,8]),g.strokeRect(r,s,i,l),g.setLineDash([])}function ur(t){cr();const e=U.map(i=>({f:i,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:i})=>i.effect.usesGl&&ne),o=e.some(({f:i})=>!(i.effect.usesGl&&ne));n&&ne.uploadVideo(v.video);const a={videoTex:n?ne.videoTex:null,sample:o?lr():rr,video:v.video,mirror:v.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,s=null;for(const{f:i,isDrawing:l}of e)!!i.effect.usesGl&&!!ne?(s!==i.effect&&(i.effect.render(a),s=i.effect),Xt(i,ot,l)):(r!==i.effect&&(i.effect.render(a),r=i.effect),Xt(i,nt,l))}function dr(){const t=Ue();if(t.points.length===0||!v)return;const{width:e,height:n}=p.canvas,o=An(v.video.videoWidth||4,v.video.videoHeight||3,e,n);g.lineWidth=Math.max(2,e/500);for(const a of t.points){const r=tt(a.thumb,o,v.mirror),s=tt(a.index,o,v.mirror),l=kn(a.handedness)?qo():a.pinching?"#1f6bff":"#ffffff";g.strokeStyle=l,g.save(),g.lineWidth=Math.max(1,e/900),g.beginPath(),g.moveTo(r.x,r.y),g.lineTo(s.x,s.y),g.stroke(),g.restore();const c=Math.max(8,a.threshold*o.w/2);for(const d of[r,s])g.beginPath(),g.arc(d.x,d.y,c,0,Math.PI*2),g.stroke();const u=Mn(r,s);g.beginPath(),g.arc(u.x,u.y,Math.max(3,e/240),0,Math.PI*2),g.fillStyle=l,g.fill()}}function fr(){if(!Ae)return;const t=Ue(),e=er(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":"  -  "} ${kn(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),Ae.textContent=n.join(`
`)}function Nn(t){requestAnimationFrame(Nn);const e=ue.tick(t),n=v!==null&&v.video.readyState>=2;if(n&&(Xo(v.video,t),sr(t)),e.playing&&n){const o=Ue(),a=b!==null||o.pinching>=2,r=An(v.video.videoWidth||4,v.video.videoHeight||3,p.canvas.width,p.canvas.height);Jo(o.points,r,v.mirror,a,t),ur(e),Zo(g),dr(),fr()}Me.captureFrame(p.canvas),Me.recording&&p.setRecordTime((t-Bn)/1e3),p.setHands(Lt(),Ue().hands>0),p.setTransport(e.frame,e.fps,e.bpm,e.playing)}function Gn(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function mr(){if(!v||!Vt.supported())return;if(!Me.recording){Me.start(p.canvas),Bn=performance.now(),p.setRecording(!0);return}p.setRecording(!1);const t=await Me.stop();t&&Gn(t.blob,`null8_${ue.timecode().replaceAll(":","")}.${t.ext}`)}async function hr(){if(Lt()!=="loading"){if(Lt()==="on"){Wo();return}p.setHands("loading",!1);try{await Pn()}catch(t){console.error("hand tracking init failed:",t)}}}async function vr(){if(!v||Tt)return;Tt=!0;const t=v.facing;try{v=await Xn(v)}catch{v=await Ct(t)}finally{Tt=!1}Ut()}function pr(){p.canvas.toBlob(t=>{t&&Gn(t,`null8_${ue.timecode().replaceAll(":","")}.png`)},"image/png")}function gr(){U.length>0?(U.pop(),Mt()):De++,p.setFxLabel(`NEXT ${me().name}`)}async function Er(){if(!(v||Et)){Et=!0;try{v=await Ct("user"),p.hideStartOverlay(),Ut(),requestAnimationFrame(Nn),Pn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=me();De++,At(e),U.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),p.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);p.showStartError(e),Et=!1}}}function Tr(){const t=document.getElementById("app");p=Yn(t,{onStart:()=>{Er()},onCanvasTap:gr,onPlayToggle:()=>ue.toggle(),onSnapshot:pr,onTempoTap:()=>{const e=gt.indexOf(ue.bpm);ue.bpm=gt[(e+1)%gt.length]},onRecordToggle:()=>{mr()},onCameraFlip:()=>{vr()},onHandsToggle:()=>{hr()}}),g=p.canvas.getContext("2d"),nt=document.createElement("canvas"),On=nt.getContext("2d"),ot=document.createElement("canvas"),ne=Oo(ot),p.setFxLabel(`NEXT ${me().name}`),window.addEventListener("resize",Ut),new URLSearchParams(location.search).has("debug")&&(Ae=document.createElement("pre"),Ae.className="debug-hud",document.body.appendChild(Ae)),window.__null8={addFrame(e){const n=me();De++,At(n),Hn({rect:e,effect:n})},clearFrames(){U.length=0,Mt()},get frames(){return U.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Tr();
