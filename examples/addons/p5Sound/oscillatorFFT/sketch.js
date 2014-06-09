/**
 * Example: change the frequency of an oscillator and visualize the frequency spectrum
 */
var freqSlider, freqLabel, button;

var osc;
var startFreq = 220;
var fft;

var oscOn = false;

function setup() {
  createCanvas(800,400);
  background(30);
  stroke(255);
  strokeWeight(10);

  freqLabel = createP('Frequency: ');
  freqSlider = createSlider(1, 700, startFreq);
  button = createButton('start');
  button.mousePressed(toggleOsc);

  osc = new Oscillator(startFreq, 'sawtooth');

  p = createP('Current Waveform: ' + osc.getType());
  // these buttons will change the osc's waveform
  sine = createButton('sine');
  sine.mousePressed(setSine);
  saw = createButton('sawtooth');
  saw.mousePressed(setSawtooth);
  tri = createButton('triangle');
  tri.mousePressed(setTriangle);
  sq = createButton('square');
  sq.mousePressed(setSquare);

  // create an fft to analyze the audio
  fft = new FFT();
}

function draw() {
  background(0);
  var freq = freqSlider.value();
  osc.setFrequency(freq);

  freqLabel.html('Frequency: ' + freq);
  p.html('Current Waveform: ' + osc.getType());

  // process the waveform
  waveform = fft.processWaveform();

  // draw the shape of the waveform
  beginShape();
  for (var i = 0; i<waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], 0, 256, -height/2, height/2);
    vertex(x, y + height/2);
  }
  endShape();
}

function toggleOsc() {
  if (oscOn) {
    osc.stop();
    button.html('start');
  } else {
    osc.start();
    button.html('stop');
  }
  oscOn = !oscOn;
}

function setSine() {
  osc.setType('sine');
}

function setTriangle() {
  osc.setType('triangle');
}

function setSawtooth() {
  osc.setType('sawtooth');
}

function setSquare() {
  osc.setType('square');
}
