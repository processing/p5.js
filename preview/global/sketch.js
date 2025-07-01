p5.disableFriendlyErrors = true;

function callback() {
  let x = createFloat(1.0);
  getFinalColor((col) => {
    return x;
  })
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
}
