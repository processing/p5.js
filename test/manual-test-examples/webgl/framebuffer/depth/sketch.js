let fbo;

function setup() {
  createCanvas(640, 480, WEBGL);
  fbo = createFramebuffer({ antialias: true });
}

function draw() {
  fbo.begin();
  clear();
  rotateX(frameCount * 0.001);
  rotateZ(frameCount * 0.0013);
  for (let i = 0; i < 20; i++) {
    push();
    translate(
      200 * sin(i),
      200 * cos(i * 0.8),
      200 * sin(i * 1.2)
    );
    box(50);
    pop();
  }
  fbo.end();

  push();
  texture(fbo.depth);
  noStroke();
  plane(width, -height);
  pop();
}
