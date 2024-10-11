let video;

function setup() {
  createCanvas(640, 480, WEBGL);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
}

function draw() {
  translate(-width / 2, -height / 2);
  image(video, 0, 0);
}