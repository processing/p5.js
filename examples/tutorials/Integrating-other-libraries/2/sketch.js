// Combinging a third-party JS library with a sketch
// Just use the normal third-party JS library code
// Usually, you want to use the third-party code in setup
// Unless you'd like to use things in certain event functions like mousePressed
// Look at the API page for more things a library can do:
// http://buzz.jaysalvat.com/documentation/sound/

// Initializing a variable using the third-party library buzz object
var mySound = new buzz.sound('rhodes_loop.wav');
var myImage;

function setup() {
  createCanvas(300, 300);
  myImage =  loadImage('red.jpg');
};

function draw() {
  background(255, 200, 200);
  image(myImage, 20, 20, 150, 150);
};

function mousePressed() {
  if (mouseX > 20 && mouseX < 170 && mouseY > 20 && mouseY < 170) {
    mySound.play(); // Start playing the sound
    mySound.loop(); // Loop the sound once it's playing
  }
}

function keyPressed() {
  mySound.stop(); // Stop the sound
}
