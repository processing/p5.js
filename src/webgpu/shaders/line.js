const uniforms = `
// Group 1: Camera and Projection
struct CameraUniforms {
  uProjectionMatrix: mat4x4<f32>,
  uViewport: vec4<f32>,
  uPerspective: u32,
}

// Group 2: Model Transform
struct ModelUniforms {
// @p5 ifdef StrokeVertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uViewMatrix: mat4x4<f32>,
// @p5 endif
// @p5 ifndef StrokeVertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
// @p5 endif
  uMaterialColor: vec4<f32>,
}

// Group 3: Stroke Properties
struct StrokeUniforms {
  uStrokeWeight: f32,
  uUseLineColor: f32,
  uSimpleLines: f32,
  uStrokeCap: u32,
  uStrokeJoin: u32,
}`;

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
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> stroke: StrokeUniforms;

struct StrokeVertex {
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
  let simpleLines = (stroke.uSimpleLines != 0.);
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
  if (stroke.uUseLineColor != 0.) {
    lineColor = input.aVertexColor;
  } else {
    lineColor = model.uMaterialColor;
  }
  var inputs = StrokeVertex(
    input.aPosition.xyz,
    input.aTangentIn,
    input.aTangentOut,
    lineColor,
    stroke.uStrokeWeight
  );

// @p5 ifdef StrokeVertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef StrokeVertex getWorldInputs
  inputs.position = (model.uModelMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (model.uModelMatrix * vec4<f32>(input.aTangentIn, 1.)).xyz;
  inputs.tangentOut = (model.uModelMatrix * vec4<f32>(input.aTangentOut, 1.)).xyz;
  inputs = HOOK_getWorldInputs(inputs);
// @p5 endif

// @p5 ifdef StrokeVertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (model.uViewMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (model.uViewMatrix * vec4<f32>(input.aTangentIn, 0.)).xyz;
  inputs.tangentOut = (model.uViewMatrix * vec4<f32>(input.aTangentOut, 0.)).xyz;
// @p5 endif
// @p5 ifndef StrokeVertex getWorldInputs
  // Apply both at once
  inputs.position = (model.uModelViewMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (model.uModelViewMatrix * vec4<f32>(input.aTangentIn, 0.)).xyz;
  inputs.tangentOut = (model.uModelViewMatrix * vec4<f32>(input.aTangentOut, 0.)).xyz;
// @p5 endif
// @p5 ifdef StrokeVertex getCameraInputs
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

  var p = camera.uProjectionMatrix * posp;
  var qIn = camera.uProjectionMatrix * posqIn;
  var qOut = camera.uProjectionMatrix * posqOut;

  var tangentIn = normalize((qIn.xy * p.w - p.xy * qIn.w) * camera.uViewport.zw);
  var tangentOut = normalize((qOut.xy * p.w - p.xy * qOut.w) * camera.uViewport.zw);

  var curPerspScale = vec2<f32>();
  if (camera.uPerspective == 1) {
    // Perspective ---
    // convert from world to clip by multiplying with projection scaling factor
    // to get the right thickness (see https://github.com/processing/processing/issues/5182)

    // The y value of the projection matrix may be flipped if rendering to a Framebuffer.
    // Multiplying again by its sign here negates the flip to get just the scale.
    curPerspScale = (camera.uProjectionMatrix * vec4(1., sign(camera.uProjectionMatrix[1][1]), 0., 0.)).xy;
  } else {
    // No Perspective ---
    // multiply by W (to cancel out division by W later in the pipeline) and
    // convert from screen to clip (derived from clip to screen above)
    curPerspScale = p.w / (0.5 * camera.uViewport.zw);
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
        var c = (posp.xy / posp.w + vec2<f32>(1.)) * 0.5 * camera.uViewport.zw;

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
        var maxMag = 3. * inputs.weight;
        if (mag > maxMag) {
          offset *= maxMag / mag;
        }
      } else if (sideEnum == 1.) {
          offset = side * normalIn * inputs.weight / 2.;
      } else if (sideEnum == 3.) {
          offset = side * normalOut * inputs.weight / 2.;
      }
    }
    if (stroke.uStrokeJoin == 2) {
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
    var normal = vec2<f32>(-tangent.y, tangent.x);

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
    p.zw
  );
  HOOK_afterVertex();
  return output;
}`;

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
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> stroke: StrokeUniforms;


fn distSquared(a: vec2<f32>, b: vec2<f32>) -> f32 {
  return dot(b - a, b - a);
}

struct Inputs {
  color: vec4<f32>,
  tangent: vec2<f32>,
  center: vec2<f32>,
  position: vec2<f32>,
  strokeWeight: f32,
}

@fragment
fn main(input: StrokeFragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();

  var inputs: Inputs;
  inputs.color = input.vColor;
  inputs.tangent = input.vTangent;
  inputs.center = input.vCenter;
  inputs.position = input.vPosition;
  inputs.strokeWeight = input.vStrokeWeight;
  inputs = HOOK_getPixelInputs(inputs);

  if (input.vCap > 0.) {
    if (
      stroke.uStrokeCap == STROKE_CAP_ROUND &&
      HOOK_shouldDiscard(distSquared(inputs.position, inputs.center) > inputs.strokeWeight * inputs.strokeWeight * 0.25)
    ) {
      discard;
    } else if (
      stroke.uStrokeCap == STROKE_CAP_SQUARE &&
      HOOK_shouldDiscard(dot(inputs.position - inputs.center, inputs.tangent) > 0.)
    ) {
      discard;
    } else if (HOOK_shouldDiscard(false)) {
      discard;
    }
  } else if (input.vJoin > 0.) {
    if (
      stroke.uStrokeJoin == STROKE_JOIN_ROUND &&
      HOOK_shouldDiscard(distSquared(inputs.position, inputs.center) > inputs.strokeWeight * inputs.strokeWeight * 0.25)
    ) {
      discard;
    } else if (stroke.uStrokeJoin == STROKE_JOIN_BEVEL) {
      let normal = vec2<f32>(-inputs.tangent.y, -inputs.tangent.x);
      if (HOOK_shouldDiscard(abs(dot(inputs.position - inputs.center, normal)) > input.vMaxDist)) {
        discard;
      }
    } else if (HOOK_shouldDiscard(false)) {
      discard;
    }
  }
  var col = HOOK_getFinalColor(inputs.color);
  col = vec4<f32>(col.rgb, 1.0) * col.a;
  HOOK_afterFragment();
  return vec4<f32>(col);
}
`;

