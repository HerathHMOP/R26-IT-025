export type NumberGridCell = {
  index: number;
  answer: number;
  /** Pre-filled cells are locked; missing cells start empty. */
  given: boolean;
};

export const preGeneralLevel4Activity1 = {
  id: 1,
  type: "find_missing_numbers" as const,
  title: "Find the Numbers",
  titleEn: "Find the Numbers",
  prompt: "Look at the number grid and fill in the missing numbers.",
  hint: "Drag and drop the correct numbers into the empty boxes.",
  instruction: "Look at the number grid and fill in the missing numbers. Drag and drop the correct numbers.",
  tip: "Tip: Count in order from 1 to 20. Fill each empty box with the next number.",
  successMessage: "Great job! The number grid is complete!",
  pointsPerCorrect: 10,
  poolTitle: "Drag these numbers",
  /** 1–20 sequence; given=true means shown, given=false means student fills. */
  cells: [
    { index: 0, answer: 1, given: true },
    { index: 1, answer: 2, given: true },
    { index: 2, answer: 3, given: false },
    { index: 3, answer: 4, given: false },
    { index: 4, answer: 5, given: true },
    { index: 5, answer: 6, given: true },
    { index: 6, answer: 7, given: false },
    { index: 7, answer: 8, given: true },
    { index: 8, answer: 9, given: false },
    { index: 9, answer: 10, given: false },
    { index: 10, answer: 11, given: false },
    { index: 11, answer: 12, given: false },
    { index: 12, answer: 13, given: true },
    { index: 13, answer: 14, given: false },
    { index: 14, answer: 15, given: true },
    { index: 15, answer: 16, given: true },
    { index: 16, answer: 17, given: false },
    { index: 17, answer: 18, given: true },
    { index: 18, answer: 19, given: false },
    { index: 19, answer: 20, given: true }
  ] satisfies NumberGridCell[],
  pool: [11, 10, 19, 12, 3, 17, 4, 14, 7, 9]
};

const WEATHER = "/level-test/pre/level-4/activity-2";

export const preGeneralLevel4Activity2 = {
  id: 2,
  type: "weather_action_match" as const,
  title: "Match the Weather",
  titleEn: "Match the Weather",
  prompt: "Look at the pictures. Match the weather with the correct action.",
  hint: "Tap a weather picture, then tap the matching action.",
  instruction: "Look at the pictures. Match the weather with the correct action.",
  tip: "Think and match carefully! Tap weather first, then the action.",
  successMessage: "Awesome! Weather and actions match!",
  pointsPerCorrect: 10,
  wrongLabel: "Check your matches and try again.",
  weatherItems: [
    { key: "storm", label: "Storm", image: `${WEATHER}/weather/storm.png` },
    { key: "wind", label: "Wind", image: `${WEATHER}/weather/wind.png` },
    { key: "snow", label: "Snow", image: `${WEATHER}/weather/snow.png` },
    { key: "sun", label: "Sun", image: `${WEATHER}/weather/sun.png` },
    { key: "rain", label: "Rain", image: `${WEATHER}/weather/rain.png` }
  ],
  actionItems: [
    { key: "windy", label: "Windy day", image: `${WEATHER}/reactions/windy.png` },
    { key: "hot", label: "Hot day", image: `${WEATHER}/reactions/hot.png` },
    { key: "rainy", label: "Rainy day", image: `${WEATHER}/reactions/rainy.png` },
    { key: "snowman", label: "Snowy day", image: `${WEATHER}/reactions/snowman.png` }
  ],
  answers: {
    wind: "windy",
    snow: "snowman",
    sun: "hot",
    rain: "rainy"
  } as Record<string, string>
};

const TOOTH = "/level-test/pre/level-4/activity-3";

