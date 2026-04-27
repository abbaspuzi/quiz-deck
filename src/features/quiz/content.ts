import questionData from "../../../quiz-questions.json";

export type QuestionCategory =
  | "visual-tells"
  | "size-scale"
  | "scenario"
  | "ingredient-audit"
  | "orchid-id"
  | "visual-id"
  | "this-or-that"
  | "flower-recognise";

export type QuizQuestion = {
  id: string;
  cluster: string;
  category: QuestionCategory;
  type:
    | "single_choice"
    | "audit"
    | "counting"
    | "scenario"
    | "true_false"
    | "this_or_that"
    | "name_product";
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
  image?: string;
  images?: [string, string];
};

export type TrainingCard = {
  id: string;
  kind: "image-to-name" | "name-to-image";
  prompt: string;
  answer: string;
  explain: string;
  cluster: string;
  category: QuestionCategory;
  image?: string;
  textOptions?: string[];
  imageOptions?: Array<{ name: string; image: string }>;
};

export const highRiskClusters = [
  {
    id: "russian-wraps",
    label: "Cluster A",
    title: "The Russian Wraps",
    focus: "Marilyn vs Miriam, driven by wrapper color and Matthiola presence.",
  },
  {
    id: "sunflower-hearts",
    label: "Cluster B",
    title: "The Sunflower Hearts",
    focus: "Zooey Bouquet vs Zooey Box vs Zendaya, driven by heart color and Red Rose Spray.",
  },
  {
    id: "pink-hatboxes",
    label: "Cluster C",
    title: "The Pink Hatboxes",
    focus: "Tessa vs Zandra vs Zaylee, driven by rose variety and hero exclusions.",
  },
  {
    id: "technical-wraps",
    label: "Cluster D",
    title: "The Technical Wraps",
    focus: "Laycie vs Trixie vs Mischa, driven by wrapper hardware and distinct filler mix.",
  },
] as const;

export const sampleParticipants = [
  "Aina",
  "Amirah",
  "Aqilah",
  "Chloe",
  "Farah",
  "Iffah",
  "Melissa",
  "Nadia",
  "Nurul",
  "Siti",
] as const;

export const categories: { id: QuestionCategory; label: string; focus: string }[] = [
  {
    id: "visual-tells",
    label: "Basic Product Knowledge",
    focus: "Instant identification via wrappers, ribbons, and hero colors.",
  },
  {
    id: "size-scale",
    label: "Size & Scale Check",
    focus: "Distinguishing between Medium and Large variants.",
  },
  {
    id: "scenario",
    label: "Scenario-Based",
    focus: "Resolving high-risk confusion points in a live production environment.",
  },
  {
    id: "ingredient-audit",
    label: "Multi-Ingredient Audit",
    focus: "Complexity checks for mixed bouquets.",
  },
  {
    id: "orchid-id",
    label: "Orchid Identification",
    focus: "Potted plants vs cut flowers, and differentiating the Indira product.",
  },
  {
    id: "visual-id",
    label: "Visual Evidence & Identification",
    focus: "Using specific physical markers to confirm product and size from photos.",
  },
  {
    id: "this-or-that",
    label: "This or That",
    focus: "Pick the correct product from two similar-looking arrangements.",
  },
  {
    id: "flower-recognise",
    label: "Flower Recognise",
    focus: "Identify the correct product from two photos side by side.",
  },
];

export const allQuestions = questionData as QuizQuestion[];

const trainingProducts = allQuestions
  .filter((question) => question.type === "name_product" && question.image)
  .map((question) => ({
    id: question.id,
    name: question.answer,
    image: question.image!,
    explain: question.explain,
    cluster: question.cluster,
    category: question.category,
    options: question.options,
  }));

export const flowerRecogniseQuestions = allQuestions.filter(
  (question) => question.category === "flower-recognise",
);

export type QuizMode = "all" | "flower-recognise";

export const quizModes: { id: QuizMode; label: string; description: string }[] = [
  { id: "all", label: "Full Quiz", description: "All question types mixed together" },
  {
    id: "flower-recognise",
    label: "Flower Recognise",
    description: "Pick the correct product from two photos",
  },
];

export function getQuestionsForMode(mode: QuizMode): QuizQuestion[] {
  if (mode === "flower-recognise") return flowerRecogniseQuestions;
  return allQuestions;
}

const answerAliases: Record<string, string[]> = {
  "q14-laycie-ingredients": [
    "Ocean Song Rose, White Cut Orchid, White Matthiola",
    "Ocean Song Rose, White Phalaenopsis Orchid, White Matthiola",
  ],
};

