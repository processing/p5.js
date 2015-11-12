function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(250);
  var radius = width;
  
  orbitControl();

  normalMaterial();
  translate(0, 0, -1000);
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