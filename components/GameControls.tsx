'use client';

import { motion } from 'framer-motion';
import { Play, RotateCcw, Info } from 'lucide-react';

interface GameControlsProps {
  onStartGame: () => void;
  onResetGame: () => void;
  isGameInProgress: boolean;
}

export default function GameControls({
  onStartGame,
  onResetGame,
  isGameInProgress,
}: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {!isGameInProgress ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartGame}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl rounded-2xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Play className="w-6 h-6" />
            Start Game
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-md text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">How to Play</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              One player is secretly the Impostor who doesn&apos;t know the secret word.
              Give one-word clues each round, then vote on who you think is bluffing!
            </p>
          </motion.div>
        </>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onResetGame}
          className="px-6 py-2 text-white font-medium rounded-xl flex items-center gap-2 transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Game
        </motion.button>
      )}
    </div>
  );
}
