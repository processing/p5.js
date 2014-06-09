/**
 * DEMO:  Use Amplitude (volume) to change the size of an ellipse
 */

var size;

var soundFile;
var amplitude;

// description text
var description;
var h1;
var h2;

function setup() {
  createCanvas(400, 400); 
  background(0, 0, 0);
  noStroke();
  
  // Create SoundFile. Multiple filetypes for cross-browser compatability.
  soundFile = new SoundFile('beat.aiff', 'beat.wav', 'beat.mp3');

  // loop the sound file
  soundFile.loop();

  // create a new Amplitude. Optionally, give it a 'smoothing' value betw 0.0 and .999
  amplitude = new Amplitude();

  // instruction text
  description = 'Spacebar: pause/unpause the loop. <br>Press "N" to toggle Normalize';
  h1 = createH1(description);

}

function draw() {
  background(0, 0, 0);

  // get volume from the amplitude process
  var volume = amplitude.process();

  // print the volume to the canvas. It is a float between 0 and 1.0.
  text('volume: ' + volume, 20, 20);

  // Change size based on volume. First, map to useful values.
  size = map(volume, 0, 1.0, 25, 400);
  ellipse(width/2, height/2, size, size);

  // instruction text
  description = 'Spacebar: pause/unpause the loop. <br>Press "N" to toggle Normalize. Normalized is '+amplitude.normalize;
  h1.html(description);

}

// on key pressed...
function keyPressed(e) {

  // spacebar pauses
  if (e.keyCode == 32) {
    soundFile.pause();
  }

  // 'n' keypress toggles normalize on/off
  if (e.keyCode == 78) {
    amplitude.toggleNormalize();
  }

}


