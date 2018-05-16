precision mediump float;

// vertex attributes
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// material properties

attribute vec4 aMaterialColor;

// matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseLight;
varying vec4 vMaterialColor;
varying vec4 vVertexColor;

void main(void) {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

  vVertTexCoord = aTexCoord;
  vDiffuseLight = vec3(1.0);
  vMaterialColor = aMaterialColor;
  vVertexColor = vec4(0.0);
}
