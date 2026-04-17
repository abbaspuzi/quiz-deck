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
    focus: 'Distinguishing between Medium, Large, and Luxe variants.',
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
    focus: 'Using specific physical markers to confirm product and Size from photos.',
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

// ─── Category 1: Basic Product Knowledge (Visual "Tells") ───

const visualTellQuestions: QuizQuestion[] = [
  {
    id: 'q1-purple-wrapper',
    cluster: 'technical-wraps',
    category: 'visual-tells',
    type: 'single_choice',
    prompt: 'You see a bouquet with a Purple wrapper on the line. Which product is it?',
    options: ['Laycie', 'Trixie', 'Mischa', 'Miriam'],
    answer: 'Trixie',
    explain: 'Trixie is the only Mother\'s Day product with a purple exterior.',
  },
  {
    id: 'q2-cream-ribbon',
    cluster: 'technical-wraps',
    category: 'visual-tells',
    type: 'single_choice',
    prompt:
      'A bouquet features a cream wrapper with 3 pink rubber ribbons attached directly to the paper. Which product is this?',
    options: ['Trixie', 'Mischa', 'Laycie', 'Miriam'],
    answer: 'Laycie',
    explain:
      'The 3-ribbon count on the cream wrap is a unique technical identifier for Laycie.',
  },
  {
    id: 'q3-yellow-russian',
    cluster: 'russian-wraps',
    category: 'visual-tells',
    type: 'single_choice',
    prompt: 'Which Russian-style bouquet uses a yellow wrapper and a white ribbon?',
    options: ['Marilyn', 'Miriam', 'Mischa', 'Laycie'],
    answer: 'Miriam',
    explain: 'Miriam = Yellow/White wrapper. Marilyn = Pink/Black wrapper.',
  },
]

// ─── Category 2: Size & Scale Check (Counting) ───

const sizeScaleQuestions: QuizQuestion[] = [
  {
    id: 'q4-marilyn-gerbera',
    cluster: 'russian-wraps',
    category: 'size-scale',
    type: 'counting',
    prompt: 'A Marilyn LARGE bouquet should have how many Pink Gerberas?',
    options: ['3 Gerberas', '5 Gerberas', '4 Gerberas', '6 Gerberas'],
    answer: '5 Gerberas',
    explain: 'Marilyn: Medium (M) = 3 stems; Large (L) = 5 stems.',
  },
  {
    id: 'q5-zooey-sunflower-count',
    cluster: 'sunflower-hearts',
    category: 'size-scale',
    type: 'counting',
    prompt:
      'If a Zooey bouquet contains only 3 Sunflowers, which size should be marked on the order tag?',
    options: ['Medium (M)', 'Large (L)'],
    answer: 'Medium (M)',
    explain: '3 sunflowers = Medium; 5 sunflowers = Large.',
  },
  {
    id: 'q6-beatrice-luxe',
    cluster: 'pink-hatboxes',
    category: 'size-scale',
    type: 'counting',
    prompt:
      'For a Beatrice LUXE order, what is the required hardware and hero lily count?',
    options: [
      'XL Hatbox and 5 Lilies',
      'Standard Hatbox and 3 Lilies',
      'XL Hatbox and 3 Lilies',
      'Standard Hatbox and 5 Lilies',
    ],
    answer: 'XL Hatbox and 5 Lilies',
    explain:
      'Standard = 3 Lilies in a Standard box; Luxe = 5 Lilies in an XL box.',
  },
  {
    id: 'q17-marilyn-size',
    cluster: 'russian-wraps',
    category: 'size-scale',
    type: 'counting',
    prompt:
      'What size is this Marilyn Pink Carnation Bouquet?',
    options: ['Medium', 'Large'],
    answer: 'Medium',
    explain: 'Marilyn: Medium = 3 Gerberas; Large = 5 Gerberas.',
    image: '/quiz-images/marilyn-pink-carnation-mothers-day-bouquet-medium.png',
  },
  {
    id: 'q18-zaylee-size',
    cluster: 'pink-hatboxes',
    category: 'size-scale',
    type: 'counting',
    prompt: 'What size is this Zaylee Pink Mum Box?',
    options: ['Medium', 'Large'],
    answer: 'Medium',
    explain: 'Zaylee: Medium = 2 Anthuriums; Large = 3 Anthuriums.',
    image: '/quiz-images/zaylee-pink-mum-mothers-day-flower-box-medium.png',
  },
  {
    id: 'q19-zooey-size',
    cluster: 'sunflower-hearts',
    category: 'size-scale',
    type: 'counting',
    prompt:
      'What size is this Zooey Yellow Sunflower Bouquet?',
    options: ['Medium', 'Large'],
    answer: 'Large',
    explain: 'Zooey: Medium = 3 Sunflowers; Large = 5 Sunflowers.',
    image: '/quiz-images/zooey-yellow-sunflower-mothers-day-bouquet.png',
  },
]

