/**
 * Domain-Appropriate Image Mapping Engine for Educational Resources & Apps
 * Ensures every application and activity displays a vibrant, high-fidelity visual
 * that precisely corresponds to its educational domain (letters, math, science, art, logic, etc.)
 */

export const DOMAIN_IMAGES = {
  arabicLetters: '/src/assets/images/arabic_reading_app_1791934033068.jpg',
  mathNumbers: '/src/assets/images/math_numbers_app_1791934033740.jpg',
  scienceSpace: '/src/assets/images/science_space_app_1791934034428.jpg',
  artDrawing: '/src/assets/images/art_drawing_app_1791934034477.jpg',
  codingLogic: '/src/assets/images/coding_logic_app_1791934035252.jpg',
  preschoolHero: '/src/assets/images/hero_preschool_stars_1791871144333.jpg',
  parentCorner: '/src/assets/images/parent_corner_guide_1791871144873.jpg',
  alphabetClassic: '/src/assets/images/category_arabic_alphabet_1791871145039.jpg',
} as const;

/**
 * Dedicated mappings by category ID
 */
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'cat-arabic-alphabet': DOMAIN_IMAGES.arabicLetters,
  'cat-english-alphabet': DOMAIN_IMAGES.preschoolHero,
  'cat-numbers-math': DOMAIN_IMAGES.mathNumbers,
  'cat-colors-shapes': DOMAIN_IMAGES.artDrawing,
  'cat-animals-nature': DOMAIN_IMAGES.scienceSpace,
  'cat-science-discovery': DOMAIN_IMAGES.scienceSpace,
  'cat-memory-focus': DOMAIN_IMAGES.codingLogic,
  'cat-drawing-coloring': DOMAIN_IMAGES.artDrawing,
  'cat-stories-audio': DOMAIN_IMAGES.arabicLetters,
  'cat-life-skills': DOMAIN_IMAGES.parentCorner,
  'cat-emotions-social': DOMAIN_IMAGES.parentCorner,
  'cat-songs-music': DOMAIN_IMAGES.preschoolHero,
  'cat-language-learning': DOMAIN_IMAGES.arabicLetters,
  'cat-problem-solving': DOMAIN_IMAGES.codingLogic,
  'cat-external-apps': DOMAIN_IMAGES.preschoolHero,
};

/**
 * Dedicated mappings by application or resource ID / slug
 */
export const SPECIFIC_APP_IMAGE_MAP: Record<string, string> = {
  // Rawdatuna / Queen Rania Foundation (replaces generic pencil with tailored preschool Arabic learning)
  'rawdatuna-kindergarten-hub': DOMAIN_IMAGES.arabicLetters,
  'rawdatuna-activities-bundle': DOMAIN_IMAGES.arabicLetters,
  'src-rawdatuna': DOMAIN_IMAGES.arabicLetters,

  // Ahlan Simsim (Arabic letters and emotions)
  'simsim-arabic-letters-garden': DOMAIN_IMAGES.arabicLetters,
  'simsim-emotion-mirror': DOMAIN_IMAGES.parentCorner,
  'src-ahlan-simsim': DOMAIN_IMAGES.arabicLetters,

  // Khan Academy Kids
  'khan-kids-core': DOMAIN_IMAGES.preschoolHero,
  'khan-kodi-math-safari': DOMAIN_IMAGES.mathNumbers,
  'khan-reyna-reading-adventures': DOMAIN_IMAGES.preschoolHero,
  'khan-ollo-logic-shapes': DOMAIN_IMAGES.codingLogic,

  // PBS Kids
  'pbs-daniel-tiger-feelings': DOMAIN_IMAGES.parentCorner,
  'pbs-peg-cat-math': DOMAIN_IMAGES.mathNumbers,
  'pbs-wild-kratts-creatures': DOMAIN_IMAGES.scienceSpace,

  // Starfall
  'starfall-learn-to-read': DOMAIN_IMAGES.preschoolHero,
  'starfall-kindergarten-math': DOMAIN_IMAGES.mathNumbers,

  // BBC CBeebies
  'cbeebies-playtime-island': DOMAIN_IMAGES.parentCorner,
  'cbeebies-numberblocks': DOMAIN_IMAGES.mathNumbers,
  'cbeebies-creative-studio': DOMAIN_IMAGES.artDrawing,

  // Global Digital Library / StoryWeaver
  'gdl-arabic-first-readers': DOMAIN_IMAGES.arabicLetters,
  'gdl-multilingual-vocabulary': DOMAIN_IMAGES.arabicLetters,

  // ScratchJr & Coding
  'scratchjr-coding-preschool': DOMAIN_IMAGES.codingLogic,

  // NASA Kids' Club
  'nasa-kids-space-place': DOMAIN_IMAGES.scienceSpace,
  'nasa-little-astronauts': DOMAIN_IMAGES.scienceSpace,
};

