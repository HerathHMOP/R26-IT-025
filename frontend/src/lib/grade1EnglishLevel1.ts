const Q1 = "/level-test/english/grade-1/Level%201/Q1";
const Q2 = "/level-test/english/grade-1/Level%201/Q2";
const Q3 = "/level-test/english/grade-1/Level%201/Q3";
const Q4 = "/level-test/english/grade-1/Level%201/Q4";
const Q5 = "/level-test/english/grade-1/Level%201/Q5";

export type AnimalSoundItem = {
  id: number;
  key: string;
  label: string;
  /** Plays when the sound chip is selected. */
  audio?: string;
  /** Animal key this sound belongs to; omit for distractors. */
  targetAnimalKey?: string;
};

export type AnimalImageItem = {
  id: number;
  key: string;
  label: string;
  image: string;
};

export type HousePersonItem = {
  id: number;
  key: string;
  label: string;
  belongs: boolean;
  area: string;
};

export type WordMatchItem = {
  id: number;
  key: string;
  label: string;
  targetImageKey: string;
};

export type WordMatchImage = {
  id: number;
  key: string;
  label: string;
  image: string;
};

export type RelatedImageItem = {
  id: number;
  key: string;
  label: string;
  image: string;
  /** Right-side key this left item should match (left items only). */
  targetKey?: string;
};

export type SchoolItemOption = {
  id: number;
  key: string;
  label: string;
  image: string;
  needed: boolean;
};

/** Grade 1 English Level 1 Activity 1: match animal sounds to pictures. */
export const grade1EnglishLevel1Activity1 = {
  id: 1,
  type: "animal_sound_match" as const,
  title: "Match the animal to the sound",
  instruction: "Match the animal to the sound.",
  hint: "Listen and match the animal to that sound.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You matched every animal sound.",
  wrongLabel: "Not quite - try again",
  pointsPerCorrect: 1,
  backgroundTone: "yard" as const,
  sounds: [
    { id: 1, key: "bow", label: "Bow - Bow", audio: `${Q1}/Dog.wav`, targetAnimalKey: "dog" },
    { id: 2, key: "meow", label: "Meow - Meow", audio: `${Q1}/Cat.wav`, targetAnimalKey: "cat" },
    { id: 3, key: "buzz", label: "Buzz - Buzz" },
    { id: 4, key: "baa", label: "Baa - Baa", audio: `${Q1}/Goat.wav`, targetAnimalKey: "goat" },
    { id: 5, key: "cluck", label: "Cluck - Cluck" },
    { id: 6, key: "moo", label: "Moo - Moo", audio: `${Q1}/Cow.wav`, targetAnimalKey: "cow" }
  ] as AnimalSoundItem[],
  animals: [
    { id: 1, key: "cat", label: "Cat", image: `${Q1}/cat.png` },
    { id: 2, key: "dog", label: "Dog", image: `${Q1}/Dog.png` },
    { id: 3, key: "cow", label: "Cow", image: `${Q1}/Cow.png` },
    { id: 4, key: "goat", label: "Goat", image: `${Q1}/Goat.png` }
  ] as AnimalImageItem[]
};

/** Grade 1 English Level 1 Activity 2: people who live in a house. */
export const grade1EnglishLevel1Activity2 = {
  id: 2,
  type: "house_people_match" as const,
  title: "Find the people at home",
  instruction: "Choose the people who live in a house and connect them to the house.",
  hint: "Find and connect the people who stay in the house.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You found everyone who lives at home.",
  wrongLabel: "Not quite - try again",
  connectHint: "Tap each person who lives in the house. Leave out anyone who does not.",
  pointsPerCorrect: 1,
  houseImage: `${Q2}/House.png`,
  houseAlt: "House",
  people: [
    { id: 1, key: "grandmother", label: "Grandmother", belongs: true, area: "t1" },
    { id: 2, key: "elder-sister", label: "Elder Sister", belongs: true, area: "t2" },
    { id: 3, key: "younger-brother", label: "Younger Brother", belongs: true, area: "t3" },
    { id: 4, key: "daughter", label: "Daughter", belongs: true, area: "t4" },
    { id: 5, key: "father", label: "Father", belongs: true, area: "l1" },
    { id: 6, key: "elder-brother", label: "Elder Brother", belongs: true, area: "l2" },
    { id: 7, key: "mother", label: "Mother", belongs: true, area: "r1" },
    { id: 8, key: "principal", label: "Principal", belongs: false, area: "r2" },
    { id: 9, key: "uncle", label: "Uncle", belongs: true, area: "b1" },
    { id: 10, key: "younger-sister", label: "Younger Sister", belongs: true, area: "b2" },
    { id: 11, key: "aunt", label: "Aunt", belongs: true, area: "b3" },
    { id: 12, key: "grandfather", label: "Grandfather", belongs: true, area: "b4" }
  ] as HousePersonItem[]
};

