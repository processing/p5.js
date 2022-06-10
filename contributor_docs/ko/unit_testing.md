# 단위 테스팅

단위 테스트를 사용하여 코드베이스의 개별 컴포넌트가 예상대로 작동하는지 확인합니다.

## 참조

여기 비슷한 기술 스택과 함께 [빠르고 좋은 단위 테스팅 소개](https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71)가 있고, [좀 더 깊이 살펴 볼수 있는 자료](https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d)가 있습니다.

## 모든 단위 테스트 실행하기

루트 레파지토리에서, 다음 커맨드를 터미널에서 사용해주세요.

```shellsession
npm test
```

## 테스트 커버리지

매번 테스가 실행될때 마다, 커버리지 보고서가 생성됩니다. 커버리지 보고서에는 테스트 스위트가 어떤 소스 코드 파일을 테스트해 보았는지 자세히 설명하여 얼마나 많은 코드베이스를 테스트했는지 효과적으로 알려줍니다.

요약본은 테스트를 실행하고 난 뒤에 출력되며, 상세한 보고서는 어느 웹브라우저에나 `coverage/index.html`에서 살펴 볼 수 있습니다. 맥 커맨드라인에서 `open coverage/index.html`를 실행하면, 디폴트 브라우저에 해당 페이지가 열립니다. 또한 다음 커맨드 `npx nyc report --reporter=text`를 터미널에서 사용하고 난 후 커버리지 리포트를 볼 수 있습니다.

### 단윌 스위트 실행

단일 테스트나 그룹 테스트를 실행하기 위해, `.js` 파일에 `suite` 혹은 `test`에 `.only`를 붙이고 위에 명령어를 사용해 테스트를 실행합니다.

**`.only`를 커밋하지 않도록 주의해주세요**(저희는 항상 CI가 _모든_ 단위 테스트를 실행하기를 원합니다.)

#### 예제

오로지 "p5.ColorConversion" 테스트 스위트를 실행하기 위해, `test/unit/color/color_light.js`의 첫 행을 다음과 같이 변경합니다:

```js
suite.only('color/p5.ColorConversion', function() {
```

이제 `npm test`를 사용하면, 해당 `function()`내에서만 테스트가 실행됩니다.

### 테스트 스위트 건너뛰기

이 기능은 `.only()` 반대입니다. `.skip()`을 추가하면서, Mocha가 스위트 혹은 테스트 케이스들을 무시하도록 할 수 있으며, 건너뛴 모든 항목은 보류 중으로 표시되고 이대로 보고됩니다.

## 인프라

### 프레임워크

