import * as CFG from './ir_cfg';
import * as DAG from './ir_dag';
import {
  BlockType,
  NodeType,
  BaseType,
  StatementType,
  OpCode
} from './ir_types';
import { createStrandsNode } from './strands_node';
import { primitiveConstructorNode } from './ir_builders';
import { createPhiNode } from './strands_phi_utils';
import * as FES from './strands_FES';

export class StrandsFor {
  constructor(
    strandsContext,
    initialCb,
    conditionCb,
    updateCb,
    bodyCb,
    initialVars
  ) {
    this.strandsContext = strandsContext;
    this.initialCb = initialCb;
    this.conditionCb = conditionCb;
    this.updateCb = updateCb;
    this.bodyCb = bodyCb;
    this.initialVars = initialVars;
  }

  build() {
    const cfg = this.strandsContext.cfg;
    const mergeBlock = CFG.createBasicBlock(cfg, BlockType.MERGE);

    // Create a BRANCH block to handle phi node declarations
    const branchBlock = CFG.createBasicBlock(cfg, BlockType.BRANCH);
    this.branchBlock = branchBlock;
    CFG.addEdge(cfg, cfg.currentBlock, branchBlock);
    CFG.addEdge(cfg, branchBlock, mergeBlock);

    // Initialize loop variable phi node
    const { initialVar, phiNode } = this.initializeLoopVariable(
      cfg,
      branchBlock
    );

    // Execute condition and update callbacks to get nodes for analysis
    CFG.pushBlock(cfg, cfg.currentBlock);
    const loopVarNode = createStrandsNode(
      phiNode.id,
      phiNode.dimension,
      this.strandsContext
    );
    const conditionNode = this.runInLoopPhase('header', () =>
      this.conditionCb(loopVarNode)
    );
    const updateResult = this.runInLoopPhase('header', () =>
      this.updateCb(loopVarNode)
    );
    CFG.popBlock(cfg);

    // Check if loop has bounded iteration count
    const isBounded = this.loopIsBounded(
      initialVar,
      conditionNode,
      updateResult
    );

    if (isBounded) {
      this.buildBoundedLoop(
        cfg,
        branchBlock,
        mergeBlock,
        initialVar,
        phiNode,
        conditionNode,
        updateResult
      );
    } else {
      this.buildUnboundedLoop(
        cfg,
        branchBlock,
        mergeBlock,
        initialVar,
        phiNode,
        conditionNode,
        updateResult
      );
    }

    // Update the phi nodes created in buildBoundedLoop with actual body results
    const finalPhiNodes = this.phiNodesForBody;
    CFG.pushBlockForModification(cfg, branchBlock);
    for (const [varName, resultNode] of Object.entries(this.bodyResults)) {
      if (varName !== 'loopVar' && finalPhiNodes[varName]) {
        // Update the phi node's second input to use the actual body result
        const phiNodeID = finalPhiNodes[varName].id;
        const phiNodeData = DAG.getNodeDataFromID(
          this.strandsContext.dag,
          phiNodeID
        );
        // Update the dependsOn array to include the actual body result
        if (phiNodeData.dependsOn.length > 1) {
          phiNodeData.dependsOn[1] = resultNode.id;
        }
        if (phiNodeData.phiInputs && phiNodeData.phiInputs.length > 1) {
          phiNodeData.phiInputs[1].value = resultNode;
        }
      }
    }
    for (const [slot, updatedId] of this.stateUpdatedIds) {
      DAG.getNodeDataFromID(
        this.strandsContext.dag,
        this.statePhis.get(slot).id
      ).dependsOn[1] = updatedId;
    }
    CFG.popBlock(cfg);

    // Create assignment nodes in the branch block for initial values
    CFG.pushBlockForModification(cfg, branchBlock);
    for (const [varName, initialValueNode] of Object.entries(
      this.initialVars
    )) {
      if (varName !== 'loopVar' && finalPhiNodes[varName]) {
        // Create an assignment statement: phiNode = initialValue
        const phiNodeID = finalPhiNodes[varName].id;
        const sourceNodeID = initialValueNode.id;
        // Create an assignment operation node for the initial value
        const assignmentNode = DAG.createNodeData({
          nodeType: NodeType.ASSIGNMENT,
          dependsOn: [phiNodeID, sourceNodeID],
          phiBlocks: []
        });
        const assignmentID = DAG.getOrCreateNode(
          this.strandsContext.dag,
          assignmentNode
        );
        CFG.recordInBasicBlock(cfg, branchBlock, assignmentID);
      }
    }
    // Each helper phi starts from its entry value, so zero iterations keep it.
    for (const [slot, phi] of this.statePhis) {
      const assignmentID = DAG.getOrCreateNode(
        this.strandsContext.dag,
        DAG.createNodeData({
          nodeType: NodeType.ASSIGNMENT,
          dependsOn: [phi.id, this.stateEntryIds.get(slot)],
          phiBlocks: []
        })
      );
      CFG.recordInBasicBlock(cfg, branchBlock, assignmentID);
    }
    CFG.popBlock(cfg);

    // Create assignment nodes in the final block after body execution.
    // Collect all loop-carried updates for user variables and helper states.
    const loopUpdates = [];
    for (const [varName, resultNode] of Object.entries(this.bodyResults)) {
      if (varName !== 'loopVar' && finalPhiNodes[varName]) {
        const phiNode = finalPhiNodes[varName];
        if (phiNode.id !== resultNode.id) {
          loopUpdates.push({
            targetId: phiNode.id,
            sourceId: resultNode.id,
            targetNode: phiNode,
            name: varName
          });
        }
      }
    }
    for (const [slot, updatedId] of this.stateUpdatedIds) {
      const phi = this.statePhis.get(slot);
      if (phi && phi.id !== updatedId) {
        loopUpdates.push({
          targetId: phi.id,
          sourceId: updatedId,
          targetNode: phi,
          name: slot.name || 'helper'
        });
      }
    }

    this.recordLoopStateAssignments(this.finalBodyBlock, loopUpdates);

    // Convert phi nodes to StrandsNodes for the final result
    const finalBodyResults = {};
    for (const [varName, phiNode] of Object.entries(finalPhiNodes)) {
      finalBodyResults[varName] = createStrandsNode(
        phiNode.id,
        phiNode.dimension,
        this.strandsContext
      );
    }

    CFG.pushBlock(cfg, mergeBlock);
    // After the loop, updated helpers read their phi; the rest keep their entry.
    for (const [slot, phi] of this.statePhis) {
      slot.valueId = this.stateUpdatedIds.has(slot)
        ? phi.id
        : this.stateEntryIds.get(slot);
    }

    return finalBodyResults;
  }

