function setup(){
  createCanvas(240, 160);
  textSize(18);
  text("Default Text", 10, 30);
  noStroke();
  fill(0, 102, 153);
  text("Black No Stroke Text", 10, 60);
  textSize(12);
  fill(120);
  loadFont("../SourceSansPro-Regular.otf", function(f){
    textFont(f);
    text("Simple long Text: Lorem Ipsum is simply dummy text of the printing and typesetting industry. ", 10, 90, 220, 60);
  });
}
