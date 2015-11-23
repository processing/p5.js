var myJson, banana, strings, xml, myTable, myFont, successCount = 0;
var myJson2, banana2, strings2, xml2, myTable2, myFont2;

function successJSON() {
  successCount++;
  console.log('success loadJSON');
}

function successImage() {
  successCount++;
  console.log('success loadImage');
}

function successStrings() {
  successCount++;
  console.log('success loadStrings');
}

function successXML() {
  successCount++;
  console.log('success loadXML');
}

function successTable() {
  successCount++;
  console.log('success loadTable');
}

function successFont() {
  successCount++;
  console.log('success loadFont');
}

function preload() {
  // try with callbacks
  myJson = loadJSON('test.json', successJSON);
  banana = loadImage('banana.png', successImage);
  strings = loadStrings('test.txt', successStrings);
  xml = loadXML('test.xml', successXML);
  myTable = loadTable('mammals.csv', 'csv', 'header', successTable);
  myFont = loadFont('AvenirNextLTPro-Demi.otf', successFont);

  // try with no callbacks
  myJson2 = loadJSON('test.json');
  banana2 = loadImage('banana.png');
  strings2 = loadStrings('test.txt');
  xml2 = loadXML('test.xml');
  myTable2 = loadTable('mammals.csv', 'csv', 'header');
  myFont2 = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup(){
  createCanvas(400, 900);
}

function draw() {
  clear();
  var y = 0;

  // If preload finished successfully all of these should be drawn

  image(banana, 0, y);
  image(banana2, 0, y += 50);

  text(myJson.a, 0, y += 50);
  text(myJson2.a, 0, y += 50);

  text(strings.length, 0, y += 50);
  text(strings2.length, 0, y += 50);

  text(xml.toString(), 0, y += 50);
  text(xml2.toString(), 0, y += 50);

  text(myTable.rows.length, 0, y += 50);
  text(myTable2.rows.length, 0, y += 50);

  textFont(myFont);
  textSize(16);
  text('myFont', 0, y += 50);

  textFont(myFont2);
  textSize(16);
  text('myFont2', 0, y += 50);

  text('Success count should be 6: ' + successCount, 0, y + 50);
}
