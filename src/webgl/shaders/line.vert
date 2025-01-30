/*
  Part of the Processing project - http://processing.org
  Copyright (c) 2012-15 The Processing Foundation
  Copyright (c) 2004-12 Ben Fry and Casey Reas
  Copyright (c) 2001-04 Massachusetts Institute of Technology
  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation, version 2.1.
  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.
  You should have received a copy of the GNU Lesser General
  Public License along with this library; if not, write to the
  Free Software Foundation, Inc., 59 Temple Place, Suite 330,
  Boston, MA  02111-1307  USA
*/

#define PROCESSING_LINE_SHADER

#define HOOK_DEFINES

precision highp int;
precision highp float;

#ifdef AUGMENTED_HOOK_getWorldInputs
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
#else
uniform mat4 uModelViewMatrix;
#endif

uniform mat4 uProjectionMatrix;
uniform float uStrokeWeight;

uniform bool uUseLineColor;
uniform bool uSimpleLines;
uniform vec4 uMaterialColor;

uniform vec4 uViewport;
uniform int uPerspective;
uniform int uStrokeJoin;

IN vec3 aPosition;
IN vec3 aTangentIn;
IN vec3 aTangentOut;
IN float aSide;
IN vec4 aVertexColor;

OUT vec4 vColor;
OUT vec2 vTangent;
OUT vec2 vCenter;
OUT vec2 vPosition;
OUT float vMaxDist;
OUT float vCap;
OUT float vJoin;
OUT float vStrokeWeight;

vec2 lineIntersection(vec2 aPoint, vec2 aDir, vec2 bPoint, vec2 bDir) {
  // Rotate and translate so a starts at the origin and goes out to the right
  bPoint -= aPoint;
  vec2 rotatedBFrom = vec2(
    bPoint.x*aDir.x + bPoint.y*aDir.y,
    bPoint.y*aDir.x - bPoint.x*aDir.y
  );
  vec2 bTo = bPoint + bDir;
  vec2 rotatedBTo = vec2(
    bTo.x*aDir.x + bTo.y*aDir.y,
    bTo.y*aDir.x - bTo.x*aDir.y
  );
  float intersectionDistance =
    rotatedBTo.x + (rotatedBFrom.x - rotatedBTo.x) * rotatedBTo.y /
    (rotatedBTo.y - rotatedBFrom.y);
  return aPoint + aDir * intersectionDistance;
}

struct StrokeVertex {
  vec3 position;
  vec3 tangentIn;
  vec3 tangentOut;
  vec4 color;
  float weight;
};

