var carrier, modulator;

// carrier frequency signal, a p5.Signal
var carrierFreq;

// modulator frequency signal, a p5.Signal
var modFreq;


// output envelope
var env;

function setup() {
  carrier = new p5.Oscillator();

  carrierFreq = new p5.Signal(240);
  carrier.freq(carrierFreq);
  carrier.start();

  env = new p5.Env(0.05, 1, 0.5, 0);
  carrier.amp(env);

  modulator = new p5.Oscillator();
  modulator.disconnect();
  modFreq = new p5.SignalMult(8);
  modFreq.setInput(carrierFreq);
  modulator.freq(modFreq);
  modulator.start();

  var m1 = new p5.SignalMult();
  m1.setInput(modulator);
  m1.setValue(100);
}

function draw() {
  carrierFreq.fade(mouseX);
}

function mousePressed() {
  env.play();
}