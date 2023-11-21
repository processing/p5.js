function setup() {
  let fragSrc = `precision highp float;
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }`;

  createCanvas(100, 100);
  let s = createFilterShader(fragSrc);
  filter(s);
  describe('a yellow canvas');
}