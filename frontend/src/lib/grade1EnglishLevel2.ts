const Q1 = "/level-test/english/grade-1/Level%202/Q1";
const Q2 = "/level-test/english/grade-1/Level%202/Q2";
const Q3 = "/level-test/english/grade-1/Level%202/Q3";
const Q5 = "/level-test/english/grade-1/Level%202/Q5";

export type FoodSortItem = {
  id: number;
  key: string;
  label: string;
  image: string;
  category: "healthy" | "unhealthy";
};

export type LivingSortItem = {
  id: number;
  key: string;
  label: string;
  image: string;
  category: "living" | "nonliving";
};

export type DinnerTableItem = {
  id: number;
  key: string;
  label: string;
  image: string;
  /** True when the item does NOT belong on the dinner table. */
  isOdd: boolean;
};

export type HabitatMatchItem = {
  id: number;
  key: string;
  label: string;
  image: string;
  targetKey?: string;
};

/** Grade 1 English Level 2 Activity 1: sort healthy and unhealthy foods. */
export const grade1EnglishLevel2Activity1 = {
  id: 1,
  type: "healthy_food_sort" as const,
  title: "Choose the Healthy and Unhealthy Foods",
  instruction: "Look at the food items and classify each one as healthy or unhealthy.",
  hint: "Tap a food, then tap Healthy or Unhealthy.",
  tip: "Tip: Fruits, vegetables, eggs, and fish are usually healthy. Junk food and sweets are usually unhealthy.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You sorted every food correctly.",
  wrongLabel: "Not quite - try again",
  healthyLabel: "Healthy",
  unhealthyLabel: "Unhealthy",
  poolTitle: "Food items",
  pointsPerCorrect: 1,
  foods: [
    { id: 1, key: "burger", label: "Hamburger", image: `${Q1}/Burger.png`, category: "unhealthy" },
    { id: 2, key: "eggs", label: "Eggs", image: `${Q1}/Eggs.png`, category: "healthy" },
    { id: 3, key: "carrot", label: "Carrot", image: `${Q1}/Carrot.png`, category: "healthy" },
    { id: 4, key: "cupcake", label: "Cupcake", image: `${Q1}/CupCake.png`, category: "unhealthy" },
    { id: 5, key: "fish", label: "Fish", image: `${Q1}/Fish.png`, category: "healthy" },
    { id: 6, key: "watermelon", label: "Watermelon", image: `${Q1}/WaterMelon.png`, category: "healthy" },
    { id: 7, key: "broccoli", label: "Broccoli", image: `${Q1}/Brocoli.png`, category: "healthy" },
    { id: 8, key: "pizza", label: "Pizza", image: `${Q1}/Pizza.png`, category: "unhealthy" },
    { id: 9, key: "tomato", label: "Tomato", image: `${Q1}/Tomato.png`, category: "healthy" },
    { id: 10, key: "juice", label: "Soda", image: `${Q1}/Juice.png`, category: "unhealthy" },
    { id: 11, key: "fried-chicken", label: "Fried Chicken", image: `${Q1}/Fried%20Chicken.png`, category: "unhealthy" },
    { id: 12, key: "pineapple", label: "Pineapple", image: `${Q1}/Pine%20Apple%20(1).png`, category: "healthy" }
  ] as FoodSortItem[]
};

/**
 * Grade 1 English Level 2 Activity 2: living and non-living things.
 * Worksheet order: Non Living (left), Living (right).
 */
export const grade1EnglishLevel2Activity2 = {
  id: 2,
  type: "living_nonliving_sort" as const,
  title: "Choose Living and Non-Living Things",
  instruction: "Drag the pictures below into the correct column.",
  hint: "Tap a picture, then tap Living or Non Living.",
  tip: "Tip: Living things grow, move, or need food and water. Non-living things do not.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You sorted every living and non-living thing.",
  wrongLabel: "Not quite - try again",
  livingLabel: "LIVING THINGS",
  nonLivingLabel: "NON LIVING THINGS",
  poolTitle: "Pictures",
  pointsPerCorrect: 1,
  items: [
    { id: 1, key: "tree", label: "Tree", image: `${Q2}/Tree.png`, category: "living" },
    { id: 2, key: "cat", label: "Cat", image: `${Q2}/Cat.png`, category: "living" },
    { id: 3, key: "flower", label: "Flower", image: `${Q2}/Flower.png`, category: "living" },
    { id: 4, key: "apple", label: "Apple", image: `${Q2}/Apple.png`, category: "living" },
    { id: 5, key: "fish", label: "Fish", image: `${Q2}/Fish.png`, category: "living" },
    { id: 6, key: "crab", label: "Crab", image: `${Q2}/Crabs.png`, category: "living" },
    { id: 7, key: "shoe", label: "Shoe", image: `${Q2}/Shoe.png`, category: "nonliving" },
    { id: 8, key: "car", label: "Car", image: `${Q2}/Car.png`, category: "nonliving" },
    { id: 9, key: "magnifying-glass", label: "Magnifying Glass", image: `${Q2}/Magnifying%20Glass.png`, category: "nonliving" },
    { id: 10, key: "dice", label: "Dice", image: `${Q2}/Dice.png`, category: "nonliving" },
    { id: 11, key: "pig", label: "Pig", image: `${Q2}/Pig.png`, category: "living" },
    { id: 12, key: "desk", label: "Desk", image: `${Q2}/Desk.png`, category: "nonliving" },
    { id: 13, key: "taco", label: "Taco", image: `${Q2}/Taco.png`, category: "nonliving" },
    { id: 14, key: "bear", label: "Bear", image: `${Q2}/Bear.png`, category: "living" },
    { id: 15, key: "bed", label: "Bed", image: `${Q2}/Bed.png`, category: "nonliving" },
    { id: 16, key: "bag", label: "Bag", image: `${Q2}/Bag.png`, category: "nonliving" },
    { id: 17, key: "seaweed", label: "Seaweed", image: `${Q2}/Seaweed.png`, category: "living" },
    { id: 18, key: "bottle", label: "Bottle", image: `${Q2}/Bottle.png`, category: "nonliving" },
    { id: 19, key: "boy", label: "Boy", image: `${Q2}/Boy.png`, category: "living" },
    { id: 20, key: "shrimp", label: "Shrimp", image: `${Q2}/Shrimp.png`, category: "living" }
  ] as LivingSortItem[]
};


