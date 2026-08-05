(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();async function Gt(t="user"){const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.autoplay=!0;const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:t,width:{ideal:1280},height:{ideal:720}},audio:!1});return e.srcObject=n,await e.play(),e.videoWidth===0&&await new Promise(o=>{e.addEventListener("loadedmetadata",()=>o(),{once:!0})}),{video:e,stream:n,facing:t,mirror:t==="user"}}function po(t){for(const e of t.stream.getTracks())e.stop();t.video.srcObject=null}async function go(t){const e=t.facing==="user"?"environment":"user";return po(t),Gt(e)}const Eo=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];class gn{recording=!1;recorder=null;stream=null;chunks=[];mime="";canvas=document.createElement("canvas");ctx=this.canvas.getContext("2d");static supported(){return typeof MediaRecorder<"u"&&typeof HTMLCanvasElement.prototype.captureStream=="function"}start(e){this.recording||(this.mime=Eo.find(n=>MediaRecorder.isTypeSupported(n))??"",this.canvas.width=e.width,this.canvas.height=e.height,this.ctx.drawImage(e,0,0),this.stream=this.canvas.captureStream(60),this.recorder=new MediaRecorder(this.stream,{...this.mime?{mimeType:this.mime}:{},videoBitsPerSecond:8e6}),this.chunks=[],this.recorder.ondataavailable=n=>{n.data.size>0&&this.chunks.push(n.data)},this.recorder.start(1e3),this.recording=!0)}captureFrame(e){this.recording&&this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)}async stop(){const e=this.recorder;if(!e||!this.recording)return null;this.recording=!1;const n=new Promise(a=>{e.onstop=()=>a()});e.stop(),await n;for(const a of this.stream?.getTracks()??[])a.stop();this.recorder=null,this.stream=null;const o=this.mime||"video/webm",r=o.includes("mp4")?"mp4":"webm";return{blob:new Blob(this.chunks,{type:o.split(";")[0]}),ext:r}}}const rn=60;class xo{playing=!0;bpm=120;elapsed=0;lastTs=null;frame=0;fpsEma=60;tick(e){if(this.lastTs!==null){const n=(e-this.lastTs)/1e3;n>0&&n<1&&(this.fpsEma+=(1/n-this.fpsEma)*.08,this.playing&&(this.elapsed+=n))}return this.lastTs=e,this.playing&&this.frame++,this.state()}state(){return{time:this.elapsed,frame:this.frame,beat:this.elapsed*this.bpm/60,fps:this.fpsEma,playing:this.playing,bpm:this.bpm}}toggle(){return this.playing=!this.playing,this.playing}timecode(){const e=this.elapsed,n=Math.floor(e/3600),o=Math.floor(e/60)%60,r=Math.floor(e)%60,a=Math.floor(e*rn)%rn,s=i=>String(i).padStart(2,"0");return`${s(n)}:${s(o)}:${s(r)}:${s(a)}`}}const _o={en:{start:"TAP TO START",sub:`webcam access required
HTTPS or localhost only`,camError:"CAMERA ERROR",pause:"PAUSE",play:"PLAY",photo:"PHOTO CAPTURE",recStart:"RECORD START",recStop:"RECORD STOP",rec:"REC",frame:"F",fps:"FPS",tempo:"Tempo",bpm:"BPM",fx:"FX",next:"NEXT"},ko:{start:"탭하여 시작",sub:`웹캠 권한이 필요합니다
HTTPS 또는 localhost 전용`,camError:"카메라 오류",pause:"일시정지",play:"재생",photo:"사진 캡쳐",recStart:"녹화 시작",recStop:"녹화 정지",rec:"녹화",frame:"F",fps:"FPS",tempo:"템포",bpm:"BPM",fx:"FX",next:"다음"}},En="null8-lang";function To(){const t=localStorage.getItem(En);return t==="en"||t==="ko"?t:navigator.language?.startsWith("ko")?"ko":"en"}function v(t,e,n){const o=document.createElement(t);return e&&(o.className=e),n!==void 0&&(o.textContent=n),o}function wo(t,e){let n=To();const o=()=>_o[n];let r=!1,a=!1,s=!1,i=!0,l={name:"—",next:!1};const c=v("header","titlebar"),u=v("div","traffic");for(const h of["r","y","g"])u.appendChild(v("span",h));const f=v("div","path","/project1/null8 (128,128)"),d=v("button","lang-btn");d.title="language",d.addEventListener("click",()=>{n=n==="en"?"ko":"en",localStorage.setItem(En,n),nn()}),c.append(u,f,d);const m=v("div","viewport"),T=v("canvas");m.appendChild(T),m.addEventListener("click",()=>e.onCanvasTap());const _=v("div","start-overlay"),S=v("div","pulse"),R=v("div","big"),y=v("div","sub");_.append(S,R,y),_.addEventListener("click",h=>{h.stopPropagation(),e.onStart()}),m.appendChild(_);const P=v("footer","transport"),$=v("div","group"),I=v("span","label"),x=v("span","lcd small","—");$.append(I,x);const w=v("button","on");w.addEventListener("click",()=>e.onPlayToggle());const O=v("button");O.addEventListener("click",()=>e.onSnapshot());const M=v("button","rec-btn");M.addEventListener("click",()=>e.onRecordToggle());const me=v("div","group"),Yt=v("span","label"),He=v("span","lcd small","00:00");me.append(Yt,He),me.style.display="none";const qt=v("div","group"),jt=v("span","label"),zt=v("span","lcd small","0");qt.append(jt,zt);const Kt=v("div","group"),Zt=v("span","label"),Jt=v("span","lcd small","60.0");Kt.append(Zt,Jt);const Qt=v("div","group"),en=v("span","label"),Xe=v("span","lcd small","120"),tn=v("span","label");Xe.style.cursor="pointer",Xe.addEventListener("click",()=>e.onTempoTap()),Qt.append(en,Xe,tn);const he=v("button","hands-btn","✋︎");he.title="hand tracking",he.addEventListener("click",()=>e.onHandsToggle());const gt=v("button",void 0,"⇄");gt.title="switch camera",gt.addEventListener("click",()=>e.onCameraFlip()),P.append($,w,O,M,me,v("div","push"),qt,Kt,Qt,he,gt);const Et=v("div","device");Et.append(c,m,P),t.append(Et);function nn(){const h=o();d.textContent=n==="en"?"한":"EN",r||(R.textContent=a?h.camError:h.start,a||(y.textContent=h.sub)),w.textContent=i?h.pause:h.play,O.textContent=h.photo,M.textContent=s?h.recStop:h.recStart,Yt.textContent=h.rec,jt.textContent=h.frame,Zt.textContent=h.fps,en.textContent=h.tempo,tn.textContent=h.bpm,I.textContent=h.fx,x.textContent=l.next?`${h.next} ${l.name}`:l.name}return nn(),{canvas:T,chromeHeight(){return c.offsetHeight+P.offsetHeight},setDeviceWidth(h){Et.style.width=`${h+4}px`},hideStartOverlay(){r=!0,_.classList.add("hidden")},showStartError(h){a=!0,R.textContent=o().camError,y.textContent=h,S.style.animationDuration="0.4s"},setFxLabel(h,z=!1){l={name:h,next:z},x.textContent=z?`${o().next} ${h}`:h},setTransport(h,z,xt,on){zt.textContent=String(h).padStart(6,"0"),Jt.textContent=z.toFixed(1),Xe.textContent=String(xt),i!==on&&(i=on,w.textContent=i?o().pause:o().play,w.classList.toggle("on",i))},setRecording(h){s=h,M.textContent=h?o().recStop:o().recStart,M.classList.toggle("recording",h),He.classList.toggle("rec",h),me.style.display=h?"flex":"none",h||(He.textContent="00:00")},setRecordTime(h){const z=Math.floor(h/60),xt=Math.floor(h)%60;He.textContent=`${String(z).padStart(2,"0")}:${String(xt).padStart(2,"0")}`},setHands(h,z){he.classList.toggle("loading",h==="loading"),he.classList.toggle("on",h==="on"),he.classList.toggle("detect",h==="on"&&z)}}}const yo=6,an=2;let V,st=0,Mt=0,qe=new Float64Array(0),je=new Float64Array(0),ze=new Float64Array(0),Ke=new Float64Array(0),Ze=new Float64Array(0);function bo(t){const{width:e,height:n,data:o}=t;if(e!==st||n!==Mt){st=e,Mt=n;const a=(e+1)*(n+1);qe=new Float64Array(a),je=new Float64Array(a),ze=new Float64Array(a),Ke=new Float64Array(a),Ze=new Float64Array(a)}const r=e+1;for(let a=0;a<n;a++){let s=0,i=0,l=0,c=0,u=0;for(let f=0;f<e;f++){const d=(a*e+f)*4,m=o[d],T=o[d+1],_=o[d+2],S=ye(m,T,_);s+=S,i+=S*S,l+=m,c+=T,u+=_;const R=(a+1)*r+(f+1),y=a*r+(f+1);qe[R]=qe[y]+s,je[R]=je[y]+i,ze[R]=ze[y]+l,Ke[R]=Ke[y]+c,Ze[R]=Ze[y]+u}}}function Re(t,e,n,o,r){const a=st+1;return t[(n+r)*a+(e+o)]-t[n*a+(e+o)]-t[(n+r)*a+e]+t[n*a+e]}function Ro(t,e,n){const o=Math.sin(t*127.1+e*311.7+n*74.7)*43758.5453;return o-Math.floor(o)}function Le(t,e,n,o,r,a,s,i,l){const c=n*o,u=Re(qe,t,e,n,o)/c,f=Re(je,t,e,n,o)/c-u*u;if(r<yo&&n>an&&o>an&&f>a){const I=n>>1,x=o>>1;Le(t,e,I,x,r+1,a,s,i,l),Le(t+I,e,n-I,x,r+1,a,s,i,l),Le(t,e+x,I,o-x,r+1,a,s,i,l),Le(t+I,e+x,n-I,o-x,r+1,a,s,i,l);return}const m=Re(ze,t,e,n,o)/c,T=Re(Ke,t,e,n,o)/c,_=Re(Ze,t,e,n,o)/c,S=Ro(t,e,Math.floor(l*2))<.025;V.fillStyle=S?"#2ea44f":`rgb(${Math.round(m)},${Math.round(T)},${Math.round(_)})`;const R=t*s,y=e*i,P=n*s,$=o*i;V.fillRect(R,y,P,$),V.strokeRect(R+.5,y+.5,P-1,$-1)}const So={id:"quadtree",name:"QUADTREE MOSAIC",init(t,e){V=e},render(t){const{width:e,height:n}=V.canvas,{width:o,height:r}=t.sample;bo(t.sample);const a=380+300*Math.sin(t.beat*Math.PI/2);V.fillStyle="#000",V.fillRect(0,0,e,n),V.strokeStyle="#000",V.lineWidth=1,Le(0,0,o,r,0,a,e/o,n/r,t.beat)},dispose(){st=0,Mt=0}},Lo=`#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function sn(t,e,n){const o=t.createShader(e);if(t.shaderSource(o,n),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const r=t.getShaderInfoLog(o);throw t.deleteShader(o),new Error(`shader compile failed: ${r}`)}return o}function q(t,e,n=Lo){const o=sn(t,t.VERTEX_SHADER,n),r=sn(t,t.FRAGMENT_SHADER,e),a=t.createProgram();if(t.attachShader(a,o),t.attachShader(a,r),t.linkProgram(a),t.deleteShader(o),t.deleteShader(r),!t.getProgramParameter(a,t.LINK_STATUS)){const s=t.getProgramInfoLog(a);throw t.deleteProgram(a),new Error(`program link failed: ${s}`)}return a}function ie(t){t.drawArrays(t.TRIANGLES,0,3)}function Co(t,e,n){const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR);const r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{framebuffer:r,texture:o,width:e,height:n}}function xn(t,e){t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}const Po=`#version 300 es
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
`;let W=null,se=null,_n=null,Tn=null,wn=null,yn=null;function Ao(t){const e=W;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(se),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(_n,0),e.uniform2f(Tn,1/t.video.videoWidth,1/t.video.videoHeight),e.uniform1f(wn,t.time),e.uniform1i(yn,t.mirror?1:0),ie(e)}let Je,K=null,_t,Ce=new Float32Array(0),Qe=null;function Mo(t){const{width:e,height:n,data:o}=t.sample;K||(K=document.createElement("canvas"),_t=K.getContext("2d")),(K.width!==e||K.height!==n)&&(K.width=e,K.height=n,Ce=new Float32Array(e*n),Qe=_t.createImageData(e,n));for(let i=0,l=0;i<e*n;i++,l+=4)Ce[i]=ye(o[l],o[l+1],o[l+2])/255;const r=Qe.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){let c=0;l>0&&l<e-1&&i>0&&i<n-1&&(c=Ce[(i-1)*e+(l-1)]-Ce[(i+1)*e+(l+1)]);const u=(i*e+l)*4;r[u]=Math.min(255,Math.max(0,248-c*2.3*255)),r[u+1]=Math.min(255,Math.max(0,247-c*1.6*255)),r[u+2]=Math.min(255,Math.max(0,242-c*2.9*255)),r[u+3]=255}_t.putImageData(Qe,0,0);const{width:a,height:s}=Je.canvas;Je.imageSmoothingEnabled=!0,Je.drawImage(K,0,0,a,s)}const Fo={id:"relief",name:"RELIEF",usesGl:!0,init(t,e){W=t,Je=e,W&&!se&&(se=q(W,Po),_n=W.getUniformLocation(se,"u_video"),Tn=W.getUniformLocation(se,"u_texel"),wn=W.getUniformLocation(se,"u_time"),yn=W.getUniformLocation(se,"u_mirror"))},render(t){W&&t.videoTex?Ao(t):Mo(t)},dispose(){Ce=new Float32Array(0),Qe=null}},Io=`#version 300 es
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
`;let N=null,te=null,bn=null,Rn=null,Sn=null,Ln=null,Cn=null;function Uo(t){const e=N,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(te),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(bn,0),e.uniform2f(Rn,n,o),e.uniform1f(Sn,Math.max(1,Math.min(2,window.devicePixelRatio||1))*1.5),e.uniform1f(Ln,t.time),e.uniform1i(Cn,t.mirror?1:0),ie(e)}const Do=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),ko=[[217,247,255],[84,158,255],[20,56,128],[0,3,8]];let Pe,Z=null,Tt,Ae=new Float32Array(0),et=null;function $o(t){const{width:e,height:n,data:o}=t.sample;Z||(Z=document.createElement("canvas"),Tt=Z.getContext("2d")),(Z.width!==e||Z.height!==n)&&(Z.width=e,Z.height=n,Ae=new Float32Array(e*n),et=Tt.createImageData(e,n));for(let l=0,c=0;l<e*n;l++,c+=4)Ae[l]=ye(o[c],o[c+1],o[c+2])/255;const r=t.time,a=et.data;for(let l=0;l<n;l++){const c=l/n,u=Math.sin(c*58+r*2.4)*.55+Math.sin(c*21-r*1.6)*.45,f=Do[l&3];for(let d=0;d<e;d++){const m=Ae[l*e+d];let T=0;for(let y=0;y<4;y++){const P=Math.round(u*(.006+y*.014)*(.35+m)*e),$=Math.min(e-1,Math.max(0,d+P));T=Math.max(T,Ae[l*e+$]*Math.pow(.7,y))}const _=T+(f[d&3]-.5)*.28,S=ko[_>.72?0:_>.45?1:_>.24?2:3],R=(l*e+d)*4;a[R]=S[0],a[R+1]=S[1],a[R+2]=S[2],a[R+3]=255}}Tt.putImageData(et,0,0);const{width:s,height:i}=Pe.canvas;Pe.imageSmoothingEnabled=!1,Pe.drawImage(Z,0,0,s,i),Pe.imageSmoothingEnabled=!0}const Oo={id:"wave",name:"WAVE",usesGl:!0,init(t,e){N=t,Pe=e,N&&!te&&(te=q(N,Io),bn=N.getUniformLocation(te,"u_video"),Rn=N.getUniformLocation(te,"u_res"),Sn=N.getUniformLocation(te,"u_cell"),Ln=N.getUniformLocation(te,"u_time"),Cn=N.getUniformLocation(te,"u_mirror"))},render(t){N&&t.videoTex?Uo(t):$o(t)},dispose(){Ae=new Float32Array(0),et=null}},No=`#version 300 es
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
`;let ne=null,pe=null,Pn=null,An=null,Mn=null;function Bo(t){const e=ne;e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(pe),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Pn,0),e.uniform1f(An,t.time),e.uniform1i(Mn,t.mirror?1:0),ie(e)}const Wo=[[10,107,31],[51,168,61],[237,230,133],[250,250,240]];let Me,J=null,wt,tt=null;function Go(t){const{width:e,height:n,data:o}=t.sample;J||(J=document.createElement("canvas"),wt=J.getContext("2d")),(J.width!==e||J.height!==n)&&(J.width=e,J.height=n,tt=wt.createImageData(e,n));const r=tt.data;for(let i=0;i<n;i++)for(let l=0;l<e;l++){const c=(i*e+l)*4,u=(Math.random()-.5)*.16,f=ye(o[c],o[c+1],o[c+2])/255+u,d=Wo[f<.3?0:f<.52?1:f<.72?2:3];r[c]=d[0],r[c+1]=d[1],r[c+2]=d[2],r[c+3]=255}wt.putImageData(tt,0,0);const{width:a,height:s}=Me.canvas;Me.imageSmoothingEnabled=!1,Me.drawImage(J,0,0,a,s),Me.imageSmoothingEnabled=!0}const Ho={id:"riso",name:"RISO",usesGl:!0,init(t,e){ne=t,Me=e,ne&&!pe&&(pe=q(ne,No),Pn=ne.getUniformLocation(pe,"u_video"),An=ne.getUniformLocation(pe,"u_time"),Mn=ne.getUniformLocation(pe,"u_mirror"))},render(t){ne&&t.videoTex?Bo(t):Go(t)},dispose(){tt=null}},Xo=`#version 300 es
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
`,Vo=`#version 300 es
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
`,yt=200,xe={wave:1,trail:.14},bt=[1,2,3.5,.4],Yo=`#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`,qo=`#version 300 es
precision highp float;
uniform sampler2D u_tex;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_tex, v_uv).rgb, 1.0); }
`;let L=null,G=null,Ft=null,Fn=null,In=null,Un=null,Dn=null,kn=null,$n=null,On=null,It=null,Nn=null,D=null,De=!0;function jo(t){const e=L,n=e.drawingBufferWidth,o=e.drawingBufferHeight;(!D||D.width!==n||D.height!==o)&&(D&&xn(e,D),D=Co(e,n,o),De=!0),e.bindFramebuffer(e.FRAMEBUFFER,D.framebuffer),e.viewport(0,0,n,o),De&&(e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),De=!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.useProgram(Ft),e.uniform1f(On,xe.trail),ie(e);const r=Math.max(2,Math.round(yt*t.video.videoHeight/t.video.videoWidth));e.useProgram(G),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Fn,0),e.uniform2f(In,yt,r),e.uniform2f(Un,n,o),e.uniform1f(Dn,t.time),e.uniform1f(kn,xe.wave),e.uniform1i($n,t.mirror?1:0),e.drawArrays(e.POINTS,0,yt*r),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,n,o),e.useProgram(It),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,D.texture),e.uniform1i(Nn,0),ie(e)}const ln=2;let Ut,H=null,ae,ke=!0;function zo(t){const{width:e,height:n}=Ut.canvas,{width:o,height:r,data:a}=t.sample;H||(H=document.createElement("canvas"),ae=H.getContext("2d")),(H.width!==e||H.height!==n)&&(H.width=e,H.height=n,ke=!0),ke?(ae.fillStyle="#000",ae.fillRect(0,0,e,n),ke=!1):(ae.fillStyle=`rgba(0,0,0,${xe.trail})`,ae.fillRect(0,0,e,n));const s=e/o,i=n/r,l=t.time,c=xe.wave;for(let u=0;u<r;u+=ln)for(let f=0;f<o;f+=ln){const d=(u*o+f)*4,m=ye(a[d],a[d+1],a[d+2])/255;if(m<.04)continue;const T=Math.sin(l*2+f*.35+u*.18)*(1+m*5)*s*.6*c,_=Math.cos(l*1.6+u*.28+f*.11)*(1+m*3)*i*.4*c,S=Math.round(24+m*60),R=Math.round(90+m*150),y=Math.round(200+m*55),P=(.6+m*2.6)*s*.5;ae.fillStyle=`rgba(${S},${R},${y},${.2+m*.8})`,ae.fillRect(f*s+T,u*i+_,P,P)}Ut.drawImage(H,0,0)}const Ko={id:"pointcloud",name:"POINT CLOUD",usesGl:!0,init(t,e){L=t,Ut=e,ke=!0,De=!0,L&&!G&&(G=q(L,Vo,Xo),Fn=L.getUniformLocation(G,"u_video"),In=L.getUniformLocation(G,"u_grid"),Un=L.getUniformLocation(G,"u_res"),Dn=L.getUniformLocation(G,"u_time"),kn=L.getUniformLocation(G,"u_wave"),$n=L.getUniformLocation(G,"u_mirror"),Ft=q(L,Yo),On=L.getUniformLocation(Ft,"u_alpha"),It=q(L,qo),Nn=L.getUniformLocation(It,"u_tex"))},render(t){L&&t.videoTex?jo(t):zo(t)},dispose(){L&&D&&xn(L,D),D=null,H=null,ke=!0,De=!0},onReselect(){const t=bt.indexOf(xe.wave);xe.wave=bt[(t+1)%bt.length]}},Zo=`#version 300 es
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
`;let lt=!1,U=null,X=null,Bn=null,Wn=null,Gn=null,Hn=null,Xn=null,Vn=null;function Jo(t){const e=U,n=e.drawingBufferWidth,o=e.drawingBufferHeight;e.viewport(0,0,n,o),e.useProgram(X),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(Bn,0),e.uniform2f(Wn,n,o),e.uniform1f(Gn,Math.max(1,Math.min(2,window.devicePixelRatio||1))),e.uniform1f(Hn,t.time),e.uniform1i(Xn,t.mirror?1:0),e.uniform1i(Vn,lt?1:0),ie(e)}const Qo=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(t=>t.map(e=>(e+.5)/16)),er={r:238,g:244,b:250},tr={r:22,g:72,b:158},nr=.12;let Fe,Q=null,Rt,nt=null;function or(t){const{width:e,height:n,data:o}=t.sample;Q||(Q=document.createElement("canvas"),Rt=Q.getContext("2d")),(Q.width!==e||Q.height!==n)&&(Q.width=e,Q.height=n,nt=Rt.createImageData(e,n));const r=nt.data;for(let i=0;i<n;i++){const l=Qo[i&3];for(let c=0;c<e;c++){const u=(i*e+c)*4;let d=ye(o[u],o[u+1],o[u+2])/255+(Math.random()-.5)*nr>l[c&3];lt&&(d=!d);const m=d?er:tr;r[u]=m.r,r[u+1]=m.g,r[u+2]=m.b,r[u+3]=255}}Rt.putImageData(nt,0,0);const{width:a,height:s}=Fe.canvas;Fe.imageSmoothingEnabled=!1,Fe.drawImage(Q,0,0,a,s),Fe.imageSmoothingEnabled=!0}const rr={id:"blueprint",name:"BLUEPRINT",usesGl:!0,init(t,e){U=t,Fe=e,U&&!X&&(X=q(U,Zo),Bn=U.getUniformLocation(X,"u_video"),Wn=U.getUniformLocation(X,"u_res"),Gn=U.getUniformLocation(X,"u_cell"),Hn=U.getUniformLocation(X,"u_time"),Xn=U.getUniformLocation(X,"u_mirror"),Vn=U.getUniformLocation(X,"u_invert"))},render(t){U&&t.videoTex?Jo(t):or(t)},dispose(){nt=null},onReselect(){lt=!lt}},ir=`#version 300 es
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
`,$e=60,Yn=480,qn=270,ar=`#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;let C=null,ot=null,oe=null,jn=null,zn=null,Kn=null,Zn=null,Jn=null,Qn=null,eo=null,re=null,Oe=null,ge=-1,Ne=0;function sr(t){re=t.createTexture(),t.bindTexture(t.TEXTURE_2D_ARRAY,re),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.RGBA8,Yn,qn,$e),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D_ARRAY,t.TEXTURE_MAG_FILTER,t.LINEAR),Oe=t.createFramebuffer(),ge=-1,Ne=0}function lr(){C&&(re&&C.deleteTexture(re),Oe&&C.deleteFramebuffer(Oe),re=null,Oe=null,ge=-1,Ne=0)}function cr(t){const e=C;ge=(ge+1)%$e,Ne=Math.min(Ne+1,$e),e.bindFramebuffer(e.FRAMEBUFFER,Oe),e.framebufferTextureLayer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,re,0,ge),e.viewport(0,0,Yn,qn),e.useProgram(ot),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.videoTex),e.uniform1i(jn,0),ie(e),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(oe),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D_ARRAY,re),e.uniform1i(zn,0),e.uniform1f(Kn,ge),e.uniform1f(Zn,$e),e.uniform1f(Jn,Ne),e.uniform1f(Qn,t.beat),e.uniform1i(eo,t.mirror?1:0),ie(e)}let rt,ee=null,St,it=null,le=[];function ur(t){const{width:e,height:n,data:o}=t.sample;ee||(ee=document.createElement("canvas"),St=ee.getContext("2d")),(ee.width!==e||ee.height!==n)&&(ee.width=e,ee.height=n,it=St.createImageData(e,n),le=[]),le.push(new Uint8ClampedArray(o)),le.length>$e&&le.shift();const r=le.length-1,a=it.data;for(let l=0;l<n;l++){let c=l/Math.max(1,n-1)*r;c+=Math.sin((1-l/n)*36+t.beat*Math.PI)*3;const u=Math.round(Math.min(r,Math.max(0,c))),f=le[r-u],d=l*e*4;a.set(f.subarray(d,d+e*4),d)}St.putImageData(it,0,0);const{width:s,height:i}=rt.canvas;rt.imageSmoothingEnabled=!0,rt.drawImage(ee,0,0,s,i)}const fr={id:"slitscan",name:"SLIT-SCAN",usesGl:!0,init(t,e){C=t,rt=e,C&&(ot||(ot=q(C,ar),jn=C.getUniformLocation(ot,"u_video"),oe=q(C,ir),zn=C.getUniformLocation(oe,"u_history"),Kn=C.getUniformLocation(oe,"u_head"),Zn=C.getUniformLocation(oe,"u_layers"),Jn=C.getUniformLocation(oe,"u_filled"),Qn=C.getUniformLocation(oe,"u_beat"),eo=C.getUniformLocation(oe,"u_mirror")),sr(C))},render(t){C&&t.videoTex&&re?cr(t):ur(t)},dispose(){lr(),le=[],it=null}},Dt=[So,Fo,Oo,Ho,Ko,rr,fr];function ye(t,e,n){return .2126*t+.7152*e+.0722*n}function dr(t){const e=t.getContext("webgl2",{preserveDrawingBuffer:!0,antialias:!1,alpha:!1});if(!e)return null;const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let o=0,r=0;return{gl:e,videoTex:n,uploadVideo(a){const s=a.videoWidth,i=a.videoHeight;s===0||i===0||(e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),s!==o||i!==r?(o=s,r=i,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,a)):e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,a))},dispose(){e.deleteTexture(n)}}}const mr="modulepreload",hr=function(t,e){return new URL(t,e).href},cn={},vr=function(e,n,o){let r=Promise.resolve();if(n&&n.length>0){let c=function(u){return Promise.all(u.map(f=>Promise.resolve(f).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");r=c(n.map(u=>{if(u=hr(u,o),u in cn)return;cn[u]=!0;const f=u.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(o)for(let T=s.length-1;T>=0;T--){const _=s[T];if(_.href===u&&(!f||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${d}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":mr,f||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),f)return new Promise((T,_)=>{m.addEventListener("load",T),m.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})};let ue="off",_e=null,kt=-1,$t=0,ct={hands:0,pinching:0,points:[],corners:null};const un=.4,pr=.6,fn=2,Ie=new Map,gr=1100,Er=3,dn=.05,xr=1500,Ue=new Map;let ut=!1,mn=0;function _r(){const t=ut;return ut=!1,t}function Ot(){return ue}function Ge(){return ct}async function to(){if(ue==="off"){ue="loading";try{const{FilesetResolver:t,HandLandmarker:e}=await vr(async()=>{const{FilesetResolver:a,HandLandmarker:s}=await import("./vision_bundle-Bk4VIwNi.js");return{FilesetResolver:a,HandLandmarker:s}},[],import.meta.url),n="./",o=await t.forVisionTasks(`${n}mediapipe/wasm`),r=a=>({baseOptions:{modelAssetPath:`${n}mediapipe/hand_landmarker.task`,delegate:a},runningMode:"VIDEO",numHands:2,minHandDetectionConfidence:.3,minHandPresenceConfidence:.3,minTrackingConfidence:.3});try{_e=await e.createFromOptions(o,r("GPU"))}catch{_e=await e.createFromOptions(o,r("CPU"))}ue="on"}catch(t){throw ue="off",t}}}function Tr(){_e?.close(),_e=null,ue="off",kt=-1,$t=0,Ie.clear(),Ue.clear(),ut=!1,ct={hands:0,pinching:0,points:[],corners:null}}function wr(t,e){if(ue!=="on"||!_e||t.currentTime===kt)return;const n=ct.hands>0?33:100;if(e-$t<n)return;kt=t.currentTime,$t=e;const o=_e.detectForVideo(t,e),r=[],a=o.landmarks?.length??0,s=t.videoWidth||1280,i=t.videoHeight||720,l=(f,d)=>Math.hypot((f.x-d.x)*s,(f.y-d.y)*i),c=new Set;for(let f=0;f<a;f++){const d=o.landmarks[f];let m=o.handednesses?.[f]?.[0]?.categoryName??`hand${f}`;c.has(m)&&(m=`${m}${f}`),c.add(m);const T=d[4],_=d[8],S=l(d[5],d[17]),y=l(T,_)/Math.max(S,1e-6);let P=0;for(const[O,M]of[[8,6],[12,10],[16,14],[20,18]])l(d[0],d[O])>l(d[0],d[M])*1.15&&P++;const $=P>=3,I=P<=1;let x=Ie.get(m);x||(x={down:!1,onFrames:0,offFrames:0},Ie.set(m,x)),I?(x.down=!1,x.onFrames=0,x.offFrames=0):y<un?(x.onFrames++,x.offFrames=0,x.onFrames>=fn&&(x.down=!0)):y>pr?(x.offFrames++,x.onFrames=0,x.offFrames>=fn&&(x.down=!1)):(x.onFrames=0,x.offFrames=0);let w=Ue.get(m);if(w||(w={dir:0,extreme:d[9].x*s,reversals:[]},Ue.set(m,w)),$&&!x.down){const O=d[9].x*s,M=O-w.extreme;w.dir===0?Math.abs(M)>dn*s&&(w.dir=Math.sign(M),w.extreme=O):Math.sign(M)===w.dir?w.extreme=O:Math.abs(M)>dn*s&&(w.dir=Math.sign(M),w.extreme=O,w.reversals.push(e),w.reversals=w.reversals.filter(me=>e-me<gr),w.reversals.length>=Er&&e>mn&&(ut=!0,mn=e+xr,w.reversals=[]))}else w.dir=0,w.extreme=d[9].x*s,w.reversals=[];r.push({handedness:m,thumb:{x:T.x,y:T.y},index:{x:_.x,y:_.y},threshold:un*S/s,ratio:y,pinching:x.down,open:$,fist:I,x:(T.x+_.x)/2,y:(T.y+_.y)/2})}for(const f of[...Ie.keys()])c.has(f)||Ie.delete(f);for(const f of[...Ue.keys()])c.has(f)||Ue.delete(f);const u=r.filter(f=>f.pinching);ct={hands:a,pinching:u.length,points:r,corners:u.length>=2?[u[0],u[1]]:null}}function no(t,e,n,o){const r=Math.max(n/t,o/e),a=t*r,s=e*r;return{x:(n-a)/2,y:(o-s)/2,w:a,h:s}}function ft(t,e,n){const o=n?1-t.x:t.x;return{x:e.x+o*e.w,y:e.y+t.y*e.h}}function oo(t,e){return{x:(t.x+e.x)/2,y:(t.y+e.y)/2}}const at={minDist:1.5,baseWidth:12,maxPoints:2e4,bufferMs:250},yr=["#28c840","#ffffff","#141414","#1f6bff","#9cc3ff"];let br=yr[0];const fe=new Map,j=[];let Te=0,A=null,k=null,Y=null,B=null;const ro=5;function io(t){const e=parseInt(t.slice(1),16);return .2126*(e>>16&255)+.7152*(e>>8&255)+.0722*(e&255)<128?"rgba(255,255,255,0.85)":"rgba(18,18,18,0.7)"}function Rr(t,e){if(A||(A=document.createElement("canvas"),Y=document.createElement("canvas"),k=A.getContext("2d"),B=Y.getContext("2d")),A.width===t&&A.height===e)return;const n=A.width,o=A.height;if(n>0&&o>0){const r=t/n,a=e/o,s=(r+a)/2;for(const i of j)for(const l of i.pts)l.x*=r,l.y*=a,l.w*=s}A.width=t,A.height=e,Y.width=t,Y.height=e,Ht()}function Nt(t,e,n,o){const r=e.pts;t.strokeStyle=o?io(e.color):e.color,t.lineCap="round",t.lineJoin="round";const a=o?ro:0;if(n===1){t.lineWidth=r[1].w+a,t.beginPath(),t.moveTo(r[0].x,r[0].y),t.lineTo((r[0].x+r[1].x)/2,(r[0].y+r[1].y)/2),t.stroke();return}const s=r[n-2],i=r[n-1],l=r[n],c={x:(s.x+i.x)/2,y:(s.y+i.y)/2},u={x:(i.x+l.x)/2,y:(i.y+l.y)/2};t.lineWidth=i.w+a,t.beginPath(),t.moveTo(c.x,c.y),t.quadraticCurveTo(i.x,i.y,u.x,u.y),t.stroke()}function Bt(t,e,n){const o=e.pts[0];t.fillStyle=n?io(e.color):e.color,t.beginPath(),t.arc(o.x,o.y,(o.w+(n?ro:0))/2,0,Math.PI*2),t.fill()}function we(t,e,n){if(e.pts.length!==0){if(e.pts.length===1){Bt(t,e,n);return}for(let o=1;o<e.pts.length;o++)Nt(t,e,o,n)}}function Sr(t,e){B&&Nt(B,t,e,!0),k&&Nt(k,t,e,!1)}function Ht(){if(!(!A||!k||!Y||!B)){k.clearRect(0,0,A.width,A.height),B.clearRect(0,0,Y.width,Y.height);for(const t of j)we(B,t,!0),we(k,t,!1)}}function ao(t){!t.stroke||!k||!B||(t.pendingSince=-1,we(B,t.stroke,!0),we(k,t.stroke,!1),t.inked=t.stroke.pts.length,j.push(t.stroke))}function Lt(t){t.stroke&&t.pendingSince>=0&&ao(t),t.stroke&&t.stroke.pts.length===1&&k&&B&&(Bt(B,t.stroke,!0),Bt(k,t.stroke,!1)),t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function so(t){Te-=t.stroke?.pts.length??0,t.drawing=!1,t.stroke=null,t.pendingSince=-1,t.inked=0}function Lr(){let t=!1;for(;Te>at.maxPoints&&j.length>0;)Te-=j.shift().pts.length,t=!0;t&&Ht()}function Cr(t,e,n,o,r){const a=new Set;for(const s of t){a.add(s.handedness);let i=fe.get(s.handedness);if(i||(i={drawing:!1,stroke:null,pendingSince:-1,inked:0},fe.set(s.handedness,i)),o&&i.drawing){i.pendingSince>=0?so(i):Lt(i);continue}if(i.drawing&&!s.pinching){Lt(i);continue}if(!i.drawing&&s.pinching&&!o&&(i.drawing=!0,i.stroke={color:br,pts:[]},i.pendingSince=r,i.inked=0),!i.drawing||!i.stroke)continue;const l=oo(ft(s.thumb,e,n),ft(s.index,e,n)),c=i.stroke.pts[i.stroke.pts.length-1];if((!c||Math.hypot(l.x-c.x,l.y-c.y)>=at.minDist)&&(i.stroke.pts.push({x:l.x,y:l.y,w:at.baseWidth}),Te++),i.pendingSince>=0)r-i.pendingSince>at.bufferMs&&ao(i);else if(k)for(;i.inked<i.stroke.pts.length;)i.inked++,i.inked>=2&&Sr(i.stroke,i.inked-1)}for(const[s,i]of fe)!a.has(s)&&i.drawing&&Lt(i);Lr()}function Pr(t){A&&Y&&(j.length>0||lo())&&(t.drawImage(Y,0,0),t.drawImage(A,0,0));for(const e of fe.values())e.drawing&&e.pendingSince>=0&&e.stroke&&(we(t,e.stroke,!0),we(t,e.stroke,!1))}function lo(){for(const t of fe.values())if(t.drawing)return!0;return!1}function co(t){return fe.get(t)?.drawing??!1}function Ar(){return j.length>0||lo()}function Mr(){for(const t of fe.values())so(t);j.length=0,Te=0,Ht()}function Fr(){return{strokes:j.length,points:Te}}const hn=128,Ir=2,Ct=[90,100,110,120,128,140],Ve=.08,Ur=400,Dr=150;let p,E=null,g,dt,uo,mt,ce=null,Pt=!1,At=!1,Be=null,Wt=0;const ht=document.createElement("canvas"),ve=ht.getContext("2d",{willReadFrequently:!0}),Ee=new xo,We=new gn;let fo=0;const kr=new ImageData(2,2),F=[];let b=null,be=0,vn=0,Se=null;const vt=new Set;function de(){return Dt[be%Dt.length]}function Xt(t){vt.has(t.id)||(t.init(ce?.gl??null,uo),vt.add(t.id))}function pt(){const t=new Set;for(const e of F)t.add(e.effect.id);b&&t.add(b.effect.id);for(const e of[...vt])t.has(e)||(Dt.find(n=>n.id===e)?.dispose(),vt.delete(e))}function $r(t,e){return e.x0>=t.x0&&e.x1<=t.x1&&e.y0>=t.y0&&e.y1<=t.y1}const Ye=.06;function Or(t){const e=t.map(s=>({x:E.mirror?1-s.x:s.x,y:s.y}));let n=Math.min(e[0].x,e[1].x),o=Math.max(e[0].x,e[1].x),r=Math.min(e[0].y,e[1].y),a=Math.max(e[0].y,e[1].y);return n<Ye&&(n=0),r<Ye&&(r=0),o>1-Ye&&(o=1),a>1-Ye&&(a=1),o-n<Ve&&(o=n+Ve),a-r<Ve&&(a=r+Ve),{x0:n,y0:r,x1:o,y1:a}}function Nr(t){const e=Ge();if(e.corners&&E){vn=t;const n=Or(e.corners);if(b)b.rect.x0+=(n.x0-b.rect.x0)*.3,b.rect.y0+=(n.y0-b.rect.y0)*.3,b.rect.x1+=(n.x1-b.rect.x1)*.3,b.rect.y1+=(n.y1-b.rect.y1)*.3;else{if(Se===null&&(Se=t),t-Se<Dr)return;Se=null,b={rect:n,effect:de()},be++,Xt(b.effect),p.setFxLabel(b.effect.name)}return}Se=null,b&&t-vn>Ur&&(mo(b),b=null)}function mo(t){for(let e=F.length-1;e>=0;e--)$r(t.rect,F[e].rect)&&F.splice(e,1);F.push(t),pt(),p.setFxLabel(de().name,!0)}function Vt(){if(!E)return;const t=E.video.videoWidth||4,e=E.video.videoHeight||3,n=16,o=4,r=Math.max(64,window.innerWidth-n*2-o),a=Math.max(64,window.innerHeight-n*2-o-p.chromeHeight()),s=Math.min(r/t,a/e),i=Math.round(t*s),l=Math.round(e*s),c=Math.min(Ir,window.devicePixelRatio||1);p.canvas.style.width=`${i}px`,p.canvas.style.height=`${l}px`,p.setDeviceWidth(i);for(const u of[p.canvas,dt,mt])u.width=Math.round(i*c),u.height=Math.round(l*c);Rr(p.canvas.width,p.canvas.height),ht.width=hn,ht.height=Math.max(2,Math.round(hn*e/t))}function Br(){const{width:t,height:e}=ht;return ve.save(),E.mirror&&(ve.translate(t,0),ve.scale(-1,1)),ve.drawImage(E.video,0,0,t,e),ve.restore(),ve.getImageData(0,0,t,e)}function Wr(){const{width:t,height:e}=p.canvas;g.save(),E.mirror&&(g.translate(t,0),g.scale(-1,1)),g.drawImage(E.video,0,0,t,e),g.restore()}function pn(t,e,n){const{width:o,height:r}=p.canvas,a=t.rect.x0*o,s=t.rect.y0*r,i=(t.rect.x1-t.rect.x0)*o,l=(t.rect.y1-t.rect.y0)*r;g.drawImage(e,a,s,i,l,a,s,i,l),g.strokeStyle="#ffffff",g.lineWidth=Math.max(2,o/640),n&&g.setLineDash([10,8]),g.strokeRect(a,s,i,l),g.setLineDash([])}function Gr(t){Wr();const e=F.map(i=>({f:i,isDrawing:!1}));if(b&&e.push({f:b,isDrawing:!0}),e.length===0)return;const n=e.some(({f:i})=>i.effect.usesGl&&ce),o=e.some(({f:i})=>!(i.effect.usesGl&&ce));n&&ce.uploadVideo(E.video);const r={videoTex:n?ce.videoTex:null,sample:o?Br():kr,video:E.video,mirror:E.mirror,time:t.time,frame:t.frame,beat:t.beat};let a=null,s=null;for(const{f:i,isDrawing:l}of e)!!i.effect.usesGl&&!!ce?(s!==i.effect&&(i.effect.render(r),s=i.effect),pn(i,mt,l)):(a!==i.effect&&(i.effect.render(r),a=i.effect),pn(i,dt,l))}function Hr(){const t=Ge();if(t.points.length===0||!E)return;const{width:e,height:n}=p.canvas,o=no(E.video.videoWidth||4,E.video.videoHeight||3,e,n);g.lineWidth=Math.max(2,e/500);for(const r of t.points){if(r.fist)continue;const a=ft(r.thumb,o,E.mirror),s=ft(r.index,o,E.mirror),l=co(r.handedness)?"#28c840":r.pinching?"#1f6bff":"#ffffff";g.strokeStyle=l,g.save(),g.lineWidth=Math.max(1,e/900),g.beginPath(),g.moveTo(a.x,a.y),g.lineTo(s.x,s.y),g.stroke(),g.restore();const c=Math.max(8,r.threshold*o.w/2);for(const f of[a,s])g.beginPath(),g.arc(f.x,f.y,c,0,Math.PI*2),g.stroke();const u=oo(a,s);g.beginPath(),g.arc(u.x,u.y,Math.max(3,e/240),0,Math.PI*2),g.fillStyle=l,g.fill()}}function Xr(){if(!Be)return;const t=Ge(),e=Fr(),n=t.points.map(o=>`${o.handedness.padEnd(6)} ratio ${o.ratio.toFixed(2)} ${o.pinching?"PINCH":o.fist?"FIST ":o.open?"OPEN ":"  -  "} ${co(o.handedness)?"DRAW":""}`);n.push(`strokes ${e.strokes}  points ${e.points}  hands ${t.hands}`),Be.textContent=n.join(`
`)}function ho(t){requestAnimationFrame(ho);const e=Ee.tick(t),n=E!==null&&E.video.readyState>=2;if(n&&(wr(E.video,t),_r()&&zr(t),Nr(t)),e.playing&&n){const o=Ge(),r=b!==null||o.pinching>=2,a=no(E.video.videoWidth||4,E.video.videoHeight||3,p.canvas.width,p.canvas.height);Cr(o.points,a,E.mirror,r,t),Gr(e),Pr(g),Hr(),t<Wt&&(g.fillStyle=`rgba(255,255,255,${.8*(Wt-t)/280})`,g.fillRect(0,0,p.canvas.width,p.canvas.height)),Xr()}We.captureFrame(p.canvas),We.recording&&p.setRecordTime((t-fo)/1e3),p.setHands(Ot(),Ge().hands>0),p.setTransport(e.frame,e.fps,e.bpm,e.playing)}function vo(t,e){const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href)}async function Vr(){if(!E||!gn.supported())return;if(!We.recording){We.start(p.canvas),fo=performance.now(),p.setRecording(!0);return}p.setRecording(!1);const t=await We.stop();t&&vo(t.blob,`null8_${Ee.timecode().replaceAll(":","")}.${t.ext}`)}async function Yr(){if(Ot()!=="loading"){if(Ot()==="on"){Tr();return}p.setHands("loading",!1);try{await to()}catch(t){console.error("hand tracking init failed:",t)}}}async function qr(){if(!E||At)return;At=!0;const t=E.facing;try{E=await go(E)}catch{E=await Gt(t)}finally{At=!1}Vt()}function jr(){p.canvas.toBlob(t=>{t&&vo(t,`null8_${Ee.timecode().replaceAll(":","")}.png`)},"image/png")}function zr(t){if(Ar())Mr();else if(F.length>0||b!==null)F.length=0,b=null,pt(),be=0,p.setFxLabel(de().name,!0);else return;Wt=t+220}function Kr(){F.length>0?(F.pop(),pt()):be++,p.setFxLabel(de().name,!0)}async function Zr(){if(!(E||Pt)){Pt=!0;try{E=await Gt("user"),p.hideStartOverlay(),Vt(),requestAnimationFrame(ho),to().catch(t=>{console.warn("hand tracking unavailable:",t);const e=de();be++,Xt(e),F.push({rect:{x0:.2,y0:.15,x1:.8,y1:.85},effect:e}),p.setFxLabel(e.name)})}catch(t){const e=t instanceof Error?t.message:String(t);p.showStartError(e),Pt=!1}}}function Jr(){const t=document.getElementById("app");p=wo(t,{onStart:()=>{Zr()},onCanvasTap:Kr,onPlayToggle:()=>Ee.toggle(),onSnapshot:jr,onTempoTap:()=>{const e=Ct.indexOf(Ee.bpm);Ee.bpm=Ct[(e+1)%Ct.length]},onRecordToggle:()=>{Vr()},onCameraFlip:()=>{qr()},onHandsToggle:()=>{Yr()}}),g=p.canvas.getContext("2d"),dt=document.createElement("canvas"),uo=dt.getContext("2d"),mt=document.createElement("canvas"),ce=dr(mt),p.setFxLabel(de().name,!0),window.addEventListener("resize",Vt),new URLSearchParams(location.search).has("debug")&&(Be=document.createElement("pre"),Be.className="debug-hud",document.body.appendChild(Be)),window.__null8={addFrame(e){const n=de();be++,Xt(n),mo({rect:e,effect:n})},clearFrames(){F.length=0,pt()},get frames(){return F.map(e=>({rect:{...e.rect},id:e.effect.id}))}}}Jr();
