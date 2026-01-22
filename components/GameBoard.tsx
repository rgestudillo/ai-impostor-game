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
    <div className="w-full max-w-4xl mx-auto">
      {/* Phase indicator */}
      {phase === 'clue-round' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <p className="text-neutral-400 text-sm">Round {currentRound} of {totalRounds}</p>
        </motion.div>
      )}

      {phase === 'discussion' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <p className="text-black text-lg font-medium">Discussion</p>
        </motion.div>
      )}

      {/* Players */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
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

      {/* Discussion */}
      {(phase === 'discussion' || phase === 'voting') && gameState.discussion.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-neutral-50 rounded-xl p-5 mb-8"
        >
          <div className="space-y-4">
            {gameState.discussion.map((msg, index) => {
              const speaker = players.find(p => p.id === msg.playerId);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex gap-3"
                >
                  <span className="text-xl w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    {speaker?.avatar}
                  </span>
                  <div>
                    <p className="text-black font-medium text-sm">{speaker?.name}</p>
                    <p className="text-neutral-600 text-[15px]">{msg.message}</p>
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
          className="border-t border-neutral-200 pt-8"
        >
          <p className="text-neutral-400 text-[11px] uppercase tracking-wider mb-5 text-center">
            All Clues
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[1, 2, 3].map((round) => {
              const roundClues = clues.filter(c => c.round === round);
              const isFutureRound = round > currentRound;
              
              return (
                <div key={round} className="text-center">
                  <p className={`text-xs mb-2 ${isFutureRound ? 'text-neutral-200' : 'text-neutral-400'}`}>
                    Round {round}
                  </p>
                  <div className="space-y-1.5">
                    {roundClues.length > 0 ? (
                      roundClues.map((clue, idx) => {
                        const player = players.find(p => p.id === clue.playerId);
                        return (
                          <div key={idx} className="flex items-center justify-center gap-1.5">
                            <span className="text-base">{player?.avatar}</span>
                            <span className="text-black font-medium text-sm">{clue.word}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-neutral-200 text-sm">—</p>
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
