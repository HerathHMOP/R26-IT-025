export type MatchLettersActivity = {
  id: number;
  type: "match_letters";
  prompt: string;
  leftItems: string[];
  rightItems: string[];
  pictureOptions?: { label: string; image: string }[];
  matchAnswerMap: Record<string, string>;
};

export type MatchPicturesActivity = {
  id: number;
  type: "match_pictures";
  prompt: string;
  leftItems: string[];
  rightItems: string[];
  pictureOptions: { label: string; image: string }[];
  matchAnswerMap: Record<string, string>;
};

export type MatchShapesActivity = {
  id: number;
  type: "match_shapes";
  prompt: string;
  matchShapes?: {
    leftShapes: Array<{ key: string; shape: string }>;
    rightShapes: Array<{ key: string; label: string }>;
    answerMap: Record<string, string>;
  };
};

export type Grade3MathsActivity = MatchLettersActivity | MatchPicturesActivity | MatchShapesActivity;

export function getGrade3MathsActivities(language: "english" | "sinhala"): Grade3MathsActivity[] {
  return [];
}
