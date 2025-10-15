# FES 開発者リファレンスとコメント
このドキュメントには、p5.js フレンドリーエラーシステム（FES）のリファレンスと開発ノートが含まれています。FESには、さまざまなタイプのエラーメッセージを生成するための複数の関数が含まれています。これらの関数は、ブラウザがトリガーしたエラーイベント、ユーザーコードのスキャン中に見つかったエラー、ライブラリ内部のパラメータチェックなど、さまざまな場所からエラーを収集します。

フレンドリーエラーメッセージを生成する主要な関数には以下のものがあります：
* `_validateParameters()`
* `_friendlyFileLoadError()`
* `_friendlyError()`
* `helpForMisusedAtTopLevelCode()`
* `_fesErrorMontitor()`

これらの関数は `core/friendly_errors/` フォルダ内にあります。
* `fes_core.js` はFESのコア機能とその他の雑多な機能を含んでいます。
* `_validateParameters()` は `validate_params.js` 内にあり、パラメータ検証に関連する他のコードと一緒になっています。
* `_friendlyFileLoadError()` は `file_errors.js` 内にあり、ファイルロードエラーを扱う他のコードと一緒になっています。
* さらに、`stacktrace.js` というファイルがあり、エラースタックトレースを解析するコードが含まれています。これは https://github.com/stacktracejs/stacktrace.js から来ています。

以下のセクションでは、FES関数の完全なリファレンスを紹介します。

## FES関数：リファレンス

### `_report()`
##### 説明
`_report()` は、エラーヘルパーメッセージの出力をコンソールに直接印刷する主要な関数です。
`_fesLogger` が設定されている場合（つまり、テストを実行している場合）、`_report` は console.log の代わりに `_fesLogger` を呼び出します。
##### 语法
```javascript
_report(message)
```
```javascript
_report(message, func)
```
```javascript
_report(message, func, color)
```
##### 引数
```
@param  {String}        message   出力するメッセージ
@param  {String}        [func]    関数名
@param  {Number|String} [color]   [color] CSSカラーコード
```
##### 位置
core/friendly_errors/fes_core.js


### `_friendlyError()`
##### 場所
core/friendly_errors/fes_core.js

### `_friendlyError()`
##### 説明
`_friendlyError()` は、フレンドリーなエラーメッセージを作成し、出力します。任意のp5関数からこの関数を呼び出して、フレンドリーなエラーメッセージを提供することができます。

実装された関数：
* `core/friendly_errors/fes_core/fesErrorMonitor()`
* `core/friendly_errors/fes_core/checkForUserDefinedFunctions()`
* `core/friendly_errors/fes_core/handleMisspelling()`
* `core/friendly_errors/fes_core/processStack()`
* `core/friendly_errors/file_errors`
* `core/friendly_errors/sketch_reader`
* `core/friendly_errors/validate_params/_friendlyParamError()`
* `core/main/_createFriendlyGlobalFunctionBinder()`
* `core/shape/vertex`
* `math/p5.Vector`

`_friendlyError`の呼び出し順序は以下の通りです：
```
_friendlyError
  _report
```


##### 構文
```javascript
_friendlyError(message)
```
```javascript
_friendlyError(message, func)
```
```javascript
_friendlyError(message, func, color)
```
##### 引数
```
@param  {String}        message   出力するメッセージ
@param  {String}        [func]    関数名
@param  {Number|String} [color]   [color] CSSカラーコード
```
##### 位置
core/friendly_errors/fes_core.js

### `_friendlyFileLoadError()`
##### 説明
ファイルの読み込み中にエラーが発生した場合、`_friendlyFileLoadError()`は`loadX()`関数によって呼び出されます。

キー`fes.fileLoadError.*`を使用して、フレンドリーなエラーメッセージを生成し、出力します。

ファイルの読み込みに失敗した場合、この関数はフレンドリーなエラーメッセージを生成して表示します。また、ファイルが大きすぎて読み込めない場合には、警告を生成してチェックします。

