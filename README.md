Processing-JS
=============

####Note that this library is experimental and in progress!!!


####[> Getting Started](https://github.com/lmccart/processing-js/wiki/Getting-Started)
Create and run your first sketch!
####[> Reference](https://github.com/lmccart/processing-js/wiki/Reference)
The functionality supported by Processing-JS.
####[> Examples](https://github.com/lmccart/processing-js/wiki/Examples)
Short, prototypical programs exploring the basics of programming with Processing-JS.
####[> Troubleshooting](https://github.com/lmccart/processing-js/wiki/Troubleshooting)
Help with common problems. Coming soon.
####[> Research Documentation](https://github.com/lmccart/processing-js/wiki/Research-Documentation)
This project developed out of a Fellowship with the Processing Foundation exploring the future of Processing with JavaScript. Documentation of research in process and references is here.


###Demo
+ [Basic drawing API example](http://htmlpreview.github.io/?https://github.com/lmccart/processing-js/blob/master/experiments/testlib_alpha/index.html)
+ [Basic drawing code](https://github.com/lmccart/processing-js/blob/master/experiments/testlib_alpha/sketch.js)
+ [DOM extension API example](http://htmlpreview.github.io/?https://github.com/lmccart/processing-js/blob/master/experiments/testlib/index2.html) -- refresh if images don't immediately show up for now
+ [DOM extension code](https://github.com/lmccart/processing-js/blob/master/experiments/testlib/sketch2.js)

###Goal
Spec out and test a JavaScript library that would enable Processing-like syntax for drawing using Canvas and WebGL. It's both about the syntax and how to code.


Bring "Processing" ideas to JavaScript, rather than to emulate Processing/Java through JavaScript. Explore how to take positive parts of what Processing does, and see what the affordances of JS add/remove to the equation.


Involves both "language design" and "ide design".


Idea of Processing syntax-wise was to take some of the nastiness out of writing Java code (having to define classes, threaded animation loops, etc) before you could make things show up on screen. Starting from scratch with JavaScript as the base language would ideally 1) use the nice bits of JS, and 2) hide the uglier bits.


Current work on the Processing JS port is focused on being able to be code compatible and having things run right out of the box (which is great!), but comes at the cost of keeping some of Java's quirks, while potentially hiding the nicer parts of JS. (Strictly speaking, you can still do JS inside of that mode, but it's not necessarily the intent or the current setup.)

