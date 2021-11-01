# FES Reference and Notes from Developers
This document contains reference and development notes for the p5.js Friendly Error System (FES).

## FES Functions: Reference

### `_report()`
##### Description
`_report()` is the primary function that prints directly to the console with the output of the error helper message.
If `_fesLogger` is set ( i.e., we are running tests ), _report will call _fesLogger instead of console.log.
##### Syntax
````JavaScript
_report(message)
````
````JavaScript
_report(message, func)
````
````JavaScript
_report(message, func, color)
````
##### Parameters
```
@param  {String} message          message to be printed
@param  {String} [func]           name of function calling
@param  {Number|String} [color]   CSS color string or error type
```
##### Location
core/friendly_errors/fes_core.js


### `_friendlyError()`
##### Description
`_friendlyError()` creates and prints a friendly error message. Any p5 function can call this function to offer a friendly error message.
The call sequence to `_friendlyError` looks something like this:
```
_friendlyError
  _report
```
##### Syntax
````JavaScript
_friendlyError(message)
````
````JavaScript
_friendlyError(message, func)
````
````JavaScript
_friendlyError(message, func, color)
````
##### Parameters
```
@param  {String}               message the words to be said
@param  {String}               [func]  the name of the function to link
@param  {Number|String}        [color] CSS color string or error type
```
##### Location
core/friendly_errors/fes_core.js

### `_friendlyFileLoadError()`
##### Examples
File loading error example:
````JavaScript
/// missing font file
let myFont;
function preload() {
  myFont = loadFont('assets/OpenSans-Regular.ttf');
};
function setup() {
  fill('#ED225D');
  textFont(myFont);
  textSize(36);
  text('p5*js', 10, 50);
};
function draw() {};
// FES will generate the following message in the console:
// > 🌸 p5.js says: It looks like there was a problem loading your font. Try checking if the file path [assets/OpenSans-Regular.ttf] is correct, hosting the font online, or running a local server.[https://github.com/processing/p5.js/wiki/Local-server]
````
##### Description
`_friendlyFileLoadError()` is called by the `loadX()` functions if there is an error during file loading.

This function generates and displays friendly error messages if a file fails to load correctly. It also checks if the size of a file might be too large to load and produces a warning.

Currently version contains templates for generating error messages for `image`, `XML`, `table`, `text`, `json` and `font` files.
Implemented to:
* `image/loading_displaying/loadImage()`
* `io/files/loadFont()`
* `io/files/loadTable()`
* `io/files/loadJSON()`
* `io/files/loadStrings()`
* `io/files/loadXML()`
* `io/files/loadBytes()`.

The call sequence to `_friendlyFileLoadError` looks something like this:
```
_friendlyFileLoadError
  _report
```
##### Syntax
````JavaScript
_friendlyFileLoadError(errorType, filePath)
````
##### Parameters
```
@param  {Number} errorType
@param  {String} filePath
```
##### Location
core/friendly_errors/file_errors.js

### `validateParameters()`
##### Examples
Missing parameter example:
````JavaScript
arc(1, 1, 10.5, 10);
// FES will generate the following message in the console:
// > 🌸 p5.js says: It looks like arc() received an empty variable in spot #4 (zero-based index). If not intentional, this is often a problem with scope: [https://p5js.org/examples/data-variable-scope.html]. [http://p5js.org/reference/#p5/arc]
// > 🌸 p5.js says: It looks like arc() received an empty variable in spot #5 (zero-based index). If not intentional, this is often a problem with scope: [https://p5js.org/examples/data-variable-scope.html]. [http://p5js.org/reference/#p5/arc]
````
Wrong type example:
````JavaScript
arc('1', 1, 10.5, 10, 0, Math.PI, 'pie');
// FES will generate the following message in the console:
// > 🌸 p5.js says: arc() was expecting Number for parameter #0 (zero-based index), received string instead. [http://p5js.org/reference/#p5/arc]
````
##### Description
`validateParameters()` runs parameter validation by matching the input parameters with information from `docs/reference/data.json`, which is created from the function's inline documentation. It checks that a function call contains the correct number and the correct type of parameters.

This function can be called through: `p5._validateParameters(FUNCT_NAME, ARGUMENTS)` or, `p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)` inside the function that requires parameter validation. It is recommended to use static version, `p5._validateParameters` for general purposes. `p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)` mainly remained for debugging and unit testing purposes.

Implemented to functions in:
* `color/creating_reading`
* `core/2d_primitives`
* `core/curves`
* `utilities/string_functions`

##### Syntax
````JavaScript
_validateParameters(func, args)
````
##### Parameters
```
@param  {String}  func     the name of the function
@param  {Array}   args      user input arguments
```
##### Location
core/friendly_errors/validate_params.js

