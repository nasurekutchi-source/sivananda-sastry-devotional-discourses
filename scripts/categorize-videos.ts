/**
 * Video Categorizer
 * Classifies videos into categories/subcategories using weighted regex matching.
 * Detects language (English/Telugu) using Unicode analysis.
 */

import type { Language, CompactVideo } from '../src/lib/types';
import { CATEGORY_DEFINITIONS, type SubcategoryPattern } from '../src/lib/categories';
import type { RawVideo } from './fetch-videos';

/**
 * Detect language based on Telugu Unicode character ratio.
 * Telugu Unicode range: U+0C00 to U+0C7F
 */
export function detectLanguage(title: string, description: string): Language {
  const text = (title + ' ' + description).replace(/\s/g, '');
  if (text.length === 0) return 'english';

  const teluguChars = (text.match(/[\u0C00-\u0C7F]/g) || []).length;
  const ratio = teluguChars / text.length;

  if (ratio > 0.3) return 'telugu';
  if (ratio > 0.05) return 'mixed';

  // Also check for explicit language keywords in title
  const titleLower = title.toLowerCase();
  if (/\btelugu\b/.test(titleLower)) return 'telugu';
  if (/\benglis[h]?\b/.test(titleLower) || /\bhindi\b/.test(titleLower)) return 'english';

  return 'english';
}

interface MatchResult {
  categoryId: string;
  subcategoryId: string;
  score: number;
}

/**
 * Classify a video into the best matching subcategory.
 * Returns the primary match (highest score) and optional secondary match.
 */
export function classifyVideo(video: RawVideo): { primary: string; secondary?: string } {
  const text = `${video.title} ${video.description}`.toLowerCase();
  const matches: MatchResult[] = [];

  for (const category of CATEGORY_DEFINITIONS) {
    for (const sub of category.subcategories) {
      if (sub.patterns.length === 0) continue; // skip catch-all

      // Check negative patterns first
      if (sub.negativePatterns?.some((np) => np.test(text))) continue;

      let matchCount = 0;
      for (const pattern of sub.patterns) {
        if (pattern.test(text)) matchCount++;
      }

      if (matchCount > 0) {
        matches.push({
          categoryId: category.id,
          subcategoryId: sub.id,
          score: matchCount * (sub.weight || 5),
        });
      }
    }
  }

  if (matches.length === 0) {
    return { primary: 'other' }; // General Teachings > Other
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  const primary = matches[0].subcategoryId;
  const secondary =
    matches.length > 1 && matches[1].categoryId !== matches[0].categoryId
      ? matches[1].subcategoryId
      : undefined;

  return { primary, secondary };
}

/**
 * Process all raw videos into categorized compact format.
 */
export function categorizeAllVideos(
  rawVideos: RawVideo[]
): Map<string, CompactVideo[]> {
  const buckets = new Map<string, CompactVideo[]>();
  const stats = { total: 0, english: 0, telugu: 0, mixed: 0 };

  console.log(`\nCategorizing ${rawVideos.length} videos...`);

  for (const raw of rawVideos) {
    const language = detectLanguage(raw.title, raw.description);
    const { primary, secondary } = classifyVideo(raw);

    const compact: CompactVideo = {
      id: raw.videoId,
      t: raw.title,
      d: raw.description.slice(0, 200),
      p: raw.publishedAt.slice(0, 10), // YYYY-MM-DD
      th: `https://i.ytimg.com/vi/${raw.videoId}/mqdefault.jpg`,
      l: language,
    };

    // Add to primary bucket
    if (!buckets.has(primary)) buckets.set(primary, []);
    buckets.get(primary)!.push(compact);

    // Add to secondary bucket (if different)
    if (secondary) {
      if (!buckets.has(secondary)) buckets.set(secondary, []);
      buckets.get(secondary)!.push(compact);
    }

    stats.total++;
    stats[language]++;
  }

  // Sort each bucket by date (newest first)
  for (const [, videos] of buckets) {
    videos.sort((a, b) => b.p.localeCompare(a.p));
  }

  console.log(`\nCategorization complete:`);
  console.log(`  Total: ${stats.total}`);
  console.log(`  English: ${stats.english}`);
  console.log(`  Telugu: ${stats.telugu}`);
  console.log(`  Mixed: ${stats.mixed}`);
  console.log(`\nCategory distribution:`);

  for (const cat of CATEGORY_DEFINITIONS) {
    let catTotal = 0;
    for (const sub of cat.subcategories) {
      const count = buckets.get(sub.id)?.length || 0;
      catTotal += count;
      if (count > 0) {
        console.log(`  ${cat.name} > ${sub.name}: ${count} videos`);
      }
    }
    if (catTotal === 0) {
      console.log(`  ${cat.name}: 0 videos`);
    }
  }

  return buckets;
}
