import { mockP5, mockP5Prototype } from '../../js/mocks';
import outputs from '../../../src/accessibility/outputs';
import textOutput from '../../../src/accessibility/textOutput';
import p5 from '../../../src/app.js';

// TODO: Is it possible to test this without a runtime?
suite('outputs', function() {
  let myID = 'myCanvasID';

  beforeAll(function() {
    outputs(mockP5, mockP5Prototype);
    textOutput(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.textOutput', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.textOutput);
      assert.typeOf(mockP5Prototype.textOutput, 'function');
    });

    test('should not break for webgl', async function() {
      await new Promise((res) => {
        new p5((p) => {
          p.setup = function() {
            p.createCanvas(50, 50, p.WEBGL);
            p.textOutput();
            p.circle(0, 0, 20);
            res();
          };
        });
      });
    });

    test('should not break for webgl', async function() {
      await new Promise((res) => {
        new p5((p) => {
          p.setup = function() {
            p.createCanvas(50, 50, p.WEBGL);
            p.gridOutput();
            p.circle(0, 0, 20);
            res();
          };
        });
      });
    });

    let expected =
      'Your output is a, 100 by 100 pixels, white canvas containing the following shape:';

    test('should create output as fallback', function() {
      return new Promise(function(resolve, reject) {
        let actual = '';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.textOutput();
            p.line(0, 0, 100, 100);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              actual = document.getElementById('myCanvasIDtextOutput_summary')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create output as label', function() {
      return new Promise(function(resolve, reject) {
        let label = '';
        let fallback = '';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
          };
          p.draw = function() {
            p.textOutput(p.LABEL);
            p.line(0, 0, 100, 100);
            if (p.frameCount === 2) {
              label = document.getElementById(
                'myCanvasIDtextOutputLabel_summary'
              ).innerHTML;
              fallback = document.getElementById('myCanvasIDtextOutput_summary')
                .innerHTML;
              if (label === expected && fallback === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + label);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create text output for arc()', function() {
      return new Promise(function(resolve, reject) {
        expected =
          '<li><a href="#myCanvasIDtextOutputshape0">red arc</a>, at middle, covering 31% of the canvas.</li>';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
          };
          p.draw = function() {
            p.textOutput();
            p.fill(255, 0, 0);
            p.arc(50, 50, 80, 80, 0, p.PI + p.QUARTER_PI);
            if (p.frameCount === 2) {
              let actual = document.getElementById('myCanvasIDtextOutput_list')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create text output for ellipse()', function() {
      return new Promise(function(resolve, reject) {
        expected =
          '<li><a href="#myCanvasIDtextOutputshape0">green circle</a>, at middle, covering 24% of the canvas.</li>';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.textOutput();
            p.fill(0, 255, 0);
            p.ellipse(56, 46, 55, 55);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('myCanvasIDtextOutput_list')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create text output for triangle()', function() {
      return new Promise(function(resolve, reject) {
        expected =
          '<li><a href="#myCanvasIDtextOutputshape0">green triangle</a>, at top left, covering 13% of the canvas.</li>';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.textOutput();
            p.fill(0, 255, 0);
            p.triangle(0, 0, 0, 50, 50, 0);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('myCanvasIDtextOutput_list')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
  });

  suite('p5.prototype.gridOutput', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.gridOutput);
      assert.typeOf(mockP5Prototype.gridOutput, 'function');
    });

    let expected =
      'white canvas, 100 by 100 pixels, contains 1 shape:  1 square';

    test('should create output as fallback', function() {
      return new Promise(function(resolve, reject) {
        let actual = '';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.gridOutput();
            p.rect(0, 0, 100, 100);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              actual = document.getElementById('myCanvasIDgridOutput_summary')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create output as label', function() {
      return new Promise(function(resolve, reject) {
        let label = '';
        let fallback = '';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
          };
          p.draw = function() {
            p.gridOutput(p.LABEL);
            p.square(0, 0, 100, 100);
            if (p.frameCount === 2) {
              label = document.getElementById(
                'myCanvasIDgridOutputLabel_summary'
              ).innerHTML;
              fallback = document.getElementById('myCanvasIDgridOutput_summary')
                .innerHTML;
              if (label === expected && fallback === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + label);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create text output for quad()', function() {
      return new Promise(function(resolve, reject) {
        expected = 'red quadrilateral, location = top left, area = 45 %';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
          };
          p.draw = function() {
            p.gridOutput();
            p.fill(255, 0, 0);
            p.quad(0, 0, 80, 0, 50, 50, 0, 100);
            if (p.frameCount === 2) {
              let actual = document.getElementById('myCanvasIDgridOutputshape0')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create text output for point()', function() {
      return new Promise(function(resolve, reject) {
        expected = 'dark fuchsia point, location = bottom right';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.gridOutput();
            p.stroke('purple');
            p.point(85, 75);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('myCanvasIDgridOutputshape0')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('should create text output for triangle()', function() {
      return new Promise(function(resolve, reject) {
        expected = 'green triangle, location = top left, area = 13 %';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.gridOutput();
            p.fill(0, 255, 0);
            p.triangle(0, 0, 0, 50, 50, 0);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('myCanvasIDgridOutputshape0')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  ---> found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
  });
});
