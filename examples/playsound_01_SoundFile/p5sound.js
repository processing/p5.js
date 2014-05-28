
// =====================================
// The p5sound object contains audio context, master gain
// =====================================


// Shim the Audio Context. More shimming to come.
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audiocontext;

audiocontext = new AudioContext();

var P5sound = function() {
  this.input = audiocontext.createGain();
  this.output = audiocontext.createGain();
  this.audiocontext = audiocontext;
}


P5sound.prototype.connect = function(unit){
  this.output.connect();
}

P5sound.prototype.disconnect = function(unit){
  this.output.disconnect();
}

// ======================================
// Determine what filetypes are supported -- inspired by Buzz.js (buzz.jaysalvat.com) Licensed under the MIT license by Jay Salvat)
// ======================================
P5sound.prototype.isSupported = function() {
  return !!el.canPlayType;
}

P5sound.prototype.isOGGSupported = function() {
  return !!el.canPlayType('audio/ogg; codecs="vorbis"');
}

P5sound.prototype.isMP3Supported = function() {
  return !!el.canPlayType('audio/mpeg;');
}

P5sound.prototype.isWAVSupported = function() {
  return !!el.canPlayType('audio/wav; codecs="1"');
}

P5sound.prototype.isAACSupported = function() {
  return !!el.canPlayType('audio/x-m4a;');
}



// ====================================
// SoundFile Object
// ====================================
var SoundFile = function(url1, url2) {

  // player variables
  this.url = url1 || url2;
  this.source = null;
  this.buffer = null;
  this.playbackRate = 1;

  //probably not the best way to do this.
  //should extend the P5 class instead.
  this.audiocontext = audiocontext;

  // calls load to load the AudioBuffer asyncronously
  this.load();
}

// load the sound file (this happens automatically when the soundfile is instantiated)
SoundFile.prototype.load = function(callback){
  if (!this.buffer) {
    var request = new XMLHttpRequest();
    request.open('GET', this.url, true);
    request.responseType = 'arraybuffer';
    // decode asyncrohonously
    var self = this;
    request.onload = function() {
      audiocontext.decodeAudioData(request.response, function(buff) {
        self.buffer = buff;
        if (callback) {
          callback(self);
        }
      });
    }
    request.send();
  }
  else {
    if (callback){
      callback(this);
    }
  }
}


SoundFile.prototype.play = function(rate, amp) {
  if (this.buffer) {
    // make the source
    this.source = this.audiocontext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = false;
    this.source.playbackRate.value = this.playbackRate;
    this.source.connect(this.audiocontext.destination);
    this.source.start(0);
  }
}

// variables (TK)
// rate
// rate, amp
// rate, pos, amp
// rate, pos, amp, add
// rate, pos, amp, add, cue
SoundFile.prototype.loop = function() {
  if (this.buffer) {
    this.source = this.audiocontext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = true;
    this.source.playbackRate.value = this.playbackRate;
    this.source.connect(this.audiocontext.destination);
    this.source.start(0);
  }
}


SoundFile.prototype.stop = function() {
  if (this.buffer && this.source) {
    this.source.stop();
  }
}

SoundFile.prototype.rate = function(playbackRate) {
  this.playbackRate = playbackRate;
}

SoundFile.prototype.pan = function() {
  // TO DO
}

SoundFile.prototype.sampleRate = function() {
  // TO DO

}

SoundFile.prototype.frames = function() {
  // TO DO
  // Return Samples
}

SoundFile.prototype.duration = function() {
  // Return Duration
  if (this.buffer) {
    return this.buffer.duration;
  } else {
    return 0;
  }
}
