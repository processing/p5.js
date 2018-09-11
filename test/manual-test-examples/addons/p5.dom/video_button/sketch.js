let playing = false;
let fingers, button;

function setup() {
  fingers = createVideo('../fingers.mov');

  button = createButton('play');
  button.mousePressed(toggleVid);
}

function toggleVid() {
  if (playing) {
    fingers.pause();
    button.html('play');
  } else {
    fingers.loop();
    button.html('pause');
  }
  playing = !playing;
}
