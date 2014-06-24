
/**
 * Version .0003
 *
 * p5.sound by Jason Sigal (jasonsigal.cc) for the
 * Processing Foundation & Google Summer of Code 2014.
 * 
 * This is an addon for p5.js that extends p5 with the following classes:
 *   SoundOut
 *   SoundFile
 *   Amplitude
 *   FFT
 *   Oscillator (SinOsc, SqrOsc, SawOsc, TriOsc, Pulse)
 *   AudioIn
 *    ... more soon!
 *  
 * Incorporates elements from:
 *   - TONE.js (c) Yotam Mann, 2014. Licensed under The MIT License (MIT). https://github.com/TONEnoTONE/Tone.js
 *   - buzz.js (c) Jay Salvat, 2013. Licensed under The MIT License (MIT). http://buzz.jaysalvat.com/
 *   - Boris Smus Web Audio API book, 2013. Licensed under the Apache License http://www.apache.org/licenses/LICENSE-2.0
 *   - wavesurfer.js
 *   - recorder.js (hopefully soon!)
 *   - Wilm Thoben's Sound library for Processing
 *
 */

/**
 * @module p5Sound
 */

'use strict';

var p5SOUND = (function(){

  /**
   * Web Audio SHIMS and helper functions to ensure compatability across browsers
   */

  // If window.AudioContext is unimplemented, it will alias to window.webkitAudioContext.
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // Create the Audio Context
  var audiocontext;
  audiocontext = new window.AudioContext();

  // Polyfills & SHIMS (inspired by tone.js and the AudioContext MonkeyPatch https://github.com/cwilso/AudioContext-MonkeyPatch/ (c) 2013 Chris Wilson, Licensed under the Apache License) //

  if (typeof audiocontext.createGain !== 'function'){
    window.audioContext.createGain = window.audioContext.createGainNode;
  }
  if (typeof audiocontext.createDelay !== 'function'){
    window.audioContext.createDelay = window.audioContext.createDelayNode;
  }
  if (typeof window.AudioBufferSourceNode.prototype.start !== 'function'){
    window.AudioBufferSourceNode.prototype.start = window.AudioBufferSourceNode.prototype.noteGrainOn;
  }
  if (typeof window.AudioBufferSourceNode.prototype.stop !== 'function'){
    window.AudioBufferSourceNode.prototype.stop = window.AudioBufferSourceNode.prototype.noteOff;
  }
  if (typeof window.OscillatorNode.prototype.start !== 'function'){
    window.OscillatorNode.prototype.start = window.OscillatorNode.prototype.noteOn;
  }
  if (typeof window.OscillatorNode.prototype.stop !== 'function'){
    window.OscillatorNode.prototype.stop = window.OscillatorNode.prototype.noteOff; 
  }
  if (!window.AudioContext.prototype.hasOwnProperty('createScriptProcessor')){
    window.AudioContext.prototype.createScriptProcessor = window.AudioContext.prototype.createJavaScriptNode;
  }

  // Polyfill for AudioIn, also handled by p5.dom createCapture
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


  /**
   * Determine which filetypes are supported (inspired by buzz.js)
   * The audio element (el) will only be used to test browser support for various audio formats
   */
  var el = document.createElement('audio');

  var isSupported = function() {
    return !!el.canPlayType;
  };
  var isOGGSupported = function() {
    return !!el.canPlayType && el.canPlayType('audio/ogg; codecs="vorbis"');
  };
  var isMP3Supported = function() {
    return !!el.canPlayType && el.canPlayType('audio/mpeg;');
  };
  var isWAVSupported = function() {
    return !!el.canPlayType && el.canPlayType('audio/wav; codecs="1"');
  };
  var isAACSupported = function() {
    return !!el.canPlayType && (el.canPlayType('audio/x-m4a;') || el.canPlayType('audio/aac;'));
  };
  var isAIFSupported = function() {
    return !!el.canPlayType && el.canPlayType('audio/x-aiff;');
  };
  var isFileSupported = function(extension) {
    switch(extension.toLowerCase())
    {
      case 'mp3':
        return isMP3Supported();
      case 'wav':
        return isWAVSupported();
      case 'ogg':
        return isOGGSupported();
      case 'aac', 'm4a', 'mp4':
        return isAACSupported();
      case 'aif', 'aiff':
        return isAIFSupported();
      default:
        return false;
    }
  };


  /**
   * Callbacks to be used for soundfile playback & loading
   */

  // If a SoundFile is played before the buffer has loaded,
  // it will load the file and pass this function as the callback.
  var play_now = function(sfile) {
    if (sfile.buffer) {
      sfile.source = sfile.p5s.audiocontext.createBufferSource();
      sfile.source.buffer = sfile.buffer;
      sfile.source.loop = sfile.looping;

      // firefox
      if (!sfile.source.gain) {
        sfile.source.gain = sfile.p5s.audiocontext.createGain();
        sfile.source.connect(sfile.source.gain);
        // connect to output
        sfile.source.gain.connect(sfile.output); 
      }
      else {
        //connect to output
        sfile.source.connect(sfile.output); 
      }

      // set variables like playback rate, gain and panning
      sfile.source.playbackRate.value = sfile.playbackRate;

      sfile.source.onended = function() {
        if (sfile.playing) {
          sfile.playing = !sfile.playing;
          sfile.stop();
         }
       };

      // play the sound
      sfile.source.start(0, sfile.startTime);
      sfile.startSeconds = sfile.p5s.audiocontext.currentTime;
      sfile.playing = true;
      sfile.paused = false;

      sfile.sources.push(sfile.source);
    }

    else {
      console.log(sfile.url + ' not loaded yet');
    }
  };

  // If getPeaks() is called on a SoundFile before the buffer loads
  // it will load the file and pass this function as the callback.
  var getPeaksNow = function(sfile) {
    if (sfile.buffer) {
      // set length to p5's width if no length is provided
      var length = window.width;
      if (this.buffer) {
        var buffer = this.buffer;
        var sampleSize = buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = buffer.numberOfChannels;
        var peaks = new Float32Array(length);

        for (var c = 0; c < channels; c++) {
          var chan = buffer.getChannelData(c);
          for (var i = 0; i < length; i++) {
            var start = ~~(i*sampleSize); 
            var end = ~~(start + sampleSize);
            var max = 0;
            for (var j = start; j < end; j+= sampleStep) {
              var value = chan[j];
              if (value > max) {
                max = value;
              // faster than Math.abs
              } else if (-value > max) {
                max = value;
              }
            }
            if (c === 0 || max > peaks[i]) {
              peaks[i] = max;
            }
          }
        }

        return peaks;
      }

    }

    else {
      console.log(sfile.url + ' not loaded yet');
    }
  };

  /**
   * Master contains AudioContext and the master sound output.
   */
  var Master = function() {
    this.input = audiocontext.createGain();
    this.output = audiocontext.createGain();

    //put a hard limiter on the output
    this.limiter = audiocontext.createDynamicsCompressor();
    this.limiter.threshold.value = 0;
    this.limiter.ratio.value = 100;

    this.audiocontext = audiocontext;

    this.output.disconnect(this.audiocontext.destination);

    // an array of input sources
    this.inputSources = [];

    // connect input to limiter
    this.input.connect(this.limiter);

    // connect limiter to output
    this.limiter.connect(this.output);

    // connect output to destination
    this.output.connect(this.audiocontext.destination);
  };

  // create a single instance of the p5Sound / master output
  var p5sound = new Master();

  p5.prototype.SoundOut = p5sound;

  /**
   * Returns a number representing the sample rate, in samples per second,
   * of all sound objects in this audio context. It is determined by the
   * sampling rate of your operating system's sound card, and it is not
   * currently possile to change.
   * It is often 44100, or twice the range of human hearing.
   *
   * @for    p5Sound
   * @method sampleRate
   * @return {Number} samplerate samples per second
   */
  p5.prototype.sampleRate = function(){
    return p5sound.audiocontext.sampleRate;
  };

  /**
   * <p>Set the master amplitude (volume) for sound in this sketch.</p>
   *
   * <p>Note that values greater than 1.0 may lead to digital distortion.</p>
   * 
   * <p><b>How This Works</b>: When you load the p5Sound module, it
   * creates a single instance of p5sound. All sound objects in this
   * module output to p5sound before reaching your computer's output.
   * So if you change the amplitude of p5sound, it impacts all of the
   * sound in this module.</p>
   *
   * @for    p5Sound
   * @method volume
   * @param {Number} volume   Master amplitude (volume) for sound in
   *                          this sketch. Should be between 0.0
   *                          (silence) and 1.0. Values greater than
   *                          1.0 may lead to digital distortion.
   */
  p5.prototype.volume = function(vol){
    p5sound.output.gain.value = vol;
  };

  p5.prototype.getVolume = function(){
    return p5sound.output.gain.value;
  };

  // returns an instance of the current audio context
  p5.prototype.getAudioContext = function(){
    return p5sound.audiocontext;
  }

// =============================================================================
//                                  SoundFile Class
// =============================================================================

  /**
   * Create a SoundFile object with a path to a file. 
   * 
   * Only one file path is required. However, audio file formats 
   * (i.e. mp3, ogg, wav and m4a/aac) are not supported by all
   * web browsers. If you include paths to multiple file formats, 
   * the browser will choose one that works. 
   *
   * The SoundFile may not be available immediately because
   * it loads the file information asynchronously. 
   *
   * To do something with the sound as soon as it loads
   * (but not before), please see the load()
   * function, which accepts a callback.
   *
   * @for p5Sound:SoundFile
   * @method SoundFile
   * @param {String} [path1]   path to a sound file 
   * @param {String} [path2]   (optional) path to additional format of the sound file to ensure compatability across browsers
   * @param {String} [path3]   (optional) path to additional format of the sound file to ensure compatability across browsers
   * @example 
   *   <div><code>
   *     function setup() {
   *       mySound = new SoundFile('mySound.wav', 'mySound.mp3', 'mySound.ogg');
   *     }
   *
   *     function keyPressed() {
   *       mySound.play();
   *     }
   *   </code></div>
   */
  p5.prototype.SoundFile = function(path1, path2, path3) {

    var path = path1;
    var extension, supported;

    // verify support for audio file(s)
    if (path1) {
      extension = path1.split('.').pop();
      supported = isFileSupported(extension);
      if (supported) {
        console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
        }
      else {
        console.log('.'+extension + ' is not a valid audio extension in this web browser');
        path = path2;
        path1 = false;
        }
    }
    if (path1 === false && path2) {
      extension = path2.split('.').pop();
      supported = isFileSupported(extension);
      if (supported) {
        console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
        }
      else {
        console.log('.'+extension + ' is not a valid audio extension in this web browser');
        path = path3;
        path2 = false;
        }
    }
    if (path2 === false && path3) {
      extension = path3.split('.').pop();
      supported = isFileSupported(extension);
      if (supported) {
        console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
        }
      else {
        console.log('.'+extension + ' is not a valid audio extension in this web browser');
        path = path2;
        }
    }

    // store a local reference to the window's p5sound context
    this.p5s = p5sound;

    // player variables
    this.url = path;

    // array of sources so that they can all be stopped!
    this.sources = [];

    // current source
    this.source = null;

    this.buffer = null;
    this.playbackRate = 1;
    this.gain = 1;

    this.input = this.p5s.audiocontext.createGain();
    this.output = this.p5s.audiocontext.createGain();

    this.reversed = false;

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

    // stereo panning
    this.panPosition = 0.0;
    this.panner = audiocontext.createPanner();
    this.panner.panningModel = 'equalpower';
    this.panner.distanceModel = 'linear';
    this.panner.setPosition(0,0,0);

    this.output.connect(this.panner);

    // by default, the panner is connected to the p5s destination
    this.panner.connect(this.p5s.input);

    // load the AudioBuffer asyncronously
    this.load();
  };

  /**
   * Load the SoundFile. Accepts a callback (the name of another function)
   * as an optional parameter. 
   *
   * When you create a new SoundFile, it calls load() on itself but
   * without a callback. Use this function if you need a callback,
   * which enables you to do something with the file as soon as it loads
   * (but not before). If the callback accepts parameters,
   * load() passes the SoundFile itself as the parameter.
   *
   * @for p5Sound:SoundFile
   * @method load
   * @param {Function} [callback]   Name of a function to call once file loads
   * @example 
   *   <div><code>
   *     function setup() {
   *       var mySound = new SoundFile('song.wav');
   *       mySound.load(doneLoading);
   *     }
   *
   *     function doneLoading(anySound) {
   *       anySound.play();
   *     }
   *   </code></div>
   */
  p5.prototype.SoundFile.prototype.load = function(callback){
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
      };
      request.send();
    }
    else {
      if (callback){
        callback(this);
      }
    }
  };

  /**
   * Play the SoundFile
   *
   * @for p5Sound:SoundFile
   * @method play
   * @param {Number} [rate]             (optional) playback rate
   * @param {Number} [amp]              (optional) amplitude (volume) of playback
   */
  p5.prototype.SoundFile.prototype.play = function(rate, amp) {
    // TO DO: if already playing, create array of buffers for easy stop()
    if (this.buffer) {

      // make a new source
      this.source = this.p5s.audiocontext.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = this.looping;
      this.source.onended = function() {
        if (this.playing) {
          this.playing = !this.playing;
          this.stop();
          console.log('stopped!');
         }
       };

      // firefox method of controlling gain without resetting volume
      if (!this.source.gain) {
        this.source.gain = this.p5s.audiocontext.createGain();
        this.source.connect(this.source.gain);
        // set local amp if provided, otherwise 1 and output.gain controls the gain
        this.source.gain.gain.value = amp || 1;
        this.source.gain.connect(this.output); 
      }
      // chrome method of controlling gain without resetting volume
      else {
        this.source.gain.value = amp || 1;
        this.source.connect(this.output); 
      }
      this.source.playbackRate.value = rate || Math.abs(this.playbackRate);


      // play the sound
      if (this.paused){
        this.source.start(0, this.pauseTime);

        // flag for whether to use pauseTime or startTime to get currentTime()
        this.unpaused = true;
      }
      else {
        this.unpaused = false;
        this.source.start(0, this.startTime);
      }
      this.startSeconds = this.p5s.audiocontext.currentTime;
      this.playing = true;
      this.paused = false;

      // add the source to sources array
      this.sources.push(this.source);
    }
    // If soundFile hasn't loaded the buffer yet, load it then play it in the callback
    else {
      console.log('not ready to play');
      this.load(play_now);
    }
  };

  /**
   *  Reverses the SoundFile's buffer source.
   *  Playback must be handled separately (see example).
   *
   *  @for  p5Sound:
   *  @example
   *  <div><code>
   *      s = new SoundFile('beat.mp3');
   *      s.reverseBuffer();
   *      s.play();
   *    </code>
   *    </div>
   */
  p5.prototype.SoundFile.prototype.reverseBuffer = function() {
    if (this.buffer) {
      Array.prototype.reverse.call( this.buffer.getChannelData(0) );
      Array.prototype.reverse.call( this.buffer.getChannelData(1) );
    // set reversed flag
    this.reversed = !this.reversed;
    // this.playbackRate = -this.playbackRate;
    } else {
      throw 'Error: cannot reverse soundfile until it is done loading';
    }
  };

  // private function for onended behavior
  p5.prototype.SoundFile.prototype._onEnded = function(s) {
    console.log(s);
    s.onended = function(s){
      console.log(s);
      s.stop();
    };
  };

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
   * @for p5Sound:SoundFile
   * @method loop
   * @param {Number} [rate]             (optional) playback rate
   * @param {Number} [amp]              (optional) amplitude (volume) of playback
   */
  p5.prototype.SoundFile.prototype.loop = function(rate, amp) {
    this.play(rate, amp);
    this.looping = true;
  };


  /**
   * Tell a SoundFile to stop looping. If the file is currently
   * playing, it will stop when it reaches the end of playback.
   * 
   * @for p5Sound:SoundFile
   * @method noLoop
   */
  p5.prototype.SoundFile.prototype.noLoop = function() {
    this.looping = false;
    if (this.source) {
      this.source.loop = this.looping;
    }
  };


  /**
   * Pauses a file that is currently playing,
   * unpauses (plays) a file that is currently paused. 
   *
   * The current time and loop state are preserved
   * so playback can resume from the same moment.
   *
   * @for p5Sound:SoundFile
   * @method pause
   */
  p5.prototype.SoundFile.prototype.pause = function() {
    var keepLoop = this.looping;
    if (this.isPlaying() && this.buffer && this.source) {
      this.pauseTime = this.currentTime();
      // this.startTime = this.currentTime();
      this.source.stop();
      this.paused = true;
      // TO DO: make sure play() still starts from orig start position
    }
    else {
        // preserve original start time
        var origStart = this.startTime;
        this.startTime = this.pauseTime;
        this.play();
        this.looping = keepLoop;
        this.startTime = origStart;
    }
  };

  /**
   * Returns 'true' if a SoundFile is looping, 'false' if not.
   *
   * @for p5Sound:SoundFile
   * @method isLooping
   * @return {Boolean}
   */
  p5.prototype.SoundFile.prototype.isLooping = function() {
    if (!this.source) {
      return false;
    }
    if (this.looping === true && this.isPlaying() === true) {
      return true;
    }
    return false;
  };

  /**
   * Returns 'true' if a SoundFile is playing, 'false' if not.
   *
   * @for p5Sound:SoundFile
   * @method isPlaying
   * @return {Boolean}
   */
  p5.prototype.SoundFile.prototype.isPlaying = function() {
    // Double check playback state
    if (this.source) {
      if (this.source.playbackState === 2) {
        this.playing = true;
      }
      if (this.source.playbackState === 3) {
        this.playing = false;
      }
    }
    return this.playing;
  };

  /**
   * Returns true if a SoundFile is paused, 'false' if not.
   *
   * @for p5Sound:SoundFile
   * @method isPaused
   * @return {Boolean}
   */
  p5.prototype.SoundFile.prototype.isPaused = function() {
    if (!this.paused) {
      return false;
    }
    return this.paused;
  };

  /**
   * Stop soundfile playback.
   *
   * @for p5Sound:SoundFile
   * @method stop
   */
  p5.prototype.SoundFile.prototype.stop = function() {
    if (this.buffer && this.source) {
      this.source.stop();
      this.pauseTime = 0;
      this.playing = false;
    }
  };

  /**
   * Stop playback on all of this soundfile's sources
   *
   * @for p5Sound:SoundFile
   * @method stopAll
   */
  p5.prototype.SoundFile.prototype.stopAll = function() {
    if (this.buffer && this.source) {
      for (var i = 0; i < this.sources.length; i++){
        this.sources[i].stop();
      }
    this.playing = false;
    }
  };

  /**
   * Set the playback rate of a sound file. Will change the speed and the pitch.
   * Must be greater than zero. To play in reverse, see the reverse() method.
   *
   * @for p5Sound:SoundFile
   * @method rate
   * @param {Number} [playbackRate]     Set the playback rate. 1.0 is normal,
   *                                    .5 is half-speed, 2.0 is twice as fast.
   *                                    Must be greater than zero.
   */
  p5.prototype.SoundFile.prototype.rate = function(playbackRate) {
    if (this.playbackRate === playbackRate) {
      return;
    }
    this.playbackRate = playbackRate;
    if (playbackRate === 0 && this.playing) {
      this.pause();
    }
    if (playbackRate < 0 && !this.reversed) {
      this.reverseBuffer();
    }
    else if (playbackRate > 0 && this.reversed) {
      this.reverseBuffer();
    }
    if (this.isPlaying() === true) {
      this.pause();
      this.play();
    }

  };

