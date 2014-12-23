// Example: Record a sound and then play it back.
// We need p5.AudioIn (mic / sound source), p5.SoundRecorder
// (records the sound), and a p5.SoundFile (play back).

var mic, recorder, myLoop;

var state = 0; // mousePress will increment from Record, to Stop, to Play

var kick;

function preload() {
  // load the kick
  kick = loadSound('../_files/beatbox.mp3');
}

function setup() {
  createCanvas(400,400);
  background(200);
  fill(0);

  kick.loop();

  // create an audio in
  mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();
}

function mousePressed() {
  // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
  if (mic.enabled && !recorder.recording) {

    // Tell recorder to record to a p5.SoundFile which we will use for playback
    var fourBeats = (kick.duration() * 4);
    myLoop = new p5.SoundFile();
    recorder.record(myLoop, fourBeats, playRecording);
    background(255,0,0);
  }
}

function playRecording() {
  myLoop.loop();
  background(0,255,0);
}
