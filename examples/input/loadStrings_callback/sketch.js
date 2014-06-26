/**
 *  Load strings of text into an array of lines.
 *  Display a random line.
 */
var result;

function setup(){
  createCanvas(600,100);
  textAlign(CENTER);
  fill(0);
  noStroke();

  // showText is a function called by loadStrings when it's loaded.
  result = loadStrings('tenderbuttons.txt', showText);

  print('In setup(), there are ' + result.length + ' lines in the result');
}


function showText(){
  var randomLineNumber = floor(random(0, result.length-1));
  var randomLine = result[randomLineNumber];
  text(randomLine, width/2, height/2);

  print('In the callback function, there are ' + result.length + ' lines in the result');
  print('Displaying random line number ' + randomLineNumber);
  print('Reload the page for a different random line!');

}