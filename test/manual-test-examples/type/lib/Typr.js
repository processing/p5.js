

var Typr = {};

Typr["parse"] = function(buff)
{
	var readFont = function(data, idx, offset,tmap) {
		var bin = Typr["B"];
		
		var T = Typr["T"];
		var prsr = {
			"cmap":T.cmap,
			"head":T.head,
			"hhea":T.hhea,
			"maxp":T.maxp,
			"hmtx":T.hmtx,
			"name":T.name,
			"OS/2":T.OS2,
			"post":T.post,
			
			"loca":T.loca,
			"kern":T.kern,
			"glyf":T.glyf,
			
			"CFF ":T.CFF,
			/*
			"GPOS",
			"GSUB",
			"GDEF",*/
			"CBLC":T.CBLC,
			"CBDT":T.CBDT,
			
			"SVG ":T.SVG,
			"COLR":T.colr,
			"CPAL":T.cpal,
			"sbix":T.sbix
			//"VORG",
		};
		var obj = {"_data":data, "_index":idx, "_offset":offset};
		
		for(var t in prsr) {
			var tab = Typr["findTable"](data, t, offset);
			if(tab) {
				var off=tab[0], tobj = tmap[off];
				if(tobj==null) tobj = prsr[t].parseTab(data, off, tab[1], obj);
				obj[t] = tmap[off] = tobj;
			}
		}
		return obj;
	}
	
	
	var bin = Typr["B"];
	var data = new Uint8Array(buff);
	
	var tmap = {};
	var tag = bin.readASCII(data, 0, 4);  
	if(tag=="ttcf") {
		var offset = 4;
		var majV = bin.readUshort(data, offset);  offset+=2;
		var minV = bin.readUshort(data, offset);  offset+=2;
		var numF = bin.readUint  (data, offset);  offset+=4;
		var fnts = [];
		for(var i=0; i<numF; i++) {
			var foff = bin.readUint  (data, offset);  offset+=4;
			fnts.push(readFont(data, i, foff,tmap));
		}
		return fnts;
	}
	else return [readFont(data, 0, 0,tmap)];
}


Typr["findTable"] = function(data, tab, foff)
{
	var bin = Typr["B"];
	var numTables = bin.readUshort(data, foff+4);
	var offset = foff+12;
	for(var i=0; i<numTables; i++)
	{
		var tag      = bin.readASCII(data, offset, 4);   //console.log(tag);
		var checkSum = bin.readUint (data, offset+ 4);
		var toffset  = bin.readUint (data, offset+ 8); 
		var length   = bin.readUint (data, offset+12);
		if(tag==tab) return [toffset,length];
		offset+=16;
	}
	return null;
}
/*
Typr["splitBy"] = function(data,tag) {
	data = new Uint8Array(data);  console.log(data.slice(0,64));
	var bin = Typr["B"];
	var ttcf = bin.readASCII(data, 0, 4);  if(ttcf!="ttcf") return {};
	
	var offset = 8;
	var numF = bin.readUint  (data, offset);  offset+=4;
	var colls = [], used={};
	for(var i=0; i<numF; i++) {
		var foff = bin.readUint  (data, offset);  offset+=4;
		var toff = Typr["findTable"](data,tag,foff)[0];
		if(used[toff]==null) used[toff] = [];
		used[toff].push([foff,bin.readUshort(data,foff+4)]);  // font offset, numTables
	}
	for(var toff in used) {
		var offs = used[toff];
		var hlen = 12+4*offs.length;
		var out = new Uint8Array(hlen);		
		for(var i=0; i<8; i++) out[i]=data[i];
		bin.writeUint(out,8,offs.length);
		
		for(var i=0; i<offs.length; i++) hlen += 12+offs[i][1]*16;
		
		var hdrs = [out], tabs = [], hoff=out.length, toff=hlen, noffs={};
		for(var i=0; i<offs.length; i++) {
			bin.writeUint(out, 12+i*4, hoff);  hoff+=12+offs[i][1]*16;
			toff = Typr["_cutFont"](data, offs[i][0], hdrs, tabs, toff, noffs);
		}
		colls.push(Typr["_joinArrs"](hdrs.concat(tabs)));
	}
	return colls;
}

Typr["splitFonts"] = function(data) {
	data = new Uint8Array(data);
	var bin = Typr["B"];
	var ttcf = bin.readASCII(data, 0, 4);  if(ttcf!="ttcf") return {};
	
	var offset = 8;
	var numF = bin.readUint  (data, offset);  offset+=4;
	var fnts = [];
	for(var i=0; i<numF; i++) {
		var foff = bin.readUint  (data, offset);  offset+=4;
		fnts.push(Typr._cutFont(data, foff));
		break;
	}
	return fnts;
}

Typr["_cutFont"] = function(data,foff,hdrs,tabs,toff, noffs) {
	var bin = Typr["B"];
	var numTables = bin.readUshort(data, foff+4);
	
	var out = new Uint8Array(12+numTables*16);  hdrs.push(out);
	for(var i=0; i<12; i++) out[i]=data[foff+i];  //console.log(out);
	
	var off = 12;
	for(var i=0; i<numTables; i++)
	{
		var tag      = bin.readASCII(data, foff+off, 4); 
		var checkSum = bin.readUint (data, foff+off+ 4);
		var toffset  = bin.readUint (data, foff+off+ 8); 
		var length   = bin.readUint (data, foff+off+12);
		
		while((length&3)!=0) length++;
		
		for(var j=0; j<16; j++) out[off+j]=data[foff+off+j];
		
		if(noffs[toffset]!=null) bin.writeUint(out,off+8,noffs[toffset]);
		else {
			noffs[toffset] = toff;
			bin.writeUint(out, off+8, toff);  
			tabs.push(new Uint8Array(data.buffer, toffset, length));  toff+=length;
		}
		off+=16;
	}
	return toff;
}
Typr["_joinArrs"] = function(tabs) {
	var len = 0;
	for(var i=0; i<tabs.length; i++) len+=tabs[i].length;
	var out = new Uint8Array(len), ooff=0;
	for(var i=0; i<tabs.length; i++) {
		var tab = tabs[i];
		for(var j=0; j<tab.length; j++) out[ooff+j]=tab[j];
		ooff+=tab.length;
	}
	return out;
}
*/

Typr["T"]={};





