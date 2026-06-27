// packages/yut-engine/src/index.test.ts
import { describe, it, expect } from 'vitest';
import { createInitialGameState, INITIAL_BOARD_NODES } from './index';

describe('Yut Engine - Initialization', () => {
  it('should create a valid starting game state', () => {
    const state = createInitialGameState();

    // Check turns, throws, and NEW phases
    expect(state.currentTurn).toBe('BLUE');
    expect(state.phase).toBe('WAITING_FOR_THROW'); // Verify starting phase
    expect(state.remainingThrows).toHaveLength(0);
    expect(state.pendingThrow).toBeNull();
    expect(state.activeQuestionTheme).toBeNull();

    // Check the board sizing
    expect(state.board).toHaveLength(INITIAL_BOARD_NODES);
    state.board.forEach(node => expect(node).toEqual([]));

    // Check the pieces
    expect(state.pieces).toHaveLength(8);
    state.pieces.forEach(piece => expect(piece.position).toBeNull());
  });
});