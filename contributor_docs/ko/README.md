

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

* 버그 리포트를 복사하거나 버전 번호 혹은 복사 안내서와 같은 주요 정보들을 요청하는 등 이슈들을 선별하는 작업할 수도 있습니다. 이를 시작하기에 가장 용이한 방법 중 하나는 [코드 트리아지(CodeTriage)에서 p5.js를 구독](https://www.codetriage.com/processing/p5.js)하는 겁니다. [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

* [organization.md](https://github.com/processing/p5.js/blob/master/contributor_docs/organization.md) 파일은 이슈들이 어떻게 체계화 될 수 있는지, 그리고 그에 대한 의사결정 과정은 어떻게 이루어지는지에 대한 대략적인 개요를 담고 있습니다. 이에 관심이 있다면 얼마든지 기여해주시기 바랍니다.

