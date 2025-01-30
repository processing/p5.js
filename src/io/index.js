import files from './files.js';
import table from './p5.Table.js';
import tableRow from './p5.TableRow.js';
import xml from './p5.XML.js';

export default function(p5){
  p5.registerAddon(files);
  p5.registerAddon(table);
  p5.registerAddon(tableRow);
  p5.registerAddon(xml);
}
