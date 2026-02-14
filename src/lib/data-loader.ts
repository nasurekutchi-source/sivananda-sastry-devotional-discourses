import type { CategoriesData, CompactVideo, SubcategoryDataFile } from './types';

const videoCache = new Map<string, CompactVideo[]>();
let categoriesCache: CategoriesData | null = null;

function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

export async function loadCategories(): Promise<CategoriesData> {
  if (categoriesCache) return categoriesCache;

  const res = await fetch(`${getBasePath()}/data/processed/categories.json`);
  if (!res.ok) throw new Error('Failed to load categories');
  categoriesCache = await res.json();
  return categoriesCache!;
}

export async function loadSubcategoryVideos(subcategoryId: string): Promise<CompactVideo[]> {
  if (videoCache.has(subcategoryId)) {
    return videoCache.get(subcategoryId)!;
  }

  const res = await fetch(
    `${getBasePath()}/data/processed/videos-by-category/${subcategoryId}.json`
  );
  if (!res.ok) throw new Error(`Failed to load videos for ${subcategoryId}`);
  const data: SubcategoryDataFile = await res.json();
  videoCache.set(subcategoryId, data.videos);
  return data.videos;
}

export async function loadRecentVideos(): Promise<CompactVideo[]> {
  const res = await fetch(`${getBasePath()}/data/processed/recent.json`);
  if (!res.ok) throw new Error('Failed to load recent videos');
  const data = await res.json();
  return data.videos;
}

export async function loadAllCategoryVideos(categoryId: string, subcategoryIds: string[]): Promise<CompactVideo[]> {
  const allVideos: CompactVideo[] = [];
  for (const subId of subcategoryIds) {
    const videos = await loadSubcategoryVideos(subId);
    allVideos.push(...videos);
  }
  // Sort by date descending
  allVideos.sort((a, b) => b.p.localeCompare(a.p));
  return allVideos;
}

export function clearCache(): void {
  videoCache.clear();
  categoriesCache = null;
}