/** Grade 1 English Level 2 Activity 3: cross out items that do not belong on the dinner table. */
export const grade1EnglishLevel2Activity3 = {
  id: 3,
  type: "dinner_table_odd_out" as const,
  title: "Choose what does not belong on the dinner table",
  instruction: "Let's set the table! Cross out the items that don't belong on the dinner table.",
  hint: "Tap the things that should not be on a dinner table.",
  tip: "Tip: Keep plates, glasses, cutlery, and cups. Cross out toys and outdoor tools.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You crossed out everything that does not belong.",
  wrongLabel: "Not quite - try again",
  pointsPerCorrect: 1,
  tableImage: `${Q3}/Table.png`,
  tableAlt: "Dinner table",
  items: [
    { id: 1, key: "glasses", label: "Glasses", image: `${Q3}/Glasses.png`, isOdd: false },
    { id: 2, key: "duck", label: "Duck", image: `${Q3}/Duck.png`, isOdd: true },
    { id: 3, key: "plates", label: "Plates", image: `${Q3}/Plates.png`, isOdd: false },
    { id: 4, key: "truck", label: "Truck", image: `${Q3}/Truck.png`, isOdd: true },
    { id: 5, key: "cutlery", label: "Cutlery", image: `${Q3}/Cutlleries.png`, isOdd: false },
    { id: 6, key: "watering-can", label: "Watering Can", image: `${Q3}/Wattering%20Can.png`, isOdd: true },
    { id: 7, key: "shovel", label: "Shovel", image: `${Q3}/Showel.png`, isOdd: true },
    { id: 8, key: "umbrella", label: "Umbrella", image: `${Q3}/Umbrella.png`, isOdd: true },
    { id: 9, key: "oven-mitt", label: "Oven Mitt", image: `${Q3}/Oven%20Mit.png`, isOdd: true },
    { id: 10, key: "teacup", label: "Tea Cup", image: `${Q3}/Tea%20Cup.png`, isOdd: false }
  ] as DinnerTableItem[]
};


/** Grade 1 English Level 2 Activity 4: match animals to habitats (assets from Q5). */
export const grade1EnglishLevel2Activity4 = {
  id: 4,
  type: "animal_habitat_match" as const,
  title: "Match each animal to the correct habitat",
  instruction: "Match each animal to its correct habitat.",
  hint: "Tap an animal, then tap the habitat where it lives.",
  tip: "Tip: Think about where each animal lives — land, water, ice, or trees.",
  checkLabel: "Check Answer",
  resetLabel: "Reset",
  successMessage: "Great job! You matched every animal to its habitat.",
  wrongLabel: "Not quite - try again",
  connectHint: "Tap an animal on the left, then tap its habitat on the right.",
  pointsPerCorrect: 1,
  animals: [
    { id: 1, key: "lion", label: "Lion", image: `${Q5}/Lion.png`, targetKey: "grassland" },
    { id: 2, key: "dolphin", label: "Dolphin", image: `${Q5}/Dolphin.png`, targetKey: "ocean" },
    { id: 3, key: "monkey", label: "Monkey", image: `${Q5}/Monkey.png`, targetKey: "forest" },
    { id: 4, key: "camel", label: "Camel", image: `${Q5}/Camel.png`, targetKey: "desert" },
    { id: 5, key: "polar-bear", label: "Polar Bear", image: `${Q5}/Polar%20Bear.png`, targetKey: "polar-region" }
  ] as HabitatMatchItem[],
  habitats: [
    { id: 1, key: "desert", label: "Desert", image: `${Q5}/Dessrt.png` },
    { id: 2, key: "polar-region", label: "Polar Region", image: `${Q5}/Polar%20Region.png` },
    { id: 3, key: "grassland", label: "Grassland", image: `${Q5}/Grassland.png` },
    { id: 4, key: "forest", label: "Forest", image: `${Q5}/Forest.png` },
    { id: 5, key: "ocean", label: "Ocean", image: `${Q5}/Ocean.png` }
  ] as HabitatMatchItem[]
};

export const grade1EnglishLevel2Ui = {
  levelTitle: "Level 2 - Understand",
  questionPrefix: "Question",
  ofLabel: "of",
  scoreLabel: "Score",
  home: "Home",
  activityLabel: "Activity",
  complete: "Activity complete!",
  levelComplete: "Level 2 complete! Level 3 is unlocked.",
  lockedTitle: "Level locked",
  lockedBody: "Finish Level 1 to unlock Level 2.",
  backProfile: "Back to profile"
};

export const grade1EnglishLevel2Activities = [
  grade1EnglishLevel2Activity1,
  grade1EnglishLevel2Activity2,
  grade1EnglishLevel2Activity3,
  grade1EnglishLevel2Activity4
];