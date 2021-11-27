var img;
var playing = false;
var fingers, button;

function preload() {
  fingers = createVideo('../../../dom/fingers.mov', () => {
    fingers.hide();
    fingers.pause();
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
}

function draw() {
  background(255);

  var halfw = fingers.width / 2 * 0.5;
  var halfh = fingers.height / 2 * 0.5;

  for (var x = -width / 2 + halfw; x <= width / 2 - halfw; x += halfw * 2) {
    for (var y = -height / 2 + halfh; y <= height / 2 - halfh; y += halfh * 2) {
      texture(fingers);
      push();
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
    }
  }
}

function keyPressed() {
  if (playing) {
    fingers.pause();
  } else {
    fingers.loop();
  }
  playing = !playing;
}
