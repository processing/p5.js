var redSketch = {  
  canvas: null,
  setup: function() {
    this.canvas = createGraphics(200, 200, false, "first_div");
    this.canvas.elt.style.position = 'relative';        
  },
  draw: function() {
    context(this.canvas);
    background(255, 0, 0);
    var bounds = this.canvas.elt.getBoundingClientRect();
    ellipse(mouseX - bounds.left, mouseY - bounds.top, 50, 50);
  }     
};
sketch(redSketch);
