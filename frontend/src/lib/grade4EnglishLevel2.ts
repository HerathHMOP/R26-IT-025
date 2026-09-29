/**
 * Grade 4 English — Level 2 — Activity 1: Calendar Detective
 * Quiz: answer calendar questions, then say the answer aloud.
 */
export const grade4EnglishLevel2Activity1 = {
  id: 1,
  type: "calendar_detective" as const,
  title: "Calendar Detective",
  prompt: "Quiz Game: Answer calendar questions. (Listen, choose, then say the answer aloud.)",
  hint: "Select the correct answer, then read it aloud.",
  questions: [
    {
      key: "q1",
      scenario: "Nimal's birthday is on 15th June. His birthday is next month.",
      question: "Which month is this?",
      listenText:
        "Nimal's birthday is on the fifteenth of June. His birthday is next month. Which month is this?",
      visual: { kind: "calendar" as const, label: "15th", sublabel: "JUNE", emoji: "🎂" },
      options: ["May", "July", "August"],
      answer: "May",
      speakPrompt: "The month is May.",
      sayAccept: ["the month is may", "month is may", "it is may", "it's may", "may"]
    },
    {
      key: "q2",
      scenario: "Today is Thursday. Tomorrow is Sports Day.",
      question: "What day is Sports Day?",
      listenText: "Today is Thursday. Tomorrow is Sports Day. What day is Sports Day?",
      visual: { kind: "chalkboard" as const, label: "Today is", sublabel: "Thursday", emoji: "🏃" },
      options: ["Wednesday", "Friday", "Saturday"],
      answer: "Friday",
      speakPrompt: "Sports Day is on Friday.",
      sayAccept: [
        "sports day is on friday",
        "sports day is friday",
        "it is friday",
        "it's friday",
        "friday"
      ]
    },
    {
      key: "q3",
      scenario: "The school trip is on 2nd October.",
      question: "Which month comes before October?",
      listenText: "The school trip is on the second of October. Which month comes before October?",
      visual: { kind: "calendar" as const, label: "2nd", sublabel: "OCTOBER", emoji: "🚌" },
      options: ["August", "September", "November"],
      answer: "September",
      speakPrompt: "September comes before October.",
      sayAccept: [
        "september comes before october",
        "september is before october",
        "the month is september",
        "september"
      ]
    },
    {
      key: "q4",
      scenario: "The Christmas party is in December.",
      question: "Which month comes before December?",
      listenText: "The Christmas party is in December. Which month comes before December?",
      visual: { kind: "calendar" as const, label: "🎄", sublabel: "DECEMBER", emoji: "🎉" },
      options: ["October", "November", "January"],
      answer: "November",
      speakPrompt: "November comes before December.",
      sayAccept: [
        "november comes before december",
        "november is before december",
        "the month is november",
        "november"
      ]
    },
    {
      key: "q5",
      scenario: "Today is 31st December.",
      question: "What is the first month of the new year?",
      listenText: "Today is the thirty-first of December. What is the first month of the new year?",
      visual: { kind: "calendar" as const, label: "31st", sublabel: "DECEMBER", emoji: "🎆" },
      options: ["February", "January", "March"],
      answer: "January",
      speakPrompt: "The first month of the year is January.",
      sayAccept: [
        "the first month of the year is january",
        "the first month is january",
        "first month is january",
        "it is january",
        "it's january",
        "january"
      ]
    }
  ]
};

/**
 * Grade 4 English — Level 2 — Activity 2: Sentence Builder
 * Arrange the mixed words into a sentence, then read it aloud.
 */
