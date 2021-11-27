# 선택한 컴포넌트로 p5.js의 커스텀 빌드 생성하기

## 개요

p5.js의 새롭고 멋진 이 [기능](https://github.com/processing/p5.js/pull/2051)을 사용하면 커스텀하게 모듈을 조합하여 p5.js를 빌드 할 수 있습니다. 이는 라이브러리의 프로덕션 버전 크기를 줄이는 데 크게 도움이 될뿐만 아니라 전반적인 성능을 향상시킵니다.

이 기능은 Google Summer of Code 2017 제안서의 일부로 제안되었습니다.

## 사용법

사용법은 커맨드라인에서 Grunt 태스크 명령어를 수동으로 실행하는 것입니다.

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:module_x:module_y
```

여기서 `module_n`은 여러분이 선택하고 싶은 모듈의 이름을 가리킵니다. 여러개의 모듈은 위와 같이 전달되어야 하며, 이 모듈들이 제대로 동작하려면 `/src` 디렉토리에 있는 폴더와 동일한 이름이어야 합니다. `core`가 기본적으로 포함되어 있지만, `core/shape`는 line() 및 기타 핵심 기능들과 같은 shape 모듈들이 포함되어 있어야 합니다.

위의 사용 예제는 `uglify` 태스크를 이용하여 출력물을 압축하지 않기 때문에 완전한 `p5.min.js`보다 더 큰 `p5Custom.js`를 만들어 낼 것입니다.

번들 크기를 최대한 줄이기 위해 권장하는 단계는 다음과 같습니다:

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:min:module_x:module_y uglify
```

## 예제들

- `npm run grunt combineModules:min:core/shape:color:math:image uglify`
  combineModules 및 uglify 태스크로 `lib/modules` 디렉토리안에 `p5Custom.min.js` 번들을 생성합니다. 모듈은 `combineModules:min` 다음에 나열 되어야하며 `uglify` 태스크는 모듈 목록 뒤에 공백이 있어야합니다.

- `npm run grunt combineModules:core/shape:color:math:image`
  `lib/modules` 디렉토리에 압축되지 않은 `p5Custom.js` 번들을 생성합니다.

- `npm run grunt combineModules:min:core/shape:color:math:image` 
  `combineModules:min` 태스크를 사용하여 `lib/modules` 디렉토리에 `p5Custom.pre-min.js`를 생성합니다. 이 예제에서 `npm run grunt uglify`는 `combineModules:min` 작업을 실행 한 후에 별도로 실행 할 수 있습니다.