mat3 transform2D(float a, float b, float c, float d, float e, float f) {
  return mat3(a, b, 0.0, c, d, 0.0, e, f, 1.0);
}

mat4 transform3D(float a, float b, float c, float d, float e, float f, float g, float h, float i) {
  return mat4(a, b, c, 0.0, d, e, f, 0.0, g, h, i, 0.0, 0.0, 0.0, 0.0, 1.0);
}

mat4 translate(float x, float y) {
  return mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, 0.0, 1.0);
}

mat4 translate(vec2 v) {
  return translate(v.x, v.y);
}

mat4 translate(float x, float y, float z) {
  return mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, z, 1.0);
}

mat4 translate(vec3 v) {
  return translate(v.x, v.y, v.z);
}

mat4 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat4(c, s, 0.0, 0.0, -s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}

mat4 rotate(float angle, vec3 axis) {
  vec3 a = normalize(axis);
  float c = cos(angle);
  float s = sin(angle);
  float t = 1.0 - c;
  float x = a.x, y = a.y, z = a.z;
  return mat4(
    t*x*x + c,    t*x*y + s*z,  t*x*z - s*y,  0.0,
    t*x*y - s*z,  t*y*y + c,    t*y*z + s*x,  0.0,
    t*x*z + s*y,  t*y*z - s*x,  t*z*z + c,    0.0,
    0.0,          0.0,          0.0,          1.0
  );
}

mat4 scale(float s) {
  return mat4(s, 0.0, 0.0, 0.0, 0.0, s, 0.0, 0.0, 0.0, 0.0, s, 0.0, 0.0, 0.0, 0.0, 1.0);
}

mat4 scale(float x, float y) {
  return mat4(x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}

mat4 scale(vec2 v) {
  return scale(v.x, v.y);
}

mat4 scale(float x, float y, float z) {
  return mat4(x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0);
}

mat4 scale(vec3 v) {
  return scale(v.x, v.y, v.z);
}

vec3 transformPoint(mat4 m, vec3 p) {
  return (m * vec4(p, 1.0)).xyz;
}

vec2 transformPoint(mat3 m, vec2 p) {
  return (m * vec3(p, 1.0)).xy;
}

vec3 transformNormal(mat4 m, vec3 n) {
  return mat3(m) * n;
}

vec2 transformNormal(mat3 m, vec2 n) {
  return (m * vec3(n, 0.0)).xy;
}

mat4 multiply(mat4 a, mat4 b) {
  return a * b;
}

mat3 multiply(mat3 a, mat3 b) {
  return a * b;
}

mat2 multiply(mat2 a, mat2 b) {
  return a * b;
}

vec4 multiply(mat4 a, vec4 b) {
  return a * b;
}

vec3 multiply(mat3 a, vec3 b) {
  return a * b;
}

vec2 multiply(mat2 a, vec2 b) {
  return a * b;
}

vec4 multiply(vec4 a, mat4 b) {
  return a * b;
}

vec3 multiply(vec3 a, mat3 b) {
  return a * b;
}

vec2 multiply(vec2 a, mat2 b) {
  return a * b;
}
