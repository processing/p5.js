p5.disableFriendlyErrors = true;

function callback() {

  getFinalColor((col) => {
    let x = vec4(1);
    // return 1;
    return vec4(1).div(ivec4(1).mult(ivec4(2.0, 3.0, 2, 3)));
  });
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
  
}
