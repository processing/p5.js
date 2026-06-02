# p5.js 1.0 Roadmap [WIP]

This document is a list of possible features, improvements, and maintenance items for a future 1.0 version of p5.js. The first draft was created by the working group at UCLA Design Media Arts and is put out for your feedback. This is a working draft that may be updated and will be significantly revised at the p5.js Contributor’s Conference, schedule for August 2019. Our goal is to release p5.js 1.0 by the end of 2019.

With the exception of ES6 migration, the tasks here are not ordered by priority. The [milestones](https://github.com/processing/p5.js/milestones) on github is where we prioritize tasks for releases and track progress.

## ES6 migration
* Phase 1: User facing
  * p5js.org tutorials (issue per tutorial)
  * p5js.org examples (issue per section)
  * p5js.org reference examples (issue per section)
* Phase 2: Developer facing
  * Build processes
  * Developer docs
* Phase 3: Codebase
  * TBD: This may be done by one dedicated person, we will not start on this until this is determined.
* Later phase:
  * Other materials -- To what extent do external materials (Getting Started with p5.js book, Coding Train) need to be updated to ensure a smooth rollout of educational resources?
  * Contributed libraries

## Maintenance
* Audio updates for pending Chrome changes (user must interact first)
  * Update reference documentation and examples, and examples page
  * Update FES to warn about this?
* More complete unit tests
  * Clearer tutorial for doing this
* Improve Friendly Error System documentation
  * Add comments to https://github.com/processing/p5.js/blob/main/src/core/friendly_errors/fes_core.js to better document what’s happening in this process.

## Bug fixing
* Mobile device support / upgrades
* WebGL robustness
  * Lighting
    * lights() implementation
    * Per pixel lighting by default
    * Simplify shader pipeline?
    * Update examples
  * Simplify shape pipeline
    * One rendering method for shapes, construct geom object from retain mode

## New Features
* Shapes
  * createShape() public API for returning a p5.Geometry object?? What is the equivalent in 2D?
  * Anything SVG for 2D?
* GIF support with image()
  * createImg is a good work around but students love gifs :)
* i18n (localisation) for error messages + FES
  * Develop infrastructure for localizing error and console messages within the codebase
  * Translate various error messages
* K-12 support as discussed [in thread](https://github.com/processing/p5.js/issues/2305)
  * add circle() and square()
  * Get makeyourownalgorithmicart/simple.js on libraries page
* Implement Promises across the library
  * Confirm/implement use of Promises across codebase
  * Open use of Promises in API for loadX() functions (lower priority?)
  
## Contributor process and support
* Open tickets for incompleteness in various areas:
  * Testing
  * Feature implementation
  * Translation
* Stricter use of [semantic versioning](https://semver.org/)
* Clarify process for soliciting roadmap input for future versions.

## Etc
* For 1.0 release, drop a sweet new set of curated examples from artists and coders.
