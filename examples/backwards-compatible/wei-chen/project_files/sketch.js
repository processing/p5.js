$(document).ready(function() {
  var selector = $('#selector');
  selector.on('change', function() {
    var val = selector.val();
    $('#status').html('sending first xhr request');
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather?q=' + val,
      type : 'get',
      dataType: 'jsonp',
      success: function(data) {
        $('#status').html('sending second xhr request');
        $.each(data.weather, function(i,item){
          pattern = item.description;
        })
        city = data.name;
        temperature = data.main.temp - 273.15;
        windSpeed = data.wind.speed;
        windDirection = data.wind.deg;
        lat = data.coord.lat;
        lon = data.coord.lon;
        unixTime = data.dt;
        coord = data.coord;
        localtion = coord.lat + ',' + coord.lon;
        now = data.dt;
        cloud = data.clouds.all;
        if(data.rain!=null){
          rainy = data.rain['3h'];
        }
        if(data.snow!=null){
          snowy = data.snow['3h'];
        }
        //Data to range
        document.getElementById('temperature').value = temperature;
        document.getElementById('windSpeed').value = Math.round(windSpeed*3.6);
        document.getElementById('windDirection').value = windDirection;
        document.getElementById('cloud').value = cloud;
        document.getElementById('rain').value = rainy;
        document.getElementById('snow').value = snowy;
        rangeTemp = temperature;
        rangeWinds = windSpeed;
        rangeWindd = windDirection;
        rangeCloud = cloud;
        rangeRain = rainy;
        rangeSnow = snowy;
        $.ajax({
          url: 'https://maps.googleapis.com/maps/api/timezone/json?location=' +
          localtion +
          '&timestamp=' +
          now +'&sensor=false',
          type : 'get',
          dataType: 'json',
          success: function(data) {

            offset = data.rawOffset;
            zone = data.timeZoneName;
            dstOffset = data.dstOffset;
            //Time
            unixTimestamp = new Date(unixTime * 1000);
            years = unixTimestamp.getFullYear();
            month = months[unixTimestamp.getMonth()];
            date = unixTimestamp.getDate();
            hour = unixTimestamp.getHours()+offset/3600+5+dstOffset/3600;
            if(hour>23){
              hour-=24;
              date++;
            }
            if(hour<0){
              hour+=24;
              date--;
            }
            min = unixTimestamp.getMinutes();
            sec = unixTimestamp.getSeconds();
            commonTime = unixTimestamp.toLocaleString()
            document.getElementById('sky').value = hour;

          },

        });
      },

    });
  });

});

/////////////////
//Definition
/////////////////
var city = "Please choose the city", temperature=0, windSpeed = 0, windDirection=0, pattern = "WEATHER PATTERN";
var canvas0,canvas1;
var i=2;
var img1,img2;
// Bob: Changed PI to Math.PI. In effort to not pollute global namespace, cannot use implicit Processing globals outside of preload, setup, or draw functions
var rotateSpeed=0,rotateDirection=0,rotateProcess=Math.PI;
    //color
    var color=0,h=255,s=0.7,v=0.2;
    var s2=0.7,v2;
    var skyColor=0,skyv,sunColor,suns;
    //time/zone
    var unixTime,zone="Choose Please!";
    var coord,localtionl;
    var now,offset,dstOffset;
    //cloud
    var moveX=0,moveY=0,step=1,cloudPosition;
    var cloud=0,cloudColor,sini=0,cloudShow=0;
    //preipitation
    var rainy=0,rainPosition=[],snowy=0,snowPosition=[];
    //control
    var rangeTemp,rangeSky, rangeWinds, rangeWindd, rangeCloud,rangeRain, rangeSnow, rangeStar;
    //time
    var hour=12,unixTimestamp,months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var years,month,date,min,sec,commonTime;
    var monthShow,minShow,hourShow;
    //star
    var sn, starX=[], starY=[], starC=[], number2=0;

    var setup = function(){
      smooth();
      canvas1 = createCanvas(720, 720);
      canvas1.position(0, 0);
      img1 = loadImage("Outline_1.png");
      img2 = loadImage("Outline_2.png");
      noStroke();
//Star

};



