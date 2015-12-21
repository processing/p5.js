var rotX, rotY, scale, cutWidth, cutMargin;

function setup() {
  createCanvas(500, 500, WEBGL);

  rotX = 0;
  rotY = 0;
  scale = 200;
  cutWidth = .1;
  cutMargin = cutWidth/sin(atan(sqrt(2)/2));
}

function draw() {
  noStroke();
  //ambientLight (255, 0, 0);
  background(100,0,0);

  //translate (width/2, height/2);
  rotateX (rotX);
  rotateY (rotY);

  //ambientMaterial (250);
  mainBody();
}

function mouseDragged() {
  var rate = 0.01;
  rotX += (pmouseY-mouseY) * rate;
  rotY += (mouseX-pmouseX) * rate;
}

function mainBody() {
  beginShape(TRIANGLE_STRIP);
  vertex (-1*scale, -1*scale, 1*scale);
  vertex ((1-cutMargin)*scale, -1*scale, 1*scale);
  vertex (1*scale, -1*scale, (1-cutMargin)*scale);
  vertex (1*scale, -1*scale, -1*scale);
  vertex ((-1+cutMargin)*scale, -1*scale, -1*scale);
  vertex (-1*scale, -1*scale, (-1+cutMargin)*scale);
  endShape (CLOSE);

  beginShape(TRIANGLE_STRIP);
  vertex (-1*scale, -1*scale, 1*scale);
  vertex ((1-cutMargin)*scale, -1*scale, 1*scale);
  vertex (-1*scale, (1-cutMargin)*scale, 1*scale);
  endShape (CLOSE);

  beginShape(TRIANGLE_STRIP);
  vertex (-1*scale, -1*scale, 1*scale);
  vertex (-1*scale, (1-cutMargin)*scale, 1*scale);
  vertex (-1*scale, -1*scale, (-1+cutMargin)*scale);
  endShape (CLOSE);

  beginShape(TRIANGLE_STRIP);
  vertex (1*scale, -1*scale, -1*scale);
  vertex ((-1+cutMargin)*scale, -1*scale, -1*scale);
  vertex (1*scale, (1-cutMargin)*scale, -1*scale);
  endShape (CLOSE);

  beginShape(TRIANGLE_STRIP);
  vertex (1*scale, -1*scale, -1*scale);
  vertex (1*scale, (1-cutMargin)*scale, -1*scale);
  vertex (1*scale, -1*scale, (1-cutMargin)*scale);
  endShape (CLOSE);

  beginShape(TRIANGLE_STRIP);
  vertex ((1-cutMargin)*scale, -1*scale, 1*scale);
  vertex (-1*scale, (1-cutMargin)*scale, 1*scale);
  vertex (1*scale, (1-cutMargin)*scale, -1*scale);
  vertex (1*scale, -1*scale, (1-cutMargin)*scale);
  endShape (CLOSE);

  beginShape();
  vertex (-1*scale, (1-cutMargin)*scale, 1*scale);
  vertex (-1*scale, -1*scale, (-1+cutMargin)*scale);
  vertex ((-1+cutMargin)*scale, -1*scale, -1*scale);
  vertex (1*scale, (1-cutMargin)*scale, -1*scale);
  endShape (CLOSE);
}
/*
var slider;
//var img;

// function preload(){
//   //img = loadImage('../material/texture/assets/cat.jpg');
// }

function setup(){
  createCanvas(windowWidth,windowHeight,WEBGL);
  slider = createSlider(0,255,0);
  slider.position(width-200,10);

}
function draw(){
  background(255,0,0);
  //translate(-width/2, -height/2, 0);
  //rotate(sin(radians((frameCount*0.125) % 360))*TWO_PI, [1,1,1]);
  
  ///////////
  /// 2D
  //////////
  // quad(0,0,-200,
  //   0,width,-200,
  //   width,height,-200,
  //   0,height,-200);

  //triangle(0,0,-200,width,height,-200);
  
  //line(0,0,-400,width,height,-400);

  //point(0,0,0);
  // ellipse(slider.value(),0,0,slider.value(),100);//works!

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
  // directionalLight(255,255,255,0,0,1);
  // specularMaterial(0,255,0,4);
  beginShape(TRIANGLE_FAN);
    vertex(0,0,0);
    vertex(width/2,-height/6,0);
    vertex(width/3,-height/5,0);
    vertex(width/4,-height/4,0);
    vertex(-width/4,-height/4,0);
    vertex(-width/3,-height/3,0);
    vertex(-width/2,-height/2,0);
  endShape();
  ////////////
  //// 3D
  ////////////
  //texture(img);
  //basicMaterial(100,0,0,100);
  directionalLight(0,255,255,0,0,1);
  specularMaterial(0,255,0,4);
  sphere(100);//works!
  //cone(100,100);//needs base
  //torus(400,100);//works!
  //cylinder(100);//needs top and bottom
  //box(100,100,100,24,24);//error: attempt to access out of range vertices in attr 0
  // basicMaterial(255,0,0);
  // plane(400);//works!
}
*/