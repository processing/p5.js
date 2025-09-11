p5.disableFriendlyErrors = true;

function callback() {
  const time = uniformFloat(() =>millis()*0.001)
  getFinalColor((col) => {
    let test = vec3(1)
    col.gra = test;
    return col;
  });

  getWorldInputs(inputs => {
    inputs.color = vec4(inputs.position, 1);
    // inputs.position = inputs.position + sin(time) * 100;
    return inputs;
  });
}

async function setup(){
  createCanvas(windowWidth,windowHeight, WEBGL)
  bloomShader = baseColorShader().modify(callback);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  orbitControl();
  background(0);
  shader(bloomShader);
  noStroke();
  sphere(300)
}
