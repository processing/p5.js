// Attempting to convert Wilm's Envelope example from the Processing Handbook ex2

/*
This sketch shows how to use envelopes and oscillators. Envelopes are pre-defined amplitude 
distribution over time. The sound library provides an ASR envelope which stands for attach, 
sustain, release. The amplitude rises then sustains at the maximum level and decays slowly 
depending on pre defined time segments.

      .________
     .          ---
    .              --- 
   .                  ---
   A       S        R 

*/

var triOsc;
var env;

// Times and levels for the ASR envelope
var attackTime = 0.001;
var attackLevel = .8;
var sustainTime = 0.004;
var sustainLevel = 0.4;
var releaseTime = 0.4;

var midiSequence = [ 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ]; 
var duration = 200;
// Set the note trigger
var trigger;

// An index to count up the notes
var note = 0

function setup(){
  createCanvas(200, 200);
  background(255);

  trigger = millis();

  triOsc = new TriOsc();
  triOsc.amp(0);
  triOsc.start();

  env = new Env();
}

function draw(){
  // If the determined trigger moment in time matches up with the computer clock and we if the 
  // sequence of notes hasn't been finished yet the next note gets played.

  if ((millis() > trigger) && (note<midiSequence.length)){
    // midiToFreq transforms the MIDI value into a frequency in Hz which we use to control the triangle oscillator
    triOsc.start(midiToFreq(midiSequence[note]));

    // The envelope gets triggered with the oscillator as input and the times and levels we defined earlier
    env.play(triOsc, attackTime, attackLevel, sustainTime, sustainLevel, releaseTime);

    // Create the new trigger according to predefined durations and speed it up by deviding by 1.5
    trigger = millis() + duration;
    
    // Advance by one note in the midiSequence;
    note++; 
    
    // Loop the sequence, notice the jitter
    if(note == 12) {
      note = 13;
    }
  }
}