var img;
var sz = 100;

function preload() {
  img = loadImage('assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
}

function draw() {
  background(255);
  randomSeed(1);

  for (var i = 0; i < 200; i++) {
    push();

    translate(
      random(-width / 2 + sz, width / 2 - sz),
      random(-height / 2 + sz, height / 2 - sz)
    );
    rotateZ(random(0, 2 * PI) + frameCount * 0.1);

    if (i % 2 === 0) {
      texture(img);
    } else {
      fill(random(128, 255), 0, random(128, 255));
    }

    beginShape(TRIANGLES);
    vertex(-sz, -sz, 0, 0, 0);
    vertex(sz, -sz, 0, 1, 0);
    vertex(sz, sz, 0, 1, 1);
    vertex(sz, sz, 0, 1, 1);
    vertex(-sz, sz, 0, 0, 1);
    vertex(-sz, -sz, 0, 0, 0);
    endShape();
    pop();
  }
}

/* http://localhost:8000/test/manual-test-examples/webgl/immediateMode/texture/ */
