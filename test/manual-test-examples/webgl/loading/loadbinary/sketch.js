let data;

function preload() {
  data = loadModel('./yolo.stl');
}

function setup() {
  for (let i = 0; i < 5; i++) {
    console.log(data.bytes[i].toString(16));
  }
}
