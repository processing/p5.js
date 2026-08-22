import { FES } from '../friendly_errors/fes';


/*
 * Sometimes p5.js includes experimental functionality whose APIs may
 * change in the future, but for which we want more community feedback
 * and testing. To be able to include these in a release, we need to:
 * - Create a name for the subject area, e.g. 'webgpu'
 * - Write a document in the contributor_docs folder for the subject area
 *   describing its goals and what we want feedback on. The file should match
 *   the subject area name, plus the .md suffix.
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
 */

const experimentalMessages = {
  webgpu: 'WEBGPU mode is experimental. Your feedback will help direct its development!',
  'p5.strands': 'p5.strands shaders are experimental. Whether you are a learner, educator, user, your feedback will help shape its future!',
};

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

    FES.log`${experimentalMessages[subjectArea]} For more info, see https://p5js.org/contribute/${subjectArea}/`();
  }
}

export function markExperimental(subjectArea, p5, getPInst = (targetObj) => targetObj) {
  return function (target) {
    return function (...args) {
      warnExperimental(p5, getPInst(this));
      return target.apply(this, args);
    }
  };
}
