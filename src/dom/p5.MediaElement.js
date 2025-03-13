/**
 * @module DOM
 * @submodule DOM
 */

import { Element } from './p5.Element';

class MediaElement extends Element {
  constructor(elt, pInst) {
    super(elt, pInst);

    const self = this;
    this.elt.crossOrigin = 'anonymous';

    this._prevTime = 0;
    this._cueIDCounter = 0;
    this._cues = [];
    this.pixels = [];
    this._pixelsState = this;
    this._pixelDensity = 1;
    this._modified = false;

    // Media has an internal canvas that is used when drawing it to the main
    // canvas. It will need to be updated each frame as the video itself plays.
    // We don't want to update it every time we draw, however, in case the user
    // has used load/updatePixels. To handle this, we record the frame drawn to
    // the internal canvas so we only update it if the frame has changed.
    this._frameOnCanvas = -1;

    Object.defineProperty(self, 'src', {
      get() {
        const firstChildSrc = self.elt.children[0].src;
        const srcVal = self.elt.src === window.location.href ? '' : self.elt.src;
        const ret =
          firstChildSrc === window.location.href ? srcVal : firstChildSrc;
        return ret;
      },
      set(newValue) {
        for (let i = 0; i < self.elt.children.length; i++) {
          self.elt.removeChild(self.elt.children[i]);
        }
        const source = document.createElement('source');
        source.src = newValue;
        elt.appendChild(source);
        self.elt.src = newValue;
        self.modified = true;
      }
    });

    // private _onended callback, set by the method: onended(callback)
    self._onended = function () { };
    self.elt.onended = function () {
      self._onended(self);
    };
  }


  /**
   * Plays audio or video from a media element.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let beat;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display a message.
   *   text('Click to play', 50, 50);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   describe('The text "Click to play" written in black on a gray background. A beat plays when the user clicks the square.');
   * }
   *
   * // Play the beat when the user presses the mouse.
   * function mousePressed() {
   *   beat.play();
   * }
   * </code>
   * </div>
   */
  play() {
    if (this.elt.currentTime === this.elt.duration) {
      this.elt.currentTime = 0;
    }
    let promise;
    if (this.elt.readyState > 1) {
      promise = this.elt.play();
    } else {
      // in Chrome, playback cannot resume after being stopped and must reload
      this.elt.load();
      promise = this.elt.play();
    }
    if (promise && promise.catch) {
      promise.catch(e => {
        // if it's an autoplay failure error
        if (e.name === 'NotAllowedError') {
          if (typeof IS_MINIFIED === 'undefined') {
            p5._friendlyAutoplayError(this.src);
          } else {
            console.error(e);
          }
        } else {
          // any other kind of error
          console.error('Media play method encountered an unexpected error', e);
        }
      });
    }
    return this;
  }

  /**
   * Stops a media element and sets its current time to 0.
   *
   * Calling `media.play()` will restart playing audio/video from the beginning.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let beat;
   * let isStopped = true;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   describe('The text "Click to start" written in black on a gray background. The beat starts or stops when the user presses the mouse.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display different instructions based on playback.
   *   if (isStopped === true) {
   *     text('Click to start', 50, 50);
   *   } else {
   *     text('Click to stop', 50, 50);
   *   }
   * }
   *
   * // Adjust playback when the user presses the mouse.
   * function mousePressed() {
   *   if (isStopped === true) {
   *     // If the beat is stopped, play it.
   *     beat.play();
   *     isStopped = false;
   *   } else {
   *     // If the beat is playing, stop it.
   *     beat.stop();
   *     isStopped = true;
   *   }
   * }
   * </code>
   * </div>
   */
  stop() {
    this.elt.pause();
    this.elt.currentTime = 0;
    return this;
  }

  /**
   * Pauses a media element.
   *
   * Calling `media.play()` will resume playing audio/video from the moment it paused.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let beat;
   * let isPaused = true;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   describe('The text "Click to play" written in black on a gray background. The beat plays or pauses when the user clicks the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display different instructions based on playback.
   *   if (isPaused === true) {
   *     text('Click to play', 50, 50);
   *   } else {
   *     text('Click to pause', 50, 50);
   *   }
   * }
   *
   * // Adjust playback when the user presses the mouse.
   * function mousePressed() {
   *   if (isPaused === true) {
   *     // If the beat is paused,
   *     // play it.
   *     beat.play();
   *     isPaused = false;
   *   } else {
   *     // If the beat is playing,
   *     // pause it.
   *     beat.pause();
   *     isPaused = true;
   *   }
   * }
   * </code>
   * </div>
   */
  pause() {
    this.elt.pause();
    return this;
  }

