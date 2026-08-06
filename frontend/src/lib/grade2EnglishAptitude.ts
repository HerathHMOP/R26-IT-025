export type Grade2Activity = {
  id: number;
  prompt: string;
  type:
    | "mcq"
    | "match_letters"
    | "match_pictures"
    | "color_rows"
    | "number_rows"
    | "image_rows"
    | "place_value"
    | "addition_race"
    | "subtraction_race"
    | "multiplication_match"
    | "money_activity"
    | "pattern_completion"
    | "weight_compare"
    | "shapes_hunt"
    | "time_clock"
    | "count_rows"
    | "select_images"
    | "text_rows"
    | "select_words"
    | "word_boxes"
    | "arrange_words"
    | "fruit_basket"
    | "balloon_pop"
    | "feed_animal"
    | "take_away"
    | "shape_sort"
    | "long_short"
    | "weight_scale"
    | "daily_routine"
    | "group_fruits"
    | "missing_number_train"
    | "drag_number_order"
    | "match_image_pairs"
    | "match_shapes"
    | "circle_lowercase"
    | "drag_sort_groups";
  options?: string[];
  answer?: string;
  leftItems?: string[];
  rightItems?: string[];
  matchAnswerMap?: Record<string, string>;
  pictureOptions?: { label: string; image: string }[];
  colorRows?: {
    key: string;
    image: string;
    options: string[];
    answer: string;
  }[];
  numberRows?: {
    key: string;
    number: string;
    image?: string;
    options: string[];
    answer: string;
  }[];
  imageRows?: {
    key: string;
    image: string;
    label?: string;
    options: string[];
    answer: string;
  }[];
  /** Hundreds / tens / ones digits as single-character strings, e.g. "2","4","5" for 245. */
  placeValueRows?: {
    key: string;
    value: number;
    hundreds: string;
    tens: string;
    ones: string;
  }[];
  /** Two-digit addition; pick one of four option strings (matches correct sum). */
  additionRaceRows?: {
    key: string;
    a: number;
    b: number;
    options: string[];
    answer: string;
  }[];
  /** Two-digit subtraction (a − b); pick one of four option strings (correct difference). */
  subtractionRaceRows?: {
    key: string;
    a: number;
    b: number;
    options: string[];
    answer: string;
  }[];
  /** Multiplication facts; pick one of four option strings (correct product). */
  multiplicationMatchRows?: {
    key: string;
    a: number;
    b: number;
    options: string[];
    answer: string;
  }[];
  /** Rupee amounts as a display expression; pick total (Rs.) from four options. */
  moneyActivityRows?: {
    key: string;
    expression: string;
    options: string[];
    answer: string;
  }[];
  /** ABAB… sequence shown; complete next 1 or 2 tokens from option lists. */
  patternCompletionRows?: {
    key: string;
    shownTokens: string[];
    blankCount: 1 | 2;
    options1: string[];
    answer1: string;
    options2?: string[];
    answer2?: string;
  }[];
  /** Two images; learner picks which object is heavier (`left` or `right`). */
  weightCompareRows?: {
    key: string;
    leftImage: string;
    rightImage: string;
    leftTitle: string;
    rightTitle: string;
    heavier: "left" | "right";
  }[];
  /** Photo of an object; pick matching shape emoji from four options. */
  shapesHuntRows?: {
    key: string;
    objectImage: string;
    objectLabel: string;
    options: string[];
    answer: string;
  }[];
  /** Read the time instruction; tap the clock face that shows that o'clock. */
  timeClockRows?: {
    key: string;
    instruction: string;
    options: string[];
    answer: string;
  }[];
  countRows?: {
    key: string;
    label: string;
    answerCount: number;
  }[];
  selectImageRows?: {
    key: string;
    image: string;
    label: string;
  }[];
  correctImageKeys?: string[];
  textRows?: {
    key: string;
    prompt: string;
    options: string[];
    answer: string;
  }[];
  wordBoxRows?: {
    key: string;
    topRow: [string, string, string];
    sideColumn: [string, string];
    patternRows?: (string | null)[][];
    blankCell?: { row: number; col: number };
    optionHint?: string;
    options: string[];
    answer: string;
  }[];
  arrangeWordRows?: {
    key: string;
    words: string[];
    answer: string;
  }[];
  fruitBasket?: {
    title: string;
    modeSteps: number[];
    baseValues: number[];
    targetBaseTotal: number;
    fruits: { key: string; label: string; emoji: string }[];
  };
  balloonPop?: {
    title: string;
    targetNumber: number;
    balloonNumbers: number[];
  };
  feedAnimal?: {
    title: string;
    promptMath: string;
    targetCount: number;
    itemEmoji: string;
    itemLabel: string;
  };
  takeAway?: {
    title: string;
    startCount: number;
    removeCount: number;
    answerOptions: number[];
  };
  shapeSort?: {
    title: string;
    shapes: string[];
  };
  longShort?: {
    title: string;
    leftLabel: string;
    rightLabel: string;
    leftSize: "long" | "short";
    rightSize: "long" | "short";
  };
  weightScale?: {
    title: string;
    leftLabel: string;
    rightLabel: string;
    objects: {
      key: string;
      label: string;
      emoji: string;
      weight: number;
    }[];
  };
  dailyRoutine?: {
    title: string;
    timeSlots: {
      key: string;
      label: string;
    }[];
    tasks: {
      key: string;
      label: string;
      emoji: string;
      answerSlotKey: string;
    }[];
  };
  groupFruits?: {
    title: string;
    groups: {
      key: string;
      label: string;
      size: number;
      targetCount: number;
    }[];
    fruits: {
      key: string;
      label: string;
      emoji: string;
    }[];
  };
  missingNumberTrain?: {
    title: string;
    sequence: (number | null)[];
    options: number[];
    answer: number;
  };
  dragNumberOrder?: {
    title: string;
    targetOrder: number[];
    cards: {
      key: string;
      number: number;
      image: string;
      label: string;
    }[];
  };
  matchImagePairs?: {
    title: string;
    leftImages: { key: string; image: string; label: string }[];
    rightImages: {
      key: string;
      label: string;
      image?: string;
      shape?: "square" | "circle" | "triangle" | "star" | "rectangle";
    }[];
    answerMap: Record<string, string>;
  };
  matchShapes?: {
    title: string;
    leftShapes: { key: string; shape: "square" | "circle" | "triangle" | "star" | "rectangle"; label: string }[];
    rightShapes: { key: string; shape: "square" | "circle" | "triangle" | "star" | "rectangle"; label: string }[];
    answerMap: Record<string, string>;
  };
  circleLowercaseRows?: {
    key: string;
    uppercase: string;
    options: string[];
    answer: string;
  }[];
  dragSortGroups?: {
    title: string;
    groups: { key: string; label: string }[];
    items: {
      key: string;
      image: string;
      label: string;
      answerGroupKey: string;
    }[];
  };
  wordOptions?: string[];
  correctWords?: string[];
  image?: string;
};

