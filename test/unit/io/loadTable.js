import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import files from '../../../src/io/files';
import table from '../../../src/io/p5.Table';
import tableRow from '../../../src/io/p5.TableRow';

suite('loadTable', function() {
  const invalidFile = '404file';
  const validFile = '/test/unit/assets/csv.csv';

  beforeAll(async () => {
    files(mockP5, mockP5Prototype);
    table(mockP5, mockP5Prototype);
    tableRow(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadTable(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadTable(invalidFile, () => {
        reject("Success callback executed");
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadTable(validFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, (err) => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('returns an object with correct data', async () => {
    const table = await mockP5Prototype.loadTable(validFile);
    assert.equal(table.getRowCount(), 4);
    assert.strictEqual(table.getRow(1).getString(0), 'David');
    assert.strictEqual(table.getRow(1).getNum(1), 31);
  });

  test('passes an object with correct data to success callback', async () => {
    await mockP5Prototype.loadTable(validFile, (table) => {
      assert.equal(table.getRowCount(), 4);
      assert.strictEqual(table.getRow(1).getString(0), 'David');
      assert.strictEqual(table.getRow(1).getNum(1), 31);
    });
  });

  test('separator option returns the correct data', async () => {
    const table = await mockP5Prototype.loadTable(validFile, ',');
    assert.equal(table.getRowCount(), 4);
    assert.strictEqual(table.getRow(1).getString(0), 'David');
    assert.strictEqual(table.getRow(1).getNum(1), 31);
  });

  test('using the header option works', async () => {
    const table = await mockP5Prototype.loadTable(validFile, ',', true);
    assert.equal(table.getRowCount(), 3);
    assert.strictEqual(table.getRow(0).getString(0), 'David');
    assert.strictEqual(table.getRow(0).getNum(1), 31);
  });

  test('CSV files should handle commas within quoted fields', async () => {
    const table = await mockP5Prototype.loadTable(validFile);
    assert.equal(table.getRowCount(), 4);
    assert.equal(table.getRow(2).get(0), 'David, Jr.');
    assert.equal(table.getRow(2).getString(0), 'David, Jr.');
    assert.equal(table.getRow(2).get(1), '11');
    assert.equal(table.getRow(2).getString(1), 11);
  });

  test('CSV files should handle escaped quotes and returns within quoted fields', async () => {
    // TODO: Current parsing does not handle quoted fields
    const table = await mockP5Prototype.loadTable(validFile);
    assert.equal(table.getRowCount(), 4);
    const value = table.getRow(3).get(0).replace(/\r\n/g, '\n');
    assert.equal(value, 'David,\nSr. "the boss"');
  });
});
