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
import { Sparkles } from 'lucide-react';

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

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

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

  // Handle AI turns automatically
  const processAITurn = useCallback(async () => {
    if (isProcessing) return;
    
    const player = getCurrentPlayer(gameState);
    if (!player || player.type === 'human') return;

    setIsProcessing(true);
    setThinkingPlayerId(player.id);

    try {
      // Add a small delay for visual effect
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
      // Fallback clue if AI fails
      const fallbackClues = ['thing', 'object', 'item', 'stuff', 'something'];
      const fallback = fallbackClues[Math.floor(Math.random() * fallbackClues.length)];
      setGameState(prev => addClue(prev, player.id, fallback));
    } finally {
      setThinkingPlayerId(null);
      setIsProcessing(false);
    }
  }, [gameState, isProcessing]);

  // Process AI discussion
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
          addDiscussionMessage(prev, player.id, "Hmm, I'm not sure who to suspect...")
        );
      }
    }

    setThinkingPlayerId(null);
    setIsProcessing(false);
    
    // Move to voting after discussion
    setTimeout(() => {
      setGameState(prev => startVoting(prev));
    }, 1500);
  }, [gameState, isProcessing]);

  // Process AI voting
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

        // Find the player by name
        const votedPlayer = gameState.players.find(
          p => p.name.toLowerCase() === votedName.toLowerCase() && p.id !== player.id
        );

        if (votedPlayer) {
          setGameState(prev => addVote(prev, player.id, votedPlayer.id));
        } else {
          // Fallback: vote for random other player
          const otherPlayers = gameState.players.filter(p => p.id !== player.id);
          const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
          setGameState(prev => addVote(prev, player.id, randomPlayer.id));
        }
      } catch (error) {
        console.error('AI vote error:', error);
        // Fallback vote
        const otherPlayers = gameState.players.filter(p => p.id !== player.id);
        const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        setGameState(prev => addVote(prev, player.id, randomPlayer.id));
      }
    }

    setThinkingPlayerId(null);
    setIsProcessing(false);
  }, [gameState, isProcessing]);

  // Auto-process AI turns during clue round
  useEffect(() => {
    if (gameState.phase === 'clue-round' && !isHumanTurn && !isProcessing) {
      processAITurn();
    }
  }, [gameState.phase, gameState.currentPlayerIndex, isHumanTurn, isProcessing, processAITurn]);

  // Auto-process discussion phase
  useEffect(() => {
    if (gameState.phase === 'discussion' && gameState.discussion.length === 0 && !isProcessing) {
      processAIDiscussion();
    }
  }, [gameState.phase, gameState.discussion.length, isProcessing, processAIDiscussion]);

  // Auto-process AI voting
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

  // Check for reveal phase
  useEffect(() => {
    if (gameState.phase === 'reveal') {
      setTimeout(() => {
        setGameState(prev => revealResults(prev));
      }, 1000);
    }
  }, [gameState.phase]);

  // Show results modal
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">AI Impostor</h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-400">
            Can you spot the AI that&apos;s bluffing?
          </p>
        </motion.header>

        {/* Game controls for lobby */}
        {gameState.phase === 'lobby' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <GameControls
              onStartGame={handleStartGame}
              onResetGame={handleResetGame}
              isGameInProgress={false}
            />
          </motion.div>
        )}

        {/* Game in progress */}
        {gameState.phase !== 'lobby' && (
          <>
            {/* Game board */}
            <GameBoard
              gameState={gameState}
              thinkingPlayerId={thinkingPlayerId}
              voteCounts={voteCounts}
            />

            {/* Human input area */}
            <AnimatePresence mode="wait">
              {/* Clue input */}
              {gameState.phase === 'clue-round' && isHumanTurn && humanPlayer && (
                <motion.div
                  key="clue-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
                >
                  <ClueInput
                    onSubmit={handleHumanClue}
                    secretWord={gameState.secretWord}
                    isImpostor={humanPlayer.isImpostor}
                    disabled={isProcessing}
                  />
                </motion.div>
              )}

              {/* Waiting message during AI turn */}
              {gameState.phase === 'clue-round' && !isHumanTurn && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 text-center"
                >
                  <p className="text-gray-400">
                    Waiting for {currentPlayer?.name} to give a clue...
                  </p>
                </motion.div>
              )}

              {/* Discussion waiting */}
              {gameState.phase === 'discussion' && isProcessing && (
                <motion.div
                  key="discussion-waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 text-center"
                >
                  <p className="text-gray-400">
                    The AIs are discussing their suspicions...
                  </p>
                </motion.div>
              )}

              {/* Voting panel */}
              {gameState.phase === 'voting' && humanPlayer && (
                <motion.div
                  key="voting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
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

              {/* Reveal phase */}
              {gameState.phase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 text-center"
                >
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-white text-xl font-bold"
                  >
                    Revealing the impostor...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset button */}
            <div className="mt-8 text-center">
              <GameControls
                onStartGame={handleStartGame}
                onResetGame={handleResetGame}
                isGameInProgress={true}
              />
            </div>
          </>
        )}

        {/* Results modal */}
        <ResultsModal
          isOpen={showResults}
          winner={gameState.winner}
          players={gameState.players}
          votes={gameState.votes}
          secretWord={gameState.secretWord}
          humanIsImpostor={humanPlayer?.isImpostor || false}
          onPlayAgain={handleStartGame}
        />
      </div>
    </div>
  );
}