Typr["B"] = {
	readFixed : function(data, o)
	{
		return ((data[o]<<8) | data[o+1]) +  (((data[o+2]<<8)|data[o+3])/(256*256+4));
	},
	readF2dot14 : function(data, o)
	{
		var num = Typr["B"].readShort(data, o);
		return num / 16384;
	},
	readInt : function(buff, p)
	{
		//if(p>=buff.length) throw "error";
		var a = Typr["B"].t.uint8;
		a[0] = buff[p+3];
		a[1] = buff[p+2];
		a[2] = buff[p+1];
		a[3] = buff[p];
		return Typr["B"].t.int32[0];
	},
	
	readInt8 : function(buff, p)
	{
		//if(p>=buff.length) throw "error";
		var a = Typr["B"].t.uint8;
		a[0] = buff[p];
		return Typr["B"].t.int8[0];
	},
	readShort : function(buff, p)
	{
		//if(p>=buff.length) throw "error";
		var a = Typr["B"].t.uint16;
		a[0] = (buff[p]<<8) | buff[p+1];
		return Typr["B"].t.int16[0];
	},
	readUshort : function(buff, p)
	{
		//if(p>=buff.length) throw "error";
		return (buff[p]<<8) | buff[p+1];
	},
	writeUshort : function(buff, p, n)
	{
		buff[p] = (n>>8)&255;  buff[p+1] = n&255;
	},
	readUshorts : function(buff, p, len)
	{
		var arr = [];
		for(var i=0; i<len; i++) {
			var v = Typr["B"].readUshort(buff, p+i*2);  //if(v==932) console.log(p+i*2);
			arr.push(v);
		}
		return arr;
	},
	readUint : function(buff, p)
	{
		//if(p>=buff.length) throw "error";
		var a = Typr["B"].t.uint8;
		a[3] = buff[p];  a[2] = buff[p+1];  a[1] = buff[p+2];  a[0] = buff[p+3];
		return Typr["B"].t.uint32[0];
	},
	writeUint: function(buff, p, n)
	{
		buff[p] = (n>>24)&255;  buff[p+1] = (n>>16)&255;  buff[p+2] = (n>>8)&255;  buff[p+3] = (n>>0)&255;
	},
	readUint64 : function(buff, p)
	{
		//if(p>=buff.length) throw "error";
		return (Typr["B"].readUint(buff, p)*(0xffffffff+1)) + Typr["B"].readUint(buff, p+4);
	},
	readASCII : function(buff, p, l)	// l : length in Characters (not Bytes)
	{
		//if(p>=buff.length) throw "error";
		var s = "";
		for(var i = 0; i < l; i++) s += String.fromCharCode(buff[p+i]);
		return s;
	},
	writeASCII : function(buff, p, s)	// l : length in Characters (not Bytes)
	{
		for(var i = 0; i < s.length; i++)	
			buff[p+i] = s.charCodeAt(i);
	},
	readUnicode : function(buff, p, l)
	{
		//if(p>=buff.length) throw "error";
		var s = "";
		for(var i = 0; i < l; i++)	
		{
			var c = (buff[p++]<<8) | buff[p++];
			s += String.fromCharCode(c);
		}
		return s;
	},
	_tdec : window["TextDecoder"] ? new window["TextDecoder"]() : null,
	readUTF8 : function(buff, p, l) {
		var tdec = Typr["B"]._tdec;
		if(tdec && p==0 && l==buff.length) return tdec["decode"](buff);
		return Typr["B"].readASCII(buff,p,l);
	},
	readBytes : function(buff, p, l)
	{
		//if(p>=buff.length) throw "error";
		var arr = [];
		for(var i=0; i<l; i++) arr.push(buff[p+i]);
		return arr;
	},
	readASCIIArray : function(buff, p, l)	// l : length in Characters (not Bytes)
	{
		//if(p>=buff.length) throw "error";
		var s = [];
		for(var i = 0; i < l; i++)	
			s.push(String.fromCharCode(buff[p+i]));
		return s;
	}, 
	t : function() {
		var ab = new ArrayBuffer(8);
		return {
			buff   : ab,
			int8   : new Int8Array  (ab),
			uint8  : new Uint8Array (ab),
			int16  : new Int16Array (ab),
			uint16 : new Uint16Array(ab),
			int32  : new Int32Array (ab),
			uint32 : new Uint32Array(ab)
		}  
	}()
};






	Typr["T"].CFF = {
		parseTab : function(data, offset, length)
		{
			var bin = Typr["B"];
			var CFF = Typr["T"].CFF;
			
			data = new Uint8Array(data.buffer, offset, length);
			offset = 0;
			
			// Header
			var major = data[offset];  offset++;
			var minor = data[offset];  offset++;
			var hdrSize = data[offset];  offset++;
			var offsize = data[offset];  offset++;
			//console.log(major, minor, hdrSize, offsize);
			
			// Name INDEX
			var ninds = [];
			offset = CFF.readIndex(data, offset, ninds);
			var names = [];
			
			for(var i=0; i<ninds.length-1; i++) names.push(bin.readASCII(data, offset+ninds[i], ninds[i+1]-ninds[i]));
			offset += ninds[ninds.length-1];
			
			
			// Top DICT INDEX
			var tdinds = [];
			offset = CFF.readIndex(data, offset, tdinds);  //console.log(tdinds);
			// Top DICT Data
			var topDicts = [];
			for(var i=0; i<tdinds.length-1; i++) topDicts.push( CFF.readDict(data, offset+tdinds[i], offset+tdinds[i+1]) );
			offset += tdinds[tdinds.length-1];
			var topdict = topDicts[0];
			//console.log(topdict);
			
			// String INDEX
			var sinds = [];
			offset = CFF.readIndex(data, offset, sinds);
			// String Data
			var strings = [];
			for(var i=0; i<sinds.length-1; i++) strings.push(bin.readASCII(data, offset+sinds[i], sinds[i+1]-sinds[i]));
			offset += sinds[sinds.length-1];
			
			// Global Subr INDEX  (subroutines)		
			CFF.readSubrs(data, offset, topdict);
			
			// charstrings
			
			if(topdict["CharStrings"]) topdict["CharStrings"] = CFF.readBytes(data, topdict["CharStrings"]);
			
			// CID font
			if(topdict["ROS"]) {
				offset = topdict["FDArray"];
				var fdind = [];
				offset = CFF.readIndex(data, offset, fdind);
				
				topdict["FDArray"] = [];
				for(var i=0; i<fdind.length-1; i++) {
					var dict = CFF.readDict(data, offset+fdind[i], offset+fdind[i+1]);
					CFF._readFDict(data, dict, strings);
					topdict["FDArray"].push( dict );
				}
				offset += fdind[fdind.length-1];
				
				offset = topdict["FDSelect"];
				topdict["FDSelect"] = [];
				var fmt = data[offset];  offset++;
				if(fmt==3) {
					var rns = bin.readUshort(data, offset);  offset+=2;
					for(var i=0; i<rns+1; i++) {
						topdict["FDSelect"].push(bin.readUshort(data, offset), data[offset+2]);  offset+=3;
					}
				}
				else throw fmt;
			}
			
			// Encoding
			//if(topdict["Encoding"]) topdict["Encoding"] = CFF.readEncoding(data, topdict["Encoding"], topdict["CharStrings"].length);
			
			// charset
			if(topdict["charset"] ) topdict["charset"]  = CFF.readCharset (data, topdict["charset"] , topdict["CharStrings"].length);
			
			CFF._readFDict(data, topdict, strings);
			return topdict;
		},
		
		_readFDict : function(data, dict, ss) {
			var CFF = Typr["T"].CFF;
			var offset;
			if(dict["Private"]) {
				offset = dict["Private"][1];
				dict["Private"] = CFF.readDict(data, offset, offset+dict["Private"][0]);
				if(dict["Private"]["Subrs"]) CFF.readSubrs(data, offset+dict["Private"]["Subrs"], dict["Private"]);
			}
			for(var p in dict) if(["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(p)!=-1)  dict[p]=ss[dict[p] -426 + 35];
		},
		
		readSubrs : function(data, offset, obj)
		{
			obj["Subrs"] = Typr["T"].CFF.readBytes(data, offset);
			
			var bias, nSubrs = obj["Subrs"].length+1;
			if (false) bias = 0;
			else if (nSubrs <  1240) bias = 107;
			else if (nSubrs < 33900) bias = 1131;
			else bias = 32768;
			obj["Bias"] = bias;
		},
		readBytes : function(data, offset) {
			var bin = Typr["B"];
			var arr = [];
			offset = Typr["T"].CFF.readIndex(data, offset, arr);
			
			var subrs = [], arl = arr.length-1, no = data.byteOffset+offset;
			for(var i=0; i<arl; i++) {
				var ari = arr[i];
				subrs.push(new Uint8Array(data.buffer, no+ari, arr[i+1]-ari));
			}
			return subrs;
		},
		
		tableSE : [
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  1,   2,   3,   4,   5,   6,   7,   8,
		  9,  10,  11,  12,  13,  14,  15,  16,
		 17,  18,  19,  20,  21,  22,  23,  24,
		 25,  26,  27,  28,  29,  30,  31,  32,
		 33,  34,  35,  36,  37,  38,  39,  40,
		 41,  42,  43,  44,  45,  46,  47,  48,
		 49,  50,  51,  52,  53,  54,  55,  56,
		 57,  58,  59,  60,  61,  62,  63,  64,
		 65,  66,  67,  68,  69,  70,  71,  72,
		 73,  74,  75,  76,  77,  78,  79,  80,
		 81,  82,  83,  84,  85,  86,  87,  88,
		 89,  90,  91,  92,  93,  94,  95,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0,  96,  97,  98,  99, 100, 101, 102,
		103, 104, 105, 106, 107, 108, 109, 110,
		  0, 111, 112, 113, 114,   0, 115, 116,
		117, 118, 119, 120, 121, 122,   0, 123,
		  0, 124, 125, 126, 127, 128, 129, 130,
		131,   0, 132, 133,   0, 134, 135, 136,
		137,   0,   0,   0,   0,   0,   0,   0,
		  0,   0,   0,   0,   0,   0,   0,   0,
		  0, 138,   0, 139,   0,   0,   0,   0,
		140, 141, 142, 143,   0,   0,   0,   0,
		  0, 144,   0,   0,   0, 145,   0,   0,
		146, 147, 148, 149,   0,   0,   0,   0
		],
	  
		glyphByUnicode : function(cff, code)
		{
			for(var i=0; i<cff["charset"].length; i++) if(cff["charset"][i]==code) return i;
			return -1;
		},
		
		glyphBySE : function(cff, charcode)	// glyph by standard encoding
		{
			if ( charcode < 0 || charcode > 255 ) return -1;
			return Typr["T"].CFF.glyphByUnicode(cff, Typr["T"].CFF.tableSE[charcode]);		
		},
		
		/*readEncoding : function(data, offset, num)
		{
			var bin = Typr["B"];
			
			var array = ['.notdef'];
			var format = data[offset];  offset++;
			//console.log("Encoding");
			//console.log(format);
			
			if(format==0)
			{
				var nCodes = data[offset];  offset++;
				for(var i=0; i<nCodes; i++)  array.push(data[offset+i]);
			}
			/*
			else if(format==1 || format==2)
			{
				while(charset.length<num)
				{
					var first = bin.readUshort(data, offset);  offset+=2;
					var nLeft=0;
					if(format==1) {  nLeft = data[offset];  offset++;  }
					else          {  nLeft = bin.readUshort(data, offset);  offset+=2;  }
					for(var i=0; i<=nLeft; i++)  {  charset.push(first);  first++;  }
				}
			}
			
			else throw "error: unknown encoding format: " + format;
			
			return array;
		},*/

		readCharset : function(data, offset, num)
		{
			var bin = Typr["B"];
			
			var charset = ['.notdef'];
			var format = data[offset];  offset++;
			
			if(format==0)
			{
				for(var i=0; i<num; i++) 
				{
					var first = bin.readUshort(data, offset);  offset+=2;
					charset.push(first);
				}
			}
			else if(format==1 || format==2)
			{
				while(charset.length<num)
				{
					var first = bin.readUshort(data, offset);  offset+=2;
					var nLeft=0;
					if(format==1) {  nLeft = data[offset];  offset++;  }
					else          {  nLeft = bin.readUshort(data, offset);  offset+=2;  }
					for(var i=0; i<=nLeft; i++)  {  charset.push(first);  first++;  }
				}
			}
			else throw "error: format: " + format;
			
			return charset;
		},

		readIndex : function(data, offset, inds)
		{
			var bin = Typr["B"];
			
			var count = bin.readUshort(data, offset)+1;  offset+=2;
			var offsize = data[offset];  offset++;
			
			if     (offsize==1) for(var i=0; i<count; i++) inds.push( data[offset+i] );
			else if(offsize==2) for(var i=0; i<count; i++) inds.push( bin.readUshort(data, offset+i*2) );
			else if(offsize==3) for(var i=0; i<count; i++) inds.push( bin.readUint  (data, offset+i*3 - 1) & 0x00ffffff );
			else if(offsize==4) for(var i=0; i<count; i++) inds.push( bin.readUint  (data, offset+i*4) );
			else if(count!=1) throw "unsupported offset size: " + offsize + ", count: " + count;
			
			offset += count*offsize;
			return offset-1;
		},
		
		getCharString : function(data, offset, o)
		{
			var bin = Typr["B"];
			
			var b0 = data[offset], b1 = data[offset+1], b2 = data[offset+2], b3 = data[offset+3], b4=data[offset+4];
			var vs = 1;
			var op=null, val=null;
			// operand
			if(b0<=20) { op = b0;  vs=1;  }
			if(b0==12) { op = b0*100+b1;  vs=2;  }
			//if(b0==19 || b0==20) { op = b0/*+" "+b1*/;  vs=2; }
			if(21 <=b0 && b0<= 27) { op = b0;  vs=1; }
			if(b0==28) { val = bin.readShort(data,offset+1);  vs=3; }
			if(29 <=b0 && b0<= 31) { op = b0;  vs=1; }
			if(32 <=b0 && b0<=246) { val = b0-139;  vs=1; }
			if(247<=b0 && b0<=250) { val = (b0-247)*256+b1+108;  vs=2; }
			if(251<=b0 && b0<=254) { val =-(b0-251)*256-b1-108;  vs=2; }
			if(b0==255) {  val = bin.readInt(data, offset+1)/0xffff;  vs=5;   }
			
			o.val = val!=null ? val : "o"+op;
			o.size = vs;
		},
		
		readCharString : function(data, offset, length)
		{
			var end = offset + length;
			var bin = Typr["B"];
			var arr = [];
			
			while(offset<end)
			{
				var b0 = data[offset], b1 = data[offset+1], b2 = data[offset+2], b3 = data[offset+3], b4=data[offset+4];
				var vs = 1;
				var op=null, val=null;
				// operand
				if(b0<=20) { op = b0;  vs=1;  }
				if(b0==12) { op = b0*100+b1;  vs=2;  }
				if(b0==19 || b0==20) { op = b0/*+" "+b1*/;  vs=2; }
				if(21 <=b0 && b0<= 27) { op = b0;  vs=1; }
				if(b0==28) { val = bin.readShort(data,offset+1);  vs=3; }
				if(29 <=b0 && b0<= 31) { op = b0;  vs=1; }
				if(32 <=b0 && b0<=246) { val = b0-139;  vs=1; }
				if(247<=b0 && b0<=250) { val = (b0-247)*256+b1+108;  vs=2; }
				if(251<=b0 && b0<=254) { val =-(b0-251)*256-b1-108;  vs=2; }
				if(b0==255) {  val = bin.readInt(data, offset+1)/0xffff;  vs=5;   }
				
				arr.push(val!=null ? val : "o"+op);
				offset += vs;	

				//var cv = arr[arr.length-1];
				//if(cv==undefined) throw "error";
				//console.log()
			}	
			return arr;
		},

		readDict : function(data, offset, end)
		{
			var bin = Typr["B"];
			//var dict = [];
			var dict = {};
			var carr = [];
			
			while(offset<end)
			{
				var b0 = data[offset], b1 = data[offset+1], b2 = data[offset+2], b3 = data[offset+3], b4=data[offset+4];
				var vs = 1;
				var key=null, val=null;
				// operand
				if(b0==28) { val = bin.readShort(data,offset+1);  vs=3; }
				if(b0==29) { val = bin.readInt  (data,offset+1);  vs=5; }
				if(32 <=b0 && b0<=246) { val = b0-139;  vs=1; }
				if(247<=b0 && b0<=250) { val = (b0-247)*256+b1+108;  vs=2; }
				if(251<=b0 && b0<=254) { val =-(b0-251)*256-b1-108;  vs=2; }
				if(b0==255) {  val = bin.readInt(data, offset+1)/0xffff;  vs=5;  throw "unknown number";  }
				
				if(b0==30) 
				{  
					var nibs = [];
					vs = 1;
					while(true)
					{
						var b = data[offset+vs];  vs++;
						var nib0 = b>>4, nib1 = b&0xf;
						if(nib0 != 0xf) nibs.push(nib0);  if(nib1!=0xf) nibs.push(nib1);
						if(nib1==0xf) break;
					}
					var s = "";
					var chars = [0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"];
					for(var i=0; i<nibs.length; i++) s += chars[nibs[i]];
					//console.log(nibs);
					val = parseFloat(s);
				}
				
				if(b0<=21)	// operator
				{
					var keys = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues","FamilyOtherBlues",
						"StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", 
						"defaultWidthX", "nominalWidthX"];
						
					key = keys[b0];  vs=1;
					if(b0==12) { 
						var keys = [ "Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale",
						"BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", "","", "LanguageGroup", "ExpansionFactor", "initialRandomSeed",
						"SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", "","","",  "","","",
						"ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"];
						key = keys[b1];  vs=2; 
					}
				}
				
				if(key!=null) {  dict[key] = carr.length==1 ? carr[0] : carr;  carr=[]; }
				else  carr.push(val);  
				
				offset += vs;		
			}	
			return dict;
		}
	};


Typr["T"].cmap = {
	parseTab : function(data, offset, length)
	{
		var obj = {tables:[],ids:{},off:offset};
		data = new Uint8Array(data.buffer, offset, length);
		offset = 0;

		var offset0 = offset;
		var bin = Typr["B"], rU = bin.readUshort, cmap = Typr["T"].cmap;
		var version   = rU(data, offset);  offset += 2;
		var numTables = rU(data, offset);  offset += 2;
		
		//console.log(version, numTables);
		
		var offs = [];
		
		
		for(var i=0; i<numTables; i++)
		{
			var platformID = rU(data, offset);  offset += 2;
			var encodingID = rU(data, offset);  offset += 2;
			var noffset = bin.readUint(data, offset);       offset += 4;
			
			var id = "p"+platformID+"e"+encodingID;
			
			//console.log("cmap subtable", platformID, encodingID, noffset);
			
			
			var tind = offs.indexOf(noffset);
			
			if(tind==-1)
			{
				tind = obj.tables.length;
				var subt = {};
				offs.push(noffset);
				//var time = Date.now();
				var format = subt.format = rU(data, noffset);
				if     (format== 0) subt = cmap.parse0(data, noffset, subt);
				//else if(format== 2) subt.off = noffset;
				else if(format== 4) subt = cmap.parse4(data, noffset, subt);
				else if(format== 6) subt = cmap.parse6(data, noffset, subt);
				else if(format==12) subt = cmap.parse12(data,noffset, subt);
				//console.log(format, Date.now()-time);
				//else console.log("unknown format: "+format, platformID, encodingID, noffset);
				obj.tables.push(subt);
			}
			
			if(obj.ids[id]!=null) console.log("multiple tables for one platform+encoding: "+id);
			obj.ids[id] = tind;
		}
		return obj;
	},

	parse0 : function(data, offset, obj)
	{
		var bin = Typr["B"];
		offset += 2;
		var len    = bin.readUshort(data, offset);  offset += 2;
		var lang   = bin.readUshort(data, offset);  offset += 2;
		obj.map = [];
		for(var i=0; i<len-6; i++) obj.map.push(data[offset+i]);
		return obj;
	},

	parse4 : function(data, offset, obj)
	{
		var bin = Typr["B"], rU = bin.readUshort, rUs = bin.readUshorts;
		var offset0 = offset;
		offset+=2;
		var length   = rU(data, offset);  offset+=2;
		var language = rU(data, offset);  offset+=2;
		var segCountX2 = rU(data, offset);  offset+=2;
		var segCount = segCountX2>>>1;
		obj.searchRange = rU(data, offset);  offset+=2;
		obj.entrySelector = rU(data, offset);  offset+=2;
		obj.rangeShift = rU(data, offset);  offset+=2;
		obj.endCount   = rUs(data, offset, segCount);  offset += segCount*2;
		offset+=2;
		obj.startCount = rUs(data, offset, segCount);  offset += segCount*2;
		obj.idDelta = [];
		for(var i=0; i<segCount; i++) {obj.idDelta.push(bin.readShort(data, offset));  offset+=2;}
		obj.idRangeOffset = rUs(data, offset, segCount);  offset += segCount*2;
		obj.glyphIdArray  = rUs(data, offset, ((offset0+length)-offset)>>>1);  //offset += segCount*2;
		return obj;
	},

	parse6 : function(data, offset, obj)
	{
		var bin = Typr["B"];
		var offset0 = offset;
		offset+=2;
		var length = bin.readUshort(data, offset);  offset+=2;
		var language = bin.readUshort(data, offset);  offset+=2;
		obj.firstCode = bin.readUshort(data, offset);  offset+=2;
		var entryCount = bin.readUshort(data, offset);  offset+=2;
		obj.glyphIdArray = [];
		for(var i=0; i<entryCount; i++) {obj.glyphIdArray.push(bin.readUshort(data, offset));  offset+=2;}
		
		return obj;
	},

	parse12 : function(data, offset, obj)
	{
		var bin = Typr["B"], rU = bin.readUint;
		var offset0 = offset;
		offset+=4;
		var length = rU(data, offset);  offset+=4;
		var lang   = rU(data, offset);  offset+=4;
		var nGroups= rU(data, offset)*3;  offset+=4;
		
		var gps = obj.groups = new Uint32Array(nGroups);//new Uint32Array(data.slice(offset, offset+nGroups*12).buffer);  
		
		for(var i=0; i<nGroups; i+=3) {
			gps[i  ] = rU(data, offset+(i<<2)  );
			gps[i+1] = rU(data, offset+(i<<2)+4);
			gps[i+2] = rU(data, offset+(i<<2)+8);
		}
		return obj;
	}
};

Typr["T"].CBLC = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"], ooff=offset;
		
		var maj = bin.readUshort(data,offset);  offset+=2;
		var min = bin.readUshort(data,offset);  offset+=2;
		
		var numSizes = bin.readUint  (data,offset);  offset+=4;
		
		var out = [];
		for(var i=0; i<numSizes; i++) {
			var off = bin.readUint  (data,offset);  offset+=4;  // indexSubTableArrayOffset
			var siz = bin.readUint  (data,offset);  offset+=4;  // indexTablesSize
			var num = bin.readUint  (data,offset);  offset+=4;  // numberOfIndexSubTables
			offset+=4;
			
			offset+=2*12;
			
			var sGlyph = bin.readUshort(data,offset);  offset+=2;
			var eGlyph = bin.readUshort(data,offset);  offset+=2;
			
			//console.log(off,siz,num, sGlyph, eGlyph);
			
			offset+=4;
			
			var coff = ooff+off;
			for(var j=0; j<3; j++) {				
				var fgI = bin.readUshort(data,coff);  coff+=2;
				var lgI = bin.readUshort(data,coff);  coff+=2;
				var nxt = bin.readUint  (data,coff);  coff+=4; 
				var gcnt = lgI-fgI+1;
				//console.log(fgI, lgI, nxt);   //if(nxt==0) break;
				
				var ioff = ooff+off+nxt;
				
				var inF = bin.readUshort(data,ioff);  ioff+=2;  if(inF!=1) throw inF;
				var imF = bin.readUshort(data,ioff);  ioff+=2;
				var imgo = bin.readUint  (data,ioff);  ioff+=4;
				
				var oarr = [];
				for(var gi=0; gi<gcnt; gi++) {
					var sbitO = bin.readUint(data,ioff+gi*4);  oarr.push(imgo+sbitO);
					//console.log("--",sbitO);
				}
				out.push([fgI,lgI,imF,oarr]);
			}
		}
		return out;
	}
};

