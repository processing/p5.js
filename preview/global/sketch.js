p5.disableFriendlyErrors = true;

function callback() {
  // getFinalColor((col) => {
  //   let x = [12, 1];
  //   let y= [10, 100];
  //   let z = [x, y];
  //   return mix(vec4([1,0], 1, 1), z, 0.4);
  // });
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
