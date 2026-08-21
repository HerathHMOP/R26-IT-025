const ACT1_IMG = "/level-test/english/grade-2/images/level%201/activity%201";
const ACT2_IMG = "/level-test/english/grade-2/images/level%201/activity%202";
const ACT3_IMG = "/level-test/english/grade-2/images/level%201/activity%203";
const ACT4_IMG = "/level-test/english/grade-2/images/level%201/activity%204";

export type AlphabetPicture = {
  key: string;
  label: string;
  image: string;
  /** Accepted spoken forms (lowercase). */
  sayAccept: string[];
};

export type AlphabetLetterCard = {
  letter: string;
  pictures: AlphabetPicture[];
};

export type FamilySayWhoStep = {
  key: string;
  label: string;
  portrait: string;
  /** Accepted spoken forms (lowercase), e.g. grandpa / grandfather. */
  sayAccept: string[];
};

export type AnimalSayNameStep = {
  key: string;
  label: string;
  image: string;
  sayAccept: string[];
};

export type SkySayWhatItem = {
  key: string;
  label: string;
  sayAccept: string[];
};

/**
 * Grade 2 English — Level 1 — Activity 1: Alphabet Picture Detective
 * Design listed F/M/B/P/T/W; folder has M/B/P/T/S/W images (S instead of F; W has one picture).
 */
export const grade2EnglishLevel1Activity1 = {
  id: 1,
  type: "alphabet_picture_detective" as const,
  title: "Alphabet Picture Detective",
  prompt: "Look at the letter. Look at the two pictures. Say the name of each picture aloud.",
  letters: [
    {
      letter: "M",
      pictures: [
        { key: "mango", label: "Mango", image: `${ACT1_IMG}/mango.jpeg`, sayAccept: ["mango"] },
        { key: "monkey", label: "Monkey", image: `${ACT1_IMG}/monkey.jpeg`, sayAccept: ["monkey"] }
      ]
    },
    {
      letter: "B",
      pictures: [
        { key: "ball", label: "Ball", image: `${ACT1_IMG}/ball.jpeg`, sayAccept: ["ball"] },
        { key: "bus", label: "Bus", image: `${ACT1_IMG}/bus.jpeg`, sayAccept: ["bus"] }
      ]
    },
    {
      letter: "P",
      pictures: [
        { key: "parrot", label: "Parrot", image: `${ACT1_IMG}/parrot.jpeg`, sayAccept: ["parrot"] },
        { key: "pencil", label: "Pencil", image: `${ACT1_IMG}/pencil.jpeg`, sayAccept: ["pencil"] }
      ]
    },
    {
      letter: "T",
      pictures: [
        { key: "tiger", label: "Tiger", image: `${ACT1_IMG}/tiger.jpeg`, sayAccept: ["tiger"] },
        { key: "train", label: "Train", image: `${ACT1_IMG}/train.jpeg`, sayAccept: ["train"] }
      ]
    },
    {
      letter: "S",
      pictures: [
        { key: "snake", label: "Snake", image: `${ACT1_IMG}/snake.jpeg`, sayAccept: ["snake"] },
        { key: "sun", label: "Sun", image: `${ACT1_IMG}/sun.jpeg`, sayAccept: ["sun"] }
      ]
    },
    {
      letter: "W",
      pictures: [
        { key: "watch", label: "Watch", image: `${ACT1_IMG}/watch.jpeg`, sayAccept: ["watch"] }
      ]
    }
  ] as AlphabetLetterCard[]
};

/**
 * Grade 2 English — Level 1 — Activity 2: Family photo — say who it is.
 * Design progress showed 5 steps; folder has 6 portraits — using all 6.
 */
