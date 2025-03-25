p5.disableFriendlyErrors = true;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let myModel;
let starShader;
let starStrokeShader;
let waterShader;
let stars;
let originalFrameBuffer;
let pixellizeShader;
let fresnelShader;
let bloomShader;
let myCamera;

function fresnelShaderCallback() {
  const fresnelPower = uniformFloat(2);
  const fresnelBias = uniformFloat(-0.1);
  const fresnelScale = uniformFloat(2);
  const viewDir = uniformVector3();
  const time = uniformFloat(() => millis());

  getWorldInputs((inputs) => {
    let n = normalize(inputs.normal);
    let v = normalize(viewDir);
    
    let base = 1.0 - dot(n, v);
    let fresnel = fresnelScale * pow(base, fresnelPower) + fresnelBias;
    let col = mix([0,0,0], [1, .5, .7], fresnel);
    inputs.color = createVector4(col.x, col.y, col.z, 1);

    inputs.position.x += 10 * sin(inputs.position.z + time * 0.01);
    return inputs;
  });
}

function starShaderCallback() {
  const time = uniformFloat(() => millis());
  const skyRadius = uniformFloat(1000);
  
  function rand2(st) {
    return fract(sin(dot(st, createVector2(12.9898, 78.233))) * 43758.5453123);
  }

  function semiSphere() {
    let id = instanceID();
    let theta = rand2(createVector2(id, 0.1234)) * TWO_PI;
    let phi = rand2(createVector2(id, 3.321)) * PI+time/10000;
    let r = skyRadius;
    r *= 1.5 * sin(phi);
    let x = r * sin(phi) * cos(theta);
    let y = r *1.5* cos(phi);
    let z = r * sin(phi) * sin(theta);
    return createVector3(x, y, z);
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

function waterShaderCallback() {
  const time = uniformFloat(() => millis());
  const speed = uniformFloat(0.005);

  function getOffset(st) {
    st = st * 12 - 6;
    let d = length(st);
    return 0.5 + 0.5 * sin(d * 10.0 - time * speed);
  }

  getObjectInputs((inputs) => {
    const offset = getOffset(inputs.uv);
    inputs.position.z += offset * 200 - 100;
    return inputs;
  });

  getPixelInputs((inputs) => {
    const offset = getOffset(inputs.texCoord);
    inputs.color = createVector4(0, 0.3*offset, offset, 1); 
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
  blurredFrameBuffer = createFramebuffer();

  starShader = baseMaterialShader().modify(starShaderCallback); 
  starStrokeShader = baseStrokeShader().modify(starShaderCallback)
  console.log("FRESNEL")
  fresnelShader = baseColorShader().modify(fresnelShaderCallback);
  // waterShader = baseMaterialShader().modify(waterShaderCallback);
  bloomShader = baseFilterShader().modify(bloomShaderCallback);
  pixellizeShader = baseFilterShader().modify(pixellizeShaderCallback);

  let myCamera = createCamera();
  myCamera.setPosition(0, 0, 1000);
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
  let viewDir = [originalFrameBuffer.defaultCamera.eyeX, originalFrameBuffer.defaultCamera.eyeY, originalFrameBuffer.defaultCamera.eyeZ];
  fresnelShader.setUniform("viewDir", viewDir)
  stroke('cyan')
  sphere(500);
  pop()

  filter(pixellizeShader);
  originalFrameBuffer.end();
  
  imageMode(CENTER)
  image(originalFrameBuffer, 0, 0)
  
  filter(BLUR, 20)
  filter(bloomShader);
}
