(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();async function Ot(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function io(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function ro(t){const e=t.facing==="user"?"environment":"user";return io(t),Ot(e)}const ao=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class rn{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=ao.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(i=>{e.onstop=()=>i()});e.stop(),await n;for(const i of this.stream?.getTracks()??[])i.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",r=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:r}}}const Vt=60;class so{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,r=Math.floor(e)%60,i=Math.floor(e*Vt)%Vt,s=a=>String(a).padStart(2,"0");return`${s(n)}:${s(o)}:${s(r)}:${s(i)}`}}function v(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function lo(t,e){const n=v("header","titlebar"),o=v("div","traffic");for(const y of["r","y","g"])o.appendChild(v("span",y));const r=v("div","path","/project1/null8 (128,128)");n.append(o,r,v("div","spacer"));const i=v("div","viewport"),s=v("canvas");i.appendChild(s),i.addEventListener("click",()=>e.onCanvasTap());const a=v("div","start-overlay"),l=v("div","pulse"),d=v("div","big","TAP TO START"),f=v("div","sub",`webcam access required
HTTPS or localhost only`);a.append(l,d,f),a.addEventListener("click",y=>{y.stopPropagation(),e.onStart()}),i.appendChild(a);const c=v("footer","transport"),u=v("div","group"),m=v("span","lcd small","0");u.append(v("span","label","F"),m);const E=v("button","on","PAUSE");E.title="play / pause",E.addEventListener("click",()=>e.onPlayToggle());const _=v("button",void 0,"PHOTO CAPTURE");_.title="photo capture",_.addEventListener("click",()=>e.onSnapshot());const S=v("button","rec-btn","RECORD START");S.title="record video",S.addEventListener("click",()=>e.onRecordToggle());const R=v("div","group"),T=v("span","lcd small","00:00");R.append(v("span","label","REC"),T),R.style.display="none";const C=v("div","group"),O=v("span","lcd small","—");C.append(v("span","label","FX"),O);const A=v("div","group"),x=v("span","lcd small","60.0");A.append(v("span","label","FPS"),x);const w=v("div","group"),W=v("span","lcd small","120");W.style.cursor="pointer",W.addEventListener("click",()=>e.onTempoTap()),w.append(v("span","label","Tempo"),W,v("span","label","BPM"));const I=v("button","hands-btn","✋︎");I.title="hand tracking",I.addEventListener("click",()=>e.onHandsToggle());const D=v("button",void 0,"⇄");D.title="switch camera",D.addEventListener("click",()=>e.onCameraFlip()),c.append(C,E,_,S,R,v("div","push"),u,A,w,I,D);const ye=v("div","device");return ye.append(n,i,c),t.append(ye),{canvas:s,chromeHeight(){return n.offsetHeight+c.offsetHeight},setDeviceWidth(y){ye.style.width=`${y+4}px`},hideStartOverlay(){a.classList.add("hidden")},showStartError(y){d.textContent="CAMERA ERROR",f.textContent=y,l.style.animationDuration="0.4s"},setFxLabel(y){O.textContent=y},setTransport(y,we,gt,Xt){m.textContent=String(y).padStart(6,"0"),x.textContent=we.toFixed(1),W.textContent=String(gt),E.textContent=Xt?"PAUSE":"PLAY",E.classList.toggle("on",Xt)},setRecording(y){S.textContent=y?"RECORD STOP":"RECORD START",S.classList.toggle("recording",y),T.classList.toggle("rec",y),R.style.display=y?"flex":"none",y||(T.textContent="00:00")},setRecordTime(y){const we=Math.floor(y/60),gt=Math.floor(y)%60;T.textContent=`${String(we).padStart(2,"0")}:${String(gt).padStart(2,"0")}`},setHands(y,we){I.classList.toggle("loading",y==="loading"),I.classList.toggle("on",y==="on"),I.classList.toggle("detect",y==="on"&&we)}}}const co=6,qt=2;let V,st=0,Ct=0,qe=new Float64Array(0),Ye=new Float64Array(0),je=new Float64Array(0),ze=new Float64Array(0),Ke=new Float64Array(0);function uo(t){const{width:e,height:n,data:o}=t;if(e!==st||n!==Ct){st=e,Ct=n;const i=(e+1)*(n+1);qe=new Float64Array(i),Ye=new Float64Array(i),je=new Float64Array(i),ze=new Float64Array(i),Ke=new Float64Array(i)}const r=e+1;for(let i=0;i<n;i++){let s=0,a=0,l=0,d=0,f=0;for(let c=0;c<e;c++){const u=(i*e+c)*4,m=o[u],E=o[u+1],_=o[u+2],S=_e(m,E,_);s+=S,a+=S*S,l+=m,d+=E,f+=_;const R=(i+1)*r+(c+1),T=i*r+(c+1);qe[R]=qe[T]+s,Ye[R]=Ye[T]+a,je[R]=je[T]+l,ze[R]=ze[T]+d,Ke[R]=Ke[T]+f}}}function Re(t,e,n,o,r){const i=st+1;return t[(n+r)*i+(e+o)]-t[n*i+(e+o)]-t[(n+r)*i+e]+t[n*i+e]}function fo(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function Se(t,e,n,o,r,i,s,a,l){const d=n*o,f=Re(qe,t,e,n,o)/d,c=Re(Ye,t,e,n,o)/d-f*f;if(r<co&&n>qt&&o>qt&&c>i){const A=n>>1,x=o>>1;Se(t,e,A,x,r+1,i,s,a,l),Se(t+A,e,n-A,x,r+1,i,s,a,l),Se(t,e+x,A,o-x,r+1,i,s,a,l),Se(t+A,e+x,n-A,o-x,r+1,i,s,a,l);return}const m=Re(je,t,e,n,o)/d,E=Re(ze,t,e,n,o)/d,_=Re(Ke,t,e,n,o)/d,S=fo(t,e,Math.floor(l*2))<.025;V.fillStyle=S?"#2ea44f":`rgb(${Math.round(m)},${Math.round(E)},${Math.round(_)})`;const R=t*s,T=e*a,C=n*s,O=o*a;V.fillRect(R,T,C,O),V.strokeRect(R+.5,T+.5,C-1,O-1)}const mo={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){V=e},render(t){const{width:e,height:n}=V.canvas,{width:o,height:r}=t.sample;uo(t.sample);const i=380+300*Math.sin(t.beat*Math.PI/2);V.fillStyle="#000",V.fillRect(0,0,e,n),V.strokeStyle="#000",V.lineWidth=1,Se(0,0,o,r,0,i,e/o,n/r,t.beat)},dispose(){st=0,Ct=0}},ho=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Yt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const r=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${r}`)}return o}function q(t,e,n=ho){const o=Yt(t,t.VERTEX_SHADER,n),r=Yt(t,t.FRAGMENT_SHADER,e),i=t.createProgram();if(t.attachShader(i,o),t.attachShader(i,r),t.linkProgram(i),t.deleteShader(o),t.deleteShader(r),!t.getProgramParameter(i,t.LINK_STATUS)){const s=t.getProgramInfoLog(i);throw t.deleteProgram(i),new Error(`program link failed: ${s}`)}return i}function ie(t){t.drawArrays(t.TRIANGLES,0,3)}function vo(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:r,texture:o,width:e,height:n}}function an(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const po=`#version 300 es
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
`;let H=null,se=null,sn=null,ln=null,cn=null,un=null;function go(t){const e=H;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(se),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(sn,0),e.uniform2f(ln,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(cn,t.time),e.uniform1i(un,t.mirror?1:0),ie(e)}let Ze,Y=null,Et,Pe=new Float32Array(0),Je=null;function Eo(t){const{width:e,height:n,data:o}=t.sample;Y||(Y=document.createElement("canvas"),Et=Y.getContext("2d")),(Y.width!==e||Y.height!==n)&&(Y.width=e,Y.height=n,Pe=new Float32Array(e*n),Je=Et.createImageData(e,n));for(let a=0,l=0;a<e*n;a++,l+=4)Pe[a]=_e(o[l],o[l+1],o[l+2])/255;const r=Je.data;for(let a=0;a<n;a++)for(let l=0;l<e;l++){let d=0;l>0&&l<e-1&&a>0&&a<n-1&&(d=Pe[(a-1)*e+(l-1)]-Pe[(a+1)*e+(l+1)]);const f=(a*e+l)*4;r[f]=Math.min(255,Math.max(0,248-d*2.3*255)),r[f+1]=Math.min(255,Math.max(0,247-d*1.6*255)),r[f+2]=Math.min(255,Math.max(0,242-d*2.9*255)),r[f+3]=255}Et.putImageData(Je,0,0);const{width:i,height:s}=Ze.canvas;Ze.imageSmoothingEnabled=!0,Ze.drawImage(Y,0,0,i,s)}const xo={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){H=t,Ze=e,H&&!se&&(se=q(H,po),sn=H.getUniformLocation(se,"u_video"),ln=H.getUniformLocation(se,"u_texel"),cn=H.getUniformLocation(se,"u_time"),un=H.getUniformLocation(se,"u_mirror"))},render(t){H&&t.videoTex?go(t):Eo(t)},dispose(){Pe=new Float32Array(0),Je=null}},_o=`#version 300 es
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
`;let N=null,J=null,fn=null,dn=null,mn=null,hn=null,vn=null;function To(t){const e=N,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(J),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(fn,0),e.uniform2f(dn,n,o),e.uniform1f(mn,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(hn,t.time),e.uniform1i(vn,t.mirror?1:0),ie(e)}const yo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),wo=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Le,j=null,xt,Ce=new Float32Array(0),Qe=null;function Ro(t){const{width:e,height:n,data:o}=t.sample;j||(j=document.createElement("canvas"),xt=j.getContext("2d")),(j.width!==e||j.height!==n)&&(j.width=e,j.height=n,Ce=new Float32Array(e*n),Qe=xt.createImageData(e,n));for(let l=0,d=0;l<e*n;l++,d+=4)Ce[l]=_e(o[d],o[d+1],o[d+2])/255;const r=t.time,i=Qe.data;for(let l=0;l<n;l++){const d=l/n,f=Math.sin(d*58+r*2.4)*.55+Math.sin(d*21-r*1.6)*.45,c=yo[l&3];for(let u=0;u<e;u++){const m=Ce[l*e+u];let E=0;for(let T=0;T<4;T++){const C=Math.round(f*(.006+T*.014)*(.35+m)*e),O=Math.min(e-1,Math.max(0,u+C));E=Math.max(E,Ce[l*e+O]*Math.pow(.7,T))}const _=E+(c[u&3]-.5)*.28,S=wo[_>.72?0:_>.45?1:_>.24?2:3],R=(l*e+u)*4;i[R]=S[0],i[R+1]=S[1],i[R+2]=S[2],i[R+3]=255}}xt.putImageData(Qe,0,0);const{width:s,height:a}=Le.canvas;Le.imageSmoothingEnabled=!1,Le.drawImage(j,0,0,s,a),Le.imageSmoothingEnabled=!0}const bo={id:"wave",name:"WAVE",usesGl:!0,init(t,e){N=t,Le=e,N&&!J&&(J=q(N,_o),fn=N.getUniformLocation(J,"u_video"),dn=N.getUniformLocation(J,"u_res"),mn=N.getUniformLocation(J,"u_cell"),hn=N.getUniformLocation(J,"u_time"),vn=N.getUniformLocation(J,"u_mirror"))},render(t){N&&t.videoTex?To(t):Ro(t)},dispose(){Ce=new Float32Array(0),Qe=null}},So=`#version 300 es
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
`;let Q=null,he=null,pn=null,gn=null,En=null;function Po(t){const e=Q;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(he),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(pn,0),e.uniform1f(gn,t.time),e.uniform1i(En,t.mirror?1:0),ie(e)}const Lo=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Me,z=null,_t,et=null;function Co(t){const{width:e,height:n,data:o}=t.sample;z||(z=document.createElement("canvas"),_t=z.getContext("2d")),(z.width!==e||z.height!==n)&&(z.width=e,z.height=n,et=_t.createImageData(e,n));const r=et.data;for(let a=0;a<n;a++)for(let l=0;l<e;l++){const d=(a*e+l)*4,f=(Math.random()-.5)*.16,c=_e(o[d],o[d+1],o[d+2])/255+f,u=Lo[c<.3?0:c<.52?1:c<.72?2:3];r[d]=u[0],r[d+1]=u[1],r[d+2]=u[2],r[d+3]=255}_t.putImageData(et,0,0);const{width:i,height:s}=Me.canvas;Me.imageSmoothingEnabled=!1,Me.drawImage(z,0,0,i,s),Me.imageSmoothingEnabled=!0}const Mo={id:"riso",name:"RISO",usesGl:!0,init(t,e){Q=t,Me=e,Q&&!he&&(he=q(Q,So),pn=Q.getUniformLocation(he,"u_video"),gn=Q.getUniformLocation(he,"u_time"),En=Q.getUniformLocation(he,"u_mirror"))},render(t){Q&&t.videoTex?Po(t):Co(t)},dispose(){et=null}},Ao=`#version 300 es
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
`,Io=`#version 300 es
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
`,Tt=200,ge={wave:1,trail:.14},yt=[1,2,3.5,.4],Fo=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Uo=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let P=null,B=null,Mt=null,xn=null,_n=null,Tn=null,yn=null,wn=null,Rn=null,bn=null,At=null,Sn=null,$=null,De=!0;function Do(t){const e=P,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!$||$.width!==n||$.height!==o)&&($&&an(e,$),$=vo(e,n,o),De=!0),e.bindFramebuffer(e.FRAMEBUFFER,$.framebuffer),e.viewport(0,0,n,o),De&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),De=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(Mt),e.uniform1f(bn,ge.trail),ie(e);const r=Math.max(2,Math.round(Tt*t.video.videoHeight/t.video.videoWidth));e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(xn,0),e.uniform2f(_n,Tt,r),e.uniform2f(Tn,n,o),e.uniform1f(yn,t.time),e.uniform1f(wn,ge.wave),e.uniform1i(Rn,t.mirror?1:0),e.drawArrays(e.POINTS,0,Tt*r),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(At),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,$.texture),e.uniform1i(Sn,0),ie(e)}const jt=2;let It,G=null,ae,ke=!0;function ko(t){const{width:e,height:n}=It.canvas,{width:o,height:r,data:i}=t.sample;G||(G=document.createElement("canvas"),ae=G.getContext("2d")),(G.width!==e||G.height!==n)&&(G.width=e,G.height=n,ke=!0),ke?(ae.fillStyle="#000",ae.fillRect(0,0,e,n),ke=!1):(ae.fillStyle=`rgba(0,0,0,${ge.trail})`,ae.fillRect(0,0,e,n));const s=e/o,a=n/r,l=t.time,d=ge.wave;for(let f=0;f<r;f+=jt)for(let c=0;c<o;c+=jt){const u=(f*o+c)*4,m=_e(i[u],i[u+1],i[u+2])/255;if(m<.04)continue;const E=Math.sin(l*2+c*.35+f*.18)*(1+m*5)*s*.6*d,_=Math.cos(l*1.6+f*.28+c*.11)*(1+m*3)*a*.4*d,S=Math.round(24+m*60),R=Math.round(90+m*150),T=Math.round(200+m*55),C=(.6+m*2.6)*s*.5;ae.fillStyle=`rgba(${S},${R},${T},${.2+m*.8})`,ae.fillRect(c*s+E,f*a+_,C,C)}It.drawImage(G,0,0)}const $o={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){P=t,It=e,ke=!0,De=!0,P&&!B&&(B=q(P,Io,Ao),xn=P.getUniformLocation(B,"u_video"),_n=P.getUniformLocation(B,"u_grid"),Tn=P.getUniformLocation(B,"u_res"),yn=P.getUniformLocation(B,"u_time"),wn=P.getUniformLocation(B,"u_wave"),Rn=P.getUniformLocation(B,"u_mirror"),Mt=q(P,Fo),bn=P.getUniformLocation(Mt,"u_alpha"),At=q(P,Uo),Sn=P.getUniformLocation(At,"u_tex"))},render(t){P&&t.videoTex?Do(t):ko(t)},dispose(){P&&$&&an(P,$),$=null,G=null,ke=!0,De=!0},onReselect(){const t=yt.indexOf(ge.wave);ge.wave=yt[(t+1)%yt.length]}},Oo=`#version 300 es
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
`;let lt=!1,k=null,X=null,Pn=null,Ln=null,Cn=null,Mn=null,An=null,In=null;function No(t){const e=k,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(X),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Pn,0),e.uniform2f(Ln,n,o),e.uniform1f(Cn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(Mn,t.time),e.uniform1i(An,t.mirror?1:0),e.uniform1i(In,lt?1:0),ie(e)}const Wo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Ho={r:238,g:244,b:250},Bo={r:22,g:72,b:158},Go=.12;let Ae,K=null,wt,tt=null;function Xo(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),wt=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,tt=wt.createImageData(e,n));const r=tt.data;for(let a=0;a<n;a++){const l=Wo[a&3];for(let d=0;d<e;d++){const f=(a*e+d)*4;let u=_e(o[f],o[f+1],o[f+2])/255+(Math.random()-.5)*Go>l[d&3];lt&&(u=!u);const m=u?Ho:Bo;r[f]=m.r,r[f+1]=m.g,r[f+2]=m.b,r[f+3]=255}}wt.putImageData(tt,0,0);const{width:i,height:s}=Ae.canvas;Ae.imageSmoothingEnabled=!1,Ae.drawImage(K,0,0,i,s),Ae.imageSmoothingEnabled=!0}const Vo={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){k=t,Ae=e,k&&!X&&(X=q(k,Oo),Pn=k.getUniformLocation(X,"u_video"),Ln=k.getUniformLocation(X,"u_res"),Cn=k.getUniformLocation(X,"u_cell"),Mn=k.getUniformLocation(X,"u_time"),An=k.getUniformLocation(X,"u_mirror"),In=k.getUniformLocation(X,"u_invert"))},render(t){k&&t.videoTex?No(t):Xo(t)},dispose(){tt=null},onReselect(){lt=!lt}},qo=`#version 300 es
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
`,$e=60,Fn=480,Un=270,Yo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let L=null,nt=null,ee=null,Dn=null,kn=null,$n=null,On=null,Nn=null,Wn=null,Hn=null,oe=null,Oe=null,ve=-1,Ne=0;function jo(t){oe=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,oe),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,Fn,Un,$e),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Oe=t.createFramebuffer(),ve=-1,Ne=0}function zo(){L&&(oe&&L.deleteTexture(oe),Oe&&L.deleteFramebuffer(Oe),oe=null,Oe=null,ve=-1,Ne=0)}function Ko(t){const e=L;ve=(ve+1)%$e,Ne=Math.min(Ne+1,$e),e.bindFramebuffer(e.FRAMEBUFFER,Oe),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,oe,0,ve),e.viewport(0,0,Fn,Un),e.useProgram(nt),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Dn,0),ie(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ee),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,oe),e.uniform1i(kn,0),e.uniform1f($n,ve),e.uniform1f(On,$e),e.uniform1f(Nn,Ne),e.uniform1f(Wn,t.beat),e.uniform1i(Hn,t.mirror?1:0),ie(e)}let ot,Z=null,Rt,it=null,le=[];function Zo(t){const{width:e,height:n,data:o}=t.sample;Z||(Z=document.createElement("canvas"),Rt=Z.getContext("2d")),(Z.width!==e||Z.height!==n)&&(Z.width=e,Z.height=n,it=Rt.createImageData(e,n),le=[]),le.push(new Uint8ClampedArray(o)),le.length>$e&&le.shift();const r=le.length-1,i=it.data;for(let l=0;l<n;l++){let d=l/Math.max(1,n-1)*r;d+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const f=Math.round(Math.min(r,Math.max(0,d))),c=le[r-f],u=l*e*4;i.set(c.subarray(u,u+e*4),u)}Rt.putImageData(it,0,0);const{width:s,height:a}=ot.canvas;ot.imageSmoothingEnabled=!0,ot.drawImage(Z,0,0,s,a)}const Jo={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){L=t,ot=e,L&&(nt||(nt=q(L,Yo),Dn=L.getUniformLocation(nt,"u_video"),ee=q(L,qo),kn=L.getUniformLocation(ee,"u_history"),$n=L.getUniformLocation(ee,"u_head"),On=L.getUniformLocation(ee,"u_layers"),Nn=L.getUniformLocation(ee,"u_filled"),Wn=L.getUniformLocation(ee,"u_beat"),Hn=L.getUniformLocation(ee,"u_mirror")),jo(L))},render(t){L&&t.videoTex&&oe?Ko(t):Zo(t)},dispose(){zo(),le=[],it=null}},Ft=[mo,xo,bo,Mo,$o,Vo,Jo];function _e(t,e,n){return .2126*t+.7152*e+.0722*n}function Qo(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,r=0;return{gl:e,videoTex:n,uploadVideo(i){const s=i.videoWidth,a=i.videoHeight;s===0||a===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||a!==r?(o=s,r=a,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,i)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,i))},dispose(){e.deleteTexture(n)}}}const ei="modulepreload",ti=function(t,e){return new URL(t,e).href},zt={},ni=function(e,n,o){let r=Promise.resolve();if(n&&n.length>0){let d=function(f){return Promise.all(f.map(c=>Promise.resolve(c).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const s=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");r=d(n.map(f=>{if(f=ti(f,o),f in zt)return;zt[f]=!0;const c=f.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(o)for(let E=s.length-1;E>=0;E--){const _=s[E];if(_.href===f&&(!c||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${f}"]${u}`))return;const m=document.createElement("link");if(m.rel=c?"stylesheet":ei,c||(m.as="script"),m.crossOrigin="",m.href=f,l&&m.setAttribute("nonce",l),document.head.appendChild(m),c)return new Promise((E,_)=>{m.addEventListener("load",E),m.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${f}`)))})}))}function i(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return r.then(s=>{for(const a of s||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})};let ue="off",Ee=null,Ut=-1,Dt=0,ct={hands:0,pinching:0,points:[],corners:null};const Kt=.4,oi=.6,Zt=2,Ie=new Map,ii=1100,ri=3,Jt=.05,ai=1500,Fe=new Map;let ut=!1,Qt=0;function si(){const t=ut;return ut=!1,t}const li=1e3,ci=2e3,te=new Map;let ft=!1,en=0;function ui(){const t=ft;return ft=!1,t}function kt(){return ue}function Ge(){return ct}async function Bn(){if(ue==="off"){ue="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await ni(async()=>{const{FilesetResolver:i,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:i,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),r=i=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:i},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{Ee=await e.createFromOptions(o,r("GPU"))}catch{Ee=await e.createFromOptions(o,r("CPU"))}ue="on"}catch(t){throw ue="off",t}}}function fi(){Ee?.close(),Ee=null,ue="off",Ut=-1,Dt=0,Ie.clear(),Fe.clear(),te.clear(),ut=!1,ft=!1,ct={hands:0,pinching:0,points:[],corners:null}}function di(t,e){if(ue!=="on"||!Ee||t.currentTime===Ut)return;const n=ct.hands>0?33:100;if(e-Dt<n)return;Ut=t.currentTime,Dt=e;const o=Ee.detectForVideo(t,e),r=[],i=o.landmarks?.length??0,s=t.videoWidth||1280,a=t.videoHeight||720,l=(c,u)=>Math.hypot((c.x-u.x)*s,(c.y-u.y)*a),d=new Set;for(let c=0;c<i;c++){const u=o.landmarks[c];let m=o.handednesses?.[c]?.[0]?.categoryName??`hand${c}`;d.has(m)&&(m=`${m}${c}`),d.add(m);const E=u[4],_=u[8],S=l(u[5],u[17]),T=l(E,_)/Math.max(S,1e-6);let C=0;for(const[I,D]of[[8,6],[12,10],[16,14],[20,18]])l(u[0],u[I])>l(u[0],u[D])*1.15&&C++;const O=C>=3,A=C<=1;let x=Ie.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Ie.set(m,x)),A?(x.down=!1,x.onFrames=0,x.offFrames=0):T<Kt?(x.onFrames++,x.offFrames=0,x.onFrames>=Zt&&(x.down=!0)):T>oi?(x.offFrames++,x.onFrames=0,x.offFrames>=Zt&&(x.down=!1)):(x.onFrames=0,x.offFrames=0);let w=Fe.get(m);if(w||(w={dir:0,extreme:u[9].x*s,reversals:[]},Fe.set(m,w)),O&&!x.down){const I=u[9].x*s,D=I-w.extreme;w.dir===0?Math.abs(D)>Jt*s&&(w.dir=Math.sign(D),w.extreme=I):Math.sign(D)===w.dir?w.extreme=I:Math.abs(D)>Jt*s&&(w.dir=Math.sign(D),w.extreme=I,w.reversals.push(e),w.reversals=w.reversals.filter(ye=>e-ye<ii),w.reversals.length>=ri&&e>Qt&&(ut=!0,Qt=e+ai,w.reversals=[]))}else w.dir=0,w.extreme=u[9].x*s,w.reversals=[];let W=0;A&&e>en?(te.has(m)||te.set(m,e),W=Math.min(1,(e-te.get(m))/li),W>=1&&(ft=!0,en=e+ci,te.delete(m),W=0)):te.delete(m),r.push({handedness:m,thumb:{x:E.x,y:E.y},index:{x:_.x,y:_.y},threshold:Kt*S/s,ratio:T,pinching:x.down,open:O,fist:A,fistProgress:W,palm:{x:u[9].x,y:u[9].y},x:(E.x+_.x)/2,y:(E.y+_.y)/2})}for(const c of[...Ie.keys()])d.has(c)||Ie.delete(c);for(const c of[...Fe.keys()])d.has(c)||Fe.delete(c);for(const c of[...te.keys()])d.has(c)||te.delete(c);const f=r.filter(c=>c.pinching);ct={hands:i,pinching:f.length,points:r,corners:f.length>=2?[f[0],f[1]]:null}}function Gn(t,e,n,o){const r=Math.max(n/t,o/e),i=t*r,s=e*r;return{x:(n-i)/2,y:(o-s)/2,w:i,h:s}}function We(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function Xn(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const rt={minDist:1.5,baseWidth:6,maxPoints:2e4,bufferMs:250},$t=["#ffffff","#141414","#8a8a8a","#1f6bff","#9cc3ff"];let Nt=$t[0];function mi(t){Nt=t}const fe=new Map,re=[];let xe=0,M=null,F=null,ne=[],Ue={x0:0,y0:0,x1:0,y1:0},Vn=-1,qn=0;function hi(t,e){const n=Math.max(12,t*.022),o=n*2.2,r=n*2.7,i=r*($t.length-1),s=e/2-i/2;ne=$t.map((a,l)=>({x:o,y:s+l*r,r:n,color:a})),Ue={x0:0,y0:s-r,x1:o+n*1.9,y1:s+i+r}}function vi(t){return t.x>=Ue.x0&&t.x<=Ue.x1&&t.y>=Ue.y0&&t.y<=Ue.y1}function pi(t,e){for(let n=0;n<ne.length;n++){const o=ne[n],r=n===Vn&&e<qn,i=o.color===Nt,s=o.r*(r?1.35:i?1.15:1);t.beginPath(),t.arc(o.x,o.y,s,0,Math.PI*2),t.fillStyle=o.color,t.fill(),t.lineWidth=2,t.strokeStyle="rgba(20,20,20,0.6)",t.stroke(),i&&(t.beginPath(),t.arc(o.x,o.y,s+4,0,Math.PI*2),t.lineWidth=2,t.strokeStyle="#ffffff",t.stroke())}}function gi(){F&&(F.lineCap="round",F.lineJoin="round")}function Ei(t,e){if(M||(M=document.createElement("canvas"),F=M.getContext("2d")),M.width===t&&M.height===e)return;const n=M.width,o=M.height;if(n>0&&o>0){const r=t/n,i=e/o,s=(r+i)/2;for(const a of re)for(const l of a.pts)l.x*=r,l.y*=i,l.w*=s}M.width=t,M.height=e,hi(t,e),gi(),Ht()}function Yn(t,e,n){const o=e.pts;if(t.strokeStyle=e.color,t.lineCap="round",t.lineJoin="round",n===1){t.lineWidth=o[1].w,t.beginPath(),t.moveTo(o[0].x,o[0].y),t.lineTo((o[0].x+o[1].x)/2,(o[0].y+o[1].y)/2),t.stroke();return}const r=o[n-2],i=o[n-1],s=o[n],a={x:(r.x+i.x)/2,y:(r.y+i.y)/2},l={x:(i.x+s.x)/2,y:(i.y+s.y)/2};t.lineWidth=i.w,t.beginPath(),t.moveTo(a.x,a.y),t.quadraticCurveTo(i.x,i.y,l.x,l.y),t.stroke()}function jn(t,e){const n=e.pts[0];t.fillStyle=e.color,t.beginPath(),t.arc(n.x,n.y,n.w/2,0,Math.PI*2),t.fill()}function Wt(t,e){if(e.pts.length!==0){if(e.pts.length===1){jn(t,e);return}for(let n=1;n<e.pts.length;n++)Yn(t,e,n)}}function Ht(){if(!(!M||!F)){F.clearRect(0,0,M.width,M.height);for(const t of re)Wt(F,t)}}function zn(t){!t.stroke||!F||(t.pendingSince=-1,Wt(F,t.stroke),t.inked=t.stroke.pts.length,re.push(t.stroke))}function bt(t){t.stroke&&t.pendingSince>=0&&zn(t),t.stroke&&t.stroke.pts.length===1&&F&&jn(F,t.stroke),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Kn(t){xe-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function xi(){let t=!1;for(;xe>rt.maxPoints&&re.length>0;)xe-=re.shift().pts.length,t=!0;t&&Ht()}function _i(t,e,n,o,r){const i=new Set;for(const s of t){i.add(s.handedness);let a=fe.get(s.handedness);a||(a={drawing:!1,stroke:null,pendingSince:-1,inked:0,wasPinching:!1},fe.set(s.handedness,a));const l=Xn(We(s.thumb,e,n),We(s.index,e,n)),d=s.pinching&&!a.wasPinching;a.wasPinching=s.pinching;const f=vi(l);if(d&&f&&!o){for(let u=0;u<ne.length;u++)if(Math.hypot(l.x-ne[u].x,l.y-ne[u].y)<ne[u].r*1.6){mi(ne[u].color),Vn=u,qn=r+300;break}continue}if(o&&a.drawing){a.pendingSince>=0?Kn(a):bt(a);continue}if(a.drawing&&(!s.pinching||f)){bt(a);continue}if(!a.drawing&&s.pinching&&!o&&!f&&(a.drawing=!0,a.stroke={color:Nt,pts:[]},a.pendingSince=r,a.inked=0),!a.drawing||!a.stroke)continue;const c=a.stroke.pts[a.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=rt.minDist)&&(a.stroke.pts.push({x:l.x,y:l.y,w:rt.baseWidth}),xe++),a.pendingSince>=0)r-a.pendingSince>rt.bufferMs&&zn(a);else if(F)for(;a.inked<a.stroke.pts.length;)a.inked++,a.inked>=2&&Yn(F,a.stroke,a.inked-1)}for(const[s,a]of fe)!i.has(s)&&a.drawing&&bt(a);xi()}function Ti(t){M&&(re.length>0||yi())&&t.drawImage(M,0,0);for(const e of fe.values())e.drawing&&e.pendingSince>=0&&e.stroke&&Wt(t,e.stroke)}function yi(){for(const t of fe.values())if(t.drawing)return!0;return!1}function Zn(t){return fe.get(t)?.drawing??!1}function Jn(){for(const t of fe.values())Kn(t);re.length=0,xe=0,Ht()}function wi(){return{strokes:re.length,points:xe}}const tn=128,Ri=2,St=[90,100,110,120,128,140],Xe=.08,bi=400,Si=150;let p,g=null,h,dt,Qn,mt,ce=null,Pt=!1,Lt=!1,He=null,at=0;const ht=document.createElement("canvas"),me=ht.getContext("2d",{willReadFrequently:!0}),pe=new so,Be=new rn;let eo=0;const Pi=new ImageData(2,2),U=[];let b=null,Te=0,nn=0,be=null;const vt=new Set;function de(){return Ft[Te%Ft.length]}function Bt(t){vt.has(t.id)||(t.init(ce?.gl??null,Qn),vt.add(t.id))}function pt(){const t=new Set;for(const e of U)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...vt])t.has(e)||(Ft.find(n=>n.id===e)?.dispose(),vt.delete(e))}function Li(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const Ve=.06;function Ci(t){const e=t.map(s=>({x:g.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),r=Math.min(e[0].y,e[1].y),i=Math.max(e[0].y,e[1].y);return n<Ve&&(n=0),r<Ve&&(r=0),o>1-Ve&&(o=1),i>1-Ve&&(i=1),o-n<Xe&&(o=n+Xe),i-r<Xe&&(i=r+Xe),{x0:n,y0:r,x1:o,y1:i}}function Mi(t){const e=Ge();if(e.corners&&g){nn=t;const n=Ci(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(be===null&&(be=t),t-be<Si)return;be=null,b={rect:n,effect:de()},Te++,Bt(b.effect),p.setFxLabel(b.effect.name)}return}be=null,b&&t-nn>bi&&(to(b),b=null)}function to(t){for(let e=U.length-1;e>=0;e--)Li(t.rect,U[e].rect)&&U.splice(e,1);U.push(t),pt(),p.setFxLabel(`NEXT ${de().name}`)}function Gt(){if(!g)return;const t=g.video.videoWidth||4,e=g.video.videoHeight||3,n=16,o=4,r=Math.max(64,window.innerWidth-n*2-o),i=Math.max(64,window.innerHeight-n*2-o-p.chromeHeight()),s=Math.min(r/t,i/e),a=Math.round(t*s),l=Math.round(e*s),d=Math.min(Ri,window.devicePixelRatio||1);p.canvas.style.width=`${a}px`,p.canvas.style.height=`${l}px`,p.setDeviceWidth(a);for(const f of[p.canvas,dt,mt])f.width=Math.round(a*d),f.height=Math.round(l*d);Ei(p.canvas.width,p.canvas.height),ht.width=tn,ht.height=Math.max(2,Math.round(tn*e/t))}function Ai(){const{width:t,height:e}=ht;return me.save(),g.mirror&&(me.translate(t,0),me.scale(-1,1)),me.drawImage(g.video,0,0,t,e),me.restore(),me.getImageData(0,0,t,e)}function Ii(){const{width:t,height:e}=p.canvas;h.save(),g.mirror&&(h.translate(t,0),h.scale(-1,1)),h.drawImage(g.video,0,0,t,e),h.restore()}function on(t,e,n){const{width:o,height:r}=p.canvas,i=t.rect.x0*o,s=t.rect.y0*r,a=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*r;h.drawImage(e,i,s,a,l,i,s,a,l),h.strokeStyle="#ffffff",h.lineWidth=Math.max(2,o/640),n&&h.setLineDash([10,8]),h.strokeRect(i,s,a,l),h.setLineDash([])}function Fi(t){Ii();const e=U.map(a=>({f:a,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:a})=>a.effect.usesGl&&ce),o=e.some(({f:a})=>!(a.effect.usesGl&&ce));n&&ce.uploadVideo(g.video);const r={videoTex:n?ce.videoTex:null,sample:o?Ai():Pi,video:g.video,mirror:g.mirror,time:t.time,frame:t.frame,beat:t.beat};let i=null,s=null;for(const{f:a,isDrawing:l}of e)!!a.effect.usesGl&&!!ce?(s!==a.effect&&(a.effect.render(r),s=a.effect),on(a,mt,l)):(i!==a.effect&&(a.effect.render(r),i=a.effect),on(a,dt,l))}function Ui(){const t=Ge();if(t.points.length===0||!g)return;const{width:e,height:n}=p.canvas,o=Gn(g.video.videoWidth||4,g.video.videoHeight||3,e,n);h.lineWidth=Math.max(2,e/500);for(const r of t.points){if(r.fist){if(r.fistProgress>0){const c=We(r.palm,o,g.mirror),u=Math.max(14,e*.03);h.save(),h.lineWidth=Math.max(3,e/400),h.strokeStyle="rgba(255,255,255,0.35)",h.beginPath(),h.arc(c.x,c.y,u,0,Math.PI*2),h.stroke(),h.strokeStyle="#ffffff",h.beginPath(),h.arc(c.x,c.y,u,-Math.PI/2,-Math.PI/2+Math.PI*2*r.fistProgress),h.stroke(),h.restore()}continue}const i=We(r.thumb,o,g.mirror),s=We(r.index,o,g.mirror),l=Zn(r.handedness)?"#28c840":r.pinching?"#1f6bff":"#ffffff";h.strokeStyle=l,h.save(),h.lineWidth=Math.max(1,e/900),h.beginPath(),h.moveTo(i.x,i.y),h.lineTo(s.x,s.y),h.stroke(),h.restore();const d=Math.max(8,r.threshold*o.w/2);for(const c of[i,s])h.beginPath(),h.arc(c.x,c.y,d,0,Math.PI*2),h.stroke();const f=Xn(i,s);h.beginPath(),h.arc(f.x,f.y,Math.max(3,e/240),0,Math.PI*2),h.fillStyle=l,h.fill()}}function Di(){if(!He)return;const t=Ge(),e=wi(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.fist?"FIST ":o.open?"OPEN ":"  -  "} ${Zn(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),He.textContent=n.join(`
`)}function no(t){requestAnimationFrame(no);const e=pe.tick(t),n=g!==null&&g.video.readyState>=2;if(n&&(di(g.video,t),ui()&&Wi(t),si()&&(Jn(),at=t+200),Mi(t)),e.playing&&n){const o=Ge(),r=b!==null||o.pinching>=2,i=Gn(g.video.videoWidth||4,g.video.videoHeight||3,p.canvas.width,p.canvas.height);_i(o.points,i,g.mirror,r,t),Fi(e),Ti(h),o.hands>0&&pi(h,t),Ui(),t<at&&(h.fillStyle=`rgba(255,255,255,${.8*(at-t)/280})`,h.fillRect(0,0,p.canvas.width,p.canvas.height)),Di()}Be.captureFrame(p.canvas),Be.recording&&p.setRecordTime((t-eo)/1e3),p.setHands(kt(),Ge().hands>0),p.setTransport(e.frame,e.fps,e.bpm,e.playing)}function oo(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function ki(){if(!g||!rn.supported())return;if(!Be.recording){Be.start(p.canvas),eo=performance.now(),p.setRecording(!0);return}p.setRecording(!1);const t=await Be.stop();t&&oo(t.blob,`null8_${pe.timecode().replaceAll(":","")}.${t.ext}`)}async function $i(){if(kt()!=="loading"){if(kt()==="on"){fi();return}p.setHands("loading",!1);try{await Bn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Oi(){if(!g||Lt)return;Lt=!0;const t=g.facing;try{g=await ro(g)}catch{g=await Ot(t)}finally{Lt=!1}Gt()}function Ni(){p.canvas.toBlob(t=>{t&&oo(t,`null8_${pe.timecode().replaceAll(":","")}.png`)},"image/png")}function Wi(t){U.length=0,b=null,Jn(),pt(),Te=0,p.setFxLabel(`NEXT ${de().name}`),at=t+280}function Hi(){U.length>0?(U.pop(),pt()):Te++,p.setFxLabel(`NEXT ${de().name}`)}async function Bi(){if(!(g||Pt)){Pt=!0;try{g=await Ot("user"),p.hideStartOverlay(),Gt(),requestAnimationFrame(no),Bn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=de();Te++,Bt(e),U.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),p.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);p.showStartError(e),Pt=!1}}}function Gi(){const t=document.getElementById("app");p=lo(t,{onStart:()=>{Bi()},onCanvasTap:Hi,onPlayToggle:()=>pe.toggle(),onSnapshot:Ni,onTempoTap:()=>{const e=St.indexOf(pe.bpm);pe.bpm=St[(e+1)%St.length]},onRecordToggle:()=>{ki()},onCameraFlip:()=>{Oi()},onHandsToggle:()=>{$i()}}),h=p.canvas.getContext("2d"),dt=document.createElement("canvas"),Qn=dt.getContext("2d"),mt=document.createElement("canvas"),ce=Qo(mt),p.setFxLabel(`NEXT ${de().name}`),window.addEventListener("resize",Gt),new URLSearchParams(location.search).has("debug")&&(He=document.createElement("pre"),He.className="debug-hud",document.body.appendChild(He)),window.__null8={addFrame(e){const n=de();Te++,Bt(n),to({rect:e,effect:n})},clearFrames(){U.length=0,pt()},get frames(){return U.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Gi();
