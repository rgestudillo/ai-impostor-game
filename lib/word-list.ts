export interface WordCategory {
  name: string;
  words: string[];
}

export const WORD_CATEGORIES: WordCategory[] = [
  {
    name: 'Animals',
    words: ['elephant', 'penguin', 'dolphin', 'butterfly', 'octopus', 'kangaroo', 'peacock', 'chameleon', 'giraffe', 'flamingo', 'hedgehog', 'cheetah', 'porcupine', 'platypus', 'armadillo', 'jellyfish', 'hummingbird', 'crocodile', 'rhinoceros', 'sloth', 'dog', 'cat', 'horse', 'rabbit', 'lion', 'tiger', 'bear', 'monkey', 'snake', 'fish', 'bird', 'cow', 'pig', 'sheep', 'chicken', 'duck', 'frog', 'turtle', 'mouse', 'squirrel'],
  },
  {
    name: 'Food',
    words: ['pizza', 'sushi', 'chocolate', 'pancake', 'hamburger', 'avocado', 'croissant', 'spaghetti', 'burrito', 'cheesecake', 'pretzel', 'lasagna', 'dumpling', 'waffle', 'tiramisu', 'quesadilla', 'bruschetta', 'macaroni', 'omelette', 'smoothie', 'apple', 'banana', 'orange', 'bread', 'cheese', 'egg', 'rice', 'soup', 'salad', 'sandwich', 'cookie', 'cake', 'ice cream', 'popcorn', 'hotdog', 'taco', 'noodles', 'steak', 'chicken', 'coffee'],
  },
  {
    name: 'Places',
    words: ['beach', 'mountain', 'castle', 'library', 'museum', 'airport', 'stadium', 'lighthouse', 'temple', 'aquarium', 'skyscraper', 'vineyard', 'canyon', 'pyramid', 'waterpark', 'observatory', 'greenhouse', 'monastery', 'bazaar', 'planetarium', 'school', 'hospital', 'park', 'store', 'restaurant', 'hotel', 'church', 'office', 'farm', 'zoo', 'mall', 'gym', 'bank', 'bakery', 'cinema', 'garden', 'kitchen', 'bedroom', 'bathroom', 'garage'],
  },
  {
    name: 'Objects',
    words: ['umbrella', 'telescope', 'compass', 'hourglass', 'chandelier', 'keyboard', 'microscope', 'parachute', 'trampoline', 'kaleidoscope', 'harmonica', 'typewriter', 'binoculars', 'thermometer', 'accordion', 'metronome', 'snowglobe', 'boomerang', 'dreamcatcher', 'lantern', 'phone', 'book', 'chair', 'table', 'lamp', 'clock', 'mirror', 'pillow', 'blanket', 'towel', 'cup', 'plate', 'fork', 'spoon', 'knife', 'key', 'door', 'window', 'bottle', 'bag'],
  },
  {
    name: 'Nature',
    words: ['volcano', 'rainbow', 'waterfall', 'tornado', 'glacier', 'aurora', 'earthquake', 'lightning', 'avalanche', 'geyser', 'monsoon', 'eclipse', 'blizzard', 'sunrise', 'constellation', 'thunderstorm', 'quicksand', 'stalactite', 'whirlpool', 'sandstorm', 'tree', 'flower', 'grass', 'river', 'lake', 'ocean', 'forest', 'desert', 'island', 'hill', 'rock', 'sand', 'cloud', 'sun', 'moon', 'star', 'rain', 'snow', 'wind', 'leaf'],
  },
  {
    name: 'Transportation',
    words: ['submarine', 'helicopter', 'skateboard', 'motorcycle', 'sailboat', 'spaceship', 'gondola', 'locomotive', 'hovercraft', 'ambulance', 'rickshaw', 'scooter', 'trolley', 'kayak', 'zeppelin', 'monorail', 'segway', 'catamaran', 'bulldozer', 'firetruck', 'car', 'bus', 'train', 'plane', 'boat', 'bike', 'truck', 'taxi', 'van', 'bicycle', 'ship', 'ferry', 'tractor', 'rocket', 'canoe'],
  },
  {
    name: 'Professions',
    words: ['astronaut', 'detective', 'magician', 'architect', 'scientist', 'firefighter', 'chef', 'pilot', 'veterinarian', 'archaeologist', 'journalist', 'surgeon', 'lifeguard', 'pharmacist', 'electrician', 'librarian', 'diplomat', 'choreographer', 'blacksmith', 'cartographer', 'doctor', 'teacher', 'nurse', 'police', 'farmer', 'driver', 'artist', 'singer', 'dancer', 'actor', 'writer', 'lawyer', 'dentist', 'baker', 'plumber', 'waiter', 'barber', 'coach', 'soldier', 'photographer'],
  },
  {
    name: 'Entertainment',
    words: ['concert', 'carnival', 'karaoke', 'fireworks', 'circus', 'orchestra', 'festival', 'theater', 'rollercoaster', 'puppetshow', 'videogame', 'masquerade', 'magicshow', 'parade', 'ballet', 'acrobatics', 'standup', 'haunted', 'talent', 'gameshow', 'movie', 'party', 'dancing', 'singing', 'camping', 'picnic', 'birthday', 'wedding', 'vacation', 'holiday'],
  },
  {
    name: 'Sports',
    words: ['basketball', 'surfing', 'archery', 'wrestling', 'gymnastics', 'snowboarding', 'volleyball', 'fencing', 'badminton', 'bowling', 'marathon', 'skateboarding', 'karate', 'lacrosse', 'rowing', 'soccer', 'football', 'baseball', 'tennis', 'golf', 'swimming', 'running', 'boxing', 'hockey', 'skiing', 'cycling', 'climbing', 'fishing', 'hiking', 'yoga'],
  },
  {
    name: 'Mythology',
    words: ['dragon', 'unicorn', 'phoenix', 'mermaid', 'centaur', 'griffin', 'werewolf', 'kraken', 'minotaur', 'pegasus', 'cyclops', 'sphinx', 'leprechaun', 'vampire', 'yeti', 'fairy', 'wizard', 'witch', 'ghost', 'zombie', 'giant', 'elf', 'goblin', 'troll', 'angel'],
  },
  {
    name: 'Weather',
    words: ['hurricane', 'drizzle', 'heatwave', 'foggy', 'sleet', 'hailstorm', 'frosty', 'overcast', 'muggy', 'breeze', 'downpour', 'sunshine', 'misty', 'cloudburst', 'windchill', 'rainy', 'sunny', 'cloudy', 'stormy', 'snowy', 'windy', 'cold', 'hot', 'warm', 'humid'],
  },
  {
    name: 'Music',
    words: ['guitar', 'saxophone', 'violin', 'drums', 'piano', 'trumpet', 'flute', 'ukulele', 'cello', 'xylophone', 'bagpipes', 'banjo', 'clarinet', 'tambourine', 'synthesizer', 'harp', 'bell', 'whistle', 'microphone', 'speaker'],
  },
  {
    name: 'Clothing',
    words: ['shirt', 'pants', 'dress', 'shoes', 'hat', 'jacket', 'socks', 'gloves', 'scarf', 'belt', 'tie', 'sweater', 'jeans', 'boots', 'sandals', 'coat', 'shorts', 'skirt', 'hoodie', 'pajamas', 'uniform', 'swimsuit', 'glasses', 'watch', 'ring'],
  },
  {
    name: 'Body Parts',
    words: ['hand', 'foot', 'head', 'eye', 'ear', 'nose', 'mouth', 'arm', 'leg', 'finger', 'toe', 'knee', 'elbow', 'shoulder', 'neck', 'back', 'stomach', 'heart', 'brain', 'teeth'],
  },
  {
    name: 'Household',
    words: ['bed', 'sofa', 'television', 'refrigerator', 'stove', 'microwave', 'dishwasher', 'washing machine', 'vacuum', 'toaster', 'blender', 'fan', 'heater', 'shower', 'bathtub', 'toilet', 'sink', 'oven', 'closet', 'drawer', 'shelf', 'carpet', 'curtain', 'doorbell', 'stairs'],
  },
  {
    name: 'School',
    words: ['pencil', 'pen', 'paper', 'notebook', 'backpack', 'desk', 'chalkboard', 'eraser', 'ruler', 'scissors', 'glue', 'crayon', 'marker', 'calculator', 'globe', 'homework', 'exam', 'teacher', 'student', 'classroom'],
  },
  {
    name: 'Toys and Games',
    words: ['ball', 'doll', 'puzzle', 'blocks', 'kite', 'balloon', 'swing', 'slide', 'seesaw', 'teddy bear', 'robot', 'cards', 'dice', 'chess', 'checkers', 'lego', 'frisbee', 'yoyo', 'jump rope', 'board game'],
  },
  {
    name: 'Colors and Shapes',
    words: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'circle', 'square', 'triangle', 'rectangle', 'star', 'diamond', 'oval', 'cube', 'sphere', 'pyramid'],
  },
  {
    name: 'Emotions',
    words: ['happy', 'sad', 'angry', 'scared', 'surprised', 'excited', 'tired', 'hungry', 'nervous', 'proud', 'lonely', 'confused', 'bored', 'jealous', 'grateful', 'embarrassed', 'hopeful', 'curious', 'silly', 'brave'],
  },
  {
    name: 'Actions',
    words: ['running', 'jumping', 'sleeping', 'eating', 'drinking', 'reading', 'writing', 'talking', 'laughing', 'crying', 'walking', 'sitting', 'standing', 'dancing', 'singing', 'cooking', 'cleaning', 'driving', 'flying', 'swimming'],
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
