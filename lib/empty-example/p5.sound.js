/*! p5.sound.js v0.3.11 2019-03-14 */
/**
 *  p5.sound extends p5 with <a href="http://caniuse.com/audio-api"
 *  target="_blank">Web Audio</a> functionality including audio input,
 *  playback, analysis and synthesis.
 *  <br/><br/>
 *  <a href="#/p5.SoundFile"><b>p5.SoundFile</b></a>: Load and play sound files.<br/>
 *  <a href="#/p5.Amplitude"><b>p5.Amplitude</b></a>: Get the current volume of a sound.<br/>
 *  <a href="#/p5.AudioIn"><b>p5.AudioIn</b></a>: Get sound from an input source, typically
 *    a computer microphone.<br/>
 *  <a href="#/p5.FFT"><b>p5.FFT</b></a>: Analyze the frequency of sound. Returns
 *    results from the frequency spectrum or time domain (waveform).<br/>
 *  <a href="#/p5.Oscillator"><b>p5.Oscillator</b></a>: Generate Sine,
 *    Triangle, Square and Sawtooth waveforms. Base class of
 *    <a href="#/p5.Noise">p5.Noise</a> and <a href="#/p5.Pulse">p5.Pulse</a>.
 *    <br/>
 *  <a href="#/p5.Envelope"><b>p5.Envelope</b></a>: An Envelope is a series
 *    of fades over time. Often used to control an object's
 *    output gain level as an "ADSR Envelope" (Attack, Decay,
 *    Sustain, Release). Can also modulate other parameters.<br/>
 *  <a href="#/p5.Delay"><b>p5.Delay</b></a>: A delay effect with
 *    parameters for feedback, delayTime, and lowpass filter.<br/>
 *  <a href="#/p5.Filter"><b>p5.Filter</b></a>: Filter the frequency range of a
 *    sound.
 *  <br/>
 *  <a href="#/p5.Reverb"><b>p5.Reverb</b></a>: Add reverb to a sound by specifying
 *    duration and decay. <br/>
 *  <b><a href="#/p5.Convolver">p5.Convolver</a>:</b> Extends
 *  <a href="#/p5.Reverb">p5.Reverb</a> to simulate the sound of real
 *    physical spaces through convolution.<br/>
 *  <b><a href="#/p5.SoundRecorder">p5.SoundRecorder</a></b>: Record sound for playback
 *    / save the .wav file.
 *  <b><a href="#/p5.Phrase">p5.Phrase</a></b>, <b><a href="#/p5.Part">p5.Part</a></b> and
 *  <b><a href="#/p5.Score">p5.Score</a></b>: Compose musical sequences.
 *  <br/><br/>
 *  p5.sound is on <a href="https://github.com/therewasaguy/p5.sound/">GitHub</a>.
 *  Download the latest version
 *  <a href="https://github.com/therewasaguy/p5.sound/blob/master/lib/p5.sound.js">here</a>.
 *
 *  @module p5.sound
 *  @submodule p5.sound
 *  @for p5.sound
 *  @main
 */

/**
 *  p5.sound 
 *  https://p5js.org/reference/#/libraries/p5.sound
 *
 *  From the Processing Foundation and contributors
 *  https://github.com/processing/p5.js-sound/graphs/contributors
 *
 *  MIT License (MIT)
 *  https://github.com/processing/p5.js-sound/blob/master/LICENSE
 *
 *  Some of the many audio libraries & resources that inspire p5.sound:
 *   - TONE.js (c) Yotam Mann. Licensed under The MIT License (MIT). https://github.com/TONEnoTONE/Tone.js
 *   - buzz.js (c) Jay Salvat. Licensed under The MIT License (MIT). http://buzz.jaysalvat.com/
 *   - Boris Smus Web Audio API book, 2013. Licensed under the Apache License http://www.apache.org/licenses/LICENSE-2.0
 *   - wavesurfer.js https://github.com/katspaugh/wavesurfer.js
 *   - Web Audio Components by Jordan Santell https://github.com/web-audio-components
 *   - Wilm Thoben's Sound library for Processing https://github.com/processing/processing/tree/master/java/libraries/sound
 *
 *   Web Audio API: http://w3.org/TR/webaudio/
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.sound', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {
  
var shims;
'use strict';  /**
                * This module has shims
                */
shims = function () {
  /* AudioContext Monkeypatch
     Copyright 2013 Chris Wilson
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
         http://www.apache.org/licenses/LICENSE-2.0
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  */
  (function () {
    function fixSetTarget(param) {
      if (!param)
        // if NYI, just return
        return;
      if (!param.setTargetAtTime)
        param.setTargetAtTime = param.setTargetValueAtTime;
    }
    if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
      window.AudioContext = window.webkitAudioContext;
      if (typeof AudioContext.prototype.createGain !== 'function')
        AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
      if (typeof AudioContext.prototype.createDelay !== 'function')
        AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
      if (typeof AudioContext.prototype.createScriptProcessor !== 'function')
        AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
      if (typeof AudioContext.prototype.createPeriodicWave !== 'function')
        AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
      AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
      AudioContext.prototype.createGain = function () {
        var node = this.internal_createGain();
        fixSetTarget(node.gain);
        return node;
      };
      AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
      AudioContext.prototype.createDelay = function (maxDelayTime) {
        var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
        fixSetTarget(node.delayTime);
        return node;
      };
      AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
      AudioContext.prototype.createBufferSource = function () {
        var node = this.internal_createBufferSource();
        if (!node.start) {
          node.start = function (when, offset, duration) {
            if (offset || duration)
              this.noteGrainOn(when || 0, offset, duration);
            else
              this.noteOn(when || 0);
          };
        } else {
          node.internal_start = node.start;
          node.start = function (when, offset, duration) {
            if (typeof duration !== 'undefined')
              node.internal_start(when || 0, offset, duration);
            else
              node.internal_start(when || 0, offset || 0);
          };
        }
        if (!node.stop) {
          node.stop = function (when) {
            this.noteOff(when || 0);
          };
        } else {
          node.internal_stop = node.stop;
          node.stop = function (when) {
            node.internal_stop(when || 0);
          };
        }
        fixSetTarget(node.playbackRate);
        return node;
      };
      AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
      AudioContext.prototype.createDynamicsCompressor = function () {
        var node = this.internal_createDynamicsCompressor();
        fixSetTarget(node.threshold);
        fixSetTarget(node.knee);
        fixSetTarget(node.ratio);
        fixSetTarget(node.reduction);
        fixSetTarget(node.attack);
        fixSetTarget(node.release);
        return node;
      };
      AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
      AudioContext.prototype.createBiquadFilter = function () {
        var node = this.internal_createBiquadFilter();
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        fixSetTarget(node.Q);
        fixSetTarget(node.gain);
        return node;
      };
      if (typeof AudioContext.prototype.createOscillator !== 'function') {
        AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
        AudioContext.prototype.createOscillator = function () {
          var node = this.internal_createOscillator();
          if (!node.start) {
            node.start = function (when) {
              this.noteOn(when || 0);
            };
          } else {
            node.internal_start = node.start;
            node.start = function (when) {
              node.internal_start(when || 0);
            };
          }
          if (!node.stop) {
            node.stop = function (when) {
              this.noteOff(when || 0);
            };
          } else {
            node.internal_stop = node.stop;
            node.stop = function (when) {
              node.internal_stop(when || 0);
            };
          }
          if (!node.setPeriodicWave)
            node.setPeriodicWave = node.setWaveTable;
          fixSetTarget(node.frequency);
          fixSetTarget(node.detune);
          return node;
        };
      }
    }
    if (window.hasOwnProperty('webkitOfflineAudioContext') && !window.hasOwnProperty('OfflineAudioContext')) {
      window.OfflineAudioContext = window.webkitOfflineAudioContext;
    }
  }(window));
  // <-- end MonkeyPatch.
  // Polyfill for AudioIn, also handled by p5.dom createCapture
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  /**
   * Determine which filetypes are supported (inspired by buzz.js)
   * The audio element (el) will only be used to test browser support for various audio formats
   */
  var el = document.createElement('audio');
  p5.prototype.isSupported = function () {
    return !!el.canPlayType;
  };
  var isOGGSupported = function () {
    return !!el.canPlayType && el.canPlayType('audio/ogg; codecs="vorbis"');
  };
  var isMP3Supported = function () {
    return !!el.canPlayType && el.canPlayType('audio/mpeg;');
  };
  var isWAVSupported = function () {
    return !!el.canPlayType && el.canPlayType('audio/wav; codecs="1"');
  };
  var isAACSupported = function () {
    return !!el.canPlayType && (el.canPlayType('audio/x-m4a;') || el.canPlayType('audio/aac;'));
  };
  var isAIFSupported = function () {
    return !!el.canPlayType && el.canPlayType('audio/x-aiff;');
  };
  p5.prototype.isFileSupported = function (extension) {
    switch (extension.toLowerCase()) {
    case 'mp3':
      return isMP3Supported();
    case 'wav':
      return isWAVSupported();
    case 'ogg':
      return isOGGSupported();
    case 'aac':
    case 'm4a':
    case 'mp4':
      return isAACSupported();
    case 'aif':
    case 'aiff':
      return isAIFSupported();
    default:
      return false;
    }
  };
}();
var StartAudioContext;
(function (root, factory) {
  if (true) {
    StartAudioContext = function () {
      return factory();
    }();
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StartAudioContext = factory();
  }
}(this, function () {
  var TapListener = function (element, context) {
    this._dragged = false;
    this._element = element;
    this._bindedMove = this._moved.bind(this);
    this._bindedEnd = this._ended.bind(this, context);
    element.addEventListener('touchstart', this._bindedEnd);
    element.addEventListener('touchmove', this._bindedMove);
    element.addEventListener('touchend', this._bindedEnd);
    element.addEventListener('mouseup', this._bindedEnd);
  };
  TapListener.prototype._moved = function (e) {
    this._dragged = true;
  };
  TapListener.prototype._ended = function (context) {
    if (!this._dragged) {
      startContext(context);
    }
    this._dragged = false;
  };
  TapListener.prototype.dispose = function () {
    this._element.removeEventListener('touchstart', this._bindedEnd);
    this._element.removeEventListener('touchmove', this._bindedMove);
    this._element.removeEventListener('touchend', this._bindedEnd);
    this._element.removeEventListener('mouseup', this._bindedEnd);
    this._bindedMove = null;
    this._bindedEnd = null;
    this._element = null;
  };
  function startContext(context) {
    var buffer = context.createBuffer(1, 1, context.sampleRate);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    if (context.resume) {
      context.resume();
    }
  }
  function isStarted(context) {
    return context.state === 'running';
  }
  function onStarted(context, callback) {
    function checkLoop() {
      if (isStarted(context)) {
        callback();
      } else {
        requestAnimationFrame(checkLoop);
        if (context.resume) {
          context.resume();
        }
      }
    }
    if (isStarted(context)) {
      callback();
    } else {
      checkLoop();
    }
  }
  function bindTapListener(element, tapListeners, context) {
    if (Array.isArray(element) || NodeList && element instanceof NodeList) {
      for (var i = 0; i < element.length; i++) {
        bindTapListener(element[i], tapListeners, context);
      }
    } else if (typeof element === 'string') {
      bindTapListener(document.querySelectorAll(element), tapListeners, context);
    } else if (element.jquery && typeof element.toArray === 'function') {
      bindTapListener(element.toArray(), tapListeners, context);
    } else if (Element && element instanceof Element) {
      var tap = new TapListener(element, context);
      tapListeners.push(tap);
    }
  }
  function StartAudioContext(context, elements, callback) {
    var promise = new Promise(function (success) {
      onStarted(context, success);
    });
    var tapListeners = [];
    if (!elements) {
      elements = document.body;
    }
    bindTapListener(elements, tapListeners, context);
    promise.then(function () {
      for (var i = 0; i < tapListeners.length; i++) {
        tapListeners[i].dispose();
      }
      tapListeners = null;
      if (callback) {
        callback();
      }
    });
    return promise;
  }
  return StartAudioContext;
}));
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Tone;
Tone_core_Tone = function () {
  'use strict';
  var Tone = function (inputs, outputs) {
    if (this.isUndef(inputs) || inputs === 1) {
      this.input = this.context.createGain();
    } else if (inputs > 1) {
      this.input = new Array(inputs);
    }
    if (this.isUndef(outputs) || outputs === 1) {
      this.output = this.context.createGain();
    } else if (outputs > 1) {
      this.output = new Array(inputs);
    }
  };
  Tone.prototype.set = function (params, value, rampTime) {
    if (this.isObject(params)) {
      rampTime = value;
    } else if (this.isString(params)) {
      var tmpObj = {};
      tmpObj[params] = value;
      params = tmpObj;
    }
    paramLoop:
      for (var attr in params) {
        value = params[attr];
        var parent = this;
        if (attr.indexOf('.') !== -1) {
          var attrSplit = attr.split('.');
          for (var i = 0; i < attrSplit.length - 1; i++) {
            parent = parent[attrSplit[i]];
            if (parent instanceof Tone) {
              attrSplit.splice(0, i + 1);
              var innerParam = attrSplit.join('.');
              parent.set(innerParam, value);
              continue paramLoop;
            }
          }
          attr = attrSplit[attrSplit.length - 1];
        }
        var param = parent[attr];
        if (this.isUndef(param)) {
          continue;
        }
        if (Tone.Signal && param instanceof Tone.Signal || Tone.Param && param instanceof Tone.Param) {
          if (param.value !== value) {
            if (this.isUndef(rampTime)) {
              param.value = value;
            } else {
              param.rampTo(value, rampTime);
            }
          }
        } else if (param instanceof AudioParam) {
          if (param.value !== value) {
            param.value = value;
          }
        } else if (param instanceof Tone) {
          param.set(value);
        } else if (param !== value) {
          parent[attr] = value;
        }
      }
    return this;
  };
  Tone.prototype.get = function (params) {
    if (this.isUndef(params)) {
      params = this._collectDefaults(this.constructor);
    } else if (this.isString(params)) {
      params = [params];
    }
    var ret = {};
    for (var i = 0; i < params.length; i++) {
      var attr = params[i];
      var parent = this;
      var subRet = ret;
      if (attr.indexOf('.') !== -1) {
        var attrSplit = attr.split('.');
        for (var j = 0; j < attrSplit.length - 1; j++) {
          var subAttr = attrSplit[j];
          subRet[subAttr] = subRet[subAttr] || {};
          subRet = subRet[subAttr];
          parent = parent[subAttr];
        }
        attr = attrSplit[attrSplit.length - 1];
      }
      var param = parent[attr];
      if (this.isObject(params[attr])) {
        subRet[attr] = param.get();
      } else if (Tone.Signal && param instanceof Tone.Signal) {
        subRet[attr] = param.value;
      } else if (Tone.Param && param instanceof Tone.Param) {
        subRet[attr] = param.value;
      } else if (param instanceof AudioParam) {
        subRet[attr] = param.value;
      } else if (param instanceof Tone) {
        subRet[attr] = param.get();
      } else if (!this.isFunction(param) && !this.isUndef(param)) {
        subRet[attr] = param;
      }
    }
    return ret;
  };
  Tone.prototype._collectDefaults = function (constr) {
    var ret = [];
    if (!this.isUndef(constr.defaults)) {
      ret = Object.keys(constr.defaults);
    }
    if (!this.isUndef(constr._super)) {
      var superDefs = this._collectDefaults(constr._super);
      for (var i = 0; i < superDefs.length; i++) {
        if (ret.indexOf(superDefs[i]) === -1) {
          ret.push(superDefs[i]);
        }
      }
    }
    return ret;
  };
  Tone.prototype.toString = function () {
    for (var className in Tone) {
      var isLetter = className[0].match(/^[A-Z]$/);
      var sameConstructor = Tone[className] === this.constructor;
      if (this.isFunction(Tone[className]) && isLetter && sameConstructor) {
        return className;
      }
    }
    return 'Tone';
  };
  Object.defineProperty(Tone.prototype, 'numberOfInputs', {
    get: function () {
      if (this.input) {
        if (this.isArray(this.input)) {
          return this.input.length;
        } else {
          return 1;
        }
      } else {
        return 0;
      }
    }
  });
  Object.defineProperty(Tone.prototype, 'numberOfOutputs', {
    get: function () {
      if (this.output) {
        if (this.isArray(this.output)) {
          return this.output.length;
        } else {
          return 1;
        }
      } else {
        return 0;
      }
    }
  });
  Tone.prototype.dispose = function () {
    if (!this.isUndef(this.input)) {
      if (this.input instanceof AudioNode) {
        this.input.disconnect();
      }
      this.input = null;
    }
    if (!this.isUndef(this.output)) {
      if (this.output instanceof AudioNode) {
        this.output.disconnect();
      }
      this.output = null;
    }
    return this;
  };
  Tone.prototype.connect = function (unit, outputNum, inputNum) {
    if (Array.isArray(this.output)) {
      outputNum = this.defaultArg(outputNum, 0);
      this.output[outputNum].connect(unit, 0, inputNum);
    } else {
      this.output.connect(unit, outputNum, inputNum);
    }
    return this;
  };
  Tone.prototype.disconnect = function (destination, outputNum, inputNum) {
    if (this.isArray(this.output)) {
      if (this.isNumber(destination)) {
        this.output[destination].disconnect();
      } else {
        outputNum = this.defaultArg(outputNum, 0);
        this.output[outputNum].disconnect(destination, 0, inputNum);
      }
    } else {
      this.output.disconnect.apply(this.output, arguments);
    }
  };
  Tone.prototype.connectSeries = function () {
    if (arguments.length > 1) {
      var currentUnit = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        var toUnit = arguments[i];
        currentUnit.connect(toUnit);
        currentUnit = toUnit;
      }
    }
    return this;
  };
  Tone.prototype.chain = function () {
    if (arguments.length > 0) {
      var currentUnit = this;
      for (var i = 0; i < arguments.length; i++) {
        var toUnit = arguments[i];
        currentUnit.connect(toUnit);
        currentUnit = toUnit;
      }
    }
    return this;
  };
  Tone.prototype.fan = function () {
    if (arguments.length > 0) {
      for (var i = 0; i < arguments.length; i++) {
        this.connect(arguments[i]);
      }
    }
    return this;
  };
  AudioNode.prototype.chain = Tone.prototype.chain;
  AudioNode.prototype.fan = Tone.prototype.fan;
  Tone.prototype.defaultArg = function (given, fallback) {
    if (this.isObject(given) && this.isObject(fallback)) {
      var ret = {};
      for (var givenProp in given) {
        ret[givenProp] = this.defaultArg(fallback[givenProp], given[givenProp]);
      }
      for (var fallbackProp in fallback) {
        ret[fallbackProp] = this.defaultArg(given[fallbackProp], fallback[fallbackProp]);
      }
      return ret;
    } else {
      return this.isUndef(given) ? fallback : given;
    }
  };
  Tone.prototype.optionsObject = function (values, keys, defaults) {
    var options = {};
    if (values.length === 1 && this.isObject(values[0])) {
      options = values[0];
    } else {
      for (var i = 0; i < keys.length; i++) {
        options[keys[i]] = values[i];
      }
    }
    if (!this.isUndef(defaults)) {
      return this.defaultArg(options, defaults);
    } else {
      return options;
    }
  };
  Tone.prototype.isUndef = function (val) {
    return typeof val === 'undefined';
  };
  Tone.prototype.isFunction = function (val) {
    return typeof val === 'function';
  };
  Tone.prototype.isNumber = function (arg) {
    return typeof arg === 'number';
  };
  Tone.prototype.isObject = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Object]' && arg.constructor === Object;
  };
  Tone.prototype.isBoolean = function (arg) {
    return typeof arg === 'boolean';
  };
  Tone.prototype.isArray = function (arg) {
    return Array.isArray(arg);
  };
  Tone.prototype.isString = function (arg) {
    return typeof arg === 'string';
  };
  Tone.noOp = function () {
  };
  Tone.prototype._readOnly = function (property) {
    if (Array.isArray(property)) {
      for (var i = 0; i < property.length; i++) {
        this._readOnly(property[i]);
      }
    } else {
      Object.defineProperty(this, property, {
        writable: false,
        enumerable: true
      });
    }
  };
  Tone.prototype._writable = function (property) {
    if (Array.isArray(property)) {
      for (var i = 0; i < property.length; i++) {
        this._writable(property[i]);
      }
    } else {
      Object.defineProperty(this, property, { writable: true });
    }
  };
  Tone.State = {
    Started: 'started',
    Stopped: 'stopped',
    Paused: 'paused'
  };
  Tone.prototype.equalPowerScale = function (percent) {
    var piFactor = 0.5 * Math.PI;
    return Math.sin(percent * piFactor);
  };
  Tone.prototype.dbToGain = function (db) {
    return Math.pow(2, db / 6);
  };
  Tone.prototype.gainToDb = function (gain) {
    return 20 * (Math.log(gain) / Math.LN10);
  };
  Tone.prototype.intervalToFrequencyRatio = function (interval) {
    return Math.pow(2, interval / 12);
  };
  Tone.prototype.now = function () {
    return Tone.context.now();
  };
  Tone.now = function () {
    return Tone.context.now();
  };
  Tone.extend = function (child, parent) {
    if (Tone.prototype.isUndef(parent)) {
      parent = Tone;
    }
    function TempConstructor() {
    }
    TempConstructor.prototype = parent.prototype;
    child.prototype = new TempConstructor();
    child.prototype.constructor = child;
    child._super = parent;
  };
  var audioContext;
  Object.defineProperty(Tone, 'context', {
    get: function () {
      return audioContext;
    },
    set: function (context) {
      if (Tone.Context && context instanceof Tone.Context) {
        audioContext = context;
      } else {
        audioContext = new Tone.Context(context);
      }
      if (Tone.Context) {
        Tone.Context.emit('init', audioContext);
      }
    }
  });
  Object.defineProperty(Tone.prototype, 'context', {
    get: function () {
      return Tone.context;
    }
  });
  Tone.setContext = function (ctx) {
    Tone.context = ctx;
  };
  Object.defineProperty(Tone.prototype, 'blockTime', {
    get: function () {
      return 128 / this.context.sampleRate;
    }
  });
  Object.defineProperty(Tone.prototype, 'sampleTime', {
    get: function () {
      return 1 / this.context.sampleRate;
    }
  });
  Object.defineProperty(Tone, 'supported', {
    get: function () {
      var hasAudioContext = window.hasOwnProperty('AudioContext') || window.hasOwnProperty('webkitAudioContext');
      var hasPromises = window.hasOwnProperty('Promise');
      var hasWorkers = window.hasOwnProperty('Worker');
      return hasAudioContext && hasPromises && hasWorkers;
    }
  });
  Tone.version = 'r10';
  if (!window.TONE_SILENCE_VERSION_LOGGING) {
  }
  return Tone;
}();
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Emitter;
Tone_core_Emitter = function (Tone) {
  'use strict';
  Tone.Emitter = function () {
    this._events = {};
  };
  Tone.extend(Tone.Emitter);
  Tone.Emitter.prototype.on = function (event, callback) {
    var events = event.split(/\W+/);
    for (var i = 0; i < events.length; i++) {
      var eventName = events[i];
      if (!this._events.hasOwnProperty(eventName)) {
        this._events[eventName] = [];
      }
      this._events[eventName].push(callback);
    }
    return this;
  };
  Tone.Emitter.prototype.off = function (event, callback) {
    var events = event.split(/\W+/);
    for (var ev = 0; ev < events.length; ev++) {
      event = events[ev];
      if (this._events.hasOwnProperty(event)) {
        if (Tone.prototype.isUndef(callback)) {
          this._events[event] = [];
        } else {
          var eventList = this._events[event];
          for (var i = 0; i < eventList.length; i++) {
            if (eventList[i] === callback) {
              eventList.splice(i, 1);
            }
          }
        }
      }
    }
    return this;
  };
  Tone.Emitter.prototype.emit = function (event) {
    if (this._events) {
      var args = Array.apply(null, arguments).slice(1);
      if (this._events.hasOwnProperty(event)) {
        var eventList = this._events[event];
        for (var i = 0, len = eventList.length; i < len; i++) {
          eventList[i].apply(this, args);
        }
      }
    }
    return this;
  };
  Tone.Emitter.mixin = function (object) {
    var functions = [
      'on',
      'off',
      'emit'
    ];
    object._events = {};
    for (var i = 0; i < functions.length; i++) {
      var func = functions[i];
      var emitterFunc = Tone.Emitter.prototype[func];
      object[func] = emitterFunc;
    }
  };
  Tone.Emitter.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._events = null;
    return this;
  };
  return Tone.Emitter;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Context;
Tone_core_Context = function (Tone) {
  if (!window.hasOwnProperty('AudioContext') && window.hasOwnProperty('webkitAudioContext')) {
    window.AudioContext = window.webkitAudioContext;
  }
  Tone.Context = function (context) {
    Tone.Emitter.call(this);
    if (!context) {
      context = new window.AudioContext();
    }
    this._context = context;
    for (var prop in this._context) {
      this._defineProperty(this._context, prop);
    }
    this._latencyHint = 'interactive';
    this._lookAhead = 0.1;
    this._updateInterval = this._lookAhead / 3;
    this._computedUpdateInterval = 0;
    this._worker = this._createWorker();
    this._constants = {};
  };
  Tone.extend(Tone.Context, Tone.Emitter);
  Tone.Emitter.mixin(Tone.Context);
  Tone.Context.prototype._defineProperty = function (context, prop) {
    if (this.isUndef(this[prop])) {
      Object.defineProperty(this, prop, {
        get: function () {
          if (typeof context[prop] === 'function') {
            return context[prop].bind(context);
          } else {
            return context[prop];
          }
        },
        set: function (val) {
          context[prop] = val;
        }
      });
    }
  };
  Tone.Context.prototype.now = function () {
    return this._context.currentTime;
  };
  Tone.Context.prototype._createWorker = function () {
    window.URL = window.URL || window.webkitURL;
    var blob = new Blob(['var timeoutTime = ' + (this._updateInterval * 1000).toFixed(1) + ';' + 'self.onmessage = function(msg){' + '\ttimeoutTime = parseInt(msg.data);' + '};' + 'function tick(){' + '\tsetTimeout(tick, timeoutTime);' + '\tself.postMessage(\'tick\');' + '}' + 'tick();']);
    var blobUrl = URL.createObjectURL(blob);
    var worker = new Worker(blobUrl);
    worker.addEventListener('message', function () {
      this.emit('tick');
    }.bind(this));
    worker.addEventListener('message', function () {
      var now = this.now();
      if (this.isNumber(this._lastUpdate)) {
        var diff = now - this._lastUpdate;
        this._computedUpdateInterval = Math.max(diff, this._computedUpdateInterval * 0.97);
      }
      this._lastUpdate = now;
    }.bind(this));
    return worker;
  };
  Tone.Context.prototype.getConstant = function (val) {
    if (this._constants[val]) {
      return this._constants[val];
    } else {
      var buffer = this._context.createBuffer(1, 128, this._context.sampleRate);
      var arr = buffer.getChannelData(0);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = val;
      }
      var constant = this._context.createBufferSource();
      constant.channelCount = 1;
      constant.channelCountMode = 'explicit';
      constant.buffer = buffer;
      constant.loop = true;
      constant.start(0);
      this._constants[val] = constant;
      return constant;
    }
  };
  Object.defineProperty(Tone.Context.prototype, 'lag', {
    get: function () {
      var diff = this._computedUpdateInterval - this._updateInterval;
      diff = Math.max(diff, 0);
      return diff;
    }
  });
  Object.defineProperty(Tone.Context.prototype, 'lookAhead', {
    get: function () {
      return this._lookAhead;
    },
    set: function (lA) {
      this._lookAhead = lA;
    }
  });
  Object.defineProperty(Tone.Context.prototype, 'updateInterval', {
    get: function () {
      return this._updateInterval;
    },
    set: function (interval) {
      this._updateInterval = Math.max(interval, Tone.prototype.blockTime);
      this._worker.postMessage(Math.max(interval * 1000, 1));
    }
  });
  Object.defineProperty(Tone.Context.prototype, 'latencyHint', {
    get: function () {
      return this._latencyHint;
    },
    set: function (hint) {
      var lookAhead = hint;
      this._latencyHint = hint;
      if (this.isString(hint)) {
        switch (hint) {
        case 'interactive':
          lookAhead = 0.1;
          this._context.latencyHint = hint;
          break;
        case 'playback':
          lookAhead = 0.8;
          this._context.latencyHint = hint;
          break;
        case 'balanced':
          lookAhead = 0.25;
          this._context.latencyHint = hint;
          break;
        case 'fastest':
          lookAhead = 0.01;
          break;
        }
      }
      this.lookAhead = lookAhead;
      this.updateInterval = lookAhead / 3;
    }
  });
  function shimConnect() {
    var nativeConnect = AudioNode.prototype.connect;
    var nativeDisconnect = AudioNode.prototype.disconnect;
    function toneConnect(B, outNum, inNum) {
      if (B.input) {
        if (Array.isArray(B.input)) {
          if (Tone.prototype.isUndef(inNum)) {
            inNum = 0;
          }
          this.connect(B.input[inNum]);
        } else {
          this.connect(B.input, outNum, inNum);
        }
      } else {
        try {
          if (B instanceof AudioNode) {
            nativeConnect.call(this, B, outNum, inNum);
          } else {
            nativeConnect.call(this, B, outNum);
          }
        } catch (e) {
          throw new Error('error connecting to node: ' + B + '\n' + e);
        }
      }
    }
    function toneDisconnect(B, outNum, inNum) {
      if (B && B.input && Array.isArray(B.input)) {
        if (Tone.prototype.isUndef(inNum)) {
          inNum = 0;
        }
        this.disconnect(B.input[inNum], outNum, inNum);
      } else if (B && B.input) {
        this.disconnect(B.input, outNum, inNum);
      } else {
        try {
          nativeDisconnect.apply(this, arguments);
        } catch (e) {
          throw new Error('error disconnecting node: ' + B + '\n' + e);
        }
      }
    }
    if (AudioNode.prototype.connect !== toneConnect) {
      AudioNode.prototype.connect = toneConnect;
      AudioNode.prototype.disconnect = toneDisconnect;
    }
  }
  if (Tone.supported) {
    shimConnect();
    Tone.context = new Tone.Context();
  } else {
    console.warn('This browser does not support Tone.js');
  }
  return Tone.Context;
}(Tone_core_Tone);
var audiocontext;
'use strict';
audiocontext = function (StartAudioContext, Context, Tone) {
  // Create the Audio Context
  const audiocontext = new window.AudioContext();
  Tone.context.dispose();
  Tone.setContext(audiocontext);
  /**
   * <p>Returns the Audio Context for this sketch. Useful for users
   * who would like to dig deeper into the <a target='_blank' href=
   * 'http://webaudio.github.io/web-audio-api/'>Web Audio API
   * </a>.</p>
   *
   * <p>Some browsers require users to startAudioContext
   * with a user gesture, such as touchStarted in the example below.</p>
   *
   * @method getAudioContext
   * @return {Object}    AudioContext for this sketch
   * @example
   * <div><code>
   *  function draw() {
   *    background(255);
   *    textAlign(CENTER);
   *
   *    if (getAudioContext().state !== 'running') {
   *      text('click to start audio', width/2, height/2);
   *    } else {
   *      text('audio is enabled', width/2, height/2);
   *    }
   *  }
   *
   *  function touchStarted() {
   *    if (getAudioContext().state !== 'running') {
   *      getAudioContext().resume();
   *    }
   *    var synth = new p5.MonoSynth();
   *    synth.play('A4', 0.5, 0, 0.2);
   *  }
   *
   * </div></code>
   */
  p5.prototype.getAudioContext = function () {
    return audiocontext;
  };
  /**
   *  <p>It is a good practice to give users control over starting audio playback.
   *  This practice is enforced by Google Chrome's autoplay policy as of r70
   *  (<a href="https://goo.gl/7K7WLu">info</a>), iOS Safari, and other browsers.
   *  </p>
   *
   *  <p>
   *  userStartAudio() starts the <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioContext"
   *  target="_blank" title="Audio Context @ MDN">Audio Context</a> on a user gesture. It utilizes
   *  the <a href="https://github.com/tambien/StartAudioContext">StartAudioContext</a> library by
   *  Yotam Mann (MIT Licence, 2016). Read more at https://github.com/tambien/StartAudioContext.
   *  </p>
   *
   *  <p>Starting the audio context on a user gesture can be as simple as <code>userStartAudio()</code>.
   *  Optional parameters let you decide on a specific element that will start the audio context,
   *  and/or call a function once the audio context is started.</p>
   *  @param  {Element|Array}   [element(s)] This argument can be an Element,
   *                                Selector String, NodeList, p5.Element,
   *                                jQuery Element, or an Array of any of those.
   *  @param  {Function} [callback] Callback to invoke when the AudioContext has started
   *  @return {Promise}            Returns a Promise which is resolved when
   *                                       the AudioContext state is 'running'
   * @method userStartAudio
   *  @example
   *  <div><code>
   *  function setup() {
   *    var myDiv = createDiv('click to start audio');
   *    myDiv.position(0, 0);
   *
   *    var mySynth = new p5.MonoSynth();
   *
   *    // This won't play until the context has started
   *    mySynth.play('A6');
   *
   *    // Start the audio context on a click/touch event
   *    userStartAudio().then(function() {
   *       myDiv.remove();
   *     });
   *  }
   *  </code></div>
   */
  p5.prototype.userStartAudio = function (elements, callback) {
    var elt = elements;
    if (elements instanceof p5.Element) {
      elt = elements.elt;
    } else if (elements instanceof Array && elements[0] instanceof p5.Element) {
      elt = elements.map(function (e) {
        return e.elt;
      });
    }
    return StartAudioContext(audiocontext, elt, callback);
  };
  return audiocontext;
}(StartAudioContext, Tone_core_Context, Tone_core_Tone);
var master;
'use strict';
master = function (audiocontext) {
  /**
   * Master contains AudioContext and the master sound output.
   */
  var Master = function () {
    this.input = audiocontext.createGain();
    this.output = audiocontext.createGain();
    //put a hard limiter on the output
    this.limiter = audiocontext.createDynamicsCompressor();
    this.limiter.threshold.value = -3;
    this.limiter.ratio.value = 20;
    this.limiter.knee.value = 1;
    this.audiocontext = audiocontext;
    this.output.disconnect();
    // connect input to limiter
    this.input.connect(this.limiter);
    // connect limiter to output
    this.limiter.connect(this.output);
    // meter is just for global Amplitude / FFT analysis
    this.meter = audiocontext.createGain();
    this.fftMeter = audiocontext.createGain();
    this.output.connect(this.meter);
    this.output.connect(this.fftMeter);
    // connect output to destination
    this.output.connect(this.audiocontext.destination);
    // an array of all sounds in the sketch
    this.soundArray = [];
    // an array of all musical parts in the sketch
    this.parts = [];
    // file extensions to search for
    this.extensions = [];
  };
  // create a single instance of the p5Sound / master output for use within this sketch
  var p5sound = new Master();
  /**
   * Returns a number representing the master amplitude (volume) for sound
   * in this sketch.
   *
   * @method getMasterVolume
   * @return {Number} Master amplitude (volume) for sound in this sketch.
   *                  Should be between 0.0 (silence) and 1.0.
   */
  p5.prototype.getMasterVolume = function () {
    return p5sound.output.gain.value;
  };
  /**
   *  <p>Scale the output of all sound in this sketch</p>
   *  Scaled between 0.0 (silence) and 1.0 (full volume).
   *  1.0 is the maximum amplitude of a digital sound, so multiplying
   *  by greater than 1.0 may cause digital distortion. To
   *  fade, provide a <code>rampTime</code> parameter. For more
   *  complex fades, see the Envelope class.
   *
   *  Alternately, you can pass in a signal source such as an
   *  oscillator to modulate the amplitude with an audio signal.
   *
   *  <p><b>How This Works</b>: When you load the p5.sound module, it
   *  creates a single instance of p5sound. All sound objects in this
   *  module output to p5sound before reaching your computer's output.
   *  So if you change the amplitude of p5sound, it impacts all of the
   *  sound in this module.</p>
   *
   *  <p>If no value is provided, returns a Web Audio API Gain Node</p>
   *
   *  @method  masterVolume
   *  @param {Number|Object} volume  Volume (amplitude) between 0.0
   *                                     and 1.0 or modulating signal/oscillator
   *  @param {Number} [rampTime]  Fade for t seconds
   *  @param {Number} [timeFromNow]  Schedule this event to happen at
   *                                 t seconds in the future
   */
  p5.prototype.masterVolume = function (vol, rampTime, tFromNow) {
    if (typeof vol === 'number') {
      var rampTime = rampTime || 0;
      var tFromNow = tFromNow || 0;
      var now = p5sound.audiocontext.currentTime;
      var currentVol = p5sound.output.gain.value;
      p5sound.output.gain.cancelScheduledValues(now + tFromNow);
      p5sound.output.gain.linearRampToValueAtTime(currentVol, now + tFromNow);
      p5sound.output.gain.linearRampToValueAtTime(vol, now + tFromNow + rampTime);
    } else if (vol) {
      vol.connect(p5sound.output.gain);
    } else {
      // return the Gain Node
      return p5sound.output.gain;
    }
  };
  /**
   *  `p5.soundOut` is the p5.sound master output. It sends output to
   *  the destination of this window's web audio context. It contains
   *  Web Audio API nodes including a dyanmicsCompressor (<code>.limiter</code>),
   *  and Gain Nodes for <code>.input</code> and <code>.output</code>.
   *
   *  @property {Object} soundOut
   */
  p5.prototype.soundOut = p5.soundOut = p5sound;
  /**
   *  a silent connection to the DesinationNode
   *  which will ensure that anything connected to it
   *  will not be garbage collected
   *
   *  @private
   */
  p5.soundOut._silentNode = p5sound.audiocontext.createGain();
  p5.soundOut._silentNode.gain.value = 0;
  p5.soundOut._silentNode.connect(p5sound.audiocontext.destination);
  return p5sound;
}(audiocontext);
var helpers;
'use strict';
helpers = function () {
  var p5sound = master;
  /**
   * @for p5
   */
  /**
   * Returns a number representing the sample rate, in samples per second,
   * of all sound objects in this audio context. It is determined by the
   * sampling rate of your operating system's sound card, and it is not
   * currently possile to change.
   * It is often 44100, or twice the range of human hearing.
   *
   * @method sampleRate
   * @return {Number} samplerate samples per second
   */
  p5.prototype.sampleRate = function () {
    return p5sound.audiocontext.sampleRate;
  };
  /**
   *  Returns the closest MIDI note value for
   *  a given frequency.
   *
   *  @method freqToMidi
   *  @param  {Number} frequency A freqeuncy, for example, the "A"
   *                             above Middle C is 440Hz
   *  @return {Number}   MIDI note value
   */
  p5.prototype.freqToMidi = function (f) {
    var mathlog2 = Math.log(f / 440) / Math.log(2);
    var m = Math.round(12 * mathlog2) + 69;
    return m;
  };
  /**
   *  Returns the frequency value of a MIDI note value.
   *  General MIDI treats notes as integers where middle C
   *  is 60, C# is 61, D is 62 etc. Useful for generating
   *  musical frequencies with oscillators.
   *
   *  @method  midiToFreq
   *  @param  {Number} midiNote The number of a MIDI note
   *  @return {Number} Frequency value of the given MIDI note
   *  @example
   *  <div><code>
   *  var notes = [60, 64, 67, 72];
   *  var i = 0;
   *
   *  function setup() {
   *    osc = new p5.Oscillator('Triangle');
   *    osc.start();
   *    frameRate(1);
   *  }
   *
   *  function draw() {
   *    var freq = midiToFreq(notes[i]);
   *    osc.freq(freq);
   *    i++;
   *    if (i >= notes.length){
   *      i = 0;
   *    }
   *  }
   *  </code></div>
   */
  var midiToFreq = p5.prototype.midiToFreq = function (m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  };
  // This method converts ANSI notes specified as a string "C4", "Eb3" to a frequency
  var noteToFreq = function (note) {
    if (typeof note !== 'string') {
      return note;
    }
    var wholeNotes = {
      A: 21,
      B: 23,
      C: 24,
      D: 26,
      E: 28,
      F: 29,
      G: 31
    };
    var value = wholeNotes[note[0].toUpperCase()];
    var octave = ~~note.slice(-1);
    value += 12 * (octave - 1);
    switch (note[1]) {
    case '#':
      value += 1;
      break;
    case 'b':
      value -= 1;
      break;
    default:
      break;
    }
    return midiToFreq(value);
  };
  /**
   *  List the SoundFile formats that you will include. LoadSound
   *  will search your directory for these extensions, and will pick
   *  a format that is compatable with the client's web browser.
   *  <a href="http://media.io/">Here</a> is a free online file
   *  converter.
   *
   *  @method soundFormats
   *  @param {String} [...formats] i.e. 'mp3', 'wav', 'ogg'
   *  @example
   *  <div><code>
   *  function preload() {
   *    // set the global sound formats
   *    soundFormats('mp3', 'ogg');
   *
   *    // load either beatbox.mp3, or .ogg, depending on browser
   *    mySound = loadSound('assets/beatbox.mp3');
   *  }
   *
   *  function setup() {
   *    mySound.play();
   *  }
   *  </code></div>
   */
  p5.prototype.soundFormats = function () {
    // reset extensions array
    p5sound.extensions = [];
    // add extensions
    for (var i = 0; i < arguments.length; i++) {
      arguments[i] = arguments[i].toLowerCase();
      if ([
          'mp3',
          'wav',
          'ogg',
          'm4a',
          'aac'
        ].indexOf(arguments[i]) > -1) {
        p5sound.extensions.push(arguments[i]);
      } else {
        throw arguments[i] + ' is not a valid sound format!';
      }
    }
  };
  p5.prototype.disposeSound = function () {
    for (var i = 0; i < p5sound.soundArray.length; i++) {
      p5sound.soundArray[i].dispose();
    }
  };
  // register removeSound to dispose of p5sound SoundFiles, Convolvers,
  // Oscillators etc when sketch ends
  p5.prototype.registerMethod('remove', p5.prototype.disposeSound);
  p5.prototype._checkFileFormats = function (paths) {
    var path;
    // if path is a single string, check to see if extension is provided
    if (typeof paths === 'string') {
      path = paths;
      // see if extension is provided
      var extTest = path.split('.').pop();
      // if an extension is provided...
      if ([
          'mp3',
          'wav',
          'ogg',
          'm4a',
          'aac'
        ].indexOf(extTest) > -1) {
        if (p5.prototype.isFileSupported(extTest)) {
          path = path;
        } else {
          var pathSplit = path.split('.');
          var pathCore = pathSplit[pathSplit.length - 1];
          for (var i = 0; i < p5sound.extensions.length; i++) {
            var extension = p5sound.extensions[i];
            var supported = p5.prototype.isFileSupported(extension);
            if (supported) {
              pathCore = '';
              if (pathSplit.length === 2) {
                pathCore += pathSplit[0];
              }
              for (var i = 1; i <= pathSplit.length - 2; i++) {
                var p = pathSplit[i];
                pathCore += '.' + p;
              }
              path = pathCore += '.';
              path = path += extension;
              break;
            }
          }
        }
      } else {
        for (var i = 0; i < p5sound.extensions.length; i++) {
          var extension = p5sound.extensions[i];
          var supported = p5.prototype.isFileSupported(extension);
          if (supported) {
            path = path + '.' + extension;
            break;
          }
        }
      }
    } else if (typeof paths === 'object') {
      for (var i = 0; i < paths.length; i++) {
        var extension = paths[i].split('.').pop();
        var supported = p5.prototype.isFileSupported(extension);
        if (supported) {
          // console.log('.'+extension + ' is ' + supported +
          //  ' supported by your browser.');
          path = paths[i];
          break;
        }
      }
    }
    return path;
  };
  /**
   *  Used by Osc and Envelope to chain signal math
   */
  p5.prototype._mathChain = function (o, math, thisChain, nextChain, type) {
    // if this type of math already exists in the chain, replace it
    for (var i in o.mathOps) {
      if (o.mathOps[i] instanceof type) {
        o.mathOps[i].dispose();
        thisChain = i;
        if (thisChain < o.mathOps.length - 1) {
          nextChain = o.mathOps[i + 1];
        }
      }
    }
    o.mathOps[thisChain - 1].disconnect();
    o.mathOps[thisChain - 1].connect(math);
    math.connect(nextChain);
    o.mathOps[thisChain] = math;
    return o;
  };
  // helper methods to convert audio file as .wav format,
  // will use as saving .wav file and saving blob object
  // Thank you to Matt Diamond's RecorderJS (MIT License)
  // https://github.com/mattdiamond/Recorderjs
  function convertToWav(audioBuffer) {
    var leftChannel, rightChannel;
    leftChannel = audioBuffer.getChannelData(0);
    // handle mono files
    if (audioBuffer.numberOfChannels > 1) {
      rightChannel = audioBuffer.getChannelData(1);
    } else {
      rightChannel = leftChannel;
    }
    var interleaved = interleave(leftChannel, rightChannel);
    // create the buffer and view to create the .WAV file
    var buffer = new window.ArrayBuffer(44 + interleaved.length * 2);
    var view = new window.DataView(buffer);
    // write the WAV container,
    // check spec at: https://web.archive.org/web/20171215131933/http://tiny.systems/software/soundProgrammer/WavFormatDocs.pdf
    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, p5sound.audiocontext.sampleRate, true);
    view.setUint32(28, p5sound.audiocontext.sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);
    // write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++) {
      view.setInt16(index, interleaved[i] * (32767 * volume), true);
      index += 2;
    }
    return view;
  }
  // helper methods to save waves
  function interleave(leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);
    var inputIndex = 0;
    for (var index = 0; index < length;) {
      result[index++] = leftChannel[inputIndex];
      result[index++] = rightChannel[inputIndex];
      inputIndex++;
    }
    return result;
  }
  function writeUTFBytes(view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  return {
    convertToWav: convertToWav,
    midiToFreq: midiToFreq,
    noteToFreq: noteToFreq
  };
}(master);
var errorHandler;
'use strict';
errorHandler = function () {
  /*
      Helper function to generate an error
      with a custom stack trace that points to the sketch
      and removes other parts of the stack trace.
  
      @private
      @class customError
      @constructor
      @param  {String} name         custom  error name
      @param  {String} errorTrace   custom error trace
      @param  {String} failedPath     path to the file that failed to load
      @property {String} name custom error name
      @property {String} message custom error message
      @property {String} stack trace the error back to a line in the user's sketch.
                               Note: this edits out stack trace within p5.js and p5.sound.
      @property {String} originalStack unedited, original stack trace
      @property {String} failedPath path to the file that failed to load
      @return {Error}     returns a custom Error object
     */
  var CustomError = function (name, errorTrace, failedPath) {
    var err = new Error();
    var tempStack, splitStack;
    err.name = name;
    err.originalStack = err.stack + errorTrace;
    tempStack = err.stack + errorTrace;
    err.failedPath = failedPath;
    // only print the part of the stack trace that refers to the user code:
    var splitStack = tempStack.split('\n');
    splitStack = splitStack.filter(function (ln) {
      return !ln.match(/(p5.|native code|globalInit)/g);
    });
    err.stack = splitStack.join('\n');
    return err;
  };
  return CustomError;
}();
var panner;
'use strict';
panner = function () {
  var p5sound = master;
  var ac = p5sound.audiocontext;
  // Stereo panner
  // if there is a stereo panner node use it
  if (typeof ac.createStereoPanner !== 'undefined') {
    p5.Panner = function (input, output) {
      this.stereoPanner = this.input = ac.createStereoPanner();
      input.connect(this.stereoPanner);
      this.stereoPanner.connect(output);
    };
    p5.Panner.prototype.pan = function (val, tFromNow) {
      var time = tFromNow || 0;
      var t = ac.currentTime + time;
      this.stereoPanner.pan.linearRampToValueAtTime(val, t);
    };
    //not implemented because stereopanner
    //node does not require this and will automatically
    //convert single channel or multichannel to stereo.
    //tested with single and stereo, not with (>2) multichannel
    p5.Panner.prototype.inputChannels = function () {
    };
    p5.Panner.prototype.connect = function (obj) {
      this.stereoPanner.connect(obj);
    };
    p5.Panner.prototype.disconnect = function () {
      if (this.stereoPanner) {
        this.stereoPanner.disconnect();
      }
    };
  } else {
    // if there is no createStereoPanner object
    // such as in safari 7.1.7 at the time of writing this
    // use this method to create the effect
    p5.Panner = function (input, output, numInputChannels) {
      this.input = ac.createGain();
      input.connect(this.input);
      this.left = ac.createGain();
      this.right = ac.createGain();
      this.left.channelInterpretation = 'discrete';
      this.right.channelInterpretation = 'discrete';
      // if input is stereo
      if (numInputChannels > 1) {
        this.splitter = ac.createChannelSplitter(2);
        this.input.connect(this.splitter);
        this.splitter.connect(this.left, 1);
        this.splitter.connect(this.right, 0);
      } else {
        this.input.connect(this.left);
        this.input.connect(this.right);
      }
      this.output = ac.createChannelMerger(2);
      this.left.connect(this.output, 0, 1);
      this.right.connect(this.output, 0, 0);
      this.output.connect(output);
    };
    // -1 is left, +1 is right
    p5.Panner.prototype.pan = function (val, tFromNow) {
      var time = tFromNow || 0;
      var t = ac.currentTime + time;
      var v = (val + 1) / 2;
      var rightVal = Math.cos(v * Math.PI / 2);
      var leftVal = Math.sin(v * Math.PI / 2);
      this.left.gain.linearRampToValueAtTime(leftVal, t);
      this.right.gain.linearRampToValueAtTime(rightVal, t);
    };
    p5.Panner.prototype.inputChannels = function (numChannels) {
      if (numChannels === 1) {
        this.input.disconnect();
        this.input.connect(this.left);
        this.input.connect(this.right);
      } else if (numChannels === 2) {
        if (typeof (this.splitter === 'undefined')) {
          this.splitter = ac.createChannelSplitter(2);
        }
        this.input.disconnect();
        this.input.connect(this.splitter);
        this.splitter.connect(this.left, 1);
        this.splitter.connect(this.right, 0);
      }
    };
    p5.Panner.prototype.connect = function (obj) {
      this.output.connect(obj);
    };
    p5.Panner.prototype.disconnect = function () {
      if (this.output) {
        this.output.disconnect();
      }
    };
  }
}(master);
var soundfile;
'use strict';
soundfile = function () {
  var CustomError = errorHandler;
  var p5sound = master;
  var ac = p5sound.audiocontext;
  var midiToFreq = helpers.midiToFreq;
  var convertToWav = helpers.convertToWav;
  /**
   *  <p>SoundFile object with a path to a file.</p>
   *
   *  <p>The p5.SoundFile may not be available immediately because
   *  it loads the file information asynchronously.</p>
   *
   *  <p>To do something with the sound as soon as it loads
   *  pass the name of a function as the second parameter.</p>
   *
   *  <p>Only one file path is required. However, audio file formats
   *  (i.e. mp3, ogg, wav and m4a/aac) are not supported by all
   *  web browsers. If you want to ensure compatability, instead of a single
   *  file path, you may include an Array of filepaths, and the browser will
   *  choose a format that works.</p>
   *
   *  @class p5.SoundFile
   *  @constructor
   *  @param {String|Array} path   path to a sound file (String). Optionally,
   *                               you may include multiple file formats in
   *                               an array. Alternately, accepts an object
   *                               from the HTML5 File API, or a p5.File.
   *  @param {Function} [successCallback]   Name of a function to call once file loads
   *  @param {Function} [errorCallback]   Name of a function to call if file fails to
   *                                      load. This function will receive an error or
   *                                     XMLHttpRequest object with information
   *                                     about what went wrong.
   *  @param {Function} [whileLoadingCallback]   Name of a function to call while file
   *                                             is loading. That function will
   *                                             receive progress of the request to
   *                                             load the sound file
   *                                             (between 0 and 1) as its first
   *                                             parameter. This progress
   *                                             does not account for the additional
   *                                             time needed to decode the audio data.
   *
   *  @example
   *  <div><code>
   *
   *  function preload() {
   *    soundFormats('mp3', 'ogg');
   *    mySound = loadSound('assets/doorbell.mp3');
   *  }
   *
   *  function setup() {
   *    mySound.setVolume(0.1);
   *    mySound.play();
   *  }
   *
   * </code></div>
   */
  p5.SoundFile = function (paths, onload, onerror, whileLoading) {
    if (typeof paths !== 'undefined') {
      if (typeof paths === 'string' || typeof paths[0] === 'string') {
        var path = p5.prototype._checkFileFormats(paths);
        this.url = path;
      } else if (typeof paths === 'object') {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
          // The File API isn't supported in this browser
          throw 'Unable to load file because the File API is not supported';
        }
      }
      // if type is a p5.File...get the actual file
      if (paths.file) {
        paths = paths.file;
      }
      this.file = paths;
    }
    // private _onended callback, set by the method: onended(callback)
    this._onended = function () {
    };
    this._looping = false;
    this._playing = false;
    this._paused = false;
    this._pauseTime = 0;
    // cues for scheduling events with addCue() removeCue()
    this._cues = [];
    this._cueIDCounter = 0;
    //  position of the most recently played sample
    this._lastPos = 0;
    this._counterNode = null;
    this._scopeNode = null;
    // array of sources so that they can all be stopped!
    this.bufferSourceNodes = [];
    // current source
    this.bufferSourceNode = null;
    this.buffer = null;
    this.playbackRate = 1;
    this.input = p5sound.audiocontext.createGain();
    this.output = p5sound.audiocontext.createGain();
    this.reversed = false;
    // start and end of playback / loop
    this.startTime = 0;
    this.endTime = null;
    this.pauseTime = 0;
    // "restart" would stop playback before retriggering
    this.mode = 'sustain';
    // time that playback was started, in millis
    this.startMillis = null;
    // stereo panning
    this.panPosition = 0;
    this.panner = new p5.Panner(this.output, p5sound.input, 2);
    // it is possible to instantiate a soundfile with no path
    if (this.url || this.file) {
      this.load(onload, onerror);
    }
    // add this p5.SoundFile to the soundArray
    p5sound.soundArray.push(this);
    if (typeof whileLoading === 'function') {
      this._whileLoading = whileLoading;
    } else {
      this._whileLoading = function () {
      };
    }
    this._onAudioProcess = _onAudioProcess.bind(this);
    this._clearOnEnd = _clearOnEnd.bind(this);
  };
  // register preload handling of loadSound
  p5.prototype.registerPreloadMethod('loadSound', p5.prototype);
  /**
   *  loadSound() returns a new p5.SoundFile from a specified
   *  path. If called during preload(), the p5.SoundFile will be ready
   *  to play in time for setup() and draw(). If called outside of
   *  preload, the p5.SoundFile will not be ready immediately, so
   *  loadSound accepts a callback as the second parameter. Using a
   *  <a href="https://github.com/processing/p5.js/wiki/Local-server">
   *  local server</a> is recommended when loading external files.
   *
   *  @method loadSound
   *  @param  {String|Array}   path     Path to the sound file, or an array with
   *                                    paths to soundfiles in multiple formats
   *                                    i.e. ['sound.ogg', 'sound.mp3'].
   *                                    Alternately, accepts an object: either
   *                                    from the HTML5 File API, or a p5.File.
   *  @param {Function} [successCallback]   Name of a function to call once file loads
   *  @param {Function} [errorCallback]   Name of a function to call if there is
   *                                      an error loading the file.
   *  @param {Function} [whileLoading] Name of a function to call while file is loading.
   *                                 This function will receive the percentage loaded
   *                                 so far, from 0.0 to 1.0.
   *  @return {SoundFile}            Returns a p5.SoundFile
   *  @example
   *  <div><code>
   *  function preload() {
   *   mySound = loadSound('assets/doorbell.mp3');
   *  }
   *
   *  function setup() {
   *    mySound.setVolume(0.1);
   *    mySound.play();
   *  }
   *  </code></div>
   */
  p5.prototype.loadSound = function (path, callback, onerror, whileLoading) {
    // if loading locally without a server
    if (window.location.origin.indexOf('file://') > -1 && window.cordova === 'undefined') {
      window.alert('This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS');
    }
    var self = this;
    var s = new p5.SoundFile(path, function () {
      if (typeof callback === 'function') {
        callback.apply(self, arguments);
      }
      if (typeof self._decrementPreload === 'function') {
        self._decrementPreload();
      }
    }, onerror, whileLoading);
    return s;
  };
  /**
   * This is a helper function that the p5.SoundFile calls to load
   * itself. Accepts a callback (the name of another function)
   * as an optional parameter.
   *
   * @private
   * @param {Function} [successCallback]   Name of a function to call once file loads
   * @param {Function} [errorCallback]   Name of a function to call if there is an error
   */
  p5.SoundFile.prototype.load = function (callback, errorCallback) {
    var self = this;
    var errorTrace = new Error().stack;
    if (this.url !== undefined && this.url !== '') {
      var request = new XMLHttpRequest();
      request.addEventListener('progress', function (evt) {
        self._updateProgress(evt);
      }, false);
      request.open('GET', this.url, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        if (request.status === 200) {
          // on sucess loading file:
          if (!self.panner)
            return;
          ac.decodeAudioData(request.response, // success decoding buffer:
          function (buff) {
            if (!self.panner)
              return;
            self.buffer = buff;
            self.panner.inputChannels(buff.numberOfChannels);
            if (callback) {
              callback(self);
            }
          }, // error decoding buffer. "e" is undefined in Chrome 11/22/2015
          function () {
            if (!self.panner)
              return;
            var err = new CustomError('decodeAudioData', errorTrace, self.url);
            var msg = 'AudioContext error at decodeAudioData for ' + self.url;
            if (errorCallback) {
              err.msg = msg;
              errorCallback(err);
            } else {
              console.error(msg + '\n The error stack trace includes: \n' + err.stack);
            }
          });
        } else {
          if (!self.panner)
            return;
          var err = new CustomError('loadSound', errorTrace, self.url);
          var msg = 'Unable to load ' + self.url + '. The request status was: ' + request.status + ' (' + request.statusText + ')';
          if (errorCallback) {
            err.message = msg;
            errorCallback(err);
          } else {
            console.error(msg + '\n The error stack trace includes: \n' + err.stack);
          }
        }
      };
      // if there is another error, aside from 404...
      request.onerror = function () {
        var err = new CustomError('loadSound', errorTrace, self.url);
        var msg = 'There was no response from the server at ' + self.url + '. Check the url and internet connectivity.';
        if (errorCallback) {
          err.message = msg;
          errorCallback(err);
        } else {
          console.error(msg + '\n The error stack trace includes: \n' + err.stack);
        }
      };
      request.send();
    } else if (this.file !== undefined) {
      var reader = new FileReader();
      reader.onload = function () {
        if (!self.panner)
          return;
        ac.decodeAudioData(reader.result, function (buff) {
          if (!self.panner)
            return;
          self.buffer = buff;
          self.panner.inputChannels(buff.numberOfChannels);
          if (callback) {
            callback(self);
          }
        });
      };
      reader.onerror = function (e) {
        if (!self.panner)
          return;
        if (onerror) {
          onerror(e);
        }
      };
      reader.readAsArrayBuffer(this.file);
    }
  };
  // TO DO: use this method to create a loading bar that shows progress during file upload/decode.
  p5.SoundFile.prototype._updateProgress = function (evt) {
    if (evt.lengthComputable) {
      var percentComplete = evt.loaded / evt.total * 0.99;
      this._whileLoading(percentComplete, evt);
    } else {
      // Unable to compute progress information since the total size is unknown
      this._whileLoading('size unknown');
    }
  };
  /**
   *  Returns true if the sound file finished loading successfully.
   *
   *  @method  isLoaded
   *  @return {Boolean}
   */
  p5.SoundFile.prototype.isLoaded = function () {
    if (this.buffer) {
      return true;
    } else {
      return false;
    }
  };
  /**
   * Play the p5.SoundFile
   *
   * @method play
   * @param {Number} [startTime]            (optional) schedule playback to start (in seconds from now).
   * @param {Number} [rate]             (optional) playback rate
   * @param {Number} [amp]              (optional) amplitude (volume)
   *                                     of playback
   * @param {Number} [cueStart]        (optional) cue start time in seconds
   * @param {Number} [duration]          (optional) duration of playback in seconds
   */
  p5.SoundFile.prototype.play = function (startTime, rate, amp, _cueStart, duration) {
    if (!this.output) {
      console.warn('SoundFile.play() called after dispose');
      return;
    }
    var self = this;
    var now = p5sound.audiocontext.currentTime;
    var cueStart, cueEnd;
    var time = startTime || 0;
    if (time < 0) {
      time = 0;
    }
    time = time + now;
    if (typeof rate !== 'undefined') {
      this.rate(rate);
    }
    if (typeof amp !== 'undefined') {
      this.setVolume(amp);
    }
    // TO DO: if already playing, create array of buffers for easy stop()
    if (this.buffer) {
      // reset the pause time (if it was paused)
      this._pauseTime = 0;
      // handle restart playmode
      if (this.mode === 'restart' && this.buffer && this.bufferSourceNode) {
        this.bufferSourceNode.stop(time);
        this._counterNode.stop(time);
      }
      //dont create another instance if already playing
      if (this.mode === 'untildone' && this.isPlaying()) {
        return;
      }
      // make a new source and counter. They are automatically assigned playbackRate and buffer
      this.bufferSourceNode = this._initSourceNode();
      // garbage collect counterNode and create a new one
      delete this._counterNode;
      this._counterNode = this._initCounterNode();
      if (_cueStart) {
        if (_cueStart >= 0 && _cueStart < this.buffer.duration) {
          // this.startTime = cueStart;
          cueStart = _cueStart;
        } else {
          throw 'start time out of range';
        }
      } else {
        cueStart = 0;
      }
      if (duration) {
        // if duration is greater than buffer.duration, just play entire file anyway rather than throw an error
        duration = duration <= this.buffer.duration - cueStart ? duration : this.buffer.duration;
      }
      // if it was paused, play at the pause position
      if (this._paused) {
        this.bufferSourceNode.start(time, this.pauseTime, duration);
        this._counterNode.start(time, this.pauseTime, duration);
      } else {
        this.bufferSourceNode.start(time, cueStart, duration);
        this._counterNode.start(time, cueStart, duration);
      }
      this._playing = true;
      this._paused = false;
      // add source to sources array, which is used in stopAll()
      this.bufferSourceNodes.push(this.bufferSourceNode);
      this.bufferSourceNode._arrayIndex = this.bufferSourceNodes.length - 1;
      this.bufferSourceNode.addEventListener('ended', this._clearOnEnd);
    } else {
      throw 'not ready to play file, buffer has yet to load. Try preload()';
    }
    // if looping, will restart at original time
    this.bufferSourceNode.loop = this._looping;
    this._counterNode.loop = this._looping;
    if (this._looping === true) {
      cueEnd = duration ? duration : cueStart - 1e-15;
      this.bufferSourceNode.loopStart = cueStart;
      this.bufferSourceNode.loopEnd = cueEnd;
      this._counterNode.loopStart = cueStart;
      this._counterNode.loopEnd = cueEnd;
    }
  };
  /**
   *  p5.SoundFile has two play modes: <code>restart</code> and
   *  <code>sustain</code>. Play Mode determines what happens to a
   *  p5.SoundFile if it is triggered while in the middle of playback.
   *  In sustain mode, playback will continue simultaneous to the
   *  new playback. In restart mode, play() will stop playback
   *  and start over. With untilDone, a sound will play only if it's
   *  not already playing. Sustain is the default mode.
   *
   *  @method  playMode
   *  @param  {String} str 'restart' or 'sustain' or 'untilDone'
   *  @example
   *  <div><code>
   *  var mySound;
   *  function preload(){
   *    mySound = loadSound('assets/Damscray_DancingTiger.mp3');
   *  }
   *  function mouseClicked() {
   *    mySound.playMode('sustain');
   *    mySound.play();
   *  }
   *  function keyPressed() {
   *    mySound.playMode('restart');
   *    mySound.play();
   *  }
   *
   * </code></div>
   */
  p5.SoundFile.prototype.playMode = function (str) {
    var s = str.toLowerCase();
    // if restart, stop all other sounds from playing
    if (s === 'restart' && this.buffer && this.bufferSourceNode) {
      for (var i = 0; i < this.bufferSourceNodes.length - 1; i++) {
        var now = p5sound.audiocontext.currentTime;
        this.bufferSourceNodes[i].stop(now);
      }
    }
    // set play mode to effect future playback
    if (s === 'restart' || s === 'sustain' || s === 'untildone') {
      this.mode = s;
    } else {
      throw 'Invalid play mode. Must be either "restart" or "sustain"';
    }
  };
  /**
   *  Pauses a file that is currently playing. If the file is not
   *  playing, then nothing will happen.
   *
   *  After pausing, .play() will resume from the paused
   *  position.
   *  If p5.SoundFile had been set to loop before it was paused,
   *  it will continue to loop after it is unpaused with .play().
   *
   *  @method pause
   *  @param {Number} [startTime] (optional) schedule event to occur
   *                               seconds from now
   *  @example
   *  <div><code>
   *  var soundFile;
   *
   *  function preload() {
   *    soundFormats('ogg', 'mp3');
   *    soundFile = loadSound('assets/Damscray_-_Dancing_Tiger_02.mp3');
   *  }
   *  function setup() {
   *    background(0, 255, 0);
   *    soundFile.setVolume(0.1);
   *    soundFile.loop();
   *  }
   *  function keyTyped() {
   *    if (key == 'p') {
   *      soundFile.pause();
   *      background(255, 0, 0);
   *    }
   *  }
   *
   *  function keyReleased() {
   *    if (key == 'p') {
   *      soundFile.play();
   *      background(0, 255, 0);
   *    }
   *  }
   *  </code>
   *  </div>
   */
  p5.SoundFile.prototype.pause = function (startTime) {
    var now = p5sound.audiocontext.currentTime;
    var time = startTime || 0;
    var pTime = time + now;
    if (this.isPlaying() && this.buffer && this.bufferSourceNode) {
      this.pauseTime = this.currentTime();
      this.bufferSourceNode.stop(pTime);
      this._counterNode.stop(pTime);
      this._paused = true;
      this._playing = false;
      this._pauseTime = this.currentTime();
    } else {
      this._pauseTime = 0;
    }
  };
  /**
   * Loop the p5.SoundFile. Accepts optional parameters to set the
   * playback rate, playback volume, loopStart, loopEnd.
   *
   * @method loop
   * @param {Number} [startTime] (optional) schedule event to occur
   *                             seconds from now
   * @param {Number} [rate]        (optional) playback rate
   * @param {Number} [amp]         (optional) playback volume
   * @param {Number} [cueLoopStart] (optional) startTime in seconds
   * @param {Number} [duration]  (optional) loop duration in seconds
   */
  p5.SoundFile.prototype.loop = function (startTime, rate, amp, loopStart, duration) {
    this._looping = true;
    this.play(startTime, rate, amp, loopStart, duration);
  };
  /**
   * Set a p5.SoundFile's looping flag to true or false. If the sound
   * is currently playing, this change will take effect when it
   * reaches the end of the current playback.
   *
   * @method setLoop
   * @param {Boolean} Boolean   set looping to true or false
   */
  p5.SoundFile.prototype.setLoop = function (bool) {
    if (bool === true) {
      this._looping = true;
    } else if (bool === false) {
      this._looping = false;
    } else {
      throw 'Error: setLoop accepts either true or false';
    }
    if (this.bufferSourceNode) {
      this.bufferSourceNode.loop = this._looping;
      this._counterNode.loop = this._looping;
    }
  };
  /**
   * Returns 'true' if a p5.SoundFile is currently looping and playing, 'false' if not.
   *
   * @method isLooping
   * @return {Boolean}
   */
  p5.SoundFile.prototype.isLooping = function () {
    if (!this.bufferSourceNode) {
      return false;
    }
    if (this._looping === true && this.isPlaying() === true) {
      return true;
    }
    return false;
  };
  /**
   *  Returns true if a p5.SoundFile is playing, false if not (i.e.
   *  paused or stopped).
   *
   *  @method isPlaying
   *  @return {Boolean}
   */
  p5.SoundFile.prototype.isPlaying = function () {
    return this._playing;
  };
  /**
   *  Returns true if a p5.SoundFile is paused, false if not (i.e.
   *  playing or stopped).
   *
   *  @method  isPaused
   *  @return {Boolean}
   */
  p5.SoundFile.prototype.isPaused = function () {
    return this._paused;
  };
  /**
   * Stop soundfile playback.
   *
   * @method stop
   * @param {Number} [startTime] (optional) schedule event to occur
   *                             in seconds from now
   */
  p5.SoundFile.prototype.stop = function (timeFromNow) {
    var time = timeFromNow || 0;
    if (this.mode === 'sustain' || this.mode === 'untildone') {
      this.stopAll(time);
      this._playing = false;
      this.pauseTime = 0;
      this._paused = false;
    } else if (this.buffer && this.bufferSourceNode) {
      var now = p5sound.audiocontext.currentTime;
      var t = time || 0;
      this.pauseTime = 0;
      this.bufferSourceNode.stop(now + t);
      this._counterNode.stop(now + t);
      this._playing = false;
      this._paused = false;
    }
  };
  /**
   *  Stop playback on all of this soundfile's sources.
   *  @private
   */
  p5.SoundFile.prototype.stopAll = function (_time) {
    var now = p5sound.audiocontext.currentTime;
    var time = _time || 0;
    if (this.buffer && this.bufferSourceNode) {
      for (var i in this.bufferSourceNodes) {
        const bufferSourceNode = this.bufferSourceNodes[i];
        if (!!bufferSourceNode) {
          try {
            bufferSourceNode.stop(now + time);
          } catch (e) {
          }
        }
      }
      this._counterNode.stop(now + time);
      this._onended(this);
    }
  };
  /**
   *  Multiply the output volume (amplitude) of a sound file
   *  between 0.0 (silence) and 1.0 (full volume).
   *  1.0 is the maximum amplitude of a digital sound, so multiplying
   *  by greater than 1.0 may cause digital distortion. To
   *  fade, provide a <code>rampTime</code> parameter. For more
   *  complex fades, see the Envelope class.
   *
   *  Alternately, you can pass in a signal source such as an
   *  oscillator to modulate the amplitude with an audio signal.
   *
   *  @method  setVolume
   *  @param {Number|Object} volume  Volume (amplitude) between 0.0
   *                                     and 1.0 or modulating signal/oscillator
   *  @param {Number} [rampTime]  Fade for t seconds
   *  @param {Number} [timeFromNow]  Schedule this event to happen at
   *                                 t seconds in the future
   */
  p5.SoundFile.prototype.setVolume = function (vol, _rampTime, _tFromNow) {
    if (typeof vol === 'number') {
      var rampTime = _rampTime || 0;
      var tFromNow = _tFromNow || 0;
      var now = p5sound.audiocontext.currentTime;
      var currentVol = this.output.gain.value;
      this.output.gain.cancelScheduledValues(now + tFromNow);
      this.output.gain.linearRampToValueAtTime(currentVol, now + tFromNow);
      this.output.gain.linearRampToValueAtTime(vol, now + tFromNow + rampTime);
    } else if (vol) {
      vol.connect(this.output.gain);
    } else {
      // return the Gain Node
      return this.output.gain;
    }
  };
  // same as setVolume, to match Processing Sound
  p5.SoundFile.prototype.amp = p5.SoundFile.prototype.setVolume;
  // these are the same thing
  p5.SoundFile.prototype.fade = p5.SoundFile.prototype.setVolume;
  p5.SoundFile.prototype.getVolume = function () {
    return this.output.gain.value;
  };
  /**
   * Set the stereo panning of a p5.sound object to
   * a floating point number between -1.0 (left) and 1.0 (right).
   * Default is 0.0 (center).
   *
   * @method pan
   * @param {Number} [panValue]     Set the stereo panner
   * @param {Number} [timeFromNow]  schedule this event to happen
   *                                 seconds from now
   * @example
   * <div><code>
   *
   *  var ball = {};
   *  var soundFile;
   *
   *  function preload() {
   *    soundFormats('ogg', 'mp3');
   *    soundFile = loadSound('assets/beatbox.mp3');
   *  }
   *
   *  function draw() {
   *    background(0);
   *    ball.x = constrain(mouseX, 0, width);
   *    ellipse(ball.x, height/2, 20, 20)
   *  }
   *
   *  function mousePressed(){
   *    // map the ball's x location to a panning degree
   *    // between -1.0 (left) and 1.0 (right)
   *    var panning = map(ball.x, 0., width,-1.0, 1.0);
   *    soundFile.pan(panning);
   *    soundFile.play();
   *  }
   *  </div></code>
   */
  p5.SoundFile.prototype.pan = function (pval, tFromNow) {
    this.panPosition = pval;
    this.panner.pan(pval, tFromNow);
  };
  /**
   * Returns the current stereo pan position (-1.0 to 1.0)
   *
   * @method getPan
   * @return {Number} Returns the stereo pan setting of the Oscillator
   *                          as a number between -1.0 (left) and 1.0 (right).
   *                          0.0 is center and default.
   */
  p5.SoundFile.prototype.getPan = function () {
    return this.panPosition;
  };
  /**
   *  Set the playback rate of a sound file. Will change the speed and the pitch.
   *  Values less than zero will reverse the audio buffer.
   *
   *  @method rate
   *  @param {Number} [playbackRate]     Set the playback rate. 1.0 is normal,
   *                                     .5 is half-speed, 2.0 is twice as fast.
   *                                     Values less than zero play backwards.
   *  @example
   *  <div><code>
   *  var song;
   *
   *  function preload() {
   *    song = loadSound('assets/Damscray_DancingTiger.mp3');
   *  }
   *
   *  function setup() {
   *    song.loop();
   *  }
   *
   *  function draw() {
   *    background(200);
   *
   *    // Set the rate to a range between 0.1 and 4
   *    // Changing the rate also alters the pitch
   *    var speed = map(mouseY, 0.1, height, 0, 2);
   *    speed = constrain(speed, 0.01, 4);
   *    song.rate(speed);
   *
   *    // Draw a circle to show what is going on
   *    stroke(0);
   *    fill(51, 100);
   *    ellipse(mouseX, 100, 48, 48);
   *  }
   *
   * </code>
   * </div>
   *
   */
  p5.SoundFile.prototype.rate = function (playbackRate) {
    var reverse = false;
    if (typeof playbackRate === 'undefined') {
      return this.playbackRate;
    }
    this.playbackRate = playbackRate;
    if (playbackRate === 0) {
      playbackRate = 1e-13;
    } else if (playbackRate < 0 && !this.reversed) {
      playbackRate = Math.abs(playbackRate);
      reverse = true;
    } else if (playbackRate > 0 && this.reversed) {
      reverse = true;
    }
    if (this.bufferSourceNode) {
      var now = p5sound.audiocontext.currentTime;
      this.bufferSourceNode.playbackRate.cancelScheduledValues(now);
      this.bufferSourceNode.playbackRate.linearRampToValueAtTime(Math.abs(playbackRate), now);
      this._counterNode.playbackRate.cancelScheduledValues(now);
      this._counterNode.playbackRate.linearRampToValueAtTime(Math.abs(playbackRate), now);
    }
    if (reverse) {
      this.reverseBuffer();
    }
    return this.playbackRate;
  };
  // TO DO: document this
  p5.SoundFile.prototype.setPitch = function (num) {
    var newPlaybackRate = midiToFreq(num) / midiToFreq(60);
    this.rate(newPlaybackRate);
  };
  p5.SoundFile.prototype.getPlaybackRate = function () {
    return this.playbackRate;
  };
  /**
   * Returns the duration of a sound file in seconds.
   *
   * @method duration
   * @return {Number} The duration of the soundFile in seconds.
   */
  p5.SoundFile.prototype.duration = function () {
    // Return Duration
    if (this.buffer) {
      return this.buffer.duration;
    } else {
      return 0;
    }
  };
  /**
   * Return the current position of the p5.SoundFile playhead, in seconds.
   * Time is relative to the normal buffer direction, so if `reverseBuffer`
   * has been called, currentTime will count backwards.
   *
   * @method currentTime
   * @return {Number}   currentTime of the soundFile in seconds.
   */
  p5.SoundFile.prototype.currentTime = function () {
    return this.reversed ? Math.abs(this._lastPos - this.buffer.length) / ac.sampleRate : this._lastPos / ac.sampleRate;
  };
  /**
   * Move the playhead of the song to a position, in seconds. Start timing
   * and playback duration. If none are given, will reset the file to play
   * entire duration from start to finish.
   *
   * @method jump
   * @param {Number} cueTime    cueTime of the soundFile in seconds.
   * @param {Number} duration    duration in seconds.
   */
  p5.SoundFile.prototype.jump = function (cueTime, duration) {
    if (cueTime < 0 || cueTime > this.buffer.duration) {
      throw 'jump time out of range';
    }
    if (duration > this.buffer.duration - cueTime) {
      throw 'end time out of range';
    }
    var cTime = cueTime || 0;
    var dur = duration || undefined;
    if (this.isPlaying()) {
      this.stop(0);
    }
    this.play(0, this.playbackRate, this.output.gain.value, cTime, dur);
  };
  /**
  * Return the number of channels in a sound file.
  * For example, Mono = 1, Stereo = 2.
  *
  * @method channels
  * @return {Number} [channels]
  */
  p5.SoundFile.prototype.channels = function () {
    return this.buffer.numberOfChannels;
  };
  /**
  * Return the sample rate of the sound file.
  *
  * @method sampleRate
  * @return {Number} [sampleRate]
  */
  p5.SoundFile.prototype.sampleRate = function () {
    return this.buffer.sampleRate;
  };
  /**
  * Return the number of samples in a sound file.
  * Equal to sampleRate * duration.
  *
  * @method frames
  * @return {Number} [sampleCount]
  */
  p5.SoundFile.prototype.frames = function () {
    return this.buffer.length;
  };
  /**
   * Returns an array of amplitude peaks in a p5.SoundFile that can be
   * used to draw a static waveform. Scans through the p5.SoundFile's
   * audio buffer to find the greatest amplitudes. Accepts one
   * parameter, 'length', which determines size of the array.
   * Larger arrays result in more precise waveform visualizations.
   *
   * Inspired by Wavesurfer.js.
   *
   * @method  getPeaks
   * @params {Number} [length] length is the size of the returned array.
   *                          Larger length results in more precision.
   *                          Defaults to 5*width of the browser window.
   * @returns {Float32Array} Array of peaks.
   */
  p5.SoundFile.prototype.getPeaks = function (length) {
    if (this.buffer) {
      // set length to window's width if no length is provided
      if (!length) {
        length = window.width * 5;
      }
      if (this.buffer) {
        var buffer = this.buffer;
        var sampleSize = buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = buffer.numberOfChannels;
        var peaks = new Float32Array(Math.round(length));
        for (var c = 0; c < channels; c++) {
          var chan = buffer.getChannelData(c);
          for (var i = 0; i < length; i++) {
            var start = ~~(i * sampleSize);
            var end = ~~(start + sampleSize);
            var max = 0;
            for (var j = start; j < end; j += sampleStep) {
              var value = chan[j];
              if (value > max) {
                max = value;
              } else if (-value > max) {
                max = value;
              }
            }
            if (c === 0 || Math.abs(max) > peaks[i]) {
              peaks[i] = max;
            }
          }
        }
        return peaks;
      }
    } else {
      throw 'Cannot load peaks yet, buffer is not loaded';
    }
  };
  /**
   *  Reverses the p5.SoundFile's buffer source.
   *  Playback must be handled separately (see example).
   *
   *  @method  reverseBuffer
   *  @example
   *  <div><code>
   *  var drum;
   *
   *  function preload() {
   *    drum = loadSound('assets/drum.mp3');
   *  }
   *
   *  function setup() {
   *    drum.reverseBuffer();
   *    drum.play();
   *  }
   *
   * </code>
   * </div>
   */
  p5.SoundFile.prototype.reverseBuffer = function () {
    if (this.buffer) {
      var currentPos = this._lastPos / ac.sampleRate;
      var curVol = this.getVolume();
      this.setVolume(0, 0.001);
      const numChannels = this.buffer.numberOfChannels;
      for (var i = 0; i < numChannels; i++) {
        this.buffer.getChannelData(i).reverse();
      }
      // set reversed flag
      this.reversed = !this.reversed;
      if (currentPos) {
        this.jump(this.duration() - currentPos);
      }
      this.setVolume(curVol, 0.001);
    } else {
      throw 'SoundFile is not done loading';
    }
  };
  /**
   *  Schedule an event to be called when the soundfile
   *  reaches the end of a buffer. If the soundfile is
   *  playing through once, this will be called when it
   *  ends. If it is looping, it will be called when
   *  stop is called.
   *
   *  @method  onended
   *  @param  {Function} callback function to call when the
   *                              soundfile has ended.
   */
  p5.SoundFile.prototype.onended = function (callback) {
    this._onended = callback;
    return this;
  };
  p5.SoundFile.prototype.add = function () {
  };
  p5.SoundFile.prototype.dispose = function () {
    var now = p5sound.audiocontext.currentTime;
    // remove reference to soundfile
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    this.stop(now);
    if (this.buffer && this.bufferSourceNode) {
      for (var i = 0; i < this.bufferSourceNodes.length - 1; i++) {
        if (this.bufferSourceNodes[i] !== null) {
          this.bufferSourceNodes[i].disconnect();
          try {
            this.bufferSourceNodes[i].stop(now);
          } catch (e) {
            console.warning('no buffer source node to dispose');
          }
          this.bufferSourceNodes[i] = null;
        }
      }
      if (this.isPlaying()) {
        try {
          this._counterNode.stop(now);
        } catch (e) {
          console.log(e);
        }
        this._counterNode = null;
      }
    }
    if (this.output) {
      this.output.disconnect();
      this.output = null;
    }
    if (this.panner) {
      this.panner.disconnect();
      this.panner = null;
    }
  };
  /**
   * Connects the output of a p5sound object to input of another
   * p5.sound object. For example, you may connect a p5.SoundFile to an
   * FFT or an Effect. If no parameter is given, it will connect to
   * the master output. Most p5sound objects connect to the master
   * output when they are created.
   *
   * @method connect
   * @param {Object} [object] Audio object that accepts an input
   */
  p5.SoundFile.prototype.connect = function (unit) {
    if (!unit) {
      this.panner.connect(p5sound.input);
    } else {
      if (unit.hasOwnProperty('input')) {
        this.panner.connect(unit.input);
      } else {
        this.panner.connect(unit);
      }
    }
  };
  /**
   * Disconnects the output of this p5sound object.
   *
   * @method disconnect
   */
  p5.SoundFile.prototype.disconnect = function () {
    if (this.panner) {
      this.panner.disconnect();
    }
  };
  /**
   */
  p5.SoundFile.prototype.getLevel = function () {
    console.warn('p5.SoundFile.getLevel has been removed from the library. Use p5.Amplitude instead');
  };
  /**
   *  Reset the source for this SoundFile to a
   *  new path (URL).
   *
   *  @method  setPath
   *  @param {String}   path     path to audio file
   *  @param {Function} callback Callback
   */
  p5.SoundFile.prototype.setPath = function (p, callback) {
    var path = p5.prototype._checkFileFormats(p);
    this.url = path;
    this.load(callback);
  };
  /**
   *  Replace the current Audio Buffer with a new Buffer.
   *
   *  @method setBuffer
   *  @param {Array} buf Array of Float32 Array(s). 2 Float32 Arrays
   *                     will create a stereo source. 1 will create
   *                     a mono source.
   */
  p5.SoundFile.prototype.setBuffer = function (buf) {
    var numChannels = buf.length;
    var size = buf[0].length;
    var newBuffer = ac.createBuffer(numChannels, size, ac.sampleRate);
    if (!(buf[0] instanceof Float32Array)) {
      buf[0] = new Float32Array(buf[0]);
    }
    for (var channelNum = 0; channelNum < numChannels; channelNum++) {
      var channel = newBuffer.getChannelData(channelNum);
      channel.set(buf[channelNum]);
    }
    this.buffer = newBuffer;
    // set numbers of channels on input to the panner
    this.panner.inputChannels(numChannels);
  };
  //////////////////////////////////////////////////
  // script processor node with an empty buffer to help
  // keep a sample-accurate position in playback buffer.
  // Inspired by Chinmay Pendharkar's technique for Sonoport --> http://bit.ly/1HwdCsV
  // Copyright [2015] [Sonoport (Asia) Pte. Ltd.],
  // Licensed under the Apache License http://apache.org/licenses/LICENSE-2.0
  ////////////////////////////////////////////////////////////////////////////////////
  var _createCounterBuffer = function (buffer) {
    const len = buffer.length;
    const audioBuf = ac.createBuffer(1, buffer.length, ac.sampleRate);
    const arrayBuffer = audioBuf.getChannelData(0);
    for (var index = 0; index < len; index++) {
      arrayBuffer[index] = index;
    }
    return audioBuf;
  };
  // initialize counterNode, set its initial buffer and playbackRate
  p5.SoundFile.prototype._initCounterNode = function () {
    var self = this;
    var now = ac.currentTime;
    var cNode = ac.createBufferSource();
    // dispose of scope node if it already exists
    if (self._scopeNode) {
      self._scopeNode.disconnect();
      self._scopeNode.removeEventListener('audioprocess', self._onAudioProcess);
      delete self._scopeNode;
    }
    self._scopeNode = ac.createScriptProcessor(256, 1, 1);
    // create counter buffer of the same length as self.buffer
    cNode.buffer = _createCounterBuffer(self.buffer);
    cNode.playbackRate.setValueAtTime(self.playbackRate, now);
    cNode.connect(self._scopeNode);
    self._scopeNode.connect(p5.soundOut._silentNode);
    self._scopeNode.addEventListener('audioprocess', self._onAudioProcess);
    return cNode;
  };
  // initialize sourceNode, set its initial buffer and playbackRate
  p5.SoundFile.prototype._initSourceNode = function () {
    var bufferSourceNode = ac.createBufferSource();
    bufferSourceNode.buffer = this.buffer;
    bufferSourceNode.playbackRate.value = this.playbackRate;
    bufferSourceNode.connect(this.output);
    return bufferSourceNode;
  };
  /**
   *  processPeaks returns an array of timestamps where it thinks there is a beat.
   *
   *  This is an asynchronous function that processes the soundfile in an offline audio context,
   *  and sends the results to your callback function.
   *
   *  The process involves running the soundfile through a lowpass filter, and finding all of the
   *  peaks above the initial threshold. If the total number of peaks are below the minimum number of peaks,
   *  it decreases the threshold and re-runs the analysis until either minPeaks or minThreshold are reached.
   *
   *  @method  processPeaks
   *  @param  {Function} callback       a function to call once this data is returned
   *  @param  {Number}   [initThreshold] initial threshold defaults to 0.9
   *  @param  {Number}   [minThreshold]   minimum threshold defaults to 0.22
   *  @param  {Number}   [minPeaks]       minimum number of peaks defaults to 200
   *  @return {Array}                  Array of timestamped peaks
   */
  p5.SoundFile.prototype.processPeaks = function (callback, _initThreshold, _minThreshold, _minPeaks) {
    var bufLen = this.buffer.length;
    var sampleRate = this.buffer.sampleRate;
    var buffer = this.buffer;
    var allPeaks = [];
    var initialThreshold = _initThreshold || 0.9, threshold = initialThreshold, minThreshold = _minThreshold || 0.22, minPeaks = _minPeaks || 200;
    // Create offline context
    var offlineContext = new window.OfflineAudioContext(1, bufLen, sampleRate);
    // create buffer source
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;
    // Create filter. TO DO: allow custom setting of filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = 'lowpass';
    source.connect(filter);
    filter.connect(offlineContext.destination);
    // start playing at time:0
    source.start(0);
    offlineContext.startRendering();
    // Render the song
    // act on the result
    offlineContext.oncomplete = function (e) {
      if (!self.panner)
        return;
      var filteredBuffer = e.renderedBuffer;
      var bufferData = filteredBuffer.getChannelData(0);
      // step 1:
      // create Peak instances, add them to array, with strength and sampleIndex
      do {
        allPeaks = getPeaksAtThreshold(bufferData, threshold);
        threshold -= 0.005;
      } while (Object.keys(allPeaks).length < minPeaks && threshold >= minThreshold);
      // step 2:
      // find intervals for each peak in the sampleIndex, add tempos array
      var intervalCounts = countIntervalsBetweenNearbyPeaks(allPeaks);
      // step 3: find top tempos
      var groups = groupNeighborsByTempo(intervalCounts, filteredBuffer.sampleRate);
      // sort top intervals
      var topTempos = groups.sort(function (intA, intB) {
        return intB.count - intA.count;
      }).splice(0, 5);
      // set this SoundFile's tempo to the top tempo ??
      this.tempo = topTempos[0].tempo;
      // step 4:
      // new array of peaks at top tempo within a bpmVariance
      var bpmVariance = 5;
      var tempoPeaks = getPeaksAtTopTempo(allPeaks, topTempos[0].tempo, filteredBuffer.sampleRate, bpmVariance);
      callback(tempoPeaks);
    };
  };
  // process peaks
  var Peak = function (amp, i) {
    this.sampleIndex = i;
    this.amplitude = amp;
    this.tempos = [];
    this.intervals = [];
  };
  // 1. for processPeaks() Function to identify peaks above a threshold
  // returns an array of peak indexes as frames (samples) of the original soundfile
  function getPeaksAtThreshold(data, threshold) {
    var peaksObj = {};
    var length = data.length;
    for (var i = 0; i < length; i++) {
      if (data[i] > threshold) {
        var amp = data[i];
        var peak = new Peak(amp, i);
        peaksObj[i] = peak;
        // Skip forward ~ 1/8s to get past this peak.
        i += 6000;
      }
      i++;
    }
    return peaksObj;
  }
  // 2. for processPeaks()
  function countIntervalsBetweenNearbyPeaks(peaksObj) {
    var intervalCounts = [];
    var peaksArray = Object.keys(peaksObj).sort();
    for (var index = 0; index < peaksArray.length; index++) {
      // find intervals in comparison to nearby peaks
      for (var i = 0; i < 10; i++) {
        var startPeak = peaksObj[peaksArray[index]];
        var endPeak = peaksObj[peaksArray[index + i]];
        if (startPeak && endPeak) {
          var startPos = startPeak.sampleIndex;
          var endPos = endPeak.sampleIndex;
          var interval = endPos - startPos;
          // add a sample interval to the startPeak in the allPeaks array
          if (interval > 0) {
            startPeak.intervals.push(interval);
          }
          // tally the intervals and return interval counts
          var foundInterval = intervalCounts.some(function (intervalCount) {
            if (intervalCount.interval === interval) {
              intervalCount.count++;
              return intervalCount;
            }
          });
          // store with JSON like formatting
          if (!foundInterval) {
            intervalCounts.push({
              interval: interval,
              count: 1
            });
          }
        }
      }
    }
    return intervalCounts;
  }
  // 3. for processPeaks --> find tempo
  function groupNeighborsByTempo(intervalCounts, sampleRate) {
    var tempoCounts = [];
    intervalCounts.forEach(function (intervalCount) {
      try {
        // Convert an interval to tempo
        var theoreticalTempo = Math.abs(60 / (intervalCount.interval / sampleRate));
        theoreticalTempo = mapTempo(theoreticalTempo);
        var foundTempo = tempoCounts.some(function (tempoCount) {
          if (tempoCount.tempo === theoreticalTempo)
            return tempoCount.count += intervalCount.count;
        });
        if (!foundTempo) {
          if (isNaN(theoreticalTempo)) {
            return;
          }
          tempoCounts.push({
            tempo: Math.round(theoreticalTempo),
            count: intervalCount.count
          });
        }
      } catch (e) {
        throw e;
      }
    });
    return tempoCounts;
  }
  // 4. for processPeaks - get peaks at top tempo
  function getPeaksAtTopTempo(peaksObj, tempo, sampleRate, bpmVariance) {
    var peaksAtTopTempo = [];
    var peaksArray = Object.keys(peaksObj).sort();
    // TO DO: filter out peaks that have the tempo and return
    for (var i = 0; i < peaksArray.length; i++) {
      var key = peaksArray[i];
      var peak = peaksObj[key];
      for (var j = 0; j < peak.intervals.length; j++) {
        var intervalBPM = Math.round(Math.abs(60 / (peak.intervals[j] / sampleRate)));
        intervalBPM = mapTempo(intervalBPM);
        if (Math.abs(intervalBPM - tempo) < bpmVariance) {
          // convert sampleIndex to seconds
          peaksAtTopTempo.push(peak.sampleIndex / sampleRate);
        }
      }
    }
    // filter out peaks that are very close to each other
    peaksAtTopTempo = peaksAtTopTempo.filter(function (peakTime, index, arr) {
      var dif = arr[index + 1] - peakTime;
      if (dif > 0.01) {
        return true;
      }
    });
    return peaksAtTopTempo;
  }
  // helper function for processPeaks
  function mapTempo(theoreticalTempo) {
    // these scenarios create infinite while loop
    if (!isFinite(theoreticalTempo) || theoreticalTempo === 0) {
      return;
    }
    // Adjust the tempo to fit within the 90-180 BPM range
    while (theoreticalTempo < 90)
      theoreticalTempo *= 2;
    while (theoreticalTempo > 180 && theoreticalTempo > 90)
      theoreticalTempo /= 2;
    return theoreticalTempo;
  }
  /*** SCHEDULE EVENTS ***/
  // Cue inspired by JavaScript setTimeout, and the
  // Tone.js Transport Timeline Event, MIT License Yotam Mann 2015 tonejs.org
  var Cue = function (callback, time, id, val) {
    this.callback = callback;
    this.time = time;
    this.id = id;
    this.val = val;
  };
  /**
   *  Schedule events to trigger every time a MediaElement
   *  (audio/video) reaches a playback cue point.
   *
   *  Accepts a callback function, a time (in seconds) at which to trigger
   *  the callback, and an optional parameter for the callback.
   *
   *  Time will be passed as the first parameter to the callback function,
   *  and param will be the second parameter.
   *
   *
   *  @method  addCue
   *  @param {Number}   time     Time in seconds, relative to this media
   *                             element's playback. For example, to trigger
   *                             an event every time playback reaches two
   *                             seconds, pass in the number 2. This will be
   *                             passed as the first parameter to
   *                             the callback function.
   *  @param {Function} callback Name of a function that will be
   *                             called at the given time. The callback will
   *                             receive time and (optionally) param as its
   *                             two parameters.
   *  @param {Object} [value]    An object to be passed as the
   *                             second parameter to the
   *                             callback function.
   *  @return {Number} id ID of this cue,
   *                      useful for removeCue(id)
   *  @example
   *  <div><code>
   *  var mySound;
   *  function preload() {
   *    mySound = loadSound('assets/beat.mp3');
   *  }
   *
   *  function setup() {
   *    background(0);
   *    noStroke();
   *    fill(255);
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    // schedule calls to changeText
   *    mySound.addCue(0.50, changeText, "hello" );
   *    mySound.addCue(1.00, changeText, "p5" );
   *    mySound.addCue(1.50, changeText, "what" );
   *    mySound.addCue(2.00, changeText, "do" );
   *    mySound.addCue(2.50, changeText, "you" );
   *    mySound.addCue(3.00, changeText, "want" );
   *    mySound.addCue(4.00, changeText, "to" );
   *    mySound.addCue(5.00, changeText, "make" );
   *    mySound.addCue(6.00, changeText, "?" );
   *  }
   *
   *  function changeText(val) {
   *    background(0);
   *    text(val, width/2, height/2);
   *  }
   *
   *  function mouseClicked() {
   *    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *      if (mySound.isPlaying() ) {
   *        mySound.stop();
   *      } else {
   *        mySound.play();
   *      }
   *    }
   *  }
   *  </code></div>
   */
  p5.SoundFile.prototype.addCue = function (time, callback, val) {
    var id = this._cueIDCounter++;
    var cue = new Cue(callback, time, id, val);
    this._cues.push(cue);
    // if (!this.elt.ontimeupdate) {
    //   this.elt.ontimeupdate = this._onTimeUpdate.bind(this);
    // }
    return id;
  };
  /**
   *  Remove a callback based on its ID. The ID is returned by the
   *  addCue method.
   *
   *  @method removeCue
   *  @param  {Number} id ID of the cue, as returned by addCue
   */
  p5.SoundFile.prototype.removeCue = function (id) {
    var cueLength = this._cues.length;
    for (var i = 0; i < cueLength; i++) {
      var cue = this._cues[i];
      if (cue.id === id) {
        this._cues.splice(i, 1);
        break;
      }
    }
    if (this._cues.length === 0) {
    }
  };
  /**
   *  Remove all of the callbacks that had originally been scheduled
   *  via the addCue method.
   *
   *  @method  clearCues
   */
  p5.SoundFile.prototype.clearCues = function () {
    this._cues = [];
  };
  // private method that checks for cues to be fired if events
  // have been scheduled using addCue(callback, time).
  p5.SoundFile.prototype._onTimeUpdate = function (position) {
    var playbackTime = position / this.buffer.sampleRate;
    var cueLength = this._cues.length;
    for (var i = 0; i < cueLength; i++) {
      var cue = this._cues[i];
      var callbackTime = cue.time;
      var val = cue.val;
      if (this._prevTime < callbackTime && callbackTime <= playbackTime) {
        // pass the scheduled callbackTime as parameter to the callback
        cue.callback(val);
      }
    }
    this._prevTime = playbackTime;
  };
  /**
   * Save a p5.SoundFile as a .wav file. The browser will prompt the user
   * to download the file to their device. To upload a file to a server, see
   * <a href="/docs/reference/#/p5.SoundFile/getBlob">getBlob</a>
   * 
   * @method save
   * @param  {String} [fileName]      name of the resulting .wav file.
   * @example
   *  <div><code>
   *  var inp, button, mySound;
   *  var fileName = 'cool';
   *  function preload() {
   *    mySound = loadSound('assets/doorbell.mp3');
   *  }
   *  function setup() {
   *    btn = createButton('click to save file');
   *    btn.position(0, 0);
   *    btn.mouseClicked(handleMouseClick);
   *  }
   *
   *  function handleMouseClick() {
   *    mySound.save(fileName);
   *  }
   * </code></div>
   */
  p5.SoundFile.prototype.save = function (fileName) {
    const dataView = convertToWav(this.buffer);
    p5.prototype.saveSound([dataView], fileName, 'wav');
  };
  /**
   * This method is useful for sending a SoundFile to a server. It returns the
   * .wav-encoded audio data as a "<a target="_blank" title="Blob reference at
   * MDN" href="https://developer.mozilla.org/en-US/docs/Web/API/Blob">Blob</a>".
   * A Blob is a file-like data object that can be uploaded to a server
   * with an <a href="/docs/reference/#/p5/httpDo">http</a> request. We'll
   * use the `httpDo` options object to send a POST request with some
   * specific options: we encode the request as `multipart/form-data`,
   * and attach the blob as one of the form values using `FormData`.
   * 
   *
   * @method getBlob
   * @returns {Blob} A file-like data object
   * @example
   *  <div><code>
   *
   *  function preload() {
   *    mySound = loadSound('assets/doorbell.mp3');
   *  }
   *
   *  function setup() {
   *    noCanvas();
   *    var soundBlob = mySound.getBlob();
   *
   *    // Now we can send the blob to a server...
   *    var serverUrl = 'https://jsonplaceholder.typicode.com/posts';
   *    var httpRequestOptions = {
   *      method: 'POST',
   *      body: new FormData().append('soundBlob', soundBlob),
   *      headers: new Headers({
   *        'Content-Type': 'multipart/form-data'
   *      })
   *    };
   *    httpDo(serverUrl, httpRequestOptions);
   *
   *    // We can also create an `ObjectURL` pointing to the Blob
   *    var blobUrl = URL.createObjectURL(soundBlob);
   *
   *    // The `<Audio>` Element accepts Object URL's
   *    var htmlAudioElt = createAudio(blobUrl).showControls();
   *
   *    createDiv();
   *
   *    // The ObjectURL exists as long as this tab is open
   *    var input = createInput(blobUrl);
   *    input.attribute('readonly', true);
   *    input.mouseClicked(function() { input.elt.select() });
   *  }
   *
   * </code></div>
   */
  p5.SoundFile.prototype.getBlob = function () {
    const dataView = convertToWav(this.buffer);
    return new Blob([dataView], { type: 'audio/wav' });
  };
  // event handler to keep track of current position
  function _onAudioProcess(processEvent) {
    var inputBuffer = processEvent.inputBuffer.getChannelData(0);
    this._lastPos = inputBuffer[inputBuffer.length - 1] || 0;
    // do any callbacks that have been scheduled
    this._onTimeUpdate(self._lastPos);
  }
  // event handler to remove references to the bufferSourceNode when it is done playing
  function _clearOnEnd(e) {
    const thisBufferSourceNode = e.target;
    const soundFile = this;
    // delete this.bufferSourceNode from the sources array when it is done playing:
    thisBufferSourceNode._playing = false;
    thisBufferSourceNode.removeEventListener('ended', soundFile._clearOnEnd);
    // call the onended callback
    soundFile._onended(soundFile);
    soundFile.bufferSourceNodes.forEach(function (n, i) {
      if (n._playing === false) {
        soundFile.bufferSourceNodes.splice(i);
      }
    });
    if (soundFile.bufferSourceNodes.length === 0) {
      soundFile._playing = false;
    }
  }
}(errorHandler, master, helpers, helpers);
var amplitude;
'use strict';
amplitude = function () {
  var p5sound = master;
  /**
   *  Amplitude measures volume between 0.0 and 1.0.
   *  Listens to all p5sound by default, or use setInput()
   *  to listen to a specific sound source. Accepts an optional
   *  smoothing value, which defaults to 0.
   *
   *  @class p5.Amplitude
   *  @constructor
   *  @param {Number} [smoothing] between 0.0 and .999 to smooth
   *                             amplitude readings (defaults to 0)
   *  @example
   *  <div><code>
   *  var sound, amplitude, cnv;
   *
   *  function preload(){
   *    sound = loadSound('assets/beat.mp3');
   *  }
   *  function setup() {
   *    cnv = createCanvas(100,100);
   *    amplitude = new p5.Amplitude();
   *
   *    // start / stop the sound when canvas is clicked
   *    cnv.mouseClicked(function() {
   *      if (sound.isPlaying() ){
   *        sound.stop();
   *      } else {
   *        sound.play();
   *      }
   *    });
   *  }
   *  function draw() {
   *    background(0);
   *    fill(255);
   *    var level = amplitude.getLevel();
   *    var size = map(level, 0, 1, 0, 200);
   *    ellipse(width/2, height/2, size, size);
   *  }
   *
   *  </code></div>
   */
  p5.Amplitude = function (smoothing) {
    // Set to 2048 for now. In future iterations, this should be inherited or parsed from p5sound's default
    this.bufferSize = 2048;
    // set audio context
    this.audiocontext = p5sound.audiocontext;
    this.processor = this.audiocontext.createScriptProcessor(this.bufferSize, 2, 1);
    // for connections
    this.input = this.processor;
    this.output = this.audiocontext.createGain();
    // smoothing defaults to 0
    this.smoothing = smoothing || 0;
    // the variables to return
    this.volume = 0;
    this.average = 0;
    this.stereoVol = [
      0,
      0
    ];
    this.stereoAvg = [
      0,
      0
    ];
    this.stereoVolNorm = [
      0,
      0
    ];
    this.volMax = 0.001;
    this.normalize = false;
    this.processor.onaudioprocess = this._audioProcess.bind(this);
    this.processor.connect(this.output);
    this.output.gain.value = 0;
    // this may only be necessary because of a Chrome bug
    this.output.connect(this.audiocontext.destination);
    // connect to p5sound master output by default, unless set by input()
    p5sound.meter.connect(this.processor);
    // add this p5.SoundFile to the soundArray
    p5sound.soundArray.push(this);
  };
  /**
   *  Connects to the p5sound instance (master output) by default.
   *  Optionally, you can pass in a specific source (i.e. a soundfile).
   *
   *  @method setInput
   *  @param {soundObject|undefined} [snd] set the sound source
   *                                       (optional, defaults to
   *                                       master output)
   *  @param {Number|undefined} [smoothing] a range between 0.0 and 1.0
   *                                        to smooth amplitude readings
   *  @example
   *  <div><code>
   *  function preload(){
   *    sound1 = loadSound('assets/beat.mp3');
   *    sound2 = loadSound('assets/drum.mp3');
   *  }
   *  function setup(){
   *    amplitude = new p5.Amplitude();
   *    sound1.play();
   *    sound2.play();
   *    amplitude.setInput(sound2);
   *  }
   *  function draw() {
   *    background(0);
   *    fill(255);
   *    var level = amplitude.getLevel();
   *    var size = map(level, 0, 1, 0, 200);
   *    ellipse(width/2, height/2, size, size);
   *  }
   *  function mouseClicked(){
   *    sound1.stop();
   *    sound2.stop();
   *  }
   *  </code></div>
   */
  p5.Amplitude.prototype.setInput = function (source, smoothing) {
    p5sound.meter.disconnect();
    if (smoothing) {
      this.smoothing = smoothing;
    }
    // connect to the master out of p5s instance if no snd is provided
    if (source == null) {
      console.log('Amplitude input source is not ready! Connecting to master output instead');
      p5sound.meter.connect(this.processor);
    } else if (source instanceof p5.Signal) {
      source.output.connect(this.processor);
    } else if (source) {
      source.connect(this.processor);
      this.processor.disconnect();
      this.processor.connect(this.output);
    } else {
      p5sound.meter.connect(this.processor);
    }
  };
  p5.Amplitude.prototype.connect = function (unit) {
    if (unit) {
      if (unit.hasOwnProperty('input')) {
        this.output.connect(unit.input);
      } else {
        this.output.connect(unit);
      }
    } else {
      this.output.connect(this.panner.connect(p5sound.input));
    }
  };
  p5.Amplitude.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
  };
  // TO DO make this stereo / dependent on # of audio channels
  p5.Amplitude.prototype._audioProcess = function (event) {
    for (var channel = 0; channel < event.inputBuffer.numberOfChannels; channel++) {
      var inputBuffer = event.inputBuffer.getChannelData(channel);
      var bufLength = inputBuffer.length;
      var total = 0;
      var sum = 0;
      var x;
      for (var i = 0; i < bufLength; i++) {
        x = inputBuffer[i];
        if (this.normalize) {
          total += Math.max(Math.min(x / this.volMax, 1), -1);
          sum += Math.max(Math.min(x / this.volMax, 1), -1) * Math.max(Math.min(x / this.volMax, 1), -1);
        } else {
          total += x;
          sum += x * x;
        }
      }
      var average = total / bufLength;
      // ... then take the square root of the sum.
      var rms = Math.sqrt(sum / bufLength);
      this.stereoVol[channel] = Math.max(rms, this.stereoVol[channel] * this.smoothing);
      this.stereoAvg[channel] = Math.max(average, this.stereoVol[channel] * this.smoothing);
      this.volMax = Math.max(this.stereoVol[channel], this.volMax);
    }
    // add volume from all channels together
    var self = this;
    var volSum = this.stereoVol.reduce(function (previousValue, currentValue, index) {
      self.stereoVolNorm[index - 1] = Math.max(Math.min(self.stereoVol[index - 1] / self.volMax, 1), 0);
      self.stereoVolNorm[index] = Math.max(Math.min(self.stereoVol[index] / self.volMax, 1), 0);
      return previousValue + currentValue;
    });
    // volume is average of channels
    this.volume = volSum / this.stereoVol.length;
    // normalized value
    this.volNorm = Math.max(Math.min(this.volume / this.volMax, 1), 0);
  };
  /**
   *  Returns a single Amplitude reading at the moment it is called.
   *  For continuous readings, run in the draw loop.
   *
   *  @method getLevel
   *  @param {Number} [channel] Optionally return only channel 0 (left) or 1 (right)
   *  @return {Number}       Amplitude as a number between 0.0 and 1.0
   *  @example
   *  <div><code>
   *  function preload(){
   *    sound = loadSound('assets/beat.mp3');
   *  }
   *  function setup() {
   *    amplitude = new p5.Amplitude();
   *    sound.play();
   *  }
   *  function draw() {
   *    background(0);
   *    fill(255);
   *    var level = amplitude.getLevel();
   *    var size = map(level, 0, 1, 0, 200);
   *    ellipse(width/2, height/2, size, size);
   *  }
   *  function mouseClicked(){
   *    sound.stop();
   *  }
   *  </code></div>
   */
  p5.Amplitude.prototype.getLevel = function (channel) {
    if (typeof channel !== 'undefined') {
      if (this.normalize) {
        return this.stereoVolNorm[channel];
      } else {
        return this.stereoVol[channel];
      }
    } else if (this.normalize) {
      return this.volNorm;
    } else {
      return this.volume;
    }
  };
  /**
   * Determines whether the results of Amplitude.process() will be
   * Normalized. To normalize, Amplitude finds the difference the
   * loudest reading it has processed and the maximum amplitude of
   * 1.0. Amplitude adds this difference to all values to produce
   * results that will reliably map between 0.0 and 1.0. However,
   * if a louder moment occurs, the amount that Normalize adds to
   * all the values will change. Accepts an optional boolean parameter
   * (true or false). Normalizing is off by default.
   *
   * @method toggleNormalize
   * @param {boolean} [boolean] set normalize to true (1) or false (0)
   */
  p5.Amplitude.prototype.toggleNormalize = function (bool) {
    if (typeof bool === 'boolean') {
      this.normalize = bool;
    } else {
      this.normalize = !this.normalize;
    }
  };
  /**
   *  Smooth Amplitude analysis by averaging with the last analysis
   *  frame. Off by default.
   *
   *  @method smooth
   *  @param {Number} set smoothing from 0.0 <= 1
   */
  p5.Amplitude.prototype.smooth = function (s) {
    if (s >= 0 && s < 1) {
      this.smoothing = s;
    } else {
      console.log('Error: smoothing must be between 0 and 1');
    }
  };
  p5.Amplitude.prototype.dispose = function () {
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    if (this.input) {
      this.input.disconnect();
      delete this.input;
    }
    if (this.output) {
      this.output.disconnect();
      delete this.output;
    }
    delete this.processor;
  };
}(master);
var fft;
'use strict';
fft = function () {
  var p5sound = master;
  /**
   *  <p>FFT (Fast Fourier Transform) is an analysis algorithm that
   *  isolates individual
   *  <a href="https://en.wikipedia.org/wiki/Audio_frequency">
   *  audio frequencies</a> within a waveform.</p>
   *
   *  <p>Once instantiated, a p5.FFT object can return an array based on
   *  two types of analyses: <br> • <code>FFT.waveform()</code> computes
   *  amplitude values along the time domain. The array indices correspond
   *  to samples across a brief moment in time. Each value represents
   *  amplitude of the waveform at that sample of time.<br>
   *  • <code>FFT.analyze() </code> computes amplitude values along the
   *  frequency domain. The array indices correspond to frequencies (i.e.
   *  pitches), from the lowest to the highest that humans can hear. Each
   *  value represents amplitude at that slice of the frequency spectrum.
   *  Use with <code>getEnergy()</code> to measure amplitude at specific
   *  frequencies, or within a range of frequencies. </p>
   *
   *  <p>FFT analyzes a very short snapshot of sound called a sample
   *  buffer. It returns an array of amplitude measurements, referred
   *  to as <code>bins</code>. The array is 1024 bins long by default.
   *  You can change the bin array length, but it must be a power of 2
   *  between 16 and 1024 in order for the FFT algorithm to function
   *  correctly. The actual size of the FFT buffer is twice the
   *  number of bins, so given a standard sample rate, the buffer is
   *  2048/44100 seconds long.</p>
   *
   *
   *  @class p5.FFT
   *  @constructor
   *  @param {Number} [smoothing]   Smooth results of Freq Spectrum.
   *                                0.0 < smoothing < 1.0.
   *                                Defaults to 0.8.
   *  @param {Number} [bins]    Length of resulting array.
   *                            Must be a power of two between
   *                            16 and 1024. Defaults to 1024.
   *  @example
   *  <div><code>
   *  function preload(){
   *    sound = loadSound('assets/Damscray_DancingTiger.mp3');
   *  }
   *
   *  function setup(){
   *    var cnv = createCanvas(100,100);
   *    cnv.mouseClicked(togglePlay);
   *    fft = new p5.FFT();
   *    sound.amp(0.2);
   *  }
   *
   *  function draw(){
   *    background(0);
   *
   *    var spectrum = fft.analyze();
   *    noStroke();
   *    fill(0,255,0); // spectrum is green
   *    for (var i = 0; i< spectrum.length; i++){
   *      var x = map(i, 0, spectrum.length, 0, width);
   *      var h = -height + map(spectrum[i], 0, 255, height, 0);
   *      rect(x, height, width / spectrum.length, h )
   *    }
   *
   *    var waveform = fft.waveform();
   *    noFill();
   *    beginShape();
   *    stroke(255,0,0); // waveform is red
   *    strokeWeight(1);
   *    for (var i = 0; i< waveform.length; i++){
   *      var x = map(i, 0, waveform.length, 0, width);
   *      var y = map( waveform[i], -1, 1, 0, height);
   *      vertex(x,y);
   *    }
   *    endShape();
   *
   *    text('click to play/pause', 4, 10);
   *  }
   *
   *  // fade sound if mouse is over canvas
   *  function togglePlay() {
   *    if (sound.isPlaying()) {
   *      sound.pause();
   *    } else {
   *      sound.loop();
   *    }
   *  }
   *  </code></div>
   */
  p5.FFT = function (smoothing, bins) {
    this.input = this.analyser = p5sound.audiocontext.createAnalyser();
    Object.defineProperties(this, {
      bins: {
        get: function () {
          return this.analyser.fftSize / 2;
        },
        set: function (b) {
          this.analyser.fftSize = b * 2;
        },
        configurable: true,
        enumerable: true
      },
      smoothing: {
        get: function () {
          return this.analyser.smoothingTimeConstant;
        },
        set: function (s) {
          this.analyser.smoothingTimeConstant = s;
        },
        configurable: true,
        enumerable: true
      }
    });
    // set default smoothing and bins
    this.smooth(smoothing);
    this.bins = bins || 1024;
    // default connections to p5sound fftMeter
    p5sound.fftMeter.connect(this.analyser);
    this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount);
    // predefined frequency ranges, these will be tweakable
    this.bass = [
      20,
      140
    ];
    this.lowMid = [
      140,
      400
    ];
    this.mid = [
      400,
      2600
    ];
    this.highMid = [
      2600,
      5200
    ];
    this.treble = [
      5200,
      14000
    ];
    // add this p5.SoundFile to the soundArray
    p5sound.soundArray.push(this);
  };
  /**
   *  Set the input source for the FFT analysis. If no source is
   *  provided, FFT will analyze all sound in the sketch.
   *
   *  @method  setInput
   *  @param {Object} [source] p5.sound object (or web audio API source node)
   */
  p5.FFT.prototype.setInput = function (source) {
    if (!source) {
      p5sound.fftMeter.connect(this.analyser);
    } else {
      if (source.output) {
        source.output.connect(this.analyser);
      } else if (source.connect) {
        source.connect(this.analyser);
      }
      p5sound.fftMeter.disconnect();
    }
  };
  /**
   *  Returns an array of amplitude values (between -1.0 and +1.0) that represent
   *  a snapshot of amplitude readings in a single buffer. Length will be
   *  equal to bins (defaults to 1024). Can be used to draw the waveform
   *  of a sound.
   *
   *  @method waveform
   *  @param {Number} [bins]    Must be a power of two between
   *                            16 and 1024. Defaults to 1024.
   *  @param {String} [precision] If any value is provided, will return results
   *                              in a Float32 Array which is more precise
   *                              than a regular array.
   *  @return {Array}  Array    Array of amplitude values (-1 to 1)
   *                            over time. Array length = bins.
   *
   */
  p5.FFT.prototype.waveform = function () {
    var bins, mode, normalArray;
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'number') {
        bins = arguments[i];
        this.analyser.fftSize = bins * 2;
      }
      if (typeof arguments[i] === 'string') {
        mode = arguments[i];
      }
    }
    // getFloatFrequencyData doesnt work in Safari as of 5/2015
    if (mode && !p5.prototype._isSafari()) {
      timeToFloat(this, this.timeDomain);
      this.analyser.getFloatTimeDomainData(this.timeDomain);
      return this.timeDomain;
    } else {
      timeToInt(this, this.timeDomain);
      this.analyser.getByteTimeDomainData(this.timeDomain);
      var normalArray = new Array();
      for (var j = 0; j < this.timeDomain.length; j++) {
        var scaled = p5.prototype.map(this.timeDomain[j], 0, 255, -1, 1);
        normalArray.push(scaled);
      }
      return normalArray;
    }
  };
  /**
   *  Returns an array of amplitude values (between 0 and 255)
   *  across the frequency spectrum. Length is equal to FFT bins
   *  (1024 by default). The array indices correspond to frequencies
   *  (i.e. pitches), from the lowest to the highest that humans can
   *  hear. Each value represents amplitude at that slice of the
   *  frequency spectrum. Must be called prior to using
   *  <code>getEnergy()</code>.
   *
   *  @method analyze
   *  @param {Number} [bins]    Must be a power of two between
   *                             16 and 1024. Defaults to 1024.
   *  @param {Number} [scale]    If "dB," returns decibel
   *                             float measurements between
   *                             -140 and 0 (max).
   *                             Otherwise returns integers from 0-255.
   *  @return {Array} spectrum    Array of energy (amplitude/volume)
   *                              values across the frequency spectrum.
   *                              Lowest energy (silence) = 0, highest
   *                              possible is 255.
   *  @example
   *  <div><code>
   *  var osc;
   *  var fft;
   *
   *  function setup(){
   *    createCanvas(100,100);
   *    osc = new p5.Oscillator();
   *    osc.amp(0);
   *    osc.start();
   *    fft = new p5.FFT();
   *  }
   *
   *  function draw(){
   *    background(0);
   *
   *    var freq = map(mouseX, 0, 800, 20, 15000);
   *    freq = constrain(freq, 1, 20000);
   *    osc.freq(freq);
   *
   *    var spectrum = fft.analyze();
   *    noStroke();
   *    fill(0,255,0); // spectrum is green
   *    for (var i = 0; i< spectrum.length; i++){
   *      var x = map(i, 0, spectrum.length, 0, width);
   *      var h = -height + map(spectrum[i], 0, 255, height, 0);
   *      rect(x, height, width / spectrum.length, h );
   *    }
   *
   *    stroke(255);
   *    text('Freq: ' + round(freq)+'Hz', 10, 10);
   *
   *    isMouseOverCanvas();
   *  }
   *
   *  // only play sound when mouse is over canvas
   *  function isMouseOverCanvas() {
   *    var mX = mouseX, mY = mouseY;
   *    if (mX > 0 && mX < width && mY < height && mY > 0) {
   *      osc.amp(0.5, 0.2);
   *    } else {
   *      osc.amp(0, 0.2);
   *    }
   *  }
   *  </code></div>
   *
   *
   */
  p5.FFT.prototype.analyze = function () {
    var mode;
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'number') {
        this.bins = arguments[i];
        this.analyser.fftSize = this.bins * 2;
      }
      if (typeof arguments[i] === 'string') {
        mode = arguments[i];
      }
    }
    if (mode && mode.toLowerCase() === 'db') {
      freqToFloat(this);
      this.analyser.getFloatFrequencyData(this.freqDomain);
      return this.freqDomain;
    } else {
      freqToInt(this, this.freqDomain);
      this.analyser.getByteFrequencyData(this.freqDomain);
      var normalArray = Array.apply([], this.freqDomain);
      normalArray.length === this.analyser.fftSize;
      normalArray.constructor === Array;
      return normalArray;
    }
  };
  /**
   *  Returns the amount of energy (volume) at a specific
   *  <a href="https://en.wikipedia.org/wiki/Audio_frequency" target="_blank">
   *  frequency</a>, or the average amount of energy between two
   *  frequencies. Accepts Number(s) corresponding
   *  to frequency (in Hz), or a String corresponding to predefined
   *  frequency ranges ("bass", "lowMid", "mid", "highMid", "treble").
   *  Returns a range between 0 (no energy/volume at that frequency) and
   *  255 (maximum energy).
   *  <em>NOTE: analyze() must be called prior to getEnergy(). Analyze()
   *  tells the FFT to analyze frequency data, and getEnergy() uses
   *  the results determine the value at a specific frequency or
   *  range of frequencies.</em></p>
   *
   *  @method  getEnergy
   *  @param  {Number|String} frequency1   Will return a value representing
   *                                energy at this frequency. Alternately,
   *                                the strings "bass", "lowMid" "mid",
   *                                "highMid", and "treble" will return
   *                                predefined frequency ranges.
   *  @param  {Number} [frequency2] If a second frequency is given,
   *                                will return average amount of
   *                                energy that exists between the
   *                                two frequencies.
   *  @return {Number}   Energy   Energy (volume/amplitude) from
   *                              0 and 255.
   *
   */
  p5.FFT.prototype.getEnergy = function (frequency1, frequency2) {
    var nyquist = p5sound.audiocontext.sampleRate / 2;
    if (frequency1 === 'bass') {
      frequency1 = this.bass[0];
      frequency2 = this.bass[1];
    } else if (frequency1 === 'lowMid') {
      frequency1 = this.lowMid[0];
      frequency2 = this.lowMid[1];
    } else if (frequency1 === 'mid') {
      frequency1 = this.mid[0];
      frequency2 = this.mid[1];
    } else if (frequency1 === 'highMid') {
      frequency1 = this.highMid[0];
      frequency2 = this.highMid[1];
    } else if (frequency1 === 'treble') {
      frequency1 = this.treble[0];
      frequency2 = this.treble[1];
    }
    if (typeof frequency1 !== 'number') {
      throw 'invalid input for getEnergy()';
    } else if (!frequency2) {
      // if only one parameter:
      var index = Math.round(frequency1 / nyquist * this.freqDomain.length);
      return this.freqDomain[index];
    } else if (frequency1 && frequency2) {
      // if two parameters:
      // if second is higher than first
      if (frequency1 > frequency2) {
        var swap = frequency2;
        frequency2 = frequency1;
        frequency1 = swap;
      }
      var lowIndex = Math.round(frequency1 / nyquist * this.freqDomain.length);
      var highIndex = Math.round(frequency2 / nyquist * this.freqDomain.length);
      var total = 0;
      var numFrequencies = 0;
      // add up all of the values for the frequencies
      for (var i = lowIndex; i <= highIndex; i++) {
        total += this.freqDomain[i];
        numFrequencies += 1;
      }
      // divide by total number of frequencies
      var toReturn = total / numFrequencies;
      return toReturn;
    } else {
      throw 'invalid input for getEnergy()';
    }
  };
  // compatability with v.012, changed to getEnergy in v.0121. Will be deprecated...
  p5.FFT.prototype.getFreq = function (freq1, freq2) {
    console.log('getFreq() is deprecated. Please use getEnergy() instead.');
    var x = this.getEnergy(freq1, freq2);
    return x;
  };
  /**
     *  Returns the
     *  <a href="http://en.wikipedia.org/wiki/Spectral_centroid" target="_blank">
     *  spectral centroid</a> of the input signal.
     *  <em>NOTE: analyze() must be called prior to getCentroid(). Analyze()
     *  tells the FFT to analyze frequency data, and getCentroid() uses
     *  the results determine the spectral centroid.</em></p>
     *
     *  @method  getCentroid
     *  @return {Number}   Spectral Centroid Frequency   Frequency of the spectral centroid in Hz.
     *
     *
     * @example
     *  <div><code>
     *
     *
     *function setup(){
     *  cnv = createCanvas(100,100);
     *  sound = new p5.AudioIn();
     *  sound.start();
     *  fft = new p5.FFT();
     *  sound.connect(fft);
     *}
     *
     *
     *function draw(){
     *
     *  var centroidplot = 0.0;
     *  var spectralCentroid = 0;
     *
     *
     *  background(0);
     *  stroke(0,255,0);
     *  var spectrum = fft.analyze();
     *  fill(0,255,0); // spectrum is green
     *
     *  //draw the spectrum
     *  for (var i = 0; i< spectrum.length; i++){
     *    var x = map(log(i), 0, log(spectrum.length), 0, width);
     *    var h = map(spectrum[i], 0, 255, 0, height);
     *    var rectangle_width = (log(i+1)-log(i))*(width/log(spectrum.length));
     *    rect(x, height, rectangle_width, -h )
     *  }
  
     *  var nyquist = 22050;
     *
     *  // get the centroid
     *  spectralCentroid = fft.getCentroid();
     *
     *  // the mean_freq_index calculation is for the display.
     *  var mean_freq_index = spectralCentroid/(nyquist/spectrum.length);
     *
     *  centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);
     *
     *
     *  stroke(255,0,0); // the line showing where the centroid is will be red
     *
     *  rect(centroidplot, 0, width / spectrum.length, height)
     *  noStroke();
     *  fill(255,255,255);  // text is white
     *  text("centroid: ", 10, 20);
     *  text(round(spectralCentroid)+" Hz", 10, 40);
     *}
     * </code></div>
     */
  p5.FFT.prototype.getCentroid = function () {
    var nyquist = p5sound.audiocontext.sampleRate / 2;
    var cumulative_sum = 0;
    var centroid_normalization = 0;
    for (var i = 0; i < this.freqDomain.length; i++) {
      cumulative_sum += i * this.freqDomain[i];
      centroid_normalization += this.freqDomain[i];
    }
    var mean_freq_index = 0;
    if (centroid_normalization !== 0) {
      mean_freq_index = cumulative_sum / centroid_normalization;
    }
    var spec_centroid_freq = mean_freq_index * (nyquist / this.freqDomain.length);
    return spec_centroid_freq;
  };
  /**
   *  Smooth FFT analysis by averaging with the last analysis frame.
   *
   *  @method smooth
   *  @param {Number} smoothing    0.0 < smoothing < 1.0.
   *                               Defaults to 0.8.
   */
  p5.FFT.prototype.smooth = function (s) {
    if (typeof s !== 'undefined') {
      this.smoothing = s;
    }
    return this.smoothing;
  };
  p5.FFT.prototype.dispose = function () {
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    if (this.analyser) {
      this.analyser.disconnect();
      delete this.analyser;
    }
  };
  /**
   *  Returns an array of average amplitude values for a given number
   *  of frequency bands split equally. N defaults to 16.
   *  <em>NOTE: analyze() must be called prior to linAverages(). Analyze()
   *  tells the FFT to analyze frequency data, and linAverages() uses
   *  the results to group them into a smaller set of averages.</em></p>
   *
   *  @method  linAverages
   *  @param  {Number}  N                Number of returned frequency groups
   *  @return {Array}   linearAverages   Array of average amplitude values for each group
   */
  p5.FFT.prototype.linAverages = function (N) {
    var N = N || 16;
    // This prevents undefined, null or 0 values of N
    var spectrum = this.freqDomain;
    var spectrumLength = spectrum.length;
    var spectrumStep = Math.floor(spectrumLength / N);
    var linearAverages = new Array(N);
    // Keep a second index for the current average group and place the values accordingly
    // with only one loop in the spectrum data
    var groupIndex = 0;
    for (var specIndex = 0; specIndex < spectrumLength; specIndex++) {
      linearAverages[groupIndex] = linearAverages[groupIndex] !== undefined ? (linearAverages[groupIndex] + spectrum[specIndex]) / 2 : spectrum[specIndex];
      // Increase the group index when the last element of the group is processed
      if (specIndex % spectrumStep === spectrumStep - 1) {
        groupIndex++;
      }
    }
    return linearAverages;
  };
  /**
   *  Returns an array of average amplitude values of the spectrum, for a given
   *  set of <a href="https://en.wikipedia.org/wiki/Octave_band" target="_blank">
   *  Octave Bands</a>
   *  <em>NOTE: analyze() must be called prior to logAverages(). Analyze()
   *  tells the FFT to analyze frequency data, and logAverages() uses
   *  the results to group them into a smaller set of averages.</em></p>
   *
   *  @method  logAverages
   *  @param  {Array}   octaveBands    Array of Octave Bands objects for grouping
   *  @return {Array}   logAverages    Array of average amplitude values for each group
   */
  p5.FFT.prototype.logAverages = function (octaveBands) {
    var nyquist = p5sound.audiocontext.sampleRate / 2;
    var spectrum = this.freqDomain;
    var spectrumLength = spectrum.length;
    var logAverages = new Array(octaveBands.length);
    // Keep a second index for the current average group and place the values accordingly
    // With only one loop in the spectrum data
    var octaveIndex = 0;
    for (var specIndex = 0; specIndex < spectrumLength; specIndex++) {
      var specIndexFrequency = Math.round(specIndex * nyquist / this.freqDomain.length);
      // Increase the group index if the current frequency exceeds the limits of the band
      if (specIndexFrequency > octaveBands[octaveIndex].hi) {
        octaveIndex++;
      }
      logAverages[octaveIndex] = logAverages[octaveIndex] !== undefined ? (logAverages[octaveIndex] + spectrum[specIndex]) / 2 : spectrum[specIndex];
    }
    return logAverages;
  };
  /**
   *  Calculates and Returns the 1/N
   *  <a href="https://en.wikipedia.org/wiki/Octave_band" target="_blank">Octave Bands</a>
   *  N defaults to 3 and minimum central frequency to 15.625Hz.
   *  (1/3 Octave Bands ~= 31 Frequency Bands)
   *  Setting fCtr0 to a central value of a higher octave will ignore the lower bands
   *  and produce less frequency groups.
   *
   *  @method   getOctaveBands
   *  @param  {Number}  N             Specifies the 1/N type of generated octave bands
   *  @param  {Number}  fCtr0         Minimum central frequency for the lowest band
   *  @return {Array}   octaveBands   Array of octave band objects with their bounds
   */
  p5.FFT.prototype.getOctaveBands = function (N, fCtr0) {
    var N = N || 3;
    // Default to 1/3 Octave Bands
    var fCtr0 = fCtr0 || 15.625;
    // Minimum central frequency, defaults to 15.625Hz
    var octaveBands = [];
    var lastFrequencyBand = {
      lo: fCtr0 / Math.pow(2, 1 / (2 * N)),
      ctr: fCtr0,
      hi: fCtr0 * Math.pow(2, 1 / (2 * N))
    };
    octaveBands.push(lastFrequencyBand);
    var nyquist = p5sound.audiocontext.sampleRate / 2;
    while (lastFrequencyBand.hi < nyquist) {
      var newFrequencyBand = {};
      newFrequencyBand.lo = lastFrequencyBand.hi;
      newFrequencyBand.ctr = lastFrequencyBand.ctr * Math.pow(2, 1 / N);
      newFrequencyBand.hi = newFrequencyBand.ctr * Math.pow(2, 1 / (2 * N));
      octaveBands.push(newFrequencyBand);
      lastFrequencyBand = newFrequencyBand;
    }
    return octaveBands;
  };
  // helper methods to convert type from float (dB) to int (0-255)
  var freqToFloat = function (fft) {
    if (fft.freqDomain instanceof Float32Array === false) {
      fft.freqDomain = new Float32Array(fft.analyser.frequencyBinCount);
    }
  };
  var freqToInt = function (fft) {
    if (fft.freqDomain instanceof Uint8Array === false) {
      fft.freqDomain = new Uint8Array(fft.analyser.frequencyBinCount);
    }
  };
  var timeToFloat = function (fft) {
    if (fft.timeDomain instanceof Float32Array === false) {
      fft.timeDomain = new Float32Array(fft.analyser.frequencyBinCount);
    }
  };
  var timeToInt = function (fft) {
    if (fft.timeDomain instanceof Uint8Array === false) {
      fft.timeDomain = new Uint8Array(fft.analyser.frequencyBinCount);
    }
  };
}(master);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_SignalBase;
Tone_signal_SignalBase = function (Tone) {
  'use strict';
  Tone.SignalBase = function () {
  };
  Tone.extend(Tone.SignalBase);
  Tone.SignalBase.prototype.connect = function (node, outputNumber, inputNumber) {
    if (Tone.Signal && Tone.Signal === node.constructor || Tone.Param && Tone.Param === node.constructor || Tone.TimelineSignal && Tone.TimelineSignal === node.constructor) {
      node._param.cancelScheduledValues(0);
      node._param.value = 0;
      node.overridden = true;
    } else if (node instanceof AudioParam) {
      node.cancelScheduledValues(0);
      node.value = 0;
    }
    Tone.prototype.connect.call(this, node, outputNumber, inputNumber);
    return this;
  };
  return Tone.SignalBase;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_WaveShaper;
Tone_signal_WaveShaper = function (Tone) {
  'use strict';
  Tone.WaveShaper = function (mapping, bufferLen) {
    this._shaper = this.input = this.output = this.context.createWaveShaper();
    this._curve = null;
    if (Array.isArray(mapping)) {
      this.curve = mapping;
    } else if (isFinite(mapping) || this.isUndef(mapping)) {
      this._curve = new Float32Array(this.defaultArg(mapping, 1024));
    } else if (this.isFunction(mapping)) {
      this._curve = new Float32Array(this.defaultArg(bufferLen, 1024));
      this.setMap(mapping);
    }
  };
  Tone.extend(Tone.WaveShaper, Tone.SignalBase);
  Tone.WaveShaper.prototype.setMap = function (mapping) {
    for (var i = 0, len = this._curve.length; i < len; i++) {
      var normalized = i / (len - 1) * 2 - 1;
      this._curve[i] = mapping(normalized, i);
    }
    this._shaper.curve = this._curve;
    return this;
  };
  Object.defineProperty(Tone.WaveShaper.prototype, 'curve', {
    get: function () {
      return this._shaper.curve;
    },
    set: function (mapping) {
      this._curve = new Float32Array(mapping);
      this._shaper.curve = this._curve;
    }
  });
  Object.defineProperty(Tone.WaveShaper.prototype, 'oversample', {
    get: function () {
      return this._shaper.oversample;
    },
    set: function (oversampling) {
      if ([
          'none',
          '2x',
          '4x'
        ].indexOf(oversampling) !== -1) {
        this._shaper.oversample = oversampling;
      } else {
        throw new RangeError('Tone.WaveShaper: oversampling must be either \'none\', \'2x\', or \'4x\'');
      }
    }
  });
  Tone.WaveShaper.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._shaper.disconnect();
    this._shaper = null;
    this._curve = null;
    return this;
  };
  return Tone.WaveShaper;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_type_TimeBase;
Tone_type_TimeBase = function (Tone) {
  Tone.TimeBase = function (val, units) {
    if (this instanceof Tone.TimeBase) {
      this._expr = this._noOp;
      if (val instanceof Tone.TimeBase) {
        this.copy(val);
      } else if (!this.isUndef(units) || this.isNumber(val)) {
        units = this.defaultArg(units, this._defaultUnits);
        var method = this._primaryExpressions[units].method;
        this._expr = method.bind(this, val);
      } else if (this.isString(val)) {
        this.set(val);
      } else if (this.isUndef(val)) {
        this._expr = this._defaultExpr();
      }
    } else {
      return new Tone.TimeBase(val, units);
    }
  };
  Tone.extend(Tone.TimeBase);
  Tone.TimeBase.prototype.set = function (exprString) {
    this._expr = this._parseExprString(exprString);
    return this;
  };
  Tone.TimeBase.prototype.clone = function () {
    var instance = new this.constructor();
    instance.copy(this);
    return instance;
  };
  Tone.TimeBase.prototype.copy = function (time) {
    var val = time._expr();
    return this.set(val);
  };
  Tone.TimeBase.prototype._primaryExpressions = {
    'n': {
      regexp: /^(\d+)n/i,
      method: function (value) {
        value = parseInt(value);
        if (value === 1) {
          return this._beatsToUnits(this._timeSignature());
        } else {
          return this._beatsToUnits(4 / value);
        }
      }
    },
    't': {
      regexp: /^(\d+)t/i,
      method: function (value) {
        value = parseInt(value);
        return this._beatsToUnits(8 / (parseInt(value) * 3));
      }
    },
    'm': {
      regexp: /^(\d+)m/i,
      method: function (value) {
        return this._beatsToUnits(parseInt(value) * this._timeSignature());
      }
    },
    'i': {
      regexp: /^(\d+)i/i,
      method: function (value) {
        return this._ticksToUnits(parseInt(value));
      }
    },
    'hz': {
      regexp: /^(\d+(?:\.\d+)?)hz/i,
      method: function (value) {
        return this._frequencyToUnits(parseFloat(value));
      }
    },
    'tr': {
      regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
      method: function (m, q, s) {
        var total = 0;
        if (m && m !== '0') {
          total += this._beatsToUnits(this._timeSignature() * parseFloat(m));
        }
        if (q && q !== '0') {
          total += this._beatsToUnits(parseFloat(q));
        }
        if (s && s !== '0') {
          total += this._beatsToUnits(parseFloat(s) / 4);
        }
        return total;
      }
    },
    's': {
      regexp: /^(\d+(?:\.\d+)?s)/,
      method: function (value) {
        return this._secondsToUnits(parseFloat(value));
      }
    },
    'samples': {
      regexp: /^(\d+)samples/,
      method: function (value) {
        return parseInt(value) / this.context.sampleRate;
      }
    },
    'default': {
      regexp: /^(\d+(?:\.\d+)?)/,
      method: function (value) {
        return this._primaryExpressions[this._defaultUnits].method.call(this, value);
      }
    }
  };
  Tone.TimeBase.prototype._binaryExpressions = {
    '+': {
      regexp: /^\+/,
      precedence: 2,
      method: function (lh, rh) {
        return lh() + rh();
      }
    },
    '-': {
      regexp: /^\-/,
      precedence: 2,
      method: function (lh, rh) {
        return lh() - rh();
      }
    },
    '*': {
      regexp: /^\*/,
      precedence: 1,
      method: function (lh, rh) {
        return lh() * rh();
      }
    },
    '/': {
      regexp: /^\//,
      precedence: 1,
      method: function (lh, rh) {
        return lh() / rh();
      }
    }
  };
  Tone.TimeBase.prototype._unaryExpressions = {
    'neg': {
      regexp: /^\-/,
      method: function (lh) {
        return -lh();
      }
    }
  };
  Tone.TimeBase.prototype._syntaxGlue = {
    '(': { regexp: /^\(/ },
    ')': { regexp: /^\)/ }
  };
  Tone.TimeBase.prototype._tokenize = function (expr) {
    var position = -1;
    var tokens = [];
    while (expr.length > 0) {
      expr = expr.trim();
      var token = getNextToken(expr, this);
      tokens.push(token);
      expr = expr.substr(token.value.length);
    }
    function getNextToken(expr, context) {
      var expressions = [
        '_binaryExpressions',
        '_unaryExpressions',
        '_primaryExpressions',
        '_syntaxGlue'
      ];
      for (var i = 0; i < expressions.length; i++) {
        var group = context[expressions[i]];
        for (var opName in group) {
          var op = group[opName];
          var reg = op.regexp;
          var match = expr.match(reg);
          if (match !== null) {
            return {
              method: op.method,
              precedence: op.precedence,
              regexp: op.regexp,
              value: match[0]
            };
          }
        }
      }
      throw new SyntaxError('Tone.TimeBase: Unexpected token ' + expr);
    }
    return {
      next: function () {
        return tokens[++position];
      },
      peek: function () {
        return tokens[position + 1];
      }
    };
  };
  Tone.TimeBase.prototype._matchGroup = function (token, group, prec) {
    var ret = false;
    if (!this.isUndef(token)) {
      for (var opName in group) {
        var op = group[opName];
        if (op.regexp.test(token.value)) {
          if (!this.isUndef(prec)) {
            if (op.precedence === prec) {
              return op;
            }
          } else {
            return op;
          }
        }
      }
    }
    return ret;
  };
  Tone.TimeBase.prototype._parseBinary = function (lexer, precedence) {
    if (this.isUndef(precedence)) {
      precedence = 2;
    }
    var expr;
    if (precedence < 0) {
      expr = this._parseUnary(lexer);
    } else {
      expr = this._parseBinary(lexer, precedence - 1);
    }
    var token = lexer.peek();
    while (token && this._matchGroup(token, this._binaryExpressions, precedence)) {
      token = lexer.next();
      expr = token.method.bind(this, expr, this._parseBinary(lexer, precedence - 1));
      token = lexer.peek();
    }
    return expr;
  };
  Tone.TimeBase.prototype._parseUnary = function (lexer) {
    var token, expr;
    token = lexer.peek();
    var op = this._matchGroup(token, this._unaryExpressions);
    if (op) {
      token = lexer.next();
      expr = this._parseUnary(lexer);
      return op.method.bind(this, expr);
    }
    return this._parsePrimary(lexer);
  };
  Tone.TimeBase.prototype._parsePrimary = function (lexer) {
    var token, expr;
    token = lexer.peek();
    if (this.isUndef(token)) {
      throw new SyntaxError('Tone.TimeBase: Unexpected end of expression');
    }
    if (this._matchGroup(token, this._primaryExpressions)) {
      token = lexer.next();
      var matching = token.value.match(token.regexp);
      return token.method.bind(this, matching[1], matching[2], matching[3]);
    }
    if (token && token.value === '(') {
      lexer.next();
      expr = this._parseBinary(lexer);
      token = lexer.next();
      if (!(token && token.value === ')')) {
        throw new SyntaxError('Expected )');
      }
      return expr;
    }
    throw new SyntaxError('Tone.TimeBase: Cannot process token ' + token.value);
  };
  Tone.TimeBase.prototype._parseExprString = function (exprString) {
    if (!this.isString(exprString)) {
      exprString = exprString.toString();
    }
    var lexer = this._tokenize(exprString);
    var tree = this._parseBinary(lexer);
    return tree;
  };
  Tone.TimeBase.prototype._noOp = function () {
    return 0;
  };
  Tone.TimeBase.prototype._defaultExpr = function () {
    return this._noOp;
  };
  Tone.TimeBase.prototype._defaultUnits = 's';
  Tone.TimeBase.prototype._frequencyToUnits = function (freq) {
    return 1 / freq;
  };
  Tone.TimeBase.prototype._beatsToUnits = function (beats) {
    return 60 / Tone.Transport.bpm.value * beats;
  };
  Tone.TimeBase.prototype._secondsToUnits = function (seconds) {
    return seconds;
  };
  Tone.TimeBase.prototype._ticksToUnits = function (ticks) {
    return ticks * (this._beatsToUnits(1) / Tone.Transport.PPQ);
  };
  Tone.TimeBase.prototype._timeSignature = function () {
    return Tone.Transport.timeSignature;
  };
  Tone.TimeBase.prototype._pushExpr = function (val, name, units) {
    if (!(val instanceof Tone.TimeBase)) {
      val = new this.constructor(val, units);
    }
    this._expr = this._binaryExpressions[name].method.bind(this, this._expr, val._expr);
    return this;
  };
  Tone.TimeBase.prototype.add = function (val, units) {
    return this._pushExpr(val, '+', units);
  };
  Tone.TimeBase.prototype.sub = function (val, units) {
    return this._pushExpr(val, '-', units);
  };
  Tone.TimeBase.prototype.mult = function (val, units) {
    return this._pushExpr(val, '*', units);
  };
  Tone.TimeBase.prototype.div = function (val, units) {
    return this._pushExpr(val, '/', units);
  };
  Tone.TimeBase.prototype.valueOf = function () {
    return this._expr();
  };
  Tone.TimeBase.prototype.dispose = function () {
    this._expr = null;
  };
  return Tone.TimeBase;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_type_Time;
Tone_type_Time = function (Tone) {
  Tone.Time = function (val, units) {
    if (this instanceof Tone.Time) {
      this._plusNow = false;
      Tone.TimeBase.call(this, val, units);
    } else {
      return new Tone.Time(val, units);
    }
  };
  Tone.extend(Tone.Time, Tone.TimeBase);
  Tone.Time.prototype._unaryExpressions = Object.create(Tone.TimeBase.prototype._unaryExpressions);
  Tone.Time.prototype._unaryExpressions.quantize = {
    regexp: /^@/,
    method: function (rh) {
      return Tone.Transport.nextSubdivision(rh());
    }
  };
  Tone.Time.prototype._unaryExpressions.now = {
    regexp: /^\+/,
    method: function (lh) {
      this._plusNow = true;
      return lh();
    }
  };
  Tone.Time.prototype.quantize = function (subdiv, percent) {
    percent = this.defaultArg(percent, 1);
    this._expr = function (expr, subdivision, percent) {
      expr = expr();
      subdivision = subdivision.toSeconds();
      var multiple = Math.round(expr / subdivision);
      var ideal = multiple * subdivision;
      var diff = ideal - expr;
      return expr + diff * percent;
    }.bind(this, this._expr, new this.constructor(subdiv), percent);
    return this;
  };
  Tone.Time.prototype.addNow = function () {
    this._plusNow = true;
    return this;
  };
  Tone.Time.prototype._defaultExpr = function () {
    this._plusNow = true;
    return this._noOp;
  };
  Tone.Time.prototype.copy = function (time) {
    Tone.TimeBase.prototype.copy.call(this, time);
    this._plusNow = time._plusNow;
    return this;
  };
  Tone.Time.prototype.toNotation = function () {
    var time = this.toSeconds();
    var testNotations = [
      '1m',
      '2n',
      '4n',
      '8n',
      '16n',
      '32n',
      '64n',
      '128n'
    ];
    var retNotation = this._toNotationHelper(time, testNotations);
    var testTripletNotations = [
      '1m',
      '2n',
      '2t',
      '4n',
      '4t',
      '8n',
      '8t',
      '16n',
      '16t',
      '32n',
      '32t',
      '64n',
      '64t',
      '128n'
    ];
    var retTripletNotation = this._toNotationHelper(time, testTripletNotations);
    if (retTripletNotation.split('+').length < retNotation.split('+').length) {
      return retTripletNotation;
    } else {
      return retNotation;
    }
  };
  Tone.Time.prototype._toNotationHelper = function (units, testNotations) {
    var threshold = this._notationToUnits(testNotations[testNotations.length - 1]);
    var retNotation = '';
    for (var i = 0; i < testNotations.length; i++) {
      var notationTime = this._notationToUnits(testNotations[i]);
      var multiple = units / notationTime;
      var floatingPointError = 0.000001;
      if (1 - multiple % 1 < floatingPointError) {
        multiple += floatingPointError;
      }
      multiple = Math.floor(multiple);
      if (multiple > 0) {
        if (multiple === 1) {
          retNotation += testNotations[i];
        } else {
          retNotation += multiple.toString() + '*' + testNotations[i];
        }
        units -= multiple * notationTime;
        if (units < threshold) {
          break;
        } else {
          retNotation += ' + ';
        }
      }
    }
    if (retNotation === '') {
      retNotation = '0';
    }
    return retNotation;
  };
  Tone.Time.prototype._notationToUnits = function (notation) {
    var primaryExprs = this._primaryExpressions;
    var notationExprs = [
      primaryExprs.n,
      primaryExprs.t,
      primaryExprs.m
    ];
    for (var i = 0; i < notationExprs.length; i++) {
      var expr = notationExprs[i];
      var match = notation.match(expr.regexp);
      if (match) {
        return expr.method.call(this, match[1]);
      }
    }
  };
  Tone.Time.prototype.toBarsBeatsSixteenths = function () {
    var quarterTime = this._beatsToUnits(1);
    var quarters = this.toSeconds() / quarterTime;
    var measures = Math.floor(quarters / this._timeSignature());
    var sixteenths = quarters % 1 * 4;
    quarters = Math.floor(quarters) % this._timeSignature();
    sixteenths = sixteenths.toString();
    if (sixteenths.length > 3) {
      sixteenths = parseFloat(sixteenths).toFixed(3);
    }
    var progress = [
      measures,
      quarters,
      sixteenths
    ];
    return progress.join(':');
  };
  Tone.Time.prototype.toTicks = function () {
    var quarterTime = this._beatsToUnits(1);
    var quarters = this.valueOf() / quarterTime;
    return Math.floor(quarters * Tone.Transport.PPQ);
  };
  Tone.Time.prototype.toSamples = function () {
    return this.toSeconds() * this.context.sampleRate;
  };
  Tone.Time.prototype.toFrequency = function () {
    return 1 / this.toSeconds();
  };
  Tone.Time.prototype.toSeconds = function () {
    return this.valueOf();
  };
  Tone.Time.prototype.toMilliseconds = function () {
    return this.toSeconds() * 1000;
  };
  Tone.Time.prototype.valueOf = function () {
    var val = this._expr();
    return val + (this._plusNow ? this.now() : 0);
  };
  return Tone.Time;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_type_Frequency;
Tone_type_Frequency = function (Tone) {
  Tone.Frequency = function (val, units) {
    if (this instanceof Tone.Frequency) {
      Tone.TimeBase.call(this, val, units);
    } else {
      return new Tone.Frequency(val, units);
    }
  };
  Tone.extend(Tone.Frequency, Tone.TimeBase);
  Tone.Frequency.prototype._primaryExpressions = Object.create(Tone.TimeBase.prototype._primaryExpressions);
  Tone.Frequency.prototype._primaryExpressions.midi = {
    regexp: /^(\d+(?:\.\d+)?midi)/,
    method: function (value) {
      return this.midiToFrequency(value);
    }
  };
  Tone.Frequency.prototype._primaryExpressions.note = {
    regexp: /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,
    method: function (pitch, octave) {
      var index = noteToScaleIndex[pitch.toLowerCase()];
      var noteNumber = index + (parseInt(octave) + 1) * 12;
      return this.midiToFrequency(noteNumber);
    }
  };
  Tone.Frequency.prototype._primaryExpressions.tr = {
    regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
    method: function (m, q, s) {
      var total = 1;
      if (m && m !== '0') {
        total *= this._beatsToUnits(this._timeSignature() * parseFloat(m));
      }
      if (q && q !== '0') {
        total *= this._beatsToUnits(parseFloat(q));
      }
      if (s && s !== '0') {
        total *= this._beatsToUnits(parseFloat(s) / 4);
      }
      return total;
    }
  };
  Tone.Frequency.prototype.transpose = function (interval) {
    this._expr = function (expr, interval) {
      var val = expr();
      return val * this.intervalToFrequencyRatio(interval);
    }.bind(this, this._expr, interval);
    return this;
  };
  Tone.Frequency.prototype.harmonize = function (intervals) {
    this._expr = function (expr, intervals) {
      var val = expr();
      var ret = [];
      for (var i = 0; i < intervals.length; i++) {
        ret[i] = val * this.intervalToFrequencyRatio(intervals[i]);
      }
      return ret;
    }.bind(this, this._expr, intervals);
    return this;
  };
  Tone.Frequency.prototype.toMidi = function () {
    return this.frequencyToMidi(this.valueOf());
  };
  Tone.Frequency.prototype.toNote = function () {
    var freq = this.valueOf();
    var log = Math.log(freq / Tone.Frequency.A4) / Math.LN2;
    var noteNumber = Math.round(12 * log) + 57;
    var octave = Math.floor(noteNumber / 12);
    if (octave < 0) {
      noteNumber += -12 * octave;
    }
    var noteName = scaleIndexToNote[noteNumber % 12];
    return noteName + octave.toString();
  };
  Tone.Frequency.prototype.toSeconds = function () {
    return 1 / this.valueOf();
  };
  Tone.Frequency.prototype.toFrequency = function () {
    return this.valueOf();
  };
  Tone.Frequency.prototype.toTicks = function () {
    var quarterTime = this._beatsToUnits(1);
    var quarters = this.valueOf() / quarterTime;
    return Math.floor(quarters * Tone.Transport.PPQ);
  };
  Tone.Frequency.prototype._frequencyToUnits = function (freq) {
    return freq;
  };
  Tone.Frequency.prototype._ticksToUnits = function (ticks) {
    return 1 / (ticks * 60 / (Tone.Transport.bpm.value * Tone.Transport.PPQ));
  };
  Tone.Frequency.prototype._beatsToUnits = function (beats) {
    return 1 / Tone.TimeBase.prototype._beatsToUnits.call(this, beats);
  };
  Tone.Frequency.prototype._secondsToUnits = function (seconds) {
    return 1 / seconds;
  };
  Tone.Frequency.prototype._defaultUnits = 'hz';
  var noteToScaleIndex = {
    'cbb': -2,
    'cb': -1,
    'c': 0,
    'c#': 1,
    'cx': 2,
    'dbb': 0,
    'db': 1,
    'd': 2,
    'd#': 3,
    'dx': 4,
    'ebb': 2,
    'eb': 3,
    'e': 4,
    'e#': 5,
    'ex': 6,
    'fbb': 3,
    'fb': 4,
    'f': 5,
    'f#': 6,
    'fx': 7,
    'gbb': 5,
    'gb': 6,
    'g': 7,
    'g#': 8,
    'gx': 9,
    'abb': 7,
    'ab': 8,
    'a': 9,
    'a#': 10,
    'ax': 11,
    'bbb': 9,
    'bb': 10,
    'b': 11,
    'b#': 12,
    'bx': 13
  };
  var scaleIndexToNote = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
  ];
  Tone.Frequency.A4 = 440;
  Tone.Frequency.prototype.midiToFrequency = function (midi) {
    return Tone.Frequency.A4 * Math.pow(2, (midi - 69) / 12);
  };
  Tone.Frequency.prototype.frequencyToMidi = function (frequency) {
    return 69 + 12 * Math.log(frequency / Tone.Frequency.A4) / Math.LN2;
  };
  return Tone.Frequency;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_type_TransportTime;
Tone_type_TransportTime = function (Tone) {
  Tone.TransportTime = function (val, units) {
    if (this instanceof Tone.TransportTime) {
      Tone.Time.call(this, val, units);
    } else {
      return new Tone.TransportTime(val, units);
    }
  };
  Tone.extend(Tone.TransportTime, Tone.Time);
  Tone.TransportTime.prototype._unaryExpressions = Object.create(Tone.Time.prototype._unaryExpressions);
  Tone.TransportTime.prototype._unaryExpressions.quantize = {
    regexp: /^@/,
    method: function (rh) {
      var subdivision = this._secondsToTicks(rh());
      var multiple = Math.ceil(Tone.Transport.ticks / subdivision);
      return this._ticksToUnits(multiple * subdivision);
    }
  };
  Tone.TransportTime.prototype._secondsToTicks = function (seconds) {
    var quarterTime = this._beatsToUnits(1);
    var quarters = seconds / quarterTime;
    return Math.round(quarters * Tone.Transport.PPQ);
  };
  Tone.TransportTime.prototype.valueOf = function () {
    var val = this._secondsToTicks(this._expr());
    return val + (this._plusNow ? Tone.Transport.ticks : 0);
  };
  Tone.TransportTime.prototype.toTicks = function () {
    return this.valueOf();
  };
  Tone.TransportTime.prototype.toSeconds = function () {
    var val = this._expr();
    return val + (this._plusNow ? Tone.Transport.seconds : 0);
  };
  Tone.TransportTime.prototype.toFrequency = function () {
    return 1 / this.toSeconds();
  };
  return Tone.TransportTime;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_type_Type;
Tone_type_Type = function (Tone) {
  Tone.Type = {
    Default: 'number',
    Time: 'time',
    Frequency: 'frequency',
    TransportTime: 'transportTime',
    Ticks: 'ticks',
    NormalRange: 'normalRange',
    AudioRange: 'audioRange',
    Decibels: 'db',
    Interval: 'interval',
    BPM: 'bpm',
    Positive: 'positive',
    Cents: 'cents',
    Degrees: 'degrees',
    MIDI: 'midi',
    BarsBeatsSixteenths: 'barsBeatsSixteenths',
    Samples: 'samples',
    Hertz: 'hertz',
    Note: 'note',
    Milliseconds: 'milliseconds',
    Seconds: 'seconds',
    Notation: 'notation'
  };
  Tone.prototype.toSeconds = function (time) {
    if (this.isNumber(time)) {
      return time;
    } else if (this.isUndef(time)) {
      return this.now();
    } else if (this.isString(time)) {
      return new Tone.Time(time).toSeconds();
    } else if (time instanceof Tone.TimeBase) {
      return time.toSeconds();
    }
  };
  Tone.prototype.toFrequency = function (freq) {
    if (this.isNumber(freq)) {
      return freq;
    } else if (this.isString(freq) || this.isUndef(freq)) {
      return new Tone.Frequency(freq).valueOf();
    } else if (freq instanceof Tone.TimeBase) {
      return freq.toFrequency();
    }
  };
  Tone.prototype.toTicks = function (time) {
    if (this.isNumber(time) || this.isString(time)) {
      return new Tone.TransportTime(time).toTicks();
    } else if (this.isUndef(time)) {
      return Tone.Transport.ticks;
    } else if (time instanceof Tone.TimeBase) {
      return time.toTicks();
    }
  };
  return Tone;
}(Tone_core_Tone, Tone_type_Time, Tone_type_Frequency, Tone_type_TransportTime);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Param;
Tone_core_Param = function (Tone) {
  'use strict';
  Tone.Param = function () {
    var options = this.optionsObject(arguments, [
      'param',
      'units',
      'convert'
    ], Tone.Param.defaults);
    this._param = this.input = options.param;
    this.units = options.units;
    this.convert = options.convert;
    this.overridden = false;
    this._lfo = null;
    if (this.isObject(options.lfo)) {
      this.value = options.lfo;
    } else if (!this.isUndef(options.value)) {
      this.value = options.value;
    }
  };
  Tone.extend(Tone.Param);
  Tone.Param.defaults = {
    'units': Tone.Type.Default,
    'convert': true,
    'param': undefined
  };
  Object.defineProperty(Tone.Param.prototype, 'value', {
    get: function () {
      return this._toUnits(this._param.value);
    },
    set: function (value) {
      if (this.isObject(value)) {
        if (this.isUndef(Tone.LFO)) {
          throw new Error('Include \'Tone.LFO\' to use an LFO as a Param value.');
        }
        if (this._lfo) {
          this._lfo.dispose();
        }
        this._lfo = new Tone.LFO(value).start();
        this._lfo.connect(this.input);
      } else {
        var convertedVal = this._fromUnits(value);
        this._param.cancelScheduledValues(0);
        this._param.value = convertedVal;
      }
    }
  });
  Tone.Param.prototype._fromUnits = function (val) {
    if (this.convert || this.isUndef(this.convert)) {
      switch (this.units) {
      case Tone.Type.Time:
        return this.toSeconds(val);
      case Tone.Type.Frequency:
        return this.toFrequency(val);
      case Tone.Type.Decibels:
        return this.dbToGain(val);
      case Tone.Type.NormalRange:
        return Math.min(Math.max(val, 0), 1);
      case Tone.Type.AudioRange:
        return Math.min(Math.max(val, -1), 1);
      case Tone.Type.Positive:
        return Math.max(val, 0);
      default:
        return val;
      }
    } else {
      return val;
    }
  };
  Tone.Param.prototype._toUnits = function (val) {
    if (this.convert || this.isUndef(this.convert)) {
      switch (this.units) {
      case Tone.Type.Decibels:
        return this.gainToDb(val);
      default:
        return val;
      }
    } else {
      return val;
    }
  };
  Tone.Param.prototype._minOutput = 0.00001;
  Tone.Param.prototype.setValueAtTime = function (value, time) {
    value = this._fromUnits(value);
    time = this.toSeconds(time);
    if (time <= this.now() + this.blockTime) {
      this._param.value = value;
    } else {
      this._param.setValueAtTime(value, time);
    }
    return this;
  };
  Tone.Param.prototype.setRampPoint = function (now) {
    now = this.defaultArg(now, this.now());
    var currentVal = this._param.value;
    if (currentVal === 0) {
      currentVal = this._minOutput;
    }
    this._param.setValueAtTime(currentVal, now);
    return this;
  };
  Tone.Param.prototype.linearRampToValueAtTime = function (value, endTime) {
    value = this._fromUnits(value);
    this._param.linearRampToValueAtTime(value, this.toSeconds(endTime));
    return this;
  };
  Tone.Param.prototype.exponentialRampToValueAtTime = function (value, endTime) {
    value = this._fromUnits(value);
    value = Math.max(this._minOutput, value);
    this._param.exponentialRampToValueAtTime(value, this.toSeconds(endTime));
    return this;
  };
  Tone.Param.prototype.exponentialRampToValue = function (value, rampTime, startTime) {
    startTime = this.toSeconds(startTime);
    this.setRampPoint(startTime);
    this.exponentialRampToValueAtTime(value, startTime + this.toSeconds(rampTime));
    return this;
  };
  Tone.Param.prototype.linearRampToValue = function (value, rampTime, startTime) {
    startTime = this.toSeconds(startTime);
    this.setRampPoint(startTime);
    this.linearRampToValueAtTime(value, startTime + this.toSeconds(rampTime));
    return this;
  };
  Tone.Param.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
    value = this._fromUnits(value);
    value = Math.max(this._minOutput, value);
    timeConstant = Math.max(this._minOutput, timeConstant);
    this._param.setTargetAtTime(value, this.toSeconds(startTime), timeConstant);
    return this;
  };
  Tone.Param.prototype.setValueCurveAtTime = function (values, startTime, duration) {
    for (var i = 0; i < values.length; i++) {
      values[i] = this._fromUnits(values[i]);
    }
    this._param.setValueCurveAtTime(values, this.toSeconds(startTime), this.toSeconds(duration));
    return this;
  };
  Tone.Param.prototype.cancelScheduledValues = function (startTime) {
    this._param.cancelScheduledValues(this.toSeconds(startTime));
    return this;
  };
  Tone.Param.prototype.rampTo = function (value, rampTime, startTime) {
    rampTime = this.defaultArg(rampTime, 0);
    if (this.units === Tone.Type.Frequency || this.units === Tone.Type.BPM || this.units === Tone.Type.Decibels) {
      this.exponentialRampToValue(value, rampTime, startTime);
    } else {
      this.linearRampToValue(value, rampTime, startTime);
    }
    return this;
  };
  Object.defineProperty(Tone.Param.prototype, 'lfo', {
    get: function () {
      return this._lfo;
    }
  });
  Tone.Param.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._param = null;
    if (this._lfo) {
      this._lfo.dispose();
      this._lfo = null;
    }
    return this;
  };
  return Tone.Param;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Gain;
Tone_core_Gain = function (Tone) {
  'use strict';
  if (window.GainNode && !AudioContext.prototype.createGain) {
    AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
  }
  Tone.Gain = function () {
    var options = this.optionsObject(arguments, [
      'gain',
      'units'
    ], Tone.Gain.defaults);
    this.input = this.output = this._gainNode = this.context.createGain();
    this.gain = new Tone.Param({
      'param': this._gainNode.gain,
      'units': options.units,
      'value': options.gain,
      'convert': options.convert
    });
    this._readOnly('gain');
  };
  Tone.extend(Tone.Gain);
  Tone.Gain.defaults = {
    'gain': 1,
    'convert': true
  };
  Tone.Gain.prototype.dispose = function () {
    Tone.Param.prototype.dispose.call(this);
    this._gainNode.disconnect();
    this._gainNode = null;
    this._writable('gain');
    this.gain.dispose();
    this.gain = null;
  };
  Tone.prototype.createInsOuts = function (inputs, outputs) {
    if (inputs === 1) {
      this.input = new Tone.Gain();
    } else if (inputs > 1) {
      this.input = new Array(inputs);
    }
    if (outputs === 1) {
      this.output = new Tone.Gain();
    } else if (outputs > 1) {
      this.output = new Array(inputs);
    }
  };
  return Tone.Gain;
}(Tone_core_Tone, Tone_core_Param);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Signal;
Tone_signal_Signal = function (Tone) {
  'use strict';
  Tone.Signal = function () {
    var options = this.optionsObject(arguments, [
      'value',
      'units'
    ], Tone.Signal.defaults);
    this.output = this._gain = this.context.createGain();
    options.param = this._gain.gain;
    Tone.Param.call(this, options);
    this.input = this._param = this._gain.gain;
    this.context.getConstant(1).chain(this._gain);
  };
  Tone.extend(Tone.Signal, Tone.Param);
  Tone.Signal.defaults = {
    'value': 0,
    'units': Tone.Type.Default,
    'convert': true
  };
  Tone.Signal.prototype.connect = Tone.SignalBase.prototype.connect;
  Tone.Signal.prototype.dispose = function () {
    Tone.Param.prototype.dispose.call(this);
    this._param = null;
    this._gain.disconnect();
    this._gain = null;
    return this;
  };
  return Tone.Signal;
}(Tone_core_Tone, Tone_signal_WaveShaper, Tone_type_Type, Tone_core_Param);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Add;
Tone_signal_Add = function (Tone) {
  'use strict';
  Tone.Add = function (value) {
    this.createInsOuts(2, 0);
    this._sum = this.input[0] = this.input[1] = this.output = new Tone.Gain();
    this._param = this.input[1] = new Tone.Signal(value);
    this._param.connect(this._sum);
  };
  Tone.extend(Tone.Add, Tone.Signal);
  Tone.Add.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._sum.dispose();
    this._sum = null;
    this._param.dispose();
    this._param = null;
    return this;
  };
  return Tone.Add;
}(Tone_core_Tone, Tone_signal_Signal);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Multiply;
Tone_signal_Multiply = function (Tone) {
  'use strict';
  Tone.Multiply = function (value) {
    this.createInsOuts(2, 0);
    this._mult = this.input[0] = this.output = new Tone.Gain();
    this._param = this.input[1] = this.output.gain;
    this._param.value = this.defaultArg(value, 0);
  };
  Tone.extend(Tone.Multiply, Tone.Signal);
  Tone.Multiply.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._mult.dispose();
    this._mult = null;
    this._param = null;
    return this;
  };
  return Tone.Multiply;
}(Tone_core_Tone, Tone_signal_Signal);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Scale;
Tone_signal_Scale = function (Tone) {
  'use strict';
  Tone.Scale = function (outputMin, outputMax) {
    this._outputMin = this.defaultArg(outputMin, 0);
    this._outputMax = this.defaultArg(outputMax, 1);
    this._scale = this.input = new Tone.Multiply(1);
    this._add = this.output = new Tone.Add(0);
    this._scale.connect(this._add);
    this._setRange();
  };
  Tone.extend(Tone.Scale, Tone.SignalBase);
  Object.defineProperty(Tone.Scale.prototype, 'min', {
    get: function () {
      return this._outputMin;
    },
    set: function (min) {
      this._outputMin = min;
      this._setRange();
    }
  });
  Object.defineProperty(Tone.Scale.prototype, 'max', {
    get: function () {
      return this._outputMax;
    },
    set: function (max) {
      this._outputMax = max;
      this._setRange();
    }
  });
  Tone.Scale.prototype._setRange = function () {
    this._add.value = this._outputMin;
    this._scale.value = this._outputMax - this._outputMin;
  };
  Tone.Scale.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._add.dispose();
    this._add = null;
    this._scale.dispose();
    this._scale = null;
    return this;
  };
  return Tone.Scale;
}(Tone_core_Tone, Tone_signal_Add, Tone_signal_Multiply);
var signal;
'use strict';
signal = function () {
  // Signal is built with the Tone.js signal by Yotam Mann
  // https://github.com/TONEnoTONE/Tone.js/
  var Signal = Tone_signal_Signal;
  var Add = Tone_signal_Add;
  var Mult = Tone_signal_Multiply;
  var Scale = Tone_signal_Scale;
  /**
   *  <p>p5.Signal is a constant audio-rate signal used by p5.Oscillator
   *  and p5.Envelope for modulation math.</p>
   *
   *  <p>This is necessary because Web Audio is processed on a seprate clock.
   *  For example, the p5 draw loop runs about 60 times per second. But
   *  the audio clock must process samples 44100 times per second. If we
   *  want to add a value to each of those samples, we can't do it in the
   *  draw loop, but we can do it by adding a constant-rate audio signal.</p.
   *
   *  <p>This class mostly functions behind the scenes in p5.sound, and returns
   *  a Tone.Signal from the Tone.js library by Yotam Mann.
   *  If you want to work directly with audio signals for modular
   *  synthesis, check out
   *  <a href='http://bit.ly/1oIoEng' target=_'blank'>tone.js.</a></p>
   *
   *  @class  p5.Signal
   *  @constructor
   *  @return {Tone.Signal} A Signal object from the Tone.js library
   *  @example
   *  <div><code>
   *  function setup() {
   *    carrier = new p5.Oscillator('sine');
   *    carrier.amp(1); // set amplitude
   *    carrier.freq(220); // set frequency
   *    carrier.start(); // start oscillating
   *
   *    modulator = new p5.Oscillator('sawtooth');
   *    modulator.disconnect();
   *    modulator.amp(1);
   *    modulator.freq(4);
   *    modulator.start();
   *
   *    // Modulator's default amplitude range is -1 to 1.
   *    // Multiply it by -200, so the range is -200 to 200
   *    // then add 220 so the range is 20 to 420
   *    carrier.freq( modulator.mult(-200).add(220) );
   *  }
   *  </code></div>
   */
  p5.Signal = function (value) {
    var s = new Signal(value);
    // p5sound.soundArray.push(s);
    return s;
  };
  /**
   *  Fade to value, for smooth transitions
   *
   *  @method  fade
   *  @param  {Number} value          Value to set this signal
   *  @param  {Number} [secondsFromNow] Length of fade, in seconds from now
   */
  Signal.prototype.fade = Signal.prototype.linearRampToValueAtTime;
  Mult.prototype.fade = Signal.prototype.fade;
  Add.prototype.fade = Signal.prototype.fade;
  Scale.prototype.fade = Signal.prototype.fade;
  /**
   *  Connect a p5.sound object or Web Audio node to this
   *  p5.Signal so that its amplitude values can be scaled.
   *
   *  @method setInput
   *  @param {Object} input
   */
  Signal.prototype.setInput = function (_input) {
    _input.connect(this);
  };
  Mult.prototype.setInput = Signal.prototype.setInput;
  Add.prototype.setInput = Signal.prototype.setInput;
  Scale.prototype.setInput = Signal.prototype.setInput;
  // signals can add / mult / scale themselves
  /**
   *  Add a constant value to this audio signal,
   *  and return the resulting audio signal. Does
   *  not change the value of the original signal,
   *  instead it returns a new p5.SignalAdd.
   *
   *  @method  add
   *  @param {Number} number
   *  @return {p5.Signal} object
   */
  Signal.prototype.add = function (num) {
    var add = new Add(num);
    // add.setInput(this);
    this.connect(add);
    return add;
  };
  Mult.prototype.add = Signal.prototype.add;
  Add.prototype.add = Signal.prototype.add;
  Scale.prototype.add = Signal.prototype.add;
  /**
   *  Multiply this signal by a constant value,
   *  and return the resulting audio signal. Does
   *  not change the value of the original signal,
   *  instead it returns a new p5.SignalMult.
   *
   *  @method  mult
   *  @param {Number} number to multiply
   *  @return {p5.Signal} object
   */
  Signal.prototype.mult = function (num) {
    var mult = new Mult(num);
    // mult.setInput(this);
    this.connect(mult);
    return mult;
  };
  Mult.prototype.mult = Signal.prototype.mult;
  Add.prototype.mult = Signal.prototype.mult;
  Scale.prototype.mult = Signal.prototype.mult;
  /**
   *  Scale this signal value to a given range,
   *  and return the result as an audio signal. Does
   *  not change the value of the original signal,
   *  instead it returns a new p5.SignalScale.
   *
   *  @method  scale
   *  @param {Number} number to multiply
   *  @param  {Number} inMin  input range minumum
   *  @param  {Number} inMax  input range maximum
   *  @param  {Number} outMin input range minumum
   *  @param  {Number} outMax input range maximum
   *  @return {p5.Signal} object
   */
  Signal.prototype.scale = function (inMin, inMax, outMin, outMax) {
    var mapOutMin, mapOutMax;
    if (arguments.length === 4) {
      mapOutMin = p5.prototype.map(outMin, inMin, inMax, 0, 1) - 0.5;
      mapOutMax = p5.prototype.map(outMax, inMin, inMax, 0, 1) - 0.5;
    } else {
      mapOutMin = arguments[0];
      mapOutMax = arguments[1];
    }
    var scale = new Scale(mapOutMin, mapOutMax);
    this.connect(scale);
    return scale;
  };
  Mult.prototype.scale = Signal.prototype.scale;
  Add.prototype.scale = Signal.prototype.scale;
  Scale.prototype.scale = Signal.prototype.scale;
}(Tone_signal_Signal, Tone_signal_Add, Tone_signal_Multiply, Tone_signal_Scale);
var oscillator;
'use strict';
oscillator = function () {
  var p5sound = master;
  var Add = Tone_signal_Add;
  var Mult = Tone_signal_Multiply;
  var Scale = Tone_signal_Scale;
  /**
   *  <p>Creates a signal that oscillates between -1.0 and 1.0.
   *  By default, the oscillation takes the form of a sinusoidal
   *  shape ('sine'). Additional types include 'triangle',
   *  'sawtooth' and 'square'. The frequency defaults to
   *  440 oscillations per second (440Hz, equal to the pitch of an
   *  'A' note).</p>
   *
   *  <p>Set the type of oscillation with setType(), or by instantiating a
   *  specific oscillator: <a href="/reference/#/p5.SinOsc">p5.SinOsc</a>, <a
   *  href="/reference/#/p5.TriOsc">p5.TriOsc</a>, <a
   *  href="/reference/#/p5.SqrOsc">p5.SqrOsc</a>, or <a
   *  href="/reference/#/p5.SawOsc">p5.SawOsc</a>.
   *  </p>
   *
   *  @class p5.Oscillator
   *  @constructor
   *  @param {Number} [freq] frequency defaults to 440Hz
   *  @param {String} [type] type of oscillator. Options:
   *                         'sine' (default), 'triangle',
   *                         'sawtooth', 'square'
   *  @example
   *  <div><code>
   *  var osc;
   *  var playing = false;
   *
   *  function setup() {
   *    backgroundColor = color(255,0,255);
   *    textAlign(CENTER);
   *
   *    osc = new p5.Oscillator();
   *    osc.setType('sine');
   *    osc.freq(240);
   *    osc.amp(0);
   *    osc.start();
   *  }
   *
   *  function draw() {
   *    background(backgroundColor)
   *    text('click to play', width/2, height/2);
   *  }
   *
   *  function mouseClicked() {
   *    if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
   *      if (!playing) {
   *        // ramp amplitude to 0.5 over 0.05 seconds
   *        osc.amp(0.5, 0.05);
   *        playing = true;
   *        backgroundColor = color(0,255,255);
   *      } else {
   *        // ramp amplitude to 0 over 0.5 seconds
   *        osc.amp(0, 0.5);
   *        playing = false;
   *        backgroundColor = color(255,0,255);
   *      }
   *    }
   *  }
   *  </code> </div>
   */
  p5.Oscillator = function (freq, type) {
    if (typeof freq === 'string') {
      var f = type;
      type = freq;
      freq = f;
    }
    if (typeof type === 'number') {
      var f = type;
      type = freq;
      freq = f;
    }
    this.started = false;
    // components
    this.phaseAmount = undefined;
    this.oscillator = p5sound.audiocontext.createOscillator();
    this.f = freq || 440;
    // frequency
    this.oscillator.type = type || 'sine';
    this.oscillator.frequency.setValueAtTime(this.f, p5sound.audiocontext.currentTime);
    // connections
    this.output = p5sound.audiocontext.createGain();
    this._freqMods = [];
    // modulators connected to this oscillator's frequency
    // set default output gain to 0.5
    this.output.gain.value = 0.5;
    this.output.gain.setValueAtTime(0.5, p5sound.audiocontext.currentTime);
    this.oscillator.connect(this.output);
    // stereo panning
    this.panPosition = 0;
    this.connection = p5sound.input;
    // connect to p5sound by default
    this.panner = new p5.Panner(this.output, this.connection, 1);
    //array of math operation signal chaining
    this.mathOps = [this.output];
    // add to the soundArray so we can dispose of the osc later
    p5sound.soundArray.push(this);
  };
  /**
   *  Start an oscillator. Accepts an optional parameter to
   *  determine how long (in seconds from now) until the
   *  oscillator starts.
   *
   *  @method  start
   *  @param  {Number} [time] startTime in seconds from now.
   *  @param  {Number} [frequency] frequency in Hz.
   */
  p5.Oscillator.prototype.start = function (time, f) {
    if (this.started) {
      var now = p5sound.audiocontext.currentTime;
      this.stop(now);
    }
    if (!this.started) {
      var freq = f || this.f;
      var type = this.oscillator.type;
      // set old osc free to be garbage collected (memory)
      if (this.oscillator) {
        this.oscillator.disconnect();
        delete this.oscillator;
      }
      // var detune = this.oscillator.frequency.value;
      this.oscillator = p5sound.audiocontext.createOscillator();
      this.oscillator.frequency.value = Math.abs(freq);
      this.oscillator.type = type;
      // this.oscillator.detune.value = detune;
      this.oscillator.connect(this.output);
      time = time || 0;
      this.oscillator.start(time + p5sound.audiocontext.currentTime);
      this.freqNode = this.oscillator.frequency;
      // if other oscillators are already connected to this osc's freq
      for (var i in this._freqMods) {
        if (typeof this._freqMods[i].connect !== 'undefined') {
          this._freqMods[i].connect(this.oscillator.frequency);
        }
      }
      this.started = true;
    }
  };
  /**
   *  Stop an oscillator. Accepts an optional parameter
   *  to determine how long (in seconds from now) until the
   *  oscillator stops.
   *
   *  @method  stop
   *  @param  {Number} secondsFromNow Time, in seconds from now.
   */
  p5.Oscillator.prototype.stop = function (time) {
    if (this.started) {
      var t = time || 0;
      var now = p5sound.audiocontext.currentTime;
      this.oscillator.stop(t + now);
      this.started = false;
    }
  };
  /**
   *  Set the amplitude between 0 and 1.0. Or, pass in an object
   *  such as an oscillator to modulate amplitude with an audio signal.
   *
   *  @method  amp
   *  @param  {Number|Object} vol between 0 and 1.0
   *                              or a modulating signal/oscillator
   *  @param {Number} [rampTime] create a fade that lasts rampTime
   *  @param {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   *  @return  {AudioParam} gain  If no value is provided,
   *                              returns the Web Audio API
   *                              AudioParam that controls
   *                              this oscillator's
   *                              gain/amplitude/volume)
   */
  p5.Oscillator.prototype.amp = function (vol, rampTime, tFromNow) {
    var self = this;
    if (typeof vol === 'number') {
      var rampTime = rampTime || 0;
      var tFromNow = tFromNow || 0;
      var now = p5sound.audiocontext.currentTime;
      this.output.gain.linearRampToValueAtTime(vol, now + tFromNow + rampTime);
    } else if (vol) {
      vol.connect(self.output.gain);
    } else {
      // return the Gain Node
      return this.output.gain;
    }
  };
  // these are now the same thing
  p5.Oscillator.prototype.fade = p5.Oscillator.prototype.amp;
  p5.Oscillator.prototype.getAmp = function () {
    return this.output.gain.value;
  };
  /**
   *  Set frequency of an oscillator to a value. Or, pass in an object
   *  such as an oscillator to modulate the frequency with an audio signal.
   *
   *  @method  freq
   *  @param  {Number|Object} Frequency Frequency in Hz
   *                                        or modulating signal/oscillator
   *  @param  {Number} [rampTime] Ramp time (in seconds)
   *  @param  {Number} [timeFromNow] Schedule this event to happen
   *                                   at x seconds from now
   *  @return  {AudioParam} Frequency If no value is provided,
   *                                  returns the Web Audio API
   *                                  AudioParam that controls
   *                                  this oscillator's frequency
   *  @example
   *  <div><code>
   *  var osc = new p5.Oscillator(300);
   *  osc.start();
   *  osc.freq(40, 10);
   *  </code></div>
   */
  p5.Oscillator.prototype.freq = function (val, rampTime, tFromNow) {
    if (typeof val === 'number' && !isNaN(val)) {
      this.f = val;
      var now = p5sound.audiocontext.currentTime;
      var rampTime = rampTime || 0;
      var tFromNow = tFromNow || 0;
      var t = now + tFromNow + rampTime;
      // var currentFreq = this.oscillator.frequency.value;
      // this.oscillator.frequency.cancelScheduledValues(now);
      if (rampTime === 0) {
        this.oscillator.frequency.setValueAtTime(val, tFromNow + now);
      } else {
        if (val > 0) {
          this.oscillator.frequency.exponentialRampToValueAtTime(val, tFromNow + rampTime + now);
        } else {
          this.oscillator.frequency.linearRampToValueAtTime(val, tFromNow + rampTime + now);
        }
      }
      // reset phase if oscillator has a phase
      if (this.phaseAmount) {
        this.phase(this.phaseAmount);
      }
    } else if (val) {
      if (val.output) {
        val = val.output;
      }
      val.connect(this.oscillator.frequency);
      // keep track of what is modulating this param
      // so it can be re-connected if
      this._freqMods.push(val);
    } else {
      // return the Frequency Node
      return this.oscillator.frequency;
    }
  };
  p5.Oscillator.prototype.getFreq = function () {
    return this.oscillator.frequency.value;
  };
  /**
   *  Set type to 'sine', 'triangle', 'sawtooth' or 'square'.
   *
   *  @method  setType
   *  @param {String} type 'sine', 'triangle', 'sawtooth' or 'square'.
   */
  p5.Oscillator.prototype.setType = function (type) {
    this.oscillator.type = type;
  };
  p5.Oscillator.prototype.getType = function () {
    return this.oscillator.type;
  };
  /**
   *  Connect to a p5.sound / Web Audio object.
   *
   *  @method  connect
   *  @param  {Object} unit A p5.sound or Web Audio object
   */
  p5.Oscillator.prototype.connect = function (unit) {
    if (!unit) {
      this.panner.connect(p5sound.input);
    } else if (unit.hasOwnProperty('input')) {
      this.panner.connect(unit.input);
      this.connection = unit.input;
    } else {
      this.panner.connect(unit);
      this.connection = unit;
    }
  };
  /**
   *  Disconnect all outputs
   *
   *  @method  disconnect
   */
  p5.Oscillator.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
    if (this.panner) {
      this.panner.disconnect();
      if (this.output) {
        this.output.connect(this.panner);
      }
    }
    this.oscMods = [];
  };
  /**
   *  Pan between Left (-1) and Right (1)
   *
   *  @method  pan
   *  @param  {Number} panning Number between -1 and 1
   *  @param  {Number} timeFromNow schedule this event to happen
   *                                seconds from now
   */
  p5.Oscillator.prototype.pan = function (pval, tFromNow) {
    this.panPosition = pval;
    this.panner.pan(pval, tFromNow);
  };
  p5.Oscillator.prototype.getPan = function () {
    return this.panPosition;
  };
  // get rid of the oscillator
  p5.Oscillator.prototype.dispose = function () {
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    if (this.oscillator) {
      var now = p5sound.audiocontext.currentTime;
      this.stop(now);
      this.disconnect();
      this.panner = null;
      this.oscillator = null;
    }
    // if it is a Pulse
    if (this.osc2) {
      this.osc2.dispose();
    }
  };
  /**
   *  Set the phase of an oscillator between 0.0 and 1.0.
   *  In this implementation, phase is a delay time
   *  based on the oscillator's current frequency.
   *
   *  @method  phase
   *  @param  {Number} phase float between 0.0 and 1.0
   */
  p5.Oscillator.prototype.phase = function (p) {
    var delayAmt = p5.prototype.map(p, 0, 1, 0, 1 / this.f);
    var now = p5sound.audiocontext.currentTime;
    this.phaseAmount = p;
    if (!this.dNode) {
      // create a delay node
      this.dNode = p5sound.audiocontext.createDelay();
      // put the delay node in between output and panner
      this.oscillator.disconnect();
      this.oscillator.connect(this.dNode);
      this.dNode.connect(this.output);
    }
    // set delay time to match phase:
    this.dNode.delayTime.setValueAtTime(delayAmt, now);
  };
  // ========================== //
  // SIGNAL MATH FOR MODULATION //
  // ========================== //
  // return sigChain(this, scale, thisChain, nextChain, Scale);
  var sigChain = function (o, mathObj, thisChain, nextChain, type) {
    var chainSource = o.oscillator;
    // if this type of math already exists in the chain, replace it
    for (var i in o.mathOps) {
      if (o.mathOps[i] instanceof type) {
        chainSource.disconnect();
        o.mathOps[i].dispose();
        thisChain = i;
        // assume nextChain is output gain node unless...
        if (thisChain < o.mathOps.length - 2) {
          nextChain = o.mathOps[i + 1];
        }
      }
    }
    if (thisChain === o.mathOps.length - 1) {
      o.mathOps.push(nextChain);
    }
    // assume source is the oscillator unless i > 0
    if (i > 0) {
      chainSource = o.mathOps[i - 1];
    }
    chainSource.disconnect();
    chainSource.connect(mathObj);
    mathObj.connect(nextChain);
    o.mathOps[thisChain] = mathObj;
    return o;
  };
  /**
   *  Add a value to the p5.Oscillator's output amplitude,
   *  and return the oscillator. Calling this method again
   *  will override the initial add() with a new value.
   *
   *  @method  add
   *  @param {Number} number Constant number to add
   *  @return {p5.Oscillator} Oscillator Returns this oscillator
   *                                     with scaled output
   *
   */
  p5.Oscillator.prototype.add = function (num) {
    var add = new Add(num);
    var thisChain = this.mathOps.length - 1;
    var nextChain = this.output;
    return sigChain(this, add, thisChain, nextChain, Add);
  };
  /**
   *  Multiply the p5.Oscillator's output amplitude
   *  by a fixed value (i.e. turn it up!). Calling this method
   *  again will override the initial mult() with a new value.
   *
   *  @method  mult
   *  @param {Number} number Constant number to multiply
   *  @return {p5.Oscillator} Oscillator Returns this oscillator
   *                                     with multiplied output
   */
  p5.Oscillator.prototype.mult = function (num) {
    var mult = new Mult(num);
    var thisChain = this.mathOps.length - 1;
    var nextChain = this.output;
    return sigChain(this, mult, thisChain, nextChain, Mult);
  };
  /**
   *  Scale this oscillator's amplitude values to a given
   *  range, and return the oscillator. Calling this method
   *  again will override the initial scale() with new values.
   *
   *  @method  scale
   *  @param  {Number} inMin  input range minumum
   *  @param  {Number} inMax  input range maximum
   *  @param  {Number} outMin input range minumum
   *  @param  {Number} outMax input range maximum
   *  @return {p5.Oscillator} Oscillator Returns this oscillator
   *                                     with scaled output
   */
  p5.Oscillator.prototype.scale = function (inMin, inMax, outMin, outMax) {
    var mapOutMin, mapOutMax;
    if (arguments.length === 4) {
      mapOutMin = p5.prototype.map(outMin, inMin, inMax, 0, 1) - 0.5;
      mapOutMax = p5.prototype.map(outMax, inMin, inMax, 0, 1) - 0.5;
    } else {
      mapOutMin = arguments[0];
      mapOutMax = arguments[1];
    }
    var scale = new Scale(mapOutMin, mapOutMax);
    var thisChain = this.mathOps.length - 1;
    var nextChain = this.output;
    return sigChain(this, scale, thisChain, nextChain, Scale);
  };
  // ============================== //
  // SinOsc, TriOsc, SqrOsc, SawOsc //
  // ============================== //
  /**
   *  Constructor: <code>new p5.SinOsc()</code>.
   *  This creates a Sine Wave Oscillator and is
   *  equivalent to <code> new p5.Oscillator('sine')
   *  </code> or creating a p5.Oscillator and then calling
   *  its method <code>setType('sine')</code>.
   *  See p5.Oscillator for methods.
   *
   *  @class  p5.SinOsc
   *  @constructor
   *  @extends p5.Oscillator
   *  @param {Number} [freq] Set the frequency
   */
  p5.SinOsc = function (freq) {
    p5.Oscillator.call(this, freq, 'sine');
  };
  p5.SinOsc.prototype = Object.create(p5.Oscillator.prototype);
  /**
   *  Constructor: <code>new p5.TriOsc()</code>.
   *  This creates a Triangle Wave Oscillator and is
   *  equivalent to <code>new p5.Oscillator('triangle')
   *  </code> or creating a p5.Oscillator and then calling
   *  its method <code>setType('triangle')</code>.
   *  See p5.Oscillator for methods.
   *
   *  @class  p5.TriOsc
   *  @constructor
   *  @extends p5.Oscillator
   *  @param {Number} [freq] Set the frequency
   */
  p5.TriOsc = function (freq) {
    p5.Oscillator.call(this, freq, 'triangle');
  };
  p5.TriOsc.prototype = Object.create(p5.Oscillator.prototype);
  /**
   *  Constructor: <code>new p5.SawOsc()</code>.
   *  This creates a SawTooth Wave Oscillator and is
   *  equivalent to <code> new p5.Oscillator('sawtooth')
   *  </code> or creating a p5.Oscillator and then calling
   *  its method <code>setType('sawtooth')</code>.
   *  See p5.Oscillator for methods.
   *
   *  @class  p5.SawOsc
   *  @constructor
   *  @extends p5.Oscillator
   *  @param {Number} [freq] Set the frequency
   */
  p5.SawOsc = function (freq) {
    p5.Oscillator.call(this, freq, 'sawtooth');
  };
  p5.SawOsc.prototype = Object.create(p5.Oscillator.prototype);
  /**
   *  Constructor: <code>new p5.SqrOsc()</code>.
   *  This creates a Square Wave Oscillator and is
   *  equivalent to <code> new p5.Oscillator('square')
   *  </code> or creating a p5.Oscillator and then calling
   *  its method <code>setType('square')</code>.
   *  See p5.Oscillator for methods.
   *
   *  @class  p5.SqrOsc
   *  @constructor
   *  @extends p5.Oscillator
   *  @param {Number} [freq] Set the frequency
   */
  p5.SqrOsc = function (freq) {
    p5.Oscillator.call(this, freq, 'square');
  };
  p5.SqrOsc.prototype = Object.create(p5.Oscillator.prototype);
}(master, Tone_signal_Add, Tone_signal_Multiply, Tone_signal_Scale);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Timeline;
Tone_core_Timeline = function (Tone) {
  'use strict';
  Tone.Timeline = function () {
    var options = this.optionsObject(arguments, ['memory'], Tone.Timeline.defaults);
    this._timeline = [];
    this._toRemove = [];
    this._iterating = false;
    this.memory = options.memory;
  };
  Tone.extend(Tone.Timeline);
  Tone.Timeline.defaults = { 'memory': Infinity };
  Object.defineProperty(Tone.Timeline.prototype, 'length', {
    get: function () {
      return this._timeline.length;
    }
  });
  Tone.Timeline.prototype.add = function (event) {
    if (this.isUndef(event.time)) {
      throw new Error('Tone.Timeline: events must have a time attribute');
    }
    if (this._timeline.length) {
      var index = this._search(event.time);
      this._timeline.splice(index + 1, 0, event);
    } else {
      this._timeline.push(event);
    }
    if (this.length > this.memory) {
      var diff = this.length - this.memory;
      this._timeline.splice(0, diff);
    }
    return this;
  };
  Tone.Timeline.prototype.remove = function (event) {
    if (this._iterating) {
      this._toRemove.push(event);
    } else {
      var index = this._timeline.indexOf(event);
      if (index !== -1) {
        this._timeline.splice(index, 1);
      }
    }
    return this;
  };
  Tone.Timeline.prototype.get = function (time) {
    var index = this._search(time);
    if (index !== -1) {
      return this._timeline[index];
    } else {
      return null;
    }
  };
  Tone.Timeline.prototype.peek = function () {
    return this._timeline[0];
  };
  Tone.Timeline.prototype.shift = function () {
    return this._timeline.shift();
  };
  Tone.Timeline.prototype.getAfter = function (time) {
    var index = this._search(time);
    if (index + 1 < this._timeline.length) {
      return this._timeline[index + 1];
    } else {
      return null;
    }
  };
  Tone.Timeline.prototype.getBefore = function (time) {
    var len = this._timeline.length;
    if (len > 0 && this._timeline[len - 1].time < time) {
      return this._timeline[len - 1];
    }
    var index = this._search(time);
    if (index - 1 >= 0) {
      return this._timeline[index - 1];
    } else {
      return null;
    }
  };
  Tone.Timeline.prototype.cancel = function (after) {
    if (this._timeline.length > 1) {
      var index = this._search(after);
      if (index >= 0) {
        if (this._timeline[index].time === after) {
          for (var i = index; i >= 0; i--) {
            if (this._timeline[i].time === after) {
              index = i;
            } else {
              break;
            }
          }
          this._timeline = this._timeline.slice(0, index);
        } else {
          this._timeline = this._timeline.slice(0, index + 1);
        }
      } else {
        this._timeline = [];
      }
    } else if (this._timeline.length === 1) {
      if (this._timeline[0].time >= after) {
        this._timeline = [];
      }
    }
    return this;
  };
  Tone.Timeline.prototype.cancelBefore = function (time) {
    if (this._timeline.length) {
      var index = this._search(time);
      if (index >= 0) {
        this._timeline = this._timeline.slice(index + 1);
      }
    }
    return this;
  };
  Tone.Timeline.prototype._search = function (time) {
    var beginning = 0;
    var len = this._timeline.length;
    var end = len;
    if (len > 0 && this._timeline[len - 1].time <= time) {
      return len - 1;
    }
    while (beginning < end) {
      var midPoint = Math.floor(beginning + (end - beginning) / 2);
      var event = this._timeline[midPoint];
      var nextEvent = this._timeline[midPoint + 1];
      if (event.time === time) {
        for (var i = midPoint; i < this._timeline.length; i++) {
          var testEvent = this._timeline[i];
          if (testEvent.time === time) {
            midPoint = i;
          }
        }
        return midPoint;
      } else if (event.time < time && nextEvent.time > time) {
        return midPoint;
      } else if (event.time > time) {
        end = midPoint;
      } else if (event.time < time) {
        beginning = midPoint + 1;
      }
    }
    return -1;
  };
  Tone.Timeline.prototype._iterate = function (callback, lowerBound, upperBound) {
    this._iterating = true;
    lowerBound = this.defaultArg(lowerBound, 0);
    upperBound = this.defaultArg(upperBound, this._timeline.length - 1);
    for (var i = lowerBound; i <= upperBound; i++) {
      callback(this._timeline[i]);
    }
    this._iterating = false;
    if (this._toRemove.length > 0) {
      for (var j = 0; j < this._toRemove.length; j++) {
        var index = this._timeline.indexOf(this._toRemove[j]);
        if (index !== -1) {
          this._timeline.splice(index, 1);
        }
      }
      this._toRemove = [];
    }
  };
  Tone.Timeline.prototype.forEach = function (callback) {
    this._iterate(callback);
    return this;
  };
  Tone.Timeline.prototype.forEachBefore = function (time, callback) {
    var upperBound = this._search(time);
    if (upperBound !== -1) {
      this._iterate(callback, 0, upperBound);
    }
    return this;
  };
  Tone.Timeline.prototype.forEachAfter = function (time, callback) {
    var lowerBound = this._search(time);
    this._iterate(callback, lowerBound + 1);
    return this;
  };
  Tone.Timeline.prototype.forEachFrom = function (time, callback) {
    var lowerBound = this._search(time);
    while (lowerBound >= 0 && this._timeline[lowerBound].time >= time) {
      lowerBound--;
    }
    this._iterate(callback, lowerBound + 1);
    return this;
  };
  Tone.Timeline.prototype.forEachAtTime = function (time, callback) {
    var upperBound = this._search(time);
    if (upperBound !== -1) {
      this._iterate(function (event) {
        if (event.time === time) {
          callback(event);
        }
      }, 0, upperBound);
    }
    return this;
  };
  Tone.Timeline.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._timeline = null;
    this._toRemove = null;
  };
  return Tone.Timeline;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_TimelineSignal;
Tone_signal_TimelineSignal = function (Tone) {
  'use strict';
  Tone.TimelineSignal = function () {
    var options = this.optionsObject(arguments, [
      'value',
      'units'
    ], Tone.Signal.defaults);
    this._events = new Tone.Timeline(10);
    Tone.Signal.apply(this, options);
    options.param = this._param;
    Tone.Param.call(this, options);
    this._initial = this._fromUnits(this._param.value);
  };
  Tone.extend(Tone.TimelineSignal, Tone.Param);
  Tone.TimelineSignal.Type = {
    Linear: 'linear',
    Exponential: 'exponential',
    Target: 'target',
    Curve: 'curve',
    Set: 'set'
  };
  Object.defineProperty(Tone.TimelineSignal.prototype, 'value', {
    get: function () {
      var now = this.now();
      var val = this.getValueAtTime(now);
      return this._toUnits(val);
    },
    set: function (value) {
      var convertedVal = this._fromUnits(value);
      this._initial = convertedVal;
      this.cancelScheduledValues();
      this._param.value = convertedVal;
    }
  });
  Tone.TimelineSignal.prototype.setValueAtTime = function (value, startTime) {
    value = this._fromUnits(value);
    startTime = this.toSeconds(startTime);
    this._events.add({
      'type': Tone.TimelineSignal.Type.Set,
      'value': value,
      'time': startTime
    });
    this._param.setValueAtTime(value, startTime);
    return this;
  };
  Tone.TimelineSignal.prototype.linearRampToValueAtTime = function (value, endTime) {
    value = this._fromUnits(value);
    endTime = this.toSeconds(endTime);
    this._events.add({
      'type': Tone.TimelineSignal.Type.Linear,
      'value': value,
      'time': endTime
    });
    this._param.linearRampToValueAtTime(value, endTime);
    return this;
  };
  Tone.TimelineSignal.prototype.exponentialRampToValueAtTime = function (value, endTime) {
    endTime = this.toSeconds(endTime);
    var beforeEvent = this._searchBefore(endTime);
    if (beforeEvent && beforeEvent.value === 0) {
      this.setValueAtTime(this._minOutput, beforeEvent.time);
    }
    value = this._fromUnits(value);
    var setValue = Math.max(value, this._minOutput);
    this._events.add({
      'type': Tone.TimelineSignal.Type.Exponential,
      'value': setValue,
      'time': endTime
    });
    if (value < this._minOutput) {
      this._param.exponentialRampToValueAtTime(this._minOutput, endTime - this.sampleTime);
      this.setValueAtTime(0, endTime);
    } else {
      this._param.exponentialRampToValueAtTime(value, endTime);
    }
    return this;
  };
  Tone.TimelineSignal.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
    value = this._fromUnits(value);
    value = Math.max(this._minOutput, value);
    timeConstant = Math.max(this._minOutput, timeConstant);
    startTime = this.toSeconds(startTime);
    this._events.add({
      'type': Tone.TimelineSignal.Type.Target,
      'value': value,
      'time': startTime,
      'constant': timeConstant
    });
    this._param.setTargetAtTime(value, startTime, timeConstant);
    return this;
  };
  Tone.TimelineSignal.prototype.setValueCurveAtTime = function (values, startTime, duration, scaling) {
    scaling = this.defaultArg(scaling, 1);
    var floats = new Array(values.length);
    for (var i = 0; i < floats.length; i++) {
      floats[i] = this._fromUnits(values[i]) * scaling;
    }
    startTime = this.toSeconds(startTime);
    duration = this.toSeconds(duration);
    this._events.add({
      'type': Tone.TimelineSignal.Type.Curve,
      'value': floats,
      'time': startTime,
      'duration': duration
    });
    this._param.setValueAtTime(floats[0], startTime);
    for (var j = 1; j < floats.length; j++) {
      var segmentTime = startTime + j / (floats.length - 1) * duration;
      this._param.linearRampToValueAtTime(floats[j], segmentTime);
    }
    return this;
  };
  Tone.TimelineSignal.prototype.cancelScheduledValues = function (after) {
    after = this.toSeconds(after);
    this._events.cancel(after);
    this._param.cancelScheduledValues(after);
    return this;
  };
  Tone.TimelineSignal.prototype.setRampPoint = function (time) {
    time = this.toSeconds(time);
    var val = this._toUnits(this.getValueAtTime(time));
    var before = this._searchBefore(time);
    if (before && before.time === time) {
      this.cancelScheduledValues(time + this.sampleTime);
    } else if (before && before.type === Tone.TimelineSignal.Type.Curve && before.time + before.duration > time) {
      this.cancelScheduledValues(time);
      this.linearRampToValueAtTime(val, time);
    } else {
      var after = this._searchAfter(time);
      if (after) {
        this.cancelScheduledValues(time);
        if (after.type === Tone.TimelineSignal.Type.Linear) {
          this.linearRampToValueAtTime(val, time);
        } else if (after.type === Tone.TimelineSignal.Type.Exponential) {
          this.exponentialRampToValueAtTime(val, time);
        }
      }
      this.setValueAtTime(val, time);
    }
    return this;
  };
  Tone.TimelineSignal.prototype.linearRampToValueBetween = function (value, start, finish) {
    this.setRampPoint(start);
    this.linearRampToValueAtTime(value, finish);
    return this;
  };
  Tone.TimelineSignal.prototype.exponentialRampToValueBetween = function (value, start, finish) {
    this.setRampPoint(start);
    this.exponentialRampToValueAtTime(value, finish);
    return this;
  };
  Tone.TimelineSignal.prototype._searchBefore = function (time) {
    return this._events.get(time);
  };
  Tone.TimelineSignal.prototype._searchAfter = function (time) {
    return this._events.getAfter(time);
  };
  Tone.TimelineSignal.prototype.getValueAtTime = function (time) {
    time = this.toSeconds(time);
    var after = this._searchAfter(time);
    var before = this._searchBefore(time);
    var value = this._initial;
    if (before === null) {
      value = this._initial;
    } else if (before.type === Tone.TimelineSignal.Type.Target) {
      var previous = this._events.getBefore(before.time);
      var previouVal;
      if (previous === null) {
        previouVal = this._initial;
      } else {
        previouVal = previous.value;
      }
      value = this._exponentialApproach(before.time, previouVal, before.value, before.constant, time);
    } else if (before.type === Tone.TimelineSignal.Type.Curve) {
      value = this._curveInterpolate(before.time, before.value, before.duration, time);
    } else if (after === null) {
      value = before.value;
    } else if (after.type === Tone.TimelineSignal.Type.Linear) {
      value = this._linearInterpolate(before.time, before.value, after.time, after.value, time);
    } else if (after.type === Tone.TimelineSignal.Type.Exponential) {
      value = this._exponentialInterpolate(before.time, before.value, after.time, after.value, time);
    } else {
      value = before.value;
    }
    return value;
  };
  Tone.TimelineSignal.prototype.connect = Tone.SignalBase.prototype.connect;
  Tone.TimelineSignal.prototype._exponentialApproach = function (t0, v0, v1, timeConstant, t) {
    return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
  };
  Tone.TimelineSignal.prototype._linearInterpolate = function (t0, v0, t1, v1, t) {
    return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
  };
  Tone.TimelineSignal.prototype._exponentialInterpolate = function (t0, v0, t1, v1, t) {
    v0 = Math.max(this._minOutput, v0);
    return v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0));
  };
  Tone.TimelineSignal.prototype._curveInterpolate = function (start, curve, duration, time) {
    var len = curve.length;
    if (time >= start + duration) {
      return curve[len - 1];
    } else if (time <= start) {
      return curve[0];
    } else {
      var progress = (time - start) / duration;
      var lowerIndex = Math.floor((len - 1) * progress);
      var upperIndex = Math.ceil((len - 1) * progress);
      var lowerVal = curve[lowerIndex];
      var upperVal = curve[upperIndex];
      if (upperIndex === lowerIndex) {
        return lowerVal;
      } else {
        return this._linearInterpolate(lowerIndex, lowerVal, upperIndex, upperVal, progress * (len - 1));
      }
    }
  };
  Tone.TimelineSignal.prototype.dispose = function () {
    Tone.Signal.prototype.dispose.call(this);
    Tone.Param.prototype.dispose.call(this);
    this._events.dispose();
    this._events = null;
  };
  return Tone.TimelineSignal;
}(Tone_core_Tone, Tone_signal_Signal);
var envelope;
'use strict';
envelope = function () {
  var p5sound = master;
  var Add = Tone_signal_Add;
  var Mult = Tone_signal_Multiply;
  var Scale = Tone_signal_Scale;
  var TimelineSignal = Tone_signal_TimelineSignal;
  /**
   *  <p>Envelopes are pre-defined amplitude distribution over time.
   *  Typically, envelopes are used to control the output volume
   *  of an object, a series of fades referred to as Attack, Decay,
   *  Sustain and Release (
   *  <a href="https://upload.wikimedia.org/wikipedia/commons/e/ea/ADSR_parameter.svg">ADSR</a>
   *  ). Envelopes can also control other Web Audio Parameters—for example, a p5.Envelope can
   *  control an Oscillator's frequency like this: <code>osc.freq(env)</code>.</p>
   *  <p>Use <code><a href="#/p5.Envelope/setRange">setRange</a></code> to change the attack/release level.
   *  Use <code><a href="#/p5.Envelope/setADSR">setADSR</a></code> to change attackTime, decayTime, sustainPercent and releaseTime.</p>
   *  <p>Use the <code><a href="#/p5.Envelope/play">play</a></code> method to play the entire envelope,
   *  the <code><a href="#/p5.Envelope/ramp">ramp</a></code> method for a pingable trigger,
   *  or <code><a href="#/p5.Envelope/triggerAttack">triggerAttack</a></code>/
   *  <code><a href="#/p5.Envelope/triggerRelease">triggerRelease</a></code> to trigger noteOn/noteOff.</p>
   *
   *  @class p5.Envelope
   *  @constructor
   *  @example
   *  <div><code>
   *  var attackLevel = 1.0;
   *  var releaseLevel = 0;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.2;
   *  var susPercent = 0.2;
   *  var releaseTime = 0.5;
   *
   *  var env, triOsc;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
   *    env.setRange(attackLevel, releaseLevel);
   *
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env);
   *    triOsc.start();
   *    triOsc.freq(220);
   *
   *    cnv.mousePressed(playEnv);
   *  }
   *
   *  function playEnv()  {
   *    env.play();
   *  }
   *  </code></div>
   */
  p5.Envelope = function (t1, l1, t2, l2, t3, l3) {
    /**
     * Time until envelope reaches attackLevel
     * @property attackTime
     */
    this.aTime = t1 || 0.1;
    /**
     * Level once attack is complete.
     * @property attackLevel
     */
    this.aLevel = l1 || 1;
    /**
     * Time until envelope reaches decayLevel.
     * @property decayTime
     */
    this.dTime = t2 || 0.5;
    /**
     * Level after decay. The envelope will sustain here until it is released.
     * @property decayLevel
     */
    this.dLevel = l2 || 0;
    /**
     * Duration of the release portion of the envelope.
     * @property releaseTime
     */
    this.rTime = t3 || 0;
    /**
     * Level at the end of the release.
     * @property releaseLevel
     */
    this.rLevel = l3 || 0;
    this._rampHighPercentage = 0.98;
    this._rampLowPercentage = 0.02;
    this.output = p5sound.audiocontext.createGain();
    this.control = new TimelineSignal();
    this._init();
    // this makes sure the envelope starts at zero
    this.control.connect(this.output);
    // connect to the output
    this.connection = null;
    // store connection
    //array of math operation signal chaining
    this.mathOps = [this.control];
    //whether envelope should be linear or exponential curve
    this.isExponential = false;
    // oscillator or buffer source to clear on env complete
    // to save resources if/when it is retriggered
    this.sourceToClear = null;
    // set to true if attack is set, then false on release
    this.wasTriggered = false;
    // add to the soundArray so we can dispose of the env later
    p5sound.soundArray.push(this);
  };
  // this init function just smooths the starting value to zero and gives a start point for the timeline
  // - it was necessary to remove glitches at the beginning.
  p5.Envelope.prototype._init = function () {
    var now = p5sound.audiocontext.currentTime;
    var t = now;
    this.control.setTargetAtTime(0.00001, t, 0.001);
    //also, compute the correct time constants
    this._setRampAD(this.aTime, this.dTime);
  };
  /**
   *  Reset the envelope with a series of time/value pairs.
   *
   *  @method  set
   *  @param {Number} attackTime     Time (in seconds) before level
   *                                 reaches attackLevel
   *  @param {Number} attackLevel    Typically an amplitude between
   *                                 0.0 and 1.0
   *  @param {Number} decayTime      Time
   *  @param {Number} decayLevel   Amplitude (In a standard ADSR envelope,
   *                                 decayLevel = sustainLevel)
   *  @param {Number} releaseTime   Release Time (in seconds)
   *  @param {Number} releaseLevel  Amplitude
   *  @example
   *  <div><code>
   *  var t1 = 0.1; // attack time in seconds
   *  var l1 = 0.7; // attack level 0.0 to 1.0
   *  var t2 = 0.3; // decay time in seconds
   *  var l2 = 0.1; // decay level  0.0 to 1.0
   *  var t3 = 0.2; // sustain time in seconds
   *  var l3 = 0.5; // sustain level  0.0 to 1.0
   *  // release level defaults to zero
   *
   *  var env;
   *  var triOsc;
   *
   *  function setup() {
   *    background(0);
   *    noStroke();
   *    fill(255);
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope(t1, l1, t2, l2, t3, l3);
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env); // give the env control of the triOsc's amp
   *    triOsc.start();
   *  }
   *
   *  // mouseClick triggers envelope if over canvas
   *  function mouseClicked() {
   *    // is mouse over canvas?
   *    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *      env.play(triOsc);
   *    }
   *  }
   *  </code></div>
   *
   */
  p5.Envelope.prototype.set = function (t1, l1, t2, l2, t3, l3) {
    this.aTime = t1;
    this.aLevel = l1;
    this.dTime = t2 || 0;
    this.dLevel = l2 || 0;
    this.rTime = t3 || 0;
    this.rLevel = l3 || 0;
    // set time constants for ramp
    this._setRampAD(t1, t2);
  };
  /**
   *  Set values like a traditional
   *  <a href="https://en.wikipedia.org/wiki/Synthesizer#/media/File:ADSR_parameter.svg">
   *  ADSR envelope
   *  </a>.
   *
   *  @method  setADSR
   *  @param {Number} attackTime    Time (in seconds before envelope
   *                                reaches Attack Level
   *  @param {Number} [decayTime]    Time (in seconds) before envelope
   *                                reaches Decay/Sustain Level
   *  @param {Number} [susRatio]    Ratio between attackLevel and releaseLevel, on a scale from 0 to 1,
   *                                where 1.0 = attackLevel, 0.0 = releaseLevel.
   *                                The susRatio determines the decayLevel and the level at which the
   *                                sustain portion of the envelope will sustain.
   *                                For example, if attackLevel is 0.4, releaseLevel is 0,
   *                                and susAmt is 0.5, the decayLevel would be 0.2. If attackLevel is
   *                                increased to 1.0 (using <code>setRange</code>),
   *                                then decayLevel would increase proportionally, to become 0.5.
   *  @param {Number} [releaseTime]   Time in seconds from now (defaults to 0)
   *  @example
   *  <div><code>
   *  var attackLevel = 1.0;
   *  var releaseLevel = 0;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.2;
   *  var susPercent = 0.2;
   *  var releaseTime = 0.5;
   *
   *  var env, triOsc;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
   *    env.setRange(attackLevel, releaseLevel);
   *
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env);
   *    triOsc.start();
   *    triOsc.freq(220);
   *
   *    cnv.mousePressed(playEnv);
   *  }
   *
   *  function playEnv()  {
   *    env.play();
   *  }
   *  </code></div>
   */
  p5.Envelope.prototype.setADSR = function (aTime, dTime, sPercent, rTime) {
    this.aTime = aTime;
    this.dTime = dTime || 0;
    // lerp
    this.sPercent = sPercent || 0;
    this.dLevel = typeof sPercent !== 'undefined' ? sPercent * (this.aLevel - this.rLevel) + this.rLevel : 0;
    this.rTime = rTime || 0;
    // also set time constants for ramp
    this._setRampAD(aTime, dTime);
  };
  /**
   *  Set max (attackLevel) and min (releaseLevel) of envelope.
   *
   *  @method  setRange
   *  @param {Number} aLevel attack level (defaults to 1)
   *  @param {Number} rLevel release level (defaults to 0)
   *  @example
   *  <div><code>
   *  var attackLevel = 1.0;
   *  var releaseLevel = 0;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.2;
   *  var susPercent = 0.2;
   *  var releaseTime = 0.5;
   *
   *  var env, triOsc;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
   *    env.setRange(attackLevel, releaseLevel);
   *
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env);
   *    triOsc.start();
   *    triOsc.freq(220);
   *
   *    cnv.mousePressed(playEnv);
   *  }
   *
   *  function playEnv()  {
   *    env.play();
   *  }
   *  </code></div>
   */
  p5.Envelope.prototype.setRange = function (aLevel, rLevel) {
    this.aLevel = aLevel || 1;
    this.rLevel = rLevel || 0;
  };
  //  private (undocumented) method called when ADSR is set to set time constants for ramp
  //
  //  Set the <a href="https://en.wikipedia.org/wiki/RC_time_constant">
  //  time constants</a> for simple exponential ramps.
  //  The larger the time constant value, the slower the
  //  transition will be.
  //
  //  method  _setRampAD
  //  param {Number} attackTimeConstant  attack time constant
  //  param {Number} decayTimeConstant   decay time constant
  //
  p5.Envelope.prototype._setRampAD = function (t1, t2) {
    this._rampAttackTime = this.checkExpInput(t1);
    this._rampDecayTime = this.checkExpInput(t2);
    var TCDenominator = 1;
    /// Aatish Bhatia's calculation for time constant for rise(to adjust 1/1-e calculation to any percentage)
    TCDenominator = Math.log(1 / this.checkExpInput(1 - this._rampHighPercentage));
    this._rampAttackTC = t1 / this.checkExpInput(TCDenominator);
    TCDenominator = Math.log(1 / this._rampLowPercentage);
    this._rampDecayTC = t2 / this.checkExpInput(TCDenominator);
  };
  // private method
  p5.Envelope.prototype.setRampPercentages = function (p1, p2) {
    //set the percentages that the simple exponential ramps go to
    this._rampHighPercentage = this.checkExpInput(p1);
    this._rampLowPercentage = this.checkExpInput(p2);
    var TCDenominator = 1;
    //now re-compute the time constants based on those percentages
    /// Aatish Bhatia's calculation for time constant for rise(to adjust 1/1-e calculation to any percentage)
    TCDenominator = Math.log(1 / this.checkExpInput(1 - this._rampHighPercentage));
    this._rampAttackTC = this._rampAttackTime / this.checkExpInput(TCDenominator);
    TCDenominator = Math.log(1 / this._rampLowPercentage);
    this._rampDecayTC = this._rampDecayTime / this.checkExpInput(TCDenominator);
  };
  /**
   *  Assign a parameter to be controlled by this envelope.
   *  If a p5.Sound object is given, then the p5.Envelope will control its
   *  output gain. If multiple inputs are provided, the env will
   *  control all of them.
   *
   *  @method  setInput
   *  @param  {Object} [...inputs]         A p5.sound object or
   *                                Web Audio Param.
   */
  p5.Envelope.prototype.setInput = function () {
    for (var i = 0; i < arguments.length; i++) {
      this.connect(arguments[i]);
    }
  };
  /**
   *  Set whether the envelope ramp is linear (default) or exponential.
   *  Exponential ramps can be useful because we perceive amplitude
   *  and frequency logarithmically.
   *
   *  @method  setExp
   *  @param {Boolean} isExp true is exponential, false is linear
   */
  p5.Envelope.prototype.setExp = function (isExp) {
    this.isExponential = isExp;
  };
  //helper method to protect against zero values being sent to exponential functions
  p5.Envelope.prototype.checkExpInput = function (value) {
    if (value <= 0) {
      value = 1e-8;
    }
    return value;
  };
  /**
   *  Play tells the envelope to start acting on a given input.
   *  If the input is a p5.sound object (i.e. AudioIn, Oscillator,
   *  SoundFile), then Envelope will control its output volume.
   *  Envelopes can also be used to control any <a href="
   *  http://docs.webplatform.org/wiki/apis/webaudio/AudioParam">
   *  Web Audio Audio Param.</a>
   *
   *  @method  play
   *  @param  {Object} unit         A p5.sound object or
   *                                Web Audio Param.
   *  @param  {Number} [startTime]  time from now (in seconds) at which to play
   *  @param  {Number} [sustainTime] time to sustain before releasing the envelope
   *  @example
   *  <div><code>
   *  var attackLevel = 1.0;
   *  var releaseLevel = 0;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.2;
   *  var susPercent = 0.2;
   *  var releaseTime = 0.5;
   *
   *  var env, triOsc;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
   *    env.setRange(attackLevel, releaseLevel);
   *
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env);
   *    triOsc.start();
   *    triOsc.freq(220);
   *
   *    cnv.mousePressed(playEnv);
   *  }
   *
   *  function playEnv()  {
   *    // trigger env on triOsc, 0 seconds from now
   *    // After decay, sustain for 0.2 seconds before release
   *    env.play(triOsc, 0, 0.2);
   *  }
   *  </code></div>
   */
  p5.Envelope.prototype.play = function (unit, secondsFromNow, susTime) {
    var tFromNow = secondsFromNow || 0;
    var susTime = susTime || 0;
    if (unit) {
      if (this.connection !== unit) {
        this.connect(unit);
      }
    }
    this.triggerAttack(unit, tFromNow);
    this.triggerRelease(unit, tFromNow + this.aTime + this.dTime + susTime);
  };
  /**
   *  Trigger the Attack, and Decay portion of the Envelope.
   *  Similar to holding down a key on a piano, but it will
   *  hold the sustain level until you let go. Input can be
   *  any p5.sound object, or a <a href="
   *  http://docs.webplatform.org/wiki/apis/webaudio/AudioParam">
   *  Web Audio Param</a>.
   *
   *  @method  triggerAttack
   *  @param  {Object} unit p5.sound Object or Web Audio Param
   *  @param  {Number} secondsFromNow time from now (in seconds)
   *  @example
   *  <div><code>
   *
   *  var attackLevel = 1.0;
   *  var releaseLevel = 0;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.3;
   *  var susPercent = 0.4;
   *  var releaseTime = 0.5;
   *
   *  var env, triOsc;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *    background(200);
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
   *    env.setRange(attackLevel, releaseLevel);
   *
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env);
   *    triOsc.start();
   *    triOsc.freq(220);
   *
   *    cnv.mousePressed(envAttack);
   *  }
   *
   *  function envAttack()  {
   *    console.log('trigger attack');
   *    env.triggerAttack();
   *
   *    background(0,255,0);
   *    text('attack!', width/2, height/2);
   *  }
   *
   *  function mouseReleased() {
   *    env.triggerRelease();
   *
   *    background(200);
   *    text('click to play', width/2, height/2);
   *  }
   *  </code></div>
   */
  p5.Envelope.prototype.triggerAttack = function (unit, secondsFromNow) {
    var now = p5sound.audiocontext.currentTime;
    var tFromNow = secondsFromNow || 0;
    var t = now + tFromNow;
    this.lastAttack = t;
    this.wasTriggered = true;
    if (unit) {
      if (this.connection !== unit) {
        this.connect(unit);
      }
    }
    // get and set value (with linear ramp) to anchor automation
    var valToSet = this.control.getValueAtTime(t);
    if (this.isExponential === true) {
      this.control.exponentialRampToValueAtTime(this.checkExpInput(valToSet), t);
    } else {
      this.control.linearRampToValueAtTime(valToSet, t);
    }
    // after each ramp completes, cancel scheduled values
    // (so they can be overridden in case env has been re-triggered)
    // then, set current value (with linearRamp to avoid click)
    // then, schedule the next automation...
    // attack
    t += this.aTime;
    if (this.isExponential === true) {
      this.control.exponentialRampToValueAtTime(this.checkExpInput(this.aLevel), t);
      valToSet = this.checkExpInput(this.control.getValueAtTime(t));
      this.control.cancelScheduledValues(t);
      this.control.exponentialRampToValueAtTime(valToSet, t);
    } else {
      this.control.linearRampToValueAtTime(this.aLevel, t);
      valToSet = this.control.getValueAtTime(t);
      this.control.cancelScheduledValues(t);
      this.control.linearRampToValueAtTime(valToSet, t);
    }
    // decay to decay level (if using ADSR, then decay level == sustain level)
    t += this.dTime;
    if (this.isExponential === true) {
      this.control.exponentialRampToValueAtTime(this.checkExpInput(this.dLevel), t);
      valToSet = this.checkExpInput(this.control.getValueAtTime(t));
      this.control.cancelScheduledValues(t);
      this.control.exponentialRampToValueAtTime(valToSet, t);
    } else {
      this.control.linearRampToValueAtTime(this.dLevel, t);
      valToSet = this.control.getValueAtTime(t);
      this.control.cancelScheduledValues(t);
      this.control.linearRampToValueAtTime(valToSet, t);
    }
  };
  /**
   *  Trigger the Release of the Envelope. This is similar to releasing
   *  the key on a piano and letting the sound fade according to the
   *  release level and release time.
   *
   *  @method  triggerRelease
   *  @param  {Object} unit p5.sound Object or Web Audio Param
   *  @param  {Number} secondsFromNow time to trigger the release
   *  @example
   *  <div><code>
   *
   *  var attackLevel = 1.0;
   *  var releaseLevel = 0;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.3;
   *  var susPercent = 0.4;
   *  var releaseTime = 0.5;
   *
   *  var env, triOsc;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *    background(200);
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
   *    env.setRange(attackLevel, releaseLevel);
   *
   *    triOsc = new p5.Oscillator('triangle');
   *    triOsc.amp(env);
   *    triOsc.start();
   *    triOsc.freq(220);
   *
   *    cnv.mousePressed(envAttack);
   *  }
   *
   *  function envAttack()  {
   *    console.log('trigger attack');
   *    env.triggerAttack();
   *
   *    background(0,255,0);
   *    text('attack!', width/2, height/2);
   *  }
   *
   *  function mouseReleased() {
   *    env.triggerRelease();
   *
   *    background(200);
   *    text('click to play', width/2, height/2);
   *  }
   *  </code></div>
   */
  p5.Envelope.prototype.triggerRelease = function (unit, secondsFromNow) {
    // only trigger a release if an attack was triggered
    if (!this.wasTriggered) {
      // this currently causes a bit of trouble:
      // if a later release has been scheduled (via the play function)
      // a new earlier release won't interrupt it, because
      // this.wasTriggered has already been set to false.
      // If we want new earlier releases to override, then we need to
      // keep track of the last release time, and if the new release time is
      // earlier, then use it.
      return;
    }
    var now = p5sound.audiocontext.currentTime;
    var tFromNow = secondsFromNow || 0;
    var t = now + tFromNow;
    if (unit) {
      if (this.connection !== unit) {
        this.connect(unit);
      }
    }
    // get and set value (with linear or exponential ramp) to anchor automation
    var valToSet = this.control.getValueAtTime(t);
    if (this.isExponential === true) {
      this.control.exponentialRampToValueAtTime(this.checkExpInput(valToSet), t);
    } else {
      this.control.linearRampToValueAtTime(valToSet, t);
    }
    // release
    t += this.rTime;
    if (this.isExponential === true) {
      this.control.exponentialRampToValueAtTime(this.checkExpInput(this.rLevel), t);
      valToSet = this.checkExpInput(this.control.getValueAtTime(t));
      this.control.cancelScheduledValues(t);
      this.control.exponentialRampToValueAtTime(valToSet, t);
    } else {
      this.control.linearRampToValueAtTime(this.rLevel, t);
      valToSet = this.control.getValueAtTime(t);
      this.control.cancelScheduledValues(t);
      this.control.linearRampToValueAtTime(valToSet, t);
    }
    this.wasTriggered = false;
  };
  /**
   *  Exponentially ramp to a value using the first two
   *  values from <code><a href="#/p5.Envelope/setADSR">setADSR(attackTime, decayTime)</a></code>
   *  as <a href="https://en.wikipedia.org/wiki/RC_time_constant">
   *  time constants</a> for simple exponential ramps.
   *  If the value is higher than current value, it uses attackTime,
   *  while a decrease uses decayTime.
   *
   *  @method  ramp
   *  @param  {Object} unit           p5.sound Object or Web Audio Param
   *  @param  {Number} secondsFromNow When to trigger the ramp
   *  @param  {Number} v              Target value
   *  @param  {Number} [v2]           Second target value (optional)
   *  @example
   *  <div><code>
   *  var env, osc, amp, cnv;
   *
   *  var attackTime = 0.001;
   *  var decayTime = 0.2;
   *  var attackLevel = 1;
   *  var decayLevel = 0;
   *
   *  function setup() {
   *    cnv = createCanvas(100, 100);
   *    fill(0,255,0);
   *    noStroke();
   *
   *    env = new p5.Envelope();
   *    env.setADSR(attackTime, decayTime);
   *
   *    osc = new p5.Oscillator();
   *    osc.amp(env);
   *    osc.start();
   *
   *    amp = new p5.Amplitude();
   *
   *    cnv.mousePressed(triggerRamp);
   *  }
   *
   *  function triggerRamp() {
   *    env.ramp(osc, 0, attackLevel, decayLevel);
   *  }
   *
   *  function draw() {
   *    background(20,20,20);
   *    text('click me', 10, 20);
   *    var h = map(amp.getLevel(), 0, 0.4, 0, height);;
   *
   *    rect(0, height, width, -h);
   *  }
   *  </code></div>
   */
  p5.Envelope.prototype.ramp = function (unit, secondsFromNow, v1, v2) {
    var now = p5sound.audiocontext.currentTime;
    var tFromNow = secondsFromNow || 0;
    var t = now + tFromNow;
    var destination1 = this.checkExpInput(v1);
    var destination2 = typeof v2 !== 'undefined' ? this.checkExpInput(v2) : undefined;
    // connect env to unit if not already connected
    if (unit) {
      if (this.connection !== unit) {
        this.connect(unit);
      }
    }
    //get current value
    var currentVal = this.checkExpInput(this.control.getValueAtTime(t));
    // this.control.cancelScheduledValues(t);
    //if it's going up
    if (destination1 > currentVal) {
      this.control.setTargetAtTime(destination1, t, this._rampAttackTC);
      t += this._rampAttackTime;
    } else if (destination1 < currentVal) {
      this.control.setTargetAtTime(destination1, t, this._rampDecayTC);
      t += this._rampDecayTime;
    }
    // Now the second part of envelope begins
    if (destination2 === undefined)
      return;
    //if it's going up
    if (destination2 > destination1) {
      this.control.setTargetAtTime(destination2, t, this._rampAttackTC);
    } else if (destination2 < destination1) {
      this.control.setTargetAtTime(destination2, t, this._rampDecayTC);
    }
  };
  p5.Envelope.prototype.connect = function (unit) {
    this.connection = unit;
    // assume we're talking about output gain
    // unless given a different audio param
    if (unit instanceof p5.Oscillator || unit instanceof p5.SoundFile || unit instanceof p5.AudioIn || unit instanceof p5.Reverb || unit instanceof p5.Noise || unit instanceof p5.Filter || unit instanceof p5.Delay) {
      unit = unit.output.gain;
    }
    if (unit instanceof AudioParam) {
      //set the initial value
      unit.setValueAtTime(0, p5sound.audiocontext.currentTime);
    }
    if (unit instanceof p5.Signal) {
      unit.setValue(0);
    }
    this.output.connect(unit);
  };
  p5.Envelope.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
  };
  // Signal Math
  /**
   *  Add a value to the p5.Oscillator's output amplitude,
   *  and return the oscillator. Calling this method
   *  again will override the initial add() with new values.
   *
   *  @method  add
   *  @param {Number} number Constant number to add
   *  @return {p5.Envelope} Envelope Returns this envelope
   *                                     with scaled output
   */
  p5.Envelope.prototype.add = function (num) {
    var add = new Add(num);
    var thisChain = this.mathOps.length;
    var nextChain = this.output;
    return p5.prototype._mathChain(this, add, thisChain, nextChain, Add);
  };
  /**
   *  Multiply the p5.Envelope's output amplitude
   *  by a fixed value. Calling this method
   *  again will override the initial mult() with new values.
   *
   *  @method  mult
   *  @param {Number} number Constant number to multiply
   *  @return {p5.Envelope} Envelope Returns this envelope
   *                                     with scaled output
   */
  p5.Envelope.prototype.mult = function (num) {
    var mult = new Mult(num);
    var thisChain = this.mathOps.length;
    var nextChain = this.output;
    return p5.prototype._mathChain(this, mult, thisChain, nextChain, Mult);
  };
  /**
   *  Scale this envelope's amplitude values to a given
   *  range, and return the envelope. Calling this method
   *  again will override the initial scale() with new values.
   *
   *  @method  scale
   *  @param  {Number} inMin  input range minumum
   *  @param  {Number} inMax  input range maximum
   *  @param  {Number} outMin input range minumum
   *  @param  {Number} outMax input range maximum
   *  @return {p5.Envelope} Envelope Returns this envelope
   *                                     with scaled output
   */
  p5.Envelope.prototype.scale = function (inMin, inMax, outMin, outMax) {
    var scale = new Scale(inMin, inMax, outMin, outMax);
    var thisChain = this.mathOps.length;
    var nextChain = this.output;
    return p5.prototype._mathChain(this, scale, thisChain, nextChain, Scale);
  };
  // get rid of the oscillator
  p5.Envelope.prototype.dispose = function () {
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    this.disconnect();
    if (this.control) {
      this.control.dispose();
      this.control = null;
    }
    for (var i = 1; i < this.mathOps.length; i++) {
      this.mathOps[i].dispose();
    }
  };
  // Different name for backwards compatibility, replicates p5.Envelope class
  p5.Env = function (t1, l1, t2, l2, t3, l3) {
    console.warn('WARNING: p5.Env is now deprecated and may be removed in future versions. ' + 'Please use the new p5.Envelope instead.');
    p5.Envelope.call(this, t1, l1, t2, l2, t3, l3);
  };
  p5.Env.prototype = Object.create(p5.Envelope.prototype);
}(master, Tone_signal_Add, Tone_signal_Multiply, Tone_signal_Scale, Tone_signal_TimelineSignal);
var pulse;
'use strict';
pulse = function () {
  var p5sound = master;
  /**
   *  Creates a Pulse object, an oscillator that implements
   *  Pulse Width Modulation.
   *  The pulse is created with two oscillators.
   *  Accepts a parameter for frequency, and to set the
   *  width between the pulses. See <a href="
   *  http://p5js.org/reference/#/p5.Oscillator">
   *  <code>p5.Oscillator</code> for a full list of methods.
   *
   *  @class p5.Pulse
   *  @extends p5.Oscillator
   *  @constructor
   *  @param {Number} [freq] Frequency in oscillations per second (Hz)
   *  @param {Number} [w]    Width between the pulses (0 to 1.0,
   *                         defaults to 0)
   *  @example
   *  <div><code>
   *  var pulse;
   *  function setup() {
   *    background(0);
   *
   *    // Create and start the pulse wave oscillator
   *    pulse = new p5.Pulse();
   *    pulse.amp(0.5);
   *    pulse.freq(220);
   *    pulse.start();
   *  }
   *
   *  function draw() {
   *    var w = map(mouseX, 0, width, 0, 1);
   *    w = constrain(w, 0, 1);
   *    pulse.width(w)
   *  }
   *  </code></div>
   */
  p5.Pulse = function (freq, w) {
    p5.Oscillator.call(this, freq, 'sawtooth');
    // width of PWM, should be betw 0 to 1.0
    this.w = w || 0;
    // create a second oscillator with inverse frequency
    this.osc2 = new p5.SawOsc(freq);
    // create a delay node
    this.dNode = p5sound.audiocontext.createDelay();
    // dc offset
    this.dcOffset = createDCOffset();
    this.dcGain = p5sound.audiocontext.createGain();
    this.dcOffset.connect(this.dcGain);
    this.dcGain.connect(this.output);
    // set delay time based on PWM width
    this.f = freq || 440;
    var mW = this.w / this.oscillator.frequency.value;
    this.dNode.delayTime.value = mW;
    this.dcGain.gain.value = 1.7 * (0.5 - this.w);
    // disconnect osc2 and connect it to delay, which is connected to output
    this.osc2.disconnect();
    this.osc2.panner.disconnect();
    this.osc2.amp(-1);
    // inverted amplitude
    this.osc2.output.connect(this.dNode);
    this.dNode.connect(this.output);
    this.output.gain.value = 1;
    this.output.connect(this.panner);
  };
  p5.Pulse.prototype = Object.create(p5.Oscillator.prototype);
  /**
   *  Set the width of a Pulse object (an oscillator that implements
   *  Pulse Width Modulation).
   *
   *  @method  width
   *  @param {Number} [width]    Width between the pulses (0 to 1.0,
   *                         defaults to 0)
   */
  p5.Pulse.prototype.width = function (w) {
    if (typeof w === 'number') {
      if (w <= 1 && w >= 0) {
        this.w = w;
        // set delay time based on PWM width
        // var mW = map(this.w, 0, 1.0, 0, 1/this.f);
        var mW = this.w / this.oscillator.frequency.value;
        this.dNode.delayTime.value = mW;
      }
      this.dcGain.gain.value = 1.7 * (0.5 - this.w);
    } else {
      w.connect(this.dNode.delayTime);
      var sig = new p5.SignalAdd(-0.5);
      sig.setInput(w);
      sig = sig.mult(-1);
      sig = sig.mult(1.7);
      sig.connect(this.dcGain.gain);
    }
  };
  p5.Pulse.prototype.start = function (f, time) {
    var now = p5sound.audiocontext.currentTime;
    var t = time || 0;
    if (!this.started) {
      var freq = f || this.f;
      var type = this.oscillator.type;
      this.oscillator = p5sound.audiocontext.createOscillator();
      this.oscillator.frequency.setValueAtTime(freq, now);
      this.oscillator.type = type;
      this.oscillator.connect(this.output);
      this.oscillator.start(t + now);
      // set up osc2
      this.osc2.oscillator = p5sound.audiocontext.createOscillator();
      this.osc2.oscillator.frequency.setValueAtTime(freq, t + now);
      this.osc2.oscillator.type = type;
      this.osc2.oscillator.connect(this.osc2.output);
      this.osc2.start(t + now);
      this.freqNode = [
        this.oscillator.frequency,
        this.osc2.oscillator.frequency
      ];
      // start dcOffset, too
      this.dcOffset = createDCOffset();
      this.dcOffset.connect(this.dcGain);
      this.dcOffset.start(t + now);
      // if LFO connections depend on these oscillators
      if (this.mods !== undefined && this.mods.frequency !== undefined) {
        this.mods.frequency.connect(this.freqNode[0]);
        this.mods.frequency.connect(this.freqNode[1]);
      }
      this.started = true;
      this.osc2.started = true;
    }
  };
  p5.Pulse.prototype.stop = function (time) {
    if (this.started) {
      var t = time || 0;
      var now = p5sound.audiocontext.currentTime;
      this.oscillator.stop(t + now);
      if (this.osc2.oscillator) {
        this.osc2.oscillator.stop(t + now);
      }
      this.dcOffset.stop(t + now);
      this.started = false;
      this.osc2.started = false;
    }
  };
  p5.Pulse.prototype.freq = function (val, rampTime, tFromNow) {
    if (typeof val === 'number') {
      this.f = val;
      var now = p5sound.audiocontext.currentTime;
      var rampTime = rampTime || 0;
      var tFromNow = tFromNow || 0;
      var currentFreq = this.oscillator.frequency.value;
      this.oscillator.frequency.cancelScheduledValues(now);
      this.oscillator.frequency.setValueAtTime(currentFreq, now + tFromNow);
      this.oscillator.frequency.exponentialRampToValueAtTime(val, tFromNow + rampTime + now);
      this.osc2.oscillator.frequency.cancelScheduledValues(now);
      this.osc2.oscillator.frequency.setValueAtTime(currentFreq, now + tFromNow);
      this.osc2.oscillator.frequency.exponentialRampToValueAtTime(val, tFromNow + rampTime + now);
      if (this.freqMod) {
        this.freqMod.output.disconnect();
        this.freqMod = null;
      }
    } else if (val.output) {
      val.output.disconnect();
      val.output.connect(this.oscillator.frequency);
      val.output.connect(this.osc2.oscillator.frequency);
      this.freqMod = val;
    }
  };
  // inspiration: http://webaudiodemos.appspot.com/oscilloscope/
  function createDCOffset() {
    var ac = p5sound.audiocontext;
    var buffer = ac.createBuffer(1, 2048, ac.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < 2048; i++)
      data[i] = 1;
    var bufferSource = ac.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = true;
    return bufferSource;
  }
}(master, oscillator);
var noise;
'use strict';
noise = function () {
  var p5sound = master;
  /**
   *  Noise is a type of oscillator that generates a buffer with random values.
   *
   *  @class p5.Noise
   *  @extends p5.Oscillator
   *  @constructor
   *  @param {String} type Type of noise can be 'white' (default),
   *                       'brown' or 'pink'.
   */
  p5.Noise = function (type) {
    var assignType;
    p5.Oscillator.call(this);
    delete this.f;
    delete this.freq;
    delete this.oscillator;
    if (type === 'brown') {
      assignType = _brownNoise;
    } else if (type === 'pink') {
      assignType = _pinkNoise;
    } else {
      assignType = _whiteNoise;
    }
    this.buffer = assignType;
  };
  p5.Noise.prototype = Object.create(p5.Oscillator.prototype);
  // generate noise buffers
  var _whiteNoise = function () {
    var bufferSize = 2 * p5sound.audiocontext.sampleRate;
    var whiteBuffer = p5sound.audiocontext.createBuffer(1, bufferSize, p5sound.audiocontext.sampleRate);
    var noiseData = whiteBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    whiteBuffer.type = 'white';
    return whiteBuffer;
  }();
  var _pinkNoise = function () {
    var bufferSize = 2 * p5sound.audiocontext.sampleRate;
    var pinkBuffer = p5sound.audiocontext.createBuffer(1, bufferSize, p5sound.audiocontext.sampleRate);
    var noiseData = pinkBuffer.getChannelData(0);
    var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      noiseData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      noiseData[i] *= 0.11;
      // (roughly) compensate for gain
      b6 = white * 0.115926;
    }
    pinkBuffer.type = 'pink';
    return pinkBuffer;
  }();
  var _brownNoise = function () {
    var bufferSize = 2 * p5sound.audiocontext.sampleRate;
    var brownBuffer = p5sound.audiocontext.createBuffer(1, bufferSize, p5sound.audiocontext.sampleRate);
    var noiseData = brownBuffer.getChannelData(0);
    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      noiseData[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = noiseData[i];
      noiseData[i] *= 3.5;
    }
    brownBuffer.type = 'brown';
    return brownBuffer;
  }();
  /**
   *  Set type of noise to 'white', 'pink' or 'brown'.
   *  White is the default.
   *
   *  @method setType
   *  @param {String} [type] 'white', 'pink' or 'brown'
   */
  p5.Noise.prototype.setType = function (type) {
    switch (type) {
    case 'white':
      this.buffer = _whiteNoise;
      break;
    case 'pink':
      this.buffer = _pinkNoise;
      break;
    case 'brown':
      this.buffer = _brownNoise;
      break;
    default:
      this.buffer = _whiteNoise;
    }
    if (this.started) {
      var now = p5sound.audiocontext.currentTime;
      this.stop(now);
      this.start(now + 0.01);
    }
  };
  p5.Noise.prototype.getType = function () {
    return this.buffer.type;
  };
  p5.Noise.prototype.start = function () {
    if (this.started) {
      this.stop();
    }
    this.noise = p5sound.audiocontext.createBufferSource();
    this.noise.buffer = this.buffer;
    this.noise.loop = true;
    this.noise.connect(this.output);
    var now = p5sound.audiocontext.currentTime;
    this.noise.start(now);
    this.started = true;
  };
  p5.Noise.prototype.stop = function () {
    var now = p5sound.audiocontext.currentTime;
    if (this.noise) {
      this.noise.stop(now);
      this.started = false;
    }
  };
  p5.Noise.prototype.dispose = function () {
    var now = p5sound.audiocontext.currentTime;
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    if (this.noise) {
      this.noise.disconnect();
      this.stop(now);
    }
    if (this.output) {
      this.output.disconnect();
    }
    if (this.panner) {
      this.panner.disconnect();
    }
    this.output = null;
    this.panner = null;
    this.buffer = null;
    this.noise = null;
  };
}(master);
var audioin;
'use strict';
audioin = function () {
  var p5sound = master;
  // an array of input sources
  p5sound.inputSources = [];
  /**
   *  <p>Get audio from an input, i.e. your computer's microphone.</p>
   *
   *  <p>Turn the mic on/off with the start() and stop() methods. When the mic
   *  is on, its volume can be measured with getLevel or by connecting an
   *  FFT object.</p>
   *
   *  <p>If you want to hear the AudioIn, use the .connect() method.
   *  AudioIn does not connect to p5.sound output by default to prevent
   *  feedback.</p>
   *
   *  <p><em>Note: This uses the <a href="http://caniuse.com/stream">getUserMedia/
   *  Stream</a> API, which is not supported by certain browsers. Access in Chrome browser
   *  is limited to localhost and https, but access over http may be limited.</em></p>
   *
   *  @class p5.AudioIn
   *  @constructor
   *  @param {Function} [errorCallback] A function to call if there is an error
   *                                    accessing the AudioIn. For example,
   *                                    Safari and iOS devices do not
   *                                    currently allow microphone access.
   *  @example
   *  <div><code>
   *  var mic;
   *  function setup(){
   *    mic = new p5.AudioIn()
   *    mic.start();
   *  }
   *  function draw(){
   *    background(0);
   *    micLevel = mic.getLevel();
   *    ellipse(width/2, constrain(height-micLevel*height*5, 0, height), 10, 10);
   *  }
   *  </code></div>
   */
  p5.AudioIn = function (errorCallback) {
    // set up audio input
    /**
     * @property {GainNode} input
     */
    this.input = p5sound.audiocontext.createGain();
    /**
     * @property {GainNode} output
     */
    this.output = p5sound.audiocontext.createGain();
    /**
     * @property {MediaStream|null} stream
     */
    this.stream = null;
    /**
     * @property {MediaStreamAudioSourceNode|null} mediaStream
     */
    this.mediaStream = null;
    /**
     * @property {Number|null} currentSource
     */
    this.currentSource = null;
    /**
     *  Client must allow browser to access their microphone / audioin source.
     *  Default: false. Will become true when the client enables acces.
     *
     *  @property {Boolean} enabled
     */
    this.enabled = false;
    /**
     * Input amplitude, connect to it by default but not to master out
     *
     *  @property {p5.Amplitude} amplitude
     */
    this.amplitude = new p5.Amplitude();
    this.output.connect(this.amplitude.input);
    if (!window.MediaStreamTrack || !window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
      errorCallback ? errorCallback() : window.alert('This browser does not support MediaStreamTrack and mediaDevices');
    }
    // add to soundArray so we can dispose on close
    p5sound.soundArray.push(this);
  };
  /**
   *  Start processing audio input. This enables the use of other
   *  AudioIn methods like getLevel(). Note that by default, AudioIn
   *  is not connected to p5.sound's output. So you won't hear
   *  anything unless you use the connect() method.<br/>
   *
   *  Certain browsers limit access to the user's microphone. For example,
   *  Chrome only allows access from localhost and over https. For this reason,
   *  you may want to include an errorCallback—a function that is called in case
   *  the browser won't provide mic access.
   *
   *  @method start
   *  @param {Function} [successCallback] Name of a function to call on
   *                                    success.
   *  @param {Function} [errorCallback] Name of a function to call if
   *                                    there was an error. For example,
   *                                    some browsers do not support
   *                                    getUserMedia.
   */
  p5.AudioIn.prototype.start = function (successCallback, errorCallback) {
    var self = this;
    if (this.stream) {
      this.stop();
    }
    // set the audio source
    var audioSource = p5sound.inputSources[self.currentSource];
    var constraints = {
      audio: {
        sampleRate: p5sound.audiocontext.sampleRate,
        echoCancellation: false
      }
    };
    // if developers determine which source to use
    if (p5sound.inputSources[this.currentSource]) {
      constraints.audio.deviceId = audioSource.deviceId;
    }
    window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      self.stream = stream;
      self.enabled = true;
      // Wrap a MediaStreamSourceNode around the live input
      self.mediaStream = p5sound.audiocontext.createMediaStreamSource(stream);
      self.mediaStream.connect(self.output);
      // only send to the Amplitude reader, so we can see it but not hear it.
      self.amplitude.setInput(self.output);
      if (successCallback)
        successCallback();
    }).catch(function (err) {
      if (errorCallback)
        errorCallback(err);
      else
        console.error(err);
    });
  };
  /**
   *  Turn the AudioIn off. If the AudioIn is stopped, it cannot getLevel().
   *  If re-starting, the user may be prompted for permission access.
   *
   *  @method stop
   */
  p5.AudioIn.prototype.stop = function () {
    if (this.stream) {
      this.stream.getTracks().forEach(function (track) {
        track.stop();
      });
      this.mediaStream.disconnect();
      delete this.mediaStream;
      delete this.stream;
    }
  };
  /**
   *  Connect to an audio unit. If no parameter is provided, will
   *  connect to the master output (i.e. your speakers).<br/>
   *
   *  @method  connect
   *  @param  {Object} [unit] An object that accepts audio input,
   *                          such as an FFT
   */
  p5.AudioIn.prototype.connect = function (unit) {
    if (unit) {
      if (unit.hasOwnProperty('input')) {
        this.output.connect(unit.input);
      } else if (unit.hasOwnProperty('analyser')) {
        this.output.connect(unit.analyser);
      } else {
        this.output.connect(unit);
      }
    } else {
      this.output.connect(p5sound.input);
    }
  };
  /**
   *  Disconnect the AudioIn from all audio units. For example, if
   *  connect() had been called, disconnect() will stop sending
   *  signal to your speakers.<br/>
   *
   *  @method  disconnect
   */
  p5.AudioIn.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
      // stay connected to amplitude even if not outputting to p5
      this.output.connect(this.amplitude.input);
    }
  };
  /**
   *  Read the Amplitude (volume level) of an AudioIn. The AudioIn
   *  class contains its own instance of the Amplitude class to help
   *  make it easy to get a microphone's volume level. Accepts an
   *  optional smoothing value (0.0 < 1.0). <em>NOTE: AudioIn must
   *  .start() before using .getLevel().</em><br/>
   *
   *  @method  getLevel
   *  @param  {Number} [smoothing] Smoothing is 0.0 by default.
   *                               Smooths values based on previous values.
   *  @return {Number}           Volume level (between 0.0 and 1.0)
   */
  p5.AudioIn.prototype.getLevel = function (smoothing) {
    if (smoothing) {
      this.amplitude.smoothing = smoothing;
    }
    return this.amplitude.getLevel();
  };
  /**
   *  Set amplitude (volume) of a mic input between 0 and 1.0. <br/>
   *
   *  @method  amp
   *  @param  {Number} vol between 0 and 1.0
   *  @param {Number} [time] ramp time (optional)
   */
  p5.AudioIn.prototype.amp = function (vol, t) {
    if (t) {
      var rampTime = t || 0;
      var currentVol = this.output.gain.value;
      this.output.gain.cancelScheduledValues(p5sound.audiocontext.currentTime);
      this.output.gain.setValueAtTime(currentVol, p5sound.audiocontext.currentTime);
      this.output.gain.linearRampToValueAtTime(vol, rampTime + p5sound.audiocontext.currentTime);
    } else {
      this.output.gain.cancelScheduledValues(p5sound.audiocontext.currentTime);
      this.output.gain.setValueAtTime(vol, p5sound.audiocontext.currentTime);
    }
  };
  /**
   * Returns a list of available input sources. This is a wrapper
   * for <a title="MediaDevices.enumerateDevices() - Web APIs | MDN" target="_blank" href=
   *  "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices"
   *  > and it returns a Promise.
   *
   * @method  getSources
   * @param  {Function} [successCallback] This callback function handles the sources when they
   *                                      have been enumerated. The callback function
   *                                      receives the deviceList array as its only argument
   * @param  {Function} [errorCallback] This optional callback receives the error
   *                                    message as its argument.
   * @returns {Promise} Returns a Promise that can be used in place of the callbacks, similar
   *                            to the enumerateDevices() method
   * @example
   *  <div><code>
   *  var audiograb;
   *
   *  function setup(){
   *    //new audioIn
   *    audioGrab = new p5.AudioIn();
   *
   *    audioGrab.getSources(function(deviceList) {
   *      //print out the array of available sources
   *      console.log(deviceList);
   *      //set the source to the first item in the deviceList array
   *      audioGrab.setSource(0);
   *    });
   *  }
   *  </code></div>
   */
  p5.AudioIn.prototype.getSources = function (onSuccess, onError) {
    return new Promise(function (resolve, reject) {
      window.navigator.mediaDevices.enumerateDevices().then(function (devices) {
        p5sound.inputSources = devices.filter(function (device) {
          return device.kind === 'audioinput';
        });
        resolve(p5sound.inputSources);
        if (onSuccess) {
          onSuccess(p5sound.inputSources);
        }
      }).catch(function (error) {
        reject(error);
        if (onError) {
          onError(error);
        } else {
          console.error('This browser does not support MediaStreamTrack.getSources()');
        }
      });
    });
  };
  /**
   *  Set the input source. Accepts a number representing a
   *  position in the array returned by getSources().
   *  This is only available in browsers that support
   *  <a title="MediaDevices.enumerateDevices() - Web APIs | MDN" target="_blank" href=
   *  "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices"
   *  >navigator.mediaDevices.enumerateDevices()</a>.<br/>
   *
   *  @method setSource
   *  @param {number} num position of input source in the array
   */
  p5.AudioIn.prototype.setSource = function (num) {
    if (p5sound.inputSources.length > 0 && num < p5sound.inputSources.length) {
      // set the current source
      this.currentSource = num;
      console.log('set source to ', p5sound.inputSources[this.currentSource]);
    } else {
      console.log('unable to set input source');
    }
    // restart stream if currently active
    if (this.stream && this.stream.active) {
      this.start();
    }
  };
  // private method
  p5.AudioIn.prototype.dispose = function () {
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    this.stop();
    if (this.output) {
      this.output.disconnect();
    }
    if (this.amplitude) {
      this.amplitude.disconnect();
    }
    delete this.amplitude;
    delete this.output;
  };
}(master);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Negate;
Tone_signal_Negate = function (Tone) {
  'use strict';
  Tone.Negate = function () {
    this._multiply = this.input = this.output = new Tone.Multiply(-1);
  };
  Tone.extend(Tone.Negate, Tone.SignalBase);
  Tone.Negate.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._multiply.dispose();
    this._multiply = null;
    return this;
  };
  return Tone.Negate;
}(Tone_core_Tone, Tone_signal_Multiply);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Subtract;
Tone_signal_Subtract = function (Tone) {
  'use strict';
  Tone.Subtract = function (value) {
    this.createInsOuts(2, 0);
    this._sum = this.input[0] = this.output = new Tone.Gain();
    this._neg = new Tone.Negate();
    this._param = this.input[1] = new Tone.Signal(value);
    this._param.chain(this._neg, this._sum);
  };
  Tone.extend(Tone.Subtract, Tone.Signal);
  Tone.Subtract.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._neg.dispose();
    this._neg = null;
    this._sum.disconnect();
    this._sum = null;
    this._param.dispose();
    this._param = null;
    return this;
  };
  return Tone.Subtract;
}(Tone_core_Tone, Tone_signal_Add, Tone_signal_Negate, Tone_signal_Signal);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_GreaterThanZero;
Tone_signal_GreaterThanZero = function (Tone) {
  'use strict';
  Tone.GreaterThanZero = function () {
    this._thresh = this.output = new Tone.WaveShaper(function (val) {
      if (val <= 0) {
        return 0;
      } else {
        return 1;
      }
    }, 127);
    this._scale = this.input = new Tone.Multiply(10000);
    this._scale.connect(this._thresh);
  };
  Tone.extend(Tone.GreaterThanZero, Tone.SignalBase);
  Tone.GreaterThanZero.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._scale.dispose();
    this._scale = null;
    this._thresh.dispose();
    this._thresh = null;
    return this;
  };
  return Tone.GreaterThanZero;
}(Tone_core_Tone, Tone_signal_Signal, Tone_signal_Multiply);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_GreaterThan;
Tone_signal_GreaterThan = function (Tone) {
  'use strict';
  Tone.GreaterThan = function (value) {
    this.createInsOuts(2, 0);
    this._param = this.input[0] = new Tone.Subtract(value);
    this.input[1] = this._param.input[1];
    this._gtz = this.output = new Tone.GreaterThanZero();
    this._param.connect(this._gtz);
  };
  Tone.extend(Tone.GreaterThan, Tone.Signal);
  Tone.GreaterThan.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._param.dispose();
    this._param = null;
    this._gtz.dispose();
    this._gtz = null;
    return this;
  };
  return Tone.GreaterThan;
}(Tone_core_Tone, Tone_signal_GreaterThanZero, Tone_signal_Subtract);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Abs;
Tone_signal_Abs = function (Tone) {
  'use strict';
  Tone.Abs = function () {
    this._abs = this.input = this.output = new Tone.WaveShaper(function (val) {
      if (val === 0) {
        return 0;
      } else {
        return Math.abs(val);
      }
    }, 127);
  };
  Tone.extend(Tone.Abs, Tone.SignalBase);
  Tone.Abs.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._abs.dispose();
    this._abs = null;
    return this;
  };
  return Tone.Abs;
}(Tone_core_Tone, Tone_signal_WaveShaper);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Modulo;
Tone_signal_Modulo = function (Tone) {
  'use strict';
  Tone.Modulo = function (modulus) {
    this.createInsOuts(1, 0);
    this._shaper = new Tone.WaveShaper(Math.pow(2, 16));
    this._multiply = new Tone.Multiply();
    this._subtract = this.output = new Tone.Subtract();
    this._modSignal = new Tone.Signal(modulus);
    this.input.fan(this._shaper, this._subtract);
    this._modSignal.connect(this._multiply, 0, 0);
    this._shaper.connect(this._multiply, 0, 1);
    this._multiply.connect(this._subtract, 0, 1);
    this._setWaveShaper(modulus);
  };
  Tone.extend(Tone.Modulo, Tone.SignalBase);
  Tone.Modulo.prototype._setWaveShaper = function (mod) {
    this._shaper.setMap(function (val) {
      var multiple = Math.floor((val + 0.0001) / mod);
      return multiple;
    });
  };
  Object.defineProperty(Tone.Modulo.prototype, 'value', {
    get: function () {
      return this._modSignal.value;
    },
    set: function (mod) {
      this._modSignal.value = mod;
      this._setWaveShaper(mod);
    }
  });
  Tone.Modulo.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._shaper.dispose();
    this._shaper = null;
    this._multiply.dispose();
    this._multiply = null;
    this._subtract.dispose();
    this._subtract = null;
    this._modSignal.dispose();
    this._modSignal = null;
    return this;
  };
  return Tone.Modulo;
}(Tone_core_Tone, Tone_signal_WaveShaper, Tone_signal_Multiply);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Pow;
Tone_signal_Pow = function (Tone) {
  'use strict';
  Tone.Pow = function (exp) {
    this._exp = this.defaultArg(exp, 1);
    this._expScaler = this.input = this.output = new Tone.WaveShaper(this._expFunc(this._exp), 8192);
  };
  Tone.extend(Tone.Pow, Tone.SignalBase);
  Object.defineProperty(Tone.Pow.prototype, 'value', {
    get: function () {
      return this._exp;
    },
    set: function (exp) {
      this._exp = exp;
      this._expScaler.setMap(this._expFunc(this._exp));
    }
  });
  Tone.Pow.prototype._expFunc = function (exp) {
    return function (val) {
      return Math.pow(Math.abs(val), exp);
    };
  };
  Tone.Pow.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._expScaler.dispose();
    this._expScaler = null;
    return this;
  };
  return Tone.Pow;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_AudioToGain;
Tone_signal_AudioToGain = function (Tone) {
  'use strict';
  Tone.AudioToGain = function () {
    this._norm = this.input = this.output = new Tone.WaveShaper(function (x) {
      return (x + 1) / 2;
    });
  };
  Tone.extend(Tone.AudioToGain, Tone.SignalBase);
  Tone.AudioToGain.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._norm.dispose();
    this._norm = null;
    return this;
  };
  return Tone.AudioToGain;
}(Tone_core_Tone, Tone_signal_WaveShaper);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_Expr;
Tone_signal_Expr = function (Tone) {
  'use strict';
  Tone.Expr = function () {
    var expr = this._replacements(Array.prototype.slice.call(arguments));
    var inputCount = this._parseInputs(expr);
    this._nodes = [];
    this.input = new Array(inputCount);
    for (var i = 0; i < inputCount; i++) {
      this.input[i] = this.context.createGain();
    }
    var tree = this._parseTree(expr);
    var result;
    try {
      result = this._eval(tree);
    } catch (e) {
      this._disposeNodes();
      throw new Error('Tone.Expr: Could evaluate expression: ' + expr);
    }
    this.output = result;
  };
  Tone.extend(Tone.Expr, Tone.SignalBase);
  function applyBinary(Constructor, args, self) {
    var op = new Constructor();
    self._eval(args[0]).connect(op, 0, 0);
    self._eval(args[1]).connect(op, 0, 1);
    return op;
  }
  function applyUnary(Constructor, args, self) {
    var op = new Constructor();
    self._eval(args[0]).connect(op, 0, 0);
    return op;
  }
  function getNumber(arg) {
    return arg ? parseFloat(arg) : undefined;
  }
  function literalNumber(arg) {
    return arg && arg.args ? parseFloat(arg.args) : undefined;
  }
  Tone.Expr._Expressions = {
    'value': {
      'signal': {
        regexp: /^\d+\.\d+|^\d+/,
        method: function (arg) {
          var sig = new Tone.Signal(getNumber(arg));
          return sig;
        }
      },
      'input': {
        regexp: /^\$\d/,
        method: function (arg, self) {
          return self.input[getNumber(arg.substr(1))];
        }
      }
    },
    'glue': {
      '(': { regexp: /^\(/ },
      ')': { regexp: /^\)/ },
      ',': { regexp: /^,/ }
    },
    'func': {
      'abs': {
        regexp: /^abs/,
        method: applyUnary.bind(this, Tone.Abs)
      },
      'mod': {
        regexp: /^mod/,
        method: function (args, self) {
          var modulus = literalNumber(args[1]);
          var op = new Tone.Modulo(modulus);
          self._eval(args[0]).connect(op);
          return op;
        }
      },
      'pow': {
        regexp: /^pow/,
        method: function (args, self) {
          var exp = literalNumber(args[1]);
          var op = new Tone.Pow(exp);
          self._eval(args[0]).connect(op);
          return op;
        }
      },
      'a2g': {
        regexp: /^a2g/,
        method: function (args, self) {
          var op = new Tone.AudioToGain();
          self._eval(args[0]).connect(op);
          return op;
        }
      }
    },
    'binary': {
      '+': {
        regexp: /^\+/,
        precedence: 1,
        method: applyBinary.bind(this, Tone.Add)
      },
      '-': {
        regexp: /^\-/,
        precedence: 1,
        method: function (args, self) {
          if (args.length === 1) {
            return applyUnary(Tone.Negate, args, self);
          } else {
            return applyBinary(Tone.Subtract, args, self);
          }
        }
      },
      '*': {
        regexp: /^\*/,
        precedence: 0,
        method: applyBinary.bind(this, Tone.Multiply)
      }
    },
    'unary': {
      '-': {
        regexp: /^\-/,
        method: applyUnary.bind(this, Tone.Negate)
      },
      '!': {
        regexp: /^\!/,
        method: applyUnary.bind(this, Tone.NOT)
      }
    }
  };
  Tone.Expr.prototype._parseInputs = function (expr) {
    var inputArray = expr.match(/\$\d/g);
    var inputMax = 0;
    if (inputArray !== null) {
      for (var i = 0; i < inputArray.length; i++) {
        var inputNum = parseInt(inputArray[i].substr(1)) + 1;
        inputMax = Math.max(inputMax, inputNum);
      }
    }
    return inputMax;
  };
  Tone.Expr.prototype._replacements = function (args) {
    var expr = args.shift();
    for (var i = 0; i < args.length; i++) {
      expr = expr.replace(/\%/i, args[i]);
    }
    return expr;
  };
  Tone.Expr.prototype._tokenize = function (expr) {
    var position = -1;
    var tokens = [];
    while (expr.length > 0) {
      expr = expr.trim();
      var token = getNextToken(expr);
      tokens.push(token);
      expr = expr.substr(token.value.length);
    }
    function getNextToken(expr) {
      for (var type in Tone.Expr._Expressions) {
        var group = Tone.Expr._Expressions[type];
        for (var opName in group) {
          var op = group[opName];
          var reg = op.regexp;
          var match = expr.match(reg);
          if (match !== null) {
            return {
              type: type,
              value: match[0],
              method: op.method
            };
          }
        }
      }
      throw new SyntaxError('Tone.Expr: Unexpected token ' + expr);
    }
    return {
      next: function () {
        return tokens[++position];
      },
      peek: function () {
        return tokens[position + 1];
      }
    };
  };
  Tone.Expr.prototype._parseTree = function (expr) {
    var lexer = this._tokenize(expr);
    var isUndef = this.isUndef.bind(this);
    function matchSyntax(token, syn) {
      return !isUndef(token) && token.type === 'glue' && token.value === syn;
    }
    function matchGroup(token, groupName, prec) {
      var ret = false;
      var group = Tone.Expr._Expressions[groupName];
      if (!isUndef(token)) {
        for (var opName in group) {
          var op = group[opName];
          if (op.regexp.test(token.value)) {
            if (!isUndef(prec)) {
              if (op.precedence === prec) {
                return true;
              }
            } else {
              return true;
            }
          }
        }
      }
      return ret;
    }
    function parseExpression(precedence) {
      if (isUndef(precedence)) {
        precedence = 5;
      }
      var expr;
      if (precedence < 0) {
        expr = parseUnary();
      } else {
        expr = parseExpression(precedence - 1);
      }
      var token = lexer.peek();
      while (matchGroup(token, 'binary', precedence)) {
        token = lexer.next();
        expr = {
          operator: token.value,
          method: token.method,
          args: [
            expr,
            parseExpression(precedence - 1)
          ]
        };
        token = lexer.peek();
      }
      return expr;
    }
    function parseUnary() {
      var token, expr;
      token = lexer.peek();
      if (matchGroup(token, 'unary')) {
        token = lexer.next();
        expr = parseUnary();
        return {
          operator: token.value,
          method: token.method,
          args: [expr]
        };
      }
      return parsePrimary();
    }
    function parsePrimary() {
      var token, expr;
      token = lexer.peek();
      if (isUndef(token)) {
        throw new SyntaxError('Tone.Expr: Unexpected termination of expression');
      }
      if (token.type === 'func') {
        token = lexer.next();
        return parseFunctionCall(token);
      }
      if (token.type === 'value') {
        token = lexer.next();
        return {
          method: token.method,
          args: token.value
        };
      }
      if (matchSyntax(token, '(')) {
        lexer.next();
        expr = parseExpression();
        token = lexer.next();
        if (!matchSyntax(token, ')')) {
          throw new SyntaxError('Expected )');
        }
        return expr;
      }
      throw new SyntaxError('Tone.Expr: Parse error, cannot process token ' + token.value);
    }
    function parseFunctionCall(func) {
      var token, args = [];
      token = lexer.next();
      if (!matchSyntax(token, '(')) {
        throw new SyntaxError('Tone.Expr: Expected ( in a function call "' + func.value + '"');
      }
      token = lexer.peek();
      if (!matchSyntax(token, ')')) {
        args = parseArgumentList();
      }
      token = lexer.next();
      if (!matchSyntax(token, ')')) {
        throw new SyntaxError('Tone.Expr: Expected ) in a function call "' + func.value + '"');
      }
      return {
        method: func.method,
        args: args,
        name: name
      };
    }
    function parseArgumentList() {
      var token, expr, args = [];
      while (true) {
        expr = parseExpression();
        if (isUndef(expr)) {
          break;
        }
        args.push(expr);
        token = lexer.peek();
        if (!matchSyntax(token, ',')) {
          break;
        }
        lexer.next();
      }
      return args;
    }
    return parseExpression();
  };
  Tone.Expr.prototype._eval = function (tree) {
    if (!this.isUndef(tree)) {
      var node = tree.method(tree.args, this);
      this._nodes.push(node);
      return node;
    }
  };
  Tone.Expr.prototype._disposeNodes = function () {
    for (var i = 0; i < this._nodes.length; i++) {
      var node = this._nodes[i];
      if (this.isFunction(node.dispose)) {
        node.dispose();
      } else if (this.isFunction(node.disconnect)) {
        node.disconnect();
      }
      node = null;
      this._nodes[i] = null;
    }
    this._nodes = null;
  };
  Tone.Expr.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._disposeNodes();
  };
  return Tone.Expr;
}(Tone_core_Tone, Tone_signal_Add, Tone_signal_Subtract, Tone_signal_Multiply, Tone_signal_GreaterThan, Tone_signal_GreaterThanZero, Tone_signal_Abs, Tone_signal_Negate, Tone_signal_Modulo, Tone_signal_Pow);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_signal_EqualPowerGain;
Tone_signal_EqualPowerGain = function (Tone) {
  'use strict';
  Tone.EqualPowerGain = function () {
    this._eqPower = this.input = this.output = new Tone.WaveShaper(function (val) {
      if (Math.abs(val) < 0.001) {
        return 0;
      } else {
        return this.equalPowerScale(val);
      }
    }.bind(this), 4096);
  };
  Tone.extend(Tone.EqualPowerGain, Tone.SignalBase);
  Tone.EqualPowerGain.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._eqPower.dispose();
    this._eqPower = null;
    return this;
  };
  return Tone.EqualPowerGain;
}(Tone_core_Tone);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_component_CrossFade;
Tone_component_CrossFade = function (Tone) {
  'use strict';
  Tone.CrossFade = function (initialFade) {
    this.createInsOuts(2, 1);
    this.a = this.input[0] = new Tone.Gain();
    this.b = this.input[1] = new Tone.Gain();
    this.fade = new Tone.Signal(this.defaultArg(initialFade, 0.5), Tone.Type.NormalRange);
    this._equalPowerA = new Tone.EqualPowerGain();
    this._equalPowerB = new Tone.EqualPowerGain();
    this._invert = new Tone.Expr('1 - $0');
    this.a.connect(this.output);
    this.b.connect(this.output);
    this.fade.chain(this._equalPowerB, this.b.gain);
    this.fade.chain(this._invert, this._equalPowerA, this.a.gain);
    this._readOnly('fade');
  };
  Tone.extend(Tone.CrossFade);
  Tone.CrossFade.prototype.dispose = function () {
    Tone.prototype.dispose.call(this);
    this._writable('fade');
    this._equalPowerA.dispose();
    this._equalPowerA = null;
    this._equalPowerB.dispose();
    this._equalPowerB = null;
    this.fade.dispose();
    this.fade = null;
    this._invert.dispose();
    this._invert = null;
    this.a.dispose();
    this.a = null;
    this.b.dispose();
    this.b = null;
    return this;
  };
  return Tone.CrossFade;
}(Tone_core_Tone, Tone_signal_Signal, Tone_signal_Expr, Tone_signal_EqualPowerGain);
var effect;
'use strict';
effect = function () {
  var p5sound = master;
  var CrossFade = Tone_component_CrossFade;
  /**
   * Effect is a base class for audio effects in p5. <br>
   * This module handles the nodes and methods that are 
   * common and useful for current and future effects.
   *
   *
   * This class is extended by <a href="/reference/#/p5.Distortion">p5.Distortion</a>, 
   * <a href="/reference/#/p5.Compressor">p5.Compressor</a>,
   * <a href="/reference/#/p5.Delay">p5.Delay</a>, 
   * <a href="/reference/#/p5.Filter">p5.Filter</a>, 
   * <a href="/reference/#/p5.Reverb">p5.Reverb</a>.
   *
   * @class  p5.Effect
   * @constructor
   * 
   * @param {Object} [ac]   Reference to the audio context of the p5 object
   * @param {AudioNode} [input]  Gain Node effect wrapper
   * @param {AudioNode} [output] Gain Node effect wrapper
   * @param {Object} [_drywet]   Tone.JS CrossFade node (defaults to value: 1)
   * @param {AudioNode} [wet]  Effects that extend this class should connect
   *                              to the wet signal to this gain node, so that dry and wet 
   *                              signals are mixed properly.
   */
  p5.Effect = function () {
    this.ac = p5sound.audiocontext;
    this.input = this.ac.createGain();
    this.output = this.ac.createGain();
    /**
    *	The p5.Effect class is built
    * 	using Tone.js CrossFade
    * 	@private
    */
    this._drywet = new CrossFade(1);
    /**
     *	In classes that extend
     *	p5.Effect, connect effect nodes
     *	to the wet parameter
     */
    this.wet = this.ac.createGain();
    this.input.connect(this._drywet.a);
    this.wet.connect(this._drywet.b);
    this._drywet.connect(this.output);
    this.connect();
    //Add to the soundArray
    p5sound.soundArray.push(this);
  };
  /**
   *  Set the output volume of the filter.
   *  
   *  @method  amp
   *  @param {Number} [vol] amplitude between 0 and 1.0
   *  @param {Number} [rampTime] create a fade that lasts until rampTime 
   *  @param {Number} [tFromNow] schedule this event to happen in tFromNow seconds
   */
  p5.Effect.prototype.amp = function (vol, rampTime, tFromNow) {
    var rampTime = rampTime || 0;
    var tFromNow = tFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    var currentVol = this.output.gain.value;
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.linearRampToValueAtTime(currentVol, now + tFromNow + 0.001);
    this.output.gain.linearRampToValueAtTime(vol, now + tFromNow + rampTime + 0.001);
  };
  /**
   *	Link effects together in a chain	
   *	Example usage: filter.chain(reverb, delay, panner);
   *	May be used with an open-ended number of arguments
   *
   *	@method chain 
     *  @param {Object} [arguments]  Chain together multiple sound objects	
   */
  p5.Effect.prototype.chain = function () {
    if (arguments.length > 0) {
      this.connect(arguments[0]);
      for (var i = 1; i < arguments.length; i += 1) {
        arguments[i - 1].connect(arguments[i]);
      }
    }
    return this;
  };
  /**
   *	Adjust the dry/wet value.	
   *	
   *	@method drywet
   *	@param {Number} [fade] The desired drywet value (0 - 1.0)
   */
  p5.Effect.prototype.drywet = function (fade) {
    if (typeof fade !== 'undefined') {
      this._drywet.fade.value = fade;
    }
    return this._drywet.fade.value;
  };
  /**
   *	Send output to a p5.js-sound, Web Audio Node, or use signal to
   *	control an AudioParam	
   *	
   *	@method connect 
   *	@param {Object} unit 
   */
  p5.Effect.prototype.connect = function (unit) {
    var u = unit || p5.soundOut.input;
    this.output.connect(u.input ? u.input : u);
  };
  /**
   *	Disconnect all output.	
   *	
   *	@method disconnect 
   */
  p5.Effect.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
  };
  p5.Effect.prototype.dispose = function () {
    // remove refernce form soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    if (this.input) {
      this.input.disconnect();
      delete this.input;
    }
    if (this.output) {
      this.output.disconnect();
      delete this.output;
    }
    if (this._drywet) {
      this._drywet.disconnect();
      delete this._drywet;
    }
    if (this.wet) {
      this.wet.disconnect();
      delete this.wet;
    }
    this.ac = undefined;
  };
  return p5.Effect;
}(master, Tone_component_CrossFade);
var filter;
'use strict';
filter = function () {
  var p5sound = master;
  var Effect = effect;
  /**
   *  <p>A p5.Filter uses a Web Audio Biquad Filter to filter
   *  the frequency response of an input source. Subclasses
   *  include:</p>
   *  * <a href="/reference/#/p5.LowPass"><code>p5.LowPass</code></a>:
   *  Allows frequencies below the cutoff frequency to pass through,
   *  and attenuates frequencies above the cutoff.<br/>
   *  * <a href="/reference/#/p5.HighPass"><code>p5.HighPass</code></a>:
   *  The opposite of a lowpass filter. <br/>
   *  * <a href="/reference/#/p5.BandPass"><code>p5.BandPass</code></a>:
   *  Allows a range of frequencies to pass through and attenuates
   *  the frequencies below and above this frequency range.<br/>
   *
   *  The <code>.res()</code> method controls either width of the
   *  bandpass, or resonance of the low/highpass cutoff frequency.
   *
   *  This class extends <a href = "/reference/#/p5.Effect">p5.Effect</a>.  
   *  Methods <a href = "/reference/#/p5.Effect/amp">amp()</a>, <a href = "/reference/#/p5.Effect/chain">chain()</a>, 
   *  <a href = "/reference/#/p5.Effect/drywet">drywet()</a>, <a href = "/reference/#/p5.Effect/connect">connect()</a>, and 
   *  <a href = "/reference/#/p5.Effect/disconnect">disconnect()</a> are available.
   *
   *  @class p5.Filter
   *  @extends p5.Effect
   *  @constructor
   *  @param {String} [type] 'lowpass' (default), 'highpass', 'bandpass'
   *  @example
   *  <div><code>
   *  var fft, noise, filter;
   *
   *  function setup() {
   *    fill(255, 40, 255);
   *
   *    filter = new p5.BandPass();
   *
   *    noise = new p5.Noise();
   *    // disconnect unfiltered noise,
   *    // and connect to filter
   *    noise.disconnect();
   *    noise.connect(filter);
   *    noise.start();
   *
   *    fft = new p5.FFT();
   *  }
   *
   *  function draw() {
   *    background(30);
   *
   *    // set the BandPass frequency based on mouseX
   *    var freq = map(mouseX, 0, width, 20, 10000);
   *    filter.freq(freq);
   *    // give the filter a narrow band (lower res = wider bandpass)
   *    filter.res(50);
   *
   *    // draw filtered spectrum
   *    var spectrum = fft.analyze();
   *    noStroke();
   *    for (var i = 0; i < spectrum.length; i++) {
   *      var x = map(i, 0, spectrum.length, 0, width);
   *      var h = -height + map(spectrum[i], 0, 255, height, 0);
   *      rect(x, height, width/spectrum.length, h);
   *    }
   *
   *    isMouseOverCanvas();
   *  }
   *
   *  function isMouseOverCanvas() {
   *    var mX = mouseX, mY = mouseY;
   *    if (mX > 0 && mX < width && mY < height && mY > 0) {
   *      noise.amp(0.5, 0.2);
   *    } else {
   *      noise.amp(0, 0.2);
   *    }
   *  }
   *  </code></div>
   */
  //constructor with inheritance
  p5.Filter = function (type) {
    Effect.call(this);
    //add extend Effect by adding a Biquad Filter
    /**
        *  The p5.Filter is built with a
        *  <a href="http://www.w3.org/TR/webaudio/#BiquadFilterNode">
        *  Web Audio BiquadFilter Node</a>.
        *
        *  @property {DelayNode} biquadFilter
     */
    this.biquad = this.ac.createBiquadFilter();
    this.input.connect(this.biquad);
    this.biquad.connect(this.wet);
    if (type) {
      this.setType(type);
    }
    //Properties useful for the toggle method.
    this._on = true;
    this._untoggledType = this.biquad.type;
  };
  p5.Filter.prototype = Object.create(Effect.prototype);
  /**
   *  Filter an audio signal according to a set
   *  of filter parameters.
   *
   *  @method  process
   *  @param  {Object} Signal  An object that outputs audio
   *  @param {Number} [freq] Frequency in Hz, from 10 to 22050
   *  @param {Number} [res] Resonance/Width of the filter frequency
   *                        from 0.001 to 1000
   */
  p5.Filter.prototype.process = function (src, freq, res, time) {
    src.connect(this.input);
    this.set(freq, res, time);
  };
  /**
   *  Set the frequency and the resonance of the filter.
   *
   *  @method  set
   *  @param {Number} [freq] Frequency in Hz, from 10 to 22050
   *  @param {Number} [res]  Resonance (Q) from 0.001 to 1000
   *  @param {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   */
  p5.Filter.prototype.set = function (freq, res, time) {
    if (freq) {
      this.freq(freq, time);
    }
    if (res) {
      this.res(res, time);
    }
  };
  /**
   *  Set the filter frequency, in Hz, from 10 to 22050 (the range of
   *  human hearing, although in reality most people hear in a narrower
   *  range).
   *
   *  @method  freq
   *  @param  {Number} freq Filter Frequency
   *  @param {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   *  @return {Number} value  Returns the current frequency value
   */
  p5.Filter.prototype.freq = function (freq, time) {
    var t = time || 0;
    if (freq <= 0) {
      freq = 1;
    }
    if (typeof freq === 'number') {
      this.biquad.frequency.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.biquad.frequency.exponentialRampToValueAtTime(freq, this.ac.currentTime + 0.02 + t);
    } else if (freq) {
      freq.connect(this.biquad.frequency);
    }
    return this.biquad.frequency.value;
  };
  /**
   *  Controls either width of a bandpass frequency,
   *  or the resonance of a low/highpass cutoff frequency.
   *
   *  @method  res
   *  @param {Number} res  Resonance/Width of filter freq
   *                       from 0.001 to 1000
   *  @param {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   *  @return {Number} value Returns the current res value
   */
  p5.Filter.prototype.res = function (res, time) {
    var t = time || 0;
    if (typeof res === 'number') {
      this.biquad.Q.value = res;
      this.biquad.Q.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.biquad.Q.linearRampToValueAtTime(res, this.ac.currentTime + 0.02 + t);
    } else if (res) {
      res.connect(this.biquad.Q);
    }
    return this.biquad.Q.value;
  };
  /**
   * Controls the gain attribute of a Biquad Filter.
   * This is distinctly different from .amp() which is inherited from p5.Effect
   * .amp() controls the volume via the output gain node
   * p5.Filter.gain() controls the gain parameter of a Biquad Filter node.
   *
   * @method gain
   * @param  {Number} gain 
   * @return {Number} Returns the current or updated gain value
   */
  p5.Filter.prototype.gain = function (gain, time) {
    var t = time || 0;
    if (typeof gain === 'number') {
      this.biquad.gain.value = gain;
      this.biquad.gain.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.biquad.gain.linearRampToValueAtTime(gain, this.ac.currentTime + 0.02 + t);
    } else if (gain) {
      gain.connect(this.biquad.gain);
    }
    return this.biquad.gain.value;
  };
  /**
   * Toggle function. Switches between the specified type and allpass
   *
   * @method toggle
   * @return {boolean} [Toggle value]
   */
  p5.Filter.prototype.toggle = function () {
    this._on = !this._on;
    if (this._on === true) {
      this.biquad.type = this._untoggledType;
    } else if (this._on === false) {
      this.biquad.type = 'allpass';
    }
    return this._on;
  };
  /**
   *  Set the type of a p5.Filter. Possible types include:
   *  "lowpass" (default), "highpass", "bandpass",
   *  "lowshelf", "highshelf", "peaking", "notch",
   *  "allpass".
   *
   *  @method  setType
   *  @param {String} t
   */
  p5.Filter.prototype.setType = function (t) {
    this.biquad.type = t;
    this._untoggledType = this.biquad.type;
  };
  p5.Filter.prototype.dispose = function () {
    // remove reference from soundArray
    Effect.prototype.dispose.apply(this);
    if (this.biquad) {
      this.biquad.disconnect();
      delete this.biquad;
    }
  };
  /**
   *  Constructor: <code>new p5.LowPass()</code> Filter.
   *  This is the same as creating a p5.Filter and then calling
   *  its method <code>setType('lowpass')</code>.
   *  See p5.Filter for methods.
   *
   *  @class p5.LowPass
   *  @constructor
   *  @extends p5.Filter
   */
  p5.LowPass = function () {
    p5.Filter.call(this, 'lowpass');
  };
  p5.LowPass.prototype = Object.create(p5.Filter.prototype);
  /**
   *  Constructor: <code>new p5.HighPass()</code> Filter.
   *  This is the same as creating a p5.Filter and then calling
   *  its method <code>setType('highpass')</code>.
   *  See p5.Filter for methods.
   *
   *  @class p5.HighPass
   *  @constructor
   *  @extends p5.Filter
   */
  p5.HighPass = function () {
    p5.Filter.call(this, 'highpass');
  };
  p5.HighPass.prototype = Object.create(p5.Filter.prototype);
  /**
   *  Constructor: <code>new p5.BandPass()</code> Filter.
   *  This is the same as creating a p5.Filter and then calling
   *  its method <code>setType('bandpass')</code>.
   *  See p5.Filter for methods.
   *
   *  @class p5.BandPass
   *  @constructor
   *  @extends p5.Filter
   */
  p5.BandPass = function () {
    p5.Filter.call(this, 'bandpass');
  };
  p5.BandPass.prototype = Object.create(p5.Filter.prototype);
  return p5.Filter;
}(master, effect);
var src_eqFilter;
'use strict';
src_eqFilter = function () {
  var Filter = filter;
  var p5sound = master;
  /**
   *  EQFilter extends p5.Filter with constraints
   *  necessary for the p5.EQ
   *
   *  @private
   */
  var EQFilter = function (freq, res) {
    Filter.call(this, 'peaking');
    this.disconnect();
    this.set(freq, res);
    this.biquad.gain.value = 0;
    delete this.input;
    delete this.output;
    delete this._drywet;
    delete this.wet;
  };
  EQFilter.prototype = Object.create(Filter.prototype);
  EQFilter.prototype.amp = function () {
    console.warn('`amp()` is not available for p5.EQ bands. Use `.gain()`');
  };
  EQFilter.prototype.drywet = function () {
    console.warn('`drywet()` is not available for p5.EQ bands.');
  };
  EQFilter.prototype.connect = function (unit) {
    var u = unit || p5.soundOut.input;
    if (this.biquad) {
      this.biquad.connect(u.input ? u.input : u);
    } else {
      this.output.connect(u.input ? u.input : u);
    }
  };
  EQFilter.prototype.disconnect = function () {
    if (this.biquad) {
      this.biquad.disconnect();
    }
  };
  EQFilter.prototype.dispose = function () {
    // remove reference form soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    this.disconnect();
    delete this.biquad;
  };
  return EQFilter;
}(filter, master);
var eq;
'use strict';
eq = function () {
  var Effect = effect;
  var EQFilter = src_eqFilter;
  /**
   * p5.EQ is an audio effect that performs the function of a multiband
   * audio equalizer. Equalization is used to adjust the balance of
   * frequency compoenents of an audio signal. This process is commonly used
   * in sound production and recording to change the waveform before it reaches
   * a sound output device. EQ can also be used as an audio effect to create
   * interesting distortions by filtering out parts of the spectrum. p5.EQ is
   * built using a chain of Web Audio Biquad Filter Nodes and can be
   * instantiated with 3 or 8 bands. Bands can be added or removed from
   * the EQ by directly modifying p5.EQ.bands (the array that stores filters).
   *
   * This class extends <a href = "/reference/#/p5.Effect">p5.Effect</a>.
   * Methods <a href = "/reference/#/p5.Effect/amp">amp()</a>, <a href = "/reference/#/p5.Effect/chain">chain()</a>,
   * <a href = "/reference/#/p5.Effect/drywet">drywet()</a>, <a href = "/reference/#/p5.Effect/connect">connect()</a>, and
   * <a href = "/reference/#/p5.Effect/disconnect">disconnect()</a> are available.
   *
   * @class p5.EQ
   * @constructor
   * @extends p5.Effect
   * @param {Number} [_eqsize] Constructor will accept 3 or 8, defaults to 3
   * @return {Object} p5.EQ object
   *
   * @example
   * <div><code>
   * var eq;
   * var band_names;
   * var band_index;
   * 
   * var soundFile, play;
   * 
   * function preload() {
   *   soundFormats('mp3', 'ogg');
   *   soundFile = loadSound('assets/beat');
   * }
   * 
   * function setup() {
   *   eq = new p5.EQ(3);
   *   soundFile.disconnect();
   *   eq.process(soundFile);
   * 
   *   band_names = ['lows','mids','highs'];
   *   band_index = 0;
   *   play = false;
   *   textAlign(CENTER);
   * }
   * 
   * function draw() {
   *   background(30);
   *   noStroke();
   *   fill(255);
   *   text('click to kill',50,25);
   * 
   *   fill(255, 40, 255);
   *   textSize(26);
   *   text(band_names[band_index],50,55);
   * 
   *   fill(255);
   *   textSize(9);
   *   text('space = play/pause',50,80);
   * }
   * 
   * //If mouse is over canvas, cycle to the next band and kill the frequency
   * function mouseClicked() {
   *   for (var i = 0; i < eq.bands.length; i++) {
   *     eq.bands[i].gain(0);
   *   }
   *   eq.bands[band_index].gain(-40);
   *   if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
   *     band_index === 2 ? band_index = 0 : band_index++;
   *   }
   * }
   * 
   * //use space bar to trigger play / pause
   * function keyPressed() {
   *   if (key===' ') {
   *     play = !play
   *     play ? soundFile.loop() : soundFile.pause();
   *   }
   * }
   * </code></div>
   */
  p5.EQ = function (_eqsize) {
    Effect.call(this);
    //p5.EQ can be of size (3) or (8), defaults to 3
    _eqsize = _eqsize === 3 || _eqsize === 8 ? _eqsize : 3;
    var factor;
    _eqsize === 3 ? factor = Math.pow(2, 3) : factor = 2;
    /**
      *  The p5.EQ is built with abstracted p5.Filter objects.
      *  To modify any bands, use methods of the <a 
      *  href="/reference/#/p5.Filter" title="p5.Filter reference">
      *  p5.Filter</a> API, especially `gain` and `freq`.
      *  Bands are stored in an array, with indices 0 - 3, or 0 - 7
      *  @property {Array}  bands
      *
    */
    this.bands = [];
    var freq, res;
    for (var i = 0; i < _eqsize; i++) {
      if (i === _eqsize - 1) {
        freq = 21000;
        res = 0.01;
      } else if (i === 0) {
        freq = 100;
        res = 0.1;
      } else if (i === 1) {
        freq = _eqsize === 3 ? 360 * factor : 360;
        res = 1;
      } else {
        freq = this.bands[i - 1].freq() * factor;
        res = 1;
      }
      this.bands[i] = this._newBand(freq, res);
      if (i > 0) {
        this.bands[i - 1].connect(this.bands[i].biquad);
      } else {
        this.input.connect(this.bands[i].biquad);
      }
    }
    this.bands[_eqsize - 1].connect(this.output);
  };
  p5.EQ.prototype = Object.create(Effect.prototype);
  /**
   * Process an input by connecting it to the EQ
   * @method  process
   * @param  {Object} src Audio source
   */
  p5.EQ.prototype.process = function (src) {
    src.connect(this.input);
  };
  //  /**
  //   * Set the frequency and gain of each band in the EQ. This method should be
  //   * called with 3 or 8 frequency and gain pairs, depending on the size of the EQ.
  //   * ex. eq.set(freq0, gain0, freq1, gain1, freq2, gain2);
  //   *
  //   * @method  set
  //   * @param {Number} [freq0] Frequency value for band with index 0
  //   * @param {Number} [gain0] Gain value for band with index 0
  //   * @param {Number} [freq1] Frequency value for band with index 1
  //   * @param {Number} [gain1] Gain value for band with index 1
  //   * @param {Number} [freq2] Frequency value for band with index 2
  //   * @param {Number} [gain2] Gain value for band with index 2
  //   * @param {Number} [freq3] Frequency value for band with index 3
  //   * @param {Number} [gain3] Gain value for band with index 3
  //   * @param {Number} [freq4] Frequency value for band with index 4
  //   * @param {Number} [gain4] Gain value for band with index 4
  //   * @param {Number} [freq5] Frequency value for band with index 5
  //   * @param {Number} [gain5] Gain value for band with index 5
  //   * @param {Number} [freq6] Frequency value for band with index 6
  //   * @param {Number} [gain6] Gain value for band with index 6
  //   * @param {Number} [freq7] Frequency value for band with index 7
  //   * @param {Number} [gain7] Gain value for band with index 7
  //   */
  p5.EQ.prototype.set = function () {
    if (arguments.length === this.bands.length * 2) {
      for (var i = 0; i < arguments.length; i += 2) {
        this.bands[i / 2].freq(arguments[i]);
        this.bands[i / 2].gain(arguments[i + 1]);
      }
    } else {
      console.error('Argument mismatch. .set() should be called with ' + this.bands.length * 2 + ' arguments. (one frequency and gain value pair for each band of the eq)');
    }
  };
  /**
   * Add a new band. Creates a p5.Filter and strips away everything but
   * the raw biquad filter. This method returns an abstracted p5.Filter,
   * which can be added to p5.EQ.bands, in order to create new EQ bands.
   * @private
   * @method  _newBand
   * @param  {Number} freq
   * @param  {Number} res
   * @return {Object}      Abstracted Filter
   */
  p5.EQ.prototype._newBand = function (freq, res) {
    return new EQFilter(freq, res);
  };
  p5.EQ.prototype.dispose = function () {
    Effect.prototype.dispose.apply(this);
    if (this.bands) {
      while (this.bands.length > 0) {
        delete this.bands.pop().dispose();
      }
      delete this.bands;
    }
  };
  return p5.EQ;
}(effect, src_eqFilter);
var panner3d;
'use strict';
panner3d = function () {
  var p5sound = master;
  var Effect = effect;
  /**
   * Panner3D is based on the <a title="Web Audio Panner docs"  href=
   * "https://developer.mozilla.org/en-US/docs/Web/API/PannerNode">
   * Web Audio Spatial Panner Node</a>.
   * This panner is a spatial processing node that allows audio to be positioned
   * and oriented in 3D space.
   *
   * The position is relative to an <a title="Web Audio Listener docs" href=
   * "https://developer.mozilla.org/en-US/docs/Web/API/AudioListener">
   * Audio Context Listener</a>, which can be accessed
   * by <code>p5.soundOut.audiocontext.listener</code>
   *
   *
   * @class p5.Panner3D
   * @constructor
   */
  p5.Panner3D = function () {
    Effect.call(this);
    /**
     *  <a title="Web Audio Panner docs"  href=
     *  "https://developer.mozilla.org/en-US/docs/Web/API/PannerNode">
     *  Web Audio Spatial Panner Node</a>
     *
     *  Properties include
     *    -  <a title="w3 spec for Panning Model"
     *    href="https://www.w3.org/TR/webaudio/#idl-def-PanningModelType"
     *    >panningModel</a>: "equal power" or "HRTF"
     *    -  <a title="w3 spec for Distance Model"
     *    href="https://www.w3.org/TR/webaudio/#idl-def-DistanceModelType"
     *    >distanceModel</a>: "linear", "inverse", or "exponential"
     *
     *  @property {AudioNode} panner
     *
     */
    this.panner = this.ac.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'linear';
    this.panner.connect(this.output);
    this.input.connect(this.panner);
  };
  p5.Panner3D.prototype = Object.create(Effect.prototype);
  /**
   * Connect an audio sorce
   *
   * @method  process
   * @param  {Object} src Input source
   */
  p5.Panner3D.prototype.process = function (src) {
    src.connect(this.input);
  };
  /**
   * Set the X,Y,Z position of the Panner
   * @method set
   * @param  {Number} xVal
   * @param  {Number} yVal
   * @param  {Number} zVal
   * @param  {Number} time
   * @return {Array}      Updated x, y, z values as an array
   */
  p5.Panner3D.prototype.set = function (xVal, yVal, zVal, time) {
    this.positionX(xVal, time);
    this.positionY(yVal, time);
    this.positionZ(zVal, time);
    return [
      this.panner.positionX.value,
      this.panner.positionY.value,
      this.panner.positionZ.value
    ];
  };
  /**
   * Getter and setter methods for position coordinates
   * @method positionX
   * @return {Number}      updated coordinate value
   */
  /**
   * Getter and setter methods for position coordinates
   * @method positionY
   * @return {Number}      updated coordinate value
   */
  /**
   * Getter and setter methods for position coordinates
   * @method positionZ
   * @return {Number}      updated coordinate value
   */
  p5.Panner3D.prototype.positionX = function (xVal, time) {
    var t = time || 0;
    if (typeof xVal === 'number') {
      this.panner.positionX.value = xVal;
      this.panner.positionX.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.panner.positionX.linearRampToValueAtTime(xVal, this.ac.currentTime + 0.02 + t);
    } else if (xVal) {
      xVal.connect(this.panner.positionX);
    }
    return this.panner.positionX.value;
  };
  p5.Panner3D.prototype.positionY = function (yVal, time) {
    var t = time || 0;
    if (typeof yVal === 'number') {
      this.panner.positionY.value = yVal;
      this.panner.positionY.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.panner.positionY.linearRampToValueAtTime(yVal, this.ac.currentTime + 0.02 + t);
    } else if (yVal) {
      yVal.connect(this.panner.positionY);
    }
    return this.panner.positionY.value;
  };
  p5.Panner3D.prototype.positionZ = function (zVal, time) {
    var t = time || 0;
    if (typeof zVal === 'number') {
      this.panner.positionZ.value = zVal;
      this.panner.positionZ.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.panner.positionZ.linearRampToValueAtTime(zVal, this.ac.currentTime + 0.02 + t);
    } else if (zVal) {
      zVal.connect(this.panner.positionZ);
    }
    return this.panner.positionZ.value;
  };
  /**
   * Set the X,Y,Z position of the Panner
   * @method  orient
   * @param  {Number} xVal
   * @param  {Number} yVal
   * @param  {Number} zVal
   * @param  {Number} time
   * @return {Array}      Updated x, y, z values as an array
   */
  p5.Panner3D.prototype.orient = function (xVal, yVal, zVal, time) {
    this.orientX(xVal, time);
    this.orientY(yVal, time);
    this.orientZ(zVal, time);
    return [
      this.panner.orientationX.value,
      this.panner.orientationY.value,
      this.panner.orientationZ.value
    ];
  };
  /**
   * Getter and setter methods for orient coordinates
   * @method orientX
   * @return {Number}      updated coordinate value
   */
  /**
   * Getter and setter methods for orient coordinates
   * @method orientY
   * @return {Number}      updated coordinate value
   */
  /**
   * Getter and setter methods for orient coordinates
   * @method orientZ
   * @return {Number}      updated coordinate value
   */
  p5.Panner3D.prototype.orientX = function (xVal, time) {
    var t = time || 0;
    if (typeof xVal === 'number') {
      this.panner.orientationX.value = xVal;
      this.panner.orientationX.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.panner.orientationX.linearRampToValueAtTime(xVal, this.ac.currentTime + 0.02 + t);
    } else if (xVal) {
      xVal.connect(this.panner.orientationX);
    }
    return this.panner.orientationX.value;
  };
  p5.Panner3D.prototype.orientY = function (yVal, time) {
    var t = time || 0;
    if (typeof yVal === 'number') {
      this.panner.orientationY.value = yVal;
      this.panner.orientationY.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.panner.orientationY.linearRampToValueAtTime(yVal, this.ac.currentTime + 0.02 + t);
    } else if (yVal) {
      yVal.connect(this.panner.orientationY);
    }
    return this.panner.orientationY.value;
  };
  p5.Panner3D.prototype.orientZ = function (zVal, time) {
    var t = time || 0;
    if (typeof zVal === 'number') {
      this.panner.orientationZ.value = zVal;
      this.panner.orientationZ.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.panner.orientationZ.linearRampToValueAtTime(zVal, this.ac.currentTime + 0.02 + t);
    } else if (zVal) {
      zVal.connect(this.panner.orientationZ);
    }
    return this.panner.orientationZ.value;
  };
  /**
   * Set the rolloff factor and max distance
   * @method  setFalloff
   * @param {Number} [maxDistance]
   * @param {Number} [rolloffFactor]
   */
  p5.Panner3D.prototype.setFalloff = function (maxDistance, rolloffFactor) {
    this.maxDist(maxDistance);
    this.rolloff(rolloffFactor);
  };
  /**
   * Maxium distance between the source and the listener
   * @method  maxDist
   * @param  {Number} maxDistance
   * @return {Number} updated value
   */
  p5.Panner3D.prototype.maxDist = function (maxDistance) {
    if (typeof maxDistance === 'number') {
      this.panner.maxDistance = maxDistance;
    }
    return this.panner.maxDistance;
  };
  /**
   * How quickly the volume is reduced as the source moves away from the listener
   * @method  rollof
   * @param  {Number} rolloffFactor
   * @return {Number} updated value
   */
  p5.Panner3D.prototype.rolloff = function (rolloffFactor) {
    if (typeof rolloffFactor === 'number') {
      this.panner.rolloffFactor = rolloffFactor;
    }
    return this.panner.rolloffFactor;
  };
  p5.Panner3D.dispose = function () {
    Effect.prototype.dispose.apply(this);
    if (this.panner) {
      this.panner.disconnect();
      delete this.panner;
    }
  };
  return p5.Panner3D;
}(master, effect);
var listener3d;
'use strict';
listener3d = function () {
  var p5sound = master;
  var Effect = effect;
  //  /**
  //   * listener is a class that can construct both a Spatial Panner
  //   * and a Spatial Listener. The panner is based on the 
  //   * Web Audio Spatial Panner Node
  //   * https://www.w3.org/TR/webaudio/#the-listenernode-interface
  //   * This panner is a spatial processing node that allows audio to be positioned
  //   * and oriented in 3D space. 
  //   *
  //   * The Listener modifies the properties of the Audio Context Listener. 
  //   * Both objects types use the same methods. The default is a spatial panner.
  //   *
  //   * <code>p5.Panner3D</code> - Constructs a Spatial Panner<br/>
  //   * <code>p5.Listener3D</code> - Constructs a Spatial Listener<br/>
  //   *
  //   * @class listener
  //   * @constructor
  //   * @return {Object} p5.Listener3D Object
  //   *
  //   * @param {Web Audio Node} listener Web Audio Spatial Panning Node
  //   * @param {AudioParam} listener.panningModel "equal power" or "HRTF"
  //   * @param {AudioParam} listener.distanceModel "linear", "inverse", or "exponential"
  //   * @param {String} [type] [Specify construction of a spatial panner or listener]
  //   */
  p5.Listener3D = function (type) {
    this.ac = p5sound.audiocontext;
    this.listener = this.ac.listener;
  };
  //  /**
  //   * Connect an audio sorce
  //   * @param  {Object} src Input source
  //   */
  p5.Listener3D.prototype.process = function (src) {
    src.connect(this.input);
  };
  //  /**
  //   * Set the X,Y,Z position of the Panner
  //   * @param  {[Number]} xVal
  //   * @param  {[Number]} yVal
  //   * @param  {[Number]} zVal
  //   * @param  {[Number]} time
  //   * @return {[Array]}      [Updated x, y, z values as an array]
  //   */
  p5.Listener3D.prototype.position = function (xVal, yVal, zVal, time) {
    this.positionX(xVal, time);
    this.positionY(yVal, time);
    this.positionZ(zVal, time);
    return [
      this.listener.positionX.value,
      this.listener.positionY.value,
      this.listener.positionZ.value
    ];
  };
  //  /**
  //   * Getter and setter methods for position coordinates
  //   * @return {Number}      [updated coordinate value]
  //   */
  p5.Listener3D.prototype.positionX = function (xVal, time) {
    var t = time || 0;
    if (typeof xVal === 'number') {
      this.listener.positionX.value = xVal;
      this.listener.positionX.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.positionX.linearRampToValueAtTime(xVal, this.ac.currentTime + 0.02 + t);
    } else if (xVal) {
      xVal.connect(this.listener.positionX);
    }
    return this.listener.positionX.value;
  };
  p5.Listener3D.prototype.positionY = function (yVal, time) {
    var t = time || 0;
    if (typeof yVal === 'number') {
      this.listener.positionY.value = yVal;
      this.listener.positionY.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.positionY.linearRampToValueAtTime(yVal, this.ac.currentTime + 0.02 + t);
    } else if (yVal) {
      yVal.connect(this.listener.positionY);
    }
    return this.listener.positionY.value;
  };
  p5.Listener3D.prototype.positionZ = function (zVal, time) {
    var t = time || 0;
    if (typeof zVal === 'number') {
      this.listener.positionZ.value = zVal;
      this.listener.positionZ.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.positionZ.linearRampToValueAtTime(zVal, this.ac.currentTime + 0.02 + t);
    } else if (zVal) {
      zVal.connect(this.listener.positionZ);
    }
    return this.listener.positionZ.value;
  };
  // cannot define method when class definition is commented
  //  /**
  //   * Overrides the listener orient() method because Listener has slightly
  //   * different params. In human terms, Forward vectors are the direction the 
  //   * nose is pointing. Up vectors are the direction of the top of the head.
  //   *
  //   * @method orient
  //   * @param  {Number} xValF  Forward vector X direction
  //   * @param  {Number} yValF  Forward vector Y direction
  //   * @param  {Number} zValF  Forward vector Z direction
  //   * @param  {Number} xValU  Up vector X direction
  //   * @param  {Number} yValU  Up vector Y direction
  //   * @param  {Number} zValU  Up vector Z direction
  //   * @param  {Number} time  
  //   * @return {Array}       All orienation params
  //   */
  p5.Listener3D.prototype.orient = function (xValF, yValF, zValF, xValU, yValU, zValU, time) {
    if (arguments.length === 3 || arguments.length === 4) {
      time = arguments[3];
      this.orientForward(xValF, yValF, zValF, time);
    } else if (arguments.length === 6 || arguments === 7) {
      this.orientForward(xValF, yValF, zValF);
      this.orientUp(xValU, yValU, zValU, time);
    }
    return [
      this.listener.forwardX.value,
      this.listener.forwardY.value,
      this.listener.forwardZ.value,
      this.listener.upX.value,
      this.listener.upY.value,
      this.listener.upZ.value
    ];
  };
  p5.Listener3D.prototype.orientForward = function (xValF, yValF, zValF, time) {
    this.forwardX(xValF, time);
    this.forwardY(yValF, time);
    this.forwardZ(zValF, time);
    return [
      this.listener.forwardX,
      this.listener.forwardY,
      this.listener.forwardZ
    ];
  };
  p5.Listener3D.prototype.orientUp = function (xValU, yValU, zValU, time) {
    this.upX(xValU, time);
    this.upY(yValU, time);
    this.upZ(zValU, time);
    return [
      this.listener.upX,
      this.listener.upY,
      this.listener.upZ
    ];
  };
  //  /**
  //   * Getter and setter methods for orient coordinates
  //   * @return {Number}      [updated coordinate value]
  //   */
  p5.Listener3D.prototype.forwardX = function (xVal, time) {
    var t = time || 0;
    if (typeof xVal === 'number') {
      this.listener.forwardX.value = xVal;
      this.listener.forwardX.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.forwardX.linearRampToValueAtTime(xVal, this.ac.currentTime + 0.02 + t);
    } else if (xVal) {
      xVal.connect(this.listener.forwardX);
    }
    return this.listener.forwardX.value;
  };
  p5.Listener3D.prototype.forwardY = function (yVal, time) {
    var t = time || 0;
    if (typeof yVal === 'number') {
      this.listener.forwardY.value = yVal;
      this.listener.forwardY.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.forwardY.linearRampToValueAtTime(yVal, this.ac.currentTime + 0.02 + t);
    } else if (yVal) {
      yVal.connect(this.listener.forwardY);
    }
    return this.listener.forwardY.value;
  };
  p5.Listener3D.prototype.forwardZ = function (zVal, time) {
    var t = time || 0;
    if (typeof zVal === 'number') {
      this.listener.forwardZ.value = zVal;
      this.listener.forwardZ.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.forwardZ.linearRampToValueAtTime(zVal, this.ac.currentTime + 0.02 + t);
    } else if (zVal) {
      zVal.connect(this.listener.forwardZ);
    }
    return this.listener.forwardZ.value;
  };
  p5.Listener3D.prototype.upX = function (xVal, time) {
    var t = time || 0;
    if (typeof xVal === 'number') {
      this.listener.upX.value = xVal;
      this.listener.upX.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.upX.linearRampToValueAtTime(xVal, this.ac.currentTime + 0.02 + t);
    } else if (xVal) {
      xVal.connect(this.listener.upX);
    }
    return this.listener.upX.value;
  };
  p5.Listener3D.prototype.upY = function (yVal, time) {
    var t = time || 0;
    if (typeof yVal === 'number') {
      this.listener.upY.value = yVal;
      this.listener.upY.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.upY.linearRampToValueAtTime(yVal, this.ac.currentTime + 0.02 + t);
    } else if (yVal) {
      yVal.connect(this.listener.upY);
    }
    return this.listener.upY.value;
  };
  p5.Listener3D.prototype.upZ = function (zVal, time) {
    var t = time || 0;
    if (typeof zVal === 'number') {
      this.listener.upZ.value = zVal;
      this.listener.upZ.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.listener.upZ.linearRampToValueAtTime(zVal, this.ac.currentTime + 0.02 + t);
    } else if (zVal) {
      zVal.connect(this.listener.upZ);
    }
    return this.listener.upZ.value;
  };
  return p5.Listener3D;
}(master, effect);
var delay;
'use strict';
delay = function () {
  var Filter = filter;
  var Effect = effect;
  /**
   *  Delay is an echo effect. It processes an existing sound source,
   *  and outputs a delayed version of that sound. The p5.Delay can
   *  produce different effects depending on the delayTime, feedback,
   *  filter, and type. In the example below, a feedback of 0.5 (the
   *  defaul value) will produce a looping delay that decreases in
   *  volume by 50% each repeat. A filter will cut out the high
   *  frequencies so that the delay does not sound as piercing as the
   *  original source.
   *
   *
   *  This class extends <a href = "/reference/#/p5.Effect">p5.Effect</a>.  
   *  Methods <a href = "/reference/#/p5.Effect/amp">amp()</a>, <a href = "/reference/#/p5.Effect/chain">chain()</a>, 
   *  <a href = "/reference/#/p5.Effect/drywet">drywet()</a>, <a href = "/reference/#/p5.Effect/connect">connect()</a>, and 
   *  <a href = "/reference/#/p5.Effect/disconnect">disconnect()</a> are available.
   *  @class p5.Delay
   *  @extends p5.Effect
   *  @constructor
   *  @example
   *  <div><code>
   *  var noise, env, delay;
   *
   *  function setup() {
   *    background(0);
   *    noStroke();
   *    fill(255);
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *
   *    noise = new p5.Noise('brown');
   *    noise.amp(0);
   *    noise.start();
   *
   *    delay = new p5.Delay();
   *
   *    // delay.process() accepts 4 parameters:
   *    // source, delayTime, feedback, filter frequency
   *    // play with these numbers!!
   *    delay.process(noise, .12, .7, 2300);
   *
   *    // play the noise with an envelope,
   *    // a series of fades ( time / value pairs )
   *    env = new p5.Envelope(.01, 0.2, .2, .1);
   *  }
   *
   *  // mouseClick triggers envelope
   *  function mouseClicked() {
   *    // is mouse over canvas?
   *    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *      env.play(noise);
   *    }
   *  }
   *  </code></div>
   */
  p5.Delay = function () {
    Effect.call(this);
    this._split = this.ac.createChannelSplitter(2);
    this._merge = this.ac.createChannelMerger(2);
    this._leftGain = this.ac.createGain();
    this._rightGain = this.ac.createGain();
    /**
     *  The p5.Delay is built with two
     *  <a href="http://www.w3.org/TR/webaudio/#DelayNode">
     *  Web Audio Delay Nodes</a>, one for each stereo channel.
     *
     *  @property {DelayNode} leftDelay
     */
    this.leftDelay = this.ac.createDelay();
    /**
     *  The p5.Delay is built with two
     *  <a href="http://www.w3.org/TR/webaudio/#DelayNode">
     *  Web Audio Delay Nodes</a>, one for each stereo channel.
     *
     *  @property {DelayNode} rightDelay
     */
    this.rightDelay = this.ac.createDelay();
    this._leftFilter = new Filter();
    this._rightFilter = new Filter();
    this._leftFilter.disconnect();
    this._rightFilter.disconnect();
    this._leftFilter.biquad.frequency.setValueAtTime(1200, this.ac.currentTime);
    this._rightFilter.biquad.frequency.setValueAtTime(1200, this.ac.currentTime);
    this._leftFilter.biquad.Q.setValueAtTime(0.3, this.ac.currentTime);
    this._rightFilter.biquad.Q.setValueAtTime(0.3, this.ac.currentTime);
    // graph routing
    this.input.connect(this._split);
    this.leftDelay.connect(this._leftGain);
    this.rightDelay.connect(this._rightGain);
    this._leftGain.connect(this._leftFilter.input);
    this._rightGain.connect(this._rightFilter.input);
    this._merge.connect(this.wet);
    this._leftFilter.biquad.gain.setValueAtTime(1, this.ac.currentTime);
    this._rightFilter.biquad.gain.setValueAtTime(1, this.ac.currentTime);
    // default routing
    this.setType(0);
    this._maxDelay = this.leftDelay.delayTime.maxValue;
    // set initial feedback to 0.5
    this.feedback(0.5);
  };
  p5.Delay.prototype = Object.create(Effect.prototype);
  /**
   *  Add delay to an audio signal according to a set
   *  of delay parameters.
   *
   *  @method  process
   *  @param  {Object} Signal  An object that outputs audio
   *  @param  {Number} [delayTime] Time (in seconds) of the delay/echo.
   *                               Some browsers limit delayTime to
   *                               1 second.
   *  @param  {Number} [feedback]  sends the delay back through itself
   *                               in a loop that decreases in volume
   *                               each time.
   *  @param  {Number} [lowPass]   Cutoff frequency. Only frequencies
   *                               below the lowPass will be part of the
   *                               delay.
   */
  p5.Delay.prototype.process = function (src, _delayTime, _feedback, _filter) {
    var feedback = _feedback || 0;
    var delayTime = _delayTime || 0;
    if (feedback >= 1) {
      throw new Error('Feedback value will force a positive feedback loop.');
    }
    if (delayTime >= this._maxDelay) {
      throw new Error('Delay Time exceeds maximum delay time of ' + this._maxDelay + ' second.');
    }
    src.connect(this.input);
    this.leftDelay.delayTime.setValueAtTime(delayTime, this.ac.currentTime);
    this.rightDelay.delayTime.setValueAtTime(delayTime, this.ac.currentTime);
    this._leftGain.gain.value = feedback;
    this._rightGain.gain.value = feedback;
    if (_filter) {
      this._leftFilter.freq(_filter);
      this._rightFilter.freq(_filter);
    }
  };
  /**
   *  Set the delay (echo) time, in seconds. Usually this value will be
   *  a floating point number between 0.0 and 1.0.
   *
   *  @method  delayTime
   *  @param {Number} delayTime Time (in seconds) of the delay
   */
  p5.Delay.prototype.delayTime = function (t) {
    // if t is an audio node...
    if (typeof t !== 'number') {
      t.connect(this.leftDelay.delayTime);
      t.connect(this.rightDelay.delayTime);
    } else {
      this.leftDelay.delayTime.cancelScheduledValues(this.ac.currentTime);
      this.rightDelay.delayTime.cancelScheduledValues(this.ac.currentTime);
      this.leftDelay.delayTime.linearRampToValueAtTime(t, this.ac.currentTime);
      this.rightDelay.delayTime.linearRampToValueAtTime(t, this.ac.currentTime);
    }
  };
  /**
   *  Feedback occurs when Delay sends its signal back through its input
   *  in a loop. The feedback amount determines how much signal to send each
   *  time through the loop. A feedback greater than 1.0 is not desirable because
   *  it will increase the overall output each time through the loop,
   *  creating an infinite feedback loop. The default value is 0.5
   *
   *  @method  feedback
   *  @param {Number|Object} feedback 0.0 to 1.0, or an object such as an
   *                                  Oscillator that can be used to
   *                                  modulate this param
   *  @returns {Number} Feedback value
   *
   */
  p5.Delay.prototype.feedback = function (f) {
    // if f is an audio node...
    if (f && typeof f !== 'number') {
      f.connect(this._leftGain.gain);
      f.connect(this._rightGain.gain);
    } else if (f >= 1) {
      throw new Error('Feedback value will force a positive feedback loop.');
    } else if (typeof f === 'number') {
      this._leftGain.gain.value = f;
      this._rightGain.gain.value = f;
    }
    // return value of feedback
    return this._leftGain.gain.value;
  };
  /**
   *  Set a lowpass filter frequency for the delay. A lowpass filter
   *  will cut off any frequencies higher than the filter frequency.
   *
   *  @method  filter
   *  @param {Number|Object} cutoffFreq  A lowpass filter will cut off any
   *                              frequencies higher than the filter frequency.
   *  @param {Number|Object} res  Resonance of the filter frequency
   *                              cutoff, or an object (i.e. a p5.Oscillator)
   *                              that can be used to modulate this parameter.
   *                              High numbers (i.e. 15) will produce a resonance,
   *                              low numbers (i.e. .2) will produce a slope.
   */
  p5.Delay.prototype.filter = function (freq, q) {
    this._leftFilter.set(freq, q);
    this._rightFilter.set(freq, q);
  };
  /**
   *  Choose a preset type of delay. 'pingPong' bounces the signal
   *  from the left to the right channel to produce a stereo effect.
   *  Any other parameter will revert to the default delay setting.
   *
   *  @method  setType
   *  @param {String|Number} type 'pingPong' (1) or 'default' (0)
   */
  p5.Delay.prototype.setType = function (t) {
    if (t === 1) {
      t = 'pingPong';
    }
    this._split.disconnect();
    this._leftFilter.disconnect();
    this._rightFilter.disconnect();
    this._split.connect(this.leftDelay, 0);
    this._split.connect(this.rightDelay, 1);
    switch (t) {
    case 'pingPong':
      this._rightFilter.setType(this._leftFilter.biquad.type);
      this._leftFilter.output.connect(this._merge, 0, 0);
      this._rightFilter.output.connect(this._merge, 0, 1);
      this._leftFilter.output.connect(this.rightDelay);
      this._rightFilter.output.connect(this.leftDelay);
      break;
    default:
      this._leftFilter.output.connect(this._merge, 0, 0);
      this._rightFilter.output.connect(this._merge, 0, 1);
      this._leftFilter.output.connect(this.leftDelay);
      this._rightFilter.output.connect(this.rightDelay);
    }
  };
  // DocBlocks for methods inherited from p5.Effect
  /**
   *  Set the output level of the delay effect.
   *
   *  @method  amp
   *  @param  {Number} volume amplitude between 0 and 1.0
   *  @param {Number} [rampTime] create a fade that lasts rampTime
   *  @param {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   */
  /**
   *  Send output to a p5.sound or web audio object
   *
   *  @method  connect
   *  @param  {Object} unit
   */
  /**
   *  Disconnect all output.
   *
   *  @method disconnect
   */
  p5.Delay.prototype.dispose = function () {
    Effect.prototype.dispose.apply(this);
    this._split.disconnect();
    this._leftFilter.dispose();
    this._rightFilter.dispose();
    this._merge.disconnect();
    this._leftGain.disconnect();
    this._rightGain.disconnect();
    this.leftDelay.disconnect();
    this.rightDelay.disconnect();
    this._split = undefined;
    this._leftFilter = undefined;
    this._rightFilter = undefined;
    this._merge = undefined;
    this._leftGain = undefined;
    this._rightGain = undefined;
    this.leftDelay = undefined;
    this.rightDelay = undefined;
  };
}(filter, effect);
var reverb;
'use strict';
reverb = function () {
  var CustomError = errorHandler;
  var Effect = effect;
  /**
   *  Reverb adds depth to a sound through a large number of decaying
   *  echoes. It creates the perception that sound is occurring in a
   *  physical space. The p5.Reverb has paramters for Time (how long does the
   *  reverb last) and decayRate (how much the sound decays with each echo)
   *  that can be set with the .set() or .process() methods. The p5.Convolver
   *  extends p5.Reverb allowing you to recreate the sound of actual physical
   *  spaces through convolution.
   *
   *  This class extends <a href = "/reference/#/p5.Effect">p5.Effect</a>.
   *  Methods <a href = "/reference/#/p5.Effect/amp">amp()</a>, <a href = "/reference/#/p5.Effect/chain">chain()</a>,
   *  <a href = "/reference/#/p5.Effect/drywet">drywet()</a>, <a href = "/reference/#/p5.Effect/connect">connect()</a>, and
   *  <a href = "/reference/#/p5.Effect/disconnect">disconnect()</a> are available.
   *
   *  @class p5.Reverb
   *  @extends p5.Effect
   *  @constructor
   *  @example
   *  <div><code>
   *  var soundFile, reverb;
   *  function preload() {
   *    soundFile = loadSound('assets/Damscray_DancingTiger.mp3');
   *  }
   *
   *  function setup() {
   *    reverb = new p5.Reverb();
   *    soundFile.disconnect(); // so we'll only hear reverb...
   *
   *    // connect soundFile to reverb, process w/
   *    // 3 second reverbTime, decayRate of 2%
   *    reverb.process(soundFile, 3, 2);
   *    soundFile.play();
   *  }
   *  </code></div>
   */
  p5.Reverb = function () {
    Effect.call(this);
    this._initConvolverNode();
    // otherwise, Safari distorts
    this.input.gain.value = 0.5;
    // default params
    this._seconds = 3;
    this._decay = 2;
    this._reverse = false;
    this._buildImpulse();
  };
  p5.Reverb.prototype = Object.create(Effect.prototype);
  p5.Reverb.prototype._initConvolverNode = function () {
    this.convolverNode = this.ac.createConvolver();
    this.input.connect(this.convolverNode);
    this.convolverNode.connect(this.wet);
  };
  p5.Reverb.prototype._teardownConvolverNode = function () {
    if (this.convolverNode) {
      this.convolverNode.disconnect();
      delete this.convolverNode;
    }
  };
  p5.Reverb.prototype._setBuffer = function (audioBuffer) {
    this._teardownConvolverNode();
    this._initConvolverNode();
    this.convolverNode.buffer = audioBuffer;
  };
  /**
   *  Connect a source to the reverb, and assign reverb parameters.
   *
   *  @method  process
   *  @param  {Object} src     p5.sound / Web Audio object with a sound
   *                           output.
   *  @param  {Number} [seconds] Duration of the reverb, in seconds.
   *                           Min: 0, Max: 10. Defaults to 3.
   *  @param  {Number} [decayRate] Percentage of decay with each echo.
   *                            Min: 0, Max: 100. Defaults to 2.
   *  @param  {Boolean} [reverse] Play the reverb backwards or forwards.
   */
  p5.Reverb.prototype.process = function (src, seconds, decayRate, reverse) {
    src.connect(this.input);
    var rebuild = false;
    if (seconds) {
      this._seconds = seconds;
      rebuild = true;
    }
    if (decayRate) {
      this._decay = decayRate;
    }
    if (reverse) {
      this._reverse = reverse;
    }
    if (rebuild) {
      this._buildImpulse();
    }
  };
  /**
   *  Set the reverb settings. Similar to .process(), but without
   *  assigning a new input.
   *
   *  @method  set
   *  @param  {Number} [seconds] Duration of the reverb, in seconds.
   *                           Min: 0, Max: 10. Defaults to 3.
   *  @param  {Number} [decayRate] Percentage of decay with each echo.
   *                            Min: 0, Max: 100. Defaults to 2.
   *  @param  {Boolean} [reverse] Play the reverb backwards or forwards.
   */
  p5.Reverb.prototype.set = function (seconds, decayRate, reverse) {
    var rebuild = false;
    if (seconds) {
      this._seconds = seconds;
      rebuild = true;
    }
    if (decayRate) {
      this._decay = decayRate;
    }
    if (reverse) {
      this._reverse = reverse;
    }
    if (rebuild) {
      this._buildImpulse();
    }
  };
  // DocBlocks for methods inherited from p5.Effect
  /**
   *  Set the output level of the reverb effect.
   *
   *  @method  amp
   *  @param  {Number} volume amplitude between 0 and 1.0
   *  @param  {Number} [rampTime] create a fade that lasts rampTime
   *  @param  {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   */
  /**
   *  Send output to a p5.sound or web audio object
   *
   *  @method  connect
   *  @param  {Object} unit
   */
  /**
   *  Disconnect all output.
   *
   *  @method disconnect
   */
  /**
   *  Inspired by Simple Reverb by Jordan Santell
   *  https://github.com/web-audio-components/simple-reverb/blob/master/index.js
   *
   *  Utility function for building an impulse response
   *  based on the module parameters.
   *
   *  @private
   */
  p5.Reverb.prototype._buildImpulse = function () {
    var rate = this.ac.sampleRate;
    var length = rate * this._seconds;
    var decay = this._decay;
    var impulse = this.ac.createBuffer(2, length, rate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);
    var n, i;
    for (i = 0; i < length; i++) {
      n = this._reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    this._setBuffer(impulse);
  };
  p5.Reverb.prototype.dispose = function () {
    Effect.prototype.dispose.apply(this);
    this._teardownConvolverNode();
  };
  // =======================================================================
  //                          *** p5.Convolver ***
  // =======================================================================
  /**
   *  <p>p5.Convolver extends p5.Reverb. It can emulate the sound of real
   *  physical spaces through a process called <a href="
   *  https://en.wikipedia.org/wiki/Convolution_reverb#Real_space_simulation">
   *  convolution</a>.</p>
   *
   *  <p>Convolution multiplies any audio input by an "impulse response"
   *  to simulate the dispersion of sound over time. The impulse response is
   *  generated from an audio file that you provide. One way to
   *  generate an impulse response is to pop a balloon in a reverberant space
   *  and record the echo. Convolution can also be used to experiment with
   *  sound.</p>
   *
   *  <p>Use the method <code>createConvolution(path)</code> to instantiate a
   *  p5.Convolver with a path to your impulse response audio file.</p>
   *
   *  @class p5.Convolver
   *  @extends p5.Effect
   *  @constructor
   *  @param  {String}   path     path to a sound file
   *  @param  {Function} [callback] function to call when loading succeeds
   *  @param  {Function} [errorCallback] function to call if loading fails.
   *                                     This function will receive an error or
   *                                     XMLHttpRequest object with information
   *                                     about what went wrong.
   *  @example
   *  <div><code>
   *  var cVerb, sound;
   *  function preload() {
   *    // We have both MP3 and OGG versions of all sound assets
   *    soundFormats('ogg', 'mp3');
   *
   *    // Try replacing 'bx-spring' with other soundfiles like
   *    // 'concrete-tunnel' 'small-plate' 'drum' 'beatbox'
   *    cVerb = createConvolver('assets/bx-spring.mp3');
   *
   *    // Try replacing 'Damscray_DancingTiger' with
   *    // 'beat', 'doorbell', lucky_dragons_-_power_melody'
   *    sound = loadSound('assets/Damscray_DancingTiger.mp3');
   *  }
   *
   *  function setup() {
   *    // disconnect from master output...
   *    sound.disconnect();
   *
   *    // ...and process with cVerb
   *    // so that we only hear the convolution
   *    cVerb.process(sound);
   *
   *    sound.play();
   *  }
   *  </code></div>
   */
  p5.Convolver = function (path, callback, errorCallback) {
    p5.Reverb.call(this);
    /**
     *  Internally, the p5.Convolver uses the a
     *  <a href="http://www.w3.org/TR/webaudio/#ConvolverNode">
     *  Web Audio Convolver Node</a>.
     *
     *  @property {ConvolverNode} convolverNode
     */
    this._initConvolverNode();
    // otherwise, Safari distorts
    this.input.gain.value = 0.5;
    if (path) {
      this.impulses = [];
      this._loadBuffer(path, callback, errorCallback);
    } else {
      // parameters
      this._seconds = 3;
      this._decay = 2;
      this._reverse = false;
      this._buildImpulse();
    }
  };
  p5.Convolver.prototype = Object.create(p5.Reverb.prototype);
  p5.prototype.registerPreloadMethod('createConvolver', p5.prototype);
  /**
   *  Create a p5.Convolver. Accepts a path to a soundfile
   *  that will be used to generate an impulse response.
   *
   *  @method  createConvolver
   *  @param  {String}   path     path to a sound file
   *  @param  {Function} [callback] function to call if loading is successful.
   *                                The object will be passed in as the argument
   *                                to the callback function.
   *  @param  {Function} [errorCallback] function to call if loading is not successful.
   *                                A custom error will be passed in as the argument
   *                                to the callback function.
   *  @return {p5.Convolver}
   *  @example
   *  <div><code>
   *  var cVerb, sound;
   *  function preload() {
   *    // We have both MP3 and OGG versions of all sound assets
   *    soundFormats('ogg', 'mp3');
   *
   *    // Try replacing 'bx-spring' with other soundfiles like
   *    // 'concrete-tunnel' 'small-plate' 'drum' 'beatbox'
   *    cVerb = createConvolver('assets/bx-spring.mp3');
   *
   *    // Try replacing 'Damscray_DancingTiger' with
   *    // 'beat', 'doorbell', lucky_dragons_-_power_melody'
   *    sound = loadSound('assets/Damscray_DancingTiger.mp3');
   *  }
   *
   *  function setup() {
   *    // disconnect from master output...
   *    sound.disconnect();
   *
   *    // ...and process with cVerb
   *    // so that we only hear the convolution
   *    cVerb.process(sound);
   *
   *    sound.play();
   *  }
   *  </code></div>
   */
  p5.prototype.createConvolver = function (path, callback, errorCallback) {
    // if loading locally without a server
    if (window.location.origin.indexOf('file://') > -1 && window.cordova === 'undefined') {
      alert('This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS');
    }
    var self = this;
    var cReverb = new p5.Convolver(path, function (buffer) {
      if (typeof callback === 'function') {
        callback(buffer);
      }
      if (typeof self._decrementPreload === 'function') {
        self._decrementPreload();
      }
    }, errorCallback);
    cReverb.impulses = [];
    return cReverb;
  };
  /**
   *  Private method to load a buffer as an Impulse Response,
   *  assign it to the convolverNode, and add to the Array of .impulses.
   *
   *  @param   {String}   path
   *  @param   {Function} callback
   *  @param   {Function} errorCallback
   *  @private
   */
  p5.Convolver.prototype._loadBuffer = function (path, callback, errorCallback) {
    var path = p5.prototype._checkFileFormats(path);
    var self = this;
    var errorTrace = new Error().stack;
    var ac = p5.prototype.getAudioContext();
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      if (request.status === 200) {
        // on success loading file:
        ac.decodeAudioData(request.response, function (buff) {
          var buffer = {};
          var chunks = path.split('/');
          buffer.name = chunks[chunks.length - 1];
          buffer.audioBuffer = buff;
          self.impulses.push(buffer);
          self._setBuffer(buffer.audioBuffer);
          if (callback) {
            callback(buffer);
          }
        }, // error decoding buffer. "e" is undefined in Chrome 11/22/2015
        function () {
          var err = new CustomError('decodeAudioData', errorTrace, self.url);
          var msg = 'AudioContext error at decodeAudioData for ' + self.url;
          if (errorCallback) {
            err.msg = msg;
            errorCallback(err);
          } else {
            console.error(msg + '\n The error stack trace includes: \n' + err.stack);
          }
        });
      } else {
        var err = new CustomError('loadConvolver', errorTrace, self.url);
        var msg = 'Unable to load ' + self.url + '. The request status was: ' + request.status + ' (' + request.statusText + ')';
        if (errorCallback) {
          err.message = msg;
          errorCallback(err);
        } else {
          console.error(msg + '\n The error stack trace includes: \n' + err.stack);
        }
      }
    };
    // if there is another error, aside from 404...
    request.onerror = function () {
      var err = new CustomError('loadConvolver', errorTrace, self.url);
      var msg = 'There was no response from the server at ' + self.url + '. Check the url and internet connectivity.';
      if (errorCallback) {
        err.message = msg;
        errorCallback(err);
      } else {
        console.error(msg + '\n The error stack trace includes: \n' + err.stack);
      }
    };
    request.send();
  };
  p5.Convolver.prototype.set = null;
  /**
   *  Connect a source to the reverb, and assign reverb parameters.
   *
   *  @method  process
   *  @param  {Object} src     p5.sound / Web Audio object with a sound
   *                           output.
   *  @example
   *  <div><code>
   *  var cVerb, sound;
   *  function preload() {
   *    soundFormats('ogg', 'mp3');
   *
   *    cVerb = createConvolver('assets/concrete-tunnel.mp3');
   *
   *    sound = loadSound('assets/beat.mp3');
   *  }
   *
   *  function setup() {
   *    // disconnect from master output...
   *    sound.disconnect();
   *
   *    // ...and process with (i.e. connect to) cVerb
   *    // so that we only hear the convolution
   *    cVerb.process(sound);
   *
   *    sound.play();
   *  }
   *  </code></div>
   */
  p5.Convolver.prototype.process = function (src) {
    src.connect(this.input);
  };
  /**
   *  If you load multiple impulse files using the .addImpulse method,
   *  they will be stored as Objects in this Array. Toggle between them
   *  with the <code>toggleImpulse(id)</code> method.
   *
   *  @property {Array} impulses
   */
  p5.Convolver.prototype.impulses = [];
  /**
   *  Load and assign a new Impulse Response to the p5.Convolver.
   *  The impulse is added to the <code>.impulses</code> array. Previous
   *  impulses can be accessed with the <code>.toggleImpulse(id)</code>
   *  method.
   *
   *  @method  addImpulse
   *  @param  {String}   path     path to a sound file
   *  @param  {Function} callback function (optional)
   *  @param  {Function} errorCallback function (optional)
   */
  p5.Convolver.prototype.addImpulse = function (path, callback, errorCallback) {
    // if loading locally without a server
    if (window.location.origin.indexOf('file://') > -1 && window.cordova === 'undefined') {
      alert('This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS');
    }
    this._loadBuffer(path, callback, errorCallback);
  };
  /**
   *  Similar to .addImpulse, except that the <code>.impulses</code>
   *  Array is reset to save memory. A new <code>.impulses</code>
   *  array is created with this impulse as the only item.
   *
   *  @method  resetImpulse
   *  @param  {String}   path     path to a sound file
   *  @param  {Function} callback function (optional)
   *  @param  {Function} errorCallback function (optional)
   */
  p5.Convolver.prototype.resetImpulse = function (path, callback, errorCallback) {
    // if loading locally without a server
    if (window.location.origin.indexOf('file://') > -1 && window.cordova === 'undefined') {
      alert('This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS');
    }
    this.impulses = [];
    this._loadBuffer(path, callback, errorCallback);
  };
  /**
   *  If you have used <code>.addImpulse()</code> to add multiple impulses
   *  to a p5.Convolver, then you can use this method to toggle between
   *  the items in the <code>.impulses</code> Array. Accepts a parameter
   *  to identify which impulse you wish to use, identified either by its
   *  original filename (String) or by its position in the <code>.impulses
   *  </code> Array (Number).<br/>
   *  You can access the objects in the .impulses Array directly. Each
   *  Object has two attributes: an <code>.audioBuffer</code> (type:
   *  Web Audio <a href="
   *  http://webaudio.github.io/web-audio-api/#the-audiobuffer-interface">
   *  AudioBuffer)</a> and a <code>.name</code>, a String that corresponds
   *  with the original filename.
   *
   *  @method toggleImpulse
   *  @param {String|Number} id Identify the impulse by its original filename
   *                            (String), or by its position in the
   *                            <code>.impulses</code> Array (Number).
   */
  p5.Convolver.prototype.toggleImpulse = function (id) {
    if (typeof id === 'number' && id < this.impulses.length) {
      this._setBuffer(this.impulses[id].audioBuffer);
    }
    if (typeof id === 'string') {
      for (var i = 0; i < this.impulses.length; i++) {
        if (this.impulses[i].name === id) {
          this._setBuffer(this.impulses[i].audioBuffer);
          break;
        }
      }
    }
  };
  p5.Convolver.prototype.dispose = function () {
    p5.Reverb.prototype.dispose.apply(this);
    // remove all the Impulse Response buffers
    for (var i in this.impulses) {
      if (this.impulses[i]) {
        this.impulses[i] = null;
      }
    }
  };
}(errorHandler, effect);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_TimelineState;
Tone_core_TimelineState = function (Tone) {
  'use strict';
  Tone.TimelineState = function (initial) {
    Tone.Timeline.call(this);
    this._initial = initial;
  };
  Tone.extend(Tone.TimelineState, Tone.Timeline);
  Tone.TimelineState.prototype.getValueAtTime = function (time) {
    var event = this.get(time);
    if (event !== null) {
      return event.state;
    } else {
      return this._initial;
    }
  };
  Tone.TimelineState.prototype.setStateAtTime = function (state, time) {
    this.add({
      'state': state,
      'time': time
    });
  };
  return Tone.TimelineState;
}(Tone_core_Tone, Tone_core_Timeline);
/** Tone.js module by Yotam Mann, MIT License 2016  http://opensource.org/licenses/MIT **/
var Tone_core_Clock;
Tone_core_Clock = function (Tone) {
  'use strict';
  Tone.Clock = function () {
    Tone.Emitter.call(this);
    var options = this.optionsObject(arguments, [
      'callback',
      'frequency'
    ], Tone.Clock.defaults);
    this.callback = options.callback;
    this._nextTick = 0;
    this._lastState = Tone.State.Stopped;
    this.frequency = new Tone.TimelineSignal(options.frequency, Tone.Type.Frequency);
    this._readOnly('frequency');
    this.ticks = 0;
    this._state = new Tone.TimelineState(Tone.State.Stopped);
    this._boundLoop = this._loop.bind(this);
    this.context.on('tick', this._boundLoop);
  };
  Tone.extend(Tone.Clock, Tone.Emitter);
  Tone.Clock.defaults = {
    'callback': Tone.noOp,
    'frequency': 1,
    'lookAhead': 'auto'
  };
  Object.defineProperty(Tone.Clock.prototype, 'state', {
    get: function () {
      return this._state.getValueAtTime(this.now());
    }
  });
  Tone.Clock.prototype.start = function (time, offset) {
    time = this.toSeconds(time);
    if (this._state.getValueAtTime(time) !== Tone.State.Started) {
      this._state.add({
        'state': Tone.State.Started,
        'time': time,
        'offset': offset
      });
    }
    return this;
  };
  Tone.Clock.prototype.stop = function (time) {
    time = this.toSeconds(time);
    this._state.cancel(time);
    this._state.setStateAtTime(Tone.State.Stopped, time);
    return this;
  };
  Tone.Clock.prototype.pause = function (time) {
    time = this.toSeconds(time);
    if (this._state.getValueAtTime(time) === Tone.State.Started) {
      this._state.setStateAtTime(Tone.State.Paused, time);
    }
    return this;
  };
  Tone.Clock.prototype._loop = function () {
    var now = this.now();
    var lookAhead = this.context.lookAhead;
    var updateInterval = this.context.updateInterval;
    var lagCompensation = this.context.lag * 2;
    var loopInterval = now + lookAhead + updateInterval + lagCompensation;
    while (loopInterval > this._nextTick && this._state) {
      var currentState = this._state.getValueAtTime(this._nextTick);
      if (currentState !== this._lastState) {
        this._lastState = currentState;
        var event = this._state.get(this._nextTick);
        if (currentState === Tone.State.Started) {
          this._nextTick = event.time;
          if (!this.isUndef(event.offset)) {
            this.ticks = event.offset;
          }
          this.emit('start', event.time, this.ticks);
        } else if (currentState === Tone.State.Stopped) {
          this.ticks = 0;
          this.emit('stop', event.time);
        } else if (currentState === Tone.State.Paused) {
          this.emit('pause', event.time);
        }
      }
      var tickTime = this._nextTick;
      if (this.frequency) {
        this._nextTick += 1 / this.frequency.getValueAtTime(this._nextTick);
        if (currentState === Tone.State.Started) {
          this.callback(tickTime);
          this.ticks++;
        }
      }
    }
  };
  Tone.Clock.prototype.getStateAtTime = function (time) {
    time = this.toSeconds(time);
    return this._state.getValueAtTime(time);
  };
  Tone.Clock.prototype.dispose = function () {
    Tone.Emitter.prototype.dispose.call(this);
    this.context.off('tick', this._boundLoop);
    this._writable('frequency');
    this.frequency.dispose();
    this.frequency = null;
    this._boundLoop = null;
    this._nextTick = Infinity;
    this.callback = null;
    this._state.dispose();
    this._state = null;
  };
  return Tone.Clock;
}(Tone_core_Tone, Tone_signal_TimelineSignal, Tone_core_TimelineState, Tone_core_Emitter);
var metro;
'use strict';
metro = function () {
  var p5sound = master;
  // requires the Tone.js library's Clock (MIT license, Yotam Mann)
  // https://github.com/TONEnoTONE/Tone.js/
  var Clock = Tone_core_Clock;
  p5.Metro = function () {
    this.clock = new Clock({ 'callback': this.ontick.bind(this) });
    this.syncedParts = [];
    this.bpm = 120;
    // gets overridden by p5.Part
    this._init();
    this.prevTick = 0;
    this.tatumTime = 0;
    this.tickCallback = function () {
    };
  };
  p5.Metro.prototype.ontick = function (tickTime) {
    var elapsedTime = tickTime - this.prevTick;
    var secondsFromNow = tickTime - p5sound.audiocontext.currentTime;
    if (elapsedTime - this.tatumTime <= -0.02) {
      return;
    } else {
      // console.log('ok', this.syncedParts[0].phrases[0].name);
      this.prevTick = tickTime;
      // for all of the active things on the metro:
      var self = this;
      this.syncedParts.forEach(function (thisPart) {
        if (!thisPart.isPlaying)
          return;
        thisPart.incrementStep(secondsFromNow);
        // each synced source keeps track of its own beat number
        thisPart.phrases.forEach(function (thisPhrase) {
          var phraseArray = thisPhrase.sequence;
          var bNum = self.metroTicks % phraseArray.length;
          if (phraseArray[bNum] !== 0 && (self.metroTicks < phraseArray.length || !thisPhrase.looping)) {
            thisPhrase.callback(secondsFromNow, phraseArray[bNum]);
          }
        });
      });
      this.metroTicks += 1;
      this.tickCallback(secondsFromNow);
    }
  };
  p5.Metro.prototype.setBPM = function (bpm, rampTime) {
    var beatTime = 60 / (bpm * this.tatums);
    var now = p5sound.audiocontext.currentTime;
    this.tatumTime = beatTime;
    var rampTime = rampTime || 0;
    this.clock.frequency.setValueAtTime(this.clock.frequency.value, now);
    this.clock.frequency.linearRampToValueAtTime(bpm, now + rampTime);
    this.bpm = bpm;
  };
  p5.Metro.prototype.getBPM = function () {
    return this.clock.getRate() / this.tatums * 60;
  };
  p5.Metro.prototype._init = function () {
    this.metroTicks = 0;
  };
  // clear existing synced parts, add only this one
  p5.Metro.prototype.resetSync = function (part) {
    this.syncedParts = [part];
  };
  // push a new synced part to the array
  p5.Metro.prototype.pushSync = function (part) {
    this.syncedParts.push(part);
  };
  p5.Metro.prototype.start = function (timeFromNow) {
    var t = timeFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    this.clock.start(now + t);
    this.setBPM(this.bpm);
  };
  p5.Metro.prototype.stop = function (timeFromNow) {
    var t = timeFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    this.clock.stop(now + t);
  };
  p5.Metro.prototype.beatLength = function (tatums) {
    this.tatums = 1 / tatums / 4;
  };
}(master, Tone_core_Clock);
var looper;
'use strict';
looper = function () {
  var p5sound = master;
  var BPM = 120;
  /**
   *  Set the global tempo, in beats per minute, for all
   *  p5.Parts. This method will impact all active p5.Parts.
   *
   *  @method setBPM
   *  @param {Number} BPM      Beats Per Minute
   *  @param {Number} rampTime Seconds from now
   */
  p5.prototype.setBPM = function (bpm, rampTime) {
    BPM = bpm;
    for (var i in p5sound.parts) {
      if (p5sound.parts[i]) {
        p5sound.parts[i].setBPM(bpm, rampTime);
      }
    }
  };
  /**
   *  <p>A phrase is a pattern of musical events over time, i.e.
   *  a series of notes and rests.</p>
   *
   *  <p>Phrases must be added to a p5.Part for playback, and
   *  each part can play multiple phrases at the same time.
   *  For example, one Phrase might be a kick drum, another
   *  could be a snare, and another could be the bassline.</p>
   *
   *  <p>The first parameter is a name so that the phrase can be
   *  modified or deleted later. The callback is a a function that
   *  this phrase will call at every step—for example it might be
   *  called <code>playNote(value){}</code>. The array determines
   *  which value is passed into the callback at each step of the
   *  phrase. It can be numbers, an object with multiple numbers,
   *  or a zero (0) indicates a rest so the callback won't be called).</p>
   *
   *  @class p5.Phrase
   *  @constructor
   *  @param {String}   name     Name so that you can access the Phrase.
   *  @param {Function} callback The name of a function that this phrase
   *                             will call. Typically it will play a sound,
   *                             and accept two parameters: a time at which
   *                             to play the sound (in seconds from now),
   *                             and a value from the sequence array. The
   *                             time should be passed into the play() or
   *                             start() method to ensure precision.
   *  @param {Array}   sequence    Array of values to pass into the callback
   *                            at each step of the phrase.
   *  @example
   *  <div><code>
   *  var mySound, myPhrase, myPart;
   *  var pattern = [1,0,0,2,0,2,0,0];
   *  var msg = 'click to play';
   *
   *  function preload() {
   *    mySound = loadSound('assets/beatbox.mp3');
   *  }
   *
   *  function setup() {
   *    noStroke();
   *    fill(255);
   *    textAlign(CENTER);
   *    masterVolume(0.1);
   *
   *    myPhrase = new p5.Phrase('bbox', makeSound, pattern);
   *    myPart = new p5.Part();
   *    myPart.addPhrase(myPhrase);
   *    myPart.setBPM(60);
   *  }
   *
   *  function draw() {
   *    background(0);
   *    text(msg, width/2, height/2);
   *  }
   *
   *  function makeSound(time, playbackRate) {
   *    mySound.rate(playbackRate);
   *    mySound.play(time);
   *  }
   *
   *  function mouseClicked() {
   *    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *      myPart.start();
   *      msg = 'playing pattern';
   *    }
   *  }
   *
   *  </code></div>
   */
  p5.Phrase = function (name, callback, sequence) {
    this.phraseStep = 0;
    this.name = name;
    this.callback = callback;
    /**
     * Array of values to pass into the callback
     * at each step of the phrase. Depending on the callback
     * function's requirements, these values may be numbers,
     * strings, or an object with multiple parameters.
     * Zero (0) indicates a rest.
     *
     * @property {Array} sequence
     */
    this.sequence = sequence;
  };
  /**
   *  <p>A p5.Part plays back one or more p5.Phrases. Instantiate a part
   *  with steps and tatums. By default, each step represents a 1/16th note.</p>
   *
   *  <p>See p5.Phrase for more about musical timing.</p>
   *
   *  @class p5.Part
   *  @constructor
   *  @param {Number} [steps]   Steps in the part
   *  @param {Number} [tatums] Divisions of a beat, e.g. use 1/4, or 0.25 for a quater note (default is 1/16, a sixteenth note)
   *  @example
   *  <div><code>
   *  var box, drum, myPart;
   *  var boxPat = [1,0,0,2,0,2,0,0];
   *  var drumPat = [0,1,1,0,2,0,1,0];
   *  var msg = 'click to play';
   *
   *  function preload() {
   *    box = loadSound('assets/beatbox.mp3');
   *    drum = loadSound('assets/drum.mp3');
   *  }
   *
   *  function setup() {
   *    noStroke();
   *    fill(255);
   *    textAlign(CENTER);
   *    masterVolume(0.1);
   *
   *    var boxPhrase = new p5.Phrase('box', playBox, boxPat);
   *    var drumPhrase = new p5.Phrase('drum', playDrum, drumPat);
   *    myPart = new p5.Part();
   *    myPart.addPhrase(boxPhrase);
   *    myPart.addPhrase(drumPhrase);
   *    myPart.setBPM(60);
   *    masterVolume(0.1);
   *  }
   *
   *  function draw() {
   *    background(0);
   *    text(msg, width/2, height/2);
   *  }
   *
   *  function playBox(time, playbackRate) {
   *    box.rate(playbackRate);
   *    box.play(time);
   *  }
   *
   *  function playDrum(time, playbackRate) {
   *    drum.rate(playbackRate);
   *    drum.play(time);
   *  }
   *
   *  function mouseClicked() {
   *    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *      myPart.start();
   *      msg = 'playing part';
   *    }
   *  }
   *  </code></div>
   */
  p5.Part = function (steps, bLength) {
    this.length = steps || 0;
    // how many beats
    this.partStep = 0;
    this.phrases = [];
    this.isPlaying = false;
    this.noLoop();
    this.tatums = bLength || 0.0625;
    // defaults to quarter note
    this.metro = new p5.Metro();
    this.metro._init();
    this.metro.beatLength(this.tatums);
    this.metro.setBPM(BPM);
    p5sound.parts.push(this);
    this.callback = function () {
    };
  };
  /**
   *  Set the tempo of this part, in Beats Per Minute.
   *
   *  @method  setBPM
   *  @param {Number} BPM      Beats Per Minute
   *  @param {Number} [rampTime] Seconds from now
   */
  p5.Part.prototype.setBPM = function (tempo, rampTime) {
    this.metro.setBPM(tempo, rampTime);
  };
  /**
   *  Returns the tempo, in Beats Per Minute, of this part.
   *
   *  @method getBPM
   *  @return {Number}
   */
  p5.Part.prototype.getBPM = function () {
    return this.metro.getBPM();
  };
  /**
   *  Start playback of this part. It will play
   *  through all of its phrases at a speed
   *  determined by setBPM.
   *
   *  @method  start
   *  @param  {Number} [time] seconds from now
   */
  p5.Part.prototype.start = function (time) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.metro.resetSync(this);
      var t = time || 0;
      this.metro.start(t);
    }
  };
  /**
   *  Loop playback of this part. It will begin
   *  looping through all of its phrases at a speed
   *  determined by setBPM.
   *
   *  @method  loop
   *  @param  {Number} [time] seconds from now
   */
  p5.Part.prototype.loop = function (time) {
    this.looping = true;
    // rest onended function
    this.onended = function () {
      this.partStep = 0;
    };
    var t = time || 0;
    this.start(t);
  };
  /**
   *  Tell the part to stop looping.
   *
   *  @method  noLoop
   */
  p5.Part.prototype.noLoop = function () {
    this.looping = false;
    // rest onended function
    this.onended = function () {
      this.stop();
    };
  };
  /**
   *  Stop the part and cue it to step 0. Playback will resume from the begining of the Part when it is played again.
   *
   *  @method  stop
   *  @param  {Number} [time] seconds from now
   */
  p5.Part.prototype.stop = function (time) {
    this.partStep = 0;
    this.pause(time);
  };
  /**
   *  Pause the part. Playback will resume
   *  from the current step.
   *
   *  @method  pause
   *  @param  {Number} time seconds from now
   */
  p5.Part.prototype.pause = function (time) {
    this.isPlaying = false;
    var t = time || 0;
    this.metro.stop(t);
  };
  /**
   *  Add a p5.Phrase to this Part.
   *
   *  @method  addPhrase
   *  @param {p5.Phrase}   phrase   reference to a p5.Phrase
   */
  p5.Part.prototype.addPhrase = function (name, callback, array) {
    var p;
    if (arguments.length === 3) {
      p = new p5.Phrase(name, callback, array);
    } else if (arguments[0] instanceof p5.Phrase) {
      p = arguments[0];
    } else {
      throw 'invalid input. addPhrase accepts name, callback, array or a p5.Phrase';
    }
    this.phrases.push(p);
    // reset the length if phrase is longer than part's existing length
    if (p.sequence.length > this.length) {
      this.length = p.sequence.length;
    }
  };
  /**
   *  Remove a phrase from this part, based on the name it was
   *  given when it was created.
   *
   *  @method  removePhrase
   *  @param  {String} phraseName
   */
  p5.Part.prototype.removePhrase = function (name) {
    for (var i in this.phrases) {
      if (this.phrases[i].name === name) {
        this.phrases.splice(i, 1);
      }
    }
  };
  /**
   *  Get a phrase from this part, based on the name it was
   *  given when it was created. Now you can modify its array.
   *
   *  @method  getPhrase
   *  @param  {String} phraseName
   */
  p5.Part.prototype.getPhrase = function (name) {
    for (var i in this.phrases) {
      if (this.phrases[i].name === name) {
        return this.phrases[i];
      }
    }
  };
  /**
   *  Find all sequences with the specified name, and replace their patterns with the specified array.
   *
   *  @method  replaceSequence
   *  @param  {String} phraseName
   *  @param  {Array} sequence  Array of values to pass into the callback
   *                            at each step of the phrase.
   */
  p5.Part.prototype.replaceSequence = function (name, array) {
    for (var i in this.phrases) {
      if (this.phrases[i].name === name) {
        this.phrases[i].sequence = array;
      }
    }
  };
  p5.Part.prototype.incrementStep = function (time) {
    if (this.partStep < this.length - 1) {
      this.callback(time);
      this.partStep += 1;
    } else {
      if (!this.looping && this.partStep === this.length - 1) {
        console.log('done');
        // this.callback(time);
        this.onended();
      }
    }
  };
  /**
   *  Set the function that will be called at every step. This will clear the previous function.
   *
   *  @method onStep
   *  @param  {Function} callback The name of the callback
   *                              you want to fire
   *                              on every beat/tatum.
   */
  p5.Part.prototype.onStep = function (callback) {
    this.callback = callback;
  };
  // ===============
  // p5.Score
  // ===============
  /**
   *  A Score consists of a series of Parts. The parts will
   *  be played back in order. For example, you could have an
   *  A part, a B part, and a C part, and play them back in this order
   *  <code>new p5.Score(a, a, b, a, c)</code>
   *
   *  @class p5.Score
   *  @constructor
   *  @param {p5.Part} [...parts] One or multiple parts, to be played in sequence.
   */
  p5.Score = function () {
    // for all of the arguments
    this.parts = [];
    this.currentPart = 0;
    var thisScore = this;
    for (var i in arguments) {
      if (arguments[i] && this.parts[i]) {
        this.parts[i] = arguments[i];
        this.parts[i].nextPart = this.parts[i + 1];
        this.parts[i].onended = function () {
          thisScore.resetPart(i);
          playNextPart(thisScore);
        };
      }
    }
    this.looping = false;
  };
  p5.Score.prototype.onended = function () {
    if (this.looping) {
      // this.resetParts();
      this.parts[0].start();
    } else {
      this.parts[this.parts.length - 1].onended = function () {
        this.stop();
        this.resetParts();
      };
    }
    this.currentPart = 0;
  };
  /**
   *  Start playback of the score.
   *
   *  @method  start
   */
  p5.Score.prototype.start = function () {
    this.parts[this.currentPart].start();
    this.scoreStep = 0;
  };
  /**
   *  Stop playback of the score.
   *
   *  @method  stop
   */
  p5.Score.prototype.stop = function () {
    this.parts[this.currentPart].stop();
    this.currentPart = 0;
    this.scoreStep = 0;
  };
  /**
   *  Pause playback of the score.
   *
   *  @method  pause
   */
  p5.Score.prototype.pause = function () {
    this.parts[this.currentPart].stop();
  };
  /**
   *  Loop playback of the score.
   *
   *  @method  loop
   */
  p5.Score.prototype.loop = function () {
    this.looping = true;
    this.start();
  };
  /**
   *  Stop looping playback of the score. If it
   *  is currently playing, this will go into effect
   *  after the current round of playback completes.
   *
   *  @method  noLoop
   */
  p5.Score.prototype.noLoop = function () {
    this.looping = false;
  };
  p5.Score.prototype.resetParts = function () {
    var self = this;
    this.parts.forEach(function (part) {
      self.resetParts[part];
    });
  };
  p5.Score.prototype.resetPart = function (i) {
    this.parts[i].stop();
    this.parts[i].partStep = 0;
    for (var p in this.parts[i].phrases) {
      if (this.parts[i]) {
        this.parts[i].phrases[p].phraseStep = 0;
      }
    }
  };
  /**
   *  Set the tempo for all parts in the score
   *
   *  @method setBPM
   *  @param {Number} BPM      Beats Per Minute
   *  @param {Number} rampTime Seconds from now
   */
  p5.Score.prototype.setBPM = function (bpm, rampTime) {
    for (var i in this.parts) {
      if (this.parts[i]) {
        this.parts[i].setBPM(bpm, rampTime);
      }
    }
  };
  function playNextPart(aScore) {
    aScore.currentPart++;
    if (aScore.currentPart >= aScore.parts.length) {
      aScore.scoreStep = 0;
      aScore.onended();
    } else {
      aScore.scoreStep = 0;
      aScore.parts[aScore.currentPart - 1].stop();
      aScore.parts[aScore.currentPart].start();
    }
  }
}(master);
var soundloop;
'use strict';
soundloop = function () {
  var p5sound = master;
  var Clock = Tone_core_Clock;
  /**
   * SoundLoop
   *
   * @class p5.SoundLoop
   * @constructor
   *
   * @param {Function} callback this function will be called on each iteration of theloop
   * @param {Number|String} [interval] amount of time or beats for each iteration of the loop
   *                                       defaults to 1
   *
   * @example
   * <div><code>
   * var click;
   * var looper1;
   * 
   * function preload() {
   *   click = loadSound('assets/drum.mp3');
   * }
   * 
   * function setup() {
   *   //the looper's callback is passed the timeFromNow
   *   //this value should be used as a reference point from 
   *   //which to schedule sounds 
   *   looper1 = new p5.SoundLoop(function(timeFromNow){
   *     click.play(timeFromNow);
   *     background(255 * (looper1.iterations % 2));
   *     }, 2);
   *
   *   //stop after 10 iteratios;
   *   looper1.maxIterations = 10;
   *   //start the loop
   *   looper1.start();
   * }
   * </code></div>
   */
  p5.SoundLoop = function (callback, interval) {
    this.callback = callback;
    /**
       * musicalTimeMode uses <a href = "https://github.com/Tonejs/Tone.js/wiki/Time">Tone.Time</a> convention
    * true if string, false if number
       * @property {Boolean} musicalTimeMode
       */
    this.musicalTimeMode = typeof this._interval === 'number' ? false : true;
    this._interval = interval || 1;
    /**
     * musicalTimeMode variables
     * modify these only when the interval is specified in musicalTime format as a string
     */
    this._timeSignature = 4;
    this._bpm = 60;
    this.isPlaying = false;
    /**
     * Set a limit to the number of loops to play. defaults to Infinity
     * @property {Number} maxIterations
     */
    this.maxIterations = Infinity;
    var self = this;
    this.clock = new Clock({
      'callback': function (time) {
        var timeFromNow = time - p5sound.audiocontext.currentTime;
        /**
         * Do not initiate the callback if timeFromNow is < 0
         * This ususually occurs for a few milliseconds when the page
         * is not fully loaded
         *
         * The callback should only be called until maxIterations is reached
         */
        if (timeFromNow > 0 && self.iterations <= self.maxIterations) {
          self.callback(timeFromNow);
        }
      },
      'frequency': this._calcFreq()
    });
  };
  /**
   * Start the loop
   * @method  start
   * @param  {Number} [timeFromNow] schedule a starting time
   */
  p5.SoundLoop.prototype.start = function (timeFromNow) {
    var t = timeFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    if (!this.isPlaying) {
      this.clock.start(now + t);
      this.isPlaying = true;
    }
  };
  /**
   * Stop the loop
   * @method  stop
   * @param  {Number} [timeFromNow] schedule a stopping time
   */
  p5.SoundLoop.prototype.stop = function (timeFromNow) {
    var t = timeFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    if (this.isPlaying) {
      this.clock.stop(now + t);
      this.isPlaying = false;
    }
  };
  /**
   * Pause the loop
   * @method pause
   * @param  {Number} [timeFromNow] schedule a pausing time
   */
  p5.SoundLoop.prototype.pause = function (timeFromNow) {
    var t = timeFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    if (this.isPlaying) {
      this.clock.pause(now + t);
      this.isPlaying = false;
    }
  };
  /**
   * Synchronize loops. Use this method to start two more more loops in synchronization
   * or to start a loop in synchronization with a loop that is already playing
   * This method will schedule the implicit loop in sync with the explicit master loop
   * i.e. loopToStart.syncedStart(loopToSyncWith)
   * 
   * @method  syncedStart
   * @param  {Object} otherLoop   a p5.SoundLoop to sync with 
   * @param  {Number} [timeFromNow] Start the loops in sync after timeFromNow seconds
   */
  p5.SoundLoop.prototype.syncedStart = function (otherLoop, timeFromNow) {
    var t = timeFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    if (!otherLoop.isPlaying) {
      otherLoop.clock.start(now + t);
      otherLoop.isPlaying = true;
      this.clock.start(now + t);
      this.isPlaying = true;
    } else if (otherLoop.isPlaying) {
      var time = otherLoop.clock._nextTick - p5sound.audiocontext.currentTime;
      this.clock.start(now + time);
      this.isPlaying = true;
    }
  };
  /**
   * Updates frequency value, reflected in next callback
   * @private
   * @method  _update
   */
  p5.SoundLoop.prototype._update = function () {
    this.clock.frequency.value = this._calcFreq();
  };
  /**
   * Calculate the frequency of the clock's callback based on bpm, interval, and timesignature
   * @private
   * @method  _calcFreq
   * @return {Number} new clock frequency value
   */
  p5.SoundLoop.prototype._calcFreq = function () {
    //Seconds mode, bpm / timesignature has no effect
    if (typeof this._interval === 'number') {
      this.musicalTimeMode = false;
      return 1 / this._interval;
    } else if (typeof this._interval === 'string') {
      this.musicalTimeMode = true;
      return this._bpm / 60 / this._convertNotation(this._interval) * (this._timeSignature / 4);
    }
  };
  /**
   * Convert notation from musical time format to seconds
   * Uses <a href = "https://github.com/Tonejs/Tone.js/wiki/Time">Tone.Time</a> convention
   * @private
   * @method _convertNotation
   * @param  {String} value value to be converted
   * @return {Number}       converted value in seconds
   */
  p5.SoundLoop.prototype._convertNotation = function (value) {
    var type = value.slice(-1);
    value = Number(value.slice(0, -1));
    switch (type) {
    case 'm':
      return this._measure(value);
    case 'n':
      return this._note(value);
    default:
      console.warn('Specified interval is not formatted correctly. See Tone.js ' + 'timing reference for more info: https://github.com/Tonejs/Tone.js/wiki/Time');
    }
  };
  /**
   * Helper conversion methods of measure and note
   * @private
   * @method  _measure
   * @private
   * @method  _note
   */
  p5.SoundLoop.prototype._measure = function (value) {
    return value * this._timeSignature;
  };
  p5.SoundLoop.prototype._note = function (value) {
    return this._timeSignature / value;
  };
  /**
   * Getters and Setters, setting any paramter will result in a change in the clock's
   * frequency, that will be reflected after the next callback
   * beats per minute (defaults to 60)
   * @property {Number} bpm
   */
  Object.defineProperty(p5.SoundLoop.prototype, 'bpm', {
    get: function () {
      return this._bpm;
    },
    set: function (bpm) {
      if (!this.musicalTimeMode) {
        console.warn('Changing the BPM in "seconds" mode has no effect. ' + 'BPM is only relevant in musicalTimeMode ' + 'when the interval is specified as a string ' + '("2n", "4n", "1m"...etc)');
      }
      this._bpm = bpm;
      this._update();
    }
  });
  /**
   * number of quarter notes in a measure (defaults to 4)
   * @property {Number} timeSignature
   */
  Object.defineProperty(p5.SoundLoop.prototype, 'timeSignature', {
    get: function () {
      return this._timeSignature;
    },
    set: function (timeSig) {
      if (!this.musicalTimeMode) {
        console.warn('Changing the timeSignature in "seconds" mode has no effect. ' + 'BPM is only relevant in musicalTimeMode ' + 'when the interval is specified as a string ' + '("2n", "4n", "1m"...etc)');
      }
      this._timeSignature = timeSig;
      this._update();
    }
  });
  /**
   * length of the loops interval
   * @property {Number|String} interval
   */
  Object.defineProperty(p5.SoundLoop.prototype, 'interval', {
    get: function () {
      return this._interval;
    },
    set: function (interval) {
      this.musicalTimeMode = typeof interval === 'Number' ? false : true;
      this._interval = interval;
      this._update();
    }
  });
  /**
   * how many times the callback has been called so far
   * @property {Number} iterations
   * @readonly
   */
  Object.defineProperty(p5.SoundLoop.prototype, 'iterations', {
    get: function () {
      return this.clock.ticks;
    }
  });
  return p5.SoundLoop;
}(master, Tone_core_Clock);
var compressor;
compressor = function () {
  'use strict';
  var p5sound = master;
  var Effect = effect;
  var CustomError = errorHandler;
  /**
   * Compressor is an audio effect class that performs dynamics compression
   * on an audio input source. This is a very commonly used technique in music
   * and sound production. Compression creates an overall louder, richer, 
   * and fuller sound by lowering the volume of louds and raising that of softs.
   * Compression can be used to avoid clipping (sound distortion due to 
   * peaks in volume) and is especially useful when many sounds are played 
   * at once. Compression can be used on indivudal sound sources in addition
   * to the master output.  
   *
   * This class extends <a href = "/reference/#/p5.Effect">p5.Effect</a>.  
   * Methods <a href = "/reference/#/p5.Effect/amp">amp()</a>, <a href = "/reference/#/p5.Effect/chain">chain()</a>, 
   * <a href = "/reference/#/p5.Effect/drywet">drywet()</a>, <a href = "/reference/#/p5.Effect/connect">connect()</a>, and 
   * <a href = "/reference/#/p5.Effect/disconnect">disconnect()</a> are available.
   *
   * @class p5.Compressor
   * @constructor
   * @extends p5.Effect
   *
   * 
   */
  p5.Compressor = function () {
    Effect.call(this);
    /**
       * The p5.Compressor is built with a <a href="https://www.w3.org/TR/webaudio/#the-dynamicscompressornode-interface" 
     *   target="_blank" title="W3 spec for Dynamics Compressor Node">Web Audio Dynamics Compressor Node
     *   </a>
       * @property {AudioNode} compressor 
       */
    this.compressor = this.ac.createDynamicsCompressor();
    this.input.connect(this.compressor);
    this.compressor.connect(this.wet);
  };
  p5.Compressor.prototype = Object.create(Effect.prototype);
  /**
  * Performs the same function as .connect, but also accepts
  * optional parameters to set compressor's audioParams
  * @method process 
  *
  * @param {Object} src         Sound source to be connected
  * 
  * @param {Number} [attack]     The amount of time (in seconds) to reduce the gain by 10dB,
  *                            default = .003, range 0 - 1
  * @param {Number} [knee]       A decibel value representing the range above the 
  *                            threshold where the curve smoothly transitions to the "ratio" portion.
  *                            default = 30, range 0 - 40
  * @param {Number} [ratio]      The amount of dB change in input for a 1 dB change in output
  *                            default = 12, range 1 - 20
  * @param {Number} [threshold]  The decibel value above which the compression will start taking effect
  *                            default = -24, range -100 - 0
  * @param {Number} [release]    The amount of time (in seconds) to increase the gain by 10dB
  *                            default = .25, range 0 - 1
  */
  p5.Compressor.prototype.process = function (src, attack, knee, ratio, threshold, release) {
    src.connect(this.input);
    this.set(attack, knee, ratio, threshold, release);
  };
  /**
   * Set the paramters of a compressor. 
   * @method  set
   * @param {Number} attack     The amount of time (in seconds) to reduce the gain by 10dB,
   *                            default = .003, range 0 - 1
   * @param {Number} knee       A decibel value representing the range above the 
   *                            threshold where the curve smoothly transitions to the "ratio" portion.
   *                            default = 30, range 0 - 40
   * @param {Number} ratio      The amount of dB change in input for a 1 dB change in output
   *                            default = 12, range 1 - 20
   * @param {Number} threshold  The decibel value above which the compression will start taking effect
   *                            default = -24, range -100 - 0
   * @param {Number} release    The amount of time (in seconds) to increase the gain by 10dB
   *                            default = .25, range 0 - 1
   */
  p5.Compressor.prototype.set = function (attack, knee, ratio, threshold, release) {
    if (typeof attack !== 'undefined') {
      this.attack(attack);
    }
    if (typeof knee !== 'undefined') {
      this.knee(knee);
    }
    if (typeof ratio !== 'undefined') {
      this.ratio(ratio);
    }
    if (typeof threshold !== 'undefined') {
      this.threshold(threshold);
    }
    if (typeof release !== 'undefined') {
      this.release(release);
    }
  };
  /**
   * Get current attack or set value w/ time ramp
   * 
   * 
   * @method attack
   * @param {Number} [attack] Attack is the amount of time (in seconds) to reduce the gain by 10dB,
   *                          default = .003, range 0 - 1
   * @param {Number} [time]  Assign time value to schedule the change in value
   */
  p5.Compressor.prototype.attack = function (attack, time) {
    var t = time || 0;
    if (typeof attack == 'number') {
      this.compressor.attack.value = attack;
      this.compressor.attack.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.compressor.attack.linearRampToValueAtTime(attack, this.ac.currentTime + 0.02 + t);
    } else if (typeof attack !== 'undefined') {
      attack.connect(this.compressor.attack);
    }
    return this.compressor.attack.value;
  };
  /**
   * Get current knee or set value w/ time ramp
   * 
   * @method knee
   * @param {Number} [knee] A decibel value representing the range above the 
   *                        threshold where the curve smoothly transitions to the "ratio" portion.
   *                        default = 30, range 0 - 40
   * @param {Number} [time]  Assign time value to schedule the change in value
   */
  p5.Compressor.prototype.knee = function (knee, time) {
    var t = time || 0;
    if (typeof knee == 'number') {
      this.compressor.knee.value = knee;
      this.compressor.knee.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.compressor.knee.linearRampToValueAtTime(knee, this.ac.currentTime + 0.02 + t);
    } else if (typeof knee !== 'undefined') {
      knee.connect(this.compressor.knee);
    }
    return this.compressor.knee.value;
  };
  /**
   * Get current ratio or set value w/ time ramp
   * @method ratio
   *
   * @param {Number} [ratio]      The amount of dB change in input for a 1 dB change in output
   *                            default = 12, range 1 - 20 
   * @param {Number} [time]  Assign time value to schedule the change in value
   */
  p5.Compressor.prototype.ratio = function (ratio, time) {
    var t = time || 0;
    if (typeof ratio == 'number') {
      this.compressor.ratio.value = ratio;
      this.compressor.ratio.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.compressor.ratio.linearRampToValueAtTime(ratio, this.ac.currentTime + 0.02 + t);
    } else if (typeof ratio !== 'undefined') {
      ratio.connect(this.compressor.ratio);
    }
    return this.compressor.ratio.value;
  };
  /**
   * Get current threshold or set value w/ time ramp
   * @method threshold
   *
   * @param {Number} threshold  The decibel value above which the compression will start taking effect
   *                            default = -24, range -100 - 0
   * @param {Number} [time]  Assign time value to schedule the change in value
   */
  p5.Compressor.prototype.threshold = function (threshold, time) {
    var t = time || 0;
    if (typeof threshold == 'number') {
      this.compressor.threshold.value = threshold;
      this.compressor.threshold.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.compressor.threshold.linearRampToValueAtTime(threshold, this.ac.currentTime + 0.02 + t);
    } else if (typeof threshold !== 'undefined') {
      threshold.connect(this.compressor.threshold);
    }
    return this.compressor.threshold.value;
  };
  /**
   * Get current release or set value w/ time ramp
   * @method release
   *
   * @param {Number} release    The amount of time (in seconds) to increase the gain by 10dB
   *                            default = .25, range 0 - 1
   *
   * @param {Number} [time]  Assign time value to schedule the change in value
   */
  p5.Compressor.prototype.release = function (release, time) {
    var t = time || 0;
    if (typeof release == 'number') {
      this.compressor.release.value = release;
      this.compressor.release.cancelScheduledValues(this.ac.currentTime + 0.01 + t);
      this.compressor.release.linearRampToValueAtTime(release, this.ac.currentTime + 0.02 + t);
    } else if (typeof number !== 'undefined') {
      release.connect(this.compressor.release);
    }
    return this.compressor.release.value;
  };
  /**
   * Return the current reduction value
   *
   * @method reduction
   * @return {Number} Value of the amount of gain reduction that is applied to the signal
   */
  p5.Compressor.prototype.reduction = function () {
    return this.compressor.reduction.value;
  };
  p5.Compressor.prototype.dispose = function () {
    Effect.prototype.dispose.apply(this);
    if (this.compressor) {
      this.compressor.disconnect();
      delete this.compressor;
    }
  };
  return p5.Compressor;
}(master, effect, errorHandler);
var soundRecorder;
'use strict';
soundRecorder = function () {
  // inspiration: recorder.js, Tone.js & typedarray.org
  var p5sound = master;
  var convertToWav = helpers.convertToWav;
  var ac = p5sound.audiocontext;
  /**
   *  <p>Record sounds for playback and/or to save as a .wav file.
   *  The p5.SoundRecorder records all sound output from your sketch,
   *  or can be assigned a specific source with setInput().</p>
   *  <p>The record() method accepts a p5.SoundFile as a parameter.
   *  When playback is stopped (either after the given amount of time,
   *  or with the stop() method), the p5.SoundRecorder will send its
   *  recording to that p5.SoundFile for playback.</p>
   *
   *  @class p5.SoundRecorder
   *  @constructor
   *  @example
   *  <div><code>
   *  var mic, recorder, soundFile;
   *  var state = 0;
   *
   *  function setup() {
   *    background(200);
   *    // create an audio in
   *    mic = new p5.AudioIn();
   *
   *    // prompts user to enable their browser mic
   *    mic.start();
   *
   *    // create a sound recorder
   *    recorder = new p5.SoundRecorder();
   *
   *    // connect the mic to the recorder
   *    recorder.setInput(mic);
   *
   *    // this sound file will be used to
   *    // playback & save the recording
   *    soundFile = new p5.SoundFile();
   *
   *    text('keyPress to record', 20, 20);
   *  }
   *
   *  function keyPressed() {
   *    // make sure user enabled the mic
   *    if (state === 0 && mic.enabled) {
   *
   *      // record to our p5.SoundFile
   *      recorder.record(soundFile);
   *
   *      background(255,0,0);
   *      text('Recording!', 20, 20);
   *      state++;
   *    }
   *    else if (state === 1) {
   *      background(0,255,0);
   *
   *      // stop recorder and
   *      // send result to soundFile
   *      recorder.stop();
   *
   *      text('Stopped', 20, 20);
   *      state++;
   *    }
   *
   *    else if (state === 2) {
   *      soundFile.play(); // play the result!
   *      save(soundFile, 'mySound.wav');
   *      state++;
   *    }
   *  }
   *  </div></code>
   */
  p5.SoundRecorder = function () {
    this.input = ac.createGain();
    this.output = ac.createGain();
    this.recording = false;
    this.bufferSize = 1024;
    this._channels = 2;
    // stereo (default)
    this._clear();
    // initialize variables
    this._jsNode = ac.createScriptProcessor(this.bufferSize, this._channels, 2);
    this._jsNode.onaudioprocess = this._audioprocess.bind(this);
    /**
     *  callback invoked when the recording is over
     *  @private
     *  @type Function(Float32Array)
     */
    this._callback = function () {
    };
    // connections
    this._jsNode.connect(p5.soundOut._silentNode);
    this.setInput();
    // add this p5.SoundFile to the soundArray
    p5sound.soundArray.push(this);
  };
  /**
   *  Connect a specific device to the p5.SoundRecorder.
   *  If no parameter is given, p5.SoundRecorer will record
   *  all audible p5.sound from your sketch.
   *
   *  @method  setInput
   *  @param {Object} [unit] p5.sound object or a web audio unit
   *                         that outputs sound
   */
  p5.SoundRecorder.prototype.setInput = function (unit) {
    this.input.disconnect();
    this.input = null;
    this.input = ac.createGain();
    this.input.connect(this._jsNode);
    this.input.connect(this.output);
    if (unit) {
      unit.connect(this.input);
    } else {
      p5.soundOut.output.connect(this.input);
    }
  };
  /**
   *  Start recording. To access the recording, provide
   *  a p5.SoundFile as the first parameter. The p5.SoundRecorder
   *  will send its recording to that p5.SoundFile for playback once
   *  recording is complete. Optional parameters include duration
   *  (in seconds) of the recording, and a callback function that
   *  will be called once the complete recording has been
   *  transfered to the p5.SoundFile.
   *
   *  @method  record
   *  @param  {p5.SoundFile}   soundFile    p5.SoundFile
   *  @param  {Number}   [duration] Time (in seconds)
   *  @param  {Function} [callback] The name of a function that will be
   *                                called once the recording completes
   */
  p5.SoundRecorder.prototype.record = function (sFile, duration, callback) {
    this.recording = true;
    if (duration) {
      this.sampleLimit = Math.round(duration * ac.sampleRate);
    }
    if (sFile && callback) {
      this._callback = function () {
        this.buffer = this._getBuffer();
        sFile.setBuffer(this.buffer);
        callback();
      };
    } else if (sFile) {
      this._callback = function () {
        this.buffer = this._getBuffer();
        sFile.setBuffer(this.buffer);
      };
    }
  };
  /**
   *  Stop the recording. Once the recording is stopped,
   *  the results will be sent to the p5.SoundFile that
   *  was given on .record(), and if a callback function
   *  was provided on record, that function will be called.
   *
   *  @method  stop
   */
  p5.SoundRecorder.prototype.stop = function () {
    this.recording = false;
    this._callback();
    this._clear();
  };
  p5.SoundRecorder.prototype._clear = function () {
    this._leftBuffers = [];
    this._rightBuffers = [];
    this.recordedSamples = 0;
    this.sampleLimit = null;
  };
  /**
   *  internal method called on audio process
   *
   *  @private
   *  @param   {AudioProcessorEvent} event
   */
  p5.SoundRecorder.prototype._audioprocess = function (event) {
    if (this.recording === false) {
      return;
    } else if (this.recording === true) {
      // if we are past the duration, then stop... else:
      if (this.sampleLimit && this.recordedSamples >= this.sampleLimit) {
        this.stop();
      } else {
        // get channel data
        var left = event.inputBuffer.getChannelData(0);
        var right = event.inputBuffer.getChannelData(1);
        // clone the samples
        this._leftBuffers.push(new Float32Array(left));
        this._rightBuffers.push(new Float32Array(right));
        this.recordedSamples += this.bufferSize;
      }
    }
  };
  p5.SoundRecorder.prototype._getBuffer = function () {
    var buffers = [];
    buffers.push(this._mergeBuffers(this._leftBuffers));
    buffers.push(this._mergeBuffers(this._rightBuffers));
    return buffers;
  };
  p5.SoundRecorder.prototype._mergeBuffers = function (channelBuffer) {
    var result = new Float32Array(this.recordedSamples);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++) {
      var buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  };
  p5.SoundRecorder.prototype.dispose = function () {
    this._clear();
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    this._callback = function () {
    };
    if (this.input) {
      this.input.disconnect();
    }
    this.input = null;
    this._jsNode = null;
  };
  /**
   * Save a p5.SoundFile as a .wav file. The browser will prompt the user
   * to download the file to their device.
   * For uploading audio to a server, use
   * <a href="/docs/reference/#/p5.SoundFile/saveBlob">`p5.SoundFile.saveBlob`</a>.
   *
   *  @for p5
   *  @method saveSound
   *  @param  {p5.SoundFile} soundFile p5.SoundFile that you wish to save
   *  @param  {String} fileName      name of the resulting .wav file.
   */
  // add to p5.prototype as this is used by the p5 `save()` method.
  p5.prototype.saveSound = function (soundFile, fileName) {
    const dataView = convertToWav(soundFile.buffer);
    p5.prototype.writeFile([dataView], fileName, 'wav');
  };
}(master, helpers);
var peakdetect;
'use strict';
peakdetect = function () {
  /**
   *  <p>PeakDetect works in conjunction with p5.FFT to
   *  look for onsets in some or all of the frequency spectrum.
   *  </p>
   *  <p>
   *  To use p5.PeakDetect, call <code>update</code> in the draw loop
   *  and pass in a p5.FFT object.
   *  </p>
   *  <p>
   *  You can listen for a specific part of the frequency spectrum by
   *  setting the range between <code>freq1</code> and <code>freq2</code>.
   *  </p>
   *
   *  <p><code>threshold</code> is the threshold for detecting a peak,
   *  scaled between 0 and 1. It is logarithmic, so 0.1 is half as loud
   *  as 1.0.</p>
   *
   *  <p>
   *  The update method is meant to be run in the draw loop, and
   *  <b>frames</b> determines how many loops must pass before
   *  another peak can be detected.
   *  For example, if the frameRate() = 60, you could detect the beat of a
   *  120 beat-per-minute song with this equation:
   *  <code> framesPerPeak = 60 / (estimatedBPM / 60 );</code>
   *  </p>
   *
   *  <p>
   *  Based on example contribtued by @b2renger, and a simple beat detection
   *  explanation by <a
   *  href="http://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/"
   *  target="_blank">Felix Turner</a>.
   *  </p>
   *
   *  @class  p5.PeakDetect
   *  @constructor
   *  @param {Number} [freq1]     lowFrequency - defaults to 20Hz
   *  @param {Number} [freq2]     highFrequency - defaults to 20000 Hz
   *  @param {Number} [threshold] Threshold for detecting a beat between 0 and 1
   *                            scaled logarithmically where 0.1 is 1/2 the loudness
   *                            of 1.0. Defaults to 0.35.
   *  @param {Number} [framesPerPeak]     Defaults to 20.
   *  @example
   *  <div><code>
   *
   *  var cnv, soundFile, fft, peakDetect;
   *  var ellipseWidth = 10;
   *
   *  function preload() {
   *    soundFile = loadSound('assets/beat.mp3');
   *  }
   *
   *  function setup() {
   *    background(0);
   *    noStroke();
   *    fill(255);
   *    textAlign(CENTER);
   *
   *    // p5.PeakDetect requires a p5.FFT
   *    fft = new p5.FFT();
   *    peakDetect = new p5.PeakDetect();
   *  }
   *
   *  function draw() {
   *    background(0);
   *    text('click to play/pause', width/2, height/2);
   *
   *    // peakDetect accepts an fft post-analysis
   *    fft.analyze();
   *    peakDetect.update(fft);
   *
   *    if ( peakDetect.isDetected ) {
   *      ellipseWidth = 50;
   *    } else {
   *      ellipseWidth *= 0.95;
   *    }
   *
   *    ellipse(width/2, height/2, ellipseWidth, ellipseWidth);
   *  }
   *
   *  // toggle play/stop when canvas is clicked
   *  function mouseClicked() {
   *    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *      if (soundFile.isPlaying() ) {
   *        soundFile.stop();
   *      } else {
   *        soundFile.play();
   *      }
   *    }
   *  }
   *  </code></div>
   */
  p5.PeakDetect = function (freq1, freq2, threshold, _framesPerPeak) {
    // framesPerPeak determines how often to look for a beat.
    // If a beat is provided, try to look for a beat based on bpm
    this.framesPerPeak = _framesPerPeak || 20;
    this.framesSinceLastPeak = 0;
    this.decayRate = 0.95;
    this.threshold = threshold || 0.35;
    this.cutoff = 0;
    // how much to increase the cutoff
    // TO DO: document this / figure out how to make it accessible
    this.cutoffMult = 1.5;
    this.energy = 0;
    this.penergy = 0;
    // TO DO: document this property / figure out how to make it accessible
    this.currentValue = 0;
    /**
     *  isDetected is set to true when a peak is detected.
     *
     *  @attribute isDetected {Boolean}
     *  @default  false
     */
    this.isDetected = false;
    this.f1 = freq1 || 40;
    this.f2 = freq2 || 20000;
    // function to call when a peak is detected
    this._onPeak = function () {
    };
  };
  /**
   *  The update method is run in the draw loop.
   *
   *  Accepts an FFT object. You must call .analyze()
   *  on the FFT object prior to updating the peakDetect
   *  because it relies on a completed FFT analysis.
   *
   *  @method  update
   *  @param  {p5.FFT} fftObject A p5.FFT object
   */
  p5.PeakDetect.prototype.update = function (fftObject) {
    var nrg = this.energy = fftObject.getEnergy(this.f1, this.f2) / 255;
    if (nrg > this.cutoff && nrg > this.threshold && nrg - this.penergy > 0) {
      // trigger callback
      this._onPeak();
      this.isDetected = true;
      // debounce
      this.cutoff = nrg * this.cutoffMult;
      this.framesSinceLastPeak = 0;
    } else {
      this.isDetected = false;
      if (this.framesSinceLastPeak <= this.framesPerPeak) {
        this.framesSinceLastPeak++;
      } else {
        this.cutoff *= this.decayRate;
        this.cutoff = Math.max(this.cutoff, this.threshold);
      }
    }
    this.currentValue = nrg;
    this.penergy = nrg;
  };
  /**
   *  onPeak accepts two arguments: a function to call when
   *  a peak is detected. The value of the peak,
   *  between 0.0 and 1.0, is passed to the callback.
   *
   *  @method  onPeak
   *  @param  {Function} callback Name of a function that will
   *                              be called when a peak is
   *                              detected.
   *  @param  {Object}   [val]    Optional value to pass
   *                              into the function when
   *                              a peak is detected.
   *  @example
   *  <div><code>
   *  var cnv, soundFile, fft, peakDetect;
   *  var ellipseWidth = 0;
   *
   *  function preload() {
   *    soundFile = loadSound('assets/beat.mp3');
   *  }
   *
   *  function setup() {
   *    cnv = createCanvas(100,100);
   *    textAlign(CENTER);
   *
   *    fft = new p5.FFT();
   *    peakDetect = new p5.PeakDetect();
   *
   *    setupSound();
   *
   *    // when a beat is detected, call triggerBeat()
   *    peakDetect.onPeak(triggerBeat);
   *  }
   *
   *  function draw() {
   *    background(0);
   *    fill(255);
   *    text('click to play', width/2, height/2);
   *
   *    fft.analyze();
   *    peakDetect.update(fft);
   *
   *    ellipseWidth *= 0.95;
   *    ellipse(width/2, height/2, ellipseWidth, ellipseWidth);
   *  }
   *
   *  // this function is called by peakDetect.onPeak
   *  function triggerBeat() {
   *    ellipseWidth = 50;
   *  }
   *
   *  // mouseclick starts/stops sound
   *  function setupSound() {
   *    cnv.mouseClicked( function() {
   *      if (soundFile.isPlaying() ) {
   *        soundFile.stop();
   *      } else {
   *        soundFile.play();
   *      }
   *    });
   *  }
   *  </code></div>
   */
  p5.PeakDetect.prototype.onPeak = function (callback, val) {
    var self = this;
    self._onPeak = function () {
      callback(self.energy, val);
    };
  };
}();
var gain;
'use strict';
gain = function () {
  var p5sound = master;
  /**
   *  A gain node is usefull to set the relative volume of sound.
   *  It's typically used to build mixers.
   *
   *  @class p5.Gain
   *  @constructor
   *  @example
   *  <div><code>
   *
   * // load two soundfile and crossfade beetween them
   * var sound1,sound2;
   * var gain1, gain2, gain3;
   *
   * function preload(){
   *   soundFormats('ogg', 'mp3');
   *   sound1 = loadSound('assets/Damscray_-_Dancing_Tiger_01');
   *   sound2 = loadSound('assets/beat.mp3');
   * }
   *
   * function setup() {
   *   createCanvas(400,200);
   *
   *   // create a 'master' gain to which we will connect both soundfiles
   *   gain3 = new p5.Gain();
   *   gain3.connect();
   *
   *   // setup first sound for playing
   *   sound1.rate(1);
   *   sound1.loop();
   *   sound1.disconnect(); // diconnect from p5 output
   *
   *   gain1 = new p5.Gain(); // setup a gain node
   *   gain1.setInput(sound1); // connect the first sound to its input
   *   gain1.connect(gain3); // connect its output to the 'master'
   *
   *   sound2.rate(1);
   *   sound2.disconnect();
   *   sound2.loop();
   *
   *   gain2 = new p5.Gain();
   *   gain2.setInput(sound2);
   *   gain2.connect(gain3);
   *
   * }
   *
   * function draw(){
   *   background(180);
   *
   *   // calculate the horizontal distance beetween the mouse and the right of the screen
   *   var d = dist(mouseX,0,width,0);
   *
   *   // map the horizontal position of the mouse to values useable for volume control of sound1
   *   var vol1 = map(mouseX,0,width,0,1);
   *   var vol2 = 1-vol1; // when sound1 is loud, sound2 is quiet and vice versa
   *
   *   gain1.amp(vol1,0.5,0);
   *   gain2.amp(vol2,0.5,0);
   *
   *   // map the vertical position of the mouse to values useable for 'master volume control'
   *   var vol3 = map(mouseY,0,height,0,1);
   *   gain3.amp(vol3,0.5,0);
   * }
   *</code></div>
   *
   */
  p5.Gain = function () {
    this.ac = p5sound.audiocontext;
    this.input = this.ac.createGain();
    this.output = this.ac.createGain();
    // otherwise, Safari distorts
    this.input.gain.value = 0.5;
    this.input.connect(this.output);
    // add  to the soundArray
    p5sound.soundArray.push(this);
  };
  /**
   *  Connect a source to the gain node.
   *
   *  @method  setInput
   *  @param  {Object} src     p5.sound / Web Audio object with a sound
   *                           output.
   */
  p5.Gain.prototype.setInput = function (src) {
    src.connect(this.input);
  };
  /**
   *  Send output to a p5.sound or web audio object
   *
   *  @method  connect
   *  @param  {Object} unit
   */
  p5.Gain.prototype.connect = function (unit) {
    var u = unit || p5.soundOut.input;
    this.output.connect(u.input ? u.input : u);
  };
  /**
   *  Disconnect all output.
   *
   *  @method disconnect
   */
  p5.Gain.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
  };
  /**
   *  Set the output level of the gain node.
   *
   *  @method  amp
   *  @param  {Number} volume amplitude between 0 and 1.0
   *  @param  {Number} [rampTime] create a fade that lasts rampTime
   *  @param  {Number} [timeFromNow] schedule this event to happen
   *                                seconds from now
   */
  p5.Gain.prototype.amp = function (vol, rampTime, tFromNow) {
    var rampTime = rampTime || 0;
    var tFromNow = tFromNow || 0;
    var now = p5sound.audiocontext.currentTime;
    var currentVol = this.output.gain.value;
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.linearRampToValueAtTime(currentVol, now + tFromNow);
    this.output.gain.linearRampToValueAtTime(vol, now + tFromNow + rampTime);
  };
  p5.Gain.prototype.dispose = function () {
    // remove reference from soundArray
    var index = p5sound.soundArray.indexOf(this);
    p5sound.soundArray.splice(index, 1);
    if (this.output) {
      this.output.disconnect();
      delete this.output;
    }
    if (this.input) {
      this.input.disconnect();
      delete this.input;
    }
  };
}(master);
var audioVoice;
'use strict';
audioVoice = function () {
  var p5sound = master;
  /**
   * Base class for monophonic synthesizers. Any extensions of this class
   * should follow the API and implement the methods below in order to 
   * remain compatible with p5.PolySynth();
   *
   * @class p5.AudioVoice
   * @constructor
   */
  p5.AudioVoice = function () {
    this.ac = p5sound.audiocontext;
    this.output = this.ac.createGain();
    this.connect();
    p5sound.soundArray.push(this);
  };
  p5.AudioVoice.prototype.play = function (note, velocity, secondsFromNow, sustime) {
  };
  p5.AudioVoice.prototype.triggerAttack = function (note, velocity, secondsFromNow) {
  };
  p5.AudioVoice.prototype.triggerRelease = function (secondsFromNow) {
  };
  p5.AudioVoice.prototype.amp = function (vol, rampTime) {
  };
  /**
   * Connect to p5 objects or Web Audio Nodes
   * @method  connect
   * @param {Object} unit 
   */
  p5.AudioVoice.prototype.connect = function (unit) {
    var u = unit || p5sound.input;
    this.output.connect(u.input ? u.input : u);
  };
  /**
   * Disconnect from soundOut
   * @method  disconnect
   */
  p5.AudioVoice.prototype.disconnect = function () {
    this.output.disconnect();
  };
  p5.AudioVoice.prototype.dispose = function () {
    if (this.output) {
      this.output.disconnect();
      delete this.output;
    }
  };
  return p5.AudioVoice;
}(master);
var monosynth;
'use strict';
monosynth = function () {
  var p5sound = master;
  var AudioVoice = audioVoice;
  var noteToFreq = helpers.noteToFreq;
  var DEFAULT_SUSTAIN = 0.15;
  /**
  *  A MonoSynth is used as a single voice for sound synthesis.
  *  This is a class to be used in conjunction with the PolySynth
  *  class. Custom synthetisers should be built inheriting from
  *  this class.
  *
  *  @class p5.MonoSynth
  *  @constructor
  *  @example
  *  <div><code>
  *  var monoSynth;
  *
  *  function setup() {
  *    var cnv = createCanvas(100, 100);
  *    cnv.mousePressed(playSynth);
  *
  *    monoSynth = new p5.MonoSynth();
  *
  *    textAlign(CENTER);
  *    text('click to play', width/2, height/2);
  *  }
  *
  *  function playSynth() {
  *    // time from now (in seconds)
  *    var time = 0;
  *    // note duration (in seconds)
  *    var dur = 0.25;
  *    // velocity (volume, from 0 to 1)
  *    var v = 0.2;
  *
  *    monoSynth.play("G3", v, time, dur);
  *    monoSynth.play("C4", v, time += dur, dur);
  *
  *    background(random(255), random(255), 255);
  *    text('click to play', width/2, height/2);
  *  }
  *  </code></div>
  **/
  p5.MonoSynth = function () {
    AudioVoice.call(this);
    this.oscillator = new p5.Oscillator();
    this.env = new p5.Envelope();
    this.env.setRange(1, 0);
    this.env.setExp(true);
    //set params
    this.setADSR(0.02, 0.25, 0.05, 0.35);
    // oscillator --> env --> this.output (gain) --> p5.soundOut
    this.oscillator.disconnect();
    this.oscillator.connect(this.output);
    this.env.disconnect();
    this.env.setInput(this.output.gain);
    // reset oscillator gain to 1.0
    this.oscillator.output.gain.value = 1;
    this.oscillator.start();
    this.connect();
    p5sound.soundArray.push(this);
  };
  p5.MonoSynth.prototype = Object.create(p5.AudioVoice.prototype);
  /**
  *  Play tells the MonoSynth to start playing a note. This method schedules
  *  the calling of .triggerAttack and .triggerRelease.
  *
  *  @method play
  *  @param {String | Number} note the note you want to play, specified as a
  *                                 frequency in Hertz (Number) or as a midi
  *                                 value in Note/Octave format ("C4", "Eb3"...etc")
  *                                 See <a href = "https://github.com/Tonejs/Tone.js/wiki/Instruments">
  *                                 Tone</a>. Defaults to 440 hz.
  *  @param  {Number} [velocity] velocity of the note to play (ranging from 0 to 1)
  *  @param  {Number} [secondsFromNow]  time from now (in seconds) at which to play
  *  @param  {Number} [sustainTime] time to sustain before releasing the envelope
  *  @example
  *  <div><code>
  *  var monoSynth;
  *
  *  function setup() {
  *    var cnv = createCanvas(100, 100);
  *    cnv.mousePressed(playSynth);
  *
  *    monoSynth = new p5.MonoSynth();
  *
  *    textAlign(CENTER);
  *    text('click to play', width/2, height/2);
  *  }
  *
  *  function playSynth() {
  *    // time from now (in seconds)
  *    var time = 0;
  *    // note duration (in seconds)
  *    var dur = 1/6;
  *    // note velocity (volume, from 0 to 1)
  *    var v = random();
  *
  *    monoSynth.play("Fb3", v, 0, dur);
  *    monoSynth.play("Gb3", v, time += dur, dur);
  *
  *    background(random(255), random(255), 255);
  *    text('click to play', width/2, height/2);
  *  }
  *  </code></div>
  *
  */
  p5.MonoSynth.prototype.play = function (note, velocity, secondsFromNow, susTime) {
    this.triggerAttack(note, velocity, ~~secondsFromNow);
    this.triggerRelease(~~secondsFromNow + (susTime || DEFAULT_SUSTAIN));
  };
  /**
   *  Trigger the Attack, and Decay portion of the Envelope.
   *  Similar to holding down a key on a piano, but it will
   *  hold the sustain level until you let go.
   *
   *  @param {String | Number} note the note you want to play, specified as a
   *                                 frequency in Hertz (Number) or as a midi
   *                                 value in Note/Octave format ("C4", "Eb3"...etc")
   *                                 See <a href = "https://github.com/Tonejs/Tone.js/wiki/Instruments">
   *                                 Tone</a>. Defaults to 440 hz
   *  @param  {Number} [velocity] velocity of the note to play (ranging from 0 to 1)
   *  @param  {Number} [secondsFromNow]  time from now (in seconds) at which to play
   *  @method  triggerAttack
   *  @example
   *  <div><code>
   *  var monoSynth = new p5.MonoSynth();
   *
   *  function mousePressed() {
   *    monoSynth.triggerAttack("E3");
   *  }
   *
   *  function mouseReleased() {
   *    monoSynth.triggerRelease();
   *  }
   *  </code></div>
   */
  p5.MonoSynth.prototype.triggerAttack = function (note, velocity, secondsFromNow) {
    var secondsFromNow = ~~secondsFromNow;
    var freq = noteToFreq(note);
    var vel = velocity || 0.1;
    this.oscillator.freq(freq, 0, secondsFromNow);
    this.env.ramp(this.output.gain, secondsFromNow, vel);
  };
  /**
   *  Trigger the release of the Envelope. This is similar to releasing
   *  the key on a piano and letting the sound fade according to the
   *  release level and release time.
   *
   *  @param  {Number} secondsFromNow time to trigger the release
   *  @method  triggerRelease
   *  @example
   *  <div><code>
   *  var monoSynth = new p5.MonoSynth();
   *
   *  function mousePressed() {
   *    monoSynth.triggerAttack("E3");
   *  }
   *
   *  function mouseReleased() {
   *    monoSynth.triggerRelease();
   *  }
   *  </code></div>
   */
  p5.MonoSynth.prototype.triggerRelease = function (secondsFromNow) {
    var secondsFromNow = secondsFromNow || 0;
    this.env.ramp(this.output.gain, secondsFromNow, 0);
  };
  /**
   *  Set values like a traditional
   *  <a href="https://en.wikipedia.org/wiki/Synthesizer#/media/File:ADSR_parameter.svg">
   *  ADSR envelope
   *  </a>.
   *
   *  @method  setADSR
   *  @param {Number} attackTime    Time (in seconds before envelope
   *                                reaches Attack Level
   *  @param {Number} [decayTime]    Time (in seconds) before envelope
   *                                reaches Decay/Sustain Level
   *  @param {Number} [susRatio]    Ratio between attackLevel and releaseLevel, on a scale from 0 to 1,
   *                                where 1.0 = attackLevel, 0.0 = releaseLevel.
   *                                The susRatio determines the decayLevel and the level at which the
   *                                sustain portion of the envelope will sustain.
   *                                For example, if attackLevel is 0.4, releaseLevel is 0,
   *                                and susAmt is 0.5, the decayLevel would be 0.2. If attackLevel is
   *                                increased to 1.0 (using <code>setRange</code>),
   *                                then decayLevel would increase proportionally, to become 0.5.
   *  @param {Number} [releaseTime]   Time in seconds from now (defaults to 0)
   */
  p5.MonoSynth.prototype.setADSR = function (attack, decay, sustain, release) {
    this.env.setADSR(attack, decay, sustain, release);
  };
  /**
   * Getters and Setters
   * @property {Number} attack
   */
  /**
   * @property {Number} decay
   */
  /**
   * @property {Number} sustain
   */
  /**
   * @property {Number} release
   */
  Object.defineProperties(p5.MonoSynth.prototype, {
    'attack': {
      get: function () {
        return this.env.aTime;
      },
      set: function (attack) {
        this.env.setADSR(attack, this.env.dTime, this.env.sPercent, this.env.rTime);
      }
    },
    'decay': {
      get: function () {
        return this.env.dTime;
      },
      set: function (decay) {
        this.env.setADSR(this.env.aTime, decay, this.env.sPercent, this.env.rTime);
      }
    },
    'sustain': {
      get: function () {
        return this.env.sPercent;
      },
      set: function (sustain) {
        this.env.setADSR(this.env.aTime, this.env.dTime, sustain, this.env.rTime);
      }
    },
    'release': {
      get: function () {
        return this.env.rTime;
      },
      set: function (release) {
        this.env.setADSR(this.env.aTime, this.env.dTime, this.env.sPercent, release);
      }
    }
  });
  /**
   * MonoSynth amp
   * @method  amp
   * @param  {Number} vol      desired volume
   * @param  {Number} [rampTime] Time to reach new volume
   * @return {Number}          new volume value
   */
  p5.MonoSynth.prototype.amp = function (vol, rampTime) {
    var t = rampTime || 0;
    if (typeof vol !== 'undefined') {
      this.oscillator.amp(vol, t);
    }
    return this.oscillator.amp().value;
  };
  /**
   *  Connect to a p5.sound / Web Audio object.
   *
   *  @method  connect
   *  @param  {Object} unit A p5.sound or Web Audio object
   */
  p5.MonoSynth.prototype.connect = function (unit) {
    var u = unit || p5sound.input;
    this.output.connect(u.input ? u.input : u);
  };
  /**
   *  Disconnect all outputs
   *
   *  @method  disconnect
   */
  p5.MonoSynth.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
  };
  /**
   *  Get rid of the MonoSynth and free up its resources / memory.
   *
   *  @method  dispose
   */
  p5.MonoSynth.prototype.dispose = function () {
    AudioVoice.prototype.dispose.apply(this);
    if (this.env) {
      this.env.dispose();
    }
    if (this.oscillator) {
      this.oscillator.dispose();
    }
  };
}(master, audioVoice, helpers);
var polysynth;
'use strict';
polysynth = function () {
  var p5sound = master;
  var TimelineSignal = Tone_signal_TimelineSignal;
  var noteToFreq = helpers.noteToFreq;
  /**
  *  An AudioVoice is used as a single voice for sound synthesis.
  *  The PolySynth class holds an array of AudioVoice, and deals
  *  with voices allocations, with setting notes to be played, and
  *  parameters to be set.
  *
  *  @class p5.PolySynth
  *  @constructor
  *
  *  @param {Number} [synthVoice]   A monophonic synth voice inheriting
  *                                 the AudioVoice class. Defaults to p5.MonoSynth
  *  @param {Number} [maxVoices] Number of voices, defaults to 8;
  *  @example
  *  <div><code>
  *  var polySynth;
  *
  *  function setup() {
  *    var cnv = createCanvas(100, 100);
  *    cnv.mousePressed(playSynth);
  *
  *    polySynth = new p5.PolySynth();
  *
  *    textAlign(CENTER);
  *    text('click to play', width/2, height/2);
  *  }
  *
  *  function playSynth() {
  *    // note duration (in seconds)
  *    var dur = 1.5;
  *
  *    // time from now (in seconds)
  *    var time = 0;
  *
  *    // velocity (volume, from 0 to 1)
  *    var vel = 0.1;
  *
  *    // notes can overlap with each other
  *    polySynth.play("G2", vel, 0, dur);
  *    polySynth.play("C3", vel, time += 1/3, dur);
  *    polySynth.play("G3", vel, time += 1/3, dur);
  *
  *    background(random(255), random(255), 255);
  *    text('click to play', width/2, height/2);
  *  }
  *  </code></div>
  **/
  p5.PolySynth = function (audioVoice, maxVoices) {
    //audiovoices will contain maxVoices many monophonic synths
    this.audiovoices = [];
    /**
     * An object that holds information about which notes have been played and
     * which notes are currently being played. New notes are added as keys
     * on the fly. While a note has been attacked, but not released, the value of the
     * key is the audiovoice which is generating that note. When notes are released,
     * the value of the key becomes undefined.
     * @property notes
     */
    this.notes = {};
    //indices of the most recently used, and least recently used audiovoice
    this._newest = 0;
    this._oldest = 0;
    /**
     * A PolySynth must have at least 1 voice, defaults to 8
     * @property polyvalue
     */
    this.maxVoices = maxVoices || 8;
    /**
     * Monosynth that generates the sound for each note that is triggered. The
     * p5.PolySynth defaults to using the p5.MonoSynth as its voice.
     * @property AudioVoice
     */
    this.AudioVoice = audioVoice === undefined ? p5.MonoSynth : audioVoice;
    /**
       * This value must only change as a note is attacked or released. Due to delay
       * and sustain times, Tone.TimelineSignal is required to schedule the change in value.
    * @private
       * @property {Tone.TimelineSignal} _voicesInUse
       */
    this._voicesInUse = new TimelineSignal(0);
    this.output = p5sound.audiocontext.createGain();
    this.connect();
    //Construct the appropriate number of audiovoices
    this._allocateVoices();
    p5sound.soundArray.push(this);
  };
  /**
   * Construct the appropriate number of audiovoices
   * @private
   * @method  _allocateVoices
   */
  p5.PolySynth.prototype._allocateVoices = function () {
    for (var i = 0; i < this.maxVoices; i++) {
      this.audiovoices.push(new this.AudioVoice());
      this.audiovoices[i].disconnect();
      this.audiovoices[i].connect(this.output);
    }
  };
  /**
   *  Play a note by triggering noteAttack and noteRelease with sustain time
   *
   *  @method  play
   *  @param  {Number} [note] midi note to play (ranging from 0 to 127 - 60 being a middle C)
   *  @param  {Number} [velocity] velocity of the note to play (ranging from 0 to 1)
   *  @param  {Number} [secondsFromNow]  time from now (in seconds) at which to play
   *  @param  {Number} [sustainTime] time to sustain before releasing the envelope
   *  @example
   *  <div><code>
   *  var polySynth;
   *
   *  function setup() {
   *    var cnv = createCanvas(100, 100);
   *    cnv.mousePressed(playSynth);
   *
   *    polySynth = new p5.PolySynth();
   *
   *    textAlign(CENTER);
   *    text('click to play', width/2, height/2);
   *  }
   *
   *  function playSynth() {
   *    // note duration (in seconds)
   *    var dur = 0.1;
   *
   *    // time from now (in seconds)
   *    var time = 0;
   *
   *    // velocity (volume, from 0 to 1)
   *    var vel = 0.1;
   *
   *    polySynth.play("G2", vel, 0, dur);
   *    polySynth.play("C3", vel, 0, dur);
   *    polySynth.play("G3", vel, 0, dur);
   *
   *    background(random(255), random(255), 255);
   *    text('click to play', width/2, height/2);
   *  }
   *  </code></div>
   */
  p5.PolySynth.prototype.play = function (note, velocity, secondsFromNow, susTime) {
    var susTime = susTime || 1;
    this.noteAttack(note, velocity, secondsFromNow);
    this.noteRelease(note, secondsFromNow + susTime);
  };
  /**
   *  noteADSR sets the envelope for a specific note that has just been triggered.
   *  Using this method modifies the envelope of whichever audiovoice is being used
   *  to play the desired note. The envelope should be reset before noteRelease is called
   *  in order to prevent the modified envelope from being used on other notes.
   *
   *  @method  noteADSR
   *  @param {Number} [note]        Midi note on which ADSR should be set.
   *  @param {Number} [attackTime]  Time (in seconds before envelope
   *                                reaches Attack Level
   *  @param {Number} [decayTime]   Time (in seconds) before envelope
   *                                reaches Decay/Sustain Level
   *  @param {Number} [susRatio]    Ratio between attackLevel and releaseLevel, on a scale from 0 to 1,
   *                                where 1.0 = attackLevel, 0.0 = releaseLevel.
   *                                The susRatio determines the decayLevel and the level at which the
   *                                sustain portion of the envelope will sustain.
   *                                For example, if attackLevel is 0.4, releaseLevel is 0,
   *                                and susAmt is 0.5, the decayLevel would be 0.2. If attackLevel is
   *                                increased to 1.0 (using <code>setRange</code>),
   *                                then decayLevel would increase proportionally, to become 0.5.
   *  @param {Number} [releaseTime]   Time in seconds from now (defaults to 0)
   **/
  p5.PolySynth.prototype.noteADSR = function (note, a, d, s, r, timeFromNow) {
    var now = p5sound.audiocontext.currentTime;
    var timeFromNow = timeFromNow || 0;
    var t = now + timeFromNow;
    this.audiovoices[this.notes[note].getValueAtTime(t)].setADSR(a, d, s, r);
  };
  /**
   * Set the PolySynths global envelope. This method modifies the envelopes of each
   * monosynth so that all notes are played with this envelope.
   *
   *  @method  setADSR
   *  @param {Number} [attackTime]  Time (in seconds before envelope
   *                                reaches Attack Level
   *  @param {Number} [decayTime]   Time (in seconds) before envelope
   *                                reaches Decay/Sustain Level
   *  @param {Number} [susRatio]    Ratio between attackLevel and releaseLevel, on a scale from 0 to 1,
   *                                where 1.0 = attackLevel, 0.0 = releaseLevel.
   *                                The susRatio determines the decayLevel and the level at which the
   *                                sustain portion of the envelope will sustain.
   *                                For example, if attackLevel is 0.4, releaseLevel is 0,
   *                                and susAmt is 0.5, the decayLevel would be 0.2. If attackLevel is
   *                                increased to 1.0 (using <code>setRange</code>),
   *                                then decayLevel would increase proportionally, to become 0.5.
   *  @param {Number} [releaseTime]   Time in seconds from now (defaults to 0)
   **/
  p5.PolySynth.prototype.setADSR = function (a, d, s, r) {
    this.audiovoices.forEach(function (voice) {
      voice.setADSR(a, d, s, r);
    });
  };
  /**
   *  Trigger the Attack, and Decay portion of a MonoSynth.
   *  Similar to holding down a key on a piano, but it will
   *  hold the sustain level until you let go.
   *
   *  @method  noteAttack
   *  @param  {Number} [note]           midi note on which attack should be triggered.
   *  @param  {Number} [velocity]       velocity of the note to play (ranging from 0 to 1)/
   *  @param  {Number} [secondsFromNow] time from now (in seconds)
   *  @example
   *  <div><code>
   *  var polySynth = new p5.PolySynth();
   *  var pitches = ["G", "D", "G", "C"];
   *  var octaves = [2, 3, 4];
   *
   *  function mousePressed() {
   *    // play a chord: multiple notes at the same time
   *    for (var i = 0; i < 4; i++) {
   *      var note = random(pitches) + random(octaves);
   *      polySynth.noteAttack(note, 0.1);
   *    }
   *  }
   *
   *  function mouseReleased() {
   *    // release all voices
   *    polySynth.noteRelease();
   *  }
   *  </code></div>
   */
  p5.PolySynth.prototype.noteAttack = function (_note, _velocity, secondsFromNow) {
    //this value goes to the audiovoices which handle their own scheduling
    var secondsFromNow = ~~secondsFromNow;
    //this value is used by this._voicesInUse
    var acTime = p5sound.audiocontext.currentTime + secondsFromNow;
    //Convert note to frequency if necessary. This is because entries into this.notes
    //should be based on frequency for the sake of consistency.
    var note = noteToFreq(_note);
    var velocity = _velocity || 0.1;
    var currentVoice;
    //Release the note if it is already playing
    if (this.notes[note] && this.notes[note].getValueAtTime(acTime) !== null) {
      this.noteRelease(note, 0);
    }
    //Check to see how many voices are in use at the time the note will start
    if (this._voicesInUse.getValueAtTime(acTime) < this.maxVoices) {
      currentVoice = Math.max(~~this._voicesInUse.getValueAtTime(acTime), 0);
    } else {
      currentVoice = this._oldest;
      var oldestNote = p5.prototype.freqToMidi(this.audiovoices[this._oldest].oscillator.freq().value);
      this.noteRelease(oldestNote);
      this._oldest = (this._oldest + 1) % (this.maxVoices - 1);
    }
    //Overrite the entry in the notes object. A note (frequency value)
    //corresponds to the index of the audiovoice that is playing it
    this.notes[note] = new TimelineSignal();
    this.notes[note].setValueAtTime(currentVoice, acTime);
    //Find the scheduled change in this._voicesInUse that will be previous to this new note
    //Add 1 and schedule this value at time 't', when this note will start playing
    var previousVal = this._voicesInUse._searchBefore(acTime) === null ? 0 : this._voicesInUse._searchBefore(acTime).value;
    this._voicesInUse.setValueAtTime(previousVal + 1, acTime);
    //Then update all scheduled values that follow to increase by 1
    this._updateAfter(acTime, 1);
    this._newest = currentVoice;
    //The audiovoice handles the actual scheduling of the note
    if (typeof velocity === 'number') {
      var maxRange = 1 / this._voicesInUse.getValueAtTime(acTime) * 2;
      velocity = velocity > maxRange ? maxRange : velocity;
    }
    this.audiovoices[currentVoice].triggerAttack(note, velocity, secondsFromNow);
  };
  /**
   * Private method to ensure accurate values of this._voicesInUse
   * Any time a new value is scheduled, it is necessary to increment all subsequent
   * scheduledValues after attack, and decrement all subsequent
   * scheduledValues after release
   *
   * @private
   * @param  {[type]} time  [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  p5.PolySynth.prototype._updateAfter = function (time, value) {
    if (this._voicesInUse._searchAfter(time) === null) {
      return;
    } else {
      this._voicesInUse._searchAfter(time).value += value;
      var nextTime = this._voicesInUse._searchAfter(time).time;
      this._updateAfter(nextTime, value);
    }
  };
  /**
   *  Trigger the Release of an AudioVoice note. This is similar to releasing
   *  the key on a piano and letting the sound fade according to the
   *  release level and release time.
   *
   *  @method  noteRelease
   *  @param  {Number} [note]           midi note on which attack should be triggered.
   *                                    If no value is provided, all notes will be released.
   *  @param  {Number} [secondsFromNow] time to trigger the release
   *  @example
   *  <div><code>
   *  var pitches = ["G", "D", "G", "C"];
   *  var octaves = [2, 3, 4];
   *  var polySynth = new p5.PolySynth();
   *
   *  function mousePressed() {
   *    // play a chord: multiple notes at the same time
   *    for (var i = 0; i < 4; i++) {
   *      var note = random(pitches) + random(octaves);
   *      polySynth.noteAttack(note, 0.1);
   *    }
   *  }
   *
   *  function mouseReleased() {
   *    // release all voices
   *    polySynth.noteRelease();
   *  }
   *  </code></div>
   *
   */
  p5.PolySynth.prototype.noteRelease = function (_note, secondsFromNow) {
    var now = p5sound.audiocontext.currentTime;
    var tFromNow = secondsFromNow || 0;
    var t = now + tFromNow;
    // if a note value is not provided, release all voices
    if (!_note) {
      this.audiovoices.forEach(function (voice) {
        voice.triggerRelease(tFromNow);
      });
      this._voicesInUse.setValueAtTime(0, t);
      for (var n in this.notes) {
        this.notes[n].dispose();
        delete this.notes[n];
      }
      return;
    }
    //Make sure note is in frequency inorder to query the this.notes object
    var note = noteToFreq(_note);
    if (!this.notes[note] || this.notes[note].getValueAtTime(t) === null) {
      console.warn('Cannot release a note that is not already playing');
    } else {
      //Find the scheduled change in this._voicesInUse that will be previous to this new note
      //subtract 1 and schedule this value at time 't', when this note will stop playing
      var previousVal = Math.max(~~this._voicesInUse.getValueAtTime(t).value, 1);
      this._voicesInUse.setValueAtTime(previousVal - 1, t);
      //Then update all scheduled values that follow to decrease by 1 but never go below 0
      if (previousVal > 0) {
        this._updateAfter(t, -1);
      }
      this.audiovoices[this.notes[note].getValueAtTime(t)].triggerRelease(tFromNow);
      this.notes[note].dispose();
      delete this.notes[note];
      this._newest = this._newest === 0 ? 0 : (this._newest - 1) % (this.maxVoices - 1);
    }
  };
  /**
  *  Connect to a p5.sound / Web Audio object.
  *
  *  @method  connect
  *  @param  {Object} unit A p5.sound or Web Audio object
  */
  p5.PolySynth.prototype.connect = function (unit) {
    var u = unit || p5sound.input;
    this.output.connect(u.input ? u.input : u);
  };
  /**
  *  Disconnect all outputs
  *
  *  @method  disconnect
  */
  p5.PolySynth.prototype.disconnect = function () {
    if (this.output) {
      this.output.disconnect();
    }
  };
  /**
  *  Get rid of the MonoSynth and free up its resources / memory.
  *
  *  @method  dispose
  */
  p5.PolySynth.prototype.dispose = function () {
    this.audiovoices.forEach(function (voice) {
      voice.dispose();
    });
    if (this.output) {
      this.output.disconnect();
      delete this.output;
    }
  };
}(master, Tone_signal_TimelineSignal, helpers);
var distortion;
'use strict';
distortion = function () {
  var Effect = effect;
  /*
   * Adapted from [Kevin Ennis on StackOverflow](http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion)
   */
  function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50;
    var numSamples = 44100;
    var curve = new Float32Array(numSamples);
    var deg = Math.PI / 180;
    var i = 0;
    var x;
    for (; i < numSamples; ++i) {
      x = i * 2 / numSamples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
  /**
   * A Distortion effect created with a Waveshaper Node,
   * with an approach adapted from
   * [Kevin Ennis](http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion)
   * 
   * This class extends <a href = "/reference/#/p5.Effect">p5.Effect</a>.  
   * Methods <a href = "/reference/#/p5.Effect/amp">amp()</a>, <a href = "/reference/#/p5.Effect/chain">chain()</a>, 
   * <a href = "/reference/#/p5.Effect/drywet">drywet()</a>, <a href = "/reference/#/p5.Effect/connect">connect()</a>, and 
   * <a href = "/reference/#/p5.Effect/disconnect">disconnect()</a> are available.
   * 
   * @class p5.Distortion
   * @extends p5.Effect
   * @constructor
   * @param {Number} [amount=0.25] Unbounded distortion amount.
   *                                Normal values range from 0-1.
   * @param {String} [oversample='none'] 'none', '2x', or '4x'.
   *
   */
  p5.Distortion = function (amount, oversample) {
    Effect.call(this);
    if (typeof amount === 'undefined') {
      amount = 0.25;
    }
    if (typeof amount !== 'number') {
      throw new Error('amount must be a number');
    }
    if (typeof oversample === 'undefined') {
      oversample = '2x';
    }
    if (typeof oversample !== 'string') {
      throw new Error('oversample must be a String');
    }
    var curveAmount = p5.prototype.map(amount, 0, 1, 0, 2000);
    /**
     *  The p5.Distortion is built with a
     *  <a href="http://www.w3.org/TR/webaudio/#WaveShaperNode">
     *  Web Audio WaveShaper Node</a>.
     *
     *  @property {AudioNode} WaveShaperNode
     */
    this.waveShaperNode = this.ac.createWaveShaper();
    this.amount = curveAmount;
    this.waveShaperNode.curve = makeDistortionCurve(curveAmount);
    this.waveShaperNode.oversample = oversample;
    this.input.connect(this.waveShaperNode);
    this.waveShaperNode.connect(this.wet);
  };
  p5.Distortion.prototype = Object.create(Effect.prototype);
  /**
   * Process a sound source, optionally specify amount and oversample values.
   *
   * @method process
   * @param {Number} [amount=0.25] Unbounded distortion amount.
   *                                Normal values range from 0-1.
   * @param {String} [oversample='none'] 'none', '2x', or '4x'.
   */
  p5.Distortion.prototype.process = function (src, amount, oversample) {
    src.connect(this.input);
    this.set(amount, oversample);
  };
  /**
   * Set the amount and oversample of the waveshaper distortion.
   *
   * @method set
   * @param {Number} [amount=0.25] Unbounded distortion amount.
   *                                Normal values range from 0-1.
   * @param {String} [oversample='none'] 'none', '2x', or '4x'.
   */
  p5.Distortion.prototype.set = function (amount, oversample) {
    if (amount) {
      var curveAmount = p5.prototype.map(amount, 0, 1, 0, 2000);
      this.amount = curveAmount;
      this.waveShaperNode.curve = makeDistortionCurve(curveAmount);
    }
    if (oversample) {
      this.waveShaperNode.oversample = oversample;
    }
  };
  /**
   *  Return the distortion amount, typically between 0-1.
   *
   *  @method  getAmount
   *  @return {Number} Unbounded distortion amount.
   *                   Normal values range from 0-1.
   */
  p5.Distortion.prototype.getAmount = function () {
    return this.amount;
  };
  /**
   *  Return the oversampling.
   *
   *  @method getOversample
   *
   *  @return {String} Oversample can either be 'none', '2x', or '4x'.
   */
  p5.Distortion.prototype.getOversample = function () {
    return this.waveShaperNode.oversample;
  };
  p5.Distortion.prototype.dispose = function () {
    Effect.prototype.dispose.apply(this);
    if (this.waveShaperNode) {
      this.waveShaperNode.disconnect();
      this.waveShaperNode = null;
    }
  };
}(effect);
var src_app;
'use strict';
src_app = function () {
  var p5SOUND = master;
  return p5SOUND;
}(shims, audiocontext, master, helpers, errorHandler, panner, soundfile, amplitude, fft, signal, oscillator, envelope, pulse, noise, audioin, filter, eq, panner3d, listener3d, delay, reverb, metro, looper, soundloop, compressor, soundRecorder, peakdetect, gain, monosynth, polysynth, distortion, audioVoice, monosynth, polysynth);
}));