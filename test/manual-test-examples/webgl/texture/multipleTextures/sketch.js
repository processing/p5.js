var im1, im2;

function preload() {
  im1 = loadImage('../../assets/UV_Grid_Sm.jpg');
  im2 = loadImage('../../assets/cat.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
}

function draw() {
  background(255);

  var halfw = im1.width / 2 * 0.5;
  var halfh = im1.height / 2 * 0.5;

  var i = 0;
  for (var x = -width / 2 + halfw; x <= width / 2 - halfw; x += halfw * 2) {
    for (var y = -height / 2 + halfh; y <= height / 2 - halfh; y += halfh * 2) {
      push();
      if (i % 2 === 0) {
        texture(im1);
      } else {
        texture(im2);
      }
      translate(x, y);
      rotateZ(frameCount * 0.01);
      beginShape(TRIANGLES);
      vertex(-halfw, -halfh, 0, 0, 0);
      vertex(halfw, -halfh, 0, 1, 0);
      vertex(halfw, halfh, 0, 1, 1);
      vertex(halfw, halfh, 0, 1, 1);
      vertex(-halfw, halfh, 0, 0, 1);
      vertex(-halfw, -halfh, 0, 0, 0);
      endShape();
      pop();
      i++;
    }
  }
}
