<!-- p5.js の WebGL モードのソースコードに取り組み始める方法です。 -->

# WebGL 貢献ガイド

このドキュメントを読んでいるということは、WebGL モードの開発を手伝いたいと考えているかもしれません。あなたの協力に感謝します。このページは、WebGL の貢献がどのように組織されているか、そして変更を加える際のいくつかの提案を提供することを目的としています。

## リソース

- [p5.js WebGL architecture overview](../webgl_mode_architecture.md) を読んで、WebGL モードと 2D モードの違いを理解してください。これはシェーダーやストロークなどの実装の詳細を理解するのに役立つ貴重な参考資料です。
- [contributor guidelines](https://p5js.org/contributor-docs/#/./contributor_guidelines) を読んで、issue の作成、コードベースの設定、変更のテストの方法を理解してください。
- p5.js の WebGL モードが構築されているブラウザの WebGL API について知ることも有益です：
  - [WebGL fundamentals](https://webglfundamentals.org/) は、多くのコアレンダリング概念を説明しています。
  - [The Book of Shaders](https://thebookofshaders.com/) は、WebGL シェーダーで使用される多くの技術について説明しています。

## 計画

  我々は [GitHub Project](https://github.com/orgs/processing/projects/5) を通じてissueを組織しており、以下のカテゴリーに分類しています：

- **システムレベルの変更** は長期的な目標に関連し、コードに深刻な影響を与えます。実施する前に十分な議論と包括的な計画が必要です。
- **解決策のないバグ** は、具体的な原因を特定するためにデバッグが必要なバグの報告です。具体的な原因が特定されるまで、これらのバグは修正に適していません。原因が明確になれば、最適な修正方法について話し合いを始めることができます。
- **解決策があるがPRされていないバグ** は、修正策が決まっており、コードの記述を開始できるバグです。
- **小規模な最適化** は、新機能に関連し、その機能が既存のアーキテクチャ内で明確に位置づけられており、システムにどのように統合されるかをさらに議論する必要はありません。これらの機能を追加することが決定されたら、関連するコードの記述を直ちに開始できます。
- **2D機能** は、p5.js の他の部分では実装されているが、WebGL モードではまだサポートされていない機能を指します。これらの機能が実装されると、その動作は2Dモードと一致することが期待されます。これらの機能の最適な実装方法については議論が必要かもしれませんが、ユーザーにとっては要件が明確です。
- **すべての状況で正常に機能しない機能** は、WebGL モードで

利用可能だが、すべてのWebGL使用シナリオに適していない機能を指します。たとえば、あるp5.jsメソッドは2Dおよび3Dの両方の座標システムをサポートしていますが、他の方法は3D座標を使用すると失敗する可能性があります。通常、これらの機能は開発を開始することができます。
- **機能リクエスト** は、他のすべてのコードに対する変更リクエストを指します。これらのリクエストは、WebGL モードの発展方向に適合するようにするために、いくつかの議論が必要です。
- **文書** は、コードの変更が必要ないが、p5.js の動作をよりよく記録する必要がある問題を指します。

## コードの配置

WebGLに関連するすべてのコンテンツは、`src/webgl`サブディレクトリに配置されます。このディレクトリ内で、トップレベルのp5.js関数はそれぞれのテーマ領域に分けて異なるファイルに格納されています。光源の設定コマンドは`lighting.js`に、材料の設定コマンドは`materials.js`に配置されます。

ユーザーインターフェースクラスを実装する場合、通常は1クラス1ファイルの方式を採用しています。これらのファイルには、時折、他の内部ユーティリティクラスも含まれています。例えば、`p5.Framebuffer.js`には`p5.Framebuffer`クラスが含まれており、フレームバッファ固有の他の主要クラスのサブクラスも含まれています。さらに、フレームバッファ固有のサブクラスもこのファイルに配置することができます。

`p5.RendererGL`は多くの動作を処理する大きなクラスです。したがって、すべての機能を1つの大きなクラスファイルに配置するのではなく、それぞれの機能を所属するテーマ領域に分けて多くのファイルに分割します。以下は、`p5.RendererGL`を各ファイルに分割する方法と、それぞれのファイルに含めるべき内容の説明です：

#### `p5.RendererGL.js`

初期化と核心機能。

#### `p5.RendererGL.Immediate.js`

**即時モード（immediate mode）** の描画に関連する機能（保存されずに再利用されない形状、例えば`beginShape()`と`endShape()`）

#### `p5.RendererGL.Retained.js`

**保持モード（retained mode）** の描画に関連する機能（既に保存されて再利用される形状、例えば`sphere()`）

#### `material.js`

ブレンドモード管理

#### `3d_primitives.js`

形状を描画するユーザーインターフェース関数、例えば`triangle()`。これらの関数は形状の幾何学的構造を定義します。その後、`p5.RendererGL.Retained.js`または`p5.RendererGL.Immediate.js`でこれらの形状が描画され、幾何学的入力が一般的な形状として扱われます。

#### `Text.js`

テキストレンダリングの機能とユーティリ

ティクラス

## WebGLの変更をテストする

### 一貫性のテスト

p5.jsでは、関数は複数の方法で使用されます。すべての方法を手動で検証するのは困難ですので、可能な限り単体テストを追加します。この方法で、新しい変更を加えたときにすべての単体テストが通る場合、既存の機能が何も壊れていないことを確信できます。

新しいテストを追加する際に、その機能が2Dモードで有効である場合、2つのモードで生成されるピクセルが同じであるかを確認することが一貫性を確保するための最善の方法の1つです。以下は、単体テストの例です：

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

この方法は常に適用されるわけではありません。なぜなら、2Dモードではアンチエイリアスをオフにすることができず、一方でWebGLモードでは、アンチエイリアスが通常異なるからです。しかし、x軸とy軸上の直線を描画する場合には、この方法が有効です。

機能がWebGL専用の場合、通常は数ピクセルをチェックして、2Dモードの結果と比較するのではなく、それらの色が期待どおりであることを確認します。近い将来、我々はより強力で安定したシステムに改良する可能性があり、そのシステムでは数ピクセルではなく、期待される結果の完全なイメージスナップショットと比較することになるでしょう。しかし、現在の状況では、以下にピクセル色のチェックの例を示します：

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

### 性能試験

パフォーマンスは p5.js の主要な関心事ではありませんが、変更がパフォーマンスに大きな影響を与えないように注意しています。通常、変更を含むテスト描画と変更を含まないテスト描画の2つを作成します。その後、両者のフレームレートを比較します。

パフォーマンスを測定するためのいくつかの提案：

- 描画の先頭で `p5.disableFriendlyErrors = true` を使用してフレンドリーエラーの提示を無効にします（または `p5.min.js` をテストします。このバージョンにはフレンドリーエラーシステムが含まれていません）。
- 安定した状態でのフレームレートを理解するために平均フレームレートを表示します。


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
以下は、レンダリングパイプラインの異なる部分にプレッシャーをかけるためにテストするいくつかのシナリオです：

- 複雑な形状がいくつかある場合（例えば、大型の3Dモデルや長い曲線）
- 多数の単純な形状がある場合（例えば、`line()`をforループ内で複数回呼び出す）