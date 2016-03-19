var slider;
var img;

function preload(){
  img = loadImage('./cat.jpg');
}

function setup(){
  createCanvas(windowWidth,windowHeight,WEBGL);
  slider = createSlider(0,255,75);
  slider.position(width-200,10);

}
function draw(){
  background(255);
  rotate(radians(map(mouseY,0,height,0,360)), [1,0,0]);
  rotate(radians(map(mouseX,0,width,0,360)), [0,1,0]);
  //translate(-width/2, -height/2, 0);
  //rotate(sin(radians((frameCount*0.125) % 360))*TWO_PI, [1,1,1]);
  
  ///////////
  /// 2D
  //////////
  // quad(0,0,-200,
  //   0,width,-200,
  //   width,height,-200,
  //   0,height,-200);
  //fill(0,255,0);
  //triangle(0,0,0,width,height,0,width/2,height,0);
  
  //line(0,0,-400,width,height,-400);

  //point(0,0,0);
  //fill(255,0,0);
  //ellipse(0,0,0,slider.value(),slider.value(),30,30);//works!
  //rect(0,0,0,slider.value(),slider.value(),30,30);//works!
  //Immediate
  // fill(255,0,0);
  // strokeWeight(slider.value());
  // beginShape(POINTS);
  //   vertex(0,0,0);
  //   vertex(0,-height/4,0);
  //   vertex(0,0,0);
  //   vertex(-width/4,-height/4,0);
  // endShape();

  //works
  // fill(0);
  // beginShape(LINES);
  //   vertex(0,0,0);
  //   vertex(0,-height/2,0);
  //   vertex(0,0,0);
  //   vertex(-width/2,-height/2,0);
  // endShape();

  //works
  // beginShape(LINE_STRIP);
  //   vertex(0,0,0);
  //   vertex(0,-height/2,0);
  //   vertex(width/2,0,0);
  //   vertex(width/2,height/2,0);
  // endShape();

  //works
  // beginShape(LINE_LOOP);
  //   vertex(-width/2,-height/2,0);
  //   vertex(-width/3,height/2,0);
  //   vertex(-width/4,-height/2,0);
  //   vertex(-width/5, height/2, 0);
  //   vertex(-width/6, -height/3,0);
  //   vertex(width/2,height/2,0);
  // endShape();

  //works
  // fill(0,255,0);
  // beginShape(TRIANGLES);
  //   vertex(0,0,0);
  //   vertex(0,-height/2,0);
  //   vertex(-width/2,-height/2,0);
  //   vertex(0,0,0);
  //   vertex(width/2,height/2,0);
  //   vertex(0,height/2,0);
  // endShape();
  // fill(255,0,0);
  // beginShape(TRIANGLE_STRIP);
  //   vertex(0,0,0);
  //   vertex(0,-height/2,0);
  //   vertex(width/2,-height/2,0);
  //   vertex(width/2,20,0);
  //   vertex(0,height/2,0);
  // endShape();
  //works

  //directionalLight(255,255,255,0,0,1);
  //specularMaterial(0,255,0);  
  // beginShape(TRIANGLE_FAN);
  //   vertex(0,0,0);
  //   vertex(width/2,-height/6,0);
  //   vertex(width/3,-height/5,0);
  //   vertex(width/4,-height/4,0);
  //   vertex(-width/4,-height/4,0);
  //   vertex(-width/3,-height/3,0);
  //   vertex(-width/2,-height/2,0);
  // endShape();
  ////////////
  //// 3D
  ////////////
  texture(img);
  
  //directionalLight(0,255,255,0,0,1);
  //fill(100,0,0,100);
  //normalMaterial();

  sphere(400);//works!
  //ellipsoid(100,250,50);//works!
  //cone(100,400);//needs base
  //torus(400,100);//works!
  //cylinder(100,400);//needs top and bottom
  //box(400);//error: attempt to access out of range vertices in attr 0
  // basicMaterial(255,0,0);
  //plane(400);//works!
}