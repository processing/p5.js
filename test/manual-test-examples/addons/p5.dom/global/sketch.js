var canvas, img, slider, button, input, result, vid;
 
function setup() {
  canvas = createCanvas(200, 200);
  canvas.parent('test');
  canvas.position(100, 100);


  img = createImg("https://avatars1.githubusercontent.com/u/191056?s=460", "alt_text");
  img.position(500, 0);
  img.size(100, AUTO);


  slider = createSlider(0, 100, 20);


  input = createInput("hi");

  button = createButton("hikk", 10);
  button.mousePressed(function() {
    vid.play();
    result.html('input is: '+input.value());
  });

  result = createElement("H1", "this is h1");

  vid = createVideo('../fingers.mov');
  vid.loop(true);
  vid.hide();

}
 
function draw() {
  background(95, 165, 26);
  image(vid, 10, 10, 80, 180);
};
 
 
function mouseReleased() {
  // console.log('hi')
  // var can = p5DOM.getElement('myc');
  // can.position(10, 10);
  //document.getElementById('')
  console.log(slider.value());
}


function keyPressed() {
  // var can = p5DOM.getElement('myc');
  // can.position(10, 10);
  //document.getElementById('')
  slider.value(100);
}