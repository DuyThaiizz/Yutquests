import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { 
  GameState, 
  createInitialGameState, 
  rollYut, 
  submitAnswer, 
  movePiece 
} from 'yut-engine';

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// In-memory database storing the GameState for all active rooms
const activeGames = new Map<string, GameState>();

io.on('connection', (socket) => {
  console.log(`🟢 New player connected: ${socket.id}`);

  // --- 1. ROOM MANAGEMENT ---
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`🏠 Player ${socket.id} joined room: ${roomId}`);
    
    // If this is the first person to join the room, create a fresh game board
    if (!activeGames.has(roomId)) {
      activeGames.set(roomId, createInitialGameState());
    }
    
    // Confirm room join to the specific player
    socket.emit('room_joined', roomId);
    
    // Broadcast the current board state to EVERYONE in that room
    io.to(roomId).emit('game_state_update', activeGames.get(roomId));
  });

  // --- 2. GAME ENGINE EVENT LISTENERS ---
  
  socket.on('action_roll', (roomId: string) => {
    const currentState = activeGames.get(roomId);
    if (currentState) {
      // Run the pure engine function
      const newState = rollYut(currentState);
      activeGames.set(roomId, newState); // Save to memory
      io.to(roomId).emit('game_state_update', newState); // Broadcast to all players
    }
  });

  socket.on('action_answer', ({ roomId, isCorrect }: { roomId: string, isCorrect: boolean }) => {
    const currentState = activeGames.get(roomId);
    if (currentState) {
      const newState = submitAnswer(currentState, isCorrect);
      activeGames.set(roomId, newState);
      io.to(roomId).emit('game_state_update', newState);
    }
  });

  socket.on('action_move', ({ roomId, pieceId, throwResult }: { roomId: string, pieceId: string, throwResult: any }) => {
    const currentState = activeGames.get(roomId);
    if (currentState) {
      const newState = movePiece(currentState, pieceId, throwResult);
      activeGames.set(roomId, newState);
      io.to(roomId).emit('game_state_update', newState);
    }
  });

  // --- 3. DISCONNECTION ---
  socket.on('disconnect', () => {
    console.log(`🔴 Player disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Yut Nori Game Server running on http://localhost:${PORT}`);
});