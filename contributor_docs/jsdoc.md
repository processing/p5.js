# JSDoc Best Practices

Documentation on the website is built from the comments in the p5.js repo. Here are a few things to keep in mind in order for the documentation to be parsed correctly!

## For everything

- At the top of a file, add a comment with the `@module` tag, and optionally also the `@submodule`. These reference the category and subcategory names that the contents of the file should appear under in the reference:

  e.g. for just a category:
  ```js
  /**
   * @module Rendering
   */
  ```

  e.g. for both:
  ```js
  /**
   * @module Data
   * @submodule LocalStorage
   */
  ```

## For classes


- Create classes *outside* of the addon function, and assign them to `p5` *inside.* The class name should be the same always:

  ```js
  class MyClass {
    // ...
  }

  export default function myAddon(p5, fn) {
     p5.MyClass = MyClass;
  }
  ```

- Document class methods directly above the members in classes, *without* a `@method` tag:

  ```js
  class MyClass {
    /**
     * Description goes here
     */
    myMethod() {
      return 4;
    }
  }
  ```

- Documentation for the class itself should go at the spot where the class is added to `p5` and not right next to the class definition. This needs to include the `@class` tag, including a `p5.` prefix on the class name. Also include the parameters for the constructor in this description, if they exist.

  ```js
  class MyClass {
    constructor(n) {
      this.n = n;
    }
  }

  export default function myAddon(p5, fn) {
    /**
     * Description of the class goes here!
     *
     * @class p5.MyClass
     * @param {Number} n A number to pass in
     */
     p5.MyClass = MyClass;
  }
  ```

- Documentation for class properties should appear after the class is added to `p5`, not within the class itself. It needs to have the `@for` tag referencing its class, and the `@property` tag naming the property itself:

  ```js
  class MyClass {
    myProperty;
    constructor() {
      myProperty = 2;
    }
  }

  export default function myAddon(p5, fn) {
    /**
     * Description of the class goes here!
     *
     * @class p5.MyClass
     */
     p5.MyClass = MyClass;

     /**
      * Description of the property goes here!
      *
      * @property {Number} myProperty
      * @for p5.MyClass
      */
  }
  ```

## For global functions

- Add a comment with the `@method` tag listing its name:

  ```js
  export default function myAddon(p5, fn) {
    /**
     * Description goes here!
     *
     * @method myFunction
     */
    p5.myFunction = function() {
      return 8;
    };
  }
  ```

- For dynamically generated methods, do the same as usual, but add `@for p5`.

  ```js
  function myAddon(p5, fn) {
    for (const key of ['nameA', 'nameB']) {
      fn[key] = function() {
        return `Hello from ${key}!`;
      };
    }

    /**
     * @method nameA
     * @for p5
     */

    /**
     * @method nameB
     * @for p5
     */
  }
  ```

- Mark things that you don't want showing up as `@private`. This is done automatically for methods whose names start with `_`.

  ```js
  class MyClass {
    /**
     * @private
     */
    privateMethodA() {
      // ...
    }

    _privateMethodB() {
      // ...
    }
  }
  ```
