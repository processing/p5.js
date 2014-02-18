// You can load strings from a text file using loadStrings().

var sentences;

function preload() {
  sentences = loadStrings('sentences.txt');
};

function setup() {
  createCanvas(1200, 400);
  setFrameRate(1);
  textAlign(CENTER);
  textSize(24); // sets the font size
  noStroke();

  // Iterate through the array of strings and print each one to console.
  for (var i=0; i<sentences.length; i++) {
    print(sentences[i]);
  }
};

function draw() {
	background(120, 80, 200);

  // Each frame, choose a random integer less than the length of the array.
  var n = floor(random(sentences.length));

  // Use this number to select a random element from the array.
  // Draw this line to the screen.
  text(sentences[n], width/2, height/2);
};