// ─── Category 3: Scenario-Based (Floor Verification) ───

const scenarioQuestions: QuizQuestion[] = [
  {
    id: 'q7-zendaya-vs-zooey',
    cluster: 'sunflower-hearts',
    category: 'scenario',
    type: 'scenario',
    prompt:
      'A runner brings a Peach Hatbox to the QC station. It contains Greenheart Sunflowers and Red Rose Spray. Which product is this?',
    options: ['Zooey Box', 'Zendaya Box'],
    answer: 'Zendaya Box',
    explain:
      'While both can use Greenheart centers, only Zendaya includes the Red Rose Spray.',
  },
  {
    id: 'q8-marilyn-matthiola',
    cluster: 'russian-wraps',
    category: 'scenario',
    type: 'true_false',
    prompt:
      'You are auditing a Marilyn Russian bouquet. You notice White Matthiola has been added as a filler. Is this correct?',
    options: ['Yes, it is correct', 'No, it should not be there'],
    answer: 'No, it should not be there',
    explain:
      'Marilyn is specifically characterized by the absence of White Matthiola. If Matthiola is present, it is likely a Miriam or an assembly error.',
  },
  {
    id: 'q9-zaylee-vs-ayame',
    cluster: 'pink-hatboxes',
    category: 'scenario',
    type: 'scenario',
    prompt:
      'A packer has two peach hatboxes. Box A has 3 Anthuriums and Lilac Spidermums. Box B has 1 Anthurium and Pink Gerberas. What is Box A?',
    options: ['Zaylee', 'Ayame', 'Zandra', 'Tessa'],
    answer: 'Zaylee',
    explain:
      'The Anthurium count (3 vs 1) is the decisive factor. 3 Anthuriums + Spidermums = Zaylee; 1 Anthurium + Gerberas = Ayame.',
  },
  {
    id: 'q9b-box-b',
    cluster: 'pink-hatboxes',
    category: 'scenario',
    type: 'scenario',
    prompt:
      'A packer has two peach hatboxes. Box A has 3 Anthuriums and Lilac Spidermums. Box B has 1 Anthurium and Pink Gerberas. What is Box B?',
    options: ['Ayame', 'Zaylee', 'Zandra', 'Tessa'],
    answer: 'Ayame',
    explain:
      'Box B with 1 Anthurium and Pink Gerberas = Ayame. Zaylee uses 2–3 Anthuriums and has 0 Gerberas.',
  },
  {
    id: 'q14-anthurium-count',
    cluster: 'pink-hatboxes',
    category: 'scenario',
    type: 'scenario',
    prompt:
      'Look at the photo. Is this an Ayame or a Zaylee?',
    options: ['Ayame', 'Zaylee'],
    answer: 'Zaylee',
    explain:
      'Ayame typically features only 1 Anthurium and uses Gerbera. 2–3 Anthuriums is the signature of Zaylee, which does not contain Gerberas.',
    image: '/quiz-images/image16.png',
  },
  {
    id: 'q15-sunflower-heart',
    cluster: 'sunflower-hearts',
    category: 'scenario',
    type: 'single_choice',
    prompt:
      'You are holding a Zooey BOUQUET. Which of these two sunflower centers should be in the arrangement?',
    options: ['Blackheart Sunflower (Left)', 'Greenheart Sunflower (Right)'],
    answer: 'Greenheart Sunflower (Right)',
    explain:
      'The Zooey Bouquet uses Greenheart sunflowers, whereas the Zooey Box uses Blackheart.',
    images: ['/quiz-images/zooey-bouquet-center.png', '/quiz-images/zooey-flower-box-center.png'],
  },
  {
    id: 'q16-laycie-missing',
    cluster: 'technical-wraps',
    category: 'scenario',
    type: 'single_choice',
    prompt:
      'Look at this Laycie. Something is missing. What is it?',
    options: [
      '2 Pink Rubber Ribbons',
      '3 Pink Rubber Ribbons',
      'A black ribbon',
      'Nothing, it is correct',
    ],
    answer: '2 Pink Rubber Ribbons',
    explain:
      'Laycie is the only product with 3 pink rubber ribbons attached directly to the cream wrapping paper. This one only has 1.',
    image: '/quiz-images/laycie-lilac-rose-mothers-day-bouquet-standard.png',
  },
]

