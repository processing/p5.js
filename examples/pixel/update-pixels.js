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
}


function draw() {

  for (var y=0 ; y<height; y++) {
    for (var x=0; x<width; x++) {
      if (pow((x-mouseX), 2)+ pow((y-mouseY), 2)<pow(radius, 2))  {
        pixels[y*width+x] = img.get(x, y);
      }
    }
  }
  updatePixels();
}