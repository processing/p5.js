/**
 * PWM
 */
var freqSlider, freqLabel, ampLabel, ampSlider, widthLabel, widthSlider, button;

var pulse;
var freq = 220; // current frequency (updated by slider)
var amp = .5;
var w = 0;
var fft;


var oscOn = false;

function setup() {
  createCanvas(800,400);
  background(30);
  stroke(255);
  strokeWeight(10);

  freqLabel = createP('Frequency: ');
  freqSlider = createSlider(1, 700, freq);

  ampLabel = createP('Amplitude: ' + amp);
  ampSlider = createSlider(0.0, 100.0, amp*100);

  widthLabel = createP('Width: ' + w);
  widthSlider = createSlider(0.0, 100.0, w*100);

  button = createButton('start');
  button.mousePressed(toggleOsc);

  pulse = new Pulse(freq);
  pulse.setAmp(amp);

  // create an fft to analyze the audio
  fft = new FFT();
}

function draw() {
  background(0);

  amp = ampSlider.value()/100;
  pulse.setAmp(amp);
  ampLabel.html('Amplitude: ' + amp + '/ 1.0');

  freq = freqSlider.value();
  pulse.setFreq(freq);
  freqLabel.html('Frequency: ' + freq + ' Hz');


  w = widthSlider.value()/100;
  pulse.setWidth(w);
  widthLabel.html('Width: ' + w + '/ 1.0');

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
    pulse.stop();
    button.html('start');
  } else {
    pulse.start();
    button.html('stop');
  }
  oscOn = !oscOn;
}