// ─── Category 4: Multi-Ingredient Audit ───

const ingredientAuditQuestions: QuizQuestion[] = [
  {
    id: 'q10-laycie-ingredients',
    cluster: 'technical-wraps',
    category: 'ingredient-audit',
    type: 'single_choice',
    prompt: 'What are the key components of the Laycie Lilac Rose Bouquet?',
    options: [
      'Ocean Song Rose, White Phalaenopsis Orchid, White Matthiola, Blue Eryngium, Snow Willow',
      'Ocean Song Rose, Pink Anthurium, White Statice, Thlaspi, Eucalyptus',
      'Lilac Rose, White Lily, Pink Eustoma, Blue Eryngium, Snow Willow',
      'Ocean Song Rose, White Matthiola, Pink Phlox, Blue Eryngium, Eucalyptus',
    ],
    answer:
      'Ocean Song Rose, White Phalaenopsis Orchid, White Matthiola, Blue Eryngium, Snow Willow',
    explain:
      'This is the most premium lilac bouquet. Look for the "Luxe" touch of the Phalaenopsis orchid and the unique blue eryngium.',
  },
  {
    id: 'q11-zaylee-ingredients',
    cluster: 'pink-hatboxes',
    category: 'ingredient-audit',
    type: 'single_choice',
    prompt:
      'To correctly identify the Zaylee Flower Box, which ingredients must be present?',
    options: [
      'Lilac Spidermum, Light Peach Carnation, 2–3 Anthuriums, Eucalyptus',
      'Pink Gerbera, Lilac Spidermum, 1 Anthurium, Ruscus',
      'Lilac Spidermum, Hot Cherry Pink Rose, 2–3 Anthuriums, Eucalyptus',
      'Pink Gerbera, Hot Cherry Pink Rose, 1 Anthurium, Ruscus',
    ],
    answer: 'Lilac Spidermum, Light Peach Carnation, 2–3 Anthuriums, Eucalyptus',
    explain:
      'Remember Zaylee has 0 Gerberas. If you see a Gerbera, it is likely a Zandra or Ayame.',
  },
  {
    id: 'q12-zooey-bouquet-mix',
    cluster: 'sunflower-hearts',
    category: 'ingredient-audit',
    type: 'single_choice',
    prompt:
      'What specific mix defines the Zooey Sunflower Mother\'s Day Bouquet?',
    options: [
      'Greenheart Sunflower, Alstroemeria, Oxypetalum, Eucalyptus',
      'Blackheart Sunflower, Red Rose Spray, White Statice, Ruscus',
      'Greenheart Sunflower, Red Rose Spray, Oxypetalum, Thlaspi',
      'Blackheart Sunflower, Alstroemeria, White Matthiola, Eucalyptus',
    ],
    answer: 'Greenheart Sunflower, Alstroemeria, Oxypetalum, Eucalyptus',
    explain:
      'The Zooey Bouquet must use the Greenheart center and the specific pairing of Alstroemeria and Oxypetalum.',
  },
  {
    id: 'q13-miriam-ingredients',
    cluster: 'russian-wraps',
    category: 'ingredient-audit',
    type: 'single_choice',
    prompt:
      'Which of the following best describes the ingredient list for the Miriam Russian Bouquet?',
    options: [
      'Pink Carnation, White Matthiola, Pale Pink Roses, Eucalyptus',
      'Hot Cherry Pink Rose, Pink Carnation, White Statice, Thlaspi',
      'Pink Carnation, White Eustoma, 2–3 Anthuriums, Snow Willow',
      'Pink Rose, White Matthiola, Light Pink Carnation Spray, Thlaspi',
    ],
    answer: 'Pink Carnation, White Matthiola, Pale Pink Roses, Eucalyptus',
    explain:
      'Miriam is distinguished by its paler palette and the inclusion of Matthiola, unlike the Marilyn.',
  },
]

// ─── Category 7: Orchid Identification ───

