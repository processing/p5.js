# 🌐 국제화

[국제화](https://developer.mozilla.org/docs/Glossary/Internationalization_and_localization)(때로는 약어로 "i18n"이라 칭하기도 함)는 소프트웨어 프로젝트에서 다국어를 지원하는 것을 가리킵니다. 종종 프로젝트에서 사용되는 텍스트 문자열의 번역을 유지보수하고, 또는 사용자가 수신 할 번역을 선택 (또는 브라우저 설정에서 감지) 하는 것을 의미합니다.

p5.js는 여러 분야(기여자 문서, [공식 웹사이트](https://p5js.org), 참조 문서 등)에서 국제화를 사용합니다. 우리는 p5.js의 콘솔 출력물(주로 개발자가 마주하는 오류 메시지)에도 국제화 노력을 포함하도록 확장하고 있습니다.

## 도구

[i18next](https://www.i18next.com)를 코드베이스에 통합했습니다. 현재 p5.js의 압축되지 않은 빌드에서만 사용하며, `p5.min.js`는 국제화 코드의 외부 레이어만 포함하며 사용하지 않습니다.

### 설치

i18next를 `src/core/internationalization.js`안에서 통합 설정 했고 번역은`translations/`안에 있습니다.

p5 스케치가 초기화 되기 전에 번역 엔진을 설정하고 브라우저 설정에서 사용자 언어를 자동으로 감지합니다. 이를 통해 스케치 `setup()` 및 `preload()`에서 발생하는 모든 오류에 대해 번역을 사용할 수 있습니다.

(언어 자동 감지에서 오류가 발생하면 영어로 넘어갑니다.)

#### `p5.min.js`안에서는 번역하지 않습니다.

browserify 빌드 작업과 압축된 빌드에서 번역을 로드하거 설정하지 않도록 하는 특정 로직이 `src/core/init.js`안에 있습니다. 번역을 추가해도 압축된 빌드의 크기는 증가하지 않습니다.

### 번역 사용하기

번역을 사용하려면, 파일 최상단에 다음 라인을 추가해 주세요.

```js
import { translator } from './internationalization';
```

### 간단한 메세지

국제화를 하지 않고, 텍스트 인라인 메시지를 기록 할 수 있습니다.

```js
console.log('Loading your sketch right now!')
```

대신에, `translator`를 사용 하세요:

```js
console.log(translator('sketch.loading'))
```

translator에게 사용자가 선호하는 언어로 "sketch.loading" 메시지를 받도록 말해줍니다.

#### 동적 메세지

번역 된 메시지에 변수를 삽입 할 수도 있습니다. 예를 들면,

```js
console.log('I couldnt find ' + file.name + '. Are you sure it's there?')
```
다음과 같은 모습을 가지게 될 것입니다.

```js
console.log(translator('fileLoading.notFound', { fileName: file.name }))
```

이와 같은 번역에서는 특정 이름을 사용하는 변수가 필요하므로 반드시 해당 이름을 사용해야 합니다. 변수명을 확인하기 위해 번역파일 (translations/{YOUR_LANGUAGE})을 확인해 보세요. 번역은 번역키 안에 오브젝트 경로 아래에서 찾아볼 수 있습니다.

"`fileLoading.notFound`"는 다음에서 찾아볼 수 있습니다.

```json
{
  "fileLoading": {
    "notFound": "I couldnt find {{fileName}}. Are you sure it's there?"
  }
}
```

변수는 "`{{``}}`"안에서 표시됩니다.

### 번역 수정하기

`translations/{YOUR_LANGUAGE}/translation.json`을 열고 (바로 위의 예와 같이) 키를 사용하여 번역을 찾은 후 편집해 보세요!

### 새로운 언어에 번역 추가하기

가장 쉬운 방법은 `package.json`안에 [locales list](https://github.com/processing/p5.js/blob/84bc1f92c89786f48e5d6fd1045feb649b932eea/package.json#L111-L114)에서 언어 코드(예 : "de", 독일어 "it", 이탈리아어, 등)를 추가하고, 터미널에서 '$ npm run build'를 실행하세요.

`translations/{LANGUAGE_CODE}/`에 새로운 번역 파일이 생성됩니다! 이제 새로운 번역으로 채우기를 시작할 수 있습니다! 🥖

또한 `translations/index.js`에 항목을 추가해야합니다. 해당 파일에서 `en`과`es`에 사용 된 패턴을 따를 수 있습니다.

### 좀더 살펴보기

[i18next 번역 기능 문서](https://www.i18next.com/translation-function/essentials)를 살펴보세요. 위에서 설명된 모든 내용들은 단 일부 기능들 일 뿐입니다.