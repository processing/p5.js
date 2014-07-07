/* 

Hastily written scroll to fixed position:

TO DO:  

    - needs to not fail on resize of resize after scrolling, 
    - and needs to use animate() to add jquery easing  

*/

var elementPosition = $('#menu').offset();

$(window).scroll(function(){
  if($(window).scrollTop() > elementPosition.top){
    $('#menu').css({'position':'fixed','top':'0', 'z-index': '9999'});
        
  } else {
    $('#menu').css({'position':'static'});
  }    
});

window.onload = function() {
  //renderCode('demo');
}