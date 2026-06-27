// packages/yut-engine/src/actions.test.ts
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from './index';
import { rollYut, submitAnswer, movePiece } from './actions';

describe('Yut Engine - State Transitions', () => {
  it('should transition from THROW to ANSWER phase when rolling', () => {
    let state = createInitialGameState();
    
    // Perform the roll action
    state = rollYut(state, 'YUT', 'BLUE_NAVY');

    expect(state.phase).toBe('WAITING_FOR_ANSWER');
    expect(state.pendingThrow).toBe('YUT');
    expect(state.activeQuestionTheme).toBe('BLUE_NAVY');
    // The throw shouldn't be added to remainingThrows yet!
    expect(state.remainingThrows).toHaveLength(0); 
  });

  it('should grant the throw and transition to MOVE if answer is correct', () => {
    let state = createInitialGameState();
    state = rollYut(state, 'GAE'); // Roll
    state = submitAnswer(state, true); // Answer Correctly

    expect(state.phase).toBe('WAITING_FOR_MOVE');
    expect(state.pendingThrow).toBeNull();
    expect(state.activeQuestionTheme).toBeNull();
    expect(state.remainingThrows).toEqual(['GAE']); // Throw is now available to use
    expect(state.currentTurn).toBe('BLUE'); // Still Blue's turn
  });

  it('should end the turn if answer is incorrect and no throws remain', () => {
    let state = createInitialGameState();
    state = rollYut(state, 'DO'); // Roll
    state = submitAnswer(state, false); // Answer Incorrectly

    expect(state.currentTurn).toBe('RED'); // Turn passes to Red
    expect(state.phase).toBe('WAITING_FOR_THROW'); // Back to the start of a turn
    expect(state.remainingThrows).toHaveLength(0); // Blue gets nothing
  });
});

describe('Yut Engine - Piece Movement & Capturing', () => {
  it('should move a piece and pass turn when throws are empty', () => {
    let state = createInitialGameState();
    // Blue's turn: Earn a 'GAE'
    state = rollYut(state, 'GAE');
    state = submitAnswer(state, true);
    
    // Move piece b1
    state = movePiece(state, 'b1', 'GAE');

    const b1 = state.pieces.find(p => p.id === 'b1');
    expect(b1?.position).toBe(1); // GAE is 2 steps, index 0 is first step, index 1 is second
    expect(state.remainingThrows).toHaveLength(0);
    expect(state.currentTurn).toBe('RED'); // Turn passed to red
    expect(state.phase).toBe('WAITING_FOR_THROW');
  });

  it('should group allied pieces and move them together', () => {
    let state = createInitialGameState();
    
    // Force two blue pieces onto node 0
    state.pieces.find(p => p.id === 'b1')!.position = 0;
    state.pieces.find(p => p.id === 'b2')!.position = 0;
    
    // Grant a DO throw directly for testing
    state.phase = 'WAITING_FOR_MOVE';
    state.remainingThrows = ['DO'];
    
    state = movePiece(state, 'b1', 'DO');

    // Both pieces should have moved to node 1
    expect(state.pieces.find(p => p.id === 'b1')?.position).toBe(1);
    expect(state.pieces.find(p => p.id === 'b2')?.position).toBe(1);
  });

  it('should capture an enemy piece and grant an extra throw', () => {
    let state = createInitialGameState();
    
    // Blue piece at start, Red piece at node 2
    state.pieces.find(p => p.id === 'b1')!.position = null;
    state.pieces.find(p => p.id === 'r1')!.position = 2; // Node 2 is 3 steps away from start
    
    // Grant a GEOL (3 steps)
    state.phase = 'WAITING_FOR_MOVE';
    state.remainingThrows = ['GEOL'];
    
    state = movePiece(state, 'b1', 'GEOL');

    // Blue piece moved to 2
    expect(state.pieces.find(p => p.id === 'b1')?.position).toBe(2);
    
    // Red piece captured (sent back to null)
    expect(state.pieces.find(p => p.id === 'r1')?.position).toBeNull();
    
    // Blue gets an extra throw, so turn does NOT change!
    expect(state.currentTurn).toBe('BLUE');
    expect(state.phase).toBe('WAITING_FOR_THROW');
  });
});