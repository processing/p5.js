suite('accessibility/color_namer', function () {
  let myp5;

  setup(function () {
    myp5 = new p5(function () {});
  });

  teardown(function () {
    myp5.remove();
  });

  test('should be a function', function () {
    assert.ok(myp5._rgbColorName);
    assert.typeOf(myp5._rgbColorName, 'function');
  });

  test('should return black for black rgba', function () {
    const name = myp5._rgbColorName([0, 0, 0, 255]);
    assert.equal(name, 'black');
  });

  test('should return white for white rgba', function () {
    const name = myp5._rgbColorName([255, 255, 255, 255]);
    assert.equal(name, 'white');
  });

  test('should return red for red rgba', function () {
    const name = myp5._rgbColorName([255, 0, 0, 255]);
    assert.equal(name, 'red');
  });

  test('should return green for green rgba', function () {
    const name = myp5._rgbColorName([0, 255, 0, 255]);
    assert.equal(name, 'green');
  });

  test('should return blue for blue rgba', function () {
    const name = myp5._rgbColorName([0, 0, 255, 255]);
    assert.equal(name, 'blue');
  });

  test('should handle gray color exception correctly', function () {
    const name = myp5._rgbColorName([211, 211, 211, 255]);
    assert.equal(name, 'gray');
  });
});
