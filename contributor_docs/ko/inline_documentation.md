# p5.js에 인라인 문서 추가

p5.js 소스 코드에 인라인 문서를 추가하면 참조가 자동으로 생성 됩니다. 이 문서는 문서에 포함 할 태그와 정보를 설명하여 참조에 적절하게 표시되도록합니다. 참조는 주기적으로 소스 코드에서 자동 생성되므로 문서에 참조가 표시되는 데 시간이 걸릴 수 있습니다. 시간이 더 걸리거나 다른 문제가 있는 경우 [hello@p5js.org](mailto:hello@p5js.org)로 이메일 주세요.

yuidoc에 대한 기본 사항과 스타일에 대한 자세한 내용은 [여기](http://yui.github.io/yuidoc/syntax/index.html)를 참조하세요. __행 길이를 80열로 제한하며, 넘어갈 경우 새 행에서 시작하세요.__

__[필요한 예제 목록](https://github.com/processing/p5.js/issues/1954) (grunt로 라이브러리를 작성하고 로그 메시지를 확인하여 최신 목록을 볼 수도 있습니다.)__

## 요소 타입 및 설명 지정

요소에는 `@class`, `@method`, `@property`, `@event` 4 가지 종류가 있습니다.
요소가 문서에 나타나려면 다음 중 하나를 지정하고, 그 뒤에 요소 이름이 있어야 하며 상단에 설명이 표시되어야합니다. 몇 가지 서식 지정 팁 :
* 마크 다운 문법을 사용해 설명 텍스트의 형식을 지정할 수 있습니다.
* 모든 함수, 변수 또는 상수 이름은 양쪽에 작은 따옴표를 사용하여 '고정 폭'을 가져야 합니다.
* 두개의 줄 바꿈은 새 단락으로 인식됩니다. `<br><br>` 태그를 삽입 할 필요가 없습니다.
* 가능하면 다른 함수나 변수명을 언급 할 때 다른 파일을 링크해주세요. 예를 들면, [loadImage](https://github.com/processing/p5.js/blob/main/src/image/loading_displaying.js#L21)에 대한 설명과 링크가 추가된 사전로드 방법을 살펴볼 수 있습니다.
* 더 많은 구문 정보를 살펴보려면 [yuidoc의 레퍼런스](http://yui.github.io/yuidoc/syntax/index.html#basic-requirements)를 참조해주세요.

```js
   /**
    * The x component of the vector
    * @property x
    * @type {Number}
    */
    this.x = x || 0;
```

```js

  /**
   * Draw an arc
   *
   * If x, y, width, height, start and stop are the only params provided, draws an
   * open pie.
   * If mode is provided draws the arc either open, chord or pie, dependant
   * on the variable provided
   *
   * @param  {Number} x x-coordinate of the arc's ellipse
   * @param  {Number} y y-coordinate of the arc's ellipse
   * @param  {Number} width width of the arc's ellipse by default
   * @param  {Number} height height of the arc's ellipse by default
   * @param  {Number} start angle to start the arc, specified in radians
   * @param  {Number} stop angle to stop the arc, specified in radians
   * @param  {String} [mode] optional parameter to determine the way of drawing the arc
   */
```

```js
  /**
   *
   * Calculates the magnitude (length) of the vector and returns the result
   * as a float (this is simply the equation <em>sqrt(x*x + y*y + z*z)</em>.)
   *
   * @method mag
   * @return {number} magnitude (length) of the vector
   */
   PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
   };
```

## 매개변수 지정

메소드의 경우 모든 `@params`를 지정해야합니다. 공백, 탭 등으로 형식을 지정해서는 안되며 다음 표준을 따라야합니다:

```
@param {type} name Description here, no problem how long.
```

매개 변수가 선택 사항인 경우 이름 주위에 대괄호를 추가합니다:

```
@param {type} [name] Description here.
```

매개 변수가 [`constants.js`](https://github.com/processing/p5.js/blob/main/src/core/constants.js)에 정의 된 하나 이상의 값을 사용하는 경우, 다음 유형은 `{Constant}`로 지정 되어야하며 유효한 값은 `either` 키워드 뒤에 오는 주석에 열거되어야합니다. 예:

```
@param {Constant} horizAlign horizontal alignment, either LEFT, CENTER, or RIGHT
```

## 반환 타입 지정

`@return`은 `@params`과 유사하지만 이름이 없습니다. `@method`의 마지막 요소이어야 하며, JS 타입은 String, Number, Boolean, Object, Array, Null 및 Undefined입니다. 반환 타입이 없는 경우 `@return`을 포함하지 마세요.

```
@return {type} Description of the data returned.
```

메서드가 부모 객체를 반환하는 경우 @return을 건너 뛰고 대신에 다음 줄을 추가 할 수 있습니다:

```
@chainable
```

## 추가 표기

메서드에 여러개의 가능한 매개 변수 옵션이 있을 경우 각각을 개별적으로 지정할 수 있습니다. 예를 들면 "syntax" 아래에 [background](http://p5js.org/reference/#p5/background)의 예제를 참조해주세요. 이렇게 하기 위해서 위의 지침에 따라 첫 번째로 표기하여 나열 할 버전 하나를 선택해주세요. 문서 블록의 끝에서 다음 예제에 따라 자체 블록에 추가 표기를 할 수 있습니다.

```js
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

참고:
* 이전에 매개 변수가 정의 된 경우 'a'와 같이 정의할 내용을 다시 채울 필요가 없습니다.
* 두 표기의 유일한 차이점이 선택적인 매개 변수의 유뮤일 경우 별도의 표기를 할 필요가 없습니다.
* [배경](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/setting.js#L106) 및 [색상](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/creating_reading.js#L241)의 소스 코드에서 해당 인라인의 두 가지 예제를 살펴 볼 수 있습니다.

## 다른 태그들 지정

프로퍼티 또는 변수가 상수 인 경우 `@final` 사용합니다:

```js
    /**
     * PI is a mathematical constant with the value 3.14159265358979323846.
     * @property PI
     * @type Number
     * @final
     */
    PI: PI
```


프로퍼티 또는 변수가 private 변수 인 경우 `@private`를 사용합니다 (기본값은 `@public`이므로 지정할 필요가 없음).

```js
    /**
     * _start calls preload() setup() and draw()
     * 
     * @method _start
     * @private
     */
     p5.prototype._start = function () {
```

## 파일에 대한 모듈 지정

각 *파일* 상단에는 `@module` 태그가 있어야합니다. 모듈은 JavaScript 파일 (또는 require.js 모듈)과 일치해야 하며, 항목리스트에서 그룹으로 작업할 수 있습니다. 여기를 참조해주세요: http://p5js.org/api/#methods(모듈은 COLOR, IMAGE, PVECTOR 등이 있습니다.)

```js
/**
 * @module image
 */
define(function (require) {
  // code here
};
```


## 생성자

생성자는 `@class`로 정의됩니다. 각 생성자는 `@class` 태그와 클래스명, `@constructor` 태그 및 필요한 모든 `@param` 태그를 가지고 있어야 합니다.

```js
  /**
   * The p5 constructor function.
   * @class p5
   * @constructor
   * @param {Object} [node] The canvas element. A canvas will be added to the DOM if not provided.
   * @param {Object} [sketch] The sketch object.
   */
   const p5 = function( node, sketch) {
     ...
   }
```

## 예제 코드 추가하기

선택적으로 `@example`로 예제를 추가 할 수 있습니다. 예제 코드는 주석이 포함 된 `<code> </ code>`태그 사이에 삽입 되어야 합니다. `setup()` 함수로 별도로 지정하지 않는 한 각 `<code>`블록은 회색 배경의 100x100 픽셀 캔버스에서 자동으로 실행됩니다. JS를 배우는 초보자를 위한 가장 낮은 장벽으로 예제에 모든 변수는 `let`으로 정의합니다. 올바른 포맷인지 확인하려면 다른 src 파일의 예제를 참조하세요. 예제에서 캔버스와 별도로 다른 html 요소를 생성할 경우 너비가 100픽셀로 렌더링됩니다.

```
@example
<div>
<code>
arc(50, 55, 50, 50, 0, HALF_PI);
noFill();
arc(50, 55, 60, 60, HALF_PI, PI);
arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
</code>
</div>
``` 

하나의 함수에 대해 여러 예제를 가질 수 있습니다. 단, `<div>`으로 감싸져서 줄바꿈으로 구분된 예제에는 하나의 @example를 가질 수 있습니다.

```
@example
<div>
<code>arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);</code>
</div>

<div>
<code>arc(50, 50, 80, 80, 0, PI, OPEN);</code>
</div>
```

예제에서 코드를 실행하지 않으려면 (예: 코드만 표시하려는 경우) div에 "norender" 클래스를 포함해 주세요:
```
@example
<div class="norender">
<code>arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);</code>
</div>
```

예제가 빌드 테스트의 일부로 실행되는 것을 원하지 않는 경우 (예: 예제에 사용자 인터렉션이 필요하거나 headless-Chrome 테스트 프레임 워크에서 지원하지 않는 기능을 사용하는 경우) div에 "notest" 클래스를 포함합니다.:
```
@example
<div class='norender notest'><code>
function setup() {
  let c = createCanvas(100, 100);
  saveCanvas(c, 'myCanvas', 'jpg');
}
</code></div>
```

외부 에셋 파일에 연결해야 하는 경우, [/docs/yuidoc-p5-theme/assets](https://github.com/processing/p5.js/tree/main/docs/yuidoc-p5-theme/assets)에 파일을 넣고 "assets/filename.ext"로 연결합니다. [tint 예제](http://p5js.org/reference/#/p5/tint)를 참조해주세요.

### alt-text 추가
마지막으로, 추가하는 모든 예제에 [alt-text](https://moz.com/learn/seo/alt-text)을 추가해 시각 장애인이 화면에 보여지는 예시를 이해할 수 있도록 합니다. 주어진 함수(각각 아래의 개별 `@alt` 태그가 아님)에 모든 예제 끝에 `@alt` 태그를 추가할 수 있으며, 여러 예제에 대한 설명을 구분하기 위해 줄 바꿈을 추가합니다.

```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
}
</code>
</div>

<div>
<code>
let noiseScale=0.02;
function draw() {
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
}
</code>
</div>

@alt
vertical line moves left to right with updating noise values.
horizontal wave pattern effected by mouse x-position & updating noise values.
```

## 메소드를 위한 템플릿
여기 잘 문서화된 메소드에 대한 예제가 있습니다. 새로운 메소드를 생성하기 위해, [이 템플릿](https://github.com/processing/p5.js/tree/main/contributor_docs/method.example.js)을 사용할 수 있습니다. 텍스트를 메소드의 변수로 바꾸고, 남겨진 변수는 제거 할 수 있습니다.

![메서드에 대한 인라인 문서 예제를 보여주는 이미지](https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/images/method-template-example.png)


## 문서 생성

* 먼저 `npm run docs`를 한 번 실행하여 필요한 모든 로컬 파일과 소스 코드의 참조 사본을 생성합니다. yuidoc 레퍼런스 페이지 뒤에서 코어 JS 파일을 변경할 때마다 다시 실행해주세요. 이는 src의 인라인 문서 변경이 아니라 yuidoc-p5-theme-src 폴더에있는 파일에 대한 변경 사항입니다.
* 소스 코드만 변경했다면 `npm run grunt yui`만 실행할 수 있지만 `npm run grunt yui:build`도 사용할 수 있습니다.
* `npm run docs:dev`를 실행하여 변경할 때마다 업데이트되는 사이트의 실시간 미리보기를 할 수 있습니다.(변경 한 후 페이지를 새로고침해야 표시됩니다.)

빌드 레퍼런스는 docs/reference에서 찾을 수 있으며. 로컬에서 미리 보려면 `npm run grunt yui:dev`를 실행해 http://localhost:9001/docs/reference/ 에서 살펴보세요.


## 스페인어 버전

[스페인어 버전](http://p5js.org/es/reference)은 약간 다르게 생성되었습니다. 해당 자료를 업데이트하기위한 [안내](https://github.com/processing/p5.js-website/blob/main/contributor_docs/i18n_contribution.md)는 다음과 같습니다.
