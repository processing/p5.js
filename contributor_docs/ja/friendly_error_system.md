# 🌸 p5.jsフレンドリーエラーシステム（FES）

## 概要

フレンドリーエラーシステム（FES、🌸）は、シンプルで親しみやすいエラーメッセージを提供することで、初心者プログラマーを支援することを目的としています。エラーメッセージに代替の説明や有用な参考リンクを追加することで、ブラウザのコンソールに表示されるエラーメッセージを補完します。

FESはコンソールウィンドウにメッセージを表示し、[p5.js Web Editor]およびブラウザのJavaScriptコンソールで確認できます。圧縮された単一のファイル版のp5（p5.min.js）にはFESは含まれていません。

[p5.js Web Editor]: https://editor.p5js.org/

## デバッグの障壁を低減
ツールの設計は、それを使用する人々のニーズに合わせるべきです。デバッグの障壁を低減することを目指しているFESの設計も例外ではありません。

私たちの既存の設計を評価する最良の方法は、p5.jsを使用している人々から直接意見を聞くことです。2021年には、フレンドリーエラーに関するフィードバックと将来の期待を収集するために、コミュニティアンケートを実施しました。

コミュニティメンバーからの洞察は、私たちの貢献者にとって有益であると信じています。結果は、要約漫画または完全な報告書で確認できます：
* [21-22 FES調査報告漫画]
* [21-22 FES調査完全報告]


[21-22 FES調査報告漫画]: https://almchung.github.io/p5jsFESsurvey/
[21-22 FES調査完全報告]: https://observablehq.com/@almchung/p5-fes-21-survey

## フレンドリーエラーメッセージの作成

エラーメッセージの作成や翻訳によって、p5.jsライブラリへの貢献はどのように行われますか？

FESはp5.jsの[国際化]作業の一部です。すべてのFESメッセージの内容は、[i18next]に基づく`translator()`関数を通じて生成されます。この動的なエラーメッセージ生成は、p5.jsのデフォルト言語である英語を含むすべての言語に適用されます。

世界中からの貢献を歓迎します！🌐

[国際化]: https://github.com/processing/p5.js/blob/main/contributor_docs/internationalization.md
[i18next]: https://www.i18next.com/


#### ベストプラクティスの作成

FESメッセージ作成者は、エラーメッセージを理解する障壁を低減し、デバッグプロセスのアクセシビリティを向上させることを優先すべきです。

[Friendly Errors i18n Book]では、異文化間のi18n環境におけるフレンドリーエラーメッセージの作成における挑戦とベストプラクティスについて議論されています。以下はその要点です：

* 対象を理解する：私たちのエラーメッセージの対象に関する仮定を持たないでください。私たちのライブラリを誰が、どのように使用しているかを理解しようとします。
* 言語の包括性を保つ。エラーメッセージを「フレンドリー」にする努力をしていますが、それはあなたにとって何を意味しますか？あなたの言語で可能性のある偏見や傷つける表現を探します。[p5.js行動規範]を守ってください。
* 単純な文章を心がける。文章をより小さなブロックに分割し、i18nextの[インターポレーション]機能を最大限に活用することを検討してください。
* 異文化間コミュニケーションを優先し、異なる言語間で素晴らしい体験を提供します。慣用句の使用を避けてください。
* 技術的な概念や用語を段階的に紹介します。技術的な文書作成の一貫性を保持します。初心者向けに書かれたシンプルな例を使用して外部リソースへのリンクを試みてください。

[Friendly Errors i18n Book]: https://almchung.github.io/p5-fes-i18n-book/
[インターポレーション]: https://www.i18next.com/translation-function/interpolation
[p5.js行動規範]: https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md#p5js-code-of-conduct
[エキスパートの盲点]: https://tilt.colostate.edu/TipsAndGuides/Tip/181

[Friendly Errors i18n Book]は、公開プロジェクトであり、この独立した[リポジトリ]を通じて本に貢献することができます。

[リポジトリ]: https://github.com/almchung/p5-fes-i18n-book
#### 翻訳ファイルの位置

