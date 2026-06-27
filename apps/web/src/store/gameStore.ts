import { create } from 'zustand';
import { GameState, createInitialGameState, StickResult } from 'yut-engine';
import { io, Socket } from 'socket.io-client';

// Create a singleton socket connection for the entire app
export const socket: Socket = io('http://localhost:3001');

interface GameStore {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  
  gameState: GameState;
  setGameState: (state: GameState) => void;
  
  // Actions now EMIT to the server instead of calculating locally
  roll: () => void;
  answer: (isCorrect: boolean) => void;
  move: (pieceId: string, throwResult: StickResult) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  roomId: null,
  setRoomId: (id) => set({ roomId: id }),
  
  gameState: createInitialGameState(),
  setGameState: (state) => set({ gameState: state }),
  
  roll: () => {
    const { roomId } = get();
    if (roomId) socket.emit('action_roll', roomId);
  },
  answer: (isCorrect) => {
    const { roomId } = get();
    if (roomId) socket.emit('action_answer', { roomId, isCorrect });
  },
  move: (pieceId, throwResult) => {
    const { roomId } = get();
    if (roomId) socket.emit('action_move', { roomId, pieceId, throwResult });
  }
}));

// Global listener: Whenever the server sends a new board state, update the UI
socket.on('game_state_update', (newState: GameState) => {
  useGameStore.getState().setGameState(newState);
});