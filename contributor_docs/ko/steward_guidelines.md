<!-- p5.js에 대한 기여를 관리하고 검토하는 방법에 대해 알아보세요. -->

# 스튜어드(Steward) 지침

방금 스튜어드(steward)로 참여하셨거나, p5.js의 숙련된 유지관리자(maintainer)거나, 그 사이 어딘가에 있으시거나, 이 안내서에는 p5.js에 효과적으로 기여하는 데 도움이 되는 정보는 물론 팁과 요령이 포함되어 있습니다. 여기에 작성된 대부분의 내용은 달리 명시되지 않는 한 지침에 불과하므, 여기서 보여지는 절차들은 여러분의 작업 흐름에 맞게 조정할 수 있습니다.


## 목차

- [이슈(Issues)](steward_guidelines.md#issues)
  - [버그 보고](steward_guidelines.md#bug-report)
  - [기능 요청](steward_guidelines.md#feature-request)
  - [기능 향상](steward_guidelines.md#feature-enhancement)
  - [토론(Discussion)](steward_guidelines.md#discussion)
- [풀 리퀘스트(Pull Requests)](steward_guidelines.md#pull-requests)
  - [간단한 수정](steward_guidelines.md#simple-fix)
  - [버그 수정](steward_guidelines.md#bug-fix)
  - [새로운 기능/기능 향상](steward_guidelines.md#new-feature-feature-enhancement)
  - [디펜다봇(Dependabot)](steward_guidelines.md#dependabot)
- [빌드 과정](steward_guidelines.md#build-process)
  - [주요 빌드 작업](steward_guidelines.md#main-build-task)
  - [기타 작업](steward_guidelines.md#miscellaneous-tasks)
- [배포 과정](steward_guidelines.md#release-process)
- [팁과 요령](steward_guidelines.md#tips--tricks)
  - [회신 템플릿 (Reply templates)](steward_guidelines.md#reply-templates)
  - [깃허브 CLI](steward_guidelines.md#github-cli)
  - [알림 관리](steward_guidelines.md#managing-notifications)

---


## 이슈(Issues)

우리는 대부분의 소스 코드 기여가 이슈(Issue)에서 시작하는 것을 권장하며, 따라서 이슈는 대부분의 논의가 이루어지는 곳입니다. 문제를 검토할 때 취해야 할 단계는 문제의 종류에 따라 달라집니다. 리포지토리(repo)는 다양한 유형의 문제를 더 잘 정리하고 문제 작성자가 문제에 대한 정보를 모두 제공하도록 권장하기 위해 [깃허브 이슈 템플릿(templates)](https://github.com/processing/p5.js/blob/main/.github/ISSUE_TEMPLATE)을 사용합니다. 문제를 검토하는 첫 번째 단계는 종종 입력된 템플릿을 살펴보고 추가 정보가 필요한지 여부를 결정하는 것입니다 (예: 일부 필드가 입력되지 않았거나 잘못된 템플릿이 사용되었을 경우).


### 버그 보고

버그 보고는 "버그 보고 (Found a bug)" 이슈 템플릿(template)을 사용해야 합니다. 버그 보고를 하기 위해서는 다음과 같은 과정이 일반적입니다:

1. 버그 재현
   - 템플릿의 목표는 검토자가 문제의 버그를 재현할 수 있도록 충분한 정보를 제공하는 것입니다.
   - 보고된 버그가 리포지토리(repo)와 관련이 없는 경우 (p5.js, p5.js 웹사이트 등):
     - 접근 권한이 있다면 연관 리포지토리로 문제를 전송합니다.
     - 그렇지 않으면 버그 보고서가 위치할 곳에 대한 답변을 (직접 연결되는 링크와 함께) 남기고 이슈를 닫습니다.
   - 버그 보고를 검토하는 첫 번째 단계는 버그 재현 위해 충분한 정보가 제공되는지 확인하고, 제공되는 경우에, 설명된 대로 버그 재현을 시도하는 것입니다.
2. 버그를 재현할 수 있는 경우:
   - 특정 버그를 고치는 최선의 방법을 찾기 위해 약간의 논의가 필요할 수 있습니다. 때로는 간단할 수도 있고 때로는 까다로울 수도 있습니다. 사례별로 이러한 결정을 내릴 때는 [p5.js 디자인 원칙](design_principles.md)를 참조하세요.
   - 이슈 작성자가 버그 수정에 기여할 의향이 있는 경우:
     - 이슈 작성자가 코멘트를 남기 이슈에 할당하여 이슈 수정을 승인합니다. “담당자(Assignee)” 우측에 있는 톱니바퀴 버튼을 사용하세요.
   - 이슈 작성자가 버그 수정에 기여하기 원하지 않는 경우:
     - 버그를 재현 가능한지 알아볼 수 있는 댓글을 남깁니다.
     - 문제를 직접 해결하려고 시도하거나, 해결이 필요한 문제임을 나타내기 위해 `help wanted` 라벨을 추가하여 수정이 필요한 문제를 표시합니다.
3. 버그를 재현할 수 없는 경우:
   - 템플릿(template)에 정보가 부족하다면 추가 정보를 요청합니다 (p5.js 버전, 브라우저 버전, OS 버전 등).
   - 테스트 환경이 이슈에 보고된 환경과 다른 경우 (예: 다른 브라우저 또는 OS):
     - 여러분의 특정 환경에서 버그를 재현할 수 없다는 의견을 남깁니다.
     - 이슈에 `help wanted` 라벨을 추가하고 같은 설정을 가진 사람에게 버그 재현을 요청합니다.
   - 버그는 종종 웹 에디터를 사용할 때만 발생하고 로컬에서 테스트할 때는 발생하지 않습니다. 이 경우 이슈를 [웹 에디터 리포지토리(repo)](https://github.com/processing/p5.js-web-editor)로 리디렉션해야 합니다.
   - 나중에 버그 재현이 가능해 경우 2번로 다시 이동합니다.
4. p5.js의 동작이 아니라 사용자가 버그 보고서에 제공한 코드에서 버그가 발생한 경우:
   - p5.js의 문서화, 코드 구현 또는 친근한 오류 시스템(friendly error system)을 개선하여 동일한 오류가 발생하지 않도록 할 수 있는지 판단합니다.
   - 추가 질문이 있으면 [포럼(forum)](https://discourse.processing.org/) 또는 [디스코드(Discord)](https://discord.com/invite/SHQ8dH25r9) 로 리디렉션하고 p5.js에 더 이상 변경사항이 없다면 이슈를 종결(close)하세요.


### 기능 요청

기능 요청은 "새로운 기능 요청(New Feature Request)" 이슈 템플릿(template)을 사용해야 합니다. 새로운 기능을 요청하기 위해서는 다음과 같은 과정이 일반적입니다:

1. 기능 요청은 p5.js의 접근성 향상을 위한 노력의 일환으로, 해당 분야에서 역사적으로 소외된 커뮤니티에서 p5.js의 접근성을 높이는 방법에 대한 사례가 되어야 합니다. 자세한 내용은 [이 곳](access.md)에서 볼 수 있습니다.
    - 기능 요청에 "접근성 향상(Increasing Access)" 필드가 충분히 입력되지 않은 경우, 이슈 작성자에게 이 기능이 어떻게 접근성을 높이는지 질문할 수 있습니다.
    - 기능의 접근성 설명은 이슈 검토자를 포함한 커뮤니티의 다른 구성원이 제공할 수 있습니다.
2. 새로운 기능 요청은 다음 기준에 따라 포함 여부를 평가할 수 있습니다.
   - 해당 기능이 p5.js의 프로젝트 범위와 [디자인 원칙](design_principles.md)에 적합한가요?
     - 예를 들어, 새로운 기본 도형을 추가하는 요청은 고려될 수 있지만, 브라우저 기반 IOT 프로토콜 추가 요청은 고려 범위에서 벗어날 가능성이 높습니다.
     - 전반적으로, p5.js의 프로젝트 범위는 드물게 사용되는 기능으로 인한 과도한 팽창을 피하기 위해 상대적으로 범위가 좁아야 합니다.
     - 해당 기능이 p5.js의 프로젝트 범위에 맞지 않는 경우, 이슈 작성자가 기능을 애드온 라이브러리(addon library)로 만들도록 제안합니다.
     - 범위에 맞는지 불분명한 경우, 개념 증명 차원에서 애드온 라이브러리(addon library)를 제안하는 것도 좋은 방법입니다. 이는 사용자에게 기능을 사용할 수 있는 방법을 제공하고, 쓰임새와 중요성에 대한 훨씬 더 구체적인 예시를 제공하며, 완전히 통합된 기능처럼 해결책이 완벽할 필요는 없습니다. 나중에 적합하다고 판단될 경우 p5.js 내에 통합될 수 있습니다.
   - 해당 기능이 이전 버전과 호환성이 없는 변경(breaking changes)의 원인이 될 수 있나요?
     - 기존 p5.js 함수 및 변수와 충돌이 발생하나요?
     - 기존에 p5.js로 작성된 일반적인 스케치와 충돌하요?
     - 위와 같이 충돌을 일으킬 수 있는 기능들은 이전 버전과 호환성이 없는 변경으로 간주됩니다. [주요 버전 배포](https://docs.npmjs.com/about-semantic-versioning)가 아니면 우리는 p5.js에 이전 버전과 호환성이 없는 변경을 만들지는 않습니다.
   - 제안된 새로운 기능이 p5.js에 이미 있는 기능, 비교적 간단한 순수 자바스크립트 코드나 기존의 사용하기 쉬운 라이브러리를 사용하여 만들어질 수 있나요?
     - 예를 들어, 문자열 배열을 연결하기 위해 p5.js 함수 `join(["Hello", "world!"])`보다는 자바스크립트 기본 문법인 `["Hello", "world!"].join()`가 우선시됩니다.
3. 접근성 요구 사항과 나머지 고려 사항이 충족된 경우, PR을 시작하기 전에 최소 2명의 스튜어드 또는 유지관리자가 새로운 기능 요청을 승인해야 합니다. 새로운 기능에 대한 PR 검토 과정은 아래에 설명되어 있습니다.


### 기능 향상

기능 향상 이슈는 "기존 기능 향상(Existing Feature Enhancement)" 이슈 템플릿(template)을 사용해야 합니다. 이 과정은 새로운 기능 요청과 매우 비슷합니다. 가끔 새로운 기능 요청과 기능 향상의 차이가 명확하지 않을 수 있습니다. 기능 향상은 주로 p5.js의 기존 기능을 다루지만, 새로운 기능 요청은 완전히 새로운 기능을 추가하도록 요청할 수 있습니다.

1. 새로운 기능 요청과 마찬가지로 기능 향상은 p5.js에 대한 접근성을 높이는 경우에만 허용됩니다. [위 섹션](http://guidelines.md#feature-request)의 1번 항목을 참고해주세요.
2. 기능 향상에 대한 포함 기준은 기능 요청의 경우와 비슷하지만, 잠재적으로 이전 버전과 호환성이 없는 변경(breaking changes)을 특히 주의해야 합니다.
   - 기존 함수를 수정하는 경우, 모든 이전의 유효하고 문서화된 함수 시그니처(function signature, 함수의 원형에 명시되는 매개변수 리스트)가 같은 방식으로 동작해야 합니다.
3. 기능 향상은 PR이 시작되기 전에 적어도 한 명의 스튜어드 또는 유지관리자의 승인을 받아야 합니다. 기능 향상을 위한 PR 검토 과정은 아래에 문서화되어 있습니다.

### 토론(Discussion)

매우 간단한 템플릿 "토론(Discussion)"을 가지고 있으며 기능 요청과 같은 좀 더 구체적인 것으로 통합하기 전에 일반적으로 주제에 대한 피드백을 모으는 데에 사용되어야 합니다. 이런 종류의 토론 이슈는 대화가 끝나고 구체적인 문제가 생성되면 종료될 수 있습니다:

- 이슈가 토론으로 열려 있다면 버그 보고 같은 것들은 올바른 라벨을 적용하고 “토론” 라벨을 없애야 합니다. 버그에 대한 추가 정보가 포함되지 않았다면 작성자에게 요청해야 합니다.
- 토론으로 이가 열렸지만 소스 코드 기여와 관련이 없거나 깃허브 리포지토리(repository)/기여 과정/기여 커뮤니티와 관련이 없는 경우 포럼(forum) 또는 디스코드(Discord)로 리디렉션하고고 문제를 닫아야 합니다.
- 관련이 있는 경우에는, 한 눈에 어떤 유형의 토론인지 알 수 있게 표시하기 위해 토론 이슈에 라벨을 추가해야 합니다.

---


## 풀 리퀘스트(Pull Requests)

p5.js 리포지토리(repository)에 대한 대부분의 코드 기여는 풀 리퀘스트(pull request)를 통해 이루어집니다. 스튜어드와 유지관리자는 리포지토리에 대한 푸시(push) 권한이 있지만 코드 기여 시 똑같이 이슈 > PR > 검토 과정을 거치도록 권장합니다. PR을 검토하는 단계는 다음과 같습니다:

- 풀 리퀘스트 템플릿은 [이 곳](https://github.com/processing/p5.js/blob/main/.github/PULL_REQUEST_TEMPLATE.md)에서 확인할 수 있습니다.
- 거의 모든 풀 리퀘스트는 먼저 관련 이슈를 열고 논의해야 합니다. 즉, 관련 [이슈 작업 절차(workflow)](steward_guidelines.md#issues)를 먼저 따른 뒤에 스튜어드나 유지관리자가 검토해야 합니다.
    - 절차가 적용되지 않는 유일한 경우는 매우 간단한 오타 수정 뿐이며, 이슈를 열 필요가 없고 특정 분야의 스튜어드가 아니더라도 리포지토리에 대한 병합(merge) 권한이 있는 모든 사람이 병합할 수 있습니다.
    - 이러한 예외가 존재하지만, 우리는 기여자들이 새로운 이슈를 먼저 열도록 권장합니다. 즉, 예외가 적용될지 잘 모르겠다면 어쨌든 이슈를 열어보세요!
- 제시된 이슈가 풀 리퀘스트를 통해 완전히 해결되지 않았다면, 원본 게시물(post)의 "Resolves #OOOO"를 "Addresses #OOOO"로 수정하여 PR 병합 시에 원본 이슈가 자동으로 닫히지 않게끔 할 수 있습니다.

### 간단한 수정

약간의 오타 수정 같은 간단한 수정은 병합(merge) 권한이 있는 누구나 직접 병합할 수 있습니다. PR의 “변경된 파일(Files Changed)” 탭에서 자동 지속적 통합(Continuous Integration, CI) 테스트를 통과하는지 확인하세요.

![The "files changed" tab when viewing a pull request on GitHub](../images/files-changed.png)

![The "All checks have passed" indicator on a GitHub pull request, highlighted above the merge button](../images/all-checks-passed.png)


### 버그 수정

1. 버그 수정은 관련 분야의 스튜어드에 의해 검토되어야 하며, 이상적으로는 해당 이슈의 수정을 승인한 동일한 사람이 이를 수행해야 합니다.
2. PR의 "변경된 파일(Files Changed)" 탭을 이슈 토론(discussion)에 설명된 대로 수정이 되었는지 최초로 검토하는 데에 사용할 수 있습니다.
3. PR은 가능하고 적절하다면 로컬에서 테스트해야 합니다. GitHub CLI는 일부 과정을 간소화하는 데에 도움이 될 수 있습니다 (더 많은 내용은 아래의 [팁과 요령](steward_guidelines.md#tips-tricks)에 있습니다).
   - [ ] 수정은 원래의 이슈를 충분히 해결해야 합니다.
   - [ ] 수정은 원래의 이슈에서 합의되지 않는 한 기존 동작을 변경해서는 안됩니다.
   - [ ] 수정은 p5.js의 성능에 큰 영향을 주지 않아야 합니다.
   - [ ] 수정은 p5.js의 접근성에 어떤 영향도 주지 않아야 합니다.
   - [ ] 수정은 최신 표준 자바스크립트 코딩을 사용해야 합니다.
   - [ ] 수정사항은 자동화된 테스트를 모두 통과해야 하고 관련 있는 경우에 새 테스트를 포함해야 합니다.
4. 추가 변경 사항이 필요한 경우, [이 곳](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request)에 설명된 대로 해당 행에 줄별 주석(line comments)을 추가해야 합니다.
   - 제안 블록(suggestion block)으로 특정 변경 사항을 제안할 수도 있습니다:\
     ![The Suggest Change button while writing a comment on code in a GitHub pull request](../images/suggest-change.png)\
     ![A suggested change appearing within code fences with the "suggestion" tag](../images/suggested-value-change.png)\
     ![A suggested change previewed as a diff](../images/suggestion-preview.png)
   - 여러 번 변경이 필요한 경우 한 줄 주석(single-line comments)을 여러 번 추가하지 마세요. 대신 문서화된 [이 곳](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request)에 절차에 따라 여러 줄 주석(multiple-line comments)과 한 번의 요청으로 변경하세요.
   - 줄별 주석(line comments)이 설명이나 토론을 위한 것이라면, “변경 요청(Request changes)” 대신 “답글(Comment)”을 선택해 주세요:\
     ![The "comment" option circled within the GitHub Finish Review menu](../images/comment-review.png)
5. 한 번 PR이 검토되고 더 이상 변경이 필요하지 않으면 스튜어드는 추가 댓글이 있든 없든 이전 단계에서 “승인(Approve)” 옵션을 선택하여 PR을 “승인(Approved)”으로 표시할 수 있습니다. 그런 다음 스튜어드는 원한다면 다른 스튜어드나 유지관리자에게 추가 검토를 요청할 수 있고, 병합(merge) 권한이 있다면 PR을 병합하거나 유지관리자에게 병합을 요청할 수 있습니다.

6. 새로운 기여자를 [README.md](http://readme.md/) 파일의 기여자 목록에 추가하려면 @[all-contributors](https://allcontributors.org/docs/en/emoji-key) 봇을 호출해야 합니다. 각각의 기여 유형은 아래의 `[contribution` `type]`에 표시할 수 있고, 사용할 수 있는 기여 유형의 전체 목록은 위 링크에서 확인할 수 있습니다.
    
    ![images/suggest-change.png](../images/suggest-change.png)
    
    ![images/suggested-value-change.png](../images/suggested-value-change.png)
    
    ![images/suggestion-preview.png](../images/suggestion-preview.png)

`@all-contributors` `please` `add` `@[GitHub` `handle]` `for` `[contribution` `type]`


### 새로운 기능/기능 향상

새로운 기능 또는 기능 향상 PR은 버그 수정과 비슷하지만 한 가지 주목해야 할 차이점이 있습니다:

- 새로운 기능/기능 향상 PR은 병합(merge)되기 전에 적어도 두 명의 스튜어드 또는 유지관리자의 검토와 승인을 받아야 합니다.


### 디펜다봇(Dependabot)

디펜다봇(Dependabot) PR은 보통 리포지토리의 관리자(admins)에게만 표시되므로 여러분에게 해당하지 않는다면 이 섹션을 건너뛰어 주세요.

- [유의적 버전(semver)](https://semver.org/) 패치(patch) 버전 업데이트면서 자동 CI 테스트를 통과한 경우에 Dependabot PR은 바로 병합(merge)될 수 있습니다.
- 디펜다봇 PR이 유의적 버전의 경미한 변경 사항을 다루는 경우, 보통 자동 CI 테스트만 통과하면 바로 병합될 수 있습니다. 빠르게 업데이트된 종속성(dependency)의 변경 기록(changelog)을 확인하는 것이 좋습니다.
- 디펜다봇 PR이 유의적 버전의 주요 변경 사항을 다루는 경우, 빌드 과정이나 p5.js 기능에 영향을 줄 수 있습니다. 이 경우에 검토자(reviewer)는 가능하면 최신 버전부터 대상 버전까지의 변경 기록을 검토하고, PR을 로컬 환경에서 테스트하여 모든 과정이 정상적으로 작동하는지 확인합니다. 그리고 종속성의 호환성 문제 대비에 필요한 모든 변경 사항을 제출합니다.
  - Node.js는 매우 오래된 버전에 대한 공식 지원을 중단하기 때문에, 꽤나 많은 종속성이 주요 버전과 충돌합니다. 주요 버전 변경이 반드시 종속성 API 변경으로 인한 것은 아닙니다.

---


## 빌드 과정

이 섹션에서는 일반적인 빌드 설정이나 명령어는 다루지 않고, 대신 뒤에서 무슨 일이 일어나고 있는지 자세히 설명합니다.

Gruntfile.js 파일에는 p5.js에 대한 주요 빌드 정의들이 포함되어 있습니다. 라이브러리와 문서를 구축하는 데 사용된 다양한 도구 중에는 Grunt, Browserify, YUIDoc, ESLint, Babel, Uglify, Mocha가 포함되어 있지만 이게 다는 아닙니다. `default` 작업으로 시작하여 거기서부터 거꾸로 작업하는 것이 우리에게 도움될 수 있습니다. 이 시점에는 아래의 설명을 따라가며 Gruntfile.js를 열어보는 것이 도움될 수 있습니다.


### 주요 빌드 작업

```
grunt.registerTask('default', ['lint', 'test']);
```

`grunt` 또는 npm 스크립트 `npm test`를 열었을 때, `lint`와 `test`로 구성된 기본 작업이 실행됩니다.


#### `lint` 작업

```
grunt.registerTask('lint', ['lint:source', 'lint:samples']);
```

`lint` 작업은 두 가지 하위 작업으로 구성됩니다: `lint:source` 및 `lint:samples`. `lint:source` 는 다시 ESLint를 사용하여 빌드 스크립트, 소스 코드, 테스트 스크립트를 확인하는 `eslint:build`, `eslint:source`, `eslint:test`의 세 가지 하위 작업으로 나뉩니다.

`lint:samples` 작업은 우선 `yuidoc:prod`, `clean:reference`, `minjson`로 구성된 `yui` 작업을 실행합니다. 이는 소스 코드로부터 문서를 추출하여 JSON 문서로 변환합니다. 또, 이전 단계에서 사용되지 않은 파일을 제거하며, 생성된 JSON 파일을 각각 `data.min.json` 로 최소화합니다.

`lint:samples` 다음은 `eslint-samples:source`로, [./tasks/build/eslint-samples.js](tasks/build/eslint-samples.js)에 정의되어 있는 사용자 작성 작업입니다; 이는 문서 예제 코드가 p5.js의 나머지 부분와 동일한 코딩 규칙을 따르는지 확인하기 위해 ESLint를 실행할 것입니다 (예제를 린트(lint)하기 전에 JSON 파일을 빌드해야 하기 때문에 여기서 `yui`는 먼저 실행됩니다).


#### `test` 작업

```js
grunt.registerTask('test', [
  'build',
  'connect:server',
  'mochaChrome',
  'mochaTest',
  'nyc:report'
]);
```

먼저 `test` 아래의 `build` 작업을 살펴보겠습니다.

```js
grunt.registerTask('build', [
  'browserify',
  'browserify:min',
  'uglify',
  'browserify:test'
]);
```

`browserify`로 시작하는 작업들은 [./tasks/build/browserify.js](tasks/build/browserify.js)에 정의되어 있습니다. 이 작업들은 모두 약간의 차이가 있지만 비슷한 단계로 되어 있습니다. 다음은 많은 소스 코드 파일에서 전체 p5.js 라이브러리를 하나로 빌드하는 주요 단계입니다:

- `browserify`는 p5.js를 빌드하는 반면, `browserify:min`는 다음 단계에서 최소화할 중간 파일들을 빌드합니다. `browserify`와 `browserify:min`의 차이점은 `browserify:min`에는 FES가 작동하는 데 필요한 데이터가 포함되어 있지 않다는 것입니다.
- `uglify`는 `browserify:min` 의 출력 파일을 가져와 최종적으로 p5.min.js로 최소화합니다 (이 단계의 구성은 메인 Gruntfile.js에 있습니다).
- `browserify:test`는 [Istanbul](https://istanbul.js.org/)을 사용하여 전체 p5.js와 동일한 버전으로 빌드됩니다. 단, 테스트 코드 커버리지(test code coverage) 보고를 위해 추가된 코드를 제외하고 빌드됩니다.

먼저,  `fs.readFileSync()` node.js 전용 코드의 사용은  `brfs-babel`을 사용하여 파일의 실제 내용으로 대체됩니다. 이는 WebGL 코드에서 별도의 파일로 작성된 소스 코드로부터 셰이더(shader) 코드를 삽입(inline)하기 위해 사용됩니다.

다음으로, node_modules의 모든 종속성(dependency)을 포함한 소스 코드가 Babel을 사용하여 package.json에서 정의된 Browserslist 요구 사항에 맞춰 트랜스파일(transpile)하고, ES6 import문(import statement)을 browserify가 이해하는 CommonJS require()로 변환합니다. 이를 통해 브라우저 호환성에 대한 걱정 없이 ES6 이상에서 사용할 수 있는 최신 구문(syntax)을 사용할 수 있게 됩니다.

번들링(bundling) 후, 번들링된 코드가 파일에 기록되기 전까지 코드는 `pretty-fast`를 통해 전달됩니다. 최소화할 것이 아니라면, 최종 포맷이 좀 더 일관되도록 정리되어야 합니다 (원하는 경우 p5.js 소스 코드를 읽고 검사할 수 있을 것으로 예상됩니다).

이 곳에 몇 가지 세부 단계가 나와 있습니다; 위에 링크된 browserify 빌드 정의 파일을 확인하여 모든 내용을 자세히 확인할 수 있습니다.

```
connect:server
```

이 단계에서는 테스트 파일과 빌드된 소스 코드 파일을 호스팅하는 로컬 서버를 가동하여 크롬(Chrome)에서 자동화된 테스트를 실행할 수 있도록 합니다.

```
mochaChrome
```

이 단계는 [./tasks/test/mocha-chrome.js](tasks/test/mocha-chrome.js)에 정의되어 있습니다. Puppeteer를 사용해 원격 제어가 가능한 크롬의 헤드리스 버전을 가동하고, `./test` 폴더에 있는 HTML 파일과 관련된 테스트를 실행합니다. 여기에는 라이브러리의 축소되지 않은 버전과 축소된 버전을 단위 테스트(unit test) 모음에 대해 테스트하는 것은 물론, 모든 레퍼런스 예제를 테스트하는 것도 포함되어 있습니다. 

```
mochaTest
```

이 단계는 크롬 대신 node.js에서 실행되고 라이브러리의 기능 중 일부만 테스트한다는 점에서 `mochaChrome`과 차이가 있습니다. 대부분의 p5.js 기능은 브라우저 환경이 필요하므로 이 테스트 세트는 새로운 테스트에 브라우저 환경이 필요하지 않을 때만 확장해야 합니다.

```
nyc:report
```

마지막으로, 모든 빌드와 테스트가 완료되면 이 단계에서는 `mochaChrome`이 전체 라이브러리 버전을 테스트하는 동안 테스트 커버리지 보고서를 수집하고, 테스트 범위 데이터를 콘솔에 출력합니다. p5.js의 테스트 커버리지는 주로 추가적인 데이터 포인트를 모니터링하고 확보하는 것으로, 테스트 커버리지 100%를 목표로 하지는 않습니다.

여기까지 우리는 Gruntfile.js 의 기본적인 환경 구성(configuration) 작업을 다루어 보았습니다.


### 기타 작업

모든 단계는 `npx grunt [step]`으로 직접 실행할 수 있습니다. 위에서 다루지는 않았지만 특정 상황에서 유용할 수 있는 몇 가지 작업도 있습니다.

```
grunt yui:dev
```

이 작업은 위에 설명된 문서 및 라이브러리 빌드를 실행한 다음, 웹 서버를 가동합니다. 이 웹 서버는 [http://localhost:9001/docs/reference/](http://localhost:9001/docs/reference/)와 기능적으로 유사한 레퍼런스 페이지를 제공합니다. 그런 다음 소스 코드의 변경점을 모니터링하고 문서와 라이브러리를 다시 빌드합니다.

`grunt` `yui:dev`는 인라인 문서의 레퍼런스 작업을 할 때 유용한데, 빌드된 파일을 p5.js 저장소(repository)에서 로컬 p5.js 웹사이트 저장소로 이동할 필요도, 변경사항이 생길 때마다 웹사이트를 다시 빌드할 필요도 없기 때문입니다. 그저 브라우저에서 약간 단순화된 레퍼런스 버전으로 변경사항을 미리 보면 됩니다. 이렇게 하면 변경사항이 웹사이트에 올바르게 표시되는지 여부를 확인할 수 있습니다. 이는 인라인 문서를 수정하는 경우에만 해당된다는 것을 알아두세요. 스타일 및 레이아웃 작업을 포함한 레퍼런스 페이지 자체에 대한 변경사항은 웹사이트 저장소에서 생성 및 테스트해야 합니다.


```
grunt watch
grunt watch:main
grunt watch:quick
```

워치(Watch) 작업은 여러 파일의 변경사항을 감시하고, 관련 작업을 실행하여 변경된 파일에 따라 레퍼런스나 라이브러리를 빌드합니다. 이러한 작업은 범위의 차이를 제외하면 모두 동일한 작업을 수행합니다. 

`watch` 작업은 소스 코드의 변경사항을 감지할 때 모든 빌드와 테스트를 실행합니다. 마치 전체 기본 작업을 실행하는 것처럼 보일 거예요. 

`watch:main` 작업은 라이브러리 빌드와 테스트를 실행하지만, 소스 코드의 변경사항을 감지해도 레퍼런스를 다시 빌드하지는 않습니다.

`watch:quick` 작업은 소스 코드의 변경사항이 감지된 경우에만 라이브러리 빌드를 실행합니다.

작업 중인 내용에 따라 가장 효율적인 워치(watch) 작업 방식을 선택한다면 매 변경사항마다 수동으로 다시 빌드하지 않아도 됩니다.

---


## 배포 과정

[release\_process.md](release_process.md)를 확인하세요.

---


## 팁과 요령

때때로 검토가 필요한 이슈와 PR의 수가 너무 많아질 수도 있습니다. 보다 용이한 이슈 및 PR 검토를 위한 팁과 요령 몇 가지를 알려드립니다.


### 회신 양식 (Reply Template)

이슈 또는 풀 리퀘스트에 대한 회신 작성을 돕는 깃허브(GitHub) 기능인 [저장된 회신(Saved Replies)](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies/about-saved-replies)이 있습니다. 위에 설명된 작업 흐름(workflow) 중 일부는 동일하거나 매우 유사한 답변(포럼으로 질문을 리디렉션하거나, 수정을 위한 이슈 승인 등)으로 이슈 또는 PR에 응답해야 할 수도 있는데, **저장된 회신**을 사용하면 이 작업의 효율이 조금 더 올라갈 수 있습니다.

다음은 p5.js 유지관리자(maintainer)가 사용하는 **저장된 회신**의 일부입니다. 이를 사용하거나 직접 만들어 보세요!


##### 종결(Closing): 재현할 수 없음
> We're not able to reproduce this, but please feel free to reopen if you can provide a code sample that demonstrates the issue. Thanks!

> 이것을 재현할 수는 없지만, 이 이슈를 보여줄 수 있는 샘플 코드를 제공할 수 있다면 다시 열어주세요. 감사합니다!


##### 종결(Closing): 스니펫 필요
>I'm closing this for organizational purposes. Please reopen if you can provide a code snippet that illustrates the issue. Thanks!

> 조직 운영 및 관리 차원에서 이 이슈를 종결합니다. 이 이슈를 설명하는 코드 스니펫을 제공할 수 있다면 다시 열어주세요. 감사합니다!


##### 종결(Closing): 포럼 사용
>The GitHub issues here are a good place for bugs and issues with the p5.js library itself. For questions about writing your own code, tests, or following tutorials, the [forum](https://discourse.processing.org/) is the best place to post. Thanks!

> 깃허브 이슈는 p5.js 라이브러리 자체의 버그나 이슈를 올리는 곳입니다. 여러분의 코드나 테스트, 또는 튜토리얼에 대한 것에 대한 질문을 하고 싶다면 [포럼](https://discourse.processing.org/)만한 곳이 없을 거에요. 감사합니다!


##### 종결(Closing): GSOC
>Thanks! The best place to discuss GSOC proposals is on our [forum](https://discourse.processing.org/c/summer-of-code).

> 감사합니다! GSOC 제안을 논의하고 싶다면 우리의 [포럼](https://discourse.processing.org/c/summer-of-code)만한 곳이 없답니다.


##### 종결(Closing): 접근성
>I'm not seeing a lot of interest in this feature, and we don't have a clear explanation of how it [expands access](access.md), so I will close this for now. If an access statement can be added to the issue request, please feel welcome to reopen.

> 우리는 이 기능으로부터 큰 이점을 찾을 수 없고, 어떻게 [접근성을 확장](access.md)하는지에 대한 명확한 설명이 없으므로 일단 이 이슈를 종결하겠습니다. 이슈 요청에 접근성 설명을 추가할 수 있게 되면 언제든지 다시 열어주세요.

>We do not see a further explanation of how this issue [expands access](access.md), so I will close this issue for now. If a more detailed access statement can be added to the feature request, please feel welcome to reopen it. Thank you!

> 이 이슈로 인해 어떻게 [접근성이 확장](access.md)되는지에 대한 추가 설명이 없으므로 일단 이 이슈를 종결하겠습니다. 기능 요청에 더 자세한 접근성 설명을 추가할 수 있게 되면 언제든지 다시 열어주세요. 감사합니다!


##### 종결(Closing): 애드온(Addon, 부가 기능)
>I think this function is beyond the scope of the p5.js API (we try to keep it as minimal as possible), but it could be a great starting point for an addon library. See the docs here for how to create an addon: [https://github.com/processing/p5.js/blob/main/contributor\_docs/creating\_libraries.md](creating_libraries.md)

> 기능이 p5.js API 범위를 벗어나는 것 같지만 (우리는 최소한의 크기를 유지하고 싶어요), 애드온 라이브러리를 만드는 좋은 시작점이 될 것 같습니다. 애드온을 생성하는 방법을 알고 싶다면 이 문서를 확인해 보세요. [https://github.com/processing/p5.js/blob/main/contributor\_docs/creating\_libraries.md](creating_libraries.md)


##### PR 종결(Closing): 이슈가 먼저 필요함
>Thank you. As a reminder, issues need to be opened before pull requests are opened and tagged with the issue. This is necessary for tracking development and keeping discussion clear. Thanks!

> 감사합니다. 참고로, 풀 리퀘스트를 게시하고 이슈에 태그를 지정하기 전에 먼저 이슈를 게시해야 합니다. 이는 개발을 추적하고 토론을 명확하게 유지하는 데 필요해요. 감사합니다!


##### 이슈 해결 승인
>You can go ahead with a fix. Thanks.

> 계속 해결해도 됩니다. 감사합니다!


##### PR 병합
>Looks good. Thanks!

> 괜찮아 보이는데요? 감사합니다!


### 깃허브 CLI

코드가 복잡한 PR의 경우, 여러분이 로컬에서 테스트할 코드 버전을 복잡한 git 명령어로 가져오면 검토가 어려울 수 있습니다. 다행히도 [깃허브 CLI](https://cli.github.com/)가 이 과정에서 큰 도움을 줄 수 있겠군요.

CLI를 설치하고 로그인하고 `gh pr checkout [pull_request_id]` 명령어를 실행하면 로컬에서 PR 검토가 가능하며, 원격 포크 가져오기, 브랜치 생성, 브랜치 체크아웃 과정이 모두 자동으로 수행됩니다. main 브랜치로 돌아가는 것은 `git checkout main`으로 브랜치를 전환하는 것과 같습니다. 심지어 웹사이트를 방문하지 않고도 CLI에서 PR에 댓글을 남길 수도 있습니다!

깃허브 CLI에는 유용할 수도, 그렇지 않을 수도 있는 수많은 명령어가 있지만, 여전히 사용하기에 좋은 도구입니다.


### 알림 관리

새로운 이슈나 PR에 대해 **이슈** 나 **풀 리퀘스트** 탭을 수동으로 확인하는 대신, 저장소 이름 반대편 저장소 페이지 상단에 눈 아이콘이 있는 **보기(Watch)** 버튼을 클릭하여 저장소를 확인할 수 있습니다.

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](../images/github-repo-metrics.png)

저장소 보기를 활성화하면, 새 이슈, 풀 리퀘스트, 사용자 핸들에 대한 언급 및 저장소에서 구독한 다른 활동과 같은 이벤트가 [알림 페이지](https://github.com/notifications)에 알림으로 전송되며, 이메일의 받은 편지함과 비슷하게 _읽음_, _삭제됨_ 으로 표시될 수 있습니다.

경우에 따라 보기가 활성화된 저장소에 대한 이메일을 GitHub로부터 수신할 수도 있으며, [알림 설정 페이지](https://github.com/settings/notifications)에서 (아예 구독 취소하는 것을 포함한) 사용자 설정을 할 수 있습니다.

작업 방식에 맞는 알림 방식을 선택하는 과정에서, 여러분은 이슈 및 PR 검토 사안을 직접 찾아내야 하는 귀찮음과, 깃허브의 끝없는 알림 압박 사이의 선택지에 서 있게 됩니다. 여기에는 균형 잡힌 선택이 필요한데, 만약 처음이라면 스튜어드는 **이슈**와 **풀 리퀘스트**에 대해 이 저장소에 **보기**를 활성화하고, "참여, @멘션 및 사용자 정의"에 대한 이메일만 수신하도록 설정하는 것을 추천합니다. 