Typr["T"].CBDT = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var ooff=offset;
		
		//var maj = bin.readUshort(data,offset);  offset+=2;
		//var min = bin.readUshort(data,offset);  offset+=2;
		
		return new Uint8Array(data.buffer, data.byteOffset+offset, length);
	}
};

Typr["T"].glyf = {
	parseTab : function(data, offset, length, font)
	{
		var obj = [], ng=font["maxp"]["numGlyphs"];
		for(var g=0; g<ng; g++) obj.push(null);
		return obj;
	},

	_parseGlyf : function(font, g)
	{
		var bin = Typr["B"];
		var data = font["_data"], loca=font["loca"];
		
		if(loca[g]==loca[g+1]) return null;
		
		var offset = Typr["findTable"](data, "glyf", font["_offset"])[0] + loca[g];
		
		var gl = {};
			
		gl.noc  = bin.readShort(data, offset);  offset+=2;		// number of contours
		gl.xMin = bin.readShort(data, offset);  offset+=2;
		gl.yMin = bin.readShort(data, offset);  offset+=2;
		gl.xMax = bin.readShort(data, offset);  offset+=2;
		gl.yMax = bin.readShort(data, offset);  offset+=2;
		
		if(gl.xMin>=gl.xMax || gl.yMin>=gl.yMax) return null;
			
		if(gl.noc>0)
		{
			gl.endPts = [];
			for(var i=0; i<gl.noc; i++) { gl.endPts.push(bin.readUshort(data,offset)); offset+=2; }
			
			var instructionLength = bin.readUshort(data,offset); offset+=2;
			if((data.length-offset)<instructionLength) return null;
			gl.instructions = bin.readBytes(data, offset, instructionLength);   offset+=instructionLength;
			
			var crdnum = gl.endPts[gl.noc-1]+1;
			gl.flags = [];
			for(var i=0; i<crdnum; i++ ) 
			{ 
				var flag = data[offset];  offset++; 
				gl.flags.push(flag); 
				if((flag&8)!=0)
				{
					var rep = data[offset];  offset++;
					for(var j=0; j<rep; j++) { gl.flags.push(flag); i++; }
				}
			}
			gl.xs = [];
			for(var i=0; i<crdnum; i++) {
				var i8=((gl.flags[i]&2)!=0), same=((gl.flags[i]&16)!=0);  
				if(i8) { gl.xs.push(same ? data[offset] : -data[offset]);  offset++; }
				else
				{
					if(same) gl.xs.push(0);
					else { gl.xs.push(bin.readShort(data, offset));  offset+=2; }
				}
			}
			gl.ys = [];
			for(var i=0; i<crdnum; i++) {
				var i8=((gl.flags[i]&4)!=0), same=((gl.flags[i]&32)!=0);  
				if(i8) { gl.ys.push(same ? data[offset] : -data[offset]);  offset++; }
				else
				{
					if(same) gl.ys.push(0);
					else { gl.ys.push(bin.readShort(data, offset));  offset+=2; }
				}
			}
			var x = 0, y = 0;
			for(var i=0; i<crdnum; i++) { x += gl.xs[i]; y += gl.ys[i];  gl.xs[i]=x;  gl.ys[i]=y; }
			//console.log(endPtsOfContours, instructionLength, instructions, flags, xCoordinates, yCoordinates);
		}
		else
		{
			var ARG_1_AND_2_ARE_WORDS	= 1<<0;
			var ARGS_ARE_XY_VALUES		= 1<<1;
			var ROUND_XY_TO_GRID		= 1<<2;
			var WE_HAVE_A_SCALE			= 1<<3;
			var RESERVED				= 1<<4;
			var MORE_COMPONENTS			= 1<<5;
			var WE_HAVE_AN_X_AND_Y_SCALE= 1<<6;
			var WE_HAVE_A_TWO_BY_TWO	= 1<<7;
			var WE_HAVE_INSTRUCTIONS	= 1<<8;
			var USE_MY_METRICS			= 1<<9;
			var OVERLAP_COMPOUND		= 1<<10;
			var SCALED_COMPONENT_OFFSET	= 1<<11;
			var UNSCALED_COMPONENT_OFFSET	= 1<<12;
			
			gl.parts = [];
			var flags;
			do {
				flags = bin.readUshort(data, offset);  offset += 2;
				var part = { m:{a:1,b:0,c:0,d:1,tx:0,ty:0}, p1:-1, p2:-1 };  gl.parts.push(part);
				part.glyphIndex = bin.readUshort(data, offset);  offset += 2;
				if ( flags & ARG_1_AND_2_ARE_WORDS) {
					var arg1 = bin.readShort(data, offset);  offset += 2;
					var arg2 = bin.readShort(data, offset);  offset += 2;
				} else {
					var arg1 = bin.readInt8(data, offset);  offset ++;
					var arg2 = bin.readInt8(data, offset);  offset ++;
				}
				
				if(flags & ARGS_ARE_XY_VALUES) { part.m.tx = arg1;  part.m.ty = arg2; }
				else  {  part.p1=arg1;  part.p2=arg2;  }
				//part.m.tx = arg1;  part.m.ty = arg2;
				//else { throw "params are not XY values"; }
				
				if ( flags & WE_HAVE_A_SCALE ) {
					part.m.a = part.m.d = bin.readF2dot14(data, offset);  offset += 2;    
				} else if ( flags & WE_HAVE_AN_X_AND_Y_SCALE ) {
					part.m.a = bin.readF2dot14(data, offset);  offset += 2; 
					part.m.d = bin.readF2dot14(data, offset);  offset += 2; 
				} else if ( flags & WE_HAVE_A_TWO_BY_TWO ) {
					part.m.a = bin.readF2dot14(data, offset);  offset += 2; 
					part.m.b = bin.readF2dot14(data, offset);  offset += 2; 
					part.m.c = bin.readF2dot14(data, offset);  offset += 2; 
					part.m.d = bin.readF2dot14(data, offset);  offset += 2; 
				}
			} while ( flags & MORE_COMPONENTS ) 
			if (flags & WE_HAVE_INSTRUCTIONS){
				var numInstr = bin.readUshort(data, offset);  offset += 2;
				gl.instr = [];
				for(var i=0; i<numInstr; i++) { gl.instr.push(data[offset]);  offset++; }
			}
		}
		return gl;
	}
};

