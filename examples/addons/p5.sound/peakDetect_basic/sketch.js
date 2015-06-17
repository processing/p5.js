var cnv, soundFile, fft, peakDetect;
var ellipseWidth = 10;

function setup() {
  cnv = createCanvas(100,100);

  soundFile = loadSound('../_files/beat.mp3');
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();

  setupSound();
}

function draw() {
  background(0);

  fft.analyze();
  peakDetect.update(fft);

  if ( peakDetect.isDetected ) {
    ellipseWidth = 50;
  } else {
    ellipseWidth *= 0.95;
  }

  ellipse(width/2, height/2, ellipseWidth, ellipseWidth);
}


function setupSound() {
  cnv.mouseClicked( function() {
    if (soundFile.isPlaying() ) {
      soundFile.stop();
    } else {
      soundFile.play();
    }
  });
}