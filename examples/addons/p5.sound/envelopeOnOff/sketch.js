/**
 *  Example: Create an Envelope to control oscillator amplitude.
 *  Trigger the Attack portion of the envelope when the mouse is clicked.
 *  Trigger the Release when the mouse is released.
 */

var triOsc;
var env;

// Times and levels for the ADSR envelope
var attackTime = 0.1;
var attackLevel = .7;
var decayTime = .3;
var sustainTime = 0.1;
var sustainLevel = 0.2;
var releaseTime = .5;
var duration = 1000;
// Set the note trigger
var trigger;

// An index to count up the notes
var note = 0;


function setup(){
  createCanvas(600, 600);
  background(255);

  trigger = millis();

  triOsc = new TriOsc();
  triOsc.amp(0);
  triOsc.start();

  env = new Env(attackTime, attackLevel, decayTime, sustainLevel, sustainTime, releaseTime);
  fill(0);
}

function draw(){
  var size = 10;
  background(255, 255,255,20);
  ellipse( map ( (trigger - millis()) % duration, 1000, 0, 0, width) % width, map ( triOsc.getAmp(), 0, 1, height-size, 0), size, size);
}

function mousePressed(){
    // The envelope gets triggered with the oscillator as input and the times and levels we defined earlier
    env.triggerAttack(triOsc);
    trigger = millis() + duration;
}

function mouseReleased(){
    env.triggerRelease(triOsc);
}