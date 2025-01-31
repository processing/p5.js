

# 🌸ようこそ！🌺

p5.jsに貢献することに興味を持ってくれてありがとうございます！私たちのチームは、あらゆる形の支援を価値あるものと見なし、あなたが貢献できる範囲を可能な限り広げようとしています。これには、参照文献、教育、プログラミング、アートの作成、執筆、デザイン、イベント、組織、展示企画やあなたが思いつくあらゆることが含まれます。[私たちのコミュニティページ](https://p5js.org/community/#contribute)では、プロジェクトに貢献し参加する方法のいくつかを提供しています。技術的な支援を提供したい場合は、読み進めてください。

このプロジェクトは[コントリビューターズリスト](https://github.com/kentcdodds/all-contributors)のルールに従います。[指示](https://github.com/processing/p5.js/issues/2309)に従って、[readme](https://github.com/processing/p5.js/blob/main/README.md#contributors)にあなたとあなたの貢献を追加するか、または[GitHub issue](https://github.com/processing/p5.js/issues)であなたの貢献についてコメントしてください。そうすれば、私たちはあなたをコントリビューターリストに追加します。

# ソースコード

p5.jsプロジェクトには、このコードリポジトリ以外にもいくつかの他のコードリポジトリがあります：

- [p5.js](https://github.com/processing/p5.js)：p5.jsのソースコードを含みます。[ユーザー向けのp5.js参照文献](https://p5js.org/reference/)も、このソースコード内の[JSDoc](http://usejsdoc.org/)コメントから生成されます。[Lauren Lee McCarthy](https://github.com/lmccart)がメンテナーです。
- [p5.js-website](https://github.com/processing/p5.js-website)：このソースコードは、[p5.jsウェブサイト](https://p5js.org)の大部分のコードを含んでいます（参照文献を除く）。[Lauren Lee McCarthy](https://github.com/lmccart)がメンテナーです。
- [p5.js-sound](https://github.com/processing/p5.js-sound)：p5.sound.jsライブラリを含みます。[Jason Sigal](https://github.com/therewasaguy)がメンテナーです。
- [p5.js-web-editor](https://github.com/processing/p5.js-web-editor)：[p5.jsウェブエディタ](https://editor.p5js.org)のソースコードを含みます。[Cassie Tarakajian](https://github.com/catarak)がメンテナーです。旧版の[p5.jsエディタ](https://github.com/processing/p5.js-editor)はもはやサポートされていませんのでご注意ください。
- [p5.accessibility](https://github.com/processing/p5.accessibility)：盲人や視覚障害者がp5.jsをより使いやすくするためのライブラリです。

# ファイル構造

このコードリポジトリには多くのファイルがありますので、ここではファイルの概要を提供します。一部のファイルは理解するのが難しいかもしれませんが、始めるためにすべてを理解する必要はありません。特定の領域から始めて（例えば、いくつかのインライン参照文献を修正するなど）、徐々に他の領域を探索することをお勧めします。Luisa Pereiraの[Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation)も、p5.jsのツールやファイルのビデオ概要を提供しています。

- `contributor_docs/` は、貢献者が従うべきガイドラインを含みます；
- `docs/` は参照文献を含みません！それは_[オンライン参照文献](https://p5js.org/reference/)を_*生成*_するためのコードを含んでいます；
- `lib/` は、空の例とp5.sound拡張ライブラリを含み、[p5.js-soundコードリポジトリ](https://github.com/processing/p5.js-sound)を通じて定期的に更新されます。[Grunt](https://gruntjs.com/)を使用してp5.jsを単一のファイルにコンパイルした後のp5.jsライブラリの位置でもあります。Pull requestを発行する際には、これをGitHubコードリポジトリにチェックインする必要はありません。
- `src/` は、すべてのソースコードを含み、通常は複数の個別のモジュールに編成されています。p5.jsに変更を加えたい場合は、ここを参照する必要があります。ほとんどのフォルダ内には、そのフォルダをナビゲートするのに役立つ独自のREADME.mdファイルがあります。
- `tasks/` は、p5.jsおよび新しいバージョンのp5.jsのビルド、デプロイ、リリースに関連する自動化タスクのスクリプトを含みます。
- `tests/` は、ライブラリが変更されても正常に機能し続けることを保証するための単体テストを含みます。
- `utils/` は、リポジトリに役立つその他のファイルを含むことがありますが、通常はこのディレクトリを無視しても大丈夫です。


# 参照文献

私たちは、参照文献がこのプロジェクトの最も重要な部分であることを認識しています。不十分な参照文献は、新規ユーザーや新規貢献者にとって最大の障壁であり、プロジェクトの包括性を損ないます。[contributing_documentation.md](./contributing_documentation.md)ページでは、参照文献の修正を開始するための詳細なガイドを提供しています。p5.jsの参照文献は、以下の場所で見つけることができます：

- [p5js.org/reference](https://p5js.org/reference/)：[inline documentation](./inline_documentation.md)のソースコードから生成されます。それには、テキストの説明とパラメータ、添付されたコードスニペットの例が含まれています。コードと参照文献を密接に連携させるために、これらすべてのインラインドキュメントとコードを一緒に配置し、参照文献への貢献がコードへの貢献と少なくとも同じくらい重要であるという考えを強化しています。ライブラリをビルドすると、インライン参照文献と例がコードの動作と一致するかどうかをチェックします。貢献するには、まず[inline_documentation.md](./inline_documentation.md)ページをチェックしてください。
- [p5js.org/examples](https://p5js.org/examples)ページには、p5.jsを学ぶのに役立つより長い例が含まれています。貢献するには、まず[adding_examples.md](https://github.com/processing/p5.js-website/blob/main/contributor_docs/Adding_examples.md)をチェックしてください。
- [p5js.org/tutorials](https://p5js.org/tutorials)ページには、p5.jsやプログラミングの概念を学ぶのに役立つチュートリアルが含まれています。貢献するには、まず[p5.js tutorial guide](https://p5js.org/learn/tutorial-guide.html)をチェックしてください。
- p5.jsウェブサイトが現在いくつかの異なる言語をサポートしていることに気付くかもしれません。これは国際化（i18n）と呼ばれます。[i18n_contribution](https://github.com/processing/p5.js-website/blob/main/contributor_docs/i18n_contribution.md)ページで詳細を学ぶことができます。

# GitHub Issue プロセス

* 私たちは[GitHub issue](https://github.com/processing/p5.js/issues)を使用して、既知のバグと予想される新機能を追跡しています。[Issue labels](./issue_labels.md)は、問題を分類するために使用されます。例えば、[初心者向け](https://github.com/processing/p5.js/labels/level%3Abeginner)の問題です。

* 既存の問題に取り組みたい場合は、取り組もうとしている問題にコメントしてください。そうすることで、他の貢献者がその問題が処理中であることを知り、支援を提供することができます。

* この問題に関連する作業を完了したら、p5.js main ブランチに対して[Pull request](./preparing_a_pull_request.md)を提出してください。PRの説明フィールドには、「resolves #XXXX」というタグを含めて、解決しようとしている問題を指定してください。PRがその問題を完全に解決しない場合（つまり、PRがマージされた後にその問題を開いたままにする必要がある場合）は、「addresses #XXXX」と入力してください。

* バグを発見したり、新しい機能を追加するアイデアがある場合は、まず問題を提出してください。修正や新機能を含むPull Requestを直接提出するのではなく、まず問題を提起してください。問題に関するフィードバックを受け取り、問題を解決することに同意した後、上記のプロセスに従って修正や機能を提供することができます。

* 問題を分類することができます。これには、バグレポートの複製や、バージョン番号や複製手順などの重要情報の要求が含まれる場合があります。問題の分類を始めたい場合、簡単な入門方法として[p5.jsをCodeTriageで購読する](https://www.codetriage.com/processing/p5.js)ことができます。[![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

* [organization.md](https://github.com/processing/p5.js/blob/main/contributor_docs/organization.md)ファイルは、問題の整理方法と意思決定プロセスについての高レベルの概要を提供しています。興味があれば、ぜひ参加してください。


# 開発プロセス

開発プロセスが少し難しいかもしれないことを私たちは知っています-あなただけではありません、最初はみんなそう感じます。以下の手順に従って設定を進めることができます。問題が発生した場合は、[フォーラム](https://discourse.processing.org/c/p5js)で話し合うか、問題についての[issue](https://github.com/processing/p5.js/issues)を投稿してください。私たちはあなたを支援するために最善を尽くします。

1. [node.js](http://nodejs.org/)をダウンロードします（[npm](https://www.npmjs.org)パッケージマネージャーも自動的にダウンロードされます）

2. GitHubアカウントに[p5.jsリポジトリ](https://github.com/processing/p5.js)を[fork](https://help.github.com/articles/fork-a-repo)します

3. この新しいforkのリポジトリをローカルコンピュータに[クローン](https://help.github.com/articles/cloning-a-repository/)します：

   ```shell
   $ git clone https://github.com/あなたのユーザーネーム/p5.js.git
   ```

4. プロジェクト フォルダーに移動し、npm を使用して必要なパッケージをすべてインストールします。

   ```shell
   $ cd p5.js
   $ npm ci
   ```

5. [Grunt](https://gruntjs.com/) インストールする必要があります。ソース コードからライブラリを構築するために使用できます。

   ```shell
   $ npm run grunt
   ```

   ライブラリ内のファイルを常に変更している場合は、「npm run dev」を実行すると、ソース ファイルが変更されるたびに、コマンドを手動で入力することなく、自動的にライブラリを再構築できます。

6. ローカルソースコードを変更した後、Gitでそれらを[commit](https://help.github.com/articles/github-glossary/#commit)します。

   ```shell
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. もう一度「npm run grunt」を実行して、構文エラー、テストの失敗、その他の問題がないことを確認します。

8. GitHub 上のフォークに新しい変更をアップロード ([Push](https://help.github.com/articles/github-glossary/#push)) します。

   ```shell
   $ git push
   ```

9. すべての準備ができたら、[プル リクエスト](https://help.github.com/articles/creating-a-pull-request) を使用して公開します。

# 注意事項

p5.jsのコードベースに付属する開発者向けツールは、ある意味で意図的に非常に厳格です。これは良いことです！それによってすべてが一貫性を保ち、コードを書くときに一貫性を保つよう励まされます。つまり、何かを変更しようとしても、提出がプロジェクトに拒否されるかもしれませんが、落胆しないでください。経験豊富なp5.js開発者でさえ同じ間違いをすることがあります。通常、問題は次の2つのいずれかに関連しています：コードの構文またはユニットテスト。

## コード構文

p5.jsは、整ったスタイルと一貫性のあるコード構文を要求します。これには、[ESlint](https://eslint.org/)を使用してコードをチェックするのに役立ちます。これらのツールは提出前にいくつかのスタイルルールをチェックしますが、コードエディタに[ESlintプラグイン](https://eslint.org/docs/user-guide/integrations#editors)をインストールすることで、コードを入力した直後にエラーを即座に表示させることもできます。全般的に、私たちはコードスタイルにおいて柔軟性を重視しており、参加と貢献の障壁を減らすことを目指しています。

エラーをチェックするには、コマンドラインで以下のコマンドを入力します（`$`プロンプトは入力しないでください）：

```shell
$ npm run lint
```

一部の構文エラーは自動的に修正できます。

```shell
$ npm run lint:fix
```

プロジェクトで確立されたスタイルを維持することが通常望ましいですが、[たまに](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=)異なる構文を使用することでコードをより理解しやすくすることが可能です。これらの場合、Prettierは`// prettier-ignore`コメントを[提供しています](https://prettier.io/docs/en/ignore.html)、これを使用して個々の例外を指定することができます。可能であれば、それを避けてください。なぜなら、linterが強制するほとんどのコードフォーマットには正当な理由があるからです。

こちらはコードスタイルルールの迅速な要約です。このリストは完全ではない可能性がありますので、完全なリストを得るためには [.prettierrc](https://github.com/processing/p5.js/blob/main/.prettierrc) と [.eslintrc](https://github.com/processing/p5.js/blob/main/.eslintrc) ファイルを参照するのが最善です。
 * ES6構文を使用する

* シングルクォートを優先する

* インデントには2つのスペースを使用する

* すべての変数は少なくとも一度は使用する、さもなければ完全に削除する

* `x == true` や `x == false` を使用しない。代わりに `(x)` や `!(x)` を使用する。誤解を招く可能性がある場合は、オブジェクトを `null` と比較し、文字列を `""` と比較し、数値を `0` と比較する。

* 複雑またはあいまいな場所ではコメントを使用する

* [Mozilla JS practices](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style#JavaScript_practices) を参照して、いくつかの便利なコードフォーマットの技を学ぶ。

## 単体テスト

単体テストは、主要なロジックを補完し、検証を実行する小さなコード片です。[unit_testing.md](../unit_testing.md)ページは、単体テストの使用に関する詳細情報を提供します。p5.jsの主要な新機能を開発している場合は、可能な限りテストを含めるべきです。テストに合格していないpull requestは、コード内にエラーがあることを意味するので、提出しないでください。

単体テストを実行するには、プロジェクトの依存関係がインストールされていることを確認する必要があります。

```shell
$ npm ci
```

これにより、p5.js の依存関係の *すべて* がインストールされます。簡単に言うと、単体テストに特有の最も重要な依存関係は次のとおりです。

-[Mocha](https://mochajs.org/)，p5.j​​s に固​​有の個別のテスト ファイルを実行できる強力なテスト フレームワーク
-[mocha-chrome](https://github.com/shellscape/mocha-chrome)，ヘッドレス Google Chrome ブラウザを使用して mocha テストを実行するための mocha プラグイン

依存関係がインストールされたら、Grunt を使用して単体テストを実行します。

```shell
$ grunt
```

コマンドラインではなくブラウザでテストを実行すると便利な場合があります。 これを行うには、まず [connect](https://github.com/gruntjs/grunt-contrib-connect) サーバーを起動します。

```shell
$ npm run dev
```

サーバーが実行されている場合、ブラウザで `test/test.html` を開くことができるはずです。

完全なユニットテストガイドはp5.jsドキュメントの範囲を超えていますが、簡単なバージョンは、`src/` ディレクトリに含まれるソースコードに重大な変更や新機能がある場合、それには `test/` ディレクトリ内のテストが付随しているべきで、そのライブラリの将来の全バージョンでの振る舞いが一貫していることを検証する必要があります。ユニットテストを書く際には、[Chai.jsリファレンス](http://www.chaijs.com/api/assert/)を段階的なアサートメッセージのガイドとして使用してください。これにより、テストで将来捕捉されるエラーが一貫しており、他の開発者が問題がどこにあるかを理解しやすくなります。

# その他

- [contributor_docs /](https://github.com/processing/p5.js/tree/main/contributor_docs) フォルダ内の他のドキュメントを参照できます。これらは、このプロジェクトへの技術的および非技術的な側面の特定の領域に関係しています。
- [深いp5.js](https://www.luisapereira.net/teaching/materials/processing-foundation)は、p5.jsの開発ワークフローで使用されるツールとファイルのビデオチュートリアルです。
- [The Coding Trainのビデオ](https://youtu.be/Rr3vLyP1Ods) :train::rainbow: は、p5.jsへの技術的な貢献を始めるための概要を提供します。
- p5.js [Dockerイメージ](https://github.com/toolness/p5.js-docker)は[Docker](https://www.docker.com/)にインストールでき、[Node](https://nodejs.org/)などの要件を手動でインストールすることなく、またホストオペレーティングシステムに他の方法で影響を与えることなく（Dockerをインストールする以外は）、p5.jsの開発に使用できます。
- p5.jsライブラリのビルドプロセスは、p5.jsの公開APIを含む[jsonデータファイル](https://p5js.org/reference/data.json)を生成します。これは、エディタでのp5.js構文の自動補完など、自動化ツールで使用できます。このファイルはp5.jsウェブサイトでホストされていますが、コードリポジトリには含まれていません。
- p5.jsの言語は最近、[ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015)に移行しました。この動きがあなたの貢献にどのように影響するかについては、[ES6 adoption](../es6-adoption.md)を参照してください。
