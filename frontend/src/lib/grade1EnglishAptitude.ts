import type { Grade2Activity } from "@/lib/grade2EnglishAptitude";

const SCHOOL = "/aptitude-test/english/grade-1/Our%20School";
const HOME = "/aptitude-test/english/grade-1/Our%20Home";
const AURUDU = "/aptitude-test/english/grade-1/Aurudu";
const FOOD = "/aptitude-test/english/grade-1/Food";
const PEOPLE = "/aptitude-test/english/grade-1/People";

/**
 * Grade 1 English aptitude activities.
 * Activity 1: circle people who belong to the school (Our School).
 * Activity 2: find animals kept at home and connect them to the house (Our Home).
 * Activity 3: underline New Year (Aurudu) customs.
 * Activity 4: connect plant foods to the tree and animal foods to the cow (Food).
 * Activity 5: choose the matching tool/equipment for each person (People).
 */
export const grade1EnglishActivities: Grade2Activity[] = [
  {
    id: 1,
    type: "select_images",
    prompt: "01. Find and circle the people who belong to the school.",
    selectImageRows: [
      { key: "students", image: `${SCHOOL}/1.jpg`, label: "Students" },
      { key: "nurse", image: `${SCHOOL}/5.jpg`, label: "Nurse" },
      { key: "principal", image: `${SCHOOL}/2.jpg`, label: "Principal" },
      { key: "teacher", image: `${SCHOOL}/3.jpg`, label: "Teacher" },
      { key: "doctor", image: `${SCHOOL}/4.jpg`, label: "Doctor" },
      { key: "fisherman", image: `${SCHOOL}/6.jpg`, label: "Fisherman" },
      { key: "carpenter", image: `${SCHOOL}/7.jpg`, label: "Carpenter" }
    ],
    correctImageKeys: ["students", "principal", "teacher"]
  },
  {
    id: 2,
    type: "select_images",
    prompt: "02. Find the animals kept at home and connect them to the house.",
    image: `${HOME}/8.jpg`,
    selectImageRows: [
      { key: "elephant", image: `${HOME}/7.jpg`, label: "Elephant" },
      { key: "parrot", image: `${HOME}/4.jpg`, label: "Parrot" },
      { key: "squirrel", image: `${HOME}/5.jpg`, label: "Squirrel" },
      { key: "cat", image: `${HOME}/2.jpg`, label: "Cat" },
      { key: "tiger", image: `${HOME}/6.jpg`, label: "Tiger" },
      { key: "snake", image: `${HOME}/3.jpg`, label: "Snake" },
      { key: "dog", image: `${HOME}/1.jpg`, label: "Dog" }
    ],
    correctImageKeys: ["parrot", "cat", "dog"]
  },
  {
    id: 3,
    type: "select_images",
    prompt: "03. Underline the New Year customs.",
    selectImageRows: [
      { key: "milk-boiling", image: `${AURUDU}/1.jpg`, label: "Boiling milk" },
      { key: "family-customs", image: `${AURUDU}/3.jpg`, label: "Family customs" },
      { key: "oil-anointing", image: `${AURUDU}/2.jpg`, label: "Oil anointing" },
      { key: "playground", image: `${AURUDU}/4.jpg`, label: "Playing outside" },
      { key: "watching-tv", image: `${AURUDU}/5.jpg`, label: "Watching TV" }
    ],
    correctImageKeys: ["milk-boiling", "family-customs", "oil-anointing"]
  },
  {
    id: 4,
    type: "drag_sort_groups",
    prompt: "04. Connect plant foods to the tree and animal foods to the cow.",
    dragSortGroups: {
      title: "Sort each food to the tree or the cow",
      groups: [
        { key: "plant", label: "From plants", image: `${FOOD}/9.jpg` },
        { key: "animal", label: "From animals", image: `${FOOD}/10.jpg` }
      ],
      items: [
        { key: "cheese", image: `${FOOD}/5.jpg`, label: "Cheese", answerGroupKey: "animal" },
        { key: "greens", image: `${FOOD}/3.jpg`, label: "Leafy greens", answerGroupKey: "plant" },
        { key: "yogurt", image: `${FOOD}/7.jpg`, label: "Yogurt", answerGroupKey: "animal" },
        { key: "grains", image: `${FOOD}/8.jpg`, label: "Grains", answerGroupKey: "plant" },
        { key: "rice", image: `${FOOD}/1.jpg`, label: "Rice", answerGroupKey: "plant" },
        { key: "vegetables", image: `${FOOD}/4.jpg`, label: "Vegetables", answerGroupKey: "plant" },
        { key: "fruit", image: `${FOOD}/2.jpg`, label: "Fruit", answerGroupKey: "plant" },
        { key: "milk", image: `${FOOD}/6.jpeg`, label: "Milk", answerGroupKey: "animal" }
      ]
    }
  },
  {
    id: 5,
    type: "image_rows",
    prompt: "05. Choose the matching equipment. Tap the correct tool for each person.",
    imageRows: [
      {
        key: "teacher",
        image: `${PEOPLE}/3.jpg`,
        label: "Teacher",
        options: [`${PEOPLE}/1.jpg`, `${PEOPLE}/2.jpg`],
        answer: `${PEOPLE}/1.jpg`
      },
      {
        key: "carpenter",
        image: `${PEOPLE}/4.jpg`,
        label: "Carpenter",
        options: [`${PEOPLE}/2.jpg`, `${PEOPLE}/5.jpg`],
        answer: `${PEOPLE}/5.jpg`
      },
      {
        key: "doctor",
        image: `${PEOPLE}/6.jpg`,
        label: "Doctor",
        options: [`${PEOPLE}/7.jpg`, `${PEOPLE}/8.jpg`],
        answer: `${PEOPLE}/7.jpg`
      },
      {
        key: "cricketer",
        image: `${PEOPLE}/9.jpg`,
        label: "Cricketer",
        options: [`${PEOPLE}/11.jpg`, `${PEOPLE}/10.jpg`],
        answer: `${PEOPLE}/10.jpg`
      }
    ]
  }
];
