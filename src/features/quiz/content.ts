import questionData from '../../../quiz-questions.json'

export type QuestionCategory =
  | 'visual-tells'
  | 'size-scale'
  | 'scenario'
  | 'ingredient-audit'
  | 'orchid-id'
  | 'visual-id'
  | 'this-or-that'
  | 'flower-recognise'

export type QuizQuestion = {
  id: string
  cluster: string
  category: QuestionCategory
  type: 'single_choice' | 'audit' | 'counting' | 'scenario' | 'true_false' | 'this_or_that' | 'name_product'
  prompt: string
  options: string[]
  answer: string
  explain: string
  image?: string
  images?: [string, string]
}

export type TrainingCard = {
  id: string
  kind: 'image-to-name' | 'name-to-image'
  prompt: string
  answer: string
  explain: string
  cluster: string
  category: QuestionCategory
  image?: string
  textOptions?: string[]
  imageOptions?: Array<{ name: string; image: string }>
}

export const highRiskClusters = [
  {
    id: 'russian-wraps',
    label: 'Cluster A',
    title: 'The Russian Wraps',
    focus: 'Marilyn vs Miriam, driven by wrapper color and Matthiola presence.',
  },
  {
    id: 'sunflower-hearts',
    label: 'Cluster B',
    title: 'The Sunflower Hearts',
    focus: 'Zooey Bouquet vs Zooey Box vs Zendaya, driven by heart color and Red Rose Spray.',
  },
  {
    id: 'pink-hatboxes',
    label: 'Cluster C',
    title: 'The Pink Hatboxes',
    focus: 'Tessa vs Zandra vs Zaylee, driven by rose variety and hero exclusions.',
  },
  {
    id: 'technical-wraps',
    label: 'Cluster D',
    title: 'The Technical Wraps',
    focus: 'Laycie vs Trixie vs Mischa, driven by wrapper hardware and distinct filler mix.',
  },
] as const

export const sampleParticipants = [
  'Aina',
  'Amirah',
  'Aqilah',
  'Chloe',
  'Farah',
  'Iffah',
  'Melissa',
  'Nadia',
  'Nurul',
  'Siti',
] as const

export const categories: { id: QuestionCategory; label: string; focus: string }[] = [
  {
    id: 'visual-tells',
    label: 'Basic Product Knowledge',
    focus: 'Instant identification via wrappers, ribbons, and hero colors.',
  },
  {
    id: 'size-scale',
    label: 'Size & Scale Check',
    focus: 'Distinguishing between Medium and Large variants.',
  },
  {
    id: 'scenario',
    label: 'Scenario-Based',
    focus: 'Resolving high-risk confusion points in a live production environment.',
  },
  {
    id: 'ingredient-audit',
    label: 'Multi-Ingredient Audit',
    focus: 'Complexity checks for mixed bouquets.',
  },
  {
    id: 'orchid-id',
    label: 'Orchid Identification',
    focus: 'Potted plants vs cut flowers, and differentiating the Indira product.',
  },
  {
    id: 'visual-id',
    label: 'Visual Evidence & Identification',
    focus: 'Using specific physical markers to confirm product and size from photos.',
  },
  {
    id: 'this-or-that',
    label: 'This or That',
    focus: 'Pick the correct product from two similar-looking arrangements.',
  },
  {
    id: 'flower-recognise',
    label: 'Flower Recognise',
    focus: 'Identify the correct product from two photos side by side.',
  },
]

export const allQuestions = questionData as QuizQuestion[]

const trainingProducts = allQuestions
  .filter((question) => question.type === 'name_product' && question.image)
  .map((question) => ({
    id: question.id,
    name: question.answer,
    image: question.image!,
    explain: question.explain,
    cluster: question.cluster,
    category: question.category,
    options: question.options,
  }))

export const flowerRecogniseQuestions = allQuestions.filter(
  (question) => question.category === 'flower-recognise',
)

export type QuizMode = 'all' | 'flower-recognise'

export const quizModes: { id: QuizMode; label: string; description: string }[] = [
  { id: 'all', label: 'Full Quiz', description: 'All question types mixed together' },
  { id: 'flower-recognise', label: 'Flower Recognise', description: 'Pick the correct product from two photos' },
]

export function getQuestionsForMode(mode: QuizMode): QuizQuestion[] {
  if (mode === 'flower-recognise') return flowerRecogniseQuestions
  return allQuestions
}

const answerAliases: Record<string, string[]> = {
  'q14-laycie-ingredients': [
    'Ocean Song Rose, White Cut Orchid, White Matthiola',
    'Ocean Song Rose, White Phalaenopsis Orchid, White Matthiola',
  ],
}

export function isCorrectSelection(question: QuizQuestion, selection: string): boolean {
  const aliases = answerAliases[question.id]
  if (aliases) return aliases.includes(selection)
  return question.answer === selection
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function buildQuiz(count = 20): QuizQuestion[] {
  const shuffled = shuffle(allQuestions)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function buildTrainingDeck(): TrainingCard[] {
  return trainingProducts.flatMap((product, index) => {
    const distractors = [1, 2, 3].map((offset) => trainingProducts[(index + offset) % trainingProducts.length])

    return [
      {
        id: `${product.id}-image-to-name`,
        kind: 'image-to-name',
        prompt: 'Select the correct flower name.',
        answer: product.name,
        explain: product.explain,
        cluster: product.cluster,
        category: product.category,
        image: product.image,
        textOptions: product.options,
      },
      {
        id: `${product.id}-name-to-image`,
        kind: 'name-to-image',
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
    ]
  })
}
