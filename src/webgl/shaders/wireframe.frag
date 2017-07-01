  precision mediump float;
  precision mediump int;

  varying vec3 vBC;

  void main(){
    if(any(lessThan(vBC, vec3(0.02)))){
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    }
  }