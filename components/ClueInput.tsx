'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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
    if (!word.trim()) return 'Enter a clue';
    if (word.includes(' ')) return 'One word only';
    if (secretWord && word.toLowerCase() === secretWord.toLowerCase()) return "Can't use the secret word";
    if (word.length > 20) return 'Too long';
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
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-md mx-auto text-center"
    >
      {/* Secret word display or impostor notice */}
      {!isImpostor && secretWord ? (
        <div className="mb-10">
          <p className="text-gray-400 text-[13px] font-medium mb-2">The secret word is</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[40px] font-semibold text-gray-900 tracking-tight"
          >
            {secretWord}
          </motion.p>
        </div>
      ) : (
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded-full text-[13px] font-semibold mb-3"
          >
            You are the Impostor
          </motion.div>
          <p className="text-gray-500 text-[15px]">
            Blend in with the others. Watch their clues.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={clue}
            onChange={(e) => {
              setClue(e.target.value);
              setError(null);
            }}
            placeholder="Enter your clue"
            disabled={disabled}
            className={`w-full px-6 py-4 bg-gray-50 border-2 ${
              error ? 'border-gray-900' : 'border-transparent'
            } rounded-2xl text-gray-900 text-[17px] text-center placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-200 disabled:opacity-50`}
            maxLength={20}
            autoComplete="off"
            autoFocus
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-900 text-[14px] font-medium"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={disabled || !clue.trim()}
          className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
        >
          Submit Clue
        </motion.button>

        <p className="text-gray-400 text-[13px] pt-2">
          Give a one-word hint about the secret word
        </p>
      </form>
    </motion.div>
  );
}
