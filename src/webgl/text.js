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
var charGridWidth = 9;
var charGridHeight = charGridWidth;
var strokeImageWidth = 64;
var strokeImageHeight = 64;
var cellImageWidth = 64;
var cellImageHeight = 64;
var gridImageWidth = 64;
var gridImageHeight = 64;

function setPixel(imageInfo, r, g, b, a) {
  var imageData = imageInfo.imageData;
  var pixels = imageData.data;
  var index = imageInfo.index++ * 4;
  pixels[index++] = r;
  pixels[index++] = g;
  pixels[index++] = b;
  pixels[index++] = a;
}

function ImageInfos(width, height) {
  this.width = width;
  this.height = height;
  this.infos = [];

  this.findImage = function(space) {
    var imageSize = this.width * this.height;
    if (space > imageSize)
      throw new Error('font is too complex to render in 3D');

    var imageInfo, imageData;
    for (var ii = this.infos.length - 1; ii >= 0; --ii) {
      var imageInfoTest = this.infos[ii];
      if (imageInfoTest.index + space < imageSize) {
        imageInfo = imageInfoTest;
        imageData = imageInfoTest.imageData;
        break;
      }
    }

    if (!imageInfo) {
      imageData = new ImageData(this.width, this.height);
      imageInfo = { index: 0, imageData: imageData };
      this.infos.push(imageInfo);
    }

    var index = imageInfo.index;
    imageInfo.index += space;
    imageData._dirty = true;
    return { imageData: imageData, index: index };
  };
}

