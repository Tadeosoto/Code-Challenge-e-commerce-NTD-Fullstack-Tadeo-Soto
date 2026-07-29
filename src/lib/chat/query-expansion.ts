/**
 * Maps casual English, slang, typos, and life scenarios to APPROVED catalog search terms.
 * Built from products in data/NTD Code Challenge E-Commerce.csv.
 */

export const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "i",
  "im",
  "i'm",
  "me",
  "my",
  "we",
  "you",
  "your",
  "want",
  "wanna",
  "need",
  "looking",
  "for",
  "to",
  "buy",
  "get",
  "have",
  "has",
  "any",
  "some",
  "please",
  "can",
  "could",
  "would",
  "do",
  "does",
  "dont",
  "don't",
  "know",
  "exact",
  "name",
  "about",
  "with",
  "and",
  "or",
  "of",
  "in",
  "on",
  "is",
  "are",
  "there",
  "this",
  "that",
  "what",
  "which",
  "how",
  "much",
  "many",
  "show",
  "find",
  "something",
  "anything",
  "got",
  "gimme",
  "lemme",
  "kinda",
  "sorta",
  "like",
  "just",
  "really",
  "equipment",
  "stuff",
  "things",
  "thing",
  "gear",
  "kit",
  "setup",
  "items",
  "product",
  "products",
]);

/** Common misspellings → canonical tokens used by SYNONYMS / search */
export const TYPO_MAP: Record<string, string> = {
  shose: "shoes",
  shoess: "shoes",
  sneekers: "sneakers",
  sneakerz: "sneakers",
  speeker: "speaker",
  spekers: "speakers",
  speekerz: "speakers",
  earbudz: "earbuds",
  headfone: "headphone",
  headphons: "headphones",
  mause: "mouse",
  mose: "mouse",
  keybord: "keyboard",
  keybaord: "keyboard",
  moniter: "monitor",
  loptop: "laptop",
  labtop: "laptop",
  computor: "computer",
  compuer: "computer",
  usbc: "usb",
  chargers: "charger",
  powerbank: "charger",
  desksetup: "desk",
  runing: "running",
  runnin: "running",
  campin: "camping",
  tentt: "tent",
  cheep: "cheap",
  expencive: "expensive",
  afordable: "affordable",
  youga: "yoga",
  yogamat: "yoga",
  dummbells: "dumbbells",
  dumbels: "dumbbells",
  protean: "protein",
  protin: "protein",
  coffe: "coffee",
  cofffee: "coffee",
  kichen: "kitchen",
  cuting: "cutting",
  hikking: "hiking",
  backack: "backpack",
  backpak: "backpack",
  bottel: "bottle",
  botle: "bottle",
  umbrela: "umbrella",
  umbrealla: "umbrella",
  skincare: "skincare",
  skincair: "skincare",
  beuty: "beauty",
  beuaty: "beauty",
  candel: "candle",
  puzzl: "puzzle",
  ches: "chess",
  skatebord: "skateboard",
  skatebaord: "skateboard",
  cyclng: "cycling",
  byke: "bike",
  bycicling: "cycling",
  hamock: "hammock",
  hammak: "hammock",
  projecter: "projector",
  projetor: "projector",
  airpods: "earbuds",
  airpod: "earbuds",
  sunnies: "sunglasses",
  wallet: "wallet",
  walet: "wallet",
  lether: "leather",
  blankit: "blanket",
  blankett: "blanket",
  organzer: "organizer",
  organisr: "organizer",
  vitimin: "vitamin",
  vitamine: "vitamin",
  leash: "leash",
  leesh: "leash",
  babys: "baby",
  shower: "shower",
  receipe: "recipe",
  recipie: "recipe",
  cookbok: "cookbook",
  notbook: "notebook",
  pencel: "pencil",
  toothburtsh: "toothbrush",
  toothebrush: "toothbrush",
};

/**
 * Single-word / slang → catalog search terms (product names, categories, related items).
 */
