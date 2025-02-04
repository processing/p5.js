<!-- GitHub에서 p5.js에 기여하는 데 필수적인 정보. -->

# 기여자 가이드라인

기여자 가이드라인에 오신 것을 환영합니다! 이 문서는 p5.js에 코드를 기여하고자 하는 신규 기여자, 몇 가지 기술적 단계를 다시 기억하고자 하는 기여자 또는 p5.js 코드 기여와 관련된 모든 사람을 위한 문서입니다.

p5.js 리포지토리(repository) 외부에서 기여하려는 경우(튜토리얼 작성, 수업 계획, 이벤트 조직 등), 관련된 다른 페이지를 살펴보세요. 스튜어드 또는 유지 관리자(maintainers)는 이슈 및 풀 리퀘스트를 검토하는 데 더 유용한 [스튜어드 가이드라인](https://github.com/processing/p5.js/blob/main/contributor_docs/steward_guidelines.md)을 찾을 수 있습니다.

이 문서는 비교적 긴 종합적인 문서이지만, 가능한 모든 단계와 항목을 명확하게 지시하도록 할 것입니다. 목차를 활용하여 자신에게 관련된 섹션을 찾아보세요. 계획된 기여와 관련이 없는 경우 섹션을 건너 뛰어도 괜찮습니다.

**새로운 기여자인 경우 첫 번째 섹션 "이슈(Issue)에 대해 모두 알아보기"로 시작하는 것이 좋습니다. 개발 프로세스의 단계별 설정만 필요한 경우 "개발자를 위한 빠른 시작" 섹션을 참조하세요.**


# 목차

- [이슈(Issue)에 대해 모두 알아보기](all-about-issues)
  - [이슈(Issue)란 무엇인가요?](what-are-issues)
  - [이슈 템플릿(Issue Templates)](issue-templates)
    - [버그 발견](found-a-bug)
    - [기존 기능 향상](existing-feature-enhancement)
    - [새로운 기능 요청](new-feature-request)
    - [토론(Discussion)](discussion)
- [p5.js 코드베이스 작업](working-on-the-p5js-codebase)
  - [개발자를 위한 빠른 시작](quick-get-started-for-developers)
  - [Github 편집 기능 사용하기](using-the-github-edit-functionality)
  - [p5.js를 포크하고 포크에서 작업하기](forking-p5js-and-working-from-your-fork)
    - [Github Desktop 사용하기](using-github-desktop)
    - [git 명령줄(command line) 인터페이스 사용하기](using-the-git-command-line-interface)
  - [코드베이스(code base) 분석](codebase-breakdown)
  - [빌드 설정](build-setup)
  - [Git 워크플로우](git-workflow)
    - [소스 코드](source-code)
    - [단위 테스트](unit-tests)
    - [인라인 문서화](inline-documentation)
    - [국제화](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#internationalization)
    - [접근성](accessibility)
  - [코드 표준](code-standard)
  - [소프트웨어 디자인 원칙](software-design-principles)
- [풀 리퀘스트](pull-requests)
  - [풀 리퀘스트 생성](creating-a-pull-request)
    - [풀 리퀘스트 정보](pull-request-information)
    - [제목](title)
    - [해결](resolves)
    - [변경 사항](changes)
    - [변경 사항의 스크린샷](screenshots-of-the-change)
    - [풀 리퀘스트 체크리스트](pr-checklist)
    - [리베이스 및 충돌 해결](rebase-and-resolve-conflicts)
  - [논의 및 고치기(amend)](discuss-and-amend)

---


# 이슈에 대해 모두 알아보기 

p5.js의 GitHub 리포지토리(줄여서, repo)에서 활동의 대부분이 이슈에서 발생하며, 이는 여러분이 기여를 시작하는 여정을 하기 좋은 장소입니다.


## 이슈란 무엇인가?

![A cropped screenshot of the p5.js library GitHub repository, only showing contents of the top right corner. A red box is drawn on top of the screenshot surrounding the Issues tab.](../images/issues-tab.png)

"이슈"는  깃허브 포스트(post)를 일컫는 보편적인 용어이며, 문제에 대해 잘 설명하기 위한 것입니다. 이슈는 버그 보고,  새로운 기능 추가 요청, 의견, 등 p5.js 라이브러리 개발과 관련된 모든 것이 될 수 있습니다.  봇을 포함한 깃허브 계정을 가진 모든 사람이 각 이슈에 코멘트(주석)를 달 수 있습니다! 이슈는 기여자들끼리 리포지토리 내에서 프로젝트 개발과 관련된 주제에 대해 논의하는 공간입니다.

다양한 이유로 이슈가 오픈될 수 있지만 우리는 보통 p5.js 소스 코드에 대한 개발에 대한 논의를 위해 이슈를 사용합니다. 당신의 코드 디버그, 프로젝트 협업자 초대 그리고 관련없는 주제는 [포럼 (forum)](https://discourse.processing.com/) 이나 [디스코드 (Discord)](https://discord.gg/SHQ8dH25r9) 같은 플랫폼에서 상의되어야합니다. 

 깃허브 이슈인지 다른 곳에 포스트 되어야 하는지 결정할 수 있도록, 우리는 쉽게 사용할 수 있는 이슈 템플릿을 만들었습니다!

## 이슈 템플릿

p5.js의 이슈 템플릿은 스튜어드와 유지 관리자가 이슈를 이해하고 검토하기 쉽게 만들어줍니다. 또한 해당 이슈를 쉽게 제출하고 더 빠르게 답변을 받을 수 있도록 도와줍니다.

![Screenshot of an example of what an issue looks like on GitHub. The title of the issue in the screenshot is "Warning being logged in Safari when using a filter shader in 2D mode #6597"](../images/github-issue.png)

새로운 이슈를 제기하려면  p5.js 저장소의 "Issues" 탭으로 이동하고 오른쪽에 있는 "New issue" 버튼을 클릭하기만 하면 됩니다. 여러 가지 옵션이 제시되며 각각은 관련된 이슈 템플릿에 해당하거나 질문을 제출할 적절한 위치로 리디렉션됩니다.  이슈가 제대로 된 관심을 받을 수 있도록 가장 연관성있는 옵션을 선택하는 것을 권장합니다.

![Cropped screenshot of the GitHub repository's issue page with the green "New issue" button highlighted with a red box surrounding it.](../images/new-issue.png)

### ["버그 발견"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Bug\&projects=\&template=found-a-bug.yml)

p5.js에서 잘못된 동작이 발생하거나 문서에 설명된 대로 동작하지 않는 경우[이 템플릿](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Bug\&projects=\&template=found-a-bug.yml)을 사용하세요. 스케치(sketch) 디버깅 중 발생한 코드 문제는 먼저  [Discourse 포럼](https://discourse.processing.org) 에서 질문하세요.

이 템플릿에 채워야 할 몇 가지 필드가 있습니다:

1. *가장 적합한 p5.js 하위 영역은 무엇인가요?* -  이는 문제를 식별하고 응답하기 위해 이슈에 자동으로  [라벨(label)]태그를 지정하여 도와줍니다.(https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md).
2. *p5.js 버전* - p5.js 버전 번호는`<script>` 태그 링크 또는 p5.js/p5.min.js 파일의 첫 번째 줄에서 찾을 수 있습니다. 이것은  `1.4.2` 와 같이 점으로 구분된 세 개의 숫자로 이루어져 있을 것입니다.
3. *웹 브라우저 및 버전* - 이는 브라우저 간의 다른 동작을 분리하는 데 도움이 됩니다. 브라우저 버전 번호를 찾으려면 사용 중인 브라우저에 따라 아래 표의 지침을 따르세요.





<table>

<tr>

<td>

Chrome

</td>

<td>

Firefox

</td>

<td>

Safari

</td>

</tr>

<tr>

<td>

In the address bar, navigate to `chrome://version`

</td>

<td>

In the address bar, navigate to  `about:support`

</td>

<td>

Under the top bar “Safari” menu item, choose “About Safari”

</td>

</tr>

</table>


4. *운영 체제* - 가능하면 운영 체제 버전 번호를 포함해야 합니다. 예:  `macOS 12.5`. 일부 버그는 운영 체제의 동작에서 비롯될 수 있습니다.
5. *이것을 재현하는 단계* - 이것은 공유해야 할 가장 중요한 정보입니다. 여러분이 보고 있는 버그를 재현하기 위한 세부 단계를 나열해야 합니다. 문제를 보여주는 기본적인 예제 코드를 공유하는 것은 어떤 사람이 당신이 겪고 있는 버그를 재현하고 해결책을 만들기 시작하는 데 큰 도움이 될 수 있습니다.

**재현이 핵심입니다!** 이 템플릿의 많은 필드는 버그를 복제하는 것을 목표로 합니다. 여러분의 스케치 환경과 다른 사람이 여러분이 발견한 문제를 재현시킬 수 있는 방법에 대해 더 많은 정보를 제공할수록 누구든지 여러분의 문제를 이해하고 해결책을 찾기에 더 쉬워질 것 입니다.

**가능한 한 자세히 설명하고 추상적인 문장을 피하세요.**, 예를 들어 "image() function이 작동하지 않습니다”이라고 하지 말고 "image() function이 로드된 GIF 이미지를 올바른 크기로 표시하지 않습니다” 과 같이 더 구체적으로 설명하세요. 여러분이 마주치고 있는 버그를 설명하는 유용한 방법은 다음 두 가지를 설명하는 것입니다.

1. 당신이 공유한 샘플 코드가 무엇을 기대하는지 (예상되는 동작).
2. 샘플 코드가 실제로 어떻게 작동하는지 (실제 동작).


여러분이 방금 보고한 버그를 수정하고 싶다면, 설명란에 그렇게 표시할 수 있습니다. 그 후 방금 설명한 버그를 어떻게 수정할 것인지 간단한 제안을 제공할 수 있습니다. 이렇게 하면 얼마나 많은 지원이 필요한지를 알 수 있습니다.

**이슈가 승인되지 않거나 이슈에 대한 승인이 이루어지기 전에 해당 이슈와 관련된 풀 리퀘스트를 제출하거나 코드 변경 작업을 시작해서는 안됩니다**; 제안된 수정이 수락되지 않을 수 있습니다. 완전히 다른 접근 방식이 필요할 수 있거나 실제 문제가 다른 곳에 있을 수 있기 때문입니다. 이슈가 수정 승인이 나기 전에 제출된 모든 풀 리퀘스트는 이슈에 대한 승인이 날 때까지 닫혀있을 것입니다(closed).

수정을 위해 승인된 이슈에는 적어도 한 명의 [영역 스튜어드 또는 유지 관리자](https://github.com/processing/p5.js#stewards)의 승인을 받아야 풀 리퀘스트를 위한 작업을 시작할 수 있습니다.


### ["기존 기능 향상"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Enhancement\&projects=\&template=existing-feature-enhancement.yml)

이 템플릿은 p5.js의 기존 기능(함수, 상수, 렌더링 등)에 대한 변경 사항 제안, 또는 새로운 기능 추가를 위해 사용합니다. 예를 들어, `color()` 함수 및 색상을 받아들이는 다른 함수에 새로운 색상 정의 방법을 추가하는 경우에는 이 템플릿을 사용해야 합니다.

이 템플릿에는 몇 가지 필드를 입력해야 합니다.

1. *접근성향상* -이 필수 필드는 제안된 기능 향상을 통해 p5.js가 창작 예술이나 기술 분야에서 역사적으로 소외된 사람들에게 [접근성 향상] (https://github.com/processing/p5.js/blob/main/contributor_docs/access.md )시킬 방법에 대한 설명을 넣는 곳입니다. **이것없이는 어떤 제안도 수락되지 않습니다.**,  "확실하지 않음"을 기입하고 만약 그들이 p5.js의 접근성을 어떻게 다루는지에 대한 아이디어가 있다면, 커뮤니티의 다른 구성원들이 이 논점을 제공할 수 있도록 제안할 수 있습니다.
2. *가장 적합한 p5.js 하위 영역은 무엇인가요?* - 이는 우리가 이슈를 식별하고 해결하는데 도움이 됩니다. 이는 이슈에 자동으로 관련된 [라벨](https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md)을 지정할 것입니다.
3. *기능 향상 세부 사항* - 기능 향상 제안에 대한 설명을 작성하는 곳입니다. 좋은 기능 향상 제안에는 종종 이러한 기능 향상이 무엇, 언제, 어떻게, 그리고 왜 필요한지에 대한 명확한 사용 사례가 포함됩니다.

기능 향상 제안이 승인되기 위해서는 적어도 1명의 [영역 스튜어드 또는 유지 관리자](https://github.com/processing/p5.js#stewards)의 승인이 필요합니다. 

**이슈에 대한 승인이 이루어지기 전에 제안과 관련된 풀 리퀘스트를 제출하거나 코드 변경 작업을 시작해서는 안됩니다.**, 왜냐하면 제안이 수락될 것임을 보장할 수 없기 때문입니다. 승인이 이루어지기 전에 제출된 모든 풀 리퀘스트는 이슈에 대한 승인이 주어질 때까지 닫힙니다(closed).


### ["새로운 기능 요청"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Feature+Request\&projects=\&template=feature-request.yml)

이 템플릿은 p5.js에 새로운 기능을 제안하려는 경우에 사용해야 합니다. 예를 들어, 새로운  `createTable`함수를 사용하여 HTML `<table>`  요소를 그리는 기능을 추가하는 것입니다. 일부 제안은 기존의 기능 향상 제안과 중복될 수 있으며, 이러한 경우에는 가장 적합하다고 생각되는 템플릿을 선택하면 됩니다.

따라서 템플릿 양식 필드는 "기존 기능 향상"의 필드와 거의 동일합니다. 따라서 각 필드를 어떻게 채워 넣어야 하는지에 대한 자세한 내용은[이전 섹션](#existing-feature-enchancement)을 참조해주세요.

새로운 기능 요청 제안이 승인되기 위해서는 최소 2명의 [영역 스튜어드 또는 유지 관리자](https://github.com/processing/p5.js#stewards) 의 승인이 필요합니다.

**제안이 승인되기 전에 제안과 관련된 풀 리퀘스트를 제출하거나 (코드 변경 작업)을 시작해서는 안됩니다.**, 왜냐하면 제안이 수락될 것임을 보장할 수 없기 때문입니다. 승인이 이루어지기 전에 제출된 모든풀 리퀘스트는 이슈에 대한 승인이 주어질 때까지 닫힙니다(closed).


### ["토론(Discussion)"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Discussion\&projects=\&template=discussion.yml)

이 템플릿은 제출 중인 이슈가 위의 어느 것에도 맞지 않을 때 사용됩니다. 실제로는 어느 템플릿에도 맞지 않는 이슈는 비교적 드물어야 합니다. 예를 들어, p5.js에서 특정 웹 API 기능을 채택할지에 대한 토론은 [새로운 기능 요청](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#new-feature-request); 으로 제출해야 합니다. 여러 가지 색상 함수에 추가적인 색상 모드를 추가하는 것에 대한 토론은[기존 기능 향상](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#existing-feature-enchancement); 으로 제출해야 합니다. 여러분이 주최하는 지역 크리에이티브 코딩(creative coding) 이벤트에 대한 발표는 포럼에 게시하고 지원이나 홍보를 원한다면 Processing Foundation에 연락해야 합니다.

토론 이슈를 오픈할 때, 측면 패널의 "라벨" 패널을 사용하여 추가적인 관련 라벨을 추가하여 해당 영역으로 이슈를 알릴 수 있습니다. 템플릿 자체는 최소한의 텍스트 필드만 있는 것입니다. 예시 토론 이슈를 보려면 [이 링크](https://github.com/processing/p5.js/issues/6517)를 확인하세요.

[**⬆ back to top**](#contributor-guidelines)

---


# p5.js 코드베이스 작업

## 사전 요구 사항

계속 진행 하려면 명령줄 git, node.js(v18 이상) 작업을 최소한으로 숙지하고 로컬 개발 환경을 설정해야 합니다.


## 소개

이제 여러분의 이슈가 논의되었고, 구현이 승인되었으며 코드 변경을 하기 위해 준비가 되었습니다. 코드 기반 작업을 시작할 준비가 되었습니다.

마찬가지로, 이슈를 발견했거나 이슈에 대한 토론에 참여했으며 구현이 스튜어드에 의해 승인되었지만 원래 문제 작성자나 커뮤니티의 다른 구성원 모두 이슈에 대해 작업할 의사가 없음을 표시한 경우, 자발적으로 여기에 기여를 제출하고 스튜어드가 이슈를 할당하도록 할 수 있습니다.

**"다른 사람의 차례를 어기면 안 됩니다."**  다른 사람이 기여를 제출할 의향을 표시하거나 이미 다른 사람에게 할당되어 있는 이슈에 대해 풀 리퀘스트을 제출하여 대기열을 넘어서는 안됩니다. 우리는 항상 "선착순" 으로 코드 기여를 받아들이는 것을 우선시할 것입니다.

만약 누군가가 아직 동일한 이슈에 대해 작업 중인 동안 PR을 제출하면, 여러분의 풀 리퀘스트는 닫힐 것입니다. 이슈에 할당된 개인의 마지막 활동이 몇 달 동안 없었다면, 공손한 코멘트를 남겨 진행 상황을 묻고 구현에 도움이 필요한지 물어볼 수 있습니다. 대부분 사람들이 작업하는 많은 시간이 소요되기에 이바지함에 긴 시간을 허용합니다.

마찬가지로, 당신은 자신의 속도로 일하고 얼마나 오래 코드 작업에 시간을 할애할 수 있는지에 대한 엄격한 시간 제한이 없다는 것에 자신감을 가질 필요가 있습니다. 그렇지만, 코드 기여의 어떤 측면에서든 문제가 발생하면 이슈에서 도움을 요청하는 것을 주저하지 마십시오. 스튜어드 및 유지 관리자뿐만 아니라 커뮤니티 회원들도 최선을 다해 안내할 것입니다!


## 개발자를 위한 빠른 시작 가이드

p5.js의🌸 코드베이스(code base)에 대한 작업/기여를 원하는 경우, p5.js를 직접 개선하거나 [친숙한 오류 메세지 시스템](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md)과 같은 하위 프로젝트를 개선하기 위해 다음 단계를 수행할 수 있습니다.

1. [p5.js의 포크를 생성합니다.](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. [생성한 포크를 로컬 컴퓨터에 복제합니다.](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
3. [다음 명령을 사용하여 업스트림(upstream)을 추가합니다.](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork):

  ```
  git remote add upstream https://github.com/processing/p5.js
  ```

4. 당신의 컴퓨터에 [NodeJs](https://nodejs.org/en/download) 가 설치되어 있는지 확인하십시오. 다음 명령어를 사용하여 확인할 수 있습니다:

  ```
  node -v
  ```

5. 아래 명령어를 입력하여 필요한 라이브러리를 설치하세요:

  ```
  npm ci
  ```

6. 다음과 같이 설명적인 브랜치 이름을 사용하여 ` main ` 브랜치에서 git 브랜치를 만들어 주세요:

  ```
  git checkout -b [branch_name]
  ```

7. 코드베이스를 변경하기 시작하면 자주 테스트를 실행하세요. (이 작업은 시간이 걸리지만 기존의 동작이 손상되지 않는지 확인합니다.)

  ```
  npm test
  ```

8. 새로운 기능을 추가하거나 기능 향상을 위해 작업 중인 경우 모든 단위 테스트를 추가합니다.
9. 작업이 완료되면 변경 사항을 커밋하고 [풀 리퀘스트](https://p5js.org/contributor-docs/#/./contributor_guidelines?id=pull-requests)를 생성할 수 있습니다.


## GitHub 편집 기능 사용

GitHub 웹 인터페이스상 파일 내용 상단에 연필 아이콘 버튼이 있습니다. 이 버튼은 GitHub에서 제공하는 편집 기능으로, 여러분이 보고 있는 파일을 빠르고 간편하게 편집할 수 있도록 도와줍니다.

![Cropped screenshot of a file view in GitHub of the p5.js repository, "src/color/color\_conversion.js" file. A red arrow pointing to a pencil icon button on the right side of the image.](../images/edit-file.png)

그러나 매우 단순한 변경 외에는 이 기능을 사용하는 것이 권장되지 않습니다. 이에 대한 주요 이유 중 하나는 소스 코드의 보다 복잡한 변경을 위해 풀 리퀘스트로 제출되기 전에 로컬에서 구축하고 테스트해야 하기 때문입니다. 로컬 개발 환경을 사용하는 것이 이 편집 기능에서 제공하는 기본적인 편집 환경보다 훨씬 유연하게 할 수 있는 경우가 많기 때문입니다.


## p5.js를 포크하고 자신의 포크(fork)에서 작업하기

p5.js 소스 코드를 작업하기 위한 첫 번째 단계는 p5.js 리포지토리(repository)를 포크하는 것입니다. 포크(fork)는 오픈 소스에서 특정한 의미를 가지고 있지만, 여기서는 리포지토리의 사본을 생성하여 자신의 GitHub 계정에 저장하는 것을 의미합니다. 리포지토리를 포크하려면 페이지 상단 근처에 있는 "포크(fork)" 버튼을 클릭하기만 하면 GitHub가 계정에 리포지토리의 복사본을 만듭니다.

![Screenshot of the main page of repository. A button, labeled with a fork icon and "Fork 59.3k," is outlined in dark orange.](../images/fork.png)

p5.js 리포지토리에 대한 직접 쓰기 액세스 권한이 없을 가능성이 높기 때문에 p5.js  리포지토리의 포크에서 작업해야 하며, 포크에서 작업하면 변경한 후 나중에 공식 리포지토리에 다시 제출할 수 있습니다.


### GitHub Desktop 사용

GitHub Desktop은 명령어를 터미널에 입력하는 대신에 그래픽 사용자 인터페이스를 통해 git을 사용할 수 있는 프로그램입니다. git에 익숙하지 않은 경우 좋은 옵션이며, 필요할 때마다 GitHub Desktop과 terminal 사이를 자유롭게 전환할 수 있습니다.

먼저, [GitHub Desktop을 다운로드하고 설치](https://desktop.github.com/)합니다. 설치가 완료되면 응용 프로그램을 엽니다. GitHub 계정으로 로그인하라는 메시지가 나타납니다. 로그인한 후에는 포크한 p5.js 프로젝트를 포함하여 프로젝트 목록이 표시됩니다. 자신의 포크인 `yourUsername/p5.js`를 선택하고 파란색 "Clone" 버튼을 클릭합니다. 프로젝트를 저장할 위치에 대한 몇 가지 세부 정보를 요청할 것입니다. 이를 변경하거나 기본 설정을 유지한 채로 계속할 수 있습니다.

![The GitHub Desktop user interface after signing in. On the right half of the screen, it lists your projects, and a Clone button in the bottom right.](../images/github-desktop-init.png)

복제가 되면 포크를 어떻게 사용할지에 대해 물어볼 것입니다. 상위 프로젝트에 기여할 옵션을 선택하고 "계속(Continue)"을 클릭합니다.

![The view after cloning a fork. It asks if you are planning to contribute to the parent project, or use it for your own purposes.](../images/github-desktop-fork.png)


### `git` 명령줄(command line) 인터페이스 사용하기

포크가 생성되면 포크 페이지로 이동하여 초록색 "Code" 버튼을 클릭해서 git URL을 복사하세요. 이는 `https://github.com/limzykenneth/p5.js.git` 와 같은 모양이어야 합니다.

![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](../images/code-button.png)

다음으로 로컬 환경에서 명령줄로 이동하여 git 저장소를 클론하세요. "클론(Clone)"은 단순히 저장소와 복사본을 로컬 장치로 다운로드하는 것을 의미합니다. p5.js 소스 코드 폴더를 저장하고 싶은 폴더에서 다음 명령어를 실행하세요.

```
git clone [git_url]
```

위에서 복사한 URL을 `[git_url]`자리에 작성하세요. 이 과정은 인터넷 연결 속도에 따라 몇 분 정도 걸릴 수 있으니, 커피 한 잔을 내리면서 기다리는 것도 좋을 것 같아요! 과정이 완료되면, 선호하는 텍스트 에디터에서 다운로드한 `p5.js` 폴더를 열고 내용을 살펴볼 수 있습니다.


## 코드베이스(code base) 분석

p5.js 폴더 안에 있는 몇 가지 주요 파일과 폴더는 다음과 같습니다:

- `src` - 모든 코드가 최종적으로 p5.js와 p5.min.js 파일로 결합되어 위치하는 곳입니다.
- [`test`](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md) - 단위 테스트와 모든 문서 예제를 테스트하기 위한 코드가 위치하는 곳입니다.
- `tasks` - 세밀하게 맞춤화된 빌드 코드가 위치한 곳입니다.
- `Gruntfile.js` - 주요 빌드 구성 파일입니다.
- `contributor_docs` - 기여자들이 작성한 문서를 비롯한 모든 문서 파일이 있는 곳입니다.

다른 파일과 폴더들은 구성 파일이나 다른 종류의 지원 파일일 뿐입니다; 대부분의 경우, 수정할 필요가 없습니다.


## 빌드 설정

시작하기 전에, p5.js를 빌드하고 테스트할 수 있도록 로컬 프로젝트 폴더를 설정해야 합니다. ode.js가 여러분의 컴퓨터에 설치되어 있다는 가정하에, 다음을 실행하세요: 

```
npm ci
```
이 작업은 npm이 필요한 모든 의존성(dependency)을 다운로드해야 하기 때문에 시간이 좀 걸릴 수 있습니다. 하지만, 완료되면 그게 다입니다. 모든 설정이 완료되었습니다. 꽤 간단하죠?

## Git 워크플로우

이제 필요한 변경을 할 준비가 되었습니다. 리포지토리의 여러 부분과 관련 변경 방법에 대한 자세한 내용은 아래의 하위 섹션을 참고해보세요:

```
npm test
```
처음부터 p5.js를 빌드하고 모든 단위 테스트를 실행해보세요. 이 작업은 에러없이 완료되어야 합니다. 테스트 없이 라이브러리만 빌드하고 싶다면, 다음을 실행해보세요:

```
npm run build
```

위의 명령어 중 어느 것을 사용하더라도 `lib/`폴더 안에 `p5.js`와 `p5.min.js`로 라이브러리가 빌드됩니다. 필요한 경우 이 빌드된 파일들을 여러분의 테스트에 사용할 수 있습니다. 

다음으로, 작업을 시작하기 전에 `main` 브랜치에서 새로운 브랜치를 만드는 것이 좋습니다. git에서 브랜치는 이름에서 알 수 있듯이, `main`이나 다른 브랜치에 영향을 주지 않고 커밋을 추가할 수 있는 리포지토리의 분기된 버전입니다. 브랜치는 여러 기능을 동시에 작업할 수 있게 해줍니다. (여러 개의 독립된 브랜치를 사용하는 식으로요!) 그리고 만약 브랜치를 망쳐도 `main` 브랜치에 영향을 주지 않습니다.

GitHub Desktop에서 현재 변경 사항을 모두 커밋하려면 변경 사항을 모두 완료한 후 앱을 열어야 합니다. 왼쪽 사이드바에 변경한 파일 목록이 표시되고, 각 파일 내의 구체적인 변경 사항이 오른쪽에 표시됩니다. 창 하단 왼쪽 모서리에 있는 사용자 아이콘 옆의 입력란에는 간략하고 개괄적인 설명을 입력해야 합니다. 이것이 커밋의 제목이 됩니다. 아래 설명 입력란은 커밋에 대해 더 자세히 작성하거나 그냥 비워둘 수 있습니다. 그 후, 파란색 "Commit" 버튼을 눌러 변경 사항을 확정하세요.


![A screenshot of the GitHub Desktop branch selection menu. After entering a new branch name that does not yet exist, a "Create New Branch" button appears.](../images/github-desktop-create-branch.png)

터미널에서 `main` 브랜치에 있을 때 `git checkout -b branch_name`을 실행하고, `branch_name`을 설명할 수 있는 이름으로 바꾸면 이제 별도의 브랜치에 있게 됩니다.

변경을 진행하면서, 특히 소스 코드를 작업하는 경우, 자주 `npm test`를 실행하는 것이 좋습니다. 이 명령을 실행하는 데는 시간이 조금 걸리지만, 변경 사항이 기존의 동작을 해치지 않는지 확인할 수 있습니다. 아래에 설명된 대로 변경 사항을 커밋하기 전에 `npm test`를 실행해야 합니다.

코드베이스(codebase)에 변경을 완료했다면, 이를 git에 커밋해야 합니다. 커밋은 git 리포지토리에 저장된 변경 사항의 모음으로, 커밋 시점의 리포지토리 내 파일의 현재 상태를 기록합니다. 

git에 얼마나 자주 커밋해야 하는지 궁금하시죠? 일반적으로 여러 큰 변경 사항을 한 커밋에 모으기보다는 자주 커밋하는 것이 좋습니다. 한 문장으로 설명할 수 있는 하위 작업을 완료할 때마다 커밋하는 것이 좋습니다.

GitHub Desktop에서 현재 변경 사항을 모두 커밋하려면 변경 사항을 모두 완료한 후 앱을 엽니다. 왼쪽 사이드바에 변경한 파일 목록이 표시되고, 각 파일 내의 구체적인 변경 사항이 오른쪽에 표시됩니다. 창 하단 왼쪽 모서리에 있는 사용자 아이콘 옆의 입력란에 간단한 고급 설명을 입력합니다. 이것이 커밋의 제목이 됩니다. 아래 설명 입력란은 더 자세히 기술하거나 그냥 비워둘 수 있습니다. 파란색 "Commit" 버튼을 눌러 변경 사항을 확정하세요.


![A screenshot of GitHub Desktop after having made a change. The area where you need to write a title for your change is circled in red in the lower left of the window.](../images/github-desktop-commit.png)

터미널에서 현재 변경 사항을 모두 커밋하려면 다음을 실행하세요:

1. 변경한 파일들을 확인하려면 다음 명령어를 사용하세요. 

```
git status
```

변경하지 않은 파일이 뜬다면, 원래 상태로 [복원](https://git-scm.com/docs/git-restore)해야 하거나 의도한 변경 사항인지 확인해야 합니다. 각 파일의 자세한 변경 사항을 보려면 다음 명령어를 입력하세요.

```
git diff
```

풀 리퀘스트(PR, Pull request)에 포함시키지 않으려는 파일 변경 사항은 커밋해서는 안 됩니다.

2. 다음 명령어로 모든 변경 사항에 git에 커밋하기 위해 스테이징(커밋으로 리포지토리에 저장하다)하세요. 

```
git add .
```

3. 변경 사항을 git에 커밋하려면 다음 명령어를 실행하세요.

```
git commit -m "[your_commit_message]"
```

`[your_commit_message]`는 변경 사항을 설명하는 관련 커밋 메세지로 대체해야 합니다. 일반적인 문구는 피해주세요. 예를 들어 `Documentation fix 1` 대신 `Add documentation example to circle() function`와 같이 적어주세요.

```
git commit -m "Add documentation example to circle() function"
```

위 단계를 모든 커밋에 대해 반복하면서, `npm test`를 주기적으로 실행하여 모든 것이 잘 작동하는지 확인하세요.


### 소스 코드 (Source code)

소스 코드 작업을 시작할 계획을 하고 있거나 여러분의 작업할 p5.js의 기능을 알고 있다면, 시작하기 좋은 방법 중 하나는 문서(Documentation)를 방문하는 것입니다. p5.js 문서의 각 기능 하단에는 해당 소스 코드에 대한 링크가 있습니다.

![Cropped screenshot of a reference page on the p5.js website containing the sentence "Notice any errors or typos? Please let us know. Please feel free to edit src/core/shape/2d\_primitives.js and issue a pull request!". Part of the above sentence where it says "src/core/shape/2d\_primitives.js" is highlighted with a red underline and arrow pointing to it.](../images/reference-code-link.png)


### 단위 테스트 (Unit tests)

단위 테스트에 작업할 계획이라면 [여기](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md)를 참조하세요. 기능 개선, 새로운 기능, 그리고 특정 버그 수정에 대해서는 새로운 구현(implementation)을 커버하는 단위 테스트가 풀 리퀘스트에 포함되어야 한다는 점을 유의하세요.


### 인라인 문서 (Inline documentation)

인라인 문서 작업을 계획하고 있다면, [여기](https://p5js.org/contribute/contributing_to_the_p5js_reference/)를 참조하세요.


### 접근성 (Accessibility)

접근성 기능에 작업할 계획이라면, [여기](https://github.com/processing/p5.js/blob/main/contributor_docs/web_accessibility.md)를 참조하세요. 친절한 에러 시스템에 대해서는 [여기](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md)를 참조하세요.


## 코드 표준

p5.js의 코드 표준 또는 코드 스타일은 [ESLint](https://eslint.org/)에 의해 시행됩니다. 모든 git 커밋(commit)과 풀 리퀘스트(pull request)는 linting(프로그래밍 오류를 찾아내는 과정)을 통과해야만 받아들여집니다. 올바른 코딩 표준을 따르는 가장 쉬운 방법은 텍스트 에디터용 ESLint 플러그인을 사용하고 리팅(linting) 오류 하이라이팅(대부분 에디터용으로 제공됨)을 활성화하는 것입니다.

## 소프트웨어 디자인 원칙

p5.js의 기능에 작업하는 동안, p5.js의 디자인 원칙을 염두에 두는 것이 중요합니다. 우리의 우선순위는 다른 프로젝트의 우선순위와 다를 수 잇으므로, 다른 프로젝트에서 오는 경우 p5.js의 디자인 원칙에 익숙해지는 것이 좋습니다.


- **접근성** 우리는 무엇보다 접근성을 우선시하며, 우리가 내리는 결정은 역사적으로 소외된 그룹에 대한 접근성을 어떻게 늘릴지 고려해야 합니다. 이에 대한 자세한 내용은 우리의 접근성 선언문에서 읽을 수 있습니다.
- **초보자 친화적** p5.js API는 코딩 초보자에게 친화적을 목표로 하며, 최신 HTML5/Canvas/DOM API를 사용하여 인터랙티브하고 시각적인 웹 콘텐츠를 만드는 데 낮은 장벽을 제공합니다.
- **교육적** p5.js는 교육적 사용을 지원하는 API와 커리큘럼에 중점을 두고 있으며, API에 대한 완전한 참조와 함께 예제를 지원하고, 창의적 코딩 원칙을 명확하고 몰입도 있는 순서를 소개하는 튜토리얼과 샘플 수업 커리큘럼을 포함합니다.
- **자바스크립트와 그 커뮤니티** p5.js는 적절한 자바스크립트 디자인 패턴과 사용법을 모델링하면서 필요한 곳에서는 이를 추상화함으로써 초보자에게 웹 개발 관행을 더 접근하기 쉽게 만드는 것을 목표로 합니다. 오픈 소스 라이브러리로서 p5.js는 창작, 문서화, 전파 과정의 넓은 자바스크립트 커뮤니티를 포함합니다.
- **프로세싱과 그 커뮤니티** p5.js는 프로세싱 언어와 그 커뮤니티에 영감을 받았으며, 프로세싱 자바에서 자바스크립트로의 전환을 쉽고 명확하게 만드는 것을 목표로 합니다. 

[**⬆ 위로 올라가기**](#contributor-guidelines)

---


# 풀 리퀘스트 (Pull requests, PR)

필요한 변경사항을 포함하여, 단위 테스트까지 마친 후(해당할 경우), `npm test` 에서 오류가 발생하지 않고 변경사항을 커밋했다면, 공식 p5.js 저장소로 당신의 새 커밋을 병합하기 위한 풀 리퀘스트를 준비할 수 있습니다. 조금 더 공식적으로 말하자면, 풀 리퀘스트는 한 저장소(예를 들어, p5.js 저장소)에 다른 저장소(예를 들어, 여러분이 포크한 p5.js 저장소)로부터의 변경사항을 그 커밋 히스토리로 병합하거나 당겨오도록 요청하는 것입니다.


## 풀 리퀘스트 생성

첫 번째 단계는 새로운 커밋을 p5.js의 당신이 포크한 저장소로 푸시하는 것입니다; 이를 변경사항을 당신의 포크로 업로드하는 것으로 생각하세요.

갓허브 데스크탑(GitHub Desktop)애서는 브랜치를 변경하는 버튼 오른쪽에 변경사항을 깃허브에 푸시하는 버튼이 있습니다. 버튼을 클릭하여 변경 사항을 푸시하세요.![A view of GitHub Desktop after committing changes. The button to push the changes online is circled in red.](../images/publish-branch.png)

코드가 업로드되면, 풀 리퀘스트를 생성하라는 버튼이 표시됩니다. 이 버튼을 한 번 클릭하면 미리보기와 실제로 요청을 생성하는 또 다른 버튼이 표시됩니다. "Create Pull Request" 버튼을 눌러 해당 과정을 시작합니다.

![A screenshot of Github Desktop after pushing code. In the left sidebar, it says "0 changed items." In the right pane, below the "No local changes" header, a blue "Review Pull Request" button has been marked up with a red circle.](../images/preview-pull-request.png)

터미널에서 다음 명령어를 실행해보세요:

```
git push -u origin [branch_name]
```

푸시가 완료되면, 터미널에 풀 리퀘스트를 열 수 있는 링크가 표시될 수 있습니다. 만약 웹 브라우저에서 여러분의 포크로 이동할 수 없다면, 파일 목록 상단의 드롭다운 버튼으로 작업 중인 브랜치로 전환한 후, "Contribute"를 클릭하고 "Open pull request"를 클릭하세요.

![Screenshot of the git command line response after pushing a new branch. It includes a GitHub link to open a new pull request.](../images/new-branch.png)

p5.js 깃허브 저장소를 방문할 때 풀 리퀘스트를 열 수 있는 버튼도 볼 수 있습니다. 이 버튼을 클릭하면 새 풀 리퀘스트를 열 수도 있습니다.

![Cropped screenshot of the main page of the p5.js GitHub repository web page. A section near the top of the page is a yellow call to action box containing a green button with the text "Compare & pull request".](../images/recent-pushes.png)


### 풀 리퀘스트 정보

![Screenshot of an "Open a pull request" page on GitHub that is prepopulated with p5.js's pull request template.](../images/new-pr.png)

풀 리퀘스트를 제출하기 전에, 풀 리퀘스트 템플릿을 작성해야 합니다.


### 제목

풀 리퀘스트 제목은 변경사항을 간략하게 설명해야 합니다. 여기서 일반적인 문구는 지양해야 합니다.


### 해결

템블릿에는 `Resolves #[Add issue number here]`라는 문구가 있는데, 여기서 `[Add issue number here]` 부분을 여러분이 수정하려는 [above](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#all-about-issues) (e.g., `Resolves #1234`) 이슈 번호로 변경해야 합니다. 이렇게 하면 이 풀 리퀘스트가 병합된 후 자동으로 이슈가 닫히게 됩니다. 만약 이 풀 리퀘스트가 병합된 후 자동으로 이슈를 닫고 싶지 않다면(아마도 별도의 풀 리퀘스트에서 더 많은 변경사항으로 올 것이기 때문에), `Resolves` 를 `Addresses`로 변경하세요.



### 변경 사항

이 풀 리퀘스트에서 진행한 변경사항을 명확하게 설명해야 합니다. 여기에 구현 세부 사항과 관련된 결정 사항을 검토(review)할 사람을 추가하세요.


### 변경 사항에 대한 스크린샷

이것은 상황에 따라 선택적이며, p5.js가 캔버스에 시각적 요소를 렌더링하는 방식과 관련된 변경을 할 때 포함해야 합니다. 이것은 텍스트 편집기의 스크린샷이 아니라 변경 후 예제 스케치의 동작을 보여주는 스크린샷임을 유의해주세요.


### 풀 리퀘스트 체크리스트

변경사항과 관련된 중요한 체크리스트 항목이 몇 가지 있으며, 해당하는 경우 `[ ]`를 `[x]`로 변경해주세요.


완료되면, "Create pull request."을 클릭하세요.


### 리베이스 및 충돌 해결

![Screenshot of an open pull request on p5.js's GitHub repository. The title of the pull request says "Fix filter shaders when rectMode is applied; add tests #6603.](../images/opened-pr.png)

이제 오픈된 풀 리퀘스트를 검토하고 다음 몇 가지 사항들을 주의해주세요:

1. 커밋 수는 작업한 커밋 수와 일치해야 합니다. 즉, 풀 리퀘스트에서 두 번 커밋했다면 "Commits" 탭에는 단 두 개의 커밋만 표시되어야 합니다.
2. "Files changed" 탭은 p5.js 저장소와 비교하여 여러분이 진행한 변경사항만을 보여주어야 합니다.
3. 하단 부근에 "This branch has no conflicts with the base branch,"라고 표시되어야 하며, "This branch has conflicts that must be resolved."라고 표시되어서는 안 됩니다.

위의 어느 것도 사실이 아니라면(예상했던 것보다 많은 커밋이 있거나 충돌이 있는 경우), [rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)를 진행하거나 충돌을 해결해야 할 수도 있습니다. 여기서 충돌이란, 최근에 변경사항이 적용된 파일에 대해 변경을 진행하였으나, 깃(git)에서 어떤 변경사항 묶음을 유지할지, 제외할지 확정하지 못한 상태를 의미합니다. 이러한 문제를 해결하는 데 어려움이 있다면, 저희에게 알려주시면 과정을 안내해 드리겠습니다. 기본 지침은 다음과 같습니다.

가끔 깃허브는 'Resolve Conflicts' 버튼을 보여주면서 브라우저에서 직접 충돌을 해결할 수 있도록 합니다:![A screenshot of a GitHub pull request with merge conflicts. The conflicting filenames are listed, and there is a "Resolve conflicts" button highlighted.](../images/resolve-conflicts.png)

충돌 사항은 `<<<<<<<` 와 `>>>>>>>` 사이에 표시되며, `=======`으로 구분됩니다. 한 부분은 여러분의 코드를 보여주고, 다른 한 쪽 부분에는 메인 브랜치에서 변경된 사항을 보여줍니다.

![A screenshot of GitHub's conflict resolution interface. A sidebar lists the files with conflicts. The right pane contains the conflicting code, with merge conflict markers highlighted.](../images/conflicts-interface.png)

충돌 표시를 제거하고, 풀 리퀘스트에 포함될 최종 코드만 남겨둡니다. 모든 충돌이 해결되었을 때 "Mark as resolved"를 클릭할 수 있습니다.

![A screenshot of the GitHub conflict resolution interface after editing the code to remove the merge conflict markers. The "mark as resolved" button in the upper right is enabled.](../images/mark-as-resolved.png)

충돌 사항이 있는 모든 파일이 해결되면 변경 사항을 커밋할 수 있습니다.

![The GitHub conflict resolution interface after all conflicts have been marked as resolved. A green "commit merge" button is enabled.](../images/commit-merge.png)

가끔 깃허브의 웹 인터페이스에서 충돌을 표시하기에는 너무 복잡한 경우가 있습니다. 이런 경우, 만약 수동 방식을 선호한다면, 로컬에서 충돌을 해결할 수 있습니다:

1. 다음 명령어를 실행하세요. `git remote add upstream https://github.com/processing/p5.js`
2. 다음 명령어를 실행하세요. `git fetch upstream`
3. 다음 명령어를 실행하세요. `git rebase upstream/main`
4. 충돌이 발생했을 수 있습니다! 만약 그 충돌이 lib/p5.js와 lib/p5.min.js 파일에서만 발생했다면, 해결하기 쉽습니다; 프로젝트를 다시 빌드하기만 하면 됩니다. 만약 다른 파일에서 충돌이 발생했고 해결 방법을 확실히 모르겠다면, 도움을 요청하세요!

```
npm test
git add -u
git rebase --continue
```

5. 다음 명령어를 실행하세요. `git push`

위의 체크 리스트는 이러한 단계들을 거친 후에 해결될 수 있지만, 만약 그렇지 않다면 필요한 모든 수정을 안내해 드리겠습니다.


## 논의 및 고치기(amend)

풀 리퀘스트가 열리면 스튜어드나 관리자가 여러분의 풀 리퀘스트를 검토할 것 입니다. 스튜어드가 여러분의 풀 리퀘스트에 답변할 수 있기까지 며칠이 걸릴 수 있으니, 조금만 기다려주세요. 그동안 오픈된 다른 이슈들을 확인해 보는 것은 어떨까요?

스튜어드가 풀 리퀘스트를 검토한 후에는 다음 두 가지 중 하나가 발생할 수 있습니다: 1. 풀 리퀘스트가 승인되어 병합됩니다, 축하합니다! 2. 스튜어드가 풀 리퀘스트에 대해 몇 가지 질문을 하거나 일부 변경 사항을 요청할 수 있습니다. 후자의 경우라도 당황하지 마세요; 이것은 완전히 정상적인 과정이며, 스튜어드는 항상 여러분이 기여를 완성할 수 있도록 돕기 위해 있습니다!

여러분의 풀 리퀘스트의 변경사항이 요청되었고 해당 변경을 진행할 수 있는 경우, [이전과 같은 과정](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#git-workflow)를 따르되, 로컬 저장소의 복사본 및 관련 브랜치에서 계속해서 해당 변경을 진행하고, 그 변경사항을 깃허브에 커밋한 다음, 포크된 원격 저장소로 푸시하세요. 포크된 원격 저장소에 추가 커밋을 푸시하면, 새 커밋이 풀 리퀘스트에 자동으로 표시됩니다. 검토자에게 요청된 변경사항을 진행했다는 것을 알리기 위해 풀 리퀘스트에 댓글을 남기세요. 추가적인 수정이 필요하지 않다면, 여러분의 PR은 병합(merge)될 것입니다!

[**⬆ 위로 올라가기**](#contributor-guidelines)

