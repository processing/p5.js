API
===

See [API progress page](https://github.com/lmccart/processing-js/blob/master/api-progress.md) for current and future implementation plans.

For now these functions link to the current [Processing.org reference](http://processing.org/reference), which approximately represents their use and functionality. Important differences when used in JavaScript mode are noted after the link, when necessary. Note that the examples shown on the Processing.org pages are for current Java mode and will not run in JS version without modification.

###Structure 

+ [() (parentheses)](http://processing.org/reference/parentheses.html)
+ [, (comma)](http://processing.org/reference/comma.html)
+ [. (dot)](http://processing.org/reference/dot.html)
+ [/* */ (multiline comment)](http://processing.org/reference/multilinecomment.html)
+ [// (comment)](http://processing.org/reference/comment.html)
+ [; (semicolon)](http://processing.org/reference/semicolon.html)
+ [= (assign)](http://processing.org/reference/assign.html)
+ [\[\] (array access)](http://processing.org/reference/array.html) - operator is used to specify a location within an array, though array formulation shown differs for JS.
+ [{} (curly braces)](http://processing.org/reference/curlybraces.html)
+ [catch](http://processing.org/reference/catch.html)
+ [draw](http://processing.org/reference/draw_.html) - same use but different syntax, see [Getting Started](https://github.com/lmccart/processing-js/wiki/Getting-Started) tutorial for more info.
+ [false](http://processing.org/reference/false.html)
+ [loop()](http://processing.org/reference/loop.html)
+ [new](http://processing.org/reference/new.html)
+ [noLoop()](http://processing.org/reference/noLoop_.html)
+ [null](http://processing.org/reference/null.html)
+ [redraw()](http://processing.org/reference/redraw_.html)
+ [return](http://processing.org/reference/return.html)
+ [setup](http://processing.org/reference/setup_.html) - same use but different syntax, see [Getting Started](https://github.com/lmccart/processing-js/wiki/Getting-Started) tutorial for more info.
+ [this](http://processing.org/reference/this.html)
+ [true](http://processing.org/reference/true.html)
+ [try](http://processing.org/reference/try.html)

###Environment 
+ [cursor()](http://processing.org/reference/cursor_.html) - cursor(img), cursor(img, x, y) not yet supported
+ [displayHeight](http://processing.org/reference/displayHeight.html)
+ [displayWidth](http://processing.org/reference/displayWidth.html)
+ [frameCount](http://processing.org/reference/frameCount.html)
+ [frameRate()](http://processing.org/reference/frameRate_.html)
+ [getFrameRate()](http://processing.org/reference/frameRate.html) = frameRate replaced with getFrameRate()
+ [height](http://processing.org/reference/height.html)
+ [noCursor()](http://processing.org/reference/noCursor_.html)
+ [width](http://processing.org/reference/width.html)


####String Functions
+ [join()](http://processing.org/reference/join_.html)
+ [match()](http://processing.org/reference/match_.html)
+ [nf()](http://processing.org/reference/nf_.html)
+ [nfc()](http://processing.org/reference/nfc_.html) - for single number, not array
+ [nfp()](http://processing.org/reference/nfp_.html) - for single number, not array
+ [nfs()](http://processing.org/reference/nfs_.html)
+ [split()](http://processing.org/reference/split_.html)
+ [splitTokens()](http://processing.org/reference/splitTokens_.html)
+ [trim()](http://processing.org/reference/trim_.html)

####Array Functions
+ append()
+ arrayCopy()
+ concat()
+ expand()
+ reverse()
+ shorten()
+ sort()
+ splice()
+ subset()


###Control

####Relational Operators
+ != (inequality)
+ < (less than)
+ <= (less than or equal to)
+ == (equality)
+ > (greater than)
+ >= (greater than or equal to)

####Iteration
+ for
+ while

####Conditionals
+ ?: (conditional)
+ break
+ case
+ continue
+ default
+ else
+ if
+ switch

####Logical Operators
+ ! (logical NOT)
+ && (logical AND)
+ || (logical OR)


###Shape 
+ createShape()
+ loadShape()
+ PShape

####2D Primitives
+ arc()
+ ellipse()
+ line()
+ point()
+ quad()
+ rect()
+ triangle()

####Curves
+ bezier()
+ bezierDetail()
+ bezierPoint()
+ bezierTangent()
+ curve()
+ curveDetail()
+ curvePoint()
+ curveTangent()
+ curveTightness()

####_3D Primitives_
+ _box()_
+ _sphere()_
+ _sphereDetail()_

####Attributes
+ ellipseMode()
+ noSmooth()
+ rectMode()
+ smooth()
+ strokeCap()
+ strokeJoin()
+ strokeWeight()

####Vertex
+ beginContour()
+ beginShape()
+ bezierVertex()
+ curveVertex()
+ endContour()
+ endShape()
+ quadraticVertex()
+ vertex()

####Loading & Displaying
+ shape()
+ shapeMode()


###Input

####Mouse
+ mouseButton
+ mouseClicked()
+ mouseDragged()
+ mouseMoved()
+ mousePressed()
+ isMousePressed()
+ mouseReleased()
+ mouseWheel()
+ mouseX
+ mouseY
+ pmouseX
+ pmouseY

####Keyboard
+ key
+ keyCode
+ keyPressed()
+ iskeyPressed()
+ keyReleased()
+ keyTyped()

####Files
+ createInput()
+ createReader()
+ loadBytes()
+ loadJSON()
+ loadStrings()
+ loadTable()
+ loadXML()
+ open()
+ parseXML()
+ saveTable()
+ selectFolder()
+ selectInput()


####Time & Date
+ day()
+ hour()
+ millis()
+ minute()
+ month()
+ second()
+ year()

###Output

####Text Area
+ println()

####Image
+ save()

####Files
+ beginRaw()
+ beginRecord()
+ createOutput()
+ createWriter()
+ endRaw()
+ endRecord()
+ PrintWriter
+ saveBytes()
+ saveJSONArray()
+ saveJSONObject()
+ saveStream()
+ saveStrings()
+ saveXML()
+ selectOutput()


###Transform 
+ applyMatrix()
+ popMatrix()
+ printMatrix()
+ pushMatrix()
+ resetMatrix()
+ rotate()
+ _rotateX()_
+ _rotateY()_
+ _rotateZ()_
+ scale()
+ shearX()
+ shearY()
+ translate()

####Setting
+ background()
+ clear()
+ colorMode() // pend test this?
+ fill()
+ noFill()
+ noStroke()
+ stroke()

####Creating & Reading
+ alpha()
+ blue()
+ brightness()
+ color()
+ green()
+ hue()
+ lerpColor()
+ red()
+ saturation()

###Image 

+ createImage()
+ PImage - _mostly_

####Loading & Displaying
+ image()
+ imageMode()
+ loadImage()
+ noTint()
+ requestImage()
+ tint()

####Textures
+ texture()
+ textureMode()
+ textureWrap()

####Pixels
+ blend()
+ copy()
+ filter()
+ get()
+ loadPixels()
+ pixels[]
+ set()
+ updatePixels()

###Rendering 
+ blendMode()
+ createGraphics()
+ PGraphics

####Shaders
+ loadShader()
+ PShader
+ resetShader()
+ shader()

###Typography 

+ PFont

####Loading & Displaying
+ createFont()
+ loadFont()
+ text()
+ textFont()

####Attributes
+ textAlign()
+ textLeading()
+ textMode()
+ textSize()
+ textWidth()

####Metrics
+ textAscent()
+ textDescent()


###Math 

+ PVector

####Operators
+ % (modulo)
+ * (multiply)
+ *= (multiply assign)
+ + (addition)
+ ++ (increment)
+ += (add assign)
+ - (minus)
+ -- (decrement)
+ -= (subtract assign)
+ / (divide)
+ /= (divide assign)

####Bitwise Operators
+ & (bitwise AND)
+ << (left shift)
+ >> (right shift)
+ | (bitwise OR)

####Calculation
+ abs()
+ ceil()
+ constrain()
+ dist()
+ exp()
+ floor()
+ lerp()
+ log()
+ mag()
+ map()
+ max()
+ min()
+ norm()
+ pow()
+ round()
+ sq()
+ sqrt()

####Trigonometry
+ acos()
+ asin()
+ atan()
+ atan2()
+ cos()
+ degrees()
+ radians()
+ sin()
+ tan()

####Random
+ noise()
+ noiseDetail()
+ noiseSeed()
+ random()
+ randomGaussian()
+ randomSeed()

###Constants 

+ HALF_PI
+ PI
+ QUARTER_PI
+ TAU
+ TWO_PI


###DOM
+ AUTO
// Create

####Create
+ createElement(html)
+ createImage(src)
+ createCanvas(w, h)


####Access
+ get(id)
+ get(class)

####Set context
+ context(id)
+ context(obj)

####PElement
+ id(id)
+ class(class)
+ size(w, h)
+ position(x, y)
+ style(style)
+ html(html)
+ show()
+ hide()

####Listeners
+ mousePressed(function)
+ mouseOver(function)
+ mouseOut(function)

