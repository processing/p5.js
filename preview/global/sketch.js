p5.disableFriendlyErrors = true;

function callback() {
  getFinalColor((col) => {
    return mix(vec4(1,0, 1, 1), vec4(1, 1, 0.3, 1), float(1));
  });
}

async function setup(){
  createCanvas(windowWidth,windowHeight, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  orbitControl();
  background(0);
  shader(bloomShader);
  sphere(300)
}
