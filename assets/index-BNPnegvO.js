(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();async function Ht(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function go(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function Eo(t){const e=t.facing==="user"?"environment":"user";return go(t),Ht(e)}const xo=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class En{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=xo.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(a=>{e.onstop=()=>a()});e.stop(),await n;for(const a of this.stream?.getTracks()??[])a.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",r=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:r}}}const an=60;class _o{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,r=Math.floor(e)%60,a=Math.floor(e*an)%an,s=i=>String(i).padStart(2,"0");return`${s(n)}:${s(o)}:${s(r)}:${s(a)}`}}const To={en:{start:"TAP TO START",sub:`webcam access required
HTTPS or localhost only`,camError:"CAMERA ERROR",pause:"PAUSE",play:"PLAY",photo:"PHOTO CAPTURE",recStart:"RECORD START",recStop:"RECORD STOP",rec:"REC",frame:"F",fps:"FPS",tempo:"Tempo",bpm:"BPM",fx:"FX",next:"NEXT"},ko:{start:"탭하여 시작",sub:`웹캠 권한이 필요합니다
HTTPS 또는 localhost 전용`,camError:"카메라 오류",pause:"일시정지",play:"재생",photo:"사진 캡쳐",recStart:"녹화 시작",recStop:"녹화 정지",rec:"녹화",frame:"F",fps:"FPS",tempo:"템포",bpm:"BPM",fx:"FX",next:"다음"}},xn="null8-lang";function wo(){const t=localStorage.getItem(xn);return t==="en"||t==="ko"?t:navigator.language?.startsWith("ko")?"ko":"en"}function v(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function yo(t,e){let n=wo();const o=()=>To[n];let r=!1,a=!1,s=!1,i=!0,l={name:"—",next:!1};const c=v("header","titlebar"),u=v("div","traffic");for(const h of["r","y","g"])u.appendChild(v("span",h));const f=v("div","path","/project1/null8 (128,128)"),d=v("button","lang-btn");d.title="language",d.addEventListener("click",()=>{n=n==="en"?"ko":"en",localStorage.setItem(xn,n),on()});const m=v("a","coffee-btn","☕︎");m.href="https://buymeacoffee.com/yuemyname",m.target="_blank",m.rel="noopener",m.title="buy me a coffee",c.append(u,f,m,d);const _=v("div","viewport"),T=v("canvas");_.appendChild(T),_.addEventListener("click",()=>e.onCanvasTap());const R=v("div","start-overlay"),S=v("div","pulse"),w=v("div","big"),P=v("div","sub");R.append(S,w,P),R.addEventListener("click",h=>{h.stopPropagation(),e.onStart()}),_.appendChild(R);const U=v("footer","transport"),F=v("div","group"),x=v("span","label"),y=v("span","lcd small","—");F.append(x,y);const I=v("button","on");I.addEventListener("click",()=>e.onPlayToggle());const D=v("button");D.addEventListener("click",()=>e.onSnapshot());const ae=v("button","rec-btn");ae.addEventListener("click",()=>e.onRecordToggle());const He=v("div","group"),qt=v("span","label"),Xe=v("span","lcd small","00:00");He.append(qt,Xe),He.style.display="none";const jt=v("div","group"),zt=v("span","label"),Kt=v("span","lcd small","0");jt.append(zt,Kt);const Zt=v("div","group"),Jt=v("span","label"),Qt=v("span","lcd small","60.0");Zt.append(Jt,Qt);const en=v("div","group"),tn=v("span","label"),Ve=v("span","lcd small","120"),nn=v("span","label");Ve.style.cursor="pointer",Ve.addEventListener("click",()=>e.onTempoTap()),en.append(tn,Ve,nn);const he=v("button","hands-btn","✋︎");he.title="hand tracking",he.addEventListener("click",()=>e.onHandsToggle());const Et=v("button",void 0,"⇄");Et.title="switch camera",Et.addEventListener("click",()=>e.onCameraFlip()),U.append(F,I,D,ae,He,v("div","push"),jt,Zt,en,he,Et);const xt=v("div","device");xt.append(c,_,U),t.append(xt);function on(){const h=o();d.textContent=n==="en"?"한":"EN",r||(w.textContent=a?h.camError:h.start,a||(P.textContent=h.sub)),I.textContent=i?h.pause:h.play,D.textContent=h.photo,ae.textContent=s?h.recStop:h.recStart,qt.textContent=h.rec,zt.textContent=h.frame,Jt.textContent=h.fps,tn.textContent=h.tempo,nn.textContent=h.bpm,x.textContent=h.fx,y.textContent=l.next?`${h.next} ${l.name}`:l.name}return on(),{canvas:T,chromeHeight(){return c.offsetHeight+U.offsetHeight},setDeviceWidth(h){xt.style.width=`${h+4}px`},hideStartOverlay(){r=!0,R.classList.add("hidden")},showStartError(h){a=!0,w.textContent=o().camError,P.textContent=h,S.style.animationDuration="0.4s"},setFxLabel(h,z=!1){l={name:h,next:z},y.textContent=z?`${o().next} ${h}`:h},setTransport(h,z,_t,rn){Kt.textContent=String(h).padStart(6,"0"),Qt.textContent=z.toFixed(1),Ve.textContent=String(_t),i!==rn&&(i=rn,I.textContent=i?o().pause:o().play,I.classList.toggle("on",i))},setRecording(h){s=h,ae.textContent=h?o().recStop:o().recStart,ae.classList.toggle("recording",h),Xe.classList.toggle("rec",h),He.style.display=h?"flex":"none",h||(Xe.textContent="00:00")},setRecordTime(h){const z=Math.floor(h/60),_t=Math.floor(h)%60;Xe.textContent=`${String(z).padStart(2,"0")}:${String(_t).padStart(2,"0")}`},setHands(h,z){he.classList.toggle("loading",h==="loading"),he.classList.toggle("on",h==="on"),he.classList.toggle("detect",h==="on"&&z)}}}const bo=6,sn=2;let V,lt=0,Ft=0,je=new Float64Array(0),ze=new Float64Array(0),Ke=new Float64Array(0),Ze=new Float64Array(0),Je=new Float64Array(0);function Ro(t){const{width:e,height:n,data:o}=t;if(e!==lt||n!==Ft){lt=e,Ft=n;const a=(e+1)*(n+1);je=new Float64Array(a),ze=new Float64Array(a),Ke=new Float64Array(a),Ze=new Float64Array(a),Je=new Float64Array(a)}const r=e+1;for(let a=0;a<n;a++){let s=0,i=0,l=0,c=0,u=0;for(let f=0;f<e;f++){const d=(a*e+f)*4,m=o[d],_=o[d+1],T=o[d+2],R=ye(m,_,T);s+=R,i+=R*R,l+=m,c+=_,u+=T;const S=(a+1)*r+(f+1),w=a*r+(f+1);je[S]=je[w]+s,ze[S]=ze[w]+i,Ke[S]=Ke[w]+l,Ze[S]=Ze[w]+c,Je[S]=Je[w]+u}}}function Re(t,e,n,o,r){const a=lt+1;return t[(n+r)*a+(e+o)]-t[n*a+(e+o)]-t[(n+r)*a+e]+t[n*a+e]}function So(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function Le(t,e,n,o,r,a,s,i,l){const c=n*o,u=Re(je,t,e,n,o)/c,f=Re(ze,t,e,n,o)/c-u*u;if(r<bo&&n>sn&&o>sn&&f>a){const F=n>>1,x=o>>1;Le(t,e,F,x,r+1,a,s,i,l),Le(t+F,e,n-F,x,r+1,a,s,i,l),Le(t,e+x,F,o-x,r+1,a,s,i,l),Le(t+F,e+x,n-F,o-x,r+1,a,s,i,l);return}const m=Re(Ke,t,e,n,o)/c,_=Re(Ze,t,e,n,o)/c,T=Re(Je,t,e,n,o)/c,R=So(t,e,Math.floor(l*2))<.025;V.fillStyle=R?"#2ea44f":`rgb(${Math.round(m)},${Math.round(_)},${Math.round(T)})`;const S=t*s,w=e*i,P=n*s,U=o*i;V.fillRect(S,w,P,U),V.strokeRect(S+.5,w+.5,P-1,U-1)}const Lo={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){V=e},render(t){const{width:e,height:n}=V.canvas,{width:o,height:r}=t.sample;Ro(t.sample);const a=380+300*Math.sin(t.beat*Math.PI/2);V.fillStyle="#000",V.fillRect(0,0,e,n),V.strokeStyle="#000",V.lineWidth=1,Le(0,0,o,r,0,a,e/o,n/r,t.beat)},dispose(){lt=0,Ft=0}},Co=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function ln(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const r=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${r}`)}return o}function q(t,e,n=Co){const o=ln(t,t.VERTEX_SHADER,n),r=ln(t,t.FRAGMENT_SHADER,e),a=t.createProgram();if(t.attachShader(a,o),t.attachShader(a,r),t.linkProgram(a),t.deleteShader(o),t.deleteShader(r),!t.getProgramParameter(a,t.LINK_STATUS)){const s=t.getProgramInfoLog(a);throw t.deleteProgram(a),new Error(`program link failed: ${s}`)}return a}function ie(t){t.drawArrays(t.TRIANGLES,0,3)}function Po(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:r,texture:o,width:e,height:n}}function _n(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const Ao=`#version 300 es
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
`;let W=null,le=null,Tn=null,wn=null,yn=null,bn=null;function Mo(t){const e=W;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(le),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Tn,0),e.uniform2f(wn,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(yn,t.time),e.uniform1i(bn,t.mirror?1:0),ie(e)}let Qe,K=null,Tt,Ce=new Float32Array(0),et=null;function Fo(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),Tt=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,Ce=new Float32Array(e*n),et=Tt.createImageData(e,n));for(let i=0,l=0;i<e*n;i++,l+=4)Ce[i]=ye(o[l],o[l+1],o[l+2])/255;const r=et.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){let c=0;l>0&&l<e-1&&i>0&&i<n-1&&(c=Ce[(i-1)*e+(l-1)]-Ce[(i+1)*e+(l+1)]);const u=(i*e+l)*4;r[u]=Math.min(255,Math.max(0,248-c*2.3*255)),r[u+1]=Math.min(255,Math.max(0,247-c*1.6*255)),r[u+2]=Math.min(255,Math.max(0,242-c*2.9*255)),r[u+3]=255}Tt.putImageData(et,0,0);const{width:a,height:s}=Qe.canvas;Qe.imageSmoothingEnabled=!0,Qe.drawImage(K,0,0,a,s)}const Io={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){W=t,Qe=e,W&&!le&&(le=q(W,Ao),Tn=W.getUniformLocation(le,"u_video"),wn=W.getUniformLocation(le,"u_texel"),yn=W.getUniformLocation(le,"u_time"),bn=W.getUniformLocation(le,"u_mirror"))},render(t){W&&t.videoTex?Mo(t):Fo(t)},dispose(){Ce=new Float32Array(0),et=null}},Uo=`#version 300 es
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
`;let B=null,te=null,Rn=null,Sn=null,Ln=null,Cn=null,Pn=null;function Do(t){const e=B,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(te),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Rn,0),e.uniform2f(Sn,n,o),e.uniform1f(Ln,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(Cn,t.time),e.uniform1i(Pn,t.mirror?1:0),ie(e)}const ko=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),$o=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Pe,Z=null,wt,Ae=new Float32Array(0),tt=null;function Oo(t){const{width:e,height:n,data:o}=t.sample;Z||(Z=document.createElement("canvas"),wt=Z.getContext("2d")),(Z.width!==e||Z.height!==n)&&(Z.width=e,Z.height=n,Ae=new Float32Array(e*n),tt=wt.createImageData(e,n));for(let l=0,c=0;l<e*n;l++,c+=4)Ae[l]=ye(o[c],o[c+1],o[c+2])/255;const r=t.time,a=tt.data;for(let l=0;l<n;l++){const c=l/n,u=Math.sin(c*58+r*2.4)*.55+Math.sin(c*21-r*1.6)*.45,f=ko[l&3];for(let d=0;d<e;d++){const m=Ae[l*e+d];let _=0;for(let w=0;w<4;w++){const P=Math.round(u*(.006+w*.014)*(.35+m)*e),U=Math.min(e-1,Math.max(0,d+P));_=Math.max(_,Ae[l*e+U]*Math.pow(.7,w))}const T=_+(f[d&3]-.5)*.28,R=$o[T>.72?0:T>.45?1:T>.24?2:3],S=(l*e+d)*4;a[S]=R[0],a[S+1]=R[1],a[S+2]=R[2],a[S+3]=255}}wt.putImageData(tt,0,0);const{width:s,height:i}=Pe.canvas;Pe.imageSmoothingEnabled=!1,Pe.drawImage(Z,0,0,s,i),Pe.imageSmoothingEnabled=!0}const Bo={id:"wave",name:"WAVE",usesGl:!0,init(t,e){B=t,Pe=e,B&&!te&&(te=q(B,Uo),Rn=B.getUniformLocation(te,"u_video"),Sn=B.getUniformLocation(te,"u_res"),Ln=B.getUniformLocation(te,"u_cell"),Cn=B.getUniformLocation(te,"u_time"),Pn=B.getUniformLocation(te,"u_mirror"))},render(t){B&&t.videoTex?Do(t):Oo(t)},dispose(){Ae=new Float32Array(0),tt=null}},No=`#version 300 es
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
`;let ne=null,pe=null,An=null,Mn=null,Fn=null;function Wo(t){const e=ne;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(pe),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(An,0),e.uniform1f(Mn,t.time),e.uniform1i(Fn,t.mirror?1:0),ie(e)}const Go=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Me,J=null,yt,nt=null;function Ho(t){const{width:e,height:n,data:o}=t.sample;J||(J=document.createElement("canvas"),yt=J.getContext("2d")),(J.width!==e||J.height!==n)&&(J.width=e,J.height=n,nt=yt.createImageData(e,n));const r=nt.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){const c=(i*e+l)*4,u=(Math.random()-.5)*.16,f=ye(o[c],o[c+1],o[c+2])/255+u,d=Go[f<.3?0:f<.52?1:f<.72?2:3];r[c]=d[0],r[c+1]=d[1],r[c+2]=d[2],r[c+3]=255}yt.putImageData(nt,0,0);const{width:a,height:s}=Me.canvas;Me.imageSmoothingEnabled=!1,Me.drawImage(J,0,0,a,s),Me.imageSmoothingEnabled=!0}const Xo={id:"riso",name:"RISO",usesGl:!0,init(t,e){ne=t,Me=e,ne&&!pe&&(pe=q(ne,No),An=ne.getUniformLocation(pe,"u_video"),Mn=ne.getUniformLocation(pe,"u_time"),Fn=ne.getUniformLocation(pe,"u_mirror"))},render(t){ne&&t.videoTex?Wo(t):Ho(t)},dispose(){nt=null}},Vo=`#version 300 es
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
`,Yo=`#version 300 es
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
`,bt=200,xe={wave:1,trail:.14},Rt=[1,2,3.5,.4],qo=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,jo=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let L=null,G=null,It=null,In=null,Un=null,Dn=null,kn=null,$n=null,On=null,Bn=null,Ut=null,Nn=null,$=null,De=!0;function zo(t){const e=L,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!$||$.width!==n||$.height!==o)&&($&&_n(e,$),$=Po(e,n,o),De=!0),e.bindFramebuffer(e.FRAMEBUFFER,$.framebuffer),e.viewport(0,0,n,o),De&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),De=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(It),e.uniform1f(Bn,xe.trail),ie(e);const r=Math.max(2,Math.round(bt*t.video.videoHeight/t.video.videoWidth));e.useProgram(G),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(In,0),e.uniform2f(Un,bt,r),e.uniform2f(Dn,n,o),e.uniform1f(kn,t.time),e.uniform1f($n,xe.wave),e.uniform1i(On,t.mirror?1:0),e.drawArrays(e.POINTS,0,bt*r),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(Ut),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,$.texture),e.uniform1i(Nn,0),ie(e)}const cn=2;let Dt,H=null,se,ke=!0;function Ko(t){const{width:e,height:n}=Dt.canvas,{width:o,height:r,data:a}=t.sample;H||(H=document.createElement("canvas"),se=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,ke=!0),ke?(se.fillStyle="#000",se.fillRect(0,0,e,n),ke=!1):(se.fillStyle=`rgba(0,0,0,${xe.trail})`,se.fillRect(0,0,e,n));const s=e/o,i=n/r,l=t.time,c=xe.wave;for(let u=0;u<r;u+=cn)for(let f=0;f<o;f+=cn){const d=(u*o+f)*4,m=ye(a[d],a[d+1],a[d+2])/255;if(m<.04)continue;const _=Math.sin(l*2+f*.35+u*.18)*(1+m*5)*s*.6*c,T=Math.cos(l*1.6+u*.28+f*.11)*(1+m*3)*i*.4*c,R=Math.round(24+m*60),S=Math.round(90+m*150),w=Math.round(200+m*55),P=(.6+m*2.6)*s*.5;se.fillStyle=`rgba(${R},${S},${w},${.2+m*.8})`,se.fillRect(f*s+_,u*i+T,P,P)}Dt.drawImage(H,0,0)}const Zo={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){L=t,Dt=e,ke=!0,De=!0,L&&!G&&(G=q(L,Yo,Vo),In=L.getUniformLocation(G,"u_video"),Un=L.getUniformLocation(G,"u_grid"),Dn=L.getUniformLocation(G,"u_res"),kn=L.getUniformLocation(G,"u_time"),$n=L.getUniformLocation(G,"u_wave"),On=L.getUniformLocation(G,"u_mirror"),It=q(L,qo),Bn=L.getUniformLocation(It,"u_alpha"),Ut=q(L,jo),Nn=L.getUniformLocation(Ut,"u_tex"))},render(t){L&&t.videoTex?zo(t):Ko(t)},dispose(){L&&$&&_n(L,$),$=null,H=null,ke=!0,De=!0},onReselect(){const t=Rt.indexOf(xe.wave);xe.wave=Rt[(t+1)%Rt.length]}},Jo=`#version 300 es
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
`;let ct=!1,k=null,X=null,Wn=null,Gn=null,Hn=null,Xn=null,Vn=null,Yn=null;function Qo(t){const e=k,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(X),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Wn,0),e.uniform2f(Gn,n,o),e.uniform1f(Hn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(Xn,t.time),e.uniform1i(Vn,t.mirror?1:0),e.uniform1i(Yn,ct?1:0),ie(e)}const er=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),tr={r:238,g:244,b:250},nr={r:22,g:72,b:158},or=.12;let Fe,Q=null,St,ot=null;function rr(t){const{width:e,height:n,data:o}=t.sample;Q||(Q=document.createElement("canvas"),St=Q.getContext("2d")),(Q.width!==e||Q.height!==n)&&(Q.width=e,Q.height=n,ot=St.createImageData(e,n));const r=ot.data;for(let i=0;i<n;i++){const l=er[i&3];for(let c=0;c<e;c++){const u=(i*e+c)*4;let d=ye(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*or>l[c&3];ct&&(d=!d);const m=d?tr:nr;r[u]=m.r,r[u+1]=m.g,r[u+2]=m.b,r[u+3]=255}}St.putImageData(ot,0,0);const{width:a,height:s}=Fe.canvas;Fe.imageSmoothingEnabled=!1,Fe.drawImage(Q,0,0,a,s),Fe.imageSmoothingEnabled=!0}const ir={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){k=t,Fe=e,k&&!X&&(X=q(k,Jo),Wn=k.getUniformLocation(X,"u_video"),Gn=k.getUniformLocation(X,"u_res"),Hn=k.getUniformLocation(X,"u_cell"),Xn=k.getUniformLocation(X,"u_time"),Vn=k.getUniformLocation(X,"u_mirror"),Yn=k.getUniformLocation(X,"u_invert"))},render(t){k&&t.videoTex?Qo(t):rr(t)},dispose(){ot=null},onReselect(){ct=!ct}},ar=`#version 300 es
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
`,$e=60,qn=480,jn=270,sr=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let C=null,rt=null,oe=null,zn=null,Kn=null,Zn=null,Jn=null,Qn=null,eo=null,to=null,re=null,Oe=null,ge=-1,Be=0;function lr(t){re=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,re),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,qn,jn,$e),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Oe=t.createFramebuffer(),ge=-1,Be=0}function cr(){C&&(re&&C.deleteTexture(re),Oe&&C.deleteFramebuffer(Oe),re=null,Oe=null,ge=-1,Be=0)}function ur(t){const e=C;ge=(ge+1)%$e,Be=Math.min(Be+1,$e),e.bindFramebuffer(e.FRAMEBUFFER,Oe),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,re,0,ge),e.viewport(0,0,qn,jn),e.useProgram(rt),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(zn,0),ie(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(oe),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,re),e.uniform1i(Kn,0),e.uniform1f(Zn,ge),e.uniform1f(Jn,$e),e.uniform1f(Qn,Be),e.uniform1f(eo,t.beat),e.uniform1i(to,t.mirror?1:0),ie(e)}let it,ee=null,Lt,at=null,ce=[];function fr(t){const{width:e,height:n,data:o}=t.sample;ee||(ee=document.createElement("canvas"),Lt=ee.getContext("2d")),(ee.width!==e||ee.height!==n)&&(ee.width=e,ee.height=n,at=Lt.createImageData(e,n),ce=[]),ce.push(new Uint8ClampedArray(o)),ce.length>$e&&ce.shift();const r=ce.length-1,a=at.data;for(let l=0;l<n;l++){let c=l/Math.max(1,n-1)*r;c+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(r,Math.max(0,c))),f=ce[r-u],d=l*e*4;a.set(f.subarray(d,d+e*4),d)}Lt.putImageData(at,0,0);const{width:s,height:i}=it.canvas;it.imageSmoothingEnabled=!0,it.drawImage(ee,0,0,s,i)}const dr={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){C=t,it=e,C&&(rt||(rt=q(C,sr),zn=C.getUniformLocation(rt,"u_video"),oe=q(C,ar),Kn=C.getUniformLocation(oe,"u_history"),Zn=C.getUniformLocation(oe,"u_head"),Jn=C.getUniformLocation(oe,"u_layers"),Qn=C.getUniformLocation(oe,"u_filled"),eo=C.getUniformLocation(oe,"u_beat"),to=C.getUniformLocation(oe,"u_mirror")),lr(C))},render(t){C&&t.videoTex&&re?ur(t):fr(t)},dispose(){cr(),ce=[],at=null}},kt=[Lo,Io,Bo,Xo,Zo,ir,dr];function ye(t,e,n){return .2126*t+.7152*e+.0722*n}function mr(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,r=0;return{gl:e,videoTex:n,uploadVideo(a){const s=a.videoWidth,i=a.videoHeight;s===0||i===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||i!==r?(o=s,r=i,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,a)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,a))},dispose(){e.deleteTexture(n)}}}const hr="modulepreload",vr=function(t,e){return new URL(t,e).href},un={},pr=function(e,n,o){let r=Promise.resolve();if(n&&n.length>0){let c=function(u){return Promise.all(u.map(f=>Promise.resolve(f).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");r=c(n.map(u=>{if(u=vr(u,o),u in un)return;un[u]=!0;const f=u.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(o)for(let _=s.length-1;_>=0;_--){const T=s[_];if(T.href===u&&(!f||T.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${d}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":hr,f||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),f)return new Promise((_,T)=>{m.addEventListener("load",_),m.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})};let fe="off",_e=null,$t=-1,Ot=0,ut={hands:0,pinching:0,points:[],corners:null};const fn=.4,gr=.6,dn=2,Ie=new Map,Er=1100,xr=3,mn=.05,_r=1500,Ue=new Map;let ft=!1,hn=0;function Tr(){const t=ft;return ft=!1,t}function Bt(){return fe}function Ge(){return ut}async function no(){if(fe==="off"){fe="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await pr(async()=>{const{FilesetResolver:a,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:a,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),r=a=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:a},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{_e=await e.createFromOptions(o,r("GPU"))}catch{_e=await e.createFromOptions(o,r("CPU"))}fe="on"}catch(t){throw fe="off",t}}}function wr(){_e?.close(),_e=null,fe="off",$t=-1,Ot=0,Ie.clear(),Ue.clear(),ft=!1,ut={hands:0,pinching:0,points:[],corners:null}}function yr(t,e){if(fe!=="on"||!_e||t.currentTime===$t)return;const n=ut.hands>0?33:100;if(e-Ot<n)return;$t=t.currentTime,Ot=e;const o=_e.detectForVideo(t,e),r=[],a=o.landmarks?.length??0,s=t.videoWidth||1280,i=t.videoHeight||720,l=(f,d)=>Math.hypot((f.x-d.x)*s,(f.y-d.y)*i),c=new Set;for(let f=0;f<a;f++){const d=o.landmarks[f];let m=o.handednesses?.[f]?.[0]?.categoryName??`hand${f}`;c.has(m)&&(m=`${m}${f}`),c.add(m);const _=d[4],T=d[8],R=l(d[5],d[17]),w=l(_,T)/Math.max(R,1e-6);let P=0;for(const[I,D]of[[8,6],[12,10],[16,14],[20,18]])l(d[0],d[I])>l(d[0],d[D])*1.15&&P++;const U=P>=3,F=P<=1;let x=Ie.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Ie.set(m,x)),F?(x.down=!1,x.onFrames=0,x.offFrames=0):w<fn?(x.onFrames++,x.offFrames=0,x.onFrames>=dn&&(x.down=!0)):w>gr?(x.offFrames++,x.onFrames=0,x.offFrames>=dn&&(x.down=!1)):(x.onFrames=0,x.offFrames=0);let y=Ue.get(m);if(y||(y={dir:0,extreme:d[9].x*s,reversals:[]},Ue.set(m,y)),U&&!x.down){const I=d[9].x*s,D=I-y.extreme;y.dir===0?Math.abs(D)>mn*s&&(y.dir=Math.sign(D),y.extreme=I):Math.sign(D)===y.dir?y.extreme=I:Math.abs(D)>mn*s&&(y.dir=Math.sign(D),y.extreme=I,y.reversals.push(e),y.reversals=y.reversals.filter(ae=>e-ae<Er),y.reversals.length>=xr&&e>hn&&(ft=!0,hn=e+_r,y.reversals=[]))}else y.dir=0,y.extreme=d[9].x*s,y.reversals=[];r.push({handedness:m,thumb:{x:_.x,y:_.y},index:{x:T.x,y:T.y},threshold:fn*R/s,ratio:w,pinching:x.down,open:U,fist:F,x:(_.x+T.x)/2,y:(_.y+T.y)/2})}for(const f of[...Ie.keys()])c.has(f)||Ie.delete(f);for(const f of[...Ue.keys()])c.has(f)||Ue.delete(f);const u=r.filter(f=>f.pinching);ut={hands:a,pinching:u.length,points:r,corners:u.length>=2?[u[0],u[1]]:null}}function oo(t,e,n,o){const r=Math.max(n/t,o/e),a=t*r,s=e*r;return{x:(n-a)/2,y:(o-s)/2,w:a,h:s}}function dt(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function ro(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const st={minDist:1.5,baseWidth:12,maxPoints:2e4,bufferMs:250},br=["#28c840","#ffffff","#141414","#1f6bff","#9cc3ff"];let Rr=br[0];const de=new Map,j=[];let Te=0,A=null,O=null,Y=null,N=null;const io=5;function ao(t){const e=parseInt(t.slice(1),16);return .2126*(e>>16&255)+.7152*(e>>8&255)+.0722*(e&255)<128?"rgba(255,255,255,0.85)":"rgba(18,18,18,0.7)"}function Sr(t,e){if(A||(A=document.createElement("canvas"),Y=document.createElement("canvas"),O=A.getContext("2d"),N=Y.getContext("2d")),A.width===t&&A.height===e)return;const n=A.width,o=A.height;if(n>0&&o>0){const r=t/n,a=e/o,s=(r+a)/2;for(const i of j)for(const l of i.pts)l.x*=r,l.y*=a,l.w*=s}A.width=t,A.height=e,Y.width=t,Y.height=e,Xt()}function Nt(t,e,n,o){const r=e.pts;t.strokeStyle=o?ao(e.color):e.color,t.lineCap="round",t.lineJoin="round";const a=o?io:0;if(n===1){t.lineWidth=r[1].w+a,t.beginPath(),t.moveTo(r[0].x,r[0].y),t.lineTo((r[0].x+r[1].x)/2,(r[0].y+r[1].y)/2),t.stroke();return}const s=r[n-2],i=r[n-1],l=r[n],c={x:(s.x+i.x)/2,y:(s.y+i.y)/2},u={x:(i.x+l.x)/2,y:(i.y+l.y)/2};t.lineWidth=i.w+a,t.beginPath(),t.moveTo(c.x,c.y),t.quadraticCurveTo(i.x,i.y,u.x,u.y),t.stroke()}function Wt(t,e,n){const o=e.pts[0];t.fillStyle=n?ao(e.color):e.color,t.beginPath(),t.arc(o.x,o.y,(o.w+(n?io:0))/2,0,Math.PI*2),t.fill()}function we(t,e,n){if(e.pts.length!==0){if(e.pts.length===1){Wt(t,e,n);return}for(let o=1;o<e.pts.length;o++)Nt(t,e,o,n)}}function Lr(t,e){N&&Nt(N,t,e,!0),O&&Nt(O,t,e,!1)}function Xt(){if(!(!A||!O||!Y||!N)){O.clearRect(0,0,A.width,A.height),N.clearRect(0,0,Y.width,Y.height);for(const t of j)we(N,t,!0),we(O,t,!1)}}function so(t){!t.stroke||!O||!N||(t.pendingSince=-1,we(N,t.stroke,!0),we(O,t.stroke,!1),t.inked=t.stroke.pts.length,j.push(t.stroke))}function Ct(t){t.stroke&&t.pendingSince>=0&&so(t),t.stroke&&t.stroke.pts.length===1&&O&&N&&(Wt(N,t.stroke,!0),Wt(O,t.stroke,!1)),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function lo(t){Te-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Cr(){let t=!1;for(;Te>st.maxPoints&&j.length>0;)Te-=j.shift().pts.length,t=!0;t&&Xt()}function Pr(t,e,n,o,r){const a=new Set;for(const s of t){a.add(s.handedness);let i=de.get(s.handedness);if(i||(i={drawing:!1,stroke:null,pendingSince:-1,inked:0},de.set(s.handedness,i)),o&&i.drawing){i.pendingSince>=0?lo(i):Ct(i);continue}if(i.drawing&&!s.pinching){Ct(i);continue}if(!i.drawing&&s.pinching&&!o&&(i.drawing=!0,i.stroke={color:Rr,pts:[]},i.pendingSince=r,i.inked=0),!i.drawing||!i.stroke)continue;const l=ro(dt(s.thumb,e,n),dt(s.index,e,n)),c=i.stroke.pts[i.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=st.minDist)&&(i.stroke.pts.push({x:l.x,y:l.y,w:st.baseWidth}),Te++),i.pendingSince>=0)r-i.pendingSince>st.bufferMs&&so(i);else if(O)for(;i.inked<i.stroke.pts.length;)i.inked++,i.inked>=2&&Lr(i.stroke,i.inked-1)}for(const[s,i]of de)!a.has(s)&&i.drawing&&Ct(i);Cr()}function Ar(t){A&&Y&&(j.length>0||co())&&(t.drawImage(Y,0,0),t.drawImage(A,0,0));for(const e of de.values())e.drawing&&e.pendingSince>=0&&e.stroke&&(we(t,e.stroke,!0),we(t,e.stroke,!1))}function co(){for(const t of de.values())if(t.drawing)return!0;return!1}function uo(t){return de.get(t)?.drawing??!1}function Mr(){return j.length>0||co()}function Fr(){for(const t of de.values())lo(t);j.length=0,Te=0,Xt()}function Ir(){return{strokes:j.length,points:Te}}const vn=128,Ur=2,Pt=[90,100,110,120,128,140],Ye=.08,Dr=400,kr=150;let p,E=null,g,mt,fo,ht,ue=null,At=!1,Mt=!1,Ne=null,Gt=0;const vt=document.createElement("canvas"),ve=vt.getContext("2d",{willReadFrequently:!0}),Ee=new _o,We=new En;let mo=0;const $r=new ImageData(2,2),M=[];let b=null,be=0,pn=0,Se=null;const pt=new Set;function me(){return kt[be%kt.length]}function Vt(t){pt.has(t.id)||(t.init(ue?.gl??null,fo),pt.add(t.id))}function gt(){const t=new Set;for(const e of M)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...pt])t.has(e)||(kt.find(n=>n.id===e)?.dispose(),pt.delete(e))}function Or(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const qe=.06;function Br(t){const e=t.map(s=>({x:E.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),r=Math.min(e[0].y,e[1].y),a=Math.max(e[0].y,e[1].y);return n<qe&&(n=0),r<qe&&(r=0),o>1-qe&&(o=1),a>1-qe&&(a=1),o-n<Ye&&(o=n+Ye),a-r<Ye&&(a=r+Ye),{x0:n,y0:r,x1:o,y1:a}}function Nr(t){const e=Ge();if(e.corners&&E){pn=t;const n=Br(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(Se===null&&(Se=t),t-Se<kr)return;Se=null,b={rect:n,effect:me()},be++,Vt(b.effect),p.setFxLabel(b.effect.name)}return}Se=null,b&&t-pn>Dr&&(ho(b),b=null)}function ho(t){for(let e=M.length-1;e>=0;e--)Or(t.rect,M[e].rect)&&M.splice(e,1);M.push(t),gt(),p.setFxLabel(me().name,!0)}function Yt(){if(!E)return;const t=E.video.videoWidth||4,e=E.video.videoHeight||3,n=16,o=4,r=Math.max(64,window.innerWidth-n*2-o),a=Math.max(64,window.innerHeight-n*2-o-p.chromeHeight()),s=Math.min(r/t,a/e),i=Math.round(t*s),l=Math.round(e*s),c=Math.min(Ur,window.devicePixelRatio||1);p.canvas.style.width=`${i}px`,p.canvas.style.height=`${l}px`,p.setDeviceWidth(i);for(const u of[p.canvas,mt,ht])u.width=Math.round(i*c),u.height=Math.round(l*c);Sr(p.canvas.width,p.canvas.height),vt.width=vn,vt.height=Math.max(2,Math.round(vn*e/t))}function Wr(){const{width:t,height:e}=vt;return ve.save(),E.mirror&&(ve.translate(t,0),ve.scale(-1,1)),ve.drawImage(E.video,0,0,t,e),ve.restore(),ve.getImageData(0,0,t,e)}function Gr(){const{width:t,height:e}=p.canvas;g.save(),E.mirror&&(g.translate(t,0),g.scale(-1,1)),g.drawImage(E.video,0,0,t,e),g.restore()}function gn(t,e,n){const{width:o,height:r}=p.canvas,a=t.rect.x0*o,s=t.rect.y0*r,i=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*r;g.drawImage(e,a,s,i,l,a,s,i,l),g.strokeStyle="#ffffff",g.lineWidth=Math.max(2,o/640),n&&g.setLineDash([10,8]),g.strokeRect(a,s,i,l),g.setLineDash([])}function Hr(t){Gr();const e=M.map(i=>({f:i,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:i})=>i.effect.usesGl&&ue),o=e.some(({f:i})=>!(i.effect.usesGl&&ue));n&&ue.uploadVideo(E.video);const r={videoTex:n?ue.videoTex:null,sample:o?Wr():$r,video:E.video,mirror:E.mirror,time:t.time,frame:t.frame,beat:t.beat};let a=null,s=null;for(const{f:i,isDrawing:l}of e)!!i.effect.usesGl&&!!ue?(s!==i.effect&&(i.effect.render(r),s=i.effect),gn(i,ht,l)):(a!==i.effect&&(i.effect.render(r),a=i.effect),gn(i,mt,l))}function Xr(){const t=Ge();if(t.points.length===0||!E)return;const{width:e,height:n}=p.canvas,o=oo(E.video.videoWidth||4,E.video.videoHeight||3,e,n);g.lineWidth=Math.max(2,e/500);for(const r of t.points){if(r.fist)continue;const a=dt(r.thumb,o,E.mirror),s=dt(r.index,o,E.mirror),l=uo(r.handedness)?"#28c840":r.pinching?"#1f6bff":"#ffffff";g.strokeStyle=l,g.save(),g.lineWidth=Math.max(1,e/900),g.beginPath(),g.moveTo(a.x,a.y),g.lineTo(s.x,s.y),g.stroke(),g.restore();const c=Math.max(8,r.threshold*o.w/2);for(const f of[a,s])g.beginPath(),g.arc(f.x,f.y,c,0,Math.PI*2),g.stroke();const u=ro(a,s);g.beginPath(),g.arc(u.x,u.y,Math.max(3,e/240),0,Math.PI*2),g.fillStyle=l,g.fill()}}function Vr(){if(!Ne)return;const t=Ge(),e=Ir(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.fist?"FIST ":o.open?"OPEN ":"  -  "} ${uo(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),Ne.textContent=n.join(`
`)}function vo(t){requestAnimationFrame(vo);const e=Ee.tick(t),n=E!==null&&E.video.readyState>=2;if(n&&(yr(E.video,t),Tr()&&Kr(t),Nr(t)),e.playing&&n){const o=Ge(),r=b!==null||o.pinching>=2,a=oo(E.video.videoWidth||4,E.video.videoHeight||3,p.canvas.width,p.canvas.height);Pr(o.points,a,E.mirror,r,t),Hr(e),Ar(g),Xr(),t<Gt&&(g.fillStyle=`rgba(255,255,255,${.8*(Gt-t)/280})`,g.fillRect(0,0,p.canvas.width,p.canvas.height)),Vr()}We.captureFrame(p.canvas),We.recording&&p.setRecordTime((t-mo)/1e3),p.setHands(Bt(),Ge().hands>0),p.setTransport(e.frame,e.fps,e.bpm,e.playing)}function po(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Yr(){if(!E||!En.supported())return;if(!We.recording){We.start(p.canvas),mo=performance.now(),p.setRecording(!0);return}p.setRecording(!1);const t=await We.stop();t&&po(t.blob,`null8_${Ee.timecode().replaceAll(":","")}.${t.ext}`)}async function qr(){if(Bt()!=="loading"){if(Bt()==="on"){wr();return}p.setHands("loading",!1);try{await no()}catch(t){console.error("hand tracking init failed:",t)}}}async function jr(){if(!E||Mt)return;Mt=!0;const t=E.facing;try{E=await Eo(E)}catch{E=await Ht(t)}finally{Mt=!1}Yt()}function zr(){p.canvas.toBlob(t=>{t&&po(t,`null8_${Ee.timecode().replaceAll(":","")}.png`)},"image/png")}function Kr(t){if(Mr())Fr();else if(M.length>0||b!==null)M.length=0,b=null,gt(),be=0,p.setFxLabel(me().name,!0);else return;Gt=t+220}function Zr(){M.length>0?(M.pop(),gt()):be++,p.setFxLabel(me().name,!0)}async function Jr(){if(!(E||At)){At=!0;try{E=await Ht("user"),p.hideStartOverlay(),Yt(),requestAnimationFrame(vo),no().catch(t=>{console.warn("hand tracking unavailable:",t);const e=me();be++,Vt(e),M.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),p.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);p.showStartError(e),At=!1}}}function Qr(){const t=document.getElementById("app");p=yo(t,{onStart:()=>{Jr()},onCanvasTap:Zr,onPlayToggle:()=>Ee.toggle(),onSnapshot:zr,onTempoTap:()=>{const e=Pt.indexOf(Ee.bpm);Ee.bpm=Pt[(e+1)%Pt.length]},onRecordToggle:()=>{Yr()},onCameraFlip:()=>{jr()},onHandsToggle:()=>{qr()}}),g=p.canvas.getContext("2d"),mt=document.createElement("canvas"),fo=mt.getContext("2d"),ht=document.createElement("canvas"),ue=mr(ht),p.setFxLabel(me().name,!0),window.addEventListener("resize",Yt),new URLSearchParams(location.search).has("debug")&&(Ne=document.createElement("pre"),Ne.className="debug-hud",document.body.appendChild(Ne)),window.__null8={addFrame(e){const n=me();be++,Vt(n),ho({rect:e,effect:n})},clearFrames(){M.length=0,gt()},get frames(){return M.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Qr();
