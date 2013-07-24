Processing-JS
=============

####See wiki for Getting Started and Research Documentation in process. <https://github.com/lmccart/js-processing/wiki>

####Examples
+ [Basic drawing API example](http://htmlpreview.github.io/?https://github.com/lmccart/processing-js/blob/master/experiments/testlib_alpha/index.html)
+ [DOM extension API example -- refresh if images don't immediately show up for now](http://htmlpreview.github.io/?https://github.com/lmccart/processing-js/blob/master/experiments/testlib/index2.html]


####Goal
Spec out and test a JavaScript library that would enable Processing-like syntax for drawing using Canvas and WebGL. It's both about the syntax and how to code.


Bring "Processing" ideas to JavaScript, rather than to emulate Processing/Java through JavaScript. Explore how to take positive parts of what Processing does, and see what the affordances of JS add/remove to the equation.


Involves both "language design" and "ide design".


Idea of Processing syntax-wise was to take some of the nastiness out of writing Java code (having to define classes, threaded animation loops, etc) before you could make things show up on screen. Starting from scratch with JavaScript as the base language would ideally 1) use the nice bits of JS, and 2) hide the uglier bits.


Current work on the Processing JS port is focused on being able to be code compatible and having things run right out of the box (which is great!), but comes at the cost of keeping some of Java's quirks, while potentially hiding the nicer parts of JS. (Strictly speaking, you can still do JS inside of that mode, but it's not necessarily the intent or the current setup.)

