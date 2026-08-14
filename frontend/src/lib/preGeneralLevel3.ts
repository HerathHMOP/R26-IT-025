const IMG = "/level-test/pre/level-3/activity-1";
const SPR = `${IMG}/sprites`;

export type FarmItem = {
  key: string;
  label: string;
  labelSi: string;
  image: string;
};

export const preGeneralLevel3Activity1 = {
  id: 1,
  type: "my_farm_builder" as const,
  title: "මගේ ගොවිපළ",
  titleEn: "My Farm",
  prompt: "රූප ඇදගෙන ඔබේ ගොවිපල සාදන්න.",
  hint: "රූප තෝරා ගොවිපල මත තබන්න. සියලු රූප යොදා සම්පූර්ණයි ඔබන්න.",
  instruction: "රූප ඇදගෙන ඔබේ ගොවිපල සාදන්න. රූප ඇදගෙන නිවැරදි ස්ථානවල තබන්න.",
  tip: "උපදෙස: ඔබේ ගොවිපල මෙහි සාදන්න — සතුන්, ගස් සහ යන්ත්‍ර යොදන්න!",
  successMessage: "ඉතාම හොඳයි! ඔබේ ගොවිපල සූදානම්!",
  pointsPerCorrect: 10,
  landImage: `${IMG}/Land.png`,
  items: [
    { key: "cow", label: "Cow", labelSi: "එළදෙන", image: `${SPR}/cow.png` },
    { key: "hen", label: "Hen", labelSi: "කුකුළා", image: `${SPR}/hen.png` },
    { key: "tree", label: "Tree", labelSi: "ගස", image: `${SPR}/tree.png` },
    { key: "flower", label: "Flower", labelSi: "මල", image: `${SPR}/flower.png` },
    { key: "house", label: "House", labelSi: "ගෙය", image: `${SPR}/house.png` },
    { key: "sun", label: "Sun", labelSi: "හිරු", image: `${SPR}/sun.png` },
    { key: "pond", label: "Pond", labelSi: "වැව", image: `${SPR}/pond.png` },
    { key: "grass", label: "Grass", labelSi: "තණකොළ", image: `${SPR}/grass.png` },
    { key: "hay", label: "Hay", labelSi: "පිදුරු", image: `${SPR}/hay.png` },
    { key: "fence", label: "Fence", labelSi: "වැට", image: `${SPR}/fence.png` },
    { key: "tractor", label: "Tractor", labelSi: "ට්‍රැක්ටර්", image: `${SPR}/tractor.png` },
    { key: "well", label: "Well", labelSi: "ළිඳ", image: `${SPR}/well.png` }
  ] satisfies FarmItem[]
};

const SENSE = "/level-test/pre/level-3/activity-2";

export const preGeneralLevel3Activity2 = {
  id: 2,
  type: "sense_match" as const,
  title: "Sense Match!",
  titleEn: "Sense Match",
  prompt: "Match the object with the correct body part.",
  hint: "Listen and drag the correct object to the body part.",
  instruction: "Listen and drag the correct object to the body part.",
  tip: "Tap a body part to hear its sense. Then drag the matching object.",
  successMessage: "Great job! All senses matched!",
  pointsPerCorrect: 10,
  targets: [
    {
      key: "eyes",
      label: "Eyes",
      image: `${SENSE}/Eyes.png`,
      answerKey: "moon",
      voiceAudio: `${SENSE}/See.mp3`
    },
    {
      key: "ear",
      label: "Ear",
      image: `${SENSE}/Ear.png`,
      answerKey: "radio",
      voiceAudio: `${SENSE}/Hear.mp3`
    },
    {
      key: "nose",
      label: "Nose",
      image: `${SENSE}/Nose.png`,
      answerKey: "perfume",
      voiceAudio: `${SENSE}/Smell.mp3`
    },
    {
      key: "mouth",
      label: "Mouth",
      image: `${SENSE}/Mouth.png`,
      answerKey: "watermelon",
      voiceAudio: `${SENSE}/Taste.mp3`
    },
    {
      key: "hand",
      label: "Hand",
      image: `${SENSE}/Hand.png`,
      answerKey: "pillow",
      voiceAudio: `${SENSE}/Touch.mp3`
    }
  ],
  objects: [
    { key: "radio", label: "Radio", image: `${SENSE}/Radio.png` },
    { key: "pillow", label: "Pillow", image: `${SENSE}/Pillow.png` },
    { key: "moon", label: "Moon", image: `${SENSE}/Moon.png` },
    { key: "watermelon", label: "Watermelon", image: `${SENSE}/Watermelon.png` },
    { key: "perfume", label: "Perfume", image: `${SENSE}/Perfume.png` }
  ]
};

