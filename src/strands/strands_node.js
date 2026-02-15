import { swizzleTrap, primitiveConstructorNode, variableNode, arrayAccessNode, arrayAssignmentNode } from './ir_builders';
import { BaseType, NodeType, OpCode } from './ir_types';
import { getNodeDataFromID, createNodeData, getOrCreateNode } from './ir_dag';
import { recordInBasicBlock } from './ir_cfg';
export class StrandsNode {
  constructor(id, dimension, strandsContext) {
    this.id = id;
    this.strandsContext = strandsContext;
    this.dimension = dimension;
    this.structProperties = null;
    this.isStrandsNode = true;

    // Store original identifier for varying variables
    const dag = this.strandsContext.dag;
    const nodeData = getNodeDataFromID(dag, this.id);
    if (nodeData && nodeData.identifier) {
      this._originalIdentifier = nodeData.identifier;
    }
    if (nodeData) {
      this._originalBaseType = nodeData.baseType;
      this._originalDimension = nodeData.dimension;
    }
  }
  withStructProperties(properties) {
    this.structProperties = properties;
    return this;
  }
  copy() {
    return createStrandsNode(this.id, this.dimension, this.strandsContext);
  }
  typeInfo() {
    return {
      baseType: this._originalBaseType || BaseType.FLOAT,
      dimension: this.dimension
    };
  }
  bridge(value) {
    const { dag, cfg } = this.strandsContext;
    const orig = getNodeDataFromID(dag, this.id);
    const baseType = orig?.baseType ?? BaseType.FLOAT;

    let newValueID;
    if (value instanceof StrandsNode) {
      newValueID = value.id;
    } else {
      const newVal = primitiveConstructorNode(
        this.strandsContext,
        { baseType, dimension: this.dimension },
        value
      );
      newValueID = newVal.id;
    }

    // For varying variables, we need both assignment generation AND a way to reference by identifier
    if (this._originalIdentifier) {
      // Create a variable node for the target (the varying variable)
      const { id: targetVarID } = variableNode(
        this.strandsContext,
        { baseType: this._originalBaseType, dimension: this._originalDimension },
        this._originalIdentifier
      );

      // Create assignment node for GLSL generation
      const assignmentNode = createNodeData({
        nodeType: NodeType.ASSIGNMENT,
        dependsOn: [targetVarID, newValueID],
        phiBlocks: []
      });
      const assignmentID = getOrCreateNode(dag, assignmentNode);
      recordInBasicBlock(cfg, cfg.currentBlock, assignmentID);

      // Track for global assignments processing
      this.strandsContext.globalAssignments.push(assignmentID);

      // Simply update this node to be a variable node with the identifier
      // This ensures it always generates the variable name in expressions
      const variableNodeData = createNodeData({
        nodeType: NodeType.VARIABLE,
        baseType: this._originalBaseType,
        dimension: this._originalDimension,
        identifier: this._originalIdentifier
      });
      const variableID = getOrCreateNode(dag, variableNodeData);

      this.id = variableID; // Point to the variable node for expression generation
    } else {
      this.id = newValueID; // For non-varying variables, just update to new value
    }

    return this;
  }
  bridgeSwizzle(swizzlePattern, value) {
    const { dag, cfg } = this.strandsContext;
    const orig = getNodeDataFromID(dag, this.id);
    const baseType = orig?.baseType ?? BaseType.FLOAT;

    let newValueID;
    if (value instanceof StrandsNode) {
      newValueID = value.id;
    } else {
      const newVal = primitiveConstructorNode(
        this.strandsContext,
        { baseType, dimension: this.dimension },
        value
      );
      newValueID = newVal.id;
    }

    // For varying variables, create swizzle assignment
    if (this._originalIdentifier) {
      // Create a variable node for the target with swizzle
      const { id: targetVarID } = variableNode(
        this.strandsContext,
        { baseType: this._originalBaseType, dimension: this._originalDimension },
        this._originalIdentifier
      );

      // Create a swizzle node for the target (myVarying.xyz)
      const swizzleNode = createNodeData({
        nodeType: NodeType.OPERATION,
        opCode: OpCode.Unary.SWIZZLE,
        baseType: this._originalBaseType,
        dimension: swizzlePattern.length, // xyz = 3, xy = 2, etc.
        swizzle: swizzlePattern,
        dependsOn: [targetVarID]
      });
      const swizzleID = getOrCreateNode(dag, swizzleNode);

      // Create assignment node: myVarying.xyz = value
      const assignmentNode = createNodeData({
        nodeType: NodeType.ASSIGNMENT,
        dependsOn: [swizzleID, newValueID],
        phiBlocks: []
      });
      const assignmentID = getOrCreateNode(dag, assignmentNode);
      recordInBasicBlock(cfg, cfg.currentBlock, assignmentID);

      // Track for global assignments processing in the current hook context
      this.strandsContext.globalAssignments.push(assignmentID);

      // Simply update this node to be a variable node with the identifier
      // This ensures it always generates the variable name in expressions
      const variableNodeData = createNodeData({
        nodeType: NodeType.VARIABLE,
        baseType: this._originalBaseType,
        dimension: this._originalDimension,
        identifier: this._originalIdentifier
      });
      const variableID = getOrCreateNode(dag, variableNodeData);

      this.id = variableID; // Point to the variable node, not the assignment node
    } else {
      this.id = newValueID; // For non-varying variables, just update to new value
    }

    return this;
  }
  getValue() {
    if (this._originalIdentifier) {
      const { id, dimension } = variableNode(
        this.strandsContext,
        { baseType: this._originalBaseType, dimension: this._originalDimension },
        this._originalIdentifier
      );
      return createStrandsNode(id, dimension, this.strandsContext);
    }

    return this;
  }

  get(index) {
    // Validate baseType is 'storage'
    const nodeData = getNodeDataFromID(this.strandsContext.dag, this.id);
    if (nodeData.baseType !== 'storage') {
      throw new Error('get() can only be used on storage buffers');
    }

    // Create array access node: buffer.get(index) -> buffer[index]
    const { id, dimension } = arrayAccessNode(
      this.strandsContext,
      this,
      index,
      'read'
    );
    return createStrandsNode(id, dimension, this.strandsContext);
  }

  set(index, value) {
    // Validate baseType is 'storage' and has _originalIdentifier
    const nodeData = getNodeDataFromID(this.strandsContext.dag, this.id);
    if (nodeData.baseType !== 'storage') {
      throw new Error('set() can only be used on storage buffers');
    }
    if (!this._originalIdentifier) {
      throw new Error('set() can only be used on storage buffers with an identifier');
    }

    // Create array assignment node: buffer.set(index, value) -> buffer[index] = value
    // This creates an ASSIGNMENT node and records it in the CFG basic block
    // CFG preserves sequential order, preventing reordering of assignments
    arrayAssignmentNode(this.strandsContext, this, index, value);

    // Return this for chaining
    return this;
  }
}
export function createStrandsNode(id, dimension, strandsContext, onRebind) {
  return new Proxy(
    new StrandsNode(id, dimension, strandsContext),
    swizzleTrap(id, dimension, strandsContext, onRebind)
  );
}
