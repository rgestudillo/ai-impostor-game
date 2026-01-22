'use client';

import { motion } from 'framer-motion';
import { GameState } from '@/types/game';
import PlayerCard from './PlayerCard';
import { MessageCircle, Clock } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  thinkingPlayerId: string | null;
  voteCounts: Map<string, number>;
}

export default function GameBoard({
  gameState,
  thinkingPlayerId,
  voteCounts,
}: GameBoardProps) {
  const { players, clues, phase, currentRound, totalRounds, currentPlayerIndex, votes } = gameState;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Round indicator */}
      {phase === 'clue-round' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white font-medium">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
        </motion.div>
      )}

      {/* Discussion phase header */}
      {phase === 'discussion' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <MessageCircle className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Discussion Phase</span>
          </div>
        </motion.div>
      )}

      {/* Player grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {players.map((player, index) => {
          const playerClues = clues.filter(c => c.playerId === player.id);
          const isCurrentTurn = phase === 'clue-round' && currentPlayerIndex === index && player.type === 'human';
          const isThinking = thinkingPlayerId === player.id;
          const hasVoted = votes.some(v => v.voterId === player.id);
          const voteCount = voteCounts.get(player.id) || 0;

          return (
            <PlayerCard
              key={player.id}
              player={player}
              clues={playerClues}
              isCurrentTurn={isCurrentTurn}
              isThinking={isThinking}
              showImpostor={phase === 'results' || phase === 'reveal'}
              isVoted={phase === 'voting' && hasVoted}
              voteCount={phase === 'voting' || phase === 'reveal' || phase === 'results' ? voteCount : 0}
            />
          );
        })}
      </div>

      {/* Discussion messages */}
      {(phase === 'discussion' || phase === 'voting') && gameState.discussion.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: 'rgba(30, 27, 75, 0.8)' }}
        >
          <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Discussion
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {gameState.discussion.map((msg, index) => {
              const speaker = players.find(p => p.id === msg.playerId);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <span className="text-2xl">{speaker?.avatar}</span>
                  <div>
                    <span className="text-white font-medium text-sm">{speaker?.name}</span>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Clue history by round */}
      {clues.length > 0 && phase !== 'lobby' && phase !== 'setup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'rgba(30, 27, 75, 0.8)' }}
        >
          <h3 className="text-gray-300 text-sm font-medium mb-3">
            Clue History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((round) => {
              const roundClues = clues.filter(c => c.round === round);
              if (roundClues.length === 0 && round > currentRound) return null;
              
              return (
                <div 
                  key={round} 
                  className="rounded-xl p-3"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                >
                  <p className="text-gray-400 text-xs mb-2">Round {round}</p>
                  <div className="space-y-1">
                    {roundClues.length > 0 ? (
                      roundClues.map((clue, idx) => {
                        const player = players.find(p => p.id === clue.playerId);
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-sm">{player?.avatar}</span>
                            <span className="text-white text-sm font-medium">{clue.word}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-xs">Waiting...</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
