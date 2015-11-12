/**
 *  Example: Convolution Reverb w/ FFT
 *
 *  The p5.Convolver can recreate the sound of actual spaces using convolution.
 *  
 *  Toggle between different impulses with the mouse. Press any key to hear the
 *  original impulse recording.
 *
 *  Convolution samples Creative Commons BY recordinghopkins, via freesound.org
 *  https://www.freesound.org/people/recordinghopkins/
 */
var sound, env, cVerb, fft;
var currentIR = 0;
var p;
var rawImpulse;

function preload() {

  // we have included both MP3 and OGG versions of all the impulses/sounds
  soundFormats('ogg', 'mp3');

  // create a p5.Convolver
  cVerb = createConvolver('../_files/bx-spring');

  // add Impulse Responses to cVerb.impulses array, in addition to bx-spring
  cVerb.addImpulse('../_files/small-plate');
  cVerb.addImpulse('../_files/drum');
  cVerb.addImpulse('../_files/beatbox');
  cVerb.addImpulse('../_files/concrete-tunnel');

  // load a sound that will be processed by the p5.ConvultionReverb
  sound = loadSound('../_files/Damscray_DancingTiger');
}

function setup() {
  createCanvas(710, 400);
  rawImpulse = loadSound('../_files/' + cVerb.impulses[currentIR].name);

  // disconnect from master output...
  sound.disconnect();
  // ... and process with cVerb 
  // so that we only hear the reverb
  cVerb.process(sound);

  createP('Click to play a sound and change the impulse');
  createP('Press any key to play the impulse source as a SoundFile');
  p = createP('');

  fft = new p5.FFT();
}

function draw() {
  background(30);
  fill(0,255,40);

  var spectrum = fft.analyze();

  // Draw every value in the frequencySpectrum array as a rectangle
  noStroke();
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width/spectrum.length, h) ;
  }
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

  rawImpulse.setPath('../_files/' + cVerb.impulses[currentIR].name);
}

function keyPressed() {
  rawImpulse.play();
}