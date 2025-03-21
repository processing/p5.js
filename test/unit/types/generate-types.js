import { suite, test, expect } from 'vitest';
import {
  normalizeClassName,
  generateTypeFromTag,
  generateParamDeclaration,
  generateFunctionDeclaration,
  generateClassDeclaration,
  generateMethodDeclarations,
  generateTypeDefinitions
} from '../../../utils/helper.mjs';

// Move absFuncDoc to the top level
const absFuncDoc = {
  "description": {
    "type": "root",
    "children": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "value": "Calculates the absolute value of a number."
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "value": "A number's absolute value is its distance from zero on the number line.\n-5 and 5 are both five units away from zero, so calling "
          },
          {
            "type": "inlineCode",
            "value": "abs(-5)"
          },
          {
            "type": "text",
            "value": " and\n"
          },
          {
            "type": "inlineCode",
            "value": "abs(5)"
          },
          {
            "type": "text",
            "value": " both return 5. The absolute value of a number is always positive."
          }
        ]
      }
    ]
  },
  "tags": [
    {
      "title": "method",
      "description": null,
      "lineNumber": 7,
      "name": "abs"
    },
    {
      "title": "param",
      "description": "number to compute.",
      "lineNumber": 8,
      "type": {
        "type": "NameExpression",
        "name": "Number"
      },
      "name": "n"
    },
    {
      "title": "return",
      "description": "absolute value of given number.",
      "lineNumber": 9,
      "type": {
        "type": "NameExpression",
        "name": "Number"
      }
    },
    {
      "title": "example",
      "description": "<div>\n<code>\nfunction setup() {\n  createCanvas(100, 100);\n\n  describe('A gray square with a vertical black line that divides it in half. A white rectangle gets taller when the user moves the mouse away from the line.');\n}\n\nfunction draw() {\n  background(200);\n\n  // Divide the canvas.\n  line(50, 0, 50, 100);\n\n  // Calculate the mouse's distance from the middle.\n  let h = abs(mouseX - 50);\n\n  // Draw a rectangle based on the mouse's distance\n  // from the middle.\n  rect(0, 100 - h, 100, h);\n}\n</code>\n</div>",
      "lineNumber": 11
    }
  ],
  "loc": {
    "start": {
      "line": 9,
      "column": 2,
      "index": 112
    },
    "end": {
      "line": 44,
      "column": 5,
      "index": 1167
    }
  },
  "context": {
    "loc": {
      "start": {
        "line": 45,
        "column": 2,
        "index": 1170
      },
      "end": {
        "line": 45,
        "column": 20,
        "index": 1188
      }
    },
    "file": "C:\\Users\\diyas\\Documents\\p5.js\\src\\math\\calculation.js"
  },
  "augments": [],
  "examples": [
    {
      "description": "<div>\n<code>\nfunction setup() {\n  createCanvas(100, 100);\n\n  describe('A gray square with a vertical black line that divides it in half. A white rectangle gets taller when the user moves the mouse away from the line.');\n}\n\nfunction draw() {\n  background(200);\n\n  // Divide the canvas.\n  line(50, 0, 50, 100);\n\n  // Calculate the mouse's distance from the middle.\n  let h = abs(mouseX - 50);\n\n  // Draw a rectangle based on the mouse's distance\n  // from the middle.\n  rect(0, 100 - h, 100, h);\n}\n</code>\n</div>"
    }
  ],
  "implements": [],
  "params": [
    {
      "title": "param",
      "name": "n",
      "lineNumber": 8,
      "description": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "value": "number to compute."
              }
            ]
          }
        ]
      },
      "type": {
        "type": "NameExpression",
        "name": "Number"
      }
    }
  ],
  "properties": [],
  "returns": [
    {
      "description": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "value": "absolute value of given number."
              }
            ]
          }
        ]
      },
      "title": "returns",
      "type": {
        "type": "NameExpression",
        "name": "Number"
      }
    }
  ],
  "sees": [],
  "throws": [],
  "todos": [],
  "yields": [],
  "kind": "function",
  "name": "abs",
  "members": {
    "global": [],
    "inner": [],
    "instance": [],
    "events": [],
    "static": []
  },
  "path": [
    {
      "name": "abs",
      "kind": "function"
    }
  ],
  "namespace": "abs"
};

