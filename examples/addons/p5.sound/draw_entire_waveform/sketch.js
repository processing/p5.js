/**
 *  DEMO
 *  - find the peaks in an audio file to draw the entire waveform with SoundFile.getPeaks();
 *  - draw cursor on a timeline with SoundFile.currentTime() and SoundFile.duration();
 *  - change playbackRate based on mouse position
 */

// ====================

var soundFile;

var p, peakCount;

function preload() {
  soundFile = loadSound(['../_files/lucky_dragons_-_power_melody.mp3','../_files/lucky_dragons_-_power_melody.ogg']);
}

function setup() {
  createCanvas(800, 400);
  soundFile.loop();
  background(0);
  p = createP('peaks to draw: ' + peakCount);
  createP('Press Spacebar to play/pause.');
}


function draw() {
  background(255);

  peakCount = map(this.mouseY, height, 0, 5, 2000);
  if (peakCount < 8) {
    peakCount = 8;
  }

  var waveform = soundFile.getPeaks(peakCount);
  fill(0);
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (var i = 0; i< waveform.length; i++){
    vertex(map(i, 0, waveform.length, 0, width), map(waveform[i], -1, 1, height, 0));
  }
  endShape();

  // map playback rate of a sound file to mouseX position
  var newRate = (map(mouseX,0,800,-7,10))/10;
  soundFile.rate(newRate);

  // update display text:
  p.html('MouseY = Visible Amplitude Peaks: ' + peakCount.toFixed(3)+'<br>MouseX = Playback Rate: '+newRate.toFixed(3));

  drawCursor();
}


function drawCursor() {
  noStroke();
  fill(0,255,0);
  rect(map(soundFile.currentTime(), 0, soundFile.duration(), 0, width), 0, 5, height);
}

// Keyboard Controls
function keyPressed() {
  var key = keyCode;
  // Spacebar: pause
  if (key == 32) {
    soundFile.pause();
  }
}
