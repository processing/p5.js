precision mediump float;

#if 0
	#define int float
	#define ivec2 vec2
	#define INT(x) float(x)

	int ifloor(float v) { return floor(v); }
	ivec2 ifloor(vec2 v) { return floor(v); }

#else
	precision mediump int;
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

uniform vec4 uGlyphRect;
uniform float uFontSize;

uniform vec2 uPpmScale;

varying vec2 vTexCoord;
varying float w;

int round(float v) { return ifloor(v + 0.5); }
ivec2 round(vec2 v) { return ifloor(v + 0.5); }
float saturate(float v) { return clamp(v, 0.0, 1.0); }
vec2 saturate(vec2 v) { return clamp(v, 0.0, 1.0); }

int mul(float v1, int v2) {
  return ifloor(v1 * float(v2));
}

ivec2 mul(vec2 v1, ivec2 v2) {
  return ifloor(v1 * vec2(v2) + 0.5);
}

int getInt16(vec2 v) {
  ivec2 iv = round(v * 255.0);
  return iv.x * INT(128) + iv.y;
}

vec2 ppm;
vec2 cov = vec2(0.0);
vec2 wgt = vec2(0.0);

const int N = INT(250);

vec4 getTexel(sampler2D sampler, int pos, ivec2 size) {
  int width = size.x;
  int y = ifloor(pos / width);
  int x = pos - y * width;

  return texture2D(sampler, (vec2(x, y) + 0.5) / vec2(size));
}

void coverageX(vec2 p0, vec2 p1, vec2 p2) {

  vec2 a = p0 - p1 * 2.0 + p2;
  vec2 b = p0 - p1;
  vec2 c = p0 - vTexCoord;

  vec2 surd = sqrt(max(vec2(0.0), b * b - a * c));
  vec2 t1 = ((b - surd) / a).yx;
  vec2 t2 = ((b + surd) / a).yx;

  if (abs(a.y) < 0.001)
    t1.x = t2.x = c.y / (2.0 * b.y);

  if (abs(a.x) < 0.001)
    t1.y = t2.y = c.x / (2.0 * b.x);

  vec2 C1 = ((a * t1 - b * 2.0) * t1 + c) * ppm;
  vec2 C2 = ((a * t2 - b * 2.0) * t2 + c) * ppm;

  bool y0 = p0.y > vTexCoord.y;
  bool y1 = p1.y > vTexCoord.y;
  bool y2 = p2.y > vTexCoord.y;

  if (y1 ? !y2 : y0) {
    cov.x += saturate(C1.x + 0.5);
    wgt.x = max(wgt.x, saturate(1.0 - abs(C1.x) * 2.0));
  }

  if (y1 ? !y0 : y2) {
    cov.x -= saturate(C2.x + 0.5);
    wgt.x = max(wgt.x, saturate(1.0 - abs(C2.x) * 2.0));
  }
}


void coverageY(vec2 p0, vec2 p1, vec2 p2) {

  vec2 a = p0 - p1 * 2.0 + p2;
  vec2 b = p0 - p1;
  vec2 c = p0 - vTexCoord;

  vec2 surd = sqrt(max(vec2(0.0), b * b - a * c));
  vec2 t1 = ((b - surd) / a).yx;
  vec2 t2 = ((b + surd) / a).yx;

  if (abs(a.y) < 0.001)
    t1.x = t2.x = c.y / (2.0 * b.y);

  if (abs(a.x) < 0.001)
    t1.y = t2.y = c.x / (2.0 * b.x);

  vec2 C1 = ((a * t1 - b * 2.0) * t1 + c) * ppm;
  vec2 C2 = ((a * t2 - b * 2.0) * t2 + c) * ppm;

  bool x0 = p0.x > vTexCoord.x;
  bool x1 = p1.x > vTexCoord.x;
  bool x2 = p2.x > vTexCoord.x;

  if (x1 ? !x2 : x0) {
    cov.y -= saturate(C1.y + 0.5);
    wgt.y = max(wgt.y, saturate(1.0 - abs(C1.y) * 2.0));
  }

  if (x1 ? !x0 : x2) {
    cov.y += saturate(C2.y + 0.5);
    wgt.y = max(wgt.y, saturate(1.0 - abs(C2.y) * 2.0));
  }
}

void main() {

  ppm = 200.0 * uFontSize * uGlyphRect.zw / (w * w);

  ivec2 gridCoord = ifloor(vTexCoord * vec2(uGridSize));

  {
    int rowIndex = gridCoord.y + uGridOffset.y;
    vec4 rowInfo = getTexel(uSamplerRows, rowIndex, uGridImageSize);
    int rowStrokeIndex = getInt16(rowInfo.xy);
    int rowStrokeCount = getInt16(rowInfo.zw);

    for (int iRowStroke = INT(0); iRowStroke < N; iRowStroke++) {
      if (iRowStroke >= rowStrokeCount)
        break;

      vec4 strokeIndices = getTexel(uSamplerRowStrokes, rowStrokeIndex++, uCellsImageSize);

      int strokePos = getInt16(strokeIndices.xy);
      vec4 stroke0 = getTexel(uSamplerStrokes, strokePos + INT(0), uStrokeImageSize);
      vec4 stroke1 = getTexel(uSamplerStrokes, strokePos + INT(1), uStrokeImageSize);
      coverageX(stroke0.xy, stroke0.zw, stroke1.xy);
    }
  }

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

  float v = saturate(max(abs(cov.x * wgt.x + cov.y * wgt.y) / max(wgt.x + wgt.y, 0.0001220703125), min(abs(cov.x), abs(cov.y))));

  //gl_FragColor.rg = (v * .8 + .2) * (vec2(gridCoord) * .8 + .2) / vec2(uGridSize);
  gl_FragColor = uMaterialColor;
  gl_FragColor.a *= v;

  /*
  gl_FragColor.a = 1.0;
  gl_FragColor.b = fract(w/1000.0);
  gl_FragColor.rgb = vec3(1.0);
  */
}