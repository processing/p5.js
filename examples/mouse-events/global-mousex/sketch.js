function setup() {
  createCanvas(200, 200);
  ellipseMode(CENTER);
}

function draw() {
  background(125);
  console.log('mx:'+mouseX+' my:'+mouseY+' wmx:'+winMouseX+' wmy:'+winMouseY);
  ellipse(mouseX, mouseY, 20, 20);
}