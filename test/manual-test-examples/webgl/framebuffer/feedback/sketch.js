let fboPrev, fboNext;
let canvas;

function setup() {
  canvas = createCanvas(400, 400, WEBGL);

  // Try changing `float` to `unsigned_byte` to see it leave a trail
  options = { format: FLOAT, antialias: true };
  fboPrev = createFramebuffer(options);
  fboNext = createFramebuffer(options);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  // Swap prev and next so that we can use the previous frame as a texture
  // when drawing the current frame
  [fboPrev, fboNext] = [fboNext, fboPrev];

  // Draw to the Framebuffer
  fboNext.draw(() => {
    clear();

    background(255);

    push();
    scale(1.003);
    image(fboPrev, 0, 0);
    pop();

    push();
    // Fade to white slowly. This will leave a permanent trail if you don't
    // use floating point textures.
    fill(255, 2);
    rect(0, 0, width, height);
    pop();

    push();
    // Clear the depth buffer so the cube doesn't intersect with the background
    // plane behind it
    drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT);
    normalMaterial();
    translate(100*sin(frameCount * 0.014), 100*sin(frameCount * 0.02), 0);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    box(50);
    pop();
  });

  clear();
  image(fboNext, 0, 0);
}