const orchidQuestions: QuizQuestion[] = [
  {
    id: 'q33-orchid-plain',
    cluster: 'technical-wraps',
    category: 'orchid-id',
    type: 'single_choice',
    prompt:
      'Which product is this?',
    options: [
      'Mother\'s Day Pink Phalaenopsis Orchid (2 stalks)',
      'Indira Pink & White Phalaenopsis Orchid',
      'Luxe Orchid Arrangement',
      'Tessa Pink Lily Box',
    ],
    answer: 'Mother\'s Day Pink Phalaenopsis Orchid (2 stalks)',
    explain:
      'Standard orchids are identified by the plain white pot without extra decorative wrapping.',
    image: '/quiz-images/image10.png',
  },
  {
    id: 'q34-indira-id',
    cluster: 'technical-wraps',
    category: 'orchid-id',
    type: 'single_choice',
    prompt:
      'What is the product name of this orchid?',
    options: [
      'Indira Pink & White Phalaenopsis Orchid',
      'Mother\'s Day Pink Phalaenopsis Orchid (2 stalks)',
      'Mother\'s Day Pink Phalaenopsis Orchid (3 stalks)',
      'Luxe Orchid Arrangement',
    ],
    answer: 'Indira Pink & White Phalaenopsis Orchid',
    explain:
      'The Indira is the only orchid product that uses mixed colors (pink and white) and features the signature pink decorative base wrap.',
    image: '/quiz-images/indira-pink-white-mothers-day-phalaenopsis-orchid.png',
  },
  {
    id: 'q34b-indira-scenario',
    cluster: 'technical-wraps',
    category: 'orchid-id',
    type: 'true_false',
    prompt:
      'You are auditing an orchid pot. It has three stalks, but all of them are pink, and it is in a plain white pot with no decorative wrapping. Is this an Indira?',
    options: ['Yes, it is an Indira', 'No, it is not an Indira'],
    answer: 'No, it is not an Indira',
    explain:
      'An Indira must have a mix of pink and white stalks AND the pink decorative wrap around the pot. A 3-stalk pink-only arrangement in a plain pot would be a production error.',
  },
  {
    id: 'q35-indira-ingredients',
    cluster: 'technical-wraps',
    category: 'orchid-id',
    type: 'single_choice',
    prompt:
      'What specific ingredients make up the Indira Pink & White Orchid arrangement?',
    options: [
      '2 Stalks (1 Pink, 1 White), Ceramic Pot, Pink Decorative Fabric Wrap',
      '3 Stalks (All Pink), Glass Vase, White Ribbon',
      '1 Stalk (White), Ceramic Pot, No Decorative Wrapping',
      '4 Stalks (Mixed Pink & White), Glass Vase, Pink Decorative Cloth Wrap',
    ],
    answer: '2 Stalks (1 Pink, 1 White), Ceramic Pot, Pink Decorative Fabric Wrap',
    explain:
      'The Indira is the "Luxe" version of the orchids. Always look for the pink fabric around the pot and the mixed stalk colors.',
  },
]

// ─── Category 6: Visual Evidence & Identification ───

