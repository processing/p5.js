var table;

function setup() {

  table = new p5.Table();

  table.addColumn("name");
  table.addColumn("type");

  var newRow = table.addRow();
  newRow.setString("name", "   Lion");
  newRow.setString("type", "  Mammal    ");

  newRow = table.addRow();
  newRow.setString("name", "Snake  ");
  newRow.setString("type", "Reptile      ");

  newRow = table.addRow();
  newRow.setString("name", "  Mosquito  ");
  newRow.setString("type", "Insect    ");
  
  println(table.getColumn("name"));
  println(table.getColumn("type"));
  table.trim();
  
  println(table.getColumn("name"));
  println(table.getColumn("type"));
}

// Sketch prints:
// ["   Lion", "Snake  ", "  Mosquito  "]
// ["  Mammal    ", "Reptile      ", "Insect    "]
// ["Lion", "Snake", "Mosquito"] sketch.js:26
// ["Mammal", "Reptile", "Insect"] 