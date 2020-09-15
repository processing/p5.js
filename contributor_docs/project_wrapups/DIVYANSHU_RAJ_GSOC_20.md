

<p align="center">
  <img src="https://github.com/endurance21/GSOC-20-WrapUp/blob/master/assets/images/gsoc-heading.png"  alt  = "github - endurance21" width="300" style="margin-left:50%;transform:translateX(-50%);"/>
</p

<p>

# Project Overview
  This project aimed at - 
  * REVAMPING the current modules system from ``require.js`` to ``ESModules`` .
  
  * Writing   Audio Nodes in `ES6 classes` way rather than older `function constructor` way  .
  
  * REVAMPING Testing Architecture of the codebase  .
  
</p>

## The New Module system 
Javascript has  a struggling  history of module sytems , from ``IIFE`` to ``ESM 2015`` we have come a long  way to finally own a native module support ! [ [here is a great tutorial for the same ](https://www.youtube.com/watch?v=qJWALEoGge4&t=3s) ].
Earlier p5.js-sound library was dependent on  `require.js` for making the codebase modular , which was very cumbersome to maintain and scale , However , now we have been shifted to ESM .

Perks of having native ESM -->

 * More cleaner way to write modules ( export/import keywords instead of require()).
 * Named exports has always been great feature of ESM .
 * Modules can be loaded from a URL, which is not there in Commonjs .

[ [More on ESM Modules](https://nodejs.org/api/esm.html#esm_ecmascript_modules) ]



This is not it !,
Many browsers does not support many ES6 features such as `export/import` , ``classes``  , ``arrow functions `` .. etc , and here we needed the backward compatiblity , and BABEL (JS TRANSPILER ) is 
here to save the day  , which with help of WEBPACK ( module bundler ) ships the final code in older verion of ES ! YES you heard it right , we write code in NODE.JS env with modern JS syntax but at the end of the day we ship the code in older ES versions to ensure compatiblity in all browsers ! 



[ [More On BABEL ](https://babeljs.io/docs/en/babel-preset-env) ]

[ [More On WEBPACK ](https://webpack.js.org/concepts/ ) ]


 [ [THIS PR SUCCESSFULLY REVAMPED THE CODEBASE TO THE NEW MODULE SYSTEM ](https://github.com/processing/p5.js-sound/pull/489) ]



## ES6 class syntax 

The introduction of es6 classes into the JS world , was a great relief for developers out there , though its a syntactic sugar for ``constructor functions`` yet it abstracts out the protypal approach under the hood ,leaving a cleaner interface to the developers .

[ [More on ES6 CLASSES ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) ]

when it comes to AUDIO GRAPHS , where one node is connected to so many other nodes and inherit property from its parent nodes , a more robust and cleaner  implementation of Nodes was required and ES6 classes rocked the way  .

Following PR REVAMPED the p5.sound's   AUDIO NODES from ``funtion syntax`` to  ``ES6 classes syntax``

 [ [#502](https://github.com/processing/p5.js-sound/pull/502)
[#503](https://github.com/processing/p5.js-sound/pull/503)
[#508](https://github.com/processing/p5.js-sound/pull/508)
[#509](https://github.com/processing/p5.js-sound/pull/509)
[#514](https://github.com/processing/p5.js-sound/pull/514)
[#515](https://github.com/processing/p5.js-sound/pull/515)
[#516](https://github.com/processing/p5.js-sound/pull/516)
[#517](https://github.com/processing/p5.js-sound/pull/517)
[#518](https://github.com/processing/p5.js-sound/pull/518)
[#519](https://github.com/processing/p5.js-sound/pull/519)
[#520](https://github.com/processing/p5.js-sound/pull/520)
[#521](https://github.com/processing/p5.js-sound/pull/521)
[#522](https://github.com/processing/p5.js-sound/pull/522)
[#523](https://github.com/processing/p5.js-sound/pull/523)
[#524](https://github.com/processing/p5.js-sound/pull/524)
[#525](https://github.com/processing/p5.js-sound/pull/525)
[#526](https://github.com/processing/p5.js-sound/pull/526)
[#527](https://github.com/processing/p5.js-sound/pull/527)
[#528](https://github.com/processing/p5.js-sound/pull/528)
[#530](https://github.com/processing/p5.js-sound/pull/530)
[#531](https://github.com/processing/p5.js-sound/pull/531)
[#532](https://github.com/processing/p5.js-sound/pull/532)
[#533](https://github.com/processing/p5.js-sound/pull/533)
[#534](https://github.com/processing/p5.js-sound/pull/534)
[#535](https://github.com/processing/p5.js-sound/pull/535)
[#536](https://github.com/processing/p5.js-sound/pull/536)
[#537](https://github.com/processing/p5.js-sound/pull/537)
[#538](https://github.com/processing/p5.js-sound/pull/538)
[#539](https://github.com/processing/p5.js-sound/pull/539) ]



## New Testing architecture 
Unit automated  testings are fun and helps ship the errorless code to the end users .  Testing Frameworks like ``mocha`` , assertion library ``chai`` , stubbing helpers like ``sinon``  helped achieve the same , however we were still using ``require.js`` mdoule format and chached ``mocha.js`` , ``chai.js`` ,``sinon.js`` file that not only increased the size of the codebase but also very tidious to update them ,

With [THIS PR](https://github.com/processing/p5.js-sound/pull/541) i sucessfully revamped the module System to ESM and removed those chached file and made them downloadable using NPM , Moreover i have added following  unit tests to some of uncovered AUDIO NODES and  modules .


[ [Unit tests for p5.master](https://github.com/processing/p5.js-sound/pull/463) ] 

[ [Unit tests for helper methods](https://github.com/processing/p5.js-sound/pull/440) ]

[ [Unit test for p5.Gain](https://github.com/processing/p5.js-sound/pull/462) ]

PS - This one was more of my second gsoc proposal , however i  completed the  goals  of  1st proposal early and decided to make that happen too . 


## Off GSOC Tasks
*  [ [pre commit hooks](https://github.com/processing/p5.js-sound/pull/492)  ]
while completing my gsoc tasks , i enjoyed helping jason and kyle in  adding  pre-commit hooks in the codebase .

 
* [ [p5.js file](https://github.com/processing/p5.js-sound/pull/501) ]
Most of out unit  tests and examples  required p5.js to work with , and it was chached too into the codebase which not only was bulking the codebase but also making it hard to update , I removed the cached p5.js file and used NPM to download it  , however after download by default it was present inside the node_modules folder , which was a serious issue beacause  our ``unit tests`` and  ``examples``  used  /lib/p5.js reference to the  p5.js file , i decided to copy the p5.js file from  node_modules folder  to /lib/p5.js on project setup  using ``POSTINSTALL``  NPM SCRIPT .

Also  i loved  dicussing the issues of others related to the library and reviewing  the code was self rewarding .


# Acknowldegements
I am extremly grateful to Processing Foundation and GSOC team to let me  live my dream here .I would like to thank my amazing mentors Jason Sigal and Kyle James for their unmeasured support and motivation throughout this amazing GSOC period .
