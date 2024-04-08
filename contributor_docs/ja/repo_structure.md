# 私たちのコードが存在する場所

p5.js プロジェクト全体には、このリポジトリ以外にもいくつかのリポジトリが含まれています：

- **[p5.js](https://github.com/processing/p5.js)**：このリポジトリには p5.js ライブラリのソースコードが含まれています。[ユーザー向けの p5.js リファレンスマニュアル](https://p5js.org/reference/)も、このソースコード内の [JSDoc](https://jsdoc.app/) コメントから生成されます。[Qianqian Ye](https://github.com/qianqianye) と一連の[スチュワード](https://github.com/processing/p5.js#stewards)によってメンテナンスされています。
- **[p5.js-website](https://github.com/processing/p5.js-website)**：このリポジトリには、[p5.js のウェブサイト](http://p5js.org)のほとんどのコードが含まれていますが、リファレンスは含まれていません。[Qianqian Ye](https://github.com/qianqianye)、[Kenneth Lim](https://github.com/limzykenneth)、および一連の[スチュワード](https://github.com/processing/p5.js-website#stewards)によってメンテナンスされています。
- **[p5.js-sound](https://github.com/processing/p5.js-sound)**：このリポジトリには p5.sound.js ライブラリが含まれており、[Jason Sigal](https://github.com/therewasaguy)によってメンテナンスされています。
- **[p5.js-web-editor](https://github.com/processing/p5.js-web-editor)**：このリポジトリには、[p5.js ウェブエディタ](https://editor.p5js.org)のソースコードが含まれており、[Cassie Tarakajian](https://github.com/catarak)によってメンテナンスされています。
- 上記のリストに含まれていない追加のライブラリは通常、独自のリポジトリとメンテナを持ち、p5.js プロジェクトによって直接メンテナンスされることはありません。

## リポジトリファイル構造

たくさんのファイルがあります！これは簡単な概要です。少し混乱するかもしれませんが、リポジトリ内のすべてのファイルを理解する必要はありません。一つの領域から始めることをお勧めします（例えば、いくつかのインラインドキュメントを修正するなど）、そして徐々にもっと多くを探索していきます。Luisa Pereira の [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) は、p5.js のワークフローで使用されるツールとファイルを紹介するビデオツアーも提供しています。

- 📁`contributor_docs/` 貢献者の実践と原則を説明するファイルが含まれています
- 📁`docs/` 実際にはドキュメントが含まれていません！代わりに、[オンラインリファレンスマニュアル](https://p5js.org/reference/)を*生成する*コードが含まれています。
- 📁`lib/` 空の例と p5.sound アドオンライブラリが含まれており、[p5.js-sound リポジトリ](https://github.com/processing/p5.js-sound)からのプルリクエストを通じて定期的に更新されます。これはまた、[Grunt](https://gruntjs.com/)を使ってコンパイルされた後に p5.js ライブラリが配置される場所です。プルリクエストを提出する際には、GitHub リポジトリにチェックインする必要はありません。
- 📁`src/` ライブラリの全ソースコードが含まれており、個別のモジュールとして主題別に整理されています。p5.js を変更する場合は、ここで作業します。ほとんどのフォルダには、必要なものを見つけるのに役立つ自身の readme.md ファイルが含まれています。
- 📁`tasks/` ビルド、デプロイ、p5.js の新バージョンのリリースに関連する自動化タスクを実行するスクリプトが含まれています。
- 📁`tests/` 単体テストが含まれており、変更を加えた際にライブラリが正しく動作し続けることを保証します。
- 📁`utils/` リポジトリに役立つその他のファイルが含まれている可能性がありますが、通常はこのディレクトリを無視しても問題ありません。

## その他の情報
- 📁[`contributor_docs/`](https://github.com/processing/p5.js/tree/main/contributor_docs) フォルダには他にも多くのファイルがあり、探索できます。これらは、技術的または非技術的な性質の特定の分野に貢献することに関連しています。
- [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) は、p5.js の開発ワークフローで使用されるツールとファイルを紹介するビデオツアーです。
- [The Coding Train](https://youtu.be/Rr3vLyP1Ods) の[このビデオ](https://youtu.be/Rr3vLyP1Ods) は、p5.js への技術的な貢献を開始する方法の概要を提供します。
- p5.js [Docker イメージ](https://github.com/toolness/p5.js-docker) は [Docker](https://www.docker.com/) 内でマウントして使用でき、[Node](https://nodejs.org/) のような要件を手動でインストールする必要なく、p5.js の開発を行うことができます。Docker をインストールする以外に、ホストオペレーティングシステムに影響を与えることはありません。
- p5.js ライブラリのビルドプロセスは、p5.js の公開 API を含む[JSON データファイル](https://p5js.org/reference/data.json)を生成し、エディタでの p5.js メソッドの自動補完などの自動化ツールに利用できます。このファイルは p5.js ウェブサイトでホストされていますが、リポジトリの一部としては含まれていません。

