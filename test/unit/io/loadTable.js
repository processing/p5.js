/* global testSketchWithPromise */
suite('loadTable', function() {
  var invalidFile = '404file';
  var validFile = 'unit/assets/csv.csv';

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sinon.stub(console, 'error');
      sketch.loadTable(invalidFile);
      setTimeout(function() {
        if (!console.error.calledOnce) {
          reject(new Error('console.error was not called'));
        }
        console.error.restore();
        resolve();
      }, 100);
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

  testSketchWithPromise('returns an object with correct data', function(
    sketch,
    resolve,
    reject
  ) {
    var table;
    sketch.preload = function() {
      table = sketch.loadTable(validFile, function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.equal(table.getRowCount(), 4);
          assert.strictEqual(table.getRow(1).getString(0), 'David');
          assert.strictEqual(table.getRow(1).getNum(1), 31);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise('passes an object with correct data', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadTable(
        validFile,
        function(table) {
          resolve(
            new Promise(function(resolve, reject) {
              assert.equal(table.getRowCount(), 4);
              assert.strictEqual(table.getRow(1).getString(0), 'David');
              assert.strictEqual(table.getRow(1).getNum(1), 31);
              resolve();
            })
          );
        },
        reject
      );
    };
  });

  testSketchWithPromise('csv option returns the correct data', function(
    sketch,
    resolve,
    reject
  ) {
    var table;
    sketch.preload = function() {
      table = sketch.loadTable(validFile, 'csv', function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.equal(table.getRowCount(), 4);
          assert.strictEqual(table.getRow(1).getString(0), 'David');
          assert.strictEqual(table.getRow(1).getNum(1), 31);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise('using csv and tsv returns an error', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.throw(function() {
            sketch.loadTable(validFile, 'csv', 'tsv');
          }, 'Cannot set multiple separator types.');
          resolve();
        })
      );
    };
  });

  testSketchWithPromise('using the header option works', function(
    sketch,
    resolve,
    reject
  ) {
    var table;
    sketch.preload = function() {
      table = sketch.loadTable(validFile, 'header', function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.equal(table.getRowCount(), 3);
          assert.strictEqual(table.getRow(0).getString('name'), 'David');
          assert.strictEqual(table.getRow(0).getNum('age'), 31);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise('allows the header and csv options together', function(
    sketch,
    resolve,
    reject
  ) {
    var table;
    sketch.preload = function() {
      table = sketch.loadTable(
        validFile,
        'header',
        'csv',
        function() {},
        reject
      );
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.equal(table.getRowCount(), 3);
          assert.strictEqual(table.getRow(0).getString('name'), 'David');
          assert.strictEqual(table.getRow(0).getNum('age'), 31);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise(
    'CSV files should handle commas within quoted fields',
    function(sketch, resolve, reject) {
      var table;
      sketch.preload = function() {
        table = sketch.loadTable(validFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(
          new Promise(function(resolve, reject) {
            assert.equal(table.getRowCount(), 4);
            assert.equal(table.getRow(2).get(0), 'David, Jr.');
            assert.equal(table.getRow(2).getString(0), 'David, Jr.');
            assert.equal(table.getRow(2).get(1), '11');
            assert.equal(table.getRow(2).getString(1), 11);
            resolve();
          })
        );
      };
    }
  );

  testSketchWithPromise(
    'CSV files should handle escaped quotes and returns within quoted fields',
    function(sketch, resolve, reject) {
      var table;
      sketch.preload = function() {
        table = sketch.loadTable(validFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(
          new Promise(function(resolve, reject) {
            assert.equal(table.getRowCount(), 4);
            assert.equal(table.getRow(3).get(0), 'David,\nSr. "the boss"');
            resolve();
          })
        );
      };
    }
  );
});
