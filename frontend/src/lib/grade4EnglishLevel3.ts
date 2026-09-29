const ACT1_IMG = "/level-test/english/grade-4/images/level%203/activity%201";

/**
 * Grade 4 English — Level 3 — Activity 1: Arrange the Events
 * Drag the daily-routine pictures into the correct order.
 */
export const grade4EnglishLevel3Activity1 = {
  id: 1,
  type: "event_order_drag" as const,
  title: "Arrange the Events",
  prompt: "Arrange the events in the correct order. (Drag each image to a box.)",
  hint: "Think about Nimal's day. Drag the pictures into boxes 1 to 4 in the correct order.",
  cards: [
    {
      key: "play",
      image: `${ACT1_IMG}/playing.png`,
      caption: "He plays with friends."
    },
    {
      key: "wakeup",
      image: `${ACT1_IMG}/wakeup.png`,
      caption: "Nimal wakes up."
    },
    {
      key: "brush",
      image: `${ACT1_IMG}/brushing.png`,
      caption: "He brushes his teeth."
    },
    {
      key: "school",
      image: `${ACT1_IMG}/going.png`,
      caption: "He goes to school."
    }
  ],
  correctOrder: ["wakeup", "brush", "school", "play"]
};

/**
 * Grade 4 English — Level 3 — Activity 2: Reading Race
 * Fluency assessment — read the Sports Day passage aloud.
 */
export const grade4EnglishLevel3Activity2 = {
  id: 2,
  type: "reading_race" as const,
  title: "Reading Race",
  prompt: "Fluency Assessment — read the passage aloud clearly and steadily.",
  hint: "Read the passage aloud. The system measures reading speed, pronunciation, and mistakes.",
  passageTitle: "Sports Day",
  paragraphs: [
    "Last Friday, our school held its annual Sports Day. Ravi and his friend Vanitha joined the running race. They stood at the starting line and waited for the whistle. Ravi ran very fast and finished first. The students cheered loudly, and the principal gave him a prize. Ravi felt proud because he worked hard and never gave up."
  ],
  fullText:
    "Last Friday, our school held its annual Sports Day. Ravi and his friend Vanitha joined the running race. They stood at the starting line and waited for the whistle. Ravi ran very fast and finished first. The students cheered loudly, and the principal gave him a prize. Ravi felt proud because he worked hard and never gave up.",
  wordCount: 62,
  /** Key phrases used to score pronunciation coverage. */
  sayAccept: [
    "last friday",
    "sports day",
    "ravi and his friend",
    "vanitha",
    "running race",
    "starting line",
    "waited for the whistle",
    "ran very fast",
    "finished first",
    "students cheered",
    "principal gave him a prize",
    "felt proud",
    "worked hard",
    "never gave up"
  ]
};

const ACT3_IMG = "/level-test/english/grade-4/images/level%203/activity%203";

/**
 * Grade 4 English — Level 3 — Activity 3: Picture Recognition and Speaking
 * Look at each picture, hear the word, then say it aloud.
 */
export const grade4EnglishLevel3Activity3 = {
  id: 3,
  type: "picture_say_word" as const,
  title: "Picture Recognition and Speaking",
  prompt: "Look at the picture. Listen to the word. Then say the word aloud.",
  hint: "Click Hear, then click the mic and say the word clearly.",
  items: [
    {
      key: "flower",
      image: `${ACT3_IMG}/flower.png`,
      word: "Flower",
      phonetic: "/ˈflaʊə/",
      sayAccept: ["flower"]
    },
    {
      key: "fish",
      image: `${ACT3_IMG}/fish%20ac-3.png`,
      word: "Fish",
      phonetic: "/fɪʃ/",
      sayAccept: ["fish"]
    },
    {
      key: "van",
      image: `${ACT3_IMG}/van.png`,
      word: "Van",
      phonetic: "/væn/",
      sayAccept: ["van"]
    },
    {
      key: "school",
      image: `${ACT3_IMG}/school%20ac-3.png`,
      word: "School",
      phonetic: "/skuːl/",
      sayAccept: ["school"]
    },
    {
      key: "star",
      image: `${ACT3_IMG}/star.png`,
      word: "Star",
      phonetic: "/stɑː/",
      sayAccept: ["star"]
    },
    {
      key: "zoo",
      image: `${ACT3_IMG}/zoo.png`,
      word: "Zoo",
      phonetic: "/zuː/",
      sayAccept: ["zoo"]
    },
    {
      key: "zebra",
      image: `${ACT3_IMG}/zebra.png`,
      word: "Zebra",
      phonetic: "/ˈzebrə/",
      sayAccept: ["zebra"]
    }
  ]
};

