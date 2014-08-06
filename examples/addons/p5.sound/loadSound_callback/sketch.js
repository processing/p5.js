// Sound samples from Damscray - "Dancing Tiger",
// Creative Commons BY-NC-SA


function setup() {
  createCanvas(400,200);
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('../_files/Damscray_-_Dancing_Tiger_01', soundReady);
}

function soundReady(){
  soundFile.rate(1.75);
  soundFile.loop();

  text('File is ready!  Click to pause / unpause', 50, 10);

  // draw the waveform
  peaks = soundFile.getPeaks();
  beginShape();
  for (i = 0; i< peaks.length; i++){
    vertex(map(i, 0, peaks.length, 0, width), map(peaks[i], -1, 1, height, 0) );
  }
  endShape();
}

function mousePressed(){
  if (soundFile.isPlaying()){
    soundFile.pause();
  } else {
    soundFile.play();
  }
}