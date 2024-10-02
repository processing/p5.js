import sketchVerifier from '../../../src/core/friendly_errors/sketch_verifier.js';

suite('Validate Params', function () {
  const mockP5 = {
    _validateParameters: vi.fn()
  };
  const mockP5Prototype = {};

  beforeAll(function () {
    sketchVerifier(mockP5, mockP5Prototype);
  });

  afterAll(function () {
  });

  suite('fetchScript()', function () {
    const url = 'https://www.p5test.com/sketch.js';
    const code = 'p.createCanvas(200, 200);';

    test('Fetches script content from src', async function () {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          text: () => Promise.resolve(code)
        })
      );
      vi.stubGlobal('fetch', mockFetch);

      const mockScript = { src: url };
      const result = await mockP5Prototype.fetchScript(mockScript);

      expect(mockFetch).toHaveBeenCalledWith(url);
      expect(result).toBe(code);

      vi.unstubAllGlobals();
    });

    test('Fetches code when there is no src attribute', async function () {
      const mockScript = { textContent: code };
      const result = await mockP5Prototype.fetchScript(mockScript);

      expect(result).toBe(code);
    });
  });

  suite('getUserCode()', function () {
    const userCode = "let c = p5.Color(20, 20, 20);";

    test('fetches the last script element', async function () {
      document.body.innerHTML = `
        <script src="p5.js"></script>
        <script src="www.p5test.com/sketch.js"></script>
        <script>let c = p5.Color(20, 20, 20);</script>
      `;

      mockP5Prototype.fetchScript = vi.fn(() => Promise.resolve(userCode));

      const result = await mockP5Prototype.getUserCode();

      expect(mockP5Prototype.fetchScript).toHaveBeenCalledTimes(1);
      expect(result).toBe(userCode);
    });
  });

  suite('extractUserDefinedVariablesAndFuncs()', function () {
    test('Extracts user-defined variables and functions', function () {
      const code = `
        let x = 5;
        const y = 10;
        var z = 15;
        let v1, v2, v3
        function foo() {}
        const bar = () => {};
        const baz = (x) => x * 2;
      `;

      const result = mockP5Prototype.extractUserDefinedVariablesAndFuncs(code);

      expect(result.variables).toEqual(['x', 'y', 'z', 'v1', 'v2', 'v3']);
      expect(result.functions).toEqual(['foo', 'bar', 'baz']);
    });

    // Sketch verifier should ignore the following types of lines:
    //    - Comments (both single line and multi-line)
    //    - Function calls
    //    - Non-declaration code
    test('Ignores other lines', function () {
      const code = `
        // This is a comment
        let x = 5;
        /* This is a multi-line comment.
         * This is a multi-line comment.
         */
        const y = 10;
        console.log("This is a statement");
        foo(5);
        p5.Math.random();
        if (true) {
          let z = 15;
        }
        for (let i = 0; i < 5; i++) {}
      `;

      const result = mockP5Prototype.extractUserDefinedVariablesAndFuncs(code);

      expect(result.variables).toEqual(['x', 'y', 'z', 'i']);
      expect(result.functions).toEqual([]);
    });

    test('Handles parsing errors', function () {
      const invalidCode = 'let x = ;';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      const result = mockP5Prototype.extractUserDefinedVariablesAndFuncs(invalidCode);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({ variables: [], functions: [] });

      consoleSpy.mockRestore();
    });
  });

  suite('run()', function () {
    test('Returns extracted variables and functions', async function () {
      const mockScript = `
        let x = 5;
        const y = 10;
        function foo() {}
        const bar = () => {};
      `;
      mockP5Prototype.getUserCode = vi.fn(() => Promise.resolve(mockScript));

      const result = await mockP5Prototype.run();

      expect(mockP5Prototype.getUserCode).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        variables: ['x', 'y'],
        functions: ['foo', 'bar']
      });
    });
  });
});