import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildCluePrompt,
  buildImpostorCluePrompt,
  buildDiscussionPrompt,
  buildVotePrompt,
} from '@/lib/ai-prompts';
import { Player, Clue } from '@/types/game';

export const runtime = 'edge';

type ActionType = 'clue' | 'discussion' | 'vote';

interface AIRequestBody {
  action: ActionType;
  player: Player;
  secretWord: string | null;
  previousClues: Clue[];
  currentRound: number;
  allPlayers: Player[];
  discussion?: { playerId: string; message: string }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequestBody = await request.json();
    const {
      action,
      player,
      secretWord,
      previousClues,
      currentRound,
      allPlayers,
      discussion = [],
    } = body;

    let prompt: string;

    switch (action) {
      case 'clue':
        if (player.isImpostor) {
          prompt = buildImpostorCluePrompt(
            player,
            previousClues,
            currentRound,
            allPlayers
          );
        } else {
          prompt = buildCluePrompt(
            player,
            secretWord!,
            previousClues,
            currentRound,
            allPlayers
          );
        }
        break;

      case 'discussion':
        prompt = buildDiscussionPrompt(
          player,
          player.isImpostor,
          secretWord,
          previousClues,
          allPlayers,
          discussion
        );
        break;

      case 'vote':
        prompt = buildVotePrompt(
          player,
          player.isImpostor,
          secretWord,
          previousClues,
          allPlayers,
          discussion
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action type' },
          { status: 400 }
        );
    }

    // Use more tokens for discussion, fewer for clues/votes
    const maxTokens = action === 'discussion' ? 200 : 50;

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt,
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    });

    // Clean up the response based on action type
    let cleanedText: string;
    if (action === 'clue' || action === 'vote') {
      // For clues and votes, just get the first word/name
      cleanedText = text.trim().split('\n')[0].split(' ')[0].trim();
    } else {
      // For discussion, keep the full response (just trim whitespace)
      cleanedText = text.trim();
    }

    // Log for debugging
    console.log(`\n=== AI Response (${action}) ===`);
    console.log(`Player: ${player.name} (${player.isImpostor ? 'IMPOSTOR' : 'crew'})`);
    console.log(`Prompt: ${prompt}`);
    console.log(`Raw response: "${text}"`);
    console.log(`Cleaned response: "${cleanedText}"`);
    console.log(`===============================\n`);

    return NextResponse.json({ response: cleanedText });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
