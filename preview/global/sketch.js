console.log(p5);

function setup(){
  createCanvas(200, 200);
}

async function draw(){
  background(0, 50, 50);
  circle(100, 100, 50);

  fill('white');
  textSize(30);
  text('hello', 10, 30);
}
