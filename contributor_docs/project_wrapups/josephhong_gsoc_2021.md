# Summer ‘21: Translations, Coding, and WebDev, Oh My!

###### Note: There aren't any images in this markdown file because I wasn't sure how to get them to display from a different host/folder. There's a Medium post with the same details [here](https://medium.com/processing-foundation/summer-21-translations-coding-and-webdev-oh-my-cc1a2d6bc65f).

By Joseph Hong
Mentored by Jiwon Shin 
Advised by Inwha Yeom

## Intro

Hey there. I’m Joseph, a junior who participated in Google Summer of Code 2021. This documentation is about what I worked on over the summer–– Korean translations of the p5.js Reference section and a redesign of the p5.js website. I went into this not really sure (and somewhat worried about) what I was going to be doing, but it turned out to be an awesome opportunity for me to polish my Korean and build upon the web development skills I learned throughout my sophomore year.

## Quick Links

### Part 1: Korean Translations

- [Pull Request](https://github.com/processing/p5.js-website/pull/1062)
- [Repository](https://github.com/jhongover9000/p5.js-website)
- [Documentation](#Part-One)

### Part 2: New Website Design Proposal

- [Prototype Site](https://jhongover9000.github.io/p5-testSite/homePage.html)
- [Repository](https://github.com/jhongover9000/jhongover9000.github.io/tree/main/p5-testSite) (contains finished .hbs files)
- [Documentation](#Part-Two)

## Part One: Reference Section Translations

This part was rather straightforward. It involved translating the untranslated lines in the JSON file for the p5.js website’s Reference section. My work was split mainly into 3 parts: translating fully untranslated pages, translating half-translated pages, and standardizing/optimizing the translations and the code for both readability and so that the auto-update script wouldn’t add already-translated lines to pages. [Here is the link]() to the repository with the changed files and [here is the link]() to the pull request.

Translating most of the pages that were fully in English to Korean was somewhat difficult when considering that there have been multiple translators working on the file, which led to different terminology or sentence structure (as for the formal speech used in Korean). Deciding on which terms and structures to use was the main difficulty, but aside from that it wasn’t too difficult.

Half-translated pages weren’t that hard to finish, but one issue was that often there would be a page that was almost fully translated except for a few bits (i.e., the return or the parameters). I ended up translating those as well.

Optimizing the code was probably one of the more difficult parts of this project, as it involved having to go almost line by line in order to standardize the format of the pages. Often <br> would be used instead of creating a separate line/paragraph, which resulted in the auto-updating script getting confused and adding lines that were already translated because it registered the page as having only one paragraph translated. Finding these and changing them was part of the work. 

Another thing that I addressed was the differences in terminology used for parameters and the ‘(Optional)’ tag. Different sections had different terms for parameters and/or locations of the optional tag, so I went through the file and unified them. 

In addition, adding links to the functions mentioned in descriptions is a task that I started but did not complete. This bit was very manual, requiring me to go through each line to find a function/instance that didn’t have a link, compare it to the English JSON, then add a link if required. I also needed to change the external links (to other reference pages) to Korean versions or entirely new sites if the pre-existing ones no longer worked.

## Part Two: p5.js Website Redesign Proposal

### Preface

I know this isn’t a book or anything, but I’d like to start by saying that I did not know that Processing.org was going to launch its new website (a week before my project ended; the day I write this is actually less than a week, but you get the idea). Though it is true that I drew inspiration from said new website for last-minute details, I didn’t know that the Processing website would get a makeover. It made me think about how the p5.js website may possibly already be in the works of creating a new design, but that I was too late to stop.

So, with that said, here’s what I worked on for the last half of Google Summer of Code, and here’s the repository for the prototype website. (Note: the internal navigation links don’t work, as the homepage is the only page I was able to create in the time I had.)

### Humble Beginnings

The start of the project was a lot different than the result. Initially this bit was about restructuring the Learn section in a way that was more ‘user friendly’. I had also said that I was going to try to prototype new designs for a navigation bar. But after a discussion with Jiwon (bestest mentor btw), I realized that I could be as  crazy  bold as I wanted with the proposal since it was, well, a proposal, and so, uhh… I decided to redesign the website.

### Choosing a Format and Theme

When deciding the format in which I would present the proposal, I considered using wireframe applications like Figma or Adobe XD, but ultimately chose to write the HTML/CSS/JavaScript myself (copy/pasted from the original files to keep uniformity to a certain degree). This was because a) I had learned these skills last year and thought it was a great opportunity to put them to use and grow as a result and b) live demos with all those animations and interactions look really cool.
For the themes, fonts, and colors of the site, I tried to keep to the original website as much as possible (such as how the footer looks, as well as the logo for the website navigation bar). I also kept the centered style (which limits the maximum width) of the website.

### The Result

Once again, [this is the link](https://jhongover9000.github.io/p5-testSite/homePage.html) to the prototype website. The home page is all that’s there for now. It was a challenge to think of a new design for the home page as there were no images, but also because I didn’t have much time. For now, I’ll explain some new things that I was able to implement on the site.


#### Home Screen: An Opportunity for Community Engagement

The homescreen is a work-in-progress. Currently, it’s an iframe that contains a quick script I threw together with p5.js, but it can be used to display artwork from submissions by p5.js users. A small div containing credits could also be displayed in the far bottom right corner, too. Having a list of links, then displaying a random one upon loading the site, could make opening the p5.js site more fun as well. Overall, this would be a great opportunity to increase community engagement, as users would be able to see their own work displayed on the site!

#### Internal Navigation: More Than Meets The Eye

One issue that I tried to address with the navigation was the sheer number of pages available on the website, and the problem that what each page entails might be ambiguous to new (or even old) users. My solution was to group the pages together by topic, split into 4 main categories along with the Home page: Get Started, Resources, Community, and Support Us. In addition, I tried to add descriptions to each of the pages to give users a summary of the page before they navigate to it. The website that gave me the inspiration for this kind of design was the Unity website, which contains detailed descriptions for each of its pages within the navigation bar via dropdown menus.

Here’s a breakdown of each category and the pages they contain. (I’ll add any notes if a link/page is unique or new.)

Get Started: clicking this will lead you to the Getting Started page
- Getting Started
- Download

Resources: this link is not defined, as a new page will likely have to be created that contains links to the other resource pages
- Reference
- Libraries
- Examples
- Learn
- Books

Community: clicking this will lead you to the Community Statement page
- Forum
- Showcase

Meet Up: this leads to day.processing.org. It’s the link that originally is in the home page reading, “Organize a meet-up.”
- Twitter
- Instagram
- Discord

Support Us: clicking this will lead you to the Donate page
- GitHub: this leads to the p5-website GitHub repository
- Donate
- Teach
- Share: this leads to the Google Form for submissions, the link that is originally in the home page reading, “Share something you’ve made!”

The dropdown menu is made with an element that contains the links in li elements, as well as a div that contains the default description that appears when only hovering over the topic navigation link.


    <li class="navItem">
             <a href="/index" class="navLink">Topic Navigation Link Name</a>
             <div class="dropdown">
               <ul class="dropdownContent">
                 <!-- Default Text -->
                 <li><div class="dropdownTextDefault">
                   <p class="pageName">Cool Subject Title Here!</p>
                   <p class="pageDescription">Snarky description here.</p>
                 </div></li>
                 <!-- Inner Navigation Link(s) -->
                 <li class="dropdownEntry">
                   <a href="link/to/page" class="innerNav">PageName
                     <div class="dropdownText">
                       <p class="pageName">PageName</p>
                       <p class="pageDescription">Fun/Detailed description here.</p>
                     </div>
                   </a>
                 </li>
               </ul>
             </div>
           </li>

#### External Navigation & i18n

The inspiration behind the external navigation bar is the new Processing.org website. I was having a lot of trouble trying to decide where the external navigation (sister sites) would go. I was debating whether or not to have yet another dropdown from the p5.js logo, but after I saw the Processing.org website, I realized that I could simply have it disappear once you start scrolling. And that’s exactly what happened.
As for the i18n button, it’s not super robust (it’s kind of hard-coded and a bit disappointing on mobile–– another thing I’ll get to) but it works.


#### To Top Button

The “To Top” button appears when you scroll down and scrolls up when you click it. It’s a lifesaver for long pages such as Reference or Example entries where you want to go back to the top to look at the code/demonstration.

#### Footer

The footer is one of the things I tried to keep from the original design. It’s simple, and I like it. It’s the same dashed line, but I added a few more things, like the Follow Us and Contact us boxes.


### Mobile Version

This bit is a work-in-progress despite how it seems. The language selection, if you don’t select a language, will stay on the screen even when deselected. It’s because of the way that I made the CSS on hover, rather than changing with click. I initially had it on click (hence the onclick function in the HTML), but I’m not sure why I undid it. I think it may have had to do with how it displayed on desktop screens. However, I can imagine a solution using a click function where the CSS is reset (the class is changed back) upon scroll (in other words, a simple fix).

Making the navigation for the site was difficult for me, especially understanding how @media worked and how to change the site’s navigation bar from horizontal to vertical. It took (a lot of) errors and (many) frustrating nights to get it to finally work, along with the display of the site’s home page on a mobile screen. I think it still needs some more flair (the navigation contents seem a bit plain), but it displays properly now and I’m more than grateful for that.



### Moving Forward: Things to Address, Add, and Improve

#### Integration
I know that this site isn’t perfect, and there are a few issues that are already foreseeable, such as the integration with the existing site. There will have to be changes made in the CSS files for column-span and main, I think. I already attempted an integration with the pre-existing files, which went rather poorly. Tweaking the CSS a bit on the site fixed the issues, which means that it’s mainly a CSS issue (since the main thing that the new website design changes is CSS, rather than the way that information is processed in the backend). In other words, it shouldn’t be too hard. But that would mean that content in the other pages should change, too. This would mean one would need to decide which parts to keep and which parts to change. Also, new additions to the site would mean new entries in the .YML files (i.e., for new headers and descriptions for nav links, etc.), meaning new translations as well.

#### Search Bar
The search bar is something that I didn’t add due to time and not really knowing where to place it. I know that it is useful, so it should go somewhere. I was thinking about placing it in the external navigation bar, but for some resolutions it might be too small to notice. Most likely, placing it in the internal navigation bar and having it expand when clicked on, or having it on the home page screen (which would then create the need for it on the nav bar for different pages) would be ideal.

#### Accessibility
First off, the font that’s used is rather light and so there’s the issue with contrast (this also includes the links for the navigation bar but that was the case for the original site so I’ll put that aside). This can easily be fixed by using the font with greater weight.
On the other hand, there’s Screen Reader accessibility that needs to be considered here. I tried to keep a lot of the aria labels and the sr-only elements, but since a lot of it is hidden (in order to minimize the user interface), I’m not sure how that will affect accessibility in that area.

#### Images and Background
Images can speak a thousand words. They also look prettier than a thousand words of text. I think that adding images (or even live canvases) of projects from the Showcase, and also the Examples (take a leaf out of Processing.org hehe) on the homepage would be a great addition to the site.


## Afterward
All in all, this was a project that was fun, interesting, and frustrating (mostly fun and interesting though). I learned a lot about things in HTML that I didn’t know. If I had the time, I would definitely have kept going to try and standardize all the pages (via CSS) to fit the new theme. I tried to integrate the files (as I mentioned before) but saw that it would take maybe another week to a month of work, then some more to add all the features I want to (and more). I don’t know if this will be finished any time soon because the new semester is starting, but if this new design is good then I’m willing to continue working on it!
