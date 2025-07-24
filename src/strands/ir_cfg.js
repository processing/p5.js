import { BlockTypeToName } from "./ir_types";

export function createControlFlowGraph() {
  return {
    // graph structure
    blockTypes: [],
    incomingEdges: [],
    outgoingEdges: [],
    blockInstructions: [],
    // runtime data for constructing graph
    nextID: 0,
    blockStack: [],
    blockConditions: {},
    currentBlock: -1,
  };
}

export function pushBlock(graph, blockID) {
  graph.blockStack.push(blockID);
  graph.currentBlock = blockID;
}

export function popBlock(graph) {
  graph.blockStack.pop();
  const len = graph.blockStack.length;
  graph.currentBlock = graph.blockStack[len-1];
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

export function printBlockData(graph, id) {
  const block = getBlockDataFromID(graph, id);
  block.blockType = BlockTypeToName[block.blockType];
  console.log(block);
}

export function sortCFG(adjacencyList, start) {
  const visited = new Set();
  const postOrder = [];

  function dfs(v) {
    if (visited.has(v)) {
      return;
    }
    visited.add(v);
    for (let w of adjacencyList[v].sort((a, b) => b-a) || []) {
      dfs(w);
    }
    postOrder.push(v);
  }
  
  dfs(start);
  return postOrder.reverse();
}