void main() {
  HOOK_beforeVertex();

  if (!uSimpleLines) {
      // Caps have one of either the in or out tangent set to 0
      vCap = (aTangentIn == vec3(0.)) != (aTangentOut == vec3(0.)) ? 1. : 0.;

      // Joins have two unique, defined tangents
      vJoin = (
          aTangentIn != vec3(0.) &&
          aTangentOut != vec3(0.) &&
          aTangentIn != aTangentOut
      ) ? 1. : 0.;
  }

  StrokeVertex inputs;
  inputs.position = aPosition.xyz;
  inputs.color = uUseLineColor ? aVertexColor : uMaterialColor;
  inputs.weight = uStrokeWeight;
  inputs.tangentIn = aTangentIn;
  inputs.tangentOut = aTangentOut;

#ifdef AUGMENTED_HOOK_getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
#endif

#ifdef AUGMENTED_HOOK_getWorldInputs
  inputs.position = (uModelMatrix * vec4(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uModelMatrix * vec4(aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uModelMatrix * vec4(aTangentOut, 0.)).xyz;
  inputs = HOOK_getWorldInputs(inputs);
#endif

#ifdef AUGMENTED_HOOK_getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uViewMatrix * vec4(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uViewMatrix * vec4(aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uViewMatrix * vec4(aTangentOut, 0.)).xyz;
#else
  // Apply both at once
  inputs.position = (uModelViewMatrix * vec4(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uModelViewMatrix * vec4(aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uModelViewMatrix * vec4(aTangentOut, 0.)).xyz;
#endif
#ifdef AUGMENTED_HOOK_getCameraInputs
  inputs = hook_getCameraInputs(inputs);
#endif

  vec4 posp = vec4(inputs.position, 1.);
  vec4 posqIn = vec4(inputs.position + inputs.tangentIn, 1.);
  vec4 posqOut = vec4(inputs.position + inputs.tangentOut, 1.);
  vStrokeWeight = inputs.weight;

  float facingCamera = pow(
    // The word space tangent's z value is 0 if it's facing the camera
    abs(normalize(posqIn-posp).z),

    // Using pow() here to ramp `facingCamera` up from 0 to 1 really quickly
    // so most lines get scaled and don't get clipped
    0.25
  );

  // Moving vertices slightly toward the camera
  // to avoid depth-fighting with the fill triangles.
  // A mix of scaling and offsetting is used based on distance
  // Discussion here:
  // https://github.com/processing/p5.js/issues/7200 

  // using a scale <1 moves the lines towards nearby camera
  // in order to prevent popping effects due to half of
  // the line disappearing behind the geometry faces.
  float zDistance = -posp.z; 
  float distanceFactor = smoothstep(0.0, 800.0, zDistance); 
  
  // Discussed here:
  // http://www.opengl.org/discussion_boards/ubbthreads.php?ubb=showflat&Number=252848  
  float scale = mix(1., 0.995, facingCamera);
  float dynamicScale = mix(scale, 1.0, distanceFactor); // Closer = more scale, farther = less

  posp.xyz = posp.xyz * dynamicScale;
  posqIn.xyz = posqIn.xyz * dynamicScale;
  posqOut.xyz = posqOut.xyz * dynamicScale;

  // Moving vertices slightly toward camera when far away 
  // https://github.com/processing/p5.js/issues/6956 
  float zOffset = mix(0., -1., facingCamera);
  float dynamicZAdjustment = mix(0.0, zOffset, distanceFactor); // Closer = less zAdjustment, farther = more

  posp.z -= dynamicZAdjustment;
  posqIn.z -= dynamicZAdjustment;
  posqOut.z -= dynamicZAdjustment;
  
  vec4 p = uProjectionMatrix * posp;
  vec4 qIn = uProjectionMatrix * posqIn;
  vec4 qOut = uProjectionMatrix * posqOut;

  // formula to convert from clip space (range -1..1) to screen space (range 0..[width or height])
  // screen_p = (p.xy/p.w + <1,1>) * 0.5 * uViewport.zw

  // prevent division by W by transforming the tangent formula (div by 0 causes
  // the line to disappear, see https://github.com/processing/processing/issues/5183)
  // t = screen_q - screen_p
  //
  // tangent is normalized and we don't care which aDirection it points to (+-)
  // t = +- normalize( screen_q - screen_p )
  // t = +- normalize( (q.xy/q.w+<1,1>)*0.5*uViewport.zw - (p.xy/p.w+<1,1>)*0.5*uViewport.zw )
  //
  // extract common factor, <1,1> - <1,1> cancels out
  // t = +- normalize( (q.xy/q.w - p.xy/p.w) * 0.5 * uViewport.zw )
  //
  // convert to common divisor
  // t = +- normalize( ((q.xy*p.w - p.xy*q.w) / (p.w*q.w)) * 0.5 * uViewport.zw )
  //
  // remove the common scalar divisor/factor, not needed due to normalize and +-
  // (keep uViewport - can't remove because it has different components for x and y
  //  and corrects for aspect ratio, see https://github.com/processing/processing/issues/5181)
  // t = +- normalize( (q.xy*p.w - p.xy*q.w) * uViewport.zw )

  vec2 tangentIn = normalize((qIn.xy*p.w - p.xy*qIn.w) * uViewport.zw);
  vec2 tangentOut = normalize((qOut.xy*p.w - p.xy*qOut.w) * uViewport.zw);

  vec2 curPerspScale;
  if(uPerspective == 1) {
    // Perspective ---
    // convert from world to clip by multiplying with projection scaling factor
    // to get the right thickness (see https://github.com/processing/processing/issues/5182)

    // The y value of the projection matrix may be flipped if rendering to a Framebuffer.
    // Multiplying again by its sign here negates the flip to get just the scale.
    curPerspScale = (uProjectionMatrix * vec4(1, sign(uProjectionMatrix[1][1]), 0, 0)).xy;
  } else {
    // No Perspective ---
    // multiply by W (to cancel out division by W later in the pipeline) and
    // convert from screen to clip (derived from clip to screen above)
    curPerspScale = p.w / (0.5 * uViewport.zw);
  }

  vec2 offset;
  if (vJoin == 1. && !uSimpleLines) {
    vTangent = normalize(tangentIn + tangentOut);
    vec2 normalIn = vec2(-tangentIn.y, tangentIn.x);
    vec2 normalOut = vec2(-tangentOut.y, tangentOut.x);
    float side = sign(aSide);
    float sideEnum = abs(aSide);

    // We generate vertices for joins on either side of the centerline, but
    // the "elbow" side is the only one needing a join. By not setting the
    // offset for the other side, all its vertices will end up in the same
    // spot and not render, effectively discarding it.
    if (sign(dot(tangentOut, vec2(-tangentIn.y, tangentIn.x))) != side) {
      // Side enums:
      //   1: the side going into the join
      //   2: the middle of the join
      //   3: the side going out of the join
      if (sideEnum == 2.) {
        // Calculate the position + tangent on either side of the join, and
        // find where the lines intersect to find the elbow of the join
        vec2 c = (posp.xy/posp.w + vec2(1.,1.)) * 0.5 * uViewport.zw;
        vec2 intersection = lineIntersection(
          c + (side * normalIn * inputs.weight / 2.),
          tangentIn,
          c + (side * normalOut * inputs.weight / 2.),
          tangentOut
        );
        offset = (intersection - c);

        // When lines are thick and the angle of the join approaches 180, the
        // elbow might be really far from the center. We'll apply a limit to
        // the magnitude to avoid lines going across the whole screen when this
        // happens.
        float mag = length(offset);
        float maxMag = 3. * inputs.weight;
        if (mag > maxMag) {
          offset *= maxMag / mag;
        }
      } else if (sideEnum == 1.) {
        offset = side * normalIn * inputs.weight / 2.;
      } else if (sideEnum == 3.) {
        offset = side * normalOut * inputs.weight / 2.;
      }
    }
    if (uStrokeJoin == STROKE_JOIN_BEVEL) {
      vec2 avgNormal = vec2(-vTangent.y, vTangent.x);
      vMaxDist = abs(dot(avgNormal, normalIn * inputs.weight / 2.));
    } else {
      vMaxDist = inputs.weight / 2.;
    }
  } else {
    vec2 tangent = aTangentIn == vec3(0.) ? tangentOut : tangentIn;
    vTangent = tangent;
    vec2 normal = vec2(-tangent.y, tangent.x);

    float normalOffset = sign(aSide);
    // Caps will have side values of -2 or 2 on the edge of the cap that
    // extends out from the line
    float tangentOffset = abs(aSide) - 1.;
    offset = (normal * normalOffset + tangent * tangentOffset) *
      inputs.weight * 0.5;
    vMaxDist = inputs.weight / 2.;
  }

  vCenter = p.xy;
  vPosition = vCenter + offset;
  vColor = inputs.color;

  gl_Position.xy = p.xy + offset.xy * curPerspScale;
  gl_Position.zw = p.zw;
  
  HOOK_afterVertex();
}
