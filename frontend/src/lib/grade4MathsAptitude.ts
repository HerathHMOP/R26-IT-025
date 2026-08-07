export type ImageRow = {
  key: string;
  label?: string;
  image: string;
  options: number[];
  answer: number;
};

export type PlaceValueRow = {
  key: string;
  value: number | string;
  hundreds: string;
  tens: string;
  ones: string;
};

export type AdditionRaceRow = {
  key: string;
  a: number;
  b: number;
  options: number[];
  answer: number;
};

export type SubtractionRaceRow = {
  key: string;
  a: number;
  b: number;
  options: number[];
  answer: number;
};

export type MultiplicationMatchRow = {
  key: string;
  a: number;
  b: number;
  options: number[];
  answer: number;
};

export type MoneyActivityRow = {
  key: string;
  expression: string;
  options: number[];
  answer: number;
};

export type PatternCompletionRow = {
  key: string;
  shownTokens: string[];
  blankCount: 1 | 2;
  options1: string[];
  options2?: string[];
  answer1: string;
  answer2?: string;
};

export type WeightCompareRow = {
  key: string;
  leftImage: string;
  leftTitle: string;
  rightImage: string;
  rightTitle: string;
  heavier: "left" | "right";
};

export type ShapesHuntRow = {
  key: string;
  objectImage: string;
  objectLabel: string;
  options: string[];
  answer: string;
};

export type TimeClockRow = {
  key: string;
  instruction: string;
  options: string[];
  answer: string;
};

export type ImageRowsActivity = {
  id: number;
  type: "image_rows";
  prompt: string;
  imageRows?: ImageRow[];
};

export type PlaceValueActivity = {
  id: number;
  type: "place_value";
  prompt: string;
  placeValueRows?: PlaceValueRow[];
};

export type AdditionRaceActivity = {
  id: number;
  type: "addition_race";
  prompt: string;
  additionRaceRows?: AdditionRaceRow[];
};

export type SubtractionRaceActivity = {
  id: number;
  type: "subtraction_race";
  prompt: string;
  subtractionRaceRows?: SubtractionRaceRow[];
};

export type MultiplicationMatchActivity = {
  id: number;
  type: "multiplication_match";
  prompt: string;
  multiplicationMatchRows?: MultiplicationMatchRow[];
};

export type MoneyActivity = {
  id: number;
  type: "money_activity";
  prompt: string;
  moneyActivityRows?: MoneyActivityRow[];
};

export type PatternCompletionActivity = {
  id: number;
  type: "pattern_completion";
  prompt: string;
  patternCompletionRows?: PatternCompletionRow[];
};

export type WeightCompareActivity = {
  id: number;
  type: "weight_compare";
  prompt: string;
  weightCompareRows?: WeightCompareRow[];
};

export type ShapesHuntActivity = {
  id: number;
  type: "shapes_hunt";
  prompt: string;
  shapesHuntRows?: ShapesHuntRow[];
};

export type TimeClockActivity = {
  id: number;
  type: "time_clock";
  prompt: string;
  timeClockRows?: TimeClockRow[];
};

export type Grade4MathsActivity =
  | ImageRowsActivity
  | PlaceValueActivity
  | AdditionRaceActivity
  | SubtractionRaceActivity
  | MultiplicationMatchActivity
  | MoneyActivity
  | PatternCompletionActivity
  | WeightCompareActivity
  | ShapesHuntActivity
  | TimeClockActivity;

export function getGrade4MathsActivities(language: "english" | "sinhala"): Grade4MathsActivity[] {
  return [];
}
