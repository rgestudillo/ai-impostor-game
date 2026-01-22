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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200"
          >
            {/* Result */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-6"
            >
              <p className="text-5xl mb-3">{humanWon ? '○' : '×'}</p>
              <h2 className="text-2xl font-semibold text-black mb-1">
                {humanWon ? 'You won' : 'You lost'}
              </h2>
              <p className="text-neutral-500 text-sm">
                {winner === 'crew' ? 'The crew found the impostor' : 'The impostor escaped'}
              </p>
            </motion.div>

            {/* Impostor */}
            {impostor && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-50 rounded-xl p-3 mb-4"
              >
                <p className="text-neutral-400 text-[11px] uppercase tracking-wider mb-2 text-center">
                  The impostor
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{impostor.avatar}</span>
                  <span className="text-black font-medium">{impostor.name}</span>
                </div>
              </motion.div>
            )}

            {/* Secret word */}
            {secretWord && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4"
              >
                <p className="text-neutral-400 text-[11px] uppercase tracking-wider mb-1">
                  The word
                </p>
                <p className="text-black text-xl font-semibold">{secretWord}</p>
              </motion.div>
            )}

            {/* Votes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-neutral-400 text-[11px] uppercase tracking-wider mb-3 text-center">
                Votes
              </p>
              <div className="space-y-2">
                {players
                  .sort((a, b) => (voteCounts.get(b.id) || 0) - (voteCounts.get(a.id) || 0))
                  .map((player) => {
                    const count = voteCounts.get(player.id) || 0;
                    const percentage = votes.length > 0 ? (count / votes.length) * 100 : 0;
                    return (
                      <div key={player.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{player.avatar}</span>
                          <span className="text-black text-sm flex-1">{player.name}</span>
                          <span className="text-neutral-400 text-sm">{count}</span>
                        </div>
                        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="h-full bg-black rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>

            {/* Play again */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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
