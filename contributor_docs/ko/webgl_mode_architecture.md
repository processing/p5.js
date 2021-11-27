# p5.js WEBGL 모드 아키텍쳐

이 문서는 p5.js 기여자, 메인테이너 및 기타 이해 관계자를 위한 p5.js의 WEBGL 모드의 구조를 설명합니다. 스케치에서 3D 그래픽을 사용하는 데 관심이 있다면 대신에 [튜토리얼 보기](https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5)를 참조해주세요.

## 구조 및 객체에 대한 개요

WEBGL 아키텍처의 핵심 객체는 p5.Renderer.GL, p5.Shader, p5.Texture 그리고 p5.Geometry입니다.
p5.Renderer.GL의 단일 인스턴스는 자체 p5.Shaders, p5.Textures, p5.Geometry를 관리하며 p5.Geometry—a 목표는 WebGL을 사용하여 오프스크린 렌더링을 허용하는 것이지만 아직 테스트되지 않았습니다.
쉐이더와 텍스쳐는 렌더러를 통한 특정 GL 컨텍스트와 관련이 있습니다.

### p5.RendererGL

p5.RendererGL 객체는 p5.js의 WEBGL/3D 모드 용 렌더러입니다.

p5.Renderer에서 파생되었으며 2D 모드에서 사용할 수 없는 추가 기능 (예를 들명: `box()`, `cone()`, 쉐이더의 사용, 가속 텍스처 렌더링 및 조명)에 대한 기능을 제공합니다.

* 쉐이더(p5.Shader 객체) 및 텍스처(p5.Texture 객체)를 관리, 생성, 캐쉬합니다.
* 쉐이더에서 속성 배열로 사용할 도형의 좌표를 준비합니다.
* 획, 채우기, 텍스쳐 및 다양한 조명 메서드가 호출 될 때 사용할 올바른 쉐이더를 선택한 다음 해당 쉐이더의 적절한 정형을 제공합니다.
* 조명에 대한 데이터 유지: 사용되는 다양한 유형의 조명과 해당 파라미터의 개수입니다.
* begin/endShape로 생성된 모양은 제외하고 (고정 모드 에서)3D 기본 지오메트리를 캐시하며, 모양은 그릴 때마다 동적으로 생성되어 (즉시모드에서) GL에 푸시됩니다.

렌더러는 현재 그리기 조건에 적합한 p5.Shader를 선택하는 것을 관리합니다.

### p5.Shader 
p5.Shader클래스는 GL 프로그램의 정형과 속성에 대한 액세스를 제공합니다.

* vertex 및 프래그먼트 쉐이더 컴포넌트를 컴파일하고 연결합니다.
* 쉐이더 속성 및 정형에 액세스하고 설정하기위한 API를 제공합니다.
* 쉐이더가 모양을 렌더링 하기 전에 필요한 텍스처를 바인딩합니다.
* 모양을 그리기 전에 렌더링에 사용할 bindShader() 메서드를 제공하고 모양을 그린 후에는 unbindShader() 메서드를 제공합니다.

쉐이더 섹션에서 설명 된 것처럼 4개의 기본 쉐이더가 있습니다.

### p5.Texture

p5.Texture 객체는 `p5.Image`,`p5.MediaElement`,`p5.Element` 또는 `ImageData`를 바탕으로 텍스처의 GL 상태를 관리합니다.

* 유형에 따라 이미지 데이터 처리를 내부적으로 처리하기때문에 p5.Renderer 구현은 텍스처를 다룰때 자체 메서드에서 특별한 예외를 만들 필요가 없습니다.
* 이미지 데이터가 변경되었는지 여부를 잘 추측하면서 모든 프레임을 조건부로 업데이트합니다. 성능을 높이기 위해 변경 사항이 없는 경우 텍스처를 업로드하지 않습니다.

### p5.Geometry

