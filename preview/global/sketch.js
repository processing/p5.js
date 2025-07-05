p5.disableFriendlyErrors = true;

function callback() {
  // let x = createFloat(1.0);

  getFinalColor((col) => {
    let y = createFloat(10);
    let x = y.add(y);

    strandsIf(x.greaterThan(createFloat(0.0)), () => {
        x = createFloat(20);
      strandsIf(x.greaterThan(createFloat(0.0)), () => {
        x = createFloat(20);
      });
    });
    strandsIf(x.greaterThan(createFloat(0.0)), () => {
        x = createFloat(20);
    });
    const z = createFloat(200);

    return x.add(z);
  });
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
}
