suite('outputs', function() {
  let myp5;
  let myID = 'myCanvasID';

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        let cnv = p.createCanvas(100, 100);
        cnv.id(myID);
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5._clearOutputs();
    myp5._clearTextOutput();
    myp5.remove();
  });

  suite('p5.prototype.textOutput', function() {
    test('should be a function', function() {
      assert.ok(myp5.textOutput);
      assert.typeOf(myp5.textOutput, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.textOutput(1);
      });
    });
    test('should create output as fallback', function() {
      return new Promise(function(resolve, reject) {
        let actual = '';
        let expected =
          'Your output is a, 100 by 100 pixels, white canvas containing the following 0 shapes:';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.textOutput();
            p.background(255);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              actual = document.getElementById('myCanvasIDtextOutputSumP')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  //// found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
    test('should create output as label', function() {
      return new Promise(function(resolve, reject) {
        let actual = '';
        let expected =
          'Your output is a, 100 by 100 pixels, white canvas containing the following 0 shapes:';
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
            p.textOutput(p.LABEL);
            p.background(255);
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              actual = document.getElementById('myCanvasIDtextOutputLabelSumP')
                .innerHTML;
              if (actual === expected) {
                resolve();
              } else {
                reject(' expected: ' + expected + '  //// found: ' + actual);
              }
              p.remove();
            }
          };
        });
      });
    });
    /*test('should create outputs as label & fallback when called in draw()', function() {
      return new Promise(function(resolve, reject) {
        let actual = '';
        let expected = 'Your output is a, 100 by 100 pixels, white canvas containing the following 0 shapes:'
        new p5(function(p) {
          p.setup = function() {
            let cnv = p.createCanvas(100, 100);
            cnv.id('myCanvasID');
          };
          p.draw = function() {
            p.textOutput(p.LABEL);
            p.background(255);
            if (p.frameCount === 2) {
              actual = document.getElementById('myCanvasIDtextOutputLabelSumP').innerHTML;
              if (actual === expected){
                resolve();
              }else{
                reject(' expected: ' + expected + '  //// found: ' + actual);
              }
            }
          };
        });
      });
    });*/
    /*test('should create output label', function() {
      myp5.textOutput(myp5.LABEL);
      myp5.background(255);
      let actual = document.getElementById(myID + 'textOutputLabelSumP')
        .innerHTML;
      assert.deepEqual(
        actual,
        'Your output is a, 100 by 100 pixels, white canvas containing the following 0 shapes:'
      );
    });
    test('textOutput() for describes basic shapes', function() {});*/
  });
});
