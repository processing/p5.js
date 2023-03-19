let sketch;
let fbo;
const format = document.getElementById('format');
const alpha = document.getElementById('alpha');
const antialias = document.getElementById('antialias');
const webglVersion = document.getElementById('webglVersion');
const errors = document.getElementById('errors');

for (const input of [format, alpha, antialias, webglVersion]) {
  input.addEventListener('input', remakeSketch);
}

function remakeSketch() {
  errors.textContent = '';
  if (fbo) fbo.remove();
  if (sketch) sketch.remove();
  sketch = new p5(makeSketch);
}
remakeSketch();

function makeSketch(p5) {
  p5.setup = function() {
    try {
      p5.createCanvas(400, 400, p5.WEBGL).parent('sketch');
      p5.setAttributes({ version: webglVersion.value === '1' ? 1 : 2 });
      fbo = p5.createFramebuffer({
        format: format.value,
        antialias: antialias.value === 'antialias',
        channels: alpha.value === 'alpha' ? p5.RGBA : p5.RGB
      });
    } catch (e) {
      errors.textContent = e.message + '\n\n' + e.stack;
    }
  };

  p5.draw = function() {
    // Draw to the Framebuffer
    fbo.draw(() => {
      p5.clear();
      p5.background(255);
      p5.push();
      p5.noStroke();
      p5.fill(255, 0, 0);
      p5.translate(0, 100*p5.sin(p5.frameCount * 0.01), 0);
      p5.rotateX(p5.frameCount * 0.01);
      p5.rotateY(p5.frameCount * 0.01);
      p5.box(50);
      p5.pop();
    });

    // Do something with fbo.color or dbo.depth
    p5.clear();
    p5.background(255);

    p5.push();
    p5.noStroke();
    p5.texture(fbo.color);
    p5.plane(p5.width, -p5.height);
    p5.pop();
  };

  return p5;
}
