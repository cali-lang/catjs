/*
 * Copyright 2015 Austin Lehman
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/***********************************************************************
 * catjs.js
 * 
 * Purpose:
 * This collection of JS classes is required by catjs generated 
 * JavaScript and is the foundation for the compiled cali-lang JS code.
 **********************************************************************/

/*
 * win.ca
 */
win_construct = function win() {
	this.extended = [];
	
	this.alert = function(Text) { alert(Text); return this; }
	this.scrollBottom = function() { window.scrollTo(0,document.body.scrollHeight); }
	this.origin = function() { return window.location.origin; }
	this.host = function() { return window.location.host; }
	this.setTimeout = function(CallBackMeth, TimeoutMills)
	{
		window.setTimeout(function()
		{
			CallBackMeth.call();
		}, TimeoutMills);
	}
}
var win = new win_construct();

/*
 * doc.ca
 */
doc_construct = function doc() {
	this.extended = [];
	
	this.create = function(HtmlElStr, Id)
	{
		var el = null;
		if(HtmlElStr === 'text') el = document.createTextNode("");
		else el = document.createElement(HtmlElStr);
		if(typeof el.add === 'undefined') this.applyCaliMeths(el);
		if(Id) { el.set('id', Id); }
		return el;
	}
	
	this.text = function(TextStr)
	{
		var el = document.createTextNode(TextStr);
		if(typeof el.add === 'undefined') this.applyCaliMeths(el);
		return el;
	}
	
	this.get = function(IdStr)
	{
		var el = document.getElementById(IdStr);
		if(el && typeof el !== 'undefined')
		{
			if(typeof el.add === 'undefined') this.applyCaliMeths(el);
			return el;
		}
		else { throw "doc.get(): No element found with id '" + IdStr + "'."; }
	}
	
	this.applyCaliMeths = function(el)
	{
		el.add = function(HtmlEl) { el.appendChild(HtmlEl); return this; };
		el.addHtml = function(HtmlStr) { el.innerHTML += HtmlStr; return this; }
		el.text = function(Text) { el.appendChild(document.createTextNode(Text)); return this; };
		el.br = function() { el.appendChild(document.createElement('br')); return this; }
		el.set = function(Key, Val) { el.setAttribute(Key, Val); return this; }
		el.get = function(Key)
		{
			if(el.hasAttribute(Key)) return el.getAttribute(Key);
			else { throw "Element has no attribute '" + Key + "'."; }
		}
		el.setVal = function(Val) { return el.value = Val; return this; }
		el.getVal = function() { return el.value; }
		el.clear = function() { while (this.firstChild) { this.removeChild(this.firstChild); } return this; }
	}
}
var doc = new doc_construct();

/*
 * lang.ca
 */
lang_construct = function lang() {
	this.extended = [];						// added for cali object consistency
	
	this.count = function(cobj)
	{
		var size = 0;
		if(typeof cobj !== 'undefined' && cobj !== null && cobj.constructor === Array) { size = cobj.length; }
		else if(cobj instanceof calimap) { size = Object.keys(cobj).length; }
		else if(typeof cobj !== 'undefined' && cobj !== null && typeof cobj === 'object') { size = Object.keys(cobj).length; }
		else { throw "LANG.count(): Unknown type suplied, expected map or list."; }
		return size;
	}

	this.itemAtIndex = function(cobj, index)
	{
		var ret = null;
		if(typeof cobj !== 'undefined' && cobj !== null && cobj.constructor === Array)
		{
			if(index >= 0 && index < cobj.length) { ret = cobj[index]; }
			else { throw "LANG.itemAtIndex(): Index out of bounds exception."; }
		}
		else if(typeof cobj !== 'undefined' && cobj !== null && typeof cobj === 'object')
		{
			var keys = Object.keys(cobj);
			if(index >= 0 && index < keys.length) { ret = keys[index]; }
			else { throw "LANG.itemAtIndex(): Index out of bounds exception."; }
		}
		else { /* TODO: throw exception here! */ }
		return ret;
	}

	this.type = function(cobj)
	{
		if(cobj === null) return 'null';
		else if(typeof cobj  === 'number' && cobj%1 === 0 && !isNaN(cobj) && isFinite(cobj)) return 'int';
		else if(typeof cobj === 'number' && !isNaN(cobj) && isFinite(cobj)) return 'double';
		else if(typeof cobj === 'boolean') return 'bool';
		else if(typeof cobj === 'string') return 'string';
		else if(Array.isArray(cobj)) return 'list';
		else if(typeof cobj === 'object' && !cobj.hasOwnProperty('extended')) return 'map';
		else if(typeof cobj === 'object' && cobj.hasOwnProperty('extended')) { return cobj.constructor.name; }
		else return null;
	}

	this.instanceof = function(cobj, Name)
	{
		if(cobj != null && typeof cobj === 'object' && cobj.hasOwnProperty('extended'))
		{
			if(this.type(cobj) === Name) return true;
			else
			{
				for(var i = 0; i < cobj.extended.length; i++)
				{
					var tp = cobj.extended[i];
					if(tp === Name) return true;
				}
				return false;
			}
		}
		else
		{
			var tp = this.type(cobj);
			if(tp === Name) return true;
			else return false;
		}
	}
	
	this.call = function()
	{
		var tarr = Array.prototype.slice.call(arguments);
		var fargs = tarr.slice(1);
		if(tarr.length > 0)
		{
			var cb = tarr[0];
			if(this.instanceof(cb, 'callback'))
			{
				return cb.call.apply(cb, fargs);
			}
			else throw "lang.call(): Expecting first argument to be of type 'callback'.";
		}
		else throw "lang.call(): Expecting at least a callback argument.";
	}
}
var lang = new lang_construct();