Typr["T"].head = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var obj = {};
		var tableVersion = bin.readFixed(data, offset);  offset += 4;
		
		obj["fontRevision"] = bin.readFixed(data, offset);  offset += 4;
		var checkSumAdjustment = bin.readUint(data, offset);  offset += 4;
		var magicNumber = bin.readUint(data, offset);  offset += 4;
		obj["flags"] = bin.readUshort(data, offset);  offset += 2;
		obj["unitsPerEm"] = bin.readUshort(data, offset);  offset += 2;
		obj["created"]  = bin.readUint64(data, offset);  offset += 8;
		obj["modified"] = bin.readUint64(data, offset);  offset += 8;
		obj["xMin"] = bin.readShort(data, offset);  offset += 2;
		obj["yMin"] = bin.readShort(data, offset);  offset += 2;
		obj["xMax"] = bin.readShort(data, offset);  offset += 2;
		obj["yMax"] = bin.readShort(data, offset);  offset += 2;
		obj["macStyle"] = bin.readUshort(data, offset);  offset += 2;
		obj["lowestRecPPEM"] = bin.readUshort(data, offset);  offset += 2;
		obj["fontDirectionHint"] = bin.readShort(data, offset);  offset += 2;
		obj["indexToLocFormat"]  = bin.readShort(data, offset);  offset += 2;
		obj["glyphDataFormat"]   = bin.readShort(data, offset);  offset += 2;
		return obj;
	}
};

