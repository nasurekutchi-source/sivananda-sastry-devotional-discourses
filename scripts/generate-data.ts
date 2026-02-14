/**
 * Data File Generator
 * Takes categorized videos and produces split JSON files for the website.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { CategoriesData, CompactVideo, SubcategoryDataFile, StatsData } from '../src/lib/types';
import { CATEGORY_DEFINITIONS } from '../src/lib/categories';

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'processed');
const VIDEOS_DIR = path.join(OUTPUT_DIR, 'videos-by-category');
const PUBLIC_DATA_DIR = path.join(__dirname, '..', 'public', 'data', 'processed');
const PUBLIC_VIDEOS_DIR = path.join(PUBLIC_DATA_DIR, 'videos-by-category');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate all data files from categorized video buckets.
 */
export function generateDataFiles(buckets: Map<string, CompactVideo[]>): void {
  ensureDir(OUTPUT_DIR);
  ensureDir(VIDEOS_DIR);
  ensureDir(PUBLIC_DATA_DIR);
  ensureDir(PUBLIC_VIDEOS_DIR);

  let totalVideos = 0;
  let totalEnglish = 0;
  let totalTelugu = 0;
  let totalMixed = 0;
  const allVideos: CompactVideo[] = [];

  // 1. Generate per-subcategory JSON files
  const categoriesData: CategoriesData = {
    categories: [],
    totalVideos: 0,
    lastUpdated: new Date().toISOString(),
    languageCounts: { english: 0, telugu: 0, mixed: 0 },
  };

  for (const catDef of CATEGORY_DEFINITIONS) {
    let catVideoCount = 0;
    const subcategories = [];

    for (const subDef of catDef.subcategories) {
      const videos = buckets.get(subDef.id) || [];
      catVideoCount += videos.length;

      // Count languages
      for (const v of videos) {
        if (v.l === 'english') totalEnglish++;
        else if (v.l === 'telugu') totalTelugu++;
        else totalMixed++;
      }

      // Save subcategory JSON
      const subData: SubcategoryDataFile = {
        subcategoryId: subDef.id,
        categoryId: catDef.id,
        videos,
      };

      const subFilename = `${subDef.id}.json`;
      fs.writeFileSync(
        path.join(VIDEOS_DIR, subFilename),
        JSON.stringify(subData),
        'utf-8'
      );
      // Also copy to public
      fs.writeFileSync(
        path.join(PUBLIC_VIDEOS_DIR, subFilename),
        JSON.stringify(subData),
        'utf-8'
      );

      subcategories.push({
        id: subDef.id,
        name: subDef.name,
        slug: `${catDef.id}/${subDef.id}`,
        videoCount: videos.length,
      });

      allVideos.push(...videos);
    }

    totalVideos += catVideoCount;

    categoriesData.categories.push({
      id: catDef.id,
      name: catDef.name,
      icon: catDef.icon,
      videoCount: catVideoCount,
      subcategories,
    });
  }

  categoriesData.totalVideos = totalVideos;
  categoriesData.languageCounts = {
    english: totalEnglish,
    telugu: totalTelugu,
    mixed: totalMixed,
  };

  // 2. Save categories.json
  const categoriesJson = JSON.stringify(categoriesData, null, 2);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'categories.json'), categoriesJson, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'categories.json'), categoriesJson, 'utf-8');

  // 3. Generate stats.json
  const stats: StatsData = {
    totalVideos,
    totalCategories: categoriesData.categories.length,
    totalSubcategories: categoriesData.categories.reduce(
      (sum, c) => sum + c.subcategories.length,
      0
    ),
    languageCounts: categoriesData.languageCounts,
    lastUpdated: categoriesData.lastUpdated,
    channelUrl: 'https://www.youtube.com/@sivanandasastry9364',
  };
  const statsJson = JSON.stringify(stats, null, 2);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.json'), statsJson, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'stats.json'), statsJson, 'utf-8');

  // 4. Generate recent.json (50 most recent across all categories)
  // Deduplicate by video ID first
  const uniqueVideos = new Map<string, CompactVideo>();
  for (const v of allVideos) {
    if (!uniqueVideos.has(v.id)) {
      uniqueVideos.set(v.id, v);
    }
  }
  const recentVideos = Array.from(uniqueVideos.values())
    .sort((a, b) => b.p.localeCompare(a.p))
    .slice(0, 50);
  const recentJson = JSON.stringify({ videos: recentVideos });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'recent.json'), recentJson, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'recent.json'), recentJson, 'utf-8');

  console.log(`\nData files generated:`);
  console.log(`  categories.json (${categoriesData.categories.length} categories)`);
  console.log(`  stats.json`);
  console.log(`  recent.json (${recentVideos.length} videos)`);
  console.log(`  ${buckets.size} subcategory JSON files in videos-by-category/`);
  console.log(`  Total unique videos: ${uniqueVideos.size}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  Public: ${PUBLIC_DATA_DIR}`);
}
