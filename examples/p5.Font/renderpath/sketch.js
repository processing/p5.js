function setup(){


  createCanvas(200, 150);

  line(190,0,190,height);

  textAlign(RIGHT);
  textSize(32);
  text("Default Text", 190, 30);

  loadFont("../SourceSansPro-Regular.otf", function(font){

    text("Default Text", 190, 60);

    textSize(35); // not aligning correctly (ignore alignment or fix)
    var path = font._getPath("Align Error", 190, 90);
    font._renderPath(path);

    textFont(font);
    text("Default Text", 190, 120);
  });
}
