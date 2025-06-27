p5.disableFriendlyErrors = true;

function bloomShaderCallback() {
  createFloat(1.0);
}

async function setup(){
  bloomShader = baseFilterShader().newModify(bloomShaderCallback);
}

function draw(){
}
