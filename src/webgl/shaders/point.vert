IN vec3 aPosition;
IN vec4 aVertexColor;
uniform float uPointSize;
uniform bool uUseVertexColor;
uniform vec4 uMaterialColor;
OUT float vStrokeWeight;
OUT vec4 vColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  HOOK_beforeVertex();
  vec4 viewModelPosition = vec4(HOOK_getWorldPosition(
    (uModelViewMatrix * vec4(HOOK_getLocalPosition(aPosition), 1.0)).xyz
  ), 1.);
  gl_Position = uProjectionMatrix * viewModelPosition;  

  float pointSize = HOOK_getPointSize(uPointSize);

	gl_PointSize = pointSize;
	vStrokeWeight = pointSize;

  // Choose per-vertex stroke color when available; otherwise use uniform stroke color
  vec4 baseColor = uUseVertexColor ? aVertexColor : uMaterialColor;
  vColor = HOOK_getVertexColor(baseColor);
  HOOK_afterVertex();
}
