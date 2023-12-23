precision mediump int;

uniform vec4 uMaterialColor;
uniform int uStrokeCap;
uniform int uStrokeJoin;
uniform float uStrokeWeight;

IN vec4 vColor;
IN vec2 vTangent;
IN vec2 vCenter;
IN vec2 vPosition;
IN float vMaxDist;
IN float vCap;
IN float vJoin;

float distSquared(vec2 a, vec2 b) {
  vec2 aToB = b - a;
  return dot(aToB, aToB);
}

void main() {
  if (vCap > 0.) {
    if (
      uStrokeCap == STROKE_CAP_ROUND &&
      distSquared(vPosition, vCenter) > uStrokeWeight * uStrokeWeight * 0.25
    ) {
      discard;
    } else if (
      uStrokeCap == STROKE_CAP_SQUARE &&
      dot(vPosition - vCenter, vTangent) > 0.
    ) {
      discard;
    }
    // Use full area for PROJECT
  } else if (vJoin > 0.) {
    if (
      uStrokeJoin == STROKE_JOIN_ROUND &&
      distSquared(vPosition, vCenter) > uStrokeWeight * uStrokeWeight * 0.25
    ) {
      discard;
    } else if (uStrokeJoin == STROKE_JOIN_BEVEL) {
      vec2 normal = vec2(-vTangent.y, vTangent.x);
      if (abs(dot(vPosition - vCenter, normal)) > vMaxDist) {
        discard;
      }
    }
    // Use full area for MITER
  }
  OUT_COLOR = vec4(vColor.rgb, 1.) * vColor.a;
}