calimap = function calimap() {
	/* this.add = function(key, val) { this[key] = val; return this; } */
}

int_construct = function int() {
	this.extended = [];
	
	// js has precision of 53 bits and numbers stored as floating vals (2^53 - 1)
	this.maxVal = function() { return 9007199254740991; }
	this.minVal = function() { return -9007199254740991; }
	this.toDouble = function(IntVal) { return IntVal; }
	this.toBool = function(IntVal) { if(IntVal === 0) { return false; } return true; }
	this.toString = function(IntVal) { return (Math.round(IntVal)).toString(); }
	this.compare = function(Val1, Val2)
	{
		if(Val1 === Val2) return 0;
		if(Val1 < Val2) return -1;
		else return 1;
	}
	this.numLeadingZeros = function(Val) { throw "int.numLeadingZeros(): Not implemented."; }
	this.numTrailingZeros = function(Val) { throw "int.numTrailingZeros(): Not implemented."; }
	this.parse = function(Val)
	{
		var val = parseInt(Val);
		if(val === null || isNaN(val)) { throw "int.parse(): Integer parse exception."; }
		return val;
	}
	this.reverse = function(Val) { throw "int.reverse(): Not implemented."; }
	this.reverseBytes = function(Val) { throw "int.reverseBytes(): Not implemented."; }
	this.rotateLeft = function(Val) { throw "int.rotateLeft(): Not implemented."; }
	this.rotateRight = function(Val) { throw "int.rotateRight(): Not implemented."; }
	this.signum = function(Val) { return Val > 0 ? 1 : Val < 0 ? -1 : 0; }
	this.toBinary = function(Val) { return (Val >>> 0).toString(2); }
	this.toHex = function(Val) { return Val.toString(16); }
	this.toOctal = function(Val) { return Val.toString(8); }
}
var int = new int_construct();

bool_construct = function bool() {
	this.extended = [];
	
	this.toInt = function(Val) { if(Val) { return 1; } return 0; }
	this.toDouble = function(Val) { if(Val) { return 1.0; } return 0.0; }
	this.toString = function(Val) { if(Val) { return 'true'; } return 'false'; }
	this.compare = function(Val1, Val2) { if(Val1 === Val2) { return 0; } else if(!Val1 && Val2) { return -1; } return 1; }
	this.parse = function(Val) { var tmp = Val.trim().toLowerCase(); if(tmp === 'true') { return true; } else if(tmp === 'false') { return false; } else throw "bool.parse(): Boolean parse exception."; }
}
var bool = new bool_construct();

double_construct = function double() {
	this.extended = [];
	
	this.maxExp = function() { throw "double.maxExp(): Not implemented."; }
	this.minExp = function() { throw "double.minExp(): Not implemented."; }
	this.maxVal = function() { return Number.MAX_VALUE; }
	this.minVal = function() { return Number.MIN_VALUE; }
	this.minNormal = function() { throw "double.minNormal(): Not implemented."; }
	this.nanVal = function() { return Number.NaN.toString(); }
	this.nan = function() { return Number.NaN; }
	this.negInfinity = function() { return Number.NEGATIVE_INFINITY; }
	this.posInfinity = function() { return Number.POSITIVE_INFINITY; }
	this.size = function() { return 53.0; }
	this.toInt = function(Val) { return Math.round(Val); }
	this.toBool = function(Val) { if(Val === 0.0) { return false; } return true; }
	this.toString = function(Val) { return Val.toString(); }
	this.compare = function(Val1, Val2) { if(Val1 === Val2) { return 0.0; } else if(Val1 > Val2) { return 1.0; } return -1; }
	this.isInfinite = function(Val) { return !isFinite(Val); }
	this.isNan = function(Val) { return isNaN(Val); }
	this.parse = function(Val)
	{
		var val = parseFloat(Val);
		if(val === null || isNaN(val)) { throw "double.parse(): Integer parse exception."; }
		return val;
	}
	this.toHex = function(Val) { throw "double.toHex(): Not implemented."; }
}
var double = new double_construct();

