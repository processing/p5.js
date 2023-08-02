function setup() {
  createCanvas(100, 100, WEBGL);

  let s = createShader(vert, frag);

  // check to see if frag shader changes color as intended
  // and that vertex shader preserves position, orientation, scale
  background('RED');
  circle(10,25,30);

  filter(s);

  // and that there's no side effects after filter()
  circle(-35,-35,30);
}

vert = `attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}`;

frag = `precision mediump float;
varying mediump vec2 vTexCoord;

uniform sampler2D tex0;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 sampledColor = texture2D(tex0, uv);
  float gray = luma(sampledColor.rgb);
  gl_FragColor = vec4(gray, gray, gray, 1);
}`;
