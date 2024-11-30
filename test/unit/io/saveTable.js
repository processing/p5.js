import { mockP5, mockP5Prototype } from '../../js/mocks';
import * as fileSaver from 'file-saver';
import { vi } from 'vitest';
import files from '../../../src/io/files';
import table from '../../../src/io/p5.Table';
import tableRow from '../../../src/io/p5.TableRow';

vi.mock('file-saver');

suite('saveTable', function() {
  const validFile = '/test/unit/assets/csv.csv';
  let myTable;

  beforeAll(async function() {
    files(mockP5, mockP5Prototype);
    table(mockP5, mockP5Prototype);
    tableRow(mockP5, mockP5Prototype);
    myTable = await mockP5Prototype.loadTable(validFile, ',', 'header');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should be a function', function() {
    assert.ok(mockP5Prototype.saveTable);
    assert.typeOf(mockP5Prototype.saveTable, 'function');
  });

  test('should download a file with expected contents', async () => {
    mockP5Prototype.saveTable(myTable, 'filename');

    // TODO: Need comprehensive way to compare blobs in spy call
    expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
    expect(fileSaver.saveAs)
      .toHaveBeenCalledWith(
        expect.any(Blob),
        'filename.csv'
      );
  });

  test('should download a file with expected contents (tsv)', async () => {
    mockP5Prototype.saveTable(myTable, 'filename', 'tsv');

    // TODO: Need comprehensive way to compare blobs in spy call
    expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
    expect(fileSaver.saveAs)
      .toHaveBeenCalledWith(
        expect.any(Blob),
        'filename.tsv'
      );
  });

  test('should download a file with expected contents (html)', async () => {
    mockP5Prototype.saveTable(myTable, 'filename', 'html');

    expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
    expect(fileSaver.saveAs)
      .toHaveBeenCalledWith(
        expect.any(Blob),
        'filename.html'
      );
  });
  // testWithDownload(
  //   'should download a file with expected contents (html)',
  //   async function(blobContainer) {
  //     myp5.saveTable(myTable, 'filename', 'html');
  //     let myBlob = blobContainer.blob;
  //     let text = await myBlob.text();
  //     let domparser = new DOMParser();
  //     let htmldom = domparser.parseFromString(text, 'text/html');
  //     let trs = htmldom.querySelectorAll('tr');
  //     for (let i = 0; i < trs.length; i++) {
  //       let tds = trs[i].querySelectorAll('td');
  //       for (let j = 0; j < tds.length; j++) {
  //         // saveTable generates an HTML file with indentation spaces and line-breaks. The browser ignores these
  //         // while displaying. But they will still remain a part of the parsed DOM and hence must be removed.
  //         // More info at: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
  //         let tdText = tds[j].innerHTML.trim().replace(/\n/g, '');
  //         let tbText;
  //         if (i === 0) {
  //           tbText = myTable.columns[j].trim().replace(/\n/g, '');
  //         } else {
  //           tbText = myTable.rows[i - 1].arr[j].trim().replace(/\n/g, '');
  //         }
  //         assert.strictEqual(tdText, tbText);
  //       }
  //     }
  //   },
  //   true
  // );
});
