function setup() {
  console.log('Setup called');
  createCanvas(1000, 1200);
  background(255);
  textSize(14);
  textFont('sans-serif');

  let alignments = [LEFT, CENTER, RIGHT];
  let vertAlignments = [BASELINE, BOTTOM, CENTER, TOP];
  // Using string literals as constants might not be exposed in this build environment yet
  let wrapModes = ['PRETTY', 'BALANCE'];
  console.log('window.PRETTY:', window.PRETTY);
  let sampleText = 'text gonna wrap when it gets too long and is then breaking.';

  let xStart = 50;
  let yStart = 50;
  let boxWidth = 200;
  let boxHeight = 80;
  let xGap = 220;
  let yGap = 100;

  // Test PRETTY and BALANCE with different alignments
  for (let w = 0; w < wrapModes.length; w++) {
    let mode = wrapModes[w];
    let modeName = (mode === PRETTY) ? 'PRETTY' : 'BALANCE';

    fill(0);
    noStroke();
    text(`textWrap(${modeName})`, xStart, yStart - 20);

    for (let i = 0; i < vertAlignments.length; i++) {
      for (let j = 0; j < alignments.length; j++) {
        let x = xStart + j * xGap;
        let y = yStart + i * yGap;

        let horiz = alignments[j];
        let vert = vertAlignments[i];

        let horizName = (horiz === LEFT) ? 'LEFT' : (horiz === CENTER) ? 'CENTER' : 'RIGHT';
        let vertName = (vert === BASELINE) ? 'BASELINE' : (vert === BOTTOM) ? 'BOTTOM' : (vert === CENTER) ? 'CENTER' : 'TOP';

        stroke(255, 0, 0);
        noFill();
        rect(x, y, boxWidth, boxHeight);

        noStroke();
        fill(0);
        textAlign(horiz, vert);
        textWrap(mode);
        text(`${horizName} ${vertName} ${sampleText}`, x, y, boxWidth, boxHeight);
      }
    }
    yStart += 500;
  }

  // Test JUSTIFIED
  fill(0);
  noStroke();
  text('textAlign(JUSTIFIED)', xStart, yStart - 20);

  let justifiedText = 'This is a longer text that should be justified when it wraps to multiple lines. It should look clean and aligned on both sides.';

  stroke(255, 0, 0);
  noFill();
  rect(xStart, yStart, boxWidth, boxHeight * 2);

  noStroke();
  fill(0);
  textAlign(JUSTIFIED, TOP);
  textWrap(WORD);
  text(justifiedText, xStart, yStart, boxWidth, boxHeight * 2);

  stroke(255, 0, 0);
  noFill();
  rect(xStart + xGap, yStart, boxWidth, boxHeight * 2);

  noStroke();
  fill(0);
  textAlign(JUSTIFIED, TOP);
  textWrap(PRETTY);
  text(justifiedText, xStart + xGap, yStart, boxWidth, boxHeight * 2);

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  text('WORD', xStart, yStart + boxHeight * 2 + 10);
  text('PRETTY', xStart + xGap, yStart + boxHeight * 2 + 10);
}
