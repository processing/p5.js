DOM Extensions
==========

See below for functions, vars, and methods for interacting with the DOM beyond drawing in the graphics canvas. Also see the [beyond the canvas](https://github.com/lmccart/p5.js/wiki/DOM-Extensions) tutorial for more details and examples.

###DOM manipulation & access
+ var AUTO // used for autoscaling either width or height of image with size() call

####Create 
+ createHTML(html) // creates a DIV and injects the given HTML inside
+ createHTMLImage(src) // creates an <img> object with given src
+ createGraphics(w, h) // creates a <canvas> object with given width and height

####Access
+ find(id) // returns array of elements whose id match given id or empty array if none found
+ find(class) // returns array of elements whose class match given class or empty array if none found

####Set context
+ context(id) // sets object with given id to current drawing context element
+ context(obj) // sets given object to current drawing context element


####PElement

+ id(id) // sets the id of the element
+ class(class) // sets the class of the element
+ size(w, h) // sets the size of the element
+ position(x, y) // sets the position of the element
+ style(style) // sets inline css of the element
+ html(html) // sets the HTML contents of the element
+ show() // shows the element
+ hide() // hides the element

// Input
+ mousePressed(function) // binds the function to a mouse press event on the element
+ mouseOver(function) // binds the function to a mouse over event on the element
+ mouseOut(function) // binds the function to a mouse out even on the element



