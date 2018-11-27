function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(255);

  rotateY(frameCount * 0.01);

  var gap = 200;
  var w = 100;
  var h = 100;

  for (var i = -2; i < 3; i++) {
    for (var j = -2; j < 3; j++) {
      fill(i * 40, j * 40, 0);
      quad(
        i * gap,
        j * gap,
        i * gap,
        j * gap + h,
        i * gap + w,
        j * gap + h,
        i * gap + w,
        j * gap
      );
    }
  }
}