  /**
   * Plays the audio/video repeatedly in a loop.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let beat;
   * let isLooping = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   describe('The text "Click to loop" written in black on a gray background. A beat plays repeatedly in a loop when the user clicks. The beat stops when the user clicks again.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display different instructions based on playback.
   *   if (isLooping === true) {
   *     text('Click to stop', 50, 50);
   *   } else {
   *     text('Click to loop', 50, 50);
   *   }
   * }
   *
   * // Adjust playback when the user presses the mouse.
   * function mousePressed() {
   *   if (isLooping === true) {
   *     // If the beat is looping, stop it.
   *     beat.stop();
   *     isLooping = false;
   *   } else {
   *     // If the beat is stopped, loop it.
   *     beat.loop();
   *     isLooping = true;
   *   }
   * }
   * </code>
   * </div>
   */
  loop() {
    this.elt.setAttribute('loop', true);
    this.play();
    return this;
  }
  /**
   * Stops the audio/video from playing in a loop.
   *
   * The media will stop when it finishes playing.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let beat;
   * let isPlaying = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   describe('The text "Click to play" written in black on a gray background. A beat plays when the user clicks. The beat stops when the user clicks again.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display different instructions based on playback.
   *   if (isPlaying === true) {
   *     text('Click to stop', 50, 50);
   *   } else {
   *     text('Click to play', 50, 50);
   *   }
   * }
   *
   * // Adjust playback when the user presses the mouse.
   * function mousePressed() {
   *   if (isPlaying === true) {
   *     // If the beat is playing, stop it.
   *     beat.stop();
   *     isPlaying = false;
   *   } else {
   *     // If the beat is stopped, play it.
   *     beat.play();
   *     isPlaying = true;
   *   }
   * }
   * </code>
   * </div>
   */
  noLoop() {
    this.elt.removeAttribute('loop');
    return this;
  }

  /**
   * Sets up logic to check that autoplay succeeded.
   *
   * @private
   */
  _setupAutoplayFailDetection() {
    const timeout = setTimeout(() => {
      if (typeof IS_MINIFIED === 'undefined') {
        p5._friendlyAutoplayError(this.src);
      } else {
        console.error(e);
      }
    }, 500);
    this.elt.addEventListener('play', () => clearTimeout(timeout), {
      passive: true,
      once: true
    });
  }

  /**
   * Sets the audio/video to play once it's loaded.
   *
   * The parameter, `shouldAutoplay`, is optional. Calling
   * `media.autoplay()` without an argument causes the media to play
   * automatically. If `true` is passed, as in `media.autoplay(true)`, the
   * media will automatically play. If `false` is passed, as in
   * `media.autoPlay(false)`, it won't play automatically.
   *
   * @param {Boolean} [shouldAutoplay] whether the element should autoplay.
   * @chainable
   *
   * @example
   * <div class='notest'>
   * <code>
   * let video;
   *
   * function setup() {
   *   noCanvas();
   *
   *   // Call handleVideo() once the video loads.
   *   video = createVideo('assets/fingers.mov', handleVideo);
   *
   *   describe('A video of fingers walking on a treadmill.');
   * }
   *
   * // Set the video's size and play it.
   * function handleVideo() {
   *   video.size(100, 100);
   *   video.autoplay();
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * function setup() {
   *   noCanvas();
   *
   *   // Load a video, but don't play it automatically.
   *   let video = createVideo('assets/fingers.mov', handleVideo);
   *
   *   // Play the video when the user clicks on it.
   *   video.mousePressed(handlePress);
   *
   *   describe('An image of fingers on a treadmill. They start walking when the user double-clicks on them.');
   * }
   * </code>
   * </div>
   *
   * // Set the video's size and playback mode.
   * function handleVideo() {
   *   video.size(100, 100);
   *   video.autoplay(false);
   * }
   *
   * // Play the video.
   * function handleClick() {
   *   video.play();
   * }
   */
  autoplay(val) {
    const oldVal = this.elt.getAttribute('autoplay');
    this.elt.setAttribute('autoplay', val);
    // if we turned on autoplay
    if (val && !oldVal) {
      // bind method to this scope
      const setupAutoplayFailDetection =
        () => this._setupAutoplayFailDetection();
      // if media is ready to play, schedule check now
      if (this.elt.readyState === 4) {
        setupAutoplayFailDetection();
      } else {
        // otherwise, schedule check whenever it is ready
        this.elt.addEventListener('canplay', setupAutoplayFailDetection, {
          passive: true,
          once: true
        });
      }
    }

    return this;
  }

  /**
   * Sets the audio/video volume.
   *
   * Calling `media.volume()` without an argument returns the current volume
   * as a number in the range 0 (off) to 1 (maximum).
   *
   * The parameter, `val`, is optional. It's a number that sets the volume
   * from 0 (off) to 1 (maximum). For example, calling `media.volume(0.5)`
   * sets the volume to half of its maximum.
   *
   * @return {Number} current volume.
   *
   * @example
   * <div>
   * <code>
   * let dragon;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   describe('The text "Volume: V" on a gray square with media controls beneath it. The number "V" oscillates between 0 and 1 as the music plays.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Produce a number between 0 and 1.
   *   let n = 0.5 * sin(frameCount * 0.01) + 0.5;
   *
   *   // Use n to set the volume.
   *   dragon.volume(n);
   *
   *   // Get the current volume and display it.
   *   let v = dragon.volume();
   *
   *   // Round v to 1 decimal place for display.
   *   v = round(v, 1);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the volume.
   *   text(`Volume: ${v}`, 50, 50);
   * }
   * </code>
   * </div>
   */
  /**
   * @param {Number}            val volume between 0.0 and 1.0.
   * @chainable
   */
  volume(val) {
    if (typeof val === 'undefined') {
      return this.elt.volume;
    } else {
      this.elt.volume = val;
    }
  }

