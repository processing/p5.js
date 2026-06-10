# Search Bar for Sketches in the p5.js Web Editor

For my Google Summer of Code 2019 project for The Processing Foundation, I worked with Cassie Tarakajian to create a search bar for the p5.js Web Editor. You can search within your own sketches and other user’s sketches.  

## Contributions

Before this project, I had never been involved with open source or programmed outside of a classroom setting. I began the summer learning best contribution practices, how the web editor is structured, and why it was organized that way. Afterwards, I was introduced to [Git](https://git-scm.com/), [React](https://reactjs.org/), and [Sass](https://sass-lang.com/). I worked with two issues ([#989](https://github.com/processing/p5.js-web-editor/issues/989), [#1109](https://github.com/processing/p5.js-web-editor/pull/1109#pullrequestreview-253008128)) to learn how to make visual and functional changes within the web editor. The first issue had a design that led to questions about its intention and implementation within the code, and was put on hold for further discussion. Although it was unable to be resolved, I learned that implementing design through code was not always straightforward; frequent communication between the programmer and designer is very pivotal to the process.


![Example of portfolio site with overlays](https://drive.google.com/uc?export=view&id=19J9j3Bj8EmyxAgaorsrrYSmbngsnkofh) ![Example of mock search bar searching through list of hearthstone cards](https://drive.google.com/uc?export=view&id=1pZ_MYdn6rSlSgXTs9e6xCm2x_nP41ftm)


I created a portfolio site with pop-up modals to understand React components and how data is being passed between them. I also made a mock search bar that searched within a list of [Hearthstone cards](https://hearthstonejson.com/). I first created one with only React and then re-made it using [Redux](https://redux.js.org/) and [Reselect](https://github.com/reduxjs/reselect). Assembling these examples was extremely helpful in learning these libraries and repeating the same process for the web editor.


![Neutral search bar](https://drive.google.com/uc?export=view&id=1ZotyuZ7Gvha_Knz-37PVS8v-Dsq7R4pU)
![Active search bar](https://drive.google.com/uc?export=view&id=1VN2abuO6eaC_Yq4y7VM6Z_nQfteFbRvm)


I used designs uploaded to Zeplin as visual guides for how the search bar would appear in its [neutral](https://app.zeplin.io/project/55f746c54a02e1e50e0632c3/screen/59413d89c2b5318d69be12d3) and [active](https://app.zeplin.io/project/55f746c54a02e1e50e0632c3/screen/59413d88cda26c1669f83fea) state. I ran into some questions involving other aspects of the designs, which showed the search icon as a toggle for hiding and viewing the search bar. I was also unsure as to whether a search button would also be necessary as the results would be presented live. I turned to some resources on[ best practices for a search bar](https://uxplanet.org/design-a-perfect-search-box-b6baaf9599c) to finalize decisions, which advised providing prominent access, a search button, and a magnifying-glass icon.

The search bar, placed within the modal that displays a list of the user’s sketches, has a search icon that serves as a search button, a text input area, and clear button. The color scheme of the buttons and border are dependent on the theme.


![Live search demonstration](https://drive.google.com/uc?export=view&id=1KCRF66qkTUnsFe_dvzO2FNqh9jl7zJ6M)


The search bar is live, which means that the sketchlist is filtered as the user types. To prevent the list from getting filtered after every keystroke, this filter function was throttled, or arranged to happen periodically after every set time frame. The search icon button will also call the filtering to happen if pressed. If the user wishes to clear their query, the clear button will reset it to an empty string. The search query also gets refreshed whenever the sketch list overlay is re-opened.

## Acknowledgements

I deeply express my gratitude to the Processing foundation for giving me such a wonderful opportunity and to my mentor, Cassie Tarakajian, for her education, patience, and support!
