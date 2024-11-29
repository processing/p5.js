// Adapted from:  https://learnopengl.com/PBR/IBL/Diffuse-irradiance
layout (location = 0) IN vec3 aPosition;

OUT vec3 localPos;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main()
{
    localPos = aPosition;  
    gl_Position =  uProjectionMatrix * uModelViewMatrix * vec4(localPos, 1.0);
}
