# A Platform for Algorithmic Composition on p5.js-sound
#### by Chan Jun Shern ([@junshern](https://github.com/JunShern))

![tutorial-homepage](https://raw.githubusercontent.com/JunShern/algorithmic-music-tutorial/main/screenshots/home.png)

## Summary

My project this summer had the goal of making [p5.js-sound](https://github.com/processing/p5.js-sound) a friendly platform for algorithmic music composition tasks.

In line with this objective, work for the project involved building up features, fixing bugs, adding documentation and producing examples of p5.js sketches related to algorithmic composition.

To encourage the use of these features and resources we've built for algorithmic composition, the project culminates in an [online tutorial](https://junshern.github.io/algorithmic-music-tutorial/) which walks through a number of examples and best practices for algorithmic composition on p5.js-sound.

## Contributions
Note that most contributions for this project are on the [p5.js-sound repository](https://github.com/processing/p5.js-sound), unless otherwise stated. Links should link to the correct issues and pull requests in any case.

### Bug fixes
- Fix errors and add documentation in p5.js-sound gh-pages [#263](https://github.com/processing/p5.js-sound/issues/263)
- Fix bug in SoundLoop.pause() [#287](https://github.com/processing/p5.js-sound/pull/287)
- Fix issue with PolySynth voice distortion (with help from @therewasaguy) [#301](https://github.com/processing/p5.js-sound/issues/301)
- Fix error in documentation for MonoSynth [#262](https://github.com/processing/p5.js-sound/pull/262)
- Fix error in documentation for setADSR [#285](https://github.com/processing/p5.js-sound/pull/285)
- Rename Env class to Envelope for clarity and consistency [#288](https://github.com/processing/p5.js-sound/pull/288)

### New features
- Explore possibilities for a new SoundFont synth class [#289](https://github.com/processing/p5.js-sound/issues/289)

### New examples
- Add example to demonstrate ADSR envelope [#279](https://github.com/processing/p5.js-sound/pull/279)
- Add 5 new examples on timing and visualization for interactive music sketches [#302](https://github.com/processing/p5.js-sound/pull/302)
  - Static note scheduling
  - Dynamic note scheduling
  - Instantaneous playback
  - Note-by-note visualization
  - Step sequencer example
- Add example for algorithmic composition using Fractals [#308](https://github.com/processing/p5.js-sound/pull/308)
- Add example for algorithmic composition using Markov chains [#309](https://github.com/processing/p5.js-sound/pull/309)
- Add example for algorithmic composition using Genetic algorithms [#311](https://github.com/processing/p5.js-sound/pull/311)

![genetic-music-example](https://raw.githubusercontent.com/JunShern/algorithmic-music-tutorial/main/screenshots/sketch-fullscreen.PNG)

### Tutorial
- Create an online tutorial which encapsulates new examples and best practices developed for algorithmic composition on p5.js-sound. The tutorial consists of narrative + interactive examples embedded within the page which users can interact with directly.
- [Tutorial repository](https://github.com/JunShern/explorable-algcomp)
- [Tutorial website](https://junshern.github.io/algorithmic-music-tutorial/)

![tutorial-screenshot](https://raw.githubusercontent.com/JunShern/algorithmic-music-tutorial/main/screenshots/sketch1.PNG)

## Conclusion
All in all, it has been a highly satisfying summer. When we first started work, there were a lot of questions up in the air about the best way to go about implementing algorithmic music in p5.js-sound. Fortunately, we were able to build off the excellent work from past contributors (including work from previous GSoC participants!) to get all the functionality we needed. 

At the end of this project, we can now confidently recommend p5.js-sound as a capable and reliable library for developing algorithmic music. The examples and final tutorial show these capabilities quite well, and hopefully the work done in this project will inspire and encourage many users to create their own algorithmic music applications!

## Support

Any questions pertaining to this project may be addressed via Issues on the [p5.js-sound repository](https://github.com/processing/p5.js-sound), or on the [tutorial repository](https://github.com/JunShern/explorable-algcomp) if directly related to tutorial content. Simply create a new Issue and either assign or tag me in the conversation with @junshern. For anything else, don't hesitate to get in touch at chanjunshern@gmail.com!

## Acknowledgements

Huge thanks goes to my mentor Jason Sigal for all his support and guidance throughout the project, as well as to all developers and community members of p5.js and the Processing Foundation who made all of this possible. 

Thank you so much!
