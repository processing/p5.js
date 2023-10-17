# A Typographic Revamp for p5.js

```jsx
I replied and opened some discussions about p5 typography. 
```

# **Reflections on GSoC Experience and Future Endeavors**

During my time in the Google Summer of Code (GSoC) program, I had the opportunity to work on typography-related tasks in p5.js. While my contributions may not have resulted in numerous pull requests within the program's limited timeframe, I gained valuable insights into the intricacies of this specialized section within p5.js. Typography is a field that intersects with various technical challenges, including its reliance on opentype.js, integration with the HTML Canvas API, support for WEBGL, internationalization concerns, and domain-specific knowledge.

## **Dependency on Opentype.js**

One of the key challenges I encountered was p5.js's heavy reliance on an external library called opentype.js. This library is crucial for parsing fonts into vertices, enabling p5.js to render text as shapes. While it works well for p5.font functions like **`textToPoint`** and WEBGL's **`text()`** function, it limits p5.js's compatibility with the native HTML Canvas API.

## **HTML Canvas API**

As mentioned earlier, p5.js is built on top of the **`<canvas>`** element and its associated functions. However, typography in p5.js differs significantly due to its reliance on opentype.js. This dependence forces us to reinvent the wheel for many functions that are already supported in the HTML Canvas API. For instance, setting text alignment in HTML Canvas is straightforward:

```jsx
ctx.textAlign = "left";
```

In p5.js, the process is more complex but also naive:

```jsx
switch (this._textAlign) {
  case constants.CENTER:
    x += maxWidth / 2;
    break;
  case constants.RIGHT:
    x += maxWidth;
    break;
}
```

This divergence becomes challenging as HTML Canvas evolves with new features like **`letter-spacing`**, **`kerning`**, **`font-variant`**, and **`word-spacing`**, which are already available and can be directly accessed in the native API.

## **WEBGL Challenges**

Shockingly, there is no native solution for rendering text in WEBGL, which is likely why opentype.js was initially adopted in p5.js. However, introducing new features such as **`letter-spacing`** or **`kerning`** in 2D typography means extending support to 3D typography in WEBGL, a complex and time-consuming task, especially when considering internationalization.

## **Internationalization Challenges**

Typography functions in p5.js need to handle a wide array of languages and their unique characteristics. Achieving international support, especially for languages with right-to-left scripts like Arabic, poses a significant challenge. Existing solutions, like setting **`ctx.textAlign = “right”`** in HTML Canvas, are already effective for certain languages. However, it is crucial to ensure that any new feature, such as **`textAlign(JUSTIFIED)`**, considers the complexities of various languages before implementation.

## **Domain Knowledge**

One limitation I faced during my GSoC experience was my proficiency in only Mandarin and English. Testing and debugging for languages with which I wasn't familiar, like Arabic or Hindi, proved challenging. Addressing issues like hyphenation rules across languages requires a deep understanding of typography and linguistic nuances. It became evident that collaboration with experts in international languages and typography is essential to tackle these challenges effectively.

# **Final Reflections**

While I may not have introduced numerous new functions during my GSoC tenure, I take pride in gaining a profound understanding of p5.js's underlying mechanisms. My contributions initiated important discussions and kept critical conversations alive. It's worth noting that the GSoC's three-month timeframe felt rushed for tackling complex international and typographic challenges.

In hindsight, it seems that a more comprehensive approach, involving robust meetings or discussions, is needed to collectively address the issues outlined above. These challenges also raise questions about accessibility, biases, and prioritization in the development process.

In conclusion, I am grateful for my time working with p5.js typography during GSoC. It marked the beginning of a journey towards addressing complex typographic issues and highlights the need for continued collaboration and exploration in this domain.

---

## Existing Issues

| Topic | Status | Coded? | PR? | Pushed? |
| --- | --- | --- | --- | --- |
| Slow rendering | Done | De-prioritize |  |  |
| textBounds not in ref | Done | Not Typographic related |  |  |
| textWidth() wrong line break | Done | V |  | V |
| textToPoints() | Done | V |  | V |

## Features Requested

```jsx
If they're not dependent/relevant, we should do seperate PRs.
```

| Topic | Status | Coded? | PR? | Pushed? |
| --- | --- | --- | --- | --- |
| textLineHeight | Done |  |  | x |
| textHeight() | Done |  | x | x |
| variableFonts() | Processing |  |  | x |
| textAlign(JUSTIFIED) | Processing |  | x | x |
| miterLimits()
a triangle with mouseX… | Example | V |  | x |

## Discussions

[https://github.com/processing/p5.js/issues/6392](https://github.com/processing/p5.js/issues/6392)

[https://github.com/processing/p5.js/issues/6391](https://github.com/processing/p5.js/issues/6391)

## Experiments

### Multi-column Text

[p5.js Web Editor](https://editor.p5js.org/munusshih/sketches/ebckpdHNw)

### Sliced Font

[p5.js Web Editor](https://editor.p5js.org/munusshih/sketches/a5Nx_zhE0)

### TextHeight

[p5.js Web Editor](https://editor.p5js.org/munusshih/sketches/4BwL7q2Fe)