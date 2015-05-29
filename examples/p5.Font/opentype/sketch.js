var font;
var snapDistance = 72;
var textToRender = "p5*js";
var opFont;

function preload(){
  font = loadFont(opentype, 'AvenirNextLTPro-Demi.otf');
}

function setup(){
  createCanvas(720, 480);
  opFont = font.font;
  frameRate(24);
}

function draw() {
  background(237,34,93);

  if( snapDistance == -25) {
    snapDistance = 68;
  }

  var path = opFont.getPath(textToRender, 170, 275, 150, {kerning: true});
  path.fill = "#ffffff";
  var value = (snapDistance <= 0) ? 1: snapDistance;
  doSnap(path, value);
  path.draw(this.drawingContext);

  snapDistance --;
}

function doSnap(path, value) {
    var i;
    for (i = 0; i < path.commands.length; i++) {
        var cmd = path.commands[i];
        if (cmd.type !== 'Z') {
            cmd.x = snap(cmd.x, value, 1);
            cmd.y = snap(cmd.y, value, 1);
        }
        if (cmd.type === 'Q' || cmd.type === 'C') {
            cmd.x1 = snap(cmd.x1, value, 1);
            cmd.y1 = snap(cmd.y1, value, 1);
        }
        if (cmd.type === 'C') {
            cmd.x2 = snap(cmd.x2, value, 1);
            cmd.y2 = snap(cmd.y2, value, 1);
        }
    }
}

// Round a value to the nearest "step".
function snap(v, distance, strength) {
    return (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
}
