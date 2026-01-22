'use client';

import { motion } from 'framer-motion';
import { Player, Clue } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  clues: Clue[];
  isCurrentTurn: boolean;
  isThinking?: boolean;
  showImpostor?: boolean;
  isVoted?: boolean;
  voteCount?: number;
}

export default function PlayerCard({
  player,
  clues,
  isCurrentTurn,
  isThinking = false,
  showImpostor = false,
  voteCount = 0,
}: PlayerCardProps) {
  const isHuman = player.type === 'human';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative rounded-2xl p-5 transition-all duration-300 ${
        isCurrentTurn 
          ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10' 
          : 'bg-gray-50 hover:bg-gray-100/80'
      }`}
    >
      {/* Impostor badge */}
      {showImpostor && player.isImpostor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-2.5 -right-2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-full shadow-sm"
        >
          Impostor
        </motion.div>
      )}

      {/* Vote count */}
      {voteCount > 0 && !showImpostor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-sm"
        >
          {voteCount}
        </motion.div>
      )}

      <div className="flex items-center gap-3.5 mb-4">
        <motion.div
          animate={isThinking ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: isThinking ? Infinity : 0, duration: 1.8, ease: "easeInOut" }}
          className={`text-[26px] w-12 h-12 rounded-full flex items-center justify-center ${
            isCurrentTurn ? 'bg-white/10' : 'bg-white shadow-sm'
          }`}
        >
          {player.avatar}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-[15px] leading-tight ${isCurrentTurn ? 'text-white' : 'text-gray-900'}`}>
            {player.name}
          </h3>
          <p className={`text-[13px] mt-0.5 ${isCurrentTurn ? 'text-white/50' : 'text-gray-400'}`}>
            {isHuman ? 'You' : player.personality}
          </p>
        </div>
      </div>

      {/* Thinking indicator */}
      {isThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-2 mb-3 ${isCurrentTurn ? 'text-white/50' : 'text-gray-400'}`}
        >
          <span className="text-[13px]">Thinking</span>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${isCurrentTurn ? 'bg-white' : 'bg-gray-400'}`}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Clues */}
      {clues.length > 0 && (
        <div className="space-y-2">
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${isCurrentTurn ? 'text-white/30' : 'text-gray-300'}`}>
            Clues
          </p>
          <div className="flex flex-wrap gap-1.5">
            {clues.map((clue, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium ${
                  isCurrentTurn 
                    ? 'bg-white/10 text-white' 
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {clue.word}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Current turn indicator */}
      {isCurrentTurn && !isThinking && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[13px] text-white/50"
        >
          Your turn
        </motion.p>
      )}
    </motion.div>
  );
}
