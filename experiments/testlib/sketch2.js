var clicks = 0, presses = 1;
var img, img2, rad;
var lastAdd = 0;
var rads = 0;
var r;
var bg = [];
var writer;

var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);
	printMatrix();
	writer = new PrintWriter("name1");
};


var draw = function() {

	bg = [255*sin(.008*frameCount), 255*sin(.003*frameCount), 255*sin(.01*frameCount)];
	background(bg[0], bg[1], bg[2]);
	
	stroke(255, 255, 255);
	fill(255, 0, 0);

	translate(width/4, height/4);
	shearX(PI/4);
	rect(0, 0, 30, 30);
};

var mousePressed = function(e) {
	println("mouse pressed");
	//save("hi");
	//writer.close();
	saveStrings(['hi', 'blah']);
	clicks++;
};

var keyPressed = function(e) {
	keyCode = e.keyCode || e.which;
	key = String.fromCharCode(keyCode);
	println("key pressed "+keyCode+" "+key);
	writer.print(key);
	//alert('key pressed '+keyCode);
	presses++;
};

var keyReleased = function(e) {
	keyCode = e.keyCode || e.which;
	key = String.fromCharCode(keyCode);
};

var keyTyped = function(e) {
};

