/**
 *  Tell two sine wave oscillators to start at the same time,
 *  50% out of phase. Phase Cancellation results!
 *  Change the phase with the slider.
 */

// create a variable for the sound file
var osc1, osc2, fft;
var phaseSlider;

function setup() {
  createCanvas(800,400);
  noFill();

  osc1 = new p5.SinOsc();
  osc2 = new p5.SinOsc();
  fft = new p5.FFT();
  osc1.phase(.5);
  osc2.phase(0);
  osc1.amp(1);
  osc2.amp(1);
  osc1.start(); osc2.start();

  phaseSlider = createSlider(0, 100, 50);
}

function draw() {
  background(30);

  // analyze the waveform of all sound in the sketch
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

  var osc1Phase = phaseSlider.value()/100;
  osc1.phase(osc1Phase);
}