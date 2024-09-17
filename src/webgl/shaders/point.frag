precision mediump int;
uniform vec4 uMaterialColor;
IN float vStrokeWeight;

void main(){
  HOOK_beforeFragment();
  float mask = 0.0;

  // make a circular mask using the gl_PointCoord (goes from 0 - 1 on a point)
  // might be able to get a nicer edge on big strokeweights with smoothstep but slightly less performant

  mask = step(0.98, length(gl_PointCoord * 2.0 - 1.0));

  // if strokeWeight is 1 or less lets just draw a square
  // this prevents weird artifacting from carving circles when our points are really small
  // if strokeWeight is larger than 1, we just use it as is

  mask = mix(0.0, mask, clamp(floor(vStrokeWeight - 0.5),0.0,1.0));

  // throw away the borders of the mask
  // otherwise we get weird alpha blending issues

  if(HOOK_shouldDiscard(mask > 0.98)){
    discard;
  }

  OUT_COLOR = HOOK_getFinalColor(vec4(uMaterialColor.rgb, 1.) * uMaterialColor.a);
  HOOK_afterFragment();
}
