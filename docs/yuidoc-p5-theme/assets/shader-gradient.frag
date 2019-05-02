// Code adopted from "Creating a Gradient Color in Fragment Shader"
// by Bahadır on stackoverflow.com
// https://stackoverflow.com/questions/47376499/creating-a-gradient-color-in-fragment-shader

precision highp float; varying vec2 vPos;
uniform float pos;

void main() {

  vec2 st = vPos.xy + vec2(0,pos);

  vec3 color1 = vec3(1.9,0.55,0);
  vec3 color2 = vec3(0.226,0.000,0.615);

  float mixValue = distance(st,vec2(0,1));
  vec3 color = mix(color1,color2,mixValue);

  gl_FragColor = vec4(color,mixValue);
}
