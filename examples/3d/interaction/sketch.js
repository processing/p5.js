function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
  var radius = width;
  camera(0, 0, 1600);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);
  orbitControl();

  normalMaterial();
  for(var i = 0; i <= 20; i++){
    for(var j = 0; j <= 20; j++){
      push();
      var a = j/20 * PI;
      var b = i/20 * PI
      translate(sin(2 * a) * radius * sin(b), cos(b) * radius / 2 , cos(2 * a) * radius * sin(b));    
      cone();
      pop();
    }
  }


}