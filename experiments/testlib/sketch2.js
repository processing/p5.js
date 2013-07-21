var clicks = 0, presses = 0;
var img, img2, rad;
var bg = [];
var writer;

var canvas0, canvas1, canvas2;
var text0;
var burgers = [], burgerYs = [], burgerVs = [];
var img0, imgRot = 0;
var flower, flowerRot = 0;
var input;

var setup = function() {
	println("setup");
	
	// canvas0
	canvas0 = createCanvas(displayWidth(), 0.6*displayHeight());
	canvas0.mousePressed(mousePressed0);

	// canvas1
	canvas1 = createCanvas(500, displayHeight()*0.8);
	canvas1.position(0.25*canvas0.width, displayHeight()*0.2);

	// burgers
	for (var i=0; i<1; i++) {
		var b = createImage("http://24.media.tumblr.com/tumblr_mckjod8K3T1rjiujyo1_500.png");
		b.size(100, AUTO);
		burgerYs.push(random(-b.height, displayHeight()+b.height));
		burgerVs.push(random(1, 4));
		b.position(random(displayWidth()-b.width), burgerYs[i]);
		b.mousePressed(burgerHide);
		burgers.push(b);
	}

	// text
	text0 = createElement("hello world");
	text0.id("test0");
	text0.class("text");
	text0.size(500, 200);
	text0.position(canvas0.width-text0.width, canvas0.height*0.1);
	text0.mouseOver(boldText);
	text0.mouseOut(unboldText);
	text0.style('font-size: 80px; color:white;');


	// images
	flower = createImage("http://subno.net/wp-content/uploads/2013/07/pink-rose-white-backgroundrose-transparent-png-isolated-flower-roses-various-colours-for-pt3kbx0t.png");
	flower.size(400, AUTO);
	flower.position(100, canvas0.height - flower.height*0.5);
	flower.mousePressed(flowerMove);

	img0 = createImage("http://media.tumblr.com/fecdc135ce5bdf0016bcd71da93d2ecb/tumblr_inline_mkr3wrfR2m1qz4rgp.png");
	img0.size(AUTO, 300);
	img0.position(displayWidth()*0.5, canvas0.height-200);
	img0.mousePressed(imgPressed);

	// canvas2
	canvas2 = createCanvas(150, 150);
	canvas2.mousePressed(mousePressed2);
	canvas2.position(flower.x+flower.width/2-canvas2.width/2, flower.y+flower.height/2-canvas2.height/2);

	// input
	input = createElement('<input style="width:300px; font-size:24px;" id="filename" type="text" value="what is your name?" onchange="inputKey(value)">');
	input.position(50, 200);

	//colorMode(HSV);
	//printMatrix();
	writer = new PrintWriter("name1");
};


var draw = function() {

	context(canvas0);
	drawCanvas0();

	context(canvas1);
	drawCanvas1();

	context(canvas2);
	//background(255, 200, 10);
	noStroke();
	fill(200, 30, 0);
	ellipse(width/2, height/2, width, height);
	fill(200, 80, 10);
	strokeWeight(20);
	stroke(0, 100, 0, 50);
	ellipse(width/2, height/2, 0.75*width, 0.75*height);

	// burgers
	for (var i=0; i<burgers.length; i++) {
		burgerYs[i]+=burgerVs[i];
		if (burgerYs[i] > displayHeight() + burgers[i].height) burgerYs[i] = -burgers[i].height;
		burgers[i].position(burgers[i].x, burgerYs[i]);
	}

	// flower
	flowerRot += 1;
	flower.style("-webkit-transform: rotate("+flowerRot+"deg);");
};

var drawCanvas0 = function() {
	bg = [255*sin(.008*frameCount), 255*sin(.003*frameCount), 255*sin(.01*frameCount)];
	fill(bg[0], bg[1], bg[2]);
	noStroke();
	rect(0, 0, width, height);

	strokeWeight(15);
	stroke(255, 100, 0, 100);
	var c0 = [255, 255, 255];
	var c1 = [0, 0, 0];
	var c2 = lerpColor(c0, c1, 0.8);
	fill(c2[0], c2[1], c2[2]);

	for (var i=-500; i<canvas0.width; i+=100) {
		for (var j=-100; j<canvas0.height; j+=100) {
			//translate(width/2, height/4);
			pushMatrix();
			shearX(PI/4);
			rect(i, 50+j, 50, 70);
			popMatrix();
		}
	}

};

var drawCanvas1 = function() {

	//background(50, 50, 200);
	strokeWeight(10);
	for (var i=10; i<canvas1.width; i+=50) {
		for (var j=10; j<canvas1.height; j+=50) {
			stroke(0, 255-j/20, 200, 100);
			fill(bg[0], bg[1], bg[2]+i/4);
			rect(i, j, 30, 30);
		}
	}
};

// Individual elt mouse functions, attached in setup
var mousePressed0 = function(e) {
	// whatevs
	println("0 pressed");
};

// these get added by createCanvas
var mousePressed1 = function(e) {
	// whatevs
	println("1 pressed");
};

// these get added by createCanvas
var mousePressed2 = function(e) {
	// whatevs
	println("2 pressed");
};

var boldText = function(e) {
	println("0 over");
	text0.style('font-weight: bold');
};
var unboldText = function(e) {
	println("0 out");
	text0.style('font-weight: normal');
};

var imgPressed = function(e) {
	imgRot += 60;
	img0.style("-webkit-transform: rotate("+imgRot+"deg);");
};

var burgerHide = function(e, obj) {
	obj.hide();
}

var flowerMove = function(e, obj) {
	console.log(obj);
	obj.position(obj.x+random(-100, 100), obj.y+random(-100, 100));
}

var inputKey = function(text, obj) {
	text0.html("hello "+text+"!");
};

var mousePressed = function(e) {
	println("mouse pressed");
	//save("hi");
	//writer.close();
	//saveStrings(['hi', 'blah']);
	//console.log(e);
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

