var species = [ "Capra hircus", "Panthera pardus", "Equus zebra" ];
var names = [ "Goat", "Leopard", "Zebra" ];

var values; // Array that contains JSON objects

function setup() {

  values = [];

  for (var i = 0; i < species.length; i++) {

    var animal = {};

    animal.id = i;
    animal.species = species[i];
    animal.name = names[i];

    // console.log(JSON.stringify(animal));
    values.push(animal); // add an animal object to the array
  }

  saveJSON(values, 'animals.json');
}

// Sketch saves the following to a file called "animals.json":
// [
//   {
//     "id": 0,
//     "species": "Capra hircus",
//     "name": "Goat"
//   },
//   {
//     "id": 1,
//     "species": "Panthera pardus",
//     "name": "Leopard"
//   },
//   {
//     "id": 2,
//     "species": "Equus zebra",
//     "name": "Zebra"
//   }
// ]
