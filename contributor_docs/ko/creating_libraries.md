
p5.js 라이브러리는 p5.js의 핵심 기능을 확장하거나 추가하는 모든 자바스크립트 코드가 될 수 있습니다. 라이브러리에는 두 가지 범주가 있습니다. 코어 라이브러리(DOM 및 Sound)는 p5.js 배포의 일부이며 기여된 라이브러리는 p5.js 커뮤니티의 구성원이 개발, 소유 및 유지 관리합니다.

여러분이 라이브러리 하나를 만들고 있고, [p5js.org/libraries](https://p5js.org/libraries) 페이지에 포함하고 싶다면, [이 폼](https://docs.google.com/forms/d/e/1FAIpQLSdWWb95cfvosaIFI7msA7XC5zOEVsNruaA5klN1jH95ESJVcw/viewform)을 제출해 주세요.

# 새로운 라이브러리 생성하기

자바스크립트를 작성하고 사용하는 방법에는 여러 가지가 있으므로 저희는 이 작업을 여러분에게 맡기도록 하겠습니다. 다음은 라이브러리가 p5.js 에서 잘 동작하도록 하기 위한 참고 사항입니다.

## 코드

### p5.prototype에 메소드를 추가하여 p5 핵심 기능을 확장 할 수 있습니다.
예를 들어, dom.js의 다음 코드는 DOM에 [HTMLImageElement](https://developer.Mozilla.org/en-US/docs/Web/API/HTMLImageElement)를 추가하는 `createImg()`메소드를 추가하기 위해 p5를 확장하는 것입니다.

  ```js
  p5.prototype.createImg = function (src) {
    const elt = document.createElement('img');
    //const elt = new Image; // 위에 1행보다 더 짧게 대체 할 수 있습니다.

    elt.src = src;
    return addElement(elt, this);
  };
  ```
  DOM 라이브러리가 프로젝트에 포함되면 `createImg()`는 `createCanvas()` 또는 `background()`와 함께 호출 될 수 있습니다.

### 내부 helpers를 위한 private 함수 사용하기
사용자에 의해 호출되지 않을 목적의 함수를 의미합니다. 위의 예제의 `addElement()`는 [dom.js](https://GitHub.com/processing/p5.js/blob/master/src/dom/dom.js)에서 내부 함수 입니다. 하지만 `p5.prototype`에는 공개적으로 바운드 되지 않았습니다.

### 프로토타입에 메소드를 추가하여 p5.js 클래스를 확장 할 수 있습니다.
아래 예제에서 `p5.Element.prototype`은 `html()` 메소드와 함께 확장되어 엘리먼트의 내부 html을 설정합니다.

  ```js
  p5.Element.prototype.html = function (html) {
    this.elt.innerHTML = html;
    //this.elt.textContent = html; //innerHTML보다 훨씬 더 안전한 대안 입니다.
  };
  ```

### preload()에서 호출 될 수 있도록 p5에 메소드 이름을 등록하려면 registerPreloadMethod()를 이용하세요.

일반적으로 소리, 이미지 또는 기타 외부 파일 로딩과 같은 일부 비동기 기능에는 동기 및 비동기 옵션이 모두 제공됩니다. 예를 들어, `loadStrings(path, [callback])` 은 두번째 매개변수로 선택적으로 콜백 함수를 허용합니다.이 함수는 loadStrings 함수가 완료된 후 호출됩니다. 그러나 사용자는 콜백함수 없이 `preload()`에서 loadStrings를 호출 할 수 있으며 p5.js는 `preload()`의 모든 작업이 완료 될 때까지 기다렸다가 `setup()`으로 이동합니다. 메소드를 등록하고 싶다면, 등록하고자 하는 메소드명과 함께 `registerPreloadMethod()`를 호출하고, 프로토타입 객체를 ~~(기본값은 p5.prototype)~~ 포함하여 메소드에 전달합니다.
아래 예제는 "soundfile.js"(p5.sound 라이브러리)에 `loadSound()`를 등록하는 행 하나를 보여줍니다.

  ```js
  p5.prototype.registerPreloadMethod('loadSound', p5.prototype);
  ```

### _callback_ 및 **preload()** 에 대한 비동기 함수의 예제.
```js
// preload() 또는 콜백과 함께 사용하기 위한 비동기 함수의 예제
p5.prototype.getData = function (callback) {

  // 비동기 함수에서 데이터를 복제하고 반환할 객체를 만듭니다.
  // 덮어쓰거나 재할당하지 않고, 아래 객체를 업데이트해야 합니다.
  // preload()가 원래 포인터/레퍼런스를 유지하는 것이 중요합니다.
  // const로 변수를 선언하면 실수로 재할당하는 경우를 방지해 줍니다.
  const ret = {};

  // 여러분이 작업할 비동기 함수의 일부입니다.
  loadDataFromSpace(function (data) {

    // 데이터의 프로퍼티들을 반복합니다.
    for (let prop in data) {
      // ret의 프로퍼티들을 데이터의 프로퍼티들로 설정(복제)합니다.
      // 즉, 전달받은 데이터의 프로퍼티들로 빈 ret 객체를 업데이트합니다.
      // 하지만 다른 객체로 ret을 덮어쓰거나 재할당할 수는 없습니다.
      // 오히려 콘텐츠를 데이터로 업데이트해야 합니다.
      ret[prop] = data[prop];
    }

    // 콜백이 함수인지 아닌지 확인합니다.
    if (typeof callback == 'function') {
      callback(data); // 콜백 실행
    }
  });
  // 위의 데이터로 채워진 객체를 반환합니다.
  return ret;
};
```

### _**p5**_ 에 여러번 호출되는 함수를 등록하려면 **registerMethod()** 를 사용하세요.

  ```js
  p5.prototype.doRemoveStuff = function () { 
    // 제거하는 기능을 위한 라이브러리
  };
  p5.prototype.registerMethod('remove', p5.prototype.doRemoveStuff);
  ```

등록 할 수있는 메소드 이름은 다음과 같습니다. 함수를 등록하기 전에 먼저 함수를 정의해야 할 수 있습니다.

  * **pre** — `draw()` 시작 시 호출됩니다. 드로잉에 영향을 줄 수 있습니다.
  * **post** — `draw()` 끝에 호출됩니다.
  * **remove** — `remove()`가 호출되면 호출됩니다.
  * **init** — 스케치가 처음 초기화 될 때 스케치 초기화 함수(`p5` 생성자로 전달 된 것)가 실행되기 전에 호출됩니다. 전역 모드 설정 전에 호출되기 때문에 여러분의 라이브러리는 스케치에 무엇이든 추가 할 수 있으며 전역 모드가 활성화되어 있으면 자동으로 `window `에 복사됩니다.

이 목록을 대략적으로 정리하면 다음과 같습니다.
https://GitHub.com/processing/processing/wiki/Library-Basics#library-methods

### 여러분만의 클래스를 생성 할 수 있습니다.

여러분의 라이브러리는 p5 또는 p5 클래스를 전혀 확장하지 않고 대신에 인스턴스화하고 라이브러리와 연계하여 사용할 수 있는 추가 클래스를 제공할 수 있습니다. 또는 둘 다 혼합 할 수 있습니다.

## 작명

* **p5 함수 또는 프로퍼티들을 덮어 쓰지 않아야 합니다..** p5.prototype을 확장 할 때는 기존 프로퍼티 또는 함수명을 사용하지 않도록 주의해야 합니다. [hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 를 사용하여 이름을 확인해 볼 수 있습니다.
예를 들면, 여러분의 라이브러리 파일 맨 위에서 다음 행을 추가하면 이미 `rect()` 메소드가 존재하기 때문에 true 를 출력할 것입니다.

  ```js
  console.log(p5.prototype.hasOwnProperty('rect'));
  ```

* **위와 유사하게 p5 클래스 함수 또는 프로퍼티들을 덮어 쓰지 않아야합니다.** p5.Image, p5.Vector, p5.Element 등을 확장하는 경우 위와 동일한 프로토콜을 따라야 합니다.

* **p5.js는 전역 모드와 인스턴스 모드, 이렇게 두 가지 모드가 있습니다.** 전역 모드에서 모든 p5 속성과 메서드는 window 객체에 바인딩되므로 사용자는 접두사 없이 `background()` 와 같은 메서드를 호출 할 수 있습니다. 그러나 기본 자바스크립트 기능을 덮어 쓰지 않도록 주의해야 합니다. 콘솔에 또는 빠르게 Google 검색으로 기존 JS 이름들이 존재하는지 테스트 해 볼 수 있습니다.

* **일반적으로 클래스는 대문자로 표시되며 메서드와 프로퍼티들은 소문자로 시작합니다.** p5의 클래스들은 앞에 p5가 붙습니다. 저희는 이 네임스페이스를 p5 코어 클래스에만 붙이려고 합니다. 따라서 직접 만들 때 **클래스명에 접두사로 p5를 포함하지 않아야 합니다.** 고유한 접두사나 접두사가 없는 이름으로 생성해 주세요.

* **p5.js 라이브러리 파일 이름에도 p5가 붙지만 다음 단어는 소문자**로, 클래스와 구별됩니다. 예를 들어 p5.sound.js가 있습니다. 파일 이름을 지정하려면 다음과 같은 형식을 따라주세요.

## 패키징하기

* **라이브러리가 포함 된 단일 JS 파일을 만듭니다.** 사용자가 쉽게 라이브러리를 프로젝트에 연결할 수 있습니다. 더 빠른 로딩을 위해 일반 JS 파일과 [최소화된](http://jscompress.com/) 버전 모두에 대한 옵션에 대해 고려 해 볼 수 있습니다.

* **기여된 라이브러리는 제작자가 호스팅, 문서화 및 유지 관리합니다.** 라이브러리들은 GitHub, 별도의 웹 사이트 또는 어딘가에 있을 수 있습니다.

* **문서가 핵심입니다!** 라이브러리 문서는 사용자가 쉽게 찾아보고 다운로드 하여 사용할 수 있는 곳에 있어야 합니다. 기여된 라이브러리에 대한 문서는 기본 p5.js 레퍼런스에 포함되지 않지만 여러분이 유사한 형식을 따르고 싶을 수도 있습니다. [라이브러리 개요 페이지](http://p5js.org/reference/#/libraries/p5.sound), [클래스 개요 페이지](http://p5js.org/reference/#/p5.Vector) 및 [메소드 페이지](http://p5js.org/reference/#/p5/arc) 의 예제를 참조하세요.

* **예제가 좋습니다!** 사람들에게 라이브러리가 할 수 있는 일을 보여주세요. 모두 자바스크립트이므로 사람들은 라이브러리를 다운로드하기 전 온라인에서 실행 되는 것을 볼 수 있습니다. 예제들을 호스팅하기 쉬운 
[jsfiddle](http://jsfiddle.net/) 및 [codepen](http://codepen.io)이라는 두가지 좋은 옵션이 있습니다.

* **알려주세요!** 라이브러리를 배포 할 준비가 되면 [hello@p5js.org](mailto:hello@p5js.org)로 링크와 몇 가지 정보와 함께 보내주세요. [라이브러리 페이지](http://p5js.org/libraries/)에 추가 할 것입니다.
