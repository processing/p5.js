import sketchVerifier from '../../../src/core/friendly_errors/sketch_verifier.js';

suite('Sketch Verifier', function () {
  const mockP5 = {
    _validateParameters: vi.fn(),
    Render: function () {
      return 'mock render';
    },
  };
  const mockP5Prototype = {};

  beforeAll(function () {
    sketchVerifier(mockP5, mockP5Prototype);
    mockP5Prototype.loadP5Constructors();
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

      const result = mockP5Prototype.extractUserDefinedVariablesAndFuncs(code);
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

      const result = mockP5Prototype.extractUserDefinedVariablesAndFuncs(invalidCode);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({ variables: [], functions: [] });

      consoleSpy.mockRestore();
    });
  });

  suite('checkForConstsAndFuncs()', function () {
    test('Detects conflict with p5.js constant', function () {
      const userDefinitions = {
        variables: [{ name: 'PI', line: 1 }],
        functions: []
      };
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

      const result = mockP5Prototype.checkForConstsAndFuncs(userDefinitions);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Constant "PI" on line 1 is being redeclared and conflicts with a p5.js constant'));

      consoleSpy.mockRestore();
    });

    test('Detects conflict with p5.js global function', function () {
      const userDefinitions = {
        variables: [],
        functions: [{ name: 'setup', line: 2 }]
      };
      //const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

      const result = mockP5Prototype.checkForConstsAndFuncs(userDefinitions);

      expect(result).toBe(true);
      //expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Function "setup" on line 2 is being redeclared and conflicts with a p5.js function'));

      //consoleSpy.mockRestore();
    });

    test('Returns false when no conflicts are found', function () {
      const userDefinitions = {
        variables: [{ name: 'img', line: 1 }],
        functions: [{ name: 'cut', line: 2 }]
      };

      const result = mockP5Prototype.checkForConstsAndFuncs(userDefinitions);

      expect(result).toBe(false);
    });
  });

  suite('run()', function () {
    test('Extracts user-defined variables and functions and checks for conflicts', async function () {
      const mockScript = `
        let x = 5;
        const y = 10;
        function foo() {}
        const bar = () => {};
        class MyClass {}
      `;
      mockP5Prototype.getUserCode = vi.fn(() => Promise.resolve(mockScript));
      mockP5Prototype.extractUserDefinedVariablesAndFuncs = vi.fn(() => ({
        variables: [
          { name: 'x', line: 1 },
          { name: 'y', line: 2 },
          { name: 'MyClass', line: 5 }
        ],
        functions: [
          { name: 'foo', line: 3 },
          { name: 'bar', line: 4 }
        ]
      }));
      mockP5Prototype.checkForConstsAndFuncs = vi.fn(() => false);

      await mockP5Prototype.run();

      expect(mockP5Prototype.getUserCode).toHaveBeenCalledTimes(1);
      expect(mockP5Prototype.extractUserDefinedVariablesAndFuncs).toHaveBeenCalledWith(mockScript);
      expect(mockP5Prototype.checkForConstsAndFuncs).toHaveBeenCalledWith({
        variables: [
          { name: 'x', line: 1 },
          { name: 'y', line: 2 },
          { name: 'MyClass', line: 5 }
        ],
        functions: [
          { name: 'foo', line: 3 },
          { name: 'bar', line: 4 }
        ]
      });
    });

    test('Stops execution when a conflict is found', async function () {
      const mockScript = `
        let PI = 3.14;
        function setup() {}
      `;
      mockP5Prototype.getUserCode = vi.fn(() => Promise.resolve(mockScript));
      mockP5Prototype.extractUserDefinedVariablesAndFuncs = vi.fn(() => ({
        variables: [{ name: 'PI', line: 1 }],
        functions: [{ name: 'setup', line: 2 }]
      }));
      mockP5Prototype.checkForConstsAndFuncs = vi.fn(() => true);

      const result = await mockP5Prototype.run();

      expect(mockP5Prototype.getUserCode).toHaveBeenCalledTimes(1);
      expect(mockP5Prototype.extractUserDefinedVariablesAndFuncs).toHaveBeenCalledWith(mockScript);
      expect(mockP5Prototype.checkForConstsAndFuncs).toHaveBeenCalledWith({
        variables: [{ name: 'PI', line: 1 }],
        functions: [{ name: 'setup', line: 2 }]
      });
      expect(result).toBeUndefined();
    });
  });
});