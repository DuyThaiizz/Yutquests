// packages/yut-engine/src/index.ts
import { GameState, Piece } from './types';

// NEW: Export all the modules so the web app can import them!
export * from './types';
export * from './actions';
export * from './movement';
export * from './board';

export const INITIAL_BOARD_NODES = 29;

/**
 * Creates a pristine, new game state ready for the first turn.
 */
export function createInitialGameState(): GameState {
  // Create an empty board where each of the 29 nodes is an empty array (no pieces)
  const emptyBoard = Array.from({ length: INITIAL_BOARD_NODES }, () => []);

  const initialPieces: Piece[] = [
    // Blue team pieces
    { id: 'b1', owner: 'BLUE', position: null },
    { id: 'b2', owner: 'BLUE', position: null },
    { id: 'b3', owner: 'BLUE', position: null },
    { id: 'b4', owner: 'BLUE', position: null },
    // Red team pieces
    { id: 'r1', owner: 'RED', position: null },
    { id: 'r2', owner: 'RED', position: null },
    { id: 'r3', owner: 'RED', position: null },
    { id: 'r4', owner: 'RED', position: null },
  ];

  return {
    currentTurn: 'BLUE',
    phase: 'WAITING_FOR_THROW',
    pieces: initialPieces,
    board: emptyBoard,
    remainingThrows: [],
    pendingThrow: null,
    activeQuestionTheme: null,
  };
}