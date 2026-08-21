/**
 * Grade 2 English — Level 4 — Activity 1: Match & speak conversation replies.
 */
export const grade2EnglishLevel4Activity1 = {
  id: 1,
  type: "conversation_match_speak" as const,
  title: "Match the Conversation",
  prompt: "Students select the correct reply to each speech bubble.",
  hint: "Match each question or greeting with the best reply. Then speak your reply.",
  continuePrompt: "Great! What did you do today?",
  continueHint: "Tap the microphone and answer.",
  replyPool: [
    "Good - bye!",
    "I am fine.",
    "It's a frock.",
    "Hello!",
    "Good afternoon!",
    "Good luck!",
    "It's nice.",
    "Thank you.",
    "Yes, you may.",
    "Let's go."
  ],
  items: [
    {
      key: "how_are_you",
      prompt: "How are you?",
      avatar: "boy" as const,
      answer: "I am fine.",
      sayAccept: ["i am fine", "i'm fine", "im fine", "fine"]
    },
    {
      key: "whats_this",
      prompt: "What's this?",
      avatar: "girl" as const,
      answer: "It's a frock.",
      sayAccept: ["its a frock", "it's a frock", "it is a frock", "a frock", "frock"]
    },
    {
      key: "good_afternoon",
      prompt: "Good afternoon!",
      avatar: "boy" as const,
      answer: "Good afternoon!",
      sayAccept: ["good afternoon"]
    },
    {
      key: "new_shirt",
      prompt: "This is my new shirt.",
      avatar: "girl" as const,
      answer: "It's nice.",
      sayAccept: ["its nice", "it's nice", "it is nice", "nice"]
    },
    {
      key: "have_a_look",
      prompt: "May I have a look?",
      avatar: "boy" as const,
      answer: "Yes, you may.",
      sayAccept: ["yes you may", "yes you can", "you may"]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-2/images/level%204/activity%202";

/**
 * Grade 2 English — Level 4 — Activity 2: Jobs and workplaces.
 */
export const grade2EnglishLevel4Activity2 = {
  id: 2,
  type: "job_place_speak" as const,
  title: "Jobs and Workplaces",
  prompt: "Complete the sentences using the picture, then read them aloud.",
  hint: "Identify who it is and where they work.",
  jobOptions: ["doctor", "teacher", "nurse", "police officer", "farmer"],
  placeOptions: ["hospital", "school", "police station", "field"],
  items: [
    {
      key: "doctor",
      image: `${ACT2_IMG}/doctor.jpeg`,
      pronoun: "She",
      jobAnswer: "doctor",
      placeAnswer: "hospital",
      jobPrompt: "She is a doctor.",
      placePrompt: "She works in the hospital.",
      jobAccept: ["she is a doctor", "a doctor", "doctor"],
      placeAccept: [
        "she works in the hospital",
        "works in the hospital",
        "in the hospital",
        "hospital"
      ]
    },
    {
      key: "teacher",
      image: `${ACT2_IMG}/teacher.jpeg`,
      pronoun: "She",
      jobAnswer: "teacher",
      placeAnswer: "school",
      jobPrompt: "She is a teacher.",
      placePrompt: "She works in the school.",
      jobAccept: ["she is a teacher", "a teacher", "teacher"],
      placeAccept: [
        "she works in the school",
        "works in the school",
        "in the school",
        "school"
      ]
    },
    {
      key: "nurse",
      image: `${ACT2_IMG}/nurse.jpeg`,
      pronoun: "She",
      jobAnswer: "nurse",
      placeAnswer: "hospital",
      jobPrompt: "She is a nurse.",
      placePrompt: "She works in the hospital.",
      jobAccept: ["she is a nurse", "a nurse", "nurse"],
      placeAccept: [
        "she works in the hospital",
        "works in the hospital",
        "in the hospital",
        "hospital"
      ]
    },
    {
      key: "police",
      image: `${ACT2_IMG}/police.jpeg`,
      pronoun: "He",
      jobAnswer: "police officer",
      placeAnswer: "police station",
      jobPrompt: "He is a police officer.",
      placePrompt: "He works in the police station.",
      jobAccept: [
        "he is a police officer",
        "he is a policeman",
        "a police officer",
        "a policeman",
        "police officer",
        "policeman",
        "police"
      ],
      placeAccept: [
        "he works in the police station",
        "works in the police station",
        "in the police station",
        "police station"
      ]
    },
    {
      key: "farmer",
      image: `${ACT2_IMG}/farmer.jpeg`,
      pronoun: "He",
      jobAnswer: "farmer",
      placeAnswer: "field",
      jobPrompt: "He is a farmer.",
      placePrompt: "He works in the field.",
      jobAccept: ["he is a farmer", "a farmer", "farmer"],
      placeAccept: [
        "he works in the field",
        "he works in the paddy field",
        "he works on the farm",
        "works in the field",
        "in the field",
        "field",
        "farm"
      ]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-2/images/level%204/activity%203";

/**
 * Grade 2 English — Level 4 — Activity 3: Let's Be a Reporter! (Tell us about the farmer)
 */
export const grade2EnglishLevel4Activity3 = {
  id: 3,
  type: "farmer_reporter_speak" as const,
  title: "Let's Be a Reporter!",
  prompt: "Tell us about the farmer.",
  hint: "Look at the picture and tell us about the farmer.",
  tip: "Look carefully. Use the helping words. Speak clearly and in full sentences!",
  image: `${ACT3_IMG}/farmer.jpeg`,
  helpingWords: [
    "farmer",
    "paddy field",
    "seed",
    "bucket",
    "grow",
    "rice",
    "workplace"
  ],
  exampleLines: [
    "He is a farmer.",
    "He works in a paddy field.",
    "He plants seeds.",
    "He uses a bucket.",
    "He can grow rice.",
    "The paddy field is his workplace."
  ],
  steps: [
    {
      key: "job",
      blankPrompt: "He is a ………………",
      answer: "farmer",
      speakPrompt: "He is a farmer.",
      sayAccept: ["he is a farmer", "a farmer", "farmer"]
    },
    {
      key: "works",
      blankPrompt: "He works in a ………………",
      answer: "paddy field",
      speakPrompt: "He works in a paddy field.",
      sayAccept: [
        "he works in a paddy field",
        "he works in the paddy field",
        "works in a paddy field",
        "paddy field"
      ]
    },
    {
      key: "plants",
      blankPrompt: "He plants ………………",
      answer: "seeds",
      speakPrompt: "He plants seeds.",
      sayAccept: ["he plants seeds", "he plants seed", "plants seeds", "seeds", "seed"]
    },
    {
      key: "uses",
      blankPrompt: "He uses a ………………",
      answer: "bucket",
      speakPrompt: "He uses a bucket.",
      sayAccept: ["he uses a bucket", "uses a bucket", "a bucket", "bucket"]
    },
    {
      key: "grow",
      blankPrompt: "He can grow ………………",
      answer: "rice",
      speakPrompt: "He can grow rice.",
      sayAccept: ["he can grow rice", "can grow rice", "grow rice", "rice"]
    },
    {
      key: "workplace",
      blankPrompt: "The ……………… is his workplace.",
      answer: "paddy field",
      speakPrompt: "The paddy field is his workplace.",
      sayAccept: [
        "the paddy field is his workplace",
        "paddy field is his workplace",
        "paddy field",
        "workplace"
      ]
    }
  ]
};

const ACT4_IMG = "/level-test/english/grade-2/images/level%204/activity%204";

/**
 * Grade 2 English — Level 4 — Activity 4: Kitchen items.
 * Select kitchen objects, then complete and say the sentences.
 */
export const grade2EnglishLevel4Activity4 = {
  id: 4,
  type: "kitchen_items_speak" as const,
  title: "Kitchen Items",
  prompt: "Look carefully at the objects. Select the items that belong in the kitchen.",
  hint: "Using suitable words, read the complete sentence aloud.",
  kitchenImage: `${ACT4_IMG}/kitchen.jpeg`,
  objects: [
    {
      key: "pen",
      label: "pen",
      image: `${ACT4_IMG}/pen.jpg`,
      isKitchen: false
    },
    {
      key: "pencil",
      label: "pencil",
      image: `${ACT4_IMG}/pencil.jpg`,
      isKitchen: false
    },
    {
      key: "spoon_fork",
      label: "spoon and fork",
      image: `${ACT4_IMG}/spoon%20and%20fork.jpg`,
      isKitchen: true
    },
    {
      key: "knife",
      label: "knife",
      image: `${ACT4_IMG}/knife.jpg`,
      isKitchen: true
    },
    {
      key: "wooden_spoon",
      label: "wooden spoon",
      image: `${ACT4_IMG}/wooden%20spoon.jpg`,
      isKitchen: true
    },
    {
      key: "rice_cooker",
      label: "rice cooker",
      image: `${ACT4_IMG}/rice%20cooker.jpg`,
      isKitchen: true
    }
  ],
  steps: [
    {
      key: "see_spoon",
      blankPrompt: "I can see a ……………… spoon.",
      answer: "wooden",
      options: ["wooden", "plastic", "metal", "paper"],
      image: `${ACT4_IMG}/wooden%20spoon.jpg`,
      speakPrompt: "I can see a wooden spoon.",
      sayAccept: ["i can see a wooden spoon", "a wooden spoon", "wooden spoon"]
    },
    {
      key: "belong",
      blankPrompt: "These items belong in ………………",
      answer: "the kitchen",
      options: ["the kitchen", "the school", "the garden", "the bedroom"],
      speakPrompt: "These items belong in the kitchen.",
      sayAccept: [
        "these items belong in the kitchen",
        "belong in the kitchen",
        "in the kitchen",
        "the kitchen",
        "kitchen"
      ]
    },
    {
      key: "eat",
      blankPrompt: "We use the spoon and fork to ………………",
      answer: "eat",
      options: ["eat", "write", "draw", "sleep"],
      image: `${ACT4_IMG}/spoon%20and%20fork.jpg`,
      speakPrompt: "We use the spoon and fork to eat.",
      sayAccept: [
        "we use the spoon and fork to eat",
        "use the spoon and fork to eat",
        "to eat",
        "eat"
      ]
    },
    {
      key: "cut",
      blankPrompt: "We use the knife to ………………",
      answer: "cut",
      options: ["cut", "write", "drink", "paint"],
      image: `${ACT4_IMG}/knife.jpg`,
      speakPrompt: "We use the knife to cut.",
      sayAccept: ["we use the knife to cut", "use the knife to cut", "to cut", "cut"]
    },
    {
      key: "cook",
      blankPrompt: "The rice cooker helps us ………………",
      answer: "cook rice",
      options: ["cook rice", "write letters", "wash clothes", "draw pictures"],
      image: `${ACT4_IMG}/rice%20cooker.jpg`,
      speakPrompt: "The rice cooker helps us cook rice.",
      sayAccept: [
        "the rice cooker helps us cook rice",
        "helps us cook rice",
        "cook rice",
        "rice cooker"
      ]
    },
    {
      key: "useful",
      blankPrompt: "These kitchen items are useful.",
      answer: "useful",
      options: ["useful", "useless", "heavy", "noisy"],
      speakPrompt: "These kitchen items are useful.",
      sayAccept: [
        "these kitchen items are useful",
        "kitchen items are useful",
        "are useful",
        "useful"
      ]
    }
  ]
};

export const grade2EnglishLevel4Activities = [
  grade2EnglishLevel4Activity1,
  grade2EnglishLevel4Activity2,
  grade2EnglishLevel4Activity3,
  grade2EnglishLevel4Activity4
];