string_construct = function string() {
	this.extended = [];
	
	this.charAt = function(Str, Index) { if(Index >= 0 && Index < Str.length) { return Str.charAt(Index); } throw "string.charAt(): Index out of bounds."; }
	this.codePointAt = function(Str, Index) { if(Index >= 0 && Index < Str.length) { return Str.charCodeAt(Index); } throw "string.codePointAt(): Index out of bounds."; }
	this.codePointBefore = function(Str, Index) { if(Index-1 >= 0 && Index-1 < Str.length) { return Str.charCodeAt(Index-1); } throw "string.codePointBefore(): Index out of bounds."; }
	this.codePointCount = function(Str, Begin, End)
	{
		if(Begin <= End)
		{
			if(Begin >= 0 && Begin < Str.length)
			{
				if(End >= 0 && End < Str.length)
				{
					return End - Begin;
				}
				throw "string.codePointBefore(): End index out of bounds.";
			}
			throw "string.codePointBefore(): Begin index out of bounds.";
		}
		throw "string.codePointBefore(): Begin index is greater than end index.";
	}
	this.compare = function(Val1, Val2) { if(Val1 === Val2) { return 0; } else if(Val1 > Val2) { return 1; } return -1; }
	this.compareICase = function(Val1, Val2) { if(Val1.toLowerCase() === Val2.toLowerCase()) { return 0; } else if(Val1.toLowerCase() > Val2.toLowerCase()) { return 1; } return -1; }
	this.concat = function(Val1, Val2) { return Val1 + Val2; }
	this.contains = function(Haystack, Needle) { if(Haystack.indexOf(Needle) > -1) { return true; } return false; }
	this.endsWith = function(Haystack, Needle) { return Haystack.indexOf(Needle, Haystack.length - Needle.length) !== -1; }
	this.equals = function(Val1, Val2) { if(Val1 === Val2) { return true; } return false; }
	this.equalsICase = function(Val1, Val2) { if(Val1.toLowerCase() === Val2.toLowerCase()) { return true; } return false; }
	this.indexOf = function(Haystack, Needle) { return Haystack.indexOf(Needle); }
	this.indexOfStart = function(Haystack, Needle, Start) { return Haystack.indexOf(Needle, Start); }
	this.isEmpty = function(Val) { if(Val.length === 0) { return true; } return false; }
	this.lastIndexOf = function(Haystack, Needle) { return Haystack.lastIndexOf(Needle); }
	this.lastIndexOfStart = function(Haystack, Needle, Start) { return Haystack.lastIndexOf(Needle, Start); }
	this.length = function(Val) { return Val.length; }
	this.matches = function(Val, RegexStr) { throw "string.matches(): Not implemented."; }
	this.replace = function(Val, Find, Replace) { return Val.replace(Find, Replace); }
	this.replaceFirstRegex = function(Str, Regex, Replace) { throw "string.replaceFirstRegex(): Not implemented."; }
	this.replaceRegex = function(Str, Regex, Replace) { throw "string.replaceRegex(): Not implemented."; }
	this.explode = function(Str, Delim) { return Str.split(Delim); }
	this.implode = function(Parts, Glue) { return Parts.join(Glue); }
	this.startsWith = function(Str, Prefix) { var pos = pos || 0; return Str.indexOf(Prefix, pos) === pos; }
	this.substr = function(Str, Begin, End)
	{
		if(!End) { End = Str.length; }
		if(Begin <= End)
		{
			var tlen = End - Begin;
			if(Begin >= 0 && Begin <= Str.length)
			{
				if(End >= 0 && End <= Str.length)
				{
					return Str.substr(Begin, tlen);
				}
				throw "string.substr(): End index out of bounds.";
			}
			throw "string.substr(): Begin index out of bounds.";
		}
		throw "string.substr(): Begin index is greater than end index.";
	}
	this.toLower = function(Val) { return Val.toLowerCase(); }
	this.toUpper = function(Val) { return Val.toUpperCase(); }
	this.trim = function(Val) { return Val.trim(); }
}
var string = new string_construct();

