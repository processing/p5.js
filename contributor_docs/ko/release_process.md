# 배포 프로세스

## 접근법
* 우리는 `주:부:수` 버전 패턴을 따르는 유의적 버전 관리 패턴을 따릅니다.


## 요구사항
* Git, node.js, NPM이 여러분의 시스템에 설치되어 있어야 합니다.
* NPM CLI에 로그인 되어 있어야 합니다: `npm whoami`에 로그인되어 있는지 확인합니다.
* 높은 대역폭: 다운로드/풀/푸쉬 할것이 많습니다. (총 \~190MB 예상)

## 사용법
```shell
$ npm run release
```

* 빌드 단계가 실행되며 프로세스를 마치려면 `np`에서 제공하는 프롬프트를 따라야합니다.
* 그 다음 빌드 단계에서는 grunt 태스크를 실행해 라이브러리의 zip 버전을 생성하고, bower에서 릴리즈 하고, 웹사이트에 해당 레퍼런스를 릴리즈 합니다.


## 실제로 일어나는 일
* `npm run release`는 [`np`](https://www.npmjs.com/package/np)를 실행하여 먼저 하위 프로세스를 만들어내는 `grunt release-p5`의 별칭입니다.
* `np`는 로컬 저장소를 체크하고, 릴리즈를 생성하기 위해 설정을 준비하므로써 시작합니다. 
계속 진행하기 위해 로컬 저장소에 커밋이 안된 변경사항이 있으면 안됩니다.
* `np`는 `node_modules`를 재설치하고, `npm test`로 테스트를 실행합니다.
* `np`는 처음에 선택한 항목에 따라 버전을 범프합니다.
* 만약 이전 단계가 실패하면, 해당 저장소는 `npm run release`를 실행하기 전 초기 단계로 돌아갑니다.
* 업데이트된 버전 넘버로 문서와 라이브러리를 빌드하기 위해 `package.json`안에 `prepublishOnly`에 언급된 태스크가  실행(`grunt prerelease`) 됩니다.
* NPM 패키지가 게시됩니다.
	* NPM에 출시: `package.json`에 `files`에 언급된 파일들만 게시됩니다.
* 태그들과 로컬 커밋들을 git remote에 푸쉬됩니다.
* 초안 릴리즈는 수정할 수 있는 변경로그들과 함께 github.com에 생성됩니다.
* `lib` 폴더 안에(현재 빈 예제가 포함되어 있음) Zip 파일 `p5.zip`을 생성하며 위에서 생성한 GitHub Release 초안에 업로드 되어야 합니다.
	* 이 프로세스가 완료되면 `release/` 를 가리키는 창이 열리고 해당 창에는 Github Release의 일부로 업로드해야 하는 모든 파일을 포함하고 있습니다.
* 새로 빌드 된 라이브러리를 Bower용 [p5.js-release](https://github.com/processing/p5.js-release) 저장소에 푸시합니다.
* 새로 빌드 된 참조를 [p5.js-website](https://github.com/processing/p5.js-website)에 푸시합니다.

## 테스팅
저장소에 대한 푸시 액세스 권한이 있는 경우:
* `npm run release---preview`를 실행하여 릴리스 프로세스를 간단하게 실행 할 수 있습니다. 이 단계를 실행하더라도 git 추적 파일이 변경되지 않으며 리모트에 푸시되지 않습니다.

저장소에 대한 푸시 액세스 권한이 없는 경우:
* `package.json`의 `name` 필드를 네임스페이스 버전으로 편집해야합니다. 예를 들면, 평소처럼 `npm run release---preview`를 실행하기 전에 `@username/p5`을 입력하고 이러한 번경사항을 git에 커밋합니다. NPM에 패키지된 네임스페이스에 패키지를 게시하지 않도록 선택하라는 메시지가 표시되면, 온라인에는 아무 것도 게시되지 않습니다.
* `package.json`의 `name` 필드를 편집 한 경우 `npm run release`로 릴리스의 전체 테스트를 실행할 수 잇습니다. Bower 릴리스와 웹 사이트에 복제하고 푸시할 위치를 선택하려며, 다음과 같이 추가 인수를 지정 할 수 있습니다:
`npm run release -- --bowerReleaser=username`.

__참고:__  `np` (`6.2.0`)에는 현재 네임스페이스 패키지 이름으로 릴리스를 막는 [bug](https://github.com/sindresorhus/np/issues/508)가 존재하며, 이것을 테스트해야하는 경우 `5.2.1`로 되돌릴 수 있습니다. 그렇지 않으면 릴리즈 단계에서 실패합니다.