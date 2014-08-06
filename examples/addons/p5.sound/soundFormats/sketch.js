/**
 *  There is no single audio format that is supported by all
 *  popular web browsers. Most web browsers support MP3, but
 *  some (Firefox, Opera) do not because it is a patented codec.
 *
 *  You can ensure file format compatability by including multiple
 *  file extensions. Both MP3 and OGG are recommended.
 */

var soundFile;

function preload() {
  // set the extensions we have included
  soundFormats('mp3', 'ogg');

  // load either beatbox.mp3 or beatbox.ogg, depending on the browser
  soundFile = loadSound('../_files/beatbox.mp3');
}

function setup() {
  createCanvas(400, 400);
  background(0);
}

function keyPressed() {
  soundFile.play();
  background(255, 255, 0);
}

function keyReleased() {
  background(0);
}
