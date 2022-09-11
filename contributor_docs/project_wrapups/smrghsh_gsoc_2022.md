# GSOC 22 Work Summary
To quickly view contributions please visit this link:
[https://github.com/stalgiag/p5.xr/commits?author=smrghsh](https://github.com/stalgiag/p5.xr/commits?author=smrghsh)


# Enter VR button -- Immersive Session Process Update
The first goal of my work with p5xr was to improve the process by which a user enters a VR app. I was inspired by the way Three.js VR projects offer a scene preview and a VR button. This offers significant improvements for use, for distribution, and for development.

For the user - Immersive environments can be very intense experiences. By providing the user with a preview of the scene, a user can be primed with an expectation of experience, increasing comfort and safety.

For a content distributor - Providing a 2D scene representation is akin to providing a thumbnail — this can be used to cue the user to enter or to help represent a set of content on a single interface.

For the developer - By providing a scene preview, a developer can execute tests on the 3D environment without entering headset. This rapidly increases development time by giving a quicker view of the starting environment. This also allows for VR previews in a documentation page.

![diagram of before and after](https://user-images.githubusercontent.com/22751315/179292673-63ed9c21-05af-448d-8a64-17f46f698206.png)

This is how p5xr would display a VR scene has a green cube with a magenta background. Originally you could only see it once you click Enter VR and launch an immersive session. Now, you can preview the 3D scene.

**View the original issue with plan and documentation**
[https://github.com/stalgiag/p5.xr/issues/169](https://github.com/stalgiag/p5.xr/issues/169)

## Process Analysis
Working with WebXR Sessions and Devices was new to me, so under the advice of my mentor, I undertook a process analysis to learn about how three.js accomplished this goal and how p5js worked with WebXR. WebXR documentation feels quite sparse with regards to best practices and procedures, and it took me some time to learn.

![Process diagram of Three.js](https://user-images.githubusercontent.com/22751315/179166072-0982e2b6-8fb3-4305-9727-c48f39cd6ad9.png)

[Three.js’s implementation](https://github.com/mrdoob/three.js/blob/master/examples/jsm/webxr/VRButton.js) is quite simple, however, it does not provide for inline sessions— circumstances where VR/AR uses devices other than a head mounted display (HMD).

![Process diagram of p5xr before PR](https://user-images.githubusercontent.com/22751315/179165850-8cf8d7b9-fcfc-433f-be3c-2b2d1afb517e.png)
p5xr accounted for this, but creating a process diagram revealed opportunities to streamline this process and load the environment earlier. I went through several iterations of streamlining the process, and eventually settled on a process design that hoisted device checks earlier in the process and reduced the amount of checks on the browser XR state.

![Implemented process](https://user-images.githubusercontent.com/22751315/189506616-2aadef57-ade0-4e12-b34c-5aace04710e0.png)
**On figma, it’s easier to view the full process analysis diagrams:**
[Figma link](https://www.figma.com/file/MO8ffPGo90uwwua4qqyT4W/three.js-vs-p5xr-vs-new-p5xr-XR-launcher?node-id=0%3A1)

### Challenges with implementation
One challenge that I struggled with was dealing with resetting the [reference space](https://immersive-web.github.io/webxr/spatial-tracking-explainer.html) in between launching a VR experience for the user and returning to an inline session in an HMD’s 2D web browser. This is needed because the physical space that a user navigates in an HMD is different than how they would interact in 2D. During this reset it’s necessary to set this, as well as a particular subset of  `XR` properties to `null` in order to completely clear this, Examining a [similar issue with Aframe’s development](https://github.com/aframevr/aframe/issues/4406) helped in the solution. 

**View the pull request:**
[https://github.com/stalgiag/p5.xr/pull/171](https://github.com/stalgiag/p5.xr/pull/171)

# Controller API Update
https://user-images.githubusercontent.com/22751315/186528906-cf60441d-1cab-431e-b950-fecd9eb41ce2.mp4

- Including the [Quaternion.js](https://github.com/infusion/Quaternion.js/) library as a dependency.
- Exposing the rotation as Euler angles (while respecting the `angleMode`) for progress for [Controller Input Rotation Data #158](https://github.com/stalgiag/p5.xr/issues/158). There is some gimbal-locking type behavior that is persisting.
- Updating the manual input test to show controller tracking with orientation as well as primary and second button presses
- Added notice about gimbal locking to documentation

**View the pull request**
[https://github.com/stalgiag/p5.xr/pull/181](https://github.com/stalgiag/p5.xr/pull/181)


## Minor Contributions
- Small note to help Windows users with development, suggesting Git Bash to prevent errors with launching a local development server. Through this commit, Stalgia taught me contribution norms.

[https://github.com/stalgiag/p5.xr/pull/168](https://github.com/stalgiag/p5.xr/pull/168)

- p5xr development has a set of manual tests in which the tester verifies app state manually; this pull request moves the objects in front of the tester, so they don’t have to turn their neck. I intended to increase usability and iteration speed with these changes

[https://github.com/stalgiag/p5.xr/pull/170](https://github.com/stalgiag/p5.xr/pull/170)


# Acknowledgements
Under the mentorship of Stalgia Grigg, I have learned invaluable methods of development and technical communication. This is my first time contributing to open source, and my first time interfacing with the WebXR API. At present, WebXR adoption is still growing, and the lack of best practices make development complex for new open source contributors. Stalgia has a unique ability to elucidate complex processes, and has fostered my interest on how to remove technical barriers to VR development. p5.js has shaped me as an artist, a developer, and an educator-- it is the basis on which I have built my technical skill. The opportunity to engage with how this library approaches VR is an honor. Thank you for this mentorship and opportunity.


