/**
 * webgl texture example
 */
var img;
var debug = false;
/*
function preload(){
  //load our image
  img = loadImage("assets/cat.jpg");
}
*/

function setup(){
  if(!debug){
    createCanvas(windowWidth, windowHeight, 'webgl');    
  } else {
    createCanvas(windowWidth,windowHeight);
  }
}

var theta = 0;

function draw(){
  background(255, 255, 255, 255);

if(!debug){
  translate(0, 0, -200);
  // pass image as texture
  // texture(img);

  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  basicMaterial(250, 0, 0);
  box(40);
  pop();
  
  theta += 0.05;
} else {
  image(img, width/2, height/2);
}
}