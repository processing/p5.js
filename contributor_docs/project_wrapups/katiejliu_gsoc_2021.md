  # Adding Alt Text to the p5.js Website (GSoC 2021)
  #### By Katie Liu ([@katiejliu](https://github.com/katiejliu))
  #### Mentors: Rachel Lim and Claire Kearney-Volpe
  
  ### Overview
  For my Google Summer of Code project, I added alt text to the visual elements of the p5.js website, specfically to all of the examples. With the help of my mentors Rachel and Claire,  I was able to improve the accessibility of the p5.js website for users with visually impairment.
  
  ### Process
  To begin, I did a lot of research on best alt text practices. I read about web accessibility through sources such as articles from WebAIM and the Web Content Accessibility Guidelines from W3C. I also familiarized myself with navigating and using the built-in screen reader on my Mac. 
In determining what part of the p5.js website I would focus my project on, I explored the p5.js website and its current accessibility. I learned that alt text had already been added to all of the reference pages so I decided to focus my efforts on the examples pages. 

Then, I spent time writing all of the alt text for the images, which I would later implement. My mentors Rachel Lim and Claire Kearney-Volpe reviewed, edited, and gave me feedback for these alt text descriptions. I then added the alt text via an aria-label attached to the iframe of the image on each of the pages.

Here is an example of the aria-label for [Comments and Statements](https://p5js.org/examples/structure-comments-and-statements.html):

```js
/*
 * @name Comments and Statements
 * @arialabel Mustard yellow background
 * @description Statements are the elements that make up programs. The ";" (semi-colon) symbol is used to end statements. It is called the "statement  * terminator". Comments are used for making notes to help people better understand programs. A comment begins with two forward slashes ("//"). (ported from https://processing.org/examples/statementscomments.html)
 */
```

I ended up being able to write alt text for all of the examples. In total, I wrote and implemented 203 descriptions. This covers all of the examples pages with the exception of the 5 under the mobile section because the images do not appear in this section. 

### Next Steps
I have conducted testing on Chrome and Safari using the built-in screen reader on Macs. While the alt text works fairly well on Chrome, there are issues getting it to read out with the screen reader on Safari. Additional testing using different screen readers as well as browsers would be useful.

## Final Pull Request
[GSoC Aria labels #1064](https://github.com/processing/p5.js-website/pull/1075)

## Acknowledgements
I am so grateful towards the Processing Foundation for picking my proposal and giving me this opportunity. I am also thankful for my mentors Rachel Lim and Claire Kearney-Volpe for teaching me so much about web accessibility and for helping me with my project. I would also like to thank Qianqian Ye. Q is my professor at USC and first introduced me to creative coding and to p5.js. She also was the one who encouraged me to apply to GSoC. This is my first time contributing to the open source community and I am so grateful for such a supportive and caring environment.  

