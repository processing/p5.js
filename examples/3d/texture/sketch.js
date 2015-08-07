/**
 * webgl texture example
 */
var img;
var theta = 0;

function preload(){
  //load our image
  img = loadImage("assets/cat.jpg");
}

function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(255, 255, 255, 255);
  translate(0, 0, -200);
  push();
    rotateZ(theta * mouseX * 0.001);
    rotateX(theta * mouseX * 0.001);
    rotateY(theta * mouseX * 0.001);
    // pass image as texture
    texture(img);
    box(40);
  pop();
  theta += 0.05;
}