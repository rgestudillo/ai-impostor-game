export interface WordCategory {
  name: string;
  words: string[];
}

export const WORD_CATEGORIES: WordCategory[] = [
  {
    name: 'Animals',
    words: ['elephant', 'penguin', 'dolphin', 'butterfly', 'octopus', 'kangaroo', 'peacock', 'chameleon'],
  },
  {
    name: 'Food',
    words: ['pizza', 'sushi', 'chocolate', 'pancake', 'hamburger', 'avocado', 'croissant', 'spaghetti'],
  },
  {
    name: 'Places',
    words: ['beach', 'mountain', 'castle', 'library', 'museum', 'airport', 'stadium', 'lighthouse'],
  },
  {
    name: 'Objects',
    words: ['umbrella', 'telescope', 'compass', 'hourglass', 'chandelier', 'keyboard', 'microscope', 'parachute'],
  },
  {
    name: 'Nature',
    words: ['volcano', 'rainbow', 'waterfall', 'tornado', 'glacier', 'aurora', 'earthquake', 'lightning'],
  },
  {
    name: 'Transportation',
    words: ['submarine', 'helicopter', 'skateboard', 'motorcycle', 'sailboat', 'spaceship', 'gondola', 'locomotive'],
  },
  {
    name: 'Professions',
    words: ['astronaut', 'detective', 'magician', 'architect', 'scientist', 'firefighter', 'chef', 'pilot'],
  },
  {
    name: 'Entertainment',
    words: ['concert', 'carnival', 'karaoke', 'fireworks', 'circus', 'orchestra', 'festival', 'theater'],
  },
];

export const ALL_WORDS = WORD_CATEGORIES.flatMap(category => category.words);

export function getRandomWord(): string {
  return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
}

export function getRandomWordFromCategory(categoryName: string): string | null {
  const category = WORD_CATEGORIES.find(c => c.name === categoryName);
  if (!category) return null;
  return category.words[Math.floor(Math.random() * category.words.length)];
}

export function getWordCategory(word: string): string | null {
  const category = WORD_CATEGORIES.find(c => c.words.includes(word));
  return category?.name || null;
}
