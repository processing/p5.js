Help is needed translating these Developer Docs to Spanish (and other languages)
[See this link for more info!](https://github.com/processing/p5.js/issues/4137)

¡Hola! ¡Gracias por su interés en contribuir a p5.js! Puede comenzar con algunas formas diferentes de contribuir [aquí](https://p5js.org/community/#contribute). Esta carpeta contiene varios documentos destinados a desarrolladores de p5.js.

# Estructura del directorio del proyecto

- `src /` contiene todo el código fuente de la biblioteca, que está organizado por temas en módulos separados. Esto es en lo que trabajará si está cambiando p5.js.
- `lib /` contiene la versión final de p5.js destinada a que los usuarios carguen en sus bocetos y proyectos, incluidos en formularios comprimidos y no comprimidos. Esta es la salida cuando [Grunt](https://gruntjs.com/) compila los módulos de código fuente en un solo archivo.
- `contributor_docs /` contiene varios documentos de Markdown que probablemente sean útiles para los desarrolladores de p5.js, en particular porque explican prácticas y principios.
- `docs /` en realidad no contiene documentos! Más bien, contiene el código utilizado para * generar * el [manual de referencia en línea](https://p5js.org/reference/).
- `tests /` contiene pruebas unitarias que aseguran que la biblioteca continúe funcionando correctamente a medida que se realizan los cambios.
- `task /` contiene scripts que realizan tareas automatizadas relacionadas con la compilación, implementación y lanzamiento de nuevas versiones de p5.js.
- `parches /` podría contener [parches Git](https://git-scm.com/docs/git-format-patch) de vez en cuando, pero en casi todos los casos puede ignorar por completo este directorio.