export const grade4EnglishLevel2Activity2 = {
  id: 2,
  type: "sentence_builder_say" as const,
  title: "Sentence Builder",
  prompt: "Arrange the mixed-up words in the correct order to make a sentence, then read it aloud.",
  hint: "Drag or tap the words in order. After completing the sentence, read it aloud.",
  tasks: [
    {
      key: "library",
      scrambled: ["library", "every", "the", "Friday", "visit", "We"],
      answer: ["We", "visit", "the", "library", "every", "Friday"],
      sentence: "We visit the library every Friday.",
      sayAccept: ["we visit the library every friday"]
    },
    {
      key: "sports-day",
      scrambled: ["Sports", "next", "Our", "Friday", "is", "Day"],
      answer: ["Our", "Sports", "Day", "is", "next", "Friday"],
      sentence: "Our Sports Day is next Friday.",
      sayAccept: ["our sports day is next friday"]
    },
    {
      key: "flowers",
      scrambled: ["flowers", "the", "planted", "beautiful", "We", "garden", "in"],
      answer: ["We", "planted", "beautiful", "flowers", "in", "the", "garden"],
      sentence: "We planted beautiful flowers in the garden.",
      sayAccept: ["we planted beautiful flowers in the garden"]
    },
    {
      key: "family",
      scrambled: ["family", "temple", "My", "the", "every", "visits", "month"],
      answer: ["My", "family", "visits", "the", "temple", "every", "month"],
      sentence: "My family visits the temple every month.",
      sayAccept: ["my family visits the temple every month"]
    },
    {
      key: "football",
      scrambled: ["friends", "football", "weekends", "with", "play", "I", "my", "on"],
      answer: ["I", "play", "football", "with", "my", "friends", "on", "weekends"],
      sentence: "I play football with my friends on weekends.",
      sayAccept: ["i play football with my friends on weekends"]
    },
    {
      key: "teacher",
      scrambled: ["teacher", "explained", "grammar", "our", "English"],
      answer: ["Our", "English", "teacher", "explained", "grammar"],
      sentence: "Our English teacher explained grammar.",
      sayAccept: ["our english teacher explained grammar"]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-4/images/level%202/activity%203/activity%203.png";

/**
 * Grade 4 English — Level 2 — Activity 3: Look and Answer
 * Look at the student picture and choose the correct answer.
 */
export const grade4EnglishLevel2Activity3 = {
  id: 3,
  type: "look_choose_answer" as const,
  title: "Look and Answer",
  prompt: "Answer the questions. (Select the correct answer)",
  hint: "Look carefully at the picture, then choose the correct answer.",
  image: ACT3_IMG,
  questions: [
    {
      key: "shirt",
      question: "What colour was the shirt?",
      options: ["Blue", "Red", "Green"],
      answer: "Blue"
    },
    {
      key: "head",
      question: "What was on the student's head?",
      options: ["Cap", "Bag", "Shoes"],
      answer: "Cap"
    },
    {
      key: "shoes",
      question: "What colour were the shoes?",
      options: ["Green", "Yellow", "Purple"],
      answer: "Green"
    },
    {
      key: "bag",
      question: "What colour was the bag?",
      options: ["Purple", "Blue", "Red"],
      answer: "Purple"
    }
  ]
};

const ACT4_IMG = "/level-test/english/grade-4/images/level%202/activity%205";

/**
 * Grade 4 English — Level 2 — Activity 4: Letter Detective
 * Find the letters that name the picture and put them in the correct order.
 * (Images live in the activity 5 folder.)
 */
export const grade4EnglishLevel2Activity4 = {
  id: 4,
  type: "letter_order_picture" as const,
  title: "Letter Detective",
  prompt: "Find the letters that name the picture and write them in the correct order.",
  hint: "Tap or drag the letters that spell the picture. Extra letters are distractors.",
  items: [
    {
      key: "fish",
      image: `${ACT4_IMG}/fish.png`,
      letters: ["t", "f", "i", "a", "s", "h"],
      answer: ["f", "i", "s", "h"],
      word: "fish"
    },
    {
      key: "six",
      image: `${ACT4_IMG}/6.png`,
      letters: ["s", "b", "a", "i", "x", "t"],
      answer: ["s", "i", "x"],
      word: "six"
    },
    {
      key: "bin",
      image: `${ACT4_IMG}/bin.png`,
      letters: ["c", "b", "i", "a", "t", "n"],
      answer: ["b", "i", "n"],
      word: "bin"
    },
    {
      key: "lips",
      image: `${ACT4_IMG}/lip.png`,
      letters: ["l", "i", "p", "s"],
      answer: ["l", "i", "p", "s"],
      word: "lips"
    }
  ]
};

export const grade4EnglishLevel2Activities = [
  grade4EnglishLevel2Activity1,
  grade4EnglishLevel2Activity2,
  grade4EnglishLevel2Activity3,
  grade4EnglishLevel2Activity4
];
