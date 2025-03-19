// Given the CSV file "mammals.csv"
// in the project's "assets" folder:
//
// id,species,name
// 0,Capra hircus,Goat
// 1,Panthera pardus,Leopard
// 2,Equus zebra,Zebra

let table;

async function setup() {
  // The table is comma separated value "csv"
  // and has a header specifying the columns labels.
  table = await loadTable('mammals.csv', ',', 'header');

  //find the animal named zebra
  let row = table.findRow('Zebra', 'name');
  //find the corresponding species
  console.log(row)
  print(row.getString('Zebra'));
  describe('no image displayed');
}