const LETTER = "/level-test/pre/level-3/activity-3/tasks";

export const preGeneralLevel3Activity3 = {
  id: 3,
  type: "letter_image_match" as const,
  title: "සිංහල අකුරු හඳුනාමු",
  titleEn: "Identify Sinhala Letters",
  prompt: "ගැලපෙන රූපය සොයා ඉරක් අඳින්න.",
  hint: "අකුර බලා නිවැරදි රූපය තෝරන්න.",
  instruction: "ගැලපෙන රූපය සොයා ඉරක් අඳින්න.",
  tip: "උපදෙස: අකුරින් පටන් ගන්නා වචනයේ රූපය තෝරන්න.",
  successMessage: "ඉතාම හොඳයි! අකුරු නිවැරදිව ගැලපුවා!",
  pointsPerCorrect: 10,
  wrongLabel: "නැවත උත්සාහ කරන්න.",
  tasks: [
    {
      key: "ga",
      letter: "ග",
      letterImage: `${LETTER}/ga/letter.png`,
      tone: "#efe7ff",
      answerKey: "tree",
      options: [
        { key: "sun", label: "ඉර", image: `${LETTER}/ga/sun.png` },
        { key: "squirrel", label: "ලේනා", image: `${LETTER}/ga/squirrel.png` },
        { key: "tree", label: "ගස", image: `${LETTER}/ga/tree.png` }
      ]
    },
    {
      key: "ma",
      letter: "ම",
      letterImage: `${LETTER}/ma/letter.png`,
      tone: "#e7f8ee",
      answerKey: "flower",
      options: [
        { key: "mango", label: "අඹ", image: `${LETTER}/ma/mango.png` },
        { key: "mushroom", label: "හතු", image: `${LETTER}/ma/mushroom.png` },
        { key: "flower", label: "මල", image: `${LETTER}/ma/flower.png` }
      ]
    },
    {
      key: "a",
      letter: "අ",
      letterImage: `${LETTER}/a/letter.png`,
      tone: "#fff6d6",
      answerKey: "mango",
      options: [
        { key: "mango", label: "අඹ", image: `${LETTER}/a/mango.png` },
        { key: "rock", label: "ගල", image: `${LETTER}/a/rock.png` },
        { key: "rabbit", label: "හාවා", image: `${LETTER}/a/rabbit.png` }
      ]
    }
  ]
};

const COUNT = "/level-test/pre/level-3/activity-4";

export const preGeneralLevel3Activity4 = {
  id: 4,
  type: "count_number_match" as const,
  title: "ගණන් කරමු",
  titleEn: "Let's Count",
  subtitle: "ඉලක්කම සොයන්න",
  prompt: "ගණන් කර ඉලක්කම සොයා සම්බන්ධ කරන්න.",
  hint: "මල් ගණන් කර නිවැරදි ඉලක්කම තෝරන්න.",
  instruction: "ගණන් කර ඉලක්කම සොයා සම්බන්ධ කරන්න.",
  tip: "උපදෙස: මල් ගණන් කර එකතුවට ගැලපෙන ඉලක්කම ඇද දමන්න.",
  successMessage: "ඉතාම හොඳයි! ගණන් නිවැරදියි!",
  pointsPerCorrect: 10,
  wrongLabel: "නැවත ගණන් කර උත්සාහ කරන්න.",
  numbersTitle: "ඉලක්කම්",
  equations: [
    {
      key: "one_plus_one",
      image: `${COUNT}/1.png`,
      label: "1 + 1",
      answer: 2
    },
    {
      key: "two_plus_one",
      image: `${COUNT}/2.png`,
      label: "2 + 1",
      answer: 3
    },
    {
      key: "three_plus_three",
      image: `${COUNT}/3.png`,
      label: "3 + 3",
      answer: 6
    },
    {
      key: "four_plus_one",
      image: `${COUNT}/5.png`,
      label: "4 + 1",
      answer: 5
    }
  ],
  numbers: [
    { value: 3, label: "තුන" },
    { value: 5, label: "පහ" },
    { value: 2, label: "දෙක" },
    { value: 6, label: "හය" }
  ]
};

const SAME = "/level-test/pre/level-3/activity-5/letters";

