var toonShader;

function preload() {
  toonShader = loadShader('vert.glsl', 'frag.glsl');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  shader(toonShader);
  toonShader.setUniform('fraction', 1.0);
}

function draw() {
  background(0);
  var dirY = (mouseY / height - 0.5) * 2;
  var dirX = (mouseX / width - 0.5) * 2;
  directionalLight(255, 204, 204, -dirX, -dirY, -1);
  ambientMaterial(0, 255, 255);
  sphere(120);
}
