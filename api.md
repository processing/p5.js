API
===

See [API progress page](https://github.com/lmccart/processing-js/blob/master/api-progress.md) for current and future implementation plans.

###Structure 

+ () (parentheses)
+ , (comma)
+ . (dot)
+ /* */ (multiline comment)
+ /** */ (doc comment)
+ // (comment)
+ ; (semicolon)
+ = (assign)
+ "[]" (array access)
+ {} (curly braces)
+ catch
+ draw()
+ exit()
+ false
+ finally
+ loop()
+ new
+ noLoop()
+ null
+ popStyle()
+ pushStyle()
+ redraw()
+ return
+ setup()
+ this
+ true
+ try

###Environment 
+ cursor()
+ displayHeight
+ displayWidth
+ focused
+ frameCount
+ frameRate()
+ getFrameRate()
+ height
+ noCursor()
+ size()
+ width


####String Functions
+ join()
+ match()
+ matchAll()
+ nf()
+ nfc()
+ nfp()
+ nfs()
+ split()
+ splitTokens()
+ trim()

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
+ mousePressed
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
+ ~~keyPressed~~
+ iskeyPressed()
+ keyReleased()
+ keyTyped()

####Files
+ ~~BufferedReader~~
+ createInput()
+ createReader()
+ loadBytes()
+ loadJSON()
+ ~~loadJSONArray()~~
+ ~~loadJSONObject()~~
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

