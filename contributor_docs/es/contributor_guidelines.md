# Instrucciones para colaboradores

¡Bienvenidos! Este documento está diseñado para ayudar a nuevos contribuidores que deseen aportar código a la biblioteca de p5.js, así como a aquellos que busquen refrescar sus conocimientos sobre procedimientos técnicos. También es útil para cualquier persona interesada en realizar cualquier tipo de contribución al código de p5.js.

Si estás buscando contribuir más allá de los repositorios de p5.js (escribiendo tutoriales, planeando clases, organizando eventos), por favor dirígete a la documentación correspondiente para este tipo de colaboraciones. Aquellos que sean Supervisores o Responsables de mantenimiento, encontrarán más útil referirse a las [Instrucciones para Supervisores](https://github.com/processing/p5.js/blob/main/contributor_docs/steward_guidelines.md) cuando se trata de revisar 'Issues' (problemas) y 'Pull Requests'. 

Este es un documento relativamente largo pero comprensible, y trataremos de indicar todos los pasos tan claro como sea posible. Sin embargo, utiliza la tabla de contenidos para encontrar las secciones que son relevantes para ti, y siéntete libre de omitir secciones que no son relevantes para las contribuciones que planeas hacer. 

**Si eres un nuevo contribuidor te sugerimos comenzar con la primera sección: “ Todo acerca de los Issues (o problemas)”.  Por el contrario, si simplemente quieres un paso-a-paso del la configuración del  proceso de desarrollo, puedes dirigirte a la sección  de “Inicio Rápido para Desarrolladores”.**


# Tabla de Contenidos

- [Todo acerca de los 'Issues' o problemas](#all-about-issues)
  - [¿Qué son los 'Issues' en GitHub?](#what-are-issues)
  - [Plantillas para reportar un 'Issue'](#issue-templates)
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