list_construct = function list() {
	this.extended = [];
	
	this.create = function() { return []; }
	this.add = function(AList, Item) { AList.push(Item); return null; }
	this.addAll = function(AList, LToAdd) { AList.push.apply(AList, LToAdd); return null; }
	this.addAllAt = function(AList, LToAdd, Index)
	{
		if(Index >= 0 && Index < AList.length)
		{
			AList.splice.apply(AList, [Index, 0].concat(LToAdd));
		}
		else throw "list.addAllAt(): Index out of bounds.";
		return null;
	}
	this.clear = function(AList) { AList.length = 0; return null;}
	this.clone = function(AList) { return AList.slice(0); return null;}
	this.contains = function(AList, Item) { if(AList.indexOf(Item) !== -1) { return true; } return false; }
	this.containsObjRef = function(AList, Item) { if(AList.indexOf(Item) !== -1) { return true; } return false; }
	this.get = function(AList, Index)
	{
		if(Index >= 0 && Index < AList.length)
		{
			return AList[Index];
		}
		else throw "list.get(): Index out of bounds.";
		return null;
	}
	this.indexOf = function(AList, Item) { return AList.indexOf(Item); }
	this.isEmpty = function(AList) { if(AList.length === 0) { return true; } return false; }
	this.remove = function(AList, Item)
	{
		if(this.contains(AList, Item))
		{
			var ind = AList.indexOf(Item);
			AList.splice(ind, 1);
		}
		else throw "list.remove(): Item not found in list.";
		return null;
	}
	this.removeAt = function(AList, Index)
	{
		if(Index >= 0 && Index < AList.length)
		{
			return AList.splice(Index, 1);
		}
		else throw "list.removeAt(): Index out of bounds.";
		return null;
	}
	this.removeAll = function(AList, ListToRemove)
	{
		var found = true;
		while(found)
		{
			found = false;
			for(var i = 0; i < AList.length; i++)
			{
				if(this.contains(ListToRemove, AList[i]))
				{
					this.removeAt(AList, i);
					found = true;
					break;
				}
			}
		}
		return null;
	}
	this.retainAll = function(AList, ListToRetain)
	{
		var found = true;
		while(found)
		{
			found = false;
			for(var i = 0; i < AList.length; i++)
			{
				if(!this.contains(ListToRetain, AList[i]))
				{
					this.removeAt(AList, i);
					found = true;
					break;
				}
			}
		}
		return null;
	}
	this.set = function(AList, Index, Item)
	{
		if(Index >= 0 && Index < AList.length)
		{
			AList[Index] = Item;
		}
		else throw "list.set(): Index out of bounds.";
		return null;
	}
	this.size = function(AList) { return AList.length; }
	this.subList = function(AList, Begin, End)
	{
		if(Begin <= End)
		{
			var tlen = End - Begin;
			if(Begin >= 0 && Begin <= AList.length)
			{
				if(End >= 0 && End <= AList.length)
				{
					var tl = this.clone(AList);
					return tl.slice(Begin, End);
				}
				throw "list.subList(): End index out of bounds.";
			}
			throw "list.subList(): Begin index out of bounds.";
		}
		throw "list.subList(): Begin index is greater than end index.";
		return null;
	}
	this.sort = function(AList) { return AList.sort(function(a, b) { return b < a; }); }
	this.sortAsc = function(AList) { return AList.sort(function(a, b) { return b > a; }); }
	this.sortCustom = function(AList, CallbackOnCompare)
	{
		if(lang.type(CallbackOnCompare) == 'callback')
		{
			return AList.sort(CallbackOnCompare.method);
		}
		else throw "list.sortCustom(): Expecting second argument to be of type 'callback' but found '" + lang.type(CallbackOnCompare) + "' instead.";
	}
}
var list = new list_construct();

map_construct = function map() {
	this.extended = [];
	
	this.create = function() { return new calimap(); }
	this.clear = function(AMap) { for (prop in AMap) { if (AMap.hasOwnProperty(prop)) { delete AMap[prop]; } } return null; }
	this.containsKey = function(AMap, Key) { if(AMap.hasOwnProperty(Key)) { return true; } return false; }
	this.containsVal = function(AMap, Val) { for(var prop in AMap) { if(AMap.hasOwnProperty(prop)) { if(AMap[prop] === Val) { return true; } } } }
	this.get = function(AMap, Key)
	{
		if(this.containsKey(AMap, Key)) { return AMap[Key]; }
		else throw "map.get(): Map has no key '" + Key + "'.";
		return null;
	}
	this.isEmpty = function(AMap) { if(lang.count(AMap) == 0) { return true; } return false; }
	this.keySet = function(AMap) { return Object.keys(AMap); }
	this.put = function(AMap, Key, Val) { AMap[Key] = Val; return AMap; }
	this.putAll = function(AMap, MapToAdd) { for (var Key in MapToAdd) { AMap[Key] = MapToAdd[Key]; } return AMap; }
	this.putIfAbsent = function(AMap, Key, Val) { if(!this.containsKey(AMap, Key)) { AMap[Key] = Val; } return AMap; }
	this.remove = function(AMap, Key)
	{
		if(this.containsKey(AMap, Key)) { delete AMap[Key]; }
		else throw "map.remove(): Map has no key '" + Key + "'.";
		return null;
	}
	this.size = function(AMap) { return lang.count(AMap); }
	this.values = function(AMap)
	{
		var arr = [];
		for(var Key in AMap) { arr.push(AMap[Key]); }
		return arr;
	}
}
var map = new map_construct();
	

/*
 * except class
 */
except = function except() {
	this.extended = [];
	this.message = '';
	this.trace = '';
	
	this.except = function(Message) {
		if(lang.instanceof(Message, 'string')) this.message = Message;
		var err = new Error();
		err.message = this.message;
		this.trace = err.valueOf();
	}
	
	this.getMessage = function() { return this.message; }
	this.getTrace = function() { return this.trace; }
	this.getStackTrace = function() { return this.trace; }
	this.setMessage = function(Message) { if(lang.instanceof(Message, 'string')) { this.message = Message; } return this; }
	this.setTrace = function(Trace) { if(lang.instanceof(Trace, 'string')) { this.trace = Trace; } return this; }
	this.toString = function() { return this.trace; }
	
	this.except.apply(this, arguments);
};

/*
 * callback class
 */
