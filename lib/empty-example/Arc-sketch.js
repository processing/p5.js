var img;
var wheelPos = 100020;


function preload(){
	img = loadImage("assets/ColorGrid.png");
}
// true false
function setup(){
	if(true){
		createCanvas(900,900,WEBGL)		
	} else {
		createCanvas(900,900)		
	}

}

function draw(){
	background(230)
	strokeWeight(10);
	fill(300,100,0)

	//noFill()
    //texture(img);
   
    var bSwitch = 1
     var grid = 210
    

    if(_renderer.name != 'p5.Renderer2D'){
    	rotateY(frameCount * 0.01)
    	translate(-width/2, -height/2)
    } 
    translate(-grid/2,- grid/2)
//Config to vary the tests
    var d1     = 200
    var d2     = 200
    var start  = 0
    var eA     = 0
    var detail = shapeScroll();
    ellipseMode(CENTER);

    if(bSwitch == 1){
		ellipse(grid*1, grid*1, d1, d2                     , detail);
	    ellipse(grid*1, grid*2, d1, d2                     , detail);
	    ellipse(grid*1, grid*3, d1, d2                     , detail);
	    ellipse(grid*1, grid*4, d1, d2                     , detail);
		arc(    grid*2, grid*1, d1, d2, start, eA + PI/2  ,CHORD, detail);
	    arc(    grid*2, grid*2, d1, d2, start, eA + PI    ,CHORD, detail);
	    arc(    grid*2, grid*3, d1, d2, start, eA + PI*3/2,CHORD, detail);
	    arc(    grid*2, grid*4, d1, d2, start, eA + TAU   ,CHORD, detail);
		arc(    grid*3, grid*1, d1, d2, start, eA + PI/2  , OPEN, detail);
	    arc(    grid*3, grid*2, d1, d2, start, eA + PI    , OPEN, detail);
	    arc(    grid*3, grid*3, d1, d2, start, eA + PI*3/2, OPEN, detail);
	    arc(    grid*3, grid*4, d1, d2, start, eA + TAU   , OPEN, detail);
	    arc(    grid*4, grid*1, d1, d2, start, eA + PI/2  , PIE , detail);
	    arc(    grid*4, grid*2, d1, d2, start, eA + PI    , PIE , detail);
	    arc(    grid*4, grid*3, d1, d2, start, eA + PI*3/2, PIE , detail); 
	    arc(    grid*4, grid*4, d1, d2, start, eA + TAU   , PIE , detail);
	/*	arc(    grid*5, grid*1, d1, d2, start, eA + PI/2  , FAN , detail);
	    arc(    grid*5, grid*2, d1, d2, start, eA + PI    , FAN , detail);
	    arc(    grid*5, grid*3, d1, d2, start, eA + PI*3/2, FAN , detail);
	    arc(    grid*5, grid*4, d1, d2, start, eA + TAU   , FAN , detail);*/
	


    } else {
		arc(-400,   -400 , 600, 600, start, 5, PIE, 5);
		triangle( 100,100,200,200,100,200)
    }
    

  //noLoop();
}


function mouseWheel(event) {
  wheelPos += event.delta > 0 ? -1 : 1;
}


function shapeScroll(){
  return wheelPos % 40 + 3 ;
}