  /**
   * Sets the audio/video playback speed.
   *
   * The parameter, `val`, is optional. It's a number that sets the playback
   * speed. 1 plays the media at normal speed, 0.5 plays it at half speed, 2
   * plays it at double speed, and so on. -1 plays the media at normal speed
   * in reverse.
   *
   * Calling `media.speed()` returns the current speed as a number.
   *
   * Note: Not all browsers support backward playback. Even if they do,
   * playback might not be smooth.
   *
   * @return {Number} current playback speed.
   *
   * @example
   * <div>
   * <code>
   * let dragon;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   describe('The text "Speed: S" on a gray square with media controls beneath it. The number "S" oscillates between 0 and 1 as the music plays.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Produce a number between 0 and 2.
   *   let n = sin(frameCount * 0.01) + 1;
   *
   *   // Use n to set the playback speed.
   *   dragon.speed(n);
   *
   *   // Get the current speed and display it.
   *   let s = dragon.speed();
   *
   *   // Round s to 1 decimal place for display.
   *   s = round(s, 1);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the speed.
   *   text(`Speed: ${s}`, 50, 50);
   * }
   * </code>
   */
  /**
   * @param {Number} speed  speed multiplier for playback.
   * @chainable
   */
  speed(val) {
    if (typeof val === 'undefined') {
      return this.presetPlaybackRate || this.elt.playbackRate;
    } else {
      if (this.loadedmetadata) {
        this.elt.playbackRate = val;
      } else {
        this.presetPlaybackRate = val;
      }
    }
  }

  /**
   * Sets the media element's playback time.
   *
   * The parameter, `time`, is optional. It's a number that specifies the
   * time, in seconds, to jump to when playback begins.
   *
   * Calling `media.time()` without an argument returns the number of seconds
   * the audio/video has played.
   *
   * Note: Time resets to 0 when looping media restarts.
   *
   * @return {Number} current time (in seconds).
   *
   * @example
   * <div>
   * <code>
   * let dragon;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   describe('The text "S seconds" on a gray square with media controls beneath it. The number "S" increases as the song plays.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get the current playback time.
   *   let s = dragon.time();
   *
   *   // Round s to 1 decimal place for display.
   *   s = round(s, 1);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the playback time.
   *   text(`${s} seconds`, 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let dragon;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   // Jump to 2 seconds to start.
   *   dragon.time(2);
   *
   *   describe('The text "S seconds" on a gray square with media controls beneath it. The number "S" increases as the song plays.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get the current playback time.
   *   let s = dragon.time();
   *
   *   // Round s to 1 decimal place for display.
   *   s = round(s, 1);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the playback time.
   *   text(`${s} seconds`, 50, 50);
   * }
   * </code>
   * </div>
   */
  /**
   * @param {Number} time time to jump to (in seconds).
   * @chainable
   */
  time(val) {
    if (typeof val === 'undefined') {
      return this.elt.currentTime;
    } else {
      this.elt.currentTime = val;
      return this;
    }
  }

