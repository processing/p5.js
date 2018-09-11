let playing = false;
let beat, pVol, pTime, button, volumeSlider;
let amp;

function setup() {
  createCanvas(100, 100);
  beat = createAudio(['../lucky_dragons.ogg', '../lucky_dragons.mp3']);

  button = createButton('play');
  button.mousePressed(toggleAudio);

  pVol = createP('Volume: ');
  volumeSlider = createSlider(0, 100, 50);

  pTime = createP('Current Time: ');

  amp = new p5.Amplitude();
  amp.setInput(beat);
}

function draw() {
  background(200);

  const volume = volumeSlider.value() / 100;
  beat.volume(volume);

  pVol.html('Volume: ' + volume);
  pTime.html('Current Time: ' + beat.time());

  const level = amp.getLevel();
  const siz = map(level, 0, 0.5, 10, 50);
  ellipse(width / 2, height / 2, siz, siz);
}

function toggleAudio() {
  if (playing) {
    beat.pause();
    button.html('play');
  } else {
    beat.play();
    button.html('pause');
  }
  playing = !playing;
}
