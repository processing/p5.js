let img0, img1;

let layer0, layer1;

function preload() {
  img0 = loadImage('./assets/counting-gif@endlessLoop-1secDelay.gif');
  img1 = loadImage('./assets/counting-gif@1xLoop-0.2secDelay.gif');
  // This link may break, but for now is useful for testing
  // abnormal timing, disposal, and loading from uri without .gif extension
  layer0 = loadImage('http://someone-spotify.herokuapp.com/gif');
  layer1 = loadImage('./assets/giphy.gif');
}

function setup() {
  createCanvas(500, 500);
  layer1.resize(100, 100);
}

function draw() {
  background(100, 0, 200);
  noTint();
  image(img0, 100, 100);
  image(img1, width - 100, 100);
  image(layer0, width - layer0.width - 10, height / 2 - 100);
  image(layer1, width / 2 - layer1.width / 2, 20);
}

function keyTyped() {
  if (key === 's') {
    img1.save('myGIF');
  } else if (key === 'r') {
    img1.reset();
  }
}

function mousePressed() {
  layer0.pause();
}

function mouseReleased() {
  layer0.play();
}
