import { getTexture } from './utils'

const uniforms = `
struct Uniforms {
// @p5 ifdef Vertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uViewMatrix: mat4x4<f32>,
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
// @p5 endif
  uMaterialColor: vec4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uStrokeWeight: f32,
  uUseLineColor: f32,
  uSimpleLines: f32,
  uViewport: vec4<f32>,
  uPerspective: i32,
  uStrokeJoin: i32,
}
`;

export const lineVertexShader = `
struct StrokeVertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aSide: f32,
  @location(2) aTangentIn: vec3<f32>,
  @location(3) aTangentOut: vec3<f32>,
  @location(4) aVertexColor: vec4<f32>,
};

struct StrokeVertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vColor: vec4<f32>,
  @location(1) vTangent: vec2<f32>,
  @location(2) vCenter: vec2<f32>,
  @location(3) vPosition: vec2<f32>,
  @location(4) vMaxDist: f32,
  @location(5) vCap: f32,
  @location(6) vJoin: f32,
  @location(7) vStrokeWeight: f32,
};

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct Vertex {
  position: vec3<f32>,
  tangentIn: vec3<f32>,
  tangentOut: vec3<f32>,
  color: vec4<f32>,
  weight: f32,
}

fn lineIntersection(aPoint: vec2f, aDir: vec2f, bPoint: vec2f, bDir: vec2f) -> vec2f {
  // Rotate and translate so a starts at the origin and goes out to the right
  var bMutPoint = bPoint;
  bMutPoint -= aPoint;
  var rotatedBFrom = vec2<f32>(
    bMutPoint.x*aDir.x + bMutPoint.y*aDir.y,
    bMutPoint.y*aDir.x - bMutPoint.x*aDir.y
  );
  var bTo = bMutPoint + bDir;
  var rotatedBTo = vec2<f32>(
    bTo.x*aDir.x + bTo.y*aDir.y,
    bTo.y*aDir.x - bTo.x*aDir.y
  );
  var intersectionDistance =
    rotatedBTo.x + (rotatedBFrom.x - rotatedBTo.x) * rotatedBTo.y /
    (rotatedBTo.y - rotatedBFrom.y);
  return aPoint + aDir * intersectionDistance;
}

@vertex
fn main(input: StrokeVertexInput) -> StrokeVertexOutput {
  HOOK_beforeVertex();
  var output: StrokeVertexOutput;
  let viewport = vec4<f32>(0.,0.,400.,400.);
  let simpleLines = (uniforms.uSimpleLines != 0.);
  if (!simpleLines) {
    if (all(input.aTangentIn == vec3<f32>()) != all(input.aTangentOut == vec3<f32>())) {
      output.vCap = 1.;
    } else {
      output.vCap = 0.;
    }
    let conditionA = any(input.aTangentIn != vec3<f32>());
    let conditionB = any(input.aTangentOut != vec3<f32>());
    let conditionC = any(input.aTangentIn != input.aTangentOut);
    if (conditionA && conditionB && conditionC) {
      output.vJoin = 1.;
    } else {
      output.vJoin = 0.;
    }
  }
  var lineColor: vec4<f32>;
  if (uniforms.uUseLineColor != 0.) {
    lineColor = input.aVertexColor;
  } else {
    lineColor = uniforms.uMaterialColor;
  }
  var inputs = Vertex(
    input.aPosition.xyz,
    input.aTangentIn,
    input.aTangentOut,
    lineColor,
    uniforms.uStrokeWeight
  );

// @p5 ifdef Vertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  inputs.position = (uModelMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uModelMatrix * vec4<f32>(input.aTangentIn, 1.)).xyz;
  inputs.tangentOut = (uModelMatrix * vec4<f32>(input.aTangentOut, 1.)).xyz;
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uniforms.uViewMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uniforms.uViewMatrix * vec4<f32>(input.aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uniforms.uViewMatrix * vec4<f32>(input.aTangentOut, 0.)).xyz;
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  // Apply both at once
  inputs.position = (uniforms.uModelViewMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uniforms.uModelViewMatrix * vec4<f32>(input.aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uniforms.uModelViewMatrix * vec4<f32>(input.aTangentOut, 0.)).xyz;
// @p5 endif
// @p5 ifdef Vertex getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
// @p5 endif

  var posp = vec4<f32>(inputs.position, 1.);
  var posqIn = vec4<f32>(inputs.position + inputs.tangentIn, 1.);
  var posqOut = vec4<f32>(inputs.position + inputs.tangentOut, 1.);
  output.vStrokeWeight = inputs.weight;

  var facingCamera = pow(
    // The word space tangent's z value is 0 if it's facing the camera
    abs(normalize(posqIn-posp).z),

    // Using pow() here to ramp 'facingCamera' up from 0 to 1 really quickly
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
  var zDistance = -posp.z;
  var distanceFactor = smoothstep(0., 800., zDistance);

  // Discussed here:
  // http://www.opengl.org/discussion_boards/ubbthreads.php?ubb=showflat&Number=252848
  var scale = mix(1., 0.995, facingCamera);
  var dynamicScale = mix(scale, 1.0, distanceFactor); // Closer = more scale, farther = less

  posp = vec4<f32>(posp.xyz * dynamicScale, posp.w);
  posqIn = vec4<f32>(posqIn.xyz * dynamicScale, posqIn.w);
  posqOut= vec4<f32>(posqOut.xyz * dynamicScale, posqOut.w);

  // Moving vertices slightly toward camera when far away
  // https://github.com/processing/p5.js/issues/6956
  var zOffset = mix(0., -1., facingCamera);
  var dynamicZAdjustment = mix(0., zOffset, distanceFactor); // Closer = less zAdjustment, farther = more

  posp.z -= dynamicZAdjustment;
  posqIn.z -= dynamicZAdjustment;
  posqOut.z -= dynamicZAdjustment;

  var p = uniforms.uProjectionMatrix * posp;
  var qIn = uniforms.uProjectionMatrix * posqIn;
  var qOut = uniforms.uProjectionMatrix * posqOut;

  var tangentIn = normalize((qIn.xy * p.w - p.xy * qIn.w) * viewport.zw);
  var tangentOut = normalize((qOut.xy * p.w - p.xy * qOut.w) * viewport.zw);

  var curPerspScale = vec2<f32>();
  if (uniforms.uPerspective == 1) {
    // Perspective ---
    // convert from world to clip by multiplying with projection scaling factor
    // to get the right thickness (see https://github.com/processing/processing/issues/5182)

    // The y value of the projection matrix may be flipped if rendering to a Framebuffer.
    // Multiplying again by its sign here negates the flip to get just the scale.
    curPerspScale = (uniforms.uProjectionMatrix * vec4(1., sign(uniforms.uProjectionMatrix[1][1]), 0., 0.)).xy;
  } else {
    // No Perspective ---
    // multiply by W (to cancel out division by W later in the pipeline) and
    // convert from screen to clip (derived from clip to screen above)
    curPerspScale = p.w / (0.5 * viewport.zw);
  }

  var offset = vec2<f32>();
  if (output.vJoin == 1. && !simpleLines) {
    output.vTangent = normalize(tangentIn + tangentOut);
    var normalIn = vec2<f32>(-tangentIn.y, tangentIn.x);
    var normalOut = vec2<f32>(-tangentOut.y, tangentOut.x);
    var side = sign(input.aSide);
    var sideEnum = abs(input.aSide);

    // We generate vertices for joins on either side of the centerline, but
    // the "elbow" side is the only one needing a join. By not setting the
    // offset for the other side, all its vertices will end up in the same
    // spot and not render, effectively discarding it.
    if (sign(dot(tangentOut, vec2<f32>(-tangentIn.y, tangentIn.x))) != side) {
      // Side enums:
      //   1: the side going into the join
      //   2: the middle of the join
      //   3: the side going out of the join
      if (sideEnum == 2.) {
        // Calculate the position + tangent on either side of the join, and
        // find where the lines intersect to find the elbow of the join
        var c = (posp.xy / posp.w + vec2<f32>(1.)) * 0.5 * viewport.zw;

        var intersection = lineIntersection(
          c + (side * normalIn * inputs.weight / 2.),
          tangentIn,
          c + (side * normalOut * inputs.weight / 2.),
          tangentOut
        );
        offset = intersection - c;


        // When lines are thick and the angle of the join approaches 180, the
        // elbow might be really far from the center. We'll apply a limit to
        // the magnitude to avoid lines going across the whole screen when this
        // happens.
        var mag = length(offset);
        var maxMag = 3 * inputs.weight;
        if (mag > maxMag) {
          offset = vec2<f32>(maxMag / mag);
        } else if (sideEnum == 1.) {
          offset = side * normalIn * inputs.weight / 2.;
        } else if (sideEnum == 3.) {
          offset = side * normalOut * inputs.weight / 2.;
        }
      }
    }
    if (uniforms.uStrokeJoin == 2) {
      var avgNormal = vec2<f32>(-output.vTangent.y, output.vTangent.x);
      output.vMaxDist = abs(dot(avgNormal, normalIn * inputs.weight / 2.));
    } else {
      output.vMaxDist = inputs.weight / 2.;
    }
  } else {
    var tangent: vec2<f32>;
    if (all(input.aTangentIn == vec3<f32>())) {
      tangent = tangentOut;
    } else {
      tangent = tangentIn;
    }
    output.vTangent = tangent;
    var normal = vec2<f32>(-tangent.y, tangent.y);

    var normalOffset = sign(input.aSide);
    // Caps will have side values of -2 or 2 on the edge of the cap that
    // extends out from the line
    var tangentOffset = abs(input.aSide) - 1.;
    offset = (normal * normalOffset + tangent * tangentOffset) *
      inputs.weight * 0.5;
    output.vMaxDist = inputs.weight / 2.;
  }
  output.vCenter = p.xy;
  output.vPosition = output.vCenter + offset;
  output.vColor = inputs.color;

  output.Position = vec4<f32>(
    p.xy + offset.xy * curPerspScale,
    p.zy
  );
  var clip_pos: vec4<f32>;
  if (input.aSide == 1.0) {
    clip_pos = vec4<f32>(-0.1, 0.1, 0.5, 1.);
  } else if (input.aSide == -1.0) {
    clip_pos = vec4<f32>(-0.5, 0.5, 0.5, 1.0);
  } else {
    clip_pos = vec4<f32>(0.0, -0.5, 0.5 ,1.0);
  }
  output.Position = clip_pos;
  return output;
}


`;

export const lineFragmentShader = `
struct StrokeFragmentInput {
  @location(0) vColor: vec4<f32>,
  @location(1) vTangent: vec2<f32>,
  @location(2) vCenter: vec2<f32>,
  @location(3) vPosition: vec2<f32>,
  @location(4) vMaxDist: f32,
  @location(5) vCap: f32,
  @location(6) vJoin: f32,
  @location(7) vStrokeWeight: f32,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

${getTexture}

@fragment
fn main(input: StrokeFragmentInput) -> @location(0) vec4<f32> {
  return vec4<f32>(1., 1., 1., 1.);
}
`;

