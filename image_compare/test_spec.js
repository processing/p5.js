/* global suite, setup, test, XMLHttpRequest, p5 */

suite('Image Compare', function() {
  
  var showFailures = true;
  var showAll = false;
  
  function showRef(refData) {
    var canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    var ctx = canvas.getContext('2d');
    var imgData = ctx.getImageData(0,0,100,100);
    for (var i = 0; i < refData.length; i++) {
      imgData.data[i] = refData[i];
    }
    ctx.putImageData(imgData, 0, 0);
    document.body.appendChild(canvas);
  }
  
  function calcSameness(refData, actData) {
    var n = 0;
    
    for (var i = 0; i < actData.length; i++) {
      n += Math.abs(actData[i] - refData[i]);
    }

    return n / (256 * 4 * actData.length);
  }
  
  function getRefData(code) {
    var line = code.split('\n')[0];
    var regex = /\/\/\[[0-9]+\,[0-9]+\]/;
    var matches = regex.exec(line);

    var len = matches[0].length;
    return line.substring(len).split(',').map(function (val) {
      return parseInt(val);
    });
  }
  
  function verify(myp5, code, tolerance) {
    var ctx = myp5.canvas.getContext('2d');
    var actData = ctx.getImageData(0,0,100,100).data;
    var refData = getRefData(code);

    assert.equal(actData.length, refData.length);

    var sameness = calcSameness(refData, actData);
    var same = sameness < tolerance;

    if (same && !showAll) {
      myp5.remove();
    } else if (showFailures || showAll) {
      showRef(refData);
    }

    assert(same, 'images are not similar enough: ' + sameness + ' > ' + tolerance);
  }

  function runTest(options) {
    if (options.suite) {
      suite(options.suite, function() {
        options.tests.map(runTest);
      });
      return;
    }
    
    var filename = options.file;
    var tolerance = options.tolerance;
    var timeout = options.timeout || 20;
    var testFunc = options.skip ? test.skip : test;

    testFunc(filename, function (done) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var myp5;
        var code = xhr.responseText;
        code = code
          .replace(/size/g, 'resizeCanvas')
          .replace(/exit\(\);/g, '')
          .replace(/void/g, 'function');

        if (code.indexOf('setup = function') !== -1) {
          myp5 = new p5(new Function ('myp5', 'with(myp5){' + code + '}'), true);
          setTimeout(function () {
            verify(myp5, code, tolerance);
            done();
          }, timeout);
        } else {
          myp5 = new p5(function () {}, true);
          with(myp5) {
            eval(code);
          }
          verify(myp5, code, tolerance);
          done();
        }
        
      };
      xhr.open('GET', 'ref/' + filename);
      xhr.send();
    });
  }
  
  var tests = [
    { suite: 'arc', tests: [
      { file: 'arc_ref1.pde', tolerance: 0.015 },
      { file: 'arc_ref2.pde', tolerance: 0.015 },
      { file: 'arc_ref3.pde', tolerance: 0.015 }
    ]},
    
    { suite: 'background', tests: [
      { file: 'background-3-arg-alpha.pde', tolerance: 0.015 },
      { file: 'background-3-arg.pde', tolerance: 0.015 },
      // TODO: decide what the behaviour should be
      { file: 'background-before-size.pde', tolerance: 0.015, skip: true },
      { file: 'background-color-1arg-2d.pde', tolerance: 0.015 },
      { file: 'background-color-1arg-alpha-2d.pde', tolerance: 0.015 },
      { file: 'background-color-alpha.pde', tolerance: 0.015 },
      { file: 'background-color.pde', tolerance: 0.015 },
      { file: 'background-gray-alpha.pde', tolerance: 0.015 },
      { file: 'background-gray.pde', tolerance: 0.015 },

      // hex tests fail
      // TODO: decide if we want to implement hex colors
      { file: 'background-hex-3RGB-alpha.pde', tolerance: 0.15, skip: true },
      { file: 'background-hex-alpha.pde', tolerance: 0.15, skip: true },
      { file: 'background-hex.pde', tolerance: 0.15, skip: true },
      { file: 'background-hex2.pde', tolerance: 0.15, skip: true }
    ]},
    
    { suite: 'beginShape/endShape', tests: [
      { file: 'beginEndShape-2dlines.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dnocloseline.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dnocloserectangle.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dnoclosetriangle.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dnofillrectangle.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dnofilltriangle.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dpoints.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dpolygon.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dquads.pde', tolerance: 0.008 },
      { file: 'beginEndShape-2dquadstrip1.pde', tolerance: 0.008 },
      { file: 'beginEndShape-2dquadstrip2.pde', tolerance: 0.008 },
      { file: 'beginEndShape-2dtrianglefan1.pde', tolerance: 0.008 },
      { file: 'beginEndShape-2dtrianglefan2.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dtriangles1.pde', tolerance: 0.008 },
      { file: 'beginEndShape-2dtriangles2.pde', tolerance: 0.005 },
      { file: 'beginEndShape-2dtrianglestrip1.pde', tolerance: 0.009 },
      { file: 'beginEndShape-2dtrianglestrip2.pde', tolerance: 0.008 },
      { file: 'beginEndShape-2dvertex.pde', tolerance: 0.005 }
    ]},
    
    { suite: 'bezier', tests: [
      { file: 'bezier.pde', tolerance: 0.005 },
      { file: 'bezier2.pde', tolerance: 0.005 },
      { file: 'bezier-ellipse.pde', tolerance: 0.005 }
    ]},

    { suite: 'blend', tests: [
      { file: 'blend-add.pde', tolerance: 0.015 },
      { file: 'blend-blend.pde', tolerance: 0.015 },
      { file: 'blend-burn.pde', tolerance: 0.015 },
      { file: 'blend-darkest.pde', tolerance: 0.015 },
      { file: 'blend-difference.pde', tolerance: 0.015 },
      { file: 'blend-dodge.pde', tolerance: 0.015 },
      { file: 'blend-exclusion.pde', tolerance: 0.015 },
      { file: 'blend-hard_light.pde', tolerance: 0.015 },
      { file: 'blend-lightest.pde', tolerance: 0.015 },
      { file: 'blend-multiply.pde', tolerance: 0.015 },
      { file: 'blend-overlay.pde', tolerance: 0.015 },
      { file: 'blend-screen.pde', tolerance: 0.015 },
      { file: 'blend-soft_light.pde', tolerance: 0.015 },
      // TODO: SUBTRACT blend mode is not defined 
      { file: 'blend-subtract.pde', tolerance: 0.015, skip: true }
    ]},
    
    // TODO: implement blendColor
    { suite: 'blendColor', tests: [
      { file: 'blendcolor-add.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-blend.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-burn.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-darkest.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-difference.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-dodge.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-exclusion.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-hard_light.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-lightest.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-multiply.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-overlay.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-screen.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-soft_light.pde', tolerance: 0.015, skip: true },
      { file: 'blendcolor-subtract.pde', tolerance: 0.015, skip: true }
    ]},
    
    { file: 'blur.pde', tolerance: 0.015 },
    { file: 'bounce.pde', tolerance: 0.015, timeout: 1000 },
    // uses "class" keyword
    { file: 'bouncy-bubbles.pde', tolerance: 0.015, skip: true },
    { file: 'brightness.pde', tolerance: 0.015 },
    { file: 'brightness-2.pde', tolerance: 0.015 },
    // TODO: randomSeed algorithm differs from processing-js
    { file: 'brownian.pde', tolerance: 0.015 }
    
  ];

  tests.forEach(runTest);
});
