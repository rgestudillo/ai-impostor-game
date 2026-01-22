'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player, Vote, PLAYER_COLORS } from '@/types/game';
import { Trophy, Skull, RotateCcw, Users, Eye } from 'lucide-react';

interface ResultsModalProps {
  isOpen: boolean;
  winner: 'impostor' | 'crew' | null;
  players: Player[];
  votes: Vote[];
  secretWord: string | null;
  humanIsImpostor: boolean;
  onPlayAgain: () => void;
}

export default function ResultsModal({
  isOpen,
  winner,
  players,
  votes,
  secretWord,
  humanIsImpostor,
  onPlayAgain,
}: ResultsModalProps) {
  const impostor = players.find(p => p.isImpostor);
  
  // Count votes per player
  const voteCounts = new Map<string, number>();
  players.forEach(p => voteCounts.set(p.id, 0));
  votes.forEach(vote => {
    voteCounts.set(vote.suspectId, (voteCounts.get(vote.suspectId) || 0) + 1);
  });

  // Determine if human won
  const humanWon = humanIsImpostor ? winner === 'impostor' : winner === 'crew';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl"
          >
            {/* Winner announcement */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  humanWon
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }`}
              >
                {humanWon ? (
                  <Trophy className="w-10 h-10 text-white" />
                ) : (
                  <Skull className="w-10 h-10 text-white" />
                )}
              </motion.div>
              
              <h2 className={`text-3xl font-bold mb-2 ${
                humanWon ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {humanWon ? 'You Win!' : 'You Lose!'}
              </h2>
              
              <p className="text-gray-300">
                {winner === 'crew' ? (
                  <>
                    <Users className="inline w-5 h-5 mr-1" />
                    The crew found the impostor!
                  </>
                ) : (
                  <>
                    <Eye className="inline w-5 h-5 mr-1" />
                    The impostor escaped detection!
                  </>
                )}
              </p>
            </motion.div>

            {/* Impostor reveal */}
            {impostor && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <p className="text-gray-400 text-sm text-center mb-3">
                  The impostor was:
                </p>
                <div className={`p-4 rounded-xl bg-gradient-to-r ${
                  PLAYER_COLORS[impostor.id as keyof typeof PLAYER_COLORS] || 'from-gray-500 to-gray-600'
                } flex items-center justify-center gap-3`}>
                  <span className="text-4xl">{impostor.avatar}</span>
                  <span className="text-white text-xl font-bold">{impostor.name}</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    IMPOSTOR
                  </span>
                </div>
              </motion.div>
            )}

            {/* Secret word */}
            {secretWord && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 text-center"
              >
                <p className="text-gray-400 text-sm mb-2">
                  The secret word was:
                </p>
                <p className="text-2xl font-bold text-emerald-400 uppercase tracking-wider">
                  {secretWord}
                </p>
              </motion.div>
            )}

            {/* Vote breakdown */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-gray-400 text-sm text-center mb-3">
                Vote Results:
              </p>
              <div className="space-y-2">
                {players
                  .sort((a, b) => (voteCounts.get(b.id) || 0) - (voteCounts.get(a.id) || 0))
                  .map((player) => {
                    const count = voteCounts.get(player.id) || 0;
                    const percentage = (count / votes.length) * 100;
                    return (
                      <div key={player.id} className="relative">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{player.avatar}</span>
                          <span className="text-white text-sm flex-1">{player.name}</span>
                          <span className="text-gray-400 text-sm">
                            {count} vote{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className={`h-full ${
                              player.isImpostor ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>

            {/* Play again button */}
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayAgain}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
