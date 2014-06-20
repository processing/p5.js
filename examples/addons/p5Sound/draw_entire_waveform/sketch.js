// ====================
// DEMO: find the peaks in an audio file to draw the entire waveform
// ====================

var soundFile;

var p, peakCount;

function preload() {
  // create a SoundFile with a reference to this and a path to a sound file
  soundFile = new SoundFile('lucky_dragons_-_power_melody.wav','lucky_dragons_-_power_melody.mp3');
}

function setup() {
  createCanvas(800, 400);
  background(0);
  p = createP('peaks to draw: ' + peakCount);
  createP('Press Spacebar to play<br>Up/Down to change playback rate<br>R to reverse the buffer<br> S to stop all audio<br>P to pause')
}


function draw() {
  background(0);

  peakCount = map(this.mouseY, height, 0, 5, 2000); //peakCountSlider.value();
  if (peakCount < 8) {
    peakCount = 8;
  }


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
  var newRate = Math.round(map(mouseX,0,800,-10,10))/10;
  soundFile.rate(newRate);
  p.html('MouseY = Visible Amplitude Peaks: ' + peakCount+'<br>MouseX = Playback Rate: '+newRate);
}


function drawCursor() {
  noStroke();
  fill(0,255,0);
  rect(map(soundFile.currentTime(), 0, soundFile.duration(), 0, width), 0, 5, height);
}

// Keyboard Controls
function keyPressed(k) {
  console.log(k.keyCode);
  // "S" stops all sound sources
  if (k.keyCode == 83) {
    soundFile.stopAll();
  }
  // "P" pauses current source
  if (k.keyCode == 80) {
    soundFile.pause();
  }
  // "R" reverses sound file
  if (k.keyCode == 82) {
    soundFile.reverse();
  }
  // Spacebar: play (creates a new sound source from the same buffer, does not stop playback)
  if (k.keyCode == 32) {
    soundFile.loop();
  }

}
