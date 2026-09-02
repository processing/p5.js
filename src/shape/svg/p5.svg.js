/**
 * @module SVG
 * @submodule p5.svg
 * @for p5
 */

import { SVGExportAddon } from './svg_export.js';
import { SVGImportAddon } from './svg_import.js';
import { markExperimental } from '../../core/experimental.js';

// Initializes the p5.js SVG module by combining export and import functionality.
// Registers public APIs on p5.prototype and marks experimental features with
// warning decorators to inform users about API stability during the 2.x lifecycle.
function svg(p5, fn, lifecycles) {
  // Register core export (shape recording, vector output) and import (SVG parser) extensions.
  SVGExportAddon(p5, fn, lifecycles);
  SVGImportAddon(p5, fn, lifecycles);

  // List of user-facing SVG methods marked as experimental.
  // Decorators log friendly error warnings when these methods are invoked in user sketches.
  const experimentalMethods = [
    'createSVG',
    'loadSVG',
    'createShape',
    'buildShape',
    'getSVG',
    'shape',
    'saveSVG'
  ];

  for (const method of experimentalMethods) {
    if (fn[method]) {
      p5.registerDecorator(
        `p5.prototype.${method}`,
        markExperimental('p5.svg', p5)
      );
    }
  }
}

export default svg;