export const SYNONYMS: Record<string, string[]> = {
  // Footwear
  shoe: ["running shoes", "hiking boots", "footwear"],
  shoes: ["running shoes", "hiking boots", "footwear"],
  sneaker: ["running shoes", "footwear"],
  sneakers: ["running shoes", "footwear"],
  kicks: ["running shoes", "footwear"],
  trainers: ["running shoes", "footwear"],
  boots: ["hiking boots", "footwear"],
  boot: ["hiking boots", "footwear"],

  // Running / cardio
  running: ["running shoes", "fitness tracker", "jump rope", "water bottle", "sports"],
  jog: ["running shoes", "fitness tracker", "water bottle"],
  jogging: ["running shoes", "fitness tracker", "water bottle"],
  cardio: ["jump rope", "fitness tracker", "running shoes", "water bottle"],
  marathon: ["running shoes", "fitness tracker", "water bottle"],

  // Gym / strength
  gym: ["dumbbells", "resistance bands", "yoga mat", "jump rope", "protein powder", "water bottle", "resistance roller"],
  workout: ["dumbbells", "resistance bands", "fitness tracker", "yoga mat", "protein powder", "water bottle"],
  lifting: ["dumbbells", "resistance bands", "protein powder", "resistance roller"],
  weights: ["dumbbells", "sports"],
  dumbbell: ["dumbbells", "sports"],
  dumbbells: ["dumbbells", "sports"],
  bands: ["resistance bands", "sports"],
  resistance: ["resistance bands", "resistance roller", "sports"],
  roller: ["resistance roller", "sports"],
  foam: ["resistance roller", "yoga block", "yoga mat"],
  protein: ["protein powder", "food & beverage", "water bottle"],
  whey: ["protein powder", "food & beverage"],
  shake: ["protein powder", "water bottle", "travel mug"],

  // Yoga / stretch / recovery
  yoga: ["yoga mat", "yoga block", "resistance bands", "sports"],
  stretch: ["yoga mat", "yoga block", "resistance bands", "resistance roller"],
  pilates: ["yoga mat", "yoga block", "resistance bands"],
  meditation: ["yoga mat", "essential oils", "scented candle", "sleep mask"],

  // Audio / music
  speaker: ["bluetooth speaker", "shower speaker", "electronics"],
  speakers: ["bluetooth speaker", "shower speaker", "electronics"],
  music: ["bluetooth speaker", "wireless earbuds", "shower speaker"],
  audio: ["bluetooth speaker", "wireless earbuds", "electronics"],
  sound: ["bluetooth speaker", "wireless earbuds", "shower speaker"],
  earbud: ["wireless earbuds", "electronics"],
  earbuds: ["wireless earbuds", "electronics"],
  headphone: ["wireless earbuds", "electronics"],
  headphones: ["wireless earbuds", "electronics"],
  bluetooth: ["bluetooth speaker", "wireless earbuds", "wireless mouse"],
  shower: ["shower speaker", "electronics", "bamboo toothbrush"],
  waterproof: ["bluetooth speaker", "shower speaker", "fitness tracker"],

  // PC / office / desk
  desk: ["standing desk", "desk lamp", "desk mat", "desk organizer", "laptop stand", "home & office"],
  office: ["standing desk", "desk lamp", "wireless mouse", "laptop stand", "desk organizer", "notebook"],
  work: ["standing desk", "desk lamp", "laptop stand", "backpack", "notebook"],
  wfh: ["standing desk", "wireless mouse", "desk lamp", "laptop stand", "gaming keyboard"],
  pc: [
    "standing desk",
    "wireless mouse",
    "gaming keyboard",
    "usb-c",
    "usb hub",
    "laptop stand",
    "desk lamp",
    "desk mat",
    "mouse pad",
    "bluetooth speaker",
    "wireless earbuds",
    "portable charger",
    "led strip",
  ],
  computer: [
    "standing desk",
    "wireless mouse",
    "gaming keyboard",
    "usb-c",
    "usb hub",
    "laptop stand",
    "desk lamp",
    "mouse pad",
    "portable charger",
  ],
  laptop: ["laptop stand", "backpack", "usb-c", "portable charger", "wireless mouse", "phone stand"],
  mouse: ["wireless mouse", "mouse pad", "electronics"],
  keyboard: ["gaming keyboard", "electronics"],
  gaming: ["gaming keyboard", "wireless mouse", "led strip", "desk mat", "mouse pad", "mini projector"],
  usb: ["usb-c cable", "usb hub", "portable charger", "accessories"],
  cable: ["usb-c cable", "accessories"],
  hub: ["usb hub", "electronics"],
  charger: ["portable charger", "wireless charger", "usb-c cable", "electronics"],
  battery: ["portable charger", "electronics"],
  powerbank: ["portable charger", "electronics"],
  wireless: ["wireless mouse", "wireless earbuds", "wireless charger", "bluetooth speaker"],
  lamp: ["desk lamp", "home & office"],
  lighting: ["desk lamp", "led strip", "home & office"],
  led: ["led strip", "desk lamp", "home & office"],
  rgb: ["led strip", "gaming keyboard", "home & office"],
  mat: ["desk mat", "mouse pad", "yoga mat", "door mat"],
  organizer: ["desk organizer", "home & office", "pencil case"],
  stand: ["laptop stand", "phone stand", "standing desk"],

  // Phone / mobile
  phone: ["phone case", "phone stand", "wireless charger", "portable charger", "accessories"],
  iphone: ["phone case", "phone stand", "wireless charger", "portable charger"],
  mobile: ["phone case", "phone stand", "wireless charger", "portable charger"],
  case: ["phone case", "accessories"],
  qi: ["wireless charger", "electronics"],

  // Coffee / drinks / kitchen
  coffee: ["organic coffee", "travel mug", "electric kettle", "thermos", "kitchen"],
  caffeine: ["organic coffee", "travel mug"],
  beans: ["organic coffee", "food & beverage"],
  mug: ["travel mug", "food & beverage", "coasters"],
  thermos: ["thermos flask", "travel mug", "water bottle", "food & beverage"],
  flask: ["thermos flask", "food & beverage"],
  kettle: ["electric kettle", "kitchen"],
  tea: ["electric kettle", "travel mug", "thermos flask"],
  kitchen: ["cutting board", "electric kettle", "kitchen scale", "pepper grinder", "spice rack", "cookbook"],
  cooking: ["cutting board", "kitchen scale", "pepper grinder", "spice rack", "cookbook", "kitchen"],
  cook: ["cutting board", "cookbook", "kitchen scale", "spice rack", "electric kettle"],
  recipe: ["cookbook", "books", "spice rack", "kitchen scale"],
  cookbook: ["cookbook", "books", "kitchen"],
  cutting: ["cutting board", "kitchen"],
  board: ["cutting board", "board game", "chess set"],
  scale: ["kitchen scale", "kitchen"],
  pepper: ["pepper grinder", "spice rack", "kitchen"],
  spice: ["spice rack", "pepper grinder", "kitchen"],
  spices: ["spice rack", "pepper grinder", "kitchen"],
  mealprep: ["kitchen scale", "cutting board", "protein powder", "water bottle"],

  // Outdoors / camping / hiking
  tent: ["camping tent", "outdoors", "camping chair", "insect repellent"],
  camping: ["camping tent", "camping chair", "backpack", "water bottle", "insect repellent", "hammock", "thermos"],
  camp: ["camping tent", "camping chair", "outdoors", "insect repellent"],
  hike: ["hiking boots", "backpack", "water bottle", "insect repellent", "outdoors"],
  hiking: ["hiking boots", "backpack", "water bottle", "insect repellent", "outdoors"],
  trail: ["hiking boots", "backpack", "water bottle", "insect repellent"],
  outdoor: ["camping tent", "garden hose", "hammock", "insect repellent", "outdoors"],
  outdoors: ["camping tent", "hiking boots", "backpack", "outdoors"],
  hammock: ["hammock", "outdoors", "camping chair"],
  bug: ["insect repellent", "outdoors"],
  mosquito: ["insect repellent", "outdoors"],
  insect: ["insect repellent", "outdoors"],
  repellent: ["insect repellent", "outdoors"],
  chair: ["camping chair", "outdoors"],

  // Garden / plants / home exterior
  garden: ["garden hose", "plant pot", "herb garden", "outdoors"],
  hose: ["garden hose", "outdoors"],
  plant: ["plant pot", "herb garden", "home & office"],
  plants: ["plant pot", "herb garden", "home & office"],
  herb: ["herb garden", "outdoors", "spice rack"],
  herbs: ["herb garden", "outdoors", "spice rack"],
  doormat: ["door mat", "home & office"],
  welcome: ["door mat", "home & office"],

  // Travel / commute / rain
  travel: ["backpack", "travel mug", "portable charger", "umbrella", "sunglasses", "tote bag", "phone case"],
  trip: ["backpack", "portable charger", "travel mug", "umbrella", "reusable bags"],
  commute: ["backpack", "umbrella", "portable charger", "wireless earbuds", "travel mug"],
  backpack: ["backpack", "accessories", "tote bag"],
  bag: ["backpack", "tote bag", "reusable bags", "accessories"],
  tote: ["tote bag", "reusable bags", "accessories"],
  shopping: ["reusable bags", "tote bag", "leather wallet"],
  grocery: ["reusable bags", "tote bag", "accessories"],
  umbrella: ["umbrella", "accessories"],
  rain: ["umbrella", "accessories", "backpack"],
  sunglasses: ["sunglasses", "accessories"],
  sunnies: ["sunglasses", "accessories"],
  shades: ["sunglasses", "accessories"],
  wallet: ["leather wallet", "accessories"],
  leather: ["leather wallet", "accessories"],
  rfid: ["leather wallet", "accessories"],

  // Clothing
  shirt: ["cotton t-shirt", "clothing"],
  tshirt: ["cotton t-shirt", "clothing"],
  tee: ["cotton t-shirt", "clothing"],
  clothing: ["cotton t-shirt", "clothing"],
  clothes: ["cotton t-shirt", "clothing"],

  // Beauty / self-care / sleep
  beauty: ["face cream", "hand cream", "essential oils", "bamboo toothbrush", "nail clipper", "sleep mask"],
  skincare: ["face cream", "hand cream", "beauty"],
  skin: ["face cream", "hand cream", "beauty"],
  cream: ["face cream", "hand cream", "beauty"],
  moisturizer: ["face cream", "hand cream", "beauty"],
  lotion: ["hand cream", "face cream", "beauty"],
  spa: ["essential oils", "scented candle", "face cream", "sleep mask"],
  aromatherapy: ["essential oils", "scented candle", "beauty"],
  oils: ["essential oils", "beauty"],
  essential: ["essential oils", "beauty"],
  candle: ["scented candle", "home & office"],
  lavender: ["scented candle", "essential oils", "sleep mask"],
  sleep: ["sleep mask", "scented candle", "essential oils", "wool blanket"],
  bedtime: ["sleep mask", "scented candle", "essential oils"],
  toothbrush: ["bamboo toothbrush", "beauty"],
  dental: ["bamboo toothbrush", "beauty"],
  nails: ["nail clipper", "beauty"],
  nail: ["nail clipper", "beauty"],
  clipper: ["nail clipper", "beauty"],
  mask: ["sleep mask", "beauty"],

  // Home decor / cozy
  home: ["plant pot", "scented candle", "wall art", "picture frame", "wool blanket", "air purifier", "coasters"],
  decor: ["wall art", "picture frame", "plant pot", "scented candle", "vintage clock", "led strip"],
  decoration: ["wall art", "picture frame", "plant pot", "scented candle"],
  art: ["wall art", "paint set", "picture frame", "home & office"],
  frame: ["picture frame", "wall art", "home & office"],
  clock: ["vintage clock", "home & office"],
  blanket: ["wool blanket", "home & office"],
  cozy: ["wool blanket", "scented candle", "essential oils", "sleep mask"],
  throw: ["wool blanket", "home & office"],
  air: ["air purifier", "home & office"],
  purifier: ["air purifier", "home & office"],
  hepa: ["air purifier", "home & office"],
  coaster: ["coasters", "home & office"],
  coasters: ["coasters", "home & office"],

  // Games / family / gifts
  game: ["board game", "chess set", "puzzle", "games"],
  games: ["board game", "chess set", "puzzle", "games"],
  boardgame: ["board game", "games"],
  chess: ["chess set", "games"],
  puzzle: ["puzzle", "games"],
  puzzles: ["puzzle", "games"],
  family: ["board game", "chess set", "puzzle", "mystery box"],
  party: ["board game", "bluetooth speaker", "led strip", "mystery box"],
  gift: ["mystery box", "gift card", "scented candle", "wall art", "gifts"],
  gifts: ["mystery box", "gift card", "scented candle", "gifts"],
  present: ["mystery box", "gift card", "scented candle", "wall art"],
  surprise: ["mystery box", "gifts"],
  mystery: ["mystery box", "gifts"],

  // Stationery / study / art
  study: ["notebook", "mechanical pencil", "pencil case", "desk lamp", "desk organizer", "backpack"],
  school: ["notebook", "mechanical pencil", "pencil case", "backpack", "tote bag"],
  student: ["notebook", "mechanical pencil", "backpack", "desk lamp", "laptop stand"],
  notebook: ["notebook", "stationery", "mechanical pencil"],
  notepad: ["notebook", "stationery"],
  pencil: ["mechanical pencil", "pencil case", "stationery"],
  stationery: ["notebook", "mechanical pencil", "pencil case", "paint set"],
  paint: ["paint set", "stationery", "wall art"],
  painting: ["paint set", "stationery", "wall art"],
  drawing: ["paint set", "mechanical pencil", "notebook"],
  artkit: ["paint set", "stationery"],

  // Sports specialty
  skate: ["skateboard", "sports"],
  skateboard: ["skateboard", "sports"],
  skating: ["skateboard", "sports"],
  bike: ["bike light", "cycling gloves", "water bottle", "sports"],
  bicycle: ["bike light", "cycling gloves", "water bottle"],
  cycling: ["cycling gloves", "bike light", "water bottle", "sports"],
  gloves: ["cycling gloves", "sports"],
  soccer: ["soccer ball", "sports"],
  football: ["soccer ball", "sports"],
  ball: ["soccer ball", "sports"],

  // Hydration / bottle
  bottle: ["water bottle", "thermos flask", "travel mug", "sports"],
  water: ["water bottle", "sports"],
  hydrate: ["water bottle", "thermos flask", "sports"],
  hydration: ["water bottle", "thermos flask", "sports"],

  // Health / baby / pets
  health: ["vitamin d3", "fitness tracker", "water bottle", "air purifier"],
  vitamin: ["vitamin d3", "health"],
  vitamins: ["vitamin d3", "health"],
  tracker: ["fitness tracker", "electronics"],
  fitness: ["fitness tracker", "yoga mat", "resistance bands", "running shoes"],
  steps: ["fitness tracker", "running shoes"],
  heartrate: ["fitness tracker", "electronics"],
  baby: ["baby monitor", "electronics", "sleep mask"],
  infant: ["baby monitor", "electronics"],
  monitor: ["baby monitor", "electronics"],
  nursery: ["baby monitor", "scented candle", "electronics"],
  dog: ["dog leash", "pets", "water bottle"],
  pet: ["dog leash", "pets"],
  pets: ["dog leash", "pets"],
  leash: ["dog leash", "pets"],
  puppy: ["dog leash", "pets"],
  walk: ["dog leash", "running shoes", "water bottle", "pets"],

  // Movie / entertainment night
  movie: ["mini projector", "bluetooth speaker", "wool blanket", "scented candle"],
  projector: ["mini projector", "electronics", "bluetooth speaker"],
  cinema: ["mini projector", "bluetooth speaker", "electronics"],
  streaming: ["mini projector", "wireless earbuds", "bluetooth speaker"],

  // Tools
  tool: ["tape measure", "tools"],
  tools: ["tape measure", "tools"],
  measure: ["tape measure", "tools"],
  tape: ["tape measure", "tools"],
  diy: ["tape measure", "tools", "paint set"],

  // Generic category aliases
  electronics: ["electronics", "wireless mouse", "bluetooth speaker", "fitness tracker"],
  accessories: ["accessories", "usb-c cable", "backpack", "sunglasses"],
  footwear: ["footwear", "running shoes", "hiking boots"],
  sports: ["sports", "yoga mat", "dumbbells", "jump rope"],
  books: ["books", "cookbook"],
  kitchenware: ["kitchen", "cutting board", "spice rack"],
};

