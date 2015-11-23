/**
 *  Example: Create an Envelope (p5.Env) to control oscillator amplitude.
 *  Trigger the Attack portion of the envelope when the mouse is clicked.
 *  Trigger the Release when the mouse is released.
 */

var triOsc;
var env;
var a;

// Times and levels for the ADSR envelope
var attackTime = 0.001;
var attackLevel = 0.9;
var decayTime = 0.25;
var decayLevel = 0.2;
var sustainTime = 0.1;
var sustainLevel = decayLevel;
var releaseTime = .8;
var duration = 1000;
// Set the note trigger
var trigger;

// An index to count up the notes
var note = 0;


function setup(){
  createCanvas(600, 600);
  background(255);

  trigger = millis();

  triOsc = new p5.TriOsc();
  triOsc.freq(220);
  triOsc.start();
  env = new p5.Env(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime);
  triOsc.amp(env);
  fill(0);
  createP('click mouse to triggerAttack, release mouse to triggerRelease');

  a = new p5.Amplitude();
}

function draw(){
  var size = 10;
  background(255, 255,255,20);
  ellipse( map ( (trigger - millis()) % duration, 1000, 0, 0, width) % width, map ( a.getLevel(), 0, .5, height-size, 0), size, size);
}

function mousePressed(){
    // The envelope gets triggered with the oscillator as input and the times and levels we defined earlier
    env.triggerAttack();
    trigger = millis() + duration;
}

function mouseReleased(){
    env.triggerRelease();
}