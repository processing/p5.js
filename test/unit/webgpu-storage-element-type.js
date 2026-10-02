import p5 from '../../src/app.js';
import rendererWebGPU from '../../src/webgpu/p5.RendererWebGPU.js';

p5.registerAddon(rendererWebGPU);

suite('Storage Buffer Element Type Checking', function() {
  let spy;
  const check = p5.RendererWebGPU.prototype._checkStorageElementType;
  const resolve = p5.RendererWebGPU.prototype._storageArrayTypeFor;

  beforeEach(function() {
    spy = vi.spyOn(p5, '_friendlyError').mockImplementation(() => {});
    p5.disableFriendlyErrors = false;
  });

  afterEach(function() {
    spy.mockRestore();
    p5.disableFriendlyErrors = false;
  });

  // Mirrors what getUniformMetadata() puts on a parsed storage buffer, which
  // is where the element type is resolved.
  function makeParsed(elementType, name = 'counts') {
    return { elementType, name, expectedArrayType: resolve(elementType) };
  }

  function makeBuffer(ArrayType, schema = null) {
    return {
      _arrayType: ArrayType,
      _schema: schema,
      _checkedArrayType: undefined
    };
  }

  test('resolves WGSL element types, unwrapping atomics', function() {
    expect(resolve('f32')).to.equal(Float32Array);
    expect(resolve('u32')).to.equal(Uint32Array);
    expect(resolve('i32')).to.equal(Int32Array);
    expect(resolve('atomic<u32>')).to.equal(Uint32Array);
    expect(resolve('atomic<i32>')).to.equal(Int32Array);
  });

  test('unknown element types resolve to undefined', function() {
    expect(resolve('bool')).to.equal(undefined);
    expect(resolve(undefined)).to.equal(undefined);
  });

  test('atomic<u32> matches Uint32Array silently', function() {
    const buf = makeBuffer(Uint32Array);
    check(makeParsed('atomic<u32>'), buf);
    expect(spy).not.toHaveBeenCalled();
    // Cached even on the matching path so later frames skip the check
    expect(buf._checkedArrayType).to.equal(Uint32Array);
  });

  test('mismatch warns once then stays quiet on second call', function() {
    const parsed = makeParsed('atomic<u32>', 'counts');
    const buf = makeBuffer(Float32Array);

    check(parsed, buf);
    expect(spy).toHaveBeenCalledOnce();
    expect(buf._checkedArrayType).to.equal(Uint32Array);

    const [message, source] = spy.mock.calls[0];
    expect(message).to.contain('counts');
    expect(message).to.contain('atomic<u32>');
    expect(message).to.contain('Uint32Array');
    expect(source).to.equal('createStorage');

    spy.mockClear();
    check(parsed, buf);
    expect(spy).not.toHaveBeenCalled();
  });

  test('a buffer rebound to a different element type is checked again',
    function() {
      const buf = makeBuffer(Float32Array);
      check(makeParsed('atomic<u32>'), buf);
      expect(spy).toHaveBeenCalledOnce();

      spy.mockClear();
      check(makeParsed('i32'), buf);
      expect(spy).toHaveBeenCalledOnce();
    });

  test('struct schema buffer bails without warning', function() {
    check(makeParsed('f32'), makeBuffer(Float32Array, {}));
    expect(spy).not.toHaveBeenCalled();
  });

  test('unknown element types are not checked', function() {
    const buf = makeBuffer(Float32Array);
    check(makeParsed('bool'), buf);
    expect(spy).not.toHaveBeenCalled();
    expect(buf._checkedArrayType).to.equal(undefined);
  });

  test('p5.disableFriendlyErrors suppresses the warning', function() {
    p5.disableFriendlyErrors = true;
    const buf = makeBuffer(Float32Array);
    check(makeParsed('u32'), buf);
    expect(spy).not.toHaveBeenCalled();
    expect(buf._checkedArrayType).to.equal(undefined);
  });
});
