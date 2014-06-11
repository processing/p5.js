/**
 *  Version .0002
 *
 *  p5Sound (master output), SoundFile, Amplitude, FFT, Oscillator
 *
 *  p5Sound by Jason Sigal
 *
 *  Incorporates elements from:
 *   - TONE.js (c) Yotam Mann, 2014. Licensed under The MIT License (MIT). https://github.com/TONEnoTONE/Tone.js
 *   - buzz.js (c) Jay Salvat, 2013. Licensed under The MIT License (MIT). http://buzz.jaysalvat.com/
 *   - Boris Smus Web Audio API book, 2013. Licensed under the Apache License http://www.apache.org/licenses/LICENSE-2.0
 *   - Wilm Thoben's Sound library for Processing
 */


/**
 * These global variables are the core output of the p5Sound library:
 */
var p5Sound; // Master output. By default, everything connects to the p5Sound.
var SoundFile; // Plays sound files
var Amplitude; // Measures Amplitude (Volume)
var FFT; // Returns an array of frequency data
var Oscillator, SinOsc, SqrOsc, SawOsc, TriOsc, Pulse;


var createP5Sound = (function(){

  /**
   * Web Audio SHIMS and helper functions to ensure compatability across browsers
   */

  // If window.AudioContext is unimplemented, it will alias to window.webkitAudioContext.
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // Create the Audio Context
  var audiocontext;
  audiocontext = new AudioContext();

  // Polyfills & SHIMS (inspired by tone.js and the AudioContext MonkeyPatch https://github.com/cwilso/AudioContext-MonkeyPatch/ (c) 2013 Chris Wilson, Licensed under the Apache License) //

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


  /**
   * Determine which filetypes are supported (inspired by buzz.js)
   * The audio element (el) will only be used to test browser support for various audio formats
   */
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


  /**
   * Callbacks to be used for soundfile playback & loading
   */

  // If a SoundFile is played before the buffer.source has loaded, it will load the file and pass this function as the callback.
  var play_now = function(sfile) {
    if (sfile.buffer) {
      sfile.source = sfile.p5s.audiocontext.createBufferSource();
      sfile.source.buffer = sfile.buffer;
      sfile.source.loop = sfile.looping;

      // set variables like playback rate, gain and panning
      sfile.source.playbackRate.value = sfile.playbackRate;
      sfile.source.gain.value = sfile.gain;

      // connect to panner, which is already connected to the destination.
      sfile.source.connect(sfile.panner); 

      // play the sound
      sfile.source.start(0, this.startTime);
      sfile.startSeconds = sfile.p5s.audiocontext.currentTime;
      sfile.playing = true;
      sfile.paused = false;
    }

    else {
      console.log(sfile.url + ' not loaded yet');
    }
  }



  /**
   * The P5Sound object contains audio context, master gain
   * @constructor
   * @class P5Sound
   * @param {window} a reference to the document window ("this")
   */
  var P5Sound = function() {
    this.input = audiocontext.createGain();
    this.output = audiocontext.createGain();

    //put a hard limiter on the output
    this.limiter = audiocontext.createDynamicsCompressor();
    this.limiter.threshold.value = 0;
    this.limiter.ratio.value = 100;

    this.audiocontext = audiocontext;

    // tell the window about the p5 object so that we can reference it in the future
    window.p5sound = this;

    this.output.disconnect(this.audiocontext.destination);

    // connect input to limiter
    this.input.connect(this.limiter);

    // connect limiter to output
    this.limiter.connect(this.output);

    // connect output to destination
    this.output.connect(this.audiocontext.destination);
  }


  P5Sound.prototype.connect = function(unit){
    this.output.connect(unit);
  }

  P5Sound.prototype.disconnect = function(unit){
    this.output.disconnect(unit);
  }

  // set gain ("amplitude?")
  P5Sound.prototype.setGain = function(vol){
    this.output.gain.value = vol;
  }

  // get gain ("amplitude?")
  P5Sound.prototype.getGain = function(){
    return this.output.gain.value;
  }

  // return sampleRate for this p5Sound audio context
  P5Sound.prototype.sampleRate = function(){
    return this.audiocontext.sampleRate;
  }
  // create a single instance of the master output
  p5Sound = new P5Sound();



  /**
   * The SoundFile object.
   * 
   * Because sound file formats such as mp3, ogg, wav and m4a/aac are not compatible across all web browsers, 
   * you have the option to include multiple paths to multiple file formats (i.e. sound.wav, sound.mp3, sound.ogg)
   *
   * @constructor
   * @class SoundFile
   * @param {path1} [path1]   path to a sound file 
   * @param {path2} [path2]   (optional) path to additional format of the sound file to ensure compatability across browsers
   * @param {path3} [path3]   (optional) path to additional format of the sound file to ensure compatability across browsers
   */
  SoundFile = function(path1, path2, path3) {

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

    // store a local reference to the window's p5sound context
    this.p5s = window.p5sound;


    // player variables
    this.url = path;
    this.source = null;
    this.buffer = null;
    this.playbackRate = 1;
    this.gain = 1;

    // start and end of playback / loop
    this.startTime = 0;
    this.endTime = null;

    // loop on/off - defaults to false
    this.looping = false;

    // playing - defaults to false
    this.playing = false;

    // paused - defaults to true
    this.paused = null;

    // time that playback was started, in millis
    this.startMillis = null;

    // sterep panning
    this.panPosition = 0.0;
    this.panner = audiocontext.createPanner();
    this.panner.panningModel = 'equalpower';
    this.panner.distanceModel = 'linear';
    this.panner.setPosition(0,0,0);



    // by default, the panner is connected to the p5s destination
    this.panner.connect(this.p5s.input);

    // load the AudioBuffer asyncronously
    this.load();
  }

  // Load the sound file (this happens automatically when the soundfile is instantiated)
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

  /**
   * Play the SoundFile
   *
   * @method play
   * @param {Number} [rate]             (optional) playback rate. 1.0 is normal, .5 plays the sound at half speed, 2.0 is twice as fast.
   * @param {Number} [amp]              (optional) amplitude (volume) of playback
   * @for SoundFile
   */
  SoundFile.prototype.play = function(rate, amp) {
    // this.looping = false;
    if (this.buffer) {
      // make the source
      this.source = this.p5s.audiocontext.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = this.looping;

      // set rate and amp if provided
      if (rate) {
        this.playbackRate = rate;
      }
      if (amp) {
        this.gain = amp;
      }

      // set variables like playback rate, gain and panning
      this.source.playbackRate.value = this.playbackRate;
      this.source.gain.value = this.gain;

      // connect to panner, which is already connected to the destination.
      this.source.connect(this.panner); 

      // play the sound
      this.source.start(0, this.startTime);
      this.startSeconds = this.p5s.audiocontext.currentTime;
      this.playing = true;
      this.paused = false;
    }
    // If soundFile hasn't loaded the buffer yet, load it then play it in the callback
    else {
      console.log('not ready to play');
      this.load(play_now);
    }
  }

  /**
   * Loop the SoundFile. 
   *
   * Will be able to accept the following parameters (not yet implemented):
   * rate
   * rate, amp
   * rate, pos, amp
   * rate, pos, amp, add
   * rate, pos, amp, add, cue
   *
   * @method loop
   * @for SoundFile
   */
  SoundFile.prototype.loop = function(rate, amp) {
    this.play(rate, amp);
    this.looping = true;
  }

  /**
   * Toggle whether a soundfile is looping or not.
   * Accepts an optional boolean parameter (set looping to true or false)
   *
   * @method toggleLoop
   * @param boolean
   * @for SoundFile
   */
  SoundFile.prototype.toggleLoop = function(bool) {
    if (typeof(bool) == 'boolean'){
      this.looping = bool;
    }
    else {
      this.looping = !this.looping;
    }
    if (this.source) {
      this.source.loop = this.looping;
    }
  }

  /**
   * Pause a file that is currently playing.
   * Save the start time & loop status (true/false) so that we can continue playback from the same spot
   */
  SoundFile.prototype.pause = function() {
    var keepLoop = this.looping;
    if (this.isPlaying() && this.buffer && this.source) {
      this.startTime = this.currentTime();
      this.stop();
      this.paused = true;
    }
    else {
        this.play();
        this.looping = keepLoop;
    }
  }

  /**
   * Returns 'true' if a SoundFile is looping, 'false' if not.
   *
   * @method isLooping
   * @return {Boolean}
   * @for SoundFile
   */
  SoundFile.prototype.isLooping = function() {
    if (!this.source) {
      return false;
    }
    return this.looping;
  }

  SoundFile.prototype.isPlaying = function() {
    return this.playing;
  }

  SoundFile.prototype.isPaused = function() {
    if (!this.paused) {
      return false;
    }
    return this.paused;
  }

  /**
   * Stop soundfile playback.
   *
   * @method stop
   * @for SoundFile
   */
  SoundFile.prototype.stop = function() {
    if (this.buffer && this.source) {
      this.source.stop();
      this.playing = false;
    }
  }


  /**
   * Set the playback rate of a sound file. Will change the speed and the pitch.
   *
   * @method rate
   * @param {Number} [playbackRate]     Set the playback rate. 1.0 is normal, .5 is half-speed, 2.0 is twice as fast. Must be greater than zero.
   * @for SoundFile
   */
  SoundFile.prototype.rate = function(playbackRate) {
    this.playbackRate = playbackRate;
  }

  SoundFile.prototype.sampleRate = function() {
    return this.buffer.sampleRate;
  }

  // Return Samples
  SoundFile.prototype.frames = function() {
    return soundFile.buffer.length; //this.buffer.duration * this.buffer.sampleRate
  }

  SoundFile.prototype.channels = function() {
    return soundFile.buffer.numberOfChannels;
  }


  SoundFile.prototype.add = function() {
    // TO DO
  }

  /**
   * Set the output gain of a sound file.
   *
   * @method setGain
   * @param {Number} [vol]     Set the gain. 1.0 is normal. 0.0 is silence.
   * @for SoundFile
   */
  SoundFile.prototype.setGain = function(vol){
    this.gain = vol;
  }

  /**
   * Returns the output gain of a sound file.
   *
   * @method getGain
   * @returns {Number}        1.0 is normal. 0.0 is silence.
   * @for SoundFile
   */
  SoundFile.prototype.getGain = function(){
    return this.gain;
  }


  /**
   * Set the stereo panning of a sound file.
   *
   * @method pan
   * @param {Number} [pval]     Set the stereo panner to a floating point number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
   * @for SoundFile
   */
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

  /**
   * Returns the current stereo panning value of a sound file.
   *
   * @method getPan
   * @return {Number}     Returns the stereo pan setting of the soundFile as a number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
   * @for SoundFile
   */
  SoundFile.prototype.getPan = function() {
    return this.panPosition;
  }

  // Connect the SoundFile to an output
  SoundFile.prototype.connect = function(to) {
    if (this.buffer && this.source) {
      this.panner.connect(to);
//      catch this.source.connect(to.input);
    }
  }


  /**
   * Returns the duration of a sound file.
   *
   * @method duration
   * @return {Number}     The duration of the soundFile in seconds.
   * @for SoundFile
   */
  SoundFile.prototype.duration = function() {
    // Return Duration
    if (this.buffer) {
      return this.buffer.duration;
    } else {
      return 0;
    }
  }

  SoundFile.prototype.fade = function() {
    // TO DO
  }

  /**
   * Return the current moment in the song, in seconds
   */
  SoundFile.prototype.currentTime = function() {
    // TO DO --> make this work with paused audio
    if (this.isPlaying()) {
      var howLong = ( (this.p5s.audiocontext.currentTime - this.startSeconds + this.startTime) * this.playbackRate ) % this.duration();
      return howLong;
    }
    else {
      return this.startTime;
    }
  }

  /**
   * Cue playback at a moment in the song, in seconds
   */
  SoundFile.prototype.cue = function(cueTime) {
    if ( (cueTime > 0) && (cueTime < this.buffer.duration) ) {
      this.startTime = cueTime;
    }
    else if (!cueTime || cueTime == 0) {
      this.startTime = 0;
    }
    else {
      console.log('cue time out of range!');
    }
  }

    /**
    * Amplitude
    * 
    * Inspired by tone.js https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/component/Meter.js
    * The MIT License (MIT) Copyright (c) Yotam Mann 2014
    * Also inspired by https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
    * The MIT License (MIT) Copyright (c) 2014 Chris Wilson
    * 
    * @constructor
    * @class Amplitude
    * @param {Object} [w]          a reference to the document.window (usually 'this', i.e. new Amplitude(this); ) 
    */
  Amplitude = function(smoothing) {

    // store a local reference to the window's p5sound context
    this.p5s = window.p5sound;

    // set audio context
    this.audiocontext = this.p5s.audiocontext;
    this.processor = this.audiocontext.createScriptProcessor(this.bufferSize);


    // Set to 2048 for now. In future iterations, this should be inherited or parsed from p5sound's default
    this.bufferSize = 2048;

    //smoothing (defaults to .95)
    this.smoothing = .95;

    if (smoothing) {
      this.smoothing = smoothing;
    }

    // this may only be necessary because of a Chrome bug
    this.processor.connect(this.audiocontext.destination);

    // the variables to return
    this.volume = 0;
    this.average = 0;
    this.volMax = .001;
    this.normalize = false;

    this.processor.onaudioprocess = this.volumeAudioProcess.bind(this);

    // connect to p5sound master output by default, unless set by input()
    this.p5s.output.connect(this.processor);

  }



  /**
   * Connects to the p5sound instance (master output) by default.
   * Optionally, you can pass in a specific source (i.e. a soundfile).
   * If you give it a source, the source's buffer must already exist (i.e. be playing) before connecting.
   *
   * @method input
   * @param {soundObject|undefined} [snd]       set the sound source (optional, defaults to master output). If it is a soundFile, the buffer must have finished loading.
   * @param {Number|undefined} [smoothing]      a range between 0.0 and .999 to smooth amplitude readings. This is optional, defaults to .8)
   * @for Amplitude
   */

   // TO DO figure out how to connect to a buffer before it is loaded
  Amplitude.prototype.input = function(snd, smoothing) {

    // set smoothing if smoothing is provided
    if (smoothing) {
      this.smoothing = smoothing;
    }

    // connect to the master out of p5s instance if no snd is provided
    if (snd == null) {
      console.log('Amplitude input source is not ready! Connecting to master output instead');
      this.p5s.output.connect(this.processor);
    }

    // If buffer.source hassn't finished loading, ideally, input should wait for the buffer to load and then connect.
    // But for now, it just connects to master.
    else if (snd.source == null) {
      console.log('source is not ready to connect. Connecting to master output instead');
      // Not working: snd.load(this.input); // TO DO: figure out how to make it work!
      this.p5s.output.connect(this.processor);
    }

    // connect to the sound if it is available
    else if (typeof(snd.connect)) {
      snd.connect(this.processor);
      console.log('connecting Amplitude to ' + snd.url);
    }

    // otherwise, connect to the master out of p5s instance (default)
    else {
      this.p5s.output.connect(this.processor);
    }
  }


  // TO DO make this stereo / dependent on # of audio channels
  Amplitude.prototype.volumeAudioProcess = function(event) {
    // return result
    var inputBuffer = event.inputBuffer.getChannelData(0);
    var bufLength = inputBuffer.length
    var total = 0;
    var sum = 0;
    var x;

    for (var i = 0; i < bufLength; i++) {
      x = inputBuffer[i];
      if (this.normalize){
        total += constrain(x/this.volMax, -1, 1);
        sum += constrain(x/this.volMax, -1, 1) * constrain(x/this.volMax, -1, 1);
      }
      else {
        total += x;
        sum += x * x;
      }
    }

    var average = total/ bufLength;

    // ... then take the square root of the sum.
    var rms = Math.sqrt(sum / bufLength);

    this.volume = Math.max(rms, this.volume*this.smoothing);
    this.volMax=max(this.volume, this.volMax);

    // normalized values
    this.volNorm = constrain(this.volume/this.volMax, 0, 1);
  }

  /**
   * Returns the volume read by an Amplitude reader.
   *
   * @method process
   * @return {Number}       Amplitude as a number between 0.0 and 1.0
   * @for Amplitude
   */
  Amplitude.prototype.process = function() {
    if (this.normalize) {
      return this.volNorm;
    }
    else {
      return this.volume;
    }
  }

  /**
   * Turns normalize on/off.
   *
   * @method toggleNormalize
   * @for Amplitude
   */
  Amplitude.prototype.toggleNormalize = function() {
    this.normalize = !this.normalize;
  }


  /**
   *  FFT Object
   */

  // create analyser node with optional variables for smoothing, fft size, min/max decibels
  FFT = function(smoothing, fft_size, minDecibels, maxDecibels) {
    var SMOOTHING = smoothing || .6;
    var FFT_SIZE = fft_size || 1024;
    this.p5s = window.p5sound;
    this.analyser = this.p5s.audiocontext.createAnalyser();

    // default connections to p5sound master
    this.p5s.output.connect(this.analyser);
    this.analyser.connect(this.p5s.audiocontext.destination);

    this.analyser.maxDecibels = maxDecibels || 0;
    this.analyser.minDecibels = minDecibels || -140;

    this.analyser.smoothingTimeConstant = SMOOTHING;
    this.analyser.fftSize = FFT_SIZE;

    this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount);

  }

  // create analyser node with optional variables for smoothing, fft size, min/max decibels
  FFT.prototype.input = function(source) {
    source.connect(this.analyser);
  }

  /**
   * Returns an array of amplitude values (between -140-0 by default) 
   * from the lowest to highest frequencies in the spectrum.
   * Length will be equal to 1/2 FFT size (default is 2048 / 1024).
   *
   * @method processFrequency
   * @return {Array}       Array of amplitude values for the frequency spectrum
   * @for FFT
   *
   */
  FFT.prototype.processFrequency = function() {
    this.analyser.getByteFrequencyData(this.freqDomain);
    return this.freqDomain;
  }


  /**
   * Returns an array of amplitude values (between 0-255) that can be used to 
   * draw or represent the waveform of a sound. Length will be
   * 1/2 size of FFT (default is 2048 / 1024).
   *
   * @method processWaveform
   * @return {Array}       Array of amplitude values (0-255) over time. Length will be 1/2 fftBands.
   * @for FFT
   *
   */
  FFT.prototype.processWaveform = function() {
    this.analyser.getByteTimeDomainData(this.timeDomain);
    return this.timeDomain;
  }

  // change smoothing
  FFT.prototype.setSmoothing = function(s) {
    this.analyser.smoothingTimeConstant = s;
  }

  FFT.prototype.getSmoothing = function() {
    return this.analyser.smoothingTimeConstant;
  }

  // get value of a specific frequency
  FFT.prototype.getFreqValue = function(frequency) {
    var nyquist = this.p5s.audiocontext.sampleRate/2;
    var index = Math.round(frequency/nyquist * this.freqDomain.length);
    return this.freqDomain[index];
  }

  // get value of a range of frequencies
  FFT.prototype.getFreqRange = function(lowFreq, highFreq) {
    var nyquist = this.p5s.audiocontext.sampleRate/2;
    var lowIndex = Math.round(lowFreq/nyquist * this.freqDomain.length);
    var highIndex = Math.round(highFreq/nyquist * this.freqDomain.length);

    var total = 0;
    var numFrequencies = 0;
    // add up all of the values for the frequencies
    for (var i = lowIndex; i<=highIndex; i++) {
      total += this.freqDomain[i];
      numFrequencies += 1;
    }
    // divide by total number of frequencies
    var toReturn = total/numFrequencies;
    return toReturn;
  }

  /**
   *  Oscillator Object, inspired by Tone.js
   */
  Oscillator = function(freq, type){
    this.started = false;
    this.p5s = window.p5sound;

    // components
    this.oscillator = this.p5s.audiocontext.createOscillator();
    this.oscillator.frequency.value = freq || 440;
    this.oscillator.type = type || 'sawtooth';

    // connections
    this.input = this.p5s.audiocontext.createGain();
    this.output = this.p5s.audiocontext.createGain();


    // set default output gain
    this.output.gain.value = .5;

    // sterep panning
    this.panPosition = 0.0;
    this.panner = audiocontext.createPanner();
    this.panner.panningModel = 'equalpower';
    this.panner.distanceModel = 'linear';
    this.panner.setPosition(0,0,0);

    // connect to p5sound by default
    this.oscillator.connect(this.panner);
    this.output.connect(this.panner);
    this.panner.connect(this.p5s.input);
  }

  Oscillator.prototype.start = function(time) {
    if (!this.started){
      var freq = this.oscillator.frequency.value;
      var type = this.oscillator.type;
      // var detune = this.oscillator.frequency.value;
      this.oscillator = this.p5s.audiocontext.createOscillator();
      this.oscillator.frequency.value = freq;
      this.oscillator.type = type;
      // this.oscillator.detune.value = detune;
      this.oscillator.connect(this.output);
      this.started = true;
      time = time || this.p5s.audiocontext.currentTime;
      this.oscillator.start(time);
    }
  }

  Oscillator.prototype.stop = function(time){
    if (this.started){
      t = time || this.p5s.audiocontext.currentTime;
      this.oscillator.stop(t);
      this.started = false;
    }
  }

  // set amp between 0 and 1.0
  Oscillator.prototype.setAmp = function(vol){
    this.output.gain.value = vol;
  }

  // get gain ("amplitude?")
  Oscillator.prototype.getAmp = function(){
    return this.output.gain.value;
  }


  Oscillator.prototype.setFreq = function(val, rampTime){
    rampTime = rampTime || 0;
    this.oscillator.frequency.linearRampToValueAtTime(val, rampTime);
  }

  Oscillator.prototype.getFreq = function(){
    return this.oscillator.frequency.value;
  }

  Oscillator.prototype.setType = function(type){
    this.oscillator.type = type;
  }

  Oscillator.prototype.getType = function(){
    return this.oscillator.type;
  }

  Oscillator.prototype.connect = function(unit){
    this.output.connect(unit);
  }

  Oscillator.prototype.disconnect = function(unit){
    this.output.disconnect(unit);
  }

  /**
   * Set the stereo panning of a sound file.
   *
   * @method pan
   * @param {Number} [pval]     Set the stereo panner to a floating point number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
   * @for Oscillator
   */
  Oscillator.prototype.pan = function(pval) {
    if (!pval) {
      pval = 0;
    }
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

  /**
   * Returns the current stereo panning value of a sound file.
   *
   * @method getPan
   * @return {Number}     Returns the stereo pan setting of the Oscillator as a number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
   * @for Oscillator
   */
  Oscillator.prototype.getPan = function() {
    return this.panPosition;
  }

// Extending
SinOsc = function(freq) {
  Oscillator.call(this, freq, 'sine');
}

SinOsc.prototype = Object.create(Oscillator.prototype);

TriOsc = function(freq) {
  Oscillator.call(this, freq, 'triangle');
}

TriOsc.prototype = Object.create(Oscillator.prototype);

SawOsc = function(freq) {
  Oscillator.call(this, freq, 'sawtooth');
}

SawOsc.prototype = Object.create(Oscillator.prototype);

SqrOsc = function(freq) {
  Oscillator.call(this, freq, 'square');
}

SqrOsc.prototype = Object.create(Oscillator.prototype);

/**
 * Take an upramping sawtooth and its inverse, a downramping sawtooth. Adding these two waves with a well defined delay between 0 and period (1/f)
 * results in a square wave with a duty cycle ranging from 0 to 100%.
 */
Pulse = function(freq, w) {
  Oscillator.call(this, freq, 'sawtooth');

  // width of PWM, should be betw 0 to 1.0
  this.w = w || 0;

  // create a second oscillator with inverse frequency
  this.osc2 = new SawOsc(-freq);

  // create a delay node
  this.dNode = this.p5s.audiocontext.createDelay();

  // set delay time based on PWM width
  this.dNode.delayTime.value = map(this.w, 0, 1.0, 0, 1/this.oscillator.frequency.value)

  // disconnect osc2 and connect it to delay, which is connected to output
  this.osc2.disconnect();
  this.osc2.connect(this.osc2.output);
  this.osc2.connect(this.dNode);
  this.dNode.connect(this.output);

}

Pulse.prototype = Object.create(Oscillator.prototype);

Pulse.prototype.setWidth = function(w) {
  if (w <= 1.0 && w >= 0.0) {
    this.w = w;
    // set delay time based on PWM width
    this.dNode.delayTime.value = map(this.w, 0, 1.0, 0, 1/this.oscillator.frequency.value)
  }
}

Pulse.prototype.start = function(time) {
  if (!this.started){
    var freq = this.oscillator.frequency.value;
    var type = this.oscillator.type;
    // var detune = this.oscillator.frequency.value;
    this.oscillator = this.p5s.audiocontext.createOscillator();
    this.oscillator.frequency.value = freq;
    this.oscillator.type = type;
    // this.oscillator.detune.value = detune;
    this.oscillator.connect(this.output);
    this.started = true;
    time = time || this.p5s.audiocontext.currentTime;
    this.oscillator.start(time);

    // set up osc2
    this.osc2.oscillator = this.p5s.audiocontext.createOscillator();
    this.osc2.oscillator.frequency.value = -freq;
    this.osc2.oscillator.type = type;
    this.osc2.start(time);
  }
}

Pulse.prototype.stop = function(time){
  if (this.started){
    t = time || this.p5s.audiocontext.currentTime;
    this.oscillator.stop(t);
    this.osc2.oscillator.stop(t);
    this.started = false;
  }
}

// set amp between 0 and 1.0
Pulse.prototype.setAmp = function(vol){
  this.output.gain.value = vol;
//  this.osc2.output.gain.value = vol;
}

Pulse.prototype.setFreq = function(val){
  //rampTime = rampTime || 0;
  this.oscillator.frequency.value = val;
  this.osc2.oscillator.frequency.value = -val;
}


})(); //call closure
