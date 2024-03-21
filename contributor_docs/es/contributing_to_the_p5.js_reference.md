# Contribuir a la referencia de p5.js

En p5.js, creamos las referencias de código que ves en la página de [referencia](https://p5js.org/reference/) del sitio web de p5.js incluyéndolas junto al código fuente de la biblioteca como comentarios especializados. Estos comentarios de referencia incluyen la descripción, la firma de la función (sus parámetros y valor de retorno) y ejemplos de uso. En otras palabras, el contenido en la página de referencia de cada función/variable de p5.js se construye a partir de los comentarios de referencia en el código fuente.

Este documento te mostrará cómo escribir y formatear los comentarios de referencia para que eventualmente puedan ser renderizados correctamente en el sitio web. Debes seguir esta guía siempre que estés editando o escribiendo una referencia para cualquier función o variable de p5.js.

## Una introducción rápida al funcionamiento de los comentarios de referencia

Cuando mires el código fuente de p5.js, verás que muchas líneas en la biblioteca son comentarios de referencia; se ven así:

```
/**
 * Calculates the sine of an angle. `sin()` is useful for many geometric tasks
 * in creative coding. The values returned oscillate between -1 and 1 as the
 * input angle increases. `sin()` takes into account the current
 * <a href="#/p5/angleMode">angleMode</a>.
 *
 * @method sin
 * @param  {Number} angle the angle.
 * @return {Number} sine of the angle.
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   let t = frameCount;
 *   let x = 50;
 *   let y = 30 * sin(t * 0.05) + 50;
 *   line(x, 50, x, y);
 *   circle(x, y, 20);
 *
 *   describe('A white ball on a string oscillates up and down.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   let x = frameCount;
 *   let y = 30 * sin(x * 0.1) + 50;
 *   point(x, y);
 *
 *   describe('A series of black dots form a wave pattern.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   let t = frameCount;
 *   let x = 30 * cos(t * 0.1) + 50;
 *   let y = 10 * sin(t * 0.2) + 50;
 *   point(x, y);
 *
 *   describe('A series of black dots form an infinity symbol.');
 * }
 * </code>
 * </div>
 */
```

Por lo general, estos comentarios están seguidos del código JavaScript real que define a la función. Los comentarios de referencia siempre comienzan con `/**` y terminan con `*/`, con cada línea entre los dos con `*` al inicio.

Cualquier cosa en un bloque de estos se interpretará como documentación de referencia. Es posible que estés familiarizado con este estilo de comentarios de código a través de [JSDoc](https://jsdoc.app/). Aunque p5.js no usa JSDoc, utiliza una herramienta llamada [YUIDoc](https://yui.github.io/yuidoc/) que tiene una sintaxis para referencias muy similar. En este estilo de comentarios de referencia cada bloque de comentarios se subdivide en elementos individuales, como veremos a continuación.

## Bloque de comentarios de referencia

Desglosemos el bloque de comentarios de referencia anterior para la función `sin()` y veamos qué hace cada sección. Puedes comparar lo que vez en estos comentarios con el contenido de la página de referencia para [`sin()`](https://p5js.org/reference/#/p5/sin).

```
/**
 * Calculates the sine of an angle. `sin()` is useful for many geometric tasks
 * in creative coding. The values returned oscillate between -1 and 1 as the
 * input angle increases. `sin()` takes into account the current
 * <a href="#/p5/angleMode">angleMode</a>.
```

En la parte superior del comentario está la descripción textual de la función. Esta descripción puede contener tanto sintaxis de markdown como HTML. La descripción debe ser concisa y describir qué hace la función y, si es necesario, algunos detalles sobre sus peculiaridades o comportamientos.

```
 * @method sin
 * @param  {Number} angle  the angle.
 * @return {Number} sine of the angle.
```

Una función normalmente tendrá las tres secciones anteriores, cada una comenzando con el símbolo `@` seguido de una de las siguientes palabras clave:

- `@method` se usa para definir el nombre de la función, en este caso `sin` (nota que el nombre de la función no incluye los paréntesis `()`).
- `@param` se usa para definir los parámetros o argumentos que acepta la función.
  - Después de la palabra clave `@param`, almacenado entre llaves `{}`, está el tipo del parámetro.
  - Después del tipo, la siguiente palabra (angle) es el nombre del parámetro.
  - Después del nombre, el resto de la línea es la descripción del parámetro.
- `@return` se usa para definir el valor de retorno de la función.
  - Después de la palabra clave `@return`, almacenado entre llaves `{}`, está el tipo de valor del retorno.
  - Después del tipo, el resto de la línea es la descripción del valor de retorno.

Para los parámetros este es el formato genérico:

```
@param {type} name Description here.
```

Si el parámetro es opcional, agrega corchetes alrededor del nombre:

```
@param {type} [name] Description here.
```

### Información adicional: Constantes

Si el parámetro toma uno o más valores definidos en [`constants.js`](https://github.com/processing/p5.js/blob/main/src/core/constants.js), entonces el tipo debe especificarse como `{Constant}` y los valores válidos deben enumerarse en el comentario que sigue a la palabra clave `either`, por ejemplo:

```
@param {Constant} horizAlign horizontal alignment, either LEFT, CENTER, or RIGHT
```

Para los tipos de retorno, debes seguir este formato:

```
@return {type} Description of the data returned.
```

Si la función no tiene un valor de retorno, puedes omitir la etiqueta `@return`.

### Información adicional: Encadenamiento

Si el método devuelve el objeto de la superclase, puedes omitir la etiqueta `@return` y agregar esta línea en su lugar:

```
@chainable
```

## Firmas adicionales

Si una función tiene múltiples opciones de parámetros posibles, puedes especificar cada una individualmente. Por ejemplo, la función [`background()`](http://p5js.org/reference/#p5/background) toma una serie de opciones de parámetros diferentes (ver la sección "Sintaxis" en la página de referencia). Elige una versión para incluirla como la primera firma usando la plantilla anterior. Al final del primer bloque de comentarios de referencia puedes agregar firmas adicionales, cada una en su propio bloque, como en el siguiente ejemplo.

```
/**
 * @method background
 * @param {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex
 * @param {Number} [a] alpha value
 */

/**
 * @method background
 * @param {Number} gray specifies a value between white and black
 * @param {Number} [a]
 */
```

### Información adicional: Múltiples firmas

No es necesario crear una firma separada si la única diferencia entre dos firmas es la adición de un parámetro opcional. Limita el uso de esta función en la medida de lo posible porque puede crear ruido innecesario en la referencia.

## Referencia para variables de p5.js

Hasta ahora hemos visto cómo escribir referencias para funciones y constantes. Las variables siguen la misma estructura, pero usan etiquetas diferentes.

```
/**
 * The system variable mouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the canvas. The value at
 * the top-left corner is (0, 0) for 2-D and (-width/2, -height/2) for WebGL.
 * If touch is used instead of mouse input, mouseX will hold the x value
 * of the most recent touch point.
 *
 * @property {Number} mouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, 0, mouseX, 100);
 *   describe('horizontal black line moves left and right with mouse x-position');
 * }
 * </code>
 * </div>
 */
```

El inicio del bloque contiene la descripción de la variable (`mouseX` en este caso). Para definir el nombre de la variable usamos `@property` en lugar de `@method`. `@property` sigue la misma sintaxis que `@param` para definir el tipo y su nombre. La etiqueta `@readonly` está presente en la mayoría de las variables de p5.js y se utiliza internamente para indicar que dicho valor no debe ser sobrescrito directamente por un usuario de la biblioteca.

## Agregar ejemplos

Una etiqueta que está presente tanto en los comentarios de referencia de `sin()` como de `mouseX` y que aún no hemos discutido es la etiqueta `@example`. Con esta etiqueta defines el código de (los) ejemplo(s) que se ejecuta cuando visitas la página de referencia.

![Screenshot of the p5.js reference page of the "red()" function, showing only the example code section.](images/reference-screenshot.png)

El código con la etiqueta `@example` que crea el ejemplo anterior es el siguiente:

```
 * @example
 * <div>
 * <code>
 * const c = color(255, 204, 0);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'redValue' to 255.
 * const redValue = red(c);
 * fill(redValue, 0, 0);
 * rect(50, 20, 35, 60);
 * describe(
 *   'Two rectangles with black edges. The rectangle on the left is yellow and the one on the right is red.'
 * );
 * </code>
 * </div>
```

Después de la etiqueta `@example`, debes comenzar con una etiqueta HTML `<div>` seguida de una etiqueta `<code>`. Entre la etiqueta `<code>` de apertura y cierre, insertarás el ejemplo de código en cuestión. El principio básico para escribir un buen ejemplo de código para la referencia es mantener las cosas simples y mínimas. El ejemplo debe ser significativo y explicar cómo funciona la función, valga la redundancia, sin ser demasiado complicado. El lienzo para el ejemplo debe ser de 100x100 pixeles y si la función `setup()` no está incluida, como en el ejemplo anterior, el código será envuelto automáticamente en una función `setup()` con un lienzo predeterminado de fondo gris y 100x100 píxeles. No entraremos aquí en detalles sobre buenas prácticas y estilo para los ejemplos de código; consulta la guía de estilo de referencia en su lugar.

Puedes tener múltiples ejemplos para una función. Para hacerlo agrega un `<div>` y un bloque HTML `<code>` adicionales justo después del primer bloque cerrado, separados por una línea en blanco.

```
* @example
* <div>
* <code>
* arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
* describe('An ellipse created using an arc with its top right open.');
* </code>
* </div>
*
* <div>
* <code>
* arc(50, 50, 80, 80, 0, PI, OPEN);
* describe('The bottom half of an ellipse created using arc.');
* </code>
* </div>
```

Si no deseas que la página de referencia ejecute tu código de ejemplo (es decir, solo quieres que se muestre el código), incluye la clase "`norender`" en el `<div>`:

```
* @example
* <div class="norender">
* <code>
* arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
* describe('ellipse created using arc with its top right open');
* </code>
* </div>
```

Si no quieres que el ejemplo se ejecute como parte de las pruebas automatizadas (por ejemplo, si el ejemplo requiere interacción del usuario), incluye la clase "`notest`" en el `<div>`:

```
* @example
* <div class='norender notest'><code>
* function setup() {
*   let c = createCanvas(100, 100);
*   saveCanvas(c, 'myCanvas', 'jpg');
* }
* </code></div>
```

Si tu ejemplo utiliza archivos externos como recursos, colócalos en la carpeta [/docs/yuidoc-p5-theme/assets](https://github.com/processing/p5.js/tree/main/docs/yuidoc-p5-theme/assets) (o reutiliza uno que ya esté allí) y luego enlázalos con "assets/nombrearchivo.ext" en el código. Consulta la referencia de [tint()](http://p5js.org/reference/#/p5/tint) como ejemplo.

### Agregar descripción a un lienzo usando `describe()`

Por último, para cada ejemplo que añadas, se requiere que utilices la función de p5.js `describe()` en el ejemplo para crear una descripción accesible del lienzo para lectores de pantalla. Incluye sólo un parámetro: una cadena con una breve descripción de lo que está sucediendo en el lienzo.

```
* @example
* <div>
* <code>
* let xoff = 0.0;
* function draw() {
*   background(204);
*   xoff = xoff + 0.01;
*   let n = noise(xoff) * width;
*   line(n, 0, n, height);
*   describe('A vertical line moves randomly from left to right.');
* }
* </code>
* </div>
*
* <div>
* <code>
* let noiseScale = 0.02;
* function draw() {
*   background(0);
*   for (let x = 0; x < width; x += 1) {
*     let noiseVal = noise((mouseX + x) * noiseScale, mouseY * noiseScale);
*     stroke(noiseVal*255);
*     line(x, mouseY + noiseVal * 80, x, height);
*   }
*   describe('A horizontal wave pattern moves in the opposite direction of the mouse.');
* }
* </code>
* </div>
```

Para obtener más información sobre `describe()`, visita la [documentación de accesibilidad web para contribuyentes](https://p5js.org/contributor-docs/#/web_accessibility?id=user-generated-accessible-canvas-descriptions).

Con todo lo anterior, deberías tener la mayoría de las herramientas necesarias para escribir y editar comentarios de referencia de p5.js. Sin embargo, hay algunos usos más especializados de comentarios de referencia estilo JSDoc que puedes encontrar en p5.js. Estos son útiles en situaciones específicas y no son algo que necesites con frecuencia.

### Etiqueta `@private`

Puedes usar la etiqueta `@private` si una propiedad o variable es una función o variable privada. Si una característica está marcada como `@private`, no se renderizará como parte de la referencia en el sitio web. La razón para usar la etiqueta `@private` para marcar un bloque de comentarios de referencia como privado es documentar características internas de la propia biblioteca. Por ejemplo, consulta los comentarios de referencia para `_start` a continuación:


```
/**
 * _start calls preload() setup() and draw()
 *
 * @method _start
 * @private
 */
p5.prototype._start = function () {
```

### `@module` y otras etiquetas relacionadas

En la parte superior de cada archivo de código fuente habrá una etiqueta `@module`. Los módulos corresponden a un grupo de características en p5.js que, al renderizar la página de referencia en el sitio web, se dividen en las secciones correspondientes. Dentro de cada módulo hay submódulos adicionales definidos con la etiqueta `@submodule`.

La etiqueta `@for` define la relación entre este módulo y la clase general `p5`, indicando efectivamente que este módulo es una parte de la clase `p5`.

La etiqueta `@requires` define los módulos de los que depende el módulo actual y es necesario importar.

```
/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 */
```

La convención que sigue p5.js es que cada subcarpeta en la carpeta `src/` será un `@module`, mientras que cada archivo dentro de la subcarpeta será su propio `@submodule` bajo el `@module` general de la subcarpeta. A menos que estés añadiendo nuevas subcarpetas/archivos al código fuente de p5.js, no deberías necesitar editar este bloque de comentarios de referencia.

### Etiqueta `@class`

Los constructores de clases se definen con la etiqueta `@class`y la etiqueta `@constructor`. El formato para este bloque es similar a cómo se define una función con el bloque `@method`; el nombre de la clase debe definirse con la etiqueta `@class` y la etiqueta `@constructor` indicará que la clase tiene una función constructora. Mira el ejemplo de la clase `p5.Color` a continuación:
 
```
/**
 * A class to describe a color. Each `p5.Color` object stores the color mode
 * and level maxes that were active during its construction. These values are
 * used to interpret the arguments passed to the object's constructor. They
 * also determine output formatting such as when
 * <a href="#/p5/saturation">saturation()</a> is called.
 *
 * Color is stored internally as an array of ideal RGBA values in floating
 * point form, normalized from 0 to 1. These values are used to calculate the
 * closest screen colors, which are RGBA levels from 0 to 255. Screen colors
 * are sent to the renderer.
 *
 * When different color representations are calculated, the results are cached
 * for performance. These values are normalized, floating-point numbers.
 *
 * <a href="#/p5/color">color()</a> is the recommended way to create an instance
 * of this class.
 *
 * @class p5.Color
 * @constructor
 * @param {p5} [pInst]                  pointer to p5 instance.
 *
 * @param {Number[]|String} vals        an array containing the color values
 *                                      for red, green, blue and alpha channel
 *                                      or CSS color.
 */
```

## Generando y previsualizando la referencia

El repositorio de p5.js está configurado para que puedas generar y previsualizar la referencia sin necesidad de compilar y ejecutar también el sitio web de p5.js.

- El comando principal para generar la referencia a partir de los comentarios de referencia en el código fuente es el siguiente.

```
npm run docs
```

Esto generará los archivos de vista previa necesarios y el archivo principal `docs/reference/data.json`, que es el mismo archivo (después de la minificación) que se utilizará para renderizar la página de referencia en el sitio web.

- Para trabajar continuamente en la referencia, puedes ejecutar el siguiente comando.

```
npm run docs:dev
```

Esto lanzará una vista previa en vivo de la referencia cuyo renderizado se actualizará cada vez que realices cambios (necesitarás actualizar la página después de realizar cambios para verlos aparecer). Esto es útil, especialmente para previsualizar el código de ejemplos que se ejecutan en el navegador.

- Los archivos de plantilla principales se almacenan en la carpeta `docs/` y, en la mayoría de los casos, no deberías realizar cambios directamente en los archivos de esta carpeta, excepto para añadir nuevos archivos de recursos en la carpeta `docs/yuidoc-p5-theme/assets`.

## Siguientes pasos

Para más detalles sobre el sistema de referencias puedes consultar la documentación de [JSDoc](https://jsdoc.app/) y [YUIDoc](https://yui.github.io/yuidoc/).

Para ver ejemplos de problemas relacionados con las referencias, echa un vistazo a [#6519](https://github.com/processing/p5.js/issues/6519) y [#6045](https://github.com/processing/p5.js/issues/6045). El documento de [pautas para contribuyentes](https://github.com/processing/p5.js/blob/main/contributor_docs/es/contributor_guidelines.md) también es un buen lugar para comenzar.
