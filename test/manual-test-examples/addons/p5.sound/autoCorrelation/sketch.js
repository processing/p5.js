/**
 *  Auto Correlation multiples each sample in a buffer by all
 *  of the other samples. This emphasizes the fundamental
 *  frequency. Auto Correlation is useful for pitch detection,
 *  as well as for visualization
 *
 *  This example is a Correlogram which is a plot
 *  of the autocorrelations.
 *
 *  Example by Jason Sigal and Golan Levin.
 */

let source, fft;
const bNormalize = true;
const centerClip = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  source = new p5.AudioIn();
  source.start();

  fft = new p5.FFT();
  fft.setInput(source);
}

function draw() {
  background(200);

  // array of values from -1 to 1
  const timeDomain = fft.waveform(2048, 'float32');
  const corrBuff = autoCorrelate(timeDomain);

  beginShape();
  for (let i = 0; i < corrBuff.length; i++) {
    const w = map(i, 0, corrBuff.length, 0, width);
    const h = map(corrBuff[i], -1, 1, height, 0);
    curveVertex(w, h);
  }
  endShape();
}

function autoCorrelate(buffer) {
  const newBuffer = [];
  const nSamples = buffer.length;

  const autocorrelation = [];
  let index;

  // center clip removes any samples under 0.1
  if (centerClip) {
    const cutoff = 0.1;
    for (let i = 0; i < buffer.length; i++) {
      const val = buffer[i];
      buffer[i] = Math.abs(val) > cutoff ? val : 0;
    }
  }

  for (let lag = 0; lag < nSamples; lag++) {
    let sum = 0;
    for (index = 0; index < nSamples; index++) {
      const indexLagged = index + lag;
      if (indexLagged < nSamples) {
        const sound1 = buffer[index];
        const sound2 = buffer[indexLagged];
        const product = sound1 * sound2;
        sum += product;
      }
    }

    // average to a value between -1 and 1
    newBuffer[lag] = sum / nSamples;
  }

  if (bNormalize) {
    let biggestVal = 0;
    for (index = 0; index < nSamples; index++) {
      if (abs(newBuffer[index]) > biggestVal) {
        biggestVal = abs(newBuffer[index]);
      }
    }
    for (index = 0; index < nSamples; index++) {
      newBuffer[index] /= biggestVal;
    }
  }

  return newBuffer;
}
