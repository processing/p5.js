var r, g, b, y;

function preload() {
  loadJSON('http://api.openweathermap.org/data/2.5/weather?q=London,uk', null);
}

function setup(){
  createCanvas(400,400);

  r = color(255,0,0);
  g = color(50,200,0);
  b = color(0,0,255);
  y = color(255,255,0);
};

function draw() {
  noStroke();
  background(b);
  fill(r);
  rect(0,0,200,200);
  fill(g);
  rect(200,0,200,200);
  fill(y);
  rect(0,200,200,200);

  if (mouseX < 200 && mouseY < 200) {
    cursor("banana.png", 0, 60);
    ellipse(mouseX, mouseY, 5, 5);
  } else if (mouseX > 200 && mouseY < 200) {
    cursor(CROSS);
  } else if (mouseX > 200 && mouseY > 200) {
    cursor(WAIT);
  } else if (mouseX < 200 && mouseY > 200) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}
