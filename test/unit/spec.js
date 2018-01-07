var spec = {
  addons: ['p5.dom'],
  color: ['color_conversion', 'creating_reading', 'p5.Color', 'setting'],
  core: [
    '2d_primitives',
    'core',
    'curves',
    'element',
    'error_helpers',
    'renderer',
    'structure'
  ],
  data: ['dictionary'],
  image: ['loading', 'pixels'],
  io: ['files_input'],
  math: ['calculation', 'noise', 'p5.Vector', 'random', 'trigonometry'],
  typography: ['font_loading'],
  utilities: ['array_functions', 'string_functions', 'time_date'],
  webgl: [
    'matrix',
    'p5.RendererGL',
    'p5.Shader',
    'p5.Texture',
    'pixels',
    'stroke'
  ]
};

// State for script loading
// start at 1 since window.onload counts as a script load as well
var specScripts = 1;
var specLoadedScripts = 0;

Object.keys(spec).forEach(function(folder) {
  spec[folder].forEach(function(file) {
    loadScript('unit/' + folder + '/' + file + '.js');
  });
});

// Code for loading scripts dynamically
// Calls allScriptsLoaded when all scripts are loaded + onload has fired

function onScriptLoad(err) {
  if (err) {
    console.log(err);
    throw err;
  }

  specLoadedScripts++;
  if (specScripts === specLoadedScripts) {
    window.allScriptsLoaded();
  }
}

function loadScript(src) {
  specScripts++;

  var head = document.head || document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.charset = 'utf8';
  script.src = src;

  script.onload = function() {
    this.onerror = this.onload = null;
    onScriptLoad(null);
  };

  script.onerror = function() {
    onScriptLoad(new Error('Failed to load ' + this.src));
  };

  head.appendChild(script);
}

window.addEventListener('load', function() {
  onScriptLoad(null);
});

// Listen to uncaught errors to let us forward them to mocha
window.addEventListener('error', function errorListener(event) {
  var error = event.error;

  // PhantomJS doesn't include event.error :(
  if (error == null) {
    error = new Error(event.message);

    // Log an ErrorEvent
    console.log(
      'Error:',
      event.message,
      'in',
      event.filename,
      'at',
      event.lineno + ':' + event.colno
    );
  }

  mocha.throwError(event);
});
