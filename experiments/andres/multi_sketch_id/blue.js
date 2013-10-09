var redSketch = {  
  canvas: null,  
  setup: function() {
    this.canvas = createGraphics(200, 200, false, "second_div");
    this.canvas.elt.style.position = 'relative';      
  },
  draw: function() {
    context(this.canvas);
    background(0, 0, 255);
    var bounds = this.canvas.elt.getBoundingClientRect();
    ellipse(mouseX - bounds.left, mouseY - bounds.top, 50, 50);
  }  
};
sketch(redSketch);