export const preGeneralLevel3Activity5 = {
  id: 5,
  type: "same_letter_match" as const,
  title: "සමාන අකුරු යා කරන්න",
  titleEn: "Match the Same Letters",
  prompt: "වම් පැත්තේ අකුරු හා දකුණු පැත්තේ ඇති සමාන අකුරු යා කරන්න.",
  hint: "වම් අකුර තෝරා, දකුණු පැත්තේ එම අකුරම තෝරන්න.",
  instruction: "වම් පැත්තේ අකුරු හා දකුණු පැත්තේ ඇති සමාන අකුරු යා කරන්න.",
  tip: "උපදෙස: මුලින් වම් අකුර තෝරන්න, පසුව දකුණු පැත්තේ සමාන අකුර තෝරන්න.",
  successMessage: "ඉතාම හොඳයි! සමාන අකුරු යා කළා!",
  pointsPerCorrect: 10,
  wrongLabel: "නැවත බලා සමාන අකුරු යා කරන්න.",
  leftItems: [
    { key: "ra", letter: "ර", image: `${SAME}/ra.png`, tone: "#d9ecff" },
    { key: "na", letter: "න", image: `${SAME}/na.png`, tone: "#ffe2c8" },
    { key: "va", letter: "ව", image: `${SAME}/va.png`, tone: "#d9f5e2" },
    { key: "ka", letter: "ක", image: `${SAME}/ka.png`, tone: "#ead9ff" },
    { key: "da", letter: "ද", image: `${SAME}/da.png`, tone: "#d9ecff" },
    { key: "la", letter: "ල", image: `${SAME}/la.png`, tone: "#ffe2c8" },
    { key: "u", letter: "උ", image: `${SAME}/u.png`, tone: "#ead9ff" }
  ],
  // Scrambled right column (same 7 letters as assets — no duplicates)
  rightOrder: ["va", "la", "da", "u", "ra", "na", "ka"]
};

export const preGeneralLevel3Ui = {
  gradeLevel: "Pre Grade · මට්ටම 3",
  activityLabel: "ක්‍රියාකාරකම",
  levelTitle: "මගේ ලෝකය ගොඩනැගීම",
  scoreLabel: "ලකුණු",
  listen: "උපදෙස අසන්න",
  listening: "අසමින්…",
  correct: "නිවැරදියි! ★",
  wrong: "තවත් රූප යොදා නැවත උත්සාහ කරන්න.",
  wrongSense: "Try again — check each match.",
  done: "සම්පූර්ණයි",
  check: "Check Answer",
  reset: "නැවත ආරම්භ කරන්න",
  undo: "අවලංගු කරන්න",
  help: "උපකාර",
  hint: "Need a Hint?",
  trayTitle: "Drag the correct object",
  letterCheck: "පරීක්ෂා කරන්න",
  letterReset: "නැවත කරන්න",
  countCheck: "පරීක්ෂා කරන්න",
  countReset: "නැවත මුල සිට",
  countHint: "උදව් ලබා ගන්න",
  completeActivity1: "★ ක්‍රියාකාරකම 01 සම්පූර්ණයි! ඔබේ ගොවිපල ලස්සනයි.",
  completeActivity2: "★ Activity 02 complete! Sense Match mastered.",
  completeActivity3: "★ ක්‍රියාකාරකම 03 සම්පූර්ණයි! අකුරු හඳුනා ගත්තා!",
  completeActivity4: "★ ක්‍රියාකාරකම 04 සම්පූර්ණයි! ගණන් නිවැරදියි!",
  completeActivity5: "★ ක්‍රියාකාරකම 05 සම්පූර්ණයි! සමාන අකුරු යා කළා!",
  levelComplete: "★ මට්ටම 3 සම්පූර්ණයි!",
  lockedTitle: "මට්ටම අගුලු දමා ඇත",
  lockedBody: "මට්ටම 3 විවෘත කිරීමට මට්ටම 2 සම්පූර්ණ කරන්න.",
  backProfile: "පැතිකඩට ආපසු",
  home: "මුල් පිටුව",
  openLevel2: "මට්ටම 2ට යන්න",
  paletteTitle: "රූප තෝරන්න",
  fieldHint: "ඔබේ ගොවිපල මෙහි සාදන්න"
};

export const preGeneralLevel3Activities = [
  preGeneralLevel3Activity1,
  preGeneralLevel3Activity2,
  preGeneralLevel3Activity3,
  preGeneralLevel3Activity4,
  preGeneralLevel3Activity5
];
