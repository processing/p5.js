# Extending the p5.js Friendly Error System

#### By Akshay Padte ([@akshay-99](https://github.com/akshay-99))

### Overview
Over the course of this summer, I worked on extending the Friendly Error System of p5.js with the help of my mentor Stalgia Grigg. The Friendly Error System, or FES for short, is a component of p5.js designed to help new programmers with common errors as they get started with learning. It detects common errors and mistakes and provides helpful messages to help the user resolve these.

The major goals of this project were:
1.  Improving the efficiency (speed and size) of the entire system.
2.  Fixing bugs with the existing FES
3.  Extending internationalization to cover the entire FES
4.  Adding functionality to detect errors spelling and capitalization.
5.  Adding functionality to capture and simplify global errors

### Before GSoC
I had been a p5 user for more than a year and had come to love it and rely on it a lot for several personal projects. I started contributing to p5 in around February this year, picking up issues and helping resolve them. In this brief period, I got to learn a lot about the inner workings of p5, how it initializes, how it builds, how the tests run, how different components work together, etc.

### Work
#### Part 1: Addressing known problems with the FES

I kicked off the summer by addressing the issue of speed and size. The FES has a component called `validateParameters()`, responsible for checking if the arguments passed by the user are correct. It does this by matching the arguments against a file auto-generated from the inline docs. Earlier, this file was imported directly into the main library for the FES to use, but it also has a lot of information that is not needed by the FES which increases size unnecessarily. Pre-processing this file to keep only what was needed helped reduce the size of the final built p5.js library by around 25%.
![](https://akshay-fes-gsoc.surge.sh/image1.png)

Another issue was speed. validateParameters does a lot extra work before the actual function is executed. Sometimes, as seen in [this](https://github.com/processing/p5.js-website/tree/main/src/assets/learn/performance/code/friendly-error-system/) performance test, it would slow down a function by up to 10 times. My initial assumption to speed it up did not work so I played around in chrome dev tools to figure out what was actually happening. I learnt that most of the time was spent just trying to figure out the nearest matching overload intended by the user, and that this entire process happened over and over again if the function was called multiple times with the same arguments. I addressed this with a trie like data structure <sup>[[1]](https://github.com/processing/p5.js/blob/8226395d40a9df0113b13e42c983ae578b3856fa/src/core/error_helpers.js#L300)</sup>, where each node represents an argument. Thus if a function is called again with the same sequence of arguments, we don't need to run the entirety of validateParameters. This not only improved the speed but also prevented the FES from flooding the console on repetitive calls of the same function.

There was another issue which caused validateParameters to ignore the last undefined argument passed to function. This sometimes used to cause confusing and inaccurate messages. Fixing this was pretty easy and only involved one line of change.

Moving on. There was an issue that if one p5 function called another p5 function, validateParameters would run both times. For example, the function saveJSON() needs to call saveStrings() to do part of its work. It forwards the arguments it receives to saveStrings(). This meant that if arguments were wrong when calling saveJSON(), we used to get two messages: one for saveJSON() and one for saveStrings(). But the user never called the latter in their code! This could lead to confusion.
![](https://akshay-fes-gsoc.surge.sh/image2.png)
To fix this, one can take a look at the stack trace. We need to answer "was the most recent p5 function invoked from another p5 function?" If so, we don't need to display a message even if the arguments are wrong. I used another library [stacktrace.js](https://www.stacktracejs.com/), to help with this. Analyzing stack traces was extensively employed later-on in the project as well. We'll come back to it later.

As a next step, internationationalization support was added for validateParameters messages and the language of some of the messages was simplified <sup>[[2]](https://github.com/processing/p5.js/pull/4629)</sup>. There were a couple of other small problems that were also fixed in this phase. You can see them in the full list of pull requests.

PRs in this phase: [#4561](https://github.com/processing/p5.js/pull/4561), [#4580](https://github.com/processing/p5.js/pull/4580), [#4590](https://github.com/processing/p5.js/pull/4590), [#4606](https://github.com/processing/p5.js/pull/4606), [#4613](https://github.com/processing/p5.js/pull/4613), [#4629](https://github.com/processing/p5.js/pull/4629)  

#### Phase 2: New functionality!

I had ideas for two new features to make the FES more powerful.
The first was to add a spell-check kind of system to the FES. Beginners often need time to understand the various naming conventions commonly used in programming, such as camelCase for identifiers, CAPS for constants, etc. And so, capitalization and spelling mistakes are very common, such as writing `createcanvas()` instead of `createCanvas()`, `colour()` instead of `color()`, etc. These kinds of mistakes are relatively easier to resolve, as the browser would display an error pointing to the function call. But if someone misspells a p5 entry point function (which has to be defined by the user), such as by defining `preload()` as `preLoad()` (I learnt that this is a very common mistake), p5 wouldn't detect it and the sketch would fail silently. It may take a lot of time to debug this simple mistake. 

Case-insensitive Levenshtein distance, calculated by the Wagner-Fischer algorithm was used to automatically detect these mistakes in user-code. The check would run on two instances:

1.  Whenever a reference error is thrown (happens when a predefined function is called with a wrong spelling or capitalization)
2.  When p5 is initialized, to detect mistakes in naming any entry-point functions (setup, draw, preload, etc.)

Here are a few example messages from this feature :

![](https://akshay-fes-gsoc.surge.sh/image3.png)

The second new feature was Global Error Catching. This meant analyzing the errors thrown by the browser and trying to match them up with helpful explanations was to solve them.

The first step was to come up with a way to detect and classify errors. Detection was easily possible with the help of an error listener. To classify the errors, using a regex match against a prebuilt lookup table was settled upon. The idea was based on the fact that web browsers use template error strings to generate error messages. This means that for a given browser, all error messages of a particular kind would have a consistent structure (This is pretty obvious I guess but I wanted to be sure. So I went through the source code of Chromium to confirm this 🙂). We can have our own template strings with placeholders <sup>[[3]](https://github.com/processing/p5.js/blob/b52226962eebf9f58f70eed68c4ce32661677d23/src/core/friendly_errors/browser_errors.js)</sup> which are then replaced with regex matching sequences ( like ([a-zA-Z0-9_]+) ), and then the result is matched against the error message to detect what kind of error this is. The regex sequence also helps to extract relevant details. For example, take a look at this sketch:
```js
function setup() {
  let a = 5;
}
function draw() {
  let b = a + 5;
}
```
It shows a very basic mistake with scope that a beginner can make. The error shown is:
![](https://akshay-fes-gsoc.surge.sh/image4.png)
While the browser error message aims at being concise, the FES message aims to explain the error as much as possible and also provides links which have examples to fix this kind of error. This is more helpful to those who have just started learning to program and have not yet gotten used to deciphering error messages.

Another distinction to be made was between errors in user-space and errors that happened inside the library. These could be differentiated by seeing their stack trace. Moreover, it's possible to simplify the stack trace itself to only include user-defined functions.

Here's an example of an error that happens in library space:

![](https://akshay-fes-gsoc.surge.sh/image5.png)

The FES filters out all the internal details from the stack trace, making it easier to understand.

PRs in this phase: [#4643](https://github.com/processing/p5.js/pull/4643), [#4670](https://github.com/processing/p5.js/pull/4670)

#### Phase 3

Sticking with the original proposal would have meant that this stage would involve adding even more features. However, over the course of the project, I realised that those were not really a priority for p5 at the moment and that their implementation would take longer than what was previously expected. I discussed this with my mentor and we agreed to change the plan a bit. In this stage, I worked on detaching translation files from the library and hosting them online on a CDN, and on more thorough testing and documentation.

p5 uses a separate translation file for each language, and though presently only the English one is fully complete, it has grown a lot in size over the course of the summer (and is likely to grow more in the future). As more and more languages are added, bundling all of them into the library may have been imprudent. It was discussed that these could be separately hosted on a CDN and p5 would then fetch the required file whenever needed. The build process was modified to remove the translation files from the final library. These files were then hosted on CDNJS and jsDelivr.

The internationalization code was modified to fetch translations from the internet, with the English file still built into the library as default and backup.

During testing, I came across an issue that global error catching did not run when running locally without a local server. I came up with a fix but it involved calling all user code through an extra layer of wrapper function. We discussed this and it was finally agreed that the benefit of fixing the issue was not significant enough to offset the negative effect on code readability this would have.

The final week of GSoC involved documenting all the changes that were made as part of this project.

PRs in this phase: [#4701](https://github.com/processing/p5.js/pull/4701), [#4709](https://github.com/processing/p5.js/pull/4709), [#4726](https://github.com/processing/p5.js/pull/4726), [#4730](https://github.com/processing/p5.js/pull/4730) _(closed)_, [#4746](https://github.com/processing/p5.js/pull/4746)

### Work Pull Requests and Issues

- All of the pull requests made as part of the project can be found here:  
https://github.com/processing/p5.js/pulls?q=is%3Apr+author%3Aakshay-99+created%3A%3E2020-05-04+

- All of the issues opened as part of this project can be found here:  
https://github.com/processing/p5.js/issues?q=is%3Aissue+author%3Aakshay-99+created%3A%3E2020-05-04+

### Conclusion

I really enjoyed working on this project. I learned a lot of new things. I would like to thank my mentor Stalgia Grigg for all the guidance and feedback throughout the project. I would also like to thank the entire Processing community on Github for helping me with ideas, suggestions, views, etc.

### References

1.  https://github.com/processing/p5.js/blob/8226395d40a9df0113b13e42c983ae578b3856fa/src/core/error_helpers.js#L300
2.  https://github.com/processing/p5.js/pull/4629
3.  https://github.com/processing/p5.js/blob/b52226962eebf9f58f70eed68c4ce32661677d23/src/core/friendly_errors/browser_errors.js