Typr["T"].hhea = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var obj = {};
		var tableVersion = bin.readFixed(data, offset);  offset += 4;
		
		var keys = ["ascender","descender","lineGap",
			"advanceWidthMax","minLeftSideBearing","minRightSideBearing","xMaxExtent",
			"caretSlopeRise","caretSlopeRun","caretOffset",
			"res0","res1","res2","res3",
			"metricDataFormat","numberOfHMetrics" ];
			
		for(var i=0; i<	keys.length; i++) {
			var key = keys[i];
			var func = (key=="advanceWidthMax" || key=="numberOfHMetrics")?bin.readUshort:bin.readShort;
			obj[key]=func(data,offset+i*2);
		}
		return obj;
	}
};


Typr["T"].hmtx = {
	parseTab : function(data, offset, length, font)
	{
		var bin = Typr["B"];
		var aWidth = [];
		var lsBearing = [];
		
		var nG = font["maxp"]["numGlyphs"], nH = font["hhea"]["numberOfHMetrics"];
		var aw = 0, lsb = 0, i=0;
		while(i<nH) {  aw=bin.readUshort(data, offset+(i<<2));  lsb=bin.readShort(data, offset+(i<<2)+2);  aWidth.push(aw);  lsBearing.push(lsb);  i++;  }
		while(i<nG) {  aWidth.push(aw);  lsBearing.push(lsb);  i++;  }
		
		return {aWidth:aWidth, lsBearing:lsBearing};
	}
};


