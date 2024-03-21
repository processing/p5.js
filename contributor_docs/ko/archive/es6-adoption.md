## ES6 채택
최근 p5.js는 코드베이스에서 복잡성을 줄이고, 가독성을 높이며, 새로오신 분들 및 숙련된 기여자 모두에게 우아하고 효과적인 코딩 방법을 지원하는 기능을 용이하게 하기 위해, ECMAScript 2015(ES6) 언어 명세를 채택했습니다. 

전환 절차는 처음에 p5를 ES6로 마이그레이션하는 것으로 [논의되었고](https://github.com/processing/p5.js/issues/3758), 이후에 ES6 명세에 따라 코드베이스에서 문법이 광범위하게 변경되었습니다. 초기 전환에 대한 정보는 [여기](https://github.com/processing/p5.js/pull/3874)에서 확인 할 수 있습니다. 이러한 변경 사항은 ES6기능에 따라 주요한 혹은 흔하게 볼수 있는 문법을 수정하는 것 뿐만아니라 ES6 표준을 바탕으로 라이브러리를 처리, 린팅(linting) 및 테스트에 용이 하도록 빌드 시스템을 약간 수정하는 것들이 포함되어 있습니다.

이 글을 쓰는 시점에서 이러한 전환은 결코 완전한 것이 아니며 ES6의 가능한 모든 기능을 반영하거나 구현하지 않습니다. 커뮤니티의 관심사 및 표준에 부합할 때 ES6 기능을 적절하고 효율적으로 활용하기 위해 보다 원활한 전환을 촉진하기 위한 것이고 기여자들이 점차 새로운 스타일과 기능을 따르도록 동기를 부여하기 위함입니다.

따라서 우리는 모든 기여자들이 다음과 같은 기능을 사용하는 커밋 및 풀 리퀘스트에서 ES6 표준을 준수하도록 권장합니다:
1. 자바스크립트와 관련된 문법적 모호성 및 특수성 감소
2. 가독성 및 코드 명확성 향상
3. 코드 난독화 및 과도한 추상화 (가독성을 돕기 위해) 자제
4. 새로운 분들을 위한 적절한 코딩 방식 장려
5. 손쉬운 기여와 개발
6. 성능을 희생하지 않기

p5에서 아직 사용하지 않은 많은 ES6 기능이 있습니다. 하지만 영역에서 다음을 포함하지만, 이에 국한되지 않는 기능을 라이브러리에서 활용하므로서 이점을 얻을 수 있습니다:
- 제너레이터
- 숫자 타입 검사
- Set/Map 데이터 구조
- 형식화 배열
- [기타](http://es6-features.org/)

ES6 표준을 완전히 준수하려면 p5의 모든 영역에서 커뮤니티의 노력이 필요하며, 그 특성때문에 점진적인 과정이 필요하다는 점에 주목할 필요가 있습니다.

### 관련 
- [공식 ES6 언어 명세](https://www.ecma-international.org/ecma-262/6.0/)
- [ES6 성능 비교](http://incaseofstairs.com/six-speed/)
- [ES6 기능: 개요 및 비교](http://es6-features.org/)
- [You Don't Know JS: ES6 & Beyond (도서)](https://github.com/getify/You-Dont-Know-JS/tree/master/es6%20%26%20beyond)
- [ES6 탐험하기 (도서)](https://exploringjs.com/es6/)

### 성능
우리의 목표는 ES6 표준을 준수하는 것이지만, p5는 성능 코드에 의존한다는 점에 유의해야합니다. 이 글을 작성하는 시점에서, ES6의 많은 기능들은 성능 저하, 병목 현상 및 오버 헤드와 연관이 있습니다. 따라서 코드 성능이 저하되는 ES6 기능을 사용하지 않는 것이 중요합니다. 하지만 브라우저 엔진 개발자가 새로운 기능의 성능 향상에 적극적으로 참여하고 있다는 점에서 일시적인 문제인 것 같습니다. 그러나 당분간은 특히 문법 변경으로 인해 커뮤니티의 목표와 상응하는 주요한 개선이 이루어지지 않는 경우 ES6 표준을 완전히 준수하는 것보다 성능을 우선시하는 것이 중요합니다.

ES6 기능들의 성능을 비교하려면 [이 링크](http://incaseofstairs.com/six-speed/)를 참조해주세요.

성능 우선 순위를 강조한 토론에 대해서는 `forEach`의 사례를 [여기](https://github.com/processing/p5.js/issues/3758#issuecomment-507922753)에서 확인 할 수 있습니다.

### 브라우저 호환성 및 트랜스파일링

p5는 대규모 사용자층에게 접근성을 유지하면서 최신 기능을 지원하기 위해 [브라우저 목록](https://github.com/browserslist/browserslist)의 '최근 두개의 버전' 및 '계속 유지보수 되는 버전'을 기반으로 작성되었습니다. 지원되는 브라우저를 확인하려면 [이 링크](https://browserl.ist/?q=last+2+versions)를 확인해 주시길 바랍니다. 또한, 현재 p5는 [Babel](https://babeljs.io/)을 사용하여 이전 ES5 표준으로 [트랜스파일링](https://en.wikipedia.org/wiki/Source-to-source_compiler))합니다. 이는 ES6 또는 자바스크립트의 최신 기능을 사용하더라도 라이브러리를 프로덕션 용으로 빌드 할 때 모든 기능이 이전 ES5 표준으로 변환됨을 의미합니다.(`p5-min.js`).이는 인터넷 익스플로러와 같이 새로운 기능을 지원하지 않는 구형 브라우저 및 모바일 장치와의 호환성을 보장하기 위함입니다. 따라서 브라우저의 호환성을 인지하는 것은 중요하지만 ES6 기능은 광범위하게 지원되는 ES5 표준으로 변환되며, 대부분의 경우 변환 기능 덕분에 기능의 호환성을 무시할 수 있습니다.

이 문서를 읽으면서, 이러한 의문점이 들 수 있습니다: "*ES5에서 ES6로 전환하면서 해당 기능을 사용하는 요점은 무엇인가요?*" 이 적절한 질문에 대한 답은 앞으로 몇 년 안에 ES5가 ES6로 대체 될 것이라는 것입니다. 그리고 아마 시간이 지나면 라이브러리를 ES5로 다시 트랜스파일링 할 필요가 없을것입니다. ES6 표준을 사용하면 코드가 간단해지고, 가독성을 높이며, 새로운 개발자의 진입 장벽을 낮춤으로써 새로운 기능을 통해 p5가 이점을 얻을 수 있습니다. 가장 중요한 것은 이것이 코드베이스의 미래를 보장한다는 것입니다.

### 호환성 vs. 성능

대부분의 경우 브라우저 호환성은 무시할 수 있지만 성능에 대해서는 그렇지 않습니다. ES6에서 ES5로의 변환은 안전히 마무리 할 수 있지만 생성 된 ES5 코드와 관련된 성능 저하가 존재합니다. Babel이 트랜스파일링한 코드와 ES5로 구현한 코드의 성능을 확인하려면 [이 링크](http://incaseofstairs.com/six-speed/)를 다시 참조해 주세요.

### ES6 코딩 가이드라인
- ES6 `import`를 선호하여 `require` 폐기 [[좀더 살펴보기](https://exploringjs.com/es6/ch_modules.html#sec_importing-exporting-details)]
- ES6 `export`를 선호하여 `module.exports` 폐기 [[좀더 살펴보기](https://exploringjs.com/es6/ch_modules.html#sec_importing-exporting-details)]
  - **예외:**  빌드 시스템 한계로 인해 `app.js`는 여전히 `module.exports = p5;`를 사용합니다.
- 항상 `const`를 사용하고, 재 할당이 필요한 경우 `let`으로 변경 [[토론](https://github.com/processing/p5.js/issues/3877)]
- 프로토타입 멤버는 모두 화살표 함수 대신 함수 선언문을 사용해야함 [[토론](https://github.com/processing/p5.js/issues/3875)]
  - **올바른 경우:** `p5.prototype.myMethod = function() { }`
  - **올바르지 않은 경우:** `p5.prototype.myMethod = () => { }`
- `.bind (this)`가 필요한 프로토타입 멤버는 화살표 함수로 변환해야 함 [[토론](https://github.com/processing/p5.js/issues/3875)]
  - **올바른 경우:** `p5.prototype.myMethod = () => { }`
  - **올바르지 않은 경우:** `p5.prototype.myMethod = function() {...}.bind(this);`
- 구문이 이전 형식을 복제하도록 상수를 가져옵니다. `constants.TWO_PI`


### 변환 요약
- [Modules: Export/Import](http://es6-features.org/#ValueExportImport)
- [Modules: Default & Wildcard](http://es6-features.org/#ValueExportImport)
- [Constants](http://es6-features.org/#Constants)
- [Block-Scoped Variables](http://es6-features.org/#BlockScopedVariables)
- [Rest Parameter](http://es6-features.org/#RestParameter)
- [Spread Operator](http://es6-features.org/#SpreadOperator)
- [Method Properties](http://es6-features.org/#MethodProperties)
- [Property Shorthand](http://es6-features.org/#PropertyShorthand)
- [Arrow Functions: Statement Bodies](http://es6-features.org/#StatementBodies)
- [Arrow Functions: Expression Bodies](http://es6-features.org/#ExpressionBodies)
- [Class Definition](http://es6-features.org/#ClassDefinition)
- [Class Inheritance](http://es6-features.org/#ClassInheritance)
- [Template Literals: String Interpolation](http://es6-features.org/#StringInterpolation)
- [Template Literals: Custom Interpolation](http://es6-features.org/#CustomInterpolation)
- [Default Parameter Values](http://es6-features.org/#DefaultParameterValues)
- [String Searching: Includes](http://es6-features.org/#StringSearching)
- [Array Searching: Includes (ES7)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [Iterators: For-Of](http://es6-features.org/#IteratorForOfOperator)

**참고:** 새로운 기능이 라이브러리에 통합 되었으므로 위의 목록을 업데이트해 주세요.

 ### 현재 이슈
- [`#3883`](https://github.com/processing/p5.js/issues/3883): combineModules를 사용하여 사용자 지정 번들을 만들 때 "new p5()"를 생성하지 못합니다. 글로벌 모드에서는 영향을 받지 않으며 예상대로 작동합니다.