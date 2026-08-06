import type { Grade2Activity } from "@/lib/grade2EnglishAptitude";

const IMG_BASE = "/aptitude-test/english/grade-4/images";

export const grade4EnglishActivities: Grade2Activity[] = [
  {
    id: 1,
    type: "match_letters",
    prompt: "Activity 1: Match the capital letter to the simple letter",
    leftItems: ["A", "B", "C", "D", "E"],
    rightItems: ["a", "b", "c", "d", "e"],
    matchAnswerMap: { A: "a", B: "b", C: "c", D: "d", E: "e" }
  },
  {
    id: 2,
    type: "match_pictures",
    prompt: "Activity 2: Match the picture with the correct word",
    leftItems: ["Mother", "Book", "Flower", "Dog", "Red"],
    rightItems: ["Mother", "Book", "Flower", "Dog", "Red"],
    matchAnswerMap: {
      Mother: "Mother",
      Book: "Book",
      Flower: "Flower",
      Dog: "Dog",
      Red: "Red"
    },
    pictureOptions: [
      { label: "Mother", image: `${IMG_BASE}/mother.png` },
      { label: "Book", image: `${IMG_BASE}/book.png` },
      { label: "Flower", image: `${IMG_BASE}/flower.png` },
      { label: "Dog", image: `${IMG_BASE}/dog.png` },
      { label: "Red", image: `${IMG_BASE}/red.png` }
    ]
  },
  {
    id: 3,
    type: "image_rows",
    prompt: "Activity 3: Match the worker to the place they work",
    imageRows: [
      { key: "doctor", image: `${IMG_BASE}/hospital.png`, options: ["Doctor", "Teacher"], answer: "Doctor" },
      { key: "farmer", image: `${IMG_BASE}/paddy.png`, options: ["Farmer", "Postman"], answer: "Farmer" },
      { key: "postman", image: `${IMG_BASE}/police s.png`, options: ["Postman", "Doctor"], answer: "Postman" },
      { key: "teacher", image: `${IMG_BASE}/school.png`, options: ["Teacher", "Farmer"], answer: "Teacher" }
    ]
  },
  {
    id: 4,
    type: "image_rows",
    prompt: "Activity 4: Match body parts to pictures",
    imageRows: [
      { key: "head", image: `${IMG_BASE}/head.jpg`, options: ["Head", "Hand"], answer: "Head" },
      { key: "elbow", image: `${IMG_BASE}/elbow.jpg`, options: ["Elbow", "Knee"], answer: "Elbow" },
      { key: "knee", image: `${IMG_BASE}/knee.jpg`, options: ["Nose", "Knee"], answer: "Knee" },
      { key: "hand", image: `${IMG_BASE}/hand.jpg`, options: ["Hand", "Mouth"], answer: "Hand" },
      { key: "mouth", image: `${IMG_BASE}/mouth.jpg`, options: ["Mouth", "Eyes"], answer: "Mouth" }
    ]
  },
  {
    id: 5,
    type: "image_rows",
    prompt: "Activity 5: Rearrange letters and choose the correct word for each picture",
    imageRows: [
      { key: "fish", image: `${IMG_BASE}/fish.png`, options: ["tfia", "fish"], answer: "fish" },
      { key: "six", image: `${IMG_BASE}/6.png`, options: ["sxi", "six"], answer: "six" },
      { key: "bin", image: `${IMG_BASE}/bin.png`, options: ["bni", "bin"], answer: "bin" },
      { key: "lip", image: `${IMG_BASE}/lip.png`, options: ["lpi", "lip"], answer: "lip" }
    ]
  },
  {
    id: 6,
    type: "match_letters",
    prompt: "Activity 6: Match mixed words to make proper sentences",
    leftItems: [
      "This / a / is / mosque",
      "a / This / is / playground",
      "is / This / a / railway station",
      "a / is / There / church / in / picture",
      "Nisal / to / library / goes / at / Weekends / the"
    ],
    rightItems: [
      "This is a mosque",
      "This is a playground",
      "This is a railway station",
      "There is a church in picture",
      "Nisal goes to the library at Weekends"
    ],
    matchAnswerMap: {
      "This / a / is / mosque": "This is a mosque",
      "a / This / is / playground": "This is a playground",
      "is / This / a / railway station": "This is a railway station",
      "a / is / There / church / in / picture": "There is a church in picture",
      "Nisal / to / library / goes / at / Weekends / the": "Nisal goes to the library at Weekends"
    }
  },
  {
    id: 7,
    type: "match_letters",
    prompt: "Activity 7: Find the hidden jobs and match clue to word",
    leftItems: ["Find Teacher", "Find Policemen", "Find Doctor", "Find Nurse"],
    rightItems: ["Teacher", "Policemen", "Doctor", "Nurse"],
    matchAnswerMap: {
      "Find Teacher": "Teacher",
      "Find Policemen": "Policemen",
      "Find Doctor": "Doctor",
      "Find Nurse": "Nurse"
    }
  },
  {
    id: 8,
    type: "text_rows",
    prompt: "Activity 8: Read and choose the correct word from the word box",
    textRows: [
      { key: "mickey", prompt: "Mickey's shoes are ____", options: ["red", "blue"], answer: "red" },
      { key: "minnie", prompt: "Minnie's frock has ____", options: ["dots", "ears"], answer: "dots" },
      { key: "donald", prompt: "Donald has a ____ hat", options: ["yellow", "red"], answer: "yellow" },
      { key: "pluto", prompt: "Pluto has long ____", options: ["ears", "dots"], answer: "ears" },
      { key: "winnie", prompt: "Winnie's shirt is ____", options: ["blue", "yellow"], answer: "blue" }
    ]
  },
  {
    id: 9,
    type: "text_rows",
    prompt: "Activity 9: Read the sentence and choose the correct word",
    textRows: [
      { key: "s1a", prompt: "I like ____ shoes.", options: ["this", "these"], answer: "these" },
      { key: "s1b", prompt: "____ are brown.", options: ["It", "They"], answer: "They" },
      { key: "s2a", prompt: "I like ____ cap.", options: ["this", "that"], answer: "this" },
      { key: "s2b", prompt: "____ is purple.", options: ["It", "They"], answer: "It" },
      { key: "s3a", prompt: "I like ____ socks.", options: ["these", "those"], answer: "those" },
      { key: "s3b", prompt: "____ are blue.", options: ["It", "They"], answer: "They" }
    ]
  },
  {
    id: 10,
    type: "match_letters",
    prompt: "Activity 10: Match the shopkeeper sentence with the best reply",
    leftItems: [
      "Can I help you?",
      "How much is this handkerchief?",
      "Give me this shirt.",
      "What colour do you like?",
      "Is this shirt for you?",
      "Do you like this one?"
    ],
    rightItems: [
      "I want to buy a shirt.",
      "It's forty rupees.",
      "Here you are.",
      "I like purple.",
      "No, it's for my son.",
      "No, can you show me that one?"
    ],
    matchAnswerMap: {
      "Can I help you?": "I want to buy a shirt.",
      "How much is this handkerchief?": "It's forty rupees.",
      "Give me this shirt.": "Here you are.",
      "What colour do you like?": "I like purple.",
      "Is this shirt for you?": "No, it's for my son.",
      "Do you like this one?": "No, can you show me that one?"
    }
  },
  {
    id: 11,
    type: "match_letters",
    prompt: "Activity 11: Put the days of the week in order",
    leftItems: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"],
    rightItems: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    matchAnswerMap: {
      "1st": "Monday",
      "2nd": "Tuesday",
      "3rd": "Wednesday",
      "4th": "Thursday",
      "5th": "Friday",
      "6th": "Saturday",
      "7th": "Sunday"
    }
  },
  {
    id: 12,
    type: "text_rows",
    prompt: "Activity 12: Select the correct verb",
    textRows: [
      { key: "v1", prompt: "On Monday, Senuri ____ chess.", options: ["reads", "plays"], answer: "plays" },
      { key: "v2", prompt: "On Tuesday, she ____ swimming.", options: ["goes", "plays"], answer: "goes" },
      { key: "v3", prompt: "On Wednesday, she ____ with her sister.", options: ["reads", "plays"], answer: "plays" },
      { key: "v4", prompt: "On Thursday, she ____ the plants in her garden.", options: ["waters", "reads"], answer: "waters" }
    ]
  },
  {
    id: 13,
    type: "select_words",
    prompt: "Activity 13: Circle words that sound like 'good'",
    wordOptions: ["shoe", "tool", "glue", "suit", "cool", "put", "cook", "good", "look", "ruler", "foot", "sugar"],
    correctWords: ["good", "look", "cook", "foot"]
  },
  {
    id: 14,
    type: "image_rows",
    prompt: "Activity 14: Label the festive food",
    imageRows: [
      { key: "vadei", image: `${IMG_BASE}/vadei.png`, options: ["vadai", "kokis"], answer: "vadai" },
      { key: "milkrice", image: `${IMG_BASE}/mikrice.png`, options: ["milkrice", "kevum"], answer: "milkrice" },
      { key: "kevum", image: `${IMG_BASE}/kevum.png`, options: ["banana", "kevum"], answer: "kevum" },
      { key: "kokis", image: `${IMG_BASE}/kokis.png`, options: ["cake", "kokis"], answer: "kokis" },
      { key: "cake", image: `${IMG_BASE}/cake.png`, options: ["cake", "vatalappam"], answer: "cake" },
      { key: "vatalappam", image: `${IMG_BASE}/vatalappam.png`, options: ["vatalappam", "banana"], answer: "vatalappam" }
    ]
  },
  {
    id: 15,
    type: "text_rows",
    prompt: "Activity 15: Read and complete",
    textRows: [
      {
        key: "p1",
        prompt: "It's the school holiday. Nisal and ____ family are going to Kandy.",
        options: ["his", "her"],
        answer: "his"
      },
      {
        key: "p2",
        prompt: "We greet ____ teacher.",
        options: ["our", "his"],
        answer: "our"
      },
      {
        key: "p3",
        prompt: "On Sunday, Senuri visits ____ grandparents.",
        options: ["her", "my"],
        answer: "her"
      },
      {
        key: "p4",
        prompt: "I buy a new shirt for ____ brother.",
        options: ["my", "our"],
        answer: "my"
      },
      {
        key: "p5",
        prompt: "Nisal and Rasin visit ____ friend Kumar for the new year.",
        options: ["their", "our"],
        answer: "their"
      }
    ]
  }
];
