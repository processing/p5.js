p5.disableFriendlyErrors = true;

function callback() {

  getFinalColor((col) => {
    return ivec3(1, 2, 4).mult(2.0, 2, 3);
  });
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
  
}
