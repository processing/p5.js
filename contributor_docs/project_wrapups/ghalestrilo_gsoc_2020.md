# p5.js Web Editor Mobile UI

#### by [@ghalestrilo](https://github.com/ghalestrilo)

The [p5.js web editor](https://github.com/processing/p5.js-web-editor) is today an important tool for the p5.js ecossystem: beginners and old-schoolers alike rely on the tool for prototyping p5 sketches, for its convenience and availability. Now, maybe you have a sketch idea while away from home, or you want to show your favorite one to your friend! So you naturally pick up your phone and realize the editor does not work very well on mobile. Slightly disappointed, you tell your friend "I'll send you a screenshot when I get home" 😢

I'm [Ghales](https://ghales.top), and the story above happened to me ~~(I've never sent the screenshot)~~. My project for Google Summer of Code '20 was to design and implement a mobile user interface for the editor, so that everyone can use the editor comfortably wherever they are. This requires:

1. Understanding the UI limitations imposed by low-resolutions
2. Detecting common patterns accross mobile editors
3. Defining the core functionality of the editor
4. Studying alternatives for the editor's UI and functionality solutions

## Step 1: Studying UX

I have very limited understanding of UX design, so my first step was studying how to properly develop one. The main takeaway is: first we lay out everything the editor can do, understand the different user journeys within it and try different possibilities. We choose those who make the most frequent and important features easier to find. From there, we make a few wireframes, which we turn into prototypes, and then have users test them. from the gathered feedback, we can iterate this a few times.

Seeing how other mobile editors organize functionality helps a **lot** when thinking of where things go, because most problems already have well-tested solutions. For instance: a bottom bar with editor actions, the project and filename on the header, an explorer sidebar, etc...

+ Feedback: Mentor
+ Feedback: Users

## Step 2: Feature Mapping

A decent amount of time was spent mapping out what the current editor does onto a spreadsheet - a very rudimentary *Feature Map*. Notice how the UI is described in a tree structure, where the further from the root, the more clicks a functionality takes. The most urgent ones need to be as left as possible, near the user.

## Step 3: Prototyping

Once the feature map was done, time to draw some screens. We created a Figma project and pretty much followed the feature map when putting things in place. Below is the very first draft:


![First design draft of the mobile layout](https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/images/mobile-draft-1.png)


+ Wireframing
+ User tests

![Final mobile UI proposals](https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/images/mobile-final-proposals.png)

## Step 4: Coding!

Now we have more confidence that the UI will fulfill its purpose. So, knowing that many things will be adjusted along the way, we begin

A key point here is that some core code will be the same **regardless** of the final design we decide on. This allowed me to get some stuff out of the way as I ran the user tests.


## PR Timeline:

15/06 - [#1455 Create Mobile Editor Endpoint](https://github.com/processing/p5.js-web-editor/pull/1455)
**18/06 - [#1459 Add Editor component to the Mobile IDE View](https://github.com/processing/p5.js-web-editor/pull/1459)**
**01/07 - [#1467 Mobile Sketch Preview Screen](https://github.com/processing/p5.js-web-editor/pull/1467)**
**01/07 - [#1472 Mobile Preferences Screen Prototype](https://github.com/processing/p5.js-web-editor/pull/1472)**
06/07 - [#1490 Fixes #1487](https://github.com/processing/p5.js-web-editor/pull/1490)
**21/07 - [#1502 Add <Console /> to Mobile Views](https://github.com/processing/p5.js-web-editor/pull/1502)**
21/07 - [#1507 Refactor mobile components to react hooks](https://github.com/processing/p5.js-web-editor/pull/1507)
03/08 - [#1513 Add Dropdown Menu to the mobile IDE View](https://github.com/processing/p5.js-web-editor/pull/1513)
04/08 - [#1531 [HOTFIX] Restore Devtools Sidebar](https://github.com/processing/p5.js-web-editor/pull/1531)
**17/08 - [#1528 Feature/mobile examples](https://github.com/processing/p5.js-web-editor/pull/1528)**
**17/08 - [#1539 Implement Mobile version of Files tab / sidebar](https://github.com/processing/p5.js-web-editor/pull/1539)**
**22/08 - [#1543 Add Login/Logout functionality to mobile layout](https://github.com/processing/p5.js-web-editor/pull/1543)**
**22/08 - [#1564 Feature/switch mobile desktop](https://github.com/processing/p5.js-web-editor/pull/1564)4**




<!-- One of the most anticipated features for the [p5.js web editor](https://github.com/processing/p5.js-web-editor) is a mobile-friendly UI. Despite its wide adoption by the community, the editor's interface did not handle low resolutions well, limiting its usage on mobile devices. -->