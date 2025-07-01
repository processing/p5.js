export function createControlFlowGraph() {
  const graph = {
    nextID: 0,
    blockTypes: [],
    incomingEdges:[],
    incomingEdgesIndex: [],
    incomingEdgesCount: [],
    outgoingEdges: [],
    outgoingEdgesIndex: [],
    outgoingEdgesCount: [],
    blockInstructionsStart: [],
    blockInstructionsCount: [],
    blockInstructionsList: [],
  };
  
  return graph;
}

export function createBasicBlock(graph, blockType) {
  const i = graph.nextID++;
  graph.blockTypes.push(blockType),
  graph.incomingEdges.push(graph.incomingEdges.length);
  graph.incomingEdgesCount.push(0);
  graph.outgoingEdges.push(graph.outgoingEdges.length);
  graph.outgoingEdges.push(0);
  return i;
}


export function addEdge(graph, from, to) {
  graph.incomingEdges.push(from);
  graph.outgoingEdges.push(to);
  graph.outgoingEdgesCount[from]++;
  graph.incomingEdgesCount[to]++;
}