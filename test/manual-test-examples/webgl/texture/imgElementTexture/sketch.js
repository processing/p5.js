var im;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  im = createImg('../../UV_Grid_Sm.jpg');
}

function draw(){
  background(255);

  var halfw = im.width / 2 * .5;
  var halfh = im.height / 2 * .5;

  texture(im);
  for (var x = -width/2 + halfw;  x <= width/2 - halfw; x+= halfw * 2) {
    for (var y = -height/2 + halfh;  y <= height/2 - halfh; y+= halfh * 2) {
      push();
      translate(x, y);
      rotateZ(frameCount * 0.01);
      beginShape(TRIANGLES);
      vertex(-halfw, -halfh, 0, 0, 0);
      vertex( halfw, -halfh, 0, 1, 0);
      vertex( halfw,  halfh, 0, 1, 1);
      vertex( halfw,  halfh, 0, 1, 1);
      vertex(-halfw,  halfh, 0, 0, 1);
      vertex(-halfw, -halfh, 0, 0, 0);
      endShape();
      pop();
    }
  }
}
