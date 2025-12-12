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
    let y = r * 1.5 * cos(phi);
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
  const pixelSize = uniformFloat(()=> width*.75);
  getColor((input, canvasContent) => {
    let coord = input.texCoord;
    coord = floor(coord * pixelSize) / pixelSize;
    let col = texture(canvasContent, coord);
    return col;
  });
}

/**
 * bloomShaderCallback
 *
 * Example: using common p5 values as uniforms for a p5.strands shader.
 *
 * This example shows how to bridge p5.js runtime values into the p5.strands
 * shader callback using uniform setters so the shader can respond to input
 * (mouse), canvas resolution, and time/frame data.
 *
 * Example GLSL declarations (for your bloom.frag):
 *   uniform vec2 mouse;
 *   uniform vec2 resolution;
 *   uniform float millis;
 *   uniform float frameCount;
 *   uniform float deltaTime;
 *
 * Example fragment usage (informational):
 *   vec2 uv = gl_FragCoord.xy / resolution;
 *   float t = millis * 0.001;
 *   float mouseInfluence = smoothstep(0.0, 1.0, abs((mouse.x / resolution.x) - uv.x));
 *   float timePulse = 0.5 + 0.5 * sin(t * 2.0 + frameCount * 0.01);
 *   float glow = mouseInfluence * timePulse;
 *
 * @memberof p5.strands
 */

function bloomShaderCallback() {
  const preBlur = uniformTexture(() => originalFrameBuffer);
  const mouse = uniformVec2(() => [mouseX, mouseY]);
  const resolution = uniformVec2(() => [width, height]);
  const millisUniform = uniformFloat(() => millis());
  const frameCountUniform = uniformFloat(() => frameCount);
  const deltaTimeUniform = uniformFloat(() => deltaTime);

  getColor((input, canvasContent) => {
    const uv = input.texCoord;
    const blurredCol = texture(canvasContent, uv);
    const originalCol = texture(preBlur, uv);

    // Simple animated bloom effect
    const brightness = dot(originalCol.rgb, vec3(0.2126, 0.7152, 0.0722));
    const pulse = sin(millisUniform * 0.001 + uv.x * 10.0);
    const bloomGlow = originalCol.rgb * smoothstep(0.8, 1.0, brightness * pulse);

    return vec4(originalCol.rgb + bloomGlow, originalCol.a);
  });
}


async function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  stars = buildGeometry(() => sphere(30, 4, 2))
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
  model(stars, 2000);
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
