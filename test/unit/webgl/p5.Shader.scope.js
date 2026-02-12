import p5 from '../../../src/app.js';

suite('p5.Shader', function() {
  suite('buildMaterialShader scope forwarding', function() {
    test('forwards scope to modify in instance mode', function(done) {
      new p5((sketch) => {
        sketch.setup = function() {
          sketch.createCanvas(10, 10, sketch.WEBGL);

          const scope = { sketch };
          let receivedSketch = null;

          sketch.buildMaterialShader(function({ sketch: s }) {
            receivedSketch = s;
          }, scope);

          assert.strictEqual(receivedSketch, sketch);

          sketch.remove();
          done();
        };
      });
    });
  });
});
