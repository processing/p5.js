var spec = {
  accessibility: ['describe', 'outputs'],
  color: ['color_conversion', 'creating_reading', 'p5.Color', 'setting'],
  core: [
    '2d_primitives',
    'attributes',
    'curves',
    'environment',
    'error_helpers',
    'main',
    'p5.Element',
    'p5.Graphics',
    'param_errors',
    'preload',
    'rendering',
    'sketch_overrides',
    'structure',
    'transform',
    'version',
    'vertex'
  ],
  data: ['p5.TypedDict', 'local_storage'],
  dom: ['dom'],
  events: ['keyboard', 'mouse', 'touch', 'acceleration'],
  image: ['p5.Image', 'loading', 'pixels', 'filters', 'downloading'],
  io: [
    'files',
    'loadBytes',
    'loadStrings',
    'loadXML',
    'loadJSON',
    'loadTable',
    'saveTable',
    'loadImage',
    'loadModel',
    'loadShader'
  ],
  math: ['calculation', 'noise', 'p5.Vector', 'random', 'trigonometry'],
  typography: ['attributes', 'loadFont', 'p5.Font'],
  utilities: ['array_functions', 'conversion', 'string_functions', 'time_date'],
  webgl: [
    '3d_primitives',
    'interaction',
    'p5.Matrix',
    'p5.Camera',
    'p5.Framebuffer',
    'p5.Geometry',
    'p5.RendererGL',
    'p5.Shader',
    'p5.Texture',
    'light'
  ],
  'visual/cases': [
    // Add the visual tests that you want run as part of CI here. Feel free
    // to omit some for speed if they should only be run manually.
    'webgl',
    'typography',
    'shape_modes'
  ]
};
document.write(
  '<script src="unit/visual/visualTest.js" type="text/javascript"></script>'
);
Object.keys(spec).map(function (folder) {
  spec[folder].map(function (file) {
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