  /**
   * Returns the audio/video's duration in seconds.
   *
   * @return {Number} duration (in seconds).
   *
   * @example
   * <div>
   * <code>
   * let dragon;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   describe('The text "S seconds left" on a gray square with media controls beneath it. The number "S" decreases as the song plays.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the time remaining.
   *   let s = dragon.duration() - dragon.time();
   *
   *   // Round s to 1 decimal place for display.
   *   s = round(s, 1);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the time remaining.
   *   text(`${s} seconds left`, 50, 50);
   * }
   * </code>
   * </div>
   */
  duration() {
    return this.elt.duration;
  }
  _ensureCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.drawingContext = this.canvas.getContext('2d');
      this.setModified(true);
    }

    // Don't update the canvas again if we have already updated the canvas with
    // the current frame
    const needsRedraw = this._frameOnCanvas !== this._pInst.frameCount;
    if (this.loadedmetadata && needsRedraw) {
      // wait for metadata for w/h
      if (this.canvas.width !== this.elt.width) {
        this.canvas.width = this.elt.width;
        this.canvas.height = this.elt.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
      }

      this.drawingContext.clearRect(
        0, 0, this.canvas.width, this.canvas.height);

      if (this.flipped === true) {
        this.drawingContext.save();
        this.drawingContext.scale(-1, 1);
        this.drawingContext.translate(-this.canvas.width, 0);
      }

      this.drawingContext.drawImage(
        this.elt,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      if (this.flipped === true) {
        this.drawingContext.restore();
      }

      this.setModified(true);
      this._frameOnCanvas = this._pInst.frameCount;
    }
  }
  loadPixels(...args) {
    this._ensureCanvas();
    return p5.Renderer2D.prototype.loadPixels.apply(this, args);
  }
  updatePixels(x, y, w, h) {
    if (this.loadedmetadata) {
      // wait for metadata
      this._ensureCanvas();
      p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
    }
    this.setModified(true);
    return this;
  }
  get(...args) {
    this._ensureCanvas();
    return p5.Renderer2D.prototype.get.apply(this, args);
  }
  _getPixel(...args) {
    this.loadPixels();
    return p5.Renderer2D.prototype._getPixel.apply(this, args);
  }

  set(x, y, imgOrCol) {
    if (this.loadedmetadata) {
      // wait for metadata
      this._ensureCanvas();
      p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
      this.setModified(true);
    }
  }
  copy(...args) {
    this._ensureCanvas();
    fn.copy.apply(this, args);
  }
  mask(...args) {
    this.loadPixels();
    this.setModified(true);
    p5.Image.prototype.mask.apply(this, args);
  }
  /**
   * helper method for web GL mode to figure out if the element
   * has been modified and might need to be re-uploaded to texture
   * memory between frames.
   * @private
   * @return {boolean} a boolean indicating whether or not the
   * image has been updated or modified since last texture upload.
   */
  isModified() {
    return this._modified;
  }
  /**
   * helper method for web GL mode to indicate that an element has been
   * changed or unchanged since last upload. gl texture upload will
   * set this value to false after uploading the texture; or might set
   * it to true if metadata has become available but there is no actual
   * texture data available yet..
   * @param {Boolean} val sets whether or not the element has been
   * modified.
   * @private
   */
  setModified(value) {
    this._modified = value;
  }
  /**
   * Calls a function when the audio/video reaches the end of its playback.
   *
   * The element is passed as an argument to the callback function.
   *
   * Note: The function won't be called if the media is looping.
   *
   * @param  {Function} callback function to call when playback ends.
   *                             The `p5.MediaElement` is passed as
   *                             the argument.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let beat;
   * let isPlaying = false;
   * let isDone = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   // Call handleEnd() when the beat finishes.
   *   beat.onended(handleEnd);
   *
   *   describe('The text "Click to play" written in black on a gray square. A beat plays when the user clicks. The text "Done!" appears when the beat finishes playing.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display different messages based on playback.
   *   if (isDone === true) {
   *     text('Done!', 50, 50);
   *   } else if (isPlaying === false) {
   *     text('Click to play', 50, 50);
   *   } else {
   *     text('Playing...', 50, 50);
   *   }
   * }
   *
   * // Play the beat when the user presses the mouse.
   * function mousePressed() {
   *   if (isPlaying === false) {
   *     isPlaying = true;
   *     beat.play();
   *   }
   * }
   *
   * // Set isDone when playback ends.
   * function handleEnd() {
   *   isDone = false;
   * }
   * </code>
   * </div>
   */
  onended(callback) {
    this._onended = callback;
    return this;
  }

  /*** CONNECT TO WEB AUDIO API / p5.sound.js ***/

  /**
   * Sends the element's audio to an output.
   *
   * The parameter, `audioNode`, can be an `AudioNode` or an object from the
   * `p5.sound` library.
   *
   * If no element is provided, as in `myElement.connect()`, the element
   * connects to the main output. All connections are removed by the
   * `.disconnect()` method.
   *
   * Note: This method is meant to be used with the p5.sound.js addon library.
   *
   * @param  {AudioNode|Object} audioNode AudioNode from the Web Audio API,
   * or an object from the p5.sound library
   */
  connect(obj) {
    let audioContext, mainOutput;

    // if p5.sound exists, same audio context
    if (typeof fn.getAudioContext === 'function') {
      audioContext = fn.getAudioContext();
      mainOutput = p5.soundOut.input;
    } else {
      try {
        audioContext = obj.context;
        mainOutput = audioContext.destination;
      } catch (e) {
        throw 'connect() is meant to be used with Web Audio API or p5.sound.js';
      }
    }

    // create a Web Audio MediaElementAudioSourceNode if none already exists
    if (!this.audioSourceNode) {
      this.audioSourceNode = audioContext.createMediaElementSource(this.elt);

      // connect to main output when this method is first called
      this.audioSourceNode.connect(mainOutput);
    }

    // connect to object if provided
    if (obj) {
      if (obj.input) {
        this.audioSourceNode.connect(obj.input);
      } else {
        this.audioSourceNode.connect(obj);
      }
    } else {
      // otherwise connect to main output of p5.sound / AudioContext
      this.audioSourceNode.connect(mainOutput);
    }
  }

  /**
   * Disconnect all Web Audio routing, including to the main output.
   *
   * This is useful if you want to re-route the output through audio effects,
   * for example.
   *
   */
  disconnect() {
    if (this.audioSourceNode) {
      this.audioSourceNode.disconnect();
    } else {
      throw 'nothing to disconnect';
    }
  }

  /*** SHOW / HIDE CONTROLS ***/

  /**
   * Show the default
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" target="_blank">HTMLMediaElement</a>
   * controls.
   *
   * Note: The controls vary between web browsers.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background('cornflowerblue');
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(50);
   *
   *   // Display a dragon.
   *   text('🐉', 50, 50);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   let dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   describe('A dragon emoji, 🐉, drawn in the center of a blue square. A song plays in the background. Audio controls are displayed beneath the canvas.');
   * }
   * </code>
   * </div>
   */
  showControls() {
    // must set style for the element to show on the page
    this.elt.style['text-align'] = 'inherit';
    this.elt.controls = true;
  }

  /**
   * Hide the default
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" target="_blank">HTMLMediaElement</a>
   * controls.
   *
   * @example
   * <div>
   * <code>
   * let dragon;
   * let isHidden = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   dragon = createAudio('assets/lucky_dragons.mp3');
   *
   *   // Show the default media controls.
   *   dragon.showControls();
   *
   *   describe('The text "Double-click to hide controls" written in the middle of a gray square. A song plays in the background. Audio controls are displayed beneath the canvas. The controls appear/disappear when the user double-clicks the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *
   *   // Display a different message when controls are hidden or shown.
   *   if (isHidden === true) {
   *     text('Double-click to show controls', 10, 20, 80, 80);
   *   } else {
   *     text('Double-click to hide controls', 10, 20, 80, 80);
   *   }
   * }
   *
   * // Show/hide controls based on a double-click.
   * function doubleClicked() {
   *   if (isHidden === true) {
   *     dragon.showControls();
   *     isHidden = false;
   *   } else {
   *     dragon.hideControls();
   *     isHidden = true;
   *   }
   * }
   * </code>
   * </div>
   */
  hideControls() {
    this.elt.controls = false;
  }

  /**
   * Schedules a function to call when the audio/video reaches a specific time
   * during its playback.
   *
   * The first parameter, `time`, is the time, in seconds, when the function
   * should run. This value is passed to `callback` as its first argument.
   *
   * The second parameter, `callback`, is the function to call at the specified
   * cue time.
   *
   * The third parameter, `value`, is optional and can be any type of value.
   * `value` is passed to `callback`.
   *
   * Calling `media.addCue()` returns an ID as a string. This is useful for
   * removing the cue later.
   *
   * @param {Number}   time     cue time to run the callback function.
   * @param {Function} callback function to call at the cue time.
   * @param {Object} [value]    object to pass as the argument to
   *                            `callback`.
   * @return {Number} id ID of this cue,
   *                     useful for `media.removeCue(id)`.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   let beat = createAudio('assets/beat.mp3');
   *
   *   // Play the beat in a loop.
   *   beat.loop();
   *
   *   // Schedule a few events.
   *   beat.addCue(0, changeBackground, 'red');
   *   beat.addCue(2, changeBackground, 'deeppink');
   *   beat.addCue(4, changeBackground, 'orchid');
   *   beat.addCue(6, changeBackground, 'lavender');
   *
   *   describe('A red square with a beat playing in the background. Its color changes every 2 seconds while the audio plays.');
   * }
   *
   * // Change the background color.
   * function changeBackground(c) {
   *   background(c);
   * }
   * </code>
   * </div>
   */
  addCue(time, callback, val) {
    const id = this._cueIDCounter++;

    const cue = new Cue(callback, time, id, val);
    this._cues.push(cue);

    if (!this.elt.ontimeupdate) {
      this.elt.ontimeupdate = this._onTimeUpdate.bind(this);
    }

    return id;
  }

  /**
   * Removes a callback based on its ID.
   *
   * @param  {Number} id ID of the cue, created by `media.addCue()`.
   *
   * @example
   * <div>
   * <code>
   * let lavenderID;
   * let isRemoved = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   let beat = createAudio('assets/beat.mp3');
   *
   *   // Play the beat in a loop.
   *   beat.loop();
   *
   *   // Schedule a few events.
   *   beat.addCue(0, changeBackground, 'red');
   *   beat.addCue(2, changeBackground, 'deeppink');
   *   beat.addCue(4, changeBackground, 'orchid');
   *
   *   // Record the ID of the "lavender" callback.
   *   lavenderID = beat.addCue(6, changeBackground, 'lavender');
   *
   *   describe('The text "Double-click to remove lavender." written on a red square. The color changes every 2 seconds while the audio plays. The lavender option is removed when the user double-clicks the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Display different instructions based on the available callbacks.
   *   if (isRemoved === false) {
   *     text('Double-click to remove lavender.', 10, 10, 80, 80);
   *   } else {
   *     text('No more lavender.', 10, 10, 80, 80);
   *   }
   * }
   *
   * // Change the background color.
   * function changeBackground(c) {
   *   background(c);
   * }
   *
   * // Remove the lavender color-change cue when the user double-clicks.
   * function doubleClicked() {
   *   if (isRemoved === false) {
   *     beat.removeCue(lavenderID);
   *     isRemoved = true;
   *   }
   * }
   * </code>
   * </div>
   */
  removeCue(id) {
    for (let i = 0; i < this._cues.length; i++) {
      if (this._cues[i].id === id) {
        console.log(id);
        this._cues.splice(i, 1);
      }
    }

    if (this._cues.length === 0) {
      this.elt.ontimeupdate = null;
    }
  }

  /**
   * Removes all functions scheduled with `media.addCue()`.
   *
   * @example
   * <div>
   * <code>
   * let isChanging = true;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   let beat = createAudio('assets/beat.mp3');
   *
   *   // Play the beat in a loop.
   *   beat.loop();
   *
   *   // Schedule a few events.
   *   beat.addCue(0, changeBackground, 'red');
   *   beat.addCue(2, changeBackground, 'deeppink');
   *   beat.addCue(4, changeBackground, 'orchid');
   *   beat.addCue(6, changeBackground, 'lavender');
   *
   *   describe('The text "Double-click to stop changing." written on a square. The color changes every 2 seconds while the audio plays. The color stops changing when the user double-clicks the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Display different instructions based on the available callbacks.
   *   if (isChanging === true) {
   *     text('Double-click to stop changing.', 10, 10, 80, 80);
   *   } else {
   *     text('No more changes.', 10, 10, 80, 80);
   *   }
   * }
   *
   * // Change the background color.
   * function changeBackground(c) {
   *   background(c);
   * }
   *
   * // Remove cued functions and stop changing colors when the user
   * // double-clicks.
   * function doubleClicked() {
   *   if (isChanging === true) {
   *     beat.clearCues();
   *     isChanging = false;
   *   }
   * }
   * </code>
   * </div>
   */
  clearCues() {
    this._cues = [];
    this.elt.ontimeupdate = null;
  }

  // private method that checks for cues to be fired if events
  // have been scheduled using addCue(callback, time).
  _onTimeUpdate() {
    const playbackTime = this.time();

    for (let i = 0; i < this._cues.length; i++) {
      const callbackTime = this._cues[i].time;
      const val = this._cues[i].val;

      if (this._prevTime < callbackTime && callbackTime <= playbackTime) {
        // pass the scheduled callbackTime as parameter to the callback
        this._cues[i].callback(val);
      }
    }

    this._prevTime = playbackTime;
  }
}

