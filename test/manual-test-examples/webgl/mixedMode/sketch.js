
//To do: fix the call to normalMaterial in the mixedMode manual test to follow the current proper usage (hint: no arguments)


var theta = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background('white');
  colorMode(HSB);

  orbitControl();

  for (var i = 0; i < 500; i += 100) {
    push();
    translate(0, 0, i);
    //removed args
    normalMaterial();
    push();
    translate(0, cos(i + frameCount * 0.1) * 10, 0);
    box(20, 20, 20);
    pop();
    fill(i * 0.1, 100, 100);
    line(
      -100,
      sin(i + frameCount * 0.1) * 10,
      0,
      100,
      sin(i + frameCount * 0.1) * 10,
      0
    );
    pop();
  }
}
