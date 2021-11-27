# p5.js 친절한 에러 시스템(Friendly Error System, FES)

## 개요

FES는 학습을 시작할 때 일반적인 사용자 오류를 겪는 새로운 프로그래머를 돕도록 설계되었습니다. 이 시스템은 일반적인 시작 오류를 잡아내고, 사용자가 그 오류를 해결하도록 명확한 표현과 링크를 제공합니다. FES는 사용자가 막 시작할 때 마주칠 수 있는 함수에만 적용됩니다. 서버를 실행하지 않고 파일을 로드한다거나, URL로 loadImage() 함수를 호출하는 등의 특히 일반적인 문제는 예외입니다.  

FES의 목표는 종종 암호화된 콘솔 오류를 보완하기 위해 이해하기 쉬운 오류 메시지를 생성하는 것입니다. 예를 들어, 자바스크립트는 기본적으로 파라미터의 타입 검사를 지원하지 않기 때문에 경험이 없는 자바스크립트 개발자는 파라미터 입력 시 발생하는 에러를 발견하기가 더욱 어렵습니다.

FES 메시지는 (우리가 이해할 수 있는) 보통의 언어로 되어 있고, 문서로도 연결되며, 초보자 수준으로 작성되었습니다. 오류들은 p5.js를 통해 여러 파일에서 발생하지만, 대부분의 작업과 오류 작성은 `src/core/friendly_errors`에서 일어납니다.

기본적으로, `p5.js`에서는 FES가 활성 상태이고, `p5.min.js`에서는 비활성 상태입니다. FES를 비활성화 하려면 `p5.disableFriendlyErrors = true;` 설정하면 됩니다.

FES는 네 종류의 오류를 감지하고 메시지를 출력할 수 있습니다.

1. `validateParameters()`는 인라인 문서 기반으로 함수의 입력 파라미터를 점검합니다.

2. `friendlyFileLoadError()`는 파일 로딩 오류를 잡아냅니다. 이 두 종류의 오류 검사는 기존의 (선택된) p5 함수에 통합되었지만, 개발자는 `p5._validateParameters()` 함수를 호출하여 더 많은 p5 함수나 자체 라이브러리를 추가할 수 있습니다.

3. 유용한 오류 메시지를 얻기 위해 어느 함수에서나 `friendlyError()`를 호출할 수 있습니다.

4. `helpForMisusedAtTopLevelCode()`는 윈도우 로드 때 호출되며, setup()이나 draw() 외부에서 p5.js 함수를 사용할 수 있는지 확인합니다.

