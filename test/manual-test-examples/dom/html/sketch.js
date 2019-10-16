let canvas;
let canvasContainer;

function setup() {
  canvasContainer = createDiv('<p>Canvas will be added to this container</p>');
  canvas = createCanvas(200, 200);
  canvas.parent(canvasContainer);
  ellipseMode(CENTER);
}

function draw() {
  background(0);
  translate(100, 100);
  let t = millis() / 500;
  circle(50 * sin(t), 50 * cos(t), 100);
}

function keyPressed() {
  //Calling html('something', 'true') on the
  //div containing the sketch shall **not** break the animation
  canvasContainer.html('<p>New line with p5.js html() function</p>', true);
}