/** Grade 1 English Level 1 Activity 3: match object words to pictures. */
export const grade1EnglishLevel1Activity3 = {
  id: 3,
  type: "word_image_match" as const,
  title: "Match the words",
  instruction: "Match each word to the correct picture.",
  hint: "Tap a word, then tap the matching picture.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You matched every word.",
  wrongLabel: "Not quite - try again",
  connectHint: "Draw a line from each word to its picture.",
  pointsPerCorrect: 1,
  words: [
    { id: 1, key: "bell", label: "Bell", targetImageKey: "bell" },
    { id: 2, key: "flower-pot", label: "Flower Pot", targetImageKey: "flower-pot" },
    { id: 3, key: "pencil", label: "Pencil", targetImageKey: "pencil" },
    { id: 4, key: "book", label: "Book", targetImageKey: "book" },
    { id: 5, key: "broom", label: "Broom", targetImageKey: "broom" }
  ] as WordMatchItem[],
  images: [
    { id: 1, key: "broom", label: "Broom", image: `${Q3}/Broom.png` },
    { id: 2, key: "bell", label: "Bell", image: `${Q3}/Bell.png` },
    { id: 3, key: "book", label: "Book", image: `${Q3}/Book.png` },
    { id: 4, key: "pencil", label: "Pencil", image: `${Q3}/Pencil.png` },
    { id: 5, key: "flower-pot", label: "Flower Pot", image: `${Q3}/Flower%20Pot.png` }
  ] as WordMatchImage[]
};

/** Grade 1 English Level 1 Activity 4: match related pictures. */
export const grade1EnglishLevel1Activity4 = {
  id: 4,
  type: "related_image_match" as const,
  title: "Match the related pictures",
  instruction: "Match each picture to the related picture.",
  hint: "Think about which things go together.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You matched every related pair.",
  wrongLabel: "Not quite - try again",
  connectHint: "Tap a picture on the left, then tap the matching picture on the right.",
  pointsPerCorrect: 1,
  leftItems: [
    { id: 1, key: "butterfly", label: "Butterfly", image: `${Q4}/Butterfly.png`, targetKey: "flower" },
    { id: 2, key: "pencil", label: "Pencil", image: `${Q4}/Pencil.png`, targetKey: "book" },
    { id: 3, key: "umbrella", label: "Umbrella", image: `${Q4}/Umbrella.png`, targetKey: "clouds" },
    { id: 4, key: "broom", label: "Broom", image: `${Q4}/Broom.png`, targetKey: "leaves" },
    { id: 5, key: "toothbrush", label: "Toothbrush", image: `${Q4}/Tooth%20Brush.png`, targetKey: "mouth" }
  ] as RelatedImageItem[],
  rightItems: [
    { id: 1, key: "leaves", label: "Leaves", image: `${Q4}/Leaves.png` },
    { id: 2, key: "mouth", label: "Mouth", image: `${Q4}/Mouth.png` },
    { id: 3, key: "book", label: "Book", image: `${Q4}/Book.png` },
    { id: 4, key: "flower", label: "Flower", image: `${Q4}/Flower.png` },
    { id: 5, key: "clouds", label: "Rain Cloud", image: `${Q4}/Clouds.png` }
  ] as RelatedImageItem[]
};


/** Grade 1 English Level 1 Activity 5: select items needed for school. */
export const grade1EnglishLevel1Activity5 = {
  id: 5,
  type: "school_items_select" as const,
  title: "Colour the things you need to go to school",
  instruction: "Colour the things you need to go to school.",
  hint: "Let's colour the things we need to go to school!",
  tip: "Tip: Click on the things you need to go to school and colour them!",
  checkLabel: "Done",
  resetLabel: "Reset",
  successMessage: "Great job! You picked everything needed for school.",
  wrongLabel: "Not quite - try again",
  pointsPerCorrect: 1,
  items: [
    { id: 1, key: "socks", label: "Socks", image: `${Q5}/Socks.png`, needed: true },
    { id: 2, key: "balloons", label: "Balloons", image: `${Q5}/Baloons.png`, needed: false },
    { id: 3, key: "bottle", label: "Water Bottle", image: `${Q5}/Bottle.png`, needed: true },
    { id: 4, key: "bucket", label: "Bucket", image: `${Q5}/Bucket.png`, needed: false },
    { id: 5, key: "bag", label: "Handbag", image: `${Q5}/Bag.png`, needed: false },
    { id: 6, key: "knife", label: "Knife", image: `${Q5}/Knife.png`, needed: false },
    { id: 7, key: "book", label: "Book", image: `${Q5}/Book.png`, needed: true },
    { id: 8, key: "pencil", label: "Pencil", image: `${Q5}/Pencil.png`, needed: true }
  ] as SchoolItemOption[]
};

export const grade1EnglishLevel1Ui = {
  levelTitle: "Level 1 - Recognize",
  questionPrefix: "Question",
  ofLabel: "of",
  scoreLabel: "Score",
  home: "Home",
  back: "Back",
  activityLabel: "Activity",
  listen: "Listen",
  complete: "Activity complete!",
  levelComplete: "Level 1 complete! Level 2 is unlocked.",
  lockedTitle: "Level locked",
  lockedBody: "Finish the Grade 1 English aptitude (or a previous level) to unlock this level.",
  startAptitude: "Start aptitude",
  backProfile: "Back to profile",
  connectHint: "Tap a sound, then tap the matching animal."
};

export const grade1EnglishLevel1Activities = [
  grade1EnglishLevel1Activity1,
  grade1EnglishLevel1Activity2,
  grade1EnglishLevel1Activity3,
  grade1EnglishLevel1Activity4,
  grade1EnglishLevel1Activity5
];