var table;

function setup() {

  table = new p5.Table();

  table.addColumn("name");
  table.addColumn("type");

  var newRow = table.addRow();
  newRow.set("name", "   Lion");
  newRow.set("type", "  Mammal    ");

  newRow = table.addRow();
  newRow.set("name", "Snake  ");
  newRow.set("type", "Reptile      ");

  newRow = table.addRow();
  newRow.set("name", "  Mosquito  ");
  newRow.set("type", "Insect    ");
  
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