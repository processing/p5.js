var grid, cat, countingGif;

function preload() {
  grid = loadImage('../../assets/UV_Grid_Sm.jpg');
  cat = loadImage('../../assets/cat.jpg');
  countingGif = loadImage(
    '../../../p5.Image/GIF/assets/counting-gif@endlessLoop-1secDelay.gif'
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
}

function draw() {
  background(255);

  drawSquare(-width / 4, 0, 200, 200, grid);
  drawSquare(0, 0, 200, 200, countingGif);
  drawSquare(width / 4, 0, 200, 200, cat);
}

function drawSquare(x, y, w, h, tex) {
  push();
  texture(tex);
  var halfW = w / 2;
  var halfH = h / 2;
  translate(x, 0);
  rotateZ(frameCount * 0.01);
  beginShape(TRIANGLES);
  vertex(-halfW, -halfH, 0, 0, 0);
  vertex(halfW, -halfH, 0, 1, 0);
  vertex(halfW, halfH, 0, 1, 1);
  vertex(halfW, halfH, 0, 1, 1);
  vertex(-halfW, halfH, 0, 0, 1);
  vertex(-halfW, -halfH, 0, 0, 0);
  endShape();
  pop();
}
