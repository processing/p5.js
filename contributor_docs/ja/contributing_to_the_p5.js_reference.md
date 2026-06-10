<!-- 正しい形式を使用して p5.js 参照資料を作成および編集します。 -->

# p5.js の参考文献に貢献する

p5.jsでは、ライブラリのソースコードに特別なコメントを含めることで、p5.jsのウェブサイトの[参考文献ページ](https://p5js.org/reference/)に表示されるコード参照を作成します。これらの参考コメントには、説明、関数のシグネチャ（そのパラメータと戻り値）、および使用例が含まれています。つまり、p5.jsの各関数/変数の参照ページの内容は、ソースコードの参照コメントから構築されています。

この文書では、参考コメントをどのように書き、フォーマットするかを示し、最終的にウェブサイト上で正しく表示されるようにします。p5.jsの任意の関数や変数の参考を編集または書き込む際には、このガイドに従う必要があります。


## 参考コメントの仕組みについての簡単な紹介

p5.jsのソースコードを見るとき、ライブラリ内の多くの行が参考コメントであることがわかります。これらは次のように見えます：

```
/**
 * Calculates the sine of an angle. `sin()` is useful for many geometric tasks
 * in creative coding. The values returned oscillate between -1 and 1 as the
 * input angle increases. `sin()` takes into account the current
 * <a href="#/p5/angleMode">angleMode</a>.
 *
 * @method sin
 * @param  {Number} angle the angle.
 * @return {Number} sine of the angle.
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   let t = frameCount;
 *   let x = 50;
 *   let y = 30 * sin(t * 0.05) + 50;
 *   line(x, 50, x, y);
 *   circle(x, y, 20);
 *
 *   describe('A white ball on a string oscillates up and down.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   let x = frameCount;
 *   let y = 30 * sin(x * 0.1) + 50;
 *   point(x, y);
 *
 *   describe('A series of black dots form a wave pattern.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   let t = frameCount;
 *   let x = 30 * cos(t * 0.1) + 50;
 *   let y = 10 * sin(t * 0.2) + 50;
 *   point(x, y);
 *
 *   describe('A series of black dots form an infinity symbol.');
 * }
 * </code>
 * </div>
 */
```

実際のJavaScriptコードで関数が定義されているのは、そのコメントの直後です。参考コメントは常に `/**` で始まり、`*/` で終わります。その間の各行は `*` で始まります。

この形式のコードブロックに含まれるすべての内容は参考文献として解釈されます。あなたはおそらく [JSDoc](https://jsdoc.app/) を通じてこのスタイルのコードコメントに慣れているでしょう。p5.jsはJSDocを使用していませんが、非常に似たツールである [YUIDoc](https://yui.github.io/yuidoc/) を使用しており、参照構文も非常に似ています。このスタイルの参考コメントブロックでは、各コメントブロックがさらに個々の要素に分かれています。以下では、`sin()` 関数の参考コメントブロックを解析し、各部分の役割について見ていきます。参照ページの [`sin()`](https://p5js.org/reference/p5/sin) と比較することができます。

## 参考コメントブロック

上記の `sin()` 関数の参考コメントブロックを解析し、各部分の役割を見ていきましょう。このコメントを参照ページ上の [`sin()`](https://p5js.org/reference/p5/sin) と比較することができます。

```
/**
 * Calculates the sine of an angle. `sin()` is useful for many geometric tasks
 * in creative coding. The values returned oscillate between -1 and 1 as the
 * input angle increases. `sin()` takes into account the current
 * <a href="#/p5/angleMode">angleMode</a>.
```

コメントの先頭には、関数の説明がテキストで表示されます。 この説明にはマークダウン構文と HTML を含めることができます。 説明は簡潔かつ簡潔にする必要があり、関数の動作と、必要に応じてそのパフォーマンスや異常な動作に関する詳細を説明します。

```
 * @method sin
 * @param  {Number} angle  the angle.
 * @return {Number} sine of the angle.
```


関数は通常、以下の三つの部分から成り立っており、各部分は `@` 記号で始まり、以下のいずれかのキーワードに続きます：

- `@method` は関数の名前を定義するために使用され、この場合は `sin`（関数名には括弧 `()` は含まれません）。
- `@param` は関数が受け取る引数またはパラメータを定義するために使用されます。
  - キーワード `@param` の後に続く中括弧 `{}` の中には、引数の型が格納されます。
  - 型の後の次の単語（angle）は引数の名前です。
  - 名前の後、その行の残りの部分は引数の説明です。
- `@return` は関数の戻り値を定義するために使用されます。
  - キーワード `@return` の後に続く中括弧 `{}` の中には、戻り値の型が格納されます。
  - 型の後、その行の残りの部分は戻り値の説明です。

パラメータについては、通常、以下の形式に従うべきです：

```
@param {type} name Description here.
```

パラメータがオプションの場合は、名前を角括弧で囲みます：

```
@param {type} [name] Description here.
```


### 追加情報: 定数

パラメーターが [`constants.js`](https://github.com/processing/p5.js/blob/main/src/core/constants.js) で定義された 1 つ以上の値を受け入れる場合、型は次のようになります。 `{Constant}` として指定し、キーワード `either` の後のコメントに有効な値を列挙します。次に例を示します:

```
@param {Constant} horizAlign horizontal alignment, either LEFT, CENTER, or RIGHT
```

戻り値の型については、次の形式に従う必要があります:

```
@return {type} Description of the data returned.
```

関数が値を返さない場合は、`@return` タグを省略できます。


### 追加情報: チェーン

メソッドが親オブジェクトを返す場合は、「@return」タグをスキップして、代わりに次の行を追加できます。

```
@chainable
```


## 其他签名

如果一个函数有多个可能的参数选项，则可以分别指定每个参数。例如，[`background()`](https://p5js.org/reference/#p5/background) 函数有许多不同的参数选项（请参阅参考页面上的“语法”部分）。选择一个版本以使用上面的模板列出作为第一个签名。在第一个参考注释块的末尾，你可以添加额外的签名，每个签名都在自己的块中，仅使用以下示例中的 `@method` 和 `@param` 标签。

```
/**
 * @method background
 * @param {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex
 * @param {Number} [a] alpha value
 */

/**
 * @method background
 * @param {Number} gray specifies a value between white and black
 * @param {Number} [a]
 */
```


### 追加情報：複数のシグネチャ

二つのシグネチャの唯一の違いがオプションのパラメータの追加である場合、別々のシグネチャを作成する必要はありません。可能な限りこの機能の使用を制限し、参考文献で不要な混乱や類似情報を生じさせないようにしてください。


## p5.js の変数に関する参考文献

これまでに、関数や定数の参考文献の作成方法を見てきました。変数も同じ構造に従いますが、異なるタグを使用します。

```
/**
 * The system variable mouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the canvas. The value at
 * the top-left corner is (0, 0) for 2-D and (-width/2, -height/2) for WebGL.
 * If touch is used instead of mouse input, mouseX will hold the x value
 * of the most recent touch point.
 *
 * @property {Number} mouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, 0, mouseX, 100);
 *   describe('horizontal black line moves left and right with mouse x-position');
 * }
 * </code>
 * </div>
 */
```

ブロックの開始には変数の説明が含まれています（この例では `mouseX`）。変数の名前を定義するために、`@method` の代わりに `@property` を使用します。`@property` の構文は `@param` に似ており、型とその名前を定義するために使用されます。p5.jsのほとんどの変数には `@readonly` タグが付けられており、ライブラリのユーザーによる直接の上書きが推奨されないことを内部的に示します。


## 例の追加

`sin()` と `mouseX` の参考コメントには、まだ議論していない `@example` タグが含まれています。このタグは、参考ページにアクセスしたときに実行されるコード例を定義する場所です。

![p5.jsの "red()" 関数の参考ページのスクリーンショットで、例のコードセクションのみを示しています。](../images/reference-screenshot.png)

上記の例を作成する関連の `@example` タグは以下の通りです：

```
 * @example
 * <div>
 * <code>
 * const c = color(255, 204, 0);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'redValue' to 255.
 * const redValue = red(c);
 * fill(redValue, 0, 0);
 * rect(50, 20, 35, 60);
 * describe(
 *   'Two rectangles with black edges. The rectangle on the left is yellow and the one on the right is red.'
 * );
 * </code>
 * </div>
```

在 `@example` 标签之后，你应该开始一个 HTML `<div>` 标签，后跟一个 `<code>` 标签。在开放和闭合的 `<code>` 标签之间，你将插入相关示例代码。编写参考示例代码的基本原则是保持简单和简洁。示例应该有意义，并解释功能的工作原理，而不会太复杂。示例的画布应该是 100x100 像素，如果没有包含 `setup()` 函数，例如上面的示例，则代码将自动包装在一个默认的 100x100 像素灰色背景画布中创建的 `setup()` 函数中。我们不会在这里详细讨论示例代码的最佳实践和代码风格；请参阅参考样式指南。

你可以为一个功能添加多个示例。为此，添加一个额外的 `<div>` 和 `<code>` HTML 块，直接放在第一个关闭后，中间用一个空行分隔。

```
* @example
* <div>
* <code>
* arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
* describe('An ellipse created using an arc with its top right open.');
* </code>
* </div>
*
* <div>
* <code>
* arc(50, 50, 80, 80, 0, PI, OPEN);
* describe('The bottom half of an ellipse created using arc.');
* </code>
* </div>
```

リファレンス ページでサンプル コードを実行したくない (つまり、コードを表示したいだけである) 場合は、`<div>` に "`norender`" クラスを含めます:

```
* @example
* <div class="norender">
* <code>
* arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
* describe('ellipse created using arc with its top right open');
* </code>
* </div>
```

サンプルを自動テストの一部として実行したくない場合 (たとえば、ユーザーの操作が必要なサンプルの場合)、`<div>` に `"notest"` クラスを含めます:

```
* @example
* <div class='norender notest'><code>
* function setup() {
*   let c = createCanvas(100, 100);
*   saveCanvas(c, 'myCanvas', 'jpg');
* }
* </code></div>
```

サンプルで外部アセット ファイルを使用する場合は、それらを [/docs/yuidoc-p5-theme/assets](https://github.com/processing/p5.js/tree/main/docs/yuidoc-p5 -theme/assets) に配置してください。 フォルダー (またはそこにある既存のファイルを再利用) を作成し、「assets/filename.ext」を使用してコード内でそれらにリンクします。 参考例については、[tint()](https://p5js.org/reference/p5/tint) を参照してください。


### `describe()` を使用してキャンバスの説明を追加します

最後に、追加するサンプルごとに、p5.js 関数 `describe()` を使用して、スクリーン リーダーでアクセスできるキャンバスの説明を作成する必要があります。 引数は 1 つだけ含まれます。それは、キャンバス上で何が起こっているかを簡単に説明する文字列です。

```
* @example
* <div>
* <code>
* let xoff = 0.0;
* function draw() {
*   background(204);
*   xoff = xoff + 0.01;
*   let n = noise(xoff) * width;
*   line(n, 0, n, height);
*   describe('A vertical line moves randomly from left to right.');
* }
* </code>
* </div>
*
* <div>
* <code>
* let noiseScale = 0.02;
* function draw() {
*   background(0);
*   for (let x = 0; x < width; x += 1) {
*     let noiseVal = noise((mouseX + x) * noiseScale, mouseY * noiseScale);
*     stroke(noiseVal*255);
*     line(x, mouseY + noiseVal * 80, x, height);
*   }
*   describe('A horizontal wave pattern moves in the opposite direction of the mouse.');
* }
* </code>
* </div>
```

`describe()` に関する詳細情報については、[Web Accessibility Contributors Documentation](https://p5js.org/contributor-docs/#/web_accessibility?id=user-generated-accessible-canvas-descriptions)をご覧ください。

これで、p5.js の参考コメントを作成および編集する主な方法について説明しました。しかし、JSDocスタイルの参考コメントには、p5.jsで遭遇する可能性があるより専門的な使用法もいくつかあります。これらは特定の状況で役立ちますが、通常は頻繁に必要とされるものではありません。


### `@private` タグ

属性や変数がプライベート関数や変数である場合には、`@private` を使用できます。機能を `@private` としてマークすると、その機能はウェブサイト上でレンダリングされた参照の一部として含まれません。ライブラリ自体の内部機能を文書化する場合に、参考コメントブロックをプライベートとしてマークするために `@private` タグを使用する理由です。例として、以下の `_start` の参考コメントを参照してください：

   

```
/**
 * _start calls preload() setup() and draw()
 *
 * @method _start
 * @private
 */
p5.prototype._start = function () {
```


### `@module` と関連タグ

各ソース コード ファイルの先頭には `@module` タグが付いています。 モジュールは p5.js の一連の関数に対応し、Web サイト上に表示されるレンダリングされたリファレンス ページでは、これらの関数が対応する部分に分割されています。 各モジュール内で、「@submodule」タグを使用して追加のサブモジュールを定義します。

`@for` タグは、このモジュールと全体的な `p5` クラスの間の関係を定義し、このモジュールが `p5` クラスの一部であることを効果的に示します。

`@requires` タグは、現在のモジュールが依存する必要なインポートされたモジュールを定義します。

```
/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 */
```

p5.j​​s が従う規則では、`src/` フォルダー内の各サブフォルダーは `@module` になり、サブフォルダー内の各ファイルはそのサブフォルダー `@submodule` の下の `@module` になります。 p5.j​​s ソース コードに新しいサブフォルダー/ファイルを追加する場合を除き、この参照コメント ブロック内のファイルを直接編集しないでください。


### `@class` タグ

クラス コンストラクターは、`@class` タグと `@constructor` タグを使用して定義されます。 このブロックの形式は、`@method` ブロックを使用して関数を定義する方法に似ています。クラスの名前は、`@class` タグを使用して定義する必要があり、`@constructor` タグは、クラスにはコンストラクターがあります。 以下の `p5.Color` クラスの例を参照してください:

```
/**
 * A class to describe a color. Each `p5.Color` object stores the color mode
 * and level maxes that were active during its construction. These values are
 * used to interpret the arguments passed to the object's constructor. They
 * also determine output formatting such as when
 * <a href="#/p5/saturation">saturation()</a> is called.
 *
 * Color is stored internally as an array of ideal RGBA values in floating
 * point form, normalized from 0 to 1. These values are used to calculate the
 * closest screen colors, which are RGBA levels from 0 to 255. Screen colors
 * are sent to the renderer.
 *
 * When different color representations are calculated, the results are cached
 * for performance. These values are normalized, floating-point numbers.
 *
 * <a href="#/p5/color">color()</a> is the recommended way to create an instance
 * of this class.
 *
 * @class p5.Color
 * @constructor
 * @param {p5} [pInst]                  pointer to p5 instance.
 *
 * @param {Number[]|String} vals        an array containing the color values
 *                                      for red, green, blue and alpha channel
 *                                      or CSS color.
 */
```

## 生成和预览参考文献

p5.js 存储库已经设置好，可以生成和预览参考文献，而不需要构建和运行 p5.js 网站。

- 从源代码中的参考注释生成参考文献的主要命令是运行以下命令。

```
npm run docs
```

## 参照の生成とプレビュー

p5.j​​s リポジトリは、p5.js Web サイトを構築して実行しなくても、参照を生成してプレビューできるようにすでにセットアップされています。

- ソース コード内の参照コメントから参照を生成する主なコマンドは、次のコマンドを実行することです。

```
npm run docs:dev
```

これにより、参考文献のライブプレビューが開始され、変更を加えるたびに更新されます（変更後にページをリフレッシュする必要があります）。特に、ブラウザでサンプルコードをプレビューする場合に便利です。

- 主要なテンプレートファイルは `docs/` フォルダに保存されており、ほとんどの場合、このフォルダ内のファイルは直接変更すべきではありません。ただし、`docs/yuidoc-p5-theme/assets` フォルダに新しいファイルを追加する場合は例外です。


## 次のステップ

参考システムに関する詳細情報は、[JSDoc](https://jsdoc.app/) および [YUIDoc](https://yui.github.io/yuidoc/) のドキュメントを確認してください。

参考資料に関連する issue の例としては、[#6519](https://github.com/processing/p5.js/issues/6519) および [#6045](https://github.com/processing/p5.js/issues/6045) をご覧ください。[Contributor Guidelines](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md) のドキュメントも良い出発点です。