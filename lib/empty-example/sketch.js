function setup() {
  createCanvas(300, 200);
  background(240);

  textSize(32);
  textAlign(CENTER,CENTER);
  textFont('Georgia');

  let txt = "Hello, \nWorld!";
  // Compute the bounding box based on the font's intrinsic metrics
  let bounds = fontBounds(txt, 50, 50);

  fill(0);
  text(txt, 50, 50);

  noFill();
  stroke('green');
  rect(bounds.x, bounds.y, bounds.w, bounds.h);

  noStroke();
  fill(50);
  textSize(15);
  text("Font Bounds: x=" + bounds.x.toFixed(1) + ", y=" + bounds.y.toFixed(1) +
       ", w=" + bounds.w.toFixed(1) + ", h=" + bounds.h.toFixed(1), 78, 100);
}