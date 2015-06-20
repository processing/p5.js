var font;
var snapDistance = 71;

function preload() {

  font = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup() {

  createCanvas(720, 480);
  frameRate(24);
  fill(255);
  textSize(150);
}

function draw() {

  background(237,34,93);

  var path = font._getPath('p5*js', 170, 275);
  doSnap(path, snapDistance);
  font._renderPath(path);

  if (--snapDistance == -26) {
    snapDistance = 67;
  }
}

function doSnap(path, dist) {

    var i, value = (dist <= 0) ? 1: dist;

    for (i = 0; i < path.commands.length; i++) {
        var cmd = path.commands[i];
        if (cmd.type !== 'Z') {
            cmd.x = snap(cmd.x, value);
            cmd.y = snap(cmd.y, value);
        }
        if (cmd.type === 'Q' || cmd.type === 'C') {
            cmd.x1 = snap(cmd.x1, value);
            cmd.y1 = snap(cmd.y1, value);
        }
        if (cmd.type === 'C') {
            cmd.x2 = snap(cmd.x2, value);
            cmd.y2 = snap(cmd.y2, value);
        }
    }
}

// Round a value to the nearest "step".
function snap(v, distance) {

    return Math.round(v / distance) * distance;
}
