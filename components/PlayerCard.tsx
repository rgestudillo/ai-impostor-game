'use client';

import { motion } from 'framer-motion';
import { Player, Clue, PLAYER_COLORS } from '@/types/game';
import { Bot, User, Eye, EyeOff } from 'lucide-react';

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
  isVoted = false,
  voteCount = 0,
}: PlayerCardProps) {
  const colorClass = PLAYER_COLORS[player.id as keyof typeof PLAYER_COLORS] || 'from-gray-500 to-gray-600';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl p-4 bg-gradient-to-br ${colorClass} shadow-lg ${
        isCurrentTurn ? 'ring-4 ring-white/50' : ''
      }`}
    >
      {/* Current turn indicator */}
      {isCurrentTurn && (
        <motion.div
          className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Your turn!
        </motion.div>
      )}

      {/* Impostor reveal badge */}
      {showImpostor && player.isImpostor && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          Impostor!
        </motion.div>
      )}

      {/* Vote count badge */}
      {voteCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 right-2 bg-red-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center"
        >
          {voteCount}
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <motion.div
          className="text-4xl rounded-full w-14 h-14 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          animate={isThinking ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ repeat: isThinking ? Infinity : 0, duration: 0.5 }}
        >
          {player.avatar}
        </motion.div>

        {/* Name and type */}
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">{player.name}</h3>
          <div className="flex items-center gap-1 text-white/70 text-sm">
            {player.type === 'ai' ? (
              <>
                <Bot className="w-4 h-4" />
                <span className="capitalize">{player.personality}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Human</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thinking indicator */}
      {isThinking && (
        <motion.div
          className="flex items-center gap-2 text-white/80 text-sm mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Thinking...
          </motion.span>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Clues */}
      {clues.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-white/60 text-xs uppercase tracking-wide">Clues:</p>
          <div className="flex flex-wrap gap-2">
            {clues.map((clue, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-1 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {clue.word}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Voted indicator */}
      {isVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-white/70 text-xs flex items-center gap-1"
        >
          <EyeOff className="w-3 h-3" />
          Vote cast
        </motion.div>
      )}
    </motion.div>
  );
}
