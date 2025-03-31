let font;
let geom;

async function setup() {
  createCanvas(200, 200, WEBGL);
  font = await loadFont('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf');

  geom = font.textToModel("Hello", 50, 0, { sampleFactor: 2 });
  geom.clearColors();
  geom.normalize();
}

function draw() {
  background(255);
  orbitControl();
  fill("red");
  strokeWeight(4);
  scale(min(width, height) / 300);
  model(geom);
  describe('A red non-extruded "Hello" in Anton on white canvas, rotatable via mouse.');
}
