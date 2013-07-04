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

####~~3D Primitives~~
~~box()~~
~~sphere()~~
~~sphereDetail()~~

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
shape()
shapeMode()


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
BufferedReader
createInput()
createReader()
loadBytes()
loadJSONArray()
loadJSONObject()
loadStrings()
loadTable()
loadXML()
open()
parseXML()
saveTable()
selectFolder()
selectInput()


####Time & Date
day()
hour()
millis()
minute()
month()
second()
year()
Output
Text Area
print()
println()
Image
save()
saveFrame()
Files
beginRaw()
beginRecord()
createOutput()
createWriter()
endRaw()
endRecord()
PrintWriter
saveBytes()
saveJSONArray()
saveJSONObject()
saveStream()
saveStrings()
saveXML()
selectOutput()
Transform 

applyMatrix()
popMatrix()
printMatrix()
pushMatrix()
resetMatrix()
rotate()
rotateX()
rotateY()
rotateZ()
scale()
shearX()
shearY()
translate()
Lights, Camera
Lights
ambientLight()
directionalLight()
lightFalloff()
lights()
lightSpecular()
noLights()
normal()
pointLight()
spotLight()
Camera
beginCamera()
camera()
endCamera()
frustum()
ortho()
perspective()
printCamera()
printProjection()
Coordinates
modelX()
modelY()
modelZ()
screenX()
screenY()
screenZ()
Material Properties
ambient()
emissive()
shininess()
specular()