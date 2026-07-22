#version 300 es
// SKETCH — Sobel 엣지 검출 → 반전 → 종이 톤, 풀해상도 (SPEC §5.3)
precision highp float;

uniform sampler2D u_video;
uniform vec2 u_texel;   // 1.0 / 비디오 해상도
uniform bool u_mirror;

in vec2 v_uv;
out vec4 outColor;

float lum(vec2 uv) {
  vec3 c = texture(u_video, uv).rgb;
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec2 uv = v_uv;
  if (u_mirror) uv.x = 1.0 - uv.x;

  float tl = lum(uv + u_texel * vec2(-1.0,  1.0));
  float tc = lum(uv + u_texel * vec2( 0.0,  1.0));
  float tr = lum(uv + u_texel * vec2( 1.0,  1.0));
  float ml = lum(uv + u_texel * vec2(-1.0,  0.0));
  float mr = lum(uv + u_texel * vec2( 1.0,  0.0));
  float bl = lum(uv + u_texel * vec2(-1.0, -1.0));
  float bc = lum(uv + u_texel * vec2( 0.0, -1.0));
  float br = lum(uv + u_texel * vec2( 1.0, -1.0));

  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -tl - 2.0 * tc - tr + bl + 2.0 * bc + br;
  float mag = clamp(length(vec2(gx, gy)), 0.0, 1.0);

  // 반전: 엣지가 진할수록 어두운 연필선, 배경은 250/255 기준 미색 종이 톤
  float v = 0.980 - mag * 0.92;
  vec3 paper = vec3(
    max(0.078, v),
    max(0.070, v - 0.008),
    max(0.055, v - 0.039)
  );
  outColor = vec4(paper, 1.0);
}
