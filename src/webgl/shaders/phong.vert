precision highp int;

#define HOOK_DEFINES

IN vec3 aPosition;
IN vec3 aNormal;
IN vec2 aTexCoord;
IN vec4 aVertexColor;

uniform vec3 uAmbientColor[5];

#ifdef AUGMENTED_HOOK_getWorldInputs
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat3 uModelNormalMatrix;
uniform mat3 uCameraNormalMatrix;
#else
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;
#endif
uniform mat4 uProjectionMatrix;
uniform int uAmbientLightCount;

uniform bool uUseVertexColor;
uniform vec4 uMaterialColor;

OUT vec3 vNormal;
OUT vec2 vTexCoord;
OUT vec3 vViewPosition;
OUT vec3 vAmbientColor;
OUT vec4 vColor;

struct Vertex {
  vec3 position;
  vec3 normal;
  vec2 texCoord;
  vec4 color;
};

void main(void) {
  HOOK_beforeVertex();

  Vertex inputs;
  inputs.position = aPosition;
  inputs.normal = aNormal;
  inputs.texCoord = aTexCoord;
  inputs.color = (uUseVertexColor && aVertexColor.x >= 0.0) ? aVertexColor : uMaterialColor;
#ifdef AUGMENTED_HOOK_getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
#endif

#ifdef AUGMENTED_HOOK_getWorldInputs
  inputs.position = (uModelMatrix * vec4(inputs.position, 1.)).xyz;
  inputs.normal = uModelNormalMatrix * inputs.normal;
  inputs = HOOK_getWorldInputs(inputs);
#endif

#ifdef AUGMENTED_HOOK_getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uViewMatrix * vec4(inputs.position, 1.)).xyz;
  inputs.normal = uCameraNormalMatrix * inputs.normal;
#else
  // Apply both at once
  inputs.position = (uModelViewMatrix * vec4(inputs.position, 1.)).xyz;
  inputs.normal = uNormalMatrix * inputs.normal;
#endif
#ifdef AUGMENTED_HOOK_getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
#endif

  // Pass varyings to fragment shader
  vViewPosition = inputs.position;
  vTexCoord = inputs.texCoord;
  vNormal = inputs.normal;
  vColor = inputs.color;

  // TODO: this should be a uniform
  vAmbientColor = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    if (i < uAmbientLightCount) {
      vAmbientColor += uAmbientColor[i];
    }
  }

  gl_Position = uProjectionMatrix * vec4(inputs.position, 1.);
  HOOK_afterVertex();
}
