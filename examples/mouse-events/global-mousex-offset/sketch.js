function setup() {
  var c = createCanvas(200, 200);
  c.position(100, 100);
}

function draw() {
  background(125);
  ellipse(mouseX, mouseY, 20, 20);
  console.log('mx:'+mouseX+' my:'+mouseY+' wmx:'+winMouseX+' wmy:'+winMouseY);
}