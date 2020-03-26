

# 🌸 환영합니다! 🌺

p5.js에 기여하는데에 관심을 가져주셔서 감사합니다! 우리 커뮤니티는 모든 형태의 기여를 소중하게 생각하며 “컨트리뷰터”의 의미를 최대한 넓은 범위로 확장하고자 합니다. 이는 문서화, 강의, 코드 작성, 창작 활동, 글쓰기, 디자인, 운동, 조직화, 큐레이팅 및 그 외에도 여러분이 상상할 수 있는 모든 걸 포괄합니다. [우리의 커뮤니티 페이지](https://p5js.org/community/#contribute)에는 커뮤니티에 참여하고 기여할 수 있는 여러가지 방법들에 대한 개요가 제시되어 있습니다. 기술적인 기여를 하고자 하신다면, 시작하기에 앞서 이 글을 조금 더 읽어주시기 바랍니다.

이 프로젝트는 [올-컨트리뷰터스(all-contributors)](https://github.com/kentcdodds/all-contributors) 사양을 따릅니다. [안내 사항](https://github.com/processing/p5.js/issues/2309)을 따라 [리드미(readme)](https://github.com/processing/p5.js/blob/master/README.md#contributors)에 본인을 추가하세요! 혹은 [깃허브 이슈](https://github.com/processing/p5.js/issues)에 여러분의 컨트리뷰션을 댓글로 달아주시면 저희가 추가해드리겠습니다.



# 코드 보관 위치

p5.js 프로젝트의 핵심적인 저장소들은 아래와 같습니다:

- [p5.js](https://github.com/processing/p5.js): 본 저장소에는 p5.js 라이브러리의 소스 코드가 보관되어 있습니다. [유저들이 보게 되는 p5.js의 레퍼런스 매뉴얼](https://p5js.org/reference/) 또한 이 소스 코드에 포함되어 있는 [JSDoc](http://usejsdoc.org/) 각주에서 생성됩니다. 본 저장소는 [로렌 리 맥카시(Lauren Lee McCarthy)](https://github.com/lmccart)가 관리합니다.
- [p5.js-website](https://github.com/processing/p5.js-website): 본 저장소에는 레퍼런스 매뉴얼을 제외한 [p5.js 웹사이트](http://p5js.org)의 코드가 전부 보관되어 있습니다. 본 저장소는 [로렌 리 맥카시(Lauren Lee McCarthy)](https://github.com/lmccart)가 관리합니다.
- [p5.js-sound](https://github.com/processing/p5.js-sound): 본 저장소에는 p5.sound.js 라이브러리가 보관되어 있습니다. 본 저장소는 [제이슨 시갈(Jason Sigal)](https://github.com/therewasaguy)이 관리합니다.
- [p5.js-web-editor](https://github.com/processing/p5.js-web-editor): 본 저장소에는 [p5.js 웹 에디터](https://editor.p5js.org)의 소스 코드가 보관되어 있습니다. 본 저장소는 [캐시 타라케지언(Cassie Tarakajian)](https://github.com/catarak)이 관리합니다. 예전의 [p5.js 에디터](https://github.com/processing/p5.js-editor)는 이제 더 이상 사용되지 않다는 점을 참고하십시오.
- [p5.accessibility](https://github.com/processing/p5.accessibility): 맹인 및 시각 장애인들이 조금 더 쉽게 p5 캔버스를 사용할 수 있도록 하는 라이브러리입니다.



# 저장소 파일 구조

본 프로젝트엔 많은 파일들이 있습니다! 여기에 그 간략한 개요가 있습니다. 헷갈릴 수도 있지만, 기여하기 위해서 저장소의 모든 파일을 이해할 필요까지는 없습니다. 우리는 한 영역(인라인 도큐멘테이션을 고치는 것이 한 예가 될 수 있겠습니다)에서 시작해서 차근차근 다른 영역으로 나아가는 걸 권장합니다. 루이사 페레이라(Luisa Pereira)의 강의 [Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/)에 p5.js 작업 흐름에 사용되는 도구와 파일들에 대한 소개를 동영상으로 확인하실 수 있습니다.

- `contributor_docs/`에는 컨트리뷰터들을 위한 관례와 원칙을 설명하는 문서가 들어 있습니다.
- `docs/`에는 사실 문서들이 없습니다! 대신, [온라인 레퍼런스 매뉴얼](https://p5js.org/reference)을 생성하기 위한 코드가 담겨 있습니다.
- `lib/`에는 비어 있는 예시 파일과 [p5.js-sound 저장소](https://github.com/processing/p5.js-sound)에서 풀 리퀘스트를 통해 정기적으로 업데이트 되는 p5.sound 애드온이 담겨 있습니다. 또한 이곳은 빌드 된 p5.js 라이브러리가 [Grunt](https://gruntjs.com/)를 이용해 하나의 파일로 컴파일 된 후에 위치하게 되는 곳이기도 합니다. 풀 리퀘스트를 할 때 깃허브 저장소로 따로 파일을 이동시킬 필요가 없는 것입니다.
- `src/` 에는 라이브러리를 위한 모든 소스 코드가 담겨 있는데, 이들은 분리된 모듈의 형태로 주제별로 정리되어 있습니다. 만약 p5.js를 수정하고자 한다면 여기 있는 소스 코드에 작업을 하면 됩니다. 대부분의 폴더 안에는 각각의 리드미 파일(readme.md)이 있으니 이를 참고해 작업 해주시기 바랍니다.
- `tasks/`에는 새로운 버전의 p5.js를 빌드, 배포, 릴리스 하는데에 관련된 자동화 된 작업들을 수행하는 스크립트들이 담겨 있습니다.
- `tests/`는 내용 수정이 있어도 라이브러리가 제대로 작동하도록 보장해주는 유닛 테스트들을 담고 있습니다.
- `utils/`는 저장소에 유용할 수도 있는 추가적인 파일들을 담고 있는데, 일반적으로 본 디렉토리는 무시해도 괜찮습니다.



# 문서화

문서화는 본 프로젝트의 가장 중요한 부분입니다. 낮은 품질의 문서화는 새로운 이용자와 컨트리뷰터들의 진입 장벽을 높여 프로젝트 참여도를 저하시킵니다. [contributing_documentation.md](./contributing_documentation.md) 페이지는 문서화를 시작하는 데에 깊이 있는 개요를 제시합니다. p5.js를 위한 문서화는 아래와 같은 곳들에서 주로 찾아볼 수 있습니다:

- [p5js.org/reference](https://p5js.org/reference/)는 소스 코드의 [인라인 도큐멘테이션](./inline_documentation.md)으로부터 생성됩니다. 이는 텍스트 설명, 파라미터, 코드 스니펫 예시 등을 포함합니다. 우리는 코드와 인라인 도큐멘테이션을 긴밀히 연결시키고, 문서화에 기여하는 게 코드에 기여하는 것 만큼이나 중요하다는 생각을 강화하기 위해 인라인 도큐멘테이션을 활용하는 것입니다. 라이브러리가 빌드 되면 라이브러리와 코드가 작동하는 방식 사이에 문제가 없음을 확실히 하기 위해 인라인 도큐멘테이션과 예시를 확인합니다. 이에 기여하기 위해선 [inline_documentation.md](./inline_documentation.md) 페이지를 살펴보는 걸로 시작하시기 바랍니다.
- [p5js.org/examples](http://p5js.org/examples)페이지는 p5.js를 학습하는 데에 유용할 수 있는 길이가 긴 예시들을 담고 있습니다. 컨트리뷰션을 위해서는 [adding_examples.md](https://github.com/processing/p5.js-website/blob/master/contributor_docs/Adding_examples.md) 페이지를 살펴보시기 바랍니다.
- [p5js.org/tutorials](https://p5js.org/tutorials)페이지는 p5.js와 프로그래밍의 개념을 배울 수 있도록 도와주는 튜토리얼들을 담고 있습니다. 기여하기 위해서는 [p5.js 웹사이트의 튜토리얼에 대한 튜토리얼](https://p5js.org/learn/tutorial-guide.html)을 살펴보시기 바랍니다!
- p5.js 웹사이트는 현재 몇 가지 다른 언어들을 지원하고 있음을 확인하실 수 있습니다. 이는 국제화(혹은 줄여서 i18n)라고 불립니다. 이에 대한 문서는 [i18n_contribution](https://github.com/processing/p5.js-website/blob/master/contributor_docs/i18n_contribution.md) 페이지에서 더 자세히 보실 수 있습니다.



# 깃허브 이슈 흐름

* 알려진 버그와 추가되었으면 하는 새로운 기능들은 [깃허브 이슈](https://github.com/processing/p5.js/issues)들을 통해 추적됩니다. 이슈 [레이블](./issue_labels.md)들은 이슈들을 카테고리별로 분류하는 데에 사용되는데, 예를 들면 [초보자에게 적합한 이슈들](https://github.com/processing/p5.js/labels/level%3Abeginner)을 레이블링 하는 식입니다.

* 이미 제기된 이슈 중에 작업을 시작하고 싶은 게 있다면, 다른 컨트리뷰터들이 진행 사항을 파악하고 도움을 줄 수 있도록 해당 이슈에 댓글을 달아주시기 바랍니다.

* 이슈를 해결했다면, p5.js 마스터 브랜치에 [풀 리퀘스트(PR)를 제출](./preparing_a_pull_request.md)하십시오. PR의 설명 칸에 “resolves #XXXX”(#XXXX를 해결함)라고 써서 해결한 이슈를 태그해주시기 바랍니다. 만약 이 PR이 해당 이슈를 다루기는 하지만 완전히 해결하지는 못하는 거라면(즉, 여러분의 PR이 merge 되고 나서도 이슈가 열려 있어야 한다면), “addresses #XXXX”(#XXXX를 다룸)이라고 써주시기 바랍니다.

* 만약 버그를 발견했거나 새롭게 더하고 싶은 기능에 대한 아이디어가 있다면, 이슈를 먼저 제출해주시기 바랍니다. 이슈를 제출하지 않고 수정 사항이나 새로운 기능을 풀 리퀘스트를 제출해버리는 경우, 이를 수락하기 어려울 가능성이 높습니다. 이슈에 대한 피드백을 받고 해당 이슈를 다뤄도 괜찮다는 걸 확인했다면, 위의 절차를 따라서 버그를 고치거나 새로운 기능을 추가하는 컨트리뷰션을 시작할 수 있습니다.

* 버그 리포트를 재현하거나 버전 번호 혹은 재현 안내서와 같은 주요 정보들을 요청하는 등 이슈들을 선별하는 작업할 수도 있습니다. 이를 시작하기에 가장 용이한 방법 중 하나는 [코드 트리아지(CodeTriage)에서 p5.js를 구독](https://www.codetriage.com/processing/p5.js)하는 겁니다. [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

* [organization.md](https://github.com/processing/p5.js/blob/master/contributor_docs/organization.md) 파일은 이슈들이 어떻게 체계화 될 수 있는지, 그리고 그에 대한 의사결정 과정은 어떻게 이루어지는지에 대한 대략적인 개요를 담고 있습니다. 이에 관심이 있다면 얼마든지 기여해주시기 바랍니다.



# 개발 과정

개발 프로세스라는 게 처음에는 약간 까다로울 수 있습니다. 그렇게 느끼는 건 여러분 뿐만이 아니라, 처음엔 모두가 혼란을 겪곤 합니다. 밑을 보시면 셋업 과정을 차례 차례 확인하실 수 있습니다. 만약 질문이 있다면 [포럼](https://discourse.processing.org/c/p5js)에 물어보거나 막힌 부분을 설명하는 [이슈](https://github.com/processing/p5.js/issues)를 제출하면 저희가 할 수 있는 최대한의 도움을 드리도록 하겠습니다.

아래 절차는 [코딩 트레인(The Coding Train)의 비디오 강의](https://youtu.be/Rr3vLyP1Ods)에서도 다루고 있습니다.🚋🌈



1. [node.js](http://nodejs.org/)를 설치하세요. node.js를 설치하면 자동적으로 [npm](https://www.npmjs.org) 패키지 매니저도 설치됩니다.

2. 본인의 깃허브 계정에 [p5.js 저장소](https://github.com/processing/p5.js)를 [포크](https://help.github.com/articles/fork-a-repo) 하십시오.

3. 포크 된 깃허브 저장소를 로컬 컴퓨터에 [클론](https://help.github.com/articles/cloning-a-repository/) 하십시오.

   ```
   $ git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

4. 프로젝트 폴더로 들어가 npm에 필요한 모든 디펜던시를 설치하십시오.

   ```
   $ cd p5.js
   $ npm ci
   ```

5. 이제 [Grunt](https://gruntjs.com/)가 설치되었을텐데, 소스 코드로부터 라이브러리를 빌드하기 위해 이를 이용할 수 있습니다.

   ```
   $ npm run grunt
   ```

만약 라이브러리의 파일을 계속해서 변경해야 한다면, 사전에 수동으로 일일이 명령어를 입력하지 않아도 소스 파일 변경 사항을 자동적으로 다시 빌드해줄 수 있도록 `npm run dev`를 실행 하는 게 나을 것입니다.

6. 로컬에서 코드 베이스를 변경하고, 깃(Git)으로 [커밋](https://help.github.com/articles/github-glossary/#commit) 하십시오.

   ```
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. 문법 오류가 없음을 확인하고, 고장 및 다른 문제들에 대한 테스트를 하기 위해 `npm run grunt`를 다시 한 번 실행하십시오.

8. 변경 사항을 여러분의 깃허브 포크에 [푸시](https://help.github.com/articles/github-glossary/#push) 하십시오.

   ```
   $ git push
   ```
   
9. 모든 게 준비되었다면, 변경 사항을 [풀 리퀘스트](https://help.github.com/articles/creating-a-pull-request)로 제출하십시오.



# 커밋이 거절 당하는 경우

p5.js 코드 베이스에 포함되어 있는 개발자 툴들은 어떤 것들에 대해 일부러 매우 엄격한 기준을 적용하도록 만들어져 있습니다. 이건 좋은 겁니다! 이는 모든 걸 일관성 있게 만들고, 규율이 지켜지도록 도울 겁니다. 여러분이 뭔가를 변경하고자 만들었던 커밋이 거절 당할 수도 있음을 의미하기는 하지만, 낙담하지는 말아주세요. 심지어 경험 많은 p5.js 개발자들의 커밋도 종종 거절 당하곤 합니다. 보통은 코드 문법 아니면 유닛 테스트가 문제인 경우가 많습니다.

## 코드 문법

p5.js는 깔끔하고 일관성 있는 스타일의 코드 문법을 요구하기에, [Prettier](https://prettier.io/)와 [ESlint](https://eslint.org/)라는 툴의 사용이 필수입니다. 커밋을 하기 전에 특정 스타일 규칙을 점검하게 되는데, 사용하는 코드 에디터에 [ESlint 플러그인](https://eslint.org/docs/user-guide/integrations#editors)을 설치하면 타이핑 함과 동시에 오류를 하이라이트 해줍니다. 코드 스타일에 관해서 일반적으로 유연성과 관련된 오류를 내는데, 이는 참여와 기여의 장벽을 낮추기 위함입니다.

에러를 포착하기 위해서는 터미널에서 다음 명령어를 실행하세요(`$` 프롬프트는 입력하지 마십시오):

```
$ npm run lint
```

어떤 문법 오류는 자동적으로 고쳐질 수도 있습니다:

```
$ npm run lint:fix
```

프로젝트의 기존 스타일을 고수하는 게 선호되는게 보통이지만, [가끔은](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=) 다른 문법을 사용하는 게 코드를 이해하기 더 쉽게 만들기도 합니다. 이런 경우에는, Prettier의 `// prettier-ignore` 주석을 이용해 [예외적인 경우를 처리](https://prettier.io/docs/en/ignore.html)할 수 있습니다. 하지만 대부분의 경우 요구되는 스타일 선호 사항들은 그럴만한 이유가 있기 때문에 가능하다면 예외적인 경우를 만들지 말아주시길 바랍니다.

여기 코드 스타일 규칙에 대한 간략한 요약본이 있습니다. 다만 이 목록이 전부가 아니기 때문에 [.prettierrc](https://github.com/processing/p5.js/blob/master/.prettierrc)와 [.eslintrc](https://github.com/processing/p5.js/blob/master/.eslintrc) 파일의 전체 목록을 참고 하시기 바랍니다.
* ES6 코드 문법을 사용합니다.

* (큰 따옴표 보다는) 작은 따옴표를 사용합니다.

* 들여쓰기는 스페이스 두 개로 처리합니다.

* 코드에 정의되어 있는 모든 변수들은 적어도 한 번은 사용되던가, 아니면 완전히 없애야 합니다.

* x == true 혹은 x == false로 비교문을 작성하지 마십시오. 이것 대신 (x) 나 (!x)를 사용하십시오. x == true는 분명히 if (x) 와는 다릅니다! 헷갈릴 여지가 있다면 객체를 널(null)과 비교하고, 숫자를 0에, 문자열(string)을 “”과 비교하십시오.

* 작성하는 함수가 모호하거나 복잡한 경우 주석을 답니다.

* 더 많은 스타일링 팁을 참고하기 위해선 [모질라 자바스크립트 연습(Mozilla JS practice)](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style#JavaScript_practices)을 보십시오.



## 유닛 테스트

유닛 테스트란 주논리와 성능 검증을 보완하기 위해 만들어진 작은 규모의 코드들입니다. [unit_testing.md](./unit_testing.md) 페이지에 유닛 테스트에 대한 더 많은 정보가 담겨 있습니다. 만약 여러분이 p5.js를 위한 주요 기능을 개발한다면, 아마도 테스트를 포함해야 할 것입니다. 테스트를 통과하지 못한다면, 그건 어딘가에 문제가 있다는 뜻이므로 풀 리퀘스트를 제출하지 마십시오.

유닛 테스트를 돌리기 위해서는 프로젝트의 디펜던시들을 반드시 설치해야 합니다.

```
$ npm ci
```

이것이 p5.js를 위한 *모든* 디펜던시들을 설치할 것입니다; 간단하게는, 유닛 테스팅에 가장 중요한 디펜던시들은 다음을 포함합니다:

- [Mocha](https://mochajs.org/): p5.js를 위한, 개별적인 테스트 파일들을 실행하는 강력한 테스팅 프레임워크
- [mocha-chrome](https://github.com/shellscape/mocha-chrome): 구글 크롬을 이용해 Mocha 테스트를 돌리는 모차 플러그인

디펜던시들이 설치되면, Grunt를 이용해 유닛 테스트를 돌리십시오.

```
$ grunt
```

때론 커맨드 라인 대신 브라우저에서 테스트를 돌리는 것도 유용합니다. 이를 위해선, 먼저 서버 [연결](https://github.com/gruntjs/grunt-contrib-connect)을 시작하십시오:

```
$ npm run dev
```

서버가 돌아가면, 브라우저에서 `test/test.html`을 열 수 있을 겁니다.

유닛 테스팅에 대한 완전한 설명은 p5.js 문서의 범위를 벗어나는 것이지만, 간략하게만 말하자면 src/ 디렉토리에 있는 소스 코드에 가해진 중대한 수정 사항이나, 새로 구현된 기능은 Mocha가 실행할 수 있는 테스트 파일이 test/ 디렉토리에 동반되어야 하는데, 이는 향후 나올 모든 버전의 라이브러리에서도 일관성 있게 작동할 것임을 검증하기 위함입니다. 유닛 테스트를 작성할 때, [Chai.js 레퍼런스](http://www.chaijs.com/api/assert/)를 참고해 어서션(assertion) 메세지를 구성함으로써 미래에 테스트로 잡아낼 수 있는 오류들이 일관성 있고, 결과적으로 다른 개발자들이 이해하기 쉽게 만들어주시기를 바랍니다.



# 기타

- [contributor_docs/](https://github.com/processing/p5.js/tree/master/contributor_docs) 폴더에는 살펴볼만한 다른 파일들도 있습니다. 이들은 본 프로젝트의 기술적인 혹은 비기술적인 각 영역과 관계된 것들입니다.
- p5.js 개발 작업 흐름에서 사용되는 도구와 파일들에 대한 영상 설명은 [Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/)에서 보실 수 있습니다.
- [코딩 트레인의 이 동영상](https://youtu.be/Rr3vLyP1Ods)🚋🌈에서는 p5.js에 기술적 기여를 시작하는 것에 대한 개요를 제공합니다.
- p5.js [도커(Docker) 이미지](https://github.com/toolness/p5.js-docker)는 [도커](https://www.docker.com/)에 마운트 될 수 있는데, 이는 [Node](https://nodejs.org/) 같은 필수 요소들을 수동으로 설치할 필요 없이, 그리고 도커 설치를 제외하고는 어떤 방식으로든지 호스트 운영 체제에 영향을 주지 않고도 p5.js를 개발하는데에 사용될 수 있습니다.
- p5.js 라이브러리의 빌드 과정은 [json 데이터 파일](https://p5js.org/reference/data.json)을 생성하는데, 이는 p5.js의 공개 API를 담고 있으며, 이는 에디터에서 p5.js 메서드를 자동으로 완성하는 등의 자동화된 툴링에 사용될 수 있습니다. 이 파일은 p5.js 웹사이트에서 호스트 되지만, 저장소의 일부로 포함되어 있지는 않습니다.
- p5.js는 최근에 [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015)로 마이그레이션 됐습니다. 이 변화가 여러분의 기여에 어떤 영향을 미칠지를 보기 위해선 [ES6 채택](./es6-adoption.md)을 방문해주십시오.
