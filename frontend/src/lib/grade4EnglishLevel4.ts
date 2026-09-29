/**
 * Grade 4 English — Level 4 — Activity 1: Chat with a Virtual Friend
 * A virtual friend asks personal questions; the student answers aloud.
 */
export const grade4EnglishLevel4Activity1 = {
  id: 1,
  type: "virtual_friend_chat" as const,
  title: "Chat with a Friend",
  prompt:
    "A virtual friend appears on screen and asks questions. Listen carefully, then answer each question aloud in a complete sentence.",
  hint: "Listen to your friend, then tap the microphone and answer in a full sentence.",
  friendName: "Sam",
  friendGreeting: "Hi! I'm Sam. Let's talk! I'll ask you a few questions.",
  friendDone: "Thank you! You answered all my questions. Great chatting with you!",
  questions: [
    {
      key: "name",
      question: "What is your name?",
      sampleAnswers: ["My name is Maya.", "I am Amal."],
      // Soft keywords — personal answers vary; any phrase with these counts
      sayAccept: ["my name is", "i am", "i m", "name is", "my name"]
    },
    {
      key: "age",
      question: "How old are you?",
      sampleAnswers: ["I am nine years old.", "I am 9 years old."],
      sayAccept: [
        "i am",
        "i m",
        "years old",
        "year old",
        "nine",
        "ten",
        "eight",
        "eleven",
        "twelve",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ]
    },
    {
      key: "favourite_subject",
      question: "What is your favourite subject?",
      sampleAnswers: ["My favourite subject is English.", "I like Maths."],
      sayAccept: [
        "favourite subject",
        "favorite subject",
        "my favourite",
        "my favorite",
        "i like",
        "english",
        "maths",
        "math",
        "science",
        "sinhala",
        "art",
        "music",
        "history",
        "geography",
        "sport",
        "pe"
      ]
    },
    {
      key: "after_school",
      question: "What do you do after school?",
      sampleAnswers: ["I play football after school.", "I do my homework after school."],
      sayAccept: [
        "after school",
        "i play",
        "i watch",
        "i read",
        "i do",
        "homework",
        "football",
        "cricket",
        "games",
        "tv",
        "with my friends",
        "i help",
        "i study"
      ]
    },
    {
      key: "favourite_festival",
      question: "What is your favourite festival?",
      sampleAnswers: ["My favourite festival is Vesak.", "I like Christmas."],
      sayAccept: [
        "favourite festival",
        "favorite festival",
        "my favourite",
        "my favorite",
        "i like",
        "vesak",
        "christmas",
        "new year",
        "sinhala",
        "tamil",
        "diwali",
        "ramadan",
        "eid",
        "avurudu",
        "festival"
      ]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-4/images/level%204/activity%202";

/**
 * Grade 4 English — Level 4 — Activity 2: How Much Is It?
 * Look at the picture and price tag, hear the question, then say the price aloud.
 */
export const grade4EnglishLevel4Activity2 = {
  id: 2,
  type: "price_ask_speak" as const,
  title: "How Much Is It?",
  prompt:
    "Look at each picture and the price tag. Listen to the question, then say the price in a complete sentence.",
  hint: "Listen to “How much is the …?”, read the price tag, then say the full sentence aloud.",
  items: [
    {
      key: "pen",
      image: `${ACT2_IMG}/pen.png`,
      itemName: "pen",
      priceLabel: "Rs. 30.00",
      question: "How much is the pen?",
      speakPrompt: "The pen is thirty rupees.",
      sayAccept: [
        "the pen is thirty rupees",
        "the pen is 30 rupees",
        "pen is thirty rupees",
        "pen is 30 rupees",
        "thirty rupees",
        "30 rupees"
      ]
    },
    {
      key: "pencil",
      image: `${ACT2_IMG}/pencil.png`,
      itemName: "pencil",
      priceLabel: "Rs. 25.00",
      question: "How much is the pencil?",
      speakPrompt: "The pencil is twenty five rupees.",
      sayAccept: [
        "the pencil is twenty five rupees",
        "the pencil is twenty-five rupees",
        "the pencil is 25 rupees",
        "pencil is twenty five rupees",
        "pencil is 25 rupees",
        "twenty five rupees",
        "25 rupees"
      ]
    },
    {
      key: "football",
      image: `${ACT2_IMG}/football.png`,
      itemName: "football",
      priceLabel: "Rs. 100.00",
      question: "How much is the football?",
      speakPrompt: "The football is one hundred rupees.",
      sayAccept: [
        "the football is one hundred rupees",
        "the foot ball is one hundred rupees",
        "the football is a hundred rupees",
        "the football is 100 rupees",
        "football is one hundred rupees",
        "football is 100 rupees",
        "one hundred rupees",
        "a hundred rupees",
        "100 rupees"
      ]
    },
    {
      key: "ruler",
      image: `${ACT2_IMG}/ruler.png`,
      itemName: "ruler",
      priceLabel: "Rs. 10.00",
      question: "How much is the ruler?",
      speakPrompt: "The ruler is ten rupees.",
      sayAccept: [
        "the ruler is ten rupees",
        "the ruler is 10 rupees",
        "ruler is ten rupees",
        "ruler is 10 rupees",
        "ten rupees",
        "10 rupees"
      ]
    },
    {
      key: "book",
      image: `${ACT2_IMG}/book.png`,
      itemName: "book",
      priceLabel: "Rs. 150.00",
      question: "How much is the book?",
      speakPrompt: "The book is one hundred and fifty rupees.",
      sayAccept: [
        "the book is one hundred and fifty rupees",
        "the book is one hundred fifty rupees",
        "the book is a hundred and fifty rupees",
        "the book is 150 rupees",
        "book is one hundred and fifty rupees",
        "book is 150 rupees",
        "one hundred and fifty rupees",
        "one hundred fifty rupees",
        "150 rupees"
      ]
    }
  ]
};

const ACT3_IMG = "/level-test/english/grade-4/images/level%204/activity%203";

/**
 * Grade 4 English — Level 4 — Activity 3: Family Jobs
 * Look at the picture, listen to Nisal's prompt, then say the job sentence aloud.
 */
export const grade4EnglishLevel4Activity3 = {
  id: 3,
  type: "family_job_speak" as const,
  title: "Family Jobs",
  prompt:
    "Look at each picture. Listen to Nisal. Complete the sentence by saying the person's job aloud.",
  hint: "Listen, look at the picture, then say the complete sentence (e.g. “She is a nurse.”).",
  narratorName: "Nisal",
  items: [
    {
      key: "aunt",
      image: `${ACT3_IMG}/nurse.png`,
      relation: "aunt",
      personName: "Ramani",
      job: "nurse",
      promptText: "This is my aunt, Ramani. She is a ______________________",
      listenText: "This is my aunt, Ramani. She is a…",
      speakPrompt: "She is a nurse.",
      sayAccept: ["she is a nurse", "she is nurse", "is a nurse", "a nurse", "nurse"]
    },
    {
      key: "uncle",
      image: `${ACT3_IMG}/farmer.png`,
      relation: "uncle",
      personName: "Nimal",
      job: "farmer",
      promptText: "This is my uncle, Nimal. He is a ______________________",
      listenText: "This is my uncle, Nimal. He is a…",
      speakPrompt: "He is a farmer.",
      sayAccept: ["he is a farmer", "he is farmer", "is a farmer", "a farmer", "farmer"]
    },
    {
      key: "father",
      image: `${ACT3_IMG}/doctor.png`,
      relation: "father",
      personName: "Ravi",
      job: "doctor",
      promptText: "This is my father, Ravi. ______________________",
      listenText: "This is my father, Ravi.",
      speakPrompt: "He is a doctor.",
      sayAccept: ["he is a doctor", "he is doctor", "is a doctor", "a doctor", "doctor"]
    },
    {
      key: "mother",
      image: `${ACT3_IMG}/teacher.png`,
      relation: "mother",
      personName: "Sriyani",
      job: "teacher",
      promptText: "This is my mother, Sriyani. ______________________",
      listenText: "This is my mother, Sriyani.",
      speakPrompt: "She is a teacher.",
      sayAccept: ["she is a teacher", "she is teacher", "is a teacher", "a teacher", "teacher"]
    }
  ]
};

/**
 * Grade 4 English — Level 4 — Activity 4: Smart Shop Conversation
 * Match the best reply to each shopkeeper line, then read the conversation aloud.
 */
export const grade4EnglishLevel4Activity4 = {
  id: 4,
  type: "shop_conversation_match" as const,
  title: "Smart Shop Conversation",
  prompt:
    "You are at a shop! Read what the shopkeeper says and choose the best answer. After completing each dialogue, read the conversation aloud.",
  hint: "Tap a shopkeeper line, then tap the best reply. When the dialogue is complete, read it aloud.",
  replyPool: [
    "I like purple.",
    "Here you are.",
    "I want to buy a shirt.",
    "It's forty rupees.",
    "No, can you show me that one?",
    "No, it's for my son."
  ],
  conversations: [
    {
      key: "shirt",
      title: "Buying a Shirt",
      closingLine: "Here is your shirt.",
      lines: [
        {
          key: "help",
          prompt: "Can I help you?",
          answer: "I want to buy a shirt.",
          sayAccept: [
            "i want to buy a shirt",
            "want to buy a shirt",
            "i want a shirt",
            "buy a shirt"
          ]
        },
        {
          key: "colour",
          prompt: "What colour do you like?",
          answer: "I like purple.",
          sayAccept: ["i like purple", "like purple", "purple"]
        },
        {
          key: "like_one",
          prompt: "Do you like this shirt?",
          answer: "No, can you show me that one?",
          sayAccept: [
            "no can you show me that one",
            "can you show me that one",
            "show me that one",
            "no show me that one"
          ]
        }
      ]
    },
    {
      key: "for_son",
      title: "For My Son",
      closingLine: null as string | null,
      lines: [
        {
          key: "for_you",
          prompt: "Is this shirt for you?",
          answer: "No, it's for my son.",
          sayAccept: [
            "no it s for my son",
            "no its for my son",
            "no it is for my son",
            "it s for my son",
            "its for my son",
            "for my son"
          ]
        },
        {
          key: "give_shirt",
          prompt: "Give me this shirt.",
          answer: "Here you are.",
          sayAccept: ["here you are", "here you go"]
        }
      ]
    },
    {
      key: "handkerchief",
      title: "Buying a Handkerchief",
      closingLine: null as string | null,
      lines: [
        {
          key: "how_much",
          prompt: "How much is this handkerchief?",
          answer: "It's forty rupees.",
          sayAccept: [
            "it s forty rupees",
            "its forty rupees",
            "it is forty rupees",
            "forty rupees",
            "40 rupees",
            "it s 40 rupees",
            "its 40 rupees"
          ]
        }
      ]
    }
  ]
};

export const grade4EnglishLevel4Activities = [
  grade4EnglishLevel4Activity1,
  grade4EnglishLevel4Activity2,
  grade4EnglishLevel4Activity3,
  grade4EnglishLevel4Activity4
];
