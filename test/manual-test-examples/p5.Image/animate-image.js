var runningCat;
var savanna;

function preload() {
  savanna = loadImage('african-savanna.png');
  runningCat = loadImage('running-cat.png');
}

function setup() {
  frameRate(15);
  createCanvas(800, 800);
}

var sX = 0,
  sY = 0;

function draw() {
  clear();
  image(savanna, 0, 0);

  // Animate running cat
  //image(source,canvasX,canvasY,canvasWidth,canvasHeight,sourceX,sourceY,sourceWidth,sourceHeight);
  image(runningCat, 0, 0, 300, 150, sX, sY, 300, 150);
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
