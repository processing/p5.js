/*
 *  Version .0001
 *  Experimenting with Web Audio wrapper for p5.js
 *  Incorporates elements from:
 *  --> TONE.js (c) Yotam Mann, 2014. Licensed under The MIT License (MIT). https://github.com/TONEnoTONE/Tone.js
 *  --> buzz.js (c) Jay Salvat, 2013. Licensed under The MIT License (MIT). http://buzz.jaysalvat.com/
 */


// =====================================
// The p5sound object contains audio context, master gain
// =====================================


// If window.AudioContext is unimplemented, it will alias to window.webkitAudioContext.
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Create the Audio Context.
var audiocontext;
audiocontext = new AudioContext();

// SHIMS (inspired by tone.js and AudioContext MonkeyPacth) ////////////////////////////////////////////////////////////////////

if (typeof audiocontext.createGain !== "function"){
  audioContext.createGain = audioContext.createGainNode;
}
if (typeof audiocontext.createDelay !== "function"){
  audioContext.createDelay = audioContext.createDelayNode;
}
if (typeof AudioBufferSourceNode.prototype.start !== "function"){
  AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
}
if (typeof AudioBufferSourceNode.prototype.stop !== "function"){
  AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
}
if (typeof OscillatorNode.prototype.start !== "function"){
  OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
}
if (typeof OscillatorNode.prototype.stop !== "function"){
  OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff; 
}
if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')){
  AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
}


var P5sound = function() {
  this.input = audiocontext.createGain();
  this.output = audiocontext.createGain();
  this.audiocontext = audiocontext;

  // connect output to master
  this.output.connect(this.audiocontext.destination);
}


P5sound.prototype.connect = function(unit){
  this.output.connect(unit);
}

P5sound.prototype.disconnect = function(unit){
  this.output.disconnect(unit);
}

// set gain ("amplitude")
P5sound.prototype.setAmp = function(vol){
  this.output.gain.value = vol;
}

// get gain ("amplitude")
P5sound.prototype.getAmp = function(){
  return this.output.gain.value;
}

// ================
// HELPER FUNCTIONS
// ================

// If the given argument is undefined, go with the default
  //@param {*} given
  //@param {*} fallback
  //@returns {*}
  P5sound.prototype.defaultArg = function(given, fallback){
    return isUndef(given) ? fallback : given;
  }

// ======================================
// Determine which filetypes are supported (inspired by buzz.js)
// ======================================

// Create an audio element
el = document.createElement('audio');

isSupported = function() {
  return !!el.canPlayType;
}

isOGGSupported = function() {
  return !!el.canPlayType && el.canPlayType('audio/ogg; codecs="vorbis"');
}

isMP3Supported = function() {
  return !!el.canPlayType && el.canPlayType('audio/mpeg;');
}

isWAVSupported = function() {
  return !!el.canPlayType && el.canPlayType('audio/wav; codecs="1"');
}

isAACSupported = function() {
  return !!el.canPlayType && (el.canPlayType('audio/x-m4a;') || el.canPlayType('audio/aac;'));
}

isAIFSupported = function() {
  return !!el.canPlayType && el.canPlayType('audio/x-aiff;');
}

isFileSupported = function(extension) {
  switch(extension.toLowerCase())
  {
    case 'mp3':
      return this.isMP3Supported();
      break;
    case 'wav':
      return this.isWAVSupported();
      break;
    case 'ogg':
      return this.isOGGSupported();
      break;
    case 'aac', 'm4a', 'mp4':
      return this.isAACSupported();
      break;
    case 'aif', 'aiff':
      return this.isAIFSupported();
    default:
      return false;
      break;
  }
}



