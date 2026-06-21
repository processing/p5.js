function setup() {
  createCanvas(800, 600);
  background(255);
  
  let sampleText = 'This is a sample text that will be wrapped using the new PRETTY and BALANCE modes. It should result in more balanced line lengths compared to standard WORD wrapping.';
  let boxWidth = 200;
  let boxHeight = 150;
  
  // Test 1: WORD wrap (standard)
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  
  stroke(200);
  noFill();
  rect(50, 50, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  text('WORD wrap:', 50, 30);
  text(sampleText, 50, 50, boxWidth, boxHeight);
  
  // Test 2: PRETTY wrap
  stroke(200);
  noFill();
  rect(300, 50, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  textWrap(PRETTY);
  text('PRETTY wrap:', 300, 30);
  text(sampleText, 300, 50, boxWidth, boxHeight);
  
  // Test 3: BALANCE wrap (alias for PRETTY)
  stroke(200);
  noFill();
  rect(550, 50, boxWidth, boxHeight);
  
  fill(0);
  noStroke();
  textWrap(BALANCE);
  text('BALANCE wrap:', 550, 30);
  text(sampleText, 550, 50, boxWidth, boxHeight);
  
  noLoop();
}
