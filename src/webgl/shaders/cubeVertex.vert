// Adapted from:  https://learnopengl.com/PBR/IBL/Diffuse-irradiance
layout (location = 0) IN vec3 aPos;

OUT vec3 localPos;

uniform mat4 projection;
uniform mat4 view;

void main()
{
    localPos = aPos;  
    gl_Position =  projection * view * vec4(localPos, 1.0);
}
