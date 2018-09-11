let table;

function setup() {
  table = new p5.Table();

  table.addColumn('name');
  table.addColumn('type');

  let newRow = table.addRow();
  newRow.setString('name', 'Lion');
  newRow.setString('type', 'Mammal');

  newRow = table.addRow();
  newRow.setString('name', 'Snake');
  newRow.setString('type', 'Reptile');

  newRow = table.addRow();
  newRow.setString('name', 'Mosquito');
  newRow.setString('type', 'Insect');

  newRow = table.addRow();
  newRow.setString('name', 'Lizard');
  newRow.setString('type', 'Reptile');

  const rows = table.matchRows('R.*', 'type');
  for (let i = 0; i < rows.length; i++) {
    print(rows[i].getString('name') + ': ' + rows[i].getString('type'));
  }
}

// Sketch prints:
// Snake: Reptile
// Lizard: Reptile
