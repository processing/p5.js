# Code Slang!

During GSoC 2019, Sharon De La Cruz and Jenna Xu worked on developing *Code Slang*, a project where slang words are presented as functions as a way to make math and functional programming more accessible to high school-age students. 

Building on an [earlier prototype by Aatish Bhatia](https://aatishb.com/experiments/compose/), one of Sharon's students, we decided that chaining slang adjectives could be a fun way to demonstrate and teach functional programming. The results of one slang function feeds into the next, creating new and unexpected results depending on the order.

To determine what slang words to use, and how they would influence the shape in the demo, we user-tested with middle-school students, asking them to draw out what slang words would look like visually, and asking them to contribute a slang word of their own:

![example1](https://xujenna.github.io/codeslang/example1.png)
![example2](https://xujenna.github.io/codeslang/example2.png)
![example3](https://xujenna.github.io/codeslang/example3.png)
![example4](https://xujenna.github.io/codeslang/example4.png)
![example5](https://xujenna.github.io/codeslang/example5.png)

Based on the students' illustrations, we [codified the slang words in an interface](https://editor.p5js.org/code_slang/embed/QQEgilJDk) inspired by Aatish's previous work.

We had created an interesting interactive, but realized that we couldn't assume knowledge of basic programming and math—skills necessary for users to create their own slang functions. So we decided to create a short tutorial to supplement the interactive.

After user testing with high school students, we landed on [the current iteration of *Code Slang*](https://xujenna.github.io/codeslang/).