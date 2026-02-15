export type Language = 'en' | 'te' | 'mx';

/** Compact video format used in split JSON files to minimize file size */
export interface CompactVideo {
  id: string;
  t: string;   // title
  p: string;   // publishedAt (YYYY-MM-DD)
  th: string;  // thumbnail URL
  l: Language;  // language: en=english, te=telugu, mx=mixed
  c?: string;  // category slug (only in recent.json)
  s?: string;  // subcategory slug (only in recent.json)
}

export interface Subcategory {
  id: string;
  name: string;
  videoCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  videoCount: number;
  subcategories: Subcategory[];
}

export interface CategoriesData {
  totalVideos: number;
  categories: Category[];
}

export interface SubcategoryDataFile {
  category: string;
  categoryName: string;
  subcategory: string;
  subcategoryName: string;
  videos: CompactVideo[];
}

export interface StatsData {
  totalVideos: number;
  totalCategories: number;
  totalSubcategories: number;
  languageCounts: {
    english: number;
    telugu: number;
    mixed: number;
  };
  lastUpdated: string;
}
