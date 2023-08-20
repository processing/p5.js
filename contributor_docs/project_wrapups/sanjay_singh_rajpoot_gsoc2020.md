  # Internationalization(i18n) and Deployment of p5.js website

#### By Sanjay Singh Rajpoot ([@SanjaySinghRajpoot](https://github.com/SanjaySinghRajpoot) | GSoC 2021

### Overview
The p5.js website has all the features but it lacked Translation features. In this project, I have added the new translation feature to the P5.js website. Due to internationalization (i18n), the p5.js website is built from templates that retrieve the text content from data files. The entire site is built with Node JS, Handlebars, and Grunt. There are three kinds of pages and each works differently: References, examples, and other web pages. References Pages are built-in English and swapped to other languages using JS on the front-end. Translation content is stored in a JSON object. For every new page, we need to create a key-value pair in the hi.yml file. A single JS template is also needed. Examples pages are built from templates with handlebars, while examples are stored in JS files. To implement i18n, new templates were created specifically for the Hindi language, so that Examples were rendered properly. Other pages are built from templates in which Handlebars point to the content in the actual language when rendered.

The major goals of this project were:
1.  Adding new translation feature and new hindi language to p5.js website.
2.  Making sure that the website is ready for production use. 


### Workflow
#### Task 1: First Page Test 

Running a small test of my proposal solution by translating `get-started` page and then analyzing page performance.  

Process followed:

1. Defining an abbreviation for the Hindi language following the ISO 639–1 standard.
2. Add an entry with the new language abbreviation at `package.json` to the languages category -located under the repository root directory.
3. Creating a new `hi.yml` file -stored under `src/data`. This file stores all the key values of pairs of this language.
4. Creating a new `hi.json` which will store all the references.
5. Creating a new menu entry in the `src/templates/partials/i18n.hbs` and creating a new button to toggle between different languages.


#### Task 2: Migrating the entire website to p5.js current version

There were many PR’s which were merged into the English format of the p5.js website but the Hindi version was outdated and obsolete. To fix these problems a separate new `main-hindi`branch was created so that it up to date with the current English version.

### Task 3: Translating all the References and Examples

There are three kinds of pages and each works differently: References, examples, and other web pages. References Pages are built-in English and swapped to other languages using JS on the front-end. Translation content is stored in a JSON object. For every new page, we need to create a key-value pair in the `hi.yml` file. A single JS template is also needed.
Examples pages are built from templates with handlebars, while examples are stored in JS files. To implement `i18n`, new templates were created specifically for the Hindi language, so that Examples were rendered properly. Other pages are built from templates in which Handlebars point to the content in the actual language when rendered. P5.js website has over 100+ examples and 200+ References each individual has their own website with code examples and documentation. Each of them was translated to Hindi using handlebars and YAML file formats.


## PRs made

###  Final PR
[GSoC'21: New Hindi Branch #1071](https://github.com/processing/p5.js-website/pull/1071)
### i18n and new webpages
[GSoC'21: i18n of p5.js website, Translated pages for Hindi Language #1041](https://github.com/processing/p5.js-website/pull/1041)
