var teapot;

function preload() {
  teapot = loadModel('../wireframe/assets/teapot.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

var lights = [
  { c: '#f00', t: 1.12, p: 1.91, r: 0.2 },
  { c: '#0f0', t: 1.21, p: 1.31, r: 0.2 },
  { c: '#00f', t: 1.37, p: 1.57, r: 0.2 },
  { c: '#ff0', t: 1.12, p: 1.97, r: 0.7 },
  { c: '#0ff', t: 1.21, p: 1.37, r: 0.7 },
  { c: '#f0f', t: 1.37, p: 1.37, r: 0.7 }
];

function draw() {
  var t = millis() / 1000 + 1000;
  background(0);

  directionalLight(color('#111'), 1, 1, 1);

  for (var i = 0; i < lights.length; i++) {
    var light = lights[i];
    pointLight(
      color(light.c),
      p5.Vector.fromAngles(t * light.t, t * light.p, width * 2)
    );
  }

  specularMaterial(255);

  push();
  rotateX(millis() / 1000);
  rotateY(millis() / 987);
  rotateZ(millis() / 1234);

  scale(width / 250);
  //sphere(100);
  model(teapot);

  pop();
}

function mousePressed() {
  setAttributes('perPixelLighting', true);
  noStroke();
  specularMaterial(250);
}

function mouseReleased() {
  setAttributes('perPixelLighting', false);
  noStroke();
  specularMaterial(250);
}