callback = function callback() {
	this.extended = [];
	this.object = null;
	this.method = null;
	
	this.callback = function(Obj, Meth) {
		if(!lang.type(Obj)) throw "callback.callback(): Provided object is null.";
		else if(typeof Meth !== 'function') throw "callback.callback(): Provided method is not a function.";
		this.object = Obj;
		this.method = Meth;
	}
	
	this.getObject = function() { return this.object; }
	this.getMethod = function() { return this.method; }
	this.setObject = function(Obj)
	{
		if(!lang.type(Obj)) throw "callback.callback(): Provided object is null.";
		this.object = Obj; return this;
	}
	this.setMethod = function(Meth)
	{
		if(typeof Meth !== 'function') throw "callback.callback(): Provided method is not a function.";
		this.method = Meth; return this;
	}
	
	this.call = function()
	{
		return this.method.apply(this.object, arguments);
	}
	
	this.callback.apply(this, arguments);
};

/*
 * console.ca
 */
ccolor_construct = function ccolor() {
	this.extended = [];
	this.black = '';
	this.white = '';
	this.red = '';
	this.blue = '';
	this.green = '';
	this.yellow = '';
	this.cyan = '';
	this.magenta = '';
}
var ccolor = ccolor_construct();

var js_console = console;
console_construct = function console() {
	this.extended = [];
	
	this.getArgs = function()
	{
		var args = Array.prototype.slice.call(arguments[0], 0);
		return args.join("");
	}
	
	this.log = function() { js_console.log(this.getArgs(arguments)); }
	
	this.print = function() { this.log.apply(this, arguments); }
	this.println = function() { this.log.apply(this, arguments); }
	this.err = function() { js_console.error(this.getArgs(arguments)); }
	this.warn = function() { js_console.warn(this.getArgs(arguments)); }
	this.info = function() { js_console.info(this.getArgs(arguments)); }
	this.notImp = function(ObjAndMethName) { js_console.warn('[catjs] ' + ObjAndMethName + ' not implemented.'); }
	
	// these guys aren't implemented ... doesn't fit in js model
	this.clearScreen = function() { this.notImp('console.clearScreen()'); }
	this.clearLine = function() { this.notImp('console.clearLine()'); }
	this.scrollUp = function() { this.notImp('console.scrollUp()'); }
	this.scrollDown = function() { this.notImp('console.scrollDown()'); }
	this.setColor = function() { this.notImp('console.setColor()'); }
	this.setBgColor = function() { this.notImp('console.setBgColor()'); }
	this.setColorBright = function() { this.notImp('console.setColorBright()'); }
	this.setBgColorBright = function() { this.notImp('console.setBgColorBright()'); }
	this.bold = function() { this.notImp('console.bold()'); }
	this.boldOff = function() { this.notImp('console.boldOff()'); }
	this.faint = function() { this.notImp('console.faint()'); }
	this.italic = function() { this.notImp('console.italic()'); }
	this.italicOff = function() { this.notImp('console.italicOff()'); }
	this.underline = function() { this.notImp('console.underline()'); }
	this.underlineDouble = function() { this.notImp('console.underlineDouble()'); }
	this.underlineOff = function() { this.notImp('console.underlineOff()'); }
	this.blink = function() { this.notImp('console.blink()'); }
	this.blinkFast = function() { this.notImp('console.blinkFast()'); }
	this.blinkOff = function() { this.notImp('console.blinkOff()'); }
	this.negative = function() { this.notImp('console.negative()'); }
	this.negativeOff = function() { this.notImp('console.negativeOff()'); }
	this.conceal = function() { this.notImp('console.conceal()'); }
	this.concealOff = function() { this.notImp('console.concealOff()'); }
	this.strikethrough = function() { this.notImp('console.strikethrough()'); }
	this.strikethroughOff = function() { this.notImp('console.strikethroughOff()'); }
	this.reset = function() { this.notImp('console.reset()'); }
}
console = new console_construct();		// instantiate lang

/*
 * sys.ca
 */
sys_construct = function sys() {
	this.extended = [];
	
	this.print = function() { console.log.apply(console, arguments); return this; }
	this.println = function() { console.log.apply(console, arguments); return this; }
	
	this.fxCapable = function() { return false; }
	
	this.getAssemblyPath = function() { return ''; }
	this.getCurrentPath = function() { return ''; }
	this.getMainFilePath = function() { return ''; }
	this.getHomePath = function() { return ''; }
	this.getUserName = function() { return ''; }
	
	this.getOsArch = function() { return ''; }
	this.getOsName = function() { return navigator.platform; }
	this.getOsVersion = function() { return navigator.appVersion; }
	
	this.getJavaVersion = function() { return navigator.appName; }
	this.getJavaVendor = function() { return navigator.vendor; }
	this.getJavaVendorUrl = function() { return ''; }
	this.getJavaClassPath = function() { return ''; }
	
	this.getFileSeparator = function() { return ''; }
	this.getLineSeparator = function() { return ''; }
	
	this.getCaliVersion = function() { return '0.93a'; }
	
	this.getJavaHome = function() { return ''; }
	
	this.getSysInfo = function()
	{
		rstr = 'OS Information\n';
		rstr += '\tOS Name: ' + this.getOsName() + '\n';
		rstr += '\tOS Version: ' + this.getOsVersion() + '\n';
		rstr += '\n';
		rstr += 'App Information\n';
		rstr += '\tApp Name: ' + this.getJavaVersion() + '\n';
		rstr += '\tApp Vendor: ' + this.getJavaVendor() + '\n';
		return rstr;
	}
	
	this.readln = function() { console.notImp('sys.exit()'); }
	this.getMills = function() { return (new Date()).getTime(); }
	
	this.sleep = function(mills)	// generally this shouldn't be used :)
	{
		var start = new Date().getTime();
		for(var i = 0; i < 1e7; i++)
		{
			if ((new Date().getTime() - start) > mills) { break; }
		}
		return this;
	}
	this.exit = function(code) { console.notImp('sys.exit()'); }
	this.restart = function() { console.notImp('sys.restart()'); }
	
	this.exec = function() { console.notImp('sys.exec()'); }
}
var sys = new sys_construct();

