'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Player, Clue, PLAYER_COLORS } from '@/types/game';
import { Check, Vote } from 'lucide-react';

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
    }, 500);
  };

  if (hasVoted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 rounded-2xl"
        style={{ backgroundColor: 'rgba(30, 27, 75, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-white text-xl font-bold mb-2">Vote Cast!</h3>
        <p className="text-gray-400">Waiting for others to vote...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <Vote className="w-10 h-10 text-white mx-auto mb-2" />
        <h2 className="text-white text-2xl font-bold mb-1">Time to Vote!</h2>
        <p className="text-gray-400">Who do you think is the impostor?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {otherPlayers.map((player) => {
          const playerClues = clues.filter(c => c.playerId === player.id);
          const colorClass = PLAYER_COLORS[player.id as keyof typeof PLAYER_COLORS] || 'from-gray-500 to-gray-600';
          const isSelected = selectedPlayer === player.id;

          return (
            <motion.button
              key={player.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlayer(player.id)}
              disabled={disabled}
              className={`relative p-4 rounded-xl bg-gradient-to-br ${colorClass} transition-all ${
                isSelected ? 'ring-4 ring-white shadow-xl' : 'opacity-80 hover:opacity-100'
              } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-green-500" />
                </motion.div>
              )}

              <div className="text-4xl mb-2">{player.avatar}</div>
              <h3 className="text-white font-bold text-lg">{player.name}</h3>
              
              <div className="mt-3 space-y-1">
                <p className="text-white/60 text-xs uppercase">Clues:</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {playerClues.map((clue, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-white text-xs"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      {clue.word}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: selectedPlayer ? 1.02 : 1 }}
        whileTap={{ scale: selectedPlayer ? 0.98 : 1 }}
        onClick={handleVote}
        disabled={!selectedPlayer || disabled || isConfirming}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          selectedPlayer
            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white cursor-pointer hover:shadow-lg'
            : 'text-gray-500 cursor-not-allowed'
        }`}
        style={!selectedPlayer ? { backgroundColor: 'rgba(30, 27, 75, 0.8)' } : {}}
      >
        {isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Casting Vote...
          </span>
        ) : selectedPlayer ? (
          `Vote for ${players.find(p => p.id === selectedPlayer)?.name}`
        ) : (
          'Select a player to vote'
        )}
      </motion.button>
    </motion.div>
  );
}
