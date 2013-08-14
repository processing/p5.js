// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-2: Many lines with variables

createGraphics(200,200);
background(255);

// Legs
stroke(0);
var y = 80;       // Vertical location of each line
var x = 50;       // Initial horizontal location for first line
var spacing = 10; // How far apart is each line
var len = 20;     // Length of each line

// Draw the first leg.
line(x,y,x,y + len); 
// Add spacing so the next leg appears 10 pixels to the right.
x = x + spacing; 

// Continue this process for each leg, repeating it over and over.
line(x,y,x,y + len); 
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);
x = x + spacing;
line(x,y,x,y + len);