export const preGeneralLevel4Activity3 = {
  id: 3,
  type: "happy_sad_tooth" as const,
  title: "Happy or Sad Tooth",
  titleEn: "Happy or Sad Tooth",
  prompt: "Look at the pictures below. Drag each item and drop it in the correct box.",
  hint: "Healthy foods go to Happy Tooth. Sugary or junk foods go to Sad Tooth.",
  instruction: "Look at the pictures below. Drag each item and drop it in the correct box.",
  tip: "Tap a food, then tap the Sad Tooth or Happy Tooth box.",
  successMessage: "Great job! Your teeth thank you!",
  pointsPerCorrect: 10,
  wrongLabel: "Some foods are in the wrong box. Try again.",
  sadLabel: "Sad Tooth",
  happyLabel: "Happy Tooth",
  sadImage: `${TOOTH}/sad-tooth.png`,
  happyImage: `${TOOTH}/happy-tooth.png`,
  trayTitle: "Foods",
  items: [
    { key: "hamburger", label: "Hamburger", image: `${TOOTH}/foods/hamburger.png`, bin: "sad" as const },
    { key: "broccoli", label: "Broccoli", image: `${TOOTH}/foods/broccoli.png`, bin: "happy" as const },
    { key: "lollipop", label: "Lollipop", image: `${TOOTH}/foods/lollipop.png`, bin: "sad" as const },
    { key: "carrot", label: "Carrot", image: `${TOOTH}/foods/carrot.png`, bin: "happy" as const },
    { key: "cheese", label: "Cheese", image: `${TOOTH}/foods/cheese.png`, bin: "happy" as const },
    { key: "milk", label: "Milk", image: `${TOOTH}/foods/milk.png`, bin: "happy" as const },
    { key: "icecream", label: "Ice cream", image: `${TOOTH}/foods/icecream.png`, bin: "sad" as const },
    { key: "pear", label: "Pear", image: `${TOOTH}/foods/pear.png`, bin: "happy" as const },
    { key: "chocolate", label: "Chocolate", image: `${TOOTH}/foods/chocolate.png`, bin: "sad" as const },
    { key: "apple", label: "Apple", image: `${TOOTH}/foods/apple.png`, bin: "happy" as const }
  ]
};

const PUZZLE = "/level-test/pre/level-4/activity-4";

export const preGeneralLevel4Activity4 = {
  id: 4,
  type: "make_puzzle" as const,
  title: "Make Puzzle",
  titleEn: "Puzzle",
  prompt: "Cut out the puzzle pieces and put them together.",
  hint: "Use the faint picture as a guide. Drag each piece into the correct square.",
  instruction: "Cut out the puzzle pieces and put them together.",
  tip: "Tap a piece, then tap its place on the board — or drag and drop.",
  successMessage: "Great job! The cat puzzle is complete!",
  pointsPerCorrect: 10,
  wrongLabel: "Some pieces are in the wrong place. Try again.",
  trayTitle: "Puzzle pieces",
  ghostImage: `${PUZZLE}/Image.png`,
  pieces: [
    { key: "i", label: "Piece I", image: `${PUZZLE}/I.png`, slot: "bl" as const },
    { key: "ii", label: "Piece II", image: `${PUZZLE}/II.png`, slot: "br" as const },
    { key: "iii", label: "Piece III", image: `${PUZZLE}/III.png`, slot: "tl" as const },
    { key: "iv", label: "Piece IV", image: `${PUZZLE}/IV.png`, slot: "tr" as const }
  ]
};

export const preGeneralLevel4Ui = {
  gradeLevel: "Pre Grade · Level 4",
  activityLabel: "Activity",
  levelTitle: "Number Adventures",
  scoreLabel: "Score",
  listen: "Listen",
  listening: "Listening…",
  correct: "Correct! ★",
  wrong: "Check the empty boxes and try again.",
  check: "Check",
  reset: "Reset",
  hint: "Need a Hint?",
  completeActivity1: "★ Activity 01 complete! You found all the numbers.",
  completeActivity2: "★ Activity 02 complete! Weather matches done.",
  completeActivity3: "★ Activity 03 complete! Happy and sad teeth sorted.",
  completeActivity4: "★ Activity 04 complete! Puzzle finished.",
  levelComplete: "★ Level 4 complete!",
  lockedTitle: "Level Locked",
  lockedBody: "Complete Level 3 to unlock Level 4.",
  backProfile: "Back to profile",
  home: "Home",
  openLevel3: "Go to Level 3"
};

export const preGeneralLevel4Activities = [
  preGeneralLevel4Activity1,
  preGeneralLevel4Activity2,
  preGeneralLevel4Activity3,
  preGeneralLevel4Activity4
];
