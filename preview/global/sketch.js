p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let myModel;
let starShader;
let starStrokeShader;
let stars;
let ditheringShader;
let originalFrameBuffer;
let blurredFrameBuffer;

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
    return dot([col.x, col.y, col.z], [0.21, 0.72, 0.07])
  }

  getColor((input, canvasContent) => {
    let col = texture(canvasContent, input.texCoord);
    col.z = 0.55;
    col += rand(input.texCoord +  time/10000000000) * 0.15 - 0.05;
    let greyscaleValue = grayscale(col);
    col.x = greyscaleValue
    col.y = greyscaleValue
    return col;
  });
}

function bloom() {
  const blurred = uniformTexture(() => blurredFrameBuffer);
  const original = uniformTexture(() => originalFrameBuffer);

  getColor((input, canvasContent) => {
    const blurredCol = texture(blurred, input.texCoord);
    const originalCol = texture(original, input.texCoord);
    const brightPass = max(originalCol - 0.0, 0.0) * 3.0;
    // const bloom = original + blurred * brightPass;
    // return bloom;
    return texture(blurred, input.texCoord) + texture(original, input.texCoord);
  });
}

async function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  stars = buildGeometry(() => sphere(20, 3, 3))
  starShader = baseMaterialShader().modify(starShaderCallback); 
  starStrokeShader = baseStrokeShader().modify(starShaderCallback)
  ditheringShader = baseFilterShader().modify(ditheringCallback);
  originalFrameBuffer = createFramebuffer();
  blurredFrameBuffer = createFramebuffer();
  bloomShader = baseFilterShader().modify(bloom);
}

function draw(){
  originalFrameBuffer.begin();
  orbitControl();
  background(0,0,0);
  push();
  stroke(255,0,255)
  fill(255,200,255)
  strokeShader(starStrokeShader)
  shader(starShader);
  model(stars, 100);
  pop();
  originalFrameBuffer.end();
  
  blurredFrameBuffer.begin();
    image(originalFrameBuffer, -windowWidth/2, -windowHeight/2)
    filter(BLUR)
  blurredFrameBuffer.end();

  // image(originalFrameBuffer, -windowWidth/2, -windowHeight/2)
  filter(bloomShader);
}
