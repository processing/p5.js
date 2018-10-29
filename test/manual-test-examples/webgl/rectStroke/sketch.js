/**
 * WebGL rect() stroke test - you should see a border stroke, but no internal
 * face or diagonal stroke
 */

function setup() {
  createCanvas(500, 500, WEBGL);
}

function draw() {
  background(200);
  push();
  stroke(0);
  strokeWeight(3);
  rectMode(CENTER);
  fill(255);
  rect(0, 0, 200, 200, 12, 12);
  pop();
}
