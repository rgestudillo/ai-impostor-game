'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player, Vote } from '@/types/game';

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
  
  const voteCounts = new Map<string, number>();
  players.forEach(p => voteCounts.set(p.id, 0));
  votes.forEach(vote => {
    voteCounts.set(vote.suspectId, (voteCounts.get(vote.suspectId) || 0) + 1);
  });

  const humanWon = humanIsImpostor ? winner === 'impostor' : winner === 'crew';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl shadow-gray-900/10 border border-gray-100"
          >
            {/* Result header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className={`text-[56px] mb-4 ${humanWon ? '' : 'grayscale opacity-50'}`}
              >
                {humanWon ? '🎉' : '😔'}
              </motion.div>
              <h2 className="text-[28px] font-semibold text-gray-900 tracking-tight mb-2">
                {humanWon ? 'Victory!' : 'Defeat'}
              </h2>
              <p className="text-gray-500 text-[15px]">
                {winner === 'crew' ? 'The crew found the impostor' : 'The impostor escaped detection'}
              </p>
            </motion.div>

            {/* Impostor reveal */}
            {impostor && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gray-50 rounded-2xl p-4 mb-5"
              >
                <p className="label mb-3 text-center">
                  The impostor was
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-[26px] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {impostor.avatar}
                  </div>
                  <span className="text-gray-900 font-semibold text-[17px]">{impostor.name}</span>
                </div>
              </motion.div>
            )}

            {/* Secret word */}
            {secretWord && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-center mb-6"
              >
                <p className="label mb-2">
                  The secret word
                </p>
                <p className="text-gray-900 text-[24px] font-semibold tracking-tight">{secretWord}</p>
              </motion.div>
            )}

            {/* Vote breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-8"
            >
              <p className="label mb-4 text-center">
                Vote Results
              </p>
              <div className="space-y-3">
                {players
                  .sort((a, b) => (voteCounts.get(b.id) || 0) - (voteCounts.get(a.id) || 0))
                  .map((player) => {
                    const count = voteCounts.get(player.id) || 0;
                    const percentage = votes.length > 0 ? (count / votes.length) * 100 : 0;
                    const isImpostorPlayer = player.isImpostor;
                    
                    return (
                      <div key={player.id}>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-[18px]">{player.avatar}</span>
                          <span className={`text-[14px] flex-1 ${isImpostorPlayer ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                            {player.name}
                            {isImpostorPlayer && <span className="text-gray-400 font-normal ml-1.5">Impostor</span>}
                          </span>
                          <span className="text-gray-400 text-[14px] font-medium tabular-nums">{count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                            className={`h-full rounded-full ${isImpostorPlayer ? 'bg-gray-900' : 'bg-gray-300'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>

            {/* Play again button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayAgain}
              className="btn-primary w-full"
            >
              Play Again
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