p5.prototype.SoundFile.prototype.getRate = function() {
    return this.playbackRate;
  };

  /**
    * Return the sample rate of the sound file.
    *
    * @for p5Sound:SoundFile
    * @method sampleRate
    * @return {Number} [sampleRate]
    */
  p5.prototype.SoundFile.prototype.sampleRate = function() {
    return this.buffer.sampleRate;
  };

  /**
    * Return the number of samples in a sound file.
    * Equal to sampleRate * duration.
    *
    * @for p5Sound:SoundFile
    * @method frames
    * @return {Number} [sampleCount]
    */
  p5.prototype.SoundFile.prototype.frames = function() {
    return this.buffer.length;
  };


  /**
    * Return the number of channels in a sound file.
    * For example, Mono = 1, Stereo = 2.
    *
    * @for p5Sound:SoundFile
    * @method channels
    * @return {Number} [channels]
    */
  p5.prototype.SoundFile.prototype.channels = function() {
    return this.buffer.numberOfChannels;
  };


  /**
   * Set the output amplitude of a sound file
   * between 0.0 (silence) and 1.0 (full volume).
   * Amplitudes over 1.0 may cause digital distortion.
   *
   * @for p5Sound:SoundFile
   * @method amp
   * @param {Number} [vol]     Set the amplitude.
   */
  p5.prototype.SoundFile.prototype.amp = function(vol){
    this.output.gain.value = vol;
  };

  /**
   * Returns the output gain of a sound file.
   *
   * @for p5Sound:SoundFile
   * @method getAmp
   * @returns {Number}
   */
  p5.prototype.SoundFile.prototype.getAmp = function(){
    return this.output.gain.value;
  };


  /**
   * Set the stereo panning of a sound file to
   * a floating point number between -1.0 (left) and 1.0 (right).
   * Default is 0.0 (center).
   *
   * @for p5Sound:SoundFile
   * @method pan
   * @param {Number} [panValue]     Set the stereo panner
   */
  p5.prototype.SoundFile.prototype.pan = function(pval) {
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
  };

  /**
   * Returns the current stereo pan position as
   * a floating point number between -1.0 (left) and 1.0 (right).
   * 0.0 is center and default.
   *
   * @for p5Sound:SoundFile
   * @method getPan
   * @return {Number}
   */
  p5.prototype.SoundFile.prototype.getPan = function() {
    return this.panPosition;
  };

  /**
   * Connects the output of this soundfile to another p5Sound object.
   * By default, all objects are connected to the p5sound (master).
   * If no object is provided as a parameter, SoundFile will connect to
   * the p5sound's master output.
   *
   * @for p5Sound:SoundFile
   * @method connect
   * @param {p5SoundObject}
   */
  p5.prototype.SoundFile.prototype.connect = function(unit) {
    // connect to p5Sound (master) by default
    if (!unit) {
       this.panner.connect(this.p5s.input);
    }
    else if (this.buffer && this.source) {
      this.panner.connect(unit);
    }
  };

  /**
   * Disconnects the output of this soundfile.
   *
   * @for p5Sound:SoundFile
   * @method disconnect
   * @param {p5SoundObject}
   */
  p5.prototype.SoundFile.prototype.disconnect = function(unit){
    this.output.disconnect(unit);
  };

  /**
   * Returns the duration of a sound file.
   *
   * @for p5Sound:SoundFile
   * @method duration
   * @return {Number}     The duration of the soundFile in seconds.
   */
  p5.prototype.SoundFile.prototype.duration = function() {
    // Return Duration
    if (this.buffer) {
      return this.buffer.duration;
    } else {
      return 0;
    }
  };

  /**
   * Return the current position of the playhead in the song, in seconds
   *
   * @for p5Sound:SoundFile
   * @method currentTime
   * @return {Number} [currentTime]  currentTime of the soundFile in seconds.
   */
  p5.prototype.SoundFile.prototype.currentTime = function() {
    // TO DO --> make reverse() flip these values appropriately ?
    var howLong;
    if (this.isPlaying() && !this.unpaused) {
        howLong = ( (this.p5s.audiocontext.currentTime - this.startSeconds + this.startTime) * this.source.playbackRate.value ) % this.duration();
        return howLong;
    }
    else if (this.isPlaying() && this.unpaused) {
        howLong = ( this.pauseTime + (this.p5s.audiocontext.currentTime - this.startSeconds) * this.source.playbackRate.value ) % this.duration();
        return howLong;
    }
    else if (this.paused) {
      return this.pauseTime;
    }
    else {
      return this.startTime;
    }
  };

  /**
   * Move the playhead of the song to a position, in seconds 
   *
   * @for p5Sound:SoundFile
   * @method jump
   * @param {Number} [cueTime]    cueTime of the soundFile in seconds.
   */
  p5.prototype.SoundFile.prototype.jump = function(cueTime) {
    if ( (cueTime > 0) && (cueTime <= this.buffer.duration) ) {
      this.startTime = cueTime;
    }
    else if (!cueTime || cueTime === 0) {
      this.startTime = 0;
    }
    else {
      console.log('cue time out of range!');
    }
  };


  /**
   * Returns an array of amplitude peaks in a SoundFile that can be
   * used to draw a static waveform. This function scans through
   * the SoundFile's audio buffer to find the greatest amplitudes.
   * Accepts a variable 'length' which determines size of the array.
   * Larger arrays result in more precise waveform visualizations.
   * 
   * Inspired by Wavesurfer.js.
   * 
   * @params {Number} [length length is the size of the returned array.
   *                          Larger length results in more precision.
   *                          Defaults to canvas size.
   * @returns {Float32Array} Array of peaks.
   */
  p5.prototype.SoundFile.prototype.getPeaks = function(length) {
    if (this.buffer) {
      // set length to window's width if no length is provided
      if (!length) {
        length = window.width*5;
      }
      if (this.buffer) {
        var buffer = this.buffer;
        var sampleSize = buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = buffer.numberOfChannels;
        var peaks = new Float32Array(length);

        for (var c = 0; c < channels; c++) {
          var chan = buffer.getChannelData(c);
          for (var i = 0; i < length; i++) {
            var start = ~~(i*sampleSize); // ~~ removes anything to the right of decimal, faster substitute for Math.floor().
            var end = ~~(start + sampleSize);
            var max = 0;
            for (var j = start; j < end; j+= sampleStep) {
              var value = chan[j];
              if (value > max) {
                max = value;
              // faster than Math.abs
              } else if (-value > max) {
                max = value;
              }
            }
            if (c === 0 || max > peaks[i]) {
              peaks[i] = max;
            }
          }
        }

        return peaks;
      }
    }
    else {
      // this is called before file loads, load it with a callback
      this.load(getPeaksNow);
    }
  };


  p5.prototype.SoundFile.prototype.isLoaded = function() {
    if (this.buffer) {
      return true;
    } else {
      return false;
    }
  };

  p5.prototype.SoundFile.prototype.fade = function() {
    // TO DO
  };

  p5.prototype.SoundFile.prototype.add = function() {
    // TO DO
  };


  /**
   * Create an Amplitude object, which measures amplitude (volume)
   * between 0.0 and 1.0. Accepts an optional smoothing value,
   * which defaults to 0. Reads global p5sound output by default,
   * or use setInput() to listen to a specific sound source.
   *
   * @for p5Sound:Amplitude
   * @method Amplitude
   * @param {Number} [smoothing] between 0.0 and .999 to smooth
   *                             amplitude readings (defaults to 0)
   * @example
   *    <div><code>
   *      function setup() { 
   *         mic = new AudioIn();
   *         mic.on();
   *         amplitude = new Amplitude();
   *         amplitude.setInput(mic);
   *      }
   *      function draw() {
   *         micLevel = amplitude.analyze();
   *         ellipse(width/2, height - micLevel*height, 10, 10);
   *      }
   *   </code></div>
   */
  p5.prototype.Amplitude = function(smoothing) {

    // store a local reference to the window's p5sound context
    this.p5s = p5sound;

    // Set to 2048 for now. In future iterations, this should be inherited or parsed from p5sound's default
    this.bufferSize = 2048;

    // set audio context
    this.audiocontext = this.p5s.audiocontext;
    this.processor = this.audiocontext.createScriptProcessor(this.bufferSize);

    // for connections
    this.input = this.processor;

    // smoothing defaults to 0
    this.smoothing = smoothing || 0;

    // this may only be necessary because of a Chrome bug
    this.processor.connect(this.audiocontext.destination);

    // the variables to return
    this.volume = 0;
    this.average = 0;
    this.volMax = 0.001;
    this.normalize = false;

    this.processor.onaudioprocess = this.volumeAudioProcess.bind(this);

    // connect to p5sound master output by default, unless set by input()
    this.p5s.output.connect(this.processor);

  };



  /**
   * Connects to the p5sound instance (master output) by default.
   * Optionally, you can pass in a specific source (i.e. a soundfile).
   *
   * @for p5Sound:Amplitude
   * @method setInput
   * @param {soundObject|undefined} [snd]       set the sound source (optional, defaults to master output)
   * @param {Number|undefined} [smoothing]      a range between 0.0 and .999 to smooth amplitude readings
   * @example
   *  <div><code>
   *   function setup() {
   *     mic = new AudioIn().on();
   *     amplitude = new Amplitude();
   *
   *     // don't send mic to master output
   *     mic.disconnect();
   *
   *     // only send to the Amplitude reader, so we can see it but not hear it.
   *     amplitude.setInput(mic);
   *   }
   *   </code></div>
   */

   // TO DO figure out how to connect to a buffer before it is loaded
  p5.prototype.Amplitude.prototype.setInput = function(snd, smoothing) {

    // set smoothing if smoothing is provided
    if (smoothing) {
      this.smoothing = smoothing;
    }

    // connect to the master out of p5s instance if no snd is provided
    if (snd == null) {
      console.log('Amplitude input source is not ready! Connecting to master output instead');
      this.p5s.output.connect(this.processor);
    }

    // If it's a sound file, and buffer.source hassn't finished loading, ideally, input should wait for the buffer to load and then connect.
    // But for now, it just connects to master.
    else if (typeof(snd.load) === 'function' && snd.source == null) {
      console.log('source is not ready to connect. Connecting to master output instead');
      // Not working: snd.load(this.input); // TO DO: figure out how to make it work!
      this.p5s.output.connect(this.processor);
    }

    /** TO DO: figure out how to make soundfile load its buffer with 'connect' as callback
    // else if (typeof(snd.load) == 'function' && snd.source == null) {
    //   console.log('source is not ready to connect. Connecting to master output instead');
    //   // Not working: snd.load(this.input); 
    //   this.p5s.output.connect(this.processor);
    // }
    */

    // connect to the sound if it is available
    else if (typeof(snd.load) === 'function' && typeof(snd.connect)) {
      snd.connect(this.processor);
      console.log('connecting Amplitude to ' + snd.url);
    }

    else if (typeof(snd.on === 'function')) {
      snd.connect(this.processor);
    }

    // otherwise, connect to the master out of p5s instance (default)
    else {
      this.p5s.output.connect(this.processor);
    }
  };

  p5.prototype.Amplitude.prototype.connect = function(unit) {
    if (unit) {
      this.processor.connect(unit);
    } else {
      this.processor.connect(this.panner.connect(this.p5s.input));
    }
  };

  // Should this be a private function?
  // TO DO make this stereo / dependent on # of audio channels
  p5.prototype.Amplitude.prototype.volumeAudioProcess = function(event) {
    // return result
    var inputBuffer = event.inputBuffer.getChannelData(0);
    var bufLength = inputBuffer.length;
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
    this.volMax=Math.max(this.volume, this.volMax);

    // normalized values
    this.volNorm = constrain(this.volume/this.volMax, 0, 1);
  };

  /**
   * Returns a single Amplitude reading at the moment it is called.
   * For continuous readings, run in the draw loop.
   *
   * @for p5Sound:Amplitude
   * @method process
   * @return {Number}       Amplitude as a number between 0.0 and 1.0
   * @example
   *   <div><code>
   *      function setup() { 
   *         amplitude = new Amplitude();
   *      }
   *      function draw() {
   *         volume = amplitude.analyze();
   *      }
   *   </code></div>
   */
  p5.prototype.Amplitude.prototype.analyze = function() {
    if (this.normalize) {
      return this.volNorm;
    }
    else {
      return this.volume;
    }
  };

  /**
   * Determines whether the results of Amplitude.process() will be Normalized.
   * To normalize, Amplitude finds the difference the loudest reading it has processed
   * and the maximum amplitude of 1.0. Amplitude adds this difference to all values to produce
   * results that will reliably map between 0.0 and 1.0. 
   * However, if a louder moment occurs, the amount that Normalize adds to all the values will change.
   *
   * Accepts an optional boolean parameter (true or false).
   * Normalizing is off by default.
   *
   * @for p5Sound:Amplitude
   * @method toggleNormalize
   * @param {boolean} [boolean] set normalize to true (1) or false (0)
   */
  p5.prototype.Amplitude.prototype.toggleNormalize = function(bool) {
    if (typeof(bool) === 'boolean'){
      this.normalize = bool;
    }
    else {
      this.normalize = !this.normalize;
    }
  };

  /**
   * Determines whether the results of Amplitude.process() will be Smoothed.
   *
   * @for p5Sound:Amplitude
   * @method smooth
   * @param {Number} set smoothing from 0.0 <= 1
   */
  p5.prototype.Amplitude.prototype.smooth = function(s) {
    if (s >= 0 && s < 1) {
      this.smoothing = s;
    } else {
      console.log('Error: smoothing must be between 0 and 1');
    }
  };

  /**
   *  FFT Object
   */

  // create analyser node with optional variables for smoothing, fft size, min/max decibels
  p5.prototype.FFT = function(smoothing, fft_size, minDecibels, maxDecibels) {
    var SMOOTHING = smoothing || 0.6;
    var FFT_SIZE = fft_size || 1024;
    this.p5s = p5sound;
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

  };

  // change input from default (p5)
  p5.prototype.FFT.prototype.setInput = function(source) {
    source.connect(this.analyser);
  };

  /**
   * This method tells the FFT to processes the frequency spectrum.
   * Must be called prior to getting any frequency values.
   * 
   * Returns an array of amplitude values (between -140-0 by default) 
   * from the lowest to highest frequencies in the spectrum.
   * Length will be equal to 1/2 FFT size (default is 2048 / 1024).
   *
   *
   * @method processFreq
   * @return {Uint8Array}       Array of amplitude values for the frequency spectrum
   * @for FFT
   *
   */
  p5.prototype.FFT.prototype.processFreq = function() {
    this.analyser.getByteFrequencyData(this.freqDomain);
    return this.freqDomain;
  };


  /**
   * Returns an array of amplitude values (between 0-255) that can be used to 
   * draw or represent the waveform of a sound. Length will be
   * 1/2 size of FFT (default is 2048 / 1024).
   *
   * @method waveform
   * @return {Uint8Array}      Array of amplitude values (0-255) over time. Length will be 1/2 fftBands.
   * @for FFT
   *
   */
  p5.prototype.FFT.prototype.waveform = function() {
    this.analyser.getByteTimeDomainData(this.timeDomain);
    return this.timeDomain;
  };

  // change smoothing
  p5.prototype.FFT.prototype.setSmoothing = function(s) {
    this.analyser.smoothingTimeConstant = s;
  };

  p5.prototype.FFT.prototype.getSmoothing = function() {
    return this.analyser.smoothingTimeConstant;
  };

  // get value of a specific frequency
  p5.prototype.FFT.prototype.getFreqValue = function(frequency) {
    var nyquist = this.p5s.audiocontext.sampleRate/2;
    var index = Math.round(frequency/nyquist * this.freqDomain.length);
    return this.freqDomain[index];
  };

  // get value of a range of frequencies
  p5.prototype.FFT.prototype.getFreqRange = function(lowFreq, highFreq) {
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
  };

  /**
   *  Oscillator Object, inspired by Tone.js
   */
  p5.prototype.Oscillator = function(freq, type){
    this.started = false;
    this.p5s = p5sound;

    // components
    this.oscillator = this.p5s.audiocontext.createOscillator();
    this.oscillator.frequency.value = freq || 440;
    this.oscillator.type = type || 'sawtooth';

    // connections
    this.input = this.p5s.audiocontext.createGain();
    this.output = this.p5s.audiocontext.createGain();


    // set default output gain
    this.output.gain.value = 0.5;

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
  };

  p5.prototype.Oscillator.prototype.start = function(time) {
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
  };

  p5.prototype.Oscillator.prototype.stop = function(time){
    if (this.started){
      var t = time || this.p5s.audiocontext.currentTime;
      this.oscillator.stop(t);
      this.started = false;
    }
  };

  // set amp between 0 and 1.0
  p5.prototype.Oscillator.prototype.setAmp = function(vol){
    this.output.gain.value = vol;
  };

  // get gain ("amplitude?")
  p5.prototype.Oscillator.prototype.getAmp = function(){
    return this.output.gain.value;
  };


  p5.prototype.Oscillator.prototype.setFreq = function(val, rampTime){
    rampTime = rampTime || 0;
    this.oscillator.frequency.linearRampToValueAtTime(val, rampTime);
  };

  p5.prototype.Oscillator.prototype.getFreq = function(){
    return this.oscillator.frequency.value;
  };

  p5.prototype.Oscillator.prototype.setType = function(type){
    this.oscillator.type = type;
  };

  p5.prototype.Oscillator.prototype.getType = function(){
    return this.oscillator.type;
  };

  p5.prototype.Oscillator.prototype.connect = function(unit){
    this.output.connect(unit);
  };

  p5.prototype.Oscillator.prototype.disconnect = function(unit){
    this.output.disconnect(unit);
  };

  /**
   * Set the stereo panning of a sound file.
   *
   * @method pan
   * @param {Number} [pval]     Set the stereo panner to a floating point number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
   * @for Oscillator
   */
  p5.prototype.Oscillator.prototype.pan = function(pval) {
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
  };

  /**
   * Returns the current stereo panning value of a sound file.
   *
   * @method getPan
   * @return {Number}     Returns the stereo pan setting of the Oscillator as a number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
   * @for Oscillator
   */
  p5.prototype.Oscillator.prototype.getPan = function() {
    return this.panPosition;
  };

  // Extending
  p5.prototype.SinOsc = function(freq) {
    p5.prototype.Oscillator.call(this, freq, 'sine');
  };

  p5.prototype.SinOsc.prototype = Object.create(p5.prototype.Oscillator.prototype);

  p5.prototype.TriOsc = function(freq) {
    p5.prototype.Oscillator.call(this, freq, 'triangle');
  };

  p5.prototype.TriOsc.prototype = Object.create(p5.prototype.Oscillator.prototype);

  p5.prototype.SawOsc = function(freq) {
    p5.prototype.Oscillator.call(this, freq, 'sawtooth');
  };

  p5.prototype.SawOsc.prototype = Object.create(p5.prototype.Oscillator.prototype);

  p5.prototype.SqrOsc = function(freq) {
    p5.prototype.Oscillator.call(this, freq, 'square');
  };

  p5.prototype.SqrOsc.prototype = Object.create(p5.prototype.Oscillator.prototype);


  /**
   * Inspired by http://www.musicdsp.org/showone.php?id=8
   */
  p5.prototype.Pulse = function(freq, w) {
    p5.prototype.Oscillator.call(this, freq, 'sawtooth');

    // width of PWM, should be betw 0 to 1.0
    this.w = w || 0;

    // create a second oscillator with inverse frequency
    this.osc2 = new SawOsc(-freq);

    // create a delay node
    this.dNode = this.p5s.audiocontext.createDelay();

    // set delay time based on PWM width
    this.dNode.delayTime.value = map(this.w, 0, 1.0, 0, 1/this.oscillator.frequency.value);
    // disconnect osc2 and connect it to delay, which is connected to output
    this.osc2.disconnect();
    this.osc2.connect(this.osc2.output);
    this.osc2.connect(this.dNode);
    this.dNode.connect(this.output);

  };

  p5.prototype.Pulse.prototype = Object.create(p5.prototype.Oscillator.prototype);

  p5.prototype.Pulse.prototype.setWidth = function(w) {
    if (w <= 1.0 && w >= 0.0) {
      this.w = w;
      // set delay time based on PWM width
      this.dNode.delayTime.value = map(this.w, 0, 1.0, 0, 1/this.oscillator.frequency.value);
    }
  };

  p5.prototype.Pulse.prototype.start = function(time) {
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
  };

  p5.prototype.Pulse.prototype.stop = function(time){
    if (this.started){
      var t = time || this.p5s.audiocontext.currentTime;
      this.oscillator.stop(t);
      this.osc2.stop(t);
      this.started = false;
    }
  };

  // set amp between 0 and 1.0
  p5.prototype.Pulse.prototype.amp = function(vol){
    this.output.gain.value = vol;
  //  this.osc2.output.gain.value = vol;
  };

  p5.prototype.Pulse.prototype.setFreq = function(val){
    //rampTime = rampTime || 0;
    this.oscillator.frequency.value = val;
    this.osc2.oscillator.frequency.value = -val;
  };


  /**
   * Similar to p5.dom createCapture() but for audio, without
   * creating a DOM element.
   *
   * @for    p5Sound:AudioIn
   * @method AudioIn
   * @return {Object} capture
   * @example
   *  <div>
   *    <code>
   *      mic = new AudioIn()
   *      mic.on();
   *    </code>
   *   </div>
   */
  p5.prototype.AudioIn = function() {
    // set up audio input
    this.p5s = p5sound;
    this.input = this.p5s.audiocontext.createGain();
    this.output = this.p5s.audiocontext.createGain();

    this.stream = null;
    this.mediaStream = null;

    this.currentSource = 0;

    // create an amplitude, connect to it by default but not to master out
    this.amplitude = new Amplitude();
    this.output.connect(this.amplitude.input);

    // Some browsers let developer determine their input sources
    if (typeof window.MediaStreamTrack === 'undefined'){
      window.alert('This browser does not support MediaStreamTrack');
    } else if (typeof window.MediaStreamTrack.getSources !== 'undefined') {
      // Chrome supports getSources to list inputs. Dev picks default
      window.MediaStreamTrack.getSources(this._gotSources);
    } else {
      // Firefox lets user choose their input
      console.log('firefox');
    }
  };


  // connect to unit if given, otherwise connect to p5sound (master)
  p5.prototype.AudioIn.prototype.connect = function(unit) {
    if (unit) {
      if (!unit.input) {
        this.output.connect(unit);
      }
      else {
        this.output.connect(unit.input);
      }
    } else {
      console.log('no unit');
      this.output.connect(this.p5s.input);
    }
  }



  /**
   *  Returns a list of available input sources.
   *
   *  @for  p5Sound:AudioIn
   *  @method  listSources
   *  @return {Array}
   */
  p5.prototype.AudioIn.prototype.listSources = function() {
    console.log(p5sound.inputSources);
    if (p5sound.inputSources.length > 0) {
      return p5sound.inputSources;
    } else {
      return "This browser does not support MediaStreamTrack.getSources()";
    }
  }

  /**
   *  Set the input source. Accepts a number representing a
   *  position in the array returned by listSources().
   *  This is only supported in browsers that support 
   *  MediaStreamTrack.getSources(). Instead, some browsers
   *  give users the option to set their own media source.
   *  
   *  @for  p5Sound:AudioIn
   *  @method setSource
   *  @param {number} num position of input source in the array
   */
  p5.prototype.AudioIn.prototype.setSource = function(num) {
    // TO DO - set input by string or # (array position)
    var self = this;
    if ((p5sound.inputSources.length > 0) && (num < p5sound.inputSources.length)) {
      // set the current source
      self.currentSource = num;
      console.log('set source to ' + p5sound.inputSources[self.currentSource].id);
    } else {
      console.log('unable to set input source')
    }
  }

  p5.prototype.AudioIn.prototype.disconnect = function(unit) {
      this.output.disconnect(unit);
      // stay connected to amplitude even if not outputting to p5
      this.output.connect(this.amplitude.input);
  }

  /**
   *  Get the Amplitude of an AudioIn (microphone). This is an instance of
   *  the p5sound Amplitude object that exists within the AudioIn class.
   *
   *  Accepts an optional smoothing value (0.0 < 1.0)
   *  
   *  @param  {[Number]} smoothing Smoothing is 0.0 by default. Smooths values based on previous values.
   *  @return {Number}           Volume level (between 0.0 and 1.0)
   */
  p5.prototype.AudioIn.prototype.getLevel = function(smoothing) {
    if (smoothing) {
      this.amplitude.smoothing = smoothing;
    }
    return this.amplitude.analyze();
  }


  p5.prototype.AudioIn.prototype.on = function() {
    var self = this;
    console.log(self);

    // if _gotSources() i.e. developers determine which source to use
    if (p5sound.inputSources[self.currentSource]) {
      // set the audio source
      var audioSource = p5sound.inputSources[self.currentSource].id;
      console.log(audioSource);
      var constraints = {
          audio: {
            optional: [{sourceId: audioSource}]
          }};
      navigator.getUserMedia( constraints,
        this._onStream = function(stream) {
        self.stream = stream;
        // Wrap a MediaStreamSourceNode around the live input
        self.mediaStream = self.p5s.audiocontext.createMediaStreamSource(stream);
        self.mediaStream.connect(self.output);

        // only send to the Amplitude reader, so we can see it but not hear it.
        self.amplitude.setInput(mic);
      }, this._onStreamError = function(stream) {
        console.error(e);
      });
    } else {
    // if Firefox where users select their source via browser
    // if (typeof MediaStreamTrack.getSources === 'undefined') {
      // Only get the audio stream.
      navigator.getUserMedia( {"audio":true},
        this._onStream = function(stream) {
        self.stream = stream;
        // Wrap a MediaStreamSourceNode around the live input
        self.mediaStream = self.p5s.audiocontext.createMediaStreamSource(stream);
        self.mediaStream.connect(self.output);
        // only send to the Amplitude reader, so we can see it but not hear it.
        self.amplitude.setInput(mic);
      }, this._onStreamError = function(stream) {
        console.error(e);
      });
    }


  }

  p5.prototype.AudioIn.prototype.off = function() {
    if (this.stream) {
      this.stream.stop();
    }
  }


  /**
   *  Add input sources to the list of available sources.
   *  
   *  @private
   */
  p5.prototype.AudioIn.prototype._gotSources = function(sourceInfos) {
    for (var i = 0; i!= sourceInfos.length; i++) {
      var sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'audio') {
        // add the inputs to inputSources
        p5sound.inputSources.push(sourceInfo);
      }
    }
  }

 p5.prototype.AudioIn.prototype.amp = function(vol){
    this.output.gain.value = vol;
  }


})(); //call closure
