/**
 * Example: Amplitude Modulation involves two oscillators, referred
 * to as the carrier and the modulator, where the modulator controls
 * the carrier's amplitude.
 * 
 * The carrier is typically set at an audible frequency (i.e. 440 Hz)
 * and connected to master output by default. The carrier.amp is
 * set to zero because we will have the modulator control its amplitude.
 * 
 * The modulator is typically set to a frequency that is lower than
 * humans can hear (i.e. 1 Hz, or one cycle every second). The modulator
 * is disconnected from master output. Instead, it is connected
 * to the amplitude of the Carrier, like this: carrier.amp(modulator).
 *
 * MouseX controls the amplitude of the modulator from 0 to 1. When the
 * modulator's amplitude is set to 0, the amplitude modulation has no effect.
 * 
 * MouseY controls the frequency of the modulator from 0 to 20hz.
 * Both impact our perception of the Carrier frequency. A subtle amount
 * of Amplitude Modulation can simulate effects such as Tremolo.
 * Ring Modulation is a type of Amplitude Modulation where the original
 * carrier signal is not present.
 */

var carrier; // this is the oscillator we will hear
var modulator; // this oscillator will modulate the amplitude of the carrier
var fft; // we'll visualize the waveform 

function preload() {
  carrier = loadSound('../_files/Damscray_-_Dancing_Tiger_01.mp3'); // connects to master output by default
}

function setup() {
  createCanvas(800,400);
  background(30); // alpha
  noFill();

  // carrier.freq(340);
  carrier.amp(0);
  // carrier's amp is 0 by default, giving our modulator total control

  carrier.loop();

  modulator = new p5.Oscillator('triangle');
  modulator.disconnect();  // disconnect the modulator from master output
  modulator.freq(5);
  modulator.amp(1);
  modulator.start();

  // Modulate the carrier's amplitude with the modulator
  // Optionally, we can scale the signal.
  carrier.amp(modulator.scale(-1,1,1,-1));

  // create an fft to analyze the audio
  fft = new p5.FFT();
}

function draw() {
  background(30,30,30,100); // alpha

  // map mouseY to moodulator freq between 0 and 20hz
  var modFreq = map(mouseY, 0, height, 4, 0);
  modulator.freq(modFreq);

  var modAmp = map(mouseX, 0, width, 0, 1);
  modulator.amp(modAmp, 0.01); // fade time of 0.1 for smooth fading

  // analyze the waveform
  waveform = fft.waveform();

  // draw the shape of the waveform
  stroke(240);
  strokeWeight(4);
  beginShape();
  for (var i = 0; i<waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, -height/2, height/2);
    vertex(x, y + height/2);
  }
  endShape();

}