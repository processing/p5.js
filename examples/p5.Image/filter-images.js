var image1;
var image2;

function setup() {
  frameRate(1);
  createCanvas(800, 600);
  background(200);

  //Load an image and then clone it and
  //apply filters
  loadImage("cat.jpg", function(img){
    var clone;
    //Original
    image(img, 10, 10, 100, 100);

    clone = img.get();
    clone.filter("threshold", 0.5);
    image(clone, 120, 10, 100, 100);

    clone = img.get();
    clone.filter("gray");
    image(clone, 230, 10, 100, 100);

    clone = img.get();
    clone.filter("invert");
    image(clone, 340, 10, 100, 100);

    clone = img.get();
    clone.filter("posterize", 4);
    image(clone, 450, 10, 100, 100);

    clone = img.get();
    clone.filter("dilate");
    image(clone, 560, 10, 100, 100);

    clone = img.get();
    clone.filter("erode");
    image(clone, 670, 10, 100, 100);

    clone = img.get();
    clone.filter("blur", 10);
    image(clone, 10, 130, 100, 100);

  });

  //Load an image with an alpha channel that
  //we will then make opaque
  loadImage("cat-with-alpha.png", function(img){
    var clone;
    //Original
    image(img, 10, 240, 100, 100);


    clone = img.get();
    clone.filter("opaque", 0.5);
    image(clone, 120, 240, 100, 100);
  });


}
