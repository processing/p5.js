function setup() {
  createCanvas(200, 200);
  background(0, 100, 100);
  noLoop();
}

function draw() {

let v0, v1, v2, v3;
      v0 = new p5.Vector();
      v1 = new p5.Vector([1]);
      v2 = new p5.Vector([2, 3]);
      v3 = new p5.Vector([4, 5, 6]);
    
    print('should be prioritized in add()')
    v0 = v1.add(v2)
    console.log(v0.x, v0.y, v0.z)
      console.log(v1.add(v2).values, [2]);
      console.log(v1.add(v2).dimensions, 1);
      console.log(v3.add(v2).values, [8,15]);
      console.log(v3.add(v2).dimensions, 2);
   
      print('should be prioritized in sub()')
      console.log(v1.sub(v2).values, [-1]);
      console.log(v1.sub(v2).dimensions, 1);
      console.log(v3.sub(v2).values, [2, 2]);
      console.log(v3.sub(v2).dimensions, 2);
    print('should be prioritized in mult()')
      console.log(v1.mult(v2).values, [2]);
      console.log(v1.mult(v2).dimensions, 1);
      console.log(v3.mult(v2).values, [8, 15]);
      console.log(v3.mult(v2).dimensions, 2);
   
    print('should be prioritized in div()');
      console.log(v1.div(v2).values, [1/2]);
      console.log(v1.div(v2).dimensions, 1);
      console.log(v3.div(v2).values, [2, 5/3]);
      console.log(v3.div(v2).dimensions, 2);

    print('should be prioritized in rem()')
      console.log(v1.rem(v2).values, [1]);
      console.log(v1.rem(v2).dimensions, 1);
      console.log(v3.rem(v2).values, [0, 2]);
      console.log(v3.rem(v2).dimensions, 2);

  return;


  const arr_random = []; 
  for (let i = 0; i < 100+2; i++) {
    arr_random.push(random());
  }
  
  const arr = [];

  // TODO:
  // for(let iters = 100; iters < 5000; i+= 100)

  console.log("creating vecotrs")
  console.time();
  for (let i = 0; i < 100; i++) {
    arr.push(createVector(arr_random[i], arr_random[i+1], arr_random[i+2]));
  }

  console.timeEnd();


  console.log("pairwise multiplying them vecotrs")
  console.time();


  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      const _ = arr[i].mult(arr[j].mult(2));
    }
  }

  console.timeEnd();

  //default: 1.7999999523162842ms
  // default: 2ms
  //default: 0.20000004768371582ms  but I got a "wait or kill" dialog

  background(100, 0, 100);
}