단위 테스트를 구조화하고 실행하기 위해 [mocha](https://mochajs.org)를 사용합니다.

[chai의 `assert` (및 `expect`)](https://www.chaijs.com/api/assert/)를 사용하여 코드의 작동 방식에 대한 개별 문장을 작성합니다.

### 환경

브라우저에서 실행되는 `test/unit` 폴더 아래 테스트 모음과 Node.js에서 실행되는 `test/node` 아래 테스트 컬렉션이 있습니다.

브라우저 테스트는 ["headless" Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai)에서 실행합니다. 따라서 테스트를 실행할 때 브라우저 창이 나타나지 않습니다.

### 설정 및 헬퍼 함수

이러한 테스트는 현재 브라우저 테스트에서만 사용할 수 있습니다(대부분의 테스트가 실행되는 위치):

- `test/js/mocha_setup.js`  mocha의 몇가지 옵션을 설정
- `test/js/chai_helpers.js` chai 설정 및 `chai.assert` 에 도움되는 몇가지 함수 추가
- `test/js/p5_helpers.js` p5 스케치의 테스트를 도와주는 몇가지 헬퍼 함수 추가

Node.js를 위한 설정은 `test/mocha.opts`에서 모두 수행됩니다.

### 지속적인 통합 테스팅

p5.js 레파지토리에서 풀리퀘스트를 오픈하면, 자동으로 [테스트가 실행](ttps://github.com/processing/p5.js/actions) 됩니다. 이를 통해 개별 기여자의 추가적인 작업 없이 각 풀 리퀘스트 대해 테스트를 통과했는지 재확인할 수 있습니다. 또한 [Codecov](https://codecov.io/github/processing/p5.js)에 커버리지 리포트가 자동으로 업로드 됩니다.

## 단위 테스팅 추가

단위테스트를 추가하고 싶다면, 테스트를 추가하고 있는 컴포넌트에 테스트 파일이 이미 존재하는지 확인해 보세요. 일반적으로 `src/`에서 주어진 파일에 대한 테스트는 `test/unit`과 같은 경로에 있습니다.(예를 들면, `src/color/p5.Color.js`의 테스트는 `test/unit/color/p5.Color.js`안에 있습니다)

찾을 수 없다면, 아마 해당 파일에 대한 테스트가 없기 때문일 것이기에 (아직 😉), 위에 컨벤션에 따라 새로운 파일을 생성합니다. 작성하고 있는 모듈이 동작하기위해 브라우저가 필요하다면, `test/unit`안에 넣고 싶지만, 그렇지 않다면, `test/node` 아래에 추가할 수 있습니다.

**의심이 든다면 `test/unit`에 브라우저 테스트를 추가하면 됩니다!(추후 필요한 경우 이동하는 편이 매우 쉽습니다.)**

`test/unit`에 모듈을 위한 테스트 파일을 추가해야 한다면, `test/unit/spec.js`안 `spec`배열의 테스트 아래에 모듈을 두어야 합니다. 이 부분은 테스트 실행에 필요한 모듈이 로드되어 있는지 확인합니다. 브라우저에서 `test/test.html` 파일을 보면서 해당 테스트들을 확인 할 수 있습니다.

### 단위 테스트 작성

단위를 선택하세요. 테스트 할 메소드 또는 변수 일 수 있습니다. 예제로 `p5.prototype.isKeyPressed`를 사용해 봅시다. 테스트를 작성하기 전에, 이 메소드의 예상되는 동작을 이해할 필요가 있습니다.

**예상되는 동작:** boolean 시스템 변수는 키를 누르는 경우 참이고 키를 누르지 않으면 거짓입니다. 이제 예상되는 동작에 대한 다양한 테스트를 생각할 수 잇습니다. 가능한 테스트 케이스는 다음과 같습니다:

- 변수가 boolean이다.
- 키를 누르면 참이어야 한다
- 어떠한 키(알파벳 키, 숫자 키, 특수문자 키 등)를 누르더라도 참이어야 한다.
- 여러 키를 누르면 참이어야 한다.
- 키를 누르지 않으면 거짓이어야 한다.
- 더 생각나는 것이 있다면, 계속해서 테스트를 추가하세요!

`p5.prototype.isKeyPressed`를 위한 테스트 스위트를 생성하고, 테스트를 작성할 수 잇습니다. 단위테스트를 구성하기 위해 mocha를 사용할 것입니다.

```js
suite('p5.prototype.keyIsPressed', function() {
  test('keyIsPressed is a boolean', function() {
    //이곳에서 테스트 작성
  });

  test('keyIsPressed is true on key press', function() {
    //이곳에서 테스트 작성
  });

  test('keyIsPressed is false when no keys are pressed', function() {
    //이곳에서 테스트 작성
  });
});
```

테스트를 구성했지만 아직 테스트를 작성하지 않았습니다. chai의 assert를 사용할 것입니다.

다음을 고려해 보세요:

```js
test('keyIsPressed is a boolean', function() {
  assert.isBoolean(myp5.keyIsPressed); //해당 값이 boolean인지 확인
});
```

유사하게, 해당 값이 참인지 확인하기 위해 `assert.strictEqual(myp5.keyIsPressed, true)` 사용 할 수 잇습니다. chai의 assert에 대해 [여기](https://www.chaijs.com/api/assert/)에서 좀더 살펴 볼수 잇습니다. 테스트를 작성 했으므로 테스트를 실행하고 메소드가 예상대로 작동하는지 확인해보세요. 그렇지 않다면, 동일한 이슈를 생성하고, 원한다면 문제를 해결 볼 수 있습니다!
