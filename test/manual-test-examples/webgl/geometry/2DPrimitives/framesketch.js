//Framesketch.js expects to be called with parameters specifying whether
//to run the page in 2d or 3d, the test number, and whether or not
//to use fill or stroke. 

//====Use Notes
//-The order of the tests below will set the order they are displayed
// but the numbers are not explicitly set
//
//-Include an informative title in testinfo.html(''). If any differences are 
// expected between the 2D and 3D tests, include a note here. 
//
//-Unless you are explictly testing stroke or fill, do not set them in the test



var params
var n
var testinfo 


function setup(){
  params = getURLParams();
  if(params.mode == '3d'){
    createCanvas(400,400,WEBGL);
    console.log('3d loaded')
  } else {
    createCanvas(400,400);
    console.log('2d loaded')
  }

  testinfo = select('#testinfo')
}

function draw(){
  n = 0

  //Adjust 2d to align with 3d
  if(params.mode === '2d'){ 
  	translate(200,200)
  }

  //Draws a background with a set of crosshairs to assist in comparing the tests
  background(120);
  fill(100,250,0);
  strokeWeight(4);
  stroke(0);
  line(-200,0,200,0);
  line(0,-200,0,200);
  line(-100,100,-100,-100);
  line( 100,100,100,-100);
  line(-100,100,100,100);
  line(-100,-100,100,-100);
  stroke(255,0,0);


  //Disable stroke and/or fill based on url parameters
  if(params.setStroke == 'false'){noStroke()}
  if(params.setFill   == 'false'){noFill()}



  if(showThisTest()){
    testinfo.html('Rectangle');
    rect(0,0, 175, 125 );
  }

  if(showThisTest()){
    testinfo.html('Rect, one radius argument');
    rect(0,0,  175, 125 , 25);
  }

  if(showThisTest()){
    testinfo.html('Rect, two radius arguments');
    rect(0,0,  175, 125 , 25, 10);
  }

  if(showThisTest()){
    testinfo.html('Rect, three radius arguments');
    rect(0,0,  175, 125 , 25, 10, 55);
  }

  if(showThisTest()){
    testinfo.html('Rect, four radius arguments');
    rect(0,0,  175, 125 , 25, 10, 15, 400);
  }

  if(showThisTest()){
    testinfo.html('Rect, four radius arguments which are larger than the dimensions of the rect');
    rect(0,0,  175, 125 , 1000);
  }

  if(showThisTest()){
    testinfo.html('Rect, drawn with various modes (Clockwise from top left: CENTER, RADIUS, CORNERS, CORNER)');
    rectMode(CENTER);
    rect(-80,-80,75,50);
    rectMode(RADIUS);
    rect(80,-80,75,50);
    rectMode(CORNER);
    rect(-80,80,75,50);
    rectMode(CORNERS);
    rect(80,80,75,50);
  }
 
  if(showThisTest()){
    testinfo.html('Elipse modes (Clockwise from top left: CENTER, RADIUS, CORNERS, CORNER)')
    ellipseMode(CENTER)
    ellipse(-50,-50,50,25)  
    ellipseMode(RADIUS)
    ellipse(50,-50,50,25)  
    ellipseMode(CORNERS)
    ellipse(50,50,75,130) 
    ellipseMode(CORNER)
    ellipse(-50,50,50,25)  
  }

  if(showThisTest()){
    testinfo.html('Arcs, drawn with various ellipseModes (Clockwise '+
                  'from top left: CENTER, RADIUS, CORNERS, CORNER)');
    ellipseMode(CENTER);
    arc(-140,-140,150,150,0,2,PIE);
    ellipseMode(RADIUS);
    arc(40,-140,150,150,0,2,PIE);
    ellipseMode(CORNERS);
    arc(40,40,150,150,0,2,PIE);
    ellipseMode(CORNER);
    arc(-140,40,150,150,0,2,PIE);
  }


  if(showThisTest()){
    testinfo.html('Open arc. Animation used to ensure test covers all angles');
    arc(0,0,150,150,millis()*0.0003,millis()*0.001,OPEN);
  }

  if(showThisTest()){
    testinfo.html('Chord arc. Animation used to ensure test covers all angles');
    arc(0,0,150,150,millis()*0.0003,millis()*0.001,CHORD);
  }

  if(showThisTest()){
    testinfo.html('Pie arc. Animation used to ensure test covers all angles');
    arc(0,0,150,150,millis()*0.0003,millis()*0.001,PIE);
  }


  if(showThisTest()){
    testinfo.html('Quad, with "bowtie" shapes. Note the bowties will not render the same in 2d and 3d');
    quad(-38, -51, 86, -20, 69, 63, 30, 76);
    quad(-100,-100, 0,-100, -150, -50, -100, 0);
    quad(100,-100, 0,-100, 150, -50, 100, 0);
  }

  if(showThisTest()){
    testinfo.html('Triangles drawn with verticies in clockwise and counter-clockwise orders');
    triangle(-38, -51, 86, -20, 69, 63);
    triangle(38, 51, -69, -63, -86, 20);
  }

 if(showThisTest()){
    testinfo.html('Line, animated position, width, color. Animated color was included in case stroke '+
                  'implementation in WebGL does not work correctly');
    strokeWeight(floor(Math.cos(millis()/1000) * 20)+21);
    stroke(255, floor(millis()/10%255), floor((millis()-100)/10%255));
    line(-150,-150,100 + Math.cos(millis()/1000) * 50
                  ,100 + Math.sin(millis()/1000) * 50);
  }


  if(showThisTest()){
    testinfo.html('Reference line, and lines with stroke caps specified');
    strokeWeight(20);
    stroke(255,100,100);
    line(-80, -50, 80, -50);
    stroke(100,200,255);
    strokeCap(ROUND);
    line(-80, 0, 80, 0);
    strokeCap(SQUARE);
    line(-80, 50, 80, 50);
    strokeCap(PROJECT);
    line(-80, 90, 80, 90);
  }

  if(showThisTest()){
    testinfo.html('Shape with contours');
    stroke(255, 0, 0);
    beginShape();
    // Exterior part of shape, clockwise winding
    vertex(-40, -40);
    vertex(40, -40);
    vertex(40, 40);
    vertex(-40, 40);
    // Interior part of shape, counter-clockwise winding
    beginContour();
    vertex(-20, -20);
    vertex(-20, 20);
    vertex(20, 20);
    vertex(20, -20);
    endContour();
    endShape(CLOSE);
  }

  if(showThisTest()){
    testinfo.html('Shape with quadraticVertex');
    noFill();
    strokeWeight(4);
    beginShape();
    vertex(20, 20);
    quadraticVertex(80, 20, 50, 50);
    quadraticVertex(20, 80, 80, 80);
    vertex(80, 60);
    endShape();
  }

  if(showThisTest()){
    testinfo.html('Shapes drawn with vertex. with bowtie shapes');
    stroke(255, 0, 0);
    beginShape();
    // Exterior part of shape, clockwise winding
    vertex(-40, -40);
    vertex(40, -40);
    vertex(40, 40);
    vertex(-40, 40);
    endShape(CLOSE);

    beginShape();
    // Exterior part of shape, clockwise winding
    vertex(-140, -140);
    vertex(-60, -140);
    vertex(-60, -60);
    vertex(-40, -80);
    endShape(CLOSE);
    
    beginShape();
    // Exterior part of shape, clockwise winding
    vertex(140, -140);
    vertex(60, -140);
    vertex(60, -60);
    vertex(40, -80);
    endShape(CLOSE);
  }

  if(showThisTest()){
    testinfo.html('Points, with size and color animation');
    strokeWeight(floor(Math.cos(millis()/1000) * 40)+1);
    stroke(255, floor(millis()/10%255), floor((millis()-100)/10%255));
    point(-20, -20);
    point(20, 40);
  }

  if(showThisTest()){
    testinfo.html('Smooth test (no smooth is on the bottom right)')
    background(0);
    noStroke();
    smooth();
    ellipse(-100, -100, 200, 200);
    noSmooth();
    ellipse( 100,  100, 200, 200);
  }
}

function showThisTest(){
  //Helper function so the tests can be reordered easily.
  n++
  return n == params.testID
}