var im1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  im1 = createGraphics(400, 400);
  im1.background(0, 0, 0, 0);
  im1.strokeWeight(0.25);
  im1.colorMode(HSB);
  for (var i = 0; i < 10; i++) {
    drawLine(im1);
  }
}

function drawLine(im) {
  im.stroke((millis() / 40) % 255, 255, 255);
  var w = im.width;
  var h = im.height;
  var x1 = random(0, w);
  var y1 = random(0, h);

  var x2 = random(-w / 2, w * 3 / 2);
  var y2 = random(-h / 2, h * 3 / 2);

  im.line(x1, y1, x2, y2);
  if (x2 < 0) {
    im.line(x1 + w, y1, x2 + w, y2);
  } else if (x2 > w) {
    im.line(x1 - w, y1, x2 - w, y2);
  }

  if (y2 < 0) {
    im.line(x1, y1 + h, x2, y2 + h);
  } else if (y2 > h) {
    im.line(x1, y1 - h, x2, y2 - h);
  }
}

function draw() {
  drawLine(im1);

  background(0, 0, 0);
  fill(255, 255, 255);
  texture(im1);

  translate(0, 0, 100);
  rotateY(millis() / 1000);
  torus(100, 50);
}
