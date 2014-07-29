var table;

function setup() {
  loadTable("table.csv", helloWorld);
  // println(table.getRowCount() + " total rows in table");
}

function helloWorld(stuff) {
  table = stuff;
}