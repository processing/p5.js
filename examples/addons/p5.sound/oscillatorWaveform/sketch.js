/**
 * Example: change the frequency of an oscillator and visualize the waveform
 */

var freqSlider, freqLabel, ampLabel, ampSlider, button;

var osc;
var freq = 220; // current frequency (updated by slider)
var amp = 0.5;
var fft;


var oscOn = false;

function setup() {
  createCanvas(800,400);
  noFill();

  freqLabel = createP('Frequency: ');
  freqSlider = createSlider(1, 700, freq);

  ampLabel = createP('Amplitude: ' + amp);
  ampSlider = createSlider(0.0, 100.0, amp*100);

  button = createButton('start');
  button.mousePressed(toggleOsc);

  // Other types of oscillators include TriOsc, SawOsc, SqrOsc, and generic Oscillator.
  osc = new p5.SinOsc(freq);
  osc.amp(amp);

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
  fft = new p5.FFT();
}

function draw() {
  background(30);

  amp = ampSlider.value()/100;
  osc.amp(amp);
  ampLabel.html('Amplitude: ' + amp + '/ 1.0');

  freq = freqSlider.value();
  osc.freq(freq);
  freqLabel.html('Frequency: ' + freq + ' Hz');

  p.html('Current Waveform: ' + osc.getType());

  // analyze the waveform
  waveform = fft.waveform();

  // draw the shape of the waveform
  stroke(255);
  strokeWeight(10);
  beginShape();
  for (var i = 0; i<waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, -height/2, height/2);
    vertex(x, y + height/2);
  }
  endShape();
}

// Turn the oscillator on / off
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

// Methods to change the oscillator type.
// You can change the type by using osc.setType('sine').
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