var FontInfo = function(font) {
  this.font = font;
  this.strokeImageInfos = new ImageInfos(strokeImageWidth, strokeImageHeight);
  this.colDimImageInfos = new ImageInfos(gridImageWidth, gridImageHeight);
  this.rowDimImageInfos = new ImageInfos(gridImageWidth, gridImageHeight);
  this.colCellImageInfos = new ImageInfos(cellImageWidth, cellImageHeight);
  this.rowCellImageInfos = new ImageInfos(cellImageWidth, cellImageHeight);
  this.glyphInfos = {};

  this.getGlyphInfo = function(glyph) {
    var gi = this.glyphInfos[glyph.index];
    if (gi) return gi;

    var bb = glyph.getBoundingBox();
    var xMin = bb.x1;
    var yMin = bb.y1;
    var gWidth = bb.x2 - xMin;
    var gHeight = bb.y2 - yMin;
    if (gWidth === 0 || gHeight === 0) {
      return (this.glyphInfos[glyph.index] = {});
    }

    var i;
    var strokes = [];
    var rows = [];
    var cols = [];
    for (i = charGridWidth - 1; i >= 0; --i) cols.push([]);
    for (i = charGridHeight - 1; i >= 0; --i) rows.push([]);

    function push(xs, ys, v) {
      var index = strokes.length;
      strokes.push(v);

      function minMax(rg, min, max) {
        for (var i = rg.length; i-- > 0; ) {
          var v = rg[i];
          if (min > v) min = v;
          if (max < v) max = v;
        }
        return { min: min, max: max };
      }

      var mmX = minMax(xs, 1, 0);
      var ixMin = Math.max(Math.floor(mmX.min * charGridWidth), 0);
      var ixMax = Math.min(Math.ceil(mmX.max * charGridWidth), charGridWidth);
      for (var iCol = ixMin; iCol < ixMax; ++iCol) cols[iCol].push(index);

      var mmY = minMax(ys, 1, 0);
      var iyMin = Math.max(Math.floor(mmY.min * charGridHeight), 0);
      var iyMax = Math.min(Math.ceil(mmY.max * charGridHeight), charGridHeight);
      for (var iRow = iyMin; iRow < iyMax; ++iRow) rows[iRow].push(index);
    }

    function clamp(v, min, max) {
      if (v < min) return min;
      if (v > max) return max;
      return v;
    }
    function byte(v) {
      return clamp(255 * v, 0, 255);
    }

    var x0, y0, cx, cy;
    var cmds = glyph.path.commands;
    for (var iCmd = 0; iCmd < cmds.length; ++iCmd) {
      var cmd = cmds[iCmd];
      var x1 = (cmd.x - xMin) / gWidth;
      var y1 = (cmd.y - yMin) / gHeight;

      if (Math.abs(x1 - x0) < 0.00001 && Math.abs(y1 - y0) < 0.00001) continue;

      switch (cmd.type) {
        case 'M':
          break;
        case 'L':
          cx = (x0 + x1) / 2;
          cy = (y0 + y1) / 2;
          push([x0, x1], [y0, y1], { x: x0, y: y0, cx: cx, cy: cy });
          break;
        case 'Q':
          cx = (cmd.x1 - xMin) / gWidth;
          cy = (cmd.y1 - yMin) / gHeight;
          push([x0, x1, cx], [y0, y1, cy], { x: x0, y: y0, cx: cx, cy: cy });
          break;
        case 'Z':
          strokes.push({ x: x0, y: y0 });
          break;
        case 'C':
          throw new Error('cubics are not yet supported');
        default:
          throw new Error('unknown command type: ' + cmd.type);
      }
      x0 = x1;
      y0 = y1;
    }

    var strokeCount = strokes.length;
    var strokeImageInfo = this.strokeImageInfos.findImage(strokeCount);
    var strokeOffset = strokeImageInfo.index;

    // fill the stroke image
    for (var il = 0; il < strokeCount; ++il) {
      var s = strokes[il];
      setPixel(strokeImageInfo, byte(s.x), byte(s.y), byte(s.cx), byte(s.cy));
    }

    function layout(dim, dimImageInfos, cellImageInfos) {
      var dimLength = dim.length;
      var dimImageInfo = dimImageInfos.findImage(dimLength);
      var dimOffset = dimImageInfo.index;
      var totalStrokes = 0;
      for (var id = 0; id < dimLength; ++id) {
        totalStrokes += dim[id].length;
      }

      var cellImageInfo = cellImageInfos.findImage(totalStrokes);
      for (var i = 0; i < dimLength; ++i) {
        var strokeIndices = dim[i];
        var strokeCount = strokeIndices.length;
        var cellLineIndex = cellImageInfo.index;

        setPixel(
          dimImageInfo,
          cellLineIndex >> 7,
          cellLineIndex & 0x7f,
          strokeCount >> 7,
          strokeCount & 0x7f
        );

        for (var iil = 0; iil < strokeCount; ++iil) {
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

    gi = this.glyphInfos[glyph.index] = {
      glyph: glyph,
      uGlyphRect: [glyph.xMin, -glyph.yMin, glyph.xMax, -glyph.yMax],
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

  var curFillShader = this.curFillShader;
  var doStroke = this._doStroke;
  var drawMode = this.drawMode;

  this.curFillShader = null;
  this._doStroke = false;
  this.drawMode = constants.TEXTURE;

  var font = this._textFont.font;
  var glyphs = font.stringToGlyphs(line);
  var fontInfo = this._textFont._fontInfo;
  if (!fontInfo) {
    fontInfo = this._textFont._fontInfo = new FontInfo(font);
  }

  var pos = this._textFont._handleAlignment(this, line, x, y);
  var fontSize = this._textSize;
  var scale = fontSize / font.unitsPerEm;

  this.translate(pos.x, pos.y, 0);
  this.scale(scale, scale, 1);

  var gl = this.GL;
  var initializeShader = !this._defaultFontShader;
  var sh = this.setFillShader(this._getFontShader());
  if (initializeShader) {
    sh.setUniform('uGridImageSize', [gridImageWidth, gridImageHeight]);
    sh.setUniform('uCellsImageSize', [cellImageWidth, cellImageHeight]);
    sh.setUniform('uStrokeImageSize', [strokeImageWidth, strokeImageHeight]);
    sh.setUniform('uGridSize', [charGridWidth, charGridHeight]);
  }
  this._applyColorBlend(this.curFillColor);

  var g = this.gHash['glyph'];
  if (!g) {
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

  this._bindBuffer(g.vertexBuffer, gl.ARRAY_BUFFER);
  sh.enableAttrib(sh.attributes.aPosition.location, 3, gl.FLOAT, false, 0, 0);
  this._bindBuffer(g.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
  this._bindBuffer(g.uvBuffer, gl.ARRAY_BUFFER);
  sh.enableAttrib(sh.attributes.aTexCoord.location, 2, gl.FLOAT, false, 0, 0);

  sh.setUniform('uMaterialColor', this.curFillColor);
  sh.setUniform('uFontSize', fontSize);

  try {
    var dx = 0;
    var glyphPrev = null;
    var shaderBound = false;
    for (var ig = 0; ig < glyphs.length; ++ig) {
      var glyph = glyphs[ig];
      if (glyphPrev) {
        var kerning = font.getKerningValue(glyphPrev, glyph);
        dx += kerning;
      }

      var gi = fontInfo.getGlyphInfo(glyph);
      if (gi.uGlyphRect) {
        var rowInfo = gi.rowInfo,
          colInfo = gi.colInfo;
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
          sh.bindShader();
        } else {
          sh.bindTextures();
        }

        gl.drawElements(gl.TRIANGLES, 6, this.GL.UNSIGNED_SHORT, 0);
      }
      dx += glyph.advanceWidth;
      glyphPrev = glyph;
    }
  } finally {
    sh.unbindShader();

    this.curFillShader = curFillShader;
    this._doStroke = doStroke;
    this.drawMode = drawMode;

    p.pop();
  }

  this._pInst._pixelsDirty = true;
  return p;
};
