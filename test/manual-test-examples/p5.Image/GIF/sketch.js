let img;

function preload() {
  img0 = loadImage('./assets/counting-gif@endlessLoop-1secDelay.gif');
  img1 = loadImage('./assets/counting-gif@1xLoop-0.2secDelay.gif');
  img2 = loadImage('./assets/giphy.gif');
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  // frameRate(0.5);
}

function draw() {
  // put drawing code here
  background(100, 0, 200);
  image(img0, mouseX + 50, mouseY);
  image(img1, mouseX - 50, mouseY);
  image(img2, mouseX - img2.width / 2, mouseY + 100);
  // if(img.globalDebugImage)
  // {
  //   image(img.globalDebugImage, 0, 0);
  // }
}

function mousePressed() {
  img0.pause();
}

function mouseReleased() {
  img0.play();
}
