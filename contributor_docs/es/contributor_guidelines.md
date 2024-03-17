# Instrucciones para colaboradores

¡Bienvenidos! Este documento está diseñado para ayudar a nuevos contribuidores que deseen aportar código a la biblioteca de p5.js, así como a aquellos que busquen refrescar sus conocimientos sobre procedimientos técnicos. También es útil para cualquier persona interesada en realizar cualquier tipo de contribución al código de p5.js.

Si estás buscando contribuir más allá de los repositorios de p5.js (escribiendo tutoriales, planeando clases, organizando eventos), por favor dirígete a la documentación correspondiente para este tipo de colaboraciones. Aquellos que sean Supervisores o Responsables de mantenimiento, encontrarán más útil referirse a las [Instrucciones para Supervisores](https://github.com/processing/p5.js/blob/main/contributor_docs/steward_guidelines.md) cuando se trata de revisar 'Issues' (problemas) y 'Pull Requests'. 

Este es un documento relativamente largo pero comprensible, y trataremos de indicar todos los pasos tan claro como sea posible. Sin embargo, utiliza la tabla de contenidos para encontrar las secciones que son relevantes para ti, y siéntete libre de omitir secciones que no son relevantes para las contribuciones que planeas hacer. 

**Si eres un nuevo contribuidor te sugerimos comenzar con la primera sección: “ Todo acerca de los Issues (o problemas)”.  Por el contrario, si simplemente quieres un paso-a-paso del la configuración del  proceso de desarrollo, puedes dirigirte a la sección  de “Inicio Rápido para Desarrolladores”.**


# Tabla de Contenidos

- [Todo acerca de los 'Issues' o problemas](#all-about-issues)
  - [¿Qué son los 'Issues' en GitHub?](#what-are-issues)
  - [Plantillas para reportar 'Issues'](#issue-templates)
    - [Reportar un error](#found-a-bug)
    - [Sugerir una mejora a una funcionalidad existente](#existing-feature-enhancement)
    - [Sugerir una funcionalidad nueva](#new-feature-request)
    - [Abrir una discusión ](#discussion)
- [Trabajando en la base de código de p5.js](#working-on-the-p5js-codebase)
  - [Inicio Rápido para Desarrolladores](#quick-get-started-for-developers)
  - [Utilizando la funcionalidad de edición de Github](#using-the-github-edit-functionality)
  - [Haciendo un fork de p5.js y trabajando desde tu fork](#forking-p5js-and-working-from-your-fork)
    - [Utilizando Github Desktop](#using-github-desktop)
    - [Utilizando la interfaz de línea de comandos de Git](#using-the-git-command-line-interface)
  - [Desglose de la base de código ](#codebase-breakdown)
  - [Configuración de compilación](#build-setup)
  - [Flujo de trabajo de Git](#git-workflow)
    - [Código fuente](#source-code)
    - [Pruebas unitarias](#unit-tests)
    - [Documentación en línea](#inline-documentation)
    - [Internacionalización](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#internationalization)
    - [Accesibilidad](#accessibility)
  - [Estándares de código](#code-standard)
  - [Principios de Diseño de Software](#software-design-principles)
- [Pull Requests](#pull-requests)
  - [Creación de un Pull Request](#creating-a-pull-request)
    - [Información sobre el Pull Request](#pull-request-information)
    - [Titulo](#title)
    - [Resuelve ](#resolves)
    - [Cambios](#changes)
    - [Captura de pantalla de los cambios](#screenshots-of-the-change)
    - [Lista de verificación del Pull Request](#pr-checklist)
    - [Rebase y resolución de conflictos](#rebase-and-resolve-conflicts)
  - [Discutir y Corregir](#discuss-and-amend)

---
# Todo acerca de los “Issues” o problemas

La mayoría de la actividad en los repositorios de GitHub de p5.js (también conocidos como "repo" de forma abreviada) ocurre en los 'Issues', o problemas, lo cual es un excelente lugar para comenzar tu viaje de contribución.


## ¿Qué son los ‘Issues’ en GitHub?

![A cropped screenshot of the p5.js library GitHub repository, only showing contents of the top right corner. A red box is drawn on top of the screenshot surrounding the Issues tab.](../images/issues-tab.png)

<em>'Issues'</em> es el nombre común que se le da a una publicación en GitHub que apunta a describir, como lo dice su nombre, un problema.  Los <em>Issues</em> pueden ser reportes de error, solicitudes para añadir un nueva funcionalidad, una discusión, o cualquier publicación que se relacione con el desarrollo de la biblioteca de p5.js. Cualquiera con una cuenta de GitHub puede añadir comentarios debajo de cada <em>Issue</em>, ¡incluyendo bots! Éste es el lugar donde los contribuidores discuten temas relacionados con el desarrollo del proyecto dentro del repositorio.

Mientras un <em>Issue</em> puede ser creado por diferentes razones, usualmente utilizamos la creación de un <em>Issue</em> para discutir el desarrollo del  código fuente de p5.js. Temas como la corrección de errores de tu propio código, invitación de colaboradores a tu proyecto, u otros temas no relacionados, deben ser discutidos ya sea en el [fórum](https://discourse.processing.com) o en otras plataformas de comunicación como [Discord](https://discord.gg/SHQ8dH25r9).

¡Hemos creado plantillas fáciles de usar que puede ayudarte a determinar si un tema es adecuado para ser publicado como un <em>Issue</em> en GitHub, o si sería más apropiado publicarlo en otro lugar!


## Plantillas para reportar <em>Issues </em>
Las plantillas  para reportar <em>Issues</em> en p5.js hacen que sea más sencillo para los Supervisores y los responsables de mantenimiento entender y revisar el contenido sugerido por el colaborador. Además, las plantillas le facilitan al colaborador el proceso de completar un <em>Issue</em>  y, así mismo, le permiten recibir una respuesta más rápida. 

![Screenshot of an example of what an issue looks like on GitHub. The title of the issue in the screenshot is "Warning being logged in Safari when using a filter shader in 2D mode #6597"](../images/github-issue.png)

Para registrar un <em>Issue</em> por primera vez dentro del repositorio de p5.js, haz click en la  pestaña que dice "Issues", ubicada en la parte superior. Una vez dentro de la página de "Issues"  haz clic en el botón <em>"New Issue"</em> (problema nuevo), que se encuentra al costado derecho. Se te presentarán diferentes opciones de plantilla que te van a dirigir al lugar adecuado para registrar tu <em>Issue</em>. Te recomendamos elegir la plantilla más relevante para tu caso para asegurarte de que tu <em>Issue</em> reciba rápidamente la atención correcta.

![Cropped screenshot of the GitHub repository's issue page with the green "New issue" button highlighted with a red box surrounding it.](../images/new-issue.png)

### ["Reportar un Error"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Bug\&projects=\&template=found-a-bug.yml)

Cuando encuentres un comportamiento incorrecto en p5.js, o algo que no se esté comportando como se ha descrito en la documentación, [usa esta plantilla]( https://github.com/processing/p5.js/issues/new?assignees=&labels=Bug&projects=&template=found-a-bug.yml). Por favor, ten en cuenta que si estás  tratado de corregir el código de tu sketch, y crees que el problema tal vez se encuentra en tu código, primero consulta en el [foro de discusiones]( https://discourse.processing.org/) antes de reportar un error.

Esta plantilla provee campos que debes llenar con la siguiente información relevante: 

1.	**¿Cuál es la subárea más adecuada de p5.js?:** esto añadirá automáticamente las [etiquetas]( https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md) relevantes a tu <em>Issue</em>, lo que nos ayudará a identificar y responder adecuadamente.
2.	**Versión de p5.js:** puedes verificar la versión de p5.js dentro de la etiqueta `<script>`  que se encuentra en la primera línea del archivo p5.js/p5.min.js. 
3.	**Navegadores web y versión de los mismos:** esta sección nos ayuda a identificar diversos comportamientos entre los diferentes navegadores web. Para encontrar la versión de tu navegador, sigue las instrucciones proporcionadas en la tabla siguiente según el navegador que estés utilizando.

<table>

<tr>

<td>

Chrome

</td>

<td>

Firefox

</td>

<td>

Safari

</td>

</tr>

<tr>

<td>

Abre una ventana del navegador y en la barra de direcciones, navega a  `chrome://version`

</td>

<td>

Abre una ventana del navegador, y en la barra de direcciones navega a   `about:support`

</td>

<td>

Abre una venta del navegador y, en el menú superior, haz clic sobre "Safari", te aparecerá un desplegable con diferentes opciones, deberás seleccionar "Sobre Safari".

</td>

</tr>

</table>

4.	**Sistema Operativo:** En lo posible,  incluye la versión del Sistema Operativo, por ejemplo, `macOS 12.5`. Algunos errores se pueden derivar de comportamientos del sistema operativo.
5.	**Pasos para reproducir el error:** Esta es una de la piezas de información más importantes. Comparte una lista de pasos detallados con los cuales podemos replicar el error que has encontrado. Compartir una muestra de código que exponga el problema puede ser de gran ayuda para cualquiera que busque replicar el error que estás enfrentando, y comenzar a formular una solución.

**¡La replicación es clave!** La gran mayoría de los campos en esta plantilla tienen como objetivo replicar el error. Entre más información proveas acerca de tu sketch y como otros pueden replicar el error que has encontrado, más fácil será para la comunidad ayudarte a buscar una solución.

**Sé lo más detallado posible y evita las afirmaciones genéricas**, por ejemplo, no digas "la función `image()` no funciona", sino sé más específico, como "la función `image()` no muestra la imagen GIF cargada en el tamaño correcto". Una forma útil de describir el error que estás enfrentando es describir dos cosas:

1.	¿Qué es lo que esperas del código que has compartido? (comportamiento esperado).
2.	¿Qué es lo que está haciendo el código que has compartido? (comportamiento presente).

Si deseas contribuir a la solución del error que has reportado, indícalo en la descripción. Puedes proveer sugerencias sobre cómo el error que has descrito puede ser corregido. Esta descripción nos ayudará a saber cuánto apoyo necesitas para contribuir a la solución del error.

**No debes registrar un <em>Pull Request</em> ni comenzar a trabajar en cambios de código sin antes haber registrado un <em>Issue</em> correspondiente, o antes de que dicho <em>Issue</em> haya sido aprobado para su implementación**. Esto se debe a que la solución propuesta podría no ser aceptada, podría requerir un enfoque completamente diferente o es posible que el problema real esté en otro lugar. Cualquier <em>Pull Request</em> que se registre antes de que se haya aprobado un <em>Issue</em> correspondiente será cerrado hasta que el <em>Issue</em> haya sido aprobado previamente.

Para que un reporte de error sea aceptado para su corrección, este debe ser aprobado por al menos un [supervisor de área o responsable de mantenimiento]( https://github.com/processing/p5.js#stewards), antes de que se pueda comenzar a trabajar en el <em>Pull Request</em>.

### [Sugerir una mejora a una funcionalidad existente](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Enhancement\&projects=\&template=existing-feature-enhancement.yml)

Esta plantilla debe ser usada si deseas proponer cambios o sugerir mejoras a una funcionalidad existente en p5.js (funciones, constantes, renderización, etc ). Por ejemplo, si quisieras proponer una nueva manera de definir un color con la función `color()` u otras funciones que acepten colores, esta sería la plantilla a utilizar. 

Esta plantilla provee campos que debes llenar con la siguiente información relevante: 

1.	**Incrementar Accesibilidad:**  Este es un campo requerido en el cual debes explicar cómo la adición de la mejora o cambio a la funcionalidad existente, ayudará a [incrementar accesibilidad]( https://github.com/processing/p5.js/blob/main/contributor_docs/access.md) para las personas que han sido históricamente marginadas en las disciplinas de las artes y las tecnologías. **Ninguna propuesta será aceptada sin esta declaración**. Sin embargo, puedes añadir "No estoy seguro" a este campo, y comenzar una conversación con la comunidad para entender como tu propuesta puede abordar el tema de accesibilidad en p5.js.

2.	**¿Cuál es la subárea más adecuada de p5.js?:** Esto añadirá automáticamente las [etiquetas]( https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md) relevantes a tu <em>Issue</em>, lo que nos ayudará a identificar y responder adecuadamente.

3.	**Detalles de mejora de funcionalidades:** Aquí debes describir tu propuesta para la mejora de funcionalidad(es). Una buena propuesta generalmente incluye un caso de uso específico: qué, cuándo, cómo y por qué esta funcionalidad es necesaria.

Para que las propuestas de mejora de funcionalidad(es) sean aceptadas, estas deben ser aprobadas por al menos un [supervisor de área o responsable de mantenimiento]( https://github.com/processing/p5.js#stewards), antes de que se comience a trabajar en el <em>Pull Request</em>.

**No debes registrar un <em>Pull Request</em> ni comenzar a trabajar en cambios de código sin antes haber registrado un <em>Issue</em> correspondiente, o antes de que dicho <em>Issue</em> haya sido aprobado para su implementación**. Esto se debe a que no hay garantía de que la propuesta será aceptada. Cualquier <em>Pull Request</em> que se registre antes de que se haya aprobado un <em>Issue</em> correspondiente será cerrado hasta que el <em>Issue</em> haya sido aprobado previamente.

### ["Sugerir una funcionalidad nueva"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Feature+Request\&projects=\&template=feature-request.yml)

Esta plantilla debe ser usada si deseas proponer la adición de una nueva funcionalidad a p5.js. Por ejemplo, imagina que quieres añadir soporte para dibujar elementos `<table>`, propios de HTML, con una nueva función que se llame `createTable`. Si tu propuesta se superpone con otras propuestas de mejora existentes, te sugerimos que evalúes y elijas la plantilla que consideres más apropiada para tu caso (ya sea funcionalidad existente o funcionalidad nueva)

Esta plantilla provee campos que debes llenar con la siguiente información relevante: 
1.	**Incrementar Accesibilidad:**  Este es un campo requerido en el cual debes explicar cómo la adición de la mejora o cambio a la funcionalidad existente, ayudará a [incrementar accesibilidad]( https://github.com/processing/p5.js/blob/main/contributor_docs/access.md) para las personas que han sido históricamente marginadas en las disciplinas de las artes y las tecnologías. **Ninguna propuesta será aceptada sin esta declaración**. Sin embargo, puedes añadir "No estoy seguro" a este campo, y comenzar una conversación con la comunidad para entender como tu propuesta puede abordar el tema de accesibilidad en p5.js.

2.	**¿Cuál es la subárea más adecuada de p5.js?:** Esto añadirá automáticamente las [etiquetas]( https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md) relevantes a tu <em>Issue</em>, lo que nos ayudará a identificar y responder adecuadamente.

3.	**Detalles de la nueva funcionalidad:** Aquí debes describir tu propuesta para proponer la adición de una nueva funcionalidad. Una buena propuesta generalmente incluye un caso de uso específico: qué, cuándo, cómo y por qué esta funcionalidad es necesaria.

Para que una nueva funcionalidad sea aceptada, esta debe ser aprobada por al menos 2 [supervisores de área o responsables de mantenimiento]( https://github.com/processing/p5.js#stewards), antes de que se comience a trabajar en el <em>Pull Request</em>.

**No debes registrar un <em>Pull Request</em> ni comenzar a trabajar en cambios de código sin antes haber registrado un <em>Issue</em> correspondiente, o antes de que dicho <em>Issue</em> haya sido aprobado para su implementación**. Esto se debe a que no hay garantía de que la propuesta será aceptada. Cualquier <em>Pull Request</em> que se registre antes de que se haya aprobado un <em>Issue</em> correspondiente será cerrado hasta que el <em>Issue</em> haya sido aprobado previamente.


### [Abrir una discusión](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Discussion\&projects=\&template=discussion.yml)

Esta plantilla se utiliza cuando el <em>Issue</em> que estas registrando no encaja en ninguna de las plantillas anteriores. Un <em>Issue</em> que no corresponda a ninguna de las plantillas proporcionadas es relativamente inusual. Por ejemplo, si hay una discusión sobre si se debe adoptar una funcionalidad de una API web específica en p5.js, esta debería registrarse como ['Sugerir una funcionalidad nueva]( https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#new-feature-request). En otro ejemplo, una discusión acerca de añadir nuevos modos de colores a las funciones de color de p5.js, debe ser registrada como [“Sugerir una mejora a una funcionalidad existente”]( https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#existing-feature-enchancement). Finalmente, si tienes un anuncio sobre un evento local de programación que estás  organizando, este debería ser publicado en el foro e inclusive podrías contactar a la Fundación de Processing si estás buscando apoyo, publicidad, etc.

Al abrir una discusión, puedes utilizar el panel de “Etiquetas”, que encontraras al costado derecho, para agregar etiquetas relevantes y así dirigir tu ‘Issue’ al área correspondiente. La plantilla en sí, consiste en un campo abierto que te permite comenzar una discusión. Puedes encontrar [aquí]( https://github.com/processing/p5.js/issues/6517) un ejemplo de una discusión.

[**⬆ Volver arriba.**](#contributor-guidelines)

---


