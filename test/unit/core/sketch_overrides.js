import {
  verifierUtils
} from '../../../src/friendly_errors/sketch_verifier.js';

suite('Sketch Verifier', function () {
  const mockP5 = {
    _validateParameters: vi.fn(),
    Color: function () { },
    Vector: function () { },
    prototype: {
      rect: function () { },
      ellipse: function () { },
    }
  };

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals();
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
      const result = await verifierUtils.fetchScript(mockScript);

      expect(mockFetch).toHaveBeenCalledWith(url);
      expect(result).toBe(code);
    });

    test('Fetches code when there is no src attribute', async function () {
      const mockScript = { textContent: code };
      const result = await verifierUtils.fetchScript(mockScript);

      expect(result).toBe(code);
    });
  });

  suite('getUserCode()', function () {
    const userCode = "let c = p5.Color(20, 20, 20);";

    test('fetches the last script element', async function () {
      const fakeDocument = document.createElement('div');
      fakeDocument.innerHTML = `
        <script src="p5.js"></script>
        <script src="www.p5test.com/sketch.js"></script>
        <script>let c = p5.Color(20, 20, 20);</script>
      `;
      vi.spyOn(document, 'querySelectorAll')
        .mockImplementation((...args) => fakeDocument.querySelectorAll(...args));

      vi.spyOn(verifierUtils, 'fetchScript')
        .mockImplementation(() => Promise.resolve(userCode));

      const result = await verifierUtils.getUserCode();

      expect(verifierUtils.fetchScript).toHaveBeenCalledTimes(1);
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

      const result = verifierUtils.extractUserDefinedVariablesAndFuncs(code);
      const expectedResult = {
        "functions": [
          {
            "line": 5,
            "name": "foo",
          },
          {
            "line": 6,
            "name": "bar",
          },
          {
            "line": 7,
            "name": "baz",
          },
        ],
        "variables": [
          {
            "line": 1,
            "name": "x",
          },
          {
            "line": 2,
            "name": "y",
          },
          {
            "line": 3,
            "name": "z",
          },
          {
            "line": 4,
            "name": "v1",
          },
          {
            "line": 4,
            "name": "v2",
          },
          {
            "line": 4,
            "name": "v3",
          },
        ],
      };
      expect(result).toEqual(expectedResult);
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

      const result = verifierUtils.extractUserDefinedVariablesAndFuncs(code);
      const expectedResult = {
        "functions": [],
        "variables": [
          {
            "line": 2,
            "name": "x",
          },
          {
            "line": 6,
            "name": "y",
          },
          {
            "line": 11,
            "name": "z",
          },
          {
            "line": 13,
            "name": "i",
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });

    test('Handles parsing errors', function () {
      const invalidCode = 'let x = ;';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      const result = verifierUtils.extractUserDefinedVariablesAndFuncs(invalidCode);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({ variables: [], functions: [] });
      consoleSpy.mockRestore();
    });
  });

  suite('checkForConstsAndFuncs()', function () {
    // Set up for this suite of tests
    let consoleSpy;

    class MockP5 {
      setup() {}
      draw() {}
      rect() {}
    }

    beforeEach(function () {
      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(function () {
      consoleSpy.mockRestore();
    });

    test('Detects conflict with p5.js constant', function () {
      const userDefinitions = {
        variables: [{ name: 'PI', line: 1 }],
        functions: []
      };
      const result = verifierUtils.checkForConstsAndFuncs(userDefinitions, MockP5);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Constant "PI" on line 1 is being redeclared and conflicts with a p5.js constant'
        )
      );
    });

    test('Detects conflict with p5.js global function', function () {
      const userDefinitions = {
        variables: [],
        functions: [{ name: 'rect', line: 2 }]
      };
      const result = verifierUtils.checkForConstsAndFuncs(userDefinitions, MockP5);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Function "rect" on line 2 is being redeclared and conflicts with a p5.js function'
        )
      );
    });

    test('Allows redefinition of whitelisted functions', function () {
      const userDefinitions = {
        variables: [],
        functions: [
          { name: 'setup', line: 1 },
          { name: 'draw', line: 2 },
          { name: 'preload', line: 3 }
        ]
      };

      const result = verifierUtils.checkForConstsAndFuncs(userDefinitions, MockP5);

      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('Returns false when no conflicts are found', function () {
      const userDefinitions = {
        variables: [{ name: 'img', line: 1 }],
        functions: [{ name: 'cut', line: 2 }]
      };

      const result = verifierUtils.checkForConstsAndFuncs(userDefinitions, MockP5);

      expect(result).toBe(false);
    });
  });
});
