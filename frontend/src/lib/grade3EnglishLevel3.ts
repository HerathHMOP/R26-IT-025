const ACT1_IMG = "/level-test/english/grade-3/images/level%203/activity%201";

/**
 * Grade 3 English — Level 3 — Activity 1: Look and name school people (drag and drop + read aloud).
 */
export const grade3EnglishLevel3Activity1 = {
  id: 1,
  type: "school_people_label_say" as const,
  title: "School People",
  prompt: "Look and name the people. (drag and drop the correct name in front of the correct image and read aloud)",
  hint: "Drag each name onto the matching picture, then say the name aloud.",
  labels: [
    { key: "principal", text: "principal" },
    { key: "vice_principal", text: "vice principal" },
    { key: "teacher", text: "teacher" },
    { key: "librarian", text: "librarian" },
    { key: "security_guard", text: "security guard" }
  ],
  items: [
    {
      key: "principal",
      image: `${ACT1_IMG}/principal.png`,
      answer: "principal",
      sayAccept: ["principal", "the principal"]
    },
    {
      key: "vice_principal",
      image: `${ACT1_IMG}/v%20principal.png`,
      answer: "vice_principal",
      sayAccept: ["vice principal", "viceprincipal", "the vice principal"]
    },
    {
      key: "teacher",
      image: `${ACT1_IMG}/teacher.png`,
      answer: "teacher",
      sayAccept: ["teacher", "the teacher"]
    },
    {
      key: "librarian",
      image: `${ACT1_IMG}/librarian.png`,
      answer: "librarian",
      sayAccept: ["librarian", "the librarian"]
    },
    {
      key: "security_guard",
      image: `${ACT1_IMG}/s%20guard.png`,
      answer: "security_guard",
      sayAccept: ["security guard", "securityguard", "the security guard", "guard"]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-3/images/level%203/activity%202";

/**
 * Grade 3 English — Level 3 — Activity 2: Re-arrange words into plant-growth sentences + read aloud.
 */
export const grade3EnglishLevel3Activity2 = {
  id: 2,
  type: "plant_sentence_scramble_say" as const,
  title: "Growing Plants",
  prompt: "Re-arrange the words to correct sentences. And read aloud each sentence.",
  hint: "Tap the words in order to build the sentence, then read it aloud.",
  items: [
    {
      key: "hide_seeds",
      image: `${ACT2_IMG}/planting.jpeg`,
      theme: "green" as const,
      scrambled: ["Hide", "seeds", "soil", "in"],
      sentenceWords: ["Hide", "seeds", "in", "soil"],
      speakPrompt: "Hide seeds in soil",
      sayAccept: ["hide seeds in soil", "hide the seeds in soil"]
    },
    {
      key: "start_growing",
      image: `${ACT2_IMG}/growing.jpeg`,
      theme: "blue" as const,
      scrambled: ["growing", "They", "start"],
      sentenceWords: ["They", "start", "growing"],
      speakPrompt: "They start growing",
      sayAccept: ["they start growing"]
    },
    {
      key: "roots_down",
      image: `${ACT2_IMG}/growth.jpeg`,
      theme: "orange" as const,
      scrambled: ["grow", "Roots", "down"],
      sentenceWords: ["Roots", "grow", "down"],
      speakPrompt: "Roots grow down",
      sayAccept: ["roots grow down"]
    },
    {
      key: "become_plants",
      image: `${ACT2_IMG}/Plants.jpeg`,
      theme: "pink" as const,
      scrambled: ["become", "The", "seeds", "plants"],
      sentenceWords: ["The", "seeds", "become", "plants"],
      speakPrompt: "The seeds become plants",
      sayAccept: ["the seeds become plants", "seeds become plants"]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-3/images/level%203/activity%203";

/**
 * Grade 3 English — Level 3 — Activity 3: Look at the classroom and say what you can see.
 */
export const grade3EnglishLevel3Activity3 = {
  id: 3,
  type: "classroom_look_say" as const,
  title: "In the Classroom",
  prompt: "Look at the classroom picture and tell what you can see.",
  hint: "Look at the picture. Choose the word for something you can see, then say the sentence aloud.",
  image: `${ACT3_IMG}/classroom%20l3.png`,
  nameOptions: [
    "blackboard",
    "clock",
    "desk",
    "chair",
    "calendar",
    "chart",
    "plant",
    "books",
    "dustbin",
    "broom"
  ],
  items: [
    {
      key: "blackboard",
      answer: "blackboard",
      article: "a",
      speakPrompt: "I can see a blackboard.",
      sayAccept: [
        "i can see a blackboard",
        "i can see a black board",
        "i see a blackboard",
        "a blackboard",
        "blackboard",
        "black board"
      ]
    },
    {
      key: "clock",
      answer: "clock",
      article: "a",
      speakPrompt: "I can see a clock.",
      sayAccept: ["i can see a clock", "i see a clock", "a clock", "clock"]
    },
    {
      key: "desk",
      answer: "desk",
      article: "a",
      speakPrompt: "I can see a desk.",
      sayAccept: ["i can see a desk", "i see a desk", "a desk", "desk", "desks"]
    },
    {
      key: "chair",
      answer: "chair",
      article: "a",
      speakPrompt: "I can see a chair.",
      sayAccept: ["i can see a chair", "i see a chair", "a chair", "chair", "chairs"]
    },
    {
      key: "calendar",
      answer: "calendar",
      article: "a",
      speakPrompt: "I can see a calendar.",
      sayAccept: ["i can see a calendar", "i see a calendar", "a calendar", "calendar"]
    },
    {
      key: "chart",
      answer: "chart",
      article: "a",
      speakPrompt: "I can see a chart.",
      sayAccept: ["i can see a chart", "i see a chart", "a chart", "chart"]
    },
    {
      key: "plant",
      answer: "plant",
      article: "a",
      speakPrompt: "I can see a plant.",
      sayAccept: ["i can see a plant", "i see a plant", "a plant", "plant"]
    },
    {
      key: "books",
      answer: "books",
      article: "",
      speakPrompt: "I can see books.",
      sayAccept: [
        "i can see books",
        "i can see some books",
        "i see books",
        "books",
        "i can see a book",
        "book"
      ]
    },
    {
      key: "dustbin",
      answer: "dustbin",
      article: "a",
      speakPrompt: "I can see a dustbin.",
      sayAccept: [
        "i can see a dustbin",
        "i can see a dust bin",
        "i can see a bin",
        "i can see a trash bin",
        "a dustbin",
        "dustbin",
        "bin"
      ]
    },
    {
      key: "broom",
      answer: "broom",
      article: "a",
      speakPrompt: "I can see a broom.",
      sayAccept: ["i can see a broom", "i see a broom", "a broom", "broom"]
    }
  ]
};

const ACT4_IMG = "/level-test/english/grade-3/images/level%203/activity%204";

/**
 * Grade 3 English — Level 3 — Activity 4: Match picture with the correct word.
 */
export const grade3EnglishLevel3Activity4 = {
  id: 4,
  type: "supply_picture_word_match" as const,
  title: "School Supplies",
  prompt: "Match picture with the correct word.",
  hint: "Tap a word, then tap the matching picture (or drag the word onto the picture).",
  pictures: [
    { key: "pen", image: `${ACT4_IMG}/pen.png`, label: "pen" },
    { key: "ruler", image: `${ACT4_IMG}/ruler.png`, label: "ruler" },
    { key: "eraser", image: `${ACT4_IMG}/eraser.png`, label: "eraser" },
    { key: "pencil", image: `${ACT4_IMG}/pencil.png`, label: "pencil" },
    { key: "scissor", image: `${ACT4_IMG}/scissor.png`, label: "scissor" }
  ],
  words: [
    { key: "pen", text: "Pen" },
    { key: "eraser", text: "Eraser" },
    { key: "ruler", text: "Ruler" },
    { key: "scissor", text: "Scissor" },
    { key: "pencil", text: "Pencil" }
  ],
  answerMap: {
    pen: "pen",
    ruler: "ruler",
    eraser: "eraser",
    pencil: "pencil",
    scissor: "scissor"
  }
};

const ACT5_IMG = "/level-test/english/grade-3/images/level%203/activity%205";

/**
 * Grade 3 English — Level 3 — Activity 5: Match school places with activities, then speak.
 */
export const grade3EnglishLevel3Activity5 = {
  id: 5,
  type: "school_place_activity_match_say" as const,
  title: "School Places",
  prompt:
    "Look at the school places. Drag the correct activity to each place. Complete all matches before moving to the speaking task.",
  hint: "Match each place with what we do there, then say: “In the _____, we _____.”",
  activities: [
    { key: "read", text: "Read" },
    { key: "play", text: "Play" },
    { key: "sing", text: "Sing" },
    { key: "dance", text: "Dance" },
    { key: "learn", text: "Learn" }
  ],
  places: [
    {
      key: "library",
      image: `${ACT5_IMG}/library.png`,
      placeName: "library",
      activity: "read",
      question: "What do we do in the library?",
      speakPrompt: "In the library, we read.",
      sayAccept: [
        "in the library we read",
        "in the library we read books",
        "we read in the library",
        "we read books in the library"
      ]
    },
    {
      key: "classroom",
      image: `${ACT5_IMG}/classroom.png`,
      placeName: "classroom",
      activity: "learn",
      question: "What do we do in the classroom?",
      speakPrompt: "In the classroom, we learn.",
      sayAccept: [
        "in the classroom we learn",
        "we learn in the classroom",
        "in the class room we learn"
      ]
    },
    {
      key: "playground",
      image: `${ACT5_IMG}/palyground.png`,
      placeName: "playground",
      activity: "play",
      question: "What do we do in the playground?",
      speakPrompt: "In the playground, we play.",
      sayAccept: [
        "in the playground we play",
        "we play in the playground",
        "in the play ground we play"
      ]
    },
    {
      key: "music_room",
      image: `${ACT5_IMG}/music%20room.png`,
      placeName: "music room",
      activity: "sing",
      question: "What do we do in the music room?",
      speakPrompt: "In the music room, we sing.",
      sayAccept: [
        "in the music room we sing",
        "we sing in the music room",
        "in the musicroom we sing"
      ]
    },
    {
      key: "dancing_room",
      image: `${ACT5_IMG}/dancing%20room.png`,
      placeName: "dancing room",
      activity: "dance",
      question: "What do we do in the dancing room?",
      speakPrompt: "In the dancing room, we dance.",
      sayAccept: [
        "in the dancing room we dance",
        "we dance in the dancing room",
        "in the dance room we dance",
        "in the dancingroom we dance"
      ]
    }
  ],
  answerMap: {
    library: "read",
    classroom: "learn",
    playground: "play",
    music_room: "sing",
    dancing_room: "dance"
  }
};

export const grade3EnglishLevel3Activities = [
  grade3EnglishLevel3Activity1,
  grade3EnglishLevel3Activity2,
  grade3EnglishLevel3Activity3,
  grade3EnglishLevel3Activity4,
  grade3EnglishLevel3Activity5
];
