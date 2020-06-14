
# Improve p5.js unit tests
### by Urvashi Verma ([@ihsavru](https://github.com/ihsavru))

## Overview
This project focused on improving the unit tests for different modules of p5.js. I spent my summer writing unit tests for different modules. I also worked on integrating the code coverage reports with Codecov through Travis CI. 

## Contributions during GSoC'19
I divided the timeline into smaller periods of a week or two to handle unit tests for each module. Following is a list of PRs submitted:
#### Core
- https://github.com/processing/p5.js/pull/3772
- https://github.com/processing/p5.js/pull/3865

#### Events
- https://github.com/processing/p5.js/pull/3824
- https://github.com/processing/p5.js/pull/3814
- https://github.com/processing/p5.js/pull/3810
- https://github.com/processing/p5.js/pull/3809

#### Image
- https://github.com/processing/p5.js/pull/3828
- https://github.com/processing/p5.js/pull/3829
- https://github.com/processing/p5.js/pull/3838

#### Typography
- https://github.com/processing/p5.js/pull/3839
- https://github.com/processing/p5.js/pull/3844

#### Utilities
- https://github.com/processing/p5.js/pull/3864

#### WebGL
- https://github.com/processing/p5.js/pull/3896
- https://github.com/processing/p5.js/pull/3902

## Code Coverage
As of writing this report, the code coverage has been increased to 62.52% (along with an increase of total lines of code) from 50.41%. A summary is given below:
Before summer of code:
```
=============================== Coverage summary ===============================  
Statements   : 50.41% ( 4598/9122 )  
Branches     : 36.51% ( 1375/3766 )  
Functions    : 56.49% ( 509/901 )  
Lines        : 50.95% ( 4541/8912 )  
================================================================================
```
After summer of code:
```
=============================== Coverage summary ===============================  
Statements   : 62.04% ( 6579/10604 )  
Branches     : 49.86% ( 2252/4517 )  
Functions    : 66.82% ( 707/1058 )  
Lines        : 62.53% ( 6444/10306 )  
================================================================================
```
You can find more detailed coverage reports for p5.js on [Codecov](https://codecov.io/gh/processing/p5.js)

### Documentation
I have documented about how to approach writing a unit test in the [developer docs for unit testing](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md) which was created by my mentor [Evelyn](https://github.com/outofambit).

## Acknowledgements
I am glad to be able to spend my summer contributing to p5.js. I would like to thank my mentor [Evelyn Masso](https://github.com/outofambit), for her support throughout the summer and for making sure that I had enough opportunities to grow during the project. I would also like to thank other members of the Processing Foundation for this opportunity and their help in making this project successful.
