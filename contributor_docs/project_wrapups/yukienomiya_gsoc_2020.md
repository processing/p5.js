# i18n improvements and Italian translation

## Introduction

Throughout these past three months, I worked on improving and facilitating the internationalization process of the p5.js website, guided by my mentor, [Evelyn Masso](https://github.com/outofambit).

As the title of my project suggests, I originally planned to also add the Italian translation to the p5.js website. During the coding period, however, Evelyn and I decided to focus on the i18n improvements and prioritize building a new tool (**p5.js-website-translator**) over the completion of the Italian translation.

I wrote a [Design Doc](https://docs.google.com/document/d/1l8-h3fjIS_o7ncG7OJXPwOFA1O3htVjjJ_a_RgxoCxk/edit?usp=sharing) for the i18n improvements, where I explained the reasoning behind some choices and other possible future extensions to the project.

My contributions mostly concern the [p5.js-website](https://github.com/processing/p5.js-website) and [p5.js-website-translator](https://github.com/processing/p5.js-website-translator) repositories.

## Contributions

- **[PR #836](https://github.com/processing/p5.js-website/pull/836) - Extended p5.js-website translation render mechanism to support translation of p5.js Class pages**

  The Reference section of the p5.js-website displays the library documentation on Classes, Methods, and Fields. The [updateLanguage()](https://github.com/processing/p5.js-website/blob/main/src/templates/pages/reference/index.hbs#L61) function is responsible for swapping the original English text of the website's Reference section with its translated version. 
  
  The `updateLanguage()` function used to translate only Method and Field pages, but not Class pages; So even if the description of a p5 Class (i.e., `p5.Color`) was translated in the translation files, the translation wasn't rendered on the webpage.

  I, therefore, added an extra section to the `updateLanguage()` function that swaps text from Class pages of the Reference to complete the script.

- **[PR #837](https://github.com/processing/p5.js-website/pull/837) - Developed a script that parses data from the p5.js inline documentation and generates the English version of the Reference translation files**

  The Reference section of the website is built in English with the data from a JSON file that gets generated from the p5.js repository ([data.json](https://github.com/processing/p5.js-website/blob/main/src/templates/pages/reference/data.json). This English documentation file has a completely different structure compared to the files that contain the translated strings needed for the swapping. This made the process of comparing them to make sure they are synced very tedious. 
  
  I wrote a script that generates the English Reference file ([en.json](https://github.com/processing/p5.js-website/blob/main/src/data/reference/en.json): a file containing all the English documentation needed in the website, but with the same structure as the other translation files.

- **[PR #4733](https://github.com/processing/p5.js/pull/4733) - Setup a GitHub workflow in the p5.js repository that triggers a second workflow in the p5.js-website repository every time a new p5.js release gets published**

  **[PR #841](https://github.com/processing/p5.js-website/pull/841) - Setup a GitHub workflow in the p5.js-website repository that updates the p5.js documentation files**

  The English documentation file ([data.json](https://github.com/processing/p5.js-website/blob/main/src/templates/pages/reference/data.json)) had to be manually generated from the p5.js repository and committed to the p5.js-website repository every time a new p5.js release was published.
  I automated this process using two Github workflows: 
    - the `update-p5jswebsite` workflow (in the p5.js repository) gets triggered every time a new p5.js release gets published and it, in turn, triggers the update-documentation workflow
    - the `update-documentation` workflow (in the p5.js-website repository) runs a Grunt task that updates both the English documentation file ([data.json](https://github.com/processing/p5.js-website/blob/main/src/templates/pages/reference/data.json)) and the English Reference file (en.json) in the p5.js-website repository.

- **[PR #854](https://github.com/processing/p5.js-website/pull/854) - Update the existing translation files for the Reference section to match the structure of the English Reference file generated in PR #837**
  - Added the missing elements to the translated Reference files.
  - Converted the “description” elements from strings to arrays of strings.
  - Saved the “parameter” elements by name.

- **[PR #856](https://github.com/processing/p5.js-website/pull/856) - Created a script that merges the keys of a translated file (in either the JSON or YAML format) with its English version and removes the obsolete keys**

  **[PR #856](https://github.com/processing/p5.js-website/pull/856) - Set up a GitHub workflow in the p5.js-website repository that runs the updateJSON() or updateYAML() functions on the p5.js-website translation files every time one of them is modified.**

  The script contains the `updateJSON()` and `updateYAML()` functions.
  
  This ensures that all the translation files always contain the same keys.

- **[PR #865](https://github.com/processing/p5.js-website/pull/865) - Translated the YAML file in Italian**

  I translated in Italian the YAML file containing all the text from the p5.js website (excluding the Reference and the Examples section).

  This makes up for approximately ⅓ of the translation of the whole website.

- **[p5.js-website-translator](https://github.com/processing/p5.js-website-translator) - Built a Nuxt.js web app to simplify the translation process for contributors**

  (last commit [#51a29bd](https://github.com/processing/p5.js-website-translator/commit/51a29bd877ef671f130e53b2aeeeea1f9f7fc788))

  The **p5.js-website-translator** automatically fetches the translation files from the p5.js-website repository and offers the contributor a user-friendly UI where they can easily edit them.

  Once the user has selected the language and the translation section they want to contribute to, they will be presented with a page like this:

  ![image](https://user-images.githubusercontent.com/49163604/91746243-97b7b700-ebbc-11ea-8572-e94909e9c32f.png)

  The web page will display a list of translation cards, each containing a key from the translation file, its value in English, and its translated version (in the selected language, if the string has already been translated, or in English otherwise).

  ![image](https://user-images.githubusercontent.com/49163604/91746362-c5046500-ebbc-11ea-8fb2-b904b1444d2f.png)

  The user can:
    - **edit** the translated string
    - **compare** the edited version with the original one
    - **restore** the original value, therefore deleting the edit on that key

  The p5.js-website-translator app is serverless, so the edits made by the user are saved in the browser’s local storage.

  After editing the translation, the user can then **download** the resulting file.

  This spares the contributors the search for the translation files in the repository and the need to deal with raw files (in my experience, translating a lot of content using a text editor can be inconvenient, as you have to keep visually aligning the original and the translated text).

  The **p5.js-website-translator** is deployed on GitHub pages, so it’s ready to use.
  You can check it out [here](https://processing.github.io/p5.js-website-translator/)!

## Conclusion

As I mentioned above, halfway through the coding period, the project strayed a bit from the original plan. For this reason, the Italian translation was not completed: both the Reference and the Example sections still need to be translated.

Nonetheless, I'm very happy we decided to work on the p5.js-website-translator, as I believe it can really help to complete and maintain the existing translation and even create new ones.


From a technical point of view, working on the web app was fun and challenging at the same time: this was my first time using a frontend framework, which means that I learned a lot, but also that I was going quite slowly due to every little thing taking tons of time and google searches.

There is definitely still work that can be done/features that can be added to it, for instance:
- the option to filter translation cards (i.e., only view the ones that still need to be translated, or the ones that have been edited, etc.)
- a simple way to update the translation file in use with the latest version on the repository

I intend to keep working on the p5.js-website-translator and implement the missing features, but any help is very welcome!

## Acknowledgements

First of all, I want to thank the Processing Foundation for giving me this amazing opportunity.
This past summer allowed me to learn, grow, and step out of my comfort zone. It's an experience I will treasure forever.

To Lauren McCarthy, thank you for creating such a constructive, positive, and welcoming community. In particular, a big thank you to Aarón Montoya-Moraga for their suggestions on the i18n improvements (which inspired me to build the p5.js-website-translator), and to Kenneth Lim for answering my many questions so clearly and for providing constant feedback during the coding period.

And of course, thank you to my awesome mentor Evelyn Masso for guiding me through this amazing experience, for supporting my ideas and helping me develop them, and finally for somehow understanding all of my often twisted and unclear explanations. ❤️

Last but not least, I need to thank my friend Simone Primarosa for well, everything. From explaining what "source code" meant a few years ago to helping me deploying the p5.js-website-translator on GitHub pages, but mostly for telling me about Google Summer of Code last year and believing so much that I could do this, to convince me too.