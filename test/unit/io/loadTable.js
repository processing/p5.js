suite('loadTable', function() {
  var invalidFile = '404file';
  var validFile = 'unit/assets/csv.csv';

  test('_friendlyFileLoadError is called', async function() {
    const _friendlyFileLoadErrorStub = sinon.stub(p5, '_friendlyFileLoadError');
    try {
      await promisedSketch(function(sketch, resolve, reject) {
        sketch.preload = function() {
          sketch.loadTable(invalidFile, reject, resolve);
        };
      });
      expect(
        _friendlyFileLoadErrorStub.calledOnce,
        'p5._friendlyFileLoadError was not called'
      ).to.be.true;
    } finally {
      _friendlyFileLoadErrorStub.restore();
    }
  });

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadTable(invalidFile);
      setTimeout(resolve, 50);
    };

    sketch.setup = function() {
      reject(new Error('Setup called'));
    };

    sketch.draw = function() {
      reject(new Error('Draw called'));
    };
  });

  testSketchWithPromise('error callback is called', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadTable(
        invalidFile,
        function() {
          reject(new Error('Success callback executed.'));
        },
        function() {
          // Wait a bit so that if both callbacks are executed we will get an error.
          setTimeout(resolve, 50);
        }
      );
    };
  });

  testSketchWithPromise('loading correctly triggers setup', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadTable(validFile);
    };

    sketch.setup = function() {
      resolve();
    };
  });

  testSketchWithPromise('success callback is called', function(
    sketch,
    resolve,
    reject
  ) {
    var hasBeenCalled = false;
    sketch.preload = function() {
      sketch.loadTable(
        validFile,
        function() {
          hasBeenCalled = true;
        },
        function(err) {
          reject(new Error('Error callback was entered: ' + err));
        }
      );
    };

    sketch.setup = function() {
      if (!hasBeenCalled) {
        reject(new Error('Setup called prior to success callback'));
      } else {
        setTimeout(resolve, 50);
      }
    };
  });

  test('returns an object with correct data', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      let _table;
      sketch.preload = function() {
        _table = sketch.loadTable(validFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(_table);
      };
    });
    assert.equal(table.getRowCount(), 4);
    assert.strictEqual(table.getRow(1).getString(0), 'David');
    assert.strictEqual(table.getRow(1).getNum(1), 31);
  });

  test('passes an object to success callback for object JSON', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadTable(validFile, resolve, reject);
      };
    });
    assert.equal(table.getRowCount(), 4);
    assert.strictEqual(table.getRow(1).getString(0), 'David');
    assert.strictEqual(table.getRow(1).getNum(1), 31);
  });

  test('csv option returns the correct data', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadTable(validFile, 'csv', resolve, reject);
      };
    });
    assert.equal(table.getRowCount(), 4);
    assert.strictEqual(table.getRow(1).getString(0), 'David');
    assert.strictEqual(table.getRow(1).getNum(1), 31);
  });

  test('using the header option works', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadTable(validFile, 'header', resolve, reject);
      };
    });
    assert.equal(table.getRowCount(), 3);
    assert.strictEqual(table.getRow(0).getString('name'), 'David');
    assert.strictEqual(table.getRow(0).getNum('age'), 31);
  });

  test('allows the csv and header options together', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadTable(validFile, 'csv', 'header', resolve, reject);
      };
    });
    assert.equal(table.getRowCount(), 3);
    assert.strictEqual(table.getRow(0).getString('name'), 'David');
    assert.strictEqual(table.getRow(0).getNum('age'), 31);
  });

  test('CSV files should handle commas within quoted fields', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadTable(validFile, resolve, reject);
      };
    });
    assert.equal(table.getRowCount(), 4);
    assert.equal(table.getRow(2).get(0), 'David, Jr.');
    assert.equal(table.getRow(2).getString(0), 'David, Jr.');
    assert.equal(table.getRow(2).get(1), '11');
    assert.equal(table.getRow(2).getString(1), 11);
  });

  test('CSV files should handle escaped quotes and returns within quoted fields', async function() {
    const table = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadTable(validFile, resolve, reject);
      };
    });
    assert.equal(table.getRowCount(), 4);
    assert.equal(table.getRow(3).get(0), 'David,\nSr. "the boss"');
  });
});
