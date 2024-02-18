// function setup() {
//  // put setup code here
// }

// function draw() {
//   // put drawing code here
// }

let cam;
let delta = 0.01;

function setup() {
  createCanvas(500, 500, WEBGL);
  normalMaterial();
  cam = createCamera();
  // set initial pan angle
  cam.roll(-0.8);
}

function draw() {
  background(1000);

  // pan camera according to angle 'delta'
  cam.roll(delta);

  // every 160 frames, switch direction
  if (frameCount % 160 === 0) {
    delta *= -1;
  }

  rotateX(frameCount * 0.01);
  translate(0, 0, -100);
  box(20);
  translate(0, 0, 35);
  box(20);
  translate(0, 0, 35);
  box(20);
  translate(0, 0, 35);
  box(20);
  translate(0, 0, 35);
  box(20);
  translate(0, 0, 35);
  box(20);
  translate(0, 0, 35);
  box(20);
}