API
===

See [API progress page](https://github.com/lmccart/p5.js/blob/master/api-progress.md) for current and future implementation plans.

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
+ [draw](http://processing.org/reference/draw_.html) - same use but different syntax, see [Getting Started](https://github.com/lmccart/p5.js/wiki/Getting-Started) tutorial for more info.
+ [false](http://processing.org/reference/false.html)
+ [loop()](http://processing.org/reference/loop.html)
+ [new](http://processing.org/reference/new.html)
+ [noLoop()](http://processing.org/reference/noLoop_.html)
+ [null](http://processing.org/reference/null.html)
+ [popStyle](http://processing.org/reference/popStyle_.html)
+ [pushStyle](http://processing.org/reference/pushStyle_.html)
+ [redraw()](http://processing.org/reference/redraw_.html)
+ [return](http://processing.org/reference/return.html)
+ [setup](http://processing.org/reference/setup_.html) - same use but different syntax, see [Getting Started](https://github.com/lmccart/p5.js/wiki/Getting-Started) tutorial for more info.
+ [this](http://processing.org/reference/this.html)
+ [true](http://processing.org/reference/true.html)
+ [try](http://processing.org/reference/try.html)

###Environment 
+ [cursor()](http://processing.org/reference/cursor_.html) - cursor(img), cursor(img, x, y) not yet supported
+ [displayHeight](http://processing.org/reference/displayHeight.html)
+ [displayWidth](http://processing.org/reference/displayWidth.html)
+ [frameCount](http://processing.org/reference/frameCount.html)
+ [frameRate](http://processing.org/reference/frameRate.html)
+ [setFrameRate()](http://processing.org/reference/frameRate_.html) = frameRate() replaced with setFrameRate()
+ [height](http://processing.org/reference/height.html)
+ [noCursor()](http://processing.org/reference/noCursor_.html)
+ [width](http://processing.org/reference/width.html)


####String Functions
+ [join()](http://processing.org/reference/join_.html)
+ [match()](http://processing.org/reference/match_.html)
+ [matchAll()](http://processing.org/reference/matchAll_.html)
+ [nf()](http://processing.org/reference/nf_.html)
+ [nfc()](http://processing.org/reference/nfc_.html)
+ [nfp()](http://processing.org/reference/nfp_.html)
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

####Touch
+ touchStarted() - called whenever a touch event starts
+ touchMoved() - called on touch move events
+ touchEnded() - called whenever a touch event ends
+ touchX - the x coordinate of a single-touch event
+ touchY - the y coordinate of a single-touch event
+ touches - an array of touch objects for multi-touch events, each item has .x and .y accessors for location

####Keyboard
+ [key](http://processing.org/reference/key.html) - always returns caps!
+ keyCode - returns integer representation of key pressed
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

####Files
+ [createWriter()](http://processing.org/reference/createWriter_.html)
+ [PrintWriter](http://processing.org/reference/PrintWriter.html)
+ [saveStrings()](http://processing.org/reference/saveStrings_.html)


###Transform 
+ [applyMatrix()](http://processing.org/reference/applyMatrix_.html)
+ [popMatrix()](http://processing.org/reference/popMatrix_.html)
+ [printMatrix()](http://processing.org/reference/printMatrix_.html)
+ [pushMatrix()](http://processing.org/reference/pushMatrix_.html)
+ [resetMatrix()](http://processing.org/reference/resetMatrix_.html)
+ [rotate()](http://processing.org/reference/rotate_.html)
+ [scale()](http://processing.org/reference/scale_.html)
+ [shearX()](http://processing.org/reference/shearX_.html)
+ [shearY()](http://processing.org/reference/shearY_.html)
+ [translate()](http://processing.org/reference/translate_.html)

####Setting
+ [background()](http://processing.org/reference/background_.html)
+ [colorMode()](http://processing.org/reference/colorMode_.html)
+ [fill()](http://processing.org/reference/fill_.html)
+ [noFill()](http://processing.org/reference/noFill_.html)
+ [noStroke()](http://processing.org/reference/noStroke_.html)
+ [stroke()](http://processing.org/reference/stroke_.html)

####Creating & Reading
+ [alpha()](http://processing.org/reference/alpha_.html)
+ [blue()](http://processing.org/reference/blue_.html)
+ [brightness()](http://processing.org/reference/brightness_.html)
+ [color()](http://processing.org/reference/color_.html)
+ [green()](http://processing.org/reference/green_.html)
+ [hue()](http://processing.org/reference/hue_.html)
+ [lerpColor()](http://processing.org/reference/lerpColor_.html)
+ [red()](http://processing.org/reference/red_.html)
+ [saturation()](http://processing.org/reference/saturation_.html)

###Image 

+ [createImage()](http://processing.org/reference/createImage_.html)
+ [PImage](http://processing.org/reference/PImage.html) - resize(), set(), mask(), filter(), copy(), blend(), save() not yet implemented

####Loading & Displaying
+ [image()](http://processing.org/reference/image_.html)
+ [imageMode()](http://processing.org/reference/imageMode_.html)
+ [loadImage()](http://processing.org/reference/loadImage_.html) - src is a full URL to web hosted image, loadImage is currently asynchronous, can take a callback function as the last parameter to be called when image loads

####Pixels
+ [get()](http://processing.org/reference/get_.html) - only for a single pixel at x, y
+ [loadPixels()](http://processing.org/reference/loadPixels_.html)
+ [pixels[]](http://processing.org/reference/pixels.html)

###Rendering 
+ [createGraphics()](http://processing.org/reference/createGraphics_.html) - createGraphics() effectively replaces the previous size() function. It is used for onscreen drawing as well as offscreen drawing. See notes about PGraphics below. See additional information on the [DOM extensions page](https://github.com/lmccart/p5.js/blob/master/extensions.md).
+ [PGraphics](http://processing.org/reference/PGraphics.html) - PGraphics is used for onscreen drawing as well as offscreen drawing. Each new canvas (PGraphics) element is created using this function. Once created, you can use the dot operator to draw into that canvas as shown in the example (though beginDraw and endDraw are not required). You can also start calling drawing functions directly without using the dot operator. Use setContext() to switch between PGraphics elements if there are more than one.  See additional information on the [DOM extensions page](https://github.com/lmccart/p5.js/blob/master/extensions.md). 


###Typography 

####Loading & Displaying
+ [text()](http://processing.org/reference/text_.html) - only text(str, x, y) and text(str, x1, y1, x2, y2) supported. Note that both fill and stroke properties are applied to text (in Java Processing, only fill is applied). This allows outlining / stroking of text, but be aware that at small scales you may not see the fill color appear if stroke is on.

####Attributes
+ [textAlign()](http://processing.org/reference/text_.html)
+ textHeight() - calculates and returns the height of any character or text string
+ [textFont()](http://processing.org/reference/textFont_.html) - takes one argument, a string specifying the name of a font
+ [textLeading()](http://processing.org/reference/textLeading_.html)
+ [textSize()](http://processing.org/reference/text_.html)
+ textStyle() - NORMAL, ITALIC, or BOLD
+ [textWidth()](http://processing.org/reference/textWidth_.html)



###Math 

####[PVector](http://processing.org/reference/PVector.html)
+ [set](http://processing.org/reference/PVector_set_.html)
+ [get](http://processing.org/reference/PVector_get_.html)
+ [add](http://processing.org/reference/PVector_add_.html)
+ [sub](http://processing.org/reference/PVector_sub_.html)
+ [mult](http://processing.org/reference/PVector_mult_.html)
+ [div](http://processing.org/reference/PVector_div_.html)
+ [mag](http://processing.org/reference/PVector_mag_.html)
+ [magSq](http://processing.org/reference/PVector_magSq_.html)
+ [dot](http://processing.org/reference/PVector_dot_.html)
+ [cross](http://processing.org/reference/PVector_cross_.html)

####Operators
+ [% (modulo)](http://processing.org/reference/modulo.html)
+ [* (multiply)](http://processing.org/reference/multiply.html)
+ [*= (multiply assign)](http://processing.org/reference/multiplyassign.html)
+ [+ (addition)](http://processing.org/reference/addition.html)
+ [++ (increment)](http://processing.org/reference/increment.html)
+ [+= (add assign)](http://processing.org/reference/addassign.html)
+ [- (minus)](http://processing.org/reference/minus.html)
+ [-- (decrement)](http://processing.org/reference/decrement.html)
+ [-= (subtract assign)](http://processing.org/reference/subtractassign.html)
+ [/ (divide)](http://processing.org/reference/divide.html)
+ [/= (divide assign)](http://processing.org/reference/divideassign.html)

####Bitwise Operators
+ [& (bitwise AND)](http://processing.org/reference/bitwiseAND.html)
+ [<< (left shift)](http://processing.org/reference/leftshift.html)
+ [>> (right shift)](http://processing.org/reference/rightshift.html)
+ [| (bitwise OR)](http://processing.org/reference/bitwiseOR.html)

####Calculation
+ [abs()](http://processing.org/reference/abs_.html)
+ [ceil()](http://processing.org/reference/ceil_.html)
+ [constrain()](http://processing.org/reference/constrain_.html)
+ [dist()](http://processing.org/reference/dist_.html)
+ [exp()](http://processing.org/reference/exp_.html)
+ [floor()](http://processing.org/reference/floor_.html)
+ [lerp()](http://processing.org/reference/lerp_.html)
+ [log()](http://processing.org/reference/log_.html)
+ [mag()](http://processing.org/reference/mag_.html)
+ [map()](http://processing.org/reference/map_.html)
+ [max()](http://processing.org/reference/max_.html)
+ [min()](http://processing.org/reference/min_.html)
+ [norm()](http://processing.org/reference/norm_.html)
+ [pow()](http://processing.org/reference/pow_.html)
+ [round()](http://processing.org/reference/round_.html)
+ [sq()](http://processing.org/reference/sq_.html)
+ [sqrt()](http://processing.org/reference/sqrt_.html)

####Trigonometry
+ [acos()](http://processing.org/reference/acos_.html)
+ [asin()](http://processing.org/reference/asin_.html)
+ [atan()](http://processing.org/reference/atan_.html)
+ [atan2()](http://processing.org/reference/atan2_.html)
+ [cos()](http://processing.org/reference/cos_.html)
+ [degrees()](http://processing.org/reference/degrees_.html)
+ [radians()](http://processing.org/reference/radians_.html)
+ [sin()](http://processing.org/reference/sin_.html)
+ [tan()](http://processing.org/reference/tan_.html)

####Random
+ [random()](http://processing.org/reference/random_.html)

###Constants 

+ [HALF_PI](http://processing.org/reference/HALF_PI.html)
+ [PI](http://processing.org/reference/PI.html)
+ [QUARTER_PI](http://processing.org/reference/QUARTER_PI.html)
+ [TAU](http://processing.org/reference/TAU.html)
+ [TWO_PI](http://processing.org/reference/TWO_PI.html)


###[DOM extensions](https://github.com/lmccart/p5.js/blob/master/extensions.md)

There are a set of functions that have been added to create and manipulate parts of the HTML page beyond the graphics canvas. 
See documentation for all functions below on the [DOM extensions page](https://github.com/lmccart/p5.js/blob/master/extensions.md)!

+ AUTO

####Create
+ createElement(html)
+ createDOMImage(src)
+ createGraphics(w, h)

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

