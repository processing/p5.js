var txt;
var lines = [
  '               Episode IV',
  '            A NEW HOPE',
  'It is a period of civil war.',
  'Rebel spaceships, striking',
  'from a hidden base, have won',
  'their first victory against',
  'the evil Galactic Empire.',
  '',
  'During the battle, Rebel',
  'spies managed to steal secret',
  "plans to the Empire's",
  'ultimate weapon, the DEATH',
  'STAR, an armored space',
  'station with enough power to',
  'destroy an entire planet.',
  '',
  "Pursued by the Empire's",
  'sinister agents, Princess',
  'Leia races home aboard her',
  'starship, custodian of the',
  'stolen plans that can save',
  'her people and restore',
  'freedom to the galaxy.....'
];

var font;
var txtWidth;

function preload() {
  font = loadFont('../../../p5.Font/Helvetica.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);
  textSize(width * 0.04);
  textAlign(LEFT, TOP);
  fill(238, 213, 75);

  txt = join(lines, '\n');

  txtWidth = 0;
  for (var i = 0; i < lines.length; i++) {
    txtWidth = max(txtWidth, textWidth(lines[i]));
  }
}

function draw() {
  background(0);

  rotateX(5 * PI / 16);
  text(txt, -txtWidth / 2, height / 2 - millis() / 30);
}
