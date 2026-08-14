const BASE = "/level-test/pre/level-2/activity-1";
const F1 = `${BASE}/Activity%201`;
const F2 = `${BASE}/Activity%202`;
const F3 = `${BASE}/Activity%203`;

const SHAPE_BASE = "/level-test/pre/level-2/activity-3";
const S1 = `${SHAPE_BASE}/Activity%201`;
const S2 = `${SHAPE_BASE}/Activity%202`;

export type SamePictureTask = {
  key: string;
  numberLabel: string;
  prompt: string;
  targetImage: string;
  targetLabel: string;
  options: { key: string; label: string; image: string }[];
  answer: string;
};

export const preGeneralLevel2Activity1 = {
  id: 1,
  type: "same_picture_match" as const,
  title: "Improve visual discrimination",
  prompt: "Touch the picture that is the same.",
  hint: "Look carefully at the big picture, then choose the matching one.",
  instruction: "Touch the picture that is the same.",
  tip: "Tip: Look carefully and find the same picture!",
  successMessage: "Great job! That picture is the same!",
  pointsPerCorrect: 20,
  tasks: [
    {
      key: "l2a1-flower",
      numberLabel: "01",
      prompt: "Touch the picture that is the same.",
      targetImage: `${F1}/Pink_Flower.png`,
      targetLabel: "Flower",
      options: [
        { key: "A", label: "A", image: `${F1}/A.png` },
        { key: "B", label: "B", image: `${F1}/B.png` },
        { key: "C", label: "C", image: `${F1}/C.png` },
        { key: "D", label: "D", image: `${F1}/D.png` }
      ],
      answer: "A"
    },
    {
      key: "l2a1-fish",
      numberLabel: "02",
      prompt: "Touch the picture that is the same.",
      targetImage: `${F2}/Fish.png`,
      targetLabel: "Fish",
      options: [
        { key: "A", label: "A", image: `${F2}/A.png` },
        { key: "B", label: "B", image: `${F2}/B.png` },
        { key: "C", label: "C", image: `${F2}/C.png` },
        { key: "D", label: "D", image: `${F2}/D.png` }
      ],
      answer: "A"
    },
    {
      key: "l2a1-car",
      numberLabel: "03",
      prompt: "Touch the picture that is the same.",
      targetImage: `${F3}/Car.png`,
      targetLabel: "Car",
      options: [
        { key: "A", label: "A", image: `${F3}/A.png` },
        { key: "B", label: "B", image: `${F3}/B.png` },
        { key: "C", label: "C", image: `${F3}/C.png` },
        { key: "D", label: "D", image: `${F3}/D.png` }
      ],
      answer: "A"
    }
  ] satisfies SamePictureTask[]
};

export const preGeneralLevel2Activity2 = {
  id: 2,
  type: "shape_detective" as const,
  title: "Shape Detective",
  prompt: "Look at each picture and choose the shapes you can find inside it.",
  hint: "Select every shape you can see in the numbered picture, then check.",
  instruction: "Shape Detective! Look at each picture and choose the shapes you can find inside it.",
  tip: "Tip: Look carefully at each picture and find the shapes!",
  successMessage: "Nice detective work!",
  pointsPerCorrect: 15,
  voiceAudio: `${SHAPE_BASE}/Q3.mp3`,
  tipAudio: `${SHAPE_BASE}/Tips.mp3`,
  shapes: [
    { key: "circle", label: "Circle", tone: "#43a047" },
    { key: "triangle", label: "Triangle", tone: "#e53935" },
    { key: "square", label: "Square", tone: "#1e88e5" },
    { key: "rectangle", label: "Rectangle", tone: "#fb8c00" },
    { key: "oval", label: "Oval", tone: "#8e24aa" }
  ],
  tasks: [
    {
      key: "l2a2-train",
      numberLabel: "01",
      objectLabel: "Train",
      objectNumber: 1,
      sceneImage: `${S1}/Activity.png`,
      prompt: "Which shapes are in the train?",
      targets: ["circle", "square", "rectangle"]
    },
    {
      key: "l2a2-boat",
      numberLabel: "02",
      objectLabel: "Sailboat",
      objectNumber: 2,
      sceneImage: `${S1}/Activity.png`,
      prompt: "Which shapes are in the sailboat?",
      targets: ["triangle", "circle", "oval"]
    },
    {
      key: "l2a2-kite",
      numberLabel: "03",
      objectLabel: "Kite",
      objectNumber: 3,
      sceneImage: `${S1}/Activity.png`,
      prompt: "Which shapes are in the kite?",
      targets: ["triangle"]
    },
    {
      key: "l2a2-clock",
      numberLabel: "04",
      objectLabel: "Clock",
      objectNumber: 4,
      sceneImage: `${S1}/Activity.png`,
      prompt: "Which shapes are in the clock?",
      targets: ["circle"]
    },
    {
      key: "l2a2-house",
      numberLabel: "05",
      objectLabel: "House",
      objectNumber: 1,
      sceneImage: `${S2}/Activity.png`,
      prompt: "Which shapes are in the house?",
      targets: ["triangle", "square", "rectangle", "circle"]
    },
    {
      key: "l2a2-tree",
      numberLabel: "06",
      objectLabel: "Tree",
      objectNumber: 2,
      sceneImage: `${S2}/Activity.png`,
      prompt: "Which shapes are in the tree?",
      targets: ["oval", "rectangle"]
    },
    {
      key: "l2a2-car",
      numberLabel: "07",
      objectLabel: "Car",
      objectNumber: 3,
      sceneImage: `${S2}/Activity.png`,
      prompt: "Which shapes are in the car?",
      targets: ["circle", "square", "rectangle"]
    },
    {
      key: "l2a2-sun",
      numberLabel: "08",
      objectLabel: "Sun",
      objectNumber: 4,
      sceneImage: `${S2}/Activity.png`,
      prompt: "Which shapes are in the sun?",
      targets: ["circle", "triangle"]
    }
  ]
};

