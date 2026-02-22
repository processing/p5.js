suite('saveTable', function() {
  let validFile = 'unit/assets/csv.csv';
  let myp5;
  let myTable;

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

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  setup(function loadMyTable(done) {
    myp5.loadTable(validFile, 'csv', 'header', function(table) {
      myTable = table;
      done();
    });
  });

  test('should be a function', function() {
    assert.ok(myp5.saveTable);
    assert.typeOf(myp5.saveTable, 'function');
  });

  test('no friendly-err-msg I', function() {
    assert.doesNotThrow(
      function() {
        myp5.saveTable(myTable, 'myfile');
      },
      Error,
      'got unwanted exception'
    );
  });

  test('no friendly-err-msg II', function() {
    assert.doesNotThrow(
      function() {
        myp5.saveTable(myTable, 'myfile', 'csv');
      },
      Error,
      'got unwanted exception'
    );
  });

  testUnMinified('missing param #1', function() {
    assert.validationError(function() {
      myp5.saveTable(myTable);
    });
  });

  testUnMinified('wrong param type #0', function() {
    assert.validationError(function() {
      myp5.saveTable('myTable', 'myfile');
    });
  });

  testUnMinified('wrong param type #1', function() {
    assert.validationError(function() {
      myp5.saveTable(myTable, 2);
    });
  });

  testUnMinified('wrong param type #2', function() {
    assert.validationError(function() {
      myp5.saveTable(myTable, 'myfile', 2);
    });
  });

  testWithDownload(
    'should download a file with expected contents',
    async function(blobContainer) {
      myp5.saveTable(myTable, 'filename');
      let myBlob = blobContainer.blob;
      let text = await myBlob.text();
      let myTableStr = myTable.columns.join(',') + '\n';
      for (let i = 0; i < myTable.rows.length; i++) {
        myTableStr += myTable.rows[i].arr.join(',') + '\n';
      }

      assert.strictEqual(text, myTableStr);
    },
    true
  );

  testWithDownload(
    'should download a file with expected contents (tsv)',
    async function(blobContainer) {
      myp5.saveTable(myTable, 'filename', 'tsv');
      let myBlob = blobContainer.blob;
      let text = await myBlob.text();
      let myTableStr = myTable.columns.join('\t') + '\n';
      for (let i = 0; i < myTable.rows.length; i++) {
        myTableStr += myTable.rows[i].arr.join('\t') + '\n';
      }
      assert.strictEqual(text, myTableStr);
    },
    true
  );

  testWithDownload(
    'should properly escape CSV fields containing quotes, commas, and newlines',
    async function(blobContainer) {
      let table = new p5.Table();
      table.addColumn('name');
      table.addColumn('value');
      let row1 = table.addRow();
      row1.setString('name', 'has "quotes"');
      row1.setString('value', 'normal');
      let row2 = table.addRow();
      row2.setString('name', 'has,comma');
      row2.setString('value', 'has\nnewline');
      let row3 = table.addRow();
      row3.setString('name', 'combo",\n');
      row3.setString('value', 'plain');

      myp5.saveTable(table, 'test.csv');
      let myBlob = blobContainer.blob;
      let text = await myBlob.text();

      let expected = 'name,value\n';
      expected += '"has ""quotes""",normal\n';
      expected += '"has,comma","has\nnewline"\n';
      expected += '"combo"",\n",plain\n';

      assert.strictEqual(text, expected);
    },
    true
  );

  testWithDownload(
    'should download a file with expected contents (html)',
    async function(blobContainer) {
      myp5.saveTable(myTable, 'filename', 'html');
      let myBlob = blobContainer.blob;
      let text = await myBlob.text();
      let domparser = new DOMParser();
      let htmldom = domparser.parseFromString(text, 'text/html');
      let trs = htmldom.querySelectorAll('tr');
      for (let i = 0; i < trs.length; i++) {
        let tds = trs[i].querySelectorAll('td');
        for (let j = 0; j < tds.length; j++) {
          // saveTable generates an HTML file with indentation spaces and line-breaks. The browser ignores these
          // while displaying. But they will still remain a part of the parsed DOM and hence must be removed.
          // More info at: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
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
