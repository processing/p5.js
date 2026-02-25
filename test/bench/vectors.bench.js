import {default as vector, Vector} from '../../src/math/p5.Vector.js';

import { bench, describe, beforeAll } from "vitest";

// This is not parameterizable because it's run all the time
function setupVectors() {
  const n = 100;
  const arr = [new Array(n)]
  for (let i = 0; i < n; i++) arr[i] = new Vector(Math.random(), Math.random(), Math.random())
  return arr
}



describe("vector operations", () => {
  beforeAll(function () {
    vector(mockP5Prototype);
  });


  bench(
    "mult 5",
    () => {
      const nLimited = 5;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].mult(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );

  bench(
    "mult 10",
    () => {
      const nLimited = 10;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].mult(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );

  bench(
    "mult 20",
    () => {
      const nLimited = 20;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].mult(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );
  bench(
    "mult 100",
    () => {
      const nLimited = 100;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].mult(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );



  bench(
    "add 5",
    () => {
      const nLimited = 5;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].add(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );

  bench(
    "add 10",
    () => {
      const nLimited = 10;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].add(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );

  bench(
    "add 20",
    () => {
      const nLimited = 20;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].add(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );
  bench(
    "add 100",
    () => {
      const nLimited = 100;
      const arr = setupVectors();
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].add(arr[j]);
        }
      }
    },
    { iterations: 100 }
    );


/**
 * possible in vitest 3?
  function benchMult(nLimited) {
    bench(
      `mult ${nLimited}`,
        (arr) => {
            console.log(">",arr)
            console.log(">",arr.length)
          for (let i = 0; i < nLimited; i++) {
            for (let j = 0; j < nLimited; j++) {
              const tmp = arr[i].mult(arr[j]);
           }
        }
      },
      {
        iterations: 20,
        setup: () => setupVectors(10000),
      }
    )
  }

  benchMult(10)
  //benchMult(1000)
  //benchMult(2000)
  //benchMult(3000)
  //benchMult(4000)

  */
  
});
