var table;

function setup() {

  table = new p5.Table();

  table.addColumn("name");
  table.addColumn("type");

  var newRow = table.addRow();
  newRow.setString("name", "Lion");
  newRow.setString("type", "Mammal");

  newRow = table.addRow();
  newRow.setString("name", "Snake");
  newRow.setString("type", "Reptile");

  newRow = table.addRow();
  newRow.setString("name", "Mosquito");
  newRow.setString("type", "Insect");

  newRow = table.addRow();
  newRow.setString("name", "Lizard");
  newRow.setString("type", "Reptile");
  
  var rows = table.matchRows("R.*", "type");
  for (var i = 0; i < rows.length; i++) {
    println(rows[i].getString("name") + ": " + rows[i].getString("type"));
  }
}

// Sketch prints:
// Snake: Reptile
// Lizard: Reptile