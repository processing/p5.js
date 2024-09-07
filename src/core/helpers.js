/**
 * @requires constants
 */

import * as constants from './constants';

function modeAdjust(a, b, c, d, mode) {
  const e = (-c / 2) + c; //support for webgl width
  const f = (-d / 2) + d; //support for webgl height
  if (mode === constants.CORNER) {
    return { x: a, y: b, w: c, h: d };
  } else if (mode === constants.CORNERS) {
    return { x: a, y: b, w: c - a, h: d - b };
  } else if (mode === constants.RADIUS) {
    return { x: a - c, y: b - d, w: 2 * c, h: 2 * d };
  } else if (mode === constants.CENTER) {
    return { x: a - e, y: b - f, w: c, h: d };
  }
}

export default { modeAdjust };
