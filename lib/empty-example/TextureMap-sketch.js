
function setup(){
	createCanvas(100,300)
}

function draw(){
	background(50)
	noStroke();
    
	fill(250, 150, 100)
    ellipse(width/2, height/6, width, height/3)
    fill(100, 250, 150)
    rect(0, height/3, width, height/3)
    fill(150, 100, 250)
    ellipse(width/2, height*5/6, width, height/3)

   noLoop();
}