/**
 * Multi-word life scenarios → related product search bundles.
 */
export const PHRASE_INTENTS: Array<{ pattern: RegExp; terms: string[]; label: string }> = [
  {
    label: "pc-desk-office",
    pattern:
      /\b(for\s+(my\s+)?(pc|computer|desk|office|workstation)|pc\s+setup|desk\s+setup|home\s+office|work\s+from\s+home|\bwfh\b|gaming\s+setup|desk\s+gear|office\s+setup)\b/i,
    terms: [
      "standing desk",
      "wireless mouse",
      "gaming keyboard",
      "usb-c",
      "usb hub",
      "laptop stand",
      "desk lamp",
      "desk mat",
      "mouse pad",
      "desk organizer",
      "bluetooth speaker",
      "wireless earbuds",
      "portable charger",
      "wireless charger",
      "phone stand",
      "led strip",
      "backpack",
    ],
  },
  {
    label: "running-cardio",
    pattern:
      /\b(for\s+(my\s+)?(run|running|jog|jogging)|go\s+running|start\s+running|cardio\s+(day|workout)?|5k|10k|marathon)\b/i,
    terms: ["running shoes", "fitness tracker", "water bottle", "jump rope", "sunglasses", "sports"],
  },
  {
    label: "gym-strength",
    pattern:
      /\b(for\s+(the\s+)?gym|gym\s+bag|strength\s+training|lift\s+weights|home\s+gym|build\s+muscle|get\s+jacked)\b/i,
    terms: [
      "dumbbells",
      "resistance bands",
      "resistance roller",
      "yoga mat",
      "protein powder",
      "water bottle",
      "fitness tracker",
      "jump rope",
    ],
  },
  {
    label: "yoga-stretch",
    pattern: /\b(for\s+yoga|yoga\s+(class|practice|mat)|stretch(ing)?|pilates|flexibility)\b/i,
    terms: ["yoga mat", "yoga block", "resistance bands", "resistance roller", "essential oils"],
  },
  {
    label: "camping-outdoors",
    pattern:
      /\b(for\s+(camping|the\s+outdoors|a\s+camp(ing)?\s+trip)|go\s+camping|camp(ing)?\s+(trip|gear|weekend)|outdoor\s+(trip|gear))\b/i,
    terms: [
      "camping tent",
      "camping chair",
      "hammock",
      "backpack",
      "water bottle",
      "thermos",
      "insect repellent",
      "hiking boots",
    ],
  },
  {
    label: "hiking-trail",
    pattern: /\b(for\s+(hiking|a\s+hike|the\s+trail)|go\s+hiking|trail\s+(day|hike)|day\s+hike)\b/i,
    terms: ["hiking boots", "backpack", "water bottle", "insect repellent", "thermos", "sunglasses"],
  },
  {
    label: "kitchen-cooking",
    pattern:
      /\b(for\s+(my\s+)?(kitchen|cooking)|cook\s+(more|at\s+home)|meal\s+prep|chef\s+kit|kitchen\s+(gear|essentials))\b/i,
    terms: [
      "cutting board",
      "electric kettle",
      "kitchen scale",
      "pepper grinder",
      "spice rack",
      "cookbook",
      "coasters",
    ],
  },
  {
    label: "coffee-morning",
    pattern:
      /\b(morning\s+(coffee|routine)|coffee\s+(lover|addict|setup|station)|need\s+coffee|caffeine\s+fix)\b/i,
    terms: ["organic coffee", "travel mug", "electric kettle", "thermos", "coasters"],
  },
  {
    label: "music-audio",
    pattern:
      /\b(listen\s+to\s+music|for\s+music|play\s+music|audio\s+setup|need\s+(speakers?|earbuds)|jams?\s+on)\b/i,
    terms: ["bluetooth speaker", "wireless earbuds", "shower speaker"],
  },
  {
    label: "shower-bathroom",
    pattern: /\b(for\s+(the\s+)?shower|shower\s+music|bathroom\s+(gear|essentials)|in\s+the\s+shower)\b/i,
    terms: ["shower speaker", "bamboo toothbrush", "nail clipper", "hand cream"],
  },
  {
    label: "travel-trip",
    pattern:
      /\b(for\s+(travel|a\s+trip|vacation|holiday)|packing\s+list|going\s+(away|abroad)|weekend\s+(getaway|trip))\b/i,
    terms: [
      "backpack",
      "tote bag",
      "travel mug",
      "portable charger",
      "umbrella",
      "sunglasses",
      "phone case",
      "reusable bags",
      "wireless earbuds",
      "sleep mask",
    ],
  },
  {
    label: "commute",
    pattern: /\b(for\s+(my\s+)?commute|daily\s+commute|to\s+work\s+bag|train\s+ride|bus\s+ride)\b/i,
    terms: ["backpack", "umbrella", "portable charger", "wireless earbuds", "travel mug", "tote bag"],
  },
  {
    label: "beauty-skincare",
    pattern:
      /\b(for\s+(my\s+)?(skin|skincare|face)|self[- ]?care|beauty\s+(routine|kit)|glow\s+up)\b/i,
    terms: ["face cream", "hand cream", "essential oils", "bamboo toothbrush", "nail clipper", "sleep mask"],
  },
  {
    label: "sleep-relax",
    pattern: /\b(for\s+sleep|better\s+sleep|wind\s+down|relax(ation)?|can't\s+sleep|bedtime\s+routine)\b/i,
    terms: ["sleep mask", "scented candle", "essential oils", "wool blanket", "air purifier"],
  },
  {
    label: "home-decor",
    pattern:
      /\b(decorate\s+(my\s+)?(home|room|apartment)|home\s+decor|make\s+(it|my\s+place)\s+(cozy|nice)|freshen\s+up\s+(the\s+)?(room|place))\b/i,
    terms: [
      "wall art",
      "picture frame",
      "plant pot",
      "scented candle",
      "wool blanket",
      "led strip",
      "vintage clock",
      "door mat",
      "coasters",
      "air purifier",
    ],
  },
  {
    label: "movie-night",
    pattern: /\b(movie\s+night|watch\s+(a\s+)?movie|home\s+theater|cinema\s+night|projector\s+night)\b/i,
    terms: ["mini projector", "bluetooth speaker", "wool blanket", "scented candle", "led strip"],
  },
  {
    label: "game-night",
    pattern: /\b(game\s+night|family\s+night|board\s+games?|play\s+(games|chess)|puzzle\s+night)\b/i,
    terms: ["board game", "chess set", "puzzle", "mystery box", "scented candle"],
  },
  {
    label: "gift-present",
    pattern:
      /\b(gift\s+for|looking\s+for\s+(a\s+)?gift|birthday\s+gift|present\s+for|something\s+thoughtful|stocking\s+stuffer)\b/i,
    terms: ["mystery box", "gift card", "scented candle", "wall art", "essential oils", "chess set", "face cream"],
  },
  {
    label: "study-school",
    pattern:
      /\b(for\s+(school|studying|class|homework)|study\s+(desk|kit|setup)|back\s+to\s+school|student\s+(kit|essentials))\b/i,
    terms: [
      "notebook",
      "mechanical pencil",
      "pencil case",
      "desk lamp",
      "desk organizer",
      "backpack",
      "laptop stand",
      "water bottle",
    ],
  },
  {
    label: "art-craft",
    pattern: /\b(for\s+(painting|drawing|art)|art\s+(kit|supplies)|craft\s+night|want\s+to\s+paint)\b/i,
    terms: ["paint set", "notebook", "mechanical pencil", "pencil case", "wall art"],
  },
  {
    label: "cycling",
    pattern: /\b(for\s+(cycling|biking|my\s+bike)|bike\s+(ride|commute)|go\s+(cycling|biking))\b/i,
    terms: ["cycling gloves", "bike light", "water bottle", "backpack", "portable charger"],
  },
  {
    label: "skate",
    pattern: /\b(for\s+(skating|skateboarding)|want\s+(a\s+)?skateboard|go\s+skating)\b/i,
    terms: ["skateboard", "sunglasses", "water bottle", "backpack"],
  },
  {
    label: "soccer",
    pattern: /\b(for\s+(soccer|football)|play\s+(soccer|football)|soccer\s+(ball|gear))\b/i,
    terms: ["soccer ball", "water bottle", "sports"],
  },
  {
    label: "garden-plants",
    pattern:
      /\b(for\s+(my\s+)?(garden|plants?|balcony)|start\s+(a\s+)?garden|grow\s+(herbs?|plants?)|green\s+thumb)\b/i,
    terms: ["garden hose", "plant pot", "herb garden", "insect repellent", "outdoors"],
  },
  {
    label: "pet-dog",
    pattern: /\b(for\s+(my\s+)?(dog|puppy|pet)|dog\s+walk|walk\s+(the\s+)?dog|pet\s+gear)\b/i,
    terms: ["dog leash", "water bottle", "tote bag", "reusable bags"],
  },
  {
    label: "baby-nursery",
    pattern: /\b(for\s+(the\s+)?(baby|nursery|newborn)|baby\s+(monitor|room)|new\s+parent)\b/i,
    terms: ["baby monitor", "sleep mask", "scented candle", "air purifier"],
  },
  {
    label: "health-wellness",
    pattern:
      /\b(for\s+(my\s+)?health|get\s+health(y|ier)|vitamins?|immune\s+support|wellness\s+kit)\b/i,
    terms: ["vitamin d3", "fitness tracker", "water bottle", "air purifier", "yoga mat"],
  },
  {
    label: "phone-mobile",
    pattern:
      /\b(for\s+(my\s+)?(phone|iphone|android)|phone\s+(gear|accessories|setup)|protect\s+(my\s+)?phone)\b/i,
    terms: ["phone case", "phone stand", "wireless charger", "portable charger", "usb-c"],
  },
  {
    label: "rain-weather",
    pattern: /\b(for\s+(the\s+)?rain|rainy\s+day|it's\s+raining|stay\s+dry)\b/i,
    terms: ["umbrella", "backpack", "tote bag"],
  },
  {
    label: "party-host",
    pattern: /\b(host(ing)?\s+(a\s+)?party|house\s+party|friends\s+over|entertaining\s+guests)\b/i,
    terms: ["bluetooth speaker", "board game", "led strip", "coasters", "scented candle", "mystery box"],
  },
  {
    label: "diy-tools",
    pattern: /\b(for\s+(diy|a\s+project)|need\s+(a\s+)?tape\s+measure|home\s+project|fix[- ]?it[- ]?up)\b/i,
    terms: ["tape measure", "tools", "paint set"],
  },
  {
    label: "jump-rope-cardio",
    pattern: /\b(jump\s+rope|skipping\s+rope|rope\s+workout)\b/i,
    terms: ["jump rope", "fitness tracker", "water bottle", "sports"],
  },
];

export function correctToken(token: string) {
  return TYPO_MAP[token] ?? token;
}

export function extractKeywords(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s$-]/g, " ")
    .split(/\s+/)
    .map((token) => correctToken(token.trim()))
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function buildSearchTerms(query: string) {
  const terms = new Set<string>();
  const matchedLabels: string[] = [];
  const keywords = extractKeywords(query);

  for (const intent of PHRASE_INTENTS) {
    if (intent.pattern.test(query)) {
      matchedLabels.push(intent.label);
      for (const term of intent.terms) terms.add(term);
    }
  }

  for (const keyword of keywords) {
    terms.add(keyword);
    const expansions = SYNONYMS[keyword];
    if (expansions) {
      for (const expansion of expansions) terms.add(expansion);
    }
  }

  return { terms: [...terms], matchedLabels, keywords };
}

export function isBrowseIntent(query: string) {
  if (!query) return true;
  return (
    /^(hi|hello|hey|yo|sup)\b/i.test(query) ||
    /\b(what.*(available|have|sell)|show me|recommend|browse|catalog|options|help)\b/i.test(
      query,
    ) ||
    /\b(dont|don't)\s+know\b/i.test(query)
  );
}