/*
 * url.ca
 */
var url = function url() {
	this.extended=[];
	
	this.host = null;
	
	this.url = function(Host)
	{	
		this.host = document.createElement('a');
		this.host.href = Host;
	};
	
	this.getAuthority = function() { js_console.warn('[catjs] ' + ObjAndMethName + ' not implemented.'); return null; };
	this.getDefaultPort = function() { return this.host.port; };
	this.getFile = function() { js_console.warn('[catjs] ' + ObjAndMethName + ' not implemented.'); return null; };
	this.getHost = function() { return this.host.hostname; };
	this.getPath = function() { return this.host.pathname; };
	this.getPort = function() { return this.host.port; };
	this.getProtocol = function() { return this.host.protocol; }
	this.getQuery = function() { return this.host.search; }
	this.getRef = function() { js_console.warn('[catjs] ' + ObjAndMethName + ' not implemented.'); return null; };
	this.getUserInfo = function() { js_console.warn('[catjs] ' + ObjAndMethName + ' not implemented.'); return null; };
	this.toString = function() { return this.host.href; }

	this.url.apply(this, arguments);
};

/*
 * httpClient.ca postType
 */
postType_construct = function postType() {
	this.extended = [];
	this.url_encoded = 'url_encoded';
	this.multipart = 'multipart';
	this.custom = 'custom';
}
var postType = new postType_construct();

/*
 * httpClient.ca httpClient
 */
var httpClient = function httpClient() {
	this.extended = [];
	this.herq = null;
	this.urlobj = null;
	this.timer = null;
	this.timeoutMills = 0;
	
	this.httpClient = function(UrlObj)
	{
		this.urlobj = UrlObj;
	};
	
	/*
	 * The 3 timeout methods are implemented for standard cali-lang
	 * compatability but there's only a single timeout for web request.
	 */
	this.setConnectionRequestTimeout = function (TimeoutMills)
	{
		if(TimeoutMills >= 0) { this.timeoutMills = TimeoutMills; }
		else throw "httpClient.setConnectionRequestTimeout(): Number of milliseconds cannot be less than 0.";
	};
	this.setConnectTimeout = function (TimeoutMills)
	{
		if(TimeoutMills >= 0) { this.timeoutMills = TimeoutMills; }
		else throw "httpClient.setConnectTimeout(): Number of milliseconds cannot be less than 0.";
	};
	this.setSocketTimeout = function (TimeoutMills)
	{
		if(TimeoutMills >= 0) { this.timeoutMills = TimeoutMills; }
		else throw "httpClient.setSocketTimeout(): Number of milliseconds cannot be less than 0.";
	};
	this.getConnectionRequestTimeout = function() { return this.timeoutMills; };
	this.getConnectTimeout = function() { return this.timeoutMills; };
	this.getSocketTimeout = function() { return this.timeoutMills; };
	
	this.onTimeout = function()
	{
		clearTimeout(this.timer);
		this.timer = null;
		if(this.hreq != null) this.hreq.abort();
	};
	
	this.getString = function()
	{
		this.hreq = new XMLHttpRequest();
		// method, url, async
		this.hreq.open("GET", this.urlobj.toString(), false);
		if(this.timeoutMills !== 0) { this.timer = setInterval(this.onTimeout, this.timeoutMills); }
		this.hreq.send();
		if(this.timeoutMills !== 0) { clearTimeout(this.timer); this.timer = null; }
		resp = {};
		resp['statusCode'] = this.hreq.status;
		resp['content'] = this.hreq.responseText;
		resp['headers'] = new calimap();
		var lines = string.explode(this.hreq.getAllResponseHeaders(), "\n");
		for(var i = 0; i < lines.length; i++)
		{
			var pair = string.explode(lines[i], ":");
			if(pair.length == 2) { resp['headers'][string.trim(pair[0])] = string.trim(pair[1]); }
		}
		return resp;
	};
	
	this.postString = function(PostType, DataToPost, ContentType)
	{
		this.hreq = new XMLHttpRequest();
		// method, url, async
		this.hreq.open("POST", this.urlobj.toString(), false);
		if(this.timeoutMills !== 0) { this.timer = setInterval(this.onTimeout, this.timeoutMills); }
		if(ContentType !== null && ContentType !== 'undefined') { this.hreq.setRequestHeader('Content-Type', ContentType); }
		this.hreq.send(DataToPost);
		if(this.timeoutMills !== 0) { clearTimeout(this.timer); this.timer = null; }
		resp = {};
		resp['statusCode'] = this.hreq.status;
		resp['content'] = this.hreq.responseText;
		resp['headers'] = new calimap();
		var lines = string.explode(this.hreq.getAllResponseHeaders(), "\n");
		for(var i = 0; i < lines.length; i++)
		{
			var pair = string.explode(lines[i], ":");
			if(pair.length == 2) { resp['headers'][string.trim(pair[0])] = string.trim(pair[1]); }
		}
		return resp;
	};
	
	this.httpClient.apply(this, arguments);
};

