var img;
var tex;
var filterShader;
var filterNearest = true;

var vertexShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}`;

var fragmentShader = `
precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTex0;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 tex = texture2D(uTex0, uv);

  gl_FragColor = tex;
}`;

function preload() {
  img = loadImage('../../assets/cat.jpg');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  filterShader = createShader(vertexShader, fragmentShader);

  tex = canvas.getTexture(img);
  tex.setInterpolation(NEAREST, NEAREST);
}

function draw() {
  background(255);

  shader(filterShader);

  filterShader.setUniform('uTex0', img);
  rect(0, 0, width, height);
}

function keyPressed() {
  filterNearest = !filterNearest;

  if (filterNearest) {
    tex.setInterpolation(NEAREST, NEAREST);
  } else {
    tex.setInterpolation(LINEAR, LINEAR);
  }
}
