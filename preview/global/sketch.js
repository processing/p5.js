p5.disableFriendlyErrors = true;

function callback() {

  getFinalColor((col) => {
    let x = createFloat(2.5);

    strandsIf(x.greaterThan(createFloat(0.0)), () => {
      return {x: createFloat(100)}
    }).Else();
    // strandsIf(x.greaterThan(createFloat(0.0)), () => {
    //   strandsIf(x.greaterThan(createFloat(0.0)), () => {
    //     return x = createFloat(100);
    //   });
    //   return x = createFloat(100);
    // });

    return x;
  });
}

async function setup(){
  createCanvas(300,400, WEBGL)
  bloomShader = baseColorShader().newModify(callback, {parser: false});
}

function draw(){
}
