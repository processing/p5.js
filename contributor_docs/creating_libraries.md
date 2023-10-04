A p5.js library can be any JavaScript code that extends or adds to the p5.js core functionality. There are two categories of library. Core libraries (p5.Sound) are part of the p5.js distribution, while contributed libraries are developed, owned, and maintained by members of the p5.js community.

If you have created a library and would like to have it included on the [p5js.org/libraries](https://p5js.org/libraries) page, submit [this form](https://docs.google.com/forms/d/e/1FAIpQLSdWWb95cfvosaIFI7msA7XC5zOEVsNruaA5klN1jH95ESJVcw/viewform).

# Creating a new library

There are a lot of different ways to write and use JavaScript, so we leave this up to you. What follows are some notes about having your library work well with p5.js.

## Code

### You can extend p5 core functionality by adding methods to p5.prototype.
For example, the following code in dom.js extends p5 to add a `createImg()` method that adds an [HTMLImageElement](https://developer.Mozilla.org/en-US/docs/Web/API/HTMLImageElement) to the DOM. 

  ```js
  p5.prototype.createImg = function (src) {
    const elt = document.createElement('img');
    //const elt = new Image; // much shorter alt. to the 1 above.

    elt.src = src;
    return addElement(elt, this);
  };
  ```
  When the DOM library is included in a project, `createImg()` can be called just like `createCanvas()` or `background()`.

### Use private functions for internal helpers.
Functions not intended to be called by users. In the example above `addElement()` is an internal function in [dom.js](https://GitHub.com/processing/p5.js/blob/main/src/dom/dom.js). It isn't publicly bound to `p5.prototype` though.

### You can extend p5.js classes as well, by adding methods to their prototypes.
In the example below, `p5.Element.prototype` is extended with the `html()` method, that sets the inner html of the element.
  ```js
  p5.Element.prototype.html = function (html) {
    this.elt.innerHTML = html;
    //this.elt.textContent = html; // much safer alt. to innerHTML.
  };
  ```
  
### Use registerPreloadMethod() to register names of methods with p5 that may be called in preload().

Typically, with some asynchronous functions (like loading a sound, image, or other external file), there are both synchronous and asynchronous options offered. For example, `loadStrings(path, [callback])` accepts an optional second callback argument - a function that is called after the loadStrings function completes. However, a user may also call loadStrings in `preload()` without a callback, and the p5.js will wait until everything in `preload()` completes before moving on to `setup()`. If you would like to register a method of your own call `registerPreloadMethod()` with the name of the method to register, and pass the prototype object the method belongs to ~~(defaults to p5.prototype)~~. The example below shows a line in the "soundfile.js" (p5.sound library) that registers `loadSound()`.

  ```js
  p5.prototype.registerPreloadMethod('loadSound', p5.prototype);
  ```

### Example of async function for _callback_ and **preload()**.
```js
// Example of async function for use in preload() or with callback.
p5.prototype.getData = function (callback) {

  // Create an object which will clone data from async function and return it.
  // We will need to update that object below, not overwrite/reassign it.
  // It is crucial for the preload() to keep the original pointer/reference.
  // Declaring variables with const assures they won't be reassigned by mistake.
  const ret = {};

  // Some async function you are working with.
  loadDataFromSpace(function (data) {

    // Loop through the properties in data.
    for (let prop in data) {
      // Set the ret's properties to be the data's properties (cloning).
      // That is, update empty ret object with properties from received data.
      // You CANNOT overwrite/reassign ret with another object though.
      // Rather its content needs to be updated with the data.
      ret[prop] = data[prop];
    }
    // Check whether callback is indeed a function.
    if (typeof callback == 'function') {
      callback(data); // do the callback.
    }
  });
  // Return the object which has been filled with the data above.
  return ret;
};
```

### Use **registerMethod()** and **unregisterMethod()** to register and unregister functions with _**p5**_ that should be called at various times.

  ```js
  p5.prototype.doRemoveStuff = function () { 
    // library cleanup stuff
  };
  p5.prototype.registerMethod('remove', p5.prototype.doRemoveStuff);

  // Unregister the method when it's no longer needed.
  p5.prototype.unregisterMethod('remove', p5.prototype.doRemoveStuff);
  ```

Method names you can register and unregister include the following list. Note that you may need to define the function before you register it.

  * **pre** — Called at the beginning of `draw()`. It can affect drawing.
  * **post** — Called at the end of `draw()`.
  * **remove** — Called when `remove()` is called.
  * **init** — Called when the sketch is first initialized, just before the sketch initialization function (the one that was passed into the `p5` constructor) is executed. This is also called before any global mode setup, so your library can add anything to the sketch and it will automatically be copied to `window` if global mode is active.
  * **beforePreload** — Called before the `preload()` function is executed.
  * **afterPreload** — Called after the `preload()` function is executed.
  * **beforeSetup** — Called before the `setup()` function is executed.
  * **afterSetup** — Called after the `setup()` function is executed.

More to come shortly, lining up roughly with this list:
https://GitHub.com/processing/processing/wiki/Library-Basics#library-methods


### You can also create your own classes.
Your library may not extend p5 or p5 classes at all, but instead just offer extra classes that can be instantiated and used in conjunction with the library. Or it may do some mix of both.

## Naming
* **Don't overwrite p5 functions or properties.** When you are extending p5.prototype, be careful not to use the names of existing properties or functions. You can use [hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) to test names. For example, the following line placed at the top of your library file will print true because the `rect()` method exists:

  ```js
  console.log(p5.prototype.hasOwnProperty('rect'));
  ```

* **Similarly, don't overwrite p5 class functions or properties.** If you are extending p5.Image, p5.Vector, p5.Element, etc, follow the same protocol as above.

* **p5.js has two modes, global mode and instance mode.** In global mode, all p5 properties and methods are bound to the window object, allowing users to call methods like `background()` without having to prefix it with anything. However, this means you need to be careful not to overwrite native JavaScript functionality. You can test existing JS names by typing them into console or with a quick google search.

* **Classes are typically capitalized, and methods and properties begin with lowercase.** Classes in p5 are prefixed with p5. We would like to keep this namespace for p5 core classes only, so when you create your own, **do not include the p5. prefix for class names**. You are welcome to create your own prefix, or just give them non-prefixed names.

* **p5.js library filenames are also prefixed with p5, but the next word is lowercase**, to distinguish them from classes. For example, p5.sound.js. You are encouraged to follow this format for naming your file.


## Packaging
* **Create a single JS file that contains your library.** This makes it easy for users to link it into their projects. You might also think about having options for both the normal JS file and a [minified](http://jscompress.com/) version for faster loading.

* **Contributed libraries are hosted, documented, and maintained by their creators.** This could be on GitHub, on a separate website, or somewhere else.

* **Documentation is key!** The documentation for your library should be in some place easy to find for users that download and use your library. The documentation for contributed libraries will not be included in the main p5.js reference, but you may want to follow a similar format. See these examples of a [library overview page](http://p5js.org/reference/#/libraries/p5.sound), [class overview page](http://p5js.org/reference/#/p5.Vector), and [method page](http://p5js.org/reference/#/p5/arc).

* **Examples are great, too!** They show people what your library can do. Because this is all JavaScript, people can see them running online before they download anything. [jsfiddle](http://jsfiddle.net/) and [codepen](http://codepen.io) are two great easy options for hosting examples.

* **Let us know!** Once your library is ready for distribution, send an email to [hello@p5js.org](mailto:hello@p5js.org) with a link and some info. We'll include it on the [libraries page](http://p5js.org/libraries/)!
