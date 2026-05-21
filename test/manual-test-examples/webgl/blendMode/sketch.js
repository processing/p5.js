var blendModeIndex = 0;
var backgroundColor = 255;
var w = 100;
var overlap = w / 10;
var colors;

var img;

function preload() {
  img = loadImage('../assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  var opac = 122;
  colors = [
    color(0, 0, 0, opac),
    color(255, 255, 255, opac),
    color(255, 0, 0, opac),
    color(0, 0, 255, opac),
    color(100, 0, 100, opac),
    color(0, 100, 0, opac),
    color(200, 200, 0, opac),
    color(0, 200, 200, opac),
    color(0, 255, 0, opac),
    color(0, 255, 255, opac)
  ];
}

function draw() {
  background(backgroundColor);
  for (var y = -w * 2, colorIndex = 0; y <= w * 2; y += w) {
    drawGradientRow(y, colors[colorIndex], colors[colorIndex + 1]);
    colorIndex += 2;
  }
  texture(img);
  plane(width / 4);
}

function drawGradientRow(y, fromColor, toColor) {
  push();
  var w = 100;
  translate(-width / 2, y, 0);
  for (var x = -width / 2; x < width / 2; x += w) {
    var col = lerpColor(
      fromColor,
      toColor,
      map(x, -width / 2, width / 2, 0, 1)
    );
    fill(col);
    translate(w - overlap, 0, 0);
    plane(w);
  }
  pop();
}

function keyPressed() {
  backgroundColor = backgroundColor === 255 ? 0 : 255;
}

function changeBanner(msg) {
  document.getElementById('gl-info').innerHTML =
    msg +
    '<br>' +
    'Click to change blendMode.<br>' +
    'Key to toggle white/black background.<br><br>' +
    '<em>Tests: blendMode</em><br><br>' +
    'Average FPS should be above 30 on a modern laptop/desktop';
}

function mousePressed() {
  let max = 7;
  blendModeIndex = blendModeIndex < max ? blendModeIndex + 1 : 0;
  switch (blendModeIndex) {
    case 0:
      blendMode(BLEND);
      changeBanner('current blendMode is BLEND');
      break;
    case 1:
      blendMode(SCREEN);
      changeBanner('current blendMode is SCREEN (invisible on white)');
      break;
    case 2:
      blendMode(MULTIPLY);
      changeBanner('current blendMode is MULTIPLY (invisible on black)');
      break;
    case 3:
      blendMode(REPLACE);
      changeBanner('current blendMode is REPLACE');
      break;
    case 4:
      blendMode(EXCLUSION);
      changeBanner('current blendMode is EXCLUSION');
      break;
    case 5:
      blendMode(SUBTRACT);
      changeBanner('current blendMode is SUBTRACT (invisible on black)');
      break;
    case 6:
      blendMode(DARKEST);
      changeBanner('current blendMode is DARKEST (invisible on black)');
      break;
    case 7:
      blendMode(LIGHTEST);
      changeBanner('current blendMode is LIGHTEST (invisible on white)');
      break;
  }
}
