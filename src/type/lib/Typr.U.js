

Typr["U"] = function() {
	var P = {
		MoveTo    : function(p, x, y)        {  p.cmds.push("M");  p.crds.push(x,y);  },
		LineTo    : function(p, x, y)        {  p.cmds.push("L");  p.crds.push(x,y);  },
		CurveTo   : function(p, a,b,c,d,e,f) {  p.cmds.push("C");  p.crds.push(a,b,c,d,e,f);  },
		qCurveTo  : function(p, a,b,c,d)     {  p.cmds.push("Q");  p.crds.push(a,b,c,d);  },
		ClosePath : function(p)              {  p.cmds.push("Z");  }
	}
	
	function getGlyphPosition(font, gls,i1,ltr) {
		var g1=gls[i1],g2=gls[i1+1], kern=font["kern"];
		if(kern) {
			var ind1 = kern.glyph1.indexOf(g1);
			if(ind1!=-1)
			{
				var ind2 = kern.rval[ind1].glyph2.indexOf(g2);
				if(ind2!=-1) return [0,0,kern.rval[ind1].vals[ind2],0];
			}
		}
		//console.log("no kern");
		return [0,0,0,0];
	}
	function shape(font,str,prm) {
		var ltr = prm["ltr"], fts = prm["fts"], axs=prm["axs"];
		if(font["fvar"] && axs==null) axs = font["fvar"][1][font["_index"]][2];
		
		var HVAR = font["HVAR"];  //console.log(HVAR);
		if(axs && HVAR) {  axs=_normalizeAxis(font,axs);  }  //console.log(S,axs);
		var gls = [];
		for(var i=0; i<str.length; i++) {
			var cc = str.codePointAt(i);  if(cc>0xffff) i++;
			gls.push(codeToGlyph(font, cc));
		}
		var shape = [];
		var x = 0, y = 0;
		
		for(var i=0; i<gls.length; i++) {
			var padj = getGlyphPosition(font, gls,i,ltr);
			var gid = gls[i];  //console.log(gid);
			var ax=font["hmtx"].aWidth[gid]+padj[2];
			if(HVAR) { //ax+=S*HVAR[1][gid][0];
				var difs = HVAR[1][gid];  //console.log(difs);
				for(var j=0; j<HVAR[0].length; j++) {
					ax += _interpolate(HVAR[0][j],axs) * difs[j];
				}
			}
			shape.push({"g":gid, "cl":i, "dx":0, "dy":0, "ax":ax, "ay":0});
			x+=ax;
		}
		return shape;
	}
	
	function shapeToPath(font,shape,prm) {
		var tpath = {cmds:[], crds:[]};
		var x = 0, y = 0, clr, axs;
		if(prm) {  clr = prm["clr"];  axs=prm["axs"];  }
		
		for(var i=0; i<shape.length; i++) {
			var it = shape[i]
			var path = glyphToPath(font, it["g"],false,axs), crds=path["crds"];
			for(var j=0; j<crds.length; j+=2) {
				tpath.crds.push(crds[j  ] + x + it["dx"]);
				tpath.crds.push(crds[j+1] + y + it["dy"]);
			}
			if(clr) tpath.cmds.push(clr);
			for(var j=0; j<path["cmds"].length; j++) tpath.cmds.push(path["cmds"][j]);
			var clen = tpath.cmds.length;
			if(clr) if(clen!=0 && tpath.cmds[clen-1]!="X") tpath.cmds.push("X");  // SVG fonts might contain "X". Then, nothing would stroke non-SVG glyphs.
			
			x += it["ax"];  y+= it["ay"];
		}
		return {"cmds":tpath.cmds, "crds":tpath.crds};
	}
	
	
	// find the greatest index with a value <=v
	function arrSearch(arr, k, v) {
		var l=0, r=~~(arr.length/k);
		while(l+1!=r) {  var mid = l + ((r-l)>>>1);   if(arr[mid*k]<=v) l=mid;  else r=mid;  }
		
		//var mi = 0;  for(var i=0; i<arr.length; i+=k) if(arr[i]<=v) mi=i;  if(mi!=l*k) throw "e";
		
		return l*k;
	}
		
	var wha = [0x9,0xa,0xb,0xc,0xd,0x20,0x85,0xa0,0x1680,0x180e,0x2028,0x2029,0x202f,0x2060,0x3000,0xfeff], whm={};
	for(var i=0; i<wha.length; i++) whm[wha[i]]=1;
	for(var i=0x2000; i<=0x200d; i++) whm[i]=1;

	function codeToGlyph (font, code) {
		//console.log(cmap);
		// "p3e10" for NotoEmoji-Regular.ttf
		//console.log(cmap);
		
		if(font["_ctab"]==null) {
			var cmap = font["cmap"];
			var tind = -1, pps=["p3e10","p0e4","p3e1","p1e0","p0e3","p0e1"/*,"p3e3"*/,"p3e0" /*Hebrew*/, "p3e5" /*Korean*/];
			for(var i=0; i<pps.length; i++) if(cmap.ids[pps[i]]!=null) {  tind=cmap.ids[pps[i]];  break;  }
			if(tind==-1) throw "no familiar platform and encoding!";
			font["_ctab"]=cmap.tables[tind];
		}
		
		var tab = font["_ctab"], fmt=tab.format, gid = -1;  //console.log(fmt); throw "e";
		
		if(fmt==0) {
			if(code>=tab.map.length) gid = 0;
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
		else if(fmt==4) {
			var ec = tab.endCount;  gid=0;
			if(code<=ec[ec.length-1]) {
				// smallest index with code <= value
				var sind = arrSearch(ec,1,code);
				if(ec[sind]<code) sind++;
				
				if(code>=tab.startCount[sind]) {
					var gli = 0;
					if(tab.idRangeOffset[sind]!=0) gli = tab.glyphIdArray[(code-tab.startCount[sind]) + (tab.idRangeOffset[sind]>>1) - (tab.idRangeOffset.length-sind)];
					else                           gli = code + tab.idDelta[sind];
					gid = (gli & 0xFFFF);
				}
			}
		}
		else if(fmt==6) {
			var off = code-tab.firstCode, arr=tab.glyphIdArray;
			if(off<0 || off>=arr.length) gid=0;
			else gid = arr[off];
		}
		else if(fmt==12) {
			var grp = tab.groups;  gid=0;  //console.log(grp);  throw "e";
			
			if(code<=grp[grp.length-2]) {
				var i = arrSearch(grp,3,code);
				if(grp[i]<=code && code<=grp[i+1]) {  gid = grp[i+2] + (code-grp[i]);  }
			}
		}
		else throw "unknown cmap table format "+tab.format;
		
		//*
		var SVG = font["SVG "], loca = font["loca"];
		// if the font claims to have a Glyph for a character, but the glyph is empty, and the character is not "white", it is a lie!
		if(gid!=0 && font["CFF "]==null && (SVG==null || SVG.entries[gid]==null) && loca && loca[gid]==loca[gid+1]  // loca not present in CFF or SVG fonts
			&& whm[code]==null )  gid=0;
		//*/
		
		return gid;
	}
	function glyphToPath(font, gid, noColor,axs) {
		var path = { cmds:[], crds:[] };
		
		if(font["fvar"]) {
			if(axs==null) axs = font["fvar"][1][font["_index"]][2];
			axs=_normalizeAxis(font,axs);
		}
		
		var SVG = font["SVG "], CFF = font["CFF "], COLR=font["COLR"], CBLC=font["CBLC"], CBDT=font["CBDT"], sbix=font["sbix"], upng=window["UPNG"];
		
		var strike = null;
		if(CBLC && upng) for(var i=0; i<CBLC.length; i++) if(CBLC[i][0]<=gid && gid<=CBLC[i][1]) strike=CBLC[i];
		
		if(strike || (sbix && sbix[gid])) {
			if(strike && strike[2]!=17) throw "not a PNG";
			
			if(font["__tmp"]==null) font["__tmp"]={};
			var cmd = font["__tmp"]["g"+gid];
			if(cmd==null) {
				var bmp, len;
				if(sbix) {  bmp = sbix[gid];  len=bmp.length;  }
				else {
					var boff = strike[3][gid-strike[0]]+5;  // smallGlyphMetrics
					len = (CBDT[boff+1]<<16)|(CBDT[boff+2]<<8)|CBDT[boff+3];  boff+=4;
					bmp = new Uint8Array(CBDT.buffer, CBDT.byteOffset+boff,len);
				}				
				var str = "";  for(var i=0; i<len; i++) str+=String.fromCharCode(bmp[i]);
				cmd = font["__tmp"]["g"+gid] = "data:image/png;base64,"+btoa(str);
			}
			
			path.cmds.push(cmd);
			var upe = font["head"]["unitsPerEm"]*1.15;
			var gw=Math.round(upe), gh=Math.round(upe), dy=Math.round(-gh*0.15);
			path.crds.push(0,gh+dy, gw,gh+dy, gw,dy, 0,dy); //*/
		}
		else if(SVG && SVG.entries[gid]) {
			var p = SVG.entries[gid];  
			if(p!=null) {
				if(typeof p == "number") {  
					var svg = SVG.svgs[p];
					if(typeof svg == "string") {
						var prsr = new DOMParser();
						var doc = prsr["parseFromString"](svg,"image/svg+xml");
						svg = SVG.svgs[p] = doc.getElementsByTagName("svg")[0];
					}
					p = Typr["U"]["SVG"].toPath(svg,gid);  SVG.entries[gid]=p;  
				}
				path=p;
			}
		}
		else if(noColor!=true && COLR && COLR[0]["g"+gid] && COLR[0]["g"+gid][1]>1) {
			
			function toHex(n){  var o=n.toString(16);  return (o.length==1 ? "0":"")+o;  }
			
			var CPAL = font["CPAL"], gl = COLR[0]["g"+gid];
			for(var i=0; i<gl[1]; i++) {
				var lid = gl[0]+i;
				var cgl = COLR[1][2*lid], pid=COLR[1][2*lid+1]*4;
				var pth = glyphToPath(font,cgl, cgl==gid);
				
				var col = "#"+toHex(CPAL[pid+2])+toHex(CPAL[pid+1])+toHex(CPAL[pid+0]);
				path.cmds.push(col);
				
				path.cmds=path.cmds.concat(pth["cmds"]);
				path.crds=path.crds.concat(pth["crds"]);
				//console.log(gid, cgl,pid,col);
				
				path.cmds.push("X");
			}
		}
		else if(CFF) {
			var pdct = CFF["Private"];
			var state = {x:0,y:0,stack:[],nStems:0,haveWidth:false,width: pdct ? pdct["defaultWidthX"] : 0,open:false};
			if(CFF["ROS"]) {
				var gi = 0;
				while(CFF["FDSelect"][gi+2]<=gid) gi+=2;
				pdct = CFF["FDArray"][CFF["FDSelect"][gi+1]]["Private"];
			}
			_drawCFF(CFF["CharStrings"][gid], state, CFF, pdct, path);
		}
		else if(font["glyf"]) {  _drawGlyf(gid, font, path,axs);  }
		return {"cmds":path.cmds, "crds":path.crds};
	}

	function _drawGlyf(gid, font, path,axs)
	{
		var gl = font["glyf"][gid];
		
		if(gl==null) gl = font["glyf"][gid] = Typr["T"].glyf._parseGlyf(font, gid);
		if(gl!=null){
			if(gl.noc>-1) _simpleGlyph(gl, font, gid, path,axs);
			else          _compoGlyph (gl, font, gid, path,axs);
		}
	}
	function _interpolate(axs,v) {
		var acnt = v.length, S = 1;
		var s = axs[0];  // start
		var p = axs[1];  // peak
		var e = axs[2];  // end
		
		for(var i=0; i<v.length; i++) {
			var AS = 1;
			if      (s[i] > p[i] || p[i] > e[i]) AS = 1;
			else if (s[i] < 0 && e[i] > 0 && p[i] != 0) AS = 1;
			else if (p[i] == 0) AS = 1;
			else if (v[i] < s[i] || v[i] > e[i])    AS = 0;
			else {
				if      (v[i] ==p[i]) AS = 1;
				else if (v[i] < p[i]) AS = (v[i] - s[i]) / (p[i] - s[i]);
				else                  AS = (e[i] - v[i]) / (e[i] - p[i]);
			}
			S = S * AS;
		}
		return S;
	}
	function _normalizeAxis(font,vv) {
		var fvar = font["fvar"], avar = font["avar"];
		var fv = fvar?fvar[0  ]:null;
		
		var nv = [];
		for(var i=0; i<fv.length; i++) {
			var min=fv[i][1], def = fv[i][2], max=fv[i][3], v=Math.max(min, Math.min(max, vv[i]));
			if     (v<def) nv[i]=(def-v)/(min-def);
			else if(v>def) nv[i]=(v-def)/(max-def);
			else nv[i]=0;
			
			if(avar && nv[i]!=-1) {
				var av = avar[i], j=0;
				for(; j<av.length; j+=2) if(av[j]>=nv[i]) break;
				var f=(nv[i]-av[j-2])/(av[j]-av[j-2]);
				nv[i] = f*av[j+1] + (1-f)*av[j-1];
			}
			
		}
		return nv;
	}
	function interpolateDeltas(dfs,ind,xs,ys) {
		var N=xs.length, ndfs = new Array(N*2+8);  ndfs.fill(0);
		for(var i=0; i<N; i++) {
			var dx=0, dy=0, ii=ind.indexOf(i);
			if(ii!=-1) {  dx=dfs[ii];  dy=dfs[ind.length+ii];  }
			else {
				var i0 = ind.length-1, i1=0;  if(ind[i0]>=N) i0--;
				for(var j=0; j<ind.length; j++) {  var v=ind[j];  if(v<N) { if(v<i) i0=j;  if(i<v) {  i1=j;  break;  }  }  }
				for(var ax=0; ax<2; ax++) {
					var crd = ax==0 ? xs : ys, ofs=ax*ind.length, dlt=0;
					var c0 = crd[ind[i0]], c1=crd[ind[i1]], cC = crd[i];
					var d0 = dfs[ofs+i0 ], d1=dfs[ofs+i1 ];
								
					if(c0==c1) {
						if(d0==d1) dlt=d0;
						else       dlt=0;
					}
					else {
						if(cC <= Math.min(c0,c1)) {
							if(c0<c1) dlt = d0;
							else      dlt = d1;
						}
						else if(Math.max(c0,c1) <= cC) {
							if(c0<c1) dlt = d1;
							else      dlt = d0;
						}
						else {
							var prop = (cC-c0) / (c1-c0);  //if(prop<0) throw "e";
							dlt = prop*d1 + (1-prop)*d0;
						}
					}
					if(ax==0) dx=dlt;  else dy=dlt;
				}
			}
			ndfs[i]=dx;
			ndfs[i+N+4]=dy;
		}
		return ndfs;			
	}
	function _simpleGlyph(gl, font, gid, p, axs) {		
		var xs = gl.xs, ys = gl.ys;
		//*
		if(font["fvar"] && axs) {
			xs=xs.slice(0);  ys=ys.slice(0);
			var gvar = font["gvar"];
			var gv = gvar?gvar[gid]:null;
			
			for(var vi=0; vi<gv.length; vi++) {
				var axv = gv[vi][0];  //console.log(axs);
				var S = _interpolate(axv,axs);  if(S<1e-9) continue;
				var dfs = gv[vi][1], ind=gv[vi][2];  //if(dfs.length!=2*xs.length+8) throw "e";
				//console.log(vi,S,axv,ind,dfs);
				if(ind) {  dfs = gv[vi][1] = interpolateDeltas(dfs,ind,xs,ys);  gv[vi][2] = null;  }
				//if(ind==null)
				for(var i=0; i<xs.length; i++) {
					xs[i]+=S*dfs[i];
					ys[i]+=S*dfs[i+xs.length+4];
				}
			}
		} //*/
		
		for(var c=0; c<gl.noc; c++) {
			var i0 = (c==0) ? 0 : (gl.endPts[c-1] + 1);
			var il = gl.endPts[c];
			
			for(var i=i0; i<=il; i++) {
				var pr = (i==i0)?il:(i-1);
				var nx = (i==il)?i0:(i+1);
				var onCurve = gl.flags[i]&1;
				var prOnCurve = gl.flags[pr]&1;
				var nxOnCurve = gl.flags[nx]&1;
				
				var x = xs[i], y = ys[i];
				
				if(i==i0) { 
					if(onCurve) {
						if(prOnCurve) P.MoveTo(p, xs[pr], ys[pr]); 
						else          {  P.MoveTo(p,x,y);  continue;  /*  will do CurveTo at il  */  }
					}
					else {
						if(prOnCurve) P.MoveTo(p,  xs[pr],     ys[pr]        );
						else          P.MoveTo(p, Math.floor((xs[pr]+x)*0.5), Math.floor((ys[pr]+y)*0.5)   ); 
					}
				}
				if(onCurve) {
					if(prOnCurve) P.LineTo(p,x,y);
				}
				else {
					if(nxOnCurve) P.qCurveTo(p, x, y, xs[nx], ys[nx]); 
					else          P.qCurveTo(p, x, y, Math.floor((x+xs[nx])*0.5), Math.floor((y+ys[nx])*0.5) ); 
				}
			}
			P.ClosePath(p);
		}
	}
	function _compoGlyph(gl, font, gid, p, axs) {
		
		var dx = [0,0,0,0,0,0], dy=[0,0,0,0,0,0], ccnt = gl.parts.length;
		
		if(font["fvar"] && axs) {
			var gvar = font["gvar"];
			var gv = gvar?gvar[gid]:null;
			for(var vi=0; vi<gv.length; vi++) {
				var axv = gv[vi][0];  //console.log(axs);
				var S = _interpolate(axv,axs);  if(S<1e-6) continue;
				var dfs = gv[vi][1], ind=gv[vi][2];  //if(dfs.length!=2*ccnt+8) throw "e";
				if(ind==null)
				for(var i=0; i<ccnt; i++) {
					dx[i]+=S*dfs[i];
					dy[i]+=S*dfs[i+ccnt+4];
				}
				else
				for(var j=0; j<ind.length; j++) {
					var i = ind[j];
					dx[i]+=S*dfs[0];
					dy[i]+=S*dfs[0+ccnt];
				}
			}
		}
		
		for(var j=0; j<ccnt; j++) {
			var path = { cmds:[], crds:[] };
			var prt = gl.parts[j];
			_drawGlyf(prt.glyphIndex, font, path, axs);
			
			var m = prt.m, tx=m.tx+dx[j], ty=m.ty+dy[j];
			for(var i=0; i<path.crds.length; i+=2) {
				var x = path.crds[i  ], y = path.crds[i+1];
				p.crds.push(x*m.a + y*m.c + tx);   // not sure, probably right
				p.crds.push(x*m.b + y*m.d + ty);
			}
			for(var i=0; i<path.cmds.length; i++) p.cmds.push(path.cmds[i]);
		}
	}

	function pathToSVG(path, prec) {
		var cmds = path["cmds"], crds = path["crds"];
		if(prec==null) prec = 5;
		function num(v) {  return parseFloat(v.toFixed(prec));  }
		function merge(o) {
			var no = [], lstF=false, lstC="";
			for(var i=0; i<o.length; i++) {
				var it=o[i], isF=(typeof it)=="number";
				if(!isF) {  if(it==lstC && it.length==1 && it!="m") continue;  lstC=it;  }  // move should not be merged (it actually means lineTo)
				if(lstF && isF && it>=0) no.push(" ");
				no.push(it);  lstF=isF;
			}
			return no.join("");
		}
		
		
		var out = [], co = 0, lmap = {"M":2,"L":2,"Q":4,"C":6};
		var x =0, y =0, // perfect coords
			//dx=0, dy=0, // relative perfect coords
			//rx=0, ry=0, // relative rounded coords
			ex=0, ey=0, // error between perfect and output coords
			mx=0, my=0; // perfect coords of the last "Move"
		
		for(var i=0; i<cmds.length; i++) {
			var cmd = cmds[i], cc=(lmap[cmd]?lmap[cmd]:0); 
			
			var o0=[], dx, dy, rx, ry;  // o1=[], cx, cy, ax,ay;
			if(cmd=="L") {
				dx=crds[co]-x;  dy=crds[co+1]-y;
				rx = num(dx+ex);  ry=num(dy+ey);
				// if this "lineTo" leads to the starting point, and "Z" follows, do not output anything.
				if(cmds[i+1]=="Z" && crds[co]==mx && crds[co+1]==my) {  rx=dx;  ry=dy;  }
				else if(rx==0 && ry==0) {}
				else if(rx==0) o0.push("v",ry);
				else if(ry==0) o0.push("h",rx);
				else {  o0.push("l",rx,ry);  }
			}
			else {
				o0.push(cmd.toLowerCase());
				for(var j=0; j<cc; j+=2) {
					dx = crds[co+j]-x;  dy=crds[co+j+1]-y;  
					rx = num(dx+ex);  ry=num(dy+ey);
					o0.push(rx,ry);
				}
			}
			if(cc!=0) {  ex += dx-rx;  ey += dy-ry;  }
			
			var ou=o0;
			for(var j=0; j<ou.length; j++) out.push(ou[j]);
			
			if(cc !=0  ) {  co+=cc;  x=crds[co-2];  y=crds[co-1];    }
			if(cmd=="M") {  mx=x;  my=y;  }
			if(cmd=="Z") {  x=mx;  y=my;  }
		}
		
		return merge(out);
	}
	function SVGToPath(d) {
		var pth = {cmds:[], crds:[]};
		Typr["U"]["SVG"].svgToPath(d, pth);
		return {"cmds":pth.cmds, "crds":pth.crds};
	}

	function mipmapB(buff, w,h, hlp) {
		var nw = w>>1, nh = h>>1;
		var nbuf = (hlp && hlp.length==nw*nh*4) ? hlp : new Uint8Array(nw*nh*4);
		var sb32 = new Uint32Array(buff.buffer), nb32 = new Uint32Array(nbuf.buffer);
		for(var y=0; y<nh; y++)
			for(var x=0; x<nw; x++) {
				var ti = (y*nw+x), si = ((y<<1)*w+(x<<1));
				//nbuf[ti  ] = buff[si  ];  nbuf[ti+1] = buff[si+1];  nbuf[ti+2] = buff[si+2];  nbuf[ti+3] = buff[si+3];
				//*
				var c0 = sb32[si], c1 = sb32[si+1], c2 = sb32[si+w], c3 = sb32[si+w+1];
				
				var a0 = (c0>>>24), a1 = (c1>>>24), a2 = (c2>>>24), a3 = (c3>>>24), a = (a0+a1+a2+a3);
				
				if(a==1020) {
					var r = (((c0>>> 0)&255) + ((c1>>> 0)&255) + ((c2>>> 0)&255) + ((c3>>> 0)&255)+2)>>>2; 
					var g = (((c0>>> 8)&255) + ((c1>>> 8)&255) + ((c2>>> 8)&255) + ((c3>>> 8)&255)+2)>>>2; 
					var b = (((c0>>>16)&255) + ((c1>>>16)&255) + ((c2>>>16)&255) + ((c3>>>16)&255)+2)>>>2; 
					nb32[ti] = (255<<24) | (b<<16) | (g<<8) | r;
				}
				else if(a==0) nb32[ti] = 0;
				else {
					var r = ((c0>>> 0)&255)*a0 + ((c1>>> 0)&255)*a1 + ((c2>>> 0)&255)*a2 + ((c3>>> 0)&255)*a3; 
					var g = ((c0>>> 8)&255)*a0 + ((c1>>> 8)&255)*a1 + ((c2>>> 8)&255)*a2 + ((c3>>> 8)&255)*a3; 
					var b = ((c0>>>16)&255)*a0 + ((c1>>>16)&255)*a1 + ((c2>>>16)&255)*a2 + ((c3>>>16)&255)*a3; 
				
					var ia = 1/a;   r = ~~(r*ia+0.5);  g = ~~(g*ia+0.5);  b = ~~(b*ia+0.5);
					nb32[ti] = (((a+2)>>>2)<<24) | (b<<16) | (g<<8) | r;
				}
			}
		return {  buff:nbuf, w:nw, h:nh  };
	}
		
	var __cnv, __ct;
	function pathToContext(path, ctx) {
		var c = 0, cmds = path["cmds"], crds = path["crds"];
		
		//ctx.translate(3500,500);  ctx.rotate(0.25);  ctx.scale(1,-1);
		
		for(var j=0; j<cmds.length; j++) {
			var cmd = cmds[j];
			if     (cmd=="M") {
				ctx.moveTo(crds[c], crds[c+1]);
				c+=2;
			}
			else if(cmd=="L") {
				ctx.lineTo(crds[c], crds[c+1]);
				c+=2;
			}
			else if(cmd=="C") {
				ctx.bezierCurveTo(crds[c], crds[c+1], crds[c+2], crds[c+3], crds[c+4], crds[c+5]);
				c+=6;
			}
			else if(cmd=="Q") {
				ctx.quadraticCurveTo(crds[c], crds[c+1], crds[c+2], crds[c+3]);
				c+=4;
			}
			else if(cmd[0]=="d") {
				var upng=window["UPNG"];
				var x0 = crds[c], y0=crds[c+1], x1=crds[c+2], y1=crds[c+3], x2=crds[c+4], y2=crds[c+5], x3=crds[c+6], y3=crds[c+7];  c+=8;
				//y0+=400;  y1+=400;  y1+=600;
				if(upng==null) {
					ctx.moveTo(x0,y0);  ctx.lineTo(x1,y1);  ctx.lineTo(x2,y2);  ctx.lineTo(x3,y3);  ctx.closePath();
					continue;
				}
				var dx0 = (x1-x0), dy0=(y1-y0), dx1 = (x3-x0), dy1=(y3-y0);
				var sbmp = atob(cmd.slice(22));
				var bmp = new Uint8Array(sbmp.length);
				for(var i=0; i<sbmp.length; i++) bmp[i]=sbmp.charCodeAt(i);
				
				var img = upng["decode"](bmp.buffer), w=img["width"], h=img["height"];  //console.log(img);
				
				var nbmp = new Uint8Array(upng["toRGBA8"](img)[0]);  
				var tr = ctx["getTransform"]();
				var scl = Math.sqrt(Math.abs(tr["a"]*tr["d"]-tr["b"]*tr["c"])) * Math.sqrt(dx1*dx1+dy1*dy1)/h;
				while(scl<0.5) {
					var nd = mipmapB(nbmp,w,h);
					nbmp = nd.buff;  w=nd.w;  h=nd.h;  scl*=2;
				}
				
				if(__cnv==null) {  __cnv = document.createElement("canvas");  __ct=cnv.getContext("2d");  }
				if(__cnv.width!=w || __cnv.height!=h) {  __cnv.width=w;  __cnv.height=h;  }
				
				__ct.putImageData(new ImageData(new Uint8ClampedArray(nbmp.buffer),w,h),0,0);
				ctx.save();
				ctx.transform(dx0,dy0,dx1,dy1,x0,y0);
				ctx.scale(1/w,1/h);
				ctx.drawImage(__cnv,0,0); //*/
				ctx.restore();
			}
			else if(cmd.charAt(0)=="#" || cmd.charAt(0)=="r") {
				ctx.beginPath();
				ctx.fillStyle = cmd;
			}
			else if(cmd.charAt(0)=="O" && cmd!="OX") {
				ctx.beginPath();
				var pts = cmd.split("-");
				ctx.lineWidth=parseFloat(pts[2]);
				ctx.lineCap  = ["butt","round","square"][parseFloat(pts[3])];
				ctx.lineJoin = ["miter","round","bevel"][parseFloat(pts[4])];
				ctx.miterLimit = parseFloat(pts[5]);
				ctx.lineDashOffset = parseFloat(pts[6]);
				ctx.setLineDash(pts[7].split(",").map(parseFloat));
				ctx.strokeStyle = pts[1];
			}
			else if(cmd=="Z") {
				ctx.closePath();
			}
			else if(cmd=="X") {
				ctx.fill();
			}
			else if(cmd=="OX") {
				ctx.stroke();
			}
		}
	}


	function _drawCFF(cmds, state, font, pdct, p)
	{
		var stack = state.stack;
		var nStems = state.nStems, haveWidth=state.haveWidth, width=state.width, open=state.open;
		var i=0;
		var x=state.x, y=state.y, c1x=0, c1y=0, c2x=0, c2y=0, c3x=0, c3y=0, c4x=0, c4y=0, jpx=0, jpy=0;
		var CFF = Typr["T"].CFF;
		
		var nominalWidthX = pdct["nominalWidthX"];
		var o = {val:0,size:0};
		//console.log(cmds);
		while(i<cmds.length)
		{
			CFF.getCharString(cmds, i, o);
			var v = o.val;
			i += o.size;
				
			if(false) {}
			else if(v=="o1" || v=="o18")  //  hstem || hstemhm
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
			else if(v=="o3" || v=="o23")  // vstem || vstemhm
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
			else if(v=="o4")
			{
				if (stack.length > 1 && !haveWidth) {
							width = stack.shift() + nominalWidthX;
							haveWidth = true;
						}
				if(open) P.ClosePath(p);

						y += stack.pop();
						P.MoveTo(p,x,y);   open=true;
			}
			else if(v=="o5")
			{
				while (stack.length > 0) {
							x += stack.shift();
							y += stack.shift();
							P.LineTo(p, x, y);
						}
			}
			else if(v=="o6" || v=="o7")  // hlineto || vlineto
			{
				var count = stack.length;
				var isX = (v == "o6");
				
				for(var j=0; j<count; j++) {
					var sval = stack.shift();
					
					if(isX) x += sval;  else  y += sval;
					isX = !isX;
					P.LineTo(p, x, y);
				}
			}
			else if(v=="o8" || v=="o24")	// rrcurveto || rcurveline
			{
				var count = stack.length;
				var index = 0;
				while(index+6 <= count) {
					c1x = x + stack.shift();
					c1y = y + stack.shift();
					c2x = c1x + stack.shift();
					c2y = c1y + stack.shift();
					x = c2x + stack.shift();
					y = c2y + stack.shift();
					P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
					index+=6;
				}
				if(v=="o24")
				{
					x += stack.shift();
					y += stack.shift();
					P.LineTo(p, x, y);
				}
			}
			else if(v=="o11")  break;
			else if(v=="o1234" || v=="o1235" || v=="o1236" || v=="o1237")//if((v+"").slice(0,3)=="o12")
			{
				if(v=="o1234")
				{
					c1x = x   + stack.shift();    // dx1
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
				if(v=="o1235")
				{
					c1x = x   + stack.shift();    // dx1
					c1y = y   + stack.shift();    // dy1
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
				if(v=="o1236")
				{
					c1x = x   + stack.shift();    // dx1
					c1y = y   + stack.shift();    // dy1
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
				if(v=="o1237")
				{
					c1x = x   + stack.shift();    // dx1
					c1y = y   + stack.shift();    // dy1
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
			else if(v=="o14")
			{
				if (stack.length > 0 && stack.length!=4 && !haveWidth) {
							width = stack.shift() + font["nominalWidthX"];
							haveWidth = true;
						}
				if(stack.length==4) // seac = standard encoding accented character
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
					
					_drawCFF(font["CharStrings"][bind], state,font,pdct,p);
					state.x = adx; state.y = ady;
					_drawCFF(font["CharStrings"][aind], state,font,pdct,p);
					
					//x=state.x; y=state.y; nStems=state.nStems; haveWidth=state.haveWidth; width=state.width;  open=state.open;
				}
				if(open) {  P.ClosePath(p);  open=false;  }
			}		
			else if(v=="o19" || v=="o20") 
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
				
				i += (nStems + 7) >> 3;
			}
			
			else if(v=="o21") {
				if (stack.length > 2 && !haveWidth) {
							width = stack.shift() + nominalWidthX;
							haveWidth = true;
						}

						y += stack.pop();
						x += stack.pop();
						
						if(open) P.ClosePath(p);
						P.MoveTo(p,x,y);   open=true;
			}
			else if(v=="o22")
			{
				 if (stack.length > 1 && !haveWidth) {
							width = stack.shift() + nominalWidthX;
							haveWidth = true;
						}
						
						x += stack.pop();
						
						if(open) P.ClosePath(p);
						P.MoveTo(p,x,y);   open=true;                    
			}
			else if(v=="o25")
			{
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
			else if(v=="o26") 
			{
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
			else if(v=="o27")
			{
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
			else if(v=="o10" || v=="o29")	// callsubr || callgsubr
			{
				var obj = (v=="o10" ? pdct : font);
				if(stack.length==0) { console.log("error: empty stack");  }
				else {
					var ind = stack.pop();
					var subr = obj["Subrs"][ ind + obj["Bias"] ];
					state.x=x; state.y=y; state.nStems=nStems; state.haveWidth=haveWidth; state.width=width;  state.open=open;
					_drawCFF(subr, state,font,pdct,p);
					x=state.x; y=state.y; nStems=state.nStems; haveWidth=state.haveWidth; width=state.width;  open=state.open;
				}
			}
			else if(v=="o30" || v=="o31")   // vhcurveto || hvcurveto
			{
				var count, count1 = stack.length;
				var index = 0;
				var alternate = v == "o31";
				
				count  = count1 & ~2;
				index += count1 - count;
				
				while ( index < count ) 
				{
					if(alternate)
					{
						c1x = x + stack.shift();
						c1y = y;
						c2x = c1x + stack.shift();
						c2y = c1y + stack.shift();
						y = c2y + stack.shift();
						if(count-index == 5) {  x = c2x + stack.shift();  index++;  }
						else x = c2x;
						alternate = false;
					}
					else
					{
						c1x = x;
						c1y = y + stack.shift();
						c2x = c1x + stack.shift();
						c2y = c1y + stack.shift();
						x = c2x + stack.shift();
						if(count-index == 5) {  y = c2y + stack.shift();  index++;  }
						else y = c2y;
						alternate = true;
					}
					P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
					index += 4;
				}
			}
			
			else if((v+"").charAt(0)=="o") {   console.log("Unknown operation: "+v, cmds); throw v;  }
			else stack.push(v);
		}
		//console.log(cmds);
		state.x=x; state.y=y; state.nStems=nStems; state.haveWidth=haveWidth; state.width=width; state.open=open;
	}

	function initHB(hurl,resp) {
	var codeLength = function(code) {
		var len=0;
		if     ((code&(0xffffffff-(1<< 7)+1))==0) {  len=1;  }
		else if((code&(0xffffffff-(1<<11)+1))==0) {  len=2;  }
		else if((code&(0xffffffff-(1<<16)+1))==0) {  len=3;  }
		else if((code&(0xffffffff-(1<<21)+1))==0) {  len=4;  }
		return len;
	}
	
	fetch(hurl)
		.then(function (x  ) { return x["arrayBuffer"](); })
		.then(function (ab ) { return WebAssembly["instantiate"](ab); })
		.then(function (res) {
			console.log("HB ready");
			var exp = res["instance"]["exports"], mem=exp["memory"];
			//mem["grow"](30); // each page is 64kb in size
			var heapu8, u32,i32,f32;
			var __lastFnt, blob,blobPtr,face,font;
			
			Typr["U"]["shapeHB"] = (function () {
				
				var toJson = function (ptr) {
					var length = exp["hb_buffer_get_length"](ptr);
					var result = [];
					var iPtr32 = exp["hb_buffer_get_glyph_infos"](ptr, 0) >>>2;
					var pPtr32 = exp["hb_buffer_get_glyph_positions"](ptr, 0) >>>2;
					for(var i=0; i<length; ++i) {
						var a=iPtr32+i*5, b=pPtr32+i*5;
						result.push({
							"g" : u32[a + 0],
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
				
				return function (fnt, str, prm) {
					var fdata = fnt["_data"], fn = fnt["name"]["postScriptName"];
					var ltr = prm["ltr"], fts = prm["fts"], axs = prm["axs"];
					if(fnt["fvar"] && axs==null) axs = fnt["fvar"][1][fnt["_index"]][2];
					
					//var olen = mem.buffer.byteLength, nlen = 2*fdata.length+str.length*16 + 4e6;
					//if(olen<nlen) mem["grow"](((nlen-olen)>>>16)+4);  //console.log("growing",nlen);
					
					heapu8 = new Uint8Array (mem.buffer);
					u32    = new Uint32Array(mem.buffer);
					i32    = new Int32Array (mem.buffer);
					f32    = new Float32Array(mem.buffer);
					
					if(__lastFnt!=fn) {
						if(blob!=null) {  
							exp["hb_blob_destroy"](blob);
							exp["free"](blobPtr);
							exp["hb_face_destroy"](face);
							exp["hb_font_destroy"](font);
						}
						blobPtr = exp["malloc"](fdata.byteLength);  heapu8.set(fdata, blobPtr);
						blob = exp["hb_blob_create"](blobPtr, fdata.byteLength, 2, 0, 0);
						face = exp["hb_face_create"](blob, fnt["_index"]);
						font = exp["hb_font_create"](face)
						__lastFnt = fn;
					}
					if(window["TextEncoder"]==null) {  alert("Your browser is too old. Please, update it.");  return;  }
					if(te==null) te = new window["TextEncoder"]("utf8");
					
					var buffer = exp["hb_buffer_create"]();
					var bytes = te["encode"](str);
					var len=bytes.length, strp = exp["malloc"](len);  heapu8.set(bytes, strp);
					exp["hb_buffer_add_utf8"](buffer, strp, len, 0, len);
					exp["free"](strp);
					
					var bin = Typr["B"];
					
					var feat=0;
					if(fts) {
						feat = exp["malloc"](16*fts.length);
						for(var i=0; i<fts.length; i++) {
							var fe = fts[i];
							var off = feat+i*16, qo=off>>>2;
							bin.writeASCII (heapu8, off   , fe[0].split("").reverse().join(""));
							u32[qo+1]=fe[1];
							u32[qo+2]=fe[2];
							u32[qo+3]=fe[3];
						}
						//console.log(fts);
					}
					var vdat = 0;
					if(axs) {
						var axes=fnt["fvar"][0];  //console.log(axes, axs);
						vdat = exp["malloc"](8*axs.length);
						for(var i=0; i<axs.length; i++) {
							var off = vdat+i*8, qo=off>>>2;
							bin.writeASCII (heapu8, off   , axes[i][0].split("").reverse().join(""));
							f32[qo+1]=axs[i];
						}
					}
					//*/
					
					if(axs) exp["hb_font_set_variations"](font,vdat,axs.length);
					exp["hb_buffer_set_direction"](buffer,ltr?4:5);
					exp["hb_buffer_guess_segment_properties"](buffer);
					exp["hb_shape"](font, buffer, feat,fts?fts.length:0);
					var json = toJson(buffer)//buffer["json"]();
					exp["hb_buffer_destroy"](buffer);
					if(fts) exp["free"](feat);
					if(axs) exp["free"](vdat);
					
					var arr = json.slice(0);  if(!ltr) arr.reverse();
					var ci=0, bi=0;  // character index, binary index
					for(var i=1; i<arr.length; i++) {
						var gl = arr[i], cl=gl["cl"];
						while(true) {
							var cpt = str.codePointAt(ci), cln = codeLength(cpt);
							if(bi+cln <=cl) {  bi+=cln;  ci += cpt<=0xffff ? 1 : 2;  }
							else break;
						}
						//while(bi+codeLength(str.charCodeAt(ci)) <=cl) {  bi+=codeLength(str.charCodeAt(ci));  ci++;  }
						gl["cl"]=ci;
					}
					return json;
				}
			}());
			resp();
		});	
	}
	
	return {"shape":shape,"shapeToPath":shapeToPath,"codeToGlyph":codeToGlyph, "glyphToPath":glyphToPath, "pathToSVG":pathToSVG, "SVGToPath":SVGToPath, "pathToContext":pathToContext, "initHB":initHB};
}();

