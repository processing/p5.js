var img;
var wheelPos = 100000;


function preload(){
	img = loadImage("assets/ColorGrid.png");
}

function setup(){
	createCanvas(400,800,WEBGL)
}

function draw(){
  background(230)
	strokeWeight(20);

  var priminfo = select('#priminfo');
  //strokeCap(ROUND);
  rotateY((mouseX-200)*0.01);
  rotateX(-1*(mouseY-400)*0.01);


  if(shapeScroll(1)){
    priminfo.html('Plane')
    translate(0, -200)
    fill(300,100,0)
    plane(200, 250, 1, 1);

    translate(0, 400)
    texture(img)
    plane(200, 250, 5, 5);

  }
  
  if(shapeScroll(2)){
    priminfo.html('Box')
    translate(0, -200)
    fill(300,100,0)
    box(200, 200, 200, 4, 4);

    translate(0, 400)
    texture(img)
    box(200, 200, 200, 4, 4);
  }

  if(shapeScroll(3)){
    priminfo.html('Sphere')
    translate(0, -200)
    fill(300,100,0)
    sphere(150, 24, 16);

    translate(0, 400)
    texture(img)
    sphere(150, 50, 50);
  }

  if(shapeScroll(4)){
    priminfo.html('Cylinder')
    translate(0, -200)
    fill(300,100,0)
    cylinder(100, 150, 5, 5);

    translate(0, 400)
    texture(img)
    cylinder(100, 150, 24, 16);
  }

  if(shapeScroll(5)){
    priminfo.html('Cone')
    translate(0, -200)
    fill(300,100,0)
    cone(100, 150, 24, 5);

    translate(0, 400)
    texture(img)
    cone(100, 150, 24, 16);
  }

  if(shapeScroll(6)){
    priminfo.html('Ellipsoid')
    translate(0, -200)
    fill(300,100,0)
    ellipsoid(100, 150, 50, 24, 16);

    translate(0, 400)
    texture(img)
    ellipsoid(100, 150, 50, 24, 16);
  }

  if(shapeScroll(7)){
    priminfo.html('Torus')
    translate(0, -200)
    fill(300,100,0)
    torus(120, 50, 4, 4);

    translate(0, 400)
    texture(img)
    torus(120, 50, 4, 4);
  }

  if(shapeScroll(8)){
    priminfo.html('Triangle')
    translate(0, -200)
    fill(300,100,0)
    triangle(-100, 100, 100, 100, 100, -100, 5, 5);

    translate(0, 400)
    texture(img)
    triangle(-100, 100, 100, 100, 100, -100, 5, 5);
  }

  if(shapeScroll(9)){
    priminfo.html('Ellipse')
    translate(0, -200)
    fill(300,100,0)
    ellipse(0, 0, 300, 300, 24, 16);

    translate(0, 400)
    texture(img)
    ellipse(0, 0, 300, 300, 5, 1);
  }

  if(shapeScroll(10)){
    priminfo.html('Arc')
    translate(0, -200)
    fill(300,100,0)
    arc(0, 0 , 300, 300, 0, 4, PIE, 24);

    translate(0, 400)
    texture(img)
    arc(0, 0 , 300, 300, 0, 4, PIE, 24);
  }

  if(shapeScroll(11)){
    priminfo.html('Rect')
    translate(0, -200)
    fill(300,100,0)
    rect(0, 0 , 200, 100, 5, 5);

    translate(0, 400)
    texture(img)
    rect(0, 0 , 200, 100, 5, 5);
  }

  if(shapeScroll(12)){
    priminfo.html('Quad')
    translate(0, -200)
    fill(300,100,0)
    quad(0, 0 , 20, 200, 300, 350, 200, 20);

    translate(0, 400)
    texture(img)
    quad(0, 0 , 20, 200, 300, 350, 200, 20);
  }

  if(shapeScroll(13)){
    priminfo.html('Bezier')
    translate(0, -200)
    fill(300,100,0)
    bezier(5, 5, 5, 26, 200, 26, 170, -73, 73, 220, 120, 120, 16);

    translate(0, 400)
    texture(img)
    bezier(5, 5, 5, 26, 200, 26, 170, -73, 73, 220, 120, 120, 16);
  }

  if(shapeScroll(14)){
    priminfo.html('Curve')
    translate(0, -200)
    fill(300,100,0)
    curve(5, 5, 5, 26, -100, 26, 170, -73, 73, 220, 120, 120, 16);

    translate(0, 400)
    texture(img)
    curve(5, 5, 5, 26, -100, 26, 170, -73, 73, 220, 120, 120, 16);
  }  

  if(shapeScroll(15)){
    priminfo.html('Line')
    translate(0, -200)
    fill(300,100,0)
    line(-50, 5, 5, 26, 200, 26);

    translate(0, 400)
    texture(img)
    line(-50, 5, 5, 26, 200, 26);
  }  
}

function mouseWheel(event) {
  wheelPos += event.delta > 0 ? 1 : -1;
}


function shapeScroll(y, size){
  return y == wheelPos % 15 + 1 
}