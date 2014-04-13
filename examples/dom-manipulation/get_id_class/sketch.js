function setup() {
  var html = createHTML("Some text:");
  html.id("test");
  html.class("testC");
  html.position(10,50);
}

function mousePressed() {
  var test = getId("test");
}


function keyPressed() {
  var test = getClass("testC");
}