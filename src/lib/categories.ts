import type { Category } from './types';

export interface CategoryPattern {
  id: string;
  name: string;
  icon: string;
  subcategories: SubcategoryPattern[];
}

export interface SubcategoryPattern {
  id: string;
  name: string;
  patterns: RegExp[];
  negativePatterns?: RegExp[];
  weight?: number;
}

/**
 * Complete category/subcategory hierarchy with regex patterns for classification.
 * Order matters: first match with highest weight wins.
 */
export const CATEGORY_DEFINITIONS: CategoryPattern[] = [
  {
    id: 'epics',
    name: 'Epics (Itihasas)',
    icon: '🏛️',
    subcategories: [
      {
        id: 'bhagavad-gita',
        name: 'Bhagavad Gita',
        patterns: [
          /\bbhagavad\s*gita\b/i,
          /\bbhagavadgita\b/i,
          /\bgeeta\s*(sar|chapter|adhyaya|shlok|verse|mahatmya)\b/i,
          /\bgita\s*(chapter|adhyaya|shlok|verse|mahatmya|press|updesh)\b/i,
        ],
        weight: 10,
      },
      {
        id: 'ramayana',
        name: 'Ramayana',
        patterns: [
          /\bramayana?\b/i,
          /\brama\s*katha\b/i,
          /\bsundara\s*kanda\b/i,
          /\bayodhya\s*kanda\b/i,
          /\bbala\s*kanda\b/i,
          /\bkishkindha\b/i,
          /\baranya\s*kanda\b/i,
          /\byuddha\s*kanda\b/i,
          /\buttara\s*kanda\b/i,
          /\bvalmiki\b/i,
          /\btulasidas\b/i,
          /\bramcharitmanas\b/i,
        ],
        negativePatterns: [/\bmahabharata?\b/i],
        weight: 10,
      },
      {
        id: 'mahabharata',
        name: 'Mahabharata',
        patterns: [
          /\bmahabharata?\b/i,
          /\bkurukshetra\b/i,
          /\bpandava\b/i,
          /\bkaurava\b/i,
          /\bdrona\b/i,
          /\bbhishma\b/i,
          /\bkarna\b/i,
          /\babhimanyu\b/i,
          /\bdraupadi\b/i,
          /\bsabha\s*parva\b/i,
          /\bvana\s*parva\b/i,
          /\bshanti\s*parva\b/i,
        ],
        weight: 10,
      },
    ],
  },
  {
    id: 'vedic-texts',
    name: 'Vedic Texts',
    icon: '🔱',
    subcategories: [
      {
        id: 'rig-veda',
        name: 'Rig Veda',
        patterns: [/\brig\s*veda\b/i, /\brigveda\b/i],
        weight: 8,
      },
      {
        id: 'yajur-veda',
        name: 'Yajur Veda',
        patterns: [/\byajur\s*veda\b/i, /\byajurveda\b/i],
        weight: 8,
      },
      {
        id: 'sama-veda',
        name: 'Sama Veda',
        patterns: [/\bsama\s*veda\b/i, /\bsamaveda\b/i],
        weight: 8,
      },
      {
        id: 'atharva-veda',
        name: 'Atharva Veda',
        patterns: [/\batharva\s*veda\b/i, /\batharvaveda\b/i],
        weight: 8,
      },
      {
        id: 'vedic-chanting',
        name: 'Vedic Chanting',
        patterns: [
          /\bvedic\s*chant/i,
          /\bsukta\b/i,
          /\bvedic\s*mantra/i,
          /\bveda\b/i,
          /\bvedic\b/i,
        ],
        weight: 5,
      },
    ],
  },
  {
    id: 'upanishads',
    name: 'Upanishads',
    icon: '🕉️',
    subcategories: [
      { id: 'isha-upanishad', name: 'Isha Upanishad', patterns: [/\bisha\s*upanishad/i], weight: 8 },
      { id: 'kena-upanishad', name: 'Kena Upanishad', patterns: [/\bkena\s*upanishad/i], weight: 8 },
      { id: 'katha-upanishad', name: 'Katha Upanishad', patterns: [/\bkatha\s*upanishad/i], weight: 8 },
      { id: 'mandukya-upanishad', name: 'Mandukya Upanishad', patterns: [/\bmandukya/i], weight: 8 },
      { id: 'chandogya-upanishad', name: 'Chandogya Upanishad', patterns: [/\bchandogya/i], weight: 8 },
      { id: 'brihadaranyaka', name: 'Brihadaranyaka Upanishad', patterns: [/\bbrihadaranyaka/i], weight: 8 },
      { id: 'mundaka-upanishad', name: 'Mundaka Upanishad', patterns: [/\bmundaka/i], weight: 8 },
      { id: 'taittiriya-upanishad', name: 'Taittiriya Upanishad', patterns: [/\btaittiriya/i], weight: 8 },
      {
        id: 'other-upanishads',
        name: 'Other Upanishads',
        patterns: [/\bupanishad/i, /\bupanishat/i],
        weight: 5,
      },
    ],
  },
  {
    id: 'puranas',
    name: 'Puranas',
    icon: '📜',
    subcategories: [
      {
        id: 'bhagavata-purana',
        name: 'Bhagavata Purana',
        patterns: [/\bbhagavat(am|a)?\b/i, /\bsrimad\s*bhagavat/i],
        negativePatterns: [/\bbhagavad\s*gita\b/i],
        weight: 8,
      },
      { id: 'vishnu-purana', name: 'Vishnu Purana', patterns: [/\bvishnu\s*purana/i], weight: 8 },
      { id: 'shiva-purana', name: 'Shiva Purana', patterns: [/\bshiva\s*purana/i], weight: 8 },
      { id: 'devi-bhagavata', name: 'Devi Bhagavata', patterns: [/\bdevi\s*bhagavat/i], weight: 8 },
      { id: 'garuda-purana', name: 'Garuda Purana', patterns: [/\bgaruda\s*purana/i], weight: 8 },
      { id: 'skanda-purana', name: 'Skanda Purana', patterns: [/\bskanda\s*purana/i], weight: 8 },
      {
        id: 'other-puranas',
        name: 'Other Puranas',
        patterns: [/\bpurana?\b/i],
        weight: 4,
      },
    ],
  },
  {
    id: 'devotional',
    name: 'Stotras & Hymns',
    icon: '🙏',
    subcategories: [
      {
        id: 'vishnu-stotras',
        name: 'Vishnu / Narayana Stotras',
        patterns: [/\bvishnu\s*sahasranama/i, /\bnarayana\b.*stotr/i, /\blakshmi\b.*stotr/i],
        weight: 7,
      },
      {
        id: 'shiva-stotras',
        name: 'Shiva Stotras',
        patterns: [/\bshiva\b.*\b(stotra|ashtakam|tandava)/i, /\brudram\b/i, /\bchamakam\b/i, /\blingashtakam/i],
        weight: 7,
      },
      {
        id: 'devi-stotras',
        name: 'Devi / Shakti Stotras',
        patterns: [/\bdevi\b.*stotr/i, /\bdurga\b.*stotr/i, /\blalitha/i, /\bkanakadhara/i, /\bsaraswati\b.*stotr/i],
        weight: 7,
      },
      {
        id: 'hanuman-stotras',
        name: 'Hanuman Stotras',
        patterns: [/\bhanuman/i, /\bchalisa\b/i],
        weight: 7,
      },
      {
        id: 'ganesha-stotras',
        name: 'Ganesha Stotras',
        patterns: [/\bganesha?\b/i, /\bvinayaka\b/i],
        weight: 7,
      },
      {
        id: 'other-stotras',
        name: 'Other Stotras & Hymns',
        patterns: [/\bstotra[ms]?\b/i, /\bashtakam\b/i, /\bkavacham\b/i, /\bsuprabhatam/i, /\baarti\b/i, /\bnamavali/i],
        weight: 4,
      },
    ],
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: '🌟',
    subcategories: [
      {
        id: 'advaita-vedanta',
        name: 'Advaita Vedanta',
        patterns: [/\badvaita\b/i, /\bshankaracharya\b/i, /\badi\s*shankara/i, /\bvivekachudamani/i, /\batma\s*bodha/i],
        weight: 7,
      },
      {
        id: 'vishishtadvaita',
        name: 'Vishishtadvaita',
        patterns: [/\bvishishtadvaita\b/i, /\bramanuja\b/i],
        weight: 7,
      },
      {
        id: 'dvaita',
        name: 'Dvaita',
        patterns: [/\bdvaita\b/i, /\bmadhvacharya\b/i, /\bmadhva\b/i],
        negativePatterns: [/\badvaita\b/i, /\bvishishtadvaita\b/i],
        weight: 7,
      },
      {
        id: 'general-philosophy',
        name: 'General Philosophy',
        patterns: [/\bvedanta\b/i, /\bphilosophy\b/i, /\bbrahman\b/i, /\bmoksha\b/i, /\bmaya\b/i, /\bbrahma\s*sutra/i],
        weight: 4,
      },
    ],
  },
  {
    id: 'yoga-meditation',
    name: 'Yoga & Meditation',
    icon: '🧘',
    subcategories: [
      {
        id: 'yoga',
        name: 'Yoga',
        patterns: [/\byoga\b/i, /\bpatanjali/i, /\byoga\s*sutra/i, /\basana\b/i],
        weight: 6,
      },
      {
        id: 'pranayama',
        name: 'Pranayama',
        patterns: [/\bpranayama\b/i],
        weight: 6,
      },
      {
        id: 'meditation',
        name: 'Meditation',
        patterns: [/\bmeditation\b/i, /\bdhyana\b/i],
        weight: 6,
      },
    ],
  },
  {
    id: 'festivals-rituals',
    name: 'Festivals & Rituals',
    icon: '🪔',
    subcategories: [
      {
        id: 'hindu-festivals',
        name: 'Hindu Festivals',
        patterns: [
          /\bdiwali\b/i, /\bdeepavali\b/i, /\bholi\b/i, /\bnavaratri\b/i,
          /\bshivaratri\b/i, /\bmakar\s*sankranti/i, /\bugadi\b/i,
          /\bsankranti\b/i, /\bganesh\s*chaturthi/i, /\bekadashi\b/i,
          /\bram\s*navami/i, /\bjanmashtami/i, /\bdussehra\b/i,
        ],
        weight: 6,
      },
      {
        id: 'rituals-pujas',
        name: 'Rituals & Pujas',
        patterns: [/\bpuja\b/i, /\bvratam?\b/i, /\bhoma\b/i, /\byagna\b/i, /\britual\b/i, /\bsandhyavandana/i],
        weight: 6,
      },
      {
        id: 'samskaras',
        name: 'Samskaras',
        patterns: [/\bsamskara\b/i, /\bupanayana\b/i, /\bvivaha\b/i, /\bshraddha\b/i],
        weight: 6,
      },
    ],
  },
  {
    id: 'devotional-music',
    name: 'Devotional Music',
    icon: '🎵',
    subcategories: [
      {
        id: 'bhajans-kirtans',
        name: 'Bhajans & Kirtans',
        patterns: [/\bbhajan\b/i, /\bkirtan\b/i, /\bsankirtan/i, /\bdevotional\s*song/i],
        weight: 5,
      },
      {
        id: 'classical-renditions',
        name: 'Classical Renditions',
        patterns: [/\bkruti\b/i, /\bkritis?\b/i, /\btyagaraja/i, /\bannamacharya/i, /\bpurandaradasa/i],
        weight: 5,
      },
    ],
  },
  {
    id: 'sanskrit',
    name: 'Sanskrit Literature',
    icon: '✍️',
    subcategories: [
      {
        id: 'sanskrit-learning',
        name: 'Sanskrit Learning',
        patterns: [/\bsanskrit\b/i, /\bshloka\b/i, /\bsubhashit/i],
        weight: 4,
      },
      {
        id: 'kavya',
        name: 'Kavya (Poetry)',
        patterns: [/\bkavya\b/i, /\bkalidasa\b/i, /\bmeghadut/i, /\braghuvansh/i],
        weight: 4,
      },
    ],
  },
  {
    id: 'discourses',
    name: 'Spiritual Discourses',
    icon: '💭',
    subcategories: [
      {
        id: 'pravachana',
        name: 'Pravachana (Discourses)',
        patterns: [/\bpravachan/i, /\bdiscourse\b/i, /\blecture\b/i],
        weight: 3,
      },
      {
        id: 'commentaries',
        name: 'Commentaries',
        patterns: [/\bcommentary\b/i, /\bvyakhya/i, /\bbhashya\b/i, /\bexplanation\b/i],
        weight: 3,
      },
    ],
  },
  {
    id: 'general',
    name: 'General Teachings',
    icon: '📚',
    subcategories: [
      {
        id: 'other',
        name: 'Other Videos',
        patterns: [], // catch-all
        weight: 0,
      },
    ],
  },
];

/**
 * Build a flat lookup of all category/subcategory metadata (without patterns).
 * Used by the website to render sidebar and navigation.
 */
export function getCategoryTree(): Category[] {
  return CATEGORY_DEFINITIONS.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    videoCount: 0,
    subcategories: cat.subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: `${cat.id}/${sub.id}`,
      videoCount: 0,
    })),
  }));
}
