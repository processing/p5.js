uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec4 uViewport;

uniform float uStrokeWeight;

attribute vec4 aPosition;
attribute vec4 aDirection;


vec3 clipToWindow(vec4 clip, vec4 viewport) {
  vec3 post_div = clip.xyz / clip.w;
  vec2 xypos = (post_div.xy + vec2(1.0, 1.0)) * 0.5 * viewport.zw;
  return vec3(xypos, post_div.z * 0.5 + 0.5);
}

vec4 windowToClipVector(vec2 window, vec4 viewport, float clip_w) {
  vec2 xypos = (window / viewport.zw) * 2.0;
  return vec4(xypos, 0.0, 0.0) * clip_w;
}

void main() {
  vec4 posMV = uModelViewMatrix * aPosition;
  posMV.xyz = posMV.xyz * vec3(0.999,0.999,0.999);
  vec4 clipp = uProjectionMatrix * posMV;
  float displace = aDirection.w;

  vec4 posq = uModelViewMatrix * vec4(aDirection.xyz, 0.0);
  posq.xyz = posq.xyz * vec3(0.999,0.999,0.999);
  vec4 clipq = uProjectionMatrix * posq;
  clipq.w = 1.0;

  vec3 window_p = clipToWindow(clipp, uViewport);
  vec3 window_q = clipToWindow(clipq, uViewport);
  vec3 tangent = window_q - window_p;
  vec2 perp = normalize(vec2(-tangent.y, tangent.x));
  float halfStroke = uStrokeWeight/2.0;
  vec2 offset = vec2(halfStroke,halfStroke) * displace * perp;
  gl_Position.xy = clipp.xy + offset.xy;
  gl_Position.zw = clipp.zw;
}
