# p5.js WEBGLモードの構造

この文書は、p5.jsのWEBGLモードの構造を説明し、p5.jsのコントリビューター、メンテナー、その他興味を持つ人々のための参考情報を提供します。スケッチ内で3Dグラフィックスを使用することに興味がある場合は、[このチュートリアル](https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5)をご覧ください。

## 構造とオブジェクトの概要

WEBGL構造の中心となるオブジェクトには、p5.Renderer.GL、p5.Shader、p5.Texture、p5.Geometryが含まれます。
p5.Renderer.GLの単一インスタンスは、独自のp5.Shaders、p5.Textures、p5.Geometryを管理します。一つの目標は、WebGLを使用してオフスクリーンレンダリングを可能にすることですが、まだテストされていません。
シェーダとテクスチャは特定のGLコンテキストに関連付けられ、レンダラーによって管理されます。

### p5.RendererGL
p5.RendererGLオブジェクトは、p5.jsのWEBGL/3Dモードレンダラです。
それはp5.Rendererから継承し、2Dモードでは使用できない追加機能を提供します。例えば：`box()`、`cone()`、シェーダの使用、テクスチャレンダリングの加速、および照明です。

* シェーダー（p5.Shaderオブジェクト）とテクスチャー（p5.Textureオブジェクト）を管理（作成およびキャッシュ）
* シェーダーを準備し、形状の座標を属性配列として使用
* 描画、塗りつぶし、テクスチャ、および各種照明メソッドを呼び出す際、適切なシェーダーを選択し、これらのシェーダーに適切なuniform変数を提供
* 照明に関連するデータを維持：さまざまなタイプの光源とそのパラメーターのカウントを使用
* 三次元プリミティブの幾何学的形状をキャッシュ（保留モードで）、begin/endShapeで作成された形状を除き、これらの形状は即時モードでGLに動的に生成およびプッシュされます。

レンダラーは、現在の描画条件を満たす適切なp5.Shaderを選択する責任があります。

### p5.Shader
p5.Shaderクラスは、GLプログラムのuniform変数とattribute変数へのアクセスを提供します。

* 頂点シェーダーとフラグメントシェーダーのコンポーネントをコンパイルおよびリンク
* シェーダーの属性とuniform変数にアクセスして設定するAPIを提供
* 形状を描画する前に、必要なテクスチャをバインドするシェーダー
* bindShader()メソッドを提供し、形状を描画する前に使用し、形状が描画された後にシェーダーをアンバインドします。

シェーダーのセクションで説明されているように、デフォルトのシェーダーが4つあります。

### p5.Texture
p5.Textureオブジェクトは、`p5.Image`、`p5.MediaElement`、`p5.Element`、または`ImageData`に基づいてテクスチャベースのGL状態を管理します。

* 内部的には、タイプに基づく画像データ処理を扱い、p5.Rendererの実装がテクスチャを扱う際に自身の方法で特別な例外を作る必要がないようにします。
* 状況に応じて毎フレーム更新され、画像データが変更されたかどうかを推測します。変更がなければ、パフォーマンスを向上させるためにできるだけテクスチャをアップロードしないようにします。

### p5.Geometry
保留モードで描画される形状は、p5.Geometryオブジェクトの形でp5.Rendererオブジェクトのキャッシュに保存されます。
レンダラーは、描画される形状とそのパラメーター（例えば`box(70, 80, 90, 10, 20)`で作成されたボックスの幾何学的形状は`'box|70|80|90|10|20'`でマッピングされます）に基づいて、文字列をp5.Geometryオブジェクトにマッピングします。保留された幾何学的形状を使用する関数を呼び出すとき、最初はp5.Geometryオブジェクトを作成し、上記の文字列IDを使用してそれを幾何学的ハッシュに保存します。後続の呼び出しでは、そのIDをハッシュ内で検索し、見つかった場合はそれを使用して既存のオブジェクトを参照し、新しいオブジェクトを作成するのではなく。

* 頂点、法線、面、線の頂点、線の法線、テクスチャ座標のデータを保存。
* 一連の頂点の面、法線、線の頂点、線の法線を計算する方法を提供。

## 即時モード
即時モードで描画するためのすべての属性は、GL描画コンテキストに描画されるオブジェクト内のレンダラーに保存され、その後破棄されます。

