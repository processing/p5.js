let g;

function setup() {
  createCanvas(400, 400);
  
  g = createGraphics(200, 200);
}

function draw() {
  g.background(0);
  g.stroke(255, 0, 0);
  g.strokeWeight(5);
  g.noFill();
  g.bezier(0, 0, 100, 0, 0, 100, 200, 200);
  //Comment out this line and for some reason the bezier gets drawn (to the canvas instead of the graphics object)
  image(g, 0, 0, 400, 400);
}