고정 모드에서 렌더링 된 모양은 p5.Renderer 객체의 캐시에 p5.Geometry 객체로 저장됩니다.
렌더러는 그려진 모양과 매개 변수를 기반으로 문자열을 p5.Geometry 객체에 매핑합니다 (예 :`box(70, 80, 90, 10, 20)`로 만든 상자의 지오메트리는 `'box|70|80|90|10|20'`). 첫번째 단계에서 지오메트리를 보유하고 있는 함수를 호출해 p5.Geometry 객체를 만들고 앞서 언급 한 문자열 ID를 사용하여 지오메트리 해시에 저장합니다. 추후 해시안에서 해당 ID를 찾아 호출하고, 찾았을 경우 새 객체를 만드는 대신 기존 객체를 참조하여 사용합니다.

* 지오메트리 기본 요소에 대한 꼭지점, 법선, 면, 선 꼭지점, 선 법선 및 텍스처 좌표를 저장합니다.
* 꼭지점 세트에 대한 면, 법선, 선 꼭지점 및 선 법선을 계산하는 방법을 제공합니다.

## 즉시 모드
즉시 모드로 그려진 모든 속성은 렌더러의 객체에 저장되고, GL 드로잉 컨텍스트에 그리는데 사용 된 후 폐기됩니다.

## 지오메트리 : 고정 및 즉시 모드
고정된 지오메트리는 3D 원형에 사용되는 반면 즉시 모드는 begin/endShape로 만든 모양에 사용됩니다.

|고정된 지오메트리 함수| 즉시 모드 함수 |
|--------------------------------|----------------------------------------|
|plane()                         | bezier()                               |
|box()                           | curve()                                |
|sphere()                        | line()                                 |
|cylinder()                      | beginShape()                           |
|cone()                          | vertex()                               |
|ellipsoid()                     | endShape()                             |
|torus()                         | point()                                |
|triangle()                      | curveVertex()                          |
|arc()                           | bezierVertex()                         |
|point()                         | quadraticVertex()                      |
|ellipse()                       |
|rect()                          |
|quad()                          |
|text()                          |






## 텍스쳐 관리
p5.Renderer.GL 인스턴스는 필요에 따라 p5.Textures 객체의 배열을 관리합니다.
텍스처는 `texture()` 메서드와 함께 사용되는 이미지 및 비디오용으로 생성되거나 커스텀 쉐이더에 제공되는 정형으로 생성됩니다.

렌더러에 텍스쳐가 필요한 때 먼저 주어진 이미지/비디오에 텍스처가 생성되었는지 확인한 후 렌더링을 위해 쉐이더에 제공합니다. 이미지/비디오에 기존 텍스쳐를 찾을 수 없는 경우에만 새로운 텍스처가 생성됩니다.

## 쉐이더

### 쉐이더 유형

#### 색상 쉐이더
현재 채우기 색상에 따라 객체의 평평한 음영을 제공합니다.

#### 조명 쉐이더(조명 & 텍스처용)
다음을 설명합니다:
* `ambientLight()`, `directionalLight()`, `pointLight()`, `spotLight()` 및 `specularColor()`에 의해 설정된 조명 매개 변수
* `ambientMaterial()`, `emissiveMaterial()` 및 `specularMaterial()`에 의해 설정된 재질 매개 변수
* `texture()`로 설정 된 텍스처 매개 변수 

#### 일반 쉐이더

일반 쉐이더는 `normalMaterial()`이 사용 중일 때 설정됩니다. 표면의 정규 벡터를 사용하여 프래그먼트 색상을 결정합니다.

### 쉐이더 매개변수

#### 표준 모델 뷰 및 카메라 정형
|Parameter                        |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|---------------------------------|-----------|---------------|------------|-------------|------------|
|`uniform mat4 uModelViewMatrix;` |x          |x              |x           |x            |x           |
|`uniform mat4 uProjectionMatrix;`|x          |x              |x           |x            |x           |
|`uniform vec4 uViewPort;`        |x          |               |            |             |            |
|`uniform vec4 uPerspective;`     |x          |               |            |             |            |


