'use strict';

var p5 = require('../core/main');
var constants = require('../core/constants');
require('./p5.Shader');
require('./p5.RendererGL');

// Text/Typography
// @TODO:
p5.RendererGL.prototype._applyTextProperties = function() {
  //@TODO finish implementation
  //console.error('text commands not yet implemented in webgl');
};

p5.RendererGL.prototype.textWidth = function(s) {
  if (this._isOpenType()) {
    return this._textFont._textWidth(s, this._textSize);
  }

  return 0; // TODO: error
};

// rendering constants

// the number of rows/columns dividing each glyph
var charGridWidth = 9;
var charGridHeight = charGridWidth;

// size of the image holding the bezier stroke info
var strokeImageWidth = 64;
var strokeImageHeight = 64;

// size of the image holding the stroke indices for each row/col
var gridImageWidth = 64;
var gridImageHeight = 64;

// size of the image holding the offset/length of each row/col stripe
var cellImageWidth = 64;
var cellImageHeight = 64;

/**
 * @private
 * @class ImageInfos
 * @param {Integer} width
 * @param {Integer} height
 *
 * the ImageInfos class holds a list of ImageDatas of a given size.
 */
function ImageInfos(width, height) {
  this.width = width;
  this.height = height;
  this.infos = []; // the list of images

  /**
   *
   * @method findImage
   * @param {Integer} space
   * @return {Object} contains the ImageData, and pixel index into that
   *                  ImageData where the free space was allocated.
   *
   * finds free space of a given size in the ImageData list
   */
  this.findImage = function(space) {
    var imageSize = this.width * this.height;
    if (space > imageSize)
      throw new Error('font is too complex to render in 3D');

    // search through the list of images, looking for one with
    // anough unused space.
    var imageInfo, imageData;
    for (var ii = this.infos.length - 1; ii >= 0; --ii) {
      var imageInfoTest = this.infos[ii];
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
        var canvas = document.getElementsByTagName('canvas')[0];
        var created = !canvas;
        if (!canvas) {
          // create a temporary canvas
          canvas = document.createElement('canvas');
          canvas.style.display = 'none';
          document.body.appendChild(canvas);
        }
        var ctx = canvas.getContext('2d');
        if (ctx) {
          imageData = ctx.createImageData(this.width, this.height);
        }
        if (created) {
          // distroy the temporary canvas, if necessary
          document.body.removeChild(canvas);
        }
      }
      // construct & dd the new image info
      imageInfo = { index: 0, imageData: imageData };
      this.infos.push(imageInfo);
    }

    var index = imageInfo.index;
    imageInfo.index += space; // move to the start of the next image
    imageData._dirty = true;
    return { imageData: imageData, index: index };
  };
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
  var imageData = imageInfo.imageData;
  var pixels = imageData.data;
  var index = imageInfo.index++ * 4;
  pixels[index++] = r;
  pixels[index++] = g;
  pixels[index++] = b;
  pixels[index++] = a;
}

var SQRT3 = Math.sqrt(3);

/**
 * @private
 * @class FontInfo
 * @param {Object} font an opentype.js font object
 *
 * contains cached images and glyph information for an opentype font
 */