Typr["T"].kern = {
	parseTab : function(data, offset, length, font)
	{
		var bin = Typr["B"], kern=Typr["T"].kern;
		
		var version = bin.readUshort(data, offset);
		if(version==1) return kern.parseV1(data, offset, length, font);
		var nTables = bin.readUshort(data, offset+2);  offset+=4;
		
		var map = {glyph1: [], rval:[]};
		for(var i=0; i<nTables; i++)
		{
			offset+=2;	// skip version
			var length  = bin.readUshort(data, offset);  offset+=2;
			var coverage = bin.readUshort(data, offset);  offset+=2;
			var format = coverage>>>8;
			/* I have seen format 128 once, that's why I do */ format &= 0xf;
			if(format==0) offset = kern.readFormat0(data, offset, map);
			//else throw "unknown kern table format: "+format;
		}
		return map;
	},

	parseV1 : function(data, offset, length, font)
	{
		var bin = Typr["B"], kern=Typr["T"].kern;
		
		var version = bin.readFixed(data, offset);   // 0x00010000 
		var nTables = bin.readUint (data, offset+4);  offset+=8;
		
		var map = {glyph1: [], rval:[]};
		for(var i=0; i<nTables; i++)
		{
			var length = bin.readUint(data, offset);   offset+=4;
			var coverage = bin.readUshort(data, offset);  offset+=2;
			var tupleIndex = bin.readUshort(data, offset);  offset+=2;
			var format = coverage&0xff;
			if(format==0) offset = kern.readFormat0(data, offset, map);
			//else throw "unknown kern table format: "+format;
		}
		return map;
	},

	readFormat0 : function(data, offset, map)
	{
		var bin = Typr["B"], rUs = bin.readUshort;
		var pleft = -1;
		var nPairs        = rUs(data, offset);
		var searchRange   = rUs(data, offset+2);
		var entrySelector = rUs(data, offset+4);
		var rangeShift    = rUs(data, offset+6);  offset+=8;
		for(var j=0; j<nPairs; j++)
		{
			var left  = rUs(data, offset);  offset+=2;
			var right = rUs(data, offset);  offset+=2;
			var value = bin.readShort (data, offset);  offset+=2;
			if(left!=pleft) { map.glyph1.push(left);  map.rval.push({ glyph2:[], vals:[] }) }
			var rval = map.rval[map.rval.length-1];
			rval.glyph2.push(right);   rval.vals.push(value);
			pleft = left;
		}
		return offset;
	}
};


Typr["T"].loca = {
	parseTab : function(data, offset, length, font)
	{
		var bin = Typr["B"];
		var obj = [];
		
		var ver = font["head"]["indexToLocFormat"];
		var len = font["maxp"]["numGlyphs"]+1;
		
		if(ver==0) for(var i=0; i<len; i++) obj.push(bin.readUshort(data, offset+(i<<1))<<1);
		if(ver==1) for(var i=0; i<len; i++) obj.push(bin.readUint  (data, offset+(i<<2))   );
		
		return obj;
	}
};


