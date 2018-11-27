#### This page is out of date. Help us update it! See our stated goal below.

# Supported browsers

## Our stated goal:

We support the current version of the browser, plus the previous major release of the browser. Exceptions: Internet Explorer, which has not had a new major release since 2013, we support only the most recent major release (v.11); Safari, which has not had a new major release since 2015, we support only the most recent major release (v.11)

## Potential issues:

* We are using webGL, which has limited support in IE 10, Firefox, and the Android browser.
* We are using typed arrays, which does not have support for Uint8ClampedArray in IE 10 and IE Mobile 10/11.
* Canvas blend modes are not supported in IE.
* WebAudio is not supported in IE or the Android Browser.


As of September 2018, this means that we support:

|Browser            |  Current Version  | Previous Version|  Notes                    
|-------------------|------------------:|----------------:|--------------
|Internet Explorer  |             v. 11 |  Not supported  | No support for WebAudio
|Microsoft Edge     |             v. 42 |  v. 41          |
|Chrome             |             v. 68 |  v. 67          |
|Chrome for Android |             v. 68 |  v. 67          |
|Firefox            |             v. 61 |  v. 60          | 
|Safari             |             v. 11 |  Not supported  |
|iOS Safari         |           v. 11.4 |  v. 11.2        |
|Opera              |             v. 54 |  v. 53          |

We will try to list all known problems across the different browsers here but for a complete list of supported feature on a browser visit [caniuse.com](http://caniuse.com) and search for specific features (ie. [WebGL](http://caniuse.com/#search=webgl))
