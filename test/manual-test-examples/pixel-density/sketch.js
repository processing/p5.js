function setup() {
  // put setup code here
  createCanvas(100, 100);
  pg = createGraphics(100, 100);
  noLoop();
}

function draw() {
  // put drawing code here
  background(200);
  pg.background(100);
  pg.noStroke();
  pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
  image(pg, 50, 50);
  var d = pixelDensity(); // not used, but triggers issue #3175 
  image(pg, 0, 0, 50, 50);
}
