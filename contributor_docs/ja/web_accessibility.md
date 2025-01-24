# p5.js のウェブアクセシビリティ

このドキュメントは、p5.js のウェブアクセシビリティ機能の構造を説明し、貢献者、メンテナー、およびその他の関係者が使用するためのものです。画面リーダーで作品をアクセシブルにすることに興味がある場合は、[チュートリアル](https://p5js.org/tutorials)，を参照してください。または、画面リーダーで p5.js を使用する場合は、[画面リーダー用の p5.js チュートリアル](https://p5js.org/learn/p5-screen-reader.html)をご覧ください。

## 概要

キャンバス HTML 要素はビットマップであり、その上に描画された形状に関するスクリーンリーダーへのアクセシブルな情報を提供することができないため、p5.js は画面リーダーにキャンバスをよりアクセシブルにするいくつかの関数を提供しています。

現在、p5.js は、基本的な形状の画面リーダーへのアクセシブルな出力を生成するサポート（`textOutput()` および `gridOutput()` を使用）と、ユーザー生成のキャンバスコンテンツの画面リーダーへのアクセシブルな説明（`describe()` および `describeElement()` を使用）を提供しています。

## 基本形状のライブラリ生成のアクセシブルな出力

基本形状のサポートされるアクセシブルな出力には、テキスト出力とグリッド出力が含まれます。

`textOutput()`  は、キャンバス上の形状に関するスクリーンリーダーへのアクセシブルな出力を作成します。キャンバスの一般的な説明には、キャンバスのサイズ、キャンバスの色、およびキャンバス内の要素の数（例："あなたの出力は、以下の 4 つの形状を含む 400x400 ピクセルの青いキャンバスです："）が含まれます。この説明の後には、各形状の色、位置、面積（例："左上隅のオレンジ色の楕円、キャンバスの 1% をカバー"）が記載された形状のリストが続きます。各要素を選択して、より詳細な情報を得ることができます。また、形状、色、位置、座標、面積（例："オレンジ色の楕円、位置：左上隅、面積：2"）が記載された要素のテーブルも提供されます。

`gridOutput()` は、各形状の空間位置に基づいて、キャンバスのコンテンツをグリッド（HTMLテーブル）の形式でレイアウトします。テーブル出力の前に、キャンバスの簡単な説明が提供されます。この説明には、背景色、キャンバスのサイズ、オブジェクトの数とオブジェクトのタイプが含まれます（例："淡い紫色のキャンバスは 200x200 のサイズで、4つのオブジェクト - 3つの楕円と1つの四角形を含んでいます"）。グリッドは空間的にコンテンツを記述し、各要素はその位置に応じてテーブルのセルに配置されます。各セル内では、要素の色と形状タイプが提供されます（例："オレンジ色の楕円"）。これらの説明は個別に選択して、さらに詳細を得ることができます。また、形状、色、位置、面積を記述した要素リストも提供されます（例："オレンジ色の楕円 位置=左上隅 面積=1%"）。

上記のいずれかの関数に `LABEL` として引数が渡されると、キャンバスに隣接する出力を含む追加の div が作成されます。これは、出力をキャンバスの子 DOM の外に表示したいと考えている画面リーダー以外のユーザーにとって便利です。しかし、画面リーダーユーザーにとっては、`LABEL` の使用は不要な冗長性を引き起こします。`LABEL` は開発プロセス中にのみ使用し、公開する前や画面リーダーユーザーとドラフトを共有する前に削除することをお勧めします。

### 出力構造
textOutput() と gridOutput() は [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) に位置していますが、出力はライブラリ全体に分散している複数の関数によって作成および更新されます。このセクションでは、サポートされている異なる関数について詳しく説明します。

#### outputs.js n
[src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) には、アクセシブルな出力を作成するためのコア関数が含まれています：
* `textOutput()`：この関数は、this._accessibleOutputs.text を true に設定し、`_createOutput('textOutput', 'Fallback')` を呼び出すことで、テキスト出力をアクティブにします。`LABEL` が引数として渡された場合、関数はさらに `this._accessibleOutputs.textLabel` を `true` に設定し、ラベルのために `_createOutput('textOutput', 'Label')` を呼び出すことで、テキスト出力ラベルをアクティブにします。
* `gridOutput()`：この関数は、`this._accessibleOutputs.grid` を `true` に設定し、`_createOutput('gridOutput', 'Fallback')` を呼び出すことで、グリッド出力をアクティブにします。`LABEL` が引数として渡された場合、関数はさらに `this._accessibleOutputs.textLabel` を `true` に設定し、ラベルのために `_createOutput('gridOutput', 'Label')` を呼び出すことで、グリッド出力ラベルをアクティブにします。
* `_createOutput()`：この関数は、すべてのアクセシブルな出力の HTML 構造を作成します。出力のタイプと表示方法に応じて、作成される HTML 構造は異なります。この関数はまた、形状、色、および pShapes（以前の形状の文字列が格納されている）など、すべての出力のデータが格納された `this.ingredients` を初期化します。`this.dummyDOM` が存在しない場合、それも作成します。`this.dummyDOM` には、`<body>` 内の DOM 要素の HTML コレクションが格納されます。
* `_updateAccsOutput()`：accessibleOutputs を使用している場合、`setup()` および `draw()` の終了時にこの関数が呼び出されます。`this.ingredients` が現在の出力と異なる場合、この関数は出力の更新関数（`_updateGridOutput` および `_updateTextOutput`）を呼び出します。`setup()` および `draw()` の終了時にのみこの関数を呼び出し、_updateGridOutput および _updateTextOutput は成分が異なる場合にのみ呼び出されます。これは、スクリーンリーダーに過度の負荷をかけないようにするためです。
* `_addAccsOutput()`：accessibleOutputs が true の場合、この関数は true を返します。
* `_accsBackground()`：`background()` の終了時にこの関数が呼び出されます。これは `this.ingredients.shapes` をリセットし、背景色が以前と異なる場合、`_rgbColorName()` を呼び出して色の名前を取得し、それを `this.ingredients.colors.background` に格納します。
* `_accsCanvasColors()`：`fill()` および `stroke()` の終了時にこの関数が呼び出されます。この関数は、塗りつぶしと線の色を `this.ingredients.colors.fill` および `this.ingredients.colors.stroke` に保存することで、塗りつぶしと線の色を更新します。また、色の名前を取得するために `_rgbColorName()` を呼び出します。
* `_accsOutput()`：出力の作成に使用されるすべての形状を含む `this.ingredients.shapes` を構築します。この関数は、基本形状関数の終了時に呼び出されます（accessible output beyond src/accessibility 参照）。それを呼び出した形状に応じて、`_accsOutput()` は、出力の作成に使用されるその形状に関するすべての情報を収集するための補助関数を呼び出すことがあります。これらの補助関数はプロトタイプの一部ではなく、次のようなものが含まれます：
 * `_getMiddle()`：矩形、弧、楕円、三角形、四角形の中心点または重心を返します。
 * `_getPos()`：形状がキャンバス上にある位置を返します（例：「左上隅」、「右中」）。
 * `_canvasLocator()`：形状がキャンバスの 10*10 グリッドにマッピングされた位置を返します。
 * `_getArea()`：形状の面積がキャンバスの全面積のパーセンテージとして返されます。

`this._accessibleOutputs.text` または `this._accessibleOutputs.grid` が `true` の場合、p5.js ライブラリ内の複数の関数が output.js 内の関数を呼び出します：
* `_accsOutput()` は以下の関数で呼び出されます：
  * `p5.prototype.triangle()`
  * `p5.prototype._renderRect()`
  * `p5.prototype.quad()`
  * `pp5.prototype.point()`
  * `p5.prototype.line()`
  * `p5.prototype._renderEllipse()`
  * `p5.prototype.arc()`
* `_updateAccsOutput()`  は以下の関数で呼び出されます：
  * `p5.prototype.redraw()`
  * `p5.prototype.resizeCanvas()`
  * `this._setup`
* `_accsCanvasColors()`  は以下の関数で呼び出されます：
  * `p5.Renderer2D.prototype.stroke()`
  * `p5.Renderer2D.prototype.fill()`
* `_accsBackground()`  は以下の関数で呼び出されます：
  * `p5.Renderer2D.prototype.background()`

#### textOutput.js
[src/accessibility/textOutput.js](https://github.com/processing/p5.js/blob/main/src/accessibility/textOutput.js) には、テキスト出力を更新するためのすべての関数が含まれています。このファイル内の主な関数は `_updateTextOutput()` で、これは [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 内の `_updateAccsOutput()` によって呼び出され、`this._accessibleOutputs.text` または `this._accessibleOutputs.textLabel` が true の場合に呼び出されます。

`_updateTextOutput()` は `this.ingredients` を使用して、テキスト出力およびテキスト出力ラベルの内容を構築します。これには、要約、形状リスト、および形状詳細テーブルが含まれます。これらの内容が現在の出力と異なる場合、それらを更新します。出力コンテンツの構築は、ファイル内のいくつかの補助関数によってサポートされています。これらの関数はプロトタイプの一部ではありません：
* `_textSummary()`: テキスト出力の要約の内容を構築します。
* `_shapeDetails()`: 形状の詳細を含むテキスト出力テーブルを構築します。
* `_shapeList()`: テキスト出力の形状リストを構築します。

#### gridOutput.js
[src/accessibility/gridOutput.js](https://github.com/processing/p5.js/blob/main/src/accessibility/gridOutput.js) には、グリッド出力を更新するためのすべての関数が含まれています。このファイル内の主な関数は `_updateGridOutput()` で、これは  [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 内の `_updateAccsOutput()` によって呼び出され、`this._accessibleOutputs.grid` または `this._accessibleOutputs.gridLabel` が `true` の場合に呼び出されます。

`_updateGridOutput()` は `this.ingredients` を使用して、グリッド出力およびグリッド出力ラベルの内容を構築します。これには、要約、形状の位置をマッピングするグリッド、および形状リストが含まれます。これらの内容が現在の出力と異なる場合、それらを更新します。出力コンテンツの構築は、ファイル内のいくつかの補助関数によってサポートされています。これらの関数はプロトタイプの一部ではありません：
* `_gridSummary()`: グリッド出力の要約の内容を構築します。
* `_gridMap()`: キャンバス上の形状の位置をマッピングするグリッドを構築します。
* `_gridShapeDetails()`: グリッド出力の形状リストを構築します。リストの各行には形状の詳細情報が含まれます。

#### color_namer.js     222222222222222222222222222222222222222222222222222222
スクリーンリーダーへのアクセシブルな出力を作成する際には、キャンバスで使用される色を命名することが重要です。[src/accessibility/color_namer.js](https://github.com/processing/p5.js/blob/main/src/accessibility/color_namer.js) には、RGBA 値を受け取り色の名前を返す `_rgbColorName()` 関数が含まれています。この関数は、[src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 内の `_accsBackground()` および `_accsCanvasColors()` によって呼び出されます。

`_rgbColorName()` は `color_conversion._rgbaToHSBA()` を使用して色の HSV 値を取得し、その後 `_calculateColor()` を使用して色の名前を取得します。このファイル内の `_calculateColor()` 関数は [colorNamer.js](https://github.com/MathuraMG/color-namer) から来ており、これは [2018 年 Processing Foundation fellowship](https://medium.com/processing-foundation/making-p5-js-accessible-e2ce366e05a0) の一環として、および盲目のスクリーンリーダー専門家ユーザーと協力して開発されました。この関数は、HSV 値を `colorLookUp` 配列に格納された値と比較して色の名前を返します。この関数は、いくつかのグレーの色合いが正しく命名されていないため、更新される必要があります。更新する際には、各行のコードを説明するコメントを含めることで、貢献者の可読性を確保することも重要です。

## ユーザー生成のアクセシブルなキャンバス説明

### describe()
`describe()` 関数は、キャンバスのスクリーンリーダーへのアクセシブルな説明を作成します。最初の引数はキャンバスを説明する文字列であるべきです。2番目の引数はオプションです。指定された場合、説明の表示方法を決定します。すべての説明はキャンバス要素の子 DOM の一部になります。ユーザーが2番目の引数として `LABEL` を設定した場合、キャンバスに隣接する追加の説明 `<div>` が作成されます。

`_descriptionText()`: テキストが `LABEL` または `FALLBACK` でないことを確認し、テキストが句読点で終わっていることを確認します。テキストが '.'、','、';'、'?'、'!' で終わっていない場合、この関数は文字列の末尾に '.' を追加します。テキストを返します。
describe() は [src/accessibility/describe.js](https://github.com/processing/p5.js/blob/main/src/accessibility/describe.js) 内の複数の関数によってサポートされています：
* `_descriptionText()`: 检查文本不是 `LABEL` 或 `FALLBACK`，并确保文本以标点符号结尾。如果文本不以 '.'、','、';'、'?'、'!' 结尾，则该函数在字符串末尾添加一个 '.'。返回文本。
* `_describeHTML()`: キャンバスの代替 HTML 構造を作成します。`describe()` の2番目の引数が `LABEL` である場合、この関数は説明テキストを表示するためにキャンバス要素に隣接する `<div>` を作成します。

### describeElement()
`describeElement()` 関数は、描画要素または共通の意味を持つ一連の形状に対するスクリーンリーダーへのアクセシブルな説明を作成します。最初の引数は要素の名前文字列であり、2番目の引数は要素の説明文字列であるべきです。3番目の引数はオプションです。指定された場合、説明の表示方法を決定します。すべての要素の説明はキャンバス要素の子 DOM の一部になります。ユーザーが3番目の引数として `LABEL` を設定した場合、キャンバスに隣接する追加の要素説明 `<div>` が作成されます。

`describeElement()` は [src/accessibility/describe.js](https://github.com/processing/p5.js/blob/main/src/accessibility/describe.js) 内の複数の関数によってサポートされています：
* `_elementName()`: 要素名が `LABEL` または `FALLBACK` でないことを確認し、テキストがコロンで終わることを確認します。要素名を返します。
* `_descriptionText()`: テキストが `LABEL` または `FALLBACK` でないことを確認し、テキストが句読点で終わっていることを確認します。テキストが '.'、','、';'、'?'、'!' で終わっていない場合、この関数は文字列の末尾に '.' を追加します。テキストを返します。
* `_describeElementHTML()`: キャンバスの代替 HTML 構造を作成します。`describeElement()` の3番目の引数が `LABEL` である場合、この関数は説明テキストを表示するためにキャンバス要素に隣接する `<div>` を作成します。
