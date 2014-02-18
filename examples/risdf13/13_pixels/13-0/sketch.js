function setup() {
  createCanvas(600, 600); 
  noStroke();
  noLoop();
}

function draw() {
  var myImage = loadImage("jennifer.png"); // this image came from Evelyn's Instagram feed :X
  image(myImage, 0, 0, 600, 600);
  var c = get(242, 162); // from the pink area
  //var c = get(393,273); // from the body suit
  fill(c);
  rect(100, 100, 300, 300);
};