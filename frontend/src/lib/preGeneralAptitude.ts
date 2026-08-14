import type { Grade2Activity } from "@/lib/grade2EnglishAptitude";

const IMG_BASE = "/aptitude-test/general/pre/images/Activity%2001";

export const preGeneralActivities: Grade2Activity[] = [
  {
    id: 1,
    type: "drag_number_order",
    prompt: "Activity 1: Drag and Drop 1 to 5",
    dragNumberOrder: {
      title: "Drag pictures into number order",
      targetOrder: [1, 2, 3, 4, 5],
      cards: [
        { key: "card-1", number: 1, image: `${IMG_BASE}/banana.png`, label: "Banana" },
        { key: "card-2", number: 2, image: `${IMG_BASE}/cherries.png`, label: "Cherries" },
        { key: "card-3", number: 3, image: `${IMG_BASE}/avocados.png`, label: "Avocados" },
        { key: "card-4", number: 4, image: `${IMG_BASE}/mangoes.png`, label: "Mangoes" },
        { key: "card-5", number: 5, image: `${IMG_BASE}/oranges.png`, label: "Oranges" }
      ]
    }
  },
  {
    id: 2,
    type: "match_image_pairs",
    prompt: "Activity 2: Match the picture pairs",
    matchImagePairs: {
      title: "Find the matching picture partner",
      leftImages: [
        { key: "icecream", image: "/aptitude-test/general/pre/images/Activity-2/icecream.png", label: "Ice Cream" },
        { key: "ball", image: "/aptitude-test/general/pre/images/Activity-2/ball.png", label: "Ball" },
        { key: "orange", image: "/aptitude-test/general/pre/images/Activity-2/orange.png", label: "Orange" }
      ],
      rightImages: [
        { key: "girl", image: "/aptitude-test/general/pre/images/Activity-2/girl.png", label: "Girl" },
        { key: "bat", image: "/aptitude-test/general/pre/images/Activity-2/bat.png", label: "Bat" },
        { key: "icecream", image: "/aptitude-test/general/pre/images/Activity-2/icecream.png", label: "Ice Cream" }
      ],
      answerMap: {
        icecream: "girl",
        ball: "bat",
        orange: "icecream"
      }
    }
  },
  {
    id: 3,
    type: "match_shapes",
    prompt: "Activity 3: Match the shape",
    matchShapes: {
      title: "Match same shapes",
      leftShapes: [
        { key: "l-square", shape: "square", label: "Square" },
        { key: "l-circle", shape: "circle", label: "Circle" },
        { key: "l-triangle", shape: "triangle", label: "Triangle" },
        { key: "l-star", shape: "star", label: "Star" },
        { key: "l-rectangle", shape: "rectangle", label: "Rectangle" }
      ],
      rightShapes: [
        { key: "r-triangle", shape: "triangle", label: "Triangle" },
        { key: "r-rectangle", shape: "rectangle", label: "Rectangle" },
        { key: "r-square", shape: "square", label: "Square" },
        { key: "r-circle", shape: "circle", label: "Circle" },
        { key: "r-star", shape: "star", label: "Star" }
      ],
      answerMap: {
        "l-square": "r-square",
        "l-circle": "r-circle",
        "l-triangle": "r-triangle",
        "l-star": "r-star",
        "l-rectangle": "r-rectangle"
      }
    }
  },
  {
    id: 4,
    type: "circle_lowercase",
    prompt: "Activity 4: Circle the lower-case letter in each row",
    circleLowercaseRows: [
      { key: "row-s", uppercase: "S", options: ["c", "s", "e", "h"], answer: "s" },
      { key: "row-l", uppercase: "L", options: ["v", "n", "V", "l"], answer: "l" },
      { key: "row-m", uppercase: "M", options: ["a", "m", "e", "c"], answer: "m" },
      { key: "row-n", uppercase: "N", options: ["d", "l", "t", "n"], answer: "n" },
      { key: "row-o", uppercase: "O", options: ["b", "m", "o", "a"], answer: "o" }
    ]
  },
  {
    id: 5,
    type: "match_image_pairs",
    prompt: "Activity 5: Match baby to mother",
    matchImagePairs: {
      title: "Match each baby animal to its mother",
      leftImages: [
        { key: "cow-baby", image: "/aptitude-test/general/pre/images/Activity-5/baby-cow.png", label: "Cow Baby" },
        { key: "pig-baby", image: "/aptitude-test/general/pre/images/Activity-5/baby-pig.png", label: "Pig Baby" },
        { key: "giraffe-baby", image: "/aptitude-test/general/pre/images/Activity-5/baby-giraffe.png", label: "Giraffe Baby" },
        { key: "elephant-baby", image: "/aptitude-test/general/pre/images/Activity-5/baby-elephant.png", label: "Elephant Baby" }
      ],
      rightImages: [
        { key: "pig-mother", image: "/aptitude-test/general/pre/images/Activity-5/mother-pig.png", label: "Pig Mother" },
        { key: "cow-mother", image: "/aptitude-test/general/pre/images/Activity-5/mother-cow.png", label: "Cow Mother" },
        { key: "elephant-mother", image: "/aptitude-test/general/pre/images/Activity-5/mother-elephant.png", label: "Elephant Mother" },
        { key: "giraffe-mother", image: "/aptitude-test/general/pre/images/Activity-5/mother-giraffe.png", label: "Giraffe Mother" }
      ],
      answerMap: {
        "cow-baby": "cow-mother",
        "pig-baby": "pig-mother",
        "giraffe-baby": "giraffe-mother",
        "elephant-baby": "elephant-mother"
      }
    }
  },
  {
    id: 6,
    type: "match_image_pairs",
    prompt: "Activity 6: Match the correct wheel",
    matchImagePairs: {
      title: "Match each car with its correct wheel",
      leftImages: [
        { key: "black-car", image: "/aptitude-test/general/pre/images/Activity%2007/black-car.png", label: "Black Car" },
        { key: "red-car", image: "/aptitude-test/general/pre/images/Activity%2007/red-car.png", label: "Red Car" },
        { key: "blue-car", image: "/aptitude-test/general/pre/images/Activity%2007/blue-car.png", label: "Blue Car" },
        { key: "yellow-car", image: "/aptitude-test/general/pre/images/Activity%2007/yellow-car.png", label: "Yellow Car" }
      ],
      rightImages: [
        { key: "blue-tyre", image: "/aptitude-test/general/pre/images/Activity%2007/blue-tyre.png", label: "Blue Wheel" },
        { key: "red-tyre", image: "/aptitude-test/general/pre/images/Activity%2007/red-tyre.png", label: "Red Wheel" },
        { key: "yellow-tyre", image: "/aptitude-test/general/pre/images/Activity%2007/yellow-tyre.png", label: "Yellow Wheel" },
        { key: "black-tyre", image: "/aptitude-test/general/pre/images/Activity%2007/black-tyre.png", label: "Black Wheel" }
      ],
      answerMap: {
        "black-car": "black-tyre",
        "red-car": "red-tyre",
        "blue-car": "blue-tyre",
        "yellow-car": "yellow-tyre"
      }
    }
  },
  {
    id: 7,
    type: "match_image_pairs",
    prompt: "Activity 7: Match the correct food",
    matchImagePairs: {
      title: "Match each animal/object with correct food",
      leftImages: [
        { key: "butterfly", image: "/aptitude-test/general/pre/images/Activity-15/butterfly.png", label: "Butterfly" },
        { key: "cow", image: "/aptitude-test/general/pre/images/Activity-15/cow.png", label: "Cow" },
        { key: "dog", image: "/aptitude-test/general/pre/images/Activity-15/dog.png", label: "Dog" },
        { key: "parrot", image: "/aptitude-test/general/pre/images/Activity-15/parrot.png", label: "Parrot" }
      ],
      rightImages: [
        { key: "flower", image: "/aptitude-test/general/pre/images/Activity-15/flower.png", label: "Flower" },
        { key: "meat", image: "/aptitude-test/general/pre/images/Activity-15/meat.png", label: "Meat" },
        { key: "grass", image: "/aptitude-test/general/pre/images/Activity-15/grass.png", label: "Grass" },
        { key: "mango-food", image: "/aptitude-test/general/pre/images/Activity-15/mango.png", label: "Mango" },
        { key: "parrot-food", image: "/aptitude-test/general/pre/images/Activity-15/flower.png", label: "Flower" }
      ],
      answerMap: {
        butterfly: "flower",
        cow: "grass",
        dog: "meat",
        parrot: "parrot-food"
      }
    }
  },
  {
    id: 8,
    type: "match_image_pairs",
    prompt: "Activity 8: Match the home",
    matchImagePairs: {
      title: "Match each animal with its home",
      leftImages: [
        { key: "bee", image: "/aptitude-test/general/pre/images/Activity-11/bee.png", label: "Bee" },
        { key: "lion", image: "/aptitude-test/general/pre/images/Activity-11/lion.png", label: "Lion" },
        { key: "dog", image: "/aptitude-test/general/pre/images/Activity-11/dog.png", label: "Dog" }
      ],
      rightImages: [
        { key: "bee-home", image: "/aptitude-test/general/pre/images/Activity-11/bee-home.png", label: "Bee Home" },
        { key: "lion-home", image: "/aptitude-test/general/pre/images/Activity-11/lion-home.png", label: "Lion Home" },
        { key: "dog-home", image: "/aptitude-test/general/pre/images/Activity-11/dog-home.png", label: "Dog Home" }
      ],
      answerMap: {
        bee: "bee-home",
        lion: "lion-home",
        dog: "dog-home"
      }
    }
  },
  {
    id: 9,
    type: "match_image_pairs",
    prompt: "Activity 9: Match the shape",
    matchImagePairs: {
      title: "Match each shape with the same shape",
      leftImages: [
        { key: "triangle-left", image: "/aptitude-test/general/pre/images/Activity-10/triangle-shape.png", label: "Triangle" },
        { key: "rectangle-left", image: "/aptitude-test/general/pre/images/Activity-10/rectangle-shape.png", label: "Rectangle" },
        { key: "circle-left", image: "/aptitude-test/general/pre/images/Activity-10/circle-shape.png", label: "Circle" },
        { key: "square-left", image: "/aptitude-test/general/pre/images/Activity-10/squre-shape.png", label: "Square" }
      ],
      rightImages: [
        { key: "square-right", shape: "square", label: "Square" },
        { key: "circle-right", shape: "circle", label: "Circle" },
        { key: "triangle-right", shape: "triangle", label: "Triangle" },
        { key: "rectangle-right", shape: "rectangle", label: "Rectangle" }
      ],
      answerMap: {
        "triangle-left": "triangle-right",
        "rectangle-left": "rectangle-right",
        "circle-left": "circle-right",
        "square-left": "square-right"
      }
    }
  },
  {
    id: 10,
    type: "drag_sort_groups",
    prompt: "Activity 10: Drag fruits and vegetables",
    dragSortGroups: {
      title: "Drag each image to the correct group",
      groups: [
        { key: "fruits", label: "Fruits" },
        { key: "vegetables", label: "Vegetables" }
      ],
      items: [
        { key: "fruit-1", image: "/aptitude-test/general/pre/images/Activity%2009/fruit-1.png", label: "Fruit 1", answerGroupKey: "fruits" },
        { key: "fruit-2", image: "/aptitude-test/general/pre/images/Activity%2009/fruit-2.png", label: "Fruit 2", answerGroupKey: "fruits" },
        { key: "fruit-3", image: "/aptitude-test/general/pre/images/Activity%2009/fruit-3.png", label: "Fruit 3", answerGroupKey: "fruits" },
        { key: "fruit-4", image: "/aptitude-test/general/pre/images/Activity%2009/fruit-4.png", label: "Fruit 4", answerGroupKey: "fruits" },
        { key: "vegitable-1", image: "/aptitude-test/general/pre/images/Activity%2009/vegitable-1.png", label: "Vegetable 1", answerGroupKey: "vegetables" },
        { key: "vegitable-2", image: "/aptitude-test/general/pre/images/Activity%2009/vegitable-2.png", label: "Vegetable 2", answerGroupKey: "vegetables" },
        { key: "vegitable-3", image: "/aptitude-test/general/pre/images/Activity%2009/vegitable-3.png", label: "Vegetable 3", answerGroupKey: "vegetables" },
        { key: "vegitable-4", image: "/aptitude-test/general/pre/images/Activity%2009/vegitable-4.png", label: "Vegetable 4", answerGroupKey: "vegetables" }
      ]
    }
  }
];
