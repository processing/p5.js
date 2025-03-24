p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let myModel;
let starShader;
let starStrokeShader;
let stars;
let ditheringShader;

function starShaderCallback() {
  const time = uniformFloat(() => millis());
  getWorldInputs((inputs) => {
    inputs.position.y += instanceID() * 20 - 1000;
    inputs.position.x += 40 * sin(time * 0.001 + instanceID());
    return inputs;
  });
  getObjectInputs((inputs) => {
    inputs.position *= sin(time*0.001 + instanceID());
    return inputs;
  })
}

function ditheringCallback() {
  const time = uniformFloat(() => millis())
  
  function rand(co) {
    return fract(sin(dot(co, [12.9898, 78.233])) * 43758.5453);
  }
  
  function grayscale(col) {
    return 
  }

  getColor((input, canvasContent) => {
    let col = texture(canvasContent, input.texCoord);
    col.z = 0.55;
    col += rand(input.texCoord +  time/10000000000) * 0.15 - 0.05;
    let greyscale = dot([col.x, col.y, col.z], [0.21, 0.72, 0.07]);
    // col.x = greyscale;
    // col.y = greyscale;
    // col.z = greyscale;
    return col;
  });
}

async function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  stars = buildGeometry(() => sphere(20, 3, 3))
  starShader = baseMaterialShader().modify(starShaderCallback); 
  starStrokeShader = baseStrokeShader().modify(starShaderCallback)
  ditheringShader = baseFilterShader().modify(ditheringCallback);
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
  filter(ditheringShader)
  // push();
  // shader(baseMaterialShader());
  // noStroke();
  // rotateX(HALF_PI);
  // translate(0, 0, -250);
  // plane(10000)
  // pop();
}
