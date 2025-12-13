// Based on https://github.com/stegu/webgl-noise/blob/22434e04d7753f7e949e8d724ab3da2864c17a0f/src/noise3D.glsl
// MIT licensed, adapted for p5.strands and converted to WGSL

export default `fn mod289Vec3(x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289Vec4(x: vec4<f32>) -> vec4<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute(x: vec4<f32>) -> vec4<f32> {
  return mod289Vec4(((x*34.0)+10.0)*x);
}

fn taylorInvSqrt(r: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(1.79284291400159) - vec4<f32>(0.85373472095314) * r;
}

fn baseNoise(v: vec3<f32>) -> f32 {
  let C = vec2<f32>(1.0/6.0, 1.0/3.0);
  let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

  // First corner
  var i = floor(v + dot(v, C.yyy));
  let x0 = v - i + dot(i, C.xxx);

  // Other corners
  let g = step(x0.yzx, x0.xyz);
  let l = vec3<f32>(1.0) - g;
  let i1 = min(g.xyz, l.zxy);
  let i2 = max(g.xyz, l.zxy);

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  let x1 = x0 - i1 + C.xxx;
  let x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  let x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289Vec3(i);
  let p = permute( permute( permute(
          i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0 ))
        + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0 ))
      + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  let n_ = 0.142857142857; // 1.0/7.0
  let ns = n_ * D.wyz - D.xzx;

  let j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  let x_ = floor(j * ns.z);
  let y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  let x = x_ *ns.x + ns.yyyy;
  let y = y_ *ns.x + ns.yyyy;
  let h = vec4<f32>(1.0) - abs(x) - abs(y);

  let b0 = vec4<f32>( x.xy, y.xy );
  let b1 = vec4<f32>( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  let s0 = floor(b0)*2.0 + vec4<f32>(1.0);
  let s1 = floor(b1)*2.0 + vec4<f32>(1.0);
  let sh = -step(h, vec4<f32>(0.0));

  let a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw*sh.zzww;

  let p0 = vec3<f32>(a0.xy, h.x);
  let p1 = vec3<f32>(a0.zw, h.y);
  let p2 = vec3<f32>(a1.xy, h.z);
  let p3 = vec3<f32>(a1.zw, h.w);

  //Normalise gradients
  let norm = taylorInvSqrt(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  let p0_norm = p0 * norm.x;
  let p1_norm = p1 * norm.y;
  let p2_norm = p2 * norm.z;
  let p3_norm = p3 * norm.w;

  // Mix final noise value
  var m = max(vec4<f32>(0.5) - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
  m = m * m;
  return 105.0 * dot( m*m, vec4<f32>( dot(p0_norm,x0), dot(p1_norm,x1),
        dot(p2_norm,x2), dot(p3_norm,x3) ) );
}

fn noise(st: vec3<f32>) -> f32 {
  var result = 0.0;
  var amplitude = 1.0;
  var frequency = 1.0;

  for (var i = 0; i < 4; i++) {
    result += amplitude * baseNoise(st * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return result;
}`;