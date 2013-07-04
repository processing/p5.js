API
===


##Basic sketch

```java
void setup() {
	// setup stuff
}

void draw() {
	// draw stuff
}
```


```javascript
var setup = function() {
	// setup stuff
};

var draw = function() {
	// draw stuff
};
```


##Other changes
+ some kind of browser compatibility check


##Additional functions
+ handling async, option to make it block


##No longer supported
+ save out files locally?
+ function and var share name (ex: mousePressed mousePressed())



##Progress

###Shape 
+ createShape()
+ loadShape()
+ PShape

####2D Primitives
+ arc()
+ __ellipse()__
+ __line()__
+ point()
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
+ mouseButton
+ __mouseClicked()__
+ mouseDragged()
+ __mouseMoved()__
+ __mousePressed()__
+ mousePressed
+ __mouseReleased()__
+ mouseWheel()
+ __mouseX__
+ __mouseY__
+ __pmouseX__
+ __pmouseY__

####Keyboard
+ key
+ __keyCode__
+ __keyPressed()__
+ keyPressed
__keyReleased()__
__keyTyped()__


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
+ saveFrame()

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