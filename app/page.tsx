'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Player, Clue } from '@/types/game';
import {
  createInitialGameState,
  setupGame,
  startClueRound,
  addClue,
  addDiscussionMessage,
  startVoting,
  addVote,
  revealResults,
  getCurrentPlayer,
  getVoteResults,
  hasPlayerVoted,
} from '@/lib/game-logic';
import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import ClueInput from '@/components/ClueInput';
import VotingPanel from '@/components/VotingPanel';
import ResultsModal from '@/components/ResultsModal';

async function getAIResponse(
  action: 'clue' | 'discussion' | 'vote',
  player: Player,
  secretWord: string | null,
  previousClues: Clue[],
  currentRound: number,
  allPlayers: Player[],
  discussion: { playerId: string; message: string }[] = []
): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      player,
      secretWord,
      previousClues,
      currentRound,
      allPlayers,
      discussion,
    }),
  });

  if (!response.ok) throw new Error('Failed to get AI response');
  const data = await response.json();
  return data.response;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [thinkingPlayerId, setThinkingPlayerId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const humanPlayer = gameState.players.find(p => p.type === 'human');
  const currentPlayer = getCurrentPlayer(gameState);
  const isHumanTurn = currentPlayer?.type === 'human';
  const voteCounts = getVoteResults(gameState);

  const processAITurn = useCallback(async () => {
    if (isProcessing) return;
    
    const player = getCurrentPlayer(gameState);
    if (!player || player.type === 'human') return;

    setIsProcessing(true);
    setThinkingPlayerId(player.id);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const clue = await getAIResponse(
        'clue',
        player,
        player.isImpostor ? null : gameState.secretWord,
        gameState.clues,
        gameState.currentRound,
        gameState.players
      );

      setGameState(prev => addClue(prev, player.id, clue));
    } catch (error) {
      console.error('AI clue error:', error);
      const fallbackClues = ['thing', 'object', 'item', 'stuff', 'something'];
      const fallback = fallbackClues[Math.floor(Math.random() * fallbackClues.length)];
      setGameState(prev => addClue(prev, player.id, fallback));
    } finally {
      setThinkingPlayerId(null);
      setIsProcessing(false);
    }
  }, [gameState, isProcessing]);

  const processAIDiscussion = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const aiPlayers = gameState.players.filter(p => p.type === 'ai');
    
    for (const player of aiPlayers) {
      setThinkingPlayerId(player.id);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

      try {
        const message = await getAIResponse(
          'discussion',
          player,
          player.isImpostor ? null : gameState.secretWord,
          gameState.clues,
          gameState.currentRound,
          gameState.players,
          gameState.discussion
        );

        setGameState(prev => addDiscussionMessage(prev, player.id, message));
      } catch (error) {
        console.error('AI discussion error:', error);
        setGameState(prev => 
          addDiscussionMessage(prev, player.id, "I'm not sure who to suspect...")
        );
      }
    }

    setThinkingPlayerId(null);
    setIsProcessing(false);
    
    setTimeout(() => {
      setGameState(prev => startVoting(prev));
    }, 1500);
  }, [gameState, isProcessing]);

  const processAIVoting = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const aiPlayers = gameState.players.filter(p => p.type === 'ai');
    
    for (const player of aiPlayers) {
      if (hasPlayerVoted(gameState, player.id)) continue;
      
      setThinkingPlayerId(player.id);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));

      try {
        const votedName = await getAIResponse(
          'vote',
          player,
          player.isImpostor ? null : gameState.secretWord,
          gameState.clues,
          gameState.currentRound,
          gameState.players,
          gameState.discussion
        );

        const votedPlayer = gameState.players.find(
          p => p.name.toLowerCase() === votedName.toLowerCase() && p.id !== player.id
        );

        if (votedPlayer) {
          setGameState(prev => addVote(prev, player.id, votedPlayer.id));
        } else {
          const otherPlayers = gameState.players.filter(p => p.id !== player.id);
          const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
          setGameState(prev => addVote(prev, player.id, randomPlayer.id));
        }
      } catch (error) {
        console.error('AI vote error:', error);
        const otherPlayers = gameState.players.filter(p => p.id !== player.id);
        const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        setGameState(prev => addVote(prev, player.id, randomPlayer.id));
      }
    }

    setThinkingPlayerId(null);
    setIsProcessing(false);
  }, [gameState, isProcessing]);

  useEffect(() => {
    if (gameState.phase === 'clue-round' && !isHumanTurn && !isProcessing) {
      processAITurn();
    }
  }, [gameState.phase, gameState.currentPlayerIndex, isHumanTurn, isProcessing, processAITurn]);

  useEffect(() => {
    if (gameState.phase === 'discussion' && gameState.discussion.length === 0 && !isProcessing) {
      processAIDiscussion();
    }
  }, [gameState.phase, gameState.discussion.length, isProcessing, processAIDiscussion]);

  useEffect(() => {
    if (gameState.phase === 'voting' && !isProcessing) {
      const humanVoted = humanPlayer ? hasPlayerVoted(gameState, humanPlayer.id) : true;
      const aiPlayers = gameState.players.filter(p => p.type === 'ai');
      const allAIVoted = aiPlayers.every(p => hasPlayerVoted(gameState, p.id));
      
      if (humanVoted && !allAIVoted) {
        processAIVoting();
      }
    }
  }, [gameState, humanPlayer, isProcessing, processAIVoting]);

  useEffect(() => {
    if (gameState.phase === 'reveal') {
      setTimeout(() => {
        setGameState(prev => revealResults(prev));
      }, 1000);
    }
  }, [gameState.phase]);

  useEffect(() => {
    if (gameState.phase === 'results') {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  }, [gameState.phase]);

  const handleStartGame = () => {
    const newState = setupGame(gameState);
    setGameState(startClueRound(newState));
    setShowResults(false);
  };

  const handleResetGame = () => {
    setGameState(createInitialGameState());
    setShowResults(false);
    setThinkingPlayerId(null);
    setIsProcessing(false);
  };

  const handleHumanClue = (clue: string) => {
    if (!humanPlayer) return;
    setGameState(prev => addClue(prev, humanPlayer.id, clue));
  };

  const handleHumanVote = (suspectId: string) => {
    if (!humanPlayer) return;
    setGameState(prev => addVote(prev, humanPlayer.id, suspectId));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-[15px] font-medium text-gray-800 tracking-tight">Impostor</span>
          {gameState.phase !== 'lobby' && (
            <GameControls
              onStartGame={handleStartGame}
              onResetGame={handleResetGame}
              isGameInProgress={true}
            />
          )}
        </div>
      </header>

      <main className="pt-12">
        {/* Lobby */}
        {gameState.phase === 'lobby' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center max-w-lg"
            >
              <h1 className="text-gray-900 text-[56px] sm:text-[64px] font-semibold tracking-tight leading-[1.05] mb-4">
                Impostor
              </h1>
              
              <p className="text-gray-500 text-[19px] leading-relaxed mb-12">
                A social deduction game where you play<br className="hidden sm:block" /> against three AI opponents.
              </p>

              <GameControls
                onStartGame={handleStartGame}
                onResetGame={handleResetGame}
                isGameInProgress={false}
              />
            </motion.div>
          </motion.section>
        )}

        {/* Game */}
        {gameState.phase !== 'lobby' && (
          <section className="py-16 px-6">
            <GameBoard
              gameState={gameState}
              thinkingPlayerId={thinkingPlayerId}
              voteCounts={voteCounts}
            />

            <AnimatePresence mode="wait">
              {gameState.phase === 'clue-round' && isHumanTurn && humanPlayer && (
                <motion.div
                  key="clue-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mt-16"
                >
                  <ClueInput
                    onSubmit={handleHumanClue}
                    secretWord={gameState.secretWord}
                    isImpostor={humanPlayer.isImpostor}
                    disabled={isProcessing}
                  />
                </motion.div>
              )}

              {gameState.phase === 'clue-round' && !isHumanTurn && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-16 text-center"
                >
                  <p className="text-gray-400 text-[15px]">Waiting for {currentPlayer?.name}...</p>
                </motion.div>
              )}

              {gameState.phase === 'discussion' && isProcessing && (
                <motion.div
                  key="discussion-waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-16 text-center"
                >
                  <p className="text-gray-400 text-[15px]">The players are discussing...</p>
                </motion.div>
              )}

              {gameState.phase === 'voting' && humanPlayer && (
                <motion.div
                  key="voting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mt-16"
                >
                  <VotingPanel
                    players={gameState.players}
                    clues={gameState.clues}
                    currentPlayerId={humanPlayer.id}
                    onVote={handleHumanVote}
                    hasVoted={hasPlayerVoted(gameState, humanPlayer.id)}
                    disabled={isProcessing}
                  />
                </motion.div>
              )}

              {gameState.phase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-16 text-center"
                >
                  <p className="text-gray-800 text-[17px] font-medium">Revealing results...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        <ResultsModal
          isOpen={showResults}
          winner={gameState.winner}
          players={gameState.players}
          votes={gameState.votes}
          secretWord={gameState.secretWord}
          humanIsImpostor={humanPlayer?.isImpostor || false}
          onPlayAgain={handleStartGame}
        />
      </main>
    </div>
  );
}
