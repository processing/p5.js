var slider;

function setup() {

  // create canvas
  canvas = createCanvas(200, 200);

  // create and position sliders
  slider = createSlider(0, 1, 0.5, 0.1);

}
 
function draw() {
  var b = slider.value();
  background(b*255);
};

function mousePressed() {
  slider.value(0);
}