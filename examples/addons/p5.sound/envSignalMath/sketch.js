/**
 *  Control the level of an envelope with math
 */

var env; // this is the oscillator we will hear
var osc; // this oscillator will modulate the amplitude of the carrier

function setup() {
  env = new p5.Env(0.01, 1, 0.5, 0.8, 0.3,0.2);

  osc = new p5.Oscillator(); // connects to master output by default
  osc.start(0);
  osc.freq(1);
  osc.freq(env.scale(0,1,800,300));
  osc.amp(env);
}

function mousePressed() {
  env.triggerAttack(osc);
}

function mouseReleased() {
  env.triggerRelease(osc);
}