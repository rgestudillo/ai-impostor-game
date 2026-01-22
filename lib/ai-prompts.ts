import { Player, Clue, PlayerPersonality } from '@/types/game';

const PERSONALITY_TRAITS: Record<PlayerPersonality, string> = {
  analytical: `You are analytical and logical. You give precise, calculated clues that directly relate to the word. You speak in a methodical way and focus on facts.`,
  creative: `You are creative and artistic. You give abstract, poetic clues that capture the essence or feeling of the word. You think outside the box and use metaphors.`,
  cautious: `You are cautious and careful. You give safe, common clues that are clearly related but not too revealing. You avoid risks and prefer familiar associations.`,
};

export function buildCluePrompt(
  player: Player,
  secretWord: string,
  previousClues: Clue[],
  currentRound: number,
  allPlayers: Player[]
): string {
  const personality = player.personality ? PERSONALITY_TRAITS[player.personality] : '';
  const prevCluesText = previousClues.length > 0
    ? `Previous clues given by all players:\n${previousClues.map(c => {
        const cluePlayer = allPlayers.find(p => p.id === c.playerId);
        return `- ${cluePlayer?.name || 'Unknown'} (Round ${c.round}): "${c.word}"`;
      }).join('\n')}`
    : 'No clues have been given yet.';

  return `You are playing an Impostor word game. Your name is ${player.name}.

${personality}

THE SECRET WORD IS: "${secretWord}"

You must give a ONE-WORD clue that hints at this secret word. The clue should:
- Be exactly ONE word (no phrases, no punctuation, no spaces)
- Help other non-impostor players recognize you know the word
- Not be too obvious (don't say the word itself or a direct synonym)
- Be different from clues already given

This is Round ${currentRound} of 3.

${prevCluesText}

IMPORTANT RULES:
- Respond with ONLY the one-word clue, nothing else
- Do not explain your reasoning
- Do not use the secret word itself
- Make it subtle but recognizable to those who know the word

Your one-word clue:`;
}

export function buildImpostorCluePrompt(
  player: Player,
  previousClues: Clue[],
  currentRound: number,
  allPlayers: Player[]
): string {
  const personality = player.personality ? PERSONALITY_TRAITS[player.personality] : '';
  const prevCluesText = previousClues.length > 0
    ? `Previous clues given by all players:\n${previousClues.map(c => {
        const cluePlayer = allPlayers.find(p => p.id === c.playerId);
        return `- ${cluePlayer?.name || 'Unknown'} (Round ${c.round}): "${c.word}"`;
      }).join('\n')}`
    : 'No clues have been given yet.';

  return `You are the IMPOSTOR in an Impostor word game. Your name is ${player.name}.

${personality}

YOU DO NOT KNOW THE SECRET WORD!

Your goal is to BLEND IN by giving a clue that seems related to whatever the other players are hinting at. You must analyze their clues and make an educated guess about the theme.

This is Round ${currentRound} of 3.

${prevCluesText}

STRATEGY:
- Study the previous clues carefully to identify possible themes
- Give a generic but plausible clue that could fit multiple interpretations
- Don't be too specific (you might guess wrong) or too vague (you'll stand out)
- Act confident like you know the word

IMPORTANT RULES:
- Respond with ONLY the one-word clue, nothing else
- Do not explain your reasoning
- Do not reveal that you are the impostor
- Make it believable

Your one-word clue:`;
}

export function buildDiscussionPrompt(
  player: Player,
  isImpostor: boolean,
  secretWord: string | null,
  allClues: Clue[],
  allPlayers: Player[],
  previousDiscussion: { playerId: string; message: string }[]
): string {
  const personality = player.personality ? PERSONALITY_TRAITS[player.personality] : '';
  
  const cluesSummary = allClues.length > 0
    ? `All clues given:\n${allPlayers.map(p => {
        const playerClues = allClues.filter(c => c.playerId === p.id);
        return `- ${p.name}: ${playerClues.map(c => `"${c.word}"`).join(', ')}`;
      }).join('\n')}`
    : '';

  const discussionSummary = previousDiscussion.length > 0
    ? `Previous discussion:\n${previousDiscussion.map(d => {
        const speaker = allPlayers.find(p => p.id === d.playerId);
        return `${speaker?.name || 'Unknown'}: "${d.message}"`;
      }).join('\n')}`
    : '';

  if (isImpostor) {
    return `You are the IMPOSTOR in a word game discussion. Your name is ${player.name}.

${personality}

YOU DO NOT KNOW THE SECRET WORD. You must deflect suspicion and possibly cast doubt on others.

${cluesSummary}

${discussionSummary}

Give a brief discussion comment (1-2 sentences) that:
- Makes you seem like you know the word
- Possibly casts subtle suspicion on someone else
- Doesn't reveal you're the impostor
- Sounds natural and conversational

Respond with ONLY your discussion comment, nothing else:`;
  }

  return `You are playing an Impostor word game discussion. Your name is ${player.name}.

${personality}

The secret word is: "${secretWord}"

${cluesSummary}

${discussionSummary}

Give a brief discussion comment (1-2 sentences) that:
- Shares your suspicion about who might be the impostor
- References the clues to support your reasoning
- Sounds natural and conversational
- Doesn't directly reveal the secret word

Respond with ONLY your discussion comment, nothing else:`;
}

export function buildVotePrompt(
  player: Player,
  isImpostor: boolean,
  secretWord: string | null,
  allClues: Clue[],
  allPlayers: Player[],
  discussion: { playerId: string; message: string }[]
): string {
  const otherPlayers = allPlayers.filter(p => p.id !== player.id);
  const playerList = otherPlayers.map(p => p.name).join(', ');
  
  const cluesSummary = allPlayers.map(p => {
    const playerClues = allClues.filter(c => c.playerId === p.id);
    return `- ${p.name}: ${playerClues.map(c => `"${c.word}"`).join(', ')}`;
  }).join('\n');

  const discussionSummary = discussion.length > 0
    ? `Discussion:\n${discussion.map(d => {
        const speaker = allPlayers.find(p => p.id === d.playerId);
        return `${speaker?.name}: "${d.message}"`;
      }).join('\n')}`
    : '';

  if (isImpostor) {
    return `You are the IMPOSTOR. Your name is ${player.name}. You must vote for someone else to deflect suspicion.

All clues:
${cluesSummary}

${discussionSummary}

You can vote for: ${playerList}

Vote for the player whose clues seem most suspicious or generic (to frame them).
Respond with ONLY the name of the player you're voting for (exactly as written above):`;
  }

  return `You are ${player.name}. The secret word was "${secretWord}". You must identify the impostor.

All clues:
${cluesSummary}

${discussionSummary}

You can vote for: ${playerList}

Analyze the clues. The impostor doesn't know the word, so their clues might be:
- Too generic or vague
- Slightly off-topic
- Copying others' themes without real connection

Respond with ONLY the name of the player you're voting for (exactly as written above):`;
}
