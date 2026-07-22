(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();async function mt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function wn(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function yn(t){const e=t.facing==="user"?"environment":"user";return wn(t),mt(e)}const Rn=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class St{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=Rn.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(r=>{e.onstop=()=>r()});e.stop(),await n;for(const r of this.stream?.getTracks()??[])r.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",i=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:i}}}const wt=60;class bn{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,i=Math.floor(e)%60,r=Math.floor(e*wt)%wt,l=a=>String(a).padStart(2,"0");return`${l(n)}:${l(o)}:${l(i)}:${l(r)}`}}function d(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function Ln(t,e){const n=d("header","titlebar"),o=d("div","traffic");for(const R of["r","y","g"])o.appendChild(d("span",R));const i=d("div","path","/project1/null8 (128,128)");n.append(o,i,d("div","spacer"));const r=d("main","stage"),l=d("div","viewport"),a=d("canvas");l.appendChild(a),l.addEventListener("click",()=>e.onCanvasTap());const c=d("div","start-overlay"),s=d("div","pulse"),u=d("div","big","TAP TO START"),m=d("div","sub",`webcam access required
HTTPS or localhost only`);c.append(s,u,m),c.addEventListener("click",()=>e.onStart()),r.append(l,c);const f=d("div","timeline"),h=d("div","head");f.appendChild(h);const g=d("footer","transport"),_=d("div","group"),b=d("span","lcd","00:00:00:00");_.append(d("span","label","Timecode"),b,d("span","label","(60fps)"));const T=d("div","group"),x=d("span","lcd small","0");T.append(d("span","label","F"),x);const L=d("button","on","⏸");L.title="play / stop",L.addEventListener("click",()=>e.onPlayToggle());const M=d("button","rec-btn","●");M.title="record",M.addEventListener("click",()=>e.onRecordToggle());const F=d("div","group"),I=d("span","lcd small","—");F.append(d("span","label","FX"),I);const Et=d("div","group"),_t=d("span","lcd small","60.0");Et.append(d("span","label","FPS"),_t);const Tt=d("div","group"),Re=d("span","lcd small","120");Re.style.cursor="pointer",Re.addEventListener("click",()=>e.onTempoTap()),Tt.append(d("span","label","Tempo"),Re,d("span","label","BPM"));const oe=d("button","hands-btn","✋");oe.title="hand tracking",oe.addEventListener("click",()=>e.onHandsToggle());const qe=d("button",void 0,"⇄");qe.title="switch camera",qe.addEventListener("click",()=>e.onCameraFlip());const Ye=d("button",void 0,"📷");return Ye.title="snapshot",Ye.addEventListener("click",()=>e.onSnapshot()),g.append(_,T,L,M,F,d("div","push"),Et,Tt,oe,qe,Ye),t.append(n,r,f,g),{canvas:a,stage:r,hideStartOverlay(){c.classList.add("hidden")},showStartError(R){u.textContent="CAMERA ERROR",m.textContent=R,s.style.background="#ff5f57"},setFxLabel(R){I.textContent=R},setTransport(R,je,Tn,xn,xt){b.textContent=R,x.textContent=String(je).padStart(6,"0"),_t.textContent=Tn.toFixed(1),Re.textContent=String(xn),L.textContent=xt?"⏸":"▶",L.classList.toggle("on",xt)},setTimelineProgress(R){h.style.width=`${(R*100).toFixed(2)}%`},setRecording(R){M.classList.toggle("recording",R),b.classList.toggle("rec",R)},setHands(R,je){oe.classList.toggle("loading",R==="loading"),oe.classList.toggle("on",R==="on"),oe.classList.toggle("detect",R==="on"&&je)}}}const Cn=6,yt=2;let O,Ne=0,it=0,Le=new Float64Array(0),Ce=new Float64Array(0),Ae=new Float64Array(0),Ue=new Float64Array(0),Se=new Float64Array(0);function An(t){const{width:e,height:n,data:o}=t;if(e!==Ne||n!==it){Ne=e,it=n;const r=(e+1)*(n+1);Le=new Float64Array(r),Ce=new Float64Array(r),Ae=new Float64Array(r),Ue=new Float64Array(r),Se=new Float64Array(r)}const i=e+1;for(let r=0;r<n;r++){let l=0,a=0,c=0,s=0,u=0;for(let m=0;m<e;m++){const f=(r*e+m)*4,h=o[f],g=o[f+1],_=o[f+2],b=ue(h,g,_);l+=b,a+=b*b,c+=h,s+=g,u+=_;const T=(r+1)*i+(m+1),x=r*i+(m+1);Le[T]=Le[x]+l,Ce[T]=Ce[x]+a,Ae[T]=Ae[x]+c,Ue[T]=Ue[x]+s,Se[T]=Se[x]+u}}}function de(t,e,n,o,i){const r=Ne+1;return t[(n+i)*r+(e+o)]-t[n*r+(e+o)]-t[(n+i)*r+e]+t[n*r+e]}function Un(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function fe(t,e,n,o,i,r,l,a,c){const s=n*o,u=de(Le,t,e,n,o)/s,m=de(Ce,t,e,n,o)/s-u*u;if(i<Cn&&n>yt&&o>yt&&m>r){const F=n>>1,I=o>>1;fe(t,e,F,I,i+1,r,l,a,c),fe(t+F,e,n-F,I,i+1,r,l,a,c),fe(t,e+I,F,o-I,i+1,r,l,a,c),fe(t+F,e+I,n-F,o-I,i+1,r,l,a,c);return}const h=de(Ae,t,e,n,o)/s,g=de(Ue,t,e,n,o)/s,_=de(Se,t,e,n,o)/s,b=Un(t,e,Math.floor(c*2))<.025;O.fillStyle=b?"#2ea44f":`rgb(${Math.round(h)},${Math.round(g)},${Math.round(_)})`;const T=t*l,x=e*a,L=n*l,M=o*a;O.fillRect(T,x,L,M),O.strokeRect(T+.5,x+.5,L-1,M-1)}const Sn={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){O=e},render(t){const{width:e,height:n}=O.canvas,{width:o,height:i}=t.sample;An(t.sample);const r=380+300*Math.sin(t.beat*Math.PI/2);O.fillStyle="#000",O.fillRect(0,0,e,n),O.strokeStyle="#000",O.lineWidth=1,fe(0,0,o,i,0,r,e/o,n/i,t.beat)},dispose(){Ne=0,it=0}},Pn=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function Rt(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${i}`)}return o}function N(t,e,n=Pn){const o=Rt(t,t.VERTEX_SHADER,n),i=Rt(t,t.FRAGMENT_SHADER,e),r=t.createProgram();if(t.attachShader(r,o),t.attachShader(r,i),t.linkProgram(r),t.deleteShader(o),t.deleteShader(i),!t.getProgramParameter(r,t.LINK_STATUS)){const l=t.getProgramInfoLog(r);throw t.deleteProgram(r),new Error(`program link failed: ${l}`)}return r}function K(t){t.drawArrays(t.TRIANGLES,0,3)}function Mn(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const i=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:i,texture:o,width:e,height:n}}function Pt(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const Fn=`#version 300 es
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
`;let D=null,Q=null,Mt=null,Ft=null,It=null,Dt=null;function In(t){const e=D;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(Q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Mt,0),e.uniform2f(Ft,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(It,t.time),e.uniform1i(Dt,t.mirror?1:0),K(e)}let Pe,X=null,ze,me=new Float32Array(0),Me=null;function Dn(t){const{width:e,height:n,data:o}=t.sample;X||(X=document.createElement("canvas"),ze=X.getContext("2d")),(X.width!==e||X.height!==n)&&(X.width=e,X.height=n,me=new Float32Array(e*n),Me=ze.createImageData(e,n));for(let a=0,c=0;a<e*n;a++,c+=4)me[a]=ue(o[c],o[c+1],o[c+2])/255;const i=Me.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){let s=0;c>0&&c<e-1&&a>0&&a<n-1&&(s=me[(a-1)*e+(c-1)]-me[(a+1)*e+(c+1)]);const u=(a*e+c)*4;i[u]=Math.min(255,Math.max(0,248-s*2.3*255)),i[u+1]=Math.min(255,Math.max(0,247-s*1.6*255)),i[u+2]=Math.min(255,Math.max(0,242-s*2.9*255)),i[u+3]=255}ze.putImageData(Me,0,0);const{width:r,height:l}=Pe.canvas;Pe.imageSmoothingEnabled=!0,Pe.drawImage(X,0,0,r,l)}const $n={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){D=t,Pe=e,D&&!Q&&(Q=N(D,Fn),Mt=D.getUniformLocation(Q,"u_video"),Ft=D.getUniformLocation(Q,"u_texel"),It=D.getUniformLocation(Q,"u_time"),Dt=D.getUniformLocation(Q,"u_mirror"))},render(t){D&&t.videoTex?In(t):Dn(t)},dispose(){me=new Float32Array(0),Me=null}},Bn=`#version 300 es
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
`;let S=null,q=null,$t=null,Bt=null,Gt=null,Ot=null,Nt=null;function Gn(t){const e=S,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(q),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i($t,0),e.uniform2f(Bt,n,o),e.uniform1f(Gt,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(Ot,t.time),e.uniform1i(Nt,t.mirror?1:0),K(e)}const On=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),Nn=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let he,H=null,Ke,ve=new Float32Array(0),Fe=null;function Xn(t){const{width:e,height:n,data:o}=t.sample;H||(H=document.createElement("canvas"),Ke=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,ve=new Float32Array(e*n),Fe=Ke.createImageData(e,n));for(let c=0,s=0;c<e*n;c++,s+=4)ve[c]=ue(o[s],o[s+1],o[s+2])/255;const i=t.time,r=Fe.data;for(let c=0;c<n;c++){const s=c/n,u=Math.sin(s*58+i*2.4)*.55+Math.sin(s*21-i*1.6)*.45,m=On[c&3];for(let f=0;f<e;f++){const h=ve[c*e+f];let g=0;for(let x=0;x<4;x++){const L=Math.round(u*(.006+x*.014)*(.35+h)*e),M=Math.min(e-1,Math.max(0,f+L));g=Math.max(g,ve[c*e+M]*Math.pow(.7,x))}const _=g+(m[f&3]-.5)*.28,b=Nn[_>.72?0:_>.45?1:_>.24?2:3],T=(c*e+f)*4;r[T]=b[0],r[T+1]=b[1],r[T+2]=b[2],r[T+3]=255}}Ke.putImageData(Fe,0,0);const{width:l,height:a}=he.canvas;he.imageSmoothingEnabled=!1,he.drawImage(H,0,0,l,a),he.imageSmoothingEnabled=!0}const Hn={id:"wave",name:"WAVE",usesGl:!0,init(t,e){S=t,he=e,S&&!q&&(q=N(S,Bn),$t=S.getUniformLocation(q,"u_video"),Bt=S.getUniformLocation(q,"u_res"),Gt=S.getUniformLocation(q,"u_cell"),Ot=S.getUniformLocation(q,"u_time"),Nt=S.getUniformLocation(q,"u_mirror"))},render(t){S&&t.videoTex?Gn(t):Xn(t)},dispose(){ve=new Float32Array(0),Fe=null}},kn=`#version 300 es
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
`;let Y=null,ie=null,Xt=null,Ht=null,kt=null;function Wn(t){const e=Y;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(ie),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Xt,0),e.uniform1f(Ht,t.time),e.uniform1i(kt,t.mirror?1:0),K(e)}const Vn=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let pe,k=null,Ze,Ie=null;function qn(t){const{width:e,height:n,data:o}=t.sample;k||(k=document.createElement("canvas"),Ze=k.getContext("2d")),(k.width!==e||k.height!==n)&&(k.width=e,k.height=n,Ie=Ze.createImageData(e,n));const i=Ie.data;for(let a=0;a<n;a++)for(let c=0;c<e;c++){const s=(a*e+c)*4,u=(Math.random()-.5)*.16,m=ue(o[s],o[s+1],o[s+2])/255+u,f=Vn[m<.3?0:m<.52?1:m<.72?2:3];i[s]=f[0],i[s+1]=f[1],i[s+2]=f[2],i[s+3]=255}Ze.putImageData(Ie,0,0);const{width:r,height:l}=pe.canvas;pe.imageSmoothingEnabled=!1,pe.drawImage(k,0,0,r,l),pe.imageSmoothingEnabled=!0}const Yn={id:"riso",name:"RISO",usesGl:!0,init(t,e){Y=t,pe=e,Y&&!ie&&(ie=N(Y,kn),Xt=Y.getUniformLocation(ie,"u_video"),Ht=Y.getUniformLocation(ie,"u_time"),kt=Y.getUniformLocation(ie,"u_mirror"))},render(t){Y&&t.videoTex?Wn(t):qn(t)},dispose(){Ie=null}},jn=`#version 300 es
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
`,zn=`#version 300 es
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
`,Qe=200,le={wave:1,trail:.14},Je=[1,2,3.5,.4],Kn=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,Zn=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let w=null,$=null,at=null,Wt=null,Vt=null,qt=null,Yt=null,jt=null,zt=null,Kt=null,lt=null,Zt=null,A=null,Ee=!0;function Qn(t){const e=w,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!A||A.width!==n||A.height!==o)&&(A&&Pt(e,A),A=Mn(e,n,o),Ee=!0),e.bindFramebuffer(e.FRAMEBUFFER,A.framebuffer),e.viewport(0,0,n,o),Ee&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),Ee=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(at),e.uniform1f(Kt,le.trail),K(e);const i=Math.max(2,Math.round(Qe*t.video.videoHeight/t.video.videoWidth));e.useProgram($),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Wt,0),e.uniform2f(Vt,Qe,i),e.uniform2f(qt,n,o),e.uniform1f(Yt,t.time),e.uniform1f(jt,le.wave),e.uniform1i(zt,t.mirror?1:0),e.drawArrays(e.POINTS,0,Qe*i),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(lt),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,A.texture),e.uniform1i(Zt,0),K(e)}const bt=2;let ct,B=null,Z,_e=!0;function Jn(t){const{width:e,height:n}=ct.canvas,{width:o,height:i,data:r}=t.sample;B||(B=document.createElement("canvas"),Z=B.getContext("2d")),(B.width!==e||B.height!==n)&&(B.width=e,B.height=n,_e=!0),_e?(Z.fillStyle="#000",Z.fillRect(0,0,e,n),_e=!1):(Z.fillStyle=`rgba(0,0,0,${le.trail})`,Z.fillRect(0,0,e,n));const l=e/o,a=n/i,c=t.time,s=le.wave;for(let u=0;u<i;u+=bt)for(let m=0;m<o;m+=bt){const f=(u*o+m)*4,h=ue(r[f],r[f+1],r[f+2])/255;if(h<.04)continue;const g=Math.sin(c*2+m*.35+u*.18)*(1+h*5)*l*.6*s,_=Math.cos(c*1.6+u*.28+m*.11)*(1+h*3)*a*.4*s,b=Math.round(24+h*60),T=Math.round(90+h*150),x=Math.round(200+h*55),L=(.6+h*2.6)*l*.5;Z.fillStyle=`rgba(${b},${T},${x},${.2+h*.8})`,Z.fillRect(m*l+g,u*a+_,L,L)}ct.drawImage(B,0,0)}const eo={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){w=t,ct=e,_e=!0,Ee=!0,w&&!$&&($=N(w,zn,jn),Wt=w.getUniformLocation($,"u_video"),Vt=w.getUniformLocation($,"u_grid"),qt=w.getUniformLocation($,"u_res"),Yt=w.getUniformLocation($,"u_time"),jt=w.getUniformLocation($,"u_wave"),zt=w.getUniformLocation($,"u_mirror"),at=N(w,Kn),Kt=w.getUniformLocation(at,"u_alpha"),lt=N(w,Zn),Zt=w.getUniformLocation(lt,"u_tex"))},render(t){w&&t.videoTex?Qn(t):Jn(t)},dispose(){w&&A&&Pt(w,A),A=null,B=null,_e=!0,Ee=!0},onReselect(){const t=Je.indexOf(le.wave);le.wave=Je[(t+1)%Je.length]}},to=`#version 300 es
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
`;let Xe=!1,C=null,G=null,Qt=null,Jt=null,en=null,tn=null,nn=null,on=null;function no(t){const e=C,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(G),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Qt,0),e.uniform2f(Jt,n,o),e.uniform1f(en,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(tn,t.time),e.uniform1i(nn,t.mirror?1:0),e.uniform1i(on,Xe?1:0),K(e)}const oo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),ro={r:238,g:244,b:250},io={r:22,g:72,b:158},ao=.12;let ge,W=null,et,De=null;function lo(t){const{width:e,height:n,data:o}=t.sample;W||(W=document.createElement("canvas"),et=W.getContext("2d")),(W.width!==e||W.height!==n)&&(W.width=e,W.height=n,De=et.createImageData(e,n));const i=De.data;for(let a=0;a<n;a++){const c=oo[a&3];for(let s=0;s<e;s++){const u=(a*e+s)*4;let f=ue(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*ao>c[s&3];Xe&&(f=!f);const h=f?ro:io;i[u]=h.r,i[u+1]=h.g,i[u+2]=h.b,i[u+3]=255}}et.putImageData(De,0,0);const{width:r,height:l}=ge.canvas;ge.imageSmoothingEnabled=!1,ge.drawImage(W,0,0,r,l),ge.imageSmoothingEnabled=!0}const co={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){C=t,ge=e,C&&!G&&(G=N(C,to),Qt=C.getUniformLocation(G,"u_video"),Jt=C.getUniformLocation(G,"u_res"),en=C.getUniformLocation(G,"u_cell"),tn=C.getUniformLocation(G,"u_time"),nn=C.getUniformLocation(G,"u_mirror"),on=C.getUniformLocation(G,"u_invert"))},render(t){C&&t.videoTex?no(t):lo(t)},dispose(){De=null},onReselect(){Xe=!Xe}},so=`#version 300 es
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
`,Te=60,rn=480,an=270,uo=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let y=null,$e=null,j=null,ln=null,cn=null,sn=null,un=null,dn=null,fn=null,mn=null,z=null,xe=null,ae=-1,we=0;function fo(t){z=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,z),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,rn,an,Te),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),xe=t.createFramebuffer(),ae=-1,we=0}function mo(){y&&(z&&y.deleteTexture(z),xe&&y.deleteFramebuffer(xe),z=null,xe=null,ae=-1,we=0)}function ho(t){const e=y;ae=(ae+1)%Te,we=Math.min(we+1,Te),e.bindFramebuffer(e.FRAMEBUFFER,xe),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,z,0,ae),e.viewport(0,0,rn,an),e.useProgram($e),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(ln,0),K(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(j),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,z),e.uniform1i(cn,0),e.uniform1f(sn,ae),e.uniform1f(un,Te),e.uniform1f(dn,we),e.uniform1f(fn,t.beat),e.uniform1i(mn,t.mirror?1:0),K(e)}let Be,V=null,tt,Ge=null,J=[];function vo(t){const{width:e,height:n,data:o}=t.sample;V||(V=document.createElement("canvas"),tt=V.getContext("2d")),(V.width!==e||V.height!==n)&&(V.width=e,V.height=n,Ge=tt.createImageData(e,n),J=[]),J.push(new Uint8ClampedArray(o)),J.length>Te&&J.shift();const i=J.length-1,r=Ge.data;for(let c=0;c<n;c++){let s=c/Math.max(1,n-1)*i;s+=Math.sin((1-c/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(i,Math.max(0,s))),m=J[i-u],f=c*e*4;r.set(m.subarray(f,f+e*4),f)}tt.putImageData(Ge,0,0);const{width:l,height:a}=Be.canvas;Be.imageSmoothingEnabled=!0,Be.drawImage(V,0,0,l,a)}const po={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){y=t,Be=e,y&&($e||($e=N(y,uo),ln=y.getUniformLocation($e,"u_video"),j=N(y,so),cn=y.getUniformLocation(j,"u_history"),sn=y.getUniformLocation(j,"u_head"),un=y.getUniformLocation(j,"u_layers"),dn=y.getUniformLocation(j,"u_filled"),fn=y.getUniformLocation(j,"u_beat"),mn=y.getUniformLocation(j,"u_mirror")),fo(y))},render(t){y&&t.videoTex&&z?ho(t):vo(t)},dispose(){mo(),J=[],Ge=null}},st=[Sn,$n,Hn,Yn,eo,co,po];function ue(t,e,n){return .2126*t+.7152*e+.0722*n}function go(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,i=0;return{gl:e,videoTex:n,uploadVideo(r){const l=r.videoWidth,a=r.videoHeight;l===0||a===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),l!==o||a!==i?(o=l,i=a,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,r))},dispose(){e.deleteTexture(n)}}}const Eo="modulepreload",_o=function(t,e){return new URL(t,e).href},Lt={},To=function(e,n,o){let i=Promise.resolve();if(n&&n.length>0){let s=function(u){return Promise.all(u.map(m=>Promise.resolve(m).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const l=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");i=s(n.map(u=>{if(u=_o(u,o),u in Lt)return;Lt[u]=!0;const m=u.endsWith(".css"),f=m?'[rel="stylesheet"]':"";if(o)for(let g=l.length-1;g>=0;g--){const _=l[g];if(_.href===u&&(!m||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const h=document.createElement("link");if(h.rel=m?"stylesheet":Eo,m||(h.as="script"),h.crossOrigin="",h.href=u,c&&h.setAttribute("nonce",c),document.head.appendChild(h),m)return new Promise((g,_)=>{h.addEventListener("load",g),h.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return i.then(l=>{for(const a of l||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};let te="off",ce=null,ut=-1,dt=0,ht={hands:0,pinching:0,corners:null};function ft(){return te}function hn(){return ht}async function vn(){if(te==="off"){te="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await To(async()=>{const{FilesetResolver:r,HandLandmarker:l}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:r,HandLandmarker:l}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),i=r=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:r},runningMode:"VIDEO",numHands:2});try{ce=await e.createFromOptions(o,i("GPU"))}catch{ce=await e.createFromOptions(o,i("CPU"))}te="on"}catch(t){throw te="off",t}}}function xo(){ce?.close(),ce=null,te="off",ut=-1,dt=0,ht={hands:0,pinching:0,corners:null}}function wo(t,e){if(te!=="on"||!ce||t.currentTime===ut||e-dt<66)return;ut=t.currentTime,dt=e;const n=ce.detectForVideo(t,e),o=[],i=n.landmarks?.length??0;for(const r of n.landmarks??[]){const l=r[4],a=r[8],c=Math.hypot(r[0].x-r[9].x,r[0].y-r[9].y);Math.hypot(l.x-a.x,l.y-a.y)<Math.max(.025,c*.45)&&o.push({x:(l.x+a.x)/2,y:(l.y+a.y)/2})}ht={hands:i,pinching:o.length,corners:o.length>=2?[o[0],o[1]]:null}}const Ct=128,yo=2,nt=[90,100,110,120,128,140],be=.08,Ro=400;let v,p=null,P,He,pn,ke,ee=null,ot=!1,rt=!1;const We=document.createElement("canvas"),re=We.getContext("2d",{willReadFrequently:!0}),ne=new bn,Oe=new St,bo=new ImageData(2,2),U=[];let E=null,ye=0,At=0;const Ve=new Set;function se(){return st[ye%st.length]}function vt(t){Ve.has(t.id)||(t.init(ee?.gl??null,pn),Ve.add(t.id))}function pt(){const t=new Set;for(const e of U)t.add(e.effect.id);E&&t.add(E.effect.id);for(const e of[...Ve])t.has(e)||(st.find(n=>n.id===e)?.dispose(),Ve.delete(e))}function Lo(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}function Co(t){const e=t.map(l=>({x:p.mirror?1-l.x:l.x,y:l.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),i=Math.min(e[0].y,e[1].y),r=Math.max(e[0].y,e[1].y);return o-n<be&&(o=n+be),r-i<be&&(r=i+be),{x0:n,y0:i,x1:o,y1:r}}function Ao(t){const e=hn();if(e.corners&&p){At=t;const n=Co(e.corners);E?(E.rect.x0+=(n.x0-E.rect.x0)*.3,E.rect.y0+=(n.y0-E.rect.y0)*.3,E.rect.x1+=(n.x1-E.rect.x1)*.3,E.rect.y1+=(n.y1-E.rect.y1)*.3):(E={rect:n,effect:se()},ye++,vt(E.effect),v.setFxLabel(E.effect.name));return}E&&t-At>Ro&&(gn(E),E=null)}function gn(t){for(let e=U.length-1;e>=0;e--)Lo(t.rect,U[e].rect)&&U.splice(e,1);U.push(t),pt(),v.setFxLabel(`NEXT ${se().name}`)}function gt(){if(!p)return;const t=p.video.videoWidth||4,e=p.video.videoHeight||3,n=v.stage.getBoundingClientRect(),o=16,i=Math.max(64,n.width-o*2),r=Math.max(64,n.height-o*2),l=Math.min(i/t,r/e),a=Math.round(t*l),c=Math.round(e*l),s=Math.min(yo,window.devicePixelRatio||1);v.canvas.style.width=`${a}px`,v.canvas.style.height=`${c}px`;for(const u of[v.canvas,He,ke])u.width=Math.round(a*s),u.height=Math.round(c*s);We.width=Ct,We.height=Math.max(2,Math.round(Ct*e/t))}function Uo(){const{width:t,height:e}=We;return re.save(),p.mirror&&(re.translate(t,0),re.scale(-1,1)),re.drawImage(p.video,0,0,t,e),re.restore(),re.getImageData(0,0,t,e)}function So(){const{width:t,height:e}=v.canvas;P.save(),p.mirror&&(P.translate(t,0),P.scale(-1,1)),P.drawImage(p.video,0,0,t,e),P.restore()}function Ut(t,e,n){const{width:o,height:i}=v.canvas,r=t.rect.x0*o,l=t.rect.y0*i,a=(t.rect.x1-t.rect.x0)*o,c=(t.rect.y1-t.rect.y0)*i;P.drawImage(e,r,l,a,c,r,l,a,c),P.strokeStyle=n?"#e8a33d":"#ffffff",P.lineWidth=Math.max(2,o/640),P.strokeRect(r,l,a,c)}function Po(t){So();const e=U.map(a=>({f:a,isDrawing:!1}));if(E&&e.push({f:E,isDrawing:!0}),e.length===0)return;const n=e.some(({f:a})=>a.effect.usesGl&&ee),o=e.some(({f:a})=>!(a.effect.usesGl&&ee));n&&ee.uploadVideo(p.video);const i={videoTex:n?ee.videoTex:null,sample:o?Uo():bo,video:p.video,mirror:p.mirror,time:t.time,frame:t.frame,beat:t.beat};let r=null,l=null;for(const{f:a,isDrawing:c}of e)!!a.effect.usesGl&&!!ee?(l!==a.effect&&(a.effect.render(i),l=a.effect),Ut(a,ke,c)):(r!==a.effect&&(a.effect.render(i),r=a.effect),Ut(a,He,c))}function En(t){requestAnimationFrame(En);const e=ne.tick(t),n=p!==null&&p.video.readyState>=2;n&&(wo(p.video,t),Ao(t)),e.playing&&n&&Po(e),Oe.captureFrame(v.canvas),v.setHands(ft(),hn().hands>0),v.setTransport(ne.timecode(),e.frame,e.fps,e.bpm,e.playing),v.setTimelineProgress(e.beat%4/4)}function _n(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Mo(){if(!p||!St.supported())return;if(!Oe.recording){Oe.start(v.canvas),v.setRecording(!0);return}v.setRecording(!1);const t=await Oe.stop();t&&_n(t.blob,`null8_${ne.timecode().replaceAll(":","")}.${t.ext}`)}async function Fo(){if(ft()!=="loading"){if(ft()==="on"){xo();return}v.setHands("loading",!1);try{await vn()}catch(t){console.error("hand tracking init failed:",t)}}}async function Io(){if(!p||rt)return;rt=!0;const t=p.facing;try{p=await yn(p)}catch{p=await mt(t)}finally{rt=!1}gt()}function Do(){v.canvas.toBlob(t=>{t&&_n(t,`null8_${ne.timecode().replaceAll(":","")}.png`)},"image/png")}function $o(){U.length>0?(U.pop(),pt()):ye++,v.setFxLabel(`NEXT ${se().name}`)}async function Bo(){if(!(p||ot)){ot=!0;try{p=await mt("user"),v.hideStartOverlay(),gt(),requestAnimationFrame(En),vn().catch(t=>{console.warn("hand tracking unavailable:",t);const e=se();ye++,vt(e),U.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),v.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);v.showStartError(e),ot=!1}}}function Go(){const t=document.getElementById("app");v=Ln(t,{onStart:()=>{Bo()},onCanvasTap:$o,onPlayToggle:()=>ne.toggle(),onSnapshot:Do,onTempoTap:()=>{const e=nt.indexOf(ne.bpm);ne.bpm=nt[(e+1)%nt.length]},onRecordToggle:()=>{Mo()},onCameraFlip:()=>{Io()},onHandsToggle:()=>{Fo()}}),P=v.canvas.getContext("2d"),He=document.createElement("canvas"),pn=He.getContext("2d"),ke=document.createElement("canvas"),ee=go(ke),v.setFxLabel(`NEXT ${se().name}`),new ResizeObserver(()=>gt()).observe(v.stage),window.__null8={addFrame(e){const n=se();ye++,vt(n),gn({rect:e,effect:n})},clearFrames(){U.length=0,pt()},get frames(){return U.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Go();
