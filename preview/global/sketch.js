p5.disableFriendlyErrors = true;

function callback() {
  getFinalColor((col) => {

    return [1, 1, 0, 1];
  });
  getWorldInputs(inputs => {
    return inputs;
  })
}

async function setup(){
  createCanvas(windowWidth,windowHeight, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  orbitControl();
  background(0);
  shader(bloomShader);
  sphere(300)
}
