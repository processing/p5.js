
# Addon Library Development - [p5.teach.js](https://github.com/two-ticks/p5.teach.js/)

| **Project** | [Addon Library Development - p5.teach.js](https://summerofcode.withgoogle.com/projects/#4613016500305920) | 
| :--- | :--- |
| **Student** | Aditya Siddheshwar |
| **Github** | [@two-ticks](https://github.com/two-ticks)  |
| **Organisation**  | [Processing Foundation](https://processingfoundation.org/)  |
| **Mentors** | [Nick McIntyre](https://github.com/nickmcintyre), [Jithin KS](https://github.com/JithinKS97) |
| **Repo**| https://github.com/two-ticks/p5.teach.js/ |
| **Merged Code** | https://github.com/two-ticks/p5.teach.js/tree/GSoC'21 |


## Overview
During the Google Summer of Code '21, I worked on p5.teach, under the mentorship of **Jithin KS** and **Nick McIntyre**. The goal of this project was to build an addon library for teaching maths through animations and simulations. It will provide users friendly API for creating text, TeX, and shape animations.   
The major goals of this project were:
1.  Development of animation methods and controls
2.  Support for TeX 

## Tasks Completed
* Created TeX elements with help of tex-to-svg library (using MathJax)
* Created TeX and text animations using MathJax and anime.js by manipulating p5.js DOM elements and SVG elements
* Wrote play function for animations like write, waveIn, waveOut, fadeIn, fadeOut, createFill, etc. for TeX and text
* Added controls like play, pause, and restart buttons for timeline
* Wrote test cases using Jest
* Included style, add, play, remove, update, fill, stroke, strokeWeight, position, and size methods for MObjects
* Included SVG plotting methods and animations
* Developed demo sketches and posted on Instagram, Processing Forum, and Twitter

## TODO 
- [ ] Write unit-tests 
- [ ] Refactor animations
- [ ] Export animations

## Challenges
* TDD is important and is one of the most preferred best practices; however, it was quite challenging to develop test cases considering the lack of documentation involving Jest with p5.js and keep progressing under GSoC time constraints.
* Adding animations to TeX with help of SVGs required a lot of effort and research.  I learned a lot about SVGs and TypeScript from articles and tutorials while solving this problem. 
* GObjects (Geometry Objects) required a lot of digging and discussion to figure out API and apply configurations to the plots. 

## PRs 
* https://github.com/two-ticks/p5.teach.js/pull/13
* https://github.com/two-ticks/p5.teach.js/pull/6
* https://github.com/two-ticks/p5.teach.js/pull/20

## Contribution & Next Steps
p5.teach is having text, TeX, and Shapes, I will refactor and fix bugs in animation. Before hosting it on the cloud, I will coordinate with mentors to ensure the library meets the coding standards and includes sufficient documentation. I will further improve the library by adding new features and adding more to the existing features.

## Conclusion and Acknowledgements
I really had a lot of fun working on this project and learned a lot of things this summer working with my mentors and Processing Community.  
I would like to thank my mentors **Jithin KS** and **Nick McIntyre** for their invaluable help and guidance throughout this summer of code. Their love for teaching, code, and STEM inspired me to do more work on the library. Nick pushed me in the right direction for API, and Jithin always emphasized best practices and standards. I am extremely grateful to the Processing community for having me in the team (family). 

## Useful Links
* [API Reference](https://github.com/two-ticks/p5.teach.js/blob/GSoC'21/api_reference.md)
* [Animating maths in p5.js](https://discourse.processing.org/t/animating-maths-in-p5-js/31583)
* [Discussion and Review of Proposal - Addon Library Development - p5-teach.js](https://discourse.processing.org/t/discussion-and-review-of-proposal-addon-library-development-p5-teach-js/29065)