var FontInfo = function(font) {
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

  /**
   * @method getGlyphInfo
   * @param {Glyph} glyph the x positions of points in the curve
   * @returns {Object} the glyphInfo for that glyph
   *
   * calculates rendering info for a glyph, including the curve information,
   * row & column stripes compiled into textures.
   */

  this.getGlyphInfo = function(glyph) {
    // check the cache
    var gi = this.glyphInfos[glyph.index];
    if (gi) return gi;

    // get the bounding box of the glyph from opentype.js
    var bb = glyph.getBoundingBox();
    var xMin = bb.x1;
    var yMin = bb.y1;
    var gWidth = bb.x2 - xMin;
    var gHeight = bb.y2 - yMin;
    var cmds = glyph.path.commands;
    // don't bother rendering invisible glyphs
    if (gWidth === 0 || gHeight === 0 || !cmds.length) {
      return (this.glyphInfos[glyph.index] = {});
    }

    var i;
    var strokes = []; // the strokes in this glyph
    var rows = []; // the indices of strokes in each row
    var cols = []; // the indices of strokes in each column
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
      var index = strokes.length; // the index of this stroke
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
        for (var i = rg.length; i-- > 0; ) {
          var v = rg[i];
          if (min > v) min = v;
          if (max < v) max = v;
        }
        return { min: min, max: max };
      }

      // loop through the rows & columns that the curve intersects
      // adding the curve to those slices
      var mmX = minMax(xs, 1, 0);
      var ixMin = Math.max(Math.floor(mmX.min * charGridWidth), 0);
      var ixMax = Math.min(Math.ceil(mmX.max * charGridWidth), charGridWidth);
      for (var iCol = ixMin; iCol < ixMax; ++iCol) cols[iCol].push(index);

      var mmY = minMax(ys, 1, 0);
      var iyMin = Math.max(Math.floor(mmY.min * charGridHeight), 0);
      var iyMax = Math.min(Math.ceil(mmY.max * charGridHeight), charGridHeight);
      for (var iRow = iyMin; iRow < iyMax; ++iRow) rows[iRow].push(index);
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
    function Cubic(p0, c0, c1, p1) {
      this.p0 = p0;
      this.c0 = c0;
      this.c1 = c1;
      this.p1 = p1;

      /**
       * @method toQuadratic
       * @return {Object} the quadratic approximation
       *
       * converts the cubic to a quadtratic approximation by
       * picking an appropriate quadratic control point
       */
      this.toQuadratic = function() {
        return {
          x: this.p0.x,
          y: this.p0.y,
          x1: this.p1.x,
          y1: this.p1.y,
          cx: ((this.c0.x + this.c1.x) * 3 - (this.p0.x + this.p1.x)) / 4,
          cy: ((this.c0.y + this.c1.y) * 3 - (this.p0.y + this.p1.y)) / 4
        };
      };

      /**
       * @method quadError
       * @return {Number} the error
       *
       * calculates the magnitude of error of this curve's
       * quadratic approximation.
       */
      this.quadError = function() {
        return (
          p5.Vector.sub(
            p5.Vector.sub(this.p1, this.p0),
            p5.Vector.mult(p5.Vector.sub(this.c1, this.c0), 3)
          ).mag() / 2
        );
      };

      /**
       * @method split
       * @param {Number} t the value (0-1) at which to split
       * @return {Cubic} the second part of the curve
       *
       * splits the cubic into two parts at a point 't' along the curve.
       * this cubic keeps its start point and its end point becomes the
       * point at 't'. the 'end half is returned.
       */
      this.split = function(t) {
        var m1 = p5.Vector.lerp(this.p0, this.c0, t);
        var m2 = p5.Vector.lerp(this.c0, this.c1, t);
        var mm1 = p5.Vector.lerp(m1, m2, t);

        this.c1 = p5.Vector.lerp(this.c1, this.p1, t);
        this.c0 = p5.Vector.lerp(m2, this.c1, t);
        var pt = p5.Vector.lerp(mm1, this.c0, t);
        var part1 = new Cubic(this.p0, m1, mm1, pt);
        this.p0 = pt;
        return part1;
      };

      /**
       * @method splitInflections
       * @return {Cubic[]} the non-inflecting pieces of this cubic
       *
       * returns an array containing 0, 1 or 2 cubics split resulting
       * from splitting this cubic at its inflection points.
       * this cubic is (potentially) altered and returned in the list.
       */
      this.splitInflections = function() {
        var a = p5.Vector.sub(this.c0, this.p0);
        var b = p5.Vector.sub(p5.Vector.sub(this.c1, this.c0), a);
        var c = p5.Vector.sub(
          p5.Vector.sub(p5.Vector.sub(this.p1, this.c1), a),
          p5.Vector.mult(b, 2)
        );

        var cubics = [];

        // find the derivative coefficients
        var A = b.x * c.y - b.y * c.x;
        if (A !== 0) {
          var B = a.x * c.y - a.y * c.x;
          var C = a.x * b.y - a.y * b.x;
          var disc = B * B - 4 * A * C;
          if (disc >= 0) {
            if (A < 0) {
              A = -A;
              B = -B;
              C = -C;
            }

            var Q = Math.sqrt(disc);
            var t0 = (-B - Q) / (2 * A); // the first inflection point
            var t1 = (-B + Q) / (2 * A); // the second inflection point

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
      };
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
      var cubics = new Cubic(
        new p5.Vector(x0, y0),
        new p5.Vector(cx0, cy0),
        new p5.Vector(cx1, cy1),
        new p5.Vector(x1, y1)
      ).splitInflections();

      var qs = []; // the final list of quadratics
      var precision = 30 / SQRT3;

      // for each of the non-inflected pieces of the original cubic
      for (var i = 0; i < cubics.length; i++) {
        var cubic = cubics[i];

        // the cubic is iteratively split in 3 pieces:
        // the first piece is accumulated in 'qs', the result.
        // the last piece is accumulated in 'tail', temporarily.
        // the middle piece is repeatedly split again, while necessary.
        var tail = [];

        var t3;
        for (;;) {
          // calculate this cubic's precision
          t3 = precision / cubic.quadError();
          if (t3 >= 0.5 * 0.5 * 0.5) {
            break; // not too bad, we're done
          }

          // find a split point based on the error
          var t = Math.pow(t3, 1.0 / 3.0);
          // split the cubic in 3
          var start = cubic.split(t);
          var middle = cubic.split(1 - t / (1 - t));

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
      var mx = (x0 + x1) / 2;
      var my = (y0 + y1) / 2;
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

    var x0, y0, xs, ys;
    for (var iCmd = 0; iCmd < cmds.length; ++iCmd) {
      var cmd = cmds[iCmd];
      // scale the coordinates to the range 0-1
      var x1 = (cmd.x - xMin) / gWidth;
      var y1 = (cmd.y - yMin) / gHeight;

      // don't bother if this point is the same as the last
      if (samePoint(x0, y0, x1, y1)) continue;

      switch (cmd.type) {
        case 'M': // move
          xs = x1;
          ys = y1;
          break;
        case 'L': // line
          pushLine(x0, y0, x1, y1);
          break;
        case 'Q': // quadratic
          var cx = (cmd.x1 - xMin) / gWidth;
          var cy = (cmd.y1 - yMin) / gHeight;
          push([x0, x1, cx], [y0, y1, cy], { x: x0, y: y0, cx: cx, cy: cy });
          break;
        case 'Z': // end
          if (!samePoint(x0, y0, xs, ys)) {
            // add an extra line closing the loop, if necessary
            pushLine(x0, y0, xs, ys);
            strokes.push({ x: xs, y: ys });
          } else {
            strokes.push({ x: x0, y: y0 });
          }
          break;
        case 'C': // cubic
          var cx1 = (cmd.x1 - xMin) / gWidth;
          var cy1 = (cmd.y1 - yMin) / gHeight;
          var cx2 = (cmd.x2 - xMin) / gWidth;
          var cy2 = (cmd.y2 - yMin) / gHeight;
          var qs = cubicToQuadratics(x0, y0, cx1, cy1, cx2, cy2, x1, y1);
          for (var iq = 0; iq < qs.length; iq++) {
            var q = qs[iq].toQuadratic();
            push([q.x, q.x1, q.cx], [q.y, q.y1, q.cy], q);
          }
          break;
        default:
          throw new Error('unknown command type: ' + cmd.type);
      }
      x0 = x1;
      y0 = y1;
    }

    // allocate space for the strokes
    var strokeCount = strokes.length;
    var strokeImageInfo = this.strokeImageInfos.findImage(strokeCount);
    var strokeOffset = strokeImageInfo.index;

    // fill the stroke image
    for (var il = 0; il < strokeCount; ++il) {
      var s = strokes[il];
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
      var dimLength = dim.length; // the number of slices in this dimension
      var dimImageInfo = dimImageInfos.findImage(dimLength);
      var dimOffset = dimImageInfo.index;
      // calculate the total number of stroke indices in this dimension
      var totalStrokes = 0;
      for (var id = 0; id < dimLength; ++id) {
        totalStrokes += dim[id].length;
      }

      // allocate space for the stroke indices
      var cellImageInfo = cellImageInfos.findImage(totalStrokes);

      // for each slice in the glyph
      for (var i = 0; i < dimLength; ++i) {
        var strokeIndices = dim[i];
        var strokeCount = strokeIndices.length;
        var cellLineIndex = cellImageInfo.index;

        // write the offset and count into the glyph slice image
        setPixel(
          dimImageInfo,
          cellLineIndex >> 7,
          cellLineIndex & 0x7f,
          strokeCount >> 7,
          strokeCount & 0x7f
        );

        // for each stroke index in that slice
        for (var iil = 0; iil < strokeCount; ++iil) {
          // write the stroke index into the slice's image
          var strokeIndex = strokeIndices[iil] + strokeOffset;
          setPixel(cellImageInfo, strokeIndex >> 7, strokeIndex & 0x7f, 0, 0);
        }
      }

      return {
        cellImageInfo: cellImageInfo,
        dimOffset: dimOffset,
        dimImageInfo: dimImageInfo
      };
    }

    // initialize the info for this glyph
    gi = this.glyphInfos[glyph.index] = {
      glyph: glyph,
      uGlyphRect: [bb.x1, -bb.y1, bb.x2, -bb.y2],
      strokeImageInfo: strokeImageInfo,
      strokes: strokes,
      colInfo: layout(cols, this.colDimImageInfos, this.colCellImageInfos),
      rowInfo: layout(rows, this.rowDimImageInfos, this.rowCellImageInfos)
    };
    gi.uGridOffset = [gi.colInfo.dimOffset, gi.rowInfo.dimOffset];
    return gi;
  };
};

p5.RendererGL.prototype._renderText = function(p, line, x, y, maxY) {
  if (y >= maxY || !this._doFill) {
    return; // don't render lines beyond our maxY position
  }

  if (!this._isOpenType()) {
    console.log('WEBGL: only opentype fonts are supported');
    return p;
  }

  p.push(); // fix to #803

  // remember this state, so it can be restored later
  var curFillShader = this.curFillShader;
  var doStroke = this._doStroke;
  var drawMode = this.drawMode;

  this.curFillShader = null;
  this._doStroke = false;
  this.drawMode = constants.TEXTURE;

  // get the cached FontInfo object
  var font = this._textFont.font;
  var fontInfo = this._textFont._fontInfo;
  if (!fontInfo) {
    fontInfo = this._textFont._fontInfo = new FontInfo(font);
  }

  // calculate the alignment and move/scale the view accordingly
  var pos = this._textFont._handleAlignment(this, line, x, y);
  var fontSize = this._textSize;
  var scale = fontSize / font.unitsPerEm;
  this.translate(pos.x, pos.y, 0);
  this.scale(scale, scale, 1);

  // initialize the font shader
  var gl = this.GL;
  var initializeShader = !this._defaultFontShader;
  var sh = this.setFillShader(this._getFontShader());
  if (initializeShader) {
    // these are constants, really. just initialize them one-time.
    sh.setUniform('uGridImageSize', [gridImageWidth, gridImageHeight]);
    sh.setUniform('uCellsImageSize', [cellImageWidth, cellImageHeight]);
    sh.setUniform('uStrokeImageSize', [strokeImageWidth, strokeImageHeight]);
    sh.setUniform('uGridSize', [charGridWidth, charGridHeight]);
  }
  this._applyColorBlend(this.curFillColor);

  var g = this.gHash['glyph'];
  if (!g) {
    // create the geometry for rendering a quad
    var geom = (this._textGeom = new p5.Geometry(1, 1, function() {
      for (var i = 0; i <= 1; i++) {
        for (var j = 0; j <= 1; j++) {
          this.vertices.push(new p5.Vector(j, i, 0));
          this.uvs.push(j, i);
        }
      }
    }));
    geom.computeFaces().computeNormals();
    g = this.createBuffers('glyph', geom);
  }

  // bind the shader buffers
  this._bindBuffer(g.vertexBuffer, gl.ARRAY_BUFFER);
  sh.enableAttrib(sh.attributes.aPosition.location, 3, gl.FLOAT, false, 0, 0);
  this._bindBuffer(g.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
  this._bindBuffer(g.uvBuffer, gl.ARRAY_BUFFER);
  sh.enableAttrib(sh.attributes.aTexCoord.location, 2, gl.FLOAT, false, 0, 0);

  // this will have to do for now...
  sh.setUniform('uMaterialColor', this.curFillColor);

  try {
    var dx = 0; // the x position in the line
    var glyphPrev = null; // the previous glyph, used for kerning
    var shaderBound = false;
    // fetch the glyphs in the line of text
    var glyphs = font.stringToGlyphs(line);
    for (var ig = 0; ig < glyphs.length; ++ig) {
      var glyph = glyphs[ig];
      // kern
      if (glyphPrev) dx += font.getKerningValue(glyphPrev, glyph);

      var gi = fontInfo.getGlyphInfo(glyph);
      if (gi.uGlyphRect) {
        var rowInfo = gi.rowInfo;
        var colInfo = gi.colInfo;
        sh.setUniform('uSamplerStrokes', gi.strokeImageInfo.imageData);
        sh.setUniform('uSamplerRowStrokes', rowInfo.cellImageInfo.imageData);
        sh.setUniform('uSamplerRows', rowInfo.dimImageInfo.imageData);
        sh.setUniform('uSamplerColStrokes', colInfo.cellImageInfo.imageData);
        sh.setUniform('uSamplerCols', colInfo.dimImageInfo.imageData);
        sh.setUniform('uGridOffset', gi.uGridOffset);
        sh.setUniform('uGlyphRect', gi.uGlyphRect);
        sh.setUniform('uGlyphOffset', dx);

        if (!shaderBound) {
          shaderBound = true;
          sh.bindShader(); // first time around, bind the shader fully
        } else {
          sh.bindTextures(); // afterwards, only textures need updating
        }

        // draw it
        gl.drawElements(gl.TRIANGLES, 6, this.GL.UNSIGNED_SHORT, 0);
      }
      dx += glyph.advanceWidth;
      glyphPrev = glyph;
    }
  } finally {
    // clean up
    sh.unbindShader();

    this.curFillShader = curFillShader;
    this._doStroke = doStroke;
    this.drawMode = drawMode;

    p.pop();
  }

  this._pInst._pixelsDirty = true;
  return p;
};