var draw = function(){

/////////////////
//To HTML
/////////////////

if(pattern!=null){
  $('#pattern').html(pattern);
}

if(rangeTemp==null){
  $('#valueTemp').html("I don't know!");
}
else{
  $('#valueTemp').html(Math.round(rangeTemp) + " C / " + Math.round(Math.round(rangeTemp)*1.8+32) +" F");
}

hourShow=hour;
minShow=min;
monthShow=month;
if(hour<10){
  hourShow="0"+hour;
}
if(min<10){
  minShow="0"+min;
}
if(month<10){
  monthShow="0"+month;
}
if(unixTime==null){
  $('#valueTime').html("No idea");
}
else{

  $('#valueTime').html(hourShow+" : "+minShow+ " " + monthShow+" "+date+" / "+years);
}


if(rangeWindd==null){
  rangeWindd = 0;
}
$('#valueDirection').html(Math.round(rangeWindd) + " Degree");

if(rangeWinds==null||rangeWinds==0){
  $('#valueSpeed').html("Peaceful Day!");
}
else{
  $('#valueSpeed').html((rangeWinds*3.6).toFixed(1) + " km/h");
}

if(rangeCloud!=null){
  cloudShow=rangeCloud;
}
if(rangeCloud<=100&&rangeCloud>0){
  $('#valueCloud').html(cloudShow + " %");
}
if(rangeCloud==0 || rangeCloud==null){
  $('#valueCloud').html("No Cloud");
}
if(rangeCloud>100){
  $('#valueCloud').html(200-cloudShow + " %");
}

if(rangeRain==null || rangeRain == "[object Object]" || rangeRain==0){
  rangeRain=0;
  $('#valueRain').html("No Rain");
}
else{
  $('#valueRain').html(rangeRain+"mm/3h");
}


if(rangeSnow==null || rangeSnow == "[object Object]" || rangeSnow==0){
  rangeSnow=0;
  $('#valueSnow').html("No Snow");
}
else{
  $('#valueSnow').html(rangeSnow + " mm/3h");
}

/////////////////
//Pattern
/////////////////

context(canvas1);
background(255);
if(rangeTemp!=null){
  color = rangeTemp;
}


//Sky
fill(colorRGB(color).r,colorRGB(color).g,colorRGB(color).b,100);
ellipse(0.5*width,0.5*height,260,260);

if(hour<=11){
  skyColor = map(hour,0,11,221,198);
  skyv = map(hour,0,11,0.12,0.93);
}
if(hour>11){
  skyColor = map(hour,12,23,198,221);
  skyv = map(hour,12,23,0.93,0.12);
}
fill(colorRGB(color).r,colorRGB(color).g,colorRGB(color).b);
ellipse(0.5*width,0.5*height,260,260);
if(hour!=null){

  fill(HSVtoRGB(skyColor,0.34,skyv).r , HSVtoRGB(skyColor,0.34,skyv).g , HSVtoRGB(skyColor,0.34,skyv).b,200);
}
ellipse(0.5*width,0.5*height,260,260);

//Star
if(hour<6 || hour>17){
  staring(rangeStar);
}

//Sun
if(hour>=6 && hour<=11){
  sunColor = map(hour,6,11,59,40);
  suns = map(hour,6,11,0.2,0.03);
}
if(hour>=12 && hour <=17){
  sunColor = map(hour,12,17,40,59);
  suns = map(hour,6,11,0.03,0.2);
}
noFill();
if(hour>=6 && hour<=17){

  fill(HSVtoRGB(sunColor,suns,0.93).r,HSVtoRGB(sunColor,suns,0.93).g,HSVtoRGB(sunColor,suns,0.8).b,200);
}

ellipse(0.5*width,0.5*height,150,150);

//Cloud
var x = mouseX-400;
cloudColor = 0.95;
if(hour<6){
  cloudColor = map(hour,0,5,0.4,0.95);
}
if(hour>17){
  cloudColor = map(hour,17,23,0.95,0.4);
}
fill(HSVtoRGB(skyColor,0.05,cloudColor).r , HSVtoRGB(skyColor,0.05,cloudColor).g , HSVtoRGB(skyColor,0.05,cloudColor).b);

pushMatrix();

if(moveX>100||moveX<0){
  step=step*-1;
}
if(rangeCloud!=null){
  cloudPosition = map(rangeCloud,0,100,500,70);
}
else{
  cloudPosition = 500;
}

moveX+=0.5*step;
sini+=0.02*PI;
moveY=0.3*moveX*sin(sini);
translate(cloudPosition,0)
    // translate(mouseX-400,0)
    ellipse(30+moveX,425+moveY,60,60);
    ellipse(128+0.8*moveX,450,104,104);
    ellipse(178-0.5*moveY,395+0.5*moveX,125,125);
    ellipse(295+0.3*moveY,387-0.1*moveX,223,223);
    ellipse(400+0.4*moveX,426-0.05*moveX,151,151);
    rect(128,408,263,94);
    ellipse(521+moveY,431+0.6*moveX,62,62);
    ellipse(546+0.5*moveY,451+0.5*moveX,31,31);
    popMatrix();

    image(img2,0,0);

//Rain
rainning(rangeRain*5,20,rangeRain*0.3+15,windSpeed);
//Snow
snowing(rangeSnow*50,rangeSnow*5+5,rangeSnow*5+2,windSpeed);

//Big Ring(Temperature)
noFill();
strokeWeight(230);
stroke(255);
ellipse(0.5*width,0.5*height,488,488);
stroke(HSVtoRGB(skyColor,0.34,skyv).r , HSVtoRGB(skyColor,0.34,skyv).g , HSVtoRGB(skyColor,0.34,skyv).b);
ellipse(0.5*width,0.5*height,488,488);
stroke(colorRGB(color).r,colorRGB(color).g,colorRGB(color).b,200);
ellipse(0.5*width,0.5*height,488,488);

//Wind Direction
pushMatrix();
noStroke();
translate(360,360);
rotateDirection = (windDirection*PI/180+PI);

if(abs(rotateDirection-rotateProcess)<PI && windDirection !=0){
  if((rotateDirection-rotateProcess)>0.05){
   rotateProcess+=PI/90;
 }
 if((rotateDirection-rotateProcess)<-0.05){
   rotateProcess-=PI/90;
 }
}

if(abs(rotateDirection-rotateProcess)>=PI && windDirection !=0){

  if((rotateDirection-rotateProcess)>0){
    rotateProcess+=2*PI;
  }
  else{
    rotateProcess-=2*PI;
  }


}


rotate(rotateProcess);
image(img2,-360,-360);
popMatrix();

//Small Ring

rotateSpeed = rotateSpeed + windSpeed;
strokeWeight(14);

pushMatrix();
translate(0.5*width,0.5*height);
stroke(HSVtoRGB(skyColor,0.34,skyv).r , HSVtoRGB(skyColor,0.34,skyv).g , HSVtoRGB(skyColor,0.34,skyv).b);
ellipse(0,0,268,268);
stroke(colorRGB2(color).r,colorRGB2(color).g,colorRGB2(color).b,200);
rotate(-rotateSpeed/100);
ellipse(0,0,270,270);
fill(255);
noStroke();
ellipse(0,-135,10,10);
ellipse(0,135,10,10);
ellipse(135,0,10,10);
ellipse(-135,0,10,10);
popMatrix();
noStroke();

print(cloudPosition);


};

