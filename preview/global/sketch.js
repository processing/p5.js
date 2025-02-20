let myShader;
p5.disableFriendlyErrors = true;

function calculateOffset() {
  return 30;
}

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Raw example
  myShader = baseMaterialShader().modify(() => {
    const offset = calculateOffset();

    getWorldPosition((pos) => {
      let a = createVector3(1, 2, 3);
      let b = createVector3(3, 4, 5);

      a = (a * b + offset) / 10;

      pos += a;

      return pos;
    });
  });


  // Create and use the custom shader.
  // myShader = baseMaterialShader().modify(
  //   () => {
  //     const offset = uniform('offset', () => calculateOffset)

  //     getWorldPosition((pos) => {
  //       let a = createVector3(1, 2, 3);
  //       let b = createVector3(3, 4, 5);
  //       a = a.add(b);

  //       let c = a.add(b);
  //       c = c.add(offset);
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