### `fesErrorMonitor()`
##### Examples
Internal Error Example 1
````JavaScript
function preload() {
  // error in background() due to it being called in
  // preload
  background(200);
}
// FES will show:
// > 🌸 p5.js says: An error with message "Cannot read property 'background' of undefined" occured inside the p5js library when "background" was called (on line 4 in sketch.js [http://localhost:8000/lib/empty-example/sketch.js:4:3]).
//If not stated otherwise, it might be due to "background" being called from preload. Nothing besides load calls (loadImage, loadJSON, loadFont, loadStrings, etc.) should be inside the preload function. (http://p5js.org/reference/#/p5/preload)
````
Internal Error Example 2
````JavaScript
function setup() {
  cnv = createCanvas(200, 200);
  cnv.mouseClicked();
}
// > 🌸 p5.js says: An error with message "Cannot read property 'bind' of undefined" occured inside the p5js library when mouseClicked was called (on line 3 in sketch.js [http://localhost:8000/lib/empty-example/sketch.js:3:7]) If not stated otherwise, it might be an issue with the arguments passed to mouseClicked. (http://p5js.org/reference/#/p5/mouseClicked)
````
Error in user's sketch example (scope)
````JavaScript
function setup() {
  let b = 1;
}
function draw() {
  b += 1;
}
// FES will show:
// > 🌸 p5.js says: There's an error due to "b" not being defined in the current scope (on line 5 in sketch.js [http://localhost:8000/lib/empty-example/sketch.js:5:3]). If you have defined it in your code, you should check its scope, spelling, and letter-casing (JavaScript is case-sensitive). For more: https://p5js.org/examples/data-variable-scope.html https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_Defined#What_went_wrong
````
Error in user's sketch example (spelling)
````JavaScript
function setup() {
  colour(1, 2, 3);
}
// FES will show:
// > 🌸 p5.js says: It seems that you may have accidentally written "colour" instead of "color" (on line 2 in sketch.js [http://localhost:8000/lib/empty-example/sketch.js:2:3]). Please correct it to color if you wish to use the function from p5.js (http://p5js.org/reference/#/p5/color)
````
##### Description
`fesErrorMonitor()` handles various errors that the browser show. The function generates global error messages.

`_fesErrorMonitor()` can be called either by an error event, an unhandled rejection event, or it can be manually called in a catch block as follows:
```
try { someCode(); } catch(err) { p5._fesErrorMonitor(err); }
```

The function currently works with some kinds of ReferenceError, SyntaxError, and TypeError. You can find the complete list of supported errors in `browser_errors.js`.

The call sequence for `_fesErrorMonitor` roughly looks something like this:
```
 _fesErrorMonitor
     processStack
       printFriendlyError
     (if type of error is ReferenceError)
       _handleMisspelling
         computeEditDistance
         _report
       _report
       printFriendlyStack
     (if type of error is SyntaxError, TypeError, etc)
       _report
       printFriendlyStack
```
##### Syntax
````JavaScript
fesErrorMonitor(event)
````
##### Parameters
```
@param {*} e	  Event object to extract error details from
```
##### Location
core/friendly_errors/fes_core.js

### `_fesCodeReader()`
##### Examples
Redefining p5.js reserved constant
````JavaScript
function setup() {
  //PI is a p5.js reserved constant
  let PI = 100;
}
// FES will show:
// > 🌸 p5.js says: you have used a p5.js reserved variable "PI" make sure you change the variable name to something else. (https://p5js.org/reference/#/p5/PI)
````
Redefining p5.js reserved function
````JavaScript
function setup() {
  //text is a p5.js reserved function
  let text = 100;
}
// FES will show:
// > 🌸 p5.js says: you have used a p5.js reserved function "text" make sure you change the function name to something else.
````
##### Description
`_fesCodeReader()` checks if (1) any p5.js constant or function is used outside of setup and draw function and (2) any p5.js reserved constant or function is redeclared.
In setup() and draw() function it performs:
 * Extraction of the code written by the user
 * Conversion of the code to an array of lines of code
 * Catching variable and function declaration
 * Checking if the declared function/variable is a reserved p5.js constant or function and report it.

This function is executed whenever the `load` event is triggered.

##### Location
core/friendly_errors/fes_core/sketch_reader.js

### `checkForUserDefinedFunctions()`
##### Examples
````JavaScript
function preLoad() {
  loadImage('myimage.png');
}
// FES will show:
// > 🌸 p5.js says: It seems that you may have accidentally written preLoad instead of preload. Please correct it if it's not intentional. (http://p5js.org/reference/#/p5/preload)
````
##### Description
Checks if any user defined function (`setup()`, `draw()`, `mouseMoved()`, etc.) has been used with a capitalization mistake.
##### Syntax
````JavaScript
checkForUserDefinedFunctions(context)
````
##### Parameters
```
@param {*} context  Current default context.
                    Set to window in "global mode" and
                    to a p5 instance in "instance mode"
```
##### Location
core/friendly_errors/fes_core.js


