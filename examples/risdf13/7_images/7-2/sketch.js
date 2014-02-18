// Render two images, sourced locally and externally

var img1;
var img2;

function setup() {
  createCanvas(600, 600);
  img1 = loadImage("cat.jpg"); // "local" image
  img2 = loadImage("http://fc06.deviantart.net/fs71/f/2013/023/0/9/fish_png_by_heidyy12-d5sg0z8.png"); // image at another location
  //img2 = loadImage("http://upload.wikimedia.org/wikipedia/commons/4/4e/Pleiades_large.jpg"); // very large files are slower to load
};

function draw() {
  // First image as background
  image(img1, 0, 0, width, height);

  // Second image following mouse
  image(img2, mouseX, mouseY);   // transparent .pngs work, too
};