// packages/yut-engine/src/actions.ts
import { GameState, StickResult, CardTheme, PlayerColor, TurnPhase } from './types';
import { calculateDestination } from './movement';

const THEMES: CardTheme[] = ['BLUE_NAVY', 'LIGHT_GREEN', 'GOLDEN_GOLD', 'SNOW_WHITE', 'BROWN'];

export function getRandomTheme(): CardTheme {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

export function rollYut(state: GameState, forcedResult?: StickResult, forcedTheme?: CardTheme): GameState {
  if (state.phase !== 'WAITING_FOR_THROW') return state;

  const result = forcedResult || 'DO'; 
  const theme = forcedTheme || getRandomTheme();

  return {
    ...state,
    phase: 'WAITING_FOR_ANSWER',
    pendingThrow: result,
    activeQuestionTheme: theme,
  };
}

export function submitAnswer(state: GameState, isCorrect: boolean): GameState {
  if (state.phase !== 'WAITING_FOR_ANSWER' || !state.pendingThrow) return state;

  if (isCorrect) {
    return {
      ...state,
      phase: 'WAITING_FOR_MOVE',
      remainingThrows: [...state.remainingThrows, state.pendingThrow],
      pendingThrow: null,
      activeQuestionTheme: null,
    };
  } else {
    const hasOtherThrows = state.remainingThrows.length > 0;
    const nextTurn: PlayerColor = hasOtherThrows 
      ? state.currentTurn 
      : (state.currentTurn === 'BLUE' ? 'RED' : 'BLUE');

    return {
      ...state,
      currentTurn: nextTurn,
      phase: hasOtherThrows ? 'WAITING_FOR_MOVE' : 'WAITING_FOR_THROW',
      pendingThrow: null,
      activeQuestionTheme: null,
    };
  }
}

/**
 * Action 3: Player moves a piece using one of their earned throws.
 */
export function movePiece(state: GameState, pieceId: string, usedThrow: StickResult): GameState {
  // 1. Guard clauses
  if (state.phase !== 'WAITING_FOR_MOVE') return state;
  
  const throwIndex = state.remainingThrows.indexOf(usedThrow);
  if (throwIndex === -1) return state; // Player doesn't have this throw available

  const targetPiece = state.pieces.find(p => p.id === pieceId);
  if (!targetPiece || targetPiece.owner !== state.currentTurn) return state; // Not their piece
  if (targetPiece.position === 99) return state; // Already finished

  // 2. Calculate Destination
  const destination = calculateDestination(targetPiece.position, usedThrow);
  if (destination === null) return state; // Invalid move (e.g., Back Do off the board)

  // 3. Identify Grouped Pieces
  // If the piece is on the board, any allied piece on the same node moves with it
  const piecesMovingTogether = targetPiece.position !== null 
    ? state.pieces.filter(p => p.owner === targetPiece.owner && p.position === targetPiece.position)
    : [targetPiece];

  // 4. Apply Movement & Captures
  let capturedEnemy = false;
  const updatedPieces = state.pieces.map(piece => {
    // Move our grouped pieces
    if (piecesMovingTogether.some(p => p.id === piece.id)) {
      return { ...piece, position: destination };
    }
    // Check if an enemy is at the destination and gets captured (excluding finish line)
    if (piece.owner !== targetPiece.owner && piece.position === destination && destination !== 99) {
      capturedEnemy = true;
      return { ...piece, position: null }; // Send enemy back to base
    }
    return piece;
  });

  // 5. Update remaining throws
  const newThrows = [...state.remainingThrows];
  newThrows.splice(throwIndex, 1); // Remove the used throw

  // 6. Determine next phase & turn
  let nextTurn = state.currentTurn;
  let nextPhase: TurnPhase = state.phase;

  if (newThrows.length > 0) {
    nextPhase = 'WAITING_FOR_MOVE'; // Still has throws left
  } else if (capturedEnemy) {
    // Traditional rule: capturing grants a free extra throw!
    nextPhase = 'WAITING_FOR_THROW'; 
  } else {
    // Turn is completely over
    nextTurn = state.currentTurn === 'BLUE' ? 'RED' : 'BLUE';
    nextPhase = 'WAITING_FOR_THROW';
  }

  return {
    ...state,
    pieces: updatedPieces,
    remainingThrows: newThrows,
    currentTurn: nextTurn,
    phase: nextPhase
  };
}