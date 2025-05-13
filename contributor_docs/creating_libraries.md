<!-- Extend p5.js functionalities with your own addon library. -->

# Creating an Addon Library

A p5.js addon library is JavaScript code that extends or adds to the p5.js core functionality. While p5.js itself already provides a wide range of functionality, it doesn’t aim to cover everything you can do with JavaScript and the Web API. Addon libraries let you extend p5.js without needing to incorporate the features into p5.js. Learning how to write an addon library is also a great way to learn how the internals of p5.js works and how it is implemented: all the features of p5.js are implemented in the same way!

This guide will take you through the steps of creating an addon library that loads a simple CSV file by implementing a `loadCSV()` function.

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

The main way to extend p5.js is to pass an addon function to the static `p5.registerAddon()` function. An addon function is any function that takes three arguments which are usually named `p5`, `fn`, and `lifecycles` respectively. To start writing our addon, put the following code into p5.loadcsv.js.

```js
function loadCSVAddon(p5, fn, lifecycles){

}
```

Before we implement our `loadCSV()` function, let's have a look at what the three function arguments are starting with the first two and we will introduce the third later in this article.

* `p5` - This is the `p5` object/constructor. You will use this to access any static `p5` object member or define any static `p5` object member. For example to access `p5.Vector` or `p5.Renderer`.
* `fn` - This is an alias to `p5.prototype`. For any variable or functions that you wish for p5.js to expose to the `window` in global mode or to the `p5` instance in instance mode, it must be assigned as a member of `fn`. We will look into the usage of `fn` below in more detail as it is likely one of the most used feature of the addon API.

Now let's add a `loadCSV()` function to our addon, we do this by defining an object member named `loadCSV` within `fn`:

```js
function loadCSVAddon(p5, fn, lifecycles){
  fn.loadCSV = function(){
    console.log('I will load a CSV file soon!');
  }
}
```

This `loadCSVAddon()` function that we have just defined in our file is the main addon function that we will pass to the `p5.registerAddon()` static function, let's do this now, add the following to the bottom of the p5.loadcsv.js file under the `loadCSVAddon()` function:

```js
p5.registerAddon(loadCSVAddon);
```

When someone includes your p5.loadcsv.js file in a project as a script tag, they can now call `loadCSV()` as a global function just like `createCanvas()` or `background()`.

You can also extend p5.js classes such as` p5.Element` or` p5.Graphics` by adding methods to their prototypes. In the example below, `p5.Element.prototype` is extended with the `shout()` method. It adds an exclamation mark to the end of the element’s inner HTML.

```js
function loadCSVAddon(p5, fn, lifecycles){
  p5.Element.prototype.shout = function () {
    this.elt.innerHTML += '<span>!</span>';
  };
}
```


## Step 2

You now have a p5.loadcsv.js file with one new function created for p5.js. This method,` loadCSV()`, doesn’t do much currently; it just logs a message to the console. Run the following code in a new sketch that loads both p5.js and p5.loadcsv.js in the` <head>` tag.

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
function loadCSVAddon(p5, fn, lifecycles){
  fn.loadCSV = function (filename) {
    console.log(`I will load the CSV file ${filename} soon!`);
  };
}
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
<summary>You should always use the “<code>function()</code>” keyword to attach methods to the <code>fn</code> argument object.</summary> Don’t use the arrow function syntax “<code>() =></code>” because the value of “<code>this</code>” when using the “<code>function()</code>” keyword is the created object (i.e., the p5 sketch), but with the arrow function syntax, the value of “<code>this</code>” is whatever the value of “<code>this</code>” is when the arrow function is defined. In the example below, “<code>this</code>” will refer to “<code>window</code>” instead of the p5 sketch, which is usually not what we want.
</details>

```js
function loadCSVAddon(p5, fn, lifecycles){
  fn.loadCSV = (filename) => {
    // this === window is true because
    // "this" refers to the window object.
    // This is almost never what you want.
    console.log(this === window);
  };
}
```
```js
function loadCSVAddon(p5, fn, lifecycles){
  fn.loadCSV = function (filename) {
    // Prints 'I will load the CSV file data.csv at 10:30'
    // to the console.
    console.log(`I will load the CSV file ${filename} at ${this.hour()}:${this.minute()}!`);
  };
}
```