// Another way to Loop (for callbacks)
var loop_now = function(sfile) {
  console.log('ready to loop!');
  if (sfile.buffer) {
    sfile.source = sfile.p5s.audiocontext.createBufferSource();
    sfile.source.buffer = sfile.buffer;
    sfile.source.loop = true;

    // set variables like playback rate, gain and panning
    sfile.source.playbackRate.value = sfile.playbackRate;
    sfile.source.gain.value = sfile.gain;
    // connect to panner, which is already connected to the destination.
    sfile.source.connect(sfile.panner); 

    // play the sound
    sfile.source.start(0);
  }
  // If it hasn't loaded the buffer yet, load it then loop it in the callback
  else {
    console.log('not loaded yet');
//    sfile.load(loop);
  }
}

// Another way to Play (for callbacks)
var play_now = function(sfile) {
  console.log('ready to play!');
  if (sfile.buffer) {
    sfile.source = sfile.p5s.audiocontext.createBufferSource();
    sfile.source.buffer = sfile.buffer;
    sfile.source.loop = false;

    // set variables like playback rate, gain and panning
    sfile.source.playbackRate.value = sfile.playbackRate;
    sfile.source.gain.value = sfile.gain;
    // connect to panner, which is already connected to the destination.
    sfile.source.connect(sfile.panner); 

    // play the sound
    sfile.source.start(0);
  }
  // If it hasn't loaded the buffer yet, load it then loop it in the callback
  else {
    console.log('not loaded yet');
//    sfile.load(loop);
  }
}


// ====================================
// SoundFile Object
// ====================================
/*
The SoundFile takes a path to a sound file. 

Because sound file formats such as mp3, ogg, wav and m4a/aac are not compatible across all web browsers, 
you have the option to include multiple paths to multiple file formats (i.e. sound.wav, sound.mp3, sound.ogg)

*/
var SoundFile = function(p5sound, path1, path2, path3) {

  var path = path1;

  // verify support for audio file(s)
  if (path1) {
    var extension = path1.split(".").pop();
    var supported = isFileSupported(extension);
    if (supported) {
      console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
      }
    else {
      console.log('.'+extension + ' is not a valid audio extension in this web browser');
      path = path2;
      path1 = false;
      }
  }

  if (path1 == false && path2) {
    var extension = path2.split(".").pop();
    var supported = isFileSupported(extension);
    if (supported) {
      console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
      }
    else {
      console.log('.'+extension + ' is not a valid audio extension in this web browser');
      path = path3;
      path2 = false;
      }
  }

  if (path2 == false && path3) {
    var extension = path3.split(".").pop();
    var supported = isFileSupported(extension);
    if (supported) {
      console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
      }
    else {
      console.log('.'+extension + ' is not a valid audio extension in this web browser');
      path = path2;
      }
  }

  // store a local reference to the p5sound context
  this.p5s = p5sound;

  // player variables
  this.url = path;
  this.source = null;
  this.buffer = null;
  this.playbackRate = 1;
  this.gain = 1;

  // sterep panning
  this.panPosition = 0.0;
  this.panner = audiocontext.createPanner();
  this.panner.panningModel = 'equalpower';
  this.panner.distanceModel = 'linear';
  this.panner.setPosition(0,0,0);


  // the panner is always connected to the destination
  this.panner.connect(p5sound.output);

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
    this.source = this.p5s.audiocontext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = false;

    // set variables like playback rate, gain and panning
    this.source.playbackRate.value = this.playbackRate;
    this.source.gain.value = this.gain;

    // connect to panner, which is already connected to the destination.
    this.source.connect(this.panner); 

    // play the sound
    this.source.start(0);
  }
  // If soundFile hasn't loaded the buffer yet, load it then play it in the callback
  else {
    console.log('not ready to play');
    this.load(play_now);
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
    this.source = this.p5s.audiocontext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = true;

    // set variables like playback rate, gain and panning
    this.source.playbackRate.value = this.playbackRate;
    this.source.gain.value = this.gain;
    // connect to panner, which is already connected to the destination.
    this.source.connect(this.panner); 

    // play the sound
    this.source.start(0);
  }
  // If soundFile hasn't loaded the buffer yet, load it then loop it in the callback
  else {
    console.log('not ready to loop');
    this.load(loop_now);
  }
}



