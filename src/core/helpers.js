/**
 * @requires constants
 */

import * as constants from './constants';

/*
  This function normalizes the first four arguments given to rect, ellipse and arc
  according to the mode.
  It returns a 'bounding box' object containing the coordinates of the upper left corner (x, y),
  and width and height (w, h). The returned width and height are always positive.
*/
function modeAdjust(a, b, c, d, mode) {
  let bbox;

  if (mode === constants.CORNER) {

    // CORNER mode already corresponds to a bounding box (top-left corner, width, height).
    // For negative widhts or heights, the absolute value is used.
    bbox = {
      x: a,
      y: b,
      w: Math.abs(c),
      h: Math.abs(d)
    };

  } else if (mode === constants.CORNERS) {

    // CORNERS mode uses two opposite corners, in any configuration.
    // Make sure to get the top left corner by using the minimum of the x and y coordniates.
    bbox = {
      x: Math.min(a, c),
      y: Math.min(b, d),
      w: Math.abs(c - a),
      h: Math.abs(d - b)
    };

  } else if (mode === constants.RADIUS) {

    // RADIUS mode uses the center point and half the width and height.
    // c (half width) and d (half height) could be negative, so use the absolute value
    // in calculating the top left corner (x, y).
    c = Math.abs(c);
    d = Math.abs(d);
    bbox = {
      x: a - c,
      y: b - d,
      w: 2 * c,
      h: 2 * d
    };

  } else if (mode === constants.CENTER) {

    // CENTER mode uses the center point, width and height.
    // c (width) and d (height) could be negative, so use the absolute value
    // in calculating the top-left corner (x, y).
    c = Math.abs(c);
    d = Math.abs(d);
    bbox = {
      x: a - (c * 0.5),
      y: b - (d * 0.5),
      w: c,
      h: d
    };

  }

  return bbox;
}

export default { modeAdjust };