## Step 5

So far, we have looked at several handy features for creating an addon library. If you just need to implement an algorithm, perform some drawings, or use other p5 functions in your addon, the previous steps should be enough for you to get started. You can explore more functionality a p5.js addon has access to by looking at the p5.js source code (every p5.js module is also written in the same way as a p5.js addon function!) or the “Looking inside p5.js” guide for more details on how p5.js work under the hood and how your addon library can utilize more advanced features.

However, we have not made our `loadCSV()` function load any CSV file yet! To be able to load files, we need the function to be asynchronous, much like how p5.js’s own loading functions work (e.g., `loadJSON()`, `loadStrings()`, etc.).

First make the following changes to your `loadCSV()` method:

```js
function loadCSVAddon(p5, fn, lifecycles){
  fn.loadCSV = async function(filename){
    console.log(`I will load the CSV file ${filename} at ${this.hour()}:${this.minute()}!`);

    let res = await fetch(filename);
    let data = await res.text();
    return data.split('\n').map((line) => {
      return line.split(',');
    });
  };
}
```

Note that we have added an `async` keyword before `function(filename)` to mark that this is an asynchronous function. You can read more about asynchronicity in Javascript [here](https://dev.to/limzykenneth/asynchronous-p5js-20-458f).

The function now uses the Fetch API to fetch a CSV file according to the filename provided by the user, parse the CSV file in a simplified way (split each line into rows, then each row into words), and return the parsed data.

Now, when you run the sketch, pass a file path to a simple CSV file to your `loadCSV()` function and log the output:

```js
function setup(){
  createCanvas(400, 400);
  let myCSV = loadCSV('data.csv');
  print(myCSV);
}
```

You will notice that it is logging something called a Promise instead of the array you containing data you have in your CSV file. This is because of the same reason why we need to use an `async function setup()` with `loadJSON()` or `loadStrings()`, we need to `await` our asynchronous function in an `async` setup function:

```js
async function setup(){
  createCanvas(400, 400);
  let myCSV = await loadCSV('data.csv');
  print(myCSV);
}
```


## Step 6

Your `loadCSV()` function should now work as expected and you can add additional features such as callback function support, additional methods attached to `fn`, or anything else you can think of.

There is one more major feature that is available for addon libraries and these are lifecycle hooks. Lifecycle hooks are functions that will be run at certain points in the p5 object’s lifetime. For example, if you want your addon library to run some code just before p5 runs the `setup()` function or if your addon library needs to do some clean up after a sketch is removed using the `remove()` function, hooks are what will enable your addon library to do so.

The available hooks, in order of execution, are:

- `presetup` — Called before the `setup()` function is executed.
- `postsetup` — Called after the `setup()` function is executed.
- `predraw` — Called at the beginning of `draw()`. Called repeatedly the same as `draw()`.
- `postdraw` — Called at the end of `draw()`. Called repeatedly the same as `draw()`.
- `remove` — Called when `remove()` is called.

You may have noticed that we have not yet introduced the third parameter to our `loadCSVAddon()` which is called `lifecycles`, this is where you will define the lifecycle hooks your addon wish to use, see the snippet below.

```js
function loadCSVAddon(p5, fn, lifecycles){
  lifecycles.predraw = function(){
    // Set background to be p5 pink by default
    this.background("#ed225d");
  };

  lifecycles.remove = function(){
    // Addon library related cleanup
  }
}
```

Notice that in the lifecycle functions you have access to `this` which refers to the current `p5` instance same as you would have in the functions attached to `fn`

Here is what your p5.loadcsv.js file should look like at this point in the tutorial:

```js
function loadCSVAddon(p5, fn, lifecycles){
  fn.loadCSV = async function(filename){
    console.log(`I will load the CSV file ${filename} at ${this.hour()}:${this.minute()}!`);

    let res = await fetch(filename);
    let data = await res.text();
    return data.split('\n').map((line) => {
      return line.split(',');
    });
  };

  lifecycles.predraw = function(){
    // Set background to be p5 pink by default
    this.background("#ed225d");
  };

  lifecycles.remove = function(){
    // Addon library related cleanup
  }
}

p5.registerAddon(loadCSVAddon);
```

## Step 7
As a final step, we will add a few more changes to our addon to prepare it for distribution. There are a few options you may wish to distribute your addon:

* As a single JavaScript file which your users will include in their HTML with a `<script>` tag.
* As an ESM module that your users can use with `<script type="module">`, install from NPM, or any other ESM module usage.

Either of the above may also be passed through a build tool to be bundled into a different format. As we can see, there are many different options and below will be a recommendation which is the pattern that p5.js itself uses, you may choose another option that fits your addon.

```js
export function loadCSVAddon(p5, fn, lifecycles){
  // Addon code ...
}

if (typeof p5 !== undefined) {
  p5.registerAddon(loadCSVAddon);
}
```

In the above snippet, an additional `if` condition is added around the call to `p5.registerAddon()`. This is done to support both direct usage in ESM modules (where users can directly import your addon function then call `p5.registerAddon()` themselves) and after bundling support regular `<script>` tag usage without your users needing to call `p5.registerAddon()` directly as long as they have included the addon `<script>` tag after the `<script>` tag including p5.js itself.


## Next steps

Below are some extra tips about authoring your addon library.

**Must an addon library extend** `fn` **or the prototype object of p5.\* classes?**

Your addon library may or may not extend p5 or p5 classes at all, but instead just offer extra classes, functions, or constants that can be instantiated and used with p5, or it may do some mix of both: offering extra classes but with convenience methods attached to the `fn` object for example.

**Naming conventions**

**Do not overwrite p5 functions or properties.** When extending `fn` or prototype object of p5 classes, be careful not to use the names of existing properties or functions unless you intend to replace their functionalities entirely.

**p5.js has two modes, global mode and instance mode.** In global mode, all p5 properties and methods are bound to the `window` object, allowing users to call methods like `background()` without having to prefix them with anything. However, this means you need to be careful not to overwrite native JavaScript functionality. For example “`Math`” and “`console`” are both native Javascript functionalities so you shouldn’t have methods named “`Math`” or “`console`”.

**Class names should use** `PascalCase`**, while methods and properties should use** `camelCase`**.** Classes in p5 are prefixed with p5. We would like to keep this namespace for p5 core classes only, so when you create your own namespace, **do not include the** `p5.` **prefix for class names**. You are welcome to create your own prefix, or just give them non-prefixed names.

```js
// Do not do this
fn.p5.MyClass = class {
};

// Do this
fn.myAddon.MyClass = class {
};

// Or this
fn.myMethod = function(){
};
```

**p5.js library filenames are also prefixed with p5, but the next word is lowercase** to distinguish them from classes. For example, p5.sound.js. You are encouraged to follow this format for naming your file.

**Packaging**

**Create a single JS file that contains your library.** This makes it easy for users to add it to their projects. We suggest using a [bundler](https://rollupjs.org/) for your library. You may want to provide options for both the normal JavaScript file for sketching/debugging and a [minified](https://terser.org/) version for faster loading.

**Contributed libraries are hosted, documented, and maintained by their creators.** This could be on GitHub, a separate website, or elsewhere. We only feature addon libraries that are fully open source.

**Documentation is key!** The documentation for your library should be easy to find. The documentation for contributed libraries won’t be included in the main p5.js reference, but you may want to follow a similar format. See these examples of a [library overview page](https://p5js.org/reference/p5.sound), [class overview page](https://p5js.org/reference/p5/p5.Vector), and [method page](https://p5js.org/reference/p5/arc).

**Examples are great, too!** They show people what your library can do. Because this is all JavaScript, people can see them running online before they download anything.[ ](http://jsfiddle.net/) You can create a collection of examples on the p5.js web editor to showcase how your library works.

**Submit your library!** Once your library is ready for distribution and you’d like it included on the [p5js.org/libraries](https://p5js.org/libraries) page, please submit a pull request on the p5.js website GitHub repository following [this intruction](https://github.com/processing/p5.js-website/blob/main/docs/contributing_libraries.md)!
