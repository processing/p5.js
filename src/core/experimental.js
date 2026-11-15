import { FES } from '../friendly_errors/fes';


/*
 * Sometimes p5.js includes experimental functionality whose APIs may
 * change in the future, but for which we want more community feedback
 * and testing. To be able to include these in a release, we need to:
 * - Create a name for the subject area, e.g. 'webgpu'
 * - Write a document in the contributor_docs folder for the subject area
 *   describing its goals and what we want feedback on. The file should match
 *   the subject area name, plus the .md suffix. If the subject area is a part of
 *   a larger experimental area, e.g. 'p5.strands.transforms' within 'p5.strands',
 *   it doesn't need a whole doc of its own: add a section to the larger area's doc
 *   instead, and point to it in experimentalDocSections below.
 * - Write a message below that will show up in the console when functionality
 *   from that subject area. A link to the doc will be automatically appended. Index
 *   the message by the same subject area name.
 * - Mark functions in that subject area with the experimental decorator, passing in
 *   the subject area name as a parameter to markExperimental. e.g.:
 *     p5.registerDecorator(
 *       'p5.prototype.buildComputeShader',
 *       markExperimental('webgpu', p5)
 *     )
 *
 *   If overriding a method on a class, additionally pass in a function to get to the
 *   p5 instance from the class, e.g.:
 *
 *     p5.registerDecorator(
 *       'p5.Shader.prototype.modify',
 *       markExperimental('p5.strands', p5, (shader) => shader._renderer?._pInst)
 *     )
 *
 *   ...or, if you need to conditionally warn about experimental functionality, you
 *   can directly call warnExperimental(p5, pInst, subjectArea) inside a function.
 *   This is also the way to go when a function is only experimental some of the
 *   time, e.g. translate() is a regular p5 function unless it's given a p5.strands
 *   transform, and regular use shouldn't log a warning. Note that FES is switched
 *   off while a p5.strands callback runs, so functions used inside one add their
 *   subject area to strandsContext.experimentalFeaturesUsed instead, and modify()
 *   calls warnExperimental for each once the callback is done.
 */

const experimentalMessages = {
  webgpu: 'WEBGPU mode is experimental, so its functions and constants may change in future versions. You can get involved by giving feedback to help direct its development!',
  'p5.strands': 'p5.strands shaders are experimental, so functions for building shaders and the hooks available within them may change in future versions. You can get involved by giving feedback to help direct its development!',
  'p5.strands.transforms': 'p5.strands transforms are experimental, so transform2D(), transform3D(), the matrix constructors, and the functions that build on them may change in future versions. You can get involved by giving feedback to help direct their development!',
  'p5.svg': 'SVG features are experimental, so SVG export, import, and shape recording functions may change in future versions. You can get involved by giving feedback to help direct its development!'
};

// By default, a subject area links to the contributor doc with the same name. A
// subject area that is a part of a larger one can instead point to a section of
// that area's doc, so that it doesn't need a whole doc of its own.
const experimentalDocSections = {
  'p5.strands.transforms': { doc: 'p5.strands', section: 'transforms-and-matrices' },
};

function experimentalDocURL(subjectArea) {
  const { doc = subjectArea, section } = experimentalDocSections[subjectArea] || {};
  return `https://p5js.org/contribute/${doc}/${section ? `#${section}` : ''}`;
}

// Just in case it's not possible to get access to the p5 instance from something,
// we still don't want to make logs super noisy from repeated warnings, so we'll
// fall back on this global cache. It means if you create a second p5 instance, it
// wouldn't log again, but this is only here to handle edge case classes disconnected
// from the p5 instance anyway.
const globalWarningTarget = {};

export function warnExperimental(p5, pInst, subjectArea) {
  const target = pInst || globalWarningTarget;
  if (!p5.disableFriendlyErrors && !target.warnedExperimental?.[subjectArea]) {
    target.warnedExperimental = target.warnedExperimental || {};
    target.warnedExperimental[subjectArea] = true;

    const message = experimentalMessages[subjectArea];
    const url = experimentalDocURL(subjectArea);
    FES.log`${message} For more info, see ${url}`();
  }
}

export function markExperimental(subjectArea, p5, getPInst = (targetObj) => targetObj) {
  return function (target) {
    return function (...args) {
      warnExperimental(p5, getPInst(this), subjectArea);
      return target.apply(this, args);
    }
  };
}
