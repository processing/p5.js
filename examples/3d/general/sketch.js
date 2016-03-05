var slider;
function setup(){
  createCanvas(windowWidth,windowHeight,WEBGL);
  slider = createSlider(0,255,0);
  slider.position(width-200,10);

}
function draw(){
  //translate(-width/2, -height/2, 0);
  rotate(sin(radians(frameCount % 360))*TWO_PI, [1,1,1]);
  
  ///////////
  /// 2D
  //////////
  // quad(0,0,-200,
  //   0,width,-200,
  //   width,height,-200,
  //   0,height,-200);

  // triangle(0,0,-200,width,height,-200);
  
  //line(0,0,-400,width,height,-400);

  //point(0,0,0);
  //ellipse(slider.value(),0,0,200,100);//works!

  ////////////
  //// 3D
  ////////////
  //sphere();//works!
  //cone();
  //torus();//works!
  cylinder(100);
  //box();
  //plane();//works!
}