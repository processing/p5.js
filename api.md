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

###Structure

- [x]() (parentheses)
- [x], (comma)
- [x]. (dot)
+ /* */ (multiline comment)
+ /** */ (doc comment)
+ // (comment)
+ ; (semicolon)
+ = (assign)
+ [] (array access)
+ {} (curly braces)
+ catch
+ clasdraw()
+ exit()
+ extends
+ false
+ final
+ implements
import
loop()
new
noLoop()
null
popStyle()
private
public
pushStyle()
redraw()
return
setup()
static
super
this
true
try
void
Environment 

cursor()
displayHeight
displayWidth
focused
frameCount
frameRate()
frameRate
height
noCursor()
size()
width
Data
Primitive
boolean
byte
char
color
double
float
int
long
Composite
Array
ArrayList
FloatDict
FloatList
HashMap
IntDict
IntList
JSONArray
JSONObject
Object
String
StringDict
StringList
Table
TableRow
XML
Conversion
binary()
boolean()
byte()
char()
float()
hex()
int()
str()
unbinary()
unhex()
String Functions
join()
match()
matchAll()
nf()
nfc()
nfp()
nfs()
split()
splitTokens()
trim()
Array Functions
append()
arrayCopy()
concat()
expand()
reverse()
shorten()
sort()
splice()
subset()
Control
Relational Operators
!= (inequality)
< (less than)
<= (less than or equal to)
== (equality)
> (greater than)
>= (greater than or equal to)
Iteration
for
while
Conditionals
?: (conditional)
break
case
continue
default
else
if
switch
Logical Operators
! (logical NOT)
&& (logical AND)
|| (logical OR)