  buildBoundedLoop(
    cfg,
    branchBlock,
    mergeBlock,
    initialVar,
    phiNode,
    conditionNode,
    updateResult
  ) {
    // For bounded loops, create FOR block with three statements: init, condition, update
    const forBlock = CFG.createBasicBlock(cfg, BlockType.FOR);
    CFG.addEdge(cfg, branchBlock, forBlock);

    // Now add only the specific nodes we need to the FOR block
    CFG.pushBlock(cfg, forBlock);

    // 1. Init statement - assign initial value to phi node (or empty if no initializer)
    if (initialVar) {
      const initAssignmentNode = DAG.createNodeData({
        nodeType: NodeType.ASSIGNMENT,
        dependsOn: [phiNode.id, initialVar.id],
        phiBlocks: []
      });
      const initAssignmentID = DAG.getOrCreateNode(
        this.strandsContext.dag,
        initAssignmentNode
      );
      CFG.recordInBasicBlock(cfg, forBlock, initAssignmentID);
    }

    // 2. Condition statement - wrap in ExpressionStatement to force generation
    const conditionStatementNode = DAG.createNodeData({
      nodeType: NodeType.STATEMENT,
      statementType: StatementType.EXPRESSION,
      dependsOn: [conditionNode.id],
      phiBlocks: []
    });
    const conditionStatementID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      conditionStatementNode
    );
    CFG.recordInBasicBlock(cfg, forBlock, conditionStatementID);

