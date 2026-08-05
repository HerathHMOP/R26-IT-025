export type FruitBasketActivity = {
  id: number;
  type: "fruit_basket";
  prompt: string;
  image?: string;
  fruitBasket: {
    modeSteps: number[];
    targetBaseTotal: number;
    fruits: { key: string; label: string; emoji: string }[];
    baseValues: number[];
  };
};

export type BalloonPopActivity = {
  id: number;
  type: "balloon_pop";
  prompt: string;
  image?: string;
  balloonPop: {
    targetNumber: number;
    balloonNumbers: number[];
  };
};

export type FeedAnimalActivity = {
  id: number;
  type: "feed_animal";
  prompt: string;
  image?: string;
  feedAnimal: {
    promptMath: string;
    targetCount: number;
    itemEmoji: string;
    itemLabel: string;
  };
};

export type TakeAwayActivity = {
  id: number;
  type: "take_away";
  prompt: string;
  image?: string;
  takeAway: {
    startCount: number;
    removeCount: number;
    answerOptions: number[];
  };
};

export type ShapeSortActivity = {
  id: number;
  type: "shape_sort";
  prompt: string;
  image?: string;
  shapeSort: {
    shapes: string[];
  };
};

export type LongShortActivity = {
  id: number;
  type: "long_short";
  prompt: string;
  image?: string;
  longShort: {
    leftLabel: string;
    rightLabel: string;
    leftSize: "long" | "short";
    rightSize: "long" | "short";
  };
};

export type WeightScaleActivity = {
  id: number;
  type: "weight_scale";
  prompt: string;
  image?: string;
  weightScale: {
    leftLabel: string;
    rightLabel: string;
    objects: { key: string; label: string; emoji: string; weight: number }[];
  };
};

export type DailyRoutineActivity = {
  id: number;
  type: "daily_routine";
  prompt: string;
  image?: string;
  dailyRoutine: {
    tasks: { key: string; label: string; emoji: string; answerSlotKey: string }[];
    timeSlots: { key: string; label: string }[];
  };
};

export type GroupFruitsActivity = {
  id: number;
  type: "group_fruits";
  prompt: string;
  image?: string;
  groupFruits: {
    fruits: { key: string; label: string; emoji: string }[];
    groups: { key: string; label: string; targetCount: number; size: number }[];
  };
};

export type MissingNumberTrainActivity = {
  id: number;
  type: "missing_number_train";
  prompt: string;
  image?: string;
  missingNumberTrain: {
    sequence: Array<number | null>;
    options: number[];
    answer: number;
  };
};

export type Grade2MathsActivity =
  | FruitBasketActivity
  | BalloonPopActivity
  | FeedAnimalActivity
  | TakeAwayActivity
  | ShapeSortActivity
  | LongShortActivity
  | WeightScaleActivity
  | DailyRoutineActivity
  | GroupFruitsActivity
  | MissingNumberTrainActivity;

export function getGrade2MathsActivities(language: "english" | "sinhala"): Grade2MathsActivity[] {
  return [
    {
      id: 1,
      type: "fruit_basket",
      prompt: language === "sinhala" ? "තොගය ගණනය කරන්න" : "Count the basket",
      fruitBasket: {
        modeSteps: [1, 2, 5, 10],
        targetBaseTotal: 15,
        fruits: [
          { key: "apple", label: language === "sinhala" ? "ඇපල්" : "Apple", emoji: "🍎" },
          { key: "banana", label: language === "sinhala" ? "කෙසෙල්" : "Banana", emoji: "🍌" },
          { key: "grape", label: language === "sinhala" ? "දොඩම්" : "Grape", emoji: "🍇" }
        ],
        baseValues: [1, 2, 3]
      }
    },
    {
      id: 2,
      type: "balloon_pop",
      prompt: language === "sinhala" ? "ගුවන් ඔළුව තෝරන්න" : "Pop the right balloon",
      balloonPop: {
        targetNumber: 5,
        balloonNumbers: [2, 5, 8]
      }
    }
  ];
}
