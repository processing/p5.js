/**
 *  Create a sequence using a Part.
 *  Add two Phrases to the part, and tell the part to loop.
 *
 *  The callback includes parameters (the value at that position in the Phrase array)
 *  as well as time, which should be used to schedule playback with precision.
 */

var osc, env; // used by playNote
var noise, noiseEnv; // used by playSnare
var part; // a part we will loop
var currentBassNote = 47;

function setup() {
  // prepare the osc and env used by playNote()
  env = new p5.Env(0.01, 0.8, 0.2, 0);
  osc = new p5.TriOsc(); // connects to master output by default
  osc.start(0);
  osc.connect();
  env.setInput(osc);

  // prepare the noise and env used by playSnare()
  noise = new p5.Noise();
  // noise.amp(0.0);
  noise.start();
  noiseEnv = new p5.Env(0.01, 0.5, 0.1, 0);
  noiseEnv.setInput(noise);
  // create a part with 8 spaces, where each space represents 1/16th note (default)
  part = new p5.Part(8, 1/16);

  // add phrases, with a name, a callback, and
  // an array of values that will be passed to the callback if > 0
  part.addPhrase('snare', playSnare, [0, 0, 1, 0]);
  part.addPhrase('bass', playBass, [47, 42, 45, 47, 45,42, 40, 42]);

  // // set tempo (Beats Per Minute) of the part and tell it to loop
  part.setBPM(80);
  part.loop();

}

function playBass(time, params) {
  currentBassNote = params;
  osc.freq(midiToFreq(params), 0, time);
  env.play(osc, time);
}

function playSnare(time, params) {
  noiseEnv.play(noise, time);
}

// draw a ball mapped to current note height
function draw() {
  background(255);
  fill(255, 0, 0);
  var noteHeight = map(currentBassNote, 40, 50, height, 0);
  ellipse(width/2, noteHeight, 30, 30);
}