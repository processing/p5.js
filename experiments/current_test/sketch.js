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
	noCursor();
	cursor(HAND);
	println("setup");
	console.log(sort(["ab", "d", "c"]));

	createGraphics(200, 300);

};


var draw = function() {
	//strokeWeight(10);
	stroke(100, 30, 30);
	point(10, 10);
};
