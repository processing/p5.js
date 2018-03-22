precision mediump float;

uniform vec2 v0, v1, v2, v3, v4, v5, v6, v7;
varying vec2 vPos;

const float p0 = 2.1;
const float p1 = -3.4;
const float p2 = 1.0;

void main(void)
{
  float d0 = distance(vPos, v0);
  float d1 = distance(vPos, v1);
  float d2 = distance(vPos, v2);
  float d3 = distance(vPos, v3);
  float d4 = distance(vPos, v4);
  float d5 = distance(vPos, v5);
  float d6 = distance(vPos, v6);
  float d7 = distance(vPos, v7);

  vec3 c = vec3(
    +d0 +d1 +d2 +d3 -d4 -d5    -d6    -d7*.9,
    -d0 +d1 -d2 -d3 -d4 +d5    +d6*.9 +d7,
    -d0 +d1 -d2 +d3 +d4 +d5*.9 -d6    -d7
  );
  gl_FragColor = vec4(p0 + p1 * normalize(1.0 + p2 * log(abs(c))), 1.0);
}
