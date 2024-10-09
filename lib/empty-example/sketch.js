let video;
function setup() {
  createCanvas(640, 480, WEBGL);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
}

function draw() {
  translate(-width / 2, -height / 2);
  scale(-1, 1); //added scale for horizontal flip
  image(video, -width, 0); //here used -width that shifts the video back into view from the opposite side
}
