/**
 * webgl texture example
 * video source: https://vimeo.com/90312869
 */
var img;
var vid;
var theta = 0;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  //2D renderer
  // createCanvas(windowWidth, windowHeight);

  // img = loadImage("assets/cat.jpg");
  img = loadImage("assets/UV_Grid_Sm.jpg");
  // vid = createVideo(["assets/360video_256crop_v2.mp4"]);
  //vid.loop();
  //vid.hide();


}

function draw(){
  background(255, 255, 255, 255);
  push();
    translate(-100,0,0);
    rotateZ(theta * mouseX * 0.001);
    rotateX(theta * mouseX * 0.001);
    rotateY(theta * mouseX * 0.001);
    //pass image as texture
    // texture(vid);
    texture(img);
    // normalMaterial();
    sphere(400);
  pop();

  // push();
  //   translate(100,0,0);
  //   rotateZ(theta * 0.1);
  //   rotateX(theta * 0.1);
  //   rotateY(theta * 0.1);
  //   texture(img);
  //   box(45);
  // pop();
  theta += 0.05;
}