/////////////////
//HSB TO RGB
/////////////////

var HSVtoRGB = function(h,s,v) {
  var rgb = new Array(3);
  var i;
  var f, p, q, t;
  if(s == 0) {
    rgb.r = rgb.g = rgb.b = v*255;
    return rgb;
  }
  h /= 60;
  i = Math.floor(h);
  f = h-i;
  p = v*(1-s);
  q = v*(1-s*f);
  t = v*(1-s*(1-f));
  switch(i) {
    case 0:
    rgb.r = v;
    rgb.g = t;
    rgb.b = p;
    break;
    case 1:
    rgb.r = q;
    rgb.g = v;
    rgb.b = p;
    break;
    case 2:
    rgb.r = p;
    rgb.g = v;
    rgb.b = t;
    break;
    case 3:
    rgb.r = p;
    rgb.g = q;
    rgb.b = v;
    break;
    case 4:
    rgb.r = t;
    rgb.g = p;
    rgb.b = v;
    break;
    default:
    rgb.r = v;
    rgb.g = p;
    rgb.b = q;
    break;
  }
  rgb.r *= 255;
  rgb.g *= 255;
  rgb.b *= 255;
  return rgb;
}

var colorRGB = function(color){
  if(color<0){
    h=255-1.5*50-1.5*color;
    v=0.3+0.007*50+0.007*color;
  }
  if(color>=0){
    h=180-180/50*color;
    v=0.65+(0.35/50)*color;
  }
  return HSVtoRGB(h,s,v);
}

