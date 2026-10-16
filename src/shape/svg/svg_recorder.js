// Abstract tree node hierarchy for the SVG Shape Recorder AST.
// As vector commands (shapes, transforms, backgrounds, images) are issued during a sketch's
// recording pass, they are captured into an object graph of NodeBase sub-classes.
// These nodes are later traversed by an SVG visitor to construct vector element trees.
export class NodeBase {
  constructor() {
    this.children = [];
  }
  add(child) {
    this.children.push(child);
  }
}

// Scoping node representing matrix push/pop boundaries and nested transformation groups.
export class ScopeNode extends NodeBase {
  constructor() {
    super();
    this.type = 'scope';
  }

  toSVGElement(visitor) {
    visitor.visitScope(this);
  }
}

export class ShapeNode extends NodeBase {
  constructor(shape, state) {
    super();
    this.type = 'shape';
    this.shape = shape;
    this.state = state;
  }
  toSVGElement(visitor) {
    visitor.currentState = this.state;
    visitor.currentPathElement = null;
    this.shape.accept(visitor);
    visitor.currentPathElement = null;
  }
}

export class BackgroundNode extends NodeBase {
  constructor(color) {
    super();
    this.type = 'background';
    this.color = color;
  }
  toSVGElement(visitor) {
    visitor.addBackground(this);
  }
}

export class ClearNode extends NodeBase {
  constructor() {
    super();
    this.type = 'clear';
  }
  toSVGElement(visitor) {
    visitor.clear();
  }
}

export class ImageNode extends NodeBase {
  constructor(img, args, state) {
    super();
    this.type = 'image';
    this.img = img;
    this.args = args;
    this.state = state;
  }
  toSVGElement(visitor) {
    visitor.currentState = this.state;
    visitor.visitImage(this);
  }
}

// TransformStack maintains an active stack of DOMMatrix transformation state
// for translating, rotating, scaling, and matrix calculations during shape recording.
export class TransformStack {
  constructor() {
    this.stack = [new DOMMatrix()];
  }

  push() {
    this.stack.push(new DOMMatrix(this.current));
  }

  pop() {
    if (this.stack.length > 1) this.stack.pop();
  }

  translate(x, y) {
    this.current.translateSelf(x, y);
  }

  rotate(rad) {
    this.current.rotateSelf(rad * 180 / Math.PI);
  }

  scale(x, y) {
    this.current.scaleSelf(x, y !== undefined ? y : x);
  }

  get current() {
    return this.stack[this.stack.length - 1];
  }
}

// ShapeRecorder intercepts drawing and transformation calls (push, pop, translate, scale, rotate, applyMatrix)
// while active, generating an AST representation of recorded drawing calls.
export class ShapeRecorder {
  constructor(pInst, options = {}) {
    this.p5 = pInst;
    this.active = false;
    this.draw = options.draw ?? false;
    this.root = new ScopeNode();
    this.scopeStack = [this.root];
    this.tStack = new TransformStack();
    this.restores = [];
    this._isTransforming = false;
  }

  start() {
    this.active = true;
    this.root = new ScopeNode();
    this.scopeStack = [this.root];
    this.restores = [];
    this._interceptTransforms();
    const renderer = this.p5._renderer;
    const adapters = this.p5._svgCaptureAdapters();
    if (renderer) {
      for (const name in adapters) {
        const restore = adapters[name].intercept(renderer, this);
        if (restore) {
          this.restores.push(restore);
        }
      }
    }
  }

  stop() {
    this.active = false;
    for (const restore of this.restores) {
      restore();
    }
    this.restores = [];
  }
  addNode(node) {
    this.scopeStack[
      this.scopeStack.length - 1
    ].add(node);
  }
  enterScope() {
    const scope = new ScopeNode();
    this.addNode(scope);
    this.scopeStack.push(scope);
    return scope;
  }

  leaveScope() {
    if (this.scopeStack.length > 1) {
      this.scopeStack.pop();
    }
  }
  _interceptTransforms() {
    const p = this.p5;
    const renderer = p._renderer;

    const transformHandlers = {
      push: () => {
        this.tStack.push();
        this.enterScope();
      },
      pop: () => {
        this.tStack.pop();
        this.leaveScope();
      },
      translate: (args) => {
        this.tStack.translate(args[0] || 0, args[1] || 0);
      },
      rotate: (args) => {
        this.tStack.rotate(args[0] || 0);
      },
      scale: (args) => {
        this.tStack.scale(args[0] || 1, args[1]);
      },
      applyMatrix: (args) => {
        const [a, b, c, d, e, f] = args;
        this.tStack.current.multiplySelf(
          new DOMMatrix([a, b, c, d, e, f])
        );
      }
    };

    Object.keys(transformHandlers).forEach(method => {
      const applyTransform = (origFn, context, args) => {
        if (this._isTransforming) {
          return origFn.apply(context, args);
        }
        this._isTransforming = true;
        try {
          if (this.active) {
            transformHandlers[method](args);
          }
          return origFn.apply(context, args);
        } finally {
          this._isTransforming = false;
        }
      };

      const origP5 = p[method];
      if (typeof origP5 === 'function') {
        p[method] = (...args) => {
          return applyTransform(origP5, p, args);
        };
        this.restores.push(() => {
          p[method] = origP5;
        });
      }

      if (renderer && typeof renderer[method] === 'function') {
        const origR = renderer[method];
        renderer[method] = (...args) => {
          return applyTransform(origR, renderer, args);
        };
        this.restores.push(() => {
          renderer[method] = origR;
        });
      }
    });
  }

  getRecord() {
    return this.root;
  }
}
