'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';

interface ClueInputProps {
  onSubmit: (clue: string) => void;
  disabled?: boolean;
  secretWord: string | null;
  isImpostor: boolean;
}

export default function ClueInput({
  onSubmit,
  disabled = false,
  secretWord,
  isImpostor,
}: ClueInputProps) {
  const [clue, setClue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateClue = (word: string): string | null => {
    if (!word.trim()) {
      return 'Please enter a clue';
    }
    if (word.includes(' ')) {
      return 'Clue must be a single word';
    }
    if (secretWord && word.toLowerCase() === secretWord.toLowerCase()) {
      return "You can't use the secret word!";
    }
    if (word.length > 20) {
      return 'Clue is too long';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateClue(clue);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(clue.trim().toLowerCase());
    setClue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Secret word display (only for non-impostors) */}
      {!isImpostor && secretWord && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-center"
        >
          <p className="text-emerald-100 text-sm mb-1">The secret word is:</p>
          <p className="text-white text-2xl font-bold uppercase tracking-wider">
            {secretWord}
          </p>
        </motion.div>
      )}

      {/* Impostor warning */}
      {isImpostor && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-center"
        >
          <p className="text-red-100 text-sm mb-1">You are the</p>
          <p className="text-white text-2xl font-bold uppercase tracking-wider">
            IMPOSTOR
          </p>
          <p className="text-red-100 text-xs mt-2">
            Blend in! Watch the others&apos; clues carefully.
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={clue}
            onChange={(e) => {
              setClue(e.target.value);
              setError(null);
            }}
            placeholder="Enter your one-word clue..."
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 border-2 ${
              error ? 'border-red-400' : 'border-gray-600'
            }`}
            style={{ backgroundColor: 'rgba(30, 27, 75, 0.9)' }}
            maxLength={20}
          />
          <button
            type="submit"
            disabled={disabled || !clue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.6)' }}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <p className="text-gray-400 text-xs text-center">
          Give a one-word clue that hints at the secret word without being too obvious
        </p>
      </form>
    </motion.div>
  );
}
