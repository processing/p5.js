var font;

function preload() {
  font = loadFont('../acmesa.ttf');
}

function setup() {
  var myDiv = createDiv('hello there');
  myDiv.style('font-family', 'acmesa');
}