자세한 기술 정보는 [src/core/friendly_errors/fes_core.js](https://github.com/processing/p5.js/blob/main/src/core/friendly_errors/fes_core.js)에서 인라인 메모를 참고하세요.

### `core/friendly_errors/file_errors/friendlyFileLoadError()`: 
* 이 함수는 파일이 올바로 로드되지 않으면 친절한 오류 메시지를 생성하고, 표시합니다. 그리고 로드하기에는 파일이 너무 큰지 확인해서 경고를 생성하기도 합니다.
* 이것은 다음과 같이 호출할 수 있습니다.: `p5._friendlyFileLoadError(ERROR_TYPE, FILE_PATH)`.
* 파일 로딩 오류 예시:
````javascript
/// 폰트 파일 누락
let myFont;
function preload() {
  myFont = loadFont('assets/OpenSans-Regular.ttf');
};
function setup() {
  fill('#ED225D');
  textFont(myFont);
  textSize(36);
  text('p5*js', 10, 50);
};
function draw() {};
/// 콘솔에 다음의 메시지가 생성됩니다.:
/// > p5.js: 폰트를 로드하는 데 문제가 있는 것 같습니다. 파일 경로 [assets / OpenSans-Regular.ttf]가 올바른지, 폰트를 온라인 호스팅하는지, 또는 로컬 서버가 실행 중인지 확인하십시오.

````
* 현재 버전에는 `image`, `XML`, `table`, `text`, `json`, `font`에 대한 오류 메시지를 생성하는 템플릿이 포함되어 있습니다.
* `image/loading_displaying/loadImage()`, `io/files/loadFont()`, `io/files/loadTable()`, `io/files/loadJSON()`, `io/files/loadStrings()`, `io/files/loadXML()`, `io/files/loadBytes()`에 구현되었습니다.
* 파일 크기가 커서 로드하는 중 생기는 오류는 모두 loadX 메소드에 구현되었습니다. 

### `core/friendly_errors/validate_params/validateParameters()`:
* 이 함수는 `docs/reference/data.json`에 있는 입력 파라미터 정보와 일치하는지 파라미터 검증을 실행합니다. 이것은 함수 호출이 올바른 개수와 파라미터형을 가지고 있는지 확인합니다.

* 파라미터 누락 예시:
````javascript
arc(1, 1, 10.5, 10);
/// 콘솔에 다음의 메시지가 생성됩니다.:
/// > pt.js: arc() 함수의 입력 파라미터 중 4번째 자리(인덱스는 0부터 시작)에 빈 값이 들어온 것 같습니다. 의도한 것이 아니라면, 이것은 종종 범위의 문제입니다.: [https://p5js.org/examples/data-variable-scope.html]. [http://p5js.org/reference/#p5/arc]
/// > pt.js: arc() 함수의 입력 파라미터 중 5번째 자리(인덱스는 0부터 시작)에 빈 값이 들어온 것 같습니다. 의도한 것이 아니라면, 이것은 종종 범위의 문제입니다.: [https://p5js.org/examples/data-variable-scope.html]. [http://p5js.org/reference/#p5/arc]

````
* 자료형 오류 예시:
````javascript
arc('1', 1, 10.5, 10, 0, Math.PI, 'pie');
/// 콘솔에 다음의 메시지가 생성됩니다.:
/// > p5.js:arc() 함수의 입력 파라미터 중 0번째 자리에는(인덱스는 0부터 시작)에는 숫자가 들어와야 하는데 문자열이 들어왔습니다. [http://p5js.org/reference/#p5/arc]
````
* 이것은 다음과 같이 호출할 수 있습니다.: `p5._validateParameters(FUNCT_NAME, ARGUMENTS)` 또는 `p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)` 는 파라미터 검증이 필요한 함수 내부에서 씁니다. 일반적인 목적으로는 `p5._validateParameters` 를 사용하는 것이 좋습니다. `p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)` 은 주로 디버깅이나 단위 테스트 목적으로 사용합니다.
* `color/creating_reading`, `core/2d_primitives`, `core/curves`, 그리고 `utilities/string_functions` 의 함수로 구현되어 있습니다. 

## 추가 기능
* FES는 p5와 친절한 디버거로 개발자들을 환영합니다.  
* FES는 IDE와 웹 에디터에서 동작합니다.

## 개발자 유의사항
* p5.js 객체를 생성할 때: 파라미터로 사용될 모든 p5.js 객체는 클래스 선언부에서 `name` 파라미터(오브젝트의 이름) 값을 지정해야 합니다. 예를 들면 다음과 같습니다.: 

````javascript 
p5.newObject = function(parameter) {
   this.parameter = '파라미터';
   this.name = 'p5.newObject';
};
````
* 인라인 문서: 허용되는 파라미터 타입은 `Boolean`, `Number`, `String`, 그리고 객체의 이름(위의 주요 항목 참고)입니다. 유형에 관계없이 배열 파라미터에는 `Array` 를 쓰세요. 필요한 경우, 어떤 특정 타입의 배열 파라미터가 허용되는지(예시 `Number[]`, `String[]`) 설명 섹션에 적습니다.
* 현재 지원되는 클래스 타입은 이렇습니다( `name` 파라미터를 가집니다): `p5.Color`, `p5.Element`, `p5.Graphics`, `p5.Renderer`, `p5.Renderer2D`, `p5.Image`, `p5.Table`, `p5.TableRow`, `p5.XML`, `p5.Vector`, `p5.Font`, `p5.Geometry`, `p5.Matrix`, `p5.RendererGL`.

## FES 비활성화

기본적으로, FES는 p5.js에서 활성 상태입니다. p5.min.js에서는 FES 기능이 프로세스 속도를 저하시키지 않도록 비활성화되어 있습니다. 오류 검사 시스템은 코드를 상당히 느리게 할 수 있습니다(일부 경우 최대 10 배). 오류 성능 테스트를 참조하십시오. [friendly error performance test](https://github.com/processing/p5.js-website/tree/main/src/assets/learn/performance/code/friendly-error-system/).
아래 한 줄의 코드로 FES를 비활성화 할 수 있습니다.:

```javascript
p5.disableFriendlyErrors = true; // FES 비활성화

function setup() {
  // 설정 작업
}

function draw() {
  // 실행 작업
}
```

이렇게 하면 FES에서 성능 저하를 일으키는 부분(인자 확인 같은)이 비활성화됩니다. 성능에 영향을 주지 않는 부분(파일 로드 실패 시 오류나 전역에서 p5.js 함수를 오버라이드 할 경우 경고 등)은 그대로 유지됩니다.

## 알려진 제한사항
* FES는 프로그램 속도를 늦춥니다. 옵션에서 `p5.disableFriendlyErrors = true;`를 설정하여 비활성화 할 수 있습니다. 그리고 축소 버전(`p5.min.js`)에서는 FES 기본 설정이 비활성입니다.
* FES에서는 오류가 정상으로 처리되는 상황이 발생할 수 있습니다. 이런 경우는 보통, 함수가 설계된 형태와 실제 사용하는 방식이 일치하지 않을 때 생깁니다(예시: 그리기 함수는 원래 2D와 3D 설정에서 서로 바꿔 사용할 수 있도록 설계되었습니다). 예를 들어, 아래 코드로 3D 라인을 그리면 FES에 잡히지 않습니다. 왜냐하면, `line()` 의 2D 그리기 설정 인라인 문서에는 (`Number`, `Number`, `Number`, `Number`) 파라미터 패턴이 허용되기 때문입니다. 이것은 또한 현재 버전의 FES가 `_renderer.isP3D` 와 같은 환경 변수를 확인하지 않는다는 의미이기도 합니다.
```javascript 
const x3; // undefined
line(0, 0, 100, 100, x3, Math.PI);
```
 * FES는 `const` 또는 `var` 를 사용해 선언할 때 덮어 쓴 전역 변수만 감지할 수 있습니다. `let`을 사용했다면 감지되지 않습니다. `let`이 변수를 인스턴스화하는 방식 때문에 현재는 해결이 어렵습니다.

## 진행 중
* 보다 일반적인 오류 유형을 식별하고 일반화합니다. (예시: `bezierVertex()`, `quadraticVertex()` - 필수 객체를 초기화하지 않음; `nf()` `nfc()` `nfp()` `nfs()` 에서 숫자형 파라미터의 양수 체크)

## 향후
* 웹 에디터에서 색상 코드를 재도입합니다.
* 더 많은 단위 테스트를 합니다.
* 더 직관적인 메시지를 출력합니다.
* `validateParameters()`에 대한 스페인어 번역도 완료합니다.
* 색맹 친화적이 되도록 모든 색상을 점검합니다.
* 보다 정교한 아스키 코드는 언제나 환영입니다.
* 전역 오류를 잡습니다. 브라우저가 콘솔로 던지는 오류를 잡아내면 매우 도움이 될 것입니다. 그러면 그것과 일치하는 유용한 주석을 볼 수 있습니다.

```javascript
// 이 코드 조각은 window.console 메소드를 그 기능을 수정하는 새 함수로 감싼다.
// 이것은 현재 구현되어 있지 않지만, 더 잘 형식을 갖춘 오류 메시지를 제공할 수 있을 것이다.
const original = window.console;
const original_functions  = {
  log: original.log,
  warn:  original.warn,
  error: original.error
}

["log", "warn", "error"].forEach(function(func){
window.console[func] = function(msg) {
// 래퍼 함수에서 잡아낸 'msg'로 무엇인가 처리한 다음 원래 함수를 호출하라.
original_functions[func].apply(original, arguments)
};
});
```
