let img0, img1;

let layer0, layer1;

function preload() {
  // img0 = loadImage('./assets/counting-gif@endlessLoop-1secDelay.gif');
  // img1 = loadImage('./assets/counting-gif@1xLoop-0.2secDelay.gif');
  img1 = loadImage('./assets/giphy.gif');
  //   layer1 = loadImage('./assets/giphy.gif');
}

function setup() {
  // put setup code here
  createCanvas(500, 500);
  // layer1.delay(150);
  // frameRate(0.5);
}

function draw() {
  background(100, 0, 200);
  noTint();
  // image(img0, 100, 100);
  image(img1, width - 100, 100);
  // image(layer0, width - layer0.width - 10, height / 2 - 100);
  tint(255, 0, 0, 100);
  // image(layer1, 10, height / 2 - 100);
}

function keyTyped() {
  if (key === 's') {
    img1.save('myGIF');
  }
}

function mousePressed() {}

function mouseReleased() {}
