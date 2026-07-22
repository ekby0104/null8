#version 300 es
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
