var sketch = function(p) {

  var c;

  p.setup = function() {
    p.createCanvas(200, 200);
  };

  p.draw = function() {
  	p.background(125);
 		p.ellipse(p.mouseX, p.mouseY, 20, 20);
    console.log('mx:'+p.mouseX+' my:'+p.mouseY+' wmx:'+p.winMouseX+' wmy:'+p.winMouseY);
  };
};
 
var myp5 = new p5(sketch);