    // 3. Update statement - create assignment of update result to phi node
    const updateAssignmentNode = DAG.createNodeData({
      nodeType: NodeType.ASSIGNMENT,
      dependsOn: [phiNode.id, updateResult.id],
      phiBlocks: []
    });
    const updateAssignmentID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      updateAssignmentNode
    );
    CFG.recordInBasicBlock(cfg, forBlock, updateAssignmentID);

    CFG.popBlock(cfg);

    // Verify we have the right number of statements (2 or 3 depending on initializer)
    const instructions = cfg.blockInstructions[forBlock] || [];
    const expectedLength = initialVar ? 3 : 2;
    if (instructions.length !== expectedLength) {
      throw new Error(
        `FOR block must have exactly ${expectedLength} statements, got ${instructions.length}`
      );
    }

    const scopeStartBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_START);
    CFG.addEdge(cfg, forBlock, scopeStartBlock);

    const bodyBlock = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    this.bodyBlock = bodyBlock;
    CFG.addEdge(cfg, scopeStartBlock, bodyBlock);

    this.executeBodyCallback(cfg, branchBlock, bodyBlock, phiNode);

    const scopeEndBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_END);
    CFG.addEdge(cfg, bodyBlock, scopeEndBlock);
    CFG.addEdge(cfg, scopeEndBlock, mergeBlock);
  }

  buildUnboundedLoop(
    cfg,
    branchBlock,
    mergeBlock,
    initialVar,
    phiNode,
    conditionNode,
    updateResult
  ) {
    // For unbounded loops, create FOR block with infinite loop and break condition
    const forBlock = CFG.createBasicBlock(cfg, BlockType.FOR);
    CFG.addEdge(cfg, branchBlock, forBlock);

    // Create FOR block with three empty statements for for(;;) syntax
    CFG.pushBlock(cfg, forBlock);

    // 1. Init statement - initialize loop variable or empty
    if (initialVar) {
      const initAssignmentNode = DAG.createNodeData({
        nodeType: NodeType.ASSIGNMENT,
        dependsOn: [phiNode.id, initialVar.id],
        phiBlocks: []
      });
      const initAssignmentID = DAG.getOrCreateNode(
        this.strandsContext.dag,
        initAssignmentNode
      );
      CFG.recordInBasicBlock(cfg, forBlock, initAssignmentID);
    } else {
      // Create empty statement for init
      const emptyInitNode = DAG.createNodeData({
        nodeType: NodeType.STATEMENT,
        statementType: StatementType.EMPTY,
        dependsOn: [],
        phiBlocks: []
      });
      const emptyInitID = DAG.getOrCreateNode(
        this.strandsContext.dag,
        emptyInitNode
      );
      CFG.recordInBasicBlock(cfg, forBlock, emptyInitID);
    }

    // 2. Condition statement - empty for infinite loop
    const emptyConditionNode = DAG.createNodeData({
      nodeType: NodeType.STATEMENT,
      statementType: StatementType.EMPTY,
      dependsOn: [],
      phiBlocks: []
    });
    const emptyConditionID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      emptyConditionNode
    );
    CFG.recordInBasicBlock(cfg, forBlock, emptyConditionID);

    // 3. Update statement - empty for infinite loop
    const emptyUpdateNode = DAG.createNodeData({
      nodeType: NodeType.STATEMENT,
      statementType: StatementType.EMPTY,
      dependsOn: [],
      phiBlocks: []
    });
    const emptyUpdateID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      emptyUpdateNode
    );
    CFG.recordInBasicBlock(cfg, forBlock, emptyUpdateID);

    CFG.popBlock(cfg);

    const scopeStartBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_START);
    CFG.addEdge(cfg, forBlock, scopeStartBlock);

    // Add break condition check right after scope start
    const breakCheckBlock = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    CFG.addEdge(cfg, scopeStartBlock, breakCheckBlock);

    CFG.pushBlock(cfg, breakCheckBlock);

    // Generate break statement: if (!condition) break;
    // First, create the logical NOT of the condition: !condition
    const condition = conditionNode;
    const negatedCondition = this.createLogicalNotNode(condition);

    // Create a conditional break using the existing conditional structure
    // We'll create an IF_COND block that leads to a break statement
    const breakConditionBlock = CFG.createBasicBlock(cfg, BlockType.IF_COND);
    CFG.addEdge(cfg, breakCheckBlock, breakConditionBlock);
    cfg.blockConditions[breakConditionBlock] = negatedCondition.id;

    // Add scope start block for break statement
    const breakScopeStartBlock = CFG.createBasicBlock(
      cfg,
      BlockType.SCOPE_START
    );
    CFG.addEdge(cfg, breakConditionBlock, breakScopeStartBlock);

    const breakStatementBlock = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    CFG.addEdge(cfg, breakScopeStartBlock, breakStatementBlock);

    // Create the break statement in the break statement block
    CFG.pushBlock(cfg, breakStatementBlock);
    const breakStatementNode = DAG.createNodeData({
      nodeType: NodeType.STATEMENT,
      statementType: StatementType.BREAK,
      dependsOn: [],
      phiBlocks: []
    });
    const breakStatementID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      breakStatementNode
    );
    CFG.recordInBasicBlock(cfg, breakStatementBlock, breakStatementID);
    CFG.popBlock(cfg);

    // Add scope end block for break statement
    const breakScopeEndBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_END);
    CFG.addEdge(cfg, breakStatementBlock, breakScopeEndBlock);

    // The break scope end block leads to the merge block (exits the loop)
    CFG.addEdge(cfg, breakScopeEndBlock, mergeBlock);

    CFG.popBlock(cfg);

    const bodyBlock = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    this.bodyBlock = bodyBlock;
    CFG.addEdge(cfg, breakCheckBlock, bodyBlock);

    this.executeBodyCallback(cfg, branchBlock, bodyBlock, phiNode);

    const updateBlock = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    CFG.addEdge(cfg, bodyBlock, updateBlock);

    // Update the loop variable in the update block (like bounded loops)
    CFG.pushBlock(cfg, updateBlock);
    const updateAssignmentNode = DAG.createNodeData({
      nodeType: NodeType.ASSIGNMENT,
      dependsOn: [phiNode.id, updateResult.id],
      phiBlocks: []
    });
    const updateAssignmentID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      updateAssignmentNode
    );
    CFG.recordInBasicBlock(cfg, updateBlock, updateAssignmentID);
    CFG.popBlock(cfg);

    const scopeEndBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_END);
    CFG.addEdge(cfg, updateBlock, scopeEndBlock);

    // Connect end of for loop to the merge agter the loop
    CFG.addEdge(cfg, scopeEndBlock, mergeBlock);

    // Break condition exits to merge
    CFG.addEdge(cfg, breakCheckBlock, mergeBlock);
  }

  initializeLoopVariable(cfg, branchBlock) {
    CFG.pushBlock(cfg, branchBlock);
    let initialVar = this.runInLoopPhase('header', () => this.initialCb());

    // Convert to StrandsNode if it's not already one
    if (!initialVar?.isStrandsNode) {
      const { id, dimension } = primitiveConstructorNode(
        this.strandsContext,
        { baseType: BaseType.FLOAT, dimension: 1 },
        initialVar
      );
      initialVar = createStrandsNode(id, dimension, this.strandsContext);
    }

    // Create phi node for the loop variable in the BRANCH block
    const phiNode = createPhiNode(
      this.strandsContext,
      [
        { value: initialVar, blockId: branchBlock },
        { value: initialVar, blockId: branchBlock } // Placeholder, will be updated later
      ],
      'loopVar'
    );
    CFG.popBlock(cfg);

    return { initialVar, phiNode };
  }

  // Restore the loop phase after the callback, including on failure.
  runInLoopPhase(phase, callback) {
    const previousPhase = this.strandsContext.loopPhase;
    this.strandsContext.loopPhase = phase;
    try {
      return callback();
    } finally {
      this.strandsContext.loopPhase = previousPhase;
    }
  }

  createLogicalNotNode(conditionNode) {
    const notOperationNode = DAG.createNodeData({
      nodeType: NodeType.OPERATION,
      opCode: OpCode.Unary.LOGICAL_NOT,
      baseType: BaseType.BOOL,
      dimension: 1,
      dependsOn: [conditionNode.id],
      phiBlocks: [],
      usedBy: []
    });
    const notOperationID = DAG.getOrCreateNode(
      this.strandsContext.dag,
      notOperationNode
    );
    return createStrandsNode(notOperationID, 1, this.strandsContext);
  }

  executeBodyCallback(cfg, branchBlock, bodyBlock, phiNode) {
    CFG.pushBlock(cfg, bodyBlock);

    // Create phi node references to pass to the body callback
    const phiVars = {};
    const phiNodesForBody = {};
    CFG.pushBlockForModification(cfg, branchBlock);
    for (const [varName, initialValueNode] of Object.entries(
      this.initialVars
    )) {
      if (varName !== 'loopVar') {
        // Create phi node that will be used for the final result
        const varPhiNode = createPhiNode(
          this.strandsContext,
          [
            { value: initialValueNode, blockId: branchBlock }, // Initial value
            { value: initialValueNode, blockId: bodyBlock } // Placeholder - will update after body execution
          ],
          varName
        );
        phiNodesForBody[varName] = varPhiNode;
        phiVars[varName] = createStrandsNode(
          varPhiNode.id,
          varPhiNode.dimension,
          this.strandsContext
        );
      }
    }
    // Keep helper loop phis separate from user variables.
    const stateScope = this.strandsContext.stateScope;
    this.stateEntryIds = new Map();
    this.statePhis = new Map();
    for (const record of stateScope?.records ?? []) {
      for (const slot of record.slots) {
        const entryNode = createStrandsNode(
          slot.valueId,
          slot.dimension,
          this.strandsContext
        );
        this.stateEntryIds.set(slot, slot.valueId);
        this.statePhis.set(
          slot,
          createPhiNode(
            this.strandsContext,
            [
              { value: entryNode, blockId: branchBlock },
              { value: entryNode, blockId: bodyBlock } // Placeholder, set after the body
            ],
            slot.name
          )
        );
      }
    }
    CFG.popBlock(cfg);

    const loopVarNode = createStrandsNode(
      phiNode.id,
      phiNode.dimension,
      this.strandsContext
    );
    // Read helper fields through their loop phis and limit pops to this body.
    for (const [slot, phi] of this.statePhis) {
      slot.valueId = phi.id;
    }
    const stackDepth = stateScope?.stack.length ?? 0;
    const previousFloor = stateScope?.stackFloor;
    if (stateScope) {
      stateScope.stackFloor = stackDepth;
    }
    this.phiNodesForBody = phiNodesForBody;
    const previousLoop = this.strandsContext.activeLoop;
    this.strandsContext.activeLoop = this;
    try {
      this.bodyResults =
        this.runInLoopPhase('body', () => this.bodyCb(loopVarNode, phiVars)) ||
        {};
    } finally {
      this.strandsContext.activeLoop = previousLoop;
      if (stateScope) {
        stateScope.stackFloor = previousFloor;
      }
    }
    if (stateScope && stateScope.stack.length !== stackDepth) {
      FES.userError(
        'scope error',
        'push() and pop() must be balanced inside a for loop body.'
      );
    }
    this.stateUpdatedIds = new Map();
    for (const [slot, phi] of this.statePhis) {
      if (slot.valueId !== phi.id) {
        this.stateUpdatedIds.set(slot, slot.valueId);
      }
    }
    for (const key in this.bodyResults) {
      this.bodyResults[key] = this.strandsContext.p5.strandsNode(
        this.bodyResults[key]
      );
    }
    // Capture the final block after body execution before popping
    this.finalBodyBlock = cfg.currentBlock;
    CFG.popBlock(cfg);
  }

  // Called by break, which skips the end-of-body writes.
  commitCarriedValues(values) {
    const updates = [];
    for (const [varName, value] of Object.entries(values)) {
      const phiNode = this.phiNodesForBody?.[varName];
      if (!phiNode) continue;
      const sourceId = this.strandsContext.p5.strandsNode(value).id;
      if (phiNode.id !== sourceId) {
        updates.push({
          targetId: phiNode.id,
          sourceId,
          targetNode: phiNode,
          name: varName
        });
      }
    }
    this.recordLoopStateAssignments(
      this.strandsContext.cfg.currentBlock,
      updates
    );
  }

  recordLoopStateAssignments(targetBlock, updates) {
    if (updates.length === 0) return;

    const cfg = this.strandsContext.cfg;
    const dag = this.strandsContext.dag;

    // Check if any update reads a target phi variable written by another update.
    // If so, the updates must be buffered through temporary variables so earlier
    // assignments do not overwrite values read later in the same iteration.
    const targetIds = new Set(updates.map(u => u.targetId));
    let hasInterDependency = false;
    for (const update of updates) {
      for (const otherTargetId of targetIds) {
        if (otherTargetId !== update.targetId) {
          if (nodeDependsOnTarget(dag, update.sourceId, otherTargetId)) {
            hasInterDependency = true;
            break;
          }
        }
      }
      if (hasInterDependency) break;
    }

    if (hasInterDependency && this.branchBlock !== undefined) {
      // Allocate temporary phi variables in the branch block to buffer the new values
      CFG.pushBlockForModification(cfg, this.branchBlock);
      const tempPhis = new Map();
      for (const update of updates) {
        const dim =
          update.targetNode.dimension ??
          DAG.getNodeDataFromID(dag, update.targetId).dimension;
        const tempPhi = createPhiNode(
          this.strandsContext,
          [
            {
              value: createStrandsNode(
                update.targetId,
                dim,
                this.strandsContext
              ),
              blockId: this.branchBlock
            }
          ],
          `temp_${update.name}`
        );
        tempPhis.set(update, tempPhi);
      }
      CFG.popBlock(cfg);

      CFG.pushBlockForModification(cfg, targetBlock);
      // Phase 1: evaluate and store the new values into the temporary variables
      for (const update of updates) {
        const tempPhi = tempPhis.get(update);
        const assignmentID = DAG.getOrCreateNode(
          dag,
          DAG.createNodeData({
            nodeType: NodeType.ASSIGNMENT,
            dependsOn: [tempPhi.id, update.sourceId],
            phiBlocks: []
          })
        );
        CFG.recordInBasicBlock(cfg, targetBlock, assignmentID);
      }
      // Phase 2: assign the buffered values from temporaries into the target phi nodes
      for (const update of updates) {
        const tempPhi = tempPhis.get(update);
        const assignmentID = DAG.getOrCreateNode(
          dag,
          DAG.createNodeData({
            nodeType: NodeType.ASSIGNMENT,
            dependsOn: [update.targetId, tempPhi.id],
            phiBlocks: []
          })
        );
        CFG.recordInBasicBlock(cfg, targetBlock, assignmentID);
      }
      CFG.popBlock(cfg);
    } else {
      // No inter-dependencies; assign directly to target phi nodes
      CFG.pushBlockForModification(cfg, targetBlock);
      for (const update of updates) {
        const assignmentID = DAG.getOrCreateNode(
          dag,
          DAG.createNodeData({
            nodeType: NodeType.ASSIGNMENT,
            dependsOn: [update.targetId, update.sourceId],
            phiBlocks: []
          })
        );
        CFG.recordInBasicBlock(cfg, targetBlock, assignmentID);
      }
      CFG.popBlock(cfg);
    }
  }

  loopIsBounded(initialVar, conditionNode, updateVar) {
    // A loop is considered "bounded" if we can determine at compile time that it will
    // execute a known number of iterations. This happens when:
    // 1. The condition compares the loop variable against a compile-time constant
    // 2. At least one side of the comparison uses only literals (no variables/uniforms)

    if (!conditionNode) return false;

    // Analyze the condition node - it should be a comparison operation
    const conditionData = DAG.getNodeDataFromID(
      this.strandsContext.dag,
      conditionNode.id
    );

    if (conditionData.nodeType !== NodeType.OPERATION) {
      return false;
    }

    // For a comparison like "i < bound", we need at least one side to use only literals
    // The condition should have two dependencies: left and right operands
    if (!conditionData.dependsOn || conditionData.dependsOn.length !== 2) {
      return false;
    }

    // Check if either operand uses only literals
    const leftOperand = createStrandsNode(
      conditionData.dependsOn[0],
      1,
      this.strandsContext
    );
    const rightOperand = createStrandsNode(
      conditionData.dependsOn[1],
      1,
      this.strandsContext
    );

    const leftUsesOnlyLiterals = this.nodeUsesOnlyLiterals(leftOperand);
    const rightUsesOnlyLiterals = this.nodeUsesOnlyLiterals(rightOperand);

    // At least one side should use only literals for the loop to be bounded
    return leftUsesOnlyLiterals || rightUsesOnlyLiterals;
  }

  nodeUsesOnlyLiterals(node) {
    // Recursively check if a node and all its dependencies use only literals
    const nodeData = DAG.getNodeDataFromID(this.strandsContext.dag, node.id);

    switch (nodeData.nodeType) {
      case NodeType.LITERAL:
        return true;

      case NodeType.VARIABLE:
        // Variables (like uniforms) make this branch unbounded
        return false;

      case NodeType.PHI:
        // Phi nodes (like loop variables) are not literals
        return false;

      case NodeType.OPERATION:
        // For operations, all dependencies must use only literals
        if (nodeData.dependsOn) {
          for (const depId of nodeData.dependsOn) {
            const depNode = createStrandsNode(depId, 1, this.strandsContext);
            if (!this.nodeUsesOnlyLiterals(depNode)) {
              return false;
            }
          }
        }
        return true;

      default:
        // Conservative: if we don't know the node type, assume not literal
        return false;
    }
  }
}

function nodeDependsOnTarget(dag, startId, targetId, visited = new Set()) {
  if (startId === targetId) {
    return true;
  }
  if (visited.has(startId)) {
    return false;
  }
  visited.add(startId);
  const deps = dag.dependsOn[startId];
  if (deps) {
    for (let i = 0; i < deps.length; i++) {
      if (nodeDependsOnTarget(dag, deps[i], targetId, visited)) {
        return true;
      }
    }
  }
  return false;
}
