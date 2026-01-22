'use client';

import { motion } from 'framer-motion';

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
  if (isGameInProgress) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ opacity: 0.7 }}
        whileTap={{ scale: 0.98 }}
        onClick={onResetGame}
        className="text-gray-400 text-[13px] font-medium hover:text-gray-600 transition-colors"
      >
        New Game
      </motion.button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStartGame}
        className="btn-primary px-12 py-4 text-[17px]"
      >
        Start Game
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-4"
      >
        <p className="text-gray-400 text-[15px] max-w-xs leading-relaxed">
          One player doesn&apos;t know the secret word.<br />
          Give clues. Find the impostor.
        </p>
        
        <div className="flex items-center justify-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-900"></div>
            <span className="text-gray-500 text-[13px]">4 players</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-900"></div>
            <span className="text-gray-500 text-[13px]">3 rounds</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
