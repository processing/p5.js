suite('p5.Texture', function() {
  var myp5;
  var texImg1;
  var texImg2;

  if (!window.Modernizr.webgl) {
    //assert(false, 'could not run gl tests');
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        texImg1 = p.loadImage('unit/assets/nyan_cat.gif');
        texImg2 = p.loadImage('unit/assets/target.gif');
        p.texture(texImg1);
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var testTextureSet = function(src) {
    assert(
      myp5._renderer.curFillShader === myp5._renderer._getLightShader(),
      'shader was not set to light + texture shader after ' +
        'calling texture()'
    );
    var tex = myp5._renderer.getTexture(src);
    assert(tex !== undefined, 'texture was undefined');
    assert(tex instanceof p5.Texture, 'texture was not a p5.Texture object');
    assert(tex.src === src, 'texture did not have expected image as source');
  };

  suite('p5.Texture', function() {
    test('Create and cache a single texture with p5.Image', function() {
      testTextureSet(texImg1);
    });
    test('Create and cache multiple p5.Image textures', function() {
      myp5.texture(texImg2);
      testTextureSet(texImg2);
      // other image was made into a texture in setup, should still be there!
      //testTextureSet(texImg1);
    });
  });
});
