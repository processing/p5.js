let sh, img, img2;
let fingers;

function preload() {
  sh = loadShader('vert.glsl', 'frag.glsl');
  img = loadImage('../../assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fingers = createVideo('../../../addons/p5.dom/fingers.mov');
  fingers.hide();
  fingers.loop();
  //img2 = loadImage('../assets/cat.jpg');
  shader(sh);
  sh.setUniform('uSampler', fingers);
  sh.setUniform('uSecondSampler', img);
}

function draw() {
  sh.setUniform('uRed', map(mouseX, 0, width, 0.0, 1.0));
  sh.setUniform('uGreen', map(mouseY, 0, height, 0.0, 1.0));

  background(0);

  const halfw = fingers.width / 2 * 0.5;
  const halfh = fingers.height / 2 * 0.5;

  for (let x = -width / 2 + halfw; x <= width / 2 - halfw; x += halfw * 2) {
    for (let y = -height / 2 + halfh; y <= height / 2 - halfh; y += halfh * 2) {
      push();
      translate(x, y);
      rotateZ(PI / 6);
      rotateY(frameCount * 0.01);
      box(halfw, halfh);
      pop();
    }
  }
}
