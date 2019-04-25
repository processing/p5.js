suite.only('Mouse Events', function() {
  let myp5;

  let canvas;
  let rect;
  let sx;
  let sy;
  let touchObj1;
  let touchObj2;
  let touchEvent1;
  let touchEvent2;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        canvas = myp5._curElement.elt;
        rect = canvas.getBoundingClientRect();
        sx = canvas.scrollWidth / myp5.width;
        sy = canvas.scrollHeight / myp5.height;
        touchObj1 = new Touch({
          target: canvas,
          identifier: Date.now(),
          clientX: 100,
          clientY: 100
        });
        touchObj2 = new Touch({
          target: canvas,
          identifier: Date.now() + 1,
          clientX: 200,
          clientY: 200
        });
        touchEvent1 = new TouchEvent('touchmove', {
          touches: [touchObj1, touchObj2]
        });
        touchEvent2 = new TouchEvent('touchmove', {
          touches: [touchObj2]
        });
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  let mouseEvent1 = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
  let mouseEvent2 = new MouseEvent('mousemove', { clientX: 200, clientY: 200 });

  suite('p5.prototype._hasMouseInteracted', function() {
    test('_hasMouseInteracted should be a boolean', function() {
      assert.isBoolean(myp5._hasMouseInteracted);
    });

    test('_hasMouseInteracted should be false before mouse interaction', function() {
      assert.strictEqual(myp5._hasMouseInteracted, false);
    });

    test('_hasMouseInteracted should be true on mouse interaction', function() {
      window.dispatchEvent(mouseEvent1);
      assert.strictEqual(myp5._hasMouseInteracted, true);
    });

    test('_hasMouseInteracted should be true on touch interaction', function() {
      window.dispatchEvent(touchEvent1);
      assert.strictEqual(myp5._hasMouseInteracted, true);
    });
  });

  suite('p5.prototype.mouseX', function() {
    test('mouseX should be a number', function() {
      assert.isNumber(myp5.mouseX);
    });

    test('mouseX should be current horizontal position of mouse relative to the canvas', function() {
      let result = (mouseEvent1.clientX - rect.left) / sx;
      window.dispatchEvent(mouseEvent1);
      assert.strictEqual(myp5.mouseX, result);
    });

    test('mouseX should be current horizontal position of touch relative to the canvas', function() {
      let result = (touchObj1.clientX - rect.left) / sx;
      window.dispatchEvent(touchEvent1);
      assert.strictEqual(myp5.mouseX, result);
    });
  });

  suite('p5.prototype.mouseY', function() {
    test('mouseY should be a number', function() {
      assert.isNumber(myp5.mouseY);
    });

    test('mouseY should be current vertical position of mouse relative to the canvas', function() {
      let result = (mouseEvent1.clientY - rect.top) / sy;
      window.dispatchEvent(mouseEvent1);
      assert.strictEqual(myp5.mouseY, result);
    });

    test('mouseY should be current vertical position of touch relative to the canvas', function() {
      let result = (touchObj1.clientY - rect.top) / sy;
      window.dispatchEvent(touchEvent1);
      assert.strictEqual(myp5.mouseY, result);
    });
  });

  suite('p5.prototype.pmouseX', function() {
    test('pmouseX should be a number', function() {
      assert.isNumber(myp5.pmouseX);
    });

    test('pmouseX should be previous horizontal position of mouse relative to the canvas', function() {
      window.dispatchEvent(mouseEvent1); // dispatch first mouse event
      window.dispatchEvent(mouseEvent2); // dispatch second mouse event
      let result = (mouseEvent1.clientX - rect.left) / sx;
      assert.strictEqual(myp5.pmouseX, result);
    });

    test('pmouseX should be previous horizontal position of touch relative to the canvas', function() {
      window.dispatchEvent(touchEvent1); // dispatch first touch event
      window.dispatchEvent(touchEvent2); // dispatch second touch event
      let result = (touchObj1.clientX - rect.left) / sx;
      assert.strictEqual(myp5.pmouseX, result);
    });
  });

  suite('p5.prototype.pmouseY', function() {
    test('pmouseY should be a number', function() {
      assert.isNumber(myp5.pmouseY);
    });

    test('pmouseY should be previous vertical position of mouse relative to the canvas', function() {
      window.dispatchEvent(mouseEvent1); // dispatch first mouse event
      window.dispatchEvent(mouseEvent2); // dispatch second mouse event
      let result = (mouseEvent1.clientY - rect.top) / sy;
      assert.strictEqual(myp5.pmouseY, result);
    });

    test('pmouseY should be previous vertical position of touch relative to the canvas', function() {
      window.dispatchEvent(touchEvent1); // dispatch first touch event
      window.dispatchEvent(touchEvent2); // dispatch second touch event
      let result = (touchObj1.clientY - rect.top) / sy;
      assert.strictEqual(myp5.pmouseY, result);
    });
  });
  suite('p5.prototype.winMouseX', function() {
    test('winMouseX should be a number', function() {
      assert.isNumber(myp5.winMouseX);
    });

    test('winMouseX should be current horizontal position of mouse relative to the window', function() {
      window.dispatchEvent(mouseEvent1);
      assert.strictEqual(myp5.winMouseX, mouseEvent1.clientX);
    });

    test('winMouseX should be current horizontal position of touch relative to the window', function() {
      window.dispatchEvent(touchEvent1);
      assert.strictEqual(myp5.winMouseX, touchObj1.clientX);
    });
  });

  suite('p5.prototype.winMouseY', function() {
    test('winMouseY should be a number', function() {
      assert.isNumber(myp5.winMouseY);
    });

    test('winMouseY should be current vertical position of mouse relative to the window', function() {
      window.dispatchEvent(mouseEvent1);
      assert.strictEqual(myp5.winMouseY, mouseEvent1.clientY);
    });

    test('winMouseY should be current vertical position of touch relative to the window', function() {
      window.dispatchEvent(touchEvent1);
      assert.strictEqual(myp5.winMouseY, touchObj1.clientY);
    });
  });

  suite('p5.prototype.pwinMouseX', function() {
    test('pwinMouseX should be a number', function() {
      assert.isNumber(myp5.pwinMouseX);
    });

    test('pwinMouseX should be previous horizontal position of mouse relative to the window', function() {
      window.dispatchEvent(mouseEvent1); // dispatch first mouse event
      window.dispatchEvent(mouseEvent2); // dispatch second mouse event
      assert.strictEqual(myp5.pwinMouseX, mouseEvent1.clientX);
    });

    test('pwinMouseX should be previous horizontal position of touch relative to the window', function() {
      window.dispatchEvent(touchEvent1); // dispatch first touch event
      window.dispatchEvent(touchEvent2); // dispatch second touch event
      assert.strictEqual(myp5.pwinMouseX, touchObj1.clientX);
    });
  });

  suite('p5.prototype.pwinMouseY', function() {
    test('pwinMouseY should be a number', function() {
      assert.isNumber(myp5.pwinMouseY);
    });

    test('pwinMouseY should be previous vertical position of mouse relative to the window', function() {
      window.dispatchEvent(mouseEvent1); // dispatch first mouse event
      window.dispatchEvent(mouseEvent2); // dispatch second mouse event
      assert.strictEqual(myp5.pwinMouseY, mouseEvent1.clientY);
    });

    test('pwinMouseY should be previous vertical position of touch relative to the window', function() {
      window.dispatchEvent(touchEvent1); // dispatch first touch event
      window.dispatchEvent(touchEvent2); // dispatch second touch event
      assert.strictEqual(myp5.pwinMouseY, touchObj1.clientY);
    });
  });

  suite('p5.prototype.mouseButton', function() {
    test('_hasMouseInteracted should be a number', function() {
      assert.isNumber(myp5.mouseButton);
    });

    test('mouseButton should 0 for uninitialised', function() {
      assert.strictEqual(myp5.mouseButton, 0);
    });

    test('mouseButton should be "left" on left mouse button click', function() {
      window.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      assert.strictEqual(myp5.mouseButton, 'left');
    });

    test('mouseButton should be "center" on auxillary mouse button click', function() {
      window.dispatchEvent(new MouseEvent('mousedown', { button: 1 }));
      assert.strictEqual(myp5.mouseButton, 'center');
    });

    test('mouseButton should be "right" on right mouse button click', function() {
      window.dispatchEvent(new MouseEvent('mousedown', { button: 2 }));
      assert.strictEqual(myp5.mouseButton, 'right');
    });
  });

  suite('p5.prototype.mouseIsPressed', function() {
    test('mouseIsPressed should be a boolean', function() {
      assert.isBoolean(myp5.mouseIsPressed);
    });

    test('mouseIsPressed should be false if mouse is not pressed', function() {
      assert.strictEqual(myp5.mouseIsPressed, false);
    });

    test('mouseIsPressed should be true if mouse is pressed', function() {
      window.dispatchEvent(new MouseEvent('mousedown'));
      assert.strictEqual(myp5.mouseIsPressed, true);
    });
  });
});
