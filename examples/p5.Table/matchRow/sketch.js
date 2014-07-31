var table;

function setup() {

  table = new Table();

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

  var result = table.matchRow("R.*", "type");
  println(result.get("name"));  // Prints "Snake"

}