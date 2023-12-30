import p5 from '../core/main';
import * as constants from '../core/constants';
import './p5.Shader';
import './p5.RendererGL.Retained';

// Text/Typography
// @TODO:
p5.RendererGL.prototype._applyTextProperties = function() {
  //@TODO finish implementation
  //p5._friendlyError('text commands not yet implemented in webgl');
};

p5.RendererGL.prototype.textWidth = function(s) {
  if (this._isOpenType()) {
    return this._textFont._textWidth(s, this._textSize);
  }

  return 0; // TODO: error
};

// rendering constants

// the number of rows/columns dividing each glyph
const charGridWidth = 9;
const charGridHeight = charGridWidth;

// size of the image holding the bezier stroke info
const strokeImageWidth = 64;
const strokeImageHeight = 64;

// size of the image holding the stroke indices for each row/col
const gridImageWidth = 64;
const gridImageHeight = 64;

// size of the image holding the offset/length of each row/col stripe
const cellImageWidth = 64;
const cellImageHeight = 64;

/**
 * @private
 * @class ImageInfos
 * @param {Integer} width
 * @param {Integer} height
 *
 * the ImageInfos class holds a list of ImageDatas of a given size.
 */
class ImageInfos {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.infos = []; // the list of images
  }
  /**
     *
     * @method findImage
     * @param {Integer} space
     * @return {Object} contains the ImageData, and pixel index into that
     *                  ImageData where the free space was allocated.
     *
     * finds free space of a given size in the ImageData list
     */
  findImage (space) {
    const imageSize = this.width * this.height;
    if (space > imageSize)
      throw new Error('font is too complex to render in 3D');

    // search through the list of images, looking for one with
    // anough unused space.
    let imageInfo, imageData;
    for (let ii = this.infos.length - 1; ii >= 0; --ii) {
      const imageInfoTest = this.infos[ii];
      if (imageInfoTest.index + space < imageSize) {
        // found one
        imageInfo = imageInfoTest;
        imageData = imageInfoTest.imageData;
        break;
      }
    }

    if (!imageInfo) {
      try {
        // create a new image
        imageData = new ImageData(this.width, this.height);
      } catch (err) {
        // for browsers that don't support ImageData constructors (ie IE11)
        // create an ImageData using the old method
        let canvas = document.getElementsByTagName('canvas')[0];
        const created = !canvas;
        if (!canvas) {
          // create a temporary canvas
          canvas = document.createElement('canvas');
          canvas.style.display = 'none';
          document.body.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          imageData = ctx.createImageData(this.width, this.height);
        }
        if (created) {
          // distroy the temporary canvas, if necessary
          document.body.removeChild(canvas);
        }
      }
      // construct & dd the new image info
      imageInfo = { index: 0, imageData };
      this.infos.push(imageInfo);
    }

    const index = imageInfo.index;
    imageInfo.index += space; // move to the start of the next image
    imageData._dirty = true;
    return { imageData, index };
  }
}

/**
 * @function setPixel
 * @param {Object} imageInfo
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 *
 * writes the next pixel into an indexed ImageData
 */
function setPixel(imageInfo, r, g, b, a) {
  const imageData = imageInfo.imageData;
  const pixels = imageData.data;
  let index = imageInfo.index++ * 4;
  pixels[index++] = r;
  pixels[index++] = g;
  pixels[index++] = b;
  pixels[index++] = a;
}

const SQRT3 = Math.sqrt(3);

/**
 * @private
 * @class FontInfo
 * @param {Object} font an opentype.js font object
 *
 * contains cached images and glyph information for an opentype font
 */
