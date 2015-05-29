/**
 *  Create a sequence using a Part.
 *  Add two Phrases to the part, and tell the part to loop.
 */

var osc, env; // used by playNote
var noise, noiseEnv; // used by playSnare
var part; // a part we will loop

function setup() {

  // prepare the osc and env used by playNote()
  env = new p5.Env(0.01, 0.8, 0.2, 0);
  osc = new p5.Oscillator(); // connects to master output by default
  osc.freq(1);
  osc.start(0);
  osc.connect();

  // prepare the noise and env used by playSnare()
  noise = new p5.Noise();
  noise.amp(0);
  noise.start();
  noiseEnv = new p5.Env(0.01, 0.5, 0.1, 0);

  // set the tempo
  setBPM(80);

  // create a part with 8 spaces, where each space represents 1/16th note (default)
  part = new p5.Part(8, 1/16);

  // add phrases, with a name, a callback,
  // and an array of values that will be passed to the callback if > 0
  part.addPhrase('melody', playNote, [60, 0, 0, 65, 72,0, 65, 0]);
  part.addPhrase('snare', playSnare, [0, 0, 1, 0, 0,0,1, 0]);

  // loop the part
  part.loop();
}


function playNote(midiNote) {
  if (midiNote > 0) {
    osc.freq(midiToFreq(midiNote));
    env.play(osc);
  }
}

function playSnare() {
  noiseEnv.play(noise);
}