var mic;
var amplitude, micLevel, masterLevel, levelLabel;

var soundToggle;
var soundOn = false;
var micOn = true;
var micToggle;

var h;

function setup() {
  createCanvas(400,400);
  noStroke();
  fill(255);

  mic = new p5.AudioIn();
  mic.start();

  // create controls
  levelLabel = createP('Master Volume: ');
  masterLevel = createSlider(0,100,50);

  soundToggle = createButton('Sound ON');
  soundToggle.mousePressed(toggleSound);

  micToggle = createButton('Stop Mic');
  micToggle.mousePressed(toggleMic);

  h = createP('enable the mic...');
  createP('NOTE: Mic is disconnected from master output (speakers) by default. Turning sound on with mic.connect( ) may cause a <a href="https://en.wikipedia.org/wiki/Audio_feedback" target="_blank">feedback loop</a> between the mic and speakers. Try headphones.');
}

function draw() {
  background(0);

  // get the volume level, accepts an optional smoothing value or defaults to 0.
  micLevel = mic.getLevel();

  text('input volume: ' + micLevel, 5, 10);

  // if the mic picks up a level greater than zero, we can assume
  // that the user has allowed their browser to access the microphone.
  if (micLevel > 0) {
    h.html('Make some noise!');
  }

  ellipse(width/2,height/2, 400*micLevel + 10, 400*micLevel + 10);

  // set master output
  levelLabel.html('Master Volume: ' + masterLevel.value()/100);
  masterVolume(masterLevel.value()/100);
}


// Toggle whether mic is connected to master output
function toggleSound() {
  if (soundOn == false) {
    mic.connect();
    soundOn = true;
    soundToggle.html('Sound OFF');
  } else {
    mic.disconnect();
    soundOn = false;
    soundToggle.html('Sound ON');
  }
}

// Toggle whether the mic is on (getting input) or off
function toggleMic() {
  if (micOn == true) {
    mic.stop();
    micOn = false;
    micToggle.html('Start Mic');
  } else {
    mic.start();
    micOn = true;
    micToggle.html('Stop mic');
  }
}