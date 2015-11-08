// Creating HTML images


// We define the variables outside of setup so we can access them from anywhere in the sketch.
var img;
var canvas;

function setup() {

  // We are still calling createCanvas like before, but now we are storing a pointer to each one.
  img = createImg("http://th07.deviantart.net/fs70/PRE/i/2011/260/3/5/dash_hooray_by_rainbowcrab-d49xk0d.png");
  canvas = createCanvas(400, 400);

  // Here we call methods of each element to set the position and id.
  // Use view-source to look at the HTML generated from this code when you load the sketch in your browser.
  img.position(190, 50);
  img.size(200, AUTO);

  canvas.position(300, 50);
}


function draw() {

  // Tell program to draw into canvas since img was last created element.
  //context(canvas);
  noStroke();
  background(220, 180, 200);
  fill(180, 200, 40);
  strokeWeight(6);
  stroke(180, 100, 240);
  for (var i=0; i<width; i+=15) {
    line(i, 0, i, height);
  }

}
