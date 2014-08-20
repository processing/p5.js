/**
 *  Example: Convolution Reverb
 *
 *  The p5.Convolver can recreate the sound of actual spaces using convolution.
 *  
 *  Toggle between five different buffer sources
 *
 *  Convolution samples Creative Commons BY recordinghopkins, via freesound.org
 *  https://www.freesound.org/people/recordinghopkins/
 */

var sound, cVerb;
var currentIR = 0;
var p;

function preload() {
  // we have included both MP3 and OGG versions of all the impulses/sounds
  soundFormats('ogg', 'mp3');

  // create a p5.Convolver
  cVerb = createConvolver('../_files/bx-spring');

  // add Impulse Responses to cVerb.impulses array, in addition to bx-spring
  cVerb.addImpulse('../_files/small-plate');
  cVerb.addImpulse('../_files/drum');
  cVerb.addImpulse('../_files/concrete-tunnel');

  // load a sound that will be processed by the p5.ConvultionReverb
  sound = loadSound('../_files/Damscray_DancingTiger');
}

function setup() {
  // disconnect from master output...
  sound.disconnect();
  // ... and process with cVerb so that we only hear the reverb
  cVerb.process(sound);

  createP('Click to play a sound and change the impulse');
  p = createP('');
}

function mousePressed() {

  // cycle through the array of cVerb.impulses
  currentIR++;
  if (currentIR >= cVerb.impulses.length) {
    currentIR = 0;
  }
  cVerb.toggleImpulse(currentIR);

  // play the sound through the impulse
  sound.play();

  // display the current Impulse Response name (the filepath)
  p.html('Convolution Impulse Response: ' + cVerb.impulses[currentIR].name);
}