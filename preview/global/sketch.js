// p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
let myShader;
let filterShader;
let video;


async function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  // filterShader = baseFi

  filterShader = baseFilterShader().modify(() => {
    const time = uniformFloat(() => millis());

    getColor((input, canvasContents) => {
      let myColor = texture(canvasContents, uvCoords());
      const d = distance(input.texCoord, [0.5, 0.5]);
      myColor.x = smoothstep(0, 0.5, d);
      myColor.y = sin(time*0.001)/2;
      return myColor;
    })
  });

  myShader = baseMaterialShader().modify(() => {
    const time = uniformFloat(() => millis());

    getFinalColor((col) => {
      col.x = uvCoords().x;
      col.y = uvCoords().y;
      col.z = 1;
      return col;
    });

    getWorldInputs((inputs) => {
      inputs.position.y += 20 * sin(time * 0.001 + inputs.position.x * 0.05);
      return inputs;
    })
  });
}

function draw(){
  // orbitControl();
  background(0);
  noStroke();
  fill('blue')
  sphere(100)
  shader(myShader);
  filter(filterShader);
  // filterShader.setUniform('time', millis());
}