Typr["T"].maxp = {
	parseTab : function(data, offset, length)
	{
		//console.log(data.length, offset, length);
		
		var bin = Typr["B"], rU=bin.readUshort;
		var obj = {};
		
		// both versions 0.5 and 1.0
		var ver = bin.readUint(data, offset); offset += 4;
		
		obj["numGlyphs"] = rU(data, offset);  offset += 2;
		
		// only 1.0
		/*
		if(ver == 0x00010000) {
			obj.maxPoints             = rU(data, offset);  offset += 2;
			obj.maxContours           = rU(data, offset);  offset += 2;
			obj.maxCompositePoints    = rU(data, offset);  offset += 2;
			obj.maxCompositeContours  = rU(data, offset);  offset += 2;
			obj.maxZones              = rU(data, offset);  offset += 2;
			obj.maxTwilightPoints     = rU(data, offset);  offset += 2;
			obj.maxStorage            = rU(data, offset);  offset += 2;
			obj.maxFunctionDefs       = rU(data, offset);  offset += 2;
			obj.maxInstructionDefs    = rU(data, offset);  offset += 2;
			obj.maxStackElements      = rU(data, offset);  offset += 2;
			obj.maxSizeOfInstructions = rU(data, offset);  offset += 2;
			obj.maxComponentElements  = rU(data, offset);  offset += 2;
			obj.maxComponentDepth     = rU(data, offset);  offset += 2;
		}
		*/
		
		return obj;
	}
};


Typr["T"].name = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var obj = {};
		var format = bin.readUshort(data, offset);  offset += 2;
		var count  = bin.readUshort(data, offset);  offset += 2;
		var stringOffset = bin.readUshort(data, offset);  offset += 2;
		
		//console.log(format,count);
		
		var names = [
			"copyright",
			"fontFamily",
			"fontSubfamily",
			"ID",
			"fullName",
			"version",
			"postScriptName",
			"trademark",
			"manufacturer",
			"designer",
			"description",
			"urlVendor",
			"urlDesigner",
			"licence",
			"licenceURL",
			"---",
			"typoFamilyName",
			"typoSubfamilyName",
			"compatibleFull",
			"sampleText",
			"postScriptCID",
			"wwsFamilyName",
			"wwsSubfamilyName",
			"lightPalette",
			"darkPalette"
		];
		
		var offset0 = offset;
		var rU = bin.readUshort;
		
		for(var i=0; i<count; i++)
		{
			var platformID = rU(data, offset);  offset += 2;
			var encodingID = rU(data, offset);  offset += 2;
			var languageID = rU(data, offset);  offset += 2;
			var nameID     = rU(data, offset);  offset += 2;
			var slen       = rU(data, offset);  offset += 2;
			var noffset    = rU(data, offset);  offset += 2;
			//console.log(platformID, encodingID, languageID.toString(16), nameID, length, noffset);
			
			
			var soff = offset0 + count*12 + noffset;
			var str;
			if(false){}
			else if(platformID == 0) str = bin.readUnicode(data, soff, slen/2);
			else if(platformID == 3 && encodingID == 0) str = bin.readUnicode(data, soff, slen/2);
			else if(platformID == 1 && encodingID ==25) str = bin.readUnicode(data, soff, slen/2);
			else if(encodingID == 0) str = bin.readASCII  (data, soff, slen);
			else if(encodingID == 1) str = bin.readUnicode(data, soff, slen/2);
			else if(encodingID == 3) str = bin.readUnicode(data, soff, slen/2);
			else if(encodingID == 4) str = bin.readUnicode(data, soff, slen/2);
			else if(encodingID == 5) str = bin.readUnicode(data, soff, slen/2);
			else if(encodingID ==10) str = bin.readUnicode(data, soff, slen/2);
			
			else if(platformID == 1) { str = bin.readASCII(data, soff, slen);  console.log("reading unknown MAC encoding "+encodingID+" as ASCII") }
			else {
				console.log("unknown encoding "+encodingID + ", platformID: "+platformID);
				str = bin.readASCII(data, soff, slen);
			}
			
			var tid = "p"+platformID+","+(languageID).toString(16);//Typr._platforms[platformID];
			if(obj[tid]==null) obj[tid] = {};
			obj[tid][names[nameID]] = str;
			obj[tid]["_lang"] = languageID;
			//console.log(tid, obj[tid]);
		}
		/*
		if(format == 1)
		{
			var langTagCount = bin.readUshort(data, offset);  offset += 2;
			for(var i=0; i<langTagCount; i++)
			{
				var length  = bin.readUshort(data, offset);  offset += 2;
				var noffset = bin.readUshort(data, offset);  offset += 2;
			}
		}
		*/
		var out = Typr["T"].name.selectOne(obj), ff="fontFamily";
		if(out[ff]==null) for(var p in obj) if(obj[p][ff]!=null) out[ff]=obj[p][ff];
		return out;
	},
	selectOne :function(obj) {
		//console.log(obj);
		var psn = "postScriptName";
		
		for(var p in obj) if(obj[p][psn]!=null && obj[p]["_lang"]==0x0409) return obj[p];		// United States
		for(var p in obj) if(obj[p][psn]!=null && obj[p]["_lang"]==0x0000) return obj[p];		// Universal
		for(var p in obj) if(obj[p][psn]!=null && obj[p]["_lang"]==0x0c0c) return obj[p];		// Canada
		for(var p in obj) if(obj[p][psn]!=null) return obj[p];
		
		var out;
		for(var p in obj) { out=obj[p]; break; }
		console.log("returning name table with languageID "+ out._lang);
		if(out[psn]==null && out["ID"]!=null) out[psn]=out["ID"];
		return out;
	}
}

