// packages/yut-engine/src/board.ts
import { BoardGraph } from './types';

export const BOARD_GRAPH: BoardGraph = {
  // --- OUTER RING ---
  0: { next: 1 },
  1: { next: 2 },
  2: { next: 3 },
  3: { next: 4 },
  4: { next: 5, shortcut: 20 }, // TOP-RIGHT CORNER: Can take the diagonal to 20
  
  5: { next: 6 },
  6: { next: 7 },
  7: { next: 8 },
  8: { next: 9 },
  9: { next: 10, shortcut: 25 }, // TOP-LEFT CORNER: Can take the diagonal to 25
  
  10: { next: 11 },
  11: { next: 12 },
  12: { next: 13 },
  13: { next: 14 }, // BOTTOM-LEFT CORNER (No shortcut here, just turns towards home)
  
  14: { next: 15 },
  15: { next: 16 },
  16: { next: 17 },
  17: { next: 18 },
  18: { next: 19 },
  19: { next: 99 }, // FINISH LINE (Passing bottom-right)

  // --- DIAGONAL 1: Top-Right to Bottom-Left ---
  20: { next: 21 },
  21: { next: 22 },
  22: { next: 23, shortcut: 27 }, // CENTER NODE: Can cut straight to the finish via 27
  23: { next: 24 },
  24: { next: 14 }, // Reconnects to the outer ring at Bottom-Left

  // --- DIAGONAL 2: Top-Left to Bottom-Right ---
  25: { next: 26 },
  26: { next: 22 }, // Meets at the center node
  27: { next: 28 },
  28: { next: 99 }, // Straight to Finish Line
};