var image1;
var image2;

function setup() {
  frameRate(1);
  createCanvas(600, 600);
  background(200);
  
  //Copy image 1 into image 2
  image1 = createImage(40,40);
  image2 = loadImage("unicorn.jpg", function(img){    
    image1.copy(img, 0, 0, 36, 36, 0, 0, 40, 40);

    image(image1, 10, 10);
    image(img, 10, 75);
  });


  //Copy an image into iself
  image3 = loadImage("cat.jpg", function(img){
    
    img.copy(img.width/2, 0, img.width/2, img.height, 0, 0, img.width/2, img.height);
    
    image(img, 10, 350);
  });
}


