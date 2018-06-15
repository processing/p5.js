attribute vec3 vPosition;
uniform float vPointSize;
varying float v_strokeWeight;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
	vec4 positionVec4 =  vec4(vPosition, 1.0);
	gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
	gl_PointSize = vPointSize;
	v_strokeWeight = vPointSize;
}