var colorRGB2 = function(color){
  if(color<0){
    h2=255-1.5*50-1.5*color;
    v2=0.3+0.007*50+0.007*color;
  } else {
    h2=180-180/50*color;
    v2=0.65+(0.35/50)*color;
  }
  return HSVtoRGB(h2,s2,0.8*v2);
}


/////////////////
//Rain&Snow&Star
/////////////////
var rainning = function(number,length,speed,angle){
  var rainAngle = map(angle*3.6,0,150,0,0.5*PI);
  pushMatrix();
  translate(0.5*width,0.5*height);
  rotate(rainAngle);
  if(hour>=6 && hour<=17){
    stroke(0);
  }
  else{
    stroke(255);
  }
  strokeWeight(number/100+1);
  for(var i=0;i<number;i++){
    if(rainPosition.length<number){
      rainPosition[i]=random(-200,200);
    }
  }

  for(i=0;i<number;i++){
    rainPosition[i]+=speed;
    if(rainPosition[i]>300){
      rainPosition[i]=0;
    }
  }
  for(i=1;i<number+1;i++){
    line(350/number*i-175,rainPosition[i-1]-150,350/number*i-175,rainPosition[i-1]+length-150);
  }
  popMatrix();
}

var snowing = function(number,size,speed,angle){
  var rainAngle = map(angle*3.6,0,150,0,0.5*PI);
  pushMatrix();
  translate(0.5*width,0.5*height);
  rotate(rainAngle);
  stroke(150);
  strokeWeight(1);
  fill(255);
    //strokeWeight(number/100+1);
    for(var i=0;i<number;i++){
      if(snowPosition.length<number){
        snowPosition[i]=random(-200,200);
      }
    }

    for(i=0;i<number;i++){
      snowPosition[i]+=speed;
      if(snowPosition[i]>300){
        snowPosition[i]=0;
      }
    }

    for(i=1;i<number+1;i++){
      ellipse(350/number*i-175,snowPosition[i-1]-150,size,size);

    }
    popMatrix();

  }
  var staring = function(number){
    if(number2!=number){
      starX=[];
      starY=[];
      starC=[];
      for(sn=0;sn<number;sn++){
        starX[sn]=random(-130,130);
        starY[sn]=random(-130,130);
        starC[sn]=random(0,255);
      }
    }

    pushMatrix();
    translate(0.5*width,0.5*height);
    noStroke();
    for(var sn=0; sn<starX.length;sn++){
      if(starC[sn]<178){
        noFill();
      }
      else{
        fill(255);
      }
      starC[sn]+=1;
      if(starC[sn]>255){
        starC[sn]=0;
      }
      ellipse(starX[sn],starY[sn],2,2);
    }
    popMatrix();
    number2 = number;
  }
/////////////////
//Value
/////////////////

function tempValue(newValue)
{
  rangeTemp = newValue;
}
function skyValue(newValue)
{
  rangeSky = newValue;
  if(rangeSky!=null){
    hour = rangeSky;
  }
}
function windsValue(newValue)
{
  rangeWinds = newValue/3.6;
  if(rangeWinds!=null){
    windSpeed = rangeWinds;
  }
}
function winddValue(newValue)
{
  rangeWindd = newValue;
  if(rangeWindd!=null){
    windDirection = rangeWindd;
  }
}
function cloudValue(newValue)
{
  rangeCloud = newValue;
}
function rainValue(newValue)
{
  rangeRain = newValue;
}
function snowValue(newValue)
{
  rangeSnow = newValue;
}
function starValue(newValue)
{
  rangeStar = newValue;
}
