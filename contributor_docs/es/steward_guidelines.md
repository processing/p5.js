<!-- Learn about how to manage and review contributions to p5.js. -->

# Directrices para Stewards (Guías de Área)

Ya sea que seas nuevo contribuyendo para p5.js, que seas activo en los repositorios de GitHub de p5.js, o que te encuentres en algún punto intermedio, encontrarás lo que necesitas en estas directrices sobre el rol de steward (guía de área) en p5.js. Si no estás seguro de qué esperar de los stewards, o si estás considerando ofrecerte como voluntario o comenzar como steward, ¡sigue leyendo!

## Tabla de Contenidos

- [Stewardship (Guía de Área)](#stewardship)
  - [Cuidado de la Comunidad](#community-care)
  - [Áreas](#areas)
  - [Convertirse en Steward](#becoming-a-steward)
  - [Comenzando como Steward](#getting-started-with-stewardship)
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
## Stewardship (Rol de Guía de Área)

### Cuidado de la Comunidad 

Un ethos de código abierto incluye [accesibilidad, educación, colaboración, transparencia y agencia](https://www.opensourceethos.net/). Vivir y practicar estos valores mientras escribimos código juntos requiere un atento cuidado de la comunidad. Estas son las prácticas de cuidado comunitario que forman parte de nuestra definición de stewardship:

1. Dar la bienvenida a nuevos contribuidores en GitHub mediante **comentarios amigables** y **revisiones útiles de código**.
2. Ayudar a **facilitar discusiones sobre funcionalidades** y resolver desacuerdos técnicos. Por ejemplo, hacer conexiones con otras discusiones u ofrecer aportes desde experiencia previa relevante. Sugerir funcionalidades o trabajar en ellas es contribución, no stewardship.
3. Participar en los lanzamientos (releases) del software p5.js **apoyando** la corrección de bugs y la finalización de funcionalidades. Por ejemplo, esto significa guiar a otros contribuidores y revisar sus PRs. Corregir bugs es contribución, no stewardship.

El resto de estas directrices proporcionan algunos consejos y trucos que te ayudarán a contribuir efectivamente a p5.js y a guiar las contribuciones de otros. La mayoría de lo escrito aquí existe como pauta a menos que se indique lo contrario. Puedes adaptar estas prácticas para que se ajusten a tu proceso de trabajo.

¡Todos están invitados a ayudar a cuidar la comunidad cuando puedan! Nos alegra ver contribuidores que dan la bienvenida a nuevos contribuidores, revisan el código de otros y proporcionan retroalimentación sobre el diseño de la API. También existen algunos roles concretos:

- Los **contribuidores (contributors)** pueden crear issues, PRs, comentarios y revisiones de código.
- Los **mantenedores (maintainers)** también pueden mergear PRs y administrar otras partes del código del proyecto (codebase).

Los stewards también pueden ser contribuidores: pueden crear issues y PRs como contribuidores, mientras también asumen la responsabilidad, cuando están cuidando un área en particular, de comentar en issues y hacer revisiones de código, especialmente cuando otros contribuidores los etiquetan para ayudar con la discusión y revisión.

Como contribuidor, puedes consultar los stewards actuales en el archivo README del repositorio de p5.js y etiquetar a los stewards relevantes, pero ten en cuenta nuestras directrices para contribuidores, que enfatizan la paciencia y la consideración de que la mayor parte del trabajo técnico en un proyecto de código abierto es voluntario.

Como steward, esperamos que participes regularmente en revisiones de código en issues o PRs que tú no creaste, si están en tu área y si puedes proporcionar orientación útil.

### Áreas

Existen diferentes áreas de trabajo de las cuales los stewards pueden ser responsables. Estas áreas coinciden con las etiquetas (labels) de GitHub en la mayoría de los casos, con un par de excepciones. A continuación se presenta la lista de áreas:

- **Accesibilidad**: Esta área se refiere específicamente a la accesibilidad digital y web, incluyendo, por ejemplo, el soporte para lectores de pantalla mediante API como `describe(..)`, así como el soporte de accesibilidad en el sitio web de referencia
- **Núcleo (Core)**: Se refiere a la API central de p5.js, incluyendo renderizado y entorno
- **DevOps**: Se refiere al proceso de compilación (build process), pruebas unitarias (unit testing) y otros aspectos de la experiencia de desarrollo
- **Documentación**: Incluye tanto la referencia en el código base central que se expone en el sitio web, los documentos para contribuidores y otro contenido del sitio web
- **i18n (Internacionalización / Traducción)**: Incluye la revisión de traducciones, particularmente para `es`, `hi`, `ko`, `zh`
- **Gráficos**: Contiene subáreas de WebGL y [p5.strands](https://beta.p5js.org/tutorials/intro-to-p5-strands/)
- **Color**: Incluye Color, ColorMode, mejoras de accesibilidad relacionadas con el uso del color
- **Tipografía**: Se refiere a todos los temas sobre el manejo de texto y fuentes
- **Matemáticas**: Incluye tanto la Math API externa como mejoras internas de rendimiento
- **Formas (Shapes)**: Incluye el trabajo con formas personalizadas en las versiones 1.11.x y 2.x de p5.js
- **Mantenedores**: Este grupo puede mergear PRs
- **p5.sound.js**: La [nueva biblioteca p5.sound.js](https://github.com/processing/p5.sound.js)
- **p5.js-website**: Aspectos no relacionados con el contenido del [sitio web de referencia](https://p5js.org/), por ejemplo, su estructura, automatizaciones, mejoras técnicas, etc.

Estas áreas de enfoque pueden cambiar con el tiempo dependiendo de las necesidades del proyecto, así que si estás pasando por el proceso de solicitar ser steward, ¡eres bienvenido a proponer nuevas áreas!

### Convertirse en Steward 

Hay dos formas de convertirse en steward:

1. **Nominación** por parte de mantenedores u otros stewards, como en conversaciones en Discord, Discourse o GitHub.
2. **Solicitud** creando un PR para actualizar `stewards.yml` con tu usuario de GitHub @ y las áreas propuestas. Ten en cuenta que cada área debe tener de 1 a 3 stewards. ¡Siempre estamos buscando **stewards de traducción**! Una vez que hagas tu PR de solicitud, otros mantenedores o stewards pueden pedir material de apoyo adicional, como hacer un PR relacionado con las áreas en las que estás interesado o participar en alguna discusión relacionada.

Para permanecer como steward, debes contribuir como steward en al menos 1 de los 2 lanzamientos menores más recientes (por ejemplo, 2.1.0 o 1.11.0, cuando cambia el número del medio). Estos no son tan frecuentes como los parches (patches) (por ejemplo, 2.0.3 a 2.0.4, cuando cambia el número más a la derecha), y en la práctica esto significa que se espera que los stewards estén activos cada 4-6 meses aproximadamente, apoyando a otros contribuidores mediante discusión o revisión de código, no necesariamente escribiendo código. Para renunciar al rol de steward, puedes hacer un PR para eliminarte de `stewards.yml`. ¡Siempre eres bienvenido a tomar una pausa y volver a solicitar en el futuro!

### Comenzando como Steward

1. Mantén estas directrices a mano como referencia: cómo ayudar con nuevos issues, bugs y funcionalidades. Por ejemplo, la sección "Solicitud de Funcionalidades" incluye consejos sobre cómo usar la [declaración de acceso]([access.md](https://github.com/processing/p5.js/blob/dev-2.0/contributor_docs/es/access.md)) de p5.js como steward.
2. Al ayudar a responder preguntas técnicas o revisar, intenta aplicar la [directriz de la Processing Foundation sobre cómo responder preguntas](https://discourse.processing.org/t/guidelines-answering-questions/2145). Estas pueden ser especialmente útiles para dar retroalimentación técnica constructiva.
3. Únete al [Discord de p5.js](https://discord.com/invite/SHQ8dH25r9). ¡En el canal `#contribute-to-p5` cualquier pregunta o propuesta de mejora sobre este proceso es bienvenida!

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

## Proceso de Compilación

Esta sección no cubrirá la configuración general de compilación (build) ni los comandos, sino más bien detalles sobre lo que sucede detrás de escena. Consulta las [directrices para administradores](contributor_guidelines.md#working-on-p5js-codebase) para obtener información más detallada sobre la construcción.

A partir de la versión 2.0 de p5.js, el proyecto ya no usa Grunt para la automatización de tareas. En su lugar, los procesos de compilación y pruebas (test) se manejan usando herramientas modernas como scripts de npm, ESLint y [Vitest](https://vitest.dev/).

### Tarea Principal de Construcción

Para ejecutar las verificaciones de estilo del código (lint) y las pruebas unitarias (unit tests), simplemente ejecuta:

```
npm test
```

Este comando ejecuta ESLint para verificar el estilo del código y luego ejecuta las pruebas unitarias y las pruebas visuales usando Vitest.

#### Tarea `lint`

En p5.js 2.0, ESLint se usa directamente mediante scripts de npm para todas las tareas de verificación de estilo (linting).

Para ejecutar las verificaciones de estilo (lint) en el código del proyecto.

```
npm run lint
```

Este comando verifica los archivos fuente, los scripts de compilación (build scripts), los archivos de prueba y los ejemplos de documentación usando ESLint.

Si solo quieres ejecutar la verificación de estilo (linting) para archivos o directorios específicos, puedes usar ESLint directamente:

```
npx eslint src/
npx eslint test/
```

Ya no existe un linter separado para ejemplos ni un pipeline basado en YUIDoc.

#### Tarea `test`

En p5.js 2.0, el sistema de pruebas ya no usa Mocha mediante Grunt. En su lugar, las pruebas se ejecutan usando [Vitest](https://vitest.dev/) a través de scripts de npm.

Para ejecutar el conjunto completo de pruebas (unit y visual tests), usa:

```
npm test
```

Este comando realiza:

- Verificación de estilo (linting) mediante ESLint
- Pruebas unitarias (unit tests) usando Vitest
- Pruebas visuales (capturas de renderizado)

Las pruebas se encuentran en la carpeta `test/unit`, organizadas de manera que reflejen la estructura del directorio `src`. Por ejemplo, las pruebas para `src/color/p5.Color.js` están en `test/unit/color/p5.Color.js`.

Para ejecutar las pruebas interactivamente en un entorno similar al navegador (útil para identificar errores o debuggear), ejecuta:

```
npx vitest --ui
```
También se puede generar la cobertura de código usando las herramientas integradas de Vitest. Ejecuta:

```
npx vitest run --coverage
```

Nota: El proceso de compilación de Browserify/Grunt (por ejemplo, `browserify`, `uglify`, `brfs-babel`) fue eliminado en la versión 2.


## Proceso de Lanzamiento

Consulta [release\_process.md](release_process.md).

---


## Consejos y Trucos

A veces, la cantidad de <em>issues</em> y PR que requieren revisión puede ser un poco abrumadora. Si bien intentamos implementar procesos que faciliten las cosas, hay algunos consejos y trucos que puedes utilizar para ayudar con la revisión de <em>issues</em> y PRs.


### Plantillas de Respuesta

Una característica útil de GitHub que puedes utilizar es la funcionalidad [Respuestas Guardadas](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies/about-saved-replies), que está disponible para usar al redactar una respuesta a <em>issues</em> o <em>pull requests</em>. Algunos de los flujos de trabajo descritos anteriormente pueden requerir responder a <em>issues</em> o PRs con respuestas idénticas o muy similares (redireccionar preguntas al foro, aceptar un problema para su corrección, etc.), y usar Respuestas Guardadas puede hacer que esto sea un poco más eficiente.

A continuación, se muestran algunas de las Respuestas Guardadas que están siendo utilizadas por los mantenedores de p5.js. ¡Puedes usarlas tú mismo o crear las tuyas!


##### Cerrando: No se puede Reproducir

> No podemos reproducir esto, pero no dudes en reabrir si puedes proporcionar un ejemplo de código que demuestre el problema. ¡Gracias!


##### Cerrando: Necesita Fragmento

> Estoy cerrando esto por motivos organizativos. Por favor, reabre si puedes proporcionar un fragmento de código que ilustre el <em>issue</em>. ¡Gracias!


##### Cerrando: Usa el Foro

> Los <em>issues</em> de GitHub aquí son un buen lugar para los <em>issues</em> y problemas con la biblioteca p5.js en sí. Para preguntas sobre cómo escribir tu propio código, pruebas o seguir tutoriales, el [foro](https://discourse.processing.org/) es el mejor lugar para publicar. ¡Gracias!


##### Cerrando: GSOC

> ¡Gracias! El mejor lugar para discutir las propuestas de GSOC es en nuestro [foro](https://discourse.processing.org/c/summer-of-code).


##### Cerrando: Acceso

> No veo mucho interés en esta función, y no tenemos una explicación clara de cómo [amplía el acceso](access.md), así que cerraré esto por ahora. Si se puede agregar una declaración de acceso a la solicitud del <em>issue</em>, no dudes en volver a abrirlo.

> No vemos una explicación más detallada de cómo esta cuestión [amplía el acceso](access.md), así que cerraré este <em>issue</em> por ahora. Si se puede agregar una declaración de acceso más detallada a la solicitud de función, no dudes en volver a abrirla. ¡Gracias!


##### Cerrando: Complemento

> Creo que esta función está fuera del alcance de la API de p5.js (intentamos mantenerla lo más minimalista posible), pero podría ser un gran punto de partida para una biblioteca complementaria. Consulta la documentación aquí sobre cómo crear un complemento: [https://github.com/processing/p5.js/blob/main/contributor\_docs/creating\_libraries.md](creating_libraries.md)


##### Cerrando PR: Primero Necesita <em>Issue</em>

> Gracias. Como recordatorio, primero deben abrirse <em>issues</em> antes de que se abran pull request y etiquetarse con el <em>issue</em>. Esto es necesario para realizar un seguimiento del desarrollo y mantener la discusión clara. ¡Gracias!


##### Aprobar <em>issue</em> para corrección

> Puedes seguir adelante con una solución. Gracias.


##### PR Fusionado

> Se ve bien. ¡Gracias!


### GitHub CLI

Revisar un PR complejo puede ser difícil con comandos de git complejos necesarios para obtener la versión del código del PR localmente para que puedas probarla. Afortunadamente, [GitHub CLI](https://cli.github.com/) puede ayudar enormemente con este proceso y más.

Después de instalar GitHub CLI e iniciar sesión, revisar una PR localmente se puede hacer ejecutando el comando `gh pr checkout [id_del_pull_request]`, y el proceso de obtener un <em>fork</em> remoto, crear una rama y cambiar a la rama se realizan automáticamente para ti. Volver a la rama principal será lo mismo que cambiar de rama ejecutando `git checkout main`. ¡Incluso puedes dejar un comentario en el PR desde la CLI sin necesidad de visitar la página web en absoluto!

También hay muchos otros comandos disponibles en GitHub CLI que puedes encontrar útiles o no, pero es una buena herramienta para tener en cualquier caso.


### Gestión de Notificaciones

En lugar de monitorear manualmente las pestañas <em>Issues</em> o <em>Pull Requests</em> del repositorio en busca de nuevos <em>issues</em> o PRs, puedes "ver" el repositorio haciendo clic en el botón <em>Watch</em> con un ícono de ojo en la parte superior de la página del repositorio, frente al nombre del repositorio.

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](../images/github-repo-metrics.png)

Al observar un repositorio, eventos como nuevos <em>issues</em>, nuevos <em>pull requests</em>, menciones de tu nombre de usuario y otras actividades a las que te hayas suscrito en el repositorio se enviarán como notificaciones a tu [página de notificaciones](https://github.com/notifications), donde se pueden marcar como leídas o descartadas de la misma manera que un buzón de correo electrónico.

En algunos casos, también puedes recibir correos electrónicos de GitHub sobre eventos en el repositorio que estás observando, y puedes personalizarlos (incluida la desuscripción completa de ellos) desde tu [página de configuración de notificaciones](https://github.com/settings/notifications).

Configurar estas opciones para que se adapten a la forma en que trabajas puede ser la diferencia entre tener que buscar <em>issues</em>/PRs relevantes para revisar manualmente y sentirse abrumado por notificaciones interminables de GitHub. Se requiere un buen equilibrio aquí. Como sugerencia inicial, los supervisores deberían observar este repositorio para <em>Issues</em> y <em>Pull Requests</em> y configurarlo para recibir correos electrónicos solo sobre "Participando, @menciones y personalizadas".
