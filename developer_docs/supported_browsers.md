** This page is out of date. Help us update it! (See the stated goal below.) **

# Supported browsers

## Our stated goal:

We support the current version of the browser, plus the previous major release of the browser.

## Potential issues:

* We are using webGL, which has limited support in IE 10, firefox, and the Android browser.
* We are using typed arrays, which does not have support for Uint8ClampedArray in IE 10 and IE Mobile 10/11.
* Canvas blend modes are not supported in IE.
* WebAudio is not supported in IE or the Android Browser.


As of August 2016, this means that we support:

|Browser            |  Current Version  | Previous Version|  Notes                    
|-------------------|------------------:|----------------:|--------------
|Internet Explorer  |             v. 11 |  v. 10          | Needs a polyfill for Uint8ClampedArray.  <br> No support for WebAudio. 
|IE Mobile          |             v. 11 |  v.10           | v.10 does not fully support webGL.<br>Needs a polyfill for Uint8ClampedArray.   <br> No support for WebAudio.
|Microsoft Edge     |             v. 25 |  v. 23          |
|Chrome             |             v. 52 |  v. 51          |
|Chrome for Android |             v. 40 |                 | Not sure if previous versions exist
|Firefox            |             v. 47 |  v. 36          | 
|Safari             |             v. 9  |  v. 8           |
|iOS Safari         |             v. 9  |  v. 8           |
|Android Browser    |             v. 40 |  v. 4.4.4       | Does not support webGL.  <br> No support for WebAudio.
|Opera              |             v. 39 |  v. 38          |

We will try to list all known problems across the different browsers here but for a complete list of supported feature on a browser visit [caniuse.com](http://caniuse.com) and search for specific features (ie. [Webgl](http://caniuse.com/#search=webgl))