/**
 * webgl wireframe example
 *
 */
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);
  for(var i = -20; i < 20; i++){
    push();
    stroke(0,200,0);
    noFill();
    translate(i*140, -200, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40, 40, 40);
    pop();

    push();
    stroke(0,200,0);
    noFill();
    translate(i*140, -100, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40, 40, 40);
    pop();

    push();
    fill(0,0,200);
    translate(i*140, 200, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40, 40, 40);
    pop();

    push();
    fill(0,0,200);
    translate(i*140, 100, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40, 40, 40);
    pop();
  }
}
