p5.js库可以是扩展或添加到p5.js核心功能的任何JavaScript代码。有两种类型的库。核心库（p5.Sound）是p5.js分发的一部分，而贡献库是由p5.js社区的成员开发、拥有和维护的。

如果您创建了一个库并希望将其包含在[p5js.org/libraries](https://p5js.org/libraries)页面上，请提交[此表单](https://docs.google.com/forms/d/e/1FAIpQLSdWWb95cfvosaIFI7msA7XC5zOEVsNruaA5klN1jH95ESJVcw/viewform)。

# 创建一个新库

有许多不同的编写和使用JavaScript的方法，所以我们将此留给您。以下是一些关于使您的库与p5.js良好配合的注意事项。

## 代码

### 您可以通过向p5.prototype添加方法来扩展p5核心功能。
例如，dom.js中的以下代码扩展了p5，添加了一个`createImg()`方法，该方法在DOM中添加了一个[HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)。

  ```js
  p5.prototype.createImg = function (src) {
    const elt = document.createElement('img');
    //const elt = new Image; // 另一种更短的替代方法。

    elt.src = src;
    return addElement(elt, this);
  };
  ```
  当DOM库包含在项目中时，可以像调用`createCanvas()`或`background()`一样调用`createImg()`。

### 对于内部辅助函数，请使用私有函数。
这些函数不打算由用户调用。在上面的示例中，`addElement()`是[dom.js](https://github.com/processing/p5.js/blob/main/src/dom/dom.js)中的内部函数。但它并未公开绑定到`p5.prototype`。

### 您还可以通过向它们的原型添加方法来扩展p5.js类。
在下面的示例中，`p5.Element.prototype`通过`html()`方法进行扩展，该方法设置元素的内部HTML。
  ```js
  p5.Element.prototype.html = function (html) {
    this.elt.innerHTML = html;
    //this.elt.textContent = html; // 使用textContent作为innerHTML的更安全替代方法。
  };
  ```
  
### 使用registerPreloadMethod()在preload()中注册可以在其中调用的方法的名称。

通常，对于某些异步函数（例如加载声音、图像或其他外部文件），都会提供同步和异步选项。例如，`loadStrings(path, [callback])`接受可选的第二个回调参数 - 在loadStrings函数完成后调用的函数。但是，用户也可以在`preload()`中调用loadStrings而不使用回调，并且p5.js将等待直到`preload()`中的所有内容完成后再继续执行`setup()`。如果您想注册自己的方法，请使用要注册的方法的名称调用`registerPreloadMethod()`，并传递该方法所属的原型对象 ~~（默认为p5.prototype）~~ 。下面的示例显示了“soundfile.js”（p5.sound库）中注册`loadSound()`的一行。

  ```js
  p5.prototype.registerPreloadMethod('loadSound', p5.prototype);
  ```

### 异步函数的示例，用于 _callback_ 和 **preload()**。
```js
// 用于在preload()中或与回调一起使用的异步函数示例。
p5.prototype.getData = function (callback) {

  // 创建一个对象，该对象将从异步函数克隆数据并返回。
  // 我们将在下面更新该对象，而不是覆盖/重新分配它。
  // 对于preload()来说，保持原始指针/引用非常重要。
  // 使用const声明变量可确保它们不会被错误地重新分配。
  const ret = {};

  // 你正在处理的一些异步函数。
  loadDataFromSpace(function (data) {

    // 遍历data中的属性。
    for (let prop in data) {
      // 将ret的属性设置为data的属性（克隆）。
      // 也就是说，使用接收到的数据更新空ret对象的属性。
      // 但是，不能使用另一个对象覆盖/重新分配ret。
      // 而是需要更新其内容。
      ret[prop] = data[prop];
    }
    // 检查callback是否确实是一个函数。
    if (typeof callback == 'function') {
      callback(data); // 执行回调。
    }
  });
  // 返回使用上面的数据填充的对象。
  return ret;
};
```
  
### 使用 **registerMethod()** 在不同的时机注册应由 _p5_ 调用的函数。

  ```js
  p5.prototype.doRemoveStuff = function () { 
    // 库的清理工作
  };
  p5.prototype.registerMethod('remove', p5.prototype.doRemoveStuff);
  ```
  
您可以注册的方法名称包括以下列表。请注意，您可能需要在注册之前定义该函数。

  * **pre** - 在`draw()`开始时调用。它可以影响绘制。
  * **post** - 在`draw()`结束时调用。
  * **remove** - 在调用`remove()`时调用。
  * **init** - 在首次初始化sketch时调用，正好在执行sketch初始化函数之前（即传递给`p5`构造函数的函数）。这也在任何全局模式设置之前调用，因此您的库可以向sketch添加任何内容，并且如果激活全局模式，则会自动复制到`window`。

即将发布更多信息，大致与此列表相一致：
https://github.com/processing/processing/wiki/Library-Basics#library-methods


### 您还可以创建自己的类。
您的库可能根本不会扩展p5或p5类，而是只提供额外的类，可以与库一起实例化和使用。或者它可以两者都做。

## 命名
* **不要覆盖p5函数或属性。** 当您扩展p5.prototype时，要小心不要使用现有属性或函数的名称。您可以使用[hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)来测试名称。例如，将以下行放在库文件的顶部将打印出true，因为`rect()`方法存在：

  ```js
  console.log(p5.prototype.hasOwnProperty('rect'));
  ```

* **类似地，不要覆盖p5类的函数或属性。** 如果您正在扩展p5.Image、p5.Vector、p5.Element等，请按照上述协议进行操作。

* **p5.js有两种模式，全局模式和实例模式。** 在全局模式下，所有的p5属性和方法都绑定到window对象，允许用户调用诸如`background()`之类的方法而无需加任何前缀。然而，这意味着您需要小心不要覆盖原生的JavaScript功能。您可以通过在控制台中键入它们或通过快速的Google搜索来测试现有的JS名称。

* **类通常以大写字母开头，方法和属性以小写字母开头。** 在p5中，类以p5为前缀。我们希望将此命名空间保留给p5核心类，因此在创建自己的类时，**不要包含p5.前缀作为类名**。您可以创建自己的前缀，或者只给它们一个非前缀的名称。

* **p5.js库文件名也以p5为前缀，但下一个单词为小写**，以区分它们与类。例如，p5.sound.js。我们鼓励您遵循此格式为文件命名。


## 打包
* **创建一个包含您的库的单个JS文件。** 这样可以方便用户将其链接到其项目中。您还可以考虑提供正常JS文件和[压缩](http://jscompress.com/)版本的选项，以加快加载速度。

* **贡献的库由创建者托管、文档化和维护。** 这可以在GitHub、一个单独的网站或其他地方进行。

* **文档至关重要！** 您的库的文档应该放在某个易于找到的位置，供下载和使用您的库的用户使用。贡献的库的文档将不会包含在主要的p5.js参考文档中，但您可能希望遵循类似的格式。请参阅这些示例：[库概述页面](http://p5js.org/reference/#/libraries/p5.sound)、[类概述页面](http://p5js.org/reference/#/p5.Vector)和[方法页面](http://p5js.org/reference/#/p5/arc)。

* **示例也很棒！** 它们向人们展示了您的库能做什么。由于这全部是JavaScript，人们可以在下载之前在线运行它们。[jsfiddle](http://jsfiddle.net/)和[codepen](http://codepen.io)是两个很好的简单选项，可以用来托管示例。

* **告诉我们吧！** 一旦您的库准备好发布，发送一封电子邮件至[hello@p5js.org](mailto:hello@p5js.org)，附上链接和一些信息。我们将在[libraries page](http://p5js.org/libraries/)上包含它！
