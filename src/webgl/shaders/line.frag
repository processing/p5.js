precision highp int;
precision highp float;

uniform vec4 uMaterialColor;
uniform int uStrokeCap;
uniform int uStrokeJoin;

IN vec4 vColor;
IN vec2 vTangent;
IN vec2 vCenter;
IN vec2 vPosition;
IN float vStrokeWeight;
IN float vMaxDist;
IN float vCap;
IN float vJoin;

float distSquared(vec2 a, vec2 b) {
  vec2 aToB = b - a;
  return dot(aToB, aToB);
}

struct Inputs {
  vec4 color;
  vec2 tangent;
  vec2 center;
  vec2 position;
  float strokeWeight;
};

void main() {
  HOOK_beforeFragment();

  Inputs inputs;
  inputs.color = vColor;
  inputs.tangent = vTangent;
  inputs.center = vCenter;
  inputs.position = vPosition;
  inputs.strokeWeight = vStrokeWeight;
  inputs = HOOK_getPixelInputs(inputs);

  if (vCap > 0.) {
    if (
      uStrokeCap == STROKE_CAP_ROUND &&
      HOOK_shouldDiscard(distSquared(inputs.position, inputs.center) > inputs.strokeWeight * inputs.strokeWeight * 0.25)
    ) {
      discard;
    } else if (
      uStrokeCap == STROKE_CAP_SQUARE &&
      HOOK_shouldDiscard(dot(inputs.position - inputs.center, inputs.tangent) > 0.)
    ) {
      discard;
    // Use full area for PROJECT
    } else if (HOOK_shouldDiscard(false)) {
      discard;
    }
  } else if (vJoin > 0.) {
    if (
      uStrokeJoin == STROKE_JOIN_ROUND &&
      HOOK_shouldDiscard(distSquared(inputs.position, inputs.center) > inputs.strokeWeight * inputs.strokeWeight * 0.25)
    ) {
      discard;
    } else if (uStrokeJoin == STROKE_JOIN_BEVEL) {
      vec2 normal = vec2(-inputs.tangent.y, inputs.tangent.x);
      if (HOOK_shouldDiscard(abs(dot(inputs.position - inputs.center, normal)) > vMaxDist)) {
        discard;
      }
    // Use full area for MITER
    } else if (HOOK_shouldDiscard(false)) {
      discard;
    }
  }
  OUT_COLOR = HOOK_getFinalColor(vec4(inputs.color.rgb, 1.) * inputs.color.a);
  HOOK_afterFragment();
}
