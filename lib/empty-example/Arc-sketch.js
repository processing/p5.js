var img;
var wheelPos = 100020;


function preload(){
	img = loadImage("assets/ColorGrid.png");
}
// true false
function setup(){
	if(true){
		createCanvas(1200,900,WEBGL)		
	} else {
		createCanvas(1200,900)		
	}

}

function draw(){
	background(230)
	strokeWeight(10);
	fill(300,100,0)
    ellipseMode(CENTER);
	//noFill()
    //texture(img);
   
    var bSwitch = 1
    var start = 0
    var grid = 210
    
    translate(-grid/2,- grid/2)
    if(_renderer.name != 'p5.Renderer2D'){
    	translate(-width/2, -height/2)
    }

    var d1     = 200
    var d2     = 200
    var detail = shapeScroll();

    if(bSwitch == 1){
		ellipse(grid*1, grid*1, d1, d2                     , detail);
	    ellipse(grid*1, grid*2, d1, d2                     , detail);
	    ellipse(grid*1, grid*3, d1, d2                     , detail);
	    ellipse(grid*1, grid*4, d1, d2                     , detail);
		arc(    grid*2, grid*1, d1, d2, start, PI/2  ,CHORD, detail);
	    arc(    grid*2, grid*2, d1, d2, start, PI    ,CHORD, detail);
	    arc(    grid*2, grid*3, d1, d2, start, PI*3/2,CHORD, detail);
	    arc(    grid*2, grid*4, d1, d2, start, TAU   ,CHORD, detail);
		arc(    grid*3, grid*1, d1, d2, start, PI/2  , OPEN, detail);
	    arc(    grid*3, grid*2, d1, d2, start, PI    , OPEN, detail);
	    arc(    grid*3, grid*3, d1, d2, start, PI*3/2, OPEN, detail);
	    arc(    grid*3, grid*4, d1, d2, start, TAU   , OPEN, detail);
	    arc(    grid*4, grid*1, d1, d2, start, PI/2  , PIE , detail);
	    arc(    grid*4, grid*2, d1, d2, start, PI    , PIE , detail);
	    arc(    grid*4, grid*3, d1, d2, start, PI*3/2, PIE , detail); 
	    arc(    grid*4, grid*4, d1, d2, start, TAU   , PIE , detail);
		arc(    grid*5, grid*1, d1, d2, start, PI/2  , FAN , detail);
	    arc(    grid*5, grid*2, d1, d2, start, PI    , FAN , detail);
	    arc(    grid*5, grid*3, d1, d2, start, PI*3/2, FAN , detail);
	var o =	    arc(    grid*5, grid*4, d1, d2, start, TAU   , FAN , detail);
	console.log(o);


    } else {
		arc(-400,   -400 , 600, 600, start, 5, PIE, 5);
		triangle( 100,100,200,200,100,200)
    }
    

  noLoop();
}


function mouseWheel(event) {
  wheelPos += event.delta > 0 ? -1 : 1;
}


function shapeScroll(){
  return wheelPos % 40 + 3 ;
}