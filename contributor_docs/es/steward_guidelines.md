# Directrices para Administradores


Ya sea que recién te hayas unido a nosotros como administrador, seas un mantenedor experimentado de p5.js, o estés en algún punto intermedio, esta guía contiene información, así como consejos y trucos que te ayudarán a contribuir de manera efectiva a p5.js. La mayor parte de lo que se escribe aquí son pautas, a menos que se indique lo contrario, lo que significa que puedes adaptar las prácticas mostradas aquí para que se ajusten a tu flujo de trabajo.

## Tabla de Contenidos

- [Issues](steward_guidelines.md#issues)
  - [Bug report](steward_guidelines.md#bug-report)
  - [Feature request](steward_guidelines.md#feature-request)
  - [Feature enhancement](steward_guidelines.md#feature-enhancement)
  - [Discussion](steward_guidelines.md#discussion)
- [Pull Requests](steward_guidelines.md#pull-requests)
  - [Simple fix](steward_guidelines.md#simple-fix)
  - [Bug fix](steward_guidelines.md#bug-fix)
  - [New feature/feature enhancement](steward_guidelines.md#new-feature-feature-enhancement)
  - [Dependabot](steward_guidelines.md#dependabot)
- [Build Process](steward_guidelines.md#build-process)
  - [Main build task](steward_guidelines.md#main-build-task)
  - [Miscellaneous tasks](steward_guidelines.md#miscellaneous-tasks)
- [Release Process](steward_guidelines.md#release-process)
- [Tips & Tricks](steward_guidelines.md#tips--tricks)
  - [Reply templates](steward_guidelines.md#reply-templates)
  - [GitHub CLI](steward_guidelines.md#github-cli)
  - [Managing notifications](steward_guidelines.md#managing-notifications)

---


## Issues

Alentamos a la mayoría de las contribuciones de código fuente a comenzar con un problema, y como tal, los issues son el lugar donde la mayoría de las discusiones tendrán lugar. Los pasos a seguir al revisar un problema dependerán del tipo de problema que sea. El repositorio utiliza [GitHub issue templates] (https://github.com/processing/p5.js/blob/main/.github/ISSUE_TEMPLATE) para organizar mejor los diferentes tipos de problemas y alentar a los autores de problemas a proporcionar toda la información relevante sobre sus problemas. El primer paso al revisar el issue a menudo será revisar la plantilla completada y determinar si necesita información adicional por ejemplo, porque algunos campos no se completaron o se utilizó la plantilla incorrecta.


### Reporte/informe de errores (Bug report)

Los informes de errores de issues (Bug report issues)  deberían utilizar la plantilla de problema(issue template) "Found a bug". El siguiente flujo de trabajo es típico para abordar los informes de errores:

1. Replicar el error
   - El objetivo de la plantilla es proporcionar suficiente información para que un revisor intente replicar el error en cuestión.
   - Si el error reportado no es relevante para el repositorio en el que se abrió (p5.js, p5.js-website, u otro):
     - Transfiera el problema al repositorio relevante si tiene acceso a él.
     - De lo contrario, deje un comentario sobre dónde debería presentarse el informe de error (con un enlace directo proporcionado) y cierre el problema.
   - El primer paso para revisar un informe de error es verificar si se proporciona suficiente información para replicar el error, y si es así, intentar replicar el error según lo descrito.
2. Si el error se puede replicar:
   - Puede ser necesario realizar alguna discusión para determinar la mejor manera de solucionar un error particular. Puede ser necesario realizar alguna discusión para determinar la mejor manera de solucionar un error particular. A veces, puede ser directo; otras veces, puede ser complicado. Por favor, consulte los principios de diseño de p5.js [p5.js' design principles](design_principles.md) al tomar esta decisión caso por caso.
   - Si el autor del issue indicó en el issue que está dispuesto a contribuir con una solución:
     - Apruebe el problema para su solución por parte del autor del problema dejando un comentario y asignándoles el problema. Utilice el botón de engranaje en el lado derecho junto a "Asignado a" "Assignee".
   - Si el autor del problema no desea contribuir con una solución:
     - Deje un comentario reconociendo que el error se puede replicar.
     - Intente solucionarlo usted mismo o agregue la etiqueta `help wanted` para señalar que es un issue que  necesita solución.
3. Si el error no se puede replicar:
   - Solicite información adicional si aún no se ha proporcionado en la plantilla (versión de p5.js, versión del navegador, versión del sistema operativo, etc.)(p5.js version, browser version, OS version, etc.).
   - Si su entorno de prueba difiere de lo que se informa en el problema(issue) (por ejemplo, un navegador o sistema operativo diferente)(e.g., a different browser or OS):
     - Deje un comentario diciendo que no puede replicar en su entorno específico.
     - Agregue una etiqueta `help wanted` al problema(issue) y pida a alguien más con la configuración especificada en el problema que intente replicar el error.
   - Sometimes, bugs only occur when using the web editor and not when testing locally. In this case, the issue should be redirected to the 
   - A veces, los errores solo ocurren al usar el editor web (web editor) y no al probar localmente. En este caso, el problema debería ser redirigido al repositorio del editor web [web editor repo](https://github.com/processing/p5.js-web-editor).
   - Si la replicación es posible más tarde, regrese al paso 2.
4. Si el error se origina en el código que el usuario proporcionó en el informe de error y no en el comportamiento de p5.js:
   - Determine si la documentación de p5.js, la implementación de código o el sistema de errores amigable pueden mejorarse para evitar que se cometa el mismo error.
   - Redirija amablemente cualquier pregunta adicional al foro [forum](https://discourse.processing.org/)  o al Discord [Discord](https://discord.com/invite/SHQ8dH25r9) y cierre el issue si no se van a realizar más cambios en p5.js.
   


### Solicitud de función (Feature request)

Los issues/problemas de solicitudes de función (Feature request issues) deberían utilizar la plantilla de problema(issue) "Nueva Solicitud de Función" ("New Feature Request") . El siguiente flujo de trabajo es típico para abordar las solicitudes de función:"

1. Como parte del compromiso de p5.js de aumentar el acceso, una solicitud de función(feature request) debe justificar cómo aumenta el acceso de p5.js a comunidades que históricamente han sido marginadas en el campo. Más detalles están disponibles aquí[here](access.md).
   - If a feature request does not have the "Increasing Access" field sufficiently filled out, you can ask the issue author how the feature increases access.
   - Si una solicitud de función(feature request) no tiene suficientemente completado el campo "Aumento de Acceso"("Increasing Access"), puedes preguntar al autor del problema(issue autor) cómo la función(feature) aumenta el acceso.
   - La declaración de acceso de una función puede ser proporcionada por un miembro diferente de la comunidad, incluidos los revisores de problemas(issue reviewers).
1. La nueva solicitud de función puede ser evaluada para su inclusión en base a los siguientes criterios:
   - ¿La función(feature) encaja en el alcance del proyecto y los principios de diseño [design principles](design_principles.md) de p5.js?
     - Por ejemplo, una solicitud para agregar una nueva forma primitiva de dibujo puede ser considerada, pero una solicitud para adoptar un protocolo de Internet de las cosas basado en el navegador (browser-based IOT protocol) probablemente estará fuera de alcance.
     - En general, el alcance de p5.js debería ser relativamente estrecho para evitar un exceso de características poco utilizadas.
     - Si una función no encaja en el alcance de p5.js, sugiere al autor del problema(issue) que implemente la función(feature) como una biblioteca complementaria(addon library).
     - Si no está claro si encaja o no, puede ser una buena idea sugerir hacer una biblioteca complementaria(addon library)como una prueba de concepto(proof-of-concept).Esto ayuda a dar a los usuarios una forma de usar la función(feature), proporciona un ejemplo mucho más concreto de su uso e importancia, y no necesariamente necesita ser una solución tan completa como una función completamente integrada. Puede integrarse en el núcleo(the core) de p5.js más adelante si corresponde. 
   - ¿Es probable que la función(feature) propuesta cause un cambio incompatible?
     - ¿Entrará en conflicto con las funciones y variables existentes de p5.js?
     - ¿Entrará en conflicto con los bocetos típicos(typical sketches) ya escritos para p5.js?
     - Las funciones que probablemente causen conflictos, como las mencionadas anteriormente, se consideran cambios incompatibles(breaking changes). Sin un lanzamiento de versión mayor a [major version release](https://docs.npmjs.com/about-semantic-versioning), no deberíamos realizar cambios incompatibles en p5.js.
   - ¿Se puede lograr la nueva función propuesta utilizando las funcionalidades existentes ya en p5.js, código JavaScript nativo relativamente simple, o bibliotecas existentes fáciles de usar(existing easy-to-use libraries)?
     - Por ejemplo, en lugar de proporcionar una función de p5.js para unir una matriz de cadenas (array of strings) como `join(["Hello", "world!"])`, debería preferirse el JavaScript nativo  `["Hello", "world!"].join()`.
2. Si el requisito de acceso y otras consideraciones han sido cumplidas, al menos dos administradores o mantenedores deben aprobar la nueva solicitud de función(feature request) antes de que comience el trabajo hacia una PR. El proceso de revisión de PR para nuevas funciones está documentado a continuación.


### Mejora de función (Feature enhancement)

Las solicitudes(issues) de mejora de función deberían utilizar la plantilla de problema(issue template) "Mejora de Función Existente"("Existing Feature Enhancement"). El proceso es muy similar a las solicitudes de nuevas funciones. La diferencia entre una solicitud de nueva función(new feature request) y una mejora de función puede ser confusa a veces. La mejora de función principalmente trata sobre las funciones existentes de p5.js, mientras que una solicitud de nueva función podría estar solicitando la adición de funciones completamente nuevas.

1. Similar a las solicitudes de nuevas funciones(new feature), las mejoras de función(feature enhancement) solo deben ser aceptadas si aumentan el acceso a p5.js. Por favor, consulta el punto 1 de la sección anterior[section above](steward_guidelines.md#feature-request).
2. Los criterios de inclusión para las mejoras de función son similares a los de las solicitudes de nuevas funciones, pero se debe prestar especial atención a los posibles cambios incompatibles.
   - Si se están modificando funciones existentes, todas las firmas de funciones válidas y documentadas previamente deben comportarse de la misma manera.
3. Las mejoras de funciones deben ser aprobadas por al menos un administrador o mantenedor antes de que comience el trabajo hacia una PR (solicitud de extracción). El proceso de revisión de PR para mejoras de funciones está documentado a continuación.


### Discusión

Este tipo de problema tiene una plantilla(template) mínima ("Discusión") y debería ser utilizada para recopilar comentarios(retroalimentaciones/feedback) sobre un tema en general antes de consolidarlo en algo más específico, como una solicitud de función(feature request). Estos problemas(issues) de discusión pueden cerrarse cuando finaliza la conversación y se han creado los problemas más específicos resultantes:

- Si se abre un issue como una discusión pero debería ser, por ejemplo, un informe de error(bug report), se debe aplicar la etiqueta correcta y quitar la etiqueta de "discusión". Además, se debe solicitar información adicional sobre el error al autor si aún no se ha incluido.
- Si se abre un problema como una discusión pero no es relevante para la contribución de código fuente o de otra manera relevante para los repositorios de GitHub/el proceso de contribución/la comunidad de contribución, deberían ser redirigidos al foro o a Discord y el problema cerrado.
- Si es relevante, se deben agregar etiquetas adicionales a los issues de discusión para señalar aún más qué tipo de discusión es con solo mirarla.

---


## Pull Requests

Casi todas las contribuciones de código a los repositorios de p5.js se realizan a través de solicitudes de extracción(Pull Request). Los administradores y mantenedores pueden tener acceso de escritura(push access) a los repositorios, pero aún se les anima a seguir el mismo proceso de issue > PR > proceso de revisión al contribuir con código. Aquí están los pasos para revisar una PR:

- La plantilla de solicitud de extracción(pull request template) se puede encontrar [here](https://github.com/processing/p5.js/blob/main/.github/PULL_REQUEST_TEMPLATE.md).
- Casi todas las solicitudes de extracción(pull requests ) deben tener problemas asociados abiertos y discutidos primero, lo que significa que los relevantes [issue workflow](steward_guidelines.md#issues) deben haber sido seguidos primero antes de que una PR sea revisada por cualquier administrador o mantenedor.
  - Las únicas instancias donde esto no se aplica son correcciones muy menores de errores tipográficos(minor typo fixes), las cuales no requieren un problema abierto y pueden ser fusionadas(merged) por cualquier persona con acceso para fusionar(merge access) al repositorio, incluso si no son administradores de una área en particular.
  - Si bien esta excepción existe, la aplicaremos en la práctica solo mientras se siga alentando a los contribuyentes a abrir nuevos problemas primero. En otras palabras, si tienes dudas sobre si esta excepción se aplica, simplemente abre un issue de todos modos.
- Si una solicitud de extracción (pull request) no resuelve completamente el issue referenciado, puedes editar la publicación original y cambiar "Resolves #OOOO" a "Addresses #OOOO" para que no cierre automáticamente el problema original cuando la PR se fusione(merge).


### Solución sencilla (Simple fix)

Las correcciones simples(simple fix), como la corrección de un pequeño error tipográfico, pueden fusionarse(merge) directamente por cualquier persona con acceso para fusionar(aplicar merge). Verifica en la pestaña "Files Changed" de la PR para asegurarte de que la prueba automatizada de integración continua (CI) pase.

![The "files changed" tab when viewing a pull request on GitHub](images/files-changed.png)

![The "All checks have passed" indicator on a GitHub pull request, highlighted above the merge button](images/all-checks-passed.png)


### Corrección de error (Bug fix) Seguir desde aqui.

1. Bug fixes deberían ser revisado por el administrador del área relevante, idealmente el mismo que aprobó el issue referenciado para su corrección.
2. La pestaña "Files Changed" de la PR se puede utilizar para revisar inicialmente si la corrección (el fix)se implementa según lo descrito en la discusión del issue.
3. El PR Debería ser probado localmente siempre que sea posible y relevante. El GitHub CLI puede ayudar a agilizar parte del proceso. (Ver más abajo en [Tips & Tricks](steward_guidelines.md#tips-tricks)).
   - [ ] El fix debe abordar suficientemente el problema original.
   - [ ] El fix no debe cambiar ningún comportamiento existente a menos que se acuerde en el problema original.
   - [ ] El fix no debe tener un impacto significativo en el rendimiento de p5.js.
   - [ ] El fix no debe tener ningún impacto en la accesibilidad de p5.js.
   - [ ] El fix debe utilizar el estándar moderno de codificación en JavaScript.
   - [ ] El fix debe pasar todas las pruebas automatizadas e incluir nuevas pruebas(tests) si son relevantes.
4. Si se requieren cambios adicionales, se deben agregar comentarios en línea a las líneas relevantes según se describió anteriormente [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request).
   - Un bloque de sugerencias también puede ser usado para sugerir cambios específicos:\
     ![The Suggest Change button while writing a comment on code in a GitHub pull request](images/suggest-change.png)\
     ![A suggested change appearing within code fences with the "suggestion" tag](images/suggested-value-change.png)\
     ![A suggested change previewed as a diff](images/suggestion-preview.png)
   - Si se requieren múltiples cambios, no agregues comentarios de una sola línea muchas veces. En su lugar, sigue el procedimiento documentado [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) para hacer comentarios de varias líneas y una sola solicitud de cambios (change request).
   - Si los comentarios en línea son solo para aclaraciones o discusión, elige "Comment" en lugar de "Request changes":\
     ![The "comment" option circled within the GitHub Finish Review menu](images/comment-review.png)
5. Una vez que la PR haya sido revisada y no se requieran cambios adicionales, un administrador puede marcar la PR como "Approved" eligiendo la opción "Approve" en el paso anterior, con o sin comentarios adicionales. El administrador puede luego solicitar una revisión adicional por otro administrador o mantenedor si lo desea, fusionar(merge) la PR si tiene acceso para fusionar(merge access), o solicitar una fusión (request/solicitar merge) de un mantenedor.
6. @[all-contributors](https://allcontributors.org/docs/en/emoji-key)El bot debería ser llamado para agregar cualquier nuevo colaborador a la lista de colaboradores en el archivo README.md. Cada tipo de contribución puede ser indicado en lugar de `[contribution` `type]` a continuación, se puede encontrar la lista completa de tipos de contribuciones disponibles en el enlace anterior.

`@all-contributors` `please` `add` `@[GitHub` `handle]` `for` `[contribution` `type]`


### Nueva función/mejora de función (New feature/feature enhancement()

El proceso para una nueva función o mejora de función en una PR es similar a la de correcciones de errores(bug fixes) con una diferencia notable:

- Una PR de nueva función(new feature) o mejora de función(feature enhancement) debe ser revisada y aprobada por al menos dos administradores o mantenedores antes de que pueda fusionarse (be merged).


### Dependabot

Las PRs de Dependabot generalmente solo son visibles para los administradores del repositorio, así que si esto no aplica a ti, por favor omite esta sección.

- Las PRs de Dependabot pueden fusionarse(be merged) directamente si la actualización de la versión es una [semver](https://semver.org/) versión de parche( patch version) y la prueba automatizada de CI(CI test ) ha pasado.
- Las PRs de Dependabot con cambios de versión semver menor generalmente se pueden fusionar directamente siempre y cuando la prueba automatizada de CI pase. Se recomienda hacer una rápida verificación en el registro de cambios(changelog ) de la dependencia actualizada.
- Las PRs de Dependabot con cambios de versión semver mayor probablemente afectarán el proceso de compilación o las funcionalidades de p5.js. En este caso, se anima al revisor a revisar el registro de cambios desde la versión actual hasta la versión objetivo, si es posible, y probar la PR localmente para asegurarse de que todos los procesos estén funcionando y realizar los cambios necesarios debido a posibles cambios que puedan romper las dependencias.
  - Muchas dependencias aumentan los números de versión principales solo porque dejan de admitir versiones muy antiguas de Node.js. En muchos casos, los cambios de versión principales no necesariamente significan cambios que rompan debido a cambios en la API de la dependencia.

---


## Build process

This section will not cover the general build setup nor commands but rather details about what's happening behind the scenes. Please see the [contributor’s guidelines](contributor_guidelines.md#working-on-p5js-codebase) for more detailed build info.

The Gruntfile.js file contains the main build definitions for p5.js. Among the different tools used to build the library and documentation includes but not limited to Grunt, Browserify, YUIDoc, ESLint, Babel, Uglify, and Mocha. It may be helpful for us to start with the `default` task and work backward from there. It may be helpful at this point to open up the Gruntfile.js document while going through the explainer below.


### Main build task

```
grunt.registerTask('default', ['lint', 'test']);
```

When we run `grunt` or the npm script `npm test`, we run the default task consisting of `lint` then `test`.


#### `lint` Task

```
grunt.registerTask('lint', ['lint:source', 'lint:samples']);
```

The `lint` task consists of two sub tasks: `lint:source` and `lint:samples`. `lint:source` is further subdivided into three more sub tasks `eslint:build`, `eslint:source`, and `eslint:test`, which uses ESLint to check the build scripts, the source code, and the test scripts.

The `lint:samples` task will first run the `yui` task which itself consists of `yuidoc:prod`, `clean:reference`, and `minjson`, which extract the documentation from the source code into a JSON document, remove unused files from the previous step, and minify the generated JSON file into `data.min.json` respectively.

Next in `lint:samples` is `eslint-samples:source`, which is a custom written task whose definition is in [./tasks/build/eslint-samples.js](tasks/build/eslint-samples.js); it will run ESLint to check the documentation example code to make sure they follow the same coding convention as the rest of p5.js (`yui` is run first here because we need the JSON file to be built first before we can lint the examples).


#### `test` Task

```js
grunt.registerTask('test', [
  'build',
  'connect:server',
  'mochaChrome',
  'mochaTest',
  'nyc:report'
]);
```

First let's look at the `build` task under `test`.

```js
grunt.registerTask('build', [
  'browserify',
  'browserify:min',
  'uglify',
  'browserify:test'
]);
```

Tasks that start with `browserify` are defined in [./tasks/build/browserify.js](tasks/build/browserify.js). They all  similar steps with minor differences. These are the main steps to build the full p5.js library from its many source code files into one:

- `browserify` builds p5.js while `browserify:min` builds an intermediate file to be minified in the next step. The difference between `browserify` and `browserify:min` is that `browserify:min` does not contain data needed for FES to function.
- `uglify` takes the output file of `browserify:min` and minify it into the final p5.min.js (configuration of this step is in the main Gruntfile.js).
- `browserify:test` is building a version identical to the full p5.js except for added code that is used for test code coverage reporting (using [Istanbul](https://istanbul.js.org/)).

First, use of the `fs.readFileSync()` node.js specific code is replaced with the file's actual content using `brfs-babel`. This is used mainly by WebGL code to inline shader code from source code written as separate files.

Next, the source code, including all dependencies from node\_modules, is transpiled using Babel to match the [Browserslist](https://browsersl.ist/) requirement defined in package.json as well as to make the ES6 import statements into CommonJS `require()` that browserify understands. This also enables us to use newer syntax available in ES6 and beyond without worrying about browser compatibility.

After bundling but before the bundled code is written to file, the code is passed through `pretty-fast`, if it is not meant to be minified, it should be cleaned up so the final formatting is a bit more consistent (we anticipate the p5.js source code can be read and inspected if desired).

A few small detailed steps are left out here; you can check out the browserify build definition file linked above to have a closer look at everything.

```
connect:server
```

This step spins up a local server hosting the test files and built source code files so that automated tests can be run in Chrome.

```
mochaChrome
```

This step is defined in [./tasks/test/mocha-chrome.js](tasks/test/mocha-chrome.js). It uses Puppeteer to spin up a headless version of Chrome that can be remote controlled and runs the tests associated with the HTML files in the `./test` folder, which includes testing the unminified and minified version of the library against the unit test suites as well as testing all reference examples.

```
mochaTest
```

This step differs from `mochaChrome` in that it is run in node.js instead of in Chrome and only tests a small subset of features in the library. Most features in p5.js will require a browser environment, so this set of tests should only be expanded if the new tests really don't need a browser environment.

```
nyc:report
```

Finally, after all builds and tests are complete, this step will gather the test coverage report while `mochaChrome` was testing the full version of the library and print the test coverage data to the console. Test coverage for p5.js is mainly for monitoring and having some additional data points; having 100% test coverage is not a goal.

And that covers the default task in the Gruntfile.js configuration!


### Miscellaneous tasks

All of the steps can be run directly with `npx grunt [step]`. There are also a few tasks that are not covered above but could be useful in certain cases.

```
grunt yui:dev
```

This task will run the documentation and library builds described above, followed by spinning up a web server that serves a functionally similar version of the reference page you will find on the website on [http://localhost:9001/docs/reference/](http://localhost:9001/docs/reference/). It will then monitor the source code for changes and rebuild the documentation and library.

`grunt` `yui:dev` is useful when you are working on the reference in the inline documentation because you don't have to move built files from the p5.js repository to a local p5.js-website repository and rebuild the website each time you make a change, and you can just preview your changes with this slightly simplified version of the reference in your browser. This way, you can also be more confident that the changes you made are likely to show up correctly on the website. Note that this is only meant for modifications to the inline documentation; changes to the reference page itself, including styling and layout, should be made and tested on the website repository.

```
grunt watch
grunt watch:main
grunt watch:quick
```

The watch tasks will watch a series of files for changes and run associated tasks to build the reference or the library according to what files have changed. These tasks all do the same thing, with the only difference being the scope.

The `watch` task will run all builds and tests similar to running the full default task on detecting changes in the source code.

The `watch:main` task will run the library build and tests but not rebuild the reference on detecting changes in the source code.

The `watch:quick` task will run the library build only on detecting changes in the source code.

Depending on what you are working on, choosing the most minimal watch task here can save you from having to manually run a rebuild whenever you want to make some changes.

---


## Release process

Please see [release\_process.md](release_process.md).

---


## Tips & tricks

Sometimes, the number of issues and PR that require review can get a bit overwhelming.  While we try to put in place processes that make things easier, there are some tips and tricks that you can utilize to help with reviewing issues and PRs.


### Reply templates

A handy GitHub feature that you can use is the [Saved Replies](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies/about-saved-replies) feature, which is available to use when authoring a reply to issues or pull requests. Some of the workflow described above may require responding to issues or PRs with identical or very similar replies (redirecting questions to the forum, accepting an issue for fixing, etc.), and using Saved Replies can just ever so slightly make this more efficient.

Below are some of the Saved Replies that are being used by p5.js maintainers. You can use them yourself or create your own!


##### Closing: Can’t Reproduce

> We're not able to reproduce this, but please feel free to reopen if you can provide a code sample that demonstrates the issue. Thanks!


##### Closing: Need Snippet

> I'm closing this for organizational purposes. Please reopen if you can provide a code snippet that illustrates the issue. Thanks!


##### Closing: Use the Forum

> The GitHub issues here are a good place for bugs and issues with the p5.js library itself. For questions about writing your own code, tests, or following tutorials, the [forum](https://discourse.processing.org/) is the best place to post. Thanks!


##### Closing: GSOC

> Thanks! The best place to discuss GSOC proposals is on our [forum](https://discourse.processing.org/c/summer-of-code).


##### Closing: Access

> I'm not seeing a lot of interest in this feature, and we don't have a clear explanation of how it [expands access](access.md), so I will close this for now. If an access statement can be added to the issue request, please feel welcome to reopen.

> We do not see a further explanation of how this issue [expands access](access.md), so I will close this issue for now. If a more detailed access statement can be added to the feature request, please feel welcome to reopen it. Thank you!


##### Closing: Addon

> I think this function is beyond the scope of the p5.js API (we try to keep it as minimal as possible), but it could be a great starting point for an addon library. See the docs here for how to create an addon: [https://github.com/processing/p5.js/blob/main/contributor\_docs/creating\_libraries.md](creating_libraries.md)


##### Closing PR: Need Issue First

> Thank you. As a reminder, issues need to be opened before pull requests are opened and tagged with the issue. This is necessary for tracking development and keeping discussion clear. Thanks!


##### Approve issue for fixing

> You can go ahead with a fix. Thanks.


##### Merged PR

> Looks good. Thanks!


### GitHub CLI

Reviewing a complex PR can be difficult with complex git commands required to get the PR's version of code locally for you to test. Fortunately, the [GitHub CLI](https://cli.github.com/) tool can help greatly with this process and more.

After installing the CLI and logging in, reviewing a PR locally can be done by running the command `gh pr checkout [pull_request_id]`, and the process of fetching a remote fork, creating a branch, and checking out the branch are all done automatically for you. Going back to the main branch will be the same as switching a branch by running `git checkout main`. You can even leave a comment in the PR from the CLI without needing to visit the webpage at all!

There are many other commands available in the GitHub CLI as well that you may or may not find useful, but it is a good tool to have around in any case.


### Managing notifications

Instead of manually monitoring the "Issues" or "Pull Requests" tabs of the repo for new issues or PRs, you can "watch" the repo by clicking on the "Watch" button with an eye icon on the top of the repo page opposite the repo name.

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](images/github-repo-metrics.png)

By watching a repo, events such as new issues, new pull requests, mentions of your user handle, and other activities you subscribed to on the repo will be sent as notifications to your [notification page](https://github.com/notifications), where they can be marked as read or dismissed much like an email inbox.

In some cases, you may receive emails from GitHub about events in the repo you are watching as well, and you can customize these (including unsubscribing from them completely) from your [notifications settings page](https://github.com/settings/notifications).

Setting these up to fit the way you work can be the difference between having to find relevant issues/PRs to review manually and being overwhelmed by endless notifications from GitHub. A good balance is required here. As a starting suggestion, stewards should watch this repo for "Issues" and "Pull Requests" and set it to only receive emails on "Participating, @mentions and custom."

