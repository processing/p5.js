var clicks = 0, presses = 0;
var bg = [];
var writer;

var canvas0, canvas1;
var text0;
var burgers = [], burgerYs = [], burgerVs = [];
var imgs = [];
var flower, flowerRot = 0;
var input;

var flashes = 5;
var flashLength = 1000;
var startFlash = 0;


var setup = function() {
	println("setup");

	// canvas0
	canvas0 = createCanvas(displayWidth(), 0.6*displayHeight());
	canvas0.mousePressed(mousePressed0);


	// burgers
	for (var i=0; i<12; i++) {
		var b = createImage("http://24.media.tumblr.com/tumblr_mckjod8K3T1rjiujyo1_500.png");
		b.size(130, AUTO);
		burgerYs.push(random(-b.height, displayHeight()+b.height));
		burgerVs.push(random(1, 4));
		b.position(random(displayWidth()-b.width), burgerYs[i]);
		b.mousePressed(burgerHide);
		burgers.push(b);
	}

	// canvas1
	canvas1 = createCanvas(500, displayHeight()*0.8);
	canvas1.position(0.25*canvas0.width, displayHeight()*0.2);


	// text
	text0 = createElement("hello world");
	text0.id("test0");
	text0.class("text");
	text0.size(700, 200);
	text0.position(canvas0.width-text0.width, canvas0.height*0.1);
	text0.mouseOver(boldText);
	text0.mouseOut(unboldText);
	text0.style('font-size: 80px; color:white;');


	// images
	flower = createImage("http://25.media.tumblr.com/7f13c09f459ada46f117c3d7b9140391/tumblr_mm7j0p4RLg1spro0no1_500.gif");
	flower.size(500, AUTO);
	flower.position(100, canvas0.height - flower.height*0.5);
	flower.mousePressed(flowerMove);

	for (var i=0; i<7; i++) {
		var img = createImage("http://25.media.tumblr.com/6cde29708d8c92336066f83c7645920b/tumblr_mknxj3uAvz1s9b4wqo1_500.png");
		img.size(AUTO, 20*i+random(130, 170));
		img.position(flower.x+flower.width*0.75+i*(displayWidth()-flower.x-flower.width*0.75)/8, canvas0.height-img.height/2+random(-30, 30));
		img.mouseOver(imgPressed);
		imgs.push(img);
	}


	// input
	input = createElement('<input style="width:300px;font-size:24px;;font-family:menlo;" id="filename" type="text" value="what is your name?" onchange="inputKey(value)">');
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
	if (flashes < 5) {
		console.log(millis()+" "+startFlash)
		if (millis() - startFlash < flashLength*0.5) {
			fill(255, 255, 255);
			text0.style("color:rgb(0, 0, 0)");
		}
		else if (millis() - startFlash > flashLength) {
			flashes++;
			startFlash = millis();
			fill(100, 100, 100, 100);
			text0.style("color:rgb(255, 255, 255)");
		}
		else {
			fill(100, 100, 100, 100);
			text0.style("color:rgb(255, 255, 255)");
		}
	} else {
		fill(100, 100, 100, 100);
		text0.style("color:rgb(255, 255, 255)");
	}

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

/// Default input functions

var mousePressed = function(e) {
	println("mouse pressed");
	//save("hi");
	//writer.close();
	//saveStrings(['hi', 'blah']);
	//println(e);
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


/// Individual elt mouse functions, attached in setup

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

var imgPressed = function(e, obj) {
	obj.style("-webkit-transform: rotate("+random(-90,90)+"deg);");
	obj.position(obj.x+random(-30, 30), obj.y+random(-30, 30));
};

var burgerHide = function(e, obj) {
	obj.hide();
}

var flowerMove = function(e, obj) {
	println(obj);
	obj.size(obj.width+20, obj.height+20);
	obj.position(obj.x-10, obj.y-10);
}

var inputKey = function(text, obj) {
	text0.html("hello "+text+"!");
	flashes = 0;
	startFlash = millis();
};

