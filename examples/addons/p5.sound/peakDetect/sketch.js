// first try at live beat detection from fft data
// contains two classes : one for onset detection - OnsetDetect and one to detect when amplitude reaches a certain treshold - BeatDetect (probably ill named)

var file ='../_files/Tripping.mp3'


var source_file; // sound file
var src_length; // hold its duration

var fft;

var pg; // to draw waveform

var playing = false;
var button;

// detectors listen for peaks
var detectors = [];

// visual representation of detectors
var beatBalls = [];


function preload(){
  source_file = loadSound(file); // preload the sound
}

function setup() {
  createCanvas(windowWidth, 250);
  textAlign(CENTER);

  src_length = source_file.duration();
  source_file.playMode('restart'); 
  println("source duration: " +src_length);

  // draw the waveform to an off-screen graphic
  var peaks = source_file.getPeaks(); // get an array of peaks
  pg = createGraphics(width,150);
  pg.background(100);
  pg.translate(0,75);
  pg.noFill();
  pg.stroke(0);
  for (var i = 0 ; i < peaks.length ; i++){
    var x = map(i,0,peaks.length,0,width);
    var y = map(peaks[i],0,1,0,150);
    pg.line(x,0,x,y);
    pg.line(x,0,x,-y);
   }


    // FFT
   fft = new p5.FFT();

   /*
     instantiate peak detectors that will
     detect peaks in part of the frequency spectrum of the fft
    */ 

   // low band : 40Hz-120Hz
   detectors.push( new p5.PeakDetect(40, 120, 0.8, 20) );

   // lowMid band : 140Hz-400Hz
   detectors.push( new p5.PeakDetect(140, 400, 0.7, 20) );

   // mid band : 400Hz-2.6kHz
   detectors.push( new p5.PeakDetect(400, 2600, 0.4, 20) );

   // make a similar array of beatBalls that will show when a beat is detected
   beatBalls.push( new BeatBall(650, 50) );
   beatBalls.push( new BeatBall(750, 50) );
   beatBalls.push( new BeatBall(850, 50) );

   // tell the detectors to call gotPeak function when they detect a peak
   for (var i = 0; i < detectors.length; i++) {
    detectors[i].onPeak( gotPeak, i );
   }

   // gui
   button = createButton('play');
   button.position(3, 3);
   button.mousePressed(play);
}


function draw() {
	background(180);

	image(pg,0,100); // display our waveform representation

  // draw playhead position 
  fill(255,255,180,150);
  noStroke();
  rect(map(source_file.currentTime(),0,src_length,0,windowWidth),100,3,150);

  //display current time
  text("current time: "+nfc(source_file.currentTime(),1)+" s",60,50);

  fft.analyze(); 

  // display and update our detector objects
  text("peak detection ",750,15);
  text("40Hz-120Hz", 650, 80);
  text("140Hz-400Hz", 750, 80);
  text("400Hz-2.6kHz", 850, 80);

  for (var i = 0; i < detectors.length; i++) {
    detectors[i].update(fft);
    beatBalls[i].update();
  }

  if (source_file.currentTime()>=src_length-0.05){
    source_file.pause();
  }

}

function mouseClicked(){
	if(mouseY>100 && mouseY<350){		
		var playpos = constrain(map(mouseX,0,windowWidth,0,src_length),0,src_length);	
		source_file.play();	
		source_file.play(0,1,1,playpos,src_length);	
		playing = true;
		button.html('pause');		
	}	
	return false;//callback for p5js
}

function keyTyped(){
	if (key == ' '){
		play();
	}
	return false; // callback for p5js
}

function play(){
	if(playing){
		source_file.pause();
		button.html('play');
		playing = false;
	}
	else{
		source_file.play();
		button.html('pause');
		playing = true;
	}	
}

// Beat Ball Class

BeatBall = function(x, y) {
  this.x = x;
  this.y = y;
  this.size = 20;
  this.target = 0;
}

BeatBall.prototype.update = function() {
	fill(255,0,0);
	ellipse(this.x, this.y, this.size + this.target, this.size + this.target);
	// fill(0);
	// text(this.str,x,y);
	// text("( "+detector.f1+" - "+detector.f2+"Hz )",x,y+10);
  this.target *= 0.95;
}

BeatBall.prototype.trigger = function(value) {
  this.target = 50*value;
}

function gotPeak(value, index) {
  beatBalls[index].trigger(value);
}
