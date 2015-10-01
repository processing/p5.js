var myJson, banana, strings, xml, table, myFont;

function success() {
  console.log('success');
}

function preload() {
  // first try with no callbacks
  myJson = loadJSON('http://api.openweathermap.org/data/2.5/weather?q=London,uk');
  banana = loadImage('banana.png');
  strings = loadStrings('test.txt');
  xml = loadXML('test.xml');
  table = loadTable('mammals.csv', 'csv', 'header');
  myFont = loadFont('AvenirNextLTPro-Demi.otf');

  // now try with callbacks
  myJson = loadJSON('http://api.openweathermap.org/data/2.5/weather?q=London,uk',
    success);
  banana = loadImage('banana.png', success);
  strings = loadStrings('test.txt', success);
  xml = loadXML('test.xml', success);
  table = loadTable('mammals.csv', 'csv', 'header', success);
  myFont = loadFont('AvenirNextLTPro-Demi.otf', success);
}

function setup(){
  createCanvas(400,400);

  // make sure success callbacks work outside of preload too
  myJson = loadJSON('http://api.openweathermap.org/data/2.5/weather?q=London,uk',
    success);
  banana = loadImage('banana.png', success);
  strings = loadStrings('test.txt', success);
  xml = loadXML('test.xml', success);
  table = loadTable('mammals.csv', 'csv', 'header', success);
  myFont = loadFont('AvenirNextLTPro-Demi.otf', success);

  noLoop();
}

function draw() {
  // image should draw if preload finishes
  image(banana);
}