export const grade2EnglishLevel1Activity2 = {
  id: 2,
  type: "family_say_who" as const,
  title: "Family Photo",
  prompt: "Look at the family photo. Say who it is.",
  blankPrompt: "This is my .............",
  familyImage: `${ACT2_IMG}/family.jpeg`,
  steps: [
    {
      key: "grandfather",
      label: "grandfather",
      portrait: `${ACT2_IMG}/grandfather.jpeg`,
      sayAccept: ["grandfather", "grandpa", "grand father", "granddad", "grandad"]
    },
    {
      key: "grandmother",
      label: "grandmother",
      portrait: `${ACT2_IMG}/grandmother.jpeg`,
      sayAccept: ["grandmother", "grandma", "grand mother", "granny"]
    },
    {
      key: "father",
      label: "father",
      portrait: `${ACT2_IMG}/father.jpeg`,
      sayAccept: ["father", "dad", "daddy", "papa"]
    },
    {
      key: "mother",
      label: "mother",
      portrait: `${ACT2_IMG}/mother.jpeg`,
      sayAccept: ["mother", "mom", "mum", "mommy", "mummy", "mama"]
    },
    {
      key: "brother",
      label: "brother",
      portrait: `${ACT2_IMG}/brother.jpeg`,
      sayAccept: ["brother"]
    },
    {
      key: "sister",
      label: "sister",
      portrait: `${ACT2_IMG}/sister.jpeg`,
      sayAccept: ["sister"]
    }
  ] as FamilySayWhoStep[]
};

/**
 * Grade 2 English — Level 1 — Activity 3: Recognize and pronounce animal names.
 * Worksheet showed elephant/parrot/bee/hen/fish; folder also has rabbit, goat, cat, dog.
 */
export const grade2EnglishLevel1Activity3 = {
  id: 3,
  type: "animal_say_name" as const,
  title: "Animal Names",
  prompt: "Recognize and pronounce animal names.",
  hint: "Look at the animal. Say its name out loud.",
  steps: [
    {
      key: "elephant",
      label: "elephant",
      image: `${ACT3_IMG}/elephant.jpeg`,
      sayAccept: ["elephant"]
    },
    {
      key: "parrot",
      label: "parrot",
      image: `${ACT3_IMG}/parrot.jpeg`,
      sayAccept: ["parrot"]
    },
    {
      key: "bee",
      label: "bee",
      image: `${ACT3_IMG}/bee.png`,
      sayAccept: ["bee"]
    },
    {
      key: "hen",
      label: "hen",
      image: `${ACT3_IMG}/hen.png`,
      sayAccept: ["hen", "chicken"]
    },
    {
      key: "fish",
      label: "fish",
      image: `${ACT3_IMG}/fish.jpeg`,
      sayAccept: ["fish", "goldfish"]
    },
    {
      key: "rabbit",
      label: "rabbit",
      image: `${ACT3_IMG}/rabbit.jpeg`,
      sayAccept: ["rabbit", "bunny"]
    },
    {
      key: "goat",
      label: "goat",
      image: `${ACT3_IMG}/goat.jpeg`,
      sayAccept: ["goat"]
    },
    {
      key: "cat",
      label: "cat",
      image: `${ACT3_IMG}/cat.png`,
      sayAccept: ["cat"]
    },
    {
      key: "dog",
      label: "dog",
      image: `${ACT3_IMG}/dog.jpeg`,
      sayAccept: ["dog"]
    }
  ] as AnimalSayNameStep[]
};

/**
 * Grade 2 English — Level 1 — Activity 4: The sky we see
 * One scene image; students say what they can see in the sky.
 */
export const grade2EnglishLevel1Activity4 = {
  id: 4,
  type: "sky_say_what" as const,
  title: "The sky we see",
  prompt: "Look at this beautiful sky! What can you see?",
  hint: "Look at the picture. Say the things you can see in the sky.",
  sceneImage: `${ACT4_IMG}/sky.jpeg`,
  items: [
    { key: "sun", label: "sun", sayAccept: ["sun"] },
    { key: "rainbow", label: "rainbow", sayAccept: ["rainbow"] },
    { key: "cloud", label: "cloud", sayAccept: ["cloud", "clouds"] },
    { key: "airplane", label: "airplane", sayAccept: ["airplane", "plane", "aeroplane"] },
    { key: "kite", label: "kite", sayAccept: ["kite"] },
    { key: "bird", label: "bird", sayAccept: ["bird", "birds"] }
  ] as SkySayWhatItem[]
};

export const grade2EnglishLevel1Activities = [
  grade2EnglishLevel1Activity1,
  grade2EnglishLevel1Activity2,
  grade2EnglishLevel1Activity3,
  grade2EnglishLevel1Activity4
];
