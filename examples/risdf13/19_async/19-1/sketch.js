// JSON stands for JavaScript Object Notation
// It is a convenient way to make collections of data with key/value pairs.
//
// Syntax:
// { "key" : "value", "key" : "value", ... }
//
// person1
// key = "name"      value = "Morgan"
// key = "age"       value = "30"
// key = "location"  value = "Boston"
// key = "desire"    value = "Singing"
// key = "fear"      value = "Violence"

var person1 = {"name": "Morgan", "age": "30", "location": "Boston", "desire": "Singing", "fear": "Violence" };

var person2 = {
  "name": "Joss",
  "age": "42",
  "location": "Boston",
  "desire": "Hiking",
  "fear": "Irrationality"
};

function setup() {
  createCanvas(600, 400);
  noStroke();
  textSize(20);
};

function draw() {
	background(120, 180, 200);

  // person 1 bubble
  fill(155, 30, 180, 180);
  //
  // You can access JSON values by using a '.' followed by the key
  //
  // person1.name = "Morgan"
  // person2.name = "Joss"
  //
  ellipse(250, 200, person1.age*5, person1.age*5);  // person1.age = 30
  fill(255);
  text(person1.name, 210, 200); // person1.name = Morgan

  // person 2 bubble
  fill(180, 180, 34, 180);
  ellipse(350, 200, person2.age*5, person2.age*5);  // person2.age = 32
  fill(255);
  text(person2.name, 330, 200); // person2.name = Joss
};