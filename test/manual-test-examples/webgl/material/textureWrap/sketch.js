var img;
var tex;
var wrapShader;
var wrapMode = 0;

var vertexShader = `
attribute vec3 aPosition;


void main() {

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}`;

var fragmentShader = `
precision mediump float;

uniform sampler2D uTex0;
uniform vec2 uTexResolution;
uniform vec2 uWindowSize;

void main() {

  // center the image in the screen coordinates
  vec2 windowCoord = gl_FragCoord.xy - uWindowSize / 2.0 + uTexResolution / 2.0;

  vec2 uv = windowCoord / uTexResolution;
  uv.y = 1.0 - uv.y;

  gl_FragColor = texture2D(uTex0, uv);
}`;

function preload() {
  img = loadImage('../../assets/UV_Grid_Sm.jpg');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  wrapShader = createShader(vertexShader, fragmentShader);
}

function draw() {
  background(255);

  shader(wrapShader);
  wrapShader.setUniform('uTex0', img);
  wrapShader.setUniform('uTexResolution', [img.width, img.height]);
  wrapShader.setUniform('uWindowSize', [width, height]);

  rect(0, 0, width, height);
}

function keyPressed() {
  wrapMode = (wrapMode + 1) % 4;

  if (wrapMode === 0) {
    textureWrap(CLAMP);
  } else if (wrapMode === 1) {
    textureWrap(MIRROR);
  } else if (wrapMode === 2) {
    textureWrap(REPEAT);
  } else if (wrapMode === 3) {
    textureWrap(CLAMP, MIRROR);
  }
}
