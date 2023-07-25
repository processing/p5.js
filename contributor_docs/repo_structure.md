# Where our code lives

The overarching p5.js project includes some repositories other than this one:

- **[p5.js](https://github.com/processing/p5.js)**: This repository contains the source code for the p5.js library. The [user-facing p5.js reference manual](https://p5js.org/reference/) is also generated from the [JSDoc](https://jsdoc.app/) comments included in this source code. It is maintained by [Qianqian Ye](https://github.com/qianqianye) and a group of [stewards](https://github.com/processing/p5.js#stewards).
- **[p5.js-website](https://github.com/processing/p5.js-website)**: This repository contains most of the code for the [p5.js website](http://p5js.org), with the exception of the reference manual. It is maintained by [Qianqian Ye](https://github.com/qianqianye), [Kenneth Lim](https://github.com/limzykenneth), and a group of [stewards](https://github.com/processing/p5.js-website#stewards).
- **[p5.js-sound](https://github.com/processing/p5.js-sound)**: This repository contains the p5.sound.js library. It is maintained by [Jason Sigal](https://github.com/therewasaguy).
- **[p5.js-web-editor](https://github.com/processing/p5.js-web-editor)**: This repository contains the source code for the [p5.js web editor](https://editor.p5js.org). It is maintained by [Cassie Tarakajian](https://github.com/catarak).
- Other add-on libraries not listed above usually have their own repository and maintainers and are not maintained by the p5.js project directly.


## Repository File Structure

There are a lot of files here! Here's a brief overview. It can be confusing, but you don't need to understand every file in the repository to get started. We recommend beginning in one area (for example, fixing some inline documentation), and working your way outwards to exploring more. Luisa Pereira's [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) also gives a video tour of the tools and files used in the p5.js workflow.

- 📁`contributor_docs/` contains  documents that explain practices and principles for contributors
- 📁`docs/` does not actually contain docs! Rather, it contains the code used to *generate* the [online reference manual](https://p5js.org/reference/).
- 📁`lib/` contains an empty example and the p5.sound add-on, which is periodically updated via pull request from the [p5.js-sound repository](https://github.com/processing/p5.js-sound). This is also where the built p5.js library gets placed after being compiled to a single file using [Grunt](https://gruntjs.com/). It does not need to be checked into the GitHub repository when you make a pull request.
- 📁`src/` contains all the source code for the library, which is topically organized into separated modules. This is what you'll work on if you are changing p5.js. Most folders have their own readme.md files inside to help you find your way around.
- 📁`tasks/` contains scripts which perform automated tasks related to the build, deployment, and release of new versions of p5.js.
- 📁`tests/` contains unit tests which ensure the library continues to function correctly as changes are made.
- 📁`utils/` might contain additional files useful for the repository, but generally you can ignore this directory.


## Miscellaneous
- There are other files in the 📁[`contributor_docs/`](https://github.com/processing/p5.js/tree/main/contributor_docs) folder that you might explore. They pertain to contributing to specific areas of this project, both technical and non-technical.
- [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) is a video tour of the tools and files used in the p5.js development workflow.
-  [This video from The Coding Train](https://youtu.be/Rr3vLyP1Ods) :train::rainbow: gives an overview of getting started with technical contribution to p5.js.
- The p5.js [Docker image](https://github.com/toolness/p5.js-docker) can be mounted in [Docker](https://www.docker.com/) and used to develop p5.js without requiring manual installation of requirements like [Node](https://nodejs.org/) or otherwise affecting the host operating system in any way, aside from the installation of Docker.
- The build process for the p5.js library generates a [JSON data file](https://p5js.org/reference/data.json) which contains the public API of p5.js and can be used in automated tooling, such as for autocompleting p5.js methods in an editor. This file is hosted on the p5.js website, but it is not included as part of the repository.
