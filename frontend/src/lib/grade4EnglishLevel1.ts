const ACT1_IMG = "/level-test/english/grade-4/images/level%201/activity%201";

/**
 * Grade 4 English — Level 1 — Activity 1: Magic Picture Match — family members.
 * Write the correct word, then pronounce it aloud.
 */
export const grade4EnglishLevel1Activity1 = {
  id: 1,
  type: "family_name_write_say" as const,
  title: "Magic Picture Match",
  prompt: "Identify family members and write the correct word. (After writing, students must pronounce the word aloud.)",
  hint: "Look at each picture. Write the family word, then say it aloud.",
  nameBank: ["Father", "Mother", "Sister", "Brother"],
  items: [
    {
      key: "father",
      image: `${ACT1_IMG}/father.png`,
      answer: "father",
      displayAnswer: "Father",
      accept: ["father", "dad", "daddy"],
      sayAccept: ["father", "dad", "daddy"]
    },
    {
      key: "mother",
      image: `${ACT1_IMG}/mother.png`,
      answer: "mother",
      displayAnswer: "Mother",
      accept: ["mother", "mom", "mum", "mommy", "mummy"],
      sayAccept: ["mother", "mom", "mum", "mommy", "mummy"]
    },
    {
      key: "sister",
      image: `${ACT1_IMG}/sister.png`,
      answer: "sister",
      displayAnswer: "Sister",
      accept: ["sister"],
      sayAccept: ["sister"]
    },
    {
      key: "brother",
      image: `${ACT1_IMG}/brother.png`,
      answer: "brother",
      displayAnswer: "Brother",
      accept: ["brother"],
      sayAccept: ["brother"]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-4/images/level%201/activity%202";

export type BodyLabelDrop = {
  boardImage: string;
  boardAspectRatio: number;
  labels: { key: string; text: string }[];
  zones: {
    key: string;
    box: { left: number; top: number; width: number; height: number };
    anchor?: { x: number; y: number };
  }[];
  answerMap: Record<string, string>;
};

/**
 * Grade 4 English — Level 1 — Activity 2: Body parts — drag labels onto the character.
 */
export const grade4EnglishLevel1Activity2 = {
  id: 2,
  type: "body_label_drop" as const,
  title: "Body Parts",
  prompt: "Drag the body part labels onto the correct place on the character.",
  hint: "Drag each word into the box next to that body part.",
  bodyLabelDrop: {
    boardImage: `${ACT2_IMG}/activity%202.png`,
    boardAspectRatio: 1024 / 1536,
    labels: [
      { key: "eyes", text: "Eyes" },
      { key: "head", text: "head" },
      { key: "ear", text: "ear" },
      { key: "mouth", text: "mouth" },
      { key: "hand", text: "hand" },
      { key: "knee", text: "knee" }
    ],
    zones: [
      { key: "mouth", box: { left: 2, top: 40, width: 22, height: 5.5 }, anchor: { x: 51, y: 32 } },
      { key: "head", box: { left: 76, top: 8, width: 22, height: 5.5 }, anchor: { x: 52, y: 8 } },
      { key: "ear", box: { left: 76, top: 22, width: 22, height: 5.5 }, anchor: { x: 71, y: 25 } },
      { key: "hand", box: { left: 2, top: 27, width: 22, height: 5.5 }, anchor: { x: 26, y: 29 } },
      { key: "eyes", box: { left: 76, top: 34, width: 22, height: 5.5 }, anchor: { x: 58, y: 22.5 } },
      { key: "knee", box: { left: 76, top: 70, width: 22, height: 5.5 }, anchor: { x: 64, y: 78 } }
    ],
    answerMap: {
      mouth: "mouth",
      head: "head",
      ear: "ear",
      hand: "hand",
      eyes: "eyes",
      knee: "knee"
    }
  } as BodyLabelDrop
};

/**
 * Grade 4 English — Level 1 — Activity 3: Phonics Sorting Game.
 * Sort /f/ and /p/ words into baskets, then read every word aloud.
 * Mother-tongue detection: listen for /f/ ↔ /p/ swaps (Fish → Pish, Fan → Pan…).
 */
export const grade4EnglishLevel1Activity3 = {
  id: 3,
  type: "phonics_sort_say" as const,
  title: "Phonics Sorting Game",
  prompt: "Phonics Sorting Game. (Drag each word into the correct basket. Then read all words aloud.)",
  hint: "Words that start with the /f/ sound go to Basket F. Words that start with the /p/ sound go to Basket P.",
  baskets: [
    { key: "f", title: "Basket F" },
    { key: "p", title: "Basket P" }
  ],
  words: [
    {
      key: "fish",
      text: "Fish",
      basket: "f",
      isExample: true,
      sayAccept: ["fish"],
      saySwapped: ["pish"]
    },
    { key: "pen", text: "Pen", basket: "p", isExample: false, sayAccept: ["pen"], saySwapped: ["fen"] },
    {
      key: "parrot",
      text: "Parrot",
      basket: "p",
      isExample: false,
      sayAccept: ["parrot"],
      saySwapped: ["farrot"]
    },
    {
      key: "flower",
      text: "Flower",
      basket: "f",
      isExample: false,
      sayAccept: ["flower"],
      saySwapped: ["plower", "plover"]
    },
    { key: "pig", text: "Pig", basket: "p", isExample: false, sayAccept: ["pig"], saySwapped: ["fig"] },
    { key: "fan", text: "Fan", basket: "f", isExample: false, sayAccept: ["fan"], saySwapped: ["pan"] }
  ]
};

/**
 * Grade 4 English — Level 1 — Activity 4: Places in the Community / Who Works Here?
 * Drag each place name onto the matching description.
 * Image folder uses the existing typo: "actitvity 4".
 */
const ACT4_IMG = "/level-test/english/grade-4/images/level%201/actitvity%204";

export const grade4EnglishLevel1Activity4 = {
  id: 4,
  type: "place_desc_drop" as const,
  title: "Who Works Here?",
  prompt: "Drag and drop the correct answer.",
  hint: "Read each sentence. Drag the place name that matches into the blank.",
  labels: [
    { key: "clinic", text: "Clinic" },
    { key: "farm", text: "Farm" },
    { key: "police", text: "Police Station" },
    { key: "post", text: "Post Office" },
    { key: "school", text: "School" },
    { key: "hospital", text: "Hospital" }
  ],
  items: [
    {
      key: "q1",
      text: "You go here when you are sick and need treatment.",
      answer: "hospital",
      image: `${ACT4_IMG}/hospital.png`
    },
    {
      key: "q2",
      text: "A police officer works here to protect people and enforce the law.",
      answer: "police",
      image: `${ACT4_IMG}/police%20s.png`
    },
    {
      key: "q3",
      text: "Rice, vegetables, and fruits are grown here.",
      answer: "farm",
      image: `${ACT4_IMG}/paddy.png`
    },
    {
      key: "q4",
      text: "Students come here to learn English, Mathematics, and Science.",
      answer: "school",
      image: `${ACT4_IMG}/school.png`
    },
    {
      key: "q5",
      text: "People send letters and parcels from this place.",
      answer: "post",
      image: null
    },
    {
      key: "q6",
      text: "A nurse helps patients and works with doctors here.",
      answer: "clinic",
      image: null
    }
  ]
};

export const grade4EnglishLevel1Activities = [
  grade4EnglishLevel1Activity1,
  grade4EnglishLevel1Activity2,
  grade4EnglishLevel1Activity3,
  grade4EnglishLevel1Activity4
];
