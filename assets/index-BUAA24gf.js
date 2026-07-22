(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();async function vt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function yn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function Rn(t){const e=t.facing==="user"?"environment":"user";return yn(t),vt(e)}const bn=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class St{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=bn.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",i=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:i}}}const yt=60;class Ln{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,i=Math.floor(e)%60,r=Math.floor(e*yt)%yt,l=a=>String(a).padStart(2,"0");return`${l(n)}:${l(o)}:${l(i)}:${l(r)}`}}function d(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function Cn(t,e){const n=d("header","titlebar"),o=d("div","traffic");for(const E of["r","y","g"])o.appendChild(d("span",E));const i=d("div","path","/project1/null8 (128,128)");n.append(o,i,d("div","spacer"));const r=d("div","viewport"),l=d("canvas");r.appendChild(l),r.addEventListener("click",()=>e.onCanvasTap());const a=d("div","start-overlay"),c=d("div","pulse"),s=d("div","big","TAP TO START"),u=d("div","sub",`webcam access required
HTTPS or localhost only`);a.append(c,s,u),a.addEventListener("click",E=>{E.stopPropagation(),e.onStart()}),r.appendChild(a);const m=d("div","timeline"),f=d("div","head");m.appendChild(f);const h=d("footer","transport"),_=d("div","group"),T=d("span","lcd","00:00:00:00");_.append(d("span","label","Timecode"),T,d("span","label","(60fps)"));const b=d("div","group"),w=d("span","lcd small","0");b.append(d("span","label","F"),w);const g=d("button","on","❚❚");g.title="play / stop",g.addEventListener("click",()=>e.onPlayToggle());const L=d("button","rec-btn","VIDEO");L.title="record video",L.addEventListener("click",()=>e.onRecordToggle());const K=d("div","group"),M=d("span","lcd small","—");K.append(d("span","label","FX"),M);const F=d("div","group"),Tt=d("span","lcd small","60.0");F.append(d("span","label","FPS"),Tt);const xt=d("div","group"),be=d("span","lcd small","120");be.style.cursor="pointer",be.addEventListener("click",()=>e.onTempoTap()),xt.append(d("span","label","Tempo"),be,d("span","label","BPM"));const oe=d("button","hands-btn","✋︎");oe.title="hand tracking",oe.addEventListener("click",()=>e.onHandsToggle());const Ye=d("button",void 0,"⇄");Ye.title="switch camera",Ye.addEventListener("click",()=>e.onCameraFlip());const je=d("button",void 0,"PHOTO CAPTURE");je.title="photo capture",je.addEventListener("click",()=>e.onSnapshot()),h.append(_,b,g,L,K,d("div","push"),F,xt,oe,Ye,je);const ze=d("div","device");return ze.append(n,r,m,h),t.append(ze),{canvas:l,chromeHeight(){return n.offsetHeight+m.offsetHeight+h.offsetHeight},setDeviceWidth(E){ze.style.width=`${E+4}px`},hideStartOverlay(){a.classList.add("hidden")},showStartError(E){s.textContent="CAMERA ERROR",u.textContent=E,c.style.animationDuration="0.4s"},setFxLabel(E){M.textContent=E},setTransport(E,Ke,xn,wn,wt){T.textContent=E,w.textContent=String(Ke).padStart(6,"0"),Tt.textContent=xn.toFixed(1),be.textContent=String(wn),g.textContent=wt?"❚❚":"►",g.classList.toggle("on",wt)},setTimelineProgress(E){f.style.width=`${(E*100).toFixed(2)}%`},setRecording(E){L.classList.toggle("recording",E),T.classList.toggle("rec",E)},setHands(E,Ke){oe.classList.toggle("loading",E==="loading"),oe.classList.toggle("on",E==="on"),oe.classList.toggle("detect",E==="on"&&Ke)}}}const An=6,Rt=2;let O,Ne=0,lt=0,Ce=new Float64Array(0),Ae=new Float64Array(0),Ue=new Float64Array(0),Pe=new Float64Array(0),Se=new Float64Array(0);function Un(t){const{width:e,height:n,data:o}=t;if(e!==Ne||n!==lt){Ne=e,lt=n;const r=(e+1)*(n+1);Ce=new Float64Array(r),Ae=new Float64Array(r),Ue=new Float64Array(r),Pe=new Float64Array(r),Se=new Float64Array(r)}const i=e+1;for(let r=0;r<n;r++){let l=0,a=0,c=0,s=0,u=0;for(let m=0;m<e;m++){const f=(r*e+m)*4,h=o[f],_=o[f+1],T=o[f+2],b=ue(h,_,T);l+=b,a+=b*b,c+=h,s+=_,u+=T;const w=(r+1)*i+(m+1),g=r*i+(m+1);Ce[w]=Ce[g]+l,Ae[w]=Ae[g]+a,Ue[w]=Ue[g]+c,Pe[w]=Pe[g]+s,Se[w]=Se[g]+u}}}function de(t,e,n,o,i){const r=Ne+1;return t[(n+i)*r+(e+o)]-t[n*r+(e+o)]-t[(n+i)*r+e]+t[n*r+e]}function Pn(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function me(t,e,n,o,i,r,l,a,c){const s=n*o,u=de(Ce,t,e,n,o)/s,m=de(Ae,t,e,n,o)/s-u*u;if(i<An&&n>Rt&&o>Rt&&m>r){const M=n>>1,F=o>>1;me(t,e,M,F,i+1,r,l,a,c),me(t+M,e,n-M,F,i+1,r,l,a,c),me(t,e+F,M,o-F,i+1,r,l,a,c),me(t+M,e+F,n-M,o-F,i+1,r,l,a,c);return}const h=de(Ue,t,e,n,o)/s,_=de(Pe,t,e,n,o)/s,T=de(Se,t,e,n,o)/s,b=Pn(t,e,Math.floor(c*2))<.025;O.fillStyle=b?"#2ea44f":`rgb(${Math.round(h)},${Math.round(_)},${Math.round(T)})`;const w=t*l,g=e*a,L=n*l,K=o*a;O.fillRect(w,g,L,K),O.strokeRect(w+.5,g+.5,L-1,K-1)}const Sn={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){O=e},render(t){const{width:e,height:n}=O.canvas,{width:o,height:i}=t.sample;Un(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);O.fillStyle="#000",O.fillRect(0,0,e,n),O.strokeStyle="#000",O.lineWidth=1,me(0,0,o,i,0,r,e/o,n/i,t.beat)},dispose(){Ne=0,lt=0}},Mn=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function bt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${i}`)}return o}function G(t,e,n=Mn){const o=bt(t,t.VERTEX_SHADER,n),i=bt(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,i),t.linkProgram(r),t.deleteShader(o),t.deleteShader(i),!t.getProgramParameter(r,t.LINK_STATUS)){const l=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${l}`)}return r}function z(t){t.drawArrays(t.TRIANGLES,0,3)}function Fn(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const i=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:i,texture:o,width:e,height:n}}function Mt(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const Dn=`#version 300 es
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
`;let D=null,Q=null,Ft=null,Dt=null,It=null,$t=null;function In(t){const e=D;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(Q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Ft,0),e.uniform2f(Dt,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(It,t.time),e.uniform1i($t,t.mirror?1:0),z(e)}let Me,H=null,Ze,he=new Float32Array(0),Fe=null;function $n(t){const{width:e,height:n,data:o}=t.sample;H||(H=document.createElement("canvas"),Ze=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,he=new Float32Array(e*n),Fe=Ze.createImageData(e,n));for(let a=0,c=0;a<e*n;a++,c+=4)he[a]=ue(o[c],o[c+1],o[c+2])/255;const i=Fe.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){let s=0;c>0&&c<e-1&&a>0&&a<n-1&&(s=he[(a-1)*e+(c-1)]-he[(a+1)*e+(c+1)]);const u=(a*e+c)*4;i[u]=Math.min(255,Math.max(0,248-s*2.3*255)),i[u+1]=Math.min(255,Math.max(0,247-s*1.6*255)),i[u+2]=Math.min(255,Math.max(0,242-s*2.9*255)),i[u+3]=255}Ze.putImageData(Fe,0,0);const{width:r,height:l}=Me.canvas;Me.imageSmoothingEnabled=!0,Me.drawImage(H,0,0,r,l)}const Bn={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){D=t,Me=e,D&&!Q&&(Q=G(D,Dn),Ft=D.getUniformLocation(Q,"u_video"),Dt=D.getUniformLocation(Q,"u_texel"),It=D.getUniformLocation(Q,"u_time"),$t=D.getUniformLocation(Q,"u_mirror"))},render(t){D&&t.videoTex?In(t):$n(t)},dispose(){he=new Float32Array(0),Fe=null}},On=`#version 300 es
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
`;let S=null,V=null,Bt=null,Ot=null,Gt=null,Ht=null,Nt=null;function Gn(t){const e=S,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(V),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Bt,0),e.uniform2f(Ot,n,o),e.uniform1f(Gt,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(Ht,t.time),e.uniform1i(Nt,t.mirror?1:0),z(e)}const Hn=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Nn=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let ve,N=null,Qe,pe=new Float32Array(0),De=null;function Xn(t){const{width:e,height:n,data:o}=t.sample;N||(N=document.createElement("canvas"),Qe=N.getContext("2d")),(N.width!==e||N.height!==n)&&(N.width=e,N.height=n,pe=new Float32Array(e*n),De=Qe.createImageData(e,n));for(let c=0,s=0;c<e*n;c++,s+=4)pe[c]=ue(o[s],o[s+1],o[s+2])/255;const i=t.time,r=De.data;for(let c=0;c<n;c++){const s=c/n,u=Math.sin(s*58+i*2.4)*.55+Math.sin(s*21-i*1.6)*.45,m=Hn[c&3];for(let f=0;f<e;f++){const h=pe[c*e+f];let _=0;for(let g=0;g<4;g++){const L=Math.round(u*(.006+g*.014)*(.35+h)*e),K=Math.min(e-1,Math.max(0,f+L));_=Math.max(_,pe[c*e+K]*Math.pow(.7,g))}const T=_+(m[f&3]-.5)*.28,b=Nn[T>.72?0:T>.45?1:T>.24?2:3],w=(c*e+f)*4;r[w]=b[0],r[w+1]=b[1],r[w+2]=b[2],r[w+3]=255}}Qe.putImageData(De,0,0);const{width:l,height:a}=ve.canvas;ve.imageSmoothingEnabled=!1,ve.drawImage(N,0,0,l,a),ve.imageSmoothingEnabled=!0}const kn={id:"wave",name:"WAVE",usesGl:!0,init(t,e){S=t,ve=e,S&&!V&&(V=G(S,On),Bt=S.getUniformLocation(V,"u_video"),Ot=S.getUniformLocation(V,"u_res"),Gt=S.getUniformLocation(V,"u_cell"),Ht=S.getUniformLocation(V,"u_time"),Nt=S.getUniformLocation(V,"u_mirror"))},render(t){S&&t.videoTex?Gn(t):Xn(t)},dispose(){pe=new Float32Array(0),De=null}},Wn=`#version 300 es
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
`;let q=null,ie=null,Xt=null,kt=null,Wt=null;function Vn(t){const e=q;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ie),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Xt,0),e.uniform1f(kt,t.time),e.uniform1i(Wt,t.mirror?1:0),z(e)}const qn=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let ge,X=null,Je,Ie=null;function Yn(t){const{width:e,height:n,data:o}=t.sample;X||(X=document.createElement("canvas"),Je=X.getContext("2d")),(X.width!==e||X.height!==n)&&(X.width=e,X.height=n,Ie=Je.createImageData(e,n));const i=Ie.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){const s=(a*e+c)*4,u=(Math.random()-.5)*.16,m=ue(o[s],o[s+1],o[s+2])/255+u,f=qn[m<.3?0:m<.52?1:m<.72?2:3];i[s]=f[0],i[s+1]=f[1],i[s+2]=f[2],i[s+3]=255}Je.putImageData(Ie,0,0);const{width:r,height:l}=ge.canvas;ge.imageSmoothingEnabled=!1,ge.drawImage(X,0,0,r,l),ge.imageSmoothingEnabled=!0}const jn={id:"riso",name:"RISO",usesGl:!0,init(t,e){q=t,ge=e,q&&!ie&&(ie=G(q,Wn),Xt=q.getUniformLocation(ie,"u_video"),kt=q.getUniformLocation(ie,"u_time"),Wt=q.getUniformLocation(ie,"u_mirror"))},render(t){q&&t.videoTex?Vn(t):Yn(t)},dispose(){Ie=null}},zn=`#version 300 es
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
`,Kn=`#version 300 es
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
`,et=200,le={wave:1,trail:.14},tt=[1,2,3.5,.4],Zn=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Qn=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let y=null,I=null,ct=null,Vt=null,qt=null,Yt=null,jt=null,zt=null,Kt=null,Zt=null,st=null,Qt=null,U=null,_e=!0;function Jn(t){const e=y,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!U||U.width!==n||U.height!==o)&&(U&&Mt(e,U),U=Fn(e,n,o),_e=!0),e.bindFramebuffer(e.FRAMEBUFFER,U.framebuffer),e.viewport(0,0,n,o),_e&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),_e=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(ct),e.uniform1f(Zt,le.trail),z(e);const i=Math.max(2,Math.round(et*t.video.videoHeight/t.video.videoWidth));e.useProgram(I),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Vt,0),e.uniform2f(qt,et,i),e.uniform2f(Yt,n,o),e.uniform1f(jt,t.time),e.uniform1f(zt,le.wave),e.uniform1i(Kt,t.mirror?1:0),e.drawArrays(e.POINTS,0,et*i),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(st),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,U.texture),e.uniform1i(Qt,0),z(e)}const Lt=2;let ut,$=null,Z,Te=!0;function eo(t){const{width:e,height:n}=ut.canvas,{width:o,height:i,data:r}=t.sample;$||($=document.createElement("canvas"),Z=$.getContext("2d")),($.width!==e||$.height!==n)&&($.width=e,$.height=n,Te=!0),Te?(Z.fillStyle="#000",Z.fillRect(0,0,e,n),Te=!1):(Z.fillStyle=`rgba(0,0,0,${le.trail})`,Z.fillRect(0,0,e,n));const l=e/o,a=n/i,c=t.time,s=le.wave;for(let u=0;u<i;u+=Lt)for(let m=0;m<o;m+=Lt){const f=(u*o+m)*4,h=ue(r[f],r[f+1],r[f+2])/255;if(h<.04)continue;const _=Math.sin(c*2+m*.35+u*.18)*(1+h*5)*l*.6*s,T=Math.cos(c*1.6+u*.28+m*.11)*(1+h*3)*a*.4*s,b=Math.round(24+h*60),w=Math.round(90+h*150),g=Math.round(200+h*55),L=(.6+h*2.6)*l*.5;Z.fillStyle=`rgba(${b},${w},${g},${.2+h*.8})`,Z.fillRect(m*l+_,u*a+T,L,L)}ut.drawImage($,0,0)}const to={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){y=t,ut=e,Te=!0,_e=!0,y&&!I&&(I=G(y,Kn,zn),Vt=y.getUniformLocation(I,"u_video"),qt=y.getUniformLocation(I,"u_grid"),Yt=y.getUniformLocation(I,"u_res"),jt=y.getUniformLocation(I,"u_time"),zt=y.getUniformLocation(I,"u_wave"),Kt=y.getUniformLocation(I,"u_mirror"),ct=G(y,Zn),Zt=y.getUniformLocation(ct,"u_alpha"),st=G(y,Qn),Qt=y.getUniformLocation(st,"u_tex"))},render(t){y&&t.videoTex?Jn(t):eo(t)},dispose(){y&&U&&Mt(y,U),U=null,$=null,Te=!0,_e=!0},onReselect(){const t=tt.indexOf(le.wave);le.wave=tt[(t+1)%tt.length]}},no=`#version 300 es
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
`;let Xe=!1,A=null,B=null,Jt=null,en=null,tn=null,nn=null,on=null,rn=null;function oo(t){const e=A,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(B),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Jt,0),e.uniform2f(en,n,o),e.uniform1f(tn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(nn,t.time),e.uniform1i(on,t.mirror?1:0),e.uniform1i(rn,Xe?1:0),z(e)}const ro=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),io={r:238,g:244,b:250},ao={r:22,g:72,b:158},lo=.12;let Ee,k=null,nt,$e=null;function co(t){const{width:e,height:n,data:o}=t.sample;k||(k=document.createElement("canvas"),nt=k.getContext("2d")),(k.width!==e||k.height!==n)&&(k.width=e,k.height=n,$e=nt.createImageData(e,n));const i=$e.data;for(let a=0;a<n;a++){const c=ro[a&3];for(let s=0;s<e;s++){const u=(a*e+s)*4;let f=ue(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*lo>c[s&3];Xe&&(f=!f);const h=f?io:ao;i[u]=h.r,i[u+1]=h.g,i[u+2]=h.b,i[u+3]=255}}nt.putImageData($e,0,0);const{width:r,height:l}=Ee.canvas;Ee.imageSmoothingEnabled=!1,Ee.drawImage(k,0,0,r,l),Ee.imageSmoothingEnabled=!0}const so={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){A=t,Ee=e,A&&!B&&(B=G(A,no),Jt=A.getUniformLocation(B,"u_video"),en=A.getUniformLocation(B,"u_res"),tn=A.getUniformLocation(B,"u_cell"),nn=A.getUniformLocation(B,"u_time"),on=A.getUniformLocation(B,"u_mirror"),rn=A.getUniformLocation(B,"u_invert"))},render(t){A&&t.videoTex?oo(t):co(t)},dispose(){$e=null},onReselect(){Xe=!Xe}},uo=`#version 300 es
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
`,xe=60,an=480,ln=270,fo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let R=null,Be=null,Y=null,cn=null,sn=null,un=null,dn=null,fn=null,mn=null,hn=null,j=null,we=null,ae=-1,ye=0;function mo(t){j=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,j),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,an,ln,xe),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),we=t.createFramebuffer(),ae=-1,ye=0}function ho(){R&&(j&&R.deleteTexture(j),we&&R.deleteFramebuffer(we),j=null,we=null,ae=-1,ye=0)}function vo(t){const e=R;ae=(ae+1)%xe,ye=Math.min(ye+1,xe),e.bindFramebuffer(e.FRAMEBUFFER,we),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,j,0,ae),e.viewport(0,0,an,ln),e.useProgram(Be),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(cn,0),z(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(Y),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,j),e.uniform1i(sn,0),e.uniform1f(un,ae),e.uniform1f(dn,xe),e.uniform1f(fn,ye),e.uniform1f(mn,t.beat),e.uniform1i(hn,t.mirror?1:0),z(e)}let Oe,W=null,ot,Ge=null,J=[];function po(t){const{width:e,height:n,data:o}=t.sample;W||(W=document.createElement("canvas"),ot=W.getContext("2d")),(W.width!==e||W.height!==n)&&(W.width=e,W.height=n,Ge=ot.createImageData(e,n),J=[]),J.push(new Uint8ClampedArray(o)),J.length>xe&&J.shift();const i=J.length-1,r=Ge.data;for(let c=0;c<n;c++){let s=c/Math.max(1,n-1)*i;s+=Math.sin((1-c/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(i,Math.max(0,s))),m=J[i-u],f=c*e*4;r.set(m.subarray(f,f+e*4),f)}ot.putImageData(Ge,0,0);const{width:l,height:a}=Oe.canvas;Oe.imageSmoothingEnabled=!0,Oe.drawImage(W,0,0,l,a)}const go={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){R=t,Oe=e,R&&(Be||(Be=G(R,fo),cn=R.getUniformLocation(Be,"u_video"),Y=G(R,uo),sn=R.getUniformLocation(Y,"u_history"),un=R.getUniformLocation(Y,"u_head"),dn=R.getUniformLocation(Y,"u_layers"),fn=R.getUniformLocation(Y,"u_filled"),mn=R.getUniformLocation(Y,"u_beat"),hn=R.getUniformLocation(Y,"u_mirror")),mo(R))},render(t){R&&t.videoTex&&j?vo(t):po(t)},dispose(){ho(),J=[],Ge=null}},dt=[Sn,Bn,kn,jn,to,so,go];function ue(t,e,n){return .2126*t+.7152*e+.0722*n}function Eo(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,i=0;return{gl:e,videoTex:n,uploadVideo(r){const l=r.videoWidth,a=r.videoHeight;l===0||a===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),l!==o||a!==i?(o=l,i=a,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const _o="modulepreload",To=function(t,e){return new URL(t,e).href},Ct={},xo=function(e,n,o){let i=Promise.resolve();if(n&&n.length>0){let s=function(u){return Promise.all(u.map(m=>Promise.resolve(m).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const l=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");i=s(n.map(u=>{if(u=To(u,o),u in Ct)return;Ct[u]=!0;const m=u.endsWith(".css"),f=m?'[rel="stylesheet"]':"";if(o)for(let _=l.length-1;_>=0;_--){const T=l[_];if(T.href===u&&(!m||T.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const h=document.createElement("link");if(h.rel=m?"stylesheet":_o,m||(h.as="script"),h.crossOrigin="",h.href=u,c&&h.setAttribute("nonce",c),document.head.appendChild(h),m)return new Promise((_,T)=>{h.addEventListener("load",_),h.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return i.then(l=>{for(const a of l||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};let te="off",ce=null,ft=-1,mt=0,pt={hands:0,pinching:0,corners:null};function ht(){return te}function vn(){return pt}async function pn(){if(te==="off"){te="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await xo(async()=>{const{FilesetResolver:r,HandLandmarker:l}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:l}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),i=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2});try{ce=await e.createFromOptions(o,i("GPU"))}catch{ce=await e.createFromOptions(o,i("CPU"))}te="on"}catch(t){throw te="off",t}}}function wo(){ce?.close(),ce=null,te="off",ft=-1,mt=0,pt={hands:0,pinching:0,corners:null}}function yo(t,e){if(te!=="on"||!ce||t.currentTime===ft||e-mt<66)return;ft=t.currentTime,mt=e;const n=ce.detectForVideo(t,e),o=[],i=n.landmarks?.length??0;for(const r of n.landmarks??[]){const l=r[4],a=r[8],c=Math.hypot(r[0].x-r[9].x,r[0].y-r[9].y);Math.hypot(l.x-a.x,l.y-a.y)<Math.max(.02,c*.32)&&o.push({x:(l.x+a.x)/2,y:(l.y+a.y)/2})}pt={hands:i,pinching:o.length,corners:o.length>=2?[o[0],o[1]]:null}}const At=128,Ro=2,rt=[90,100,110,120,128,140],Le=.08,bo=400,Lo=250;let v,p=null,C,ke,gn,We,ee=null,it=!1,at=!1;const Ve=document.createElement("canvas"),re=Ve.getContext("2d",{willReadFrequently:!0}),ne=new Ln,He=new St,Co=new ImageData(2,2),P=[];let x=null,Re=0,Ut=0,fe=null;const qe=new Set;function se(){return dt[Re%dt.length]}function gt(t){qe.has(t.id)||(t.init(ee?.gl??null,gn),qe.add(t.id))}function Et(){const t=new Set;for(const e of P)t.add(e.effect.id);x&&t.add(x.effect.id);for(const e of[...qe])t.has(e)||(dt.find(n=>n.id===e)?.dispose(),qe.delete(e))}function Ao(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}function Uo(t){const e=t.map(l=>({x:p.mirror?1-l.x:l.x,y:l.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),i=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return o-n<Le&&(o=n+Le),r-i<Le&&(r=i+Le),{x0:n,y0:i,x1:o,y1:r}}function Po(t){const e=vn();if(e.corners&&p){Ut=t;const n=Uo(e.corners);if(x)x.rect.x0+=(n.x0-x.rect.x0)*.3,x.rect.y0+=(n.y0-x.rect.y0)*.3,x.rect.x1+=(n.x1-x.rect.x1)*.3,x.rect.y1+=(n.y1-x.rect.y1)*.3;else{if(fe===null&&(fe=t),t-fe<Lo)return;fe=null,x={rect:n,effect:se()},Re++,gt(x.effect),v.setFxLabel(x.effect.name)}return}fe=null,x&&t-Ut>bo&&(En(x),x=null)}function En(t){for(let e=P.length-1;e>=0;e--)Ao(t.rect,P[e].rect)&&P.splice(e,1);P.push(t),Et(),v.setFxLabel(`NEXT ${se().name}`)}function _t(){if(!p)return;const t=p.video.videoWidth||4,e=p.video.videoHeight||3,n=16,o=4,i=Math.max(64,window.innerWidth-n*2-o),r=Math.max(64,window.innerHeight-n*2-o-v.chromeHeight()),l=Math.min(i/t,r/e),a=Math.round(t*l),c=Math.round(e*l),s=Math.min(Ro,window.devicePixelRatio||1);v.canvas.style.width=`${a}px`,v.canvas.style.height=`${c}px`,v.setDeviceWidth(a);for(const u of[v.canvas,ke,We])u.width=Math.round(a*s),u.height=Math.round(c*s);Ve.width=At,Ve.height=Math.max(2,Math.round(At*e/t))}function So(){const{width:t,height:e}=Ve;return re.save(),p.mirror&&(re.translate(t,0),re.scale(-1,1)),re.drawImage(p.video,0,0,t,e),re.restore(),re.getImageData(0,0,t,e)}function Mo(){const{width:t,height:e}=v.canvas;C.save(),p.mirror&&(C.translate(t,0),C.scale(-1,1)),C.drawImage(p.video,0,0,t,e),C.restore()}function Pt(t,e,n){const{width:o,height:i}=v.canvas,r=t.rect.x0*o,l=t.rect.y0*i,a=(t.rect.x1-t.rect.x0)*o,c=(t.rect.y1-t.rect.y0)*i;C.drawImage(e,r,l,a,c,r,l,a,c),C.strokeStyle="#ffffff",C.lineWidth=Math.max(2,o/640),n&&C.setLineDash([10,8]),C.strokeRect(r,l,a,c),C.setLineDash([])}function Fo(t){Mo();const e=P.map(a=>({f:a,isDrawing:!1}));if(x&&e.push({f:x,isDrawing:!0}),e.length===0)return;const n=e.some(({f:a})=>a.effect.usesGl&&ee),o=e.some(({f:a})=>!(a.effect.usesGl&&ee));n&&ee.uploadVideo(p.video);const i={videoTex:n?ee.videoTex:null,sample:o?So():Co,video:p.video,mirror:p.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,l=null;for(const{f:a,isDrawing:c}of e)!!a.effect.usesGl&&!!ee?(l!==a.effect&&(a.effect.render(i),l=a.effect),Pt(a,We,c)):(r!==a.effect&&(a.effect.render(i),r=a.effect),Pt(a,ke,c))}function _n(t){requestAnimationFrame(_n);const e=ne.tick(t),n=p!==null&&p.video.readyState>=2;n&&(yo(p.video,t),Po(t)),e.playing&&n&&Fo(e),He.captureFrame(v.canvas),v.setHands(ht(),vn().hands>0),v.setTransport(ne.timecode(),e.frame,e.fps,e.bpm,e.playing),v.setTimelineProgress(e.beat%4/4)}function Tn(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Do(){if(!p||!St.supported())return;if(!He.recording){He.start(v.canvas),v.setRecording(!0);return}v.setRecording(!1);const t=await He.stop();t&&Tn(t.blob,`null8_${ne.timecode().replaceAll(":","")}.${t.ext}`)}async function Io(){if(ht()!=="loading"){if(ht()==="on"){wo();return}v.setHands("loading",!1);try{await pn()}catch(t){console.error("hand tracking init failed:",t)}}}async function $o(){if(!p||at)return;at=!0;const t=p.facing;try{p=await Rn(p)}catch{p=await vt(t)}finally{at=!1}_t()}function Bo(){v.canvas.toBlob(t=>{t&&Tn(t,`null8_${ne.timecode().replaceAll(":","")}.png`)},"image/png")}function Oo(){P.length>0?(P.pop(),Et()):Re++,v.setFxLabel(`NEXT ${se().name}`)}async function Go(){if(!(p||it)){it=!0;try{p=await vt("user"),v.hideStartOverlay(),_t(),requestAnimationFrame(_n),pn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=se();Re++,gt(e),P.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),v.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);v.showStartError(e),it=!1}}}function Ho(){const t=document.getElementById("app");v=Cn(t,{onStart:()=>{Go()},onCanvasTap:Oo,onPlayToggle:()=>ne.toggle(),onSnapshot:Bo,onTempoTap:()=>{const e=rt.indexOf(ne.bpm);ne.bpm=rt[(e+1)%rt.length]},onRecordToggle:()=>{Do()},onCameraFlip:()=>{$o()},onHandsToggle:()=>{Io()}}),C=v.canvas.getContext("2d"),ke=document.createElement("canvas"),gn=ke.getContext("2d"),We=document.createElement("canvas"),ee=Eo(We),v.setFxLabel(`NEXT ${se().name}`),window.addEventListener("resize",_t),window.__null8={addFrame(e){const n=se();Re++,gt(n),En({rect:e,effect:n})},clearFrames(){P.length=0,Et()},get frames(){return P.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Ho();
