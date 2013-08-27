

var setup = function() {
	console.log("setup");
};

var draw = function() {
	console.log(focused);
};

var keyPressed = function() {
	println("key: |" + key + "| (" + keyCode + ")");
};