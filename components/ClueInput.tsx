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
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto text-center"
    >
      {/* Secret word or impostor */}
      {!isImpostor && secretWord ? (
        <div className="mb-8">
          <p className="text-neutral-400 text-sm mb-1">The secret word is</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-semibold text-black tracking-tight"
          >
            {secretWord}
          </motion.p>
        </div>
      ) : (
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-3 py-1 bg-black text-white rounded-full text-sm font-medium mb-2"
          >
            You are the Impostor
          </motion.div>
          <p className="text-neutral-500 text-sm">
            Blend in. Watch the clues.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={clue}
          onChange={(e) => {
            setClue(e.target.value);
            setError(null);
          }}
          placeholder="Enter your clue"
          disabled={disabled}
          className={`w-full px-5 py-3.5 bg-neutral-100 border ${
            error ? 'border-black' : 'border-transparent'
          } rounded-xl text-black text-base text-center placeholder-neutral-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50`}
          maxLength={20}
          autoComplete="off"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-black text-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={disabled || !clue.trim()}
          className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit
        </motion.button>

        <p className="text-neutral-400 text-sm">
          One word that hints at the secret
        </p>
      </form>
    </motion.div>
  );
}
