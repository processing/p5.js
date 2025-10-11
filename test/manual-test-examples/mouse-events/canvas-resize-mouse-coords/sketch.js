// Test for issue #8139
// mouseX and mouseY not updated when canvas changes until mouse moves

function setup() {
  createCanvas(800, 800);
  textAlign(LEFT, TOP);
  textSize(20);
}

function draw() {
  background(220);

  // Display mouseX and mouseY coordinates
  fill(0);
  text('mouseX: ' + mouseX, 20, 20);
  text('mouseY: ' + mouseY, 20, 50);
  text('pmouseX: ' + pmouseX, 20, 80);
  text('pmouseY: ' + pmouseY, 20, 110);

  // Display window coordinates (these should stay constant)
  text('winMouseX: ' + winMouseX, 20, 140);
  text('winMouseY: ' + winMouseY, 20, 170);

  // Visual indicator - draw a circle at mouse position
  fill(255, 0, 0, 150);
  noStroke();
  circle(mouseX, mouseY, 30);

  // Instructions
  fill(0, 150, 0);
  textSize(16);
  text('TEST INSTRUCTIONS:', 20, 220);
  text('1. Place mouse at a specific location on canvas', 20, 245);
  text('2. Keep mouse COMPLETELY STILL', 20, 265);
  text('3. Press F12 to open/close dev tools', 20, 285);
  text('4. Or press F11 to toggle fullscreen', 20, 305);
  text('5. Watch mouseX/mouseY values update automatically!', 20, 325);

  fill(0, 0, 150);
  text('EXPECTED: mouseX/mouseY update without mouse movement', 20, 360);
  text('PREVIOUS BUG: coordinates would freeze', 20, 380);

  // Show canvas size for debugging
  fill(0);
  textSize(14);
  text('Canvas: ' + width + ' x ' + height, 20, 420);
  text('Window: ' + windowWidth + ' x ' + windowHeight, 20, 440);
  text('Frame: ' + frameCount, 20, 460);
}
