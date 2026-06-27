// packages/yut-engine/src/movement.ts
import { BOARD_GRAPH } from './board';
import { StickResult, MOVEMENT_VALUES } from './types';

/**
 * Calculates where a piece will land given its starting position and a stick throw.
 */
export function calculateDestination(startPosition: number | null, stick: StickResult): number | 99 | null {
  const steps = MOVEMENT_VALUES[stick];

  // 1. Handling Off-Board Pieces
  if (startPosition === null) {
    if (steps === -1) return null; // Cannot use Back Do if not on the board
    
    // Moving onto the board. DO (1 step) lands on index 0.
    let pos = 0;
    for (let i = 1; i < steps; i++) {
      pos = BOARD_GRAPH[pos].next;
    }
    return pos;
  }

  // 2. Handling Back Do (-1)
  if (steps === -1) {
    // Back Do from the start node goes to the final node before finish
    if (startPosition === 0) return 19; 
    
    // Find the node that points to our current position (Reverse lookup)
    for (const [nodeString, nodeData] of Object.entries(BOARD_GRAPH)) {
      const nodeIndex = Number(nodeString);
      if (nodeData.next === startPosition || nodeData.shortcut === startPosition) {
        return nodeIndex;
      }
    }
    return startPosition; // Fallback in case of error
  }

  // 3. Handling Forward Movement
  let currentPos: number | 99 = startPosition;
  
  // We only take a shortcut if we start our turn exactly on a shortcut node
  const canTakeShortcut = BOARD_GRAPH[currentPos].shortcut !== undefined;

  for (let i = 0; i < steps; i++) {
    if (currentPos === 99) break; // Already finished, stop moving

    // Take the shortcut only on the very first step of the movement
    if (i === 0 && canTakeShortcut) {
      currentPos = BOARD_GRAPH[currentPos].shortcut!;
    } else {
      currentPos = BOARD_GRAPH[currentPos].next;
    }
  }

  return currentPos;
}