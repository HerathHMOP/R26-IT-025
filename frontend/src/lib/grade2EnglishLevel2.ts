const ACT1_IMG = "/level-test/english/grade-2/images/level%202/activity%201";
const ACT2_IMG = "/level-test/english/grade-2/images/level%202/activity%202";
const ACT3_IMG = "/level-test/english/grade-2/images/level%202/activity%203";
const ACT4_IMG = "/level-test/english/grade-2/images/level%202/activity%204";

export type FoodLikeChoice = "like" | "dont_like";

export type FoodLikeSpeakItem = {
  key: string;
  label: string;
  image: string;
  /** Shown in the listen question, e.g. "mangoes". */
  questionNoun: string;
  /** Full spoken forms for "I like …" */
  likeAccept: string[];
  /** Full spoken forms for "I don't like …" */
  dontLikeAccept: string[];
};

export type ClassroomLabelDrop = {
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
 * Grade 2 English — Level 2 — Activity 1: Things We Eat and Drink / Food Choice Challenge
 */
export const grade2EnglishLevel2Activity1 = {
  id: 1,
  type: "food_like_speak" as const,
  title: "Food Choice Challenge",
  prompt: "Look at the picture. Listen to the question. Choose and speak.",
  items: [
    {
      key: "mango",
      label: "Mango",
      image: `${ACT1_IMG}/mango.jpeg`,
      questionNoun: "mangoes",
      likeAccept: ["i like mangoes", "i like mango"],
      dontLikeAccept: ["i don't like mangoes", "i do not like mangoes", "i dont like mangoes", "i don't like mango"]
    },
    {
      key: "banana",
      label: "Banana",
      image: `${ACT1_IMG}/banana.jpeg`,
      questionNoun: "bananas",
      likeAccept: ["i like bananas", "i like banana"],
      dontLikeAccept: ["i don't like bananas", "i do not like bananas", "i dont like bananas", "i don't like banana"]
    },
    {
      key: "milk",
      label: "Milk",
      image: `${ACT1_IMG}/milk.jpeg`,
      questionNoun: "milk",
      likeAccept: ["i like milk"],
      dontLikeAccept: ["i don't like milk", "i do not like milk", "i dont like milk"]
    },
    {
      key: "bread",
      label: "Bread",
      image: `${ACT1_IMG}/bread.jpeg`,
      questionNoun: "bread",
      likeAccept: ["i like bread"],
      dontLikeAccept: ["i don't like bread", "i do not like bread", "i dont like bread"]
    },
    {
      key: "rice",
      label: "Rice and curry",
      image: `${ACT1_IMG}/rice%20and%20curry.jpg`,
      questionNoun: "rice and curry",
      likeAccept: ["i like rice and curry", "i like rice"],
      dontLikeAccept: [
        "i don't like rice and curry",
        "i do not like rice and curry",
        "i dont like rice and curry",
        "i don't like rice"
      ]
    },
    {
      key: "orange",
      label: "Orange",
      image: `${ACT1_IMG}/orange.jpeg`,
      questionNoun: "oranges",
      likeAccept: ["i like oranges", "i like orange"],
      dontLikeAccept: ["i don't like oranges", "i do not like oranges", "i dont like oranges", "i don't like orange"]
    }
  ] as FoodLikeSpeakItem[]
};

/**
 * Grade 2 English — Level 2 — Activity 2: Name objects inside the classroom (drag and drop).
 * Word bank has 6 unique words; Chair is needed twice (teacher + student), so two Chair chips.
 * Spelling "Calander" / "Black board" match the worksheet.
 */
export const grade2EnglishLevel2Activity2 = {
  id: 2,
  type: "classroom_label_drop" as const,
  title: "Classroom Objects",
  prompt: "Name objects inside the classroom. (Drag and drop each word inside the box)",
  classroomLabelDrop: {
    boardImage: `${ACT2_IMG}/classroom.png`,
    boardAspectRatio: 1122 / 1402,
    labels: [
      { key: "calendar", text: "Calander" },
      { key: "chair1", text: "Chair" },
      { key: "dustbin", text: "Dustbin" },
      { key: "broom", text: "Broom" },
      { key: "blackboard", text: "Black board" },
      { key: "clock", text: "Clock" },
      { key: "chair2", text: "Chair" }
    ],
    zones: [
      { key: "clock", box: { left: 6, top: 10, width: 16, height: 4.5 } },
      { key: "blackboard", box: { left: 6, top: 26, width: 16, height: 4.5 } },
      { key: "calendar", box: { left: 76, top: 12, width: 16, height: 4.5 } },
      { key: "teacher_chair", box: { left: 72, top: 40, width: 16, height: 4.5 } },
      { key: "broom", box: { left: 78, top: 66, width: 16, height: 4.5 } },
      { key: "student_chair", box: { left: 38, top: 78, width: 16, height: 4.5 } },
      { key: "dustbin", box: { left: 68, top: 86, width: 16, height: 4.5 } }
    ],
    answerMap: {
      clock: "clock",
      blackboard: "blackboard",
      calendar: "calendar",
      teacher_chair: "chair1",
      broom: "broom",
      student_chair: "chair2",
      dustbin: "dustbin"
    }
  } as ClassroomLabelDrop
};

/**
 * Grade 2 English — Level 2 — Activity 3: Changes in the Environment
 * Compare clean vs dirty pictures, then describe what you see.
 */
export const grade2EnglishLevel2Activity3 = {
  id: 3,
  type: "environment_changes" as const,
  title: "Changes in the Environment",
  prompt: "Look carefully. Choose the clean picture, then say the sentence.",
  steps: [
    {
      key: "classroom",
      kind: "choose_clean" as const,
      question: "Which classroom is clean?",
      optionA: {
        key: "a",
        label: "A",
        image: `${ACT3_IMG}/clean%20classroom.jpeg`
      },
      optionB: {
        key: "b",
        label: "B",
        image: `${ACT3_IMG}/untidy%20classroom.jpeg`
      },
      correctOptionKey: "a",
      speakPrompt: "The classroom is clean.",
      sayAccept: ["the classroom is clean", "classroom is clean"]
    },
    {
      key: "playground",
      kind: "choose_clean" as const,
      question: "Which playground is clean?",
      optionA: {
        key: "a",
        label: "A",
        image: `${ACT3_IMG}/clean%20playground.jpeg`
      },
      optionB: {
        key: "b",
        label: "B",
        image: `${ACT3_IMG}/dirty%20playground.jpeg`
      },
      correctOptionKey: "a",
      speakPrompt: "The playground is clean.",
      sayAccept: ["the playground is clean", "playground is clean"]
    },
    {
      key: "flowers",
      kind: "see_and_say" as const,
      question: "What can you see?",
      image: `${ACT3_IMG}/flowers.jpeg`,
      example: 'e.g. "I can see flowers."',
      speakPrompt: "I can see flowers.",
      sayAccept: ["i can see flowers", "i see flowers", "flowers"]
    },
    {
      key: "dry",
      kind: "see_and_say" as const,
      question: "What can you see?",
      image: `${ACT3_IMG}/dry.jpeg`,
      example: 'e.g. "I can see dry leaves."',
      speakPrompt: "I can see dry leaves.",
      sayAccept: ["i can see dry leaves", "i see dry leaves", "dry leaves"]
    },
    {
      key: "cleaning",
      kind: "see_and_say" as const,
      question: "What can you see?",
      image: `${ACT3_IMG}/cleaning.jpeg`,
      example: 'e.g. "The child is cleaning."',
      speakPrompt: "The child is cleaning.",
      sayAccept: ["the child is cleaning", "child is cleaning", "cleaning"]
    },
    {
      key: "wet",
      kind: "see_and_say" as const,
      question: "What can you see after?",
      image: `${ACT3_IMG}/wet.jpeg`,
      example: 'e.g. "The ground is wet."',
      speakPrompt: "The ground is wet.",
      sayAccept: ["the ground is wet", "ground is wet", "wet"]
    }
  ]
};

/**
 * Grade 2 English — Level 2 — Activity 4: Find the correct color and say it loud.
 * Folder uses purpule.png / orange s.png filenames.
 */
export const grade2EnglishLevel2Activity4 = {
  id: 4,
  type: "color_choose_speak" as const,
  title: "Find the Color",
  prompt: "Find the correct color and say it loud.",
  hint: "Look at the picture. Choose the correct color and say it.",
  steps: [
    {
      key: "yellow",
      image: `${ACT4_IMG}/yellow.png`,
      options: ["Red", "Green", "Yellow"],
      answer: "Yellow",
      speakPrompt: "I see yellow.",
      sayAccept: ["i see yellow", "yellow"]
    },
    {
      key: "blue",
      image: `${ACT4_IMG}/blue.png`,
      options: ["Blue", "Yellow", "Pink"],
      answer: "Blue",
      speakPrompt: "I see blue.",
      sayAccept: ["i see blue", "blue"]
    },
    {
      key: "green",
      image: `${ACT4_IMG}/green.png`,
      options: ["Red", "Blue", "Green"],
      answer: "Green",
      speakPrompt: "I see green.",
      sayAccept: ["i see green", "green"]
    },
    {
      key: "purple",
      image: `${ACT4_IMG}/purpule.png`,
      options: ["Red", "Purple", "White"],
      answer: "Purple",
      speakPrompt: "I see purple.",
      sayAccept: ["i see purple", "purple"]
    },
    {
      key: "orange",
      image: `${ACT4_IMG}/orange%20s.png`,
      options: ["Red", "Orange", "Blue"],
      answer: "Orange",
      speakPrompt: "I see orange.",
      sayAccept: ["i see orange", "orange"]
    },
    {
      key: "pink",
      image: `${ACT4_IMG}/pink.png`,
      options: ["Blue", "Orange", "Pink"],
      answer: "Pink",
      speakPrompt: "I see pink.",
      sayAccept: ["i see pink", "pink"]
    }
  ]
};

export const grade2EnglishLevel2Activities = [
  grade2EnglishLevel2Activity1,
  grade2EnglishLevel2Activity2,
  grade2EnglishLevel2Activity3,
  grade2EnglishLevel2Activity4
];
