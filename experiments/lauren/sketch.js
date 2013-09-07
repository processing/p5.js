
var lastMillis = 0;


var setup = function() {
	console.log("setup");

	var cnv = createGraphics(100, 500);
	cnv.class("test")
	cnv.id("cnv")


	var text = createElement("The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. v The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. v The quick brown fox jumped over the lazy dog.");
	text.class("test")
	text.size(600, 200);

	context(cnv)

	print("hi")
	setFrameRate(1)
};

var draw = function() {

	var c = get("test");

	if (millis() - lastMillis > 500) {
		for (i=0; i<c.length; i++) {
			console.log(i);
			c[i].size(c[i].width+pow(-1,i)*20, c[i].height+pow(-1,i+1)*20);
		}
		lastMillis = millis();
	}

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