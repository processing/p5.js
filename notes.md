#Starting points#


##Research##

[Ruby-Processing](https://github.com/jashkenas/ruby-processing) - Ruby syntax but utilizes the ease of Processing for drawing

+ Nice workthru of learning processing examples



##Questions##

What is unique about javascript?
What are main ways it diverges/differs from java/processing?


##js great parts##
+ Functions as first class objects
	Functions in Simplified JavaScript are lambdas with lexical scoping.
+ Dynamic objects with prototypal inheritance
	Objects are class-free. We can add a new member to any object by ordinary assign- ment. An object can inherit members from another object.
+ Object literals and array literals
	This is a very convenient notation for creating new objects and arrays. JavaScript literals were the inspiration for the JSON data interchange format.


##js messy/confusing parts##

+ global vars
+ scope
+ semicolon insertion
+ unicode
+ typeof: null (better - my_value === null), testing for objectness (use truth test)
+ parseInt use radix (maybe imply with js-processing, unless otherwise specified)
+ diff add behavior depending on type of obj (nums vs strings)
+ floating point
+ NaN (use own number test something like 
		var isNumber = function isNumber(value) { return typeof value === 'number' &&
      isFinite(value);
    })
+ fake arrs
+ falsy vals
+ hasOwnProperty
+ === !== vs == !=
+ switch fall through
+ function foo() {} vs var foo = function foo() {}, hoisting
+ new: typed wrappers (eg: new String), missing new with object creation converts to fxn call (avoid new if possible)
+ void