function setup() {
  noCanvas();
  loadJSON(
    'https://wttr.in/Berlin?format=j1',
    parseStuff,
    'json'
  );
}

function parseStuff(data) {
  console.log(data);
}