const DRESS_BASE = "/level-test/pre/level-2/activity-4";
const D1 = `${DRESS_BASE}/Activity%201`;
const D2 = `${DRESS_BASE}/Activity%202`;
const EMO_BASE = "/level-test/pre/level-2/activity-5";
const EMO1 = `${EMO_BASE}/Activity%201`;
const EMO2 = `${EMO_BASE}/Activity%202`;

export const preGeneralLevel2Activity3 = {
  id: 3,
  type: "dress_and_match" as const,
  title: "Dress & Match",
  prompt: "Dress the character and match items to the right places.",
  hint: "Finish both challenges: dress the boy, then match each item.",
  instruction: "Dress the character and match the items!",
  successMessage: "Awesome! Everything is in the right place!",
  pointsPerCorrect: 40,
  tasks: [
    {
      kind: "dress" as const,
      key: "l2a3-dress",
      title: "Dress the Character",
      instruction: "Dress the Character! Drag the clothes and drop them in the correct places.",
      tip: "Tip: Look at the character and think about where each clothing item belongs!",
      bodyImage: `${D1}/Body.png`,
      clothesImage: `${D1}/cloth.png`,
      voiceAudio: `${D1}/Activity%201.mp3`,
      slots: [
        { key: "hat", label: "Hat" },
        { key: "shirt", label: "Shirt" },
        { key: "pants", label: "Pants" },
        { key: "shoes", label: "Shoes" }
      ],
      items: [
        { key: "cap", label: "Cap", slot: "hat", image: `${D1}/cloth.png`, cropY: 0 },
        { key: "tshirt", label: "T-shirt", slot: "shirt", image: `${D1}/cloth.png`, cropY: 33.33 },
        { key: "shorts", label: "Shorts", slot: "pants", image: `${D1}/cloth.png`, cropY: 66.67 },
        { key: "sneakers", label: "Shoes", slot: "shoes", image: `${D1}/cloth.png`, cropY: 100 }
      ]
    },
    {
      kind: "match" as const,
      key: "l2a3-match",
      title: "Match the Items",
      instruction: "Match the items! Drag each item and match it with the correct place.",
      tip: "Tip: Look at each item and think about where it belongs!",
      boardImage: `${D2}/Items.png`,
      voiceAudio: `${D2}/Activity%202.mp3`,
      pairs: [
        {
          itemKey: "book",
          itemLabel: "Book",
          targetKey: "bookshelf",
          targetLabel: "Bookshelf"
        },
        {
          itemKey: "ball",
          itemLabel: "Ball",
          targetKey: "toybox",
          targetLabel: "Toy box"
        },
        {
          itemKey: "teddy",
          itemLabel: "Teddy",
          targetKey: "table",
          targetLabel: "Table"
        },
        {
          itemKey: "car",
          itemLabel: "Car",
          targetKey: "big-car",
          targetLabel: "Car"
        },
        {
          itemKey: "pencil",
          itemLabel: "Pencil",
          targetKey: "pencil-case",
          targetLabel: "Pencil case"
        }
      ]
    }
  ]
};

