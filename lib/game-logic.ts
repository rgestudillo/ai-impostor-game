import {
  GameState,
  Player,
  Clue,
  Vote,
  DiscussionMessage,
  AI_PLAYERS,
  HUMAN_PLAYER,
} from '@/types/game';
import { getRandomWord } from './word-list';

export const TOTAL_ROUNDS = 3;

export function createInitialGameState(): GameState {
  return {
    phase: 'lobby',
    players: [],
    secretWord: null,
    currentRound: 1,
    totalRounds: TOTAL_ROUNDS,
    clues: [],
    votes: [],
    discussion: [],
    currentPlayerIndex: 0,
    winner: null,
    revealedImpostorId: null,
  };
}

export function setupGame(state: GameState): GameState {
  // Create all players
  const allPlayers: Player[] = [
    { ...HUMAN_PLAYER, isImpostor: false, isEliminated: false },
    ...AI_PLAYERS.map(p => ({ ...p, isImpostor: false, isEliminated: false })),
  ];

  // Randomly select impostor
  const impostorIndex = Math.floor(Math.random() * allPlayers.length);
  allPlayers[impostorIndex].isImpostor = true;

  // Shuffle player order for turn-taking (but keep human player visible)
  const shuffledPlayers = shuffleArray([...allPlayers]);

  return {
    ...state,
    phase: 'setup',
    players: shuffledPlayers,
    secretWord: getRandomWord(),
    currentRound: 1,
    clues: [],
    votes: [],
    discussion: [],
    currentPlayerIndex: 0,
    winner: null,
    revealedImpostorId: null,
  };
}

export function startClueRound(state: GameState): GameState {
  return {
    ...state,
    phase: 'clue-round',
    currentPlayerIndex: 0,
  };
}

export function addClue(state: GameState, playerId: string, word: string): GameState {
  const newClue: Clue = {
    playerId,
    word: word.toLowerCase().trim(),
    round: state.currentRound,
    timestamp: Date.now(),
  };

  const newClues = [...state.clues, newClue];
  const nextPlayerIndex = state.currentPlayerIndex + 1;

  // Check if all players have given clues this round
  if (nextPlayerIndex >= state.players.length) {
    // Check if all rounds are complete
    if (state.currentRound >= state.totalRounds) {
      return {
        ...state,
        clues: newClues,
        phase: 'discussion',
        currentPlayerIndex: 0,
      };
    }
    // Move to next round
    return {
      ...state,
      clues: newClues,
      currentRound: state.currentRound + 1,
      currentPlayerIndex: 0,
    };
  }

  return {
    ...state,
    clues: newClues,
    currentPlayerIndex: nextPlayerIndex,
  };
}

export function addDiscussionMessage(
  state: GameState,
  playerId: string,
  message: string
): GameState {
  const newMessage: DiscussionMessage = {
    playerId,
    message,
    timestamp: Date.now(),
  };

  return {
    ...state,
    discussion: [...state.discussion, newMessage],
  };
}

export function startVoting(state: GameState): GameState {
  return {
    ...state,
    phase: 'voting',
    votes: [],
  };
}

export function addVote(state: GameState, voterId: string, suspectId: string): GameState {
  const newVote: Vote = { voterId, suspectId };
  const newVotes = [...state.votes.filter(v => v.voterId !== voterId), newVote];

  // Check if all players have voted
  if (newVotes.length >= state.players.length) {
    return {
      ...state,
      votes: newVotes,
      phase: 'reveal',
    };
  }

  return {
    ...state,
    votes: newVotes,
  };
}

export function revealResults(state: GameState): GameState {
  // Count votes
  const voteCounts = new Map<string, number>();
  state.votes.forEach(vote => {
    voteCounts.set(vote.suspectId, (voteCounts.get(vote.suspectId) || 0) + 1);
  });

  // Find most voted player
  let maxVotes = 0;
  let mostVotedId: string | null = null;
  voteCounts.forEach((count, playerId) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVotedId = playerId;
    }
  });

  // Check if impostor was caught
  const impostor = state.players.find(p => p.isImpostor);
  const impostorCaught = mostVotedId === impostor?.id;

  return {
    ...state,
    phase: 'results',
    winner: impostorCaught ? 'crew' : 'impostor',
    revealedImpostorId: impostor?.id || null,
  };
}

export function getCurrentPlayer(state: GameState): Player | null {
  return state.players[state.currentPlayerIndex] || null;
}

export function getImpostor(state: GameState): Player | null {
  return state.players.find(p => p.isImpostor) || null;
}

export function getCluesForRound(state: GameState, round: number): Clue[] {
  return state.clues.filter(c => c.round === round);
}

export function getCluesForPlayer(state: GameState, playerId: string): Clue[] {
  return state.clues.filter(c => c.playerId === playerId);
}

export function getVoteResults(state: GameState): Map<string, number> {
  const results = new Map<string, number>();
  state.players.forEach(p => results.set(p.id, 0));
  state.votes.forEach(vote => {
    results.set(vote.suspectId, (results.get(vote.suspectId) || 0) + 1);
  });
  return results;
}

export function hasPlayerVoted(state: GameState, playerId: string): boolean {
  return state.votes.some(v => v.voterId === playerId);
}

export function hasPlayerGivenClue(state: GameState, playerId: string, round: number): boolean {
  return state.clues.some(c => c.playerId === playerId && c.round === round);
}

// Utility functions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
