p5.disableFriendlyErrors = true;

function callback() {
  getFinalColor((col) => {
    let y = col.sub(-1,1,0,0);
    return col.add(y);
  });
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
  orbitControl();
  background(0);
  shader(bloomShader);
  sphere(100)
}
