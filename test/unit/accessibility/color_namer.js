/**
 * Tests for the color namer accessibility module.
 *
 * The color namer provides human-readable color names for screen readers.
 * It converts RGBA colors to HSB, then matches against a lookup table
 * to return names like "red", "light blue", "dark green", etc.
 *
 * Source: src/accessibility/color_namer.js
 */

import p5 from '../../../src/app.js';

suite('accessibility/Color Namer', function() {

  suite('Primary Colors', function() {
    test('red fill should produce "red" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas');
            p.gridOutput();
            p.fill(255, 0, 0);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvasgridOutputshape0')?.innerHTML || '';
              if (actual.includes('red')) {
                resolve();
              } else {
                reject('Expected "red" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('green fill should produce "green" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas2');
            p.gridOutput();
            p.fill(0, 255, 0);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas2gridOutputshape0')?.innerHTML || '';
              if (actual.includes('green')) {
                resolve();
              } else {
                reject('Expected "green" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('blue fill should produce "blue" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas3');
            p.gridOutput();
            p.fill(0, 0, 255);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas3gridOutputshape0')?.innerHTML || '';
              if (actual.includes('blue')) {
                resolve();
              } else {
                reject('Expected "blue" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
  });

  suite('Grayscale', function() {
    test('black fill should produce "black" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas4');
            p.gridOutput();
            p.fill(0);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas4gridOutputshape0')?.innerHTML || '';
              if (actual.includes('black')) {
                resolve();
              } else {
                reject('Expected "black" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('white fill should produce "white" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas5');
            p.background(0); // Black background to see white shape
            p.gridOutput();
            p.fill(255);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas5gridOutputshape0')?.innerHTML || '';
              if (actual.includes('white')) {
                resolve();
              } else {
                reject('Expected "white" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('gray fill should produce "gray" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas6');
            p.gridOutput();
            p.fill(128);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas6gridOutputshape0')?.innerHTML || '';
              if (actual.includes('gray')) {
                resolve();
              } else {
                reject('Expected "gray" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
  });

  suite('Secondary Colors', function() {
    test('yellow fill should produce "yellow" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas7');
            p.gridOutput();
            p.fill(255, 255, 0);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas7gridOutputshape0')?.innerHTML || '';
              if (actual.includes('yellow')) {
                resolve();
              } else {
                reject('Expected "yellow" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('cyan fill should produce "cyan" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas8');
            p.gridOutput();
            p.fill(0, 255, 255);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas8gridOutputshape0')?.innerHTML || '';
              if (actual.includes('cyan')) {
                resolve();
              } else {
                reject('Expected "cyan" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });

    test('magenta fill should produce "magenta" or "fuchsia" color name', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('testCanvas9');
            p.gridOutput();
            p.fill(255, 0, 255);
            p.rect(0, 0, 50, 50);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              let actual = document.getElementById('testCanvas9gridOutputshape0')?.innerHTML || '';
              if (actual.includes('magenta') || actual.includes('fuchsia')) {
                resolve();
              } else {
                reject('Expected "magenta" or "fuchsia" in output, found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
  });
});