const IMG_BASE = "/aptitude-test/english/grade-2/images";

export const grade2EnglishActivities: Grade2Activity[] = [
  {
    id: 1,
    type: "match_letters",
    prompt: "Instruction: Match letters",
    leftItems: ["A", "B", "C", "D", "E"],
    rightItems: ["D", "C", "E", "B", "A"],
    matchAnswerMap: { A: "E", B: "C", C: "D", D: "B", E: "A" }
  },
  {
    id: 2,
    type: "match_pictures",
    prompt: "Instruction: Find the picture for each letter",
    leftItems: ["A", "B", "C", "D", "E"],
    rightItems: ["Eagle", "Doll", "Ball", "Cake", "Apple"],
    matchAnswerMap: { A: "Apple", B: "Ball", C: "Cake", D: "Doll", E: "Eagle" },
    pictureOptions: [
      { label: "Eagle", image: `${IMG_BASE}/eagle.jpg` },
      { label: "Doll", image: `${IMG_BASE}/doll.jpg` },
      { label: "Ball", image: `${IMG_BASE}/ball.jpg` },
      { label: "Cake", image: `${IMG_BASE}/cake.jpg` },
      { label: "Apple", image: `${IMG_BASE}/apple.png` }
    ]
  },
  {
    id: 3,
    type: "color_rows",
    prompt: "Instruction: Circle correct color",
    colorRows: [
      { key: "row1", image: `${IMG_BASE}/yellow.png`, options: ["Red", "Yellow", "Green"], answer: "Yellow" },
      { key: "row2", image: `${IMG_BASE}/blue.png`, options: ["Blue", "Pink", "Yellow"], answer: "Blue" },
      { key: "row3", image: `${IMG_BASE}/green.png`, options: ["Red", "Green", "Blue"], answer: "Green" },
      { key: "row4", image: `${IMG_BASE}/purpule.png`, options: ["Red", "White", "Purple"], answer: "Purple" },
      { key: "row5", image: `${IMG_BASE}/orange s.png`, options: ["Red", "Orange", "Blue"], answer: "Orange" },
      { key: "row6", image: `${IMG_BASE}/pink.png`, options: ["Blue", "Pink", "Orange"], answer: "Pink" }
    ]
  },
  {
    id: 4,
    type: "number_rows",
    prompt: "Instruction: Match numbers",
    numberRows: [
      { key: "n5", number: "5", image: `${IMG_BASE}/5.png`, options: ["Five", "One"], answer: "Five" },
      { key: "n1", number: "1", image: `${IMG_BASE}/1.png`, options: ["One", "Three"], answer: "One" },
      { key: "n3", number: "3", image: `${IMG_BASE}/3.png`, options: ["Three", "Four"], answer: "Three" },
      { key: "n2", number: "2", image: `${IMG_BASE}/2.png`, options: ["Two", "Five"], answer: "Two" },
      { key: "n4", number: "4", image: `${IMG_BASE}/4.png`, options: ["Four", "Two"], answer: "Four" }
    ]
  },
  {
    id: 5,
    type: "image_rows",
    prompt: "School: Match the picture with the correct word",
    imageRows: [
      { key: "blackboard", image: `${IMG_BASE}/black board.png`, options: ["Duster", "Black board"], answer: "Black board" },
      { key: "chair", image: `${IMG_BASE}/chair.png`, options: ["Table", "Chair"], answer: "Chair" },
      { key: "table", image: `${IMG_BASE}/table.png`, options: ["Chair", "Table"], answer: "Table" },
      { key: "duster", image: `${IMG_BASE}/duster.png`, options: ["Duster", "Dustbin"], answer: "Duster" },
      { key: "dustbin", image: `${IMG_BASE}/bin.png`, options: ["Dustbin", "Black board"], answer: "Dustbin" }
    ]
  },
  {
    id: 6,
    type: "image_rows",
    prompt: "Instruction: Match fruits",
    imageRows: [
      { key: "apple", image: `${IMG_BASE}/apple.png`, options: ["Watermelon", "Apple"], answer: "Apple" },
      { key: "banana", image: `${IMG_BASE}/banana.png`, options: ["Orange", "Banana"], answer: "Banana" },
      { key: "orange", image: `${IMG_BASE}/orange.png`, options: ["Apple", "Orange"], answer: "Orange" },
      { key: "watermelon", image: `${IMG_BASE}/watermelon.png`, options: ["Banana", "Watermelon"], answer: "Watermelon" }
    ]
  },
  {
    id: 7,
    type: "image_rows",
    prompt: "Instruction: Match vehicles",
    imageRows: [
      { key: "bus", image: `${IMG_BASE}/bus.png`, options: ["Bicycle", "Bus"], answer: "Bus" },
      { key: "train", image: `${IMG_BASE}/train.png`, options: ["Airplane", "Train"], answer: "Train" },
      { key: "car", image: `${IMG_BASE}/car.png`, options: ["Bus", "Car"], answer: "Car" },
      { key: "bicycle", image: `${IMG_BASE}/bicycle.png`, options: ["Train", "Bicycle"], answer: "Bicycle" },
      { key: "airplane", image: `${IMG_BASE}/plane.png`, options: ["Car", "Airplane"], answer: "Airplane" }
    ]
  },
  {
    id: 8,
    type: "image_rows",
    prompt: "Instruction: Match the shapes to their name",
    imageRows: [
      { key: "circle", image: `${IMG_BASE}/circle.png`, options: ["Square", "Circle"], answer: "Circle" },
      { key: "square", image: `${IMG_BASE}/square.png`, options: ["Triangle", "Square"], answer: "Square" },
      { key: "triangle", image: `${IMG_BASE}/triangle.png`, options: ["Circle", "Triangle"], answer: "Triangle" }
    ]
  },
  {
    id: 9,
    type: "count_rows",
    prompt: "Instruction: Read and click the correct number of circles",
    countRows: [
      { key: "one", label: "One", answerCount: 1 },
      { key: "two", label: "Two", answerCount: 2 },
      { key: "three", label: "Three", answerCount: 3 },
      { key: "four", label: "Four", answerCount: 4 },
      { key: "five", label: "Five", answerCount: 5 }
    ]
  },
  {
    id: 10,
    type: "image_rows",
    prompt: "Instruction: Match each person to the correct job",
    imageRows: [
      { key: "doctor", image: `${IMG_BASE}/doctor.png`, options: ["Baker", "Doctor"], answer: "Doctor" },
      { key: "farmer", image: `${IMG_BASE}/farmer.png`, options: ["Teacher", "Farmer"], answer: "Farmer" },
      { key: "baker", image: `${IMG_BASE}/baker.png`, options: ["Doctor", "Baker"], answer: "Baker" },
      { key: "teacher", image: `${IMG_BASE}/teacher.png`, options: ["Farmer", "Teacher"], answer: "Teacher" }
    ]
  },
  {
    id: 11,
    type: "image_rows",
    prompt: "Instruction: Match each clothing item with the correct word",
    imageRows: [
      { key: "frock", image: `${IMG_BASE}/frock.png`, options: ["Shorts", "Frock"], answer: "Frock" },
      { key: "shorts", image: `${IMG_BASE}/shorts.png`, options: ["Shirt", "Shorts"], answer: "Shorts" },
      { key: "shirt", image: `${IMG_BASE}/shirt.png`, options: ["Trouser", "Shirt"], answer: "Shirt" },
      { key: "trouser", image: `${IMG_BASE}/trouser.png`, options: ["Frock", "Trouser"], answer: "Trouser" }
    ]
  },
  {
    id: 12,
    type: "image_rows",
    prompt: "Instruction: Match each item with the correct word",
    imageRows: [
      { key: "comb", image: `${IMG_BASE}/comb.png`, options: ["Toothbrush", "Comb"], answer: "Comb" },
      { key: "mug", image: `${IMG_BASE}/mug.png`, options: ["Mug", "Bed"], answer: "Mug" },
      { key: "brush", image: `${IMG_BASE}/brush.png`, options: ["Bed", "Toothbrush"], answer: "Toothbrush" },
      { key: "bed", image: `${IMG_BASE}/bed.png`, options: ["Comb", "Bed"], answer: "Bed" }
    ]
  },
  {
    id: 13,
    type: "image_rows",
    prompt: "Instruction: Match each animal to the correct name",
    imageRows: [
      { key: "elephant", image: `${IMG_BASE}/elephant.png`, options: ["Rabbit", "Elephant"], answer: "Elephant" },
      { key: "parrot", image: `${IMG_BASE}/parrot.png`, options: ["Dog", "Parrot"], answer: "Parrot" },
      { key: "horse", image: `${IMG_BASE}/horse.png`, options: ["Elephant", "Horse"], answer: "Horse" },
      { key: "cow", image: `${IMG_BASE}/cow.png`, options: ["Parrot", "Cow"], answer: "Cow" },
      { key: "rabbit", image: `${IMG_BASE}/rabbit.png`, options: ["Horse", "Rabbit"], answer: "Rabbit" },
      { key: "dog", image: `${IMG_BASE}/dog.png`, options: ["Cow", "Dog"], answer: "Dog" }
    ]
  },
  {
    id: 14,
    type: "image_rows",
    prompt: "Instruction: Match the weather word to the picture",
    imageRows: [
      { key: "rainy", image: `${IMG_BASE}/rainy.png`, options: ["Stormy", "Rainy"], answer: "Rainy" },
      { key: "sunny", image: `${IMG_BASE}/sunny.png`, options: ["Rainy", "Sunny"], answer: "Sunny" },
      { key: "stormy", image: `${IMG_BASE}/stormy.png`, options: ["Sunny", "Stormy"], answer: "Stormy" }
    ]
  },
  {
    id: 15,
    type: "select_images",
    prompt: "Instruction: Select kitchen items from images",
    selectImageRows: [
      { key: "spoonfork", image: `${IMG_BASE}/spoon and fork.jpg`, label: "Spoon and Fork" },
      { key: "knife", image: `${IMG_BASE}/knife.jpg`, label: "Knife" },
      { key: "pen", image: `${IMG_BASE}/pen.jpg`, label: "Pen" },
      { key: "woodenspoon", image: `${IMG_BASE}/wooden spoon.jpg`, label: "Wooden Spoon" },
      { key: "pencil", image: `${IMG_BASE}/pencil.jpg`, label: "Pencil" },
      { key: "ricecooker", image: `${IMG_BASE}/rice cooker.jpg`, label: "Rice Cooker" }
    ],
    correctImageKeys: ["spoonfork", "knife", "woodenspoon", "ricecooker"]
  }
];
