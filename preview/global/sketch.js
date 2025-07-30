p5.disableFriendlyErrors = true;

function callback() {
  const time = uniformFloat(() =>millis()*0.001)
  // getFinalColor((col) => {
    // return vec4(1,0,0,1).rgba;
  // });

  getWorldInputs(inputs => {
    // strandsIf(inputs.position === vec3(1), () => 0).Else()
    console.log(inputs.position);
    inputs.color = vec4(inputs.position.xyz, 1);
    inputs.position = inputs.position + sin(time) * 100;
    return inputs;
  });
}

async function setup(){
  createCanvas(windowWidth,windowHeight, WEBGL)
  bloomShader = baseColorShader().newModify(callback);
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
