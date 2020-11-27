# AudioWorklet Support in p5.js-sound

For my Google Summer of Code 2019 project, I worked with my mentor [Jason Sigal](https://github.com/therewasaguy) to add [AudioWorklet](https://developers.google.com/web/updates/2017/12/audio-worklet) support to [p5.js-sound](https://github.com/processing/p5.js-sound), allowing certain parts of the library to run more efficiently by moving custom audio processing to a separate audio thread. I also helped Jason integrate [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/) into the p5.js-sound [Grunt](https://gruntjs.com/) build pipeline, allowing the library's developers to use ES6 JavaScript features and laying the groundwork for modernizing the codebase and examples.

## AudioWorklet

The AudioWorklet API consists of two classes: [AudioWorkletProcessor](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor) and [AudioWorkletNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode). AudioWorkletProcessors contain audio processing code that runs in a separate thread and are meant to be loaded from separate files, while AudioWorkletNodes run on the main thread and are used to connect to other Web Audio nodes.

AudioWorklet replaces [ScriptProcessorNode](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode), a now-deprecated Web Audio node that runs audio code in the browser's main thread. p5.js-sound used ScriptProcessorNode internally in three classes:

- [p5.SoundFile](https://p5js.org/reference/#/p5.SoundFile), which used a ScriptProcessorNode to keep track of a SoundFile's current playback position.
- [p5.Amplitude](https://p5js.org/reference/#/p5.Amplitude), which used a ScriptProcessorNode to perform amplitude analysis.
- [p5.SoundRecorder](https://p5js.org/reference/#/p5.SoundRecorder), which used a ScriptProcessorNode to concatenate audio buffers together during the recording process.

For each of these classes, I created new AudioWorkletProcessors for [p5.SoundFile](https://github.com/processing/p5.js-sound/blob/4d3a3833de4d30f6770740052a82586444a4482a/src/audioWorklet/soundFileProcessor.js), [p5.Amplitude](https://github.com/processing/p5.js-sound/blob/4d3a3833de4d30f6770740052a82586444a4482a/src/audioWorklet/amplitudeProcessor.js), and [p5.SoundRecorder](https://github.com/processing/p5.js-sound/blob/4d3a3833de4d30f6770740052a82586444a4482a/src/audioWorklet/recorderProcessor.js) that replicated the corresponding ScriptProcessorNode's [onaudioprocess](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess) function.

### AudioWorkletProcessors and Async Loading

Before these AudioWorkletProcessors could be used as AudioWorkletNodes, they needed be loaded asynchronously via a call to [`audioWorklet.addModule()`](https://developer.mozilla.org/en-US/docs/Web/API/Worklet/addModule), which expects a URL pointing to the file containing the processor definition.

This presented a problem: p5.js-sound is typically included in sketches as a single file, so I couldn't load the worklet processors as separate files. The solution was to convert the source for each AudioWorkletProcessor into a string using Webpack's [raw-loader](https://github.com/webpack-contrib/raw-loader) (see [Webpack and ES6](#webpack-and-es6) below for more details), then construct a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) from that string and generate an [object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) for the Blob which could be passed into `audioWorklet.addModule()`.

```javascript
function loadAudioWorkletModules() {
  return Promise.all(moduleSources.map(function(moduleSrc) {
    const blob = new Blob([moduleSrc], { type: 'application/javascript' });
    const objectURL = URL.createObjectURL(blob);
    return ac.audioWorklet.addModule(objectURL);
  }));
}
```

To play nicely with the rest of p5.js, the AudioWorkletProcessors needed to be loaded before a sketch's `setup()` function, during `preload()`. However, I didn't want to force users to write a `preload()` function every time they made a sketch with p5.js-sound, as that would break existing sketches and make the library harder to use.

The (slightly-hacky) solution that I arrived at was to register a function with the p5.js ["init" hook](https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md#use-registermethod-to-register-functions-with-p5-that-should-be-called-at-various-times) that first ensured that a `preload()` function was defined on the sketch, then incremented p5.js's internal preload counter to get `preload()` to wait for all of the processor modules to load:

```javascript
p5.prototype.registerMethod('init', function() {
  // ensure that a preload function exists so that p5 will wait for preloads to finish
  if (!this.preload && !window.preload) {
    this.preload = function() {};
  }
  // use p5's preload system to load necessary AudioWorklet modules before setup()
  this._preloadCount++;
  const onWorkletModulesLoad = function() {
    this._decrementPreload();
  }.bind(this);
  loadAudioWorkletModules().then(onWorkletModulesLoad);
});
```

This approach is probably a little too dependent on p5.js's internal workings, but it might be useful for other p5.js library developers running into similar asynchronous loading issues in the future.

### Polyfill

To avoid breaking p5.js-sound in browsers like Firefox and Safari that haven't yet implemented the AudioWorklet API, I added a [polyfill](https://github.com/GoogleChromeLabs/audioworklet-polyfill) to the library that falls back to ScriptProcessorNode in unsupported browsers.

### Ring Buffers

AudioWorklet processors use a fixed buffer size of 128 frames, unlike ScriptProcessorNodes which take a buffer size as an argument. A lower buffer size will generally result in lower latency but also higher CPU usage.

To allow for more control over the buffer sizes of the various AudioWorkletNodes in p5.js-sound, I added a ring buffer (adapted from some of [Google Chrome Labs' sample code](https://github.com/GoogleChromeLabs/web-audio-samples/blob/7ee9a21f224a7fd5093cf1b3ec13fa958d97fa4c/audio-worklet/design-pattern/lib/wasm-audio-helper.js#L170)) to each AudioWorkletProcessor which accumulates frames of audio until the desired buffer size has been reached. For more details on this approach, see the "Handling Buffer Size Mismatch" section of the article [Audio Worklet Design Patterns](https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern#handling_buffer_size_mismatch).

## Webpack and ES6

As mentioned above, loading AudioWorkletProcessor modules as strings was made much easier by including Webpack in the p5.js-sound build pipeline. Since ES6 JavaScript support had been on the p5.js-sound to-do list for a while, Jason and I decided to pair on integrating Webpack and Babel into the p5.js-sound Grunt build configuration. This involved replacing [requirejs](https://github.com/gruntjs/grunt-contrib-requirejs) with [grunt-webpack](https://github.com/webpack-contrib/grunt-webpack) and adding a [Webpack config](https://github.com/processing/p5.js-sound/blob/4d3a3833de4d30f6770740052a82586444a4482a/webpack.config.js). This change allows p5.js-sound developers to use ES6 features throughout the codebase, along with source maps for easier debugging of compiled ES6 code in the browser.

Unfortunately, the additional comments inserted by Webpack into the compiled bundle had the side-effect of breaking the p5.js-sound documentation generated from [YUIDoc](https://yui.github.io/yuidoc/) comments. Jason is currently in the process of fixing this issue by extracting the YUIDoc comments into a separate file during the build. Progress on this can be followed in [PR #377](https://github.com/processing/p5.js-sound/pull/377).

## Contributions

- [Add tests for p5.SoundRecorder and lint existing tests (#364)](https://github.com/processing/p5.js-sound/pull/364)

- [Replace requirejs with webpack to enable ES6+ and non-AMD modules (#366)](https://github.com/processing/p5.js-sound/pull/366)

- [Replace ScriptProcessorNode in p5.SoundRecorder with AudioWorkletNode (#369)](https://github.com/processing/p5.js-sound/pull/369)

- [Replace ScriptProcessorNode with AudioWorkletNode in p5.SoundFile and p5.Amplitude (#373)](https://github.com/processing/p5.js-sound/pull/373)

- [Add ring buffers to AudioWorklet processors to support variable buffer sizes (#376)](https://github.com/processing/p5.js-sound/pull/376)

- [Bugfixes for p5.Amplitude and p5.Soundfile for browsers without AudioWorklet support (#380)](https://github.com/processing/p5.js-sound/pull/380)

## Acknowledgements

I'm extremely grateful to the Processing Foundation for giving me the opportunity to contribute to p5.js, as well as to my mentor Jason Sigal for all of his support over the course of this project.
