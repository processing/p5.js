

Typr["U"] = {
  "shape": function (font, str, ltr) {

    var getGlyphPosition = function (font, gls, i1, ltr) {
      var g1 = gls[i1], g2 = gls[i1 + 1], kern = font["kern"];
      if (kern) {
        var ind1 = kern.glyph1.indexOf(g1);
        if (ind1 != -1) {
          var ind2 = kern.rval[ind1].glyph2.indexOf(g2);
          if (ind2 != -1) return [0, 0, kern.rval[ind1].vals[ind2], 0];
        }
      }
      //console.log("no kern");
      return [0, 0, 0, 0];
    }


    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i); if (cc > 0xffff) i++;
      gls.push(Typr["U"]["codeToGlyph"](font, cc));
    }
    var shape = [];
    var x = 0, y = 0;

    for (var i = 0; i < gls.length; i++) {
      var padj = getGlyphPosition(font, gls, i, ltr);
      var gid = gls[i];
      var ax = font["hmtx"].aWidth[gid] + padj[2];
      shape.push({ "g": gid, "cl": i, "dx": 0, "dy": 0, "ax": ax, "ay": 0 });
      x += ax;
    }
    return shape;
  },

  "shapeToPath": function (font, shape, clr) {
    var tpath = { cmds: [], crds: [] };
    var x = 0, y = 0;

    for (var i = 0; i < shape.length; i++) {
      var it = shape[i]
      var path = Typr["U"]["glyphToPath"](font, it["g"]), crds = path["crds"];
      for (var j = 0; j < crds.length; j += 2) {
        tpath.crds.push(crds[j] + x + it["dx"]);
        tpath.crds.push(crds[j + 1] + y + it["dy"]);
      }
      if (clr) tpath.cmds.push(clr);
      for (var j = 0; j < path["cmds"].length; j++) tpath.cmds.push(path["cmds"][j]);
      var clen = tpath.cmds.length;
      if (clr) if (clen != 0 && tpath.cmds[clen - 1] != "X") tpath.cmds.push("X");  // SVG fonts might contain "X". Then, nothing would stroke non-SVG glyphs.

      x += it["ax"]; y += it["ay"];
    }
    return { "cmds": tpath.cmds, "crds": tpath.crds };
  },

  "codeToGlyph": function () {

    // find the greatest index with a value <=v
    function arrSearch(arr, k, v) {
      var l = 0, r = ~~(arr.length / k);
      while (l + 1 != r) { var mid = l + ((r - l) >>> 1); if (arr[mid * k] <= v) l = mid; else r = mid; }

      //var mi = 0;  for(var i=0; i<arr.length; i+=k) if(arr[i]<=v) mi=i;  if(mi!=l*k) throw "e";

      return l * k;
    }

    var wha = [0x9, 0xa, 0xb, 0xc, 0xd, 0x20, 0x85, 0xa0, 0x1680, 0x180e, 0x2028, 0x2029, 0x202f, 0x2060, 0x3000, 0xfeff], whm = {};
    for (var i = 0; i < wha.length; i++) whm[wha[i]] = 1;
    for (var i = 0x2000; i <= 0x200d; i++) whm[i] = 1;

    function ctg(font, code) {
      //console.log(cmap);
      // "p3e10" for NotoEmoji-Regular.ttf
      //console.log(cmap);

      if (font["_ctab"] == null) {
        var cmap = font["cmap"];
        var tind = -1, pps = ["p3e10", "p0e4", "p3e1", "p1e0", "p0e3", "p0e1"/*,"p3e3"*/, "p3e0" /*Hebrew*/, "p3e5" /*Korean*/];
        for (var i = 0; i < pps.length; i++) if (cmap.ids[pps[i]] != null) { tind = cmap.ids[pps[i]]; break; }
        if (tind == -1) throw "no familiar platform and encoding!";
        font["_ctab"] = cmap.tables[tind];
      }

      var tab = font["_ctab"], fmt = tab.format, gid = -1;  //console.log(fmt); throw "e";

      if (fmt == 0) {
        if (code >= tab.map.length) gid = 0;
        else gid = tab.map[code];
      }
      /*else if(fmt==2) {
        var data=font["_data"], off = cmap.off+tab.off+6, bin=Typr["B"];
        var shKey = bin.readUshort(data,off + 2*(code>>>8));
        var shInd = off + 256*2 + shKey*8;
      	
        var firstCode = bin.readUshort(data,shInd);
        var entryCount= bin.readUshort(data,shInd+2);
        var idDelta   = bin.readShort (data,shInd+4);
        var idRangeOffset = bin.readUshort(data,shInd+6);
      	
        if(firstCode<=code && code<=firstCode+entryCount) {
          // not completely correct
          gid = bin.readUshort(data, shInd+6+idRangeOffset + (code&255)*2);
        }
        else gid=0;
        //if(code>256) console.log(code,(code>>>8),shKey,firstCode,entryCount,idDelta,idRangeOffset);
      	
        //throw "e";
        //console.log(tab,  bin.readUshort(data,off));
        //throw "e";
      }*/
      else if (fmt == 4) {
        var ec = tab.endCount; gid = 0;
        if (code <= ec[ec.length - 1]) {
          // smallest index with code <= value
          var sind = arrSearch(ec, 1, code);
          if (ec[sind] < code) sind++;

          if (code >= tab.startCount[sind]) {
            var gli = 0;
            if (tab.idRangeOffset[sind] != 0) gli = tab.glyphIdArray[(code - tab.startCount[sind]) + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
            else gli = code + tab.idDelta[sind];
            gid = (gli & 0xFFFF);
          }
        }
      }
      else if (fmt == 6) {
        var off = code - tab.firstCode, arr = tab.glyphIdArray;
        if (off < 0 || off >= arr.length) gid = 0;
        else gid = arr[off];
      }
      else if (fmt == 12) {
        var grp = tab.groups; gid = 0;  //console.log(grp);  throw "e";

        if (code <= grp[grp.length - 2]) {
          var i = arrSearch(grp, 3, code);
          if (grp[i] <= code && code <= grp[i + 1]) { gid = grp[i + 2] + (code - grp[i]); }
        }
      }
      else throw "unknown cmap table format " + tab.format;

      //*
      var SVG = font["SVG "], loca = font["loca"];
      // if the font claims to have a Glyph for a character, but the glyph is empty, and the character is not "white", it is a lie!
      if (gid != 0 && font["CFF "] == null && (SVG == null || SVG.entries[gid] == null) && loca && loca[gid] == loca[gid + 1]  // loca not present in CFF or SVG fonts
        && whm[code] == null) gid = 0;
      //*/

      return gid;
    }
    return ctg;
  }(),

  "glyphToPath": function (font, gid, noColor) {
    var path = { cmds: [], crds: [] };


    var SVG = font["SVG "], CFF = font["CFF "], COLR = font["COLR"], CBLC = font["CBLC"], CBDT = font["CBDT"], sbix = font["sbix"], upng = window["UPNG"];
    var U = Typr["U"];

    var strike = null;
    if (CBLC && upng) for (var i = 0; i < CBLC.length; i++) if (CBLC[i][0] <= gid && gid <= CBLC[i][1]) strike = CBLC[i];

    if (strike || (sbix && sbix[gid])) {
      if (strike && strike[2] != 17) throw "not a PNG";

      if (font["__tmp"] == null) font["__tmp"] = {};
      var cmd = font["__tmp"]["g" + gid];
      if (cmd == null) {
        var bmp, len;
        if (sbix) { bmp = sbix[gid]; len = bmp.length; }
        else {
          var boff = strike[3][gid - strike[0]] + 5;  // smallGlyphMetrics
          len = (CBDT[boff + 1] << 16) | (CBDT[boff + 2] << 8) | CBDT[boff + 3]; boff += 4;
          bmp = new Uint8Array(CBDT.buffer, CBDT.byteOffset + boff, len);
        }
        var str = ""; for (var i = 0; i < len; i++) str += String.fromCharCode(bmp[i]);
        cmd = font["__tmp"]["g" + gid] = "data:image/png;base64," + btoa(str);
      }

      path.cmds.push(cmd);
      var upe = font["head"]["unitsPerEm"] * 1.15;
      var gw = Math.round(upe), gh = Math.round(upe), dy = Math.round(-gh * 0.15);
      path.crds.push(0, gh + dy, gw, gh + dy, gw, dy, 0, dy); //*/
    }
    else if (SVG && SVG.entries[gid]) {
      var p = SVG.entries[gid];
      if (p != null) {
        if (typeof p == "number") {
          var svg = SVG.svgs[p];
          if (typeof svg == "string") {
            var prsr = new DOMParser();
            var doc = prsr["parseFromString"](svg, "image/svg+xml");
            svg = SVG.svgs[p] = doc.getElementsByTagName("svg")[0];
          }
          p = U["SVG"].toPath(svg, gid); SVG.entries[gid] = p;
        }
        path = p;
      }
    }
    else if (noColor != true && COLR && COLR[0]["g" + gid] && COLR[0]["g" + gid][1] > 1) {

      function toHex(n) { var o = n.toString(16); return (o.length == 1 ? "0" : "") + o; }

      var CPAL = font["CPAL"], gl = COLR[0]["g" + gid];
      for (var i = 0; i < gl[1]; i++) {
        var lid = gl[0] + i;
        var cgl = COLR[1][2 * lid], pid = COLR[1][2 * lid + 1] * 4;
        var pth = Typr["U"]["glyphToPath"](font, cgl, cgl == gid);

        var col = "#" + toHex(CPAL[pid + 2]) + toHex(CPAL[pid + 1]) + toHex(CPAL[pid + 0]);
        path.cmds.push(col);

        path.cmds = path.cmds.concat(pth["cmds"]);
        path.crds = path.crds.concat(pth["crds"]);
        //console.log(gid, cgl,pid,col);

        path.cmds.push("X");
      }
    }
    else if (CFF) {
      var pdct = CFF["Private"];
      var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: pdct ? pdct["defaultWidthX"] : 0, open: false };
      if (CFF["ROS"]) {
        var gi = 0;
        while (CFF["FDSelect"][gi + 2] <= gid) gi += 2;
        pdct = CFF["FDArray"][CFF["FDSelect"][gi + 1]]["Private"];
      }
      U["_drawCFF"](CFF["CharStrings"][gid], state, CFF, pdct, path);
    }
    else if (font["glyf"]) { U["_drawGlyf"](gid, font, path); }
    return { "cmds": path.cmds, "crds": path.crds };
  },

  "_drawGlyf": function (gid, font, path) {
    var gl = font["glyf"][gid];
    if (gl == null) gl = font["glyf"][gid] = Typr["T"].glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1) Typr["U"]["_simpleGlyph"](gl, path);
      else Typr["U"]["_compoGlyph"](gl, font, path);
    }
  },
  "_simpleGlyph": function (gl, p) {
    var P = Typr["U"]["P"];
    for (var c = 0; c < gl.noc; c++) {
      var i0 = (c == 0) ? 0 : (gl.endPts[c - 1] + 1);
      var il = gl.endPts[c];

      for (var i = i0; i <= il; i++) {
        var pr = (i == i0) ? il : (i - 1);
        var nx = (i == il) ? i0 : (i + 1);
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;

        var x = gl.xs[i], y = gl.ys[i];

        if (i == i0) {
          if (onCurve) {
            if (prOnCurve) P.MoveTo(p, gl.xs[pr], gl.ys[pr]);
            else { P.MoveTo(p, x, y); continue;  /*  will do CurveTo at il  */ }
          }
          else {
            if (prOnCurve) P.MoveTo(p, gl.xs[pr], gl.ys[pr]);
            else P.MoveTo(p, Math.floor((gl.xs[pr] + x) * 0.5), Math.floor((gl.ys[pr] + y) * 0.5));
          }
        }
        if (onCurve) {
          if (prOnCurve) P.LineTo(p, x, y);
        }
        else {
          if (nxOnCurve) P.qCurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
          else P.qCurveTo(p, x, y, Math.floor((x + gl.xs[nx]) * 0.5), Math.floor((y + gl.ys[nx]) * 0.5));
        }
      }
      P.ClosePath(p);
    }
  },
  "_compoGlyph": function (gl, font, p) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = { cmds: [], crds: [] };
      var prt = gl.parts[j];
      Typr["U"]["_drawGlyf"](prt.glyphIndex, font, path);

      var m = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p.crds.push(x * m.a + y * m.c + m.tx);   // not sure, probably right
        p.crds.push(x * m.b + y * m.d + m.ty);
      }
      for (var i = 0; i < path.cmds.length; i++) p.cmds.push(path.cmds[i]);
    }
  },

  "pathToSVG": function (path, prec) {
    var cmds = path["cmds"], crds = path["crds"];
    if (prec == null) prec = 5;
    function num(v) { return parseFloat(v.toFixed(prec)); }
    function merge(o) {
      var no = [], lstF = false, lstC = "";
      for (var i = 0; i < o.length; i++) {
        var it = o[i], isF = (typeof it) == "number";
        if (!isF) { if (it == lstC && it.length == 1 && it != "m") continue; lstC = it; }  // move should not be merged (it actually means lineTo)
        if (lstF && isF && it >= 0) no.push(" ");
        no.push(it); lstF = isF;
      }
      return no.join("");
    }


    var out = [], co = 0, lmap = { "M": 2, "L": 2, "Q": 4, "C": 6 };
    var x = 0, y = 0, // perfect coords
      //dx=0, dy=0, // relative perfect coords
      //rx=0, ry=0, // relative rounded coords
      ex = 0, ey = 0, // error between perfect and output coords
      mx = 0, my = 0; // perfect coords of the last "Move"

    for (var i = 0; i < cmds.length; i++) {
      var cmd = cmds[i], cc = (lmap[cmd] ? lmap[cmd] : 0);

      var o0 = [], dx, dy, rx, ry;  // o1=[], cx, cy, ax,ay;
      if (cmd == "L") {
        dx = crds[co] - x; dy = crds[co + 1] - y;
        rx = num(dx + ex); ry = num(dy + ey);
        // if this "lineTo" leads to the starting point, and "Z" follows, do not output anything.
        if (cmds[i + 1] == "Z" && crds[co] == mx && crds[co + 1] == my) { rx = dx; ry = dy; }
        else if (rx == 0 && ry == 0) { }
        else if (rx == 0) o0.push("v", ry);
        else if (ry == 0) o0.push("h", rx);
        else { o0.push("l", rx, ry); }
      }
      else {
        o0.push(cmd.toLowerCase());
        for (var j = 0; j < cc; j += 2) {
          dx = crds[co + j] - x; dy = crds[co + j + 1] - y;
          rx = num(dx + ex); ry = num(dy + ey);
          o0.push(rx, ry);
        }
      }
      if (cc != 0) { ex += dx - rx; ey += dy - ry; }

      /*
      if(cmd=="L") {
        cx=crds[co];  cy=crds[co+1];
        ax = num(cx);  ay=num(cy);
        // if this "lineTo" leads to the starting point, and "Z" follows, do not output anything.
        if(cmds[i+1]=="Z" && crds[co]==mx && crds[co+1]==my) {  ax=cx;  ay=cy;  }
        else if(ax==num(x) && ay==num(y)) {}
        else if(ax==num(x)) o1.push("V",ay);
        else if(ay==num(y)) o1.push("H",ax);
        else {  o1.push("L",ax,ay);  }
      }
      else {
        o1.push(cmd);
        for(var j=0; j<cc; j+=2) {
          cx = crds[co+j];  cy=crds[co+j+1];  
          ax = num(cx);  ay=num(cy);
          o1.push(ax,ay);
        }
      }
      var ou;
      if(merge(o0).length<merge(o1).length) {
        ou = o0;
        if(cc!=0) {  ex += dx-rx;  ey += dy-ry;  }
      }
      else {
        ou = o1;
        if(cc!=0) {  ex = cx-ax;  ey = cy-ay;  }
      }
      */
      var ou = o0;
      for (var j = 0; j < ou.length; j++) out.push(ou[j]);

      if (cc != 0) { co += cc; x = crds[co - 2]; y = crds[co - 1]; }
      if (cmd == "M") { mx = x; my = y; }
      if (cmd == "Z") { x = mx; y = my; }
    }

    return merge(out);
  },
  "SVGToPath": function (d) {
    var pth = { cmds: [], crds: [] };
    Typr["U"]["SVG"].svgToPath(d, pth);
    return { "cmds": pth.cmds, "crds": pth.crds };
  },

  "pathToContext": function () {
    var cnv, ct;

    function ptc(path, ctx) {
      var c = 0, cmds = path["cmds"], crds = path["crds"];

      //ctx.translate(3500,500);  ctx.rotate(0.25);  ctx.scale(1,-1);
      // commands: M,L,Z,Q
      for (var j = 0; j < cmds.length; j++) {
        var cmd = cmds[j];
        if (cmd == "M") {
          ctx.moveTo(crds[c], crds[c + 1]);
          c += 2;
        }
        else if (cmd == "L") {          
          ctx.lineTo(crds[c], crds[c + 1]);
          c += 2;
        }
        else if (cmd == "C") {
          ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
          c += 6;
        }
        else if (cmd == "Q") {
          ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
          c += 4;
        }
        else if (cmd[0] == "d") {
          var upng = window["UPNG"];
          var x0 = crds[c], y0 = crds[c + 1], x1 = crds[c + 2], y1 = crds[c + 3], x2 = crds[c + 4], y2 = crds[c + 5], x3 = crds[c + 6], y3 = crds[c + 7]; c += 8;
          //y0+=400;  y1+=400;  y1+=600;
          if (upng == null) {
            ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
            continue;
          }
          var dx0 = (x1 - x0), dy0 = (y1 - y0), dx1 = (x3 - x0), dy1 = (y3 - y0);

          var sbmp = atob(cmd.slice(22));
          var bmp = new Uint8Array(sbmp.length);
          for (var i = 0; i < sbmp.length; i++) bmp[i] = sbmp.charCodeAt(i);

          var img = upng["decode"](bmp.buffer), w = img["width"], h = img["height"];  //console.log(img);

          var nbmp = new Uint8Array(upng["toRGBA8"](img)[0]);
          var tr = ctx["getTransform"]();
          var scl = Math.sqrt(Math.abs(tr["a"] * tr["d"] - tr["b"] * tr["c"])) * Math.sqrt(dx1 * dx1 + dy1 * dy1) / h;
          while (scl < 0.5) {
            var nd = mipmapB(nbmp, w, h);
            nbmp = nd.buff; w = nd.w; h = nd.h; scl *= 2;
          }

          if (cnv == null) { cnv = document.createElement("canvas"); ct = cnv.getContext("2d"); }
          if (cnv.width != w || cnv.height != h) { cnv.width = w; cnv.height = h; }

          ct.putImageData(new ImageData(new Uint8ClampedArray(nbmp.buffer), w, h), 0, 0);
          ctx.save();
          ctx.transform(dx0, dy0, dx1, dy1, x0, y0);
          ctx.scale(1 / w, 1 / h);
          ctx.drawImage(cnv, 0, 0); //*/
          ctx.restore();
        }
        else if (cmd.charAt(0) == "#" || cmd.charAt(0) == "r") {
          ctx.beginPath();
          ctx.fillStyle = cmd;
        }
        else if (cmd.charAt(0) == "O" && cmd != "OX") {
          ctx.beginPath();
          var pts = cmd.split("-");
          ctx.lineWidth = parseFloat(pts[2]);
          ctx.strokeStyle = pts[1];
        }
        else if (cmd == "Z") {
          ctx.closePath();
        }
        else if (cmd == "X") {
          ctx.fill();
        }
        else if (cmd == "OX") {
          ctx.stroke();
        }
      }
    }
    function mipmapB(buff, w, h, hlp) {
      var nw = w >> 1, nh = h >> 1;
      var nbuf = (hlp && hlp.length == nw * nh * 4) ? hlp : new Uint8Array(nw * nh * 4);
      var sb32 = new Uint32Array(buff.buffer), nb32 = new Uint32Array(nbuf.buffer);
      for (var y = 0; y < nh; y++)
        for (var x = 0; x < nw; x++) {
          var ti = (y * nw + x), si = ((y << 1) * w + (x << 1));
          //nbuf[ti  ] = buff[si  ];  nbuf[ti+1] = buff[si+1];  nbuf[ti+2] = buff[si+2];  nbuf[ti+3] = buff[si+3];
          //*
          var c0 = sb32[si], c1 = sb32[si + 1], c2 = sb32[si + w], c3 = sb32[si + w + 1];

          var a0 = (c0 >>> 24), a1 = (c1 >>> 24), a2 = (c2 >>> 24), a3 = (c3 >>> 24), a = (a0 + a1 + a2 + a3);

          if (a == 1020) {
            var r = (((c0 >>> 0) & 255) + ((c1 >>> 0) & 255) + ((c2 >>> 0) & 255) + ((c3 >>> 0) & 255) + 2) >>> 2;
            var g = (((c0 >>> 8) & 255) + ((c1 >>> 8) & 255) + ((c2 >>> 8) & 255) + ((c3 >>> 8) & 255) + 2) >>> 2;
            var b = (((c0 >>> 16) & 255) + ((c1 >>> 16) & 255) + ((c2 >>> 16) & 255) + ((c3 >>> 16) & 255) + 2) >>> 2;
            nb32[ti] = (255 << 24) | (b << 16) | (g << 8) | r;
          }
          else if (a == 0) nb32[ti] = 0;
          else {
            var r = ((c0 >>> 0) & 255) * a0 + ((c1 >>> 0) & 255) * a1 + ((c2 >>> 0) & 255) * a2 + ((c3 >>> 0) & 255) * a3;
            var g = ((c0 >>> 8) & 255) * a0 + ((c1 >>> 8) & 255) * a1 + ((c2 >>> 8) & 255) * a2 + ((c3 >>> 8) & 255) * a3;
            var b = ((c0 >>> 16) & 255) * a0 + ((c1 >>> 16) & 255) * a1 + ((c2 >>> 16) & 255) * a2 + ((c3 >>> 16) & 255) * a3;

            var ia = 1 / a; r = ~~(r * ia + 0.5); g = ~~(g * ia + 0.5); b = ~~(b * ia + 0.5);
            nb32[ti] = (((a + 2) >>> 2) << 24) | (b << 16) | (g << 8) | r;
          }
        }
      return { buff: nbuf, w: nw, h: nh };
    }

    return ptc;
  }(),

  "P": {
    MoveTo: function (p, x, y) { p.cmds.push("M"); p.crds.push(x, y); },
    LineTo: function (p, x, y) { p.cmds.push("L"); p.crds.push(x, y); },
    CurveTo: function (p, a, b, c, d, e, f) { p.cmds.push("C"); p.crds.push(a, b, c, d, e, f); },
    qCurveTo: function (p, a, b, c, d) { p.cmds.push("Q"); p.crds.push(a, b, c, d); },
    ClosePath: function (p) { p.cmds.push("Z"); }
  },

  "_drawCFF": function (cmds, state, font, pdct, p) {
    var stack = state.stack;
    var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
    var i = 0;
    var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var CFF = Typr["T"].CFF, P = Typr["U"]["P"];

    var nominalWidthX = pdct["nominalWidthX"];
    var o = { val: 0, size: 0 };
    //console.log(cmds);
    while (i < cmds.length) {
      CFF.getCharString(cmds, i, o);
      var v = o.val;
      i += o.size;

      if (false) { }
      else if (v == "o1" || v == "o18")  //  hstem || hstemhm
      {
        var hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      }
      else if (v == "o3" || v == "o23")  // vstem || vstemhm
      {
        var hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      }
      else if (v == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + nominalWidthX;
          haveWidth = true;
        }
        if (open) P.ClosePath(p);

        y += stack.pop();
        P.MoveTo(p, x, y); open = true;
      }
      else if (v == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y += stack.shift();
          P.LineTo(p, x, y);
        }
      }
      else if (v == "o6" || v == "o7")  // hlineto || vlineto
      {
        var count = stack.length;
        var isX = (v == "o6");

        for (var j = 0; j < count; j++) {
          var sval = stack.shift();

          if (isX) x += sval; else y += sval;
          isX = !isX;
          P.LineTo(p, x, y);
        }
      }
      else if (v == "o8" || v == "o24")	// rrcurveto || rcurveline
      {
        var count = stack.length;
        var index = 0;
        while (index + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 6;
        }
        if (v == "o24") {
          x += stack.shift();
          y += stack.shift();
          P.LineTo(p, x, y);
        }
      }
      else if (v == "o11") break;
      else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237")//if((v+"").slice(0,3)=="o12")
      {
        if (v == "o1234") {
          c1x = x + stack.shift();    // dx1
          c1y = y;                      // dy1
          c2x = c1x + stack.shift();    // dx2
          c2y = c1y + stack.shift();    // dy2
          jpx = c2x + stack.shift();    // dx3
          jpy = c2y;                    // dy3
          c3x = jpx + stack.shift();    // dx4
          c3y = c2y;                    // dy4
          c4x = c3x + stack.shift();    // dx5
          c4y = y;                      // dy5
          x = c4x + stack.shift();      // dx6
          P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);

        }
        if (v == "o1235") {
          c1x = x + stack.shift();    // dx1
          c1y = y + stack.shift();    // dy1
          c2x = c1x + stack.shift();    // dx2
          c2y = c1y + stack.shift();    // dy2
          jpx = c2x + stack.shift();    // dx3
          jpy = c2y + stack.shift();    // dy3
          c3x = jpx + stack.shift();    // dx4
          c3y = jpy + stack.shift();    // dy4
          c4x = c3x + stack.shift();    // dx5
          c4y = c3y + stack.shift();    // dy5
          x = c4x + stack.shift();      // dx6
          y = c4y + stack.shift();      // dy6
          stack.shift();                // flex depth
          P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1236") {
          c1x = x + stack.shift();    // dx1
          c1y = y + stack.shift();    // dy1
          c2x = c1x + stack.shift();    // dx2
          c2y = c1y + stack.shift();    // dy2
          jpx = c2x + stack.shift();    // dx3
          jpy = c2y;                    // dy3
          c3x = jpx + stack.shift();    // dx4
          c3y = c2y;                    // dy4
          c4x = c3x + stack.shift();    // dx5
          c4y = c3y + stack.shift();    // dy5
          x = c4x + stack.shift();      // dx6
          P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1237") {
          c1x = x + stack.shift();    // dx1
          c1y = y + stack.shift();    // dy1
          c2x = c1x + stack.shift();    // dx2
          c2y = c1y + stack.shift();    // dy2
          jpx = c2x + stack.shift();    // dx3
          jpy = c2y + stack.shift();    // dy3
          c3x = jpx + stack.shift();    // dx4
          c3y = jpy + stack.shift();    // dy4
          c4x = c3x + stack.shift();    // dx5
          c4y = c3y + stack.shift();    // dy5
          if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
            x = c4x + stack.shift();
          } else {
            y = c4y + stack.shift();
          }
          P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
      }
      else if (v == "o14") {
        if (stack.length > 0 && stack.length != 4 && !haveWidth) {
          width = stack.shift() + font["nominalWidthX"];
          haveWidth = true;
        }
        if (stack.length == 4) // seac = standard encoding accented character
        {

          var asb = 0;
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();


          var bind = CFF.glyphBySE(font, bchar);
          var aind = CFF.glyphBySE(font, achar);

          //console.log(bchar, bind);
          //console.log(achar, aind);
          //state.x=x; state.y=y; state.nStems=nStems; state.haveWidth=haveWidth; state.width=width;  state.open=open;

          Typr["U"]["_drawCFF"](font["CharStrings"][bind], state, font, pdct, p);
          state.x = adx; state.y = ady;
          Typr["U"]["_drawCFF"](font["CharStrings"][aind], state, font, pdct, p);

          //x=state.x; y=state.y; nStems=state.nStems; haveWidth=state.haveWidth; width=state.width;  open=state.open;
        }
        if (open) { P.ClosePath(p); open = false; }
      }
      else if (v == "o19" || v == "o20") {
        var hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;

        i += (nStems + 7) >> 3;
      }

      else if (v == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + nominalWidthX;
          haveWidth = true;
        }

        y += stack.pop();
        x += stack.pop();

        if (open) P.ClosePath(p);
        P.MoveTo(p, x, y); open = true;
      }
      else if (v == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + nominalWidthX;
          haveWidth = true;
        }

        x += stack.pop();

        if (open) P.ClosePath(p);
        P.MoveTo(p, x, y); open = true;
      }
      else if (v == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y += stack.shift();
          P.LineTo(p, x, y);
        }

        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
      }
      else if (v == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }

        while (stack.length > 0) {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y = c2y + stack.shift();
          P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
        }

      }
      else if (v == "o27") {
        if (stack.length % 2) {
          y += stack.shift();
        }

        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y;
          P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      }
      else if (v == "o10" || v == "o29")	// callsubr || callgsubr
      {
        var obj = (v == "o10" ? pdct : font);
        if (stack.length == 0) { console.log("error: empty stack"); }
        else {
          var ind = stack.pop();
          var subr = obj["Subrs"][ind + obj["Bias"]];
          state.x = x; state.y = y; state.nStems = nStems; state.haveWidth = haveWidth; state.width = width; state.open = open;
          Typr["U"]["_drawCFF"](subr, state, font, pdct, p);
          x = state.x; y = state.y; nStems = state.nStems; haveWidth = state.haveWidth; width = state.width; open = state.open;
        }
      }
      else if (v == "o30" || v == "o31")   // vhcurveto || hvcurveto
      {
        var count, count1 = stack.length;
        var index = 0;
        var alternate = v == "o31";

        count = count1 & ~2;
        index += count1 - count;

        while (index < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count - index == 5) { x = c2x + stack.shift(); index++; }
            else x = c2x;
            alternate = false;
          }
          else {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index == 5) { y = c2y + stack.shift(); index++; }
            else y = c2y;
            alternate = true;
          }
          P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 4;
        }
      }

      else if ((v + "").charAt(0) == "o") { console.log("Unknown operation: " + v, cmds); throw v; }
      else stack.push(v);
    }
    //console.log(cmds);
    state.x = x; state.y = y; state.nStems = nStems; state.haveWidth = haveWidth; state.width = width; state.open = open;
  },


  "SVG": function () {
    var M = {
      getScale: function (m) { return Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])); },
      translate: function (m, x, y) { M.concat(m, [1, 0, 0, 1, x, y]); },
      rotate: function (m, a) { M.concat(m, [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a), 0, 0]); },
      scale: function (m, x, y) { M.concat(m, [x, 0, 0, y, 0, 0]); },
      concat: function (m, w) {
        var a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5];
        m[0] = (a * w[0]) + (b * w[2]); m[1] = (a * w[1]) + (b * w[3]);
        m[2] = (c * w[0]) + (d * w[2]); m[3] = (c * w[1]) + (d * w[3]);
        m[4] = (tx * w[0]) + (ty * w[2]) + w[4]; m[5] = (tx * w[1]) + (ty * w[3]) + w[5];
      },
      invert: function (m) {
        var a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5], adbc = a * d - b * c;
        m[0] = d / adbc; m[1] = -b / adbc; m[2] = -c / adbc; m[3] = a / adbc;
        m[4] = (c * ty - d * tx) / adbc; m[5] = (b * tx - a * ty) / adbc;
      },
      multPoint: function (m, p) { var x = p[0], y = p[1]; return [x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5]]; },
      multArray: function (m, a) { for (var i = 0; i < a.length; i += 2) { var x = a[i], y = a[i + 1]; a[i] = x * m[0] + y * m[2] + m[4]; a[i + 1] = x * m[1] + y * m[3] + m[5]; } }
    }

    function _bracketSplit(str, lbr, rbr) {
      var out = [], pos = 0, ci = 0, lvl = 0;
      while (true) {  //throw "e";
        var li = str.indexOf(lbr, ci);
        var ri = str.indexOf(rbr, ci);
        if (li == -1 && ri == -1) break;
        if (ri == -1 || (li != -1 && li < ri)) {
          if (lvl == 0) { out.push(str.slice(pos, li).trim()); pos = li + 1; }
          lvl++; ci = li + 1;
        }
        else if (li == -1 || (ri != -1 && ri < li)) {
          lvl--;
          if (lvl == 0) { out.push(str.slice(pos, ri).trim()); pos = ri + 1; }
          ci = ri + 1;
        }
      }
      return out;
    }
    //"cssMap": 
    function cssMap(str) {
      var pts = _bracketSplit(str, "{", "}");
      var css = {};
      for (var i = 0; i < pts.length; i += 2) {
        var cn = pts[i].split(",");
        for (var j = 0; j < cn.length; j++) {
          var cnj = cn[j].trim(); if (css[cnj] == null) css[cnj] = "";
          css[cnj] += pts[i + 1];
        }
      }
      return css;
    }
    //"readTrnf" 
    function readTrnf(trna) {
      var pts = _bracketSplit(trna, "(", ")");
      var m = [1, 0, 0, 1, 0, 0];
      for (var i = 0; i < pts.length; i += 2) { var om = m; m = _readTrnsAttr(pts[i], pts[i + 1]); M.concat(m, om); }
      return m;
    }

    function _readTrnsAttr(fnc, vls) {
      //console.log(vls);
      //vls = vls.replace(/\-/g, " -").trim();
      var m = [1, 0, 0, 1, 0, 0], gotSep = true;
      for (var i = 0; i < vls.length; i++) {	// matrix(.99915 0 0 .99915.418.552)   matrix(1 0 0-.9474-22.535 271.03)
        var ch = vls.charAt(i);
        if (ch == "," || ch == " ") gotSep = true;
        else if (ch == ".") {
          if (!gotSep) { vls = vls.slice(0, i) + "," + vls.slice(i); i++; } gotSep = false;
        }
        else if (ch == "-" && i > 0 && vls[i - 1] != "e") { vls = vls.slice(0, i) + " " + vls.slice(i); i++; gotSep = true; }
      }

      vls = vls.split(/\s*[\s,]\s*/).map(parseFloat);
      if (false) { }
      else if (fnc == "translate") { if (vls.length == 1) M.translate(m, vls[0], 0); else M.translate(m, vls[0], vls[1]); }
      else if (fnc == "scale") { if (vls.length == 1) M.scale(m, vls[0], vls[0]); else M.scale(m, vls[0], vls[1]); }
      else if (fnc == "rotate") { var tx = 0, ty = 0; if (vls.length != 1) { tx = vls[1]; ty = vls[2]; } M.translate(m, -tx, -ty); M.rotate(m, -Math.PI * vls[0] / 180); M.translate(m, tx, ty); }
      else if (fnc == "matrix") m = vls;
      else console.log("unknown transform: ", fnc);
      return m;
    }

    function toPath(svg, gid) {
      var pth = { cmds: [], crds: [] };

      var vb = svg.getAttribute("viewBox");
      if (vb) vb = vb.trim().split(" ").map(parseFloat); else vb = [0, 0, 1000, 1000];

      var nod = svg;
      if (gid != null) { var nd = svg.getElementById("glyph" + gid); if (nd) nod = nd; }

      _toPath(nod.children, pth, null, svg);
      for (var i = 0; i < pth.crds.length; i += 2) {
        var x = pth.crds[i], y = pth.crds[i + 1];
        x -= vb[0];
        y -= vb[1];
        y = -y;
        pth.crds[i] = x;
        pth.crds[i + 1] = y;
      }
      return pth;
    }

    var cmap = {
      "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff", "beige": "#f5f5dc", "bisque": "#ffe4c4",
      "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0",
      "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
      "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkgrey": "#a9a9a9", "darkkhaki": "#bdb76b",
      "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f",
      "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkslategrey": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493",
      "deepskyblue": "#00bfff", "dimgray": "#696969", "dimgrey": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22",
      "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
      "grey": "#808080", "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa",
      "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff",
      "lightgoldenrodyellow": "#fafad2", "lightgray": "#d3d3d3", "lightgreen": "#90ee90", "lightgrey": "#d3d3d3", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a",
      "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightslategrey": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0",
      "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd",
      "mediumorchid": "#ba55d3", "mediumpurple": "#9370db", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a",
      "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
      "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500",
      "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#db7093", "papayawhip": "#ffefd5",
      "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "rebeccapurple": "#663399", "red": "#ff0000",
      "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee",
      "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "slategrey": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f",
      "steelblue": "#4682b4", "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3",
      "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"
    };

    function _toPath(nds, pth, fill, root) {
      for (var ni = 0; ni < nds.length; ni++) {
        var nd = nds[ni], tn = nd.tagName;
        var cfl = nd.getAttribute("fill"); if (cfl == null) cfl = fill;
        if (cfl && cfl.startsWith("url")) {
          var gid = cfl.slice(5, -1);
          var grd = root.getElementById(gid), s0 = grd.children[0];
          if (s0.getAttribute("stop-opacity") != null) continue;
          cfl = s0.getAttribute("stop-color");
        }
        if (cmap[cfl]) cfl = cmap[cfl];
        if (tn == "g" || tn == "use") {
          var tp = { crds: [], cmds: [] };
          if (tn == "g") _toPath(nd.children, tp, cfl, root);
          else {
            var lnk = nd.getAttribute("xlink:href").slice(1);
            var pel = root.getElementById(lnk);
            _toPath([pel], tp, cfl, root);
          }
          var m = [1, 0, 0, 1, 0, 0];
          var x = nd.getAttribute("x"), y = nd.getAttribute("y"); x = x ? parseFloat(x) : 0; y = y ? parseFloat(y) : 0;
          M.concat(m, [1, 0, 0, 1, x, y]);

          var trf = nd.getAttribute("transform"); if (trf) M.concat(m, readTrnf(trf));

          M.multArray(m, tp.crds);
          pth.crds = pth.crds.concat(tp.crds);
          pth.cmds = pth.cmds.concat(tp.cmds);
        }
        else if (tn == "path" || tn == "circle" || tn == "ellipse") {
          pth.cmds.push(cfl ? cfl : "#000000");
          var d;
          if (tn == "path") d = nd.getAttribute("d");  //console.log(d);
          if (tn == "circle" || tn == "ellipse") {
            var vls = [0, 0, 0, 0], nms = ["cx", "cy", "rx", "ry", "r"];
            for (var i = 0; i < 5; i++) { var V = nd.getAttribute(nms[i]); if (V) { V = parseFloat(V); if (i < 4) vls[i] = V; else vls[2] = vls[3] = V; } }
            var cx = vls[0], cy = vls[1], rx = vls[2], ry = vls[3];
            d = ["M", cx - rx, cy, "a", rx, ry, 0, 1, 0, rx * 2, 0, "a", rx, ry, 0, 1, 0, -rx * 2, 0].join(" ");
          }
          svgToPath(d, pth); pth.cmds.push("X");
        }
        else if (tn == "image") {
          var w = parseFloat(nd.getAttribute("width")), h = parseFloat(nd.getAttribute("height"));
          pth.cmds.push(nd.getAttribute("xlink:href"));
          pth.crds.push(0, 0, w, 0, w, h, 0, h);
        }
        else if (tn == "defs") { }
        else console.log(tn);
      }
    }

    function _tokens(d) {
      var ts = [], off = 0, rn = false, cn = "", pc = "", lc = "", nc = 0;  // reading number, current number, prev char, lastCommand, number count (after last command
      while (off < d.length) {
        var cc = d.charCodeAt(off), ch = d.charAt(off); off++;
        var isNum = (48 <= cc && cc <= 57) || ch == "." || ch == "-" || ch == "+" || ch == "e" || ch == "E";

        if (rn) {
          if (((ch == "+" || ch == "-") && pc != "e") || (ch == "." && cn.indexOf(".") != -1) || (isNum && (lc == "a" || lc == "A") && ((nc % 7) == 3 || (nc % 7) == 4))) { ts.push(parseFloat(cn)); nc++; cn = ch; }
          else if (isNum) cn += ch;
          else { ts.push(parseFloat(cn)); nc++; if (ch != "," && ch != " ") { ts.push(ch); lc = ch; nc = 0; } rn = false; }
        }
        else {
          if (isNum) { cn = ch; rn = true; }
          else if (ch != "," && ch != " ") { ts.push(ch); lc = ch; nc = 0; }
        }
        pc = ch;
      }
      if (rn) ts.push(parseFloat(cn));
      return ts;
    }

    function _reps(ts, off, ps) {
      var i = off;
      while (i < ts.length) { if ((typeof ts[i]) == "string") break; i += ps; }
      return (i - off) / ps;
    }

    function svgToPath(d, pth) {
      var ts = _tokens(d);
      var i = 0, x = 0, y = 0, ox = 0, oy = 0, oldo = pth.crds.length;
      var pc = { "M": 2, "L": 2, "H": 1, "V": 1, "T": 2, "S": 4, "A": 7, "Q": 4, "C": 6 };
      var cmds = pth.cmds, crds = pth.crds;

      while (i < ts.length) {
        var cmd = ts[i]; i++;
        var cmu = cmd.toUpperCase();

        if (cmu == "Z") { cmds.push("Z"); x = ox; y = oy; }
        else {
          var ps = pc[cmu], reps = _reps(ts, i, ps);

          for (var j = 0; j < reps; j++) {
            // If a moveto is followed by multiple pairs of coordinates, the subsequent pairs are treated as implicit lineto commands.
            if (j == 1 && cmu == "M") { cmd = (cmd == cmu) ? "L" : "l"; cmu = "L"; }

            var xi = 0, yi = 0; if (cmd != cmu) { xi = x; yi = y; }

            if (false) { }
            else if (cmu == "M") { x = xi + ts[i++]; y = yi + ts[i++]; cmds.push("M"); crds.push(x, y); ox = x; oy = y; }
            else if (cmu == "L") { x = xi + ts[i++]; y = yi + ts[i++]; cmds.push("L"); crds.push(x, y); }
            else if (cmu == "H") { x = xi + ts[i++]; cmds.push("L"); crds.push(x, y); }
            else if (cmu == "V") { y = yi + ts[i++]; cmds.push("L"); crds.push(x, y); }
            else if (cmu == "Q") {
              var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++];
              cmds.push("Q"); crds.push(x1, y1, x2, y2); x = x2; y = y2;
            }
            else if (cmu == "T") {
              var co = Math.max(crds.length - (cmds[cmds.length - 1] == "Q" ? 4 : 2), oldo);
              var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
              var x2 = xi + ts[i++], y2 = yi + ts[i++];
              cmds.push("Q"); crds.push(x1, y1, x2, y2); x = x2; y = y2;
            }
            else if (cmu == "C") {
              var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
              cmds.push("C"); crds.push(x1, y1, x2, y2, x3, y3); x = x3; y = y3;
            }
            else if (cmu == "S") {
              var co = Math.max(crds.length - (cmds[cmds.length - 1] == "C" ? 4 : 2), oldo);
              var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
              var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
              cmds.push("C"); crds.push(x1, y1, x2, y2, x3, y3); x = x3; y = y3;
            }
            else if (cmu == "A") {  // convert SVG Arc to four cubic bézier segments "C"
              var x1 = x, y1 = y;
              var rx = ts[i++], ry = ts[i++];
              var phi = ts[i++] * (Math.PI / 180), fA = ts[i++], fS = ts[i++];
              var x2 = xi + ts[i++], y2 = yi + ts[i++];
              if (x2 == x && y2 == y && rx == 0 && ry == 0) continue;

              var hdx = (x1 - x2) / 2, hdy = (y1 - y2) / 2;
              var cosP = Math.cos(phi), sinP = Math.sin(phi);
              var x1A = cosP * hdx + sinP * hdy;
              var y1A = -sinP * hdx + cosP * hdy;

              var rxS = rx * rx, ryS = ry * ry;
              var x1AS = x1A * x1A, y1AS = y1A * y1A;
              var frc = (rxS * ryS - rxS * y1AS - ryS * x1AS) / (rxS * y1AS + ryS * x1AS);
              var coef = (fA != fS ? 1 : -1) * Math.sqrt(Math.max(frc, 0));
              var cxA = coef * (rx * y1A) / ry;
              var cyA = -coef * (ry * x1A) / rx;

              var cx = cosP * cxA - sinP * cyA + (x1 + x2) / 2;
              var cy = sinP * cxA + cosP * cyA + (y1 + y2) / 2;

              var angl = function (ux, uy, vx, vy) {
                var lU = Math.sqrt(ux * ux + uy * uy), lV = Math.sqrt(vx * vx + vy * vy);
                var num = (ux * vx + uy * vy) / (lU * lV);  //console.log(num, Math.acos(num));
                return (ux * vy - uy * vx >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, num)));
              }

              var vX = (x1A - cxA) / rx, vY = (y1A - cyA) / ry;
              var theta1 = angl(1, 0, vX, vY);
              var dtheta = angl(vX, vY, (-x1A - cxA) / rx, (-y1A - cyA) / ry);
              dtheta = dtheta % (2 * Math.PI);

              var arc = function (gst, x, y, r, a0, a1, neg) {
                var rotate = function (m, a) {
                  var si = Math.sin(a), co = Math.cos(a);
                  var a = m[0], b = m[1], c = m[2], d = m[3];
                  m[0] = (a * co) + (b * si); m[1] = (-a * si) + (b * co);
                  m[2] = (c * co) + (d * si); m[3] = (-c * si) + (d * co);
                }
                var multArr = function (m, a) {
                  for (var j = 0; j < a.length; j += 2) {
                    var x = a[j], y = a[j + 1];
                    a[j] = m[0] * x + m[2] * y + m[4];
                    a[j + 1] = m[1] * x + m[3] * y + m[5];
                  }
                }
                var concatA = function (a, b) { for (var j = 0; j < b.length; j++) a.push(b[j]); }
                var concatP = function (p, r) { concatA(p.cmds, r.cmds); concatA(p.crds, r.crds); }
                // circle from a0 counter-clock-wise to a1
                if (neg) while (a1 > a0) a1 -= 2 * Math.PI;
                else while (a1 < a0) a1 += 2 * Math.PI;
                var th = (a1 - a0) / 4;

                var x0 = Math.cos(th / 2), y0 = -Math.sin(th / 2);
                var x1 = (4 - x0) / 3, y1 = y0 == 0 ? y0 : (1 - x0) * (3 - x0) / (3 * y0);
                var x2 = x1, y2 = -y1;
                var x3 = x0, y3 = -y0;

                var ps = [x1, y1, x2, y2, x3, y3];

                var pth = { cmds: ["C", "C", "C", "C"], crds: ps.slice(0) };
                var rot = [1, 0, 0, 1, 0, 0]; rotate(rot, -th);
                for (var j = 0; j < 3; j++) { multArr(rot, ps); concatA(pth.crds, ps); }

                rotate(rot, -a0 + th / 2); rot[0] *= r; rot[1] *= r; rot[2] *= r; rot[3] *= r; rot[4] = x; rot[5] = y;
                multArr(rot, pth.crds);
                multArr(gst.ctm, pth.crds);
                concatP(gst.pth, pth);
              }

              var gst = { pth: pth, ctm: [rx * cosP, rx * sinP, -ry * sinP, ry * cosP, cx, cy] };
              arc(gst, 0, 0, 1, theta1, theta1 + dtheta, fS == 0);
              x = x2; y = y2;
            }
            else console.log("Unknown SVG command " + cmd);
          }
        }
      }
    };
    return { "cssMap": cssMap, "readTrnf": readTrnf, svgToPath: svgToPath, toPath: toPath };
  }(),




  "initHB": function (hurl, resp) {
    var codeLength = function (code) {
      var len = 0;
      if ((code & (0xffffffff - (1 << 7) + 1)) == 0) { len = 1; }
      else if ((code & (0xffffffff - (1 << 11) + 1)) == 0) { len = 2; }
      else if ((code & (0xffffffff - (1 << 16) + 1)) == 0) { len = 3; }
      else if ((code & (0xffffffff - (1 << 21) + 1)) == 0) { len = 4; }
      return len;
    }

    fetch(hurl)
      .then(function (x) { return x["arrayBuffer"](); })
      .then(function (ab) { return WebAssembly["instantiate"](ab); })
      .then(function (res) {
        console.log("HB ready");
        var exp = res["instance"]["exports"], mem = exp["memory"];
        //mem["grow"](30); // each page is 64kb in size
        var heapu8, u32, i32;
        var __lastFnt, blob, blobPtr, face, font;

        Typr["U"]["shapeHB"] = (function () {

          var toJson = function (ptr) {
            var length = exp["hb_buffer_get_length"](ptr);
            var result = [];
            var iPtr32 = exp["hb_buffer_get_glyph_infos"](ptr, 0) >>> 2;
            var pPtr32 = exp["hb_buffer_get_glyph_positions"](ptr, 0) >>> 2;
            for (var i = 0; i < length; ++i) {
              var a = iPtr32 + i * 5, b = pPtr32 + i * 5;
              result.push({
                "g": u32[a + 0],
                "cl": u32[a + 2],
                "ax": i32[b + 0],
                "ay": i32[b + 1],
                "dx": i32[b + 2],
                "dy": i32[b + 3]
              });
            }
            //console.log(result);
            return result;
          }
          var te;

          return function (fnt, str, ltr) {
            var fdata = fnt["_data"], fn = fnt["name"]["postScriptName"];

            //var olen = mem.buffer.byteLength, nlen = 2*fdata.length+str.length*16 + 4e6;
            //if(olen<nlen) mem["grow"](((nlen-olen)>>>16)+4);  //console.log("growing",nlen);

            heapu8 = new Uint8Array(mem.buffer);
            u32 = new Uint32Array(mem.buffer);
            i32 = new Int32Array(mem.buffer);

            if (__lastFnt != fn) {
              if (blob != null) {
                exp["hb_blob_destroy"](blob);
                exp["free"](blobPtr);
                exp["hb_face_destroy"](face);
                exp["hb_font_destroy"](font);
              }
              blobPtr = exp["malloc"](fdata.byteLength); heapu8.set(fdata, blobPtr);
              blob = exp["hb_blob_create"](blobPtr, fdata.byteLength, 2, 0, 0);
              face = exp["hb_face_create"](blob, 0);
              font = exp["hb_font_create"](face)
              __lastFnt = fn;
            }
            if (window["TextEncoder"] == null) { alert("Your browser is too old. Please, update it."); return; }
            if (te == null) te = new window["TextEncoder"]("utf8");

            var buffer = exp["hb_buffer_create"]();
            var bytes = te["encode"](str);
            var len = bytes.length, strp = exp["malloc"](len); heapu8.set(bytes, strp);
            exp["hb_buffer_add_utf8"](buffer, strp, len, 0, len);
            exp["free"](strp);

            exp["hb_buffer_set_direction"](buffer, ltr ? 4 : 5);
            exp["hb_buffer_guess_segment_properties"](buffer);
            exp["hb_shape"](font, buffer, 0, 0);
            var json = toJson(buffer)//buffer["json"]();
            exp["hb_buffer_destroy"](buffer);

            var arr = json.slice(0); if (!ltr) arr.reverse();
            var ci = 0, bi = 0;  // character index, binary index
            for (var i = 1; i < arr.length; i++) {
              var gl = arr[i], cl = gl["cl"];
              while (true) {
                var cpt = str.codePointAt(ci), cln = codeLength(cpt);
                if (bi + cln <= cl) { bi += cln; ci += cpt <= 0xffff ? 1 : 2; }
                else break;
              }
              //while(bi+codeLength(str.charCodeAt(ci)) <=cl) {  bi+=codeLength(str.charCodeAt(ci));  ci++;  }
              gl["cl"] = ci;
            }
            return json;
          }
        }());
        resp();
      });
  }
}

