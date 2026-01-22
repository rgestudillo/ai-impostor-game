export type GamePhase = 
  | 'lobby'
  | 'setup'
  | 'clue-round'
  | 'discussion'
  | 'voting'
  | 'reveal'
  | 'results';

export type PlayerType = 'human' | 'ai';

export type PlayerPersonality = 'analytical' | 'creative' | 'cautious';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  personality?: PlayerPersonality;
  avatar: string;
  isImpostor: boolean;
  isEliminated: boolean;
}

export interface Clue {
  playerId: string;
  word: string;
  round: number;
  timestamp: number;
}

export interface Vote {
  voterId: string;
  suspectId: string;
}

export interface DiscussionMessage {
  playerId: string;
  message: string;
  timestamp: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  secretWord: string | null;
  currentRound: number;
  totalRounds: number;
  clues: Clue[];
  votes: Vote[];
  discussion: DiscussionMessage[];
  currentPlayerIndex: number;
  winner: 'impostor' | 'crew' | null;
  revealedImpostorId: string | null;
}

export interface AIResponse {
  clue?: string;
  discussion?: string;
  vote?: string;
}

export const PLAYER_COLORS = {
  human: 'from-blue-500 to-blue-600',
  alex: 'from-purple-500 to-purple-600',
  bailey: 'from-emerald-500 to-emerald-600',
  casey: 'from-orange-500 to-orange-600',
} as const;

export const AI_PLAYERS: Omit<Player, 'isImpostor' | 'isEliminated'>[] = [
  {
    id: 'alex',
    name: 'Alex',
    type: 'ai',
    personality: 'analytical',
    avatar: '🤖',
  },
  {
    id: 'bailey',
    name: 'Bailey',
    type: 'ai',
    personality: 'creative',
    avatar: '🎭',
  },
  {
    id: 'casey',
    name: 'Casey',
    type: 'ai',
    personality: 'cautious',
    avatar: '🦊',
  },
];

export const HUMAN_PLAYER: Omit<Player, 'isImpostor' | 'isEliminated'> = {
  id: 'human',
  name: 'You',
  type: 'human',
  avatar: '👤',
};
