var clicks = 0;
var img;

var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);
	img = loadImage("http://mollysoda.biz/GIFS/femalesign.gif");
	//noLoop();
};


var draw = function() {
	background(255*sin(.008*frameCount), 255*sin(.003*frameCount), 255*sin(.01*frameCount));
	noStroke();
	translate(200, 200);
	rotate(clicks/10);
	rect(0, 0, 200, 200);
	stroke(255, map(mouseX, 0, width, 0, 255), map(mouseY, 0, height, 0, 255));
	strokeWeight(10);
	translate(clicks*5, 0);
	line(50, 30, 400, 400);
	image(img, 300, 40, 200, 200*img.height/img.width);
};

var mousePressed = function() {
	println("mouse pressed");
	clicks++;
};