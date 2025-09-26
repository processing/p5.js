import P5 from '../../types/p5'

const sketch = new P5((p) => {
  let g: P5.Graphics
  p.setup = function() {
    p.createCanvas(200, 200)
    g = p.createGraphics(200, 200)
  }

  p.mouseMoved = function() {
    g.circle(p.mouseX, p.mouseY, 20);
  }

  p.draw = function() {
    p.clear()
    p.image(g, 0, 0)
  }
})
