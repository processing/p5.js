export default `
fn translate2(x: f32, y: f32) -> mat4x4<f32> {
  return mat4x4<f32>(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, 0.0, 1.0);
}

fn translate2v(v: vec2<f32>) -> mat4x4<f32> {
  return translate2(v.x, v.y);
}

fn translate3(x: f32, y: f32, z: f32) -> mat4x4<f32> {
  return mat4x4<f32>(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, z, 1.0);
}

fn translate3v(v: vec3<f32>) -> mat4x4<f32> {
  return translate3(v.x, v.y, v.z);
}

fn rotateZ(angle: f32) -> mat4x4<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return mat4x4<f32>(c, s, 0.0, 0.0, -s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}

fn rotateAxis(angle: f32, axis: vec3<f32>) -> mat4x4<f32> {
  let a = normalize(axis);
  let c = cos(angle);
  let s = sin(angle);
  let t = 1.0 - c;
  let x = a.x;
  let y = a.y;
  let z = a.z;
  return mat4x4<f32>(
    t*x*x + c,    t*x*y + s*z,  t*x*z - s*y,  0.0,
    t*x*y - s*z,  t*y*y + c,    t*y*z + s*x,  0.0,
    t*x*z + s*y,  t*y*z - s*x,  t*z*z + c,    0.0,
    0.0,          0.0,          0.0,          1.0
  );
}

fn scale1(s: f32) -> mat4x4<f32> {
  return mat4x4<f32>(s, 0.0, 0.0, 0.0, 0.0, s, 0.0, 0.0, 0.0, 0.0, s, 0.0, 0.0, 0.0, 0.0, 1.0);
}

fn scale2(x: f32, y: f32) -> mat4x4<f32> {
  return mat4x4<f32>(x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}

fn scale2v(v: vec2<f32>) -> mat4x4<f32> {
  return scale2(v.x, v.y);
}

fn scale3(x: f32, y: f32, z: f32) -> mat4x4<f32> {
  return mat4x4<f32>(x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0);
}

fn scale3v(v: vec3<f32>) -> mat4x4<f32> {
  return scale3(v.x, v.y, v.z);
}

fn transformPoint4(m: mat4x4<f32>, p: vec3<f32>) -> vec3<f32> {
  return (m * vec4<f32>(p, 1.0)).xyz;
}

fn transformPoint3(m: mat3x3<f32>, p: vec2<f32>) -> vec2<f32> {
  return (m * vec3<f32>(p, 1.0)).xy;
}

fn transformNormal4(m: mat4x4<f32>, n: vec3<f32>) -> vec3<f32> {
  return mat3x3<f32>(m[0].xyz, m[1].xyz, m[2].xyz) * n;
}

fn transformNormal3(m: mat3x3<f32>, n: vec2<f32>) -> vec2<f32> {
  return (m * vec3<f32>(n, 0.0)).xy;
}

fn mult4x4(a: mat4x4<f32>, b: mat4x4<f32>) -> mat4x4<f32> { return a * b; }
fn mult3x3(a: mat3x3<f32>, b: mat3x3<f32>) -> mat3x3<f32> { return a * b; }
fn mult2x2(a: mat2x2<f32>, b: mat2x2<f32>) -> mat2x2<f32> { return a * b; }
fn mult4x4v(a: mat4x4<f32>, b: vec4<f32>) -> vec4<f32> { return a * b; }
fn mult3x3v(a: mat3x3<f32>, b: vec3<f32>) -> vec3<f32> { return a * b; }
fn mult2x2v(a: mat2x2<f32>, b: vec2<f32>) -> vec2<f32> { return a * b; }
fn multv4x4(a: vec4<f32>, b: mat4x4<f32>) -> vec4<f32> { return a * b; }
fn multv3x3(a: vec3<f32>, b: mat3x3<f32>) -> vec3<f32> { return a * b; }
fn multv2x2(a: vec2<f32>, b: mat2x2<f32>) -> vec2<f32> { return a * b; }
`;
