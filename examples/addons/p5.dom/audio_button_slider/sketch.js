var playing = false;
var beat, pVol, pTime, button, volumeSlider;

function setup() {
  createCanvas(0,0);
  beat = createAudio('lucky_dragons_-_power_melody.wav', 'lucky_dragons_-_power_melody.mp3');
  beat.loop();

  button = createButton('play');
  button.mousePressed(toggleAudio);

  pVol = createP('Volume: ');
  volumeSlider = createSlider(0, 100, 50);

  pTime = createP('Current Time: ');

}

function draw() {
  var volume = volumeSlider.value()/100;
  beat.volume(volume);

  pVol.html('Volume: ' + volume);
  pTime.html('Current Time: ' + beat.currentTime());

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
