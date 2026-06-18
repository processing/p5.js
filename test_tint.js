let img;
let tintOn = true;
let button;

function preload() {
  img = loadImage('testfile.png');
}

function setup() {
  createCanvas(600, 400);
  
  // Create button
  button = createButton('Toggle Tint');
  button.position(10, height + 10);
  button.mousePressed(toggleTint);
  
  // Initial button styling
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('padding', '10px 20px');
  button.style('border', 'none');
  button.style('border-radius', '4px');
  button.style('cursor', 'pointer');
}

function draw() {
  background(220);
  
  // Apply tint if enabled
  if (tintOn) {
    tint(255, 0, 0); // Red tint
  } else {
    noTint();
  }
  
  // Draw image centered
  imageMode(CENTER);
  image(img, width/2, height/2);
  
  // Add text to show current state
  noTint();  // Reset tint for text
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Tint: ' + (tintOn ? 'ON' : 'OFF'), 10, 10);
}

function toggleTint() {
  tintOn = !tintOn;
  // Update button color based on state
  button.style('background-color', tintOn ? '#4CAF50' : '#f44336');
}