// Loop a sound, or stop looping a sound
SoundFile.prototype.toggleLoop = function() {
  if (this.buffer && this.source) {
    this.source.loop = !this.source.loop;
    console.log(this.url + ' looping = ' + this.source.loop);
    if (this.source.loop == true) {
      this.loop();
    } else {
      this.stop();
    }
  } else {
    this.loop();
    console.log(this.url + ' looping!');
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

SoundFile.prototype.sampleRate = function() {
  // TO DO

}

SoundFile.prototype.frames = function() {
  // TO DO
  // Return Samples
}

// set gain ("amplitude")
SoundFile.prototype.setGain = function(vol){
  this.gain = vol;
}

// get gain ("amplitude")
SoundFile.prototype.getGain = function(){
  return this.gain;
}


// stereo panner anywhere between -1.0 (left) and 1.0 (right)
SoundFile.prototype.pan = function(pval) {
  this.panPosition = pval;
  pval = pval * 90.0;
  var xDeg = parseInt(pval);
  var zDeg = xDeg + 90;
  if (zDeg > 90) {
    zDeg = 180 - zDeg;
  }
  var x = Math.sin(xDeg * (Math.PI / 180));
  var z = Math.sin(zDeg * (Math.PI / 180));
  this.panner.setPosition(x, 0, z);
}

SoundFile.prototype.getPan = function() {
  // TO DO
  return this.panPosition;
}

// Connect the SoundFile to an output
SoundFile.prototype.connect = function(to) {
  if (this.buffer && this.source) {
    this.source.connect(to);
  }
}

SoundFile.prototype.duration = function() {
  // Return Duration
  if (this.buffer) {
    return this.buffer.duration;
  } else {
    return 0;
  }
}

// ================
// AMPLITUDE OBJECT
// Inspired by tone.js https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/component/Meter.js
// The MIT License (MIT) Copyright (c) Yotam Mann 2014
//
// Also inspired by https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
// The MIT License (MIT) Copyright (c) 2014 Chris Wilson
// ================

var Amplitude = function(p5s) {

  // store a reference to the p5sound instance
  this.p5s = p5s;

  // set audio context
  this.audiocontext = this.p5s.audiocontext;
  this.processor = this.audiocontext.createScriptProcessor(this.bufferSize);


  // Set to 512 for now. In future iterations, this should be inherited
  this.bufferSize = 512;


  // this may only be necessary because of a Chrome bug
  this.processor.connect(this.audiocontext.destination);

  // the variables to return
  this.volume = 0;
  this.average = 0;

  this.processor.onaudioprocess = this.volumeAudioProcess.bind(this);
}


// Connects to the p5sound instance (master output) by default.
// Optionally, you can pass in a specific source (i.e. a soundfile).
// If you give it a source, the source's buffer must already exist (i.e. be playing) before connecting.
Amplitude.prototype.input = function(source) {
  if (source == null) {
    this.p5s.output.connect(this.processor);
  }
  else if (typeof(source.connect)) {
    source.connect(this.processor);
  }
  // connect to the master out of p5s instance by default
  else {
    this.p5s.output.connect(this.processor);
  }
}

Amplitude.prototype.volumeAudioProcess = function(event) {
  // return result
  var inputBuffer = event.inputBuffer.getChannelData(0);
  var bufLength = inputBuffer.length
  var total = 0;
  var sum = 0;
  var x;
//  console.log('audio event! ' + input);
  for (var i = 0; i < bufLength; i++) {
    x = inputBuffer[i];
    total += x;
  }
  sum += x * x;

  var average = total/ bufLength;

  // ... then take the square root of the sum.
  var rms = Math.sqrt(sum / bufLength);

  this.volume = Math.max(rms, this.volume*.95);

  if (average > 0.001) {
//    console.log('volume: ' + this.volume);
  }
}

Amplitude.prototype.process = function() {
  return this.volume;
}
