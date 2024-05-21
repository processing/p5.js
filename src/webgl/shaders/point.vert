IN vec3 aPosition;
uniform float uPointSize;
OUT float vStrokeWeight;
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
  HOOK_afterVertex();
}
