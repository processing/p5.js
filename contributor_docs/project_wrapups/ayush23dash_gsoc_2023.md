# Friendly Error System(FES) and Documentation

By Ayush Shankar(@ayush23dash) || Mentored by : Alice Chung(@almchung) && Nick Briz(@nbriz)

## Overview

My initial proposal revolved around Decoupling Friendly Error System from p5.js which would have involved the following :

* Create and initialize a new npm package by following the steps here.

* Imitate already existing FES into our new package for all of the given below situations :

* The browser throws an error.

* The user code calls a function from the p5.js API.

* Other custom cases where the user would benefit from a help message.

##### All of the code for FES was to be taken from src/core/friendly_errors and i18n would have been taken care of by taking files from translations/

* Once we are done with setting up FES in our new package, we would have tried establishing successful calls from local p5.js repo to our new package's local repo.

* Once successful calls from p5.js' repo to our package would have succeeded, we would have removed all of the references of FES from p5.js' repo(only for testing purposes in a new git branch) and then we would have been good to go for the development of the new package as we would have been able to test it live on our local repo.

**However**, as the coding period progressed, me along with Alice and Nick, decided to change priorities from this path.

The progress that I made in Decoupling in the initial weeks of coding period were :

* Created a separate folder for FES(outside of P5's main repo)

* Imported all of the files one by one from FES

* `npm test` was failing by this time, so after googling a bit, adding following to package.json worked:
~~~
 "browserify": {

 "transform": [
 
 [

 "babelify",

 {

 "presets": [

 "@babel/preset-env"

 ]

 }

 ]

 ]

 }
~~~
* Corrected the import locations inside these newly created FES files

* Imported new FES files in app.js(in main p5 repo)

* `npm test` worked fine with all of the FES files except : "fes_core.js" while testing

* My further approach on Decoupling would have been creating a npm package for FES and import it directly in package.json. However, with this approach we needed to consider taking care of external imports(given below) in FES files from P5 :

~~~
import {translator} from '../internationalization'

import * as constants from '../constants'

const dataDoc = require('../../../docs/parameterData.json')

import main
~~~


**The** direction of the project now moved to Refactoring the existing codebase along with solving some existing open issues, improving documentation and adding an i18n translation for the Hindi language.

As mentioned above, my major tasks during this summer were more focussed on refactoring the existing codebase and making it more readable for the future contributors to the project.

I reviewed a few PRs, added a comment on a Decoupling Issue and worked on a few tasks as mentioned below.

* I solved an existing issue in FES, I worked on a language translation for FES which was Hindi Language, I updated the Readme and contributor guidelines for p5.js in order to make it easier for future contributors to set up and get the repository running on their local machines.

* Following is the list of issues I created/commented, Pull Requests I created(merged/open), Pull Requests I reviewed and the discussions on which I commented on :

* Created a couple of issues :
  https://github.com/processing/p5.js/issues/6181(Closed)
  https://github.com/processing/p5.js/issues/6202(Continuation to above issue)

* Reviewed translation PRs :
 https://github.com/processing/p5.js/pull/6210
 https://github.com/processing/p5.js/pull/5591

* Commented on the following GIthub Discussions/Issues :
  https://github.com/processing/p5.js/issues/5650
  https://github.com/processing/p5.js/issues/5208
  https://github.com/processing/p5.js/issues/6215
  https://github.com/processing/p5.js/issues/5629

* Created the following PRs:
  https://github.com/processing/p5.js/pull/6221(Merged)
  https://github.com/processing/p5.js/pull/6260(Merged)
  https://github.com/processing/p5.js/pull/6272(Merged)
  https://github.com/processing/p5.js/pull/6335

**One of my major topics** of research was me manually digging into each of the files and functions of FES and maintaining a list and a flow chart for keeping a check on the places/files that these FES functions are being used throughout p5.js :

## Links of FES Functions to where they are being used in p5.js

**File Name** : validate_params.js


**Function Name** : ValidationError()
**Files Used in** : test_reference.html | test.html | chai_helpers.js | describe.js | outputs.js | creating_reading.js | p5.Color.js | 2d_primitives.js | attributes.js | curves.js | environment.js | error_helpers.js | transform.js | vertex.js | downloading.js | pixels.js | files.js | saveTable.js | trigonometry.js | attributes.js | 3d_primitives.js | interaction.js | normal.js

**Function Name** : _clearValidateParamsCache()
**Files Used in** : error_helpers.js

**Function Name** : _getValidateParamsArgTree()
**Files Used in** : error_helpers.js

**Function Name** : _validateParameters()
**Files Used in** : describe.js | outputs.js | creating_reading.js | setting.js | environment.js | rendering.js | transform.js | 2d_primitives.js | attributes.js | curves.js | vertex.js | p5.TypedDict.js | dom.js | acceleration.js | keyboard.js | image.js |loading_displaying.js | p5.image.js | pixels.js | files.js | calculation.js | random.js | trigonometry.js | attributes.js | string_functions.js | 3d_primitives.js | interaction.js | light.js |loading.js | material.js | p5.Camera.js | p5.FrameBuffer.js | error_helpers.js |

---
**File Name** : stacktrace.js


**Function Name** : getErrorStackParser()
**Files Used in** : validate_params.js(FES) | fes_core.js(FES)

---
**File Name** : file_errors.js


**Function Name** : _friendlyFileLoadError()
**Files Used in** : fes_core.js(FES) | loading_displaying.js | files.js | loading.js | downloading.js | loadBytes.js | loadImage.js | loadJSON.js | loadModel.js | loadShader.js | loadStrings.js | loadTable.js | loadXML.js | saveTable.js | loadFont.js |

---
**File Name** : fes_core.js


**Function Name** : _friendlyError()
**Files Used in** : main.js | file_errors.js(FES) | sketch_reader.js(FES) | validate_params.js(FES) | vertex.js | p5.Vector.js | loading.js | p5.Matrix.js | p5.RendererGL.js | p5.Shader.js | error_helpers.js |

**Function Name** : _friendlyAutoPlayError()
**Files Used in** : dom.js

**Function Name** : checkForUserDefinedFunctions()
**Files Used in** : main.js

**Function Name** : fesErrorMonitor()
**Files Used in** : browser_errors.js | validate_params.js(FES) | error_helpers.js

**Function Name** : helpForMisusedAtTopLevelCode()
**Files Used in** : error_helpers.js

**FLOWCHART FOR THE SAME** : https://sketchboard.me/jDWn1eYNgktY

## Current State of The Project

I am currently working on a task that involves creating a Readme inside the FES  folder.

This task would help the contributors to get directly acclimatized with FES at the place where they will be going through the code of FES.

This task also includes a flowchart diagram which references the FES functions and their uses in various files throughout p5.js.

The remaining part of this task is to make the flowchart more readable at the first glance

## What's Left to Do

As of now the project is in a good state to get started with; without any initial setup issues.

The next steps would include refactoring the existing files of FES  folder so as to make it more readable for first time code contributors. As of now, the code is a bit complex to understand at first glance.

Moreover, some other areas of improvement would include improving the documentation of FES more, as we progress through the project.

Also, solving FES issues along the way is another task to be taken up by future contributors.

One long term goal of the FES project would be to decouple it, as discussed here.

## Conclusion

Overall, my GSoC experience was amazing and it helped me grow personally as well as professionally due to its nature of being open source.

I believe there were a few challenges that I faced, which involved setting up the project initially on my machine(issue here).

The next set of challenges involved navigating through the vast set of codebase and finding what I required(I believe I have solved that to some extent with my current contributions).

During this summer, I learned how p5.js open source community functions through various communication channels like Discourse and mailing lists.

One plus point of this summer was me learning about a new tool called Mermaid for generating diagrams.

Literally every doubt I had, was answered either on Github itself or on mails.

I would continue contributing to the Processing Organisation and would even love to mentor other GSoC Students in the future.

I would suggest the future contributors to be free of worries about any lack of support from the mentors and Processing in general, everything is answered well on time and is pretty well managed.