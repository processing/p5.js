var img;

function preload(){
	//img = loadImage("assets/ColorGrid.png");
}

function setup(){
	createCanvas(800,900,WEBGL)
}

function draw(){
	background(230)
	strokeWeight(5);
	// noFill()
    fill(300,100,0)
    // texture(img);
 
   
    var bSwitch = 0
    var start = frameCount * 0.01
    translate(0,-100)
    if(bSwitch == 1){
	    arc(-350,    0 , 200, 200, start, 5, OPEN, 24);
	    arc(-350, -200 , 200, 200, start, PI, OPEN, 24);
	    arc(-100,    0 , 200, 200, start, 5, PIE, 24);
	    arc(-100, -200 , 200, 200, start, PI, PIE, 24);
	    arc(-100, -400 , 200, 200, start, 2, PIE, 24);
	    arc( 150,    0 , 200, 200, start, 5, 'fan', 24);
	    arc( 150, -200 , 200, 200, start, PI, 'fan', 24);
	    arc( 150, -400 , 200, 200, start, 2, 'fan', 24);
	    arc(-350,  200 , 200, 200, start, TAU, OPEN, 24);
	    arc(-100,  200 , 200, 200, start, TAU, PIE, 24);
	    arc( 150,  200 , 200, 200, start, TAU, 'fan', 24);
		arc(-350,   -400 , 200, 200, start, 2, OPEN, 24);
    } else {
		arc(-400,   -400 , 600, 600, start, 5, PIE, 5);
    }
    

   noLoop();
}

