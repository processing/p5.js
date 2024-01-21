# Supported browsers

## Our stated goal
p5.js uses [browserslist](https://browsersl.ist/) and [Babel](https://babeljs.io/) to provide support for older browsers. The browserslist configuration in use is [`last 2 versions, not dead`](https://browserslist.dev/?q=bGFzdCAyIHZlcnNpb25zLCBub3QgZGVhZA%3D%3D). `last 2 versions` means the last two releases of any browsers, `not dead` means browsers that had official support or updates in the past 24 months. Both of these conditions must be true for a browser to be supported.

In practice, you can still use most of the latest features available in Javascript because Babel will likely be able to transpile or polyfill them to something matching the required compatibility list. Some features such as [Web API](https://developer.mozilla.org/en-US/docs/Web/API), [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), or similar features not part of the core Javascript language cannot be handled by Babel and will need to be assessed on a case by case basis.

Good places to check if a feature is available are [caniuse.com](https://caniuse.com/) and [MDN](https://developer.mozilla.org/en-US/).

## Where does this apply
The supported browsers requirement will apply to the p5.js source code, all examples (both website examples page and documentation), and all official tutorials. Third party add-on libraries does not have to adhere to the same requirement but are encouraged to do so.

In many cases browsers not officially supported will likely still work with p5.js but we provide no guarantee for this case.

Stewards of each section will be responsible for ensuring PR involving code changes adhere to this requirement.