const visualIdQuestions: QuizQuestion[] = [
  {
    id: 'q20-izzy-size',
    cluster: 'pink-hatboxes',
    category: 'visual-id',
    type: 'counting',
    prompt: 'What size is this Izzy Pink Daisy Flower Box?',
    options: ['Medium', 'Large'],
    answer: 'Medium',
    explain: '4 Pink Gerbera, 4 Peach Gerbera, 2 Hot Cherry Pink Carnations = Medium.',
    image: '/quiz-images/izzy-pink-daisy-mothers-day-flower-box-medium.png',
  },
  {
    id: 'q21-name-zandra',
    cluster: 'pink-hatboxes',
    category: 'visual-id',
    type: 'name_product',
    prompt: 'Name this product.',
    options: [
      'Zandra Pink Gerbera Mother\'s Day Flower Box (MD)',
      'Zaylee Pink Mum Mother\'s Day Flower Box (MD)',
      'Ayame Pink Gerbera Mother\'s Day Flower Box (MD)',
      'Izzy Pink Daisy Mother\'s Day Flower Box (MD)',
    ],
    answer: 'Zandra Pink Gerbera Mother\'s Day Flower Box (MD)',
    explain: 'Zandra uses Pink Greenheart Gerbera, Hot Cherry Pink Rose, and Pink Rose Spray.',
    image: '/quiz-images/zandra-pink-gerbera-mothers-day-flower-box.png',
  },
  {
    id: 'q22-name-luxe-kate',
    cluster: 'pink-hatboxes',
    category: 'visual-id',
    type: 'name_product',
    prompt: 'Name this product.',
    options: [
      'Luxe Kate Red Rose Mother\'s Day Flower Box (MD)',
      'Zandra Pink Gerbera Mother\'s Day Flower Box (MD)',
      'Tessa Pink Lily Mother\'s Day Flower Box (MD)',
      'Beatrice Rose Lily Mother\'s Day Flower Box (MD)',
    ],
    answer: 'Luxe Kate Red Rose Mother\'s Day Flower Box (MD)',
    explain: 'Luxe Kate features an XL Hatbox with Red Roses formed in a mushroom shape.',
    image: '/quiz-images/luxe-kate-red-rose-mothers-day-flower-box.png',
  },
  {
    id: 'q23-name-mischa',
    cluster: 'technical-wraps',
    category: 'visual-id',
    type: 'name_product',
    prompt: 'Name this product.',
    options: [
      'Mischa Pink Carnation Mother\'s Day Bouquet (MD)',
      'Laycie Lilac Rose Mother\'s Day Bouquet (MD)',
      'Miriam Pink Carnation Mother\'s Day Russian Bouquet (MD)',
      'Trixie Pink Lily Mother\'s Day Bouquet (MD)',
    ],
    answer: 'Mischa Pink Carnation Mother\'s Day Bouquet (MD)',
    explain: 'Mischa uses Pink Carnation, White Eustoma, White Matthiola, and Thlaspi.',
    image: '/quiz-images/mischa-pink-carnation-mothers-day-bouquet-large.png',
  },
  {
    id: 'q24-name-lyndi',
    cluster: 'technical-wraps',
    category: 'visual-id',
    type: 'name_product',
    prompt: 'Name this product.',
    options: [
      'Lyndi Red Rose Mother\'s Day Heart Bouquet (MD)',
      'Marilyn Pink Carnation Mother\'s Day Bouquet (MD)',
      'Miriam Pink Carnation Mother\'s Day Russian Bouquet (MD)',
      'Laycie Lilac Rose Mother\'s Day Bouquet (MD)',
    ],
    answer: 'Lyndi Red Rose Mother\'s Day Heart Bouquet (MD)',
    explain: 'Lyndi features Heart Shaped Red Roses in a White Wrapper with Pink Rubber Ribbons.',
    image: '/quiz-images/lyndi-red-rose-mothers-day-heart-bouquet-large.png',
  },
  {
    id: 'q25-name-izzy',
    cluster: 'pink-hatboxes',
    category: 'visual-id',
    type: 'name_product',
    prompt: 'Name this product.',
    options: [
      'Izzy Pink Daisy Mother\'s Day Flower Box (MD)',
      'Zandra Pink Gerbera Mother\'s Day Flower Box (MD)',
      'Phoebe Pink Carnation Mother\'s Day Flower Box (MD)',
      'Ayame Pink Gerbera Mother\'s Day Flower Box (MD)',
    ],
    answer: 'Izzy Pink Daisy Mother\'s Day Flower Box (MD)',
    explain: 'Izzy features Pink Gerbera, Red Carnations, Yellow Rose Spray, Mini Fruit Leaf, and Scabiosa Pod.',
    image: '/quiz-images/izzy-pink-daisy-mothers-day-flower-box-large.png',
  },
  {
    id: 'q26-name-phoebe',
    cluster: 'pink-hatboxes',
    category: 'visual-id',
    type: 'name_product',
    prompt: 'Name this product.',
    options: [
      'Phoebe Pink Carnation Mother\'s Day Flower Box (MD)',
      'Zandra Pink Gerbera Mother\'s Day Flower Box (MD)',
      'Izzy Pink Daisy Mother\'s Day Flower Box (MD)',
      'Ayame Pink Gerbera Mother\'s Day Flower Box (MD)',
    ],
    answer: 'Phoebe Pink Carnation Mother\'s Day Flower Box (MD)',
    explain: 'Phoebe features Hot Cherry Pink Carnations, Pink Carnations, White Dendrobium Orchid, and Purple Capsia.',
    image: '/quiz-images/phoebe-pink-carnation-mothers-day-flower-box-large.png',
  },
]

const trainingProducts = visualIdQuestions
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

// ─── Category: This or That (Pick the right picture) ───

