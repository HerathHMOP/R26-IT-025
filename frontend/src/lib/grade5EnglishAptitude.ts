import type { Grade2Activity } from "@/lib/grade2EnglishAptitude";

const IMG_BASE = "/aptitude-test/english/grade-5/images";
const ACT2 = `${IMG_BASE}/activity%202`;
const ACT3 = `${IMG_BASE}/activity%203`;
const ACT4 = `${IMG_BASE}/activity%204`;
const ACT5 = `${IMG_BASE}/activity%205`;
const ACT6 = `${IMG_BASE}/activity%206`;
const ACT7 = `${IMG_BASE}/activity%207`;

const ACTION_WORDS = ["sweeping", "watering", "cleaning", "washing"];

const PROVINCE_LABELS: { key: string; text: string }[] = [
  { key: "central", text: "Central province" },
  { key: "western", text: "Western Province" },
  { key: "sabaragamuwa", text: "Sabaragamuwa Province" },
  { key: "southern", text: "Southern Province" },
  { key: "eastern", text: "Eastern Province" },
  { key: "northern", text: "Northern Province" },
  { key: "north_central", text: "North Central Province" },
  { key: "uva", text: "Uva Province" },
  { key: "north_western", text: "North western Province" }
];

const SPORT_OPTIONS = ["Volleyball", "Badminton", "Baseball", "Cricket", "Football"];

/**
 * Drop boxes measured from the white label rectangles on activity-1-map-board.png (535×393).
 * Percents = exact box bounds so overlays match the black-bordered worksheet slots.
 */
