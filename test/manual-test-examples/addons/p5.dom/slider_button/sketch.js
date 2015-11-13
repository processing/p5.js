var canvas, rSlider, gSlider, bSlider, button;

function setup() {

  // create canvas
  canvas = createCanvas(200, 200);
  canvas.position(0, 0);

  // create and position sliders
  rSlider = createSlider(0, 255, 0);
  rSlider.position(10, 10);
  gSlider = createSlider(0, 255, 100);
  gSlider.position(10, 35);
  bSlider = createSlider(0, 255, 255);
  bSlider.position(10, 60);

  // create and position button, attach listener
  button = createButton('reset');
  button.position(10, 100);
  button.mousePressed(resetSliders);
}
 
function draw() {
  var r = rSlider.value();
  console.log(r);
  var g = gSlider.value();
  var b = bSlider.value();
  background(r, g, b);
};

function resetSliders() {
  rSlider.value(0);
  gSlider.value(0);
  bSlider.value(0);
}