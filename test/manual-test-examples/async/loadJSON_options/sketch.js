function setup() {
    noCanvas();
    loadJSON('http://api.openweathermap.org/data/2.5/station?id=5091',parseStuff,'json');   

}

function parseStuff(data){
    console.log(data); 
}