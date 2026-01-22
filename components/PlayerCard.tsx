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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative rounded-xl p-5 transition-all duration-200 ${
        isCurrentTurn 
          ? 'bg-black text-white' 
          : 'bg-neutral-100'
      }`}
    >
      {/* Impostor badge */}
      {showImpostor && player.isImpostor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 px-2 py-0.5 bg-black text-white text-[11px] font-medium rounded-full"
        >
          Impostor
        </motion.div>
      )}

      {/* Vote count */}
      {voteCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center"
        >
          {voteCount}
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <motion.div
          animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: isThinking ? Infinity : 0, duration: 1.5 }}
          className={`text-2xl w-11 h-11 rounded-full flex items-center justify-center ${
            isCurrentTurn ? 'bg-white/10' : 'bg-white'
          }`}
        >
          {player.avatar}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-[15px] ${isCurrentTurn ? 'text-white' : 'text-black'}`}>
            {player.name}
          </h3>
          <p className={`text-[13px] ${isCurrentTurn ? 'text-white/60' : 'text-neutral-500'}`}>
            {isHuman ? 'You' : player.personality}
          </p>
        </div>
      </div>

      {/* Thinking */}
      {isThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-1.5 mb-2 ${isCurrentTurn ? 'text-white/60' : 'text-neutral-500'}`}
        >
          <span className="text-[13px]">Thinking</span>
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className={`w-1 h-1 rounded-full ${isCurrentTurn ? 'bg-white' : 'bg-neutral-400'}`}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Clues */}
      {clues.length > 0 && (
        <div className="space-y-1.5">
          <p className={`text-[11px] uppercase tracking-wider ${isCurrentTurn ? 'text-white/40' : 'text-neutral-400'}`}>
            Clues
          </p>
          <div className="flex flex-wrap gap-1.5">
            {clues.map((clue, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`px-2.5 py-1 rounded-full text-[13px] font-medium ${
                  isCurrentTurn 
                    ? 'bg-white/10 text-white' 
                    : 'bg-white text-black'
                }`}
              >
                {clue.word}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Current turn */}
      {isCurrentTurn && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-[13px] text-white/60"
        >
          Your turn
        </motion.p>
      )}
    </motion.div>
  );
}