`translator()`はi18nextに基づいており、`src/core/internationalization.js`からインポートされます。JSON翻訳ファイルからテキストデータを検索してメッセージを生成します：
```
translations/{{检测到的语言代码，默认为en}}/translation.json
```
例：
もし検出されたブラウザのロケールが韓国語（言語識別子：`ko`）である場合、`translator()`は`translations/ko/translation.json`から翻訳されたテキストブロックを読み込みます。その後、`translator()`はこれらのテキストブロックを組み合わせて最終的なメッセージを作成します。

言語識別子には、`es-PE`（ペルーのスペイン語）のように、地域情報も含めることができます。

#### 翻訳ファイルの構造
`translation.json`は[i18nextが使用するフォーマット](https://www.i18next.com/misc/json-format)に従っています。

翻訳ファイルの基本的なフォーマットは、波括弧`{}`内で二重引用符`""`で囲まれたキーと値（メッセージ）を使用することです：
```json
{ "key": "value" }
```
たとえば、次の形式で保存された ASCII フラグがあります。
```json
"logo": "    _ \n /\\| |/\\ \n \\ ` ' /  \n / , . \\  \n \\/|_|\\/ \n\n"
```
i18next は補間をサポートしているため、変数を渡してメッセージを動的に生成できます。 2 つの中括弧 `{{}}` を使用して、変数のプレースホルダーを設定します。
```json
"greeting": "你好，{{who}}！"
```
ここで、キーは「greeting」、変数名は「who」です。

このメッセージを動的に生成するには、値を渡す必要があります。
```javascript
translator('greeting', { who: 'everyone' } );
```
「translator」によって生成された結果は次のようになります。
```
こんにちは，everyone！
```

以下は「fes」の項目「fileLoadError」で、補間を示しています。
```json
"image": "看起来加载图像时出现问题。{{suggestion}}"
```
最終メッセージを動的に生成するために、FES はこのキーと事前に生成された `suggestion` 値を使用して `translator()` を呼び出します。
```javascript
translator('fes.fileLoadError.image', { suggestion });
```

[国際化ドキュメント]: https://github.com/processing/p5.js/blob/main/contributor_docs/internationalization.md


## FESの仕組みを理解する
このセクションでは、FESがメッセージを生成して表示する方法の概要を説明します。FES関数に関する詳細情報は、[FESリファレンス+開発ノート]を参照してください。

[FESリファレンス+開発ノート]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md


#### 概要
p5.jsは、様々な状況を処理するために、複数の場所からFESを呼び出します。これには以下のようなものが含まれます：
* ブラウザがエラーを発生させた場合。
* ユーザーコードがp5.js APIの関数を呼び出した場合。
* ヘルプメッセージから利益を得られるその他のカスタムケース。

#### FESコードの場所
FESのコアコンポーネントは以下の場所で見つけることができます：
`src/core/friendly_errors`。
`translator()`が使用する翻訳ファイルは以下の場所で見つけることができます：
`translations/`。

#### FESメッセージ生成器
これらの関数は、主にエラーをキャッチしてFESメッセージを生成する責任があります：
* [`_friendlyFileLoadError()`] はファイルロードエラーをキャッチします。
* [`_validateParameters()`] はp5.js関数の入力パラメータを内部ドキュメントに基づいてチェックします。
* [`_fesErrorMonitor()`] はグローバルエラーを処理します。

完全なリファレンスについては、[開発ノート] をご覧ください。

[`_friendlyFileLoadError()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#_friendlyfileloaderror
[`_validateParameters()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#validateparameters
[`_fesErrorMontitor()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#feserrormonitor
[開発ノート]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md


#### FESメッセージ表示
`fes_core.js/_friendlyError()` 生成されたわかりやすいエラー メッセージをコンソールに出力します。 例えば：

```javascript
p5._friendlyError(
  translator('fes.globalErrors.type.notfunc', translationObj)
);
```
この関数は p5 内のどこからでも呼び出すことができます。

## FESを閉じる
[パフォーマンスを向上させるために FES を無効にする] 必要がある場合があります。

`p5.disableFriendlyErrors` が `true` に設定されている場合、FES をオフにすることができます。

例：
```javascript
p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(100, 50);
}
```

FES は、p5 の単一の圧縮ファイル (つまり、p5.min.js) から自動的に省略されます。

[FES を無効にしてパフォーマンスを向上させる]: https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes