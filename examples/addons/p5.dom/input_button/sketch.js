var canvas, input, button, greeting;

function setup() {

  // create canvas
  canvas = createCanvas(400, 150);
  canvas.position(0, 0);

  input = createInput('enter your name');
  input.position(10, 10);

  button = createButton('submit');
  button.position(140, 10);
  button.mousePressed(greet);

  greeting = createH1('');
  greeting.position(10, 15);
  greeting.size(380, 300);
  noStroke();

}

function greet() {
  var name = input.value();
  greeting.html('hello '+name+'!');

  background(random(255), random(255), random(255));
  for (var i=0; i<name.length; i++) {
    ellipse(random(width), random(height), 20, 20);
  }
}
