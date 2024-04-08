# サポートされるブラウザ

## 私たちの目標
p5.js は [browserslist](https://browsersl.ist/) と [Babel](https://babeljs.io/) を使用して、古いブラウザのサポートを行います。私たちが使用している browserslist の設定は [`last 2 versions, not dead`](https://browserslist.dev/?q=bGFzdCAyIHZlcnNpb25zLCBub3QgZGVhZA%3D%3D) です。`last 2 versions` は任意のブラウザの最新2つのバージョンを意味し、`not dead` は過去24ヶ月以内に公式サポートまたは更新があったブラウザを意味します。ブラウザは、これら2つの条件を満たしている場合にのみサポートされます。

実際には、多くの最新の JavaScript 機能を使用することができますが、Babel は通常、それらを所望の互換性リストに合わせて変換またはポリフィルします。一部の機能、特に [Web API](https://developer.mozilla.org/en-US/docs/Web/API)、[WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) や、コア JavaScript 言語に属さない機能は、Babel によって処理されないため、ケースバイケースで評価が必要です。

特定の機能が利用可能かどうかを確認する良い場所は [caniuse.com](https://caniuse.com/) と [MDN](https://developer.mozilla.org/en-US/) です。

## 適用範囲
サポートされるブラウザの要件は、p5.js のソースコード、すべての例（ウェブサイトの例のページとドキュメントを含む）およびすべての公式チュートリアルに適用されます。サードパーティのライブラリは、同じ要件を満たす必要はありませんが、そうすることを推奨します。

多くの場合、公式にサポートされていないブラウザでも p5.js と一緒に使用できる可能性がありますが、その場合の保証はありません。

コード変更を伴う PR がこの要件を満たしていることを確認するのは、各セクションの責任者の役割です。
