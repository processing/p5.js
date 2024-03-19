
### Usando la interfaz de línea de comandos de `git`

Cuando hayas realizado el <em>fork</em> (copia), navega a la página de tu <em>fork</em> y copia la URL de git haciendo clic en el botón verde que dice “Code”. Debería ser algo así como `https://github.com/limzykenneth/p5.js.git`

![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](/contributor_docs/images/code-button.png)

Después, ve a la línea de comandos de tu entorno local y clona este repositorio de git. “Clonar” simplemente significa descargar una copia del repositorio en tu máquina local. Corre el siguiente comando en un folder en donde quieras almacenar la carpeta del código fuente de p5.js. 

```
git clone [git_url]
```

Sustituye `[git_url]` por la URL acabas de copiar. Esto puede llevar varios minutos, dependiendo de la velocidad de tu conexión a internet, ¡un buen momento para preparar un poco de café! Una vez que el proceso finalice, puedes abrir la carpeta que descargaste llamada `p5.js` en tu editor de código preferido y comenzar a explorar. 

## Desglose del código base

Algunos de los archivos y carpetas clave que encontrarás en la carpeta de p5.js son los siguientes:

- `src` - Aquí es donde reside todo el código que eventualmente se combina en los archivos finales p5.js y p5.min.js.
- [`test`](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md) - En esta carpeta se encuentran las pruebas unitarias y el código para probar todos los ejemplos de documentación.
- `tasks` - Donde se encuentra el código de compilación detallado y personalizado. `Gruntfile.js` - Este es el archivo de configuración de compilación principal.
- `contributor_docs` - Aquí es donde reside la documentación y toda la demás documentación para las, los y les colaboradores.

Los demás archivos y carpetas son principalmente configuraciones u otros tipos de archivos de soporte; en la mayoría de los casos, no debería ser necesario realizar ninguna modificación.

## Configuración de compilación 

Antes de hacer cualquier cosa, necesitarás configurar la carpeta del proyecto local para poder construir y ejecutar pruebas para p5.js. Suponiendo que tienes node.js instalado, ejecuta:


```
npm ci
```

Es probable que esto lleve un tiempo, ya que npm descarga todas las dependencias necesarias. Sin embargo, una vez hecho esto, eso es todo, estará todo configurado. Bastante simple, ¿verdad?


## Flujo de trabajo de Git

Ahora estás listx para hacer los cambios necesarios. Para más detalles sobre las diferentes partes del repositorio y cómo puedes hacer cambios relevantes, consulta las subsecciones a continuación. Para empezar, ejecuta:

```
npm test
```

Para intentar compilar p5.js desde cero y ejecutar todas las pruebas unitarias, esto debería completarse sin errores. Si solo quieres construir la biblioteca sin ejecutar las pruebas, puedes ejecutar:

```
npm run build
```

Cualquiera de los comandos anteriores construirá la biblioteca en la carpeta `lib/` como  `p5.js`  y `p5.min.js`. Puedes usar estos archivos creados para tus propias pruebas si es necesario.

A continuación, te recomendamos que hagas una rama aparte de la rama `main` antes de comenzar a trabajar. Una rama o <em>branch</em> en git es, como su nombre lo indica, una versión ramificada del repositorio a la que puedes agregar <em>commits</em> sin afectar la rama <em>main</em> u otras ramas. Las ramas te permiten trabajar en múltiples funciones a la vez (utilizando múltiples ramas aisladas) y tener la confianza de que si cometes un error en una rama, no afectará a la rama <em>main</em> (principal).

En GitHub Desktop, esto se puede hacer haciendo clic en el botón de Rama Actual en la parte superior de la ventana. Desde aquí, puedes cambiar de ramas o ingresar un nombre de rama para crear una nueva. Para nuestros propósitos, ingresa un nuevo nombre de rama que describa el cambio que realizarás y haz clic en Crear Nueva Rama.