const thisOrThatQuestions: QuizQuestion[] = [
  {
    id: 'q27-miriam-vs-marilyn',
    cluster: 'russian-wraps',
    category: 'this-or-that',
    type: 'this_or_that',
    prompt: 'Which one is the Miriam Pink Carnation Russian Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Miriam (yellow wrapper, white ribbon). Right is Marilyn (pink wrapper, black ribbon).',
    images: ['/quiz-images/miriam-pink-carnation-mothers-day-russian-bouquet-standard.png', '/quiz-images/marilyn-carnation-mothers-day-russian-bouquet-standard.png'],
  },
  {
    id: 'q28-zendaya-vs-zooey',
    cluster: 'sunflower-hearts',
    category: 'this-or-that',
    type: 'this_or_that',
    prompt: 'Which one is the Zendaya Yellow Sunflower Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Zendaya (Greenheart Sunflowers with Red Rose Spray). Right is Zooey Box (Blackheart Sunflowers, no Red Rose Spray).',
    images: ['/quiz-images/zendaya-yellow-sunflower-mothers-day-flower-box.png', '/quiz-images/zooey-yellow-sunflower-mothers-day-flower-box.png'],
  },
  {
    id: 'q29-tessa-vs-beatrice',
    cluster: 'pink-hatboxes',
    category: 'this-or-that',
    type: 'this_or_that',
    prompt: 'Which one is the Tessa Pink Lily Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Tessa (Pink Lilies, Avalanche/White Roses). Left is Beatrice.',
    images: ['/quiz-images/beatrice-rose-lily-mothers-day-flower-box.png', '/quiz-images/tessa-pink-lily-mothers-day-flower-box-large.png'],
  },
  {
    id: 'q30-ayame-vs-zaylee',
    cluster: 'pink-hatboxes',
    category: 'this-or-that',
    type: 'this_or_that',
    prompt: 'Which one is the Ayame Pink Gerbera Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Ayame (1 Anthurium, Pink Gerberas). Right is Zaylee (2–3 Anthuriums, Lilac Spidermums, no Gerberas).',
    images: ['/quiz-images/ayame-pink-gerbera-mothers-day-flower-box-large.png', '/quiz-images/zaylee-pink-mum-mothers-day-flower-box-large.png'],
  },
  {
    id: 'q31-indira-vs-orchid',
    cluster: 'technical-wraps',
    category: 'this-or-that',
    type: 'this_or_that',
    prompt: 'Which one is the Indira Pink & White Phalaenopsis Orchid?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Indira (mixed pink & white stalks, pink decorative base wrap). Left is the standard Pink Phalaenopsis Orchid (2 stalks, plain pot).',
    images: ['/quiz-images/image10.png', '/quiz-images/indira-pink-white-mothers-day-phalaenopsis-orchid.png'],
  },
  {
    id: 'q32-trixie-vs-tessa',
    cluster: 'technical-wraps',
    category: 'this-or-that',
    type: 'this_or_that',
    prompt: 'Which one is the Trixie Pink Lily Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Trixie (purple wrapper). Left is Tessa Pink Lily Bouquet.',
    images: ['/quiz-images/tessa-pink-lily-mothers-day-bouquet-standard.png', '/quiz-images/trixie-pink-lily-mothers-day-bouquet.png'],
  },
]

// ─── Category 8: Flower Recognise (Left/Right Image ID) ───

