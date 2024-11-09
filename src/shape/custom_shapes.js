/**
 * @module Shape
 * @submodule Custom Shapes
 * @for p5
 * @requires core
 * @requires constants
 */

// declare MyClass

function customShapes(p5, fn) {
    
    // ---- FUNCTIONS ----
    
    // documentation here

    // fn.myFunction = function() {
    //     this.background('yellow'); // call an existing p5 function
    // }; 

    // ---- CLASSES ----

    // documentation here

    // p5.MyClass = MyClass;
}

export default customShapes;

if (typeof p5 !== 'undefined') {
    customShapes(p5, p5.prototype);
}