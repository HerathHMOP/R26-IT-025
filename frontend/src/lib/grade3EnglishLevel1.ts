const ACT1_IMG = "/level-test/english/grade-3/images/level%201/activity%201";

/**
 * Grade 3 English — Level 1 — Activity 1: Count and say the Numbers (Word Recognition).
 * Hear-it audio unlocks only after the student has attempted to speak once.
 */
export const grade3EnglishLevel1Activity1 = {
  id: 1,
  type: "count_say_number" as const,
  title: "Count and Say the Numbers",
  prompt: "Count and say the Numbers.",
  hint: "Count the pictures. Say the number word. Listen only after you try once.",
  topic: "Level 1 — Word Recognition",
  items: [
    {
      key: "one",
      question: "Count the apples and say the number",
      image: `${ACT1_IMG}/apple.png`,
      numberWord: "One",
      digit: 1,
      isExample: true,
      sayAccept: ["one", "1"]
    },
    {
      key: "two",
      question: "Count the kites and say the number",
      image: `${ACT1_IMG}/kite.png`,
      numberWord: "Two",
      digit: 2,
      isExample: false,
      sayAccept: ["two", "2"]
    },
    {
      key: "three",
      question: "Count the bees and say the number",
      image: `${ACT1_IMG}/bees.png`,
      numberWord: "Three",
      digit: 3,
      isExample: false,
      sayAccept: ["three", "3"]
    },
    {
      key: "four",
      question: "Count the butterflies and say the number",
      image: `${ACT1_IMG}/butterflies.png`,
      numberWord: "Four",
      digit: 4,
      isExample: false,
      sayAccept: ["four", "4"]
    },
    {
      key: "five",
      question: "Count the flowers and say the number",
      image: `${ACT1_IMG}/flowers.png`,
      numberWord: "Five",
      digit: 5,
      isExample: false,
      sayAccept: ["five", "5"]
    },
    {
      key: "six",
      question: "Count the balls and say the number",
      image: `${ACT1_IMG}/balls.png`,
      numberWord: "Six",
      digit: 6,
      isExample: false,
      sayAccept: ["six", "6"]
    },
    {
      key: "seven",
      question: "Count the fish and say the number",
      image: `${ACT1_IMG}/7fish.png`,
      numberWord: "Seven",
      digit: 7,
      isExample: false,
      sayAccept: ["seven", "7"]
    },
    {
      key: "eight",
      question: "Count the strawberries and say the number",
      image: `${ACT1_IMG}/strawberries.png`,
      numberWord: "Eight",
      digit: 8,
      isExample: false,
      sayAccept: ["eight", "8"]
    },
    {
      key: "nine",
      question: "Count the frogs and say the number",
      image: `${ACT1_IMG}/frogs.png`,
      numberWord: "Nine",
      digit: 9,
      isExample: false,
      sayAccept: ["nine", "9"]
    },
    {
      key: "ten",
      question: "Count the stars and say the number",
      image: `${ACT1_IMG}/stars.png`,
      numberWord: "Ten",
      digit: 10,
      isExample: false,
      sayAccept: ["ten", "10"]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-3/images/level%201/activity%202";

/**
 * Grade 3 English — Level 1 — Activity 2: My Pets — write the name of the animal.
 */
export const grade3EnglishLevel1Activity2 = {
  id: 2,
  type: "pet_name_write" as const,
  title: "My Pets",
  prompt: "My Pets : Write the name of the animal.",
  hint: "Look at each pet. Type or choose its name.",
  nameBank: ["Cat", "Dog", "Rabbit", "Parrot", "Fish", "Cow"],
  items: [
    {
      key: "cat",
      image: `${ACT2_IMG}/cat.png`,
      answer: "Cat",
      accept: ["cat", "kitten"]
    },
    {
      key: "dog",
      image: `${ACT2_IMG}/dog.png`,
      answer: "Dog",
      accept: ["dog", "puppy", "pup"]
    },
    {
      key: "rabbit",
      image: `${ACT2_IMG}/rabbit.png`,
      answer: "Rabbit",
      accept: ["rabbit", "bunny"]
    },
    {
      key: "parrot",
      image: `${ACT2_IMG}/parrot.png`,
      answer: "Parrot",
      accept: ["parrot"]
    },
    {
      key: "fish",
      image: `${ACT2_IMG}/fish.png`,
      answer: "Fish",
      accept: ["fish"]
    },
    {
      key: "cow",
      image: `${ACT2_IMG}/cow.png`,
      answer: "Cow",
      accept: ["cow"]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-3/images/level%201/activity%203";

/**
 * Grade 3 English — Level 1 — Activity 3: Listen and choose the correct picture.
 */
export const grade3EnglishLevel1Activity3 = {
  id: 3,
  type: "listen_choose_picture" as const,
  title: "Listen and Choose",
  prompt: "Listen and Choose correct picture.",
  hint: "Tap Hear it, listen carefully, then tap the matching picture.",
  items: [
    {
      key: "fish",
      word: "Fish",
      answerImage: `${ACT3_IMG}/fish.png`,
      choices: [
        { key: "fish", image: `${ACT3_IMG}/fish.png`, label: "Fish" },
        { key: "parrot", image: `${ACT3_IMG}/parrot.png`, label: "Parrot" },
        { key: "cow", image: `${ACT3_IMG}/cow.png`, label: "Cow" }
      ]
    },
    {
      key: "dog",
      word: "dog",
      answerImage: `${ACT3_IMG}/dog.png`,
      choices: [
        { key: "cat", image: `${ACT3_IMG}/cat.png`, label: "Cat" },
        { key: "dog", image: `${ACT3_IMG}/dog.png`, label: "Dog" },
        { key: "rabbit", image: `${ACT3_IMG}/rabbit.png`, label: "Rabbit" }
      ]
    },
    {
      key: "cat",
      word: "Cat",
      answerImage: `${ACT3_IMG}/cat.png`,
      choices: [
        { key: "cow", image: `${ACT3_IMG}/cow.png`, label: "Cow" },
        { key: "fish", image: `${ACT3_IMG}/fish.png`, label: "Fish" },
        { key: "cat", image: `${ACT3_IMG}/cat.png`, label: "Cat" }
      ]
    },
    {
      key: "rabbit",
      word: "Rabbit",
      answerImage: `${ACT3_IMG}/rabbit.png`,
      choices: [
        { key: "rabbit", image: `${ACT3_IMG}/rabbit.png`, label: "Rabbit" },
        { key: "dog", image: `${ACT3_IMG}/dog.png`, label: "Dog" },
        { key: "parrot", image: `${ACT3_IMG}/parrot.png`, label: "Parrot" }
      ]
    }
  ]
};

const ACT4_IMG = "/level-test/english/grade-3/images/level%201/activity%204";

/**
 * Grade 3 English — Level 1 — Activity 4: Say the Word.
 * Hear it unlocks only after one speak attempt.
 */
export const grade3EnglishLevel1Activity4 = {
  id: 4,
  type: "say_the_word" as const,
  title: "Say the Word",
  prompt: "Say the Word.",
  hint: "Look at the picture. Say the word. Hear it unlocks after one try.",
  items: [
    {
      key: "fish",
      image: `${ACT4_IMG}/fish.png`,
      word: "Fish",
      sayAccept: ["fish"]
    },
    {
      key: "five",
      image: `${ACT4_IMG}/5.png`,
      word: "Five",
      sayAccept: ["five", "5"]
    },
    {
      key: "van",
      image: `${ACT4_IMG}/van.png`,
      word: "Van",
      sayAccept: ["van"]
    },
    {
      key: "window",
      image: `${ACT4_IMG}/window.png`,
      word: "Window",
      sayAccept: ["window"]
    },
    {
      key: "rabbit",
      image: `${ACT4_IMG}/rabbit.png`,
      word: "Rabbit",
      sayAccept: ["rabbit", "bunny"]
    },
    {
      key: "flower",
      image: `${ACT4_IMG}/flower.png`,
      word: "Flower",
      sayAccept: ["flower"]
    }
  ]
};

export const grade3EnglishLevel1Activities = [
  grade3EnglishLevel1Activity1,
  grade3EnglishLevel1Activity2,
  grade3EnglishLevel1Activity3,
  grade3EnglishLevel1Activity4
];
