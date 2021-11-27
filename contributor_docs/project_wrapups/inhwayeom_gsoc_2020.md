# p5 for 50+ teaching
#### by Inhwa Yeom ([@yinhwa](https://github.com/yinhwa)), mentored by [Qianqian Ye](https://qianqian-ye.com) 


## Overview

Reaching out to 50 and more p5 educators around the world, "p5 for 50+ teaching" aims to contribute in documenting, showcasing, and sharing teaching experiences, specifically by re-using the existing features of p5js.org. The project was mentored by Qianqian Ye.

* Project Page: https://p5js.org/teach/

* Final Pull Request: https://github.com/processing/p5.js-website/pull/867

* Demo Videos: https://drive.google.com/drive/folders/1FjKJWYg4SDX_WUft2lvSEqNduB68t84o?usp=sharing


## Goal & Approach

The purpose of “p5 for 50+ teaching” was to collect information on p5 workshops, classes, or relevant materials currently scattered across the Web; archive and visualize the information on a single webpage of p5js.org, namely "/teach". Addressing the need for a better access to educational experiences and resources, my mentor Qianqian and I hope to contribute with this webpage in connecting and consolidating the p5 educator and learner community around the world.

The major functionality of /teach page lies in sharing a spectrum of data, such as dates/numbers, places/proper nouns, quotes, images, etc. To facilitate the user experience of gaining such information, I adhered to the following design principles: 1) maintain the intuitive design and use flow of the website, 2) by either re-activating or re-using the current features and functions on p5js.org.  

In terms of the optimization, I also refrained from adding too much script files, assets, features or functions -- except when necessary for the purpose of this project.


## Researches on User Interface, Experience, Engagement

### Analysis on the Current Design Theme & Elements

#### 1) Understanding the Purpose of p5js.org Website
With the major goal of p5js.org being enhancing accessibility, the website has always maintained its minimalist characteristics for visibility, readability, and usablity.

#### 2) Elements to Universal & Accessible Design
- key colors: stark contrast between the p5 signature color (#ed225d) for highlights and black texts
- key shapes: 2D primitive elements, such as square, grid, dotted and dashed lines 
- Interactions: simple and immediate transition upon mouse over or click inputs

Based on this analysis, design principle for creating /teach page, and created some [prototypes per design units](https://drive.google.com/drive/folders/1cz5nJSW-IvA4wB6KvzRQkyU47qMcWUd_?usp=sharing) (text disposition, text colors, range sliders, scroll bars, buttons, modal boxes, mouse interactions)

### Feature & Use Flow Design for /teach 

#### 1) Leading Users to /teach Page
Instead of adding a direct link on the sidemenu, which already has 15, I added hyperlinks to some existing text and button elements:
- main page > "Get Involved" > text: "teach a workshop or class"
- "/learn" page > "Contributing to the Community" > "Teach" tab

#### 2) Basic Structure of /teach 
Just as the structure of other pages, /teach also has less than three steps for exploration: introduction & submission guideline, search filter, and search results

#### 3) Personalizing Information
With the "Search Filter" feature, users can filter teaching cases based on the cases' relevance with diversity & inclusion issues, venue, year, level of difficulty. Although I initially planned to include range sliders for the filtering, I changed to checkboxes to guarantee freedom of selection and to eliminate possible connotations on chronological priority.

#### 4) Delivering Detail Information
I chose modal box for containing detail infromation to each teaching case, for a number of reasons. First, users can access the detail without having to open a new window. Second, optimization-wise, modal boxes can circumvent the issue of overloading the repository with additional HandleBars and JavaScript files, and assets. 


### Submission Questionnaire Design

I made a submission questionnaire to facilitate the process of gathering p5 education experiences. With the feedback from my mentor Qianqian and Evelyn Masso, another GSoC mentor, I could draw [3 draft questionnaires](https://drive.google.com/drive/folders/1fJCEm1aR4f15XYroZiRkw1vhKeg9Je-x?usp=sharing) via Google Form until I could revise the [final version](https://docs.google.com/forms/d/1IKjaWXznJtLqjLw12-yXrckcMy2lWV92jl8H5gA7m_Q/edit?usp=sharing) of the submission form.

The submission form included 12 of short- or long-answer, or multiple-choice questions, and was designed to take less 20 minutes to finish. 

### Initial Gathering of Submissions

For the first month, I have researched online 33 p5 workshops, classes, and materials, and organized the relevant links and contact information on a Google SpreadSheet. Among those list, Qianqian and I put the primary focus on receiving submissions from those who contribute to the diversity and inclusion of p5 community with their teaching practices. With a snowball sampling, I could eventually reach out to 53 people or entity in total via email.


## Implementation

Languages: HTML, CSS, jQuery

- Created a main `/teach` page on p5js.org with a [“teach” branch](https://github.com/yinhwa/p5.js-website/tree/teach) in a fork of p5.js-website repo
- Setup an `index.hbs` under `src/templates/pages/teach` as a landing page to p5js.org/teach, and a CSS section for /teach on `src/assets/css/main.css`
- Added jQuery for showing/hiding an accordion menu to "Search Filter" button; enabling 4 different filters (Diversity & Inclusion, Venue, Year, Level of Difficulty); opening/closing modal boxes to each teaching case
- Added HTML & jQuery & CSS codes for the preliminary versions of UI/UX design PR#1
- Edited HTML & jQuery & CSS codes for the final version of UI/UX design
- Retrieved submissions and organized the infromation on modal contents
- Added codes for translation on i18n-relevant files 

## Future Plan & Sustainability

My future contribution plans
- Add Korean translation
- Add alt text to photos
- Publicize on Processing Foundation Forum and social media of p5.js and Processing Foundation to promote open recommendations & submissions
- Manage future recommendations & submissions, and the page updates

For Future Contributors:
- Add Spanish, Chinese, Japanese, Hindi translation
- Gather more teaching experiences from around the world!
- Bring more ideas to keep the page visible and useful


## Acknowledgements

First and foremost, I would like to deeply thank my mentor Qianqian for her fullest and cannot-be-better supports. I very much appreciate the fact that she embarked on our mentor meetings with  reflections on the pedagogy of creative coding. Her introduction to related books and people who engage in teaching as their social and art practices led me to ponder on the notion and effects of "teaching" itself. In terms of technical mentorship, she has provided highly detail feedback to the prototypes of UI/UX design and interaction, and submission questionaire. She would even occasionally provie cares to my work-and-life balance with this project. Throughout this project, she taught me a true meaning of "mentorship".

I also feel especially grateful to Lauren McCarthy, who was my very first p5.js teacher and informed me of those amazing opportunities I could have with Processing Foundation for the last six months. I have spent a substantial amount of time with the organization and was indeed grateful of instant responses and supports from all the other members and organizers, as well. Evelyn Masso and Aarón  Montoya-Moraga, to name a few, had also offered an insight to this project with detail feedback. Last but not least, I would like to thank Connie Liu for having me accompanyied throughout the GSoC program with our cheerful talks across the art & design & technology.  
