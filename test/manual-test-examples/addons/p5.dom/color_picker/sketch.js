let inp1, inp2;
function setup() {
  createCanvas(100, 100);
  background('grey');
  const c1 = '#ff0000';
  inp1 = createColorPicker(c1);
  const c2 = color('yellow');
  inp2 = createColorPicker(c2);
  inp1.input(setShade1);
  inp2.input(setShade2);
  setMidShade();
}

function setMidShade() {
  // Finding a shade between the two
  const commonShade = lerpColor(inp1.color(), inp2.color(), 0.5);
  fill(commonShade);
  rect(20, 20, 60, 60);
}

function setShade1() {
  setMidShade();
  console.log('You are choosing shade 1 to be : ', this.value());
}
function setShade2() {
  setMidShade();
  console.log('You are choosing shade 2 to be : ', this.value());
}