export function isCorrectSelection(question: QuizQuestion, selection: string): boolean {
  const aliases = answerAliases[question.id];
  if (aliases) return aliases.includes(selection);
  return question.answer === selection;
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function buildQuiz(count = 20): QuizQuestion[] {
  const shuffled = shuffle(allQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const sizeTrainingCards: TrainingCard[] = [
  {
    id: "training-size-zaylee-medium",
    kind: "image-to-name",
    prompt: "What size is this Zaylee Pink Mum Mother's Day Flower Box?",
    answer: "Medium",
    explain:
      "Medium Zaylee is the smaller 42 cm x 35 cm box with 2-3 Avalanche Roses and 1-2 Pink Anthuriums. Large steps up to 60 cm x 55 cm with visibly fuller roses, mums, carnations, and anthuriums.",
    cluster: "pink-hatboxes",
    category: "size-scale",
    image: "/quiz-images/zaylee-pink-mum-mothers-day-flower-box-medium-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-zaylee-large",
    kind: "image-to-name",
    prompt: "What size is this Zaylee Pink Mum Mother's Day Flower Box?",
    answer: "Large",
    explain:
      "Large Zaylee is much wider and taller at 60 cm x 55 cm, with 5-6 Avalanche Roses and 2-3 Pink Anthuriums. Medium is tighter at 42 cm x 35 cm.",
    cluster: "pink-hatboxes",
    category: "size-scale",
    image: "/quiz-images/zaylee-pink-mum-mothers-day-flower-box-large-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-marilyn-medium",
    kind: "image-to-name",
    prompt: "What size is this Marilyn Pink Carnation Mother's Day Bouquet?",
    answer: "Medium",
    explain:
      "Medium Marilyn is narrower and uses 2-3 stalks each of Pink Gerbera, Pink Carnation, and Hot Cherry Pink Rose. Large roughly doubles those hero flowers to 4-5 stalks each.",
    cluster: "russian-wraps",
    category: "size-scale",
    image: "/quiz-images/marilyn-pink-carnation-mothers-day-bouquet-medium-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-marilyn-large",
    kind: "image-to-name",
    prompt: "What size is this Marilyn Pink Carnation Mother's Day Bouquet?",
    answer: "Large",
    explain:
      "Large Marilyn has a broader 56 cm x 50 cm profile and 4-5 stalks each of Pink Gerbera, Pink Carnation, and Hot Cherry Pink Rose. Medium is more compact at 50 cm x 46 cm.",
    cluster: "russian-wraps",
    category: "size-scale",
    image: "/quiz-images/marilyn-pink-carnation-mothers-day-bouquet-large-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-zooey-medium",
    kind: "image-to-name",
    prompt: "What size is this Zooey Yellow Sunflower Bouquet?",
    answer: "Medium",
    explain:
      "Medium Zooey has 2-3 Green Heart Sunflowers and 1-2 Lilac Matthiola stalks. Large expands to 4-5 sunflowers and 2-3 Matthiola stalks, with a wider 55 cm x 60 cm shape.",
    cluster: "sunflower-hearts",
    category: "size-scale",
    image: "/quiz-images/zooey-yellow-sunflower-bouquet-medium-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-zooey-large",
    kind: "image-to-name",
    prompt: "What size is this Zooey Yellow Sunflower Bouquet?",
    answer: "Large",
    explain:
      "Large Zooey carries 4-5 Green Heart Sunflowers, making the sunflower head count the fastest tell. Medium has only 2-3 sunflowers and a smaller 45 cm x 52 cm silhouette.",
    cluster: "sunflower-hearts",
    category: "size-scale",
    image: "/quiz-images/zooey-yellow-sunflower-bouquet-large-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-izzy-medium",
    kind: "image-to-name",
    prompt: "What size is this Izzy Pink Daisy Flower Box?",
    answer: "Medium",
    explain:
      "Medium Izzy is close in scale to Large, so count the volume: Medium uses 3-4 Pink Gerbera, 3-4 Peach Gerbera, 1-2 Hot Cherry Pink Carnations, and 1 Yellow Rose Spray.",
    cluster: "pink-hatboxes",
    category: "size-scale",
    image: "/quiz-images/izzy-pink-daisy-flower-box-medium-current.jpg",
    textOptions: ["Medium", "Large"],
  },
  {
    id: "training-size-izzy-large",
    kind: "image-to-name",
    prompt: "What size is this Izzy Pink Daisy Flower Box?",
    answer: "Large",
    explain:
      "Large Izzy is the tricky one because the dimensions are close, but it has fuller flower counts: 4-6 Pink Gerbera, 4-6 Peach Gerbera, 2-3 Hot Cherry Pink Carnations, and 1-2 Yellow Rose Spray.",
    cluster: "pink-hatboxes",
    category: "size-scale",
    image: "/quiz-images/izzy-pink-daisy-flower-box-large-current.jpg",
    textOptions: ["Medium", "Large"],
  },
];

export function buildTrainingDeck(): TrainingCard[] {
  const productTrainingCards: TrainingCard[] = trainingProducts.flatMap((product, index) => {
    const distractors = [1, 2, 3].map(
      (offset) => trainingProducts[(index + offset) % trainingProducts.length],
    );

    return [
      {
        id: `${product.id}-image-to-name`,
        kind: "image-to-name",
        prompt: "Select the correct flower name.",
        answer: product.name,
        explain: product.explain,
        cluster: product.cluster,
        category: product.category,
        image: product.image,
        textOptions: product.options,
      },
      {
        id: `${product.id}-name-to-image`,
        kind: "name-to-image",
        prompt: `Find ${product.name}.`,
        answer: product.name,
        explain: product.explain,
        cluster: product.cluster,
        category: product.category,
        imageOptions: shuffle([
          { name: product.name, image: product.image },
          ...distractors.map((item) => ({ name: item.name, image: item.image })),
        ]),
      },
    ];
  });

  return [...productTrainingCards, ...sizeTrainingCards];
}