export const preGeneralLevel2Ui = {
  gradeLevel: "Pre Grade · Level 2",
  activityLabel: "Activity",
  levelTitle: "Visual Cognitive Development",
  scoreLabel: "Stars",
  listen: "Play voice",
  listening: "Playing…",
  correct: "Correct! ★",
  wrong: "Try again — find the picture that is the same.",
  wrongShapes: "Not quite — check the shapes again.",
  wrongDressMatch: "Not quite — check the places again.",
  next: "Next",
  previous: "Back",
  reset: "Start over",
  check: "Check",
  completeActivity1: "★ Activity 1 complete! You found all the matching pictures.",
  completeActivity2: "★ Activity 2 complete! You found the hidden shapes.",
  completeActivity3: "★ Activity 3 complete! You dressed the character and matched the items.",
  completeActivity4: "★ Activity 4 complete! You sorted the happy feelings!",
  levelComplete: "★ Level 2 complete!",
  lockedTitle: "Level locked",
  lockedBody: "Finish Level 1 to unlock Level 2.",
  backProfile: "Back to profile",
  home: "Home",
  openLevel1: "Go to Level 1",
  wrongEmotions: "Not quite — look at the faces again."
};

export const preGeneralLevel2Activity4 = {
  id: 4,
  type: "emotion_feelings" as const,
  title: "Emotion Garden & Tree",
  prompt: "Find happy feelings in the garden and sort emotion apples on the tree.",
  hint: "Plant only happy flowers, then sort every apple into the matching basket.",
  instruction: "Choose happy flowers and sort emotion apples!",
  successMessage: "Wonderful! You know these feelings!",
  pointsPerCorrect: 50,
  tasks: [
    {
      kind: "garden" as const,
      key: "l2a4-garden",
      title: "Emotion Garden",
      instruction: "Emotion Garden! Choose the happy flowers and plant them in the garden.",
      tip: "Tip: Look at the faces. Choose the happy flowers and plant them in the garden!",
      sceneImage: `${EMO1}/Plant.png`,
      paletteImage: `${EMO1}/Emotions.png`,
      slotCount: 4,
      acceptEmotion: "happy" as const,
      items: [
        { key: "flower-happy-1", label: "Happy", emotion: "happy" as const, tone: "#f6c400" },
        { key: "flower-happy-2", label: "Happy", emotion: "happy" as const, tone: "#ff7eb6" },
        { key: "flower-happy-3", label: "Happy", emotion: "happy" as const, tone: "#4fc3f7" },
        { key: "flower-happy-4", label: "Happy", emotion: "happy" as const, tone: "#ab47bc" },
        { key: "flower-sad", label: "Sad", emotion: "sad" as const, tone: "#fb8c00" },
        { key: "flower-angry", label: "Angry", emotion: "angry" as const, tone: "#e53935" }
      ]
    },
    {
      kind: "tree" as const,
      key: "l2a4-tree",
      title: "Emotion Tree",
      instruction: "Emotion Tree! Sort each apple into the matching emotion basket.",
      tip: "Tip: Look at the faces carefully and put each apple in the right basket!",
      sceneImage: `${EMO2}/Tree.png`,
      paletteImage: `${EMO2}/Emotions.png`,
      baskets: [
        { key: "happy", label: "HAPPY", emotion: "happy" as const, tone: "#43a047" },
        { key: "sad", label: "SAD", emotion: "sad" as const, tone: "#42a5f5" },
        { key: "angry", label: "ANGRY", emotion: "angry" as const, tone: "#e53935" },
        { key: "surprised", label: "SURPRISED", emotion: "surprised" as const, tone: "#8e24aa" }
      ],
      items: [
        { key: "apple-happy-1", label: "Happy", emotion: "happy" as const, tone: "#f6c400" },
        { key: "apple-happy-2", label: "Happy", emotion: "happy" as const, tone: "#ffca28" },
        { key: "apple-sad", label: "Sad", emotion: "sad" as const, tone: "#42a5f5" },
        { key: "apple-angry-1", label: "Angry", emotion: "angry" as const, tone: "#e53935" },
        { key: "apple-angry-2", label: "Angry", emotion: "angry" as const, tone: "#ef5350" },
        { key: "apple-surprised", label: "Surprised", emotion: "surprised" as const, tone: "#8e24aa" }
      ]
    }
  ]
};

export const preGeneralLevel2Activities = [
  preGeneralLevel2Activity1,
  preGeneralLevel2Activity2,
  preGeneralLevel2Activity3,
  preGeneralLevel2Activity4
];
