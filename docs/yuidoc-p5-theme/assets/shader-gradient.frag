// Code adopted from "Creating a Gradient Color in Fragment Shader"
// by Bahadır on stackoverflow.com
// https://stackoverflow.com/questions/47376499/creating-a-gradient-color-in-fragment-shader


precision highp float; varying vec2 vPos;
uniform vec2 offset;
uniform vec3 colorCenter;
uniform vec3 colorBackground;

void main() {

  vec2 st = vPos.xy + offset.xy;

  // color1 = vec3(1.0,0.55,0);
  // color2 = vec3(0.226,0.000,0.615);

  float mixValue = distance(st,vec2(0,1));
  vec3 color = mix(colorCenter,colorBackground,mixValue);

  gl_FragColor = vec4(color,mixValue);
}