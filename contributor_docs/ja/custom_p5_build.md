# p5.jsのカスタムビルドの作成に選択したコンポーネントを使用する

## 概要

p5.jsの素晴らしい新[機能](https://github.com/processing/p5.js/pull/2051)により、ユーザーはp5.jsをカスタム組み合わせのモジュールとしてビルドできるようになりました。これは、ライブラリのプロダクションバージョンのサイズを小さくし、全体のパフォーマンスを向上させる上で非常に役立ちます。

この機能は、Google Summer of Code 2017の提案の一部として提出されました。

## 使用方法

現在、コマンドラインからGruntタスクを手動で呼び出すことによって使用します：

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:module_x:module_y
```

ここで、module_nは選択したいモジュールの名前です。複数のモジュールは、上記の例のように渡される必要があります。また、これらのモジュールの名前は、正しく機能するために、/srcディレクトリ内のフォルダ名と同じでなければなりません。デフォルトではcoreが含まれますが、line()や他のコア機能の形状を機能させるにはcore/shapeを含める必要があります。

上記の使用例で生成されるp5Custom.jsファイルのサイズは、完全なp5.min.jsよりも大きくなる可能性があります。これは、出力がuglifyタスクを使用して縮小されていないためです。

バンドルファイルのサイズを最小限に抑えるための推奨手順は以下の通りです：

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:min:module_x:module_y uglify
```

## 例

- `npm run grunt combineModules:min:core/shape:color:math:image uglify`
`combineModules`と`uglify`タスクを使用して、`lib/modules`ディレクトリに`p5Custom.min.js`バンドルファイルを生成します。`combineModules:min`の後にモジュールをリストし、モジュールリストの後にスペースを入れてください。

- `npm run grunt combineModules:core/shape:color:math:image`
`lib/modules`ディレクトリに圧縮されていない`p5Custom.js`バンドルファイルを生成します。

- `npm run grunt combineModules:min:core/shape:color:math:image`
`combineModules:min`タスクを使用して、`lib/modules`ディレクトリに`p5Custom.pre-min.js`ファイルを生成します。この例では、`combineModules:min`タスクの実行後に`npm run grunt uglify`を個別に実行することができます。