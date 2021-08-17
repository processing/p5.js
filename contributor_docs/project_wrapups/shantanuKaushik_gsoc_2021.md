  # Adding to p5.js Friendly Error System

#### By Shantanu Kaushik ([@Aloneduckling](https://github.com/Aloneduckling)) | GSoC 2021

### Overview
Throughout this summer, I worked on p5.js's Friendly Error System (FES in short) under the mentorship of Thales Grilo and Luis Morales-Navarro. The FES is a p5.js feature
which helps beginners with common errors, transforming error messages into a simple form, and checking for common mistakes. 
This project aimed to further improve FES by adding new features and adding more to an existing feature.

The major goals of this project were:
1.  Additions to FES's `fesErrorMonitor`.
2.  Allowing FES to detect redeclaration of p5.js reserved variables and functions


### Work
#### Phase 1: Adding to FES's `fesErrorMonitor`

`fesErrorMonitor` functionality of FES shows the error given by the browsers and its details in a simple form. This feature was introduced to FES in GSoC 2020 by Akshay Padte.

My work was to extend this functionality to detect more errors which the user can encounter and show them in a simplified form.

The list of errors that were added:

![image](https://user-images.githubusercontent.com/54030684/129186690-1f8739ef-3748-455d-96f6-c7488f141346.png)

Later on, me and my mentors discussed and finalized the error messages which would be displayed to the user.

All the code and error messages can be viewed here: [GSoC'21: adding to FES phase 1 #5305](https://github.com/processing/p5.js/pull/5305)

#### Phase 2: New feature `sketch_reader.js`

In this phase, I added a new feature to the FES that would allow it to detect the redeclaration of p5.js's reserved variables and functions.

`sketch_reader.js` does the following:

(I) Checks if any p5.js constant or function is declared by the user outside the `setup` and `draw` function and reports it.

(II) In `setup` and `draw` function it performs:
 1. Extraction of the code written by the user
 2. Conversion of the code to an array of lines of code
 3. Catching variable and function declaration
 4. Checking if the declared function/variable is a reserved p5.js constant or function and report it.

All the work in this phase can be viewed here: [Detecting redeclaration of p5.js reserved constants and functions #5351](https://github.com/processing/p5.js/pull/5351)

### Conclusion and Acknowledgements

I enjoyed working on this project and learned a lot of things this summer. 

I would like to thank my mentors **Thales Grilo** and **Luis Morales-Navarro** for their invaluable help and guidance throughout this summer of code. I would like to thank the **Processing Foundation** for creating such an awesome library. I would also like to thank **Google the GSoC team** for giving student developers like me a chance to work on awesome projects and make our summer productive. 

## PRs made

### Phase 1
[GSoC'21: adding to FES phase 1 #5305](https://github.com/processing/p5.js/pull/5305)
### Phase 2
[Detecting redeclaration of p5.js reserved constants and functions #5351](https://github.com/processing/p5.js/pull/5351)
