precision mediump float;

varying vec3 vBC;
varying lowp vec4 vColor;

void main(){
  gl_FragColor = vColor;
  if(any(lessThan(vBC, vec3(0.03)))){
    gl_FragColor.a = 1.0;
  } else {
    gl_FragColor.a =  0.0;
  }
}