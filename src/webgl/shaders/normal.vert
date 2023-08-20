attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform vec4 uMaterialColor;
uniform bool uUseVertexColor;

varying vec3 vVertexNormal;
varying highp vec2 vVertTexCoord;
varying vec4 vColor;

void main(void) {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vVertexNormal = normalize(vec3( uNormalMatrix * aNormal ));
  vVertTexCoord = aTexCoord;
  vColor = (uUseVertexColor ? aVertexColor : uMaterialColor);
}
