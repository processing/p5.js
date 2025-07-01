import { NodeTypeRequiredFields, NodeType, NodeTypeToName } from './utils'
import * as FES from './strands_FES'

// Properties of the Directed Acyclic Graph and its nodes
const graphProperties = [
  'nodeTypes', 
  'dataTypes', 
  'opCodes', 
  'values', 
  'identifiers',
  // sparse adjancey list for dependencies (indegree)
  'dependsOnStart',
  'dependsOnCount',
  'dependsOnList',
  // sparse adjacency list for phi inputs
  'phiBlocksStart',
  'phiBlocksCount',
  'phiBlocksList'
];

const nodeProperties = [
  'nodeType', 
  'dataType', 
  'opCode', 
  'value', 
  'identifier',
  'dependsOn',
];

// Public functions for for strands runtime
export function createDirectedAcyclicGraph() {
  const graph = {
    nextID: 0,
    cache: new Map(),
  }
  for (const prop of graphProperties) {
    graph[prop] = [];
  }
  return graph;
}

export function getOrCreateNode(graph, node) {
  const key = getNodeKey(node);
  const existing = graph.cache.get(key);

  if (existing !== undefined) {
    return existing; 
  } else {
    const id = createNode(graph, node);
    graph.cache.set(key, id);
    return id;
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

/////////////////////////////////
// Private functions
/////////////////////////////////

function getNodeKey(node) {
  const key = JSON.stringify(node);
  return key;
}

function validateNode(node){
  const requiredFields = NodeTypeRequiredFields[node.nodeType];
  const missingFields = [];
  for (const field of requiredFields) {
    if (node[field] === NaN) {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    FES.internalError(`[p5.strands internal error]: Missing fields ${missingFields.join(', ')} for a node type ${NodeTypeToName(node.nodeType)}`);
  }
}

function createNode(graph, node) {
  const id = graph.nextID++;

  for (const prop of nodeProperties) {
    if (prop === 'dependsOn' || 'phiBlocks') {
      continue;
    }

    const plural = prop + 's';
    graph[plural][id] = node[prop];
  }

  const depends = Array.isArray(node.dependsOn) ? node.dependsOn : [];
  graph.dependsOnStart[id] = graph.dependsOnList.length;
  graph.dependsOnCount[id] = depends.length;
  graph.dependsOnList.push(...depends);

  const phis = Array.isArray(node.phiBlocks) ? node.phiBlocks : [];
  graph.phiBlocksStart[id] = graph.phiBlocksList.length;
  graph.phiBlocksCount[id] = phis.length;
  graph.phiBlocksList.push(...phis);

  return id;
}