# 기여자 가이드라인

기여자 가이드라인에 오신 것을 환영합니다! 이 문서는 p5.js에 코드를 기여하고자 하는 신규 기여자, 몇 가지 기술적 단계를 다시 기억하고자 하는 기여자 또는 p5.js 코드 기여와 관련된 모든 사람을 위한 문서입니다.

p5.js 리포지토리(repository) 외부에서 기여하려는 경우(튜토리얼 작성, 수업 계획, 이벤트 조직 등), 관련된 다른 페이지를 살펴보세요. 스튜어드 또는 유지 관리자(maintainers)는 이슈 및 풀 리퀘스트를 검토하는 데 더 유용한 [스튜어드 가이드라인](https://github.com/processing/p5.js/blob/main/contributor_docs/steward_guidelines.md)을 찾을 수 있습니다.

이 문서는 비교적 긴 종합적인 문서이지만, 가능한 모든 단계와 항목을 명확하게 지시하도록 할 것입니다. 목차를 활용하여 자신에게 관련된 섹션을 찾아보세요. 계획된 기여와 관련이 없는 경우 섹션을 건너 뛰어도 괜찮습니다.

**새로운 기여자인 경우 첫 번째 섹션 "이슈(Issue)에 대해 모두 알아보기"로 시작하는 것이 좋습니다. 개발 프로세스의 단계별 설정만 필요한 경우 "개발자를 위한 빠른 시작" 섹션을 참조하세요.**


# 목차

- [이슈(Issue)에 대해 모두 알아보기](#all-about-issues)
  - [이슈(Issue)란 무엇인가요?](#what-are-issues)
  - [이슈 템플릿(Issue Templates)](#issue-templates)
    - [버그 발견](#found-a-bug)
    - [기존 기능 향상](#existing-feature-enhancement)
    - [새로운 기능 요청](#new-feature-request)
    - [토론(Discussion)](#discussion)
- [p5.js 코드베이스 작업](#working-on-the-p5js-codebase)
  - [개발자를 위한 빠른 시작](#quick-get-started-for-developers)
  - [Github 편집 기능 사용하기](#using-the-github-edit-functionality)
  - [p5.js를 포크하고 포크에서 작업하기](#forking-p5js-and-working-from-your-fork)
    - [Github Desktop 사용하기](#using-github-desktop)
    - [git 명령줄(command line) 인터페이스 사용하기](#using-the-git-command-line-interface)
  - [코드베이스(code base) 분석](#codebase-breakdown)
  - [빌드 설정](#build-setup)
  - [Git 워크플로우](#git-workflow)
    - [소스 코드](#source-code)
    - [단위 테스트](#unit-tests)
    - [인라인 문서화](#inline-documentation)
    - [국제화](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#internationalization)
    - [접근성](#accessibility)
  - [코드 표준](#code-standard)
  - [소프트웨어 디자인 원칙](#software-design-principles)
- [풀 리퀘스트](#pull-requests)
  - [풀 리퀘스트 생성](#creating-a-pull-request)
    - [풀 리퀘스트 정보](#pull-request-information)
    - [제목](#title)
    - [해결](#resolves)
    - [변경 사항](#changes)
    - [변경 사항의 스크린샷](#screenshots-of-the-change)
    - [풀 리퀘스트 체크리스트](#pr-checklist)
    - [리베이스 및 충돌 해결](#rebase-and-resolve-conflicts)
  - [리베이스 및 충돌 해결](#discuss-and-amend)

---


# 이슈에 대해 모두 알아보기 

p5.js의 GitHub 리포지토리(줄여서, repo)에서 활동의 대부분이 이슈에서 발생하며, 이는 여러분이 기여를 시작하는 여정을 하기 좋은 장소입니다.


## 이슈란 무엇인가?

![A cropped screenshot of the p5.js library GitHub repository, only showing contents of the top right corner. A red box is drawn on top of the screenshot surrounding the Issues tab.](images/issues-tab.png)

"이슈"는  깃허브 포스트(post)를 일컫는 보편적인 용어이며, 이슈에 대해 잘 설명하기 위한 것입니다. 이슈는 버그 리포트,  새로운 기능 추가요청, 의견, 등 p5.js 라이브러리 개발과 관련된 모든 것이 될 수 있습니다.  봇을 포함한 깃허브 계정을 가진 모든 사람이 각 이슈에 코멘트(주석)를 달 수 있습니다! 이슈는 기여자들은 리포지토리 내 프로젝트 주제에 대한 상의할 수 있는 공간입니다. 

다양한 이유로 이슈가 오픈될 수 있지만 우리는 보통 p5.js 소스 코드에 대한 개발에 대한 논의를 위해 이슈를 사용합니다. 당신의 코드 디버그, 프로젝트 협업자 초대 그리고 관련없는 주제는 [포럼 (forum)](https://discourse.processing.com/) 이나 [디스코드 (Discord)](https://discord.gg/SHQ8dH25r9) 같은 플랫폼에서 상의되어야합니다. 

 깃허브 이슈인지 다른 곳에 포스트 되어야 하는지 결정할 수 있도록, 우리는 쉽게 사용할 수 있는 이슈 템플릿을 만들었습니다!

## 이슈 템플릿

p5.js의 이슈 템플릿은 스튜어드와 유지 관리자가 이슈를 이해하고 검토하기 쉽게 만들어줍니다. 또한 해당 이슈를 쉽게 제출하고 더 빠르게 답변을 받을 수 있도록 도와줍니다.

![Screenshot of an example of what an issue looks like on GitHub. The title of the issue in the screenshot is "Warning being logged in Safari when using a filter shader in 2D mode #6597"](images/github-issue.png)

새로운 이슈를 제기하려면  p5.js 저장소의 "Issues" 탭으로 이동하고 오른쪽에 있는 "New issue" 버튼을 클릭하기만 하면 됩니다. 여러 가지 옵션이 제시되며 각각은 관련된 이슈 템플릿에 해당하거나 질문을 제출할 적절한 위치로 리디렉션됩니다.  이슈가 제대로 된 관심을 받을 수 있도록 가장 연관성있는 옵션을 선택하는 것을 권장합니다.

![Cropped screenshot of the GitHub repository's issue page with the green "New issue" button highlighted with a red box surrounding it.](images/new-issue.png)

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
5. *이것을 재현하는 단계* - 이것은 공유해야 할 가장 중요한 정보입니다. 여러분이 보고 있는 버그를 복제하기 위한 세부 단계를 나열해야 합니다. 문제를 보여주는 기본적인 예제 코드를 공유하는 것은 어떤 사람이 당신이 겪고 있는 버그를 복제하고 해결책을 만들기 시작하는 데 큰 도움이 될 수 있습니다.

**복제가 핵심입니다!** 이 템플릿의 많은 필드는 버그를 복제하는 것을 목표로 합니다. 여러분의 스케치 환경과 다른 사람이 당신이 보고하는 것을 복제할 수 있는 방법에 대한 많은 정보를 제공할수록 당신의 문제를 이해하고 해결책을 찾기 쉬워집니다.

**가능한 한 자세히 설명하고 추상적인 문장을 피하세요.**, 예를 들어 "image() function이 작동하지 않습니다”이라고 하지 말고 "image() function이 로드된 GIF 이미지를 올바른 크기로 표시하지 않습니다” 과 같이 더 구체적으로 설명하세요. 당신이 마주치고 있는 버그를 설명하는 유용한 방법은 다음 두 가지를 설명하는 것입니다.

1. 당신이 공유한 샘플 코드가 무엇을 기대하는지 (예상되는 동작).
2. 샘플 코드가 실제로 무엇을 하는지 (실제 동작).


여러분이 방금 보고한 버그를 수정하고 싶다면, 설명란에 그렇게 표시할 수 있습니다. 그 후 방금 설명한 버그를 어떻게 수정할 것인지 간단한 제안을 제공할 수 있습니다. 이렇게 하면 얼마나 많은 지원이 필요한지를 알 수 있습니다.

**이슈가 승인되지 않거나 이슈에 대한 승인이 이루어지기 전에 해당 이슈와 관련된 풀 리퀘스트를 제출하거나 코드 변경 작업을 시작해서는 안됩니다**; 제안된 수정이 수락되지 않을 수 있습니다. 완전히 다른 접근 방식이 필요할 수 있거나 실제 문제가 다른 곳에 있을 수 있기 때문입니다. 이슈가 수정될 것으로 승인되기 전에 제출된 모든 풀 리퀘스트는 이슈에 대한 승인이 주어질 때까지 닫힙니다(closed).

수정을 위해 승인된 이슈에는 적어도 한 명의 [영역 스튜어드 또는 유지 관리자](https://github.com/processing/p5.js#stewards)의 승인을 받아야 풀 리퀘스트를 위한 작업을 시작할 수 있습니다.


### ["기존 기능 향상"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Enhancement\&projects=\&template=existing-feature-enhancement.yml)

이 템플릿은 p5.js의 기존 기능(함수, 상수, 렌더링 등)에 대한 변경 사항 제안, 또는 새로운 기능 추가를 위해 사용합니다. 예를 들어, `color()` 함수 및 색상을 받아들이는 다른 함수에 새로운 색상 정의 방법을 추가하는 경우에는 이 템플릿을 사용해야 합니다.

이 템플릿에는 몇 가지 필드를 입력해야 합니다.

1. *접근성향상* -이 필수 필드는 제안된 기능 향상을 통해 p5.js가 창작 예술이나 기술 분야에서 역사적으로 소외된 사람들에게 [접근성 향상] (https://github.com/processing/p5.js/blob/main/contributor_docs/access.md)시킬 방법에 대한 설명을 넣는 곳입니다. **이것없이는 어떤 제안도 수락되지 않습니다.**,  "확실하지 않음"을 기입하고 다른 구성원들이 p5.js의 접근성을 어떻게 다루는지 생각할 수 있다면 이 주장을 제공할 수 있도록 제안할 수 있지만, 이것이 없으면 제안은 수락되지 않습니다.
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

**"대기열을 지켜주세요."**  다른 사람이 기여를 제출할 의향을 표시하거나 이미 다른 사람에게 할당되어 있는 이슈에 대해 풀 리퀘스트을 제출하여 대기열을 넘어서는 안됩니다. 우리는 항상 "선착순" 으로 코드 기여를 받아들이는 것을 우선시할 것입니다.

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

![Cropped screenshot of a file view in GitHub of the p5.js repository, "src/color/color\_conversion.js" file. A red arrow pointing to a pencil icon button on the right side of the image.](images/edit-file.png)

그러나 매우 단순한 변경 외에는 이 기능을 사용하는 것이 권장되지 않습니다. 이에 대한 주요 이유 중 하나는 소스 코드의 보다 복잡한 변경을 위해 풀 리퀘스트로 제출되기 전에 로컬에서 구축하고 테스트해야 하기 때문입니다. 로컬 개발 환경을 사용하는 것이 이 편집 기능에서 제공하는 기본적인 편집 환경보다 훨씬 유연하게 할 수 있는 경우가 많기 때문입니다.


## p5.js를 포크하고 자신의 포크(fork)에서 작업하기

p5.js 소스 코드를 작업하기 위한 첫 번째 단계는 p5.js 리포지토리(repository)를 포크하는 것입니다. 포크(fork)는 오픈 소스에서 특정한 의미를 가지고 있지만, 여기서는 리포지토리의 사본을 생성하여 자신의 GitHub 계정에 저장하는 것을 의미합니다. 리포지토리를 포크하려면 페이지 상단 근처에 있는 "포크(fork)" 버튼을 클릭하기만 하면 GitHub가 계정에 리포지토리의 복사본을 만듭니다.

![Screenshot of the main page of repository. A button, labeled with a fork icon and "Fork 59.3k," is outlined in dark orange.](fork.png)

p5.js 리포지토리에 대한 직접 쓰기 액세스 권한이 없을 가능성이 높기 때문에 p5.js  리포지토리의 포크에서 작업해야 하며, 포크에서 작업하면 변경한 후 나중에 공식 리포지토리에 다시 제출할 수 있습니다.


### GitHub Desktop 사용

GitHub Desktop은 명령어를 터미널에 입력하는 대신에 그래픽 사용자 인터페이스를 통해 git을 사용할 수 있는 프로그램입니다. git에 익숙하지 않은 경우 좋은 옵션이며, 필요할 때마다 GitHub Desktop과 terminal 사이를 자유롭게 전환할 수 있습니다.

먼저, [GitHub Desktop을 다운로드하고 설치](https://desktop.github.com/)합니다. 설치가 완료되면 응용 프로그램을 엽니다. GitHub 계정으로 로그인하라는 메시지가 나타납니다. 로그인한 후에는 포크한 p5.js 프로젝트를 포함하여 프로젝트 목록이 표시됩니다. 자신의 포크인 `yourUsername/p5.js`를 선택하고 파란색 "Clone" 버튼을 클릭합니다. 프로젝트를 저장할 위치에 대한 몇 가지 세부 정보를 요청할 것입니다. 이를 변경하거나 기본 설정을 유지한 채로 계속할 수 있습니다.

![The GitHub Desktop user interface after signing in. On the right half of the screen, it lists your projects, and a Clone button in the bottom right.](images/github-desktop-init.png)

복제가 되면 포크를 어떻게 사용할지에 대해 물어볼 것입니다. 상위 프로젝트에 기여할 옵션을 선택하고 "계속(Continue)"을 클릭합니다.

![The view after cloning a fork. It asks if you are planning to contribute to the parent project, or use it for your own purposes.](images/github-desktop-fork.png)


### Using the `git` command line interface

Once the fork is created, navigate to your fork's page and copy the git URL by clicking the green "Code" button. It should look something like `https://github.com/limzykenneth/p5.js.git`.

![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](images/code-button.png)

Next go to the command line in your local environment and clone this git repository. "Clone" simply means download a copy of the repo to your local machine. Run the following command in a folder where you want to store the p5.js source code folder.

```
git clone [git_url]
```

Replace `[git_url]` with the URL you just copied above. This can take several minutes, depending on the speed of your internet connection, a good time to make some coffee! Once the process is finished, you can open up the downloaded folder named `p5.js` in your preferred text editor and start looking around.


## Codebase breakdown

Some of the key files and folders you will be in the p5.js folder are as follows:

- `src` - Where all the code that eventually gets combined into the final p5.js and p5.min.js files lives
- [`test`](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md) - Where unit tests and code for testing all documentation examples lives
- `tasks` - Where detailed and custom build code lives
- `Gruntfile.js` - This is the main build configuration file
- `contributor_docs` - Where the documentation and all other contributor documentation lives

The other files and folders are either configurations or other kinds of support files; in most cases, you shouldn't need to make any modifications.


## Build setup

Before you do anything, you'll need to set up the local project folder so that you can build and run tests for p5.js. Assuming you have node.js installed, run:

```
npm ci
```

This will likely take a while, as npm downloads all dependencies required. However, once done, that's it, you are all set up. Pretty simple, right?


## Git workflow

Now, you are ready to make the changes you need to make; for more details about the different parts of the repository and how you can make relevant changes, see the subsections below. To start, run:

```
npm test
```

To try building p5.js from scratch and run all unit tests, this should complete with no errors. If you just want to build the library without running the tests, you can run:

```
npm run build
```

Either of the commands above will build the library into the `lib/` folder as `p5.js` and `p5.min.js`. You can use these built files for your own tests if necessary.

Next, we recommend that you make a branch off the `main` branch before starting your work. A branch in git is as the name implies, a branched version of the repo that you can add commits to without affecting the `main` or other branches. Branches enable you to work on multiple features at once (by using multiple isolated branches) and have confidence that if you mess up a branch it won't affect the `main` branch.

In GitHub Desktop, this can be done by clicking the Current Branch button in the header of the window. From here, you can change branches, or enter a branch name to make a new one. For our purposes, enter a new branch name describing the change you will make, and click Create New Branch.

![A screenshot of the GitHub Desktop branch selection menu. After entering a new branch name that does not yet exist, a "Create New Branch" button appears.](images/github-desktop-create-branch.png)

From the terminal, run `git checkout -b branch_name` while you are on the `main` branch, replacing `branch_name` with something descriptive, and you will be on a separate branch now. 

As you make your changes, we recommend running `npm test` frequently, especially if you are working on the source code. Running this will take some time, but it ensures that the changes you make are not breaking existing behaviors. You should run `npm test` before moving on to committing the changes as described below.

Once you have made your changes to the codebase, you will need to commit it to git. A commit is a collection of changes saved in the git repository; it essentially records the current state of the files in the repo at the time of commit. 

A question that may arise is how often should you commit to git? In general it is preferred that you aim to commit often rather than lump multiple big changes into one commit. A good guideline is to commit whenever you have completed a subtask that can be described in a sentence.

To commit all current changes from GitHub Desktop, open the app after making your changes. It will show a list of the files you have changed in the left sidebar, and the specific changes within each file on the right. Type a brief, high-level description in the field next to your user icon in the bottom left corner of the window. This will be the title of the commit. You may elaborate further in the description field below or just leave it blank. Click the blue "Commit" button to finalize the change.

![A screenshot of GitHub Desktop after having made a change. The area where you need to write a title for your change is circled in red in the lower left of the window.](images/github-desktop-commit.png)

To commit all current changes from the terminal, run the following:

1. Check that it only lists files you have changed with the following command. 

```
git status
```

If there are files listed that you have not changed, you will need to either [restore](https://git-scm.com/docs/git-restore) them to the original or make sure they are intended changes. To show more detailed changes for each file use the following command. 

```
git diff
```

You should not commit any file changes that you don't intend to change for your PR.

2. Stage all changes for committing into git with the following command.

```
git add .
```

3. To commit the changes into git, run the following command.

```
git commit -m "[your_commit_message]"
```

`[your_commit_message]` should be replaced with a relevant commit message that is descriptive of the changes, avoiding generic statements. For example, instead of saying `Documentation fix 1`, say `Add documentation example to circle() function`.

```
git commit -m "Add documentation example to circle() function"
```

Repeat the above steps for all commits you will be making while making sure to run `npm test` periodically to make sure things are working.


### Source code

If you are going to work on the source code, a good place to start, if you know which of p5.js features you are going to work on, is to visit the documentation and at the bottom of each documented functionality of p5.js will be a link to its source code.

![Cropped screenshot of a reference page on the p5.js website containing the sentence "Notice any errors or typos? Please let us know. Please feel free to edit src/core/shape/2d\_primitives.js and issue a pull request!". Part of the above sentence where it says "src/core/shape/2d\_primitives.js" is highlighted with a red underline and arrow pointing to it.](images/reference-code-link.png)


### Unit tests

If you are going to work on unit tests, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md). Note that for any feature enhancement, new features, and certain bug fix, unit tests covering the new implementations should be included in the PR.


### Inline documentation

If you are going to work on the inline documentation, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/inline_documentation.md).


### Accessibility

If you are going to work on accessibility features, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/web_accessibility.md). For a Friendly Error System, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md).


## Code standard

p5.js' code standard or code style is enforced by [ESLlint](https://eslint.org/). Any git commit and pull request must pass linting before it will be accepted. The easiest way for you to follow the right coding standard is to use the ESLint plugin available for your text editor with linting error highlighting (available for most popular text editors).


## Software Design principles

While working on any features of p5.js, it is important to keep in mind the design principles of p5.js. Our priorities may differ from the priorities of other projects, so if you are coming from a different project, we recommend that you familiarize yourself with p5.js' design principles.

- **Access** We prioritize accessibility first and foremost, and decisions we make must take into account how it increases access to historically marginalized groups. Read more about this in our access statement.
- **Beginner Friendly** The p5.js API aims to be friendly to beginner coders, offering a low barrier to creating interactive and visual web content with cutting-edge HTML5/Canvas/DOM APIs.
- **Educational** p5.js is focused on an API and curriculum that supports educational use, including a complete reference to the API with supporting examples, as well as tutorials and sample class curricula that introduce core creative coding principles in a clear and engaging order.
- **JavaScript and its community** p5.js aims to make web development practices more accessible to beginners by modeling proper JavaScript design patterns and usage while abstracting them where necessary. As an open-source library, p5.js also includes the wider JavaScript community in its creation, documentation, and dissemination.
- **Processing and its community** p5.js is inspired by the Processing language and its community and aims to make the transition from Processing Java to JavaScript easy and clear.

[**⬆ back to top**](#contributor-guidelines)

---


# Pull requests

Now that you have made the changes you need to make, including unit tests if applicable, `npm test` does not error, and you have committed the changes, you can start preparing pull requests to get your new commits merged into the official p5.js repository. A pull request, more formally, is a request to a repo (in this case, the official p5.js repo) to pull or merge changes from another repo (in this case, your forked p5.js repo) into its commit history.


## Creating a pull request

The first step here is to push your new commits to your fork of p5.js; think of it as uploading the changes to your fork.

From GitHub Desktop, just to the right of the button to change branches in the header is a button to push your changes to GitHub. Click this to push your changes.![A view of GitHub Desktop after committing changes. The button to push the changes online is circled in red.](images/publish-branch.png)

Once your code is uploaded, it will show a button prompting you to create a pull request. Clicking the button once will show a preview with another button to actually create the request. Press the "Create Pull Request" button to begin the process.

![A screenshot of Github Desktop after pushing code. In the left sidebar, it says "0 changed items." In the right pane, below the "No local changes" header, a blue "Review Pull Request" button has been marked up with a red circle.](images/preview-pull-request.png)

From the terminal, run the following command:

```
git push -u origin [branch_name]
```

Once the push is complete, you may see a link in the terminal that lets you open a pull request, if not you can navigate to your fork in your web browser, switch to the branch you are working on with the dropdown button on top of the file list, click on "Contribute" then "Open pull request."

![](https://lh7-us.googleusercontent.com/xoqM9gLSFXyw7b3gzG8JlHqoO0zxHALbjSz93E3D0HNh4Jw2wDWdzHKUEchnB6hdjQC7hVn-o5prrXkLw2WiEOoVKJF6kpmyA65sirN0z-Vy3PBY3rCXC5Ifn5stQhcdUQxQS0rsVoW0_hlkfTcY8PQ)

You may also see a button to open a pull request when you visit the p5.js Github repo. Clicking it will also work to open a new pull request.

![Cropped screenshot of the main page of the p5.js GitHub repository web page. A section near the top of the page is a yellow call to action box containing a green button with the text "Compare & pull request".](images/recent-pushes)


### Pull request information

![Screenshot of an "Open a pull request" page on GitHub that is prepopulated with p5.js's pull request template.](images/new-pr.png)

Before filing the pull request, you will need to fill out the pull request template. 


### Title

The pull request title should briefly describe what the changes are, again avoid generic statements here.


### Resolves

In the template, there is this line `Resolves #[Add issue number here]`, which you should replace `[Add issue number here]` with the issue number of the issue you are addressing/fixing [above](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#all-about-issues) (e.g., `Resolves #1234`). This will make sure the issue is automatically closed after this PR is merged. If you do not wish to automatically close the issue after this PR is merged (maybe because there are more changes coming in a separate PR), change `Resolves` to `Addresses`.


### Changes

You should clearly describe the changes you have made in this PR. Include any implementation details and decisions you made here that are relevant to whoever will review it.


### Screenshots of the change

This is optional depending on circumstances and should be included when making changes related to how p5.js renders visuals on the canvas. Note that this is not a screenshot of the text editor but a screenshot of an example sketch's behavior after your changes.


### PR Checklist

This contains some relevant checklist items that you should tick by replacing `[ ]` with `[x]` wherever relevant to your changes.

Once done, click on "Create pull request."


### Rebase and resolve conflicts

![Screenshot of an open pull request on p5.js's GitHub repository. The title of the pull request says "Fix filter shaders when rectMode is applied; add tests #6603.](images/opened-pr.png)

You should now inspect the opened pull request and pay attention to a few things:

1. The number of commits should match the number of commits you have made, meaning if you have committed two times while working on this PR, it should only show two commits in the "Commits" tab.
2. The "Files changed" tab should show the changes you have made as compared to the p5.js repo and nothing more.
3. Near the bottom, it should say, "This branch has no conflicts with the base branch," and not "This branch has conflicts that must be resolved."

If any of the above is not true (there are more commits than you expected or there are conflicts), you may need to [rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) or help resolve conflicts. Conflicts here mean that you have made changes to a file that also recently had changes applied to it, and git is not sure which set of changes to keep or leave out. If you are not confident in resolving these issues, let us know and we'll guide you through the process. Basic instruction is as below.

Sometimes, Github lets you resolve conflicts directly in the browser by showing you a Resolve Conflicts button:![A screenshot of a GitHub pull request with merge conflicts. The conflicting filenames are listed, and there is a "Resolve conflicts" button highlighted.](images/resolve-conflicts.png)

Conflicts are shown between `<<<<<<<` and `>>>>>>>`, separated by `=======`. One section shows your code, and the other section shows what has changed in the main branch.

![A screenshot of GitHub's conflict resolution interface. A sidebar lists the files with conflicts. The right pane contains the conflicting code, with merge conflict markers highlighted.](images/conflicts-interface.png)

Remove the conflict markers and keep just the final code that you want in your PR. You can click "Mark as resolved" when all the conflicts have been addressed.

![A screenshot of the GitHub conflict resolution interface after editing the code to remove the merge conflict markers. The "mark as resolved" button in the upper right is enabled.](images/mark-as-resolved.png)

When all files with conflicts have been resolved, you can commit your changes.

![The GitHub conflict resolution interface after all conflicts have been marked as resolved. A green "commit merge" button is enabled.](images/commit-merge.png)

Sometimes, the conflicts are too complicated for Github to show on the web. In this case, or if you just prefer the manual method, you can resolve your conflicts locally:

1. Run `git remote add upstream https://github.com/processing/p5.js`
2. Run `git fetch upstream`
3. Run `git rebase upstream/main`
4. You may have some conflicts! If it’s just lib/p5.js and lib/p5.min.js, it’s easy to fix; just build the project again. If you have conflicts in other files & you're not sure how to resolve them, ask for help!

```
npm test
git add -u
git rebase --continue
```

5. Run `git push`

The checklist above may clear out after these steps but if not, we'll guide you through any fix necessary.


## Discuss and amend

Now that your PR is opened, a steward or maintainer will review your PR. It may take several days before a steward is able to reply to your PR, so be patient. Why not use the time to check out some of the other open issues in the meantime?

Once a steward has reviewed your PR, one of two things may happen: 1. Your PR is approved and merged, hurray! 2. The steward may ask some questions regarding the PR or request some changes to the PR. If it's the latter, don't panic; it's perfectly normal, and the stewards are always here to help you complete your contribution!

If changes are requested of your PR and you are able to make those changes, follow the [same process as before](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#git-workflow) but just continue from your local copy of the repo and relevant branch, make those changes, commit them into git, and push them to your forked remote repo. Once you have pushed additional commits to your forked remote repo, you will see that the new commits automatically show up in the PR. Leave a comment in the PR to let the reviewer know you have made the requested changes, and if no additional changes are needed, your PR will be merged!

[**⬆ back to top**](#contributor-guidelines)

