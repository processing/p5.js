/**
 * DEMO:  Use p5.Amplitude (volume) to change the size of an ellipse
 */

var size;

var soundFile;
var amplitude;

// description text
var description;
var p1;

var smoothing = .01;
var smoothSlider, smoothLabel;

function preload() {
  soundFile = loadSound(['../_files/beat.mp3', '../_files/beat.ogg']);
}

function setup() {
  createCanvas(400, 400); 
  background(0);
  noStroke();
  fill(255);

  soundFile.loop();

  // create a new p5.Amplitude. Optionally, give it a 'smoothing' value betw 0.0 and .999
  amplitude = new p5.Amplitude(smoothing);

  // instruction text
  description = 'Spacebar: pause/unpause the loop. <br>Press "N" to toggle Normalize';
  p1 = createP(description);

  smoothSlider = createSlider(0.0, 99.9, smoothing*100);
  smoothLabel = createP('Smoothing: ' + smoothing);
}

function draw() {
  background(0);

  // get volume from the amplitude process
  var volume = amplitude.getLevel();

  // print the volume to the canvas. It is a float between 0 and 1.0.
  text('volume: ' + volume, 20, 20);

  // Change size based on volume. First, map to useful values.
  size = map(volume, 0, 1.0, 25, 400);
  ellipse(width/2, height/2, size, size);

  // instruction text
  description = 'Spacebar: pause/unpause the loop. <br>Press "N" to toggle Normalize. Normalized is '+amplitude.normalize;
  p1.html(description);

  // change smoothing
  smoothing = smoothSlider.value()/100;
  smoothLabel.html('Smoothing: ' + smoothing);
  amplitude.smooth(smoothing);
}

// on key pressed...
function keyPressed(e) {

  // spacebar pauses
  if (e.keyCode == 32) {
    if (soundFile.isPlaying()) {
      soundFile.pause();
    } else {
      soundFile.play();
    }
  }

  // 'n' keypress toggles normalize on/off
  if (e.keyCode == 78) {
    amplitude.toggleNormalize();
  }

}

function mouseClicked() {
if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
if ( getMasterVolume() == 0) {
setMasterVolume(0, 1);
} else {
setMasterVolume(0.1),1;
}
}
}


