suite('Files', function() {
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

  //variable for preload
  var preload = p5.prototype.preload;
  var result;

  // httpDo
  suite('httpDo()', function() {
    test('should be a function', function() {
      assert.ok(myp5.httpDo);
      assert.isFunction(myp5.httpDo);
    });

    test('should work when provided with just a path', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/sentences.txt', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept method parameter', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/sentences.txt', 'GET', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept type parameter', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/array.json', 'text', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should accept method and type parameter together', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo('unit/assets/array.json', 'GET', 'text', resolve, reject);
      }).then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.httpDo(
          'unit/assets/sen.txt',
          function(data) {
            reject('Incorrectly succeeded.');
          },
          resolve
        );
      }).then(function(err) {
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });

    test('should return a promise', function() {
      var promise = myp5.httpDo('unit/assets/sentences.txt');
      assert.instanceOf(promise, Promise);
      return promise.then(function(data) {
        assert.ok(data);
        assert.isString(data);
      });
    });

    test('should return a promise that rejects on error', function() {
      return new Promise(function(resolve, reject) {
        var promise = myp5.httpDo('404file');
        assert.instanceOf(promise, Promise);
        promise.then(function(data) {
          reject(new Error('promise resolved.'));
        });
        resolve(
          promise.catch(function(error) {
            assert.instanceOf(error, Error);
          })
        );
      });
    });
  });

  // tests while preload is true without callbacks
  //p5.prototype.preload = function() {};
  preload = true;

  test('preload is a Boolean', function() {
    assert.typeOf(preload, 'Boolean');
  });

  // loadJSON()
  suite('loadJSON() in Preload', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadJSON);
      assert.typeOf(myp5.loadJSON, 'function');
    });

    test('should return an Object', function() {
      result = myp5.loadJSON('unit/assets/array.json');
      assert.ok(result);
      assert.isObject(result, 'result is an object');
    });
  });
  // loadXML()
  suite('loadXML() in Preload', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadXML);
      assert.typeOf(myp5.loadXML, 'function');
    });

    test('should return an Object', function() {
      result = myp5.loadXML('unit/assets/books.xml');
      assert.ok(result);
      assert.isObject(result, 'result is an object');
    });
  });

  // loadStrings()
  suite('loadStrings() in Preload', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadStrings);
      assert.typeOf(myp5.loadStrings, 'function');
    });

    test('should return an array', function() {
      result = myp5.loadStrings('unit/assets/sentences.txt');
      assert.ok(result);
      assert.isArray(result, 'result is and array');
    });
  });

  //tests while preload is false with callbacks
  preload = false;

  // myp5.loadJSON()
  suite('p5.prototype.myp5.loadJSON', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadJSON);
      assert.typeOf(myp5.loadJSON, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON('unit/assets/array.json', resolve, reject);
      });
    });

    test('should pass an Array to callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON('unit/assets/array.json', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 3, 'length of data is 3');
      });
    });

    test('should call error callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON(
          'unit/assets/arr.json',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadJSON(
          'unit/assets/arr.json',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      }).then(function(err) {
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });

    // @TODO Need to check this does what it should
    test('should allow json to override jsonp', function() {
      return new Promise(function(resolve, reject) {
        result = myp5.loadJSON(
          'unit/assets/array.json',
          'json',
          resolve,
          reject
        );
      }).then(function(resp) {
        assert.ok(resp);
      });
    });
  });

  // loadXML()
  suite('p5.prototype.loadXML', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadXML);
      assert.typeOf(myp5.loadXML, 'function');
    });

    //Missing reference to parseXML, might need some test suite rethink
    // test('should call callback function if provided', function() {
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   });
    // });
    //
    // test('should pass an Object to callback function', function(){
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   }).then(function(data) {
    //     assert.isObject(data);
    //   });
    // });
  });

  // loadStrings()
  suite('p5.prototype.loadStrings', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadStrings);
      assert.typeOf(myp5.loadStrings, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings('unit/assets/sentences.txt', resolve, reject);
      });
    });

    test('should pass an Array to callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings('unit/assets/sentences.txt', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 68, 'length of data is 68');
      });
    });

    test('should include empty strings', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings('unit/assets/empty_lines.txt', resolve, reject);
      }).then(function(data) {
        assert.isArray(data, 'Array passed to callback function');
        assert.lengthOf(data, 6, 'length of data is 6');
      });
    });

    test('should call error callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings(
          'unit/assets/sen.txt',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      });
    });

    test('should pass error object to error callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadStrings(
          'unit/assets/sen.txt',
          function(data) {
            reject('Success callback executed');
          },
          resolve
        );
      }).then(function(err) {
        assert.isFalse(err.ok, 'err.ok is false');
        assert.equal(err.status, 404, 'Error status is 404');
      });
    });
  });

  suite('p5.prototype.loadTable', function() {
    var url = 'unit/assets/csv.csv';

    test('should be a function', function() {
      assert.isFunction(myp5.loadTable);
    });

    test('should load a file without options', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      });
    });

    test('the loaded file should be correct', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.strictEqual(resp.getRow(1).getString(0), 'David');
        assert.strictEqual(resp.getRow(1).getNum(1), 31);
      });
    });

    test('using the csv option works', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, 'csv', resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.strictEqual(resp.getRow(1).getString(0), 'David');
        assert.strictEqual(resp.getRow(1).getNum(1), 31);
      });
    });

    test('using the csv and tsv options fails', function() {
      var fn = function() {
        myp5.loadTable(url, 'csv', 'tsv');
      };
      assert.throw(fn, 'Cannot set multiple separator types.');
    });

    test('using the header option works', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, 'header', resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 3);
        assert.strictEqual(resp.getRow(0).getString('name'), 'David');
        assert.strictEqual(resp.getRow(0).getNum('age'), 31);
      });
    });

    test('using the header and csv options together works', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, 'header', 'csv', resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 3);
        assert.strictEqual(resp.getRow(0).getString('name'), 'David');
        assert.strictEqual(resp.getRow(0).getNum('age'), 31);
      });
    });

    test('CSV files should handle commas within quoted fields', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.equal(resp.getRow(2).get(0), 'David, Jr.');
        assert.equal(resp.getRow(2).getString(0), 'David, Jr.');
        assert.equal(resp.getRow(2).get(1), '11');
        assert.equal(resp.getRow(2).getString(1), 11);
      });
    });

    test('CSV files should handle escaped quotes and returns within quoted fields', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadTable(url, resolve, reject);
      }).then(function(resp) {
        assert.equal(resp.getRowCount(), 4);
        assert.equal(resp.getRow(3).get(0), 'David,\nSr. "the boss"');
      });
    });
  });

  // loadXML()
  suite('p5.prototype.loadXML', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadXML);
      assert.typeOf(myp5.loadXML, 'function');
    });

    //Missing reference to parseXML, might need some test suite rethink
    // test('should call callback function if provided', function() {
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   });
    // });
    //
    // test('should pass an Object to callback function', function(){
    //   return new Promise(function(resolve, reject) {
    //     myp5.loadXML('unit/assets/books.xml', resolve, reject);
    //   }).then(function(data) {
    //     assert.isObject(data);
    //   });
    // });
  });

  // loadBytes()
  suite('p5.prototype.loadBytes', function() {
    test('should be a function', function() {
      assert.ok(myp5.loadBytes);
      assert.typeOf(myp5.loadBytes, 'function');
    });

    test('should call callback function if provided', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      });
    });

    test('should call error callback function if not found', function() {
      var errorCalled = false;
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('notfound.jpg', resolve, reject);
      })
        .catch(function() {
          errorCalled = true;
        })
        .then(function() {
          assert.isTrue(errorCalled);
        });
    });

    test('should pass an Object to callback function', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      }).then(function(data) {
        assert.isObject(data);
      });
    });

    test('data.bytes should be an Array/Uint8Array', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      }).then(function(data) {
        expect(data.bytes).to.satisfy(function(v) {
          return Array.isArray(v) || v instanceof Uint8Array;
        });
      });
    });

    test('should load correct data', function() {
      return new Promise(function(resolve, reject) {
        myp5.loadBytes('unit/assets/nyan_cat.gif', resolve, reject);
      }).then(function(data) {
        var str = 'GIF89a';
        // convert the string to a byte array
        var rgb = str.split('').map(function(e) {
          return e.charCodeAt(0);
        });
        // this will convert a Uint8Aray to [], if necessary:
        var loaded = Array.prototype.slice.call(data.bytes, 0, str.length);
        assert.deepEqual(loaded, rgb);
      });
    });
  });

  // saveStrings()
  suite('p5.prototype.saveStrings', function() {
    test('should be a function', function() {
      assert.ok(myp5.saveStrings);
      assert.typeOf(myp5.saveStrings, 'function');
    });

    test('no friendly-err-msg I', function() {
      assert.doesNotThrow(
        function() {
          let strings = ['some', 'words'];
          myp5.saveStrings(strings, 'myfile');
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg II', function() {
      assert.doesNotThrow(
        function() {
          let strings = ['some', 'words'];
          myp5.saveStrings(strings, 'myfile', 'txt');
        },
        Error,
        'got unwanted exception'
      );
    });

    test('no friendly-err-msg III', function() {
      assert.doesNotThrow(
        function() {
          let strings = ['some', 'words'];
          myp5.saveStrings(strings, 'myfile', 'txt', true);
        },
        Error,
        'got unwanted exception'
      );
    });

    testUnMinified('missing param #1', function() {
      assert.validationError(function() {
        let strings = ['some', 'words'];
        myp5.saveStrings(strings);
      });
    });

    testUnMinified('wrong param type at #0', function() {
      assert.validationError(function() {
        let strings = 'some words';
        myp5.saveStrings(strings);
      });
    });

    testWithDownload(
      'should download a file with expected contents',
      async function(blobContainer) {
        let strings = ['some', 'words'];

        myp5.saveStrings(strings, 'myfile');

        let myBlob = blobContainer.blob;
        let text = await myBlob.text();
        // Each element on a separate line with a trailing line-break
        assert.strictEqual(text, strings.join('\n') + '\n');
      },
      true
    );

    testWithDownload(
      'should download a file with expected contents with CRLF',
      async function(blobContainer) {
        let strings = ['some', 'words'];

        myp5.saveStrings(strings, 'myfile', 'txt', true);
        let myBlob = blobContainer.blob;
        let text = await myBlob.text();
        // Each element on a separate line with a trailing CRLF
        assert.strictEqual(text, strings.join('\r\n') + '\r\n');
      },
      true
    );
  });

  // saveJSON()
  suite('p5.prototype.saveJSON', function() {
    test('should be a function', function() {
      assert.ok(myp5.saveJSON);
      assert.typeOf(myp5.saveJSON, 'function');
    });

    test('no friendly-err-msg I', function() {
      assert.doesNotThrow(
        function() {
          let myObj = { hi: 'hello' };
          myp5.saveJSON(myObj, 'myfile');
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg II', function() {
      assert.doesNotThrow(
        function() {
          let myObj = [{ hi: 'hello' }];
          myp5.saveJSON(myObj, 'myfile');
        },
        Error,
        'got unwanted exception'
      );
    });

    test('no friendly-err-msg III', function() {
      assert.doesNotThrow(
        function() {
          let myObj = { hi: 'hello' };
          myp5.saveJSON(myObj, 'myfile', true);
        },
        Error,
        'got unwanted exception'
      );
    });

    testUnMinified('missing param #1', function() {
      assert.validationError(function() {
        let myObj = { hi: 'hello' };
        myp5.saveJSON(myObj);
      });
    });

    testUnMinified('wrong param type at #0', function() {
      assert.validationError(function() {
        let myObj = 'some words';
        myp5.saveJSON(myObj);
      });
    });

    testWithDownload(
      'should download a file with expected contents',
      async function(blobContainer) {
        let myObj = { hi: 'hello' };

        myp5.saveJSON(myObj, 'myfile');
        let myBlob = blobContainer.blob;
        let text = await myBlob.text();
        let json = JSON.parse(text);
        // Each element on a separate line with a trailing line-break
        assert.deepEqual(myObj, json);
      },
      true // asyncFn = true
    );
  });

  // writeFile()
  suite('p5.prototype.writeFile', function() {
    test('should be a function', function() {
      assert.ok(myp5.writeFile);
      assert.typeOf(myp5.writeFile, 'function');
    });
    testWithDownload(
      'should download a file with expected contents (text)',
      async function(blobContainer) {
        let myArray = ['hello', 'hi'];

        myp5.writeFile(myArray, 'myfile');
        let myBlob = blobContainer.blob;
        let text = await myBlob.text();
        assert.strictEqual(text, myArray.join(''));
      },
      true // asyncFn = true
    );
  });

  // downloadFile()
  suite('p5.prototype.downloadFile', function() {
    test('should be a function', function() {
      assert.ok(myp5.writeFile);
      assert.typeOf(myp5.writeFile, 'function');
    });
    testWithDownload(
      'should download a file with expected contents',
      async function(blobContainer) {
        let myArray = ['hello', 'hi'];
        let inBlob = new Blob(myArray);
        myp5.downloadFile(inBlob, 'myfile');
        let myBlob = blobContainer.blob;
        let text = await myBlob.text();
        assert.strictEqual(text, myArray.join(''));
      },
      true // asyncFn = true
    );
  });

  // save()
  suite('p5.prototype.save', function() {
    suite('saving images', function() {
      let waitForBlob = async function(blc) {
        let sleep = function(ms) {
          return new Promise(r => setTimeout(r, ms));
        };
        while (!blc.blob) {
          await sleep(5);
        }
      };
      setup(function(done) {
        myp5.createCanvas(20, 20);
        myp5.background(255, 0, 0);
        done();
      });

      test('should be a function', function() {
        assert.ok(myp5.save);
        assert.typeOf(myp5.save, 'function');
      });

      testWithDownload(
        'should download a png file',
        async function(blobContainer) {
          myp5.save();
          await waitForBlob(blobContainer);
          let myBlob = blobContainer.blob;
          assert.strictEqual(myBlob.type, 'image/png');

          blobContainer.blob = null;
          let gb = myp5.createGraphics(100, 100);
          myp5.save(gb);
          await waitForBlob(blobContainer);
          myBlob = blobContainer.blob;
          assert.strictEqual(myBlob.type, 'image/png');
        },
        true
      );

      testWithDownload(
        'should download a jpg file',
        async function(blobContainer) {
          myp5.save('filename.jpg');
          await waitForBlob(blobContainer);
          let myBlob = blobContainer.blob;
          assert.strictEqual(myBlob.type, 'image/jpeg');

          blobContainer.blob = null;
          let gb = myp5.createGraphics(100, 100);
          myp5.save(gb, 'filename.jpg');
          await waitForBlob(blobContainer);
          myBlob = blobContainer.blob;
          assert.strictEqual(myBlob.type, 'image/jpeg');
        },
        true
      );
    });

    suite('saving strings and json', function() {
      testWithDownload(
        'should download a text file',
        async function(blobContainer) {
          let myStrings = ['aaa', 'bbb'];
          myp5.save(myStrings, 'filename');
          let myBlob = blobContainer.blob;
          let text = await myBlob.text();
          assert.strictEqual(text, myStrings.join('\n') + '\n');
        },
        true
      );

      testWithDownload(
        'should download a json file',
        async function(blobContainer) {
          let myObj = { hi: 'hello' };
          myp5.save(myObj, 'filename.json');
          let myBlob = blobContainer.blob;
          let text = await myBlob.text();
          let outObj = JSON.parse(text);
          assert.deepEqual(outObj, myObj);
        },
        true
      );
    });

    suite('saving tables', function() {
      let validFile = 'unit/assets/csv.csv';
      let myTable;
      setup(function loadMyTable(done) {
        myp5.loadTable(validFile, 'csv', 'header', function(table) {
          myTable = table;
          done();
        });
      });
      testWithDownload(
        'should download a csv file',
        async function(blobContainer) {
          myp5.save(myTable, 'filename.csv');
          let myBlob = blobContainer.blob;
          let text = await myBlob.text();
          let myTableStr = myTable.columns.join(',') + '\n';
          for (let i = 0; i < myTable.rows.length; i++) {
            myTableStr += myTable.rows[i].arr.join(',') + '\n';
          }
          assert.strictEqual(text, myTableStr);

          myp5.save(myTable, 'filename', 'csv');
          myBlob = blobContainer.blob;
          text = await myBlob.text();
          assert.strictEqual(text, myTableStr);
        },
        true
      );
      testWithDownload(
        'should download a tsv file',
        async function(blobContainer) {
          myp5.save(myTable, 'filename.tsv');
          let myBlob = blobContainer.blob;
          let text = await myBlob.text();
          let myTableStr = myTable.columns.join('\t') + '\n';
          for (let i = 0; i < myTable.rows.length; i++) {
            myTableStr += myTable.rows[i].arr.join('\t') + '\n';
          }
          assert.strictEqual(text, myTableStr);

          myp5.save(myTable, 'filename', 'tsv');
          myBlob = blobContainer.blob;
          text = await myBlob.text();
          assert.strictEqual(text, myTableStr);
        },
        true
      );

      testWithDownload(
        'should download an html file',
        async function(blobContainer) {
          myp5.save(myTable, 'filename.html');
          let myBlob = blobContainer.blob;
          let text = await myBlob.text();
          let domparser = new DOMParser();
          let htmldom = domparser.parseFromString(text, 'text/html');
          let trs = htmldom.querySelectorAll('tr');
          for (let i = 0; i < trs.length; i++) {
            let tds = trs[i].querySelectorAll('td');
            for (let j = 0; j < tds.length; j++) {
              let tdText = tds[j].innerHTML.trim().replace(/\n/g, '');
              let tbText;
              if (i === 0) {
                tbText = myTable.columns[j].trim().replace(/\n/g, '');
              } else {
                tbText = myTable.rows[i - 1].arr[j].trim().replace(/\n/g, '');
              }
              assert.strictEqual(tdText, tbText);
            }
          }

          myp5.save(myTable, 'filename', 'html');
          myBlob = blobContainer.blob;
          text = await myBlob.text();
          htmldom = domparser.parseFromString(text, 'text/html');
          trs = htmldom.querySelectorAll('tr');
          for (let i = 0; i < trs.length; i++) {
            let tds = trs[i].querySelectorAll('td');
            for (let j = 0; j < tds.length; j++) {
              let tdText = tds[j].innerHTML.trim().replace(/\n/g, '');
              let tbText;
              if (i === 0) {
                tbText = myTable.columns[j].trim().replace(/\n/g, '');
              } else {
                tbText = myTable.rows[i - 1].arr[j].trim().replace(/\n/g, '');
              }
              assert.strictEqual(tdText, tbText);
            }
          }
        },
        true
      );
    });
  });
});
