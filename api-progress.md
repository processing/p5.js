API progress
============

See [API page](https://github.com/lmccart/p5.js/blob/master/api.md) for currently supported API.

###Key
+ __implemented__
+ to be implemented
+ ~~removed~~
+ _future version_

###Structure 

+ __() (parentheses)__
+ __, (comma)__
+ __. (dot)__
+ __/* */ (multiline comment)__
+ __/** */ (doc comment)__
+ __// (comment)__
+ __; (semicolon)__
+ __= (assign)__
+ __"[]" (array access)__
+ __{} (curly braces)__
+ __catch__
+ ~~class~~
+ __draw()__
+ exit()
+ ~~extends~~
+ __false__
+ ~~final~~
+ __finally__
+ ~~implements~~
+ ~~import~~
+ __loop()__
+ __new__
+ __noLoop()__
+ __null__
+ __popStyle()__
+ ~~private~~
+ ~~public~~
+ __pushStyle()__
+ __redraw()__
+ __return__
+ __setup()__
+ ~~static~~
+ ~~super~~
+ __this__
+ __true__
+ __try__
+ ~~void~~

###Environment 
+ __cursor()__ (no custom image src yet)
+ __displayHeight__
+ __displayWidth__
+ focused
+ __frameCount__
+ __frameRate()__
+ ~~frameRate~~
+ __getFrameRate()__
+ __height__
+ __noCursor()__
+ ~~size()~~ - replaced by createGraphics, createElement, createImage
+ __width__

###Data

####~~Primitive~~

####~~Composite~~

####~~Conversion~~

####String Functions
+ __join()__
+ __match()__
+ __matchAll()__
+ __nf()__
+ __nfc()__ 
+ __nfp()__ 
+ __nfs()__
+ __split()__
+ __splitTokens()__
+ __trim()__

####Array Functions
+ __append()__
+ __arrayCopy()__
+ __concat()__
+ __expand()__
+ __reverse()__
+ __shorten()__
+ __sort()__
+ __splice()__
+ __subset()__


###Control

####Relational Operators
+ __!= (inequality)__
+ __< (less than)__
+ __<= (less than or equal to)__
+ __== (equality)__
+ __> (greater than)__
+ __>= (greater than or equal to)__

####Iteration
+ __for__
+ __while__

####Conditionals
+ __?: (conditional)__
+ __break__
+ __case__
+ __continue__
+ __default__
+ __else__
+ __if__
+ __switch__

####Logical Operators
+ __! (logical NOT)__
+ __&& (logical AND)__
+ __|| (logical OR)__


###Shape 
+ createShape()
+ loadShape()
+ PShape

####2D Primitives
+ arc()
+ __ellipse()__
+ __line()__
+ __point()__
+ __quad()__
+ __rect()__
+ __triangle()__

####Curves
+ __bezier()__
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
+ __ellipseMode()__
+ __noSmooth()__
+ __rectMode()__
+ __smooth()__
+ __strokeCap()__
+ __strokeJoin()__
+ __strokeWeight()__

####Vertex
+ beginContour()
+ __beginShape()__
+ __bezierVertex()__
+ curveVertex()
+ endContour()
+ __endShape()__
+ __quadraticVertex()__
+ __vertex()__

####Loading & Displaying
+ shape()
+ shapeMode()


###Input

####Mouse
+ __mouseButton__
+ __mouseClicked()__
+ __mouseDragged()__
+ __mouseMoved()__
+ __mousePressed()__
+ ~~mousePressed~~
+ __isMousePressed()__
+ __mouseReleased()__
+ __mouseWheel()__
+ __mouseX__
+ __mouseY__
+ __pmouseX__
+ __pmouseY__

####Touch
+ __touchStarted()__
+ __touchMoved()__
+ __touchEnded()__
+ __touchX__
+ __touchY__
+ __touches__

####Keyboard
+ __key__
+ __keyCode__
+ __keyPressed()__
+ ~~keyPressed~~
+ __iskeyPressed()__
+ __keyReleased()__
+ __keyTyped()__

####Files
+ ~~BufferedReader~~
+ createInput()
+ createReader()
+ loadBytes()
+ __loadJSON()__
+ ~~loadJSONArray()~~
+ ~~loadJSONObject()~~
+ __loadStrings()__
+ loadTable()
+ loadXML()
+ open()
+ parseXML()
+ saveTable()
+ selectFolder()
+ selectInput()


####Time & Date
+ __day()__
+ __hour()__
+ __millis()__
+ __minute()__
+ __month()__
+ __second()__
+ __year()__

###Output

####Text Area
+ ~~print()~~
+ __println()__

####Image
+ save()
+ ~~saveFrame()~~

####Files
+ beginRaw()
+ beginRecord()
+ createOutput()
+ __createWriter()__
+ endRaw()
+ endRecord()
+ __PrintWriter__
+ saveBytes()
+ saveJSONArray()
+ saveJSONObject()
+ saveStream()
+ __saveStrings()__
+ saveXML()
+ selectOutput()


###Transform 
+ __applyMatrix()__
+ __popMatrix()__
+ __printMatrix()__
+ __pushMatrix()__
+ __resetMatrix()__
+ __rotate()__
+ _rotateX()_
+ _rotateY()_
+ _rotateZ()_
+ __scale()__
+ __shearX()__
+ __shearY()__
+ __translate()__

###_Lights, Camera_

####_Lights_
+ _ambientLight()_
+ _directionalLight()_
+ _lightFalloff()_
+ _lights()_
+ _lightSpecular()_
+ _noLights()_
+ _normal()_
+ _pointLight()_
+ _spotLight()_

####_Camera_
+ _beginCamera()_
+ _camera()_
+ _endCamera()_
+ _frustum()_
+ _ortho()_
+ _perspective()_
+ _printCamera()_
+ _printProjection()_

####_Coordinates_
+ _modelX()_
+ _modelY()_
+ _modelZ()_
+ _screenX()_
+ _screenY()_
+ _screenZ()_

####_Material Properties_
+ _ambient()_
+ _emissive()_
+ _shininess()_
+ _specular()_

###Color

####Setting
+ __background()__
+ __clear()__
+ __colorMode()__ // pend test this?
+ __fill()__
+ __noFill()__
+ __noStroke()__
+ __stroke()__

####Creating & Reading
+ __alpha()__
+ __blue()__
+ __brightness()__
+ __color()__
+ __green()__
+ __hue()__
+ __lerpColor()__
+ __red()__
+ __saturation()__

###Image 

+ __createImage()__
+ __PImage__ - _mostly_

####Loading & Displaying
+ __image()__
+ __imageMode()__
+ __loadImage()__
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
+ __get()__ - incomplete
+ __loadPixels()__
+ __pixels[]__
+ set()
+ updatePixels()

###Rendering 
+ blendMode()
+ __createGraphics()__
+ __PGraphics__ (is now PElement)

####_Shaders_
+ _loadShader()_
+ _PShader_
+ _resetShader()_
+ _shader()_

###Typography 

+ PFont

####Loading & Displaying
+ ~~createFont()~~
+ ~~loadFont()~~
+ __text()__
+ __textFont()__

####Attributes
+ __textAlign()__
+ __textHeight()__
+ __textLeading()__
+ ~~textMode()~~
+ __textSize()__
+ __textStyle()__
+ __textWidth()__

####Metrics
+ textAscent()
+ textDescent()


###Math 

#### PVector
+ __set__
+ __get__
+ __add__
+ __sub__
+ __mult__
+ __div__
+ __mag__
+ __magSq__
+ __dot__
+ __cross__
+ __dist__
+ __normalize__
+ __limit__
+ __setMag__
+ __heading__
+ ~~rotate~~
+ __rotate2D__
+ __lerp__
+ __angleBetween__
+ __array__


####Operators
+ __% (modulo)__
+ __* (multiply)__
+ __*= (multiply assign)__
+ __+ (addition)__
+ __++ (increment)__
+ __+= (add assign)__
+ __- (minus)__
+ __-- (decrement)__
+ __-= (subtract assign)__
+ __/ (divide)__
+ __/= (divide assign)__

####Bitwise Operators
+ __& (bitwise AND)__
+ __<< (left shift)__
+ __>> (right shift)__
+ __| (bitwise OR)__

####Calculation
+ __abs()__
+ __ceil()__
+ __constrain()__
+ __dist()__
+ __exp()__
+ __floor()__
+ __lerp()__
+ __log()__
+ __mag()__
+ __map()__
+ __max()__
+ __min()__
+ __norm()__
+ __pow()__
+ __round()__
+ __sq()__
+ __sqrt()__

####Trigonometry
+ __acos()__
+ __asin()__
+ __atan()__
+ __atan2()__
+ __cos()__
+ __degrees()__
+ __radians()__
+ __sin()__
+ __tan()__

####Random
+ noise()
+ noiseDetail()
+ noiseSeed()
+ __random()__
+ randomGaussian()
+ randomSeed()

###Constants 

+ __HALF_PI__
+ __PI__
+ __QUARTER_PI__
+ __TAU__
+ __TWO_PI__



###DOM
+ __AUTO__

####Create
+ __createElement(html)__
+ __createImage(src)__
+ __createCanvas(w, h)__

####Access
+ __get(id)__
+ __get(class)__

####Set context
+ __context(id)__
+ __context(obj)__

####PElement
+ __id(id)__
+ __class(class)__
+ __size(w, h)__
+ __position(x, y)__
+ __style(style)__
+ __html(html)__
+ __show()__
+ __hide()__

####Listeners
+ __mousePressed(function)__
+ __mouseOver(function)__
+ __mouseOut(function)__