## 幾何学的形状：保留モードと即時モード
保留幾何学的形状は3D基本図形に使用され、即時モードはbegin/endShapeで作成された形状に使用されます。

| ジオメトリ保持関数を使用する | イミディエートモードジオメトリを使用する関数 |
| ------------------------- | ---------------------------------------- |
| plane()                   | bezier()                                 |
| box()                     | curve()                                  |
| sphere()                  | line()                                   |
| cylinder()                | beginShape()                             |
| cone()                    | vertex()                                 |
| ellipsoid()               | endShape()                               |
| torus()                   | point()                                  |
| triangle()                | curveVertex()                            |
| arc()                     | bezierVertex()                           |
| point()                   | quadraticVertex()                        |
| ellipse()                 |                                          |
| rect()                    |                                          |
| quad()                    |                                          |
| text()                    |                                          |






## テクスチャ管理
p5.Renderer.GLインスタンスは、必要に応じて一連のp5.Texturesオブジェクトを管理します。
`texture()`メソッドを使用したり、カスタムシェーダーのuniformとして提供される画像やビデオのテクスチャを作成します。

レンダラーがテクスチャを必要とするとき、まず指定された画像/ビデオに対してすでにテクスチャが作成されているかをチェックし、その後シェーダーのレンダリングに提供します。画像/ビデオの既存のテクスチャが見つからない場合にのみ、新しいテクスチャが作成されます。

## シェーダー

### シェーダーのタイプ

#### カラーシェーダー（Color Shader）
現在の塗りつぶし色に基づいて、オブジェクトにフラットな着色を提供します。

#### ライトシェーダー（Light Shader、光照とテクスチャ用）
以下を考慮します：
* `ambientLight()`、`directionalLight()`、`pointLight()`、`spotLight()`、`specularColor()`によって設定された照明パラメーター
* `ambientMaterial()`、`emissiveMaterial()`、`specularMaterial()`によって設定されたマテリアルパラメーター
* `texture()`によって設定されたテクスチャパラメーター

#### ノーマルシェーダー（Normal Shader、法線着色器）
`normalMaterial()`を使用するときに、ノーマルシェーダーが設定されます。これは、表面の法線ベクトルを使用してフラグメントの色を決定します。

### シェーダーパラメーター

#### 標準的なモデルビューとカメラuniforms
| パラメータ                         | ラインシェーダー  | テクスチャライトシェーダー | カラーシェーダー | ノーマルシェーダー | ポイントシェーダー |
| --------------------------------- | --------------- | ------------------------ | -------------- | ----------------- | ---------------- |
| `uniform mat4 uModelViewMatrix;`  | x               | x                        | x              | x                 | x                |
| `uniform mat4 uProjectionMatrix;` | x               | x                        | x              | x                 | x                |
| `uniform vec4 uViewPort;`         | x               |                          |                |                   |                  |
| `uniform vec4 uPerspective;`      | x               |                          |                |                   |                  |


#### 幾何学的属性とuniforms
| パラメータ                      | ラインシェーダー | テクスチャライトシェーダー | カラーシェーダー | ノーマルシェーダー | ポイントシェーダー |
| ------------------------------ | ---------------| -------------------------| ---------------| ------------------| ---------------- |
| `attribute vec3 aPosition;`    | x              | x                        | x              | x                 | x                |
| `attribute vec3 aNormal;`      |                | x                        |                | x                 |                  |
| `attribute vec2 aTexCoord;`    |                | x                        |                | x                 |                  |
| `uniform mat3 uNormalMatrix;`  |                | x                        |                | x                 |                  |
| `attribute vec4 aDirection;`   | x              |                          |                |                   |                  |
| `uniform float uStrokeWeight;` | x              |                          |                |                   |                  |

#### 材料の色
| パラメータ                          | ラインシェーダー | テクスチャライトシェーダー | カラーシェーダー | ノーマルシェーダー | ポイントシェーダー |
| --------------------------------- | ---------------- | ------------------------ | ---------------- | ------------------ | ---------------- |
| `uniform vec4 uMaterialColor;`    | x                | x                        |                  |                    | x                |
| `attribute vec4 aVertexColor;`    |                  |                          | x                |                    |                  |

