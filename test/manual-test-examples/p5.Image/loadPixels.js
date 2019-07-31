p5.disableFriendlyErrors = true;

var img;
function preload() {
  img = createVideo('../dom/fingers.mov');
  img.hide();
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
  rectMode(CENTER);
}

function draw() {
  translate((width - img.width) / 2, (height - img.height) / 2);

  img.loadPixels();

  for (var i = 0; i < 3000; i++) {
    var px = random(img.width);
    var py = random(img.height);

    fill(img.get(px, py));
    ellipse(px, py, 3, 3);
  }
}

function mouseClicked() {
  img.loop();
}