class FontInfo {
  constructor(font) {
    this.font = font;
    // the bezier curve coordinates
    this.strokeImageInfos = new ImageInfos(strokeImageWidth, strokeImageHeight);
    // lists of curve indices for each row/column slice
    this.colDimImageInfos = new ImageInfos(gridImageWidth, gridImageHeight);
    this.rowDimImageInfos = new ImageInfos(gridImageWidth, gridImageHeight);
    // the offset & length of each row/col slice in the glyph
    this.colCellImageInfos = new ImageInfos(cellImageWidth, cellImageHeight);
    this.rowCellImageInfos = new ImageInfos(cellImageWidth, cellImageHeight);

    // the cached information for each glyph
    this.glyphInfos = {};
  }
  /**
     * @method getGlyphInfo
     * @param {Glyph} glyph the x positions of points in the curve
     * @returns {Object} the glyphInfo for that glyph
     *
     * calculates rendering info for a glyph, including the curve information,
     * row & column stripes compiled into textures.
     */
  getGlyphInfo (glyph) {
    // check the cache
    let gi = this.glyphInfos[glyph.index];
    if (gi) return gi;

    // get the bounding box of the glyph from opentype.js
    const bb = glyph.getBoundingBox();
    const xMin = bb.x1;
    const yMin = bb.y1;
    const gWidth = bb.x2 - xMin;
    const gHeight = bb.y2 - yMin;
    const cmds = glyph.path.commands;
    // don't bother rendering invisible glyphs
    if (gWidth === 0 || gHeight === 0 || !cmds.length) {
      return (this.glyphInfos[glyph.index] = {});
    }

    let i;
    const strokes = []; // the strokes in this glyph
    const rows = []; // the indices of strokes in each row
    const cols = []; // the indices of strokes in each column
    for (i = charGridWidth - 1; i >= 0; --i) cols.push([]);
    for (i = charGridHeight - 1; i >= 0; --i) rows.push([]);

    /**
       * @function push
       * @param {Number[]} xs the x positions of points in the curve
       * @param {Number[]} ys the y positions of points in the curve
       * @param {Object} v    the curve information
       *
       * adds a curve to the rows & columns that it intersects with
       */
    function push(xs, ys, v) {
      const index = strokes.length; // the index of this stroke
      strokes.push(v); // add this stroke to the list

      /**
         * @function minMax
         * @param {Number[]} rg the list of values to compare
         * @param {Number} min the initial minimum value
         * @param {Number} max the initial maximum value
         *
         * find the minimum & maximum value in a list of values
         */
      function minMax(rg, min, max) {
        for (let i = rg.length; i-- > 0; ) {
          const v = rg[i];
          if (min > v) min = v;
          if (max < v) max = v;
        }
        return { min, max };
      }

      // Expand the bounding box of the glyph by the number of cells below
      // before rounding. Curves only partially through a cell won't be added
      // to adjacent cells, but ones that are close will be. This helps fix
      // small visual glitches that occur when curves are close to grid cell
      // boundaries.
      const cellOffset = 0.5;

      // loop through the rows & columns that the curve intersects
      // adding the curve to those slices
      const mmX = minMax(xs, 1, 0);
      const ixMin = Math.max(
        Math.floor(mmX.min * charGridWidth - cellOffset),
        0
      );
      const ixMax = Math.min(
        Math.ceil(mmX.max * charGridWidth + cellOffset),
        charGridWidth
      );
      for (let iCol = ixMin; iCol < ixMax; ++iCol) cols[iCol].push(index);

      const mmY = minMax(ys, 1, 0);
      const iyMin = Math.max(
        Math.floor(mmY.min * charGridHeight - cellOffset),
        0
      );
      const iyMax = Math.min(
        Math.ceil(mmY.max * charGridHeight + cellOffset),
        charGridHeight
      );
      for (let iRow = iyMin; iRow < iyMax; ++iRow) rows[iRow].push(index);
    }

    /**
       * @function clamp
       * @param {Number} v the value to clamp
       * @param {Number} min the minimum value
       * @param {Number} max the maxmimum value
       *
       * clamps a value between a minimum & maximum value
       */
    function clamp(v, min, max) {
      if (v < min) return min;
      if (v > max) return max;
      return v;
    }

    /**
       * @function byte
       * @param {Number} v the value to scale
       *
       * converts a floating-point number in the range 0-1 to a byte 0-255
       */
    function byte(v) {
      return clamp(255 * v, 0, 255);
    }

    /**
       * @private
       * @class Cubic
       * @param {Number} p0 the start point of the curve
       * @param {Number} c0 the first control point
       * @param {Number} c1 the second control point
       * @param {Number} p1 the end point
       *
       * a cubic curve
       */
    class Cubic {
      constructor(p0, c0, c1, p1) {
        this.p0 = p0;
        this.c0 = c0;
        this.c1 = c1;
        this.p1 = p1;
      }
      /**
           * @method toQuadratic
           * @return {Object} the quadratic approximation
           *
           * converts the cubic to a quadtratic approximation by
           * picking an appropriate quadratic control point
           */
      toQuadratic () {
        return {
          x: this.p0.x,
          y: this.p0.y,
          x1: this.p1.x,
          y1: this.p1.y,
          cx: ((this.c0.x + this.c1.x) * 3 - (this.p0.x + this.p1.x)) / 4,
          cy: ((this.c0.y + this.c1.y) * 3 - (this.p0.y + this.p1.y)) / 4
        };
      }

      /**
           * @method quadError
           * @return {Number} the error
           *
           * calculates the magnitude of error of this curve's
           * quadratic approximation.
           */
      quadError () {
        return (
          p5.Vector.sub(
            p5.Vector.sub(this.p1, this.p0),
            p5.Vector.mult(p5.Vector.sub(this.c1, this.c0), 3)
          ).mag() / 2
        );
      }

      /**
           * @method split
           * @param {Number} t the value (0-1) at which to split
           * @return {Cubic} the second part of the curve
           *
           * splits the cubic into two parts at a point 't' along the curve.
           * this cubic keeps its start point and its end point becomes the
           * point at 't'. the 'end half is returned.
           */
      split (t) {
        const m1 = p5.Vector.lerp(this.p0, this.c0, t);
        const m2 = p5.Vector.lerp(this.c0, this.c1, t);
        const mm1 = p5.Vector.lerp(m1, m2, t);

        this.c1 = p5.Vector.lerp(this.c1, this.p1, t);
        this.c0 = p5.Vector.lerp(m2, this.c1, t);
        const pt = p5.Vector.lerp(mm1, this.c0, t);
        const part1 = new Cubic(this.p0, m1, mm1, pt);
        this.p0 = pt;
        return part1;
      }

      /**
           * @method splitInflections
           * @return {Cubic[]} the non-inflecting pieces of this cubic
           *
           * returns an array containing 0, 1 or 2 cubics split resulting
           * from splitting this cubic at its inflection points.
           * this cubic is (potentially) altered and returned in the list.
           */
      splitInflections () {
        const a = p5.Vector.sub(this.c0, this.p0);
        const b = p5.Vector.sub(p5.Vector.sub(this.c1, this.c0), a);
        const c = p5.Vector.sub(
          p5.Vector.sub(p5.Vector.sub(this.p1, this.c1), a),
          p5.Vector.mult(b, 2)
        );

        const cubics = [];

        // find the derivative coefficients
        let A = b.x * c.y - b.y * c.x;
        if (A !== 0) {
          let B = a.x * c.y - a.y * c.x;
          let C = a.x * b.y - a.y * b.x;
          const disc = B * B - 4 * A * C;
          if (disc >= 0) {
            if (A < 0) {
              A = -A;
              B = -B;
              C = -C;
            }

            const Q = Math.sqrt(disc);
            const t0 = (-B - Q) / (2 * A); // the first inflection point
            let t1 = (-B + Q) / (2 * A); // the second inflection point

            // test if the first inflection point lies on the curve
            if (t0 > 0 && t0 < 1) {
              // split at the first inflection point
              cubics.push(this.split(t0));
              // scale t2 into the second part
              t1 = 1 - (1 - t1) / (1 - t0);
            }

            // test if the second inflection point lies on the curve
            if (t1 > 0 && t1 < 1) {
              // split at the second inflection point
              cubics.push(this.split(t1));
            }
          }
        }

        cubics.push(this);
        return cubics;
      }
    }

    /**
       * @function cubicToQuadratics
       * @param {Number} x0
       * @param {Number} y0
       * @param {Number} cx0
       * @param {Number} cy0
       * @param {Number} cx1
       * @param {Number} cy1
       * @param {Number} x1
       * @param {Number} y1
       * @returns {Cubic[]} an array of cubics whose quadratic approximations
       *                    closely match the civen cubic.
       *
       * converts a cubic curve to a list of quadratics.
       */
    function cubicToQuadratics(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
      // create the Cubic object and split it at its inflections
      const cubics = new Cubic(
        new p5.Vector(x0, y0),
        new p5.Vector(cx0, cy0),
        new p5.Vector(cx1, cy1),
        new p5.Vector(x1, y1)
      ).splitInflections();

      const qs = []; // the final list of quadratics
      const precision = 30 / SQRT3;

      // for each of the non-inflected pieces of the original cubic
      for (let cubic of cubics) {
        // the cubic is iteratively split in 3 pieces:
        // the first piece is accumulated in 'qs', the result.
        // the last piece is accumulated in 'tail', temporarily.
        // the middle piece is repeatedly split again, while necessary.
        const tail = [];

        let t3;
        for (;;) {
          // calculate this cubic's precision
          t3 = precision / cubic.quadError();
          if (t3 >= 0.5 * 0.5 * 0.5) {
            break; // not too bad, we're done
          }

          // find a split point based on the error
          const t = Math.pow(t3, 1.0 / 3.0);
          // split the cubic in 3
          const start = cubic.split(t);
          const middle = cubic.split(1 - t / (1 - t));

          qs.push(start); // the first part
          tail.push(cubic); // the last part
          cubic = middle; // iterate on the middle piece
        }

        if (t3 < 1) {
          // a little excess error, split the middle in two
          qs.push(cubic.split(0.5));
        }
        // add the middle piece to the result
        qs.push(cubic);

        // finally add the tail, reversed, onto the result
        Array.prototype.push.apply(qs, tail.reverse());
      }

      return qs;
    }

    /**
       * @function pushLine
       * @param {Number} x0
       * @param {Number} y0
       * @param {Number} x1
       * @param {Number} y1
       *
       * add a straight line to the row/col grid of a glyph
       */
    function pushLine(x0, y0, x1, y1) {
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      push([x0, x1], [y0, y1], { x: x0, y: y0, cx: mx, cy: my });
    }

    /**
       * @function samePoint
       * @param {Number} x0
       * @param {Number} y0
       * @param {Number} x1
       * @param {Number} y1
       * @return {Boolean} true if the two points are sufficiently close
       *
       * tests if two points are close enough to be considered the same
       */
    function samePoint(x0, y0, x1, y1) {
      return Math.abs(x1 - x0) < 0.00001 && Math.abs(y1 - y0) < 0.00001;
    }

    let x0, y0, xs, ys;

    for (const cmd of cmds) {
      // scale the coordinates to the range 0-1
      const x1 = (cmd.x - xMin) / gWidth;
      const y1 = (cmd.y - yMin) / gHeight;

      // don't bother if this point is the same as the last
      if (samePoint(x0, y0, x1, y1)) continue;

      switch (cmd.type) {
        case 'M': {
          // move
          xs = x1;
          ys = y1;
          break;
        }
        case 'L': {
          // line
          pushLine(x0, y0, x1, y1);
          break;
        }
        case 'Q': {
          // quadratic
          const cx = (cmd.x1 - xMin) / gWidth;
          const cy = (cmd.y1 - yMin) / gHeight;
          push([x0, x1, cx], [y0, y1, cy], { x: x0, y: y0, cx, cy });
          break;
        }
        case 'Z': {
          // end
          if (!samePoint(x0, y0, xs, ys)) {
            // add an extra line closing the loop, if necessary
            pushLine(x0, y0, xs, ys);
            strokes.push({ x: xs, y: ys });
          } else {
            strokes.push({ x: x0, y: y0 });
          }
          break;
        }
        case 'C': {
          // cubic
          const cx1 = (cmd.x1 - xMin) / gWidth;
          const cy1 = (cmd.y1 - yMin) / gHeight;
          const cx2 = (cmd.x2 - xMin) / gWidth;
          const cy2 = (cmd.y2 - yMin) / gHeight;
          const qs = cubicToQuadratics(x0, y0, cx1, cy1, cx2, cy2, x1, y1);
          for (let iq = 0; iq < qs.length; iq++) {
            const q = qs[iq].toQuadratic();
            push([q.x, q.x1, q.cx], [q.y, q.y1, q.cy], q);
          }
          break;
        }
        default:
          throw new Error(`unknown command type: ${cmd.type}`);
      }
      x0 = x1;
      y0 = y1;
    }

    // allocate space for the strokes
    const strokeCount = strokes.length;
    const strokeImageInfo = this.strokeImageInfos.findImage(strokeCount);
    const strokeOffset = strokeImageInfo.index;

    // fill the stroke image
    for (let il = 0; il < strokeCount; ++il) {
      const s = strokes[il];
      setPixel(strokeImageInfo, byte(s.x), byte(s.y), byte(s.cx), byte(s.cy));
    }

    /**
       * @function layout
       * @param {Number[][]} dim
       * @param {ImageInfo[]} dimImageInfos
       * @param {ImageInfo[]} cellImageInfos
       * @return {Object}
       *
       * lays out the curves in a dimension (row or col) into two
       * images, one for the indices of the curves themselves, and
       * one containing the offset and length of those index spans.
       */
    function layout(dim, dimImageInfos, cellImageInfos) {
      const dimLength = dim.length; // the number of slices in this dimension
      const dimImageInfo = dimImageInfos.findImage(dimLength);
      const dimOffset = dimImageInfo.index;
      // calculate the total number of stroke indices in this dimension
      let totalStrokes = 0;
      for (let id = 0; id < dimLength; ++id) {
        totalStrokes += dim[id].length;
      }

      // allocate space for the stroke indices
      const cellImageInfo = cellImageInfos.findImage(totalStrokes);

      // for each slice in the glyph
      for (let i = 0; i < dimLength; ++i) {
        const strokeIndices = dim[i];
        const strokeCount = strokeIndices.length;
        const cellLineIndex = cellImageInfo.index;

        // write the offset and count into the glyph slice image
        setPixel(
          dimImageInfo,
          cellLineIndex >> 7,
          cellLineIndex & 0x7f,
          strokeCount >> 7,
          strokeCount & 0x7f
        );

        // for each stroke index in that slice
        for (let iil = 0; iil < strokeCount; ++iil) {
          // write the stroke index into the slice's image
          const strokeIndex = strokeIndices[iil] + strokeOffset;
          setPixel(cellImageInfo, strokeIndex >> 7, strokeIndex & 0x7f, 0, 0);
        }
      }

      return {
        cellImageInfo,
        dimOffset,
        dimImageInfo
      };
    }

    // initialize the info for this glyph
    gi = this.glyphInfos[glyph.index] = {
      glyph,
      uGlyphRect: [bb.x1, -bb.y1, bb.x2, -bb.y2],
      strokeImageInfo,
      strokes,
      colInfo: layout(cols, this.colDimImageInfos, this.colCellImageInfos),
      rowInfo: layout(rows, this.rowDimImageInfos, this.rowCellImageInfos)
    };
    gi.uGridOffset = [gi.colInfo.dimOffset, gi.rowInfo.dimOffset];
    return gi;
  }
}

