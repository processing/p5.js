var myJson;

function preload() {
  myJson = loadJSON('invalid.json');
}

function setup(){
  createCanvas(300, 300);
}

function draw() {
  text(myJson[0].a, 10, 10);
}
