var img;

var setup = function() {
	console.log("setup");

	createGraphics(600, 400);

	print("hi")
	setFrameRate(10)

	img = loadImage("http://cdn.theatlantic.com/static/mt/assets/science/Screen%20Shot%202012-08-29%20at%201.45.48%20PM.png");
	imageMode(CENTER);
};

var draw = function() {

	background(20, 100, 230);
	image(img, width/2, height/2, 30, 10);

	image(img, mouseX, mouseY);



	// fill(255, 0, 100);


	// scale(10, 2);
	// rect(0, 0, 10, 10);

	// x+= 10;

	// fill(255, 100, 0);

	// strokeWeight(3);
	// ellipse(x, 50, 33, 33);  // Left circle


	// strokeWeight(0);
	// ellipse(200, 50, 33, 33);  // Right circle

	// pushStyle();  // Start a new style
	// 	strokeWeight(10);
	// 	fill(204, 153, 0);
	// 	ellipse(50, 50, 33, 33);  // Middle circle
	// popStyle();  // Restore original style

	// ellipse(100, 50, 33, 33);  // Right circle

	// ellipse(0, 50, 33, 33);  // Left circle

	// pushStyle();  // Start a new style
	// 	strokeWeight(10);
	// 	fill(204, 153, 0);
	// 	ellipse(33, 50, 33, 33);  // Left-middle circle

	// 	pushStyle();  // Start another new style
	// 		stroke(0, 102, 153);
	// 		ellipse(66, 50, 33, 33);  // Right-middle circle
	// 	popStyle();  // Restore previous style

	// popStyle();  // Restore original style

	// ellipse(100, 50, 33, 33);  // Right circle
};

var keyPressed = function() {
	println("key: |" + key + "| (" + keyCode + ")");
	save();
};