import p5 from '../../src/app.js';
import rendererWebGPU from '../../src/webgpu/p5.RendererWebGPU.js';

p5.registerAddon(rendererWebGPU);

suite('Storage Buffer Element Type Checking', function() {
  let spy;
  const check = p5.RendererWebGPU.prototype._checkStorageElementType;

  beforeEach(function() {
    spy = vi.spyOn(p5, '_friendlyError').mockImplementation(() => {});
    p5.disableFriendlyErrors = false;
  });

  afterEach(function() {
    spy.mockRestore();
    p5.disableFriendlyErrors = false;
  });

  function makeParsed(elementType, name = 'counts') {
    return { elementType, name };
  }

  function makeBuffer(ArrayType, schema = null) {
    return { _arrayType: ArrayType, _schema: schema, _warnedElementType: false };
  }

  test('atomic<u32> unwraps to u32 and matches Uint32Array silently', function() {
    check(makeParsed('atomic<u32>'), makeBuffer(Uint32Array));
    expect(spy).not.toHaveBeenCalled();
  });

  test('mismatch warns once then stays quiet on second call', function() {
    const parsed = makeParsed('atomic<u32>', 'counts');
    const buf = makeBuffer(Float32Array);

    check(parsed, buf);
    expect(spy).toHaveBeenCalledOnce();
    expect(buf._warnedElementType).to.equal(true);

    spy.mockClear();
    check(parsed, buf);
    expect(spy).not.toHaveBeenCalled();
  });

  test('struct schema buffer bails without warning', function() {
    check(makeParsed('f32'), makeBuffer(Float32Array, {}));
    expect(spy).not.toHaveBeenCalled();
  });

  test('p5.disableFriendlyErrors suppresses the warning', function() {
    p5.disableFriendlyErrors = true;
    const buf = makeBuffer(Float32Array);
    check(makeParsed('u32'), buf);
    expect(spy).not.toHaveBeenCalled();
    expect(buf._warnedElementType).to.equal(false);
  });
});
