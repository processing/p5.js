![](http://p5js.org/img/p5js-beta.svg)


[Hello!](http://hello.p5js.org/) p5.js is a JavaScript library that starts with the original goal of Processing, to make coding accessible for artists, designers, educators, and beginners, and reinterprets this for today's web.

Using the original metaphor of a software sketchbook, p5.js has a full set of drawing functionality. However, you're not limited to your drawing canvas, you can think of your whole browser page as your sketch! For this, p5.js has addon libraries that make it easy to interact with other HTML5 objects, including text, input, video, webcam, and sound.

p5.js is a new interpretation, not an emulation or port, and it is in active development. An official editing environment is coming soon, as well as many more features!

**If you already know the basics of JS or Processing, the [p5.js overview](https://github.com/lmccart/p5.js/wiki/p5.js-overview) wiki page is a good place to start. Otherwise, see below for more learning links.**

##p5.js library

You can [download here](http://p5js.org/download) or use `lib/p5.js` for the less stable, newest version.

##Documentation

####[> Get Started](http://p5js.org/get-started)
Create and run your first sketch!
####[> p5.js overview](https://github.com/lmccart/p5.js/wiki/p5.js-overview)
An overview of the main features and functionality of p5.js.
####[> Reference](http://p5js.org/reference)
The functionality supported by p5.js.
####[> Learn](http://p5js.org/learn)
Tutorials and short, prototypical examples exploring the basics of programming with p5.js.
####[> Libraries](http://p5js.org/libraries)
Extend p5 functionality to interact with other HTML elements, manipulate sound, and more!
####[> Contribute](http://p5js.org/contribute)
Get involved in the p5.js project.
####[> Research Documentation](https://github.com/lmccart/p5.js/wiki/Research-Documentation)
This project developed out of a Fellowship with the Processing Foundation exploring the future of Processing with JavaScript. Documentation of research in process and references is here.



##Development

See the [contribute section](http://p5js.org/contribute) to get started and check out the [development](https://github.com/lmccart/p5.js/wiki/Development) wiki page for details.


##Questions

###How is this different than Processing.js?

The main goal of Processing.js is to execute Processing files in HTML5, but not necessarily to write native HTML5. It supports a mixed syntax of Processing and JavaScript, where the JavaScript is not really meant to be consumed by the end-user. Processing.js is a port of Processing to JS, using regex to convert Java into JS. It is a good tool for those that want to run simple sketches on the web, however, it is quite opaque. It can be difficult for someone to understand how it works, how to fix things when it doesn't work, or how to modify or extend the library. As Processing.js says on their website, "it's not magic, but almost."

In contrast, with p5 we are reimagining Processing's original goals in native JavaScript, in a way that is intended to be transparent and intuitive. It is easy to translate a sketch from Processing to p5 and the process of doing so begins to teach people the basics of JS. From there, they are able to begin writing native JS using a syntax that feels familiar but appropriate for the context. We are closely studying the decisions Processing has made, but also always questioning to see if there are design decisions that would make the library cleaner, stronger, and more intuitive. 

Additionally, p5.js extends beyond canvas drawing to allow people to create, access and manipulate other HTML elements. Through this framework beginners begin to explore and understand HTML, JavaScript, and CSS, and the way they work together in the browser. p5.js will also have a system for people to contribute addon modules to deal with things like audio, video, various input devices, and data. There is also an option to use p5 globally or instantiated within a namespace, so it can be compatible with other JS libraries. 

Most importantly, this project is in active development, with enthusiastic support and contributions from around the world. We have begun working with various schools and institutions to teach workshops and classes, in hopes of integrating it into curricula as a tool for understanding the web.

We are also putting a lot of energy into making the documentation clear, for developers as well as users. We'd like this to be a project that anyone feels welcome and empowered to be a part of, whether that's contributing documentation, writing code, teaching with it, or using it to create.
