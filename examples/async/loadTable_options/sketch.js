var table;

function setup() {
  loadTable('table.csv', 'tsv', logResults);
}

function logResults(results) {
  table = results;
  console.log(table);
  for (var i = 0; i < table.rows.length; i++) {
    for (var j = 0; j < table.columns.length; j++ ) {
      console.log(table.columns[j] +': '+ table.rows[i].getString(j) );
    }
    console.log('---');
  }
}



r = random(5); // 4.3
r = int(r);


r = int(random(5));
