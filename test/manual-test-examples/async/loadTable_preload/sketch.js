let table;

function preload() {
  table = loadTable('table.csv', 'header');
}

function setup() {
  console.log(table);
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.columns.length; j++) {
      console.log(table.columns[j] + ': ' + table.rows[i].getString(j));
    }
    console.log('---');
  }
}
