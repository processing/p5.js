function setup() {
  createCanvas(800, 600);
  background(255);
  
  let sampleText = 'This is a sample text that will be justified. The spacing between words will be adjusted to align both left and right edges.';
  let boxWidth = 300;
  let boxHeight = 150;
  
  // Test 1: JUSTIFIED with WORD wrap
  fill(0);
  textSize(16);
  textAlign(JUSTIFIED, TOP);
  textWrap(WORD);
  
  stroke(200);
  noFill();
  rect(50, 50, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  text('JUSTIFIED + WORD wrap:', 50, 30);
  text(sampleText, 50, 50, boxWidth, boxHeight);
  
  // Test 2: JUSTIFIED with CHAR wrap
  stroke(200);
  noFill();
  rect(450, 50, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  textWrap(CHAR);
  text('JUSTIFIED + CHAR wrap:', 450, 30);
  text(sampleText, 450, 50, boxWidth, boxHeight);
  
  // Test 3: LEFT alignment for comparison
  stroke(200);
  noFill();
  rect(50, 250, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text('LEFT + WORD wrap (comparison):', 50, 230);
  text(sampleText, 50, 250, boxWidth, boxHeight);
  
  // Test 4: Show last line is ragged
  let multiLineText = 'First line will be justified. Second line will also be justified. But the last line stays ragged.';
  
  stroke(200);
  noFill();
  rect(450, 250, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  textAlign(JUSTIFIED, TOP);
  text('JUSTIFIED - last line ragged:', 450, 230);
  text(multiLineText, 450, 250, boxWidth, boxHeight);
  
  noLoop();
}
