IN vec3 aPosition;
uniform float uPointSize;
OUT float vStrokeWeight;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
	vec4 positionVec4 =  vec4(aPosition, 1.0);
	gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
	gl_PointSize = uPointSize;
	vStrokeWeight = uPointSize;
}
