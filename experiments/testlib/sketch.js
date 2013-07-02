var clicks = 0, presses = 1;
var img, img2, rad;
var lastAdd = 0;
var rads = 0;
var r;
var bg = [];

var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);
	img = loadImage("http://25.media.tumblr.com/ebec9ddb89465ff5b50bc35a8e8ead2c/tumblr_mlln12WAaP1r0m42ro1_500.png");
	img2 = loadImage("http://24.media.tumblr.com/ea887aa96fdc6541c261fb1e796601eb/tumblr_mk6bew8Ola1r0m42ro4_1280.png");
	rad = loadImage("http://24.media.tumblr.com/b63929967b4bb8fe375de87d875b6234/tumblr_ml8rao2P0G1r0m42ro1_1280.png");
	//noLoop();
	rectMode(CENTER);
	//textAlign(CENTER);
	//imageMode(CORNERS);


	//loadStrings("test.txt");
	//loadJSON("test_arr.json");

};


var draw = function() {
	bg = [255*sin(.008*frameCount), 255*sin(.003*frameCount), 255*sin(.01*frameCount)];
	background(bg[0], bg[1], bg[2]);
	noStroke();

	// rads
	for (var i=0; i<rads; i++) {
		imageMode(CENTER);
		pushMatrix();
		translate(150*i+10*sin(frameCount*0.005+10*i), height*0.5+(10+10*i)*sin(frameCount*0.005+10*i));
		rotate(frameCount*0.001+10*i);
		image(rad, 0, 0, 100, 100*rad.height/rad.width);
		popMatrix();
	}
	
	// rect rotate on click
	fill(255, 255, 255, 150);
	pushMatrix();
	translate(200, 200);
	rotate(clicks/10);
	scale(random(0.8, 1.0), random(0.8, 1.0));
	rect(0, 0, 200, 200);
	popMatrix();

	// line
	pushMatrix();
	stroke(205, map(mouseX, 0, width, 0, 255), map(mouseY, 0, height, 0, 255));
	strokeWeight(10);
	translate(-clicks*5, 0);
	for (var i=0; i<presses; i++) {
		translate(40, 0);
		line(50, 30, 400, 400);
	}
	popMatrix();

	// auto rotate rect
	fill(255, 0, 255, 100);
	pushMatrix();
	translate(400, 400);
	rotate(frameCount*0.1);
	rect(0, 0, 70, 70);
	popMatrix();

	// img1
	pushMatrix();
	scale(1+0.05*sin(frameCount*0.05), 1+0.05*sin(frameCount*0.05));
	imageMode(CORNER);
	image(img, 300, 40, 200, 200*img.height/img.width);
	popMatrix();

	// img2
	pushMatrix();
	imageMode(CENTER);
	translate(600, 340);
	rotate(frameCount*0.001);
	scale(1+0.08*sin(frameCount*0.02), 1+0.08*sin(frameCount*0.02));
	image(img2, 0, 0, 200, 200*img2.height/img2.width);
	popMatrix();

	// text
	fill(25, 230, 200);
	textSize(15);
	text("SMALL TEXT", 100, 500);
	textSize(150);
	text("BIG TEXT", 400, 250);

	// bez
	pushMatrix();
	translate(width-500, height-270);
	strokeWeight(3);
	for (var i=0; i<32; i++) {
	stroke(bg[0]-35, bg[1]+35, bg[2]+20-10*i);
		bezier(15*i+85, 20, 15*i+10, 10, 15*i+90, 190, 15*i+15, 180);
	}
	popMatrix();

	// more rads
	if (millis() - lastAdd > 3000 && rads < 10) {
		lastAdd = millis();
		rads++;
	}


};

var mousePressed = function(e) {
	println("mouse pressed");
	clicks++;
};

var keyPressed = function(e) {
	println("key pressed "+keyCode);
	//alert('key pressed '+keyCode);
	presses++;
};

var keyReleased = function(e) {
};

var keyTyped = function(e) {
};




