
var mic;
var amplitude, volume;

function setup() {
  mic = new AudioIn();
  amplitude = new Amplitude();
  mic.on();
  mic.connect(amplitude);
}

function draw() {
  background(0);
  volume = amplitude.process();
  ellipse(width/2,height/2, 100*volume + 10, 100*volume + 10);
}

