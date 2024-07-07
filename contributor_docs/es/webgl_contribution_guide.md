<!-- How to get started working on the p5.js WebGL mode source code. -->

# Guía de Contribución a WebGL

Si estás leyendo esta página, probablemente estés interesado en ayudar a trabajar en el modo WebGL. ¡Gracias, agradecemos tu ayuda! Esta página existe para ayudar a explicar cómo estructuramos las contribuciones de WebGL y ofrecer algunos consejos para realizar cambios.


## Recursos

- Lee nuestra [visión general de la arquitectura WebGL de p5.js](webgl_mode_architecture.md) para entender cómo difiere el modo WebGL del modo 2D. Esta será una referencia valiosa para algunos detalles de implementación para shaders, trazos y más.
- Lee nuestras [instrucciones para contribuidores](https://p5js.org/contributor-docs/#/./contributor_guidelines) para obtener información sobre cómo crear issues, configurar el código base y probar cambios.
- Puede ser útil conocer un poco sobre la API WebGL del navegador, en la que se basa el modo WebGL de p5.js:[WebGL Fundamentals](https://webglfundamentals.org/) repasa muchos conceptos básicos de renderización.
  - [The Book of Shaders](https://thebookofshaders.com/) explica muchas técnicas utilizadas en shaders de WebGL.


## Planificación

Organizamos <em>issues</em> abiertos [en un Proyecto de GitHub](https://github.com/orgs/processing/projects/5), donde los dividimos en algunos tipos:

- **Cambios a nivel del sistema** son objetivos a largo plazo con implicaciones de gran alcance en el código. Estos requieren más discusión y planificación antes de comenzar con la implementación.
- **Errores sin solución aún** son informes de errores que necesitan un poco de depuración para reducir la causa. Estos aún no están listos para ser corregidos: una vez que se encuentra la causa, entonces podemos discutir la mejor manera de corregirla.
- **Errores con soluciones pero sin PR** son errores donde hemos decidido cómo solucionarlo y están libres para que alguien escriba el código.
- **Mejoras menores** son <em>issues</em> para nuevas características que tienen un lugar obvio dentro de la arquitectura actual sin necesidad de discutir cómo encajarlas. Una vez acordado que vale la pena hacerlas, están disponibles para que alguien escriba el código.
- **Funcionalidades 2D** son aquellas que ya existen en p5.js pero no dentro del modo WebGL. El comportamiento esperado de la funcionalidad, una vez implementada, es que coincida con el modo 2D. Es posible que necesitemos discutir la mejor implementación, pero los requisitos del usuario para estos son claros.
- **Funcionalidades que no funcionan en todos los contextos** son aquellas que existen en el modo WebGL pero no funcionan en todas las formas en que se puede usar el modo WebGL. Por ejemplo, algunos métodos de p5.js funcionan tanto con coordenadas 2D como 3D, pero otros fallan si se usan coordenadas 3D. Estás están disponibles para comenzar a trabajar.
- Las **solicitudes de funcionalidad** son todas las demás solicitudes de cambios de código. Estos necesitan un poco de discusión para asegurarnos de que sean cosas que encajen en la hoja de ruta del modo WebGL.
- <em>Issues</em> de **documentación** son aquellos que no necesitan un cambio de código, sino una mejor documentación del comportamiento de p5.js.


## Dónde Colocar el Código

Todo lo relacionado con WebGL está en el subdirectorio `src/webgl`. Dentro de ese directorio, las funciones principales de p5.js se dividen en archivos según el área temática: los comandos para configurar la luz se encuentran en `lighting.js`; los comandos para configurar materiales se encuentran en `materials.js`.

Al implementar clases orientadas al usuario, generalmente intentamos tener un archivo por clase. Estos archivos ocasionalmente pueden tener algunas otras clases de utilidad interna. Por ejemplo, `p5.Framebuffer.js` incluye la clase `p5.Framebuffer`, y también consta adicionalmente de algunas subclases específicas de <em>framebuffer</em> de otras clases principales. Otras subclases específicas de <em>framebuffer</em> pueden ir en este archivo también.

`p5.RendererGL` es una clase grande que maneja una gran cantidad de comportamientos. Por esta razón, en lugar de tener un archivo de clase grande, su funcionalidad se divide en muchos archivos según el área temática. Aquí hay una descripción de los archivos en los que dividimos `p5.RendererGL`, y qué poner en cada uno:


#### `p5.RendererGL.js`

Inicialización y funcionalidad principal.


#### `p5.RendererGL.Immediate.js`

Funcionalidad relacionada con el dibujo de **modo inmediato** (formas que no se almacenarán ni se reutilizarán, como `beginShape()` y `endShape()`)


#### `p5.RendererGL.Retained.js`

Funcionalidad relacionada con el dibujo de **modo retenido** (formas que se han almacenado para su reutilización, como `sphere()`)


#### `material.js`

Gestión de modos de mezcla.


#### `3d_primitives.js`

Funciones orientadas al usuario que dibujan formas, como `triangle()`. Estos definen la geometría de las formas. El renderizado de esas formas luego ocurre en `p5.RendererGL.Retained.js` o `p5.RendererGL.Immediate.js`, tratando la entrada de geometría como una forma genérica.


#### `Text.js`

Funcionalidad y clases con utilidades para renderizar texto.


## Pruebas de Cambios en WebGL

### Pruebas de Consistencia

Hay muchas formas de usar las funciones en p5.js. Es difícil verificar manualmente todo, por lo que agregamos pruebas unitarias donde podemos. De esa manera, cuando hacemos nuevos cambios, podemos tener más confianza en que no rompimos nada si todas las pruebas unitarias siguen pasando.

Al agregar una nueva prueba, si la función es algo que también funciona en el modo 2D, una de las mejores formas de verificar la consistencia es verificar que los píxeles resultantes sean iguales en ambos modos. Aquí hay un ejemplo en una prueba unitaria:

```js
test('coplanar strokes match 2D', function() {
  const getColors = function(mode) {
    myp5.createCanvas(20, 20, mode);
    myp5.pixelDensity(1);
    myp5.background(255);
    myp5.strokeCap(myp5.SQUARE);
    myp5.strokeJoin(myp5.MITER);
    if (mode === myp5.WEBGL) {
      myp5.translate(-myp5.width/2, -myp5.height/2);
    }
    myp5.stroke('black');
    myp5.strokeWeight(4);
    myp5.fill('red');
    myp5.rect(10, 10, 15, 15);
    myp5.fill('blue');
    myp5.rect(0, 0, 15, 15);
    myp5.loadPixels();
    return [...myp5.pixels];
  };
  assert.deepEqual(getColors(myp5.P2D), getColors(myp5.WEBGL));
});
```

Esto no siempre funciona porque no se puede desactivar el <em>antialiasing</em> en el modo 2D, y el <em>antialiasing</em> en el modo WebGL a menudo es ligeramente diferente. Sin embargo, puede funcionar para líneas rectas en los ejes x, y.

Si una funcionalidad es exclusiva de WebGL, en lugar de comparar píxeles con el modo 2D, a menudo verificamos algunos píxeles para asegurarnos de que su color sea el esperado. Algún día, podríamos convertir esto en un sistema más robusto que compare con instantáneas de imagen completas de nuestros resultados esperados en lugar de algunos píxeles, pero por ahora, aquí tienes un ejemplo de verificación de color de píxeles:

```js
test('color interpolation', function() {
  const renderer = myp5.createCanvas(256, 256, myp5.WEBGL);
  // upper color: (200, 0, 0, 255);
  // lower color: (0, 0, 200, 255);
  // expected center color: (100, 0, 100, 255);
  myp5.beginShape();
  myp5.fill(200, 0, 0);
  myp5.vertex(-128, -128);
  myp5.fill(200, 0, 0);
  myp5.vertex(128, -128);
  myp5.fill(0, 0, 200);
  myp5.vertex(128, 128);
  myp5.fill(0, 0, 200);
  myp5.vertex(-128, 128);
  myp5.endShape(myp5.CLOSE);
  assert.equal(renderer._useVertexColor, true);
  assert.deepEqual(myp5.get(128, 128), [100, 0, 100, 255]);
});
```


### Pruebas de rendimiento

Aunque no es la principal preocupación de p5.js, intentamos asegurarnos de que los cambios no causen un gran impacto en el rendimiento. Normalmente, esto se hace creando dos <em>sketches</em> de prueba: uno con su cambio y otro sin él. Luego comparamos las velocidades de fotogramas de ambos.

Algunos consejos sobre cómo medir el rendimiento:

- Deshabilita los errores amigables con `p5.disableFriendlyErrors = true` en la parte superior de tu <em>sketch</em> (o simplemente prueba con `p5.min.js`, que no incluye el sistema de errores amigables)
- Muestra la velocidad de fotogramas promedio para tener una idea clara de la velocidad de fotogramas en estado estable:

```js
let frameRateP;
let avgFrameRates = [];
let frameRateSum = 0;
const numSamples = 30;
function setup() {
  // ...
  frameRateP = createP();
  frameRateP.position(0, 0);
}
function draw() {
  // ...
  const rate = frameRate() / numSamples;
  avgFrameRates.push(rate);
  frameRateSum += rate;
  if (avgFrameRates.length > numSamples) {
    frameRateSum -= avgFrameRates.shift();
  }

  frameRateP.html(round(frameRateSum) + ' avg fps');
}
```

Aquí hay casos que intentamos probar ya que ponen bajo presión diferentes partes del proceso de renderizado:

- Algunas formas muy complicadas (por ejemplo, un modelo 3D grande o una curva larga)
- Muchas formas simples (por ejemplo, `line()` llamado muchas veces en un bucle for)
