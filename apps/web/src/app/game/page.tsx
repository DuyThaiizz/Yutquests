'use client';
import React from 'react';
import GameBoard from '@/components/GameBoard';

export default function GamePage() {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden transition-colors duration-500">
      {/* Background gradient (Cotton Candy Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(174,207,247,0.45) 0%, rgba(255,214,232,0.3) 55%, rgba(255,255,255,0) 100%)'
      }} />
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <GameBoard />
      </div>
    </main>
  );
}