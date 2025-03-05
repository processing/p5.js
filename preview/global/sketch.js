let myShader;
p5.disableFriendlyErrors = true;

function calculateOffset() {
  return 30;
}

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  // // Raw example
  myShader = baseMaterialShader().modify(() => {

    const offset = uniformFloat(1);

    getFinalColor((col) => {
      let a = createVector4(1, 2, 3, 4);
      let b = createVector4(3, 4, 5, 6);
      a = (a * b + offset) / 10;
      col += a;
      return col;
    });
  });


  // Create and use the custom shader.
  // myShader = baseMaterialShader().modify(
  //   () => {
  //     const offset = uniformFloat('offset', () => calculateOffset)

  //     getWorldPosition((pos) => {
  //       let a = createVector3(1, 2, 3);
  //       let b = createVector3(3, 4, 5);
  //       a = a.add(b);

  //       let c = a.add(b);
  //       c += c.add(offset);
  //       c.x = b.x.add(1);


  //       pos = pos.add(c);

  //       return pos;
  //     })
  //   }
  // );
}

function draw(){
  // Set the styles
  background(0)
}
