var img;
var times = [];

function preload() {
  img = loadImage('flowers-large.jpg');
}

function setup() {
  createCanvas(800, 160);
}

function drawScaledImage(img, x, y) {
  push();
  translate(x, y);
  scale(0.125);
  image(img, 0, 0);
  pop();
}

function draw() {
  times.push(deltaTime);
  if (times.length > 60) {
    times.shift();
  }
  const avgDelta =
    times.reduce(function(acc, next) {
      return acc + next;
    }) / times.length;
  const avgRate = 1000 / avgDelta;

  clear();
  push();
  translate(50 * sin(millis() / 1000), 50 * cos(millis() / 1000));
  fill(255, 255, 255);
  rect(0, 0, 480, 160);
  drawScaledImage(img, 0, 0);
  tint(0, 0, 150, 150); // Tint alpha blue
  drawScaledImage(img, 160, 0);
  tint(255, 255, 255);
  drawScaledImage(img, 320, 0);
  tint(0, 153, 150); // Tint turquoise
  drawScaledImage(img, 480, 0);
  noTint();
  drawScaledImage(img, 640, 0);
  pop();

  push();
  textAlign(LEFT, TOP);
  textSize(20);
  noStroke();
  fill(0);
  text(avgRate.toFixed(2) + ' FPS', 10, 10);
  pop();
}