Typr["T"].OS2 = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var ver = bin.readUshort(data, offset); offset += 2;
		
		var OS2 = Typr["T"].OS2;
		
		var obj = {};
		if     (ver==0) OS2.version0(data, offset, obj);
		else if(ver==1) OS2.version1(data, offset, obj);
		else if(ver==2 || ver==3 || ver==4) OS2.version2(data, offset, obj);
		else if(ver==5) OS2.version5(data, offset, obj);
		else throw "unknown OS/2 table version: "+ver;
		
		return obj;
	},

	version0 : function(data, offset, obj)
	{
		var bin = Typr["B"];
		obj["xAvgCharWidth"] = bin.readShort(data, offset); offset += 2;
		obj["usWeightClass"] = bin.readUshort(data, offset); offset += 2;
		obj["usWidthClass"]  = bin.readUshort(data, offset); offset += 2;
		obj["fsType"] = bin.readUshort(data, offset); offset += 2;
		obj["ySubscriptXSize"] = bin.readShort(data, offset); offset += 2;
		obj["ySubscriptYSize"] = bin.readShort(data, offset); offset += 2;
		obj["ySubscriptXOffset"] = bin.readShort(data, offset); offset += 2;
		obj["ySubscriptYOffset"] = bin.readShort(data, offset); offset += 2; 
		obj["ySuperscriptXSize"] = bin.readShort(data, offset); offset += 2; 
		obj["ySuperscriptYSize"] = bin.readShort(data, offset); offset += 2; 
		obj["ySuperscriptXOffset"] = bin.readShort(data, offset); offset += 2;
		obj["ySuperscriptYOffset"] = bin.readShort(data, offset); offset += 2;
		obj["yStrikeoutSize"] = bin.readShort(data, offset); offset += 2;
		obj["yStrikeoutPosition"] = bin.readShort(data, offset); offset += 2;
		obj["sFamilyClass"] = bin.readShort(data, offset); offset += 2;
		obj["panose"] = bin.readBytes(data, offset, 10);  offset += 10;
		obj["ulUnicodeRange1"]	= bin.readUint(data, offset);  offset += 4;
		obj["ulUnicodeRange2"]	= bin.readUint(data, offset);  offset += 4;
		obj["ulUnicodeRange3"]	= bin.readUint(data, offset);  offset += 4;
		obj["ulUnicodeRange4"]	= bin.readUint(data, offset);  offset += 4;
		obj["achVendID"] = bin.readASCII(data, offset, 4);  offset += 4;
		obj["fsSelection"]	 = bin.readUshort(data, offset); offset += 2;
		obj["usFirstCharIndex"] = bin.readUshort(data, offset); offset += 2;
		obj["usLastCharIndex"] = bin.readUshort(data, offset); offset += 2;
		obj["sTypoAscender"] = bin.readShort(data, offset); offset += 2;
		obj["sTypoDescender"] = bin.readShort(data, offset); offset += 2;
		obj["sTypoLineGap"] = bin.readShort(data, offset); offset += 2;
		obj["usWinAscent"] = bin.readUshort(data, offset); offset += 2;
		obj["usWinDescent"] = bin.readUshort(data, offset); offset += 2;
		return offset;
	},

	version1 : function(data, offset, obj)
	{
		var bin = Typr["B"];
		offset = Typr["T"].OS2.version0(data, offset, obj);
		
		obj["ulCodePageRange1"] = bin.readUint(data, offset); offset += 4;
		obj["ulCodePageRange2"] = bin.readUint(data, offset); offset += 4;
		return offset;
	},

	version2 : function(data, offset, obj)
	{
		var bin = Typr["B"], rU=bin.readUshort;
		offset = Typr["T"].OS2.version1(data, offset, obj);
		
		obj["sxHeight"]     = bin.readShort(data, offset); offset += 2;
		obj["sCapHeight"]   = bin.readShort(data, offset); offset += 2;
		obj["usDefault"]    = rU(data, offset); offset += 2;
		obj["usBreak"]      = rU(data, offset); offset += 2;
		obj["usMaxContext"] = rU(data, offset); offset += 2;
		return offset;
	},

	version5 : function(data, offset, obj)
	{
		var rU = Typr["B"].readUshort;
		offset = Typr["T"].OS2.version2(data, offset, obj);

		obj["usLowerOpticalPointSize"] = rU(data, offset); offset += 2;
		obj["usUpperOpticalPointSize"] = rU(data, offset); offset += 2;
		return offset;
	}
}

Typr["T"].post = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var obj = {};
		
		obj["version"]            = bin.readFixed(data, offset);  offset+=4;
		obj["italicAngle"]        = bin.readFixed(data, offset);  offset+=4;
		obj["underlinePosition"]  = bin.readShort(data, offset);  offset+=2;
		obj["underlineThickness"] = bin.readShort(data, offset);  offset+=2;

		return obj;
	}
};
Typr["T"].SVG = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var obj = { entries: [], svgs:[]};

		var offset0 = offset;

		var tableVersion = bin.readUshort(data, offset);	offset += 2;
		var svgDocIndexOffset = bin.readUint(data, offset);	offset += 4;
		var reserved = bin.readUint(data, offset); offset += 4;

		offset = svgDocIndexOffset + offset0;

		var numEntries = bin.readUshort(data, offset);	offset += 2;

		for(var i=0; i<numEntries; i++)
		{
			var startGlyphID = bin.readUshort(data, offset);  offset += 2;
			var endGlyphID   = bin.readUshort(data, offset);  offset += 2;
			var svgDocOffset = bin.readUint  (data, offset);  offset += 4;
			var svgDocLength = bin.readUint  (data, offset);  offset += 4;

			var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
			if(sbuf[0]==0x1f && sbuf[1]==0x8b && sbuf[2]==0x08) sbuf = pako["inflate"](sbuf);
			var svg = bin.readUTF8(sbuf, 0, sbuf.length);
			
			for(var f=startGlyphID; f<=endGlyphID; f++) {
				obj.entries[f] = obj.svgs.length;
			}
			obj.svgs.push(svg);
		}
		return obj;
	}
};


Typr["T"].sbix = {
	parseTab : function(data, offset, length, obj)
	{
		var numGlyphs = obj["maxp"]["numGlyphs"];
		var ooff = offset;
		var bin = Typr["B"];
		
		//var ver = bin.readUshort(data,offset);  offset+=2;
		//var flg = bin.readUshort(data,offset);  offset+=2;
		
		var numStrikes = bin.readUint  (data,offset+4);
		
		var out = [];
		for(var si=numStrikes-1; si<numStrikes; si++) {
			var off = ooff+bin.readUint(data,offset+8+si*4);
			
			//var ppem = bin.readUshort(data,off);  off+=2;
			//var ppi  = bin.readUshort(data,off);  off+=2;
			
			for(var gi=0; gi<numGlyphs; gi++) {
				var aoff = bin.readUint(data,off+4+gi*4);
				var noff = bin.readUint(data,off+4+gi*4+4);  if(aoff==noff) {  out[gi]=null;  continue;  }
				var go = off+aoff;
				//var ooX = bin.readUshort(data,go);
				//var ooY = bin.readUshort(data,go+2);
				var tag = bin.readASCII(data,go+4,4);  if(tag!="png ") throw tag;
				
				out[gi] = new Uint8Array(data.buffer, data.byteOffset+go+8, noff-aoff-8);
			}
		}
		return out;
	}
};

Typr["T"].colr = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var ooff=offset;
		offset+=2;
		var num = bin.readUshort(data,offset);  offset+=2;
		
		var boff = bin.readUint(data,offset);  offset+=4;
		var loff = bin.readUint(data,offset);  offset+=4;
		
		var lnum = bin.readUshort(data,offset);  offset+=2;
		//console.log(num,boff,loff,lnum);
		
		var base = {};
		var coff = ooff+boff;
		for(var i=0; i<num; i++) {
			base["g"+bin.readUshort(data,coff)] = [ bin.readUshort(data,coff+2),bin.readUshort(data,coff+4)];
			coff+=6;
		}

		var lays = [];
		coff = ooff+loff;
		for(var i=0; i<lnum; i++) {
			lays.push(bin.readUshort(data,coff), bin.readUshort(data,coff+2));  coff+=4;
		}
		return [base,lays];
	}
};

Typr["T"].cpal = {
	parseTab : function(data, offset, length)
	{
		var bin = Typr["B"];
		var ooff=offset;
		var vsn = bin.readUshort(data,offset);  offset+=2;
		
		if(vsn==0) {
			var ets = bin.readUshort(data,offset);  offset+=2;
			var pts = bin.readUshort(data,offset);  offset+=2;
			var tot = bin.readUshort(data,offset);  offset+=2;
			
			var fst = bin.readUint(data,offset);  offset+=4;
			
			return new Uint8Array(data.buffer,ooff+fst,tot*4);
			/*
			var coff=ooff+fst;
			
			for(var i=0; i<tot; i++) {
				console.log(data[coff],data[coff+1],data[coff+2],data[coff+3]);
				coff+=4;
			}
			
			console.log(ets,pts,tot); */
		}
		else throw vsn;//console.log("unknown color palette",vsn);
	}
};