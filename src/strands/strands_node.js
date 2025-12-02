import { swizzleTrap, primitiveConstructorNode, variableNode } from './ir_builders';
import { BaseType, NodeType, OpCode } from './ir_types';
import { getNodeDataFromID, createNodeData, getOrCreateNode } from './ir_dag';
import { recordInBasicBlock } from './ir_cfg';
export class StrandsNode {
  constructor(id, dimension, strandsContext) {
    this.id = id;
    this.strandsContext = strandsContext;
    this.dimension = dimension;
    this.structProperties = null;

    // Store original identifier for varying variables
    const dag = this.strandsContext.dag;
    const nodeData = getNodeDataFromID(dag, this.id);
    if (nodeData && nodeData.identifier) {
      this._originalIdentifier = nodeData.identifier;
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
}
export function createStrandsNode(id, dimension, strandsContext, onRebind) {
  return new Proxy(
    new StrandsNode(id, dimension, strandsContext),
    swizzleTrap(id, dimension, strandsContext, onRebind)
  );
}