![A screenshot of the GitHub Desktop branch selection menu. After entering a new branch name that does not yet exist, a "Create New Branch" button appears.](/contributor_docs/images/github-desktop-create-branch.png)

Desde la terminal, ejecuta`git checkout -b nombre_rama` mientras estés en la rama `main`, sustituyendo `nombre_rama` con algo descriptivo y estarás ahora en una rama separada.

Mientras realizas tus cambios, te recomendamos que ejecutes `npm test` con frecuencia, especialmente si estás trabajando en el código fuente. Ejecutar esto te llevará algo de tiempo, pero asegura que los cambios que hagas no rompan comportamientos existentes. Debe ejecutar `npm test` antes de pasar el <em>commit</em>, o confirmación,  de los cambios como se describe a continuación.

Una vez que hayas realizado tus cambios en el código base, deberás hacer un <em>commit</em> en git. Un <em>commit</em> es una colección de cambios guardados en el repositorio git; esencialmente registra el estado actual de los archivos en el repositorio en el momento del <em>commit</em>.


Una pregunta que puede surgir es ¿con qué frecuencia deberías hacer <em>commit</em> en git? En general, es preferible que te esfuerces por hacer <em>commit</em>  con frecuencia en lugar de agrupar múltiples cambios grandes en un solo <em>commit</em> . Una buena pauta es hacer <em>commit</em>  cada vez que hayas completado una subtarea que pueda describirse en una frase.

Para hacer <em>commit</em> de todos los cambios actuales desde GitHub Desktop, abre la aplicación después de realizar tus cambios. Mostrará una lista de los archivos que has modificado en la barra lateral izquierda y los cambios específicos dentro de cada archivo a la derecha. Escribe una breve descripción de alto nivel en el campo junto a tu icono de usuario en la esquina inferior izquierda de la ventana. Este será el título del <em>commit</em>. Puedes dar más detalles en el campo de descripción a continuación o simplemente dejarlo en blanco. Haz clic en el botón azul "Commit" para finalizar el cambio.


![A screenshot of GitHub Desktop after having made a change. The area where you need to write a title for your change is circled in red in the lower left of the window.](/contributor_docs/images/github-desktop-commit.png)

Para confirmar todos los cambios actuales desde la terminal, ejecuta lo siguiente:

1. Verifica que solo se enumeren los archivos que has cambiado con el siguiente comando.

```
git status
```

