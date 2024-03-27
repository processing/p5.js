#  p5.js में  इन - लाइन दस्तावेज़ जोड़ना

पी5.js स्रोत कोड में इनलाइन दस्तावेज़ीकरण जोड़कर, संदर्भ स्वचालित रूप से उत्पन्न किया जा सकता है। इस दस्तावेज़ीकरण में शामिल करने के लिए टैग और जानकारी को सही रूप से स्वरूपित करने के लिए नीचे दिए गए हैं। दस्तावेज़ीकरण स्रोत कोड से स्वचालित रूप से निर्मित होता है, इसलिए आपके दस्तावेज़ीकरण को संदर्भ में दिखने में कुछ दिनों तक का समय लग सकता है। यदि कुछ दिनों से अधिक समय हो गया है या आपको अन्य समस्याएँ हो रही हैं, तो [hello@p5js.org](mailto:hello@p5js.org)g पर ईमेल करें।

यहां बुनियादी जानकारी है, yuidoc स्टाइल के अधिक विशेषताएँ [यहां देखें](http://yui.github.io/yuidoc/syntax/index.html)। 
**कृपया 80 कॉलम तक रेखा लंबी न करें, नई लाइनें शुरू करें जब यह चला जाए।**

[आवश्यक उदाहरणों की सूची](https://github.com/processing/p5.js/issues/2865) (आप इस सूची को बना कर देख सकते हैं या लॉग संदेशों को ग्रंट के साथ पुनर्निर्माण करके सबसे अद्यतित सूची देख सकते हैं)

## तत्व प्रकार और विवरण निर्दिष्ट करें

तत्व 4 प्रकार के होते हैं: `@class`, `@method`, `@property`, `@event`।
दस्तावेज़ में तत्व को प्रदर्शित करने के लिए आपको इनमें से किसी एक को उसके बाद तत्व के नाम के साथ निर्दिष्ट करना होगा। विवरण शीर्ष पर दिखना चाहिए. कुछ स्वरूपण युक्तियाँ:

*  आप विवरण पाठ को प्रारूपित करने के लिए मार्कडाउन सिंटैक्स का उपयोग कर सकते हैं।
*  किसी भी फ़ंक्शन, वेरिएबल, या स्थिर नाम को दोनों तरफ सिंगल कोट्स का उपयोग करके `monospaced` किया जाना चाहिए।
* डबल लाइन ब्रेक को नए पैराग्राफ के रूप में पहचाना जाता है। आपको `<br><br>` टैग डालने की आवश्यकता नहीं है।
* जब संभव हो, अन्य फ़ंक्शन या वेरिएबल नामों का उल्लेख करते समय अन्य फ़ाइलों से लिंक करें। उदाहरण के लिए, आप [loadImage](https://github.com/processing/p5.js/blob/main/src/image/loading_displaying.js#L21) के विवरण में लिंक की गई प्रीलोड विधि देख सकते हैं।
* अधिक सिंटैक्स जानकारी के लिए यहां [yuidoc का संदर्भ](http://yui.github.io/yuidoc/syntax/index.html#basic-requirements) है।

```js
   /**
    * The x component of the vector
    * @property x
    * @type {Number}
    */
    this.x = x || 0;
```

```js

  /**
   * Draw an arc
   *
   * If x, y, width, height, start and stop are the only params provided, draws an
   * open pie.
   * If mode is provided draws the arc either open, chord or pie, dependant
   * on the variable provided
   *
   * @param  {Number} x x-coordinate of the arc's ellipse
   * @param  {Number} y y-coordinate of the arc's ellipse
   * @param  {Number} width width of the arc's ellipse by default
   * @param  {Number} height height of the arc's ellipse by default
   * @param  {Number} start angle to start the arc, specified in radians
   * @param  {Number} stop angle to stop the arc, specified in radians
   * @param  {String} [mode] optional parameter to determine the way of drawing the arc
   */
```

```js
  /**
   *
   * Calculates the magnitude (length) of the vector and returns the result
   * as a float (this is simply the equation <em>sqrt(x*x + y*y + z*z)</em>.)
   *
   * @method mag
   * @return {number} magnitude (length) of the vector
   */
   PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
   };
```

## पैरामीटर निर्दिष्ट करें

विधियों के लिए, कोई भी `@params` निर्दिष्ट किया जाना चाहिए। उन्हें रिक्त स्थान, टैब आदि के साथ स्वरूपित नहीं किया जाना चाहिए और मानक का पालन करना चाहिए:
```
@param {type} name Description here, no problem how long.
```

यदि पैरामीटर वैकल्पिक है, तो नाम के चारों ओर वर्गाकार कोष्ठक जोड़ें:

```
@param {type} [name] Description here.
```

यदि पैरामीटर [`constents.js`](https://github.com/processing/p5.js/blob/main/src/core/constents.js) में परिभाषित एक या अधिक मान लेता है,
तो प्रकार को `{स्थिर}` के रूप में निर्दिष्ट किया जाना चाहिए और मान्य मानों को `दोनों में से किसी एक' कीवर्ड के बाद टिप्पणी में गिना जाना चाहिए, उदाहरण के लिए:
```
@param {Constant} horizAlign horizontal alignment, either LEFT, CENTER, or RIGHT
```
## रिटर्न प्रकार निर्दिष्ट करें
`@return` `@params` के समान है, लेकिन नाम के बिना। यह `@method` में अंतिम तत्व होना चाहिए। JS प्रकार हैं: स्ट्रिंग, संख्या, बूलियन, ऑब्जेक्ट, ऐरे, नल और अपरिभाषित। यदि कोई रिटर्न प्रकार नहीं है, तो `@return` शामिल न करें।
```
@return {type} Description of the data returned.
```
यदि विधि मूल ऑब्जेक्ट लौटाती है, तो आप `@return` को छोड़ सकते हैं और इसके बजाय इस पंक्ति को जोड़ सकते हैं:
```
@chainable
```
## अतिरिक्त हस्ताक्षर
यदि किसी विधि में एकाधिक संभावित पैरामीटर विकल्प हैं, तो आप प्रत्येक को व्यक्तिगत रूप से निर्दिष्ट कर सकते हैं। उदाहरण के लिए, "सिंटैक्स" के अंतर्गत [पृष्ठभूमि](http://p5js.org/reference/#p5/background) के उदाहरण देखें। ऐसा करने के लिए, उपरोक्त दिशानिर्देशों का उपयोग करके पहले हस्ताक्षर के रूप में सूचीबद्ध करने के लिए एक संस्करण चुनें। दस्तावेज़ीकरण ब्लॉक के अंत में, आप नीचे दिए गए उदाहरण का अनुसरण करते हुए, प्रत्येक अपने स्वयं के ब्लॉक में अतिरिक्त हस्ताक्षर जोड़ सकते हैं।
```js
/**
 * @method background
 * @param {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex
 * @param {Number} [a] alpha value
 */

/**
 * @method background
 * @param {Number} gray specifies a value between white and black
 * @param {Number} [a]
 */
```
टिप्पणियाँ:
* यदि किसी पैरामीटर का विवरण पहले दिया गया था, जैसे इस मामले में `a`, तो आपको उसके विवरण को दोबारा लिखने की आवश्यकता नहीं है।
* यदि दो हस्ताक्षरों के बीच एकमात्र अंतर वैकल्पिक पैरामीटर जोड़ने का है तो अलग हस्ताक्षर बनाना आवश्यक नहीं है।
* आप इस इनलाइन के दो उदाहरण [बैकग्राउंड](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/setting.js#L106) और [color](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/creating_reading.js#L241) के सोर्स कोड में देख सकते हैं। 
## अन्य टैग निर्दिष्ट करें
यदि कोई गुण या चर एक स्थिरांक है तो `@final` का उपयोग करें:
```js
    /**
     * PI is a mathematical constant with the value 3.14159265358979323846.
     * @property PI
     * @type Number
     * @final
     */
    PI: PI
```
यदि कोई संपत्ति या वैरिएबल एक निजी वैरिएबल है तो `@private` का उपयोग करें (डिफ़ॉल्ट `@public` है इसलिए निर्दिष्ट करने की कोई आवश्यकता नहीं है)।
```js
    /**
     * _start calls preload() setup() and draw()
     * 
     * @method _start
     * @private
     */
     p5.prototype._start = function () {
```

## फ़ाइलों के लिए मॉड्यूल निर्दिष्ट करें

प्रत्येक *फ़ाइल* के शीर्ष पर एक `@मॉड्यूल` टैग होना चाहिए। मॉड्यूल को जावास्क्रिप्ट फ़ाइलों (या require.js मॉड्यूल) के अनुरूप होना चाहिए। वे वस्तुओं की सूची में समूह के रूप में काम कर सकते हैं। [यहां देखें](https://p5js.org/reference/#collection-list-nav) (मॉड्यूल रंग, छवि, IO, PVECTOR, आदि हैं)।

```js
/**
 * @module image
 */
define(function (require) {
  // code here
};
```


## Constructors

Constructors को `@class` से परिभाषित किया गया है। प्रत्येक कंस्ट्रक्टर के पास टैग `@class` होना चाहिए जिसके बाद क्लास का नाम, साथ ही टैग `@constructor`, और कोई भी `@param` टैग होना चाहिए।

```js
  /**
   * The p5 constructor function.
   * @class p5
   * @constructor
   * @param {Object} [node] The canvas element. A canvas will be added to the DOM if not provided.
   * @param {Object} [sketch] The sketch object.
   */
   const p5 = function(node, sketch) {
     ...
   }
```

## कोड नमूने जोड़ना

आप `@example` के साथ कोड नमूने जोड़ सकते हैं। कोड नमूने `<code></code>` टैग के बीच रखे जाने चाहिए जिनमें टिप्पणियाँ भी शामिल हों। शैली पर अधिक जानकारी के लिए कृपया [दस्तावेज़ीकरण शैली मार्गदर्शिका](./documentation_style_guide.md) की समीक्षा करें।

जब तक अन्यथा `setup()` फ़ंक्शन के साथ निर्दिष्ट न किया जाए, प्रत्येक `<code>` ब्लॉक स्वचालित रूप से ग्रे पृष्ठभूमि के साथ 100x100 पिक्सेल के कैनवास पर चलता है। यदि आपका कोड नमूना कैनवास के अलावा अन्य HTML तत्व बनाता है, तो उन्हें 100 पिक्सेल की चौड़ाई के साथ प्रस्तुत किया जाएगा।

```
@example
<div>
<code>
arc(50, 55, 50, 50, 0, HALF_PI);
noFill();
arc(50, 55, 60, 60, HALF_PI, PI);
arc(50, 55, 70, 70, PI, PI + QUARTER_PI);
arc(50, 55, 80, 80, PI + QUARTER_PI, TWO_PI);
describe('A shattered outline of an ellipse created using four arcs.');
</code>
</div>
```

आपके पास एक फ़ंक्शन के लिए कई उदाहरण हो सकते हैं, बस सुनिश्चित करें कि आपके पास केवल हैं
एक `@example` जिसके बाद प्रत्येक उदाहरण की अपनी `<div>` रैपिंग अलग हो गई है
एक लाइन ब्रेक से.

```
@example
<div>
<code>
arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
describe('An ellipse created using an arc with its top right open.');
</code>
</div>
<div>
<code>
arc(50, 50, 80, 80, 0, PI, OPEN);
describe('The bottom half of an ellipse created using arc.');
</code>
</div>
```

यदि आप नहीं चाहते कि उदाहरण आपके कोड को निष्पादित करे (यानी आप चाहते हैं कि कोड केवल दिखे), तो `"norender"` वर्ग को `<div>` में शामिल करें:
```
@example
<div class="norender">
<code>
arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
describe('ellipse created using arc with its top right open');
</code>
</div>
```

यदि आप नहीं चाहते कि उदाहरण को बिल्ड परीक्षणों के भाग के रूप में चलाया जाए (उदाहरण के लिए, यदि उदाहरण के लिए उपयोगकर्ता इंटरैक्शन की आवश्यकता है, या हेडलेस-क्रोम परीक्षण ढांचे द्वारा समर्थित कार्यक्षमता का उपयोग नहीं करता है), तो वर्ग `"नोटेस्ट"` को शामिल करें `<div>` :

```
@example
<div class='norender notest'><code>
function setup() {
  let c = createCanvas(100, 100);
  saveCanvas(c, 'myCanvas', 'jpg');
}
</code></div>
```
यदि आपको बाहरी संपत्ति फ़ाइलों से लिंक करने की आवश्यकता है, तो उन्हें [/docs/yuidoc-p5-theme/assets](https://github.com/processing/p5.js/tree/main/docs/yuidoc-p5-theme/assets) में डालें और फिर उन्हें कोड में "assets/filename.ext" के साथ लिंक करें। [टिंट उदाहरण](http://p5js.org/reference/#/p5/tint) देखें।


### वर्णन () का उपयोग करके एक कैनवास विवरण जोड़ें
अंत में, आपके द्वारा जोड़े गए प्रत्येक उदाहरण के लिए, आपको कैनवास के लिए स्क्रीन-रीडर सुलभ विवरण बनाने के लिए उदाहरण में p5.js फ़ंक्शन `describe()` का उपयोग करना आवश्यक है। केवल एक पैरामीटर शामिल करें: कैनवास पर क्या हो रहा है इसका संक्षिप्त विवरण वाली एक स्ट्रिंग। दूसरा पैरामीटर न जोड़ें.
```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
  decribe('A vertical line moves randomly from left to right.');
}
</code>
</div>
<div>
<code>
let noiseScale = 0.02;
function draw() {
  background(0);
  for (let x = 0; x < width; x += 1) {
    let noiseVal = noise((mouseX + x) * noiseScale, mouseY * noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY + noiseVal * 80, x, height);
  }
  describe('A horizontal wave pattern moves in the opposite direction of the mouse.');
}
</code>
</div>
```
`वर्णन()` पर अधिक जानकारी के लिए [वेब एक्सेसिबिलिटी योगदानकर्ता दस्तावेज़](https://p5js.org/contributor-docs/#/web_accessibility?id=user-generated-accessible-canvas-descriptions) पर जाएं।

पिछले दस्तावेज़ दिशानिर्देशों में स्क्रीन-रीडर सुलभ कैनवास विवरण बनाने के लिए [alt-text](https://moz.com/learn/seo/alt-text) जोड़ने की आवश्यकता थी। अब इसकी अनुशंसा नहीं की जाती. हमेशा `वर्णन()` का प्रयोग करें। पहले, किसी दिए गए फ़ंक्शन के लिए सभी उदाहरणों के अंत में `@alt` टैग के साथ ऑल्ट-टेक्स्ट जोड़ा गया था (प्रत्येक के तहत एक व्यक्तिगत `@alt` टैग नहीं), और विवरण को अलग करने के लिए एक लाइन ब्रेक जोड़ा गया था एकाधिक उदाहरण.

```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
}
</code>
</div>
<div>
<code>
let noiseScale = 0.02;
function draw() {
  background(0);
  for (let x = 0; x < width; x += 1) {
    let noiseVal = noise((mouseX + x) * noiseScale, mouseY * noiseScale);
    stroke(noiseVal * 255);
    line(x, mouseY + noiseVal * 80, x, height);
  }
}
</code>
</div>
@alt
vertical line moves left to right with updating noise values.
horizontal wave pattern effected by mouse x-position & updating noise values.
```

## तरीकों के लिए टेम्पलेट
यहां एक अच्छी तरह से प्रलेखित विधि का एक उदाहरण दिया गया है। एक नई विधि बनाने के लिए, आप [इस टेम्पलेट](https://github.com/processing/p5.js/tree/main/contributor_docs/method.example.js) का उपयोग कर सकते हैं। टेक्स्ट को अपनी विधि के वेरिएबल से बदलें और शेष को हटा दें।

![Image showing inline documentation example for methods](https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/images/method-template-example.png)


## दस्तावेज़ तैयार करना

* सभी आवश्यक स्थानीय फ़ाइलों के साथ-साथ स्रोत कोड से संदर्भ की एक प्रति उत्पन्न करने के लिए पहले एक बार `npm run docs` चलाएँ। जब भी आप yuidoc संदर्भ पृष्ठ के पीछे कोर JS फ़ाइलों में परिवर्तन करें तो इसे फिर से चलाएँ। ये yuidoc-p5-थीम फ़ोल्डर में स्थित फ़ाइलों में परिवर्तन हैं, src में इनलाइन दस्तावेज़ परिवर्तन नहीं हैं।

* यदि आपने केवल स्रोत कोड में परिवर्तन किया है, तो आप केवल `npm run grunt yui` चला सकते हैं, हालाँकि `npm run grunt yui:build` भी काम करेगा। 

* आप साइट का लाइव पूर्वावलोकन लॉन्च करने के लिए `npm run docs:dev` चला सकते हैं जो आपके द्वारा हर बार बदलाव करने पर अपडेट हो जाएगा। (परिवर्तन करने के बाद उन्हें प्रदर्शित करने के लिए आपको पृष्ठ को ताज़ा करना होगा।)

बिल्ड संदर्भ दस्तावेज़/संदर्भ में पाया जा सकता है। इसे स्थानीय रूप से पूर्वावलोकन करने के लिए, `npm run grunt yui:dev` चलाएँ और इसे http://localhost:9001/docs/reference/ के रूप में देखें।



## स्पेनिश भाषा संस्करण

[स्पेनिश संस्करण](http://p5js.org/es/reference) थोड़ा अलग तरीके से बनाया गया है। इस सामग्री को अद्यतन करने के लिए यहां [निर्देश](https://github.com/processing/p5.js-website/blob/main/contributor_docs/i18n_contribution.md) हैं।