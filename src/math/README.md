# p5.js Math

This folder contains modules with mathmatical functions and any internal state required by those functions.

## [calculation.js](./calculation.js)

## [math.js](./math.js)

## [noise.js](./math.js)

## [p5.Vector.js](./p5.Vector.js)

[Tests](/test/unit/math/p5.Vector.js)

Functions that create and modify `p5.Vector` objects. Each function should include mutable and static versions, where applicable.

### Mutable Vector Functions

Mutable functions modify the value of the original vector that they operate on. They are invoked as a method of the vector that they operate on.

```
let v = new p5.Vector(10, 0, 0);
v.normalize();
print(v); // [1, 0, 0]
```

### Static Vector Functions

Static functions return the new value but leave the original unchanged. They are invoked as a method of the `p5.Vector` class.

```
const v0 = new p5.Vector(10, 0, 0);
const v1 = p5.Vector.normalize(v0);
print(v0); // [10, 0, 0] <- original vector is unchanged
print(v1); // [1, 0, 0] <- newly returned normalized vector
```

## [random.js](./random.js)

## [trigonometry.js](./trigonometry.js)
