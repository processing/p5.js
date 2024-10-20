<!-- Extend p5.js functionalities with your own addon library. -->

# Creating an Addon Library

A p5.js addon library is JavaScript code that extends or adds to the p5.js core functionality. While p5.js itself already provides a wide range of functionality, it doesn’t aim to cover everything you can do with JavaScript and the Web API. Addon libraries let you extend p5.js without needing to incorporate the features into p5.js. This guide will take you through the steps of creating an addon library that loads a simple CSV file by implementing a `loadCSV()` function.

Here are some examples of why you may want to create an addon library:

- Provide a simplified interface to another library
  - [p5.ble.js](https://github.com/ITPNYU/p5.ble.js)
  - [p5.serialserver](https://github.com/p5-serial/p5.serialserver)
- Implement specialized algorithms or functionalities
  - [p5.pattern](https://github.com/SYM380/p5.pattern)
  - [p5.mapper](https://github.com/jdeboi/p5.mapper)
- Test out new Web API features that are not widely available in different browsers yet
  - [p5.webserial](https://github.com/gohai/p5.webserial/)
  - [p5.joystick](https://github.com/Vamoss/p5.joystick)
- Test alternative or new implementations of existing p5.js functionalities
  - [número](https://github.com/nickmcintyre/numero)
  - [p5.cmyk.js](https://github.com/jtnimoy/p5.cmyk.js)


## Prerequisites

- p5.js foundation
- Prototype-based object orientation in Javascript


## Step 1

First, let’s create a blank JavaScript file for the addon library. We’ll call this file p5.loadcsv.js.

The main way to extend p5.js is by adding methods to the p5.prototype object. For example, the following code extends p5 to add a `loadCSV()` method to the p5.prototype object:

```js
p5.prototype.loadCSV = function(){
  console.log('I will load a CSV file soon!');
};
```

When someone includes your p5.loadcsv.js file in a project, they can call `loadCSV()` as a global function just like `createCanvas()` or `background()`.

You can also extend p5.js classes such as` p5.Element` or` p5.Graphics` by adding methods to their prototypes. In the example below, `p5.Element.prototype` is extended with the `shout()` method. It adds an exclamation mark to the end of the element’s inner HTML.

```js
p5.Element.prototype.shout = function () {
  this.elt.innerHTML += '<span>!</span>';
};
```


## Step 2

You now have a p5.loadcsv.js file with one method attached to the `p5.prototype` object. This method,` loadCSV()`, doesn’t do much currently; it just logs a message to the console. Run the following code in a new sketch that loads both p5.js and p5.loadcsv.js in the` <head>` tag.

```js
function setup() {
  createCanvas(400, 400);
  loadCSV();
}
```

```html
<html>
  <head>
    <!-- Other tags -->

    <script src="./p5.js"></script>
    <script src="./p5.loadcsv.js"></script>

    <!-- Other tags -->
  </head>

  <!-- Other tags -->

</html>
```

Running the sketch should print a single message in the console saying “I will load a CSV file soon!”.


## Step 3

To load a CSV file with your `loadCSV()` function, the function needs to accept an argument. This can be defined in the same way as any other function parameter.

```js
p5.prototype.loadCSV = function (filename) {
  console.log(`I will load the CSV file ${filename} soon!`);
};
```



In our test sketch, we can use it like so:

```js
function setup() {
  createCanvas(400, 400);

  // Prints "I will load the CSV file data.csv soon!" to the console.
  loadCSV('data.csv');
}
```


## Step 4

You can access p5.js functions and variables such as `circle()` and `PI` in your addon code using the “`this`” object. We’ll use the `hour()` and `minute()` functions to further customize the `loadCSV()` function’s console message. This will give us some information about when the function is called.

<details>
<summary>You should always use the “<code>function()</code>” keyword to attach methods to the <code>p5.prototype</code> object.</summary> Don’t use the arrow function syntax “<code>() =></code>” because the value of “<code>this</code>” when using the “<code>function()</code>” keyword is the created object (i.e., the p5 sketch), but with the arrow function syntax, the value of “<code>this</code>” is whatever the value of “<code>this</code>” is when the arrow function is defined. In the example below, “<code>this</code>” will refer to “<code>window</code>” instead of the p5 sketch, which is usually not what we want.
</details>

```js
p5.prototype.loadCSV = (filename) => {
  // this === window is true because
  // "this" refers to the window object.
  // This is almost never what you want.
  console.log(this === window);
};


p5.prototype.loadCSV = function (filename) {
  // Prints 'I will load the CSV file data.csv at 10:30'
  // to the console.
  console.log(`I will load the CSV file ${filename} at ${this.hour()}:${this.minute()}!`);
};
```


## Step 5

So far, we have looked at several handy features for creating an addon library. If you just need to implement an algorithm, perform some drawings, or use other p5 functions in your addon, the previous steps should be enough for you to get started. You can explore more functionality a p5.js addon has access to by looking at the p5.js source code (every p5.js module is also written in the same way as a p5.js addon function!) or the “Looking inside p5.js” guide for more details on how p5.js work under the hood and how your addon library can utilize more advanced features.

However, we have not made our `loadCSV()` function load any CSV file yet! To be able to load files, we need the function to be asynchronous, much like how p5.js’s own loading functions work (e.g., `loadJSON()`, `loadStrings()`, etc.).

First make the following changes to your `loadCSV()` method:

```js
p5.prototype.loadCSV = function(filename){
  console.log(`I will load the CSV file ${filename} at ${this.hour()}:${this.minute()}!`);

  let result = [];

  fetch(filename)
    .then((res) => res.text())
    .then((data) => {
      data.split('\n').forEach((line) => {
        result.push(line.split(','));
      });
    });

  return result;
};
```

The method now creates an empty array in the variable “`result`”, load in the CSV file specified in the filename with the Fetch API, parse the CSV file in a simplified way (split each line into rows, then each row into words) and return the variable “`result`” at the end.

Now, when you run the sketch, pass a file path to a simple CSV file to your `loadCSV()` function and log the output:

```js
function setup(){
  createCanvas(400, 400);
  let myCSV = loadCSV('data.csv');
  print(myCSV);
}
```

You will notice that it is logging an empty array instead of an array containing data you have in your CSV file. This is because of the same reason why we need to load in data such as with `loadJSON()` or `loadStrings()` in the `preload()` function; the asynchronous nature of JavaScript makes it so that the “result” variable is returned from the `loadCSV()` function before the `fetch()` function can finish fetching the CSV file so we only get an empty array as it is first defined.

Simply moving where you call `loadCSV()` to `preload()` in this case is not enough to solve this problem.

```js
let myCSV;

function preload(){
  myCSV = loadCSV('data.csv');
}

function setup(){
  createCanvas(400, 400);
  print(myCSV); // Still prints []
}
```

p5 will need to be told that the addon’s `loadCSV()` function is something it should wait for in the `preload()` function for this to work. To do that, we use the “`registerPreloadMethod()`” in the `p5.prototype` object.

```js
p5.prototype.loadCSV = function (filename){
  console.log(`I will load the CSV file ${filename} at ${this.hour()}:${this.minute()}!`);

  let result = [];

  fetch(filename)
    .then((res) => res.text())
    .then((data) => {
      data.split('\n').forEach((line) => {
        result.push(line.split(','));
      });

      this._decrementPreload();
    });

  return result;
};

p5.prototype.registerPreloadMethod('loadCSV', p5.prototype);
```

Note two things from the code above:

1. We call the `p5.prototype.registerPreloadMethod()` function passing in the name of the `loadCSV()` function as a string as the first parameter and `p5.prototype` as the second parameter.
2. At the end of `fetch()`, after the CSV data has been parsed and pushed into the result array, `this._decrementPreload()` function is called.
3) Now, if you test your sketch again, you should see that the “`myCSV`” variable is populated with the data from the CSV file!
4. Note that due to inherent limitations of this technique, the returned “`result`” variable must be an object (array is also a type of object in Javascript) and must not be overwritten in the function body. You can set properties of the object (or push to the array), but you cannot reassign the variable (i.e., you cannot do “``result = data.split(`\n`)``”).

<details>
<summary>Quite a bit of magic is happening here: firstly, why does “<code>result</code>” now contain the additional data when <code>fetch()</code>code> should still have been asynchronous and thus running after “<code>result</code>” has returned?</summary>

This is related to why the return type must be an object. In Javascript, objects are passed by reference while most other types such as strings and numbers are passed by value. What this means is that when an object is returned from a function, it points to the original object that was created (in this case, the empty array we create in the line “`let result = [];`”.) In contrast, pass by value types, when returning from a function, will be copied and lose their relation to the original reference. This behavior allows us to modify the properties of the returned objects after they have been returned from the function as long as we don’t reassign the variable, which will create a new reference separate from the original object.
</details>

<details>
<summary>Secondly, what is <code>registerPreloadMethod()</code> doing and what about <code>this._decrementPreload()</code>?</summary>

Without going into all the details, `registerPreloadMethod()` adds the function we specified into an internal list of functions that p5 keeps track of whenever it is called in `preload()`. When p5 detects such a function is called, it will add 1 to an internal counter. If this internal counter is larger than 0, it will keep waiting in `preload()` and defer running `setup()` and starting the `draw()` loop. Loading functions can decrement that internal counter by calling `this._decrementPreload()`, effectively signaling to p5 that a loading function in `preload()` is complete. If the internal counter reaches 0 after the decrement, it means all loadings are complete and the whole sketch can start.
</details>

## Step 6

Your `loadCSV()` function should now work as expected and you can add additional features such as callback function support, additional methods attached to `p5.prototypes`, or anything else you can think of.

There is one more major feature that is available for addon libraries and these are action hooks. Action hooks are functions that will be run at certain points in the p5 object’s lifetime. For example, if you want your addon library to run some code just before p5 runs the `setup()` function or if your addon library needs to do some clean up after a sketch is removed using the `remove()` function, hooks are what will enable your addon library to do so.

The available hooks, in order of execution, are:

- `init` — Called when the sketch is first initialized, just before the sketch initialization function (the one that was passed into the `p5` constructor) is executed. This is also called before any global mode setup, so your library can add anything to the sketch and it will automatically be assigned to the `window` object if global mode is active.
- `beforePreload` — Called before the `preload()` function is executed.
- `afterPreload` — Called after the `preload()` function is executed.
- `beforeSetup` — Called before the `setup()` function is executed.
- `afterSetup` — Called after the `setup()` function is executed.
- `pre` — Called at the beginning of `draw()`. Called repeatedly the same as `draw()`.
- `post` — Called at the end of `draw()`. Called repeatedly the same as `draw()`.
- `remove` — Called when `remove()` is called.

To create an action hook, you can use the snippet below.

```js
p5.prototype.doRemoveStuff = function (){
  // Addon library related cleanup
};
p5.prototype.registerMethod("remove", p5.prototype.doRemoveStuff);

p5.prototype.setDefaultBackground = function(){
  // Set background to be p5 pink by default
  this.background("#ed225d");
};
p5.prototype.registerMethod("pre", p5.prototype.setDefaultBackground);
```

You can also unregister the hook when it is no longer needed.

```js
p5.prototype.unregisterMethod('remove', p5.prototype.doRemoveStuff);
```


## Next steps

Below are some extra tips about authoring your addon library.

**Must an addon library extend** `p5.prototype` **or the prototype object of p5.\* classes?**

Your addon library may not extend p5 or p5 classes at all, but instead just offer extra classes, functions, or constants that can be instantiated and used with p5, or it may do some mix of both: offering extra classes but with convenience methods attached to the `p5.prototype` object for example.

**Naming conventions**

**Don't overwrite p5 functions or properties.** When extending a `p5.prototype` or prototype object of p5 classes, be careful not to use the names of existing properties or functions unless you intend to replace their functionalities entirely.

**p5.js has two modes, global mode and instance mode.** In global mode, all p5 properties and methods are bound to the `window` object, allowing users to call methods like `background()` without having to prefix them with anything. However, this means you need to be careful not to overwrite native JavaScript functionality. For example “`Math`” and “`console`” are both native Javascript functionalities so you shouldn’t have methods named “`Math`” or “`console`”.

**Class names should use** `PascalCase`**, while methods and properties should use** `camelCase`**.** Classes in p5 are prefixed with p5. We would like to keep this namespace for p5 core classes only, so when you create your own namespace, **do not include the** `p5.` **prefix for class names**. You are welcomed to create your own prefix, or just give them non-prefixed names.

```js
// Do not do this
p5.prototype.p5.MyClass = class {
};

// Do this
p5.prototype.myAddon.MyClass = class {
};

// Or this
p5.prototype.myMethod = function(){
};
```

**p5.js library filenames are also prefixed with p5, but the next word is lowercase** to distinguish them from classes. For example, p5.sound.js. You are encouraged to follow this format for naming your file.

**Packaging**

**Create a single JS file that contains your library.** This makes it easy for users to add it to their projects. We suggest using a [bundler](https://rollupjs.org/) for your library. You may want to provide options for both the normal JavaScript file for sketching/debugging and a [minified](https://terser.org/) version for faster loading.

**Contributed libraries are hosted, documented, and maintained by their creators.** This could be on GitHub, a separate website, or elsewhere. We only feature addon libraries that are fully open source.

**Documentation is key!** The documentation for your library should be easy to find. The documentation for contributed libraries won’t be included in the main p5.js reference, but you may want to follow a similar format. See these examples of a [library overview page](https://p5js.org/reference/p5.sound), [class overview page](https://p5js.org/reference/p5/p5.Vector), and [method page](https://p5js.org/reference/p5/arc).

**Examples are great, too!** They show people what your library can do. Because this is all JavaScript, people can see them running online before they download anything.[ ](http://jsfiddle.net/) You can create a collection of examples on the p5.js web editor to showcase how your library works.

**Submit your library!** Once your library is ready for distribution and you’d like it included on the [p5js.org/libraries](https://p5js.org/libraries) page, please submit a pull request on the p5.js website GitHub repository following [this intruction](https://github.com/processing/p5.js-website/blob/main/docs/contributing_libraries.md)!