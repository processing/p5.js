#ifndef WEBGL2
#extension GL_OES_standard_derivatives : enable
#endif

#if 0
  // simulate integer math using floats
	#define int float
	#define ivec2 vec2
	#define INT(x) float(x)

	int ifloor(float v) { return floor(v); }
	ivec2 ifloor(vec2 v) { return floor(v); }

#else
  // use native integer math
	precision highp int;
	#define INT(x) x

	int ifloor(float v) { return int(v); }
	int ifloor(int v) { return v; }
	ivec2 ifloor(vec2 v) { return ivec2(v); }

#endif

uniform sampler2D uSamplerStrokes;
uniform sampler2D uSamplerRowStrokes;
uniform sampler2D uSamplerRows;
uniform sampler2D uSamplerColStrokes;
uniform sampler2D uSamplerCols;

uniform ivec2 uStrokeImageSize;
uniform ivec2 uCellsImageSize;
uniform ivec2 uGridImageSize;

uniform ivec2 uGridOffset;
uniform ivec2 uGridSize;
uniform vec4 uMaterialColor;

IN vec2 vTexCoord;

// some helper functions
int ROUND(float v) { return ifloor(v + 0.5); }
ivec2 ROUND(vec2 v) { return ifloor(v + 0.5); }
float saturate(float v) { return clamp(v, 0.0, 1.0); }
vec2 saturate(vec2 v) { return clamp(v, 0.0, 1.0); }

int mul(float v1, int v2) {
  return ifloor(v1 * float(v2));
}

ivec2 mul(vec2 v1, ivec2 v2) {
  return ifloor(v1 * vec2(v2) + 0.5);
}

// unpack a 16-bit integer from a float vec2
int getInt16(vec2 v) {
  ivec2 iv = ROUND(v * 255.0);
  return iv.x * INT(128) + iv.y;
}

vec2 pixelScale;
vec2 coverage = vec2(0.0);
vec2 weight = vec2(0.5);
const float minDistance = 1.0/8192.0;
const float hardness = 1.05; // amount of antialias

// the maximum number of curves in a glyph
const int N = INT(250);

// retrieves an indexed pixel from a sampler
vec4 getTexel(sampler2D sampler, int pos, ivec2 size) {
  int width = size.x;
  int y = ifloor(pos / width);
  int x = pos - y * width;  // pos % width

  return TEXTURE(sampler, (vec2(x, y) + 0.5) / vec2(size));
}

void calulateCrossings(vec2 p0, vec2 p1, vec2 p2, out vec2 C1, out vec2 C2) {

  // get the coefficients of the quadratic in t
  vec2 a = p0 - p1 * 2.0 + p2;
  vec2 b = p0 - p1;
  vec2 c = p0 - vTexCoord;

  // found out which values of 't' it crosses the axes
  vec2 surd = sqrt(max(vec2(0.0), b * b - a * c));
  vec2 t1 = ((b - surd) / a).yx;
  vec2 t2 = ((b + surd) / a).yx;

  // approximate straight lines to avoid rounding errors
  if (abs(a.y) < 0.001)
    t1.x = t2.x = c.y / (2.0 * b.y);

  if (abs(a.x) < 0.001)
    t1.y = t2.y = c.x / (2.0 * b.x);

  // plug into quadratic formula to find the corrdinates of the crossings
  C1 = ((a * t1 - b * 2.0) * t1 + c) * pixelScale;
  C2 = ((a * t2 - b * 2.0) * t2 + c) * pixelScale;
}

void coverageX(vec2 p0, vec2 p1, vec2 p2) {

  vec2 C1, C2;
  calulateCrossings(p0, p1, p2, C1, C2);

  // determine on which side of the x-axis the points lie
  bool y0 = p0.y > vTexCoord.y;
  bool y1 = p1.y > vTexCoord.y;
  bool y2 = p2.y > vTexCoord.y;

  // could web be under the curve (after t1)?
  if (y1 ? !y2 : y0) {
    // add the coverage for t1
    coverage.x += saturate(C1.x + 0.5);
    // calculate the anti-aliasing for t1
    weight.x = min(weight.x, abs(C1.x));
  }

  // are we outside the curve (after t2)?
  if (y1 ? !y0 : y2) {
    // subtract the coverage for t2
    coverage.x -= saturate(C2.x + 0.5);
    // calculate the anti-aliasing for t2
    weight.x = min(weight.x, abs(C2.x));
  }
}

