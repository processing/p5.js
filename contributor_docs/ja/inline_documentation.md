# p5.jsでインラインドキュメントを追加する

p5.jsのソースコードにインラインドキュメントを追加することで、参照ドキュメントを自動生成することができます。この文書は、適切なフォーマットで参照ドキュメントに表示されるために、ドキュメントに含めるべきタグと情報の概要を説明します。参照ドキュメントは定期的にソースコードから自動生成されるため、あなたのドキュメントが参照ドキュメントに表示されるまでに数日かかる場合があります。数日を超える場合や他の問題が発生した場合は、[hello@p5js.org](mailto:hello@p5js.org)までメールでお問い合わせください。

基本的なガイドラインについては以下を参照してください。yuidocスタイルに関する詳細情報は[こちら](http://yui.github.io/yuidoc/syntax/index.html)。各行は80文字以内に制限し、制限を超える場合は改行してください。

__[必要な例のリスト](https://github.com/processing/p5.js/issues/2865)（最新のリストを確認するために、gruntを使ってライブラリをビルドし、ログメッセージを見ることもできます）__

## 要素のタイプと説明を指定する

4種類の要素があります：`@class`、`@method`、`@property`、`@event`。
これらのうち一つを指定する必要があり、それによって文書にその要素が表示されます。その後に要素の名前を追加します。説明は最上部にあるべきです。以下はいくつかのフォーマットのヒントです：
* 説明テキストのフォーマットにはMarkdown構文を使用できます。
* 任意の関数、変数、定数名は、`等幅`であるべきです。
* 二行の間隔は新しい段落と見なされます。`<br><br>`タグを挿入する必要はありません。
* 可能であれば、他の関数や変量名を言及する場合は、他の文書へのリンクを含めることができます。例えば、[loadImage](https://github.com/processing/p5.js/blob/main/src/image/loading_displaying.js#L21)の説明でpreloadメソッドへのリンクを確認できます。
* この[yuidocリファレンス](http://yui.github.io/yuidoc/syntax/index.html#basic-requirements)でさらに多くの構文情報があります。

```js
   /**
    * ベクトルの x 成分
    * @property x
    * @type {Number}
    */
    this.x = x || 0;
```

```js

  /**
   * 円弧を描く
   *
   * パラメータ x、y、幅、高さ、開始および停止のみが指定されている場合、
   * 円グラフを開きます。
   * モード引数が指定されている場合、指定された変数に基づいて、開いた円弧、弦弧、または円弧が描画されます。
   *
   * 
   * @param  {Number} x 円弧楕円の x 座標
   * @param  {Number} y 円弧楕円のy座標
   * @param  {Number} width 円弧楕円のデフォルトの幅
   * @param  {Number} height 円弧楕円のデフォルトの高さ
   * @param  {Number} start 円弧の開始角度 (ラジアン)
   * @param  {Number} stop 円弧の終了角度 (ラジアン)
   * @param  {String} [mode] 円弧の描画方法を決定するオプションのパラメータ
   */
```

```js
  /**
   * 
   * ベクトルのサイズ (長さ) を計算し、結果を浮動小数点数として返します。
   * (これは実際には方程式 sqrt(x*x + y*y + z*z) です)。
   *
   * @method mag
   * @return {number} ベクトルの長さ
   */
   PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
   };
```

## パラメータを指定する

メソッドの場合は、任意の `@params` を指定する必要があります。 スペースやタブなどを含めることはできず、次の標準に従う必要があります。

```
@param {type} 名の説明。長さは関係ありません。
```

パラメーターがオプションの場合は、名前を角括弧で囲みます。

```
@パラメータ {type} [name] 説明。
```

パラメーターが [`constants.js`](https://github.com/processing/p5.js/blob/main/src/core/constants.js) で定義された 1 つ以上の値を取る場合、
次に、タイプを `{Constant}` として指定し、有効な値をコメント内の `either` キーワードの後に​​リストする必要があります。次に例を示します。

```
@param {Constant} horizAlign 水平方向の配置。LEFT、CENTER、RIGHT のいずれかになります。
```

## 戻り値の指定

`@return`は`@params`と同様ですが、名前は含まれません。これは`@method`の最後の要素であるべきです。JavaScriptの型には、String、Number、Boolean、Object、Array、Null、Undefinedがあります。戻り値の型がない場合は、`@return`を含めないでください。

```
@return {type} 返されるデータの説明。
```

メソッドが親オブジェクトを返す場合は、「@return」を省略して次の行を追加できます。

```
@chainable
```

## 追加のシグネチャ

メソッドに複数の引数オプションが可能な場合、それぞれのオプションを個別に指定することができます。例として、[background](http://p5js.org/reference/#p5/background)の「syntax」セクションの例を参照してください。これを行うには、一つのバージョンを最初のシグネチャとして選択し、上記のガイドラインに従ってリストします。ドキュメントブロックの最後に、以下のように、それぞれのシグネチャを自分のブロックに配置して、追加のシグネチャを追加することができます：

```js
/**
 * @method background
 * @param {String} colorstring 色の文字列、可能な形式は次のとおりです: 整数
 *                             rgb() または rgba()、パーセンテージ rgb() または rgba()、
 *                             16進数3桁、16進数6桁
 * @param {Number} [a] alpha値
 */

/**
 * @method background
 * @param {Number} gray 白と黒の間の値を指定してください
 * @param {Number} [a]
 */
```

注意：
* もし以前にある引数の説明が既に示されている場合、例えばこの例の`a`のように、その説明を再度書く必要はありません。
* 二つのシグネチャの唯一の違いがオプショナルな引数が追加されたことである場合、別のシグネチャを作成する必要はありません。
* `background`と`color`のソースコードにおける2つのインラインの例は、[background](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/setting.js#L106) と [color](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/creating_reading.js#L241) で確認できます。

## その他のタグの指定

属性や変数が定数である場合は、`@final`を使用してください：

```js
/**
 * PI は、値 3.14159265358979323846 の数学定数です。
 * @property PI
 * @type Number
 * @final
 */
PI: PI
```

属性や変数がプライベート変数である場合（デフォルトは`@public`なので指定する必要はありません）、`@private`を使用してください：

```js
/**
 * `_start`は`preload()`、`setup()`、`draw()`を呼び出します。
 * 
 * @method _start
 * @private
 */
p5.prototype._start = function () {
```

## ファイルのモジュールを指定する

各*ファイル*の先頭には、`@module` タグが含まれている必要があります。モジュールはJavaScriptファイル（またはrequire.jsモジュール）に対応しているべきです。それらはプロジェクト内の項目リストのグループとして機能することができます。[こちら](https://p5js.org/reference/#/collection-list-nav)を参照してください（モジュールにはCOLOR、IMAGE、IO、PVECTORなどが含まれます）。

```js
/**
 * @module image
 */
define(function (require) {
  //ここにコードを書きます
};
```


## コンストラクタ

コンストラクタは `@class` で定義されます。各コンストラクタには `@class` タグが必要で、その後にクラス名が続き、`@constructor` タグと必要に応じて `@param` タグが続きます。

```js
/**
 * p5 コンストラクタ。
 * @class p5
 * @constructor
 * @param {Object} [node] キャンバス要素。 指定しない場合、キャンバスが DOM に追加されます。
 * @param {Object} [sketch] `sketch`オブジェクト。

 */
const p5 = function( node, sketch) {
  ...
}
```

## サンプルコードを追加

オプションで、「@example」を使用して例を追加できます。 サンプルコードは `<code></code>` タグの間に配置し、コメントを含める必要があります。 コード ブロック内で `setup()` 関数を使用して特に指定しない限り、各 `<code>` ブロックは、灰色の背景を持つ 100x100 ピクセルのキャンバス上で自動的に実行されます。 サンプルでは、​​初心者が JavaScript を学習する際に理解しやすいように、すべての変数を「let」を使用して定義してください。 他の src ファイルの例を参照して、正しい形式であることを確認してください。 サンプルでキャンバスに加えて他の HTML 要素を作成する場合、それらは 100 ピクセルの幅でレンダリングされます。

```
@example
<div>
<code>
arc(50, 55, 50, 50, 0, HALF_PI);
noFill();
arc(50, 55, 60, 60, HALF_PI, PI);
arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
describe('4 つの円弧を使用して作成された楕円の壊れた輪郭');
</code>
</div>
```

関数には複数の例を追加できますが、@example が 1 つだけ存在し、それぞれが独自の `<div>` ラッパーを持ち、改行で区切られていることを確認してください。

```
@example
<div>
<code>
arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
describe('右上の開いた円弧を使用して作成された楕円');
</code>
</div>

<div>
<code>
arc(50, 50, 80, 80, 0, PI, OPEN);
describe('円弧を使用して作成された楕円の下半分');
</code>
</div>
```

サンプルでコードを実行したくない場合 (つまり、コードを表示するだけの場合)、「norender」クラスを `<div>` に含めます。
```
@example
<div class="norender">
<code>
arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
describe('右上隅のスカイアークをオンにするために使用されます。');
</code>
</div>
```

サンプルをビルド テストの一部として実行したくない場合 (たとえば、サンプルでユーザーの操作が必要な場合や、ヘッドレス Chrome テスト フレームワークでサポートされていない機能を使用している場合)、「notest」クラスを `<div> に含めます。 `:

```
@example
<div class='norender notest'><code>
function setup() {
  let c =

 createCanvas(100, 100);
  saveCanvas(c, 'myCanvas', 'jpg');
}
</code></div>
```

外部リソースファイルへのリンクが必要な場合は、それらを[/docs/yuidoc-p5-theme/assets](https://github.com/processing/p5.js/tree/main/docs/yuidoc-p5-theme/assets)に配置し、コード内で"assets/filename.ext"を使用してそれらにリンクしてください。[tintの例](http://p5js.org/reference/#/p5/tint)を参照してください。

### describe()を使用してキャンバスの説明を追加する
最後に、追加した各例について、p5.jsの関数`describe()`を使用して、スクリーンリーダー向けのアクセシブルな説明を作成する必要があります。一つの引数のみを含む：キャンバス上で起こっていることの簡潔な説明の文字列です。第二の引数を追加しないでください。
```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
  decribe('更新されたノイズ値を使用して、垂直線が左から右に移動します。');
}
</code>
</div>

<div>
<code>
let noiseScale=0.02;
function draw() {
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
  describe('水平波形モード、マウスの X 位置と更新されたノイズ値の影響を受ける');
}
</code>
</div>

```
`describe()`についての詳細は、[Webアクセシビリティ貢献者ドキュメント](https://p5js.org/contributor-docs/#/web_accessibility?id=user-generated-accessible-canvas-descriptions)を参照してください。

以前のドキュメントガイドでは、各例の末尾に[alt-text](https://moz.com/learn/seo/alt-text)を追加して、スクリーンリーダー向けのキャンバスの説明を作成することが要求されていました。現在は、この方法は推奨されていません。常に`describe()`を使用してください。以前は、指定された関数のすべての例の後に`@alt`タグを追加することでalt-textを追加していました（各例の下に個別の`@alt`タグを追加するのではなく）、そして、複数の例の説明を区切るために改行を追加していました。

```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
}
</code>
</div>

<div>
<code>
let noiseScale=0.02;
function draw() {
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
}
</code>
</div>

@alt
垂直線は左から右に移動し、更新されたノイズ値に応じて変化します。
水平リップルは、マウスの X 位置と更新されたノイズ値の影響を受けます。
```

## メソッドのテンプレート
これは、よく文書化されたメソッドの例です。新しいメソッドを作成するには、[このテンプレート](https://github.com/processing/p5.js/tree/main/contributor_docs/method.example.js)を使用できます。テキスト内のメソッド変数を置き換え、残りの内容を削除してください。

![メソッドのインラインドキュメント例を示す画像](https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/images/method-template-example.png)


## ドキュメントの生成

* 最初に `npm run docs` を実行して、必要なすべてのローカルファイルとソースコードからコピーされた参照ファイルを生成します。yuidoc参照ページのコアJSファイルを変更するたびに、このコマンドを再度実行してください。これらの変更は、src内のインラインドキュメントの変更ではなく、yuidoc-p5-themeフォルダ内のファイルで行われます。
* ソースコードのみを変更した場合は、`npm run grunt yui` を実行するだけで十分ですが、`npm run grunt yui:build` も可能です。
* サイトのライブプレビューを起動し、変更後に都度更新するには、`npm run docs:dev` を実行します。 (変更を見るためには、変更後にページをリフレッシュする必要があります。)

生成された参照ドキュメントは docs/reference にあります。ローカルでプレビューするには、`npm run grunt yui:dev` を実行し、http://localhost:9001/docs/reference/ で確認してください。


## スペイン語バージョン

[スペイン語バージョン](http://p5js.org/es/reference)の作成方法は少し異なります。その内容を更新するには、[説明](https://github.com/processing/p5.js-website/blob/main/contributor_docs/i18n_contribution.md)を参照してください。