現在のバージョンでは、`image`、`XML`、`table`、`text`、`json`、`font`ファイル用のエラーメッセージテンプレートが含まれています。

実装された関数：
* `image/loading_displaying/loadImage()`
* `io/files/loadFont()`
* `io/files/loadTable()`
* `io/files/loadJSON()`
* `io/files/loadStrings()`
* `io/files/loadXML()`
* `io/files/loadBytes()`。

`_friendlyFileLoadError`の呼び出し順序は以下の通りです：
```
_friendlyFileLoadError
  _report
```
##### 構文
```javascript
_friendlyFileLoadError(errorType, filePath)
```
##### 引数
```
@param  {Number}  errorType   ファイル読み込みエラータイプの数値
@param  {String}  filePath    エラーの原因となったファイルパス
```
##### 例
<ins>ファイル読み込みエラーの例</ins>
```javascript
/// missing font file
let myFont;
function preload() {
  myFont = loadFont('assets/OpenSans-Regular.ttf');
};
function setup() {
  fill('#ED225D');
  textFont(myFont);
  textSize(36);
  text('p5*js', 10, 50);
};
function draw() {};
```
FESはコンソールに次のメッセージを生成します：
> 🌸 p5.jsが言っています: フォントファイルの読み込み中に問題が発生したようです。ファイルパス [assets/OpenSans-Regular.ttf] が正しいか確認し、フォントファイルをオンラインサーバーにホストするか、またはローカルサーバーを実行してみてください。[https://github.com/processing/p5.js/wiki/Local-server]

##### 位置
core/friendly_errors/file_errors.js

### `validateParameters()`
##### 説明
`validateParameters()`は、入力パラメータを関数のインラインドキュメントから作成された`docs/reference/data.json`の情報と照合することにより、パラメータの検証を行います。それは関数呼び出しが正しい数とタイプのパラメータを含んでいるかどうかをチェックします。

キー`fes.friendlyParamError.*`を使用して、フレンドリーなエラーメッセージを生成し、出力します。

この関数は、`p5._validateParameters(FUNCT_NAME, ARGUMENTS)`またはパラメータ検証が必要な関数内部で`p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)`を使用して呼び出すことができます。一般的なケースでは静的バージョンの`p5._validateParameters`の使用が推奨されます。`p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)`は、主にデバッグと単体テストのために使用されます。

以下の関数で実装されています：
* `accessibility/outputs`
* `color/creating_reading`
* `color/setting`
* `core/environment`
* `core/rendering`
* `core/shape/2d_primitives`
* `core/shape/attributes`
* `core/shape/curves`
* `core/shape/vertex`
* `core/transform`
* `data/p5.TypedDict`
* `dom/dom`
* `events/acceleration`
* `events/keyboard`
* `image/image`
* `image/loading_displaying`
* `image/p5.Image`
* `image/pixel`
* `io/files`
* `math/calculation`
* `math/random`
* `typography/attributes`
* `typography/loading_displaying`
* `utilities/string_functions`
* `webgl/3d_primitives`
* `webgl/interaction`
* `webgl/light`
* `webgl/loading`
* `webgl/material`
* `webgl/p5.Camera`

`_validateParameters`の呼び出し順序は大まかに以下の通りです：
```
validateParameters
   buildArgTypeCache
      addType
    lookupParamDoc
    scoreOverload
      testParamTypes
      testParamType
    getOverloadErrors
    _friendlyParamError
      ValidationError
      report
        friendlyWelcome
```
##### 文法
```javascript
_validateParameters(func, args)
```
##### 引数
```
@param  {String}  func    関数名
@param  {Array}   args    ユーザー入力パラメータ
```
##### 例
<ins>欠落パラメータの例</ins>
```javascript
arc(1, 1, 10.5, 10);
```
FESはコンソールに以下のメッセージを生成します：
> 🌸 p5.jsが言うには、arc()は位置#4（ゼロベースのインデックス）で空の変数を受け取ったようです。これが意図的でない場合、通常はスコープの問題です：[https://p5js.org/examples/data-variable-scope.html]。[https://p5js.org/reference/#p5/arc]

> 🌸 p5.jsが言うには、arc()は位置#5（ゼロベースのインデックス）で空の変数を受け取ったようです。これが意図的でない場合、通常はスコープの問題です：[https://p5js.org/examples/data-variable-scope.html]。[https://p5js.org/reference/#p5/arc]

<ins>型の不一致の例</ins>
```javascript
arc('1', 1, 10.5, 10, 0, Math.PI, 'pie');
```
FESはコンソールに以下のメッセージを生成します：
> 🌸 p5.jsが言うには、arc()はパラメータ#0（ゼロベースのインデックス）でNumberを期待していましたが、文字列を受け取りました。[https://p5js.org/reference/p5/arc]
##### 位置
core/friendly_errors/validate_params.js

### `fesErrorMonitor()`
##### 説明
`fesErrorMonitor()`は、ブラウザに表示されるさまざまなエラーを処理します。この関数は、グローバルエラーメッセージを生成します。

生成して表示します...
* ...フレンドリーなエラーメッセージ、キーを使用して：`fes.globalErrors.syntax.*`、`fes.globalErrors.reference.*`、`fes.globalErrors.type.*`。
* ...`processStack()`によって生成された「内部ライブラリ」エラーメッセージ、キーを使用して：`fes.wrongPreload`、`fes.libraryError`。
* ...`printFriendlyStack()`によって生成されたスタックトレースメッセージ、キーを使用して：`fes.globalErrors.stackTop`、`fes.globalErrors.stackSubseq`。
* ...`handleMisspelling()`によって生成されたスペルチェックメッセージ（参照エラーから）、キーを使用して：`fes.misspelling`。

エラーイベント、未処理のリジェクトイベントで`_fesErrorMonitor()`を呼び出すことができますし、次のように`catch`ブロック内で手動で呼び出すこともできます：
```
try { someCode(); } catch(err) { p5._fesErrorMonitor(err); }
```

この関数は現在、特定のタイプの ReferenceError、SyntaxError、TypeError を処理します。 サポートされているエラーの完全なリストは「browser_errors.js」で見つけることができます。

`_fesErrorMonitor`呼び出しシーケンスは大まかに次のとおりです：
```
 _fesErrorMonitor
     processStack
       printFriendlyError
     （エラーの種類が ReferenceError の場合）
       _handleMisspelling
         computeEditDistance
         _report
       _report
       printFriendlyStack
     （エラーの種類が SyntaxError、TypeError などの場合。）
       _report
       printFriendlyStack
```
##### 文法
```javascript
fesErrorMonitor(event)
```
##### パラメータ
```
@param {*}  e     エラーイベント
```
### 例
<ins>内部エラーの例 1</ins>
```javascript
function preload() {
  // プリロードでのbackground()の呼び出しにより発生します。
  // 間違い
  background(200);
}
```
FES将在控制台中生成以下消息：
> 🌸 p5.jsが言うには、backgroundを呼び出したとき（sketch.jsの4行目[http://localhost:8000/lib/empty-example/sketch.js:4:3]）、p5jsライブラリ内部でエラーが発生しました。エラーメッセージは「未定義のプロパティ'background'を読み取れません」です。（特に説明がない限り、これはpreloadからbackgroundが呼び出されたためかもしれません。preload関数内にはload関数（loadImage、loadJSON、loadFont、loadStringsなど）以外は含まれていないべきです。）（https://p5js.org/reference/p5/preload）

<ins>内部エラーの例 2</ins>
```javascript
function setup() {
  cnv = createCanvas(200, 200);
  cnv.mouseClicked();
}
```
FES将在控制台中生成以下消息：
> 🌸 p5.jsが言うには、mouseClickedを呼び出したとき（sketch.jsの3行目[http://localhost:8000/lib/empty-example/sketch.js:3:7]）、p5jsライブラリ内部でエラーが発生しました。エラーメッセージは「未定義のプロパティ'bind'を読み取れません」です。（特に説明がない限り、これはmouseClickedへの引数に問題がある可能性があります。）（https://p5js.org/reference/p5/mouseClicked）

<ins>ユーザー例のスコープエラーの例</ins>
```javascript
function setup() {
  let b = 1;
}
function draw() {
  b += 1;
}
```
> 🌸 p5.jsが言うには、「b」が現在のスコープ内で定義されていないため、エラーが発生しました（sketch.jsの5行目[http://localhost:8000/lib/empty-example/sketch.js:5:3]）。コード内で定義している場合は、そのスコープ、綴り、大文字と小文字を確認してください（JavaScriptは大文字と小文字を区別します）。さらに情報：https://p5js.org/examples/data-variable-scope.html https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_Defined#What_went_wrong

<ins>ユーザー例のタイプミスの例</ins>
```javascript
function setup() {
  colour(1, 2, 3);
}
```
FESはコンソールに以下のメッセージを生成します：
> 🌸 p5.jsが言うには、「colour」を誤って「color」と書いてしまった可能性があります（sketch.jsの2行目[http://localhost:8000/lib/empty-example/sketch.js:2:3]）。p5.jsの関数を使用する場合は、それをcolorに修正してください（https://p5js.org/reference/p5/color）。

##### 位置
core/friendly_errors/fes_core.js

### `fesCodeReader()`
##### 説明
`fesCodeReader()`関数は、以下の状況をチェックするために使用されます：(1) `setup()`や`draw()`関数の外でp5.jsの定数や関数が使用されているかどうか、および (2) p5.jsの予約された定数や関数が再宣言されているかどうか。

`fes.sketchReaderErrors.reservedConst`、`fes.sketchReaderErrors.reservedFunc`のエラータイプで、フレンドリーなエラーメッセージを生成して表示します。

`setup()`および`draw()`関数内で以下の操作を実行します：
* ユーザーが書いたコードを抽出する
* コードをコード行の配列に変換する
* 変数や関数の宣言をキャッチする
* 宣言された関数/変数がp5.jsの予約された定数や関数であるかどうかをチェックし、報告する。

この関数は`load`イベントが発生した時に実行されます。

##### 例
<ins>p5.j​​sの保持定数を再定義する例</ins>
```javascript
function setup() {
  // PI は p5.js の予約定数です
  let PI = 100;
}
```
FESはコンソールに以下のメッセージを生成します：
> 🌸 p5.jsのヒント：p5.jsの予約された変数「PI」を使用しています。変数名を他の名前に変更してください。(https://p5js.org/reference/p5/PI)

<ins>p5.j​​sの予約関数の再定義例</ins>
```javascript
function setup() {
  // text は p5.js の予約関数です
  let text = 100;
}
```
FESはコンソールに以下のメッセージを生成します：
> 🌸 p5.jsのヒント：p5.jsの予約された関数「text」を使用しています。関数名を他の名前に変更してください。


##### 位置
core/friendly_errors/sketch_reader.js

### `checkForUserDefinedFunctions()`
##### 説明
`checkForUserDefinedFunctions()` 関数は、ユーザー定義関数 (`setup()`、`draw()`、`mouseMoved()` など) の呼び出しに間違った大文字小文字が使用されているかどうかをチェックするために使用されます。

`fes.checkUserDefinedFns` タイプのわかりやすいエラー メッセージを生成して出力します。

##### 文法
```javascript
checkForUserDefinedFunctions(context)
```
##### 引数
```
@param {*} context  現在のデフォルトのコンテキスト。
                   「グローバル モード」ではウィンドウに設定し、「インスタンス モード」では p5 インスタンスに設定します。
```
##### 例
```javascript
function preLoad() {
  loadImage('myimage.png');
}
```
FESはコンソールに以下のメッセージを生成します：
> 🌸 p5.jsのヒント：preLoadと書くべきところをpreloadと誤って書いているようです。これが意図していない場合は、訂正してください。(https://p5js.org/reference/p5/preload)

##### 位置
core/friendly_errors/fes_core.js

### `_friendlyAutoplayError()`
##### 説明
`_friendlyAutoplayError()`は、メディア（例えばビデオ）の再生に関連するエラーが発生した時に内部的に呼び出される関数で、最も一般的な原因はブラウザの自動再生ポリシーです。

`fes.autoplay`のエラータイプで、フレンドリーなエラーメッセージを生成して表示します。
##### 位置
core/friendly_errors/fes_core.js


### `helpForMisusedAtTopLevelCode()`
##### 説明
`helpForMisusedAtTopLevelCode()`は、`fes_core.js`によってウィンドウのロード時に呼び出される関数で、`setup()`や`draw()`の外でp5.jsの関数が使用されているかどうかをチェックします。

`fes.misusedTopLevel`のエラータイプで、フレンドリーなエラーメッセージを生成して表示します。
##### 引数
```
@param {*}        err    エラーイベント
@param {Boolean}  log    false
```
##### 位置
core/friendly_errors/fes_core.js

## 開発者向けメモ：開発者のコメント
#### フレンドリーなエラーメッセージを生成する他のFES関数
* `friendlyWelcome()` は直接コンソールに出力されます。（デフォルトでは隠されています。）

* `stacktrace.js` は、エラースタックを解析するために https://github.com/stacktracejs/stacktrace.js から借用したコードを含んでいます。これは、`fesErrorMonitor()` および `handleMisspelling()` から呼び出されます。

#### パラメータ検証のためのp5.jsオブジェクトの準備
* パラメータ検証に使用される任意のp5.jsオブジェクトは、クラス宣言内で `name` パラメータ（オブジェクトの名前）に値を割り当てる必要があります。例えば：

```javascript
p5.newObject = function(parameter) {
   this.parameter = 'some parameter';
   this.name = 'p5.newObject';
};
```
* インラインドキュメント：許可されるパラメータタイプには`Boolean`、`Number`、`String`、およびオブジェクトの名前が含まれます（上記の箇条書きを参照）。任意の配列パラメータには`Array`を使用してください。必要に応じて、説明部分で許可される特定のタイプの配列パラメータ（例：`Number[]`、`String[]`）を解説できます。
* 現在サポートされているクラスタイプ（それぞれの`name`パラメータを持つ）：`p5.Color`、`p5.Element`、`p5.Graphics`、`p5.Renderer`、`p5.Renderer2D`、`p5.Image`、`p5.Table`、`p5.TableRow`、`p5.XML`、`p5.Vector`、`p5.Font`、`p5.Geometry`、`p5.Matrix`、`p5.RendererGL`。

#### FESのパフォーマンス問題

デフォルトでは、p5.jsはFESを有効にしていますが、`p5.min.js`ではFESを無効にしています。これは、FES関数がプロセスを遅くする可能性があるためです。エラーチェックシステムはコードの実行速度を大幅に低下させる可能性があります（場合によっては約10倍まで）。[フレンドリーエラーパフォーマンステスト](https://github.com/processing/p5.js-website/tree/main/src/assets/learn/performance/code/friendly-error-system/)をご覧ください。

この機能を無効にするには、コードの先頭に次の行を追加します：


```javascript
p5.disableFriendlyErrors = true; // FESを無効にする

function setup() {
  // セットアップ操作を実行する
}

function draw() {
  // 描画操作を実行する
}
```

注意してください、これによりFESの一部（例えばパラメータチェックなど）が無効になり、パフォーマンスの低下を引き起こします。ファイルの読み込みに失敗したときに説明的なエラーを出す、またはグローバルスペースでp5.jsの関数を上書きしようとしたときに警告を発するなど、パフォーマンスのコストなしにフレンドリーなエラーはそのまま保持されます。

## 既知の制限

* FESはまだ偽陰性の状況を引き起こす可能性があります。これは通常、設計と実際の使用状況の間の不一致によって引き起こされます（例えば、描画関数は2Dおよび3D設定で交換可能に使用できるように最初に設計されましたが）、例えば：
```javascript

const x3; // 未定義
line(0, 0, 100, 100, x3, Math.PI);
```
* 由于 `line()` のインラインドキュメント内に2D設定で描画するための受け入れ可能なパラメータパターン（`Number`、`Number`、`Number`、`Number`）が含まれているため、FESの検出を逃れることがあります。これは、現在のバージョンのFESが `_renderer.isP3D` などの環境変数をチェックしないことを意味します。

* FESは、`const` または `var` で宣言されたときにオーバーライドされるグローバル変数のみを検出できます。`let`を使用した場合は検出できません。`let`が変数をインスタンス化する方法により、この問題を現在解決する方法はありません。

* 現在、**`fesErrorMonitor()`** の下で記述されている機能は、Webエディター上またはローカルサーバー上で実行されている場合にのみ機能します。詳細は、プルリクエスト[#4730](https://github.com/processing/p5.js/pull/4730)を参照してください。

* `sketch_reader()`は、ユーザーコードから変数/関数名を抽出する際に、すべてのコードが一行に書かれている場合など、一部のケースを見逃す可能性があります。

## 今後の作業のための考察
* Webエディターにカラーコーディングを再導入する。

* より包括的なテストカバレッジを実現するために、さらに多くの単体テストを追加する。

* より直感的で正確な出力情報を提供する。

* 使用されるすべての色は色覚異常に優しいものであるべきです。

* より多くの一般的なエラータイプを識別し、FESで一般化する（例：`bezierVertex()`、`quadraticVertex()` - 初期化されていないオブジェクトが開始されていない；`nf()`、`nfc()`、`nfp()`、`nfs()`のNumberパラメータが正であるかどうかをチェックする）。

* グローバルエラーキャプチャを拡張する。これは、ブラウザがコンソールに出力するエラーをキャプチャし、フレンドリーメッセージと照合することを意味します。`fesErrorMonitor()`は特定のタイプのエラーを処理できますが、より多くのタイプのサポートは役立ちます。

* `sketch_reader.js`のコードの読み取りと変数/関数名の抽出機能を改善する（コード内で宣言された関数と変数名を抽出する）。例えば、すべてのコードが一行に書かれている場合、`sketch_reader.js`は正しく変数/関数名を抽出できません。これらの"逃げ"ケースをすべて識別し、それらをキャッチするための単体テストを追加するための将来の提案を歓迎します。

* `sketch_reader.js`は拡張可能で、新しい機能を追加することができます（例：ユーザーが`draw()`関数内で変数を宣言したときに警告を発する）。ユーザーをよりよく支援するためです。
```javascript
// 这段代码片段使用新函数包装了 window.console 方法，以修改其功能
// 目前尚未实现，但可以使用它来提供更好格式的错误消息
const original = window.console;
const original_functions = {
    log: original.log,
    warn: original.warn,
    error: original.error
}
["log", "warn", "error"].forEach(function(func){
    window.console[func] = function(msg) {
      // 在包装函数中处理捕获的消息，然后调用原始函数
      original_functions[func].apply(original, arguments)
    };
});
```
* インラインドキュメントからFESリファレンスドキュメントを生成します。この生成されたリファレンスドキュメントは、スケッチとコンソールの関数を分離するため、メインの[p5.jsリファレンスドキュメント]から分離された別のシステムとして機能し、混乱の可能性を減らします。

[p5.jsリファレンスドキュメント]: https://p5js.org/reference/