/**
 *  Load strings of text into an array of lines.
 *
 *  Display a random line every time the mouse is clicked.
 */

let result;

function setup() {
  createCanvas(600, 100);
  textAlign(CENTER);
  fill(0);
  noStroke();

  // pickLine is a function called by loadStrings when it's loaded.
  result = loadStrings('tenderbuttons_excerpt.txt', pickLine);

  print('In setup(), there are ' + result.length + ' lines in the result');
}

function pickLine() {
  background(255);
  const randomLineNumber = floor(random(0, result.length - 1));
  const randomLine = result[randomLineNumber];
  text(randomLine, width / 2, height / 2);

  print(
    'Displaying random line number ' + randomLineNumber + ' of ' + result.length
  );
  print('Click the mouse to display a different random line!');
}

// refresh text every time the mouse is clicked
function mouseClicked() {
  pickLine();
}
