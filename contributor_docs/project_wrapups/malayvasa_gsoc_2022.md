## Reworked and New Examples - GSoC 2022

This year with my mentor @tyler-yin, I’ve worked on updating the examples section of the p5js website. My goal with the project was to introduce examples which focus on programming constructs alongside concepts of art & design. My hope is that by showcasing how the tool can be used visually, I can bridge the gap that beginners often face between conceptualising an artwork and coding it.

I also propose a set of layout and functionality changes to the website that enhance the user experience. I believe the way the examples is currently structured can intimidate a lot of beginners from exploring and learning. 

You can find my full proposal [here](https://summerofcode.withgoogle.com/media/user/bad5e07f0969/proposal/gAAAAABjD1624v_zls-M-HNtpmsqjHRz0xzwXQuSzMLP3JgcdJ2uEMqJ5r4URH1Gk4qmJFMhS3f2zuuAvFglM-TFS2VWbtQGjccnF3FzmW6FwG1T4l6Y9I4=.pdf).

## Current Progress

I have so far been working on 5 of the 25+ categories present in the examples section.

These mainly involve : Color, Math, Image, Motion, Drawing, and Input. 

I have structured my work in this notion document ([https://malayvasa.notion.site/GSoC-2022-Examples-Project-ffee1e56ab1a4d7bb27b40ea7a145555](https://www.notion.so/GSoC-2022-Examples-Project-ffee1e56ab1a4d7bb27b40ea7a145555)) where you can view it category wise. There are two broad categories :

## Reworked Examples 
These are existing examples that I felt needed to be simplified or modified to make them easy to understand and inviting beginners to play with the code.

### Color
- Saturation : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/D_diJGx3z)
- Hue : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/cp-vOyVaN)
- Brightness : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/ePCMD0Qva)
- Lerp Color HSB : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/MXJuQ6PXQ)
- Radial Gradient HSB : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/oLbAZAYiu)

### Math
- Random : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/q4UHuGgOf)
- Noise 2D : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/vMJrphk9M)
- Noise 3D : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/lk1oVQzbx)
- Arctangent (Simple) : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/jaiw_N5sb)
- Arctangent (Advanced) : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/2yRK0w1q6)
- Distance 1D : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/UL3NmUPa6)
- Sine Cosine : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/pGHOS_8ks)
- Sine : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/fP-4RSNHR)
- Parametric Equations (Simple) : [Editor Link](https://editor.p5js.org/malayvasa/sketches/7oeYm1cPy)
- Additive Wave : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/O_mktBiqU)

### Others

- Image
Transparency : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/FHFm3jHQv)
Alpha Mask : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/CARbnWpzw)
- Motion
Reflection (Simple) : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/jtmKm8sRx)
- Input 
Keyboard : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/Pi2EyKvlg)
- Form
Lines : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/MgithbMo6)
- Text
Rotation : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/QkPp1hvsd)


## New Examples
These are the examples that are not on the website, but I feel should be there. They broadly introduce new concepts that I’ve myself encountered.

### Color
- Color Wheel : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/9K5GEkGT9)
- Monochromatic Color Sceme : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/lomRnGCUd)
- Responsive Text Fill : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/wAO-2_vcL)

### Image
- Pixel Array Manipulation : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/YTy8LlSFq)
- Dot Matrix Animation : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/nDxraaJ8u)

### Motion
- Circular : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/vpNF676Z5)
- Wave Maker : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/zNeDx6t7M)

### Text
- Lyric Poem : [Editor Link](https://editor.p5js.org/malayvasa2001/sketches/aC1oUxpAo)

## Guidelines for a great example
Working on these I’ve developed guidelines to write a great example that anyone can follow as well :

### Be Correct
Example code is an opportunity to directly influence how your users write code. Therefore, examples should showcase the best way to use your product 

Example code should meet the following criteria:
1. Free of any errors.
2. Perform the task it claims to perform.
3. Be as production-ready as possible.
4. Follow language-specific conventions.

### Be General
Examples should focus on explaining or demonstrating concepts that can be applied to a wide variety of scenarios. If you find writing a super specific example, ask yourself if writing a tutorial would be a better way to address it.

 Examples are not tutorials. People already know what they are seeking from a tutorial, examples instead introduce people to what's possible.

#### Be Simple
As a beginner, seeing a page full of code can be very intimidating. To avoid this, examples should be kept as simple as possible. 

Try and keep the pre-requisite knowledge to a minimum. Since an example is ideally being used to introduce a new concept or framework, the reader shouldn't have the added burden of figuring out other stuff which could be avoided. 

In some cases, an example will require more complexity. Break it down further into three separate examples that address different experience levels Beginner, Intermediate & Advanced.

#### Be Well Commented
In the case of examples, comments almost form a dialogue with the code. This gives the reader a sense that someone is explaining the code to them. 

Comments are also extremely helpful in introducing additional context. Clarity and understanding of the purpose of a particular line of code are important to avoid unwanted confusion.

Moreover, since the reader is exposed to well-documented code this will encourage them to add comments to their code as well.

#### Be Inviting
This one is pretty simple, the example should invite the user to play around with the code. 

This can be achieved by :
1. Making the example intriguing, to invoke the thought "How did it do that?!"
2. Using easy to understand variable names, although they might seem a bit verbose at times.
3. Making the example editable, without the need of setting up a coding environment.

#### Be Discoverable
It doesn't matter how great your example is, if it isn't easy for the reader to find it. There are a few things you can do to improve discoverability : 

1. Have a descriptive name, it is possible many beginners aren't aware of a concept at all and using a technical name might hinder the process of discovery.
2. Link your examples to the relevant sections of the documentation, and to other similar examples.
3. Have a thumbnail, if contextually applicable.

## Acknowledgements

I would like to thank Tyler, Saber and Qianqian. The project would not have reached this stage without the amazing guidance and support from them.