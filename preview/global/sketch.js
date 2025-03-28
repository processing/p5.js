p5.disableFriendlyErrors = true;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let starShader;
let starStrokeShader;
let stars;
let originalFrameBuffer;
let pixellizeShader;
let fresnelShader;
let bloomShader;


function fresnelShaderCallback() {
  const fresnelPower = uniformFloat(2);
  const fresnelBias = uniformFloat(-0.1);
  const fresnelScale = uniformFloat(2);
  const mouseIntensity = uniformVector2(()=>[map(mouseX, 0, width, 0, 0.15), map(mouseY, 0, height, 0, 0.15)]);

  getCameraInputs((inputs) => {
    let n = normalize(inputs.normal);
    let v = normalize(0 - inputs.position);
    let base = 1.0 - dot(n, v);
    let fresnel = fresnelScale * pow(base, fresnelPower) + fresnelBias;
    let col = mix([mouseIntensity.y, 0, mouseIntensity.x], [1, .5, .7], fresnel);
    inputs.color = [col.x, col.y, col.z, 1];
    return inputs;
  });
}

function starShaderCallback() {
  const time = uniformFloat(() => millis());
  const skyRadius = uniformFloat(1000);
  
  function rand2(st) {
    return fract(sin(dot(st, [12.9898, 78.233])) * 43758.5453123);
  }

  function semiSphere() {
    let id = instanceID();
    let theta = rand2([id, 0.1234]) * TWO_PI;
    let phi = rand2([id, 3.321]) * PI+time/10000;
    let r = skyRadius;
    r *= 1.5 * sin(phi);
    let x = r * sin(phi) * cos(theta);
    let y = r *1.5* cos(phi);
    let z = r * sin(phi) * sin(theta);
    return [x, y, z];
  }

  getWorldInputs((inputs) => {
    inputs.position += semiSphere();
    return inputs;
  });

  getObjectInputs((inputs) => {
    let scale = 1 + 0.1 * sin(time * 0.002 + instanceID());
    inputs.position *= scale;
    return inputs;
  });
}

function pixellizeShaderCallback() {
  const pixelSize = uniformFloat(()=> width/2);
  getColor((input, canvasContent) => {
    let coord = input.texCoord;
    coord = floor(coord * pixelSize) / pixelSize;
    let col = texture(canvasContent, coord);
    return col;
  });
}

function bloomShaderCallback() {
  const preBlur = uniformTexture(() => originalFrameBuffer);
  getColor((input, canvasContent) => {
    const blurredCol = texture(canvasContent, input.texCoord);
    const originalCol = texture(preBlur, input.texCoord);
    const brightPass = max(originalCol - 0.3, 0.7) * 1.2;
    const bloom = originalCol + blurredCol * brightPass;
    return bloom;
  });
}

async function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  stars = buildGeometry(() => sphere(20, 4, 2))
  originalFrameBuffer = createFramebuffer();

  starShader = baseMaterialShader().modify(starShaderCallback); 
  starStrokeShader = baseStrokeShader().modify(starShaderCallback)
  fresnelShader = baseColorShader().modify(fresnelShaderCallback);
  bloomShader = baseFilterShader().modify(bloomShaderCallback);
  pixellizeShader = baseFilterShader().modify(pixellizeShaderCallback);
}

function draw(){
  originalFrameBuffer.begin();
  background(0);
  orbitControl(); 

  push()
  strokeWeight(4)
  stroke(255,0,0)
  rotateX(PI/2 + millis() * 0.0005);
  fill(255,100, 150)
  strokeShader(starStrokeShader)
  shader(starShader);
  model(stars, 5000);
  pop()

  push()
  shader(fresnelShader)
  noStroke()
  sphere(500);
  pop()

  filter(pixellizeShader);
  originalFrameBuffer.end();
  
  imageMode(CENTER)
  image(originalFrameBuffer, 0, 0)
  
  filter(BLUR, 20)
  filter(bloomShader);
}
