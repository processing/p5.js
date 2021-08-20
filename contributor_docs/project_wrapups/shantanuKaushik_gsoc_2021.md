  # Adding to p5.js Friendly Error System

#### By Shantanu Kaushik ([@Aloneduckling](https://github.com/Aloneduckling)) | GSoC 2021

### Overview
Throughout this summer, I worked on p5.js's Friendly Error System (FES in short) under the mentorship of Thales Grilo and Luis Morales-Navarro. The FES is a p5.js feature
which supports beginners when encountering common errors, checking for common mistakes and providing simple and easy to understand error messages.
This project aimed to further improve FES by further building on an existing feature and adding new features.

The major goals of this project were:
1.  Additions to FES's `fesErrorMonitor`.
2.  Allowing FES to detect redeclaration of p5.js reserved variables and functions


### Work
#### Phase 1: Adding to FES's `fesErrorMonitor`

`fesErrorMonitor` functionality of FES shows the error given by the browsers and its details in a simple form. This feature was introduced to FES in GSoC 2020 by Akshay Padte.

FES's `fesErrorMonitor` has a list of errors that it detects. That list could be extended by adding more errors that a user can encounter.

My work was to extend this list and enable `fesErrorMonitor` to detect more commonly seen errors and show them in a simplified form.

The list of errors that were added:

![image](https://user-images.githubusercontent.com/54030684/129186690-1f8739ef-3748-455d-96f6-c7488f141346.png)

While working on this phase I had a lot of back and forth interaction with my mentors to ensure that the error messages are to the point and easy to understand by the user.

All the code and error messages can be viewed here: [GSoC'21: adding to FES phase 1 #5305](https://github.com/processing/p5.js/pull/5305)

#### Phase 2: New feature `sketch_reader.js`

In this phase, I added a new feature to the FES to detect the redeclaration of p5.js's reserved variables and functions.

If a user by mistake redefines a p5.js reserved constant/function then it can cause problems and create confusion. For Example:

```js
//user redefines p5.js's "text" function 
let text = function(){
  console.log('hello world');
}
//if the user intends to user p5.js text function somewhere in their code then it won't work
```
The new feature `sketch_reader.js` tackles this problem.

`sketch_reader.js` does the following:

(I) Checks if any p5.js constant or function is declared by the user outside the `setup` and `draw` function and reports it.

(II) In `setup` and `draw` function it performs:
 1. Extraction of the code written by the user
 2. Conversion of the code to an array of lines of code
 3. Catching variable and function declaration
 4. Checking if the declared function/variable is a reserved p5.js constant or function and report it.

While working on this feature I learned a lot of new things about p5.js and the working of the FES. 
This feature was a necessary addition as it resolves a common problem which the new p5.js users might encounter.

All the work in this phase can be viewed here: [Detecting redeclaration of p5.js reserved constants and functions #5351](https://github.com/processing/p5.js/pull/5351)

### Conclusion and Acknowledgements

I enjoyed working on this project and learned a lot of things this summer. 

I would like to thank my mentors **Thales Grilo** and **Luis Morales-Navarro** for their invaluable help and guidance throughout this summer of code. I would like to thank the **Processing Foundation** for creating such an awesome library. I would also like to thank **Google the GSoC team** for giving student developers like me a chance to work on awesome projects and make our summer productive. 

## PRs made

### Phase 1
[GSoC'21: adding to FES phase 1 #5305](https://github.com/processing/p5.js/pull/5305)
### Phase 2
[Detecting redeclaration of p5.js reserved constants and functions #5351](https://github.com/processing/p5.js/pull/5351)
