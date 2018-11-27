function setup() {
  audioEl = createAudio('../lucky_dragons.mp3');
  audioEl.showControls();
  audioEl.onended(sayDone);
}

function sayDone(elt) {
  alert('done playing ' + elt.src);
}
