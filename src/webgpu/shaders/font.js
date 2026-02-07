const uniforms = `
// Group 1: Camera and Projection
struct CameraUniforms {
  uProjectionMatrix: mat4x4<f32>,
}

// Group 2: Model Transform
struct ModelUniforms {
  uModelViewMatrix: mat4x4<f32>,
}

// Group 3: Font Properties
struct FontUniforms {
  uStrokeImageSize: vec2<i32>,
  uCellsImageSize: vec2<i32>,
  uGridImageSize: vec2<i32>,
  uGridOffset: vec2<i32>,
  uGridSize: vec2<i32>,
  uGlyphRect: vec4<f32>,
  uGlyphOffset: f32,
  uMaterialColor: vec4<f32>,
}
`;

export const fontVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aTexCoord: vec2<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vTexCoord: vec2<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> font: FontUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  var positionVec4 = vec4<f32>(input.aPosition, 1.0);

  // scale by the size of the glyph's rectangle
  positionVec4.x = positionVec4.x * (font.uGlyphRect.z - font.uGlyphRect.x);
  positionVec4.y = positionVec4.y * (font.uGlyphRect.w - font.uGlyphRect.y);

  // Expand glyph bounding boxes by 1px on each side to give a bit of room
  // for antialiasing
  let newOrigin = (model.uModelViewMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0)).xyz;
  let newDX = (model.uModelViewMatrix * vec4<f32>(1.0, 0.0, 0.0, 1.0)).xyz;
  let newDY = (model.uModelViewMatrix * vec4<f32>(0.0, 1.0, 0.0, 1.0)).xyz;
  let pixelScale = vec2<f32>(
    1.0 / length(newOrigin - newDX),
    1.0 / length(newOrigin - newDY)
  );
  let offset = pixelScale * normalize(input.aTexCoord - vec2<f32>(0.5, 0.5));
  let textureOffset = offset * (1.0 / vec2<f32>(
    font.uGlyphRect.z - font.uGlyphRect.x,
    font.uGlyphRect.w - font.uGlyphRect.y
  ));

  // move to the corner of the glyph
  positionVec4.x = positionVec4.x + font.uGlyphRect.x;
  positionVec4.y = positionVec4.y + font.uGlyphRect.y;

  // move to the letter's line offset
  positionVec4.x = positionVec4.x + font.uGlyphOffset;

  positionVec4.x = positionVec4.x + offset.x;
  positionVec4.y = positionVec4.y + offset.y;

  output.Position = camera.uProjectionMatrix * model.uModelViewMatrix * positionVec4;
  output.vTexCoord = input.aTexCoord + textureOffset;

  return output;
}
`;

export const fontFragmentShader = `
struct FragmentInput {
  @location(0) vTexCoord: vec2<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> font: FontUniforms;

@group(1) @binding(0) var uSamplerStrokes: texture_2d<f32>;
@group(1) @binding(1) var uSamplerStrokes_sampler: sampler;
@group(1) @binding(2) var uSamplerRowStrokes: texture_2d<f32>;
@group(1) @binding(3) var uSamplerRowStrokes_sampler: sampler;
@group(1) @binding(4) var uSamplerRows: texture_2d<f32>;
@group(1) @binding(5) var uSamplerRows_sampler: sampler;
@group(1) @binding(6) var uSamplerColStrokes: texture_2d<f32>;
@group(1) @binding(7) var uSamplerColStrokes_sampler: sampler;
@group(1) @binding(8) var uSamplerCols: texture_2d<f32>;
@group(1) @binding(9) var uSamplerCols_sampler: sampler;

// some helper functions
fn ROUND_f32(v: f32) -> i32 { return i32(floor(v + 0.5)); }
fn ROUND_vec2(v: vec2<f32>) -> vec2<i32> { return vec2<i32>(floor(v + 0.5)); }
fn saturate_f32(v: f32) -> f32 { return clamp(v, 0.0, 1.0); }
fn saturate_vec2(v: vec2<f32>) -> vec2<f32> { return clamp(v, vec2<f32>(0.0), vec2<f32>(1.0)); }

fn mul_f32_i32(v1: f32, v2: i32) -> i32 {
  return i32(floor(v1 * f32(v2)));
}

fn mul_vec2_ivec2(v1: vec2<f32>, v2: vec2<i32>) -> vec2<i32> {
  return vec2<i32>(floor(v1 * vec2<f32>(v2) + 0.5));
}

// unpack a 16-bit integer from a float vec2
fn getInt16(v: vec2<f32>) -> i32 {
  let iv = ROUND_vec2(v * 255.0);
  return iv.x * 128 + iv.y;
}

const minDistance: f32 = 1.0/8192.0;
const hardness: f32 = 1.05; // amount of antialias

// the maximum number of curves in a glyph
const N: i32 = 250;

// retrieves an indexed pixel from a texture
fn getTexel(texture: texture_2d<f32>, samp: sampler, pos: i32, size: vec2<i32>) -> vec4<f32> {
  let width = size.x;
  let x = pos % width;
  let y = pos / width;

  return textureLoad(texture, vec2<i32>(x, y), 0);
}

fn calculateCrossings(p0: vec2<f32>, p1: vec2<f32>, p2: vec2<f32>, vTexCoord: vec2<f32>, pixelScale: vec2<f32>) -> array<vec2<f32>, 2> {
  // get the coefficients of the quadratic in t
  var a = p0 - p1 * 2.0 + p2;
  var b = p0 - p1;
  a = vec2<f32>(
    select(a.x, sign(a.x) * 1e-6, abs(a.x) < 1e-6),
    select(a.y, sign(a.y) * 1e-6, abs(a.y) < 1e-6)
  );
  b = vec2<f32>(
    select(b.x, sign(b.x) * 1e-6, abs(b.x) < 1e-6),
    select(b.y, sign(b.y) * 1e-6, abs(b.y) < 1e-6)
  );
  let c = p0 - vTexCoord;

  // found out which values of 't' it crosses the axes
  let surd = sqrt(max(vec2<f32>(0.0), b * b - a * c));
  let t1 = ((b - surd) / a).yx;
  let t2 = ((b + surd) / a).yx;

  // approximate straight lines to avoid rounding errors
  var t1_fixed = t1;
  var t2_fixed = t2;
  if (abs(a.y) < 0.001) {
    t1_fixed.x = c.y / (2.0 * b.y);
    t2_fixed.x = c.y / (2.0 * b.y);
  }

  if (abs(a.x) < 0.001) {
    t1_fixed.y = c.x / (2.0 * b.x);
    t2_fixed.y = c.x / (2.0 * b.x);
  }

  // plug into quadratic formula to find the coordinates of the crossings
  let C1 = ((a * t1_fixed - b * 2.0) * t1_fixed + c) * pixelScale;
  let C2 = ((a * t2_fixed - b * 2.0) * t2_fixed + c) * pixelScale;

  return array<vec2<f32>, 2>(C1, C2);
}

fn coverageX(p0: vec2<f32>, p1: vec2<f32>, p2: vec2<f32>, vTexCoord: vec2<f32>, pixelScale: vec2<f32>, coverage: ptr<function, vec2<f32>>, weight: ptr<function, vec2<f32>>) {
  let crossings = calculateCrossings(p0, p1, p2, vTexCoord, pixelScale);
  let C1 = crossings[0];
  let C2 = crossings[1];

  // determine on which side of the x-axis the points lie
  let y0 = p0.y > vTexCoord.y;
  let y1 = p1.y > vTexCoord.y;
  let y2 = p2.y > vTexCoord.y;

  // could we be under the curve (after t1)?
  if ((y1 && !y2) || (!y1 && y0)) {
    // add the coverage for t1
    (*coverage).x = (*coverage).x + saturate_f32(C1.x + 0.5);
    // calculate the anti-aliasing for t1
    (*weight).x = min((*weight).x, abs(C1.x));
  }

  // are we outside the curve (after t2)?
  if ((y1 && !y0) || (!y1 && y2)) {
    // subtract the coverage for t2
    (*coverage).x = (*coverage).x - saturate_f32(C2.x + 0.5);
    // calculate the anti-aliasing for t2
    (*weight).x = min((*weight).x, abs(C2.x));
  }
}

// this is essentially the same as coverageX, but with the axes swapped
fn coverageY(p0: vec2<f32>, p1: vec2<f32>, p2: vec2<f32>, vTexCoord: vec2<f32>, pixelScale: vec2<f32>, coverage: ptr<function, vec2<f32>>, weight: ptr<function, vec2<f32>>) {
  let crossings = calculateCrossings(p0, p1, p2, vTexCoord, pixelScale);
  let C1 = crossings[0];
  let C2 = crossings[1];

  let x0 = p0.x > vTexCoord.x;
  let x1 = p1.x > vTexCoord.x;
  let x2 = p2.x > vTexCoord.x;

  if ((x1 && !x2) || (!x1 && x0)) {
    (*coverage).y = (*coverage).y - saturate_f32(C1.y + 0.5);
    weight.y = min(weight.y, abs(C1.y));
  }

  if ((x1 && !x0) || (!x1 && x2)) {
    (*coverage).y = (*coverage).y + saturate_f32(C2.y + 0.5);
    (*weight).y = min((*weight).y, abs(C2.y));
  }
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // var pixelScale: vec2<f32>;
  var coverage: vec2<f32> = vec2<f32>(0.0);
  var weight: vec2<f32> = vec2<f32>(0.5);
  let pixelScale = hardness / fwidth(input.vTexCoord);

  // which grid cell is this pixel in?
  let gridCoord = vec2<i32>(floor(input.vTexCoord * vec2<f32>(font.uGridSize)));

  // intersect curves in this row
  {
    // the index into the row info bitmap
    let rowIndex = gridCoord.y + font.uGridOffset.y;
    // fetch the info texel
    let rowInfo = getTexel(uSamplerRows, uSamplerRows_sampler, rowIndex, font.uGridImageSize);
    // unpack the rowInfo
    let rowStrokeIndex = getInt16(rowInfo.xy);
    let rowStrokeCount = getInt16(rowInfo.zw);

    for (var iRowStroke = 0; iRowStroke < N; iRowStroke = iRowStroke + 1) {
      if (iRowStroke >= rowStrokeCount) {
        break;
      }

      // each stroke is made up of 3 points: the start and control point
      // and the start of the next curve.
      // fetch the indices of this pair of strokes:
      let strokeIndices = getTexel(uSamplerRowStrokes, uSamplerRowStrokes_sampler, rowStrokeIndex + iRowStroke, font.uCellsImageSize);

      // unpack the stroke index
      let strokePos = getInt16(strokeIndices.xy);

      // fetch the two strokes
      let stroke0 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 0, font.uStrokeImageSize);
      let stroke1 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 1, font.uStrokeImageSize);

      // calculate the coverage
      coverageX(stroke0.xy, stroke0.zw, stroke1.xy, input.vTexCoord, pixelScale, &coverage, &weight);
    }
  }

  // intersect curves in this column
  {
    let colIndex = gridCoord.x + font.uGridOffset.x;
    let colInfo = getTexel(uSamplerCols, uSamplerCols_sampler, colIndex, font.uGridImageSize);
    let colStrokeIndex = getInt16(colInfo.xy);
    let colStrokeCount = getInt16(colInfo.zw);

    for (var iColStroke = 0; iColStroke < N; iColStroke = iColStroke + 1) {
      if (iColStroke >= colStrokeCount) {
        break;
      }

      let strokeIndices = getTexel(uSamplerColStrokes, uSamplerColStrokes_sampler, colStrokeIndex + iColStroke, font.uCellsImageSize);

      let strokePos = getInt16(strokeIndices.xy);
      let stroke0 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 0, font.uStrokeImageSize);
      let stroke1 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 1, font.uStrokeImageSize);
      coverageY(stroke0.xy, stroke0.zw, stroke1.xy, input.vTexCoord, pixelScale, &coverage, &weight);
    }
  }

  weight = saturate_vec2(vec2<f32>(1.0) - weight * 2.0);
  let distance = max(weight.x + weight.y, minDistance); // manhattan approx.
  let antialias = abs(dot(coverage, weight) / distance);
  let cover = min(abs(coverage.x), abs(coverage.y));
  var outColor = vec4<f32>(font.uMaterialColor.rgb, 1.0) * font.uMaterialColor.a;
  outColor = outColor * saturate_f32(max(antialias, cover));
  return outColor;
}
`;