export const grade5EnglishActivities: Grade2Activity[] = [
  {
    id: 1,
    type: "map_label_drop",
    prompt: "Activity 1: Name the nine provinces of Sri Lanka. (drag and drop the label to correct place)",
    mapLabelDrop: {
      boardImage: `${IMG_BASE}/activity-1-map-board.png`,
      guideImage: `${IMG_BASE}/activity-1-guide.png`,
      boardAspectRatio: 535 / 393,
      labels: PROVINCE_LABELS,
      zones: [
        { key: "northern", box: { left: 61.87, top: 4.58, width: 17.94, height: 8.4 } },
        { key: "north_central", box: { left: 67.66, top: 24.43, width: 17.76, height: 8.4 } },
        { key: "north_western", box: { left: 3.55, top: 33.08, width: 17.76, height: 8.14 } },
        { key: "eastern", box: { left: 73.27, top: 41.48, width: 17.76, height: 8.4 } },
        { key: "central", box: { left: 76.26, top: 57.0, width: 17.94, height: 8.4 } },
        { key: "western", box: { left: 4.49, top: 61.58, width: 17.76, height: 8.4 } },
        { key: "uva", box: { left: 74.02, top: 79.13, width: 17.94, height: 8.4 } },
        { key: "southern", box: { left: 21.5, top: 87.28, width: 17.94, height: 8.4 } },
        { key: "sabaragamuwa", box: { left: 54.58, top: 88.8, width: 17.94, height: 8.4 } }
      ],
      answerMap: {
        northern: "northern",
        north_central: "north_central",
        north_western: "north_western",
        eastern: "eastern",
        central: "central",
        western: "western",
        uva: "uva",
        southern: "southern",
        sabaragamuwa: "sabaragamuwa"
      }
    }
  },
  {
    id: 2,
    type: "image_rows",
    prompt: "Activity 2: Match the picture to the sport.\n\n[ Volleyball / Badminton / Baseball / Cricket / Football ]",
    imageRows: [
      { key: "badminton", image: `${ACT2}/badminton.png`, options: SPORT_OPTIONS, answer: "Badminton" },
      { key: "volleyball", image: `${ACT2}/volleyball.png`, options: SPORT_OPTIONS, answer: "Volleyball" },
      { key: "baseball", image: `${ACT2}/baseball.png`, options: SPORT_OPTIONS, answer: "Baseball" },
      { key: "cricket", image: `${ACT2}/cricket.png`, options: SPORT_OPTIONS, answer: "Cricket" },
      { key: "football", image: `${ACT2}/football.png`, options: SPORT_OPTIONS, answer: "Football" }
    ]
  },
  {
    id: 3,
    type: "image_rows",
    prompt: "Activity 3: Select the correct pronoun.",
    imageRows: [
      {
        key: "clock",
        image: `${ACT3}/clock.png`,
        label: "The clock is on the wall. → ________ is on the wall.",
        options: ["He", "She", "It"],
        answer: "It"
      },
      {
        key: "mother",
        image: `${ACT3}/mother.png`,
        label: "Mother is in the kitchen. → ________ is in the kitchen.",
        options: ["It", "She", "He"],
        answer: "She"
      },
      {
        key: "father",
        image: `${ACT3}/father.png`,
        label: "The father is working. → ________ is working.",
        options: ["She", "He"],
        answer: "He"
      },
      {
        key: "dog",
        image: `${ACT3}/dog.png`,
        label: "The dog is sleeping under the tree. → ________ is sleeping under the tree.",
        options: ["She", "It", "He"],
        answer: "It"
      },
      {
        key: "nimal",
        image: `${ACT3}/playing.png`,
        label: "Nimal is playing cricket. → ________ is playing cricket.",
        options: ["He", "She"],
        answer: "He"
      }
    ]
  },
  {
    id: 4,
    type: "drag_number_order",
    prompt: "Activity 4: Drag and drop images to the below box to show the correct order of planting a seed.",
    dragNumberOrder: {
      title: "Planting a seed — correct order",
      targetOrder: [1, 2, 3, 4, 5],
      cards: [
        {
          key: "put-seed",
          number: 1,
          image: `${ACT4}/2.png`,
          label: "Put the seed into a small hole"
        },
        {
          key: "cover-soil",
          number: 2,
          image: `${ACT4}/1.png`,
          label: "Cover the seed with soil."
        },
        {
          key: "water-seed",
          number: 3,
          image: `${ACT4}/3.png`,
          label: "Water the seed every day"
        },
        {
          key: "sunny-place",
          number: 4,
          image: `${ACT4}/4.png`,
          label: "Put the pot in a sunny place"
        },
        {
          key: "wait-buds",
          number: 5,
          image: `${ACT4}/5.png`,
          label: "Wait for five or six days. Notice the buds"
        }
      ]
    }
  },
  {
    id: 5,
    type: "image_rows",
    prompt: "Activity 5: Choose the correct sound (sh or ch) to complete the words.",
    imageRows: [
      {
        key: "cheese",
        image: `${ACT5}/cheese.png`,
        label: "____eese",
        options: ["sh", "ch"],
        answer: "ch"
      },
      {
        key: "ship",
        image: `${ACT5}/ship.png`,
        label: "____ip",
        options: ["sh", "ch"],
        answer: "sh"
      },
      {
        key: "chair",
        image: `${ACT5}/chair.png`,
        label: "____air",
        options: ["sh", "ch"],
        answer: "ch"
      },
      {
        key: "shoes",
        image: `${ACT5}/shoes.png`,
        label: "____oes",
        options: ["sh", "ch"],
        answer: "sh"
      }
    ]
  },
  {
    id: 6,
    type: "drag_sort_groups",
    prompt: "Activity 6: Drag each activity into the correct column.",
    dragSortGroups: {
      title: "Healthy Habits / Unhealthy Habits",
      groups: [
        { key: "healthy", label: "Healthy Habits", image: `${ACT6}/scroll-left.png` },
        { key: "unhealthy", label: "Unhealthy Habits", image: `${ACT6}/scroll-right.png` }
      ],
      items: [
        { key: "eating-fruits", label: "Eating fruits", answerGroupKey: "healthy" },
        { key: "playing-sports", label: "Playing sports", answerGroupKey: "healthy" },
        { key: "soft-drinks", label: "Drinking soft drinks", answerGroupKey: "unhealthy" },
        { key: "sleeping-early", label: "Sleeping early", answerGroupKey: "healthy" },
        { key: "washing-hands", label: "Washing hands", answerGroupKey: "healthy" },
        { key: "eating-too-many", label: "Eating too many sweets", answerGroupKey: "unhealthy" },
        { key: "drinking-water", label: "Drinking water", answerGroupKey: "healthy" },
        { key: "watching-tv", label: "Watching television all day", answerGroupKey: "unhealthy" }
      ]
    }
  },
  {
    id: 7,
    type: "image_rows",
    prompt:
      "Activity 7: Complete the sentences using the action words in the box.\n\n[ sweeping / watering / cleaning / washing ]",
    imageRows: [
      {
        key: "sweeping",
        image: `${ACT7}/sweeping.png`,
        label: "I help my mother by ________ the floor.",
        options: ACTION_WORDS,
        answer: "sweeping"
      },
      {
        key: "watering",
        image: `${ACT7}/watering.png`,
        label: "I help my father by ________ the plants.",
        options: ACTION_WORDS,
        answer: "watering"
      },
      {
        key: "washing",
        image: `${ACT7}/washing.png`,
        label: "I help my grandmother by ________ the clothes.",
        options: ACTION_WORDS,
        answer: "washing"
      },
      {
        key: "cleaning",
        image: `${ACT7}/cleaning.png`,
        label: "I help my sister by ________ the room.",
        options: ACTION_WORDS,
        answer: "cleaning"
      }
    ]
  },
  {
    id: 8,
    type: "text_rows",
    prompt: "Activity 8: Read the scenario carefully and select the correct answer.",
    textRows: [
      {
        key: "toothache",
        prompt: "1. Amal has a toothache. Who should he visit?",
        options: ["Teacher", "Dentist", "Farmer", "Driver"],
        answer: "Dentist"
      },
      {
        key: "medicine",
        prompt: "2. A child is sick and needs medicine. Who can help?",
        options: ["Doctor", "Carpenter", "Shopkeeper", "Pilot"],
        answer: "Doctor"
      },
      {
        key: "road-repair",
        prompt: "3. A road is damaged after heavy rain. Who helps repair it?",
        options: ["Engineer", "Chef", "Nurse", "Tailor"],
        answer: "Engineer"
      },
      {
        key: "law-order",
        prompt: "4. Which community helper protects people and keeps law and order?",
        options: ["Police Officer", "Fisherman", "Farmer", "Postman"],
        answer: "Police Officer"
      }
    ]
  },
  {
    id: 9,
    type: "text_rows",
    prompt: "Activity 9: Read the problem and choose the correct advice.",
    textRows: [
      {
        key: "headache",
        prompt: "1. I have a headache.",
        options: ["Take rest.", "Play outside."],
        answer: "Take rest."
      },
      {
        key: "stomach-ache",
        prompt: "2. I have a stomach ache.",
        options: ["Eat junk food.", "Visit the doctor."],
        answer: "Visit the doctor."
      },
      {
        key: "sore-throat",
        prompt: "3. I have a sore throat.",
        options: ["Drink cold water.", "Gargle with salt water."],
        answer: "Gargle with salt water."
      },
      {
        key: "toothache-advice",
        prompt: "4. I have a toothache.",
        options: ["Go to the dentist.", "Eat a lot of sweets."],
        answer: "Go to the dentist."
      },
      {
        key: "cold-fever",
        prompt: "5. I have a cold and a fever.",
        options: ["Play outside.", "Get plenty of rest."],
        answer: "Get plenty of rest."
      }
    ]
  },
  {
    id: 10,
    type: "dialogue_fill",
    prompt: "Activity 10: Complete the dialogue by choosing the correct sentences from the box. (Drag and Drop)",
    dialogueFill: {
      choices: [
        "I fell down in the playground.",
        "Good afternoon, teacher.",
        "Take care of yourself, Rasini. Get well soon.",
        "That's great. Congratulations!",
        "We're fine, thank you. How are you, teacher?"
      ],
      lines: [
        { speaker: "Teacher", text: "Good afternoon, children." },
        {
          speaker: "Students",
          blankKey: "1",
          answer: "Good afternoon, teacher."
        },
        { speaker: "Teacher", text: "So, how are you today?" },
        {
          speaker: "Students",
          blankKey: "2",
          answer: "We're fine, thank you. How are you, teacher?"
        },
        { speaker: "Teacher", text: "I'm fine too. Thanks." },
        { speaker: "Kalpa", text: "Teacher, Nizam won the first place in the 100 metres race." },
        {
          speaker: "Teacher",
          blankKey: "3",
          answer: "That's great. Congratulations!"
        },
        { speaker: "Nizam", text: "Thank you, teacher." },
        { speaker: "Teacher", text: "By the way, Rasini, what happened to your arm?" },
        {
          speaker: "Rasini",
          blankKey: "4",
          answer: "I fell down in the playground."
        },
        { speaker: "Teacher", text: "Be careful when you play." },
        { speaker: "Rasini", text: "Yes, teacher." },
        {
          speaker: "Teacher",
          blankKey: "5",
          answer: "Take care of yourself, Rasini. Get well soon."
        },
        { speaker: "Rasini", text: "Thank you, teacher." }
      ]
    }
  }
];
