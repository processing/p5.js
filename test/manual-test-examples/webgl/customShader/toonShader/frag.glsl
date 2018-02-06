#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

float fraction = 1.0;

varying vec4 vertColor;
varying vec3 vertNormal;
varying vec3 vertLightDir;
//varying highp vec2 vertTexCoord;

void main() {
  float intensity = dot(vertLightDir, vertNormal);
  float shade;
  if (intensity > pow(0.95, fraction)) {
    shade = 1.0;
  } else if (intensity > pow(0.5, fraction)) {
    shade = 0.6;
  } else if (intensity > pow(0.25, fraction)) {
    shade = 0.4;
  } else {
    shade = 0.2;
  }

  gl_FragColor = vertColor;
  gl_FragColor.rgb *= shade;

  gl_FragColor.a = 1.0;
}