const flowerRecogniseQuestions: QuizQuestion[] = [
  {
    id: 'fr01-mischa-vs-laycie',
    cluster: 'technical-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Mischa Pink Carnation Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Mischa (pink wrapper, Pink Carnation + White Eustoma + Matthiola). Right is Laycie (cream wrapper, 3 pink rubber ribbons, Ocean Song Rose).',
    images: ['/quiz-images/mischa-pink-carnation-mothers-day-bouquet-large.png', '/quiz-images/laycie-lilac-rose-mothers-day-bouquet-standard.png'],
  },
  {
    id: 'fr02-laycie-vs-mischa',
    cluster: 'technical-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Laycie Lilac Rose Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Laycie (cream wrapper with pink rubber ribbons, Ocean Song Rose + Phalaenopsis Orchid). Left is Mischa (pink wrapper, Pink Carnation + White Eustoma).',
    images: ['/quiz-images/mischa-pink-carnation-mothers-day-bouquet-large.png', '/quiz-images/laycie-lilac-rose-mothers-day-bouquet-standard.png'],
  },
  {
    id: 'fr03-phoebe-vs-zandra',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Phoebe Carnation Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Phoebe (Hot Cherry Pink Carnation, White Dendrobium Orchid, Purple Capsia). Right is Zandra (Pink Gerbera, Hot Cherry Pink Rose, Rose Spray).',
    images: ['/quiz-images/phoebe-pink-carnation-mothers-day-flower-box-large.png', '/quiz-images/zandra-pink-gerbera-mothers-day-flower-box.png'],
  },
  {
    id: 'fr04-izzy-vs-zandra',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Izzy Pink Daisy Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Izzy (Pink Gerbera, Peach Gerbera, Red Carnations, Yellow Rose Spray). Right is Zandra (Pink Gerbera, Hot Cherry Pink Rose, no yellow flowers).',
    images: ['/quiz-images/izzy-pink-daisy-mothers-day-flower-box-medium.png', '/quiz-images/zandra-pink-gerbera-mothers-day-flower-box.png'],
  },
  {
    id: 'fr05-lyndi-vs-luxekate',
    cluster: 'technical-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Lyndi Heart Rose Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Lyndi (heart-shaped Red Roses in white wrapper with pink ribbons). Right is Luxe Kate (XL Hatbox with Red Roses in mushroom shape).',
    images: ['/quiz-images/lyndi-red-rose-mothers-day-heart-bouquet-large.png', '/quiz-images/luxe-kate-red-rose-mothers-day-flower-box.png'],
  },
  {
    id: 'fr06-zooey-bouquet-vs-box',
    cluster: 'sunflower-hearts',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Zooey Sunflower Bouquet (not the Box)?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Zooey Bouquet (Greenheart Sunflowers in pink wrapper with Alstroemeria). Right is Zooey Box (Blackheart Sunflowers in peach hatbox).',
    images: ['/quiz-images/zooey-yellow-sunflower-mothers-day-bouquet.png', '/quiz-images/zooey-yellow-sunflower-mothers-day-flower-box.png'],
  },
  {
    id: 'fr07-beatrice-vs-luxekate',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Beatrice Lily & Rose Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Beatrice (Red Roses + White/Pink Roses + Lilies in peach hatbox). Right is Luxe Kate (XL Hatbox with ONLY Red Roses in mushroom dome shape).',
    images: ['/quiz-images/beatrice-rose-lily-mothers-day-flower-box.png', '/quiz-images/luxe-kate-red-rose-mothers-day-flower-box.png'],
  },
  {
    id: 'fr08-zaylee-vs-zandra',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Zaylee Pink Mum Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Zaylee (2-3 Anthuriums, Lilac Spidermums, NO Gerberas). Right is Zandra (Pink Gerbera, Hot Cherry Pink Rose, Rose Spray).',
    images: ['/quiz-images/zaylee-pink-mum-mothers-day-flower-box-medium.png', '/quiz-images/zandra-pink-gerbera-mothers-day-flower-box.png'],
  },
  {
    id: 'fr09-marilyn-vs-mischa',
    cluster: 'russian-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Marilyn Pink Carnation Russian Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Marilyn (pink/black Russian wrapper, Pink Gerbera, no Matthiola). Right is Mischa (pink wrapper, White Eustoma + Matthiola, not Russian-style).',
    images: ['/quiz-images/marilyn-carnation-mothers-day-russian-bouquet-standard.png', '/quiz-images/mischa-pink-carnation-mothers-day-bouquet-large.png'],
  },
  {
    id: 'fr10-tessa-vs-phoebe',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Tessa Pink Lily Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Tessa (Pink Lilies + Avalanche/White Roses in peach hatbox). Left is Phoebe (Hot Cherry Pink Carnations + White Dendrobium Orchid).',
    images: ['/quiz-images/phoebe-pink-carnation-mothers-day-flower-box-large.png', '/quiz-images/tessa-pink-lily-mothers-day-flower-box-large.png'],
  },
  {
    id: 'fr11-izzy-vs-phoebe',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Izzy Pink Daisy Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Izzy (colourful mix: Pink Gerbera, Red Carnation, Yellow Rose Spray, Scabiosa Pod). Left is Phoebe (pink-red tones: Hot Cherry Pink Carnation, White Dendrobium Orchid).',
    images: ['/quiz-images/phoebe-pink-carnation-mothers-day-flower-box-large.png', '/quiz-images/izzy-pink-daisy-mothers-day-flower-box-large.png'],
  },
  {
    id: 'fr12-luxekate-vs-beatrice',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Luxe Kate Red Rose Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Luxe Kate (XL Hatbox, ONLY Red Roses in a mushroom dome). Right is Beatrice (mixed Red Roses + White/Pink Roses + Lilies).',
    images: ['/quiz-images/luxe-kate-red-rose-mothers-day-flower-box.png', '/quiz-images/beatrice-rose-lily-mothers-day-flower-box.png'],
  },
  {
    id: 'fr13-zendra-vs-zooeybox',
    cluster: 'sunflower-hearts',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Zendaya Yellow Sunflower Box?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Zendaya (Greenheart Sunflowers WITH Red Rose Spray in peach box). Left is Zooey Box (Blackheart Sunflowers, NO Red Rose Spray).',
    images: ['/quiz-images/zooey-yellow-sunflower-mothers-day-flower-box.png', '/quiz-images/zendaya-yellow-sunflower-mothers-day-flower-box.png'],
  },
  {
    id: 'fr14-trixie-vs-mischa',
    cluster: 'technical-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Trixie Pink Lily Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Trixie (purple wrapper — the only MDAY product with purple). Left is Mischa (pink wrapper, Pink Carnation + White Eustoma).',
    images: ['/quiz-images/mischa-pink-carnation-mothers-day-bouquet-large.png', '/quiz-images/trixie-pink-lily-mothers-day-bouquet.png'],
  },
  {
    id: 'fr15-ayame-vs-zaylee',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Ayame Pink Gerbera Flower Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Ayame (1 Anthurium + Pink Gerberas). Right is Zaylee (2-3 Anthuriums + Lilac Spidermums, NO Gerberas).',
    images: ['/quiz-images/ayame-pink-gerbera-mothers-day-flower-box-large.png', '/quiz-images/zaylee-pink-mum-mothers-day-flower-box-large.png'],
  },
  {
    id: 'fr16-indira-vs-orchid',
    cluster: 'technical-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Indira Pink & White Phalaenopsis Orchid?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Indira (mixed pink + white stalks, pink decorative fabric wrap). Right is the standard Pink Phalaenopsis Orchid (all-pink stalks, plain white pot).',
    images: ['/quiz-images/indira-pink-white-mothers-day-phalaenopsis-orchid.png', '/quiz-images/image10.png'],
  },
  {
    id: 'fr17-miriam-vs-marilyn',
    cluster: 'russian-wraps',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Miriam Pink Carnation Russian Bouquet?',
    options: ['Left', 'Right'],
    answer: 'Right',
    explain: 'Right is Miriam (yellow wrapper, white ribbon, includes White Matthiola). Left is Marilyn (pink wrapper, black ribbon, NO Matthiola).',
    images: ['/quiz-images/marilyn-carnation-mothers-day-russian-bouquet-standard.png', '/quiz-images/miriam-pink-carnation-mothers-day-russian-bouquet-standard.png'],
  },
  {
    id: 'fr18-zandra-vs-ayame',
    cluster: 'pink-hatboxes',
    category: 'flower-recognise',
    type: 'this_or_that',
    prompt: 'Which one is the Zandra Pink Gerbera Box?',
    options: ['Left', 'Right'],
    answer: 'Left',
    explain: 'Left is Zandra (Pink Gerbera + Hot Cherry Pink Rose + Rose Spray). Right is Ayame (1 Anthurium + Pink Gerberas, no Hot Cherry Pink Rose).',
    images: ['/quiz-images/zandra-pink-gerbera-mothers-day-flower-box.png', '/quiz-images/ayame-pink-gerbera-mothers-day-flower-box-large.png'],
  },
]

// ─── All questions combined ───

export const allQuestions: QuizQuestion[] = [
  ...visualTellQuestions,
  ...sizeScaleQuestions,
  ...scenarioQuestions,
  ...ingredientAuditQuestions,
  ...orchidQuestions,
  ...visualIdQuestions,
  ...thisOrThatQuestions,
  ...flowerRecogniseQuestions,
]

export { flowerRecogniseQuestions }

export type QuizMode = 'all' | 'flower-recognise'

export const quizModes: { id: QuizMode; label: string; description: string }[] = [
  { id: 'all', label: 'Full Quiz', description: 'All question types mixed together' },
  { id: 'flower-recognise', label: 'Flower Recognise', description: 'Pick the correct product from two photos' },
]

export function getQuestionsForMode(mode: QuizMode): QuizQuestion[] {
  if (mode === 'flower-recognise') return flowerRecogniseQuestions
  return allQuestions
}

/** Shuffle an array using Fisher-Yates */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/** Get a randomized quiz of N questions, balanced across clusters */
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
