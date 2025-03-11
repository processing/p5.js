let myShader;
let myShader2;
p5.disableFriendlyErrors = true;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function calculateOffset() {
  return 30;
}

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  // // Raw example
  myShader = baseMaterialShader().modify(() => {
    const uCol = uniformVector4(0.1,0.1,0.1,1);
    const time = uniformFloat(()=>millis);
    getFinalColor((col) => {
      let x = createFloat(0.5);
      col.x = createFloat(time);
      col.w = 1;
      col /= uCol;
      return col;
    });
  }, { parser: true, srcLocations: true });

  console.log(myShader)
  // Create and use the custom shader.
  // myShader2 = baseMaterialShader().modify(
  //   () => {
  //     // const offset = uniformFloat('offset', 1)

  //     getFinalColor((pos) => {
  //       let a = createVector4(1, 2, 3);
  //       let b = createVector4(3, 4, 5);
  //       a = a.add(b);

  //       let c = a.add(b);
  //       // c += c.add(offset);
  //       // c.x = b.x.add(1);

  //       pos = pos.add(c);

  //       return pos;
  //     })
  //   },  { parser: false, srcLocations: true });
}

function draw(){
  // Set the styles
  background(0);
  // fill(0)
  shader(myShader);
  stroke('red')
  fill(255,0,0)
  // myShader.setUniform('uCol', [0.1,2,0,1])
  sphere(100);
}
