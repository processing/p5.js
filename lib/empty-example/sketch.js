function setup() {
  createCanvas(300, 300, WEBGL);
  describe('A sphere with red stroke and a red, wavy line on a gray background.');
}

function draw() {
  background(128);
  strokeMode(SIMPLE);
  
  // Draw sphere
  push();
  strokeWeight(1);
  translate(0, -50, 0);
  sphere(50);
  pop();
  orbitControl()

  // Draw modified wavy red line
  noFill();
  strokeWeight(15);
  stroke('red');
  // vertex(-150, 100);
  beginShape();
  bezierOrder(2);
  bezierVertex(80, 80);
  bezierVertex(50, -40);
  bezierVertex(-80, 80);
  endShape();
}
