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

    const offset = uniformFloat(1);

    getFinalColor((col) => {
      let a = createVector4(1, 2, 3, 4);
      let b = createVector4(3, 4, 5, 6);
      a = (a * b + offset) / 10;
      col += a;
      return col;
    });
    // getWorldInputs((Inputs) => {
    //   console.log(Inputs)
    // })
  }, { parser: true, srcLocations: true });
}

function draw(){
  // Set the styles
  background(0)
}