/**
 * Resolves the most tailored, high-fidelity image for any educational app or resource.
 * Prioritizes:
 * 1. Specific app image (if defined)
 * 2. Category-based domain image
 * 3. Declared thumbnail (if safe and valid local asset)
 * 4. Fallback preschool hero image
 */
export function getDomainAppropriateImage(
  app: {
    id?: string;
    slug?: string;
    category_id?: string;
    thumbnail_url?: string;
    title_ar?: string;
    title_en?: string;
  }
): string {
  // 1. Check specific ID or slug overrides
  if (app.id && SPECIFIC_APP_IMAGE_MAP[app.id]) {
    return SPECIFIC_APP_IMAGE_MAP[app.id];
  }
  if (app.slug && SPECIFIC_APP_IMAGE_MAP[app.slug]) {
    return SPECIFIC_APP_IMAGE_MAP[app.slug];
  }

  // 2. Check title keywords for domain context
  const textCorpus = `${app.title_ar || ''} ${app.title_en || ''}`.toLowerCase();
  if (textCorpus.includes('حساب') || textCorpus.includes('عد') || textCorpus.includes('أرقام') || textCorpus.includes('math') || textCorpus.includes('number')) {
    return DOMAIN_IMAGES.mathNumbers;
  }
  if (textCorpus.includes('فضاء') || textCorpus.includes('علوم') || textCorpus.includes('ناسا') || textCorpus.includes('space') || textCorpus.includes('science')) {
    return DOMAIN_IMAGES.scienceSpace;
  }
  if (textCorpus.includes('برمج') || textCorpus.includes('سكراتش') || textCorpus.includes('منطق') || textCorpus.includes('coding') || textCorpus.includes('logic')) {
    return DOMAIN_IMAGES.codingLogic;
  }
  if (textCorpus.includes('رسم') || textCorpus.includes('تلوين') || textCorpus.includes('ألوان') || textCorpus.includes('draw') || textCorpus.includes('color') || textCorpus.includes('art')) {
    return DOMAIN_IMAGES.artDrawing;
  }
  if (textCorpus.includes('عربي') || textCorpus.includes('حروف') || textCorpus.includes('هجاء') || textCorpus.includes('قراءة') || textCorpus.includes('arabic') || textCorpus.includes('read') || textCorpus.includes('قصص')) {
    return DOMAIN_IMAGES.arabicLetters;
  }

  // 3. Check category mapping
  if (app.category_id && CATEGORY_IMAGE_MAP[app.category_id]) {
    return CATEGORY_IMAGE_MAP[app.category_id];
  }

  // 4. Check existing thumbnail if it is a local asset
  if (app.thumbnail_url && app.thumbnail_url.startsWith('/src/assets/')) {
    return app.thumbnail_url;
  }

  // 5. Default high quality preschool hero
  return DOMAIN_IMAGES.preschoolHero;
}
