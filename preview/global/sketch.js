p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let myModel;
let starShader;
let starStrokeShader;
let stars;

function starShaderCallback() {
  const time = uniformFloat(() => millis());
  getWorldInputs((inputs) => {
    inputs.position.y += instanceID() * 20 - 1000;
    inputs.position.x += 40*sin(time * 0.001 + instanceID());
    return inputs;
  });
  getObjectInputs((inputs) => {
    inputs.position *= sin(time*0.001 + instanceID());
    return inputs;
  })
}

async function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  stars = buildGeometry(() => sphere(20, 7, 4))
  starShader = baseMaterialShader().modify(starShaderCallback); 
  starStrokeShader = baseStrokeShader().modify(starShaderCallback)
}

function draw(){
  background(0,200,240);
  orbitControl();
  // noStroke();
  
  push();
  stroke(255,0,255)
  fill(255,200,255)
  strokeShader(starStrokeShader)
  shader(starShader);
  model(stars, 100);
  pop();
  push();
  shader(baseMaterialShader());
  noStroke();
  rotateX(HALF_PI);
  translate(0, 0, -250);
  plane(10000)
  pop();
}
