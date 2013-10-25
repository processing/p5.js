
// declare two graphics canvas variables
var mask;
var img;
var k;

var setup = function() {
	img = loadImage("cat.jpg"); // "local" image
  //mask = loadImage("http://fc06.deviantart.net/fs71/f/2013/023/0/9/fish_png_by_heidyy12-d5sg0z8.png"); // image at another location

  k = createImage(10, 10);


};

var draw = function() {
	//img.mask(mask);
	img.loadPixels();
	image(img, 0, 0);
};

var keyPressed = function() {
	noLoop();
}