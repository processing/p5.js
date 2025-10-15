function setup() {
  createCanvas(400, 400);
}

let x = 200;
let y = 200;
function draw() {
  if (document.pointerLockElement === null){
    background(220);
  } else{
    background(200,0,200);
  }

  text(movedX, 20, 20);
  text(movedY, 20, 40);
  text(mouseX, 50, 20);
  text(mouseY, 50, 40);
  circle(mouseX, mouseY, 30);

  //https://editor.p5js.org/SableRaf/sketches/zAXl3tNm5
  if(mouseIsPressed){
    x += movedX;
    y += movedY;
  }

  circle(x, y, 50);

}
function keyPressed() {
  requestPointerLock();
}