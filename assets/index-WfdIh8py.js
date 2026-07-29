(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();async function Wt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function no(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function oo(t){const e=t.facing==="user"?"environment":"user";return no(t),Wt(e)}const ro=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class rn{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=ro.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(a=>{e.onstop=()=>a()});e.stop(),await n;for(const a of this.stream?.getTracks()??[])a.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",r=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:r}}}const Vt=60;class io{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,r=Math.floor(e)%60,a=Math.floor(e*Vt)%Vt,s=i=>String(i).padStart(2,"0");return`${s(n)}:${s(o)}:${s(r)}:${s(a)}`}}function v(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function ao(t,e){const n=v("header","titlebar"),o=v("div","traffic");for(const w of["r","y","g"])o.appendChild(v("span",w));const r=v("div","path","/project1/null8 (128,128)");n.append(o,r,v("div","spacer"));const a=v("div","viewport"),s=v("canvas");a.appendChild(s),a.addEventListener("click",()=>e.onCanvasTap());const i=v("div","start-overlay"),l=v("div","pulse"),c=v("div","big","TAP TO START"),f=v("div","sub",`webcam access required
HTTPS or localhost only`);i.append(l,c,f),i.addEventListener("click",w=>{w.stopPropagation(),e.onStart()}),a.appendChild(i);const u=v("footer","transport"),d=v("div","group"),m=v("span","lcd small","0");d.append(v("span","label","F"),m);const E=v("button","on","PAUSE");E.title="play / pause",E.addEventListener("click",()=>e.onPlayToggle());const _=v("button",void 0,"PHOTO CAPTURE");_.title="photo capture",_.addEventListener("click",()=>e.onSnapshot());const S=v("button","rec-btn","RECORD START");S.title="record video",S.addEventListener("click",()=>e.onRecordToggle());const R=v("div","group"),T=v("span","lcd small","00:00");R.append(v("span","label","REC"),T),R.style.display="none";const C=v("div","group"),O=v("span","lcd small","—");C.append(v("span","label","FX"),O);const M=v("div","group"),x=v("span","lcd small","60.0");M.append(v("span","label","FPS"),x);const y=v("div","group"),B=v("span","lcd small","120");B.style.cursor="pointer",B.addEventListener("click",()=>e.onTempoTap()),y.append(v("span","label","Tempo"),B,v("span","label","BPM"));const I=v("button","hands-btn","✋︎");I.title="hand tracking",I.addEventListener("click",()=>e.onHandsToggle());const U=v("button",void 0,"⇄");U.title="switch camera",U.addEventListener("click",()=>e.onCameraFlip()),u.append(C,E,_,S,R,v("div","push"),d,M,y,I,U);const Re=v("div","device");return Re.append(n,a,u),t.append(Re),{canvas:s,chromeHeight(){return n.offsetHeight+u.offsetHeight},setDeviceWidth(w){Re.style.width=`${w+4}px`},hideStartOverlay(){i.classList.add("hidden")},showStartError(w){c.textContent="CAMERA ERROR",f.textContent=w,l.style.animationDuration="0.4s"},setFxLabel(w){O.textContent=w},setTransport(w,be,Et,Xt){m.textContent=String(w).padStart(6,"0"),x.textContent=be.toFixed(1),B.textContent=String(Et),E.textContent=Xt?"PAUSE":"PLAY",E.classList.toggle("on",Xt)},setRecording(w){S.textContent=w?"RECORD STOP":"RECORD START",S.classList.toggle("recording",w),T.classList.toggle("rec",w),R.style.display=w?"flex":"none",w||(T.textContent="00:00")},setRecordTime(w){const be=Math.floor(w/60),Et=Math.floor(w)%60;T.textContent=`${String(be).padStart(2,"0")}:${String(Et).padStart(2,"0")}`},setHands(w,be){I.classList.toggle("loading",w==="loading"),I.classList.toggle("on",w==="on"),I.classList.toggle("detect",w==="on"&&be)}}}const so=6,qt=2;let q,lt=0,At=0,Ye=new Float64Array(0),je=new Float64Array(0),ze=new Float64Array(0),Ke=new Float64Array(0),Ze=new Float64Array(0);function lo(t){const{width:e,height:n,data:o}=t;if(e!==lt||n!==At){lt=e,At=n;const a=(e+1)*(n+1);Ye=new Float64Array(a),je=new Float64Array(a),ze=new Float64Array(a),Ke=new Float64Array(a),Ze=new Float64Array(a)}const r=e+1;for(let a=0;a<n;a++){let s=0,i=0,l=0,c=0,f=0;for(let u=0;u<e;u++){const d=(a*e+u)*4,m=o[d],E=o[d+1],_=o[d+2],S=we(m,E,_);s+=S,i+=S*S,l+=m,c+=E,f+=_;const R=(a+1)*r+(u+1),T=a*r+(u+1);Ye[R]=Ye[T]+s,je[R]=je[T]+i,ze[R]=ze[T]+l,Ke[R]=Ke[T]+c,Ze[R]=Ze[T]+f}}}function Se(t,e,n,o,r){const a=lt+1;return t[(n+r)*a+(e+o)]-t[n*a+(e+o)]-t[(n+r)*a+e]+t[n*a+e]}function co(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function Le(t,e,n,o,r,a,s,i,l){const c=n*o,f=Se(Ye,t,e,n,o)/c,u=Se(je,t,e,n,o)/c-f*f;if(r<so&&n>qt&&o>qt&&u>a){const M=n>>1,x=o>>1;Le(t,e,M,x,r+1,a,s,i,l),Le(t+M,e,n-M,x,r+1,a,s,i,l),Le(t,e+x,M,o-x,r+1,a,s,i,l),Le(t+M,e+x,n-M,o-x,r+1,a,s,i,l);return}const m=Se(ze,t,e,n,o)/c,E=Se(Ke,t,e,n,o)/c,_=Se(Ze,t,e,n,o)/c,S=co(t,e,Math.floor(l*2))<.025;q.fillStyle=S?"#2ea44f":`rgb(${Math.round(m)},${Math.round(E)},${Math.round(_)})`;const R=t*s,T=e*i,C=n*s,O=o*i;q.fillRect(R,T,C,O),q.strokeRect(R+.5,T+.5,C-1,O-1)}const uo={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){q=e},render(t){const{width:e,height:n}=q.canvas,{width:o,height:r}=t.sample;lo(t.sample);const a=380+300*Math.sin(t.beat*Math.PI/2);q.fillStyle="#000",q.fillRect(0,0,e,n),q.strokeStyle="#000",q.lineWidth=1,Le(0,0,o,r,0,a,e/o,n/r,t.beat)},dispose(){lt=0,At=0}},fo=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Yt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const r=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${r}`)}return o}function j(t,e,n=fo){const o=Yt(t,t.VERTEX_SHADER,n),r=Yt(t,t.FRAGMENT_SHADER,e),a=t.createProgram();if(t.attachShader(a,o),t.attachShader(a,r),t.linkProgram(a),t.deleteShader(o),t.deleteShader(r),!t.getProgramParameter(a,t.LINK_STATUS)){const s=t.getProgramInfoLog(a);throw t.deleteProgram(a),new Error(`program link failed: ${s}`)}return a}function ie(t){t.drawArrays(t.TRIANGLES,0,3)}function mo(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:r,texture:o,width:e,height:n}}function an(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const ho=`#version 300 es
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
`;let H=null,le=null,sn=null,ln=null,cn=null,un=null;function vo(t){const e=H;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(le),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(sn,0),e.uniform2f(ln,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(cn,t.time),e.uniform1i(un,t.mirror?1:0),ie(e)}let Je,z=null,xt,Ce=new Float32Array(0),Qe=null;function po(t){const{width:e,height:n,data:o}=t.sample;z||(z=document.createElement("canvas"),xt=z.getContext("2d")),(z.width!==e||z.height!==n)&&(z.width=e,z.height=n,Ce=new Float32Array(e*n),Qe=xt.createImageData(e,n));for(let i=0,l=0;i<e*n;i++,l+=4)Ce[i]=we(o[l],o[l+1],o[l+2])/255;const r=Qe.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){let c=0;l>0&&l<e-1&&i>0&&i<n-1&&(c=Ce[(i-1)*e+(l-1)]-Ce[(i+1)*e+(l+1)]);const f=(i*e+l)*4;r[f]=Math.min(255,Math.max(0,248-c*2.3*255)),r[f+1]=Math.min(255,Math.max(0,247-c*1.6*255)),r[f+2]=Math.min(255,Math.max(0,242-c*2.9*255)),r[f+3]=255}xt.putImageData(Qe,0,0);const{width:a,height:s}=Je.canvas;Je.imageSmoothingEnabled=!0,Je.drawImage(z,0,0,a,s)}const go={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){H=t,Je=e,H&&!le&&(le=j(H,ho),sn=H.getUniformLocation(le,"u_video"),ln=H.getUniformLocation(le,"u_texel"),cn=H.getUniformLocation(le,"u_time"),un=H.getUniformLocation(le,"u_mirror"))},render(t){H&&t.videoTex?vo(t):po(t)},dispose(){Ce=new Float32Array(0),Qe=null}},Eo=`#version 300 es
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
`;let N=null,ee=null,fn=null,dn=null,mn=null,hn=null,vn=null;function xo(t){const e=N,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(ee),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(fn,0),e.uniform2f(dn,n,o),e.uniform1f(mn,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(hn,t.time),e.uniform1i(vn,t.mirror?1:0),ie(e)}const _o=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),To=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Ae,K=null,_t,Me=new Float32Array(0),et=null;function wo(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),_t=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,Me=new Float32Array(e*n),et=_t.createImageData(e,n));for(let l=0,c=0;l<e*n;l++,c+=4)Me[l]=we(o[c],o[c+1],o[c+2])/255;const r=t.time,a=et.data;for(let l=0;l<n;l++){const c=l/n,f=Math.sin(c*58+r*2.4)*.55+Math.sin(c*21-r*1.6)*.45,u=_o[l&3];for(let d=0;d<e;d++){const m=Me[l*e+d];let E=0;for(let T=0;T<4;T++){const C=Math.round(f*(.006+T*.014)*(.35+m)*e),O=Math.min(e-1,Math.max(0,d+C));E=Math.max(E,Me[l*e+O]*Math.pow(.7,T))}const _=E+(u[d&3]-.5)*.28,S=To[_>.72?0:_>.45?1:_>.24?2:3],R=(l*e+d)*4;a[R]=S[0],a[R+1]=S[1],a[R+2]=S[2],a[R+3]=255}}_t.putImageData(et,0,0);const{width:s,height:i}=Ae.canvas;Ae.imageSmoothingEnabled=!1,Ae.drawImage(K,0,0,s,i),Ae.imageSmoothingEnabled=!0}const yo={id:"wave",name:"WAVE",usesGl:!0,init(t,e){N=t,Ae=e,N&&!ee&&(ee=j(N,Eo),fn=N.getUniformLocation(ee,"u_video"),dn=N.getUniformLocation(ee,"u_res"),mn=N.getUniformLocation(ee,"u_cell"),hn=N.getUniformLocation(ee,"u_time"),vn=N.getUniformLocation(ee,"u_mirror"))},render(t){N&&t.videoTex?xo(t):wo(t)},dispose(){Me=new Float32Array(0),et=null}},Ro=`#version 300 es
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
`;let te=null,ve=null,pn=null,gn=null,En=null;function bo(t){const e=te;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ve),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(pn,0),e.uniform1f(gn,t.time),e.uniform1i(En,t.mirror?1:0),ie(e)}const So=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Ie,Z=null,Tt,tt=null;function Po(t){const{width:e,height:n,data:o}=t.sample;Z||(Z=document.createElement("canvas"),Tt=Z.getContext("2d")),(Z.width!==e||Z.height!==n)&&(Z.width=e,Z.height=n,tt=Tt.createImageData(e,n));const r=tt.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){const c=(i*e+l)*4,f=(Math.random()-.5)*.16,u=we(o[c],o[c+1],o[c+2])/255+f,d=So[u<.3?0:u<.52?1:u<.72?2:3];r[c]=d[0],r[c+1]=d[1],r[c+2]=d[2],r[c+3]=255}Tt.putImageData(tt,0,0);const{width:a,height:s}=Ie.canvas;Ie.imageSmoothingEnabled=!1,Ie.drawImage(Z,0,0,a,s),Ie.imageSmoothingEnabled=!0}const Lo={id:"riso",name:"RISO",usesGl:!0,init(t,e){te=t,Ie=e,te&&!ve&&(ve=j(te,Ro),pn=te.getUniformLocation(ve,"u_video"),gn=te.getUniformLocation(ve,"u_time"),En=te.getUniformLocation(ve,"u_mirror"))},render(t){te&&t.videoTex?bo(t):Po(t)},dispose(){tt=null}},Co=`#version 300 es
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
`,Ao=`#version 300 es
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
`,wt=200,Ee={wave:1,trail:.14},yt=[1,2,3.5,.4],Mo=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Io=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let P=null,G=null,Mt=null,xn=null,_n=null,Tn=null,wn=null,yn=null,Rn=null,bn=null,It=null,Sn=null,k=null,ke=!0;function Fo(t){const e=P,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!k||k.width!==n||k.height!==o)&&(k&&an(e,k),k=mo(e,n,o),ke=!0),e.bindFramebuffer(e.FRAMEBUFFER,k.framebuffer),e.viewport(0,0,n,o),ke&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),ke=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(Mt),e.uniform1f(bn,Ee.trail),ie(e);const r=Math.max(2,Math.round(wt*t.video.videoHeight/t.video.videoWidth));e.useProgram(G),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(xn,0),e.uniform2f(_n,wt,r),e.uniform2f(Tn,n,o),e.uniform1f(wn,t.time),e.uniform1f(yn,Ee.wave),e.uniform1i(Rn,t.mirror?1:0),e.drawArrays(e.POINTS,0,wt*r),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(It),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,k.texture),e.uniform1i(Sn,0),ie(e)}const jt=2;let Ft,X=null,se,$e=!0;function Uo(t){const{width:e,height:n}=Ft.canvas,{width:o,height:r,data:a}=t.sample;X||(X=document.createElement("canvas"),se=X.getContext("2d")),(X.width!==e||X.height!==n)&&(X.width=e,X.height=n,$e=!0),$e?(se.fillStyle="#000",se.fillRect(0,0,e,n),$e=!1):(se.fillStyle=`rgba(0,0,0,${Ee.trail})`,se.fillRect(0,0,e,n));const s=e/o,i=n/r,l=t.time,c=Ee.wave;for(let f=0;f<r;f+=jt)for(let u=0;u<o;u+=jt){const d=(f*o+u)*4,m=we(a[d],a[d+1],a[d+2])/255;if(m<.04)continue;const E=Math.sin(l*2+u*.35+f*.18)*(1+m*5)*s*.6*c,_=Math.cos(l*1.6+f*.28+u*.11)*(1+m*3)*i*.4*c,S=Math.round(24+m*60),R=Math.round(90+m*150),T=Math.round(200+m*55),C=(.6+m*2.6)*s*.5;se.fillStyle=`rgba(${S},${R},${T},${.2+m*.8})`,se.fillRect(u*s+E,f*i+_,C,C)}Ft.drawImage(X,0,0)}const Do={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){P=t,Ft=e,$e=!0,ke=!0,P&&!G&&(G=j(P,Ao,Co),xn=P.getUniformLocation(G,"u_video"),_n=P.getUniformLocation(G,"u_grid"),Tn=P.getUniformLocation(G,"u_res"),wn=P.getUniformLocation(G,"u_time"),yn=P.getUniformLocation(G,"u_wave"),Rn=P.getUniformLocation(G,"u_mirror"),Mt=j(P,Mo),bn=P.getUniformLocation(Mt,"u_alpha"),It=j(P,Io),Sn=P.getUniformLocation(It,"u_tex"))},render(t){P&&t.videoTex?Fo(t):Uo(t)},dispose(){P&&k&&an(P,k),k=null,X=null,$e=!0,ke=!0},onReselect(){const t=yt.indexOf(Ee.wave);Ee.wave=yt[(t+1)%yt.length]}},ko=`#version 300 es
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
`;let ct=!1,D=null,V=null,Pn=null,Ln=null,Cn=null,An=null,Mn=null,In=null;function $o(t){const e=D,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(V),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Pn,0),e.uniform2f(Ln,n,o),e.uniform1f(Cn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(An,t.time),e.uniform1i(Mn,t.mirror?1:0),e.uniform1i(In,ct?1:0),ie(e)}const Oo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),No={r:238,g:244,b:250},Wo={r:22,g:72,b:158},Bo=.12;let Fe,J=null,Rt,nt=null;function Ho(t){const{width:e,height:n,data:o}=t.sample;J||(J=document.createElement("canvas"),Rt=J.getContext("2d")),(J.width!==e||J.height!==n)&&(J.width=e,J.height=n,nt=Rt.createImageData(e,n));const r=nt.data;for(let i=0;i<n;i++){const l=Oo[i&3];for(let c=0;c<e;c++){const f=(i*e+c)*4;let d=we(o[f],o[f+1],o[f+2])/255+(Math.random()-.5)*Bo>l[c&3];ct&&(d=!d);const m=d?No:Wo;r[f]=m.r,r[f+1]=m.g,r[f+2]=m.b,r[f+3]=255}}Rt.putImageData(nt,0,0);const{width:a,height:s}=Fe.canvas;Fe.imageSmoothingEnabled=!1,Fe.drawImage(J,0,0,a,s),Fe.imageSmoothingEnabled=!0}const Go={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){D=t,Fe=e,D&&!V&&(V=j(D,ko),Pn=D.getUniformLocation(V,"u_video"),Ln=D.getUniformLocation(V,"u_res"),Cn=D.getUniformLocation(V,"u_cell"),An=D.getUniformLocation(V,"u_time"),Mn=D.getUniformLocation(V,"u_mirror"),In=D.getUniformLocation(V,"u_invert"))},render(t){D&&t.videoTex?$o(t):Ho(t)},dispose(){nt=null},onReselect(){ct=!ct}},Xo=`#version 300 es
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
`,Oe=60,Fn=480,Un=270,Vo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let L=null,ot=null,ne=null,Dn=null,kn=null,$n=null,On=null,Nn=null,Wn=null,Bn=null,re=null,Ne=null,pe=-1,We=0;function qo(t){re=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,re),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,Fn,Un,Oe),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Ne=t.createFramebuffer(),pe=-1,We=0}function Yo(){L&&(re&&L.deleteTexture(re),Ne&&L.deleteFramebuffer(Ne),re=null,Ne=null,pe=-1,We=0)}function jo(t){const e=L;pe=(pe+1)%Oe,We=Math.min(We+1,Oe),e.bindFramebuffer(e.FRAMEBUFFER,Ne),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,re,0,pe),e.viewport(0,0,Fn,Un),e.useProgram(ot),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Dn,0),ie(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ne),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,re),e.uniform1i(kn,0),e.uniform1f($n,pe),e.uniform1f(On,Oe),e.uniform1f(Nn,We),e.uniform1f(Wn,t.beat),e.uniform1i(Bn,t.mirror?1:0),ie(e)}let rt,Q=null,bt,it=null,ce=[];function zo(t){const{width:e,height:n,data:o}=t.sample;Q||(Q=document.createElement("canvas"),bt=Q.getContext("2d")),(Q.width!==e||Q.height!==n)&&(Q.width=e,Q.height=n,it=bt.createImageData(e,n),ce=[]),ce.push(new Uint8ClampedArray(o)),ce.length>Oe&&ce.shift();const r=ce.length-1,a=it.data;for(let l=0;l<n;l++){let c=l/Math.max(1,n-1)*r;c+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const f=Math.round(Math.min(r,Math.max(0,c))),u=ce[r-f],d=l*e*4;a.set(u.subarray(d,d+e*4),d)}bt.putImageData(it,0,0);const{width:s,height:i}=rt.canvas;rt.imageSmoothingEnabled=!0,rt.drawImage(Q,0,0,s,i)}const Ko={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){L=t,rt=e,L&&(ot||(ot=j(L,Vo),Dn=L.getUniformLocation(ot,"u_video"),ne=j(L,Xo),kn=L.getUniformLocation(ne,"u_history"),$n=L.getUniformLocation(ne,"u_head"),On=L.getUniformLocation(ne,"u_layers"),Nn=L.getUniformLocation(ne,"u_filled"),Wn=L.getUniformLocation(ne,"u_beat"),Bn=L.getUniformLocation(ne,"u_mirror")),qo(L))},render(t){L&&t.videoTex&&re?jo(t):zo(t)},dispose(){Yo(),ce=[],it=null}},Ut=[uo,go,yo,Lo,Do,Go,Ko];function we(t,e,n){return .2126*t+.7152*e+.0722*n}function Zo(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,r=0;return{gl:e,videoTex:n,uploadVideo(a){const s=a.videoWidth,i=a.videoHeight;s===0||i===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||i!==r?(o=s,r=i,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,a)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,a))},dispose(){e.deleteTexture(n)}}}const Jo="modulepreload",Qo=function(t,e){return new URL(t,e).href},zt={},er=function(e,n,o){let r=Promise.resolve();if(n&&n.length>0){let c=function(f){return Promise.all(f.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");r=c(n.map(f=>{if(f=Qo(f,o),f in zt)return;zt[f]=!0;const u=f.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(o)for(let E=s.length-1;E>=0;E--){const _=s[E];if(_.href===f&&(!u||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${f}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":Jo,u||(m.as="script"),m.crossOrigin="",m.href=f,l&&m.setAttribute("nonce",l),document.head.appendChild(m),u)return new Promise((E,_)=>{m.addEventListener("load",E),m.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${f}`)))})}))}function a(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})};let fe="off",xe=null,Dt=-1,kt=0,ut={hands:0,pinching:0,points:[],corners:null};const Kt=.4,tr=.6,Zt=2,Ue=new Map,nr=1100,or=3,Jt=.05,rr=1500,De=new Map;let ft=!1,Qt=0;function ir(){const t=ft;return ft=!1,t}const ar=1e3,sr=2e3,oe=new Map;let dt=!1,en=0;function lr(){const t=dt;return dt=!1,t}function $t(){return fe}function Xe(){return ut}async function Hn(){if(fe==="off"){fe="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await er(async()=>{const{FilesetResolver:a,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:a,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),r=a=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:a},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{xe=await e.createFromOptions(o,r("GPU"))}catch{xe=await e.createFromOptions(o,r("CPU"))}fe="on"}catch(t){throw fe="off",t}}}function cr(){xe?.close(),xe=null,fe="off",Dt=-1,kt=0,Ue.clear(),De.clear(),oe.clear(),ft=!1,dt=!1,ut={hands:0,pinching:0,points:[],corners:null}}function ur(t,e){if(fe!=="on"||!xe||t.currentTime===Dt)return;const n=ut.hands>0?33:100;if(e-kt<n)return;Dt=t.currentTime,kt=e;const o=xe.detectForVideo(t,e),r=[],a=o.landmarks?.length??0,s=t.videoWidth||1280,i=t.videoHeight||720,l=(u,d)=>Math.hypot((u.x-d.x)*s,(u.y-d.y)*i),c=new Set;for(let u=0;u<a;u++){const d=o.landmarks[u];let m=o.handednesses?.[u]?.[0]?.categoryName??`hand${u}`;c.has(m)&&(m=`${m}${u}`),c.add(m);const E=d[4],_=d[8],S=l(d[5],d[17]),T=l(E,_)/Math.max(S,1e-6);let C=0;for(const[I,U]of[[8,6],[12,10],[16,14],[20,18]])l(d[0],d[I])>l(d[0],d[U])*1.15&&C++;const O=C>=3,M=C<=1;let x=Ue.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Ue.set(m,x)),M?(x.down=!1,x.onFrames=0,x.offFrames=0):T<Kt?(x.onFrames++,x.offFrames=0,x.onFrames>=Zt&&(x.down=!0)):T>tr?(x.offFrames++,x.onFrames=0,x.offFrames>=Zt&&(x.down=!1)):(x.onFrames=0,x.offFrames=0);let y=De.get(m);if(y||(y={dir:0,extreme:d[9].x*s,reversals:[]},De.set(m,y)),O&&!x.down){const I=d[9].x*s,U=I-y.extreme;y.dir===0?Math.abs(U)>Jt*s&&(y.dir=Math.sign(U),y.extreme=I):Math.sign(U)===y.dir?y.extreme=I:Math.abs(U)>Jt*s&&(y.dir=Math.sign(U),y.extreme=I,y.reversals.push(e),y.reversals=y.reversals.filter(Re=>e-Re<nr),y.reversals.length>=or&&e>Qt&&(ft=!0,Qt=e+rr,y.reversals=[]))}else y.dir=0,y.extreme=d[9].x*s,y.reversals=[];let B=0;M&&e>en?(oe.has(m)||oe.set(m,e),B=Math.min(1,(e-oe.get(m))/ar),B>=1&&(dt=!0,en=e+sr,oe.delete(m),B=0)):oe.delete(m),r.push({handedness:m,thumb:{x:E.x,y:E.y},index:{x:_.x,y:_.y},threshold:Kt*S/s,ratio:T,pinching:x.down,open:O,fist:M,fistProgress:B,palm:{x:d[9].x,y:d[9].y},x:(E.x+_.x)/2,y:(E.y+_.y)/2})}for(const u of[...Ue.keys()])c.has(u)||Ue.delete(u);for(const u of[...De.keys()])c.has(u)||De.delete(u);for(const u of[...oe.keys()])c.has(u)||oe.delete(u);const f=r.filter(u=>u.pinching);ut={hands:a,pinching:f.length,points:r,corners:f.length>=2?[f[0],f[1]]:null}}function Gn(t,e,n,o){const r=Math.max(n/t,o/e),a=t*r,s=e*r;return{x:(n-a)/2,y:(o-s)/2,w:a,h:s}}function Be(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function Xn(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const at={minDist:1.5,baseWidth:6,maxPoints:2e4,bufferMs:250},fr=["#ffffff","#141414","#8a8a8a","#1f6bff","#9cc3ff"];let dr=fr[0];const de=new Map,ae=[];let _e=0,A=null,$=null,Y=null,W=null;const Vn=5;function qn(t){const e=parseInt(t.slice(1),16);return .2126*(e>>16&255)+.7152*(e>>8&255)+.0722*(e&255)<128?"rgba(255,255,255,0.85)":"rgba(18,18,18,0.7)"}function mr(t,e){if(A||(A=document.createElement("canvas"),Y=document.createElement("canvas"),$=A.getContext("2d"),W=Y.getContext("2d")),A.width===t&&A.height===e)return;const n=A.width,o=A.height;if(n>0&&o>0){const r=t/n,a=e/o,s=(r+a)/2;for(const i of ae)for(const l of i.pts)l.x*=r,l.y*=a,l.w*=s}A.width=t,A.height=e,Y.width=t,Y.height=e,Bt()}function Ot(t,e,n,o){const r=e.pts;t.strokeStyle=o?qn(e.color):e.color,t.lineCap="round",t.lineJoin="round";const a=o?Vn:0;if(n===1){t.lineWidth=r[1].w+a,t.beginPath(),t.moveTo(r[0].x,r[0].y),t.lineTo((r[0].x+r[1].x)/2,(r[0].y+r[1].y)/2),t.stroke();return}const s=r[n-2],i=r[n-1],l=r[n],c={x:(s.x+i.x)/2,y:(s.y+i.y)/2},f={x:(i.x+l.x)/2,y:(i.y+l.y)/2};t.lineWidth=i.w+a,t.beginPath(),t.moveTo(c.x,c.y),t.quadraticCurveTo(i.x,i.y,f.x,f.y),t.stroke()}function Nt(t,e,n){const o=e.pts[0];t.fillStyle=n?qn(e.color):e.color,t.beginPath(),t.arc(o.x,o.y,(o.w+(n?Vn:0))/2,0,Math.PI*2),t.fill()}function Te(t,e,n){if(e.pts.length!==0){if(e.pts.length===1){Nt(t,e,n);return}for(let o=1;o<e.pts.length;o++)Ot(t,e,o,n)}}function hr(t,e){W&&Ot(W,t,e,!0),$&&Ot($,t,e,!1)}function Bt(){if(!(!A||!$||!Y||!W)){$.clearRect(0,0,A.width,A.height),W.clearRect(0,0,Y.width,Y.height);for(const t of ae)Te(W,t,!0),Te($,t,!1)}}function Yn(t){!t.stroke||!$||!W||(t.pendingSince=-1,Te(W,t.stroke,!0),Te($,t.stroke,!1),t.inked=t.stroke.pts.length,ae.push(t.stroke))}function St(t){t.stroke&&t.pendingSince>=0&&Yn(t),t.stroke&&t.stroke.pts.length===1&&$&&W&&(Nt(W,t.stroke,!0),Nt($,t.stroke,!1)),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function jn(t){_e-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function vr(){let t=!1;for(;_e>at.maxPoints&&ae.length>0;)_e-=ae.shift().pts.length,t=!0;t&&Bt()}function pr(t,e,n,o,r){const a=new Set;for(const s of t){a.add(s.handedness);let i=de.get(s.handedness);if(i||(i={drawing:!1,stroke:null,pendingSince:-1,inked:0},de.set(s.handedness,i)),o&&i.drawing){i.pendingSince>=0?jn(i):St(i);continue}if(i.drawing&&!s.pinching){St(i);continue}if(!i.drawing&&s.pinching&&!o&&(i.drawing=!0,i.stroke={color:dr,pts:[]},i.pendingSince=r,i.inked=0),!i.drawing||!i.stroke)continue;const l=Xn(Be(s.thumb,e,n),Be(s.index,e,n)),c=i.stroke.pts[i.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=at.minDist)&&(i.stroke.pts.push({x:l.x,y:l.y,w:at.baseWidth}),_e++),i.pendingSince>=0)r-i.pendingSince>at.bufferMs&&Yn(i);else if($)for(;i.inked<i.stroke.pts.length;)i.inked++,i.inked>=2&&hr(i.stroke,i.inked-1)}for(const[s,i]of de)!a.has(s)&&i.drawing&&St(i);vr()}function gr(t){A&&Y&&(ae.length>0||Er())&&(t.drawImage(Y,0,0),t.drawImage(A,0,0));for(const e of de.values())e.drawing&&e.pendingSince>=0&&e.stroke&&(Te(t,e.stroke,!0),Te(t,e.stroke,!1))}function Er(){for(const t of de.values())if(t.drawing)return!0;return!1}function zn(t){return de.get(t)?.drawing??!1}function Kn(){for(const t of de.values())jn(t);ae.length=0,_e=0,Bt()}function xr(){return{strokes:ae.length,points:_e}}const tn=128,_r=2,Pt=[90,100,110,120,128,140],Ve=.08,Tr=400,wr=150;let p,g=null,h,mt,Zn,ht,ue=null,Lt=!1,Ct=!1,He=null,st=0;const vt=document.createElement("canvas"),he=vt.getContext("2d",{willReadFrequently:!0}),ge=new io,Ge=new rn;let Jn=0;const yr=new ImageData(2,2),F=[];let b=null,ye=0,nn=0,Pe=null;const pt=new Set;function me(){return Ut[ye%Ut.length]}function Ht(t){pt.has(t.id)||(t.init(ue?.gl??null,Zn),pt.add(t.id))}function gt(){const t=new Set;for(const e of F)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...pt])t.has(e)||(Ut.find(n=>n.id===e)?.dispose(),pt.delete(e))}function Rr(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const qe=.06;function br(t){const e=t.map(s=>({x:g.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),r=Math.min(e[0].y,e[1].y),a=Math.max(e[0].y,e[1].y);return n<qe&&(n=0),r<qe&&(r=0),o>1-qe&&(o=1),a>1-qe&&(a=1),o-n<Ve&&(o=n+Ve),a-r<Ve&&(a=r+Ve),{x0:n,y0:r,x1:o,y1:a}}function Sr(t){const e=Xe();if(e.corners&&g){nn=t;const n=br(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(Pe===null&&(Pe=t),t-Pe<wr)return;Pe=null,b={rect:n,effect:me()},ye++,Ht(b.effect),p.setFxLabel(b.effect.name)}return}Pe=null,b&&t-nn>Tr&&(Qn(b),b=null)}function Qn(t){for(let e=F.length-1;e>=0;e--)Rr(t.rect,F[e].rect)&&F.splice(e,1);F.push(t),gt(),p.setFxLabel(`NEXT ${me().name}`)}function Gt(){if(!g)return;const t=g.video.videoWidth||4,e=g.video.videoHeight||3,n=16,o=4,r=Math.max(64,window.innerWidth-n*2-o),a=Math.max(64,window.innerHeight-n*2-o-p.chromeHeight()),s=Math.min(r/t,a/e),i=Math.round(t*s),l=Math.round(e*s),c=Math.min(_r,window.devicePixelRatio||1);p.canvas.style.width=`${i}px`,p.canvas.style.height=`${l}px`,p.setDeviceWidth(i);for(const f of[p.canvas,mt,ht])f.width=Math.round(i*c),f.height=Math.round(l*c);mr(p.canvas.width,p.canvas.height),vt.width=tn,vt.height=Math.max(2,Math.round(tn*e/t))}function Pr(){const{width:t,height:e}=vt;return he.save(),g.mirror&&(he.translate(t,0),he.scale(-1,1)),he.drawImage(g.video,0,0,t,e),he.restore(),he.getImageData(0,0,t,e)}function Lr(){const{width:t,height:e}=p.canvas;h.save(),g.mirror&&(h.translate(t,0),h.scale(-1,1)),h.drawImage(g.video,0,0,t,e),h.restore()}function on(t,e,n){const{width:o,height:r}=p.canvas,a=t.rect.x0*o,s=t.rect.y0*r,i=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*r;h.drawImage(e,a,s,i,l,a,s,i,l),h.strokeStyle="#ffffff",h.lineWidth=Math.max(2,o/640),n&&h.setLineDash([10,8]),h.strokeRect(a,s,i,l),h.setLineDash([])}function Cr(t){Lr();const e=F.map(i=>({f:i,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:i})=>i.effect.usesGl&&ue),o=e.some(({f:i})=>!(i.effect.usesGl&&ue));n&&ue.uploadVideo(g.video);const r={videoTex:n?ue.videoTex:null,sample:o?Pr():yr,video:g.video,mirror:g.mirror,time:t.time,frame:t.frame,beat:t.beat};let a=null,s=null;for(const{f:i,isDrawing:l}of e)!!i.effect.usesGl&&!!ue?(s!==i.effect&&(i.effect.render(r),s=i.effect),on(i,ht,l)):(a!==i.effect&&(i.effect.render(r),a=i.effect),on(i,mt,l))}function Ar(){const t=Xe();if(t.points.length===0||!g)return;const{width:e,height:n}=p.canvas,o=Gn(g.video.videoWidth||4,g.video.videoHeight||3,e,n);h.lineWidth=Math.max(2,e/500);for(const r of t.points){if(r.fist){if(r.fistProgress>0){const u=Be(r.palm,o,g.mirror),d=Math.max(14,e*.03);h.save(),h.lineWidth=Math.max(3,e/400),h.strokeStyle="rgba(255,255,255,0.35)",h.beginPath(),h.arc(u.x,u.y,d,0,Math.PI*2),h.stroke(),h.strokeStyle="#ffffff",h.beginPath(),h.arc(u.x,u.y,d,-Math.PI/2,-Math.PI/2+Math.PI*2*r.fistProgress),h.stroke(),h.restore()}continue}const a=Be(r.thumb,o,g.mirror),s=Be(r.index,o,g.mirror),l=zn(r.handedness)?"#28c840":r.pinching?"#1f6bff":"#ffffff";h.strokeStyle=l,h.save(),h.lineWidth=Math.max(1,e/900),h.beginPath(),h.moveTo(a.x,a.y),h.lineTo(s.x,s.y),h.stroke(),h.restore();const c=Math.max(8,r.threshold*o.w/2);for(const u of[a,s])h.beginPath(),h.arc(u.x,u.y,c,0,Math.PI*2),h.stroke();const f=Xn(a,s);h.beginPath(),h.arc(f.x,f.y,Math.max(3,e/240),0,Math.PI*2),h.fillStyle=l,h.fill()}}function Mr(){if(!He)return;const t=Xe(),e=xr(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.fist?"FIST ":o.open?"OPEN ":"  -  "} ${zn(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),He.textContent=n.join(`
`)}function eo(t){requestAnimationFrame(eo);const e=ge.tick(t),n=g!==null&&g.video.readyState>=2;if(n&&(ur(g.video,t),lr()&&kr(t),ir()&&(Kn(),st=t+200),Sr(t)),e.playing&&n){const o=Xe(),r=b!==null||o.pinching>=2,a=Gn(g.video.videoWidth||4,g.video.videoHeight||3,p.canvas.width,p.canvas.height);pr(o.points,a,g.mirror,r,t),Cr(e),gr(h),Ar(),t<st&&(h.fillStyle=`rgba(255,255,255,${.8*(st-t)/280})`,h.fillRect(0,0,p.canvas.width,p.canvas.height)),Mr()}Ge.captureFrame(p.canvas),Ge.recording&&p.setRecordTime((t-Jn)/1e3),p.setHands($t(),Xe().hands>0),p.setTransport(e.frame,e.fps,e.bpm,e.playing)}function to(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Ir(){if(!g||!rn.supported())return;if(!Ge.recording){Ge.start(p.canvas),Jn=performance.now(),p.setRecording(!0);return}p.setRecording(!1);const t=await Ge.stop();t&&to(t.blob,`null8_${ge.timecode().replaceAll(":","")}.${t.ext}`)}async function Fr(){if($t()!=="loading"){if($t()==="on"){cr();return}p.setHands("loading",!1);try{await Hn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Ur(){if(!g||Ct)return;Ct=!0;const t=g.facing;try{g=await oo(g)}catch{g=await Wt(t)}finally{Ct=!1}Gt()}function Dr(){p.canvas.toBlob(t=>{t&&to(t,`null8_${ge.timecode().replaceAll(":","")}.png`)},"image/png")}function kr(t){F.length=0,b=null,Kn(),gt(),ye=0,p.setFxLabel(`NEXT ${me().name}`),st=t+280}function $r(){F.length>0?(F.pop(),gt()):ye++,p.setFxLabel(`NEXT ${me().name}`)}async function Or(){if(!(g||Lt)){Lt=!0;try{g=await Wt("user"),p.hideStartOverlay(),Gt(),requestAnimationFrame(eo),Hn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=me();ye++,Ht(e),F.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),p.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);p.showStartError(e),Lt=!1}}}function Nr(){const t=document.getElementById("app");p=ao(t,{onStart:()=>{Or()},onCanvasTap:$r,onPlayToggle:()=>ge.toggle(),onSnapshot:Dr,onTempoTap:()=>{const e=Pt.indexOf(ge.bpm);ge.bpm=Pt[(e+1)%Pt.length]},onRecordToggle:()=>{Ir()},onCameraFlip:()=>{Ur()},onHandsToggle:()=>{Fr()}}),h=p.canvas.getContext("2d"),mt=document.createElement("canvas"),Zn=mt.getContext("2d"),ht=document.createElement("canvas"),ue=Zo(ht),p.setFxLabel(`NEXT ${me().name}`),window.addEventListener("resize",Gt),new URLSearchParams(location.search).has("debug")&&(He=document.createElement("pre"),He.className="debug-hud",document.body.appendChild(He)),window.__null8={addFrame(e){const n=me();ye++,Ht(n),Qn({rect:e,effect:n})},clearFrames(){F.length=0,gt()},get frames(){return F.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Nr();
