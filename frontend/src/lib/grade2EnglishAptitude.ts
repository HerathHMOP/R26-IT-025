export type Grade2Activity =
  | {
      id: number;
      type: "drag_number_order";
      prompt: string;
      dragNumberOrder: {
        title: string;
        targetOrder: number[];
        cards: Array<{ key: string; number: number; image: string; label: string }>;
      };
    }
  | {
      id: number;
      type: "match_image_pairs";
      prompt: string;
      matchImagePairs: {
        title: string;
        leftImages: Array<{ key: string; image: string; label: string }>;
        rightImages: Array<{ key: string; image?: string; shape?: string; label: string }>;
        answerMap: Record<string, string>;
      };
    }
  | {
      id: number;
      type: "match_shapes";
      prompt: string;
      matchShapes: {
        title: string;
        leftShapes: Array<{ key: string; shape: string; label: string }>;
        rightShapes: Array<{ key: string; shape: string; label: string }>;
        answerMap: Record<string, string>;
      };
    }
  | {
      id: number;
      type: "circle_lowercase";
      prompt: string;
      circleLowercaseRows: Array<{ key: string; uppercase: string; options: string[]; answer: string }>;
    }
  | {
      id: number;
      type: "drag_sort_groups";
      prompt: string;
      dragSortGroups: {
        title: string;
        groups: Array<{ key: string; label: string }>;
        items: Array<{ key: string; image?: string; label: string; answerGroupKey: string }>;
      };
    };

export const grade2EnglishAptitude = [];
