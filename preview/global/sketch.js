p5.disableFriendlyErrors = true;

function callback() {
  getFinalColor((col) => {
    let y = col.sub(-1,1,0,0);

    return mix(float(0), col.add(y), float(1));
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
