/**
 * Grade 3 English — Level 2 — Activity 1: Recite the poem.
 */
export const grade3EnglishLevel2Activity1 = {
  id: 1,
  type: "recite_poem" as const,
  title: "Recite the Poem",
  prompt: "Recite the poem",
  hint: "Listen to the poem, then recite it aloud.",
  poemTitle: "My School",
  lines: [
    "The place so cool,",
    "is my school.",
    "Sing, dance and play,",
    "read, write and say.",
    "Teachers love and care,",
    "many friends are there.",
    "The place so cheerful,",
    "is my school."
  ],
  /** Phrases accepted when the student recites (partial matches OK). */
  sayAccept: [
    "the place so cool is my school",
    "is my school",
    "sing dance and play",
    "read write and say",
    "teachers love and care",
    "many friends are there",
    "the place so cheerful",
    "my school"
  ]
};

const ACT2_IMG = "/level-test/english/grade-3/images/level%202/activity%202";

/**
 * Grade 3 English — Level 2 — Activity 2: Rearrange, write and say family words.
 */
export const grade3EnglishLevel2Activity2 = {
  id: 2,
  type: "family_scramble_say" as const,
  title: "Family Words",
  prompt: "Rearrange, write and Say the correct word.",
  hint: "Look at the picture. Unscramble the letters. Write the word, then say it.",
  items: [
    {
      key: "father",
      image: `${ACT2_IMG}/father.png`,
      scrambled: ["r", "a", "h", "t", "f", "e"],
      answer: "father",
      sayAccept: ["father", "dad", "daddy"]
    },
    {
      key: "mother",
      image: `${ACT2_IMG}/mother.png`,
      scrambled: ["r", "o", "h", "t", "m", "e"],
      answer: "mother",
      sayAccept: ["mother", "mom", "mum", "mommy", "mummy"]
    },
    {
      key: "brother",
      image: `${ACT2_IMG}/brother.png`,
      scrambled: ["b", "o", "h", "r", "t", "r", "e"],
      answer: "brother",
      sayAccept: ["brother"]
    },
    {
      key: "sister",
      image: `${ACT2_IMG}/sister.png`,
      scrambled: ["i", "s", "s", "t", "r", "e"],
      answer: "sister",
      sayAccept: ["sister"]
    },
    {
      key: "grandmother",
      image: `${ACT2_IMG}/Grand%20mother.png`,
      scrambled: ["g", "n", "d", "e", "h", "a", "r", "r", "o", "m", "t"],
      answer: "grandmother",
      sayAccept: ["grandmother", "grandma", "granny"]
    },
    {
      key: "grandfather",
      image: `${ACT2_IMG}/Grand%20father.png`,
      scrambled: ["d", "n", "h", "e", "r", "f", "g", "a", "a", "t", "r"],
      answer: "grandfather",
      sayAccept: ["grandfather", "grandpa", "granddad"]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-3/images/level%202/activity%203";

export type HouseLabelDrop = {
  boardImage: string;
  boardAspectRatio: number;
  labels: { key: string; text: string }[];
  zones: {
    key: string;
    box: { left: number; top: number; width: number; height: number };
  }[];
  answerMap: Record<string, string>;
};

/**
 * Grade 3 English — Level 2 — Activity 3: Label parts of a house (drag and drop).
 */
export const grade3EnglishLevel2Activity3 = {
  id: 3,
  type: "house_label_drop" as const,
  title: "Parts of a House",
  prompt: "Label parts of a house. (drag and drop)",
  hint: "Drag each word into the box that points to that part of the house.",
  houseLabelDrop: {
    boardImage: `${ACT3_IMG}/house.png`,
    boardAspectRatio: 1024 / 1024,
    labels: [
      { key: "window", text: "Window" },
      { key: "door", text: "door" },
      { key: "roof", text: "roof" },
      { key: "wall", text: "wall" }
    ],
    zones: [
      { key: "roof", box: { left: 70, top: 8, width: 22, height: 6.5 } },
      { key: "wall", box: { left: 76, top: 40, width: 22, height: 6.5 } },
      { key: "window", box: { left: 2, top: 70, width: 22, height: 6.5 } },
      { key: "door", box: { left: 58, top: 82, width: 22, height: 6.5 } }
    ],
    answerMap: {
      roof: "roof",
      wall: "wall",
      window: "window",
      door: "door"
    }
  } as HouseLabelDrop
};

const ACT4_IMG = "/level-test/english/grade-3/images/level%202/activity%204";

/**
 * Grade 3 English — Level 2 — Activity 4: Select the correct verb for each image.
 */
export const grade3EnglishLevel2Activity4 = {
  id: 4,
  type: "verb_choose_image" as const,
  title: "Action Verbs",
  prompt: "Select the correct verb to the image.",
  hint: "Look at the picture, then tap the verb that matches the action.",
  items: [
    {
      key: "play",
      image: `${ACT4_IMG}/play.png`,
      options: [
        { key: "play", text: "play" },
        { key: "brush", text: "brush" },
        { key: "wash", text: "wash" }
      ],
      answer: "play"
    },
    {
      key: "wash",
      image: `${ACT4_IMG}/wash.png`,
      options: [
        { key: "bathe", text: "bathe" },
        { key: "wash", text: "wash" },
        { key: "go", text: "Go" }
      ],
      answer: "wash"
    },
    {
      key: "watch",
      image: `${ACT4_IMG}/watch.png`,
      options: [
        { key: "drink", text: "Drink" },
        { key: "watch", text: "watch" },
        { key: "write", text: "write" }
      ],
      answer: "watch"
    },
    {
      key: "sleep",
      image: `${ACT4_IMG}/sleep.png`,
      options: [
        { key: "drink", text: "Drink" },
        { key: "go", text: "Go" },
        { key: "sleep", text: "sleep" }
      ],
      answer: "sleep"
    },
    {
      key: "write",
      image: `${ACT4_IMG}/write.png`,
      options: [
        { key: "brush", text: "brush" },
        { key: "wash", text: "wash" },
        { key: "write", text: "write" }
      ],
      answer: "write"
    }
  ]
};

const ACT5_IMG = "/level-test/english/grade-3/images/level%202/activity%205";

/**
 * Grade 3 English — Level 2 — Activity 5: First letters → hidden word.
 * (Square & triangle use simple SVG assets; other pictures from the worksheet pack.)
 */
export const grade3EnglishLevel2Activity5 = {
  id: 5,
  type: "hidden_word_letters" as const,
  title: "Hidden Words",
  prompt:
    "Write the first letter of each picture in the box below it. And find the hidden word and write or type the word inside the box.",
  hint: "Write the first letter under each picture, then arrange those letters to make the hidden word.",
  rows: [
    {
      key: "sun",
      pictures: [
        {
          key: "umbrella",
          image: `${ACT5_IMG}/umbrella.png`,
          letter: "u",
          label: "umbrella"
        },
        {
          key: "six",
          image: `${ACT5_IMG}/6.png`,
          letter: "s",
          label: "six"
        },
        {
          key: "nose",
          image: `${ACT5_IMG}/nose.jpg`,
          letter: "n",
          label: "nose"
        }
      ],
      word: "sun"
    },
    {
      key: "star",
      pictures: [
        {
          key: "square",
          image: `${ACT5_IMG}/square.svg`,
          letter: "s",
          label: "square"
        },
        {
          key: "triangle",
          image: `${ACT5_IMG}/triangle.svg`,
          letter: "t",
          label: "triangle"
        },
        {
          key: "apple",
          image: `${ACT5_IMG}/apple.png`,
          letter: "a",
          label: "apple"
        },
        {
          key: "rabbit",
          image: `${ACT5_IMG}/rabbit.jpeg`,
          letter: "r",
          label: "rabbit"
        }
      ],
      word: "star"
    },
    {
      key: "moon",
      pictures: [
        {
          key: "mango",
          image: `${ACT5_IMG}/mango.jpeg`,
          letter: "m",
          label: "mango"
        },
        {
          key: "orange",
          image: `${ACT5_IMG}/orange.jpeg`,
          letter: "o",
          label: "orange"
        },
        {
          key: "oval",
          image: `${ACT5_IMG}/Green_oval_with_black_outline_202606271220.jpeg`,
          letter: "o",
          label: "oval"
        },
        {
          key: "nine",
          image: `${ACT5_IMG}/nine.jpeg`,
          letter: "n",
          label: "nine"
        }
      ],
      word: "moon"
    }
  ]
};

export const grade3EnglishLevel2Activities = [
  grade3EnglishLevel2Activity1,
  grade3EnglishLevel2Activity2,
  grade3EnglishLevel2Activity3,
  grade3EnglishLevel2Activity4,
  grade3EnglishLevel2Activity5
];
