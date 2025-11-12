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

export const MARKER_CAPACITY = 128

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
uniform vec4 uMarkers[${MARKER_CAPACITY}];
uniform int uMarkerCount;
uniform vec3 uMarkerColor;
uniform vec3 uHubMarkerColor;

float horizontalDelta(float markerX, float cellX) {
  float diff = abs(markerX - cellX);
  return min(diff, 1.0 - diff);
}

float markerTypeAtCellCenterPx(vec2 cellCenterPx) {
  ivec2 cellIndex = ivec2(floor(cellCenterPx / uCell));
  for (int i = 0; i < ${MARKER_CAPACITY}; i++) {
    if (i >= uMarkerCount) {
      break;
    }
    vec4 marker = uMarkers[i];
    float periodX = uWorldSize.x * uZoom;
    float baseX = uPan.x + (marker.x * periodX);
    float nearestX =
      cellCenterPx.x + (mod(baseX - cellCenterPx.x + 0.5 * periodX, periodX) - 0.5 * periodX);
    float screenY = uPan.y + (marker.y * uWorldSize.y * uZoom);
    ivec2 markerIndex = ivec2(floor(vec2(nearestX, screenY) / uCell));
    if (markerIndex.x == cellIndex.x && markerIndex.y == cellIndex.y) {
      return marker.z;
    }
  }
  return 0.0;
}

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
  vec2 delta = abs(fragPx - center);
  if (delta.x > 0.5 * uSquare || delta.y > 0.5 * uSquare) {
    discard;
  }
  float markerType = markerTypeAtCellCenterPx(center);
  vec2 landUV = vec2(uv.x, 1.0 - uv.y);
  float seaCoverage = sampleCoverage(landUV, uQuality);
  float landCoverage = 1.0 - seaCoverage;
  if (markerType <= 0.5 && landCoverage < 0.5) {
    discard;
  }
  vec3 color = uLandColor;
  if (markerType > 1.5) {
    color = uHubMarkerColor;
  } else if (markerType > 0.5) {
    color = uMarkerColor;
  }
  outColor = vec4(color, 1.0);
}
`
