let myShader;
let myShader2;

p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function calculateOffset() {
  return 30;
}

function myCol() {
  const col = (sin(millis() * 0.001) + 1)/2;
  return col;
}

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  myShader = baseMaterialShader().modify(() => {
    const uCol = uniformVector4(1,0, 0,1);
    const time = uniformFloat(() => millis());
    getFinalColor((color) => {
      color = uCol;
      color.y = 1;
      let x = createVector4(time);
      x.x += createFloat(2);
      color += x; 
      return color;
    });
    // getWorldInputs((Inputs) => {
    //   console.log(Inputs)
    // })
  }, { parser: true, srcLocations: true });
}

function draw(){
  background(0);
  shader(myShader);
  fill(0,0,0)
  sphere(100);
}

`(vec4 color) {
  // From at <computed> [as uniformVector4] (http://localhost:5173/p5.js:86002:25)
  vec4 temp_0 = uCol;
  temp_0 = vec4(temp_0.x, 1.0000, temp_0.z, temp_0.w);
  vec4 finalReturnValue = temp_0;
  return finalReturnValue;
}`
`
(vec4 color) {

// From at <computed> [as uniformVector4] (http://localhost:5173/p5.js:86002:25)
vec4 temp_0 = uCol;
temp_0 = vec4(temp_0.x, 1.0000, temp_0.z, temp_0.w);
vec4 finalReturnValue = temp_0 + vec4(0.0000 + 2.0000, 0.0000, 0.0000, 0.0000);
return finalReturnValue;
}`