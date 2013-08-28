

var setup = function() {
	console.log("setup");
// 	var a=-200, b=-40, c=-90;
// 	var sa = nf(a, 10);
// 	println(sa);  // Prints "0000000200"
// 	var sb = nf(b, 5);
// 	println(sb);  // Prints "00040"
// 	var sc = nf(c, 3);
// 	println(sc);  // Prints "090"

// 	var d = -200.94, e = -40.2, f = -9.012;
// 	var sd = nf(d, 5, 4);
// 	println(sd);  // Prints "0000000200.9400"


// 	var se = nf(e, 5, 4);
// 	println(se);  // Prints "0000000200.9400"


// 	var sf = nf(f, 5, 4);
// 	println(sf);  // Prints "0000000200.9400"

// 	// var se = nf(e, 5, 3);
// 	// println(se);  // Prints "00040.200"
// 	// var sf = nf(f, 3, 5);
// 	// println(sf);  // Prints "009.01200"

// 	println(nf([d, e, f], 5, 4));
// 
	// var a=200, b=-40, c=90; 
	// var sa = nfs(a, 10); 
	// println(sa);  // Prints "+0000000200" 
	// var sb = nfs(b, 5); 
	// println(sb);  // Prints "-00040" 
	// var sc = nfs(c, 3); 
	// println(sc);  // Prints "+090" 
	 
	// var d = -200.94, e = 40.2, f = -9.012; 
	// var sd = nfs(d, 10, 4); 
	// println(sd);  // Prints "-0000000200.9400" 
	// var se = nfs(e, 5, 3); 
	// println(se);  // Prints "+00040.200" 
	// var sf = nfs(f, 3, 5); 
	// println(sf);  // Prints "-009.01200" 

	// console.log(nfs([d, e, f], 5, 3));
	var a1 = [ " inconsistent ", " spacing" ];  // Note spaces
	var a2 = trim(a1);
	println(a2);

};

var draw = function() {
	// console.log(focused);
	// background(255);

	// ellipse(0, 50, 33, 33);  // Left circle

	// pushStyle();  // Start a new style
	// 	strokeWeight(10);
	// 	fill(204, 153, 0);
	// 	ellipse(50, 50, 33, 33);  // Middle circle
	// popStyle();  // Restore original style

	// ellipse(100, 50, 33, 33);  // Right circle

	// ellipse(0, 50, 33, 33);  // Left circle

	// pushStyle();  // Start a new style
	// 	strokeWeight(10);
	// 	fill(204, 153, 0);
	// 	ellipse(33, 50, 33, 33);  // Left-middle circle

	// 	pushStyle();  // Start another new style
	// 		stroke(0, 102, 153);
	// 		ellipse(66, 50, 33, 33);  // Right-middle circle
	// 	popStyle();  // Restore previous style

	// popStyle();  // Restore original style

	// ellipse(100, 50, 33, 33);  // Right circle
};

var keyPressed = function() {
	println("key: |" + key + "| (" + keyCode + ")");
};