import { Vector } from '../../src/math/p5.Vector.js';

import { bench, describe } from "vitest";


describe("vector operations", () => {

  bench(
    "mult 5",
    () => {
      const nLimited = 5;
      // TODO try just operating on det. values based on i and j
      // without re-creation
    
      for (let i = 0; i < nLimited; i++) {
        for (let j = 0; j < nLimited; j++) {
          const tmp = arr[i].mult(arr[j]);
        }
      }
    }
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
    }
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
    }
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
    }
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
    }
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
    });

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
    }
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
    );
  
});
