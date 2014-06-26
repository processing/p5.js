/**
 *  Load strings of text into an array of lines.
 *  Display a random line.
 */
var result;

function preload() {
  result = loadStrings('tenderbuttons.txt');
}

function setup(){
  createCanvas(600,100);
  textAlign(CENTER);
  fill(0);
  noStroke();


  var randomLineNumber = floor(random(0, result.length-1));
  var randomLine = result[randomLineNumber];
  text(randomLine, width/2, height/2);

  print('There are ' + result.length + ' lines in the text');
  print('Displaying line number ' + randomLineNumber);
  print('Reload the page for a different random line');
}