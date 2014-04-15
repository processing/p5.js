var img;
var radius;
var smoothAmount;
var canvasImg; 

function preload() {

 img = loadImage("unicorn.jpg");  // Load an image into the program
}
 
function setup() {
  createCanvas(256, 256);
  loadPixels();
  print(pixels);
  //canvasImg = createImage(width, height);
  //canvasImg.loadPixels();

  for (var i=0; i<pixels.length; i++) {
    pixels[i] = [255, 255, 0, 255];
  }
  //canvasImg.updatePixels();
  radius=60;
}


function draw() {

//   //loadPixels();

  for (var y=0 ; y<height; y++) {
    for (var x=0; x<width; x++) {
      if (pow((x-mouseX), 2)+ pow((y-mouseY), 2)<pow(radius, 2))  {
        pixels[y*width+x] = img.get(x, y);
        //canvasImg.pixels[y*width+x] = img.get(x, y);
      }
    }
  }
//   //updatePixels();
  //canvasImg.updatePixels();
  //image(canvasImg, 0, 0);
  updatePixels();
}