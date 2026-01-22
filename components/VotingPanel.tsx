'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Player, Clue } from '@/types/game';
import { Check } from 'lucide-react';

interface VotingPanelProps {
  players: Player[];
  clues: Clue[];
  currentPlayerId: string;
  onVote: (suspectId: string) => void;
  hasVoted: boolean;
  disabled?: boolean;
}

export default function VotingPanel({
  players,
  clues,
  currentPlayerId,
  onVote,
  hasVoted,
  disabled = false,
}: VotingPanelProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const otherPlayers = players.filter(p => p.id !== currentPlayerId);

  const handleVote = () => {
    if (!selectedPlayer || hasVoted || disabled) return;
    setIsConfirming(true);
    setTimeout(() => {
      onVote(selectedPlayer);
      setIsConfirming(false);
    }, 300);
  };

  if (hasVoted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
        </motion.div>
        <p className="text-gray-900 font-semibold text-[17px] mb-1">Vote submitted</p>
        <p className="text-gray-400 text-[15px]">Waiting for others to vote...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-gray-900 text-[28px] font-semibold tracking-tight mb-2">Who&apos;s the impostor?</h2>
        <p className="text-gray-500 text-[15px]">Select who you think is bluffing</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {otherPlayers.map((player) => {
          const playerClues = clues.filter(c => c.playerId === player.id);
          const isSelected = selectedPlayer === player.id;

          return (
            <motion.button
              key={player.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlayer(player.id)}
              disabled={disabled}
              className={`relative p-5 rounded-2xl text-center transition-all duration-300 ${
                isSelected 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10' 
                  : 'bg-gray-50 hover:bg-gray-100'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-gray-900" strokeWidth={3} />
                </motion.div>
              )}

              <div className={`text-[28px] mb-3 w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                isSelected ? 'bg-white/10' : 'bg-white shadow-sm'
              }`}>
                {player.avatar}
              </div>
              
              <h3 className={`font-medium text-[14px] mb-3 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {player.name}
              </h3>
              
              <div className="flex flex-wrap justify-center gap-1.5">
                {playerClues.map((clue, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {clue.word}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileTap={selectedPlayer ? { scale: 0.98 } : {}}
        onClick={handleVote}
        disabled={!selectedPlayer || disabled || isConfirming}
        className={`w-full py-4 rounded-full text-[17px] font-medium transition-all duration-300 ${
          selectedPlayer
            ? 'bg-gray-900 text-white hover:bg-gray-700'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        {isConfirming ? 'Submitting...' : selectedPlayer ? `Vote for ${players.find(p => p.id === selectedPlayer)?.name}` : 'Select a player'}
      </motion.button>
    </motion.div>
  );
}
