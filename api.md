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
+ [append()](http://processing.org/reference/append_.html)
+ [arrayCopy()](http://processing.org/reference/arrayCopy_.html)
+ [concat()](http://processing.org/reference/concat_.html)
+ [expand()](http://processing.org/reference/expand_.html)
+ [reverse()](http://processing.org/reference/reverse_.html)
+ [shorten()](http://processing.org/reference/shorten_.html)
+ [sort()](http://processing.org/reference/sort_.html)
+ [splice()](http://processing.org/reference/splice_.html)
+ [subset()](http://processing.org/reference/subset_.html)


###Control

####Relational Operators
+ [!= (inequality)](http://processing.org/reference/inequality.html)
+ [< (less than)](http://processing.org/reference/lessthan.html)
+ [<= (less than or equal to)](http://processing.org/reference/lessthanorequalto.html)
+ [== (equality)](http://processing.org/reference/equality.html)
+ [> (greater than)](http://processing.org/reference/greaterthan.html)
+ [>= (greater than or equal to)](http://processing.org/reference/greaterthanorequalto.html)

####Iteration
+ [for](http://processing.org/reference/for.html)
+ [while](http://processing.org/reference/while.html)

####Conditionals
+ [?: (conditional)](http://processing.org/reference/conditional.html)
+ [break](http://processing.org/reference/break.html)
+ [case](http://processing.org/reference/case.html)
+ [continue](http://processing.org/reference/continue.html)
+ [default](http://processing.org/reference/default.html)
+ [else](http://processing.org/reference/else.html)
+ [if](http://processing.org/reference/if.html)
+ [switch](http://processing.org/reference/switch.html)

####Logical Operators
+ [! (logical NOT)](http://processing.org/reference/logicalNOT.html)
+ [&& (logical AND)](http://processing.org/reference/logicalAND.html)
+ [|| (logical OR)](http://processing.org/reference/logicalOR.html)


####2D Primitives
+ [ellipse()](http://processing.org/reference/ellipse_.html)
+ [line()](http://processing.org/reference/line_.html)
+ [point()](http://processing.org/reference/point_.html)
+ [quad()](http://processing.org/reference/quad_.html)
+ [rect()](http://processing.org/reference/rect_.html)
+ [triangle()](http://processing.org/reference/triangle_.html)

####Curves
+ [bezier()](http://processing.org/reference/bezier_.html)


####Attributes
+ [ellipseMode()](http://processing.org/reference/ellipseMode_.html)
+ [noSmooth()](http://processing.org/reference/noSmooth_.html)
+ [rectMode()](http://processing.org/reference/rectMode_.html)
+ [smooth()](http://processing.org/reference/smooth_.html)
+ [strokeCap()](http://processing.org/reference/strokeCap_.html)
+ [strokeJoin()](http://processing.org/reference/strokeJoin_.html)
+ [strokeWeight()](http://processing.org/reference/strokeWeight_.html)

####Vertex
+ [beginShape()](http://processing.org/reference/beginShape_.html)
+ [bezierVertex()](http://processing.org/reference/bezierVertex_.html)
+ [endShape()](http://processing.org/reference/endShape_.html)
+ [quadraticVertex()](http://processing.org/reference/quadraticVertex_.html)
+ [vertex()](http://processing.org/reference/vertex_.html)


###Input

####Mouse
+ [mouseClicked()](http://processing.org/reference/mouseClicked_.html)
+ [mouseMoved()](http://processing.org/reference/mouseMoved_.html)
+ [mousePressed()](http://processing.org/reference/mousePressed_.html)
+ [isMousePressed()](http://processing.org/reference/mousePressed.html) - mousePressed is now isMousePressed()
+ [mouseReleased()](http://processing.org/reference/mouseReleased_.html)
+ [mouseX](http://processing.org/reference/mouseX.html)
+ [mouseY](http://processing.org/reference/mouseY.html)
+ [pmouseX](http://processing.org/reference/pmouseX.html)
+ [pmouseY](http://processing.org/reference/pmouseY.html)

####Keyboard
+ [key](http://processing.org/reference/key.html)
+ [keyCode](http://processing.org/reference/keyCode.html)
+ [keyPressed()](http://processing.org/reference/keyPressed_.html)
+ [iskeyPressed()](http://processing.org/reference/keyPressed.html) - keyPressed now isKeyPressed()
+ [keyReleased()](http://processing.org/reference/keyReleased_.html)
+ [keyTyped()](http://processing.org/reference/keyTyped_.html)

####Files
+ [loadJSON()](http://processing.org/reference/loadJSONObject_.html) - loadJSONObject() and loadJSONArray() now both loadJSON()
+ [loadStrings()](http://processing.org/reference/loadStrings_.html)


####Time & Date
+ [day()](http://processing.org/reference/day_.html)
+ [hour()](http://processing.org/reference/hour_.html)
+ [millis()](http://processing.org/reference/millis_.html)
+ [minute()](http://processing.org/reference/minute_.html)
+ [month()](http://processing.org/reference/month_.html)
+ [second()](http://processing.org/reference/second_.html)
+ [year()](http://processing.org/reference/year_.html)

###Output

####Text Area
+ [print()](http://processing.org/reference/println_.html)
+ [println()](http://processing.org/reference/println_.html)

####Image
+ [save()](http://processing.org/reference/save_.html) - opens image in a new tab rather than saving to hard drive

####Files
+ [createWriter()](http://processing.org/reference/createWriter_.html)
+ [PrintWriter](http://processing.org/reference/PrintWriter.html)
+ [saveStrings()](http://processing.org/reference/saveStrings_.html)


###Transform 
+ applyMatrix()
+ popMatrix()
+ printMatrix()
+ pushMatrix()
+ resetMatrix()
+ rotate()
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

