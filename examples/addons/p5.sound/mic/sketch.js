var mic;
var amplitude, micLevel, masterLevel, levelLabel;

var soundToggle;
var soundOn = false;
var micOn = true;
var micToggle;

var h;

function setup() {
  createCanvas(400,400);
  mic = new AudioIn();
  amplitude = new Amplitude();
  mic.on();

  // don't send mic to master output
  mic.disconnect();

  // only send to the Amplitude reader, so we can see it but not hear it.
  amplitude.setInput(mic);

  // create controls
  levelLabel = createP('Master Volume: ');
  masterLevel = createSlider(0,100,50);

  soundToggle = createButton('Sound ON');
  soundToggle.mousePressed(toggleSound);

  micToggle = createButton('Mic OFF');
  micToggle.mousePressed(toggleMic);

  h = createH1('enable the mic...');
  createP('NOTE: Turning sound on may cause a <a href="https://en.wikipedia.org/wiki/Audio_feedback" target="_blank">feedback loop</a> between the mic and speakers. Try headphones.');
}

function draw() {
  stroke(255);
  background(0);
  text('input volume: ' + amplitude.analyze(), 5, 10);

  micLevel = amplitude.analyze();

  // if the mic picks up a level greater than zero, that means it's enabled.
  if (micLevel > 0) {
    h.html('Make some noise!');
  }

  ellipse(width/2,height/2, 400*micLevel + 10, 400*micLevel + 10);

  // set master output
  levelLabel.html('Master Volume: ' + masterLevel.value()/100);
  volume(masterLevel.value()/100);
}


// Toggle whether mic is connected to p5Sound (output) or only to Amplitude
function toggleSound() {
  if (soundOn == false) {
    mic.connect();
    soundOn = true;
    soundToggle.html('Sound OFF');
  } else {
    mic.disconnect();
    amplitude.setInput(mic);
    soundOn = false;
    soundToggle.html('Sound ON');
  }
}

// Toggle whether the mic is on or off
function toggleMic() {
  if (micOn == true) {
    mic.off();
    micOn = false;
    micToggle.html('Mic ON');
  } else {
    mic.on();
    micOn = true;
    micToggle.html('Mic OFF');
  }
}