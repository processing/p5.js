let font;

function preload() {
  font = loadFont('../acmesa.ttf');
}

function setup() {
  const myDiv = createDiv('hello there');
  myDiv.style('font-family', 'acmesa');
}
