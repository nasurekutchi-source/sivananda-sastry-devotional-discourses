/**
 * Category definitions for the 5 main video categories.
 * Categorization is done by the Python pipeline (scripts/categorize-from-saved.py).
 * This file provides metadata for the website UI (sidebar, navigation, etc.).
 */

export const CATEGORY_ORDER = [
  'srimadbhagavatam',
  'ramayanam',
  'mahabharatam',
  'bhagavadgeetha',
  'spiritual-discourses',
] as const;

export const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  srimadbhagavatam: { name: 'Srimadbhagavatam', icon: '📖' },
  ramayanam: { name: 'Ramayanam', icon: '🏹' },
  mahabharatam: { name: 'Mahabharatam', icon: '⚔️' },
  bhagavadgeetha: { name: 'Bhagavadgeetha', icon: '🕉️' },
  'spiritual-discourses': { name: 'Spiritual Discourses', icon: '🙏' },
};