suite('normalizeClassName', () => {
  test('should handle different class name formats', () => {
    expect(normalizeClassName('p5')).toBe('p5');
    expect(normalizeClassName('Vector')).toBe('p5.Vector');
    expect(normalizeClassName('p5.Color')).toBe('p5.Color');
    expect(normalizeClassName()).toBe('p5');
  });
});

suite('generateTypeFromTag', () => {
  test('should handle primitive types', () => {
    expect(generateTypeFromTag({
      type: { type: 'NameExpression', name: 'Number' }
    })).toBe('number');
    expect(generateTypeFromTag({
      type: { type: 'NameExpression', name: 'String' }
    })).toBe('string');
    expect(generateTypeFromTag({
      type: { type: 'NameExpression', name: 'Boolean' }
    })).toBe('boolean');
  });

  test('should handle array types', () => {
    expect(generateTypeFromTag({
      type: {
        type: 'TypeApplication',
        expression: { type: 'NameExpression', name: 'Array' },
        applications: [{ type: 'NameExpression', name: 'Number' }]
      }
    })).toBe('number[]');
  });

  test('should handle union types', () => {
    expect(generateTypeFromTag({
      type: {
        type: 'UnionType',
        elements: [
          { type: 'NameExpression', name: 'Number' },
          { type: 'NameExpression', name: 'String' }
        ]
      }
    })).toBe('number | string');
  });
});

suite('generateParamDeclaration', () => {
  test('should handle required parameters', () => {
    expect(generateParamDeclaration({
      name: 'x',
      type: { type: 'NameExpression', name: 'Number' }
    })).toBe('x: number');
  });

  test('should handle optional parameters', () => {
    expect(generateParamDeclaration({
      name: 'y',
      type: {
        type: 'OptionalType',
        expression: { type: 'NameExpression', name: 'String' }
      }
    })).toBe('y?: string');
  });

  test('should handle parameters with no type', () => {
    expect(generateParamDeclaration({
      name: 'unknown'
    })).toBe('unknown: any');
  });
});

suite('generateFunctionDeclaration', () => {
  test('should handle abs() function data', () => {
    const declaration = generateFunctionDeclaration(absFuncDoc);
    console.log(declaration);
    expect(declaration).toContain('function abs(n: number): number;\n\n');
  });
});

suite('generateClassDeclaration', () => {
  test('should generate correct class declaration for p5.Shader', () => {
    const classDoc = {
      name: 'p5.Shader',
      description: '',
      params: [
        { name: 'renderer', type: { type: 'NameExpression', name: 'p5.RendererGL' } },
        { name: 'vertSrc', type: { type: 'NameExpression', name: 'string' } },
        { name: 'fragSrc', type: { type: 'NameExpression', name: 'string' } },
        {
          name: 'options',
          type: {
            type: 'OptionalType',
            expression: { type: 'NameExpression', name: 'object' }
          }
        }
      ],
      module: 'p5',
      submodule: null,
      extends: null
    };

    const organizedData = {
      classitems: []  // Empty since we're just testing class declaration
    };

    const declaration = generateClassDeclaration(classDoc, organizedData);
    expect(declaration).toContain('class Shader {\n');
    expect(declaration).toContain('constructor(renderer: p5.RendererGL, vertSrc: string, fragSrc: string, options?: object);\n');
  });
});

suite('generateMethodDeclarations', () => {
  test('should generate correct method declaration for copyToContext', () => {
    const item = {
      name: 'copyToContext',
      kind: 'function',
      description: '',
      params: [{
        name: 'context',
        type: {
          type: 'UnionType',
          elements: [
            { type: 'NameExpression', name: 'p5' },
            { type: 'NameExpression', name: 'p5.Graphics', optional: false }
          ]
        }
      }],
      returnType: 'p5.Shader',
      class: 'p5.Shader',
      module: 'p5',
      submodule: null,
      class: 'p5.Shader',
      isStatic: false,
      overloads: undefined
    };

    const declaration = generateMethodDeclarations(item);
    expect(declaration).toContain('copyToContext(context: p5 | p5.Graphics): p5.Shader;\n\n');
  });
});

