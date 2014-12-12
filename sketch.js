var x,y;

function setup() {
  // put setup code here
  createCanvas(600, 400);
  x = 0;
  y = 0;
}

function onDeviceMove(){
  if(accelerationX < 0){
    println("kek");	  
  }
}

function draw() {
  // put drawing code here
  background(0);
  fill(255);
  stroke(255);
  
  x = constrain((x+accelerationX), 0, width); 
  y = constrain((y-accelerationY), 0, height); 
  setMoveThreshold(0);
  println(accelerationZ);
  ellipse(x,y,50,50);
  //println(accelerationX - pAccelerationX);
}
