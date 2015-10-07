var runningCat;
var savanna;

function setup() {
  frameRate(15);
  createCanvas(800, 800);

  savanna = loadImage('african-savanna.png');
  runningCat = loadImage('running-cat.png');
}

var sX = 0, sY = 0;

function draw() {
  clear();
  image(savanna);

  // Animate running cat
  image(runningCat, sX, sY, 300, 150, 170, 100, 300, 150);
  sX += 300;
  if (sX > 300) {
    sX = 0;
    sY += 150;
    if (sY === 600) {
      sY = 0;
    }
  }

  // Show full sprite sheet for reference
  image(runningCat, 0, 300, 300, 300);
}
