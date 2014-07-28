var image5;


function setup() {
  frameRate(1);
  createCanvas(600, 600);
  background(200);

  //
  // Create an empty image we will driectly draw to
  //
  image1 = createImage(40,40);

  //First fill it with black pixels and draw that to screen
  image1.loadPixels();
  for(var i = 0; i < image1.pixels.length; i += 4) {
    image1.pixels[i] = 0;
    image1.pixels[i+1] = 0;
    image1.pixels[i+2] = 0;
    image1.pixels[i+3] = 255;
  }
  image1.updatePixels();
  image(image1, 50, 50);

  image1.loadPixels();
  for(var i = 0; i < image1.pixels.length; i += 4) {
    image1.pixels[i] = Math.random()*255;
    image1.pixels[i+1] = Math.random()*255;
    image1.pixels[i+2] = Math.random()*255;
    image1.pixels[i+3] = 255;
  }

  image1.updatePixels(25, 10, 10, 20);
  image(image1, 91, 50);

  image1.updatePixels();
  image(image1, 132, 50);

  //
  // Load and draw a cat pic  
  // 
  loadImage("cat.jpg", function(img2){    
    image(img2, 300, 50);
  });


  //
  //Load a cat pic that we will draw later
  //
  image3 = loadImage("cat.jpg");


  //
  // Load and draw a cat pic and then draw the random
  // color image inside it
  // 
  image2 = loadImage("cat.jpg", function(img2){
    img2.set(0, 0, image1);
    
    img2.loadPixels();

    var col = img2.get(0,0);
    console.log(img2.get(0,0));
    console.log("I got a color: ", col);

    var col2 = img2.get(490,999);
    console.log("I got a non existent color (black): ", col2);

    var reg = img2.get(100, 80, 65, 35);
    console.log("I got a region: ", reg);
    image(reg, 0, 0)

    //Also manually manipulate some the pixels in there
    //with set.
    for(var i = 0 ; i < 10; i += 1){
      for(var j = 0 ; j < 10; j += 1){
        img2.set(i, j, [255,0,255,255]);
      }
    }

    img2.updatePixels();
    
  });

  //Load and resize an image
  image4 = loadImage("unicorn.jpg", function(img4){
    img4.resize(250,400);
  });

  //Load an image that we will later manipulate and draw
  image5 = loadImage("unicorn.jpg");
}


function draw(){
  image(image5, width/2, height/2, 300, 300);
  
  // this loads the pixels currently on the canvas into the 'pixels' variable
  loadPixels(); 
  for(var i = width/2; i < width; i+=30) { // every 20 pixels across
    for(var j = height/2; j < height; j+=30) { // every 20 pixels down
      var ind = 4*(j*width+i);
      fill(pixels[ind], pixels[ind+1], pixels[ind+2], pixels[ind+3]);
      ellipse(i, j, 30, 30); // the location to draw the circle
    }
  }
  
  image(image2, 50, 100);
  image(image3, 50, 400, 75, 57);
  image(image4, 200, 400);
}
