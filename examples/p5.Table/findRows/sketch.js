var table;

function setup() {

  table = new Table();

  table.addColumn('name');
  table.addColumn('type');

  var newRow = table.addRow();
  newRow.set('name', 'Lion');
  newRow.set('type', 'Mammal');

  newRow = table.addRow();
  newRow.set('name', 'Snake');
  newRow.set('type', 'Reptile');

  newRow = table.addRow();
  newRow.set('name', 'Mosquito');
  newRow.set('type', 'Insect');

  newRow = table.addRow();
  newRow.set('name', 'Lizard');
  newRow.set('type', 'Reptile');

  var rows = table.findRows('Reptile', 'type');
  for (var i = 0; i < rows.length; i++){
    println(rows[i].get('name') + ': ' + rows[i].get('type'));
  }
}

// Sketch prints:
// Snake: Reptile
// Lizard: Reptile