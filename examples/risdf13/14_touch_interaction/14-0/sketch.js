// touch events are very similar to mouse events

var red = 0;

function setup() {
  createCanvas(1000, 1600); // set to fit a standard-ish smartphone
  noStroke();
  fill(255, 255, 255);
};

function draw() {
  background(red, 0, 255);
  rect(300, 200, 200, 600); // simulated button

  if((touchX > 300) && (touchX < 500) && (touchY > 200) && (touchY < 800)){ // if touch inside rectangle
    red = 255;
  } else {
    red = 0;
  }
};