#### 照明パラメーター

| パラメータ                                     |ラインシェーダー|テクスチャライトシェーダー|カラーシェーダー|ノーマルシェーダー|ポイントシェーダー|
| --------------------------------------------- | -------------| -----------------------| ---------- | ----------------- | -------------- |
| `uniform int uAmbientLightCount;`             |              | x                      |            |                   |                |
| `uniform int uDirectionalLightCount;`         |              | x                      |            |                   |                |
| `uniform int uPointLightCount;`               |              | x                      |            |                   |                |
| `uniform int uSpotLightCount;`                |              | x                      |            |                   |                |
| `uniform vec3 uAmbientColor[8];`              |              | x                      |            |                   |                |
| `uniform vec3 uLightingDirection[8];`         |              | x                      |            |                   |                |
| `uniform vec3 uDirectionalDiffuseColors[8];`  |              | x                      |            |                   |                |
| `uniform vec3 uDirectionalSpecularColors[8];` |              | x                      |            |                   |                |
| `uniform vec3 uPointLightLocation[8];`        |              | x                      |            |                   |                |
| `uniform vec3 uPointLightDiffuseColors[8];`   |              | x                      |            |                   |                |
| `uniform vec3 uPointLightSpecularColors[8];`  |              | x                      |            |                   |                |
| `uniform float uSpotLightAngle[8];`           |              | x                      |            |                   |                |
| `uniform float uSpotLightConc[8];`            |              | x                      |            |                   |                |
| `uniform vec3 uSpotLightDiffuseColors[8];`    |              | x                      |            |                   |                |
| `uniform vec3 uSpotLightSpecularColors[8];`   |              | x                      |            |                   |                |
| `uniform vec3 uSpotLightLocation[8];`         |              | x                      |            |                   |                |
| `uniform vec3 uSpotLightDirection[8];`        |              | x                      |            |                   |                | 
| `uniform bool uSpecular;`                     |              | x                      |            |                   |                |
| `uniform bool uEmissive;`                     |              | x                      |            |                   |                |
| `uniform int  uShininess;`                    |              | x                      |            |                   |                |
| `uniform bool uUseLighting;`                  |              | x                      |            |                   |                |
| `uniform float uConstantAttenuation;`         |              | x                      |            |                   |                |
| `uniform float uLinearAttenuation;`           |              | x                      |            |                   |                |
| `uniform float uQuadraticAttenuation;`        |              | x                      |            |                   |                |

#### テクスチャパラメーター

| パラメータ                      | ラインシェーダー | テクスチャライトシェーダー | カラーシェーダー | ノーマルシェーダー | ポイントシェーダー |
| ----------------------------- | ---------------- | ------------------------ | ---------------- | ------------------ | ---------------- |
| `uniform sampler2D uSampler;` |                  | x                        |                  |                    |                  |
| `uniform bool isTexture;`     |                  | x                        |                  |                    |                  |

#### 汎用パラメーター

| パラメータ                     | ラインシェーダー | テクスチャライトシェーダー | カラーシェーダー | ノーマルシェーダー | ポイントシェーダー |
| ---------------------------- | ---------------- | ------------------------ | ---------------- | ------------------ | ---------------- |
| `uniform float uResolution;` |                  |                          | x                |                    |                  |
| `uniform float uPointSize;`  |                  |                          | x                |                    | x                |

#### 変数パラメーター

| パラメータ                          | ラインシェーダー | テクスチャライトシェーダー | カラーシェーダー | ノーマルシェーダー | ポイントシェーダー |
| ----------------------------------- | ---------------- | ------------------------ | ---------------- | ------------------ | ---------------- |
| `varying vec3 vVertexNormal;`       |                  | x                        |                  |                    |                  |
| `varying vec2 vVertTexCoord;`       |                  | x                        |                  |                    |                  |
| `varying vec3 vLightWeighting;`     |                  | x                        |                  |                    |                  |
| `varying highp vec2 vVertTexCoord;` |                  |                          |                  | x                  |                  |
| `varying vec4 vColor;`              |                  |                          | x                |                    |                  |
| `varying float vStrokeWeight`       |                  |                          |                  |                    | x                |

## 次のステップ

もうすぐ公開予定！
