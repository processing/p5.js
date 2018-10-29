var renderer;
var geometry;

function setup() {
  // put setup code here

  //setAttributes('antialias', true);
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);
  stroke(0);

  camera(0, -600, 300, 0, 0, 0, 0, -1, 0);

  geometry = new p5.Geometry(100, 100, function() {
    for (var y = 0; y <= this.detailY; y++) {
      var v = y / this.detailY;
      for (var x = 0; x <= this.detailX; x++) {
        var u = x / this.detailX;
        var p = new p5.Vector(u - 0.5, v - 0.5, 0);
        this.vertices.push(p);
        this.uvs.push(u, v);
      }
    }
  });
}

function draw() {
  var tt = millis();

  background(0);

  //stroke(0);
  noStroke();

  var sunPos = p5.Vector.fromAngles(tt / 5000, PI / 4, 1000);
  push();
  fill(255, 250, 136);
  translate(sunPos);
  sphere(60);
  pop();

  var moonPos = p5.Vector.fromAngles(PI + tt / 5000, PI / 4, 1000);
  push();
  translate(moonPos);
  fill(255);
  sphere(40);
  pop();

  for (var y = 0; y <= geometry.detailY; y++) {
    for (var x = 0; x <= geometry.detailX; x++) {
      var v = noise(
        3 * x / geometry.detailX,
        3 * y / geometry.detailY,
        tt / 10000
      );
      v = map(v, 0, 1, -0.5, 1);
      if (v < 0) v = 0;
      v = v * v * v;
      v = map(v, 0, 1, 0, 500);
      geometry.vertices[y * (geometry.detailX + 1) + x].z = v;
    }
  }

  fill(255);

  pointLight(255, 250, 136, sunPos);
  pointLight(150, 150, 150, moonPos);

  geometry.computeFaces().computeNormals();
  renderer.createBuffers('!', geometry);
  renderer.drawBuffersScaled('!', 1000, 1000, 1);
}
