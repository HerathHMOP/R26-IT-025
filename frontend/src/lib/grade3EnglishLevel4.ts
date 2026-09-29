/**
 * Grade 3 English — Level 4 — Activity 1: Read a paragraph and answer orally.
 */
export const grade3EnglishLevel4Activity1 = {
  id: 1,
  type: "read_answer_oral" as const,
  title: "About Nethu",
  prompt:
    "Read the paragraph carefully. Tap the microphone button. Listen to the question. Answer using a complete sentence (Oral Response).",
  hint: "Read the card carefully. Listen to each question, then answer in a complete sentence.",
  paragraphTitle: "Reading Card",
  lines: [
    "Hello!",
    "My name is Nethu.",
    "I am nine years old.",
    "I live in Matara.",
    "I study in Grade 3.",
    "I have a brown dog named Rex.",
    "I like playing with my dog after school."
  ],
  questions: [
    {
      key: "age",
      question: "How old is Nethu?",
      sampleAnswers: ["Nethu is nine years old.", "She is nine years old."],
      sayAccept: [
        "nethu is nine years old",
        "she is nine years old",
        "nethu is 9 years old",
        "she is 9 years old",
        "nine years old",
        "she is nine"
      ]
    },
    {
      key: "live",
      question: "Where does Nethu live?",
      sampleAnswers: ["Nethu lives in Matara.", "She lives in Matara."],
      sayAccept: [
        "nethu lives in matara",
        "she lives in matara",
        "lives in matara",
        "in matara"
      ]
    },
    {
      key: "dog_name",
      question: "What is the name of Nethu's dog?",
      sampleAnswers: ["Her dog's name is Rex.", "The dog is named Rex."],
      sayAccept: [
        "her dog s name is rex",
        "her dogs name is rex",
        "the dog is named rex",
        "the dog s name is rex",
        "the dogs name is rex",
        "his name is rex",
        "the dog is rex",
        "rex"
      ]
    },
    {
      key: "dog_colour",
      question: "What colour is the dog?",
      sampleAnswers: ["The dog is brown."],
      sayAccept: [
        "the dog is brown",
        "it is brown",
        "nethu s dog is brown",
        "her dog is brown",
        "brown"
      ]
    },
    {
      key: "after_school",
      question: "What does Nethu like to do after school?",
      sampleAnswers: ["She likes playing with her dog after school."],
      sayAccept: [
        "she likes playing with her dog after school",
        "she likes to play with her dog after school",
        "nethu likes playing with her dog after school",
        "playing with her dog after school",
        "she likes playing with her dog",
        "play with her dog after school"
      ]
    }
  ]
};

const ACT2_IMG = "/level-test/english/grade-3/images/level%204/activity%202";

/**
 * Grade 3 English — Level 4 — Activity 2: How I come to school (look, choose, say).
 */