p5.RendererGL.prototype._renderText = function(p, line, x, y, maxY) {
  if (!this._textFont || typeof this._textFont === 'string') {
    console.log(
      'WEBGL: you must load and set a font before drawing text. See `loadFont` and `textFont` for more details.'
    );
    return;
  }
  if (y >= maxY || !this._doFill) {
    return; // don't render lines beyond our maxY position
  }

  if (!this._isOpenType()) {
    console.log(
      'WEBGL: only Opentype (.otf) and Truetype (.ttf) fonts are supported'
    );
    return p;
  }

  p.push(); // fix to #803

  // remember this state, so it can be restored later
  const doStroke = this._doStroke;
  const drawMode = this.drawMode;

  this._doStroke = false;
  this.drawMode = constants.TEXTURE;

  // get the cached FontInfo object
  const font = this._textFont.font;
  let fontInfo = this._textFont._fontInfo;
  if (!fontInfo) {
    fontInfo = this._textFont._fontInfo = new FontInfo(font);
  }

  // calculate the alignment and move/scale the view accordingly
  const pos = this._textFont._handleAlignment(this, line, x, y);
  const fontSize = this._textSize;
  const scale = fontSize / font.unitsPerEm;
  this.translate(pos.x, pos.y, 0);
  this.scale(scale, scale, 1);

  // initialize the font shader
  const gl = this.GL;
  const initializeShader = !this._defaultFontShader;
  const sh = this._getFontShader();
  sh.init();
  sh.bindShader(); // first time around, bind the shader fully

  if (initializeShader) {
    // these are constants, really. just initialize them one-time.
    sh.setUniform('uGridImageSize', [gridImageWidth, gridImageHeight]);
    sh.setUniform('uCellsImageSize', [cellImageWidth, cellImageHeight]);
    sh.setUniform('uStrokeImageSize', [strokeImageWidth, strokeImageHeight]);
    sh.setUniform('uGridSize', [charGridWidth, charGridHeight]);
  }
  this._applyColorBlend(this.curFillColor);

  let g = this.retainedMode.geometry['glyph'];
  if (!g) {
    // create the geometry for rendering a quad
    const geom = (this._textGeom = new p5.Geometry(1, 1, function() {
      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 1; j++) {
          this.vertices.push(new p5.Vector(j, i, 0));
          this.uvs.push(j, i);
        }
      }
    }));
    geom.computeFaces().computeNormals();
    g = this.createBuffers('glyph', geom);
  }

  // bind the shader buffers
  for (const buff of this.retainedMode.buffers.text) {
    buff._prepareBuffer(g, sh);
  }
  this._bindBuffer(g.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);

  // this will have to do for now...
  sh.setUniform('uMaterialColor', this.curFillColor);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

  try {
    let dx = 0; // the x position in the line
    let glyphPrev = null; // the previous glyph, used for kerning
    // fetch the glyphs in the line of text
    const glyphs = font.stringToGlyphs(line);

    for (const glyph of glyphs) {
      // kern
      if (glyphPrev) dx += font.getKerningValue(glyphPrev, glyph);

      const gi = fontInfo.getGlyphInfo(glyph);
      if (gi.uGlyphRect) {
        const rowInfo = gi.rowInfo;
        const colInfo = gi.colInfo;
        sh.setUniform('uSamplerStrokes', gi.strokeImageInfo.imageData);
        sh.setUniform('uSamplerRowStrokes', rowInfo.cellImageInfo.imageData);
        sh.setUniform('uSamplerRows', rowInfo.dimImageInfo.imageData);
        sh.setUniform('uSamplerColStrokes', colInfo.cellImageInfo.imageData);
        sh.setUniform('uSamplerCols', colInfo.dimImageInfo.imageData);
        sh.setUniform('uGridOffset', gi.uGridOffset);
        sh.setUniform('uGlyphRect', gi.uGlyphRect);
        sh.setUniform('uGlyphOffset', dx);

        sh.bindTextures(); // afterwards, only textures need updating

        // draw it
        gl.drawElements(gl.TRIANGLES, 6, this.GL.UNSIGNED_SHORT, 0);
      }
      dx += glyph.advanceWidth;
      glyphPrev = glyph;
    }
  } finally {
    // clean up
    sh.unbindShader();

    this._doStroke = doStroke;
    this.drawMode = drawMode;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    p.pop();
  }

  return p;
};
