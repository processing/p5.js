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

Známe chyby a zamýšľané nové funkcie sú zaznamenané pomocou [GitHub issues](https://github.com/processing/p5.js/issues). Problémoé [štítky](./issue_labels.md) sa používajú na kategorizovanie problémov, ako napríklad tie, ktoré sú [vhodné pre začiatočníkov](https://github.com/processing/p5.js/labels/level%3Abeginner). Ak by si chcel začať pracovať na existujúcom probléme, pridaj komentár k problému a tým pádom upozornil ostatných o svojom úmysle prispieť. Zároveň ti môže byť poskytnutá pomoc. Ak si dokončil svoju prácu na konkrétnom probléme, [predlož pull request (PR)](./preparing_a_pull_request.md) proti main vetve repozitára p5.js. Do políčka s popisom PR uveď vetu "resolves #XXXX", pričom namiesto #XXXX zadaj problém, ktorý si vyriešil. Ak PR adresuje problém, ale nevyriešil ho úplne (teda problém ostáva nevyriešený po prijatí tvojich zmien), napíš "addresses #XXXX".

Ak si objavil chybu alebo ťa napadla nejaká nová funkionalita, ktorú by si rád pridal, začni s predložením problému. Nepredkladaj jednoducho pull request obsahujúci kód, ktorý rieši chyby alebo prináša novú funkcionalitu bez toho, aby si najskôr predložil problém, pretože nebudeme schopný tvoj kód akceptovať. Akonáhle obdržíš spätnú väzbu na svoj problém a povolenie na jeho riešenie, môžeš začať s procesom prispievania.

Môžes triediť problémy ktoré môžu obsahovať reprodukcie chýb alebo otázky ohľadom dôležitých informácií ako napríklad otázky ohľadom čísla verzie alebo informácie ohľadom reprodukcie chyby. Ak by si chcel začať triediť problémy, tak jednou z možností je [prihlásiť sa na odber p5.js na CodeTriage](https://www.codetriage.com/processing/p5.js). [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

Rozpoznávame všetky druhy príspevkov. Tento projekt sa riadi podľa [all-contributors](https://github.com/kentcdodds/all-contributors) špecifikácie. Pridaj sa ako prispievateľ do [readme](https://github.com/processing/p5.js/blob/main/README.md#contributors) podľa [týchto inštrukcií](https://github.com/processing/p5.js/issues/2309)!

## Doprovody a Dodatky

Mimo samotného kódu je potrebné aby si dodal aj kombináciu z nasledovných.

- [inline dokumentácia](./inline_documentation.md) vo forme komentárov kódu, ktoré vysvetľujú kód vývojárom a používateľom. Mnohé z týchto komentárom musia podliehať syntaxi [JSDoc](https://jsdoc.app) a budú publikované na stránke p5.js ako súčasť [online referenčnej príručky](https://p5js.org/reference/)
- [unit testy](./unit_testing.md), malé časti kódu, ktoré sú oddelené od knižnice a použite na overenie správnosti správanie

## Príklady

Stránka p5.js obsahujé [integrované príklady](http://p5js.org/examples/). Môžeš [pridať ďalšie](https://github.com/processing/p5.js-website/blob/main/contributor_docs/Adding_examples.md) a zároveň si pozrieť problém, ktorý obsahuje list [požadovaných príkladov](https://github.com/processing/p5.js/issues/1954).

## ES6
p5.js nedávno migrovalo na [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015). Ak chceš vidieť ako táto zmena ovplyňuje tvoj príspevok, navštív prosím stránku [adaptácia ES6](./es6-adoption.md).

## Iné Nápady

Ak by si chcel prispieť nejakým iným spôsobom, ktorý nie je týmto dokumentom pokrytý, napíš nám na adresu [hello@p5js.org](mailto:hello@p5js.org) a daj nám vedieť čo máš na mysli! Mimo práce na zdrojovom kóde vždy oceníme pomoc s vecami ako dokumentácia, návody, workshopy, učebný materiál, branding dizajn. Spoj sa nami a možeme sa porozprávať o spôsoboch ako by si mohol prispieť.

# Gotchas

Vývojárske nástroje zahrnuté v kóde p5.js sú zámerne veľmi striktné ohľadom niektorých vecí. A to je dobre! Pomáha udržiavať veci konzistentné a povzbudí ťa aby si bol disciplinovaný. To znamená, že je možné že tvoj príspevok bude zamietnutý projektom, avšak nenechaj sa odradiť; stáva sa bežne aj skúseným vývojárom p5.js. Zvyčajne býva problém v jednom z dvoch miest.

## Syntax Kódu

p5.js požaduje čistý a štylisticky konzistentnú syntax kódu, ktorá je presadzovaná pomocou [Prettier](https://prettier.io/) a [ESlint](https://eslint.org/). Pravidlá sa kontrolujú pred odovzdaním kódu, avšak môžes si nainštalovať [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) do svojho editora kódu, aby ti zvýraznil chyby hneď ako ich píšeš, čo ti pravdepodobne pomože predčasne predísť problémom s odovzdaním kódu s Gitom. Vo všeobecnosti sa mýlime na strane flexibility, pokiaľ ide o štýl kódovania, aby sme znížili prekážky účasti a príspevku. Pre odhalenie chýb vykonaj nasledujúci príkaz vo svojom oblúbenom príkazovom riadku (nepíš znak `$`):

```shell
$ npm run lint
```

Niektoré syntaktické chyby je však možné opraviť automaticky pomocou príkazu:

```shell
$ npm run lint:fix
```
Lepšie je držať sa zavedeného štýlu projektu, ale [príležitostne](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=) by sa mohla použiť alternatívna syntax. Uľahčite tým pochopenie kódu. V týchto prípadoch Prettier [ponúka výnimky](https://prettier.io/docs/en/ignore.html), komentár `// prettier-ignore`, ktorý môžete použiť na získanie podrobných výnimiek. Pokúste sa vyhnúť použitiu tohto, ak je to možné, pretože existujú dobré dôvody pre väčšinu preferencií štýlov vynútených štylistickým procesorom.

Toto je krátky sumár k pravidlám štýlu kódu. Prosím ber na vedomie, že tento zoznam môže byť nekompletný a preto je najlepšie sa okazovať na [.prettierrc](https://github.com/processing/p5.js/blob/main/.prettierrc) a [.eslintrc](https://github.com/processing/p5.js/blob/main/.eslintrc) súbory pre kompletný zoznam pravidiel.
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

```shell
$ npm ci
```

Tento príkaz nainštaluje *všetky* závislosti p5.js; stručne, najdôležitejšie závislosti špecifické pre unit testy zahrňuje:

- [Mocha](https://mochajs.org/), mocný testovací rámec, ktorý vykonáva jednotlivé testy špecifické pre p5.js.
- [mocha-chrome](https://github.com/shellscape/mocha-chrome), doplnok pre mocha, ktorý spúšťa testy v "bezhlavom" móde prehliadača Google Chrome.

Ak sú závislosti nainštalované, použi Grunt pre spustenie unit testov.

```shell
$ grunt
```

Niekedy je užitočné spustiť testy v priamo v prehliadači miesto príkazového riadku. Aby si tak urobil, najprv naštartuj [connect](https://github.com/gruntjs/grunt-contrib-connect) server:

```shell
$ npm run dev
```

S bežiacim servrom by si mal byť schopný otvoriť `test/test.html` v prehliadači.

Kompletný návod k unit testovaniu je nad rámec rozsahu p5.js dokumentácie, ale v skratke by sa dalo povedať, že akákoľvek závažná zmena alebo nová funkcionalita implementovaná v zdrojom kóde nachádzajúcom sa v priečinku `src/` by mala byť sprevádzaná kódom v testovacích súboroch v priečinku `test/`, ktoré môžu byť vykonané rámcom Mocha za účelom overenia konzistentnosti správania vo všetkých budúcich verziách knižnice. Keď píšeš unit testy, použi [referenčnú príručku Chai.js](http://www.chaijs.com/api/assert/) ako návod k frázovaniu správ tvojich tvrdení tak, aby chyby odchytené testami v budúcnosti boli konzistentné a teda zrozumiteľnejšie pre iných vývojárov.

# Vývojový Proces

1. Nainštaluj [node.js](http://nodejs.org/), ktorý automaticky nainštaluje balíčkového manažéra [npm](https://www.npmjs.org).
2. [Rozvetvi](https://help.github.com/articles/fork-a-repo) [repozitár p5.js](https://github.com/processing/p5.js) do svojho GitHub účtu.
3. [Vyklonuj](https://help.github.com/articles/cloning-a-repository/) svoj novo-rozvetvený repozitár z GitHub-u do svoj lokálneho počítača.

   ```shell
   $ git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

4. Prejdi do priečniku projektu a nainštaluj všetky nevyhnutné závislosti s npm.

   ```shell
   $ cd p5.js
   $ npm ci
   ```

5. [Grunt](https://gruntjs.com/) by mal byť teraz nainštalovaný a môžeš ho teda použiť na vybudovanie knižnice zo zdrojového kódu.

   ```shell
   $ npm run grunt
   ```

   Ak kontinuálne upravuješ súbory v knižnici, zváž príkaz `npm run dev`, aby sa knižnica automaticky vybudovala kedykoľvek zmeníš ktorýkoľvek zo zdrojových súborov bez toho, aby si musel manuálne zadať príkaz.

6. Vykonaj nejaké zmeny v lokálnom kóde a [odovzdaj](https://help.github.com/articles/github-glossary/#commit) ich s Git-om.

   ```shell
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. Spusť príkaz `npm run grunt` ešte raz aby si sa uistil, že kód neobsahuje syntaktické chyby, zlyhané testy, alebo iné problémy.

8. [Vypropaguj](https://help.github.com/articles/github-glossary/#push) svoje nové zmeny do svojho rozvetveného repozitára na GitHub-e.

   ```shell
   $ git push
   ```

9. Ak je všetko pripravené, odovzdaj svoje zmeny vo forme [pull request](https://help.github.com/articles/creating-a-pull-request).

Tento proces je tiež pokrytý [vo videu od The Coding Train.](https://youtu.be/Rr3vLyP1Ods) :train::rainbow:

# Budovanie Dokumentácie

Vnorené komentáre v p5.js sa budujú do verejnej [referenčnej príručky](https://p5js.org/reference/). Túto príručku si vieš pozrieť aj lokálne:

```shell
$ npm run docs:dev
```

# Repositáre

Zastršujúci projekt p5.js zahŕňa aj iné repozitáre ako tento.

- [p5.js](https://github.com/processing/p5.js): Tento repozitár obsahuje zdrojový kód knižnice p5.js. [Používateľská referečná príručka p5.js](https://p5js.org/reference/) je generovaná z [JSDoc](http://usejsdoc.org/) komentárov zahrnutých v tomto zdrojovom kóde. Spravuje ho [Lauren McCarthy](https://github.com/lmccart).
- [website](https://github.com/processing/p5.js-website) Tento repozitár obsahuje väčšinu kódu [stránky p5.js](http://p5js.org) s výnimkou referenčnej príručky. Spravuje ho [Lauren McCarthy](https://github.com/lmccart).
- [sound](https://github.com/processing/p5.js-sound) Tento repozitár obsahuje knižnicu p5.sound.js. Spravuje ho [Jason Sigal](https://github.com/therewasaguy).
- [web editor](https://github.com/processing/p5.js-web-editor): Tento repozitár obsahuje zdrojový kód pre [p5.js web editor](https://editor.p5js.org). Spravuje ho [Cassie Tarakajian](https://github.com/catarak). Všimni si však, že [p5.js editor](https://github.com/processing/p5.js-editor) je už zastaraný.

# Iné

- [Náhľad Dovnútra p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) je videoprehliadka nástrojov a súborov použitých pri vývoji p5.js.
- p5.js [Docker image](https://github.com/toolness/p5.js-docker) môže byť namontovaný do [Docker](https://www.docker.com/) a použitý na vývoj p5.js bez potreby manuálnej inštalácie požiadaviek ako [Node](https://nodejs.org/) alebo iných, takých, ktoré ovlyvňujú hosťovský operačný systém (s výnimkou inštalácie Docker-a).
- Budovací proces knižnice p5.js generuje [json dátové súbory](https://p5js.org/reference/data.json), ktoré obsahujú verejné API p5.js a môžu byť použité v automatizovanom náradí, ako napríklad automatické dopĺňanie p5.js metód v editor-e. Tento súbor je dostupný na stránke p5.js, no nie je súčasťou tohto repozitára.

