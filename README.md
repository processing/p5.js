p5.js
=====

####We have begun work on a new JS client-side library for creating graphic and interactive experiences, based on the core principles of [Processing](http://processing.org). IT IS CURRENTLY IN DEVELOPMENT and a more stable release will be ready for use and contributions this summer. You can follow along with the progress here until then.


##p5.js library (stable)
`lib/p5.js` is currently the only stable file in the repository


##Documentation

####[> Getting Started](https://github.com/lmccart/p5.js/wiki/Getting-Started)
Create and run your first sketch!
####[> Reference](https://github.com/lmccart/p5.js/wiki/Reference)
The functionality supported by p5.js.
####[> Learning](https://github.com/lmccart/p5.js/wiki/Learning)
Tutorials and short, prototypical examples exploring the basics of programming with p5.js.
####[> Troubleshooting](https://github.com/lmccart/p5.js/wiki/Troubleshooting)
Help with common problems. Coming soon.
####[> Research Documentation](https://github.com/lmccart/p5.js/wiki/Research-Documentation)
This project developed out of a Fellowship with the Processing Foundation exploring the future of Processing with JavaScript. Documentation of research in process and references is here.



##Overview

Development of p5.js starts with the original goal of Processing, to make coding accessible for artists, designers, educators, beginners, and reinterpets this for today, for the web. The library is intended to introduce creative coding, introduce web development, and provide a tie between the two. It it important that while this is accessible for beginners, it’s not a sandbox environment and people develop real web development literacy, and the ability to extend and learn new things on their own.

The web dev space is inundated with web libraries, but a lot of them are very powerful and specific, more like a swiss army knife than a platform, and often not very accessible to beginners. In contrast, p5.js aims to be accessible and broad, allowing people to get started quickly, providing scaffolding to start creating visual and interactive compositions using JavaScript immediately. It then also opens hooks to extend into areas of specific interest, interfacing with existing libraries and tools. The library is not domain specific, it’s useful for general creative coding from drawing, to working with text, images, DOM, etc. 

p5.js is about bringing Processing ideas and community to the JavaScript and the web, rather than emulating Processing/Java through JavaScript. We hope to build a strong support community of users for constructive help, with a focus on teaching and learning.

We have been focusing on language design, development, and documentation, but a p5.js web IDE is also in the plan.


##Development
See the [Development](https://github.com/lmccart/p5.js/wiki/Development) wiki page for details.


##Questions

###How is this different than Processing.js?

The main goal of Processing.js is to execute Processing files in HTML5, but not necessarily to write native HTML5. It supports a mixed syntax of Processing and JavaScript, where the JavaScript is not really meant to be consumed by the end-user. Processing.js is a port of Processing to JS, using regex to convert Java into JS. It is a good tool for those that want to run simple sketches on the web, however, it is quite opaque. It can be difficult for someone to understand how it works, how to fix things when it doesn't work, or how to modify or extend the library. As Processing.js says on their website, "it's not magic, but almost."

In contrast, with p5 we are reimagining Processing's original goals in native JavaScript, in a way that is intended to be transparent and intuitive. It is easy to translate a sketch from Processing to p5 and the process of doing so begins to teach people the basics of JS. From there, they are able to begin writing native JS using a syntax that feels familiar but appropriate for the context. We are closely studying the decisions Processing has made, but also always questioning to see if there are design decisions that would make the library cleaner, stronger, and more intuitive. 

Additionally, p5.js extends beyond canvas drawing to allow people to create, access and manipulate other HTML elements. Through this framework beginners begin to explore and understand HTML, JavaScript, and CSS, and the way they work together in the browser. p5.js will also have a system for people to contribute addon modules to deal with things like audio, video, various input devices, and data. There is also an option to use p5 globally or instantiated within a namespace, so it can be compatible with other JS libraries. 

Most importantly, this project is in active development, with enthusiastic support and contributions from around the world. We have begun working with various schools and institutions to teach workshops and classes, in hopes of integrating it into curricula as a tool for understanding the web.

We are also putting a lot of energy into making the documentation clear, for developers as well as users. We'd like this to be a project that anyone feels welcome and empowered to be a part of, whether that's contributing documentation, writing code, teaching with it, or using it to create.
