let multiTexShader, toonShader;
let img;
let fingers;
let playing = false;

function preload() {
  multiTexShader = loadShader(
    './videoMultiTextureShader/vert.glsl',
    './videoMultiTextureShader/frag.glsl'
  );
  toonShader = loadShader('./toonShader/vert.glsl', './toonShader/frag.glsl');

  img = loadImage('../assets/UV_Grid_Sm.jpg');
  fingers = createVideo(
    '../../../../docs/yuidoc-p5-theme/assets/fingers.mov',
    function() {
      fingers.hide();
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  shader(toonShader);
  toonShader.setUniform('fraction', 1.0);
  shader(multiTexShader);
  multiTexShader.setUniform('uSampler', fingers);
  multiTexShader.setUniform('uSecondSampler', img);
}

function draw() {
  background(0);
  multiTexShader.setUniform('uRed', map(mouseX, 0, width, 0.0, 1.0));
  multiTexShader.setUniform('uGreen', map(mouseY, 0, height, 0.0, 1.0));

  shader(multiTexShader);
  push();
  translate(-width / 4, 0);
  rotateZ(PI / 6);
  rotateY(frameCount * 0.01);
  box(100);
  pop();

  resetShader();
  noStroke();
  push();
  directionalLight(255, 204, 204, 0.5, 0, -1);
  ambientMaterial(0, 255, 255);
  sphere(100);
  pop();

  shader(toonShader);
  push();
  let dirY = (mouseY / height - 0.5) * 2;
  let dirX = map(mouseX, 0, width, 3, 0);
  directionalLight(255, 204, 204, dirX, -dirY, -1);
  ambientMaterial(0, 255, 255);
  translate(width / 4, 0);
  sphere(100);
  pop();
}

function keyPressed() {
  playing = !playing;
  if (playing) {
    fingers.loop();
  } else {
    fingers.pause();
  }
}
