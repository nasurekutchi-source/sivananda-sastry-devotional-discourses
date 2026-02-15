/**
 * Visual theme definitions for each category.
 * Provides unique gradients, colors, descriptions, and decorative motifs
 * to create a visually rich, immersive experience per topic.
 */

export interface CategoryTheme {
  gradient: string;
  textColor: string;
  accentColor: string;
  motif: 'om' | 'lotus' | 'wheel' | 'flame' | 'mandala';
  description: string;
  journeyStarted: string; // YYYY-MM-DD
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  srimadbhagavatam: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #3730a3 60%, #4338ca 100%)',
    textColor: '#e0e7ff',
    accentColor: '#818cf8',
    motif: 'om',
    description:
      'Sacred stories of Lord Vishnu\u2019s divine play \u2014 12 Skandhas of cosmic wisdom',
    journeyStarted: '2015-01-11',
  },
  ramayanam: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 30%, #15803d 60%, #059669 100%)',
    textColor: '#ecfdf5',
    accentColor: '#6ee7b7',
    motif: 'lotus',
    description:
      'The epic journey of Lord Rama \u2014 7 Kandas from Bala to Uttara',
    journeyStarted: '2015-11-12',
  },
  mahabharatam: {
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #dc2626 100%)',
    textColor: '#fee2e2',
    accentColor: '#fca5a5',
    motif: 'wheel',
    description:
      'The great epic of Dharma \u2014 18 Parvas of the Kuru dynasty',
    journeyStarted: '2014-11-02',
  },
  bhagavadgeetha: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 30%, #b45309 60%, #d97706 100%)',
    textColor: '#fefce8',
    accentColor: '#fbbf24',
    motif: 'flame',
    description:
      'The Song of God \u2014 Lord Krishna\u2019s timeless counsel to Arjuna',
    journeyStarted: '2014-11-01',
  },
  'spiritual-discourses': {
    gradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 30%, #7e22ce 60%, #9333ea 100%)',
    textColor: '#f3e8ff',
    accentColor: '#c084fc',
    motif: 'mandala',
    description:
      'Devotional teachings on Puranas, festivals, stotrams and sacred traditions',
    journeyStarted: '2014-10-31',
  },
};

const DEFAULT_THEME: CategoryTheme = {
  gradient: 'linear-gradient(135deg, #44403c 0%, #57534e 30%, #78716c 60%, #a8a29e 100%)',
  textColor: '#f5f5f4',
  accentColor: '#d6d3d1',
  motif: 'om',
  description: 'Spiritual teachings and sacred wisdom',
  journeyStarted: '2014-10-31',
};

export function getCategoryTheme(categoryId: string): CategoryTheme {
  return CATEGORY_THEMES[categoryId] || DEFAULT_THEME;
}

export { DEFAULT_THEME, CATEGORY_THEMES };
