import { NodeTypeRequiredFields, NodeTypeName } from './utils'
import * as strandsFES from './strands_FES'

// Properties of the Directed Acyclic Graph and its nodes
const graphProperties = [
  'nodeTypes', 
  'dataTypes', 
  'opCodes', 
  'values', 
  'identifiers',
  // sparse adjancey list for dependencies (indegree)
  'dependsOnStartIndex',
  'dependsOnCount',
  'dependsOnList',
];

const nodeProperties = [
  'nodeType', 
  'dataType', 
  'opCodes', 
  'value', 
  'identifier',
  'dependsOn'
];

// Public functions for for strands runtime
export function createGraph() {
  const graph = {
    _nextID: 0,
    _nodeCache: new Map(),
  }
  for (const prop of graphProperties) {
    graph[prop] = [];
  }
  return graph;
}


export function getOrCreateNode(graph, node) {
  const result = getNode(graph, node);
  if (!result){
    return createNode(graph, node)
  } else {
    return result;
  }
}

export function createNodeData(data = {}) {
  const node = {};
  for (const key of nodeProperties) {
    node[key] = data[key] ?? NaN;
  }
  validateNode(node);
  return node;
}

// Private functions to this file
function getNodeKey(node) {
  
}

function validateNode(node){
  const requiredFields = NodeTypeRequiredFields[node.NodeType];
  const missingFields = [];
  for (const field of requiredFields) {
    if (node[field] === NaN) {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    strandsFES.internalError(`[p5.strands internal error]: Missing fields ${missingFields.join(', ')} for a node type ${NodeTypeName(node.nodeType)}`);
  }
}

function getNode(graph, node) {
  if (graph)
    
  if (!node) {
    return null;
  }
}

function createNode(graph, nodeData) {
  
}