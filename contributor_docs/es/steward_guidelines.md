# Proceso de Construcción

Esta sección no cubrirá la configuración general de construcción ni los comandos, sino más bien detalles sobre lo que sucede detrás de escena. Consulta las [directrices para administradores](contributor_guidelines.md#working-on-p5js-codebase) para obtener información más detallada sobre la construcción.

El archivo Gruntfile.js contiene las definiciones principales de construcción para p5.js. Entre las diferentes herramientas utilizadas para construir la biblioteca y la documentación se incluyen, pero no se limitan a: Grunt, Browserify, YUIDoc, ESLint, Babel, Uglify y Mocha. Puede ser útil comenzar con la tarea `default` y retroceder desde allí. También puede ser útil abrir el documento Gruntfile.js mientras se sigue la explicación a continuación.


### Tarea Principal de Construcción

```
grunt.registerTask('default', ['lint', 'test']);
```

Cuando ejecutamos `grunt` o el script npm `npm test`, ejecutamos la tarea predeterminada que consiste en `lint` y luego `test`.


#### Tarea `lint`

```
grunt.registerTask('lint', ['lint:source', 'lint:samples']);
```

La tarea `lint` consiste en dos sub tareas: `lint:source` y `lint:samples`. `lint:source` está subdividida aún más en tres sub tareas adicionales: `eslint:build`, `eslint:source` y `eslint:test`, que utilizan ESLint para verificar los scripts de construcción, el código fuente y los scripts de prueba.

La tarea `lint:samples` primero ejecutará la tarea `yui`, que a su vez consiste en `yuidoc:prod`, `clean:reference` y `minjson`, que extraen la documentación del código fuente en un documento JSON, eliminan archivos no utilizados del paso anterior y minifican el archivo JSON generado en `data.min.json, respectivamente.

A continuación en `lint:samples` está `eslint-samples:source`, que es una tarea escrita personalizada cuya definición está en [./tasks/build/eslint-samples.js](tasks/build/eslint-samples.js); ejecutará ESLint para verificar el código de ejemplo de la documentación y asegurarse de que siga la misma convención de codificación que el resto de p5.js (`yui` se ejecuta primero aquí porque necesitamos que el archivo JSON se construya primero antes de que podamos aplicar lint a los ejemplos).


#### Tarea `test`

```js
grunt.registerTask('test', [
  'build',
  'connect:server',
  'mochaChrome',
  'mochaTest',
  'nyc:report'
]);
```

Primero, veamos la tarea `build` dentro de `test`.

```js
grunt.registerTask('build', [
  'browserify',
  'browserify:min',
  'uglify',
  'browserify:test'
]);
```

Las tareas que comienzan con `browserify` están definidas en [./tasks/build/browserify.js](tasks/build/browserify.js). Todas siguen pasos similares con diferencias menores. Estos son los pasos principales para construir la biblioteca completa de p5.js a partir de sus numerosos archivos fuente en uno solo:

- `browserify` construye p5.js, mientras que `browserify:min` construye un archivo intermedio para ser minificado en el siguiente paso. La diferencia entre `browserify` y `browserify:min` es que `browserify:min` no contiene datos necesarios para que funcione FES.
- `uglify` toma el archivo de salida de `browserify:min` y lo minifica en el p5.min.js final (la configuración de este paso está en el archivo Gruntfile.js principal).
- `browserify:test` está construyendo una versión idéntica y completa a la de p5.js, salvo por el código adicional que se utiliza para informar sobre la cobertura de código de prueba (usando [Istanbul](https://istanbul.js.org/)).

Primero, el uso del código específico de node.js `fs.readFileSync()` es reemplazado por el contenido real del archivo utilizando `brfs-babel`. Esto se utiliza principalmente en el código WebGL para insertar código de <em>shader</em> desde archivos fuente escritos como archivos separados.

A continuación, el código fuente, incluidas todas las dependencias de node\_modules, se transpila usando Babel para cumplir con el requisito de [Browserslist](https://browsersl.ist/) definido en package.json, así como para convertir las declaraciones de importación ES6 en `require()` de CommonJS que browserify comprende. Esto también nos permite utilizar una sintaxis más nueva disponible en ES6 y más allá sin la preocupación por la compatibilidad del navegador.

Después de empaquetar pero antes de que el código empaquetado se escriba en el archivo, el código se pasa por `pretty-fast`. Si no está destinado a ser minificado, debería ser limpiado para que el formato final sea un poco más consistente (anticipamos que el código fuente de p5.js se pueda leer e inspeccionar si se desea).

Aquí se omiten algunos pasos detallados pequeños; puedes revisar el archivo de definición de construcción de browserify vinculado arriba para ver todo más de cerca. 

```
connect:server
```

Este paso inicia un servidor local que aloja los archivos de prueba y los archivos de código fuente construidos para que las pruebas automatizadas puedan ejecutarse en Chrome.

```
mochaChrome
```

Este paso está definido en [./tasks/test/mocha-chrome.js](tasks/test/mocha-chrome.js). Utiliza Puppeteer para iniciar una versión sin interfaz de usuario de Chrome que puede ser controlada de forma remota y ejecuta las pruebas asociadas con los archivos HTML en la carpeta `./test`, que incluye la prueba de la versión sin minificar y minificada de la biblioteca contra los conjuntos de pruebas unitarias, así como la prueba de todos los ejemplos de referencia.

```
mochaTest
```

Este paso difiere de `mochaChrome` en que se ejecuta en node.js en lugar de en Chrome y solo prueba un pequeño subconjunto de características en la biblioteca. La mayoría de las características en p5.js requerirán un entorno de navegador, por lo que este conjunto de pruebas solo debe ampliarse si las nuevas pruebas realmente no necesitan un entorno de navegador.

```
nyc:report
```

Finalmente, después de que todas las construcciones y pruebas estén completas, este paso recopilará el informe de cobertura de pruebas mientras `mochaChrome` estaba probando la versión completa de la biblioteca y mostrará los datos de cobertura de pruebas en la consola. La cobertura de pruebas para p5.js es principalmente para monitorear y tener algunos puntos de datos adicionales; tener una cobertura de pruebas del 100% no es un objetivo.

¡Y eso cubre la tarea predeterminada en la configuración de Gruntfile.js!


### Tarea Variada

Todos los pasos pueden ejecutarse directamente con `npx grunt [paso]`. También hay algunas tareas que no se mencionan arriba pero podrían ser útiles en ciertos casos.

```
grunt yui:dev
```

Esta tarea ejecutará las construcciones de documentación y biblioteca descritas arriba, seguidas de la puesta en marcha de un servidor web que sirve una versión funcionalmente similar de la página de referencia que encontrarás en el sitio web en [http://localhost:9001/docs/reference/](http://localhost:9001/docs/reference/). Luego, supervisará el código fuente en busca de cambios y reconstruirá la documentación y la biblioteca.

`grunt` `yui:dev` es útil cuando estás trabajando en la referencia en la documentación en línea porque no necesitas mover archivos construidos del repositorio de p5.js a un repositorio local de un sitio de p5.js y reconstruir el sitio web cada vez que hagas un cambio, y puedes previsualizar tus cambios con esta versión ligeramente simplificada de la referencia en tu navegador. De esta manera, también puedes tener más confianza en que los cambios que hiciste probablemente se mostrarán correctamente en el sitio web. Ten en cuenta que esto solo está destinado a modificaciones en la documentación en línea; los cambios en la página de referencia en sí, incluido el estilo y el diseño, deben hacerse y probarse en el repositorio del sitio web.

```
grunt watch
grunt watch:main
grunt watch:quick
```

Las tareas de observación vigilarán una serie de archivos en busca de cambios y ejecutarán tareas asociadas para construir la referencia o la biblioteca según los archivos que hayan cambiado. Estas tareas hacen lo mismo, la única diferencia es el alcance.

La tarea `watch` ejecutará todas las construcciones y pruebas de manera similar a ejecutar la tarea predeterminada completa al detectar cambios en el código fuente.

La tarea `watch:main` ejecutará la construcción y las pruebas de la biblioteca, pero no reconstruirá la referencia al detectar cambios en el código fuente.

La tarea `watch:quick` ejecutará solo la construcción de la biblioteca al detectar cambios en el código fuente.

Dependiendo de en qué estés trabajando, elegir la tarea de observación más mínima aquí puede ahorrarte tener que ejecutar manualmente una reconstrucción cada vez que desees hacer algunos cambios.

---


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

Revisar un PR complejo puede ser difícil con comandos de git complejos necesarios para obtener la versión del código del PR localmente para que puedas probarla. Afortunadamente,  [GitHub CLI](https://cli.github.com/) puede ayudar enormemente con este proceso y más.

Después de instalar GitHub CLI e iniciar sesión, revisar una PR localmente se puede hacer ejecutando el comando `gh pr checkout [id_del_pull_request]`, y el proceso de obtener un <em>fork</em> remoto, crear una rama y cambiar a la rama se realizan automáticamente para ti. Volver a la rama principal será lo mismo que cambiar de rama ejecutando `git checkout main`. ¡Incluso puedes dejar un comentario en el PR desde la CLI sin necesidad de visitar la página web en absoluto!

También hay muchos otros comandos disponibles en GitHub CLI que puedes encontrar útiles o no, pero es una buena herramienta para tener en cualquier caso.


### Gestión de Notificaciones

En lugar de monitorear manualmente las pestañas <em>Issues</em> o <em>Pull Requests</em> del repositorio en busca de nuevos <em>issues</em> o PRs, puedes "ver" el repositorio haciendo clic en el botón <em>Watch</em> con un ícono de ojo en la parte superior de la página del repositorio, frente al nombre del repositorio.

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](images/github-repo-metrics.png)

Al observar un repositorio, eventos como nuevos <em>issues</em>, nuevos <em>pull requests</em>, menciones de tu nombre de usuario y otras actividades a las que te hayas suscrito en el repositorio se enviarán como notificaciones a tu [página de notificaciones](https://github.com/notifications), donde se pueden marcar como leídas o descartadas de la misma manera que un buzón de correo electrónico.

En algunos casos, también puedes recibir correos electrónicos de GitHub sobre eventos en el repositorio que estás observando, y puedes personalizarlos (incluida la desuscripción completa de ellos) desde tu [página de configuración de notificaciones](https://github.com/settings/notifications).

Configurar estas opciones para que se adapten a la forma en que trabajas puede ser la diferencia entre tener que buscar <em>issues</em>/PRs relevantes para revisar manualmente y sentirse abrumado por notificaciones interminables de GitHub. Se requiere un buen equilibrio aquí. Como sugerencia inicial, los supervisores deberían observar este repositorio para <em>Issues</em> y <em>Pull Requests</em> y configurarlo para recibir correos electrónicos solo sobre "Participando, @menciones y personalizadas".

