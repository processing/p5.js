var spec = {
  addons: ['p5.dom'],
  color: ['color_conversion', 'creating_reading', 'p5.Color', 'setting'],
  core: [
    '2d_primitives',
    'curves',
    'environment',
    'error_helpers',
    'main',
    'p5.Element',
    'rendering',
    'structure'
  ],
  data: ['p5.TypedDict'],
  image: ['loading', 'pixels'],
  io: [
    'files',
    'loadBytes',
    'loadStrings',
    'loadXML',
    'loadJSON',
    'loadTable',
    'loadImage',
    'loadModel'
  ],
  math: ['calculation', 'noise', 'p5.Vector', 'random', 'trigonometry'],
  typography: ['loadFont'],
  utilities: ['array_functions', 'string_functions', 'time_date'],
  webgl: ['p5.Matrix', 'p5.Camera', 'p5.RendererGL', 'p5.Shader', 'p5.Texture']
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
