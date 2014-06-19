var image1;
var image2;

function setup() {
  frameRate(1);
  createCanvas(600, 600);
  background(200);

  //blend image 1 into image 2
  loadImage("cat.jpg", function(img){
    image(img, 10, 10, 100, 100);

    loadImage("unicorn.jpg", function(img2){
      image(img2, 120, 10, 100, 100);

      img2.blend(img, 0, 0, img.width, img.height, 0, 0, img2.width, img2.height, "multiply");
      image(img2, 250, 10);
    });

  });


  // mask image 2 with image 1 (using image 1 alpha channel)
  loadImage("cat-with-alpha.png", function(img){
    image(img, 10, 300, 100, 100);

    loadImage("unicorn.jpg", function(img2){
      image(img2, 120, 300, 100, 100);

      img2.mask(img);
      image(img2, 250, 300);
    });

  });

}