/**
 * Grade 4 English — Level 3 — Activity 4: Announcement Questions
 * Read the announcement and type answers to the questions.
 */
export const grade4EnglishLevel3Activity4 = {
  id: 4,
  type: "announcement_questions" as const,
  title: "Announcement Questions",
  prompt: "Read the announcement and answer the questions.",
  hint: "Read carefully, then type your answers in the boxes.",
  announcementTitle: "Attention please!",
  announcementLines: [
    "We are introducing cycling, volleyball and chess for Grade 4 students.",
    "Please meet your sports teacher and join your favourite sports club."
  ],
  announcementMeta: [
    { label: "Date", value: "01st October 2021" },
    { label: "Time", value: "09:30 a.m." },
    { label: "Place", value: "At the playground" }
  ],
  questions: [
    {
      key: "sports",
      question: "Name the sports in the announcement.",
      sample: "cycling, volleyball and chess",
      accept: [
        "cycling volleyball and chess",
        "cycling volleyball chess",
        "cycling, volleyball and chess",
        "cycling, volleyball, and chess",
        "cycling, volleyball, chess"
      ]
    },
    {
      key: "day",
      question: "What day is the meeting?",
      sample: "01st October 2021",
      accept: [
        "01st october 2021",
        "1st october 2021",
        "01 october 2021",
        "1 october 2021",
        "october 1st 2021",
        "october 1 2021",
        "1st of october 2021",
        "01st of october 2021"
      ]
    },
    {
      key: "place",
      question: "Where is it?",
      sample: "At the playground",
      accept: [
        "at the playground",
        "the playground",
        "playground",
        "in the playground"
      ]
    },
    {
      key: "time",
      question: "At what time is the meeting?",
      sample: "09:30 a.m.",
      accept: [
        "09:30 a.m.",
        "09:30 am",
        "9:30 a.m.",
        "9:30 am",
        "09.30 a.m.",
        "9.30 a.m.",
        "09 30 am",
        "9 30 am",
        "0930 am",
        "half past nine"
      ]
    }
  ]
};

/**
 * Grade 4 English — Level 3 — Activity 5: Choose the Correct Word
 * Pick the word that completes the sentence, then read the full sentence aloud.
 */
export const grade4EnglishLevel3Activity5 = {
  id: 5,
  type: "sentence_fill_speak" as const,
  title: "Choose the Correct Word",
  prompt: "Choose the correct word from the options. After selecting the answer, read the complete sentence aloud.",
  hint: "Pick the word that fits the blank, then read the whole sentence aloud.",
  sentences: [
    {
      key: "school",
      before: "I go to the ",
      after: " every day to learn new things.",
      options: ["School", "Fish", "Zoo"],
      answer: "School",
      speakPrompt: "I go to the school every day to learn new things.",
      sayAccept: [
        "i go to the school every day to learn new things",
        "i go to school every day to learn new things",
        "go to the school every day"
      ]
    },
    {
      key: "flower",
      before: "There is a beautiful ",
      after: " in my garden.",
      options: ["Flower", "Van", "School"],
      answer: "Flower",
      speakPrompt: "There is a beautiful flower in my garden.",
      sayAccept: [
        "there is a beautiful flower in my garden",
        "beautiful flower in my garden"
      ]
    },
    {
      key: "friend",
      before: "My best ",
      after: " plays football with me after school.",
      options: ["Friend", "Fish", "Book"],
      answer: "Friend",
      speakPrompt: "My best friend plays football with me after school.",
      sayAccept: [
        "my best friend plays football with me after school",
        "best friend plays football with me"
      ]
    },
    {
      key: "zebra",
      before: "We saw a ",
      after: " at the zoo.",
      options: ["Zebra", "Flower", "Van"],
      answer: "Zebra",
      speakPrompt: "We saw a zebra at the zoo.",
      sayAccept: ["we saw a zebra at the zoo", "saw a zebra at the zoo"]
    },
    {
      key: "van",
      before: "My father drives a white ",
      after: ".",
      options: ["Van", "Library", "Star"],
      answer: "Van",
      speakPrompt: "My father drives a white van.",
      sayAccept: ["my father drives a white van", "father drives a white van"]
    }
  ]
};

export const grade4EnglishLevel3Activities = [
  grade4EnglishLevel3Activity1,
  grade4EnglishLevel3Activity2,
  grade4EnglishLevel3Activity3,
  grade4EnglishLevel3Activity4,
  grade4EnglishLevel3Activity5
];
