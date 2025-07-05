import { NodeTypeRequiredFields, NodeTypeToName } from './utils'
import * as FES from './strands_FES'

/////////////////////////////////
// Public functions for for strands runtime
/////////////////////////////////

export function createDirectedAcyclicGraph() {
  const graph = { 
    nextID: 0, 
    cache: new Map(),
    nodeTypes: [],
    dataTypes: [],
    opCodes: [],
    values: [],
    identifiers: [],
    phiBlocks: [],
    dependsOn: [],
    usedBy: [],
    graphType: 'DAG',
  };
  
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
  const node = {
    nodeType:   data.nodeType   ?? null,
    dataType:   data.dataType   ?? null,
    opCode:     data.opCode     ?? null,
    value:      data.value      ?? null,
    identifier: data.identifier ?? null,
    dependsOn:  Array.isArray(data.dependsOn) ? data.dependsOn : [],
    usedBy: Array.isArray(data.usedBy) ? data.usedBy : [],
    phiBlocks:  Array.isArray(data.phiBlocks) ? data.phiBlocks : []
  };
  validateNode(node);
  return node;
}

export function getNodeDataFromID(graph, id) {
  return {
    nodeType:   graph.nodeTypes[id],
    dataType:   graph.dataTypes[id],
    opCode:     graph.opCodes[id],
    value:      graph.values[id],
    identifier: graph.identifiers[id],
    dependsOn:  graph.dependsOn[id],
    usedBy:     graph.usedBy[id],
    phiBlocks:  graph.phiBlocks[id],
  }
}

/////////////////////////////////
// Private functions
/////////////////////////////////
function createNode(graph, node) {
  const id = graph.nextID++;
  graph.nodeTypes[id]   = node.nodeType;
  graph.dataTypes[id]   = node.dataType;
  graph.opCodes[id]     = node.opCode;
  graph.values[id]      = node.value;
  graph.identifiers[id] = node.identifier;
  graph.dependsOn[id]   = node.dependsOn.slice();
  graph.usedBy[id]      = node.usedBy;
  graph.phiBlocks[id]   = node.phiBlocks.slice();
  for (const dep of node.dependsOn) {
    graph.usedBy[dep].push(id);
  }
  return id;
}

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