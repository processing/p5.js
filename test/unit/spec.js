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
Object.keys(spec).map(function(folder) {
  spec[folder].map(function(file) {
    var string = [
      '<script src="unit/',
      folder,
      '/',
      file,
      '.js" type="text/javascript" ></script>'
    ];
    document.write(string.join(''));
  });
});

p5._throwValidationErrors = true;

// a custom assertion for validation errors that correctly handles
// minified p5 libraries.
assert.validationError = function(fn) {
  if (p5.ValidationError) {
    assert.throws(fn, p5.ValidationError);
  } else {
    assert.doesNotThrow(fn, Error, 'got unwanted exception');
  }
};