/*
 * json.ca json
 */
json_construct = function json() {
	this.extended = [];
	
	this.parseString = function(Str)
	{
		var tmp = JSON.parse(Str);
		if(lang.instanceof(tmp, 'map')) { return this.parseMap(tmp); }
		else if(lang.instanceof(tmp, 'list')) { return this.parseList(tmp); }
		else throw "json.parseString(): Invalid JSON string provided.";
	}
	this.toString = function(Jnode)
	{
		if(lang.type(Jnode, 'jnode')) { return Jnode.toString(); }
		else throw "json.toString(): Provided object isn't of type 'jnode'.";
	}
	this.saveFile = function(FileName, JnodeObject) { throw "json.saveFile(): Not implemented."; }
	this.parseFile = function(FileName) { throw "json.parseFile(): Not implemented."; }
	this.pack = function(Obj) { throw "json.pack(): Not implemented."; }
	this.unpack = function(JsonString) { throw "json.unpack(): Not implemented."; }
	
	/* helpers */
	this.parseMap = function(MapObj)
	{
		var jn = new jnode();
		var keys = map.keySet(MapObj);
		var mcount = lang.count(MapObj);
		for(var i = 0; i < mcount; i++)
		{
			var key = keys[i];
			var val = MapObj[key];
			if(lang.instanceof(val, 'map')) { jn.put(key, this.parseMap(val)); }
			else if(lang.instanceof(val, 'list')) { jn.put(key, this.parseList(val)); }
			else { jn.put(key, val); }
		}
		return jn;
	}
	this.parseList = function(ListObj)
	{
		var ja = new jarray();
		var mcount = lang.count(ListObj);
		for(var i = 0; i < mcount; i++)
		{
			var val = ListObj[i];
			if(lang.instanceof(val, 'map')) { ja.put(this.parseMap(val)); }
			else if(lang.instanceof(val, 'list')) { ja.put(this.parseList(val)); }
			else { ja.put(val); }
		}
		return ja;
	}
}
var json = new json_construct();

/*
 * json.ca jnode
 */
var jnode = function jnode() {
	this.extended = [];
	
	this.items = new calimap();
	
	this.jnode = function() { };
	this.put = function(Key, Value)
	{
		if(lang.instanceof(Value, 'map')) { this.items[Key] = json.parseMap(Value); }
		else if(lang.instanceof(Value, 'list')) { this.items[Key] = json.parseList(Value); }
		else { this.items[Key] = Value; }
		return this;
	};
	this.keySet = function() { return map.keySet(this.items); };
	this.get = function(Key)
	{
		if(map.containsKey(this.items, Key)) { return this.items[Key]; }
		else throw "jnode.get(): Key '" + Key + "' not found.";
	};
	this.geton = function(Key)
	{
		if(map.containsKey(this.items, Key)) { return this.items[Key]; }
		else return null;
	};
	this.getCali = function()
	{
		var mp = new calimap();
		
		var keys = map.keySet(this.items);
		var icnt = lang.count(this.items);
		for(var i = 0; i < icnt; i++)
		{
			var key = keys[i];
			var val = this.items[key];
			if(lang.instanceof(val, 'jnode') || lang.instanceof(val, 'jarray')) { mp[key] = val.getCali(); }
			else mp[key] = val;
		}
		
		return mp;
	};
	this.isArray = function() { return false; };
	this.toString = function() { return JSON.stringify(this.getCali(this.items)); };
	
	this.jnode.apply(this, arguments);
};

/*
 * json.ca jarray
 */
