<p align="center">
  <img src="https://github.com/satyasaibhushan/gsoc-21-wrapup/blob/master/assets/gsoc.png" alt="gsoc logo" width="300" style="margin-left:50%;transform:translateX(-50%);"/>
</p>

<p>

# Project Overview
  This project aimed at - 

  Improving Test Coverage of p5.js sound library which includes 
    
  * correcting the current tests
  * Writing new tests
  * Improving the testing architecture and implementing headless-tesing to the library
  * Adding documentation to the library regarding testing.
  
</p>

## 1. Improving Current tests
 At the beginning of the project, some of the tests written in the library seem to be broken(like 20 %). Some of these are due to the problems in code which went by unnoticed as testing is not frequently performed to the library. Some of these are due to the tests for which most of them were solved by using `setTimeout function`.   
  
[Week-1 's PR](https://github.com/processing/p5.js-sound/pull/626)  
At the end of week-1, I've fixed all the failing tests except one. Which I came back to in week-2.
I've fixed some bugs in week-2 that caused that one test to fail and also corrected an example related to that issue.  
  
[Week-2 issue](https://github.com/processing/p5.js-sound/issues/627)  
[Week-2 PR](https://github.com/processing/p5.js-sound/pull/628)  

## 2. Writing new tests 
  Most of my time during this period is spent on writing new tests to the library and improving it's testing range.  
In weeks-3,4 I've added tests to the files which are not yet covered(16 files). At this week, I've decided on the style/suite design of the library's tests, which I followed for the rest of the project's period with some minor changes  

[Week-3,4 PR](https://github.com/processing/p5.js-sound/pull/632)   
At this point, all the files of the library were covered.  

In weeks-6,7 I've added tests to files which are already coverd(15 files). This is a larger work than week-3,4's as some of the files were massive and needed like 1000 lines of code to test the entire file. During these weeks(3-7), I also fixed some bugs which I came across this period. Later I raised a PR regarding these bugs.  

[Week-6-7 PR](https://github.com/processing/p5.js-sound/pull/636)  
[Bug fixing PR](https://github.com/processing/p5.js-sound/pull/639)  

## 3.Headless testing
  I spent the last 3 weeks or so on implementing headless testing. During this period, I did some minor changes in testing architecture.  
I also implemented headless testing of mocha by using puppeteer, which is inspired by p5.js's testing.  
### Problems faced:
* I took some time figuring out the testing of mic in headless mode and figured out that it can be solved by mocking the microphone to use the buffer from a sound file
* I also fumbled upon the problem that some user interaction is required to start some audio nodes and later figured out that it can be solved by adding a flag while initialising puppeteer.
* After implementing the headless testing using puppeteer, I figured out that testing in that way is not consistent for this library. Some audio nodes are not being properly initialised and the tests were failing. So, I've implemented Karma to solve this problem.
* As the tests in karma were also not consistent, I used karma-webpack to bundle the test files, which seemed more consistent.
* As I found out even then some tests were failing, I implemented mocha's retry functionality to some test cases.  


At the start of the project, I thought of implementing the headless testing and using it in github automations, but did not do it as even after implementing all these, some tests were failing in karma-js. Not always, but very rarely. As we cannot take risks on github automations, I refrained from implementing it.  

Also, at the time of writing this document, the last PR is not yet merged. But will hopefully merged whithin a couple of days.  
[Week-8,9,10 PR](https://github.com/processing/p5.js-sound/pull/641)
 
## 4.Documenting
  During the last week of my project, I used my time to merge the work done and write a wiki page about the current testing architecture and on how to write tests, focused on beginners. The wiki can be found in library's wiki page.


# Future of p5.js-sound's testing  
I've done almost every thing I thought of doing at the beginning of the project. But, there were some things that can be improved/implemented in the future: 
* We should figure out a way to visualise to the coverage of test files.
* Some failing tests need to be corrected and the github automations needs to be implemented.
* If any file/functionality is added in the future, tests for those should be added.
* After the coverage is implemented, we should write test cases for files which are poorly covered.

# Acknowledgements:
During this period of 10 weeks, I've done a lot of work and learnt a lot in my way.  
As you can see below, the before and after images, I've implemented more than 300 test cases and increased the test coverage 5 folds.

### before :
<p align="center">
  <img src="https://github.com/satyasaibhushan/gsoc-21-wrapup/blob/master/assets/before.png" alt="a picture showing the result of running testcases before the project" width="300" style="margin-left:50%;transform:translateX(-50%);"/>
</p>   

### after : 
<p align="center">
  <img src="https://github.com/satyasaibhushan/gsoc-21-wrapup/blob/master/assets/after.png" alt="a picture showing the result of running testcases after the project" width="300" style="margin-left:50%;transform:translateX(-50%);"/>
</p>




I am extremely grateful to the community and Gsoc. I sincerely appreciate my mentor [Guillermo](https://github.com/guillemontecinos) for his constant support and motivation provided throughout the period. I had a great time!!
