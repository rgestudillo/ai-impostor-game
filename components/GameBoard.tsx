'use client';

import { motion } from 'framer-motion';
import { GameState } from '@/types/game';
import PlayerCard from './PlayerCard';

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
    <div className="w-full max-w-5xl mx-auto">
      {/* Phase indicator */}
      {phase === 'clue-round' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 text-[13px] font-medium tracking-wide">
            Round {currentRound} of {totalRounds}
          </p>
        </motion.div>
      )}

      {phase === 'discussion' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-gray-900 text-[21px] font-semibold tracking-tight">Discussion</h2>
        </motion.div>
      )}

      {phase === 'voting' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-gray-900 text-[21px] font-semibold tracking-tight">Voting</h2>
        </motion.div>
      )}

      {/* Players grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-2xl p-6 mb-10"
        >
          <div className="space-y-5">
            {gameState.discussion.map((msg, index) => {
              const speaker = players.find(p => p.id === msg.playerId);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-[20px] w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      {speaker?.avatar}
                    </div>
                    <p className="text-gray-900 font-medium text-[14px]">{speaker?.name}</p>
                  </div>
                  <div className="pl-11">
                    <p className="text-gray-600 text-[15px] leading-relaxed">{msg.message}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Clue history */}
      {clues.length > 0 && phase !== 'lobby' && phase !== 'setup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-gray-100 pt-10"
        >
          <p className="label mb-6 text-center">
            All Clues
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[1, 2, 3].map((round) => {
              const roundClues = clues.filter(c => c.round === round);
              const isFutureRound = round > currentRound;
              
              return (
                <div key={round} className="text-center">
                  <p className={`text-[12px] font-medium mb-3 ${isFutureRound ? 'text-gray-200' : 'text-gray-400'}`}>
                    Round {round}
                  </p>
                  <div className="space-y-2">
                    {roundClues.length > 0 ? (
                      roundClues.map((clue, idx) => {
                        const player = players.find(p => p.id === clue.playerId);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <span className="text-[16px]">{player?.avatar}</span>
                            <span className="text-gray-800 font-medium text-[14px]">{clue.word}</span>
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-gray-200 text-[14px]">—</p>
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
