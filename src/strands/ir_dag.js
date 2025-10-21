import { NodeTypeRequiredFields, NodeTypeToName, BasePriority, StatementType } from './ir_types';
import * as FES from './strands_FES';

/////////////////////////////////
// Public functions for strands runtime
/////////////////////////////////

export function createDirectedAcyclicGraph() {
  const graph = {
    nextID: 0,
    cache: new Map(),
    nodeTypes: [],
    baseTypes: [],
    dimensions: [],
    opCodes: [],
    values: [],
    identifiers: [],
    phiBlocks: [],
    dependsOn: [],
    usedBy: [],
    statementTypes: [],
    swizzles: [],
  };

  return graph;
}

export function getOrCreateNode(graph, node) {
  // const key = getNodeKey(node);
  // const existing = graph.cache.get(key);

  // if (existing !== undefined) {
    // return existing;
  // } else {
    const id = createNode(graph, node);
    // graph.cache.set(key, id);
    return id;
  // }
}

export function createNodeData(data = {}) {
  const node = {
    nodeType: data.nodeType ?? null,
    baseType: data.baseType ?? null,
    dimension: data.dimension ?? null,
    opCode: data.opCode ?? null,
    value: data.value ?? null,
    identifier: data.identifier ?? null,
    statementType: data.statementType ?? null,
    swizzle: data.swizzle ?? null,
    dependsOn: Array.isArray(data.dependsOn) ? data.dependsOn : [],
    usedBy: Array.isArray(data.usedBy) ? data.usedBy : [],
    phiBlocks: Array.isArray(data.phiBlocks) ? data.phiBlocks : [],
  };
  validateNode(node);
  return node;
}

export function getNodeDataFromID(graph, id) {
  return {
    id,
    nodeType: graph.nodeTypes[id],
    opCode: graph.opCodes[id],
    value: graph.values[id],
    identifier: graph.identifiers[id],
    dependsOn: graph.dependsOn[id],
    usedBy: graph.usedBy[id],
    phiBlocks: graph.phiBlocks[id],
    dimension: graph.dimensions[id],
    baseType: graph.baseTypes[id],
    statementType: graph.statementTypes[id],
    swizzle: graph.swizzles[id],
  }
}

export function extractNodeTypeInfo(dag, nodeID) {
  return {
    baseType: dag.baseTypes[nodeID],
    dimension: dag.dimensions[nodeID],
    priority: BasePriority[dag.baseTypes[nodeID]],
  };
}

/////////////////////////////////
// Private functions
/////////////////////////////////
function createNode(graph, node) {
  const id = graph.nextID++;
  graph.nodeTypes[id] = node.nodeType;
  graph.opCodes[id] = node.opCode;
  graph.values[id] = node.value;
  graph.identifiers[id] = node.identifier;
  graph.dependsOn[id] = node.dependsOn.slice();
  graph.usedBy[id] = node.usedBy;
  graph.phiBlocks[id] = node.phiBlocks.slice();
  graph.baseTypes[id] = node.baseType
  graph.dimensions[id] = node.dimension;
  graph.statementTypes[id] = node.statementType;
  graph.swizzles[id] = node.swizzle;

  for (const dep of node.dependsOn) {
    if (!Array.isArray(graph.usedBy[dep])) {
      graph.usedBy[dep] = [];
    }
    graph.usedBy[dep].push(id);
  }
  return id;
}

function getNodeKey(node) {
  const key = JSON.stringify(node);
  return key;
}

function validateNode(node){
  const nodeType = node.nodeType;
  const requiredFields = NodeTypeRequiredFields[nodeType];
  if (requiredFields.length === 2) {
    FES.internalError(`Required fields for node type '${NodeTypeToName[nodeType]}' not defined. Please add them to the utils.js file in p5.strands!`)
  }
  const missingFields = [];
  for (const field of requiredFields) {
    if (node[field] === null) {
      missingFields.push(field);
    }
  }
  if (node.dependsOn?.some(v => v === undefined)) {
    throw new Error('Undefined dependency!');
  }
  if (missingFields.length > 0) {
    FES.internalError(`Missing fields ${missingFields.join(', ')} for a node type '${NodeTypeToName[nodeType]}'.`);
  }
}
