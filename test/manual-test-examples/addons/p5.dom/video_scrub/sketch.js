var fingers;
var slider;

function setup() {
  noCanvas();
  fingers = createVideo('../fingers.mov', videoReady);
}

function videoReady() {
  var len = fingers.duration();
  slider = createSlider(0, len, 0, 0.1);
  slider.input(scrub);
}

function scrub() {
  fingers.time(slider.value());
}

