# 🌐 国際化

[国際化](https://developer.mozilla.org/docs/Glossary/Internationalization_and_localization)（"i18n"と略されることもあります）は、ソフトウェアプロジェクトで複数の言語をサポートすることを指します。これは通常、プロジェクトで使用されるテキスト文字列の翻訳を維持し、ユーザーが受け取る翻訳を選択できるようにすること（またはブラウザの設定に基づいて自動的に検出されること）を意味します。

p5.jsは、多くの分野（寄稿者ドキュメント、[公式ウェブサイト](https://p5js.org)、リファレンスドキュメントなど）で国際化を使用しています。私たちは国際化の取り組みの範囲を拡大しており、p5.jsのコンソール出力（主に開発者向けのエラーメッセージ）を含むようにしています。

## ツール

コードベースには[i18next](https://www.i18next.com)を統合しています。現在、圧縮されていないp5.jsビルドでのみ使用しています。`p5.min.js`は国際化コードの外側の部分のみを含み、それを使用していません。

### 設定

`src/core/internationalization.js`でi18next統合を設定しており、翻訳ファイルは`translations/`ディレクトリにあります。

私たちは、p5スケッチの初期化前に翻訳エンジンを設定し、ユーザーのブラウザの設定に基づいて自動的にユーザーの言語を検出します。これにより、`setup()`や`preload()`で遭遇したエラーについても翻訳を使用できるようになります。

（言語の自動検出でエラーが発生した場合は、英語にフォールバックします。）

#### `p5.min.js`内の翻訳なし

browserifyのビルドタスクと`src/core/init.js`には、圧縮されたビルドで翻訳をロードまたは設定しないための特定のロジックがあります。翻訳を追加しても、圧縮ビルドのサイズは増加しません。

### 翻訳の使用

翻訳を使用するには、ファイルのトップに以下の行を追加してください。

```js
import { translator } from './internationalization';
```

### シンプルなメッセージ

国際化なしで直接メッセージをログに記録する場合は、

```js
console.log('Loading your sketch right now!')
```

代わりにtranslatorを使用できます：

```js
console.log(translator('sketch.loading'))
```

これは、翻訳者にユーザーの好みの言語で"sketch.loading"メッセージを取得するよう指示します。

#### ダイナミックメッセージ

変数を翻訳後のメッセージに挿入することもできます。例えば、

```js
console.log('I couldnt find ' + file.name + '. Are you sure it's there?')
```

これは以下のようになります：

```js
console.log(translator('fileLoading.notFound', { fileName: file.name }))
```

このような翻訳では、特定の名前の変数が期待されますので、その名前を使用してください。変数名は、translations/{YOUR_LANGUAGE}/内の翻訳ファイルで確認できます。翻訳は翻訳キーのオブジェクトパスの下にあります。

"`fileLoading.notFound`" 可以在以下位置找到：

```json
{
  "fileLoading": {
    "notFound": "I couldnt find {{fileName}}. Are you sure it's there?"
  }
}
```

変数は "`{{` `}}`" で囲みます。

### 翻訳の修正

単に `translations/{YOUR_LANGUAGE}/translation.json` を開いて、キーでの翻訳を見つけ（上記の例のように）、編集します！

### 新しい言語の翻訳を追加

最も簡単な方法は、`package.json` の[言語リスト](https://github.com/processing/p5.js/blob/84bc1f92c89786f48e5d6fd1045feb649b932eea/package.json#L111-L114)に言語コード（例：ドイツ語の "de"、イタリア語の "it" など）を追加し、端末から '$ npm run build' を実行することです。

これにより、`translations/{LANGUAGE_CODE}/` に新しい翻訳ファイルが生成されます！これで、翻訳を埋め始めることができます！🥖

また、[`translations/index.js`](../translations/index.js) と [`translations/dev.js`](../translations/dev.js) にエントリーを追加する必要があります。ファイル内で `en` と `es` に使用されているパターンに従って操作できます。

### 変更のテスト
翻訳のほとんどは最終的なライブラリに含まれておらず、オンラインでホストされ、p5.jsが必要とするときに自動的にダウンロードされます。これらの翻訳への更新は、p5.jsの新しいバージョンがリリースされるときにのみ行われます。

ただし、変更（またはまだリリースされていない他の変更）を確認したい場合は、単に `npm run dev` を実行するだけで、p5.jsがビルドされ、インターネット上のファイルではなく、ローカルコンピュータ上に存在する翻訳ファイルを使用するように設定されます。

### 詳細情報

[i18next 翻訳関数のドキュメント](https://www.i18next.com/translation-function/essentials)を参照してください。上記のドキュメントは、その機能のサブセットに過ぎません。

