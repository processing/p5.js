function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(255);
  translate(-width / 2, -height / 2, 0);
  rotateY(frameCount * 0.01);

  const gap = 200;
  const w = 100;
  const h = 100;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
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
