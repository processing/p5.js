function setup(){

  var txt = "Default Text", x = 190;

  createCanvas(200, 150);

  line(190,0,190,height);

  textAlign(RIGHT);
  textSize(32);
  text(txt, x, 30);

  loadFont("../SourceSansPro-Regular.otf", function(font){

    text(txt, x, 60);

    textSize(35); // not aligning correctly (ignore alignment or fix)
    var path = font._getPath(txt, x, 90);
    font._renderPath(path);

    textFont(font);
    text(txt, x, 120);

    x = 20;
    textSize(20);
    textAlign(LEFT);

    var td = x+font._textWidth('space');
    var tw = font._textWidth(' ');

    text('space width: '+tw.toFixed(2)+'px', x, 140);

    line(td,145,td,145-22);
    line(td+tw,145,td+tw,145-22);
  });
}
