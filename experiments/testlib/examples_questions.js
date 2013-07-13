var c1, c2;

function setup() {
	// anonymous object technique
	createCanvas({x: 20, y: 10, width:400, height:300});

	// default arguments with setters
	createCanvas()	
		.setSize(100, 200)
		.setPosition(20, 10)

	// overloaded functions
	c1 = createCanvas(400, 300);
	c2 = createCanvas(400, 300);
}

function draw() {
	// single canvas case
	drawLine(0, 0, 100, 100);

	// multicanvas case
	c1
		.drawLine(0, 0, mouseX, mouseY)
		.drawRect(0, 0, 100, 200);

	c2
		.drawLine(0, 0, mouseX, mouseY)
		.drawRect(0, 0, 100, 200);

	// set multiple canvases
	setCanvas(c1);
	line(0, 0, mouseX, mouseY);

	setCanvas(c2);
	line(0, 0, mouseX, mouseY);

	// working w multiple renderers?
	beginShape();
	var radius = 100;
	var n = 100;
	for(var i = 0; i < n; i++) {
		var theta = map(i, 0, n, 0, TWO_PI);
		vertex(sin(theta) * radius, cos(theta) * radius);
	}
	endShape();
}