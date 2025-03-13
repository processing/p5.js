p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let myShader;

function myCol() {
  const col = (sin(millis() * 0.001) + 1)/2;
  return col;
}

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  myShader = baseMaterialShader().modify(() => {
    const time = uniformFloat(() => sin(millis()*0.001));
    getFinalColor((col) => {
      col.x = uvCoords().x;
      col.y = uvCoords().y;
      return col;
    });
    getWorldInputs((inputs) => {
      inputs.position.x += time * inputs.position.y;
      return inputs;
    })
  }, { parser: true, srcLocations: false });
}

function draw(){
  orbitControl();
  background(0);
  shader(myShader);
  noStroke();
  fill(255,0,0)
  sphere(100);
}

// `(vec4 color) {
//   // From at <computed> [as uniformVector4] (http://localhost:5173/p5.js:86002:25)
//   vec4 temp_0 = uCol;
//   temp_0 = vec4(temp_0.x, 1.0000, temp_0.z, temp_0.w);
//   vec4 finalReturnValue = temp_0;
//   return finalReturnValue;
// }`
// `
// (vec4 color) {

// // From at <computed> [as uniformVector4] (http://localhost:5173/p5.js:86002:25)
// vec4 temp_0 = uCol;
// temp_0 = vec4(temp_0.x, 1.0000, temp_0.z, temp_0.w);
// vec4 finalReturnValue = temp_0 + vec4(0.0000 + 2.0000, 0.0000, 0.0000, 0.0000);
// return finalReturnValue;
// }`