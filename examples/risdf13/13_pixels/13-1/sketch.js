function setup() {
  createCanvas(600, 600); 
  strokeWeight(1);
  noLoop();
}

function draw() {
  var myImage = loadImage("jennifer.png"); // this image came from Evelyn's Instagram feed :X
  image(myImage, 0, 0, 600, 600);
  loadPixels(); // this loads the pixels currently on the canvas into the 'pixels' variable
  for(var i = 0; i < width; i+=30) { // every 20 pixels across
    for(var j = 0; j < height; j+=30) { // every 20 pixels down
      var c = pixels[j*width + i]; // calculate where in the pixel array to be, get the value there
      fill(c);
      ellipse(i, j, 30, 30); // the location to draw the circle
    }
  }
};