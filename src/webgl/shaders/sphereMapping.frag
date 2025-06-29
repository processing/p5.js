#define PI 3.141592

precision highp float;
  
uniform sampler2D uEnvMap;
uniform mat3 uNewNormalMatrix;
uniform float uFovY;
uniform float uAspect;

varying vec2 vTexCoord;
  
void main() {
    float uFovX = uFovY * uAspect; 
    float angleY = mix(uFovY/2.0,  -uFovY/2.0, vTexCoord.y);
    float angleX = mix(uFovX/2.0, -uFovX/2.0, vTexCoord.x);
    vec3 rotatedNormal = vec3( angleX, angleY, 1.0 );
    rotatedNormal = uNewNormalMatrix * normalize(rotatedNormal);
    float temp = rotatedNormal.z;
    rotatedNormal.z = rotatedNormal.x;
    rotatedNormal.x = -temp;
    vec2 suv;
    suv.y = 0.5 + 0.5 * (-rotatedNormal.y);
    suv.x = atan(rotatedNormal.z, rotatedNormal.x) / (2.0 * PI) + 0.5;
    vec4 newTexColor = texture2D(uEnvMap, suv.xy);
    gl_FragColor = newTexColor;
}