// this is essentially the same as coverageX, but with the axes swapped
void coverageY(vec2 p0, vec2 p1, vec2 p2) {

  vec2 C1, C2;
  calulateCrossings(p0, p1, p2, C1, C2);

  bool x0 = p0.x > vTexCoord.x;
  bool x1 = p1.x > vTexCoord.x;
  bool x2 = p2.x > vTexCoord.x;

  if (x1 ? !x2 : x0) {
    coverage.y -= saturate(C1.y + 0.5);
    weight.y = min(weight.y, abs(C1.y));
  }

  if (x1 ? !x0 : x2) {
    coverage.y += saturate(C2.y + 0.5);
    weight.y = min(weight.y, abs(C2.y));
  }
}

void main() {

  // calculate the pixel scale based on screen-coordinates
  pixelScale = hardness / fwidth(vTexCoord);

  // which grid cell is this pixel in?
  ivec2 gridCoord = ifloor(vTexCoord * vec2(uGridSize));

  // intersect curves in this row
  {
    // the index into the row info bitmap
    int rowIndex = gridCoord.y + uGridOffset.y;
    // fetch the info texel
    vec4 rowInfo = getTexel(uSamplerRows, rowIndex, uGridImageSize);
    // unpack the rowInfo
    int rowStrokeIndex = getInt16(rowInfo.xy);
    int rowStrokeCount = getInt16(rowInfo.zw);

    for (int iRowStroke = INT(0); iRowStroke < N; iRowStroke++) {
      if (iRowStroke >= rowStrokeCount)
        break;

      // each stroke is made up of 3 points: the start and control point
      // and the start of the next curve.
      // fetch the indices of this pair of strokes:
      vec4 strokeIndices = getTexel(uSamplerRowStrokes, rowStrokeIndex++, uCellsImageSize);

      // unpack the stroke index
      int strokePos = getInt16(strokeIndices.xy);

      // fetch the two strokes
      vec4 stroke0 = getTexel(uSamplerStrokes, strokePos + INT(0), uStrokeImageSize);
      vec4 stroke1 = getTexel(uSamplerStrokes, strokePos + INT(1), uStrokeImageSize);

      // calculate the coverage
      coverageX(stroke0.xy, stroke0.zw, stroke1.xy);
    }
  }

  // intersect curves in this column
  {
    int colIndex = gridCoord.x + uGridOffset.x;
    vec4 colInfo = getTexel(uSamplerCols, colIndex, uGridImageSize);
    int colStrokeIndex = getInt16(colInfo.xy);
    int colStrokeCount = getInt16(colInfo.zw);
    
    for (int iColStroke = INT(0); iColStroke < N; iColStroke++) {
      if (iColStroke >= colStrokeCount)
        break;

      vec4 strokeIndices = getTexel(uSamplerColStrokes, colStrokeIndex++, uCellsImageSize);

      int strokePos = getInt16(strokeIndices.xy);
      vec4 stroke0 = getTexel(uSamplerStrokes, strokePos + INT(0), uStrokeImageSize);
      vec4 stroke1 = getTexel(uSamplerStrokes, strokePos + INT(1), uStrokeImageSize);
      coverageY(stroke0.xy, stroke0.zw, stroke1.xy);
    }
  }

  weight = saturate(1.0 - weight * 2.0);
  float distance = max(weight.x + weight.y, minDistance); // manhattan approx.
  float antialias = abs(dot(coverage, weight) / distance);
  float cover = min(abs(coverage.x), abs(coverage.y));
  OUT_COLOR = vec4(uMaterialColor.rgb, 1.) * uMaterialColor.a;
  OUT_COLOR *= saturate(max(antialias, cover));
}
