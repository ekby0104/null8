(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();async function Ot(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function Qn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function eo(t){const e=t.facing==="user"?"environment":"user";return Qn(t),Ot(e)}const to=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class tn{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=to.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(a=>{e.onstop=()=>a()});e.stop(),await n;for(const a of this.stream?.getTracks()??[])a.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",r=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:r}}}const Ht=60;class no{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,r=Math.floor(e)%60,a=Math.floor(e*Ht)%Ht,s=i=>String(i).padStart(2,"0");return`${s(n)}:${s(o)}:${s(r)}:${s(a)}`}}function h(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function oo(t,e){const n=h("header","titlebar"),o=h("div","traffic");for(const w of["r","y","g"])o.appendChild(h("span",w));const r=h("div","path","/project1/null8 (128,128)");n.append(o,r,h("div","spacer"));const a=h("div","viewport"),s=h("canvas");a.appendChild(s),a.addEventListener("click",()=>e.onCanvasTap());const i=h("div","start-overlay"),l=h("div","pulse"),c=h("div","big","TAP TO START"),u=h("div","sub",`webcam access required
HTTPS or localhost only`);i.append(l,c,u),i.addEventListener("click",w=>{w.stopPropagation(),e.onStart()}),a.appendChild(i);const f=h("footer","transport"),d=h("div","group"),m=h("span","lcd small","0");d.append(h("span","label","F"),m);const E=h("button","on","PAUSE");E.title="play / pause",E.addEventListener("click",()=>e.onPlayToggle());const T=h("button",void 0,"PHOTO CAPTURE");T.title="photo capture",T.addEventListener("click",()=>e.onSnapshot());const S=h("button","rec-btn","RECORD START");S.title="record video",S.addEventListener("click",()=>e.onRecordToggle());const b=h("div","group"),_=h("span","lcd small","00:00");b.append(h("span","label","REC"),_),b.style.display="none";const C=h("div","group"),O=h("span","lcd small","—");C.append(h("span","label","FX"),O);const I=h("div","group"),x=h("span","lcd small","60.0");I.append(h("span","label","FPS"),x);const y=h("div","group"),U=h("span","lcd small","120");U.style.cursor="pointer",U.addEventListener("click",()=>e.onTempoTap()),y.append(h("span","label","Tempo"),U,h("span","label","BPM"));const A=h("button","hands-btn","✋︎");A.title="hand tracking",A.addEventListener("click",()=>e.onHandsToggle());const we=h("button",void 0,"⇄");we.title="switch camera",we.addEventListener("click",()=>e.onCameraFlip()),f.append(C,E,T,S,b,h("div","push"),d,I,y,A,we);const ht=h("div","device");return ht.append(n,a,f),t.append(ht),{canvas:s,chromeHeight(){return n.offsetHeight+f.offsetHeight},setDeviceWidth(w){ht.style.width=`${w+4}px`},hideStartOverlay(){i.classList.add("hidden")},showStartError(w){c.textContent="CAMERA ERROR",u.textContent=w,l.style.animationDuration="0.4s"},setFxLabel(w){O.textContent=w},setTransport(w,ye,vt,Gt){m.textContent=String(w).padStart(6,"0"),x.textContent=ye.toFixed(1),U.textContent=String(vt),E.textContent=Gt?"PAUSE":"PLAY",E.classList.toggle("on",Gt)},setRecording(w){S.textContent=w?"RECORD STOP":"RECORD START",S.classList.toggle("recording",w),_.classList.toggle("rec",w),b.style.display=w?"flex":"none",w||(_.textContent="00:00")},setRecordTime(w){const ye=Math.floor(w/60),vt=Math.floor(w)%60;_.textContent=`${String(ye).padStart(2,"0")}:${String(vt).padStart(2,"0")}`},setHands(w,ye){A.classList.toggle("loading",w==="loading"),A.classList.toggle("on",w==="on"),A.classList.toggle("detect",w==="on"&&ye)}}}const ro=6,Xt=2;let V,rt=0,Lt=0,Xe=new Float64Array(0),Ve=new Float64Array(0),qe=new Float64Array(0),Ye=new Float64Array(0),je=new Float64Array(0);function io(t){const{width:e,height:n,data:o}=t;if(e!==rt||n!==Lt){rt=e,Lt=n;const a=(e+1)*(n+1);Xe=new Float64Array(a),Ve=new Float64Array(a),qe=new Float64Array(a),Ye=new Float64Array(a),je=new Float64Array(a)}const r=e+1;for(let a=0;a<n;a++){let s=0,i=0,l=0,c=0,u=0;for(let f=0;f<e;f++){const d=(a*e+f)*4,m=o[d],E=o[d+1],T=o[d+2],S=Te(m,E,T);s+=S,i+=S*S,l+=m,c+=E,u+=T;const b=(a+1)*r+(f+1),_=a*r+(f+1);Xe[b]=Xe[_]+s,Ve[b]=Ve[_]+i,qe[b]=qe[_]+l,Ye[b]=Ye[_]+c,je[b]=je[_]+u}}}function Re(t,e,n,o,r){const a=rt+1;return t[(n+r)*a+(e+o)]-t[n*a+(e+o)]-t[(n+r)*a+e]+t[n*a+e]}function ao(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function Se(t,e,n,o,r,a,s,i,l){const c=n*o,u=Re(Xe,t,e,n,o)/c,f=Re(Ve,t,e,n,o)/c-u*u;if(r<ro&&n>Xt&&o>Xt&&f>a){const I=n>>1,x=o>>1;Se(t,e,I,x,r+1,a,s,i,l),Se(t+I,e,n-I,x,r+1,a,s,i,l),Se(t,e+x,I,o-x,r+1,a,s,i,l),Se(t+I,e+x,n-I,o-x,r+1,a,s,i,l);return}const m=Re(qe,t,e,n,o)/c,E=Re(Ye,t,e,n,o)/c,T=Re(je,t,e,n,o)/c,S=ao(t,e,Math.floor(l*2))<.025;V.fillStyle=S?"#2ea44f":`rgb(${Math.round(m)},${Math.round(E)},${Math.round(T)})`;const b=t*s,_=e*i,C=n*s,O=o*i;V.fillRect(b,_,C,O),V.strokeRect(b+.5,_+.5,C-1,O-1)}const so={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){V=e},render(t){const{width:e,height:n}=V.canvas,{width:o,height:r}=t.sample;io(t.sample);const a=380+300*Math.sin(t.beat*Math.PI/2);V.fillStyle="#000",V.fillRect(0,0,e,n),V.strokeStyle="#000",V.lineWidth=1,Se(0,0,o,r,0,a,e/o,n/r,t.beat)},dispose(){rt=0,Lt=0}},lo=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Vt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const r=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${r}`)}return o}function Y(t,e,n=lo){const o=Vt(t,t.VERTEX_SHADER,n),r=Vt(t,t.FRAGMENT_SHADER,e),a=t.createProgram();if(t.attachShader(a,o),t.attachShader(a,r),t.linkProgram(a),t.deleteShader(o),t.deleteShader(r),!t.getProgramParameter(a,t.LINK_STATUS)){const s=t.getProgramInfoLog(a);throw t.deleteProgram(a),new Error(`program link failed: ${s}`)}return a}function re(t){t.drawArrays(t.TRIANGLES,0,3)}function co(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:r,texture:o,width:e,height:n}}function nn(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const uo=`#version 300 es
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
`;let W=null,ae=null,on=null,rn=null,an=null,sn=null;function fo(t){const e=W;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ae),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(on,0),e.uniform2f(rn,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(an,t.time),e.uniform1i(sn,t.mirror?1:0),re(e)}let ze,z=null,pt,Le=new Float32Array(0),Ke=null;function mo(t){const{width:e,height:n,data:o}=t.sample;z||(z=document.createElement("canvas"),pt=z.getContext("2d")),(z.width!==e||z.height!==n)&&(z.width=e,z.height=n,Le=new Float32Array(e*n),Ke=pt.createImageData(e,n));for(let i=0,l=0;i<e*n;i++,l+=4)Le[i]=Te(o[l],o[l+1],o[l+2])/255;const r=Ke.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){let c=0;l>0&&l<e-1&&i>0&&i<n-1&&(c=Le[(i-1)*e+(l-1)]-Le[(i+1)*e+(l+1)]);const u=(i*e+l)*4;r[u]=Math.min(255,Math.max(0,248-c*2.3*255)),r[u+1]=Math.min(255,Math.max(0,247-c*1.6*255)),r[u+2]=Math.min(255,Math.max(0,242-c*2.9*255)),r[u+3]=255}pt.putImageData(Ke,0,0);const{width:a,height:s}=ze.canvas;ze.imageSmoothingEnabled=!0,ze.drawImage(z,0,0,a,s)}const ho={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){W=t,ze=e,W&&!ae&&(ae=Y(W,uo),on=W.getUniformLocation(ae,"u_video"),rn=W.getUniformLocation(ae,"u_texel"),an=W.getUniformLocation(ae,"u_time"),sn=W.getUniformLocation(ae,"u_mirror"))},render(t){W&&t.videoTex?fo(t):mo(t)},dispose(){Le=new Float32Array(0),Ke=null}},vo=`#version 300 es
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
`;let N=null,ee=null,ln=null,cn=null,un=null,fn=null,dn=null;function po(t){const e=N,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(ee),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(ln,0),e.uniform2f(cn,n,o),e.uniform1f(un,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(fn,t.time),e.uniform1i(dn,t.mirror?1:0),re(e)}const go=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Eo=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Pe,K=null,gt,Ce=new Float32Array(0),Ze=null;function xo(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),gt=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,Ce=new Float32Array(e*n),Ze=gt.createImageData(e,n));for(let l=0,c=0;l<e*n;l++,c+=4)Ce[l]=Te(o[c],o[c+1],o[c+2])/255;const r=t.time,a=Ze.data;for(let l=0;l<n;l++){const c=l/n,u=Math.sin(c*58+r*2.4)*.55+Math.sin(c*21-r*1.6)*.45,f=go[l&3];for(let d=0;d<e;d++){const m=Ce[l*e+d];let E=0;for(let _=0;_<4;_++){const C=Math.round(u*(.006+_*.014)*(.35+m)*e),O=Math.min(e-1,Math.max(0,d+C));E=Math.max(E,Ce[l*e+O]*Math.pow(.7,_))}const T=E+(f[d&3]-.5)*.28,S=Eo[T>.72?0:T>.45?1:T>.24?2:3],b=(l*e+d)*4;a[b]=S[0],a[b+1]=S[1],a[b+2]=S[2],a[b+3]=255}}gt.putImageData(Ze,0,0);const{width:s,height:i}=Pe.canvas;Pe.imageSmoothingEnabled=!1,Pe.drawImage(K,0,0,s,i),Pe.imageSmoothingEnabled=!0}const To={id:"wave",name:"WAVE",usesGl:!0,init(t,e){N=t,Pe=e,N&&!ee&&(ee=Y(N,vo),ln=N.getUniformLocation(ee,"u_video"),cn=N.getUniformLocation(ee,"u_res"),un=N.getUniformLocation(ee,"u_cell"),fn=N.getUniformLocation(ee,"u_time"),dn=N.getUniformLocation(ee,"u_mirror"))},render(t){N&&t.videoTex?po(t):xo(t)},dispose(){Ce=new Float32Array(0),Ze=null}},_o=`#version 300 es
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
`;let te=null,me=null,mn=null,hn=null,vn=null;function wo(t){const e=te;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(me),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(mn,0),e.uniform1f(hn,t.time),e.uniform1i(vn,t.mirror?1:0),re(e)}const yo=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Ae,Z=null,Et,Je=null;function Ro(t){const{width:e,height:n,data:o}=t.sample;Z||(Z=document.createElement("canvas"),Et=Z.getContext("2d")),(Z.width!==e||Z.height!==n)&&(Z.width=e,Z.height=n,Je=Et.createImageData(e,n));const r=Je.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){const c=(i*e+l)*4,u=(Math.random()-.5)*.16,f=Te(o[c],o[c+1],o[c+2])/255+u,d=yo[f<.3?0:f<.52?1:f<.72?2:3];r[c]=d[0],r[c+1]=d[1],r[c+2]=d[2],r[c+3]=255}Et.putImageData(Je,0,0);const{width:a,height:s}=Ae.canvas;Ae.imageSmoothingEnabled=!1,Ae.drawImage(Z,0,0,a,s),Ae.imageSmoothingEnabled=!0}const bo={id:"riso",name:"RISO",usesGl:!0,init(t,e){te=t,Ae=e,te&&!me&&(me=Y(te,_o),mn=te.getUniformLocation(me,"u_video"),hn=te.getUniformLocation(me,"u_time"),vn=te.getUniformLocation(me,"u_mirror"))},render(t){te&&t.videoTex?wo(t):Ro(t)},dispose(){Je=null}},So=`#version 300 es
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
`,Lo=`#version 300 es
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
`,xt=200,pe={wave:1,trail:.14},Tt=[1,2,3.5,.4],Po=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Co=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let L=null,G=null,Pt=null,pn=null,gn=null,En=null,xn=null,Tn=null,_n=null,wn=null,Ct=null,yn=null,$=null,Ue=!0;function Ao(t){const e=L,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!$||$.width!==n||$.height!==o)&&($&&nn(e,$),$=co(e,n,o),Ue=!0),e.bindFramebuffer(e.FRAMEBUFFER,$.framebuffer),e.viewport(0,0,n,o),Ue&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),Ue=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(Pt),e.uniform1f(wn,pe.trail),re(e);const r=Math.max(2,Math.round(xt*t.video.videoHeight/t.video.videoWidth));e.useProgram(G),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(pn,0),e.uniform2f(gn,xt,r),e.uniform2f(En,n,o),e.uniform1f(xn,t.time),e.uniform1f(Tn,pe.wave),e.uniform1i(_n,t.mirror?1:0),e.drawArrays(e.POINTS,0,xt*r),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(Ct),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,$.texture),e.uniform1i(yn,0),re(e)}const qt=2;let At,H=null,ie,De=!0;function Mo(t){const{width:e,height:n}=At.canvas,{width:o,height:r,data:a}=t.sample;H||(H=document.createElement("canvas"),ie=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,De=!0),De?(ie.fillStyle="#000",ie.fillRect(0,0,e,n),De=!1):(ie.fillStyle=`rgba(0,0,0,${pe.trail})`,ie.fillRect(0,0,e,n));const s=e/o,i=n/r,l=t.time,c=pe.wave;for(let u=0;u<r;u+=qt)for(let f=0;f<o;f+=qt){const d=(u*o+f)*4,m=Te(a[d],a[d+1],a[d+2])/255;if(m<.04)continue;const E=Math.sin(l*2+f*.35+u*.18)*(1+m*5)*s*.6*c,T=Math.cos(l*1.6+u*.28+f*.11)*(1+m*3)*i*.4*c,S=Math.round(24+m*60),b=Math.round(90+m*150),_=Math.round(200+m*55),C=(.6+m*2.6)*s*.5;ie.fillStyle=`rgba(${S},${b},${_},${.2+m*.8})`,ie.fillRect(f*s+E,u*i+T,C,C)}At.drawImage(H,0,0)}const Fo={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){L=t,At=e,De=!0,Ue=!0,L&&!G&&(G=Y(L,Lo,So),pn=L.getUniformLocation(G,"u_video"),gn=L.getUniformLocation(G,"u_grid"),En=L.getUniformLocation(G,"u_res"),xn=L.getUniformLocation(G,"u_time"),Tn=L.getUniformLocation(G,"u_wave"),_n=L.getUniformLocation(G,"u_mirror"),Pt=Y(L,Po),wn=L.getUniformLocation(Pt,"u_alpha"),Ct=Y(L,Co),yn=L.getUniformLocation(Ct,"u_tex"))},render(t){L&&t.videoTex?Ao(t):Mo(t)},dispose(){L&&$&&nn(L,$),$=null,H=null,De=!0,Ue=!0},onReselect(){const t=Tt.indexOf(pe.wave);pe.wave=Tt[(t+1)%Tt.length]}},Io=`#version 300 es
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
`;let it=!1,D=null,X=null,Rn=null,bn=null,Sn=null,Ln=null,Pn=null,Cn=null;function Uo(t){const e=D,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(X),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Rn,0),e.uniform2f(bn,n,o),e.uniform1f(Sn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(Ln,t.time),e.uniform1i(Pn,t.mirror?1:0),e.uniform1i(Cn,it?1:0),re(e)}const Do=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),$o={r:238,g:244,b:250},ko={r:22,g:72,b:158},Oo=.12;let Me,J=null,_t,Qe=null;function No(t){const{width:e,height:n,data:o}=t.sample;J||(J=document.createElement("canvas"),_t=J.getContext("2d")),(J.width!==e||J.height!==n)&&(J.width=e,J.height=n,Qe=_t.createImageData(e,n));const r=Qe.data;for(let i=0;i<n;i++){const l=Do[i&3];for(let c=0;c<e;c++){const u=(i*e+c)*4;let d=Te(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*Oo>l[c&3];it&&(d=!d);const m=d?$o:ko;r[u]=m.r,r[u+1]=m.g,r[u+2]=m.b,r[u+3]=255}}_t.putImageData(Qe,0,0);const{width:a,height:s}=Me.canvas;Me.imageSmoothingEnabled=!1,Me.drawImage(J,0,0,a,s),Me.imageSmoothingEnabled=!0}const Bo={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){D=t,Me=e,D&&!X&&(X=Y(D,Io),Rn=D.getUniformLocation(X,"u_video"),bn=D.getUniformLocation(X,"u_res"),Sn=D.getUniformLocation(X,"u_cell"),Ln=D.getUniformLocation(X,"u_time"),Pn=D.getUniformLocation(X,"u_mirror"),Cn=D.getUniformLocation(X,"u_invert"))},render(t){D&&t.videoTex?Uo(t):No(t)},dispose(){Qe=null},onReselect(){it=!it}},Wo=`#version 300 es
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
`,$e=60,An=480,Mn=270,Go=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let P=null,et=null,ne=null,Fn=null,In=null,Un=null,Dn=null,$n=null,kn=null,On=null,oe=null,ke=null,he=-1,Oe=0;function Ho(t){oe=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,oe),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,An,Mn,$e),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),ke=t.createFramebuffer(),he=-1,Oe=0}function Xo(){P&&(oe&&P.deleteTexture(oe),ke&&P.deleteFramebuffer(ke),oe=null,ke=null,he=-1,Oe=0)}function Vo(t){const e=P;he=(he+1)%$e,Oe=Math.min(Oe+1,$e),e.bindFramebuffer(e.FRAMEBUFFER,ke),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,oe,0,he),e.viewport(0,0,An,Mn),e.useProgram(et),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Fn,0),re(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ne),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,oe),e.uniform1i(In,0),e.uniform1f(Un,he),e.uniform1f(Dn,$e),e.uniform1f($n,Oe),e.uniform1f(kn,t.beat),e.uniform1i(On,t.mirror?1:0),re(e)}let tt,Q=null,wt,nt=null,se=[];function qo(t){const{width:e,height:n,data:o}=t.sample;Q||(Q=document.createElement("canvas"),wt=Q.getContext("2d")),(Q.width!==e||Q.height!==n)&&(Q.width=e,Q.height=n,nt=wt.createImageData(e,n),se=[]),se.push(new Uint8ClampedArray(o)),se.length>$e&&se.shift();const r=se.length-1,a=nt.data;for(let l=0;l<n;l++){let c=l/Math.max(1,n-1)*r;c+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(r,Math.max(0,c))),f=se[r-u],d=l*e*4;a.set(f.subarray(d,d+e*4),d)}wt.putImageData(nt,0,0);const{width:s,height:i}=tt.canvas;tt.imageSmoothingEnabled=!0,tt.drawImage(Q,0,0,s,i)}const Yo={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){P=t,tt=e,P&&(et||(et=Y(P,Go),Fn=P.getUniformLocation(et,"u_video"),ne=Y(P,Wo),In=P.getUniformLocation(ne,"u_history"),Un=P.getUniformLocation(ne,"u_head"),Dn=P.getUniformLocation(ne,"u_layers"),$n=P.getUniformLocation(ne,"u_filled"),kn=P.getUniformLocation(ne,"u_beat"),On=P.getUniformLocation(ne,"u_mirror")),Ho(P))},render(t){P&&t.videoTex&&oe?Vo(t):qo(t)},dispose(){Xo(),se=[],nt=null}},Mt=[so,ho,To,bo,Fo,Bo,Yo];function Te(t,e,n){return .2126*t+.7152*e+.0722*n}function jo(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,r=0;return{gl:e,videoTex:n,uploadVideo(a){const s=a.videoWidth,i=a.videoHeight;s===0||i===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||i!==r?(o=s,r=i,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,a)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,a))},dispose(){e.deleteTexture(n)}}}const zo="modulepreload",Ko=function(t,e){return new URL(t,e).href},Yt={},Zo=function(e,n,o){let r=Promise.resolve();if(n&&n.length>0){let c=function(u){return Promise.all(u.map(f=>Promise.resolve(f).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");r=c(n.map(u=>{if(u=Ko(u,o),u in Yt)return;Yt[u]=!0;const f=u.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(o)for(let E=s.length-1;E>=0;E--){const T=s[E];if(T.href===u&&(!f||T.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${d}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":zo,f||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),f)return new Promise((E,T)=>{m.addEventListener("load",E),m.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})};let ce="off",ge=null,Ft=-1,It=0,at={hands:0,pinching:0,points:[],corners:null};const jt=.4,Jo=.6,zt=2,Fe=new Map,Qo=1100,er=3,Kt=.05,tr=1500,Ie=new Map;let st=!1,Zt=0;function nr(){const t=st;return st=!1,t}function Ut(){return ce}function We(){return at}async function Nn(){if(ce==="off"){ce="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await Zo(async()=>{const{FilesetResolver:a,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:a,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),r=a=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:a},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{ge=await e.createFromOptions(o,r("GPU"))}catch{ge=await e.createFromOptions(o,r("CPU"))}ce="on"}catch(t){throw ce="off",t}}}function or(){ge?.close(),ge=null,ce="off",Ft=-1,It=0,Fe.clear(),Ie.clear(),st=!1,at={hands:0,pinching:0,points:[],corners:null}}function rr(t,e){if(ce!=="on"||!ge||t.currentTime===Ft)return;const n=at.hands>0?33:100;if(e-It<n)return;Ft=t.currentTime,It=e;const o=ge.detectForVideo(t,e),r=[],a=o.landmarks?.length??0,s=t.videoWidth||1280,i=t.videoHeight||720,l=(f,d)=>Math.hypot((f.x-d.x)*s,(f.y-d.y)*i),c=new Set;for(let f=0;f<a;f++){const d=o.landmarks[f];let m=o.handednesses?.[f]?.[0]?.categoryName??`hand${f}`;c.has(m)&&(m=`${m}${f}`),c.add(m);const E=d[4],T=d[8],S=l(d[5],d[17]),_=l(E,T)/Math.max(S,1e-6);let C=0;for(const[U,A]of[[8,6],[12,10],[16,14],[20,18]])l(d[0],d[U])>l(d[0],d[A])*1.15&&C++;const O=C>=3,I=C<=1;let x=Fe.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Fe.set(m,x)),I?(x.down=!1,x.onFrames=0,x.offFrames=0):_<jt?(x.onFrames++,x.offFrames=0,x.onFrames>=zt&&(x.down=!0)):_>Jo?(x.offFrames++,x.onFrames=0,x.offFrames>=zt&&(x.down=!1)):(x.onFrames=0,x.offFrames=0);let y=Ie.get(m);if(y||(y={dir:0,extreme:d[9].x*s,reversals:[]},Ie.set(m,y)),O&&!x.down){const U=d[9].x*s,A=U-y.extreme;y.dir===0?Math.abs(A)>Kt*s&&(y.dir=Math.sign(A),y.extreme=U):Math.sign(A)===y.dir?y.extreme=U:Math.abs(A)>Kt*s&&(y.dir=Math.sign(A),y.extreme=U,y.reversals.push(e),y.reversals=y.reversals.filter(we=>e-we<Qo),y.reversals.length>=er&&e>Zt&&(st=!0,Zt=e+tr,y.reversals=[]))}else y.dir=0,y.extreme=d[9].x*s,y.reversals=[];r.push({handedness:m,thumb:{x:E.x,y:E.y},index:{x:T.x,y:T.y},threshold:jt*S/s,ratio:_,pinching:x.down,open:O,fist:I,x:(E.x+T.x)/2,y:(E.y+T.y)/2})}for(const f of[...Fe.keys()])c.has(f)||Fe.delete(f);for(const f of[...Ie.keys()])c.has(f)||Ie.delete(f);const u=r.filter(f=>f.pinching);at={hands:a,pinching:u.length,points:r,corners:u.length>=2?[u[0],u[1]]:null}}function Bn(t,e,n,o){const r=Math.max(n/t,o/e),a=t*r,s=e*r;return{x:(n-a)/2,y:(o-s)/2,w:a,h:s}}function lt(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function Wn(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const ot={minDist:1.5,baseWidth:12,maxPoints:2e4,bufferMs:250},ir=["#28c840","#ffffff","#141414","#1f6bff","#9cc3ff"];let ar=ir[0];const ue=new Map,j=[];let Ee=0,M=null,k=null,q=null,B=null;const Gn=5;function Hn(t){const e=parseInt(t.slice(1),16);return .2126*(e>>16&255)+.7152*(e>>8&255)+.0722*(e&255)<128?"rgba(255,255,255,0.85)":"rgba(18,18,18,0.7)"}function sr(t,e){if(M||(M=document.createElement("canvas"),q=document.createElement("canvas"),k=M.getContext("2d"),B=q.getContext("2d")),M.width===t&&M.height===e)return;const n=M.width,o=M.height;if(n>0&&o>0){const r=t/n,a=e/o,s=(r+a)/2;for(const i of j)for(const l of i.pts)l.x*=r,l.y*=a,l.w*=s}M.width=t,M.height=e,q.width=t,q.height=e,Nt()}function Dt(t,e,n,o){const r=e.pts;t.strokeStyle=o?Hn(e.color):e.color,t.lineCap="round",t.lineJoin="round";const a=o?Gn:0;if(n===1){t.lineWidth=r[1].w+a,t.beginPath(),t.moveTo(r[0].x,r[0].y),t.lineTo((r[0].x+r[1].x)/2,(r[0].y+r[1].y)/2),t.stroke();return}const s=r[n-2],i=r[n-1],l=r[n],c={x:(s.x+i.x)/2,y:(s.y+i.y)/2},u={x:(i.x+l.x)/2,y:(i.y+l.y)/2};t.lineWidth=i.w+a,t.beginPath(),t.moveTo(c.x,c.y),t.quadraticCurveTo(i.x,i.y,u.x,u.y),t.stroke()}function $t(t,e,n){const o=e.pts[0];t.fillStyle=n?Hn(e.color):e.color,t.beginPath(),t.arc(o.x,o.y,(o.w+(n?Gn:0))/2,0,Math.PI*2),t.fill()}function xe(t,e,n){if(e.pts.length!==0){if(e.pts.length===1){$t(t,e,n);return}for(let o=1;o<e.pts.length;o++)Dt(t,e,o,n)}}function lr(t,e){B&&Dt(B,t,e,!0),k&&Dt(k,t,e,!1)}function Nt(){if(!(!M||!k||!q||!B)){k.clearRect(0,0,M.width,M.height),B.clearRect(0,0,q.width,q.height);for(const t of j)xe(B,t,!0),xe(k,t,!1)}}function Xn(t){!t.stroke||!k||!B||(t.pendingSince=-1,xe(B,t.stroke,!0),xe(k,t.stroke,!1),t.inked=t.stroke.pts.length,j.push(t.stroke))}function yt(t){t.stroke&&t.pendingSince>=0&&Xn(t),t.stroke&&t.stroke.pts.length===1&&k&&B&&($t(B,t.stroke,!0),$t(k,t.stroke,!1)),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Vn(t){Ee-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function cr(){let t=!1;for(;Ee>ot.maxPoints&&j.length>0;)Ee-=j.shift().pts.length,t=!0;t&&Nt()}function ur(t,e,n,o,r){const a=new Set;for(const s of t){a.add(s.handedness);let i=ue.get(s.handedness);if(i||(i={drawing:!1,stroke:null,pendingSince:-1,inked:0},ue.set(s.handedness,i)),o&&i.drawing){i.pendingSince>=0?Vn(i):yt(i);continue}if(i.drawing&&!s.pinching){yt(i);continue}if(!i.drawing&&s.pinching&&!o&&(i.drawing=!0,i.stroke={color:ar,pts:[]},i.pendingSince=r,i.inked=0),!i.drawing||!i.stroke)continue;const l=Wn(lt(s.thumb,e,n),lt(s.index,e,n)),c=i.stroke.pts[i.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=ot.minDist)&&(i.stroke.pts.push({x:l.x,y:l.y,w:ot.baseWidth}),Ee++),i.pendingSince>=0)r-i.pendingSince>ot.bufferMs&&Xn(i);else if(k)for(;i.inked<i.stroke.pts.length;)i.inked++,i.inked>=2&&lr(i.stroke,i.inked-1)}for(const[s,i]of ue)!a.has(s)&&i.drawing&&yt(i);cr()}function fr(t){M&&q&&(j.length>0||qn())&&(t.drawImage(q,0,0),t.drawImage(M,0,0));for(const e of ue.values())e.drawing&&e.pendingSince>=0&&e.stroke&&(xe(t,e.stroke,!0),xe(t,e.stroke,!1))}function qn(){for(const t of ue.values())if(t.drawing)return!0;return!1}function Yn(t){return ue.get(t)?.drawing??!1}function dr(){return j.length>0||qn()}function mr(){for(const t of ue.values())Vn(t);j.length=0,Ee=0,Nt()}function hr(){return{strokes:j.length,points:Ee}}const Jt=128,vr=2,Rt=[90,100,110,120,128,140],Ge=.08,pr=400,gr=150;let v,g=null,p,ct,jn,ut,le=null,bt=!1,St=!1,Ne=null,kt=0;const ft=document.createElement("canvas"),de=ft.getContext("2d",{willReadFrequently:!0}),ve=new no,Be=new tn;let zn=0;const Er=new ImageData(2,2),F=[];let R=null,_e=0,Qt=0,be=null;const dt=new Set;function fe(){return Mt[_e%Mt.length]}function Bt(t){dt.has(t.id)||(t.init(le?.gl??null,jn),dt.add(t.id))}function mt(){const t=new Set;for(const e of F)t.add(e.effect.id);R&&t.add(R.effect.id);for(const e of[...dt])t.has(e)||(Mt.find(n=>n.id===e)?.dispose(),dt.delete(e))}function xr(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const He=.06;function Tr(t){const e=t.map(s=>({x:g.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),r=Math.min(e[0].y,e[1].y),a=Math.max(e[0].y,e[1].y);return n<He&&(n=0),r<He&&(r=0),o>1-He&&(o=1),a>1-He&&(a=1),o-n<Ge&&(o=n+Ge),a-r<Ge&&(a=r+Ge),{x0:n,y0:r,x1:o,y1:a}}function _r(t){const e=We();if(e.corners&&g){Qt=t;const n=Tr(e.corners);if(R)R.rect.x0+=(n.x0-R.rect.x0)*.3,R.rect.y0+=(n.y0-R.rect.y0)*.3,R.rect.x1+=(n.x1-R.rect.x1)*.3,R.rect.y1+=(n.y1-R.rect.y1)*.3;else{if(be===null&&(be=t),t-be<gr)return;be=null,R={rect:n,effect:fe()},_e++,Bt(R.effect),v.setFxLabel(R.effect.name)}return}be=null,R&&t-Qt>pr&&(Kn(R),R=null)}function Kn(t){for(let e=F.length-1;e>=0;e--)xr(t.rect,F[e].rect)&&F.splice(e,1);F.push(t),mt(),v.setFxLabel(`NEXT ${fe().name}`)}function Wt(){if(!g)return;const t=g.video.videoWidth||4,e=g.video.videoHeight||3,n=16,o=4,r=Math.max(64,window.innerWidth-n*2-o),a=Math.max(64,window.innerHeight-n*2-o-v.chromeHeight()),s=Math.min(r/t,a/e),i=Math.round(t*s),l=Math.round(e*s),c=Math.min(vr,window.devicePixelRatio||1);v.canvas.style.width=`${i}px`,v.canvas.style.height=`${l}px`,v.setDeviceWidth(i);for(const u of[v.canvas,ct,ut])u.width=Math.round(i*c),u.height=Math.round(l*c);sr(v.canvas.width,v.canvas.height),ft.width=Jt,ft.height=Math.max(2,Math.round(Jt*e/t))}function wr(){const{width:t,height:e}=ft;return de.save(),g.mirror&&(de.translate(t,0),de.scale(-1,1)),de.drawImage(g.video,0,0,t,e),de.restore(),de.getImageData(0,0,t,e)}function yr(){const{width:t,height:e}=v.canvas;p.save(),g.mirror&&(p.translate(t,0),p.scale(-1,1)),p.drawImage(g.video,0,0,t,e),p.restore()}function en(t,e,n){const{width:o,height:r}=v.canvas,a=t.rect.x0*o,s=t.rect.y0*r,i=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*r;p.drawImage(e,a,s,i,l,a,s,i,l),p.strokeStyle="#ffffff",p.lineWidth=Math.max(2,o/640),n&&p.setLineDash([10,8]),p.strokeRect(a,s,i,l),p.setLineDash([])}function Rr(t){yr();const e=F.map(i=>({f:i,isDrawing:!1}));if(R&&e.push({f:R,isDrawing:!0}),e.length===0)return;const n=e.some(({f:i})=>i.effect.usesGl&&le),o=e.some(({f:i})=>!(i.effect.usesGl&&le));n&&le.uploadVideo(g.video);const r={videoTex:n?le.videoTex:null,sample:o?wr():Er,video:g.video,mirror:g.mirror,time:t.time,frame:t.frame,beat:t.beat};let a=null,s=null;for(const{f:i,isDrawing:l}of e)!!i.effect.usesGl&&!!le?(s!==i.effect&&(i.effect.render(r),s=i.effect),en(i,ut,l)):(a!==i.effect&&(i.effect.render(r),a=i.effect),en(i,ct,l))}function br(){const t=We();if(t.points.length===0||!g)return;const{width:e,height:n}=v.canvas,o=Bn(g.video.videoWidth||4,g.video.videoHeight||3,e,n);p.lineWidth=Math.max(2,e/500);for(const r of t.points){if(r.fist)continue;const a=lt(r.thumb,o,g.mirror),s=lt(r.index,o,g.mirror),l=Yn(r.handedness)?"#28c840":r.pinching?"#1f6bff":"#ffffff";p.strokeStyle=l,p.save(),p.lineWidth=Math.max(1,e/900),p.beginPath(),p.moveTo(a.x,a.y),p.lineTo(s.x,s.y),p.stroke(),p.restore();const c=Math.max(8,r.threshold*o.w/2);for(const f of[a,s])p.beginPath(),p.arc(f.x,f.y,c,0,Math.PI*2),p.stroke();const u=Wn(a,s);p.beginPath(),p.arc(u.x,u.y,Math.max(3,e/240),0,Math.PI*2),p.fillStyle=l,p.fill()}}function Sr(){if(!Ne)return;const t=We(),e=hr(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.fist?"FIST ":o.open?"OPEN ":"  -  "} ${Yn(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),Ne.textContent=n.join(`
`)}function Zn(t){requestAnimationFrame(Zn);const e=ve.tick(t),n=g!==null&&g.video.readyState>=2;if(n&&(rr(g.video,t),nr()&&Mr(t),_r(t)),e.playing&&n){const o=We(),r=R!==null||o.pinching>=2,a=Bn(g.video.videoWidth||4,g.video.videoHeight||3,v.canvas.width,v.canvas.height);ur(o.points,a,g.mirror,r,t),Rr(e),fr(p),br(),t<kt&&(p.fillStyle=`rgba(255,255,255,${.8*(kt-t)/280})`,p.fillRect(0,0,v.canvas.width,v.canvas.height)),Sr()}Be.captureFrame(v.canvas),Be.recording&&v.setRecordTime((t-zn)/1e3),v.setHands(Ut(),We().hands>0),v.setTransport(e.frame,e.fps,e.bpm,e.playing)}function Jn(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Lr(){if(!g||!tn.supported())return;if(!Be.recording){Be.start(v.canvas),zn=performance.now(),v.setRecording(!0);return}v.setRecording(!1);const t=await Be.stop();t&&Jn(t.blob,`null8_${ve.timecode().replaceAll(":","")}.${t.ext}`)}async function Pr(){if(Ut()!=="loading"){if(Ut()==="on"){or();return}v.setHands("loading",!1);try{await Nn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Cr(){if(!g||St)return;St=!0;const t=g.facing;try{g=await eo(g)}catch{g=await Ot(t)}finally{St=!1}Wt()}function Ar(){v.canvas.toBlob(t=>{t&&Jn(t,`null8_${ve.timecode().replaceAll(":","")}.png`)},"image/png")}function Mr(t){if(dr())mr();else if(F.length>0||R!==null)F.length=0,R=null,mt(),_e=0,v.setFxLabel(`NEXT ${fe().name}`);else return;kt=t+220}function Fr(){F.length>0?(F.pop(),mt()):_e++,v.setFxLabel(`NEXT ${fe().name}`)}async function Ir(){if(!(g||bt)){bt=!0;try{g=await Ot("user"),v.hideStartOverlay(),Wt(),requestAnimationFrame(Zn),Nn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=fe();_e++,Bt(e),F.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),v.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);v.showStartError(e),bt=!1}}}function Ur(){const t=document.getElementById("app");v=oo(t,{onStart:()=>{Ir()},onCanvasTap:Fr,onPlayToggle:()=>ve.toggle(),onSnapshot:Ar,onTempoTap:()=>{const e=Rt.indexOf(ve.bpm);ve.bpm=Rt[(e+1)%Rt.length]},onRecordToggle:()=>{Lr()},onCameraFlip:()=>{Cr()},onHandsToggle:()=>{Pr()}}),p=v.canvas.getContext("2d"),ct=document.createElement("canvas"),jn=ct.getContext("2d"),ut=document.createElement("canvas"),le=jo(ut),v.setFxLabel(`NEXT ${fe().name}`),window.addEventListener("resize",Wt),new URLSearchParams(location.search).has("debug")&&(Ne=document.createElement("pre"),Ne.className="debug-hud",document.body.appendChild(Ne)),window.__null8={addFrame(e){const n=fe();_e++,Bt(n),Kn({rect:e,effect:n})},clearFrames(){F.length=0,mt()},get frames(){return F.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Ur();
