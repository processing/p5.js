let myShader;
p5.disableFriendlyErrors = true;
function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create and use the custom shader.
  myShader = baseMaterialShader().modify(
    () => {
      const offset = uniform('offset', createVector3())
      getWorldPosition((pos) => {
        let a = createVector3(1, 2, 3);
        let b = createVector3(3, 4, 5);
        a = a.add(b);

        let c = a.add(b);
        c = c.add(offset);
        c.x = b.x.add(1);


        console.log("TEST:")
        console.log(c.x);
        pos = pos.add(c);

        return pos;
      })
    }
  );
}

function draw(){
  // Set the styles
  background(0)
}
