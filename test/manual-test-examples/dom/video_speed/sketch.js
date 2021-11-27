var playing = false;
var fingers, playbutton, slowButton, normalButton, fastButton;

function setup() {
  fingers = createVideo('../fingers.mov');

  playButton = createButton('Play');
  playButton.mousePressed(toggleVid);
  slowButton = createButton('slow (x0.5)');
  slowButton.mousePressed(slowSpeed);
  normalButton = createButton('normal (x1)');
  normalButton.mousePressed(normalSpeed);
  fastButton = createButton('Fast (x2)');
  fastButton.mousePressed(fastSpeed);
}

function toggleVid() {
  if (playing) {
    fingers.pause();
    playButton.html('play');
  } else {
    fingers.loop();
    playButton.html('pause');
  }
  playing = !playing;
}

function fastSpeed() {
  fingers.speed(2);
}

function normalSpeed() {
  fingers.speed(1);
}

function slowSpeed() {
  fingers.speed(0.5);
}