## Development Notes: Notes from Developers
#### Misc. FES Functions that Generates Friendly Errors
* `helpForMisusedAtTopLevelCode()` is called by `fes_core.js` on window load to check for use of p5.js functions outside of `setup()` or `draw()`.

* `friendlyWelcome()` prints to console directly. (Hidden by default.)

* `stacktrace.js` contains the code to parse the error stack, borrowed from https://github.com/stacktracejs/stacktrace.js. This is called by `fesErrorMonitor()` and `handleMisspelling()`

#### Preparing p5.js Objects for Parameter Validation
* Any p5.js objects that will be used for parameter validation will need to assign value for `name` parameter (name of the object) within the class declaration. e.g.:
```javascript
p5.newObject = function(parameter) {
   this.parameter = 'some parameter';
   this.name = 'p5.newObject';
};
````
* Inline documentation: allowed parameter types are `Boolean`, `Number`, `String`, and name of the object (see the above bullet point). Use `Array` for any types of Array parameters. If needed, explain what kind of the specific types of array parameter are allowed (e.g. `Number[]`, `String[]`) in the description section.
* Currently supported class types (have their `name` parameter): `p5.Color`, `p5.Element`, `p5.Graphics`, `p5.Renderer`, `p5.Renderer2D`, `p5.Image`, `p5.Table`, `p5.TableRow`, `p5.XML`, `p5.Vector`, `p5.Font`, `p5.Geometry`, `p5.Matrix`, `p5.RendererGL`.

#### Performance Issue with the FES

By default, FES is enabled for p5.js, and disabled in `p5.min.js` to prevent FES functions slowing down the process. The error checking system can significantly slow down your code (up to ~10x in some cases). See the [friendly error performance test](https://github.com/processing/p5.js-website/tree/main/src/assets/learn/performance/code/friendly-error-system/).

You can disable this with one line of code at the top of your sketch:

```JavaScript
p5.disableFriendlyErrors = true; // disables FES

function setup() {
  // Do setup stuff
}

function draw() {
  // Do drawing stuff
}
```

Note that this will disable the parts of the FES that cause performance slowdown (like argument checking). Friendly errors that have no performance cost (like giving an descriptive error if a file load fails, or warning you if you try to override p5.js functions in the global space), will remain in place.


## Known Limitations

* FES may still result in false negative cases. These are usually caused by the mismatch between designs of the  functions (e.g. drawing functions those are originally designed to be used interchangeably in both 2D and 3D settings) with actual usage cases. For example, drawing a 3D line with
```JavaScript
const x3; // undefined
line(0, 0, 100, 100, x3, Math.PI);
```
will escape FES, because there is an acceptable parameter pattern (`Number`, `Number`, `Number`, `Number`) in `line()`'s inline documentation for drawing in 2D setting. This also means the current version of FES doesn't check for the environmental variables such as `_renderer.isP3D`.

* FES is only able to detect global variables overwritten when declared using `const` or `var`. If `let` is used, they go undetected. This is not currently solvable due to the way `let` instantiates variables.

* The functionality described under **`fesErrorMonitor()`** currently only works on the web editor or if running on a local server. For more details see [this](https://github.com/processing/p5.js/pull/4730).

* The extracting variable/function names feature of FES's `sketch_reader` is not perfect and some cases might go undetected (for eg: when all the code is written in a single line).

## Thoughts for the Future
* re-introduce color coding for the Web Editor.

* More unit testings.

* More intuitive and narrowed down output messages.

* All the colors are checked for being color blind friendly.

* Identify more common error types and generalize with FES (e.g. `bezierVertex()`, `quadraticVertex()` - required object not initiated; checking Number parameters positive for `nf()` `nfc()` `nfp()` `nfs()`)

* Extend Global Error catching. This means catching errors that the browser is throwing to the console and matching them with friendly messages. `fesErrorMonitor()` does this for a select few kinds of errors but help in supporting more is welcome :)

* Improve `sketch_reader.js`'s code reading and variable/function name extracting functionality (which extracts names of the function and variables declared by the user in their code). For example currently `sketch_reader.js` is not able to extract variable/function names properly if all the code is written in a single line.

* `sketch_reader.js` can be extended and new features (for example: Alerting the user when they have declared a variable in the `draw()` function) can be added to it to better aid the user.
```JavaScript
// this snippet wraps window.console methods with a new function to modify their functionality
// it is not currently implemented, but could be to give nicer formatted error messages
const original = window.console;
const original_functions  = {
    log: original.log,
    warn:  original.warn,
    error: original.error
}
["log", "warn", "error"].forEach(function(func){
    window.console[func] = function(msg) {
      //do something with the msg caught by the wrapper function, then call the original function
      original_functions[func].apply(original, arguments)
    };
});
```
