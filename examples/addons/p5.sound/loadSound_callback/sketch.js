// Sound samples from Damscray - "Dancing Tiger",
// Creative Commons BY-NC-SA


function setup() {
  createCanvas(400,200);
  sample1 = loadSound(['../_files/Damscray_-_Dancing_Tiger_01.mp3', '../_files/Damscray_-_Dancing_Tiger_01.ogg'], soundReady);
}

function soundReady(){
  sample1.rate(1.75);
  sample1.loop();

  text('File is ready!  Click to pause.', 50, 10);

  // draw the waveform
  peaks = sample1.getPeaks();
  beginShape();
  for (i = 0; i< peaks.length; i++){
    vertex(map(i, 0, peaks.length, 0, width), map(peaks[i], -1, 1, height, 0) );
  }
  endShape();
}

function mousePressed(){
  sample1.pause();
}