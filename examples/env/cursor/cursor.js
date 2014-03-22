function setup(){
  createCanvas(400,400);
  
  var r = color(255,0,0);
  var g = color(50,200,0);
  var b = color(0,0,255);
  var y = color(255,255,0);
  
  noStroke();
  background(b);
  
  fill(r);
  rect(0,0,200,200);
  fill(g);
  rect(200,0,200,200);
  fill(y);
  rect(0,200,200,200);
};

function draw() {
  if (mouseX < 200 && mouseY < 200) {
    //cursor("http://www.mariowiki.com/images/8/87/SMK_Banana.png");
    cursor("banana.png", 20, 5);
  } else if (mouseX > 200 && mouseY < 200) {
    cursor(CROSS);
  } else if (mouseX > 200 && mouseY > 200) {
    cursor(WAIT);
  } else {
    cursor(HAND);
  }
}