import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import { vi } from 'vitest';
import files from '../../../src/io/files';
import material from '../../../src/webgl/material';

// The mock p5 does not include the Friendly Error System, so these tests also
// cover the minified build, where `_internal()` is not defined.
suite('load*Shader for p5.strands files', function () {
  const builtShader = { isBuiltShader: true };
  const stubbed = [
    'buildMaterialShader',
    'buildNormalShader',
    'buildColorShader',
    'buildStrokeShader',
    'baseFilterShader',
    'createFilterShader'
  ];
  const originals = {};

  beforeAll(async () => {
    files(mockP5, mockP5Prototype);
    material(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });

    // Stub the shader builders so that only the loading logic is tested
    for (const name of stubbed) {
      originals[name] = mockP5Prototype[name];
    }
    mockP5Prototype.buildMaterialShader = vi.fn(() => builtShader);
    mockP5Prototype.buildNormalShader = vi.fn(() => builtShader);
    mockP5Prototype.buildColorShader = vi.fn(() => builtShader);
    mockP5Prototype.buildStrokeShader = vi.fn(() => builtShader);
    mockP5Prototype.baseFilterShader = vi.fn(() => ({
      modify: vi.fn(() => builtShader)
    }));
    mockP5Prototype.createFilterShader = vi.fn(() => builtShader);
  });

  afterAll(() => {
    for (const name of stubbed) {
      mockP5Prototype[name] = originals[name];
    }
  });

  const loaders = [
    ['loadMaterialShader', 'buildMaterialShader', 'testMaterial.js'],
    ['loadNormalShader', 'buildNormalShader', 'testNormal.js'],
    ['loadColorShader', 'buildColorShader', 'testColor.js'],
    ['loadStrokeShader', 'buildStrokeShader', 'testStroke.js']
  ];

  for (const [loader, builder, file] of loaders) {
    test(`${loader}() returns the shader built from the file`, async () => {
      const onFail = vi.fn();
      const shader = await mockP5Prototype[loader](
        `/test/unit/assets/${file}`,
        undefined,
        onFail
      );
      expect(onFail).not.toHaveBeenCalled();
      expect(mockP5Prototype[builder]).toHaveBeenCalledOnce();
      assert.strictEqual(shader, builtShader);
    });
  }

  test('loadFilterShader() returns the shader built from a p5.strands file', async () => {
    const shader = await mockP5Prototype.loadFilterShader(
      '/test/unit/assets/testFilter.js'
    );
    expect(mockP5Prototype.baseFilterShader).toHaveBeenCalledOnce();
    assert.strictEqual(shader, builtShader);
  });

  test('loadFilterShader() returns the shader built from a GLSL file', async () => {
    const shader = await mockP5Prototype.loadFilterShader(
      '/test/unit/assets/frag.glsl'
    );
    expect(mockP5Prototype.createFilterShader).toHaveBeenCalledOnce();
    assert.strictEqual(shader, builtShader);
  });
});
