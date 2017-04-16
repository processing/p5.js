/**
 * This function calculate the fibonachi serie and return mixed value
 * If dump set to false it return only the U(i) result
 * Else it return the whole array of result from n=0 to n=i
 */
function fibonnaci(i, dump) {
    var n = 2;
    var progression = [0,1];
    while (n < i) {
        console.log(progression[1]    );
        progression.push(progression[n - 1] + progression[n - 2]);
        n++;
    }

    return dump?progression:(progression[i - 1] + progression[i - 2]);
}

var data = fibonnaci(11, true);
//console.log(data);
//The tile square
var unite = 10;

//The canvas width
var canvasW = 1200;

//The canvas height
var canvasH = 800;

function drawTile() 
{
    stroke(20);
    for (var i=0; i<canvasW; i += unite) {
        line(i, 0, i, canvasH);
    }

    for (var i=0; i<canvasH    ; i += unite) {
        line(0, i, canvasW    , i);
    }
}

function setup() {
    createCanvas(canvasW, canvasH);
    background(0);
    noSmooth();
    drawTile();
    var x0 = canvasW/4;
    var y0 = canvasH/4;
    var x = x0;
    var y = y0;
    var j = 0;
    for (n=1; n<data.length; n++) {        
        var width = height = data[n] * unite;
        if (n>2) {
            if (j == 4) {
                p = -data[n-2];
                k = -data[n];
                j = 0;
            }
            else if (j == 3) {
                p = data[n-1];
                k = -data[n-2];
            }
            else if (j == 2) {
                p = 0;
                k = data[n-1];
            }
            else if (j == 1) {
                p = -data[n];
                k = 0;
            }
            else if (j == 0) {
                p = -data[n-2];
                k = -data[n]; 
            }

            translate(
                p * unite, 
                k * unite
            );

            j++;
        } else {
            translate((n * width) - width, 0);
        }

        fill(alpha(color(0, 126, 255, (n+1) * 10)));
        stroke(10);

        rect(x0, y0, width, height);
        stroke(255);
        var fontsize = data[n] * 2;
        textSize(fontsize);
        text("" + data[n], x0 + width/2 - fontsize/2, y0 + height/2 + fontsize/2); 
    }
}