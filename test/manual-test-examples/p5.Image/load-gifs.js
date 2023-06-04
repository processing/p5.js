// For issue https://github.com/processing/p5.js/issues/6164
p5.disableFriendlyErrors = true;

let gifStatic, gifAnimated;

function setup() {
  createCanvas(200, 100);
  gifStatic = loadImage('rockies.gif');
  gifAnimated = loadImage('arnott-wallace-eye-loop-forever.gif');
}

function draw () {
  image(gifStatic, 0, 0);
  image(gifAnimated, 100, 0);
}
