suite('Iterators', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p){
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('range', function() {
    test('passes examples', function() {
      // These are the examples from python's range documentation.
      assert.deepEqual(
        Array.from(myp5.range(10)),
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      assert.deepEqual(
        Array.from(myp5.range(1, 11)),
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      assert.deepEqual(
        Array.from(myp5.range(0, 30, 5)),
        [0, 5, 10, 15, 20, 25]);
      assert.deepEqual(
        Array.from(myp5.range(0, 10, 3)),
        [0, 3, 6, 9]);
      assert.deepEqual(
        Array.from(myp5.range(0, -10, -1)),
        [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
      assert.deepEqual(
        Array.from(myp5.range(0)),
        []);
      assert.deepEqual(
        Array.from(myp5.range(1, 0)),
        []);
    });

    test('can be used twice', function() {
      var range = myp5.range(0, 100);
      assert.deepEqual(Array.from(range), Array.from(range));
    });

    test('iterates correctly', function() {
      var i = 0;
      for(var j of myp5.range(0, 10)) {
        assert.equal(i, j);
        i++;
      }
    });

    test('no result if start is past end', function() {
      assert.deepEqual(
        Array.from(myp5.range(0, 10, -1)),
        []);
      assert.deepEqual(
        Array.from(myp5.range(0, -10, 1)),
        []);
    });

    test('never ends if applicable', function() {
      function never_ends(range) {
        var iter = range[Symbol.iterator]();
        for(var i = 0; i < 1000; i++) {
          var res = iter.next();
          assert.equal(res.done, false);
        }
      }
      never_ends(myp5.range(0, null));
      never_ends(myp5.range(0, null, 1));
      never_ends(myp5.range(0, null, -1));
      never_ends(myp5.range(0, null, 0));
      never_ends(myp5.range(0, 10, 0));
    });
  });
});
