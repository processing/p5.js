suite('p5.strands global properties', function() {
  test('width and height are defined', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(200, 150);
      };
      sketch.draw = function() {};
    });
    
    assert.equal(p.width, 200);
    assert.equal(p.height, 150);
    p.remove();
  });

  test('mouseX and mouseY are numbers', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isNumber(p.mouseX);
    assert.isNumber(p.mouseY);
    p.remove();
  });

  test('frameCount is a number', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isNumber(p.frameCount);
    assert.isAtLeast(p.frameCount, 0);
    p.remove();
  });

  test('pmouseX and pmouseY are numbers', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isNumber(p.pmouseX);
    assert.isNumber(p.pmouseY);
    p.remove();
  });

  test('focused is a boolean', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isBoolean(p.focused);
    p.remove();
  });

  test('displayWidth and displayHeight are numbers', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isNumber(p.displayWidth);
    assert.isNumber(p.displayHeight);
    p.remove();
  });

  test('windowWidth and windowHeight are numbers', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isNumber(p.windowWidth);
    assert.isNumber(p.windowHeight);
    p.remove();
  });

  test('winMouseX and winMouseY are numbers', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isNumber(p.winMouseX);
    assert.isNumber(p.winMouseY);
    p.remove();
  });

  test('mouseIsPressed is a boolean', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isBoolean(p.mouseIsPressed);
    p.remove();
  });

  test('all global properties are accessible', function() {
    const p = new p5((sketch) => {
      sketch.setup = function() {
        sketch.createCanvas(100, 100);
      };
      sketch.draw = function() {};
    });
    
    assert.isDefined(p.width);
    assert.isDefined(p.height);
    assert.isDefined(p.mouseX);
    assert.isDefined(p.mouseY);
    assert.isDefined(p.pmouseX);
    assert.isDefined(p.pmouseY);
    assert.isDefined(p.winMouseX);
    assert.isDefined(p.winMouseY);
    assert.isDefined(p.frameCount);
    assert.isDefined(p.focused);
    assert.isDefined(p.displayWidth);
    assert.isDefined(p.displayHeight);
    assert.isDefined(p.windowWidth);
    assert.isDefined(p.windowHeight);
    assert.isDefined(p.mouseIsPressed);
    
    p.remove();
  });
});