export const grade3EnglishLevel4Activity2 = {
  id: 2,
  type: "school_way_speak" as const,
  title: "How I Come to School",
  prompt:
    "Look at the pictures. Choose the way you come to school. Tap the microphone button. Say a complete sentence about how you come to school.",
  hint: "Look at the picture. Choose the way, then say a complete sentence.",
  characterImage: `${ACT2_IMG}/child.png`,
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
      sayAccept: ["i come to school by bus", "i came to school by bus", "by bus"]
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

const ACT3_IMG = "/level-test/english/grade-3/images/level%204/activity%203";

/**
 * Grade 3 English — Level 4 — Activity 3: Match animals with homes, then say sentences.
 * (Lion and bear both live in a den.)
 */
export const grade3EnglishLevel4Activity3 = {
  id: 3,
  type: "animal_home_match_say" as const,
  title: "Animals and Their Homes",
  prompt: "Match animals with their homes and describe the relationship using complete sentences.",
  hint: "Match each animal to its home, then say: “A ____ lives in a ____.”",
  homes: [
    { key: "coop", text: "Coop", image: `${ACT3_IMG}/coop.png` },
    { key: "kennel", text: "Kennel", image: `${ACT3_IMG}/kennel.png` },
    { key: "pond", text: "Pond", image: `${ACT3_IMG}/pond.png` },
    { key: "den", text: "Den", image: `${ACT3_IMG}/den.png` },
    { key: "hive", text: "Hive", image: `${ACT3_IMG}/hive.png` },
    { key: "burrow", text: "Burrow", image: `${ACT3_IMG}/burrow.png` },
    { key: "nest", text: "Nest", image: `${ACT3_IMG}/nest.png` }
  ],
  animals: [
    {
      key: "rabbit",
      name: "rabbit",
      image: `${ACT3_IMG}/rabbit.png`,
      home: "burrow",
      speakPrompt: "A rabbit lives in a burrow.",
      sayAccept: [
        "a rabbit lives in a burrow",
        "the rabbit lives in a burrow",
        "rabbit lives in a burrow",
        "rabbits live in a burrow"
      ]
    },
    {
      key: "lion",
      name: "lion",
      image: `${ACT3_IMG}/lion.png`,
      home: "den",
      speakPrompt: "A lion lives in a den.",
      sayAccept: [
        "a lion lives in a den",
        "the lion lives in a den",
        "lion lives in a den",
        "lions live in a den"
      ]
    },
    {
      key: "bear",
      name: "bear",
      image: `${ACT3_IMG}/bear.png`,
      home: "den",
      speakPrompt: "A bear lives in a den.",
      sayAccept: [
        "a bear lives in a den",
        "the bear lives in a den",
        "bear lives in a den",
        "bears live in a den"
      ]
    },
    {
      key: "bird",
      name: "bird",
      image: `${ACT3_IMG}/bird.png`,
      home: "nest",
      speakPrompt: "A bird lives in a nest.",
      sayAccept: [
        "a bird lives in a nest",
        "the bird lives in a nest",
        "bird lives in a nest",
        "birds live in a nest"
      ]
    },
    {
      key: "bee",
      name: "bee",
      image: `${ACT3_IMG}/bee.png`,
      home: "hive",
      speakPrompt: "A bee lives in a hive.",
      sayAccept: [
        "a bee lives in a hive",
        "the bee lives in a hive",
        "bee lives in a hive",
        "bees live in a hive"
      ]
    },
    {
      key: "fish",
      name: "fish",
      image: `${ACT3_IMG}/fish.png`,
      home: "pond",
      speakPrompt: "A fish lives in a pond.",
      sayAccept: [
        "a fish lives in a pond",
        "the fish lives in a pond",
        "fish lives in a pond",
        "fish live in a pond"
      ]
    },
    {
      key: "hen",
      name: "hen",
      image: `${ACT3_IMG}/hen.png`,
      home: "coop",
      speakPrompt: "A hen lives in a coop.",
      sayAccept: [
        "a hen lives in a coop",
        "the hen lives in a coop",
        "hen lives in a coop",
        "hens live in a coop"
      ]
    },
    {
      key: "dog",
      name: "dog",
      image: `${ACT3_IMG}/dog.png`,
      home: "kennel",
      speakPrompt: "A dog lives in a kennel.",
      sayAccept: [
        "a dog lives in a kennel",
        "the dog lives in a kennel",
        "dog lives in a kennel",
        "dogs live in a kennel"
      ]
    }
  ],
  answerMap: {
    rabbit: "burrow",
    lion: "den",
    bear: "den",
    bird: "nest",
    bee: "hive",
    fish: "pond",
    hen: "coop",
    dog: "kennel"
  }
};

/**
 * Grade 3 English — Level 4 — Activity 4: Read a short story aloud.
 */
export const grade3EnglishLevel4Activity4 = {
  id: 4,
  type: "read_story_aloud" as const,
  title: "Read the Story",
  prompt: "Read a short story aloud with correct pronunciation and expression.",
  hint: "Listen to the story, then read it aloud clearly with expression.",
  storyTitle: "Story",
  lines: [
    {
      parts: [
        { text: "Three friends", highlight: true },
        { text: " from the village went to the " },
        { text: "zoo", highlight: true },
        { text: " on Saturday." }
      ]
    },
    {
      parts: [{ text: "They travelled in a blue van." }]
    },
    {
      parts: [
        { text: "At the " },
        { text: "zoo", highlight: true },
        { text: " they saw a " },
        { text: "zebra", highlight: true },
        { text: ", a lion and a rabbit." }
      ]
    },
    {
      parts: [
        { text: "The " },
        { text: "children", highlight: true },
        { text: " watched the animals carefully." }
      ]
    },
    {
      parts: [
        { text: "Before going home, they thanked the " },
        { text: "zoo", highlight: true },
        { text: " keeper for a wonderful day." }
      ]
    }
  ],
  /** Full story for TTS. */
  fullText:
    "Three friends from the village went to the zoo on Saturday. They travelled in a blue van. At the zoo they saw a zebra, a lion and a rabbit. The children watched the animals carefully. Before going home, they thanked the zoo keeper for a wonderful day.",
  /** Phrases accepted when the student reads aloud (partial matches OK). */
  sayAccept: [
    "three friends from the village",
    "went to the zoo",
    "travelled in a blue van",
    "traveled in a blue van",
    "saw a zebra",
    "a lion and a rabbit",
    "children watched the animals",
    "thanked the zoo keeper",
    "wonderful day"
  ]
};

export const grade3EnglishLevel4Activities = [
  grade3EnglishLevel4Activity1,
  grade3EnglishLevel4Activity2,
  grade3EnglishLevel4Activity3,
  grade3EnglishLevel4Activity4
];