suite('generateTypeDefinitions', () => {
  test('should generate type definitions from minimal data', () => {
    const result = generateTypeDefinitions([absFuncDoc]);

    const expectedContent = '// This file is auto-generated from JSDoc documentation\n\n' +
      'import p5 from \'p5\';\n\n' +
      'declare module \'p5\' {\n' +
      '/**\n' +
      ' * Calculates the absolute value of a number.A number\'s absolute value is its distance from zero on the number line.\n' +
      ' * -5 and 5 are both five units away from zero, so calling `abs(-5)` and\n' +
      ' * `abs(5)` both return 5. The absolute value of a number is always positive.\n' +
      ' *\n' +
      ' * @param number to compute.\n' +
      ' * @return absolute value of given number.\n' +
      ' * @example <div>\n' +
      ' * <code>\n' +
      ' * function setup() {\n' +
      ' * createCanvas(100, 100);\n' +
      ' *\n' +
      ' * describe(\'A gray square with a vertical black line that divides it in half. A white rectangle gets taller when the user moves the mouse away from the line.\');\n' +
      ' * }\n' +
      ' *\n' +
      ' * function draw() {\n' +
      ' * background(200);\n' +
      ' *\n' +
      ' * // Divide the canvas.\n' +
      ' * line(50, 0, 50, 100);\n' +
      ' *\n' +
      ' * // Calculate the mouse\'s distance from the middle.\n' +
      ' * let h = abs(mouseX - 50);\n' +
      ' *\n' +
      ' * // Draw a rectangle based on the mouse\'s distance\n' +
      ' * // from the middle.\n' +
      ' * rect(0, 100 - h, 100, h);\n' +
      ' * }\n' +
      ' * </code>\n' +
      ' * </div>\n' +
      ' */\n' +
      'function abs(n: number): number;\n\n' +
      '}\n\n';

    const filePath = 'C:\\Users\\diyas\\Documents\\p5.js\\src\\math\\calculation.js';

    // Helper function to normalize whitespace and newlines
    const normalizeString = (str) =>
      str.replace(/\s+/g, ' ')
         .replace(/\n\s*/g, '\n')
         .trim();

    // Compare normalized strings
    expect(
      normalizeString(result.fileTypes.get(filePath))
    ).toEqual(
      normalizeString(expectedContent)
    );

    // Check global type definitions
    expect(result.globalTypes).toEqual(
      '// This file is auto-generated from JSDoc documentation\n\n' +
      'import p5 from \'p5\';\n\n' +
      'declare global {\n' +
      '  /**\n' +
      '   * Calculates the absolute value of a number.A number\'s absolute value is its distance from zero on the number line.\n' +
      '   * -5 and 5 are both five units away from zero, so calling `abs(-5)` and\n' +
      '   * `abs(5)` both return 5. The absolute value of a number is always positive.\n' +
      '   */\n' +
      '  function abs(n: number): number;\n\n' +
      '  interface Window {\n' +
      '    abs: typeof abs;\n' +
      '  }\n' +
      '}\n\n' +
      'export {};\n'
    );

    // Check p5 type definitions
    expect(result.p5Types).toEqual(
      '// This file is auto-generated from JSDoc documentation\n\n' +
      'declare class p5 {\n' +
      '  constructor(sketch?: (p: p5) => void, node?: HTMLElement, sync?: boolean);\n\n' +
      '  /**\n' +
      '   * Calculates the absolute value of a number.A number\'s absolute value is its distance from zero on the number line.\n' +
      '   * -5 and 5 are both five units away from zero, so calling `abs(-5)` and\n' +
      '   * `abs(5)` both return 5. The absolute value of a number is always positive.\n' +
      ' *\n' +
      '   * @param\n' +
      '   */\n' +
      '  abs(n: number): number;\n\n' +
      '}\n\n' +
      'declare namespace p5 {\n' +
      '}\n\n' +
      'export default p5;\n' +
      'export as namespace p5;\n'
    );
  });
});
