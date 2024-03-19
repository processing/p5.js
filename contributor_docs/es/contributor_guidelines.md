
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

