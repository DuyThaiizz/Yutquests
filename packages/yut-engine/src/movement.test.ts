// packages/yut-engine/src/movement.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDestination } from './movement';

describe('Yut Engine - Movement Math', () => {
  it('should move onto the board correctly from null', () => {
    expect(calculateDestination(null, 'DO')).toBe(0);
    expect(calculateDestination(null, 'YUT')).toBe(3);
  });

  it('should not allow BACK_DO from off the board', () => {
    expect(calculateDestination(null, 'BACK_DO')).toBeNull();
  });

  it('should follow standard forward movement', () => {
    expect(calculateDestination(0, 'GAE')).toBe(2);
    expect(calculateDestination(14, 'GEOL')).toBe(17);
  });

  it('should take a shortcut if starting on a corner node', () => {
    // Node 4 is Top-Right corner. Moving DO (1) should take the shortcut to 20
    expect(calculateDestination(4, 'DO')).toBe(20);
    // Node 9 is Top-Left corner. Moving GAE (2) should go to 25 -> 26
    expect(calculateDestination(9, 'GAE')).toBe(26);
  });

  it('should ignore shortcuts if just passing through', () => {
    // Starting at 3, moving GAE (2). Passes 4, lands on 5. Does NOT go to 20.
    expect(calculateDestination(3, 'GAE')).toBe(5);
  });

  it('should handle BACK_DO correctly', () => {
    expect(calculateDestination(2, 'BACK_DO')).toBe(1);
    expect(calculateDestination(20, 'BACK_DO')).toBe(4); // Backs out of the shortcut
    expect(calculateDestination(0, 'BACK_DO')).toBe(19); // Backs up to the end of the board
  });
  
  it('should finish the game correctly', () => {
    expect(calculateDestination(18, 'GAE')).toBe(99);
    expect(calculateDestination(28, 'DO')).toBe(99);
  });
});