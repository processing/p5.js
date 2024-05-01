<!-- p5.js WebGL 모드에서 소스 코드 작업을 시작하는 방법. -->

# WebGL 기여 안내

여러분이 이 페이지를 읽고 있다면, 아마도 WebGL 모드에서의 작업에 도움을 주고 싶으신 것이겠죠? 여러분의 기여에 다시 한 번 감사의 말씀을 드립니다. 이 페이지에서는 WebGL 기여가 어떻게 구성되었는지를 설명하고, 변경사항을 만들기 위한 몇 가지 팁을 제공합니다.

## 참고 자료

- p5.js의 WebGL 모드가 기반으로 하고 있는 WebGL 모드가 2D 모드와 어떻게 다른지 이해하려면 [p5.js WebGL 모드 아키텍쳐](webgl_mode_architecture.md)를 읽어보세요. 셰이더, 선 등에 대한 몇 가지 구현 세부 사항에 대한 가치 있는 자료가 됩니다.
- 문제 생성, 코드베이스(codebase, 원천 코드 모음) 설정, 변경 사항 테스트에 대한 정보가 필요하다면 [기여자 가이드라인](https://p5js.org/contributor-docs/#/./contributor_guidelines)을 읽어보세요.
- 브라우저의 WebGL API에 대해 조금 알아두면 도움이 될 수 있는데, 
  - [WebGL fundamentals](https://webglfundamentals.org/)에서 많은 핵심 렌더링 개념에 대해 검토할 수 있습니다.
  - [The Book of Shaders](https://thebookofshaders.com/)에 WebGL 셰이더에서 사용되는 많은 기술들이 설명되어 있습니다.

## 계획

[깃허브(GitHub) 프로젝트](https://github.com/orgs/processing/projects/5)에 게시된 이슈(issue)를 정리하고 다음과 같은 몇 가지 유형으로 나누었습니다.

- **시스템 차원 변경사항 (System-level changes)** 란 코드에 광범위한 영향을 미치는 장기적 목표입니다. 이것은 실행에 옮기기 전 수많은 논의와 계획을 필요로 합니다.
- **아직 해결책이 없는 버그 (Bugs with no solution yet)** 란 원인을 줄이기 위한 약간의 디버깅이 필요한 버그 신고입니다. 아직 해결될 준비가 되어 있지 않으며, 원인이 발견되면 이를 고치기 위한 최고의 해결책을 논의할 수 있게 됩니다.
- **해결책이 있지만 PR이 없는 버그 (Bugs with solutions but no PR)** 는 어떻게 해결할 지 결정되었으며 누구나 자유롭게 코드를 작성할 수 있습니다.
- **경미한 개선 (Minor enhancements)** 이란 현재의 아키텍쳐 내에서 확실한 위치를 가지는 새로운 기능에 대한 이슈이며, 어떻게 맞출 것인지에 대한 논의를 하지 않아도 됩니다. 일단 이러한 기능이 가치가 있다고 동의하면, 이를 위한 코드를 자유롭게 작성할 수 있습니다.
- **2D 기능 (2D features)** 이란 p5.js에는 있지만 WebGL 모드에는 없는 기능입니다. 이 기능은 2D 모드의 동작과 일치하는 결과물이 구현될 것으로 예상됩니다. 최적의 구현에 대해 논의할 필요가 있지만, 이에 대한 사용자 요구 사항은 명확합니다.
- **모든 환경에서 작동하지 않는 기능 (Features that don't work in all contexts )** 이란 WebGL 모드에 존재하지만 WebGL 모드를 사용할 수 있는 모든 방식으로 작동하지는 않는 기능입니다. 예를 들어, 일부 p5.js의 메소드는 2D 좌표계와 3D 좌표계에서 모두 작동하지만, 다른 메소드는 3D 좌표계에서 사용하면 중단될 수도 있습니다. 보통은 자유롭게 이 기능에 대한 작업을 시작할 수 있습니다.
- **기능 요청 (Feature requests)** 이란 다른 모든 코드 변경 요청을 말합니다. 이 요청이 WebGL 모드의 지침에 맞는 것인지 확인하기 위해서는 약간의 논의가 필요합니다.
- **문서화 (Documentation)** 이슈는 코드 변경이 필요하지 않지만, 대신 p5.js의 동작을 위해 더 잘 문서화하는 것이 필요한 이슈입니다.

## 코드를 어디에 넣어야 하나요?

WebGL과 관련된 모든 것은 `src/webgl` 하위 디렉토리에 있습니다. 해당 디렉토리 내에서, 최상위 p5.js 기능은 조명을 설정하는 명령어는 `lighting.js`로, 재질을 설정하는 명령어는 `materials.js`로 주제 영역에 따라 여러 파일로 나뉘었습니다.

사용자 지향 클래스를 구현할 때, 일반적으로 클래스당 한 파일로 만드려고 노력하고 있습니다. 이러한 파일들은 때때로 다른 몇 개의 내부 보조 기능(utility) 클래스를 가질 수 있습니다. 예를 들어, `p5.Framebuffer.js`는 `p5.Framebuffer` 클래스를 포함하고, 추가로 다른 메인 클래스의 몇 가지 프레임버퍼 관련 하위 클래스로 구성됩니다. 이 파일에는 추가적인 프레임버퍼 관련 하위 클래스도 들어갈 수 있습니다.

`p5.RendererGL`은 많은 동작을 처리하는 대형 클래스입니다. 이 때문에 하나의 대형 클래스 파일이 있는 것이 아닌, 어떤 주제 영역인지에 따라 여러 개의 파일로 나누었습니다. `p5.RendererGL`을 분할한 파일과, 각 파일에 무엇이 있는지는 다음과 같습니다.


#### `p5.RendererGL.js`

초기화 및 핵심 기능


#### `p5.RendererGL.Immediate.js`

**즉시 모드 (immediate mode)** 드로잉(`beginShape()`나 `endShape()`와 같은, 보관 및 재사용되지 않을 모양)과 관련된 기능 


#### `p5.RendererGL.Retained.js`

**보류 모드 (retained mode)** 드로잉(`sphere()`와 같은, 재사용을 위해 저장된 모양)과 관련된 기능

#### `material.js`

혼합 모드 관리

#### `3d_primitives.js`

`triangle()`과 같이 도형을 그리는 사용자 지향 함수. 이 함수들은 도형의 기하학적 구조를 정의합니다. 그런 다음 도형의 렌더링은 `p5.RendererGL.Retained.js` 또는 `p5.RendererGL.Immediate.js`에서 발생하며, 형상 입력을 일반 모양으로 취급합니다.

#### `Text.js`

글자 렌더링을 위한 기능 및 보조 기능 클래스


## WebGL 변경사항 테스트

### 일관성 테스트

p5.js의 함수를 사용할 수 있는 방법은 여러 가지가 있습니다. 모든 것을 수동으로 확인하는 것은 어려우므로, 가능한 곳에 단위 테스트(unit test)를 추가합니다. 그래야 새로운 변경점이 생겨도 단위 테스트를 통과한다면 아무 문제가 발생되지 않았다고 더 확신할 수 있기 때문입니다.

새 테스트를 추가할 때, 기능이 2D 모드에서도 작동하는 경우 일관성을 확인하는 최고의 방법 중 하나는 픽셀 결과물이 두 모드에서 동일한지를 확인하는 것입니다. 다음은 단위 테스트의 예시 중 하나입니다.


```js
test('coplanar strokes match 2D', function() {
  const getColors = function(mode) {
    myp5.createCanvas(20, 20, mode);
    myp5.pixelDensity(1);
    myp5.background(255);
    myp5.strokeCap(myp5.SQUARE);
    myp5.strokeJoin(myp5.MITER);
    if (mode === myp5.WEBGL) {
      myp5.translate(-myp5.width/2, -myp5.height/2);
    }
    myp5.stroke('black');
    myp5.strokeWeight(4);
    myp5.fill('red');
    myp5.rect(10, 10, 15, 15);
    myp5.fill('blue');
    myp5.rect(0, 0, 15, 15);
    myp5.loadPixels();
    return [...myp5.pixels];
  };
  assert.deepEqual(getColors(myp5.P2D), getColors(myp5.WEBGL));
});
```

2D 모드에서 안티앨리어싱(계단 현상 방지 기술, antialiasing)을 끌 수 없고, WebGL 모드에서 안티앨리어싱은 종종 약간 다르기 때문에 항상 이 코드가 작동하지는 않습니다. 하지만 x축 및 y축 상의 직선에 대해서는 작동합니다.

만약 어떤 기능이 WebGL 전용이라면 2D 모드와 픽셀 결과물을 비교하기보다는 몇 가지 픽셀을 확인해서 그 색상이 예상한 색상인지 확인하는 경우가 많습니다. 언젠가는 이를 몇 가지 픽셀이 아닌 예상 결과물의 전체 이미지 스냅샷을 비교하는 보다 강력한 시스템으로 전환할 수도 있겠지만, 현재로서는 픽셀 색상을 확인하는 예시가 있습니다.

```js
test('color interpolation', function() {
  const renderer = myp5.createCanvas(256, 256, myp5.WEBGL);
  // upper color: (200, 0, 0, 255);
  // lower color: (0, 0, 200, 255);
  // expected center color: (100, 0, 100, 255);
  myp5.beginShape();
  myp5.fill(200, 0, 0);
  myp5.vertex(-128, -128);
  myp5.fill(200, 0, 0);
  myp5.vertex(128, -128);
  myp5.fill(0, 0, 200);
  myp5.vertex(128, 128);
  myp5.fill(0, 0, 200);
  myp5.vertex(-128, 128);
  myp5.endShape(myp5.CLOSE);
  assert.equal(renderer._useVertexColor, true);
  assert.deepEqual(myp5.get(128, 128), [100, 0, 100, 255]);
});
```


### 성능 테스트

p5.js가 가장 걱정하는 부분은 아니지만, 변경점이 성능을 크게 저하하지 않도록 노력하고 있습니다. 보통 변경사항이 적용된 것과 변경사항이 적용되지 않은 것, 두 개의 테스트 스케치를 생성해서 이루어지고 있습니다. 그런 다음 두 프레임 속도를 비교합니다.

성능 측정에 대한 몇 가지 조언을 드리자면,

- 스케치 상단에서 `p5.disableFriendlyErrors = true`로 친절한 오류를 비활성화해 보세요. (또는 친절한 오류 메시지가 들어 있지 않은 `p5.min.js`를 테스트해보세요)
- 안정적인 프레임 속도를 명확하게 파악하기 위해 평균 프레임 속도를 표시해 보세요.

```js
let frameRateP;
let avgFrameRates = [];
let frameRateSum = 0;
const numSamples = 30;
function setup() {
  // ...
  frameRateP = createP();
  frameRateP.position(0, 0);
}
function draw() {
  // ...
  const rate = frameRate() / numSamples;
  avgFrameRates.push(rate);
  frameRateSum += rate;
  if (avgFrameRates.length > numSamples) {
    frameRateSum -= avgFrameRates.shift();
  }

  frameRateP.html(round(frameRateSum) + ' avg fps');
}
```

렌더링 파이프라인의 여러 부분에 스트레스를 주기 때문에 테스트를 해야 하는 다음과 같은 경우가 있습니다.

- 몇 가지의 매우 복잡한 모양 (예: 대용량의 3D 모델이나 긴 곡선)
- 많은 수의 단순한 모양 (예: for 반복문에서 여러 번 호출되는 `line()`)
