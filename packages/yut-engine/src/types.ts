// packages/yut-engine/src/types.ts

export type PlayerColor = 'BLUE' | 'RED';

// NEW: The five specific card themes from the CEO's README
export type CardTheme = 'BLUE_NAVY' | 'LIGHT_GREEN' | 'GOLDEN_GOLD' | 'SNOW_WHITE' | 'BROWN';

// NEW: Tracking the current phase of a player's turn
export type TurnPhase = 
  | 'WAITING_FOR_THROW'   // Player needs to click "Throw Yut"
  | 'WAITING_FOR_ANSWER'  // Player threw the sticks, now must answer a card
  | 'WAITING_FOR_MOVE';   // Player answered correctly, now selects which piece to move

export interface Piece {
  id: string;
  owner: PlayerColor;
  position: number | null; 
}

export interface GameState {
  currentTurn: PlayerColor;
  phase: TurnPhase; // NEW: The current state of the turn
  pieces: Piece[];
  board: string[][]; 
  remainingThrows: StickResult[];
  
  // NEW: Temporary storage for the pending move while they answer the question
  pendingThrow: StickResult | null;
  activeQuestionTheme: CardTheme | null;
}

export type StickResult = 'DO' | 'GAE' | 'GEOL' | 'YUT' | 'MO' | 'BACK_DO';

export const MOVEMENT_VALUES: Record<StickResult, number> = {
  'DO': 1,
  'GAE': 2,
  'GEOL': 3,
  'YUT': 4,
  'MO': 5,
  'BACK_DO': -1
};

export interface BoardNode {
  next: number | 99; 
  shortcut?: number; 
}

export type BoardGraph = Record<number, BoardNode>;