// Cue inspired by JavaScript setTimeout, and the
// Tone.js Transport Timeline Event, MIT License Yotam Mann 2015 tonejs.org
// eslint-disable-next-line no-unused-vars
class Cue {
  constructor(callback, time, id, val) {
    this.callback = callback;
    this.time = time;
    this.id = id;
    this.val = val;
  }
}

function media(p5, fn){
  /**
   * Helpers for create methods.
   */
  function addElement(elt, pInst, media) {
    const node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    const c = media
      ? new MediaElement(elt, pInst)
      : new Element(elt, pInst);
    pInst._elements.push(c);
    return c;
  }

  /** VIDEO STUFF **/

  // Helps perform similar tasks for media element methods.
  function createMedia(pInst, type, src, callback) {
    const elt = document.createElement(type);

    // Create source elements from given sources
    src = src || '';
    if (typeof src === 'string') {
      src = [src];
    }
    for (const mediaSource of src) {
      const sourceEl = document.createElement('source');
      sourceEl.setAttribute('src', mediaSource);
      elt.appendChild(sourceEl);
    }

    // If callback is provided, attach to element
    if (typeof callback === 'function') {
      const callbackHandler = () => {
        callback();
        elt.removeEventListener('canplaythrough', callbackHandler);
      };
      elt.addEventListener('canplaythrough', callbackHandler);
    }

    const mediaEl = addElement(elt, pInst, true);
    mediaEl.loadedmetadata = false;

    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', () => {
      mediaEl.width = elt.videoWidth;
      mediaEl.height = elt.videoHeight;

      // set elt width and height if not set
      if (mediaEl.elt.width === 0) mediaEl.elt.width = elt.videoWidth;
      if (mediaEl.elt.height === 0) mediaEl.elt.height = elt.videoHeight;
      if (mediaEl.presetPlaybackRate) {
        mediaEl.elt.playbackRate = mediaEl.presetPlaybackRate;
        delete mediaEl.presetPlaybackRate;
      }
      mediaEl.loadedmetadata = true;
    });

    return mediaEl;
  }

  /**
   * Creates a `&lt;video&gt;` element for simple audio/video playback.
   *
   * `createVideo()` returns a new
   * <a href="#/p5.MediaElement">p5.MediaElement</a> object. Videos are shown by
   * default. They can be hidden by calling `video.hide()` and drawn to the
   * canvas using <a href="#/p5/image">image()</a>.
   *
   * The first parameter, `src`, is the path the video. If a single string is
   * passed, as in `'assets/topsecret.mp4'`, a single video is loaded. An array
   * of strings can be used to load the same video in different formats. For
   * example, `['assets/topsecret.mp4', 'assets/topsecret.ogv', 'assets/topsecret.webm']`.
   * This is useful for ensuring that the video can play across different browsers with
   * different capabilities. See
   * <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats'>MDN</a>
   * for more information about supported formats.
   *
   * The second parameter, `callback`, is optional. It's a function to call once
   * the video is ready to play.
   *
   * @param  {String|String[]} src path to a video file, or an array of paths for
   *                               supporting different browsers.
   * @param  {Function} [callback] function to call once the video is ready to play.
   * @return {p5.MediaElement}   new <a href="#/p5.MediaElement">p5.MediaElement</a> object.
   *
   * @example
   * <div class='notest'>
   * <code>
   * function setup() {
   *   noCanvas();
   *
   *   // Load a video and add it to the page.
   *   // Note: this may not work in some browsers.
   *   let video = createVideo('assets/small.mp4');
   *
   *   // Show the default video controls.
   *   video.showControls();
   *
   *   describe('A video of a toy robot with playback controls beneath it.');
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * function setup() {
   *   noCanvas();
   *
   *   // Load a video and add it to the page.
   *   // Provide an array options for different file formats.
   *   let video = createVideo(
   *     ['assets/small.mp4', 'assets/small.ogv', 'assets/small.webm']
   *   );
   *
   *   // Show the default video controls.
   *   video.showControls();
   *
   *   describe('A video of a toy robot with playback controls beneath it.');
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * let video;
   *
   * function setup() {
   *   noCanvas();
   *
   *   // Load a video and add it to the page.
   *   // Provide an array options for different file formats.
   *   // Call mute() once the video loads.
   *   video = createVideo(
   *     ['assets/small.mp4', 'assets/small.ogv', 'assets/small.webm'],
   *     muteVideo
   *   );
   *
   *   // Show the default video controls.
   *   video.showControls();
   *
   *   describe('A video of a toy robot with playback controls beneath it.');
   * }
   *
   * // Mute the video once it loads.
   * function muteVideo() {
   *   video.volume(0);
   * }
   * </code>
   * </div>
   */
  fn.createVideo = function (src, callback) {
    // p5._validateParameters('createVideo', arguments);
    return createMedia(this, 'video', src, callback);
  };

  /** AUDIO STUFF **/

  /**
   * Creates a hidden `&lt;audio&gt;` element for simple audio playback.
   *
   * `createAudio()` returns a new
   * <a href="#/p5.MediaElement">p5.MediaElement</a> object.
   *
   * The first parameter, `src`, is the path the video. If a single string is
   * passed, as in `'assets/video.mp4'`, a single video is loaded. An array
   * of strings can be used to load the same video in different formats. For
   * example, `['assets/video.mp4', 'assets/video.ogv', 'assets/video.webm']`.
   * This is useful for ensuring that the video can play across different
   * browsers with different capabilities. See
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats" target="_blank">MDN</a>
   * for more information about supported formats.
   *
   * The second parameter, `callback`, is optional. It's a function to call once
   * the audio is ready to play.
   *
   * @param  {String|String[]} [src] path to an audio file, or an array of paths
   *                                 for supporting different browsers.
   * @param  {Function} [callback]   function to call once the audio is ready to play.
   * @return {p5.MediaElement}       new <a href="#/p5.MediaElement">p5.MediaElement</a> object.
   *
   * @example
   * <div class='notest'>
   * <code>
   * function setup() {
   *   noCanvas();
   *
   *   // Load the audio.
   *   let beat = createAudio('assets/beat.mp3');
   *
   *   // Show the default audio controls.
   *   beat.showControls();
   *
   *   describe('An audio beat plays when the user double-clicks the square.');
   * }
   * </code>
   * </div>
   */
  fn.createAudio = function (src, callback) {
    // p5._validateParameters('createAudio', arguments);
    return createMedia(this, 'audio', src, callback);
  };

  /** CAMERA STUFF **/

  fn.VIDEO = 'video';

  fn.AUDIO = 'audio';

  // from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  /**
   * Creates a `&lt;video&gt;` element that "captures" the audio/video stream from
   * the webcam and microphone.
   *
   * `createCapture()` returns a new
   * <a href="#/p5.MediaElement">p5.MediaElement</a> object. Videos are shown by
   * default. They can be hidden by calling `capture.hide()` and drawn to the
   * canvas using <a href="#/p5/image">image()</a>.
   *
   * The first parameter, `type`, is optional. It sets the type of capture to
   * use. By default, `createCapture()` captures both audio and video. If `VIDEO`
   * is passed, as in `createCapture(VIDEO)`, only video will be captured.
   * If `AUDIO` is passed, as in `createCapture(AUDIO)`, only audio will be
   * captured. A constraints object can also be passed to customize the stream.
   * See the <a href="http://w3c.github.io/mediacapture-main/getusermedia.html#media-track-constraints" target="_blank">
   * W3C documentation</a> for possible properties. Different browsers support different
   * properties.
   *
   * The 'flipped' property is an optional property which can be set to `{flipped:true}`
   * to mirror the video output.If it is true then it means that video will be mirrored
   * or flipped and if nothing is mentioned then by default it will be `false`.
   *
   * The second parameter,`callback`, is optional. It's a function to call once
   * the capture is ready for use. The callback function should have one
   * parameter, `stream`, that's a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaStream" target="_blank">MediaStream</a> object.
   *
   * Note: `createCapture()` only works when running a sketch locally or using HTTPS. Learn more
   * <a href="http://stackoverflow.com/questions/34197653/getusermedia-in-chrome-47-without-using-https" target="_blank">here</a>
   * and <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia" target="_blank">here</a>.
   *
   * @param  {(AUDIO|VIDEO|Object)}  [type] type of capture, either AUDIO or VIDEO,
   *                                   or a constraints object. Both video and audio
   *                                   audio streams are captured by default.
   * @param  {Object}                  [flipped] flip the capturing video and mirror the output with `{flipped:true}`. By
   *                                   default it is false.
   * @param  {Function}                [callback] function to call once the stream
   *                                   has loaded.
   * @return {p5.MediaElement} new <a href="#/p5.MediaElement">p5.MediaElement</a> object.
   *
   * @example
   * <div class='notest'>
   * <code>
   * function setup() {
   *   noCanvas();
   *
   *   // Create the video capture.
   *   createCapture(VIDEO);
   *
   *   describe('A video stream from the webcam.');
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * let capture;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create the video capture and hide the element.
   *   capture = createCapture(VIDEO);
   *   capture.hide();
   *
   *   describe('A video stream from the webcam with inverted colors.');
   * }
   *
   * function draw() {
   *   // Draw the video capture within the canvas.
   *   image(capture, 0, 0, width, width * capture.height / capture.width);
   *
   *   // Invert the colors in the stream.
   *   filter(INVERT);
   * }
   * </code>
   * </div>
   * <div class='notest'>
   * <code>
   * let capture;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create the video capture with mirrored output.
   *   capture = createCapture(VIDEO,{ flipped:true });
   *   capture.size(100,100);
   *
   *   describe('A video stream from the webcam with flipped or mirrored output.');
   * }
   *
   * </code>
   * </div>
   *
   * <div class='notest norender'>
   * <code>
   * function setup() {
   *   createCanvas(480, 120);
   *
   *   // Create a constraints object.
   *   let constraints = {
   *     video: {
   *       mandatory: {
   *         minWidth: 1280,
   *         minHeight: 720
   *       },
   *       optional: [{ maxFrameRate: 10 }]
   *     },
   *     audio: false
   *   };
   *
   *   // Create the video capture.
   *   createCapture(constraints);
   *
   *   describe('A video stream from the webcam.');
   * }
   * </code>
   * </div>
   */
  fn.createCapture = function (...args) {
    // p5._validateParameters('createCapture', args);

    // return if getUserMedia is not supported by the browser
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      throw new DOMException('getUserMedia not supported in this browser');
    }

    let useVideo = true;
    let useAudio = true;
    let constraints;
    let callback;
    let flipped = false;

    for (const arg of args) {
      if (arg === fn.VIDEO) useAudio = false;
      else if (arg === fn.AUDIO) useVideo = false;
      else if (typeof arg === 'object') {
        if (arg.flipped !== undefined) {
          flipped = arg.flipped;
          delete arg.flipped;
        }
        constraints = Object.assign({}, constraints, arg);
      }
      else if (typeof arg === 'function') {
        callback = arg;
      }
    }

    const videoConstraints = { video: useVideo, audio: useAudio };
    constraints = Object.assign({}, videoConstraints, constraints);
    const domElement = document.createElement('video');
    // required to work in iOS 11 & up:
    domElement.setAttribute('playsinline', '');
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      try {
        if ('srcObject' in domElement) {
          domElement.srcObject = stream;
        } else {
          domElement.src = window.URL.createObjectURL(stream);
        }
      }
      catch (err) {
        domElement.src = stream;
      }
    }).catch(e => {
      if (e.name === 'NotFoundError')
        p5._friendlyError('No webcam found on this device', 'createCapture');
      if (e.name === 'NotAllowedError')
        p5._friendlyError('Access to the camera was denied', 'createCapture');

      console.error(e);
    });

    const videoEl = addElement(domElement, this, true);
    videoEl.loadedmetadata = false;
    // set width and height onload metadata
    domElement.addEventListener('loadedmetadata', function () {
      domElement.play();
      if (domElement.width) {
        videoEl.width = domElement.width;
        videoEl.height = domElement.height;
        if (flipped) {
          videoEl.elt.style.transform = 'scaleX(-1)';
        }
      } else {
        videoEl.width = videoEl.elt.width = domElement.videoWidth;
        videoEl.height = videoEl.elt.height = domElement.videoHeight;
      }
      videoEl.loadedmetadata = true;

      if (callback) callback(domElement.srcObject);
    });
    videoEl.flipped = flipped;
    return videoEl;
  };

  // =============================================================================
  //                         p5.MediaElement additions
  // =============================================================================

  /**
   * A class to handle audio and video.
   *
   * `p5.MediaElement` extends <a href="#/p5.Element">p5.Element</a> with
   * methods to handle audio and video. `p5.MediaElement` objects are created by
   * calling <a href="#/p5/createVideo">createVideo</a>,
   * <a href="#/p5/createAudio">createAudio</a>, and
   * <a href="#/p5/createCapture">createCapture</a>.
   *
   * @class p5.MediaElement
   * @param {String} elt DOM node that is wrapped
   * @extends p5.Element
   *
   * @example
   * <div class='notest'>
   * <code>
   * let capture;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createCapture().
   *   capture = createCapture(VIDEO);
   *   capture.hide();
   *
   *   describe('A webcam feed with inverted colors.');
   * }
   *
   * function draw() {
   *   // Display the video stream and invert the colors.
   *   image(capture, 0, 0, width, width * capture.height / capture.width);
   *   filter(INVERT);
   * }
   * </code>
   * </div>
   */
  p5.MediaElement = MediaElement;

  /**
   * Path to the media element's source as a string.
   *
   * @for p5.MediaElement
   * @property src
   * @return {String} src
   * @example
   * <div>
   * <code>
   * let beat;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.MediaElement using createAudio().
   *   beat = createAudio('assets/beat.mp3');
   *
   *   describe('The text "https://p5js.org/reference/assets/beat.mp3" written in black on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   textWrap(CHAR);
   *   text(beat.src, 10, 10, 80, 80);
   * }
   * </code>
   * </div>
   */
}

export default media;
export { MediaElement };

if(typeof p5 !== 'undefined'){
  media(p5, p5.prototype);
}
