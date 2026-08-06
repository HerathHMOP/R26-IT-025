import type { Grade2Activity } from "@/lib/grade2EnglishAptitude";

const IMG_BASE = "/aptitude-test/english/grade-3/images";

export const grade3EnglishActivities: Grade2Activity[] = [
  {
    id: 1,
    type: "number_rows",
    prompt: "Activity 1: Match number groups with number words",
    numberRows: [
      { key: "n1", number: "1", options: ["One", "Three"], answer: "One" },
      { key: "n2", number: "2", options: ["Two", "Four"], answer: "Two" },
      { key: "n3", number: "3", options: ["Three", "Five"], answer: "Three" },
      { key: "n4", number: "4", options: ["Four", "Six"], answer: "Four" },
      { key: "n5", number: "5", options: ["Five", "Seven"], answer: "Five" },
      { key: "n6", number: "6", options: ["Six", "Eight"], answer: "Six" },
      { key: "n7", number: "7", options: ["Seven", "Nine"], answer: "Seven" },
      { key: "n8", number: "8", options: ["Eight", "Ten"], answer: "Eight" },
      { key: "n9", number: "9", options: ["Nine", "One"], answer: "Nine" },
      { key: "n10", number: "10", options: ["Ten", "Two"], answer: "Ten" }
    ]
  },
  {
    id: 2,
    type: "image_rows",
    prompt: "Activity 2: My pets - match each picture to the correct name",
    imageRows: [
      { key: "cat", image: `${IMG_BASE}/cat.png`, options: ["Cow", "Cat"], answer: "Cat" },
      { key: "dog", image: `${IMG_BASE}/dog.png`, options: ["Fish", "Dog"], answer: "Dog" },
      { key: "rabbit", image: `${IMG_BASE}/rabbit.png`, options: ["Parrot", "Rabbit"], answer: "Rabbit" },
      { key: "parrot", image: `${IMG_BASE}/parrot.png`, options: ["Dog", "Parrot"], answer: "Parrot" },
      { key: "fish", image: `${IMG_BASE}/fish.png`, options: ["Cat", "Fish"], answer: "Fish" },
      { key: "cow", image: `${IMG_BASE}/cow.png`, options: ["Rabbit", "Cow"], answer: "Cow" }
    ]
  },
  {
    id: 3,
    type: "image_rows",
    prompt: "Activity 3: Build sentence by matching picture to sentence",
    imageRows: [
      { key: "fish", image: `${IMG_BASE}/fish.png`, options: ["This is a fish", "This is a cat"], answer: "This is a fish" },
      { key: "cat", image: `${IMG_BASE}/cat.png`, options: ["This is a cat", "This is a dog"], answer: "This is a cat" },
      { key: "dog", image: `${IMG_BASE}/dog.png`, options: ["This is a rabbit", "This is a dog"], answer: "This is a dog" },
      { key: "rabbit", image: `${IMG_BASE}/rabbit.png`, options: ["This is a fish", "This is a rabbit"], answer: "This is a rabbit" },
      { key: "cow", image: `${IMG_BASE}/cow.png`, options: ["This is a cow", "This is a parrot"], answer: "This is a cow" },
      { key: "parrot", image: `${IMG_BASE}/parrot.png`, options: ["This is a horse", "This is a parrot"], answer: "This is a parrot" }
    ]
  },
  {
    id: 4,
    type: "image_rows",
    prompt: "Activity 4: Rearrange letters (choose correct word for each picture)",
    imageRows: [
      { key: "dog", image: `${IMG_BASE}/dog.png`, options: ["gdo", "dog"], answer: "dog" },
      { key: "fish", image: `${IMG_BASE}/fish.png`, options: ["fhis", "fish"], answer: "fish" },
      { key: "cat", image: `${IMG_BASE}/cat.png`, options: ["tac", "cat"], answer: "cat" },
      { key: "parrot", image: `${IMG_BASE}/parrot.png`, options: ["rrapto", "parrot"], answer: "parrot" }
    ]
  },
  {
    id: 5,
    type: "image_rows",
    prompt: "Activity 5: My home - match each person to the correct name",
    imageRows: [
      { key: "father", image: `${IMG_BASE}/father.png`, options: ["Brother", "Father"], answer: "Father" },
      { key: "mother", image: `${IMG_BASE}/mother.png`, options: ["Sister", "Mother"], answer: "Mother" },
      { key: "brother", image: `${IMG_BASE}/brother.png`, options: ["Mother", "Brother"], answer: "Brother" },
      { key: "sister", image: `${IMG_BASE}/sister.png`, options: ["Father", "Sister"], answer: "Sister" }
    ]
  },
  {
    id: 6,
    type: "image_rows",
    prompt: "Activity 6: Rearrange words for family members",
    imageRows: [
      { key: "father", image: `${IMG_BASE}/father.png`, options: ["rahfte", "father"], answer: "father" },
      { key: "mother", image: `${IMG_BASE}/mother.png`, options: ["rohtem", "mother"], answer: "mother" },
      { key: "brother", image: `${IMG_BASE}/brother.png`, options: ["bohrtre", "brother"], answer: "brother" },
      { key: "sister", image: `${IMG_BASE}/sister.png`, options: ["isstre", "sister"], answer: "sister" },
      { key: "grandma", image: `${IMG_BASE}/Grand mother.png`, options: ["gndrema", "grandma"], answer: "grandma" }
    ]
  },
  {
    id: 7,
    type: "image_rows",
    prompt: "Activity 7: Match the picture to the correct greeting",
    imageRows: [
      { key: "night", image: `${IMG_BASE}/night.png`, options: ["Good afternoon", "Good night"], answer: "Good night" },
      { key: "evening", image: `${IMG_BASE}/evening.png`, options: ["Good evening", "Good morning"], answer: "Good evening" },
      { key: "afternoon", image: `${IMG_BASE}/afternoon.png`, options: ["Good afternoon", "Good night"], answer: "Good afternoon" },
      { key: "morning", image: `${IMG_BASE}/morning.png`, options: ["Good morning", "Good evening"], answer: "Good morning" }
    ]
  },
  {
    id: 8,
    type: "image_rows",
    prompt: "Activity 8: Match each daily action picture to the correct word",
    imageRows: [
      { key: "play", image: `${IMG_BASE}/play.png`, options: ["play", "write"], answer: "play" },
      { key: "wash", image: `${IMG_BASE}/wash.png`, options: ["wash", "watch"], answer: "wash" },
      { key: "brush", image: `${IMG_BASE}/brush.png`, options: ["brush", "drink"], answer: "brush" },
      { key: "bathe", image: `${IMG_BASE}/bathe.png`, options: ["bathe", "go"], answer: "bathe" },
      { key: "watch", image: `${IMG_BASE}/watch.png`, options: ["watch", "sleep"], answer: "watch" },
      { key: "drink", image: `${IMG_BASE}/drink.png`, options: ["drink", "play"], answer: "drink" },
      { key: "write", image: `${IMG_BASE}/write.png`, options: ["write", "brush"], answer: "write" },
      { key: "go", image: `${IMG_BASE}/go.png`, options: ["go", "bathe"], answer: "go" },
      { key: "sleep", image: `${IMG_BASE}/sleep.png`, options: ["sleep", "wash"], answer: "sleep" }
    ]
  },
  {
    id: 9,
    type: "image_rows",
    prompt: "Activity 9: Find the correct color and match with the word",
    imageRows: [
      { key: "white", image: `${IMG_BASE}/white.png`, options: ["white", "black"], answer: "white" },
      { key: "green", image: `${IMG_BASE}/green.png`, options: ["green", "blue"], answer: "green" },
      { key: "blue", image: `${IMG_BASE}/blue.png`, options: ["blue", "yellow"], answer: "blue" },
      { key: "orange", image: `${IMG_BASE}/orange.png`, options: ["orange", "red"], answer: "orange" },
      { key: "red", image: `${IMG_BASE}/red.png`, options: ["red", "white"], answer: "red" },
      { key: "black", image: `${IMG_BASE}/black.png`, options: ["black", "green"], answer: "black" },
      { key: "yellow", image: `${IMG_BASE}/yellow.png`, options: ["yellow", "orange"], answer: "yellow" }
    ]
  },
  {
    id: 10,
    type: "image_rows",
    prompt: "Activity 10: Match each picture with the correct place in school",
    imageRows: [
      { key: "herbal", image: `${IMG_BASE}/hearbel.png`, options: ["herbal garden", "library"], answer: "herbal garden" },
      { key: "playground", image: `${IMG_BASE}/palyground.png`, options: ["playground", "classroom"], answer: "playground" },
      { key: "classroom", image: `${IMG_BASE}/classroom.png`, options: ["classroom", "music room"], answer: "classroom" },
      { key: "principal", image: `${IMG_BASE}/principal office.png`, options: ["principal office", "dancing room"], answer: "principal office" },
      { key: "dancing", image: `${IMG_BASE}/dancing room.png`, options: ["dancing room", "playground"], answer: "dancing room" },
      { key: "music", image: `${IMG_BASE}/music room.png`, options: ["music room", "principal office"], answer: "music room" },
      { key: "library", image: `${IMG_BASE}/library.png`, options: ["library", "herbal garden"], answer: "library" }
    ]
  },
  {
    id: 11,
    type: "image_rows",
    prompt: "Activity 11: Look and name the people",
    imageRows: [
      { key: "principal", image: `${IMG_BASE}/principal.png`, options: ["principal", "teacher"], answer: "principal" },
      { key: "vice", image: `${IMG_BASE}/v principal.png`, options: ["vice principal", "librarian"], answer: "vice principal" },
      { key: "teacher", image: `${IMG_BASE}/teacher.png`, options: ["teacher", "security guard"], answer: "teacher" },
      { key: "librarian", image: `${IMG_BASE}/librarian.png`, options: ["librarian", "principal"], answer: "librarian" },
      { key: "guard", image: `${IMG_BASE}/s guard.png`, options: ["security guard", "vice principal"], answer: "security guard" }
    ]
  },
  {
    id: 12,
    type: "image_rows",
    prompt: "Activity 12: Match each vegetable picture with the correct number",
    imageRows: [
      { key: "tomato", image: `${IMG_BASE}/tomato.png`, options: ["6", "2"], answer: "6" },
      { key: "carrot", image: `${IMG_BASE}/carrot.png`, options: ["2", "5"], answer: "2" },
      { key: "leeks", image: `${IMG_BASE}/leeks.png`, options: ["1", "4"], answer: "1" },
      { key: "pumpkin", image: `${IMG_BASE}/pumpkin.png`, options: ["3", "6"], answer: "3" },
      { key: "potatoes", image: `${IMG_BASE}/potatoes.png`, options: ["5", "1"], answer: "5" },
      { key: "beans", image: `${IMG_BASE}/beans.png`, options: ["4", "3"], answer: "4" }
    ]
  },
  {
    id: 13,
    type: "match_letters",
    prompt: "Activity 13: Read and match (One to singular, Many to plural)",
    leftItems: ["rat", "crow", "parrot", "worm", "monkey"],
    rightItems: ["worms", "monkeys", "rats", "parrots", "crows"],
    matchAnswerMap: {
      rat: "rats",
      crow: "crows",
      parrot: "parrots",
      worm: "worms",
      monkey: "monkeys"
    }
  },
  {
    id: 14,
    type: "match_letters",
    prompt: "Activity 14: Match the animals with their homes",
    leftItems: ["kennel", "coop", "den", "pond", "burrow", "cave", "hive", "nest"],
    rightItems: ["dog", "hen", "lion", "fish", "rabbit", "bear", "bee", "bird"],
    matchAnswerMap: {
      kennel: "dog",
      coop: "hen",
      den: "lion",
      pond: "fish",
      burrow: "rabbit",
      cave: "bear",
      hive: "bee",
      nest: "bird"
    }
  },
  {
    id: 15,
    type: "match_letters",
    prompt: "Activity 15: Match each sentence with the correct reply",
    leftItems: ["How are you?", "What's this?", "Good afternoon!", "This is my new shirt", "May I have a look?"],
    rightItems: ["Good-bye!", "I am fine.", "It's a frock.", "Hello!", "Good afternoon!", "Good luck!", "It's nice.", "Thank you.", "Yes, you may.", "Let's go."],
    matchAnswerMap: {
      "How are you?": "I am fine.",
      "What's this?": "It's a frock.",
      "Good afternoon!": "Good afternoon!",
      "This is my new shirt": "It's nice.",
      "May I have a look?": "Yes, you may."
    }
  }
];
