function setup() {

  var canvas = createCanvas(200, 200);
  canvas.class("testC something");

  var html = createHTML("Some text:");
  html.id("test");
  html.class("testC");
  html.position(100,50);

}

function draw() {
	background(150);
	ellipse(mouseX, mouseY, 10, 10);
}

function mousePressed() {
	console.log("hi")
  var test = getId("test");
  console.log(test);
}


function keyPressed() {
  var test = getClass("testC");
  console.log(test);
  for (var i=0; i<test.length; i++) {
  	test[i].position(300, 300);
  }
}