
let img;

function preload() {
  img = loadImage('../../../../docs/reference/assets/moonwalk.jpg');
}

let pg;

function setup() {
  // img.resize(600, 600);
  createCanvas(img.width, img.height);
  pg = createGraphics(img.width, img.height, WEBGL);
}


function draw() {
  if(pg.webglVersion === P2D){
    pg.image(img, 0, 0, width, height);
  } else {
    pg.image(img, -width / 2, -height / 2, width, height);
  }

  if(mouseIsPressed){
    pg.filter(BLUR, 10);
  }

  image(pg, 0, 0, width, height);
}
