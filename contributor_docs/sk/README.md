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

Vývojárske nástroje zahrnuté v kóde p5.js sú zámerne veľmi striktné ohľadom niektorých vecí. A to je dobre! Pomáha udržiavať veci konzistentné a povzbudí ťa aby si bol disciplinovaný. To znamená, že je možné že tvoj príspevok bude zamietnutý projektom, avšak nenechaj sa odradiť; stáva sa bežne aj skúseným vývojárom p5.js. Zvyčajne býva problém v jednom z dvoch miest.

## Syntax Kódu

p5.js požaduje čistý a štylisticky konzistentnú syntax kódu, ktorá je presadzovaná pomocou [Prettier](https://prettier.io/) a [ESlint](https://eslint.org/). Pravidlá sa kontrolujú pred odovzdaním kódu, avšak môžes si nainštalovať [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) do svojho editora kódu, aby ti zvýraznil chyby hneď ako ich píšeš, čo ti pravdepodobne pomože predčasne predísť problémom s odovzdaním kódu s Gitom. Vo všeobecnosti sa mýlime na strane flexibility, pokiaľ ide o štýl kódovania, aby sme znížili prekážky účasti a príspevku. Pre odhalenie chýb vykonaj nasledujúci príkaz vo svojom oblúbenom príkazovom riadku (nepíš znak `$`):

```
$ npm run lint
```

Niektoré syntaktické chyby je však možné opraviť automaticky pomocou príkazu:

```
$ npm run lint:fix
```
Lepšie je držať sa zavedeného štýlu projektu, ale [príležitostne](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=) by sa mohla použiť alternatívna syntax. Uľahčite tým pochopenie kódu. V týchto prípadoch Prettier [ponúka výnimky](https://prettier.io/docs/en/ignore.html), komentár `// prettier-ignore`, ktorý môžete použiť na získanie podrobných výnimiek. Pokúste sa vyhnúť použitiu tohto, ak je to možné, pretože existujú dobré dôvody pre väčšinu preferencií štýlov vynútených štylistickým procesorom.

Toto je krátky sumár k pravidlám štýlu kódu. Prosím ber na vedomie, že tento zoznam môže byť nekompletný a preto je najlepšie sa okazovať na [.prettierrc](https://github.com/processing/p5.js/blob/master/.prettierrc) a [.eslintrc](https://github.com/processing/p5.js/blob/master/.eslintrc) súbory pre kompletný zoznam pravidiel.
* Používa sa ES6 syntax kódu.
* Používaj apostrof (radšej než úvodzovky).
* Na odsadenie použi dve medzery.
* Všetky premenné definované v kóde by mali byť použité aspoň raz alebo úplne odstránené.
* Neporovnávaj x == true alebo x == false. Použi namiesto toho (x) alebo (!x). x == true, sa vyhodnotí inak ako (x)! Objekty porovnávaj s null, čísla porovnávaj s 0 alebo znaky s "", aby sa predošlo nedorozumeniam.
* V prípade, že tvoj kód obstahuje nejasností alebo komplexitu, pridaj komentáre.
* Pozri si [prakitká Mozilla JS](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style#JavaScript_practices) pre užitočné rady a návody ohľadom štylistických tipov.

## Unit Testy

Unit testy sú malé časti kódu, ktoré sú vytvorené ako doplnok k hlavnej logike a vykonávajú validáciu. Ak vyvýjaš významnú novú vlastnosť alebo funkcionalitu pre p5.js, mal by si zahrnúť v rámci príspevku aj testy. Neodovzdávaj pull requests v ktorých testy neprechádzajú, pretože to znamená, že niečo nefunguje.

Aby bolo možné spustiť unit testy, budeš musieť nainštalovať závislosti projektu.

```
$ npm ci
```

Tento príkaz nainštaluje *všetky* závislosti p5.js; stručne, najdôležitejšie závislosti špecifické pre unit testy zahrňuje:

- [Mocha](https://mochajs.org/), mocný testovací rámec, ktorý vykonáva jednotlivé testy špecifické pre p5.js.
- [mocha-chrome](https://github.com/shellscape/mocha-chrome), doplnok pre mocha, ktorý spúšťa testy v "bezhlavovom" móde prehliadača Google Chrome.

Ak sú závislosti nainštalované, použi Grunt pre spustenie unit testov.

```
$ grunt
```

Niekedy je užitočné spustiť testy v priamo v prehliadači miesto príkazového riadku. Aby si tak urobil, najprv naštartuj [connect](https://github.com/gruntjs/grunt-contrib-connect) server:

```
$ npm run dev
```

S bežiacim servrom by si mal byť schopný otvoriť `test/test.html` v prehliadači.

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

