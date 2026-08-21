const ACT1_IMG = "/level-test/english/grade-2/images/level%203/activity%201";

export type VehicleTypeOption =
  | "On the road"
  | "On the track"
  | "On two wheels"
  | "On the water"
  | "In the air";

/**
 * Grade 2 English — Level 3 — Activity 1: Identify the vehicle type and tell what it is.
 */
export const grade2EnglishLevel3Activity1 = {
  id: 1,
  type: "vehicle_type_speak" as const,
  title: "Identify the Vehicle",
  prompt: "Identify the vehicle type and tell what it is.",
  hint: "Look at the pictures. Choose the vehicle type and say what it is.",
  tip: "Look carefully. Speak clearly and in full sentences.",
  typeOptions: [
    "On the road",
    "On the track",
    "On two wheels",
    "On the water",
    "In the air"
  ] as VehicleTypeOption[],
  nameOptions: ["aeroplane", "bus", "train", "bicycle", "car"],
  typeLegend: [
    { key: "road", label: "On the road", color: "#3b82f6" },
    { key: "track", label: "On the track", color: "#7c3aed" },
    { key: "wheels", label: "On two wheels", color: "#16a34a" },
    { key: "water", label: "On the water", color: "#db2777" },
    { key: "air", label: "In the air", color: "#0ea5e9" }
  ],
  items: [
    {
      key: "plane",
      image: `${ACT1_IMG}/plane.png`,
      typeAnswer: "In the air" as VehicleTypeOption,
      nameAnswer: "aeroplane",
      speakPrompt: "It goes in the air. It is an aeroplane.",
      sayAccept: [
        "it goes in the air it is an aeroplane",
        "it goes in the air it is a aeroplane",
        "it goes in the air it is an airplane",
        "it is an aeroplane",
        "it is an airplane",
        "aeroplane",
        "airplane"
      ]
    },
    {
      key: "bus",
      image: `${ACT1_IMG}/bus.png`,
      typeAnswer: "On the road" as VehicleTypeOption,
      nameAnswer: "bus",
      speakPrompt: "It goes on the road. It is a bus.",
      sayAccept: [
        "it goes on the road it is a bus",
        "it is a bus",
        "bus"
      ]
    },
    {
      key: "train",
      image: `${ACT1_IMG}/train.png`,
      typeAnswer: "On the track" as VehicleTypeOption,
      nameAnswer: "train",
      speakPrompt: "It goes on the track. It is a train.",
      sayAccept: [
        "it goes on the track it is a train",
        "it is a train",
        "train"
      ]
    },
    {
      key: "bicycle",
      image: `${ACT1_IMG}/bicycle.png`,
      typeAnswer: "On two wheels" as VehicleTypeOption,
      nameAnswer: "bicycle",
      speakPrompt: "It goes on two wheels. It is a bicycle.",
      sayAccept: [
        "it goes on two wheels it is a bicycle",
        "it is a bicycle",
        "it is a bike",
        "bicycle",
        "bike"
      ]
    },
    {
      key: "car",
      image: `${ACT1_IMG}/car.png`,
      typeAnswer: "On the road" as VehicleTypeOption,
      nameAnswer: "car",
      speakPrompt: "It goes on the road. It is a car.",
      sayAccept: [
        "it goes on the road it is a car",
        "it is a car",
        "car"
      ]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-2/images/level%203/activity%202";

/**
 * Grade 2 English — Level 3 — Activity 2: How I come to school.
 */
export const grade2EnglishLevel3Activity2 = {
  id: 2,
  type: "school_way_speak" as const,
  title: "How I Come to School",
  prompt: "Look at the pictures. Choose the way you come to school.",
  hint: "Tap the microphone button. Say a complete sentence about how you come to school.",
  characterImage: `${ACT2_IMG}/boy.png`,
  wayOptions: [
    { key: "bus", label: "by bus" },
    { key: "foot", label: "on foot" },
    { key: "van", label: "by van" },
    { key: "motorcycle", label: "by motorcycle" },
    { key: "bicycle", label: "by bicycle" }
  ],
  items: [
    {
      key: "bus",
      image: `${ACT2_IMG}/school%20bus.png`,
      wayAnswer: "bus",
      bubbleText: "I come to school by bus.",
      isExample: true,
      speakPrompt: "I come to school by bus.",
      sayAccept: [
        "i come to school by bus",
        "i came to school by bus",
        "by bus"
      ]
    },
    {
      key: "foot",
      image: `${ACT2_IMG}/foot.png`,
      wayAnswer: "foot",
      bubbleText: "I come to school on …",
      isExample: false,
      speakPrompt: "I come to school on foot.",
      sayAccept: [
        "i come to school on foot",
        "i came to school on foot",
        "on foot",
        "i walk to school"
      ]
    },
    {
      key: "van",
      image: `${ACT2_IMG}/school%20van.png`,
      wayAnswer: "van",
      bubbleText: "……………………",
      isExample: false,
      speakPrompt: "I come to school by van.",
      sayAccept: [
        "i come to school by van",
        "i came to school by van",
        "i come to school by school van",
        "by van"
      ]
    },
    {
      key: "motorcycle",
      image: `${ACT2_IMG}/motor%20cycle.png`,
      wayAnswer: "motorcycle",
      bubbleText: "……………………",
      isExample: false,
      label: "Motor cycle",
      speakPrompt: "I come to school by motorcycle.",
      sayAccept: [
        "i come to school by motorcycle",
        "i came to school by motorcycle",
        "i come to school by motor cycle",
        "by motorcycle",
        "by motor cycle"
      ]
    },
    {
      key: "bicycle",
      image: `${ACT2_IMG}/bicycle.png`,
      wayAnswer: "bicycle",
      bubbleText: "……………………",
      isExample: false,
      speakPrompt: "I come to school by bicycle.",
      sayAccept: [
        "i come to school by bicycle",
        "i came to school by bicycle",
        "i come to school by bike",
        "by bicycle",
        "by bike"
      ]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-2/images/level%203/activity%203";

/**
 * Grade 2 English — Level 3 — Activity 3: Animal Action Reporter.
 * Look → choose action → build sentence → say it.
 */
export const grade2EnglishLevel3Activity3 = {
  id: 3,
  type: "animal_action_speak" as const,
  title: "Animal Action Reporter",
  prompt: "Look, choose the correct action and build the sentence.",
  hint: "Look, choose the correct action, and build the sentence!",
  actionOptions: ["run", "fly", "swim", "hop", "jump"],
  gallery: [
    { animal: "horse", action: "run" },
    { animal: "bee", action: "fly" },
    { animal: "rabbit", action: "hop" },
    { animal: "monkey", action: "jump" },
    { animal: "fish", action: "swim" }
  ],
  items: [
    {
      key: "horse",
      image: `${ACT3_IMG}/horse.jpeg`,
      animal: "horse",
      article: "a",
      identifyPrompt: "It is a horse.",
      identifyAccept: ["it is a horse", "a horse", "horse"],
      actionAnswer: "run",
      sentenceWords: ["The", "horse", "can", "run."],
      speakPrompt: "It can run.",
      sayAccept: ["it can run", "the horse can run", "horse can run"]
    },
    {
      key: "bee",
      image: `${ACT3_IMG}/bee.jpeg`,
      animal: "bee",
      article: "a",
      identifyPrompt: "It is a bee.",
      identifyAccept: ["it is a bee", "a bee", "bee"],
      actionAnswer: "fly",
      sentenceWords: ["The", "bee", "can", "fly."],
      speakPrompt: "It can fly.",
      sayAccept: ["it can fly", "the bee can fly", "bee can fly"]
    },
    {
      key: "rabbit",
      image: `${ACT3_IMG}/rabbit.jpeg`,
      animal: "rabbit",
      article: "a",
      identifyPrompt: "It is a rabbit.",
      identifyAccept: ["it is a rabbit", "a rabbit", "rabbit"],
      actionAnswer: "hop",
      sentenceWords: ["The", "rabbit", "can", "hop."],
      speakPrompt: "It can hop.",
      sayAccept: ["it can hop", "the rabbit can hop", "rabbit can hop"]
    },
    {
      key: "monkey",
      image: `${ACT3_IMG}/monkey.jpeg`,
      animal: "monkey",
      article: "a",
      identifyPrompt: "It is a monkey.",
      identifyAccept: ["it is a monkey", "a monkey", "monkey"],
      actionAnswer: "jump",
      sentenceWords: ["The", "monkey", "can", "jump."],
      speakPrompt: "It can jump.",
      sayAccept: ["it can jump", "the monkey can jump", "monkey can jump"]
    },
    {
      key: "fish",
      image: `${ACT3_IMG}/fish.jpeg`,
      animal: "fish",
      article: "a",
      identifyPrompt: "It is a fish.",
      identifyAccept: ["it is a fish", "a fish", "fish"],
      actionAnswer: "swim",
      sentenceWords: ["The", "fish", "can", "swim."],
      speakPrompt: "It can swim.",
      sayAccept: ["it can swim", "the fish can swim", "fish can swim"]
    }
  ]
};

const ACT4_IMG = "/level-test/english/grade-2/images/level%203/activity%204";

/**
 * Grade 2 English — Level 3 — Activity 4: Classroom objects — What can you see?
 */
export const grade2EnglishLevel3Activity4 = {
  id: 4,
  type: "classroom_see_speak" as const,
  title: "What Can You See?",
  prompt: "Look at the picture. Say what you can see.",
  hint: "What can you see? Choose the word and say the sentence.",
  nameOptions: ["blackboard", "bin", "chair", "duster", "table", "window"],
  items: [
    {
      key: "blackboard",
      image: `${ACT4_IMG}/black%20board.png`,
      question: "What can you see?",
      promptPrefix: "It is a",
      answer: "blackboard",
      speakPrompt: "It is a blackboard.",
      sayAccept: [
        "it is a blackboard",
        "it is a black board",
        "a blackboard",
        "blackboard",
        "black board"
      ]
    },
    {
      key: "bin",
      image: `${ACT4_IMG}/bin.png`,
      question: "What can you see?",
      promptPrefix: "It is a",
      answer: "bin",
      speakPrompt: "It is a bin.",
      sayAccept: ["it is a bin", "a bin", "bin"]
    },
    {
      key: "chair",
      image: `${ACT4_IMG}/chair.png`,
      question: "What can you see?",
      promptPrefix: "It is a",
      answer: "chair",
      speakPrompt: "It is a chair.",
      sayAccept: ["it is a chair", "a chair", "chair"]
    },
    {
      key: "duster",
      image: `${ACT4_IMG}/duster.png`,
      question: "What can you see?",
      promptPrefix: "It is a",
      answer: "duster",
      speakPrompt: "It is a duster.",
      sayAccept: ["it is a duster", "a duster", "duster"]
    },
    {
      key: "table",
      image: `${ACT4_IMG}/table.png`,
      question: "What can you see?",
      promptPrefix: "It is a",
      answer: "table",
      speakPrompt: "It is a table.",
      sayAccept: ["it is a table", "a table", "table"]
    },
    {
      key: "window",
      image: `${ACT4_IMG}/window.png`,
      question: "What can you see?",
      promptPrefix: "Please close the",
      answer: "window",
      speakPrompt: "Please close the window.",
      sayAccept: [
        "please close the window",
        "close the window",
        "window"
      ]
    }
  ]
};

export const grade2EnglishLevel3Activities = [
  grade2EnglishLevel3Activity1,
  grade2EnglishLevel3Activity2,
  grade2EnglishLevel3Activity3,
  grade2EnglishLevel3Activity4
];
