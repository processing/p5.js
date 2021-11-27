# p5.js accessibility and canvas descriptions
GSoC 2020 | [Luis Morales-Navarro](https://luismn.com/)

### Overview:
During this Google Summer of Code, I worked with [Kate Hollenbach](https://github.com/kjhollen)
to improve the accessibility features of p5.js. We focused on merging the
text output and table output functionalities of [p5.accessibility](https://github.com/processing/p5.accessibility)
into p5.js and created functions that support p5.js users in writing their own screen reader accessible canvas descriptions.

### Background:
#### p5.js and Accessibility: from an editor feature to an add-on to the library
The work done during this summer is part of the project's [efforts to make p5.js more accessible for persons with dissabilities](https://contributors-zine.p5js.org/#reflection-claire-kearney-volpe).
Early work by Claire Kearney-Volpe, Taeyoon Choi, and Atul Varma identified the need to make p5.js sketches
and the canvas accessible to screen readers and people who are blind. I met Claire in late 2016 when
they were working with Mathura Govindarajan to add accessibility features to the p5.js editor. I joined them
and together with the support of dedicated contributors and advisors (including Cassie Tarajakan, Lauren McCarthy,
Josh Mielle, Sina Bahram, and Chancey Fleet) we implemented three accessible canvas outputs (a text output, a grid
output and a sound output) on the alpha editor.

Later on, through a 2018 Processing Foundation Fellowship Claire, Mathura and I developed p5.accessibility.js a p5.js add-on. 
p5.accessibility.js (developed with contributions from Antonio Guimaraes, Elizabeth G Betts, Mithru Vigneshwara, and Yossi Spira)
helped us bring the work we had done with accessible outputs in the editor to any p5.js sketch that included the add-on.
However, the add-on was still an add-on that required users to include an extra file and edit their html.

At the 2019 p5.js Contributors Conference, as a community, we reinforced the project's commitment to access and inclussion.
Together with Claire, Sina, Lauren, Kate, Olivia McKayla Ross and Evelyn Masso we outlined the pathway forward.
Among short-term actions, we identified the need for functions that allow users to write their own descriptions
and the importance of merging the add-on into the p5.js library.

### Contributions:
During the course of Summer of Code, my work focused on creating library generated screen reader accessible outputs
for basic shapes on the canvas and functions to support user-generated screen reader accessible descriptions of canvas content.
I worked on the following PRs:
- [Add describe() and describeElement() #4654](https://github.com/processing/p5.js/pull/4654): This PR adds the functions describe() and describeElement(), tests for these functions, documentation and examples.
- [Merge Accessibility Add-On into p5.js #4703](https://github.com/processing/p5.js/pull/4703): This PR adds the functions textOutput() and gridOutput(), helper functions to create and update, the outputs and tests, documentation and examples. At first the plan was to update the add-on and prepare it for merging it with p5.js in the near future. However, we realized it was more time effective to recreate the functionality of the text output and grid output in p5.js than upgrading the add-on which relied on ["monkey patching," entities and interceptors](https://medium.com/processing-foundation/making-p5-js-accessible-e2ce366e05a0). Now, the outputs are fully integrated to the library.

More information on how these accessibility features work is available in the [web accessibility contributor docs](https://github.com/processing/p5.js/blob/main/contributor_docs/web_accessibility.md).

### Future
- There is a lot of work that can be done to improve the accessibility of p5.js sketches. In the [Web accessibility next steps conversation #4721 Issue](https://github.com/processing/p5.js/issues/4721) we have outlined some ideas and questions.
- The work done during the summer focused on code and code issues but it is important to iteratively test these features with members of the community, particularly novices and learners who are blind. It is also important to create more resources for learning and teaching that support accessibility.
- Immediate next steps include:
  - A tutorial on how to describe things on the canvas.
  - Changes in the way screen-reader descriptions are created in the reference. Using the describe() function instead of relying on @alt
  - Maybe adding describe() to the templates on the website and editor
  - Upgrading the tutorial on using p5 with a screen reader
  - Changing the way the accessibility settings work on the editor

### Acknowledgements
I am grateful to Kate Hollenbach for their guidance, feedback and assistance, to Lauren McCarthy for their feedback and to Claire Kearney-Volpe for helping me come up with this project. Thanks to Sina Bahram for their input —our conversations at 2019 p5.js Contributors Conference inspired the describe() and describeElement() functions—, and to Akshay Padte for their advice on unit testing. This GSoC project would not have been possible without Chancey Fleet and Claire (who started thinking of ways to make p5.js sketches screen reader accessible in late 2015), the work of Mathura Govindarajan, and of many other contributors and supporters in the p5.js community.

:heart: 

