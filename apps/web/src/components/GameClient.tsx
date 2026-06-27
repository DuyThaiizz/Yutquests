'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore, socket } from '../store/gameStore';

export default function GameClient() {
  const [connected, setConnected] = useState(false);
  const [roomInput, setRoomInput] = useState('');
  const { roomId, setRoomId } = useGameStore();

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onRoomJoined = (id: string) => setRoomId(id);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_joined', onRoomJoined);

    // If socket is already connected when component mounts
    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_joined', onRoomJoined);
    };
  }, [setRoomId]);

  const handleJoinRoom = () => {
    if (roomInput.trim() !== '') {
      socket.emit('join_room', roomInput);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">Game Server:</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {connected ? 'Connected' : 'Connecting...'}
          </span>
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></div>
        </div>
      </div>

      {connected && !roomId && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter Room ID..."
            className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white bg-transparent"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Join Match
          </button>
        </div>
      )}

      {roomId && (
        <div className="text-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
          <p className="text-zinc-900 dark:text-white font-medium">
            Currently in Match: <span className="text-blue-500 font-bold">{roomId}</span>
          </p>
        </div>
      )}
    </div>
  );
}