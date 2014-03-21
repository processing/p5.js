// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 9-11: Resizing an array using append()

var balls = [];
var gravity = 0.1;

function setup(){
  createCanvas(200,200);
  smooth();

  // Initialize array with just one Ball object
  balls[0] = new Ball(50,0,16);
}

function draw(){
  background(255);

  // Update and display all balls
  for (var i = 0; i < balls.length; i++ ) { // Whatever the length of that array, update and display all of the objects.
    balls[i].gravity();
    balls[i].move();
    balls[i].display();
  }
}

function mousePressed() {
  // A new ball object
  var b = new Ball(mouseX,mouseY,16); // Make a new object at the mouse location.
  console.log(b);
  console.log(balls);
  balls = append(balls,b);

  // Here, the function, append() adds an element to the end of the array.
  // append() takes two arguments. The first is the array you want to append to, and the second is the thing you want to append.
  // You have to reassign the result of the append() function to the original array.
  // In addition, the append() function requires that you explicitly state the type of data in the array again by putting the
  // array data type in parentheses: (Ball[]) This is known as casting.
}




function Ball (tempX, tempY, tempW) {
  this.x = tempX;
  this.y = tempY;
  this.w = tempW;
  this.speed = 0;
}

Ball.prototype.gravity = function() {
  // Add gravity to speed
  this.speed = this.speed + gravity;
};

Ball.prototype.move = function() {
  // Add speed to y location
  this.y = this.y + this.speed;
  // If square reaches the bottom
  // Reverse speed
  if (this.y > height) {
    this.speed = this.speed * -0.95;
    this.y = height;
  }
};

Ball.prototype.display = function() {
  // Display the circle
  fill(175);
  stroke(0);
  ellipse(this.x, this.y, this.w, this.w);
};
