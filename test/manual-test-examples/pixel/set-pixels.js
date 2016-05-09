
var img;
var radius=60;
var smoothAmount;
var canvasImg; 

function preload() {

 img = loadImage("unicorn.jpg");  // Load an image into the program
}
 
function setup() {
  createCanvas(256, 256);
  loadPixels();
  set(width/2, height/2, img);
}


function draw() {

  for (var i=-5; i<5; i++) {
      set(mouseX+i, mouseY, [0, 0, 255, 100]);
  }
  set(mouseX, mouseY, [255, 0, 255, 255]);
  set(mouseX+10, mouseY+10, 0);
  updatePixels();
}
