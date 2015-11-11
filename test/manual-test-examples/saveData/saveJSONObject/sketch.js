var json;

function setup() {

  json = {}; // new JSON Object

  json.id = 0;
  json.species = 'Panthera leo';
  json.name = 'Lion';

  save(json, 'lion.json');
}

// Sketch saves the following to a file called "lion.json":
// {
//   "id": 0,
//   "species": "Panthera leo",
//   "name": "Lion"
// }
