/**
 * Toggle play mode between 'mono' and 'poly'.
 * SoundFiles are polyphonic by default.
 * Music from Damscray, "Dancing Tiger", Creative Commons BY-NC-SA
 */

var playMode = 'poly';
var sample1, sample2, button;

function setup() {
  createCanvas(0,0);
  sample1 = loadSound( ['Damscray_-_Dancing_Tiger_01.ogg', 'Damscray_-_Dancing_Tiger_01.mp3'] );
  sample2 = loadSound( ['Damscray_-_Dancing_Tiger_02.ogg', 'Damscray_-_Dancing_Tiger_02.mp3'] );

  createP('Press "a" and "s" on your keyboard to play two different samples.<br> Trigger lots of sounds at once! Change mode to hear the difference');

  button = createButton('Current Play Mode: ');
  button.mousePressed(togglePlayMode);
}

function draw() {
  button.html('Current Play Mode: ' + playMode);
}

// alternate between 'poly' and 'mono', and set playMode of both samples
function togglePlayMode(){
  if (playMode == 'poly'){
    playMode = 'mono';
  }
  else {
    playMode = 'poly';
  }
  sample1.playMode(playMode);
  sample2.playMode(playMode);
}

function keyPressed(k) {
  if (k.keyCode == 65) {
    sample1.play(.6);

    // Get even more monophonic by only letting one sample play at a time
    if ( playMode =='mono' && sample2.isPlaying() ){
      sample2.stopAll();
    }
  }
  if (k.keyCode == 83) {
    if ( playMode =='mono' && sample1.isPlaying() ){
      sample1.stopAll();
    }
    sample2.play(.6);
  }
}