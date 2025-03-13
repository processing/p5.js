p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
let myShader;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

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
  orbitControl();
  background(0);
  shader(myShader);
  noStroke();
  fill(255,0,0)
  sphere(100);
}
