p5.disableFriendlyErrors = true;

function callback() {

  getFinalColor((col) => {

    // return vec3(1, 2, 4).add(float(2.0).sub(10));
    return (float(10).sub(10));
  });
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
  
}
