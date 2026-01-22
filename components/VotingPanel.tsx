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
        className="text-center py-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
        </motion.div>
        <p className="text-black font-medium">Vote submitted</p>
        <p className="text-neutral-400 text-sm">Waiting for others</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-black text-2xl font-semibold mb-1">Who&apos;s the impostor?</h2>
        <p className="text-neutral-500">Select who you think is bluffing</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {otherPlayers.map((player) => {
          const playerClues = clues.filter(c => c.playerId === player.id);
          const isSelected = selectedPlayer === player.id;

          return (
            <motion.button
              key={player.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlayer(player.id)}
              disabled={disabled}
              className={`relative p-4 rounded-xl text-center transition-all duration-200 ${
                isSelected 
                  ? 'bg-black text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-black" strokeWidth={3} />
                </motion.div>
              )}

              <div className={`text-3xl mb-2 w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                isSelected ? 'bg-white/10' : 'bg-white'
              }`}>
                {player.avatar}
              </div>
              
              <h3 className={`font-medium text-sm mb-2 ${isSelected ? 'text-white' : 'text-black'}`}>
                {player.name}
              </h3>
              
              <div className="flex flex-wrap justify-center gap-1">
                {playerClues.map((clue, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-white text-black'
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
        className={`w-full py-3.5 rounded-full text-[15px] font-medium transition-all duration-200 ${
          selectedPlayer
            ? 'bg-black text-white'
            : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
        }`}
      >
        {isConfirming ? 'Submitting...' : selectedPlayer ? `Vote for ${players.find(p => p.id === selectedPlayer)?.name}` : 'Select a player'}
      </motion.button>
    </motion.div>
  );
}
