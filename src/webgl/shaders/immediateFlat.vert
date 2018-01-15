precision mediump float;

// vertex attributes
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// material properties

attribute vec4 aMaterialColor;

// matrices
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

//varying vec3 vVertexNormal;
varying highp vec2 vVertTexCoord;
varying vec4 vVertexColor;
varying vec3 vDiffuseLight;
varying vec4 vMaterialColor;

void main(void){

  vec4 positionVec4 = vec4(aPosition, 1.0);
  vec4 viewModelPosition = uModelViewMatrix * positionVec4;

  // fragment variables:

  gl_Position = uProjectionMatrix * viewModelPosition;

  vVertTexCoord = aTexCoord;
  vDiffuseLight = vec3(1.0);
  vMaterialColor = aMaterialColor;
  vVertexColor = vec4(0.0);
}