var jarray = function jarray() {
	this.extended = [];
	
	this.items = [];
	
	this.jarray = function() { };
	this.put = function(Value)
	{
		if(lang.instanceof(Value, 'map')) { this.items.push(json.parseMap(Value)); }
		else if(lang.instanceof(Value, 'list')) { this.items.push(json.parseList(Value)); }
		else { this.items.push(Value); }
		return this;
	};
	this.size = function() { return lang.count(this.items); };
	this.get = function(Index) { return this.items[Index]; };
	this.getCali = function()
	{
		var lst = [];
		
		var icnt = lang.count(this.items);
		for(var i = 0; i < icnt; i++)
		{
			var val = this.items[i];
			if(lang.instanceof(val, 'jnode') || lang.instanceof(val, 'jarray')) { lst.push(val.getCali()); }
			else lst.push(val);
		}
		
		return lst;
	};
	this.isArray = function() { return true; };
	this.toString = function() { return JSON.stringify(this.getCali(this.items)); };
	
	this.jarray.apply(this, arguments);
};

/*
 * wsClient.ca
 */
msgType_construct = function msgType() {
	this.extended = [];
	this.tstring = 'tstring';
	this.tbinary = 'tbinary';
}
var msgType = new msgType_construct();

var wsClient = function wsClient() {
	var self = this;
	
	this.extended = [];
	this.ws = null;
	
	this.onOpen = null;
	this.onClose = null;
	this.onMessage = null;
	this.onError = null;
	
	this.wsClient = function() { };
	
	this.open = function(UriString)
	{
		if(lang.instanceof(UriString, 'string'))
		{
			this.ws = new WebSocket(UriString);
			this.ws.onopen = this.handleOnOpen;
			this.ws.onclose = this.handleOnClose;
			this.ws.onmessage = this.handleOnMessage;
			this.ws.onerror = this.handleOnError;
		}
		else { throw "wsClient.open(): Expecting UriString to be of type 'string' but found '" + lang.type(UriString) + "' instead."; }
	};
	
	this.setOnOpen = function(OnOpen)
	{
		if(lang.instanceof(OnOpen, 'callback')) { this.onOpen = OnOpen; }
		else if(lang.instanceof(OnOpen, 'null')) { this.onOpen = null; }
		else { throw "wsClient.setOnOpen(): Expecting a callback object."; }
		return this;
	};
	
	this.setOnClose = function(OnClose)
	{
		if(lang.instanceof(OnClose, 'callback')) { this.onClose = OnClose; }
		else if(lang.instanceof(OnClose, 'null')) { this.onClose = null; }
		else { throw "wsClient.setOnClose(): Expecting a callback object."; }
		return this;
	};
	
	this.setOnMessage = function(OnMessage)
	{
		if(lang.instanceof(OnMessage, 'callback')) { this.onMessage = OnMessage; }
		else if(lang.instanceof(OnMessage, 'null')) { this.onMessage = null; }
		else { throw "wsClient.setOnMessage(): Expecting a callback object."; }
		return this;
	};
	
	this.setOnError = function(OnError)
	{
		if(lang.instanceof(OnError, 'callback')) { this.onError = OnError; }
		else if(lang.instanceof(OnError, 'null')) { this.onError = null; }
		else { throw "wsClient.setOnError(): Expecting a callback object."; }
		return this;
	};
	
	this.send = function(StrOrBuff)
	{
		this.ws.send(StrOrBuff);
		return this;
	};
	
	this.close = function() { this.ws.close(); };
	
	this.handleOnOpen = function()
	{
		if(self.onOpen !== null) { self.onOpen.call(); }
	};
	
	this.handleOnClose = function()
	{
		if(self.onClose !== null) { self.onClose.call(); }
	};
	
	this.handleOnMessage = function(event)
	{
		if(self.onMessage !== null)
		{
			var mt = msgType.tstring;
			if(typeof event.data !== "string") { mt = msgType.tbinary; }
			self.onMessage.call(event.data, mt);
		}
	};
	
	this.handleOnError = function(err)
	{
		if(self.onError !== null) { self.onError.call(err); }
	};
	
	this.wsClient.apply(this, arguments);
};

/*
 * regex.ca
 */
regex_construct = function regex() {
	this.extended = [];
	
	this.match = function(RegexStr, Haystack)
	{
		var regx = new RegExp(RegexStr, 'g');
		//var ret = regx.exec(Haystack);
		var ret = [];
		var mtch = null;
		while((mtch = regx.exec(Haystack)))
		{
			ret.push(mtch[0]);
		}
		if(lang.instanceof(ret, 'list')) { return ret; }
		else { return []; }
	}
	
	this.matchFirst = function(RegexStr, Haystack)
	{
		var lst = this.match(RegexStr, Haystack);
		if(lang.count(lst) > 0) { return lst[0]; }
		else { return null; }
	}
	
	this.matchLast = function(RegexStr, Haystack)
	{
		var lst = this.match(RegexStr, Haystack);
		if(lang.count(lst) > 0) { return lst[lang.count(lst) - 1]; }
		else { return null; }
	}
	
	this.replace = function(RegexStr, ReplaceStr, Haystack)
	{
		var regx = new RegExp(RegexStr, 'g');
		var ret = Haystack.replace(regx, ReplaceStr);
		return ret;
	}
	
	this.replaceFirst = function(RegexStr, ReplaceStr, Haystack)
	{
		var regx = new RegExp(RegexStr);
		var ret = Haystack.replace(regx, ReplaceStr);
		return ret;
	}
}
var regex = new regex_construct();


