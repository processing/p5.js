// You can load JSON from other files by using loadJSON().
// The file must end in .js, be properly formatted, and be in 
// the same folder as this sketch.js file.
// JSON can be embedded within itself, so a key's value can itself be a JSON object.
/* {
  "person1": { 
    "name": "Morgan",
    "age": "30",
    "location": "Boston",
    "desire": "Singing",
    "fear": "Violence"
  },
  "person2" : {
    "name": "Joss",
    "age": "42",
    "location": "Boston",
    "desire": "Hiking",
    "fear": "Irrationality"
  }
} */
// In the above JSON, person1 is a key, and the right-hand side of the colon is the value, a JSON object.
// Similarly, person2 is a key, and the right-hand side of the colon is the value, a JSON object.

var people;

// Use loadJSON() in the preload() function to ensure that
// it will load completely by the time setup() runs.
function preload() {
  people = loadJSON('people.js');
}

function setup() {
  console.log(people); // console log to see the loaded JSON it in the dev tools
  createCanvas(600, 400);
  noLoop();
  noStroke();
};

function draw() {
  background(120, 180, 200);
 
  // To access loaded JSON, the syntax is:
  // [variable name].[key].[key]...
  drawBubble(people.person1.name, people.person1.age); // people is the variable, person1 is a key, name is a key
  drawBubble(people.person2.name, people.person2.age); // people is the variable, person2 is a key, name is a key
};

function drawBubble(name, age) {
  var posX = random(width);
  var posY = random(height);
  fill(random(255), random(255), random(255), 180);
  ellipse(posX, posY, age*5, age*5)
  fill(255);
  text(name, posX - 10, posY);
}