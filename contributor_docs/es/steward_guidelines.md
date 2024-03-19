# Directrices para Supervisores  


Ya sea que recién te hayas unido a nosotros como supervisor, seas un responsable de mantenimiento experimentado de p5.js, o estés en algún punto intermedio, esta guía contiene información, así como consejos y trucos que te ayudarán a contribuir de manera efectiva a p5.js. La mayor parte de lo que se escribe aquí son pautas a menos que se indique lo contrario, lo que significa que puedes adaptar las prácticas mostradas aquí para que se ajusten a tu flujo de trabajo.


## Tabla de Contenidos

- [Issues](steward_guidelines.md#issues) 
  - [Informe de Errores](steward_guidelines.md#informe-de-errores) 
  - [Solicitud de Funcionalidades](steward_guidelines.md#solicitud-de-funcionalidades)
  - [Mejora de Funcionalidades](steward_guidelines.md#mejora-de-funcionalidades)
  - [Discusión](steward_guidelines.md#discusión) 
- [Pull Requests](steward_guidelines.md#pull-requests)
  - [Corrección Sencilla](steward_guidelines.md#correción-sencilla)
  - [Corrección de Error](steward_guidelines.md#corrección-de-error) 
  - [Nuevas Funcionalidades/Mejora de Funcionalidades](steward_guidelines.md#nuevas-funcionalidades/Mejora-de-funcionalidades)
  - [Dependabot](steward_guidelines.md#dependabot) 
- [Proceso de Construcción](steward_guidelines.md#proceso-de-construcción)
  - [Tarea Principal de Construcción](steward_guidelines.md#tarea-principal-de-construcción)
  - [Tarea Variada](steward_guidelines.md#tarea-variada)
- [Proceso de Lanzamiento](steward_guidelines.md#proceso-de-lanzamiento)
- [Consejos y Trucos](steward_guidelines.md#consejos-y-trucos)
  - [Plantillas de Respuesta](steward_guidelines.md#plantillas-de-respuesta)
  - [GitHub CLI](steward_guidelines.md#github-cli)
  - [Gestión de Notificaciones](steward_guidelines.md#gestión-de-notificaciones)

---


## _Issues_

Alentamos a la mayoría de las contribuciones de código fuente a comenzar con un _issue_, y como tal, los _issues_ son el lugar donde la mayoría de las discusiones tendrán lugar. Los pasos a seguir al revisar un _issue_ dependerán del tipo de _issue_ que sea. El repositorio utiliza [Plantillas de _issues_ de GitHub](https://github.com/processing/p5.js/blob/main/.github/ISSUE_TEMPLATE), para organizar mejor los diferentes tipos de _issues_ y alentar a los autores de _issues_ a proporcionar toda la información relevante sobre sus _issues_. El primer paso al revisar el _issue_ a menudo será revisar la plantilla completada y determinar si necesita información adicional por ejemplo, porque algunos campos no se completaron o se utilizó la plantilla incorrecta.


### Informe de Errores

Los _issues_ de informes de errores deberían utilizar la plantilla de _Issue_ "Found a bug". El siguiente flujo de trabajo es típico para abordar los informes de errores:

1. Replicar el error
   - El objetivo de la plantilla es proporcionar suficiente información para que un revisor intente replicar el error en cuestión.
   - Si el error reportado no es relevante para el repositorio en el que se abrió (p5.js, p5.js-website, u otro):
     - Transfiera el _issue_ al repositorio relevante si tiene acceso a él.
     - De lo contrario, deje un comentario sobre dónde debería presentarse el informe de error (con un enlace directo proporcionado) y cierre el _issue_.
   - El primer paso para revisar un informe de error es verificar si se proporciona suficiente información para replicar el error, y si es así, se debe intentar replicar el error según lo descrito.
2. Si el error se puede replicar:
   - Puede ser necesario realizar alguna discusión para determinar la mejor manera de solucionar un error particular. Puede ser necesario realizar alguna discusión para determinar la mejor manera de solucionar un error particular. A veces, puede ser directo;otras veces, puede ser complicado. Por favor, consulte los [principios de diseño de p5.js](design_principles.md) al tomar esta decisión caso por caso.
   - Si el autor del _issue_ indicó en el _issue_ que está dispuesto a contribuir con una solución:
     - Apruebe el _issue_ para su solución por parte del autor del _issue_ dejando un comentario y asignándoles el _issue_. Utilice el botón de engranaje en el lado derecho junto a "Assignee".
   - Si el autor del _issue_ no desea contribuir con una solución:
     - Deje un comentario reconociendo que el error se puede replicar.
     - Intente solucionarlo usted mismo o agregue la etiqueta `help wanted` para señalar que es un _issue_ que necesita solución.
3. Si el error no se puede replicar:
   - Solicite información adicional si aún no se ha proporcionado en la plantilla (versión de p5.js, versión del navegador, versión del sistema operativo, etc).
   - Si su entorno de prueba difiere de lo que se informa en el _issue_ (por ejemplo,un navegador o sistema operativo diferente):
     - Deje un comentario diciendo que no puede replicar en su entorno específico.
     - Agregue una etiqueta `help wanted` al _issue_ incidente y pida a alguien más con la configuración especificada en el _issue_ que intente replicar el error.
   - A veces, los _bugs_ (errores) solo ocurren al usar el editor web y no al probar localmente. En este caso, el _issue_ debería ser redirigido al [repositorio del editor web](https://github.com/processing/p5.js-web-editor).
   - Si la replicación es posible más tarde, regrese al paso 2.
1. Si el error se origina en el código que el usuario proporcionó en el informe de error y no en el comportamiento de p5.js:
   - Determine si la documentación de p5.js, la implementación de código o el sistema de errores amigable pueden mejorarse para evitar que se cometa el mismo error.
   - Redirija amablemente cualquier pregunta adicional al [foro](https://discourse.processing.org/) o al [Discord](https://discord.com/invite/SHQ8dH25r9) y cierre el _issue_ si no se van a realizar más cambios en p5.js.
   

### Solicitud de Funcionalidades

Los _issues_ para solicitar funcionalidades deberían utilizar la plantilla "New Feature Request". El siguiente flujo de trabajo es típico para abordar las solicitudes de función:

1. Como parte del compromiso de p5.js de aumentar el acceso, una solicitud de función debe justificar cómo aumenta el acceso de p5.js a comunidades que históricamente han sido marginadas en el campo. Más detalles están disponibles [aquí](access.md).
   - Si una solicitud de funcionalidad no tiene suficientemente completado el campo "Increasing Access" ("Aumento de Acceso"), puedes preguntar al autor del _issue_ cómo la funcionalidad aumenta el acceso.
   - La declaración de acceso de una funcionalidad puede ser proporcionada por un miembro diferente de la comunidad, incluidos los revisores de _issue_.
2. Una nueva solicitud de funcionalidad puede ser evaluada para su inclusión en base a los siguientes criterios:
   - ¿La función encaja en el alcance del proyecto y los principios de diseño [principios de diseño](design_principles.md) de p5.js?
     - Por ejemplo, una solicitud para agregar una nueva forma primitiva de dibujo puede ser considerada, pero una solicitud para adoptar un protocolo de Internet de las cosas basado en el navegador probablemente estará fuera de alcance.
     - En general, el alcance de p5.js debería ser relativamente estrecho para evitar un exceso de características poco utilizadas.
     - Si una función no encaja en el alcance de p5.js, sugiere al autor del _issue_ que implemente la función como una biblioteca complementaria.
     - Si no está claro si encaja o no, puede ser una buena idea sugerir hacer una biblioteca complementaria como una prueba de concepto. Esto ayuda a dar a los usuarios una forma de usar la funcionalidad, proporciona un ejemplo mucho más concreto de su uso e importancia, y no necesariamente necesita ser una solución tan completa como una función completamente integrada. Puede integrarse en el núcleo de p5.js más adelante si corresponde. 
   - ¿Es probable que la funcionalidad propuesta cause un cambio incompatible?
     - ¿Entrará en conflicto con las funcionalidades y variables existentes de p5.js?
     - ¿Entrará en conflicto con los _sketches_ (bocetos) típicos ya escritos para p5.js?
     - Las funcionalidades que probablemente causen conflictos, como las mencionadas anteriormente, se consideran cambios incompatibles. Sin un [Lanzamiento de versión mayor](https://docs.npmjs.com/about-semantic-versioning),no deberíamos realizar cambios incompatibles en p5.js.
   - ¿Se puede lograr la nueva función propuesta utilizando las funcionalidades existentes ya en p5.js,código JavaScript nativo relativamente simple, o bibliotecas existentes fáciles de usar?
     - Por ejemplo, en lugar de proporcionar una función de p5.js para unir una matriz de cadenas como `join(["Hello","world!"])`, debería preferirse el JavaScript nativo `["Hello","world!"].join()`.
3. Si el requisito de acceso y otras consideraciones han sido cumplidas, al menos dos supervisores o responsables de mantenimiento deben aprobar la nueva solicitud de función antes de que comience el trabajo hacia una PR. El proceso de revisión de _pull request_ para nuevas funcionalidades está documentado a continuación.


### Mejora de funcionalidades

Las solicitudes de _issues_ de mejora de función deberían utilizar la plantilla de incidentes de "Existing Feature Enhancement" (Mejora de Funcionalidades Existentes). El proceso es muy similar a las solicitudes de nuevas funcionalidades. La diferencia entre una _new feature request_ (solicitud de nueva funcionalidad) y una _feature request_ (Mejora de Funcionalidad) puede ser confusa a veces. La mejora de función principalmente trata sobre las funcionalidades existentes de p5.js, mientras que una solicitud de nueva función podría estar solicitando la adición de funcionalidades completamente nuevas.

1. Similar a las solicitudes de nuevas funcionalidades, las mejoras de función solo deben ser aceptadas si aumentan el acceso a p5.js. Por favor, consulta el punto 1 de la [sección anterior](steward_guidelines.md#feature-request).
2. Los criterios de inclusión para las mejoras de función son similares a los de las solicitudes de nuevas funcionalidades, pero se debe prestar especial atención a los posibles cambios incompatibles.
   - Si se están modificando funcionalidades existentes, todas las firmas de funcionalidades válidas y documentadas previamente deben comportarse de la misma manera.
3. Las mejoras de funcionalidades deben ser aprobadas por al menos un supervisor o responsable de mantenimiento antes de que comience el trabajo hacia una _pull request_. El proceso de revisión de _pull request_ para mejoras de funcionalidades está documentado a continuación.


### Discusión

Este tipo de _issue_ tiene una plantilla mínima de discusión y debería ser utilizada para recopilar comentarios y retroalimentaciones sobre un tema en general antes de consolidarlo en algo más específico, como una solicitud de función. Estos _issues_ de discusión pueden cerrarse cuando finaliza la conversación y se han creado los _issues_ más específicos resultantes:

- Si se abre un _issue_ como una discusión pero debería ser, por ejemplo, un _bug report_ (informe de error), se debe aplicar la etiqueta correcta y quitar la etiqueta de "discussión". Además, se debe solicitar información adicional sobre el error al autor si aún no se ha incluido.
- Si se abre un _issue_ como una discusión pero no es relevante para la contribución de código fuente o de otra manera relevante para los repositorios de GitHub, el proceso de contribución o la comunidad de contribución, deberían ser redirigidos al foro o a Discord y el _issue_ cerrado.
- Si es relevante, se deben agregar etiquetas adicionales a los _issues_ de discusión para señalar aún más qué tipo de discusión es con solo mirarla.

---


## _Pull Requests_

Casi todas las contribuciones de código a los repositorios de p5.js se realizan a través de Pull Request. Los supervisores y los responsables de mantenimiento pueden tener _push access_ (acceso de escritura) a los repositorios, pero aún se les anima a seguir el mismo proceso de _issue_ > _pull request_ > proceso de revisión al contribuir con código. Aquí están los pasos para revisar una _pull request_:

- La plantilla de pull request se puede encontrar [Aquî](https://github.com/processing/p5.js/blob/main/.github/PULL_REQUEST_TEMPLATE.md).
- Casi todas las solicitudes de pull requests deben tener _issues_ asociados abiertos y discutidos primero, lo que significa que los["flujos de trabajo de los _issues_ mås relevantes ](steward_guidelines.md#issues) deben haber sido seguidos primero antes de que una _pull request_ sea revisada por cualquier supervisor o responsable de mantenimiento.
  - Las únicas instancias donde esto no se aplica son correcciones muy menores de errores tipográficos, las cuales no requieren un _issue_ abierto y pueden ser fusionadas por cualquier persona con acceso para aplicar _merge_ (fusionar) al repositorio, incluso si no son supervisores de una área en particular.
  - Si bien esta excepción existe, la aplicaremos en la práctica solo mientras se siga alentando a los contribuyentes a abrir nuevos _issues_ primero. En otras palabras, si tienes dudas sobre si esta excepción se aplica, simplemente abre un _issue_ de todos modos.
- Si una "pull request"no resuelve completamente el _issue_ referenciado, puedes editar la publicación original y cambiar "Resolves #OOOO" a "Addresses #OOOO" para que no cierre automáticamente el _issue_ original cuando la _pull request_ aplique _merge_ (se fusione).


### Correción Sencilla

Correcciones simples, como la corrección de un pequeño error tipográfico, pueden fusionarse directamente por cualquier persona con acceso para fusionar. Después, revisa la pestaña "Files Changed" de _pull request_ para asegurarte de que la prueba automatizada de integración continua (CI) haya pasado.

![The "files changed" tab when viewing a pull request on GitHub](../images/files-changed.png)
![The "All checks have passed" indicator on a GitHub pull request, highlighted above the merge button](../images/all-checks-passed.png)


### Corrección de Error

1. _Bug fixes_ (Corrección de errores) deberían ser revisado por el supervisor del área relevante, idealmente el mismo que aprobó el _issue_ referenciado para su corrección.
2. La pestaña "Files Changed" de la _pull request_ se puede utilizar para revisar inicialmente si el _fix_ (la ccorrección) se implementa según lo descrito en la discusión del _issue_.
3. La _pull request_ Debería ser probada localmente siempre que sea posible y relevante. El GitHub CLI puede ayudar a agilizar parte del proceso. Ver más abajo en [Consejos y trucos](steward_guidelines.md#tips-tricks).
   - [ ] La Corrección debe abordar suficientemente el _issue_ original.
   - [ ] La Corrección no debe cambiar ningún comportamiento existente a menos que se acuerde en el _issue_ original.
   - [ ] La Corrección no debe tener un impacto significativo en el rendimiento de p5.js.
   - [ ] La Corrección no debe tener ningún impacto en la accesibilidad de p5.js.
   - [ ] La Corrección debe utilizar el estándar moderno de codificación en JavaScript.
   - [ ] La Corrección debe pasar todas las pruebas automatizadas e incluir nuevas pruebas (tests) si son relevantes.
4. Si se requieren cambios adicionales, se deben agregar comentarios en línea a las líneas relevantes según se describió anteriormente [aquí](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request).
   - Un bloque de sugerencias también puede ser usado para sugerir cambios específicos:\
     ![The Suggest Change button while writing a comment on code in a GitHub pull request](../images/suggest-change.png)\
     ![A suggested change appearing within code fences with the "suggestion" tag](../images/suggested-value-change.png)\
     ![A suggested change previewed as a diff](../images/suggestion-preview.png)
   - Si se requieren múltiples cambios, no agregues comentarios de una sola línea muchas veces. En su lugar, sigue el procedimiento documentado [aquí](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) para hacer comentarios de varias líneas y una sola solicitud de cambios (change request).
   - Si los comentarios en línea son solo para aclaraciones o discusión, elige "Comment" en lugar de "Request changes":\
     ![The "comment" option circled within the GitHub Finish Review menu](../images/comment-review.png)
5. Una vez que la _pull request_ haya sido revisada y no se requieran cambios adicionales, un supervisor puede marcar la _pull request_ como "Aprobada" eligiendo la opción "Approve" en el paso anterior, con o sin comentarios adicionales. El supervisor puede luego solicitar una revisión adicional por otro supervisor o responsable de mantenimiento si lo desea, fusionar la _pull request_ si tiene acceso para fusionar (merge access), o solicitar _merge_ (fusión) de un responsable de mantenimiento.
6. El bot @[all-contributors](https://allcontributors.org/docs/en/emoji-key) debería ser llamado para agregar cualquier nuevo colaborador a la lista de colaboradores en el archivo README.md. Cada tipo de contribución puede ser indicado en lugar de `[contribution` `type]` a continuación, se puede encontrar la lista completa de tipos de contribuciones disponibles en el enlace anterior.

`@all-contributors` `please` `add` `@[GitHub` `handle]` `for` `[contribution` `type]`


### Nuevas funcionalidades/Mejora de Funcionalidades

El proceso para una _pull request_ de _new feature_ (nuevas funcionalidades),o _feature_enhacement_ (mejora de funcionalidades) es similar a las correcciones de errores,pero solo con una diferencia notable:

- Una _pull request_ de nueva funcionalidad o mejora de funcionalidad debe ser revisada y aprobada por al menos dos supervisores o responsables de mantenimiento antes de que pueda ser fusionada.


### Dependabot

Las _pull requests_ de Dependabot generalmente solo son visibles para los administradores del repositorio, así que si esto no aplica a ti, por favor omite esta sección.

- Las _pull request_ de Dependabot pueden fusionarse directamente si la actualización de la versión es una [semver](https://semver.org/) versión de parche y la prueba automatizada de CI ha pasado.
- Las _pull requests_ de Dependabot con cambios de versión semver menor generalmente se pueden fusionar directamente siempre y cuando la prueba automatizada de CI pase. Se recomienda hacer una rápida verificación en el registro de cambios de la dependencia actualizada.
- Las _pull requests_ de Dependabot con cambios de versión principal de semver pueden afectar probablemente el proceso de compilación o las funcionalidades de p5.js. Se anima al revisor, en este caso, a revisar el registro de cambios desde la versión actual hasta la versión objetivo si es posible y probar la _pull request_ localmente para asegurarse de que todos los procesos estén funcionando y realizar cualquier cambio necesario debido a posibles cambios disruptivos en las dependencias.
- Muchas dependencias aumentan los números de versión principales solo porque dejan de admitir oficialmente versiones muy antiguas de Node.js. En muchos casos, los cambios de versión principal no necesariamente implican cambios disruptivos resultantes de cambios en la API de dependencias.

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

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](../images/github-repo-metrics.png)

By watching a repo, events such as new issues, new pull requests, mentions of your user handle, and other activities you subscribed to on the repo will be sent as notifications to your [notification page](https://github.com/notifications), where they can be marked as read or dismissed much like an email inbox.

In some cases, you may receive emails from GitHub about events in the repo you are watching as well, and you can customize these (including unsubscribing from them completely) from your [notifications settings page](https://github.com/settings/notifications).

Setting these up to fit the way you work can be the difference between having to find relevant issues/PRs to review manually and being overwhelmed by endless notifications from GitHub. A good balance is required here. As a starting suggestion, stewards should watch this repo for "Issues" and "Pull Requests" and set it to only receive emails on "Participating, @mentions and custom."

