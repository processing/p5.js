Ahoj! Ďakujeme za tvoj záujem prispieť do projektu p5.js! Rôzne spôsoby akými môžeš prispieť nájdeš [tu](https://p5js.org/community/#contribute). Tento priečinok obsahuje niekoľko rôznych dokumentov určených pre vývojárov p5.js.

# Štruktúra Priečinkov Projektu

- `src/` obsahuje všetky zdrojové kódy knižnice, ktoré sú organizované do modulov na základe tém. Práve tu budeš pracovať ak budeš vyvýjať p5.js.
- `lib/` obsahuje finálnu verziu p5.js určenú pre koncových používateľov. Táto verzia bude načítavaná do ich skečov a projektov (vrátane kompresnej formy). Toto je výstupom kompilácie zdrojových kódov do jedného súboru [Grunt](https://gruntjs.com/).
- `contributor_docs/` obsahuje rôzne Markdown dokumenty ktoré sú určené pre vývojárov p5.js a to hlavne preto, lebo obsahujú popis praktík a princípov.
- `docs/` neobsahuje samotnú dokumentáciu! Obsahuje však zdrojový kód, ktorý *generuje* [online verziu referenčnej príručky](https://p5js.org/reference/).
- `tests/` obsahuje unit testy, ktoré zaručujú, že knižnica bude fungovať správne aj po vykonaní zmien.
- `tasks/` obsahuje skripty, ktoré vykonávajú automatizované úlohy spojené s budovaním, nasadením a vydaním novej verzie p5.js.
- `patches/` môže z času na čas obsahovať [Git patches](https://git-scm.com/docs/git-format-patch). Vo väčšine prípadov však môžeš ignorovať tento priečinok.

# Ako Prispieť

Známe chyby a zamýšľané nové funkcie sú zaznamenané pomocou [GitHub issues](https://github.com/processing/p5.js/issues). Problémoé [štítky](./issue_labels.md) sa používajú na kategorizovanie problémov, ako napríklad tie, ktoré sú [vhodné pre začiatočníkov](https://github.com/processing/p5.js/labels/level%3Abeginner). Ak by si chcel začať pracovať na existujúcom probléme, pridaj komentár k problému a tým pádom upozornil ostatných o svojom úmysle prispieť. Zároveň ti môže byť poskytnutá pomoc. Ak si dokončil svoju prácu na konkrétnom probléme, [predlož pull request (PR)](./preparing_a_pull_request.md) proti master vetve repozitára p5.js. Do políčka s popisom PR uveď vetu "resolves #XXXX", pričom namiesto #XXXX zadaj problém, ktorý si vyriešil. Ak PR adresuje problém, ale nevyriešil ho úplne (teda problém ostáva nevyriešený po prijatí tvojich zmien), napíš "addresses #XXXX".

Ak si objavil chybu alebo ťa napadla nejaká nová funkionalita, ktorú by si rád pridal, začni s predložením problému. Nepredkladaj jednoducho pull request obsahujúci kód, ktorý rieši chyby alebo prináša novú funkcionalitu bez toho, aby si najskôr predložil problém, pretože nebudeme schopný tvoj kód akceptovať. Akonáhle obdržíš spätnú väzbu na svoj problém a povolenie na jeho riešenie, môžeš začať s procesom prispievania.

Môžes triediť problémy ktoré môžu obsahovať reprodukcie chýb alebo otázky ohľadom dôležitých informácií ako napríklad otázky ohľadom čísla verzie alebo informácie ohľadom reprodukcie chyby. Ak by si chcel začať triediť problémy, tak jednou z možností je [prihlásiť sa na odber p5.js na CodeTriage](https://www.codetriage.com/processing/p5.js). [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

Rozpoznávame všetky druhy príspevkov. Tento projekt sa riadi podľa [all-contributors](https://github.com/kentcdodds/all-contributors) špecifikácie. Pridaj sa ako prispievateľ do [readme](https://github.com/processing/p5.js/blob/master/README.md#contributors) podľa [týchto inštrukcií](https://github.com/processing/p5.js/issues/2309)!

## Doprovody a Dodatky

Mimo samotného kódu je potrebné aby si dodal aj kombináciu z nasledovných.

- [inline dokumentácia](./inline_documentation.md) vo forme komentárov kódu, ktoré vysvetľujú kód vývojárom a používateľom. Mnohé z týchto komentárom musia podliehať syntaxi [JSDoc](https://jsdoc.app) a budú publikované na stránke p5.js ako súčasť [online referenčnej príručky](https://p5js.org/reference/)
- [unit testy](./unit_testing.md), malé časti kódu, ktoré sú oddelené od knižnice a použite na overenie správnosti správanie
- [benchmarky](./benchmarking_p5.md) na testovanie výkonu

## Príklady

Stránka p5.js obsahujé [integrované príklady](http://p5js.org/examples/). Môžeš [pridať ďalšie](https://github.com/processing/p5.js-website/blob/master/contributor_docs/Adding_examples.md) a zároveň si pozrieť problém, ktorý obsahuje list [požadovaných príkladov](https://github.com/processing/p5.js/issues/1954).

## ES6
p5.js nedávno migrovalo na [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015). Ak chceš vidieť ako táto zmena ovplyňuje tvoj príspevok, navštív prosím stránku [adaptácia ES6](./es6-adoption.md).

## Iné Nápady

Ak by si chcel prispieť nejakým iným spôsobom, ktorý nie je týmto dokumentom pokrytý, napíš nám na adresu [hello@p5js.org](mailto:hello@p5js.org) a daj nám vedieť čo máš na mysli! Mimo práce na zdrojovom kóde vždy oceníme pomoc s vecami ako dokumentácia, návody, workshopy, učebný materiál, branding dizajn. Spoj sa nami a možeme sa porozprávať o spôsoboch ako by si mohol prispieť.

# Gotchas

The developer tooling included with the p5.js codebase is intentionally very strict about some things. This is a good thing! It makes everything consistent, and it will encourage you to be disciplined. This means you may try to change something only to have your commit rejected by the project, but don't get discouraged; even seasoned p5.js developers get caught by this stuff all the time. Typically the problem will be in one of two areas.

## Code Syntax

p5.js requires clean and stylistically consistent code syntax, which it enforces with [Prettier](https://prettier.io/) and [ESlint](https://eslint.org/). The rules are checked before you commit, but you can also install an [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) for your code editor to highlight errors as soon as you type them, which will probably help you along as you are coding and saves you the hassle of a failed Git commit. In general, we err on the side of flexibility when it comes to code style, in order to lower the barriers to participation and contribution.

To detect errors, run the following command in your terminal (do not type the `$` prompt):

```
$ npm run lint
```

Some syntax errors can be automatically fixed:

```
$ npm run lint:fix
```

Sticking with the established project style is usually preferable, but [occasionally](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=) using an alternate syntax might make your code easier to understand. For these cases, Prettier [offers an escape hatch](https://prettier.io/docs/en/ignore.html), the `// prettier-ignore` comment, which you can use to make granular exceptions. Try to avoid using this if you can, because there are good reasons for most of the style preferences enforced by the linting.

Here is a quick summary of code style rules. Please note that this list may be incomplete, and it's best to refer to the [.prettierrc](https://github.com/processing/p5.js/blob/master/.prettierrc) and [.eslintrc](https://github.com/processing/p5.js/blob/master/.eslintrc) files for the full list.
* ES6 code syntax is used
* Use single quotes (rather than double quotes)
* Indentation is done with two spaces
* All variables defined in the code should be used at least once, or removed completely
* Do not compare x == true or x == false. Use (x) or (!x) instead. x == true, is certainly different from if (x)! Compare objects to null, numbers to 0 or strings to "", if there is chance for confusion.
* Comment your code whenever there is ambiguity or complexity in the function you are writing
* See the [Mozilla JS practices](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style#JavaScript_practices) as a useful guide for more styling tips

## Unit Tests

Unit tests are small pieces of code which are created as complements to the primary logic and perform validation. If you are developing a major new feature for p5.js, you should probably include tests. Do not submit pull requests in which the tests do not pass, because that means something is broken.

In order to run unit tests, you'll need to have previously installed the project's dependencies.

```
$ npm ci
```

This will install *all* the dependencies for p5.js; briefly, the most important dependencies specific to unit testing include:

- [Mocha](https://mochajs.org/), a powerful testing framework that executes individual test files which are specific to p5.js
- [mocha-chrome](https://github.com/shellscape/mocha-chrome), a mocha plugin that runs mocha tests using headless Google Chrome

Once the dependencies are installed, use Grunt to run the unit tests.

```
$ grunt
```

Sometimes it is useful to run the tests in the browser instead of on the command line. To do this, first start the [connect](https://github.com/gruntjs/grunt-contrib-connect) server:

```
$ npm run dev
```

With the server running, you should be able to open `test/test.html` in a browser.

A complete guide to unit testing is beyond the scope of the p5.js documentation, but the short version is that any major changes or new features implemented in the source code contained in the `src/` directory should also be accompanied by test files in the `test/` directory that can be executed by Mocha to verify consistent behavior in all future versions of the library. When writing unit tests, use the [Chai.js reference](http://www.chaijs.com/api/assert/) as a guide for phrasing your assertion messages so that any errors caught by your tests in the future will be consistent and consequently easier for other developers to understand.

# Development Process

1. Install [node.js](http://nodejs.org/), which also automatically installs the [npm](https://www.npmjs.org) package manager.
2. [Fork](https://help.github.com/articles/fork-a-repo) the [p5.js repository](https://github.com/processing/p5.js) into your own GitHub account.
3. [Clone](https://help.github.com/articles/cloning-a-repository/) your new fork of the repository from GitHub onto your local computer.

   ```
   $ git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

4. Navigate into the project folder and install all its necessary dependencies with npm.

   ```
   $ cd p5.js
   $ npm ci
   ```

5. [Grunt](https://gruntjs.com/) should now be installed, and you can use it to build the library from the source code.

   ```
   $ npm run grunt
   ```

   If you're continuously changing files in the library, you may want to run `npm run dev` to automatically rebuild the library for you whenever any of its source files change without you having to first type the command manually.

6. Make some changes locally to the codebase and [commit](https://help.github.com/articles/github-glossary/#commit) them with Git.

   ```
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. Run `npm run grunt` again to make sure there are no syntax errors, test failures, or other problems.

8. [Push](https://help.github.com/articles/github-glossary/#push) your new changes to your fork on GitHub.

   ```
   $ git push
   ```

9. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).

This process is also covered [in a video by The Coding Train.](https://youtu.be/Rr3vLyP1Ods) :train::rainbow:

# Building Documentation

Inline comments in p5.js are built into the public-facing [reference manual](https://p5js.org/reference/). You can also view this locally:

```
$ npm run docs:dev
```
# Repositories

The overarching p5.js project includes repositories other than this one.

- [p5.js](https://github.com/processing/p5.js): This repository contains the source code for the p5.js library. The [user-facing p5.js reference manual](https://p5js.org/reference/) is also generated from the [JSDoc](http://usejsdoc.org/) comments included in this source code. It is maintained by [Lauren McCarthy](https://github.com/lmccart).
- [website](https://github.com/processing/p5.js-website) This repository contains most of the code for the [p5.js website](http://p5js.org), with the exception of the reference manual. It is maintained by [Lauren McCarthy](https://github.com/lmccart).
- [sound](https://github.com/processing/p5.js-sound) This repository contains the p5.sound.js library. It is maintained by [Jason Sigal](https://github.com/therewasaguy).
- [web editor](https://github.com/processing/p5.js-web-editor): This repository contains the source code for the [p5.js web editor](https://editor.p5js.org). It is maintained by [Cassie Tarakajian](https://github.com/catarak). Note that the older [p5.js editor](https://github.com/processing/p5.js-editor) is now deprecated.

# Miscellaneous

- [Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/) is a video tour of the tools and files used in the p5.js development workflow.
- The p5.js [Docker image](https://github.com/toolness/p5.js-docker) can be mounted in [Docker](https://www.docker.com/) and used to develop p5.js without requiring manual installation of requirements like [Node](https://nodejs.org/) or otherwise affecting the host operating system in any way, aside from the installation of Docker.
- The build process for the p5.js library generates a [json data file](https://p5js.org/reference/data.json) which contains the public API of p5.js and can be used in automated tooling, such as for autocompleting p5.js methods in an editor. This file is hosted on the p5.js website, but it is not included as part of the repository.

