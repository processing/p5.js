// ====================
// DEMO: find the peaks in an audio file to draw the entire waveform
// ====================

var soundFile;

var p, peakCount, peakCountSlider;

function preload() {
  // create a SoundFile with a reference to this and a path to a sound file
  soundFile = new SoundFile('lucky_dragons_-_power_melody.wav');

}

function setup() {
  createCanvas(800, 400);
  background(0);
  peakCountSlider = createSlider(8, 2000, 20);
  p = createP('peak count: ' + peakCount);
}


function draw() {
  background(0);

  peakCount = peakCountSlider.value();
  p.html('peak count: ' + peakCount);

  // only draw the waveform if the soundfile has loaded, otherwise it will throw an error
  if (soundFile.isLoaded()) {
    var waveform = soundFile.getPeaks(peakCount);
    fill(255);
    stroke(255);
    strokeWeight(2);
    beginShape();
    for (var i = 0; i< waveform.length; i++){
      vertex(map(i, 0, waveform.length, 0, width), map(waveform[i], -1, 1, height, 0));// 1, -waveform[i]*height);
    }
    endShape();
  }

  drawCursor();
}

function drawCursor() {
  noStroke();
  fill(0,255,0);
  rect(map(soundFile.currentTime(), 0, soundFile.duration(), 0, width), 0, 5, height);

}

function keyPressed(k) {
  if (k.keyCode == 32) {
    soundFile.play();
  }
}
