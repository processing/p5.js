varying vec3 vBC;
varying lowp vec4 vColor;

attribute vec3 aPosition;
attribute vec3 aBarycentric;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

uniform vec4 uMaterialColor;

void main() {
vColor = uMaterialColor;
vBC = aBarycentric;
gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}