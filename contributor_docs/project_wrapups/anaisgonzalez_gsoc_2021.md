# Improving the p5.xr Library Through Artistic Examples

#### by [Anais Gonzalez](https://anaisgonzalez.design)



## Work Pull Requests and Issues
  * All of the pull requests made as a part of the project can be found [here](https://github.com/stalgiag/p5.xr/pulls?q=is%3Apr+author%3Aanagondesign+created%3A%3C2021-08-23).
  * All of the issues opened as part of the project can be found [here](https://github.com/stalgiag/p5.xr/issues?q=is%3Aissue+author%3Aanagondesign+created%3A%3C2021-08-23+).
  * All of the commits I made for the project can be found [here](https://github.com/stalgiag/p5.xr/commits?author=anagondesign).



## Overview 
Over the course of this summer, I worked on improving the p5.xr library by creating a series of artistic examples with the guidance of my mentor Stalgia Grigg. The p5.xr library is an add-on for p5 that adds the ability to run p5 sketches in Augmented Reality or Virtual Reality. It does this with the help of WebXR and anyone who is familiar with p5 can experiment with this library as long as they have the necessary equipment. 

The major goals of this project were to explore the possibilities of creative coding in p5.xr and show others how they can use p5 to work with the core concepts of immersive mediums. To accomplish this, the different themes of this project were broken down into a collection of simple and complex examples. The simple examples focused on the technical aspects of how to utilize VR specific functions within p5.XR while the complex examples were more of an abstract/creative exploration of all these concepts. 



## Work

### [Example #1: Immersive Typography](https://github.com/stalgiag/p5.xr/tree/master/examples/immersive-typography)
This was the first theme I started working on since I like experimenting with type. I started thinking about ways in which I could immerse myself with letter forms and tried to imagine what that would look like through some sketches.

![immersive-typography-sketch-1](https://user-images.githubusercontent.com/83731139/130163196-4c37fbfe-95ca-449b-8741-f41697cff63b.jpg)
![immersive-typography-sketch-2](https://user-images.githubusercontent.com/83731139/130163197-7ec096e4-00f4-4962-8e7f-cee00d285e74.jpg)

I thought of including 3D shapes with moving typographic textures on them and floating letterforms that were scattered throughout space. When I started working on it in VR, I learned about how to use [intersectBox()](https://p5xr.org/#/reference/raycasting?id=intersectsbox), a VR-specific function that allows you to trigger changes in a box of a specific size by using raycasting. This function ended up being the basis for the basic example where I use it to change a box's stroke color and text just by looking at it.

![immersive-typography-gif-1](https://user-images.githubusercontent.com/83731139/130161907-ef491b1d-dbce-4d7f-b2c1-647c04ae9c95.gif)

For the complex example, I started working on typographic textures in WEBGL first before bringing them in VR. These are some different versions of these tests: [1](https://editor.p5js.org/agonzal019/sketches/ZTjSOBQ7L), [2](https://editor.p5js.org/agonzal019/sketches/aFxmSlZ2w), [3](https://editor.p5js.org/agonzal019/sketches/PTaRhklbv). One of the first things I struggled with was not knowing how to use timing properly to reset an array. After talking with Stalgia about it, they taught me about how to use modulo, which returns the remainder of something after division. This line of code would play a big role in many of the other examples I've created. This is where I encountered my first issue. I found out that using plain text in VR was difficult because the text would only be visible at certain angles, so I decided to keep on using createGraphics() to display the type instead. This process was going well until I tried to use deltaTime in one of the earlier versions of this example. The WEBGL example's timing changes functioned perfectly in the browser but when I brought it into VR, the letters in the array wouldn't switch. Luckily, after posting an [issue](https://github.com/stalgiag/p5.xr/issues/133) about it, the problem was resolved and deltaTime and millis() were now functioning. 

After that was resolved, I finished the complex example by combining different parts of my earlier drafts all into one piece. I used intersectBox() to increase the scale of the box upon viewing it, the array of changing letterforms scattered through space that used deltaTime, textToPoints, and a planetary structure with rotating text to make my own galaxy of typography.

![immersive-typography-gif-2](https://user-images.githubusercontent.com/83731139/130161915-e75ca7c7-c8e0-419b-9cf1-04bff4281176.gif)

PRs in this section: [#137](https://github.com/stalgiag/p5.xr/pull/137) , [#138](https://github.com/stalgiag/p5.xr/pull/138)



### [Example #2: Visual Art Making Tools](https://github.com/stalgiag/p5.xr/tree/master/examples/visual-art-making-tools)

![visual-art-making-tools-sketch](https://user-images.githubusercontent.com/83731139/130163201-9443f3b4-2a7b-48c6-bc51-cdb708bd53c4.jpg)

I started experimenting with using 3D shapes as drawing tools in WEBGL by removing `background()` from `draw()`, but quickly ran into problems when trying to do this same method in VR. I learned that if background() is put into `draw()`, one of the eyes of the headset becomes completely blocked out. This is because draw runs twice in VR (once per eye), which is why [setVRBackgroundColor()](https://p5xr.org/#/reference/vr?id=setvrbackgroundcolor) goes in setup, so that the background is cleared after rendering for each eye.

Since I couldn't use this approach of not drawing the background to keep previously drawn shapes, Stalgia showed me a different approach that stores an array of objects indicating previous brush strokes at the x, y, and z positions of the viewer's controller. Now that the positioning was correct, we had to use [generateRay()](https://p5xr.org/#/reference/raycasting?id=generateray) to create a ray originating at the hand's location in order to use `intersectSphere()`. It's also necessary to use **`applyMatrix(hand.pose)`** to apply the position and rotation of the hand to a box indicating the location of the player's hand.

![visual-art-making-tools-gif-1](https://user-images.githubusercontent.com/83731139/130161879-d61c1ecb-2000-4310-9794-b11009e46225.gif)

After I was able to actually draw something, I started thinking about ways in which I could add more variety. For the basic example, I used [intersectSphere()](https://p5xr.org/#/reference/raycasting?id=intersectssphere) to change the color of the brushstroke. This method of using ray intersection to change things became tedious in the complex example. I'd been using this method to change the color, size, and shape of the brush until I discovered that I could [utilize other buttons on my controller](https://github.com/stalgiag/p5.xr/blob/master/src/p5xr/core/p5xrInput.js) besides the trigger, so I started using those instead. *One thing to note for the Oculus Quest 2 is that the input code for the touchpad buttons does not work at all.* 

![visual-art-making-tools-gif-2](https://user-images.githubusercontent.com/83731139/130161882-2dd81c55-c823-44b7-bc00-5b98e07a1dac.gif)

For the textures in the complex example, I initially wanted to use a collection of custom textures made in p5 as textures for the brushstroke, but that caused the sketch to run incredibly slow, so I improvised. I took screenshots of my textures, manipulated the images in Photoshop, and then used those images as my final textures for the sketch. I then made everything more fun and chaotic by randomizing the texture, shape, and size of the brush automatically when someone draws. 

PRs in this section: [#140](https://github.com/stalgiag/p5.xr/pull/140) , [#141](https://github.com/stalgiag/p5.xr/pull/141)



### [Example #3: Immersive 360](https://github.com/stalgiag/p5.xr/tree/master/examples/immersive-360)

![immersive-360-sketch](https://user-images.githubusercontent.com/83731139/130163198-e956e189-efae-4a1d-a71b-a2ca36b8f61c.jpg)

I created p5 animations in the browser and then displayed them within VR by using a specific function called [surroundTexture()](https://p5xr.org/#/reference/vr?id=surroundtexture). Normally intended for displaying 360 photos, this function creates a very large sphere with inverted scale that surrounds the viewer. Regarding functionality, both the basic and complex examples allow the viewer to switch between states by pressing the trigger button. For the complex example, I also included some typographic animations to stay consistent with my style.

![immersive-360-gif](https://user-images.githubusercontent.com/83731139/130161902-dbcda386-b55b-4454-8101-f108aa47e89d.gif)

PRs in this section: [#145](https://github.com/stalgiag/p5.xr/pull/145) , [#146](https://github.com/stalgiag/p5.xr/pull/146)



### [Example #4: Physics](https://github.com/stalgiag/p5.xr/tree/master/examples/physics)
I've never worked with physics in code before so I watched a Coding Train tutorial on strings, but the example didn't easily translate to the scale of VR. After speaking with my mentor about it, they showed me a working physics example that I was able to expand upon for the complex version of this theme. The basic example includes boundaries and a ball that can be held and thrown around.

![physics-gif-1](https://user-images.githubusercontent.com/83731139/130161918-e969e700-eea6-46dc-923a-95979775cd6e.gif)

For the complex example, I made the Ball class from earlier generate multiple balls at random locations that could change size, shape, texture, and color the moment they collide with a boundary. I also tried to include type textures on the shapes too, but UV wrapping on the 3D shapes made them illegible. So instead I displayed the type textures on the boundaries of the room. I eventually removed the ability for the ball to change shape or texture since it felt too busy and just left it so it changes only size and color upon collision. Once I added in the other walls and ceiling, the whole thing really came together.

![physics-gif-2](https://user-images.githubusercontent.com/83731139/130161920-9fea2aa4-8e75-458a-9bac-97e67b9ce463.gif)

PRs in this section: [#143](https://github.com/stalgiag/p5.xr/pull/143) , [#144](https://github.com/stalgiag/p5.xr/pull/144)



### [Example #5: Embodiment](https://github.com/stalgiag/p5.xr/pull/147)
For the embodiment example, my mentor explained p5.xr viewer properties that helped position objects relative to the body in VR. We can get the location of the camera with `viewerPosition` and we can also get the pose of the camera with viewerPoseMatrix. We can use `applyMatrix(viewerPoseMatrix)` on the head of the body, which allows it to mirror the direction and pose of the viewer's head. By putting `viewerPosition` inside of translate, now the other parts of the body will be relative to the location of the head.

![embodiment-gif-1](https://user-images.githubusercontent.com/83731139/130161883-66469af7-3e6b-4ab8-bd11-ef92933a9402.gif)

There wasn't enough time to finish the complex example. I wanted to create a dragon that the viewer could look at and move with, but I was having trouble converting the scale to the correct dimensions in VR, which are extremely small.

PRs in this section: [#147](https://github.com/stalgiag/p5.xr/pull/147)




## Future
Future work could add specific input controls for the Oculus Quest 2's x, y, a, and b buttons. Right now the gamepad code does not function for Oculus but does work with HTC Vive.
Future work could investigate performance issues with text in VR.



## Conclusion
Even though it was challenging for me as a novice coder working with an experimental program, I had fun making these examples and I learned so many new things! First and foremost, I'd like to thank my mentor Stalgia Grigg for all the patience, kindness, and encouragement they've given to me this past summer. They've been such a great mentor to me and I don't think I wouldn't have gotten this far in the program without them and their guidance. I would also like to thank the Processing Foundation and Google for giving me this opportunity to contribute something cool to their community <3
