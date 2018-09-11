let carrier, modulator;

// carrier frequency signal, a p5.Signal
let carrierFreq;

// modulator frequency signal, a p5.Signal
let modFreq;

// output envelope
let env;

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

  const m1 = new p5.SignalMult();
  m1.setInput(modulator);
  m1.setValue(100);
}

function draw() {
  carrierFreq.fade(mouseX);
}

function mousePressed() {
  env.play();
}
