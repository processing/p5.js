var table;

function setup() {

  table = new p5.Table();

  table.addColumn("name");
  table.addColumn("type");

  var newRow = table.addRow();
  newRow.set("name", "Lion");
  newRow.set("type", "Mammal");

  newRow = table.addRow();
  newRow.set("name", "Snake");
  newRow.set("type", "Reptile");

  newRow = table.addRow();
  newRow.set("name", "Mosquito");
  newRow.set("type", "Insect");
  
  println(table.getColumn("name"));
}

// Sketch prints:
// ["Lion", "Snake", "Mosquito"]