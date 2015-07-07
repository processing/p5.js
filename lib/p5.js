(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.p5 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2014
  * https://github.com/ded/reqwest
  */

!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , httpsRe = /^http/
    , protocolRe = /(^\w+):\/\//
    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          'contentType': 'application/x-www-form-urlencoded'
        , 'requestedWith': xmlHttpRequest
        , 'accept': {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , 'xml':  'application/xml, text/xml'
            , 'html': 'text/html'
            , 'text': 'text/plain'
            , 'json': 'application/json, text/javascript'
            , 'js':   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o['crossOrigin'] === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function succeed(r) {
    var protocol = protocolRe.exec(r.url);
    protocol = (protocol && protocol[1]) || window.location.protocol;
    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
  }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (succeed(r)) success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o['headers'] || {}
      , h

    headers['Accept'] = headers['Accept']
      || defaultHeaders['accept'][o['type']]
      || defaultHeaders['accept']['*']

    var isAFormData = typeof FormData === 'function' && (o['data'] instanceof FormData);
    // breaks cross-origin requests with legacy browsers
    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials']
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o['method'] || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o['url']
      // convert non-string objects to query-string form unless o['processData'] is false
      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
        ? reqwest.toQueryString(o['data'])
        : (o['data'] || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)

    // get the xhr from the factory if passed
    // if the factory returns null, fall-back to ours
    http = (o.xhr && o.xhr(o)) || xhr(o)

    http.open(method, url, o['async'] === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o['before'] && o['before'](http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(header) {
    // json, javascript, text/plain, text/html, xml
    if (header.match('json')) return 'json'
    if (header.match('javascript')) return 'js'
    if (header.match('text')) return 'html'
    if (header.match('xml')) return 'xml'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o['url']
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this

    fn = fn || function () {}

    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        timedOut()
      }, o['timeout'])
    }

    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments)
      }
    }

    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments)
      })
    }

    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments)
      })
    }

    function complete (resp) {
      o['timeout'] && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function timedOut() {
      self._timedOut = true
      self.request.abort()      
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  , 'catch': function (fn) {
      return this.fail(fn)
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o['disabled'])
            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type']
      o['dataType'] && (o['type'] = o['dataType'])
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{}],2:[function(require,module,exports){
/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
require('./p5.Geometry3D');

/**
 * generate plane geomery
 * @param  {Number} width   the width of the plane
 * @param  {Number} height  the height of the plane
 * @param  {Number} detailX how many segments in the x axis
 * @param  {Number} detailY how many segments in the y axis
 * @return {[type]}         [description]
 */
p5.prototype.plane = function(width, height, detailX, detailY){

  width = width || 1;
  height = height || 1;

  detailX = detailX || 1;
  detailY = detailY || 1;

  var uuid = 'plane|'+width+'|'+height+'|'+detailX+'|'+detailY;

  if(this._graphics.notInHash(uuid)){

    var geometry3d = new p5.Geometry3D();

    var createPlane = function(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = 0;
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createPlane, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(uuid, obj);

  }

  this._graphics.drawBuffer(uuid);

};

/**
 * [sphere description]
 * @param  {[type]} radius  [description]
 * @param  {[type]} detailX [description]
 * @param  {[type]} detailY [description]
 * @return {[type]}         [description]
 */
p5.prototype.sphere = function(radius, detailX, detailY){

  radius = radius || 50;

  detailX = detailX || 10;
  detailY = detailY || 6;

  var uuid = 'sphere|'+radius+'|'+detailX+'|'+detailY;

  if(this._graphics.notInHash(uuid)){

    var geometry3d = new p5.Geometry3D();

    var createSphere = function(u, v){
      var theta = 2 * Math.PI * u;
      var phi = Math.PI * v - Math.PI / 2;
      var x = radius * Math.cos(phi) * Math.sin(theta);
      var y = radius * Math.sin(phi);
      var z = radius * Math.cos(phi) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createSphere, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(uuid, obj);
  }

  this._graphics.drawBuffer(uuid);

  return this;
};

/**
 * [cylinder description]
 * @param  {[type]} radius  [description]
 * @param  {[type]} detailX [description]
 * @param  {[type]} detailY [description]
 * @return {[type]}         [description]
 */
p5.prototype.cylinder = function(radius, height, detailX, detailY){

  radius = radius || 50;
  height = height || 50;

  detailX = detailX || 10;
  detailY = detailY || 6;

  var uuid = 'cylinder|'+radius+'|'+height+'|'+detailX+'|'+detailY;

  if(this._graphics.notInHash(uuid)){

    var geometry3d = new p5.Geometry3D();

    var createCylinder = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createCylinder, detailX, detailY);

    //TODO: top and bottom faces
    //this.vertices.push(new p5.Vector(0, height/2, 0));
    //this.vertices.push(new p5.Vector(0, -height/2, 0));

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(uuid, obj);
  }

  this._graphics.drawBuffer(uuid);

  return this;
};

/**
 * [cone description]
 * @param  {[type]} radius  [description]
 * @param  {[type]} height  [description]
 * @param  {[type]} detailX [description]
 * @param  {[type]} detailY [description]
 * @return {[type]}         [description]
 */
p5.prototype.cone = function(radius, height, detailX, detailY){

  radius = radius || 50;
  height = height || 50;

  detailX = detailX || 10;
  detailY = detailY || 6;

  var uuid = 'cone|'+radius+'|'+height+'|'+detailX+'|'+detailY;

  if(this._graphics.notInHash(uuid)){

    var geometry3d = new p5.Geometry3D();

    var createCone = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * (1 - v) * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * (1 - v) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createCone, detailX, detailY);

    //@TODO: add bottom face
    //
    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(uuid, obj);
  }

  this._graphics.drawBuffer(uuid);

  return this;
};

/**
 * [torus description]
 * @param  {[type]} radius  [description]
 * @param  {[type]} height  [description]
 * @param  {[type]} detailX [description]
 * @param  {[type]} detailY [description]
 * @return {[type]}         [description]
 */
p5.prototype.torus = function(radius, tube, detailX, detailY){

  radius = radius || 50;
  tube = tube || 20;

  detailX = detailX || 10;
  detailY = detailY || 6;

  var uuid = 'torus|'+radius+'|'+tube+'|'+detailX+'|'+detailY;

  if(this._graphics.notInHash(uuid)){

    var geometry3d = new p5.Geometry3D();

    var createTorus = function(u, v){
      var theta = 2 * Math.PI * u;
      var phi = 2 * Math.PI * v;
      var x = (radius + tube * Math.cos(phi)) * Math.cos(theta);
      var y = (radius + tube * Math.cos(phi)) * Math.sin(theta);
      var z = tube * Math.sin(phi);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createTorus, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(uuid, obj);
  }

  this._graphics.drawBuffer(uuid);

  return this;
};

/**
 * [cube description]
 * @param  {[type]} width   [description]
 * @param  {[type]} height  [description]
 * @param  {[type]} depth   [description]
 * @param  {[type]} detailX [description]
 * @param  {[type]} detailY [description]
 * @return {[type]}         [description]
 */
p5.prototype.box = function(width, height, depth){

  width = width || 10;
  height = height || width;
  depth = depth || width;

  //detail for box as optional
  var detailX = typeof arguments[3] === Number ? arguments[3] : 1;
  var detailY = typeof arguments[4] === Number ? arguments[4] : 1;

  var uuid = 'cube|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

  if(this._graphics.notInHash(uuid)){

    var geometry3d = new p5.Geometry3D();

    var createPlane1 = function(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane2 = function(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = -depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane3 = function(u, v){
      var x = 2 * width * u - width;
      var y = height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane4 = function(u, v){
      var x = 2 * width * u - width;
      var y = -height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane5 = function(u, v){
      var x = width;
      var y = 2 * height * u - height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane6 = function(u, v){
      var x = -width;
      var y = 2 * height * u - height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(
      createPlane1, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane2, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane3, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane4, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane5, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane6, detailX, detailY, geometry3d.vertices.length);

    var obj = geometry3d.generateObj(true);

    this._graphics.initBuffer(uuid, obj);
  }

  this._graphics.drawBuffer(uuid);

  return this;

};

module.exports = p5;

},{"../core/core":16,"./p5.Geometry3D":3}],3:[function(require,module,exports){
/**
 * @module Geometry3D
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
/**
 * p5 Geometry3D class
 */
p5.Geometry3D = function(){
  //an array holding every vertice
  //each vertex is a p5.Vector
  this.vertices = [];
  //an array holding each normals for each vertice
  //each normal is a p5.Vector
  this.vertexNormals = [];
  //an array holding each three indecies of vertices that form a face
  //[[0, 1, 2], [1, 2, 3], ...]
  this.faces = [];
  //an array holding every noraml for each face
  //each faceNormal is a p5.Vector
  //[[p5.Vector, p5.Vector, p5.Vector], [p5.Vector, p5.Vector, p5.Vector],...]
  this.faceNormals = [];
  //an array of p5.Vector holding uvs
  this.uvs = [];
};

/**
 * [parametricGeometry description]
 * @param  {[type]} func   [description]
 * @param  {[type]} detailX [description]
 * @param  {[type]} detailY [description]
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
p5.Geometry3D.prototype.parametricGeometry = function(func,
                                                      detailX,
                                                      detailY,
                                                      offset) {

  var i, j, p;
  var u, v;
  offset = offset || 0;

  //0,0---0,1
  // |     |
  //1,0---1,1
  var sliceCount = detailX + 1;
  for (i = 0; i <= detailY; i++){
    v = i / detailY;
    for (j = 0; j <= detailX; j++){
      u = j / detailX;
      p = func(u, v);
      this.vertices.push(p);
    }
  }

  var a, b, c, d;
  var uva, uvb, uvc, uvd;

  for (i = 0; i < detailY; i++){
    for (j = 0; j < detailX; j++){
      a = i * sliceCount + j + offset;
      b = i * sliceCount + j + 1 + offset;
      c = (i + 1)* sliceCount + j + 1 + offset;
      d = (i + 1)* sliceCount + j + offset;

      uva = [j/detailX, i/detailY];
      uvb = [(j + 1)/ detailX, i/detailY];
      uvc = [(j + 1)/ detailX, (i + 1)/detailY];
      uvd = [j/detailX, (i + 1)/detailY];

      this.faces.push([a, b, d]);
      this.uvs.push([uva, uvb, uvd]);

      this.faces.push([b, c, d]);
      this.uvs.push([uvb, uvc, uvd]);
    }
  }

};

/**
 * [mergeVertices description]
 * @return {[type]} [description]
 */
p5.Geometry3D.prototype.mergeVertices= function () {

  var verticesMap = {};
  var unique = [], changes = [];

  var v, key;
  var precisionPoints = 4;
  var precision = Math.pow(10, precisionPoints);
  var i, face;
  var indices;

  for (i = 0; i < this.vertices.length; i ++) {

    v = this.vertices[i];
    key = Math.round(v.x * precision) + '_' +
    Math.round(v.y * precision) + '_' +
    Math.round(v.z * precision);

    if (verticesMap[key] === undefined) {
      verticesMap[key] = i;
      unique.push(this.vertices[i]);
      changes[i] = unique.length - 1;
    } else {
      changes[i] = changes[verticesMap[key]];
    }

  }
  // if faces are completely degenerate after merging vertices, we
  // have to remove them from the geometry.
  var faceIndicesToRemove = [];

  for (i = 0; i < this.faces.length; i ++) {

    face = this.faces[i];

    face[0] = changes[face[0]];
    face[1] = changes[face[1]];
    face[2] = changes[face[2]];

    indices = [face[0], face[1], face[2]];

    var dupIndex = - 1;

    // if any duplicate vertices are found in a Face
    // we have to remove the face as nothing can be saved
    for (var n = 0; n < 3; n ++) {
      if (indices[n] === indices[(n + 1) % 3]) {
        dupIndex = n;
        faceIndicesToRemove.push(i);
        break;
      }
    }
  }

  for (i = faceIndicesToRemove.length - 1; i >= 0; i --) {
    var idx = faceIndicesToRemove[i];
    this.faces.splice(idx, 1);
  }

  // Use unique set of vertices
  var diff = this.vertices.length - unique.length;
  this.vertices = unique;
  return diff;

};

/**
 * [computeFaceNormals description]
 * @return {[type]} [description]
 */
p5.Geometry3D.prototype.computeFaceNormals = function(){

  //if(!box){
  var cb = new p5.Vector();
  var ab = new p5.Vector();

  for (var f = 0; f < this.faces.length; f++){
    var face = this.faces[f];
    var vA = this.vertices[face[0]];
    var vB = this.vertices[face[1]];
    var vC = this.vertices[face[2]];

    p5.Vector.sub(vC, vB, cb);
    p5.Vector.sub(vA, vB, ab);

    var normal = p5.Vector.cross(ab, cb);
    normal.normalize();
    normal.mult(-1);
    this.faceNormals[f] = normal;
  }

};

/**
 * [computeVertexNormals description]
 * @return {[type]} [description]
 */
p5.Geometry3D.prototype.computeVertexNormals = function (){

  var v, f, face, faceNormal, vertices;
  var vertexNormals = [];

  vertices = new Array(this.vertices.length);
  for (v = 0; v < this.vertices.length; v++) {
    vertices[v] = new p5.Vector();
  }

  for (f = 0; f < this.faces.length; f++) {
    face = this.faces[f];
    faceNormal = this.faceNormals[f];

    vertices[face[0]].add(faceNormal);
    vertices[face[1]].add(faceNormal);
    vertices[face[2]].add(faceNormal);
  }

  for (v = 0; v < this.vertices.length; v++) {
    vertices[v].normalize();
  }

  for (f = 0; f < this.faces.length; f++) {
    face = this.faces[f];
    vertexNormals[f] = [];
    vertexNormals[f][0]= vertices[face[0]].copy();
    vertexNormals[f][1]= vertices[face[1]].copy();
    vertexNormals[f][2]= vertices[face[2]].copy();
  }

  for (f = 0; f < this.faces.length; f++){
    face = this.faces[f];
    faceNormal = this.faceNormals[f];
    this.vertexNormals[face[0]] = vertexNormals[f][0];
    this.vertexNormals[face[1]] = vertexNormals[f][1];
    this.vertexNormals[face[2]] = vertexNormals[f][2];
  }

};

/**
 * [generateObj description]
 * @return {[type]} [description]
 */
p5.Geometry3D.prototype.generateObj = function(box){
  if(!box){
    this.mergeVertices();
  }
  this.computeFaceNormals();
  this.computeVertexNormals();

  var obj = {
    vertices: turnVectorArrayIntoNumberArray(this.vertices),
    vertexNormals: turnVectorArrayIntoNumberArray(this.vertexNormals),
    faces: flatten(this.faces),
    len: this.faces.length * 3
  };
  return obj;
};

/**
 * turn a two dimensional array into one dimensional array
 * @param  {Array} arr 2-dimensional array
 * @return {Array}     1-dimensional array
 * [[1, 2, 3],[4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
 */
function flatten(arr){
  return arr.reduce(function(a, b){
    return a.concat(b);
  });
}

/**
 * turn an array of Vector into a one dimensional array of numbers
 * @param  {Array} arr  an array of p5.Vector
 * @return {Array]}     a one dimensional array of numbers
 * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
 * [1, 2, 3, 4, 5, 6]
 */
function turnVectorArrayIntoNumberArray(arr){
  return flatten(arr.map(function(item){
    return [item.x, item.y, item.z];
  }));
}

module.exports = p5.Geometry3D;

},{"../core/core":16}],4:[function(require,module,exports){
/**
 * @requires constants
 * @todo see methods below needing further implementation.
 */

'use strict';

var p5 = require('../core/core');
var polarGeometry = require('../math/polargeometry');
var constants = require('../core/constants');
var GLMAT_ARRAY_TYPE = (
    typeof Float32Array !== 'undefined') ?
  Float32Array : Array;

/**
 * A class to describe a 4x4 matrix
 * for model and view matrix manipulation in the p5js webgl renderer.
 * @class p5.Matrix
 * @constructor
 * @param {Array} [mat4] array literal of our 4x4 matrix
 */
p5.Matrix = function() {
  // This is how it comes in with createMatrix()
  if(arguments[0] instanceof p5) {
    // save reference to p5 if passed in
    this.p5 = arguments[0];
    this.mat4  = arguments[1] || new GLMAT_ARRAY_TYPE([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  // This is what we'll get with new p5.Matrix()
  // a mat4 identity matrix
  } else {
    this.mat4 = arguments[0] || new GLMAT_ARRAY_TYPE([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
  return this;
};

/**
 * Sets the x, y, and z component of the vector using two or three separate
 * variables, the data from a p5.Matrix, or the values from a float array.
 *
 * @param {p5.Matrix|Array} [inMatrix] the input p5.Matrix or
 *                                     an Array of length 16
 */
p5.Matrix.prototype.set = function (inMatrix) {
  if (inMatrix instanceof p5.Matrix) {
    this.mat4 = inMatrix.mat4;
    return this;
  }
  else if (inMatrix instanceof GLMAT_ARRAY_TYPE) {
    this.mat4 = inMatrix;
    return this;
  }
  return this;
};

/**
 * Gets a copy of the vector, returns a p5.Matrix object.
 *
 * @return {p5.Matrix} the copy of the p5.Matrix object
 */
p5.Matrix.prototype.get = function () {
  return new p5.Matrix(this.mat4);
};

/**
 * Copies the mat4
 * @return {[type]} [description]
 */
p5.Matrix.prototype.copy = function(){
  var copied = new p5.Matrix();
  copied.mat4[0] = this.mat4[0];
  copied.mat4[1] = this.mat4[1];
  copied.mat4[2] = this.mat4[2];
  copied.mat4[3] = this.mat4[3];
  copied.mat4[4] = this.mat4[4];
  copied.mat4[5] = this.mat4[5];
  copied.mat4[6] = this.mat4[6];
  copied.mat4[7] = this.mat4[7];
  copied.mat4[8] = this.mat4[8];
  copied.mat4[9] = this.mat4[9];
  copied.mat4[10] = this.mat4[10];
  copied.mat4[11] = this.mat4[11];
  copied.mat4[12] = this.mat4[12];
  copied.mat4[13] = this.mat4[13];
  copied.mat4[14] = this.mat4[14];
  copied.mat4[15] = this.mat4[15];
  return copied;
};

/**
 * return an identity matrix
 * @return {[type]} [description]
 */
p5.Matrix.identity = function(){
  return new p5.Matrix();
};

/**
 * [transpose description]
 * @param  {[type]} a [description]
 * @return {[type]}   [description]
 */
p5.Matrix.prototype.transpose = function(a){
  var a01, a02, a03, a12, a13, a23;
  if(a instanceof p5.Matrix){
    a01 = a.mat4[1];
    a02 = a.mat4[2];
    a03 = a.mat4[3];
    a12 = a.mat4[6];
    a13 = a.mat4[7];
    a23 = a.mat4[11];

    this.mat4[0] = a.mat4[0];
    this.mat4[1] = a.mat4[4];
    this.mat4[2] = a.mat4[8];
    this.mat4[3] = a.mat4[12];
    this.mat4[4] = a01;
    this.mat4[5] = a.mat4[5];
    this.mat4[6] = a.mat4[9];
    this.mat4[7] = a.mat4[13];
    this.mat4[8] = a02;
    this.mat4[9] = a12;
    this.mat4[10] = a.mat4[10];
    this.mat4[11] = a.mat4[14];
    this.mat4[12] = a03;
    this.mat4[13] = a13;
    this.mat4[14] = a23;
    this.mat4[15] = a.mat4[15];

  }else if(a instanceof GLMAT_ARRAY_TYPE){
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a12 = a[6];
    a13 = a[7];
    a23 = a[11];

    this.mat4[0] = a[0];
    this.mat4[1] = a[4];
    this.mat4[2] = a[8];
    this.mat4[3] = a[12];
    this.mat4[4] = a01;
    this.mat4[5] = a[5];
    this.mat4[6] = a[9];
    this.mat4[7] = a[13];
    this.mat4[8] = a02;
    this.mat4[9] = a12;
    this.mat4[10] = a[10];
    this.mat4[11] = a[14];
    this.mat4[12] = a03;
    this.mat4[13] = a13;
    this.mat4[14] = a23;
    this.mat4[15] = a[15];
  }
  return this;
};

/**
 * [invert description]
 * @param  {[type]} a [description]
 * @return {[type]}   [description]
 */
p5.Matrix.prototype.invert = function(a){
  var a00, a01, a02, a03, a10, a11, a12, a13,
  a20, a21, a22, a23, a30, a31, a32, a33;
  if(a instanceof p5.Matrix){
    a00 = a.mat4[0];
    a01 = a.mat4[1];
    a02 = a.mat4[2];
    a03 = a.mat4[3];
    a10 = a.mat4[4];
    a11 = a.mat4[5];
    a12 = a.mat4[6];
    a13 = a.mat4[7];
    a20 = a.mat4[8];
    a21 = a.mat4[9];
    a22 = a.mat4[10];
    a23 = a.mat4[11];
    a30 = a.mat4[12];
    a31 = a.mat4[13];
    a32 = a.mat4[14];
    a33 = a.mat4[15];
  }else if(a instanceof GLMAT_ARRAY_TYPE){
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    a30 = a[12];
    a31 = a[13];
    a32 = a[14];
    a33 = a[15];
  }
  var b00 = a00 * a11 - a01 * a10,
  b01 = a00 * a12 - a02 * a10,
  b02 = a00 * a13 - a03 * a10,
  b03 = a01 * a12 - a02 * a11,
  b04 = a01 * a13 - a03 * a11,
  b05 = a02 * a13 - a03 * a12,
  b06 = a20 * a31 - a21 * a30,
  b07 = a20 * a32 - a22 * a30,
  b08 = a20 * a33 - a23 * a30,
  b09 = a21 * a32 - a22 * a31,
  b10 = a21 * a33 - a23 * a31,
  b11 = a22 * a33 - a23 * a32,

  // Calculate the determinant
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 -
  b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  this.mat4[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  this.mat4[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  this.mat4[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  this.mat4[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  this.mat4[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  this.mat4[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  this.mat4[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  this.mat4[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  this.mat4[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  this.mat4[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  this.mat4[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  this.mat4[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  this.mat4[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  this.mat4[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  this.mat4[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  this.mat4[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return this;
};

/**
 * @return {Number} Determinant of our 4x4 matrix
 * inspired by Toji's mat4 determinant
 */
p5.Matrix.prototype.determinant = function(){
  var d00 = (this.mat4[0] * this.mat4[5]) - (this.mat4[1] * this.mat4[4]),
    d01 = (this.mat4[0] * this.mat4[6]) - (this.mat4[2] * this.mat4[4]),
    d02 = (this.mat4[0] * this.mat4[7]) - (this.mat4[3] * this.mat4[4]),
    d03 = (this.mat4[1] * this.mat4[6]) - (this.mat4[2] * this.mat4[5]),
    d04 = (this.mat4[1] * this.mat4[7]) - (this.mat4[3] * this.mat4[5]),
    d05 = (this.mat4[2] * this.mat4[7]) - (this.mat4[3] * this.mat4[6]),
    d06 = (this.mat4[8] * this.mat4[13]) - (this.mat4[9] * this.mat4[12]),
    d07 = (this.mat4[8] * this.mat4[14]) - (this.mat4[10] * this.mat4[12]),
    d08 = (this.mat4[8] * this.mat4[15]) - (this.mat4[11] * this.mat4[12]),
    d09 = (this.mat4[9] * this.mat4[14]) - (this.mat4[10] * this.mat4[13]),
    d10 = (this.mat4[9] * this.mat4[15]) - (this.mat4[11] * this.mat4[13]),
    d11 = (this.mat4[10] * this.mat4[15]) - (this.mat4[11] * this.mat4[14]);

  // Calculate the determinant
  return d00 * d11 - d01 * d10 + d02 * d09 +
    d03 * d08 - d04 * d07 + d05 * d06;
};

/**
 * multiply two mat4s
 * @param {p5.Matrix | Array} multMatrix The matrix we want to multiply by
 * @return {[type]} [description]
 */
p5.Matrix.prototype.mult = function(multMatrix){
  var _dest = new GLMAT_ARRAY_TYPE(16);
  var _src = new GLMAT_ARRAY_TYPE(16);

  if(multMatrix instanceof p5.Matrix) {
    _src = multMatrix.mat4;
  }
  else if(multMatrix instanceof GLMAT_ARRAY_TYPE){
    _src = multMatrix;
  }

  // each row is used for the multiplier
  var b0  = this.mat4[0], b1 = this.mat4[1],
    b2 = this.mat4[2], b3 = this.mat4[3];
  _dest[0] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[1] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[2] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[3] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  b0 = this.mat4[4];
  b1 = this.mat4[5];
  b2 = this.mat4[6];
  b3 = this.mat4[7];
  _dest[4] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[5] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[6] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[7] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  b0 = this.mat4[8];
  b1 = this.mat4[9];
  b2 = this.mat4[10];
  b3 = this.mat4[11];
  _dest[8] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[9] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[10] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[11] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  b0 = this.mat4[12];
  b1 = this.mat4[13];
  b2 = this.mat4[14];
  b3 = this.mat4[15];
  _dest[12] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
  _dest[13] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
  _dest[14] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
  _dest[15] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

  this.mat4 = _dest;

  return this;
};

/**
 * scales a p5.Matrix by scalars or a vector
 * @param  {p5.Vector | Array | Numbers}
 *                      vector to scale by
 * @return {[type]}     [description]
 */
p5.Matrix.prototype.scale = function() {
  var x,y,z;
  //if our 1st arg is a type p5.Vector
  if (arguments[0] instanceof p5.Vector){
    x = arguments[0].x;
    y = arguments[0].y;
    z = arguments[0].z;
  }
  //otherwise if it's an array
  else if (arguments[0] instanceof Array){
    x = arguments[0][0];
    y = arguments[0][1];
    z = arguments[0][2];
  }
  //otherwise it's probably some numbers
  else {
    //short circuit eval to make sure we maintain
    //component size
    x = arguments[0] || 1;
    y = arguments[1] || 1;
    z = arguments[2] || 1;
  }

  var _dest = new GLMAT_ARRAY_TYPE(16);

  for (var i = 0; i < this.mat4.length; i++) {
    var row = i % 4;
    switch(row){
    case 0:
      _dest[i] = this.mat4[i]*x;
      break;
    case 1:
      _dest[i] = this.mat4[i]*y;
      break;
    case 2:
      _dest[i] = this.mat4[i]*z;
      break;
    case 3:
      _dest[i] = this.mat4[i];
      break;
    }
  }
  this.mat4 = _dest;
  return this;
};

/**
 * rotate our Matrix around an axis by the given angle.
 * @param  {Number} a The angle of rotation in radians
 * @param  {p5.Vector | Array} axis  the axis(es) to rotate around
 * @return {[type]}       [description]
 * inspired by Toji's gl-matrix lib, mat4 rotation
 */
p5.Matrix.prototype.rotate = function(a, axis){
  var x, y, z, _a, len;

  if (this.p5) {
    if (this.p5._angleMode === constants.DEGREES) {
      _a = polarGeometry.degreesToRadians(a);
    }
  }
  else {
    _a = a;
  }
  if (axis instanceof p5.Vector) {
    x = axis.x;
    y = axis.y;
    z = axis.z;
  }
  else if (axis instanceof Array) {
    x = axis[0];
    y = axis[1];
    z = axis[2];
  }

  len = Math.sqrt(x * x + y * y + z * z);
  x *= (1/len);
  y *= (1/len);
  z *= (1/len);

  var a00 = this.mat4[0];
  var a01 = this.mat4[1];
  var a02 = this.mat4[2];
  var a03 = this.mat4[3];
  var a10 = this.mat4[4];
  var a11 = this.mat4[5];
  var a12 = this.mat4[6];
  var a13 = this.mat4[7];
  var a20 = this.mat4[8];
  var a21 = this.mat4[9];
  var a22 = this.mat4[10];
  var a23 = this.mat4[11];

  //sin,cos, and tan of respective angle
  var sA = Math.sin(_a);
  var cA = Math.cos(_a);
  var tA = 1 - cA;
  // Construct the elements of the rotation matrix
  var b00 = x * x * tA + cA;
  var b01 = y * x * tA + z * sA;
  var b02 = z * x * tA - y * sA;
  var b10 = x * y * tA - z * sA;
  var b11 = y * y * tA + cA;
  var b12 = z * y * tA + x * sA;
  var b20 = x * z * tA + y * sA;
  var b21 = y * z * tA - x * sA;
  var b22 = z * z * tA + cA;

  // rotation-specific matrix multiplication
  this.mat4[0] = a00 * b00 + a10 * b01 + a20 * b02;
  this.mat4[1] = a01 * b00 + a11 * b01 + a21 * b02;
  this.mat4[2] = a02 * b00 + a12 * b01 + a22 * b02;
  this.mat4[3] = a03 * b00 + a13 * b01 + a23 * b02;
  this.mat4[4] = a00 * b10 + a10 * b11 + a20 * b12;
  this.mat4[5] = a01 * b10 + a11 * b11 + a21 * b12;
  this.mat4[6] = a02 * b10 + a12 * b11 + a22 * b12;
  this.mat4[7] = a03 * b10 + a13 * b11 + a23 * b12;
  this.mat4[8] = a00 * b20 + a10 * b21 + a20 * b22;
  this.mat4[9] = a01 * b20 + a11 * b21 + a21 * b22;
  this.mat4[10] = a02 * b20 + a12 * b21 + a22 * b22;
  this.mat4[11] = a03 * b20 + a13 * b21 + a23 * b22;

  return this;
};

/**
 * @todo  finish implementing this method!
 * translates
 * @param  {Array} v vector to translate by
 * @return {[type]}   [description]
 */
p5.Matrix.prototype.translate = function(v){
  var x = v[0],
    y = v[1],
    z = v[2];
  this.mat4[12] =
    this.mat4[0] * x +this.mat4[4] * y +this.mat4[8] * z +this.mat4[12];
  this.mat4[13] =
    this.mat4[1] * x +this.mat4[5] * y +this.mat4[9] * z +this.mat4[13];
  this.mat4[14] =
    this.mat4[2] * x +this.mat4[6] * y +this.mat4[10] * z +this.mat4[14];
  this.mat4[15] =
    this.mat4[3] * x +this.mat4[7] * y +this.mat4[11] * z +this.mat4[15];
};

p5.Matrix.prototype.rotateX = function(a){
  this.rotate(a, [1,0,0]);
};
p5.Matrix.prototype.rotateY = function(a){
  this.rotate(a, [0,1,0]);
};
p5.Matrix.prototype.rotateZ = function(a){
  this.rotate(a, [0,0,1]);
};

module.exports = p5.Matrix;

},{"../core/constants":15,"../core/core":16,"../math/polargeometry":45}],5:[function(require,module,exports){

var p5 = require('../core/core');
var shaders = require('./shaders');
require('../core/p5.Renderer');
require('./p5.Matrix');
var gl, shaderProgram;
var uMVMatrixStack = [];

//@TODO should probably implement an override for these attributes
var attributes = {
  alpha: false,
  depth: true,
  stencil: true,
  antialias: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false
};

/**
 * 3D graphics class.  Can also be used as an off-screen graphics buffer.
 * A p5.Renderer3D object can be constructed
 *
 */
p5.Renderer3D = function(elt, pInst, isMainCanvas) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);

  try {
    this.drawingContext = this.canvas.getContext('webgl', attributes) ||
      this.canvas.getContext('experimental-webgl', attributes);
    if (this.drawingContext === null) {
      throw 'Error creating webgl context';
    } else {
      console.log('p5.Renderer3D: enabled webgl context');
    }
  } catch (er) {
    console.error(er);
  }

  this.isP3D = true; //lets us know we're in 3d mode
  gl = this.drawingContext;
  gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  this.initShaders(); //initialize our default shaders
  //create our default matrices
  this.initHash();
  this.initMatrix();
  return this;
};

/**
 * [prototype description]
 * @type {[type]}
 */
p5.Renderer3D.prototype = Object.create(p5.Renderer.prototype);

/**
 * [_applyDefaults description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype._applyDefaults = function() {
  return this;
};

/**
 * [resize description]
 * @param  {[type]} w [description]
 * @param  {[type]} h [description]
 * @return {[type]}   [description]
 */
p5.Renderer3D.prototype.resize = function(w,h) {
  p5.Renderer.prototype.resize.call(this, w,h);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

/**
 * [initShaders description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.initShaders = function() {
  //set up our default shaders by:
  // 1. create the shader,
  // 2. load the shader source,
  // 3. compile the shader
  var _vertShader = gl.createShader(gl.VERTEX_SHADER);
  //load in our default vertex shader
  gl.shaderSource(_vertShader, shaders.testVert);
  gl.compileShader(_vertShader);
  // if our vertex shader failed compilation?
  if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
    alert('Yikes! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_vertShader));
    return null;
  }

  var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  //load in our material frag shader
  gl.shaderSource(_fragShader, shaders.testFrag);
  gl.compileShader(_fragShader);
  // if our frag shader failed compilation?
  if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
    alert('Darn! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_fragShader));
    return null;
  }

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, _vertShader);
  gl.attachShader(shaderProgram, _fragShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Snap! Error linking shader program');
  }
  gl.useProgram(shaderProgram);
  //END SHADERS SETUP

  // var vertexResolution =
  // gl.getUniformLocation(shaderProgram, 'u_resolution');
  // @TODO replace 4th argument with far plane once we implement
  // a view frustrum

  //vertex position Attribute
  shaderProgram.vertexPositionAttribute =
    gl.getAttribLocation(shaderProgram, 'position');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  //vertex normal Attribute
  shaderProgram.vertexNormalAttribute =
    gl.getAttribLocation(shaderProgram, 'normal');
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  //projection Matrix uniform
  shaderProgram.uPMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'transformMatrix');
  //model view Matrix uniform
  shaderProgram.uMVMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'modelviewMatrix');

  //normal Matrix uniform
  shaderProgram.uNMatrixUniform =
  gl.getUniformLocation(shaderProgram, 'normalMatrix');
};

/**
 * [initBuffer description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.initHash = function(){
  this.hash = {};
  window.hash = this.hash;//for debug
};

/**
 * [initMatrix description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.initMatrix = function(){
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix  = new p5.Matrix();
  this.uNMatrix = new p5.Matrix();
  this._perspective(60 / 180 * Math.PI, this.width / this.height, 0.1, 100);
};

/**
 * resets the model view matrix to a mat4 identity
 * matrix.
 * @return {void}
 */
p5.Renderer3D.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity();
};

//////////////////////////////////////////////
// COLOR | Setting
//////////////////////////////////////////////

/**
 * [background description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.background = function() {
  var _col = this._pInst.color.apply(this._pInst, arguments);
  // gl.clearColor(0.0,0.0,0.0,1.0);
  var _r = (_col.color_array[0]) / 255;
  var _g = (_col.color_array[1]) / 255;
  var _b = (_col.color_array[2]) / 255;
  var _a = (_col.color_array[3]) / 255;
  gl.clearColor(_r, _g, _b, _a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.resetMatrix();
};

//@TODO implement this
// p5.Renderer3D.prototype.clear = function() {
//@TODO
// };

//@TODO implement this
// p5.Renderer3D.prototype.fill = function() {
//@TODO
// };

/**
 * [stroke description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.stroke = function() {
  this._stroke = this._pInst.color.apply(this._pInst, arguments);
};


p5.Renderer3D.prototype.notInHash = function(uuid){
  return this.hash[uuid] === undefined;
};

p5.Renderer3D.prototype.initBuffer = function(uuid, obj) {

  this.hash[uuid] = {};
  this.hash[uuid].len = obj.len;
  this.hash[uuid].vertexBuffer = gl.createBuffer();
  this.hash[uuid].normalBuffer = gl.createBuffer();
  this.hash[uuid].indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].normalBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.vertexNormals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.hash[uuid].indexBuffer);
  gl.bufferData
   (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.faces), gl.STATIC_DRAW);
};

p5.Renderer3D.prototype.drawBuffer = function(uuid) {

  gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].vertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.hash[uuid].normalBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.hash[uuid].indexBuffer);

  this.setMatrixUniforms();
  gl.drawElements(
    gl.TRIANGLES, this.hash[uuid].len,
     gl.UNSIGNED_SHORT, 0);
};

/**
 * [translate description]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} z [description]
 * @return {[type]}   [description]
 * @todo implement handle for components or vector as args
 */
p5.Renderer3D.prototype.translate = function(x, y, z) {
  x = x / 100;
  y = -y / 100;
  z = z / 100;
  this.uMVMatrix.translate([x,y,z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @param  {Number} x [description]
 * @param  {Number} y [description]
 * @param  {Number} z [description]
 * @return {this}   [description]
 */
p5.Renderer3D.prototype.scale = function(x, y, z) {
  this.uMVMatrix.scale([x,y,z]);
  return this;
};

/**
 * [rotateX description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateX = function(rad) {
  this.uMVMatrix.rotateX(rad);
  return this;
};

/**
 * [rotateY description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateY = function(rad) {
  this.uMVMatrix.rotateY(rad);
  return this;
};

/**
 * [rotateZ description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateZ = function(rad) {
  this.uMVMatrix.rotateZ(rad);
  return this;
};

/**
 * pushes a copy of the model view matrix onto the
 * MV Matrix stack.
 * NOTE to self: could probably make this more readable
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.push = function() {
  uMVMatrixStack.push(this.uMVMatrix.copy());
};

/**
 * [pop description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.pop = function() {
  if (uMVMatrixStack.length === 0) {
    throw 'Invalid popMatrix!';
  }
  this.uMVMatrix = uMVMatrixStack.pop();
};

/**
 * Sets the Matrix Uniforms inside our default shader.
 * @param {Array float} projection projection matrix
 * @param {Array float} modelView  model view matrix
 */
p5.Renderer3D.prototype.setMatrixUniforms = function() {
  gl.uniformMatrix4fv(
    shaderProgram.uPMatrixUniform, false, this.uPMatrix.mat4);
  gl.uniformMatrix4fv(
    shaderProgram.uMVMatrixUniform, false, this.uMVMatrix.mat4);
  this.uNMatrix = new p5.Matrix();
  this.uNMatrix.invert(this.uMVMatrix);
  this.uNMatrix.transpose(this.uNMatrix);
  gl.uniformMatrix4fv(
    shaderProgram.uNMatrixUniform, false, this.uNMatrix.mat4);
};
/**
 * PRIVATE
 */
// matrix methods adapted from:
// https://developer.mozilla.org/en-US/docs/Web/WebGL/
// gluPerspective
//
// function _makePerspective(fovy, aspect, znear, zfar){
//    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
//    var ymin = -ymax;
//    var xmin = ymin * aspect;
//    var xmax = ymax * aspect;
//    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
//  }

////
//// glFrustum
////
//function _makeFrustum(left, right, bottom, top, znear, zfar){
//  var X = 2*znear/(right-left);
//  var Y = 2*znear/(top-bottom);
//  var A = (right+left)/(right-left);
//  var B = (top+bottom)/(top-bottom);
//  var C = -(zfar+znear)/(zfar-znear);
//  var D = -2*zfar*znear/(zfar-znear);
//  var frustrumMatrix =[
//  X, 0, A, 0,
//  0, Y, B, 0,
//  0, 0, C, D,
//  0, 0, -1, 0
//];
//return frustrumMatrix;
// }

// function _setMVPMatrices(){
////an identity matrix
////@TODO use the p5.Matrix class to abstract away our MV matrices and
///other math
//var _mvMatrix =
//[
//  1.0,0.0,0.0,0.0,
//  0.0,1.0,0.0,0.0,
//  0.0,0.0,1.0,0.0,
//  0.0,0.0,0.0,1.0
//];

//////////////////////////////////////////
/// CAMERA
//////////////////////////////////////////
p5.prototype.perspective = function(fovy,aspect,near,far){
  this._pInst._graphics._perspective(arguments);
};
/**
 * sets the perspective matrix
 * @param  {Number} fovy   [description]
 * @param  {Number} aspect [description]
 * @param  {Number} near   near clipping plane
 * @param  {Number} far    far clipping plane
 * @return {void}
 */
p5.Renderer3D.prototype._perspective = function(){
  var fovy = arguments[0];
  var aspect = arguments[1];
  var near = arguments[2];
  var far = arguments[3];

  var f = 1.0 / Math.tan(fovy / 2),
    nf = 1 / (near - far);
  this.uPMatrix.mat4[0] = f / aspect;
  this.uPMatrix.mat4[1] = 0;
  this.uPMatrix.mat4[2] = 0;
  this.uPMatrix.mat4[3] = 0;
  this.uPMatrix.mat4[4] = 0;
  this.uPMatrix.mat4[5] = f;
  this.uPMatrix.mat4[6] = 0;
  this.uPMatrix.mat4[7] = 0;
  this.uPMatrix.mat4[8] = 0;
  this.uPMatrix.mat4[9] = 0;
  this.uPMatrix.mat4[10] = (far + near) * nf;
  this.uPMatrix.mat4[11] = -1;
  this.uPMatrix.mat4[12] = 0;
  this.uPMatrix.mat4[13] = 0;
  this.uPMatrix.mat4[14] = (2 * far * near) * nf;
  this.uPMatrix.mat4[15] = 0;
  return this;
};
//// create a perspective matrix with
//// fovy, aspect, znear, zfar
//var _pMatrix = _makePerspective(45,
//  gl.drawingBufferWidth/gl.drawingBufferHeight,
//  0.1, 1000.0);
module.exports = p5.Renderer3D;

},{"../core/core":16,"../core/p5.Renderer":22,"./p5.Matrix":4,"./shaders":6}],6:[function(require,module,exports){
/*
Part of the Processing project - http://processing.org

Copyright (c) 2011-13 Ben Fry and Casey Reas

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License version 2.1 as published by the Free Software Foundation.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General
Public License along with this library; if not, write to the
Free Software Foundation, Inc., 59 Temple Place, Suite 330,
Boston, MA  02111-1307  USA
 */
/**
 * @description Default full shaders for our WebGL context
 */
module.exports = {
  texLightVert : [
    'uniform mat4 modelviewMatrix;',
    'uniform mat4 transformMatrix;',
    'uniform mat3 normalMatrix;',
    'uniform mat4 texMatrix;',

    'uniform int lightCount;',
    'uniform vec4 lightPosition[8];',
    'uniform vec3 lightNormal[8];',
    'uniform vec3 lightAmbient[8];',
    'uniform vec3 lightDiffuse[8];',
    'uniform vec3 lightSpecular[8];',
    'uniform vec3 lightFalloff[8];',
    'uniform vec2 lightSpot[8];',

    'attribute vec4 position;',
    'attribute vec4 color;',
    'attribute vec3 normal;',
    'attribute vec2 texCoord;',

    'attribute vec4 ambient;',
    'attribute vec4 specular;',
    'attribute vec4 emissive;',
    'attribute float shininess;',

    'varying vec4 vertColor;',
    'varying vec4 backVertColor;',
    'varying vec4 vertTexCoord;',

    'const float zero_float = 0.0;',
    'const float one_float = 1.0;',
    'const vec3 zero_vec3 = vec3(0);',

    'float falloffFactor(vec3 lightPos, vec3 vertPos, vec3 coeff) {',
    'vec3 lpv = lightPos - vertPos;',
    'vec3 dist = vec3(one_float);',
    'dist.z = dot(lpv, lpv);',
    'dist.y = sqrt(dist.z);',
    'return one_float / dot(dist, coeff);',
    '}',

    'float spotFactor(vec3 lightPos,vec3 vertPos,',
    'vec3 lightNorm,float minCos,float spotExp) {',
    'vec3 lpv = normalize(lightPos - vertPos);',
    'vec3 nln = -one_float * lightNorm;',
    'float spotCos = dot(nln, lpv);',
    'return spotCos <= minCos ? zero_float : pow(spotCos, spotExp);',
    '}',
    'float lambertFactor(vec3 lightDir, vec3 vecNormal) {',
    'return max(zero_float, dot(lightDir, vecNormal));',
    '}',

    'float blinnPhongFactor(vec3 lightDir,',
    'vec3 vertPos,vec3 vecNormal, float shine) {',
    'vec3 np = normalize(vertPos);',
    'vec3 ldp = normalize(lightDir - np);',
    'return pow(max(zero_float, dot(ldp, vecNormal)), shine);',
    '}',

    'void main() {',
      // Vertex in clip coordinates
    'gl_Position = transformMatrix * position;',

      // Vertex in eye coordinates
    'vec3 ecVertex = vec3(modelviewMatrix * position);',

      // Normal vector in eye coordinates
    'vec3 ecNormal = normalize(normalMatrix * normal);',
    'vec3 ecNormalInv = ecNormal * -one_float;',

    // Light calculations
    'vec3 totalAmbient = vec3(0, 0, 0);',

    'vec3 totalFrontDiffuse = vec3(0, 0, 0);',
    'vec3 totalFrontSpecular = vec3(0, 0, 0);',

    'vec3 totalBackDiffuse = vec3(0, 0, 0);',
    'vec3 totalBackSpecular = vec3(0, 0, 0);',

    'for (int i = 0; i < 8; i++) {',
    'if (lightCount == i) break;',

    'vec3 lightPos = lightPosition[i].xyz;',
    'bool isDir = zero_float < lightPosition[i].w;',
    'float spotCos = lightSpot[i].x;',
    'float spotExp = lightSpot[i].y;',

    'vec3 lightDir;',
    'float falloff;',
    'float spotf;',

    'if (isDir) {',
    'falloff = one_float;',
    'lightDir = -one_float * lightNormal[i];',
    '} else {',
    'falloff = falloffFactor(lightPos, ecVertex, lightFalloff[i]);',
    'lightDir = normalize(lightPos - ecVertex);',
    '}',

    'spotf=spotExp > zero_float ? spotFactor(lightPos,',
    'ecVertex,',
    'lightNormal[i],',
    'spotCos,',
    'spotExp):one_float;',

    'if (any(greaterThan(lightAmbient[i], zero_vec3))) {',
    'totalAmbient+= lightAmbient[i] * falloff;',
    '}',

    'if (any(greaterThan(lightDiffuse[i], zero_vec3))) {',
    'totalFrontDiffuse  += lightDiffuse[i] * falloff * spotf *',
    'lambertFactor(lightDir, ecNormal);',
    'totalBackDiffuse   += lightDiffuse[i] * falloff * spotf *',
    'lambertFactor(lightDir, ecNormalInv);',
    '}',

    'if (any(greaterThan(lightSpecular[i], zero_vec3))) {',
    'totalFrontSpecular += lightSpecular[i] * falloff * spotf * ',
    'blinnPhongFactor(lightDir, ecVertex, ecNormal, shininess);',
    'totalBackSpecular  += lightSpecular[i] * falloff * spotf *',
    'blinnPhongFactor(lightDir, ecVertex, ecNormalInv, shininess);',
    '}',
    '}',

    // Calculating final color as result of all lights (plus emissive term).
    // Transparency is determined exclusively by the diffuse component.
    'vertColor =vec4(totalAmbient, 0) * ambient + ',
    'vec4(totalFrontDiffuse, 1) * color +' ,
    'vec4(totalFrontSpecular, 0) * specular +',
    'vec4(emissive.rgb, 0);',

    'backVertColor = vec4(totalAmbient, 0) * ambient + ',
    'vec4(totalBackDiffuse, 1) * color +',
    'vec4(totalBackSpecular, 0) * specular +',
    'vec4(emissive.rgb, 0);',

      // Calculating texture coordinates, with r and q set both to one
    'vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);',
    '}'
  ].join('\n'),
  texLightFrag : [
    'precision mediump float;',
    'precision mediump int;',
    'uniform sampler2D texture;',

    'uniform vec2 texOffset;',

    'varying vec4 vertColor;',
    'varying vec4 backVertColor;',
    'varying vec4 vertTexCoord;',

    'void main() {',
    'gl_FragColor = texture2D(texture,vertTexCoord.st)*',
    '(gl_FrontFacing ? vertColor : backVertColor);',
    '}'
  ].join('\n'),
  testVert: [
    'attribute vec3 position;',
    'attribute vec3 normal;',

    'uniform mat4 modelviewMatrix;',
    'uniform mat4 transformMatrix;',
    'uniform mat4 normalMatrix;',

    'varying vec3 vertexNormal;',

    'void main(void) {',
    'vec3 zeroToOne = position / 1000.0;',
    'vec4 positionVec4 = vec4(zeroToOne, 1.);',
    'gl_Position = transformMatrix * modelviewMatrix * positionVec4;',
    'vertexNormal = vec3( normalMatrix * vec4( normal, 1.0 ) );',
    '}'
  ].join('\n'),
  testFrag: [
    'precision mediump float;',
    'varying vec3 vertexNormal;',
    'void main(void) {',
    'gl_FragColor = vec4(vertexNormal, 1.0);',
    '}'
  ].join('\n')
};

},{}],7:[function(require,module,exports){

'use strict';

var p5 = require('./core/core');
require('./color/p5.Color');
require('./core/p5.Element');
require('./typography/p5.Font');
require('./core/p5.Graphics');
require('./core/p5.Renderer2D');

require('./image/p5.Image');
require('./math/p5.Vector');
require('./io/p5.TableRow');
require('./io/p5.Table');

require('./color/creating_reading');
require('./color/setting');
require('./core/constants');
require('./utilities/conversion');
require('./utilities/array_functions');
require('./utilities/string_functions');
require('./core/environment');
require('./image/image');
require('./image/loading_displaying');
require('./image/pixels');
require('./io/files');
require('./events/keyboard');
require('./events/acceleration'); //john
require('./events/mouse');
require('./utilities/time_date');
require('./events/touch');
require('./math/math');
require('./math/calculation');
require('./math/random');
require('./math/noise');
require('./math/trigonometry');
require('./core/rendering');
require('./core/2d_primitives');

require('./core/attributes');
require('./core/curves');
require('./core/vertex');
require('./core/structure');
require('./core/transform');
require('./typography/attributes');
require('./typography/loading_displaying');

require('./3d/p5.Renderer3D');
require('./3d/p5.Geometry3D');
require('./3d/3d_primitives');
require('./3d/shaders');
require('./3d/p5.Matrix');

/**
 * _globalInit
 *
 * TODO: ???
 * if sketch is on window
 * assume "global" mode
 * and instantiate p5 automatically
 * otherwise do nothing
 *
 * @return {Undefined}
 */
var _globalInit = function() {
  if (!window.PHANTOMJS && !window.mocha) {
    // If there is a setup or draw function on the window
    // then instantiate p5 in "global" mode
    if((window.setup && typeof window.setup === 'function') ||
      (window.draw && typeof window.draw === 'function')) {
      new p5();
    }
  }
};

// TODO: ???
if (document.readyState === 'complete') {
  _globalInit();
} else {
  window.addEventListener('load', _globalInit , false);
}

module.exports = p5;

},{"./3d/3d_primitives":2,"./3d/p5.Geometry3D":3,"./3d/p5.Matrix":4,"./3d/p5.Renderer3D":5,"./3d/shaders":6,"./color/creating_reading":9,"./color/p5.Color":10,"./color/setting":11,"./core/2d_primitives":12,"./core/attributes":13,"./core/constants":15,"./core/core":16,"./core/curves":17,"./core/environment":18,"./core/p5.Element":20,"./core/p5.Graphics":21,"./core/p5.Renderer2D":23,"./core/rendering":24,"./core/structure":26,"./core/transform":27,"./core/vertex":28,"./events/acceleration":29,"./events/keyboard":30,"./events/mouse":31,"./events/touch":32,"./image/image":34,"./image/loading_displaying":35,"./image/p5.Image":36,"./image/pixels":37,"./io/files":38,"./io/p5.Table":39,"./io/p5.TableRow":40,"./math/calculation":41,"./math/math":42,"./math/noise":43,"./math/p5.Vector":44,"./math/random":46,"./math/trigonometry":47,"./typography/attributes":48,"./typography/loading_displaying":49,"./typography/p5.Font":50,"./utilities/array_functions":51,"./utilities/conversion":52,"./utilities/string_functions":53,"./utilities/time_date":54}],8:[function(require,module,exports){
/**
 * module Utils
 * submodule Color Utils
 * @for p5
 */

var p5 = require('../core/core');

p5.ColorUtils = {};

/**
 * For a color expressed as an HSBA array, return the corresponding RGBA value
 * @param {Array} hsba An 'array' object that represents a list of HSB colors
 * @param {Array} maxes An 'array' object that represents the HSB range maxes
 * @return {Array} an array of RGBA values, on a scale of 0-255
 */
p5.ColorUtils.hsbaToRGBA = function(hsba, maxes) {
  var h = hsba[0];
  var s = hsba[1];
  var v = hsba[2];
  var a = hsba[3] || maxes[3];
  h /= maxes[0];
  s /= maxes[1];
  v /= maxes[2];
  a /= maxes[3];
  // Adapted from http://www.easyrgb.com/math.html
  // hsv values = 0 - 1, rgb values = 0 - 255
  var RGBA = [];
  if(s===0){
    RGBA = [Math.round(v*255), Math.round(v*255), Math.round(v*255), a*255];
  } else {
    // h must be < 1
    var var_h = h * 6;
    if (var_h===6) {
      var_h = 0;
    }
    //Or ... var_i = floor( var_h )
    var var_i = Math.floor( var_h );
    var var_1 = v*(1-s);
    var var_2 = v*(1-s*(var_h-var_i));
    var var_3 = v*(1-s*(1-(var_h-var_i)));
    var r;
    var g;
    var b;
    if(var_i===0){
      r = v;
      g = var_3;
      b = var_1;
    }else if(var_i===1){
      r = var_2;
      g = v;
      b = var_1;
    }else if(var_i===2){
      r = var_1;
      g = v;
      b = var_3;
    }else if(var_i===3){
      r = var_1;
      g = var_2;
      b = v;
    }else if (var_i===4){
      r = var_3;
      g = var_1;
      b = v;
    }else{
      r = v;
      g = var_1;
      b = var_2;
    }
    RGBA = [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      a * 255
    ];
  }
  return RGBA;
};

/**
 * For a color expressed as an RGBA array, return the corresponding HSBA value
 *
 * @param {Array} rgba An 'array' object that represents a list of RGB colors
 * @param {Array} maxes An 'array' object that represents the RGB range maxes
 * @return {Array} an array of HSB values, scaled by the HSB-space maxes
 */
p5.ColorUtils.rgbaToHSBA = function(rgba, maxes) {
  var r = rgba[0]/maxes[0];
  var g = rgba[1]/maxes[1];
  var b = rgba[2]/maxes[2];
  var a = rgba[3]/maxes[3];

  var min = Math.min(r, g, b); //Min. value of RGB
  var max = Math.max(r, g, b); //Max. value of RGB
  var delta_max = max - min;             //Delta RGB value

  var h;
  var s;
  var v = max;

  if (delta_max === 0) { //This is a gray, no chroma...
    h = 0; //HSV results from 0 to 1
    s = 0;
  }
  else { //Chromatic data...
    s = delta_max/max;

    var delta_r = ( ( ( max - r ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    var delta_g = ( ( ( max - g ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    var delta_b = ( ( ( max - b ) / 6 ) + ( delta_max / 2 ) ) / delta_max;

    if (r === max) {
      h = delta_b - delta_g;
    } else if (g === max) {
      h = 1/3 + delta_r - delta_b;
    } else if (b === max) {
      h = 2/3 + delta_g - delta_r;
    }

    if (h < 0) {
      h += 1;
    }
    if (h > 1) {
      h -= 1;
    }
  }
  return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(v * 100),
      a * 1
    ];
};

/**
 * For a color expressed as an HSLA array, return the corresponding RGBA value
 *
 * @param  {Array} hsla An 'array' object that represents a list of HSL colors
 * @param  {Array} maxes An 'array' object that represents the HSL range maxes
 *
 * @return {Array} an array of RGBA values, on a scale of 0-255
 */
p5.ColorUtils.hslaToRGBA = function(hsla, maxes){
  var h = hsla[0];
  var s = hsla[1];
  var l = hsla[2];
  var a = hsla[3] || maxes[3];
  h /= maxes[0];
  s /= maxes[1];
  l /= maxes[2];
  a /= maxes[3];
  // Adapted from http://www.easyrgb.com/math.html
  // hsl values = 0 - 1, rgb values = 0 - 255
  var rgba = [];
  if(s === 0){
    rgba = [Math.round(l*255), Math.round(l*255), Math.round(l*255), a];
  } else {
    var m, n, r, g, b;

    n = l < 0.5 ? l * (1 + s) : (l + s) - (s * l);
    m = 2 * l - n;

    var convert = function(x, y, hue){
      if (hue < 0) {
        hue += 1;
      } else if (hue > 1) {
        hue -= 1;
      }

      if ( ( 6 * hue ) < 1 ) {
        return ( x + ( y - x ) * 6 * hue );
      } else if ( ( 2 * hue ) < 1 ) {
        return ( y );
      } else if ( ( 3 * hue ) < 2 ) {
        return ( x + ( y - x ) * ( ( 2 / 3 ) - hue ) * 6 );
      } else {
        return x;
      }
    };

    r = convert( m, n, h + ( 1 / 3 ) );
    g = convert( m, n, h );
    b = convert( m, n, h - ( 1 / 3 ) );

    rgba = [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      Math.round(a * 255)
    ];

  }

  return rgba;

};

/**
 * For a color expressed as an RGBA array, return the corresponding HSBA value
 *
 * @param {Array} rgba An 'array' object that represents a list of RGB colors
 * @param {Array} maxes An 'array' object that represents the RGB range maxes
 * @return {Array} an array of HSL values, scaled by the HSL-space maxes
 */
p5.ColorUtils.rgbaToHSLA = function(rgba, maxes) {
  var r = rgba[0]/maxes[0];
  var g = rgba[1]/maxes[1];
  var b = rgba[2]/maxes[2];
  var a = rgba[3]/maxes[3];

  var min = Math.min(r, g, b); //Min. value of RGB
  var max = Math.max(r, g, b); //Max. value of RGB
  var delta_max = max - min;             //Delta RGB value

  var h;
  var s;
  var l = (max + min) / 2;

  var delta_r;
  var delta_g;
  var delta_b;

  if (delta_max === 0) { // This is a gray, no chroma...
    h = 0;             // HSL results from 0 to 1
    s = 0;
  } else {              // Chromatic data...

    delta_r = ( ( ( max - r ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    delta_g = ( ( ( max - g ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    delta_b = ( ( ( max - b ) / 6 ) + ( delta_max / 2 ) ) / delta_max;

    if ( r === max ){
      h = delta_b - delta_g;
    } else if ( g === max ){
      h = ( 1 / 3 ) + delta_r - delta_b;
    } else if ( b === max ) {
      h = ( 2 / 3 ) + delta_g - delta_r;
    }

    if ( h < 0 ) {
      h += 1;
    }

    if ( h > 1 ) {
      h -= 1;
    }

    if ( l < 0.5 ){
      s = delta_max / ( max + min );
    } else {
      s = delta_max / ( 2 - max - min );
    }

  }
  return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100),
      a * 1
    ];
};

module.exports = p5.ColorUtils;

},{"../core/core":16}],9:[function(require,module,exports){
/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
require('./p5.Color');

/**
 * Extracts the alpha value from a color or pixel array.
 *
 * @method alpha
 * @param {Object} obj p5.Color object or pixel array
 * @example
 * <div>
 * <code>
 * noStroke();
 * c = color(0, 126, 255, 102);
 * fill(c);
 * rect(15, 15, 35, 70);
 * value = alpha(c);  // Sets 'value' to 102
 * fill(value);
 * rect(50, 15, 35, 70);
 * </code>
 * </div>
 */
p5.prototype.alpha = function(c) {
  if (c instanceof p5.Color || c instanceof Array) {
    return this.color(c).getAlpha();
  } else {
    throw new Error('Needs p5.Color or pixel array as argument.');
  }
};

/**
 * Extracts the blue value from a color or a pixel array.
 *
 * @method blue
 * @param {Object} obj p5.Color object or pixel array
 * @example
 * <div>
 * <code>
 * c = color(175, 100, 220);  // Define color 'c'
 * fill(c);  // Use color variable 'c' as fill color
 * rect(15, 20, 35, 60);  // Draw left rectangle
 *
 * blueValue = blue(c);  // Get blue in 'c'
 * println(blueValue);  // Prints "220.0"
 * fill(0, 0, blueValue);  // Use 'blueValue' in new fill
 * rect(50, 20, 35, 60);  // Draw right rectangle
 * </code>
 * </div>
 */
p5.prototype.blue = function(c) {
  if (c instanceof p5.Color || c instanceof Array) {
    return this.color(c).getBlue();
  } else {
    throw new Error('Needs p5.Color or pixel array as argument.');
  }
};

/**
 * Extracts the brightness value from a color.
 *
 * @method brightness
 * @param {Object} color p5.Color object
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * value = brightness(c);  // Sets 'value' to 255
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 */
p5.prototype.brightness = function(c) {
  if (c instanceof p5.Color || c instanceof Array) {
    return this.color(c).getBrightness();
  } else {
    throw new Error('Needs p5.Color or pixel array as argument.');
  }
};

/**
 * Creates colors for storing in variables of the color datatype. The
 * parameters are interpreted as RGB or HSB values depending on the
 * current colorMode(). The default mode is RGB values from 0 to 255
 * and, therefore, the function call color(255, 204, 0) will return a
 * bright yellow color.
 *
 * Note that if only one value is provided to color(), it will be interpreted
 * as a grayscale value. Add a second value, and it will be used for alpha
 * transparency. When three values are specified, they are interpreted as
 * either RGB or HSB values. Adding a fourth value applies alpha
 * transparency. If a single string parameter is provided it will be
 * interpreted as a CSS-compatible color string.
 *
 * Colors are stored as Numbers or Arrays.
 *
 * @method color
 * @param  {Number|String} v1      gray value or red or hue value relative to
 *                                 the current color range, or a color string
 * @param  {Number}        [v2]    gray value or green or saturation value
 *                                 relative to the current color range (or
 *                                 alpha value if first param is gray value)
 * @param  {Number}        [v3]    gray value or blue or brightness value
 *                                 relative to the current color range
 * @param  {Number}        [alpha] alpha value relative to current color range
 * @return {Array}                 resulting color
 *
 * @example
 * <div>
 * <code>
 * c = color(255, 204, 0);  // Define color 'c'
 * fill(c);  // Use color variable 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * rect(30, 20, 55, 55);  // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * c = color(255, 204, 0);  // Define color 'c'
 * fill(c);  // Use color variable 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * ellipse(25, 25, 80, 80);  // Draw left circle
 *
 * // Using only one value with color()
 * // generates a grayscale value.
 * c = color(65);  // Update 'c' with grayscale value
 * fill(c);  // Use updated 'c' as fill color
 * ellipse(75, 75, 80, 80);  // Draw right circle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG & CSS colors may be used,
 * c = color('magenta');
 * fill(c);  // Use 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * rect(20, 20, 60, 60);  // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // as can hex color codes:
 * c = color('#4F66A1');
 * fill(c);  // Use 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * rect(20, 20, 60, 60);  // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // RGB and RGBA color strings are also supported:
 * // these all set 'c' to the same color (solid blue)
 * c = color('rgb(0,0,255)');
 * c = color('rgb(0%, 0%, 100%)');
 * c = color('rgba(0, 0, 255, 1)');
 * c = color('rgba(0%, 0%, 100%, 1)');
 * fill(c);  // Use 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * rect(20, 20, 60, 60);  // Draw rectangle
 * </code>
 * </div>
 *
 *
 * <div>
 * <code>
 * // HSL color is also supported and can be specified
 * // by value
 * colorMode(HSL)
 * c = color(156, 100, 50, 1);
 * fill(c);  // Use 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * rect(20, 20, 60, 60);  // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // or by string
 * c = color('hsla(156, 100%, 50%, 1)');
 * fill(c);  // Use 'c' as fill color
 * noStroke();  // Don't draw a stroke around shapes
 * rect(20, 20, 60, 60);  // Draw rectangle
 * </code>
 * </div>
 *
 *
 * // if switching from RGB to HSB or HSL both modes must be declared
 * colorMode(RGB, 255);  // Use RGB with scale of 0-255
 * c = color(50, 55, 100);  // Create a color for 'c'
 * fill(c);  // Use color variable 'c' as fill color
 * rect(0, 10, 45, 80);  // Draw left rect
 *
 * colorMode(HSB, 100);  // Use HSB with scale of 0-100
 * c = color(50, 55, 100);  // Update 'c' with new color
 * fill(c);  // Use updated 'c' as fill color
 * rect(55, 10, 45, 80);  // Draw right rect
 * </code>
 * </div>
 */
p5.prototype.color = function () {
  if (arguments[0] instanceof p5.Color) {
    return arguments[0];
  } else if (arguments[0] instanceof Array) {
    return new p5.Color(this, arguments[0]);
  } else {
    var args = Array.prototype.slice.call(arguments);
    return new p5.Color(this, args);
  }
};
/**
 * Extracts the green value from a color or pixel array.
 *
 * @method green
 * @param {Object} color p5.Color object
 * @example
 * <div>
 * <code>
 * c = color(20, 75, 200);  // Define color 'c'
 * fill(c);  // Use color variable 'c' as fill color
 * rect(15, 20, 35, 60);  // Draw left rectangle
 *
 * greenValue = green(c);  // Get green in 'c'
 * println(greenValue);  // Print "75.0"
 * fill(0, greenValue, 0);  // Use 'greenValue' in new fill
 * rect(50, 20, 35, 60);  // Draw right rectangle
 * </code>
 * </div>
 */
p5.prototype.green = function(c) {
  if (c instanceof p5.Color || c instanceof Array) {
    return this.color(c).getGreen();
  } else {
    throw new Error('Needs p5.Color or pixel array as argument.');
  }
};

/**
 * Extracts the hue value from a color.
 *
 * @method hue
 * @param {Object} color p5.Color object
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * value = hue(c);  // Sets 'value' to "0"
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 */
p5.prototype.hue = function(c) {
  if (!(c instanceof p5.Color)) {
    throw new Error('Needs p5.Color as argument.');
  }
  return c.getHue();
};

/**
 * Calculates a color or colors between two color at a specific increment,
 * using gamma correction to blend colors in the linear RGB space.
 * The amt parameter is the amount to interpolate between the two values
 * where 0.0 equal to the first point, 0.1 is very near the first point,
 * 0.5 is halfway in between, etc. An amount below 0 will be treated as 0.
 * Likewise, amounts above 1 will be capped at 1. This is different from
 * the behavior of lerp(), but necessary because otherwise numbers outside
 * the range will produce strange and unexpected colors.
 *
 * The regular RGB color representation stores the square root of the
 * displayed color, not the value itself. Your monitor behaves as if it
 * squares the color values before displaying it. lerpColor first transforms
 * colors into the linear color space before blending, to correctly mix the
 * colors as two rays of light.
 *
 * @method lerpColor
 * @param  {Array/Number} c1  interpolate from this color
 * @param  {Array/Number} c2  interpolate to this color
 * @param  {Number}       amt number between 0 and 1
 * @return {Array/Number}     interpolated color
 * @example
 * <div>
 * <code>
 * stroke(255);
 * background(51);
 * from = color(204, 102, 0);
 * to = color(0, 102, 153);
 * interA = lerpColor(from, to, .33);
 * interB = lerpColor(from, to, .66);
 * fill(from);
 * rect(10, 20, 20, 60);
 * fill(interA);
 * rect(30, 20, 20, 60);
 * fill(interB);
 * rect(50, 20, 20, 60);
 * fill(to);
 * rect(70, 20, 20, 60);
 * </code>
 * </div>
 */
p5.prototype.lerpColor = function (c1, c2, amt) {
  amt = Math.max(Math.min(amt, 1), 0);
  if (c1 instanceof Array) {
    var c = [];
    for (var i = 0; i < c1.length; i++) {
      c.push(Math.sqrt(p5.prototype.lerp(c1[i]*c1[i], c2[i]*c2[i], amt)));
    }
    return c;
  } else if (c1 instanceof p5.Color) {
    var pc = [];
    for (var j = 0; j < 4; j++) {
      pc.push(Math.sqrt(p5.prototype.lerp(
        c1.rgba[j]*c1.rgba[j],
        c2.rgba[j]*c2.rgba[j],
        amt)));
    }
    return new p5.Color(this, pc);
  } else {
    return Math.sqrt(p5.prototype.lerp(c1*c1, c2*c2, amt));
  }
};

/**
 * Extracts the lightness value from a color.
 *
 * @method lightness
 * @param {Object} color p5.Color object
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSL);
 * c = color(156, 100, 50, 1);
 * fill(c);
 * rect(15, 20, 35, 60);
 * value = lightness(c);  // Sets 'value' to 50
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 */

p5.prototype.lightness = function(c) {
  if (c instanceof p5.Color || c instanceof Array) {
    return this.color(c).getLightness();
  } else {
    throw new Error('Needs p5.Color or pixel array as argument.');
  }
};

/**
 * Extracts the red value from a color or pixel array.
 *
 * @method red
 * @param {Object} obj p5.Color object or pixel array
 * @example
 * <div>
 * <code>
 * c = color(255, 204, 0);  // Define color 'c'
 * fill(c);  // Use color variable 'c' as fill color
 * rect(15, 20, 35, 60);  // Draw left rectangle
 *
 * redValue = red(c);  // Get red in 'c'
 * println(redValue);  // Print "255.0"
 * fill(redValue, 0, 0);  // Use 'redValue' in new fill
 * rect(50, 20, 35, 60);  // Draw right rectangle
 * </code>
 * </div>
 */
p5.prototype.red = function(c) {
  if (c instanceof p5.Color || c instanceof Array) {
    return this.color(c).getRed();
  } else {
    throw new Error('Needs p5.Color or pixel array as argument.');
  }
};

/**
 * Extracts the saturation value from a color.
 *
 * @method saturation
 * @param {Object} color p5.Color object
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * value = saturation(c);  // Sets 'value' to 126
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 */
p5.prototype.saturation = function(c) {
  if (!(c instanceof p5.Color)) {
    throw new Error('Needs p5.Color as argument.');
  }
  return c.getSaturation();
};



module.exports = p5;

},{"../core/core":16,"./p5.Color":10}],10:[function(require,module,exports){
/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 */

var p5 = require('../core/core');
var color_utils = require('./color_utils');
var constants = require('../core/constants');

/**
 *
 * @class p5.Color
 * @constructor
 */
p5.Color = function (pInst, vals) {
  this.maxArr = pInst._colorMaxes[pInst._colorMode];
  this.color_array = p5.Color._getFormattedColor.apply(pInst, vals);
  var isHSB = pInst._colorMode === constants.HSB,
      isRGB = pInst._colorMode === constants.RGB,
      isHSL = pInst._colorMode === constants.HSL;

  if (isRGB) {
    this.rgba = this.color_array;
  } else if (isHSL) {
    this.hsla = this.color_array;
    this.rgba = color_utils.hslaToRGBA(this.color_array, this.maxArr);
  } else if (isHSB) {
    this.hsba = this.color_array;
    this.rgba = color_utils.hsbaToRGBA(this.color_array, this.maxArr);
  } else {
    throw new Error(pInst._colorMode + 'is an invalid colorMode.');
  }

  return this;
};

p5.Color.prototype.getHue = function() {
  // Hue is consistent in both HSL & HSB
  if (this.hsla || this.hsba) {
    return this.hsla ? this.hsla[0] : this.hsba[0];
  } else {
    this.hsla = color_utils.rgbaToHSLA(this.color_array, this.maxArr);
    return this.hsla[0];
  }
};

p5.Color.prototype.getSaturation = function() {
  // Saturation exists in both HSB and HSL, but returns different values
  // We are preferring HSL here (because it is a web color space)
  // until the global flag issue can be resolved
  if (this.hsla) {
    return this.hsla[1];
  } else if (this.hsba) {
    return this.hsba[1];
  } else {
    this.hsla = color_utils.rgbaToHSLA(this.color_array, this.maxArr);
    return this.hsla[1];
  }
};

// Brightness only exists as an HSB value
p5.Color.prototype.getBrightness = function() {
  if (this.hsba) {
    return this.hsba[2];
  } else {
    this.hsba = color_utils.rgbaToHSBA(this.color_array, this.maxArr);
    return this.hsba[2];
  }
};

// Lightness only exists as an HSL value
p5.Color.prototype.getLightness = function() {
  if (this.hsla) {
    return this.hsla[2];
  } else {
    this.hsla = color_utils.rgbaToHSLA(this.color_array, this.maxArr);
    return this.hsla[2];
  }
};

p5.Color.prototype.getRed = function() {
  return this.rgba[0];
};

p5.Color.prototype.getGreen = function() {
  return this.rgba[1];
};

p5.Color.prototype.getBlue = function() {
  return this.rgba[2];
};

p5.Color.prototype.getAlpha = function() {
  // Again this is a little sleight of hand until the global flag
  // issue is resolved. The presumption is that if alpha has been
  // specified in 0-1 space, the user wants that value out
  if (this.hsba || this.hsla) {
    return this.hsla ? this.hsla[3] : this.hsba[3];
  } else {
    return this.rgba[3];
  }
};

p5.Color.prototype.toString = function() {
  var a = this.rgba;
  for (var i=0; i<3; i++) {
    a[i] = Math.floor(a[i]);
  }
  var alpha = typeof a[3] !== 'undefined' ? a[3] / 255 : 1;
  return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
};

/**
 * These Regular Expressions are used to build up the patterns for matching
 * viable CSS color strings: fragmenting the regexes in this way increases
 * the legibility and comprehensibility of the code
 */
// Match any number of whitespace characters (including no whitespace)
var WHITESPACE = /\s*/;
// Match whole-number values, e.g `255` or `79`
var INTEGER = /(\d{1,3})/;
// Match decimal values, e.g `129.6`, `79`, or `.9`
// Note: R, G or B values of `.9` are not parsed by IE: however, they are
// supported here to provide more consistent color string parsing
var DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/;
// Match decimal values followed by a percent sign
var PERCENT = new RegExp(DECIMAL.source + '%');

var namedColors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};

// Regular Expressions for use identifying color pattern strings
var colorPatterns = {
  /**
   * Regular expression for matching colors in format #XXX,
   * e.g. #416
   */
  HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,

  /**
   * Regular expression for matching colors in format #XXXXXX,
   * e.g. #b4d455
   */
  HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

  /**
   * Regular expression for matching colors in format rgb(R, G, B),
   * e.g. rgb(255, 0, 128)
   */
  RGB: new RegExp([
    // Defining RegExp this way makes it more obvious where whitespace
    // (`\s*`) is permitted between tokens
    '^rgb\\(',
    INTEGER.source,
    ',',
    INTEGER.source,
    ',',
    INTEGER.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),


  /**
   * Regular expression for matching colors in format rgb(R%, G%, B%),
   * e.g. rgb(100%, 0%, 28.9%)
   */
  RGB_PERCENT: new RegExp([
    // Defining RegExp this way makes it more obvious where whitespace
    // (`\s*`) is permitted between tokens
    '^rgb\\(',
    PERCENT.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format rgb(R, G, B, A),
   * e.g. rgb(255, 0, 128, 0.25)
   */
  RGBA: new RegExp([
    '^rgba\\(',
    INTEGER.source,
    ',',
    INTEGER.source,
    ',',
    INTEGER.source,
    ',',
    DECIMAL.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format rgb(R%, G%, B%, A),
   * e.g. rgb(100%, 0%, 28.9%. 0.5)
   */
  RGBA_PERCENT: new RegExp([
    '^rgba\\(',
    PERCENT.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    ',',
    DECIMAL.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format hsla(H, S%, L%),
   * e.g. hsl(100, 40%, 28.9%,)
   */
  HSL: new RegExp([
    '^hsl\\(',
    INTEGER.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format hsla(H, S%, L%, A),
   * e.g. hsla(100, 40%, 28.9%, 0.5)
   */
  HSLA: new RegExp([
    '^hsla\\(',
    INTEGER.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    ',',
    DECIMAL.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

};

/**
 * For a number of different inputs, returns a color formatted as
 * [r, g, b, a].
 *
 * @param {Array-like} args An 'array-like' object that represents a list of
 *                          arguments
 * @return {Array}          a color formatted as [r, g, b, a]
 *                          Example:
 *                          input        ==> output
 *                          g            ==> [g, g, g, 255]
 *                          g,a          ==> [g, g, g, a]
 *                          r, g, b      ==> [r, g, b, 255]
 *                          r, g, b, a   ==> [r, g, b, a]
 *                          [g]          ==> [g, g, g, 255]
 *                          [g, a]       ==> [g, g, g, a]
 *                          [r, g, b]    ==> [r, g, b, 255]
 *                          [r, g, b, a] ==> [r, g, b, a]
 * @example
 * <div>
 * <code>
 * // todo
 * </code>
 * </div>
 */
p5.Color._getFormattedColor = function () {
  var numArgs = arguments.length,
      mode    = this._colorMode,
      first, second, third, alpha, str, vals;


  // Handle [r,g,b,a] or [h,s,l,a] color values
  if (numArgs >= 3) {
    first   = arguments[0];
    second  = arguments[1];
    third   = arguments[2];
    alpha   = typeof arguments[3] === 'number' ?
              arguments[3] : this._colorMaxes[mode][3];

  // Handle strings: named colors, hex values, css strings
  } else if (numArgs === 1 && typeof arguments[0] === 'string') {
    str = arguments[0].trim().toLowerCase();

    if (namedColors[str]) {
      // Handle named color values
      return p5.Color._getFormattedColor.apply(this, [namedColors[str]]);
    }

    // Work through available string patterns to determine how to proceed
    if (colorPatterns.HEX3.test(str)) {
      vals = colorPatterns.HEX3.exec(str).slice(1).map(function(color) {
        // Expand #RGB to #RRGGBB
        return parseInt(color + color, 16);
      });
    } else if (colorPatterns.HEX6.test(str)) {
      vals = colorPatterns.HEX6.exec(str).slice(1).map(function(color) {
        return parseInt(color, 16);
      });
    } else if (colorPatterns.RGB.test(str)) {
      vals = colorPatterns.RGB.exec(str).slice(1).map(function(color) {
        return parseInt(color, 10);
      });
    } else if (colorPatterns.RGB_PERCENT.test(str)) {
      vals = colorPatterns.RGB_PERCENT.exec(str).slice(1)
        .map(function(color) {
          return parseInt(parseFloat(color) / 100 * 255, 10);
        });
    } else if (colorPatterns.RGBA.test(str)) {
      vals = colorPatterns.RGBA.exec(str).slice(1)
        .map(function(color, idx) {
          if (idx === 3) {
            // Alpha value is a decimal: multiply by 255
            return parseInt(parseFloat(color) * 255, 10);
          }
          return parseInt(color, 10);
        });
    } else if (colorPatterns.RGBA_PERCENT.test(str)) {
      vals = colorPatterns.RGBA_PERCENT.exec(str).slice(1)
        .map(function(color, idx) {
          if (idx === 3) {
            // Alpha value is a decimal: multiply by 255
            return parseInt(parseFloat(color) * 255, 10);
          }
          return parseInt(parseFloat(color) / 100 * 255, 10);
        });
    } else if (colorPatterns.HSL.test(str)) {
      vals = colorPatterns.HSL.exec(str).slice(1).map(function(color) {
        return parseInt(color, 10);
      });
    } else if (colorPatterns.HSLA.test(str)) {
      vals = colorPatterns.HSLA.exec(str).slice(1).map(function(color) {
        return parseFloat(color, 10);
      });
    } else {
      // Input did not match any CSS Color pattern: Default to white
      vals = [255];
    }

    // Re-run _getFormattedColor with the values parsed out of the string
    return p5.Color._getFormattedColor.apply(this, vals);

  // Handle greyscale color mode
  } else if (numArgs === 1 && typeof arguments[0] === 'number') {
    // When users pass only one argument, they are presumed to be
    // working in grayscale mode.
    if (mode === constants.RGB) {
      first = second = third = arguments[0];
    } else if (mode === constants.HSB || mode === constants.HSL) {
      // In order for grayscale to work with HSB & HSL, the saturation
      // (the second argument) must be 0.
      first = third = arguments[0];
      second = 0;
    }
    alpha = typeof arguments[1] === 'number' ?
                   arguments[1] : this._colorMaxes[mode][3];

  // Handle brightness and alpha (grayscale)
  } else if (numArgs === 2 &&
             typeof arguments[0] === 'number' &&
             typeof arguments[1] === 'number') {
    // When users pass only one argument, they are presumed to be
    // working in grayscale mode.
    if (mode === constants.RGB) {
      first = second = third = arguments[0];
    } else if (mode === constants.HSB || mode === constants.HSL) {
      // In order for grayscale to work with HSB & HSL, the saturation
      // (the second argument) must be 0.
      first = third = arguments[0];
      second = 0;
    }
    alpha = arguments[1];
  } else {
    throw new Error (arguments + 'is not a valid color representation.');
  }
  return [
    first,
    second,
    third,
    alpha
  ];
};

module.exports = p5.Color;

},{"../core/constants":15,"../core/core":16,"./color_utils":8}],11:[function(require,module,exports){
/**
 * @module Color
 * @submodule Setting
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');
require('./p5.Color');

p5.prototype._doStroke = true;
p5.prototype._doFill = true;
p5.prototype._strokeSet = false;
p5.prototype._fillSet = false;
p5.prototype._colorMode = constants.RGB;
p5.prototype._colorMaxes = {
  rgb: [255, 255, 255, 255],
  hsb: [360, 100, 100, 1],
  hsl: [360, 100, 100, 1]
};

/**
 * The background() function sets the color used for the background of the
 * p5.js canvas. The default background is light gray. This function is
 * typically used within draw() to clear the display window at the beginning
 * of each frame, but it can be used inside setup() to set the background on
 * the first frame of animation or if the background need only be set once.
 *
 * @method background
 * @param {Number|String|p5.Color|p5.Image} v1   gray value, red or hue value
 *                                               (depending on the current
 *                                               color mode), color string,
 *                                               p5.Color, or p5.Image
 * @param {Number}                          [v2] green or saturation value
 *                                               (depending on the current
 *                                               color mode)
 * @param {Number}                          [v3] blue or brightness value
 *                                               (depending on the current
 *                                               color mode)
 * @param {Number}                          [a]  opacity of the background
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * background(51);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * background(255, 204, 0);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values
 * colorMode(HSB);
 * background(255, 204, 100);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG/CSS color string
 * background('red');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // three-digit hexadecimal RGB notation
 * background('#fae');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // six-digit hexadecimal RGB notation
 * background('#222222');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGB notation
 * background('rgb(0,255,0)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGBA notation
 * background('rgba(0,255,0, 0.25)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGB notation
 * background('rgb(100%,0%,10%)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGBA notation
 * background('rgba(100%,0%,100%,0.5)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * background(color(0, 0, 255));
 * </code>
 * </div>
 */
p5.prototype.background = function() {
  if (arguments[0] instanceof p5.Image) {
    this.image(arguments[0], 0, 0, this.width, this.height);
  } else {
    this._graphics.background.apply(this._graphics, arguments);
  }
  return this;
};

/**
 * Clears the pixels within a buffer. This function only works on p5.Canvas
 * objects created with the createCanvas() function; it won't work with the
 * main display window. Unlike the main graphics context, pixels in
 * additional graphics areas created with createGraphics() can be entirely
 * or partially transparent. This function clears everything to make all of
 * the pixels 100% transparent.
 *
 * @method clear
 * @example
 * <div>
 * <code>
 * </code>
 * </div>
 */
p5.prototype.clear = function() {
  this._graphics.clear();
  return this;
};

/**
 * Changes the way p5.js interprets color data. By default, the parameters
 * for fill(), stroke(), background(), and color() are defined by values
 * between 0 and 255 using the RGB color model. The colorMode() function is
 * used to switch color systems. Regardless of color system, all value ranges
 * are presumed to be 0–255 unless explicitly set otherwise. That is,
 * for a standard HSB range, one would pass colorMode(HSB, 360, 100, 100, 1).
 *
 * @method colorMode
 * @param {Number|Constant} mode either RGB or HSB, corresponding to
 *                               Red/Green/Blue and Hue/Saturation/Brightness
 * @param {Number|Constant} max1 range for the red or hue depending on the
 *                               current color mode, or range for all values
 * @param {Number|Constant} max2 range for the green or saturation depending
 *                               on the current color mode
 * @param {Number|Constant} max3 range for the blue or brightness depending
 *                               on the current color mode
 * @param {Number|Constant} maxA range for the alpha
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(RGB, 100);
 * for (i = 0; i < 100; i++) {
 *   for (j = 0; j < 100; j++) {
 *     stroke(i, j, 0);
 *     point(i, j);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 100);
 * for (i = 0; i < 100; i++) {
 *   for (j = 0; j < 100; j++) {
 *     stroke(i, j, 100);
 *     point(i, j);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.colorMode = function() {
  if (arguments[0] === constants.RGB ||
      arguments[0] === constants.HSB ||
      arguments[0] === constants.HSL) {
    this._colorMode = arguments[0];

    var maxArr = this._colorMaxes[this._colorMode];

    if (arguments.length === 2) {
      maxArr[0] = arguments[1];
      maxArr[1] = arguments[1];
      maxArr[2] = arguments[1];
      maxArr[3] = arguments[1];
    } else if (arguments.length > 2) {
      maxArr[0] = arguments[1];
      maxArr[1] = arguments[2];
      maxArr[2] = arguments[3];
    }
    if (arguments.length === 5) {
      maxArr[3] = arguments[4];
    }
  }
  return this;
};

/**
 * Sets the color used to fill shapes. For example, if you run
 * fill(204, 102, 0), all subsequent shapes will be filled with orange. This
 * color is either specified in terms of the RGB or HSB color depending on
 * the current colorMode(). (The default color space is RGB, with each value
 * in the range from 0 to 255.) If a single string argument is provided, RGB,
 * RGBA and Hex CSS color strings and all named color strings are supported.
 * A p5 Color object can also be provided to set the fill color.
 *
 * @method fill
 * @param {Number|Array|String|p5.Color} v1   gray value, red or hue value
 *                                            (depending on the current color
 *                                            mode), or color Array, or CSS
 *                                            color string
 * @param {Number}                       [v2] green or saturation value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [v3] blue or brightness value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [a]  opacity of the background
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * fill(51);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * fill(255, 204, 0);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values
 * colorMode(HSB);
 * fill(255, 204, 100);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG/CSS color string
 * fill('red');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // three-digit hexadecimal RGB notation
 * fill('#fae');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // six-digit hexadecimal RGB notation
 * fill('#222222');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGB notation
 * fill('rgb(0,255,0)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGBA notation
 * fill('rgba(0,255,0, 0.25)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGB notation
 * fill('rgb(100%,0%,10%)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGBA notation
 * fill('rgba(100%,0%,100%,0.5)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * fill(color(0, 0, 255));
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.fill = function() {
  this._setProperty('_fillSet', true);
  this._setProperty('_doFill', true);
  this._graphics.fill.apply(this._graphics, arguments);
  return this;
};

/**
 * Disables filling geometry. If both noStroke() and noFill() are called,
 * nothing will be drawn to the screen.
 *
 * @method noFill
 * @example
 * <div>
 * <code>
 * rect(15, 10, 55, 55);
 * noFill();
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.noFill = function() {
  this._setProperty('_doFill', false);
  return this;
};

/**
 * Disables drawing the stroke (outline). If both noStroke() and noFill()
 * are called, nothing will be drawn to the screen.
 *
 * @method noStroke
 * @example
 * <div>
 * <code>
 * noStroke();
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.noStroke = function() {
  this._setProperty('_doStroke', false);
  return this;
};

/**
 * Sets the color used to draw lines and borders around shapes. This color
 * is either specified in terms of the RGB or HSB color depending on the
 * current colorMode() (the default color space is RGB, with each value in
 * the range from 0 to 255). If a single string argument is provided, RGB,
 * RGBA and Hex CSS color strings and all named color strings are supported.
 * A p5 Color object can also be provided to set the stroke color.
 *
 * @method stroke
 * @param {Number|Array|String|p5.Color} v1   gray value, red or hue value
 *                                            (depending on the current color
 *                                            mode), or color Array, or CSS
 *                                            color string
 * @param {Number}                       [v2] green or saturation value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [v3] blue or brightness value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [a]  opacity of the background
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * strokeWeight(4);
 * stroke(51);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * stroke(255, 204, 0);
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values
 * colorMode(HSB);
 * strokeWeight(4);
 * stroke(255, 204, 100);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG/CSS color string
 * stroke('red');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // three-digit hexadecimal RGB notation
 * stroke('#fae');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // six-digit hexadecimal RGB notation
 * stroke('#222222');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGB notation
 * stroke('rgb(0,255,0)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGBA notation
 * stroke('rgba(0,255,0,0.25)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGB notation
 * stroke('rgb(100%,0%,10%)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGBA notation
 * stroke('rgba(100%,0%,100%,0.5)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * stroke(color(0, 0, 255));
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.stroke = function() {
  this._setProperty('_strokeSet', true);
  this._setProperty('_doStroke', true);
  this._graphics.stroke.apply(this._graphics, arguments);
  return this;
};



module.exports = p5;

},{"../core/constants":15,"../core/core":16,"./p5.Color":10}],12:[function(require,module,exports){
/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('./core');
var constants = require('./constants');

require('./error_helpers');

/**
 * Draw an arc to the screen. If called with only a, b, c, d, start, and
 * stop, the arc will pe drawn as an open pie. If mode is provided, the arc
 * will be drawn either open, as a chord, or as a pie as specified. The
 * origin may be changed with the ellipseMode() function.
 *
 * @method arc
 * @param  {Number} a      x-coordinate of the arc's ellipse
 * @param  {Number} b      y-coordinate of the arc's ellipse
 * @param  {Number} c      width of the arc's ellipse by default
 * @param  {Number} d      height of the arc's ellipse by default
 * @param  {Number} start  angle to start the arc, specified in radians
 * @param  {Number} stop   angle to stop the arc, specified in radians
 * @param  {String} [mode] optional parameter to determine the way of drawing
 *                         the arc
 * @return {Object}        the p5 object
 * @example
 * <div>
 * <code>
 * arc(50, 55, 50, 50, 0, HALF_PI);
 * noFill();
 * arc(50, 55, 60, 60, HALF_PI, PI);
 * arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
 * arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, CHORD);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, PIE);
 * </code>
 * </div>
 */
p5.prototype.arc = function(x, y, w, h, start, stop, mode) {
  this._validateParameters(
    'arc',
    arguments,
    [
      ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
      [ 'Number', 'Number', 'Number', 'Number',
        'Number', 'Number', 'String' ]
    ]
  );

  if (!this._doStroke && !this._doFill) {
    return this;
  }
  if (this._angleMode === constants.DEGREES) {
    start = this.radians(start);
    stop = this.radians(stop);
  }

  // Make all angles positive...
  while (start < 0) {
    start += constants.TWO_PI;
  }
  while (stop < 0) {
    stop += constants.TWO_PI;
  }
  // ...and confine them to the interval [0,TWO_PI).
  start %= constants.TWO_PI;
  stop %= constants.TWO_PI;

  // Adjust angles to counter linear scaling.
  if (start <= constants.HALF_PI) {
    start = Math.atan(w / h * Math.tan(start));
  } else  if (start > constants.HALF_PI && start <= 3 * constants.HALF_PI) {
    start = Math.atan(w / h * Math.tan(start)) + constants.PI;
  } else {
    start = Math.atan(w / h * Math.tan(start)) + constants.TWO_PI;
  }
  if (stop <= constants.HALF_PI) {
    stop = Math.atan(w / h * Math.tan(stop));
  } else  if (stop > constants.HALF_PI && stop <= 3 * constants.HALF_PI) {
    stop = Math.atan(w / h * Math.tan(stop)) + constants.PI;
  } else {
    stop = Math.atan(w / h * Math.tan(stop)) + constants.TWO_PI;
  }

  // Exceed the interval if necessary in order to preserve the size and
  // orientation of the arc.
  if (start > stop) {
    stop += constants.TWO_PI;
  }
  // p5 supports negative width and heights for ellipses
  w = Math.abs(w);
  h = Math.abs(h);
  this._graphics.arc(x, y, w, h, start, stop, mode);
  return this;
};

/**
 * Draws an ellipse (oval) to the screen. An ellipse with equal width and
 * height is a circle. By default, the first two parameters set the location,
 * and the third and fourth parameters set the shape's width and height. The
 * origin may be changed with the ellipseMode() function.
 *
 * @method ellipse
 * @param  {Number} a x-coordinate of the ellipse.
 * @param  {Number} b y-coordinate of the ellipse.
 * @param  {Number} c width of the ellipse.
 * @param  {Number} d height of the ellipse.
 * @return {p5}       the p5 object
 * @example
 * <div>
 * <code>
 * ellipse(56, 46, 55, 55);
 * </code>
 * </div>
 */
p5.prototype.ellipse = function(x, y, w, h) {
  this._validateParameters(
    'ellipse',
    arguments,
    ['Number', 'Number', 'Number', 'Number']
  );

  if (!this._doStroke && !this._doFill) {
    return this;
  }
  // p5 supports negative width and heights for ellipses
  w = Math.abs(w);
  h = Math.abs(h);
  //@TODO add catch block here if this._graphics
  //doesn't have the method implemented yet
  this._graphics.ellipse(x, y, w, h);
  return this;
};
/**
 * Draws a line (a direct path between two points) to the screen. The version
 * of line() with four parameters draws the line in 2D. To color a line, use
 * the stroke() function. A line cannot be filled, therefore the fill()
 * function will not affect the color of a line. 2D lines are drawn with a
 * width of one pixel by default, but this can be changed with the
 * strokeWeight() function.
 *
 * @method line
 * @param  {Number} x1 the x-coordinate of the first point
 * @param  {Number} y1 the y-coordinate of the first point
 * @param  {Number} x2 the x-coordinate of the second point
 * @param  {Number} y2 the y-coordinate of the second point
 * @return {p5}        the p5 object
 * @example
 * <div>
 * <code>
 * line(30, 20, 85, 75);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * line(30, 20, 85, 20);
 * stroke(126);
 * line(85, 20, 85, 75);
 * stroke(255);
 * line(85, 75, 30, 75);
 * </code>
 * </div>
 */
////commented out original
// p5.prototype.line = function(x1, y1, x2, y2) {
//   if (!this._doStroke) {
//     return this;
//   }
//   if(this._graphics.isP3D){
//   } else {
//     this._graphics.line(x1, y1, x2, y2);
//   }
// };
p5.prototype.line = function() {
  this._validateParameters(
    'line',
    arguments,
    [
      ['Number', 'Number', 'Number', 'Number'],
      ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
    ]
  );

  if (!this._doStroke) {
    return this;
  }
  //check whether we should draw a 3d line or 2d
  if(this._graphics.isP3D){
    this._graphics.line(arguments[0],
      arguments[1],
      arguments[2],
      arguments[3],
      arguments[4],
      arguments[5]);
  } else {
    this._graphics.line(arguments[0],
      arguments[1],
      arguments[2],
      arguments[3]);
  }
};

/**
 * Draws a point, a coordinate in space at the dimension of one pixel.
 * The first parameter is the horizontal value for the point, the second
 * value is the vertical value for the point.
 *
 * @method point
 * @param  {Number} x the x-coordinate
 * @param  {Number} y the y-coordinate
 * @return {p5}       the p5 object
 * @example
 * <div>
 * <code>
 * point(30, 20);
 * point(85, 20);
 * point(85, 75);
 * point(30, 75);
 * </code>
 * </div>
 */
p5.prototype.point = function(x, y) {
  this._validateParameters(
    'point',
    arguments,
    ['Number', 'Number']
  );

  if (!this._doStroke) {
    return this;
  }
  this._graphics.point(x, y);
  return this;
};


/**
 * Draw a quad. A quad is a quadrilateral, a four sided polygon. It is
 * similar to a rectangle, but the angles between its edges are not
 * constrained to ninety degrees. The first pair of parameters (x1,y1)
 * sets the first vertex and the subsequent pairs should proceed
 * clockwise or counter-clockwise around the defined shape.
 *
 * @method quad
 * @param {type} x1 the x-coordinate of the first point
 * @param {type} y1 the y-coordinate of the first point
 * @param {type} x2 the x-coordinate of the second point
 * @param {type} y2 the y-coordinate of the second point
 * @param {type} x3 the x-coordinate of the third point
 * @param {type} y3 the y-coordinate of the third point
 * @param {type} x4 the x-coordinate of the fourth point
 * @param {type} y4 the y-coordinate of the fourth point
 * @return {p5}     the p5 object
 * @example
 * <div>
 * <code>
 * quad(38, 31, 86, 20, 69, 63, 30, 76);
 * </code>
 * </div>
 */
p5.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._validateParameters(
    'quad',
    arguments,
    [ 'Number', 'Number', 'Number', 'Number',
      'Number', 'Number', 'Number', 'Number' ]
  );

  if (!this._doStroke && !this._doFill) {
    return this;
  }
  this._graphics.quad(x1, y1, x2, y2, x3, y3, x4, y4);
  return this;
};

/**
* Draws a rectangle to the screen. A rectangle is a four-sided shape with
* every angle at ninety degrees. By default, the first two parameters set
* the location of the upper-left corner, the third sets the width, and the
* fourth sets the height. The way these parameters are interpreted, however,
* may be changed with the rectMode() function. If provided, the fifth, sixth
* seventh and eighth parameters, if specified, determine corner radius for
* the top-right, top-left, lower-right and lower-left corners, respectively.
* An omitted corner radius parameter is set to the value of the previously
* specified radius value in the parameter list.
*
* @method rect
* @param  {Number} x  x-coordinate of the rectangle.
* @param  {Number} y  y-coordinate of the rectangle.
* @param  {Number} w  width of the rectangle.
* @param  {Number} h  height of the rectangle.
* @param  {Number} [tl] optional radius of top-left corner.
* @param  {Number} [tr] optional radius of top-right corner.
* @param  {Number} [br] optional radius of bottom-right corner.
* @param  {Number} [bl] optional radius of bottom-left corner.
* @return {p5}          the p5 object.
* @example
* <div>
* <code>
* // Draw a rectangle at location (30, 25) with a width and height of 55.
* rect(30, 20, 55, 55);
* </code>
* </div>
*
* <div>
* <code>
* // Draw a rectangle with rounded corners, each having a radius of 20.
* rect(30, 20, 55, 55, 20);
* </code>
* </div>
*
* <div>
* <code>
* // Draw a rectangle with rounded corners having the following radii:
* // top-left = 20, top-right = 15, bottom-right = 10, bottom-left = 5.
* rect(30, 20, 55, 55, 20, 15, 10, 5)
* </code>
* </div>
*/
p5.prototype.rect = function (x, y, w, h, tl, tr, br, bl) {
  this._validateParameters(
    'rect',
    arguments,
    [
      ['Number', 'Number', 'Number', 'Number'],
      ['Number', 'Number', 'Number', 'Number', 'Number'],
      [ 'Number', 'Number', 'Number', 'Number',
        'Number', 'Number', 'Number', 'Number', 'Number' ]
    ]
  );

  if (!this._doStroke && !this._doFill) {
    return;
  }
  this._graphics.rect(x, y, w, h, tl, tr, br, bl);
  return this;
};

/**
* A triangle is a plane created by connecting three points. The first two
* arguments specify the first point, the middle two arguments specify the
* second point, and the last two arguments specify the third point.
*
* @method triangle
* @param  {Number} x1 x-coordinate of the first point
* @param  {Number} y1 y-coordinate of the first point
* @param  {Number} x2 x-coordinate of the second point
* @param  {Number} y2 y-coordinate of the second point
* @param  {Number} x3 x-coordinate of the third point
* @param  {Number} y3 y-coordinate of the third point
* @return {p5}        the p5 object
* @example
* <div>
* <code>
* triangle(30, 75, 58, 20, 86, 75);
* </code>
* </div>
*/
p5.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
  this._validateParameters(
    'triangle',
    arguments,
    ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
  );

  if (!this._doStroke && !this._doFill) {
    return this;
  }
  this._graphics.triangle(x1, y1, x2, y2, x3, y3);
  return this;
};

module.exports = p5;

},{"./constants":15,"./core":16,"./error_helpers":19}],13:[function(require,module,exports){
/**
 * @module Shape
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('./core');
var constants = require('./constants');

p5.prototype._rectMode = constants.CORNER;
p5.prototype._ellipseMode = constants.CENTER;

/**
 * Modifies the location from which ellipses are drawn by changing the way
 * in which parameters given to ellipse() are interpreted.
 *
 * The default mode is ellipseMode(CENTER), which interprets the first two
 * parameters of ellipse() as the shape's center point, while the third and
 * fourth parameters are its width and height.
 *
 * ellipseMode(RADIUS) also uses the first two parameters of ellipse() as
 * the shape's center point, but uses the third and fourth parameters to
 * specify half of the shapes's width and height.
 *
 * ellipseMode(CORNER) interprets the first two parameters of ellipse() as
 * the upper-left corner of the shape, while the third and fourth parameters
 * are its width and height.
 *
 * ellipseMode(CORNERS) interprets the first two parameters of ellipse() as
 * the location of one corner of the ellipse's bounding box, and the third
 * and fourth parameters as the location of the opposite corner.
 *
 * The parameter must be written in ALL CAPS because Processing is a
 * case-sensitive language.
 *
 * @method ellipseMode
 * @param  {Number/Constant} mode either CENTER, RADIUS, CORNER, or CORNERS
 * @return {p5}                   the p5 object
 * @example
 * <div>
 * <code>
 * ellipseMode(RADIUS);  // Set ellipseMode to RADIUS
 * fill(255);  // Set fill to white
 * ellipse(50, 50, 30, 30);  // Draw white ellipse using RADIUS mode
 *
 * ellipseMode(CENTER);  // Set ellipseMode to CENTER
 * fill(100);  // Set fill to gray
 * ellipse(50, 50, 30, 30);  // Draw gray ellipse using CENTER mode
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * ellipseMode(CORNER);  // Set ellipseMode is CORNER
 * fill(255);  // Set fill to white
 * ellipse(25, 25, 50, 50);  // Draw white ellipse using CORNER mode
 *
 * ellipseMode(CORNERS);  // Set ellipseMode to CORNERS
 * fill(100);  // Set fill to gray
 * ellipse(25, 25, 50, 50);  // Draw gray ellipse using CORNERS mode
 * </code>
 * </div>
 */
p5.prototype.ellipseMode = function(m) {
  if (m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.RADIUS ||
    m === constants.CENTER) {
    this._ellipseMode = m;
  }
  return this;
};

/**
 * Draws all geometry with jagged (aliased) edges. Note that smooth() is
 * active by default, so it is necessary to call noSmooth() to disable
 * smoothing of geometry, images, and fonts.
 *
 * @method noSmooth
 * @return {p5} the p5 object
 * @example
 * <div>
 * <code>
 * background(0);
 * noStroke();
 * smooth();
 * ellipse(30, 48, 36, 36);
 * noSmooth();
 * ellipse(70, 48, 36, 36);
 * </code>
 * </div>
 */
p5.prototype.noSmooth = function() {
  this._graphics.noSmooth();
  return this;
};

/**
 * Modifies the location from which rectangles are drawn by changing the way
 * in which parameters given to rect() are interpreted.
 *
 * The default mode is rectMode(CORNER), which interprets the first two
 * parameters of rect() as the upper-left corner of the shape, while the
 * third and fourth parameters are its width and height.
 *
 * rectMode(CORNERS) interprets the first two parameters of rect() as the
 * location of one corner, and the third and fourth parameters as the
 * location of the opposite corner.
 *
 * rectMode(CENTER) interprets the first two parameters of rect() as the
 * shape's center point, while the third and fourth parameters are its
 * width and height.
 *
 * rectMode(RADIUS) also uses the first two parameters of rect() as the
 * shape's center point, but uses the third and fourth parameters to specify
 * half of the shapes's width and height.
 *
 * The parameter must be written in ALL CAPS because Processing is a
 * case-sensitive language.
 *
 * @method rectMode
 * @param  {Number/Constant} mode either CORNER, CORNERS, CENTER, or RADIUS
 * @return {p5}                   the p5 object
 * @example
 * <div>
 * <code>
 * rectMode(CORNER);  // Default rectMode is CORNER
 * fill(255);  // Set fill to white
 * rect(25, 25, 50, 50);  // Draw white rect using CORNER mode
 *
 * rectMode(CORNERS);  // Set rectMode to CORNERS
 * fill(100);  // Set fill to gray
 * rect(25, 25, 50, 50);  // Draw gray rect using CORNERS mode
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rectMode(RADIUS);  // Set rectMode to RADIUS
 * fill(255);  // Set fill to white
 * rect(50, 50, 30, 30);  // Draw white rect using RADIUS mode
 *
 * rectMode(CENTER);  // Set rectMode to CENTER
 * fill(100);  // Set fill to gray
 * rect(50, 50, 30, 30);  // Draw gray rect using CENTER mode
 * </code>
 * </div>
 */
p5.prototype.rectMode = function(m) {
  if (m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.RADIUS ||
    m === constants.CENTER) {
    this._rectMode = m;
  }
  return this;
};

/**
 * Draws all geometry with smooth (anti-aliased) edges. smooth() will also
 * improve image quality of resized images. Note that smooth() is active by
 * default; noSmooth() can be used to disable smoothing of geometry,
 * images, and fonts.
 *
 * @method smooth
 * @return {p5} the p5 object
 * @example
 * <div>
 * <code>
 * background(0);
 * noStroke();
 * smooth();
 * ellipse(30, 48, 36, 36);
 * noSmooth();
 * ellipse(70, 48, 36, 36);
 * </code>
 * </div>
 */
p5.prototype.smooth = function() {
  this._graphics.smooth();
  return this;
};

/**
 * Sets the style for rendering line endings. These ends are either squared,
 * extended, or rounded, each of which specified with the corresponding
 * parameters: SQUARE, PROJECT, and ROUND. The default cap is ROUND.
 *
 * @method strokeCap
 * @param  {Number/Constant} cap either SQUARE, PROJECT, or ROUND
 * @return {p5}                  the p5 object
 * @example
 * <div>
 * <code>
 * strokeWeight(12.0);
 * strokeCap(ROUND);
 * line(20, 30, 80, 30);
 * strokeCap(SQUARE);
 * line(20, 50, 80, 50);
 * strokeCap(PROJECT);
 * line(20, 70, 80, 70);
 * </code>
 * </div>
 */
p5.prototype.strokeCap = function(cap) {
  if (cap === constants.ROUND ||
    cap === constants.SQUARE ||
    cap === constants.PROJECT) {
    this._graphics.strokeCap(cap);
  }
  return this;
};

/**
 * Sets the style of the joints which connect line segments. These joints
 * are either mitered, beveled, or rounded and specified with the
 * corresponding parameters MITER, BEVEL, and ROUND. The default joint is
 * MITER.
 *
 * @method strokeJoin
 * @param  {Number/Constant} join either MITER, BEVEL, ROUND
 * @return {p5}                   the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(MITER);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(BEVEL);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(ROUND);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * </code>
 * </div>
 */
p5.prototype.strokeJoin = function(join) {
  if (join === constants.ROUND ||
    join === constants.BEVEL ||
    join === constants.MITER) {
    this._graphics.strokeJoin(join);
  }
  return this;
};

/**
 * Sets the width of the stroke used for lines, points, and the border
 * around shapes. All widths are set in units of pixels.
 *
 * @method strokeWeight
 * @param  {Number} weight the weight (in pixels) of the stroke
 * @return {p5}            the p5 object
 * @example
 * <div>
 * <code>
 * strokeWeight(1);  // Default
 * line(20, 20, 80, 20);
 * strokeWeight(4);  // Thicker
 * line(20, 40, 80, 40);
 * strokeWeight(10);  // Beastly
 * line(20, 70, 80, 70);
 * </code>
 * </div>
 */
p5.prototype.strokeWeight = function(w) {
  this._graphics.strokeWeight(w);
  return this;
};

module.exports = p5;

},{"./constants":15,"./core":16}],14:[function(require,module,exports){
/**
 * @requires constants
 */

var constants = require('./constants');

module.exports = {

  modeAdjust: function(a, b, c, d, mode) {
    if (mode === constants.CORNER) {
      return { x: a, y: b, w: c, h: d };
    } else if (mode === constants.CORNERS) {
      return { x: a, y: b, w: c-a, h: d-b };
    } else if (mode === constants.RADIUS) {
      return { x: a-c, y: b-d, w: 2*c, h: 2*d };
    } else if (mode === constants.CENTER) {
      return { x: a-c*0.5, y: b-d*0.5, w: c, h: d };
    }
  },

  arcModeAdjust: function(a, b, c, d, mode) {
    if (mode === constants.CORNER) {
      return { x: a+c*0.5, y: b+d*0.5, w: c, h: d };
    } else if (mode === constants.CORNERS) {
      return { x: a, y: b, w: c+a, h: d+b };
    } else if (mode === constants.RADIUS) {
      return { x: a, y: b, w: 2*c, h: 2*d };
    } else if (mode === constants.CENTER) {
      return { x: a, y: b, w: c, h: d };
    }
  }

};


},{"./constants":15}],15:[function(require,module,exports){
/**
 * @module Constants
 * @submodule Constants
 * @for p5
 */

var PI = Math.PI;

module.exports = {

  // GRAPHICS RENDERER
  P2D: 'p2d',
  WEBGL: 'webgl',

  // ENVIRONMENT
  ARROW: 'default',
  CROSS: 'crosshair',
  HAND: 'pointer',
  MOVE: 'move',
  TEXT: 'text',
  WAIT: 'wait',

  // TRIGONOMETRY

  /**
   * HALF_PI is a mathematical constant with the value
   * 1.57079632679489661923. It is half the ratio of the
   * circumference of a circle to its diameter. It is useful in
   * combination with the trigonometric functions sin() and cos().
   *
   * @property HALF_PI
   *
   * @example
   * <div><code>
   * arc(50, 50, 80, 80, 0, HALF_PI);
   * </code></div>
   *
   */
  HALF_PI: PI / 2,
  /**
   * PI is a mathematical constant with the value
   * 3.14159265358979323846. It is the ratio of the circumference
   * of a circle to its diameter. It is useful in combination with
   * the trigonometric functions sin() and cos().
   *
   * @property PI
   *
   * @example
   * <div><code>
   * arc(50, 50, 80, 80, 0, PI);
   * </code></div>
   */
  PI: PI,
  /**
   * QUARTER_PI is a mathematical constant with the value 0.7853982.
   * It is one quarter the ratio of the circumference of a circle to
   * its diameter. It is useful in combination with the trigonometric
   * functions sin() and cos().
   *
   * @property QUARTER_PI
   *
   * @example
   * <div><code>
   * arc(50, 50, 80, 80, 0, QUARTER_PI);
   * </code></div>
   *
   */
  QUARTER_PI: PI / 4,
  /**
   * TAU is an alias for TWO_PI, a mathematical constant with the
   * value 6.28318530717958647693. It is twice the ratio of the
   * circumference of a circle to its diameter. It is useful in
   * combination with the trigonometric functions sin() and cos().
   *
   * @property TAU
   *
   * @example
   * <div><code>
   * arc(50, 50, 80, 80, 0, TAU);
   * </code></div>
   *
   */
  TAU: PI * 2,
  /**
   * TWO_PI is a mathematical constant with the value
   * 6.28318530717958647693. It is twice the ratio of the
   * circumference of a circle to its diameter. It is useful in
   * combination with the trigonometric functions sin() and cos().
   *
   * @property TWO_PI
   *
   * @example
   * <div><code>
   * arc(50, 50, 80, 80, 0, TWO_PI);
   * </code></div>
   *
   */
  TWO_PI: PI * 2,
  DEGREES: 'degrees',
  RADIANS: 'radians',

  // SHAPE
  CORNER: 'corner',
  CORNERS: 'corners',
  RADIUS: 'radius',
  RIGHT: 'right',
  LEFT: 'left',
  CENTER: 'center',
  TOP: 'top',
  BOTTOM: 'bottom',
  BASELINE: 'alphabetic',
  POINTS: 'points',
  LINES: 'lines',
  TRIANGLES: 'triangles',
  TRIANGLE_FAN: 'triangles_fan',
  TRIANGLE_STRIP: 'triangles_strip',
  QUADS: 'quads',
  QUAD_STRIP: 'quad_strip',
  CLOSE: 'close',
  OPEN: 'open',
  CHORD: 'chord',
  PIE: 'pie',
  PROJECT: 'square', // PEND: careful this is counterintuitive
  SQUARE: 'butt',
  ROUND: 'round',
  BEVEL: 'bevel',
  MITER: 'miter',

  // COLOR
  RGB: 'rgb',
  HSB: 'hsb',
  HSL: 'hsl',

  // DOM EXTENSION
  AUTO: 'auto',

  // INPUT
  ALT: 18,
  BACKSPACE: 8,
  CONTROL: 17,
  DELETE: 46,
  DOWN_ARROW: 40,
  ENTER: 13,
  ESCAPE: 27,
  LEFT_ARROW: 37,
  OPTION: 18,
  RETURN: 13,
  RIGHT_ARROW: 39,
  SHIFT: 16,
  TAB: 9,
  UP_ARROW: 38,

  // RENDERING
  BLEND: 'normal',
  ADD: 'lighter',
  //ADD: 'add', //
  //SUBTRACT: 'subtract', //
  DARKEST: 'darken',
  LIGHTEST: 'lighten',
  DIFFERENCE: 'difference',
  EXCLUSION: 'exclusion',
  MULTIPLY: 'multiply',
  SCREEN: 'screen',
  REPLACE: 'source-over',
  OVERLAY: 'overlay',
  HARD_LIGHT: 'hard-light',
  SOFT_LIGHT: 'soft-light',
  DODGE: 'color-dodge',
  BURN: 'color-burn',

  // FILTERS
  THRESHOLD: 'threshold',
  GRAY: 'gray',
  OPAQUE: 'opaque',
  INVERT: 'invert',
  POSTERIZE: 'posterize',
  DILATE: 'dilate',
  ERODE: 'erode',
  BLUR: 'blur',

  // TYPOGRAPHY
  NORMAL: 'normal',
  ITALIC: 'italic',
  BOLD: 'bold',

  // TYPOGRAPHY-INTERNAL
  _DEFAULT_TEXT_FILL: '#000000',
  _DEFAULT_LEADMULT: 1.25,
  _CTX_MIDDLE: 'middle',

  // VERTICES
  LINEAR: 'linear',
  QUADRATIC: 'quadratic',
  BEZIER: 'bezier',
  CURVE: 'curve',

  // DEFAULTS
  _DEFAULT_STROKE: '#000000',
  _DEFAULT_FILL: '#FFFFFF'

};

},{}],16:[function(require,module,exports){
/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires constants
 */

'use strict';

require('./shim');

// Core needs the PVariables object
var constants = require('./constants');

/**
 * This is the p5 instance constructor.
 *
 * A p5 instance holds all the properties and methods related to
 * a p5 sketch.  It expects an incoming sketch closure and it can also
 * take an optional node parameter for attaching the generated p5 canvas
 * to a node.  The sketch closure takes the newly created p5 instance as
 * its sole argument and may optionally set preload(), setup(), and/or
 * draw() properties on it for running a sketch.
 *
 * A p5 sketch can run in "global" or "instance" mode:
 * "global"   - all properties and methods are attached to the window
 * "instance" - all properties and methods are bound to this p5 object
 *
 * @param  {Function}    sketch a closure that can set optional preload(),
 *                              setup(), and/or draw() properties on the
 *                              given p5 instance
 * @param  {HTMLElement|boolean} node element to attach canvas to, if a
 *                                    boolean is passed in use it as sync
 * @param  {boolean}     [sync] start synchronously (optional)
 * @return {p5}                 a p5 instance
 */
var p5 = function(sketch, node, sync) {

  if (arguments.length === 2 && typeof node === 'boolean') {
    sync = node;
    node = undefined;
  }

  //////////////////////////////////////////////
  // PUBLIC p5 PROPERTIES AND METHODS
  //////////////////////////////////////////////


  /**
   * Called directly before setup(), the preload() function is used to handle
   * asynchronous loading of external files. If a preload function is
   * defined, setup() will wait until any load calls within have finished.
   * Nothing besides load calls should be inside preload (loadImage,
   * loadJSON, loadFont, loadStrings, etc).
   *
   * @method preload
   * @example
   * <div><code>
   * var img;
   * var c;
   * function preload() {  // preload() runs once
   *   img = loadImage('assets/laDefense.jpg');
   * }
   *
   * function setup() {  // setup() waits until preload() is done
   *   img.loadPixels();
   *   // get color of middle pixel
   *   c = img.get(img.width/2, img.height/2);
   * }
   *
   * function draw() {
   *   background(c);
   *   image(img, 25, 25, 50, 50);
   * }
   * </code></div>
   */

  /**
   * The setup() function is called once when the program starts. It's used to
   * define initial environment properties such as screen size and background
   * color and to load media such as images and fonts as the program starts.
   * There can only be one setup() function for each program and it shouldn't
   * be called again after its initial execution. Note: Variables declared
   * within setup() are not accessible within other functions, including
   * draw().
   *
   * @method setup
   * @example
   * <div><code>
   * var a = 0;
   *
   * function setup() {
   *   background(0);
   *   noStroke();
   *   fill(102);
   * }
   *
   * function draw() {
   *   rect(a++%width, 10, 2, 80);
   * }
   * </code></div>
   */

  /**
   * Called directly after setup(), the draw() function continuously executes
   * the lines of code contained inside its block until the program is stopped
   * or noLoop() is called. draw() is called automatically and should never be
   * called explicitly.
   *
   * It should always be controlled with noLoop(), redraw() and loop(). After
   * noLoop() stops the code in draw() from executing, redraw() causes the
   * code inside draw() to execute once, and loop() will cause the code
   * inside draw() to resume executing continuously.
   *
   * The number of times draw() executes in each second may be controlled with
   * the frameRate() function.
   *
   * There can only be one draw() function for each sketch, and draw() must
   * exist if you want the code to run continuously, or to process events such
   * as mousePressed(). Sometimes, you might have an empty call to draw() in
   * your program, as shown in the above example.
   *
   * @method draw
   * @example
   * <div><code>
   * var yPos = 0;
   * function setup() {  // setup() runs once
   *   frameRate(30);
   * }
   * function draw() {  // draw() loops forever, until stopped
   *   background(204);
   *   yPos = yPos - 1;
   *   if (yPos < 0) {
   *     yPos = height;
   *   }
   *   line(0, yPos, width, yPos);
   * }
   * </code></div>
   */


  //////////////////////////////////////////////
  // PRIVATE p5 PROPERTIES AND METHODS
  //////////////////////////////////////////////

  this._setupDone = false;
  this.pixelDensity = window.devicePixelRatio || 1; // for handling hidpi
  this._userNode = node;
  this._curElement = null;
  this._elements = [];
  this._preloadCount = 0;
  this._updateInterval = 0;
  this._isGlobal = false;
  this._loop = true;
  this._styles = [];
  this._defaultCanvasSize = {
    width: 100,
    height: 100
  };
  this._events = { // keep track of user-events for unregistering later
    'mousemove': null,
    'mousedown': null,
    'mouseup': null,
    'click': null,
    'mouseover': null,
    'mouseout': null,
    'keydown': null,
    'keyup': null,
    'keypress': null,
    'touchstart': null,
    'touchmove': null,
    'touchend': null,
    'resize': null,
    'blur': null
  };

  if (window.DeviceOrientationEvent) {
    this._events.deviceorientation = null;
  } else if (window.DeviceMotionEvent) {
    this._events.devicemotion = null;
  } else {
    this._events.MozOrientation = null;
  }

  //FF doesn't recognize mousewheel as of FF3.x
  if (/Firefox/i.test(navigator.userAgent)) {
    this._events.DOMMouseScroll = null;
  } else {
    this._events.mousewheel = null;
  }


  this._loadingScreenId = 'p5_loading';

  this._start = function () {
    // Find node if id given
    if (this._userNode) {
      if (typeof this._userNode === 'string') {
        this._userNode = document.getElementById(this._userNode);
      }
    }

    // Setup loading screen
    // Set loading scfeen into dom if not present
    // Otherwise displays and removes user provided loading screen
    this._loadingScreen = document.getElementById(this._loadingScreenId);
    if(!this._loadingScreen){
      this._loadingScreen = document.createElement('loadingDiv');
      this._loadingScreen.innerHTML = 'loading...';
      this._loadingScreen.style.position = 'absolute';
      var node = this._userNode || document.body;
      node.appendChild(this._loadingScreen);
    }

    // Always create a default canvas.
    // Later on if the user calls createCanvas, this default one
    // will be replaced
    this.createCanvas(
      this._defaultCanvasSize.width,
      this._defaultCanvasSize.height,
      'p2d',
      true
    );

    var userPreload = this.preload || window.preload; // look for "preload"
    var context = this._isGlobal ? window : this;
    if (userPreload) {

      var methods = this._preloadMethods;
      Object.keys(methods).forEach(function(f) {
        context[f] = function() {
          var argsArray = Array.prototype.slice.call(arguments);
          return context._preload(f, methods[f], argsArray);
        };
      });

      userPreload();
      if (this._preloadCount === 0) {
        this._setup();
        this._runFrames();
        this._draw();
      }
    } else {
      this._setup();
      this._runFrames();
      this._draw();
    }
  }.bind(this);

  this._preload = function (func, obj, args) {
    var context = this._isGlobal ? window : this;
    context._setProperty('_preloadCount', context._preloadCount + 1);
    var preloadCallback = function (resp) {
      context._setProperty('_preloadCount', context._preloadCount - 1);
      if (context._preloadCount === 0) {
        context._setup();
        context._runFrames();
        context._draw();
      }
    };
    args.push(preloadCallback);
    return window[obj].prototype[func].apply(context, args);
  }.bind(this);

  this._setup = function() {

    // return preload functions to their normal vals if switched by preload
    var context = this._isGlobal ? window : this;
    if (typeof context.preload === 'function') {
      for (var f in this._preloadMethods) {
        var o = this._preloadMethods[f];
        context[f] = window[o].prototype[f];
      }
    }

    // Short-circuit on this, in case someone used the library in "global"
    // mode earlier
    if (typeof context.setup === 'function') {
      context.setup();
    }

    // // unhide hidden canvas that was created
    // this.canvas.style.visibility = '';
    // this.canvas.className = this.canvas.className.replace('p5_hidden', '');

    // unhide any hidden canvases that were created
    var reg = new RegExp(/(^|\s)p5_hidden(?!\S)/g);
    var canvases = document.getElementsByClassName('p5_hidden');
    for (var i = 0; i < canvases.length; i++) {
      var k = canvases[i];
      k.style.visibility = '';
      k.className = k.className.replace(reg, '');
    }
    this._setupDone = true;

    // Removes the loading screen if it's in the DOM
    this._loadingScreen.parentNode.removeChild(this._loadingScreen);

  }.bind(this);

  this._draw = function () {
    var now = window.performance.now();
    var time_since_last = now - this._lastFrameTime;
    var target_time_between_frames = 1000 / this._targetFrameRate;

    // only draw if we really need to; don't overextend the browser.
    // draw if we're within 5ms of when our next frame should paint
    // (this will prevent us from giving up opportunities to draw
    // again when it's really about time for us to do so). fixes an
    // issue where the frameRate is too low if our refresh loop isn't
    // in sync with the browser. note that we have to draw once even
    // if looping is off, so we bypass the time delay if that
    // is the case.
    var epsilon = 5;
    if (!this.loop ||
        time_since_last >= target_time_between_frames - epsilon) {
      this._setProperty('frameCount', this.frameCount + 1);
      this.redraw();
      this._updatePAccelerations();
      this._updatePMouseCoords();
      this._updatePTouchCoords();
      this._frameRate = 1000.0/(now - this._lastFrameTime);
      this._lastFrameTime = now;
    }

    // get notified the next time the browser gives us
    // an opportunity to draw.
    if (this._loop) {
      window.requestAnimationFrame(this._draw);
    }
  }.bind(this);

  this._runFrames = function() {
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
    }
  }.bind(this);

  this._setProperty = function(prop, value) {
    this[prop] = value;
    if (this._isGlobal) {
      window[prop] = value;
    }
  }.bind(this);

  /**
   * Removes the entire p5 sketch. This will remove the canvas and any
   * elements created by p5.js. It will also stop the draw loop and unbind
   * any properties or methods from the window global scope. It will
   * leave a variable p5 in case you wanted to create a new p5 sketch.
   * If you like, you can set p5 = null to erase it.
   * @method remove
   * @example
   * <div class='norender'><code>
   * function draw() {
   *   ellipse(50, 50, 10, 10);
   * }
   *
   * function mousePressed() {
   *   remove(); // remove whole sketch on mouse press
   * }
   * </code></div>
   */
  this.remove = function() {
    if (this._curElement) {

      // stop draw
      this._loop = false;
      if (this._updateInterval) {
        clearTimeout(this._updateInterval);
      }

      // unregister events sketch-wide
      for (var ev in this._events) {
        window.removeEventListener(ev, this._events[ev]);
      }

      // remove DOM elements created by p5, and listeners
      for (var i=0; i<this._elements.length; i++) {
        var e = this._elements[i];
        if (e.elt.parentNode) {
          e.elt.parentNode.removeChild(e.elt);
        }
        for (var elt_ev in e._events) {
          e.elt.removeEventListener(elt_ev, e._events[elt_ev]);
        }
      }

      // call any registered remove functions
      var self = this;
      this._registeredMethods.remove.forEach(function (f) {
        if (typeof(f) !== 'undefined') {
          f.call(self);
        }
      });

      // remove window bound properties and methods
      if (this._isGlobal) {
        for (var p in p5.prototype) {
          try {
            delete window[p];
          } catch (x) {
            window[p] = undefined;
          }
        }
        for (var p2 in this) {
          if (this.hasOwnProperty(p2)) {
            try {
              delete window[p2];
            } catch (x) {
              window[p2] = undefined;
            }
          }
        }
      }
    }
    // window.p5 = undefined;
  }.bind(this);


  // attach constants to p5 instance
  for (var k in constants) {
    p5.prototype[k] = constants[k];
  }

  // If the user has created a global setup or draw function,
  // assume "global" mode and make everything global (i.e. on the window)
  if (!sketch) {
    this._isGlobal = true;
    // Loop through methods on the prototype and attach them to the window
    for (var p in p5.prototype) {
      if(typeof p5.prototype[p] === 'function') {
        var ev = p.substring(2);
        if (!this._events.hasOwnProperty(ev)) {
          window[p] = p5.prototype[p].bind(this);
        }
      } else {
        window[p] = p5.prototype[p];
      }
    }
    // Attach its properties to the window
    for (var p2 in this) {
      if (this.hasOwnProperty(p2)) {
        window[p2] = this[p2];
      }
    }

  } else {
    // Else, the user has passed in a sketch closure that may set
    // user-provided 'setup', 'draw', etc. properties on this instance of p5
    sketch(this);
  }

  // Bind events to window (not using container div bc key events don't work)

  for (var e in this._events) {
    var f = this['_on'+e];
    if (f) {
      var m = f.bind(this);
      window.addEventListener(e, m);
      this._events[e] = m;
    }
  }

  var self = this;
  window.addEventListener('focus', function() {
    self._setProperty('focused', true);
  });

  window.addEventListener('blur', function() {
    self._setProperty('focused', false);
  });

  // TODO: ???

  if (sync) {
    this._start();
  } else {
    if (document.readyState === 'complete') {
      this._start();
    } else {
      window.addEventListener('load', this._start.bind(this), false);
    }
  }
};


// functions that cause preload to wait
// more can be added by using registerPreloadMethod(func)
p5.prototype._preloadMethods = {
  loadJSON: 'p5',
  loadImage: 'p5',
  loadStrings: 'p5',
  loadXML: 'p5',
  loadShape: 'p5',
  loadTable: 'p5',
  loadFont: 'p5'
};

p5.prototype._registeredMethods = { pre: [], post: [], remove: [] };

p5.prototype.registerPreloadMethod = function(f, o) {
  o = o || 'p5';
  if (!p5.prototype._preloadMethods.hasOwnProperty(f)) {
    p5.prototype._preloadMethods[f] = o;
  }
};

p5.prototype.registerMethod = function(name, m) {
  if (!p5.prototype._registeredMethods.hasOwnProperty(name)) {
    p5.prototype._registeredMethods[name] = [];
  }
  p5.prototype._registeredMethods[name].push(m);
};

module.exports = p5;

},{"./constants":15,"./shim":25}],17:[function(require,module,exports){
/**
 * @module Shape
 * @submodule Curves
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');

require('./error_helpers');

var bezierDetail = 20;
var curveDetail = 20;
p5.prototype._curveTightness = 0;

/**
 * Draws a Bezier curve on the screen. These curves are defined by a series
 * of anchor and control points. The first two parameters specify the first
 * anchor point and the last two parameters specify the other anchor point.
 * The middle parameters specify the control points which define the shape
 * of the curve. Bezier curves were developed by French engineer Pierre
 * Bezier.
 *
 * @method bezier
 * @param  {Number} x1 x-coordinate for the first anchor point
 * @param  {Number} y1 y-coordinate for the first anchor point
 * @param  {Number} x2 x-coordinate for the first control point
 * @param  {Number} y2 y-coordinate for the first control point
 * @param  {Number} x3 x-coordinate for the second control point
 * @param  {Number} y3 y-coordinate for the second control point
 * @param  {Number} x4 x-coordinate for the second anchor point
 * @param  {Number} y4 y-coordinate for the second anchor point
 * @return {Object}    the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * stroke(255, 102, 0);
 * line(85, 20, 10, 10);
 * line(90, 90, 15, 80);
 * stroke(0, 0, 0);
 * bezier(85, 20, 10, 10, 90, 90, 15, 80);
 * </code>
 * </div>
 */
p5.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._validateParameters(
    'bezier',
    arguments,
    [ 'Number', 'Number', 'Number', 'Number',
      'Number', 'Number', 'Number', 'Number' ]
  );

  if (!this._doStroke) {
    return this;
  }
  this._graphics.bezier(x1, y1, x2, y2, x3, y3, x4, y4);
  return this;
};

/**
 * Sets the resolution at which Beziers display.
 *
 * The default value is 20.
 *
 * @param {Number} detail resolution of the curves
 * @return {Object} the p5 object
 * @example
 * <div>
 * <code>
 * background(204);
 * bezierDetail(50);
 * bezier(85, 20, 10, 10, 90, 90, 15, 80);
 * </code>
 * </div>
 */
p5.prototype.bezierDetail = function(d) {
  bezierDetail = d;
  return this;
};

/**
 * Calculate a point on the Bezier Curve
 *
 * Evaluates the Bezier at point t for points a, b, c, d.
 * The parameter t varies between 0 and 1, a and d are points
 * on the curve, and b and c are the control points.
 * This can be done once with the x coordinates and a second time
 * with the y coordinates to get the location of a bezier curve at t.
 *
 * @method bezierPoint
 * @param {Number} a coordinate of first point on the curve
 * @param {Number} b coordinate of first control point
 * @param {Number} c coordinate of second control point
 * @param {Number} d coordinate of second point on the curve
 * @param {Number} t value between 0 and 1
 * @return {Number} the value of the Bezier at point t
 * @example
 * <div>
 * <code>
 * noFill();
 * bezier(85, 20, 10, 10, 90, 90, 15, 80);
 * fill(255);
 * steps = 10;
 * for (i = 0; i <= steps; i++) {
 *   t = i / steps;
 *   x = bezierPoint(85, 10, 90, 15, t);
 *   y = bezierPoint(20, 10, 90, 80, t);
 *   ellipse(x, y, 5, 5);
 * }
 * </code>
 * </div>
 */
p5.prototype.bezierPoint = function(a, b, c, d, t) {
  var adjustedT = 1-t;
  return Math.pow(adjustedT,3)*a +
   3*(Math.pow(adjustedT,2))*t*b +
   3*adjustedT*Math.pow(t,2)*c +
   Math.pow(t,3)*d;
};

/**
 * Calculates the tangent of a point on a Bezier curve
 *
 * Evaluates the tangent at point t for points a, b, c, d.
 * The parameter t varies between 0 and 1, a and d are points
 * on the curve, and b and c are the control points
 *
 * @method bezierTangent
 * @param {Number} a coordinate of first point on the curve
 * @param {Number} b coordinate of first control point
 * @param {Number} c coordinate of second control point
 * @param {Number} d coordinate of second point on the curve
 * @param {Number} t value between 0 and 1
 * @return {Number} the tangent at point t
 * @example
 * <div>
 * <code>
 * noFill();
 * bezier(85, 20, 10, 10, 90, 90, 15, 80);
 * steps = 6;
 * fill(255);
 * for (i = 0; i <= steps; i++) {
 *   t = i / steps;
 *   // Get the location of the point
 *   x = bezierPoint(85, 10, 90, 15, t);
 *   y = bezierPoint(20, 10, 90, 80, t);
 *   // Get the tangent points
 *   tx = bezierTangent(85, 10, 90, 15, t);
 *   ty = bezierTangent(20, 10, 90, 80, t);
 *   // Calculate an angle from the tangent points
 *   a = atan2(ty, tx);
 *   a += PI;
 *   stroke(255, 102, 0);
 *   line(x, y, cos(a)*30 + x, sin(a)*30 + y);
 *   // The following line of code makes a line
 *   // inverse of the above line
 *   //line(x, y, cos(a)*-30 + x, sin(a)*-30 + y);
 *   stroke(0);
 *   ellipse(x, y, 5, 5);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * bezier(85, 20, 10, 10, 90, 90, 15, 80);
 * stroke(255, 102, 0);
 * steps = 16;
 * for (i = 0; i <= steps; i++) {
 *   t = i / steps;
 *   x = bezierPoint(85, 10, 90, 15, t);
 *   y = bezierPoint(20, 10, 90, 80, t);
 *   tx = bezierTangent(85, 10, 90, 15, t);
 *   ty = bezierTangent(20, 10, 90, 80, t);
 *   a = atan2(ty, tx);
 *   a -= HALF_PI;
 *   line(x, y, cos(a)*8 + x, sin(a)*8 + y);
 * }
 * </code>
 * </div>
 */
p5.prototype.bezierTangent = function(a, b, c, d, t) {
  var adjustedT = 1-t;
  return 3*d*Math.pow(t,2) -
   3*c*Math.pow(t,2) +
   6*c*adjustedT*t -
   6*b*adjustedT*t +
   3*b*Math.pow(adjustedT,2) -
   3*a*Math.pow(adjustedT,2);
};

/**
 * Draws a curved line on the screen. The first and second parameters specify
 * the beginning control point and the last two parameters specify the ending
 * control point. The middle parameters specify the start and stop of the
 * curve. Longer curves can be created by putting a series of curve()
 * functions together or using curveVertex(). An additional function called
 * curveTightness() provides control for the visual quality of the curve.
 * The curve() function is an implementation of Catmull-Rom splines.
 *
 * @method curve
 * @param  {Number} x1 x-coordinate for the beginning control point
 * @param  {Number} y1 y-coordinate for the beginning control point
 * @param  {Number} x2 x-coordinate for the first point
 * @param  {Number} y2 y-coordinate for the first point
 * @param  {Number} x3 x-coordinate for the second point
 * @param  {Number} y3 y-coordinate for the second point
 * @param  {Number} x4 x-coordinate for the ending control point
 * @param  {Number} y4 y-coordinate for the ending control point
 * @return {Object}    the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * stroke(255, 102, 0);
 * curve(5, 26, 5, 26, 73, 24, 73, 61);
 * stroke(0);
 * curve(5, 26, 73, 24, 73, 61, 15, 65);
 * stroke(255, 102, 0);
 * curve(73, 24, 73, 61, 15, 65, 15, 65);
 * </code>
 * </div>
 */
p5.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._validateParameters(
    'curve',
    arguments,
    [ 'Number', 'Number', 'Number', 'Number',
      'Number', 'Number', 'Number', 'Number' ]
  );

  if (!this._doStroke) {
    return;
  }
  this._graphics.curve(x1, y1, x2, y2, x3, y3, x4, y4);
  return this;
};

/**
 * Sets the resolution at which curves display.
 *
 * The default value is 20.
 *
 * @param {Number} resolution of the curves
 * @return {Object} the p5 object
 * @example
 * <div>
 * <code>
 * background(204);
 * curveDetail(20);
 * curve(5, 26, 5, 26, 73, 24, 73, 61);
 * </code>
 * </div>
 */
p5.prototype.curveDetail = function(d) {
  curveDetail = d;
  return this;
};

/**
 * Modifies the quality of forms created with curve() and curveVertex().
 * The parameter tightness determines how the curve fits to the vertex
 * points. The value 0.0 is the default value for tightness (this value
 * defines the curves to be Catmull-Rom splines) and the value 1.0 connects
 * all the points with straight lines. Values within the range -5.0 and 5.0
 * will deform the curves but will leave them recognizable and as values
 * increase in magnitude, they will continue to deform.
 *
 * @method curveTightness
 * @param {Number} amount of deformation from the original vertices
 * @return {Object} the p5 object
 * @example
 * <div>
 * <code>
 * // Move the mouse left and right to see the curve change
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   noFill();
 * }
 *
 * function draw() {
 *   background(204);
 *   var t = map(mouseX, 0, width, -5, 5);
 *   curveTightness(t);
 *   beginShape();
 *   curveVertex(10, 26);
 *   curveVertex(10, 26);
 *   curveVertex(83, 24);
 *   curveVertex(83, 61);
 *   curveVertex(25, 65);
 *   curveVertex(25, 65);
 *   endShape();
 * }
 * </code>
 * </div>
 */
p5.prototype.curveTightness = function (t) {
  this._setProperty('_curveTightness', t);
};

/**
 * Calculate a point on the Curve
 *
 * Evaluates the Bezier at point t for points a, b, c, d.
 * The parameter t varies between 0 and 1, a and d are points
 * on the curve, and b and c are the control points.
 * This can be done once with the x coordinates and a second time
 * with the y coordinates to get the location of a curve at t.
 *
 * @method curvePoint
 * @param {Number} a coordinate of first point on the curve
 * @param {Number} b coordinate of first control point
 * @param {Number} c coordinate of second control point
 * @param {Number} d coordinate of second point on the curve
 * @param {Number} t value between 0 and 1
 * @return {Number} bezier value at point t
 * @example
 * <div>
 * <code>
 * noFill();
 * curve(5, 26, 5, 26, 73, 24, 73, 61);
 * curve(5, 26, 73, 24, 73, 61, 15, 65);
 * fill(255);
 * ellipseMode(CENTER);
 * steps = 6;
 * for (i = 0; i <= steps; i++) {
 *   t = i / steps;
 *   x = curvePoint(5, 5, 73, 73, t);
 *   y = curvePoint(26, 26, 24, 61, t);
 *   ellipse(x, y, 5, 5);
 *   x = curvePoint(5, 73, 73, 15, t);
 *   y = curvePoint(26, 24, 61, 65, t);
 *   ellipse(x, y, 5, 5);
 * }
 * </code>
 * </div>
 */
p5.prototype.curvePoint = function(a, b,c, d, t) {
  var t3 = t*t*t,
    t2 = t*t,
    f1 = -0.5 * t3 + t2 - 0.5 * t,
    f2 = 1.5 * t3 - 2.5 * t2 + 1.0,
    f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t,
    f4 = 0.5 * t3 - 0.5 * t2;
  return a*f1 + b*f2 + c*f3 + d*f4;
};

/**
 * Calculates the tangent of a point on a curve
 *
 * Evaluates the tangent at point t for points a, b, c, d.
 * The parameter t varies between 0 and 1, a and d are points
 * on the curve, and b and c are the control points
 *
 * @method curveTangent
 * @param {Number} a coordinate of first point on the curve
 * @param {Number} b coordinate of first control point
 * @param {Number} c coordinate of second control point
 * @param {Number} d coordinate of second point on the curve
 * @param {Number} t value between 0 and 1
 * @return {Number} the tangent at point t
 * @example
 * <div>
 * <code>
 * noFill();
 * curve(5, 26, 73, 24, 73, 61, 15, 65);
 * steps = 6;
 * for (i = 0; i <= steps; i++) {
 *   t = i / steps;
 *   x = curvePoint(5, 73, 73, 15, t);
 *   y = curvePoint(26, 24, 61, 65, t);
 *   //ellipse(x, y, 5, 5);
 *   tx = curveTangent(5, 73, 73, 15, t);
 *   ty = curveTangent(26, 24, 61, 65, t);
 *   a = atan2(ty, tx);
 *   a -= PI/2.0;
 *   line(x, y, cos(a)*8 + x, sin(a)*8 + y);
 * }
 * </code>
 * </div>
 */
p5.prototype.curveTangent = function(a, b,c, d, t) {
  var t2 = t*t,
    f1 = (-3*t2)/2 + 2*t - 0.5,
    f2 = (9*t2)/2 - 5*t,
    f3 = (-9*t2)/2 + 4*t + 0.5,
    f4 = (3*t2)/2 - t;
  return a*f1 + b*f2 + c*f3 + d*f4;
};

module.exports = p5;

},{"./core":16,"./error_helpers":19}],18:[function(require,module,exports){
/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('./core');
var C = require('./constants');

var standardCursors = [C.ARROW, C.CROSS, C.HAND, C.MOVE, C.TEXT, C.WAIT];

p5.prototype._frameRate = 0;
p5.prototype._lastFrameTime = window.performance.now();
p5.prototype._targetFrameRate = 60;


if (window.console && console.log) {
  /**
   * The print() function writes to the console area of your browser.
   * This function is often helpful for looking at the data a program is
   * producing. This function creates a new line of text for each call to
   * the function. More than one parameter can be passed into the function by
   * separating them with commas. Alternatively, individual elements can be
   * separated with quotes ("") and joined with the addition operator (+).
   *
   * While print() is similar to console.log(), it does not directly map to
   * it in order to simulate easier to understand behavior than
   * console.log(). Due to this, it is slower. For fastest results, use
   * console.log().
   *
   * @method print
   * @param {Any} contents any combination of Number, String, Object, Boolean,
   *                       Array to print
   */
  // Converts passed args into a string and then parses that string to
  // simulate synchronous behavior. This is a hack and is gross.
  // Since this will not work on all objects, particularly circular
  // structures, simply console.log() on error.
  p5.prototype.print = function(args) {
    try {
      var newArgs = JSON.parse(JSON.stringify(args));
      console.log(newArgs);
    } catch(err) {
      console.log(args);
    }
  };
} else {
  p5.prototype.print = function() {};
}

p5.prototype.println = p5.prototype.print;

/**
 * The system variable frameCount contains the number of frames that have
 * been displayed since the program started. Inside setup() the value is 0,
 * after the first iteration of draw it is 1, etc.
 *
 * @property frameCount
 * @example
 *   <div><code>
 *     function setup() {
 *       frameRate(30);
 *       textSize(20);
 *       textSize(30);
 *       textAlign(CENTER);
 *     }
 *
 *     function draw() {
 *       background(200);
 *       text(frameCount, width/2, height/2);
 *     }
 *   </code></div>
 */
p5.prototype.frameCount = 0;

/**
 * Confirms if the window a p5.js program is in is "focused," meaning that
 * the sketch will accept mouse or keyboard input. This variable is
 * "true" if the window is focused and "false" if not.
 *
 * @property focused
 * @example
 * <div><code>
 * // To demonstrate, put two windows side by side.
 * // Click on the window that the p5 sketch isn't in!
 * function draw() {
 *   if (focused) {  // or "if (focused === true)"
 *     noStroke();
 *     fill(0, 200, 0);
 *     ellipse(25, 25, 50, 50);
 *   } else {
 *     stroke(200,0,0);
 *     line(0, 0, 100, 100);
 *     line(100, 0, 0, 100);
 *   }
 * }
 *
 * </code></div>
 */
p5.prototype.focused = (document.hasFocus());

/**
 * Sets the cursor to a predefined symbol or an image, or makes it visible
 * if already hidden. If you are trying to set an image as the cursor, the
 * recommended size is 16x16 or 32x32 pixels. It is not possible to load an
 * image as the cursor if you are exporting your program for the Web, and not
 * all MODES work with all browsers. The values for parameters x and y must
 * be less than the dimensions of the image.
 *
 * @method cursor
 * @param {Number/Constant} type either ARROW, CROSS, HAND, MOVE, TEXT, or
 *                               WAIT, or path for image
 * @param {Number}          [x]  the horizontal active spot of the cursor
 * @param {Number}          [y]  the vertical active spot of the cursor
 * @example
 * <div><code>
 * // Move the mouse left and right across the image
 * // to see the cursor change from a cross to a hand
 * function draw() {
 *   line(width/2, 0, width/2, height);
 *   if (mouseX < 50) {
 *     cursor(CROSS);
 *   } else {
 *     cursor(HAND);
 *   }
 * }
 * </code></div>
 */
p5.prototype.cursor = function(type, x, y) {
  var cursor = 'auto';
  var canvas = this._curElement.elt;
  if (standardCursors.indexOf(type) > -1) {
    // Standard css cursor
    cursor = type;
  } else if (typeof type === 'string') {
    var coords = '';
    if (x && y && (typeof x === 'number' && typeof y === 'number')) {
      // Note that x and y values must be unit-less positive integers < 32
      // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
      coords = x + ' ' + y;
    }
    if (type.substring(0, 6) !== 'http://') {
      // Image (absolute url)
      cursor = 'url(' + type + ') ' + coords + ', auto';
    } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
      // Image file (relative path) - Separated for performance reasons
      cursor = 'url(' + type + ') ' + coords + ', auto';
    } else {
      // Any valid string for the css cursor property
      cursor = type;
    }
  }
  canvas.style.cursor = cursor;
};

/**
 * Specifies the number of frames to be displayed every second. For example,
 * the function call frameRate(30) will attempt to refresh 30 times a second.
 * If the processor is not fast enough to maintain the specified rate, the
 * frame rate will not be achieved. Setting the frame rate within setup() is
 * recommended. The default rate is 60 frames per second. This is the same as
 * setFrameRate(val).
 *
 * Calling frameRate() with no arguments returns the current framerate. This
 * is the same as getFrameRate().
 *
 * @method frameRate
 * @param  {Number} [fps] number of frames to be displayed every second
 * @return {Number}       current frameRate
 * @example
 *
 * <div><code>
 * var rectX = 0;
 * var fr = 30; //starting FPS
 * var clr = color(255,0,0);
 *
 * function setup() {
 *   background(200);
 *   frameRate(fr); // Attempt to refresh at starting FPS
 * }
 *
 * function draw() {
 *   background(200);
 *   rectX = rectX += 1; // Move Rectangle
 *
 *   if (rectX >= width) { // If you go off screen.
 *     if (fr == 30) {
 *       clr = color(0,0,255);
 *       fr = 10;
 *       frameRate(fr); // make frameRate 10 FPS
 *     } else {
 *       clr = color(255,0,0);
 *       fr = 30;
 *       frameRate(fr); // make frameRate 30 FPS
 *     }
 *     rectX = 0;
 *   }
 *   fill(clr);
 *   rect(rectX, 40, 20,20);
 * }
 * </div></code>
 *
 */
p5.prototype.frameRate = function(fps) {
  if (typeof fps === 'undefined') {
    return this._frameRate;
  } else {
    this._setProperty('_targetFrameRate', fps);
    this._runFrames();
    return this;
  }
};
/**
 * Returns the current framerate.
 *
 * @return {Number} current frameRate
 */
p5.prototype.getFrameRate = function() {
  return this.frameRate();
};

/**
 * Specifies the number of frames to be displayed every second. For example,
 * the function call frameRate(30) will attempt to refresh 30 times a second.
 * If the processor is not fast enough to maintain the specified rate, the
 * frame rate will not be achieved. Setting the frame rate within setup() is
 * recommended. The default rate is 60 frames per second.
 *
 * Calling frameRate() with no arguments returns the current framerate.
 *
 * @param {Number} [fps] number of frames to be displayed every second
 */
p5.prototype.setFrameRate = function(fps) {
  return this.frameRate(fps);
};

/**
 * Hides the cursor from view.
 *
 * @method noCursor
 * @example
 * <div><code>
 * function setup() {
 *   noCursor();
 * }
 *
 * function draw() {
 *   background(200);
 *   ellipse(mouseX, mouseY, 10, 10);
 * }
 * </code></div>
 */
p5.prototype.noCursor = function() {
  this._curElement.elt.style.cursor = 'none';
};


/**
 * System variable that stores the width of the entire screen display. This
 * is used to run a full-screen program on any display size.
 *
 * @property displayWidth
 * @example
 * <div class="norender"><code>
 * createCanvas(displayWidth, displayHeight);
 * </code></div>
 */
p5.prototype.displayWidth = screen.width;

/**
 * System variable that stores the height of the entire screen display. This
 * is used to run a full-screen program on any display size.
 *
 * @property displayHeight
 * @example
 * <div class="norender"><code>
 * createCanvas(displayWidth, displayHeight);
 * </code></div>
 */
p5.prototype.displayHeight = screen.height;

/**
 * System variable that stores the width of the inner window, it maps to
 * window.innerWidth.
 *
 * @property windowWidth
 * @example
 * <div class="norender"><code>
 * createCanvas(windowWidth, windowHeight);
 * </code></div>
 */
p5.prototype.windowWidth = window.innerWidth;
/**
 * System variable that stores the height of the inner window, it maps to
 * window.innerHeight.
 *
 * @property windowHeight
 * @example
 * <div class="norender"><code>
 * createCanvas(windowWidth, windowHeight);
 * </code></div>
 */
p5.prototype.windowHeight = window.innerHeight;

/**
 * The windowResized() function is called once every time the browser window
 * is resized. This is a good place to resize the canvas or do any other
 * adjustements to accomodate the new window size.
 *
 * @property windowResized
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   createCanvas(windowWidth, windowHeight);
 * }
 *
 * function draw() {
 *  background(0, 100, 200);
 * }
 *
 * function windowResized() {
 *   resizeCanvas(windowWidth, windowHeight);
 * }
 * </code></div>
 */
p5.prototype._onresize = function(e){
  this._setProperty('windowWidth', window.innerWidth);
  this._setProperty('windowHeight', window.innerHeight);
  var context = this._isGlobal ? window : this;
  var executeDefault;
  if (typeof context.windowResized === 'function') {
    executeDefault = context.windowResized(e);
    if (executeDefault !== undefined && !executeDefault) {
      e.preventDefault();
    }
  }
};

/**
 * System variable that stores the width of the drawing canvas. This value
 * is set by the first parameter of the createCanvas() function.
 * For example, the function call createCanvas(320, 240) sets the width
 * variable to the value 320. The value of width defaults to 100 if
 * createCanvas() is not used in a program.
 *
 * @property width
 */
p5.prototype.width = 0;

/**
 * System variable that stores the height of the drawing canvas. This value
 * is set by the second parameter of the createCanvas() function. For
 * example, the function call createCanvas(320, 240) sets the height
 * variable to the value 240. The value of height defaults to 100 if
 * createCanvas() is not used in a program.
 *
 * @property height
 */
p5.prototype.height = 0;

/**
 * If argument is given, sets the sketch to fullscreen or not based on the
 * value of the argument. If no argument is given, returns the current
 * fullscreen state. Note that due to browser restrictions this can only
 * be called on user input, for example, on mouse press like the example
 * below.
 *
 * @method fullscreen
 * @param  {Boolean} [val] whether the sketch should be fullscreened or not
 * @return {Boolean} current fullscreen state
 * @example
 * <div>
 * <code>
 * // Clicking in the box toggles fullscreen on and off.
 * function setup() {
 *   background(200);
 * }
 * function mousePressed() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     var fs = fullscreen();
 *     fullscreen(!fs);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.fullscreen = function(val) {
  // no arguments, return fullscreen or not
  if (typeof val === 'undefined') {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement ||
           document.msFullscreenElement;
  } else { // otherwise set to fullscreen or not
    if (val) {
      launchFullscreen(document.documentElement);
    } else {
      exitFullscreen();
    }
  }
};

/**
 * Toggles pixel scaling for high pixel density displays. By default
 * pixel scaling is on, call devicePixelScaling(false) to turn it off.
 * This devicePixelScaling() function must be the first line of code
 * inside setup().
 *
 * @method devicePixelScaling
 * @param  {Boolean|Number} [val] whether or how much the sketch should scale
 * @example
 * <div>
 * <code>
 * function setup() {
 *   devicePixelScaling(false);
 *   createCanvas(100, 100);
 *   background(200);
 *   ellipse(width/2, height/2, 50, 50);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   devicePixelScaling(3.0);
 *   createCanvas(100, 100);
 *   background(200);
 *   ellipse(width/2, height/2, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.devicePixelScaling = function(val) {
  if (val) {
    if (typeof val === 'number') {
      this.pixelDensity = val;
    }
    else {
      this.pixelDensity = window.devicePixelRatio || 1;
    }
  } else {
    this.pixelDensity = 1;
  }
  this.resizeCanvas(this.width, this.height, true);
};

function launchFullscreen(element) {
  var enabled = document.fullscreenEnabled ||
                document.webkitFullscreenEnabled ||
                document.mozFullScreenEnabled ||
                document.msFullscreenEnabled;
  if (!enabled) {
    throw new Error('Fullscreen not enabled in this browser.');
  }
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}


/**
 * Gets the current URL.
 * @method getURL
 * @return {String} url
 * @example
 * <div>
 * <code>
 * var url;
 * var x = 100;
 *
 * function setup() {
 *   fill(0);
 *   noStroke();
 *   url = getURL();
 * }
 *
 * function draw() {
 *   background(200);
 *   text(url, x, height/2);
 *   x--;
 * }
 * </code>
 * </div>
 */
p5.prototype.getURL = function() {
  return location.href;
};
/**
 * Gets the current URL path as an array.
 * @method getURLPath
 * @return {Array} path components
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   var urlPath = getURLPath();
 *   for (var i=0; i&lt;urlPath.length; i++) {
 *     text(urlPath[i], 10, i*20+20);
 *   }
 * }
 * </code></div>
 */
p5.prototype.getURLPath = function() {
  return location.pathname.split('/').filter(function(v){return v!=='';});
};
/**
 * Gets the current URL params as an Object.
 * @method getURLParams
 * @return {Object} URL params
 * @example
 * <div class='norender'>
 * <code>
 * // Example: http://p5js.org?year=2014&month=May&day=15
 *
 * function setup() {
 *   var params = getURLParams();
 *   text(params.day, 10, 20);
 *   text(params.month, 10, 40);
 *   text(params.year, 10, 60);
 * }
 * </code>
 * </div>
 */
p5.prototype.getURLParams = function() {
  var re = /[?&]([^&=]+)(?:[&=])([^&=]+)/gim;
  var m;
  var v={};
  while ((m = re.exec(location.search)) != null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    v[m[1]]=m[2];
  }
  return v;
};

module.exports = p5;

},{"./constants":15,"./core":16}],19:[function(require,module,exports){
/**
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');
var doFriendlyWelcome = true;

// -- Borrowed from jQuery 1.11.3 --
var class2type = {};
var toString = class2type.toString;
var names = ['Boolean', 'Number', 'String', 'Function',
             'Array', 'Date', 'RegExp', 'Object', 'Error'];
for (var n=0; n<names.length; n++) {
  class2type[ '[object ' + names[n] + ']' ] = names[n].toLowerCase();
}
var getType = function( obj ) {
  if ( obj == null ) {
    return obj + '';
  }
  return typeof obj === 'object' || typeof obj === 'function' ?
    class2type[ toString.call(obj) ] || 'object' :
    typeof obj;
};
var isArray = Array.isArray || function( obj ) {
  return getType(obj) === 'array';
};
var isNumeric =function( obj ) {
  // parseFloat NaNs numeric-cast false positives (null|true|false|"")
  // ...but misinterprets leading-number strings, particularly hex literals
  // subtraction forces infinities to NaN
  // adding 1 corrects loss of precision from parseFloat (#15100)
  return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
};
// -- End borrow --

/**
 * Checks the definition type against the argument type
 * If any of these passes (in order), it matches:
 *
 * - p5.* definitions are checked with instanceof
 * - Booleans are let through (everything is truthy or falsey)
 * - Lowercase of the definition is checked against the js type
 * - Number types are checked to see if they are numerically castable
 */
var numberTypes = ['Number', 'Integer', 'Number/Constant'];
function typeMatches(defType, argType, arg) {
  if(defType.match(/^p5\./)) {
    var parts = defType.split('.');
    return arg instanceof p5[parts[1]];
  }
  return defType === 'Boolean' || // Anything is truthy, cover in Debug Guide
    (defType.toLowerCase() === argType) ||
    (numberTypes.indexOf(defType) > -1 && isNumeric(arg));
}

/**
 * Prints out a fancy, colorful message to the console log
 *
 * @param  {String}               message the words to be said
 * @param  {String}               func    the name of the function to link
 * @param  {Integer/Color String} color   CSS color string or error type
 *
 * @return console logs
 */
// Wrong number of params, undefined param, wrong type
var PARAM_COUNT = 0;
var EMPTY_VAR = 1;
var WRONG_TYPE = 2;
var FILE_LOAD = 3;
// p5.js blue, p5.js orange, auto dark green; fallback p5.js darkened magenta
// See testColors below for all the color codes and names
var typeColors = ['#2D7BB6', '#EE9900', '#4DB200', '#C83C00'];
function report(message, func, color) {
  if(doFriendlyWelcome){
    friendlyWelcome();
    doFriendlyWelcome =false;
  }
  if ('undefined' === getType(color)) {
    color   = '#B40033'; // dark magenta
  } else if (getType(color) === 'number') { // Type to color
    color = typeColors[color];
  }
  if (func.substring(0,4) === 'load'){
    console.log(
      '%c> p5.js says: '+message+'%c'+
      '[https://github.com/processing/p5.js/wiki/Local-server]',
      'background-color:' + color + ';color:#FFF;',
      'background-color:transparent;color:' + color +';',
      'background-color:' + color + ';color:#FFF;',
      'background-color:transparent;color:' + color +';'
    );
  }
  else{
    console.log(
      '%c> p5.js says: '+message+'%c [http://p5js.org/reference/#p5/'+func+
      ']', 'background-color:' + color + ';color:#FFF;',
      'background-color:transparent;color:' + color +';'
    );
  }
}

/**
 * Validate all the parameters of a function for number and type
 *
 * @param  {String} func  name of function we're checking
 * @param  {Array}  args  pass of the JS default arguments array
 * @param  {Array}  types List of types accepted ['Number', 'String, ...] OR
 *                        a list of lists for each format: [
 *                          ['String', 'Number', 'Number'],
 *                          ['String', 'Number', 'Number', 'Number', 'Number'
 *                        ]
 *
 * @return console logs
 */
p5.prototype._validateParameters = function(func, args, types) {
  if (!isArray(types[0])) {
    types = [types];
  }
  /**
   * Check number of parameters
   *
   * Example: "You wrote ellipse(X,X,X). ellipse was expecting 4
   *           parameters. Try ellipse(X,X,X,X)."
   */
  var diff = Math.abs(args.length-types[0].length);
  var message, tindex = 0;
  for (var i=1, len=types.length; i<len; i++) {
    var d = Math.abs(args.length-types[i].length);
    if (d <= diff) {
      tindex = i;
      diff = d;
    }
  }
  var symbol = 'X'; // Parameter placeholder
  if(diff > 0) {
    message = 'You wrote ' + func + '(';
    // Concat an appropriate number of placeholders for call
    if (args.length > 0) {
      message += symbol + (','+symbol).repeat(args.length-1);
    }
    message += '). ' + func + ' was expecting ' + types[tindex].length +
      ' parameters. Try ' + func + '(';
    // Concat an appropriate number of placeholders for definition
    if (types[tindex].length > 0) {
      message += symbol + (','+symbol).repeat(types[tindex].length-1);
    }
    message += ').';
    // If multiple definitions
    if (types.length > 1) {
      message += ' ' + func + ' takes different numbers of parameters ' +
        'depending on what you want to do. Click this link to learn more: ';
    }
    report(message, func, PARAM_COUNT);
  }
  /**
   * Type checking
   *
   * Example: "It looks like ellipse received an empty variable in spot #2."
   * Example: "ellipse was expecting a number for parameter #1,
   *           received "foo" instead."
   */
  for (var format=0; format<types.length; format++) {
    for (var p=0; p < types[format].length && p < args.length; p++) {
      var defType = types[format][p];
      var argType = getType(args[p]);
      if ('undefined' === argType || null === argType) {
        report('It looks like ' + func +
          ' received an empty variable in spot #' + (p+1) +
          '. If not intentional, this is often a problem with scope: ' +
          '[link to scope].', func, EMPTY_VAR);
      } else if (defType !== '*' && !typeMatches(defType, argType, args[p])) {
        message = func + ' was expecting a ' + defType.toLowerCase() +
          ' for parameter #' + (p+1) + ', received ';
        // Wrap strings in quotes
        message += 'string' === argType ? '"' + args[p] + '"' : args[p];
        message += ' instead.';
        // If multiple definitions
        if (types.length > 1) {
          message += ' ' + func + ' takes different numbers of parameters ' +
            'depending on what you want to do. ' +
            'Click this link to learn more:';
        }
        report(message, func, WRONG_TYPE);
      }
    }
  }
};
var errorCases = {
  '0': {
    fileType: 'image',
    method: 'loadImage',
    message: ' hosting the image online,'
  },
  '1': {
    fileType: 'XML file',
    method: 'loadXML'
  },
  '2': {
    fileType: 'table file',
    method: 'loadTable'
  },
  '3': {
    fileType: 'text file',
    method: 'loadStrings'
  }
};
p5._friendlyFileLoadError = function (errorType, filePath) {
  var errorInfo = errorCases[ errorType ];
  var message = 'It looks like there was a problem' +
  ' loading your ' + errorInfo.fileType + '.' +
  ' Try checking if the file path%c [' + filePath + '] %cis correct,' +
  (errorInfo.message || '') + ' or running a local server.';
  report(message, errorInfo.method, FILE_LOAD);
};

function friendlyWelcome() {
  // p5.js brand - magenta: #ED225D
  var astrixBgColor = 'transparent';
  var astrixTxtColor = '#ED225D';
  var welcomeBgColor = '#ED225D';
  var welcomeTextColor = 'white';
  console.log(
  '%c    _ \n'+
  ' /\\| |/\\ \n'+
  ' \\ ` \' /  \n'+
  ' / , . \\  \n'+
  ' \\/|_|\\/ '+
  '\n\n%c> p5.js says: Welcome! '+
  'This is your friendly debugger. ' +
  'To turn me off switch to using “p5.min.js”.',
  'background-color:'+astrixBgColor+';color:' + astrixTxtColor +';',
  'background-color:'+welcomeBgColor+';color:' + welcomeTextColor +';'
  );
}

/**
 * Prints out all the colors in the color pallete with white text.
 * For color blindness testing.
 */
/* function testColors() {
  var str = 'A box of biscuits, a box of mixed biscuits and a biscuit mixer';
  report(str, 'println', '#ED225D'); // p5.js magenta
  report(str, 'println', '#2D7BB6'); // p5.js blue
  report(str, 'println', '#EE9900'); // p5.js orange
  report(str, 'println', '#A67F59'); // p5.js light brown
  report(str, 'println', '#704F21'); // p5.js gold
  report(str, 'println', '#1CC581'); // auto cyan
  report(str, 'println', '#FF6625'); // auto orange
  report(str, 'println', '#79EB22'); // auto green
  report(str, 'println', '#B40033'); // p5.js darkened magenta
  report(str, 'println', '#084B7F'); // p5.js darkened blue
  report(str, 'println', '#945F00'); // p5.js darkened orange
  report(str, 'println', '#6B441D'); // p5.js darkened brown
  report(str, 'println', '#2E1B00'); // p5.js darkened gold
  report(str, 'println', '#008851'); // auto dark cyan
  report(str, 'println', '#C83C00'); // auto dark orange
  report(str, 'println', '#4DB200'); // auto dark green
} */

module.exports = p5;

},{"./core":16}],20:[function(require,module,exports){
/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */

var p5 = require('./core');

/**
 * Base class for all elements added to a sketch, including canvas,
 * graphics buffers, and other HTML elements. Methods in blue are
 * included in the core functionality, methods in brown are added
 * with the <a href="http://p5js.org/libraries/">p5.dom library</a>.
 * It is not called directly, but p5.Element
 * objects are created by calling createCanvas, createGraphics,
 * or in the p5.dom library, createDiv, createImg, createInput, etc.
 *
 * @class p5.Element
 * @constructor
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 */
p5.Element = function(elt, pInst) {
  /**
   * Underlying HTML element. All normal HTML methods can be called on this.
   *
   * @property elt
   */
  this.elt = elt;
  this._pInst = pInst;
  this._events = {};
  this.width = this.elt.offsetWidth;
  this.height = this.elt.offsetHeight;
};

/**
 *
 * Attaches the element to the parent specified. A way of setting
 * the container for the element. Accepts either a string ID, DOM
 * node, or p5.Element.
 *
 * @method parent
 * @param  {String|Object} parent the ID, DOM node, or p5.Element
 *                         of desired parent element
 * @return {p5.Element}
 * @example
 * <div class="norender"><code>
 * // in the html file:
 * &lt;div id="myContainer">&lt;/div>
 * // in the js file:
 * var cnv = createCanvas(100, 100);
 * cnv.parent("myContainer");
 * </code></div>
 * <div class='norender'><code>
 * var div0 = createDiv('this is the parent');
 * var div1 = createDiv('this is the child');
 * div1.parent(div0); // use p5.Element
 * </code></div>
 * <div class='norender'><code>
 * var div0 = createDiv('this is the parent');
 * div0.id('apples');
 * var div1 = createDiv('this is the child');
 * div1.parent('apples'); // use id
 * </code></div>
 * <div class='norender'><code>
 * var elt = document.getElementById('myParentDiv');
 * var div1 = createDiv('this is the child');
 * div1.parent(elt); // use element from page
 * </code></div>
 */
p5.Element.prototype.parent = function(p) {
  if (typeof p === 'string') {
    p = document.getElementById(p);
  } else if (p instanceof p5.Element) {
    p = p.elt;
  }
  p.appendChild(this.elt);
  return this;
};

/**
 *
 * Sets the ID of the element
 *
 * @method id
 * @param  {String} id ID of the element
 * @return {p5.Element}
 */
p5.Element.prototype.id = function(id) {
  this.elt.id = id;
  return this;
};

/**
 *
 * Adds given class to the element
 *
 * @method class
 * @param  {String} class class to add
 * @return {p5.Element}
 */
p5.Element.prototype.class = function(c) {
  this.elt.className += ' '+c;
  return this;
};

/**
 * The .mousePressed() function is called once after every time a
 * mouse button is pressed over the element. This can be used to
 * attach element specific event listeners.
 *
 * @method mousePressed
 * @param  {Function} fxn function to be fired when mouse is
 *                    pressed over the element.
 * @return {p5.Element}
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
 * function setup() {
 *   cnv = createCanvas(100, 100);
 *   cnv.mousePressed(changeGray); // attach listener for
 *                                 // canvas click only
 *   d = 10;
 *   g = 100;
 * }
 *
 * function draw() {
 *   background(g);
 *   ellipse(width/2, height/2, d, d);
 * }
 *
 * // this function fires with any click anywhere
 * function mousePressed() {
 *   d = d + 10;
 * }
 *
 * // this function fires only when cnv is clicked
 * function changeGray() {
 *   g = random(0, 255);
 * }
 * </code></div>
 *
 */
p5.Element.prototype.mousePressed = function (fxn) {
  attachListener('mousedown', fxn, this);
  attachListener('touchstart', fxn, this);
  return this;
};

/**
 * The .mouseWheel() function is called once after every time a
 * mouse wheel is scrolled over the element. This can be used to
 * attach element specific event listeners.<br><br>
 * The event.wheelDelta or event.detail property returns negative values if
 * the mouse wheel if rotated up or away from the user and positive in the
 * other direction. On OS X with "natural" scrolling enabled, the values are
 * opposite.
 *
 * @method mouseWheel
 * @param  {Function} fxn function to be fired when mouse wheel is
 *                    scrolled over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.mouseWheel = function (fxn) {
  attachListener('mousewheel', fxn, this);
  return this;
};

/**
 * The .mouseReleased() function is called once after every time a
 * mouse button is released over the element. This can be used to
 * attach element specific event listeners.
 *
 * @method mouseReleased
 * @param  {Function} fxn function to be fired when mouse is
 *                    released over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.mouseReleased = function (fxn) {
  attachListener('mouseup', fxn, this);
  attachListener('touchend', fxn, this);
  return this;
};


/**
 * The .mouseClicked() function is called once after a mouse button is
 * pressed and released over the element. This can be used to
 * attach element specific event listeners.
 *
 * @method mouseClicked
 * @param  {Function} fxn function to be fired when mouse is
 *                    clicked over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.mouseClicked = function (fxn) {
  attachListener('click', fxn, this);
  return this;
};

/**
 * The .mouseMoved() function is called once every time a
 * mouse moves over the element. This can be used to attach an
 * element specific event listener.
 *
 * @method mouseMoved
 * @param  {Function} fxn function to be fired when mouse is
 *                    moved over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.mouseMoved = function (fxn) {
  attachListener('mousemove', fxn, this);
  attachListener('touchmove', fxn, this);
  return this;
};

/**
 * The .mouseOver() function is called once after every time a
 * mouse moves onto the element. This can be used to attach an
 * element specific event listener.
 *
 * @method mouseOver
 * @param  {Function} fxn function to be fired when mouse is
 *                    moved over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.mouseOver = function (fxn) {
  attachListener('mouseover', fxn, this);
  return this;
};

/**
 * The .mouseOut() function is called once after every time a
 * mouse moves off the element. This can be used to attach an
 * element specific event listener.
 *
 * @method mouseOut
 * @param  {Function} fxn function to be fired when mouse is
 *                    moved off the element.
 * @return {p5.Element}
 */
p5.Element.prototype.mouseOut = function (fxn) {
  attachListener('mouseout', fxn, this);
  return this;
};

/**
 * The .touchStarted() function is called once after every time a touch is
 * registered. This can be used to attach element specific event listeners.
 *
 * @method touchStarted
 * @param  {Function} fxn function to be fired when touch is
 *                    started over the element.
 * @return {p5.Element}
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
 * function setup() {
 *   cnv = createCanvas(100, 100);
 *   cnv.touchStarted(changeGray); // attach listener for
 *                                 // canvas click only
 *   d = 10;
 *   g = 100;
 * }
 *
 * function draw() {
 *   background(g);
 *   ellipse(width/2, height/2, d, d);
 * }
 *
 * // this function fires with any touch anywhere
 * function touchStarted() {
 *   d = d + 10;
 * }
 *
 * // this function fires only when cnv is clicked
 * function changeGray() {
 *   g = random(0, 255);
 * }
 * </code></div>
 *
 */
p5.Element.prototype.touchStarted = function (fxn) {
  attachListener('touchstart', fxn, this);
  attachListener('mousedown', fxn, this);
  return this;
};

/**
 * The .touchMoved() function is called once after every time a touch move is
 * registered. This can be used to attach element specific event listeners.
 *
 * @method touchMoved
 * @param  {Function} fxn function to be fired when touch is moved
 *                    over the element.
 * @return {p5.Element}
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var g;
 * function setup() {
 *   cnv = createCanvas(100, 100);
 *   cnv.touchMoved(changeGray); // attach listener for
 *                               // canvas click only
 *   g = 100;
 * }
 *
 * function draw() {
 *   background(g);
 * }
 *
 * // this function fires only when cnv is clicked
 * function changeGray() {
 *   g = random(0, 255);
 * }
 * </code></div>
 *
 */
p5.Element.prototype.touchMoved = function (fxn) {
  attachListener('touchmove', fxn, this);
  attachListener('mousemove', fxn, this);
  return this;
};

/**
 * The .touchEnded() function is called once after every time a touch is
 * registered. This can be used to attach element specific event listeners.
 *
 * @method touchEnded
 * @param  {Function} fxn function to be fired when touch is
 *                    ended over the element.
 * @return {p5.Element}
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
 * function setup() {
 *   cnv = createCanvas(100, 100);
 *   cnv.touchEnded(changeGray);   // attach listener for
 *                                 // canvas click only
 *   d = 10;
 *   g = 100;
 * }
 *
 * function draw() {
 *   background(g);
 *   ellipse(width/2, height/2, d, d);
 * }
 *
 * // this function fires with any touch anywhere
 * function touchEnded() {
 *   d = d + 10;
 * }
 *
 * // this function fires only when cnv is clicked
 * function changeGray() {
 *   g = random(0, 255);
 * }
 * </code></div>
 *
 */
p5.Element.prototype.touchEnded = function (fxn) {
  attachListener('touchend', fxn, this);
  attachListener('mouseup', fxn, this);
  return this;
};



/**
 * The .dragOver() function is called once after every time a
 * file is dragged over the element. This can be used to attach an
 * element specific event listener.
 *
 * @method dragOver
 * @param  {Function} fxn function to be fired when mouse is
 *                    dragged over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.dragOver = function (fxn) {
  attachListener('dragover', fxn, this);
  return this;
};

/**
 * The .dragLeave() function is called once after every time a
 * dragged file leaves the element area. This can be used to attach an
 * element specific event listener.
 *
 * @method dragLeave
 * @param  {Function} fxn function to be fired when mouse is
 *                    dragged over the element.
 * @return {p5.Element}
 */
p5.Element.prototype.dragLeave = function (fxn) {
  attachListener('dragleave', fxn, this);
  return this;
};

/**
 * The .drop() function is called for each file dropped on the element.
 * It requires a callback that is passed a p5.File object.  You can
 * optionally pass two callbacks, the first one (required) is triggered
 * for each file dropped when the file is loaded.  The second (optional)
 * is triggered just once when a file (or files) are dropped.
 *
 * @method drop
 * @param  {Function} callback triggered when files are dropped.
 * @param  {Function} callback to receive loaded file.
 * @return {p5.Element}
 */
p5.Element.prototype.drop = function (callback, fxn) {
  // Make a file loader callback and trigger user's callback
  function makeLoader(theFile) {
    // Making a p5.File object
    var p5file = new p5.File(theFile);
    return function(e) {
      p5file.data = e.target.result;
      callback(p5file);
    };
  }

  // Is the file stuff supported?
  if (window.File && window.FileReader && window.FileList && window.Blob) {

    // If you want to be able to drop you've got to turn off
    // a lot of default behavior
    attachListener('dragover',function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    },this);

    // If this is a drag area we need to turn off the default behavior
    attachListener('dragleave',function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    },this);

    // If just one argument it's the callback for the files
    if (arguments.length > 1) {
      attachListener('drop', fxn, this);
    }

    // Deal with the files
    attachListener('drop', function(evt) {

      evt.stopPropagation();
      evt.preventDefault();

      // A FileList
      var files = evt.dataTransfer.files;

      // Load each one and trigger the callback
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var reader = new FileReader();
        reader.onload = makeLoader(f);


        // Text of data?
        // This should likely be improved
        if (f.type === 'text') {
          reader.readAsText(f);
        } else {
          reader.readAsDataURL(f);
        }
      }
    }, this);
  } else {
    console.log('The File APIs are not fully supported in this browser.');
  }

  return this;
};




function attachListener(ev, fxn, ctx) {
  // LM removing, not sure why we had this?
  // var _this = ctx;
  // var f = function (e) { fxn(e, _this); };
  var f = fxn.bind(ctx);
  ctx.elt.addEventListener(ev, f, false);
  ctx._events[ev] = f;
}

/**
 * Helper fxn for sharing pixel methods
 *
 */
p5.Element.prototype._setProperty = function (prop, value) {
  this[prop] = value;
};


module.exports = p5.Element;

},{"./core":16}],21:[function(require,module,exports){
/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

var p5 = require('./core');
var constants = require('./constants');

/**
 * Thin wrapper around a renderer, to be used for creating a
 * graphics buffer object. Use this class if you need
 * to draw into an off-screen graphics buffer. The two parameters define the
 * width and height in pixels. The fields and methods for this class are
 * extensive, but mirror the normal drawing API for p5.
 *
 * @class p5.Graphics
 * @constructor
 * @extends p5.Element
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 * @param {Boolean} whether we're using it as main canvas
 */
p5.Graphics = function(w, h, renderer, pInst) {

  var r = renderer || constants.P2D;

  var c = document.createElement('canvas');
  var node = this._userNode || document.body;
  node.appendChild(c);

  p5.Element.call(this, c, pInst, false);
  this._styles = [];
  this.width = w;
  this.height = h;
  this.pixelDensity = pInst.pixelDensity;

  if (r === constants.WEBGL) {
    this._graphics = new p5.Renderer3D(c, this, false);
  } else {
    this._graphics = new p5.Renderer2D(c, this, false);
  }

  this._graphics.resize(w, h);
  this._graphics._applyDefaults();

  pInst._elements.push(this);

  // bind methods and props of p5 to the new object
  for (var p in p5.prototype) {
    if (!this[p]) {
      if (typeof p5.prototype[p] === 'function') {
        this[p] = p5.prototype[p].bind(this);
      } else {
        this[p] = p5.prototype[p];
      }
    }
  }

  return this;
};

p5.Graphics.prototype = Object.create(p5.Element.prototype);

module.exports = p5.Graphics;

},{"./constants":15,"./core":16}],22:[function(require,module,exports){
/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

var p5 = require('./core');

/**
 * Main graphics and rendering context, as well as the base API
 * implementation for p5.js "core". To be used as the superclass for
 * Renderer2D and Renderer3D classes, respecitvely.
 *
 * @class p5.Renderer
 * @constructor
 * @extends p5.Element
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 * @param {Boolean} whether we're using it as main canvas
 */
p5.Renderer = function(elt, pInst, isMainCanvas) {
  p5.Element.call(this, elt, pInst);
  this.canvas = elt;
  this._pInst = pInst;
  if (isMainCanvas) {
    this._isMainCanvas = true;
    // for pixel method sharing with pimage
    this._pInst._setProperty('_curElement', this);
    this._pInst._setProperty('canvas', this.canvas);
    this._pInst._setProperty('width', this.width);
    this._pInst._setProperty('height', this.height);
  } else { // hide if offscreen buffer by default
    this.canvas.style.display = 'none';
    this._styles = []; // non-main elt styles stored in p5.Renderer
  }
};

p5.Renderer.prototype = Object.create(p5.Element.prototype);

/**
 * Resize our canvas element.
 */
p5.Renderer.prototype.resize = function(w, h) {
  this.width = w;
  this.height = h;
  this.elt.width = w * this._pInst.pixelDensity;
  this.elt.height = h * this._pInst.pixelDensity;
  this.elt.style.width = w +'px';
  this.elt.style.height = h + 'px';
  if (this._isMainCanvas) {
    this._pInst._setProperty('width', this.width);
    this._pInst._setProperty('height', this.height);
  }
};

module.exports = p5.Renderer;

},{"./core":16}],23:[function(require,module,exports){

var p5 = require('./core');
var canvas = require('./canvas');
var constants = require('./constants');
var filters = require('../image/filters');

require('./p5.Renderer');

/**
 * 2D graphics renderer class.  Can also be used as an off-screen
 * graphics buffer. A p5.Renderer2D object can be constructed
 * with the <code>createRenderer2D()</code> function. The fields and methods
 * for this class are extensive, but mirror the normal drawing API for p5.
 *
 * @class p5.Renderer2D
 * @constructor
 * @extends p5.Renderer
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 * @example
 * <div>
 * <code>
 * var pg;
 * function setup() {
 *   createCanvas(100, 100);
 *   pg = createRenderer2D(40, 40);
 * }
 * function draw() {
 *   background(200);
 *   pg.background(100);
 *   pg.noStroke();
 *   pg.ellipse(pg.width/2, pg.height/2, 50, 50);
 *   image(pg, 9, 30);
 *   image(pg, 51, 30);
 * }
 * </code>
 * </div>
 */
var styleEmpty = 'rgba(0,0,0,0)';
// var alphaThreshold = 0.00125; // minimum visible

p5.Renderer2D = function(elt, pInst, isMainCanvas){
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this.drawingContext = this.canvas.getContext('2d');
  this._pInst._setProperty('drawingContext', this.drawingContext);
  return this;
};

p5.Renderer2D.prototype = Object.create(p5.Renderer.prototype);

p5.Renderer2D.prototype._applyDefaults = function() {
  this.drawingContext.fillStyle = constants._DEFAULT_FILL;
  this.drawingContext.strokeStyle = constants._DEFAULT_STROKE;
  this.drawingContext.lineCap = constants.ROUND;
  this.drawingContext.font = 'normal 12px sans-serif';
};

p5.Renderer2D.prototype.resize = function(w,h) {
  p5.Renderer.prototype.resize.call(this, w,h);
  this.drawingContext.scale(this._pInst.pixelDensity,
                            this._pInst.pixelDensity);
};

//////////////////////////////////////////////
// COLOR | Setting
//////////////////////////////////////////////

p5.Renderer2D.prototype.background = function() {
  this.drawingContext.save();
  this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
  this.drawingContext.scale(this._pInst.pixelDensity,
                            this._pInst.pixelDensity);

  if (arguments[0] instanceof p5.Image) {
    this._pInst.image(arguments[0], 0, 0, this.width, this.height);
  } else {
    var curFill = this.drawingContext.fillStyle;
    // create background rect
    var color = this._pInst.color.apply(this._pInst, arguments);
    var newFill = color.toString();
    this.drawingContext.fillStyle = newFill;
    this.drawingContext.fillRect(0, 0, this.width, this.height);
    // reset fill
    this.drawingContext.fillStyle = curFill;
  }
  this.drawingContext.restore();
};

p5.Renderer2D.prototype.clear = function() {
  this.drawingContext.clearRect(0, 0, this.width, this.height);
};

p5.Renderer2D.prototype.fill = function() {

  var ctx = this.drawingContext;
  var color = this._pInst.color.apply(this._pInst, arguments);
  ctx.fillStyle = color.toString();
};

p5.Renderer2D.prototype.stroke = function() {
  var ctx = this.drawingContext;
  var color = this._pInst.color.apply(this._pInst, arguments);
  ctx.strokeStyle = color.toString();
};

//////////////////////////////////////////////
// IMAGE | Loading & Displaying
//////////////////////////////////////////////

p5.Renderer2D.prototype.image = function (img, x, y, w, h) {
  var frame = img.canvas || img.elt;
  try {
    if (this._pInst._tint && img.canvas) {
      this.drawingContext.drawImage(this._getTintedImageCanvas(img),
        x, y, w, h);
    } else {
      this.drawingContext.drawImage(frame, x, y, w, h);
    }
  } catch (e) {
    if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
      throw e;
    }
  }
};

p5.Renderer2D.prototype._getTintedImageCanvas = function (img) {
  if (!img.canvas) {
    return img;
  }
  var pixels = filters._toPixels(img.canvas);
  var tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = img.canvas.width;
  tmpCanvas.height = img.canvas.height;
  var tmpCtx = tmpCanvas.getContext('2d');
  var id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
  var newPixels = id.data;
  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    var a = pixels[i + 3];
    newPixels[i] = r * this._pInst._tint[0] / 255;
    newPixels[i + 1] = g * this._pInst._tint[1] / 255;
    newPixels[i + 2] = b * this._pInst._tint[2] / 255;
    newPixels[i + 3] = a * this._pInst._tint[3] / 255;
  }
  tmpCtx.putImageData(id, 0, 0);
  return tmpCanvas;
};


//////////////////////////////////////////////
// IMAGE | Pixels
//////////////////////////////////////////////

p5.Renderer2D.prototype.blendMode = function(mode) {
  this.drawingContext.globalCompositeOperation = mode;
};
p5.Renderer2D.prototype.blend = function() {
  var currBlend = this.drawingContext.globalCompositeOperation;
  var blendMode = arguments[arguments.length - 1];

  var copyArgs = Array.prototype.slice.call(
    arguments,
    0,
    arguments.length - 1
  );

  this.drawingContext.globalCompositeOperation = blendMode;
  this._pInst.copy.apply(this._pInst, copyArgs);
  this.drawingContext.globalCompositeOperation = currBlend;
};

p5.Renderer2D.prototype.copy = function () {
  var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
  if (arguments.length === 9) {
    srcImage = arguments[0];
    sx = arguments[1];
    sy = arguments[2];
    sw = arguments[3];
    sh = arguments[4];
    dx = arguments[5];
    dy = arguments[6];
    dw = arguments[7];
    dh = arguments[8];
  } else if (arguments.length === 8) {
    srcImage = this._pInst;
    sx = arguments[0];
    sy = arguments[1];
    sw = arguments[2];
    sh = arguments[3];
    dx = arguments[4];
    dy = arguments[5];
    dw = arguments[6];
    dh = arguments[7];
  } else {
    throw new Error('Signature not supported');
  }
  p5.Renderer2D._copyHelper(srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
};

p5.Renderer2D._copyHelper =
function (srcImage, sx, sy, sw, sh, dx, dy, dw, dh) {
  var s = srcImage.canvas.width / srcImage.width;
  this.drawingContext.drawImage(srcImage.canvas,
    s * sx, s * sy, s * sw, s * sh, dx, dy, dw, dh);
};

p5.Renderer2D.prototype.get = function(x, y, w, h) {
  if (x === undefined && y === undefined &&
      w === undefined && h === undefined){
    x = 0;
    y = 0;
    w = this.width;
    h = this.height;
  } else if (w === undefined && h === undefined) {
    w = 1;
    h = 1;
  }

  if(x > this.width || y > this.height || x < 0 || y < 0){
    return [0, 0, 0, 255];
  }

  var pd = this.pixelDensity || this._pInst.pixelDensity;

  if (w === 1 && h === 1){

    var imageData = this.drawingContext.getImageData(x * pd, y * pd, w, h);
    var data = imageData.data;
    var pixels = [];

    for (var i = 0; i < data.length; i += 4) {
      pixels.push(data[i], data[i+1], data[i+2], data[i+3]);
    }

    return pixels;
  } else {
    var sx = x * pd;
    var sy = y * pd;
    //auto constrain the width and height to
    //dimensions of the source image
    var dw = Math.min(w, this.width);
    var dh = Math.min(h, this.height);
    var sw = dw * pd;
    var sh = dh * pd;

    var region = new p5.Image(dw, dh);
    region.canvas.getContext('2d').drawImage(this.canvas, sx, sy, sw, sh,
      0, 0, dw, dh);

    return region;
  }
};

p5.Renderer2D.prototype.loadPixels = function () {
  var pd = this.pixelDensity || this._pInst.pixelDensity;
  var w = this.width * pd;
  var h = this.height * pd;
  var imageData = this.drawingContext.getImageData(0, 0, w, h);
  if (this._pInst) {
    this._pInst._setProperty('imageData', imageData);
    this._pInst._setProperty('pixels', imageData.data);
  } else { // if called by p5.Image
    this._setProperty('imageData', imageData);
    this._setProperty('pixels', imageData.data);
  }
};

p5.Renderer2D.prototype.set = function (x, y, imgOrCol) {
  if (imgOrCol instanceof p5.Image) {
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(this._pInst.pixelDensity,
                              this._pInst.pixelDensity);
    this.drawingContext.drawImage(imgOrCol.canvas, x, y);
    this.loadPixels.call(this._pInst);
    this.drawingContext.restore();
  } else {
    var ctx = this._pInst || this;
    var r = 0, g = 0, b = 0, a = 0;
    var idx = 4*((y * ctx.pixelDensity) *
      (this.width * ctx.pixelDensity) + (x * ctx.pixelDensity));
    if (!ctx.imageData) {
      ctx.loadPixels.call(ctx);
    }
    if (typeof imgOrCol === 'number') {
      if (idx < ctx.pixels.length) {
        r = imgOrCol;
        g = imgOrCol;
        b = imgOrCol;
        a = 255;
        //this.updatePixels.call(this);
      }
    }
    else if (imgOrCol instanceof Array) {
      if (imgOrCol.length < 4) {
        throw new Error('pixel array must be of the form [R, G, B, A]');
      }
      if (idx < ctx.pixels.length) {
        r = imgOrCol[0];
        g = imgOrCol[1];
        b = imgOrCol[2];
        a = imgOrCol[3];
        //this.updatePixels.call(this);
      }
    } else if (imgOrCol instanceof p5.Color) {
      if (idx < ctx.pixels.length) {
        r = imgOrCol.rgba[0];
        g = imgOrCol.rgba[1];
        b = imgOrCol.rgba[2];
        a = imgOrCol.rgba[3];
        //this.updatePixels.call(this);
      }
    }
    // loop over pixelDensity * pixelDensity
    for (var i = 0; i < ctx.pixelDensity; i++) {
      for (var j = 0; j < ctx.pixelDensity; j++) {
        // loop over
        idx = 4*((y * ctx.pixelDensity + j) * this.width *
          ctx.pixelDensity + (x * ctx.pixelDensity + i));
        ctx.pixels[idx] = r;
        ctx.pixels[idx+1] = g;
        ctx.pixels[idx+2] = b;
        ctx.pixels[idx+3] = a;
      }
    }
  }
};

p5.Renderer2D.prototype.updatePixels = function (x, y, w, h) {
  var pd = this.pixelDensity || this._pInst.pixelDensity;
  if (x === undefined &&
      y === undefined &&
      w === undefined &&
      h === undefined) {
    x = 0;
    y = 0;
    w = this.width;
    h = this.height;
  }
  w *= pd;
  h *= pd;

  if (this._pInst) {
    this.drawingContext.putImageData(this._pInst.imageData, x, y, 0, 0, w, h);
  } else {
    this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
  }
};

//////////////////////////////////////////////
// SHAPE | 2D Primitives
//////////////////////////////////////////////

/**
 * Generate a cubic Bezier representing an arc on the unit circle of total
 * angle `size` radians, beginning `start` radians above the x-axis. Up to
 * four of these curves are combined to make a full arc.
 *
 * See www.joecridge.me/bezier.pdf for an explanation of the method.
 */
p5.Renderer2D.prototype._acuteArcToBezier =
  function _acuteArcToBezier(start, size) {
  // Evauate constants.
  var alpha = size / 2.0,
    cos_alpha = Math.cos(alpha),
    sin_alpha = Math.sin(alpha),
    cot_alpha = 1.0 / Math.tan(alpha),
    phi = start + alpha,  // This is how far the arc needs to be rotated.
    cos_phi = Math.cos(phi),
    sin_phi = Math.sin(phi),
    lambda = (4.0 - cos_alpha) / 3.0,
    mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;

  // Return rotated waypoints.
  return {
    ax: Math.cos(start),
    ay: Math.sin(start),
    bx: lambda * cos_phi + mu * sin_phi,
    by: lambda * sin_phi - mu * cos_phi,
    cx: lambda * cos_phi - mu * sin_phi,
    cy: lambda * sin_phi + mu * cos_phi,
    dx: Math.cos(start + size),
    dy: Math.sin(start + size)
  };
};

p5.Renderer2D.prototype.arc =
  function(x, y, w, h, start, stop, mode) {
  var ctx = this.drawingContext;
  var vals = canvas.arcModeAdjust(x, y, w, h, this._pInst._ellipseMode);
  var rx = vals.w / 2.0;
  var ry = vals.h / 2.0;
  var epsilon = 0.00001;  // Smallest visible angle on displays up to 4K.
  var arcToDraw = 0;
  var curves = [];

  // Create curves
  while(stop - start > epsilon) {
    arcToDraw = Math.min(stop - start, constants.HALF_PI);
    curves.push(this._acuteArcToBezier(start, arcToDraw));
    start += arcToDraw;
  }

  // Fill curves
  if (this._pInst._doFill) {
    ctx.beginPath();
    curves.forEach(function (curve, index) {
      if (index === 0) {
        ctx.moveTo(vals.x + curve.ax * rx, vals.y + curve.ay * ry);
      }
      ctx.bezierCurveTo(vals.x + curve.bx * rx, vals.y + curve.by * ry,
                        vals.x + curve.cx * rx, vals.y + curve.cy * ry,
                        vals.x + curve.dx * rx, vals.y + curve.dy * ry);
    });
    if (mode === constants.PIE || mode == null) {
      ctx.lineTo(vals.x, vals.y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Stroke curves
  if (this._pInst._doStroke) {
    ctx.beginPath();
    curves.forEach(function (curve, index) {
      if (index === 0) {
        ctx.moveTo(vals.x + curve.ax * rx, vals.y + curve.ay * ry);
      }
      ctx.bezierCurveTo(vals.x + curve.bx * rx, vals.y + curve.by * ry,
                        vals.x + curve.cx * rx, vals.y + curve.cy * ry,
                        vals.x + curve.dx * rx, vals.y + curve.dy * ry);
    });
    if (mode === constants.PIE) {
      ctx.lineTo(vals.x, vals.y);
      ctx.closePath();
    } else if (mode === constants.CHORD) {
      ctx.closePath();
    }
    ctx.stroke();
  }
  return this;
};

p5.Renderer2D.prototype.ellipse = function(x, y, w, h) {
  var ctx = this.drawingContext;
  var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
  if (doFill && !doStroke) {
    if(ctx.fillStyle === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if(ctx.strokeStyle === styleEmpty) {
      return this;
    }
  }
  var vals = canvas.modeAdjust(x, y, w, h, this._pInst._ellipseMode);
  var kappa = 0.5522847498,
    ox = (vals.w / 2) * kappa, // control point offset horizontal
    oy = (vals.h / 2) * kappa, // control point offset vertical
    xe = vals.x + vals.w,      // x-end
    ye = vals.y + vals.h,      // y-end
    xm = vals.x + vals.w / 2,  // x-middle
    ym = vals.y + vals.h / 2;  // y-middle
  ctx.beginPath();
  ctx.moveTo(vals.x, ym);
  ctx.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
  ctx.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
};

p5.Renderer2D.prototype.line = function(x1, y1, x2, y2) {
  var ctx = this.drawingContext;
  if (!this._pInst._doStroke) {
    return this;
  } else if(ctx.strokeStyle === styleEmpty){
    return this;
  }
  // Translate the line by (0.5, 0.5) to draw it crisp
  if (ctx.lineWidth % 2 === 1) {
    ctx.translate(0.5, 0.5);
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  if (ctx.lineWidth % 2 === 1) {
    ctx.translate(-0.5, -0.5);
  }
  return this;
};

p5.Renderer2D.prototype.point = function(x, y) {
  var ctx = this.drawingContext;
  var s = ctx.strokeStyle;
  var f = ctx.fillStyle;
  if (!this._pInst._doStroke) {
    return this;
  } else if(ctx.strokeStyle === styleEmpty){
    return this;
  }
  x = Math.round(x);
  y = Math.round(y);
  ctx.fillStyle = s;
  if (ctx.lineWidth > 1) {
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      ctx.lineWidth / 2,
      0,
      constants.TWO_PI,
      false
    );
    ctx.fill();
  } else {
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.fillStyle = f;
};

p5.Renderer2D.prototype.quad =
  function(x1, y1, x2, y2, x3, y3, x4, y4) {
  var ctx = this.drawingContext;
  var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
  if (doFill && !doStroke) {
    if(ctx.fillStyle === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if(ctx.strokeStyle === styleEmpty) {
      return this;
    }
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
  return this;
};

p5.Renderer2D.prototype.rect = function(x, y, w, h, tl, tr, br, bl) {
  var ctx = this.drawingContext;
  var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
  if (doFill && !doStroke) {
    if(ctx.fillStyle === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if(ctx.strokeStyle === styleEmpty) {
      return this;
    }
  }
  var vals = canvas.modeAdjust(x, y, w, h, this._pInst._rectMode);
  // Translate the line by (0.5, 0.5) to draw a crisp rectangle border
  if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
    ctx.translate(0.5, 0.5);
  }
  ctx.beginPath();

  if (typeof tl === 'undefined') {
    // No rounded corners
    ctx.rect(vals.x, vals.y, vals.w, vals.h);
  } else {
    // At least one rounded corner
    // Set defaults when not specified
    if (typeof tr === 'undefined') { tr = tl; }
    if (typeof br === 'undefined') { br = tr; }
    if (typeof bl === 'undefined') { bl = br; }

    // Cache and compute several values
    var _x = vals.x;
    var _y = vals.y;
    var _w = vals.w;
    var _h = vals.h;
    var hw = _w / 2;
    var hh = _h / 2;

    // Clip radii
    if (_w < 2 * tl) { tl = hw; }
    if (_h < 2 * tl) { tl = hh; }
    if (_w < 2 * tr) { tr = hw; }
    if (_h < 2 * tr) { tr = hh; }
    if (_w < 2 * br) { br = hw; }
    if (_h < 2 * br) { br = hh; }
    if (_w < 2 * bl) { bl = hw; }
    if (_h < 2 * bl) { bl = hh; }

    // Draw shape
    ctx.beginPath();
    ctx.moveTo(_x + tl, _y);
    ctx.arcTo(_x + _w, _y, _x + _w, _y + _h, tr);
    ctx.arcTo(_x + _w, _y + _h, _x, _y + _h, br);
    ctx.arcTo(_x, _y + _h, _x, _y, bl);
    ctx.arcTo(_x, _y, _x + _w, _y, tl);
    ctx.closePath();
  }
  if (this._pInst._doFill) {
    ctx.fill();
  }
  if (this._pInst._doStroke) {
    ctx.stroke();
  }
  if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
    ctx.translate(-0.5, -0.5);
  }
  return this;
};

p5.Renderer2D.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
  var ctx = this.drawingContext;
  var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
  if (doFill && !doStroke) {
    if(ctx.fillStyle === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if(ctx.strokeStyle === styleEmpty) {
      return this;
    }
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
};

p5.Renderer2D.prototype.endShape =
function (mode, vertices, isCurve, isBezier,
    isQuadratic, isContour, shapeKind) {
  if (vertices.length === 0) {
    return this;
  }
  if (!this._pInst._doStroke && !this._pInst._doFill) {
    return this;
  }
  var closeShape = mode === constants.CLOSE;
  var v;
  if (closeShape && !isContour) {
    vertices.push(vertices[0]);
  }
  var i, j;
  var numVerts = vertices.length;
  if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
    if (numVerts > 3) {
      var b = [], s = 1 - this._pInst._curveTightness;
      this.drawingContext.beginPath();
      this.drawingContext.moveTo(vertices[1][0], vertices[1][1]);
      for (i = 1; i + 2 < numVerts; i++) {
        v = vertices[i];
        b[0] = [
          v[0],
          v[1]
        ];
        b[1] = [
          v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
          v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
        ];
        b[2] = [
          vertices[i + 1][0] +
          (s * vertices[i][0]-s * vertices[i + 2][0]) / 6,
          vertices[i + 1][1]+(s * vertices[i][1] - s*vertices[i + 2][1]) / 6
        ];
        b[3] = [
          vertices[i + 1][0],
          vertices[i + 1][1]
        ];
        this.drawingContext.bezierCurveTo(b[1][0],b[1][1],
          b[2][0],b[2][1],b[3][0],b[3][1]);
      }
      if (closeShape) {
        this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
      }
      this._doFillStrokeClose();
    }
  } else if (isBezier&&(shapeKind===constants.POLYGON ||shapeKind === null)) {
    this.drawingContext.beginPath();
    for (i = 0; i < numVerts; i++) {
      if (vertices[i].isVert) {
        if (vertices[i].moveTo) {
          this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
        } else {
          this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
        }
      } else {
        this.drawingContext.bezierCurveTo(vertices[i][0], vertices[i][1],
          vertices[i][2], vertices[i][3], vertices[i][4], vertices[i][5]);
      }
    }
    this._doFillStrokeClose();
  } else if (isQuadratic &&
    (shapeKind === constants.POLYGON || shapeKind === null)) {
    this.drawingContext.beginPath();
    for (i = 0; i < numVerts; i++) {
      if (vertices[i].isVert) {
        if (vertices[i].moveTo) {
          this.drawingContext.moveTo([0], vertices[i][1]);
        } else {
          this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
        }
      } else {
        this.drawingContext.quadraticCurveTo(vertices[i][0], vertices[i][1],
          vertices[i][2], vertices[i][3]);
      }
    }
    this._doFillStrokeClose();
  } else {
    if (shapeKind === constants.POINTS) {
      for (i = 0; i < numVerts; i++) {
        v = vertices[i];
        if (this._pInst._doStroke) {
          this._pInst.stroke(v[6]);
        }
        this._pInst.point(v[0], v[1]);
      }
    } else if (shapeKind === constants.LINES) {
      for (i = 0; i + 1 < numVerts; i += 2) {
        v = vertices[i];
        if (this._pInst._doStroke) {
          this._pInst.stroke(vertices[i + 1][6]);
        }
        this._pInst.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
      }
    } else if (shapeKind === constants.TRIANGLES) {
      for (i = 0; i + 2 < numVerts; i += 3) {
        v = vertices[i];
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(v[0], v[1]);
        this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
        this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
        this.drawingContext.lineTo(v[0], v[1]);
        if (this._pInst._doFill) {
          this._pInst.fill(vertices[i + 2][5]);
          this.drawingContext.fill();
        }
        if (this._pInst._doStroke) {
          this._pInst.stroke(vertices[i + 2][6]);
          this.drawingContext.stroke();
        }
        this.drawingContext.closePath();
      }
    } else if (shapeKind === constants.TRIANGLE_STRIP) {
      for (i = 0; i + 1 < numVerts; i++) {
        v = vertices[i];
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
        this.drawingContext.lineTo(v[0], v[1]);
        if (this._pInst._doStroke) {
          this._pInst.stroke(vertices[i + 1][6]);
        }
        if (this._pInst._doFill) {
          this._pInst.fill(vertices[i + 1][5]);
        }
        if (i + 2 < numVerts) {
          this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 2][6]);
          }
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 2][5]);
          }
        }
        this._doFillStrokeClose();
      }
    } else if (shapeKind === constants.TRIANGLE_FAN) {
      if (numVerts > 2) {
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
        this.drawingContext.lineTo(vertices[1][0], vertices[1][1]);
        this.drawingContext.lineTo(vertices[2][0], vertices[2][1]);
        if (this._pInst._doFill) {
          this._pInst.fill(vertices[2][5]);
        }
        if (this._pInst._doStroke) {
          this._pInst.stroke(vertices[2][6]);
        }
        this._doFillStrokeClose();
        for (i = 3; i < numVerts; i++) {
          v = vertices[i];
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
          this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._pInst._doFill) {
            this._pInst.fill(v[5]);
          }
          if (this._pInst._doStroke) {
            this._pInst.stroke(v[6]);
          }
          this._doFillStrokeClose();
        }
      }
    } else if (shapeKind === constants.QUADS) {
      for (i = 0; i + 3 < numVerts; i += 4) {
        v = vertices[i];
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(v[0], v[1]);
        for (j = 1; j < 4; j++) {
          this.drawingContext.lineTo(vertices[i + j][0], vertices[i + j][1]);
        }
        this.drawingContext.lineTo(v[0], v[1]);
        if (this._pInst._doFill) {
          this._pInst.fill(vertices[i + 3][5]);
        }
        if (this._pInst._doStroke) {
          this._pInst.stroke(vertices[i + 3][6]);
        }
        this._doFillStrokeClose();
      }
    } else if (shapeKind === constants.QUAD_STRIP) {
      if (numVerts > 3) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          this.drawingContext.beginPath();
          if (i + 3 < numVerts) {
            this.drawingContext.moveTo(vertices[i + 2][0], vertices[i+2][1]);
            this.drawingContext.lineTo(v[0], v[1]);
            this.drawingContext.lineTo(vertices[i + 1][0], vertices[i+1][1]);
            this.drawingContext.lineTo(vertices[i + 3][0], vertices[i+3][1]);
            if (this._pInst._doFill) {
              this._pInst.fill(vertices[i + 3][5]);
            }
            if (this._pInst._doStroke) {
              this._pInst.stroke(vertices[i + 3][6]);
            }
          } else {
            this.drawingContext.moveTo(v[0], v[1]);
            this.drawingContext.lineTo(vertices[i + 1][0], vertices[i+1][1]);
          }
          this._doFillStrokeClose();
        }
      }
    } else {
      this.drawingContext.beginPath();
      this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
      for (i = 1; i < numVerts; i++) {
        v = vertices[i];
        if (v.isVert) {
          if (v.moveTo) {
            this.drawingContext.moveTo(v[0], v[1]);
          } else {
            this.drawingContext.lineTo(v[0], v[1]);
          }
        }
      }
      this._doFillStrokeClose();
    }
  }
  isCurve = false;
  isBezier = false;
  isQuadratic = false;
  isContour = false;
  if (closeShape) {
    vertices.pop();
  }
  return this;
};
//////////////////////////////////////////////
// SHAPE | Attributes
//////////////////////////////////////////////

p5.Renderer2D.prototype.noSmooth = function() {
  if ('imageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.imageSmoothingEnabled = false;
  }
  else if ('mozImageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.mozImageSmoothingEnabled = false;
  }
  else if ('webkitImageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.webkitImageSmoothingEnabled = false;
  }
  else if ('msImageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.msImageSmoothingEnabled = false;
  }
  return this;
};

p5.Renderer2D.prototype.smooth = function() {
  if ('imageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.imageSmoothingEnabled = true;
  }
  else if ('mozImageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.mozImageSmoothingEnabled = true;
  }
  else if ('webkitImageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.webkitImageSmoothingEnabled = true;
  }
  else if ('msImageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.msImageSmoothingEnabled = true;
  }
  return this;
};

p5.Renderer2D.prototype.strokeCap = function(cap) {
  if (cap === constants.ROUND ||
    cap === constants.SQUARE ||
    cap === constants.PROJECT) {
    this.drawingContext.lineCap = cap;
  }
  return this;
};

p5.Renderer2D.prototype.strokeJoin = function(join) {
  if (join === constants.ROUND ||
    join === constants.BEVEL ||
    join === constants.MITER) {
    this.drawingContext.lineJoin = join;
  }
  return this;
};

p5.Renderer2D.prototype.strokeWeight = function(w) {
  if (typeof w === 'undefined' || w === 0) {
    // hack because lineWidth 0 doesn't work
    this.drawingContext.lineWidth = 0.0001;
  } else {
    this.drawingContext.lineWidth = w;
  }
  return this;
};

p5.Renderer2D.prototype._getFill = function(){
  return this.drawingContext.fillStyle;
};

p5.Renderer2D.prototype._getStroke = function(){
  return this.drawingContext.strokeStyle;
};

//////////////////////////////////////////////
// SHAPE | Curves
//////////////////////////////////////////////
p5.Renderer2D.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
  this._pInst.beginShape();
  this._pInst.vertex(x1, y1);
  this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
  this._pInst.endShape();
  return this;
};

p5.Renderer2D.prototype.curve = function (x1, y1, x2, y2, x3, y3, x4, y4) {
  this._pInst.beginShape();
  this._pInst.curveVertex(x1, y1);
  this._pInst.curveVertex(x2, y2);
  this._pInst.curveVertex(x3, y3);
  this._pInst.curveVertex(x4, y4);
  this._pInst.endShape();
  return this;
};

//////////////////////////////////////////////
// SHAPE | Vertex
//////////////////////////////////////////////

p5.Renderer2D.prototype._doFillStrokeClose = function () {
  if (this._pInst._doFill) {
    this.drawingContext.fill();
  }
  if (this._pInst._doStroke) {
    this.drawingContext.stroke();
  }
  this.drawingContext.closePath();
};

//////////////////////////////////////////////
// TRANSFORM
//////////////////////////////////////////////

p5.Renderer2D.prototype.applyMatrix =
function(n00, n01, n02, n10, n11, n12) {
  this.drawingContext.transform(n00, n01, n02, n10, n11, n12);
};

p5.Renderer2D.prototype.resetMatrix = function() {
  this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
  return this;
};

p5.Renderer2D.prototype.rotate = function(r) {
  this.drawingContext.rotate(r);
};

p5.Renderer2D.prototype.scale = function() {
  var x = 1.0,
    y = 1.0;
  if (arguments.length === 1) {
    x = y = arguments[0];
  } else {
    x = arguments[0];
    y = arguments[1];
  }
  this.drawingContext.scale(x, y);

  return this;
};

p5.Renderer2D.prototype.shearX = function(angle) {
  if (this._pInst._angleMode === constants.DEGREES) {
    angle = this._pInst.radians(angle);
  }
  this.drawingContext.transform(1, 0, this._pInst.tan(angle), 1, 0, 0);
  return this;
};

p5.Renderer2D.prototype.shearY = function(angle) {
  if (this._pInst._angleMode === constants.DEGREES) {
    angle = this._pInst.radians(angle);
  }
  this.drawingContext.transform(1, this._pInst.tan(angle), 0, 1, 0, 0);
  return this;
};

p5.Renderer2D.prototype.translate = function(x, y) {
  this.drawingContext.translate(x, y);
  return this;
};

//////////////////////////////////////////////
// TYPOGRAPHY
//
//////////////////////////////////////////////

p5.Renderer2D.prototype.text = function (str, x, y, maxWidth, maxHeight) {

  var p = this._pInst, cars, n, ii, jj, line, testLine,
    testWidth, words, totalHeight, baselineHacked;

  // baselineHacked: (HACK)
  // This is an ugly temporary fix to conform to
  // Processing's vertical alignment implementation
  // for BASELINE vetical alignment in a boundings box

  if (!(p._doFill || p._doStroke)) {
    return;
  }

  if (typeof str !== 'string') {
    str = str.toString();
  }

  str = str.replace(/(\t)/g, '  ');
  cars = str.split('\n');

  if (typeof maxWidth !== 'undefined') {

    totalHeight = 0;
    for (ii = 0; ii < cars.length; ii++) {
      line = '';
      words = cars[ii].split(' ');
      for (n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        testWidth = this.textWidth(testLine);
        if (testWidth > maxWidth) {
          line = words[n] + ' ';
          totalHeight += p.textLeading();
        } else {
          line = testLine;
        }
      }
    }

    if (this._pInst._rectMode === constants.CENTER ){

      x -= maxWidth / 2;
      y -= maxHeight / 2;
    }

    switch (this.drawingContext.textAlign) {

    case constants.CENTER:
      x += maxWidth / 2;
      break;
    case constants.RIGHT:
      x += maxWidth;
      break;
    }

    if (typeof maxHeight !== 'undefined') {

      switch (this.drawingContext.textBaseline) {
      case constants.BOTTOM:
        y += (maxHeight - totalHeight);
        break;
      case constants._CTX_MIDDLE:
        y += (maxHeight - totalHeight) / 2;
        break;
      case constants.BASELINE:
        baselineHacked = true;
        this.drawingContext.textBaseline = constants.TOP;
        break;
      }
    }

    for (ii = 0; ii < cars.length; ii++) {

      line = '';
      words = cars[ii].split(' ');
      for (n = 0; n < words.length; n++) {

        testLine = line + words[n] + ' ';
        testWidth = this.textWidth(testLine);
        if (testWidth > maxWidth) {
          this._renderText(p, line, x, y);
          line = words[n] + ' ';
          y += p.textLeading();
        } else {
          line = testLine;
        }
      }

      this._renderText(p, line, x, y);
      y += p.textLeading();
    }
  }
  else {
    for (jj = 0; jj < cars.length; jj++) {

      this._renderText(p, cars[jj], x, y);
      y += p.textLeading();
    }
  }

  if (baselineHacked) {
    this.drawingContext.textBaseline = constants.BASELINE;
  }
  return p;
};

p5.Renderer2D.prototype._renderText = function(p, line, x, y) {

  if (p._isOpenType()) {

    return p._textFont._renderPath(line, x, y);
  }

  // no stroke unless specified by user
  if (p._doStroke && p._strokeSet) {

    this.drawingContext.strokeText(line, x, y);
  }

  if (p._doFill) {

    // if fill hasn't been set by user, use default text fill
    this.drawingContext.fillStyle =  p._fillSet ?
      this.drawingContext.fillStyle : constants._DEFAULT_TEXT_FILL;

    this.drawingContext.fillText(line, x, y);
  }

  return p;
};

p5.Renderer2D.prototype.textWidth = function(s) {

  if (this._pInst._isOpenType()) {

    return this._pInst._textFont._textWidth(s);
  }

  return this.drawingContext.measureText(s).width;
};

p5.Renderer2D.prototype.textAlign = function(h, v) {

  if (arguments.length) {

    if (h === constants.LEFT ||
      h === constants.RIGHT ||
      h === constants.CENTER) {

      this.drawingContext.textAlign = h;
    }

    if (v === constants.TOP ||
      v === constants.BOTTOM ||
      v === constants.CENTER ||
      v === constants.BASELINE) {

      if (v === constants.CENTER) {
        this.drawingContext.textBaseline = constants._CTX_MIDDLE;
      } else {
        this.drawingContext.textBaseline = v;
      }
    }

    return this._pInst;

  } else {

    var valign = this.drawingContext.textBaseline;

    if (valign === constants._CTX_MIDDLE) {

      valign = constants.CENTER;
    }

    return {

      horizontal: this.drawingContext.textAlign,
      vertical: valign
    };
  }
};

p5.Renderer2D.prototype._applyTextProperties = function() {

  var font, p = this._pInst;

  p._setProperty('_textAscent', null);
  p._setProperty('_textDescent', null);

  font = p._textFont;

  if (p._isOpenType()) {

    font = p._textFont.font.familyName;
    p._setProperty('_textStyle', p._textFont.font.styleName);
  }

  this.drawingContext.font = p._textStyle + ' ' + p._textSize + 'px ' + font;

  return p;
};


//////////////////////////////////////////////
// STRUCTURE
//////////////////////////////////////////////

p5.Renderer2D.prototype.push = function() {
  this.drawingContext.save();
};

p5.Renderer2D.prototype.pop = function() {
  this.drawingContext.restore();
};

module.exports = p5.Renderer2D;

},{"../image/filters":33,"./canvas":14,"./constants":15,"./core":16,"./p5.Renderer":22}],24:[function(require,module,exports){
/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

var p5 = require('./core');
var constants = require('./constants');
require('./p5.Graphics');
require('./p5.Renderer2D');
require('../3d/p5.Renderer3D');

/**
 * Creates a canvas element in the document, and sets the dimensions of it
 * in pixels. This method should be called only once at the start of setup.
 * Calling createCanvas more than once in a sketch will result in very
 * unpredicable behavior. If you want more than one drawing canvas
 * you could use createGraphics (hidden by default but it can be shown).<br>
 * The system variables width and height are set by the parameters passed
 * to this function. If createCanvas() is not used, the window will be
 * given a default size of 100x100 pixels.
 *
 * @method createCanvas
 * @param  {Number} w width of the canvas
 * @param  {Number} h height of the canvas
 * @param  optional:{String} renderer 'p2d' | 'webgl'
 * @return {Object} canvas generated
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 50);
 *   background(153);
 *   line(0, 0, width, height);
 * }
 * </code>
 * </div>
 */

p5.prototype.createCanvas = function(w, h, renderer) {
  //optional: renderer, otherwise defaults to p2d
  var r = renderer || constants.P2D;
  var isDefault, c;

  //4th arg (isDefault) used when called onLoad,
  //otherwise hidden to the public api
  if(arguments[3]){
    isDefault =
    (typeof arguments[3] === 'boolean') ? arguments[3] : false;
  }

  if(r === constants.WEBGL){
    c = document.getElementById('defaultCanvas');
    if(c){ //if defaultCanvas already exists
      c.parentNode.removeChild(c); //replace the existing defaultCanvas
    }
    c = document.createElement('canvas');
    c.id = 'defaultCanvas';
  }
  else {
    if (isDefault) {
      c = document.createElement('canvas');
      c.id = 'defaultCanvas';
    } else { // resize the default canvas if new one is created
      c = this.canvas;
    }
  }

  // set to invisible if still in setup (to prevent flashing with manipulate)
  if (!this._setupDone) {
    c.className += ' p5_hidden'; // tag to show later
    c.style.visibility='hidden';
  }

  if (this._userNode) { // user input node case
    this._userNode.appendChild(c);
  } else {
    document.body.appendChild(c);
  }



  // Init our graphics renderer
  //webgl mode
  if (r === constants.WEBGL) {
    this._setProperty('_graphics', new p5.Renderer3D(c, this, true));
    this._isdefaultGraphics = true;
  }
  //P2D mode
  else {
    if (!this._isdefaultGraphics) {
      this._setProperty('_graphics', new p5.Renderer2D(c, this, true));
      this._isdefaultGraphics = true;
    }
  }
  this._graphics.resize(w, h);
  this._graphics._applyDefaults();
  return this._graphics;
};

/**
 * Resizes the canvas to given width and height. Note that the
 * canvas will be cleared so anything drawn previously in setup
 * or draw will disappear on resize. Setup will not be called
 * again.
 * @method resizeCanvas
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   createCanvas(windowWidth, windowHeight);
 * }
 *
 * function draw() {
 *  background(0, 100, 200);
 * }
 *
 * function windowResized() {
 *   resizeCanvas(windowWidth, windowHeight);
 * }
 * </code></div>
 */
p5.prototype.resizeCanvas = function (w, h, noRedraw) {
  if (this._graphics) {
    this._graphics.resize(w, h);
    this._graphics._applyDefaults();
    if (!noRedraw) {
      this.redraw();
    }
  }
};


/**
 * Removes the default canvas for a p5 sketch that doesn't
 * require a canvas
 * @method noCanvas
 * @example
 * <div>
 * <code>
 * function setup() {
 *   noCanvas();
 * }
 * </code>
 * </div>
 */
p5.prototype.noCanvas = function() {
  if (this.canvas) {
    this.canvas.parentNode.removeChild(this.canvas);
  }
};

/**
 * Creates and returns a new p5.Renderer object. Use this class if you need
 * to draw into an off-screen graphics buffer. The two parameters define the
 * width and height in pixels.
 *
 * @method createGraphics
 * @param  {Number} w width of the offscreen graphics buffer
 * @param  {Number} h height of the offscreen graphics buffer
 * @param {String} renderer either 'p2d' or 'webgl'.
 * undefined defaults to p2d
 * @return {Object} offscreen graphics buffer
 * @example
 * <div>
 * <code>
 * var pg;
 * function setup() {
 *   createCanvas(100, 100);
 *   pg = createGraphics(100, 100);
 * }
 * function draw() {
 *   background(200);
 *   pg.background(100);
 *   pg.noStroke();
 *   pg.ellipse(pg.width/2, pg.height/2, 50, 50);
 *   image(pg, 50, 50);
 *   image(pg, 0, 0, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.createGraphics = function(w, h, renderer){
  return new p5.Graphics(w, h, renderer, this);
};

/**
 * Blends the pixels in the display window according to the defined mode.
 * There is a choice of the following modes to blend the source pixels (A)
 * with the ones of pixels already in the display window (B):
 * <ul>
 * <li><code>BLEND</code> - linear interpolation of colours: C =
 * A*factor + B. This is the default blending mode.</li>
 * <li><code>ADD</code> - sum of A and B</li>
 * <li><code>DARKEST</code> - only the darkest colour succeeds: C =
 * min(A*factor, B).</li>
 * <li><code>LIGHTEST</code> - only the lightest colour succeeds: C =
 * max(A*factor, B).</li>
 * <li><code>DIFFERENCE</code> - subtract colors from underlying image.</li>
 * <li><code>EXCLUSION</code> - similar to <code>DIFFERENCE</code>, but less
 * extreme.</li>
 * <li><code>MULTIPLY</code> - multiply the colors, result will always be
 * darker.</li>
 * <li><code>SCREEN</code> - opposite multiply, uses inverse values of the
 * colors.</li>
 * <li><code>REPLACE</code> - the pixels entirely replace the others and
 * don't utilize alpha (transparency) values.</li>
 * <li><code>OVERLAY</code> - mix of <code>MULTIPLY</code> and <code>SCREEN
 * </code>. Multiplies dark values, and screens light values.</li>
 * <li><code>HARD_LIGHT</code> - <code>SCREEN</code> when greater than 50%
 * gray, <code>MULTIPLY</code> when lower.</li>
 * <li><code>SOFT_LIGHT</code> - mix of <code>DARKEST</code> and
 * <code>LIGHTEST</code>. Works like <code>OVERLAY</code>, but not as harsh.
 * </li>
 * <li><code>DODGE</code> - lightens light tones and increases contrast,
 * ignores darks.</li>
 * <li><code>BURN</code> - darker areas are applied, increasing contrast,
 * ignores lights.</li>
 * </ul>
 *
 * @method blendMode
 * @param  {String/Constant} mode blend mode to set for canvas
 * @example
 * <div>
 * <code>
 * blendMode(LIGHTEST);
 * strokeWeight(30);
 * stroke(80, 150, 255);
 * line(25, 25, 75, 75);
 * stroke(255, 50, 50);
 * line(75, 25, 25, 75);
 * </code>
 * </div>
 * <div>
 * <code>
 * blendMode(MULTIPLY);
 * strokeWeight(30);
 * stroke(80, 150, 255);
 * line(25, 25, 75, 75);
 * stroke(255, 50, 50);
 * line(75, 25, 25, 75);
 * </code>
 * </div>
 */
p5.prototype.blendMode = function(mode) {
  if (mode === constants.BLEND || mode === constants.DARKEST ||
    mode === constants.LIGHTEST || mode === constants.DIFFERENCE ||
    mode === constants.MULTIPLY || mode === constants.EXCLUSION ||
    mode === constants.SCREEN || mode === constants.REPLACE ||
    mode === constants.OVERLAY || mode === constants.HARD_LIGHT ||
    mode === constants.SOFT_LIGHT || mode === constants.DODGE ||
    mode === constants.BURN || mode === constants.ADD ||
    mode === constants.NORMAL) {
    this._graphics.blendMode(mode);
  } else {
    throw new Error('Mode '+mode+' not recognized.');
  }
};

module.exports = p5;

},{"../3d/p5.Renderer3D":5,"./constants":15,"./core":16,"./p5.Graphics":21,"./p5.Renderer2D":23}],25:[function(require,module,exports){

// requestAnim shim layer by Paul Irish
window.requestAnimationFrame = (function(){
  return window.requestAnimationFrame      ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element){
          // should '60' here be framerate?
          window.setTimeout(callback, 1000 / 60);
        };
})();

// use window.performance() to get max fast and accurate time in milliseconds
window.performance = window.performance || {};
window.performance.now = (function(){
  var load_date = Date.now();
  return window.performance.now        ||
        window.performance.mozNow      ||
        window.performance.msNow       ||
        window.performance.oNow        ||
        window.performance.webkitNow   ||
        function () {
          return Date.now() - load_date;
        };
})();

/*
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/
// requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame =
      window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] ||
      window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function()
        { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());
*/

/**
 * shim for Uint8ClampedArray.slice
 * (allows arrayCopy to work with pixels[])
 * with thanks to http://halfpapstudios.com/blog/tag/html5-canvas/
 */
(function () {
  'use strict';

  if (typeof Uint8ClampedArray !== 'undefined') {
    //Firefox and Chrome
    Uint8ClampedArray.prototype.slice = Array.prototype.slice;
  }
}());


},{}],26:[function(require,module,exports){
/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');

p5.prototype.exit = function() {
  throw 'exit() not implemented, see remove()';
};
/**
 * <p>Stops p5.js from continuously executing the code within draw().
 * If loop() is called, the code in draw() begins to run continuously again.
 * If using noLoop() in setup(), it should be the last line inside the block.
 * </p>
 *
 * <p>When noLoop() is used, it's not possible to manipulate or access the
 * screen inside event handling functions such as mousePressed() or
 * keyPressed(). Instead, use those functions to call redraw() or loop(),
 * which will run draw(), which can update the screen properly. This means
 * that when noLoop() has been called, no drawing can happen, and functions
 * like saveFrame() or loadPixels() may not be used.</p>
 *
 * <p>Note that if the sketch is resized, redraw() will be called to update
 * the sketch, even after noLoop() has been specified. Otherwise, the sketch
 * would enter an odd state until loop() was called.</p>
 *
 * @method noLoop
 * @example
 * <div><code>
 * function setup() {
 *   createCanvas(100, 100);
 *   background(200);
 *   noLoop();
 * }

 * function draw() {
 *   line(10, 10, 90, 90);
 * }
 * </code></div>
 *
 * <div><code>
 * var x = 0;
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(204);
 *   x = x + 0.1;
 *   if (x > width) {
 *     x = 0;
 *   }
 *   line(x, 0, x, height);
 * }
 *
 * function mousePressed() {
 *   noLoop();
 * }
 *
 * function mouseReleased() {
 *   loop();
 * }
 * </code></div>
 */
p5.prototype.noLoop = function() {
  this._loop = false;
};
/**
 * By default, p5.js loops through draw() continuously, executing the code
 * within it. However, the draw() loop may be stopped by calling noLoop().
 * In that case, the draw() loop can be resumed with loop().
 *
 * @method loop
 * @example
 * <div><code>
 * var x = 0;
 * function setup() {
 *   createCanvas(100, 100);
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(204);
 *   x = x + 0.1;
 *   if (x > width) {
 *     x = 0;
 *   }
 *   line(x, 0, x, height);
 * }
 *
 * function mousePressed() {
 *   loop();
 * }
 *
 * function mouseReleased() {
 *   noLoop();
 * }
 * </code></div>
 */

p5.prototype.loop = function() {
  this._loop = true;
  this._draw();
};

/**
 * The push() function saves the current drawing style settings and
 * transformations, while pop() restores these settings. Note that these
 * functions are always used together. They allow you to change the style
 * and transformation settings and later return to what you had. When a new
 * state is started with push(), it builds on the current style and transform
 * information. The push() and pop() functions can be embedded to provide
 * more control. (See the second example for a demonstration.)
 * <br><br>
 * push() stores information related to the current transformation state
 * and style settings controlled by the following functions: fill(),
 * stroke(), tint(), strokeWeight(), strokeCap(), strokeJoin(),
 * imageMode(), rectMode(), ellipseMode(), colorMode(), textAlign(),
 * textFont(), textMode(), textSize(), textLeading().
 *
 * @method push
 * @example
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33);  // Left circle
 *
 * push();  // Start a new drawing state
 * strokeWeight(10);
 * fill(204, 153, 0);
 * translate(50, 0);
 * ellipse(0, 50, 33, 33);  // Middle circle
 * pop();  // Restore original state
 *
 * ellipse(100, 50, 33, 33);  // Right circle
 * </code>
 * </div>
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33);  // Left circle
 *
 * push();  // Start a new drawing state
 * strokeWeight(10);
 * fill(204, 153, 0);
 * ellipse(33, 50, 33, 33);  // Left-middle circle
 *
 * push();  // Start another new drawing state
 * stroke(0, 102, 153);
 * ellipse(66, 50, 33, 33);  // Right-middle circle
 * pop();  // Restore previous state
 *
 * pop();  // Restore original state
 *
 * ellipse(100, 50, 33, 33);  // Right circle
 * </code>
 * </div>
 */
p5.prototype.push = function () {
  this._graphics.push();
  this._styles.push({
    doStroke: this._doStroke,
    doFill: this._doFill,
    tint: this._tint,
    imageMode: this._imageMode,
    rectMode: this._rectMode,
    ellipseMode: this._ellipseMode,
    colorMode: this._colorMode,
    textFont: this.textFont,
    textLeading: this.textLeading,
    textSize: this.textSize,
    textStyle: this.textStyle
  });
};

/**
 * The push() function saves the current drawing style settings and
 * transformations, while pop() restores these settings. Note that these
 * functions are always used together. They allow you to change the style
 * and transformation settings and later return to what you had. When a new
 * state is started with push(), it builds on the current style and transform
 * information. The push() and pop() functions can be embedded to provide
 * more control. (See the second example for a demonstration.)
 * <br><br>
 * push() stores information related to the current transformation state
 * and style settings controlled by the following functions: fill(),
 * stroke(), tint(), strokeWeight(), strokeCap(), strokeJoin(),
 * imageMode(), rectMode(), ellipseMode(), colorMode(), textAlign(),
 * textFont(), textMode(), textSize(), textLeading().
 *
 * @method pop
 * @example
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33);  // Left circle
 *
 * push();  // Start a new drawing state
 * translate(50, 0);
 * strokeWeight(10);
 * fill(204, 153, 0);
 * ellipse(0, 50, 33, 33);  // Middle circle
 * pop();  // Restore original state
 *
 * ellipse(100, 50, 33, 33);  // Right circle
 * </code>
 * </div>
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33);  // Left circle
 *
 * push();  // Start a new drawing state
 * strokeWeight(10);
 * fill(204, 153, 0);
 * ellipse(33, 50, 33, 33);  // Left-middle circle
 *
 * push();  // Start another new drawing state
 * stroke(0, 102, 153);
 * ellipse(66, 50, 33, 33);  // Right-middle circle
 * pop();  // Restore previous state
 *
 * pop();  // Restore original state
 *
 * ellipse(100, 50, 33, 33);  // Right circle
 * </code>
 * </div>
 */
p5.prototype.pop = function () {
  this._graphics.pop();
  var lastS = this._styles.pop();
  this._doStroke = lastS.doStroke;
  this._doFill = lastS.doFill;
  this._tint = lastS.tint;
  this._imageMode = lastS.imageMode;
  this._rectMode = lastS.rectMode;
  this._ellipseMode = lastS.ellipseMode;
  this._colorMode = lastS.colorMode;
  this.textFont = lastS.textFont;
  this.textLeading = lastS.textLeading;
  this.textSize = lastS.textSize;
  this.textStyle = lastS.textStyle;
};

p5.prototype.pushStyle = function() {
  throw new Error('pushStyle() not used, see push()');
};

p5.prototype.popStyle = function() {
  throw new Error('popStyle() not used, see pop()');
};

/**
 *
 * Executes the code within draw() one time. This functions allows the
 * program to update the display window only when necessary, for example
 * when an event registered by mousePressed() or keyPressed() occurs.
 *
 * In structuring a program, it only makes sense to call redraw() within
 * events such as mousePressed(). This is because redraw() does not run
 * draw() immediately (it only sets a flag that indicates an update is
 * needed).
 *
 * The redraw() function does not work properly when called inside draw().
 * To enable/disable animations, use loop() and noLoop().
 *
 * @method redraw
 * @example
 *   <div><code>
 *     var x = 0;
 *
 *     function setup() {
 *       createCanvas(100, 100);
 *       noLoop();
 *     }
 *
 *     function draw() {
 *       background(204);
 *       line(x, 0, x, height);
 *     }
 *
 *     function mousePressed() {
 *       x += 1;
 *       redraw();
 *     }
 *   </code></div>
 */
p5.prototype.redraw = function () {
  var userSetup = this.setup || window.setup;
  var userDraw = this.draw || window.draw;
  if (typeof userDraw === 'function') {
    this.push();
    if (typeof userSetup === 'undefined') {
      this.scale(this.pixelDensity, this.pixelDensity);
    }
    this._registeredMethods.pre.forEach(function (f) {
      f.call(this);
    });
    userDraw();
    this._registeredMethods.post.forEach(function (f) {
      f.call(this);
    });
    this.pop();
  }
};

p5.prototype.size = function() {
  throw 'size() not implemented, see createCanvas()';
};


module.exports = p5;

},{"./core":16}],27:[function(require,module,exports){
/**
 * @module Transform
 * @submodule Transform
 * @for p5
 * @requires core
 * @requires constants
 */


'use strict';

var p5 = require('./core');
var constants = require('./constants');

/**
 * Multiplies the current matrix by the one specified through the parameters.
 * This is very slow because it will try to calculate the inverse of the
 * transform, so avoid it whenever possible.
 *
 * @method applyMatrix
 * @param  {Number} n00 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n01 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n02 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n10 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n11 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n12 numbers which define the 3x2 matrix to be multiplied
 * @return {p5}         the p5 object
 * @example
 * <div>
 * <code>
 * // Example in the works.
 * </code>
 * </div>
 */
p5.prototype.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
  this._graphics.applyMatrix(n00, n01, n02, n10, n11, n12);
  return this;
};

p5.prototype.popMatrix = function() {
  throw new Error('popMatrix() not used, see pop()');
};

p5.prototype.printMatrix = function() {
  throw new Error('printMatrix() not implemented');
};

p5.prototype.pushMatrix = function() {
  throw new Error('pushMatrix() not used, see push()');
};

/**
 * Replaces the current matrix with the identity matrix.
 *
 * @method resetMatrix
 * @return {p5} the p5 object
 * @example
 * <div>
 * <code>
 * // Example in the works.
 * </code>
 * </div>
 */
p5.prototype.resetMatrix = function() {
  this._graphics.resetMatrix();
  return this;
};

/**
 * Rotates a shape the amount specified by the angle parameter. This
 * function accounts for angleMode, so angles can be entered in either
 * RADIANS or DEGREES.
 *
 * Objects are always rotated around their relative position to the
 * origin and positive numbers rotate objects in a clockwise direction.
 * Transformations apply to everything that happens after and subsequent
 * calls to the function accumulates the effect. For example, calling
 * rotate(HALF_PI) and then rotate(HALF_PI) is the same as rotate(PI).
 * All tranformations are reset when draw() begins again.
 *
 * Technically, rotate() multiplies the current transformation matrix
 * by a rotation matrix. This function can be further controlled by
 * the push() and pop().
 *
 * @method rotate
 * @param  {Number} angle the angle of rotation, specified in radians
 *                        or degrees, depending on current angleMode
 * @return {p5}           the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/2, height/2);
 * rotate(PI/3.0);
 * rect(-26, -26, 52, 52);
 * </code>
 * </div>
 */
p5.prototype.rotate = function(r) {
  if (this._angleMode === constants.DEGREES) {
    r = this.radians(r);
  }
  this._graphics.rotate(r);
  return this;
};

/**
 * [rotateX description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.prototype.rotateX = function(rad) {
  if (this._graphics.isP3D) {
    this._graphics.rotateX(rad);
  } else {
    throw 'not yet implemented.';
  }
  return this;
};

/**
 * [rotateY description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.prototype.rotateY = function(rad) {
  if (this._graphics.isP3D) {
    this._graphics.rotateY(rad);
  } else {
    throw 'not yet implemented.';
  }
  return this;
};

/**
 * [rotateZ description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.prototype.rotateZ = function(rad) {
  if (this._graphics.isP3D) {
    this._graphics.rotateZ(rad);
  } else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

/**
 * Increases or decreases the size of a shape by expanding and contracting
 * vertices. Objects always scale from their relative origin to the
 * coordinate system. Scale values are specified as decimal percentages.
 * For example, the function call scale(2.0) increases the dimension of a
 * shape by 200%.
 *
 * Transformations apply to everything that happens after and subsequent
 * calls to the function multiply the effect. For example, calling scale(2.0)
 * and then scale(1.5) is the same as scale(3.0). If scale() is called
 * within draw(), the transformation is reset when the loop begins again.
 *
 * Using this fuction with the z parameter requires using P3D as a
 * parameter for size(), as shown in the third example above. This function
 * can be further controlled with push() and pop().
 *
 * @method scale
 * @param  {Number} s   percentage to scale the object, or percentage to
 *                      scale the object in the x-axis if multiple arguments
 *                      are given
 * @param  {Number} [y] percentage to scale the object in the y-axis
 * @return {p5}         the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/2, height/2);
 * rotate(PI/3.0);
 * rect(-26, -26, 52, 52);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rect(30, 20, 50, 50);
 * scale(0.5, 1.3);
 * rect(30, 20, 50, 50);
 * </code>
 * </div>
 */
p5.prototype.scale = function() {
  if (this._graphics.isP3D) {
    this._graphics.scale(arguments[0], arguments[1], arguments[2]);
  } else {
    this._graphics.scale.apply(this._graphics, arguments);
  }
  return this;
};

/**
 * Shears a shape around the x-axis the amount specified by the angle
 * parameter. Angles should be specified in the current angleMode.
 * Objects are always sheared around their relative position to the origin
 * and positive numbers shear objects in a clockwise direction.
 *
 * Transformations apply to everything that happens after and subsequent
 * calls to the function accumulates the effect. For example, calling
 * shearX(PI/2) and then shearX(PI/2) is the same as shearX(PI).
 * If shearX() is called within the draw(), the transformation is reset when
 * the loop begins again.
 *
 * Technically, shearX() multiplies the current transformation matrix by a
 * rotation matrix. This function can be further controlled by the
 * push() and pop() functions.
 *
 * @method shearX
 * @param  {Number} angle angle of shear specified in radians or degrees,
 *                        depending on current angleMode
 * @return {p5}           the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/4, height/4);
 * shearX(PI/4.0);
 * rect(0, 0, 30, 30);
 * </code>
 * </div>
 */
p5.prototype.shearX = function(angle) {
  if (this._angleMode === constants.DEGREES) {
    angle = this.radians(angle);
  }
  this._graphics.shearX(angle);
  return this;
};

/**
 * Shears a shape around the y-axis the amount specified by the angle
 * parameter. Angles should be specified in the current angleMode. Objects
 * are always sheared around their relative position to the origin and
 * positive numbers shear objects in a clockwise direction.
 *
 * Transformations apply to everything that happens after and subsequent
 * calls to the function accumulates the effect. For example, calling
 * shearY(PI/2) and then shearY(PI/2) is the same as shearY(PI). If
 * shearY() is called within the draw(), the transformation is reset when
 * the loop begins again.
 *
 * Technically, shearY() multiplies the current transformation matrix by a
 * rotation matrix. This function can be further controlled by the
 * push() and pop() functions.
 *
 * @method shearY
 * @param  {Number} angle angle of shear specified in radians or degrees,
 *                        depending on current angleMode
 * @return {p5}           the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/4, height/4);
 * shearY(PI/4.0);
 * rect(0, 0, 30, 30);
 * </code>
 * </div>
 */
p5.prototype.shearY = function(angle) {
  if (this._angleMode === constants.DEGREES) {
    angle = this.radians(angle);
  }
  this._graphics.shearY(angle);
  return this;
};

/**
 * Specifies an amount to displace objects within the display window.
 * The x parameter specifies left/right translation, the y parameter
 * specifies up/down translation.
 *
 * Transformations are cumulative and apply to everything that happens after
 * and subsequent calls to the function accumulates the effect. For example,
 * calling translate(50, 0) and then translate(20, 0) is the same as
 * translate(70, 0). If translate() is called within draw(), the
 * transformation is reset when the loop begins again. This function can be
 * further controlled by using push() and pop().
 *
 * @method translate
 * @param  {Number} x left/right translation
 * @param  {Number} y up/down translation
 * @return {p5}       the p5 object
 * @example
 * <div>
 * <code>
 * translate(30, 20);
 * rect(0, 0, 55, 55);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rect(0, 0, 55, 55);  // Draw rect at original 0,0
 * translate(30, 20);
 * rect(0, 0, 55, 55);  // Draw rect at new 0,0
 * translate(14, 14);
 * rect(0, 0, 55, 55);  // Draw rect at new 0,0
 * </code>
 * </div>
 */
p5.prototype.translate = function(x, y, z) {
  if (this._graphics.isP3D) {
    this._graphics.translate(x, y, z);
  } else {
    this._graphics.translate(x, y);
  }
  return this;
};

module.exports = p5;

},{"./constants":15,"./core":16}],28:[function(require,module,exports){
/**
 * @module Shape
 * @submodule Vertex
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('./core');
var constants = require('./constants');
var shapeKind = null;
var vertices = [];
var contourVertices = [];
var isBezier = false;
var isCurve = false;
var isQuadratic = false;
var isContour = false;

/**
 * Use the beginContour() and endContour() functions to create negative
 * shapes within shapes such as the center of the letter 'O'. beginContour()
 * begins recording vertices for the shape and endContour() stops recording.
 * The vertices that define a negative shape must "wind" in the opposite
 * direction from the exterior shape. First draw vertices for the exterior
 * clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 * <br><br>
 * These functions can only be used within a beginShape()/endShape() pair and
 * transformations such as translate(), rotate(), and scale() do not work
 * within a beginContour()/endContour() pair. It is also not possible to use
 * other shapes, such as ellipse() or rect() within.
 *
 * @method beginContour
 * @return {Object} the p5 object
 * @example
 * <div>
 * <code>
 * translate(50, 50);
 * stroke(255, 0, 0);
 * beginShape();
 * // Exterior part of shape, clockwise winding
 * vertex(-40, -40);
 * vertex(40, -40);
 * vertex(40, 40);
 * vertex(-40, 40);
 * // Interior part of shape, counter-clockwise winding
 * beginContour();
 * vertex(-20, -20);
 * vertex(-20, 20);
 * vertex(20, 20);
 * vertex(20, -20);
 * endContour();
 * endShape(CLOSE);
 * </code>
 * </div>
 */
p5.prototype.beginContour = function() {
  contourVertices = [];
  isContour = true;
  return this;
};

/**
 * Using the beginShape() and endShape() functions allow creating more
 * complex forms. beginShape() begins recording vertices for a shape and
 * endShape() stops recording. The value of the kind parameter tells it which
 * types of shapes to create from the provided vertices. With no mode
 * specified, the shape can be any irregular polygon. The parameters
 * available for beginShape() are POINTS, LINES, TRIANGLES, TRIANGLE_FAN,
 * TRIANGLE_STRIP, QUADS, and QUAD_STRIP. After calling the beginShape()
 * function, a series of vertex() commands must follow. To stop drawing the
 * shape, call endShape(). Each shape will be outlined with the current
 * stroke color and filled with the fill color.
 *
 * Transformations such as translate(), rotate(), and scale() do not work
 * within beginShape(). It is also not possible to use other shapes, such as
 * ellipse() or rect() within beginShape().
 *
 * @method beginShape
 * @param  {Number/Constant} kind either POINTS, LINES, TRIANGLES,
 *                                TRIANGLE_FAN, TRIANGLE_STRIP, QUADS,
 *                                or QUAD_STRIP
 * @return {Object}               the p5 object
 * @example
 * <div>
 * <code>
 * beginShape();
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // currently not working
 * beginShape(POINTS);
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(LINES);
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TRIANGLES);
 * vertex(30, 75);
 * vertex(40, 20);
 * vertex(50, 75);
 * vertex(60, 20);
 * vertex(70, 75);
 * vertex(80, 20);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TRIANGLE_STRIP);
 * vertex(30, 75);
 * vertex(40, 20);
 * vertex(50, 75);
 * vertex(60, 20);
 * vertex(70, 75);
 * vertex(80, 20);
 * vertex(90, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TRIANGLE_FAN);
 * vertex(57.5, 50);
 * vertex(57.5, 15);
 * vertex(92, 50);
 * vertex(57.5, 85);
 * vertex(22, 50);
 * vertex(57.5, 15);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(QUADS);
 * vertex(30, 20);
 * vertex(30, 75);
 * vertex(50, 75);
 * vertex(50, 20);
 * vertex(65, 20);
 * vertex(65, 75);
 * vertex(85, 75);
 * vertex(85, 20);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(QUAD_STRIP);
 * vertex(30, 20);
 * vertex(30, 75);
 * vertex(50, 20);
 * vertex(50, 75);
 * vertex(65, 20);
 * vertex(65, 75);
 * vertex(85, 20);
 * vertex(85, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape();
 * vertex(20, 20);
 * vertex(40, 20);
 * vertex(40, 40);
 * vertex(60, 40);
 * vertex(60, 60);
 * vertex(20, 60);
 * endShape(CLOSE);
 * </code>
 * </div>
 */
p5.prototype.beginShape = function(kind) {
  if (kind === constants.POINTS ||
    kind === constants.LINES ||
    kind === constants.TRIANGLES ||
    kind === constants.TRIANGLE_FAN ||
    kind === constants.TRIANGLE_STRIP ||
    kind === constants.QUADS ||
    kind === constants.QUAD_STRIP) {
    shapeKind = kind;
  } else {
    shapeKind = null;
  }
  vertices = [];
  contourVertices = [];
  return this;
};

/**
 * Specifies vertex coordinates for Bezier curves. Each call to
 * bezierVertex() defines the position of two control points and
 * one anchor point of a Bezier curve, adding a new segment to a
 * line or shape. The first time bezierVertex() is used within a
 * beginShape() call, it must be prefaced with a call to vertex()
 * to set the first anchor point. This function must be used between
 * beginShape() and endShape() and only when there is no MODE
 * parameter specified to beginShape().
 *
 * @method bezierVertex
 * @param  {Number} x2 x-coordinate for the first control point
 * @param  {Number} y2 y-coordinate for the first control point
 * @param  {Number} x3 x-coordinate for the second control point
 * @param  {Number} y3 y-coordinate for the second control point
 * @param  {Number} x4 x-coordinate for the anchor point
 * @param  {Number} y4 y-coordinate for the anchor point
 * @return {Object}    the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * vertex(30, 20);
 * bezierVertex(80, 0, 80, 75, 30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape();
 * vertex(30, 20);
 * bezierVertex(80, 0, 80, 75, 30, 75);
 * bezierVertex(50, 80, 60, 25, 30, 20);
 * endShape();
 * </code>
 * </div>
 */
p5.prototype.bezierVertex = function(x2, y2, x3, y3, x4, y4) {
  if (vertices.length === 0) {
    throw 'vertex() must be used once before calling bezierVertex()';
  } else {
    isBezier = true;
    var vert = [];
    for (var i = 0; i < arguments.length; i++) {
      vert[i] = arguments[i];
    }
    vert.isVert = false;
    if (isContour) {
      contourVertices.push(vert);
    } else {
      vertices.push(vert);
    }
  }
  return this;
};

/**
 * Specifies vertex coordinates for curves. This function may only
 * be used between beginShape() and endShape() and only when there
 * is no MODE parameter specified to beginShape(). The first and
 * last points in a series of curveVertex() lines will be used to
 * guide the beginning and end of a the curve. A minimum of four
 * points is required to draw a tiny curve between the second and
 * third points. Adding a fifth point with curveVertex() will draw
 * the curve between the second, third, and fourth points. The
 * curveVertex() function is an implementation of Catmull-Rom
 * splines.
 *
 * @method curveVertex
 * @param {Number} x x-coordinate of the vertex
 * @param {Number} y y-coordinate of the vertex
 * @return {Object} the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * curveVertex(84,  91);
 * curveVertex(84,  91);
 * curveVertex(68,  19);
 * curveVertex(21,  17);
 * curveVertex(32, 100);
 * curveVertex(32, 100);
 * endShape();
 * </code>
 * </div>
 */
p5.prototype.curveVertex = function(x,y) {
  isCurve = true;
  this.vertex(x, y);
  return this;
};

/**
 * Use the beginContour() and endContour() functions to create negative
 * shapes within shapes such as the center of the letter 'O'. beginContour()
 * begins recording vertices for the shape and endContour() stops recording.
 * The vertices that define a negative shape must "wind" in the opposite
 * direction from the exterior shape. First draw vertices for the exterior
 * clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 * <br><br>
 * These functions can only be used within a beginShape()/endShape() pair and
 * transformations such as translate(), rotate(), and scale() do not work
 * within a beginContour()/endContour() pair. It is also not possible to use
 * other shapes, such as ellipse() or rect() within.
 *
 * @method endContour
 * @return {Object} the p5 object
 * @example
 * <div>
 * <code>
 * translate(50, 50);
 * stroke(255, 0, 0);
 * beginShape();
 * // Exterior part of shape, clockwise winding
 * vertex(-40, -40);
 * vertex(40, -40);
 * vertex(40, 40);
 * vertex(-40, 40);
 * // Interior part of shape, counter-clockwise winding
 * beginContour();
 * vertex(-20, -20);
 * vertex(-20, 20);
 * vertex(20, 20);
 * vertex(20, -20);
 * endContour();
 * endShape(CLOSE);
 * </code>
 * </div>
 */
p5.prototype.endContour = function() {
  var vert = contourVertices[0].slice(); // copy all data
  vert.isVert = contourVertices[0].isVert;
  vert.moveTo = false;
  contourVertices.push(vert);

  vertices.push(vertices[0]);
  for (var i = 0; i < contourVertices.length; i++) {
    vertices.push(contourVertices[i]);
  }
  return this;
};

/**
 * The endShape() function is the companion to beginShape() and may only be
 * called after beginShape(). When endshape() is called, all of image data
 * defined since the previous call to beginShape() is written into the image
 * buffer. The constant CLOSE as the value for the MODE parameter to close
 * the shape (to connect the beginning and the end).
 *
 * @method endShape
 * @param  {Number/Constant} mode use CLOSE to close the shape
 * @return {Object}               the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 *
 * beginShape();
 * vertex(20, 20);
 * vertex(45, 20);
 * vertex(45, 80);
 * endShape(CLOSE);
 *
 * beginShape();
 * vertex(50, 20);
 * vertex(75, 20);
 * vertex(75, 80);
 * endShape();
 * </code>
 * </div>
 */
p5.prototype.endShape = function(mode) {
  if (vertices.length === 0) { return this; }
  if (!this._doStroke && !this._doFill) { return this; }

  var closeShape = mode === constants.CLOSE;

  // if the shape is closed, the first element is also the last element
  if (closeShape && !isContour) {
    vertices.push(vertices[0]);
  }

  this._graphics.endShape(mode, vertices, isCurve, isBezier,
    isQuadratic, isContour, shapeKind);

  // Reset some settings
  isCurve = false;
  isBezier = false;
  isQuadratic = false;
  isContour = false;

  // If the shape is closed, the first element was added as last element.
  // We must remove it again to prevent the list of vertices from growing
  // over successive calls to endShape(CLOSE)
  if (closeShape) {
    vertices.pop();
  }
  return this;
};

/**
 * Specifies vertex coordinates for quadratic Bezier curves. Each call to
 * quadraticVertex() defines the position of one control points and one
 * anchor point of a Bezier curve, adding a new segment to a line or shape.
 * The first time quadraticVertex() is used within a beginShape() call, it
 * must be prefaced with a call to vertex() to set the first anchor point.
 * This function must be used between beginShape() and endShape() and only
 * when there is no MODE parameter specified to beginShape().
 *
 * @method quadraticVertex
 * @param  {Number} cx x-coordinate for the control point
 * @param  {Number} cy y-coordinate for the control point
 * @param  {Number} x3 x-coordinate for the anchor point
 * @param  {Number} y3 y-coordinate for the anchor point
 * @return {Object}    the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * strokeWeight(4);
 * beginShape();
 * vertex(20, 20);
 * quadraticVertex(80, 20, 50, 50);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * strokeWeight(4);
 * beginShape();
 * vertex(20, 20);
 * quadraticVertex(80, 20, 50, 50);
 * quadraticVertex(20, 80, 80, 80);
 * vertex(80, 60);
 * endShape();
 * </code>
 * </div>
 */
p5.prototype.quadraticVertex = function(cx, cy, x3, y3) {
  //if we're drawing a contour, put the points into an
  // array for inside drawing
  if(this._contourInited) {
    var pt = {};
    pt.x = cx;
    pt.y = cy;
    pt.x3 = x3;
    pt.y3 = y3;
    pt.type = constants.QUADRATIC;
    this._contourVertices.push(pt);

    return this;
  }
  if (vertices.length > 0) {
    isQuadratic = true;
    var vert = [];
    for (var i = 0; i < arguments.length; i++) {
      vert[i] = arguments[i];
    }
    vert.isVert = false;
    if (isContour) {
      contourVertices.push(vert);
    } else {
      vertices.push(vert);
    }
  } else {
    throw 'vertex() must be used once before calling quadraticVertex()';
  }
  return this;
};

/**
 * All shapes are constructed by connecting a series of vertices. vertex()
 * is used to specify the vertex coordinates for points, lines, triangles,
 * quads, and polygons. It is used exclusively within the beginShape() and
 * endShape() functions.
 *
 * @method vertex
 * @param  {Number} x x-coordinate of the vertex
 * @param  {Number} y y-coordinate of the vertex
 * @return {Object}   the p5 object
 * @example
 * <div>
 * <code>
 * beginShape(POINTS);
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 */
p5.prototype.vertex = function(x, y, moveTo) {
  var vert = [];
  vert.isVert = true;
  vert[0] = x;
  vert[1] = y;
  vert[2] = 0;
  vert[3] = 0;
  vert[4] = 0;
  vert[5] = this._graphics._getFill();
  vert[6] = this._graphics._getStroke();

  if (moveTo) {
    vert.moveTo = moveTo;
  }
  if (isContour) {
    if (contourVertices.length === 0) {
      vert.moveTo = true;
    }
    contourVertices.push(vert);
  } else {
    vertices.push(vert);
  }
  return this;
};

module.exports = p5;

},{"./constants":15,"./core":16}],29:[function(require,module,exports){
/**
 * @module Events
 * @submodule Acceleration
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * The system variable deviceOrientation always contains the orientation of
 * the device. The value of this variable will either be set 'landscape'
 * or 'portrait'. If no data is available it will be set to 'undefined'.
 *
 * @property deviceOrientation
 */
p5.prototype.deviceOrientation = undefined;

/**
 * The system variable accelerationX always contains the acceleration of the
 * device along the x axis. Value is represented as meters per second squared.
 *
 * @property accelerationX
 */
p5.prototype.accelerationX = 0;

/**
 * The system variable accelerationY always contains the acceleration of the
 * device along the y axis. Value is represented as meters per second squared.
 *
 * @property accelerationY
 */
p5.prototype.accelerationY = 0;

/**
 * The system variable accelerationZ always contains the acceleration of the
 * device along the z axis. Value is represented as meters per second squared.
 *
 * @property accelerationZ
 */
p5.prototype.accelerationZ = 0;

/**
 * The system variable pAccelerationX always contains the acceleration of the
 * device along the x axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property pAccelerationX
 */
p5.prototype.pAccelerationX = 0;

/**
 * The system variable pAccelerationY always contains the acceleration of the
 * device along the y axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property pAccelerationY
 */
p5.prototype.pAccelerationY = 0;

/**
 * The system variable pAccelerationZ always contains the acceleration of the
 * device along the z axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property pAccelerationZ
 */
p5.prototype.pAccelerationZ = 0;

/**
 * _updatePAccelerations updates the pAcceleration values
 *
 * @private
 */
p5.prototype._updatePAccelerations = function(){
  this._setProperty('pAccelerationX', this.accelerationX);
  this._setProperty('pAccelerationY', this.accelerationY);
  this._setProperty('pAccelerationZ', this.accelerationZ);
};

var move_threshold = 0.5;

/**
 * The setMoveThreshold() function is used to set the movement threshold for
 * the deviceMoved() function.
 *
 * @method setMoveThreshold
 * @param {number} value The threshold value
 */
p5.prototype.setMoveThreshold = function(val){
  if(typeof val === 'number'){
    move_threshold = val;
  }
};

var old_max_axis = '';
var new_max_axis = '';

/**
 * The deviceMoved() function is called when the devices orientation changes
 * by more than the threshold value.
 * @method deviceMoved
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Move the device around
 * // to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * The deviceTurned() function is called when the device rotates by
 * more than 90 degrees.
 * @method deviceTurned
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees
 * // to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceTurned() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype._ondeviceorientation = function (e) {
  this._setProperty('accelerationX', e.beta);
  this._setProperty('accelerationY', e.gamma);
  this._setProperty('accelerationZ', e.alpha);
  this._handleMotion();
};
p5.prototype._ondevicemotion = function (e) {
  this._setProperty('accelerationX', e.acceleration.x * 2);
  this._setProperty('accelerationY', e.acceleration.y * 2);
  this._setProperty('accelerationZ', e.acceleration.z * 2);
  this._handleMotion();
};
p5.prototype._onMozOrientation = function (e) {
  this._setProperty('accelerationX', e.x);
  this._setProperty('accelerationY', e.y);
  this._setProperty('accelerationZ', e.z);
  this._handleMotion();
};
p5.prototype._handleMotion = function() {
  if (window.orientation === 90 || window.orientation === -90) {
    this._setProperty('deviceOrientation', 'landscape');
  } else if (window.orientation === 0) {
    this._setProperty('deviceOrientation', 'portrait');
  } else if (window.orientation === undefined) {
    this._setProperty('deviceOrientation', 'undefined');
  }
  var deviceMoved = this.deviceMoved || window.deviceMoved;
  if (typeof deviceMoved === 'function') {
    if (Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold ||
      Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold ||
      Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold) {
      deviceMoved();
    }
  }
  var deviceTurned = this.deviceTurned || window.deviceTurned;
  if (typeof deviceTurned === 'function') {
    var max_val = 0;
    if (Math.abs(this.accelerationX) > max_val) {
      max_val = this.accelerationX;
      new_max_axis = 'x';
    }
    if (Math.abs(this.accelerationY) > max_val) {
      max_val = this.accelerationY;
      new_max_axis = 'y';
    }
    if (Math.abs(this.accelerationZ) > max_val) {
      new_max_axis = 'z';
    }
    if (old_max_axis !== '' && old_max_axis !== new_max_axis) {
      deviceTurned(new_max_axis);

    }
    old_max_axis = new_max_axis;
  }
};


module.exports = p5;

},{"../core/core":16}],30:[function(require,module,exports){
/**
 * @module Events
 * @submodule Keyboard
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Holds the key codes of currently pressed keys.
 * @private
 */
var downKeys = {};

/**
 * The boolean system variable keyIsPressed is true if any key is pressed
 * and false if no keys are pressed.
 *
 * @property keyIsPressed
 * @example
 * <div>
 * <code>
 * var value = 0;
 * function draw() {
 *   if (keyIsPressed === true) {
 *     fill(0);
 *   } else {
 *     fill(255);
 *   }
 *   rect(25, 25, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.isKeyPressed = false;
p5.prototype.keyIsPressed = false; // khan

/**
 * The system variable key always contains the value of the most recent
 * key on the keyboard that was typed. To get the proper capitalization, it
 * is best to use it within keyTyped(). For non-ASCII keys, use the keyCode
 * variable.
 *
 * @property key
 * @example
 * <div><code>
 * // Click any key to display it!
 * // (Not Guaranteed to be Case Sensitive)
 * function setup() {
 *   fill(245, 123, 158);
 *   textSize(50);
 * }
 *
 * function draw() {
 *   background(200);
 *   text(key, 33,65); // Display last key pressed.
 * }
 * </div></code>
 */
p5.prototype.key = '';

/**
 * The variable keyCode is used to detect special keys such as BACKSPACE,
 * DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW,
 * DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
 *
 * @property keyCode
 * @example
 * <div><code>
 * var fillVal = 126;
 * function draw() {
 *   fill(fillVal);
 *   rect(25, 25, 50, 50);
 * }
 *
 * function keyPressed() {
 *   if (keyCode == UP_ARROW) {
 *     fillVal = 255;
 *   } else if (keyCode == DOWN_ARROW) {
 *     fillVal = 0;
 *   }
 *   return false; // prevent default
 * }
 * </code></div>
 */
p5.prototype.keyCode = 0;

/**
 * The keyPressed() function is called once every time a key is pressed. The
 * keyCode for the key that was pressed is stored in the keyCode variable.
 * <br><br>
 * For non-ASCII keys, use the keyCode variable. You can check if the keyCode
 * equals BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL,
 * OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
 * <br><br>
 * For ASCII keys that was pressed is stored in the key variable. However, it
 * does not distinguish between uppercase and lowercase. For this reason, it
 * is recommended to use keyTyped() to read the key variable, in which the
 * case of the variable will be distinguished.
 * <br><br>
 * Because of how operating systems handle key repeats, holding down a key
 * may cause multiple calls to keyTyped() (and keyReleased() as well). The
 * rate of repeat is set by the operating system and how each computer is
 * configured.<br><br>
 * Browsers may have different default
 * behaviors attached to various key events. To prevent any default
 * behavior for this event, add "return false" to the end of the method.
 *
 * @method keyPressed
 * @example
 * <div>
 * <code>
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function keyPressed() {
 *   if (value === 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function keyPressed() {
 *   if (keyCode === LEFT_ARROW) {
 *     value = 255;
 *   } else if (keyCode === RIGHT_ARROW) {
 *     value = 0;
 *   }
 *   return false; // prevent any default behavior
 * }
 * </code>
 * </div>
 */
p5.prototype._onkeydown = function (e) {
  this._setProperty('isKeyPressed', true);
  this._setProperty('keyIsPressed', true);
  this._setProperty('keyCode', e.which);
  downKeys[e.which] = true;
  var key = String.fromCharCode(e.which);
  if (!key) {
    key = e.which;
  }
  this._setProperty('key', key);
  var keyPressed = this.keyPressed || window.keyPressed;
  if (typeof keyPressed === 'function' && !e.charCode) {
    var executeDefault = keyPressed(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};
/**
 * The keyReleased() function is called once every time a key is released.
 * See key and keyCode for more information.<br><br>
 * Browsers may have different default
 * behaviors attached to various key events. To prevent any default
 * behavior for this event, add "return false" to the end of the method.
 *
 * @method keyReleased
 * @example
 * <div>
 * <code>
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function keyReleased() {
 *   if (value === 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 *   return false; // prevent any default behavior
 * }
 * </code>
 * </div>
 */
p5.prototype._onkeyup = function (e) {
  var keyReleased = this.keyReleased || window.keyReleased;
  this._setProperty('isKeyPressed', false);
  this._setProperty('keyIsPressed', false);
  downKeys[e.which] = false;
  //delete this._downKeys[e.which];
  var key = String.fromCharCode(e.which);
  if (!key) {
    key = e.which;
  }
  this._setProperty('key', key);
  this._setProperty('keyCode', e.which);
  if (typeof keyReleased === 'function') {
    var executeDefault = keyReleased(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The keyTyped() function is called once every time a key is pressed, but
 * action keys such as Ctrl, Shift, and Alt are ignored. The most recent
 * key pressed will be stored in the key variable.
 * <br><br>
 * Because of how operating systems handle key repeats, holding down a key
 * will cause multiple calls to keyTyped(), the rate is set by the operating
 * system and how each computer is configured.<br><br>
 * Browsers may have different default
 * behaviors attached to various key events. To prevent any default
 * behavior for this event, add "return false" to the end of the method.
 *
 * @method keyTyped
 * @example
 * <div>
 * <code>
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function keyTyped() {
 *   if (key === 'a') {
 *     value = 255;
 *   } else if (key === 'b') {
 *     value = 0;
 *   }
 *   return false; // prevent any default behavior
 * }
 * </code>
 * </div>
 */
p5.prototype._onkeypress = function (e) {
  this._setProperty('keyCode', e.which);
  this._setProperty('key', String.fromCharCode(e.which));
  var keyTyped = this.keyTyped || window.keyTyped;
  if (typeof keyTyped === 'function') {
    var executeDefault = keyTyped(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};
/**
 * The onblur function is called when the user is no longer focused
 * on the p5 element. Because the keyup events will no fire if the user is
 * not focused on the element we must assume all keys currently down have
 * been released.
 */
p5.prototype._onblur = function (e) {
  downKeys = {};
};

/**
 * The keyIsDown function checks if the key is currently down, i.e. pressed.
 * It can be used if you have an object that moves, and you want several keys
 * to be able to affect its behaviour simultaneously, such as moving a
 * sprite diagonally. You can put in any number representing the keyCode of
 * the key, or use any of the variable keyCode names listed
 * <a href="http://p5js.org/reference/#p5/keyCode">here</a>.
 *
 * @method keyIsDown
 * @param {Number}          code The key to check for.
 * @return {Boolean}        whether key is down or not
 * @example
 * <div><code>
 * var x = 100;
 * var y = 100;
 *
 * function setup() {
 *   createCanvas(512, 512);
 * }
 *
 * function draw() {
 *   if (keyIsDown(LEFT_ARROW))
 *     x-=5;
 *
 *   if (keyIsDown(RIGHT_ARROW))
 *     x+=5;
 *
 *   if (keyIsDown(UP_ARROW))
 *     y-=5;
 *
 *   if (keyIsDown(DOWN_ARROW))
 *     y+=5;
 *
 *   clear();
 *   fill(255, 0, 0);
 *   ellipse(x, y, 50, 50);
 * }
 * </code></div>
 */
p5.prototype.keyIsDown = function(code) {
  return downKeys[code];
};

module.exports = p5;

},{"../core/core":16}],31:[function(require,module,exports){
/**
 * @module Events
 * @submodule Mouse
 * @for p5
 * @requires core
 * @requires constants
 */


'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

/**
 * The system variable mouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the canvas.
 *
 * @property mouseX
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, 0, mouseX, 100);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseX = 0;

/**
 * The system variable mouseY always contains the current vertical position
 * of the mouse, relative to (0, 0) of the canvas.
 *
 * @property mouseY
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(0, mouseY, 100, mouseY);
 *}
 * </code>
 * </div>
 */
p5.prototype.mouseY = 0;

/**
 * The system variable pmouseX always contains the horizontal position of
 * the mouse in the frame previous to the current frame, relative to (0, 0)
 * of the canvas.
 *
 * @property pmouseX
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas to leave a trail
 * function setup() {
 *   //slow down the frameRate to make it more visible
 *   frameRate(10);
 * }
 *
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, mouseY, pmouseX, pmouseY);
 *   print(pmouseX + " -> " + mouseX);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pmouseX = 0;

/**
 * The system variable pmouseY always contains the vertical position of the
 * mouse in the frame previous to the current frame, relative to (0, 0) of
 * the canvas.
 *
 * @property pmouseY
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *   //draw a square only if the mouse is not moving
 *   if(mouseY == pmouseY && mouseX == pmouseX)
 *     rect(20,20,60,60);
 *
 *   print(pmouseY + " -> " + mouseY);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pmouseY = 0;

/**
 * The system variable winMouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the window.
 *
 * @property winMouseX
 *
 * @example
 * <div>
 * <code>
 * var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   //move the canvas to the horizontal mouse position
 *   //relative to the window
 *   myCanvas.position(winMouseX+1, windowHeight/2);
 *
 *  //the y of the square is relative to the canvas
 *  rect(20,mouseY,60,60);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.winMouseX = 0;

/**
 * The system variable winMouseY always contains the current vertical
 * position of the mouse, relative to (0, 0) of the window.
 *
 * @property winMouseY
 *
 * @example
 * <div>
 * <code>
 *var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   //move the canvas to the vertical mouse position
 *   //relative to the window
 *   myCanvas.position(windowWidth/2, winMouseY+1);
 *
 *  //the x of the square is relative to the canvas
 *  rect(mouseX,20,60,60);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.winMouseY = 0;

/**
 * The system variable pwinMouseX always contains the horizontal position
 * of the mouse in the frame previous to the current frame, relative to
 * (0, 0) of the window.
 *
 * @property pwinMouseX
 *
 * @example
 * <div>
 * <code>
 *
 * var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   noStroke();
 *   fill(237, 34, 93);
 *   }
 *
 * function draw() {
 *   clear();
 *   //the difference between previous and
 *   //current x position is the horizontal mouse speed
 *   var speed = abs(winMouseX-pwinMouseX);
 *   //change the size of the circle
 *   //according to the horizontal speed
 *   ellipse(50, 50, 10+speed*5, 10+speed*5);
 *   //move the canvas to the mouse position
 *   myCanvas.position( winMouseX+1, winMouseY+1);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pwinMouseX = 0;

/**
 * The system variable pwinMouseY always contains the vertical position of
 * the mouse in the frame previous to the current frame, relative to (0, 0)
 * of the window.
 *
 * @property pwinMouseY
 *
 *
 * @example
 * <div>
 * <code>
 *
 * var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   noStroke();
 *   fill(237, 34, 93);
 *   }
 *
 * function draw() {
 *   clear();
 *   //the difference between previous and
 *   //current y position is the vertical mouse speed
 *   var speed = abs(winMouseY-pwinMouseY);
 *   //change the size of the circle
 *   //according to the vertical speed
 *   ellipse(50, 50, 10+speed*5, 10+speed*5);
 *   //move the canvas to the mouse position
 *   myCanvas.position( winMouseX+1, winMouseY+1);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pwinMouseY = 0;

/**
 * Processing automatically tracks if the mouse button is pressed and which
 * button is pressed. The value of the system variable mouseButton is either
 * LEFT, RIGHT, or CENTER depending on which button was pressed last.
 * Warning: different browsers may track mouseButton differently.
 *
 * @property mouseButton
 *
 * @example
	* <div>
	* <code>
	* function draw() {
	*   background(237, 34, 93);
	*   fill(0);
	*
	*   if (mouseIsPressed) {
	*     if (mouseButton == LEFT)
	*       ellipse(50, 50, 50, 50);
	*     if (mouseButton == RIGHT)
	*       rect(25, 25, 50, 50);
	*     if (mouseButton == CENTER)
	*       triangle(23, 75, 50, 20, 78, 75);
	*   }
	*
	*   print(mouseButton);
	* }
	* </code>
 * </div>
 */
p5.prototype.mouseButton = 0;

/**
 * The boolean system variable mouseIsPressed is true if the mouse is pressed
 * and false if not.
 *
 * @property mouseIsPressed
 *
 * @example
	* <div>
	* <code>
	* function draw() {
	*   background(237, 34, 93);
	*   fill(0);
	*
	*   if (mouseIsPressed)
	*     ellipse(50, 50, 50, 50);
	*   else
	*     rect(25, 25, 50, 50);
	*
	*   print(mouseIsPressed);
	* }
	* </code>
	* </div>
 */
p5.prototype.mouseIsPressed = false;
p5.prototype.isMousePressed = false; // both are supported

p5.prototype._updateMouseCoords = function(e) {
  if(e.type === 'touchstart' ||
     e.type === 'touchmove' ||
     e.type === 'touchend') {
    this._setProperty('mouseX', this.touchX);
    this._setProperty('mouseY', this.touchY);
  } else {
    if(this._curElement !== null) {
      var mousePos = getMousePos(this._curElement.elt, e);
      this._setProperty('mouseX', mousePos.x);
      this._setProperty('mouseY', mousePos.y);
    }
  }
  this._setProperty('winMouseX', e.pageX);
  this._setProperty('winMouseY', e.pageY);
};

p5.prototype._updatePMouseCoords = function(e) {
  this._setProperty('pmouseX', this.mouseX);
  this._setProperty('pmouseY', this.mouseY);
  this._setProperty('pwinMouseX', this.winMouseX);
  this._setProperty('pwinMouseY', this.winMouseY);
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

p5.prototype._setMouseButton = function(e) {
  if (e.button === 1) {
    this._setProperty('mouseButton', constants.CENTER);
  } else if (e.button === 2) {
    this._setProperty('mouseButton', constants.RIGHT);
  } else {
    this._setProperty('mouseButton', constants.LEFT);
    if(e.type === 'touchstart' || e.type === 'touchmove') {
      this._setProperty('mouseX', this.touchX);
      this._setProperty('mouseY', this.touchY);
    }
  }
};

/**
 * The mouseMoved() function is called every time the mouse moves and a mouse
 * button is not pressed.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mouseMoved
 * @example
 * <div>
 * <code>
 * // Move the mouse across the page
 * // to change its value
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseMoved() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */

/**
 * The mouseDragged() function is called once every time the mouse moves and
 * a mouse button is pressed. If no mouseDragged() function is defined, the
 * touchMoved() function will be called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mouseDragged
 * @example
 * <div>
 * <code>
 * // Drag the mouse across the page
 * // to change its value
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseDragged() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseDragged() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousemove = function(e){
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._updateMouseCoords(e);
  if (!this.isMousePressed) {
    if (typeof context.mouseMoved === 'function') {
      executeDefault = context.mouseMoved(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  }
  else {
    if (typeof context.mouseDragged === 'function') {
      executeDefault = context.mouseDragged(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    } else if (typeof context.touchMoved === 'function') {
      executeDefault = context.touchMoved(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
      this._updateTouchCoords(e);
    }
  }
};

/**
 * The mousePressed() function is called once after every time a mouse button
 * is pressed. The mouseButton variable (see the related reference entry)
 * can be used to determine which button has been pressed. If no
 * mousePressed() function is defined, the touchStarted() function will be
 * called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mousePressed
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mousePressed() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mousePressed() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousedown = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._setProperty('isMousePressed', true);
  this._setProperty('mouseIsPressed', true);
  this._setMouseButton(e);
  this._updateMouseCoords(e);
  if (typeof context.mousePressed === 'function') {
    executeDefault = context.mousePressed(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchStarted === 'function') {
    executeDefault = context.touchStarted(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateTouchCoords(e);
  }
};

/**
 * The mouseReleased() function is called every time a mouse button is
 * released. If no mouseReleased() function is defined, the touchEnded()
 * function will be called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 *
 * @method mouseReleased
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been clicked
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseReleased() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseReleased() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmouseup = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._setProperty('isMousePressed', false);
  this._setProperty('mouseIsPressed', false);
  if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateTouchCoords(e);
  }
};

/**
 * The mouseClicked() function is called once after a mouse button has been
 * pressed and then released.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mouseClicked
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been clicked
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseClicked() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseClicked() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onclick = function(e) {
  var context = this._isGlobal ? window : this;
  if (typeof context.mouseClicked === 'function') {
    var executeDefault = context.mouseClicked(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The function mouseWheel is executed every time a scroll event is detected
 * either triggered by an actual mouse wheel or by a touchpad.<br>
 * The event.delta property returns -1 or +1 depending on the scroll
 * direction and the user's settings. (on OS X with "natural" scrolling
 * enabled, the values are inverted).<br><br>
 * Browsers may have different default behaviors attached to various
 * mouse events. To prevent any default behavior for this event, add
 * `return false` to the end of the method.
 *
 * The event.wheelDelta or event.detail properties can also be accessed but
 * their behavior may differ depending on the browser.
 * See <a href="http://www.javascriptkit.com/javatutors/onmousewheel.shtml">
 * mouse wheel event in JS</a>.
 *
 * @method mouseWheel
 *
	* @example
	* <div>
	* <code>
	* var pos = 25;
	*
	* function draw() {
	*   background(237, 34, 93);
	*   fill(0);
	*   rect(25, pos, 50, 50);
	* }
	*
	* function mouseWheel(event) {
	*   //event.delta can be +1 or -1 depending
	*   //on the wheel/scroll direction
	*   print(event.delta);
	*   //move the square one pixel up or down
	*   pos += event.delta;
	*   //uncomment to block page scrolling
	*   //return false;
	* }
	* </code>
	* </div>
 */
p5.prototype._onmousewheel = p5.prototype._onDOMMouseScroll = function(e) {
  var context = this._isGlobal ? window : this;
  if (typeof context.mouseWheel === 'function') {
    //creating a delta property (either +1 or -1)
    //for cross-browser compatibility
    e.delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    var executeDefault = context.mouseWheel(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};

module.exports = p5;

},{"../core/constants":15,"../core/core":16}],32:[function(require,module,exports){
/**
 * @module Events
 * @submodule Touch
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * The system variable touchX always contains the horizontal position of
 * one finger, relative to (0, 0) of the canvas. This is best used for
 * single touch interactions. For multi-touch interactions, use the
 * touches[] array.
 *
 * @property touchX
 */
p5.prototype.touchX = 0;

/**
 * The system variable touchY always contains the vertical position of
 * one finger, relative to (0, 0) of the canvas. This is best used for
 * single touch interactions. For multi-touch interactions, use the
 * touches[] array.
 *
 * @property touchY
 */
p5.prototype.touchY = 0;

/**
 * The system variable ptouchX always contains the horizontal position of
 * one finger, relative to (0, 0) of the canvas, in the frame previous to the
 * current frame.
 *
 * @property ptouchX
 */
p5.prototype.ptouchX = 0;

/**
 * The system variable ptouchY always contains the vertical position of
 * one finger, relative to (0, 0) of the canvas, in the frame previous to the
 * current frame.
 *
 * @property ptouchY
 */
p5.prototype.ptouchY = 0;

/**
 * The system variable touches[] contains an array of the positions of all
 * current touch points, relative to (0, 0) of the canvas. Each element in
 * the array is an object with x and y properties.
 *
 * @property touches[]
 */
p5.prototype.touches = [];

/**
 * The boolean system variable touchIsDown is true if the screen is
 * touched and false if not.
 *
 * @property touchIsDown
 */
p5.prototype.touchIsDown = false;

p5.prototype._updateTouchCoords = function(e) {
  if(e.type === 'mousedown' ||
     e.type === 'mousemove' ||
     e.type === 'mouseup'){
    this._setProperty('touchX', this.mouseX);
    this._setProperty('touchY', this.mouseY);
  } else {
    var touchPos = getTouchPos(this._curElement.elt, e, 0);
    this._setProperty('touchX', touchPos.x);
    this._setProperty('touchY', touchPos.y);

    var touches = [];
    for(var i = 0; i < e.touches.length; i++){
      var pos = getTouchPos(this._curElement.elt, e, i);
      touches[i] = {x: pos.x, y: pos.y};
    }
    this._setProperty('touches', touches);
  }
};

p5.prototype._updatePTouchCoords = function() {
  this._setProperty('ptouchX', this.touchX);
  this._setProperty('ptouchY', this.touchY);
};

function getTouchPos(canvas, e, i) {
  i = i || 0;
  var rect = canvas.getBoundingClientRect();
  var touch = e.touches[i] || e.changedTouches[i];
  return  {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

/**
 * The touchStarted() function is called once after every time a touch is
 * registered. If no touchStarted() function is defined, the mousePressed()
 * function will be called instead if it is defined. Browsers may have
 * different default
 * behaviors attached to various touch events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method touchStarted
 * @example
 * <div>
 * <code>
 * // Touch within the image to change
 * // the value of the rectangle
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function touchStarted() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function touchStarted() {
 *   ellipse(touchX, touchY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchstart = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._updateTouchCoords(e);
  this._setProperty('touchIsDown', true);
  if(typeof context.touchStarted === 'function') {
    executeDefault = context.touchStarted(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mousePressed === 'function') {
    executeDefault = context.mousePressed(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    //this._setMouseButton(e);
  }
};

/**
 * The touchMoved() function is called every time a touch move is registered.
 * If no touchStarted() function is defined, the mouseDragged() function will
 * be called instead if it is defined. Browsers may have different default
 * behaviors attached to various touch events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method touchMoved
 * @example
 * <div>
 * <code>
 * // Move your finger across the page
 * // to change its value
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function touchMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function touchMoved() {
 *   ellipse(touchX, touchY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchmove = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._updateTouchCoords(e);
  if (typeof context.touchMoved === 'function') {
    executeDefault = context.touchMoved(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mouseDragged === 'function') {
    executeDefault = context.mouseDragged(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateMouseCoords(e);
  }
};

/**
 * The touchEnded() function is called every time a touch ends. If no
 * touchStarted() function is defined, the mouseReleased() function will be
 * called instead if it is defined. Browsers may have different default
 * behaviors attached to various touch events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method touchEnded
 * @example
 * <div>
 * <code>
 * // Release touch within the image to
 * // change the value of the rectangle
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function touchEnded() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function touchEnded() {
 *   ellipse(touchX, touchY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchend = function(e) {
  this._updateTouchCoords(e);
  if (this.touches.length === 0) {
    this._setProperty('touchIsDown', false);
  }
  var context = this._isGlobal ? window : this;
  var executeDefault;
  if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateMouseCoords(e);
  }
};

module.exports = p5;

},{"../core/core":16}],33:[function(require,module,exports){
/*global ImageData:false */

/**
 * This module defines the filters for use with image buffers.
 *
 * This module is basically a collection of functions stored in an object
 * as opposed to modules. The functions are destructive, modifying
 * the passed in canvas rather than creating a copy.
 *
 * Generally speaking users of this module will use the Filters.apply method
 * on a canvas to create an effect.
 *
 * A number of functions are borrowed/adapted from
 * http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 * or the java processing implementation.
 */

'use strict';

var Filters = {};


/*
 * Helper functions
 */


/**
 * Returns the pixel buffer for a canvas
 *
 * @private
 *
 * @param  {Canvas|ImageData} canvas the canvas to get pixels from
 * @return {Uint8ClampedArray}       a one-dimensional array containing
 *                                   the data in thc RGBA order, with integer
 *                                   values between 0 and 255
 */
Filters._toPixels = function (canvas) {
  if (canvas instanceof ImageData) {
    return canvas.data;
  } else {
    return canvas.getContext('2d').getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;
  }
};

/**
 * Returns a 32 bit number containing ARGB data at ith pixel in the
 * 1D array containing pixels data.
 *
 * @private
 *
 * @param  {Uint8ClampedArray} data array returned by _toPixels()
 * @param  {Integer}           i    index of a 1D Image Array
 * @return {Integer}                32 bit integer value representing
 *                                  ARGB value.
 */
Filters._getARGB = function (data, i) {
  var offset = i * 4;
  return (data[offset+3] << 24) & 0xff000000 |
    (data[offset] << 16) & 0x00ff0000 |
    (data[offset+1] << 8) & 0x0000ff00 |
    data[offset+2] & 0x000000ff;
};

/**
 * Modifies pixels RGBA values to values contained in the data object.
 *
 * @private
 *
 * @param {Uint8ClampedArray} pixels array returned by _toPixels()
 * @param {Int32Array}        data   source 1D array where each value
 *                                   represents ARGB values
 */
Filters._setPixels = function (pixels, data) {
  var offset = 0;
  for( var i = 0, al = pixels.length; i < al; i++) {
    offset = i*4;
    pixels[offset + 0] = (data[i] & 0x00ff0000)>>>16;
    pixels[offset + 1] = (data[i] & 0x0000ff00)>>>8;
    pixels[offset + 2] = (data[i] & 0x000000ff);
    pixels[offset + 3] = (data[i] & 0xff000000)>>>24;
  }
};

/**
 * Returns the ImageData object for a canvas
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 *
 * @private
 *
 * @param  {Canvas|ImageData} canvas canvas to get image data from
 * @return {ImageData}               Holder of pixel data (and width and
 *                                   height) for a canvas
 */
Filters._toImageData = function (canvas) {
  if (canvas instanceof ImageData) {
    return canvas;
  } else {
    return canvas.getContext('2d').getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
};

/**
 * Returns a blank ImageData object.
 *
 * @private
 *
 * @param  {Integer} width
 * @param  {Integer} height
 * @return {ImageData}
 */
Filters._createImageData = function (width, height) {
  Filters._tmpCanvas = document.createElement('canvas');
  Filters._tmpCtx = Filters._tmpCanvas.getContext('2d');
  return this._tmpCtx.createImageData(width, height);
};


/**
 * Applys a filter function to a canvas.
 *
 * The difference between this and the actual filter functions defined below
 * is that the filter functions generally modify the pixel buffer but do
 * not actually put that data back to the canvas (where it would actually
 * update what is visible). By contrast this method does make the changes
 * actually visible in the canvas.
 *
 * The apply method is the method that callers of this module would generally
 * use. It has been separated from the actual filters to support an advanced
 * use case of creating a filter chain that executes without actually updating
 * the canvas in between everystep.
 *
 * @param  {[type]} func   [description]
 * @param  {[type]} canvas [description]
 * @param  {[type]} level  [description]
 * @return {[type]}        [description]
 */
Filters.apply = function (canvas, func, filterParam) {
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //Filters can either return a new ImageData object, or just modify
  //the one they received.
  var newImageData = func(imageData, filterParam);
  if (newImageData instanceof ImageData) {
    ctx.putImageData(newImageData, 0, 0, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
  }
};


/*
 * Filters
 */


/**
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 *
 * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 *
 * @param  {Canvas} canvas
 * @param  {Float} level
 */
Filters.threshold = function (canvas, level) {
  var pixels = Filters._toPixels(canvas);

  if (level === undefined) {
    level = 0.5;
  }
  var thresh = Math.floor(level * 255);

  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    var gray = (0.2126 * r + 0.7152 * g + 0.0722 * b);
    var val;
    if (gray >= thresh) {
      val = 255;
    } else {
      val = 0;
    }
    pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
  }

};


/**
 * Converts any colors in the image to grayscale equivalents.
 * No parameter is used.
 *
 * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 *
 * @param {Canvas} canvas
 */
Filters.gray = function (canvas) {
  var pixels = Filters._toPixels(canvas);

  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];

    // CIE luminance for RGB
    var gray = (0.2126 * r + 0.7152 * g + 0.0722 * b);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
  }
};

/**
 * Sets the alpha channel to entirely opaque. No parameter is used.
 *
 * @param {Canvas} canvas
 */
Filters.opaque = function (canvas) {
  var pixels = Filters._toPixels(canvas);

  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i + 3] = 255;
  }

  return pixels;
};

/**
 * Sets each pixel to its inverse value. No parameter is used.
 * @param {Invert}
 */
Filters.invert = function (canvas) {
  var pixels = Filters._toPixels(canvas);

  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i];
    pixels[i + 1] = 255 - pixels[i + 1];
    pixels[i + 2] = 255 - pixels[i + 2];
  }

};


/**
 * Limits each channel of the image to the number of colors specified as
 * the parameter. The parameter can be set to values between 2 and 255, but
 * results are most noticeable in the lower ranges.
 *
 * Adapted from java based processing implementation
 *
 * @param  {Canvas} canvas
 * @param  {Integer} level
 */
Filters.posterize = function (canvas, level) {
  var pixels = Filters._toPixels(canvas);

  if ((level < 2) || (level > 255)) {
    throw new Error(
      'Level must be greater than 2 and less than 255 for posterize'
    );
  }

  var levels1 = level - 1;
  for (var i = 0; i < pixels.length; i+=4) {
    var rlevel = pixels[i];
    var glevel = pixels[i + 1];
    var blevel = pixels[i + 2];

    pixels[i] = (((rlevel * level) >> 8) * 255) / levels1;
    pixels[i + 1] = (((glevel * level) >> 8) * 255) / levels1;
    pixels[i + 2] = (((blevel * level) >> 8) * 255) / levels1;
  }
};

/**
 * reduces the bright areas in an image
 * @param  {Canvas} canvas
 *
 */
Filters.dilate = function (canvas) {
  var pixels = Filters._toPixels(canvas);
  var currIdx = 0;
  var maxIdx = pixels.length ? pixels.length/4 : 0;
  var out = new Int32Array(maxIdx);
  var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
  var idxRight, idxLeft, idxUp, idxDown,
      colRight, colLeft, colUp, colDown,
      lumRight, lumLeft, lumUp, lumDown;

  while(currIdx < maxIdx) {
    currRowIdx = currIdx;
    maxRowIdx = currIdx + canvas.width;
    while (currIdx < maxRowIdx) {
      colOrig = colOut = Filters._getARGB(pixels, currIdx);
      idxLeft = currIdx - 1;
      idxRight = currIdx + 1;
      idxUp = currIdx - canvas.width;
      idxDown = currIdx + canvas.width;

      if (idxLeft < currRowIdx) {
        idxLeft = currIdx;
      }
      if (idxRight >= maxRowIdx) {
        idxRight = currIdx;
      }
      if (idxUp < 0){
        idxUp = 0;
      }
      if (idxDown >= maxIdx) {
        idxDown = currIdx;
      }
      colUp = Filters._getARGB(pixels, idxUp);
      colLeft = Filters._getARGB(pixels, idxLeft);
      colDown = Filters._getARGB(pixels, idxDown);
      colRight = Filters._getARGB(pixels, idxRight);

      //compute luminance
      currLum = 77*(colOrig>>16&0xff) +
        151*(colOrig>>8&0xff) +
        28*(colOrig&0xff);
      lumLeft = 77*(colLeft>>16&0xff) +
        151*(colLeft>>8&0xff) +
        28*(colLeft&0xff);
      lumRight = 77*(colRight>>16&0xff) +
        151*(colRight>>8&0xff) +
        28*(colRight&0xff);
      lumUp = 77*(colUp>>16&0xff) +
        151*(colUp>>8&0xff) +
        28*(colUp&0xff);
      lumDown = 77*(colDown>>16&0xff) +
        151*(colDown>>8&0xff) +
        28*(colDown&0xff);

      if (lumLeft > currLum) {
        colOut = colLeft;
        currLum = lumLeft;
      }
      if (lumRight > currLum) {
        colOut = colRight;
        currLum = lumRight;
      }
      if (lumUp > currLum) {
        colOut = colUp;
        currLum = lumUp;
      }
      if (lumDown > currLum) {
        colOut = colDown;
        currLum = lumDown;
      }
      out[currIdx++]=colOut;
    }
  }
  Filters._setPixels(pixels, out);
};

/**
 * increases the bright areas in an image
 * @param  {Canvas} canvas
 *
 */
Filters.erode = function(canvas) {
  var pixels = Filters._toPixels(canvas);
  var currIdx = 0;
  var maxIdx = pixels.length ? pixels.length/4 : 0;
  var out = new Int32Array(maxIdx);
  var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
  var idxRight, idxLeft, idxUp, idxDown,
      colRight, colLeft, colUp, colDown,
      lumRight, lumLeft, lumUp, lumDown;

  while(currIdx < maxIdx) {
    currRowIdx = currIdx;
    maxRowIdx = currIdx + canvas.width;
    while (currIdx < maxRowIdx) {
      colOrig = colOut = Filters._getARGB(pixels, currIdx);
      idxLeft = currIdx - 1;
      idxRight = currIdx + 1;
      idxUp = currIdx - canvas.width;
      idxDown = currIdx + canvas.width;

      if (idxLeft < currRowIdx) {
        idxLeft = currIdx;
      }
      if (idxRight >= maxRowIdx) {
        idxRight = currIdx;
      }
      if (idxUp < 0) {
        idxUp = 0;
      }
      if (idxDown >= maxIdx) {
        idxDown = currIdx;
      }
      colUp = Filters._getARGB(pixels, idxUp);
      colLeft = Filters._getARGB(pixels, idxLeft);
      colDown = Filters._getARGB(pixels, idxDown);
      colRight = Filters._getARGB(pixels, idxRight);

      //compute luminance
      currLum = 77*(colOrig>>16&0xff) +
        151*(colOrig>>8&0xff) +
        28*(colOrig&0xff);
      lumLeft = 77*(colLeft>>16&0xff) +
        151*(colLeft>>8&0xff) +
        28*(colLeft&0xff);
      lumRight = 77*(colRight>>16&0xff) +
        151*(colRight>>8&0xff) +
        28*(colRight&0xff);
      lumUp = 77*(colUp>>16&0xff) +
        151*(colUp>>8&0xff) +
        28*(colUp&0xff);
      lumDown = 77*(colDown>>16&0xff) +
        151*(colDown>>8&0xff) +
        28*(colDown&0xff);

      if (lumLeft < currLum) {
        colOut = colLeft;
        currLum = lumLeft;
      }
      if (lumRight < currLum) {
        colOut = colRight;
        currLum = lumRight;
      }
      if (lumUp < currLum) {
        colOut = colUp;
        currLum = lumUp;
      }
      if (lumDown < currLum) {
        colOut = colDown;
        currLum = lumDown;
      }

      out[currIdx++]=colOut;
    }
  }
  Filters._setPixels(pixels, out);
};

// BLUR

// internal kernel stuff for the gaussian blur filter
var blurRadius;
var blurKernelSize;
var blurKernel;
var blurMult;

/*
 * Port of https://github.com/processing/processing/blob/
 * master/core/src/processing/core/PImage.java#L1250
 *
 * Optimized code for building the blur kernel.
 * further optimized blur code (approx. 15% for radius=20)
 * bigger speed gains for larger radii (~30%)
 * added support for various image types (ALPHA, RGB, ARGB)
 * [toxi 050728]
 */
function buildBlurKernel(r) {
  var radius = (r * 3.5)|0;
  radius = (radius < 1) ? 1 : ((radius < 248) ? radius : 248);

  if (blurRadius !== radius) {
    blurRadius = radius;
    blurKernelSize = 1 + blurRadius<<1;
    blurKernel = new Int32Array(blurKernelSize);
    blurMult = new Array(blurKernelSize);
    for(var l = 0; l < blurKernelSize; l++){
      blurMult[l] = new Int32Array(256);
    }

    var bk,bki;
    var bm,bmi;

    for (var i = 1, radiusi = radius - 1; i < radius; i++) {
      blurKernel[radius+i] = blurKernel[radiusi] = bki = radiusi * radiusi;
      bm = blurMult[radius+i];
      bmi = blurMult[radiusi--];
      for (var j = 0; j < 256; j++){
        bm[j] = bmi[j] = bki * j;
      }
    }
    bk = blurKernel[radius] = radius * radius;
    bm = blurMult[radius];

    for (var k = 0; k < 256; k++){
      bm[k] = bk * k;
    }
  }

}

// Port of https://github.com/processing/processing/blob/
// master/core/src/processing/core/PImage.java#L1433
function blurARGB(canvas, radius) {
  var pixels = Filters._toPixels(canvas);
  var width = canvas.width;
  var height = canvas.height;
  var numPackedPixels = width * height;
  var argb = new Int32Array(numPackedPixels);
  for (var j = 0; j < numPackedPixels; j++) {
    argb[j] = Filters._getARGB(pixels, j);
  }
  var sum, cr, cg, cb, ca;
  var read, ri, ym, ymi, bk0;
  var a2 = new Int32Array(numPackedPixels);
  var r2 = new Int32Array(numPackedPixels);
  var g2 = new Int32Array(numPackedPixels);
  var b2 = new Int32Array(numPackedPixels);
  var yi = 0;
  buildBlurKernel(radius);
  var x, y, i;
  var bm;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      read = x - blurRadius;
      if (read < 0) {
        bk0 = -read;
        read = 0;
      } else {
        if (read >= width) {
          break;
        }
        bk0 = 0;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (read >= width) {
          break;
        }
        var c = argb[read + yi];
        bm = blurMult[i];
        ca += bm[(c & -16777216) >>> 24];
        cr += bm[(c & 16711680) >> 16];
        cg += bm[(c & 65280) >> 8];
        cb += bm[c & 255];
        sum += blurKernel[i];
        read++;
      }
      ri = yi + x;
      a2[ri] = ca / sum;
      r2[ri] = cr / sum;
      g2[ri] = cg / sum;
      b2[ri] = cb / sum;
    }
    yi += width;
  }
  yi = 0;
  ym = -blurRadius;
  ymi = ym * width;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      if (ym < 0) {
        bk0 = ri = -ym;
        read = x;
      } else {
        if (ym >= height) {
          break;
        }
        bk0 = 0;
        ri = ym;
        read = x + ymi;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (ri >= height) {
          break;
        }
        bm = blurMult[i];
        ca += bm[a2[read]];
        cr += bm[r2[read]];
        cg += bm[g2[read]];
        cb += bm[b2[read]];
        sum += blurKernel[i];
        ri++;
        read += width;
      }
      argb[x + yi] = (ca/sum)<<24 | (cr/sum)<<16 | (cg/sum)<<8 | (cb/sum);
    }
    yi += width;
    ymi += width;
    ym++;
  }
  Filters._setPixels(pixels, argb);
}

Filters.blur = function(canvas, radius){
  blurARGB(canvas, radius);
};


module.exports = Filters;

},{}],34:[function(require,module,exports){
/**
 * @module Image
 * @submodule Image
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the p5.Image class
 * for drawing images to the main display canvas.
 */
'use strict';


var p5 = require('../core/core');
var constants = require('../core/constants');

/* global frames:true */// This is not global, but JSHint is not aware that
// this module is implicitly enclosed with Browserify: this overrides the
// redefined-global error and permits using the name "frames" for the array
// of saved animation frames.
var frames = [];

p5.prototype._imageMode = constants.CORNER;
p5.prototype._tint = null;

/**
 * Creates a new p5.Image (the datatype for storing images). This provides a
 * fresh buffer of pixels to play with. Set the size of the buffer with the
 * width and height parameters.
 *
 * .pixels gives access to an array containing the values for all the pixels
 * in the display window.
 * These values are numbers. This array is the size (including an appropriate
 * factor for the pixelDensity) of the display window x4,
 * representing the R, G, B, A values in order for each pixel, moving from
 * left to right across each row, then down each column. See .pixels for
 * more info. It may also be simpler to use set() or get().
 * <br><br>
 * Before accessing the pixels of an image, the data must loaded with the
 * loadPixels()
 * function. After the array data has been modified, the updatePixels()
 * function must be run to update the changes.
 *
 * @method createImage
 * @param  {Integer} width  width in pixels
 * @param  {Integer} height height in pixels
 * @return {p5.Image}       the p5.Image object
 * @example
 * <div>
 * <code>
 * img = createImage(66, 66);
 * img.loadPixels();
 * for (i = 0; i < img.width; i++) {
 *   for (j = 0; j < img.height; j++) {
 *     img.set(i, j, color(0, 90, 102));
 *   }
 * }
 * img.updatePixels();
 * image(img, 17, 17);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * img = createImage(66, 66);
 * img.loadPixels();
 * for (i = 0; i < img.width; i++) {
 *   for (j = 0; j < img.height; j++) {
 *     img.set(i, j, color(0, 90, 102, i % img.width * 2));
 *   }
 * }
 * img.updatePixels();
 * image(img, 17, 17);
 * image(img, 34, 34);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var pink = color(255, 102, 204);
 * img = createImage(66, 66);
 * img.loadPixels();
 * var d = pixelDensity;
 * var halfImage = 4 * (width * d) * (height/2 * d);
 * for (var i = 0; i < halfImage; i+=4) {
 *   img.pixels[i] = red(pink);
 *   img.pixels[i+1] = green(pink);
 *   img.pixels[i+2] = blue(pink);
 *   img.pixels[i+3] = alpha(pink);
 * }
 * img.updatePixels();
 * image(img, 17, 17);
 * </code>
 * </div>
 */
p5.prototype.createImage = function(width, height) {
  return new p5.Image(width, height);
};

/**
 *  Save the current canvas as an image. In Safari, will open the
 *  image in the window and the user must provide their own
 *  filename on save-as. Other browsers will either save the
 *  file immediately, or prompt the user with a dialogue window.
 *
 *  @method saveCanvas
 *  @param  {[String]} filename
 *  @param  {[String]} extension 'jpg' or 'png'
 *  @param  {[selectedCanvas]} canvas a variable representing a
 *                             specific html5 canvas (optional).
 */
p5.prototype.saveCanvas = function(filename, extension, selectedCanvas) {
  if (!extension) {
    extension = p5.prototype._checkFileExtension(filename, extension)[1];
    if (extension === '') {
      extension = 'png';
    }
  }
  var cnv;
  if (selectedCanvas) {
    cnv = selectedCanvas;
  } else if (this._curElement && this._curElement.elt) {
    cnv = this._curElement.elt;
  }

  if ( p5.prototype._isSafari() ) {
    var aText = 'Hello, Safari user!\n';
    aText += 'Now capturing a screenshot...\n';
    aText += 'To save this image,\n';
    aText += 'go to File --> Save As.\n';
    alert(aText);
    window.location.href = cnv.toDataURL();
  } else {
    var mimeType;
    if (typeof(extension) === 'undefined') {
      extension = 'png';
      mimeType = 'image/png';
    }
    else {
      switch(extension){
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      default:
        mimeType = 'image/png';
        break;
      }
    }
    var downloadMime = 'image/octet-stream';
    var imageData = cnv.toDataURL(mimeType);
    imageData = imageData.replace(mimeType, downloadMime);

    p5.prototype.downloadFile(imageData, filename, extension);
  }
};

/**
 *  Capture a sequence of frames that can be used to create a movie.
 *  Accepts a callback. For example, you may wish to send the frames
 *  to a server where they can be stored or converted into a movie.
 *  If no callback is provided, the browser will attempt to download
 *  all of the images that have just been created.
 *
 *  @method saveFrames
 *  @param  {[type]}   filename  [description]
 *  @param  {[type]}   extension [description]
 *  @param  {[type]}   _duration [description]
 *  @param  {[type]}   _fps      [description]
 *  @param  {[Function]} callback  [description]
 *  @return {[type]}             [description]
 */
p5.prototype.saveFrames = function(fName, ext, _duration, _fps, callback) {
  var duration = _duration || 3;
  duration = p5.prototype.constrain(duration, 0, 15);
  duration = duration * 1000;
  var fps = _fps || 15;
  fps = p5.prototype.constrain(fps, 0, 22);
  var count = 0;

  var makeFrame = p5.prototype._makeFrame;
  var cnv = this._curElement.elt;
  var frameFactory = setInterval(function(){
    makeFrame(fName + count, ext, cnv);
    count++;
  },1000/fps);

  setTimeout(function(){
    clearInterval(frameFactory);
    if (callback) {
      callback(frames);
    }
    else {
      for (var i = 0; i < frames.length; i++) {
        var f = frames[i];
        p5.prototype.downloadFile(f.imageData, f.filename, f.ext);
      }
    }
    frames = []; // clear frames
  }, duration + 0.01);
};

p5.prototype._makeFrame = function(filename, extension, _cnv) {
  var cnv;
  if (this) {
    cnv = this._curElement.elt;
  } else {
    cnv = _cnv;
  }
  var mimeType;
  if (!extension) {
    extension = 'png';
    mimeType = 'image/png';
  }
  else {
    switch(extension.toLowerCase()){
    case 'png':
      mimeType = 'image/png';
      break;
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'jpg':
      mimeType = 'image/jpeg';
      break;
    default:
      mimeType = 'image/png';
      break;
    }
  }
  var downloadMime = 'image/octet-stream';
  var imageData = cnv.toDataURL(mimeType);
  imageData = imageData.replace(mimeType, downloadMime);

  var thisFrame = {};
  thisFrame.imageData = imageData;
  thisFrame.filename = filename;
  thisFrame.ext = extension;
  frames.push(thisFrame);
};

module.exports = p5;

},{"../core/constants":15,"../core/core":16}],35:[function(require,module,exports){
/**
 * @module Image
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var Filters = require('./filters');
var canvas = require('../core/canvas');
var constants = require('../core/constants');

require('../core/error_helpers');

/**
 * Loads an image from a path and creates a p5.Image from it.
 *
 * The image may not be immediately available for rendering
 * If you want to ensure that the image is ready before doing
 * anything with it you can do perform those operations in the
 * callback, or place the loadImage() call in preload().
 *
 * @method loadImage
 * @param  {String} path Path of the image to be loaded
 * @param  {Function(p5.Image)} [successCallback] Function to be called once
 *                                the image is loaded. Will be passed the
 *                                p5.Image.
 * @param  {Function(Event)}    [failureCallback] called with event error if
 *                                the image fails to load.
 * @return {p5.Image}             the p5.Image object
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   // here we use a callback to display the image after loading
 *   loadImage("assets/laDefense.jpg", function(img) {
 *     image(img, 0, 0);
 *   });
 * }
 * </code>
 * </div>
 */
p5.prototype.loadImage = function(path, successCallback, failureCallback) {
  var img = new Image();
  var pImg = new p5.Image(1, 1, this);

  img.onload = function() {
    pImg.width = pImg.canvas.width = img.width;
    pImg.height = pImg.canvas.height = img.height;

    // Draw the image into the backing canvas of the p5.Image
    pImg.canvas.getContext('2d').drawImage(img, 0, 0);

    if (typeof successCallback === 'function') {
      successCallback(pImg);
    }
  };
  img.onerror = function(e) {
    p5._friendlyFileLoadError(0,img.src);
    if (typeof failureCallback === 'function') {
      failureCallback(e);
    }
  };

  //set crossOrigin in case image is served which CORS headers
  //this will let us draw to canvas without tainting it.
  //see https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
  // When using data-uris the file will be loaded locally
  // so we don't need to worry about crossOrigin with base64 file types
  if(path.indexOf('data:image/') !== 0) {
    img.crossOrigin = 'Anonymous';
  }

  //start loading the image
  img.src = path;

  return pImg;
};

/**
 * Draw an image to the main canvas of the p5js sketch
 *
 * @method image
 * @param  {p5.Image} image    the image to display
 * @param  {Number}   [x=0]    x-coordinate of the image
 * @param  {Number}   [y=0]    y-coordinate of the image
 * @param  {Number}   [width]  width to display the image
 * @param  {Number}   [height] height to display the image
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   // here we use a callback to display the image after loading
 *   loadImage("assets/laDefense.jpg", function(img) {
 *     image(img, 0, 0);
 *   });
 * }
 * </code>
 * </div>
 */
p5.prototype.image = function(img, x, y, width, height) {
  // Temporarily disabling until options for p5.Graphics are added.
  // this._validateParameters(
  //   'image',
  //   arguments,
  //   [
  //     ['p5.Image', 'Number', 'Number'],
  //     ['p5.Image', 'Number', 'Number', 'Number', 'Number']
  //   ]
  // );

  // set defaults
  x = x || 0;
  y = y || 0;
  width = width || img.width;
  height = height || img.height;
  var vals = canvas.modeAdjust(x, y, width, height, this._imageMode);
  // tint the image if there is a tint
  this._graphics.image(img, vals.x, vals.y, vals.w, vals.h);
};

/**
 * Sets the fill value for displaying images. Images can be tinted to
 * specified colors or made transparent by including an alpha value.
 *
 * To apply transparency to an image without affecting its color, use
 * white as the tint color and specify an alpha value. For instance,
 * tint(255, 128) will make an image 50% transparent (assuming the default
 * alpha range of 0-255, which can be changed with colorMode()).
 *
 * The value for the gray parameter must be less than or equal to the current
 * maximum value as specified by colorMode(). The default maximum value is
 * 255.
 *
 * @method tint
 * @param {Number|Array} v1   gray value, red or hue value (depending on the
 *                            current color mode), or color Array
 * @param {Number|Array} [v2] green or saturation value (depending on the
 *                            current color mode)
 * @param {Number|Array} [v3] blue or brightness value (depending on the
 *                            current color mode)
 * @param {Number|Array} [a]  opacity of the background
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(0, 153, 204);  // Tint blue
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(0, 153, 204, 126);  // Tint blue and set transparency
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(255, 126);  // Apply transparency without changing color
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.tint = function () {
  var c = this.color.apply(this, arguments);
  this._tint = c.rgba;
};

/**
 * Removes the current fill value for displaying images and reverts to
 * displaying images with their original hues.
 *
 * @method noTint
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   tint(0, 153, 204);  // Tint blue
 *   image(img, 0, 0);
 *   noTint();  // Disable tint
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.noTint = function() {
  this._tint = null;
};

/**
 * Apply the current tint color to the input image, return the resulting
 * canvas.
 *
 * @param {p5.Image} The image to be tinted
 * @return {canvas} The resulting tinted canvas
 *
 */
p5.prototype._getTintedImageCanvas = function(img) {
  if (!img.canvas) {
    return img;
  }
  var pixels = Filters._toPixels(img.canvas);
  var tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = img.canvas.width;
  tmpCanvas.height = img.canvas.height;
  var tmpCtx = tmpCanvas.getContext('2d');
  var id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
  var newPixels = id.data;

  for(var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i+1];
    var b = pixels[i+2];
    var a = pixels[i+3];

    newPixels[i] = r*this._tint[0]/255;
    newPixels[i+1] = g*this._tint[1]/255;
    newPixels[i+2] = b*this._tint[2]/255;
    newPixels[i+3] = a*this._tint[3]/255;
  }

  tmpCtx.putImageData(id, 0, 0);
  return tmpCanvas;
};

/**
 * Set image mode. Modifies the location from which images are drawn by
 * changing the way in which parameters given to image() are interpreted.
 * The default mode is imageMode(CORNER), which interprets the second and
 * third parameters of image() as the upper-left corner of the image. If
 * two additional parameters are specified, they are used to set the image's
 * width and height.
 *
 * imageMode(CORNERS) interprets the second and third parameters of image()
 * as the location of one corner, and the fourth and fifth parameters as the
 * opposite corner.
 * imageMode(CENTER) interprets the second and third parameters of image()
 * as the image's center point. If two additional parameters are specified,
 * they are used to set the image's width and height.
 *
 * @method imageMode
 * @param {String} m The mode: either CORNER, CORNERS, or CENTER.
 * @example
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   imageMode(CORNER);
 *   image(img, 10, 10, 50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   imageMode(CORNERS);
 *   image(img, 10, 10, 90, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   imageMode(CENTER);
 *   image(img, 50, 50, 80, 80);
 * }
 * </code>
 * </div>
 */
p5.prototype.imageMode = function(m) {
  if (m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.CENTER) {
    this._imageMode = m;
  }
};


module.exports = p5;

},{"../core/canvas":14,"../core/constants":15,"../core/core":16,"../core/error_helpers":19,"./filters":33}],36:[function(require,module,exports){
/**
 * @module Image
 * @submodule Image
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the p5.Image class and P5 methods for
 * drawing images to the main display canvas.
 */

'use strict';

var p5 = require('../core/core');
var Filters = require('./filters');

/*
 * Class methods
 */

/**
 * Creates a new p5.Image. A p5.Image is a canvas backed representation of an
 * image. p5 can display .gif, .jpg and .png images. Images may be displayed
 * in 2D and 3D space. Before an image is used, it must be loaded with the
 * loadImage() function. The p5.Image class contains fields for the width and
 * height of the image, as well as an array called pixels[] that contains the
 * values for every pixel in the image. The methods described below allow
 * easy access to the image's pixels and alpha channel and simplify the
 * process of compositing.
 *
 * Before using the pixels[] array, be sure to use the loadPixels() method on
 * the image to make sure that the pixel data is properly loaded.
 *
 * @class p5.Image
 * @constructor
 * @param {Number} width
 * @param {Number} height
 * @param {Object} pInst An instance of a p5 sketch.
 */
p5.Image = function(width, height){
  /**
   * Image width.
   * @property width
   */
  this.width = width;
  /**
   * Image height.
   * @property height
   */
  this.height = height;
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.drawingContext = this.canvas.getContext('2d');
  this.pixelDensity = 1;
  /**
   * Array containing the values for all the pixels in the display window.
   * These values are numbers. This array is the size (include an appropriate
   * factor for pixelDensity) of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from
   * left to right across each row, then down each column. Retina and other
   * high denisty displays may have more pixels[] (by a factor of
   * pixelDensity^2).
   * For example, if the image is 100x100 pixels, there will be 40,000. With
   * pixelDensity = 2, there will be 160,000. The first four values
   * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
   * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
   * values of the pixel at (1, 0). More generally, to set values for a pixel
   * at (x, y):
   * <code><pre>var d = pixelDensity;
   * for (var i = 0; i < d; i++) {
   *   for (var j = 0; j < d; j++) {
   *     // loop over
   *     idx = 4*((y * d + j) * width * d + (x * d + i));
   *     pixels[idx] = r;
   *     pixels[idx+1] = g;
   *     pixels[idx+2] = b;
   *     pixels[idx+3] = a;
   *   }
   * }
   * <br><br>
   * Before accessing this array, the data must loaded with the loadPixels()
   * function. After the array data has been modified, the updatePixels()
   * function must be run to update the changes.
   * @property pixels[]
   * @example
   * <div>
   * <code>
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (i = 0; i < img.width; i++) {
   *   for (j = 0; j < img.height; j++) {
   *     img.set(i, j, color(0, 90, 102));
   *   }
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   * <div>
   * <code>
   * var pink = color(255, 102, 204);
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (var i = 0; i < 4*(width*height/2); i+=4) {
   *   img.pixels[i] = red(pink);
   *   img.pixels[i+1] = green(pink);
   *   img.pixels[i+2] = blue(pink);
   *   img.pixels[i+3] = alpha(pink);
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   */
  this.pixels = [];
};

/**
 * Helper fxn for sharing pixel methods
 *
 */
p5.Image.prototype._setProperty = function (prop, value) {
  this[prop] = value;
};

/**
 * Loads the pixels data for this image into the [pixels] attribute.
 *
 * @method loadPixels
 */
p5.Image.prototype.loadPixels = function(){
  p5.Renderer2D.prototype.loadPixels.call(this);
};

/**
 * Updates the backing canvas for this image with the contents of
 * the [pixels] array.
 *
 * @method updatePixels
 * @param {Integer|undefined} x x-offset of the target update area for the
 *                              underlying canvas
 * @param {Integer|undefined} y y-offset of the target update area for the
 *                              underlying canvas
 * @param {Integer|undefined} w height of the target update area for the
 *                              underlying canvas
 * @param {Integer|undefined} h height of the target update area for the
 *                              underlying canvas
 */
p5.Image.prototype.updatePixels = function(x, y, w, h){
  p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
};

/**
 * Get a region of pixels from an image.
 *
 * If no params are passed, those whole image is returned,
 * if x and y are the only params passed a single pixel is extracted
 * if all params are passed a rectangle region is extracted and a p5.Image
 * is returned.
 *
 * Returns undefined if the region is outside the bounds of the image
 *
 * @method get
 * @param  {Number}               [x] x-coordinate of the pixel
 * @param  {Number}               [y] y-coordinate of the pixel
 * @param  {Number}               [w] width
 * @param  {Number}               [h] height
 * @return {Array/Color | p5.Image}     color of pixel at x,y in array format
 *                                    [R, G, B, A] or p5.Image
 */
p5.Image.prototype.get = function(x, y, w, h){
  return p5.Renderer2D.prototype.get.call(this, x, y, w, h);
};

/**
 * Set the color of a single pixel or write an image into
 * this p5.Image.
 *
 * Note that for a large number of pixels this will
 * be slower than directly manipulating the pixels array
 * and then calling updatePixels().
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel
 * @param {Number}              y y-coordinate of the pixel
 * @param {Number|Array|Object}   a grayscale value | pixel array |
 *                                a p5.Color | image to copy
 * @example
 * <div>
 * <code>
 * img = createImage(66, 66);
 * img.loadPixels();
 * for (i = 0; i < img.width; i++) {
 *   for (j = 0; j < img.height; j++) {
 *     img.set(i, j, color(0, 90, 102, i % img.width * 2));
 *   }
 * }
 * img.updatePixels();
 * image(img, 17, 17);
 * image(img, 34, 34);
 * </code>
 * </div>
 */
p5.Image.prototype.set = function(x, y, imgOrCol){
  p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
};

/**
 * Resize the image to a new width and height. To make the image scale
 * proportionally, use 0 as the value for the wide or high parameter.
 * For instance, to make the width of an image 150 pixels, and change
 * the height using the same proportion, use resize(150, 0).
 *
 * @method resize
 * @param {Number} width the resized image width
 * @param {Number} height the resized image height
 * @example
 * <div><code>
 * var img;
 *
 * function setup() {
 *   img = loadImage("assets/rockies.jpg");
 * }

 * function draw() {
 *   image(img, 0, 0);
 * }
 *
 * function mousePressed() {
 *   img.resize(50, 100);
 * }
 * </code></div>
 */
p5.Image.prototype.resize = function(width, height){

  // Copy contents to a temporary canvas, resize the original
  // and then copy back.
  //
  // There is a faster approach that involves just one copy and swapping the
  // this.canvas reference. We could switch to that approach if (as i think
  // is the case) there an expectation that the user would not hold a
  // reference to the backing canvas of a p5.Image. But since we do not
  // enforce that at the moment, I am leaving in the slower, but safer
  // implementation.
  width = width || this.canvas.width;
  height = height || this.canvas.height;

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCanvas.getContext('2d').drawImage(this.canvas,
    0, 0, this.canvas.width, this.canvas.height,
    0, 0, tempCanvas.width, tempCanvas.height
  );


  // Resize the original canvas, which will clear its contents
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;

  //Copy the image back

  this.drawingContext.drawImage(tempCanvas,
    0, 0, width, height,
    0, 0, width, height
  );

  if(this.pixels.length > 0){
    this.loadPixels();
  }
};

/**
 * Copies a region of pixels from one image to another. If no
 * srcImage is specified this is used as the source. If the source
 * and destination regions aren't the same size, it will
 * automatically resize source pixels to fit the specified
 * target region.
 *
 * @method copy
 * @param  {p5.Image|undefined} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 */
p5.Image.prototype.copy = function () {
  p5.prototype.copy.apply(this, arguments);
};

/**
 * Masks part of an image from displaying by loading another
 * image and using it's alpha channel as an alpha channel for
 * this image.
 *
 * @method mask
 * @param {p5.Image|undefined} srcImage source image
 *
 * TODO: - Accept an array of alpha values.
 *       - Use other channels of an image. p5 uses the
 *       blue channel (which feels kind of arbitrary). Note: at the
 *       moment this method does not match native processings original
 *       functionality exactly.
 *
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 *
 */
p5.Image.prototype.mask = function(p5Image) {
  if(p5Image === undefined){
    p5Image = this;
  }
  var currBlend = this.drawingContext.globalCompositeOperation;

  var scaleFactor = 1;
  if (p5Image instanceof p5.Renderer) {
    scaleFactor = p5Image._pInst.pixelDensity;
  }

  var copyArgs = [
    p5Image,
    0,
    0,
    scaleFactor*p5Image.width,
    scaleFactor*p5Image.height,
    0,
    0,
    this.width,
    this.height
  ];

  this.drawingContext.globalCompositeOperation = 'destination-in';
  this.copy.apply(this, copyArgs);
  this.drawingContext.globalCompositeOperation = currBlend;
};

/**
 * Applies an image filter to a p5.Image
 *
 * @method filter
 * @param {String} operation one of threshold, gray, invert, posterize and
 *                           opaque see Filters.js for docs on each available
 *                           filter
 * @param {Number|undefined} value
 */
p5.Image.prototype.filter = function(operation, value) {
  Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
};

/**
 * Copies a region of pixels from one image to another, using a specified
 * blend mode to do the operation.
 *
 * @method blend
 * @param  {p5.Image|undefined} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 * @param  {Integer} blendMode the blend mode
 *
 * Available blend modes are: normal | multiply | screen | overlay |
 *            darken | lighten | color-dodge | color-burn | hard-light |
 *            soft-light | difference | exclusion | hue | saturation |
 *            color | luminosity
 *
 *
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 *
 */
p5.Image.prototype.blend = function() {
  p5.prototype.blend.apply(this, arguments);
};

/**
 * Saves the image to a file and force the browser to download it.
 * Accepts two strings for filename and file extension
 * Supports png (default) and jpg.
 *
 * @method save
 * @param {String} filename give your file a name
 * @param  {String} extension 'png' or 'jpg'
 */
p5.Image.prototype.save = function(filename, extension) {
  var mimeType;
  if (!extension) {
    extension = 'png';
    mimeType = 'image/png';
  }
  else {
    // en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
    switch(extension.toLowerCase()){
    case 'png':
      mimeType = 'image/png';
      break;
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'jpg':
      mimeType = 'image/jpeg';
      break;
    default:
      mimeType = 'image/png';
      break;
    }
  }
  var downloadMime = 'image/octet-stream';
  var imageData = this.canvas.toDataURL(mimeType);
  imageData = imageData.replace(mimeType, downloadMime);

  //Make the browser download the file
  p5.prototype.downloadFile(imageData, filename, extension);
};

module.exports = p5.Image;

},{"../core/core":16,"./filters":33}],37:[function(require,module,exports){
/**
 * @module Image
 * @submodule Pixels
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var Filters = require('./filters');
require('../color/p5.Color');

/**
 * <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
 * /Global_Objects/Uint8ClampedArray' target='_blank'>Uint8ClampedArray</a>
 * containing the values for all the pixels in the display window.
 * These values are numbers. This array is the size (include an appropriate
 * factor for pixelDensity) of the display window x4,
 * representing the R, G, B, A values in order for each pixel, moving from
 * left to right across each row, then down each column. Retina and other
 * high denisty displays will have more pixels[] (by a factor of
 * pixelDensity^2).
 * For example, if the image is 100x100 pixels, there will be 40,000. On a
 * retina display, there will be 160,000. The first four values
 * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
 * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
 * values of the pixel at (1, 0). More generally, to set values for a pixel
 * at (x, y):
 * <code><pre>var d = pixelDensity;
 * for (var i = 0; i < d; i++) {
 *   for (var j = 0; j < d; j++) {
 *     // loop over
 *     idx = 4*((y * d + j) * width * d + (x * d + i));
 *     pixels[idx] = r;
 *     pixels[idx+1] = g;
 *     pixels[idx+2] = b;
 *     pixels[idx+3] = a;
 *   }
 * }
 * </pre></code>
 * While the above method is complex, it is flexible enough to work with
 * any pixelDensity. Note that set() will automatically take care of
 * setting all the appropriate values in pixels[] for a given (x, y) at
 * any pixelDensity, but the performance may not be as fast when lots of
 * modifications are made to the pixel array.
 * <br><br>
 * Before accessing this array, the data must loaded with the loadPixels()
 * function. After the array data has been modified, the updatePixels()
 * function must be run to update the changes.
 * <br><br>
 * Note that this is not a standard javascript array.  This means that
 * standard javascript functions such as <code>slice()</code> or
 * <code>arrayCopy()</code> do not
 * work.
 *
 * @property pixels[]
 * @example
 * <div>
 * <code>
 * var pink = color(255, 102, 204);
 * loadPixels();
 * var d = pixelDensity;
 * var halfImage = 4 * (width * d) * (height/2 * d);
 * for (var i = 0; i < halfImage; i+=4) {
 *   pixels[i] = red(pink);
 *   pixels[i+1] = green(pink);
 *   pixels[i+2] = blue(pink);
 *   pixels[i+3] = alpha(pink);
 * }
 * updatePixels();
 * </code>
 * </div>
 */
p5.prototype.pixels = [];

/**
 * Copies a region of pixels from one image to another, using a specified
 * blend mode to do the operation.<br><br>
 * Available blend modes are: BLEND | DARKEST | LIGHTEST | DIFFERENCE |
 * MULTIPLY| EXCLUSION | SCREEN | REPLACE | OVERLAY | HARD_LIGHT |
 * SOFT_LIGHT | DODGE | BURN | ADD | NORMAL
 *
 *
 * @method blend
 * @param  {p5.Image|undefined} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 * @param  {Integer} blendMode the blend mode
 *
 * @example
 * <div><code>
 * var img0;
 * var img1;
 *
 * function preload() {
 *   img0 = loadImage("assets/rockies.jpg");
 *   img1 = loadImage("assets/bricks_third.jpg");
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, LIGHTEST);
 * }
 * </code></div>
 * <div><code>
 * var img0;
 * var img1;
 *
 * function preload() {
 *   img0 = loadImage("assets/rockies.jpg");
 *   img1 = loadImage("assets/bricks_third.jpg");
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, DARKEST);
 * }
 * </code></div>
 * <div><code>
 * var img0;
 * var img1;
 *
 * function preload() {
 *   img0 = loadImage("assets/rockies.jpg");
 *   img1 = loadImage("assets/bricks_third.jpg");
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, ADD);
 * }
 * </code></div>
 */
p5.prototype.blend = function() {
  this._graphics.blend.apply(this._graphics, arguments);
};

/**
 * Copies a region of the canvas to another region of the canvas
 * and copies a region of pixels from an image used as the srcImg parameter
 * into the canvas srcImage is specified this is used as the source. If
 * the source and destination regions aren't the same size, it will
 * automatically resize source pixels to fit the specified
 * target region.
 *
 * @method copy
 * @param  {p5.Image|undefined} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 *
 * @example
 * <div><code>
 * var img;
 *
 * function preload() {
 *   img = loadImage("assets/rockies.jpg");
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   copy(7, 22, 10, 10, 35, 25, 50, 50);
 *   stroke(255);
 *   noFill();
 *   // Rectangle shows area being copied
 *   rect(7, 22, 10, 10);
 * }
 * </code></div>
 */
p5.prototype.copy = function () {
  p5.Renderer2D._copyHelper.apply(this, arguments);
};

/**
 * Applies a filter to the canvas.
 * <br><br>
 *
 * The presets options are:
 * <br><br>
 *
 * THRESHOLD
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 * <br><br>
 *
 * GRAY
 * Converts any colors in the image to grayscale equivalents. No parameter
 * is used.
 * <br><br>
 *
 * OPAQUE
 * Sets the alpha channel to entirely opaque. No parameter is used.
 * <br><br>
 *
 * INVERT
 * Sets each pixel to its inverse value. No parameter is used.
 * <br><br>
 *
 * POSTERIZE
 * Limits each channel of the image to the number of colors specified as the
 * parameter. The parameter can be set to values between 2 and 255, but
 * results are most noticeable in the lower ranges.
 * <br><br>
 *
 * BLUR
 * Executes a Guassian blur with the level parameter specifying the extent
 * of the blurring. If no parameter is used, the blur is equivalent to
 * Guassian blur of radius 1. Larger values increase the blur.
 * <br><br>
 *
 * ERODE
 * Reduces the light areas. No parameter is used.
 * <br><br>
 *
 * DILATE
 * Increases the light areas. No parameter is used.
 *
 * @method filter
 * @param  {String}    kind
 *
 * @param  {Number|undefined} param
 *
 *
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(THRESHOLD);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(GRAY);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(OPAQUE);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(INVERT);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(POSTERIZE,3);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(DILATE);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(BLUR,3);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *  image(img, 0, 0);
 *  filter(ERODE);
 * }
 * </code>
 * </div>
 */
p5.prototype.filter = function(operation, value) {
  Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
};

/**
 * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
 * an image. If no parameters are specified, the entire image is returned.
 * Use the x and y parameters to get the value of one pixel. Get a section of
 * the display window by specifying additional w and h parameters. When
 * getting an image, the x and y parameters define the coordinates for the
 * upper-left corner of the image, regardless of the current imageMode().
 *
 * If the pixel requested is outside of the image window, [0,0,0,255] is
 * returned. To get the numbers scaled according to the current color ranges
 * and taking into account colorMode, use getColor instead of get.
 *
 * Getting the color of a single pixel with get(x, y) is easy, but not as fast
 * as grabbing the data directly from pixels[]. The equivalent statement to
 * get(x, y) using pixels[] with pixel density d is
 * [pixels[(y*width*d+x)*d],
 * pixels[(y*width*d+x)*d+1],
 * pixels[(y*width*d+x)*d+2],
 * pixels[(y*width*d+x)*d+3] ].
 * See the reference for pixels[] for more information.
 *
 * @method get
 * @param  {Number}         [x] x-coordinate of the pixel
 * @param  {Number}         [y] y-coordinate of the pixel
 * @param  {Number}         [w] width
 * @param  {Number}         [h] height
 * @return {Array|p5.Image}     values of pixel at x,y in array format
 *                              [R, G, B, A] or p5.Image
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/rockies.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   var c = get();
 *   image(c, width/2, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/rockies.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   var c = get(50, 90);
 *   fill(c);
 *   noStroke();
 *   rect(25, 25, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.get = function(x, y, w, h){
  return this._graphics.get(x, y, w, h);
};

/**
 * Loads the pixel data for the display window into the pixels[] array. This
 * function must always be called before reading from or writing to pixels[].
 *
 * @method loadPixels
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/rockies.jpg");
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   var d = pixelDensity;
 *   var halfImage = 4 * (img.width * d) *
       (img.height/2 * d);
 *   loadPixels();
 *   for (var i = 0; i < halfImage; i++) {
 *     pixels[i+halfImage] = pixels[i];
 *   }
 *   updatePixels();
 * }
 * </code>
 * </div>
 */
p5.prototype.loadPixels = function() {
  this._graphics.loadPixels();
};

/**
 * <p>Changes the color of any pixel, or writes an image directly to the
 * display window.</p>
 * <p>The x and y parameters specify the pixel to change and the c parameter
 * specifies the color value. This can be a p5.COlor object, or [R, G, B, A]
 * pixel array. It can also be a single grayscale value.
 * When setting an image, the x and y parameters define the coordinates for
 * the upper-left corner of the image, regardless of the current imageMode().
 * </p>
 * <p>
 * After using set(), you must call updatePixels() for your changes to
 * appear.  This should be called once all pixels have been set.
 * </p>
 * <p>Setting the color of a single pixel with set(x, y) is easy, but not as
 * fast as putting the data directly into pixels[]. Setting the pixels[]
 * values directly may be complicated when working with a retina display,
 * but will perform better when lots of pixels need to be set directly on
 * every loop.</p>
 * <p>See the reference for pixels[] for more information.</p>
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel
 * @param {Number}              y y-coordinate of the pixel
 * @param {Number|Array|Object} c insert a grayscale value | a pixel array |
 *                                a p5.Color object | a p5.Image to copy
 * @example
 * <div>
 * <code>
 * var black = color(0);
 * set(30, 20, black);
 * set(85, 20, black);
 * set(85, 75, black);
 * set(30, 75, black);
 * updatePixels();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * for (var i = 30; i < width-15; i++) {
 *   for (var j = 20; j < height-25; j++) {
 *     var c = color(204-j, 153-i, 0);
 *     set(i, j, c);
 *   }
 * }
 * updatePixels();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/rockies.jpg");
 * }
 *
 * function setup() {
 *   set(0, 0, img);
 *   updatePixels();
 *   line(0, 0, width, height);
 *   line(0, height, width, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.set = function (x, y, imgOrCol) {
  this._graphics.set(x, y, imgOrCol);
};
/**
 * Updates the display window with the data in the pixels[] array.
 * Use in conjunction with loadPixels(). If you're only reading pixels from
 * the array, there's no need to call updatePixels() — updating is only
 * necessary to apply changes. updatePixels() should be called anytime the
 * pixels array is manipulated or set() is called.
 *
 * @method updatePixels
 * @param  {Number} [x]    x-coordinate of the upper-left corner of region
 *                         to update
 * @param  {Number} [y]    y-coordinate of the upper-left corner of region
 *                         to update
 * @param  {Number} [w]    width of region to update
 * @param  {Number} [w]    height of region to update
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/rockies.jpg");
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   var halfImage = 4 * (img.width * pixelDensity) *
 *     (img.height * pixelDensity/2);
 *   loadPixels();
 *   for (var i = 0; i < halfImage; i++) {
 *     pixels[i+halfImage] = pixels[i];
 *   }
 *   updatePixels();
 * }
 * </code>
 * </div>
 */
p5.prototype.updatePixels = function (x, y, w, h) {
  this._graphics.updatePixels(x, y, w, h);
};

module.exports = p5;

},{"../color/p5.Color":10,"../core/core":16,"./filters":33}],38:[function(require,module,exports){
/* global opentype:false */

/**
 * @module IO
 * @submodule Input
 * @for p5
 * @requires core
 * @requires reqwest
 */

'use strict';

var p5 = require('../core/core');
var reqwest = require('reqwest');
require('../core/error_helpers');


/**
 * Loads an opentype font file (.otf, .ttf) from a file or a URL,
 * and returns a PFont Object. This method is asynchronous,
 * meaning it may not finish before the next line in your sketch
 * is executed.
 *
 * @method loadFont
 * @param  {String}        path       name of the file or url to load
 * @param  {Function}      [callback] function to be executed after
 *                                    loadFont()
 *                                    completes
 * @return {Object}                   p5.Font object
 * @example
 *
 * <p>Calling loadFont() inside preload() guarantees to complete the
 * operation before setup() and draw() are called.</p>
 *
 * <div><code>
 * var myFont;
 * function preload() {
 *   myFont = loadFont('assets/AvenirNextLTPro-Demi.otf');
 * }
 *
 * function setup() {
 *   fill('#ED225D');
 *   textFont(myFont);
 *   textSize(36);
 *   text('p5*js', 10, 50);
 * }
 * </code></div>
 *
 * <p>Outside preload(), you may supply a callback function to handle the
 * object:</p>
 *
 * <div><code>
 * function setup() {
 *   loadFont('assets/AvenirNextLTPro-Demi.otf', drawText);
 * }
 *
 * function drawText(font) {
 *   fill('#ED225D');
 *   textFont(font, 36);
 *   text('p5*js', 10, 50);
 * }
 * function draw(){
 * }
 * </code></div>
 *
 */




p5.prototype.loadFont = function(path, callback) {

  var p5Font = new p5.Font(this);

  opentype.load(path, function(err, font) {
    if (err) {
      throw Error(err);
    }
    p5Font.font = font;
    if (typeof callback !== 'undefined') {
      callback(p5Font);
    }
  });

  return p5Font;
};


//BufferedReader
p5.prototype.createInput = function() {
  // TODO
  throw 'not yet implemented';
};

p5.prototype.createReader = function() {
  // TODO
  throw 'not yet implemented';
};

p5.prototype.loadBytes = function() {
  // TODO
  throw 'not yet implemented';
};

/**
 * Loads a JSON file from a file or a URL, and returns an Object or Array.
 * This method is asynchronous, meaning it may not finish before the next
 * line in your sketch is executed.
 *
 * @method loadJSON
 * @param  {String}        path       name of the file or url to load
 * @param  {Function}      [callback] function to be executed after
 *                                    loadJSON()
 *                                    completes, Array is passed in as first
 *                                    argument
 * @param  {String}        [datatype] "json" or "jsonp"
 * @return {Object|Array}             JSON data
 * @example
 *
 * <p>Calling loadJSON() inside preload() guarantees to complete the
 * operation before setup() and draw() are called.</p>
 *
 * <div><code>
 * var weather;
 * function preload() {
 *   var url = 'http://api.openweathermap.org/data/2.5/weather?q=London,UK';
 *   weather = loadJSON(url);
 * }
 *
 * function setup() {
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(200);
 *   // get the humidity value out of the loaded JSON
 *   var humidity = weather.main.humidity;
 *   fill(0, humidity); // use the humidity value to set the alpha
 *   ellipse(width/2, height/2, 50, 50);
 * }
 * </code></div>
 *
 * <p>Outside preload(), you may supply a callback function to handle the
 * object:</p>

 * <div><code>
 * function setup() {
 *   noLoop();
 *   var url = 'http://api.openweathermap.org/data/2.5/weather?q=NewYork,USA';
 *   loadJSON(url, drawWeather);
 * }
 *
 * function draw() {
 *   background(200);
 * }
 *
 * function drawWeather(weather) {
 *   // get the humidity value out of the loaded JSON
 *   var humidity = weather.main.humidity;
 *   fill(0, humidity); // use the humidity value to set the alpha
 *   ellipse(width/2, height/2, 50, 50);
 * }
 * </code></div>
 *
 */
p5.prototype.loadJSON = function() {
  var path = arguments[0];
  var callback = arguments[1];
  var ret = []; // array needed for preload
  // assume jsonp for URLs
  var t = 'json'; //= path.indexOf('http') === -1 ? 'json' : 'jsonp';

  // check for explicit data type argument
  if (typeof arguments[2] === 'string'){
    if (arguments[2] === 'jsonp' || arguments[2] === 'json') {
      t = arguments[2];
    }
  }

  reqwest({url: path, type: t, crossOrigin: true})
    .then(function(resp) {
      for (var k in resp) {
        ret[k] = resp[k];
      }
      if (typeof callback !== 'undefined') {
        callback(resp);
      }
    });
  return ret;
};

/**
 * Reads the contents of a file and creates a String array of its individual
 * lines. If the name of the file is used as the parameter, as in the above
 * example, the file must be located in the sketch directory/folder.
 *
 * Alternatively, the file maybe be loaded from anywhere on the local
 * computer using an absolute path (something that starts with / on Unix and
 * Linux, or a drive letter on Windows), or the filename parameter can be a
 * URL for a file found on a network.
 *
 * This method is asynchronous, meaning it may not finish before the next
 * line in your sketch is executed.
 *
 * @method loadStrings
 * @param  {String}   filename   name of the file or url to load
 * @param  {Function} [callback] function to be executed after loadStrings()
 *                               completes, Array is passed in as first
 *                               argument
 * @return {Array}               Array of Strings
 * @example
 *
 * <p>Calling loadStrings() inside preload() guarantees to complete the
 * operation before setup() and draw() are called.</p>
 *
 * <div><code>
 * var result;
 * function preload() {
 *   result = loadStrings('assets/test.txt');
 * }

 * function setup() {
 *   background(200);
 *   var ind = floor(random(result.length));
 *   text(result[ind], 10, 10, 80, 80);
 * }
 * </code></div>
 *
 * <p>Outside preload(), you may supply a callback function to handle the
 * object:</p>
 *
 * <div><code>
 * function setup() {
 *   loadStrings('assets/test.txt', pickString);
 * }
 *
 * function pickString(result) {
 *   background(200);
 *   var ind = floor(random(result.length));
 *   text(result[ind], 10, 10, 80, 80);
 * }
 * </code></div>
 */
p5.prototype.loadStrings = function (path, callback) {
  var ret = [];
  var req = new XMLHttpRequest();
  req.open('GET', path, true);
  req.onreadystatechange = function () {
    if (req.readyState === 4 && (req.status === 200 )) {
      var arr = req.responseText.match(/[^\r\n]+/g);
      for (var k in arr) {
        ret[k] = arr[k];
      }
      if (typeof callback !== 'undefined') {
        callback(ret);
      }
    }
    else{
      p5._friendlyFileLoadError(3,path);
    }
  };
  req.send(null);
  return ret;
};

/**
 * <p>Reads the contents of a file or URL and creates a p5.Table object with
 * its values. If a file is specified, it must be located in the sketch's
 * "data" folder. The filename parameter can also be a URL to a file found
 * online. By default, the file is assumed to be comma-separated (in CSV
 * format). Table only looks for a header row if the 'header' option is
 * included.</p>
 *
 * <p>Possible options include:
 * <ul>
 * <li>csv - parse the table as comma-separated values</li>
 * <li>tsv - parse the table as tab-separated values</li>
 * <li>header - this table has a header (title) row</li>
 * </ul>
 * </p>
 *
 * <p>When passing in multiple options, pass them in as separate parameters,
 * seperated by commas. For example:
 * <br><br>
 * <code>
 *   loadTable("my_csv_file.csv", "csv", "header")
 * </code>
 * </p>
 *
 * <p> All files loaded and saved use UTF-8 encoding.</p>
 *
 * <p>This method is asynchronous, meaning it may not finish before the next
 * line in your sketch is executed. Calling loadTable() inside preload()
 * guarantees to complete the operation before setup() and draw() are called.
 * Outside preload(), you may supply a callback function to handle the object.
 * </p>
 *
 * @method loadTable
 * @param  {String}         filename   name of the file or URL to load
 * @param  {String|Strings} [options]  "header" "csv" "tsv"
 * @param  {Function}       [callback] function to be executed after
 *                                     loadTable() completes, Table object is
 *                                     passed in as first argument
 * @return {Object}                    Table object containing data
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the following CSV file called "mammals.csv"
 * // located in the project's "assets" folder:
 * //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	*   //the file can be remote
	*   //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
	*   //                  "csv", "header");
	* }
	*
	* function setup() {
	*   //count the columns
	*   print(table.getRowCount() + " total rows in table");
	*   print(table.getColumnCount() + " total columns in table");
	*
	*   print(table.getColumn("name"));
	*   //["Goat", "Leopard", "Zebra"]
	*
	*   //cycle through the table
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++) {
	*       print(table.getString(r, c));
	*     }
	* }
	* </code>
	* </div>
 */
p5.prototype.loadTable = function (path) {
  var callback = null;
  var options = [];
  var header = false;
  var sep = ',';
  var separatorSet = false;
  for (var i = 1; i < arguments.length; i++) {
    if (typeof(arguments[i]) === 'function' ){
      callback = arguments[i];
    }
    else if (typeof(arguments[i]) === 'string') {
      options.push(arguments[i]);
      if (arguments[i] === 'header') {
        header = true;
      }
      if (arguments[i] === 'csv') {
        if (separatorSet) {
          throw new Error('Cannot set multiple separator types.');
        }
        else {
          sep = ',';
          separatorSet = true;
        }
      }
      else if (arguments[i] === 'tsv') {
        if (separatorSet) {
          throw new Error('Cannot set multiple separator types.');
        }
        else {
          sep = '\t';
          separatorSet = true;
        }
      }
    }
  }

  var t = new p5.Table();
  reqwest({url: path, crossOrigin: true, type: 'csv'})
    .then(function(resp) {
      resp = resp.responseText;

      var state = {};

      // define constants
      var PRE_TOKEN = 0,
          MID_TOKEN = 1,
          POST_TOKEN = 2,
          POST_RECORD = 4;

      var QUOTE = '\"',
             CR = '\r',
             LF = '\n';

      var records = [];
      var offset = 0;
      var currentRecord = null;
      var currentChar;

      var recordBegin = function () {
        state.escaped = false;
        currentRecord = [];
        tokenBegin();
      };

      var recordEnd = function () {
        state.currentState = POST_RECORD;
        records.push(currentRecord);
        currentRecord = null;
      };

      var tokenBegin = function() {
        state.currentState = PRE_TOKEN;
        state.token = '';
      };

      var tokenEnd = function() {
        currentRecord.push(state.token);
        tokenBegin();
      };

      while(true) {
        currentChar = resp[offset++];

        // EOF
        if(currentChar == null) {
          if (state.escaped) {
            throw new Error('Unclosed quote in file.');
          }
          if (currentRecord){
            tokenEnd();
            recordEnd();
            break;
          }
        }
        if(currentRecord === null) {
          recordBegin();
        }

        // Handle opening quote
        if (state.currentState === PRE_TOKEN) {
          if (currentChar === QUOTE) {
            state.escaped = true;
            state.currentState = MID_TOKEN;
            continue;
          }
          state.currentState = MID_TOKEN;
        }

        // mid-token and escaped, look for sequences and end quote
        if (state.currentState === MID_TOKEN && state.escaped) {
          if (currentChar === QUOTE) {
            if (resp[offset] === QUOTE) {
              state.token += QUOTE;
              offset++;
            }
            else {
              state.escaped = false;
              state.currentState = POST_TOKEN;
            }
          }
          else {
            state.token += currentChar;
          }
          continue;
        }


        // fall-through: mid-token or post-token, not escaped
        if (currentChar === CR ) {
          if( resp[offset] === LF  ) {
            offset++;
          }
          tokenEnd();
          recordEnd();
        }
        else if (currentChar === LF) {
          tokenEnd();
          recordEnd();
        }
        else if (currentChar === sep) {
          tokenEnd();
        }
        else if( state.currentState === MID_TOKEN ){
          state.token += currentChar;
        }
      }

      // set up column names
      if (header) {
        t.columns = records.shift();
      }
      else {
        for (i = 0; i < records.length; i++){
          t.columns[i] = i.toString();
        }
      }
      var row;
      for (i =0; i<records.length; i++) {
        //Handles row of 'undefined' at end of some CSVs
        if (i === records.length - 1 && records[i].length === 1) {
          if(records[i][0] === 'undefined'){
            break;
          }
        }
        row = new p5.TableRow();
        row.arr = records[i];
        row.obj = makeObject(records[i], t.columns);
        t.addRow(row);
      }
      if (callback !== null) {
        callback(t);
      }
    })
    .fail(function(err,msg){
      p5._friendlyFileLoadError(2,path);
      if (typeof callback !== 'undefined') {
        callback(false);
      }
    });

  return t;
};

// helper function to turn a row into a JSON object
function makeObject(row, headers) {
  var ret = {};
  headers = headers || [];
  if (typeof(headers) === 'undefined'){
    for (var j = 0; j < row.length; j++ ){
      headers[j.toString()] = j;
    }
  }
  for (var i = 0; i < headers.length; i++){
    var key = headers[i];
    var val = row[i];
    ret[key] = val;
  }
  return ret;
}

/**
 * Reads the contents of a file and creates an XML object with its values.
 * If the name of the file is used as the parameter, as in the above example,
 * the file must be located in the sketch directory/folder.
 *
 * Alternatively, the file maybe be loaded from anywhere on the local
 * computer using an absolute path (something that starts with / on Unix and
 * Linux, or a drive letter on Windows), or the filename parameter can be a
 * URL for a file found on a network.
 *
 * This method is asynchronous, meaning it may not finish before the next
 * line in your sketch is executed. Calling loadXML() inside preload()
 * guarantees to complete the operation before setup() and draw() are called.
 * Outside preload(), you may supply a callback function to handle the object.
 *
 * @method loadXML
 * @param  {String}   filename   name of the file or URL to load
 * @param  {Function} [callback] function to be executed after loadXML()
 *                               completes, XML object is passed in as
 *                               first argument
 * @return {Object}              XML object containing data
 */
p5.prototype.loadXML = function(path, callback) {
  var ret = document.implementation.createDocument(null, null);
  reqwest({
    url: path,
    type: 'xml',
    crossOrigin: true,
    error: function(err){
      p5._friendlyFileLoadError(1,path);
    }
  })
    .then(function(resp){
      var x = resp.documentElement;
      ret.appendChild(x);
      if (typeof callback !== 'undefined') {
        callback(resp);
      }
    });
  return ret;
};

// name clash with window.open
// p5.prototype.open = function() {
//   // TODO

// };

p5.prototype.parseXML = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.selectFolder = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.selectInput = function() {
  // TODO
  throw 'not yet implemented';

};

/**
 * Method for executing an HTTP GET request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text.
 *
 * @method httpGet
 * @param  {String}        path       name of the file or url to load
 * @param  {Object}        [data]     param data passed sent with request
 * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
 * @param  {Function}      [callback] function to be executed after
 *                                    httpGet() completes, data is passed in
 *                                    as first argument
 */
p5.prototype.httpGet = function () {
  var args = Array.prototype.slice.call(arguments);
  args.push('GET');
  p5.prototype.httpDo.apply(this, args);
};


/**
 * Method for executing an HTTP POST request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text.
 *
 * @method httpPost
 * @param  {String}        path       name of the file or url to load
 * @param  {Object}        [data]     param data passed sent with request
 * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
 * @param  {Function}      [callback] function to be executed after
 *                                    httpGet() completes, data is passed in
 *                                    as first argument
 */
p5.prototype.httpPost = function () {
  var args = Array.prototype.slice.call(arguments);
  args.push('POST');
  p5.prototype.httpDo.apply(this, args);
};

/**
 * Method for executing an HTTP request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text.
 *
 * @method httpDo
 * @param  {String}        path       name of the file or url to load
 * @param  {String}        [method]   either "GET", "POST", or "PUT",
 *                                    defaults to "GET"
 * @param  {Object}        [data]     param data passed sent with request
 * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
 * @param  {Function}      [callback] function to be executed after
 *                                    httpGet() completes, data is passed in
 *                                    as first argument
 */
p5.prototype.httpDo = function() {
  var method = 'GET';
  var path = arguments[0];
  var data = {};
  var type = '';
  var callback;

  for (var i=1; i<arguments.length; i++) {
    var a = arguments[i];
    if (typeof a === 'string') {
      if (a === 'GET' || a === 'POST' || a === 'PUT') {
        method = a;
      } else {
        type = a;
      }
    } else if (typeof a === 'object') {
      data = a;
    } else if (typeof a === 'function') {
      callback = a;
    }
  }

  // do some sort of smart type checking
  if (type === '') {
    if (path.indexOf('json') !== -1) {
      type = 'json';
    } else if (path.indexOf('xml') !== -1) {
      type = 'xml';
    } else {
      type = 'text';
    }
  }

  reqwest({
    url: path,
    method: method,
    data: data,
    type: type,
    crossOrigin: true,
    success: function (resp) {
      if (typeof callback !== 'undefined') {
        if (type === 'text') {
          callback(resp.response);
        } else {
          callback(resp);
        }
      }
    }
  });
};


/**
 * @module IO
 * @submodule Output
 * @for p5
 */

window.URL = window.URL || window.webkitURL;

// private array of p5.PrintWriter objects
p5.prototype._pWriters = [];

p5.prototype.beginRaw = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.beginRecord = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.createOutput = function() {
  // TODO

  throw 'not yet implemented';
};

p5.prototype.createWriter  = function(name, extension) {
  var newPW;
  // check that it doesn't already exist
  for (var i in p5.prototype._pWriters) {
    if (p5.prototype._pWriters[i].name === name) {
      // if a p5.PrintWriter w/ this name already exists...
      // return p5.prototype._pWriters[i]; // return it w/ contents intact.
      // or, could return a new, empty one with a unique name:
      newPW = new p5.PrintWriter(name + window.millis(), extension);
      p5.prototype._pWriters.push( newPW );
      return newPW;
    }
  }
  newPW = new p5.PrintWriter(name, extension);
  p5.prototype._pWriters.push( newPW );
  return newPW;
};

p5.prototype.endRaw = function() {
  // TODO

  throw 'not yet implemented';
};

p5.prototype.endRecord  = function() {
  // TODO
  throw 'not yet implemented';

};

p5.PrintWriter = function(filename, extension) {
  var self = this;
  this.name = filename;
  this.content = '';
  this.print = function(data) { this.content += data; };
  this.println = function(data) { this.content += data + '\n'; };
  this.flush = function() { this.content = ''; };
  this.close = function() {
    // convert String to Array for the writeFile Blob
    var arr = [];
    arr.push(this.content);
    p5.prototype.writeFile(arr, filename, extension);
    // remove from _pWriters array and delete self
    for (var i in p5.prototype._pWriters) {
      if (p5.prototype._pWriters[i].name === this.name) {
        // remove from _pWriters array
        p5.prototype._pWriters.splice(i, 1);
      }
    }
    self.flush();
    self = {};
  };
};

p5.prototype.saveBytes = function() {
  // TODO
  throw 'not yet implemented';

};

// object, filename, options --> saveJSON, saveStrings, saveTable
// filename, [extension] [canvas] --> saveImage

/**
 *  <p>Save an image, text, json, csv, wav, or html. Prompts download to
 *  the client's computer. <b>Note that it is not recommended to call save()
 *  within draw if it's looping, as the save() function will open a new save
 *  dialog every frame.</b></p>
 *  <p>The default behavior is to save the canvas as an image. You can
 *  optionally specify a filename.
 *  For example:</p>
 *  <pre class='language-javascript'><code>
 *  save();
 *  save('myCanvas.jpg'); // save a specific canvas with a filename
 *  </code></pre>
 *
 *  <p>Alternately, the first parameter can be a pointer to a canvas
 *  p5.Element, an Array of Strings,
 *  an Array of JSON, a JSON object, a p5.Table, a p5.Image, or a
 *  p5.SoundFile (requires p5.sound). The second parameter is a filename
 *  (including extension). The third parameter is for options specific
 *  to this type of object. This method will save a file that fits the
 *  given paramaters. For example:</p>
 *
 *  <pre class='language-javascript'><code>
 *
 *  save('myCanvas.jpg');           // Saves canvas as an image
 *
 *  var cnv = createCanvas(100, 100);
 *  save(cnv, 'myCanvas.jpg');      // Saves canvas as an image
 *
 *  var gb = createGraphics(100, 100);
 *  save(gb, 'myGraphics.jpg');      // Saves p5.Renderer object as an image
 *
 *  save(myTable, 'myTable.html');  // Saves table as html file
 *  save(myTable, 'myTable.csv',);  // Comma Separated Values
 *  save(myTable, 'myTable.tsv');   // Tab Separated Values
 *
 *  save(myJSON, 'my.json');        // Saves pretty JSON
 *  save(myJSON, 'my.json', true);  // Optimizes JSON filesize
 *
 *  save(img, 'my.png');            // Saves pImage as a png image
 *
 *  save(arrayOfStrings, 'my.txt'); // Saves strings to a text file with line
 *                                  // breaks after each item in the array
 *  </code></pre>
 *
 *  @method save
 *  @param  {[Object|String]} objectOrFilename  If filename is provided, will
 *                                             save canvas as an image with
 *                                             either png or jpg extension
 *                                             depending on the filename.
 *                                             If object is provided, will
 *                                             save depending on the object
 *                                             and filename (see examples
 *                                             above).
 *  @param  {[String]} filename If an object is provided as the first
 *                               parameter, then the second parameter
 *                               indicates the filename,
 *                               and should include an appropriate
 *                               file extension (see examples above).
 *  @param  {[Boolean/String]} options  Additional options depend on
 *                            filetype. For example, when saving JSON,
 *                            <code>true</code> indicates that the
 *                            output will be optimized for filesize,
 *                            rather than readability.
 */
p5.prototype.save = function(object, _filename, _options) {
  // parse the arguments and figure out which things we are saving
  var args = arguments;
  // =================================================
  // OPTION 1: saveCanvas...

  // if no arguments are provided, save canvas
  var cnv = this._curElement.elt;
  if (args.length === 0) {
    p5.prototype.saveCanvas(cnv);
    return;
  }
  // otherwise, parse the arguments

  // if first param is a p5Graphics, then saveCanvas
  else if (args[0] instanceof p5.Renderer) {
    p5.prototype.saveCanvas(args[0].elt, args[1], args[2]);
    return;
  }

  // if 1st param is String and only one arg, assume it is canvas filename
  else if (args.length === 1 && typeof(args[0]) === 'string') {
    p5.prototype.saveCanvas(cnv, args[0]);
  }

  // =================================================
  // OPTION 2: extension clarifies saveStrings vs. saveJSON

  else {
    var extension = _checkFileExtension(args[1], args[2])[1];
    switch(extension){
    case 'json':
      p5.prototype.saveJSON(args[0], args[1], args[2]);
      return;
    case 'txt':
      p5.prototype.saveStrings(args[0], args[1], args[2]);
      return;
    // =================================================
    // OPTION 3: decide based on object...
    default:
      if (args[0] instanceof Array) {
        p5.prototype.saveStrings(args[0], args[1], args[2]);
      }
      else if (args[0] instanceof p5.Table) {
        p5.prototype.saveTable(args[0], args[1], args[2], args[3]);
      }
      else if (args[0] instanceof p5.Image) {
        p5.prototype.saveCanvas(args[0].canvas, args[1]);
      }
      else if (args[0] instanceof p5.SoundFile) {
        p5.prototype.saveSound(args[0], args[1], args[2], args[3]);
      }
    }
  }
};

/**
 *  Writes the contents of an Array or a JSON object to a .json file.
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveJSON
 *  @param  {Array|Object} json
 *  @param  {String} filename
 *  @param  {Boolean} [optimize]   If true, removes line breaks
 *                                 and spaces from the output
 *                                 file to optimize filesize
 *                                 (but not readability).
 *  @example
 *  <div><code>
 *  var json;
 *
 *  function setup() {
 *
 *    json = {}; // new JSON Object
 *
 *    json.id = 0;
 *    json.species = 'Panthera leo';
 *    json.name = 'Lion';
 *
 *  // To save, un-comment the line below, then click 'run'
 *  // saveJSONObject(json, 'lion.json');
 *  }
 *
 *  // Saves the following to a file called "lion.json":
 *  // {
 *  //   "id": 0,
 *  //   "species": "Panthera leo",
 *  //   "name": "Lion"
 *  // }
 *  </div></code>
 */
p5.prototype.saveJSON = function(json, filename, opt) {
  var stringify;
  if (opt){
    stringify = JSON.stringify( json );
  } else {
    stringify = JSON.stringify( json, undefined, 2);
  }
  console.log(stringify);
  this.saveStrings(stringify.split('\n'), filename, 'json');
};

p5.prototype.saveJSONObject = p5.prototype.saveJSON;
p5.prototype.saveJSONArray = p5.prototype.saveJSON;

p5.prototype.saveStream = function() {
  // TODO
  throw 'not yet implemented';

};

/**
 *  Writes an array of Strings to a text file, one line per String.
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveStrings
 *  @param  {Array} list      string array to be written
 *  @param  {String} filename filename for output
 *  @example
 *  <div><code>
 *  var words = 'apple bear cat dog';
 *
 *  // .split() outputs an Array
 *  var list = split(words, ' ');
 *
 *  // To save the file, un-comment next line and click 'run'
 *  // saveStrings(list, 'nouns.txt');
 *
 *  // Saves the following to a file called 'nouns.txt':
 *  //
 *  // apple
 *  // bear
 *  // cat
 *  // dog
 *  </code></div>
 */
p5.prototype.saveStrings = function(list, filename, extension) {
  var ext = extension || 'txt';
  var pWriter = this.createWriter(filename, ext);
  for (var i in list) {
    if (i < list.length - 1) {
      pWriter.println(list[i]);
    } else {
      pWriter.print(list[i]);
    }
  }
  pWriter.close();
  pWriter.flush();
};

p5.prototype.saveXML = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.selectOutput = function() {
  // TODO
  throw 'not yet implemented';

};

// =======
// HELPERS
// =======

function escapeHelper(content) {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 *  Writes the contents of a Table object to a file. Defaults to a
 *  text file with comma-separated-values ('csv') but can also
 *  use tab separation ('tsv'), or generate an HTML table ('html').
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveTable
 *  @param  {p5.Table} Table  the Table object to save to a file
 *  @param  {String} filename the filename to which the Table should be saved
 *  @param  {[String]} options  can be one of "tsv", "csv", or "html"
 *  @example
 *  <div><code>
 *  var table;
 *
 *  function setup() {
 *    table = new p5.Table();
 *
 *    table.addColumn('id');
 *    table.addColumn('species');
 *    table.addColumn('name');
 *
 *    var newRow = table.addRow();
 *    newRow.setNum('id', table.getRowCount() - 1);
 *    newRow.setString('species', 'Panthera leo');
 *    newRow.setString('name', 'Lion');
 *
 *    // To save, un-comment next line then click 'run'
 *    // saveTable(table, 'new.csv');
 *    }
 *
 *    // Saves the following to a file called 'new.csv':
 *    // id,species,name
 *    // 0,Panthera leo,Lion
 *  </code></div>
 */
p5.prototype.saveTable = function(table, filename, options) {
  var pWriter = this.createWriter(filename, options);

  var header = table.columns;

  var sep = ','; // default to CSV
  if (options === 'tsv') {
    sep = '\t';
  }
  if (options !== 'html') {
    // make header if it has values
    if (header[0] !== '0') {
      for (var h = 0; h < header.length; h++ ) {
        if (h < header.length - 1){
          pWriter.print(header[h] + sep);
        } else {
          pWriter.println(header[h]);
        }
      }
    }

    // make rows
    for (var i = 0; i < table.rows.length; i++ ) {
      var j;
      for (j = 0; j < table.rows[i].arr.length; j++) {
        if (j < table.rows[i].arr.length - 1) {
          pWriter.print(table.rows[i].arr[j] + sep);
        }
        else if (i < table.rows.length - 1) {
          pWriter.println(table.rows[i].arr[j]);
        } else {
          pWriter.print(table.rows[i].arr[j]); // no line break
        }
      }
    }
  }

  // otherwise, make HTML
  else {
    pWriter.println('<html>');
    pWriter.println('<head>');
    var str = '  <meta http-equiv=\"content-type\" content';
    str += '=\"text/html;charset=utf-8\" />';
    pWriter.println(str);
    pWriter.println('</head>');

    pWriter.println('<body>');
    pWriter.println('  <table>');

    // make header if it has values
    if (header[0] !== '0') {
      pWriter.println('    <tr>');
      for (var k = 0; k < header.length; k++ ) {
        var e = escapeHelper(header[k]);
        pWriter.println('      <td>' +e);
        pWriter.println('      </td>');
      }
      pWriter.println('    </tr>');
    }

    // make rows
    for (var row = 0; row < table.rows.length; row++) {
      pWriter.println('    <tr>');
      for (var col = 0; col < table.columns.length; col++) {
        var entry = table.rows[row].getString(col);
        var htmlEntry = escapeHelper(entry);
        pWriter.println('      <td>' +htmlEntry);
        pWriter.println('      </td>');
      }
      pWriter.println('    </tr>');
    }
    pWriter.println('  </table>');
    pWriter.println('</body>');
    pWriter.print('</html>');
  }
  // close and flush the pWriter
  pWriter.close();
  pWriter.flush();
}; // end saveTable()

/**
 *  Generate a blob of file data as a url to prepare for download.
 *  Accepts an array of data, a filename, and an extension (optional).
 *  This is a private function because it does not do any formatting,
 *  but it is used by saveStrings, saveJSON, saveTable etc.
 *
 *  @param  {Array} dataToDownload
 *  @param  {String} filename
 *  @param  {[String]} extension
 *  @private
 */
p5.prototype.writeFile = function(dataToDownload, filename, extension) {
  var type = 'application\/octet-stream';
  if (p5.prototype._isSafari() ) {
    type = 'text\/plain';
  }
  var blob = new Blob(dataToDownload, {'type': type});
  var href = window.URL.createObjectURL(blob);
  p5.prototype.downloadFile(href, filename, extension);
};

/**
 *  Forces download. Accepts a url to filedata/blob, a filename,
 *  and an extension (optional).
 *  This is a private function because it does not do any formatting,
 *  but it is used by saveStrings, saveJSON, saveTable etc.
 *
 *  @param  {String} href      i.e. an href generated by createObjectURL
 *  @param  {[String]} filename
 *  @param  {[String]} extension
 */
p5.prototype.downloadFile = function(href, fName, extension) {
  var fx = _checkFileExtension(fName, extension);
  var filename = fx[0];
  var ext = fx[1];

  var a = document.createElement('a');
  a.href = href;
  a.download = filename;

  // Firefox requires the link to be added to the DOM before click()
  a.onclick = destroyClickedElement;
  a.style.display = 'none';
  document.body.appendChild(a);

  // Safari will open this file in the same page as a confusing Blob.
  if (p5.prototype._isSafari() ) {
    var aText = 'Hello, Safari user! To download this file...\n';
    aText += '1. Go to File --> Save As.\n';
    aText += '2. Choose "Page Source" as the Format.\n';
    aText += '3. Name it with this extension: .\"' + ext+'\"';
    alert(aText);
  }
  a.click();
  href = null;
};

/**
 *  Returns a file extension, or another string
 *  if the provided parameter has no extension.
 *
 *  @param   {String} filename
 *  @return  {Array} [fileName, fileExtension]
 *
 *  @private
 */
function _checkFileExtension(filename, extension) {
  if (!extension || extension === true || extension === 'true') {
    extension = '';
  }
  if (!filename) {
    filename = 'untitled';
  }
  var ext = '';
  // make sure the file will have a name, see if filename needs extension
  if (filename && filename.indexOf('.') > -1) {
    ext = filename.split('.').pop();
  }
  // append extension if it doesn't exist
  if (extension) {
    if (ext !== extension) {
      ext = extension;
      filename = filename + '.' + ext;
    }
  }
  return [filename, ext];
}
p5.prototype._checkFileExtension = _checkFileExtension;

/**
 *  Returns true if the browser is Safari, false if not.
 *  Safari makes trouble for downloading files.
 *
 *  @return  {Boolean} [description]
 *  @private
 */
p5.prototype._isSafari = function() {
  var x = Object.prototype.toString.call(window.HTMLElement);
  return x.indexOf('Constructor') > 0;
};

/**
 *  Helper function, a callback for download that deletes
 *  an invisible anchor element from the DOM once the file
 *  has been automatically downloaded.
 *
 *  @private
 */
function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

module.exports = p5;

},{"../core/core":16,"../core/error_helpers":19,"reqwest":1}],39:[function(require,module,exports){
/**
 * @module IO
 * @submodule Table
 * @requires core
 */

'use strict';

var p5 = require('../core/core');


/**
 *  Table Options
 *  <p>Generic class for handling tabular data, typically from a
 *  CSV, TSV, or other sort of spreadsheet file.</p>
 *  <p>CSV files are
 *  <a href="http://en.wikipedia.org/wiki/Comma-separated_values">
 *  comma separated values</a>, often with the data in quotes. TSV
 *  files use tabs as separators, and usually don't bother with the
 *  quotes.</p>
 *  <p>File names should end with .csv if they're comma separated.</p>
 *  <p>A rough "spec" for CSV can be found
 *  <a href="http://tools.ietf.org/html/rfc4180">here</a>.</p>
 *  <p>To load files, use the loadTable method.</p>
 *  <p>To save tables to your computer, use the save method
 *   or the saveTable method.</p>
 *
 *  Possible options include:
 *  <ul>
 *  <li>csv - parse the table as comma-separated values
 *  <li>tsv - parse the table as tab-separated values
 *  <li>header - this table has a header (title) row
 *  </ul>
 */

/**
 *  Table objects store data with multiple rows and columns, much
 *  like in a traditional spreadsheet. Tables can be generated from
 *  scratch, dynamically, or using data from an existing file.
 *
 *  @class p5.Table
 *  @constructor
 *  @param  {Array}     [rows] An array of p5.TableRow objects
 *  @return {p5.Table}         p5.Table generated
 */
p5.Table = function (rows) {
  /**
   *  @property columns
   *  @type {Array}
   */
  this.columns = [];

  /**
   *  @property rows
   *  @type {Array}
   */
  this.rows = [];
};

/**
 *  Use addRow() to add a new row of data to a p5.Table object. By default,
 *  an empty row is created. Typically, you would store a reference to
 *  the new row in a TableRow object (see newRow in the example above),
 *  and then set individual values using set().
 *
 *  If a p5.TableRow object is included as a parameter, then that row is
 *  duplicated and added to the table.
 *
 *  @method  addRow
 *  @param   {p5.TableRow} [row] row to be added to the table
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   //add a row
	*   var newRow = table.addRow();
	*   newRow.setString("id", table.getRowCount() - 1);
	*   newRow.setString("species", "Canis Lupus");
	*   newRow.setString("name", "Wolf");
	*
	*   //print the results
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++)
	*       print(table.getString(r, c));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.addRow = function(row) {
  // make sure it is a valid TableRow
  var r = row || new p5.TableRow();

  if (typeof(r.arr) === 'undefined' || typeof(r.obj) === 'undefined') {
    //r = new p5.prototype.TableRow(r);
    throw 'invalid TableRow: ' + r;
  }
  r.table = this;
  this.rows.push(r);
  return r;
};

/**
 * Removes a row from the table object.
 *
 * @method  removeRow
 * @param   {Number} id ID number of the row to remove
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   //remove the first row
	*   var r = table.removeRow(0);
	*
	*   //print the results
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++)
	*       print(table.getString(r, c));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.removeRow = function(id) {
  this.rows[id].table = null; // remove reference to table
  var chunk = this.rows.splice(id+1, this.rows.length);
  this.rows.pop();
  this.rows = this.rows.concat(chunk);
};


/**
 * Returns a reference to the specified p5.TableRow. The reference
 * can then be used to get and set values of the selected row.
 *
 * @method  getRow
 * @param  {Number}   rowID ID number of the row to get
 * @return {TableRow} p5.TableRow object
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   var row = table.getRow(1);
	*   //print it column by column
	*   //note: a row is an object, not an array
	*   for (var c = 0; c < table.getColumnCount(); c++)
	*     print(row.getString(c));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.getRow = function(r) {
  return this.rows[r];
};

/**
 *  Gets all rows from the table. Returns an array of p5.TableRows.
 *
 *  @method  getRows
 *  @return {Array}   Array of p5.TableRows
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   var rows = table.getRows();
	*
	*   //warning: rows is an array of objects
	*   for (var r = 0; r < rows.length; r++)
	*     rows[r].set("name", "Unicorn");
	*
	*   //print the results
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++)
	*       print(table.getString(r, c));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.getRows = function() {
  return this.rows;
};

/**
 *  Finds the first row in the Table that contains the value
 *  provided, and returns a reference to that row. Even if
 *  multiple rows are possible matches, only the first matching
 *  row is returned. The column to search may be specified by
 *  either its ID or title.
 *
 *  @method  findRow
 *  @param  {String} value  The value to match
 *  @param  {Number|String} column ID number or title of the
 *                                 column to search
 *  @return {TableRow}
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   //find the animal named zebra
	*   var row = table.findRow("Zebra", "name");
	*   //find the corresponding species
	*   print(row.getString("species"));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.findRow = function(value, column) {
  // try the Object
  if (typeof(column) === 'string') {
    for (var i = 0; i < this.rows.length; i++){
      if (this.rows[i].obj[column] === value) {
        return this.rows[i];
      }
    }
  }
  // try the Array
  else {
    for (var j = 0; j < this.rows.length; j++){
      if (this.rows[j].arr[column] === value) {
        return this.rows[j];
      }
    }
  }
  // otherwise...
  return null;
};

/**
 *  Finds the rows in the Table that contain the value
 *  provided, and returns references to those rows. Returns an
 *  Array, so for must be used to iterate through all the rows,
 *  as shown in the example above. The column to search may be
 *  specified by either its ID or title.
 *
 *  @method  findRows
 *  @param  {String} value  The value to match
 *  @param  {Number|String} column ID number or title of the
 *                                 column to search
 *  @return {Array}        An Array of TableRow objects
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   //add another goat
	*   var newRow = table.addRow();
	*   newRow.setString("id", table.getRowCount() - 1);
	*   newRow.setString("species", "Scape Goat");
	*   newRow.setString("name", "Goat");
	*
	*   //find the rows containing animals named Goat
	*   var rows = table.findRows("Goat", "name");
	*   print(rows.length + " Goats found");
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.findRows = function(value, column) {
  var ret = [];
  if (typeof(column) === 'string') {
    for (var i = 0; i < this.rows.length; i++){
      if (this.rows[i].obj[column] === value) {
        ret.push( this.rows[i] );
      }
    }
  }
  // try the Array
  else {
    for (var j = 0; j < this.rows.length; j++){
      if (this.rows[j].arr[column] === value) {
        ret.push( this.rows[j] );
      }
    }
  }
  return ret;
};

/**
 *  Finds the first row in the Table that matches the regular
 *  expression provided, and returns a reference to that row.
 *  Even if multiple rows are possible matches, only the first
 *  matching row is returned. The column to search may be
 *  specified by either its ID or title.
 *
 *  @method  matchRow
 *  @param  {String} regexp The regular expression to match
 *  @param  {String|Number} column The column ID (number) or
 *                                   title (string)
 *  @return {TableRow}        TableRow object
 */
p5.Table.prototype.matchRow = function(regexp, column) {
  if (typeof(column) === 'number') {
    for (var j = 0; j < this.rows.length; j++) {
      if ( this.rows[j].arr[column].match(regexp) ) {
        return this.rows[j];
      }
    }
  }

  else {
    for (var i = 0; i < this.rows.length; i++) {
      if ( this.rows[i].obj[column].match(regexp) ) {
        return this.rows[i];
      }
    }
  }
  return null;
};

/**
 *  Finds the first row in the Table that matches the regular
 *  expression provided, and returns a reference to that row.
 *  Even if multiple rows are possible matches, only the first
 *  matching row is returned. The column to search may be specified
 *  by either its ID or title.
 *
 *  @method  matchRows
 *  @param  {String} regexp The regular expression to match
 *  @param  {String|Number} [column] The column ID (number) or
 *                                   title (string)
 *  @return {Array}        An Array of TableRow objects
 */
p5.Table.prototype.matchRows = function(regexp, column) {
  var ret = [];
  if (typeof(column) === 'number') {
    for (var j = 0; j < this.rows.length; j++) {
      if ( this.rows[j].arr[column].match(regexp) ) {
        ret.push( this.rows[j] );
      }
    }
  }

  else {
    for (var i = 0; i < this.rows.length; i++) {
      if ( this.rows[i].obj[column].match(regexp) ) {
        ret.push( this.rows[i] );
      }
    }
  }
  return ret;
};


/**
 *  Retrieves all values in the specified column, and returns them
 *  as an array. The column may be specified by either its ID or title.
 *
 *  @method  getColumn
 *  @param  {String|Number} column String or Number of the column to return
 *  @return {Array}       Array of column values
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   //getColumn returns an array that can be printed directly
	*   print(table.getColumn("species"));
	*   //outputs ["Capra hircus", "Panthera pardus", "Equus zebra"]
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.getColumn = function(value) {
  var ret = [];
  if (typeof(value) === 'string'){
    for (var i = 0; i < this.rows.length; i++){
      ret.push (this.rows[i].obj[value]);
    }
  } else {
    for (var j = 0; j < this.rows.length; j++){
      ret.push (this.rows[j].arr[value]);
    }
  }
  return ret;
};

/**
 *  Removes all rows from a Table. While all rows are removed,
 *  columns and column titles are maintained.
 *
 *  @method  clearRows
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   table.clearRows();
	*   print(table.getRowCount() + " total rows in table");
	*   print(table.getColumnCount() + " total columns in table");
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.clearRows = function() {
  delete this.rows;
  this.rows = [];
};

/**
 *  Use addColumn() to add a new column to a Table object.
 *  Typically, you will want to specify a title, so the column
 *  may be easily referenced later by name. (If no title is
 *  specified, the new column's title will be null.)
 *
 *  @method  addColumn
 *  @param {String} [title] title of the given column
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   table.addColumn("carnivore");
	*   table.set(0, "carnivore", "no");
	*   table.set(1, "carnivore", "yes");
	*   table.set(2, "carnivore", "no");
	*
	*   //print the results
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++)
	*       print(table.getString(r, c));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.addColumn = function(title) {
  var t = title || null;
  this.columns.push(t);
};

/**
 *  Returns the total number of columns in a Table.
 *
 *  @return {Number} Number of columns in this table
 */
p5.Table.prototype.getColumnCount = function() {
  return this.columns.length;
};

/**
 *  Returns the total number of rows in a Table.
 *
 *  @method  getRowCount
 *  @return {Number} Number of rows in this table

 */
p5.Table.prototype.getRowCount = function() {
  return this.rows.length;
};

/**
 *  <p>Removes any of the specified characters (or "tokens").</p>
 *
 *  <p>If no column is specified, then the values in all columns and
 *  rows are processed. A specific column may be referenced by
 *  either its ID or title.</p>
 *
 *  @method  removeTokens
 *  @param  {String} chars  String listing characters to be removed
 *  @param  {String|Number} [column] Column ID (number)
 *                                   or name (string)
 */
p5.Table.prototype.removeTokens = function(chars, column) {
  var escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };
  var charArray = [];
  for (var i = 0; i < chars.length; i++) {
    charArray.push( escape( chars.charAt(i) ) );
  }
  var regex = new RegExp(charArray.join('|'), 'g');

  if (typeof(column) === 'undefined'){
    for (var c = 0; c < this.columns.length; c++) {
      for (var d = 0; d < this.rows.length; d++) {
        var s = this.rows[d].arr[c];
        s = s.replace(regex, '');
        this.rows[d].arr[c] = s;
        this.rows[d].obj[this.columns[c]] = s;
      }
    }
  }
  else if (typeof(column) === 'string'){
    for (var j = 0; j < this.rows.length; j++) {
      var val = this.rows[j].obj[column];
      val = val.replace(regex, '');
      this.rows[j].obj[column] = val;
      var pos = this.columns.indexOf(column);
      this.rows[j].arr[pos] = val;
    }
  }
  else {
    for (var k = 0; k < this.rows.length; k++) {
      var str = this.rows[k].arr[column];
      str = str.replace(regex, '');
      this.rows[k].arr[column] = str;
      this.rows[k].obj[this.columns[column]] = str;
    }
  }
};

/**
 *  Trims leading and trailing whitespace, such as spaces and tabs,
 *  from String table values. If no column is specified, then the
 *  values in all columns and rows are trimmed. A specific column
 *  may be referenced by either its ID or title.
 *
 *  @method  trim
 *  @param  {String|Number} column Column ID (number)
 *                                   or name (string)
 */
p5.Table.prototype.trim = function(column) {
  var regex = new RegExp( (' '), 'g');

  if (typeof(column) === 'undefined'){
    for (var c = 0; c < this.columns.length; c++) {
      for (var d = 0; d < this.rows.length; d++) {
        var s = this.rows[d].arr[c];
        s = s.replace(regex, '');
        this.rows[d].arr[c] = s;
        this.rows[d].obj[this.columns[c]] = s;
      }
    }
  }
  else if (typeof(column) === 'string'){
    for (var j = 0; j < this.rows.length; j++) {
      var val = this.rows[j].obj[column];
      val = val.replace(regex, '');
      this.rows[j].obj[column] = val;
      var pos = this.columns.indexOf(column);
      this.rows[j].arr[pos] = val;
    }
  }
  else {
    for (var k = 0; k < this.rows.length; k++) {
      var str = this.rows[k].arr[column];
      str = str.replace(regex, '');
      this.rows[k].arr[column] = str;
      this.rows[k].obj[this.columns[column]] = str;
    }
  }
};

/**
 *  Use removeColumn() to remove an existing column from a Table
 *  object. The column to be removed may be identified by either
 *  its title (a String) or its index value (an int).
 *  removeColumn(0) would remove the first column, removeColumn(1)
 *  would remove the second column, and so on.
 *
 *  @method  removeColumn
 *  @param  {String|Number} column columnName (string) or ID (number)
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   table.removeColumn("id");
	*   print(table.getColumnCount());
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.removeColumn = function(c) {
  var cString;
  var cNumber;
  if (typeof(c) === 'string') {
    // find the position of c in the columns
    cString = c;
    cNumber = this.columns.indexOf(c);
    console.log('string');
  }
  else{
    cNumber = c;
    cString = this.columns[c];
  }

  var chunk = this.columns.splice(cNumber+1, this.columns.length);
  this.columns.pop();
  this.columns = this.columns.concat(chunk);

  for (var i = 0; i < this.rows.length; i++){
    var tempR = this.rows[i].arr;
    var chip = tempR.splice(cNumber+1, tempR.length);
    tempR.pop();
    this.rows[i].arr = tempR.concat(chip);
    delete this.rows[i].obj[cString];
  }

};


/**
 * Stores a value in the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified
 * by either its ID or title.
 *
 * @method  set
 * @param {String|Number} column column ID (Number)
 *                               or title (String)
 * @param {String|Number} value  value to assign
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   table.set(0, "species", "Canis Lupus");
	*   table.set(0, "name", "Wolf");
	*
	*   //print the results
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++)
	*       print(table.getString(r, c));
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.set = function(row, column, value) {
  this.rows[row].set(column, value);
};

/**
 * Stores a Float value in the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified
 * by either its ID or title.
 *
 * @method setNum
 * @param {Number} row row ID
 * @param {String|Number} column column ID (Number)
 *                               or title (String)
 * @param {Number} value  value to assign
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   table.setNum(1, "id", 1);
	*
	*   print(table.getColumn(0));
	*   //["0", 1, "2"]
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.setNum = function(row, column, value){
  this.rows[row].set(column, value);
};


/**
 * Stores a String value in the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified
 * by either its ID or title.
 *
 * @method  setString
 * @param {Number} row row ID
 * @param {String|Number} column column ID (Number)
 *                               or title (String)
 * @param {String} value  value to assign
 */
p5.Table.prototype.setString = function(row, column, value){
  this.rows[row].set(column, value);
};

/**
 * Retrieves a value from the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified by
 * either its ID or title.
 *
 * @method  get
 * @param {Number} row row ID
 * @param  {String|Number} column columnName (string) or
 *                                   ID (number)
 * @return {String|Number}
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   print(table.get(0, 1));
	*   //Capra hircus
	*   print(table.get(0, "species"));
	*   //Capra hircus
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.get = function(row, column) {
  return this.rows[row].get(column);
};

/**
 * Retrieves a Float value from the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified by
 * either its ID or title.
 *
 * @method  getNum
 * @param {Number} row row ID
 * @param  {String|Number} column columnName (string) or
 *                                   ID (number)
 * @return {Number}
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   print(table.getNum(1, 0) + 100);
	*   //id 1 + 100 = 101
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.getNum = function(row, column) {
  return this.rows[row].getNum(column);
};

/**
 * Retrieves a String value from the Table's specified row and column.
 * The row is specified by its ID, while the column may be specified by
 * either its ID or title.
 *
 * @method  getString
 * @param {Number} row row ID
 * @param  {String|Number} column columnName (string) or
 *                                   ID (number)
 * @return {String}
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   var tableArray = table.getArray();
	*
	*   //output each row as array
	*   for (var i = 0; i < tableArray.length; i++)
	*     print(tableArray[i]);
	* }
	* </code>
	* </div>
 */
p5.Table.prototype.getString = function(row, column) {
  return this.rows[row].getString(column);
};

/**
 * Retrieves all table data and returns as an object. If a column name is
 * passed in, each row object will be stored with that attribute as its
 * title.
 *
 * @method  getObject
 * @param {String} headerColumn Name of the column which should be used to
 *                              title each row object (optional)
 * @return {Object}
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the CSV file "mammals.csv"
	* // in the project's "assets" folder:
	* //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	* }
	*
	* function setup() {
	*   var tableObject = table.getObject();
	*
	*   print(tableObject);
	*   //outputs an object
	* }
	* </code>
	* </div>

 */
p5.Table.prototype.getObject = function (headerColumn) {
  var tableObject = {};
  var obj, cPos, index;

  for(var i = 0; i < this.rows.length; i++) {
    obj = this.rows[i].obj;

    if (typeof(headerColumn) === 'string'){
      cPos = this.columns.indexOf(headerColumn); // index of columnID
      if (cPos >= 0) {
        index = obj[headerColumn];
        tableObject[index] = obj;
      } else {
        throw 'This table has no column named "' + headerColumn +'"';
      }
    } else {
      tableObject[i] = this.rows[i].obj;
    }
  }
  return tableObject;
};

/**
 * Retrieves all table data and returns it as a multidimensional array.
 *
 * @method  getArray
 * @return {Array}
 */
p5.Table.prototype.getArray = function () {
  var tableArray = [];
  for(var i = 0; i < this.rows.length; i++) {
    tableArray.push(this.rows[i].arr);
  }
  return tableArray;
};

module.exports = p5.Table;

},{"../core/core":16}],40:[function(require,module,exports){
/**
 * @module IO
 * @submodule Table
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 *  A TableRow object represents a single row of data values,
 *  stored in columns, from a table.
 *
 *  A Table Row contains both an ordered array, and an unordered
 *  JSON object.
 *
 *  @class p5.TableRow
 *  @constructor
 *  @param {String} [str]       optional: populate the row with a
 *                              string of values, separated by the
 *                              separator
 *  @param {String} [separator] comma separated values (csv) by default
 */
p5.TableRow = function (str, separator) {
  var arr = [];
  var obj = {};
  if (str){
    separator = separator || ',';
    arr = str.split(separator);
  }
  for (var i = 0; i < arr.length; i++){
    var key = i;
    var val = arr[i];
    obj[key] = val;
  }
  this.arr = arr;
  this.obj = obj;
  this.table = null;
};

/**
 *  Stores a value in the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  set
 *  @param {String|Number} column Column ID (Number)
 *                                or Title (String)
 *  @param {String|Number} value  The value to be stored
 */
p5.TableRow.prototype.set = function(column, value) {
  // if typeof column is string, use .obj
  if (typeof(column) === 'string'){
    var cPos = this.table.columns.indexOf(column); // index of columnID
    if (cPos >= 0) {
      this.obj[column] = value;
      this.arr[cPos] = value;
    }
    else {
      throw 'This table has no column named "' + column +'"';
    }
  }

  // if typeof column is number, use .arr
  else {
    if (column < this.table.columns.length) {
      this.arr[column] = value;
      var cTitle = this.table.columns[column];
      this.obj[cTitle] = value;
    }
    else {
      throw 'Column #' + column + ' is out of the range of this table';
    }
  }
};


/**
 *  Stores a Float value in the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  setNum
 *  @param {String|Number} column Column ID (Number)
 *                                or Title (String)
 *  @param {Number} value  The value to be stored
 *                                as a Float
 */
p5.TableRow.prototype.setNum = function(column, value){
  var floatVal = parseFloat(value, 10);
  this.set(column, floatVal);
};


/**
 *  Stores a String value in the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  setString
 *  @param {String|Number} column Column ID (Number)
 *                                or Title (String)
 *  @param {String} value  The value to be stored
 *                                as a String
 */
p5.TableRow.prototype.setString = function(column, value){
  var stringVal = value.toString();
  this.set(column, stringVal);
};

/**
 *  Retrieves a value from the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  get
 *  @param  {String|Number} column columnName (string) or
 *                                   ID (number)
 *  @return {String|Number}
 */
p5.TableRow.prototype.get = function(column) {
  if (typeof(column) === 'string'){
    return this.obj[column];
  } else {
    return this.arr[column];
  }
};

/**
 *  Retrieves a Float value from the TableRow's specified
 *  column. The column may be specified by either its ID or
 *  title.
 *
 *  @method  getNum
 *  @param  {String|Number} column columnName (string) or
 *                                   ID (number)
 *  @return {Number}  Float Floating point number
 */
p5.TableRow.prototype.getNum = function(column) {
  var ret;
  if (typeof(column) === 'string'){
    ret = parseFloat(this.obj[column], 10);
  } else {
    ret = parseFloat(this.arr[column], 10);
  }

  if (ret.toString() === 'NaN') {
    throw 'Error: ' + this.obj[column]+ ' is NaN (Not a Number)';
  }
  return ret;
};

/**
 *  Retrieves an String value from the TableRow's specified
 *  column. The column may be specified by either its ID or
 *  title.
 *
 *  @method  getString
 *  @param  {String|Number} column columnName (string) or
 *                                   ID (number)
 *  @return {String}  String
 */
p5.TableRow.prototype.getString = function(column) {
  if (typeof(column) === 'string'){
    return this.obj[column].toString();
  } else {
    return this.arr[column].toString();
  }
};

module.exports = p5.TableRow;

},{"../core/core":16}],41:[function(require,module,exports){
/**
 * @module Math
 * @submodule Calculation
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Calculates the absolute value (magnitude) of a number. Maps to Math.abs().
 * The absolute value of a number is always positive.
 *
 * @method abs
 * @param  {Number} n number to compute
 * @return {Number}   absolute value of given number
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var x = -3;
 *   var y = abs(x);
 *
 *   print(x); // -3
 *   print(y); // 3
 * }
 * </div></code>
 */
p5.prototype.abs = Math.abs;

/**
 * Calculates the closest int value that is greater than or equal to the
 * value of the parameter. Maps to Math.ceil(). For example, ceil(9.03)
 * returns the value 10.
 *
 * @method ceil
 * @param  {Number} n number to round up
 * @return {Number}   rounded up number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   // map, mouseX between 0 and 5.
 *   var ax = map(mouseX, 0, 100, 0, 5);
 *   var ay = 66;
 *
 *   //Get the ceiling of the mapped number.
 *   var bx = ceil(map(mouseX, 0, 100, 0,5));
 *   var by = 33;
 *
 *   // Multiply the mapped numbers by 20 to more easily
 *   // see the changes.
 *   stroke(0);
 *   fill(0);
 *   line(0, ay, ax * 20, ay);
 *   line(0, by, bx * 20, by);
 *
 *   // Reformat the float returned by map and draw it.
 *   noStroke();
 *   text(nfc(ax, 2,2), ax, ay - 5);
 *   text(nfc(bx,1,1), bx, by - 5);
 * }
 * </div></code>
 */
p5.prototype.ceil = Math.ceil;

/**
 * Constrains a value between a minimum and maximum value.
 *
 * @method constrain
 * @param  {Number} n    number to constrain
 * @param  {Number} low  minimum limit
 * @param  {Number} high maximum limit
 * @return {Number}      constrained number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *
 *   var leftWall = 25;
 *   var rightWall = 75;
 *
 *   // xm is just the mouseX, while
 *   // xc is the mouseX, but constrained
 *   // between the leftWall and rightWall!
 *   var xm = mouseX;
 *   var xc = constrain(mouseX, leftWall, rightWall);
 *
 *   // Draw the walls.
 *   stroke(150);
 *   line(leftWall, 0, leftWall, height);
 *   line(rightWall, 0, rightWall, height);
 *
 *   // Draw xm and xc as circles.
 *   noStroke();
 *   fill(150);
 *   ellipse(xm, 33, 9,9); // Not Constrained
 *   fill(0);
 *   ellipse(xc, 66, 9,9); // Constrained
 * }
 * </div></code>
 */
p5.prototype.constrain = function(n, low, high) {
  return Math.max(Math.min(n, high), low);
};

/**
 * Calculates the distance between two points.
 *
 * @method dist
 * @param  {Number} x1 x-coordinate of the first point
 * @param  {Number} y1 y-coordinate of the first point
 * @param  {Number} x2 x-coordinate of the second point
 * @param  {Number} y2 y-coordinate of the second point
 * @return {Number}    distance between the two points
 * @example
 * <div><code>
 * // Move your mouse inside the canvas to see the
 * // change in distance between two points!
 * function draw() {
 *   background(200);
 *   fill(0);
 *
 *   var x1 = 10;
 *   var y1 = 90;
 *   var x2 = mouseX;
 *   var y2 = mouseY;
 *
 *   line(x1, y1, x2, y2);
 *   ellipse(x1, y1, 7, 7);
 *   ellipse(x2, y2, 7, 7);
 *
 *   // d is the length of the line
 *   // the distance from point 1 to point 2.
 *   var d = int(dist(x1, y1, x2, y2));
 *
 *   // Let's write d along the line we are drawing!
 *   push();
 *   translate( (x1+x2)/2, (y1+y2)/2 );
 *   rotate( atan2(y2-y1,x2-x1) );
 *   text(nfc(d,1,1), 0, -5);
 *   pop();
 *   // Fancy!
 * }
 * </div></code>
 */
p5.prototype.dist = function(x1, y1, x2, y2) {
  return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
};

/**
 * Returns Euler's number e (2.71828...) raised to the power of the n
 * parameter. Maps to Math.exp().
 *
 * @method exp
 * @param  {Number} n exponent to raise
 * @return {Number}   e^n
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *
 *   // Compute the exp() function with a value between 0 and 2
 *   var xValue = map(mouseX, 0, width, 0, 2);
 *   var yValue = exp(xValue);
 *
 *   var y = map(yValue, 0, 8, height, 0);
 *
 *   var legend = "exp (" + nfc(xValue, 3) +")\n= " + nf(yValue, 1, 4);
 *   stroke(150);
 *   line(mouseX, y, mouseX, height);
 *   fill(0);
 *   text(legend, 5, 15);
 *   noStroke();
 *   ellipse (mouseX,y, 7, 7);
 *
 *   // Draw the exp(x) curve,
 *   // over the domain of x from 0 to 2
 *   noFill();
 *   stroke(0);
 *   beginShape();
 *   for (var x = 0; x < width; x++) {
 *     xValue = map(x, 0, width, 0, 2);
 *     yValue = exp(xValue);
 *     y = map(yValue, 0, 8, height, 0);
 *     vertex(x, y);
 *   }
 *
 *   endShape();
 *   line(0, 0, 0, height);
 *   line(0, height-1, width, height-1);
 * }
 * </div></code>
 */
p5.prototype.exp = Math.exp;

/**
 * Calculates the closest int value that is less than or equal to the
 * value of the parameter. Maps to Math.floor().
 *
 * @method floor
 * @param  {Number} n number to round down
 * @return {Number}   rounded down number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   //map, mouseX between 0 and 5.
 *   var ax = map(mouseX, 0, 100, 0, 5);
 *   var ay = 66;
 *
 *   //Get the floor of the mapped number.
 *   var bx = floor(map(mouseX, 0, 100, 0,5));
 *   var by = 33;
 *
 *   // Multiply the mapped numbers by 20 to more easily
 *   // see the changes.
 *   stroke(0);
 *   fill(0);
 *   line(0, ay, ax * 20, ay);
 *   line(0, by, bx * 20, by);
 *
 *   // Reformat the float returned by map and draw it.
 *   noStroke();
 *   text(nfc(ax, 2,2), ax, ay - 5);
 *   text(nfc(bx,1,1), bx, by - 5);
 * }
 * </div></code>
 */
p5.prototype.floor = Math.floor;

/**
 * Calculates a number between two numbers at a specific increment. The amt
 * parameter is the amount to interpolate between the two values where 0.0
 * equal to the first point, 0.1 is very near the first point, 0.5 is
 * half-way in between, etc. The lerp function is convenient for creating
 * motion along a straight path and for drawing dotted lines.
 *
 * @method lerp
 * @param  {Number} start first value
 * @param  {Number} stop  second value
 * @param  {Number} amt   number between 0.0 and 1.0
 * @return {Number}       lerped value
 * @example
 * <div><code>
 * function setup() {
 *   background(200);
 *   var a = 20;
 *   var b = 80;
 *   var c = lerp(a,b, .2);
 *   var d = lerp(a,b, .5);
 *   var e = lerp(a,b, .8);
 *
 *   var y = 50
 *
 *   strokeWeight(5);
 *   stroke(0); // Draw the original points in black
 *   point(a, y);
 *   int(b, y);
 *
 *   stroke(100); // Draw the lerp points in gray
 *   point(c, y);
 *   point(d, y);
 *   point(e, y);
 * }
 * </div></code>
 */
p5.prototype.lerp = function(start, stop, amt) {
  return amt*(stop-start)+start;
};

/**
 * Calculates the natural logarithm (the base-e logarithm) of a number. This
 * function expects the n parameter to be a value greater than 0.0. Maps to
 * Math.log().
 *
 * @method log
 * @param  {Number} n number greater than 0
 * @return {Number}   natural logarithm of n
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   var maxX = 2.8;
 *   var maxY = 1.5;
 *
 *   // Compute the natural log of a value between 0 and maxX
 *   var xValue = map(mouseX, 0, width, 0, maxX);
 *   if (xValue > 0) { // Cannot take the log of a negative number.
 *     var yValue = log(xValue);
 *     var y = map(yValue, -maxY, maxY, height, 0);
 *
 *     // Display the calculation occurring.
 *     var legend = "log(" + nf(xValue, 1, 2) + ")\n= " + nf(yValue, 1, 3);
 *     stroke(150);
 *     line(mouseX, y, mouseX, height);
 *     fill(0);
 *     text (legend, 5, 15);
 *     noStroke();
 *     ellipse (mouseX, y, 7, 7);
 *   }
 *
 *   // Draw the log(x) curve,
 *   // over the domain of x from 0 to maxX
 *   noFill();
 *   stroke(0);
 *   beginShape();
 *   for(var x=0; x<width; x++) {
 *     xValue = map(x, 0, width, 0, maxX);
 *     yValue = log(xValue);
 *     y = map(yValue, -maxY, maxY, height, 0);
 *     vertex(x, y);
 *   }
 *   endShape();
 *   line(0,0,0,height);
 *   line(0,height/2,width, height/2);
 * }
 * </div></code>
 */
p5.prototype.log = Math.log;

/**
 * Calculates the magnitude (or length) of a vector. A vector is a direction
 * in space commonly used in computer graphics and linear algebra. Because it
 * has no "start" position, the magnitude of a vector can be thought of as
 * the distance from the coordinate 0,0 to its x,y value. Therefore, mag() is
 * a shortcut for writing dist(0, 0, x, y).
 *
 * @method mag
 * @param  {Number} a first value
 * @param  {Number} b second value
 * @return {Number}   magnitude of vector from (0,0) to (a,b)
 * @example
 * <div><code>
 * function setup() {
 *   var x1 = 20;
 *   var x2 = 80;
 *   var y1 = 30;
 *   var y2 = 70;
 *
 *   line(0, 0, x1, y1);
 *   print(mag(x1, y1));  // Prints "36.05551"
 *   line(0, 0, x2, y1);
 *   print(mag(x2, y1));  // Prints "85.44004"
 *   line(0, 0, x1, y2);
 *   print(mag(x1, y2));  // Prints "72.8011"
 *   line(0, 0, x2, y2);
 *   print(mag(x2, y2));  // Prints "106.30146"
 * }
 * </div></code>
 */
p5.prototype.mag = function(x, y) {
  return Math.sqrt(x*x+y*y);
};

/**
 * Re-maps a number from one range to another.
 * In the first example above, the number 25 is converted from a value in the
 * range of 0 to 100 into a value that ranges from the left edge of the
 * window (0) to the right edge (width).
 *
 * @method map
 * @param  {Number} value  the incoming value to be converted
 * @param  {Number} start1 lower bound of the value's current range
 * @param  {Number} stop1  upper bound of the value's current range
 * @param  {Number} start2 lower bound of the value's target range
 * @param  {Number} stop   upper bound of the value's target range
 * @return {Number}        remapped number
 * @example
 *   <div><code>
 *     createCanvas(200, 200);
 *     var value = 25;
 *     var m = map(value, 0, 100, 0, width);
 *     ellipse(m, 200, 10, 10);
 *   </code></div>
 *
 *   <div><code>
 *     function setup() {
 *       createCanvs(200, 200);
 *       noStroke();
 *     }
 *
 *     function draw() {
 *       background(204);
 *       var x1 = map(mouseX, 0, width, 50, 150);
 *       ellipse(x1, 75, 50, 50);
 *       var x2 = map(mouseX, 0, width, 0, 200);
 *       ellipse(x2, 125, 50, 50);
 *     }
 *   </div></code>
 */
p5.prototype.map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

/**
 * Determines the largest value in a sequence of numbers, and then returns
 * that value. max() accepts any number of Number parameters, or an Array
 * of any length.
 *
 * @method max
 * @param  {Number|Array} n0 Numbers to compare
 * @return {Number}          maximum Number
 * @example
 * <div><code>
 * function setup() {
 *   // Change the elements in the array and run the sketch
 *   // to show how max() works!
 *   numArray = new Array(2,1,5,4,8,9);
 *   fill(0);
 *   noStroke();
 *   text("Array Elements", 0, 10);
 *   // Draw all numbers in the array
 *   var spacing = 15;
 *   var elemsY = 25;
 *   for(var i = 0; i < numArray.length; i++) {
 *     text(numArray[i], i * spacing, elemsY);
 *   }
 *   maxX = 33;
 *   maxY = 80;
 *   // Draw the Maximum value in the array.
 *   textSize(32);
 *   text(max(numArray), maxX, maxY);
 * }
 * </div></code>
 */
p5.prototype.max = function() {
  if (arguments[0] instanceof Array) {
    return Math.max.apply(null,arguments[0]);
  } else {
    return Math.max.apply(null,arguments);
  }
};

/**
 * Determines the smallest value in a sequence of numbers, and then returns
 * that value. min() accepts any number of Number parameters, or an Array
 * of any length.
 *
 * @method min
 * @param  {Number|Array} n0 Numbers to compare
 * @return {Number}          minimum Number
 * @example
 * <div><code>
 * function setup() {
 *   // Change the elements in the array and run the sketch
 *   // to show how min() works!
 *   numArray = new Array(2,1,5,4,8,9);
 *   fill(0);
 *   noStroke();
 *   text("Array Elements", 0, 10);
 *   // Draw all numbers in the array
 *   var spacing = 15;
 *   var elemsY = 25;
 *   for(var i = 0; i < numArray.length; i++) {
 *     text(numArray[i], i * spacing, elemsY);
 *   }
 *   maxX = 33;
 *   maxY = 80;
 *   // Draw the Minimum value in the array.
 *   textSize(32);
 *   text(min(numArray), maxX, maxY);
 * }
 * </div></code>
 */
p5.prototype.min = function() {
  if (arguments[0] instanceof Array) {
    return Math.min.apply(null,arguments[0]);
  } else {
    return Math.min.apply(null,arguments);
  }
};

/**
 * Normalizes a number from another range into a value between 0 and 1.
 * Identical to map(value, low, high, 0, 1).
 * Numbers outside of the range are not clamped to 0 and 1, because
 * out-of-range values are often intentional and useful. (See the second
 * example above.)
 *
 * @method norm
 * @param  {Number} value incoming value to be normalized
 * @param  {Number} start lower bound of the value's current range
 * @param  {Number} stop  upper bound of the value's current range
 * @return {Number}       normalized number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   currentNum = mouseX;
 *   lowerBound = 0;
 *   upperBound = width; //100;
 *   normalized = norm(currentNum, lowerBound, upperBound);
 *   lineY = 70
 *   line(0, lineY, width, lineY);
 *   //Draw an ellipse mapped to the non-normalized value.
 *   noStroke();
 *   fill(50)
 *   var s = 7; // ellipse size
 *   ellipse(currentNum, lineY, s, s);
 *
 *   // Draw the guide
 *   guideY = lineY + 15;
 *   text("0", 0, guideY);
 *   textAlign(RIGHT);
 *   text("100", width, guideY);
 *
 *   // Draw the normalized value
 *   textAlign(LEFT);
 *   fill(0);
 *   textSize(32);
 *   normalY = 40;
 *   normalX = 20;
 *   text(normalized, normalX, normalY);
 * }
 * </div></code>
 */
p5.prototype.norm = function(n, start, stop) {
  return this.map(n, start, stop, 0, 1);
};

/**
 * Facilitates exponential expressions. The pow() function is an efficient
 * way of multiplying numbers by themselves (or their reciprocals) in large
 * quantities. For example, pow(3, 5) is equivalent to the expression
 * 3*3*3*3*3 and pow(3, -5) is equivalent to 1 / 3*3*3*3*3. Maps to
 * Math.pow().
 *
 * @method pow
 * @param  {Number} n base of the exponential expression
 * @param  {Number} e power by which to raise the base
 * @return {Number}   n^e
 * @example
 * <div><code>
 * function setup() {
 *   //Exponentially increase the size of an ellipse.
 *   eSize = 3; // Original Size
 *   eLoc = 10; // Original Location
 *
 *   ellipse(eLoc, eLoc, eSize, eSize);
 *
 *   ellipse(eLoc*2, eLoc*2, pow(eSize, 2), pow(eSize, 2));
 *
 *   ellipse(eLoc*4, eLoc*4, pow(eSize, 3), pow(eSize, 3));
 *
 *   ellipse(eLoc*8, eLoc*8, pow(eSize, 4), pow(eSize, 4));
 * }
 * </div></code>
 */
p5.prototype.pow = Math.pow;

/**
 * Calculates the integer closest to the n parameter. For example,
 * round(133.8) returns the value 134. Maps to Math.round().
 *
 * @method round
 * @param  {Number} n number to round
 * @return {Number}   rounded number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   //map, mouseX between 0 and 5.
 *   var ax = map(mouseX, 0, 100, 0, 5);
 *   var ay = 66;
 *
 *   // Round the mapped number.
 *   var bx = round(map(mouseX, 0, 100, 0,5));
 *   var by = 33;
 *
 *   // Multiply the mapped numbers by 20 to more easily
 *   // see the changes.
 *   stroke(0);
 *   fill(0);
 *   line(0, ay, ax * 20, ay);
 *   line(0, by, bx * 20, by);
 *
 *   // Reformat the float returned by map and draw it.
 *   noStroke();
 *   text(nfc(ax, 2,2), ax, ay - 5);
 *   text(nfc(bx,1,1), bx, by - 5);
 * }
 * </div></code>
 */
p5.prototype.round = Math.round;

/**
 * Squares a number (multiplies a number by itself). The result is always a
 * positive number, as multiplying two negative numbers always yields a
 * positive result. For example, -1 * -1 = 1.
 *
 * @method sq
 * @param  {Number} n number to square
 * @return {Number}   squared number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   eSize = 7;
 *   x1 = map(mouseX, 0, width, 0, 10);
 *   y1 = 80;
 *   x2 = sq(x1);
 *   y2 = 20;
 *
 *   // Draw the non-squared.
 *   line(0, y1, width, y1);
 *   ellipse(x1, y1, eSize, eSize);
 *
 *   // Draw the squared.
 *   line(0, y2, width, y2);
 *   ellipse(x2, y2, eSize, eSize);
 *
 *   // Draw dividing line.
 *   stroke(100)
 *   line(0, height/2, width, height/2);
 *
 *   // Draw text.
 *   noStroke();
 *   fill(0);
 *   text("x = " + x1, 0, y1 + spacing);
 *   text("sqrt(x) = " + x2, 0, y2 + spacing);
 * }
 * </div></code>
 */
p5.prototype.sq = function(n) { return n*n; };

/**
 * Calculates the square root of a number. The square root of a number is
 * always positive, even though there may be a valid negative root. The
 * square root s of number a is such that s*s = a. It is the opposite of
 * squaring. Maps to Math.sqrt().
 *
 * @method sqrt
 * @param  {Number} n non-negative number to square root
 * @return {Number}   square root of number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   eSize = 7;
 *   x1 = mouseX;
 *   y1 = 80;
 *   x2 = sqrt(x1);
 *   y2 = 20;
 *
 *   // Draw the non-squared.
 *   line(0, y1, width, y1);
 *   ellipse(x1, y1, eSize, eSize);
 *
 *   // Draw the squared.
 *   line(0, y2, width, y2);
 *   ellipse(x2, y2, eSize, eSize);
 *
 *   // Draw dividing line.
 *   stroke(100)
 *   line(0, height/2, width, height/2);
 *
 *   // Draw text.
 *   noStroke();
 *   fill(0);
 *   var spacing = 15;
 *   text("x = " + x1, 0, y1 + spacing);
 *   text("sqrt(x) = " + x2, 0, y2 + spacing);
 * }
 * </div></code>
 */
p5.prototype.sqrt = Math.sqrt;

module.exports = p5;

},{"../core/core":16}],42:[function(require,module,exports){
/**
 * @module Math
 * @submodule Math
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');


/**
 * Creates a new p5.Vector (the datatype for storing vectors). This provides a
 * two or three dimensional vector, specifically a Euclidean (also known as
 * geometric) vector. A vector is an entity that has both magnitude and
 * direction.
 *
 * @method createVector
 * @param {Number} [x] x component of the vector
 * @param {Number} [y] y component of the vector
 * @param {Number} [z] z component of the vector
 */
p5.prototype.createVector = function (x, y, z) {
  if (this instanceof p5) {
    return new p5.Vector(this, arguments);
  } else {
    return new p5.Vector(x, y, z);
  }
};

module.exports = p5;

},{"../core/core":16}],43:[function(require,module,exports){
//////////////////////////////////////////////////////////////

// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

// someday we might consider using "improved noise"
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/
//      blob/master/introduction/Noise1D/noise.js

/**
 * @module Math
 * @submodule Noise
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1<<PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1<<PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave

// [toxi 031112]
// Maybe we should have a lookup table for speed

var SINCOS_PRECISION = 0.5;
var SINCOS_LENGTH = Math.floor(360 / SINCOS_PRECISION);
var sinLUT = new Array(SINCOS_LENGTH);
var cosLUT = new Array(SINCOS_LENGTH);
var DEG_TO_RAD = Math.PI/180.0;
for (var i = 0; i < SINCOS_LENGTH; i++) {
  sinLUT[i] = Math.sin(i * DEG_TO_RAD * SINCOS_PRECISION);
  cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
}

var perlin_PI = SINCOS_LENGTH;
perlin_PI >>= 1;

var perlin;


/**
 * Returns the Perlin noise value at specified coordinates. Perlin noise is
 * a random sequence generator producing a more natural ordered, harmonic
 * succession of numbers compared to the standard <b>random()</b> function.
 * It was invented by Ken Perlin in the 1980s and been used since in
 * graphical applications to produce procedural textures, natural motion,
 * shapes, terrains etc.<br /><br /> The main difference to the
 * <b>random()</b> function is that Perlin noise is defined in an infinite
 * n-dimensional space where each pair of coordinates corresponds to a
 * fixed semi-random value (fixed only for the lifespan of the program).
 * The resulting value will always be between 0.0 and 1.0. p5.js can
 * compute 1D, 2D and 3D noise, depending on the number of coordinates
 * given. The noise value can be animated by moving through the noise space
 * as demonstrated in the example above. The 2nd and 3rd dimension can also
 * be interpreted as time.<br /><br />The actual noise is structured
 * similar to an audio signal, in respect to the function's use of
 * frequencies. Similar to the concept of harmonics in physics, perlin
 * noise is computed over several octaves which are added together for the
 * final result. <br /><br />Another way to adjust the character of the
 * resulting sequence is the scale of the input coordinates. As the
 * function works within an infinite space the value of the coordinates
 * doesn't matter as such, only the distance between successive coordinates
 * does (eg. when using <b>noise()</b> within a loop). As a general rule
 * the smaller the difference between coordinates, the smoother the
 * resulting noise sequence will be. Steps of 0.005-0.03 work best for most
 * applications, but this will differ depending on use.
 *
 *
 * @method noise
 * @param  {Number} x   x-coordinate in noise space
 * @param  {Number} y   y-coordinate in noise space
 * @param  {Number} z   z-coordinate in noise space
 * @return {Number}     Perlin noise value (between 0 and 1) at specified
 *                      coordinates
 * @example
 * <div>
 * <code>var xoff = 0.0;
 *
 * function draw() {
 *   background(204);
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 * <div>
 * <code>var noiseScale=0.02;
 *
 * function draw() {
 *   background(0);
 *   for (var x=0; x < width; x++) {
 *     var noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
 *     stroke(noiseVal*255);
 *     line(x, mouseY+noiseVal*80, x, height);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.noise = function(x,y,z) {
  // is this legit?
  y = y || 0;
  z = z || 0;

  if (perlin == null) {
    // need to deal with seeding?
    //if (perlinRandom == null) {
    //  perlinRandom = new Random();
    //}

    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x<0) { x=-x; }
  if (y<0) { y=-y; }
  if (z<0) { z=-z; }

  var xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  var xf = x - xi;
  var yf = y - yi;
  var zf = z - zi;
  var rxf, ryf;

  var r=0;
  var ampl=0.5;

  var n1,n2,n3;

  // Is this right do just have this here?
  var noise_fsc = function(i) {
    // using cosine lookup table
    return 0.5*(1.0-cosLUT[Math.floor(i*perlin_PI)%SINCOS_LENGTH]);
  };

  for (var o=0; o<perlin_octaves; o++) {
    var of=xi+(yi<<PERLIN_YWRAPB)+(zi<<PERLIN_ZWRAPB);

    rxf= noise_fsc(xf);
    ryf= noise_fsc(yf);

    n1  = perlin[of&PERLIN_SIZE];
    n1 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n1);
    n2  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
    n2 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n2);
    n1 += ryf*(n2-n1);

    of += PERLIN_ZWRAP;
    n2  = perlin[of&PERLIN_SIZE];
    n2 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n2);
    n3  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
    n3 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n3);
    n2 += ryf*(n3-n2);

    n1 += noise_fsc(zf)*(n2-n1);

    r += n1*ampl;
    ampl *= perlin_amp_falloff;
    xi<<=1;
    xf*=2;
    yi<<=1;
    yf*=2;
    zi<<=1;
    zf*=2;

    if (xf>=1.0) { xi++; xf--; }
    if (yf>=1.0) { yi++; yf--; }
    if (zf>=1.0) { zi++; zf--; }
  }
  return r;
};



// [toxi 040903]
// make perlin noise quality user controlled to allow
// for different levels of detail. lower values will produce
// smoother results as higher octaves are suppressed

/**
 *
 * Adjusts the character and level of detail produced by the Perlin noise
 * function. Similar to harmonics in physics, noise is computed over
 * several octaves. Lower octaves contribute more to the output signal and
 * as such define the overall intensity of the noise, whereas higher octaves
 * create finer grained details in the noise sequence. By default, noise is
 * computed over 4 octaves with each octave contributing exactly half than
 * its predecessor, starting at 50% strength for the 1st octave. This
 * falloff amount can be changed by adding an additional function
 * parameter. Eg. a falloff factor of 0.75 means each octave will now have
 * 75% impact (25% less) of the previous lower octave. Any value between
 * 0.0 and 1.0 is valid, however note that values greater than 0.5 might
 * result in greater than 1.0 values returned by <b>noise()</b>.<br /><br
 * />By changing these parameters, the signal created by the <b>noise()</b>
 * function can be adapted to fit very specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise
 * @param {Number} falloff falloff factor for each octave
 * @example
 * <div>
 * <code>
 *
 * var noiseVal;
 * var noiseScale=0.02;
 *
 * function setup() {
 *   createCanvas(100,100);
 * }
 *
 * function draw() {
 *   background(0);
 *   for (var y = 0; y < height; y++) {
 *     for (var x = 0; x < width/2; x++) {
 *       noiseDetail(2,0.2);
 *       noiseVal = noise((mouseX+x) * noiseScale,
 *                        (mouseY+y) * noiseScale);
 *       stroke(noiseVal*255);
 *       point(x,y);
 *       noiseDetail(8,0.65);
 *       noiseVal = noise((mouseX + x + width/2) * noiseScale,
 *                        (mouseY + y) * noiseScale);
 *       stroke(noiseVal*255);
 *       point(x + width/2, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.noiseDetail = function(lod, falloff) {
  if (lod>0)     { perlin_octaves=lod; }
  if (falloff>0) { perlin_amp_falloff=falloff; }
};

/**
 * Sets the seed value for <b>noise()</b>. By default, <b>noise()</b>
 * produces different results each time the program is run. Set the
 * <b>value</b> parameter to a constant to return the same pseudo-random
 * numbers each time the software is run.
 *
 * @method noiseSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>var xoff = 0.0;
 *
 * function setup() {
 *   noiseSeed(99);
 *   stroke(0, 10);
 * }
 *
 * function draw() {
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 */
p5.prototype.noiseSeed = function(seed) {
  // Linear Congruential Generator
  // Variant of a Lehman Generator
  var lcg = (function() {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    var m = 4294967296,
    // a - 1 should be divisible by m's prime factors
    a = 1664525,
     // c and m should be co-prime
    c = 1013904223,
    seed, z;
    return {
      setSeed : function(val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed : function() {
        return seed;
      },
      rand : function() {
        // define the recurrence relationship
        z = (a * z + c) % m;
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m;
      }
    };
  }());

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (var i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
};

module.exports = p5;

},{"../core/core":16}],44:[function(require,module,exports){
/**
 * @module Math
 * @submodule Math
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var polarGeometry = require('./polargeometry');
var constants = require('../core/constants');

/**
 * A class to describe a two or three dimensional vector, specifically
 * a Euclidean (also known as geometric) vector. A vector is an entity
 * that has both magnitude and direction. The datatype, however, stores
 * the components of the vector (x,y for 2D, and x,y,z for 3D). The magnitude
 * and direction can be accessed via the methods mag() and heading(). In many
 * of the p5.js examples, you will see p5.Vector used to describe a position,
 * velocity, or acceleration. For example, if you consider a rectangle moving
 * across the screen, at any given instant it has a position (a vector that
 * points from the origin to its location), a velocity (the rate at which the
 * object's position changes per time unit, expressed as a vector), and
 * acceleration (the rate at which the object's velocity changes per time
 * unit, expressed as a vector). Since vectors represent groupings of values,
 * we cannot simply use traditional addition/multiplication/etc. Instead,
 * we'll need to do some "vector" math, which is made easy by the methods
 * inside the p5.Vector class.
 *
 * @class p5.Vector
 * @constructor
 * @param {Number} [x] x component of the vector
 * @param {Number} [y] y component of the vector
 * @param {Number} [z] z component of the vector
 * @example
 * <div>
 * <code>
 * var v1 = createVector(40, 50);
 * var v2 = createVector(40, 50);
 *
 * ellipse(v1.x, v1.y, 50, 50);
 * ellipse(v2.x, v2.y, 50, 50);
 * v1.add(v2);
 * ellipse(v1.x, v1.y, 50, 50);
 * </code>
 * </div>
 */
p5.Vector = function() {
  var x,y,z;
  // This is how it comes in with createVector()
  if(arguments[0] instanceof p5) {
    // save reference to p5 if passed in
    this.p5 = arguments[0];
    x  = arguments[1][0] || 0;
    y  = arguments[1][1] || 0;
    z  = arguments[1][2] || 0;
  // This is what we'll get with new p5.Vector()
  } else {
    x = arguments[0] || 0;
    y = arguments[1] || 0;
    z = arguments[2] || 0;
  }
  /**
   * The x component of the vector
   * @property x
   * @type {Number}
   */
  this.x = x;
  /**
   * The y component of the vector
   * @property y
   * @type {Number}
   */
  this.y = y;
  /**
   * The z component of the vector
   * @property z
   * @type {Number}
   */
  this.z = z;
};

/**
 * Returns a string representation of a vector v by calling String(v)
 * or v.toString(). This method is useful for logging vectors in the
 * console.
 * @method  toString
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var v = createVector(20,30);
 *   print(String(v)); // prints "p5.Vector Object : [20, 30, 0]"
 * }
 * </div></code>
 *
 */
p5.Vector.prototype.toString = function p5VectorToString() {
  return 'p5.Vector Object : ['+ this.x +', '+ this.y +', '+ this.z + ']';
};

/**
 * Sets the x, y, and z component of the vector using two or three separate
 * variables, the data from a p5.Vector, or the values from a float array.
 * @method set
 *
 * @param {Number|p5.Vector|Array} [x] the x component of the vector or a
 *                                     p5.Vector or an Array
 * @param {Number}                 [y] the y component of the vector
 * @param {Number}                 [z] the z component of the vector
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *    var v = createVector(1, 2, 3);
 *    v.set(4,5,6); // Sets vector to [4, 5, 6]
 *
 *    var v1 = createVector(0, 0, 0);
 *    var arr = [1, 2, 3];
 *    v1.set(arr); // Sets vector to [1, 2, 3]
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.set = function (x, y, z) {
  if (x instanceof p5.Vector) {
    this.x = x.x || 0;
    this.y = x.y || 0;
    this.z = x.z || 0;
    return this;
  }
  if (x instanceof Array) {
    this.x = x[0] || 0;
    this.y = x[1] || 0;
    this.z = x[2] || 0;
    return this;
  }
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  return this;
};

/**
 * Gets a copy of the vector, returns a p5.Vector object.
 *
 * @method copy
 * @return {p5.Vector} the copy of the p5.Vector object
 * @example
 * <div class="norender">
 * <code>
 * var v1 = createVector(1, 2, 3);
 * var v2 = v.copy();
 * print(v1.x == v2.x && v1.y == v2.y && v1.z == v2.z);
 * // Prints "true"
 * </code>
 * </div>
 */
p5.Vector.prototype.copy = function () {
  if (this.p5) {
    return new p5.Vector(this.p5,[this.x, this.y, this.z]);
  } else {
    return new p5.Vector(this.x,this.y,this.z);
  }
};

/**
 * Adds x, y, and z components to a vector, adds one vector to another, or
 * adds two independent vectors together. The version of the method that adds
 * two vectors together is a static method and returns a p5.Vector, the others
 * acts directly on the vector. See the examples for more context.
 *
 * @method add
 * @chainable
 * @param  {Number|p5.Vector|Array} x   the x component of the vector to be
 *                                      added or a p5.Vector or an Array
 * @param  {Number}                 [y] the y component of the vector to be
 *                                      added
 * @param  {Number}                 [z] the z component of the vector to be
 *                                      added
 * @return {p5.Vector}                  the p5.Vector object.
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(1, 2, 3);
 * v.add(4,5,6);
 * // v's compnents are set to [5, 7, 9]
 * </code>
 * </div>
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(1, 2, 3);
 * var v2 = createVector(2, 3, 4);
 *
 * var v3 = p5.Vector.add(v1, v2);
 * // v3 has components [3, 5, 7]
 * </code>
 * </div>
 */
p5.Vector.prototype.add = function (x, y, z) {
  if (x instanceof p5.Vector) {
    this.x += x.x || 0;
    this.y += x.y || 0;
    this.z += x.z || 0;
    return this;
  }
  if (x instanceof Array) {
    this.x += x[0] || 0;
    this.y += x[1] || 0;
    this.z += x[2] || 0;
    return this;
  }
  this.x += x || 0;
  this.y += y || 0;
  this.z += z || 0;
  return this;
};

/**
 * Subtracts x, y, and z components from a vector, subtracts one vector from
 * another, or subtracts two independent vectors. The version of the method
 * that subtracts two vectors is a static method and returns a p5.Vector, the
 * other acts directly on the vector. See the examples for more context.
 *
 * @method sub
 * @chainable
 * @param  {Number|p5.Vector|Array} x   the x component of the vector or a
 *                                      p5.Vector or an Array
 * @param  {Number}                 [y] the y component of the vector
 * @param  {Number}                 [z] the z component of the vector
 * @return {p5.Vector}                  p5.Vector object.
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(4, 5, 6);
 * v.sub(1, 1, 1);
 * // v's compnents are set to [3, 4, 5]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(2, 3, 4);
 * var v2 = createVector(1, 2, 3);
 *
 * var v3 = p5.Vector.sub(v1, v2);
 * // v3 has compnents [1, 1, 1]
 * </code>
 * </div>
 */
p5.Vector.prototype.sub = function (x, y, z) {
  if (x instanceof p5.Vector) {
    this.x -= x.x || 0;
    this.y -= x.y || 0;
    this.z -= x.z || 0;
    return this;
  }
  if (x instanceof Array) {
    this.x -= x[0] || 0;
    this.y -= x[1] || 0;
    this.z -= x[2] || 0;
    return this;
  }
  this.x -= x || 0;
  this.y -= y || 0;
  this.z -= z || 0;
  return this;
};

/**
 * Multiply the vector by a scalar. The static version of this method
 * creates a new p5.Vector while the non static version acts on the vector
 * directly. See the examples for more context.
 *
 * @method mult
 * @chainable
 * @param  {Number}    n the number to multiply with the vector
 * @return {p5.Vector} a reference to the p5.Vector object (allow chaining)
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(1, 2, 3);
 * v.mult(2);
 * // v's compnents are set to [2, 4, 6]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(1, 2, 3);
 * var v2 = p5.Vector.mult(v1, 2);
 * // v2 has compnents [2, 4, 6]
 * </code>
 * </div>
 */
p5.Vector.prototype.mult = function (n) {
  this.x *= n || 0;
  this.y *= n || 0;
  this.z *= n || 0;
  return this;
};

/**
 * Divide the vector by a scalar. The static version of this method creates a
 * new p5.Vector while the non static version acts on the vector directly.
 * See the examples for more context.
 *
 * @method div
 * @chainable
 * @param  {number}    n the number to divide the vector by
 * @return {p5.Vector} a reference to the p5.Vector object (allow chaining)
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(6, 4, 2);
 * v.div(2); //v's compnents are set to [3, 2, 1]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * var v1  = createVector(6, 4, 2);
 * var v2 = p5.Vector.div(v, 2);
 * // v2 has compnents [3, 2, 1]
 * </code>
 * </div>
 */
p5.Vector.prototype.div = function (n) {
  this.x /= n;
  this.y /= n;
  this.z /= n;
  return this;
};

/**
 * Calculates the magnitude (length) of the vector and returns the result as
 * a float (this is simply the equation sqrt(x*x + y*y + z*z).)
 *
 * @method mag
 * @return {Number} magnitude of the vector
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(20.0, 30.0, 40.0);
 * var m = v.mag(10);
 * print(m); // Prints "53.85164807134504"
 * </code>
 * </div>
 */
p5.Vector.prototype.mag = function () {
  return Math.sqrt(this.magSq());
};

/**
 * Calculates the squared magnitude of the vector and returns the result
 * as a float (this is simply the equation <em>(x*x + y*y + z*z)</em>.)
 * Faster if the real length is not required in the
 * case of comparing vectors, etc.
 *
 * @method magSq
 * @return {number} squared magnitude of the vector
 * @example
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(6, 4, 2);
 * print(v1.magSq()); // Prints "56"
 * </code>
 * </div>
 */
p5.Vector.prototype.magSq = function () {
  var x = this.x, y = this.y, z = this.z;
  return (x * x + y * y + z * z);
};

/**
 * Calculates the dot product of two vectors. The version of the method
 * that computes the dot product of two independent vectors is a static
 * method. See the examples for more context.
 *
 *
 * @method dot
 * @param  {Number|p5.Vector} x   x component of the vector or a p5.Vector
 * @param  {Number}           [y] y component of the vector
 * @param  {Number}           [z] z component of the vector
 * @return {Number}                 the dot product
 *
 * @example
 * <div class="norender">
 * <code>
 * var v1 = createVector(1, 2, 3);
 * var v2 = createVector(2, 3, 4);
 *
 * print(v1.dot(v2)); // Prints "20"
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * //Static method
 * var v1 = createVector(1, 2, 3);
 * var v2 = createVector(3, 2, 1);
 * print (p5.Vector.dot(v1, v2)); // Prints "10"
 * </code>
 * </div>
 */
p5.Vector.prototype.dot = function (x, y, z) {
  if (x instanceof p5.Vector) {
    return this.dot(x.x, x.y, x.z);
  }
  return this.x * (x || 0) +
         this.y * (y || 0) +
         this.z * (z || 0);
};

/**
 * Calculates and returns a vector composed of the cross product between
 * two vectors. Both the static and non static methods return a new p5.Vector.
 * See the examples for more context.
 *
 * @method cross
 * @param  {p5.Vector} v p5.Vector to be crossed
 * @return {p5.Vector}   p5.Vector composed of cross product
 * @example
 * <div class="norender">
 * <code>
 * var v1 = createVector(1, 2, 3);
 * var v2 = createVector(1, 2, 3);
 *
 * v1.cross(v2); // v's components are [0, 0, 0]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(1, 0, 0);
 * var v2 = createVector(0, 1, 0);
 *
 * var crossProduct = p5.Vector.cross(v1, v2);
 * // crossProduct has components [0, 0, 1]
 * </code>
 * </div>
 */
p5.Vector.prototype.cross = function (v) {
  var x = this.y * v.z - this.z * v.y;
  var y = this.z * v.x - this.x * v.z;
  var z = this.x * v.y - this.y * v.x;
  if (this.p5) {
    return new p5.Vector(this.p5,[x,y,z]);
  } else {
    return new p5.Vector(x,y,z);
  }
};

/**
 * Calculates the Euclidean distance between two points (considering a
 * point as a vector object).
 *
 * @method dist
 * @param  {p5.Vector} v the x, y, and z coordinates of a p5.Vector
 * @return {Number}      the distance
 * @example
 * <div class="norender">
 * <code>
 * var v1 = createVector(1, 0, 0);
 * var v2 = createVector(0, 1, 0);
 *
 * var distance = v1.dist(v2); // distance is 1.4142...
 * </code>
 * </div>
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(1, 0, 0);
 * var v2 = createVector(0, 1, 0);
 *
 * var distance = p5.Vector.dist(v1,v2);
 * // distance is 1.4142...
 * </code>
 * </div>
 */
p5.Vector.prototype.dist = function (v) {
  var d = v.copy().sub(this);
  return d.mag();
};

/**
 * Normalize the vector to length 1 (make it a unit vector).
 *
 * @method normalize
 * @return {p5.Vector} normalized p5.Vector
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(10, 20, 2);
 * // v has compnents [10.0, 20.0, 2.0]
 * v.normalize();
 * // v's compnents are set to
 * // [0.4454354, 0.8908708, 0.089087084]
 * </code>
 * </div>
 *
 */
p5.Vector.prototype.normalize = function () {
  return this.div(this.mag());
};

/**
 * Limit the magnitude of this vector to the value used for the <b>max</b>
 * parameter.
 *
 * @method limit
 * @param  {Number}    max the maximum magnitude for the vector
 * @return {p5.Vector}     the modified p5.Vector
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(10, 20, 2);
 * // v has compnents [10.0, 20.0, 2.0]
 * v.limit(5);
 * // v's compnents are set to
 * // [2.2271771, 4.4543543, 0.4454354]
 * </code>
 * </div>
 */
p5.Vector.prototype.limit = function (l) {
  var mSq = this.magSq();
  if(mSq > l*l) {
    this.div(Math.sqrt(mSq)); //normalize it
    this.mult(l);
  }
  return this;
};

/**
 * Set the magnitude of this vector to the value used for the <b>len</b>
 * parameter.
 *
 * @method setMag
 * @param  {number}    len the new length for this vector
 * @return {p5.Vector}     the modified p5.Vector
 * @example
 * <div class="norender">
 * <code>
 * var v1 = createVector(10, 20, 2);
 * // v has compnents [10.0, 20.0, 2.0]
 * v1.setMag(10);
 * // v's compnents are set to [6.0, 8.0, 0.0]
 * </code>
 * </div>
 */
p5.Vector.prototype.setMag = function (n) {
  return this.normalize().mult(n);
};

/**
 * Calculate the angle of rotation for this vector (only 2D vectors)
 *
 * @method heading
 * @return {Number} the angle of rotation
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var v1 = createVector(30,50);
 *   print(v1.heading()); // 1.0303768265243125
 *
 *   var v1 = createVector(40,50);
 *   print(v1.heading()); // 0.8960553845713439
 *
 *   var v1 = createVector(30,70);
 *   print(v1.heading()); // 1.1659045405098132
 * }
 * </div></code>
 */
p5.Vector.prototype.heading = function () {
  var h = Math.atan2(this.y, this.x);
  if (this.p5) {
    if (this.p5._angleMode === constants.RADIANS) {
      return h;
    } else {
      return polarGeometry.radiansToDegrees(h);
    }
  } else {
    return h;
  }
};

/**
 * Rotate the vector by an angle (only 2D vectors), magnitude remains the
 * same
 *
 * @method rotate
 * @param  {number}    angle the angle of rotation
 * @return {p5.Vector} the modified p5.Vector
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(10.0, 20.0);
 * // v has compnents [10.0, 20.0, 0.0]
 * v.rotate(HALF_PI);
 * // v's compnents are set to [-20.0, 9.999999, 0.0]
 * </code>
 * </div>
 */
p5.Vector.prototype.rotate = function (a) {
  if (this.p5) {
    if (this.p5._angleMode === constants.DEGREES) {
      a = polarGeometry.degreesToRadians(a);
    }
  }
  var newHeading = this.heading() + a;
  var mag = this.mag();
  this.x = Math.cos(newHeading) * mag;
  this.y = Math.sin(newHeading) * mag;
  return this;
};

/**
 * Linear interpolate the vector to another vector
 *
 * @method lerp
 * @param  {p5.Vector} x   the x component or the p5.Vector to lerp to
 * @param  {p5.Vector} [y] y the y component
 * @param  {p5.Vector} [z] z the z component
 * @param  {Number}    amt the amount of interpolation; some value between 0.0
 *                         (old vector) and 1.0 (new vector). 0.1 is very near
 *                         the new vector. 0.5 is halfway in between.
 * @return {p5.Vector}     the modified p5.Vector
 * @example
 * <div class="norender">
 * <code>
 * var v = createVector(1, 1, 0);
 *
 * v.lerp(3, 3, 0, 0.5); // v now has components [2,2,0]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * var v1 = createVector(0, 0, 0);
 * var v2 = createVector(100, 100, 0);
 *
 * var v3 = p5.Vector.lerp(v1, v2, 0.5);
 * // v3 has components [50,50,0]
 * </code>
 * </div>
 */
p5.Vector.prototype.lerp = function (x, y, z, amt) {
  if (x instanceof p5.Vector) {
    return this.lerp(x.x, x.y, x.z, y);
  }
  this.x += (x - this.x) * amt || 0;
  this.y += (y - this.y) * amt || 0;
  this.z += (z - this.z) * amt || 0;
  return this;
};

/**
 * Return a representation of this vector as a float array. This is only
 * for temporary use. If used in any other fashion, the contents should be
 * copied by using the <b>p5.Vector.copy()</b> method to copy into your own
 * array.
 *
 * @method array
 * @return {Array} an Array with the 3 values
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var v = createVector(20,30);
 *   print(v.array()); // Prints : Array [20, 30, 0]
 * }
 * </div></code>
 * <div class="norender">
 * <code>
 * var v = createVector(10.0, 20.0, 30.0);
 * var f = v.array();
 * print(f[0]); // Prints "10.0"
 * print(f[1]); // Prints "20.0"
 * print(f[2]); // Prints "30.0"
 * </code>
 * </div>
 */
p5.Vector.prototype.array = function () {
  return [this.x || 0, this.y || 0, this.z || 0];
};

/**
 * Equality check against a p5.Vector
 *
 * @method equals
 * @param {Number|p5.Vector|Array} [x] the x component of the vector or a
 *                                     p5.Vector or an Array
 * @param {Number}                 [y] the y component of the vector
 * @param {Number}                 [z] the z component of the vector
 * @return {Boolean} whether the vectors are equals
 * @example
 * <div class = "norender"><code>
 * v1 = createVector(5,10,20);
 * v2 = createVector(5,10,20);
 * v3 = createVector(13,10,19);
 *
 * print(v1.equals(v2.x,v2.y,v2.z)); // true
 * print(v1.equals(v3.x,v3.y,v3.z)); // false
 * </div></code>
 * <div class="norender">
 * <code>
 * var v1 = createVector(10.0, 20.0, 30.0);
 * var v2 = createVector(10.0, 20.0, 30.0);
 * var v3 = createVector(0.0, 0.0, 0.0);
 * print (v1.equals(v2)) // true
 * print (v1.equals(v3)) // false
 * </code>
 * </div>
 */
p5.Vector.prototype.equals = function (x, y, z) {
  var a, b, c;
  if (x instanceof p5.Vector) {
    a = x.x || 0;
    b = x.y || 0;
    c = x.z || 0;
  } else if (x instanceof Array) {
    a = x[0] || 0;
    b = x[1] || 0;
    c = x[2] || 0;
  } else {
    a = x || 0;
    b = y || 0;
    c = z || 0;
  }
  return this.x === a && this.y === b && this.z === c;
};


// Static Methods


/**
 * Make a new 2D unit vector from an angle
 *
 * @method fromAngle
 * @static
 * @param {Number}     angle the desired angle
 * @return {p5.Vector}       the new p5.Vector object
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background (200);
 *
 *   // Create a variable, proportional to the mouseX,
 *   // varying from 0-360, to represent an angle in degrees.
 *   angleMode(DEGREES);
 *   var myDegrees = map(mouseX, 0,width, 0,360);
 *
 *   // Display that variable in an onscreen text.
 *   // (Note the nfc() function to truncate additional decimal places,
 *   // and the "\xB0" character for the degree symbol.)
 *   var readout = "angle = " + nfc(myDegrees,1,1) + "\xB0"
 *   noStroke();
 *   fill (0);
 *   text (readout, 5, 15);
 *
 *   // Create a p5.Vector using the fromAngle function,
 *   // and extract its x and y components.
 *   var v = p5.Vector.fromAngle(radians(myDegrees));
 *   var vx = v.x;
 *   var vy = v.y;
 *
 *   push();
 *   translate (width/2, height/2);
 *   noFill();
 *   stroke (150);
 *   line (0,0, 30,0);
 *   stroke (0);
 *   line (0,0, 30*vx, 30*vy);
 *   pop()
 * }
 * </code>
 * </div>
 */
p5.Vector.fromAngle = function(angle) {
  if (this.p5) {
    if (this.p5._angleMode === constants.DEGREES) {
      angle = polarGeometry.degreesToRadians(angle);
    }
  }
  if (this.p5) {
    return new p5.Vector(this.p5,[Math.cos(angle),Math.sin(angle),0]);
  } else {
    return new p5.Vector(Math.cos(angle),Math.sin(angle),0);
  }
};

/**
 * Make a new 2D unit vector from a random angle
 *
 * @method random2D
 * @static
 * @return {p5.Vector} the new p5.Vector object
 * @example
 * <div class="norender">
 * <code>
 * var v = p5.Vector.random2D();
 * // May make v's attributes something like:
 * // [0.61554617, -0.51195765, 0.0] or
 * // [-0.4695841, -0.14366731, 0.0] or
 * // [0.6091097, -0.22805278, 0.0]
 * </code>
 * </div>
 */
p5.Vector.random2D = function () {
  var angle;
  // A lot of nonsense to determine if we know about a
  // p5 sketch and whether we should make a random angle in degrees or radians
  if (this.p5) {
    if (this.p5._angleMode === constants.DEGREES) {
      angle = this.p5.random(360);
    } else {
      angle = this.p5.random(constants.TWO_PI);
    }
  } else {
    angle = Math.random()*Math.PI*2;
  }
  return this.fromAngle(angle);
};

/**
 * Make a new random 3D unit vector.
 *
 * @method random3D
 * @static
 * @return {p5.Vector} the new p5.Vector object
 * @example
 * <div class="norender">
 * <code>
 * var v = p5.Vector.random3D();
 * // May make v's attributes something like:
 * // [0.61554617, -0.51195765, 0.599168] or
 * // [-0.4695841, -0.14366731, -0.8711202] or
 * // [0.6091097, -0.22805278, -0.7595902]
 * </code>
 * </div>
 */
p5.Vector.random3D = function () {
  var angle,vz;
  // If we know about p5
  if (this.p5) {
    angle = this.p5.random(0,constants.TWO_PI);
    vz = this.p5.random(-1,1);
  } else {
    angle = Math.random()*Math.PI*2;
    vz = Math.random()*2-1;
  }
  var vx = Math.sqrt(1-vz*vz)*Math.cos(angle);
  var vy = Math.sqrt(1-vz*vz)*Math.sin(angle);
  if (this.p5) {
    return new p5.Vector(this.p5,[vx,vy,vz]);
  } else {
    return new p5.Vector(vx,vy,vz);
  }
};


/**
 * Adds two vectors together and returns a new one.
 *
 * @static
 * @param  {p5.Vector} v1 a p5.Vector to add
 * @param  {p5.Vector} v2 a p5.Vector to add
 * @param  {p5.Vector} target if undefined a new vector will be created
 * @return {p5.Vector} the resulting p5.Vector
 *
 */

p5.Vector.add = function (v1, v2, target) {
  if (!target) {
    target = v1.copy();
  } else {
    target.set(v1);
  }
  target.add(v2);
  return target;
};

/**
 * Subtracts one p5.Vector from another and returns a new one.  The second
 * vector (v2) is subtracted from the first (v1), resulting in v1-v2.
 *
 * @static
 * @param  {p5.Vector} v1 a p5.Vector to subtract from
 * @param  {p5.Vector} v2 a p5.Vector to subtract
 * @param  {p5.Vector} target if undefined a new vector will be created
 * @return {p5.Vector} the resulting p5.Vector
 */

p5.Vector.sub = function (v1, v2, target) {
  if (!target) {
    target = v1.copy();
  } else {
    target.set(v1);
  }
  target.sub(v2);
  return target;
};


/**
 * Multiplies a vector by a scalar and returns a new vector.
 *
 * @static
 * @param  {p5.Vector} v the p5.Vector to multiply
 * @param  {Number}  n the scalar
 * @param  {p5.Vector} target if undefined a new vector will be created
 * @return {p5.Vector}  the resulting new p5.Vector
 */
p5.Vector.mult = function (v, n, target) {
  if (!target) {
    target = v.copy();
  } else {
    target.set(v);
  }
  target.mult(n);
  return target;
};

/**
 * Divides a vector by a scalar and returns a new vector.
 *
 * @static
 * @param  {p5.Vector} v the p5.Vector to divide
 * @param  {Number}  n the scalar
 * @param  {p5.Vector} target if undefined a new vector will be created
 * @return {p5.Vector} the resulting new p5.Vector
 */
p5.Vector.div = function (v, n, target) {
  if (!target) {
    target = v.copy();
  } else {
    target.set(v);
  }
  target.div(n);
  return target;
};


/**
 * Calculates the dot product of two vectors.
 *
 * @static
 * @param  {p5.Vector} v1 the first p5.Vector
 * @param  {p5.Vector} v2 the second p5.Vector
 * @return {Number}     the dot product
 */
p5.Vector.dot = function (v1, v2) {
  return v1.dot(v2);
};

/**
 * Calculates the cross product of two vectors.
 *
 * @static
 * @param  {p5.Vector} v1 the first p5.Vector
 * @param  {p5.Vector} v2 the second p5.Vector
 * @return {Number}     the cross product
 */
p5.Vector.cross = function (v1, v2) {
  return v1.cross(v2);
};

/**
 * Calculates the Euclidean distance between two points (considering a
 * point as a vector object).
 *
 * @static
 * @param  {p5.Vector} v1 the first p5.Vector
 * @param  {p5.Vector} v2 the second p5.Vector
 * @return {Number}     the distance
 */
p5.Vector.dist = function (v1,v2) {
  return v1.dist(v2);
};

/**
 * Linear interpolate a vector to another vector and return the result as a
 * new vector.
 *
 * @static
 * @param {p5.Vector} v1 a starting p5.Vector
 * @param {p5.Vector} v2 the p5.Vector to lerp to
 * @param {Number}       the amount of interpolation; some value between 0.0
 *                       (old vector) and 1.0 (new vector). 0.1 is very near
 *                       the new vector. 0.5 is halfway in between.
 */
p5.Vector.lerp = function (v1, v2, amt, target) {
  if (!target) {
    target = v1.copy();
  } else {
    target.set(v1);
  }
  target.lerp(v2, amt);
  return target;
};

/**
 * Calculates and returns the angle (in radians) between two vectors.
 * @method angleBetween
 * @static
 * @param  {p5.Vector} v1 the x, y, and z components of a p5.Vector
 * @param  {p5.Vector} v2 the x, y, and z components of a p5.Vector
 * @return {Number}       the angle between (in radians)
 * @example
 * <div class="norender">
 * <code>
 * var v1 = createVector(1, 0, 0);
 * var v2 = createVector(0, 1, 0);
 *
 * var angle = p5.Vector.angleBetween(v1, v2);
 * // angle is PI/2
 * </code>
 * </div>
 */
p5.Vector.angleBetween = function (v1, v2) {
  var angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  if (this.p5) {
    if (this.p5._angleMode === constants.DEGREES) {
      angle = polarGeometry.radiansToDegrees(angle);
    }
  }
  return angle;
};

module.exports = p5.Vector;

},{"../core/constants":15,"../core/core":16,"./polargeometry":45}],45:[function(require,module,exports){

module.exports = {

  degreesToRadians: function(x) {
    return 2 * Math.PI * x / 360;
  },

  radiansToDegrees: function(x) {
    return 360 * x / (2 * Math.PI);
  }

};

},{}],46:[function(require,module,exports){
/**
 * @module Math
 * @submodule Random
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

var seeded = false;

// Linear Congruential Generator
// Variant of a Lehman Generator
var lcg = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
  // m is basically chosen to be large (as it is the max period)
  // and for its relationships to a and c
  var m = 4294967296,
    // a - 1 should be divisible by m's prime factors
    a = 1664525,
    // c and m should be co-prime
    c = 1013904223,
    seed, z;
  return {
    setSeed : function(val) {
      // pick a random seed if val is undefined or null
      // the >>> 0 casts the seed to an unsigned 32-bit integer
      z = seed = (val == null ? Math.random() * m : val) >>> 0;
    },
    getSeed : function() {
      return seed;
    },
    rand : function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      // return a float in [0, 1)
      // if z = m then z / m = 0 therefore (z % m) / m < 1 always
      return z / m;
    }
  };
}());

/**
 * Sets the seed value for random().
 *
 * By default, random() produces different results each time the program
 * is run. Set the seed parameter to a constant to return the same
 * pseudo-random numbers each time the software is run.
 *
 * @method randomSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>
 * randomSeed(99);
 * for (var i=0; i < 100; i++) {
 *   var r = random(0, 255);
 *   stroke(r);
 *   line(i, 0, i, 100);
 * }
 * </code>
 * </div>
 */
p5.prototype.randomSeed = function(seed) {
  lcg.setSeed(seed);
  seeded = true;
};

/**
 * Return a random number.
 *
 * Takes either 0, 1 or 2 arguments.
 * If no argument is given, returns a random number between 0 and 1.
 * If one argument is given, returns a random number between 0 and the number.
 * If two arguments are given, returns a random number between them,
 * inclusive.
 *
 * @method random
 * @param  {Number} min   the lower bound
 * @param  {Number} max   the upper bound
 * @return {Number} the random number
 * @example
 * <div>
 * <code>
 * for (var i = 0; i < 100; i++) {
 *   var r = random(50);
 *   stroke(r*5);
 *   line(50, i, 50+r, i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * for (var i = 0; i < 100; i++) {
 *   var r = random(-50, 50);
 *   line(50,i,50+r,i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // Get a random element from an array
 * var words = [ "apple", "bear", "cat", "dog" ];
 * var index = floor(random(words.length));  // Convert to integer
 * text(words[index],10,50);  // Displays one of the four words
 * </code>
 * </div>
 */
p5.prototype.random = function (min, max) {

  var rand;

  if (seeded) {
    rand  = lcg.rand();
  } else {
    rand = Math.random();
  }

  if (arguments.length === 0) {
    return rand;
  } else
  if (arguments.length === 1) {
    return rand * min;
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max-min) + min;
  }
};


/**
 *
 * Returns a random number fitting a Gaussian, or
 * normal, distribution. There is theoretically no minimum or maximum
 * value that <b>randomGaussian()</b> might return. Rather, there is
 * just a very low probability that values far from the mean will be
 * returned; and a higher probability that numbers near the mean will
 * be returned.
 * Takes either 0, 1 or 2 arguments.
 * If no args, returns a mean of 0 and standard deviation of 1
 * If one arg, that arg is the mean (standard deviation is 1)
 * If two args, first is mean, second is standard deviation
 *
 * @method randomGaussian
 * @param  {Number} mean  the mean
 * @param  {Number} sd    the standard deviation
 * @return {Number} the random number
 * @example
 * <div>
 * <code>for (var y = 0; y < 100; y++) {
 *  var x = randomGaussian(50,15);
 *  line(50, y, x, y);
 *}
 * </code>
 * </div>
 * <div>
 * <code>
 *var distribution = new Array(360);
 *
 *function setup() {
 *  createCanvas(100, 100);
 *  for (var i = 0; i < distribution.length; i++) {
 *    distribution[i] = floor(randomGaussian(0,15));
 *  }
 *}
 *
 *function draw() {
 *  background(204);
 *
 *  translate(width/2, width/2);
 *
 *  for (var i = 0; i < distribution.length; i++) {
 *    rotate(TWO_PI/distribution.length);
 *    stroke(0);
 *    var dist = abs(distribution[i]);
 *    line(0, 0, dist, 0);
 *  }
 *}
 * </code>
 * </div>
 */
var y2;
var previous = false;
p5.prototype.randomGaussian = function(mean, sd)  {
  var y1,x1,x2,w;
  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    do {
      x1 = this.random(2) - 1;
      x2 = this.random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w))/w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  var m = mean || 0;
  var s = sd || 1;
  return y1*s + m;
};

module.exports = p5;

},{"../core/core":16}],47:[function(require,module,exports){
/**
 * @module Math
 * @submodule Trigonometry
 * @for p5
 * @requires core
 * @requires polargeometry
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var polarGeometry = require('./polargeometry');
var constants = require('../core/constants');

p5.prototype._angleMode = constants.RADIANS;

/**
 * The inverse of cos(), returns the arc cosine of a value. This function
 * expects the values in the range of -1 to 1 and values are returned in
 * the range 0 to PI (3.1415927).
 *
 * @method acos
 * @param  {Number} value the value whose arc cosine is to be returned
 * @return {Number}       the arc cosine of the given value
 *
 * @example
 * <div class= “norender">
 * <code>
 * var a = PI;
 * var c = cos(a);
 * var ac = acos(c);
 * // Prints: "3.1415927 : -1.0 : 3.1415927"
 * println(a + " : " + c + " : " +  ac);
 * </code>
 * </div>
 *
 * <div class= “norender">
 * <code>
 * var a = PI + PI/4.0;
 * var c = cos(a);
 * var ac = acos(c);
 * // Prints: "3.926991 : -0.70710665 : 2.3561943"
 * println(a + " : " + c + " : " +  ac);
 * </code>
 * </div>
 */
p5.prototype.acos = function(ratio) {
  if (this._angleMode === constants.RADIANS) {
    return Math.acos(ratio);
  } else {
    return polarGeometry.radiansToDegrees(Math.acos(ratio));
  }
};

/**
 * The inverse of sin(), returns the arc sine of a value. This function
 * expects the values in the range of -1 to 1 and values are returned
 * in the range -PI/2 to PI/2.
 *
 * @method asin
 * @param  {Number} value the value whose arc sine is to be returned
 * @return {Number}       the arc sine of the given value
 *
 * @example
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3;
 * var s = sin(a);
 * var as = asin(s);
 * // Prints: "1.0471976 : 0.86602545 : 1.0471976"
 * println(a + " : " + s + " : " +  as);
 * </code>
 * </div>
 *
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3.0;
 * var s = sin(a);
 * var as = asin(s);
 * // Prints: "4.1887903 : -0.86602545 : -1.0471976"
 * println(a + " : " + s + " : " +  as);
 * </code>
 * </div>
 *
 */
p5.prototype.asin = function(ratio) {
  if (this._angleMode === constants.RADIANS) {
    return Math.asin(ratio);
  } else {
    return polarGeometry.radiansToDegrees(Math.asin(ratio));
  }
};

/**
 * The inverse of tan(), returns the arc tangent of a value. This function
 * expects the values in the range of -Infinity to Infinity (exclusive) and
 * values are returned in the range -PI/2 to PI/2.
 *
 * @method atan
 * @param  {Number} value the value whose arc tangent is to be returned
 * @return {Number}       the arc tangent of the given value
 *
 * @example
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3;
 * var t = tan(a);
 * var at = atan(t);
 * // Prints: "1.0471976 : 1.7320509 : 1.0471976"
 * println(a + " : " + t + " : " +  at);
 * </code>
 * </div>
 *
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3.0;
 * var t = tan(a);
 * var at = atan(t);
 * // Prints: "4.1887903 : 1.7320513 : 1.0471977"
 * println(a + " : " + t + " : " +  at);
 * </code>
 * </div>
 *
 */
p5.prototype.atan = function(ratio) {
  if (this._angleMode === constants.RADIANS) {
    return Math.atan(ratio);
  } else {
    return polarGeometry.radiansToDegrees(Math.atan(ratio));
  }
};

/**
 * Calculates the angle (in radians) from a specified point to the coordinate
 * origin as measured from the positive x-axis. Values are returned as a
 * float in the range from PI to -PI. The atan2() function is most often used
 * for orienting geometry to the position of the cursor. Note: The
 * y-coordinate of the point is the first parameter, and the x-coordinate is
 * the second parameter, due the the structure of calculating the tangent.
 *
 * @method atan2
 * @param  {Number} y y-coordinate of the point
 * @param  {Number} x x-coordinate of the point
 * @return {Number}   the arc tangent of the given point
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(204);
 *   translate(width/2, height/2);
 *   var a = atan2(mouseY-height/2, mouseX-width/2);
 *   rotate(a);
 *   rect(-30, -5, 60, 10);
 * }
 * </code>
 * </div>
 */
p5.prototype.atan2 = function (y, x) {
  if (this._angleMode === constants.RADIANS) {
    return Math.atan2(y, x);
  } else {
    return polarGeometry.radiansToDegrees(Math.atan2(y, x));
  }
};

/**
 * Calculates the cosine of an angle. This function takes into account the
 * current angleMode. Values are returned in the range -1 to 1.
 *
 * @method cos
 * @param  {Number} angle the angle
 * @return {Number}       the cosine of the angle
 *
 * @example
 * <div>
 * <code>
 * var a = 0.0;
 * var inc = TWO_PI/25.0;
 * for (var i = 0; i < 25; i++) {
 *   line(i*4, 50, i*4, 50+cos(a)*40.0);
 *   a = a + inc;
 * }
 * </code>
 * </div>
 *
 */
p5.prototype.cos = function(angle) {
  if (this._angleMode === constants.RADIANS) {
    return Math.cos(angle);
  } else {
    return Math.cos(this.radians(angle));
  }
};

/**
 * Calculates the sine of an angle. This function takes into account the
 * current angleMode. Values are returned in the range -1 to 1.
 *
 * @method sin
 * @param  {Number} angle the angle
 * @return {Number}       the sine of the angle
 *
 * @example
 * <div>
 * <code>
 * var a = 0.0;
 * var inc = TWO_PI/25.0;
 * for (var i = 0; i < 25; i++) {
 *   line(i*4, 50, i*4, 50+sin(a)*40.0);
 *   a = a + inc;
 * }
 * </code>
 * </div>
 */
p5.prototype.sin = function(angle) {
  if (this._angleMode === constants.RADIANS) {
    return Math.sin(angle);
  } else {
    return Math.sin(this.radians(angle));
  }
};

/**
 * Calculates the tangent of an angle. This function takes into account
 * the current angleMode. Values are returned in the range -1 to 1.
 *
 * @method tan
 * @param  {Number} angle the angle
 * @return {Number}       the tangent of the angle
 *
 * @example
 * <div>
 * <code>
 *   var a = 0.0;
 *   var inc = TWO_PI/50.0;
 *   for (var i = 0; i < 100; i = i+2) {
 *     line(i, 50, i, 50+tan(a)*2.0);
 *     a = a + inc;
 *   }
 * </code>
 * </div>
 *
 */
p5.prototype.tan = function(angle) {
  if (this._angleMode === constants.RADIANS) {
    return Math.tan(angle);
  } else {
    return Math.tan(this.radians(angle));
  }
};

/**
 * Converts a radian measurement to its corresponding value in degrees.
 * Radians and degrees are two ways of measuring the same thing. There are
 * 360 degrees in a circle and 2*PI radians in a circle. For example,
 * 90° = PI/2 = 1.5707964.
 *
 * @method degrees
 * @param  {Number} radians the radians value to convert to degrees
 * @return {Number}         the converted angle
 *
 *
 * @example
 * <div class= “norender">
 * <code>
 * var rad = PI/4;
 * var deg = degrees(rad);
 * println(rad + " radians is " + deg + " degrees");
 * // Prints: 45 degrees is 0.7853981633974483 radians
 * </code>
 * </div>
 *
 */
p5.prototype.degrees = function(angle) {
  return polarGeometry.radiansToDegrees(angle);
};

/**
 * Converts a degree measurement to its corresponding value in radians.
 * Radians and degrees are two ways of measuring the same thing. There are
 * 360 degrees in a circle and 2*PI radians in a circle. For example,
 * 90° = PI/2 = 1.5707964.
 *
 * @method radians
 * @param  {Number} degrees the degree value to convert to radians
 * @return {Number}         the converted angle
 *
 * @example
 * <div class= “norender">
 * <code>
 * var deg = 45.0;
 * var rad = radians(deg);
 * println(deg + " degrees is " + rad + " radians");
 * // Prints: 45 degrees is 0.7853981633974483 radians
 * </code>
 * </div>
 */
p5.prototype.radians = function(angle) {
  return polarGeometry.degreesToRadians(angle);
};

/**
 * Sets the current mode of p5 to given mode. Default mode is RADIANS.
 *
 * @method angleMode
 * @param {Number/Constant} mode either RADIANS or DEGREES
 *
 * @example
 * <div>
 * <code>
 * function draw(){
 *   background(204);
 *   angleMode(DEGREES); // Change the mode to DEGREES
 *   var a = atan2(mouseY-height/2, mouseX-width/2);
 *   translate(width/2, height/2);
 *   push();
 *   rotate(a);
 *   rect(-20, -5, 40, 10); // Larger rectangle is rotating in degrees
 *   pop();
 *   angleMode(RADIANS); // Change the mode to RADIANS
 *   rotate(a); // var a stays the same
 *   rect(-40, -5, 20, 10); // Smaller rectangle is rotating in radians
 * }
 * </code>
 * </div>
 *
 */
p5.prototype.angleMode = function(mode) {
  if (mode === constants.DEGREES || mode === constants.RADIANS) {
    this._angleMode = mode;
  }
};

module.exports = p5;

},{"../core/constants":15,"../core/core":16,"./polargeometry":45}],48:[function(require,module,exports){
/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

p5.prototype._textSize = 12;
p5.prototype._textLeading = 15;
p5.prototype._textFont = 'sans-serif';
p5.prototype._textStyle = constants.NORMAL;
p5.prototype._textAscent = null;
p5.prototype._textDescent = null;

/**
 * Sets the current alignment for drawing text. The parameters LEFT, CENTER,
 * and RIGHT set the display characteristics of the letters in relation to
 * the values for the x and y parameters of the text() function.
 *
 * @method textAlign
 * @param {Number/Constant} h horizontal alignment, either LEFT,
 *                            CENTER, or RIGHT
 * @param {Number/Constant} v vertical alignment, either TOP,
 *                            BOTTOM, CENTER, or BASELINE
 * @return {Number}
 * @example
 * <div>
 * <code>
 * textSize(16);
 * textAlign(RIGHT);
 * text("ABCD", 50, 30);
 * textAlign(CENTER);
 * text("EFGH", 50, 50);
 * textAlign(LEFT);
 * text("IJKL", 50, 70);
 * </code>
 * </div>
 */
p5.prototype.textAlign = function(h, v) {

  return this._graphics.textAlign(h,v);
};

/**
 * Sets/gets the spacing between lines of text in units of pixels. This
 * setting will be used in all subsequent calls to the text() function.
 *
 * @method textLeading
 * @param {Number} l the size in pixels for spacing between lines
 * @return {Object|Number}
 * @example
 * <div>
 * <code>
 * // Text to display. The "\n" is a "new line" character
 * lines = "L1\nL2\nL3";
 * textSize(12);
 * fill(0);  // Set fill to black
 *
 * textLeading(10);  // Set leading to 10
 * text(lines, 10, 25);
 *
 * textLeading(20);  // Set leading to 20
 * text(lines, 40, 25);
 *
 * textLeading(30);  // Set leading to 30
 * text(lines, 70, 25);
 * </code>
 * </div>
 */
p5.prototype.textLeading = function(l) {

  if (arguments.length) {

    this._setProperty('_textLeading', l);
    return this;
  }

  return this._textLeading;
};

/**
 * Sets/gets the current font size. This size will be used in all subsequent
 * calls to the text() function. Font size is measured in units of pixels.
 *
 * @method textSize
 * @param {Number} s the size of the letters in units of pixels
 * @return {Object|Number}
 * @example
 * <div>
 * <code>
 * textSize(12);
 * text("Font Size 12", 10, 30);
 * textSize(14);
 * text("Font Size 14", 10, 60);
 * textSize(16);
 * text("Font Size 16", 10, 90);
 * </code>
 * </div>
 */
p5.prototype.textSize = function(s) {

  if (arguments.length) {

    this._setProperty('_textSize', s);
    this._setProperty('_textLeading', s * constants._DEFAULT_LEADMULT);
    return this._graphics._applyTextProperties();
  }

  return this._textSize;
};

/**
 * Sets/gets the style of the text to NORMAL, ITALIC, or BOLD. Note this is
 * overridden by CSS styling.
 * (Style only apply to system font, for custom fonts, please load styled
 * fonts instead.)
 *
 * @method textStyle
 * @param {Number/Constant} s styling for text, either NORMAL,
 *                            ITALIC, or BOLD
 * @return {Object|String}
 * @example
 * <div>
 * <code>
 * fill(0);
 * strokeWeight(0);
 * textSize(12);
 * textStyle(NORMAL);
 * text("Font Style Normal", 10, 30);
 * textStyle(ITALIC);
 * text("Font Style Italic", 10, 60);
 * textStyle(BOLD);
 * text("Font Style Bold", 10, 90);
 * </code>
 * </div>
 */
p5.prototype.textStyle = function(s) {

  if (arguments.length) {

    if (s === constants.NORMAL ||
      s === constants.ITALIC ||
      s === constants.BOLD) {
      this._setProperty('_textStyle', s);
    }

    return this._graphics._applyTextProperties();
  }

  return this._textStyle;
};

/**
 * Calculates and returns the width of any character or text string.
 *
 * @method textWidth
 * @param {String} s the String of characters to measure
 * @return {Number}
 * @example
 * <div>
 * <code>
 * textSize(28);
 *
 * var c = 'P';
 * var cw = textWidth(c);
 * text(c, 0, 40);
 * line(cw, 0, cw, 50);
 *
 * var s = "p5.js";
 * var sw = textWidth(s);
 * text(s, 0, 85);
 * line(sw, 50, sw, 100);
 * </code>
 * </div>
 */
p5.prototype.textWidth = function(s) {

  return this._graphics.textWidth(s);
};

/**
 * Returns ascent of the current font at its current size.
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32);  // Set initial text size
 * var a = textAscent() * scalar;  // Calc ascent
 * line(0, base-a, width, base-a);
 * text("dp", 0, base);  // Draw text on baseline
 *
 * textSize(64);  // Increase text size
 * a = textAscent() * scalar;  // Recalc ascent
 * line(40, base-a, width, base-a);
 * text("dp", 40, base);  // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textAscent = function() {
  if (this._textAscent === null) {
    this._updateTextMetrics();
  }
  return this._textAscent;
};

/*p5.prototype.fontMetrics = function(font, text, x, y, fontSize) {

  var xMins = [], yMins = [], xMaxs= [], yMaxs = [], p5 = this;
  //font = font || this._textFont;
  fontSize = fontSize || p5._textSize;

  font.forEachGlyph(text, x, y, fontSize,
    {}, function(glyph, gX, gY, gFontSize) {

      var gm = glyph.getMetrics();

      gX = gX !== undefined ? gX : 0;
      gY = gY !== undefined ? gY : 0;
      fontSize = fontSize !== undefined ? fontSize : 24;

      var scale = 1 / font.unitsPerEm * fontSize;

      p5.noFill();
      p5.rectMode(p5.CORNERS);
      p5.rect(gX + (gm.xMin * scale), gY + (-gm.yMin * scale),
              gX + (gm.xMax * scale), gY + (-gm.yMax * scale));

      p5.rectMode(p5.CORNER);
  });

  return { // metrics
      xMin: Math.min.apply(null, xMins),
      yMin: Math.min.apply(null, yMins),
      xMax: Math.max.apply(null, xMaxs),
      yMax: Math.max.apply(null, yMaxs)
  };
};*/

/**
 * Returns descent of the current font at its current size.
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32);  // Set initial text size
 * var a = textDescent() * scalar;  // Calc ascent
 * line(0, base+a, width, base+a);
 * text("dp", 0, base);  // Draw text on baseline
 *
 * textSize(64);  // Increase text size
 * a = textDescent() * scalar;  // Recalc ascent
 * line(40, base+a, width, base+a);
 * text("dp", 40, base);  // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textDescent = function() {

  if (this._textDescent === null) {
    this._updateTextMetrics();
  }
  return this._textDescent;
};

/**
 * Helper fxn to check font type (system or otf)
 */
p5.prototype._isOpenType = function(f) {

  f = f || this._textFont;
  return (typeof f === 'object' && f.font && f.font.supported);
};

/**
 * Helper fxn to measure ascent and descent.
 */
p5.prototype._updateTextMetrics = function() {

  if (this._isOpenType()) {

    this._setProperty('_textAscent', this._textFont._textAscent());
    this._setProperty('_textDescent', this._textFont._textDescent());
    return this;
  }

  // Adapted from http://stackoverflow.com/a/25355178
  var text = document.createElement('span');
  text.style.fontFamily = this._textFont;
  text.style.fontSize = this._textSize + 'px';
  text.innerHTML = 'ABCjgq|';

  var block = document.createElement('div');
  block.style.display = 'inline-block';
  block.style.width = '1px';
  block.style.height = '0px';

  var container = document.createElement('div');
  container.appendChild(text);
  container.appendChild(block);

  container.style.height = '0px';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  block.style.verticalAlign = 'baseline';
  var blockOffset = this._calculateOffset(block);
  var textOffset = this._calculateOffset(text);
  var ascent = blockOffset[1] - textOffset[1];

  block.style.verticalAlign = 'bottom';
  blockOffset = this._calculateOffset(block);
  textOffset = this._calculateOffset(text);
  var height = blockOffset[1] - textOffset[1];
  var descent = height - ascent;

  document.body.removeChild(container);

  this._setProperty('_textAscent', ascent);
  this._setProperty('_textDescent', descent);

  return this;
};

/**
 * Helper fxn to measure ascent and descent.
 * Adapted from http://stackoverflow.com/a/25355178
 */
p5.prototype._calculateOffset = function(object) {
  var currentLeft = 0,
    currentTop = 0;
  if (object.offsetParent) {
    do {
      currentLeft += object.offsetLeft;
      currentTop += object.offsetTop;
    } while (object = object.offsetParent);
  } else {
    currentLeft += object.offsetLeft;
    currentTop += object.offsetTop;
  }
  return [currentLeft, currentTop];
};

module.exports = p5;

},{"../core/constants":15,"../core/core":16}],49:[function(require,module,exports){
/**
 * @module Typography
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

require('../core/error_helpers');


/**
 * Draws text to the screen. Displays the information specified in the first
 * parameter on the screen in the position specified by the additional
 * parameters. A default font will be used unless a font is set with the
 * textFont() function and a default size will be used unless a font is set
 * with textSize(). Change the color of the text with the fill() function.
 * Change the outline of the text with the stroke() and strokeWeight()
 * functions.
 *
 * The text displays in relation to the textAlign() function, which gives the
 * option to draw to the left, right, and center of the coordinates.
 *
 * The x2 and y2 parameters define a rectangular area to display within and
 * may only be used with string data. When these parameters are specified,
 * they are interpreted based on the current rectMode() setting. Text that
 * does not fit completely within the rectangle specified will not be drawn
 * to the screen.
 *
 * @method text
 * @param {String} str the alphanumeric symbols to be displayed
 * @param {Number} x   x-coordinate of text
 * @param {Number} y   y-coordinate of text
 * @param {Number} x2  by default, the width of the text box,
 *                     see rectMode() for more info
 * @param {Number} y2  by default, the height of the text box,
 *                     see rectMode() for more info
 * @return {Object} this
 * @example
 * <div>
 * <code>
 * textSize(32);
 * text("word", 10, 30);
 * fill(0, 102, 153);
 * text("word", 10, 60);
 * fill(0, 102, 153, 51);
 * text("word", 10, 90);
 * </code>
 * </div>
 * <div>
 * <code>
 * s = "The quick brown fox jumped over the lazy dog.";
 * fill(50);
 * text(s, 10, 10, 70, 80); // Text wraps within text box
 * </code>
 * </div>
 */
p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {

  this._validateParameters(
    'text',
    arguments,
    [
      ['*', 'Number', 'Number'],
      ['*', 'Number', 'Number', 'Number', 'Number']
    ]
  );

  return (!(this._doFill || this._doStroke)) ? this :
    this._graphics.text.apply(this._graphics, arguments);
};

/**
 * Sets the current font that will be drawn with the text() function.
 *
 * @method textFont
 * @param {Object|String} f a font loaded via loadFont(), or a String
 *  representing a browser-based dfault font.
 * @return {Object} this
 * @example
 * <div>
 * <code>
 * fill(0);
 * textSize(12);
 * textFont("Georgia");
 * text("Georgia", 12, 30);
 * textFont("Helvetica");
 * text("Helvetica", 12, 60);
 * </code>
 * </div>
 * <div>
 * <code>
 * var fontRegular, fontItalic, fontBold;
 * function preload() {
 *    fontRegular = loadFont("assets/Regular.otf");
 *    fontItalic = loadFont("assets/Italic.ttf");
 *    fontBold = loadFont("assets/Bold.ttf");
 * }
 * function setup() {
 *    background(210);
 *    fill(0).strokeWeight(0).textSize(10);
 *    textFont(fontRegular);
 *    text("Font Style Normal", 10, 30);
 *    textFont(fontItalic);
 *    text("Font Style Italic", 10, 50);
 *    textFont(fontBold);
 *    text("Font Style Bold", 10, 70);
 * }
 * </code>
 * </div>
 */
p5.prototype.textFont = function(theFont, theSize) {

  if (arguments.length) {

    if (!theFont) {

      throw Error('null font passed to textFont');
    }

    this._setProperty('_textFont', theFont);

    if (theSize) {

      this._setProperty('_textSize', theSize);
      this._setProperty('_textLeading',
        theSize * constants._DEFAULT_LEADMULT);
    }

    return this._graphics._applyTextProperties();
  }

  return this;
};

module.exports = p5;

},{"../core/constants":15,"../core/core":16,"../core/error_helpers":19}],50:[function(require,module,exports){
/**
 * This module defines the p5.Font class and P5 methods for
 * drawing text to the main display canvas.
 * @module Typography
 * @submodule Font
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

/*
 * TODO:
 *
 * API:
 * -- textBounds()
 * -- getPath()
 * -- getPoints()
 *
 * ===========================================
 *
 * -- var fonts = loadFont([]);
 *
 * -- PFont functions:
 *    PFont.list()
 *
 * -- kerning
 * -- Integrating p5.dom (later)
 * -- alignment: justified?
 * -- truncation?
 * -- drop-caps?
 */

/**
 * Base class for font handling
 * @class p5.Font
 * @constructor
 * @param {Object} [pInst] pointer to p5 instance
 */
p5.Font = function(p) {

  this.parent = p;

  this.cache = {};

  /**
   * Underlying opentype font implementation
   * @property font
   */
  this.font = undefined;
};

p5.Font.prototype.list = function() {

  // TODO
  throw 'not yet implemented';
};

/**
 * Returns a tight bounding box for the given text string using this
 * font (currently only supports single lines)
 *
 * @method textBounds
 * @param  {String} line     a line of text
 * @param  {Number} x        x-position
 * @param  {Number} y        y-position
 * @param  {Number} fontSize font size to use (optional)
 * @param  {Object} options opentype options (optional)
 *
 * @return {Object}          a rectangle object with properties: x, y, w, h
 *
 * @example
 * <div>
 * <code>
 * var font;
 * var text = 'Lorem ipsum dolor sit amet.';
 * function preload() {
 *    font = loadFont('./assets/fonts/Regular.otf');
 * };
 * function setup() {
 *    background(210);

 *    var bbox = font.textBounds(text, 10, 30, 12);
 *    fill(255);
 *    stroke(0);
 *    rect(bbox.x, bbox.y, bbox.w, bbox.h);
 *    fill(0);
 *    noStroke();
 *     *    textFont(font);
  *    textSize(12);
 *    text(text, 10, 30);
 * };
 * </code>
 * </div>
 */
p5.Font.prototype.textBounds = function(str, x, y, fontSize, options) {

  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize || this.parent._textSize;

  //console.log('textBounds(',str, x, y, fontSize,')');

  var result = this.cache[cacheKey('textBounds', str, x, y, fontSize)];
  if (!result) {

    // console.log('computing');
    if (str !== ' ') {

      var xCoords = [],
        yCoords = [],
        scale = this._scale(fontSize),
        minX, minY, maxX, maxY;

      this.font.forEachGlyph(str, x, y, fontSize, options,
        function(glyph, gX, gY, gFontSize) {

          if (glyph.name !== 'space') {

            gX = gX !== undefined ? gX : 0;
            gY = gY !== undefined ? gY : 0;

            var gm = glyph.getMetrics();
            xCoords.push(gX + (gm.xMin * scale));
            yCoords.push(gY + (-gm.yMin * scale));
            xCoords.push(gX + (gm.xMax * scale));
            yCoords.push(gY + (-gm.yMax * scale));
          }
        });

      minX = Math.min.apply(null, xCoords);
      minY = Math.min.apply(null, yCoords);
      maxX = Math.max.apply(null, xCoords);
      maxY = Math.max.apply(null, yCoords);

      result = {
        x: minX,
        y: minY,
        h: maxY - minY,
        w: maxX - minX,
        advance: minX - x
      };
    } else { // special case ' ' for now

      var tw = this._textWidth(str);
      result = {
        x: x,
        y: y,
        h: 0,
        w: tw,
        advance: 0 // ?
      };
    }

    this.cache[cacheKey('textBounds', str, x, y, fontSize)] = result;
  }
  //else { console.log('cache-hit'); }

  return result;
};

// ----------------------------- End API ------------------------------

/**
 * Returns the set of opentype glyphs for the supplied string.
 *
 * Note that there is not a strict one-to-one mapping between characters
 * and glyphs, so the list of returned glyphs can be larger or smaller
 *  than the length of the given string.
 *
 * @param  {String} str the string to be converted
 * @return {array}     the opentype glyphs
 */
p5.Font.prototype._getGlyphs = function(str) {

  return this.font.stringToGlyphs(str);
};

/**
 * Returns an opentype path for the supplied string and position.
 *
 * @param  {String} line     a line of text
 * @param  {Number} x        x-position
 * @param  {Number} y        y-position
 * @param  {Object} options opentype options (optional)
 * @return {Object}     the opentype path
 */
p5.Font.prototype._getPath = function(line, x, y, options) {

  var p = this.parent,
    ctx = p._graphics.drawingContext,
    pos = this._handleAlignment(p, ctx, line, x, y);

  return this.font.getPath(line, pos.x, pos.y, p._textSize, options);
};

/*
 * Creates an SVG-formatted path-data string
 * (See http://www.w3.org/TR/SVG/paths.html#PathData)
 * from the given opentype path or string/position
 *
 * @param  {Object} path    an opentype path, OR the following:
 *
 * @param  {String} line     a line of text
 * @param  {Number} x        x-position
 * @param  {Number} y        y-position
 * @param  {Object} options opentype options (optional), set options.decimals
 * to set the decimal precision of the path-data
 *
 * @return {Object}     this p5.Font object
 */
p5.Font.prototype._getPathData = function(line, x, y, options) {

  var decimals = 3;

  // create path from string/position
  if (typeof line === 'string' && arguments.length > 2) {

    line = this._getPath(line, x, y, options);
  }
  // handle options specified in 2nd arg
  else if (typeof x === 'object') {

    options = x;
  }

  // handle svg arguments
  if (options && typeof options.decimals === 'number') {

    decimals = options.decimals;
  }

  return line.toPathData(decimals);
};

/*
 * Creates an SVG <path> element, as a string, from the
 * from the given opentype path or string/position
 *
 * @param  {Object} path    an opentype path, OR the following:
 *
 * @param  {String} line     a line of text
 * @param  {Number} x        x-position
 * @param  {Number} y        y-position
 * @param  {Object} options opentype options (optional), set options.decimals
 * to set the decimal precision of the path-data in the <path> element,
 *  options.fill to set the fill color for the <path> element,
 *  options.stroke to set the stroke color for the <path> element,
 *  options.strokeWidth to set the strokeWidth for the <path> element.
 *
 * @return {Object}     this p5.Font object
 */
p5.Font.prototype._getSVG = function(line, x, y, options) {

  var decimals = 3;

  // create path from string/position
  if (typeof line === 'string' && arguments.length > 2) {

    line = this._getPath(line, x, y, options);
  }
  // handle options specified in 2nd arg
  else if (typeof x === 'object') {

    options = x;
  }

  // handle svg arguments
  if (options) {
    if (typeof options.decimals === 'number') {
      decimals = options.decimals;
    }
    if (typeof options.strokeWidth === 'number') {
      line.strokeWidth = options.strokeWidth;
    }
    if (typeof options.fill !== 'undefined') {
      line.fill = options.fill;
    }
    if (typeof options.stroke !== 'undefined') {
      line.stroke = options.stroke;
    }
  }

  return line.toSVG(decimals);
};

/*
 * Renders an opentype path or string/position
 * to the current graphics context
 *
 * @param  {Object} path    an opentype path, OR the following:
 *
 * @param  {String} line     a line of text
 * @param  {Number} x        x-position
 * @param  {Number} y        y-position
 * @param  {Object} options opentype options (optional)
 *
 * @return {Object}     this p5.Font object
 */
p5.Font.prototype._renderPath = function(line, x, y, options) {

  // /console.log('_renderPath', typeof line);
  var pdata, p = this.parent,
    pg = p._graphics,
    ctx = pg.drawingContext;

  if (typeof line === 'object' && line.commands) {

    pdata = line.commands;
  } else {

    //pos = handleAlignment(p, ctx, line, x, y);
    pdata = this._getPath(line, x, y, p._textSize, options).commands;
  }

  ctx.beginPath();
  for (var i = 0; i < pdata.length; i += 1) {

    var cmd = pdata[i];
    if (cmd.type === 'M') {
      ctx.moveTo(cmd.x, cmd.y);
    } else if (cmd.type === 'L') {
      ctx.lineTo(cmd.x, cmd.y);
    } else if (cmd.type === 'C') {
      ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    } else if (cmd.type === 'Q') {
      ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
    } else if (cmd.type === 'Z') {
      ctx.closePath();
    }
  }

  // only draw stroke if manually set by user
  if (p._doStroke && p._strokeSet) {

    ctx.stroke();
  }

  if (p._doFill) {

    // if fill hasn't been set by user, use default-text-fill
    ctx.fillStyle = p._fillSet ? ctx.fillStyle : constants._DEFAULT_TEXT_FILL;
    ctx.fill();
  }

  return this;
};

p5.Font.prototype._textWidth = function(str, fontSize) {

  if (str === ' ') { // special case for now

    return this.font.charToGlyph(' ').advanceWidth * this._scale(fontSize);
  }

  var bounds = this.textBounds(str, 0, 0, fontSize);
  return bounds.w + bounds.advance;
};

p5.Font.prototype._textAscent = function(fontSize) {

  var bounds = this.textBounds('ABCjgq|', 0, 0, fontSize);
  return Math.abs(bounds.y);
};

p5.Font.prototype._textDescent = function(fontSize) {

  var bounds = this.textBounds('ABCjgq|', 0, 0, fontSize);
  return bounds.h - Math.abs(bounds.y);
};

p5.Font.prototype._scale = function(fontSize) {

  return (1 / this.font.unitsPerEm) * (fontSize || this.parent._textSize);
};

p5.Font.prototype._handleAlignment = function(p, ctx, line, x, y) {

  var textWidth = this._textWidth(line),
    textAscent = this._textAscent(),
    textDescent = this._textDescent(),
    textHeight = textAscent + textDescent;

  if (ctx.textAlign === constants.CENTER) {
    x -= textWidth / 2;
  } else if (ctx.textAlign === constants.RIGHT) {
    x -= textWidth;
  }

  if (ctx.textBaseline === constants.TOP) {
    y += textHeight;
  } else if (ctx.textBaseline === constants._CTX_MIDDLE) {
    y += textHeight / 2 - textDescent;
  } else if (ctx.textBaseline === constants.BOTTOM) {
    y -= textDescent;
  }

  return {
    x: x,
    y: y
  };
};

// helpers

function cacheKey() {
  var args = Array.prototype.slice.call(arguments),
    i = args.length,
    hash = '';

  while (i--) {
    hash += (args[i] === Object(args[i])) ?
      JSON.stringify(args[i]) : args[i];
  }
  return hash;
}

module.exports = p5.Font;

},{"../core/constants":15,"../core/core":16}],51:[function(require,module,exports){
/**
 * @module Data
 * @submodule Array Functions
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Adds a value to the end of an array. Extends the length of
 * the array by one. Maps to Array.push().
 *
 * @method append
 * @param {Array} array Array to append
 * @param {any} value to be added to the Array
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *
 * var myArray = new Array("Mango", "Apple", "Papaya")
 * print(myArray) // ["Mango", "Apple", "Papaya"]
 *
 * append(myArray, "Peach")
 * print(myArray) // ["Mango", "Apple", "Papaya", "Peach"]
 *
 * }
 * </div></code>
 */
p5.prototype.append = function(array, value) {
  array.push(value);
  return array;
};

/**
 * Copies an array (or part of an array) to another array. The src array is
 * copied to the dst array, beginning at the position specified by
 * srcPosition and into the position specified by dstPosition. The number of
 * elements to copy is determined by length. Note that copying values
 * overwrites existing values in the destination array. To append values
 * instead of overwriting them, use concat().
 *
 * The simplified version with only two arguments — arrayCopy(src, dst) —
 * copies an entire array to another of the same size. It is equivalent to
 * arrayCopy(src, 0, dst, 0, src.length).
 *
 * Using this function is far more efficient for copying array data than
 * iterating through a for() loop and copying each element individually.
 *
 * @method arrayCopy
 * @param {Array}  src           the source Array
 * @param {Number} [srcPosition] starting position in the source Array
 * @param {Array}  dst           the destination Array
 * @param {Number} [dstPosition] starting position in the destination Array
 * @param {Nimber} [length]      number of Array elements to be copied
 *
 * @example
 *  <div class="norender"><code>
 *  function setup() {
 *
 *    var src = new Array("A", "B", "C");
 *    var dst = new Array( 1 ,  2 ,  3 );
 *    var srcPosition = 1;
 *    var dstPosition = 0;
 *    var length = 2;
 *
 *    print(src); // ["A", "B", "C"]
 *    print(dst); // [ 1 ,  2 ,  3 ]
 *
 *    arrayCopy(src, srcPosition, dst, dstPosition, length);
 *    print(dst); // ["B", "C", 3]
 *
 *    }
 *  </div></code>
 */
p5.prototype.arrayCopy = function(
  src,
  srcPosition,
  dst,
  dstPosition,
  length) {

  // the index to begin splicing from dst array
  var start,
      end;

  if (typeof length !== 'undefined') {

    end = Math.min(length, src.length);
    start = dstPosition;
    src = src.slice(srcPosition, end + srcPosition);

  } else {

    if (typeof dst !== 'undefined') { // src, dst, length
      // rename  so we don't get confused
      end = dst;
      end = Math.min(end, src.length);
    } else { // src, dst
      end = src.length;
    }

    start = 0;
    // rename  so we don't get confused
    dst = srcPosition;
    src = src.slice(0, end);
  }

  // Since we are not returning the array and JavaScript is pass by reference
  // we must modify the actual values of the array
  // instead of reassigning arrays
  Array.prototype.splice.apply(dst, [start, end].concat(src));

};

/**
 * Concatenates two arrays, maps to Array.concat(). Does not modify the
 * input arrays.
 *
 * @method concat
 * @param {Array} a first Array to concatenate
 * @param {Array} b second Array to concatenate
 * @return {Array} concatenated array
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var arr1 = new Array("A", "B", "C");
 *   var arr2 = new Array( 1 ,  2 ,  3 );
 *
 *   print(arr1); // ["A","B","C"]
 *   print(arr2); // [1,2,3]
 *
 *   var arr3 = concat(arr1, arr2);
 *
 *   print(arr1); // ["A","B","C"]
 *   print(arr2); // [1,2,3]
 *   print(arr3); // ["A","B","C",1,2,3]
 *
 * }
 * </div></code>
 */
p5.prototype.concat = function(list0, list1) {
  return list0.concat(list1);
};

/**
 * Reverses the order of an array, maps to Array.reverse()
 *
 * @method reverse
 * @param {Array} list Array to reverse
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   var myArray = new Array("A", "B", "C");
 *   print(myArray); // ["A","B","C"]
 *
 *   reverse(myArray);
 *   print(myArray); // ["C","B","A"]
 * }
 * </div></code>
 */
p5.prototype.reverse = function(list) {
  return list.reverse();
};

/**
 * Decreases an array by one element and returns the shortened array,
 * maps to Array.pop().
 *
 * @method shorten
 * @param  {Array} list Array to shorten
 * @return {Array} shortened Array
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var myArray = new Array("A", "B", "C");
 *   print(myArray); // ["A","B","C"]
 *
 *   var newArray = shorten(myArray);
 *   print(myArray); // ["A","B","C"]
 *   print(newArray); // ["A","B"]
 * }
 * </div></code>
 */
p5.prototype.shorten = function(list) {
  list.pop();
  return list;
};

/**
 * Randomizes the order of the elements of an array.
 * Implements Fisher-Yates Shuffle Algorithm
 * http://Bost.Ocks.org/mike/shuffle/
 * http://en.Wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * @method shuffle
 * @param  {Array}   array  Array to shuffle
 * @param  {Boolean} [bool] modify passed array
 * @return {Array}   shuffled Array
 * @example
 * <div><code>
 * function setup() {
 *   var regularArr = ['ABC', 'def', createVector(), TAU, Math.E];
 *   print(regularArr);
 *   shuffle(regularArr, true); // force modifications to passed array
 *   print(regularArr);
 *
 *   // By default shuffle() returns a shuffled cloned array:
 *   var newArr = shuffle(regularArr);
 *   print(regularArr);
 *   print(newArr);
 * }
 * </code></div>
 */
p5.prototype.shuffle = function(arr, bool) {
  arr = bool || ArrayBuffer.isView(arr)? arr : arr.slice();

  var rnd, tmp, idx = arr.length;
  while (idx > 1) {
    rnd = Math.random()*idx | 0;

    tmp = arr[--idx];
    arr[idx] = arr[rnd];
    arr[rnd] = tmp;
  }

  return arr;
};

/**
 * Sorts an array of numbers from smallest to largest, or puts an array of
 * words in alphabetical order. The original array is not modified; a
 * re-ordered array is returned. The count parameter states the number of
 * elements to sort. For example, if there are 12 elements in an array and
 * count is set to 5, only the first 5 elements in the array will be sorted.
 *
 * @method sort
 * @param {Array} list Array to sort
 * @param {Number} [count] number of elements to sort, starting from 0
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var words = new Array("banana", "apple", "pear","lime");
 *   print(words); // ["banana", "apple", "pear", "lime"]
 *   var count = 4; // length of array
 *
 *   sort(words, count);
 *   print(words); // ["apple", "banana", "lime", "pear"]
 * }
 * </div></code>
 * <div class = "norender"><code>
 * function setup() {
 *   var numbers = new Array(2,6,1,5,14,9,8,12);
 *   print(numbers); // [2,6,1,5,14,9,8,12]
 *   var count = 5; // Less than the length of the array
 *
 *   sort(numbers, count);
 *   print(numbers); // [1,2,5,6,14,9,8,12]
 * }
 * </div></code>
 */
p5.prototype.sort = function(list, count) {
  var arr = count ? list.slice(0, Math.min(count, list.length)) : list;
  var rest = count ? list.slice(Math.min(count, list.length)) : [];
  if (typeof arr[0] === 'string') {
    arr = arr.sort();
  } else {
    arr = arr.sort(function(a,b){return a-b;});
  }
  return arr.concat(rest);
};

/**
 * Inserts a value or an array of values into an existing array. The first
 * parameter specifies the initial array to be modified, and the second
 * parameter defines the data to be inserted. The third parameter is an index
 * value which specifies the array position from which to insert data.
 * (Remember that array index numbering starts at zero, so the first position
 * is 0, the second position is 1, and so on.)
 *
 * @method splice
 * @param {Array}  list Array to splice into
 * @param {any}    value value to be spliced in
 * @param {Number} position in the array from which to insert data
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var myArray = new Array(0,1,2,3,4);
 *   var insArray = new Array("A","B","C");
 *   print(myArray); // [0,1,2,3,4]
 *   print(insArray); // ["A","B","C"]
 *
 *   splice(myArray, insArray, 3);
 *   print(myArray); // [0,1,2,"A","B","C",3,4]
 * }
 * </div></code>
 */
p5.prototype.splice = function(list, value, index) {

  // note that splice returns spliced elements and not an array
  Array.prototype.splice.apply(list, [index, 0].concat(value));

  return list;
};

/**
 * Extracts an array of elements from an existing array. The list parameter
 * defines the array from which the elements will be copied, and the start
 * and count parameters specify which elements to extract. If no count is
 * given, elements will be extracted from the start to the end of the array.
 * When specifying the start, remember that the first array element is 0.
 * This function does not change the source array.
 *
 * @method subset
 * @param  {Array}  list    Array to extract from
 * @param  {Number} start   position to begin
 * @param  {Number} [count] number of values to extract
 * @return {Array}          Array of extracted elements
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var myArray = new Array(1,2,3,4,5);
 *   print(myArray); // [1,2,3,4,5]
 *
 *   var sub1 = subset(myArray, 0, 3);
 *   var sub2 = subset(myArray, 2, 2);
 *   print(sub1); // [1,2,3]
 *   print(sub2); // [3,4]
 * }
 * </div></code>
 */
p5.prototype.subset = function(list, start, count) {
  if (typeof count !== 'undefined') {
    return list.slice(start, start + count);
  } else {
    return list.slice(start, list.length);
  }
};

module.exports = p5;

},{"../core/core":16}],52:[function(require,module,exports){
/**
 * @module Data
 * @submodule Conversion
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Converts a string to its floating point representation. The contents of a
 * string must resemble a number, or NaN (not a number) will be returned.
 * For example, float("1234.56") evaluates to 1234.56, but float("giraffe")
 * will return NaN.
 *
 * @method float
 * @param {String}  str float string to parse
 * @return {Number}     floating point representation of string
 * @example
 * <div><code>
 * var str = '20';
 * var diameter = float(str);
 * ellipse(width/2, height/2, diameter, diameter);
 * </code></div>
 */
p5.prototype.float = function(str) {
  return parseFloat(str);
};

/**
 * Converts a boolean, string, or float to its integer representation.
 * When an array of values is passed in, then an int array of the same length
 * is returned.
 *
 * @method int
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {Number}                     integer representation of value
 * @example
 * <div class='norender'><code>
 * print(int("10")); // 10
 * print(int(10.31)); // 10
 * print(int(-10)); // -10
 * print(int(true)); // 1
 * print(int(false)); // 0
 * print(int([false, true, "10.3", 9.8])); // [0, 1, 10, 9]
 * </code></div>
 */
p5.prototype.int = function(n, radix) {
  if (typeof n === 'string') {
    radix = radix || 10;
    return parseInt(n, radix);
  } else if (typeof n === 'number') {
    return n | 0;
  } else if (typeof n === 'boolean') {
    return n ? 1 : 0;
  } else if (n instanceof Array) {
    return n.map(function(n) { return p5.prototype.int(n, radix); });
  }
};

/**
 * Converts a boolean, string or number to its string representation.
 * When an array of values is passed in, then an array of strings of the same
 * length is returned.
 *
 * @method str
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {String}                     string representation of value
 * @example
 * <div class='norender'><code>
 * print(str("10"));  // "10"
 * print(str(10.31)); // "10.31"
 * print(str(-10));   // "-10"
 * print(str(true));  // "true"
 * print(str(false)); // "false"
 * print(str([true, "10.3", 9.8])); // [ "true", "10.3", "9.8" ]
 * </code></div>
 */
p5.prototype.str = function(n) {
  if (n instanceof Array) {
    return n.map(p5.prototype.str);
  } else {
    return String(n);
  }
};

/**
 * Converts a number or string to its boolean representation.
 * For a number, any non-zero value (positive or negative) evaluates to true,
 * while zero evaluates to false. For a string, the value "true" evaluates to
 * true, while any other value evaluates to false. When an array of number or
 * string values is passed in, then a array of booleans of the same length is
 * returned.
 *
 * @method boolean
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {Boolean}                    boolean representation of value
 * @example
 * <div class='norender'><code>
 * print(boolean(0));               // false
 * print(boolean(1));               // true
 * print(boolean("true"));          // true
 * print(boolean("abcd"));          // false
 * print(boolean([0, 12, "true"])); // [false, true, false]
 * </code></div>
 */
p5.prototype.boolean = function(n) {
  if (typeof n === 'number') {
    return n !== 0;
  } else if (typeof n === 'string') {
    return n.toLowerCase() === 'true';
  } else if (typeof n === 'boolean') {
    return n;
  } else if (n instanceof Array) {
    return n.map(p5.prototype.boolean);
  }
};

/**
 * Converts a number, string or boolean to its byte representation.
 * A byte can be only a whole number between -128 and 127, so when a value
 * outside of this range is converted, it wraps around to the corresponding
 * byte representation. When an array of number, string or boolean values is
 * passed in, then an array of bytes the same length is returned.
 *
 * @method byte
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {Number}                     byte representation of value
 * @example
 * <div class='norender'><code>
 * print(byte(127));               // 127
 * print(byte(128));               // -128
 * print(byte(23.4));              // 23
 * print(byte("23.4"));            // 23
 * print(byte(true));              // 1
 * print(byte([0, 255, "100"]));   // [0, -1, 100]
 * </code></div>
 */
p5.prototype.byte = function(n) {
  var nn = p5.prototype.int(n, 10);
  if (typeof nn === 'number') {
    return ((nn + 128) % 256) - 128;
  } else if (nn instanceof Array) {
    return nn.map(p5.prototype.byte);
  }
};

/**
 * Converts a number or string to its corresponding single-character
 * string representation. If a string parameter is provided, it is first
 * parsed as an integer and then translated into a single-character string.
 * When an array of number or string values is passed in, then an array of
 * single-character strings of the same length is returned.
 *
 * @method char
 * @param {String|Number|Array} n value to parse
 * @return {String}             string representation of value
 * @example
 * <div class='norender'><code>
 * print(char(65));                     // "A"
 * print(char("65"));                   // "A"
 * print(char([65, 66, 67]));           // [ "A", "B", "C" ]
 * print(join(char([65, 66, 67]), '')); // "ABC"
 * </code></div>
 */
p5.prototype.char = function(n) {
  if (typeof n === 'number' && !isNaN(n)) {
    return String.fromCharCode(n);
  } else if (n instanceof Array) {
    return n.map(p5.prototype.char);
  } else if (typeof n === 'string') {
    return p5.prototype.char(parseInt(n, 10));
  }
};

/**
 * Converts a single-character string to its corresponding integer
 * representation. When an array of single-character string values is passed
 * in, then an array of integers of the same length is returned.
 *
 * @method unchar
 * @param {String|Array} n value to parse
 * @return {Number}      integer representation of value
 * @example
 * <div class='norender'><code>
 * print(unchar("A"));               // 65
 * print(unchar(["A", "B", "C"]));   // [ 65, 66, 67 ]
 * print(unchar(split("ABC", "")));  // [ 65, 66, 67 ]
 * </code></div>
 */
p5.prototype.unchar = function(n) {
  if (typeof n === 'string' && n.length === 1) {
    return n.charCodeAt(0);
  } else if (n instanceof Array) {
    return n.map(p5.prototype.unchar);
  }
};

/**
 * Converts a number to a string in its equivalent hexadecimal notation. If a
 * second parameter is passed, it is used to set the number of characters to
 * generate in the hexadecimal notation. When an array is passed in, an
 * array of strings in hexadecimal notation of the same length is returned.
 *
 * @method hex
 * @param {Number|Array} n value to parse
 * @return {String}      hexadecimal string representation of value
 * @example
 * <div class='norender'><code>
 * print(hex(255));               // "000000FF"
 * print(hex(255, 6));            // "0000FF"
 * print(hex([0, 127, 255], 6));  // [ "000000", "00007F", "0000FF" ]
 * </code></div>
 */
p5.prototype.hex = function(n, digits) {
  digits = (digits === undefined || digits === null) ? digits = 8 : digits;
  if (n instanceof Array) {
    return n.map(function(n) { return p5.prototype.hex(n, digits); });
  } else if (typeof n === 'number') {
    if (n < 0) {
      n = 0xFFFFFFFF + n + 1;
    }
    var hex = Number(n).toString(16).toUpperCase();
    while (hex.length < digits) {
      hex = '0' + hex;
    }
    if (hex.length >= digits) {
      hex = hex.substring(hex.length - digits, hex.length);
    }
    return hex;
  }
};

/**
 * Converts a string representation of a hexadecimal number to its equivalent
 * integer value. When an array of strings in hexadecimal notation is passed
 * in, an array of integers of the same length is returned.
 *
 * @method unhex
 * @param {String|Array} n value to parse
 * @return {Number}      integer representation of hexadecimal value
 * @example
 * <div class='norender'><code>
 * print(unhex("A"));                // 10
 * print(unhex("FF"));               // 255
 * print(unhex(["FF", "AA", "00"])); // [ 255, 170, 0 ]
 * </code></div>
 */
p5.prototype.unhex = function(n) {
  if (n instanceof Array) {
    return n.map(p5.prototype.unhex);
  } else {
    return parseInt('0x' + n, 16);
  }
};

module.exports = p5;

},{"../core/core":16}],53:[function(require,module,exports){
/**
 * @module Data
 * @submodule String Functions
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

//return p5; //LM is this a mistake?

/**
 * Combines an array of Strings into one String, each separated by the
 * character(s) used for the separator parameter. To join arrays of ints or
 * floats, it's necessary to first convert them to Strings using nf() or
 * nfs().
 *
 * @method join
 * @param  {Array}  list      array of Strings to be joined
 * @param  {String} separator String to be placed between each item
 * @return {String}           joined String
 * @example
 * <div>
 * <code>
 * var array = ["Hello", "world!"]
 * var separator = " "
 * var message = join(array, separator);
 * text(message, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.join = function(list, separator) {
  return list.join(separator);
};

/**
 * This function is used to apply a regular expression to a piece of text,
 * and return matching groups (elements found inside parentheses) as a
 * String array. If there are no matches, a null value will be returned.
 * If no groups are specified in the regular expression, but the sequence
 * matches, an array of length 1 (with the matched text as the first element
 * of the array) will be returned.
 *
 * To use the function, first check to see if the result is null. If the
 * result is null, then the sequence did not match at all. If the sequence
 * did match, an array is returned.
 *
 * If there are groups (specified by sets of parentheses) in the regular
 * expression, then the contents of each will be returned in the array.
 * Element [0] of a regular expression match returns the entire matching
 * string, and the match groups start at element [1] (the first group is [1],
 * the second [2], and so on).
 *
 * @method match
 * @param  {String} str    the String to be searched
 * @param  {String} regexp the regexp to be used for matching
 * @return {Array}         Array of Strings found
 * @example
 * <div>
 * <code>
 * var string = "Hello p5js*!"
 * var regexp = "p5js\\*"
 * var match = match(string, regexp);
 * text(match, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.match =  function(str, reg) {
  return str.match(reg);
};

/**
 * This function is used to apply a regular expression to a piece of text,
 * and return a list of matching groups (elements found inside parentheses)
 * as a two-dimensional String array. If there are no matches, a null value
 * will be returned. If no groups are specified in the regular expression,
 * but the sequence matches, a two dimensional array is still returned, but
 * the second dimension is only of length one.
 *
 * To use the function, first check to see if the result is null. If the
 * result is null, then the sequence did not match at all. If the sequence
 * did match, a 2D array is returned.
 *
 * If there are groups (specified by sets of parentheses) in the regular
 * expression, then the contents of each will be returned in the array.
 * Assuming a loop with counter variable i, element [i][0] of a regular
 * expression match returns the entire matching string, and the match groups
 * start at element [i][1] (the first group is [i][1], the second [i][2],
 * and so on).
 *
 * @method matchAll
 * @param  {String} str    the String to be searched
 * @param  {String} regexp the regexp to be used for matching
 * @return {Array}         2d Array of Strings found
 * @example
 * <div class="norender">
 * <code>
 * var string = "Hello p5js*! Hello world!"
 * var regexp = "Hello"
 * matchAll(string, regexp);
 * </code>
 * </div>

 */
p5.prototype.matchAll = function(str, reg) {
  var re = new RegExp(reg, 'g');
  var match = re.exec(str);
  var matches = [];
  while (match !== null) {
    matches.push(match);
    // matched text: match[0]
    // match start: match.index
    // capturing group n: match[n]
    match = re.exec(str);
  }
  return matches;
};

/**
 * Utility function for formatting numbers into strings. There are two
 * versions: one for formatting floats, and one for formatting ints.
 * The values for the digits, left, and right parameters should always
 * be positive integers.
 *
 * @method nf
 * @param {Number|Array} num      the Number to format
 * @param {Number}       [left]   number of digits to the left of the
 *                                decimal point
 * @param {Number}       [right]  number of digits to the right of the
 *                                decimal point
 * @return {String|Array}         formatted String
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   var num = 112.53106115;
 *
 *   noStroke();
 *   fill(0);
 *   textSize(14);
 *   // Draw formatted numbers
 *   text(nf(num, 5, 2), 10, 20);
 *
 *   text(nf(num, 4, 3), 10, 55);
 *
 *   text(nf(num, 3, 6), 10, 85);
 *
 *   // Draw dividing lines
 *   stroke(120);
 *   line(0, 30, width, 30);
 *   line(0, 65, width, 65);
 * }
 * </code>
 * </div>
 */
p5.prototype.nf = function () {
  if (arguments[0] instanceof Array) {
    var a = arguments[1];
    var b = arguments[2];
    return arguments[0].map(function (x) {
      return doNf(x, a, b);
    });
  }
  else{
    var typeOfFirst = Object.prototype.toString.call(arguments[0]);
    if(typeOfFirst === '[object Arguments]'){
      if(arguments[0].length===3){
        return this.nf(arguments[0][0],arguments[0][1],arguments[0][2]);
      }
      else if(arguments[0].length===2){
        return this.nf(arguments[0][0],arguments[0][1]);
      }
      else{
        return this.nf(arguments[0][0]);
      }
    }
    else {
      return doNf.apply(this, arguments);
    }
  }
};

function doNf() {
  var num = arguments[0];
  var neg = num < 0;
  var n = neg ? num.toString().substring(1) : num.toString();
  var decimalInd = n.indexOf('.');
  var intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
  var decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : '';
  var str = neg ? '-' : '';
  if (arguments.length === 3) {
    var decimal = '';
    if(decimalInd !== -1 || arguments[2] - decPart.length > 0){
      decimal = '.';
    }
    if (decPart.length > arguments[2]) {
      decPart = decPart.substring(0, arguments[2]);
    }
    for (var i = 0; i < arguments[1] - intPart.length; i++) {
      str += '0';
    }
    str += intPart;
    str += decimal;
    str += decPart;
    for (var j = 0; j < arguments[2] - decPart.length; j++) {
      str += '0';
    }
    return str;
  }
  else {
    for (var k = 0; k < Math.max(arguments[1] - intPart.length, 0); k++) {
      str += '0';
    }
    str += n;
    return str;
  }
}

/**
 * Utility function for formatting numbers into strings and placing
 * appropriate commas to mark units of 1000. There are two versions: one
 * for formatting ints, and one for formatting an array of ints. The value
 * for the right parameter should always be a positive integer.
 *
 * @method nfc
 * @param  {Number|Array}   num     the Number to format
 * @param  {Number}         [right] number of digits to the right of the
 *                                  decimal point
 * @return {String|Array}           formatted String
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   var num = 11253106.115;
 *   var numArr = new Array(1,1,2);
 *
 *   noStroke();
 *   fill(0);
 *   textSize(12);
 *
 *   // Draw formatted numbers
 *   text(nfc(num, 4, 2), 10, 30);
 *   text(nfc(numArr, 2, 1), 10, 80);
 *
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.nfc = function () {
  if (arguments[0] instanceof Array) {
    var a = arguments[1];
    return arguments[0].map(function (x) {
      return doNfc(x, a);
    });
  } else {
    return doNfc.apply(this, arguments);
  }
};
function doNfc() {
  var num = arguments[0].toString();
  var dec = num.indexOf('.');
  var rem = dec !== -1 ? num.substring(dec) : '';
  var n = dec !== -1 ? num.substring(0, dec) : num;
  n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (arguments[1] === 0) {
    rem = '';
  }
  else if(arguments[1] !== undefined){
    if(arguments[1] > rem.length){
      rem+= dec === -1 ? '.' : '';
      var len = arguments[1] - rem.length + 1;
      for(var i =0; i< len; i++){
        rem += '0';
      }
    }
    else{
      rem = rem.substring(0, arguments[1] + 1);
    }
  }
  return n + rem;
}

/**
 * Utility function for formatting numbers into strings. Similar to nf() but
 * puts a "+" in front of positive numbers and a "-" in front of negative
 * numbers. There are two versions: one for formatting floats, and one for
 * formatting ints. The values for left, and right parameters
 * should always be positive integers.
 *
 * @method nfp
 * @param {Number|Array} num      the Number to format
 * @param {Number}       [left]   number of digits to the left of the decimal
 *                                point
 * @param {Number}       [right]  number of digits to the right of the
 *                                decimal point
 * @return {String|Array}         formatted String
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   var num1 = 11253106.115;
 *   var num2 = -11253106.115;
 *
 *   noStroke();
 *   fill(0);
 *   textSize(12);
 *
 *   // Draw formatted numbers
 *   text(nfp(num1, 4, 2), 10, 30);
 *   text(nfp(num2, 4, 2), 10, 80);
 *
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.nfp = function() {
  var nfRes = this.nf.apply(this, arguments);
  if (nfRes instanceof Array) {
    return nfRes.map(addNfp);
  } else {
    return addNfp(nfRes);
  }
};

function addNfp() {
  return (
    parseFloat(arguments[0]) > 0) ?
    '+'+arguments[0].toString() :
    arguments[0].toString();
}

/**
 * Utility function for formatting numbers into strings. Similar to nf() but
 * puts a " " (space) in front of positive numbers and a "-" in front of
 * negative numbers. There are two versions: one for formatting floats, and
 * one for formatting ints. The values for the digits, left, and right
 * parameters should always be positive integers.
 *
 * @method nfs
 * @param {Number|Array} num      the Number to format
 * @param {Number}       [left]   number of digits to the left of the decimal
 *                                point
 * @param {Number}       [right]  number of digits to the right of the
 *                                decimal point
 * @return {String|Array}         formatted String
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   var num1 = 11253106.115;
 *   var num2 = -11253106.115;
 *
 *   noStroke();
 *   fill(0);
 *   textSize(12);
 *   // Draw formatted numbers
 *   text(nfs(num1, 4, 2), 10, 30);
 *
 *   text(nfs(num2, 4, 2), 10, 80);
 *
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.nfs = function() {
  var nfRes = this.nf.apply(this, arguments);
  if (nfRes instanceof Array) {
    return nfRes.map(addNfs);
  } else {
    return addNfs(nfRes);
  }
};

function addNfs() {
  return (
    parseFloat(arguments[0]) > 0) ?
    ' '+arguments[0].toString() :
    arguments[0].toString();
}

/**
 * The split() function maps to String.split(), it breaks a String into
 * pieces using a character or string as the delimiter. The delim parameter
 * specifies the character or characters that mark the boundaries between
 * each piece. A String[] array is returned that contains each of the pieces.
 *
 * The splitTokens() function works in a similar fashion, except that it
 * splits using a range of characters instead of a specific character or
 * sequence.
 *
 * @method split
 * @param  {String} value the String to be split
 * @param  {String} delim the String used to separate the data
 * @return {Array}        Array of Strings
 * @example
 * <div>
 * <code>
 *var names = "Pat,Xio,Alex"
 * var splitString = split(names, ",");
 * text(splitString[0], 5, 30);
 * text(splitString[1], 5, 50);
 * text(splitString[2], 5, 70);
 * </code>
 * </div>
 */
p5.prototype.split = function(str, delim) {
  return str.split(delim);
};

/**
 * The splitTokens() function splits a String at one or many character
 * delimiters or "tokens." The delim parameter specifies the character or
 * characters to be used as a boundary.
 *
 * If no delim characters are specified, any whitespace character is used to
 * split. Whitespace characters include tab (\t), line feed (\n), carriage
 * return (\r), form feed (\f), and space.
 *
 * @method splitTokens
 * @param  {String} value   the String to be split
 * @param  {String} [delim] list of individual Strings that will be used as
 *                          separators
 * @return {Array}          Array of Strings
 * @example
 * <div class = "norender">
 * <code>
 * function setup() {
 *   var myStr = "Mango, Banana, Lime";
 *   var myStrArr = splitTokens(myStr, ",");
 *
 *   print(myStrArr); // prints : ["Mango"," Banana"," Lime"]
 * }
 * </div>
 * </code>
 */
p5.prototype.splitTokens = function() {
  var d = (arguments.length > 0) ? arguments[1] : /\s/g;
  return arguments[0].split(d).filter(function(n){return n;});
};

/**
 * Removes whitespace characters from the beginning and end of a String. In
 * addition to standard whitespace characters such as space, carriage return,
 * and tab, this function also removes the Unicode "nbsp" character.
 *
 * @method trim
 * @param  {String|Array} [str] a String or Array of Strings to be trimmed
 * @return {String|Array}       a trimmed String or Array of Strings
 * @example
 * <div>
 * <code>
 * var string = trim("  No new lines\n   ");
 * text(string +" here", 2, 50);
 * </code>
 * </div>
 */
p5.prototype.trim = function(str) {
  if (str instanceof Array) {
    return str.map(this.trim);
  } else {
    return str.trim();
  }
};

module.exports = p5;

},{"../core/core":16}],54:[function(require,module,exports){
/**
 * @module Input
 * @submodule Time & Date
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * p5.js communicates with the clock on your computer. The day() function
 * returns the current day as a value from 1 - 31.
 *
 * @method day
 * @return {Number} the current day
 * @example
 * <div>
 * <code>
 * var day = day();
 * text("Current day: \n"+day, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.day = function() {
  return new Date().getDate();
};

/**
 * p5.js communicates with the clock on your computer. The hour() function
 * returns the current hour as a value from 0 - 23.
 *
 * @method hour
 * @return {Number} the current hour
 * @example
 * <div>
 * <code>
 * var hour = hour();
 * text("Current hour:\n"+hour, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.hour = function() {
  return new Date().getHours();
};

/**
 * p5.js communicates with the clock on your computer. The minute() function
 * returns the current minute as a value from 0 - 59.
 *
 * @method minute
 * @return {Number} the current minute
 * @example
 * <div>
 * <code>
 * var minute = minute();
 * text("Current minute: \n:"+minute, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.minute = function() {
  return new Date().getMinutes();
};

/**
 * Returns the number of milliseconds (thousandths of a second) since
 * starting the program. This information is often used for timing events and
 * animation sequences.
 *
 * @method millis
 * @return {Number} the number of milliseconds since starting the program
 * @example
 * <div>
 * <code>
 * var millisecond = millis();
 * text("Milliseconds \nrunning: "+millisecond, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.millis = function() {
  return window.performance.now();
};

/**
 * p5.js communicates with the clock on your computer. The month() function
 * returns the current month as a value from 1 - 12.
 *
 * @method month
 * @return {Number} the current month
 * @example
 * <div>
 * <code>
 * var month = month();
 * text("Current month: \n"+month, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.month = function() {
  return new Date().getMonth() + 1; //January is 0!
};

/**
 * p5.js communicates with the clock on your computer. The second() function
 * returns the current second as a value from 0 - 59.
 *
 * @method second
 * @return {Number} the current second
 * @example
 * <div>
 * <code>
 * var second = second();
 * text("Current second: \n" +second, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.second = function() {
  return new Date().getSeconds();
};

/**
 * p5.js communicates with the clock on your computer. The year() function
 * returns the current year as an integer (2014, 2015, 2016, etc).
 *
 * @method year
 * @return {Number} the current year
 * @example
 * <div>
 * <code>
 * var year = year();
 * text("Current year: \n" +year, 5, 50);
 * </code>
 * </div>
 */
p5.prototype.year = function() {
  return new Date().getFullYear();
};

module.exports = p5;

},{"../core/core":16}]},{},[7])(7)
});
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.opentype = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";exports.argument=function(r,t){if(!r)throw new Error(t)},exports.assert=exports.argument;


},{}],2:[function(require,module,exports){
"use strict";function line(e,i,n,o,t){e.beginPath(),e.moveTo(i,n),e.lineTo(o,t),e.stroke()}exports.line=line;


},{}],3:[function(require,module,exports){
"use strict";function DefaultEncoding(e){this.font=e}function CmapEncoding(e){this.cmap=e}function CffEncoding(e,l){this.encoding=e,this.charset=l}function GlyphNames(e){var l;switch(e.version){case 1:this.names=exports.standardNames.slice();break;case 2:for(this.names=new Array(e.numberOfGlyphs),l=0;l<e.numberOfGlyphs;l++)this.names[l]=e.glyphNameIndex[l]<exports.standardNames.length?exports.standardNames[e.glyphNameIndex[l]]:e.names[e.glyphNameIndex[l]-exports.standardNames.length];break;case 2.5:for(this.names=new Array(e.numberOfGlyphs),l=0;l<e.numberOfGlyphs;l++)this.names[l]=exports.standardNames[l+e.glyphNameIndex[l]];break;case 3:this.names=[]}}function addGlyphNames(e){for(var l,r=e.tables.cmap.glyphIndexMap,a=Object.keys(r),s=0;s<a.length;s+=1){var i=a[s],o=r[i];l=e.glyphs[o],l.addUnicode(parseInt(i))}for(s=0;s<e.glyphs.length;s+=1)l=e.glyphs[s],l.name=e.cffEncoding?e.cffEncoding.charset[s]:e.glyphNames.glyphIndexToName(s)}var cffStandardStrings=[".notdef","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","endash","dagger","daggerdbl","periodcentered","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","questiondown","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","ring","cedilla","hungarumlaut","ogonek","caron","emdash","AE","ordfeminine","Lslash","Oslash","OE","ordmasculine","ae","dotlessi","lslash","oslash","oe","germandbls","onesuperior","logicalnot","mu","trademark","Eth","onehalf","plusminus","Thorn","onequarter","divide","brokenbar","degree","thorn","threequarters","twosuperior","registered","minus","eth","multiply","threesuperior","copyright","Aacute","Acircumflex","Adieresis","Agrave","Aring","Atilde","Ccedilla","Eacute","Ecircumflex","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Ntilde","Oacute","Ocircumflex","Odieresis","Ograve","Otilde","Scaron","Uacute","Ucircumflex","Udieresis","Ugrave","Yacute","Ydieresis","Zcaron","aacute","acircumflex","adieresis","agrave","aring","atilde","ccedilla","eacute","ecircumflex","edieresis","egrave","iacute","icircumflex","idieresis","igrave","ntilde","oacute","ocircumflex","odieresis","ograve","otilde","scaron","uacute","ucircumflex","udieresis","ugrave","yacute","ydieresis","zcaron","exclamsmall","Hungarumlautsmall","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","266 ff","onedotenleader","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","commasuperior","threequartersemdash","periodsuperior","questionsmall","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","ffi","ffl","parenleftinferior","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","exclamdownsmall","centoldstyle","Lslashsmall","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","Dotaccentsmall","Macronsmall","figuredash","hypheninferior","Ogoneksmall","Ringsmall","Cedillasmall","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall","001.000","001.001","001.002","001.003","Black","Bold","Book","Light","Medium","Regular","Roman","Semibold"],cffStandardEncoding=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","","endash","dagger","daggerdbl","periodcentered","","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","","questiondown","","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","","ring","cedilla","","hungarumlaut","ogonek","caron","emdash","","","","","","","","","","","","","","","","","AE","","ordfeminine","","","","","Lslash","Oslash","OE","ordmasculine","","","","","","ae","","","","dotlessi","","","lslash","oslash","oe","germandbls"],cffExpertEncoding=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclamsmall","Hungarumlautsmall","","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","questionsmall","","asuperior","bsuperior","centsuperior","dsuperior","esuperior","","","isuperior","","","lsuperior","msuperior","nsuperior","osuperior","","","rsuperior","ssuperior","tsuperior","","ff","fi","fl","ffi","ffl","parenleftinferior","","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdownsmall","centoldstyle","Lslashsmall","","","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","","Dotaccentsmall","","","Macronsmall","","","figuredash","hypheninferior","","","Ogoneksmall","Ringsmall","Cedillasmall","","","","onequarter","onehalf","threequarters","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","","","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall"],standardNames=[".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"];DefaultEncoding.prototype.charToGlyphIndex=function(e){var l=e.charCodeAt(0),r=this.font.glyphs;if(!r)return null;for(var a=0;a<r.length;a+=1)for(var s=r[a],i=0;i<s.unicodes.length;i+=1)if(s.unicodes[i]===l)return a},CmapEncoding.prototype.charToGlyphIndex=function(e){return this.cmap.glyphIndexMap[e.charCodeAt(0)]||0},CffEncoding.prototype.charToGlyphIndex=function(e){var l=e.charCodeAt(0),r=this.encoding[l];return this.charset.indexOf(r)},GlyphNames.prototype.nameToGlyphIndex=function(e){return this.names.indexOf(e)},GlyphNames.prototype.glyphIndexToName=function(e){return this.names[e]},exports.cffStandardStrings=cffStandardStrings,exports.cffStandardEncoding=cffStandardEncoding,exports.cffExpertEncoding=cffExpertEncoding,exports.standardNames=standardNames,exports.DefaultEncoding=DefaultEncoding,exports.CmapEncoding=CmapEncoding,exports.CffEncoding=CffEncoding,exports.GlyphNames=GlyphNames,exports.addGlyphNames=addGlyphNames;


},{}],4:[function(require,module,exports){
"use strict";function Font(t){t=t||{},this.familyName=t.familyName||" ",this.styleName=t.styleName||" ",this.designer=t.designer||" ",this.designerURL=t.designerURL||" ",this.manufacturer=t.manufacturer||" ",this.manufacturerURL=t.manufacturerURL||" ",this.license=t.license||" ",this.licenseURL=t.licenseURL||" ",this.version=t.version||"Version 0.1",this.description=t.description||" ",this.copyright=t.copyright||" ",this.trademark=t.trademark||" ",this.unitsPerEm=t.unitsPerEm||1e3,this.ascender=t.ascender,this.descender=t.descender,this.supported=!0,this.glyphs=t.glyphs||[],this.encoding=new encoding.DefaultEncoding(this),this.tables={}}var path=require("./path"),sfnt=require("./tables/sfnt"),encoding=require("./encoding");Font.prototype.hasChar=function(t){return null!==this.encoding.charToGlyphIndex(t)},Font.prototype.charToGlyphIndex=function(t){return this.encoding.charToGlyphIndex(t)},Font.prototype.charToGlyph=function(t){var e=this.charToGlyphIndex(t),n=this.glyphs[e];return n||(n=this.glyphs[0]),n},Font.prototype.stringToGlyphs=function(t){for(var e=[],n=0;n<t.length;n+=1){var i=t[n];e.push(this.charToGlyph(i))}return e},Font.prototype.nameToGlyphIndex=function(t){return this.glyphNames.nameToGlyphIndex(t)},Font.prototype.nameToGlyph=function(t){var e=this.nametoGlyphIndex(t),n=this.glyphs[e];return n||(n=this.glyphs[0]),n},Font.prototype.glyphIndexToName=function(t){return this.glyphNames.glyphIndexToName?this.glyphNames.glyphIndexToName(t):""},Font.prototype.getKerningValue=function(t,e){t=t.index||t,e=e.index||e;var n=this.getGposKerningValue;return n?n(t,e):this.kerningPairs[t+","+e]||0},Font.prototype.forEachGlyph=function(t,e,n,i,o,r){if(this.supported){e=void 0!==e?e:0,n=void 0!==n?n:0,i=void 0!==i?i:72,o=o||{};for(var s=void 0===o.kerning?!0:o.kerning,h=1/this.unitsPerEm*i,a=this.stringToGlyphs(t),p=0;p<a.length;p+=1){var c=a[p];if(r(c,e,n,i,o),c.advanceWidth&&(e+=c.advanceWidth*h),s&&p<a.length-1){var u=this.getKerningValue(c,a[p+1]);e+=u*h}}}},Font.prototype.getPath=function(t,e,n,i,o){var r=new path.Path;return this.forEachGlyph(t,e,n,i,o,function(t,e,n,i){var o=t.getPath(e,n,i);r.extend(o)}),r},Font.prototype.draw=function(t,e,n,i,o,r){this.getPath(e,n,i,o,r).draw(t)},Font.prototype.drawPoints=function(t,e,n,i,o,r){this.forEachGlyph(e,n,i,o,r,function(e,n,i,o){e.drawPoints(t,n,i,o)})},Font.prototype.drawMetrics=function(t,e,n,i,o,r){this.forEachGlyph(e,n,i,o,r,function(e,n,i,o){e.drawMetrics(t,n,i,o)})},Font.prototype.validate=function(){function t(t,e){t||n.push(e)}function e(e){t(i[e]&&i[e].trim().length>0,"No "+e+" specified.")}var n=[],i=this;e("familyName"),e("weightName"),e("manufacturer"),e("copyright"),e("version"),t(this.unitsPerEm>0,"No unitsPerEm specified.")},Font.prototype.toTables=function(){return sfnt.fontToTable(this)},Font.prototype.toBuffer=function(){for(var t=this.toTables(),e=t.encode(),n=new ArrayBuffer(e.length),i=new Uint8Array(n),o=0;o<e.length;o++)i[o]=e[o];return n},Font.prototype.download=function(){var t=this.familyName.replace(/\s/g,"")+"-"+this.styleName+".otf",e=this.toBuffer();window.requestFileSystem=window.requestFileSystem||window.webkitRequestFileSystem,window.requestFileSystem(window.TEMPORARY,e.byteLength,function(n){n.root.getFile(t,{create:!0},function(t){t.createWriter(function(n){var i=new DataView(e),o=new Blob([i],{type:"font/opentype"});n.write(o),n.addEventListener("writeend",function(){location.href=t.toURL()},!1)})})},function(t){throw t})},exports.Font=Font;


},{"./encoding":3,"./path":8,"./tables/sfnt":23}],5:[function(require,module,exports){
"use strict";function Glyph(t){this.font=t.font||null,this.index=t.index||0,this.name=t.name||null,this.unicode=t.unicode||void 0,this.unicodes=t.unicodes||void 0!==t.unicode?[t.unicode]:[],this.xMin=t.xMin||0,this.yMin=t.yMin||0,this.xMax=t.xMax||0,this.yMax=t.yMax||0,this.advanceWidth=t.advanceWidth||0,this.path=t.path||null}var check=require("./check"),draw=require("./draw"),path=require("./path");Glyph.prototype.addUnicode=function(t){0===this.unicodes.length&&(this.unicode=t),this.unicodes.push(t)},Glyph.prototype.getPath=function(t,i,e){t=void 0!==t?t:0,i=void 0!==i?i:0,e=void 0!==e?e:72;for(var n=1/this.font.unitsPerEm*e,h=new path.Path,a=this.path.commands,o=0;o<a.length;o+=1){var r=a[o];"M"===r.type?h.moveTo(t+r.x*n,i+-r.y*n):"L"===r.type?h.lineTo(t+r.x*n,i+-r.y*n):"Q"===r.type?h.quadraticCurveTo(t+r.x1*n,i+-r.y1*n,t+r.x*n,i+-r.y*n):"C"===r.type?h.curveTo(t+r.x1*n,i+-r.y1*n,t+r.x2*n,i+-r.y2*n,t+r.x*n,i+-r.y*n):"Z"===r.type&&h.closePath()}return h},Glyph.prototype.getContours=function(){if(void 0===this.points)return[];for(var t=[],i=[],e=0;e<this.points.length;e+=1){var n=this.points[e];i.push(n),n.lastPointOfContour&&(t.push(i),i=[])}return check.argument(0===i.length,"There are still points left in the current contour."),t},Glyph.prototype.getMetrics=function(){for(var t=this.path.commands,i=[],e=[],n=0;n<t.length;n+=1){var h=t[n];"Z"!==h.type&&(i.push(h.x),e.push(h.y)),("Q"===h.type||"C"===h.type)&&(i.push(h.x1),e.push(h.y1)),"C"===h.type&&(i.push(h.x2),e.push(h.y2))}var a={xMin:Math.min.apply(null,i),yMin:Math.min.apply(null,e),xMax:Math.max.apply(null,i),yMax:Math.max.apply(null,e),leftSideBearing:0};return a.rightSideBearing=this.advanceWidth-a.leftSideBearing-(a.xMax-a.xMin),a},Glyph.prototype.draw=function(t,i,e,n){this.getPath(i,e,n).draw(t)},Glyph.prototype.drawPoints=function(t,i,e,n){function h(i,e,n,h){var a=2*Math.PI;t.beginPath();for(var o=0;o<i.length;o+=1)t.moveTo(e+i[o].x*h,n+i[o].y*h),t.arc(e+i[o].x*h,n+i[o].y*h,2,0,a,!1);t.closePath(),t.fill()}i=void 0!==i?i:0,e=void 0!==e?e:0,n=void 0!==n?n:24;for(var a=1/this.font.unitsPerEm*n,o=[],r=[],s=this.path,l=0;l<s.commands.length;l+=1){var p=s.commands[l];void 0!==p.x&&o.push({x:p.x,y:-p.y}),void 0!==p.x1&&r.push({x:p.x1,y:-p.y1}),void 0!==p.x2&&r.push({x:p.x2,y:-p.y2})}t.fillStyle="blue",h(o,i,e,a),t.fillStyle="red",h(r,i,e,a)},Glyph.prototype.drawMetrics=function(t,i,e,n){var h;i=void 0!==i?i:0,e=void 0!==e?e:0,n=void 0!==n?n:24,h=1/this.font.unitsPerEm*n,t.lineWidth=1,t.strokeStyle="black",draw.line(t,i,-1e4,i,1e4),draw.line(t,-1e4,e,1e4,e),t.strokeStyle="blue",draw.line(t,i+this.xMin*h,-1e4,i+this.xMin*h,1e4),draw.line(t,i+this.xMax*h,-1e4,i+this.xMax*h,1e4),draw.line(t,-1e4,e+-this.yMin*h,1e4,e+-this.yMin*h),draw.line(t,-1e4,e+-this.yMax*h,1e4,e+-this.yMax*h),t.strokeStyle="green",draw.line(t,i+this.advanceWidth*h,-1e4,i+this.advanceWidth*h,1e4)},exports.Glyph=Glyph;


},{"./check":1,"./draw":2,"./path":8}],6:[function(require,module,exports){
"use strict";function toArrayBuffer(e){for(var a=new ArrayBuffer(e.length),r=new Uint8Array(a),s=0;s<e.length;s+=1)r[s]=e[s];return a}function loadFromFile(e,a){var r=require("fs");r.readFile(e,function(e,r){return e?a(e.message):void a(null,toArrayBuffer(r))})}function loadFromUrl(e,a){var r=new XMLHttpRequest;r.open("get",e,!0),r.responseType="arraybuffer",r.onload=function(){return 200!==r.status?a("Font could not be loaded: "+r.statusText):a(null,r.response)},r.send()}function parseBuffer(e){var a,r,s,t,n,o,p,l=new _font.Font,i=new DataView(e,0),u=parse.getFixed(i,0);if(1===u)l.outlinesFormat="truetype";else{if(u=parse.getTag(i,0),"OTTO"!==u)throw new Error("Unsupported OpenType version "+u);l.outlinesFormat="cff"}for(var c=parse.getUShort(i,4),f=12,h=0;c>h;h+=1){var d=parse.getTag(i,f),m=parse.getULong(i,f+8);switch(d){case"cmap":l.tables.cmap=cmap.parse(i,m),l.encoding=new encoding.CmapEncoding(l.tables.cmap),l.encoding||(l.supported=!1);break;case"head":l.tables.head=head.parse(i,m),l.unitsPerEm=l.tables.head.unitsPerEm,a=l.tables.head.indexToLocFormat;break;case"hhea":l.tables.hhea=hhea.parse(i,m),l.ascender=l.tables.hhea.ascender,l.descender=l.tables.hhea.descender,l.numberOfHMetrics=l.tables.hhea.numberOfHMetrics;break;case"hmtx":r=m;break;case"maxp":l.tables.maxp=maxp.parse(i,m),l.numGlyphs=l.tables.maxp.numGlyphs;break;case"name":l.tables.name=_name.parse(i,m),l.familyName=l.tables.name.fontFamily,l.styleName=l.tables.name.fontSubfamily;break;case"OS/2":l.tables.os2=os2.parse(i,m);break;case"post":l.tables.post=post.parse(i,m),l.glyphNames=new encoding.GlyphNames(l.tables.post);break;case"glyf":s=m;break;case"loca":t=m;break;case"CFF ":n=m;break;case"kern":o=m;break;case"GPOS":p=m}f+=16}if(s&&t){var b=0===a,g=loca.parse(i,t,l.numGlyphs,b);l.glyphs=glyf.parse(i,s,g,l),hmtx.parse(i,r,l.numberOfHMetrics,l.numGlyphs,l.glyphs),encoding.addGlyphNames(l)}else n?(cff.parse(i,n,l),encoding.addGlyphNames(l)):l.supported=!1;return l.supported&&(l.kerningPairs=o?kern.parse(i,o):{},p&&gpos.parse(i,p,l)),l}function load(e,a){var r="undefined"==typeof window,s=r?loadFromFile:loadFromUrl;s(e,function(e,r){if(e)return a(e);var s=parseBuffer(r);return s.supported?a(null,s):a("Font is not supported (is this a Postscript font?)")})}var encoding=require("./encoding"),_font=require("./font"),glyph=require("./glyph"),parse=require("./parse"),path=require("./path"),cmap=require("./tables/cmap"),cff=require("./tables/cff"),glyf=require("./tables/glyf"),gpos=require("./tables/gpos"),head=require("./tables/head"),hhea=require("./tables/hhea"),hmtx=require("./tables/hmtx"),kern=require("./tables/kern"),loca=require("./tables/loca"),maxp=require("./tables/maxp"),_name=require("./tables/name"),os2=require("./tables/os2"),post=require("./tables/post");exports._parse=parse,exports.Font=_font.Font,exports.Glyph=glyph.Glyph,exports.Path=path.Path,exports.parse=parseBuffer,exports.load=load;
},{"./encoding":3,"./font":4,"./glyph":5,"./parse":7,"./path":8,"./tables/cff":10,"./tables/cmap":11,"./tables/glyf":12,"./tables/gpos":13,"./tables/head":14,"./tables/hhea":15,"./tables/hmtx":16,"./tables/kern":17,"./tables/loca":18,"./tables/maxp":19,"./tables/name":20,"./tables/os2":21,"./tables/post":22,"fs":undefined}],7:[function(require,module,exports){
"use strict";function Parser(t,e){this.data=t,this.offset=e,this.relativeOffset=0}exports.getByte=function(t,e){return t.getUint8(e)},exports.getCard8=exports.getByte,exports.getUShort=function(t,e){return t.getUint16(e,!1)},exports.getCard16=exports.getUShort,exports.getShort=function(t,e){return t.getInt16(e,!1)},exports.getULong=function(t,e){return t.getUint32(e,!1)},exports.getFixed=function(t,e){var r=t.getInt16(e,!1),s=t.getUint16(e+2,!1);return r+s/65535},exports.getTag=function(t,e){for(var r="",s=e;e+4>s;s+=1)r+=String.fromCharCode(t.getInt8(s));return r},exports.getOffset=function(t,e,r){for(var s=0,o=0;r>o;o+=1)s<<=8,s+=t.getUint8(e+o);return s},exports.getBytes=function(t,e,r){for(var s=[],o=e;r>o;o+=1)s.push(t.getUint8(o));return s},exports.bytesToString=function(t){for(var e="",r=0;r<t.length;r+=1)e+=String.fromCharCode(t[r]);return e};var typeOffsets={"byte":1,uShort:2,"short":2,uLong:4,fixed:4,longDateTime:8,tag:4};Parser.prototype.parseByte=function(){var t=this.data.getUint8(this.offset+this.relativeOffset);return this.relativeOffset+=1,t},Parser.prototype.parseChar=function(){var t=this.data.getInt8(this.offset+this.relativeOffset);return this.relativeOffset+=1,t},Parser.prototype.parseCard8=Parser.prototype.parseByte,Parser.prototype.parseUShort=function(){var t=this.data.getUint16(this.offset+this.relativeOffset);return this.relativeOffset+=2,t},Parser.prototype.parseCard16=Parser.prototype.parseUShort,Parser.prototype.parseSID=Parser.prototype.parseUShort,Parser.prototype.parseOffset16=Parser.prototype.parseUShort,Parser.prototype.parseShort=function(){var t=this.data.getInt16(this.offset+this.relativeOffset);return this.relativeOffset+=2,t},Parser.prototype.parseF2Dot14=function(){var t=this.data.getInt16(this.offset+this.relativeOffset)/16384;return this.relativeOffset+=2,t},Parser.prototype.parseULong=function(){var t=exports.getULong(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t},Parser.prototype.parseFixed=function(){var t=exports.getFixed(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t},Parser.prototype.parseOffset16List=Parser.prototype.parseUShortList=function(t){for(var e=new Array(t),r=this.data,s=this.offset+this.relativeOffset,o=0;t>o;o++)e[o]=exports.getUShort(r,s),s+=2;return this.relativeOffset+=2*t,e},Parser.prototype.parseString=function(t){var e=this.data,r=this.offset+this.relativeOffset,s="";this.relativeOffset+=t;for(var o=0;t>o;o++)s+=String.fromCharCode(e.getUint8(r+o));return s},Parser.prototype.parseTag=function(){return this.parseString(4)},Parser.prototype.parseLongDateTime=function(){var t=exports.getULong(this.data,this.offset+this.relativeOffset+4);return this.relativeOffset+=8,t},Parser.prototype.parseFixed=function(){var t=exports.getULong(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t/65536},Parser.prototype.parseVersion=function(){var t=exports.getUShort(this.data,this.offset+this.relativeOffset),e=exports.getUShort(this.data,this.offset+this.relativeOffset+2);return this.relativeOffset+=4,t+e/4096/10},Parser.prototype.skip=function(t,e){void 0===e&&(e=1),this.relativeOffset+=typeOffsets[t]*e},exports.Parser=Parser;


},{}],8:[function(require,module,exports){
"use strict";function Path(){this.commands=[],this.fill="black",this.stroke=null,this.strokeWidth=1}Path.prototype.moveTo=function(t,o){this.commands.push({type:"M",x:t,y:o})},Path.prototype.lineTo=function(t,o){this.commands.push({type:"L",x:t,y:o})},Path.prototype.curveTo=Path.prototype.bezierCurveTo=function(t,o,e,i,s,h){this.commands.push({type:"C",x1:t,y1:o,x2:e,y2:i,x:s,y:h})},Path.prototype.quadTo=Path.prototype.quadraticCurveTo=function(t,o,e,i){this.commands.push({type:"Q",x1:t,y1:o,x:e,y:i})},Path.prototype.close=Path.prototype.closePath=function(){this.commands.push({type:"Z"})},Path.prototype.extend=function(t){t.commands&&(t=t.commands),Array.prototype.push.apply(this.commands,t)},Path.prototype.draw=function(t){t.beginPath();for(var o=0;o<this.commands.length;o+=1){var e=this.commands[o];"M"===e.type?t.moveTo(e.x,e.y):"L"===e.type?t.lineTo(e.x,e.y):"C"===e.type?t.bezierCurveTo(e.x1,e.y1,e.x2,e.y2,e.x,e.y):"Q"===e.type?t.quadraticCurveTo(e.x1,e.y1,e.x,e.y):"Z"===e.type&&t.closePath()}this.fill&&(t.fillStyle=this.fill,t.fill()),this.stroke&&(t.strokeStyle=this.stroke,t.lineWidth=this.strokeWidth,t.stroke())},Path.prototype.toPathData=function(t){function o(o){return Math.round(o)===o?""+Math.round(o):o.toFixed(t)}function e(){for(var t="",e=0;e<arguments.length;e+=1){var i=arguments[e];i>=0&&e>0&&(t+=" "),t+=o(i)}return t}t=void 0!==t?t:2;for(var i="",s=0;s<this.commands.length;s+=1){var h=this.commands[s];"M"===h.type?i+="M"+e(h.x,h.y):"L"===h.type?i+="L"+e(h.x,h.y):"C"===h.type?i+="C"+e(h.x1,h.y1,h.x2,h.y2,h.x,h.y):"Q"===h.type?i+="Q"+e(h.x1,h.y1,h.x,h.y):"Z"===h.type&&(i+="Z")}return i},Path.prototype.toSVG=function(t){var o='<path d="';return o+=this.toPathData(t),o+='"',this.fill&&"black"!==this.fill&&(o+=null===this.fill?' fill="none"':' fill="'+this.fill+'"'),this.stroke&&(o+=' stroke="'+this.stroke+'" stroke-width="'+this.strokeWidth+'"'),o+="/>"},exports.Path=Path;


},{}],9:[function(require,module,exports){
"use strict";function Table(e,t,i){var s;for(s=0;s<t.length;s+=1){var r=t[s];this[r.name]=r.value}if(this.tableName=e,this.fields=t,i){var f=Object.keys(i);for(s=0;s<f.length;s+=1){var n=f[s],o=i[n];void 0!==this[n]&&(this[n]=o)}}}var check=require("./check"),encode=require("./types").encode,sizeOf=require("./types").sizeOf;Table.prototype.sizeOf=function(){for(var e=0,t=0;t<this.fields.length;t+=1){var i=this.fields[t],s=this[i.name];if(void 0===s&&(s=i.value),"function"==typeof s.sizeOf)e+=s.sizeOf();else{var r=sizeOf[i.type];check.assert("function"==typeof r,"Could not find sizeOf function for field"+i.name),e+=r(s)}}return e},Table.prototype.encode=function(){return encode.TABLE(this)},exports.Table=Table;


},{"./check":1,"./types":24}],10:[function(require,module,exports){
"use strict";function equals(e,t){if(e===t)return!0;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(var a=0;a<e.length;a+=1)if(!equals(e[a],t[a]))return!1;return!0}return!1}function parseCFFIndex(e,t,a){var r,n,s,i=[],h=[],o=parse.getCard16(e,t);if(0!==o){var f=parse.getByte(e,t+2);n=t+(o+1)*f+2;var p=t+3;for(r=0;o+1>r;r+=1)i.push(parse.getOffset(e,p,f)),p+=f;s=n+i[o]}else s=t+2;for(r=0;r<i.length-1;r+=1){var u=parse.getBytes(e,n+i[r],n+i[r+1]);a&&(u=a(u)),h.push(u)}return{objects:h,startOffset:t,endOffset:s}}function parseFloatOperand(e){for(var t="",a=15,r=["0","1","2","3","4","5","6","7","8","9",".","E","E-",null,"-"];;){var n=e.parseByte(),s=n>>4,i=15&n;if(s===a)break;if(t+=r[s],i===a)break;t+=r[i]}return parseFloat(t)}function parseOperand(e,t){var a,r,n,s;if(28===t)return a=e.parseByte(),r=e.parseByte(),a<<8|r;if(29===t)return a=e.parseByte(),r=e.parseByte(),n=e.parseByte(),s=e.parseByte(),a<<24|r<<16|n<<8|s;if(30===t)return parseFloatOperand(e);if(t>=32&&246>=t)return t-139;if(t>=247&&250>=t)return a=e.parseByte(),256*(t-247)+a+108;if(t>=251&&254>=t)return a=e.parseByte(),256*-(t-251)-a-108;throw new Error("Invalid b0 "+t)}function entriesToObject(e){for(var t={},a=0;a<e.length;a+=1){var r,n=e[a][0],s=e[a][1];if(r=1===s.length?s[0]:s,t.hasOwnProperty(n))throw new Error("Object "+t+" already has key "+n);t[n]=r}return t}function parseCFFDict(e,t,a){t=void 0!==t?t:0;var r=new parse.Parser(e,t),n=[],s=[];for(a=void 0!==a?a:e.length;r.relativeOffset<a;){var i=r.parseByte();21>=i?(12===i&&(i=1200+r.parseByte()),n.push([i,s]),s=[]):s.push(parseOperand(r,i))}return entriesToObject(n)}function getCFFString(e,t){return t=390>=t?encoding.cffStandardStrings[t]:e[t-391]}function interpretDict(e,t,a){for(var r={},n=0;n<t.length;n+=1){var s=t[n],i=e[s.op];void 0===i&&(i=void 0!==s.value?s.value:null),"SID"===s.type&&(i=getCFFString(a,i)),r[s.name]=i}return r}function parseCFFHeader(e,t){var a={};return a.formatMajor=parse.getCard8(e,t),a.formatMinor=parse.getCard8(e,t+1),a.size=parse.getCard8(e,t+2),a.offsetSize=parse.getCard8(e,t+3),a.startOffset=t,a.endOffset=t+4,a}function parseCFFTopDict(e,t){var a=parseCFFDict(e,0,e.byteLength);return interpretDict(a,TOP_DICT_META,t)}function parseCFFPrivateDict(e,t,a,r){var n=parseCFFDict(e,t,a);return interpretDict(n,PRIVATE_DICT_META,r)}function parseCFFCharset(e,t,a,r){var n,s,i,h=new parse.Parser(e,t);a-=1;var o=[".notdef"],f=h.parseCard8();if(0===f)for(n=0;a>n;n+=1)s=h.parseSID(),o.push(getCFFString(r,s));else if(1===f)for(;o.length<=a;)for(s=h.parseSID(),i=h.parseCard8(),n=0;i>=n;n+=1)o.push(getCFFString(r,s)),s+=1;else{if(2!==f)throw new Error("Unknown charset format "+f);for(;o.length<=a;)for(s=h.parseSID(),i=h.parseCard16(),n=0;i>=n;n+=1)o.push(getCFFString(r,s)),s+=1}return o}function parseCFFEncoding(e,t,a){var r,n,s={},i=new parse.Parser(e,t),h=i.parseCard8();if(0===h){var o=i.parseCard8();for(r=0;o>r;r+=1)n=i.parseCard8(),s[n]=r}else{if(1!==h)throw new Error("Unknown encoding format "+h);var f=i.parseCard8();for(n=1,r=0;f>r;r+=1)for(var p=i.parseCard8(),u=i.parseCard8(),l=p;p+u>=l;l+=1)s[l]=n,n+=1}return new encoding.CffEncoding(s,a)}function parseCFFCharstring(e,t,a){function r(e,t){v&&p.closePath(),p.moveTo(e,t),v=!0}function n(){var e;e=u.length%2!==0,e&&!c&&(d=u.shift()+t.nominalWidthX),l+=u.length>>1,u.length=0,c=!0}function s(e){for(var y,b,T,C,I,F,D,x,k,S,E,B,w=0;w<e.length;){var M=e[w];switch(w+=1,M){case 1:n();break;case 3:n();break;case 4:u.length>1&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),m+=u.pop(),r(g,m);break;case 5:for(;u.length>0;)g+=u.shift(),m+=u.shift(),p.lineTo(g,m);break;case 6:for(;u.length>0&&(g+=u.shift(),p.lineTo(g,m),0!==u.length);)m+=u.shift(),p.lineTo(g,m);break;case 7:for(;u.length>0&&(m+=u.shift(),p.lineTo(g,m),0!==u.length);)g+=u.shift(),p.lineTo(g,m);break;case 8:for(;u.length>0;)i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+u.shift(),p.curveTo(i,h,o,f,g,m);break;case 10:I=u.pop()+t.subrsBias,F=t.subrs[I],F&&s(F);break;case 11:return;case 12:switch(M=e[w],w+=1,M){case 35:i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f+u.shift(),k=D+u.shift(),S=x+u.shift(),E=k+u.shift(),B=S+u.shift(),g=E+u.shift(),m=B+u.shift(),u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;case 34:i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f,k=D+u.shift(),S=f,E=k+u.shift(),B=m,g=E+u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;case 36:i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f,k=D+u.shift(),S=f,E=k+u.shift(),B=S+u.shift(),g=E+u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;case 37:i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f+u.shift(),k=D+u.shift(),S=x+u.shift(),E=k+u.shift(),B=S+u.shift(),Math.abs(E-g)>Math.abs(B-m)?g=E+u.shift():m=B+u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;default:console.log("Glyph "+a+": unknown operator 1200"+M),u.length=0}break;case 14:u.length>0&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),v&&(p.closePath(),v=!1);break;case 18:n();break;case 19:case 20:n(),w+=l+7>>3;break;case 21:u.length>2&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),m+=u.pop(),g+=u.pop(),r(g,m);break;case 22:u.length>1&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),g+=u.pop(),r(g,m);break;case 23:n();break;case 24:for(;u.length>2;)i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+u.shift(),p.curveTo(i,h,o,f,g,m);g+=u.shift(),m+=u.shift(),p.lineTo(g,m);break;case 25:for(;u.length>6;)g+=u.shift(),m+=u.shift(),p.lineTo(g,m);i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+u.shift(),p.curveTo(i,h,o,f,g,m);break;case 26:for(u.length%2&&(g+=u.shift());u.length>0;)i=g,h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o,m=f+u.shift(),p.curveTo(i,h,o,f,g,m);break;case 27:for(u.length%2&&(m+=u.shift());u.length>0;)i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f,p.curveTo(i,h,o,f,g,m);break;case 28:y=e[w],b=e[w+1],u.push((y<<24|b<<16)>>16),w+=2;break;case 29:I=u.pop()+t.gsubrsBias,F=t.gsubrs[I],F&&s(F);break;case 30:for(;u.length>0&&(i=g,h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m),0!==u.length);)i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),m=f+u.shift(),g=o+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m);break;case 31:for(;u.length>0&&(i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),m=f+u.shift(),g=o+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m),0!==u.length);)i=g,h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m);break;default:32>M?console.log("Glyph "+a+": unknown operator "+M):247>M?u.push(M-139):251>M?(y=e[w],w+=1,u.push(256*(M-247)+y+108)):255>M?(y=e[w],w+=1,u.push(256*-(M-251)-y-108)):(y=e[w],b=e[w+1],T=e[w+2],C=e[w+3],w+=4,u.push((y<<24|b<<16|T<<8|C)/65536))}}}var i,h,o,f,p=new path.Path,u=[],l=0,c=!1,d=t.defaultWidthX,v=!1,g=0,m=0;s(e);var y=new _glyph.Glyph({font:t,index:a});return y.path=p,y.advanceWidth=d,y}function calcCFFSubroutineBias(e){var t;return t=e.length<1240?107:e.length<33900?1131:32768}function parseCFFTable(e,t,a){a.tables.cff={};var r=parseCFFHeader(e,t),n=parseCFFIndex(e,r.endOffset,parse.bytesToString),s=parseCFFIndex(e,n.endOffset),i=parseCFFIndex(e,s.endOffset,parse.bytesToString),h=parseCFFIndex(e,i.endOffset);a.gsubrs=h.objects,a.gsubrsBias=calcCFFSubroutineBias(a.gsubrs);var o=new DataView(new Uint8Array(s.objects[0]).buffer),f=parseCFFTopDict(o,i.objects);a.tables.cff.topDict=f;var p=t+f["private"][1],u=parseCFFPrivateDict(e,p,f["private"][0],i.objects);if(a.defaultWidthX=u.defaultWidthX,a.nominalWidthX=u.nominalWidthX,0!==u.subrs){var l=p+u.subrs,c=parseCFFIndex(e,l);a.subrs=c.objects,a.subrsBias=calcCFFSubroutineBias(a.subrs)}else a.subrs=[],a.subrsBias=0;var d=parseCFFIndex(e,t+f.charStrings);a.nGlyphs=d.objects.length;var v=parseCFFCharset(e,t+f.charset,a.nGlyphs,i.objects);a.cffEncoding=0===f.encoding?new encoding.CffEncoding(encoding.cffStandardEncoding,v):1===f.encoding?new encoding.CffEncoding(encoding.cffExpertEncoding,v):parseCFFEncoding(e,t+f.encoding,v),a.encoding=a.encoding||a.cffEncoding,a.glyphs=[];for(var g=0;g<a.nGlyphs;g+=1){var m=d.objects[g];a.glyphs.push(parseCFFCharstring(m,a,g))}}function encodeString(e,t){var a,r=encoding.cffStandardStrings.indexOf(e);return r>=0&&(a=r),r=t.indexOf(e),r>=0?a=r+encoding.cffStandardStrings.length:(a=encoding.cffStandardStrings.length+t.length,t.push(e)),a}function makeHeader(){return new table.Table("Header",[{name:"major",type:"Card8",value:1},{name:"minor",type:"Card8",value:0},{name:"hdrSize",type:"Card8",value:4},{name:"major",type:"Card8",value:1}])}function makeNameIndex(e){var t=new table.Table("Name INDEX",[{name:"names",type:"INDEX",value:[]}]);t.names=[];for(var a=0;a<e.length;a+=1)t.names.push({name:"name_"+a,type:"NAME",value:e[a]});return t}function makeDict(e,t,a){for(var r={},n=0;n<e.length;n+=1){var s=e[n],i=t[s.name];void 0===i||equals(i,s.value)||("SID"===s.type&&(i=encodeString(i,a)),r[s.op]={name:s.name,type:s.type,value:i})}return r}function makeTopDict(e,t){var a=new table.Table("Top DICT",[{name:"dict",type:"DICT",value:{}}]);return a.dict=makeDict(TOP_DICT_META,e,t),a}function makeTopDictIndex(e){var t=new table.Table("Top DICT INDEX",[{name:"topDicts",type:"INDEX",value:[]}]);return t.topDicts=[{name:"topDict_0",type:"TABLE",value:e}],t}function makeStringIndex(e){var t=new table.Table("String INDEX",[{name:"strings",type:"INDEX",value:[]}]);t.strings=[];for(var a=0;a<e.length;a+=1)t.strings.push({name:"string_"+a,type:"STRING",value:e[a]});return t}function makeGlobalSubrIndex(){return new table.Table("Global Subr INDEX",[{name:"subrs",type:"INDEX",value:[]}])}function makeCharsets(e,t){for(var a=new table.Table("Charsets",[{name:"format",type:"Card8",value:0}]),r=0;r<e.length;r+=1){var n=e[r],s=encodeString(n,t);a.fields.push({name:"glyph_"+r,type:"SID",value:s})}return a}function glyphToOps(e){var t=[],a=e.path;t.push({name:"width",type:"NUMBER",value:e.advanceWidth});for(var r=0,n=0,s=0;s<a.commands.length;s+=1){var i,h,o=a.commands[s];if("Q"===o.type){var f=1/3,p=2/3;o={type:"C",x:o.x,y:o.y,x1:f*r+p*o.x1,y1:f*n+p*o.y1,x2:f*o.x+p*o.x1,y2:f*o.y+p*o.y1}}if("M"===o.type)i=Math.round(o.x-r),h=Math.round(o.y-n),t.push({name:"dx",type:"NUMBER",value:i}),t.push({name:"dy",type:"NUMBER",value:h}),t.push({name:"rmoveto",type:"OP",value:21}),r=Math.round(o.x),n=Math.round(o.y);else if("L"===o.type)i=Math.round(o.x-r),h=Math.round(o.y-n),t.push({name:"dx",type:"NUMBER",value:i}),t.push({name:"dy",type:"NUMBER",value:h}),t.push({name:"rlineto",type:"OP",value:5}),r=Math.round(o.x),n=Math.round(o.y);else if("C"===o.type){var u=Math.round(o.x1-r),l=Math.round(o.y1-n),c=Math.round(o.x2-o.x1),d=Math.round(o.y2-o.y1);i=Math.round(o.x-o.x2),h=Math.round(o.y-o.y2),t.push({name:"dx1",type:"NUMBER",value:u}),t.push({name:"dy1",type:"NUMBER",value:l}),t.push({name:"dx2",type:"NUMBER",value:c}),t.push({name:"dy2",type:"NUMBER",value:d}),t.push({name:"dx",type:"NUMBER",value:i}),t.push({name:"dy",type:"NUMBER",value:h}),t.push({name:"rrcurveto",type:"OP",value:8}),r=Math.round(o.x),n=Math.round(o.y)}}return t.push({name:"endchar",type:"OP",value:14}),t}function makeCharStringsIndex(e){for(var t=new table.Table("CharStrings INDEX",[{name:"charStrings",type:"INDEX",value:[]}]),a=0;a<e.length;a+=1){var r=e[a],n=glyphToOps(r);t.charStrings.push({name:r.name,type:"CHARSTRING",value:n})}return t}function makePrivateDict(e,t){var a=new table.Table("Private DICT",[{name:"dict",type:"DICT",value:{}}]);return a.dict=makeDict(PRIVATE_DICT_META,e,t),a}function makePrivateDictIndex(e){var t=new table.Table("Private DICT INDEX",[{name:"privateDicts",type:"INDEX",value:[]}]);return t.privateDicts=[{name:"privateDict_0",type:"TABLE",value:e}],t}function makeCFFTable(e,t){for(var a=new table.Table("CFF ",[{name:"header",type:"TABLE"},{name:"nameIndex",type:"TABLE"},{name:"topDictIndex",type:"TABLE"},{name:"stringIndex",type:"TABLE"},{name:"globalSubrIndex",type:"TABLE"},{name:"charsets",type:"TABLE"},{name:"charStringsIndex",type:"TABLE"},{name:"privateDictIndex",type:"TABLE"}]),r={version:t.version,fullName:t.fullName,familyName:t.familyName,weight:t.weightName,charset:999,encoding:0,charStrings:999,"private":[0,999]},n={},s=[],i=1;i<e.length;i+=1)s.push(e[i].name);var h=[];a.header=makeHeader(),a.nameIndex=makeNameIndex([t.postScriptName]);var o=makeTopDict(r,h);a.topDictIndex=makeTopDictIndex(o),a.globalSubrIndex=makeGlobalSubrIndex(),a.charsets=makeCharsets(s,h),a.charStringsIndex=makeCharStringsIndex(e);var f=makePrivateDict(n,h);a.privateDictIndex=makePrivateDictIndex(f),a.stringIndex=makeStringIndex(h);var p=a.header.sizeOf()+a.nameIndex.sizeOf()+a.topDictIndex.sizeOf()+a.stringIndex.sizeOf()+a.globalSubrIndex.sizeOf();return r.charset=p,r.encoding=0,r.charStrings=r.charset+a.charsets.sizeOf(),r.private[1]=r.charStrings+a.charStringsIndex.sizeOf(),o=makeTopDict(r,h),a.topDictIndex=makeTopDictIndex(o),a}var encoding=require("../encoding"),_glyph=require("../glyph"),parse=require("../parse"),path=require("../path"),table=require("../table"),TOP_DICT_META=[{name:"version",op:0,type:"SID"},{name:"notice",op:1,type:"SID"},{name:"copyright",op:1200,type:"SID"},{name:"fullName",op:2,type:"SID"},{name:"familyName",op:3,type:"SID"},{name:"weight",op:4,type:"SID"},{name:"isFixedPitch",op:1201,type:"number",value:0},{name:"italicAngle",op:1202,type:"number",value:0},{name:"underlinePosition",op:1203,type:"number",value:-100},{name:"underlineThickness",op:1204,type:"number",value:50},{name:"paintType",op:1205,type:"number",value:0},{name:"charstringType",op:1206,type:"number",value:2},{name:"fontMatrix",op:1207,type:["real","real","real","real","real","real"],value:[.001,0,0,.001,0,0]},{name:"uniqueId",op:13,type:"number"},{name:"fontBBox",op:5,type:["number","number","number","number"],value:[0,0,0,0]},{name:"strokeWidth",op:1208,type:"number",value:0},{name:"xuid",op:14,type:[],value:null},{name:"charset",op:15,type:"offset",value:0},{name:"encoding",op:16,type:"offset",value:0},{name:"charStrings",op:17,type:"offset",value:0},{name:"private",op:18,type:["number","offset"],value:[0,0]}],PRIVATE_DICT_META=[{name:"subrs",op:19,type:"offset",value:0},{name:"defaultWidthX",op:20,type:"number",value:0},{name:"nominalWidthX",op:21,type:"number",value:0}];exports.parse=parseCFFTable,exports.make=makeCFFTable;


},{"../encoding":3,"../glyph":5,"../parse":7,"../path":8,"../table":9}],11:[function(require,module,exports){
"use strict";function parseCmapTable(e,a){var t,r={};r.version=parse.getUShort(e,a),check.argument(0===r.version,"cmap table version should be 0."),r.numTables=parse.getUShort(e,a+2);var n=-1;for(t=0;t<r.numTables;t+=1){var s=parse.getUShort(e,a+4+8*t),l=parse.getUShort(e,a+4+8*t+2);if(3===s&&(1===l||0===l)){n=parse.getULong(e,a+4+8*t+4);break}}if(-1===n)return null;var o=new parse.Parser(e,a+n);r.format=o.parseUShort(),check.argument(4===r.format,"Only format 4 cmap tables are supported."),r.length=o.parseUShort(),r.language=o.parseUShort();var p;r.segCount=p=o.parseUShort()>>1,o.skip("uShort",3),r.glyphIndexMap={};var g=new parse.Parser(e,a+n+14),m=new parse.Parser(e,a+n+16+2*p),u=new parse.Parser(e,a+n+16+4*p),h=new parse.Parser(e,a+n+16+6*p),c=a+n+16+8*p;for(t=0;p-1>t;t+=1)for(var f,d=g.parseUShort(),S=m.parseUShort(),i=u.parseShort(),v=h.parseUShort(),U=S;d>=U;U+=1)0!==v?(c=h.offset+h.relativeOffset-2,c+=v,c+=2*(U-S),f=parse.getUShort(e,c),0!==f&&(f=f+i&65535)):f=U+i&65535,r.glyphIndexMap[U]=f;return r}function addSegment(e,a,t){e.segments.push({end:a,start:a,delta:-(a-t),offset:0})}function addTerminatorSegment(e){e.segments.push({end:65535,start:65535,delta:1,offset:0})}function makeCmapTable(e){var a,t=new table.Table("cmap",[{name:"version",type:"USHORT",value:0},{name:"numTables",type:"USHORT",value:1},{name:"platformID",type:"USHORT",value:3},{name:"encodingID",type:"USHORT",value:1},{name:"offset",type:"ULONG",value:12},{name:"format",type:"USHORT",value:4},{name:"length",type:"USHORT",value:0},{name:"language",type:"USHORT",value:0},{name:"segCountX2",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);for(t.segments=[],a=0;a<e.length;a+=1){for(var r=e[a],n=0;n<r.unicodes.length;n+=1)addSegment(t,r.unicodes[n],a);t.segments=t.segments.sort(function(e,a){return e.start-a.start})}addTerminatorSegment(t);var s;s=t.segments.length,t.segCountX2=2*s,t.searchRange=2*Math.pow(2,Math.floor(Math.log(s)/Math.log(2))),t.entrySelector=Math.log(t.searchRange/2)/Math.log(2),t.rangeShift=t.segCountX2-t.searchRange;var l=[],o=[],p=[],g=[],m=[];for(a=0;s>a;a+=1){var u=t.segments[a];l=l.concat({name:"end_"+a,type:"USHORT",value:u.end}),o=o.concat({name:"start_"+a,type:"USHORT",value:u.start}),p=p.concat({name:"idDelta_"+a,type:"SHORT",value:u.delta}),g=g.concat({name:"idRangeOffset_"+a,type:"USHORT",value:u.offset}),void 0!==u.glyphId&&(m=m.concat({name:"glyph_"+a,type:"USHORT",value:u.glyphId}))}return t.fields=t.fields.concat(l),t.fields.push({name:"reservedPad",type:"USHORT",value:0}),t.fields=t.fields.concat(o),t.fields=t.fields.concat(p),t.fields=t.fields.concat(g),t.fields=t.fields.concat(m),t.length=14+2*l.length+2+2*o.length+2*p.length+2*g.length+2*m.length,t}var check=require("../check"),parse=require("../parse"),table=require("../table");exports.parse=parseCmapTable,exports.make=makeCmapTable;


},{"../check":1,"../parse":7,"../table":9}],12:[function(require,module,exports){
"use strict";function parseGlyphCoordinate(r,e,t,o,n){var a;return(e&o)>0?(a=r.parseByte(),0===(e&n)&&(a=-a),a=t+a):a=(e&n)>0?t:t+r.parseShort(),a}function parseGlyph(r,e,t,o){var n=new parse.Parser(r,e),a=new _glyph.Glyph({font:o,index:t});a.numberOfContours=n.parseShort(),a.xMin=n.parseShort(),a.yMin=n.parseShort(),a.xMax=n.parseShort(),a.yMax=n.parseShort();var s,p;if(a.numberOfContours>0){var u,i=a.endPointIndices=[];for(u=0;u<a.numberOfContours;u+=1)i.push(n.parseUShort());for(a.instructionLength=n.parseUShort(),a.instructions=[],u=0;u<a.instructionLength;u+=1)a.instructions.push(n.parseByte());var l=i[i.length-1]+1;for(s=[],u=0;l>u;u+=1)if(p=n.parseByte(),s.push(p),(8&p)>0)for(var h=n.parseByte(),f=0;h>f;f+=1)s.push(p),u+=1;if(check.argument(s.length===l,"Bad flags."),i.length>0){var y,c=[];if(l>0){for(u=0;l>u;u+=1)p=s[u],y={},y.onCurve=!!(1&p),y.lastPointOfContour=i.indexOf(u)>=0,c.push(y);var v=0;for(u=0;l>u;u+=1)p=s[u],y=c[u],y.x=parseGlyphCoordinate(n,p,v,2,16),v=y.x;var x=0;for(u=0;l>u;u+=1)p=s[u],y=c[u],y.y=parseGlyphCoordinate(n,p,x,4,32),x=y.y}a.points=c}else a.points=[]}else if(0===a.numberOfContours)a.points=[];else{a.isComposite=!0,a.points=[],a.components=[];for(var C=!0;C;){s=n.parseUShort();var g={glyphIndex:n.parseUShort(),xScale:1,scale01:0,scale10:0,yScale:1,dx:0,dy:0};(1&s)>0?(g.dx=n.parseShort(),g.dy=n.parseShort()):(g.dx=n.parseChar(),g.dy=n.parseChar()),(8&s)>0?g.xScale=g.yScale=n.parseF2Dot14():(64&s)>0?(g.xScale=n.parseF2Dot14(),g.yScale=n.parseF2Dot14()):(128&s)>0&&(g.xScale=n.parseF2Dot14(),g.scale01=n.parseF2Dot14(),g.scale10=n.parseF2Dot14(),g.yScale=n.parseF2Dot14()),a.components.push(g),C=!!(32&s)}}return a}function transformPoints(r,e){for(var t=[],o=0;o<r.length;o+=1){var n=r[o],a={x:e.xScale*n.x+e.scale01*n.y+e.dx,y:e.scale10*n.x+e.yScale*n.y+e.dy,onCurve:n.onCurve,lastPointOfContour:n.lastPointOfContour};t.push(a)}return t}function getContours(r){for(var e=[],t=[],o=0;o<r.length;o+=1){var n=r[o];t.push(n),n.lastPointOfContour&&(e.push(t),t=[])}return check.argument(0===t.length,"There are still points left in the current contour."),e}function getPath(r){var e=new path.Path;if(!r)return e;for(var t=getContours(r),o=0;o<t.length;o+=1){var n,a,s=t[o],p=s[0],u=s[s.length-1];p.onCurve?(n=null,a=!0):(p=u.onCurve?u:{x:(p.x+u.x)/2,y:(p.y+u.y)/2},n=p,a=!1),e.moveTo(p.x,p.y);for(var i=a?1:0;i<s.length;i+=1){var l=s[i],h=0===i?p:s[i-1];if(h.onCurve&&l.onCurve)e.lineTo(l.x,l.y);else if(h.onCurve&&!l.onCurve)n=l;else if(h.onCurve||l.onCurve){if(h.onCurve||!l.onCurve)throw new Error("Invalid state.");e.quadraticCurveTo(n.x,n.y,l.x,l.y),n=null}else{var f={x:(h.x+l.x)/2,y:(h.y+l.y)/2};e.quadraticCurveTo(h.x,h.y,f.x,f.y),n=l}}p!==u&&(n?e.quadraticCurveTo(n.x,n.y,p.x,p.y):e.lineTo(p.x,p.y))}return e.closePath(),e}function parseGlyfTable(r,e,t,o){var n,a=[];for(n=0;n<t.length-1;n+=1){var s=t[n],p=t[n+1];a.push(s!==p?parseGlyph(r,e+s,n,o):new _glyph.Glyph({font:o,index:n}))}for(n=0;n<a.length;n+=1){var u=a[n];if(u.isComposite)for(var i=0;i<u.components.length;i+=1){var l=u.components[i],h=a[l.glyphIndex];if(h.points){var f=transformPoints(h.points,l);u.points=u.points.concat(f)}}u.path=getPath(u.points)}return a}var check=require("../check"),_glyph=require("../glyph"),parse=require("../parse"),path=require("../path");exports.parse=parseGlyfTable;


},{"../check":1,"../glyph":5,"../parse":7,"../path":8}],13:[function(require,module,exports){
"use strict";function parseTaggedListTable(r,e){for(var a=new parse.Parser(r,e),s=a.parseUShort(),t=[],o=0;s>o;o++)t[a.parseTag()]={offset:a.parseUShort()};return t}function parseCoverageTable(r,e){var a=new parse.Parser(r,e),s=a.parseUShort(),t=a.parseUShort();if(1===s)return a.parseUShortList(t);if(2===s){for(var o=[];t--;)for(var p=a.parseUShort(),n=a.parseUShort(),f=a.parseUShort(),i=p;n>=i;i++)o[f++]=i;return o}}function parseClassDefTable(r,e){var a=new parse.Parser(r,e),s=a.parseUShort();if(1===s){var t=a.parseUShort(),o=a.parseUShort(),p=a.parseUShortList(o);return function(r){return p[r-t]||0}}if(2===s){for(var n=a.parseUShort(),f=[],i=[],h=[],S=0;n>S;S++)f[S]=a.parseUShort(),i[S]=a.parseUShort(),h[S]=a.parseUShort();return function(r){for(var e=0,a=f.length-1;a>e;){var s=e+a+1>>1;r<f[s]?a=s-1:e=s}return f[e]<=r&&r<=i[e]?h[e]||0:0}}}function parsePairPosSubTable(r,e){var a,s,t=new parse.Parser(r,e),o=t.parseUShort(),p=t.parseUShort(),n=parseCoverageTable(r,e+p),f=t.parseUShort(),i=t.parseUShort();if(4===f&&0===i){var h={};if(1===o){for(var S=t.parseUShort(),u=[],v=t.parseOffset16List(S),U=0;S>U;U++){var l=v[U],g=h[l];if(!g){g={},t.relativeOffset=l;for(var T=t.parseUShort();T--;){var c=t.parseUShort();f&&(a=t.parseShort()),i&&(s=t.parseShort()),g[c]=a}}u[n[U]]=g}return function(r,e){var a=u[r];return a?a[e]:void 0}}if(2===o){for(var b=t.parseUShort(),P=t.parseUShort(),L=t.parseUShort(),k=t.parseUShort(),d=parseClassDefTable(r,e+b),w=parseClassDefTable(r,e+P),O=[],C=0;L>C;C++)for(var G=O[C]=[],K=0;k>K;K++)f&&(a=t.parseShort()),i&&(s=t.parseShort()),G[K]=a;var V={};for(C=0;C<n.length;C++)V[n[C]]=1;return function(r,e){if(V[r]){var a=d(r),s=w(e),t=O[a];return t?t[s]:void 0}}}}}function parseLookupTable(r,e){var a=new parse.Parser(r,e),s=a.parseUShort(),t=a.parseUShort(),o=16&t,p=a.parseUShort(),n=a.parseOffset16List(p),f={lookupType:s,lookupFlag:t,markFilteringSet:o?a.parseUShort():-1};if(2===s){for(var i=[],h=0;p>h;h++)i.push(parsePairPosSubTable(r,e+n[h]));f.getKerningValue=function(r,e){for(var a=i.length;a--;){var s=i[a](r,e);if(void 0!==s)return s}return 0}}return f}function parseGposTable(r,e,a){var s=new parse.Parser(r,e),t=s.parseFixed();check.argument(1===t,"Unsupported GPOS table version."),parseTaggedListTable(r,e+s.parseUShort()),parseTaggedListTable(r,e+s.parseUShort());var o=s.parseUShort();s.relativeOffset=o;for(var p=s.parseUShort(),n=s.parseOffset16List(p),f=e+o,i=0;p>i;i++){var h=parseLookupTable(r,f+n[i]);2!==h.lookupType||a.getGposKerningValue||(a.getGposKerningValue=h.getKerningValue)}}var check=require("../check"),parse=require("../parse");exports.parse=parseGposTable;


},{"../check":1,"../parse":7}],14:[function(require,module,exports){
"use strict";function parseHeadTable(e,a){var r={},t=new parse.Parser(e,a);return r.version=t.parseVersion(),r.fontRevision=Math.round(1e3*t.parseFixed())/1e3,r.checkSumAdjustment=t.parseULong(),r.magicNumber=t.parseULong(),check.argument(1594834165===r.magicNumber,"Font header has wrong magic number."),r.flags=t.parseUShort(),r.unitsPerEm=t.parseUShort(),r.created=t.parseLongDateTime(),r.modified=t.parseLongDateTime(),r.xMin=t.parseShort(),r.yMin=t.parseShort(),r.xMax=t.parseShort(),r.yMax=t.parseShort(),r.macStyle=t.parseUShort(),r.lowestRecPPEM=t.parseUShort(),r.fontDirectionHint=t.parseShort(),r.indexToLocFormat=t.parseShort(),r.glyphDataFormat=t.parseShort(),r}function makeHeadTable(e){return new table.Table("head",[{name:"version",type:"FIXED",value:65536},{name:"fontRevision",type:"FIXED",value:65536},{name:"checkSumAdjustment",type:"ULONG",value:0},{name:"magicNumber",type:"ULONG",value:1594834165},{name:"flags",type:"USHORT",value:0},{name:"unitsPerEm",type:"USHORT",value:1e3},{name:"created",type:"LONGDATETIME",value:0},{name:"modified",type:"LONGDATETIME",value:0},{name:"xMin",type:"SHORT",value:0},{name:"yMin",type:"SHORT",value:0},{name:"xMax",type:"SHORT",value:0},{name:"yMax",type:"SHORT",value:0},{name:"macStyle",type:"USHORT",value:0},{name:"lowestRecPPEM",type:"USHORT",value:0},{name:"fontDirectionHint",type:"SHORT",value:2},{name:"indexToLocFormat",type:"SHORT",value:0},{name:"glyphDataFormat",type:"SHORT",value:0}],e)}var check=require("../check"),parse=require("../parse"),table=require("../table");exports.parse=parseHeadTable,exports.make=makeHeadTable;


},{"../check":1,"../parse":7,"../table":9}],15:[function(require,module,exports){
"use strict";function parseHheaTable(e,a){var r={},t=new parse.Parser(e,a);return r.version=t.parseVersion(),r.ascender=t.parseShort(),r.descender=t.parseShort(),r.lineGap=t.parseShort(),r.advanceWidthMax=t.parseUShort(),r.minLeftSideBearing=t.parseShort(),r.minRightSideBearing=t.parseShort(),r.xMaxExtent=t.parseShort(),r.caretSlopeRise=t.parseShort(),r.caretSlopeRun=t.parseShort(),r.caretOffset=t.parseShort(),t.relativeOffset+=8,r.metricDataFormat=t.parseShort(),r.numberOfHMetrics=t.parseUShort(),r}function makeHheaTable(e){return new table.Table("hhea",[{name:"version",type:"FIXED",value:65536},{name:"ascender",type:"FWORD",value:0},{name:"descender",type:"FWORD",value:0},{name:"lineGap",type:"FWORD",value:0},{name:"advanceWidthMax",type:"UFWORD",value:0},{name:"minLeftSideBearing",type:"FWORD",value:0},{name:"minRightSideBearing",type:"FWORD",value:0},{name:"xMaxExtent",type:"FWORD",value:0},{name:"caretSlopeRise",type:"SHORT",value:1},{name:"caretSlopeRun",type:"SHORT",value:0},{name:"caretOffset",type:"SHORT",value:0},{name:"reserved1",type:"SHORT",value:0},{name:"reserved2",type:"SHORT",value:0},{name:"reserved3",type:"SHORT",value:0},{name:"reserved4",type:"SHORT",value:0},{name:"metricDataFormat",type:"SHORT",value:0},{name:"numberOfHMetrics",type:"USHORT",value:0}],e)}var parse=require("../parse"),table=require("../table");exports.parse=parseHheaTable,exports.make=makeHheaTable;


},{"../parse":7,"../table":9}],16:[function(require,module,exports){
"use strict";function parseHmtxTable(e,a,r,t,s){for(var i,l,n=new parse.Parser(e,a),p=0;t>p;p+=1){r>p&&(i=n.parseUShort(),l=n.parseShort());var d=s[p];d.advanceWidth=i,d.leftSideBearing=l}}function makeHmtxTable(e){for(var a=new table.Table("hmtx",[]),r=0;r<e.length;r+=1){var t=e[r],s=t.advanceWidth||0,i=t.leftSideBearing||0;a.fields.push({name:"advanceWidth_"+r,type:"USHORT",value:s}),a.fields.push({name:"leftSideBearing_"+r,type:"SHORT",value:i})}return a}var parse=require("../parse"),table=require("../table");exports.parse=parseHmtxTable,exports.make=makeHmtxTable;


},{"../parse":7,"../table":9}],17:[function(require,module,exports){
"use strict";function parseKernTable(r,e){var a={},s=new parse.Parser(r,e),p=s.parseUShort();check.argument(0===p,"Unsupported kern table version."),s.skip("uShort",1);var t=s.parseUShort();check.argument(0===t,"Unsupported kern sub-table version."),s.skip("uShort",2);var o=s.parseUShort();s.skip("uShort",3);for(var n=0;o>n;n+=1){var h=s.parseUShort(),u=s.parseUShort(),c=s.parseShort();a[h+","+u]=c}return a}var check=require("../check"),parse=require("../parse");exports.parse=parseKernTable;


},{"../check":1,"../parse":7}],18:[function(require,module,exports){
"use strict";function parseLocaTable(r,a,e,s){for(var p=new parse.Parser(r,a),o=s?p.parseUShort:p.parseULong,t=[],c=0;e+1>c;c+=1){var n=o.call(p);s&&(n*=2),t.push(n)}return t}var parse=require("../parse");exports.parse=parseLocaTable;


},{"../parse":7}],19:[function(require,module,exports){
"use strict";function parseMaxpTable(e,a){var r={},s=new parse.Parser(e,a);return r.version=s.parseVersion(),r.numGlyphs=s.parseUShort(),1===r.version&&(r.maxPoints=s.parseUShort(),r.maxContours=s.parseUShort(),r.maxCompositePoints=s.parseUShort(),r.maxCompositeContours=s.parseUShort(),r.maxZones=s.parseUShort(),r.maxTwilightPoints=s.parseUShort(),r.maxStorage=s.parseUShort(),r.maxFunctionDefs=s.parseUShort(),r.maxInstructionDefs=s.parseUShort(),r.maxStackElements=s.parseUShort(),r.maxSizeOfInstructions=s.parseUShort(),r.maxComponentElements=s.parseUShort(),r.maxComponentDepth=s.parseUShort()),r}function makeMaxpTable(e){return new table.Table("maxp",[{name:"version",type:"FIXED",value:20480},{name:"numGlyphs",type:"USHORT",value:e}])}var parse=require("../parse"),table=require("../table");exports.parse=parseMaxpTable,exports.make=makeMaxpTable;


},{"../parse":7,"../table":9}],20:[function(require,module,exports){
"use strict";function parseNameTable(e,a){var r={},n=new parse.Parser(e,a);r.format=n.parseUShort();for(var t=n.parseUShort(),s=n.offset+n.parseUShort(),o=0,m=0;t>m;m++){var l=n.parseUShort(),p=n.parseUShort(),u=n.parseUShort(),i=n.parseUShort(),d=nameTableNames[i],c=n.parseUShort(),f=n.parseUShort();if(3===l&&1===p&&1033===u){for(var h=[],T=c/2,g=0;T>g;g++,f+=2)h[g]=parse.getShort(e,s+f);var S=String.fromCharCode.apply(null,h);d?r[d]=S:(o++,r["unknown"+o]=S)}}return 1===r.format&&(r.langTagCount=n.parseUShort()),r}function makeNameRecord(e,a,r,n,t,s){return new table.Table("NameRecord",[{name:"platformID",type:"USHORT",value:e},{name:"encodingID",type:"USHORT",value:a},{name:"languageID",type:"USHORT",value:r},{name:"nameID",type:"USHORT",value:n},{name:"length",type:"USHORT",value:t},{name:"offset",type:"USHORT",value:s}])}function addMacintoshNameRecord(e,a,r,n){var t=encode.STRING(r);return e.records.push(makeNameRecord(1,0,0,a,t.length,n)),e.strings.push(t),n+=t.length}function addWindowsNameRecord(e,a,r,n){var t=encode.UTF16(r);return e.records.push(makeNameRecord(3,1,1033,a,t.length,n)),e.strings.push(t),n+=t.length}function makeNameTable(e){var a=new table.Table("name",[{name:"format",type:"USHORT",value:0},{name:"count",type:"USHORT",value:0},{name:"stringOffset",type:"USHORT",value:0}]);a.records=[],a.strings=[];var r,n,t=0;for(r=0;r<nameTableNames.length;r+=1)void 0!==e[nameTableNames[r]]&&(n=e[nameTableNames[r]],t=addMacintoshNameRecord(a,r,n,t));for(r=0;r<nameTableNames.length;r+=1)void 0!==e[nameTableNames[r]]&&(n=e[nameTableNames[r]],t=addWindowsNameRecord(a,r,n,t));for(a.count=a.records.length,a.stringOffset=6+12*a.count,r=0;r<a.records.length;r+=1)a.fields.push({name:"record_"+r,type:"TABLE",value:a.records[r]});for(r=0;r<a.strings.length;r+=1)a.fields.push({name:"string_"+r,type:"LITERAL",value:a.strings[r]});return a}var encode=require("../types").encode,parse=require("../parse"),table=require("../table"),nameTableNames=["copyright","fontFamily","fontSubfamily","uniqueID","fullName","version","postScriptName","trademark","manufacturer","designer","description","manufacturerURL","designerURL","licence","licenceURL","reserved","preferredFamily","preferredSubfamily","compatibleFullName","sampleText","postScriptFindFontName","wwsFamily","wwsSubfamily"];exports.parse=parseNameTable,exports.make=makeNameTable;


},{"../parse":7,"../table":9,"../types":24}],21:[function(require,module,exports){
"use strict";function getUnicodeRange(e){for(var n=0;n<unicodeRanges.length;n+=1){var a=unicodeRanges[n];if(e>=a.begin&&e<a.end)return n}return-1}function parseOS2Table(e,n){var a={},i=new parse.Parser(e,n);a.version=i.parseUShort(),a.xAvgCharWidth=i.parseShort(),a.usWeightClass=i.parseUShort(),a.usWidthClass=i.parseUShort(),a.fsType=i.parseUShort(),a.ySubscriptXSize=i.parseShort(),a.ySubscriptYSize=i.parseShort(),a.ySubscriptXOffset=i.parseShort(),a.ySubscriptYOffset=i.parseShort(),a.ySuperscriptXSize=i.parseShort(),a.ySuperscriptYSize=i.parseShort(),a.ySuperscriptXOffset=i.parseShort(),a.ySuperscriptYOffset=i.parseShort(),a.yStrikeoutSize=i.parseShort(),a.yStrikeoutPosition=i.parseShort(),a.sFamilyClass=i.parseShort(),a.panose=[];for(var t=0;10>t;t++)a.panose[t]=i.parseByte();return a.ulUnicodeRange1=i.parseULong(),a.ulUnicodeRange2=i.parseULong(),a.ulUnicodeRange3=i.parseULong(),a.ulUnicodeRange4=i.parseULong(),a.achVendID=String.fromCharCode(i.parseByte(),i.parseByte(),i.parseByte(),i.parseByte()),a.fsSelection=i.parseUShort(),a.usFirstCharIndex=i.parseUShort(),a.usLastCharIndex=i.parseUShort(),a.sTypoAscender=i.parseShort(),a.sTypoDescender=i.parseShort(),a.sTypoLineGap=i.parseShort(),a.usWinAscent=i.parseUShort(),a.usWinDescent=i.parseUShort(),a.version>=1&&(a.ulCodePageRange1=i.parseULong(),a.ulCodePageRange2=i.parseULong()),a.version>=2&&(a.sxHeight=i.parseShort(),a.sCapHeight=i.parseShort(),a.usDefaultChar=i.parseUShort(),a.usBreakChar=i.parseUShort(),a.usMaxContent=i.parseUShort()),a}function makeOS2Table(e){return new table.Table("OS/2",[{name:"version",type:"USHORT",value:3},{name:"xAvgCharWidth",type:"SHORT",value:0},{name:"usWeightClass",type:"USHORT",value:0},{name:"usWidthClass",type:"USHORT",value:0},{name:"fsType",type:"USHORT",value:0},{name:"ySubscriptXSize",type:"SHORT",value:650},{name:"ySubscriptYSize",type:"SHORT",value:699},{name:"ySubscriptXOffset",type:"SHORT",value:0},{name:"ySubscriptYOffset",type:"SHORT",value:140},{name:"ySuperscriptXSize",type:"SHORT",value:650},{name:"ySuperscriptYSize",type:"SHORT",value:699},{name:"ySuperscriptXOffset",type:"SHORT",value:0},{name:"ySuperscriptYOffset",type:"SHORT",value:479},{name:"yStrikeoutSize",type:"SHORT",value:49},{name:"yStrikeoutPosition",type:"SHORT",value:258},{name:"sFamilyClass",type:"SHORT",value:0},{name:"bFamilyType",type:"BYTE",value:0},{name:"bSerifStyle",type:"BYTE",value:0},{name:"bWeight",type:"BYTE",value:0},{name:"bProportion",type:"BYTE",value:0},{name:"bContrast",type:"BYTE",value:0},{name:"bStrokeVariation",type:"BYTE",value:0},{name:"bArmStyle",type:"BYTE",value:0},{name:"bLetterform",type:"BYTE",value:0},{name:"bMidline",type:"BYTE",value:0},{name:"bXHeight",type:"BYTE",value:0},{name:"ulUnicodeRange1",type:"ULONG",value:0},{name:"ulUnicodeRange2",type:"ULONG",value:0},{name:"ulUnicodeRange3",type:"ULONG",value:0},{name:"ulUnicodeRange4",type:"ULONG",value:0},{name:"achVendID",type:"CHARARRAY",value:"XXXX"},{name:"fsSelection",type:"USHORT",value:0},{name:"usFirstCharIndex",type:"USHORT",value:0},{name:"usLastCharIndex",type:"USHORT",value:0},{name:"sTypoAscender",type:"SHORT",value:0},{name:"sTypoDescender",type:"SHORT",value:0},{name:"sTypoLineGap",type:"SHORT",value:0},{name:"usWinAscent",type:"USHORT",value:0},{name:"usWinDescent",type:"USHORT",value:0},{name:"ulCodePageRange1",type:"ULONG",value:0},{name:"ulCodePageRange2",type:"ULONG",value:0},{name:"sxHeight",type:"SHORT",value:0},{name:"sCapHeight",type:"SHORT",value:0},{name:"usDefaultChar",type:"USHORT",value:0},{name:"usBreakChar",type:"USHORT",value:0},{name:"usMaxContext",type:"USHORT",value:0}],e)}var parse=require("../parse"),table=require("../table"),unicodeRanges=[{begin:0,end:127},{begin:128,end:255},{begin:256,end:383},{begin:384,end:591},{begin:592,end:687},{begin:688,end:767},{begin:768,end:879},{begin:880,end:1023},{begin:11392,end:11519},{begin:1024,end:1279},{begin:1328,end:1423},{begin:1424,end:1535},{begin:42240,end:42559},{begin:1536,end:1791},{begin:1984,end:2047},{begin:2304,end:2431},{begin:2432,end:2559},{begin:2560,end:2687},{begin:2688,end:2815},{begin:2816,end:2943},{begin:2944,end:3071},{begin:3072,end:3199},{begin:3200,end:3327},{begin:3328,end:3455},{begin:3584,end:3711},{begin:3712,end:3839},{begin:4256,end:4351},{begin:6912,end:7039},{begin:4352,end:4607},{begin:7680,end:7935},{begin:7936,end:8191},{begin:8192,end:8303},{begin:8304,end:8351},{begin:8352,end:8399},{begin:8400,end:8447},{begin:8448,end:8527},{begin:8528,end:8591},{begin:8592,end:8703},{begin:8704,end:8959},{begin:8960,end:9215},{begin:9216,end:9279},{begin:9280,end:9311},{begin:9312,end:9471},{begin:9472,end:9599},{begin:9600,end:9631},{begin:9632,end:9727},{begin:9728,end:9983},{begin:9984,end:10175},{begin:12288,end:12351},{begin:12352,end:12447},{begin:12448,end:12543},{begin:12544,end:12591},{begin:12592,end:12687},{begin:43072,end:43135},{begin:12800,end:13055},{begin:13056,end:13311},{begin:44032,end:55215},{begin:55296,end:57343},{begin:67840,end:67871},{begin:19968,end:40959},{begin:57344,end:63743},{begin:12736,end:12783},{begin:64256,end:64335},{begin:64336,end:65023},{begin:65056,end:65071},{begin:65040,end:65055},{begin:65104,end:65135},{begin:65136,end:65279},{begin:65280,end:65519},{begin:65520,end:65535},{begin:3840,end:4095},{begin:1792,end:1871},{begin:1920,end:1983},{begin:3456,end:3583},{begin:4096,end:4255},{begin:4608,end:4991},{begin:5024,end:5119},{begin:5120,end:5759},{begin:5760,end:5791},{begin:5792,end:5887},{begin:6016,end:6143},{begin:6144,end:6319},{begin:10240,end:10495},{begin:40960,end:42127},{begin:5888,end:5919},{begin:66304,end:66351},{begin:66352,end:66383},{begin:66560,end:66639},{begin:118784,end:119039},{begin:119808,end:120831},{begin:1044480,end:1048573},{begin:65024,end:65039},{begin:917504,end:917631},{begin:6400,end:6479},{begin:6480,end:6527},{begin:6528,end:6623},{begin:6656,end:6687},{begin:11264,end:11359},{begin:11568,end:11647},{begin:19904,end:19967},{begin:43008,end:43055},{begin:65536,end:65663},{begin:65856,end:65935},{begin:66432,end:66463},{begin:66464,end:66527},{begin:66640,end:66687},{begin:66688,end:66735},{begin:67584,end:67647},{begin:68096,end:68191},{begin:119552,end:119647},{begin:73728,end:74751},{begin:119648,end:119679},{begin:7040,end:7103},{begin:7168,end:7247},{begin:7248,end:7295},{begin:43136,end:43231},{begin:43264,end:43311},{begin:43312,end:43359},{begin:43520,end:43615},{begin:65936,end:65999},{begin:66e3,end:66047},{begin:66208,end:66271},{begin:127024,end:127135}];exports.unicodeRanges=unicodeRanges,exports.getUnicodeRange=getUnicodeRange,exports.parse=parseOS2Table,exports.make=makeOS2Table;


},{"../parse":7,"../table":9}],22:[function(require,module,exports){
"use strict";function parsePostTable(e,a){var r,n={},s=new parse.Parser(e,a);switch(n.version=s.parseVersion(),n.italicAngle=s.parseFixed(),n.underlinePosition=s.parseShort(),n.underlineThickness=s.parseShort(),n.isFixedPitch=s.parseULong(),n.minMemType42=s.parseULong(),n.maxMemType42=s.parseULong(),n.minMemType1=s.parseULong(),n.maxMemType1=s.parseULong(),n.version){case 1:n.names=encoding.standardNames.slice();break;case 2:for(n.numberOfGlyphs=s.parseUShort(),n.glyphNameIndex=new Array(n.numberOfGlyphs),r=0;r<n.numberOfGlyphs;r++)n.glyphNameIndex[r]=s.parseUShort();for(n.names=[],r=0;r<n.numberOfGlyphs;r++)if(n.glyphNameIndex[r]>=encoding.standardNames.length){var p=s.parseChar();n.names.push(s.parseString(p))}break;case 2.5:for(n.numberOfGlyphs=s.parseUShort(),n.offset=new Array(n.numberOfGlyphs),r=0;r<n.numberOfGlyphs;r++)n.offset[r]=s.parseChar()}return n}function makePostTable(){return new table.Table("post",[{name:"version",type:"FIXED",value:196608},{name:"italicAngle",type:"FIXED",value:0},{name:"underlinePosition",type:"FWORD",value:0},{name:"underlineThickness",type:"FWORD",value:0},{name:"isFixedPitch",type:"ULONG",value:0},{name:"minMemType42",type:"ULONG",value:0},{name:"maxMemType42",type:"ULONG",value:0},{name:"minMemType1",type:"ULONG",value:0},{name:"maxMemType1",type:"ULONG",value:0}])}var encoding=require("../encoding"),parse=require("../parse"),table=require("../table");exports.parse=parsePostTable,exports.make=makePostTable;


},{"../encoding":3,"../parse":7,"../table":9}],23:[function(require,module,exports){
"use strict";function log2(e){return Math.log(e)/Math.log(2)|0}function computeCheckSum(e){for(;e.length%4!==0;)e.push(0);for(var a=0,n=0;n<e.length;n+=4)a+=(e[n]<<24)+(e[n+1]<<16)+(e[n+2]<<8)+e[n+3];return a%=Math.pow(2,32)}function makeTableRecord(e,a,n,r){return new table.Table("Table Record",[{name:"tag",type:"TAG",value:void 0!==e?e:""},{name:"checkSum",type:"ULONG",value:void 0!==a?a:0},{name:"offset",type:"ULONG",value:void 0!==n?n:0},{name:"length",type:"ULONG",value:void 0!==r?r:0}])}function makeSfntTable(e){var a=new table.Table("sfnt",[{name:"version",type:"TAG",value:"OTTO"},{name:"numTables",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);a.tables=e,a.numTables=e.length;var n=Math.pow(2,log2(a.numTables));a.searchRange=16*n,a.entrySelector=log2(n),a.rangeShift=16*a.numTables-a.searchRange;for(var r=[],t=[],i=a.sizeOf()+makeTableRecord().sizeOf()*a.numTables;i%4!==0;)i+=1,t.push({name:"padding",type:"BYTE",value:0});for(var l=0;l<e.length;l+=1){var s=e[l];check.argument(4===s.tableName.length,"Table name"+s.tableName+" is invalid.");var m=s.sizeOf(),u=makeTableRecord(s.tableName,computeCheckSum(s.encode()),i,m);for(r.push({name:u.tag+" Table Record",type:"TABLE",value:u}),t.push({name:s.tableName+" table",type:"TABLE",value:s}),i+=m,check.argument(!isNaN(i),"Something went wrong calculating the offset.");i%4!==0;)i+=1,t.push({name:"padding",type:"BYTE",value:0})}return r.sort(function(e,a){return e.value.tag>a.value.tag?1:-1}),a.fields=a.fields.concat(r),a.fields=a.fields.concat(t),a}function metricsForChar(e,a,n){for(var r=0;r<a.length;r+=1){var t=e.charToGlyphIndex(a[r]);if(t>0){var i=e.glyphs[t];return i.getMetrics()}}return n}function average(e){for(var a=0,n=0;n<e.length;n+=1)a+=e[n];return a/e.length}function fontToSfntTable(e){for(var a=[],n=[],r=[],t=[],i=[],l=[],s=[],m=null,u=0,c=0,h=0,o=0,d=0,p=0;p<e.glyphs.length;p+=1){var f=e.glyphs[p],g=0|f.unicode;(m>g||null===m)&&(m=g),g>u&&(u=g);var y=os2.getUnicodeRange(g);if(32>y)c|=1<<y;else if(64>y)h|=1<<y-32;else if(96>y)o|=1<<y-64;else{if(!(123>y))throw new Error("Unicode ranges bits > 123 are reserved for internal usage");d|=1<<y-96}if(".notdef"!==f.name){var v=f.getMetrics();a.push(v.xMin),n.push(v.yMin),r.push(v.xMax),t.push(v.yMax),l.push(v.leftSideBearing),s.push(v.rightSideBearing),i.push(f.advanceWidth)}}var x={xMin:Math.min.apply(null,a),yMin:Math.min.apply(null,n),xMax:Math.max.apply(null,r),yMax:Math.max.apply(null,t),advanceWidthMax:Math.max.apply(null,i),advanceWidthAvg:average(i),minLeftSideBearing:Math.min.apply(null,l),maxLeftSideBearing:Math.max.apply(null,l),minRightSideBearing:Math.min.apply(null,s)};x.ascender=void 0!==e.ascender?e.ascender:x.yMax,x.descender=void 0!==e.descender?e.descender:x.yMin;var M=head.make({unitsPerEm:e.unitsPerEm,xMin:x.xMin,yMin:x.yMin,xMax:x.xMax,yMax:x.yMax}),T=hhea.make({ascender:x.ascender,descender:x.descender,advanceWidthMax:x.advanceWidthMax,minLeftSideBearing:x.minLeftSideBearing,minRightSideBearing:x.minRightSideBearing,xMaxExtent:x.maxLeftSideBearing+(x.xMax-x.xMin),numberOfHMetrics:e.glyphs.length}),S=maxp.make(e.glyphs.length),b=os2.make({xAvgCharWidth:Math.round(x.advanceWidthAvg),usWeightClass:500,usWidthClass:5,usFirstCharIndex:m,usLastCharIndex:u,ulUnicodeRange1:c,ulUnicodeRange2:h,ulUnicodeRange3:o,ulUnicodeRange4:d,sTypoAscender:x.ascender,sTypoDescender:x.descender,sTypoLineGap:0,usWinAscent:x.ascender,usWinDescent:-x.descender,sxHeight:metricsForChar(e,"xyvw",{yMax:0}).yMax,sCapHeight:metricsForChar(e,"HIKLEFJMNTZBDPRAGOQSUVWXY",x).yMax,usBreakChar:e.hasChar(" ")?32:0}),k=hmtx.make(e.glyphs),R=cmap.make(e.glyphs),N=e.familyName+" "+e.styleName,U=e.familyName.replace(/\s/g,"")+"-"+e.styleName,L=_name.make({copyright:e.copyright,fontFamily:e.familyName,fontSubfamily:e.styleName,uniqueID:e.manufacturer+":"+N,fullName:N,version:e.version,postScriptName:U,trademark:e.trademark,manufacturer:e.manufacturer,designer:e.designer,description:e.description,manufacturerURL:e.manufacturerURL,designerURL:e.designerURL,license:e.license,licenseURL:e.licenseURL,preferredFamily:e.familyName,preferredSubfamily:e.styleName}),C=post.make(),B=cff.make(e.glyphs,{version:e.version,fullName:N,familyName:e.familyName,weightName:e.styleName,postScriptName:U}),O=[M,T,S,b,L,R,C,B,k],w=makeSfntTable(O),q=w.encode(),W=computeCheckSum(q),A=w.fields,E=!1;for(p=0;p<A.length;p+=1)if("head table"===A[p].name){A[p].value.checkSumAdjustment=2981146554-W,E=!0;break}if(!E)throw new Error("Could not find head table with checkSum to adjust.");return w}var check=require("../check"),table=require("../table"),cmap=require("./cmap"),cff=require("./cff"),head=require("./head"),hhea=require("./hhea"),hmtx=require("./hmtx"),maxp=require("./maxp"),_name=require("./name"),os2=require("./os2"),post=require("./post");exports.computeCheckSum=computeCheckSum,exports.make=makeSfntTable,exports.fontToTable=fontToSfntTable;


},{"../check":1,"../table":9,"./cff":10,"./cmap":11,"./head":14,"./hhea":15,"./hmtx":16,"./maxp":19,"./name":20,"./os2":21,"./post":22}],24:[function(require,module,exports){
"use strict";function constant(e){return function(){return e}}var check=require("./check"),LIMIT16=32768,LIMIT32=2147483648,decode={},encode={},sizeOf={};encode.BYTE=function(e){return check.argument(e>=0&&255>=e,"Byte value should be between 0 and 255."),[e]},sizeOf.BYTE=constant(1),encode.CHAR=function(e){return[e.charCodeAt(0)]},sizeOf.BYTE=constant(1),encode.CHARARRAY=function(e){for(var n=[],o=0;o<e.length;o+=1)n.push(e.charCodeAt(o));return n},sizeOf.CHARARRAY=function(e){return e.length},encode.USHORT=function(e){return[e>>8&255,255&e]},sizeOf.USHORT=constant(2),encode.SHORT=function(e){return e>=LIMIT16&&(e=-(2*LIMIT16-e)),[e>>8&255,255&e]},sizeOf.SHORT=constant(2),encode.UINT24=function(e){return[e>>16&255,e>>8&255,255&e]},sizeOf.UINT24=constant(3),encode.ULONG=function(e){return[e>>24&255,e>>16&255,e>>8&255,255&e]},sizeOf.ULONG=constant(4),encode.LONG=function(e){return e>=LIMIT32&&(e=-(2*LIMIT32-e)),[e>>24&255,e>>16&255,e>>8&255,255&e]},sizeOf.LONG=constant(4),encode.FIXED=encode.ULONG,sizeOf.FIXED=sizeOf.ULONG,encode.FWORD=encode.SHORT,sizeOf.FWORD=sizeOf.SHORT,encode.UFWORD=encode.USHORT,sizeOf.UFWORD=sizeOf.USHORT,encode.LONGDATETIME=function(){return[0,0,0,0,0,0,0,0]},sizeOf.LONGDATETIME=constant(8),encode.TAG=function(e){return check.argument(4===e.length,"Tag should be exactly 4 ASCII characters."),[e.charCodeAt(0),e.charCodeAt(1),e.charCodeAt(2),e.charCodeAt(3)]},sizeOf.TAG=constant(4),encode.Card8=encode.BYTE,sizeOf.Card8=sizeOf.BYTE,encode.Card16=encode.USHORT,sizeOf.Card16=sizeOf.USHORT,encode.OffSize=encode.BYTE,sizeOf.OffSize=sizeOf.BYTE,encode.SID=encode.USHORT,sizeOf.SID=sizeOf.USHORT,encode.NUMBER=function(e){return e>=-107&&107>=e?[e+139]:e>=108&&1131>=e?(e-=108,[(e>>8)+247,255&e]):e>=-1131&&-108>=e?(e=-e-108,[(e>>8)+251,255&e]):e>=-32768&&32767>=e?encode.NUMBER16(e):encode.NUMBER32(e)},sizeOf.NUMBER=function(e){return encode.NUMBER(e).length},encode.NUMBER16=function(e){return[28,e>>8&255,255&e]},sizeOf.NUMBER16=constant(2),encode.NUMBER32=function(e){return[29,e>>24&255,e>>16&255,e>>8&255,255&e]},sizeOf.NUMBER32=constant(4),encode.NAME=encode.CHARARRAY,sizeOf.NAME=sizeOf.CHARARRAY,encode.STRING=encode.CHARARRAY,sizeOf.STRING=sizeOf.CHARARRAY,encode.UTF16=function(e){for(var n=[],o=0;o<e.length;o+=1)n.push(0),n.push(e.charCodeAt(o));return n},sizeOf.UTF16=function(e){return 2*e.length},encode.INDEX=function(e){var n,o=1,t=[o],c=[],r=0;for(n=0;n<e.length;n+=1){var f=encode.OBJECT(e[n]);Array.prototype.push.apply(c,f),r+=f.length,o+=f.length,t.push(o)}if(0===c.length)return[0,0];var d=[],i=1+Math.floor(Math.log(r)/Math.log(2))/8|0,u=[void 0,encode.BYTE,encode.USHORT,encode.UINT24,encode.ULONG][i];for(n=0;n<t.length;n+=1){var a=u(t[n]);Array.prototype.push.apply(d,a)}return Array.prototype.concat(encode.Card16(e.length),encode.OffSize(i),d,c)},sizeOf.INDEX=function(e){return encode.INDEX(e).length},encode.DICT=function(e){for(var n=[],o=Object.keys(e),t=o.length,c=0;t>c;c+=1){var r=parseInt(o[c],0),f=e[r];n=n.concat(encode.OPERAND(f.value,f.type)),n=n.concat(encode.OPERATOR(r))}return n},sizeOf.DICT=function(e){return encode.DICT(e).length},encode.OPERATOR=function(e){return 1200>e?[e]:[12,e-1200]},encode.OPERAND=function(e,n){var o=[];if(Array.isArray(n))for(var t=0;t<n.length;t+=1)check.argument(e.length===n.length,"Not enough arguments given for type"+n),o=o.concat(encode.OPERAND(e[t],n[t]));else o=o.concat("SID"===n?encode.NUMBER(e):"offset"===n?encode.NUMBER32(e):encode.NUMBER(e));return o},encode.OP=encode.BYTE,sizeOf.OP=sizeOf.BYTE;var wmm="function"==typeof WeakMap&&new WeakMap;encode.CHARSTRING=function(e){if(wmm&&wmm.has(e))return wmm.get(e);for(var n=[],o=e.length,t=0;o>t;t+=1){var c=e[t];n=n.concat(encode[c.type](c.value))}return wmm&&wmm.set(e,n),n},sizeOf.CHARSTRING=function(e){return encode.CHARSTRING(e).length},encode.OBJECT=function(e){var n=encode[e.type];return check.argument(void 0!==n,"No encoding function for type "+e.type),n(e.value)},encode.TABLE=function(e){for(var n=[],o=e.fields.length,t=0;o>t;t+=1){var c=e.fields[t],r=encode[c.type];check.argument(void 0!==r,"No encoding function for field type "+c.type);var f=e[c.name];void 0===f&&(f=c.value);var d=r(f);n=n.concat(d)}return n},encode.LITERAL=function(e){return e},sizeOf.LITERAL=function(e){return e.length},exports.decode=decode,exports.encode=encode,exports.sizeOf=sizeOf;


},{"./check":1}]},{},[6])(6)
});
