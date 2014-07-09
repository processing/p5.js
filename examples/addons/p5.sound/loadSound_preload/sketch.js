// Sound samples from Damscray - "Dancing Tiger",
// Creative Commons BY-NC-SA


function preload(){
  sample1 = loadSound(['../_files/Damscray_-_Dancing_Tiger_01.mp3', '../_files/Damscray_-_Dancing_Tiger_01.ogg']);
}

function setup() {
  createCanvas(400,200);

  text('File is ready!  Click to pause.', 50, 10);

  sample1.rate(.8);
  sample1.reverseBuffer();
  sample1.loop();

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