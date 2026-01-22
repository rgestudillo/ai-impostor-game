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
        whileTap={{ scale: 0.98 }}
        onClick={onResetGame}
        className="text-neutral-400 text-sm hover:text-black transition-colors"
      >
        Reset
      </motion.button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onStartGame}
        className="btn-primary px-10 py-4 text-base"
      >
        Start Game
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-neutral-400 text-sm max-w-xs text-center"
      >
        One player doesn&apos;t know the word. Give clues. Find them.
      </motion.p>
    </div>
  );
}