#### 지오메트리 속성 및 정형
|Parameter                        |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|---------------------------------|-----------|---------------|------------|-------------|------------|
|`attribute vec3 aPosition;`      |x          |x              |x           |x            |x           |
|`attribute vec3 aNormal;`        |           |x              |            |x            |            | 
|`attribute vec2 aTexCoord;`      |           |x              |            |x            |            |
|`uniform mat3 uNormalMatrix;`    |           |x              |            |x            |            |
|`attribute vec4 aDirection;`     |x          |               |            |             |            |
|`uniform float uStrokeWeight;`   |x          |               |            |             |            |

#### 재질 색상
|Parameter                        |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|---------------------------------|-----------|---------------|------------|-------------|------------|
|`uniform vec4 uMaterialColor;`   |x          |x              |            |             |x           |
|`attribute vec4 aVertexColor;`   |           |               |x           |             |            |

#### 조명 매개변수

|Parameter                                      |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|-----------------------------------------------|-----------|---------------|------------|-------------|------------|
|`uniform int uAmbientLightCount;`              |           |x              |            |             |            |
|`uniform int uDirectionalLightCount;`          |           |x              |            |             |            |
|`uniform int uPointLightCount;`                |           |x              |            |             |            |
|`uniform int uSpotLightCount;`                 |           |x              |            |             |            |
|`uniform vec3 uAmbientColor[8];`               |           |x              |            |             |            |
|`uniform vec3 uLightingDirection[8];`          |           |x              |            |             |            |
|`uniform vec3 uDirectionalDiffuseColors[8];`   |           |x              |            |             |            |
|`uniform vec3 uDirectionalSpecularColors[8];`  |           |x              |            |             |            |
|`uniform vec3 uPointLightLocation[8];`         |           |x              |            |             |            |
|`uniform vec3 uPointLightDiffuseColors[8];`    |           |x              |            |             |            |
|`uniform vec3 uPointLightSpecularColors[8];`   |           |x              |            |             |            |
|`uniform float uSpotLightAngle[8];`            |           |x              |            |             |            |
|`uniform float uSpotLightConc[8];`             |           |x              |            |             |            |
|`uniform vec3 uSpotLightDiffuseColors[8];`     |           |x              |            |             |            |
|`uniform vec3 uSpotLightSpecularColors[8];`    |           |x              |            |             |            |
|`uniform vec3 uSpotLightLocation[8];`          |           |x              |            |             |            |
|`uniform vec3 uSpotLightDirection[8];`         |           |x              |            |             |            |
|`uniform bool uSpecular;`                      |           |x              |            |             |            |
|`uniform bool uEmissive;`                      |           |x              |            |             |            |
|`uniform int  uShininess;`                     |           |x              |            |             |            |
|`uniform bool uUseLighting;`                   |           |x              |            |             |            |
|`uniform float uConstantAttenuation;`          |           |x              |            |             |            |
|`uniform float uLinearAttenuation;`            |           |x              |            |             |            |
|`uniform float uQuadraticAttenuation;`         |           |x              |            |             |            |

#### 텍스쳐 매개변수

|Parameter                             |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|--------------------------------------|-----------|---------------|------------|-------------|------------|
|`uniform sampler2D uSampler;`         |           |x              |            |             |            |
|`uniform bool isTexture;`             |           |x              |            |             |            |

#### 일반 매개변수

|Parameter                             |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|--------------------------------------|-----------|---------------|------------|-------------|------------|
|`uniform float uResolution;`          |           |               |x           |             |            |
|`uniform float uPointSize;`           |           |               |x           |             |x           |

#### 다양한 매개변수

|Parameter                             |Line Shader|TexLight Shader|Color Shader|Normal Shader|Point Shader|
|--------------------------------------|-----------|---------------|------------|-------------|------------|
|`varying vec3 vVertexNormal;`         |           |x              |            |             |            |
|`varying vec2 vVertTexCoord;`         |           |x              |            |             |            |
|`varying vec3 vLightWeighting;`       |           |x              |            |             |            |
|`varying highp vec2 vVertTexCoord;`   |           |               |            |x            |            |
|`varying vec4 vColor;`                |           |               |x           |             |            |
|`varying float vStrokeWeight`         |           |               |            |             |x           |

## 다음 단계

커밍 쑨!
