# p5 /teach reorganize & update
#### by Gracia Zhang ([@Gracia-zhang](https://github.com/Gracia-zhang)), mentored by ([@yinhwa](https://github.com/yinhwa))


## Overview


Updated 12 new posts that were submitted in the past two years on Teach Page, using yaml and Handlebars. Re-design the user interface(UI) and the experience of the Teach Page with new functions and features. And responsible for the front-end development of this web page. The project was mentored by Inhwa Yeom.


* Project Page: https://p5js.org/teach/


* Final Pull Request(UI/UX update): https://github.com/processing/p5.js-website/pull/1275


## Goal & Approach


This project is an update and extension of Inhwa's project “p5 for 50+ teaching”. She has archived and visualized workshops, classes and relevant materials to better provide the community with access to education-related resources. 


In this project, I updated the posts based on the recent submission form first to be familiar with the original /Teach and to research the user through the submitted forms. Based on user studies, I intend to bring more learners & diversity on /teach page by optimizing the submission form with a new form for learners who want to share and a new section "Upcoming Workshops". Inhwa and I hope that this new section will bring in more willing learners and give more teachers the opportunity to share their workshops, classes, etc.


## Updating posts


### Screening the submission forms for the last two years


#### 1)Filter unpublishable contents
-the answer in the spreadsheet doesn't seem like a full version.
-filled the form up with unrelated contents.


#### 2)Update the other contents.
-updated with 12 filtered contents in yaml file.
-added the corresponding model box for each of the 12 new posts.

* Teach Page Rebasing Pull Request: https://github.com/processing/p5.js-website/pull/1245
  
* Teach Page Posts Update Pull Request: https://github.com/processing/p5.js-website/pull/1249


## UI/UX Design 

Besides the specific UI/UX changes below, I also proposed an issue in processing/p5.js-website about the overall structural changes to enhance the user experience.[#1250](https://github.com/processing/p5.js-website/issues/1250)


![](https://drive.google.com/uc?export=veiw&id=1r-wriIvnOPLL6G-ihrL-9wOSEOKfY7l3)


#### 1)Upcoming Workshops

Following the original UI style, I used a combination of banners and headers to present the new workshops to guarantee accessibility. Also, to make it easier for users to plan their time, I have added workshop start time in this section. 


#### 2)Corresponding Tags

In order to allow users to see the results of their selection more visually after selecting the filtering options, I added a tags column to the right of each posts and added a color change corresponding to being selected.


## Submission Questionnaire Re-Design

I adapted the original Submission Form specifically for learners.
With the help of Saber and Inhwa, I also updated the parts of the original form that could be ambiguous, to try to avoid misunderstandings and irrelevant content when the sharers fill out the form. [Updated form.](https://forms.gle/GVLrxrvuBTpSTzgCA)


### Updating Submission Form for Learners

#### 1)In the guidelines:

- Changed the guideline for potential learners and added a section to encourage learners to share.
- Added a note for non-English submissions to remind submitters that their responses will be automatically translated into English.

#### 2)For learners to share their experiences:

- Added a question to differentiate teachers and learners.
- Removed the question about teaching goal and method.
- Added questions about learning feelings and difficulties encountered.

### New Submission Form for Upcoming Workshops

For the new section "Upcoming workshops", I designed a new form for the submission, including basic information about the workshop and the teacher. [New form.](https://forms.gle/mP9oFpeA4SMWoi446)

## Implementation

Languages: HTML, CSS, jQuery


- Created an “upcoming workshops” section in the HTML file.
- Added script for showing/hiding each banner when different titles are clicked.
- Added HTML & jQuery & CSS codes for the preliminary versions of corresponding tags
- Edited HTML & jQuery & CSS codes for the final version of UI/UX design
- Added Css code for responsive web design on mobile devices.

Upcoming Workshops are still on open call for specific engagement content.[#1277](https://github.com/processing/p5.js-website/issues/1277)

## Future Plan & Sustainability

My future contribution plans
- Add Chinese translation (As a Chinese Translation Stewards: [#1220](https://github.com/processing/p5.js-website/issues/1220))
- Keep updating posts and upcoming workshops
- Help with the website user experience not limited to /teach.([#1250](https://github.com/processing/p5.js-website/issues/1250))
- Start updating the workshops from an open call about “Upcoming workshops” and Learner-friendly form to gather more teachers and learners to join the /teach contribution.([#1277](https://github.com/processing/p5.js-website/issues/1277))


For Future Contributors:
- Add Spanish, Japanese, Hindi translation
- Gather more teaching experiences from around the world!
- Bring more ideas to keep the page visible and useful


## Acknowledgements

The first person I want to thank is Inhwa. I have to say, I looooove Inhwa as my mentor!!! I am a beginner in front-end and she helped me a lot throughout the GSoC project in every way. I couldn't have completed my project without her help. She encouraged me when I was hesitant about the direction, and explained in detail when I had problems with the code. She is both my mentor and my friend!

I would also like to thank Saber and Qianqian.The discussion with them about education has been very profitable and I have a more solid idea about my project.
