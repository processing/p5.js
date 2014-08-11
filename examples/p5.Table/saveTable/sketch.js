var table;

function setup() {

  table = new p5.Table();
  
  table.addColumn('name');
  table.addColumn('type');

  var newRow = table.addRow();
  newRow.setString('name', 'Lion');
  newRow.setString('type', 'Mammal');

  newRow = table.addRow();
  newRow.setString('name', 'Snake');
  newRow.setString('type', 'Reptile');

  newRow = table.addRow();
  newRow.setString('name', 'Mosquito');
  newRow.setString('type', 'Insect');

  saveTable(table, 'animals.csv', 'csv');
}

// Sketch saves the following to a file called 'animals.csv':
// 
// name,type
// Lion,Mammal
// Snake,Reptile
// Mosquito,Insect