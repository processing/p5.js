/**
 * PWM
 */
var freqSlider, freqLabel, ampLabel, ampSlider, widthLabel, widthSlider, button;

var pulse;
var freq = 1; // current frequency (updated by slider)
var amp = 1.0;
var w = .25;
var fft;


var oscOn = false;

function setup() {
  createCanvas(800,400);
  noFill();

  widthLabel = createP('Width: ' + w);
  widthSlider = createSlider(0.0, 100.0, w*100);

  button = createButton('start');
  button.mousePressed(toggleOsc);

  freqLabel = createP('Frequency: ');
  freqSlider = createSlider(1, 700, freq);

  ampLabel = createP('Amplitude: ' + amp);
  ampSlider = createSlider(0.0, 100.0, amp*100);


  pulse = new p5.Pulse(freq);
  pulse.amp(amp);

  // create an fft to analyze the audio
  fft = new p5.FFT();

  // begin sound
  toggleOsc();
}

function draw() {
  background(30);

  amp = ampSlider.value()/100;
  pulse.amp(amp);
  ampLabel.html('Amplitude: ' + amp + '/ 1.0');

  freq = freqSlider.value();
  pulse.freq(freq);
  freqLabel.html('Frequency: ' + freq + ' Hz');


  w = widthSlider.value()/100;
  pulse.width(w);
  widthLabel.html('Width: ' + w + '/ 1.0');

  // process the waveform
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
