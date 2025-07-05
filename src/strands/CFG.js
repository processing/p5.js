export function createControlFlowGraph() {
  return {
    nextID: 0,
    graphType: 'CFG',
    blockTypes: [],
    incomingEdges: [],
    outgoingEdges: [],
    blockInstructions: [],
  };
}

export function createBasicBlock(graph, blockType) {
  const id = graph.nextID++;
  graph.blockTypes[id] = blockType;
  graph.incomingEdges[id] = [];
  graph.outgoingEdges[id] = [];
  graph.blockInstructions[id]= [];
  return id;
}

export function addEdge(graph, from, to) {
  graph.outgoingEdges[from].push(to);
  graph.incomingEdges[to].push(from);
}

export function recordInBasicBlock(graph, blockID, nodeID) {
  graph.blockInstructions[blockID] = graph.blockInstructions[blockID] || [];
  graph.blockInstructions[blockID].push(nodeID);
}

export function getBlockDataFromID(graph, id) {
  return {
    id,
    blockType: graph.blockTypes[id],
    incomingEdges: graph.incomingEdges[id],
    outgoingEdges: graph.outgoingEdges[id],
    blockInstructions: graph.blockInstructions[id],
  }
}