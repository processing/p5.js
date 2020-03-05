suite('Matrix', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var result;

  suite('p5.prototype.matrix', function() {
    test('should be a function', function() {
      assert.ok(myp5.matrix);
      assert.typeOf(myp5.matrix, 'function');
    });
    test('should return an object with functions', function() {
      result = myp5.matrix(2, 2);
      assert.typeOf(result, 'Object');
      assert.ok(result.map);
      assert.ok(result.forEach);
    });
  });

  suite('p5.prototype.matrix(n).map', function() {
    test('should be a function', function() {
      result = myp5.matrix(2, 2);
      assert.ok(result.map);
      assert.typeOf(result.map, 'function');
    });
    test('should return a mapped 2 dimensional array given 2 arguments', function() {
      assert.deepEqual(
        myp5.matrix(2, 2).map(([x, y]) => `args: x: ${x} y: ${y}`),
        [
          ['args: x: 0 y: 0', 'args: x: 0 y: 1'],
          ['args: x: 1 y: 0', 'args: x: 1 y: 1']
        ]
      );
      assert.deepEqual(
        myp5.matrix(3, 3).map(([x, y]) => `args: x: ${x} y: ${y}`),
        [
          ['args: x: 0 y: 0', 'args: x: 0 y: 1', 'args: x: 0 y: 2'],
          ['args: x: 1 y: 0', 'args: x: 1 y: 1', 'args: x: 1 y: 2'],
          ['args: x: 2 y: 0', 'args: x: 2 y: 1', 'args: x: 2 y: 2']
        ]
      );
    });
    test('should return a mapped 3 dimensional array 3 arguments', function() {
      assert.deepEqual(
        myp5
          .matrix(2, 2, 2)
          .map(([x, y, z]) => `args: x: ${x} y: ${y} z: ${z}`),
        [
          [
            ['args: x: 0 y: 0 z: 0', 'args: x: 0 y: 0 z: 1'],
            ['args: x: 0 y: 1 z: 0', 'args: x: 0 y: 1 z: 1']
          ],
          [
            ['args: x: 1 y: 0 z: 0', 'args: x: 1 y: 0 z: 1'],
            ['args: x: 1 y: 1 z: 0', 'args: x: 1 y: 1 z: 1']
          ]
        ]
      );
      assert.deepEqual(
        myp5
          .matrix(3, 3, 3)
          .map(([x, y, z]) => `args: x: ${x} y: ${y} z: ${z}`),
        [
          [
            [
              'args: x: 0 y: 0 z: 0',
              'args: x: 0 y: 0 z: 1',
              'args: x: 0 y: 0 z: 2'
            ],
            [
              'args: x: 0 y: 1 z: 0',
              'args: x: 0 y: 1 z: 1',
              'args: x: 0 y: 1 z: 2'
            ],
            [
              'args: x: 0 y: 2 z: 0',
              'args: x: 0 y: 2 z: 1',
              'args: x: 0 y: 2 z: 2'
            ]
          ],
          [
            [
              'args: x: 1 y: 0 z: 0',
              'args: x: 1 y: 0 z: 1',
              'args: x: 1 y: 0 z: 2'
            ],
            [
              'args: x: 1 y: 1 z: 0',
              'args: x: 1 y: 1 z: 1',
              'args: x: 1 y: 1 z: 2'
            ],
            [
              'args: x: 1 y: 2 z: 0',
              'args: x: 1 y: 2 z: 1',
              'args: x: 1 y: 2 z: 2'
            ]
          ],
          [
            [
              'args: x: 2 y: 0 z: 0',
              'args: x: 2 y: 0 z: 1',
              'args: x: 2 y: 0 z: 2'
            ],
            [
              'args: x: 2 y: 1 z: 0',
              'args: x: 2 y: 1 z: 1',
              'args: x: 2 y: 1 z: 2'
            ],
            [
              'args: x: 2 y: 2 z: 0',
              'args: x: 2 y: 2 z: 1',
              'args: x: 2 y: 2 z: 2'
            ]
          ]
        ]
      );
    });
    test('should return a mapped N dimensional array given N arguments', function() {
      assert.ok(result.map);
      assert.deepEqual(
        myp5.matrix(2, 2, 2, 2, 2).map(([...args]) => `args: ${args}`),
        [
          [
            [
              [
                ['args: 0,0,0,0,0', 'args: 0,0,0,0,1'],
                ['args: 0,0,0,1,0', 'args: 0,0,0,1,1']
              ],
              [
                ['args: 0,0,1,0,0', 'args: 0,0,1,0,1'],
                ['args: 0,0,1,1,0', 'args: 0,0,1,1,1']
              ]
            ],
            [
              [
                ['args: 0,1,0,0,0', 'args: 0,1,0,0,1'],
                ['args: 0,1,0,1,0', 'args: 0,1,0,1,1']
              ],
              [
                ['args: 0,1,1,0,0', 'args: 0,1,1,0,1'],
                ['args: 0,1,1,1,0', 'args: 0,1,1,1,1']
              ]
            ]
          ],
          [
            [
              [
                ['args: 1,0,0,0,0', 'args: 1,0,0,0,1'],
                ['args: 1,0,0,1,0', 'args: 1,0,0,1,1']
              ],
              [
                ['args: 1,0,1,0,0', 'args: 1,0,1,0,1'],
                ['args: 1,0,1,1,0', 'args: 1,0,1,1,1']
              ]
            ],
            [
              [
                ['args: 1,1,0,0,0', 'args: 1,1,0,0,1'],
                ['args: 1,1,0,1,0', 'args: 1,1,0,1,1']
              ],
              [
                ['args: 1,1,1,0,0', 'args: 1,1,1,0,1'],
                ['args: 1,1,1,1,0', 'args: 1,1,1,1,1']
              ]
            ]
          ]
        ]
      );
    });
  });

  suite('p5.prototype.matrix(n).forEach', function() {
    test('should be a function', function() {
      result = myp5.matrix(2, 2);
      assert.ok(result.forEach);
      assert.typeOf(result.forEach, 'function');
    });
    test('should loop through a 2 dimensional array', function() {
      const callback = sinon.fake();

      myp5.matrix(2, 2).forEach(callback);

      callback.should.have.callCount(4);
      callback.should.have.been.calledWith([0, 0]);
      callback.should.have.been.calledWith([0, 1]);
      callback.should.have.been.calledWith([1, 0]);
      callback.should.have.been.calledWith([1, 1]);
    });
    test('should loop through a 3 dimensional array', function() {
      const callback = sinon.fake();

      myp5.matrix(2, 2, 2).forEach(callback);

      callback.should.have.callCount(8);
      callback.should.have.been.calledWith([0, 0, 0]);
      callback.should.have.been.calledWith([0, 0, 1]);
      callback.should.have.been.calledWith([0, 1, 0]);
      callback.should.have.been.calledWith([0, 1, 1]);
      callback.should.have.been.calledWith([1, 0, 0]);
      callback.should.have.been.calledWith([1, 0, 1]);
      callback.should.have.been.calledWith([1, 1, 0]);
      callback.should.have.been.calledWith([1, 1, 1]);
    });
    test('should loop through a N dimensional array', function() {
      const callback = sinon.fake();

      myp5.matrix(2, 2, 2, 2).forEach(callback);

      callback.should.have.callCount(16);
      callback.should.have.been.calledWith([0, 0, 0, 0]);
      callback.should.have.been.calledWith([0, 0, 0, 1]);
      callback.should.have.been.calledWith([0, 0, 1, 0]);
      callback.should.have.been.calledWith([0, 0, 1, 1]);
      callback.should.have.been.calledWith([0, 1, 0, 0]);
      callback.should.have.been.calledWith([0, 1, 0, 1]);
      callback.should.have.been.calledWith([0, 1, 1, 0]);
      callback.should.have.been.calledWith([0, 1, 1, 1]);
      callback.should.have.been.calledWith([1, 0, 0, 0]);
      callback.should.have.been.calledWith([1, 0, 0, 1]);
      callback.should.have.been.calledWith([1, 0, 1, 0]);
      callback.should.have.been.calledWith([1, 0, 1, 1]);
      callback.should.have.been.calledWith([1, 1, 0, 0]);
      callback.should.have.been.calledWith([1, 1, 0, 1]);
      callback.should.have.been.calledWith([1, 1, 1, 0]);
      callback.should.have.been.calledWith([1, 1, 1, 1]);
    });
  });
});
