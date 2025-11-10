export const fullscreenVert = /* GLSL */ `#version 300 es
precision highp float;

const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);

void main() {
  gl_Position = vec4(POSITIONS[gl_VertexID], 0.0, 1.0);
}
`

export const dotsFrag = /* GLSL */ `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 uRes;
uniform vec2 uWorldSize;
uniform vec2 uPan;
uniform float uZoom;
uniform float uCell;
uniform float uSquare;
uniform sampler2D uLand;
uniform int uQuality;
uniform vec3 uLandColor;

float sampleCoverage(vec2 uv, int quality) {
  ivec2 texSize = textureSize(uLand, 0);
  vec2 texel = 1.0 / vec2(texSize);
  float coverage = 0.0;
  if (quality <= 1) {
    return texture(uLand, uv).r;
  }
  if (quality == 4) {
    for (int y = 0; y < 2; y++) {
      for (int x = 0; x < 2; x++) {
        vec2 offset = (vec2(float(x), float(y)) - 0.5) * texel;
        coverage += texture(uLand, uv + offset).r;
      }
    }
    return coverage * 0.25;
  }
  for (int y = 0; y < 4; y++) {
    for (int x = 0; x < 4; x++) {
      vec2 offset = (vec2(float(x), float(y)) - 1.5) * texel;
      coverage += texture(uLand, uv + offset).r;
    }
  }
  return coverage * 0.0625;
}

void main() {
  vec2 fragPx = gl_FragCoord.xy;
  vec2 cell = floor(fragPx / uCell) * uCell;
  vec2 center = cell + vec2(0.5 * uCell);
  vec2 uv = (center / uWorldSize) / uZoom - (uPan / (uWorldSize * uZoom));
  uv.x = fract(uv.x);
  if (uv.y < 0.0 || uv.y > 1.0) {
    discard;
  }
  vec2 landUV = vec2(uv.x, 1.0 - uv.y);
  float seaCoverage = sampleCoverage(landUV, uQuality);
  float landCoverage = 1.0 - seaCoverage;
  if (landCoverage < 0.5) {
    discard;
  }
  vec2 delta = abs(fragPx - center);
  if (delta.x > 0.5 * uSquare || delta.y > 0.5 * uSquare) {
    discard;
  }
  outColor = vec4(uLandColor, 1.0);
}
`

export const markersVert = /* GLSL */ `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCenterPx;
layout(location = 1) in float aSizePx;
layout(location = 2) in vec4 aColor;

uniform vec2 uRes;

out vec4 vColor;

vec2 quadCorner(int vertexId) {
  return vec2(float(vertexId & 1), float((vertexId >> 1) & 1));
}

void main() {
  vec2 corner = quadCorner(gl_VertexID);
  vec2 offset = (corner - 0.5) * aSizePx;
  vec2 px = aCenterPx + offset;
  vec2 ndc = vec2(
    (px.x / uRes.x) * 2.0 - 1.0,
    1.0 - (px.y / uRes.y) * 2.0
  );
  gl_Position = vec4(ndc, 0.0, 1.0);
  vColor = aColor;
}
`

export const markersFrag = `#version 300 es
precision mediump float;

in vec4 vColor;
out vec4 outColor;

void main() {
  outColor = vColor;
}
`
