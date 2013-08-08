API
===

See [API progress page](https://github.com/lmccart/processing-js/blob/master/api-progress.md) for current and future implementation plans.

###Structure 

+ println() (parentheses)println
+ println, (comma)println
+ println. (dot)println
+ println/* */ (multiline comment)println
+ println/** */ (doc comment)println
+ println// (comment)println
+ println; (semicolon)println
+ println= (assign)println
+ println"[]" (array access)println
+ println{} (curly braces)println
+ printlncatchprintln
+ printlndraw()println
+ exit()
+ printlnfalseprintln
+ printlnfinallyprintln
+ printlnloop()println
+ printlnnewprintln
+ printlnnoLoop()println
+ printlnnullprintln
+ popStyle()
+ pushStyle()
+ printlnredraw()println
+ printlnreturnprintln
+ printlnsetup()println
+ printlnthisprintln
+ printlntrueprintln
+ printlntryprintln

###Environment 
+ cursor()
+ printlndisplayHeightprintln
+ printlndisplayWidthprintln
+ focused
+ printlnframeCountprintln
+ printlnframeRate()println
+ printlngetFrameRate()println
+ printlnheightprintln
+ noCursor()
+ printlnsize()println
+ printlnwidthprintln


####String Functions
+ printlnjoin()println
+ printlnmatch()println
+ matchAll()
+ printlnnf()println
+ nfc()
+ nfp()
+ nfs()
+ printlnsplit()println
+ splitTokens()
+ printlntrim()println

####Array Functions
+ printlnappend()println
+ printlnarrayCopy()println
+ printlnconcat()println
+ printlnexpand()println
+ printlnreverse()println
+ printlnshorten()println
+ sort()
+ printlnsplice()println
+ printlnsubset()println


###Control

####Relational Operators
+ println!= (inequality)println
+ println< (less than)println
+ println<= (less than or equal to)println
+ println== (equality)println
+ println> (greater than)println
+ println>= (greater than or equal to)println

####Iteration
+ printlnforprintln
+ printlnwhileprintln

####Conditionals
+ println?: (conditional)println
+ printlnbreakprintln
+ printlncaseprintln
+ printlncontinueprintln
+ printlndefaultprintln
+ printlnelseprintln
+ printlnifprintln
+ printlnswitchprintln

####Logical Operators
+ println! (logical NOT)println
+ println&& (logical AND)println
+ println|| (logical OR)println


###Shape 
+ createShape()
+ loadShape()
+ PShape

####2D Primitives
+ arc()
+ printlnellipse()println
+ printlnline()println
+ point()
+ printlnquad()println
+ printlnrect()println
+ printlntriangle()println

####Curves
+ printlnbezier()println
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
+ printlnellipseMode()println
+ printlnnoSmooth()println
+ printlnrectMode()println
+ printlnsmooth()println
+ printlnstrokeCap()println
+ printlnstrokeJoin()println
+ printlnstrokeWeight()println

####Vertex
+ beginContour()
+ printlnbeginShape()println
+ printlnbezierVertex()println
+ curveVertex()
+ endContour()
+ printlnendShape()println
+ printlnquadraticVertex()println
+ printlnvertex()println

####Loading & Displaying
+ shape()
+ shapeMode()


###Input

####Mouse
+ mouseButton
+ printlnmouseClicked()println
+ mouseDragged()
+ printlnmouseMoved()println
+ printlnmousePressed()println
+ mousePressed
+ printlnmouseReleased()println
+ mouseWheel()
+ printlnmouseXprintln
+ printlnmouseYprintln
+ printlnpmouseXprintln
+ printlnpmouseYprintln

####Keyboard
+ printlnkeyprintln
+ printlnkeyCodeprintln
+ printlnkeyPressed()println
+ ~~keyPressed~~
+ printlniskeyPressed()println
+ printlnkeyReleased()println
+ printlnkeyTyped()println

####Files
+ ~~BufferedReader~~
+ createInput()
+ createReader()
+ loadBytes()
+ printlnloadJSON()println
+ ~~loadJSONArray()~~
+ ~~loadJSONObject()~~
+ printlnloadStrings()println
+ loadTable()
+ loadXML()
+ open()
+ parseXML()
+ saveTable()
+ selectFolder()
+ selectInput()


####Time & Date
+ printlnday()println
+ printlnhour()println
+ printlnmillis()println
+ printlnminute()println
+ printlnmonth()println
+ printlnsecond()println
+ printlnyear()println

###Output

####Text Area
+ printlnprintln()println

####Image
+ printlnsave()println

####Files
+ beginRaw()
+ beginRecord()
+ createOutput()
+ printlncreateWriter()println
+ endRaw()
+ endRecord()
+ printlnPrintWriterprintln
+ saveBytes()
+ saveJSONArray()
+ saveJSONObject()
+ saveStream()
+ printlnsaveStrings()println
+ saveXML()
+ selectOutput()


###Transform 
+ printlnapplyMatrix()println
+ printlnpopMatrix()println
+ printlnprintMatrix()println
+ printlnpushMatrix()println
+ printlnresetMatrix()println
+ printlnrotate()println
+ _rotateX()_
+ _rotateY()_
+ _rotateZ()_
+ printlnscale()println
+ printlnshearX()println
+ printlnshearY()println
+ printlntranslate()println

####Setting
+ printlnbackground()println
+ clear()
+ printlncolorMode()println // pend test this?
+ printlnfill()println
+ printlnnoFill()println
+ printlnnoStroke()println
+ printlnstroke()println

####Creating & Reading
+ printlnalpha()println
+ printlnblue()println
+ printlnbrightness()println
+ printlncolor()println
+ printlngreen()println
+ printlnhue()println
+ printlnlerpColor()println
+ printlnred()println
+ printlnsaturation()println

###Image 

+ printlncreateImage()println
+ printlnPImageprintln - _mostly_

####Loading & Displaying
+ printlnimage()println
+ printlnimageMode()println
+ printlnloadImage()println
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
+ printlnget()println
+ printlnloadPixels()println
+ printlnpixels[]println
+ set()
+ printlnupdatePixels()println

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
+ printlntext()println
+ textFont()

####Attributes
+ printlntextAlign()println
+ textLeading()
+ textMode()
+ printlntextSize()println
+ textWidth()

####Metrics
+ textAscent()
+ textDescent()


###Math 

+ PVector

####Operators
+ println% (modulo)println
+ println* (multiply)println
+ println*= (multiply assign)println
+ println+ (addition)println
+ println++ (increment)println
+ println+= (add assign)println
+ println- (minus)println
+ println-- (decrement)println
+ println-= (subtract assign)println
+ println/ (divide)println
+ println/= (divide assign)println

####Bitwise Operators
+ println& (bitwise AND)println
+ println<< (left shift)println
+ println>> (right shift)println
+ println| (bitwise OR)println

####Calculation
+ printlnabs()println
+ printlnceil()println
+ printlnconstrain()println
+ printlndist()println
+ printlnexp()println
+ printlnfloor()println
+ printlnlerp()println
+ printlnlog()println
+ printlnmag()println
+ printlnmap()println
+ printlnmax()println
+ printlnmin()println
+ printlnnorm()println
+ printlnpow()println
+ printlnround()println
+ printlnsq()println
+ printlnsqrt()println

####Trigonometry
+ printlnacos()println
+ printlnasin()println
+ printlnatan()println
+ printlnatan2()println
+ printlncos()println
+ printlndegrees()println
+ printlnradians()println
+ printlnsin()println
+ printlntan()println

####Random
+ noise()
+ noiseDetail()
+ noiseSeed()
+ printlnrandom()println
+ randomGaussian()
+ randomSeed()

###Constants 

+ printlnHALF_PIprintln
+ printlnPIprintln
+ printlnQUARTER_PIprintln
+ printlnTAUprintln
+ printlnTWO_PIprintln


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

