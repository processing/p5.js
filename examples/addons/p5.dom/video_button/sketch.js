var playing = false;
var fingers, button;


function setup() {
  fingers = createVideo('fingers.mov');
  fingers.loop();

  button = createButton('play');
  button.mousePressed(toggleVid);
}

function toggleVid() {
  if (playing) {
    fingers.pause();
    button.html('play');
  } else {
    fingers.play();
    button.html('pause');
  }
  playing = !playing;
}
