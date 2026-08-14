const IMG = "/level-test/pre/level-1/activity-1";
const IMG2 = "/level-test/pre/level-1/activity-2";
const IMG3 = "/level-test/pre/level-1/activity-3";
const IMG4 = "/level-test/pre/level-1/activity-4";
const IMG5 = "/level-test/pre/level-1/activity-5";

export type PreShapePiece = {
  key: string;
  label: string;
  image: string;
  required: boolean;
};

export const preGeneralLevel1Activity1 = {
  id: 1,
  type: "smart_shape_creator" as const,
  title: "Smart Shape Creator",
  prompt: "Drag and drop shapes to build the butterfly.",
  hint: "Look at the butterfly picture, then drag every shape onto the dashed area.",
  instruction: "Drag and drop the shapes to create the butterfly.",
  voiceAudio: `${IMG}/Activity%201.mp3`,
  referenceImage: `${IMG}/Butterfly.png`,
  referenceLabel: "Butterfly",
  successMessage: "Great job! You built the butterfly!",
  pointsPerCorrect: 10,
  pieces: [
    {
      key: "yellow-circle",
      label: "Yellow circle",
      image: `${IMG}/Circle.png`,
      required: true
    },
    {
      key: "green-rectangle",
      label: "Green rectangle",
      image: `${IMG}/Rectangle.png`,
      required: true
    },
    {
      key: "pink-circle",
      label: "Pink circle",
      image: `${IMG}/Pink%20Circle.png`,
      required: true
    },
    {
      key: "purple-circle",
      label: "Purple circle",
      image: `${IMG}/Purple%20Circle.png`,
      required: true
    },
    {
      key: "pink-triangle",
      label: "Pink triangle",
      image: `${IMG}/Triangle.png`,
      required: true
    },
    {
      key: "yellow-triangle",
      label: "Yellow triangle",
      image: `${IMG}/Yellow%20Triangle.png`,
      required: true
    },
    {
      key: "purple-square",
      label: "Purple square",
      image: `${IMG}/Square.png`,
      required: false
    }
  ] satisfies PreShapePiece[]
};

export const preGeneralLevel1Activity2 = {
  id: 2,
  type: "smart_line_adventure" as const,
  title: "Smart Line Adventure",
  prompt: "Guide the butterfly to the flower along the dotted path.",
  hint: "Start at the butterfly, stay on the purple dots, and finish at the flower.",
  instruction: "Guide the butterfly to the flower by following the dotted path.",
  successMessage: "Great Job! You did it!",
  pointsPerCorrect: 60,
  butterflyImage: `${IMG2}/Butterfly.png`,
  flowerImage: `${IMG2}/Flower.png`
};

export const preGeneralLevel1Activity3 = {
  id: 3,
  type: "growing_plant_studio" as const,
  title: "Growing Plant Studio",
  prompt: "Help the plant grow with water, sunlight, and soil.",
  hint: "Drag water, sunlight, and soil onto the circles around the plant.",
  instruction: "Help the plant grow! Drag water, sunlight, and soil to the plant.",
  tip: "Tip: Plants need water, sunlight, and soil to grow.",
  successTitle: "Great Job!",
  successMessage: "The plant grew!",
  pointsPerCorrect: 25,
  plantImage: `${IMG3}/Plant.png`,
  grownPlantImage: `${IMG3}/GrowPlant.png`,
  items: [
    {
      key: "water",
      label: "Water",
      image: `${IMG3}/Water.png`,
      tone: "#3aa0ff"
    },
    {
      key: "sunlight",
      label: "Sunlight",
      image: `${IMG3}/Sunlight.png`,
      tone: "#ffb020"
    },
    {
      key: "soil",
      label: "Soil",
      image: `${IMG3}/Soil.png`,
      tone: "#a56a3a"
    }
  ]
};

export const preGeneralLevel1Activity4 = {
  id: 4,
  type: "build_my_playground" as const,
  title: "Build My Playground",
  prompt: "Drag playground items into the park.",
  hint: "Use your imagination — place the slide, swing, bench, and tree in the park.",
  instruction: "Drag the playground items and drop them in the park to build your own playground!",
  tip: "Tip: Use your imagination and build a happy playground!",
  successMessage: "Fantastic! Your playground is ready to play!",
  pointsPerCorrect: 20,
  parkImage: `${IMG4}/PlayGround.png`,
  items: [
    { key: "slide", label: "Slide", image: `${IMG4}/Slide.png` },
    { key: "swing", label: "Swing", image: `${IMG4}/Swing.png` },
    { key: "bench", label: "Bench", image: `${IMG4}/Bench.png` },
    { key: "tree", label: "Tree", image: `${IMG4}/Tree.png` }
  ]
};

export const preGeneralLevel1Activity5 = {
  id: 5,
  type: "colour_discovery_lab" as const,
  title: "Colour Discovery Lab",
  prompt: "Drag the right colour onto each fruit.",
  hint: "Look at the fruit pictures, then match each outline with the right colour.",
  instruction: "Drag the colour to the fruit and make it colourful!",
  tip: "Tip: Listen to the fruit name and choose the right colour!",
  successMessage: "Brilliant! All the fruits are colourful!",
  pointsPerCorrect: 20,
  fruits: [
    {
      key: "mango",
      label: "Mango",
      outlineImage: `${IMG5}/Mango.png`,
      colouredImage: `${IMG5}/Mango_Y.png`,
      targetColour: "yellow"
    },
    {
      key: "apple",
      label: "Apple",
      outlineImage: `${IMG5}/Apple.png`,
      colouredImage: `${IMG5}/Apple_R.png`,
      targetColour: "red"
    },
    {
      key: "orange",
      label: "Orange",
      outlineImage: `${IMG5}/Orange.png`,
      colouredImage: `${IMG5}/Orange_O.png`,
      targetColour: "orange"
    }
  ],
  colours: [
    { key: "red", label: "Red", hex: "#e53935" },
    { key: "yellow", label: "Yellow", hex: "#f6c400" },
    { key: "green", label: "Green", hex: "#43a047" },
    { key: "orange", label: "Orange", hex: "#fb8c00" },
    { key: "purple", label: "Purple", hex: "#8e24aa" }
  ]
};

export const preGeneralLevel1Ui = {
  gradeLevel: "Pre Grade · Level 1",
  activityLabel: "Activity",
  levelTitle: "Shape Exploration & Fine Motor Development",
  scoreLabel: "Stars",
  listen: "Play voice",
  listening: "Playing…",
  correct: "Correct! ★",
  wrong: "Keep trying — use the shapes to match the butterfly.",
  check: "Check my butterfly",
  reset: "Start over",
  completeActivity1: "★ Activity 1 complete! You built the butterfly with shapes.",
  completeActivity2: "★ Activity 2 complete! You guided the butterfly to the flower.",
  completeActivity3: "★ Activity 3 complete! You helped the plant grow.",
  completeActivity4: "★ Activity 4 complete! You built your own playground.",
  completeActivity5: "★ Activity 5 complete! You coloured the fruits correctly.",
  levelComplete: "★ Level 1 complete!",
  lockedTitle: "Level locked",
  lockedBody: "Finish the General aptitude test to unlock Level 1.",
  backProfile: "Back to profile",
  home: "Home",
  openAptitude: "Go to aptitude test",
  placedHint: "Shapes on the board",
  paletteHint: "Shape box — drag onto the board"
};

export const preGeneralLevel1Activities = [
  preGeneralLevel1Activity1,
  preGeneralLevel1Activity2,
  preGeneralLevel1Activity3,
  preGeneralLevel1Activity4,
  preGeneralLevel1Activity5
];
