# p5.jsライブラリの作成

p5.jsライブラリは、p5.jsのコア機能を拡張または追加する任意のJavaScriptコードです。ライブラリには2種類あります。コアライブラリ（p5.Soundなど）はp5.jsの配布物の一部であり、寄稿ライブラリはp5.jsコミュニティのメンバーによって開発、所有、維持されています。

ライブラリを作成し、それを[p5js.org/libraries](https://p5js.org/libraries)ページに含めたい場合は、[このフォーム](https://docs.google.com/forms/d/e/1FAIpQLSdWWb95cfvosaIFI7msA7XC5zOEVsNruaA5klN1jH95ESJVcw/viewform)を送信してください。

# 新しいライブラリの作成

JavaScriptの書き方や使用方法は多種多様なため、これについては皆さんにお任せします。以下は、ライブラリをp5.jsとうまく連携させるためのいくつかの考慮事項です。

## コード

### `p5.prototype`にメソッドを追加することでp5コア機能を拡張できます。
例えば、dom.jsの次のコードはp5を拡張し、`createImg()`メソッドを追加しています。このメソッドはDOMに[HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)を追加します。

  ```js
  p5.prototype.createImg = function (src) {
    const elt = document.createElement('img');
    //const elt = new Image; // もう 1 つの短い代替案。

    elt.src = src;
    return addElement(elt, this);
  };
  ```
  DOMライブラリがプロジェクトに含まれている場合、`createCanvas()`や`background()`を呼び出すようにcreateImg()を呼び出すことができます。

### 内部の補助関数にはプライベート関数を使用してください。
これらの関数はユーザーが呼び出すことを意図していません。上記の例で、`addElement()`はdom.js内の内部関数ですが、`p5.prototype`に公開されていません。

### p5.jsクラスを拡張するために、それらのプロトタイプにメソッドを追加することもできます。
以下の例では、p5.Element.prototypeがhtml()メソッドで拡張されており、このメソッドは要素の内部HTMLを設定します。
  ```js
  p5.Element.prototype.html = function (html) {
    this.elt.innerHTML = html;
    //this.elt.textContent = html; // innerHTML のより安全な代替として textContent を使用してください。
  };
  ```
  
### preload()内で呼び出すことができるメソッド名をregisterPreloadMethod()で登録します。

一部の非同期関数（音声、画像、その他の外部ファイルのロードなど）には、同期および非同期のオプションが提供されます。たとえば、`loadStrings(path, [callback])`は、`loadStrings`関数が完了した後に呼び出される関数であるオプションの2番目のコールバック引数を受け入れます。しかし、ユーザーは`preload()`内でコールバックを使用せずに`loadStrings`を呼び出すこともでき、p5.jsは`preload()`内のすべてが完了するまで`setup()`の実行を待ちます。独自のメソッドを登録する場合は、メソッド名を`

  ```js
  p5.prototype.registerPreloadMethod('loadSound', p5.prototype);
  ```

### 非同期関数の例、_callback_ および **preload()** 用
```js
// preload()内またはコールバックと一緒に使用する非同期関数の例。
p5.prototype.getData = function (callback) {

  // 非同期関数からデータをクローンして返すオブジェクトを作成します。
  // 以下でこのオブジェクトを更新しますが、上書き/再割り当てしません。
  // preload()のために、元のポインタ/リファレンスを保持することが非常に重要です。
  // constで変数を宣言することで、誤って再割り当てされるのを防ぎます。
  const ret = {};

  // 処理しているいくつかの非同期関数。
  loadDataFromSpace(function (data) {

    // dataのプロパティを反復処理します。
    for (let prop in data) {
      // retのプロパティをdataのプロパティ（クローン）に設定します。
      // つまり、受け取ったデータで空のretオブジェクトのプロパティを更新します。
      // しかし、retを別のオブジェクトで上書き/再割り当てすることはできません。
      // その内容を更新する必要があります。
      ret[prop] = data[prop];
    }
    // callbackが実際に関数であるかどうかをチェックします。
    if (typeof callback == 'function') {
      callback(data); // コールバックを実行します。
    }
  });
  // 上記のデータで埋められたオブジェクトを返します。
  return ret;
};

```
  
### registerMethod() を使用して、p5 が異なるタイミングで呼び出すべき関数を登録します。

  ```js
  p5.prototype.doRemoveStuff = function () { 
    // ライブラリのクリーンアップ
  };
  p5.prototype.registerMethod('remove', p5.prototype.doRemoveStuff);
  ```
  
登録できるメソッド名には、以下のリストが含まれます。関数を登録する前に、その関数を定義する必要があるかもしれません。

pre - draw()の開始時に呼び出されます。描画に影響を与えることができます。
post - draw()の終了時に呼び出されます。
remove - remove()が呼び出されたときに呼び出されます。
init - スケッチの初回初期化時に呼び出されます。具体的には、スケッチの初期化関数（p5 コンストラクタに渡される関数）を実行する直前です。これは、任何のグローバルモード設定よりも前に呼び出されるため、ライブラリがスケッチに何かを追加でき、グローバルモードがアクティブになった場合に自動的に window にコピーされます。
詳細は以下のリストに従って近日公開予定です：
https://github.com/processing/processing/wiki/Library-Basics#library-methods


### 自分のクラスを作成することもできます。
ライブラリは、p5やp5クラスを拡張せずに、単に追加のクラスを提供するだけかもしれません。これらのクラスは、ライブラリと共にインスタンス化して使用することができます。または、ライブラリが両方を行うこともあります。

## 命名
* **p5関数やプロパティを上書きしないでください** p5.prototypeを拡張する際に、既存のプロパティや関数の名前を使用しないように注意してください。hasOwnPropertyを使用して名前をテストすることができます。例えば、ライブラリファイルの先頭に以下の行を置くと、rect()メソッドが存在するため、trueが出力されます：

  ```js
  console.log(p5.prototype.hasOwnProperty('rect'));
  ```

* **同様に、p5クラスの関数やプロパティを上書きしないでください。** p5.Image、p5.Vector、p5.Elementなどを拡張する場合は、上記のプロトコルに従ってください。

* **p5.jsには、グローバルモードとインスタンスモードの2つのモードがあります。** グローバルモードでは、すべてのp5プロパティとメソッドがwindowオブジェクトにバインドされ、ユーザーが`background()`のようなメソッドを前置詞なしで呼び出せるようになります。しかし、これはあなたがネイティブのJavaScript機能を上書きしないように注意する必要があることを意味します。既存のJS名をテストするには、コンソールでそれらを入力するか、Google検索を素早く行うことができます。

* **クラスは通常、大文字で始まり、メソッドとプロパティは小文字で始まります。** p5では、クラスはp5というプレフィックスで始まります。私たちはこの名前空間をp5コアクラスに予約したいので、自分のクラスを作成する際には、クラス名にp5.プレフィックスを含めないでください。独自のプレフィックスを作成するか、単にプレフィックスなしの名前を使用してください。

* **p5.jsのライブラリファイル名もp5で始まりますが、次の単語は小文字です。**,これは、それらをクラスと区別するためです。例えば、p5.sound.jsです。この形式に従ってファイルに名前を付けることをお勧めします。


## パッケージング
* **ライブラリを含む単一のJSファイルを作成してください。** これにより、ユーザーがプロジェクトにリンクしやすくなります。[圧縮版](http://jscompress.com/)と通常のJSファイルの両方を提供することも検討してください。これにより、ロード速度が速くなります。

* **貢献ライブラリは、作成者によってホスト、文書化、およびメンテナンスされます。** これはGitHub、個別のウェブサイト、またはその他の場所で行われる可能性があります。

* **ドキュメントは非常に重要です！** ライブラリのドキュメントは、ダウンロードしてライブラリを使用するユーザーが簡単に見つけられる場所に配置してください。貢献ライブラリのドキュメントは、p5.jsの主要なリファレンスドキュメントには含まれませんが、類似の形式に従うことを検討してください。以下の例を参照してください：[ライブラリ概要ページ](https://p5js.org/reference/libraries/p5.sound)、[クラス概要ページ](https://p5js.org/reference/p5.Vector)、[メソッドページ](https://p5js.org/reference/p5/arc)。

* **例も素晴らしいです！** それらは人々にあなたのライブラリが何ができるかを示します。これはすべてJavaScriptなので、ダウンロードする前にオンラインで実行することができます。[jsfiddle](http://jsfiddle.net/)と[codepen](http://codepen.io)は、例をホストするための2つの良いシンプルなオプションです。

* **お知らせください！** ライブラリがリリース準備が整ったら、[hello@p5js.org](mailto:hello@p5js.org)にリンクといくつかの情報を添えてメールを送ってください。[ライブラリページ](https://p5js.org/libraries/)に掲載されます！
