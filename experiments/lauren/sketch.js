
var lastMillis = 0;


var setup = function() {
	console.log("setup");

	var cnv = createGraphics(1000, 500);
	cnv.class("hi")
	print("hi")
};

var draw = function() {

	// console.log(focused);
	background(255, 0, 0);
	var s = "The quick brown fox jumped over the lazy dog.";
	fill(50);
	textLeading(30);
	textStyle(BOLD);
	///textFont('sans-serif');
	textFont('action_manregular');
	rectMode(CORNER)
	text(s, 10, 10, 100, 100);  // Text wraps within text box


	var c = get("hi")[0];
	if (millis() - lastMillis > 2000) {
		c.size(c.width-10, c.height+10);
		lastMillis = millis();
	}

	// ellipse(0, 50, 33, 33);  // Left circle

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
};