Si hay archivos enumerados que no has cambiado, necesitarás o bien [restaurar](https://git-scm.com/docs/git-restore) los archivos a su estado original o asegurarte de que los cambios son intencionados. Para mostrar cambios más detallados para cada archivo, utiliza el siguiente comando.

```
git diff
```

No debes hacer <em>commit</em> de ningún cambio de archivo que no tengas la intención de cambiar para tu Pull Request.

2. Organiza todos los cambios para hacer <em>commit</em> en git con el siguiente comando.

```
git add .
```

3. Para hacer <em>commit</em> de los cambios en git, ejecuta el siguiente comando.

``` 
git commit -m "[tu_mensaje_commit]"   
```

`[tu_mensaje_commit]` debe ser reemplazado por un mensaje relevante que describa los cambios, evitando descripciones genéricas. Por ejemplo, en lugar de decir `Corrección de documentación 1`, di `Se agregó ejemplo de documentación a la función circle()`.

```
git commit -m "Se agregó ejemplo de documentación a la función circle()"
```

Repite los pasos anteriores para todos los commits que realizarás mientras te aseguras de ejecutar `npm test` con regularidad para asegurarte de que todo funcione de la manera adecuada.


### Código fuente

Si vas a trabajar en el código fuente, un buen lugar para empezar, si sabes en qué características de p5.js vas a trabajar, es visitar la documentación y en la parte inferior de cada funcionalidad documentada de p5.js habrá un enlace a su código fuente.

![Cropped screenshot of a reference page on the p5.js website containing the sentence "Notice any errors or typos? Please let us know. Please feel free to edit src/core/shape/2d\_primitives.js and issue a pull request!". Part of the above sentence where it says "src/core/shape/2d\_primitives.js" is highlighted with a red underline and arrow pointing to it.](/contributor_docs/images/reference-code-link.png)

### Pruebas unitarias

Si vas a trabajar en pruebas unitarias, por favor consulta [aquí](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md). Ten en cuenta que para cualquier mejora de características, nuevas funcionalidades y ciertas correcciones de errores, las pruebas unitarias que cubren las nuevas implementaciones deben ser incluidas en el PR.


### Documentación en línea

Si vas a trabajar en la documentación en línea, por favor consulta [aquí](https://github.com/processing/p5.js/blob/main/contributor_docs/inline_documentation.md).


### Accesibilidad

Si vas a trabajar en características de accesibilidad, por favor revisa [aquí](https://github.com/processing/p5.js/blob/main/contributor_docs/web_accessibility.md). Para un sistema de errores amigable, consulta [aquí](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md).


## Estándar de código

El estándar de código o estilo de código de p5.js aplica mediante [ESLint](https://eslint.org/). Cualquier <em>commit</em> y <em>pull request</em> de git debe pasar la verificación de estilo antes de que sea aceptada. La forma más fácil para que sigas el estándar de codificación correcto es usar la extensión ESLint disponible para tu editor de texto con resaltado de errores de estilo (disponible para la mayoría de los editores de texto más populares).


## Principios de diseño de software

Mientras trabajas en cualquier característica de p5.js, es importante tener en cuenta los principios de diseño de p5.js. Nuestras prioridades pueden diferir de las prioridades de otros proyectos, por lo que si vienes de un proyecto diferente, te recomendamos que te familiarices con los principios de diseño de p5.js.

- **Acceso:** Priorizamos la accesibilidad ante todo, las decisiones que tomamos deben tener en cuenta cómo aumenta el acceso a grupos históricamente marginados. Lee más al respecto en nuestra declaración de acceso.
- **Amigable para principiantes:** La API de p5.js tiene como objetivo ser amigable para los programadores principiantes, brinda un acceso sencillo para crear contenido web interactivo y visual con las API de HTML5/Canvas/DOM más avanzadas.

- **Educativo:** p5.js se centra en una API y un plan de estudios que respalda el uso educativo, incluyendo una referencia completa a la API con ejemplos de apoyo, así como tutoriales y planes de estudio de muestra que introducen principios básicos de codificación creativa en un orden claro y atractivo.

- **JavaScript y su comunidad:** p5.js busca hacer que las prácticas de desarrollo web sean más accesibles para los principiantes modelando patrones de diseño y uso adecuados de JavaScript, mientras los abstrae cuando es necesario. Como una biblioteca de código abierto, p5.js también incluye a la comunidad JavaScript más amplia en su creación, documentación y difusión.

- **Processing y su comunidad:** p5.js se inspira en el lenguaje Processing y su comunidad, y tiene como objetivo hacer que la transición de Processing Java a JavaScript sea fácil y clara.

[**⬆ volver arriba**](#contributor-guidelines)

---

# Pull requests

Ahora que has realizado los cambios necesarios, incluidas las pruebas unitarias si corresponde, `npm test` no muestra errores y has hecho <em>commit</em> de los cambios, puedes comenzar a preparar <em>pull request</em> para que tus nuevos <em>commits</em> se fusionen en el repositorio oficial de p5.js. Un <em>pull request</em>, más formalmente, es una solicitud a un repositorio (en este caso, el repositorio oficial de p5.js) para extraer o fusionar cambios de otro repositorio (en este caso, tu repositorio bifurcado de p5.js) en su historial de <em>commits</em>.

## Creando un pull request

El primer paso aquí es subir tus nuevos <em>commits</em> a tu <em>fork</em> de p5.js; piensa en ello como subir los cambios a tu copia remota.

Desde GitHub Desktop, justo a la derecha del botón para cambiar de ramas en la parte superior, hay un botón para enviar tus cambios a GitHub. Haz clic ahí para enviar tus cambios.

![A view of GitHub Desktop after committing changes. The button to push the changes online is circled in red.](/contributor_docs/images/publish-branch.png)

Una vez subido el código, aparecerá un botón que te pedirá crear un <em> pull request</em>. Al hacer clic en el botón una vez se mostrará una vista previa con otro botón para crear realmente la solicitud. Presiona el botón "Crear Pull Request" para iniciar el proceso.

![A screenshot of Github Desktop after pushing code. In the left sidebar, it says "0 changed items." In the right pane, below the "No local changes" header, a blue "Review Pull Request" button has been marked up with a red circle.](/contributor_docs/images/preview-pull-request.png)

Desde la terminal, ejecuta el siguiente comando:

```
git push -u origin [nombre_rama]
```

Una vez que la subida esté completa, es posible que veas un enlace en la terminal que te permite abrir un <em>pull request</em>. Si no, puedes navegar a tu <em>fork</em> en tu navegador web, cambiar a la rama en la que estás trabajando con el botón desplegable en la parte superior de la lista de archivos, haz clic en "Contribuir" y luego en "Abrir pull request".

![](https://lh7-us.googleusercontent.com/xoqM9gLSFXyw7b3gzG8JlHqoO0zxHALbjSz93E3D0HNh4Jw2wDWdzHKUEchnB6hdjQC7hVn-o5prrXkLw2WiEOoVKJF6kpmyA65sirN0z-Vy3PBY3rCXC5Ifn5stQhcdUQxQS0rsVoW0_hlkfTcY8PQ)

También puedes ver un botón para abrir un <em>pull request</em> cuando visites el repositorio de p5.js en Github. Al hacer clic en él también funcionará para abrir un nuevo  <em>pull request</em>.

![Cropped screenshot of the main page of the p5.js GitHub repository web page. A section near the top of the page is a yellow call to action box containing a green button with the text "Compare & pull request".](/contributor_docs/images/recent-pushes.png)

### Información de pull request

![Screenshot of an "Open a pull request" page on GitHub that is prepopulated with p5.js's pull request template.](/contributor_docs/images/new-pr.png)  

Antes de enviar el <em>pull request</em>., deberás completar la plantilla de <em>pull request</em>.

### Título

El título del <em>pull request</em> debería describir brevemente cuáles son los cambios, evitando descripciones genéricas aquí también.


### Resuelve

En la plantilla, hay esta línea `Resuelve #[Agregar número de issue aquí]`, la cual debes reemplazar `[Agregar número de issue aquí]` con el número de issue del problema que estás abordando/solucionando [arriba](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#all-about-issues) (por ejemplo, `Resuelve #1234`). Esto asegurará que el <em>issue</em> se cierre automáticamente una vez fusionado el <em>pull request</em>. Si no deseas cerrar automáticamente el <em>issue</em> después de fusionar este PR (tal vez porque hay más cambios en un PR separado), cambia `Resuelve` a `Aborda`.


### Cambios

Debes describir claramente los cambios que has realizado en esta solicitud de extracción. Incluye cualquier detalle de implementación y decisiones que hayas tomado aquí que sean relevantes para quien lo revisará.


### Capturas de pantalla del cambio

Esto es opcional dependiendo de las circunstancias y debería incluirse al realizar cambios relacionados con cómo p5.js renderiza visuales en el <em>canvas</em> o lienzo. Ten en cuenta que no se trata de una captura de pantalla del editor de texto, sino una captura de pantalla del comportamiento de un <em>sketch</em> de ejemplo después de tus cambios.


### Lista de verificación del pull request

Contiene algunos elementos de lista de verificación relevantes que debes marcar reemplazando `[ ]` con `[x]` donde corresponda a tus cambios.

Una vez hecho, haz clic en "Crear pull request".

