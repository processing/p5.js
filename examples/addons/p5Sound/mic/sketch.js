var mic;
var amplitude, micLevel, masterLevel, levelLabel;

var soundToggle;
var soundOn = false;

function setup() {
  createCanvas(400,400);
  mic = new AudioIn();
  amplitude = new Amplitude();
  mic.on();

  // don't send to master output
  mic.disconnect();

  // only send to the Amplitude reader
  amplitude.setInput(mic);

  levelLabel = createP('Master Volume: ');
  masterLevel = createSlider(0,100,50);

  soundToggle = createButton('Sound ON');
  soundToggle.mousePressed(toggleSound);

  createP('NOTE: Turning sound on may cause a <a href="https://en.wikipedia.org/wiki/Audio_feedback" target="_blank">feedback loop</a> between the mic and speakers. Try headphones.');
}

function draw() {
  stroke(255);
  background(0);
  text('input volume: ' + amplitude.process(), 5, 10);

  micLevel = amplitude.process();
  ellipse(width/2,height/2, 400*micLevel + 10, 400*micLevel + 10);

  // set master output
  levelLabel.html('Master Volume: ' + masterLevel.value()/100);
  p5sound.amp(masterLevel.value()/100);
}


function toggleSound() {
  if (soundOn == false) {
    mic.connect(p5sound);
    soundOn = true;
    soundToggle.html('Sound OFF');
  } else {
    mic.disconnect();
    amplitude.setInput(mic);
    soundOn = false;
    soundToggle.html('Sound ON');
  }
}