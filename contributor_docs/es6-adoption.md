## ES6 Adoption
p5.js has recently adopted the ECMAScript 2015 (ES6) language specifications in order to reduce the complexity of the codebase, increase readability, and utilize features that facilitate elegant and effective coding practices for both newcomers and seasoned contributors. 

The transition process was initially [discussed](https://github.com/processing/p5.js/issues/3758) with the aim of migrating p5 to ES6, which later lead to a series of widespread syntactical changes in the codebase aligned with ES6 specifications. More info on the initial transition can be found [here](https://github.com/processing/p5.js/pull/3874). These changes consisted of minor modifications to the build system to facilitate processing, linting and testing the library based on ES6 standards, as well as major and ubiquitous syntactical modification in line with ES6 features.

It is worthy to note that as of writing this, these transformations are by no means complete, and do not reflect nor implement every possible feature of ES6. They are intended to facilitate a smoother transition to properly and efficiently utilize ES6 features if and when aligned with the community interests and standards. And serve to motivate contributors to gradually conform to the new style and features.

As such, we encourage all contributors to adhere to ES6 standards in their commits and pull requests as long as the utilized features:
1. Reduce syntactical ambiguity and idiosyncrasies associated with Javascript
2. Increase readability and code clarity
3. Refrain from code obfuscation and over-abstraction (to aid with readability)
4. Encourage proper coding practices for newcomers
5. Ease contribution and development
6. Do not sacrifice performance

There are many ES6 features that have not been utilized in p5 as of yet. However many areas of the library could benefit from such features which include but are not limited to: 
- Generators
- Number Type Checking
- Set/Map Data-Structures
- Typed Arrays
- [etc.](http://es6-features.org/)

It is worth noting that full compliance with ES6 standards demands the efforts of the community in all areas of p5 and due to its nature is a gradual process.

### Relevant Resources
- [Official ES6 Language Specification](https://www.ecma-international.org/ecma-262/6.0/)
- [ES6 Performance Comparison](http://incaseofstairs.com/six-speed/)
- [ES6 Features: Overview & Comparison](http://es6-features.org/)
- [You Don't Know JS: ES6 & Beyond (Book)](https://github.com/getify/You-Dont-Know-JS/tree/main/es6%20%26%20beyond)
- [Exploring ES6 (Book)](https://exploringjs.com/es6/)

### Performance
Although our goal is to comply and adhere to ES6 standards, it is important to note that p5 relies on performant code. As of writing this, many of the ES6 features are associated with performance-hits, bottlenecks, and overheads. Thus, it is important to refrain from using ES6 features that result in poor performing code. However, this seems to be a temporary concern given that browser engine developers are actively engaged in improving the performance of these new features. However, for the time being, it is important to prioritize performance over full compliance with ES6 standards, especially when syntactical changes do not result in major improvements aligned with the community goals. 

For a comparison of ES6 features' performance please refer to [this link](http://incaseofstairs.com/six-speed/).

For a discussion that highlights performance prioritization please have a look at the case of `forEach` [here](https://github.com/processing/p5.js/issues/3758#issuecomment-507922753).


### Browser Compatibility and Transpiling

p5 is built against [browserlist's](https://github.com/browserslist/browserslist) `last 2 versions` and `not dead`, in order to support the latest features while maintaining accessibility to a large userbase. To check supported browsers please visit [this link](https://browserl.ist/?q=last+2+versions). Moreover, as of now, p5 is [transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler) to the earlier ES5 standards using [Babel](https://babeljs.io/). This means that although we use ES6 or possibly more cutting edge features of Javascript, all these features are eventually converted to the earlier ES5 standards when the library is built for production (`p5-min.js`). This is to ensure compatibility with older browsers and mobile devices that fail to support these new features, such as Internet Explorer. So while it is important to be cognizant of browser compatibility, it is worth noting that ES6 features are eventually converted to the widely supported ES5 standards, and for the most part feature compatibility can be ignored thanks to the transpilation process. 

While reading this you might wonder: "*if ES6 is converted to ES5 what is the point of using these features?*" The answer to this very appropriate question is that ES5 will undoubtedly be replaced in the upcoming years by ES6. And perhaps when the time comes, there won't be a need to transpile the library back to ES5. Using ES6 standards primarily serves to simplify the code, increase readability and lower the barrier of entry for new developers while ensuring that p5 benefits from new features. Most importantly it makes the codebase future-proof.

### Compatibility vs. Performance

While for the most part browser compatibility can be ignored, the same is not true for performance. Conversion of ES6 to ES5 can be safely completed, but for most cases, there are performance penalties associated with the generated ES5 code. Again please refer to [this link](http://incaseofstairs.com/six-speed/) to see how code transpiled by Babel performs versus native ES5 implementations. 

### ES6 Coding Guidelines
- Abandoning `require` in favor of ES6 `import` [[Read More](https://exploringjs.com/es6/ch_modules.html#sec_importing-exporting-details)]
- Abandoning `module.exports` in favor of ES6 `export` [[Read More](https://exploringjs.com/es6/ch_modules.html#sec_importing-exporting-details)]
  - **Exception:** `app.js` still using `module.exports = p5;` due to build system limitations
- Use `const` always and switch to `let` only when reassignment is necessary [[Discussion](https://github.com/processing/p5.js/issues/3877)]
- Prototype members should all use function declarations instead of arrow functions [[Discussion](https://github.com/processing/p5.js/issues/3875)]
  - **Correct:** `p5.prototype.myMethod = function() { }`
  - **Incorrect:** `p5.prototype.myMethod = () => { }`
- Prototype members that need `.bind(this)` should be converted to arrow functions [[Discussion](https://github.com/processing/p5.js/issues/3875)]
  - **Correct:** `p5.prototype.myMethod = () => { }`
  - **Incorrect:** `p5.prototype.myMethod = function() {...}.bind(this);`
- Constants are imported such that syntax replicates old format: `constants.TWO_PI`


### Summary of Transformations
- [Modules: Export/Import](http://es6-features.org/#ValueExportImport)
- [Modules: Default & Wildcard](http://es6-features.org/#ValueExportImport)
- [Constants](http://es6-features.org/#Constants)
- [Block-Scoped Variables](http://es6-features.org/#BlockScopedVariables)
- [Rest Parameter](http://es6-features.org/#RestParameter)
- [Spread Operator](http://es6-features.org/#SpreadOperator)
- [Method Properties](http://es6-features.org/#MethodProperties)
- [Property Shorthand](http://es6-features.org/#PropertyShorthand)
- [Arrow Functions: Statement Bodies](http://es6-features.org/#StatementBodies)
- [Arrow Functions: Expression Bodies](http://es6-features.org/#ExpressionBodies)
- [Class Definition](http://es6-features.org/#ClassDefinition)
- [Class Inheritance](http://es6-features.org/#ClassInheritance)
- [Template Literals: String Interpolation](http://es6-features.org/#StringInterpolation)
- [Template Literals: Custom Interpolation](http://es6-features.org/#CustomInterpolation)
- [Default Parameter Values](http://es6-features.org/#DefaultParameterValues)
- [String Searching: Includes](http://es6-features.org/#StringSearching)
- [Array Searching: Includes (ES7)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [Iterators: For-Of](http://es6-features.org/#IteratorForOfOperator)

**Note:** Please Update the list above as new features are incorporated into the library.

 ### Current Issues
- [`#3883`](https://github.com/processing/p5.js/issues/3883): Failure to construct `new p5()` when using `combineModules` to create custom bundles. Global mode is unaffected and behaves as expected.
