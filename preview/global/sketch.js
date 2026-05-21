let instancedShader;
let instancedStrokeShader;
let stars;
let originalImage;
let pixelateShader;
let fresnelShader;
let bloomShader;

function fresnelShaderCallback() {
  const fresnelPower = uniformFloat(2);
  const fresnelBias = uniformFloat(-0.1);
  const fresnelScale = uniformFloat(2);

  getCameraInputs((inputs) => {
    let n = normalize(inputs.normal);
    let v = normalize(-inputs.position);
    let base = 1.0 - dot(n, v);
    let fresnel = fresnelScale * pow(base, fresnelPower) + fresnelBias;
    let col = mix([0, 0, 0], [1, .5, .7], fresnel);
    inputs.color = [col, 1];
    return inputs;
  });
}

function starShaderCallback() {
  const time = uniformFloat(() => millis());
  const skyRadius = uniformFloat(250);
  
  function rand2(st) {
    return fract(sin(dot(st, [12.9898, 78.233])) * 43758.5453123);
  }

  function semiSphere() {
    let id = instanceID();
    let theta = rand2([id, 0.1234])  * TWO_PI + time / 100000;
    let phi = rand2([id, 3.321]) * PI + time / 50000;
  
    let r = skyRadius;
    r *= sin(phi);
    let x = r * sin(phi) * cos(theta);
    let y = r * 1.5 * cos(phi);
    let z = r * sin(phi) * sin(theta);
    return [x, y, z];
  }

  getWorldInputs((inputs) => {
    inputs.position += semiSphere();
    return inputs;
  });

  getObjectInputs((inputs) => {
    let size = 1 + 0.5 * sin(time * 0.002 + instanceID());
    inputs.position *= size;
    return inputs;
  });
}

function pixelateShaderCallback() {
  const pixelCountX = uniformFloat(()=> 280);

  getColor((inputs, canvasContent) => {
    const aspectRatio = inputs.canvasSize.x / inputs.canvasSize.y;
    const pixelSize = [pixelCountX, pixelCountX / aspectRatio];

    let coord = inputs.texCoord;
    coord = floor(coord * pixelSize) / pixelSize;

    let col = getTexture(canvasContent, coord);
    return col//[coord, 0, 1];
  });
}

function bloomShaderCallback() {
  const preBlur = uniformTexture(() => originalImage);

  getColor((input, canvasContent) => {
    const blurredCol = getTexture(canvasContent, input.texCoord);
    const originalCol = getTexture(preBlur, input.texCoord);

    const intensity = max(originalCol, 0.1) * 12.2;
    const bloom = originalCol + blurredCol * intensity;
    return [bloom.rgb, 1];
  });
}

async function setup(){
  createCanvas(800, 600, WEBGL);
  pixelDensity(1);
  stars = buildGeometry(() => sphere(8, 4, 2))
  originalImage = createFramebuffer();

  starShader = baseMaterialShader().modify(starShaderCallback); 
  starStrokeShader = baseStrokeShader().modify(starShaderCallback)
  fresnelShader = baseColorShader().modify(fresnelShaderCallback);
  bloomShader = baseFilterShader().modify(bloomShaderCallback);
  pixelateShader = baseFilterShader().modify(pixelateShaderCallback);
}

function draw(){
  originalImage.begin();
  background(0);
  orbitControl();

  push()
  strokeWeight(2)
  stroke(255,0,0)
  rotateX(PI/2 + millis() * 0.0005);
  fill(255,100, 150)
  strokeShader(starStrokeShader)
  shader(starShader);
  model(stars, 1000);
  pop()

  push()
  shader(fresnelShader)
  noStroke()
  sphere(90);
  filter(pixelateShader);
  pop()

  originalImage.end();
  
  imageMode(CENTER)
  image(originalImage, 0, 0)
  
  filter(BLUR, 15)
  filter(bloomShader);
}