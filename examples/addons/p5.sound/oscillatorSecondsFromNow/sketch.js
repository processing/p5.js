/**
 * Example: change amplitude with fadeTime, and schedule the change to happen in the future.
 */

function setup() {
  osc = new p5.TriOsc();
  osc.freq(260);
  createP('mousePressed: set amplitude to .7 over the course of .2 seconds');
  createP('mouseReleased: 1 second fade to 0. Start the fade 0.5 seconds from now');
}

function mousePressed () {
  osc.start();
  // fade amplitude to .7 over the course of .2 seconds
  osc.amp(0.7, 0.002);
}

function mouseReleased() {
  // fade amplitude to zero over the course of 1 second. Start the fade after .5 seconds.
  osc.amp(0, 0.2, 0.5);
}
