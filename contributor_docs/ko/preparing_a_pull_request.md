# 풀 리퀘스트 준비하기

풀 리퀘스트는 코드가 최신 일 때 더 쉽습니다! git rebase를 사용하면 다른 기여자의 변경 사항을 통합하고 코드를 업데이트할 수 있습니다. 방법은 다음과 같습니다.

## 저장하고 업데이트하기

### 작업한 내용 모두 저장해주세요!
    git status 
    git add -u
    git commit 

### 변경사항을 확인해주세요
upstream p5.js 저장소를 트래킹하고 있는지 확인해주세요.

    git remote show upstream

에러를 보게 되면, 메인 p5.js 저장소를 "upstream" 원격 저장소로 트래킹해야 합니다. 이 작업은 한 번만 하면 됩니다! 하지만, 두 번 실행해도 아무 문제 없습니다.

    git remote add upstream https://github.com/processing/p5.js

그런 다음 git에서 최신 변경 사항을 확인해 봅니다.

    git fetch upstream 

### 만일의 경우를 대비해, 변경사항을 새 브랜치로 복사하세요.
    git branch your-branch-name-backup 

### master 브랜치로부터의 변경사항을 *적용한 후* 여러분이 작업한 변경 사항을 추가하세요
    git rebase upstream/master 

### 충돌 해결하기
충돌이 있을 수 있습니다!
lib/p5.js와 lib/p5.min.js라면 쉽게 고칠 수 있습니다. grunt로 프로젝트를 재빌드합니다.

    grunt 
    git add -u
    git rebase --continue

다른 파일과 충돌이 있고, 어떻게 해결해야 하는지 모른다면... 도움을 요청해 주세요!

### 마침내
    git push origin

기술적으로 세부사항에 대해 궁금한 점이 있을 경우, 여기 리베이싱에 대한 좋은 레퍼런스가 있습니다. https://www.atlassian.com/git/tutorials/merging-vs-rebasing

## 풀리퀘스트 생성하기

여기 [github에서 풀 리퀘스트를 생성하는 것에 대한 안내서](https://help.github.com/articles/creating-a-pull-request/)가 있습니다. 원하는 이름으로 브랜치명을 지정할 수 있습니다. p5.js의 "master" 브랜치를 대상으로 풀 리퀘스트를 요청합니다.

풀 리퀘스트를 제출하면, 다른 분들이 가능할 때 즉시 검토되고, 머지 될 것입니다. 변경사항은 p5.js 라이브러리의 다음 릴리와 함께 나갈 것입니다.
